import { basename } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { dollarFileMatchPattern } from './dollarFileMatchPattern';
import chokidar from 'chokidar';

//
//

export type RoutesPluginOptions = {
  /**
   * Diretório onde estão os arquivos de rotas.
   * @default 'src/app/\**\/*.page.ts'
   */
  pagesGlob?: string;
  /**
   * Arquivo de saída.
   * @default 'src/routes.ts'
   */
  outputFile?: string;
  /**
   * Função necessária para remover a extensão do arquivo da rota
   * @default (basename) => name.replace(/\.page.ts$/, '')
   */
  normalize?: (basename: string) => string;
  /**
   * Base URL para as rotas
   * @default '/'
   */
  baseUrl?: string;
  /**
   * Convert file name to route
   *
   * @example
   * from `src/app/home/home.page.ts` to `/home`
   * or from `src/app/$id/client.page.ts` to `/:id`
   */
  fileMatchPattern?: (baseUrl: string, file: string) => string;
};

//
//

type FileWatched = {
  name: string;
  path: string;
  route: string;
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
  opts.pagesGlob = opts.pagesGlob || 'src/app/**/*.page.ts';
  opts.outputFile = opts.outputFile || 'src/routes.ts';
  opts.normalize =
    opts.normalize ||
    ((name) => name.replace(/\\/g, '/').replace(/\/\w+\.page.ts$/, ''));
  opts.baseUrl = opts.baseUrl || '/';
  opts.fileMatchPattern = opts.fileMatchPattern || dollarFileMatchPattern;

  //
  //

  function queueOutput() {
    clearTimeout(timeout);
    timeout = setTimeout(generateOutput, 100);
  }

  //
  //

  function descSort() {
    filesWatched = filesWatched.sort((a, b) => {
      const aRoute = a.route;
      const bRoute = b.route;
      if (aRoute < bRoute) return 1;
      if (aRoute > bRoute) return -1;
      return 0;
    });
  }

  //
  //

  async function generateOutput() {
    descSort();

    let output = `import type { RoutesConfigImports } from 'helios-router';

let routes: RoutesConfigImports = {`;

    for (const file of filesWatched) {
      output += `
  '${file.route}': () => import('${file.path}'),`;
    }

    output += `
};

export default routes;
`;

    if (output === fileOutput) {
      return;
    }

    fileOutput = output;

    await writeFile(opts.outputFile!, output, 'utf-8');
    console.log('routes-plugin: successfully generated routes.ts');
  }

  //
  //

  async function add(path: string) {
    const _basename = basename(path);

    queueOutput();

    filesWatched.push({
      name: opts.normalize!(_basename),
      path,
      route: opts.fileMatchPattern!(opts.baseUrl!, opts.normalize!(path)),
    });
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
        .on('add', add)
        .on('change', (path) => {
          remove(path);
          add(path);
        })
        .on('unlink', remove);
    },

    //
    //

    stop() {
      watcher?.close();
    },
  };
}
