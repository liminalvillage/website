<script>
  import LunationTimer from './LunationTimer.svelte';

  // Muted, looping YouTube video behind the hero; the drone photo shows until it loads.
  // It starts at START, after the video's title frames and group shot, and the
  // player is sent back there whenever its loop restarts from 0.
  const VIDEO_ID = 'xIC_wGnDEkE';
  const START = 22;
  const videoSrc = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&start=${START}&controls=0&playsinline=1&disablekb=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`;

  let player;

  const send = (msg) => player?.contentWindow?.postMessage(JSON.stringify(msg), '*');

  // YouTube's iframe API over postMessage, without loading its script.
  function listen() {
    send({ event: 'listening', id: 'hero' });
  }

  function onMessage(e) {
    if (!/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return;
    let data;
    try { data = JSON.parse(e.data); } catch { return; }
    const t = data?.info?.currentTime;
    const ended = data?.event === 'onStateChange' && data.info === 0;
    if (ended || (typeof t === 'number' && t < START - 1)) {
      send({ event: 'command', func: 'seekTo', args: [START, true] });
      send({ event: 'command', func: 'playVideo', args: [] });
    }
  }
</script>

<svelte:window onmessage={onMessage} />

<section id="main-top" class="hero">
  <div class="hero-video" aria-hidden="true">
    <iframe bind:this={player} onload={listen} src={videoSrc} title="" tabindex="-1" allow="autoplay; encrypted-media; picture-in-picture" frameborder="0"></iframe>
  </div>
  <div class="hero-content">
    <div class="hero-text">
      <h1>Liminal Village</h1>
      <p class="subtitle">Open Source Innovation Eco-Tech Hub</p>
      <p class="network-line">
        A node of the <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa</a> network
      </p>
    </div>
    <LunationTimer />
    <a href="#about" class="scroll-down" aria-label="Scroll down to About section">
      <span class="arrow"></span>
    </a>
  </div>
</section>

<style>
  .hero {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    background-image: url('/images/droneview.jpg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    overflow: hidden;
  }

  .hero-video {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

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

  .hero-content {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, color-mix(in srgb, var(--night) 55%, transparent), color-mix(in srgb, var(--accent) 20%, transparent));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .hero-text {
    text-align: center;
    animation: fadeInDown 1.5s ease;
  }

  .hero-text h1 {
    color: var(--on-dark);
    font-size: 3.5rem;
    font-weight: 300;
    letter-spacing: 8px;
    margin: 0;
    text-transform: uppercase;
  }

  .subtitle {
    color: color-mix(in srgb, var(--accent-soft) 90%, transparent);
    font-size: 1rem;
    font-weight: 300;
    letter-spacing: 5px;
    text-transform: uppercase;
    margin-top: 1rem;
  }

  .network-line {
    color: color-mix(in srgb, var(--on-dark) 85%, transparent);
    font-size: 0.85rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 0.75rem;
  }

  .network-line a {
    color: var(--on-dark);
    border-bottom: 1px solid color-mix(in srgb, var(--accent-soft) 90%, transparent);
    text-decoration: none;
  }

  .scroll-down {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: inline-block;
    text-decoration: none;
  }

  .arrow {
    display: block;
    width: 24px;
    height: 24px;
    border-left: 2px solid var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
    transform: rotate(-45deg);
    animation: bounce 2s infinite;
    opacity: 0.7;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) rotate(-45deg);
    }
    40% {
      transform: translateY(-10px) rotate(-45deg);
    }
    60% {
      transform: translateY(-5px) rotate(-45deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-video {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .hero {
      background-attachment: scroll;
    }

    .hero-text h1 {
      font-size: 2.2rem;
      letter-spacing: 5px;
    }

    .subtitle {
      font-size: 0.8rem;
      letter-spacing: 3px;
    }

    .network-line {
      font-size: 0.75rem;
      letter-spacing: 2px;
      padding: 0 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .hero-text h1 {
      font-size: 1.6rem;
      letter-spacing: 3px;
    }

    .subtitle {
      font-size: 0.7rem;
      letter-spacing: 2px;
    }

    .network-line {
      font-size: 0.68rem;
      letter-spacing: 1.5px;
    }
  }
</style>
