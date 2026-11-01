// The sector pages of rigenerativa.it, one per subdomain (edilizia.rigenerativa.it, …).
// Each sector gathers one or more of the 15 activity areas of the oggetto sociale
// (art. 4 of the atto costitutivo) shown in Attivita.svelte.
import Hammer from '@lucide/svelte/icons/hammer';
import Wheat from '@lucide/svelte/icons/wheat';
import Droplets from '@lucide/svelte/icons/droplets';
import Tent from '@lucide/svelte/icons/tent';
import Cpu from '@lucide/svelte/icons/cpu';
import Scale from '@lucide/svelte/icons/scale';
import GraduationCap from '@lucide/svelte/icons/graduation-cap';
import Hexagon from '@lucide/svelte/icons/hexagon';

export const settori = [
  {
    slug: 'edilizia',
    name: 'Edilizia',
    icon: Hammer,
    image: '/images/regenerativa/site-refactory-2.jpeg',
    title: ['Costruire con il luogo,', 'non <em>contro</em> di esso'],
    tagline:
      'Bioedilizia, restauro e recupero adattivo di edifici civili, industriali e rurali: un unico interlocutore dal progetto bioclimatico al cantiere, fino alla gestione energetica.',
    meta: 'Bioedilizia, architettura bioclimatica, restauro e recupero adattivo, General Contractor, fotovoltaico off-grid ed efficienza energetica.',
    lead:
      'Ogni edificio dismesso è una riserva di materia, energia e memoria. Lo leggiamo prima di toccarlo: orientamento, clima, acqua, materiali che può restituire. Poi lo trasformiamo in un luogo che consuma poco, produce energia e si lascia abitare.',
    principles: [
      { title: 'Recuperare prima di costruire', text: 'Il recupero adattivo conserva struttura, carbonio incorporato e identità del luogo. Il nuovo arriva solo dove serve.' },
      { title: 'Materiali naturali e di recupero', text: 'Legno, calce, terra cruda, fibre vegetali e materiali riciclati, tracciati lungo tutto il loro ciclo di vita.' },
      { title: 'Energia e acqua in casa', text: "Fotovoltaico con accumulo, sistemi off-grid, biolaghi e fitodepurazione: l'edificio come piccola infrastruttura." },
    ],
    services: [
      { title: 'General Contractor', text: 'Gestione integrata del cantiere, dalla progettazione al collaudo, con un solo interlocutore per committenti privati ed enti.' },
      { title: 'Bioedilizia e architettura bioclimatica', text: 'Progetti che lavorano con sole, ventilazione naturale e inerzia termica, e con materiali sani e traspiranti.' },
      { title: 'Restauro e recupero adattivo', text: 'Nuove funzioni per edifici civili e industriali, casali, borghi e aree dismesse, nel rispetto del loro carattere.' },
      { title: 'Energia off-grid ed efficienza (ESCO)', text: 'Fotovoltaico e accumulo, riqualificazione energetica, contratti di rendimento energetico come ESCO.' },
      { title: 'Biolaghi e fitodepurazione', text: "Depurazione naturale delle acque reflue e bacini balneabili senza cloro, integrati nel paesaggio." },
      { title: 'Recupero di materiali', text: "Recupero di materiali edilizi e industriali, filiere di upcycling, Digital Product Passport e analisi dei flussi di materia." },
      { title: 'BIM e digital twin', text: "Modelli digitali dell'edificio per progettare, simulare consumi e gestire la manutenzione nel tempo." },
      { title: 'LCA e rendicontazione', text: 'Analisi del ciclo di vita, consulenza su simbiosi industriale e supporto alla rendicontazione di sostenibilità (CSRD).' },
    ],
    focus: {
      eyebrow: 'Materiali',
      title: 'La <em>tavolozza</em> del cantiere',
      items: [
        { name: 'Legno', text: 'Strutture e finiture da filiere locali e certificate.' },
        { name: 'Calce', text: 'Intonaci e malte traspiranti, compatibili con le murature storiche.' },
        { name: 'Terra cruda', text: 'Massa termica e regolazione naturale dell’umidità.' },
        { name: 'Fibre vegetali', text: 'Canapa, paglia e sughero per isolamenti a basso impatto.' },
        { name: 'Pietra e laterizio di recupero', text: 'Materia già cotta e già estratta, rimessa in opera.' },
        { name: 'Materiali riciclati', text: 'Scarti edilizi e industriali tracciati e riqualificati.' },
      ],
    },
    steps: [
      { title: 'Sopralluogo', text: "Rilievo, lettura del clima e dell'acqua, inventario dei materiali recuperabili." },
      { title: 'Progetto bioclimatico', text: 'Concept, modello BIM, simulazioni energetiche e piano dei costi.' },
      { title: 'Cantiere', text: 'Esecuzione come General Contractor, con imprese e artigiani del territorio.' },
      { title: 'Gestione', text: 'Monitoraggio dei consumi, manutenzione e servizi energetici nel tempo.' },
    ],
  },
  {
    slug: 'agricoltura',
    name: 'Agricoltura',
    icon: Wheat,
    image: '/images/regenerativa/hero.jpg',
    title: ['Suolo vivo,', '<em>economia</em> viva'],
    tagline:
      'Agroecologia, permacultura e filiere corte: progettiamo sistemi agricoli che rigenerano il suolo, nutrono la comunità e restituiscono valore al territorio.',
    meta: 'Agroecologia, permacultura, food forest, Community Supported Agriculture, filiera corta, rewilding, crediti di carbonio e biodiversità.',
    lead:
      "Un terreno abbandonato non è vuoto: è un sistema in attesa. Partiamo dal suolo e dall'acqua, disegniamo paesaggi produttivi che aumentano la biodiversità e costruiamo intorno a essi una comunità di persone che coltiva, compra e si prende cura.",
    principles: [
      { title: 'Il suolo prima di tutto', text: 'Copertura permanente, compost e rotazioni: la fertilità si costruisce, non si compra.' },
      { title: 'Diversità come resilienza', text: 'Policolture, siepi, alberi e animali al pascolo rendono il sistema più stabile e più produttivo.' },
      { title: 'Filiera corta e comunità', text: 'Chi mangia partecipa: agricoltura supportata dalla comunità, botteghe e mercati locali.' },
    ],
    services: [
      { title: 'Agroecologia e permacultura', text: 'Progettazione di aziende e terreni secondo zone, flussi d’acqua e microclimi, dal piano generale all’impianto.' },
      { title: 'Food forest e orti collettivi', text: 'Boschi commestibili a più strati e orti condivisi negli spazi rigenerati.' },
      { title: 'Community Supported Agriculture', text: 'Modelli in cui la comunità sostiene l’azienda agricola condividendone raccolto e rischio.' },
      { title: 'Botteghe e mercati locali', text: 'Spazi di vendita e distribuzione per i prodotti del territorio e della rete.' },
      { title: 'Apicoltura e fattorie didattiche', text: 'Api, animali e campi come luoghi di apprendimento per scuole, famiglie e visitatori.' },
      { title: 'Rewilding e pascolo rigenerativo', text: 'Pascolo a rotazione e rinaturalizzazione per suoli più ricchi e paesaggi più vari.' },
      { title: 'Macchinari e compostaggio', text: 'Produzione e manutenzione di macchine agricole e agroforestali, sistemi di compostaggio e riscaldamento a biomassa.' },
      { title: 'Carbonio e biodiversità', text: "Crediti da riforestazione e agricoltura rigenerativa, pagamenti per servizi ecosistemici e capitale paziente per gli ecosistemi." },
    ],
    focus: {
      eyebrow: 'Pratiche',
      title: 'Cosa vedi in un <em>campo rigenerato</em>',
      items: [
        { name: 'Copertura permanente', text: 'Il suolo non resta mai nudo: pacciamatura e colture di copertura.' },
        { name: 'Lavorazioni minime', text: 'Meno aratura, più vita microbica e più sostanza organica.' },
        { name: 'Alberi nei campi', text: 'Agroforestazione, siepi e filari frangivento.' },
        { name: 'Acqua trattenuta', text: 'Linee chiave, laghetti e swale che rallentano e infiltrano la pioggia.' },
        { name: 'Animali integrati', text: 'Pascolo pianificato e api come parte del sistema.' },
        { name: 'Semi locali', text: 'Varietà adatte al territorio, custodite e scambiate.' },
      ],
    },
    steps: [
      { title: 'Lettura del luogo', text: 'Suolo, acqua, esposizione, vegetazione esistente e storia agricola del terreno.' },
      { title: 'Progetto', text: 'Piano di permacultura, scelta delle colture e del modello economico.' },
      { title: 'Impianto', text: 'Lavori di sistemazione idrica, messa a dimora e avvio delle colture.' },
      { title: 'Comunità e filiera', text: 'CSA, mercati e didattica: il campo trova chi lo sostiene.' },
    ],
  },
  {
    slug: 'acqua',
    name: 'Acqua',
    icon: Droplets,
    image: '/images/regenerativa/aerial-green.jpg',
    title: ["L'acqua come", '<em>bene comune</em>'],
    tagline:
      'Sorgenti, pozzi e bacini gestiti insieme alle comunità che li usano: concessioni, infrastrutture locali e regole condivise, sul modello di Elinor Ostrom.',
    meta: "Gestione comunitaria di sorgenti, pozzi e bacini, concessioni idriche, infrastrutture idriche locali, fitodepurazione, governance dei beni comuni secondo Elinor Ostrom.",
    lead:
      "L'acqua è la prima infrastruttura di ogni luogo che rigeneriamo. La trattiamo come un bene comune: si misura, si custodisce e si governa insieme a chi ne dipende, con regole chiare e adatte al territorio.",
    principles: [
      { title: 'Conoscere', text: "Mappare sorgenti, pozzi, falde e consumi: senza dati condivisi non c'è gestione condivisa." },
      { title: 'Trattenere', text: "Raccogliere la pioggia, infiltrarla nel suolo e depurare naturalmente le acque reflue." },
      { title: 'Governare insieme', text: 'Comunità di utenti con regole proprie, monitoraggio e risoluzione dei conflitti.' },
    ],
    services: [
      { title: 'Gestione comunitaria delle risorse idriche', text: 'Accompagniamo comunità e consorzi nella cura di sorgenti, pozzi e bacini.' },
      { title: 'Concessioni idriche', text: 'Istruttoria, richiesta e gestione delle concessioni di derivazione e di utilizzo.' },
      { title: 'Infrastrutture idriche locali', text: 'Cisterne, raccolta delle acque piovane, piccole reti di distribuzione e accumulo.' },
      { title: 'Fitodepurazione e biolaghi', text: 'Trattamento naturale delle acque reflue e bacini che diventano habitat.' },
      { title: 'Ritenzione e paesaggio', text: 'Laghetti, swale e linee chiave per rallentare il deflusso e ricaricare le falde.' },
      { title: 'Monitoraggio aperto', text: "Sensori e osservatori territoriali aperti per misurare portate, livelli e qualità dell'acqua." },
    ],
    focus: {
      eyebrow: 'Elinor Ostrom',
      title: 'Otto principi per <em>governare</em> un bene comune',
      items: [
        { name: 'Confini chiari', text: 'Si sa chi può usare la risorsa e quale risorsa.' },
        { name: 'Regole adatte al luogo', text: 'Le regole riflettono le condizioni locali.' },
        { name: 'Decisioni collettive', text: 'Chi è toccato dalle regole partecipa a cambiarle.' },
        { name: 'Monitoraggio', text: "L'uso della risorsa è osservato da chi risponde alla comunità." },
        { name: 'Sanzioni graduali', text: 'Chi viola le regole incontra conseguenze proporzionate.' },
        { name: 'Risoluzione dei conflitti', text: 'Esistono luoghi rapidi ed economici per risolverli.' },
        { name: 'Riconoscimento', text: 'Le istituzioni esterne rispettano il diritto della comunità di organizzarsi.' },
        { name: 'Livelli annidati', text: 'Per risorse ampie, la governance si articola su più livelli collegati.' },
      ],
    },
    steps: [
      { title: 'Mappatura', text: 'Censimento di sorgenti, pozzi, usi e titoli esistenti.' },
      { title: 'Comunità di utenti', text: 'Chi usa la risorsa si riunisce e definisce obiettivi comuni.' },
      { title: 'Regole e concessioni', text: 'Statuto, regolamento d’uso e pratiche amministrative.' },
      { title: 'Opere e monitoraggio', text: 'Infrastrutture, sensori e verifica periodica insieme alla comunità.' },
    ],
  },
  {
    slug: 'ospitalita',
    name: 'Ospitalità',
    icon: Tent,
    image: '/images/regenerativa/site-casaselva.jpeg',
    title: ['Luoghi che si', '<em>riempiono</em> di vita'],
    tagline:
      "Ospitalità diffusa, turismo lento, eventi e residenze: gli spazi rigenerati diventano luoghi da abitare, visitare e vivere tutto l'anno.",
    meta: 'Ospitalità diffusa e glamping, turismo lento, itinerari culturali e spirituali, eventi, festival, residenze artistiche, ristorazione a filiera corta, benessere e yoga.',
    lead:
      "Un luogo è rigenerato quando qualcuno ci torna. Per questo ogni progetto prevede da subito una vita quotidiana: chi ci dorme, chi ci mangia, chi ci lavora e chi ci arriva a piedi, attraverso l'entroterra marchigiano.",
    principles: [
      { title: 'Lento', text: 'Turismo che resta, cammina e conosce il territorio invece di consumarlo.' },
      { title: 'Diffuso', text: 'Ospitalità distribuita tra case, borghi e campi, senza nuove colate di cemento.' },
      { title: 'Radicato', text: 'Cucina, attività ed eventi costruiti con le persone e i prodotti del luogo.' },
    ],
    services: [
      { title: 'Ospitalità diffusa e glamping', text: 'Accoglienza in edifici recuperati e strutture leggere a basso impatto nel paesaggio.' },
      { title: 'Turismo lento e itinerari', text: "Cammini, percorsi culturali e spirituali nell'entroterra marchigiano." },
      { title: 'Attività outdoor', text: 'Escursioni, esperienze nella natura e nei campi, attività per gruppi e scuole.' },
      { title: 'Ristorazione e filiera corta', text: 'Cucine che servono ciò che si coltiva nella rete e nel territorio.' },
      { title: 'Eventi e festival', text: 'Programmazione culturale, incontri, concerti e raduni negli spazi rigenerati.' },
      { title: 'Residenze artistiche', text: 'Tempo e spazio per artisti e ricercatori, in dialogo con la comunità locale.' },
      { title: 'Benessere e yoga', text: 'Ritiri, pratiche corporee e percorsi di lavoro interiore.' },
      { title: 'Voucher della rete', text: 'Voucher fisici e digitali per soggiorni, servizi e spazi dei luoghi in rete.' },
    ],
    focus: {
      eyebrow: 'Le stagioni',
      title: "Un luogo vivo <em>tutto l'anno</em>",
      items: [
        { name: 'Primavera', text: 'Semine, cammini e corsi in campo aperto.' },
        { name: 'Estate', text: 'Festival, residenze e ospitalità all’aperto.' },
        { name: 'Autunno', text: 'Raccolti, vendemmie e cucina di stagione.' },
        { name: 'Inverno', text: 'Ritiri, formazione e lavoro nei laboratori.' },
      ],
    },
    steps: [
      { title: 'Vocazione', text: 'Cosa può offrire questo luogo, a chi e in quali stagioni.' },
      { title: 'Programma', text: 'Ospitalità, cucina, attività ed eventi in un calendario sostenibile.' },
      { title: 'Apertura', text: 'Avvio graduale con la comunità locale e i partner della rete.' },
      { title: 'Cura', text: 'Gestione quotidiana, ascolto degli ospiti e reinvestimento nel luogo.' },
    ],
  },
  {
    slug: 'tecnologia',
    name: 'Tecnologia',
    icon: Cpu,
    image: '/images/regenerativa/site-liminal.jpeg',
    title: ['Tecnologia aperta', 'per <em>territori</em> vivi'],
    tagline:
      'Software, dati e intelligenza artificiale al servizio dei luoghi: digital twin di edifici e territori, piattaforme GIS cooperative e strumenti per federare reti di nodi locali.',
    meta: 'Software SaaS, BIM e digital twin, piattaforme GIS cooperative, osservatori territoriali aperti, software per reti multi-nodo, intelligenza artificiale per cantieri e territori.',
    lead:
      "Coordinare una rete di luoghi richiede strumenti all'altezza. Li sviluppiamo aperti e interoperabili, perché i dati di un territorio appartengono alla comunità che lo abita e devono restare leggibili, verificabili e riutilizzabili.",
    principles: [
      { title: 'Open source', text: 'Codice aperto e standard comuni: nessun nodo resta prigioniero di un fornitore.' },
      { title: 'Dati del territorio', text: 'Osservatori aperti, con dati che restano alla comunità e alle istituzioni locali.' },
      { title: 'Federazione', text: "Ogni nodo è autonomo e insieme parte di una rete: la griglia esagonale H3 ne è la mappa." },
    ],
    services: [
      { title: 'Software gestionali', text: 'Applicazioni SaaS per gestire spazi, prenotazioni, cantieri, filiere e comunità.' },
      { title: 'BIM e digital twin', text: 'Gemelli digitali di edifici e territori per progettare, simulare e manutenere.' },
      { title: 'GIS cooperativo', text: 'Piattaforme cartografiche condivise e osservatori territoriali aperti.' },
      { title: 'Reti multi-nodo', text: 'Software per federare nodi locali: identità, progetti, risorse e decisioni condivise.' },
      { title: 'Computer vision', text: 'Monitoraggio dei cantieri e riconoscimento di specie vegetali e animali.' },
      { title: 'Agenti AI', text: 'Coordinamento di reti di fornitori e individuazione di scarti riutilizzabili.' },
      { title: 'Manutenzione predittiva', text: 'Modelli che anticipano guasti di impianti, macchine e infrastrutture.' },
      { title: 'Pianificazione territoriale', text: 'Analisi e scenari per decisioni informate su uso del suolo, acqua ed energia.' },
    ],
    focus: {
      eyebrow: 'Livelli della rete',
      title: 'Dal progetto al <em>territorio</em>, sulla griglia H3',
      items: [
        { name: 'Progetto', text: 'Una cella esagonale H3 a risoluzione 8: un singolo luogo in rete.' },
        { name: 'Nucleo', text: 'Risoluzione 7: progetti vicini che si scambiano risorse.' },
        { name: 'Rete locale', text: 'Risoluzione 6: nuclei coordinati su scala comunale e intercomunale.' },
        { name: 'Territorio', text: 'Risoluzione 5: la bioregione che le reti locali compongono.' },
      ],
    },
    steps: [
      { title: 'Bisogno', text: 'Partiamo da un problema reale di un luogo o di una rete.' },
      { title: 'Prototipo', text: 'Uno strumento minimo, provato sul campo con chi lo userà.' },
      { title: 'Rilascio aperto', text: 'Codice e dati documentati e riutilizzabili da altri nodi.' },
      { title: 'Evoluzione', text: "Manutenzione e nuove funzioni guidate dall'uso." },
    ],
  },
  {
    slug: 'governance',
    name: 'Governance',
    icon: Scale,
    image: '/images/regenerativa/site-liminal-2.jpeg',
    title: ['Custodire i', '<em>beni comuni</em>'],
    tagline:
      'Custodia fiduciaria di terre e patrimoni, community land trust e governance distribuita: accompagniamo comunità e istituzioni verso la gestione condivisa.',
    meta: 'Stewardship dei beni comuni, custodia fiduciaria di terre e patrimoni, community land trust, cohousing, sociocrazia, S3, olocrazia, economia pluricapitale.',
    lead:
      "Rigenerare un luogo significa anche decidere chi se ne prende cura, e come. Assumiamo il ruolo di custode fiduciario e costruiamo con le comunità le regole, gli strumenti e le forme giuridiche per gestire insieme ciò che è di tutti.",
    principles: [
      { title: 'Custodia, non proprietà', text: 'Terre e patrimoni tenuti in fiducia per la comunità e per le generazioni future.' },
      { title: 'Potere distribuito', text: 'Decisioni prese vicino a chi ne porta le conseguenze, con ruoli chiari e trasparenti.' },
      { title: 'Valore misurato', text: 'Oltre al capitale finanziario: sociale, naturale, culturale, relazionale.' },
    ],
    services: [
      { title: 'Custodia fiduciaria', text: 'Assumiamo la responsabilità di terre, edifici e patrimoni per conto di comunità e proprietari.' },
      { title: 'Community land trust e cohousing', text: 'Modelli che separano la terra dal mercato speculativo, anche con diritto di superficie.' },
      { title: 'Accompagnamento di comunità ed enti', text: 'Co-progettazione, patti di collaborazione e percorsi verso la gestione condivisa.' },
      { title: 'Sociocrazia, S3 e olocrazia', text: 'Formazione e facilitazione per organizzazioni che decidono per consenso.' },
      { title: 'Piattaforme decisionali', text: 'Strumenti digitali per proposte, deliberazioni e trasparenza delle decisioni.' },
      { title: 'Economia pluricapitale', text: "Modelli economici e misurazione dell'impatto su più forme di capitale." },
      { title: 'Aree naturali protette', text: 'Supporto alla gestione di aree protette e di patrimoni naturali.' },
    ],
    focus: {
      eyebrow: 'Strumenti',
      title: 'Forme per <em>decidere insieme</em>',
      items: [
        { name: 'Cerchi', text: 'Gruppi semi-autonomi con un dominio di responsabilità chiaro.' },
        { name: 'Consenso', text: 'Si procede quando nessuno ha obiezioni fondate, non quando tutti sono d’accordo.' },
        { name: 'Ruoli', text: 'Responsabilità esplicite, elette e riviste periodicamente.' },
        { name: 'Accordi', text: 'Regole scritte, condivise e modificabili da chi le applica.' },
        { name: 'Patti di collaborazione', text: 'Accordi tra cittadini ed enti per la cura dei beni comuni urbani e rurali.' },
        { name: 'Trasparenza', text: 'Decisioni e conti consultabili da tutta la comunità.' },
      ],
    },
    steps: [
      { title: 'Ascolto', text: 'Chi è coinvolto, quali interessi, quali tensioni.' },
      { title: 'Forma giuridica', text: 'Il veicolo adatto: fondazione, trust, cooperativa, patto, concessione.' },
      { title: 'Regole e ruoli', text: 'Statuto, accordi e processi decisionali scritti insieme.' },
      { title: 'Autonomia', text: 'La comunità prende in mano la gestione, con il nostro supporto quando serve.' },
    ],
  },
  {
    slug: 'formazione',
    name: 'Formazione',
    icon: GraduationCap,
    image: '/images/regenerativa/site-refactory.jpeg',
    title: ['Imparare', '<em>facendo</em>'],
    tagline:
      'Corsi, laboratori, ricerca applicata e comunicazione: trasformiamo ciò che sperimentiamo nei luoghi della rete in conoscenza da condividere.',
    meta: 'Corsi in presenza e online, fablab e maker space, ricerca applicata, fondi europei e nazionali (Horizon Europe, LIFE, PNRR), startup, comunicazione ed editoria.',
    lead:
      "Ogni cantiere, campo e comunità della rete è anche un'aula. Raccogliamo quello che impariamo e lo restituiamo in forma di corsi, ricerca, progetti finanziati e racconti, perché il modello possa essere ripreso altrove.",
    principles: [
      { title: 'Sul campo', text: 'Si impara nei cantieri, negli orti e nei laboratori, con le mani.' },
      { title: 'Aperto', text: 'Materiali e risultati condivisi, riutilizzabili da altri nodi e territori.' },
      { title: 'Finanziabile', text: 'Idee trasformate in progetti capaci di accedere a fondi pubblici e privati.' },
    ],
    services: [
      { title: 'Corsi in presenza e online', text: 'Bioedilizia, permacultura, governance, tecnologie aperte e gestione dei luoghi.' },
      { title: 'Fablab e maker space', text: 'Laboratori attrezzati per prototipare, riparare e costruire insieme.' },
      { title: 'Ricerca applicata', text: 'Poli di ricerca con università, enti e imprese sui temi della rigenerazione.' },
      { title: 'Fondi europei e nazionali', text: 'Supporto alla progettazione su Horizon Europe, LIFE, PNRR e bandi regionali.' },
      { title: 'Nascita di startup', text: 'Accompagnamento di nuove imprese nate dai progetti della rete.' },
      { title: 'Video, podcast e documentari', text: 'Racconti dei luoghi e dei processi di rigenerazione.' },
      { title: 'Marketing territoriale e crowdfunding', text: 'Campagne per far conoscere e sostenere i progetti.' },
      { title: 'Editoria', text: 'Pubblicazioni su rigenerazione, bioedilizia, permacultura ed economia circolare.' },
    ],
    focus: {
      eyebrow: 'Fondi',
      title: 'Programmi che <em>accompagniamo</em>',
      items: [
        { name: 'Horizon Europe', text: 'Ricerca e innovazione, anche con partenariati europei.' },
        { name: 'LIFE', text: "Ambiente, natura, biodiversità e transizione energetica." },
        { name: 'PNRR', text: 'Rigenerazione, borghi, transizione ecologica e digitale.' },
        { name: 'Bandi regionali', text: 'Programmi della Regione Marche e fondi di sviluppo rurale.' },
      ],
    },
    steps: [
      { title: 'Esperienza', text: 'Una pratica che funziona in un luogo della rete.' },
      { title: 'Metodo', text: 'La documentiamo e la rendiamo trasmissibile.' },
      { title: 'Percorso', text: 'Corso, laboratorio o progetto di ricerca.' },
      { title: 'Diffusione', text: 'Pubblicazioni, racconti e nuovi nodi che la adottano.' },
    ],
  },
  {
    slug: 'rete',
    name: 'Rete',
    icon: Hexagon,
    image: '/images/regenerativa/green-field.jpg',
    title: ['Un modello', 'che si <em>replica</em>'],
    tagline:
      'Nodi locali affiliati, licenze del metodo, formazione dei gestori e strumenti di scambio: la rigenerazione territoriale diventa una rete che cresce per contagio.',
    meta: 'Reti rigenerative di nodi locali affiliati, licenze del marchio e del metodo, formazione dei gestori, marchio collettivo, voucher, valute complementari e banca del tempo.',
    lead:
      "Ciò che funziona a Castorano può funzionare altrove. Offriamo il nostro metodo a chi vuole aprire un nodo nel proprio territorio: formazione, strumenti digitali, un marchio comune e circuiti di scambio che fanno circolare valore tra i luoghi.",
    principles: [
      { title: 'Autonomia locale', text: 'Ogni nodo appartiene al suo territorio e decide per sé.' },
      { title: 'Standard comuni', text: 'Un metodo, un marchio di qualità rigenerativa e strumenti condivisi.' },
      { title: 'Valore che circola', text: 'Voucher, crediti reciproci e co-investimento tengono il valore nella rete.' },
    ],
    services: [
      { title: 'Nodi locali affiliati', text: 'Accompagnamento all’apertura di un nuovo nodo, dalla scelta del luogo all’avvio.' },
      { title: 'Licenze del marchio e del metodo', text: 'Accesso al modello Rigenerativa, ai suoi processi e ai suoi strumenti.' },
      { title: 'Formazione dei gestori', text: 'Percorsi per chi gestirà spazi, comunità e progetti nei nodi.' },
      { title: 'Marchio collettivo', text: 'Un marchio di qualità rigenerativa per luoghi, prodotti e servizi della rete.' },
      { title: 'Voucher fisici e digitali', text: 'Per servizi, soggiorni e spazi dei luoghi in rete.' },
      { title: 'Valute complementari e banca del tempo', text: 'Crediti reciproci e scambio di competenze tra persone e imprese.' },
      { title: 'Crowdfunding e co-investimento', text: 'Fondi comunitari per finanziare nuovi nodi e progetti.' },
    ],
    focus: {
      eyebrow: 'Aprire un nodo',
      title: 'Come entra un <em>nuovo luogo</em>',
      items: [
        { name: 'Candidatura', text: 'Un luogo, un gruppo di persone, un’intenzione.' },
        { name: 'Valutazione', text: 'Visita, analisi di fattibilità e piano di rigenerazione.' },
        { name: 'Affiliazione', text: 'Licenza del metodo e accesso agli strumenti della rete.' },
        { name: 'Formazione', text: 'I gestori si formano nei luoghi già attivi.' },
        { name: 'Avvio', text: 'Il nodo entra in rete e inizia a scambiare.' },
      ],
    },
    steps: [
      { title: 'Contatto', text: 'Ci racconti il luogo e chi siete.' },
      { title: 'Fattibilità', text: 'Valutiamo insieme spazi, risorse e comunità.' },
      { title: 'Affiliazione', text: 'Licenza, formazione e strumenti digitali.' },
      { title: 'In rete', text: 'Il nodo apre, scambia e a sua volta accompagna altri.' },
    ],
  },
];

export const bySlug = Object.fromEntries(settori.map((s) => [s.slug, s]));

// Production subdomains (and *.rigenerativa.localhost in dev) get real subdomain links;
// any other host (Netlify previews, plain localhost) falls back to ?settore=<slug>.
const hostname = () => (typeof location === 'undefined' ? '' : location.hostname.toLowerCase());

function usesSubdomains() {
  const h = hostname();
  return h === 'rigenerativa.it' || h.endsWith('.rigenerativa.it') || h.endsWith('rigenerativa.localhost');
}

export function currentSettore() {
  if (typeof location === 'undefined') return null;
  const q = new URLSearchParams(location.search).get('settore');
  if (q && bySlug[q]) return q;
  const first = hostname().split('.')[0];
  return bySlug[first] ? first : null;
}

// The host without the sector label or www, keeping the port: rigenerativa.it, rigenerativa.localhost:5173.
function rootHost() {
  const labels = location.host.toLowerCase().split('.');
  return (bySlug[labels[0]] || labels[0] === 'www' ? labels.slice(1) : labels).join('.');
}

export function settoreUrl(slug, hash = '') {
  if (usesSubdomains()) return `${location.protocol}//${slug ? slug + '.' : ''}${rootHost()}/${hash}`;
  return slug ? `/?settore=${slug}${hash}` : `/${hash}`;
}

export const homeUrl = (hash = '') => settoreUrl(null, hash);

// Shown to people as the address of a sector page.
export const settoreHost = (slug) => `${slug}.rigenerativa.it`;
