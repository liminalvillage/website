// The content of the value streams page: the eight forms of capital, the
// money flows, ways to join a flow, and what the experiment learns from.
// Kept apart from the page so it can grow as the village learns.

export const CAPITALS = [
  {
    name: 'Social',
    tint: 'var(--rosehip-300)',
    what: 'Trust, relationships and the ability to act together.',
    flow: 'Lunations lived side by side, NVC and the Four Agreements, tensions met as opportunities, the ReGenerativa network of sister communities.',
    examples: 'Circles, shared meals, cross-site quests',
    exchange: [
      'Introduce a member to someone in another node who shares their quest',
      'Hold a listening circle or pair up as listening partners for a moonth',
      'Vouch for and welcome new guests, so trust is passed on rather than rebuilt',
    ],
  },
  {
    name: 'Material',
    tint: 'var(--bark-300)',
    what: 'Buildings, tools, infrastructure and the things we make.',
    flow: 'Three houses, caravans and tents, co-working spaces, the biolake and the open-source water purification, built and kept up by the people who stay.',
    examples: 'Construction days, shared tools, repairs',
    exchange: [
      'Lend tools and gear from a shared library instead of each buying their own',
      'Join build and repair days, giving hours in return for the spaces you use',
      'Gift what you no longer need to the village before you leave',
    ],
  },
  {
    name: 'Financial',
    tint: 'var(--ember-300)',
    what: 'Money and its equivalents: what lets the other seven be bought in from outside.',
    flow: 'Contributions for stays, supporters and members, sessions and courses, gifts and grants. Kept in service of the other forms, never the other way round.',
    examples: 'See the money flows below',
    exchange: [
      'Sliding-scale contributions: those who can give more make room for those who can give less',
      'Pool money together to fund a quest or a building, decided in the open',
      'Keep the budget visible on Open Collective, so everyone sees where money goes',
    ],
    money: true,
  },
  {
    name: 'Living',
    tint: 'var(--sprout-300)',
    what: 'Soil, water, plants, animals and the health of the land.',
    flow: 'Three hectares in the Tronto Valley tended with permaculture: the garden, the trees, the biolake and the life that returns to them.',
    examples: 'Garden, compost, seed saving, animals',
    exchange: [
      'Swap seeds and cuttings between members and nodes',
      'Take turns tending the garden, animals and water, and share the harvest',
      'Adopt a bed or a tree and care for it across lunations',
    ],
  },
  {
    name: 'Intellectual',
    tint: 'var(--olive-300)',
    what: 'Ideas, knowledge and code.',
    flow: 'The DNA, the frameworks, the documentation and the open-source tools (Holons, the HoloSphere, Hackalong), shared openly so any node can grow from them.',
    examples: 'Docs, frameworks, repositories, articles',
    exchange: [
      'Improve the docs, frameworks and code, and keep them openly licensed',
      'Give a skill-share talk during a lunation',
      'Pair up in Hackalongs so knowledge spreads as you build',
    ],
  },
  {
    name: 'Experiential',
    tint: 'var(--rust-300)',
    what: 'Skills and know-how that live in people and are learned by doing.',
    flow: 'Daily contribution hours, gifting an experience, Hackalongs and learning by building, cooking, gardening and facilitating together.',
    examples: 'Workshops, apprenticeship, Hackalongs',
    exchange: [
      'Gift an experience: teach or share something you love with the village',
      'Learn in pairs: an apprentice and an experienced hand for a moonth',
      'Trade hours of skill directly, time for time, without money',
    ],
  },
  {
    name: 'Spiritual',
    tint: 'var(--chestnut-300)',
    what: 'Inner growth, meaning and connection to something larger.',
    flow: 'The personal level of contribution: inner work, Internal Family Systems, ikigai and living by the rhythm of the moon.',
    examples: 'Practice, ceremony, reflection',
    exchange: [
      'Share a daily practice, such as morning meditation or silence',
      'Hold the new and full moon together as moments to pause and reflect',
      'Offer and receive support for inner work, with care and consent',
    ],
  },
  {
    name: 'Cultural',
    tint: 'var(--oat-500)',
    what: 'Shared stories, rituals, art and ways of living.',
    flow: 'Lunations as a calendar and a culture, the language of thresholds, the readings and films the village gathers around.',
    examples: 'Rituals, media, art, the moon calendar',
    exchange: [
      'Co-create the rituals that open and close each lunation',
      'Host storytelling evenings, and record the stories for the next guests',
      'Make art for the commons: murals, music, prints and films',
    ],
  },
];

// Ideas for the project's money flows. "today" marks what already exists.
export const MONEY = [
  {
    group: 'Stays and lunations',
    items: [
      { name: 'Contribution for a moonth', note: 'Guests arrive with the new moon and contribute towards their stay.', today: true },
      { name: 'Supporters on Open Collective', note: 'Monthly support through Open Collective, with a place in the lunations.', today: true },
      { name: 'Membership fees', note: 'Regular fees from members of the ReGenerativa association: a steady base beneath the other flows.' },
      { name: 'Caravans and tents in summer', note: 'Lighter, lower-cost stays for more people in the warm months.' },
      { name: 'Hosting other groups', note: 'The village as a venue for aligned teams, retreats and gatherings.' },
      { name: 'Hack retreats for aligned teams', note: 'A paid stay for a project team to hack together here, with a retreat designed around their project and the lunation.' },
    ],
  },
  {
    group: 'Retreats and courses',
    items: [
      { name: 'Themed retreats', note: 'One lunation, one theme: inner work, regenerative design, technology and nature.' },
      { name: 'Courses on the land', note: 'Permaculture, natural building, open-source water purification.' },
      { name: 'Online courses', note: 'The frameworks and the DNA taught to people who cannot travel.' },
      { name: 'Cooking classes', note: 'Seasonal cooking with what grows here and on the farms around the valley.' },
      { name: 'Facilitation training', note: 'NVC, holding circles, working with tensions.' },
    ],
  },
  {
    group: 'Knowledge and code',
    items: [
      { name: 'AI-ready knowledge for donors', note: 'The DNA, frameworks and docs as a curated knowledge pack for people\'s own AI, opened through GitHub access in return for a donation.' },
      { name: 'Open-source sponsorship', note: 'GitHub Sponsors and Open Collective for Holons, the HoloSphere and Hackalong.' },
      { name: 'A node starter kit', note: 'Guidance and setup for groups bootstrapping a new node in their own bioregion.' },
      { name: 'Hosted tools for communities', note: 'Holons and the HoloSphere run for other communities, for a contribution.' },
    ],
  },
  {
    group: 'Sessions and services',
    items: [
      { name: 'Villager sessions', note: 'Sessions booked with villagers on the services page.', today: true },
      { name: 'Community design and consulting', note: 'Governance, onboarding and protocols for other intentional communities.' },
      { name: 'Team offsites', note: 'Organisations spending a few days learning to collaborate differently.' },
    ],
  },
  {
    group: 'Gifts and media',
    items: [
      { name: 'General donations', note: 'Gifts to the ReGenerativa association, the village\'s legal entity, used wherever they are needed most.', today: true },
      { name: 'Earmarked donations', note: 'Gifts to the ReGenerativa association set aside for one project, such as the water system or a building, and reported on openly.' },
      { name: 'Project crowdfunding', note: 'Single, visible goals, such as a building or the water system.' },
      { name: 'Talks, writing and prints', note: 'Talks, articles and prints of the concept art.' },
    ],
  },
  {
    group: 'Mission-aligned grants to explore',
    items: [
      { name: 'Erasmus+', note: 'European funding for adult learning and youth exchanges: courses, residencies and learning stays.' },
      { name: 'European Solidarity Corps', note: 'Volunteering placements for young people, a fit for longer stays on the land.' },
      { name: 'LIFE Programme', note: 'The EU programme for environment and climate action: water, soil and biodiversity work.' },
      { name: 'NLnet and NGI Zero', note: 'Grants for open-source internet technology, a fit for Holons and the HoloSphere.' },
      { name: 'Gitcoin Grants', note: 'Community funding rounds for open-source public goods.' },
      { name: 'Rural development and LEADER', note: 'Le Marche\'s rural development funds and local action groups, for the farm and the valley.' },
      { name: 'Fondazione Carisap', note: 'The Ascoli Piceno foundation that supports local social and cultural projects.' },
    ],
  },
];

// Members and people from outside often ask how they can take part in the
// project's money flows with their own work. One entry per kind of person:
// what they could bring, how it would run with the village, and what flows
// back to them. Shares are always agreed openly beforehand.
export const JOIN = [
  {
    title: 'Body and breath guides',
    who: 'Yoga and movement teachers',
    bring: 'Morning classes for guests, or a yoga retreat of your own.',
    how: 'Teach during a lunation, or hold a retreat with the village as host. Guests book through you or through the services page.',
    back: 'Space, guests to teach, a stay in the village, and a share of each retreat.',
  },
  {
    title: 'Code weavers',
    who: 'Developers',
    bring: 'Code for Holons, the HoloSphere, Hackalong or the website.',
    how: 'Pick up a quest or bounty, build in a Hackalong, help package the knowledge for people\'s own AI, or bring your whole team for a hack retreat designed around your project.',
    back: 'Part of the sponsorship and donations your work brings in, and a stay while you build.',
  },
  {
    title: 'Keepers of craft',
    who: 'Specialist teachers',
    bring: 'Permaculture, fermentation, natural building, herbalism, beekeeping and other crafts.',
    how: 'Run a course on the land, with the village providing the space, the meals and the guests.',
    back: 'Course fees shared by an agreed split, students who arrive already curious, and a living classroom.',
  },
  {
    title: 'Makers of good things',
    who: 'Small makers and businesses',
    bring: 'A print shop, fermented food and drinks, ceramics, crafts.',
    how: 'Make with what grows here, sell at the village and to guests, or produce co-branded goods such as prints of the concept art.',
    back: 'A place to make and sell, and a share of what is sold; the village keeps its share for the commons.',
  },
  {
    title: 'Cooks and growers',
    who: 'Cooks, chefs and local farmers',
    bring: 'Seasonal cooking, community meals and produce from the farms of the valley.',
    how: 'Cook for a lunation or a retreat, teach a cooking class with what grows here, or bring your produce to the village table and its guests.',
    back: 'A kitchen and people to cook for, a fair price for produce, and a share of classes and meals.',
  },
  {
    title: 'Space holders',
    who: 'Facilitators, coaches and therapists',
    bring: 'Circles, coaching, NVC, Internal Family Systems and other inner work.',
    how: 'Offer sessions on the services page, or hold a themed lunation with the village.',
    back: 'Session fees go to you, with a voluntary gift to the village if you wish.',
  },
  {
    title: 'Storytellers and artists',
    who: 'Artists and media makers',
    bring: 'Films, photography, music, writing and illustration.',
    how: 'Tell the village\'s story, document lunations, or make work that can be printed, screened or published.',
    back: 'A stay to create in, credit, and a share of anything that is sold or funded.',
  },
];

// This is an open-source experiment: how it learns in the open, and the
// writing, tools and communities it can learn from
// The everyday ways villagers give their days, from the visitor form, with
// the animals added
export const DAYS = [
  'Anchoring the kitchen',
  'Cooking',
  'Tending the spaces and household',
  'Caring for the animals and chickens',
  'Gardening',
  'Building and maintenance',
  'Child care',
  'Crafting and decoration',
  'Body and mind practice',
  'Group facilitation',
  'Tech and the website',
];

export const PRACTICE = [
  { name: 'A short story every moon', note: 'What worked, what did not and what we changed, written down at the end of each lunation and shared.' },
  { name: 'Money you can see', note: 'What comes in and what goes out, open to everyone on Open Collective.' },
  { name: 'Small numbers, real stories', note: 'How many guests came, how much food we grew, how many workshops we held, each with the story behind it.' },
  { name: 'An honest look each year', note: 'Once a year we ask again where we stand, and share what moved as a story rather than a scorecard.' },
  { name: 'Open for anyone to reuse', note: 'This page and what we learn are open source, for any community to copy and adapt.' },
];

export const LEARN = [
  {
    group: 'Frameworks',
    items: [
      { name: '8 Forms of Capital', by: 'Ethan Roland and Gregory Landua, 2011', note: 'The lens this page uses: wealth as eight living, connected forms of capital.' },
      { name: 'An Introduction to Game B', by: 'Game B wiki', href: 'https://www.gameb.wiki/index.php?title=An_Introduction_to_Game_B', note: 'The search for a positive-sum, life-giving game.' },
      { name: 'Doughnut Economics', by: 'Kate Raworth, 2017', href: 'https://doughnuteconomics.org', note: 'Meeting everyone\'s needs within the means of the planet, with free tools for groups.' },
    ],
  },
  {
    group: 'Commons and governance',
    items: [
      { name: 'Governing the Commons', by: 'Elinor Ostrom, 1990', note: 'Eight design principles for shared resources that last: a checklist for shared land and a shared purse.' },
      { name: 'Free, Fair and Alive', by: 'David Bollier and Silke Helfrich, 2019', note: 'Patterns of commoning, close in spirit to the village\'s pattern language.' },
      { name: 'P2P Foundation', by: 'Michel Bauwens and others', href: 'https://p2pfoundation.net', note: 'Cosmo-local production: knowledge shared worldwide, things made locally.' },
    ],
  },
  {
    group: 'Money and exchange',
    items: [
      { name: 'Open Collective', by: 'Open budgets', href: 'https://opencollective.com/liminal', note: 'Where the village already shows its budget; every contribution and expense in the open.' },
      { name: 'Cobudget', by: 'Collaborative budgeting', href: 'https://cobudget.com', note: 'A group decides together how a shared pot is spent.' },
      { name: 'The Green Bottle sliding scale', by: 'Alexis J. Cunningfolk', note: 'Pay what fits your means, so those with more make room for those with less.' },
      { name: 'Sardex', by: 'Sardinia, Italy', note: 'A mutual-credit network between local businesses: a model for exchange between nodes and makers.' },
      { name: 'Time banking', by: 'Edgar Cahn', note: 'An hour given is an hour received, whatever the skill.' },
      { name: 'Sacred Economics', by: 'Charles Eisenstein, 2011', note: 'Money and the gift economy, from the village\'s onboarding playlist.' },
    ],
  },
  {
    group: 'Communities to learn from',
    items: [
      { name: 'Enspiral', by: 'Aotearoa New Zealand', note: 'A network of purpose-driven people who open-sourced their handbook and grew tools like Loomio and Cobudget.' },
      { name: 'Global Ecovillage Network', by: 'Ecovillage Design Education', href: 'https://ecovillage.org', note: 'A curriculum that includes the economic side of community life.' },
      { name: 'Damanhur', by: 'Piedmont, Italy', note: 'A long-lived community in Italy with its own complementary currency.' },
    ],
  },
];

export const TINTS = Object.fromEntries(CAPITALS.map((c) => [c.name, c.tint]));

// The pattern languages behind the village's experiments, drawn in one
// shared style (scripts/concept-art.py)
export const PATTERNS = [
  { file: 'spiral', name: 'Spiral Dynamics', note: 'Values unfold in stages, each colour a way of seeing the world. Every stage has its place in the spiral.' },
  { file: 'holonic-architecture', name: 'Holonic architecture', note: 'Wholes made of wholes: each person, home and node complete in itself and part of something larger.' },
  { file: 'forest-pattern-language', name: 'The pattern language of forests', note: 'Canopy, understorey, shrubs, herbs, climbers and roots: layers that share light and soil, as a village shares its life.' },
  { file: 'ikigai', name: 'Ikigai', note: 'Where what you love, what you are good at, what the world needs and what sustains you meet.' },
  { file: 'internal-family-systems', name: 'Internal Family Systems', note: 'The Self and its many parts, met with curiosity and care.' },
  { file: 'fractals', name: 'Fractals', note: 'The same pattern at every scale, from a leaf to a village to a network of villages.' },
  { file: 'mycelium-networks', name: 'Mycelium networks', note: 'Connection through the soil: many lives sharing nutrients and signals, as nodes share what they learn.' },
  { file: 'game-b', name: 'Game B', note: 'From a board of separate, competing squares to a circle where everyone wins together.' },
];
