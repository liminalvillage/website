import { mount } from 'svelte'

const host = typeof window !== 'undefined'
  ? window.location.hostname.toLowerCase()
  : ''
const isCasaSelva = host.includes('casaselva')

async function boot() {
  if (isCasaSelva) {
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
