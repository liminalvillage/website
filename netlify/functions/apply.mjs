// Community applications for /apply.
//
//   POST /api/apply                       validate + store an application, notify the stewards
//   POST /api/apply/admin/login|logout    steward session (../lib/admin.mjs, shared with /services)
//   GET  /api/apply/admin                 every application, newest first
//   POST /api/apply/admin/status          { id, status }  new · reviewing · accepted · declined
//   POST /api/apply/admin/delete          { id }
//
// Stored in Netlify Blobs (store "applications", key <ISO time>-<rand>), so
// nothing is lost if a notification fails. Notifications reuse ../lib/notify.mjs:
//   TELEGRAM_CHAT_ID           steward / group chat gets the full application
//   APPLY_NOTIFY_EMAIL         optional inbox that also gets it by e-mail
//   SMTP_* + MAIL_FROM         confirmation e-mail to the applicant
import { randomBytes } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { sendMail, sendTelegram } from '../lib/notify.mjs';
import { isAdmin, login, logout } from '../lib/admin.mjs';
import { LABELS, SECTIONS, answer, missingFields } from '../../src/apply/questions.js';

const env = process.env;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const fail = (error, status = 400) => json({ error }, status);
const store = () => getStore({ name: 'applications', consistency: 'strong' });

const STATUSES = ['new', 'reviewing', 'accepted', 'declined'];

// Keep only the fields we know, trimmed and capped, so the store holds what
// the form asked for and nothing else.
function clean(input) {
  const out = {};
  for (const key of Object.keys(LABELS)) {
    const v = input?.[key];
    if (Array.isArray(v)) out[key] = v.map((x) => String(x).slice(0, 200)).slice(0, 20);
    else if (v != null) out[key] = String(v).trim().slice(0, 5000);
  }
  return out;
}

function describe(a) {
  return SECTIONS.map((sec) =>
    sec.keys
      .map((key) => [key, answer(a, key)])
      .filter(([, v]) => v)
      .map(([key, v]) => `${LABELS[key]}: ${v}`)
      .join('\n')
  ).join('\n\n');
}

async function safely(label, fn) {
  try {
    await fn();
  } catch (e) {
    console.error(`[apply] ${label} failed:`, e);
  }
}

async function admin(req, url, action) {
  if (action === 'login') return login(req, url);
  if (action === 'logout') return logout(url);
  if (!isAdmin(req)) return fail('Please sign in.', 401);

  if (req.method === 'GET' && !action) {
    const { blobs } = await store().list();
    const all = await Promise.all(blobs.map((b) => store().get(b.key, { type: 'json' })));
    return json({ applications: all.filter(Boolean).sort((x, y) => y.at.localeCompare(x.at)), statuses: STATUSES });
  }

  const body = await req.json().catch(() => ({}));
  const id = String(body.id ?? '');
  const app = id && (await store().get(id, { type: 'json' }));
  if (!app) return fail('Application not found.', 404);

  if (action === 'status' && STATUSES.includes(body.status)) {
    await store().setJSON(id, { ...app, status: body.status });
    return json({ ok: true });
  }
  if (action === 'delete') {
    await store().delete(id);
    return json({ ok: true });
  }
  return fail('Not found.', 404);
}

export default async (req) => {
  const url = new URL(req.url);
  const [, , , route = '', action = ''] = url.pathname.replace(/\/+$/, '').split('/'); // /api/apply/<route>/<action>
  if (route === 'admin') {
    try {
      return await admin(req, url, action);
    } catch (e) {
      console.error('[apply admin]', e);
      return fail('Something went wrong on our side.', 500);
    }
  }
  if (route || req.method !== 'POST') return fail('Not found.', 404);
  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail('Send the application as JSON.');
    if (body.company) return json({ ok: true }); // honeypot: bots fill every field

    const a = clean(body);
    const missing = missingFields(a);
    if (missing.length) return fail(`Please complete: ${missing.map((k) => LABELS[k]).join(', ')}.`);

    const at = new Date().toISOString();
    const id = `${at}-${randomBytes(3).toString('hex')}`;
    await store().setJSON(id, { id, at, status: 'new', ...a });

    const summary = describe(a);
    console.log(`[apply] New application ${id}\n${summary}`);
    await Promise.all([
      safely('steward telegram', () => sendTelegram(env.TELEGRAM_CHAT_ID, `🌙 New community application\n\n${summary}`.slice(0, 4000))),
      safely('steward e-mail', () => sendMail(env.APPLY_NOTIFY_EMAIL, `New application — ${a.name}`, summary)),
      safely('applicant e-mail', () =>
        sendMail(
          a.email,
          'Your application to Liminal Village',
          [
            `Hi ${a.name},`,
            '',
            'thank you for applying to join Liminal Village. Your application has been received —',
            'we review every application personally and will get back to you shortly.',
            '',
            'Here is a copy of what you shared:',
            '',
            summary,
            '',
            'See you in the village 🌙',
          ].join('\n')
        )
      ),
    ]);
    return json({ ok: true });
  } catch (e) {
    console.error('[apply]', e);
    return fail('Something went wrong on our side. Please try again in a moment.', 500);
  }
};

export const config = { path: ['/api/apply', '/api/apply/*'] };
