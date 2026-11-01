<script>
  import { onMount } from 'svelte';
  import { initMotion, goTo } from './motion.js';
  import Navbar from './Navbar.svelte';
  import Hero from './Hero.svelte';
  import ChiSiamo from './ChiSiamo.svelte';
  import Percorso from './Percorso.svelte';
  import Attivita from './Attivita.svelte';
  import Rete from './Rete.svelte';
  import Rigeneratori from './Rigeneratori.svelte';
  import Contatti from './Contatti.svelte';
  import Footer from './Footer.svelte';

  let root;

  // Children mount first, so their pinned sections exist before the reveals measure.
  // Links from the sector subdomains arrive with a #section the browser could not
  // find before mount; scroll there once the layout settles.
  onMount(() => {
    const stop = initMotion(root);
    const hash = location.hash;
    let timer;
    if (hash.length > 1 && document.querySelector(hash)) timer = setTimeout(() => goTo(hash), 400);
    return () => {
      clearTimeout(timer);
      stop();
    };
  });
</script>

<main bind:this={root}>
  <Navbar />
  <Hero />
  <ChiSiamo />
  <Percorso />
  <Attivita />
  <Rete />
  <Rigeneratori />
  <Contatti />
  <Footer />
</main>

<style>
  main {
    width: 100%;
  }
</style>
