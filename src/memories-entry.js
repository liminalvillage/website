import { mount } from 'svelte'
import './site.js'
import Memories from './memories/Memories.svelte'

const app = mount(Memories, {
  target: document.getElementById('memories-app'),
})

export default app
