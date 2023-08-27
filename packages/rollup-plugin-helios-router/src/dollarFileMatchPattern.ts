import type { RouterMatchPattern, RoutesPluginOptions } from './types';

//
//

export const dollarFileMatchPattern: RouterMatchPattern = {
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
  fixImportPath(opts: RoutesPluginOptions, path: string) {
    return path.replace(opts.relative!, '.').replace(/\.ts$/, '');
  },

  /**
   * Convert file name to routes segments
   *
   * @example
   * // dollarFileMatchPattern exemple:
   * from `src/app/home/home.page.ts` to `['/home']`
   * or from `src/app/$id/client.page.ts` to `[':id']`
   */
  splitSegments(opts: RoutesPluginOptions, path: string): string[] {
    let route = opts.baseUrl! + path.replace(opts.relative!, '');

    let routes = route.split('/').filter((v) => v !== '');

    // Remove the last element
    routes.pop();

    let segment;
    for (let i = 0; i < routes.length; i++) {
      segment = routes[i];
      if (segment.startsWith('$')) {
        if (segment === '$slug') {
          routes[i] = '*';

          // Remove all elements after this
          routes.splice(i + 1);
          continue;
        }
        routes[i] = ':' + segment.slice(1);
      }
    }

    return routes;
  },
};
