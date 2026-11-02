import { mount } from 'svelte'
import './site.js'
import Timeline from './timeline/Timeline.svelte'

const app = mount(Timeline, {
  target: document.getElementById('timeline-app'),
})

export default app
