<script>
  import { onMount } from 'svelte';
  import PractitionerCard from './PractitionerCard.svelte';
  import BookingFlow from './BookingFlow.svelte';
  import Cancel from './Cancel.svelte';
  import Admin from './Admin.svelte';
  import { api } from './api.js';

  // Steward area: /services?admin (canonical) or /services/admin.
  const isAdmin = location.pathname.replace(/\/+$/, '') === '/services/admin' || new URLSearchParams(location.search).has('admin');

  let people = $state([]);
  let loading = $state(true);
  let error = $state('');
  let query = $state('');
  let filter = $state('all'); // all | available | <tag>
  let openId = $state(new URLSearchParams(location.search).get('p'));
  let cancelToken = $state(new URLSearchParams(location.search).get('cancel'));
  let pushed = false;

  const open = $derived(people.find((x) => x.id === openId) ?? null);
  const tagOf = (x) => (x.role || x.category || '').toLowerCase();
  const tags = $derived([...new Set(people.map(tagOf).filter(Boolean))].sort());
  const stats = $derived({
    villagers: people.length,
    offering: people.filter((x) => x.offer).length,
    slots: people.reduce((n, x) => n + (x.openCount || 0), 0),
  });
  const shown = $derived(
    people.filter((x) => {
      if (filter === 'available' && !x.openCount) return false;
      if (filter !== 'all' && filter !== 'available' && tagOf(x) !== filter) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return [x.name, x.ikigai, x.role, x.category, x.offer?.title, x.offer?.description, ...(x.values ?? []), ...(x.offers ?? []).map((o) => o.title)]
        .filter(Boolean)
        .some((s) => s.toLowerCase().includes(q));
    })
  );

  async function load() {
    loading = !people.length;
    error = '';
    try {
      people = (await api.directory()).practitioners;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function show(person) {
    openId = person.id;
    history.pushState({ p: person.id }, '', `/services?p=${person.id}`);
    pushed = true;
  }

  function close() {
    if (pushed) history.back();
    else {
      openId = null;
      history.replaceState(null, '', '/services');
    }
  }

  function closeCancel() {
    cancelToken = null;
    history.replaceState(null, '', '/services');
    load();
  }

  $effect(() => {
    document.body.classList.toggle('locked', !!(open || cancelToken));
  });

  onMount(() => {
    if (isAdmin) {
      document.title = 'Services admin · Liminal Village';
      return;
    }
    load();
    const onpop = () => {
      openId = new URLSearchParams(location.search).get('p');
      pushed = false;
    };
    window.addEventListener('popstate', onpop);
    return () => window.removeEventListener('popstate', onpop);
  });
</script>

{#if isAdmin}
  <Admin />
{:else}
  <nav class="nav">
    <div class="wrap navin">
      <a href="/" class="brand">Liminal Village</a>
      <div class="links">
        <a href="/quests">Quests</a>
        <a href="/media">Media</a>
        <a href="/frameworks">Frameworks</a>
        <a href="/services" class="active" aria-current="page">Services</a>
      </div>
    </div>
  </nav>

  <header class="hero">
    <div class="wrap heroin">
      <div class="copy">
        <p class="eyebrow">Offerings of the village</p>
        <h1 class="display">Book a session with the people of Liminal Village</h1>
        <p class="lead">
          Every villager brings an <em>ikigai</em> — where what they love, what they’re good at and what the
          world needs meet. Find someone whose gift speaks to you, pick a time, and meet them in the village.
        </p>
        {#if !loading && !error}
          <dl class="stats">
            <div><dt>{stats.villagers}</dt><dd>villagers</dd></div>
            <div><dt>{stats.offering}</dt><dd>offering sessions</dd></div>
            <div><dt>{stats.slots}</dt><dd>open times</dd></div>
          </dl>
        {/if}
      </div>
      <svg class="ikigai" viewBox="0 0 220 220" role="img" aria-label="Ikigai: love, skill, need and livelihood overlapping">
        <circle cx="110" cy="70" r="58" /><circle cx="150" cy="110" r="58" /><circle cx="110" cy="150" r="58" /><circle cx="70" cy="110" r="58" />
        <text x="110" y="34">love</text><text x="192" y="113">need</text><text x="110" y="194">livelihood</text><text x="28" y="113">skill</text>
        <circle class="core" cx="110" cy="110" r="7" />
      </svg>
    </div>
  </header>

  <main class="wrap">
    <div class="toolbar">
      <label class="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input type="search" bind:value={query} placeholder="Search by name, gift or practice…" aria-label="Search services" />
      </label>
      <div class="filters" role="group" aria-label="Filter">
        <button class:on={filter === 'all'} onclick={() => (filter = 'all')}>All</button>
        <button class:on={filter === 'available'} onclick={() => (filter = 'available')}><i class="dot"></i>Available</button>
        {#each tags as t}
          <button class:on={filter === t} onclick={() => (filter = t)}>{t}</button>
        {/each}
      </div>
    </div>

    {#if loading}
      <div class="grid">
        {#each Array(6) as _}
          <div class="ghost-card">
            <div class="row"><div class="skeleton" style="width:56px;height:56px;border-radius:50%"></div><div class="skeleton" style="height:20px;width:50%"></div></div>
            <div class="skeleton" style="height:14px"></div>
            <div class="skeleton" style="height:14px;width:80%"></div>
            <div class="skeleton" style="height:36px;margin-top:auto"></div>
          </div>
        {/each}
      </div>
    {:else if error}
      <div class="state">
        <h2 class="display">The village is a little quiet right now</h2>
        <p class="muted">We couldn’t reach the network ({error}).</p>
        <button class="btn gold" onclick={load}>Try again</button>
      </div>
    {:else if shown.length === 0}
      <div class="state">
        <h2 class="display">No one matches that yet</h2>
        <p class="muted">Try another word, or clear the filters.</p>
        <button class="btn ghost" onclick={() => { query = ''; filter = 'all'; }}>Clear filters</button>
      </div>
    {:else}
      <p class="count muted" aria-live="polite">{shown.length} {shown.length === 1 ? 'villager' : 'villagers'}</p>
      <div class="grid">
        {#each shown as person, i (person.id)}
          <PractitionerCard {person} index={i} onopen={show} />
        {/each}
      </div>
    {/if}

    <section class="how">
      <div><span>1</span><h3>Choose a villager</h3><p>Read their ikigai and what a session with them is like.</p></div>
      <div><span>2</span><h3>Pick a time</h3><p>See their open times and the price per session up front.</p></div>
      <div><span>3</span><h3>Meet in the village</h3><p>You’ll get a confirmation, a calendar invite and a cancel link.</p></div>
    </section>

    <section class="cta">
      <div>
        <h2 class="display">Living in the village?</h2>
        <p>Share your ikigai and LinkedIn in @HolonsBot’s onboarding — choose to make your answers public — then ask a steward to open your times.</p>
      </div>
      <a class="btn" href="https://t.me/HolonsBot?start=onboarding" target="_blank" rel="noopener noreferrer">Start onboarding</a>
    </section>
  </main>

  <footer class="foot">
    <div class="wrap">© Liminal Village · Ascoli Piceno, Italy · <a href="/">liminalvillage.com</a></div>
  </footer>

  {#if open}
    {#key open.id}
      <BookingFlow person={open} onclose={close} onbooked={load} />
    {/key}
  {/if}
  {#if cancelToken}
    <Cancel token={cancelToken} onclose={closeCancel} />
  {/if}
{/if}

<style>
  .nav { position: sticky; top: 0; z-index: 20; background: rgba(250, 248, 245, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
  .navin { display: flex; align-items: center; justify-content: space-between; height: 68px; gap: 16px; }
  .brand { font-size: 18px; font-weight: 300; letter-spacing: 5px; text-transform: uppercase; color: var(--ink); white-space: nowrap; }
  .links { display: flex; gap: 22px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
  .links a { color: var(--muted); transition: color 0.2s; }
  .links a:hover, .links a.active { color: var(--gold-dark); }

  .hero { padding: 48px 0 24px; background: radial-gradient(1200px 400px at 80% -10%, #f3e3c9 0%, transparent 60%); }
  .heroin { display: grid; grid-template-columns: 1fr 220px; gap: 40px; align-items: center; }
  .hero h1 { font-size: clamp(36px, 4.6vw, 56px); margin: 10px 0 16px; max-width: 20ch; }
  .lead { font-size: 17px; max-width: 58ch; color: var(--text); }
  .lead em { font-family: var(--display); font-size: 20px; color: var(--gold-dark); }
  .stats { display: flex; gap: 32px; margin-top: 28px; }
  .stats div { display: grid; }
  .stats dt { font-family: var(--display); font-size: 34px; font-weight: 600; color: var(--ink); line-height: 1; }
  .stats dd { font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
  .ikigai { width: 100%; }
  .ikigai circle { fill: rgba(214, 161, 91, 0.13); stroke: rgba(184, 135, 61, 0.5); stroke-width: 1; animation: breathe 6s ease-in-out infinite; transform-origin: 110px 110px; }
  .ikigai circle:nth-of-type(2) { animation-delay: -1.5s; }
  .ikigai circle:nth-of-type(3) { animation-delay: -3s; }
  .ikigai circle:nth-of-type(4) { animation-delay: -4.5s; }
  .ikigai .core { fill: var(--gold-dark); stroke: none; animation: none; }
  .ikigai text { font-family: var(--display); font-style: italic; font-size: 15px; fill: var(--gold-dark); text-anchor: middle; }
  @keyframes breathe { 50% { transform: scale(1.04); } }

  .toolbar { position: sticky; top: 68px; z-index: 10; display: grid; gap: 12px; padding: 16px 0; background: linear-gradient(var(--paper) 80%, transparent); }
  .search { display: flex; align-items: center; gap: 10px; max-width: 520px; padding: 0 16px; height: 50px; border-radius: 999px; background: #fff; box-shadow: var(--shadow); border: 1px solid var(--line); transition: border-color 0.2s, box-shadow 0.2s; }
  .search:focus-within { border-color: var(--gold); box-shadow: 0 0 0 4px rgba(214, 161, 91, 0.16); }
  .search svg { width: 18px; height: 18px; fill: none; stroke: var(--muted); stroke-width: 2; stroke-linecap: round; flex: none; }
  .search input { flex: 1; border: 0; outline: none; background: none; font-size: 15px; min-width: 0; }
  .filters { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px; }
  .filters::-webkit-scrollbar { display: none; }
  .filters button { flex: none; display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px; border: 1px solid var(--line); background: #fff; font-size: 13px; font-weight: 600; text-transform: capitalize; color: var(--text); transition: all 0.2s; }
  .filters button:hover { border-color: var(--gold); }
  .filters button.on { background: var(--ink); border-color: var(--ink); color: #fff; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); }

  .count { font-size: 13px; margin: 4px 0 14px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .ghost-card { display: flex; flex-direction: column; gap: 14px; min-height: 260px; padding: 22px; border-radius: var(--radius); background: #fff; box-shadow: var(--shadow); }
  .ghost-card .row { display: flex; align-items: center; gap: 14px; }
  .state { display: grid; justify-items: center; gap: 12px; text-align: center; padding: 70px 20px; }
  .state h2 { font-size: 30px; }

  .how { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin: 80px 0 40px; }
  .how div { display: grid; gap: 6px; }
  .how span { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: var(--gold-soft); color: var(--gold-dark); font-weight: 700; }
  .how h3 { font-family: var(--display); font-size: 22px; font-weight: 600; color: var(--ink); margin-top: 6px; }
  .how p { font-size: 14px; color: var(--muted); }

  .cta { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; padding: 30px 32px; margin-bottom: 70px; border-radius: 22px; background: var(--ink); color: #e9e3da; }
  .cta h2 { font-size: 30px; color: #fff; }
  .cta .btn { background: var(--gold); }
  .cta .btn:hover { background: var(--gold-dark); }
  .foot { padding: 28px 0; border-top: 1px solid var(--line); font-size: 13px; color: var(--muted); }
  .foot a { color: var(--gold-dark); }

  @media (max-width: 820px) {
    .heroin { grid-template-columns: 1fr; }
    .ikigai { display: none; }
    .links a:not(.active) { display: none; }
    .how { grid-template-columns: 1fr; margin-top: 56px; }
  }
  @media (max-width: 640px) {
    .wrap { padding: 0 16px; }
    .hero { padding: 40px 0 24px; }
    .lead { font-size: 15.5px; }
    .stats { gap: 22px; }
    .stats dt { font-size: 28px; }
    .brand { font-size: 15px; letter-spacing: 3px; }
    .grid { grid-template-columns: 1fr; gap: 14px; }
    .cta { padding: 24px; }
  }
</style>
