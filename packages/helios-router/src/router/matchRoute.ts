import { Routes } from './router-types';

//
//

/**
 * Match a route and return the urlProps and the config
 */
export function matchRoute(url: URL, routes: Routes) {
  const segments = url.pathname.split('/').filter((p) => p !== '');

  const query = Object.fromEntries(url.searchParams);

  for (let pattern of Object.keys(routes)) {
    const patternSegments = pattern.split('/').filter((p) => p !== '');

    const params = matchSegments(patternSegments, segments);

    if (params) {
      return {
        import: routes[pattern],
        routeMatched: pattern,
        urlProps: {
          ...query,
          ...params,
        },
      };
    }
  }

  const notFound = routes['/*'];

  if (__DEV__ && !notFound) {
    throw new Error('There are no /* (Not Found) route registered on routes');
  }

  return {
    import: notFound,
    routeMatched: '/*',
    urlProps: query,
  };

  //
  //

  /**
   * Check if a segmented pattern maches with the actual segments
   * @returns Returns the `params` if true, if false returns null
   */
  function matchSegments(
    pattern: string[],
    segments: string[],
  ): Record<string, string> | false {
    //  Gets the bigger length between segments and pattern
    const length = Math.max(segments.length, pattern.length);
    const params: Record<string, string> = {};

    //
    for (let i = 0; i < length; i++) {
      //
      //  When the pattern is a whitecard, just ignores the rest
      //  and returns what was found
      if (pattern[i] === '*') {
        return params;
      }

      //
      //  If is a param variable
      if (pattern[i] && segments[i] && pattern[i].startsWith(':')) {
        params[pattern[i].substring(1)] = segments[i];
        continue;
      }

      // Is not the same
      if (pattern[i] !== segments[i]) {
        return false;
      }
    }

    return params;
  }
}
