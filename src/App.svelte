<script>
  import Navbar from './lib/Navbar.svelte';
  import Hero from './lib/Hero.svelte';
  import About from './lib/About.svelte';
  import ThreePillars from './lib/ThreePillars.svelte';
  import Network from './lib/Network.svelte';
  import Village from './lib/Village.svelte';
  import Lunations from './lib/Lunations.svelte';
  import Contact from './lib/Contact.svelte';
  import Footer from './lib/Footer.svelte';
  import MoonPath from './lib/MoonPath.svelte';
  import Terminal from './lib/Terminal.svelte';
  import Intro from './lib/Intro.svelte';
  import VideoBackdrop from './lib/VideoBackdrop.svelte';
  import Journey from './journey/Journey.svelte';
  import { onMount } from 'svelte';
  import { reveal } from './lib/reveal.js';

  // The home page is the zoom journey over the village video. The earlier
  // scrolling page stays reachable at /?classic while the journey matures.
  const classic = new URLSearchParams(location.search).has('classic');

  // Elements fade and rise into place as they scroll in (scrolling page)
  onMount(() => {
    if (classic) reveal();
  });

  // Structured data pointing crawlers and AI assistants at /media and the docs
  const ld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Liminal Village',
    alternateName: 'Liminal Village — Open Source Innovation Eco-Tech Hub',
    url: 'https://liminalvillage.com/',
    description: 'A co-living and co-creation eco-tech hub and intentional community in central Italy, inspired by the Resource-Based Economy and Game B, organised around lunar cycles.',
    address: { '@type': 'PostalAddress', addressRegion: 'Ascoli Piceno, Marche', addressCountry: 'IT' },
    memberOf: { '@type': 'Organization', name: 'ReGenerativa', url: 'https://regenerativa.earth/' },
    sameAs: ['https://docs.liminalvillage.com/'],
    subjectOf: [
      { '@type': 'WebSite', name: 'Liminal Village Documentation', url: 'https://docs.liminalvillage.com/' },
      { '@type': 'CollectionPage', name: 'Readings & Media', url: 'https://liminalvillage.com/media' },
      { '@type': 'AboutPage', name: 'Our DNA', url: 'https://liminalvillage.com/dna' },
      { '@type': 'CollectionPage', name: 'Frameworks', url: 'https://liminalvillage.com/frameworks' },
    ],
  });
</script>

<svelte:head>
  <link rel="canonical" href="https://liminalvillage.com/" />
  <link rel="help" href="https://docs.liminalvillage.com/" />
  <link rel="alternate" type="text/plain" href="https://liminalvillage.com/llms.txt" title="llms.txt — overview for AI assistants" />
  {@html `<script type="application/ld+json">${ld}</script>`}
</svelte:head>

{#if !classic}
  <Navbar />
  <Terminal />
  <VideoBackdrop />
  <Intro />
  <MoonPath />
  <Journey />
{:else}
<main>
  <Navbar />
  <Hero />
  <MoonPath />
  <div class="curtain">
  <About />
  <ThreePillars />
  <Village />
  <Lunations />
  <Network />
  <Contact />
  <Footer />
  </div>
</main>
{/if}

<style>
  main {
    width: 100%;
  }

  /* Everything after the hero scrolls straight up over the fixed video. The
     video dims as you scroll (Hero.svelte), and colours inside switch to
     light-on-dark so the text reads over it. */
  .curtain {
    position: relative;
    z-index: 2;
    --ink: #fbf6ee;
    --ink-soft: #efe8dc;
    --muted: rgba(251, 246, 238, 0.72);
    --line: rgba(255, 255, 255, 0.18);
    --paper: transparent;
    --surface: transparent;
    --card-bg: rgba(255, 255, 255, 0.08);
    --card-border: rgba(255, 255, 255, 0.14);
    --accent: var(--glow-accent, var(--rust-300, #f2c1ae));
    --accent-deep: var(--glow-accent-deep, var(--rust-200, #fbded2));
    --accent-soft: var(--glow-accent-soft, var(--ember-200, #ffd7ba));
    --on-accent: #1e1612;
    --bar-solid: rgba(24, 19, 15, 0.92);
    --tint-1: var(--glow-1, rgba(255, 176, 120, 0.2));
    --tint-2: var(--glow-2, rgba(255, 150, 130, 0.18));
    --tint-3: var(--glow-3, rgba(255, 240, 220, 0.14));
    --tint-4: var(--glow-4, rgba(225, 170, 130, 0.18));
    --orb-blend: screen;
    --moon-shadow: rgba(255, 255, 255, 0.14);
    color: var(--ink);
    text-shadow: 0 1px 14px rgba(0, 0, 0, 0.35);
  }
</style>
