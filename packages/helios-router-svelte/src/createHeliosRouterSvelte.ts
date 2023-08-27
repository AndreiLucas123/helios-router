import {
  selector,
  type HeliosRouter,
  RouterAppState,
  Selector,
} from 'helios-router';

//
//

export let _router: HeliosRouter<any>;
export let _routerExportSelector: Selector<RouterAppState['routeExport'], any>;

//
//

export function createHeliosRouterSvelte<T extends RouterAppState>(
  router: HeliosRouter<T>,
): {
  activeLink: (node: HTMLElement) => { destroy: () => void };
  pushLink: (node: HTMLElement) => { destroy(): void };
  replaceLink: (node: HTMLElement) => { destroy(): void };
} {
  _router = router;

  const routerSelector = selector(
    router.appStateStore,
    (state) => state.router,
  );

  _routerExportSelector = selector(
    router.appStateStore,
    (state) => state.routeExport,
  );

  //
  //

  function activeLink(node: HTMLElement) {
    if (!node.hasAttribute('href')) {
      throw new Error('activeLink must have an href attribute');
    }

    const unsub = routerSelector.subscribe((routerState) => {
      if (routerState) {
        if (routerState === node.getAttribute('href')) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      }
    });

    //
    return {
      destroy: unsub,
    };
  }

  //
  //

  function changeLink(node: HTMLElement, method: 'push' | 'replace') {
    if (__DEV__ && !node.hasAttribute('href')) {
      throw new Error('pushLink must have an href attribute');
    }

    function listener(e: Event) {
      e.preventDefault();
      router[method](node.getAttribute('href')!);
    }

    node.addEventListener('click', listener);

    //
    return {
      destroy() {
        node.removeEventListener('click', listener);
      },
    };
  }

  //
  //

  function pushLink(node: HTMLElement) {
    return changeLink(node, 'push');
  }

  //
  //

  function replaceLink(node: HTMLElement) {
    return changeLink(node, 'replace');
  }

  //
  //

  return {
    activeLink,
    pushLink,
    replaceLink,
  };
}
