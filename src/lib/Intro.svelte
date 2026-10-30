<script>
  // The opening of the home page: on plain paper, a little forest ecosystem
  // under the moon draws itself in, line by line, in dark ink. Then the paper
  // fades, the video loads ("intro-end"), the lines turn white, and the
  // drawn moon performs a small handover onto the hub's moon before the
  // journey's circles and words come in ("intro-landed"). Any scroll, key or
  // click skips the drawing. While it plays, html.intro keeps the journey,
  // header, dock and moon arc hidden.
  import { onMount } from 'svelte';
  import { phase } from 'lune';
  import { litPath } from './moonShape.js';

  // First the logo's two rings drift in from either side and meet (PRE_MS),
  // then the forest draws itself in (DRAW_MS)
  const PRE_MS = 2800;
  const DRAW_MS = 6200 + PRE_MS;

  // A ring drawn as if by hand: a slightly uneven loop whose end runs a
  // little past its start
  function handRing(cx, cy, r, seed) {
    let n = seed;
    const rand = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
    const waves = [2, 3, 5].map((k) => ({ k, a: 0.6 + rand() * 0.8, p: rand() * Math.PI * 2 }));
    const start = rand() * Math.PI * 2;
    return Array.from({ length: 81 }, (_, i) => {
      const t = i / 80;
      const a = start + Math.PI * 2 * 1.05 * t;
      const rr = r + waves.reduce((sum, w) => sum + w.a * Math.sin(w.k * a + w.p), 0) * 0.5 + t * 1.2;
      return `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
    }).join('');
  }
  const ringA = handRing(50, 50, 40, 7);
  const ringB = handRing(50, 50, 40, 31);
  // The handover, in ms: the moon becomes the logo (two rings) on its way to
  // the hub moon, holds, then spins back into one moon as it lands
  const TO_LOGO = 1400;
  const HOLD = 700;
  const SPIN = 1700;
  const LAND = TO_LOGO + HOLD + SPIN;
  let svg = '';
  let done = false;
  let gone = false;
  let timer = 0;
  let drawing;

  // Gathers the drawn moon's lines into one group and carries it, in the
  // drawing's own units, onto the hub moon (the journey is only hidden, so
  // the hub moon's place on screen is already known). On the way a second
  // ring slides out of it, so for a moment the two make the logo, the left
  // ring heavier like the logo's black one. Then the second ring slides back
  // in as the moon turns over on its vertical axis; edge-on, its crescent
  // becomes today's phase, so it lands as a line drawing of exactly the moon
  // underneath. The hub moon then fades in under it and the drawing goes.
  function flyMoon() {
    const art = drawing?.querySelector('svg');
    const ring = art?.querySelector('path.moon');
    const target = document.querySelector('.hub .lt .art');
    if (!ring || !target) return false;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'moon-fly');
    art.querySelectorAll('.moon').forEach((el) => g.appendChild(el));
    art.appendChild(g);
    const crescent = [...g.querySelectorAll('path.moon')].find((el) => el !== ring);
    const twin = ring.cloneNode();
    g.appendChild(twin);

    const from = ring.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const unit = art.getBoundingClientRect().width / art.viewBox.baseVal.width;
    const k = (to.width * (60 / 320)) / (from.width / 2);
    const dx = (to.left + to.width / 2 - (from.left + from.width / 2)) / unit;
    const dy = (to.top + to.height / 2 - (from.top + from.height / 2)) / unit;
    const box = ring.getBBox();
    const r = box.width / 2;
    const cx = box.x + r;
    const cy = box.y + box.height / 2;
    g.style.transformOrigin = `${cx}px ${cy}px`;

    // As in the logo, the rings' centres sit about one radius apart; the
    // pair is centred on the hub moon while it is the logo
    const at = (ms) => ms / LAND;
    const logo = `translate(${dx - (r * k) / 2}px, ${dy}px) scale(${k}, ${k})`;
    const ease = 'cubic-bezier(0.45, 0, 0.25, 1)';
    const opts = { duration: LAND, fill: 'forwards' };
    g.animate(
      [
        { offset: 0, transform: 'translate(0px, 0px) scale(1, 1)', easing: ease },
        { offset: at(TO_LOGO), transform: logo },
        { offset: at(TO_LOGO + HOLD), transform: logo, easing: 'cubic-bezier(0.5, 0, 0.9, 0.6)' },
        { offset: at(TO_LOGO + HOLD + SPIN / 2), transform: `translate(${dx - (r * k) / 4}px, ${dy}px) scale(0.02, ${k})`, easing: 'cubic-bezier(0.1, 0.4, 0.5, 1)' },
        { offset: 1, transform: `translate(${dx}px, ${dy}px) scale(${k}, ${k})` },
      ],
      opts
    );
    twin.animate(
      [
        { offset: 0, transform: 'translate(0px, 0px)', opacity: 0, easing: ease },
        { offset: at(TO_LOGO), transform: `translate(${r}px, 0px)`, opacity: 1 },
        { offset: at(TO_LOGO + HOLD), transform: `translate(${r}px, 0px)`, opacity: 1, easing: ease },
        { offset: 1, transform: 'translate(0px, 0px)', opacity: 0 },
      ],
      opts
    );
    ring.animate(
      [
        { offset: 0, strokeWidth: 1.1, easing: ease },
        { offset: at(TO_LOGO), strokeWidth: 3 },
        { offset: at(TO_LOGO + HOLD), strokeWidth: 3, easing: ease },
        { offset: 1, strokeWidth: 1.1 },
      ],
      opts
    );
    // The crescent steps aside for the logo and returns as today's phase
    crescent?.animate(
      [
        { offset: 0, opacity: 1 },
        { offset: at(TO_LOGO * 0.6), opacity: 0 },
        { offset: at(TO_LOGO + HOLD + SPIN / 2), opacity: 0 },
        { offset: 1, opacity: 1 },
      ],
      opts
    );
    setTimeout(() => {
      const today = litPath(phase(new Date()).phase, cx, cy, r);
      if (crescent && today) crescent.setAttribute('d', today);
      else crescent?.remove();
    }, TO_LOGO + HOLD + SPIN / 2);
    // Landed: the hub moon fades in beneath, then the drawing lets go
    setTimeout(() => g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, delay: 900, fill: 'forwards' }), LAND);
    return true;
  }

  function end() {
    if (done) return;
    done = true;
    clearTimeout(timer);
    const flying = flyMoon();
    dispatchEvent(new Event('intro-end'));
    // The hub comes in as the moon lands
    setTimeout(() => {
      document.documentElement.classList.remove('intro');
      dispatchEvent(new Event('intro-landed'));
    }, flying ? LAND - 300 : 0);
    setTimeout(() => (gone = true), flying ? LAND + 2000 : 1200);
  }

  // Swallow the first gesture so it only skips, rather than also moving
  // the journey on
  function skip(e) {
    if (done) return;
    e.preventDefault();
    e.stopPropagation();
    end();
  }

  onMount(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gone = true;
      return;
    }
    document.documentElement.classList.add('intro');
    fetch('/images/concepts/intro-forest-moon.svg')
      .then((r) => r.text())
      .then((text) => {
        svg = text;
        timer = setTimeout(end, DRAW_MS);
      })
      .catch(end);
    addEventListener('keydown', skip, true);
    return () => {
      clearTimeout(timer);
      removeEventListener('keydown', skip, true);
      document.documentElement.classList.remove('intro');
    };
  });
</script>

{#if !gone}
  <div class="intro" class:done on:wheel={skip} on:click={skip} on:touchstart={skip} aria-hidden="true">
    <!-- The logo's two rings drift in from either side and overlap -->
    <div class="logo-in">
      <svg class="ring-a" viewBox="0 0 100 100"><path d={ringA} pathLength="1" /></svg>
      <svg class="ring-b" viewBox="0 0 100 100"><path d={ringB} pathLength="1" /></svg>
    </div>
    <div class="drawing" bind:this={drawing}>
      {@html svg}
      <!-- Written along the ground line, by hand -->
      {#if svg}
        <p class="hand hand-a">where Game A ends</p>
        <p class="hand hand-b">Game B starts</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  .intro {
    position: fixed;
    inset: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    cursor: pointer;
    --line: #3b2f25;
  }

  /* The paper the drawing starts on, over the video until the end */
  .intro::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(circle at 50% 45%, #f7f1e6, #ece2d1);
    transition: opacity 1.6s ease;
  }

  .intro.done::before {
    opacity: 0;
  }

  /* Over the video the ink turns to light */
  .intro.done {
    --line: #fbf6ee;
  }

  /* On its way out, the forest fades and only the moon travels on */
  .intro.done {
    pointer-events: none;
  }

  .done .drawing :global(svg > :not(.moon-fly)) {
    opacity: 0;
    transition: opacity 0.9s ease;
  }

  /* Skipped mid-drawing, the moon is finished at once so it can fly */
  .done .drawing :global(.moon) {
    animation: none;
    stroke-dashoffset: 0;
  }

  .done .drawing :global(.moon-glow) {
    opacity: 0.18;
  }


  .drawing {
    position: relative;
    width: min(1100px, 100%);
    --pre: 2.8s;
  }

  /* The opening: two hand-drawn rings, one from each side, meeting in the
     middle as the logo, then fading as the forest begins */
  .logo-in {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 0;
    height: 0;
    animation: logo-out 0.7s ease 2.1s forwards;
  }

  .logo-in svg {
    position: absolute;
    top: -46px;
    width: 92px;
    height: 92px;
    overflow: visible;
  }

  .logo-in path {
    fill: none;
    stroke: var(--line);
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw 1.2s ease forwards;
  }

  .ring-a {
    left: -71px;
    animation: from-left 1.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  .ring-b {
    left: -21px;
    animation: from-right 1.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  @keyframes from-left {
    from {
      transform: translateX(-45vw);
    }
  }

  @keyframes from-right {
    from {
      transform: translateX(45vw);
    }
  }

  @keyframes logo-out {
    to {
      opacity: 0;
      transform: scale(0.85);
    }
  }

  /* Handwriting beside the ground line's spirals: under the left one, which
     curls down, and over the right one, which curls up */
  .hand {
    position: absolute;
    margin: 0;
    font-family: 'Caveat', cursive;
    font-weight: 400;
    font-size: clamp(1rem, 1.7vw, 1.4rem);
    opacity: 0.85;
    color: var(--line);
    white-space: nowrap;
    clip-path: inset(0 100% 0 0);
    animation: write 1.4s ease-out forwards;
    transition: color 1.4s ease, opacity 0.9s ease;
  }

  .hand-a {
    top: calc(500 / 640 * 100%);
    left: 3.5%;
    animation-delay: calc(var(--pre) + 0.3s);
  }

  .hand-b {
    top: calc(390 / 640 * 100% - 1.2em);
    right: 2.5%;
    animation-delay: calc(var(--pre) + 2.3s);
  }

  /* The ground line draws slowly from left to right, before the rest */
  .drawing :global(path.ground) {
    animation-duration: 2.6s;
    animation-timing-function: cubic-bezier(0.45, 0, 0.35, 1);
  }

  @keyframes write {
    to {
      clip-path: inset(0 0 0 0);
    }
  }

  .done .hand {
    opacity: 0;
  }

  .drawing :global(path) {
    stroke: var(--line);
    transition: stroke 1.4s ease, opacity 0.9s ease;
  }

  .drawing :global(.moon-glow) {
    fill: #e8b27a;
  }

  .done .drawing {
    filter: drop-shadow(0 1px 10px rgba(0, 0, 0, 0.45));
  }

  .drawing :global(svg) {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }

  /* Each line draws itself in, in the order the script gave them (--o runs
     0–1), so the whole drawing is done in about 5 seconds */
  .drawing :global(path) {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: calc(var(--pre) + var(--o) * 4.2s);
  }

  .drawing :global(.moon-glow) {
    opacity: 0;
    filter: blur(14px);
    animation: glow 1.6s ease forwards calc(var(--pre) + 4.2s);
  }

  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes glow {
    to {
      opacity: 0.18;
    }
  }

  /* The journey, header, dock and terminal wait behind the paper, then
     ease in with the video */
  :global(html .journey),
  :global(html .moon-path),
  :global(html .navbar),
  :global(html .terminal) {
    transition: opacity 1.2s ease 0.3s;
  }

  :global(html.intro .journey),
  :global(html.intro .moon-path),
  :global(html.intro .navbar),
  :global(html.intro .dock),
  :global(html.intro .terminal) {
    opacity: 0 !important;
    pointer-events: none;
  }
</style>
