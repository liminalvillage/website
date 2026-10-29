<script>
  // Photos at full width, never a slideshow: one full-bleed frame holds still
  // while you scroll through the section, and the photos dissolve into one
  // another as you go. Scroll drives it; nothing moves on its own.
  import { onMount } from 'svelte';

  export let images = [];
  export let alt = '';

  let track;
  let progress = 0; // 0 → images.length - 1 across the track

  const onScroll = () => {
    if (!track) return;
    const r = track.getBoundingClientRect();
    const run = r.height - innerHeight;
    const p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
    progress = p * (images.length - 1);
  };

  // Each photo is fully shown at its own point and crossfades either side
  const opacityOf = (i, t) => Math.max(0, 1 - Math.abs(t - i));
  const scaleOf = (i, t) => 1.08 - 0.08 * opacityOf(i, t);

  onMount(onScroll);
</script>

<svelte:window on:scroll={onScroll} on:resize={onScroll} />

<div class="track" bind:this={track} style="--count: {images.length}">
  <div class="frame">
    {#each images as src, i}
      <img
        {src}
        {alt}
        loading="lazy"
        style="opacity: {opacityOf(i, progress)}; transform: scale({scaleOf(i, progress)})"
      />
    {/each}
  </div>
</div>

<style>
  /* The track sets how long the frame stays: about 55vh of scroll per photo */
  .track {
    position: relative;
    width: 100vw;
    margin: 3rem 0 0 calc(50% - 50vw);
    height: calc(var(--count) * 55vh + 30vh);
  }

  /* Truly full screen: edge to edge, top to bottom */
  .frame {
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: opacity, transform;
    transition: opacity 0.15s linear;
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      transform: none !important;
    }
  }
</style>
