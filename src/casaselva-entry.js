import { mount } from 'svelte'
import './casaselva/casaselva.css'
import App from './casaselva/App.svelte'

const app = mount(App, {
  target: document.getElementById('casaselva-app'),
})

export default app
