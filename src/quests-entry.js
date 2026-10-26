import { mount } from 'svelte'
import './site.js'
import Quests from './lib/Quests.svelte'

const app = mount(Quests, {
  target: document.getElementById('quest-app'),
})

export default app
