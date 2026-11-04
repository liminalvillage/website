<script>
  // A glimpse of a lunation while it is hovered on the spiral, flat or in
  // 3D: its name and days, the light it brings, and what is on in it, so it
  // can be read without opening it. It follows the pointer, kept on screen.
  import { KINDS, CHILDREN } from './source.js';

  export let lunation; // { index, name, start, end, heat, now, items, sunAt }
  export let x = 0;
  export let y = 0;

  const W = 260;
  const fmt = (t) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  $: items = (lunation?.items ?? []).filter((it) => it.title).slice().sort((a, b) => a.at - b.at);
  $: light = lunation?.sunAt ? lunation.sunAt.change : 0;
  $: left = Math.min(x + 18, (typeof window !== 'undefined' ? window.innerWidth : 1200) - W - 12);
  $: top = Math.max(12, Math.min(y + 18, (typeof window !== 'undefined' ? window.innerHeight : 800) - 220));
</script>

{#if lunation}
  <aside class="peek" style="left: {left}px; top: {top}px; width: {W}px; --heat: {lunation.heat}">
    <header>
      <b>{lunation.index}</b>
      <span>
        <em>{lunation.name}</em>
        <small>{fmt(lunation.start)} to {fmt(lunation.end)}{lunation.now ? ' · now' : ''}</small>
      </span>
    </header>
    {#if lunation.sunAt}
      <p class="light">
        sun {lunation.sunAt.first.rise} to {lunation.sunAt.first.set}
        {#if light}· days {light > 0 ? 'lengthen' : 'shorten'} by {Math.abs(light)} min{/if}
      </p>
    {/if}
    {#if items.length}
      <ul>
        {#each items.slice(0, 5) as it}
          <li><i style="background: {it.children ? CHILDREN : KINDS[it.kind]?.colour ?? '#6b5a4a'}"></i><span>{fmt(it.at)}</span> {it.title}</li>
        {/each}
        {#if items.length > 5}<li class="more">and {items.length - 5} more</li>{/if}
      </ul>
    {:else}
      <p class="quiet">nothing noted yet</p>
    {/if}
    <p class="open">tap to open</p>
  </aside>
{/if}

<style>
  .peek {
    position: fixed;
    z-index: 1300;
    padding: 12px 14px 10px;
    border: 1px solid color-mix(in srgb, var(--bark-900) 14%, transparent);
    border-radius: 14px;
    background: radial-gradient(circle at 0 0, color-mix(in srgb, var(--heat) 22%, #fffdf8), #fffdf8 70%);
    box-shadow: 0 10px 30px -14px rgba(60, 40, 20, 0.35);
    color: var(--bark-900);
    font: 300 12px/1.4 'Playpen Sans', 'Quicksand', sans-serif;
    pointer-events: none;
    animation: peek-in 0.18s ease-out;
  }

  @keyframes peek-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
  }

  header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  header b {
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    border: 1px solid color-mix(in srgb, var(--bark-900) 55%, transparent);
    border-radius: 50%;
    background: color-mix(in srgb, var(--heat) 40%, #fffdf8);
    font: 300 15px 'Outfit', system-ui, sans-serif;
  }

  header span {
    display: flex;
    flex-direction: column;
  }

  header em {
    font-style: normal;
    font-size: 14px;
  }

  small,
  .light,
  .quiet,
  .open,
  .more {
    color: var(--bark-700, #5a4632);
  }

  .light {
    margin: 8px 0 4px;
    font-size: 11px;
  }

  ul {
    margin: 6px 0 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    gap: 6px;
    align-items: baseline;
    margin: 3px 0;
  }

  li i {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    transform: translateY(-1px);
  }

  li span {
    flex: none;
    color: var(--bark-700, #5a4632);
    font-size: 11px;
  }

  .quiet {
    margin: 6px 0 0;
  }

  .open {
    margin: 8px 0 0;
    font-size: 10.5px;
    text-align: right;
  }
</style>
