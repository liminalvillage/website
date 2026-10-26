// What the /dna detail panel shows: more on each gene, and on each framework
// the DNA mentions. The six frameworks with a section on /frameworks are
// summarised from public/frameworks.html and deep-link back to it.

const SOCIAL_DNA = { label: 'Social DNA in our docs', href: 'https://docs.liminalvillage.com/onboarding/social-dna' };

export const GENES = {
  purpose: {
    blurb: 'The gene everything else is expressed from. Liminal Village is a living laboratory in the Tronto Valley, founded in 2018, where we prototype a regenerative civilization — community living, healing practices and open-source technology — and share everything we learn.',
    links: [
      { label: 'About Liminal Village', href: '/', icon: 'fa-house' },
      { label: 'ReGenerativa', href: 'https://regenerativa.earth', icon: 'fa-circle-nodes' },
      { label: 'ReFactory', href: 'https://refactory.earth', icon: 'fa-industry' },
      { label: 'Casa Selva', href: 'https://casaselva.earth', icon: 'fa-tree' },
      { label: 'Documentation', href: 'https://docs.liminalvillage.com/', icon: 'fa-book-open' },
    ],
  },
  thresholds: {
    blurb: 'Liminal comes from limen, threshold. Rather than pick a side of old divides, we work in the space between them — nature and technology, science and spirituality, self and community — where genuinely new things can begin.',
    links: [
      { label: 'Frameworks we think with', href: '/frameworks', icon: 'fa-map' },
      { label: 'Readings & media', href: '/media', icon: 'fa-book' },
      { ...SOCIAL_DNA, icon: 'fa-dna' },
    ],
  },
  values: {
    blurb: 'Ten values that act as a compass for every decision. Each is paired with what it looks like in practice, so they can be lived and not just agreed with.',
    links: [
      { ...SOCIAL_DNA, icon: 'fa-dna' },
      { label: 'Open books on Open Collective', href: 'https://opencollective.com/liminal', icon: 'fa-coins' },
      { label: 'Apply to visit', href: '/apply', icon: 'fa-pen-to-square' },
    ],
  },
  agreements: {
    blurb: 'The shared grammar of community life: how we speak, listen and turn friction into improvement. Everyone practises them, imperfectly but sincerely.',
    frameworks: ['four-agreements', 'nvc', 'holacracy', 'integral-theory', 'spiral-dynamics', 'ikigai', 'permaculture', 'internal-family-systems', 'enneagram'],
    links: [
      { label: 'Frameworks we think with', href: '/frameworks', icon: 'fa-map' },
      { ...SOCIAL_DNA, icon: 'fa-dna' },
    ],
  },
  practices: {
    blurb: 'What is expected of everyone who joins: you are a co-creator of a temporary community, not a guest at a retreat. The practices follow a lunation from before you arrive to the day you leave.',
    links: [
      { label: 'Onboarding docs', href: 'https://docs.liminalvillage.com/onboarding', icon: 'fa-book-open' },
      { label: 'What to expect', href: 'https://docs.liminalvillage.com/onboarding/what-to-expect', icon: 'fa-compass' },
      { label: 'Lunations calendar', href: '/lunations', icon: 'fa-moon' },
      { label: 'Quests to join', href: '/quests.html', icon: 'fa-flag' },
      { label: 'Apply to visit', href: '/apply', icon: 'fa-pen-to-square' },
    ],
  },
  roles: {
    blurb: 'Soft Holacracy: authority sits in roles, not people. Anyone can hold several roles, roles change as the village does, and there are four ways to take part — member, volunteer, sponsor or visitor.',
    frameworks: ['holacracy'],
    links: [
      { label: 'Services & skills', href: '/services', icon: 'fa-hands-holding-circle' },
      { label: 'Quests to join', href: '/quests.html', icon: 'fa-flag' },
      { label: 'HolonsBot on Telegram', href: 'https://t.me/HolonsBot', icon: 'fa-paper-plane' },
      { label: 'Apply to visit', href: '/apply', icon: 'fa-pen-to-square' },
    ],
  },
  tools: {
    blurb: 'A cybernetic operating system: open tools that make tasks, roles, time and money visible — and the inner and relational tools that keep the people using them well.',
    frameworks: ['nvc', 'four-agreements', 'holacracy', 'ikigai', 'internal-family-systems', 'integral-theory', 'spiral-dynamics', 'enneagram'],
    links: [
      { label: 'Holons & HoloSphere', href: 'https://holons.io', icon: 'fa-circle-nodes' },
      { label: 'Lunations calendar', href: '/lunations', icon: 'fa-moon' },
      { label: 'Quests', href: '/quests.html', icon: 'fa-flag' },
      { label: 'Services', href: '/services', icon: 'fa-hands-holding-circle' },
      { label: 'Open Collective', href: 'https://opencollective.com/liminal', icon: 'fa-coins' },
      { label: 'Documentation', href: 'https://docs.liminalvillage.com/', icon: 'fa-book-open' },
    ],
  },
};

export const FRAMEWORKS = {
  'four-agreements': {
    title: 'The Four Agreements',
    origin: 'Don Miguel Ruiz · 1997',
    tagline: 'Four short promises to yourself that dissolve a lot of needless suffering.',
    body: 'A short book that draws on Toltec wisdom: be impeccable with your word, don’t take anything personally, don’t make assumptions, always do your best. In the village they are the simplest shared baseline for how we talk to each other.',
    links: [{ label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/The_Four_Agreements' }],
  },
  nvc: {
    title: 'Non-Violent Communication',
    origin: 'Marshall Rosenberg · 1960s onwards',
    tagline: 'Say what happened, what you feel, what you need, and what you ask for.',
    body: 'NVC separates observation from judgment and connects feelings to the needs underneath them, ending in a clear, doable request. It is how we try to voice tensions so the other person can actually hear them.',
    steps: ['Observation', 'Feeling', 'Need', 'Request'],
    links: [
      { label: 'Center for Nonviolent Communication', href: 'https://www.cnvc.org/' },
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Nonviolent_Communication' },
    ],
  },
  holacracy: {
    title: 'Holacracy (soft version)',
    origin: 'Brian Robertson · 2007',
    tagline: 'Authority lives in roles, and every tension is fuel for improving them.',
    body: 'Holacracy distributes authority to clearly defined roles instead of a hierarchy of people. We use a soft version: notice a tension, add a proposal rather than a complaint, and bring it to the right place — the person, the role or the circle.',
    links: [
      { label: 'holacracy.org', href: 'https://www.holacracy.org/' },
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Holacracy' },
    ],
  },
  'integral-theory': {
    title: 'Integral Theory',
    origin: 'Ken Wilber · 1970s onwards',
    tagline: 'A “theory of everything” that asks which perspectives are missing from the picture.',
    body: 'Its core model, AQAL, looks at anything from four perspectives — the individual’s inner life (I), behaviour (It), shared culture (We) and systems (Its). In practice it is a checklist: when something is stuck, which quadrant are we ignoring?',
    image: { src: '/images/frameworks/integral-aqal.png', alt: 'AQAL diagram: four quadrants I, It, We, They.' },
    page: '/frameworks#integral-theory',
    links: [{ label: 'Integral Life', href: 'https://integrallife.com/what-is-integral-approach/' }, { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Integral_theory' }],
  },
  'spiral-dynamics': {
    title: 'Spiral Dynamics',
    origin: 'Clare W. Graves · Don Beck & Chris Cowan · 1996',
    tagline: 'How value systems emerge, in people and whole societies, as life conditions change.',
    body: 'A sequence of value systems, each answering problems the previous one could not, from beige (survival) to turquoise (the whole). The colours describe ways of thinking, not kinds of people — most useful for translating between worldviews.',
    image: { src: '/images/frameworks/spiral-dynamics-levels.jpg', alt: 'The eight Spiral Dynamics colours from beige to turquoise.' },
    page: '/frameworks#spiral-dynamics',
    links: [{ label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Spiral_Dynamics' }],
  },
  ikigai: {
    title: 'Ikigai',
    origin: 'Japan · 生き甲斐 · “a reason for being”',
    tagline: 'Where what you love meets what the world needs.',
    body: 'Four questions — what you love, what you are good at, what the world needs, what you can be paid for. We use it as a conversation starter for the question every newcomer brings: what is mine to do here?',
    image: { src: '/images/frameworks/ikigai.svg', alt: 'Ikigai diagram of four overlapping circles.' },
    page: '/frameworks#ikigai',
    links: [{ label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Ikigai' }],
  },
  permaculture: {
    title: 'Permaculture',
    origin: 'Bill Mollison & David Holmgren · 1970s',
    tagline: 'Design that copies the patterns of natural ecosystems, guided by three ethics.',
    body: 'Earth Care, People Care and Fair Share, and twelve design principles that apply to gardens, buildings, economies and communities alike: little waste, many connections, more abundance over time.',
    image: { src: '/images/frameworks/permaculture-ethics.svg', alt: 'Three overlapping circles: Earth Care, People Care, Fair Share.' },
    page: '/frameworks#permaculture',
    links: [{ label: 'The 12 principles', href: 'https://permacultureprinciples.com/permaculture-principles/' }],
  },
  'internal-family-systems': {
    title: 'Internal Family Systems',
    origin: 'Richard C. Schwartz · 1980s',
    tagline: 'The mind as an inner family of parts, led by a calm, curious Self.',
    body: 'Managers, firefighters and exiles all try to protect you; the work is to listen to them from Self rather than fight them. In community it gives a shared language: “a part of me is angry” lands very differently from “I am angry with you”.',
    image: { src: '/images/frameworks/ifs-parts.svg', alt: 'The Self connected to managers, firefighters and exiles.' },
    page: '/frameworks#internal-family-systems',
    links: [{ label: 'IFS Institute', href: 'https://ifs-institute.com/' }],
  },
  enneagram: {
    title: 'Enneagram',
    origin: 'Oscar Ichazo & Claudio Naranjo · 1960s–70s',
    tagline: 'Nine patterns of attention and motivation.',
    body: 'Nine types, each organised around a core motivation and a blind spot. We hold it lightly — as a mirror for our own habits and for understanding why someone else reacts so differently, not as a box to put people in.',
    image: { src: '/images/frameworks/enneagram.svg', alt: 'The enneagram figure with nine points.' },
    page: '/frameworks#enneagram',
    links: [{ label: 'Enneagram Institute', href: 'https://www.enneagraminstitute.com/how-the-enneagram-system-works/' }],
  },
};
