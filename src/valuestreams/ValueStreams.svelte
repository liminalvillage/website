<script>
  // /value-streams: how value flows through the village in a Game B sense,
  // as one screen like the home page's journey, with no page scroll: a title,
  // an invitation to add knowledge, and one row of views beneath (Views).
  import { onMount } from 'svelte';
  import Views from './Views.svelte';
  import Invite from './Invite.svelte';

  // The home page's opening drawing, faint behind the views and drawn in ink
  // once the page opens, so this page belongs to the same story
  let svg = '';
  onMount(() => {
    fetch('/images/concepts/intro-forest-moon.svg')
      .then((r) => r.text())
      .then((text) => (svg = text))
      .catch(() => {});
  });
</script>

<main class="vs">
  <div class="ink" aria-hidden="true">{@html svg}</div>

  <header class="top">
    <div class="title">
      <p class="eyebrow">Game B</p>
      <h1>How value flows through the village</h1>
      <p class="lede">
        Liminal Village lives in the space in between, on the threshold from Game A to Game B. An open-source experiment
        in eight forms of capital, in harmony with the lunar and solar cycles.
      </p>
    </div>
    <!-- On phones the invitation sits here, under the title -->
    <Invite inline />
  </header>

  <Views />
</main>

<!-- On wider screens the invitation stands out in the top corner, above the
     header bar (outside the page's fixed layer, so it can sit on top) -->
<Invite />

<style>
  /* One screen, like the home page: no page scroll */
  :global(html),
  :global(body) {
    height: 100%;
    overflow: hidden;
  }

  :global(body) {
    background: var(--oat-100);
  }

  .vs {
    position: fixed;
    inset: 86px 0 74px;
    display: flex;
    flex-direction: column;
    padding: 0 max(24px, 3%);
    font-family: 'Quicksand', system-ui, sans-serif;
    color: var(--bark-900);
  }

  /* The forest drawing, faint behind everything, drawing itself in */
  .ink {
    position: absolute;
    right: 2%;
    bottom: -10px;
    width: min(620px, 55vw);
    opacity: 0.16;
    pointer-events: none;
  }

  .ink :global(svg) {
    display: block;
    width: 100%;
    height: auto;
  }

  .ink :global(path) {
    stroke: var(--bark-900);
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: calc(var(--o) * 3.2s);
  }

  .ink :global(.moon-glow) {
    display: none;
  }

  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  .top {
    position: relative;
    flex: none;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 32px;
    margin-bottom: 8px;
  }

  .eyebrow {
    margin: 0;
    font-size: 0.7rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--bark-600);
  }

  h1 {
    margin: 0.2rem 0 0.3rem;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: clamp(1.4rem, 2.4vw + 0.6vh, 2.1rem);
    line-height: 1.1;
    text-transform: none;
    color: var(--bark-900);
  }

  .lede {
    max-width: 64ch;
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--bark-700);
  }

  @media (prefers-reduced-motion: reduce) {
    .ink :global(path) {
      stroke-dashoffset: 0;
      animation: none;
    }
  }

  /* Phones: the header stacks, and the views scroll within the screen */
  @media (max-width: 760px) {
    .vs {
      inset: 70px 0 70px;
      padding: 0 16px;
      overflow-y: auto;
    }

    .top {
      flex-direction: column;
      gap: 12px;
    }

    .ink {
      display: none;
    }
  }
</style>
