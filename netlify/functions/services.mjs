// Services directory + booking API for /services.
//
// Practitioners are the village holon's members, read live from Holosphere
// with the ikigai they shared; what they offer, slots and bookings follow
// maxage's booking system, stored in Netlify Blobs.
//
//   GET  /api/services                     directory
//   GET  /api/services/slots?p=&month=     open slots of one practitioner
//   POST /api/services/book                book a slot
//   POST /api/services/request             ask for a session when no slot fits
//   GET  /api/services/cancel?t=           booking behind a cancel link
//   POST /api/services/cancel              cancel it
//   POST /api/services/admin/login|logout  steward session (cookie, ../lib/admin.mjs)
//   GET  /api/services/admin?p=&month=     one practitioner's calendar
//   POST /api/services/admin/offer|open|delete-slot|cancel-booking|delete-request
//
// Env: SERVICES_ADMIN_PASSWORD, SERVICES_SESSION_SECRET (admin);
//      SERVICES_HOLON_ID (default: Liminal Village); see ../lib/notify.mjs.
import { membersWithIkigai } from '../lib/holosphere.mjs';
import {
  PID_RE,
  addSlots,
  allOffers,
  availability,
  cancelBooking,
  createBooking,
  createRequest,
  deleteRequest,
  deleteSlot,
  getBooking,
  getBookingByToken,
  getOffer,
  getSlot,
  openSlots,
  requestsFor,
  saveOffer,
  slotsInMonth,
  upcomingBookings,
} from '../lib/bookings.mjs';
import { isAdmin, login, logout } from '../lib/admin.mjs';
import { notifyCancelled, notifyNewBooking, notifyRequest } from '../lib/notify.mjs';
import { dateRange, monthKey, nowIn, parseMonth, weekdayOf } from '../../src/services/dates.js';

const env = process.env;
const HOLON_ID = env.SERVICES_HOLON_ID || '-1003864542239';

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });
const fail = (error, status = 400) => json({ error }, status);

// ── Directory (members cached briefly: relays are the slow part) ─────

let membersCache = { at: 0, value: null };
async function members() {
  if (membersCache.value && Date.now() - membersCache.at < 60_000) return membersCache.value;
  try {
    const value = await membersWithIkigai(HOLON_ID);
    if (value.length || !membersCache.value) membersCache = { at: Date.now(), value };
  } catch (e) {
    console.error('[services] holosphere read failed:', e);
    if (!membersCache.value) throw e;
  }
  return membersCache.value;
}

async function practitioner(p) {
  return (await members()).find((m) => m.id === p) ?? null;
}

async function directory() {
  const now = nowIn();
  const [people, offers] = await Promise.all([members(), allOffers()]);
  const list = await Promise.all(
    people.map(async (m) => {
      const offer = offers[m.id];
      const bookable = !!offer?.active;
      const avail = bookable ? await availability(m.id, now) : { next: null, count: 0 };
      return {
        ...m,
        offer: offer && offer.active ? offer : null,
        nextSlot: avail.next,
        openCount: avail.count,
      };
    })
  );
  // Bookable with free time first, then those who shared an ikigai, then the rest.
  const rank = (x) => (x.openCount ? 0 : x.offer ? 1 : x.ikigai || x.category ? 2 : 3);
  list.sort((a, b) => rank(a) - rank(b) || (a.nextSlot?.id ?? '~').localeCompare(b.nextSlot?.id ?? '~') || a.name.localeCompare(b.name));
  return { holon: HOLON_ID, today: now.date, practitioners: list };
}

async function monthView(p, url) {
  const now = nowIn();
  const current = now.date.slice(0, 7);
  const { year, month } = parseMonth(url.searchParams.get('month'), current);
  const key = monthKey(year, month);
  const slots = key < current ? [] : await openSlots(p, key, now);
  const counts = {};
  for (const s of slots) counts[s.date] = (counts[s.date] ?? 0) + 1;
  return { year, month, key, minMonth: current, today: now.date, counts, slots };
}

// ── Booking ───────────────────────────────────────────────────────────

async function book(req, url) {
  const body = await req.json().catch(() => ({}));
  const p = String(body.p ?? '');
  const name = String(body.name ?? '').trim().slice(0, 120);
  const email = String(body.email ?? '').trim().slice(0, 200);
  const phone = String(body.phone ?? '').trim().slice(0, 40);
  const note = String(body.note ?? '').trim().slice(0, 1000);
  // Honeypot: bots fill every field. Pretend it worked.
  if (body.website) return json({ ok: true, booking: null });

  if (!PID_RE.test(p)) return fail('Unknown practitioner.', 404);
  if (!name) return fail('Please tell us your name.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail('That e-mail address doesn’t look right.');

  const [person, offer] = await Promise.all([practitioner(p), getOffer(p)]);
  if (!person || !offer.active) return fail('This practitioner isn’t taking bookings right now.', 404);

  const slot = await getSlot(p, String(body.slot ?? ''));
  const now = nowIn();
  if (!slot || slot.date < now.date || (slot.date === now.date && slot.time < now.time))
    return fail('This time is no longer available. Please pick another one.', 410);

  const booking = await createBooking(p, slot, { name, email, phone, note }, offer);
  if (!booking) return fail('Someone just booked this time. Please pick another one.', 409);

  await notifyNewBooking(booking, person.name, env.URL || url.origin);
  return json({ ok: true, booking: publicBooking(booking, person), cancelToken: booking.cancel_token });
}

async function request(req) {
  const body = await req.json().catch(() => ({}));
  const p = String(body.p ?? '');
  const name = String(body.name ?? '').trim().slice(0, 120);
  const email = String(body.email ?? '').trim().slice(0, 200);
  const phone = String(body.phone ?? '').trim().slice(0, 40);
  const note = String(body.note ?? '').trim().slice(0, 1000);
  const preferred = /^\d{4}-\d{2}-\d{2}$/.test(body.preferred) && body.preferred >= nowIn().date ? body.preferred : '';
  const timeOfDay = ['morning', 'afternoon', 'evening', 'flexible'].includes(body.timeOfDay) ? body.timeOfDay : '';
  if (body.website) return json({ ok: true });

  if (!PID_RE.test(p)) return fail('Unknown practitioner.', 404);
  if (!name) return fail('Please tell us your name.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail('That e-mail address doesn’t look right.');
  const person = await practitioner(p);
  if (!person) return fail('Unknown practitioner.', 404);

  const r = await createRequest(p, { name, email, phone, note, preferred, timeOfDay }, await getOffer(p));
  await notifyRequest(r, person.name);
  return json({ ok: true });
}

const publicBooking = (b, person) => ({
  date: b.date,
  time: b.time,
  duration: b.duration,
  service: b.service,
  price: b.price,
  currency: b.currency,
  name: b.name,
  practitioner: person ? { id: person.id, name: person.name, username: person.username } : null,
});

// ── Steward session (maxage auth, as a signed cookie) ─────────────────

function parseTimes(raw) {
  return String(raw ?? '')
    .split(/[,\s;]+/)
    .filter(Boolean)
    .map((t) => {
      const m = /^(\d{1,2})[:.]?(\d{2})?$/.exec(t.trim());
      if (!m) return null;
      const h = Number(m[1]);
      const min = Number(m[2] ?? 0);
      return h > 23 || min > 59 ? null : `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    })
    .filter(Boolean);
}

async function admin(req, url, action) {
  if (action === 'login') return login(req, url);
  if (action === 'logout') return logout(url);
  if (!isAdmin(req)) return fail('Please sign in.', 401);

  if (req.method === 'GET' && !action) {
    const p = url.searchParams.get('p') ?? '';
    const now = nowIn();
    const [people, offers] = await Promise.all([members(), allOffers()]);
    if (!PID_RE.test(p)) return json({ practitioners: people, offers, today: now.date });
    const { year, month } = parseMonth(url.searchParams.get('month'), now.date.slice(0, 7));
    const key = monthKey(year, month);
    const [slots, upcoming, requests] = await Promise.all([slotsInMonth(p, key), upcomingBookings(p, now.date), requestsFor(p)]);
    return json({ practitioners: people, offers, today: now.date, year, month, key, slots, upcoming, requests, offer: await getOffer(p) });
  }

  const body = await req.json().catch(() => ({}));
  const p = String(body.p ?? '');
  if (!PID_RE.test(p)) return fail('Pick a practitioner first.');

  if (action === 'offer') return json({ ok: true, offer: await saveOffer(p, body) });

  if (action === 'open') {
    const from = String(body.from ?? '');
    const to = String(body.to || '') || from;
    const times = parseTimes(body.times);
    const duration = Math.min(480, Math.max(15, Number(body.duration) || 60));
    const days = (Array.isArray(body.weekdays) ? body.weekdays : []).map(Number);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || to < from)
      return fail('Check the dates: “to” must be on or after “from”.');
    if (!times.length) return fail('Add at least one start time, e.g. 10:00, 14:30.');
    const items = [];
    for (const date of dateRange(from, to)) {
      if (days.length && !days.includes(weekdayOf(date))) continue;
      for (const time of times) items.push({ date, time, duration });
    }
    const created = await addSlots(p, items);
    return json({ ok: true, created });
  }

  if (action === 'delete-slot') {
    const booking = await getBooking(p, String(body.id ?? ''));
    await deleteSlot(p, String(body.id ?? ''));
    if (booking) await notifyCancelled(booking, (await practitioner(p))?.name ?? 'practitioner');
    return json({ ok: true });
  }

  if (action === 'cancel-booking') {
    const booking = await cancelBooking(p, String(body.id ?? ''));
    if (!booking) return fail('Booking not found.', 404);
    await notifyCancelled(booking, (await practitioner(p))?.name ?? 'practitioner');
    return json({ ok: true });
  }

  if (action === 'delete-request') {
    await deleteRequest(p, String(body.id ?? ''));
    return json({ ok: true });
  }

  return fail('Not found.', 404);
}

// ── Router ────────────────────────────────────────────────────────────

export default async (req) => {
  const url = new URL(req.url);
  const [, , , route = '', action = ''] = url.pathname.replace(/\/+$/, '').split('/'); // /api/services/<route>/<action>
  try {
    if (!route && req.method === 'GET') return json(await directory());

    if (route === 'slots' && req.method === 'GET') {
      const p = url.searchParams.get('p') ?? '';
      if (!PID_RE.test(p) || !(await getOffer(p)).active) return fail('Unknown practitioner.', 404);
      return json(await monthView(p, url));
    }

    if (route === 'book' && req.method === 'POST') return await book(req, url);
    if (route === 'request' && req.method === 'POST') return await request(req);

    if (route === 'cancel') {
      if (req.method === 'GET') {
        const b = await getBookingByToken(url.searchParams.get('t') ?? '');
        return json({ found: !!b, booking: b ? publicBooking(b, await practitioner(b.p)) : null });
      }
      if (req.method === 'POST') {
        const { t } = await req.json().catch(() => ({}));
        const b = await getBookingByToken(String(t ?? ''));
        if (b) {
          await cancelBooking(b.p, b.id);
          await notifyCancelled(b, (await practitioner(b.p))?.name ?? 'practitioner');
        }
        return json({ ok: true });
      }
    }

    if (route === 'admin') return await admin(req, url, action);
    return fail('Not found.', 404);
  } catch (e) {
    console.error('[services]', e);
    return fail('Something went wrong on our side. Please try again in a moment.', 500);
  }
};

export const config = { path: ['/api/services', '/api/services/*'] };
