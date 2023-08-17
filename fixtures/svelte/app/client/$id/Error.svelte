<script>
  export let loaderValue = null;

  $: {
    console.warn('CLIENT error being mounted', loaderValue);
    console.error(loaderValue.error);
  }
</script>

<div>
  <div>CLIENT SOME ERROR...</div>
  <div>
    <pre>{JSON.stringify(loaderValue)}</pre>
  </div>
</div>
