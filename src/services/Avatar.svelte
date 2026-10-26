<script>
  import { avatarUrl } from './api.js';

  let { id, name = '', size = 56 } = $props();
  let failed = $state(false);

  // Initials on a warm tint picked from the id, until (or unless) the photo loads.
  const TINTS = ['#e9d3b4', '#d9e3cf', '#e6d6cc', '#d8dde6', '#eadcc0', '#dcd3e3'];
  const initials = $derived(
    name.replace(/[^\p{L}\s]/gu, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '·'
  );
  const tint = $derived(TINTS[Math.abs([...String(id)].reduce((a, c) => a * 31 + c.charCodeAt(0), 7)) % TINTS.length]);
</script>

<span class="avatar" style="--s:{size}px; --tint:{tint}">
  <span class="initials" aria-hidden="true">{initials}</span>
  {#if !failed}
    <img src={avatarUrl(id)} alt="" loading="lazy" onerror={() => (failed = true)} />
  {/if}
</span>

<style>
  .avatar {
    position: relative;
    flex: none;
    width: var(--s);
    height: var(--s);
    border-radius: 50%;
    overflow: hidden;
    background: var(--tint);
    display: grid;
    place-items: center;
    box-shadow: 0 0 0 3px var(--on-dark), 0 0 0 4px var(--line);
  }
  .initials {
    font-family: var(--display);
    font-size: calc(var(--s) * 0.4);
    font-weight: 600;
    color: rgba(0, 0, 0, 0.55);
  }
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
