<script>
  import { pushLink, AppFrame } from '../../../dist/svelte';

  console.log('Main Layout being mounted');
</script>

<div>
  <nav>
    <div class="title">Teste Helios Router</div>
    <a href="/" class="nav-link" use:pushLink>Home</a>
    <a href="/about" class="nav-link" use:pushLink>About</a>
    <a href="/about?error=true" class="nav-link" use:pushLink
      >About with error</a
    >
    <a href="/client/1" class="nav-link" use:pushLink>Cliente 1</a>
    <a href="/client/2" class="nav-link" use:pushLink>Cliente 2</a>
    <a href="/client/" class="nav-link" use:pushLink>Cliente undefined</a>
  </nav>

  <main>
    <AppFrame id="content" />
  </main>
</div>

<style>
  nav {
    background-color: #ccc;
    padding: 0 1rem;
    height: 3rem;
    display: flex;
    align-items: center;
  }

  .title {
    /* font-size: 1.5rem; */
    font-weight: bold;
    margin-right: 1rem;
  }

  .nav-link {
    text-decoration: none;
    color: black;
    height: 100%;
    padding: 0 1rem;
    background-color: #00000000;
    display: grid;
    place-items: center;
  }

  .nav-link:hover {
    color: blue;
    background-color: #0000001f;
    text-decoration: underline;
  }

  main {
    padding: 1rem;
  }
</style>
