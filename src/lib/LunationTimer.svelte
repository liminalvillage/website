<script>
  // Which lunation we are in and where in it — a live card, centred on the hero, that
  // links to the year in moons (/lunations). Cycle numbers follow
  // @holons/core's `lunationAt`, the bot's /newmoon count.
  import { onMount } from 'svelte';
  import { phase, phase_hunt } from 'lune';
  import MoonIcon from '../calendar/MoonIcon.svelte';
  import { lunationAt } from '../calendar/lunation.js';

  const PHASES = [
    'New moon',
    'Waxing crescent',
    'First quarter',
    'Waxing gibbous',
    'Full moon',
    'Waning gibbous',
    'Last quarter',
    'Waning crescent',
  ];
  const DAY_MS = 86_400_000;

  let now = $state(Date.now());

  const cycle = $derived(lunationAt(now));
  const moon = $derived(phase(new Date(now)));
  // Centred bands, as the kiosk names them: 0 ± 1/16 is "new moon".
  const k = $derived(Math.floor(((moon.phase + 1 / 16) % 1) * 8));
  const fullAt = $derived(phase_hunt(new Date(cycle.from + DAY_MS)).full_date.getTime());
  const length = $derived(cycle.to + 1 - cycle.from);
  const progress = $derived((now - cycle.from) / length);
  const fullMark = $derived((fullAt - cycle.from) / length);
  const day = $derived(Math.floor((now - cycle.from) / DAY_MS) + 1);
  const days = $derived(Math.round(length / DAY_MS));
  const next = $derived(now < fullAt ? { name: 'Full moon', at: fullAt } : { name: 'New moon', at: cycle.to + 1 });

  function countdown(ms) {
    const mins = Math.max(0, Math.round(ms / 60_000));
    const d = Math.floor(mins / 1440);
    const h = Math.floor((mins % 1440) / 60);
    const m = mins % 60;
    return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`;
  }
  const when = (ms) => new Date(ms).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  onMount(() => {
    const tick = setInterval(() => (now = Date.now()), 30_000);
    return () => clearInterval(tick);
  });
</script>

<a class="lt" href="/lunations" aria-label="Lunation {cycle.index}, {PHASES[k]}. See the year in moons.">
  <div class="top">
    <span class="moon"><MoonIcon {k} /></span>
    <div>
      <p class="eyebrow">Lunation {cycle.index}</p>
      <p class="phase">{PHASES[k]}</p>
      <p class="meta">{Math.round(moon.illuminated * 100)}% lit · day {day} of {days}</p>
    </div>
  </div>

  <div class="bar" aria-hidden="true">
    <span class="fill" style="width: {progress * 100}%"></span>
    <span class="mark full" style="left: {fullMark * 100}%" title="Full moon"></span>
    <span class="now" style="left: {progress * 100}%"></span>
  </div>
  <div class="ends" aria-hidden="true">
    <span>● {when(cycle.from)}</span>
    <span>○ {when(fullAt)}</span>
    <span>● {when(cycle.to + 1)}</span>
  </div>

  <p class="next"><strong>{next.name}</strong> in {countdown(next.at - now)}</p>
  <span class="cta">The year in moons →</span>
</a>

<style>
  .lt {
    width: min(320px, calc(100% - 32px));
    margin-top: 32px;
    display: grid;
    gap: 12px;
    padding: 18px 20px;
    border-radius: 18px;
    color: #f4efe6;
    text-decoration: none;
    background: rgba(20, 18, 15, 0.42);
    border: 1px solid rgba(232, 196, 144, 0.28);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
    animation: rise 1.4s ease both 0.3s;
    transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
  }
  .lt:hover {
    transform: translateY(-3px);
    border-color: rgba(232, 196, 144, 0.6);
    background: rgba(20, 18, 15, 0.55);
  }
  .lt:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 3px; }
  @keyframes rise { from { opacity: 0; transform: translateY(14px); } }

  .top { display: flex; align-items: center; gap: 14px; }
  .moon { font-size: 44px; line-height: 1; color: #f6e7c8; filter: drop-shadow(0 0 10px rgba(246, 231, 200, 0.45)); }
  .eyebrow { margin: 0; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: rgba(232, 196, 144, 0.95); line-height: 1.4; }
  .phase { margin: 2px 0 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 500; letter-spacing: 0.5px; line-height: 1.1; color: #fff; }
  .meta { margin: 2px 0 0; font-size: 12px; letter-spacing: 0.5px; line-height: 1.4; color: rgba(244, 239, 230, 0.75); }

  .bar { position: relative; height: 6px; border-radius: 999px; background: rgba(255, 255, 255, 0.16); }
  .fill { position: absolute; inset: 0 auto 0 0; border-radius: 999px; background: linear-gradient(90deg, rgba(214, 161, 91, 0.5), #e8c490); }
  .mark.full { position: absolute; top: 50%; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; background: #f4f0e4; border: 1px solid rgba(0, 0, 0, 0.25); }
  .now { position: absolute; top: 50%; width: 4px; height: 16px; margin: -8px 0 0 -2px; border-radius: 2px; background: #fff; box-shadow: 0 0 8px rgba(255, 255, 255, 0.8); }
  .ends { display: flex; justify-content: space-between; margin-top: -6px; font-size: 11px; letter-spacing: 0.3px; color: rgba(244, 239, 230, 0.65); }

  .next { margin: 0; font-size: 14px; letter-spacing: 0.5px; line-height: 1.4; color: rgba(244, 239, 230, 0.9); }
  .next strong { color: #fff; font-weight: 600; }
  .cta { font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #e8c490; }

  @media (max-width: 768px) {
    .lt {
      margin-top: 28px;
      padding: 14px 16px;
      gap: 10px;
    }
    .moon { font-size: 36px; }
    .phase { font-size: 22px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .lt { animation: none; transition: none; }
  }
</style>
