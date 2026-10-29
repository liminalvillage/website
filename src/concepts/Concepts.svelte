<script>
  // /concepts: the illustration set for the village's key ideas, drawn by
  // scripts/concept-art.py in one shared style.
  const CONCEPTS = [
    { file: 'spiral', name: 'Spiral', note: 'Spiral Dynamics, in its own colours' },
    { file: 'holonic-architecture', name: 'Holonic architecture', note: 'Wholes inside wholes' },
    { file: 'forest-pattern-language', name: 'The pattern language of forests', note: 'Canopy, understorey, shrubs, herbs, climbers and roots' },
    { file: 'ikigai', name: 'Ikigai', note: 'Four circles and where they meet' },
    { file: 'internal-family-systems', name: 'Internal Family Systems', note: 'The Self and its parts' },
    { file: 'fractals', name: 'Fractals', note: 'The same pattern at every scale' },
    { file: 'mycelium-networks', name: 'Mycelium networks', note: 'Connection through the soil' },
    { file: 'game-b', name: 'Game B', note: 'From a board of squares to a circle where everyone wins' },
  ];
</script>

<main class="concepts">
  <header>
    <p class="eyebrow">Design system · Illustration</p>
    <h1>Concepts</h1>
    <p class="lede">
      One shared style for the ideas the village works with: a deep, painterly colour field, white
      hand-drawn linework and stippled clouds. Each concept keeps its own colour mood.
    </p>
  </header>

  <div class="grid">
    {#each CONCEPTS as c}
      <figure>
        <img src="/images/concepts/{c.file}.svg" alt={c.name} loading="lazy" width="800" height="800" />
        <figcaption>
          <strong>{c.name}</strong>
          <span>{c.note}</span>
        </figcaption>
      </figure>
    {/each}
  </div>
</main>

<style>
  :global(body) {
    background: var(--oat-100);
  }

  .concepts {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 24px 8rem;
    font-family: 'Quicksand', system-ui, sans-serif;
    color: var(--bark-900);
  }

  h1 {
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: clamp(2.4rem, 5vw, 3.6rem);
    letter-spacing: 0.01em;
    text-transform: none;
    color: var(--bark-900);
    margin: 0.4rem 0 1rem;
  }

  .eyebrow {
    font-size: 0.72rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--bark-600);
  }

  .lede {
    max-width: 62ch;
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--bark-700);
    margin-bottom: 2.5rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }

  figure {
    margin: 0;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    border: 1px solid color-mix(in srgb, var(--bark-900) 8%, transparent);
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }

  figcaption {
    display: grid;
    gap: 2px;
    padding: 14px 16px 16px;
  }

  figcaption strong {
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 400;
    font-size: 1.05rem;
  }

  figcaption span {
    font-size: 0.85rem;
    color: var(--bark-600);
  }
</style>
