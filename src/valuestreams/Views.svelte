<script>
  // The value streams page, as one row of tabs over one screen, with no page
  // scroll. "Game B": what the experiment is. "8 forms of capital": a flower
  // of eight overlapping circles; choosing a petal opens that capital (what
  // it is, how it flows here, how members can exchange it, the lunations that
  // grow it, the criteria it is valued by), and the Financial petal lays out
  // the money flows as cards. "Lunations": the year's arc of moons; choosing
  // one (click, the arrow keys, or "Play the year") walks the line to it and
  // opens its story, tinted by its season. "Grid": every lunation at a
  // glance. "Impact & learning": how the experiment measures and learns.
  // "Flows I can join": ways to bring your own work. "Pattern Languages":
  // the illustrated frameworks behind the experiments.
  import { onDestroy, onMount, tick } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { YEAR, CRITERIA } from './year.js';
  import { CAPITALS, MONEY, JOIN, PRACTICE, LEARN, TINTS, DAYS, PATTERNS } from './data.js';
  import { ABUNDANCE } from './abundance.js';

  // Impact: the eight capitals as now-and-target bars; choosing one opens its
  // criteria. Positions run along a 1 to 5 scale.
  let openCap = null;
  $: openAbundance = ABUNDANCE.find((a) => a.capital === openCap);
  const pos = (v) => `${((v - 1) / 4) * 100}%`;

  const capitals = CAPITALS;
  const tints = TINTS;

  const TABS = [
    { id: 'gameb', label: 'Game B' },
    { id: 'capital', label: '8 Forms of Capital' },
    { id: 'arc', label: 'Lunations' },
    { id: 'patterns', label: 'Pattern Languages' },
    { id: 'grid', label: 'Grid' },
    { id: 'impact', label: 'Impact & learning' },
    { id: 'join', label: 'Flows I can join' },
  ];

  // Pattern languages: a ring of illustrations; choosing one shows it large
  let pattern = -1;
  const stepPattern = (d) => (pattern = (pattern + d + PATTERNS.length) % PATTERNS.length);

  const n = YEAR.length;
  const month = (from) => from.split(' ')[1];
  let view = 'gameb';

  // --- the flower --------------------------------------------------------
  const FC = 230;
  const PETAL = 92;
  const REACH = 98;
  $: petals = capitals.map((c, i) => {
    const a = (Math.PI * 2 * i) / capitals.length - Math.PI / 2;
    return {
      ...c,
      i,
      x: FC + REACH * Math.cos(a),
      y: FC + REACH * Math.sin(a),
      lx: FC + (REACH + 52) * Math.cos(a),
      ly: FC + (REACH + 52) * Math.sin(a),
      moons: YEAR.filter((x) => x.capitals.includes(c.name)),
      criteria: CRITERIA.find((k) => k.capital === c.name)?.items ?? [],
    };
  });
  let petal = 'Social';
  // The detail panel starts at the top for each newly chosen capital
  let detail;
  let allCriteria = false;
  $: if (petal) allCriteria = false;
  $: if (detail && petal) detail.scrollTop = 0;
  $: chosen = petals.find((p) => p.name === petal) || petals[0];

  // --- the timeline ------------------------------------------------------
  let width = 900;
  const PAD = 36;
  const TOP = 22;
  const RISE = 60;
  $: span = Math.max(1, width - PAD * 2);
  const yAt = (t) => TOP + RISE * (1 - Math.sin(Math.PI * t));
  $: points = YEAR.map((_, i) => ({ x: PAD + (span * i) / (n - 1), y: yAt(i / (n - 1)) }));
  // The year's line is drawn as if by hand: a small, uneven wobble
  const hand = (t) => 1.1 * Math.sin(t * 17 + 0.4) + 0.7 * Math.sin(t * 31 + 2.2) + 0.4 * Math.sin(t * 53 + 1.1);
  $: line = Array.from({ length: 121 }, (_, k) => {
    const t = k / 120;
    return `${k ? 'L' : 'M'}${(PAD + span * t).toFixed(1)} ${(yAt(t) + hand(t)).toFixed(1)}`;
  }).join('');

  // The season tints the open lunation's story
  const SEASON = { Dec: 'oat', Jan: 'oat', Feb: 'oat', Mar: 'sprout', Apr: 'sprout', May: 'sprout', Jun: 'ember', Jul: 'ember', Aug: 'ember', Sep: 'rust', Sept: 'rust', Oct: 'rust', Nov: 'rust' };

  // The timeline opens on the lunation we are in now
  let sel = Math.max(0, YEAR.findIndex((x) => x.now));
  let dir = 1;
  let playing = false;
  let timer = 0;
  $: l = YEAR[sel];
  $: season = l.milestone ? 'rosehip' : SEASON[month(l.from)];

  function go(i, fromPlay = false) {
    i = Math.max(0, Math.min(n - 1, i));
    if (i === sel) return;
    dir = i > sel ? 1 : -1;
    sel = i;
    if (!fromPlay) stop();
  }

  function play() {
    if (playing) return stop();
    playing = true;
    if (sel === n - 1) sel = 0;
    timer = setInterval(() => {
      if (sel >= n - 1) return stop();
      go(sel + 1, true);
    }, 3600);
  }

  function stop() {
    playing = false;
    clearInterval(timer);
  }

  function onKey(e) {
    if (view !== 'arc' || e.target.closest?.('input, textarea')) return;
    if (e.key === 'ArrowRight') go(sel + 1);
    else if (e.key === 'ArrowLeft') go(sel - 1);
  }

  onDestroy(stop);

  // The tab loop: one pen-drawn loop that glides to the chosen tab, and can
  // be dragged along the row and let go on another tab
  let tabEls = [];
  let switchEl;
  let loop = { x: 0, w: 0 };
  let dragging = false;
  let grabDx = 0;

  function placeLoop() {
    const i = TABS.findIndex((t) => t.id === view);
    const el = tabEls[i];
    if (el) loop = { x: el.offsetLeft, w: el.offsetWidth };
  }

  $: view, tick().then(placeLoop);
  onMount(() => {
    placeLoop();
    addEventListener('resize', placeLoop);
    return () => removeEventListener('resize', placeLoop);
  });

  function grab(e) {
    dragging = true;
    grabDx = e.clientX - loop.x;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function drag(e) {
    if (!dragging) return;
    const max = switchEl.scrollWidth - loop.w;
    loop = { ...loop, x: Math.max(0, Math.min(max, e.clientX - grabDx)) };
  }

  function drop(e) {
    if (!dragging) return;
    dragging = false;
    // Let go: the loop settles on the tab nearest to where it was let go
    const box = switchEl.getBoundingClientRect();
    const mid = e.clientX - box.left + switchEl.scrollLeft;
    let best = 0;
    tabEls.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
      const bd = Math.abs(tabEls[best].offsetLeft + tabEls[best].offsetWidth / 2 - mid);
      if (d < bd) best = i;
    });
    if (TABS[best].id === view) placeLoop();
    else show(TABS[best].id);
  }

  // Which way the views are moving, so each new one slides in from there
  let tabDir = 1;

  function show(next) {
    stop();
    const from = TABS.findIndex((t) => t.id === view);
    const to = TABS.findIndex((t) => t.id === next);
    tabDir = to >= from ? 1 : -1;
    view = next;
  }

  // Scrolling moves gently to the next or previous tab, like the home page's
  // journey, unless a panel inside the view still has room to scroll that way
  let wheelSum = 0;
  let wheelLock = 0;

  function canScroll(el, dy) {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (n.scrollHeight > n.clientHeight + 2 && /(auto|scroll)/.test(getComputedStyle(n).overflowY)) {
        if (dy > 0 && n.scrollTop + n.clientHeight < n.scrollHeight - 2) return true;
        if (dy < 0 && n.scrollTop > 2) return true;
      }
    }
    return false;
  }

  function stepTab(d) {
    const i = TABS.findIndex((t) => t.id === view);
    const next = TABS[i + d];
    if (next) show(next.id);
  }

  function onWheel(e) {
    if (canScroll(e.target, e.deltaY)) return;
    e.preventDefault();
    if (Date.now() < wheelLock) return;
    wheelSum += e.deltaY;
    if (Math.abs(wheelSum) < 60) return;
    stepTab(wheelSum > 0 ? 1 : -1);
    wheelSum = 0;
    wheelLock = Date.now() + 900;
  }

  let touchY = null;
  const onTouchStart = (e) => (touchY = e.touches[0].clientY);
  function onTouchEnd(e) {
    if (touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    touchY = null;
    if (Math.abs(dy) > 60 && !canScroll(e.target, dy)) stepTab(dy > 0 ? 1 : -1);
  }

  // From the flower or the grid straight to a lunation in the timeline
  function openLunation(index) {
    sel = YEAR.findIndex((x) => x.index === index);
    show('arc');
  }
</script>

<svelte:window on:keydown={onKey} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="views" on:wheel={onWheel} on:touchstart|passive={onTouchStart} on:touchend={onTouchEnd}>
  <div class="switch" role="tablist" aria-label="Value streams" bind:this={switchEl}>
    <span
      class="loop"
      class:dragging
      style="transform: translateX({loop.x}px); width: {loop.w}px"
      role="presentation"
      title="Drag to another tab"
      on:pointerdown={grab}
      on:pointermove={drag}
      on:pointerup={drop}
      on:pointercancel={drop}
    ></span>
    {#each TABS as t, i}
      <button type="button" role="tab" class:on={view === t.id} aria-selected={view === t.id} bind:this={tabEls[i]} on:click={() => show(t.id)}>{t.label}</button>
    {/each}
  </div>

  {#if view === 'gameb'}
    <div class="gameb" in:fly={{ y: 28 * tabDir, duration: 600, opacity: 0 }}>
      <div class="art">
        <img src="/images/concepts/game-b.svg" alt="Game B: a circle of players where everyone wins" width="800" height="800" />
      </div>
      <div class="gameb-text">
        <p class="big">
          Game A is the game most of the world plays: rivalrous and zero-sum, where one side's gain is another's loss and
          money is the measure of everything. Game B is the search for a different game, positive-sum and life-giving,
          where playing well makes everyone and everything around you better off.
        </p>
        <p>
          Liminal Village lives in the space in between: the threshold of the transition from Game A to Game B, still
          partly in the old game while practising the new one. What we are doing here is experimental. Every flow here is
          something being tried, learned from and changed as the lunations go by.
        </p>
        <p>
          Part of the answer is to hack our way to Game B: repurpose what already exists, aim for the first 80% rather
          than perfection, and carry the learnings into the next try.
        </p>
        <p>
          Here money is not the goal but one current among many. Value arrives, and is given back, in
          <button type="button" class="link" on:click={() => show('capital')}>eight forms of capital</button>, and a
          healthy village keeps all eight flowing, in harmony with the lunar and solar cycles.
        </p>
        <p class="small">
          The eight forms of capital come from Ethan Roland and Gregory Landua, a lens for regenerative enterprise that
          looks past money to everything a living system depends on.
        </p>
      </div>
    </div>
  {/if}

  {#if view === 'capital'}
    <div class="flower-view" in:fly={{ y: 28 * tabDir, duration: 600, opacity: 0 }}>
      <svg class="flower" viewBox="0 0 {FC * 2} {FC * 2}" role="group" aria-label="The eight forms of capital">
        {#each petals as p (p.name)}
          <g
            class="petal"
            class:on={p.name === petal}
            style="--tint: {p.tint}; --k: {p.i}"
            role="button"
            tabindex="0"
            aria-pressed={p.name === petal}
            aria-label={p.name}
            on:click={() => (petal = p.name)}
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), (petal = p.name))}
          >
            <circle cx={p.x} cy={p.y} r={PETAL} />
          </g>
        {/each}
        {#each petals as p (p.name)}
          <text class="plabel" class:on={p.name === petal} x={p.lx} y={p.ly}>{p.name}</text>
        {/each}
        <circle class="heart" cx={FC} cy={FC} r="34" />
        <text class="heart-label" x={FC} y={FC - 2}>8</text>
        <text class="heart-sub" x={FC} y={FC + 13}>forms</text>
      </svg>

      <div class="detail" class:wide={chosen.money} bind:this={detail}>
        {#key petal}
          <div in:fly={{ y: 12, duration: 450 }}>
            <h2><i style="--tint: {chosen.tint}" aria-hidden="true"></i>{chosen.name}</h2>
            <p class="what">{chosen.what}</p>
            {#if chosen.money}
              <p class="label">Money flows · gifts go to the ReGenerativa association, the village's legal entity</p>
              <div class="money">
                {#each MONEY as g, k}
                  <div class="card" style="--k: {k}">
                    <h3>{g.group}</h3>
                    <ul>
                      {#each g.items as item}
                        <li class="money-item" title={item.note}>
                          <span class="item-name">{item.name}{#if item.today}<span class="today">Today</span>{/if}</span>
                          <span class="item-note">{item.note}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/each}
              </div>
            {/if}
            <div class="cols">
              <div>
                <p class="label">How it flows here</p>
                <p class="flow">{chosen.flow}</p>
                <p class="label">How members can exchange</p>
                <ul class="dots" style="--tint: {chosen.tint}">
                  {#each chosen.exchange as e}<li>{e}</li>{/each}
                </ul>
              </div>
              <div>
                <p class="label">Grows in {chosen.moons.length} of {n} lunations</p>
                <div class="chips">
                  {#each chosen.moons as x}
                    <button type="button" class="chip" class:milestone={x.milestone} on:click={() => openLunation(x.index)} title={x.theme}>
                      <span class="disc" aria-hidden="true"></span>Lunation {x.index} · {x.name}
                    </button>
                  {/each}
                </div>
                <p class="label">Valued by {chosen.criteria.length} agreed criteria</p>
                {#if allCriteria}
                  <p class="criteria" in:fade={{ duration: 300 }}>{chosen.criteria.join(' · ')}</p>
                {:else}
                  <p class="criteria">
                    {chosen.criteria.slice(0, 3).join(' · ')} ·
                    <button type="button" class="link" on:click={() => (allCriteria = true)}>all {chosen.criteria.length}</button>
                  </p>
                {/if}
              </div>
            </div>
          </div>
        {/key}
      </div>
    </div>
  {/if}

  {#if view === 'arc'}
    <div class="arc-view" in:fly={{ y: 28 * tabDir, duration: 600, opacity: 0 }}>
      <div class="timeline" bind:clientWidth={width} role="group" aria-label="Lunations {YEAR[0].index} to {YEAR[n - 1].index}; use the arrow keys to move between them">
        <svg class="sky" width={width} height={TOP + RISE + 50} aria-hidden="true">
          <path d={line} class="path-base" />
          <path d={line} class="path-walked" pathLength="1" style="stroke-dashoffset: {1 - sel / (n - 1)}" />
        </svg>
        {#each YEAR as x, i}
          <button
            type="button"
            class="tmoon"
            class:on={i === sel}
            class:past={i < sel}
            class:milestone={x.milestone}
            style="left: {points[i].x}px; top: {points[i].y}px; --i: {i}"
            aria-pressed={i === sel}
            aria-label="Lunation {x.index}: {x.name}, {x.theme}"
            on:click={() => go(i)}
          >
            <span class="disc"></span>
            <span class="num"><small>Lunation</small>{x.index}</span>
            <span class="mon">{x.now ? 'now' : month(x.from)}</span>
          </button>
        {/each}
      </div>

      <div class="stage" style="--season: var(--{season}-200)">
        <div class="controls">
          <button type="button" on:click={() => go(sel - 1)} disabled={sel === 0} aria-label="Previous lunation">←</button>
          <button type="button" on:click={play}>{playing ? 'Pause' : 'Play the year'}</button>
          <button type="button" on:click={() => go(sel + 1)} disabled={sel === n - 1} aria-label="Next lunation">→</button>
        </div>
        {#key sel}
          <article class="story" class:milestone={l.milestone} in:fly={{ x: 40 * dir, duration: 550, delay: 120 }}>
            <div>
              <p class="when">Lunation {l.index}{l.now ? ' · now' : ''} · {l.from} – {l.to} {l.year}</p>
              <h2>{l.name}</h2>
              <p class="theme">{l.theme}</p>
              <p class="season">{l.season}</p>
              <p class="about">{l.about}</p>
            </div>
            <div>
              <p class="label">Capital</p>
              <ul class="orbs">
                {#each l.capitals as c, k}
                  <li style="--tint: {tints[c]}; --k: {k}"><i aria-hidden="true"></i>{c}</li>
                {/each}
              </ul>
              <p class="label">Money flows</p>
              <ul class="list">
                {#each l.money as m}<li>{m}</li>{/each}
              </ul>
              <p class="label">Moves</p>
              <ul class="list">
                {#each l.impact as m}<li>{m}</li>{/each}
              </ul>
            </div>
            <div>
              <p class="label">Sky</p>
              <ul class="sky-list">
                <li><span class="glyph new" aria-hidden="true"></span>{l.sky.newMoon}</li>
                <li><span class="glyph full" aria-hidden="true"></span>{l.sky.fullMoon}</li>
                {#each l.sky.sun as s}<li><span class="glyph sun" aria-hidden="true"></span>{s}</li>{/each}
                <li><span class="glyph day" aria-hidden="true"></span>{l.sky.daylight} of daylight at the new moon</li>
              </ul>
              <p class="label">Local</p>
              <ul class="list">
                {#each l.local as m}<li>{m}</li>{/each}
              </ul>
              <p class="label">Global</p>
              <ul class="list">
                {#each l.global as m}<li>{m}</li>{/each}
              </ul>
            </div>
          </article>
        {/key}
      </div>
    </div>
  {/if}

  {#if view === 'grid'}
    <div class="grid" in:fly={{ y: 28 * tabDir, duration: 600, opacity: 0 }}>
      {#each YEAR as x, i}
        <button type="button" class="tile" class:milestone={x.milestone} style="--i: {i}" on:click={() => openLunation(x.index)}>
          <span class="tile-top">
            <span class="disc" aria-hidden="true"></span>
            <span class="tile-when">Lunation {x.index} · {x.from}</span>
          </span>
          <span class="tile-theme">{x.name}</span>
          <span class="tile-sub">{x.theme}</span>
          <span class="tile-season">{x.season}</span>
          <span class="tile-sky">{x.sky.newMoon.replace(/, .*/, '')}</span>
          <span class="tile-caps" aria-label={x.capitals.join(', ')}>
            {#each x.capitals as c}<i style="--tint: {tints[c]}" title={c}></i>{/each}
          </span>
        </button>
      {/each}
    </div>
  {/if}

  {#if view === 'impact'}
    <div class="impact" in:fly={{ y: 28 * tabDir, duration: 600, opacity: 0 }}>
      <div class="abundance">
        <h2>Where we are, where we are going</h2>
        <p class="ab-lede">
          Everyone rated each kind of wealth from 1 to 5: where the village is now
          <span class="key now" aria-hidden="true"></span>, and where we want it to be by Lunation 100
          <span class="key target" aria-hidden="true"></span>. Choose one to see its parts.
        </p>
        <div class="scale" aria-hidden="true">
          <span></span>{#each [1, 2, 3, 4, 5] as v}<span style="left: {pos(v)}">{v}</span>{/each}
        </div>
        {#if !openAbundance}
          <ul class="bars" in:fade={{ duration: 300 }}>
            {#each ABUNDANCE as a, k}
              <li style="--tint: {tints[a.capital]}; --k: {k}">
                <button type="button" on:click={() => (openCap = a.capital)}>
                  <span class="bar-name"><i aria-hidden="true"></i>{a.capital}</span>
                  <span class="track">
                    <span class="span" style="left: {pos(a.now)}; width: calc({pos(a.target)} - {pos(a.now)})"></span>
                    <span class="dot now" style="left: {pos(a.now)}" title="Now: {a.now}"></span>
                    <span class="dot target" style="left: {pos(a.target)}" title="By Lunation 100: {a.target}"></span>
                  </span>
                  <span class="nums">{a.now.toFixed(1)} → {a.target.toFixed(1)}</span>
                </button>
              </li>
            {/each}
          </ul>
        {:else}
          <div class="open-cap" in:fly={{ x: 30, duration: 400 }} style="--tint: {tints[openAbundance.capital]}">
            <button type="button" class="link back" on:click={() => (openCap = null)}>← All eight</button>
            <h3><i aria-hidden="true"></i>{openAbundance.capital}<span class="nums">{openAbundance.now.toFixed(1)} → {openAbundance.target.toFixed(1)}</span></h3>
            <ul class="bars small">
              {#each openAbundance.items as item, k}
                <li style="--k: {k}">
                  <span class="bar-name">{item.name}</span>
                  <span class="track">
                    <span class="span" style="left: {pos(item.now)}; width: calc({pos(item.target)} - {pos(item.now)})"></span>
                    <span class="dot now" style="left: {pos(item.now)}" title="Now: {item.now}"></span>
                    <span class="dot target" style="left: {pos(item.target)}" title="By Lunation 100: {item.target}"></span>
                  </span>
                  <span class="nums">{item.now.toFixed(1)} → {item.target.toFixed(1)}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>

      <div class="learn">
        <h2>How we learn as we go</h2>
        <ul class="practice">
          {#each PRACTICE as item}
            <li title={item.note}>{item.name}</li>
          {/each}
        </ul>
        <h2 class="spaced">What inspires us</h2>
        <p>
          The books, people and places behind our ways of living, working and sharing. More in
          <a href="/dna">our DNA</a> and the <a href="/media">open library</a>.
        </p>
        <div class="sources">
          {#each LEARN as g, k}
            <div class="card" style="--k: {k}">
              <h3>{g.group}</h3>
              <ul>
                {#each g.items as item}
                  <li title={item.note}>
                    <span class="item-name">{#if item.href}<a href={item.href} target="_blank" rel="noopener">{item.name}</a>{:else}{item.name}{/if}<span class="item-by">{item.by}</span></span>
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  {#if view === 'join'}
    <div class="join" in:fly={{ y: 28 * tabDir, duration: 600, opacity: 0 }}>
      <p class="join-lede">
        Liminal Villagers are everyone who has spent meaningful time here: those deeply involved, those who contribute now
        and then, and those who follow from afar, with our supporters near and far. Whichever you are, there is a flow for
        you, and any share is agreed openly beforehand.
      </p>
      <p class="label">Ways to share your days</p>
      <ul class="days">
        {#each DAYS as d, k}<li style="--k: {k}">{d}</li>{/each}
      </ul>
      <p class="label">Bring your craft</p>
      <div class="join-cards">
        {#each JOIN as j, k}
          <div class="card" style="--k: {k}">
            <h3>{j.title}</h3>
            <p class="who">{j.who}</p>
            <dl>
              <dt>How it works</dt>
              <dd>{j.how}</dd>
              <dt>Flows back</dt>
              <dd>{j.back}</dd>
            </dl>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if view === 'patterns'}
    <div class="patterns" in:fly={{ y: 28 * tabDir, duration: 600, opacity: 0 }}>
      {#if pattern < 0}
        <p class="join-lede">
          The patterns that shape how we live, work and share, each drawn in the same hand. Choose one to look closer, or
          read more in the <a href="/frameworks">frameworks</a>.
        </p>
        <div class="pattern-grid">
          {#each PATTERNS as p, k}
            <button type="button" class="pattern" style="--k: {k}" on:click={() => (pattern = k)}>
              <img src="/images/concepts/{p.file}.svg" alt="" width="800" height="800" loading="lazy" />
              <span>{p.name}</span>
            </button>
          {/each}
        </div>
      {:else}
        {#key pattern}
          <div class="pattern-open" in:fade={{ duration: 350 }}>
            <img src="/images/concepts/{PATTERNS[pattern].file}.svg" alt={PATTERNS[pattern].name} width="800" height="800" />
            <div>
              <button type="button" class="link" on:click={() => (pattern = -1)}>← All patterns</button>
              <h2>{PATTERNS[pattern].name}</h2>
              <p>{PATTERNS[pattern].note}</p>
              <div class="controls">
                <button type="button" on:click={() => stepPattern(-1)} aria-label="Previous pattern">←</button>
                <button type="button" on:click={() => stepPattern(1)} aria-label="Next pattern">→</button>
              </div>
            </div>
          </div>
        {/key}
      {/if}
    </div>
  {/if}
</div>

<style>
  /* The views fill what the page gives them; only long details scroll
     inside their own panel */
  .views {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  h2 {
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    text-transform: none;
    color: var(--bark-900);
  }

  /* The views, chosen with the same pen loop as the dock's current page */
  .switch {
    position: relative;
    display: flex;
    gap: 4px;
    margin: 0 0 10px -16px;
  }

  /* The loop glides between tabs, and rocks gently where it rests */
  .loop {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    cursor: grab;
    touch-action: none;
    transition: transform 0.6s cubic-bezier(0.3, 0.8, 0.2, 1), width 0.6s cubic-bezier(0.3, 0.8, 0.2, 1);
  }

  .loop::before {
    content: '';
    position: absolute;
    inset: 2px -2px;
    background: url('/images/dock-loop.svg') center / 100% 100% no-repeat;
    filter: brightness(0);
    opacity: 0.7;
    animation: rock 2.6s ease-in-out infinite reverse;
  }

  .loop.dragging {
    cursor: grabbing;
    transition: none;
  }

  .loop.dragging::before {
    animation: none;
    opacity: 0.9;
  }

  .switch button {
    position: relative;
    padding: 8px 16px;
    border: 0;
    background: none;
    font: inherit;
    font-size: 0.95rem;
    color: var(--bark-600);
    cursor: pointer;
  }

  .switch button.on {
    color: var(--bark-900);
  }

  /* The chosen tab rocks gently, its loop a little out of step with its
     word, to invite a look at the others */
  .switch button.on {
    animation: rock 3.2s ease-in-out infinite;
  }

  @keyframes rock {
    0%,
    100% {
      transform: rotate(-2deg);
    }
    50% {
      transform: rotate(2deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .switch button.on,
    .loop::before {
      animation: none;
    }
  }

  .label {
    margin: 14px 0 6px;
    font-size: 0.64rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--bark-500);
  }

  .disc {
    flex: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 38%, #fff, var(--oat-200) 75%);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--bark-900) 40%, transparent);
  }

  .milestone > .disc,
  .milestone .tile-top .disc {
    background: radial-gradient(circle at 40% 38%, #fff, var(--ember-200) 70%);
    box-shadow: inset 0 0 0 1px var(--ember-600), 0 0 10px color-mix(in srgb, var(--ember-400) 55%, transparent);
  }

  /* --- 8 forms of capital: a flower of eight circles ------------------- */
  /* The flower is sized by the height it is given, so it always fits on
     screen; the details beside it scroll on their own if long */
  .flower-view {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    gap: 32px;
  }

  .flower {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .petal {
    cursor: pointer;
    outline: none;
  }

  .petal circle {
    fill: var(--tint);
    fill-opacity: 0.32;
    stroke: color-mix(in srgb, var(--bark-900) 22%, transparent);
    stroke-width: 1;
    mix-blend-mode: multiply;
    transform-origin: 230px 230px;
    transition: fill-opacity 0.4s ease, stroke 0.4s ease;
    animation: bloom 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
    animation-delay: calc(var(--k) * 80ms);
  }

  @keyframes bloom {
    from {
      opacity: 0;
      transform: scale(0.2) rotate(-40deg);
    }
  }

  .petal:hover circle,
  .petal:focus-visible circle {
    fill-opacity: 0.5;
  }

  .petal.on circle {
    fill-opacity: 0.7;
    stroke: color-mix(in srgb, var(--bark-900) 55%, transparent);
  }

  .plabel,
  .heart-label,
  .heart-sub {
    text-anchor: middle;
    pointer-events: none;
  }

  .plabel {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 300;
    fill: var(--bark-800);
  }

  .plabel.on {
    font-weight: 500;
    fill: var(--bark-900);
  }

  .heart {
    fill: var(--oat-100);
    stroke: color-mix(in srgb, var(--bark-900) 30%, transparent);
  }

  .heart-label {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 20px;
    font-weight: 300;
    fill: var(--bark-900);
  }

  .heart-sub {
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    fill: var(--bark-500);
  }

  .detail {
    min-height: 0;
    align-self: center;
    max-height: 100%;
    overflow-y: auto;
    padding-right: 8px;
    scrollbar-width: thin;
    font-size: 0.88rem;
    line-height: 1.55;
    color: var(--bark-700);
  }

  .detail h2 {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 4px;
    font-size: clamp(1.6rem, 1.6vw + 1.2vh, 2.2rem);
  }

  .detail h2 i,
  .orbs i,
  .tile-caps i {
    border-radius: 50%;
    background: radial-gradient(circle closest-side, color-mix(in srgb, var(--tint) 90%, transparent), color-mix(in srgb, var(--tint) 30%, transparent) 80%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--bark-900) 22%, transparent);
  }

  .detail h2 i {
    width: 32px;
    height: 32px;
  }

  .cols {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 24px;
  }

  .what {
    margin: 0;
    font-size: 1rem;
    color: var(--bark-800);
  }

  .flow,
  .criteria {
    margin: 0;
  }

  .criteria {
    font-size: 0.86rem;
    color: var(--bark-600);
  }

  .link {
    margin-top: 6px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: var(--rust-700);
    border-bottom: 1px solid currentColor;
    cursor: pointer;
  }

  .dots {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 4px;
  }

  .dots li {
    position: relative;
    padding-left: 18px;
  }

  .dots li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5em;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--tint);
  }

  .chips {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
  }

  .chip {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 4px 10px 4px 6px;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, white 55%, transparent);
    font: inherit;
    font-size: 0.74rem;
    color: var(--bark-800);
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .chip:hover {
    background: color-mix(in srgb, white 90%, transparent);
  }

  /* --- Lunations: the arc of the year and the open moon's story ---------- */
  .arc-view {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .timeline {
    position: relative;
    flex: none;
    height: 128px;
  }

  .sky {
    position: absolute;
    inset: 0 auto auto 0;
    overflow: visible;
    pointer-events: none;
  }

  .sky path {
    fill: none;
    stroke-linecap: round;
  }

  .path-base {
    stroke: color-mix(in srgb, var(--bark-900) 22%, transparent);
    stroke-width: 1;
  }

  /* The walked part of the year grows to the chosen moon */
  .path-walked {
    stroke: var(--bark-800);
    stroke-width: 1.4;
    stroke-dasharray: 1;
    transition: stroke-dashoffset 0.9s cubic-bezier(0.6, 0, 0.2, 1);
  }

  .tmoon {
    position: absolute;
    display: grid;
    justify-items: center;
    gap: 2px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: var(--bark-600);
    cursor: pointer;
    transform: translate(-50%, -11px);
    animation: rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
    animation-delay: calc(var(--i) * 45ms);
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translate(-50%, 6px);
    }
  }

  .tmoon .disc {
    width: 22px;
    height: 22px;
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease;
  }

  .tmoon.past .disc {
    background: radial-gradient(circle at 40% 38%, #fff, var(--oat-300) 80%);
  }

  .tmoon:hover .disc {
    transform: scale(1.15);
  }

  .tmoon.on .disc {
    transform: scale(1.45);
    box-shadow:
      inset 0 0 0 1px var(--bark-800),
      0 0 0 6px color-mix(in srgb, white 55%, transparent),
      0 0 22px color-mix(in srgb, var(--ember-300) 70%, transparent);
  }

  .tmoon.milestone .disc {
    width: 32px;
    height: 32px;
  }

  .tmoon.milestone {
    transform: translate(-50%, -16px);
  }

  .num {
    display: grid;
    justify-items: center;
    margin-top: 6px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 0.85rem;
    line-height: 1.1;
    color: var(--bark-800);
  }

  .num small {
    font-family: 'Quicksand', system-ui, sans-serif;
    font-size: 0.5rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--bark-500);
  }

  .tmoon.on .num {
    font-weight: 500;
  }

  .mon {
    font-size: 0.66rem;
    color: var(--bark-500);
  }

  /* The open lunation's story, on a soft glow in its season's colour */
  .stage {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 12px 26px 16px;
    border-radius: 28px;
    background: radial-gradient(90% 120% at 20% 0%, color-mix(in srgb, var(--season) 70%, transparent), color-mix(in srgb, var(--season) 20%, transparent) 70%, transparent);
    transition: background 0.9s ease;
    scrollbar-width: thin;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
  }

  .controls button {
    border: 0;
    border-radius: 999px;
    padding: 7px 14px;
    background: color-mix(in srgb, white 55%, transparent);
    font: inherit;
    font-size: 0.85rem;
    color: var(--bark-800);
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .controls button:hover:not(:disabled) {
    background: color-mix(in srgb, white 85%, transparent);
  }

  .controls button:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .story {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 0.8fr);
    gap: 32px;
    font-size: 0.92rem;
    line-height: 1.6;
    color: var(--bark-700);
  }

  .when {
    margin: 0 0 6px;
    font-size: 0.7rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--bark-500);
  }

  .story h2 {
    margin: 0;
    font-size: clamp(1.5rem, 2.4vw + 0.8vh, 2.4rem);
    line-height: 1.1;
  }

  .story.milestone h2 {
    font-size: clamp(2.2rem, 4.4vw, 3.4rem);
  }

  .theme {
    margin: 4px 0 0;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: 1.15rem;
    color: var(--bark-700);
  }

  .season {
    margin: 2px 0 10px;
    font-size: 0.85rem;
    color: var(--rust-700);
  }

  .about {
    max-width: 52ch;
    margin: 0;
    font-size: 1.02rem;
  }

  /* The capitals arrive one after another as glowing circles */
  .orbs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .orbs li {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--bark-800);
    animation: pop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.3) backwards;
    animation-delay: calc(0.35s + var(--k) * 0.09s);
  }

  .orbs i {
    width: 22px;
    height: 22px;
  }

  @keyframes pop {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
  }

  /* The sky: small drawn glyphs for the new moon, full moon, sun and day */
  .sky-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 3px;
    font-size: 0.84rem;
  }

  .sky-list li {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .glyph {
    flex: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .glyph.new {
    box-shadow: inset 0 0 0 1px var(--bark-700);
  }

  .glyph.full {
    background: radial-gradient(circle at 40% 38%, #fff, var(--oat-300));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--bark-900) 35%, transparent);
  }

  .glyph.sun {
    background: var(--ember-300);
    box-shadow: 0 0 6px var(--ember-300);
  }

  .glyph.day {
    background: linear-gradient(90deg, var(--ember-200) 50%, var(--bark-300) 50%);
  }

  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 2px;
  }

  .list li {
    position: relative;
    padding-left: 12px;
  }

  .list li::before {
    content: '·';
    position: absolute;
    left: 2px;
    color: var(--bark-500);
  }

  /* --- Grid: all fifteen lunations at a glance --------------------------- */
  .grid {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-auto-rows: minmax(0, 1fr);
    gap: 12px;
    padding: 2px;
    scrollbar-width: thin;
  }

  .tile {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 0;
    padding: 14px 16px;
    border: 0;
    border-radius: 18px;
    background: radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, white 70%, transparent), color-mix(in srgb, white 25%, transparent) 70%, transparent);
    font: inherit;
    text-align: left;
    color: var(--bark-700);
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease;
    animation: rise-tile 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
    animation-delay: calc(var(--i) * 35ms);
  }

  @keyframes rise-tile {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
  }

  .tile:hover {
    transform: translateY(-3px);
    background: radial-gradient(120% 90% at 50% 0%, white, color-mix(in srgb, white 40%, transparent) 70%, transparent);
  }

  .tile.milestone {
    background: radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--ember-200) 80%, white), color-mix(in srgb, var(--rosehip-200) 35%, transparent) 75%, transparent);
  }

  .tile-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tile-when {
    font-size: 0.68rem;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--bark-500);
  }

  .tile-theme {
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: 1.1rem;
    line-height: 1.2;
    color: var(--bark-900);
  }

  .tile-sub {
    font-size: 0.8rem;
    line-height: 1.3;
    color: var(--bark-700);
  }

  .tile-season {
    font-size: 0.75rem;
    color: var(--rust-700);
  }

  .tile-sky {
    font-size: 0.7rem;
    color: var(--bark-500);
  }

  .tile-caps {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: auto;
  }

  .tile-caps i {
    width: 14px;
    height: 14px;
  }

  .link {
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: var(--rust-700);
    border-bottom: 1px solid currentColor;
    cursor: pointer;
  }

  .views a {
    color: var(--rust-700);
    text-decoration: none;
    border-bottom: 1px solid currentColor;
  }

  /* --- Game B ------------------------------------------------------------ */
  .gameb {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(200px, 340px) minmax(0, 1fr);
    gap: 48px;
    align-items: center;
    overflow-y: auto;
  }

  /* The art's circle of players sits off-centre, with the old game's board
     of squares in a corner; the round frame crops close around the circle */
  .gameb .art {
    width: min(100%, 44vh);
    justify-self: center;
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
    animation: pop 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
  }

  .gameb .art img {
    display: block;
    width: 154%;
    max-width: none;
    height: auto;
    margin: -19.25% 0 0 -36.6%;
  }

  .gameb-text {
    max-width: 66ch;
    font-size: 0.92rem;
    line-height: 1.6;
    color: var(--bark-700);
  }

  .gameb-text p {
    margin: 0 0 9px;
  }

  .gameb-text .big {
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: clamp(1.05rem, 0.8vw + 0.8vh, 1.3rem);
    line-height: 1.45;
    color: var(--bark-900);
  }

  .small {
    font-size: 0.86rem;
    color: var(--bark-600);
  }

  /* Cards: soft glows that rise in one after another */
  .card {
    padding: 14px 16px 16px;
    border-radius: 18px;
    background: radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, white 75%, transparent), color-mix(in srgb, white 30%, transparent) 75%, transparent);
    animation: rise-tile 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
    animation-delay: calc(0.1s + var(--k) * 70ms);
  }

  .card h3,
  .impact h2,
  .impact h3 {
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    text-transform: none;
    color: var(--bark-900);
  }

  .card h3 {
    margin: 0 0 8px;
    font-size: 1.1rem;
  }

  .card ul,
  .items {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 9px;
  }

  .card li,
  .items li {
    display: grid;
    gap: 1px;
  }

  .item-name {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    font-weight: 600;
    font-size: 0.88rem;
    color: var(--bark-900);
  }

  .item-by {
    font-size: 0.76rem;
    color: var(--rust-700);
  }

  .item-note {
    font-size: 0.84rem;
    line-height: 1.45;
    color: var(--bark-700);
  }

  .today {
    display: inline-block;
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--olive-800);
    background: color-mix(in srgb, var(--olive-200) 70%, transparent);
  }

  /* The Financial petal widens its panel for the money cards */
  .flower-view:has(.detail.wide) {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  }

  /* Money cards list the flows by name; each one's note shows on hover */
  .money {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 8px;
  }

  .money .card {
    padding: 10px 12px 12px;
  }

  .money .card h3 {
    font-size: 0.95rem;
    margin-bottom: 4px;
  }

  .money ul {
    gap: 2px;
  }

  .money .item-note {
    display: none;
  }

  .money-item {
    cursor: help;
  }

  .money .item-name {
    font-weight: 500;
    font-size: 0.8rem;
  }

  /* --- Impact & learning ------------------------------------------------- */
  .impact {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    gap: 40px;
    overflow-y: auto;
    padding-right: 8px;
    scrollbar-width: thin;
    font-size: 0.8rem;
    line-height: 1.45;
    color: var(--bark-700);
  }

  .impact h2 {
    margin: 0 0 4px;
    font-size: 1.2rem;
  }

  .impact h3 {
    margin: 18px 0 8px;
    font-size: 1.15rem;
  }



  .path {
    margin: 4px 0 12px;
    padding-left: 1.2rem;
    display: grid;
    gap: 3px;
  }

  .path strong {
    color: var(--bark-900);
  }

  /* Now-and-target bars: a filled circle for now, an open one for Lunation
     100, the line between them drawing itself in */
  .ab-lede {
    max-width: 62ch;
  }

  .key {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    vertical-align: middle;
  }

  .key.now {
    background: var(--bark-700);
  }

  .key.target {
    box-shadow: inset 0 0 0 1.5px var(--bark-700);
  }

  .scale {
    position: relative;
    height: 16px;
    margin: 6px 64px 0 140px;
    font-size: 0.66rem;
    color: var(--bark-500);
  }

  .scale span {
    position: absolute;
    transform: translateX(-50%);
  }

  .bars {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 2px;
  }

  .bars li,
  .bars button {
    display: grid;
    grid-template-columns: 140px 1fr 64px;
    align-items: center;
  }

  .bars li {
    animation: rise-tile 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
    animation-delay: calc(var(--k) * 50ms);
  }

  .bars button {
    grid-column: 1 / -1;
    width: 100%;
    padding: 7px 0;
    border: 0;
    border-radius: 12px;
    background: none;
    font: inherit;
    text-align: left;
    color: inherit;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .bars button:hover {
    background: color-mix(in srgb, white 55%, transparent);
  }

  .bar-name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 1rem;
    color: var(--bark-900);
  }

  .bar-name i,
  .open-cap h3 i {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(circle closest-side, color-mix(in srgb, var(--tint) 90%, transparent), color-mix(in srgb, var(--tint) 30%, transparent) 80%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--bark-900) 22%, transparent);
  }

  .track {
    position: relative;
    height: 18px;
    background: linear-gradient(transparent 8.5px, color-mix(in srgb, var(--bark-900) 12%, transparent) 8.5px, color-mix(in srgb, var(--bark-900) 12%, transparent) 9.5px, transparent 9.5px);
  }

  .span {
    position: absolute;
    top: 7px;
    height: 4px;
    border-radius: 2px;
    background: color-mix(in srgb, var(--tint, var(--ember-300)) 80%, transparent);
    transform-origin: left;
    animation: grow 0.9s cubic-bezier(0.6, 0, 0.2, 1) backwards;
    animation-delay: calc(0.2s + var(--k) * 50ms);
  }

  @keyframes grow {
    from {
      transform: scaleX(0);
    }
  }

  .dot {
    position: absolute;
    top: 3px;
    width: 12px;
    height: 12px;
    margin-left: -6px;
    border-radius: 50%;
  }

  .dot.now {
    background: var(--bark-800);
  }

  .dot.target {
    background: var(--oat-100);
    box-shadow: inset 0 0 0 1.5px var(--bark-800);
    animation: pop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.3) backwards;
    animation-delay: calc(0.8s + var(--k) * 50ms);
  }

  .nums {
    justify-self: end;
    font-size: 0.75rem;
    color: var(--bark-600);
  }

  .open-cap h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 4px 0 6px;
    font-size: 1.3rem;
  }

  .open-cap h3 .nums {
    margin-left: auto;
  }

  .back {
    font-size: 0.82rem;
  }

  .bars.small li {
    padding: 1px 0;
  }

  .bars.small li {
    grid-template-columns: 220px 1fr 64px;
  }

  .bars.small .bar-name {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 10px;
    font-family: 'Quicksand', system-ui, sans-serif;
    font-size: 0.74rem;
    line-height: 1.2;
    color: var(--bark-800);
  }

  .bars.small .track {
    height: 14px;
    background: linear-gradient(transparent 6.5px, color-mix(in srgb, var(--bark-900) 12%, transparent) 6.5px, color-mix(in srgb, var(--bark-900) 12%, transparent) 7.5px, transparent 7.5px);
  }

  .bars.small .span {
    top: 5px;
  }

  .bars.small .dot {
    top: 2px;
    width: 10px;
    height: 10px;
    margin-left: -5px;
  }

  .learn .spaced {
    margin-top: 14px;
  }

  /* How we learn: short names in two columns; each one's note on hover */
  .practice {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px 16px;
    font-weight: 600;
    font-size: 0.8rem;
    color: var(--bark-900);
  }

  .practice li {
    position: relative;
    padding-left: 14px;
    cursor: help;
  }

  .practice li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.45em;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--ember-300);
  }

  .sources {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .sources .card {
    padding: 10px 12px 12px;
  }

  .sources .card h3 {
    font-size: 0.95rem;
    margin-bottom: 4px;
  }

  .sources ul {
    gap: 4px;
  }

  .sources li {
    cursor: help;
  }

  .sources .item-name {
    font-weight: 500;
    font-size: 0.8rem;
    gap: 6px;
  }

  .sources .item-by {
    font-weight: 400;
    font-size: 0.72rem;
  }

  .impact .item-note {
    font-size: 0.74rem;
    line-height: 1.35;
  }

  .impact .item-name {
    font-size: 0.8rem;
  }

  .impact p {
    margin: 0 0 6px;
  }

  .impact .items {
    gap: 7px;
  }

  /* --- Flows I can join -------------------------------------------------- */
  .join {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .join-lede {
    max-width: 90ch;
    margin: 0 0 8px;
    font-size: 0.88rem;
    line-height: 1.6;
    color: var(--bark-700);
  }

  .join-cards {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }

  .join .card {
    padding: 8px 14px 10px;
  }

  .join dl {
    font-size: 0.76rem;
    line-height: 1.35;
  }

  .join dt {
    margin-top: 3px;
  }

  .join .card h3 {
    margin-bottom: 0;
    font-size: 1.05rem;
  }

  .days {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    list-style: none;
    margin: 0 0 4px;
    padding: 0;
  }

  .days li {
    padding: 4px 12px;
    border-radius: 999px;
    background: color-mix(in srgb, white 60%, transparent);
    font-size: 0.78rem;
    color: var(--bark-800);
    animation: pop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1.3) backwards;
    animation-delay: calc(var(--k) * 40ms);
  }

  .who {
    margin: 0 0 2px;
    font-size: 0.74rem;
    color: var(--rust-700);
  }

  dl {
    display: grid;
    gap: 1px;
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.4;
    color: var(--bark-700);
  }

  dt {
    margin-top: 4px;
    font-size: 0.6rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--bark-500);
  }

  dd {
    margin: 0;
  }

  /* --- Pattern Languages ------------------------------------------------ */
  .patterns {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .pattern-grid {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: repeat(2, minmax(0, 1fr));
    gap: 10px 20px;
  }

  .pattern {
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: var(--bark-800);
    cursor: pointer;
    animation: pop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.2) backwards;
    animation-delay: calc(var(--k) * 60ms);
  }

  .pattern img {
    flex: 1;
    min-height: 0;
    max-width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 50%;
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .pattern:hover img {
    transform: scale(1.05);
  }

  .pattern span {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 0.95rem;
  }

  .pattern-open {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    grid-template-columns: auto minmax(0, 1fr);
    gap: 48px;
    align-items: center;
  }

  .pattern-open img {
    height: 100%;
    max-height: 52vh;
    width: auto;
    aspect-ratio: 1;
    border-radius: 50%;
  }

  .pattern-open h2 {
    margin: 10px 0 8px;
    font-size: clamp(1.8rem, 2.4vw + 1vh, 2.8rem);
  }

  .pattern-open p {
    max-width: 46ch;
    font-size: 1.05rem;
    line-height: 1.6;
    color: var(--bark-700);
  }

  .pattern-open .controls {
    justify-content: flex-start;
    margin-top: 14px;
  }

  @media (prefers-reduced-motion: reduce) {
    .card,
    .gameb .art {
      animation: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tmoon,
    .orbs li,
    .tile,
    .petal circle {
      animation: none;
    }

    .path-walked,
    .stage {
      transition: none;
    }
  }

  /* On phones the views stack and scroll within themselves */
  @media (max-width: 760px) {
    .flower-view {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      overflow-y: auto;
    }

    .flower {
      height: auto;
      max-width: 340px;
      margin: 0 auto;
    }

    .detail {
      max-height: none;
      overflow: visible;
    }

    .timeline {
      height: 130px;
    }

    .mon {
      display: none;
    }

    .num {
      font-size: 0.7rem;
    }

    .num small {
      display: none;
    }

    .tmoon .disc {
      width: 14px;
      height: 14px;
    }

    .tmoon.milestone .disc {
      width: 22px;
      height: 22px;
    }

    .stage {
      padding: 14px 16px 18px;
    }

    .story {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: auto;
    }

    .switch {
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .switch button {
      white-space: nowrap;
    }

    .gameb,
    .impact {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .gameb .art {
      max-width: 200px;
    }

    .join-cards {
      grid-template-columns: 1fr;
    }
  }
</style>
