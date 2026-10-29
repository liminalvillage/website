<script>
  import PhotoScroll from './PhotoScroll.svelte';
  const villageImages = [
    '/images/P1120415-500x99999.jpeg',
    '/images/P1120438-500x99999.jpeg',
    '/images/P1120483-500x99999.jpeg',
    '/images/P1120521-500x99999.jpeg',
    '/images/P1120531-500x99999.jpeg',
    '/images/P1120532-500x99999.jpeg',
  ];

  const surroundingsImages = [
    '/images/Ascoli-Piceno-Marche-Russia-News-1-500x99999.jpg',
    '/images/Castelluccio-500x99999.jpg',
    '/images/casteltrosino-500x99999.jpg',
    '/images/Territorio-SBT-5-500x99999.jpg',
  ];
</script>

<section id="thevillage" class="village">
  <div class="container">
    <div class="section-heading">
      <h2>The Village</h2>
    </div>
    <div class="section-content">
      <p>
        The co-creation village is situated on the smooth hills of the Tronto Valley in the
        "Marche" region, with panoramic views over the hills and the mountains. We can
        accommodate visitors in private or shared rooms, in caravans and in tents. High-speed
        internet is available throughout the village. We have a biolake, open source water
        purification system and food machines, a permaculture garden, co-creation spaces, and
        outdoor presentation facilities.
      </p>

      <PhotoScroll images={villageImages} alt="Village" />
    </div>
  </div>
</section>

<section id="surroundings" class="surroundings">
  <div class="container">
    <div class="section-heading">
      <h2>Surroundings</h2>
    </div>
    <div class="section-content">
      <p>
        The village is also conveniently located between the mountains and the sea, which can
        be both reached in about 20 minutes. There are many things to do and beautiful places
        to explore around our location, and we will be happy to share them with you if you
        would want to do some sightseeing.
      </p>

      <PhotoScroll images={surroundingsImages} alt="Surroundings" />
    </div>
  </div>
</section>

<style>
  .village, .surroundings {
    padding: 6rem 0;
  }



  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Editorial section head: a generated number, then a large left-aligned
     title above a hairline-separated section */
  .section-heading {
    display: grid;
    grid-template-columns: 3.5rem 1fr;
    align-items: baseline;
    text-align: left;
    margin-bottom: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
  }

  .section-heading::before {
    counter-increment: section;
    content: counter(section, decimal-leading-zero);
    grid-row: 1 / span 2;
    font-size: 0.75rem;
    letter-spacing: 2px;
    color: var(--muted);
  }

  .section-heading > :global(*) {
    grid-column: 2;
  }

  .section-heading h2 {
    font-size: clamp(2.4rem, 4.6vw, 4rem);
    font-weight: var(--heading-weight, 300);
    letter-spacing: -0.01em;
    line-height: 1.05;
    color: var(--ink);
    text-transform: none;
  }

  .section-content {
    text-align: left;
  }

  p {
    font-size: 1rem;
    line-height: 1.75;
    color: var(--muted);
    max-width: 62ch;
    /* An offset column: text starts a third of the way in */
    margin: 0 0 2.5rem max(0px, min(33.333%, calc(100% - 62ch)));
    text-align: left;
  }

  @media (max-width: 768px) {
    .village, .surroundings {
      padding: 4rem 0;
    }

    .section-heading h2 {
      font-size: 2.2rem;
    }
  }
</style>
