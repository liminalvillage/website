<section class="section top">
  <div class="section-content">
    <div class="row text-center">
      <div class="box1">
        <i class="fas fa-user-cog"></i>
        <h2>Personal</h2>
        <p class="hidden-xs">
          Contribute something to yourself. During your stay at the village, you can set
          your personal goals and directions. Outgrow your old self, find your Ikigai,
          learn something new, write your book or your own TED talk!
        </p>
      </div>
      <div class="box2">
        <i class="fas fa-street-view"></i>
        <h2>Local</h2>
        <p class="hidden-xs">
          Do something for the people around you and for your surrounding: Teach something
          you know, build something, create art, regenerate the place around you.
        </p>
      </div>
      <div class="box3">
        <i class="fas fa-globe-americas"></i>
        <h2>Global</h2>
        <p class="hidden-xs">
          Do something for the planet and the people living on it: Find a cause that you
          deem important in the world, find out more about it, then find ways to help and improve!
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section dark">
  <div class="container">
    <h2>Would you like to visit us?</h2>
    <div class="text-center">
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSfpjW-YzSfUMNdsRZ9DlC70JqSYXCu4JZsPs6mHIjktxJ6tYA/viewform?usp=sf_link"
        class="btn"
        target="_blank"
        rel="noopener"
      >
        Apply Here
      </a>
    </div>
  </div>
</section>

<style>
  .section {
    float: left;
    width: 100%;
  }

  .section.top .row {
    margin: 0;
    display: flex;
    width: 100%;
  }

  .section.top .section-content .row > div {
    flex: 1;
    padding: 50px 30px;
    text-align: center;
  }

  .section.top .section-content .row p {
    padding: 20px 50px;
    letter-spacing: 1px;
    line-height: 1.8;
  }

  .section.top .section-content h2 {
    font-size: 18px;
    letter-spacing: 5px;
    padding-top: 30px;
    color: var(--dark-color);
  }

  .section.top .section-content i {
    padding-top: 30px;
    color: var(--dark-color);
    font-size: 3em;
  }

  .section.top .box1 {
    background-color: #FFDC91;
  }

  .section.top .box2 {
    background-color: #FFC972;
  }

  .section.top .box3 {
    background-color: var(--primary-color);
  }

  .text-center {
    text-align: center;
  }

  .section.dark {
    background-color: var(--dark-color);
    padding: 50px 0;
  }

  .section.dark h2 {
    font-weight: 300;
    letter-spacing: 10px;
    line-height: 1.5;
    text-align: center;
    color: #FFF;
    font-size: 50px;
    margin-bottom: 30px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .btn {
    display: inline-block;
    padding: 15px 60px;
    background: var(--primary-color);
    color: var(--dark-color);
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 3px;
    text-transform: uppercase;
    border-radius: 0;
    transition: all 0.5s ease-in-out 0.1s;
    border: 2px solid var(--primary-color);
  }

  .btn:hover {
    background: transparent;
    color: var(--primary-color);
  }

  @media (max-width: 968px) {
    .section.top .section-content .row > div {
      padding: 40px 20px;
    }

    .section.dark h2 {
      font-size: 35px;
    }
  }

  @media (max-width: 768px) {
    .section.top .row {
      flex-direction: column;
    }

    .section.top .section-content .row > div {
      padding: 30px 10px;
    }

    .section.top .section-content .row p {
      padding: 20px 20px;
    }

    .section.top .section-content i {
      font-size: 2.5em;
      padding-top: 10px;
    }

    .section.top .section-content h2 {
      font-size: 16px;
      padding-top: 20px;
    }

    .section.dark {
      padding: 40px 0;
    }

    .section.dark h2 {
      font-size: 25px;
      text-align: center;
      padding-bottom: 20px;
    }

    .btn {
      padding: 10px 40px;
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .section.top .section-content .row > div {
      padding: 20px 5px;
    }

    .section.top .section-content i {
      font-size: 2em;
    }

    .section.top .section-content h2 {
      font-size: 14px;
      letter-spacing: 3px;
      padding-top: 15px;
    }

    .section.dark h2 {
      font-size: 18px;
      padding-bottom: 30px;
    }
  }
</style>
