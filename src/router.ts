import { Subscribable } from './state-management/Subscribable';
import { RouteConfig, RoutesConfigImports } from './types';
import { shallowObjectComparison } from './utils';

//
//

export const pageProps = new Subscribable<Record<string, string>>(null as any);

//
//

export const pageMatched = new Subscribable<string | null>(null);

//
//

export const routeAppFrameConfig = new Subscribable<RouteConfig | null>(null);

//
//

let lastHref: string | null = null;

//
//

export async function changeAppFrameConfig(
  href: string,
  config: RoutesConfigImports,
  rootPath = '',
) {
  if (lastHref === rootPath + href) {
    return;
  }
  lastHref = rootPath + href;

  //
  const pagePropsAndConfig = getPageProps(href, config, rootPath);

  if (!pagePropsAndConfig) {
    throw new Error('Route not found');
  }

  let module: { default: RouteConfig } = null as any;

  try {
    module = await pagePropsAndConfig.config();
  } catch (error) {
    if (!__DEV__) {
      alert('Error loading dynamic route');
    }
    throw error;
  }

  //
  // If the props are different, update them
  if (!shallowObjectComparison(pageProps.get(), pagePropsAndConfig.props)) {
    pageProps.set(pagePropsAndConfig.props);
  }

  pageMatched.set(pagePropsAndConfig.matched);

  //
  //

  routeAppFrameConfig.set(module.default);
}

//
//

function getPageProps(
  href: string,
  config: RoutesConfigImports,
  rootPath = '',
) {
  const url = new URL(href, 'http://localhost' + rootPath);

  const segments = url.pathname.split('/').filter((p) => p !== '');

  const query = Object.fromEntries(url.searchParams);

  for (let pattern of Object.keys(config)) {
    if (rootPath) {
      pattern = rootPath + pattern;
    }

    const patternSegments = pattern.split('/').filter((p) => p !== '');

    const params = matchSegments(patternSegments, segments);

    if (params) {
      return {
        config: config[pattern],
        matched: pattern,
        props: {
          ...query,
          ...params,
        },
      };
    }
  }
}

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
