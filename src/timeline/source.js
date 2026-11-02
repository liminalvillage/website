// Where the timeline's lunations come from. Today: the names, themes and
// seasons drafted on the Game B page (valuestreams/year.js), with each
// lunation's quarters timed from the moon, and the village's dated quests
// from Holons when /api/calendar answers (it does on the deployed site; on a
// plain dev server it doesn't, and the timeline shows sample events instead).
//
// Connecting it to Holons for real follows the Lunations page:
//   1. a Netlify function (like netlify/functions/calendar.mjs) reads the
//      lunation holons through netlify/lib/holosphere.mjs — each lunation is
//      a holon of its own (see config/holons.js) — and returns, per lunation,
//      its name, theme, image and dated quests, only the public fields;
//   2. members-only fields (who is at the place, and when) stay out of that
//      public feed: Holons' permissions decide who may read them, and the
//      public page only ever gets the gentle public wording (see PRESENCE);
//   3. loadTimeline() below fetches that feed instead of /api/calendar and
//      the drafts, and everything else stays as it is;
//   4. nothing is ever added or changed on the website: people note things
//      in Holons itself, and Holons' permissions decide who may note what,
//      and who may see members-only items. The timeline only shows.
//
// An item is { id, lunation, q (its quarter, 0–3), at? (its day, in ms, when
// it has one), until? (when it lasts a while: a stretch), symbol (its leaf,
// see leaves.js), title, kind (see KINDS), status (see STATUS), question?,
// visibility: 'public' | 'members', sample? }. Items with a day are
// pinned on the line at that day, as on the Miro board; stretches lie in
// lanes under it.
//
// From Jillian's reading of the Miro timelines: the map brings together
// different kinds of time, it marks the questions still to be decided, and
// it keeps apart what is remembered, what is committed and what is only
// imagined, so that what was planned is never mistaken for what happened.
import { phase_hunt } from 'lune';
import { YEAR, CRITERIA } from '../valuestreams/year.js';
import { toEvents } from '../calendar/schedule.js';
import { sunTimes, sunLongitude } from '../calendar/sun.js';

const DAY = 86_400_000;

// The kinds of time the map brings together
export const KINDS = {
  astronomical: { label: 'astronomical', note: 'moons, solstices, equinoxes, the sky', colour: '#5f7fae', leaf: 'star' },
  ecological: { label: 'ecological', note: 'the land: pruning, sowing, the harvests', colour: '#7fa65a', leaf: 'eco' },
  cultural: { label: 'cultural', note: 'feasts, festivals, holidays, deadlines', colour: '#d7745c', leaf: 'gathering' },
  relational: { label: 'relational', note: 'family, visits, celebrations, care', colour: '#c25a72', leaf: 'heart' },
  economic: { label: 'economic & organisational', note: 'residencies, crowdfunding, rentals, structures', colour: '#c9a54a', leaf: 'hex' },
  developmental: { label: 'developmental', note: 'reflection, preparation, integration, sensing ahead', colour: '#8a74b0', leaf: 'vision' },
};

// How an item stands: remembered (it happened), committed (agreed, by whom,
// with what), imagined (considered, hoped for, explored). The land's own
// time and the sky have no status: they simply come.
export const STATUS = {
  remembered: { label: 'remembered', note: 'what happened, who took part, what was learned' },
  committed: { label: 'committed', note: 'what has been agreed, by whom, with what' },
  imagined: { label: 'imagined', note: 'what is considered, sensed, hoped for' },
};
const QUARTERS = ['New moon', 'First quarter', 'Full moon', 'Last quarter'];

// Private things, said publicly in a way only the village reads plainly.
// The family being away becomes "the lantern is in keeping": the place is
// held by its guardians and visits are by arrangement. Draft examples, until
// Holons holds the real ones behind permissions.
export const PRESENCE = {
  home: { public: 'Lantern lit', note: 'The hearth is open: visits and stays as usual.' },
  away: { public: 'Lantern in keeping', note: 'Held by the guardians: visits by arrangement.' },
  retreat: { public: 'Quiet moon', note: 'A closed, quiet circle: no visits this moon.' },
};
const SAMPLE_PRESENCE = { 86: 'away', 87: 'retreat', 94: 'home', 98: 'away' };

// A lunation's four quarters: when each begins, from the moon itself
function quarters(start, end) {
  const p = phase_hunt(new Date(start + 2 * DAY));
  const at = [start, p.q1_date.getTime(), p.full_date.getTime(), p.q3_date.getTime(), end + 1];
  return QUARTERS.map((name, q) => ({ name, start: at[q], end: at[q + 1] - 1 }));
}

// Which of personal, local and global a lunation leans towards: a draft by
// the season (inward in winter and at the year's end, the land in the
// growing and harvest months, the world when people gather), to be set by
// the village
const LEAN = { 84: 'local', 85: 'local', 86: 'personal', 87: 'personal', 88: 'personal', 89: 'local', 90: 'local', 91: 'local', 92: 'personal', 93: 'global', 94: 'global', 95: 'local', 96: 'local', 97: 'local', 98: 'personal', 99: 'personal', 100: 'global' };

// Which agreed goals (the eight forms of capital, and the criteria the
// village voted on) a lunation moves, from the drafts on the Game B page
function goalsOf(l) {
  const capitalOf = (item) => CRITERIA.find((c) => c.items.includes(item))?.capital;
  return (l.impact ?? []).map((item) => ({ capital: capitalOf(item) ?? '', item }));
}

// Who might find their place in a lunation: the groups on the Game B page's
// "Flows I can join", each matched to the forms of capital its work grows.
// A draft, to be set by the village.
export const PEOPLE = {
  'Body and breath guides': ['Spiritual', 'Experiential'],
  'Code weavers': ['Intellectual'],
  'Keepers of craft': ['Cultural', 'Material'],
  'Makers of good things': ['Material', 'Financial'],
  'Cooks and growers': ['Living'],
  'Space holders': ['Social', 'Spiritual'],
  'Storytellers and artists': ['Cultural', 'Experiential'],
};

// Longer stretches that span several lunations, like the coloured bars on
// the Miro board. Drafts, until Holons holds them.
export const SPANS = [
  { from: 89, to: 91, title: 'Build season', colour: '#bfe3c4' },
  { from: 92, to: 94, title: 'Hackalong summer', colour: '#ffd98a' },
  { from: 98, to: 100, title: 'Seeing ahead to 2028', colour: '#d9cff5' },
];

// --- what is noted on a day --------------------------------------------------
// Like the notes pinned along the Miro's line: the turning of the sun, and
// the dated happenings the year's drafts already name (San Martino on 11 Nov,
// the Geminids on 13 Dec…), each pinned at its day. When Holons holds the
// Miro's notes, they come in the same way, with their own days.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DATED = new RegExp(`(?:,\\s*|\\s+)?(?:around\\s+)?(\\d{1,2})(?:\\s*(?:to|–|-)\\s*\\d{1,2})?\\s+(${MONTHS.join('|')})\\b`);
function datedIn(text, l) {
  const m = text.match(DATED);
  if (!m) return null;
  const month = MONTHS.indexOf(m[2]);
  for (const y of [new Date(l.start).getFullYear(), new Date(l.start).getFullYear() + 1]) {
    const at = Date.UTC(y, month, Number(m[1]), 10);
    if (at >= l.start - DAY && at <= l.end + DAY) {
      const title = text.replace(m[0], '').replace(/\s*[:,]\s*$/, '').replace(/\(\s*\)/, '').trim();
      return { at: Math.min(Math.max(at, l.start), l.end), title };
    }
  }
  return null;
}
const symbolFor = (text, realm) =>
  /eclipse/i.test(text) ? 'moon' : /meteor|comet/i.test(text) ? 'star' : realm === 'global' ? 'vision' : 'gathering';

// The sun's four turnings, with their names on the old wheel of the year
const TURNS = { 0: 'Spring equinox · Ostara', 90: 'Summer solstice · Litha', 180: 'Autumn equinox · Mabon', 270: 'Winter solstice · Yule' };
function sunTurns(l) {
  const out = [];
  for (let t = l.start; t < l.end; t += DAY) {
    const a = sunLongitude(t);
    const b = sunLongitude(t + DAY);
    for (const deg of [0, 90, 180, 270]) {
      const crossed = deg === 0 ? a > 300 && b < 60 : a < deg && b >= deg;
      if (crossed) out.push({ at: t + DAY / 2, title: TURNS[deg], wheel: true, where: 'the wheel of the year', kind: 'astronomical' });
    }
  }
  return out;
}

// Key days of the year that come back on the same date: the four
// cross-quarter days of the old (pagan) wheel of the year, halfway between
// the sun's turnings, with the Italian feasts that keep them, and the
// folk days of Italy, Le Marche and Ascoli Piceno. Drafts, to be
// completed and corrected from Jillian's research (the Miro board), Spinettoli's
// own days among them; until then only days that are widely known.
export const KEY_DAYS = [
  { month: 0, day: 6, title: 'Befana', where: 'Italy', symbol: 'gathering' },
  { month: 0, day: 17, title: "Sant'Antonio Abate: animals blessed, bonfires lit", where: 'Le Marche', symbol: 'fire' },
  { month: 1, day: 1, title: 'Imbolc · Candelora, the first light', where: 'the wheel of the year', symbol: 'wheel', wheel: true },
  { month: 2, day: 19, title: 'San Giuseppe', where: 'Italy', symbol: 'gathering' },
  { month: 4, day: 1, title: 'Beltane · Calendimaggio, the May songs', where: 'the wheel of the year', symbol: 'wheel', wheel: true },
  { month: 5, day: 24, title: 'Notte di San Giovanni: herbs gathered, walnuts picked for nocino', where: 'Italy', symbol: 'gathering' },
  { month: 7, day: 1, title: 'Lughnasadh, the first harvest', where: 'the wheel of the year', symbol: 'wheel', wheel: true },
  { month: 7, day: 5, title: "Sant'Emidio, Ascoli's patron", where: 'Ascoli Piceno', symbol: 'gathering' },
  { month: 9, day: 31, title: 'Samhain · Ognissanti and the Day of the Dead', where: 'the wheel of the year', symbol: 'wheel', wheel: true },
  { month: 11, day: 10, title: 'La Venuta: bonfires for the Madonna of Loreto', where: 'Le Marche', symbol: 'fire' },
];
function keyDays(l) {
  const out = [];
  for (const k of KEY_DAYS) {
    for (const y of [new Date(l.start).getFullYear(), new Date(l.start).getFullYear() + 1]) {
      const at = Date.UTC(y, k.month, k.day, 10);
      if (at >= l.start && at <= l.end) out.push({ ...k, at });
    }
  }
  return out;
}
const sameDay = (a, b) => Math.abs(a - b) < DAY * 0.9;

// --- samples, until Holons holds the village's own -----------------------
// Shapes taken from the Miro timelines (Jillian's reading of 2026 and 2027),
// with general dates; none of them is a real record. The land's work is the
// usual rhythm of olives, vines and gardens in Le Marche.
export const SAMPLE_STRETCHES = [
  { from: '2026-10-20', to: '2026-11-30', title: 'Olive harvest and pressing', kind: 'ecological' },
  { from: '2026-12-21', to: '2027-01-20', title: 'Winter planning', kind: 'developmental', status: 'committed' },
  { from: '2027-02-01', to: '2027-03-15', title: 'Pruning the olives and vines', kind: 'ecological' },
  { from: '2027-03-10', to: '2027-04-30', title: 'Sowing and the seed nursery', kind: 'ecological' },
  { from: '2027-04-15', to: '2027-05-30', title: 'Artist residency', kind: 'economic', status: 'imagined' },
  { from: '2027-05-01', to: '2027-06-15', title: 'Crowdfunding', kind: 'economic', status: 'imagined' },
  { from: '2027-05-10', to: '2027-06-15', title: 'Strawberries', kind: 'ecological' },
  { from: '2027-06-01', to: '2027-07-10', title: 'Mulberries', kind: 'ecological' },
  { from: '2027-06-10', to: '2027-09-14', title: 'School summer holidays', where: 'Le Marche', kind: 'cultural' },
  { from: '2027-07-01', to: '2027-08-31', title: 'Summer rentals', kind: 'economic', status: 'imagined' },
  { from: '2027-09-10', to: '2027-10-10', title: 'Grape harvest', kind: 'ecological' },
  { from: '2027-10-20', to: '2027-11-30', title: 'Olive harvest and pressing', kind: 'ecological' },
  { from: '2027-12-01', to: '2027-12-21', title: 'Year-end reflection', kind: 'developmental', status: 'committed' },
  { from: '2027-12-21', to: '2028-01-25', title: 'Sensing ahead for 2028', kind: 'developmental', status: 'imagined' },
];
export const SAMPLE_NOTES = [
  { on: '2026-10-25T10:00:00Z', title: 'First pressing at the frantoio', kind: 'ecological', status: 'remembered' },
  { on: '2027-01-15T10:00:00Z', title: 'Which funding applications, and by when?', kind: 'economic', status: 'imagined', question: true },
  { on: '2027-02-01T10:00:00Z', title: 'Crowdfunding: spring or autumn?', kind: 'economic', status: 'imagined', question: true },
  { on: '2027-03-15T10:00:00Z', title: 'Beds for volunteers and guests this summer?', kind: 'relational', status: 'imagined', question: true },
  { on: '2027-06-20T10:00:00Z', title: 'Midsummer gathering', kind: 'relational', status: 'committed' },
];
// Who is here, and for how long: for members only (Holons' permissions);
// visitors only ever see the lantern's code words. Roles, not names.
export const SAMPLE_STAYS = [
  { from: '2026-10-10', to: '2026-12-09', who: 'The hosting family', role: 'host' },
  { from: '2026-12-09', to: '2027-01-07', who: 'Guardians, in keeping', role: 'keeping' },
  { from: '2027-01-07', to: '2027-11-28', who: 'The hosting family', role: 'host' },
  { from: '2027-11-28', to: '2027-12-27', who: 'Guardians, in keeping', role: 'keeping' },
  { from: '2027-12-27', to: '2028-02-25', who: 'The hosting family', role: 'host' },
  { from: '2026-10-20', to: '2026-11-30', who: 'A volunteer for the harvest', role: 'volunteer' },
  { from: '2027-03-01', to: '2027-04-15', who: 'A volunteer in the garden', role: 'volunteer' },
  { from: '2027-04-15', to: '2027-05-30', who: 'A guest in residency', role: 'guest' },
  { from: '2027-06-01', to: '2027-09-15', who: 'Co-stewards, regenerative hosting', role: 'steward' },
  { from: '2027-07-01', to: '2027-08-20', who: 'Summer volunteers', role: 'volunteer' },
];
const toMs = (d) => Date.parse(d.length <= 10 ? `${d}T12:00:00Z` : d);
// Festivals the village goes to or keeps an eye on: real dates, kept apart
// from the samples so they stay when Holons answers (until Holons holds them).
// Dates from festival listings; to confirm with each festival nearer the time.
export const FESTIVALS = [
  { from: '2027-07-18', to: '2027-07-25', title: 'Boom Festival', where: 'Idanha-a-Nova, Portugal', kind: 'cultural' },
  { from: '2027-07-29', to: '2027-08-02', title: 'Garbicz Festival', where: 'Garbicz, Poland', kind: 'cultural' },
];
export const festivals = () => FESTIVALS.map((x, k) => ({ id: `festival-${k}`, visibility: 'public', ...x, at: toMs(x.from), until: toMs(x.to) }));
export const stretches = () => SAMPLE_STRETCHES.map((x, k) => ({ id: `stretch-${k}`, sample: true, visibility: 'public', ...x, at: toMs(x.from), until: toMs(x.to) }));
export const stays = () => SAMPLE_STAYS.map((x, k) => ({ id: `stay-${k}`, sample: true, ...x, at: toMs(x.from), until: toMs(x.to) }));

function pinsOf(l, qs) {
  const qOf = (at) => Math.max(0, qs.findIndex((x) => at <= x.end));
  const pins = sunTurns(l).map((p, k) => ({ id: `sun-${l.index}-${k}`, symbol: 'wheel', ...p }));
  for (const realm of ['local', 'global']) {
    (l[realm] ?? []).forEach((text, k) => {
      const d = datedIn(text, l);
      if (d) {
        const symbol = symbolFor(text, realm);
        const kind = symbol === 'star' || symbol === 'moon' ? 'astronomical' : 'cultural';
        pins.push({ id: `${realm}-${l.index}-${k}`, symbol, kind, where: realm === 'local' ? 'Ascoli Piceno and around' : '', ...d });
      }
    });
  }
  // the key days, unless the drafts already name that day
  keyDays(l).forEach((d, k) => {
    if (!pins.some((p) => sameDay(p.at, d.at))) pins.push({ id: `key-${l.index}-${k}`, kind: 'cultural', ...d });
  });
  // the village's own notes and questions with a day
  SAMPLE_NOTES.forEach((d, k) => {
    const at = Date.parse(d.on);
    if (at >= l.start && at <= l.end) pins.push({ id: `note-${l.index}-${k}`, sample: true, ...d, at, symbol: d.question ? 'question' : KINDS[d.kind].leaf });
  });
  return pins.map((p) => ({ ...p, lunation: l.index, q: qOf(p.at), visibility: 'public', pinned: true }));
}

// --- Holons' quests, as the timeline reads them ------------------------------
// The same quests the kiosk draws (see calendar/schedule.js): a dated quest is
// a leaf on its day, a quest that runs over several days lies in a lane, and
// a recurring quest (a `frequency`: weekly, monthly…) is a rhythm, the
// kiosk's orbits laid along the line. How a quest stands comes from Holons:
// done is remembered, `stance: 'imagined'` is imagined, the rest committed;
// `question: true` marks a question still to decide; the kind of time is its
// category when that names one (see KINDS).
const kindOf = (category) => (KINDS[String(category).toLowerCase()] ? String(category).toLowerCase() : 'relational');
const stanceOf = (e) => (e.completed ? 'remembered' : e.stance === 'imagined' ? 'imagined' : 'committed');
function readQuests(quests, years) {
  const events = years.flatMap((y) => toEvents(quests, y));
  return {
    days: events.filter((e) => !e.recurring && !e.multiDay).map((e) => ({ id: e.id, at: e.date.getTime(), title: e.title, kind: kindOf(e.category), status: stanceOf(e), question: e.question || /\?\s*$/.test(e.title), where: e.location, visibility: 'public' })),
    spans: events.filter((e) => !e.recurring && e.multiDay).map((e) => ({ id: e.id, at: e.date.getTime(), until: (e.end ?? e.date).getTime(), title: e.title, kind: kindOf(e.category), status: stanceOf(e), visibility: 'public' })),
    beats: events.filter((e) => e.recurring).map((e) => ({ id: e.id, series: e.series, at: e.date.getTime(), title: e.title, kind: kindOf(e.category), frequency: e.frequency, done: e.completed })),
  };
}

// Rhythms, until Holons holds the village's own: written as Holons quests,
// so they go through the very same reading as the real ones will.
const SAMPLE_RHYTHMS = [
  { id: 'sample-hack', title: 'Open Hack Space', type: 'recurring', frequency: 'weekly', when: '2026-10-13T15:00', category: 'developmental' },
  { id: 'sample-garden', title: 'Garden morning', type: 'recurring', frequency: 'weekly', when: '2026-10-17T09:00', category: 'ecological' },
  { id: 'sample-dinner', title: 'Shared dinner', type: 'recurring', frequency: 'weekly', when: '2026-10-11T19:30', category: 'relational' },
  { id: 'sample-council', title: 'Village council', type: 'recurring', frequency: 'biweekly', when: '2026-10-21T18:00', category: 'economic' },
];

/** The lunations, with quarters and events; `live` says whether Holons answered. */
export async function loadTimeline() {
  let quests = null;
  try {
    const res = await fetch('/api/calendar');
    if (res.ok) quests = (await res.json()).quests;
  } catch {
    quests = null;
  }
  const years = [...new Set(YEAR.flatMap((l) => [new Date(l.start).getFullYear(), new Date(l.end).getFullYear()]))];
  const read = readQuests(quests ?? [], years);
  const rhythms = quests ? read.beats : readQuests(SAMPLE_RHYTHMS, years).beats.map((b) => ({ ...b, sample: true }));
  const lunations = YEAR.map((l) => {
    const qs = quarters(l.start, l.end);
    const items = read.days
      .filter((e) => e.at >= l.start && e.at <= l.end)
      .map((e) => ({ ...e, lunation: l.index, q: Math.max(0, qs.findIndex((x) => e.at <= x.end)), symbol: e.question ? 'question' : KINDS[e.kind].leaf }));
    items.push(...pinsOf(l, qs));
    // the sun over the village at the lunation's first and last day
    const first = sunTimes(l.start);
    const last = sunTimes(l.end);
    return {
      ...l,
      sunAt: { first, last, change: last.minutes - first.minutes },
      quarters: qs,
      items,
      presence: PRESENCE[SAMPLE_PRESENCE[l.index]] ?? null,
      lean: LEAN[l.index] ?? 'local',
      goals: goalsOf(l),
    };
  });
  return { lunations, live: !!quests, spans: read.spans, rhythms };
}
