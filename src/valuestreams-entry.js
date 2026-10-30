import { mount } from 'svelte'
import './site.js'
import ValueStreams from './valuestreams/ValueStreams.svelte'

const app = mount(ValueStreams, {
  target: document.getElementById('value-streams-app'),
})

export default app
