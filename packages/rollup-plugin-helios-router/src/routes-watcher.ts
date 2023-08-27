import type { RoutesPluginOptions } from './types';
import { writeFile, readFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { dollarFileMatchPattern } from './dollarFileMatchPattern';
import { sortRoutes } from './sortRoutes';
import { consoleLogger } from './logger';
import chokidar from 'chokidar';
import { detectConflicts } from './detectConflicts';

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

export default function routesWatcher(
  options: RoutesPluginOptions = {},
  logger = consoleLogger,
): {
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
    detectConflicts(filesWatched, logger);

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
      output += `\n    ...routes,\n  } as any;\n}`;
    }

    output += `\n\nexport default routes;\n`;

    if (output === fileOutput) {
      return;
    }

    fileOutput = output;

    const filePath = opts.routesFolder! + '/routes.ts';

    const fileContent = await readFile(filePath, 'utf-8');

    if (fileContent === output) {
      return;
    }

    await writeFile(filePath, output, 'utf-8');
  }

  //
  //

  function add(path: string) {
    queueOutput();

    const segments = opts.patternMatcher!.splitSegments!(opts, path);

    const route: FileWatched = {
      path,
      importPath: opts.patternMatcher!.fixImportPath!(opts, path),
      route: '/' + segments.join('/'),
      segments,
      dev: segments.some((segment) => segment === 'dev'),
    };

    filesWatched.push(route);

    return route;
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
      queueOutput();

      watcher = chokidar.watch(opts.pagesGlob!, {
        ignored: /(^|[\/\\])\../, // Ignorar arquivos ocultos
        persistent: true,
      });

      let padding = 0;

      watcher
        .on('add', (path) => {
          path = path.replace(/\\/g, '/');
          const route = add(path);

          padding = Math.max(padding, route.route.length);

          let repeat = padding - route.route.length + 1;
          if (repeat > 50) repeat = 50;

          logger.info(
            `route ${route.route}${' '.repeat(repeat)} -> ${route.path}`,
          );
        })
        .on('change', (path) => {
          path = path.replace(/\\/g, '/');
          remove(path);
          add(path);
          logger.info('Changed route file: ' + path);
        })
        .on('unlink', (path) => {
          path = path.replace(/\\/g, '/');
          remove(path);
          logger.info('Removed route file: ' + path);
        });
    },

    //
    //

    stop() {
      clearTimeout(timeout);
      watcher?.close();
    },
  };
}
