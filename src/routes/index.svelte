<svelte:head>
  <title>Svelte Sapper Material UI</title>
</svelte:head>

<center>
  <ThemeButton />

  <div>
    <Button variant='unelevated'>
      <Label>Click</Label>
    </Button>
  </div>
</center>

<script>
  import Button, { Label } from '@smui/button';
  import ThemeButton from '../components/ThemeButton.svelte';
</script>
