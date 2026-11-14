<script>
  import { onMount } from 'svelte';
  import { initMotion, goTo } from '../rigenerativa/motion.js';
  import Navbar from './Navbar.svelte';
  import Hero from './Hero.svelte';
  import About from './About.svelte';
  import Events from './Events.svelte';
  import Integral from './Integral.svelte';
  import Spaces from './Spaces.svelte';
  import Economy from './Economy.svelte';
  import Flywheel from './Flywheel.svelte';
  import Mycelium from './Mycelium.svelte';
  import Agreements from './Agreements.svelte';
  import Join from './Join.svelte';
  import Footer from './Footer.svelte';

  let root;

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
  <About />
  <Events />
  <Integral />
  <Spaces />
  <Economy />
  <Flywheel />
  <Mycelium />
  <Agreements />
  <Join />
  <Footer />
</main>
