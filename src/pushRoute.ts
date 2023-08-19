import { changeAppFrameConfig } from './router';
import { RoutesConfigImports } from './types';
import { convertQueryToURLSearchParams } from './utils';

export let pushRoute: (path: string, query?: any) => void;
export let replaceRoute: (path: string, query?: any) => void;
let onPopState: () => void;

// let startTransition = (cb: () => void) => cb();

// if (typeof (document as any).startViewTransition !== 'undefined') {
//   startTransition = (cb: () => void) =>
//     (document as any).startViewTransition(cb);
// }

//
//

export function setRoutes(routes: RoutesConfigImports): Promise<void> {
  pushRoute = function puthRoute(path: string, query?: any) {
    //

    if (query) {
      path += '?' + convertQueryToURLSearchParams(query);
    }

    // startTransition(() =>
    changeAppFrameConfig(path, routes);
    // );

    history.pushState({}, '', path);
  };

  //
  //

  replaceRoute = function replaceRoute(path: string, query?: any) {
    //

    if (query) {
      path += '?' + convertQueryToURLSearchParams(query);
    }

    // startTransition(() =>
    changeAppFrameConfig(path, routes);
    // );

    history.replaceState({}, '', path);
  };

  //
  //

  const promise = changeAppFrameConfig(location.href, routes);

  if (__DEV__ && onPopState) {
    window.removeEventListener('popstate', onPopState);
  }

  onPopState = () => {
    changeAppFrameConfig(location.href, routes);
  };

  window.addEventListener('popstate', onPopState);

  return promise;
}
