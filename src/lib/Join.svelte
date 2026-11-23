<!-- The one call to action at the end of the page: visit, support, or just stay in touch. -->
<section id="join" class="join">
  <div class="wrap grid">
    <div>
      <p class="eyebrow">Come and visit</p>
      <h2 class="display">Spend a lunation with us</h2>
      <p class="lead">
        Stays, visits and volunteering start with a short application. Can't come yet? Support the village on
        Open Collective, or get the newsletter.
      </p>
      <div class="actions">
        <a class="btn gold" href="/apply">Apply to visit</a>
        <a class="btn ghost" href="https://opencollective.com/liminal" target="_blank" rel="noopener">Become a supporter</a>
      </div>
    </div>

    <form
      class="news"
      action="https://liminalvillage.us10.list-manage.com/subscribe/post?u=f34ed3a710cf1faef9f335534&id=4f9e07d0c2"
      method="post"
      target="_blank"
    >
      <label for="news-email">Newsletter</label>
      <p>News from the village, about once a moon.</p>
      <div class="row">
        <input id="news-email" type="email" name="EMAIL" placeholder="you@example.com" autocomplete="email" required />
        <button class="btn light" type="submit">Subscribe</button>
      </div>
    </form>
  </div>
</section>

<style>
  .join { padding: 104px 0; background: #1f1b16; color: rgba(255, 255, 255, 0.8); }
  .grid { display: grid; grid-template-columns: 7fr 5fr; gap: 64px; align-items: center; }
  .eyebrow { color: #e8c490; }
  h2.display { color: #fff; }
  .lead { color: rgba(255, 255, 255, 0.8); margin-top: 18px; max-width: 560px; }
  .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
  .actions .ghost { color: #fff; }

  .news {
    padding: 28px;
    border-radius: var(--radius);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  .news label { font-family: var(--display); font-size: 28px; color: #fff; }
  .news p { font-size: 14px; color: rgba(255, 255, 255, 0.65); margin: 4px 0 16px; }
  .row { display: flex; gap: 8px; }
  input {
    flex: 1;
    min-width: 0;
    min-height: 48px;
    padding: 0 18px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
    font: inherit;
    font-size: 15px;
  }
  input::placeholder { color: rgba(255, 255, 255, 0.4); }
  input:focus { outline: none; border-color: var(--gold); }
  button { border: 0; cursor: pointer; font-family: inherit; }

  @media (max-width: 860px) {
    .join { padding: 72px 0; }
    .grid { grid-template-columns: 1fr; gap: 40px; }
    .row { flex-direction: column; }
  }
</style>
