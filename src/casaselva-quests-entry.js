import { mount } from 'svelte'
import Quests from './lib/Quests.svelte'

const app = mount(Quests, {
  target: document.getElementById('quest-app'),
  props: {
    holonId: '-1002964866719',
    brandName: 'Casa Selva',
    homeHref: '/casaselva.html',
    tagline: 'Casa Selva — living quests for inner work, stewardship, and regeneration',
    contactEmail: 'hello@casaselva.earth',
  },
})

export default app
