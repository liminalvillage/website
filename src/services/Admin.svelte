<script>
  // Steward area, ported from maxage's /admin: pick a villager, describe
  // their offer and price, open slots, see and cancel bookings.
  import { onMount } from 'svelte';
  import Avatar from './Avatar.svelte';
  import Calendar from './Calendar.svelte';
  import { api } from './api.js';
  import { weekdays, addMinutes, formatLongDate, formatShortDate } from './dates.js';

  let authed = $state(null); // null = checking
  let password = $state('');
  let data = $state(null);
  let p = $state(new URLSearchParams(location.search).get('p') ?? '');
  let month = $state('');
  let day = $state(null);
  let offer = $state(null);
  let open = $state({ from: '', to: '', weekdays: [], times: '', duration: 60 });
  let msg = $state(null); // { kind, text }
  let busy = $state(false);

  const person = $derived(data?.practitioners.find((m) => m.id === p) ?? null);
  const marks = $derived((data?.slots ?? []).reduce((m, s) => ((m[s.date] = (m[s.date] ?? 0) + 1), m), {}));
  const daySlots = $derived((data?.slots ?? []).filter((s) => s.date === day));

  function flash(kind, text) {
    msg = { kind, text };
    setTimeout(() => msg?.text === text && (msg = null), 4000);
  }

  async function load() {
    try {
      data = await api.admin.overview(p, month);
      authed = true;
      if (data.offer) offer = { ...data.offer };
      if (!open.from) open.from = data.today;
    } catch (e) {
      if (e.status === 401) authed = false;
      else flash('error', e.message);
    }
  }

  async function login(e) {
    e.preventDefault();
    busy = true;
    try {
      await api.admin.login(password);
      password = '';
      await load();
    } catch (err) {
      flash('error', err.message);
    } finally {
      busy = false;
    }
  }

  async function select(id) {
    p = id;
    month = '';
    day = null;
    offer = null;
    history.replaceState(null, '', `/services?admin&p=${id}`);
    await load();
  }

  async function act(fn, ok) {
    busy = true;
    try {
      const res = await fn();
      flash('success', typeof ok === 'function' ? ok(res) : ok);
      await load();
    } catch (e) {
      flash('error', e.message);
    } finally {
      busy = false;
    }
  }

  const saveOffer = (e) => {
    e.preventDefault();
    act(() => api.admin.saveOffer({ p, ...offer }), offer.active ? 'Saved — now visible and bookable.' : 'Saved — hidden from booking.');
  };
  const openSlots = (e) => {
    e.preventDefault();
    act(() => api.admin.open({ p, ...open }), (r) => `Opened ${r.created} new slot${r.created === 1 ? '' : 's'}.`);
  };

  onMount(load);
</script>

<div class="admin wrap">
  <header class="head">
    <div>
      <p class="eyebrow">Stewards</p>
      <h1 class="display">Services admin</h1>
    </div>
    <div class="headlinks">
      <a class="btn ghost small" href="/services">View public page</a>
      {#if authed}<button class="btn ghost small" onclick={async () => { await api.admin.logout(); authed = false; }}>Sign out</button>{/if}
    </div>
  </header>

  {#if msg}<p class="notice {msg.kind} toast" role="status">{msg.text}</p>{/if}

  {#if authed === false}
    <form class="card login" onsubmit={login}>
      <h2 class="display">Sign in</h2>
      <div class="field">
        <label for="pw">Password</label>
        <input id="pw" type="password" bind:value={password} autocomplete="current-password" required />
      </div>
      <button class="btn gold" disabled={busy}>Sign in</button>
    </form>
  {:else if authed && data}
    <div class="layout">
      <aside class="card people">
        <p class="eyebrow">Villagers</p>
        <ul>
          {#each data.practitioners as m (m.id)}
            <li>
              <button class:sel={m.id === p} onclick={() => select(m.id)}>
                <Avatar id={m.id} name={m.name} size={30} />
                <span class="nm">{m.name}</span>
                {#if data.offers[m.id]?.active}<span class="live" title="Bookable">●</span>{/if}
              </button>
            </li>
          {/each}
        </ul>
      </aside>

      {#if !person}
        <div class="card empty"><p class="muted">Pick a villager to set up what they offer and open their times.</p></div>
      {:else if !offer}
        <div class="skeleton" style="height: 320px"></div>
      {:else}
        <div class="main">
          <form class="card" onsubmit={saveOffer}>
            <div class="row-head">
              <h2 class="display">{person.name}</h2>
              <label class="toggle"><input type="checkbox" bind:checked={offer.active} /> Bookable</label>
            </div>
            <div class="field">
              <span class="lbl">Ikigai <span class="muted">(from their /onboarding profile)</span></span>
              <p class="ikigai">{person.ikigai || 'Not shared yet — they can add it via t.me/HolonsBot?start=onboarding (or /onboarding) and making their answers public.'}</p>
              {#if person.linkedin}<a class="small" href={person.linkedin} target="_blank" rel="noopener noreferrer">{person.linkedin}</a>{/if}
            </div>
            <div class="field">
              <label for="o-title">Session name</label>
              <input id="o-title" bind:value={offer.title} placeholder="e.g. Deep-tissue massage, Breathwork, Coaching" />
            </div>
            <div class="field">
              <label for="o-desc">What to expect <span class="muted">optional</span></label>
              <textarea id="o-desc" bind:value={offer.description} rows="3"></textarea>
            </div>
            <div class="grid3">
              <div class="field">
                <label for="o-price">Price per session</label>
                <input id="o-price" type="number" min="0" step="1" bind:value={offer.price} />
              </div>
              <div class="field">
                <label for="o-cur">Currency</label>
                <select id="o-cur" bind:value={offer.currency}><option>EUR</option><option>USD</option><option>GBP</option><option>CHF</option></select>
              </div>
              <div class="field">
                <label for="o-note">Price note</label>
                <input id="o-note" bind:value={offer.priceNote} placeholder="Sliding scale welcome" />
              </div>
            </div>
            <p class="muted small">Price 0 shows as “By donation”.</p>
            <button class="btn gold" disabled={busy}>Save offer</button>
          </form>

          <div class="two">
            <div class="card">
              <Calendar
                year={data.year}
                month={data.month}
                {marks}
                selected={day}
                today={data.today}
                allDays
                onmonth={(m) => { month = m; day = null; load(); }}
                onday={(d) => { day = d; open.from = d; }}
              />
              {#if day}
                <h3 class="dayh">{formatLongDate(day)}</h3>
                {#if daySlots.length === 0}
                  <p class="muted small">No slots on this day.</p>
                {:else}
                  <ul class="dayslots">
                    {#each daySlots as s (s.id)}
                      <li>
                        <span class="t">{s.time}–{addMinutes(s.time, s.duration)}</span>
                        <span class="who">
                          {#if s.booking}
                            <strong>{s.booking.name}</strong>
                            <span class="muted">{s.booking.email}{s.booking.phone ? ` · ${s.booking.phone}` : ''}</span>
                            {#if s.booking.note}<em class="muted">{s.booking.note}</em>{/if}
                          {:else}<span class="muted">Free</span>{/if}
                        </span>
                        {#if s.booking}
                          <button class="btn danger small" disabled={busy} onclick={() => confirm('Cancel this booking? The client is not e-mailed automatically.') && act(() => api.admin.cancelBooking(p, s.id), 'Booking cancelled.')}>Cancel</button>
                        {:else}
                          <button class="btn ghost small" disabled={busy} onclick={() => act(() => api.admin.deleteSlot(p, s.id), 'Slot removed.')}>Remove</button>
                        {/if}
                      </li>
                    {/each}
                  </ul>
                {/if}
              {/if}
            </div>

            <form class="card" onsubmit={openSlots}>
              <h3 class="display">Open times</h3>
              <p class="muted small">One day, or a range filtered by weekday. Times are start times, e.g. <code>10:00, 14:30</code>.</p>
              <div class="grid2">
                <div class="field"><label for="from">From</label><input id="from" type="date" bind:value={open.from} required /></div>
                <div class="field"><label for="to">To <span class="muted">optional</span></label><input id="to" type="date" bind:value={open.to} /></div>
              </div>
              <div class="field">
                <span class="lbl">Weekdays <span class="muted">none = every day</span></span>
                <div class="wds">
                  {#each weekdays() as wd, i}
                    <label class="wd" class:on={open.weekdays.includes(i)}>
                      <input type="checkbox" value={i} bind:group={open.weekdays} />{wd}
                    </label>
                  {/each}
                </div>
              </div>
              <div class="grid2">
                <div class="field"><label for="times">Start times</label><input id="times" bind:value={open.times} placeholder="10:00, 12:00, 15:00" required /></div>
                <div class="field">
                  <label for="dur">Length (min)</label>
                  <select id="dur" bind:value={open.duration}>{#each [30, 45, 60, 75, 90, 120, 180] as d}<option value={d}>{d}</option>{/each}</select>
                </div>
              </div>
              <button class="btn" disabled={busy}>Open slots</button>
            </form>
          </div>

          <div class="card">
            <h3 class="display">Session requests</h3>
            {#if !data.requests?.length}
              <p class="muted small">No requests. Visitors can ask for a time when nothing open fits.</p>
            {:else}
              <ul class="requests">
                {#each data.requests as r (r.id)}
                  <li>
                    <span class="t">{r.preferred ? formatShortDate(r.preferred) : 'Any day'}{r.timeOfDay ? ` · ${r.timeOfDay}` : ''}</span>
                    <span class="who">
                      <strong>{r.name}</strong>
                      <a class="muted" href="mailto:{r.email}">{r.email}{r.phone ? ` · ${r.phone}` : ''}</a>
                      {#if r.note}<em class="muted">{r.note}</em>{/if}
                    </span>
                    <button class="btn ghost small" disabled={busy} onclick={() => act(() => api.admin.deleteRequest(p, r.id), 'Request cleared.')}>Done</button>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>

          <div class="card">
            <h3 class="display">Upcoming bookings</h3>
            {#if !data.upcoming?.length}
              <p class="muted small">Nothing booked yet.</p>
            {:else}
              <ul class="upcoming">
                {#each data.upcoming as b (b.id)}
                  <li><span class="t">{formatShortDate(b.date)} · {b.time}</span><strong>{b.name}</strong><span class="muted">{b.email}</span></li>
                {/each}
              </ul>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="skeleton" style="height: 320px"></div>
  {/if}
</div>

<style>
  .admin { padding-top: 40px; padding-bottom: 80px; }
  .head { display: flex; justify-content: space-between; align-items: end; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
  .head h1 { font-size: 40px; }
  .headlinks { display: flex; gap: 8px; }
  .card { background: #fff; border-radius: var(--radius); box-shadow: var(--shadow); padding: 22px; display: grid; gap: 14px; align-content: start; }
  .card h2 { font-size: 28px; }
  .card h3 { font-size: 22px; }
  .login { max-width: 380px; }
  .toast { position: fixed; right: 20px; bottom: 20px; z-index: 50; box-shadow: var(--shadow-lift); }
  .layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; align-items: start; }
  .people { position: sticky; top: 20px; max-height: calc(100vh - 40px); overflow: auto; }
  .people ul { list-style: none; display: grid; gap: 2px; }
  .people button { width: 100%; display: flex; align-items: center; gap: 10px; padding: 7px 8px; border-radius: 10px; text-align: left; font-size: 14px; }
  .people button:hover { background: var(--paper); }
  .people button.sel { background: var(--gold-soft); font-weight: 600; }
  .nm { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .live { color: var(--green); font-size: 10px; }
  .main { display: grid; gap: 20px; }
  .row-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .toggle { display: inline-flex; gap: 8px; align-items: center; font-weight: 600; font-size: 14px; }
  .toggle input { width: 18px; height: 18px; accent-color: var(--green); }
  .ikigai { font-family: var(--display); font-style: italic; font-size: 18px; color: var(--ink); white-space: pre-line; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid3 { display: grid; grid-template-columns: 1fr 120px 1.4fr; gap: 12px; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
  .small { font-size: 13px; }
  .dayh { font-family: var(--body); font-size: 15px !important; font-weight: 600; margin-top: 8px; }
  .dayslots, .upcoming, .requests { list-style: none; display: grid; gap: 8px; }
  .requests li { display: grid; grid-template-columns: 150px 1fr auto; gap: 10px; align-items: center; padding: 8px 0; border-top: 1px solid var(--line); font-size: 14px; }
  .dayslots li { display: grid; grid-template-columns: 96px 1fr auto; gap: 10px; align-items: center; padding: 8px 0; border-top: 1px solid var(--line); font-size: 14px; }
  .who { display: grid; }
  .t { font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; }
  .upcoming li { display: grid; grid-template-columns: 150px 1fr 1fr; gap: 10px; font-size: 14px; padding: 6px 0; border-top: 1px solid var(--line); }
  .wds { display: flex; flex-wrap: wrap; gap: 6px; }
  .wd { padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line); font-size: 13px; cursor: pointer; user-select: none; }
  .wd input { position: absolute; opacity: 0; pointer-events: none; }
  .wd.on { background: var(--ink); color: #fff; border-color: var(--ink); }
  code { background: var(--paper); padding: 1px 5px; border-radius: 5px; }
  @media (max-width: 900px) {
    .layout, .two { grid-template-columns: 1fr; }
    .people { position: static; max-height: 260px; }
    .grid3 { grid-template-columns: 1fr 1fr; }
    .upcoming li { grid-template-columns: 1fr; gap: 0; }
  }
</style>
