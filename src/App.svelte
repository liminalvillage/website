<script>
  import Navbar from './lib/Navbar.svelte';
  import Hero from './lib/Hero.svelte';
  import About from './lib/About.svelte';
  import FourQuadrants from './lib/FourQuadrants.svelte';
  import Network from './lib/Network.svelte';
  import Village from './lib/Village.svelte';
  import Lunations from './lib/Lunations.svelte';
  import Contact from './lib/Contact.svelte';
  import Footer from './lib/Footer.svelte';

  // Structured data pointing crawlers and AI assistants at /media and the docs
  const ld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Liminal Village',
    alternateName: 'Liminal Village — Learning Centre for a Regenerative Eco-Civilization',
    url: 'https://liminalvillage.com/',
    description: 'A learning centre in central Italy. Participants sign up for a lunar-cycle learning experience and learn, by living them, the thoughtware (Integral Theory, NVC, Holacracy, Permaculture…) and the open-source software (Holons, Holosphere, RegenOS) that connect the four quadrants of a regenerative eco-civilization.',
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

<main>
  <Navbar />
  <Hero />
  <About />
  <FourQuadrants />
  <Village />
  <Lunations />
  <Network />
  <Contact />
  <Footer />
</main>

<style>
  main {
    width: 100%;
  }
</style>
