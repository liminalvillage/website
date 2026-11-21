<script>
  // Liminal Village's living constellation of ancestors, visionaries and guides.
  // Not a pantheon: every guide brings strengths and blind spots, and is there to be challenged.

  const movements = [
    {
      name: 'Remembering',
      text: 'Recovering our relationship with ourselves, each other and the living world.',
      guides: 'Watts · Kimmerer · Thich Nhat Hanh · indigenous wisdom traditions',
    },
    {
      name: 'Reimagining',
      text: "Expanding our sense of what is possible beyond today's institutions and assumptions.",
      guides: 'McKenna · Fuller · Fresco · Illich',
    },
    {
      name: 'Regenerating',
      text: 'Translating that expanded consciousness into real places, relationships, systems and practices.',
      guides: 'Ostrom · Meadows · Holmgren · Schwartz · Alexander',
    },
  ];

  const dimensions = [
    {
      name: 'Consciousness',
      icon: 'fa-eye',
      guides: [
        { name: 'Alan Watts', note: 'Nonduality, interconnectedness, play, and seeing through the illusion of separateness.' },
        { name: 'Terence McKenna', note: 'Consciousness, imagination, cultural transformation and questioning established reality.' },
        { name: 'Joanna Macy', work: 'Active Hope', note: 'The Great Turning: spirituality, ecological grief and collective action for a life-sustaining civilization.' },
      ],
    },
    {
      name: 'Commons',
      icon: 'fa-hands-helping',
      guides: [
        { name: 'Elinor Ostrom', work: 'Governing the Commons', note: 'Collective governance, shared responsibility and polycentric organization.' },
        { name: 'Silke Helfrich', work: 'Free, Fair and Alive', note: 'Commoning as a way of life: how people share, care and decide together every day.' },
        { name: 'Marshall Rosenberg', work: 'Nonviolent Communication', note: 'Needs-based communication, conflict transformation and agreements without coercion.' },
      ],
    },
    {
      name: 'Systems',
      icon: 'fa-project-diagram',
      guides: [
        { name: 'Donella Meadows', work: 'Thinking in Systems', note: 'Feedback loops, leverage points and paradigms: designing a network that learns instead of depending on its founders.' },
        { name: 'Gregory Bateson', work: 'Steps to an Ecology of Mind', note: 'The pattern that connects: relationship, communication, feedback and learning in living systems.' },
        { name: 'Stafford Beer', work: 'Brain of the Firm', note: 'The Viable System Model: autonomous units that stay coordinated within a larger whole.' },
      ],
    },
    {
      name: 'Design & technology',
      icon: 'fa-drafting-compass',
      guides: [
        { name: 'Buckminster Fuller', note: 'Whole-systems thinking, doing more with less, a world that works for everyone.' },
        { name: 'Jacque Fresco', note: 'Technological abundance, post-scarcity economics and radically reimagining civilization.' },
        { name: 'Christopher Alexander', work: 'A Pattern Language', note: 'Buildings, gardens, paths and settlements that feel alive and support human relationships.' },
      ],
    },
    {
      name: 'Ecology',
      icon: 'fa-seedling',
      guides: [
        { name: 'David Holmgren', work: 'Permaculture', note: 'Observing patterns, closing loops and letting natural systems carry more of the work.' },
        { name: 'Robin Wall Kimmerer', work: 'Braiding Sweetgrass', note: 'Gift, gratitude and reciprocity: not only taking from a place, but belonging to it and giving back.' },
        { name: 'Daniel Christian Wahl', work: 'Designing Regenerative Cultures', note: 'Regeneration as place-based transformation of ecology, culture, economy and technology.' },
      ],
    },
    {
      name: 'Inner & social change',
      icon: 'fa-yin-yang',
      guides: [
        { name: 'Richard Schwartz', work: 'No Bad Parts', note: 'Internal Family Systems: inner governance, and Self-led relationships as soil for collective governance.' },
        { name: 'adrienne maree brown', work: 'Emergent Strategy', note: 'How small-scale relationships shape larger patterns: growing through experiment and adaptation.' },
        { name: 'Ken Wilber', work: 'Integral Theory', note: 'Holarchies, developmental perspectives and integrating many ways of knowing.' },
      ],
    },
  ];

  const secondCircle = [
    { name: 'Arthur Koestler', note: 'Origin of the holon: every whole is also part of a larger whole.' },
    { name: 'Thich Nhat Hanh', note: 'Interbeing, mindfulness and spiritual practice in community.' },
    { name: 'Ivan Illich', note: 'Convivial tools, autonomy and institutions that serve human flourishing.' },
    { name: 'E. F. Schumacher', note: 'Small Is Beautiful: human-scale economies and appropriate technology.' },
    { name: 'Kate Raworth', note: 'Doughnut Economics: meeting human needs within planetary boundaries.' },
    { name: 'John Croft', note: 'Dragon Dreaming: dreaming, planning, doing and celebrating together.' },
    { name: 'Rudolf Steiner', note: 'Education, agriculture and human development, to engage with critically.' },
  ];
</script>

<section id="guides" class="guides">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Council of Guides</p>
      <h2>A living constellation</h2>
    </div>

    <div class="intro">
      <p>
        The liminal is the space between: the spiritual and the scientific, the ancient and the
        emerging, the individual and the collective, the material and the immaterial. Not simply
        balancing opposites, but discovering what can emerge through their encounter.
      </p>
      <p>
        The village is the place where the liminal becomes livable. Our intellectual guides help us
        understand the patterns, our spiritual guides help us embody them, and the village is the
        experiment in which both meet.
      </p>
    </div>

    <blockquote class="principle">
      <p>
        Honor the wisdom of the past, question the assumptions of the present, and embody the
        possibilities of the future.
      </p>
    </blockquote>

    <div class="rule">
      <p class="rule-title">No gurus. No unquestionable truths. Even our guides are there to be challenged.</p>
      <p>
        In a regenerative commons, wisdom belongs to the relationships and the living system, not to any
        single authority. Every guide brings strengths and blind spots; they inspire our decisions rather
        than dictate them.
      </p>
    </div>

    <h3 class="subhead">Three movements</h3>
    <div class="movements">
      {#each movements as m, i}
        <div class="movement">
          <span class="movement-num">0{i + 1}</span>
          <h4>{m.name}</h4>
          <p>{m.text}</p>
          <p class="movement-guides">{m.guides}</p>
        </div>
      {/each}
    </div>

    <h3 class="subhead">Six dimensions of a living community</h3>
    <p class="subhead-note">From inner transformation to collective regeneration</p>
    <div class="dimensions">
      {#each dimensions as d}
        <div class="dimension">
          <div class="dimension-head">
            <span class="dimension-icon"><i class="fas {d.icon}" aria-hidden="true"></i></span>
            <h4>{d.name}</h4>
          </div>
          <ul>
            {#each d.guides as g}
              <li>
                <span class="guide-name">{g.name}</span>
                {#if g.work}<span class="guide-work">{g.work}</span>{/if}
                <span class="guide-note">{g.note}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <h3 class="subhead">A second circle</h3>
    <ul class="circle">
      {#each secondCircle as g}
        <li>
          <span class="guide-name">{g.name}</span>
          <span class="guide-note">{g.note}</span>
        </li>
      {/each}
    </ul>

    <div class="closing">
      <p>
        Not a spiritual lineage, nor an intellectual one, but a set of <strong>living design principles</strong>
        drawn from both, because we are trying not only to understand another way of living, but to
        make it real. The constellation keeps growing.
        <a href="#contact">Who would you add? →</a>
      </p>
    </div>
  </div>
</section>

<style>
  .guides {
    width: 100%;
    padding: 6rem 0 5rem;
    background: #faf8f5;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .eyebrow {
    font-size: 0.75rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #D6A15B;
    margin-bottom: 0.75rem;
  }

  .section-heading h2 {
    font-size: 1.6rem;
    font-weight: 300;
    letter-spacing: 4px;
    color: #222;
    text-transform: uppercase;
  }

  p {
    font-size: 0.95rem;
    line-height: 1.9;
    letter-spacing: 0.5px;
    color: #8a8274;
  }

  .intro {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .intro p + p {
    margin-top: 1.25rem;
  }

  .principle {
    max-width: 760px;
    margin: 3.5rem auto 0;
    padding: 2rem 1rem;
    text-align: center;
    border-top: 1px solid rgba(214, 161, 91, 0.4);
    border-bottom: 1px solid rgba(214, 161, 91, 0.4);
  }

  .principle p {
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic;
    font-size: 1.35rem;
    line-height: 1.6;
    letter-spacing: 0.3px;
    color: #222;
  }

  .rule {
    max-width: 760px;
    margin: 2.5rem auto 0;
    text-align: center;
  }

  .rule-title {
    color: #222;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
  }

  .subhead {
    margin-top: 4.5rem;
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #222;
  }

  .subhead-note {
    text-align: center;
    font-size: 0.85rem;
    margin-top: 0.4rem;
  }

  .movements {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .movement {
    padding: 0 0.5rem;
    border-left: 2px solid #D6A15B;
    padding-left: 1.25rem;
  }

  .movement-num {
    font-size: 0.75rem;
    letter-spacing: 2px;
    color: #D6A15B;
  }

  .movement h4 {
    font-size: 1.05rem;
    font-weight: 500;
    letter-spacing: 2px;
    margin: 0.25rem 0 0.5rem;
  }

  .movement p {
    font-size: 0.9rem;
    line-height: 1.7;
  }

  .movement-guides {
    margin-top: 0.5rem;
    color: #222 !important;
    font-size: 0.85rem !important;
  }

  .dimensions {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
  }

  .dimension {
    background: #fff;
    border-radius: 12px;
    padding: 1.75rem 1.5rem;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .dimension:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }

  .dimension-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .dimension-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: rgba(214, 161, 91, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dimension-icon i {
    color: #D6A15B;
    font-size: 1rem;
  }

  .dimension h4 {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .dimension ul,
  .circle {
    list-style: none;
  }

  .dimension li + li {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f0ebe3;
  }

  .guide-name {
    display: block;
    color: #222;
    font-weight: 600;
    font-size: 0.92rem;
    letter-spacing: 0.5px;
  }

  .guide-work {
    display: block;
    font-style: italic;
    font-size: 0.8rem;
    color: #b8873d;
    margin-top: 0.1rem;
  }

  .guide-note {
    display: block;
    font-size: 0.85rem;
    line-height: 1.65;
    letter-spacing: 0.3px;
    color: #8a8274;
    margin-top: 0.3rem;
  }

  .circle {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem 2rem;
  }

  .circle li {
    padding-left: 1rem;
    border-left: 1px solid rgba(214, 161, 91, 0.5);
  }

  .closing {
    max-width: 760px;
    margin: 4rem auto 0;
    text-align: center;
  }

  .closing a {
    color: #D6A15B;
    white-space: nowrap;
  }

  .closing a:hover {
    color: #b8873d;
  }

  @media (max-width: 900px) {
    .dimensions {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .guides {
      padding: 4rem 0 3.5rem;
    }

    .container {
      padding: 0 1rem;
    }

    .section-heading h2 {
      font-size: 1.3rem;
    }

    .principle p {
      font-size: 1.1rem;
    }

    .movements,
    .dimensions {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .subhead {
      margin-top: 3.5rem;
    }
  }
</style>
