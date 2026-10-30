<script>
  // The invitation to add knowledge to the experiment. It stands out in the
  // top corner on wider screens; "inline" places it in the page's header on
  // phones instead.
  export let inline = false;
</script>

<aside class="invite" class:inline>
  <p class="invite-title">Add your knowledge to the experiment</p>
  <p>
    Articles, learnings or data that could improve how value flows here? This is an open-source Game B experiment,
    taking learnings into practice and sharing our transition.
  </p>
  <p class="invite-links">
    <a href="/dna">Our DNA</a>
    <a href="/media">Open library</a>
    <a href="https://github.com/liminalvillage/website" target="_blank" rel="noopener">Contribute on GitHub</a>
  </p>
</aside>

<style>
  /* Up in the top corner, beside the header, so the views get the screen */
  .invite {
    position: fixed;
    top: 14px;
    right: max(24px, 3%);
    z-index: 1100;
    width: min(360px, 30vw);
    padding: 12px 18px 13px;
    border-radius: 22px;
    background: radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--ember-200) 85%, white), color-mix(in srgb, var(--rosehip-200) 40%, transparent) 80%);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--ember-500) 25%, transparent), 0 10px 40px color-mix(in srgb, var(--ember-400) 25%, transparent);
    font-family: 'Quicksand', system-ui, sans-serif;
    font-size: 0.8rem;
    line-height: 1.45;
    color: var(--bark-800);
    animation: glow 4s ease-in-out infinite alternate;
  }

  @keyframes glow {
    to {
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--ember-500) 40%, transparent), 0 10px 50px color-mix(in srgb, var(--ember-400) 45%, transparent);
    }
  }

  .invite p {
    margin: 0;
  }

  .invite .invite-title {
    margin-bottom: 4px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 1rem;
    color: var(--bark-900);
  }

  .invite .invite-links {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    margin-top: 8px;
  }

  .invite a {
    color: var(--rust-700);
    text-decoration: none;
    border-bottom: 1px solid currentColor;
  }

  .invite.inline {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .invite {
      animation: none;
    }
  }

  @media (max-width: 760px) {
    .invite {
      display: none;
    }

    .invite.inline {
      display: block;
      position: static;
      width: auto;
    }
  }
</style>
