// /dna: the page is a DNA strand. A three.js helix runs down it 1:1 with the
// scroll (helix.js); each .gene is a coloured segment and every .allele card is
// wired to a base pair by an SVG line that follows the helix as it turns.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { GENES, FRAMEWORKS } from './content.js';
import './dna.css';
import '../site.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const genes = [...document.querySelectorAll('.gene')];
const SVG = 'http://www.w3.org/2000/svg';
const wires = document.querySelector('.wires');
let helix = null;

document.getElementById('year').textContent = new Date().getFullYear();

// ---------- smooth scroll ----------
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
}
const scrollY = () => (lenis ? lenis.scroll : window.scrollY);
function goTo(el) {
  if (lenis) lenis.scrollTo(el, { offset: -30, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  const el = a && document.querySelector(a.getAttribute('href'));
  if (!el) return;
  e.preventDefault();
  goTo(el);
  history.replaceState(null, '', a.getAttribute('href'));
});

// ---------- measuring the page ----------
// Offsets ignore transforms, so cards mid-reveal still measure where they settle.
function pageTop(el) { let y = 0; for (; el; el = el.offsetParent) y += el.offsetTop; return y; }
function pageLeft(el) { let x = 0; for (; el; el = el.offsetParent) x += el.offsetLeft; return x; }
const cssNum = (name) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));

let layout = null;
let cards = [];
let sections = [];
let signature = '';

function measure() {
  const vw = document.documentElement.clientWidth;
  const vh = innerHeight;
  const risePx = cssNum('--rise');
  const axisPx = cssNum('--axis') || vw / 2;
  const mid = (el) => pageTop(el) + el.offsetHeight / 2;
  const P0 = mid(document.getElementById('five-prime'));
  const P1 = mid(document.getElementById('three-prime'));
  const pairAt = (P) => Math.round((P - P0) / risePx);

  sections = genes.map((g) => {
    const top = pageTop(g);
    return { el: g, top, bottom: top + g.offsetHeight, color: g.style.getPropertyValue('--g').trim() };
  });
  sections.forEach((g) => {
    const r = g.el.querySelector('.range');
    if (r) r.textContent = `bp ${pairAt(g.top) + 1}–${pairAt(g.bottom) + 1}`;
  });

  cards.forEach((c) => c.path.remove() || c.dot.remove() || c.end.remove());
  cards = [...document.querySelectorAll('.allele')].map((el) => {
    const top = pageTop(el);
    const left = pageLeft(el);
    const w = el.offsetWidth;
    const side = left + w / 2 < axisPx ? -1 : 1; // -1: card left of the strand
    const anchorY = top + Math.min(36, el.offsetHeight / 2);
    const color = getComputedStyle(el).getPropertyValue('--g').trim();
    const path = document.createElementNS(SVG, 'path');
    const dot = document.createElementNS(SVG, 'circle');
    const end = document.createElementNS(SVG, 'circle');
    path.setAttribute('stroke', color);
    dot.setAttribute('fill', color);
    dot.setAttribute('r', 4);
    end.setAttribute('fill', color);
    end.setAttribute('r', 3);
    wires.append(path, end, dot);
    return { el, side, anchorY, edgeX: side < 0 ? left + w : left, pair: pairAt(anchorY), path, dot, end };
  });
  cards.forEach((c) => {
    c.el.onpointerenter = () => { helix?.highlight(c.pair); c.path.classList.add('on'); };
    c.el.onpointerleave = () => { helix?.highlight(-1); c.path.classList.remove('on'); };
  });

  layout = {
    vw, vh, axisPx, risePx, P0, P1,
    Rpx: cssNum('--r'),
    bg: getComputedStyle(document.body).backgroundColor,
    genes: sections.map(({ top, bottom, color }) => ({ top, bottom, color })),
    anchors: new Set(cards.map((c) => c.pair)),
  };
  const sig = JSON.stringify([vw, vh, Math.round(P0), Math.round(P1), cards.map((c) => c.pair)]);
  if (helix && sig !== signature) helix.build(layout);
  signature = sig;
}

let pending;
function remeasure() {
  clearTimeout(pending);
  pending = setTimeout(() => { measure(); ScrollTrigger.refresh(); }, 120);
}
addEventListener('resize', remeasure);
new ResizeObserver(remeasure).observe(document.querySelector('main'));

// ---------- rail: a map of the genome ----------
const rail = document.querySelector('.rail');
const railItems = genes.map((g, i) => {
  const li = document.createElement('li');
  li.style.setProperty('--g', g.style.getPropertyValue('--g'));
  li.innerHTML = `<button type="button"><span class="lbl">${String(i + 1).padStart(2, '0')} · ${g.dataset.gene}</span><span class="seg"></span></button>`;
  li.querySelector('button').addEventListener('click', () => goTo(g));
  rail.querySelector('ol').appendChild(li);
  return li;
});

// ---------- every frame: helix, wires, rail ----------
function opacityOf(el) {
  if (el.style.visibility === 'hidden') return 0;
  return el.style.opacity === '' ? 1 : parseFloat(el.style.opacity);
}

function frame() {
  lenis?.raf(performance.now());
  const s = scrollY();
  const vh = innerHeight;
  helix?.render(s);

  for (const c of cards) {
    const ay = c.anchorY - s;
    const pts = helix && ay > -200 && ay < vh + 200 ? helix.project(c.pair) : null;
    const show = pts ? opacityOf(c.el) : 0;
    c.path.style.display = c.dot.style.display = c.end.style.display = show ? '' : 'none';
    if (!show) continue;
    // wire to whichever bead is nearer the card's side; they swap where their x meet
    const b = c.side < 0 ? (pts[0].x < pts[1].x ? pts[0] : pts[1]) : (pts[0].x > pts[1].x ? pts[0] : pts[1]);
    const x0 = c.edgeX, bend = Math.min(80, Math.abs(b.x - x0) * 0.5);
    c.path.setAttribute('d', `M${x0},${ay} C${x0 - c.side * bend},${ay} ${b.x + c.side * bend * 0.6},${b.y} ${b.x},${b.y}`);
    c.path.classList.toggle('back', b.z < 0);
    c.path.style.opacity = show * (b.z < 0 ? 0.45 : 0.9);
    c.dot.setAttribute('cx', b.x);
    c.dot.setAttribute('cy', b.y);
    c.dot.style.opacity = show * (b.z < 0 ? 0.5 : 1);
    c.end.setAttribute('cx', x0);
    c.end.setAttribute('cy', ay);
    c.end.style.opacity = show;
  }

  const midY = s + vh / 2;
  let active = -1;
  sections.forEach((g, i) => { if (midY >= g.top) active = i; });
  if (sections[active] && midY > sections[active].bottom + 110) active = -1;
  railItems.forEach((li, i) => li.classList.toggle('on', i === active));
  rail.classList.toggle('show', s > vh * 0.5);
}

measure();
gsap.ticker.add(frame);
gsap.ticker.lagSmoothing(0);

// ---------- the helix ----------
const canvas = document.getElementById('helix');
function hasWebGL() {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}
if (hasWebGL()) {
  import('./helix.js')
    .then(({ createHelix }) => {
      helix = createHelix(canvas, { reduced });
      measure();
      helix.build(layout);
    })
    .catch((err) => console.warn('helix disabled', err));
}

// ---------- reveals ----------
if (!reduced) {
  document.fonts.ready.then(() => {
    const h1 = SplitText.create('.hero h1', { type: 'chars', mask: 'chars' });
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.hero .eyebrow', { y: 14, autoAlpha: 0, duration: 1 }, 0.1)
      .from(h1.chars, { yPercent: 110, duration: 1.3, stagger: 0.05 }, 0.2)
      .from('.hero p', { y: 16, autoAlpha: 0, duration: 1.2 }, 0.6)
      .from('.genome li', { y: 12, autoAlpha: 0, duration: 0.9, stagger: 0.05 }, 0.75)
      .from('#five-prime span', { scale: 0.4, autoAlpha: 0, duration: 1.2, ease: 'back.out(2)' }, 1)
      .add(() => h1.revert());

    gsap.utils.toArray('.tag').forEach((tag) => {
      gsap.from(tag, {
        y: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: tag, start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    });

    const all = gsap.utils.toArray('.allele');
    gsap.set(all, { autoAlpha: 0 });
    ScrollTrigger.batch(all, {
      start: 'top 90%',
      onEnter: (els) => els.forEach((el, i) => {
        const fromLeft = pageLeft(el) + el.offsetWidth / 2 < layout.axisPx;
        gsap.fromTo(el, { x: fromLeft ? -36 : 36, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1, delay: i * 0.08, ease: 'power3.out', overwrite: true });
      }),
    });

    gsap.from('.outro > *', {
      y: 24, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: '.outro', start: 'top 80%' },
    });
    remeasure();
  });
}

// ---------- detail panel: click a gene (tag, card or the strand itself) or a framework ----------
const drawer = document.querySelector('.drawer');
const drawerPanel = drawer.querySelector('.drawer-panel');
const drawerBody = drawer.querySelector('.drawer-body');
const tip = document.querySelector('.tip');
let opener = null;

const esc = (str) => String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const geneColor = (g) => g.style.getPropertyValue('--g').trim();
const isExternal = (href) => /^https?:/.test(href);
const linkItem = (l) =>
  `<li><a href="${esc(l.href)}"${isExternal(l.href) ? ' target="_blank" rel="noopener"' : ''}><i class="fa-solid ${esc(l.icon || 'fa-arrow-up-right-from-square')}"></i>${esc(l.label)}<span class="go">${isExternal(l.href) ? '↗' : '→'}</span></a></li>`;
const titleOf = (card) => {
  const h3 = card.querySelector('h3');
  return (h3.firstChild?.textContent || h3.textContent).trim();
};

function showDrawer(color, from) {
  opener = from || document.activeElement;
  tip.classList.remove('show');
  document.body.classList.remove('on-strand');
  drawerPanel.style.setProperty('--g', color);
  drawerPanel.scrollTop = 0;
  if (drawer.hidden) {
    drawer.hidden = false;
    lenis?.stop();
    const phone = innerWidth <= 860;
    if (!reduced) {
      gsap.fromTo(drawerPanel, phone ? { yPercent: 100 } : { xPercent: 100 }, { xPercent: 0, yPercent: 0, duration: 0.6, ease: 'expo.out' });
      gsap.fromTo('.drawer-scrim', { opacity: 0 }, { opacity: 1, duration: 0.4 });
    }
  }
  drawer.querySelector('.drawer-close').focus({ preventScroll: true });
}
function closeDrawer() {
  if (drawer.hidden) return;
  drawer.hidden = true;
  lenis?.start();
  opener?.focus?.({ preventScroll: true });
}

function openGene(gene, from) {
  const i = genes.indexOf(gene);
  const info = GENES[gene.id] || {};
  const tag = gene.querySelector('.tag');
  const items = [...gene.querySelectorAll('.allele')];
  const prev = genes[i - 1], next = genes[i + 1];
  drawerBody.innerHTML = `
    <div class="num"><b>Gene ${String(i + 1).padStart(2, '0')}</b> ${esc(tag.querySelector('.num').childNodes[1]?.textContent.trim())}</div>
    <h2 id="drawer-title">${esc(tag.querySelector('h2').textContent)}</h2>
    <p class="lede">${esc(info.blurb)}</p>
    <h4>In this gene · ${items.length} alleles</h4>
    <ul class="d-list">${items.map((c, j) => `<li><button type="button" data-goto="${j}"><i class="fa-solid fa-circle-dot"></i>${esc(titleOf(c))}<span class="go">↓</span></button></li>`).join('')}</ul>
    ${info.frameworks ? `<h4>Frameworks</h4><div class="d-chips">${info.frameworks.map((id) => `<button type="button" data-fw="${id}">${esc(FRAMEWORKS[id].title)}</button>`).join('')}</div>` : ''}
    ${info.links ? `<h4>Go deeper</h4><ul class="d-list">${info.links.map(linkItem).join('')}</ul>` : ''}
    <h4>Along the strand</h4>
    <ul class="d-list">
      ${prev ? `<li><button type="button" data-gene-id="${prev.id}"><i class="fa-solid fa-arrow-up"></i>Gene ${String(i).padStart(2, '0')} · ${esc(prev.dataset.gene)}</button></li>` : ''}
      ${next ? `<li><button type="button" data-gene-id="${next.id}"><i class="fa-solid fa-arrow-down"></i>Gene ${String(i + 2).padStart(2, '0')} · ${esc(next.dataset.gene)}</button></li>` : ''}
    </ul>`;
  drawerBody.dataset.gene = gene.id;
  showDrawer(geneColor(gene), from);
}

// Concept illustrations (public/images/concepts, drawn by
// scripts/concept-art.py) that open a framework's panel
const CONCEPT_ART = {
  'spiral-dynamics': 'spiral',
  holacracy: 'holonic-architecture',
  ikigai: 'ikigai',
  permaculture: 'forest-pattern-language',
  'internal-family-systems': 'internal-family-systems',
};

function openFramework(id, from) {
  const fw = FRAMEWORKS[id];
  const art = CONCEPT_ART[id];
  if (!fw) return;
  const homes = genes.filter((g) => g.querySelector(`[data-fw="${id}"]`));
  const color = from?.closest('.gene') ? geneColor(from.closest('.gene')) : getComputedStyle(drawerPanel).getPropertyValue('--g') || '#D6A15B';
  const links = [...(fw.page ? [{ label: 'On our Frameworks page', href: fw.page, icon: 'fa-map' }] : []), ...fw.links];
  drawerBody.innerHTML = `
    ${art ? `<div class="concept-art"><img src="/images/concepts/${art}.svg" alt="" loading="lazy"></div>` : ''}
    <div class="origin">Framework · ${esc(fw.origin)}</div>
    <h2 id="drawer-title">${esc(fw.title)}</h2>
    <p class="lede">${esc(fw.tagline)}</p>
    ${fw.image ? `<img src="${esc(fw.image.src)}" alt="${esc(fw.image.alt)}" loading="lazy">` : ''}
    <p>${esc(fw.body)}</p>
    ${fw.steps ? `<div class="steps-row">${fw.steps.map((st) => `<span>${esc(st)}</span>`).join('')}</div>` : ''}
    <h4>Read more</h4>
    <ul class="d-list">${links.map(linkItem).join('')}</ul>
    ${homes.length ? `<h4>Expressed in</h4><ul class="d-list">${homes.map((g) => `<li><button type="button" data-gene-id="${g.id}"><i class="fa-solid fa-dna"></i>Gene ${String(genes.indexOf(g) + 1).padStart(2, '0')} · ${esc(g.dataset.gene)}</button></li>`).join('')}</ul>` : ''}`;
  delete drawerBody.dataset.gene;
  showDrawer(color.trim(), from);
}

// Is this point on the helix itself? Returns the gene it passes through there.
function strandGeneAt(x, y) {
  if (!layout || !helix) return null;
  if (Math.abs(x - layout.axisPx) > layout.Rpx * 1.25) return null;
  const P = y + scrollY();
  return sections.find((g) => P >= g.top && P <= g.bottom) || null;
}
const OVER_CONTENT = '.allele, .tag, a, button, .rail, .top, footer, .hero, .drawer';

document.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse' || !drawer.hidden) return;
  const g = e.target.closest(OVER_CONTENT) ? null : strandGeneAt(e.clientX, e.clientY);
  document.body.classList.toggle('on-strand', !!g);
  tip.classList.toggle('show', !!g);
  if (!g) return;
  const i = sections.indexOf(g);
  tip.style.setProperty('--g', g.color);
  tip.innerHTML = `<b>Gene ${String(i + 1).padStart(2, '0')}</b> · ${esc(g.el.dataset.gene)} — explore`;
  tip.style.left = e.clientX + 'px';
  tip.style.top = e.clientY + 'px';
}, { passive: true });

document.addEventListener('click', (e) => {
  const t = e.target;
  if (t.closest('[data-close]')) return closeDrawer();
  const goto = t.closest('[data-goto]');
  if (goto) {
    const card = document.getElementById(drawerBody.dataset.gene).querySelectorAll('.allele')[+goto.dataset.goto];
    closeDrawer();
    goTo(card);
    card.classList.remove('pulse');
    setTimeout(() => card.classList.add('pulse'), lenis ? 1400 : 300);
    return;
  }
  const geneLink = t.closest('[data-gene-id]');
  if (geneLink) return openGene(document.getElementById(geneLink.dataset.geneId), opener);
  const fw = t.closest('[data-fw]');
  if (fw && !t.closest('a')) return openFramework(fw.dataset.fw, fw);
  const explore = t.closest('[data-open-gene]');
  if (explore) return openGene(explore.closest('.gene'), explore);
  if (t.closest('.drawer')) return;
  const card = t.closest('article.allele');
  if (card && !t.closest('a, button')) return openGene(card.closest('.gene'), card);
  if (!t.closest(OVER_CONTENT)) {
    const g = strandGeneAt(e.clientX, e.clientY);
    if (g) openGene(g.el);
  }
});
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

// Structured data for search engines and AI crawlers that execute JS.
// (Non-JS crawlers get the summary from /llms.txt.)
const ldTag = document.createElement('script');
ldTag.type = 'application/ld+json';
ldTag.textContent = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Our DNA · Liminal Village',
  url: 'https://liminalvillage.com/dna',
  description: document.querySelector('meta[name="description"]').content,
  isPartOf: { '@type': 'WebSite', name: 'Liminal Village', url: 'https://liminalvillage.com/' },
  about: {
    '@type': 'Organization',
    name: 'Liminal Village',
    url: 'https://liminalvillage.com/',
    foundingDate: '2018',
    slogan: 'A living laboratory for a regenerative civilization',
    sameAs: ['https://docs.liminalvillage.com/'],
  },
});
document.head.appendChild(ldTag);
