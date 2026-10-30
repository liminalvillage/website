// The year ahead in moons: from the lunation we are in now (84, autumn 2026)
// to the hundredth, early in 2028. Dates come from the site's lunation
// calculation; the village counts one higher than it does (the moon that
// begins on 9 November 2026 is Lunation 85), so COUNT_SHIFT adds one.
// Each lunation has a name of its own (for the whole cycle, new moon to new
// moon, not one night), a theme that follows the season in
// Le Marche and a short description, and names the forms of capital it grows
// most, the money flows it suits and which of the agreed criteria (CRITERIA,
// below) it moves, with what happens locally around Ascoli Piceno and in
// the wider world and sky. Draft ideas, to be shaped by the village.
import { lunationAt } from '../calendar/lunation.js';
import { skyFor } from './sky.js';

const THEMES = {
  84: {
    name: 'Honest Harvest Moon',
    theme: 'Olive harvest and the honest look',
    season: 'Autumn, now',
    about: 'The olives are picked and pressed, and the village looks honestly at where it stands in all eight forms of capital.',
    capitals: ['Living', 'Social', 'Intellectual'],
    money: ['Harvest stays', 'Olive oil sales', 'General donations'],
    impact: ['Olive grove', 'Clarity of shared purpose'],
    local: ["Olive harvest and pressing at the frantoi", "Chestnut festivals in the hills"],
    global: ["Orionid meteors, around 21 Oct"],
  },
  85: {
    name: 'Choosing Moon',
    theme: 'Choosing our directions',
    season: 'Late autumn',
    about: 'The few directions for the year are chosen together, and each finds the people who want to carry it.',
    capitals: ['Social', 'Intellectual', 'Spiritual'],
    money: ['Membership fees', 'Earmarked donations'],
    impact: ['Agreements and contracts', 'Purpose and meaning alignment'],
    local: ["San Martino, 11 Nov: new wine and chestnuts", "First tastings of the new olive oil"],
    global: ["Leonid meteors, around 17 Nov"],
  },
  86: {
    name: 'Long Night Moon',
    theme: 'Winter solstice and rest',
    season: 'Winter solstice, 21 December',
    about: 'The year turns inward: rest, gifts, and the first long nights by the fire.',
    capitals: ['Spiritual', 'Cultural'],
    money: ['General donations', 'Talks, writing and prints'],
    impact: ['Personal practice', 'Lunar and solar ritual practice'],
    local: ["Christmas markets and nativity scenes in Ascoli"],
    global: ["Geminid meteors, 13 to 14 Dec"],
  },
  87: {
    name: 'Intention Moon',
    theme: 'Seeds of intention',
    season: 'Deep winter',
    about: 'A quiet moon for dreaming the year: vision, inner work and writing down what the village wants to grow.',
    capitals: ['Spiritual', 'Intellectual'],
    money: ['Online courses', 'Mission-aligned grants', 'AI-ready knowledge for donors'],
    impact: ['Clarity of shared purpose', 'Purpose and meaning alignment'],
    local: ["Sant'Antonio Abate, 17 Jan: animals blessed, bonfires lit"],
    global: ["World Wetlands Day, 2 Feb"],
  },
  88: {
    name: 'Pruning Moon',
    theme: 'Pruning and repair',
    season: 'Late winter',
    about: 'Olive trees and vines are pruned, tools and buildings mended before spring.',
    capitals: ['Material', 'Experiential'],
    money: ['Courses on the land', 'Hosted tools for communities'],
    impact: ['Maintenance systems', 'Tools and agricultural equipment'],
    local: ["Carnevale di Ascoli Piceno, Martedì grasso 9 Feb"],
    global: ["Annular solar eclipse, 6 Feb (South America and Africa)", "Penumbral lunar eclipse, 20 Feb"],
  },
  89: {
    name: 'Sowing Moon',
    theme: 'Seed and sowing',
    season: 'Spring equinox, 20 March',
    about: 'The garden wakes: sowing, the seed nursery and a seed swap between members and nodes.',
    capitals: ['Living', 'Social'],
    money: ['Courses on the land', 'Membership fees'],
    impact: ['Food production (permaculture, garden)', 'Soil health and biodiversity'],
    local: ["Easter, 28 Mar, and Pasquetta"],
    global: ["World Water Day, 22 Mar"],
  },
  90: {
    name: 'Wild Greens Moon',
    theme: 'Wild greens and herbs',
    season: 'Mid spring',
    about: 'Foraging the hillsides for wild greens and herbs, and fermenting the first of them.',
    capitals: ['Living', 'Experiential'],
    money: ['Courses on the land', 'Themed retreats'],
    impact: ['Nature connection (land, beach, seasons)', 'Workshops and skill-sharing'],
    local: ["Liberation Day, 25 Apr", "Fritto Misto all'Italiana in Ascoli, usually late April"],
    global: ["Earth Day and the Lyrid meteors, 22 Apr"],
  },
  91: {
    name: 'Builders\' Moon',
    theme: 'Build season',
    season: 'Late spring',
    about: 'Dry, long days for natural building and the village\'s shared spaces.',
    capitals: ['Material', 'Experiential'],
    money: ['Courses on the land', 'Team offsites'],
    impact: ['Building materials', 'Trades'],
    local: ["The Sibillini meadows in flower"],
    global: ["World Bee Day, 20 May"],
  },
  92: {
    name: 'Long Light Moon',
    theme: 'Solstice and the body',
    season: 'Summer solstice, 21 June',
    about: 'The longest light: movement, yoga and time in the biolake, and the first summer guests in caravans and tents.',
    capitals: ['Spiritual', 'Social'],
    money: ['Themed retreats', 'Caravans and tents in summer'],
    impact: ['Body practices (movement, dance, breathwork)', 'Shared ceremonies and celebrations'],
    local: ["La Fiorita: Castelluccio's lentil fields bloom"],
    global: ["World Environment Day, 5 Jun"],
  },
  93: {
    name: 'Plum Moon',
    theme: 'Plums and Hackalong summer',
    season: 'High summer',
    about: 'The plums ripen and are picked and preserved together, while builders arrive from the network for open-source code and quests.',
    capitals: ['Intellectual', 'Living', 'Social'],
    money: ['Hack retreats for aligned teams', 'Open-source sponsorship', 'Small makers selling preserves'],
    impact: ['Digital tools and systems', 'Partnerships with other hubs (NAO network)'],
    local: ["Quintana di Ascoli, the July joust"],
    global: ["Penumbral lunar eclipse, 18 Jul"],
  },
  94: {
    name: 'Festival Moon',
    theme: 'Festival and art',
    season: 'Ferragosto, 15 August',
    about: 'Midsummer festival time in Italy: music, art and the village open to neighbours.',
    capitals: ['Cultural', 'Social'],
    money: ['Talks, writing and prints', 'Project crowdfunding'],
    impact: ['Porosity with local Italian village', 'Creative expression (art, music, performance)'],
    local: ["Quintana di Ascoli and Sant'Emidio, 5 Aug", "Ferragosto, 15 Aug"],
    global: ["Total solar eclipse, 2 Aug: total across Spain, North Africa and Egypt, partial from Italy", "Perseid meteors, 12 to 13 Aug", "Penumbral lunar eclipse, 17 Aug"],
  },
  95: {
    name: 'Harvest Moon',
    theme: 'Harvest and preserving',
    season: 'Autumn equinox, 23 September',
    about: 'Grape harvest and the summer\'s abundance turned into passata, jams and preserves.',
    capitals: ['Living', 'Material'],
    money: ['Courses on the land', 'Small makers selling preserves'],
    impact: ['Fruit trees and seasonal produce', 'Dietary care and food options'],
    local: ["Grape harvest around Offida"],
    global: ["International Day of Peace, 21 Sep"],
  },
  96: {
    name: 'Ferment Moon',
    theme: 'Wine, chestnuts and fermentation',
    season: 'Early autumn',
    about: 'Chestnuts and mushrooms in the woods, and a moon given to fermented food and drink.',
    capitals: ['Experiential', 'Cultural'],
    money: ['Themed retreats', 'Small makers selling fermented drinks'],
    impact: ['Workshops and skill-sharing', 'Revenue from events and workshops'],
    local: ["Chestnut festivals; the olive harvest begins"],
    global: ["Orionid meteors, around 21 Oct"],
  },
  97: {
    name: 'New Oil Moon',
    theme: 'Olive harvest',
    season: 'November',
    about: 'Picking the olives together and pressing the new oil, the high point of the farming year.',
    capitals: ['Living', 'Social', 'Financial'],
    money: ['Harvest stays', 'Olive oil sales', 'Team offsites'],
    impact: ['Olive grove', 'Visitor and guest relationships'],
    local: ["Olive harvest and the new oil", "San Martino, 11 Nov"],
    global: ["Leonid meteors, around 17 Nov"],
  },
  98: {
    name: 'Gift Moon',
    theme: 'Darkness and gifts',
    season: 'Winter solstice, 21 December',
    about: 'The year turns inward: reflection, gifts and the stories of the year told together.',
    capitals: ['Spiritual', 'Cultural'],
    money: ['General donations', 'Earmarked donations', 'Talks, writing and prints'],
    impact: ['Community memory and mythology', 'Non-monetary exchange / gift economy / barter'],
    local: ["Immacolata, 8 Dec, and Christmas in Ascoli"],
    global: ["World Soil Day, 5 Dec", "Geminid meteors, 13 to 14 Dec"],
  },
  99: {
    name: 'Mirror Moon',
    theme: 'The open year review',
    season: 'New year',
    about: 'Looking back at all eight forms of capital, an open budget for the year to come, and the network invited for Lunation 100.',
    capitals: ['Financial', 'Intellectual'],
    money: ['Membership fees', 'Supporters on Open Collective', 'Mission-aligned grants', 'Project crowdfunding'],
    impact: ['Budget management and transparency', 'Financial runway'],
    local: ["New year and Befana, 6 Jan", "Sant'Antonio Abate, 17 Jan"],
    global: ["Quadrantid meteors, 3 to 4 Jan", "Partial lunar eclipse, 12 Jan"],
  },
  100: {
    name: 'The Hundredth Moon',
    theme: 'Lunation 100',
    season: 'Midwinter, early 2028',
    about: 'One hundred moons of Liminal Village. The network gathers to celebrate, share what each node has learned and seed the next hundred.',
    capitals: ['Social', 'Material', 'Financial', 'Living', 'Intellectual', 'Experiential', 'Spiritual', 'Cultural'],
    money: ['Hosting other groups', 'Project crowdfunding', 'Talks, writing and prints'],
    impact: ['LV brand, story and identity', 'Community memory and mythology'],
    milestone: true,
    local: ["The network gathers at the village"],
    global: ["Annular solar eclipse on the hundredth new moon, 26 Jan (South America to Spain and Portugal)"],
  },
};

const day = (ms) => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Europe/Rome' });
const yearOf = (ms) => new Date(ms).toLocaleDateString('en-GB', { year: 'numeric', timeZone: 'Europe/Rome' });

const COUNT_SHIFT = 1;
const FIRST = 84;
const LAST = 100;

export const YEAR = (() => {
  const out = [];
  const now = Date.now();
  let l = lunationAt(Date.UTC(2026, 9, 20));
  while (l.index + COUNT_SHIFT <= LAST) {
    const index = l.index + COUNT_SHIFT;
    if (index >= FIRST) {
      out.push({ index, from: day(l.from), to: day(l.to), year: yearOf(l.to), now: now >= l.from && now <= l.to, sky: skyFor(l.from, l.to), ...THEMES[index] });
    }
    l = lunationAt(l.to + 86400000);
  }
  return out;
})();

// The criteria the village agreed to value its abundance by: eighty
// subcategories across the eight forms of capital, each rated 1 to 5 for
// where the village is today and where it wants to be a year from now
export const CRITERIA = [
  { capital: 'Financial', items: ['Fundraising & donations', 'Revenue from events and workshops', 'Collective services income', 'Member income / stipends', 'Budget management and transparency', 'Financial runway', 'Recurring income / membership fees', 'Non-monetary exchange / gift economy / barter'] },
  { capital: 'Material', items: ['Land (3 hectares, Marche)', 'Buildings and accommodation inc. the pool', 'Kitchen and food preparation', 'Tools and agricultural equipment', 'Technology and digital infrastructure', 'Transport', 'Climate comfort (AC, heating)', 'Maintenance systems', 'Building materials', 'Solo retreat / personal withdrawal space'] },
  { capital: 'Living', items: ['Food production (permaculture, garden)', 'Olive grove', 'Fruit trees and seasonal produce', 'Soil health and biodiversity', 'Water resources', 'Algae / aquaculture', 'Land stewardship practices', 'Irrigation infrastructure', 'Animals', 'Long-term resilience strategy', 'Energy infrastructure', 'Biodiversity', 'Compost and waste cycles'] },
  { capital: 'Social', items: ['Internal trust and team dynamics', 'Conflict resolution and clearing', 'Onboarding and integration of new members', 'Local network and bioregional connections', 'Partnerships with other hubs (NAO network)', "Children's wellbeing and participation", 'Visitor and guest relationships', 'Agreements and contracts', 'Toolkits for relational practices', 'Social networks of the collective', 'Multigenerational wisdom transfer', 'Game A bridging capacity', 'Diversity of backgrounds and worldviews', 'External communications and social presence'] },
  { capital: 'Intellectual', items: ['Knowledge systems and frameworks', 'Documentation and memory transfer', 'Business and brand strategy', 'Financial models and planning', 'Skills inventory', 'Research and learning culture', 'Digital tools and systems', 'Trades', 'Collective ideation capacity', 'Clarity of shared purpose', 'Leadership skills'] },
  { capital: 'Experiential', items: ['Body practices (movement, dance, breathwork)', 'Nervous system regulation offerings', 'Nature connection (land, beach, seasons)', 'Community meals and shared daily life', 'Workshops and skill-sharing', 'Healing modalities', 'Events and festivals', 'Guest experience (arrive smooth, leave with clarity)', 'Surprise and delight', 'Dietary care and food options'] },
  { capital: 'Spiritual', items: ['Personal practice', 'Shared spiritual containers', 'Connection to land cycles and cosmology', 'Purpose and meaning alignment', 'Superpowers: individual gifts activated', 'Transformational container'] },
  { capital: 'Cultural', items: ['Lunar and solar ritual practice', 'Shared ceremonies and celebrations', 'Creative expression (art, music, performance)', 'Aesthetic and beauty of the place', 'LV brand, story and identity', 'Porosity with local Italian village', 'Community memory and mythology', 'Music and sound'] },
];
