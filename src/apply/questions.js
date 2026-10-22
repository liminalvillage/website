// The Liminal Village community application: options, labels and the rules
// for what is required when. Shared by the /apply page and the
// netlify/functions/apply.mjs endpoint, so both check the same things.

export const AGES = ['20-30', '30-40', '40-50', '50-60', '60-70', '70-80'];

export const ROLES = [
  { value: 'Pollinator', label: 'Pollinator', hint: 'Works with different hubs, networking and sharing knowledge, ideas and competencies' },
  { value: 'Facilitator', label: 'Facilitator', hint: 'Supports hubs in organising and realising their vision' },
  { value: 'Storyteller', label: 'Storyteller', hint: 'Creates and broadcasts narratives about what’s happening in the network' },
  { value: 'Forager', label: 'Forager', hint: 'Supports hubs or the network in attracting resources' },
  { value: 'Hub Founder', label: 'Hub Founder', hint: 'Has founded, or would like to found a hub' },
  { value: 'Hub Steward', label: 'Hub Steward', hint: 'Stewards, or would like to steward a hub' },
  { value: 'Other', label: 'Other', hint: 'Something else — tell us' },
];

export const VISIT = [
  { value: 'visit', label: 'Yes, I would like to visit and stay in person', icon: '🌕' },
  { value: 'unsure', label: 'I am not sure yet', icon: '🌓' },
  { value: 'remote', label: 'I only want to join the community remotely', icon: '🌐' },
];

export const TRANSPORT = [
  { value: 'Car', icon: '🚗' },
  { value: 'Carpool / sharing a ride', icon: '🚙' },
  { value: 'Bus', icon: '🚌' },
  { value: 'Train', icon: '🚆' },
  { value: 'Flight', icon: '✈️' },
  { value: 'Bicycle', icon: '🚲' },
  { value: 'Other', icon: '✳️' },
];

export const ACCOMMODATION = [
  { value: 'My own van / camper', icon: '🚐' },
  { value: 'My own tent', icon: '⛺' },
  { value: 'A room at Liminal Village', icon: '🛏️' },
  { value: 'I’m not sure yet / I need more information', icon: '❓' },
];

export const TASKS = [
  { value: 'Anchoring the kitchen', hint: 'Menu planning, food acquisition', icon: '🧺' },
  { value: 'Cooking', icon: '🍲' },
  { value: 'Space tending', hint: 'Organizing, cleaning', icon: '🧹' },
  { value: 'Tech contributions', icon: '💻' },
  { value: 'Website Development & Social Media', icon: '🌐' },
  { value: 'Gardening', icon: '🌱' },
  { value: 'Building & Maintenance', icon: '🔨' },
  { value: 'Child Care', icon: '🧸' },
  { value: 'Crafting', hint: 'Painting, woodwork, art, decoration…', icon: '🎨' },
  { value: 'Body & mind work', icon: '🧘' },
  { value: 'Group Facilitation & Communication', icon: '🔥' },
  { value: 'Other', icon: '✳️' },
];

export const CONTRIBUTIONS = [
  { value: 'time', label: 'Primarily through volunteering time', hint: 'Practical tasks, roles, community support' },
  { value: 'financial', label: 'Primarily through a financial contribution' },
  { value: 'mix', label: 'A mix of time and financial contribution' },
  { value: 'discuss', label: 'I’m not sure yet / would like to discuss' },
  { value: 'Other', label: 'Other' },
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
  socials: 'Websites and social profiles',
};

const filled = (v) => (Array.isArray(v) ? v.length > 0 : !!String(v ?? '').trim());
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Who sees what. Remote-only applicants skip the travel questions.
export const comesInPerson = (a) => a.visit === 'visit' || a.visit === 'unsure';
export const hasSocials = (a) => filled(a.x) || filled(a.linkedin) || filled(a.website);

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
  { title: 'Story', keys: ['role', 'intention', 'ikigai', 'background', 'community', 'wellbeing', 'referral'] },
  { title: 'Lunation', keys: ['visit', 'arrival', 'departure', 'transport', 'licence', 'accommodation'] },
  { title: 'Contribution', keys: ['tasks', 'contribution', 'capacity'] },
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
