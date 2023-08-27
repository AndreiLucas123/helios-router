<script>
  import { onDestroy } from 'svelte';
  import { routeAppFrameConfig } from './dist';

  //
  //

  /** @type {string} */
  export let id;
  let component = null;

  //
  //

  const unsub = routeAppFrameConfig.subscribe((c) => {
    component = c?.[id] || null;

    if (__DEV__ && component && typeof component !== 'function')
      throw new Error(`AppFrameSvelte: component ${id} not found`);
  });

  //
  //

  onDestroy(unsub);
</script>

<svelte:component this={component} />
