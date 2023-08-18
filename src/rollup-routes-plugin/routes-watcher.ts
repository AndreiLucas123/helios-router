import type { RoutesPluginOptions } from './types';
import { writeFile } from 'node:fs/promises';
import { dollarFileMatchPattern } from './dollarFileMatchPattern';
import { relative } from 'node:path';
import { sortRoutes } from './sortRoutes';
import chokidar from 'chokidar';

//
//

export type FileWatched = {
  path: string;
  importPath: string;
  route: string;
  segments: string[];
  dev: boolean;
};

//
//

export default function routesWatcher(options?: RoutesPluginOptions): {
  start(): void;
  stop(): void;
} {
  let watcher: chokidar.FSWatcher | null = null;
  let filesWatched: FileWatched[] = [];
  let fileOutput: string | null = null;
  let timeout: any = null;

  const opts = options || {};
  opts.routesFolder = opts.routesFolder?.replace(/\\/g, '/') || 'src/app';
  opts.pagesGlob = opts.routesFolder + (opts.pagesGlob || '/**/*.page.ts');
  opts.baseUrl = opts.baseUrl || '/';
  opts.patternMatcher = opts.patternMatcher || dollarFileMatchPattern;

  opts.relative = relative(process.cwd(), opts.routesFolder!).replace(
    /\\/g,
    '/',
  );

  //
  //

  function queueOutput() {
    clearTimeout(timeout);
    timeout = setTimeout(generateOutput, 100);
  }

  //
  //

  async function generateOutput() {
    filesWatched = sortRoutes(filesWatched);

    const nonDev = filesWatched.filter((file) => !file.dev);
    const dev = filesWatched.filter((file) => file.dev);

    let output = `let routes = {`;

    for (const file of nonDev) {
      output += `\n  '${file.route}': () => import('${file.importPath}'),`;
    }

    output += `\n};`;

    if (dev.length > 0) {
      output += `\n\nif (__DEV__) {\n  routes = {`;
      for (const file of dev) {
        output += `\n    '${file.route}': () => import('${file.importPath}'),`;
      }
      output += `\n    ...routes\n  } as any;\n}`;
    }

    output += `\n\nexport default routes;\n`;

    if (output === fileOutput) {
      return;
    }

    fileOutput = output;

    await writeFile(opts.routesFolder! + '/routes.ts', output, 'utf-8');
  }

  //
  //

  function add(path: string) {
    queueOutput();

    path = path.replace(/\\/g, '/');
    const segments = opts.patternMatcher!.splitSegments!(opts, path);

    const route: FileWatched = {
      path,
      importPath: opts.patternMatcher!.fixImportPath!(opts, path),
      route: '/' + segments.join('/'),
      segments,
      dev: segments.some((segment) => segment === 'dev'),
    };

    filesWatched.push(route);
  }

  //
  //

  function remove(path: string) {
    path = path.replace(/\\/g, '/');
    filesWatched = filesWatched.filter((file) => file.path !== path);
    queueOutput();
  }

  //
  //

  return {
    start() {
      queueOutput();

      watcher = chokidar.watch(opts.pagesGlob!, {
        ignored: /(^|[\/\\])\../, // Ignorar arquivos ocultos
        persistent: true,
      });

      watcher
        .on('add', (path) => {
          add(path);
          console.log('Detected route file: ' + path);
        })
        .on('change', (path) => {
          remove(path);
          add(path);
          console.log('Changed route file: ' + path);
        })
        .on('unlink', (path) => {
          console.log('Removed route file: ' + path);
          remove(path);
        });
    },

    //
    //

    stop() {
      watcher?.close();
    },
  };
}
