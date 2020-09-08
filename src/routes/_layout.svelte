<style>
  main {
    position: relative;
    max-width: 56em;
    padding: 1em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  :global(.center) {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>

<Nav {segment}/>

<main>
  <slot />
</main>

<script>
  import Nav from '../components/Nav.svelte';

  export let segment;
</script>
