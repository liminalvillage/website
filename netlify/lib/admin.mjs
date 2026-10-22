// Steward session shared by the admin areas (/services/admin, /apply/admin):
// one password, one signed cookie scoped to /api so a single sign-in covers
// every admin endpoint.
//
// Env: SERVICES_ADMIN_PASSWORD, SERVICES_SESSION_SECRET
import { createHmac, timingSafeEqual } from 'node:crypto';

const env = process.env;
const COOKIE = 'lv_services_admin';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;

const json = (body, status = 200, headers) => {
  const h = new Headers({ 'content-type': 'application/json', 'cache-control': 'no-store' });
  for (const [k, v] of headers ?? []) h.append(k, v);
  return new Response(JSON.stringify(body), { status, headers: h });
};

const sign = (payload) => createHmac('sha256', env.SERVICES_SESSION_SECRET).update(payload).digest('base64url');

export function safeEqual(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function isAdmin(req) {
  if (!env.SERVICES_SESSION_SECRET) return false;
  // Older sessions were scoped to /api/services, so more than one may be sent.
  const values = (req.headers.get('cookie') ?? '')
    .split(/;\s*/)
    .filter((c) => c.startsWith(`${COOKIE}=`))
    .map((c) => c.slice(COOKIE.length + 1));
  return values.some((raw) => {
    const [expires, sig] = raw.split('.');
    return !!expires && !!sig && Number(expires) > Date.now() && safeEqual(sign(expires), sig);
  });
}

function sessionCookie(url, value, maxAge, path = '/api') {
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=${value}; Path=${path}; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export async function login(req, url) {
  if (!env.SERVICES_ADMIN_PASSWORD || !env.SERVICES_SESSION_SECRET)
    return json({ error: 'Set SERVICES_ADMIN_PASSWORD and SERVICES_SESSION_SECRET first.' }, 503);
  const { password } = await req.json().catch(() => ({}));
  if (!safeEqual(String(password ?? ''), env.SERVICES_ADMIN_PASSWORD)) return json({ error: 'Wrong password.' }, 401);
  const expires = String(Date.now() + SESSION_TTL_MS);
  return json({ ok: true }, 200, [['set-cookie', sessionCookie(url, `${expires}.${sign(expires)}`, SESSION_TTL_MS / 1000)]]);
}

export function logout(url) {
  return json({ ok: true }, 200, [
    ['set-cookie', sessionCookie(url, '', 0)],
    ['set-cookie', sessionCookie(url, '', 0, '/api/services')],
  ]);
}
