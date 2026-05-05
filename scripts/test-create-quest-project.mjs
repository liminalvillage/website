// Local smoke-test for the Netlify function. Loads .env, imports the handler,
// and invokes it twice to verify both the create path and the idempotent
// re-query path. Safe to delete after verification.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');

for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const { default: handler } = await import('../netlify/functions/create-quest-project.mjs');

const payload = {
  parentSlug: process.argv[2] || 'casaselva',
  questId: process.argv[3] || 'test-quest-howto-1',
  title: 'Howto smoke test',
  description: 'Temporary test project — safe to archive.',
  tags: ['test', 'howto'],
};

async function call(label) {
  const req = new Request('http://localhost/.netlify/functions/create-quest-project', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:5173' },
    body: JSON.stringify(payload),
  });
  const res = await handler(req);
  const body = await res.text();
  console.log(`[${label}] status=${res.status} body=${body}`);
}

console.log(`Test payload:`, payload);
await call('first call');
await call('second call (should be idempotent)');
