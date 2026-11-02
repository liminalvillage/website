// The year as a compass, the frame Jillian's mural timeline reads by: the
// winter solstice in the north (the dark of the year), the summer solstice
// in the south (the full sun), the spring equinox in the east and the
// autumn equinox in the west. Each quarter between them has its own colour
// and its own movement, so the spiral reads at a glance.
//
// The heat of the year lags behind the sun: the coldest weeks come a month
// or more after the winter solstice (late January, February) and the
// hottest after the summer one (late July, August). The spiral's colours
// follow that felt warmth, not the sun's height, so August reads as the
// hottest moon, not an autumnal one.
import { sunLongitude } from '../calendar/sun.js';

// the four points, by the sun's longitude, and what each quarter is
export const POINTS = [
  { lon: 270, name: 'Winter solstice', note: 'the dark of the year · the solar year turns' },
  { lon: 0, name: 'Spring equinox', note: 'light and dark in balance' },
  { lon: 90, name: 'Summer solstice', note: 'the full sun' },
  { lon: 180, name: 'Autumn equinox', note: 'balance again, turning inward' },
];
export const QUARTERS = [
  { from: 270, to: 360, name: 'out of the dark, towards the light', colour: '#5f7fae' },
  { from: 0, to: 90, name: 'building to the full sun', colour: '#e9b448' },
  { from: 90, to: 180, name: 'from the peak, letting go', colour: '#de6a3a' },
  { from: 180, to: 270, name: 'into the depth of winter', colour: '#6c5f98' },
];

// how far the felt seasons lag the sun, in degrees of its longitude (≈ days)
export const LAG = 40;

// the felt warmth of the year, from the coldest weeks round to the hottest
// and back; stronger than the page's own seasonal paper, on purpose
const HEAT = [
  [0, '#6f8fc0'], // coldest, early February: cold blue
  [55, '#9cc48a'], // the first green, early April
  [115, '#f0c24f'], // golden, June
  [175, '#e2502f'], // hottest, early August: deep red-orange
  [235, '#d9893a'], // amber, the olive and grape harvests
  [300, '#9a86b8'], // dusk violet, December
  [360, '#6f8fc0'],
];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export function heatAt(ms) {
  const phi = (((sunLongitude(ms) - (270 + LAG)) % 360) + 360) % 360;
  const k = HEAT.findIndex(([d]) => d > phi);
  const [[d0, c0], [d1, c1]] = [HEAT[k - 1], HEAT[k]];
  const t = (phi - d0) / (d1 - d0);
  const [a, b] = [hex(c0), hex(c1)];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(', ')})`;
}

// The Chinese New Year: the new moon that falls between 21 January and
// 20 February, and the animal of the year it begins
const ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
export function lunarNewYear(startMs) {
  const d = new Date(startMs + 12 * 3600_000);
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  if (!((m === 0 && day >= 21) || (m === 1 && day <= 20))) return null;
  const y = d.getUTCFullYear();
  return { year: y, animal: ANIMALS[(((y - 2020) % 12) + 12) % 12] };
}
