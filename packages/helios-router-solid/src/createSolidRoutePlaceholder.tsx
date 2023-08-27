import type { JSX } from 'solid-js';
import { type AppStateStore, selector, RouterAppState } from 'helios-router';
import { Dynamic } from 'solid-js/web';
import { createSignal, onCleanup } from 'solid-js';

//
//

export type RoutePlaceholderSolidProps = {
  id: string;
};

//
//

export function createSolidRoutePlaceholder<T extends RouterAppState>(
  appStateStore: AppStateStore<T>,
): (props: RoutePlaceholderSolidProps) => JSX.Element {
  const routesExportSelector = selector(appStateStore, (s) => s.routeExport);

  //
  //

  return function RoutePlaceholder({ id }: RoutePlaceholderSolidProps) {
    if (__DEV__) {
      if (typeof id !== 'string') {
        throw new Error('RoutePlaceholderSolid: id must be a string');
      }
    }

    const [value, setValue] = createSignal<any>(null);

    const unsubscribe = routesExportSelector.subscribe((routeExport) => {
      const value = routeExport?.[id] || null;

      if (__DEV__) {
        if (!value) {
          console.warn(
            `RoutePlaceholderSolid: id "${id}" not found in routeExport`,
          );
        }

        if (value && typeof value !== 'function') {
          console.warn(
            `RoutePlaceholderSolid: id "${id}" in routeExport must be a function`,
          );
        }
      }

      // must be `() => value` and not directly to avoid being called with `setState((prev) => prev))`
      setValue(() => value);
    });

    onCleanup(unsubscribe);

    return <Dynamic component={value()} />;
  };
}
