// Slots and bookings, ported from maxage's data layer onto Netlify Blobs and
// keyed per practitioner (their Telegram user id):
//
//   config/<p>               → Offer       what they offer, price, on/off
//   months/<p>/<YYYY-MM>     → Slot[]      slots opened in that month
//   bookings/<p>/<slotId>    → Booking     created with "only if new", so a
//                                          slot can never be booked twice
//   tokens/<token>           → { p, slotId }  lookup for the cancel link
//   requests/<p>/<at>-<rand> → Request     "request a session" when no slot fits
import { randomBytes } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const store = () => getStore({ name: 'services', consistency: 'strong' });

const kv = {
  async get(key) {
    return (await store().get(key, { type: 'json' })) ?? null;
  },
  /** Returns false if `onlyIfNew` was set and the key already existed. */
  async set(key, value, opts) {
    if (opts?.onlyIfNew) return (await store().setJSON(key, value, { onlyIfNew: true })).modified;
    await store().setJSON(key, value);
    return true;
  },
  async delete(key) {
    await store().delete(key);
  },
  async list(prefix) {
    const { blobs } = await store().list({ prefix });
    return blobs.map((b) => b.key).sort();
  },
};

export const PID_RE = /^-?\d{1,20}$/;
const SLOT_RE = /^\d{4}-\d{2}-\d{2}-\d{4}$/;

const slotId = (date, time) => `${date}-${time.replace(':', '')}`;
const monthOf = (idOrDate) => idOrDate.slice(0, 7);
const byTime = (a, b) => a.id.localeCompare(b.id);
const isFuture = (s, now) => s.date > now.date || (s.date === now.date && s.time >= now.time);

async function monthSlots(p, month) {
  return (await kv.get(`months/${p}/${month}`)) ?? [];
}

// ── Offers ────────────────────────────────────────────────────────────

const DEFAULT_OFFER = { title: '', description: '', price: 0, currency: 'EUR', priceNote: '', active: false };

export async function getOffer(p) {
  return { ...DEFAULT_OFFER, ...((await kv.get(`config/${p}`)) ?? {}) };
}

export async function allOffers() {
  const keys = await kv.list('config/');
  const entries = await Promise.all(keys.map(async (k) => [k.slice('config/'.length), await getOffer(k.slice('config/'.length))]));
  return Object.fromEntries(entries);
}

export async function saveOffer(p, input) {
  const offer = {
    title: String(input.title ?? '').trim().slice(0, 120),
    description: String(input.description ?? '').trim().slice(0, 2000),
    price: Math.max(0, Math.round(Number(input.price) || 0)),
    currency: /^[A-Z]{3}$/.test(input.currency) ? input.currency : 'EUR',
    priceNote: String(input.priceNote ?? '').trim().slice(0, 120),
    active: !!input.active,
  };
  await kv.set(`config/${p}`, offer);
  return offer;
}

// ── Slots ─────────────────────────────────────────────────────────────

/** Opens several slots at once. Returns how many were new. */
export async function addSlots(p, items) {
  const byMonth = new Map();
  for (const it of items) {
    const m = monthOf(it.date);
    byMonth.set(m, [...(byMonth.get(m) ?? []), it]);
  }
  let created = 0;
  for (const [month, list] of byMonth) {
    const slots = await monthSlots(p, month);
    const ids = new Set(slots.map((s) => s.id));
    for (const it of list) {
      const id = slotId(it.date, it.time);
      if (ids.has(id)) continue;
      ids.add(id);
      slots.push({ id, ...it });
      created++;
    }
    await kv.set(`months/${p}/${month}`, slots.sort(byTime));
  }
  return created;
}

export async function deleteSlot(p, id) {
  const month = monthOf(id);
  const slots = await monthSlots(p, month);
  await kv.set(`months/${p}/${month}`, slots.filter((s) => s.id !== id));
  await cancelBooking(p, id);
}

export async function getSlot(p, id) {
  if (!SLOT_RE.test(id)) return null;
  return (await monthSlots(p, monthOf(id))).find((s) => s.id === id) ?? null;
}

/** Open (unbooked, not yet past) slots in one month (YYYY-MM). */
export async function openSlots(p, month, now) {
  const [slots, booked] = await Promise.all([monthSlots(p, month), kv.list(`bookings/${p}/${month}`)]);
  const taken = new Set(booked.map((k) => k.split('/').pop()));
  return slots.filter((s) => !taken.has(s.id) && isFuture(s, now));
}

/** First open slot and how many are open, looking `months` ahead. */
export async function availability(p, now, months = 3) {
  let next = null;
  let count = 0;
  let [y, m] = now.date.split('-').map(Number);
  for (let i = 0; i < months; i++) {
    const slots = await openSlots(p, `${y}-${String(m).padStart(2, '0')}`, now);
    count += slots.length;
    next ??= slots[0] ?? null;
    if (++m > 12) { m = 1; y++; }
  }
  return { next, count };
}

/** All slots in a month with booking info (admin view). */
export async function slotsInMonth(p, month) {
  const [slots, bookings] = await Promise.all([monthSlots(p, month), bookingsWithPrefix(`${p}/${month}`)]);
  const map = new Map(bookings.map((b) => [b.id, b]));
  return slots.map((s) => ({ ...s, booking: map.get(s.id) ?? null }));
}

// ── Bookings ──────────────────────────────────────────────────────────

async function bookingsWithPrefix(prefix) {
  const keys = await kv.list(`bookings/${prefix}`);
  const all = await Promise.all(keys.map((k) => kv.get(k)));
  return all.filter(Boolean).sort((a, b) => a.id.localeCompare(b.id));
}

/** Upcoming bookings of one practitioner from a date onwards. */
export async function upcomingBookings(p, fromDate) {
  return (await bookingsWithPrefix(`${p}/`)).filter((b) => b.date >= fromDate);
}

/** Books a slot. Returns null if the slot was already taken. */
export async function createBooking(p, slot, input, offer) {
  const booking = {
    id: slot.id,
    p,
    date: slot.date,
    time: slot.time,
    duration: slot.duration,
    service: offer.title,
    price: offer.price,
    currency: offer.currency,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    note: input.note || null,
    cancel_token: randomBytes(24).toString('base64url'),
    created_at: new Date().toISOString(),
  };
  const created = await kv.set(`bookings/${p}/${slot.id}`, booking, { onlyIfNew: true });
  if (!created) return null;
  await kv.set(`tokens/${booking.cancel_token}`, { p, slotId: slot.id });
  return booking;
}

export async function getBooking(p, id) {
  if (!SLOT_RE.test(id)) return null;
  return kv.get(`bookings/${p}/${id}`);
}

export async function getBookingByToken(token) {
  if (!/^[\w-]{20,64}$/.test(token)) return null;
  const ref = await kv.get(`tokens/${token}`);
  if (!ref) return null;
  const booking = await getBooking(ref.p, ref.slotId);
  return booking && booking.cancel_token === token ? booking : null;
}

/** Cancels a booking; the slot becomes free again. */
export async function cancelBooking(p, id) {
  const booking = await getBooking(p, id);
  if (!booking) return null;
  await kv.delete(`bookings/${p}/${id}`);
  await kv.delete(`tokens/${booking.cancel_token}`);
  return booking;
}

// ── Requests (no open slot fits) ──────────────────────────────────────

export async function createRequest(p, input, offer) {
  const at = new Date().toISOString();
  const request = {
    id: `${at.replace(/[:.]/g, '')}-${randomBytes(3).toString('hex')}`,
    p,
    service: offer?.active ? offer.title : '',
    preferred: input.preferred || null,
    timeOfDay: input.timeOfDay || null,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    note: input.note || null,
    created_at: at,
  };
  await kv.set(`requests/${p}/${request.id}`, request);
  return request;
}

/** Most recent first. */
export async function requestsFor(p, limit = 20) {
  const keys = (await kv.list(`requests/${p}/`)).reverse().slice(0, limit);
  return (await Promise.all(keys.map((k) => kv.get(k)))).filter(Boolean);
}

export async function deleteRequest(p, id) {
  if (!/^[\w-]{10,60}$/.test(id)) return;
  await kv.delete(`requests/${p}/${id}`);
}
