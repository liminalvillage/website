<script>
  // A small terminal at the bottom left that types out the About text, in
  // the spirit of the Framer prototype. Closed, it is only a ">_" prompt;
  // opening it moves the dock aside (html.terminal-open) so the two never
  // overlap.
  import { onDestroy } from 'svelte';

  const TEXT = `Liminal Village is a co-living and co-creation eco-tech hub in the center of Italy. We have been experimenting with forming and weaving temporary communities aimed at creating value for the world, heal themselves and heal the collective, by emphasising the balance of personal, local and global regeneration. Inspired by the concept of a Resource-Based Economy, Liminal, meaning "a place of transition" or "a place that occupies both sides", is an embodied experimental ground where value-aligned people come together to co-create and experience the future they would like to see (eg: Game B). Using natural cycles to guide progress, we focus on reinventing how we can live in harmony with each other and the planet, by "upgrading the operating system of society" and transitioning from scarcity based market economies to "access abundance".`;

  let open = false;
  let shown = 0;
  let timer = 0;
  let screen;

  function type() {
    shown = Math.min(TEXT.length, shown + 2);
    // Keep the newest line in view as it types
    requestAnimationFrame(() => screen && (screen.scrollTop = screen.scrollHeight));
    timer = shown < TEXT.length ? setTimeout(type, 28) : 0;
  }

  function toggle() {
    open = !open;
    document.documentElement.classList.toggle('terminal-open', open);
    clearTimeout(timer);
    if (open && shown < TEXT.length) timer = setTimeout(type, 400);
  }

  onDestroy(() => {
    clearTimeout(timer);
    document.documentElement.classList.remove('terminal-open');
  });
</script>

<div class="terminal" class:open>
  <div class="bar">
    <button type="button" class="toggle" on:click={toggle} aria-expanded={open} aria-label={open ? 'Close the terminal' : 'Open the terminal'}>
      {#if open}[x]{:else}&gt;_{/if}
    </button>
    <span class="path">liminal-terminal — info — 80×24</span>
  </div>
  <div class="screen" bind:this={screen} aria-live="polite">
    <p><span class="cmd">liminal@village:~$ cat info.txt</span>{TEXT.slice(0, shown)}<span class="cursor">█</span></p>
  </div>
</div>

<style>
  /* Closed: just the prompt on the video. Open: a plain terminal window,
     near black with square corners and one fine border */
  .terminal {
    position: fixed;
    left: 20px;
    bottom: 22px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    width: 46px;
    height: 40px;
    color: #e9e4da;
    font: 12px/1.6 ui-monospace, 'SF Mono', Menlo, 'Courier New', monospace;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.7);
    background: rgba(8, 8, 8, 0);
    border: 1px solid transparent;
    border-radius: 3px;
    overflow: hidden;
    transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease, border-color 0.4s ease;
  }

  .terminal.open {
    width: 380px;
    height: 230px;
    text-shadow: none;
    background: rgba(28, 26, 24, 0.5);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .bar {
    display: flex;
    align-items: center;
    flex: none;
    height: 38px;
    white-space: nowrap;
    border-bottom: 1px solid transparent;
    transition: border-color 0.4s ease;
  }

  .open .bar {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }

  .toggle {
    flex: none;
    width: 44px;
    height: 38px;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    font-size: 14px;
    cursor: pointer;
    opacity: 0.75;
  }

  .toggle:hover,
  .open .toggle {
    opacity: 1;
  }

  .path {
    color: rgba(233, 228, 218, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .screen {
    flex: 1;
    padding: 10px 14px 14px;
    overflow-y: auto;
    scrollbar-width: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s;
  }

  .open .path,
  .open .screen {
    opacity: 1;
    visibility: visible;
    transition-delay: 0.3s;
  }

  .screen p {
    margin: 0;
    text-align: left;
  }

  .cmd {
    display: block;
    color: rgba(233, 228, 218, 0.5);
  }

  .cursor {
    animation: blink 1s steps(1) infinite;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  /* On narrow screens the terminal opens above the dock instead */
  @media (max-width: 899px) {
    .terminal {
      left: 16px;
      bottom: 74px;
    }

    .terminal.open {
      width: calc(100vw - 32px);
      height: 200px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .terminal,
    .cursor {
      transition: none;
      animation: none;
    }
  }
</style>
