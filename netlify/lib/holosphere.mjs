// Read-only view of the Holosphere graph, straight from the Nostr relays.
//
// Holosphere v2 publishes every record as a signed kind-30078 event tagged
// h=<holon>, l=<lens>, d=<holon>/<lens>/<id>. The npm `holosphere` package
// lags the monorepo, so instead of pulling it in we mirror the few rules a
// reader needs:
//   - last-writer-wins per address (newer created_at, then larger event id)
//   - `_deleted` items and kind-5 retractions are tombstones
//   - sealed content ({ enc: 'nip44' }) is private and skipped
//   - once a holon has a `_members` roster, only its genesis key and active
//     members count as authors (anyone can publish to a relay)
import { SimplePool } from 'nostr-tools/pool';

const KIND = 30078;
const RETRACTION = 5;
const APP = 'Holons';
const MAX_WAIT_MS = 5000;

export const RELAYS = (process.env.HOLOSPHERE_RELAYS || 'wss://relay.holons.io,wss://relay.commonshub.dev')
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean);

let pool;
const getPool = () => (pool ??= new SimplePool());

const tag = (e, name) => e.tags.find((t) => t[0] === name)?.[1];

function parse(e) {
  try {
    const item = JSON.parse(e.content);
    if (!item || typeof item !== 'object' || item.enc) return null;
    return item;
  } catch {
    return null;
  }
}

/** Which keys may write into each holon, from its `_members` log. */
function authorities(events) {
  const byHolon = new Map();
  for (const e of events) {
    if (tag(e, 'l') !== '_members') continue;
    const item = parse(e);
    if (!item) continue;
    const holon = tag(e, 'h');
    const log = byHolon.get(holon) ?? [];
    log.push({ ...item, author: e.pubkey, at: e.created_at });
    byHolon.set(holon, log);
  }
  const out = new Map();
  for (const [holon, log] of byHolon) {
    // The first genesis founds the holon; a later one by another key is a squatter.
    const genesis = log.filter((x) => x.op === 'genesis').sort((a, b) => a.at - b.at)[0];
    if (!genesis) continue;
    const keys = new Set([genesis.author]);
    for (const x of log.filter((x) => x.author === genesis.author).sort((a, b) => a.at - b.at)) {
      if (x.op === 'add' && x.pubkey) keys.add(x.pubkey);
      if (x.op === 'remove' && x.pubkey && x.pubkey !== genesis.author) keys.delete(x.pubkey);
    }
    out.set(holon, keys);
  }
  return out;
}

/**
 * Current items of several lenses across several holons, in one round trip.
 * Returns Map<holon, Map<lens, item[]>>.
 */
export async function readLenses(holons, lenses) {
  const relays = RELAYS;
  const filter = { '#h': holons.map(String), '#l': [...lenses, '_members'] };
  const [events, retractions] = await Promise.all([
    getPool().querySync(relays, { kinds: [KIND], ...filter }, { maxWait: MAX_WAIT_MS }),
    getPool().querySync(relays, { kinds: [RETRACTION], ...filter }, { maxWait: MAX_WAIT_MS }).catch(() => []),
  ]);

  const auth = authorities(events);
  const allowed = (holon, pubkey) => !auth.has(holon) || auth.get(holon).has(pubkey);

  const retracted = new Map(); // `${pubkey}:${d}` → created_at
  for (const r of retractions) {
    for (const t of r.tags) {
      if (t[0] !== 'a') continue;
      const [kind, pubkey, ...d] = String(t[1]).split(':');
      if (Number(kind) === KIND && pubkey === r.pubkey) retracted.set(`${pubkey}:${d.join(':')}`, r.created_at);
    }
  }

  const current = new Map(); // address → { event, item }
  for (const e of events) {
    const holon = tag(e, 'h');
    const lens = tag(e, 'l');
    const d = tag(e, 'd');
    const ns = tag(e, 'n');
    if (!holon || !lens || !d || lens === '_members') continue;
    if (ns && ns !== APP) continue;
    if (!allowed(holon, e.pubkey)) continue;
    if ((retracted.get(`${e.pubkey}:${d}`) ?? -1) >= e.created_at) continue;
    const prev = current.get(d);
    if (prev && (prev.event.created_at > e.created_at || (prev.event.created_at === e.created_at && prev.event.id > e.id))) continue;
    current.set(d, { event: e, item: parse(e), holon, lens });
  }

  const out = new Map();
  for (const { item, holon, lens } of current.values()) {
    if (!item || item._deleted) continue;
    if (!out.has(holon)) out.set(holon, new Map());
    const lensMap = out.get(holon);
    lensMap.set(lens, [...(lensMap.get(lens) ?? []), item]);
  }
  return out;
}

const clean = (s) => (typeof s === 'string' ? s.trim() : '');

function displayName(u) {
  // Telegram names often carry a "| Liminal Village" suffix — drop it.
  const full = [clean(u.first_name), clean(u.last_name)].filter(Boolean).join(' ');
  return full.split('|')[0].trim() || clean(u.username) || 'Villager';
}

/** A LinkedIn profile URL found in a field or free text ("linkedin.com/in/x"), normalised. */
export function linkedinUrl(...sources) {
  for (const src of sources) {
    const text = Array.isArray(src) ? src.join(' ') : typeof src === 'object' && src ? Object.values(src).join(' ') : String(src ?? '');
    const m = /(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com\/(?:in|company|pub)\/[\w%.-]+\/?/i.exec(text);
    if (m) return `https://www.${m[0].replace(/^https?:\/\//i, '').replace(/^[a-z]{2,3}\.linkedin/i, 'linkedin').replace(/^www\./i, '')}`;
  }
  return '';
}

const pickText = (records, ...keys) => {
  for (const r of records) for (const k of keys) if (clean(r?.[k])) return clean(r[k]);
  return '';
};

/**
 * Members of a holon with their ikigai and LinkedIn, from their profile.
 *
 * The source is the DNA the bot's `/onboarding` journey writes in the
 * person's own holon (holon = their Telegram id, lens `dna`, id = their id)
 * when they choose to make their answers public: `ikigai`, `linkedin`,
 * `category`, `values`. Their `users` records and `profile` lens can carry
 * the same fields; the `/apply` form's answers (`applications` lens:
 * `data.ikigai`, `data.social_links`) are the last fallback.
 */
export async function membersWithIkigai(holonId) {
  const village = await readLenses([holonId], ['users']);
  const users = village.get(String(holonId))?.get('users') ?? [];
  const ids = users.map((u) => String(u.id)).filter((id) => /^-?\d+$/.test(id));
  const personal = ids.length ? await readLenses(ids, ['dna', 'users', 'profile', 'applications']) : new Map();

  return users.map((u) => {
    const id = String(u.id);
    const lenses = personal.get(id);
    // A personal holon's `users` lens can also hold bots; the profile is the record with their own id.
    const own = (lenses?.get('users') ?? []).find((r) => String(r.id) === id) ?? {};
    const dnaRecord = (lenses?.get('dna') ?? []).find((r) => String(r.id) === id);
    const dna = dnaRecord && dnaRecord.public !== false ? dnaRecord : {};
    const profileLens = lenses?.get('profile')?.find((r) => String(r.id) === id) ?? lenses?.get('profile')?.[0] ?? {};
    const applications = (lenses?.get('applications') ?? [])
      .filter((a) => a?.data)
      .sort((a, b) => String(b.submittedAt ?? b.id).localeCompare(String(a.submittedAt ?? a.id)));
    const app = applications.find((a) => clean(a.data.ikigai)) ?? applications[0];
    const answers = app?.data ?? {};
    const profiles = [dna, own, profileLens, u];
    const role = answers.role;
    const values = profiles.map((r) => r.values).find((v) => Array.isArray(v) && v.length) ?? [];
    return {
      id,
      name: displayName(own.first_name ? own : u),
      username: /^[A-Za-z]\w{3,}$/.test(clean(u.username)) ? clean(u.username) : '',
      ikigai: pickText(profiles, 'ikigai', 'bio', 'about') || clean(answers.ikigai),
      linkedin: linkedinUrl(...profiles.map((r) => r.linkedin ?? r.linkedIn ?? r.links ?? r.social_links), answers.social_links),
      role: clean(typeof role === 'object' ? role?.label ?? role?.value : role).replace(/_/g, ' '),
      category: pickText(profiles, 'category'),
      values: values.filter((v) => typeof v === 'string').slice(0, 5),
    };
  });
}
