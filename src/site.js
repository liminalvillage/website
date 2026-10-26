// The shared header, bottom dock, design variables and (in dev) the vibe
// switcher, for the pages that are not the home page.
import { mount } from 'svelte'
import './theme/tokens.css'
import Navbar from './lib/Navbar.svelte'

document.documentElement.classList.add('has-site-nav')
const target = document.createElement('div')
document.body.prepend(target)
mount(Navbar, { target, props: { overHero: false } })

// Vibe explorations stay out of production builds
if (import.meta.env.DEV) import('./vibes/switcher.js')
