<script>
  // A full-bleed ribbon of photos in place of a tile grid. "drift": the ribbon
  // moves slowly on its own and pauses on hover. "strip": a still row you
  // scroll or swipe sideways. Try ?gallery=strip to compare.
  export let images = [];
  export let alt = '';

  const mode = new URLSearchParams(location.search).get('gallery') === 'strip' ? 'strip' : 'drift';
</script>

<div class="ribbon {mode}">
  <div class="track" style="--count: {images.length}">
    {#each images as src, i}
      <figure class:low={i % 2}>
        <img {src} {alt} loading="lazy" />
      </figure>
    {/each}
    <!-- A second, hidden copy lets the drift loop without a seam -->
    {#if mode === 'drift'}
      {#each images as src, i}
        <figure class:low={i % 2} aria-hidden="true">
          <img {src} alt="" loading="lazy" />
        </figure>
      {/each}
    {/if}
  </div>
</div>

<style>
  .ribbon {
    width: 100vw;
    margin: 3rem 0 0 calc(50% - 50vw);
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent);
    mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent);
  }

  .track {
    display: flex;
    width: max-content;
    padding: 0.5rem 0 3rem;
  }

  figure {
    flex: none;
    margin: 0;
    padding-right: 1.25rem;
  }

  /* Every other photo sits a little lower, so the row reads loose, not boxed */
  figure.low {
    transform: translateY(2rem);
  }

  img {
    display: block;
    height: clamp(220px, 26vw, 360px);
    width: auto;
    border-radius: 12px;
    filter: saturate(0.85);
    transition: filter 0.8s ease, transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  figure:hover img {
    filter: saturate(1.05);
    transform: scale(1.02);
  }

  .drift .track {
    animation: drift calc(var(--count) * 9s) linear infinite;
  }

  .drift:hover .track {
    animation-play-state: paused;
  }

  @keyframes drift {
    to {
      transform: translateX(-50%);
    }
  }

  .strip {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .strip::-webkit-scrollbar {
    display: none;
  }

  .strip .track {
    padding-left: 8vw;
    padding-right: 8vw;
  }

  .strip figure {
    scroll-snap-align: center;
  }

  @media (prefers-reduced-motion: reduce) {
    .drift {
      overflow-x: auto;
    }

    .drift .track {
      animation: none;
    }
  }

  @media (max-width: 768px) {
    .ribbon {
      margin-top: 2rem;
    }

    img {
      height: 200px;
    }

    figure {
      padding-right: 0.75rem;
    }

    figure.low {
      transform: translateY(1.25rem);
    }
  }
</style>
