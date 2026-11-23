// Read-only feed for /lunations: the village holon's dated quests, as the
// kiosk's year calendar draws them.
//
//   GET /api/calendar   → { holon, quests: [...] }
//
// Only the fields a calendar and its event pages need leave the server — no
// participants. Which quests count: dated, not cancelled, events (event,
// meeting, appointment) and open tasks — a completed task is history and
// stays off the website. The page expands schedules and recurrences in the
// visitor's local time.
import { VILLAGE_HOLON as HOLON_ID, readLenses } from '../lib/holosphere.mjs';
const TASK_TYPES = ['', 'task', 'quest', 'todo', 'recurring'];
const EVENT_TYPES = ['event', 'meeting', 'appointment'];
const FIELDS = ['id', 'title', 'type', 'status', 'completed', 'when', 'ends', 'until', 'frequency', 'completedOccurrences', 'category', 'location', 'pictogram', 'description', 'shortDesc', 'fullDesc'];

const typeOf = (q) => String(q.type ?? '').trim().toLowerCase();
const statusOf = (q) => String(q.status ?? '').trim().toLowerCase();
const isCompletedTask = (q) => statusOf(q) === 'completed' || (q.completed === true || (typeof q.completed === 'string' && q.completed.trim() !== '' && !q.frequency));
const shown = (q) => EVENT_TYPES.includes(typeOf(q)) || (TASK_TYPES.includes(typeOf(q)) && !isCompletedTask(q));

let cache = { at: 0, value: null };

async function quests() {
  if (cache.value && Date.now() - cache.at < 60_000) return cache.value;
  const lenses = await readLenses([HOLON_ID], ['quests']);
  const value = (lenses.get(HOLON_ID)?.get('quests') ?? [])
    .filter((q) => shown(q) && typeof q.when === 'string' && q.when && statusOf(q) !== 'cancelled')
    .map((q) => Object.fromEntries(FIELDS.filter((k) => q[k] !== undefined && q[k] !== null).map((k) => [k, q[k]])));
  cache = { at: Date.now(), value };
  return value;
}

export default async () => {
  try {
    return new Response(JSON.stringify({ holon: HOLON_ID, quests: await quests() }), {
      headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=60' },
    });
  } catch (e) {
    console.error('[calendar]', e);
    return new Response(JSON.stringify({ error: 'Could not reach the network.' }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }
};

export const config = { path: '/api/calendar' };
