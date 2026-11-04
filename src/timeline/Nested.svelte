<script>
  // The solar view with everything in it at once: one spiral winding in,
  // like a fractal, so the whole year and today can be seen in one look.
  // Its outer turn is the year, the lunations along it in the colour of
  // their warmth; the year runs on into the next turn, the lunation we look
  // at, its days along it; that runs into its quarter (the moon's week), and
  // that into the day, its hours, light and dark, at the heart. Every turn
  // keeps the same order: the dark at the top (the winter solstice, the new
  // moon, midnight) and the light below, and each begins where the one
  // outside it ends.
  //
  // Tap a lunation, a quarter or a day to bring it into the turns within;
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
  export let grow = 1; // 0 the solar spiral, 1 this one: it fills in from the outside
  export let onZoom = () => {}; // { z, x, y }: the same zoom laid on the solar view behind
  export let frame = null; // where the flat spiral sits: { cx, cy, rim } in page pixels

  const DAY = 86400000;
  const TAU = Math.PI * 2;
  const TOP = -Math.PI / 2;
  const now = Date.now();

  // the spiral: its middle line and width where each turn begins; a turn
  // ends where the next begins, so the four scales are one line
  const C = [428, 318, 222, 140, 70];
  const W = [50, 40, 32, 28, 18];
  const YEAR = 0;
  const MOON = 1;
  const WEEK = 2;
  const DAYS = 3;

  const yearAngle = (t) => ((-90 + (sunLongitude(t) - 270)) * Math.PI) / 180;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  // how far through its turn a moment is, 0 to 1
  const yearF = (t) => clamp01((((yearAngle(t) - TOP) % TAU) + TAU) % TAU / TAU);
  const spanF = (t, from, to) => clamp01((t - from) / (to - from));
  const pt = (a, r) => [r * Math.cos(a), r * Math.sin(a)];
  // a point on turn lv, f along it, o across it (-0.5 inner edge, 0.5 outer)
  function at(lv, f, o = 0) {
    const r = C[lv] + (C[lv + 1] - C[lv]) * f + o * (W[lv] + (W[lv + 1] - W[lv]) * f);
    return pt(TOP + TAU * f, r);
  }
  // a stretch of a turn, as a filled band
  function band(lv, f0, f1, inset = 0) {
    const n = Math.max(2, Math.ceil((f1 - f0) * 160));
    const outer = Array.from({ length: n + 1 }, (_, k) => at(lv, f0 + ((f1 - f0) * k) / n, 0.5 - inset));
    const inner = Array.from({ length: n + 1 }, (_, k) => at(lv, f1 - ((f1 - f0) * k) / n, -0.5 + inset));
    return 'M' + [...outer, ...inner].map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';
  }
  // an edge of a turn, as a line
  function edge(lv, o) {
    return 'M' + Array.from({ length: 161 }, (_, k) => at(lv, k / 160, o)).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');
  }
  // a short line across a turn
  const tick = (lv, f, o0 = -0.5, o1 = 0.5) => {
    const [x0, y0] = at(lv, f, o0);
    const [x1, y1] = at(lv, f, o1);
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
    .map((l) => ({ ...l, f0: yearF(Math.max(l.start, yearFrom)), f1: Math.max(yearF(Math.max(l.start, yearFrom)), yearF(Math.min(l.end, yearTo - DAY / 4)) || 1) }));

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
  $: rise = minutesOf(sun.rise) / 1440;
  $: set = minutesOf(sun.set) / 1440;

  // a little stack of marks at the same place on a turn, from its inner edge in
  function stacked(list, fOf, lv) {
    const placed = [];
    const step = 9;
    return list
      .slice()
      .sort((a, b) => a.at - b.at)
      .map((it) => {
        const f = fOf(it.at);
        const r = C[lv] + (C[lv + 1] - C[lv]) * f;
        const k = placed.filter((p) => Math.abs(p - f) * TAU * r < step).length;
        placed.push(f);
        const w = W[lv] + (W[lv + 1] - W[lv]) * f;
        const [x, y] = at(lv, f, -0.25 - (k * step) / w);
        return { ...it, x, y };
      });
  }
  $: yearMarks = stacked(itemsIn(yearFrom, yearTo), yearF, YEAR);
  $: moonMarks = L ? stacked([...itemsIn(L.start, L.end + 1), ...beats(L.start, L.end + 1).map((b) => ({ ...b, beat: true }))], (t) => spanF(t, L.start, L.end), MOON) : [];
  $: weekMarks = Q ? stacked([...itemsIn(Q.start, Q.end + 1), ...beats(Q.start, Q.end + 1).map((b) => ({ ...b, beat: true }))], (t) => spanF(t, Q.start, Q.end), WEEK) : [];
  $: dayMarks = stacked([...itemsIn(dayFrom, dayTo), ...beats(dayFrom, dayTo).map((b) => ({ ...b, beat: true }))], (t) => spanF(t, dayFrom, dayTo), DAYS);

  // what is under the pointer, said at the foot
  let note = '';
  const sayDay = (t) => {
    const from = dayStart(t);
    const what = [...itemsIn(from, from + DAY), ...beats(from, from + DAY)].map((x) => x.title).filter(Boolean);
    note = `${fmt(t, { weekday: 'long', day: 'numeric', month: 'long' })}${what.length ? ' · ' + what.join(' · ') : ''}`;
  };

  // zoom and pan: the whole solar view moves as one, the paintings and
  // washes behind with the spiral, like one map; z about a point on screen
  let zoom = { z: 1, x: 0, y: 0 };
  $: onZoom(zoom);
  // pinching back out rests at the whole spiral; going on to the solar
  // spiral takes another pinch
  let lastWheel = 0;
  let gestureAt = 0;
  let wholeAt = 0;
  function zoomBy(f, px = vw / 2, py = vh / 2) {
    const z = Math.max(1, Math.min(8, zoom.z / f));
    if (z === 1 && f > 1 && zoom.z === 1) return wholeAt > gestureAt ? null : onPinchOut(Math.log(f) / 0.01);
    if (z === 1 && zoom.z > 1) wholeAt = Date.now();
    const k = z / zoom.z;
    zoom = z === 1 ? { z: 1, x: 0, y: 0 } : { z, x: px - (px - zoom.x) * k, y: py - (py - zoom.y) * k };
  }
  // scrolling zooms, as a pinch does, round the pointer: in, and more is
  // shown; out past the whole spiral (after a rest), back to the solar view
  export function wheel(e) {
    e.preventDefault();
    e.stopPropagation();
    const t = Date.now();
    if (t - lastWheel > 250) gestureAt = t;
    lastWheel = t;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? 0 : e.deltaY;
    if (!d) return;
    zoomBy(Math.exp(d * (e.ctrlKey ? 0.01 : 0.003)), e.clientX, e.clientY);
  }
  let drag = null;
  function down(e) {
    if (zoom.z === 1 || e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, zoom, moved: false };
  }
  function move(e) {
    if (!drag) return;
    if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 3) drag.moved = true;
    zoom = { ...drag.zoom, x: drag.zoom.x + e.clientX - drag.x, y: drag.zoom.y + e.clientY - drag.y };
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
    zoomBy(pinchFrom / d, (e.touches[0].clientX + e.touches[1].clientX) / 2, (e.touches[0].clientY + e.touches[1].clientY) / 2);
    pinchFrom = d;
  }
  const tap = (fn) => () => {
    if (!drag?.moved) fn();
  };
  // lines stay fine as it grows; words and marks grow only a little, so
  // closer in, more of them fit (as Roberto's cards do)
  $: inv = 1 / zoom.z;
  $: tinv = 1 / Math.sqrt(zoom.z);
  // how much is shown: 0 the whole, 1 closer (months, what's on, every
  // day), 2 close (every hour, every title)
  $: lod = zoom.z < 1.6 ? 0 : zoom.z < 3.2 ? 1 : 2;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  $: months = (() => {
    const out = [];
    const d = new Date(yearFrom);
    for (let m = new Date(d.getFullYear(), d.getMonth() + 1, 1); m.getTime() < yearTo; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) out.push({ at: m.getTime(), name: MONTHS[m.getMonth()] });
    return out;
  })();
  // a title wrapped onto two short lines at most, never cut short
  function lines(t = '', width = 20) {
    const out = [];
    for (const w of t.split(/\s+/)) {
      const last = out[out.length - 1];
      if (last && (last + ' ' + w).length <= width) out[out.length - 1] = last + ' ' + w;
      else out.push(w);
    }
    return out;
  }
  // the rings sit in the spiral's own space: the year just inside the
  // seasons' rim, on the same centre
  let vw = 1200;
  let vh = 800;
  $: unit = frame ? (frame.rim * 0.97) / (C[0] + W[0] / 2) : (Math.min(vw, vh) * 0.42) / (C[0] + W[0] / 2);
  $: cx = frame ? frame.cx : vw / 2;
  $: cy = frame ? frame.cy : vh / 2;
  $: size = 1000 * unit;
  // each ring fills in a little after the one outside it
  const stage = (k, g) => Math.max(0, Math.min(1, (g - k * 0.14) / 0.58)); // g: grow, passed so the rings follow it
</script>

<svelte:window on:pointermove={move} on:pointerup={up} bind:innerWidth={vw} bind:innerHeight={vh} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- its wheel comes through the timeline (wheel below), so one pinch is one gesture -->
<div class="nested" on:pointerdown={down} on:touchstart|passive={tstart} on:touchmove|passive={tmove} class:zoomed={zoom.z > 1} style="--inv: {inv}; --tinv: {tinv}; opacity: {Math.min(1, grow * 1.6)}">
  <div class="map" class:held={drag} style="translate: {zoom.x}px {zoom.y}px; scale: {zoom.z}">
  <svg viewBox="-500 -500 1000 1000" style="left: {cx - size / 2}px; top: {cy - size / 2}px; width: {size}px; height: {size}px; transform: scale({0.9 + 0.1 * grow})" aria-label="The year, the lunation, its quarter and the day, as rings within rings">
    <!-- the sun, the seasons' washes and their paintings are the solar
         view's own, still there behind: this spiral only fills the space -->

    <!-- the year: each lunation a stretch of the outer turn, in its warmth -->
    <g style="opacity: {stage(0, grow)}">
      <path class="thread" d={edge(YEAR, 0.5)} />
      <path class="thread" d={edge(YEAR, -0.5)} />
      {#each yearMoons as m}
        {@const mid = (m.f0 + m.f1) / 2}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <g class="seg" class:ghost={m.ghost} class:on={m.i === li} class:now={m.now} on:click={tap(() => !m.ghost && focusLunation(m.i))} on:dblclick={() => !m.ghost && onOpen(m.i)} on:mouseenter={() => (note = m.ghost ? `Lunation ${m.index} · about ${fmt(m.start, { day: 'numeric', month: 'long' })} · not on the timeline yet` : `Lunation ${m.index} · ${m.name} · from ${fmt(m.start, { day: 'numeric', month: 'long' })} · tap to look inside, twice to open`)} role="button" tabindex="-1">
          <path class="wash-arc" d={band(YEAR, m.f0, m.f1, 0.06)} style="fill: {m.ghost ? 'transparent' : m.heat}" />
          <path class="hit" d={band(YEAR, m.f0, m.f1)} />
          <path class="sep" d={tick(YEAR, m.f0)} />
          <text class="num" x={at(YEAR, mid)[0]} y={at(YEAR, mid)[1] + 6}>{m.index}</text>
        </g>
      {/each}
      {#if lod >= 1}
        {#each months as mo}
          {@const [x, y] = at(YEAR, yearF(mo.at), 0.85)}
          <path class="tick" d={tick(YEAR, yearF(mo.at), 0.5, 0.7)} />
          <text class="mo" {x} y={y + 3}>{mo.name}</text>
        {/each}
      {/if}
      {#each turnings as t}
        <path class="turn" d={tick(YEAR, (((t.a - TOP) % TAU) + TAU) % TAU / TAU, 0.5, 0.9)} />
      {/each}
      {#each yearMarks as it}
        <circle class="mark" class:q={it.question} cx={it.x} cy={it.y} r={3.4 * tinv} style="--c: {colourOf(it)}" on:mouseenter={() => (note = `${fmt(it.at, { day: 'numeric', month: 'long' })} · ${it.title}`)}><title>{it.title}</title></circle>
        {#if lod >= 1}<text class="lbl" x={it.x + 6 * tinv} y={it.y + 3 * tinv}>{#each lines(it.title) as l, j}<tspan x={it.x + 6 * tinv} dy={j ? 11 * tinv : 0}>{l}</tspan>{/each}</text>{/if}
      {/each}
      {#if now >= yearFrom && now < yearTo}<path class="hand" d={tick(YEAR, yearF(now), -0.6, 0.6)} />{/if}
    </g>

    {#if L && Q}
      <!-- the year runs on into the lunation: its days, new moon at the top -->
      <g style="opacity: {stage(1, grow)}">
        <path class="ring-ground" d={band(MOON, 0, 1, 0.1)} style="fill: {L.heat}" />
        <path class="thread" d={edge(MOON, 0.5)} />
        <path class="thread" d={edge(MOON, -0.5)} />
        {#each L.quarters as q, k}
          {@const f0 = spanF(q.start, L.start, L.end)}
          {@const f1 = spanF(q.end, L.start, L.end)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <g class="seg quarter" class:on={k === qi} on:click={tap(() => focusQuarter(k))} on:mouseenter={() => (note = `${q.name} · ${fmt(q.start, { day: 'numeric', month: 'short' })} to ${fmt(q.end, { day: 'numeric', month: 'short' })}`)} role="button" tabindex="-1">
            <path d={band(MOON, f0, f1)} />
          </g>
          <!-- the moon's face where each quarter begins -->
          <g class="phase" transform="translate({at(MOON, f0, 0.95)[0]} {at(MOON, f0, 0.95)[1]})">
            <circle r="7" class:dark={k === 0} class:full={k === 2} />
            {#if k === 1}<path d="M0 -7A7 7 0 0 1 0 7Z" class="lit" />{/if}
            {#if k === 3}<path d="M0 -7A7 7 0 0 0 0 7Z" class="lit" />{/if}
          </g>
        {/each}
        {#each moonDays as t, k}
          <path class="tick" d={tick(MOON, spanF(t, L.start, L.end), 0.25, 0.5)} />
          {#if k % 7 === 3 || lod >= 1}
            {@const [x, y] = at(MOON, spanF(t + DAY / 2, L.start, L.end), lod >= 1 ? 0.05 : -0.95)}
            <text class="tiny" {x} y={y + 3}>{lod >= 1 && k % 7 !== 3 ? new Date(t).getDate() : fmt(t, { day: 'numeric', month: 'short' })}</text>
          {/if}
        {/each}
        {#each moonMarks as it}
          <circle class="mark" class:beat={it.beat} cx={it.x} cy={it.y} r={(it.beat ? 2.6 : 3.4) * tinv} style="--c: {colourOf(it)}" on:mouseenter={() => sayDay(it.at)}><title>{it.title}</title></circle>
          {#if lod >= 1 && (!it.beat || lod >= 2)}<text class="lbl" x={it.x + 6 * tinv} y={it.y + 3 * tinv}>{#each lines(it.title) as l, j}<tspan x={it.x + 6 * tinv} dy={j ? 11 * tinv : 0}>{l}</tspan>{/each}</text>{/if}
        {/each}
        {#if now >= L.start && now <= L.end}<path class="hand" d={tick(MOON, spanF(now, L.start, L.end), -0.6, 0.6)} />{/if}
        <text class="ring-name" x={at(MOON, 0.5, 1.3)[0]} y={at(MOON, 0.5, 1.3)[1] + 4}>Lunation {L.index} · {L.name}</text>
      </g>

      <!-- and on into its quarter, the moon's week: a day each -->
      <g style="opacity: {stage(2, grow)}">
        <path class="thread" d={edge(WEEK, 0.5)} />
        <path class="thread" d={edge(WEEK, -0.5)} />
        {#each weekDays as t}
          {@const f0 = spanF(t, Q.start, Q.end)}
          {@const f1 = spanF(Math.min(dayStart(t) + DAY, Q.end), Q.start, Q.end)}
          {@const [x, y] = at(WEEK, (f0 + f1) / 2, 1.05)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <g class="seg wday" class:on={dayStart(t) === dayFrom} class:today={dayStart(t) === dayStart(now)} on:click={tap(() => (day = t))} on:mouseenter={() => sayDay(t)} role="button" tabindex="-1">
            <path d={band(WEEK, f0, f1)} />
            <path class="sep" d={tick(WEEK, f0)} />
            <text class="wd" {x} y={y + 4}>{fmt(t, { weekday: 'short' })} {new Date(t).getDate()}</text>
          </g>
        {/each}
        {#each weekMarks as it}
          <circle class="mark" class:beat={it.beat} cx={it.x} cy={it.y} r={(it.beat ? 2.6 : 3.4) * tinv} style="--c: {colourOf(it)}"><title>{it.title}</title></circle>
          {#if lod >= 1}<text class="lbl" x={it.x + 6 * tinv} y={it.y + 3 * tinv}>{#each lines(it.title) as l, j}<tspan x={it.x + 6 * tinv} dy={j ? 11 * tinv : 0}>{l}</tspan>{/each}</text>{/if}
        {/each}
        {#if now >= Q.start && now <= Q.end}<path class="hand" d={tick(WEEK, spanF(now, Q.start, Q.end), -0.6, 0.6)} />{/if}
      </g>

      <!-- and into the day at the heart: its hours, light and dark, midnight at the top -->
      <g style="opacity: {stage(3, grow)}">
        <path class="night" d={band(DAYS, 0, rise)} />
        <path class="light" d={band(DAYS, rise, set)} />
        <path class="night" d={band(DAYS, set, 1)} />
        <path class="thread" d={edge(DAYS, 0.5)} />
        <path class="thread" d={edge(DAYS, -0.5)} />
        {#each Array(24) as _, h}
          <path class="tick" class:major={h % 6 === 0} d={tick(DAYS, h / 24, h % 6 === 0 ? 0 : 0.25, 0.5)} />
          {#if h % (lod >= 2 ? 1 : lod >= 1 ? 3 : 6) === 0}
            {@const [x, y] = at(DAYS, h / 24, -1.05)}
            <text class="tiny" {x} y={y + 4}>{h}</text>
          {/if}
        {/each}
        {#each dayMarks as it}
          <circle class="mark" class:beat={it.beat} cx={it.x} cy={it.y} r={3 * tinv} style="--c: {colourOf(it)}" on:mouseenter={() => (note = `${hhmm(it.at)} · ${it.title}`)}><title>{it.title}</title></circle>
          {#if lod >= 1}<text class="lbl" x={it.x + 6 * tinv} y={it.y + 3 * tinv}>{hhmm(it.at)} {it.title}</text>{/if}
        {/each}
        {#if now >= dayFrom && now < dayTo}<path class="hand" d={tick(DAYS, spanF(now, dayFrom, dayTo), -0.6, 0.6)} />{/if}
        <text class="centre" y="-10">{fmt(day, { weekday: 'long' })}</text>
        <text class="centre big" y="12">{fmt(day, { day: 'numeric', month: 'short' })}</text>
        <text class="centre small" y="28">{sun.rise} to {sun.set}</text>
      </g>
    {/if}
  </svg>
  </div>
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

  /* each step of a pinch eases in, so the zoom flows; dragging follows
     the hand at once */
  .map {
    position: absolute;
    inset: 0;
    transform-origin: 0 0;
    pointer-events: none;
    transition: scale 0.28s ease-out, translate 0.28s ease-out;
  }

  .map.held {
    transition: none;
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

  .seg .hit {
    fill: transparent;
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
    font: 300 calc(26px * var(--tinv, 1)) 'Outfit', system-ui, sans-serif;
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
    font-size: calc(17px * var(--tinv, 1));
  }

  .wd {
    font-size: calc(13px * var(--tinv, 1));
  }

  .tiny {
    font-size: calc(10px * var(--tinv, 1));
  }

  .centre {
    font-size: 11px;
  }

  .centre.big {
    font: 300 20px 'Outfit', system-ui, sans-serif;
    fill: #2f3760;
  }

  .centre.small {
    font-size: 9px;
  }

  .ring-ground {
    stroke: none;
    opacity: 0.22;
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

  .lbl,
  .mo {
    paint-order: stroke;
    stroke: var(--tl-paper, #fffaf2);
    stroke-width: calc(3px * var(--tinv, 1));
    stroke-linejoin: round;
    font-family: 'Playpen Sans', 'Quicksand', sans-serif;
    font-weight: 300;
    pointer-events: none;
  }

  .lbl {
    font-size: calc(9px * var(--tinv, 1));
    fill: var(--bark-900);
    animation: nest-in 0.4s ease-out;
  }

  .mo {
    font-size: calc(10px * var(--tinv, 1));
    fill: color-mix(in srgb, #2f3760 75%, transparent);
    text-anchor: middle;
    animation: nest-in 0.4s ease-out;
  }

  @keyframes nest-in {
    from {
      opacity: 0;
    }
  }

  .mark {
    fill: var(--c, #6b5a4a);
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
