// Lunations — which lunar cycle a moment falls in, and what it is called.
// A port of @holons/core/flows/lunation.ts (Meeus/moontool new moons, the
// numbering the Telegram bot's /newmoon counts by), so the site names a cycle
// the same way the bot, the kiosk and the Flows board do. Keep in step.

export const SYNODIC_MONTH_DAYS = 29.53058868;
const JULIAN_UNIX_EPOCH = 2440587.5;
const MS_PER_DAY = 86400000;

const julianOf = (ms) => ms / MS_PER_DAY + JULIAN_UNIX_EPOCH;
const msOf = (julian) => (julian - JULIAN_UNIX_EPOCH) * MS_PER_DAY;
const dsin = (degrees) => Math.sin((Math.PI / 180) * degrees);

function meanNewMoon(k) {
  const t = k / 1236.85;
  return (
    2415020.75933 +
    SYNODIC_MONTH_DAYS * k +
    (0.0001178 - 0.000000155 * t) * t * t +
    0.00033 * dsin(166.56 + (132.87 - 0.009173 * t) * t)
  );
}

function trueNewMoon(k) {
  const t = k / 1236.85;
  const m = 359.2242 + 29.10535608 * k - (0.0000333 - 0.00000347 * t) * t * t;
  const mprime = 306.0253 + 385.81691806 * k + (0.0107306 + 0.00001236 * t) * t * t;
  const f = 21.2964 + 390.67050646 * k - (0.0016528 - 0.00000239 * t) * t * t;
  const corrected =
    meanNewMoon(k) +
    (0.1734 - 0.000393 * t) * dsin(m) +
    0.0021 * dsin(2 * m) -
    0.4068 * dsin(mprime) +
    0.0161 * dsin(2 * mprime) -
    0.0004 * dsin(3 * mprime) +
    0.0104 * dsin(2 * f) -
    0.0051 * dsin(m + mprime) -
    0.0074 * dsin(m - mprime) +
    0.0004 * dsin(2 * f + m) -
    0.0004 * dsin(2 * f - m) -
    0.0006 * dsin(2 * f + mprime) +
    0.001 * dsin(2 * f - mprime) +
    0.0005 * dsin(m + 2 * mprime);
  return msOf(corrected);
}

function indexContaining(ts) {
  const date = new Date(ts);
  let k = Math.floor(12.3685 * (date.getUTCFullYear() + date.getUTCMonth() / 12 - 1900));
  for (let guard = 0; guard < 64; guard++) {
    if (ts < trueNewMoon(k)) { k--; continue; }
    if (ts >= trueNewMoon(k + 1)) { k++; continue; }
    break;
  }
  return k;
}

function numberOf(newMoonMs) {
  const BASE_JULIAN = 2423436.40347;
  const BASE_SYNODIC = 29.530588861;
  return Math.round((julianOf(newMoonMs) - BASE_JULIAN) / BASE_SYNODIC) - 1200;
}

/** The lunar cycle containing `ts`: { index, from, to } (ms, inclusive). */
export function lunationAt(ts = Date.now()) {
  const k = indexContaining(ts);
  const from = trueNewMoon(k);
  return { index: numberOf(from), from, to: trueNewMoon(k + 1) - 1 };
}
