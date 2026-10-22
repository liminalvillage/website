<script>
  let { href, name = '', label = false } = $props();
</script>

<a class="li" class:label {href} target="_blank" rel="noopener noreferrer" aria-label="{name} on LinkedIn" title="LinkedIn">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
  {#if label}<span>LinkedIn</span>{/if}
</a>

<style>
  .li {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: none;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    color: #0a66c2;
    transition: background 0.2s, transform 0.2s;
  }
  .li:hover { background: #e8f1fb; transform: translateY(-1px); }
  .li svg { width: 18px; height: 18px; fill: currentColor; }
  .li.label { width: auto; padding: 0 14px; border: 1px solid #cfe0f3; border-radius: 999px; font-size: 13px; font-weight: 600; height: 36px; }
</style>
