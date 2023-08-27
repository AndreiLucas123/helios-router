//
//

export type RoutesPluginOptions = {
  /**
   * Diretório onde estão os arquivos de rotas.
   * @default '/**\/*.page.ts'
   */
  pagesGlob?: string;
  /**
   * Diretório onde estão os arquivos de rotas.
   * @default 'src/app'
   */
  routesFolder?: string;
  /**
   * Base URL para as rotas
   * @default '/'
   */
  baseUrl?: string;
  /**
   * Diretório base para as rotas, usado para remover o caminho absoluto do arquivo.
   */
  relative?: string;
  /**
   * O objeto usado para fazer o match do arquivo com a rota.
   */
  patternMatcher?: RouterMatchPattern;
};

//
//

export type RouterMatchPattern = {
  /**
   * Convert file name to route
   *
   * @example
   * from `src/app/home/home.page.ts` to `/home`
   * or from `src/app/$id/client.page.ts` to `/:id`
   */
  patternFromSegments?: (opts: RoutesPluginOptions, path: string[]) => string;
  /**
   * Convert file path to its import
   * The code
   * ```ts
   * path
   *  .replace(opts.relative!, '.')
   *  .replace(/\.ts$/, '');
   *```
   *
   * @example
   * from `src/app/home/home.page.ts` to `./home/home.page`
   */
  fixImportPath?: (opts: RoutesPluginOptions, path: string) => string;
  /**
   * Convert file name to routes segments
   *
   * @example
   * // dollarFileMatchPattern exemple:
   * from `src/app/home/home.page.ts` to `['/home']`
   * or from `src/app/$id/client.page.ts` to `[':id']`
   */
  splitSegments?: (opts: RoutesPluginOptions, path: string) => string[];
};
