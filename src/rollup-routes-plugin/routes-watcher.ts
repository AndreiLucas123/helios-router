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

    let output = `let routes = {`;

    for (const file of filesWatched) {
      output += `
  '${file.route}': () => import('${file.importPath}'),`;
    }

    output += `
};

export default routes;
`;

    if (output === fileOutput) {
      return;
    }

    fileOutput = output;

    await writeFile(opts.routesFolder! + '/routes.ts', output, 'utf-8');
    console.log('routes-plugin: successfully generated routes.ts');
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
    };

    filesWatched.push(route);
  }

  //
  //

  function remove(path: string) {
    filesWatched = filesWatched.filter((file) => file.path !== path);
    queueOutput();
  }

  //
  //

  return {
    start() {
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
