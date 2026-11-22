<script>
  import { onMount } from 'svelte';
  import { phase_hunt } from 'lune';
  import YearTimeline from './YearTimeline.svelte';
  import { toEvents, noteColor, isPictogramImage } from './schedule.js';
  import { lunationAt } from './lunation.js';

  const DAY_MS = 86_400_000;

  let quests = $state([]);
  let loading = $state(true);
  let error = $state('');
  let now = $state(new Date());
  let year = $state(new Date().getFullYear());
  // /lunations/<quest id>[?on=YYYY-MM-DD] is an event's own page; /lunations the timeline.
  let route = $state(parseRoute());

  function parseRoute() {
    const m = /^\/lunations\/([^/]+)\/?$/.exec(location.pathname);
    if (!m) return null;
    return { id: decodeURIComponent(m[1]), on: new URLSearchParams(location.search).get('on') || '' };
  }

  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // A click on the timeline opens the event in a modal; from there, its own page.
  let opened = $state(null);
  function openEvent(ev) {
    opened = ev;
  }

  function openPage(ev) {
    opened = null;
    const url = `/lunations/${encodeURIComponent(ev.questId ?? ev.id)}${ev.recurring ? `?on=${ymd(ev.date)}` : ''}`;
    history.pushState({ fromTimeline: true }, '', url);
    route = parseRoute();
    window.scrollTo(0, 0);
  }

  function backToCalendar(e) {
    e?.preventDefault();
    // Opened from the timeline: going back keeps its year and scroll. Landed here directly: go to it.
    if (history.state?.fromTimeline) history.back();
    else {
      history.pushState({}, '', '/lunations');
      route = null;
    }
  }

  // The event the page shows: the quest, and the occurrence asked for (or the next one).
  const page = $derived.by(() => {
    if (!route) return null;
    const quest = quests.find((q) => String(q.id ?? q.title) === route.id);
    if (!quest) return { quest: null };
    const y = now.getFullYear();
    const all = [...toEvents([quest], y - 1), ...toEvents([quest], y), ...toEvents([quest], y + 1)];
    const byId = new Map(all.map((e) => [e.id, e]));
    const occ = [...byId.values()].sort((a, b) => a.date - b.date);
    const upcoming = occ.filter((e) => (e.end ?? e.date) >= now);
    const shown = (route.on && occ.find((e) => ymd(e.date) === route.on)) || upcoming[0] || occ[occ.length - 1];
    return { quest, ev: shown, upcoming: upcoming.filter((e) => e !== shown).slice(0, 6) };
  });

  function applyUrl(ev) {
    const p = new URLSearchParams({ event: ev.title, arrival: ymd(ev.date), departure: ymd(ev.end ?? ev.date) });
    return `/apply?${p}`;
  }

  $effect(() => {
    document.title = page?.ev ? `${page.ev.title} · Lunations · Liminal Village` : 'Lunations · Liminal Village';
  });

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
    if (e.key !== 'Escape') return;
    if (opened) opened = null;
    else if (route) backToCalendar();
  }

  onMount(() => {
    load();
    const onpop = () => (route = parseRoute());
    window.addEventListener('popstate', onpop);
    const tick = setInterval(() => (now = new Date()), 60_000);
    return () => {
      clearInterval(tick);
      window.removeEventListener('popstate', onpop);
    };
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

{#if route}
<main class="wrap event-page">
  <a href="/lunations" class="back" onclick={backToCalendar}>← Back to the calendar</a>
  {#if !page?.quest}
    {#if loading}
      <p class="muted">Loading the event…</p>
    {:else if error}
      <p class="notice error">Couldn’t load the village’s plans ({error}). <button class="link" onclick={load}>Try again</button></p>
    {:else}
      <h1 class="display">Event not found</h1>
      <p>It may have been moved or cancelled. <a class="link" href="/lunations" onclick={backToCalendar}>See the calendar</a>.</p>
    {/if}
  {:else}
    {@const ev = page.ev}
    <article class="event">
      {#if ev.pictogram}
        <span class="picto" style="background: {noteColor(ev.category)}" aria-hidden="true">
          {#if isPictogramImage(ev.pictogram)}<img src={ev.pictogram} alt="" />{:else}{ev.pictogram}{/if}
        </span>
      {:else}
        <span class="swatch" style="background: {noteColor(ev.category)}"></span>
      {/if}
      {#if ev.category}<p class="eyebrow">{ev.category}</p>{/if}
      <h1 class="display">{ev.title}</h1>
      <p class="when">{when(ev)}</p>
      <dl>
        {#if ev.location}<dt>Where</dt><dd>{ev.location}</dd>{/if}
        {#if ev.recurring}<dt>Repeats</dt><dd>Part of a recurring series{page.quest.frequency ? ` (${page.quest.frequency})` : ''}</dd>{/if}
        <dt>Lunation</dt><dd>{lunationAt(ev.date.getTime()).index}</dd>
        {#if ev.completed}<dt>Status</dt><dd>Done</dd>{/if}
      </dl>
      {#if ev.description}
        <div class="desc">{ev.description}</div>
      {/if}
      {#if page.upcoming.length}
        <h2 class="display">Also on</h2>
        <ul class="also">
          {#each page.upcoming as o (o.id)}<li>{when(o)}</li>{/each}
        </ul>
      {/if}
      <div class="apply">
        <p>
          <strong>Want to take part?</strong> Lunations are open to members and supporters of Liminal Village.
          Apply and we’ll get back to you.
        </p>
        <div class="cta">
          <a class="btn gold" href={applyUrl(ev)}>Apply to join →</a>
          <a class="btn ghost" href="https://opencollective.com/liminal" target="_blank" rel="noopener">Become a supporter</a>
        </div>
      </div>
    </article>
  {/if}
</main>
{:else}
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
      <YearTimeline {events} {year} {now} noteColorFor={noteColor} onOpen={openEvent} />
    </div>

    <div class="timeline">
      <YearTimeline
        events={currentEvents}
        {year}
        range={currentRange}
        title={currentTitle}
        {now}
        noteColorFor={noteColor}
        onOpen={openEvent}
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
{/if}

{#if opened}
  {@const ev = opened}
  <div class="scrim" onclick={() => (opened = null)} aria-hidden="true"></div>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button class="close" onclick={() => (opened = null)} aria-label="Close">×</button>
    <div class="modal-head">
      {#if ev.pictogram}
        <span class="picto small" style="background: {noteColor(ev.category)}" aria-hidden="true">
          {#if isPictogramImage(ev.pictogram)}<img src={ev.pictogram} alt="" />{:else}{ev.pictogram}{/if}
        </span>
      {:else}
        <span class="swatch" style="background: {noteColor(ev.category)}"></span>
      {/if}
      <div>
        {#if ev.category}<p class="eyebrow">{ev.category}</p>{/if}
        <h3 id="modal-title" class="display">{ev.title}</h3>
      </div>
    </div>
    <p class="when">{when(ev)}</p>
    <dl>
      {#if ev.location}<dt>Where</dt><dd>{ev.location}</dd>{/if}
      {#if ev.recurring}<dt>Repeats</dt><dd>Part of a recurring series</dd>{/if}
      <dt>Lunation</dt><dd>{lunationAt(ev.date.getTime()).index}</dd>
      {#if ev.completed}<dt>Status</dt><dd>Done</dd>{/if}
    </dl>
    {#if ev.description}<div class="desc modal-desc">{ev.description}</div>{/if}
    <div class="cta">
      <a class="btn gold" href={applyUrl(ev)}>Apply to join →</a>
      <a class="btn ghost" href="/lunations/{encodeURIComponent(ev.questId ?? ev.id)}" onclick={(e) => { e.preventDefault(); openPage(ev); }}>Full page</a>
    </div>
  </div>
{/if}

<footer class="foot">
  <div class="wrap">© Liminal Village · Ascoli Piceno, Italy · <a href="/">liminalvillage.com</a></div>
</footer>

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

  .event-page { padding: 28px 0 70px; }
  .back { display: inline-block; margin-bottom: 18px; font-size: 14px; font-weight: 600; color: var(--gold-dark); }
  .event { max-width: 720px; display: grid; gap: 14px; justify-items: start; background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); padding: 28px; }
  .event h1 { font-size: clamp(30px, 4vw, 46px); line-height: 1.1; }
  .event h2 { font-size: 22px; margin-top: 6px; }
  .swatch { width: 44px; height: 7px; border-radius: 4px; }
  .picto { width: 56px; height: 56px; border-radius: 14px; display: grid; place-items: center; font-size: 30px; line-height: 1; }
  .picto img { width: 34px; height: 34px; object-fit: contain; }
  .picto.small { width: 46px; height: 46px; border-radius: 12px; font-size: 24px; flex: none; }
  .picto.small img { width: 28px; height: 28px; }

  .scrim { position: fixed; inset: 0; z-index: 900; background: rgba(30, 22, 12, 0.35); backdrop-filter: blur(2px); animation: fade 0.2s ease; }
  .modal {
    position: fixed; z-index: 901; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: min(560px, calc(100% - 32px)); max-height: calc(100vh - 48px); overflow-y: auto;
    display: grid; gap: 12px; justify-items: start;
    padding: 26px 26px 22px; border-radius: 20px; background: var(--paper, #fff); box-shadow: var(--shadow-lift, 0 20px 60px rgba(0, 0, 0, 0.2));
    animation: pop 0.22s ease;
  }
  @keyframes pop { from { opacity: 0; transform: translate(-50%, -46%); } }
  @keyframes fade { from { opacity: 0; } }
  .modal-head { display: flex; align-items: center; gap: 14px; padding-right: 28px; }
  .modal-head .eyebrow { margin-bottom: 2px; }
  .modal h3 { font-size: 26px; line-height: 1.15; }
  .modal .modal-desc { font-size: 15px; line-height: 1.65; }
  .modal .cta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; }
  .close { position: absolute; top: 12px; right: 14px; width: 34px; height: 34px; border-radius: 50%; font-size: 24px; line-height: 1; color: var(--muted); }
  .close:hover { background: var(--gold-soft); color: var(--ink); }
  .when { font-weight: 600; color: var(--ink); font-size: 17px; }
  .desc { white-space: pre-line; font-size: 16px; line-height: 1.75; color: var(--ink); max-width: 64ch; }
  .also { list-style: none; display: grid; gap: 4px; font-size: 14.5px; color: var(--muted); }
  .apply { width: 100%; margin-top: 10px; padding: 16px 18px; border-left: 3px solid var(--gold); background: #fffaf2; border-radius: 0 var(--radius) var(--radius) 0; display: grid; gap: 12px; }
  .apply .cta { display: flex; flex-wrap: wrap; gap: 10px; }
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
