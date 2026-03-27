import { mount } from 'svelte'
import Quests from './lib/Quests.svelte'

const app = mount(Quests, {
  target: document.getElementById('quest-app'),
})

export default app
