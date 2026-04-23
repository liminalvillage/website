import { mount } from 'svelte'

const host = typeof window !== 'undefined'
  ? window.location.hostname.toLowerCase()
  : ''

const site = host.includes('casaselva')
  ? 'casaselva'
  : (host.includes('refactory') || host.includes('brickfactory'))
    ? 'refactory'
    : 'liminal'

async function boot() {
  if (site === 'casaselva') {
    document.documentElement.setAttribute('data-site', 'casaselva')
    document.title = 'Casa Selva — A living school for becoming more fully human'
    setMeta('description',
      'Casa Selva — a living school for becoming more fully human. A regenerative hub in the mountains near Ascoli Piceno, Italy, supporting inner work, relational depth, and stewardship of the land.')
    const [{ default: App }] = await Promise.all([
      import('./casaselva/App.svelte'),
      import('./casaselva/casaselva.css'),
    ])
    return mount(App, { target: document.getElementById('app') })
  }

  if (site === 'refactory') {
    document.documentElement.setAttribute('data-site', 'refactory')
    document.title = 'ReFactory — A co-creation space for symbiotic innovation'
    setMeta('description',
      'ReFactory — a co-creation space in the Marche region, Italy. Maker workshops, co-living community, and community-owned initiatives 10 minutes from Ascoli Piceno.')
    const [{ default: App }] = await Promise.all([
      import('./refactory/App.svelte'),
      import('./refactory/refactory.css'),
    ])
    return mount(App, { target: document.getElementById('app') })
  }

  document.documentElement.setAttribute('data-site', 'liminal')
  const [{ default: App }] = await Promise.all([
    import('./App.svelte'),
    import('./app.css'),
  ])
  return mount(App, { target: document.getElementById('app') })
}

function setMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export default boot()

