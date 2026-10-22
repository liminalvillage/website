<script>
  // Month calendar, ported from maxage: links became buttons so the booking
  // flow can stay in one drawer.
  import { weekdays, monthGrid, monthLabel, monthKey, shiftMonth } from './dates.js';

  let {
    year,
    month,
    /** date → number of open slots */
    marks = {},
    selected = null,
    today,
    /** Earliest month the user may navigate back to */
    minMonth = null,
    /** In admin every day is clickable, not only those with open slots */
    allDays = false,
    loading = false,
    onmonth,
    onday,
  } = $props();

  const prev = $derived(shiftMonth(year, month, -1));
  const next = $derived(shiftMonth(year, month, 1));
  const canPrev = $derived(!minMonth || monthKey(prev.year, prev.month) >= minMonth);
  const weeks = $derived(monthGrid(year, month));
</script>

<div class="cal" class:loading>
  <div class="cal-head">
    <button class="nav" disabled={!canPrev} onclick={() => onmonth(monthKey(prev.year, prev.month))} aria-label="Previous month">‹</button>
    <h3 aria-live="polite">{monthLabel(year, month)}</h3>
    <button class="nav" onclick={() => onmonth(monthKey(next.year, next.month))} aria-label="Next month">›</button>
  </div>

  <div class="grid" role="grid">
    {#each weekdays() as wd}
      <div class="wd" role="columnheader">{wd}</div>
    {/each}
    {#each weeks as week}
      {#each week as date}
        {#if date === null}
          <div></div>
        {:else}
          {@const n = marks[date] ?? 0}
          {@const clickable = allDays ? true : n > 0 && date >= today}
          <button
            class="day"
            class:open={n > 0}
            class:selected={selected === date}
            class:today={date === today}
            class:past={date < today}
            disabled={!clickable}
            onclick={() => onday(date)}
            aria-label="{date}{n ? `, ${n} open` : ''}"
            aria-pressed={selected === date}
          >
            {Number(date.slice(8))}
            {#if n > 0}<span class="dot" aria-hidden="true"></span>{/if}
          </button>
        {/if}
      {/each}
    {/each}
  </div>
</div>

<style>
  .cal { transition: opacity 0.2s; }
  .cal.loading { opacity: 0.45; pointer-events: none; }
  .cal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  h3 {
    font-family: var(--display);
    font-size: 22px;
    font-weight: 500;
    color: var(--ink);
    text-transform: capitalize;
  }
  .nav {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 1;
    color: var(--ink);
    transition: background 0.2s;
  }
  .nav:hover:not(:disabled) { background: var(--gold-soft); }
  .nav:disabled { opacity: 0.25; cursor: default; }
  .grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  .wd {
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--muted);
    padding-bottom: 6px;
  }
  .day {
    position: relative;
    aspect-ratio: 1;
    min-height: 38px;
    border-radius: 12px;
    font-size: 14px;
    color: #b9b2a8;
    transition: background 0.15s, color 0.15s, transform 0.15s;
  }
  .day:disabled { cursor: default; }
  .day.open { color: var(--ink); font-weight: 600; background: var(--gold-soft); }
  .day.open:hover:not(:disabled) { background: #f0dcbd; transform: scale(1.05); }
  .day:not(.open):not(:disabled) { color: var(--text); }
  .day:not(.open):not(:disabled):hover { background: #f2ede6; }
  .day.today { box-shadow: inset 0 0 0 1px var(--gold); }
  .day.past { opacity: 0.5; }
  .day.selected, .day.selected:hover:not(:disabled) { background: var(--ink); color: #fff; }
  .dot {
    position: absolute;
    left: 50%;
    bottom: 5px;
    width: 4px;
    height: 4px;
    margin-left: -2px;
    border-radius: 50%;
    background: var(--gold-dark);
  }
  .day.selected .dot { background: var(--gold); }
</style>
