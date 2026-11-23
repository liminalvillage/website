<script>
  import LunationTimer from './LunationTimer.svelte';

  // Muted, looping YouTube video behind the hero; the drone photo shows until the
  // video is actually playing, so a paused frame or a play button never shows.
  // It starts at START, well into the footage, and is sent back there whenever
  // its loop restarts from 0.
  const VIDEO_ID = 'xIC_wGnDEkE';
  const START = 45;
  const videoSrc = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&start=${START}&controls=0&playsinline=1&disablekb=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`;

  let player;
  let playing = $state(false);
  let kicks = 0;

  const send = (msg) => player?.contentWindow?.postMessage(JSON.stringify(msg), '*');
  const command = (func, args = []) => send({ event: 'command', func, args });

  // Some browsers ignore autoplay=1 in an iframe: ask the player directly,
  // muted, a few times while it settles.
  function kick() {
    command('mute');
    command('playVideo');
  }

  // YouTube's iframe API over postMessage, without loading its script.
  function listen() {
    // If the player never reports "playing" (autoplay blocked, shields, slow
    // network), show the video anyway after a moment rather than hide it forever.
    setTimeout(() => { playing = true; }, 3500);
    send({ event: 'listening', id: 'hero' });
    kick();
    const retry = setInterval(() => {
      if (playing || ++kicks > 10) return clearInterval(retry);
      send({ event: 'listening', id: 'hero' });
      kick();
    }, 1000);
  }

  function onMessage(e) {
    let host;
    try { host = new URL(e.origin).hostname; } catch { return; }
    if (!/youtube(-nocookie)?\.com$/.test(host)) return;
    let data;
    try { data = JSON.parse(e.data); } catch { return; }

    if (data?.event === 'onReady') kick();

    // -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
    const state = data?.event === 'onStateChange' ? data.info : data?.info?.playerState;
    if (typeof state === 'number') {
      if (state === 1) playing = true;
      if (state === -1 || state === 2 || state === 5) kick();
    }

    const t = data?.info?.currentTime;
    if (state === 0 || (typeof t === 'number' && t < START - 1)) {
      command('seekTo', [START, true]);
      command('playVideo');
    }
  }
</script>

<svelte:window onmessage={onMessage} />

<section id="main-top" class="hero">
  <div class="hero-video" class:playing aria-hidden="true">
    <iframe bind:this={player} onload={listen} src={videoSrc} title="" tabindex="-1" allow="autoplay; encrypted-media; picture-in-picture" frameborder="0"></iframe>
  </div>
  <div class="shade"></div>
  <div class="wrap hero-in">
    <div class="copy">
      <p class="eyebrow">Co-living &amp; co-creation · Marche, Italy</p>
      <h1>Liminal Village</h1>
      <p class="tagline">
        An open-source eco-tech hub in the hills of central Italy, where people come together to
        co-create the future they want to live in, one lunar cycle at a time.
      </p>
      <div class="actions">
        <a class="btn light" href="/apply">Apply to visit</a>
        <a class="btn ghost" href="#about">Discover the village</a>
      </div>
      <p class="network">A node of the <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa</a> network</p>
    </div>
    <LunationTimer />
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    min-height: 100svh;
    display: flex;
    align-items: flex-end;
    color: #fff;
    background: #2a241c url('/images/droneview.jpg') center / cover no-repeat;
    overflow: hidden;
  }

  .hero-video { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 1.2s ease; }
  .hero-video.playing { opacity: 1; }
  /* Cover the hero with a 16:9 frame, like background-size: cover, zoomed a
     little so YouTube's title and logo overlays fall outside the hero */
  .hero-video iframe {
    position: absolute;
    top: 50%;
    left: 50%;
    width: max(100%, 177.78vh);
    height: max(100%, 56.25vw);
    transform: translate(-50%, -50%) scale(1.2);
    border: 0;
  }

  .shade {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(15, 13, 10, 0.45) 0%, rgba(15, 13, 10, 0.2) 30%, rgba(15, 13, 10, 0.85) 100%),
      linear-gradient(90deg, rgba(15, 13, 10, 0.75) 0%, rgba(15, 13, 10, 0.45) 45%, rgba(15, 13, 10, 0) 75%);
  }

  .hero-in {
    position: relative;
    width: 100%;
    padding-top: 140px;
    padding-bottom: 72px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 48px;
  }

  .copy { max-width: 640px; animation: rise 1.2s var(--ease) both; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5), 0 2px 24px rgba(0, 0, 0, 0.45); }
  .copy .btn { text-shadow: none; }
  .eyebrow { color: #e8c490; }
  h1 {
    margin-top: 14px;
    font-family: var(--display);
    font-weight: 500;
    font-size: clamp(54px, 9vw, 112px);
    line-height: 0.95;
    letter-spacing: 0.5px;
    color: #fff;
  }
  .tagline {
    margin-top: 22px;
    font-size: 19px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.95);
  }
  .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
  .actions .ghost { color: #fff; }
  .network {
    margin-top: 28px;
    font-size: 13px;
    letter-spacing: 0.4px;
    color: rgba(255, 255, 255, 0.85);
  }
  .network a { color: #fff; border-bottom: 1px solid rgba(232, 196, 144, 0.8); }

  /* The lunation card sits bottom-right instead of in the middle of the photo */
  .hero-in :global(.lt) { margin-top: 0; }

  @keyframes rise { from { opacity: 0; transform: translateY(18px); } }

  @media (prefers-reduced-motion: reduce) {
    .hero-video { display: none; }
  }

  @media (max-width: 900px) {
    .hero-in { grid-template-columns: 1fr; gap: 32px; padding-top: 150px; padding-bottom: 48px; }
    .tagline { font-size: 17px; }
    /* text spans the full width here: darken the whole frame evenly */
    .shade { background: linear-gradient(180deg, rgba(15, 13, 10, 0.55), rgba(15, 13, 10, 0.5) 40%, rgba(15, 13, 10, 0.88)); }
  }
</style>
