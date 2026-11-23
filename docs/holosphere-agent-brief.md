# Brief: working with public Holosphere data

You are working with **Holosphere**, the shared data layer of the Holons ecosystem
(Liminal Village, Casa Selva, ReFactory, ReGenerativa). Everything below is what you need
to read it safely and, when asked, change it without breaking anything.

## 1. The model in one paragraph

Data lives in **holons** (a community, a group or a person) and inside each holon in
**lenses** (named collections). Every record is a signed **Nostr event, kind 30078**, on
public relays, tagged:

| tag | meaning | example |
|---|---|---|
| `h` | holon ID | `-1003864542239` |
| `l` | lens | `quests` |
| `d` | address `<holon>/<lens>/<id>` | `-1003864542239/quests/lunation-85` |
| `n` | app namespace, must be `Holons` | `Holons` |

The record itself is the JSON in the event's `content`. A holon ID is a Telegram chat ID
(negative for groups, positive for a person's own holon). IDs are always **strings**.

**Relays:** `wss://relay.holons.io`, `wss://relay.commonshub.dev`
(source of truth: `src/config/holons.js`; `HOLOSPHERE_RELAYS` overrides them on the server).

## 2. Holons you will meet

| Holon | ID | Notes |
|---|---|---|
| Liminal Village (`VILLAGE_HOLON`) | `-1003864542239` | quests, calendar, services on liminalvillage.com |
| Casa Selva | `-1002964866719` | casaselva.earth |
| ReFactory | `-1003943146280` | refactory.earth |
| ReGenerativa | (not connected yet) | |

Always take IDs from `src/config/holons.js`, not from memory: they change between lunations.

## 3. Lenses that matter

- `quests`: tasks, events, offers and requests. Key fields: `id`, `title`, `type`
  (`task`, `event`, `meeting`, `appointment`, `offer`, `request`, `proposal`), `status`
  (`ongoing`, `completed`, `cancelled`, `scheduled`), `when` / `ends` / `until` (ISO dates),
  `frequency`, `category`, `location`, `description` / `shortDesc` / `fullDesc`, `picture`,
  `icon` (Font Awesome *free* class), **`pictogram`** (an emoji or small image URL, drawn on
  the calendars), `participants`, `initiator`. Full schema: `seed-quests.mjs`.
- `users`: members of a holon.
- `dna`, `profile`, `applications`: in a person's own holon. Personal data; see §6.
- `_members`: the holon's roster of authorised writer keys (see the reading rules).

## 4. Reading: the easy way first

1. **Website APIs** (already filtered, public-safe):
   - `GET https://liminalvillage.com/api/calendar`: the village's dated events and open tasks.
   - `GET https://liminalvillage.com/api/quests?holon=<id>`: a portal holon's open quests.
2. **In this repo:** `readLenses(holons, lenses)` from `netlify/lib/holosphere.mjs` returns
   `Map<holon, Map<lens, item[]>>` with all the rules below already applied:

   ```js
   import { readLenses, VILLAGE_HOLON } from './netlify/lib/holosphere.mjs';
   const l = await readLenses([VILLAGE_HOLON], ['quests']);
   const quests = l.get(VILLAGE_HOLON)?.get('quests') ?? [];
   ```
3. **Through the Holons MCP server** (`~/Projects/holons/.mcp.json`, `mcpServers.holons`):
   `holon_list`, `holon_info`, `lens_get_all`, `lens_get`, `task_get`.

### If you read raw relay events yourself, apply these rules (or you will show wrong data)

- Query `{ kinds: [30078], '#h': [...], '#l': [...lenses, '_members'] }`, plus kind 5 for retractions.
- **Last writer wins** per `d` address: newer `created_at`, ties go to the larger event id.
- **Tombstones:** skip items with `_deleted: true` and events retracted by a kind-5 event
  (`a` tag `30078:<pubkey>:<d>`) from the same author.
- **Namespace:** ignore events whose `n` tag is set to anything other than `Holons`.
- **Authority:** anyone can publish to a relay. Once a holon has a `_members` genesis, only
  the genesis key and keys it `add`ed (and didn't `remove`) count as authors. Ignore the rest.
- **Sealed content** (`{ "enc": "nip44" }`) is private: skip it, never try to decrypt it.
- Relays are slow: allow ~5 s per query and merge results from both relays.

## 5. Writing: only through the Holons MCP server, and carefully

Never publish raw Nostr events yourself. Use the MCP tools, which sign with the right key:

| Goal | Tool |
|---|---|
| Create an event | `calendar_event_create` (no `pictogram` param: set it afterwards, see below) |
| Create / update a task | `task_create`, `task_update` (only the fields passed change) |
| Add or change any field on an existing record | `lens_get` the record, change the field, `lens_put` the **whole** record back |
| Delete | `lens_delete`, only when explicitly asked |

Rules for every write:

1. **Dry run first.** Print exactly what will change and confirm the scope.
2. **Back up** the records you're about to touch to a JSON file (see
   `scripts/lunation-events/backup-*.json`).
3. **Round-trip, don't rebuild.** `lens_put` replaces the record, so always start from the
   current `lens_get` result. Re-running a create tool resets participants, initiator and so on.
4. **Use fixed ids** so re-runs replace records instead of duplicating them.
5. **Verify** by reading back from the relays and diffing against the backup: only the
   intended fields should differ.
6. Writes are public and permanent in relay history. Get the user's go-ahead before writing
   to a holon you weren't asked to touch.

Worked example: `scripts/lunation-events/upload.mjs` (`--pictograms --commit` sets one field
on 46 events via `lens_get` → `lens_put`).

## 6. Privacy: what may leave Holosphere

- Publish only what the holon already treats as public. The website deliberately **never
  exposes `participants`** and only shows fields a page needs (see `FIELDS` in
  `netlify/functions/calendar.mjs`).
- In a person's `dna`, honour `public: false`: treat the record as absent.
- `applications` hold personal answers (email, age, location): never display or export them.
- Do not paste holon data, names or IDs into external services.

## 7. Conventions on the website

- Calendar (`/api/calendar`): events (`event`, `meeting`, `appointment`) and **open** tasks;
  completed tasks and anything cancelled stay off.
- Quests (`/api/quests`): hides `completed` and `cancelled`.
- Pictograms keep one style: 🌑 lunation, 🌕 full moon, 🌘/🌚 lunar/solar eclipse,
  ❄️🌱☀️🍂 solstices and equinoxes, plus one simple symbol per kind of key date.

## 8. Exploring the code

This repo has a knowledge graph. Before grepping or reading source, run
`graphify query "<question>"`. Use `graphify path "<A>" "<B>"` for relationships and
`graphify explain "<concept>"` for a concept. Read raw files only for lines the graph has
already located. After changing code, run `graphify update .`.
