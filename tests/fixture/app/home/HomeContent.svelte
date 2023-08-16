<script>
  import { renderSolid } from './SolidChild';

  console.log('HomeContent.svelte: before onMount');
  setTimeout(() => {
    console.log('HomeContent.svelte: onMount');
    renderSolid(document.getElementById('solid-div'));
  }, 50);
</script>

<p>Home Content</p>

<div id="solid-div" />
