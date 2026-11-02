<script>
  // A choice drawn in the site's own hand, in place of the browser's menu:
  // the chosen words with a dashed underline, and when opened, a small sheet
  // of paper with the choices, the chosen one ringed. Keys work as in a
  // menu: arrows to move, Enter to choose, Escape to close.
  import { tick } from 'svelte';
  export let value = '';
  export let options = []; // [{ value, label }]
  export let label = '';

  let open = false;
  let at = 0;
  let root;
  let list;
  $: current = options.find((o) => o.value === value) ?? options[0];

  async function show() {
    open = true;
    at = Math.max(0, options.findIndex((o) => o.value === value));
    await tick();
    list?.children[at]?.focus();
  }
  function choose(o) {
    value = o.value;
    open = false;
    root.querySelector('.pick-now').focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') {
      open = false;
      root.querySelector('.pick-now').focus();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      at = (at + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      list.children[at].focus();
    } else return;
    e.preventDefault();
  }
  const away = (e) => open && !root.contains(e.target) && (open = false);
</script>

<svelte:window on:pointerdown={away} />

<span class="pick" bind:this={root}>
  <button type="button" class="pick-now" aria-haspopup="listbox" aria-expanded={open} aria-label="{label}: {current?.label}" on:click={() => (open ? (open = false) : show())}>
    {current?.label}
  </button>
  {#if open}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <ul class="pick-sheet" role="listbox" aria-label={label} bind:this={list} on:keydown={onKey}>
      {#each options as o}
        <li role="option" aria-selected={o.value === value} tabindex="-1" class:on={o.value === value} on:click={() => choose(o)} on:keydown={(e) => e.key === 'Enter' && choose(o)}>
          <svg viewBox="-6 -6 12 12" aria-hidden="true"><circle r="3.6" /></svg>
          {o.label}
        </li>
      {/each}
    </ul>
  {/if}
</span>

<style>
  .pick {
    position: relative;
    display: inline-block;
  }

  .pick-now {
    padding: 0 2px;
    border: 0;
    border-bottom: 1px dashed color-mix(in srgb, var(--bark-900) 45%, transparent);
    background: none;
    color: var(--bark-900);
    font: inherit;
    cursor: pointer;
  }

  .pick-sheet {
    position: absolute;
    left: -14px;
    top: calc(100% + 8px);
    z-index: 20;
    display: grid;
    min-width: max-content;
    margin: 0;
    padding: 8px 6px;
    border: 1px solid color-mix(in srgb, var(--bark-900) 12%, transparent);
    border-radius: 14px;
    background: color-mix(in srgb, var(--tl-paper, #fffaf2) 97%, #fff);
    box-shadow: 0 10px 30px color-mix(in srgb, var(--bark-900) 14%, transparent);
    list-style: none;
    animation: sheet-in 0.18s ease-out;
  }

  @keyframes sheet-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
  }

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 12px 5px 8px;
    border-radius: 9px;
    color: var(--bark-800, #4a3828);
    cursor: pointer;
    outline: none;
  }

  li:hover,
  li:focus {
    background: color-mix(in srgb, var(--tl-ember, #fdd7bb) 45%, transparent);
  }

  li svg {
    flex: none;
    width: 12px;
    height: 12px;
  }

  li circle {
    fill: none;
    stroke: color-mix(in srgb, var(--bark-900) 30%, transparent);
    stroke-width: 0.8;
  }

  li.on circle {
    fill: var(--bark-900);
    stroke: var(--bark-900);
  }

  li.on {
    color: var(--bark-900);
  }
</style>
