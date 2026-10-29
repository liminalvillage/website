import { mount } from 'svelte'
import './site.js'
import Palette from './palette/Palette.svelte'

const app = mount(Palette, {
  target: document.getElementById('palette-app'),
})

export default app
