/**
 * Seed script: pushes quest data into Holosphere (Holons app, 'quests' lens)
 * Run with: node seed-quests.mjs
 *
 * Schema is based on holonsbot quest.json, extended with portal-specific fields.
 */
import HoloSphere from '/Users/robertovalenti/Projects/holosphere/holosphere.js';

// The bot resolves chatId 235114395 to this pubkey via KeyManager
const HOLON_ID = 'e1e76079351820597b3f48fd3a8bf9bbfefd3b5494c754fd44647c826a8beb76';
const APP_NAME = 'Holons';

// Extended quest schema — superset of holonsbot quest.json
// All bot fields preserved, portal fields added, additionalProperties: true
const questSchema = {
  "title": "Quest Schema",
  "description": "Schema for quest/task objects — compatible with HolonsBot and Quest Portal",
  "type": "object",
  "required": ["id", "title", "status"],
  "properties": {
    // ── Core identity (bot + portal) ──
    "id":                { "type": "string", "description": "Unique identifier for the quest" },
    "version":           { "type": "string", "description": "Schema version", "default": "0.2" },
    "title":             { "type": "string", "description": "Title of the quest" },

    // ── Holon context (bot) ──
    "chat":              { "type": "string", "description": "Holon ID where the quest belongs", "default": "" },
    "message_thread_id": { "type": "number", "description": "Message thread ID for topic messages", "default": 0 },
    "initiator":         { "type": "string", "description": "Username of the quest initiator" },

    // ── Description (bot uses 'description', portal adds 'shortDesc') ──
    "description":       { "type": "string", "description": "Detailed description of the quest", "default": "" },
    "shortDesc":         { "type": "string", "description": "Short description for card view", "default": "" },

    // ── Media ──
    "picture":           { "type": "string", "description": "URL or path to quest image", "default": "" },
    "document":          { "type": "string", "description": "Associated document path or URL", "default": "" },

    // ── Classification ──
    "type":     { "type": "string", "description": "Type of quest", "enum": ["task", "event", "proposal", "request", "offer", "any"] },
    "status":   { "type": "string", "description": "Current status", "enum": ["ongoing", "completed", "cancelled", "scheduled"], "default": "ongoing" },
    "category": { "type": "string", "description": "Quest category", "default": "" },

    // ── Scheduling ──
    "date":      { "type": "number", "description": "Creation timestamp" },
    "when":      { "type": "string", "description": "When the quest is scheduled", "default": "" },
    "until":     { "type": "string", "description": "End time/date of quest", "default": "" },
    "completed": { "type": "string", "description": "Completion timestamp or note", "default": "" },
    "duration":  { "type": "string", "description": "Expected duration (e.g. '3 months', 'Ongoing')", "default": "" },

    // ── Location ──
    "where": {
      "type": "object",
      "description": "Location coordinates",
      "properties": {
        "latitude":  { "type": "string", "default": "" },
        "longitude": { "type": "string", "default": "" }
      }
    },

    // ── People ──
    "participants":  { "type": "array", "description": "List of participants", "items": { "type": "string" }, "default": [] },
    "appreciation":  { "type": "array", "description": "Appreciation/feedback", "items": { "type": "string" }, "default": [] },
    "stoppers":      { "type": "array", "description": "Obstacles or blockers", "items": { "type": "string" }, "default": [] },
    "dependencies":  { "type": "array", "description": "Quest dependencies", "items": { "type": "string" }, "default": [] },

    // ── Recurrence ──
    "frequency":       { "type": "string", "description": "Recurring frequency pattern", "default": "" },
    "recurringTaskId": { "type": "string", "description": "ID for recurring task reference", "default": "" },

    // ── Tracking ──
    "timeTracking":  { "type": "object", "description": "Time tracking data", "additionalProperties": true, "default": {} },
    "checklistId":   { "type": "string", "description": "Associated checklist ID", "default": "" },
    "reminderId":    { "type": "string", "description": "Associated reminder ID", "default": "" },
    "progress":      { "type": "number", "minimum": 0, "maximum": 100, "description": "Completion percentage", "default": 0 },

    // ── Holosphere ──
    "activeHolograms": { "type": "array", "description": "Active hologram references", "items": { "type": "object" }, "default": [] },

    // ── Portal-specific extensions ──
    "icon":     { "type": "string", "description": "Font Awesome icon class (e.g. 'fa-leaf')", "default": "" },
    "color":    { "type": "string", "description": "Hex color for quest theme (e.g. '#4a9d5f')", "default": "" },
    "skills":   { "type": "array", "description": "Skills needed for this quest", "items": { "type": "string" }, "default": [] },
    "tools":    { "type": "string", "description": "Tools provided and needed", "default": "" },
    "exchange": { "type": "string", "description": "Value exchange model (e.g. 'Funded action', 'Stay + food')", "default": "" },
    "team": {
      "type": "object",
      "description": "Team composition",
      "properties": {
        "current": { "type": "number", "description": "Current team members", "default": 0 },
        "needed":  { "type": "number", "description": "Total team members needed", "default": 0 }
      }
    },
    "budget": {
      "type": "array",
      "description": "Budget line items",
      "items": {
        "type": "object",
        "properties": {
          "label":  { "type": "string" },
          "amount": { "type": "number" }
        }
      },
      "default": []
    },
    "total": { "type": "number", "description": "Total budget in EUR", "default": 0 }
  },
  "additionalProperties": true
};

// Seed quests using the unified schema
const quests = [
  {
    id: "quest-academy-terzo-settore",
    version: "0.2",
    title: "Academy per l'innovazione nel Terzo Settore",
    description: "The resources cover the design and facilitation of the Academy training modules, including workshops on collaborative governance and operational tools. Costs include content preparation, delivery, and participant support. Residual expenses cover minimal logistics and space usage.",
    shortDesc: "Designing and facilitating training modules on collaborative governance and operational tools for the third sector.",
    picture: "/images/P1120531-500x99999.jpeg",
    icon: "fa-graduation-cap",
    color: "#D6A15B",
    type: "task",
    status: "ongoing",
    date: Date.now(),
    when: "",
    until: "",
    completed: "",
    where: { latitude: "", longitude: "" },
    initiator: "",
    participants: [],
    appreciation: [],
    stoppers: [],
    dependencies: [],
    skills: ["Facilitation", "Governance design", "Workshop delivery"],
    duration: "3 months",
    tools: "Provided: space, materials. Bring: laptop",
    exchange: "Funded action",
    progress: 15,
    team: { current: 1, needed: 3 },
    budget: [
      { label: "Prestazioni professionali di terzi", amount: 2500 },
      { label: "Materiale di consumo", amount: 200 },
      { label: "Altre spese", amount: 300 }
    ],
    total: 3000,
    category: "training"
  },
  {
    id: "quest-benessere-leadership",
    version: "0.2",
    title: "Benessere organizzativo e leadership partecipativa",
    description: "This action involves group facilitation and organizational coaching on relational dynamics, distributed leadership, and team wellbeing. Costs are mainly tied to specialized facilitation expertise, with support materials and operational tools used during the sessions.",
    shortDesc: "Group facilitation and organizational support on relational dynamics, distributed leadership, and team wellbeing.",
    picture: "/images/P1120438-500x99999.jpeg",
    icon: "fa-people-group",
    color: "#7B9E6B",
    type: "task",
    status: "ongoing",
    date: Date.now(),
    when: "",
    until: "",
    completed: "",
    where: { latitude: "", longitude: "" },
    initiator: "",
    participants: [],
    appreciation: [],
    stoppers: [],
    dependencies: [],
    skills: ["Facilitation", "Conflict resolution", "Coaching"],
    duration: "Ongoing",
    tools: "Provided: facilitation toolkit, spaces",
    exchange: "Funded action",
    progress: 10,
    team: { current: 1, needed: 2 },
    budget: [
      { label: "Prestazioni professionali di terzi", amount: 2100 },
      { label: "Materiale di consumo", amount: 200 },
      { label: "Altre spese", amount: 200 }
    ],
    total: 2500,
    category: "wellbeing"
  },
  {
    id: "quest-repair-cafe",
    version: "0.2",
    title: "Creazione rete Repair Cafe",
    description: "ReGenerativa contributes to defining the operational model and providing technical-organizational support for launching local activities. Costs include specialized consultancy, materials for practical activities, and small instrumental goods needed to set up the spaces.",
    shortDesc: "Building the operational model and technical-organizational support for launching local Repair Cafe activities.",
    picture: "/images/P1130028-500x99999.jpg",
    icon: "fa-screwdriver-wrench",
    color: "#C27D4E",
    type: "task",
    status: "ongoing",
    date: Date.now(),
    when: "",
    until: "",
    completed: "",
    where: { latitude: "", longitude: "" },
    initiator: "",
    participants: [],
    appreciation: [],
    stoppers: [],
    dependencies: [],
    skills: ["Repair skills", "Community organizing", "Technical setup"],
    duration: "4 months",
    tools: "Provided: space, basic tools. Needed: specialized repair tools",
    exchange: "Funded action + community access",
    progress: 5,
    team: { current: 0, needed: 4 },
    budget: [
      { label: "Prestazioni professionali di terzi", amount: 1200 },
      { label: "Materiale di consumo", amount: 300 },
      { label: "Beni strumentali", amount: 500 }
    ],
    total: 2000,
    category: "circular-economy"
  },
  {
    id: "quest-green-volunteering",
    version: "0.2",
    title: "Green Volunteering",
    description: "Resources are dedicated to the listening and needs analysis phase of local communities (interviews, data collection, synthesis) and to facilitating volunteering activities. This action ensures that interventions are designed from real needs and encourages active participant involvement.",
    shortDesc: "Listening and needs analysis of local communities, facilitating volunteering activities grounded in real needs.",
    picture: "/images/P1120483-500x99999.jpeg",
    icon: "fa-leaf",
    color: "#4a9d5f",
    type: "task",
    status: "ongoing",
    date: Date.now(),
    when: "",
    until: "",
    completed: "",
    where: { latitude: "", longitude: "" },
    initiator: "",
    participants: [],
    appreciation: [],
    stoppers: [],
    dependencies: [],
    skills: ["Research", "Interviewing", "Community engagement"],
    duration: "2 months",
    tools: "Provided: research framework, local contacts",
    exchange: "Funded action + stay",
    progress: 20,
    team: { current: 2, needed: 5 },
    budget: [
      { label: "Prestazioni professionali di terzi", amount: 1200 },
      { label: "Materiale di consumo", amount: 300 }
    ],
    total: 1500,
    category: "volunteering"
  },
  {
    id: "quest-promozione-buone-pratiche",
    version: "0.2",
    title: "Promozione e scambio buone pratiche",
    description: "This action covers documenting activities, systematizing good practices, and supporting their dissemination. Costs cover content production, communication support, and result-sharing activities within the network and externally.",
    shortDesc: "Documenting activities, systematizing good practices, and supporting their dissemination within and beyond the network.",
    picture: "/images/P1120415-500x99999.jpeg",
    icon: "fa-bullhorn",
    color: "#8B6F5D",
    type: "task",
    status: "ongoing",
    date: Date.now(),
    when: "",
    until: "",
    completed: "",
    where: { latitude: "", longitude: "" },
    initiator: "",
    participants: [],
    appreciation: [],
    stoppers: [],
    dependencies: [],
    skills: ["Content creation", "Documentation", "Communication"],
    duration: "Ongoing",
    tools: "Provided: brand assets, channels",
    exchange: "Funded action",
    progress: 30,
    team: { current: 1, needed: 2 },
    budget: [
      { label: "Prestazioni professionali di terzi", amount: 1400 },
      { label: "Promozione e comunicazione", amount: 700 },
      { label: "Altre spese", amount: 400 }
    ],
    total: 2500,
    category: "communication"
  }
];

async function seed() {
  console.log('Initializing HoloSphere...');
  const holosphere = new HoloSphere(APP_NAME);

  await new Promise(r => setTimeout(r, 3000));

  console.log('Setting unified quest schema...');
  await holosphere.setSchema('quests', questSchema);
  console.log('Schema set.');

  for (const quest of quests) {
    console.log(`Putting quest: ${quest.title}...`);
    const result = await holosphere.put(HOLON_ID, 'quests', quest);
    console.log(`  -> success: ${result?.success}, key: ${result?.pathKey}`);
  }

  // Save quest index/manifest
  const manifest = {
    id: '_quest_index',
    ids: quests.map(q => q.id),
    updated: Date.now()
  };
  console.log('\nSaving quest manifest...');
  await holosphere.put(HOLON_ID, 'quests', manifest);
  console.log(`Manifest saved with ${manifest.ids.length} quest IDs.`);

  console.log('\nWaiting for GunDB sync...');
  await new Promise(r => setTimeout(r, 5000));

  console.log('Verifying...');
  // Verify manifest
  const m = await holosphere.get(HOLON_ID, 'quests', '_quest_index');
  console.log(`  Manifest: ${m ? m.ids?.length + ' IDs' : 'NOT FOUND'}`);
  // Verify quests
  for (const quest of quests) {
    const q = await holosphere.get(HOLON_ID, 'quests', quest.id);
    console.log(`  ${q ? '✓' : '✗'} ${quest.id} — ${q?.title || 'NOT FOUND'}`);
  }

  console.log('\nDone!');
  await holosphere.close();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
