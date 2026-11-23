/*
 * The one site header, shared by every Liminal Village page: the Svelte apps
 * (home, lunations, quests, services, apply) and the static pages (dna, media,
 * frameworks, costs). Change the links here and every page follows.
 *
 * Usage: load /site-nav.css and this script in <head>, then put
 *   <header data-site-nav data-current="media"></header>
 * where the header goes. Add data-overlay for a transparent header over a
 * full-bleed hero that turns solid on scroll. Svelte pages call
 * window.LV_NAV.mount(node, current) from an action instead.
 */
(function () {
  var LINKS = [
    { key: 'village', label: 'The village', href: '/#village' },
    { key: 'lunations', label: 'Lunations', href: '/lunations' },
    { key: 'quests', label: 'Quests', href: '/quests' },
    { key: 'services', label: 'Services', href: '/services' },
    { key: 'dna', label: 'Our DNA', href: '/dna' },
    { key: 'media', label: 'Media', href: '/media' },
  ];

  // dna.html and frameworks.html are also served on the partner domains:
  // there the header is just that site's name and a way back home.
  function partner() {
    var h = location.hostname.toLowerCase();
    var q = new URLSearchParams(location.search).get('site');
    if (h.indexOf('regenerativa') > -1 || q === 'regenerativa') return 'ReGenerativa';
    if (h.indexOf('casaselva') > -1) return 'Casa Selva';
    if (h.indexOf('refactory') > -1 || h.indexOf('brickfactory') > -1) return 'ReFactory';
    return null;
  }

  function mount(el, current) {
    if (!el || el.__lvNav) return;
    el.__lvNav = true;
    current = current || el.getAttribute('data-current') || '';
    el.classList.add('lv-nav');

    var other = partner();
    var html = '<div class="lv-nav__in">';
    if (other) {
      html += '<a class="lv-nav__brand" href="/">' + other + '</a>' +
        '<a class="lv-nav__back" href="/">← Back to site</a>';
    } else {
      html += '<a class="lv-nav__brand" href="/">Liminal Village</a><nav class="lv-nav__links" aria-label="Site">';
      LINKS.forEach(function (l) {
        html += '<a href="' + l.href + '"' + (l.key === current ? ' aria-current="page"' : '') + '>' + l.label + '</a>';
      });
      html += '</nav><a class="lv-nav__cta" href="/apply"' + (current === 'apply' ? ' aria-current="page"' : '') + '>Apply to visit</a>';
    }
    el.innerHTML = html + '</div>';

    // On phones the links scroll sideways: bring the current page into view.
    var row = el.querySelector('.lv-nav__links');
    var cur = row && row.querySelector('[aria-current]');
    if (cur && row.scrollWidth > row.clientWidth) row.scrollLeft = cur.offsetLeft - 16;

    if (el.hasAttribute('data-overlay')) {
      el.classList.add('lv-nav--overlay');
      var onScroll = function () { el.classList.toggle('is-solid', window.scrollY > 40); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  window.LV_NAV = { links: LINKS, mount: mount };

  function auto() {
    var els = document.querySelectorAll('[data-site-nav]');
    for (var i = 0; i < els.length; i++) mount(els[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto);
  else auto();
})();
