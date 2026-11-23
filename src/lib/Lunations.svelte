<script>
  import LunationArc from './LunationArc.svelte';
</script>

<section id="lunations" class="section">
  <div class="wrap">
    <div class="head">
      <div>
        <p class="eyebrow">Lunations</p>
        <h2 class="display">We keep time with the moon</h2>
      </div>
      <div>
        <p class="lead">
          The moon is a planet-wide progress bar: look up, and you can check in with everyone else in the cycle,
          anywhere on Earth. We align our work to its phases so that distributed teams can plan, build and
          celebrate together.
        </p>
        <p class="muted">
          During some lunations the village hosts a <strong>Hackalong</strong>: a continuous co-creation process
          of talks, workshops and brainstorms, where a group signals, branches, merges and builds something that
          resonates, without coercion, reward or punishment.
        </p>
        <p class="note">
          Taking part is open to members and supporters of Liminal Village and the ReGenerativa network.
        </p>
        <div class="actions">
          <a class="btn" href="/lunations">See the year in moons</a>
          <a class="more" href="/apply">Apply to join a lunation →</a>
        </div>
      </div>
    </div>
    <div class="arc"><LunationArc /></div>
  </div>
</section>

<style>
  .head { display: grid; grid-template-columns: 5fr 7fr; gap: 48px; align-items: start; }
  .muted { margin-top: 16px; }
  .muted strong { color: var(--ink); }
  .note {
    margin-top: 20px;
    padding-left: 14px;
    border-left: 2px solid var(--gold);
    font-size: 14px;
    color: var(--muted);
  }
  .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; margin-top: 30px; }
  .arc { margin-top: 72px; }
  .arc :global(.lunation-arc) { margin: 0; }

  @media (max-width: 860px) {
    .head { grid-template-columns: 1fr; gap: 16px; }
    .arc { margin-top: 48px; }
  }
</style>
