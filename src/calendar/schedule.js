// Quests → calendar events, read-only. A port of the reading side of
// @holons/core/tasks (schedule.ts, recurrence.ts, placement.ts, kind.ts) and
// the kiosk's `toEvents` (apps/kiosk/src/lib/data.ts), so this page draws the
// same cards on the same days as the kiosk. Keep in step with those files.

const NAIVE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?$/;
const DAY_MS = 86_400_000;

/** A stored date/instant → Date; a bare `YYYY-MM-DD` is local midnight. */
export function parseInstant(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const s = String(value).trim();
  if (!s) return null;
  const m = NAIVE.exec(s);
  const d = m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0)) : new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

const pad2 = (n) => String(n).padStart(2, '0');
const dateField = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const isTimedValue = (value) => /T\d\d:/.test(String(value ?? ''));

/** Days since the epoch, counted in the viewer's own timezone. */
export const localDayNumber = (d) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);

const UNDATED = { start: null, end: null, allDay: true, days: 0, multiDay: false };

/** Resolve a quest's stored schedule into dates + the (inclusive) days it covers. */
export function questSchedule(q) {
  const start = parseInstant(q?.when);
  if (!start) return UNDATED;
  const allDay = !isTimedValue(q?.when);
  const rawEnd = parseInstant(q?.ends ?? q?.until);
  const end = rawEnd && rawEnd.getTime() > start.getTime() ? rawEnd : null;
  const firstDay = localDayNumber(start);
  const lastDay = !end
    ? firstDay
    : localDayNumber(allDay || end.getHours() || end.getMinutes() ? end : new Date(end.getTime() - 1));
  const days = Math.max(1, lastDay - firstDay + 1);
  return { start, end, allDay, days, multiDay: days > 1 };
}

/** Move a schedule to `newWhen`, carrying its end along (see core `shiftSchedule`). */
function shiftSchedule(q, newWhen) {
  const s = questSchedule(q);
  const start = parseInstant(newWhen);
  const blank = { when: newWhen, ends: '' };
  if (!start || !s.start || !s.end) return blank;
  const toAllDay = !isTimedValue(newWhen);
  if (!toAllDay && !s.allDay) {
    return { when: newWhen, ends: new Date(s.end.getTime() + (start.getTime() - s.start.getTime())).toISOString() };
  }
  if (s.days < 2) return blank;
  const last = new Date(start);
  last.setDate(last.getDate() + (s.days - 1));
  return { when: newWhen, ends: toAllDay ? dateField(last) : last.toISOString() };
}

// ── Recurrence ────────────────────────────────────────────────────────

const FREQUENCIES = ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'sixmonths', 'yearly'];
const MAX_OCCURRENCES = 500;

function questFrequency(q) {
  const raw = String(q?.frequency ?? '').trim().toLowerCase();
  return FREQUENCIES.includes(raw) ? raw : null;
}

function advance(from, frequency) {
  const d = new Date(from.getTime());
  const step = { daily: [0, 1], weekly: [0, 7], biweekly: [0, 14], monthly: [1], quarterly: [3], sixmonths: [6], yearly: [12] }[frequency];
  if (step.length === 2) d.setDate(d.getDate() + step[1]);
  else d.setMonth(d.getMonth() + step[0]);
  return d;
}

function completedSet(q) {
  const out = new Set();
  for (const v of Array.isArray(q?.completedOccurrences) ? q.completedOccurrences : []) {
    if (typeof v !== 'string' || !v) continue;
    out.add(v);
    const m = /^(\d{4}-\d{2}-\d{2})T00:00:00(?:\.000)?Z$/.exec(v);
    if (m) out.add(m[1]);
  }
  return out;
}

/** The occurrences of a series touching `window`, in order. */
function questOccurrences(q, window) {
  const frequency = questFrequency(q);
  const base = questSchedule(q);
  if (!frequency || !base.start) return [];
  const done = completedSet(q);
  const spanMs = base.end ? base.end.getTime() - base.start.getTime() : 0;
  const out = [];
  let cur = base.start;
  let steps = 0;
  while (cur <= window.end && steps++ < MAX_OCCURRENCES) {
    if (cur.getTime() + spanMs >= window.start.getTime()) {
      const when = isTimedValue(q.when) ? cur.toISOString() : dateField(cur);
      out.push({ when, schedule: shiftSchedule(q, when), completed: done.has(when) });
    }
    const next = advance(cur, frequency);
    if (next.getTime() <= cur.getTime()) break;
    cur = next;
  }
  return out;
}

// ── Placement ─────────────────────────────────────────────────────────

const isCompleted = (q) => q._deleted !== true && (String(q.status ?? '').toLowerCase() === 'completed' || q.completed === true);

/**
 * Dated quests → the events a year calendar draws, for the window around
 * `year`. A recurring series contributes one event per occurrence.
 */
export function toEvents(quests, year) {
  const window = { start: new Date(year, 0, 1), end: new Date(year + 1, 0, 1) };
  const out = [];
  const seen = new Set();
  for (const q of quests) {
    if (q._deleted === true || String(q.status ?? '').toLowerCase() === 'cancelled') continue;
    if (!questSchedule(q).start) continue;
    const id = String(q.id ?? q.title);
    if (seen.has(id)) continue;
    seen.add(id);
    const completed = isCompleted(q);
    const common = { title: q.title || 'Untitled', category: q.category || '', location: q.location || '' };
    const occurrences = questFrequency(q)
      ? questOccurrences(q, completed ? { start: window.start, end: new Date() } : window)
      : [];
    if (occurrences.length) {
      for (const occ of occurrences) {
        const s = questSchedule(occ.schedule);
        if (!s.start) continue;
        out.push({ ...common, id: `${id}::${occ.when}`, date: s.start, end: s.end ?? undefined, days: s.days, multiDay: s.multiDay, allDay: s.allDay, completed: completed || occ.completed, recurring: true });
      }
      continue;
    }
    const s = questSchedule(q);
    out.push({ ...common, id, date: s.start, end: s.end ?? undefined, days: s.days, multiDay: s.multiDay, allDay: s.allDay, completed });
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// ── Colour: the kiosk's post-it palette, hashed by category ──────────

export const NOTE_COLORS = ['var(--note-sun)', 'var(--note-mint)', 'var(--note-sky)', 'var(--note-coral)', 'var(--note-lav)', 'var(--note-lime)'];

export function noteColor(seed) {
  const s = seed && seed.length ? String(seed) : '•';
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash << 5) - hash + s.charCodeAt(i);
  return NOTE_COLORS[Math.abs(hash) % NOTE_COLORS.length];
}
