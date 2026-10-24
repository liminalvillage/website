<script>
  import { onMount, tick } from 'svelte';
  import Avatar from './Avatar.svelte';
  import Calendar from './Calendar.svelte';
  import LinkedIn from './LinkedIn.svelte';
  import Telegram from './Telegram.svelte';
  import { api } from './api.js';
  import { addMinutes, formatLongDate, formatShortDate, formatPrice, nowIn, describeOffer } from './dates.js';

  let { person, onclose, onbooked } = $props();

  const offer = $derived(person.offer);
  const first = $derived(person.name.split(' ')[0]);
  const today = nowIn().date;
  const TIMES_OF_DAY = ['morning', 'afternoon', 'evening', 'flexible'];

  // Two ways to book: pick an open slot, or — when none is open or none
  // fits — send a request the practitioner answers personally.
  let requesting = $state(!person.nextSlot);
  let req = $state({ preferred: '', timeOfDay: 'flexible' });
  let sent = $state(false);
  let step = $state(0);
  const STEPS = $derived(requesting ? ['Your request', 'Sent'] : ['Time', 'Your details', 'Confirmed']);
  const stepIndex = $derived(requesting ? (sent ? 1 : 0) : step);
  let cal = $state(null); // { year, month, key, minMonth, today, counts, slots }
  let calLoading = $state(false);
  let calError = $state('');
  let day = $state(null);
  let slot = $state(null);
  let form = $state({ name: '', email: '', phone: '', note: '', website: '' });
  let submitting = $state(false);
  let error = $state('');
  let booked = $state(null);
  let panel;
  let closeBtn;

  const daySlots = $derived(cal && day ? cal.slots.filter((s) => s.date === day) : []);

  // Remember the visitor between bookings — they shouldn't retype their name.
  try {
    const saved = JSON.parse(localStorage.getItem('lv-services-contact') || 'null');
    if (saved) Object.assign(form, saved);
  } catch {}

  async function loadMonth(month, pickFirst = false) {
    calLoading = true;
    calError = '';
    try {
      cal = await api.slots(person.id, month);
      if (pickFirst) day = Object.keys(cal.counts).sort()[0] ?? null;
      else if (day && !cal.counts[day]) day = null;
    } catch (e) {
      calError = e.message;
    } finally {
      calLoading = false;
    }
  }

  function chooseDay(d) {
    day = d;
    slot = null;
  }

  async function chooseSlot(s) {
    slot = s;
    await tick();
    document.getElementById('bf-continue')?.focus({ preventScroll: true });
  }

  async function goDetails() {
    step = 1;
    await tick();
    panel?.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('bf-name')?.focus({ preventScroll: true });
  }

  async function submit(e) {
    e.preventDefault();
    if (submitting) return;
    submitting = true;
    error = '';
    try {
      const res = await api.book({ p: person.id, slot: slot.id, ...form });
      remember();
      booked = { ...res.booking, cancelToken: res.cancelToken };
      step = 2;
      onbooked?.();
      panel?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      error = err.message;
      if (err.status === 409 || err.status === 410) {
        // Slot gone: back to the calendar with fresh availability.
        slot = null;
        step = 0;
        await loadMonth(cal?.key);
      }
    } finally {
      submitting = false;
    }
  }

  function remember() {
    try {
      const { name, email, phone } = form;
      localStorage.setItem('lv-services-contact', JSON.stringify({ name, email, phone }));
    } catch {}
  }

  async function switchMode(toRequest) {
    requesting = toRequest;
    error = '';
    if (!toRequest && !cal) loadMonth(person.nextSlot?.date.slice(0, 7), true);
    await tick();
    document.getElementById(toRequest ? 'rq-date' : 'bf-picker')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Asking for one of their /offers: HolonsBot passes it on as a Telegram DM.
  let asking = $state(null); // the offer being asked for
  let ask = $state({ telegram: '', note: '' });
  let askSent = $state(null); // { offer, delivered }
  let askError = $state('');

  function startAsk(o) {
    asking = o;
    askSent = null;
    askError = '';
    ask.note = '';
  }

  async function sendAsk(e) {
    e.preventDefault();
    if (submitting) return;
    submitting = true;
    askError = '';
    try {
      const res = await api.requestOffer({ p: person.id, offerId: asking.id, ...ask, name: form.name, email: form.email, website: form.website });
      remember();
      askSent = { offer: asking, delivered: res.delivered };
      asking = null;
    } catch (err) {
      askError = err.message;
    } finally {
      submitting = false;
    }
  }

  async function sendRequest(e) {
    e?.preventDefault();
    if (submitting) return;
    submitting = true;
    error = '';
    try {
      await api.request({ p: person.id, ...req, ...form });
      remember();
      sent = true;
      panel?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      error = err.message;
    } finally {
      submitting = false;
    }
  }

  function icsHref(b) {
    const stamp = (d, t) => `${d.replaceAll('-', '')}T${t.replace(':', '')}00`;
    const lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Liminal Village//Services//EN', 'BEGIN:VEVENT',
      `UID:${b.date}-${b.time}-${person.id}@liminalvillage.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      `DTSTART;TZID=Europe/Rome:${stamp(b.date, b.time)}`,
      `DTEND;TZID=Europe/Rome:${stamp(b.date, addMinutes(b.time, b.duration))}`,
      `SUMMARY:${(b.service || 'Session')} with ${person.name}`.replace(/[,;]/g, '\\$&'),
      'LOCATION:Liminal Village\\, Ascoli Piceno\\, Italy',
      'END:VEVENT', 'END:VCALENDAR',
    ];
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
  }

  function onkeydown(e) {
    if (e.key === 'Escape') onclose();
    if (e.key === 'Tab' && panel) {
      // Keep focus inside the drawer.
      const f = [...panel.querySelectorAll('button:not(:disabled), a[href], input, textarea, select')];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  }

  onMount(() => {
    closeBtn?.focus({ preventScroll: true });
    if (!requesting) loadMonth(person.nextSlot?.date.slice(0, 7), true);
  });
</script>

<svelte:window {onkeydown} />

<div class="scrim" onclick={onclose} aria-hidden="true"></div>

<div class="drawer" role="dialog" aria-modal="true" aria-labelledby="bf-title" bind:this={panel}>
  <div class="top">
    <ol class="steps" aria-label="Booking progress">
        {#each STEPS as label, i}
          <li class:active={i === stepIndex} class:done={i < stepIndex} aria-current={i === stepIndex ? 'step' : undefined}>
            <span>
              {#if i < stepIndex}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.5l2.5 2.5 4.5-5" /></svg>{:else}{i + 1}{/if}
            </span><em>{label}</em>
          </li>
        {/each}
      </ol>
    <button class="close" bind:this={closeBtn} onclick={onclose} aria-label="Close">✕</button>
  </div>

  <section class="profile">
    <Avatar id={person.id} name={person.name} size={step === 0 ? 76 : 48} />
    <div>
      <h2 id="bf-title" class="display">{person.name}</h2>
      {#if offer?.title}<p class="service">{offer.title}</p>{:else if person.role || person.category}<p class="service tag">{person.role || person.category}</p>{/if}
    </div>
    {#if !sent && step === 0 && (person.username || person.linkedin)}
      <div class="links">
        {#if person.username}<Telegram username={person.username} name={person.name} label />{/if}
        {#if person.linkedin}<LinkedIn href={person.linkedin} name={person.name} label />{/if}
      </div>
    {/if}
  </section>

  {#if sent}
    <div class="body fade finale">
      <div class="check" aria-hidden="true">
        <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
      </div>
      <h3 class="display">Request sent, {form.name.split(' ')[0]}.</h3>
      <p class="muted">{first} got your request on Telegram and will reply to {form.email} to agree on a time{offer ? '' : ' and a price'}.</p>
      <div class="ticket">
        <div><span class="eyebrow">With</span><strong>{person.name}</strong>{offer?.title || 'Session'}</div>
        <div><span class="eyebrow">Preferred</span><strong>{req.preferred ? formatLongDate(req.preferred) : 'Any day'}</strong><span class="cap">{req.timeOfDay}</span></div>
      </div>
      <div class="actions"><button class="btn ghost" onclick={onclose}>Back to the village</button></div>
    </div>
  {:else if step === 0}
    <div class="body fade">
      {#if person.ikigai}
        <div class="block">
          <p class="eyebrow">Ikigai</p>
          <blockquote>{person.ikigai}</blockquote>
        </div>
      {/if}
      {#if offer?.description}
        <div class="block">
          <p class="eyebrow">The session</p>
          <p class="desc">{offer.description}</p>
        </div>
      {/if}
      {#if person.offers?.length}
        <div class="block">
          <p class="eyebrow">Offers</p>
          <ul class="offers">
            {#each person.offers as o (o.id)}
              {@const d = describeOffer(o)}
              <li>
                <span class="ico" aria-hidden="true">{d.icon}</span><span><strong>{d.verb}</strong> {d.text}</span>{#if d.price}<span class="p">{d.price}</span>{/if}
                {#if asking?.id !== o.id}<button type="button" class="btn small ghost" onclick={() => startAsk(o)}>Request</button>{/if}
              </li>
              {#if asking?.id === o.id}
                <li class="askrow">
                  <form class="request ask" onsubmit={sendAsk}>
                    <p class="muted small">{first} gets your request on Telegram and replies to you directly.</p>
                    {#if askError}<p class="notice error" role="alert">{askError}</p>{/if}
                    <input type="text" name="website" bind:value={form.website} tabindex="-1" autocomplete="off" class="hp" aria-hidden="true" />
                    <div class="field">
                      <label for="ask-name">Your name</label>
                      <input id="ask-name" bind:value={form.name} required autocomplete="name" />
                    </div>
                    <div class="field">
                      <label for="ask-email">E-mail</label>
                      <input id="ask-email" type="email" bind:value={form.email} required autocomplete="email" />
                    </div>
                    <div class="field">
                      <label for="ask-tg">Your Telegram <span class="muted hint">optional — so {first} can message you back</span></label>
                      <input id="ask-tg" bind:value={ask.telegram} placeholder="@your_name" autocomplete="off" />
                    </div>
                    <div class="field">
                      <label for="ask-note">Message <span class="muted hint">optional</span></label>
                      <textarea id="ask-note" bind:value={ask.note} rows="2" placeholder="When, how much, anything {first} should know…"></textarea>
                    </div>
                    <div class="askbar">
                      <button type="button" class="link small" onclick={() => (asking = null)}>Cancel</button>
                      <button class="btn small gold" disabled={submitting}>{submitting ? 'Sending…' : `Request “${o.title}”`}</button>
                    </div>
                  </form>
                </li>
              {/if}
            {/each}
          </ul>
          {#if askSent}
            <p class="notice {askSent.delivered ? 'success' : ''}" role="status">
              {#if askSent.delivered}✓ Sent to {first} on Telegram — they’ll reply to you directly. A copy is in your inbox.{:else}✓ Request saved and copied to your inbox, but {first} couldn’t be reached on Telegram right now{person.username ? ' — message them directly below' : ''}.{/if}
            </p>
          {/if}
          {#if person.username}
            <p class="note">Or <a class="link" href="https://t.me/{person.username}" target="_blank" rel="noopener noreferrer">message {first} on Telegram</a> directly.</p>
          {/if}
        </div>
      {/if}
      {#if !person.ikigai && !offer?.description}
        <p class="muted">{first} hasn’t shared their ikigai yet.</p>
      {/if}
      {#if person.values?.length}
        <ul class="values">{#each person.values as v}<li>{v}</li>{/each}</ul>
      {/if}

      <div class="pricebar">
        <div>
          {#if offer}
            <span class="price">{formatPrice(offer.price, offer.currency)}</span>
            <span class="muted"> per session</span>
            {#if offer.priceNote}<p class="note">{offer.priceNote}</p>{/if}
          {:else}
            <span class="price soft">Price on request</span>
            <p class="note">You’ll agree on it with {first}.</p>
          {/if}
        </div>
        {#if !requesting && cal}
          <span class="pill">{Object.values(cal.counts).reduce((a, b) => a + b, 0) || 'No'} open this month</span>
        {:else if requesting}
          <span class="pill soft">Times on request</span>
        {/if}
      </div>

      {#if requesting}
        <form class="block request" onsubmit={sendRequest}>
          <p class="eyebrow">Request a session</p>
          <p class="muted small">
            {person.nextSlot ? 'Tell' : `${first} hasn’t opened times online yet — tell`} {first} when suits you; they’ll reply by e-mail to confirm.
          </p>
          {#if error}<p class="notice error" role="alert">{error}</p>{/if}
          <input type="text" name="website" bind:value={form.website} tabindex="-1" autocomplete="off" class="hp" aria-hidden="true" />
          <div class="field">
            <label for="rq-date">Preferred day <span class="muted hint">optional</span></label>
            <input id="rq-date" type="date" min={today} bind:value={req.preferred} />
          </div>
          <div class="field">
            <span class="lbl">Time of day</span>
            <div class="tod" role="radiogroup" aria-label="Time of day">
              {#each TIMES_OF_DAY as t}
                <button type="button" role="radio" aria-checked={req.timeOfDay === t} class:on={req.timeOfDay === t} onclick={() => (req.timeOfDay = t)}>{t}</button>
              {/each}
            </div>
          </div>
          <div class="field">
            <label for="rq-name">Your name</label>
            <input id="rq-name" bind:value={form.name} required autocomplete="name" />
          </div>
          <div class="field">
            <label for="rq-email">E-mail <span class="muted hint">— {first} replies here</span></label>
            <input id="rq-email" type="email" bind:value={form.email} required autocomplete="email" />
          </div>
          <div class="field">
            <label for="rq-phone">Phone <span class="muted hint">optional</span></label>
            <input id="rq-phone" type="tel" bind:value={form.phone} autocomplete="tel" />
          </div>
          <div class="field">
            <label for="rq-note">What would you like from the session? <span class="muted hint">optional</span></label>
            <textarea id="rq-note" bind:value={form.note} rows="3"></textarea>
          </div>
          {#if person.nextSlot}
            <button type="button" class="link small" onclick={() => switchMode(false)}>‹ Back to open times</button>
          {/if}
        </form>
      {:else}
        <div class="block" id="bf-picker">
          <p class="eyebrow">Choose a time</p>
          {#if error}<p class="notice error" role="alert">{error}</p>{/if}
          {#if calError}
            <p class="notice error">{calError} <button class="link" onclick={() => loadMonth(cal?.key)}>Try again</button></p>
          {:else if !cal}
            <div class="skeleton" style="height: 300px"></div>
          {:else}
            <div class="picker">
              <Calendar
                year={cal.year}
                month={cal.month}
                marks={cal.counts}
                selected={day}
                today={cal.today}
                minMonth={cal.minMonth}
                loading={calLoading}
                onmonth={(m) => loadMonth(m, true)}
                onday={chooseDay}
              />
              <div class="times">
                {#if day}
                  <p class="dayname">{formatLongDate(day)}</p>
                  <div class="slots">
                    {#each daySlots as s (s.id)}
                      <button class="slot" class:selected={slot?.id === s.id} onclick={() => chooseSlot(s)} aria-pressed={slot?.id === s.id}>
                        {s.time}<small>{s.duration} min</small>
                      </button>
                    {/each}
                  </div>
                {:else if Object.keys(cal.counts).length === 0}
                  <p class="muted small">No open times this month — try the next one ›</p>
                {:else}
                  <p class="muted small">Pick a highlighted day to see times.</p>
                {/if}
              </div>
            </div>
          {/if}
        </div>
        <button class="link small other" onclick={() => switchMode(true)}>None of these times work? Request another time ›</button>
      {/if}
    </div>
  {:else if step === 1}
    <form class="body fade" onsubmit={submit}>
      <button type="button" class="summary" onclick={() => (step = 0)} aria-label="Change time">
        <span class="when">
          <strong>{formatLongDate(slot.date)}</strong>
          {slot.time}–{addMinutes(slot.time, slot.duration)} · {slot.duration} min
        </span>
        <span class="price">{formatPrice(offer.price, offer.currency)}</span>
        <span class="change">Change</span>
      </button>

      {#if error}<p class="notice error" role="alert">{error}</p>{/if}

      <input type="text" name="website" bind:value={form.website} tabindex="-1" autocomplete="off" class="hp" aria-hidden="true" />
      <div class="field">
        <label for="bf-name">Your name</label>
        <input id="bf-name" bind:value={form.name} required autocomplete="name" />
      </div>
      <div class="field">
        <label for="bf-email">E-mail <span class="muted hint">— for your confirmation</span></label>
        <input id="bf-email" type="email" bind:value={form.email} required autocomplete="email" />
      </div>
      <div class="field">
        <label for="bf-phone">Phone <span class="muted hint">optional</span></label>
        <input id="bf-phone" type="tel" bind:value={form.phone} autocomplete="tel" />
      </div>
      <div class="field">
        <label for="bf-note">Anything {person.name.split(' ')[0]} should know? <span class="muted hint">optional</span></label>
        <textarea id="bf-note" bind:value={form.note} rows="3" placeholder="What you’d like to work on, accessibility needs…"></textarea>
      </div>
      <p class="muted small">Payment happens in person with {person.name.split(' ')[0]}. You can cancel any time from the link in your e-mail.</p>
    </form>
  {:else}
    <div class="body fade finale">
      <div class="check" aria-hidden="true">
        <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
      </div>
      <h3 class="display">You’re booked, {booked.name.split(' ')[0]}.</h3>
      <p class="muted">{person.name.split(' ')[0]} has been notified. A confirmation is on its way to {form.email}.</p>
      <div class="ticket">
        <div><span class="eyebrow">When</span><strong>{formatLongDate(booked.date)}</strong>{booked.time}–{addMinutes(booked.time, booked.duration)}</div>
        <div><span class="eyebrow">With</span><strong>{person.name}</strong>{booked.service || 'Session'}</div>
        <div><span class="eyebrow">Price</span><strong>{formatPrice(booked.price, booked.currency)}</strong>paid in person</div>
        <div><span class="eyebrow">Where</span><strong>Liminal Village</strong>Ascoli Piceno, Italy</div>
      </div>
      <div class="actions">
        <a class="btn gold" href={icsHref(booked)} download="liminal-village-session.ics">Add to calendar</a>
        <button class="btn ghost" onclick={onclose}>Back to the village</button>
      </div>
      <p class="muted small">Plans changed? <a class="link" href="/services?cancel={booked.cancelToken}">Cancel this booking</a></p>
    </div>
  {/if}

  {#if !sent && (requesting || step < 2)}
    <div class="dock">
      {#if requesting}
        <span class="dock-sum">
          <strong>{req.preferred ? formatShortDate(req.preferred) : 'Any day'} · <span class="cap">{req.timeOfDay}</span></strong>{offer ? formatPrice(offer.price, offer.currency) : 'Price on request'}
        </span>
        <button class="btn gold" disabled={submitting || !form.name || !form.email} onclick={sendRequest}>
          {submitting ? 'Sending…' : 'Send request'}
        </button>
      {:else if step === 0}
        <span class="dock-sum">
          {#if slot}<strong>{formatShortDate(slot.date)} · {slot.time}</strong>{formatPrice(offer.price, offer.currency)}{:else}<span class="muted">Select a time to continue</span>{/if}
        </span>
        <button id="bf-continue" class="btn gold" disabled={!slot} onclick={goDetails}>Continue</button>
      {:else}
        <button class="btn ghost" onclick={() => (step = 0)}>Back</button>
        <button class="btn gold" disabled={submitting || !form.name || !form.email} onclick={submit}>
          {submitting ? 'Booking…' : 'Confirm booking'}
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .scrim {
    position: fixed;
    inset: 0;
    z-index: 900;
    background: rgba(30, 22, 12, 0.38);
    backdrop-filter: blur(3px);
    animation: fadein 0.3s var(--ease);
  }
  .drawer {
    position: fixed;
    z-index: 901;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(560px, 100%);
    background: var(--paper);
    box-shadow: -20px 0 60px rgba(30, 22, 12, 0.18);
    overflow-y: auto;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column;
    animation: slidein 0.45s var(--ease);
  }
  @keyframes slidein { from { transform: translateX(100%); } }
  @keyframes fadein { from { opacity: 0; } }
  .fade { animation: fade 0.35s var(--ease); }
  @keyframes fade { from { opacity: 0; transform: translateY(8px); } }

  .top {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 20px;
    background: rgba(250, 248, 245, 0.92);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
  }
  .close {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    font-size: 15px;
    flex: none;
    transition: background 0.2s;
  }
  .close:hover { background: #efe9e0; }
  .steps { display: flex; align-items: center; gap: 14px; list-style: none; font-size: 12.5px; line-height: 20px; color: var(--muted); flex-wrap: wrap; }
  .steps li { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
  .steps li span { flex: none; }
  .steps span {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 11px;
    font-weight: 700;
    background: #ebe5dc;
    color: var(--muted);
    transition: background 0.3s, color 0.3s;
  }
  .steps em { font-style: normal; }
  .steps svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .steps li.active { color: var(--ink); font-weight: 600; }
  .steps li.active span { background: var(--ink); color: #fff; }
  .steps li.done span { background: var(--gold); color: #fff; }

  .profile { display: flex; align-items: center; gap: 16px; padding: 24px 24px 4px; }
  .profile h2 { font-size: 32px; }
  .profile .links { margin-left: auto; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
  .service { font-weight: 600; color: var(--gold-dark); font-size: 14px; margin-top: 2px; }
  .service.tag { text-transform: capitalize; }

  .body { padding: 18px 24px 28px; display: grid; gap: 22px; align-content: start; flex: 1; }
  .block { display: grid; gap: 10px; }
  blockquote {
    font-family: var(--display);
    font-size: 21px;
    font-style: italic;
    line-height: 1.45;
    color: var(--ink);
    padding-left: 16px;
    border-left: 2px solid var(--gold);
    white-space: pre-line;
  }
  .desc { white-space: pre-line; }
  .offers { list-style: none; display: grid; gap: 8px; margin-bottom: 6px; }
  .offers li { display: flex; align-items: baseline; gap: 10px; font-size: 15px; color: var(--ink); }
  .offers li > span:nth-child(2) { flex: 1; }
  .offers strong { font-weight: 600; }
  .offers .p { font-size: 13px; color: var(--muted); white-space: nowrap; }
  .offers .btn { margin-left: 4px; }
  .offers .askrow { display: block; }
  .ask { display: grid; margin: 2px 0 8px; }
  .askbar { display: flex; justify-content: flex-end; align-items: center; gap: 14px; }
  .values { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; }
  .values li { font-size: 12px; padding: 2px 10px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); }

  .pricebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    border-radius: var(--radius);
    background: #fff;
    box-shadow: var(--shadow);
  }
  .price { font-family: var(--display); font-size: 26px; font-weight: 600; color: var(--ink); }
  .note { font-size: 13px; color: var(--muted); }
  .pill { font-size: 12px; font-weight: 600; color: var(--green); background: var(--green-soft); padding: 4px 10px; border-radius: 999px; white-space: nowrap; }

  .picker { display: grid; gap: 18px; padding: 18px; border-radius: var(--radius); background: #fff; box-shadow: var(--shadow); }
  .dayname { font-weight: 600; color: var(--ink); margin-bottom: 10px; }
  .slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 8px; }
  .slot {
    display: grid;
    padding: 10px 8px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: #fff;
    font-weight: 600;
    font-size: 16px;
    color: var(--ink);
    transition: border-color 0.15s, background 0.15s, transform 0.15s;
  }
  .slot small { font-weight: 400; font-size: 11.5px; color: var(--muted); }
  .slot:hover { border-color: var(--gold); transform: translateY(-1px); }
  .slot.selected { background: var(--ink); border-color: var(--ink); color: #fff; }
  .slot.selected small { color: #d8d2c8; }
  .small { font-size: 13px; }
  .link { color: var(--gold-dark); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }

  .price.soft { font-size: 20px; }
  .pill.soft { color: var(--gold-dark); background: var(--gold-soft); }
  .cap { text-transform: capitalize; }
  .other { justify-self: start; }
  .request { padding: 18px; border-radius: var(--radius); background: #fff; box-shadow: var(--shadow); gap: 14px; }
  .tod { display: flex; flex-wrap: wrap; gap: 6px; }
  .tod button { padding: 7px 14px; border-radius: 999px; border: 1px solid var(--line); background: #fff; font-size: 13px; font-weight: 600; text-transform: capitalize; transition: all 0.15s; }
  .tod button:hover { border-color: var(--gold); }
  .tod button.on { background: var(--ink); border-color: var(--ink); color: #fff; }

  .summary {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 2px 12px;
    text-align: left;
    padding: 16px 18px;
    border-radius: var(--radius);
    background: #fff;
    box-shadow: var(--shadow);
    border: 1px solid var(--gold-soft);
  }
  .summary .when { display: grid; font-size: 14px; }
  .summary .when strong { color: var(--ink); font-size: 15px; }
  .summary .change { grid-column: 1 / -1; font-size: 12.5px; font-weight: 600; color: var(--gold-dark); }
  .hint { font-weight: 400; }
  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }

  .dock {
    position: sticky;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 20px calc(14px + env(safe-area-inset-bottom));
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-top: 1px solid var(--line);
  }
  .dock-sum { display: grid; font-size: 13px; line-height: 1.35; }
  .dock-sum strong { color: var(--ink); font-size: 15px; }
  .dock .btn { min-width: 150px; }

  .finale { justify-items: center; text-align: center; padding-top: 28px; }
  .finale h3 { font-size: 32px; }
  .check svg { width: 76px; height: 76px; }
  .check circle { fill: none; stroke: var(--gold); stroke-width: 2; stroke-dasharray: 160; stroke-dashoffset: 160; animation: draw 0.7s var(--ease) forwards; }
  .check path { fill: none; stroke: var(--gold-dark); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 40; stroke-dashoffset: 40; animation: draw 0.4s 0.55s var(--ease) forwards; }
  @keyframes draw { to { stroke-dashoffset: 0; } }
  .ticket {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--line);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    text-align: left;
  }
  .ticket > div { display: grid; gap: 2px; padding: 14px 16px; background: #fff; font-size: 13.5px; }
  .ticket strong { color: var(--ink); font-size: 15px; }
  .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }

  @media (max-width: 640px) {
    .drawer {
      top: auto;
      height: 94dvh;
      width: 100%;
      border-radius: 22px 22px 0 0;
      animation-name: slideup;
    }
    @keyframes slideup { from { transform: translateY(100%); } }
    .top { border-radius: 22px 22px 0 0; padding: 12px 16px; }
    .steps { gap: 10px; font-size: 12px; }
    .steps li:not(.active) em { display: none; }
    .profile { padding: 20px 18px 0; }
    .profile h2 { font-size: 27px; }
    .body { padding: 16px 18px 24px; }
    .picker { padding: 14px; }
    .ticket { grid-template-columns: 1fr; }
    .dock { padding-left: 16px; padding-right: 16px; }
    .dock .btn { min-width: 0; flex: 1; }
    .dock-sum { flex: 1; }
  }
</style>
