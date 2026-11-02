// The shared header, bottom dock, background mycelium, design variables
// and seasonal colours, for the pages that are not the home page.
import { mount } from 'svelte'
import './theme/tokens.css'
import Navbar from './lib/Navbar.svelte'
import Mycelium from './lib/Mycelium.svelte'
import { applySeason } from './theme/season.js'

applySeason()

document.documentElement.classList.add('has-site-nav')
const target = document.createElement('div')
document.body.prepend(target)
mount(Navbar, { target, props: { overHero: false } })

// faint mycelium in the background, behind every page's content
const roots = document.createElement('div')
document.body.prepend(roots)
mount(Mycelium, { target: roots })

