// Small date helpers, ported from maxage. Dates are plain strings
// (YYYY-MM-DD, HH:MM) in the village's local time, so no time-zone
// arithmetic is needed anywhere. Shared by the page and the Netlify function.

export const TIME_ZONE = 'Europe/Rome';

/** Short weekday names, Monday first, in the given locale. */
export function weekdays(locale = 'en-GB') {
  // 2024-01-01 was a Monday.
  return Array.from({ length: 7 }, (_, i) =>
    new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' }).replace('.', '')
  );
}

export function pad(n) {
  return String(n).padStart(2, '0');
}

/** Today's date (YYYY-MM-DD) and time (HH:MM) in the given time zone. */
export function nowIn(timeZone = TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
  const hour = get('hour') === '24' ? '00' : get('hour');
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${hour}:${get('minute')}` };
}

export function isoDate(y, m, d) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** "2026-10" → { year: 2026, month: 10 } */
export function parseMonth(s, fallback) {
  const m = /^(\d{4})-(\d{2})$/.exec(s ?? '') ?? /^(\d{4})-(\d{2})/.exec(fallback);
  return { year: Number(m[1]), month: Number(m[2]) };
}

export function monthKey(year, month) {
  return `${year}-${pad(month)}`;
}

export function shiftMonth(year, month, by) {
  const d = new Date(Date.UTC(year, month - 1 + by, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

export function monthLabel(year, month, locale = 'en-GB') {
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Weeks of a month as a Monday-first grid; `null` cells pad the edges. */
export function monthGrid(year, month) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // Monday = 0
  const cells = Array(lead).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(isoDate(year, month, d));
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function formatLongDate(date, locale = 'en-GB') {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatShortDate(date, locale = 'en-GB') {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

/** Weekday index (0 = Monday) of a YYYY-MM-DD date. */
export function weekdayOf(date) {
  const [y, m, d] = date.split('-').map(Number);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

/** Every date from `from` to `to` inclusive. */
export function dateRange(from, to) {
  const out = [];
  const [y, m, d] = from.split('-').map(Number);
  const cur = new Date(Date.UTC(y, m - 1, d));
  for (let i = 0; i < 400 && isoDate(cur.getUTCFullYear(), cur.getUTCMonth() + 1, cur.getUTCDate()) <= to; i++) {
    out.push(isoDate(cur.getUTCFullYear(), cur.getUTCMonth() + 1, cur.getUTCDate()));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

export function addMinutes(time, minutes) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
}

/** "45 €", "Free / by donation" — what one session costs. */
export function formatPrice(price, currency = 'EUR', locale = 'en-GB') {
  if (!price) return 'By donation';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
}

const OFFER_MODES = { give: { icon: '🎁', verb: 'Gives' }, lend: { icon: '🤝', verb: 'Lends' }, sell: { icon: '🏷️', verb: 'Sells' } };

/** An /offer as one line: "2 hours plumbing", with its mode and any price per unit. */
export function describeOffer(o) {
  const mode = OFFER_MODES[o.mode] ?? OFFER_MODES.give;
  const amount = o.unit && o.unit !== 'one' ? `${o.quantity} ${o.unit} ` : o.quantity > 1 ? `${o.quantity} × ` : '';
  const price = o.mode === 'sell' && o.price != null ? `${formatPrice(o.price, o.currency)}${o.quantity > 1 || o.unit !== 'one' ? ' each' : ''}` : '';
  return { icon: mode.icon, verb: mode.verb, text: `${amount}${o.title}`, price };
}
