// Page-wide motion for rigenerativa.it: Lenis smooth scroll driven by the gsap
// ticker, in-page anchor navigation, and [data-reveal] scroll reveals.
// Everything is skipped under prefers-reduced-motion.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const reduced = typeof matchMedia !== 'undefined'
  && matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
const NAV_OFFSET = -72;

export function goTo(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET, behavior: reduced ? 'auto' : 'smooth' });
}

export function initMotion(root) {
  const raf = (t) => lenis.raf(t * 1000);
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
  }

  const onClick = (e) => {
    const a = e.target.closest('a[href^="#"]');
    const el = a && a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    goTo(el);
    history.replaceState(null, '', a.getAttribute('href'));
  };
  document.addEventListener('click', onClick);

  const ctx = gsap.context(() => {
    if (reduced) return;
    // Groups reveal their children in sequence; lone elements just rise in.
    gsap.utils.toArray('[data-reveal]', root).forEach((el) => {
      const kids = el.dataset.reveal === 'stagger' ? el.children : el;
      gsap.from(kids, {
        y: 36,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.09,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
    });
  }, root);

  // Fonts and images shift the layout after mount.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  return () => {
    document.removeEventListener('click', onClick);
    ctx.revert();
    if (lenis) {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenis = null;
    }
  };
}
