<script>
  export let loaderValue = null;

  $: {
    console.warn('Error being mounted', loaderValue);
    console.error(loaderValue.error);
  }
</script>

<div>
  <div>SOME ERROR...</div>
  <div>
    <pre>{JSON.stringify(loaderValue)}</pre>
  </div>
</div>
