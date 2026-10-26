// Dev-only switcher for comparing vibes on the real page. Sets data-vibe on
// <html>, loads that vibe's fonts, and remembers the choice in this browser.
import './vibes.css'

const VIBES = {
  original: { label: 'Original' },
  solar: {
    label: 'Solarpunk',
    fonts: 'family=Quicksand:wght@300..700&family=Nunito:wght@300..700',
  },
  cypher: {
    label: 'Cypherpunk',
    fonts: 'family=Comfortaa:wght@300..700&family=Outfit:wght@200..600',
  },
  astral: {
    label: 'Light',
    fonts: 'family=Outfit:wght@100..600&family=Quicksand:wght@300..700',
  },
}

const KEY = 'liminal-vibe'

function stored() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

function remember(name) {
  try {
    localStorage.setItem(KEY, name)
  } catch {}
}

function apply(name) {
  const vibe = VIBES[name] ? name : 'original'
  const root = document.documentElement
  if (vibe === 'original') root.removeAttribute('data-vibe')
  else root.setAttribute('data-vibe', vibe)

  const fonts = VIBES[vibe].fonts
  if (fonts && !document.querySelector(`link[data-vibe-fonts="${vibe}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?${fonts}&display=swap`
    link.dataset.vibeFonts = vibe
    document.head.appendChild(link)
  }

  document.querySelectorAll('.vibe-switcher button').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.vibe === vibe))
  })
  remember(vibe)
}

function render() {
  const bar = document.createElement('div')
  bar.className = 'vibe-switcher'
  bar.setAttribute('role', 'group')
  bar.setAttribute('aria-label', 'Vibe')
  bar.innerHTML = Object.entries(VIBES)
    .map(([key, v]) => `<button type="button" data-vibe="${key}">${v.label}</button>`)
    .join('')
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (b) apply(b.dataset.vibe)
  })

  const style = document.createElement('style')
  style.textContent = `
    .vibe-switcher { position: fixed; right: 3%; top: 31px; z-index: 2000;
      display: flex; gap: 2px; padding: 4px; border-radius: 999px; background: rgba(20, 20, 20, 0.72);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 8px 30px rgba(0,0,0,0.25);
      font: 500 11px/1 system-ui, sans-serif; max-width: calc(100vw - 32px); overflow-x: auto; }
    @media (max-width: 768px) { .vibe-switcher { top: auto; bottom: 72px; right: 50%; transform: translateX(50%); } }
    .vibe-switcher button { border: 0; background: transparent; color: rgba(255,255,255,0.75);
      padding: 6px 11px; border-radius: 999px; cursor: pointer; white-space: nowrap; font: inherit; }
    .vibe-switcher button:hover { color: #fff; }
    .vibe-switcher button[aria-pressed="true"] { background: #fff; color: #111; }
  `
  document.head.appendChild(style)
  document.body.appendChild(bar)
}

render()
apply(new URLSearchParams(location.search).get('vibe') || stored() || 'original')
