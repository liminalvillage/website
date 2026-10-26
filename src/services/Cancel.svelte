<script>
  import { onMount } from 'svelte';
  import { api } from './api.js';
  import { addMinutes, formatLongDate } from './dates.js';

  let { token, onclose } = $props();

  let state = $state('loading'); // loading | found | missing | working | done | error
  let booking = $state(null);
  let error = $state('');

  onMount(async () => {
    try {
      const res = await api.cancelInfo(token);
      booking = res.booking;
      state = res.found ? 'found' : 'missing';
    } catch (e) {
      error = e.message;
      state = 'error';
    }
  });

  async function cancel() {
    state = 'working';
    try {
      await api.cancel(token);
      state = 'done';
    } catch (e) {
      error = e.message;
      state = 'error';
    }
  }
</script>

<div class="scrim" aria-hidden="true"></div>
<div class="modal" role="dialog" aria-modal="true" aria-labelledby="cx-title">
  {#if state === 'loading'}
    <div class="skeleton" style="height: 22px; width: 60%"></div>
    <div class="skeleton" style="height: 80px"></div>
  {:else if state === 'found' || state === 'working'}
    <p class="eyebrow">Cancel booking</p>
    <h2 id="cx-title" class="display">Cancel your session?</h2>
    <div class="what">
      <strong>{booking.service || 'Session'}{booking.practitioner ? ` with ${booking.practitioner.name}` : ''}</strong>
      <span>{formatLongDate(booking.date)} · {booking.time}–{addMinutes(booking.time, booking.duration)}</span>
    </div>
    <p class="muted">The time becomes free for someone else, and {booking.practitioner?.name.split(' ')[0] ?? 'the practitioner'} will be told.</p>
    <div class="actions">
      <button class="btn ghost" onclick={onclose}>Keep it</button>
      <button class="btn" onclick={cancel} disabled={state === 'working'}>{state === 'working' ? 'Cancelling…' : 'Yes, cancel'}</button>
    </div>
  {:else if state === 'done'}
    <p class="eyebrow">Cancelled</p>
    <h2 id="cx-title" class="display">Your booking is cancelled.</h2>
    <p class="muted">Thank you for letting us know. You’re welcome to book another time.</p>
    <div class="actions"><button class="btn gold" onclick={onclose}>See all services</button></div>
  {:else}
    <h2 id="cx-title" class="display">{state === 'missing' ? 'Nothing to cancel' : 'Something went wrong'}</h2>
    <p class="muted">{state === 'missing' ? 'This booking was already cancelled, or the link is incomplete.' : error}</p>
    <div class="actions"><button class="btn gold" onclick={onclose}>See all services</button></div>
  {/if}
</div>

<style>
  .scrim { position: fixed; inset: 0; z-index: 900; background: rgba(30, 22, 12, 0.38); backdrop-filter: blur(3px); }
  .modal {
    position: fixed;
    z-index: 901;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: min(460px, calc(100% - 32px));
    display: grid;
    gap: 14px;
    padding: 28px;
    border-radius: 20px;
    background: var(--paper);
    box-shadow: var(--shadow-lift);
    animation: pop 0.35s var(--ease);
  }
  @keyframes pop { from { opacity: 0; transform: translate(-50%, -46%); } }
  h2 { font-size: 30px; }
  .what { display: grid; padding: 14px 16px; border-radius: 14px; background: var(--surface); box-shadow: var(--shadow); }
  .what strong { color: var(--ink); }
  .actions { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; margin-top: 4px; }
</style>
