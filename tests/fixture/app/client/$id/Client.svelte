<script>
  import { pageProps } from '../../../../../dist';
  import AppFrame from '../../../../../AppFrameSvelte.svelte';
  import { clientLoader } from './client-id.page';

  console.log('Client being mounted', $clientLoader.data);
</script>

<div>
  <h1>Cliente</h1>
  <div>Meu id é {$pageProps.id}</div>
  <div>{$clientLoader.data}</div>
  <AppFrame id="clientChild" />
</div>
