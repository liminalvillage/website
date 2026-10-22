import { mount } from 'svelte'
import Apply from './apply/Apply.svelte'
import Admin from './apply/Admin.svelte'
import './services/services.css'

// Steward area: /apply/admin (or /apply?admin, e.g. on the vite dev server).
const isAdmin = location.pathname.replace(/\/+$/, '') === '/apply/admin' || new URLSearchParams(location.search).has('admin')

const app = mount(isAdmin ? Admin : Apply, {
  target: document.getElementById('apply-app'),
})

export default app
