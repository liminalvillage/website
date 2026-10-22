// The Liminal Village community application: options, labels and the rules
// for what is required when. Shared by the /apply page and the
// netlify/functions/apply.mjs endpoint, so both check the same things.

export const AGES = ['20-30', '30-40', '40-50', '50-60', '60-70', '70-80'];

export const ROLES = [
  { id: 'pollinator', value: 'Pollinator', label: 'Pollinator', hint: 'Works with different hubs, networking and sharing knowledge, ideas and competencies' },
  { id: 'facilitator', value: 'Facilitator', label: 'Facilitator', hint: 'Supports hubs in organising and realising their vision' },
  { id: 'storyteller', value: 'Storyteller', label: 'Storyteller', hint: 'Creates and broadcasts narratives about what’s happening in the network' },
  { id: 'forager', value: 'Forager', label: 'Forager', hint: 'Supports hubs or the network in attracting resources' },
  { id: 'hub_founder', value: 'Hub Founder', label: 'Hub Founder', hint: 'Has founded, or would like to found a hub' },
  { id: 'hub_steward', value: 'Hub Steward', label: 'Hub Steward', hint: 'Stewards, or would like to steward a hub' },
  { id: 'other', value: 'Other', label: 'Other', hint: 'Something else — tell us' },
];

export const VISIT = [
  { value: 'visit', label: 'Yes, I would like to visit and stay in person', icon: '🌕' },
  { value: 'unsure', label: 'I am not sure yet', icon: '🌓' },
  { value: 'remote', label: 'I only want to join the community remotely', icon: '🌐' },
];

export const TRANSPORT = [
  { id: 'car', value: 'Car', icon: '🚗' },
  { id: 'carpool', value: 'Carpool / sharing a ride', icon: '🚙' },
  { id: 'bus', value: 'Bus', icon: '🚌' },
  { id: 'train', value: 'Train', icon: '🚆' },
  { id: 'flight', value: 'Flight', icon: '✈️' },
  { id: 'bicycle', value: 'Bicycle', icon: '🚲' },
  { id: 'other', value: 'Other', icon: '✳️' },
];

export const ACCOMMODATION = [
  { id: 'van', value: 'My own van / camper', icon: '🚐' },
  { id: 'tent', value: 'My own tent', icon: '⛺' },
  { id: 'room', value: 'A room at Liminal Village', icon: '🛏️' },
  { id: 'unsure', value: 'I’m not sure yet / I need more information', icon: '❓' },
];

export const TASKS = [
  { id: 'kitchen', value: 'Anchoring the kitchen', hint: 'Menu planning, food acquisition', icon: '🧺' },
  { id: 'cooking', value: 'Cooking', icon: '🍲' },
  { id: 'space_tending', value: 'Space tending', hint: 'Organizing, cleaning', icon: '🧹' },
  { id: 'tech', value: 'Tech contributions', icon: '💻' },
  { id: 'website_social', value: 'Website Development & Social Media', icon: '🌐' },
  { id: 'gardening', value: 'Gardening', icon: '🌱' },
  { id: 'building', value: 'Building & Maintenance', icon: '🔨' },
  { id: 'childcare', value: 'Child Care', icon: '🧸' },
  { id: 'crafting', value: 'Crafting', hint: 'Painting, woodwork, art, decoration…', icon: '🎨' },
  { id: 'bodywork', value: 'Body & mind work', icon: '🧘' },
  { id: 'facilitation', value: 'Group Facilitation & Communication', icon: '🔥' },
  { id: 'other', value: 'Other', icon: '✳️' },
];

export const CONTRIBUTIONS = [
  { id: 'volunteering', value: 'time', label: 'Primarily through volunteering time', hint: 'Practical tasks, roles, community support' },
  { id: 'financial', value: 'financial', label: 'Primarily through a financial contribution' },
  { id: 'mixed', value: 'mix', label: 'A mix of time and financial contribution' },
  { id: 'unsure', value: 'discuss', label: 'I’m not sure yet / would like to discuss' },
  { id: 'other', value: 'Other', label: 'Other' },
];

// Every field the form collects, with the label used in errors and in the
// steward's copy of the application.
export const LABELS = {
  email: 'E-mail',
  name: 'Name',
  location: 'Location',
  x: 'X',
  linkedin: 'LinkedIn',
  website: 'Other socials or website',
  age: 'Age range',
  role: 'Roles in a regenerative network',
  roleOther: 'Other role',
  intention: 'Intention',
  ikigai: 'Ikigai',
  publicProfile: 'Ikigai and LinkedIn on their public profile',
  background: 'Background',
  community: 'Community experience',
  wellbeing: 'Wellbeing',
  referral: 'Referred by',
  visit: 'Visit in person',
  arrival: 'Arrival',
  departure: 'Departure',
  transport: 'Transport',
  transportOther: 'Other transport',
  licence: 'Driver’s licence',
  accommodation: 'Accommodation',
  tasks: 'Roles / tasks',
  tasksOther: 'Other task',
  contribution: 'Contribution',
  contributionOther: 'Other contribution',
  capacity: 'Capacity',
  watched: 'Rewatched the vision video',
  socials: 'Websites and social profiles',
};

const filled = (v) => (Array.isArray(v) ? v.length > 0 : !!String(v ?? '').trim());
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Who sees what. Remote-only applicants skip the travel questions.
export const comesInPerson = (a) => a.visit === 'visit' || a.visit === 'unsure';
export const hasSocials = (a) => filled(a.x) || filled(a.linkedin) || filled(a.website);
// Ikigai and LinkedIn may go on the person's public Holons profile, if they say so.
export const hasProfile = (a) => filled(a.ikigai) || filled(a.linkedin);
export const wantsPublicProfile = (a) => a.publicProfile === 'Yes' && hasProfile(a);

/** Required fields that are missing or invalid, in the order they appear. */
export function missingFields(a) {
  const tasks = a.tasks ?? [];
  const checks = [
    ['email', EMAIL_RE.test(String(a.email ?? '').trim())],
    ['name', filled(a.name)],
    ['location', filled(a.location)],
    ['age', filled(a.age)],
    ['role', filled(a.role)],
    ['roleOther', !(a.role ?? []).includes('Other') || filled(a.roleOther)],
    ['intention', filled(a.intention)],
    ['community', filled(a.community)],
    ['wellbeing', filled(a.wellbeing)],
    ['visit', filled(a.visit)],
    ['arrival', !comesInPerson(a) || filled(a.arrival)],
    ['departure', !comesInPerson(a) || (filled(a.departure) && (!a.arrival || a.departure >= a.arrival))],
    ['licence', !comesInPerson(a) || filled(a.licence)],
    ['tasks', tasks.some((t) => t !== 'Other') || (tasks.includes('Other') && filled(a.tasksOther))],
    ['contribution', filled(a.contribution)],
    ['contributionOther', a.contribution !== 'Other' || filled(a.contributionOther)],
    ['capacity', filled(a.capacity)],
    ['socials', hasSocials(a) || filled(a.socials)],
  ];
  return checks.filter(([, ok]) => !ok).map(([key]) => key);
}

// How an application reads back — the steward's Telegram/e-mail copy and the
// /apply/admin detail view. "Other" answers are folded into their parent.
export const SECTIONS = [
  { title: 'You', keys: ['name', 'email', 'location', 'age', 'x', 'linkedin', 'website', 'socials'] },
  { title: 'Story', keys: ['role', 'intention', 'ikigai', 'publicProfile', 'background', 'community', 'wellbeing', 'referral'] },
  { title: 'Lunation', keys: ['visit', 'arrival', 'departure', 'transport', 'licence', 'accommodation'] },
  { title: 'Contribution', keys: ['watched', 'tasks', 'contribution', 'capacity'] },
];

const withOther = (list, other) => [...(list ?? []).filter((v) => v !== 'Other'), ...((list ?? []).includes('Other') && other ? [`Other — ${other}`] : [])];
const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? value;

/** One answer as text, or '' when it was left blank. */
export function answer(a, key) {
  switch (key) {
    case 'role': return withOther(Array.isArray(a.role) ? a.role : [a.role].filter(Boolean), a.roleOther).join(', ');
    case 'transport': return withOther(a.transport, a.transportOther).join(', ');
    case 'tasks': return withOther(a.tasks, a.tasksOther).join(', ');
    case 'visit': return a.visit ? labelOf(VISIT, a.visit) : '';
    case 'contribution': return a.contribution === 'Other' ? `Other — ${a.contributionOther ?? ''}` : a.contribution ? labelOf(CONTRIBUTIONS, a.contribution) : '';
    default: return Array.isArray(a[key]) ? a[key].join(', ') : String(a[key] ?? '').trim();
  }
}

// The record HolonsBot keeps in the `applications` lens: the same answers,
// keyed and valued as in holons' telegram-ui/data/booking.json, so web and
// Telegram applications read alike. "Other" text goes in `<key>_other`.
// `profileClaim` is set when they asked for their ikigai and LinkedIn on their
// public profile: opening t.me/HolonsBot?start=profile_<claim> tells the bot
// whose profile that is (the web never knows their Telegram id).
const idOf = (options, value) => options.find((o) => o.value === value)?.id ?? value;
const idsOf = (options, values) => (values ?? []).map((v) => idOf(options, v));

export function toHolonsRecord(a, { id, at, profileClaim }) {
  const person = comesInPerson(a);
  const data = {
    email: a.email,
    name: a.name,
    location: a.location,
    age_range: a.age,
    x: a.x,
    linkedin: a.linkedin,
    website: a.website,
    role: idsOf(ROLES, a.role),
    role_other: (a.role ?? []).includes('Other') ? a.roleOther : '',
    intention: a.intention,
    ikigai: a.ikigai,
    public_profile: hasProfile(a) ? (wantsPublicProfile(a) ? 'yes' : 'no') : '',
    background: a.background,
    community_experience: a.community,
    wellbeing: a.wellbeing,
    referral: a.referral,
    visit: a.visit,
    ...(person && {
      arrival: a.arrival,
      departure: a.departure,
      transportation: idsOf(TRANSPORT, a.transport),
      transportation_other: (a.transport ?? []).includes('Other') ? a.transportOther : '',
      drivers_license: a.licence ? a.licence.toLowerCase() : '',
      accommodation: a.accommodation ? idOf(ACCOMMODATION, a.accommodation) : '',
    }),
    watched: a.watched,
    tasks: idsOf(TASKS, a.tasks),
    tasks_other: (a.tasks ?? []).includes('Other') ? a.tasksOther : '',
    contribution_preference: a.contribution ? idOf(CONTRIBUTIONS, a.contribution) : '',
    contribution_preference_other: a.contribution === 'Other' ? a.contributionOther : '',
    capacity: a.capacity,
    social_links: a.socials,
  };
  // Leave out what was not answered, as the bot does for skipped questions.
  for (const [k, v] of Object.entries(data)) if (v == null || v === '' || (Array.isArray(v) && !v.length)) delete data[k];
  // The secret the applicant's "add to my profile" link to HolonsBot carries.
  return { id, submittedAt: at, source: 'web', status: 'submitted', email: a.email, name: a.name, data, ...(profileClaim && { profileClaim }) };
}
