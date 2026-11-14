// Language of regenerativa.earth: English or Italian, fixed for the page's lifetime.
// Chosen by ?lang=, then the saved choice, then the browser. The choice lives in a
// cookie on .regenerativa.earth so it follows people to the hubs' subdomains.
export const LANGS = ['en', 'it'];
const COOKIE = 'rgn_lang';

const valid = (l) => (LANGS.includes(l) ? l : null);

function cookieDomain() {
  const h = location.hostname.toLowerCase();
  if (h === 'regenerativa.earth' || h.endsWith('.regenerativa.earth')) return '; domain=.regenerativa.earth';
  return '';
}

function saved() {
  const m = document.cookie.match(/(?:^|;\s*)rgn_lang=(\w+)/);
  return m && valid(m[1]);
}

function save(l) {
  document.cookie = `${COOKIE}=${l}; path=/; max-age=31536000; samesite=lax${cookieDomain()}`;
}

function detect() {
  if (typeof location === 'undefined') return 'en';
  const q = valid(new URLSearchParams(location.search).get('lang'));
  if (q) {
    save(q);
    return q;
  }
  const s = saved();
  if (s) return s;
  // An international network: English unless the browser prefers Italian.
  const first = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  return first.startsWith('it') ? 'it' : 'en';
}

export const lang = detect();

// Pick this language's entry from { en, it }.
export const pick = (copy) => copy[lang] ?? copy.en;

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
