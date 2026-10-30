// The site's colours follow the seasons. Each season has its own paper and
// glows; at every new moon the page moves one step further from the season
// it is in towards the next, so the colours drift with the year, lunation by
// lunation. Only the paper and the soft glows change; the ink stays the same,
// so text keeps its contrast. ?season=winter|spring|summer|autumn previews a
// season as it is at its start.
import { lunationAt } from '../calendar/lunation.js';
import { sunLongitude } from '../calendar/sun.js';

// paper, then three glows (they stand in for --ember-200, --rosehip-200 and
// --sprout-200, which the page background and the circles are mixed from)
const SEASONS = {
  spring: ['#fbf8ee', '#f6e3b4', '#f9d6d2', '#dee8c2'],
  summer: ['#fff8ec', '#ffd9a0', '#fbcfb4', '#ebe2b0'],
  autumn: ['#fffaf2', '#fdd7bb', '#fec9bd', '#dee8c2'],
  winter: ['#f7f4ef', '#efe0d2', '#e8e1dc', '#dce3e6'],
};
// In the sun's order through the year, from the spring equinox
const ORDER = ['spring', 'summer', 'autumn', 'winter'];
const VARS = ['--oat-100', '--ember-200', '--rosehip-200', '--sprout-200'];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => {
  const [ca, cb] = [hex(a), hex(b)];
  return `rgb(${ca.map((v, i) => Math.round(v + (cb[i] - v) * t)).join(', ')})`;
};

export function seasonColours(ms = Date.now()) {
  // Measured at the start of the current lunation, so the colours change in
  // one gentle step at each new moon
  const longitude = sunLongitude(lunationAt(ms).from);
  const i = Math.floor(longitude / 90) % 4;
  const t = (longitude % 90) / 90;
  const [now, next] = [SEASONS[ORDER[i]], SEASONS[ORDER[(i + 1) % 4]]];
  return VARS.map((name, k) => [name, mix(now[k], next[k], t)]);
}

export function applySeason() {
  const preview = new URLSearchParams(location.search).get('season');
  const colours = SEASONS[preview]
    ? VARS.map((name, k) => [name, SEASONS[preview][k]])
    : seasonColours();
  for (const [name, value] of colours) document.documentElement.style.setProperty(name, value);
}
