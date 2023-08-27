<script>
  import { onDestroy } from 'svelte';
  import { _routerExportSelector } from './dist/index';

  //
  //

  /** @type {string} */
  export let id;
  let component = null;

  //
  //

  const unsub = _routerExportSelector.subscribe((c) => {
    component = c?.[id] || null;

    if (__DEV__ && component && typeof component !== 'function')
      throw new Error(`RoutePlaceholder: component ${id} not found`);
  });

  //
  //

  onDestroy(unsub);
</script>

<svelte:component this={component} />
