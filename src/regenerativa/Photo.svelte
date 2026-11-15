<script>
  // A real photo from the network, with its caption over the bottom edge.
  // `ratio` sets the frame (e.g. "4 / 3"); the picture is cropped to fill it.
  export let src;
  export let caption;
  export let ratio = '4 / 3';
  export let position = 'center';
</script>

<figure style="aspect-ratio: {ratio}">
  <img {src} alt={caption} loading="lazy" decoding="async" style="object-position: {position}" />
  <figcaption>{caption}</figcaption>
</figure>

<style>
  figure {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    background: var(--rg-cream);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 1.2s var(--rg-ease);
  }

  figure:hover img { transform: scale(1.03); }

  figcaption {
    position: absolute;
    inset: auto 0 0 0;
    padding: 2.5rem 1.1rem 0.9rem;
    font-size: 0.82rem;
    line-height: 1.4;
    color: var(--rg-cream);
    background: linear-gradient(transparent, rgba(20, 26, 22, 0.85));
  }
</style>
