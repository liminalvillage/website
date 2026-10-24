<script>
  // Direct message on Telegram: t.me/<username> opens a chat with them.
  let { username, name = '', label = false } = $props();
</script>

<a class="tg" class:label href="https://t.me/{username}" target="_blank" rel="noopener noreferrer" aria-label="Message {name} on Telegram" title="Message on Telegram">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.94 4.3 18.8 19.13c-.24 1.05-.86 1.31-1.74.82l-4.8-3.54-2.32 2.23c-.26.26-.47.47-.96.47l.34-4.88 8.88-8.02c.39-.34-.08-.53-.6-.19L6.62 12.94l-4.73-1.48c-1.03-.32-1.05-1.03.21-1.52L20.6 2.8c.86-.32 1.6.19 1.34 1.5z" /></svg>
  {#if label}<span>Message</span>{/if}
</a>

<style>
  .tg {
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
    color: #229ed9;
    transition: background 0.2s, transform 0.2s;
  }
  .tg:hover { background: #e6f4fb; transform: translateY(-1px); }
  .tg svg { width: 18px; height: 18px; fill: currentColor; }
  .tg.label { width: auto; padding: 0 14px; border: 1px solid #c7e6f5; border-radius: 999px; font-size: 13px; font-weight: 600; height: 36px; }
</style>
