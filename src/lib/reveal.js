// Fades, lifts and focuses elements as they scroll into view. Uses the
// individual translate/scale properties so it combines with the circles'
// own drift animation instead of replacing it.
const TARGETS = [
  '.section-heading',
  '.section-content > p',
  '.lead',
  '.dna',
  '.pillar-card',
  '.cta-content',
  '.dial',
  '.phases li',
  '.access',
  '.steps > .step',
  '.site',
  '.video-container',
  '.info-card',
  '.contact-map',
  '.newsletter-content',
].join(',');

export function reveal(root = document) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const els = [...root.querySelectorAll(TARGETS)];
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px' }
  );
  els.forEach((el) => {
    // Siblings in a row arrive one after another
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--reveal-delay', `${Math.min(i, 5) * 90}ms`);
    el.classList.add('reveal');
    io.observe(el);
  });
  return () => io.disconnect();
}
