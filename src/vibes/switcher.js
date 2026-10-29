// Dev-only switcher for comparing vibes on the real page. Sets data-vibe on
// <html>, loads that vibe's fonts, and remembers the choice in this browser.
// It stays folded into a small dot in the corner, so the page looks as it
// will live; click the dot to open it.
import './vibes.css'

const VIBES = {
  original: { label: 'Original' },
  autumn: {
    label: 'Autumn',
    fonts: 'family=Outfit:wght@100..600&family=Quicksand:wght@300..700',
  },
  lunar: {
    label: 'Lunarpunk',
    fonts: 'family=Outfit:wght@100..600&family=Quicksand:wght@300..700',
  },
  psy: {
    label: 'Psychedelic',
    fonts: 'family=Outfit:wght@100..600&family=Quicksand:wght@300..700',
  },
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
  bar.innerHTML =
    '<button type="button" class="vibe-toggle" aria-expanded="false" aria-label="Vibes"></button>' +
    Object.entries(VIBES)
      .map(([key, v]) => `<button type="button" data-vibe="${key}">${v.label}</button>`)
      .join('')
  const toggle = bar.querySelector('.vibe-toggle')
  const fold = (open) => {
    bar.classList.toggle('open', open)
    toggle.setAttribute('aria-expanded', String(open))
  }
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (!b) return
    if (b === toggle) return fold(!bar.classList.contains('open'))
    apply(b.dataset.vibe)
    fold(false)
  })

  const style = document.createElement('style')
  style.textContent = `
    .vibe-switcher { position: fixed; right: 3%; top: 36px; z-index: 2000;
      display: flex; align-items: center; gap: 2px; padding: 4px; border-radius: 999px;
      font: 500 11px/1 system-ui, sans-serif; max-width: calc(100vw - 32px); overflow-x: auto; }
    .vibe-switcher.open { background: rgba(20, 20, 20, 0.72); backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px); box-shadow: 0 8px 30px rgba(0,0,0,0.25); }
    .vibe-switcher:not(.open) button:not(.vibe-toggle) { display: none; }
    .vibe-switcher .vibe-toggle { width: 22px; height: 22px; padding: 0; opacity: 0.35;
      background: radial-gradient(circle, rgba(255,255,255,0.9) 0 3px, transparent 4px); }
    .vibe-switcher .vibe-toggle:hover, .vibe-switcher.open .vibe-toggle { opacity: 0.9; }
    @media (max-width: 768px) { .vibe-switcher { top: 24px; right: 12px; } }
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
