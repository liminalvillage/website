// Read-only feed for /lunations: the village holon's dated quests, as the
// kiosk's year calendar draws them.
//
//   GET /api/calendar   → { holon, quests: [...] }
//
// Only the fields a calendar needs leave the server — no participants, no
// descriptions. Which quests count (tasks and events, not marketplace items;
// not cancelled or deleted; dated) mirrors @holons/core/tasks; the page
// expands schedules and recurrences in the visitor's local time.
import { readLenses } from '../lib/holosphere.mjs';

const HOLON_ID = process.env.SERVICES_HOLON_ID || '-1003864542239';
const TASK_TYPES = ['', 'task', 'quest', 'todo', 'recurring'];
const EVENT_TYPES = ['event', 'meeting', 'appointment'];
const FIELDS = ['id', 'title', 'type', 'status', 'completed', 'when', 'ends', 'until', 'frequency', 'completedOccurrences', 'category', 'location'];

const isAgenda = (q) => {
  const type = String(q.type ?? '').trim().toLowerCase();
  return TASK_TYPES.includes(type) || EVENT_TYPES.includes(type);
};

let cache = { at: 0, value: null };

async function quests() {
  if (cache.value && Date.now() - cache.at < 60_000) return cache.value;
  const lenses = await readLenses([HOLON_ID], ['quests']);
  const value = (lenses.get(HOLON_ID)?.get('quests') ?? [])
    .filter((q) => isAgenda(q) && typeof q.when === 'string' && q.when && String(q.status ?? '').toLowerCase() !== 'cancelled')
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
