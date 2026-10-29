<script>
  import { onMount } from 'svelte';
  // The village video, full screen and fixed behind the home page journey.
  // Same muted, looping YouTube video as the hero, over plain off-black until
  // it plays. It starts at START, after the video's title frames, and
  // is sent back there whenever its loop restarts from 0.
  const VIDEO_ID = 'xIC_wGnDEkE';
  const START = 22;
  // Moments of the video to leave out, as [from, to] in seconds: when the
  // player reaches one, it jumps to its end
  const SKIP = [];
  // No loop/playlist parameters: as a playlist YouTube draws previous and
  // next buttons over the picture. The end is caught below and sent back to
  // START instead.
  const videoSrc = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&start=${START}&controls=0&playsinline=1&disablekb=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`;

  let player;
  // YouTube draws its own play, pause and loading buttons whenever the video
  // isn't playing smoothly (loading, buffering, paused, seeking, ended), and
  // flashes a glyph for about a second when playback starts. So the picture
  // is only shown once its time has been moving steadily for a while, and
  // hidden the moment it stops moving, jumps, or the player says it isn't
  // playing; the off-black shows instead.
  const SETTLE_MS = 1500;
  // YouTube reports the time about every quarter second, so a gap a little
  // longer than that already means it has stalled
  const STALL_MS = 450;
  let shown = false;
  // After the opening drawing, the video waits to fade in together with the
  // phase moons around the hub moon ("intro-landed")
  let cue = false;
  let lastT = -1;
  let movingSince = 0;
  let movedAt = 0;

  function stop() {
    shown = false;
    movingSince = 0;
  }

  function watch() {
    const now = performance.now();
    if (document.hidden || now - movedAt > STALL_MS) stop();
    else if (cue && movingSince && now - movingSince > SETTLE_MS) shown = true;
  }
  // Behind the opening drawing the player isn't loaded at all: it loads
  // fresh as the drawing ends and starts at START by itself, so it never has
  // to be sent back (a seek is what makes YouTube flash its buttons)
  let load = false;

  const send = (msg) => player?.contentWindow?.postMessage(JSON.stringify(msg), '*');

  // YouTube's iframe API over postMessage, without loading its script.
  function listen() {
    send({ event: 'listening', id: 'backdrop' });
  }

  const start = () => (load = true);
  const ready = () => setTimeout(() => (cue = true), 900);

  onMount(() => {
    // Asked once the opening drawing has had its turn to mount
    requestAnimationFrame(() => {
      if (!document.documentElement.classList.contains('intro')) {
        start();
        cue = true;
      }
    });
    addEventListener('intro-end', start);
    addEventListener('intro-landed', ready);
    const watcher = setInterval(watch, 150);
    return () => {
      removeEventListener('intro-end', start);
      removeEventListener('intro-landed', ready);
      clearInterval(watcher);
    };
  });

  function onMessage(e) {
    if (!/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return;
    let data;
    try { data = JSON.parse(e.data); } catch { return; }
    const t = data?.info?.currentTime;
    const state = data?.event === 'onStateChange' ? data.info : data?.info?.playerState;
    if (typeof state === 'number' && state !== 1) stop();
    if (typeof t === 'number') {
      if (t < lastT - 0.5) stop();
      else if (t > lastT + 0.01) {
        movedAt = performance.now();
        if (!movingSince) movingSince = movedAt;
      }
      lastT = t;
    }
    const ended = data?.event === 'onStateChange' && data.info === 0;
    if (ended || (typeof t === 'number' && t < START - 1)) {
      send({ event: 'command', func: 'seekTo', args: [START, true] });
      send({ event: 'command', func: 'playVideo', args: [] });
      return;
    }
    const skip = typeof t === 'number' && SKIP.find(([from, to]) => t >= from && t < to);
    if (skip) send({ event: 'command', func: 'seekTo', args: [skip[1], true] });
  }
</script>

<svelte:window onmessage={onMessage} />

<div class="backdrop" aria-hidden="true">
  {#if load}<iframe class:shown bind:this={player} onload={listen} src={videoSrc} title="" tabindex="-1" allow="autoplay; encrypted-media; picture-in-picture" frameborder="0"></iframe>{/if}
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    /* Plain off-black behind the video: what the opening drawing's paper
       fades into, and what shows whenever the video isn't playing */
    background: #14110e;
  }

  /* Cover the screen with a 16:9 frame, zoomed a little so YouTube's title
     and logo overlays fall outside it */
  iframe {
    position: absolute;
    top: 50%;
    left: 50%;
    width: max(100%, 177.78vh);
    height: max(100%, 56.25vw);
    transform: translate(-50%, -50%) scale(1.2);
    border: 0;
    opacity: 0;
  }

  /* It fades in, but disappears at once when it stops, before YouTube can
     draw its buttons */
  iframe.shown {
    opacity: 1;
    transition: opacity 4s cubic-bezier(0.45, 0, 0.3, 1);
  }

  /* A veil so the circles and their words read over the moving picture */
  .backdrop::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--veil-journey, radial-gradient(circle at 50% 45%, rgba(18, 14, 11, 0.58), rgba(18, 14, 11, 0.82)));
  }
</style>
