<script>
  import Avatar from './Avatar.svelte';
  import LinkedIn from './LinkedIn.svelte';
  import { formatShortDate, formatPrice } from './dates.js';

  let { person, onopen, index = 0 } = $props();

  const tag = $derived(person.role || person.category);
  const blurb = $derived(person.ikigai || person.offer?.description || '');
  const bookable = $derived(!!person.offer);
</script>

<article class="card" class:bookable style="--i:{Math.min(index, 12)}">
  <button class="hit" onclick={() => onopen(person)} aria-label="Open {person.name}'s profile"></button>

  <header>
    <Avatar id={person.id} name={person.name} size={56} />
    <div class="who">
      <h3>{person.name}</h3>
      {#if tag}<span class="chip">{tag}</span>{/if}
    </div>
    {#if person.linkedin}<LinkedIn href={person.linkedin} name={person.name} />{/if}
  </header>

  {#if person.offer?.title}
    <p class="service">{person.offer.title}</p>
  {/if}

  {#if blurb}
    <blockquote class:quote={!!person.ikigai}>{blurb}</blockquote>
  {:else}
    <p class="empty">Hasn’t shared their ikigai yet.</p>
  {/if}

  {#if person.values?.length}
    <ul class="values">
      {#each person.values as v}<li>{v}</li>{/each}
    </ul>
  {/if}

  <footer>
    <div class="meta">
      {#if bookable}
        <span class="price">{formatPrice(person.offer.price, person.offer.currency)}<small> / session</small></span>
      {:else}
        <span class="price soft">Price on request</span>
      {/if}
      {#if person.nextSlot}
        <span class="avail on"><i></i>Next: {formatShortDate(person.nextSlot.date)}, {person.nextSlot.time}</span>
      {:else}
        <span class="avail"><i></i>{bookable ? 'Fully booked — request a time' : 'Times on request'}</span>
      {/if}
    </div>
    <button class="btn small gold" onclick={() => onopen(person)}>
      {person.nextSlot ? 'Book a session' : 'Request a session'}
    </button>
  </footer>
</article>

<style>
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 22px;
    border-radius: var(--radius);
    background: var(--card);
    box-shadow: var(--shadow);
    border: 1px solid transparent;
    transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.35s;
    animation: rise 0.5s var(--ease) both;
    animation-delay: calc(var(--i) * 40ms);
  }
  .card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lift); border-color: var(--gold-soft); }
  .card:not(.bookable) { background: #fdfcfa; }
  @keyframes rise { from { opacity: 0; transform: translateY(12px); } }

  /* The whole card opens the profile; real buttons/links sit above it. */
  .hit { position: absolute; inset: 0; border-radius: var(--radius); z-index: 0; }
  header, footer, .btn { position: relative; z-index: 1; }
  .card > :not(.hit) { pointer-events: none; }
  .card :global(.btn) { pointer-events: auto; }

  header { display: flex; align-items: center; gap: 14px; }
  header :global(.li) { margin-left: auto; align-self: flex-start; pointer-events: auto; }
  .who { min-width: 0; display: grid; gap: 4px; justify-items: start; }
  h3 {
    font-family: var(--display);
    font-size: 23px;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.15;
    overflow-wrap: anywhere;
  }
  .chip { text-transform: capitalize; }
  .service { font-weight: 600; color: var(--ink); font-size: 15px; }
  blockquote {
    font-size: 14.5px;
    color: var(--text);
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  blockquote.quote {
    font-family: var(--display);
    font-size: 18px;
    font-style: italic;
    line-height: 1.45;
    padding-left: 14px;
    border-left: 2px solid var(--gold);
  }
  .empty { font-size: 14px; color: var(--muted); font-style: italic; }
  .values { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; }
  .values li {
    font-size: 12px;
    padding: 2px 9px;
    border-radius: 999px;
    border: 1px solid var(--line);
    color: var(--muted);
  }
  footer {
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .meta { display: grid; gap: 2px; }
  .price { font-family: var(--display); font-size: 22px; font-weight: 600; color: var(--ink); line-height: 1.1; }
  .price.soft { font-size: 18px; color: var(--text); }
  .price small { font-family: var(--body); font-size: 12px; font-weight: 400; color: var(--muted); }
  .avail { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); }
  .avail i { width: 7px; height: 7px; border-radius: 50%; background: #cfc8be; }
  .avail.on { color: var(--green); }
  .avail.on i { background: var(--green); box-shadow: 0 0 0 3px var(--green-soft); }
</style>
