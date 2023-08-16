<script>
  import { pageProps } from '../../../../../dist';
  import { AppFrame } from '../../../../../dist/svelte';
  import { clientLoader } from './page';

  console.log('Client being mounted', $clientLoader.data);
</script>

<div>
  <h1>Cliente</h1>
  <div>Meu id é {$pageProps.id}</div>
  <div>{$clientLoader.data}</div>
  <AppFrame id="clientChild" />
</div>
