// Where the sun stands on the ecliptic at a moment, in degrees (0 at the
// spring equinox, 90 at the summer solstice, 180 at the autumn equinox, 270
// at the winter solstice). A low-precision formula, good to well under a
// degree, which is plenty for dates, signs and seasons.
const DAY_MS = 86400000;
const rad = Math.PI / 180;

export function sunLongitude(ms) {
  const n = ms / DAY_MS + 2440587.5 - 2451545;
  const L = 280.46 + 0.9856474 * n;
  const g = (357.528 + 0.9856003 * n) * rad;
  return (((L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360) + 360) % 360;
}

// Sunrise and sunset on the day of a moment, at a place (degrees north and
// east), as times of day in Italy, with the day's length. The same low
// precision as above: good to a minute or two.
export function sunTimes(ms, lat = 42.85, lon = 13.58) {
  const day = new Date(ms);
  const noonUtc = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 12);
  const decl = Math.asin(Math.sin(23.44 * rad) * Math.sin(sunLongitude(noonUtc) * rad));
  const n = Math.floor((noonUtc - Date.UTC(day.getUTCFullYear(), 0, 0)) / DAY_MS);
  const b = (360 / 365) * (n - 81) * rad;
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b); // minutes
  const cosH = (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * Math.sin(decl)) / (Math.cos(lat * rad) * Math.cos(decl));
  const h = Math.acos(Math.max(-1, Math.min(1, cosH))) / rad; // degrees
  const noon = noonUtc - 12 * 3600000 + (720 - 4 * lon - eot) * 60000;
  const time = (t) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
  return { rise: time(noon - h * 4 * 60000), set: time(noon + h * 4 * 60000), minutes: Math.round(h * 8) };
}
