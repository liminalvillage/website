// Upload the lunation plan to a holon's calendar through the Holons MCP server
// (`calendar_event_create`: one quest of type 'event' per entry, in the `quests` lens).
//
//   node scripts/lunation-events/upload.mjs            dry run: connect, check the tool, print the plan
//   node scripts/lunation-events/upload.mjs --commit   write the events
//   node scripts/lunation-events/upload.mjs --commit --only lunation-86,lunation-87
//   node scripts/lunation-events/upload.mjs --pictograms [--commit]
//                                                       only set each event's `pictogram` on the
//                                                       record already in the holon, nothing else
//
// Events and the target holon are in events.json, next to this file. Each event has a
// fixed id, so running again after editing events.json replaces the same events
// instead of adding duplicates.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HOLONS_REPO = process.env.HOLONS_REPO || path.join(os.homedir(), 'Projects/holons');
const SDK = path.join(HOLONS_REPO, 'packages/mcp-ui/node_modules/@modelcontextprotocol/sdk/dist/esm/client');
const TOOL = 'calendar_event_create';

const argv = process.argv.slice(2);
const commit = argv.includes('--commit');
const pictogramsOnly = argv.includes('--pictograms');
const onlyAt = argv.indexOf('--only');
const only = onlyAt >= 0 ? new Set(String(argv[onlyAt + 1] || '').split(',').filter(Boolean)) : null;

const { holon, holonName, events: all } = JSON.parse(fs.readFileSync(path.join(HERE, 'events.json'), 'utf8'));
const events = only ? all.filter((e) => only.has(e.id)) : all;
if (!events.length) throw new Error('No events selected.');

// The same server definition Claude uses in the holons repo (.mcp.json → mcpServers.holons).
const server = JSON.parse(fs.readFileSync(path.join(HOLONS_REPO, '.mcp.json'), 'utf8')).mcpServers.holons;

const { Client } = await import(pathToFileURL(path.join(SDK, 'index.js')).href);
const { StdioClientTransport } = await import(pathToFileURL(path.join(SDK, 'stdio.js')).href);

const client = new Client({ name: 'lunation-events-upload', version: '1.0.0' });
await client.connect(new StdioClientTransport({ command: server.command, args: server.args, env: { ...process.env, ...server.env }, stderr: 'ignore' }));

try {
  const { tools } = await client.listTools();
  for (const name of [TOOL, 'lens_get', 'lens_put'])
    if (!tools.some((t) => t.name === name)) throw new Error(`The Holons MCP server has no ${name} tool.`);

  // calendar_event_create has no pictogram: read the stored record and put it back with one.
  const call = async (name, args) => {
    const res = await client.callTool({ name, arguments: args });
    const text = res.content?.find((c) => c.type === 'text')?.text ?? '';
    if (res.isError) throw new Error(`${name} ${args.id ?? ''}: ${text}`);
    return text;
  };
  async function setPictogram(e) {
    const text = await call('lens_get', { holon, lens: 'quests', id: e.id });
    if (!text.trim().startsWith('{')) throw new Error(`${e.id}: ${text}`);
    const record = JSON.parse(text);
    if ((record.pictogram ?? '') === e.pictogram) return false;
    await call('lens_put', { holon, lens: 'quests', data: JSON.stringify({ ...record, pictogram: e.pictogram }) });
    return true;
  }

  if (pictogramsOnly) {
    let changed = 0;
    for (const e of events.filter((x) => x.pictogram !== undefined)) {
      if (!commit) { console.log(`${e.pictogram || '(none)'}  ${e.id.padEnd(36)} ${e.title}`); continue; }
      const did = await setPictogram(e);
      if (did) changed++;
      console.log(`${did ? 'set ' : 'same'}  ${e.pictogram || '(none)'}  ${e.id}`);
    }
    console.log(commit ? `\n${changed} pictograms set in ${holonName}.` : '\nRun again with --commit to set them.');
  } else {
    console.log(`Connected. Target: ${holonName} (${holon}). ${events.length} events. ${commit ? 'WRITING.' : 'Dry run, nothing is written.'}\n`);

    let written = 0;
    for (const e of events) {
      const line = `${e.when}${e.until ? ' → ' + e.until : '             '}  ${e.id.padEnd(36)} ${e.title}`;
      if (!commit) { console.log(line); continue; }
      const args = { holon, id: e.id, title: e.title, when: e.when, description: e.description, category: e.category };
      if (e.until) args.until = e.until;
      const res = await client.callTool({ name: TOOL, arguments: args });
      const text = res.content?.find((c) => c.type === 'text')?.text ?? '';
      if (res.isError) throw new Error(`${e.id} failed after ${written} written: ${text}`);
      if (e.pictogram) await setPictogram(e);
      written++;
      console.log('ok  ' + line);
    }
    console.log(commit ? `\n${written} events written to ${holonName}.` : '\nRun again with --commit to write them.');
  }
} finally {
  await client.close();
}
