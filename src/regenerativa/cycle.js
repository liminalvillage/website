// The network's rhythm: lunations (new moon → new moon) and the four seasonal
// thresholds. Lunations come from the same calculation the bot and /lunations use.
import { lunationAt, SYNODIC_MONTH_DAYS } from '../calendar/lunation.js';

const DAY = 86400000;

/** Where we are now: { index, day (1-based), days, phase 0..1 }. */
export function now(ts = Date.now()) {
  const l = lunationAt(ts);
  const days = Math.round((l.to + 1 - l.from) / DAY);
  return {
    index: l.index,
    day: Math.floor((ts - l.from) / DAY) + 1,
    days,
    phase: (ts - l.from) / (l.to + 1 - l.from),
  };
}

/** The next `count` lunations, starting with the current one. Full moon is the cycle's midpoint (±1 day). */
export function upcoming(count = 4, ts = Date.now()) {
  const out = [];
  let l = lunationAt(ts);
  for (let i = 0; i < count; i++) {
    out.push({ index: l.index, newMoon: new Date(l.from), fullMoon: new Date(l.from + (SYNODIC_MONTH_DAYS / 2) * DAY), current: i === 0 });
    l = lunationAt(l.to + 1);
  }
  return out;
}

// Equinoxes and solstices, close enough for planning (they drift by a day at most).
const THRESHOLDS = [
  { key: 'spring', month: 2, day: 20 },
  { key: 'summer', month: 5, day: 21 },
  { key: 'autumn', month: 8, day: 22 },
  { key: 'winter', month: 11, day: 21 },
];

export function seasons(count = 4, ts = Date.now()) {
  const today = new Date(ts);
  today.setHours(0, 0, 0, 0);
  const out = [];
  for (let y = today.getFullYear(); out.length < count; y++) {
    for (const t of THRESHOLDS) {
      const d = new Date(y, t.month, t.day);
      if (d >= today && out.length < count) out.push({ key: t.key, date: d });
    }
  }
  return out;
}
