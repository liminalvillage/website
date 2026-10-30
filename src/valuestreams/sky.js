// The sky over a lunation, for its card: the new and full moon and the signs
// they fall in (tropical zodiac), the sun's turning points and sign changes
// within it, and the length of the day in Le Marche at its new moon.
import { phase_hunt } from 'lune';
import { sunLongitude } from '../calendar/sun.js';

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const TURNS = { 0: 'Spring equinox', 90: 'Summer solstice', 180: 'Autumn equinox', 270: 'Winter solstice' };
const DAY_MS = 86400000;
const LATITUDE = 42.85; // Ascoli Piceno
const rad = Math.PI / 180;

const signOf = (longitude) => SIGNS[Math.floor(longitude / 30) % 12];

function dayLength(ms) {
  const decl = Math.asin(Math.sin(23.44 * rad) * Math.sin(sunLongitude(ms) * rad));
  const hours = (24 / Math.PI) * Math.acos(-Math.tan(LATITUDE * rad) * Math.tan(decl));
  return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
}

const when = (ms) => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Europe/Rome' });

export function skyFor(from, to) {
  const { full_date } = phase_hunt(new Date(from + 2 * DAY_MS));
  const full = full_date.getTime();
  const newSign = signOf(sunLongitude(from));
  const fullSign = signOf((sunLongitude(full) + 180) % 360);

  // Where the sun crosses a sign boundary within the lunation, hour by hour
  // near each day's crossing; a turning point (equinox or solstice) wins
  const sun = [];
  for (let t = from; t < to; t += DAY_MS) {
    const a = sunLongitude(t);
    const b = sunLongitude(Math.min(t + DAY_MS, to));
    const edge = Math.floor(b / 30) * 30;
    if (Math.floor(a / 30) !== Math.floor(b / 30)) {
      sun.push(TURNS[edge] ? `${TURNS[edge]}, ${when(t + DAY_MS / 2)}` : `Sun enters ${signOf(b)}, ${when(t + DAY_MS / 2)}`);
    }
  }

  return {
    newMoon: `New moon in ${newSign}, ${when(from)}`,
    fullMoon: `Full moon in ${fullSign}, ${when(full)}`,
    sun,
    daylight: dayLength(from),
  };
}
