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
