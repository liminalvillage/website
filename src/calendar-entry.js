import { mount } from 'svelte'
import './site.js'
import Lunations from './calendar/Lunations.svelte'
import './services/services.css'
import './calendar/lunations.css'

const app = mount(Lunations, {
  target: document.getElementById('lunations-app'),
})

export default app
