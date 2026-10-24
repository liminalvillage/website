// Read-only feed for /quests: a holon's open quests, straight from the
// Holosphere relays (../lib/holosphere.mjs), plus their pictures.
//
//   GET /api/quests?holon=&federated=1      → { holon, quests: [...] }
//   GET /api/quests/image?file_id=           a Telegram picture
//   GET /api/quests/image?holon=&id=         a picture stored inline in the record
//
// A stored `picture` is a hosted URL (Blossom), a data: URI / raw base64, or a
// Telegram file_id, as @holons/core/media's pictureSource tells them apart.
// A file_id opens only with the token of the bot that received it, so it is
// resolved with TELEGRAM_BOT_TOKEN (HolonsBot) and BOT_TOKENS, then through
// the community bot server's /getfile and the dashboard's /api/image, which
// hold the community bots' tokens.
//
// Items federated in from partner holons carry a `_federation` stamp (full
// copies) or are holograms pointing home ({ id, soul: 'Holons/<holon>/quests/<id>' });
// they are only listed with `federated=1`.
//
// Only the portals' holons (src/config/holons.js) may be read; without
// `holon` it is the village holon.
//
// Env: TELEGRAM_BOT_TOKEN, BOT_TOKENS (comma-separated other bots' tokens, optional),
//      BOT_API_URL (bot server, default BOT_SERVER in src/config/holons.js).
import { BOT_SERVER as DEFAULT_BOT_SERVER, DASHBOARD, PORTAL_HOLONS, VILLAGE_HOLON, readLenses } from '../lib/holosphere.mjs';

const env = process.env;
const HOLONS = Object.values(PORTAL_HOLONS).filter(Boolean);
const BOT_TOKENS = [
  ...new Set(
    [env.TELEGRAM_BOT_TOKEN, ...(env.BOT_TOKENS ?? '').split(',')]
      .map((t) => (t ?? '').replace(/[^A-Za-z0-9:_-]/g, ''))
      .filter(Boolean),
  ),
];
const BOT_SERVER = (env.BOT_API_URL || DEFAULT_BOT_SERVER).replace(/\/+$/, '');
const DASHBOARD_IMAGE = `${DASHBOARD}/api/image`;
const FILE_ID_RE = /^[A-Za-z0-9_-]{10,128}$/;
const HIDDEN = new Set(['cancelled', 'completed']);

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
const fail = (error, status = 400) => json({ error }, status, { 'cache-control': 'no-store' });

// ── Pictures ─────────────────────────────────────────────────────────

const B64_SIGNATURES = [
  ['/9j/', 'image/jpeg'],
  ['iVBORw0KGg', 'image/png'],
  ['R0lGOD', 'image/gif'],
  ['UklGR', 'image/webp'],
];

/** { kind: 'url'|'inline'|'telegram', ... } for a stored picture, or null. */
function pictureSource(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const s = value.trim();
  const data = /^data:(image\/[\w.+-]+);base64,(.*)$/is.exec(s);
  if (data) return { kind: 'inline', mime: data[1], b64: data[2].replace(/\s+/g, '') };
  const clean = s.replace(/\s+/g, '');
  const sig = B64_SIGNATURES.find(([prefix]) => clean.startsWith(prefix));
  if (sig || (clean.length > 256 && /^[A-Za-z0-9+/=_-]+$/.test(clean))) {
    return { kind: 'inline', mime: sig?.[1] ?? 'image/jpeg', b64: clean };
  }
  if (/^https?:\/\//i.test(s)) return { kind: 'url', url: s };
  if (FILE_ID_RE.test(s)) return { kind: 'telegram', fileId: s };
  return null;
}

function pictureUrl(raw, holon) {
  const src = pictureSource(raw.picture ?? raw.image);
  if (!src) return '';
  if (src.kind === 'url') return src.url;
  if (src.kind === 'telegram') return `/api/quests/image?file_id=${encodeURIComponent(src.fileId)}`;
  return `/api/quests/image?holon=${encodeURIComponent(holon)}&id=${encodeURIComponent(raw.id)}`;
}

const isImage = (b) =>
  (b[0] === 0xff && b[1] === 0xd8) || // jpeg
  (b[0] === 0x89 && b[1] === 0x50) || // png
  (b[0] === 0x47 && b[1] === 0x49) || // gif
  (b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57); // RIFF…WEBP

const sniffType = (b) =>
  b[0] === 0x89 ? 'image/png' : b[0] === 0x47 ? 'image/gif' : b[0] === 0x52 ? 'image/webp' : 'image/jpeg';

const imageResponse = (bytes, type) =>
  new Response(bytes, {
    headers: { 'content-type': type, 'cache-control': 'public, max-age=604800, immutable' },
  });

async function telegramImage(fileId) {
  for (const token of BOT_TOKENS) {
    try {
      const meta = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`).then((r) => r.json());
      if (!meta?.ok || !meta.result?.file_path) continue;
      const resp = await fetch(`https://api.telegram.org/file/bot${token}/${meta.result.file_path}`);
      if (!resp.ok) continue;
      const bytes = new Uint8Array(await resp.arrayBuffer());
      if (isImage(bytes)) return imageResponse(bytes, resp.headers.get('content-type')?.startsWith('image/') ? resp.headers.get('content-type') : 'image/jpeg');
    } catch {}
  }
  // The bot server answers in application/octet-stream, so the type comes from the bytes.
  for (const url of [
    `${BOT_SERVER}/getfile?file_id=${encodeURIComponent(fileId)}&file_name=image`,
    `${DASHBOARD_IMAGE}?file_id=${encodeURIComponent(fileId)}`,
  ]) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const bytes = new Uint8Array(await resp.arrayBuffer());
      if (isImage(bytes)) return imageResponse(bytes, sniffType(bytes));
    } catch {}
  }
  return new Response('picture not found', { status: 404, headers: { 'cache-control': 'public, max-age=300' } });
}

async function inlineImage(holon, id) {
  const raw = (await holonQuests(holon)).find((q) => String(q.id) === id);
  const src = raw && pictureSource(raw.picture ?? raw.image);
  if (src?.kind !== 'inline') return new Response('picture not found', { status: 404 });
  return imageResponse(Buffer.from(src.b64, 'base64'), src.mime);
}

// ── Quests (cached briefly per holon: relays are the slow part) ──────

const cache = new Map(); // holon → { at, value }

async function holonQuests(holon) {
  const hit = cache.get(holon);
  if (hit && Date.now() - hit.at < 30_000) return hit.value;
  const lenses = await readLenses([holon], ['quests']);
  const value = lenses.get(holon)?.get('quests') ?? [];
  cache.set(holon, { at: Date.now(), value });
  return value;
}

const isHologram = (q) => typeof q?.soul === 'string' && q.soul.includes('/') && !q.title;

/** 'Holons/<holon>/quests/<id>' → { holon, id }, or null for another lens. */
function soulHome(soul) {
  const [, holon, lens, ...id] = soul.split('/');
  return lens === 'quests' && holon && id.length ? { holon, id: id.join('/') } : null;
}

/** Swap holograms for the record they point to, stamped with where it lives. */
async function resolveHolograms(items) {
  const homes = items.filter(isHologram).map((q) => soulHome(q.soul)).filter(Boolean);
  if (!homes.length) return items.filter((q) => !isHologram(q));
  const found = await readLenses([...new Set(homes.map((h) => h.holon))], ['quests']);
  const origin = (home) => {
    const q = home && found.get(home.holon)?.get('quests')?.find((x) => String(x.id) === home.id);
    return q && { ...q, _federation: { origin: home.holon, ...q._federation } };
  };
  return items.map((q) => (isHologram(q) ? origin(soulHome(q.soul)) : q)).filter(Boolean);
}

const clean = (s) => (typeof s === 'string' ? s.trim() : '');
const asArray = (v) => (Array.isArray(v) ? v : []);

function personName(p) {
  if (typeof p === 'string') return clean(p);
  if (!p || typeof p !== 'object') return '';
  const full = [clean(p.first_name ?? p.firstName), clean(p.last_name ?? p.lastName)].filter(Boolean).join(' ');
  // Telegram names often carry a "| Liminal Village" suffix — drop it.
  return clean(p.name) || full.split('|')[0].trim() || clean(p.username);
}

/** Only what the page shows leaves the server — no Telegram ids or usernames. */
function publicQuest(raw, holon) {
  const home = raw._federation?.origin ? String(raw._federation.origin) : holon;
  const where = raw.where && (raw.where.latitude || raw.where.longitude) ? { latitude: raw.where.latitude, longitude: raw.where.longitude } : null;
  return {
    id: raw.id,
    title: clean(raw.title),
    image: pictureUrl(raw, home),
    description: clean(raw.description),
    shortDesc: clean(raw.shortDesc),
    fullDesc: clean(raw.fullDesc),
    icon: clean(raw.icon),
    color: clean(raw.color),
    skills: asArray(raw.skills).filter((s) => typeof s === 'string'),
    duration: clean(raw.duration),
    when: clean(raw.when),
    tools: clean(raw.tools),
    exchange: clean(raw.exchange),
    type: clean(raw.type),
    status: clean(raw.status),
    category: clean(raw.category),
    progress: Number(raw.progress) || 0,
    team: raw.team && typeof raw.team === 'object' ? { current: Number(raw.team.current) || 0, needed: Number(raw.team.needed) || 0 } : null,
    participants: asArray(raw.participants).map(personName).filter(Boolean),
    budget: asArray(raw.budget),
    total: Number(raw.total) || 0,
    date: raw.date || null,
    until: clean(raw.until),
    initiator: personName(raw.initiator),
    where,
    openCollectiveSlug: clean(raw.openCollectiveSlug),
    ...(raw._federation && {
      _federation: { origin: home, originName: clean(raw._federation.originName) || home },
    }),
  };
}

async function list(holon, federated) {
  let items = await holonQuests(holon);
  items = federated ? await resolveHolograms(items) : items.filter((q) => !q._federation && !isHologram(q));
  return items
    .filter((q) => q && clean(q.title) && !HIDDEN.has(clean(q.status).toLowerCase()))
    .map((q) => publicQuest(q, holon));
}

export default async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.replace(/^\/api\/quests\/?/, '');
  const holon = url.searchParams.get('holon') || VILLAGE_HOLON;

  try {
    if (route === 'image') {
      const fileId = url.searchParams.get('file_id');
      if (fileId) return FILE_ID_RE.test(fileId) ? await telegramImage(fileId) : fail('Invalid file_id.');
      if (!HOLONS.includes(holon)) return fail('Unknown holon.', 404);
      return await inlineImage(holon, String(url.searchParams.get('id') ?? ''));
    }
    if (route) return fail('Not found.', 404);
    if (!HOLONS.includes(holon)) return fail('Unknown holon.', 404);
    const quests = await list(holon, url.searchParams.get('federated') === '1');
    return json({ holon, quests }, 200, { 'cache-control': 'public, max-age=30' });
  } catch (e) {
    console.error('[quests]', e);
    return fail('Could not reach the network.', 502);
  }
};

export const config = { path: ['/api/quests', '/api/quests/*'] };
