<main>
  {#if segment}
    <h1>{segment}</h1>
  {/if}
  <slot />
</main>

<script>
  import './_app.scss';
  export let segment;
</script>

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
