// Svelte action for the shared site header defined in /public/site-nav.js:
//   <header use:siteNav={'services'}></header>
export function siteNav(node, current = '') {
  window.LV_NAV?.mount(node, current);
}
