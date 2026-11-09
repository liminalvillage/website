// Language of rigenerativa.it: Italian or English, fixed for the page's lifetime.
// Chosen by ?lang=, then the saved choice, then the browser. The choice lives in a
// cookie on .rigenerativa.it so it follows people across the sector subdomains.
export const LANGS = ['it', 'en'];
const COOKIE = 'rg_lang';

const valid = (l) => (LANGS.includes(l) ? l : null);

function cookieDomain() {
  const h = location.hostname.toLowerCase();
  if (h === 'rigenerativa.it' || h.endsWith('.rigenerativa.it')) return '; domain=.rigenerativa.it';
  if (h.endsWith('rigenerativa.localhost')) return '; domain=.rigenerativa.localhost';
  return '';
}

function saved() {
  const m = document.cookie.match(/(?:^|;\s*)rg_lang=(\w+)/);
  return m && valid(m[1]);
}

function save(l) {
  document.cookie = `${COOKIE}=${l}; path=/; max-age=31536000; samesite=lax${cookieDomain()}`;
}

function detect() {
  if (typeof location === 'undefined') return 'it';
  const q = valid(new URLSearchParams(location.search).get('lang'));
  if (q) {
    save(q);
    return q;
  }
  const s = saved();
  if (s) return s;
  // An Italian company: Italian unless the browser clearly prefers another language.
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language || 'it'];
  return prefs.some((p) => p.toLowerCase().startsWith('it')) ? 'it' : 'en';
}

export const lang = detect();

// Pick this language's entry from { it, en }.
export const pick = (copy) => copy[lang] ?? copy.it;

// Switching rebuilds the page: pinned scroll sections and copy are measured once at mount.
export function setLang(l) {
  if (!valid(l) || l === lang) return;
  save(l);
  const url = new URL(location.href);
  if (url.searchParams.has('lang')) {
    url.searchParams.delete('lang');
    location.replace(url);
  } else {
    location.reload();
  }
}
