<script>
  import { onMount } from 'svelte';
  import { phase_hunt } from 'lune';
  import YearTimeline from './YearTimeline.svelte';
  import { toEvents, noteColor } from './schedule.js';
  import { lunationAt } from './lunation.js';

  const DAY_MS = 86_400_000;

  let quests = $state([]);
  let loading = $state(true);
  let error = $state('');
  let now = $state(new Date());
  let year = $state(new Date().getFullYear());
  let opened = $state(null);

  const events = $derived(toEvents(quests, year));
  const lunations = $derived(lunationsOf(year, events));

  // The lunation we're in, close up under the year: the same line, spanning
  // only new moon to new moon (`to` is the cycle's last ms). Its cards come
  // from the years it touches, so one straddling New Year keeps both sides.
  const current = $derived(lunationAt(now.getTime()));
  const currentRange = $derived({ from: current.from, to: current.to + 1 });
  const currentTitle = $derived(
    `Lunation ${current.index} · ${short(new Date(currentRange.from))} – ${short(new Date(currentRange.to))}`
  );
  const currentEvents = $derived.by(() => {
    const years = new Set([new Date(currentRange.from).getFullYear(), new Date(currentRange.to).getFullYear()]);
    const byId = new Map();
    for (const y of years) for (const ev of toEvents(quests, y)) byId.set(ev.id, ev);
    return [...byId.values()];
  });

  async function load() {
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/calendar');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      quests = data.quests;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  // The year's lunations, named and timed like the homepage timer and the
  // bot's /newmoon: each new moon from core's `lunationAt`, its full moon
  // from lune's exact phase search.
  function lunationsOf(y, evs) {
    const list = [];
    const end = new Date(y + 1, 0, 1).getTime();
    let cycle = lunationAt(new Date(y, 0, 1).getTime());
    while (cycle.from < end) {
      const start = new Date(cycle.from);
      const next = new Date(cycle.to + 1);
      const full = phase_hunt(new Date(cycle.from + DAY_MS)).full_date;
      const cards = evs.filter((e) => e.date >= start && e.date < next);
      list.push({ index: cycle.index, start, full, next, cards, current: now >= start && now < next });
      cycle = lunationAt(cycle.to + 1);
    }
    return list;
  }

  const fmt = (d, opts) => d.toLocaleDateString('en-GB', opts);
  const short = (d) => fmt(d, { day: 'numeric', month: 'short' });

  function when(ev) {
    const day = fmt(ev.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (ev.multiDay) return `${short(ev.date)} – ${short(ev.end ?? ev.date)} (${ev.days} days)`;
    if (ev.allDay) return day;
    const time = ev.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const until = ev.end ? `–${ev.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : '';
    return `${day}, ${time}${until}`;
  }

  function onkeydown(e) {
    if (e.key === 'Escape') opened = null;
  }

  onMount(() => {
    load();
    const tick = setInterval(() => (now = new Date()), 60_000);
    return () => clearInterval(tick);
  });
</script>

<svelte:window {onkeydown} />

<nav class="nav">
  <div class="wrap navin">
    <a href="/" class="brand">Liminal Village</a>
    <div class="links">
      <a href="/quests">Quests</a>
      <a href="/services">Services</a>
      <a href="/frameworks">Frameworks</a>
      <a href="/lunations" class="active" aria-current="page">Lunations</a>
    </div>
  </div>
</nav>

<header class="hero">
  <div class="wrap">
    <p class="eyebrow">Lunations</p>
    <h1 class="display">The year in moons</h1>
    <p class="lead">
      We align our life and work with the lunar cycle — guests often arrive around the new moon. Here is the
      village's year: every new and full moon, the solstices and equinoxes, and what is planned in between.
    </p>
    <p class="access">
      <strong>Reserved for members and supporters.</strong> Taking part in a lunation is open to members and
      supporters of Liminal Village, a node of the <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa network</a>.
      <a href="/apply">Apply to visit</a>
      or <a href="https://opencollective.com/liminal" target="_blank" rel="noopener">become a supporter</a>.
    </p>
  </div>
</header>

<main class="wrap">
  <section class="panel">
    <div class="yearbar">
      <button class="nav-btn" onclick={() => year--} aria-label="Previous year">‹</button>
      <h2 class="display">{year}</h2>
      <button class="nav-btn" onclick={() => year++} aria-label="Next year">›</button>
      {#if year !== now.getFullYear()}
        <button class="btn ghost small" onclick={() => (year = now.getFullYear())}>This year</button>
      {/if}
      {#if loading}<span class="muted small">Loading the village calendar…</span>{/if}
    </div>

    {#if error}
      <p class="notice error">Couldn’t load the village’s plans ({error}). The moons are still here. <button class="link" onclick={load}>Try again</button></p>
    {/if}

    <div class="timeline">
      <YearTimeline {events} {year} {now} noteColorFor={noteColor} onOpen={(ev) => (opened = ev)} />
    </div>

    <div class="timeline">
      <YearTimeline
        events={currentEvents}
        {year}
        range={currentRange}
        title={currentTitle}
        {now}
        noteColorFor={noteColor}
        onOpen={(ev) => (opened = ev)}
      />
    </div>

    <ul class="legend" aria-label="Legend">
      <li><span class="lg-moon new"></span>New moon</li>
      <li><span class="lg-moon"></span>Full moon</li>
      <li><span class="lg-sun"></span>Solstice</li>
      <li><span class="lg-sun half"></span>Equinox</li>
      <li><span class="lg-today"></span>Today</li>
      <li><span class="lg-card"></span>Something planned — tap for details</li>
    </ul>
  </section>

  <section class="moons">
    <h2 class="display">Lunations of {year}</h2>
    <ol class="lunations">
      {#each lunations as l (l.start.toISOString())}
        <li class:current={l.current} class:past={l.next < now}>
          <span class="num" title="Lunation {l.index}">{l.index}</span>
          <div class="phases">
            <span><i class="dot new"></i>{short(l.start)}</span>
            <span><i class="dot"></i>{short(l.full)}</span>
          </div>
          <span class="count">
            {#if l.current}<strong>Now</strong>{/if}
            {#if l.cards.length}<span>{l.cards.length} planned</span>{/if}
          </span>
        </li>
      {/each}
    </ol>
  </section>
</main>

<footer class="foot">
  <div class="wrap">© Liminal Village · Ascoli Piceno, Italy · <a href="/">liminalvillage.com</a></div>
</footer>

{#if opened}
  <div class="scrim" onclick={() => (opened = null)} aria-hidden="true"></div>
  <div class="detail" role="dialog" aria-modal="true" aria-labelledby="ev-title">
    <span class="swatch" style="background: {noteColor(opened.category)}"></span>
    <h3 id="ev-title" class="display">{opened.title}</h3>
    <p class="when">{when(opened)}</p>
    <dl>
      {#if opened.category}<dt>Category</dt><dd>{opened.category}</dd>{/if}
      {#if opened.location}<dt>Where</dt><dd>{opened.location}</dd>{/if}
      {#if opened.recurring}<dt>Repeats</dt><dd>Part of a recurring series</dd>{/if}
      {#if opened.completed}<dt>Status</dt><dd>Done</dd>{/if}
    </dl>
    <button class="btn ghost small" onclick={() => (opened = null)}>Close</button>
  </div>
{/if}

<style>
  .nav { position: sticky; top: 0; z-index: 20; background: rgba(250, 248, 245, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
  .navin { display: flex; align-items: center; justify-content: space-between; height: 68px; gap: 16px; }
  .brand { font-size: 18px; font-weight: 300; letter-spacing: 5px; text-transform: uppercase; color: var(--ink); white-space: nowrap; }
  .links { display: flex; gap: 22px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
  .links a { color: var(--muted); transition: color 0.2s; }
  .links a:hover, .links a.active { color: var(--gold-dark); }

  .hero { padding: 48px 0 20px; background: radial-gradient(1000px 360px at 85% -20%, #e9e6f3 0%, transparent 60%); }
  .hero h1 { font-size: clamp(36px, 4.6vw, 56px); margin: 10px 0 14px; }
  .lead { font-size: 17px; max-width: 62ch; }
  .access { max-width: 62ch; margin-top: 14px; padding: 12px 16px; border-left: 3px solid var(--gold); background: #fffaf2; border-radius: 0 var(--radius) var(--radius) 0; font-size: 14.5px; }
  .access strong { color: var(--ink); }
  .access a { color: var(--gold-dark); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }

  .panel { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); padding: 18px 18px 14px; margin-top: 18px; }
  .yearbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .yearbar h2 { font-size: 32px; min-width: 3.2ch; text-align: center; }
  .nav-btn { width: 40px; height: 40px; border-radius: 50%; font-size: 24px; line-height: 1; color: var(--ink); transition: background 0.2s; }
  .nav-btn:hover { background: var(--gold-soft); }
  .small { font-size: 13px; }
  .link { color: var(--gold-dark); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
  .notice { margin-top: 10px; }
  /* The kiosk sizes the timeline in rem off its fluid root; give it room. */
  .timeline { font-size: 16px; }

  .legend { display: flex; flex-wrap: wrap; gap: 8px 18px; list-style: none; font-size: 12.5px; color: var(--muted); margin-top: 6px; padding: 0 4px; }
  .legend li { display: inline-flex; align-items: center; gap: 7px; }
  .lg-moon { width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--muted); background: #f4f0e4; }
  .lg-moon.new { background: #1f2a29; }
  .lg-sun { width: 12px; height: 12px; border-radius: 50%; background: #f2c14e; box-shadow: 0 0 6px rgba(242, 193, 78, 0.6); }
  .lg-sun.half { background: linear-gradient(90deg, #7b8794 50%, #f2c14e 50%); box-shadow: none; }
  .lg-today { width: 3px; height: 14px; border-radius: 2px; background: var(--teal); }
  .lg-card { width: 10px; height: 10px; border-radius: 2px; background: var(--note-sky); box-shadow: var(--shadow-soft); }

  .moons { margin: 40px 0 70px; }
  .moons h2 { font-size: 30px; margin-bottom: 14px; }
  .lunations { list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; }
  .lunations li { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 14px; background: var(--card); box-shadow: var(--shadow); border: 1px solid transparent; }
  .lunations li.past { opacity: 0.55; }
  .lunations li.current { border-color: var(--gold); background: #fffaf2; opacity: 1; }
  .num { min-width: 34px; height: 28px; padding: 0 6px; border-radius: 999px; display: grid; place-items: center; background: var(--gold-soft); color: var(--gold-dark); font-weight: 700; font-size: 13px; }
  .phases { display: grid; gap: 2px; font-size: 14px; color: var(--ink); }
  .phases span { display: inline-flex; align-items: center; gap: 7px; }
  .count { display: grid; justify-items: end; font-size: 12.5px; color: var(--muted); white-space: nowrap; }
  .dot { width: 9px; height: 9px; border-radius: 50%; border: 1px solid var(--muted); background: #f4f0e4; }
  .dot.new { background: #1f2a29; }
  .count strong { color: var(--gold-dark); }

  .scrim { position: fixed; inset: 0; z-index: 900; background: rgba(30, 22, 12, 0.3); backdrop-filter: blur(2px); }
  .detail {
    position: fixed; z-index: 901; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: min(420px, calc(100% - 32px)); display: grid; gap: 10px; justify-items: start;
    padding: 24px; border-radius: 20px; background: var(--paper); box-shadow: var(--shadow-lift);
    animation: pop 0.25s var(--ease);
  }
  @keyframes pop { from { opacity: 0; transform: translate(-50%, -46%); } }
  .swatch { width: 36px; height: 6px; border-radius: 3px; }
  .detail h3 { font-size: 26px; }
  .when { font-weight: 600; color: var(--ink); }
  dl { display: grid; grid-template-columns: auto 1fr; gap: 4px 14px; font-size: 14px; }
  dt { color: var(--muted); }
  .foot { padding: 28px 0; border-top: 1px solid var(--line); font-size: 13px; color: var(--muted); }
  .foot a { color: var(--gold-dark); }

  @media (max-width: 820px) {
    .links a:not(.active) { display: none; }
  }
  @media (max-width: 640px) {
    .hero { padding: 32px 0 12px; }
    .lead { font-size: 15.5px; }
    .panel { padding: 12px 8px 10px; border-radius: 14px; }
    .brand { font-size: 15px; letter-spacing: 3px; }
  }
</style>
