<script>
  // The solar view with everything in it at once: rings within rings, like
  // a fractal, so the whole year and today can be seen in one look. The
  // outer ring is the year, the lunations round it in the colour of their
  // warmth; inside it, the lunation we look at, its days round it; inside
  // that, its quarter (the moon's week); and in the middle, the day, its
  // hours round it, light and dark. Every ring keeps the same order: the
  // dark at the top (the winter solstice, the new moon, midnight) and the
  // light below. A faint funnel joins the part of each ring to the whole
  // ring within, so the eye can follow it in.
  //
  // Tap a lunation, a quarter or a day to bring it into the rings within;
  // pinch, Ctrl/⌘-scroll or the buttons to zoom in and read the small
  // things; drag to move about. The idea is Roberto's year dial in Holons;
  // this is drawn afresh in the village's own hand.
  import { sunLongitude, sunTimes } from '../calendar/sun.js';
  import { KINDS, CHILDREN } from './source.js';

  export let lunations = []; // with start, end, index, name, heat, now, items, quarters
  export let rhythms = []; // series, each with beats [{ at, title }]
  export let washes = []; // the compass quarters: [{ a0, a1, colour, name }]
  export let turnings = []; // the solstices and equinoxes: [{ a, name }]
  export let onOpen = () => {}; // open a lunation close up (its list index)
  export let onClose = () => {}; // back to the spiral
  export let onPinchOut = () => {}; // pinching out of the whole circle, back towards the spiral
  export let grow = 1; // 0 the spiral, 1 the rings: they fill in from the outside
  export let frame = null; // where the flat spiral sits: { cx, cy, rim } in page pixels

  const DAY = 86400000;
  const TAU = Math.PI * 2;
  const TOP = -Math.PI / 2;
  const now = Date.now();

  // the rings, outside in
  const R = {
    year: { out: 440, in: 384 },
    moon: { out: 318, in: 276 },
    week: { out: 214, in: 182 },
    day: { out: 124, in: 96 },
  };

  // where a moment sits on each ring
  const yearAngle = (t) => ((-90 + (sunLongitude(t) - 270)) * Math.PI) / 180;
  const spanAngle = (t, from, to) => TOP + (TAU * (t - from)) / (to - from);
  const pt = (a, r) => [r * Math.cos(a), r * Math.sin(a)];
  function arc(a0, a1, r0, r1) {
    if (a1 < a0) a1 += TAU;
    const big = a1 - a0 > Math.PI ? 1 : 0;
    const [x0, y0] = pt(a0, r1);
    const [x1, y1] = pt(a1, r1);
    const [x2, y2] = pt(a1, r0);
    const [x3, y3] = pt(a0, r0);
    return `M${x0} ${y0}A${r1} ${r1} 0 ${big} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${big} 0 ${x3} ${y3}Z`;
  }
  const line = (a, r0, r1) => {
    const [x0, y0] = pt(a, r0);
    const [x1, y1] = pt(a, r1);
    return `M${x0} ${y0}L${x1} ${y1}`;
  };
  const colourOf = (it) => (it.children ? CHILDREN : KINDS[it.kind]?.colour ?? '#6b5a4a');
  const dayStart = (t) => {
    const d = new Date(t);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const fmt = (t, o) => new Date(t).toLocaleDateString('en-GB', o);
  const hhmm = (t) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const beats = (from, to) => rhythms.flatMap((r) => r.beats.filter((b) => b.at >= from && b.at < to).map((b) => ({ ...b, title: r.title, kind: r.kind })));
  const itemsIn = (from, to) => lunations.flatMap((l) => l.items).filter((it) => it.at >= from && it.at < to);

  // what the rings within show: a lunation, a quarter of it, and a day
  let li = Math.max(0, lunations.findIndex((l) => l.now));
  $: L = lunations[li];
  let qi = 0;
  let day = now;
  // keep the quarter and the day inside the lunation in view
  function focusLunation(i) {
    li = i;
    const l = lunations[i];
    const inside = now >= l.start && now <= l.end;
    day = inside ? now : l.start;
    qi = Math.max(0, l.quarters.findIndex((q) => day <= q.end));
  }
  function focusQuarter(k) {
    qi = k;
    const q = L.quarters[k];
    day = now >= q.start && now <= q.end ? now : q.start;
  }
  // open on today: its lunation, its quarter, the day itself
  let started = false;
  $: if (!started && lunations.length) {
    started = true;
    focusLunation(li);
  }
  $: Q = L?.quarters[qi];

  // the year ring: the solar year the lunation sits in, winter solstice to
  // winter solstice, each lunation an arc
  function solsticeBefore(t) {
    let lon = sunLongitude(t);
    for (let d = 1; d < 370; d++) {
      const prev = sunLongitude(t - d * DAY);
      if (prev < 270 && lon >= 270 && lon - prev < 5) return t - (d - 1) * DAY;
      lon = prev;
    }
    return t - 365 * DAY;
  }
  $: yearFrom = L ? solsticeBefore((L.start + L.end) / 2) : 0;
  $: yearTo = yearFrom + 365.2422 * DAY;
  // the moons of the year before and after the ones the timeline holds,
  // faint, at the moon's own pace, until Holons holds them too
  const MONTH = 29.530588 * DAY;
  $: ghosts = lunations.length ? [
    ...Array.from({ length: 14 }, (_, k) => ({ index: lunations[0].index - k - 1, start: lunations[0].start - (k + 1) * MONTH, end: lunations[0].start - k * MONTH - 1, ghost: true, i: -1 })),
    ...Array.from({ length: 14 }, (_, k) => {
      const last = lunations[lunations.length - 1];
      return { index: last.index + k + 1, start: last.end + 1 + k * MONTH, end: last.end + (k + 1) * MONTH, ghost: true, i: -1 };
    }),
  ] : [];
  $: yearMoons = [...lunations.map((l, i) => ({ ...l, i })), ...ghosts]
    .filter((l) => l.end > yearFrom && l.start < yearTo)
    .map((l) => ({ ...l, a0: yearAngle(Math.max(l.start, yearFrom)), a1: yearAngle(Math.min(l.end, yearTo - DAY / 4)) }));

  // the moon ring: its days
  $: moonDays = L ? Array.from({ length: Math.ceil((L.end - L.start) / DAY) }, (_, k) => L.start + k * DAY) : [];
  // the week ring: the days of the quarter
  $: weekDays = Q ? (() => {
    const out = [];
    for (let t = dayStart(Q.start); t < Q.end; t += DAY) out.push(Math.max(t, Q.start));
    return out;
  })() : [];
  $: dayFrom = dayStart(day);
  $: dayTo = dayFrom + DAY;
  $: sun = sunTimes(dayFrom + DAY / 2);
  const minutesOf = (s) => {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
  };
  $: rise = TOP + (TAU * minutesOf(sun.rise)) / 1440;
  $: set = TOP + (TAU * minutesOf(sun.set)) / 1440;

  // a little stack of marks at the same place on a ring, outwards in
  function stacked(list, angleOf, r, step) {
    const placed = [];
    return list
      .slice()
      .sort((a, b) => a.at - b.at)
      .map((it) => {
        const a = angleOf(it.at);
        const k = placed.filter((p) => Math.abs(Math.atan2(Math.sin(p - a), Math.cos(p - a))) * r < step).length;
        placed.push(a);
        return { ...it, a, r: r - k * step };
      });
  }
  $: yearMarks = stacked(itemsIn(yearFrom, yearTo), yearAngle, R.year.in - 10, 10);
  $: moonMarks = L ? stacked([...itemsIn(L.start, L.end + 1), ...beats(L.start, L.end + 1).map((b) => ({ ...b, beat: true }))], (t) => spanAngle(t, L.start, L.end), R.moon.in - 9, 9) : [];
  $: weekMarks = Q ? stacked([...itemsIn(Q.start, Q.end + 1), ...beats(Q.start, Q.end + 1).map((b) => ({ ...b, beat: true }))], (t) => spanAngle(t, Q.start, Q.end), R.week.in - 9, 9) : [];
  $: dayMarks = stacked([...itemsIn(dayFrom, dayTo), ...beats(dayFrom, dayTo).map((b) => ({ ...b, beat: true }))], (t) => TOP + (TAU * (t - dayFrom)) / DAY, R.day.in - 8, 8);

  // the funnels: from the part of each ring to the whole ring within
  function funnel(a0, a1, rFrom, rTo) {
    const [x0, y0] = pt(a0, rFrom);
    const [x1, y1] = pt(a1, rFrom);
    // to the left and right of the ring within, as the eye would follow
    const mid = (a0 + (a1 < a0 ? a1 + TAU : a1)) / 2;
    const [l0, l1] = pt(mid - Math.PI / 2, rTo);
    const [r0, r1] = pt(mid + Math.PI / 2, rTo);
    return `M${x0} ${y0}Q${(x0 + l0) / 2 * 0.7} ${(y0 + l1) / 2 * 0.7} ${l0} ${l1}M${x1} ${y1}Q${(x1 + r0) / 2 * 0.7} ${(y1 + r1) / 2 * 0.7} ${r0} ${r1}`;
  }

  // what is under the pointer, said at the foot
  let note = '';
  const sayDay = (t) => {
    const from = dayStart(t);
    const what = [...itemsIn(from, from + DAY), ...beats(from, from + DAY)].map((x) => x.title).filter(Boolean);
    note = `${fmt(t, { weekday: 'long', day: 'numeric', month: 'long' })}${what.length ? ' · ' + what.join(' · ') : ''}`;
  };

  // zoom and pan: the viewBox shrinks round the pointer
  let svg;
  let view = { x: -500, y: -500, s: 1000 };
  function zoomBy(f, cx = 0, cy = 0) {
    const s = Math.max(120, Math.min(1000, view.s * f));
    if (s === 1000 && f > 1 && view.s === 1000) return onPinchOut(Math.log(f) / 0.01);
    const k = s / view.s;
    view = { x: cx - (cx - view.x) * k, y: cy - (cy - view.y) * k, s };
    if (s === 1000) view = { x: -500, y: -500, s };
  }
  function toView(e) {
    const r = svg.getBoundingClientRect();
    const u = view.s / Math.min(r.width, r.height);
    return [view.x + (e.clientX - r.left - (r.width - Math.min(r.width, r.height)) / 2) * u, view.y + (e.clientY - r.top - (r.height - Math.min(r.width, r.height)) / 2) * u];
  }
  let outAcc = 0;
  export function wheel(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!e.ctrlKey && !e.metaKey && view.s === 1000) {
      // plain scrolling out of the whole circle goes back to the spiral
      outAcc += e.deltaY;
      if (outAcc < -300) return ((outAcc = 0), onClose());
      return;
    }
    const [cx, cy] = toView(e);
    zoomBy(Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), cx, cy);
  }
  let drag = null;
  function down(e) {
    if (view.s === 1000 || e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, view, moved: false };
  }
  function move(e) {
    if (!drag) return;
    const r = svg.getBoundingClientRect();
    const u = view.s / Math.min(r.width, r.height);
    if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 3) drag.moved = true;
    view = { ...drag.view, x: drag.view.x - (e.clientX - drag.x) * u, y: drag.view.y - (e.clientY - drag.y) * u };
  }
  const up = () => setTimeout(() => (drag = null));
  // two fingers on a phone
  let pinchFrom = 0;
  const fingers = (e) => Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  function tstart(e) {
    if (e.touches.length === 2) pinchFrom = fingers(e);
  }
  function tmove(e) {
    if (e.touches.length !== 2 || !pinchFrom) return;
    const d = fingers(e);
    zoomBy(pinchFrom / d);
    pinchFrom = d;
  }
  const tap = (fn) => () => {
    if (!drag?.moved) fn();
  };
  // the words keep a readable size as the rings grow
  $: inv = view.s / 1000;
  // the rings sit in the spiral's own space: the year just inside the
  // seasons' rim, on the same centre
  let vw = 1200;
  let vh = 800;
  $: unit = frame ? (frame.rim * 0.97) / R.year.out : (Math.min(vw, vh) * 0.42) / R.year.out;
  $: cx = frame ? frame.cx : vw / 2;
  $: cy = frame ? frame.cy : vh / 2;
  $: size = 1000 * unit;
  // each ring fills in a little after the one outside it
  const stage = (k) => Math.max(0, Math.min(1, (grow - k * 0.14) / 0.58));
</script>

<svelte:window on:pointermove={move} on:pointerup={up} bind:innerWidth={vw} bind:innerHeight={vh} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="nested" on:wheel={wheel} on:pointerdown={down} on:touchstart|passive={tstart} on:touchmove|passive={tmove} class:zoomed={view.s < 1000} style="--inv: {inv}; opacity: {Math.min(1, grow * 1.6)}">
  <svg bind:this={svg} viewBox="{view.x} {view.y} {view.s} {view.s}" style="left: {cx - size / 2}px; top: {cy - size / 2}px; width: {size}px; height: {size}px; transform: scale({0.9 + 0.1 * grow})" aria-label="The year, the lunation, its quarter and the day, as rings within rings">
    <!-- the sun, the seasons' washes and their paintings are the solar
         view's own, still there behind: these rings only fill the space -->
    <g style="opacity: {stage(0)}">
    <circle class="thread" r={R.year.out} />
    <circle class="thread" r={R.year.in} />

    <!-- the year: each lunation an arc in its warmth -->
    {#each yearMoons as m}
      {@const mid = (m.a0 + (m.a1 < m.a0 ? m.a1 + TAU : m.a1)) / 2}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <g class="seg" class:ghost={m.ghost} class:on={m.i === li} class:now={m.now} on:click={tap(() => !m.ghost && focusLunation(m.i))} on:dblclick={() => !m.ghost && onOpen(m.i)} on:mouseenter={() => (note = m.ghost ? `Lunation ${m.index} · about ${fmt(m.start, { day: 'numeric', month: 'long' })} · not on the timeline yet` : `Lunation ${m.index} · ${m.name} · from ${fmt(m.start, { day: 'numeric', month: 'long' })} · tap to look inside, twice to open`)} role="button" tabindex="-1">
        <path class="wash-arc" d={arc(m.a0, m.a1, R.year.in + 4, R.year.out - 4)} style="fill: {m.ghost ? 'transparent' : m.heat}" />
        <path class="sep" d={line(m.a0, R.year.in, R.year.out)} />
        <text class="num" x={pt(mid, (R.year.in + R.year.out) / 2)[0]} y={pt(mid, (R.year.in + R.year.out) / 2)[1] + 6}>{m.index}</text>
      </g>
    {/each}
    {#each turnings as t}
      <path class="turn" d={line(t.a, R.year.out, R.year.out + 18)} />
    {/each}
    {#each yearMarks as it}
      <circle class="mark" class:q={it.question} cx={pt(it.a, it.r)[0]} cy={pt(it.a, it.r)[1]} r="3.4" style="fill: {colourOf(it)}" on:mouseenter={() => (note = `${fmt(it.at, { day: 'numeric', month: 'long' })} · ${it.title}`)}><title>{it.title}</title></circle>
    {/each}
    {#if now >= yearFrom && now < yearTo}<path class="hand" d={line(yearAngle(now), R.year.in - 4, R.year.out + 6)} />{/if}
    </g>

    {#if L && Q}
      <g style="opacity: {stage(1)}">
      <!-- the lunation: its days round it, new moon at the top -->
      <path class="funnel" d={funnel(yearAngle(L.start), yearAngle(L.end), R.year.in, R.moon.out + 8)} />
      <circle class="ring-ground" r={(R.moon.in + R.moon.out) / 2} style="stroke: {L.heat}; stroke-width: {R.moon.out - R.moon.in - 8}" />
      <circle class="thread" r={R.moon.out} />
      <circle class="thread" r={R.moon.in} />
      {#each L.quarters as q, k}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <g class="seg quarter" class:on={k === qi} on:click={tap(() => focusQuarter(k))} on:mouseenter={() => (note = `${q.name} · ${fmt(q.start, { day: 'numeric', month: 'short' })} to ${fmt(q.end, { day: 'numeric', month: 'short' })}`)} role="button" tabindex="-1">
          <path d={arc(spanAngle(q.start, L.start, L.end), spanAngle(q.end, L.start, L.end), R.moon.in, R.moon.out)} />
        </g>
        <!-- the moon's face at each quarter's start -->
        {@const a = spanAngle(q.start, L.start, L.end)}
        <g class="phase" transform="translate({pt(a, R.moon.out + 16)[0]} {pt(a, R.moon.out + 16)[1]})">
          <circle r="7" class:dark={k === 0} class:full={k === 2} />
          {#if k === 1}<path d="M0 -7A7 7 0 0 1 0 7Z" class="lit" />{/if}
          {#if k === 3}<path d="M0 -7A7 7 0 0 0 0 7Z" class="lit" />{/if}
        </g>
      {/each}
      {#each moonDays as t, k}
        <path class="tick" d={line(spanAngle(t, L.start, L.end), R.moon.out - 6, R.moon.out)} />
        {#if k % 7 === 0 || k === moonDays.length - 1}
          <text class="tiny" x={pt(spanAngle(t + DAY / 2, L.start, L.end), R.moon.in + 12)[0]} y={pt(spanAngle(t + DAY / 2, L.start, L.end), R.moon.in + 12)[1] + 3}>{fmt(t, { day: 'numeric', month: 'short' })}</text>
        {/if}
      {/each}
      {#each moonMarks as it}
        <circle class="mark" class:beat={it.beat} cx={pt(it.a, it.r)[0]} cy={pt(it.a, it.r)[1]} r={it.beat ? 2.6 : 3.4} style="--c: {colourOf(it)}" on:mouseenter={() => sayDay(it.at)}><title>{it.title}</title></circle>
      {/each}
      {#if now >= L.start && now <= L.end}<path class="hand" d={line(spanAngle(now, L.start, L.end), R.moon.in - 4, R.moon.out + 6)} />{/if}
      <text class="ring-name" y={-R.moon.out - 30}>Lunation {L.index} · {L.name}</text>
      </g>
      <g style="opacity: {stage(2)}">
      <circle class="thread" r={R.week.out} />
      <circle class="thread" r={R.week.in} />
      <!-- its quarter, the moon's week: a day each -->
      <path class="funnel" d={funnel(spanAngle(Q.start, L.start, L.end), spanAngle(Q.end, L.start, L.end), R.moon.in, R.week.out + 8)} />
      {#each weekDays as t}
        {@const a0 = spanAngle(t, Q.start, Q.end)}
        {@const a1 = spanAngle(Math.min(dayStart(t) + DAY, Q.end), Q.start, Q.end)}
        {@const mid = (a0 + a1) / 2}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <g class="seg wday" class:on={dayStart(t) === dayFrom} class:today={dayStart(t) === dayStart(now)} on:click={tap(() => (day = t))} on:mouseenter={() => sayDay(t)} role="button" tabindex="-1">
          <path d={arc(a0, a1, R.week.in, R.week.out)} />
          <text class="wd" x={pt(mid, R.week.out + 16)[0]} y={pt(mid, R.week.out + 16)[1] + 4}>{fmt(t, { weekday: 'short' })} {new Date(t).getDate()}</text>
        </g>
      {/each}
      {#each weekMarks as it}
        <circle class="mark" class:beat={it.beat} cx={pt(it.a, it.r)[0]} cy={pt(it.a, it.r)[1]} r={it.beat ? 2.6 : 3.4} style="--c: {colourOf(it)}"><title>{it.title}</title></circle>
      {/each}
      {#if now >= Q.start && now <= Q.end}<path class="hand" d={line(spanAngle(now, Q.start, Q.end), R.week.in - 4, R.week.out + 4)} />{/if}

      </g>
      <g style="opacity: {stage(3)}">
      <!-- the day: its hours, light and dark, midnight at the top -->
      <path class="funnel" d={funnel(spanAngle(Math.max(dayFrom, Q.start), Q.start, Q.end), spanAngle(Math.min(dayTo, Q.end), Q.start, Q.end), R.week.in, R.day.out + 6)} />
      <path class="night" d={arc(set, rise, R.day.in, R.day.out)} />
      <path class="light" d={arc(rise, set, R.day.in, R.day.out)} />
      {#each Array(24) as _, h}
        <path class="tick" class:major={h % 6 === 0} d={line(TOP + (TAU * h) / 24, R.day.out - (h % 6 === 0 ? 8 : 4), R.day.out)} />
        {#if h % 6 === 0}<text class="tiny" x={pt(TOP + (TAU * h) / 24, R.day.out + 13)[0]} y={pt(TOP + (TAU * h) / 24, R.day.out + 13)[1] + 4}>{h}</text>{/if}
      {/each}
      {#each dayMarks as it}
        <circle class="mark" class:beat={it.beat} cx={pt(it.a, it.r)[0]} cy={pt(it.a, it.r)[1]} r="3" style="--c: {colourOf(it)}" on:mouseenter={() => (note = `${hhmm(it.at)} · ${it.title}`)}><title>{it.title}</title></circle>
      {/each}
      {#if now >= dayFrom && now < dayTo}<path class="hand" d={line(TOP + (TAU * (now - dayFrom)) / DAY, R.day.in - 4, R.day.out + 4)} />{/if}
      <text class="centre" y="-14">{fmt(day, { weekday: 'long' })}</text>
      <text class="centre big" y="20">{fmt(day, { day: 'numeric', month: 'long' })}</text>
      <text class="centre small" y="44">sun {sun.rise} to {sun.set}</text>
      <circle class="thread" r={R.day.out} />
      <circle class="thread" r={R.day.in} />
      </g>
    {/if}
  </svg>
  <p class="nest-note">{note || 'tap a lunation, a quarter or a day to look inside · pinch or scroll to zoom'}</p>
  <div class="nest-zoom">
    <button type="button" on:click={() => zoomBy(0.7)} aria-label="Zoom in">+</button>
    <button type="button" on:click={() => zoomBy(1 / 0.7)} aria-label="Zoom out">−</button>
  </div>
</div>

<style>
  /* drawn as the solar view is: watercolour washes in the warmth of each
     moon, fine ink rings and ticks, words on a halo of paper */
  .nested {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  svg {
    position: absolute;
    display: block;
    overflow: visible;
    pointer-events: none;
    transform-origin: 50% 50%;
  }

  .seg,
  .mark,
  .nest-zoom button {
    pointer-events: auto;
  }

  .zoomed .seg {
    cursor: grab;
  }

  .thread {
    fill: none;
    stroke: color-mix(in srgb, var(--bark-900) 70%, transparent);
    stroke-width: calc(1.1px * var(--inv));
  }

  .seg {
    cursor: pointer;
    outline: none;
  }

  .seg path {
    stroke: none;
  }

  .wash-arc {
    opacity: 0.55;
    mix-blend-mode: multiply;
    transition: opacity 0.3s ease;
  }

  .seg:hover .wash-arc {
    opacity: 0.72;
  }

  .seg.on .wash-arc {
    opacity: 0.85;
  }

  .seg.now .wash-arc {
    opacity: 0.75;
  }

  .seg .sep {
    stroke: color-mix(in srgb, var(--bark-900) 45%, transparent);
    stroke-width: calc(0.7px * var(--inv));
  }

  .seg.ghost {
    cursor: default;
  }

  .seg.ghost .num {
    opacity: 0.4;
  }

  .num,
  .turn-name,
  .ring-name,
  .wd,
  .tiny,
  .centre {
    paint-order: stroke;
    stroke: var(--tl-paper, #fffaf2);
    stroke-width: 4px;
    stroke-linejoin: round;
    text-anchor: middle;
    pointer-events: none;
  }

  .num {
    font: 300 calc(26px * max(var(--inv), 0.45)) 'Outfit', system-ui, sans-serif;
    fill: var(--bark-900);
  }

  .seg.now .num {
    fill: var(--rust, #c4463c);
  }

  .turn {
    stroke: color-mix(in srgb, var(--bark-900) 40%, transparent);
    stroke-width: calc(0.8px * var(--inv));
  }

  .ring-name,
  .wd,
  .tiny,
  .centre {
    font-family: 'Playpen Sans', 'Quicksand', sans-serif;
    font-weight: 300;
    fill: color-mix(in srgb, #2f3760 85%, transparent);
  }

  .ring-name {
    font-size: 17px;
  }

  .wd {
    font-size: 13px;
  }

  .tiny {
    font-size: 10px;
  }

  .centre {
    font-size: 16px;
  }

  .centre.big {
    font: 300 30px 'Outfit', system-ui, sans-serif;
    fill: #2f3760;
  }

  .centre.small {
    font-size: 12px;
  }

  .ring-ground {
    fill: none;
    opacity: 0.3;
    mix-blend-mode: multiply;
  }

  .quarter path {
    fill: transparent;
  }

  .quarter.on path {
    fill: color-mix(in srgb, var(--bark-900) 7%, transparent);
  }

  .wday path {
    fill: transparent;
  }

  .wday.on path {
    fill: color-mix(in srgb, #ffd25a 28%, transparent);
  }

  .wday.today .wd {
    fill: var(--rust, #c4463c);
  }

  .phase circle {
    fill: #fffdf8;
    stroke: color-mix(in srgb, var(--bark-900) 55%, transparent);
    stroke-width: 0.6;
  }

  .phase circle.dark {
    fill: #3a3550;
  }

  .phase circle.full {
    fill: #fff4cf;
  }

  .phase .lit {
    fill: #fff4cf;
    stroke: none;
  }

  .tick {
    stroke: color-mix(in srgb, var(--bark-900) 40%, transparent);
    stroke-width: calc(0.6px * var(--inv));
  }

  .tick.major {
    stroke-width: calc(1px * var(--inv));
  }

  .mark {
    fill: var(--c);
    stroke: var(--tl-paper, #fffaf2);
    stroke-width: 1;
    cursor: default;
  }

  .mark.beat {
    fill: var(--tl-paper, #fffaf2);
    stroke: var(--c);
  }

  .mark.q {
    stroke: var(--bark-900);
    stroke-width: 0.6;
  }

  .hand {
    stroke: var(--rust, #c4463c);
    stroke-width: calc(1.4px * var(--inv));
    stroke-linecap: round;
  }

  .funnel {
    fill: none;
    stroke: color-mix(in srgb, var(--bark-900) 16%, transparent);
    stroke-width: calc(0.7px * var(--inv));
    stroke-dasharray: 2 4;
  }

  .night {
    fill: #46557a;
    opacity: 0.35;
    mix-blend-mode: multiply;
  }

  .light {
    fill: #ffd25a;
    opacity: 0.55;
    mix-blend-mode: multiply;
  }

  .nest-note {
    position: absolute;
    left: 50%;
    bottom: 68px;
    max-width: 80vw;
    margin: 0;
    overflow: hidden;
    font: 300 12px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-700, #5a4632);
    text-overflow: ellipsis;
    white-space: nowrap;
    transform: translateX(-50%);
    text-shadow: 0 0 6px var(--tl-paper, #fffaf2);
  }

  .nest-zoom {
    position: absolute;
    right: 24px;
    bottom: 96px;
    display: flex;
    gap: 6px;
  }

  .nest-zoom button {
    width: 28px;
    height: 28px;
    border: 1px solid color-mix(in srgb, var(--bark-900) 25%, transparent);
    border-radius: 50%;
    background: var(--tl-paper, #fffaf2);
    color: var(--bark-800, #4a3828);
    font: 300 16px/1 'Outfit', system-ui, sans-serif;
    cursor: pointer;
  }
</style>
