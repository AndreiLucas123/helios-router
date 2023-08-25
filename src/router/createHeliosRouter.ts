import type { AppState } from '../state-management/appState';
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
  appState: AppState<T>;
  hydrating?: boolean;
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
  appState: AppState<T>;

  /**
   * Given a url, load the route and update the app state
   *
   * Does not update the browser history
   */
  load: (url: URL) => Promise<void>;

  /**
   * The function that is called when the user clicks the back button
   * or the forward button
   */
  popState: () => void;
};

//
//

/**
 * Create a Helios router instance
 */
export function createHeliosRouter<T extends RouterAppState>({
  routes,
  appState,
  hydrating = false,
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
    // Change the appState without emmitting yet
    appState.produce((appStateValue) => {
      appStateValue.router.urlProps = matched.urlProps;
      appStateValue.router.routeMatched = matched.routeMatched;
      appStateValue.router.routeExport = moduleDefault;
    }, false);

    if (hydrating) {
      hydrating = false;
      appState.emit();
      return;
    }

    await _runLoaders(moduleDefault);

    //
    // Emit the appState values after the loaders
    appState.emit();
  }

  //
  //

  async function _runLoaders(moduleDefault: RouteDefaultExport) {
    const appFrameIds = Object.keys(moduleDefault);

    //
    //

    if (__DEV__) {
      if (appFrameIds.length === 0) {
        throw new Error(
          `Route ${lastHref} does not have any appFrameId in the default export`,
        );
      }
    }

    //
    //

    let promises: Promise<any>[] = [];

    for (const id of appFrameIds) {
      const routePart = moduleDefault[id];

      if (typeof routePart === 'object') {
        if (__DEV__) {
          if (routePart === null) {
            throw new Error(
              `Route ${lastHref} default export has a null value for appFrameId ${id}`,
            );
          }

          if (!routePart.loader) {
            throw new Error(
              `Route ${lastHref} default export has no loader for appFrameId ${id}`,
            );
          }

          if (!routePart.component) {
            throw new Error(
              `Route ${lastHref} default export has no component for appFrameId ${id}`,
            );
          }
        }

        promises.push(
          routePart
            .loader(appState)
            .catch((error) =>
              console.error(
                `Uncatched error in route ${lastHref} loader for appFrameId ${id}`,
                error,
              ),
            ),
        );
      }

      if (__DEV__ && typeof routePart !== 'function') {
        throw new Error(
          `Route ${lastHref} default export has a non-function neither a object value for appFrameId ${id}`,
        );
      }
    }

    await Promise.allSettled(promises);
  }

  //
  //

  function popState() {
    load(new URL(location.href));
  }

  //
  //

  return {
    routes,
    appState,
    load,
    popState,
  };
}
