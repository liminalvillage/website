import { mount } from 'svelte'
import './site.js'
import Concepts from './concepts/Concepts.svelte'

const app = mount(Concepts, {
  target: document.getElementById('concepts-app'),
})

export default app
