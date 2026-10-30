<script>
  // /memories: moments from life at the village, photos and videos together
  // in one flowing wall. Each memory fades up as it scrolls into view; opening
  // one shows it large (videos play there, only when asked), with arrows and
  // the arrow keys to move through them.
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  const PHOTOS = [
    { src: '/images/droneview.jpg', w: 1280, h: 734, alt: 'The village from above' },
    { src: '/images/459051a7-8be2-439d-898d-10828f336e1d-500x99999.jpeg', w: 500, h: 375 },
    { src: '/images/IMG_7366-500x99999.jpg', w: 500, h: 375 },
    { src: '/images/IMG_7387-99999x500.jpeg', w: 396, h: 500 },
    { src: '/images/IMG_7402-500x99999.jpeg', w: 500, h: 162 },
    { src: '/images/P1120415-500x99999.jpeg', w: 500, h: 281 },
    { src: '/images/P1120438-500x99999.jpeg', w: 500, h: 281 },
    { src: '/images/P1120483-500x99999.jpeg', w: 500, h: 281 },
    { src: '/images/P1120521-500x99999.jpeg', w: 500, h: 281 },
    { src: '/images/P1120531-500x99999.jpeg', w: 500, h: 281 },
    { src: '/images/P1120532-500x99999.jpeg', w: 500, h: 281 },
    { src: '/images/P1120742-500x99999.jpeg', w: 500, h: 281 },
    { src: '/images/P1130028-500x99999.jpg', w: 500, h: 375 },
    { src: '/images/P1130157-500x99999.jpeg', w: 500, h: 375 },
    { src: '/images/P1130254-500x99999.jpg', w: 500, h: 375 },
    { src: '/images/P1130586-500x99999.jpeg', w: 500, h: 362 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_e385-500x99999.jpg', w: 500, h: 375 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_e685-500x99999.jpg', w: 500, h: 375 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_e92d-500x99999.jpg', w: 500, h: 375 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_eddc-500x99999.jpg', w: 500, h: 334 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_eddd-500x99999.jpg', w: 500, h: 334 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_f3d1-500x99999.jpg', w: 500, h: 281 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_f3e8-500x99999.jpg', w: 500, h: 281 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_f439-500x99999.jpg', w: 500, h: 281 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_f43c-500x99999.jpg', w: 500, h: 281 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_f441-500x99999.jpg', w: 500, h: 281 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_f442-500x99999.jpg', w: 500, h: 281 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_f444-500x99999.jpg', w: 500, h: 281 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_f44b-500x99999.jpg', w: 500, h: 281 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_f459-500x99999.jpg', w: 500, h: 281 },
    { src: '/images/UNADJUSTEDNONRAW_thumb_f46f-500x99999.jpg', w: 500, h: 281 },
  ];

  // The village's own videos; their stills come from YouTube
  const VIDEOS = [
    { id: 'xIC_wGnDEkE', title: 'Life at Liminal Village' },
    { id: 'XdhPXocPf9g', title: 'The ReGenerativa network' },
    { id: 'PecTFwIerjE', title: 'Kickstarting a computer-aided gLocal community' },
  ];

  // Videos woven in among the photos rather than gathered at the end (the
  // wall fills column by column, so these land partway down each one)
  const MEMORIES = (() => {
    const out = PHOTOS.map((p) => ({ ...p, kind: 'photo', alt: p.alt || 'A moment at Liminal Village' }));
    [5, 17, 28].forEach((at, i) => {
      const v = VIDEOS[i];
      out.splice(at, 0, { kind: 'video', ...v, src: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, w: 480, h: 360, alt: v.title });
    });
    return out;
  })();

  let open = -1;
  $: current = MEMORIES[open];

  const step = (d) => (open = (open + d + MEMORIES.length) % MEMORIES.length);

  function onKey(e) {
    if (open < 0) return;
    if (e.key === 'Escape') open = -1;
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  }

  // Each memory fades up the first time it comes into view
  let wall;
  onMount(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('seen');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    wall.querySelectorAll('.memory').forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
</script>

<svelte:window on:keydown={onKey} />

<main class="memories">
  <header>
    <p class="eyebrow">Community memories</p>
    <h1>Moon after moon, together</h1>
    <p class="lede">
      Building, gardening, learning and celebrating: moments from life at Liminal Village, gathered from the people who
      have lived them.
    </p>
  </header>

  <div class="wall" bind:this={wall}>
    {#each MEMORIES as m, i}
      <button type="button" class="memory" class:video={m.kind === 'video'} style="--i: {i % 6}" on:click={() => (open = i)} aria-label={m.kind === 'video' ? `Play the video: ${m.alt}` : 'Open the photo'}>
        <img src={m.src} alt={m.alt} width={m.w} height={m.h} loading="lazy" />
        {#if m.kind === 'video'}
          <span class="play" aria-hidden="true"></span>
          <span class="caption">{m.title}</span>
        {/if}
      </button>
    {/each}
  </div>
</main>

{#if current}
  <div class="viewer" transition:fade={{ duration: 250 }} role="dialog" aria-modal="true" aria-label={current.alt}>
    <button type="button" class="backdrop" on:click={() => (open = -1)} aria-label="Close"></button>
    <figure in:scale={{ start: 0.96, duration: 300 }}>
      {#key open}
        {#if current.kind === 'video'}
          <iframe
            src="https://www.youtube-nocookie.com/embed/{current.id}?autoplay=1&rel=0&modestbranding=1"
            title={current.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowfullscreen
          ></iframe>
        {:else}
          <img src={current.src} alt={current.alt} in:fade={{ duration: 250 }} />
        {/if}
      {/key}
      {#if current.kind === 'video'}<figcaption>{current.title}</figcaption>{/if}
    </figure>
    <button type="button" class="nav prev" on:click={() => step(-1)} aria-label="Previous">←</button>
    <button type="button" class="nav next" on:click={() => step(1)} aria-label="Next">→</button>
    <button type="button" class="close" on:click={() => (open = -1)} aria-label="Close">×</button>
  </div>
{/if}

<style>
  :global(body) {
    background: var(--oat-100);
  }

  .memories {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem 24px 9rem;
    font-family: 'Quicksand', system-ui, sans-serif;
    color: var(--bark-900);
  }

  header {
    max-width: 720px;
    margin-bottom: 3rem;
  }

  .eyebrow {
    margin: 0;
    font-size: 0.72rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--bark-600);
  }

  h1 {
    margin: 0.5rem 0 1rem;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    line-height: 1.1;
    text-transform: none;
    color: var(--bark-900);
  }

  .lede {
    max-width: 58ch;
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--bark-700);
  }

  /* A flowing wall: photos keep their own shape, falling into columns */
  .wall {
    columns: 3 300px;
    column-gap: 16px;
  }

  .memory {
    position: relative;
    display: block;
    width: 100%;
    margin: 0 0 16px;
    padding: 0;
    border: 0;
    border-radius: 18px;
    overflow: hidden;
    background: var(--oat-200);
    cursor: zoom-in;
    break-inside: avoid;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    transition-delay: calc(var(--i) * 60ms);
  }

  .memory:global(.seen) {
    opacity: 1;
    transform: none;
  }

  .memory img {
    display: block;
    width: 100%;
    height: auto;
    transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.6s ease;
  }

  .memory:hover img {
    transform: scale(1.04);
  }

  .memory.video {
    cursor: pointer;
  }

  .memory.video img {
    filter: brightness(0.82);
  }

  /* Videos are marked by a quiet ring with a small triangle, like a moon */
  .play {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 64px;
    height: 64px;
    margin: -32px 0 0 -32px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.85), 0 0 30px rgba(0, 0, 0, 0.25);
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .play::after {
    content: '';
    position: absolute;
    left: 26px;
    top: 22px;
    border-style: solid;
    border-width: 10px 0 10px 16px;
    border-color: transparent transparent transparent rgba(255, 255, 255, 0.9);
  }

  .memory.video:hover .play {
    transform: scale(1.1);
  }

  .caption {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 14px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: 1rem;
    text-align: left;
    color: #fff;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
  }


  /* The viewer: one memory large on soft dark */
  .viewer {
    position: fixed;
    inset: 0;
    z-index: 3000;
    display: grid;
    place-items: center;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    border: 0;
    background: rgba(20, 16, 13, 0.88);
    backdrop-filter: blur(6px);
    cursor: zoom-out;
  }

  figure {
    position: relative;
    margin: 0;
    max-width: min(1100px, 90vw);
  }

  /* Shown large, whatever the size of the file */
  figure img {
    display: block;
    width: min(1000px, 88vw);
    height: auto;
    max-height: 82vh;
    object-fit: contain;
    border-radius: 18px;
  }

  iframe {
    display: block;
    width: min(1000px, 90vw);
    aspect-ratio: 16 / 9;
    border: 0;
    border-radius: 18px;
  }

  figcaption {
    margin-top: 12px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    color: #fbf6ee;
  }

  .nav,
  .close {
    position: absolute;
    border: 0;
    background: none;
    color: rgba(251, 246, 238, 0.8);
    font: inherit;
    font-size: 1.6rem;
    cursor: pointer;
    padding: 12px 16px;
  }

  .nav:hover,
  .close:hover {
    color: #fff;
  }

  .prev {
    left: 2vw;
    top: 50%;
    transform: translateY(-50%);
  }

  .next {
    right: 2vw;
    top: 50%;
    transform: translateY(-50%);
  }

  .close {
    top: 16px;
    right: 2vw;
    font-size: 2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .memory {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
