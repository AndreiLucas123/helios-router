import type { AppState } from '../state-management/createAppState';
import type {
  RouteDefaultExport,
  RouterAppState,
  Routes,
} from './router-types';
import { matchRoute } from './matchRoute';

//
//

export type CreateHeliosRouterOptions<T extends RouterAppState> = {
  routes: Routes;
  appStateStore: AppState<T>;
};

//
//

export type HeliosRouter<T> = {
  /**
   * The routes config for that router
   */
  routes: Routes;

  /**
   * Store using immer to handle the app state
   */
  appStateStore: AppState<T>;

  /**
   * Given a url, load the route and update the app state
   *
   * Does not update the browser history
   */
  load(url: URL): Promise<void>;

  /**
   * The function that is called when the user clicks the back button
   * or the forward button
   */
  popState(): void;

  /**
   * history.pushState a new url to the browser history
   */
  push(url: string, query?: Record<string, string>): Promise<void>;

  /**
   * history.replaceState a new url to the browser history
   */
  replace(url: string, query?: Record<string, string>): Promise<void>;
};

//
//

/**
 * Create a Helios router instance
 */
export function createHeliosRouter<T extends RouterAppState>({
  routes,
  appStateStore,
}: CreateHeliosRouterOptions<T>): HeliosRouter<T> {
  //
  //

  let lastHref: string | null = null;

  //
  //

  async function load(url: URL) {
    if (lastHref === url.href) {
      return;
    }
    lastHref = url.href;

    const matched = matchRoute(url, routes);

    let moduleDefault!: RouteDefaultExport;

    try {
      moduleDefault = (await matched.import()).default;
    } catch (error) {
      throw error;
    }

    if (__DEV__) {
      if (!moduleDefault) {
        throw new Error(`Route ${lastHref} does not have a default export`);
      }

      if (typeof moduleDefault !== 'object') {
        throw new Error(
          `Route ${lastHref} default export is not an object. It is ${typeof moduleDefault}`,
        );
      }
    }

    //
    //

    appStateStore.produce((appState) => {
      appState.router.urlProps = matched.urlProps;
      appState.router.routeMatched = matched.routeMatched;
      appState.routeExport = moduleDefault;
    });
  }

  //
  //

  function popState() {
    load(new URL(location.href));
  }

  //
  //

  function loadForPush(url: string, query?: Record<string, string>) {
    const urlObj = new URL(url, window.location.origin);

    if (query) {
      for (let key of Object.keys(query)) {
        urlObj.searchParams.set(key, query[key]);
      }
    }

    return load(urlObj);
  }

  //
  //

  async function pushState(url: string, query?: Record<string, string>) {
    await loadForPush(url, query);

    history.pushState({}, '', url);
  }

  //
  //

  async function replaceState(url: string, query?: Record<string, string>) {
    await loadForPush(url, query);

    history.replaceState({}, '', url);
  }

  //
  //

  return {
    push: pushState,
    replace: replaceState,
    load,
    appStateStore,
    routes,
    popState,
  };
}
