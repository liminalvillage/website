<script>
  import { onMount } from 'svelte';

  // Every picture from the old village, surroundings and lunations galleries.
  // They are only 500px wide, so the carousel shows several at near-native size
  // instead of one blown up across the page.
  const photos = [
    { src: '/images/P1120415-500x99999.jpeg', caption: 'The village' },
    { src: '/images/P1120438-500x99999.jpeg', caption: 'The village' },
    { src: '/images/P1120483-500x99999.jpeg', caption: 'Life in the village' },
    { src: '/images/P1120521-500x99999.jpeg', caption: 'Co-creation spaces' },
    { src: '/images/P1120531-500x99999.jpeg', caption: 'The village grounds' },
    { src: '/images/P1120532-500x99999.jpeg', caption: 'The village grounds' },
    { src: '/images/UNADJUSTEDNONRAW_thumb_e385-500x99999.jpg', caption: 'A lunation at the village' },
    { src: '/images/UNADJUSTEDNONRAW_thumb_e685-500x99999.jpg', caption: 'A lunation at the village' },
    { src: '/images/UNADJUSTEDNONRAW_thumb_e92d-500x99999.jpg', caption: 'A lunation at the village' },
    { src: '/images/UNADJUSTEDNONRAW_thumb_eddc-500x99999.jpg', caption: 'A lunation at the village' },
    { src: '/images/UNADJUSTEDNONRAW_thumb_f439-500x99999.jpg', caption: 'A lunation at the village' },
    { src: '/images/Ascoli-Piceno-Marche-Russia-News-1-500x99999.jpg', caption: 'Ascoli Piceno' },
    { src: '/images/Castelluccio-500x99999.jpg', caption: 'Castelluccio' },
    { src: '/images/casteltrosino-500x99999.jpg', caption: 'Castel Trosino' },
    { src: '/images/Territorio-SBT-5-500x99999.jpg', caption: 'The coast nearby' },
  ];

  const facts = [
    'Private & shared rooms, caravans, tents',
    'High-speed internet everywhere',
    'Biolake & open-source water purification',
    'Permaculture garden & food machines',
    'Co-creation spaces & outdoor stage',
    'Mountains and sea 20 minutes away',
  ];

  const INTERVAL = 4500;

  let track;
  let current = $state(0);
  let paused = $state(false);
  let visible = false;

  // The slide whose left edge is nearest the track's left edge.
  function nearest() {
    const slides = track.children;
    let best = 0;
    let dist = Infinity;
    for (let i = 0; i < slides.length; i++) {
      const d = Math.abs(slides[i].offsetLeft - track.scrollLeft);
      if (d < dist) { dist = d; best = i; }
    }
    return best;
  }

  function go(i) {
    const n = photos.length;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    // Past the last slide, or nothing left to scroll: wrap to the start.
    const target = i >= n || (i > current && atEnd) ? 0 : (i + n) % n;
    track.scrollTo({ left: track.children[target].offsetLeft, behavior: 'smooth' });
  }

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => (current = nearest());
    track.addEventListener('scroll', onScroll, { passive: true });

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
    io.observe(track);

    const timer = setInterval(() => {
      if (!reduce && visible && !paused && !document.hidden) go(current + 1);
    }, INTERVAL);

    return () => {
      clearInterval(timer);
      io.disconnect();
      track.removeEventListener('scroll', onScroll);
    };
  });
</script>

<section id="village" class="section alt">
  <div class="wrap">
    <div class="head">
      <div>
        <p class="eyebrow">The village</p>
        <h2 class="display">On the soft hills of the Tronto Valley</h2>
      </div>
      <p class="lead">
        Panoramic views over the hills and the mountains, in the Marche region, halfway between
        the mountains and the Adriatic sea. There is plenty to explore around us, and we are happy to show you.
      </p>
    </div>

    <ul class="facts">
      {#each facts as f}<li>{f}</li>{/each}
    </ul>
  </div>

  <div
    class="show"
    role="region"
    aria-roledescription="carousel"
    aria-label="Photos of the village, its lunations and surroundings"
    onmouseenter={() => (paused = true)}
    onmouseleave={() => (paused = false)}
    onfocusin={() => (paused = true)}
    onfocusout={() => (paused = false)}
    ontouchstart={() => (paused = true)}
  >
    <ul class="track" bind:this={track}>
      {#each photos as p, i}
        <li aria-roledescription="slide" aria-label="{i + 1} of {photos.length}: {p.caption}">
          <img src={p.src} alt={p.caption} loading={i < 4 ? 'eager' : 'lazy'} draggable="false" />
          <span class="cap">{p.caption}</span>
        </li>
      {/each}
    </ul>

    <div class="wrap controls">
      <div class="dots" aria-hidden="true">
        {#each photos as _, i}<span class:on={i === current}></span>{/each}
      </div>
      <span class="count">{current + 1} / {photos.length}</span>
      <div class="arrows">
        <button type="button" aria-label="Previous photo" onclick={() => go(current - 1)}>←</button>
        <button type="button" aria-label="Next photo" onclick={() => go(current + 1)}>→</button>
      </div>
    </div>
  </div>
</section>

<style>
  .head { display: grid; grid-template-columns: 5fr 7fr; gap: 48px; align-items: end; }

  .facts {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 40px 0 40px;
  }
  .facts li {
    padding: 8px 16px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--paper);
    font-size: 14px;
    color: var(--text);
  }

  /* Full-bleed strip, first slide aligned with the page content */
  .track {
    --inset: max(24px, calc((100vw - 1160px) / 2 + 24px));
    list-style: none;
    display: flex;
    gap: 14px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-left: var(--inset);
    padding: 0 var(--inset);
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .track::-webkit-scrollbar { display: none; }
  .track li {
    position: relative;
    flex: 0 0 auto;
    width: 512px;
    height: 320px;
    scroll-snap-align: start;
    border-radius: 16px;
    overflow: hidden;
    background: var(--gold-soft);
  }
  .track img { width: 100%; height: 100%; object-fit: cover; user-select: none; }
  .cap {
    position: absolute;
    left: 12px;
    bottom: 12px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(20, 18, 15, 0.6);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    color: #fff;
    font-size: 12px;
    letter-spacing: 0.3px;
  }

  .controls { display: flex; align-items: center; gap: 16px; margin-top: 20px; }
  .dots { display: flex; gap: 6px; flex-wrap: wrap; }
  .dots span { width: 6px; height: 6px; border-radius: 999px; background: var(--line); transition: width 0.3s var(--ease), background 0.3s; }
  .dots span.on { width: 22px; background: var(--gold); }
  .count { font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; }
  .arrows { margin-left: auto; display: flex; gap: 8px; }
  .arrows button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid var(--line);
    background: var(--card);
    color: var(--ink);
    font-size: 18px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .arrows button:hover { border-color: var(--gold); color: var(--gold-dark); }

  @media (max-width: 860px) {
    .head { grid-template-columns: 1fr; gap: 16px; }
    .track { --inset: 16px; gap: 10px; }
    .track li { width: min(82vw, 352px); height: 220px; }
    .dots { display: none; }
  }
</style>
