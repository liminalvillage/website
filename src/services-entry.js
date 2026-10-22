import { mount } from 'svelte'
import Services from './services/Services.svelte'
import './services/services.css'

const app = mount(Services, {
  target: document.getElementById('services-app'),
})

export default app
