<script>
  import { clientChildLoader } from './client-id.page';

  console.log('Client being mounted', $clientChildLoader.data);

</script>

<div>
  <h1>I Cliente Child</h1>
  <div>{$clientChildLoader.data}</div>
</div>
