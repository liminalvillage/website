<script>
  import { onMount } from 'svelte';
  import { initMotion } from './motion.js';
  import Navbar from './Navbar.svelte';
  import Hero from './Hero.svelte';
  import ChiSiamo from './ChiSiamo.svelte';
  import Percorso from './Percorso.svelte';
  import Attivita from './Attivita.svelte';
  import Rete from './Rete.svelte';
  import Contatti from './Contatti.svelte';
  import Footer from './Footer.svelte';

  let root;

  // Children mount first, so their pinned sections exist before the reveals measure.
  onMount(() => initMotion(root));
</script>

<main bind:this={root}>
  <Navbar />
  <Hero />
  <ChiSiamo />
  <Percorso />
  <Attivita />
  <Rete />
  <Contatti />
  <Footer />
</main>

<style>
  main {
    width: 100%;
  }
</style>
