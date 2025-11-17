<script>
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

      <div class="gallery">
        {#each villageImages as image}
          <div class="gallery-item">
            <img src={image} alt="Village" loading="lazy" />
          </div>
        {/each}
      </div>
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

      <div class="gallery">
        {#each surroundingsImages as image}
          <div class="gallery-item">
            <img src={image} alt="Surroundings" loading="lazy" />
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .village, .surroundings {
    padding: 6rem 0;
  }

  .village {
    background: #fff;
  }

  .surroundings {
    background: #f8f9fa;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-heading h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    letter-spacing: 2px;
    position: relative;
    display: inline-block;
  }

  .section-heading h2::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #4a9d5f;
  }

  .section-content {
    max-width: 900px;
    margin: 0 auto;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 3rem;
    text-align: center;
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .gallery-item {
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .gallery-item:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }

  .gallery-item img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 768px) {
    .village, .surroundings {
      padding: 4rem 0;
    }

    .section-heading h2 {
      font-size: 2rem;
    }

    .gallery {
      grid-template-columns: 1fr;
    }
  }
</style>
