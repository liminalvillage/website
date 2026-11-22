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
  lineage: {
    blurb: 'A living constellation of ancestors, visionaries and guides, spiritual and intellectual, rather than a fixed pantheon. They inspire our decisions; they do not make them. Honor the wisdom of the past, question the assumptions of the present, and embody the possibilities of the future.',
    links: [
      { label: 'Frameworks we think with', href: '/frameworks', icon: 'fa-map' },
      { label: 'Readings & media', href: '/media', icon: 'fa-book' },
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
    guide: 'rosenberg',
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
    guide: 'wilber',
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
    guide: 'holmgren',
    title: 'Permaculture',
    origin: 'Bill Mollison & David Holmgren · 1970s',
    tagline: 'Design that copies the patterns of natural ecosystems, guided by three ethics.',
    body: 'Earth Care, People Care and Fair Share, and twelve design principles that apply to gardens, buildings, economies and communities alike: little waste, many connections, more abundance over time.',
    image: { src: '/images/frameworks/permaculture-ethics.svg', alt: 'Three overlapping circles: Earth Care, People Care, Fair Share.' },
    page: '/frameworks#permaculture',
    links: [{ label: 'The 12 principles', href: 'https://permacultureprinciples.com/permaculture-principles/' }],
  },
  'internal-family-systems': {
    guide: 'schwartz',
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

// Gene 03 · Lineage: the Council of Guides. No gurus: each guide comes with a
// question we put to them. Where a guide appears on /dna (dimensions, thresholds,
// frameworks) is read from the page itself, not listed here.
const wiki = (page) => ({ label: 'Wikipedia', href: `https://en.wikipedia.org/wiki/${page}` });

export const GUIDES = {
  watts: {
    name: 'Alan Watts', dimension: 'Consciousness', movement: 'Remembering',
    note: 'Nonduality, interconnectedness and play: seeing through the illusion that we are separate from each other and from the world.',
    question: 'Can insight into oneness carry the daily discipline that community life asks for?',
    links: [{ label: 'alanwatts.org', href: 'https://alanwatts.org/' }, wiki('Alan_Watts')],
  },
  mckenna: {
    name: 'Terence McKenna', dimension: 'Consciousness', movement: 'Reimagining',
    note: 'Consciousness, imagination and cultural transformation; a lifelong invitation to question established reality.',
    question: 'Where does visionary speculation need to meet evidence?',
    links: [wiki('Terence_McKenna')],
  },
  macy: {
    name: 'Joanna Macy', dimension: 'Consciousness', work: 'Active Hope · The Work That Reconnects',
    note: 'The Great Turning from an extractive to a life-sustaining civilization, joining spirituality, systems thinking, ecological grief and collective action.',
    question: 'How do we hold grief for the world and still act at the speed the moment needs?',
    links: [{ label: 'Work That Reconnects', href: 'https://workthatreconnects.org/' }, wiki('Joanna_Macy')],
  },
  ostrom: {
    name: 'Elinor Ostrom', dimension: 'Commons', movement: 'Regenerating', work: 'Governing the Commons',
    note: 'Showed that communities can govern shared resources without either the state or the market: collective rules, shared responsibility, polycentric organisation.',
    question: 'Her design principles come from long-standing local communities. Do they hold for a fluid, temporary one like ours?',
    links: [wiki('Elinor_Ostrom')],
  },
  helfrich: {
    name: 'Silke Helfrich', dimension: 'Commons', work: 'Free, Fair and Alive (with David Bollier)',
    note: "Took Ostrom's research into everyday commoning: how people share, care, decide and build relationships around resources. Close to our contribution agreements and digital commons.",
    question: 'How far can commoning scale beyond people who know each other?',
    links: [{ label: 'freefairandalive.org', href: 'https://freefairandalive.org/' }, wiki('Silke_Helfrich')],
  },
  rosenberg: {
    name: 'Marshall Rosenberg', dimension: 'Commons', work: 'Nonviolent Communication',
    note: 'Needs-based communication, conflict transformation and agreements without coercion: what lets independent people live and work together without domination or avoidance.',
    question: 'When does a communication method become a way to avoid conflict instead of meeting it?',
    links: [{ label: 'Center for Nonviolent Communication', href: 'https://www.cnvc.org/' }, wiki('Marshall_Rosenberg')],
  },
  meadows: {
    name: 'Donella Meadows', dimension: 'Systems', movement: 'Regenerating', work: 'Thinking in Systems · Leverage Points',
    note: 'How feedback loops, incentives, structures and paradigms shape behaviour. Essential for a network that learns and evolves instead of depending on its founders.',
    question: 'Who decides which leverage points to pull, and on whose behalf?',
    links: [{ label: 'The Donella Meadows Project', href: 'https://donellameadows.org/' }, wiki('Donella_Meadows')],
  },
  bateson: {
    name: 'Gregory Bateson', dimension: 'Systems', work: 'Steps to an Ecology of Mind',
    note: 'Relationship, communication, feedback and learning: the pattern that connects living systems. A bridge between Watts, Meadows, ecology and cybernetics.',
    question: 'How do we turn an ecology of mind into everyday decisions?',
    links: [wiki('Gregory_Bateson')],
  },
  beer: {
    name: 'Stafford Beer', dimension: 'Systems', work: 'Brain of the Firm · The Heart of Enterprise',
    note: 'The Viable System Model: how autonomous units stay coordinated within a larger whole. A map for independent hubs connected through the Holosphere.',
    question: 'Cybernetics grew up in firms and governments. Can it serve autonomy rather than control?',
    links: [wiki('Stafford_Beer')],
  },
  fuller: {
    name: 'Buckminster Fuller', dimension: 'Design & technology', movement: 'Reimagining',
    note: 'Whole-systems thinking, doing more with less, and designing a world that works for everyone.',
    question: 'Does designing from the whole system down leave room for local wisdom?',
    links: [{ label: 'Buckminster Fuller Institute', href: 'https://www.bfi.org/' }, wiki('Buckminster_Fuller')],
  },
  fresco: {
    name: 'Jacque Fresco', dimension: 'Design & technology', movement: 'Reimagining',
    note: 'Technological abundance, post-scarcity economics and the Resource-Based Economy that first inspired Liminal Village.',
    question: 'Can a fully designed, technology-run abundance leave space for local autonomy and dissent?',
    links: [{ label: 'The Venus Project', href: 'https://www.thevenusproject.com/' }, wiki('Jacque_Fresco')],
  },
  alexander: {
    name: 'Christopher Alexander', dimension: 'Design & technology', movement: 'Regenerating', work: 'A Pattern Language · The Nature of Order',
    note: 'How buildings, gardens, paths and settlements can feel alive, support human relationships and grow organically. His patterns also shaped software design.',
    question: 'Who gets to say which patterns feel alive?',
    links: [{ label: 'patternlanguage.com', href: 'https://www.patternlanguage.com/' }, wiki('Christopher_Alexander')],
  },
  holmgren: {
    name: 'David Holmgren', dimension: 'Ecology', movement: 'Regenerating', work: 'Permaculture: Principles and Pathways Beyond Sustainability',
    note: 'Observe patterns, capture energy, close loops, integrate rather than segregate, and let natural systems carry more of the work.',
    question: 'Can principles that grow a garden also grow a social system?',
    links: [{ label: 'Permaculture Principles', href: 'https://permacultureprinciples.com/' }, wiki('David_Holmgren')],
  },
  kimmerer: {
    name: 'Robin Wall Kimmerer', dimension: 'Ecology', movement: 'Remembering', work: 'Braiding Sweetgrass',
    note: 'The language of gift, gratitude and reciprocity: not only taking from a place, but belonging to it and giving back.',
    question: 'How do newcomers to a land practise reciprocity without appropriating Indigenous traditions?',
    links: [wiki('Robin_Wall_Kimmerer')],
  },
  wahl: {
    name: 'Daniel Christian Wahl', dimension: 'Ecology', work: 'Designing Regenerative Cultures',
    note: 'Regeneration as place-based transformation of ecology, culture, economy, technology and relationships. Perhaps the closest synthesis of what we are attempting.',
    question: 'What does regeneration look like on an ordinary Tuesday, not only in a framework?',
    links: [{ label: 'danielchristianwahl.com', href: 'https://www.danielchristianwahl.com/' }],
  },
  schwartz: {
    name: 'Richard Schwartz', dimension: 'Inner & social change', movement: 'Regenerating', work: 'No Bad Parts · Internal Family Systems',
    note: 'Relating with compassion to the conflicting parts within us. A complement to Ostrom: can Self-led people make for healthier collective governance?',
    question: 'Can a therapeutic model be used safely in community, outside the therapy room?',
    links: [{ label: 'IFS Institute', href: 'https://ifs-institute.com/' }],
  },
  brown: {
    name: 'adrienne maree brown', dimension: 'Inner & social change', work: 'Emergent Strategy',
    note: 'How small-scale relationships and interactions shape larger social patterns. For a network that grows through experiment, adaptation and decentralisation.',
    question: 'How do we keep emergence from becoming an excuse to avoid structure?',
    links: [{ label: 'adriennemareebrown.net', href: 'https://adriennemareebrown.net/' }],
  },
  wilber: {
    name: 'Ken Wilber', dimension: 'Inner & social change', work: 'Integral Theory',
    note: 'Holarchies, developmental perspectives and integrating many ways of knowing.',
    question: 'Do developmental maps risk ranking people instead of understanding them?',
    links: [wiki('Ken_Wilber')],
  },
  // second circle
  koestler: {
    name: 'Arthur Koestler', dimension: 'Second circle',
    note: 'Coined the holon: everything is at once a whole and a part of a larger whole. The root of the name Holons.',
    links: [wiki('Holon_(philosophy)')],
  },
  'thich-nhat-hanh': {
    name: 'Thich Nhat Hanh', dimension: 'Second circle', movement: 'Remembering',
    note: 'Interbeing, mindfulness, compassion and spiritual practice lived in community.',
    links: [{ label: 'Plum Village', href: 'https://plumvillage.org/' }, wiki('Thich_Nhat_Hanh')],
  },
  illich: {
    name: 'Ivan Illich', dimension: 'Second circle', movement: 'Reimagining', work: 'Tools for Conviviality',
    note: 'Convivial tools, autonomy, and institutions that serve human flourishing rather than the other way round.',
    links: [wiki('Ivan_Illich')],
  },
  schumacher: {
    name: 'E. F. Schumacher', dimension: 'Second circle', work: 'Small Is Beautiful',
    note: 'Human-scale economies and appropriate technology: economics as if people mattered.',
    links: [wiki('E._F._Schumacher')],
  },
  raworth: {
    name: 'Kate Raworth', dimension: 'Second circle', work: 'Doughnut Economics',
    note: 'Meeting everyone’s needs within the means of the planet: the safe and just space between a social foundation and an ecological ceiling.',
    links: [{ label: 'Doughnut Economics Action Lab', href: 'https://doughnuteconomics.org/' }],
  },
  croft: {
    name: 'John Croft', dimension: 'Second circle', work: 'Dragon Dreaming',
    note: 'Collective projects in four phases: dreaming, planning, doing and celebrating.',
    links: [{ label: 'Dragon Dreaming', href: 'https://dragondreaming.org/' }],
  },
  steiner: {
    name: 'Rudolf Steiner', dimension: 'Second circle',
    note: 'Anthroposophical approaches to education, agriculture and human development, which we engage with critically.',
    question: 'Which of his practices hold up to evidence, and which do not?',
    links: [wiki('Rudolf_Steiner')],
  },
};
