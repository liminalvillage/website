// Four small drawings, one for each turning of the sun: a cross-section of
// the land, as in the mycelium drawings the village loves, in the hand of
// the site's pattern-language diagrams. Above the ground line, what the
// season shows; below it, roots and the white threads of mycelium with
// their stippled spore clouds (grown with the same walk as every mycelium
// on the site, hyphae.js). They sit faded inside the spiral and come to
// life when hovered: the washes deepen, the plants sway, the threads show,
// and small things emerge (snow, blossom, bees, falling leaves, spores).
// Each is drawn in a 160 × 160 circle around (0, 0); the ground is at y = 0.
import { hyphae } from '../lib/hyphae.js';

// mycelium below the ground, from a few points just under the surface
function underground(seed, xs) {
  const { lines, spores } = hyphae({ seed, step: 6, steps: 11, starts: xs.map((x) => [x, 3, Math.PI / 2 + (x % 7) / 20, 1.3]) });
  return {
    threads: lines.map((l) => l.d),
    spores: spores.filter((p) => Math.hypot(p.x, p.y) < 74 && p.y > 4).slice(0, 160).map((p) => ({ x: p.x, y: p.y, r: Math.min(p.r * 0.45, 0.9) })),
  };
}

// a mushroom: cap and stem, standing on the ground at x
const mushroom = (x, h, w) => [`M${x - w} ${-h} C${x - w} ${-h - w * 1.1} ${x + w} ${-h - w * 1.1} ${x + w} ${-h} Z`, `M${x - w * 0.3} ${-h} C${x - w * 0.25} ${-h * 0.5} ${x - w * 0.35} ${-h * 0.2} ${x - w * 0.4} 0`, `M${x + w * 0.3} ${-h} C${x + w * 0.25} ${-h * 0.5} ${x + w * 0.35} ${-h * 0.2} ${x + w * 0.4} 0`];
// a little flower head on a stem
const flower = (x, h) => [`M${x} 0 C${x - 1} ${-h * 0.4} ${x + 1} ${-h * 0.7} ${x} ${-h}`];
// roots from a stem at x, spreading down
const roots = (x, d) => [`M${x} 0 C${x - 4} ${d * 0.4} ${x - 10} ${d * 0.7} ${x - 16} ${d}`, `M${x} 0 C${x + 3} ${d * 0.5} ${x + 8} ${d * 0.8} ${x + 14} ${d * 1.05}`, `M${x} 0 C${x} ${d * 0.5} ${x - 2} ${d * 0.9} ${x + 1} ${d * 1.2}`];

export const SEASON_ART = {
  // the winter solstice: a bare tree under a thin moon; above, rest; below,
  // the busiest time of the threads
  270: {
    sky: '#c9d6ea',
    ink: [
      'M0 0 C-2 -20 2 -38 0 -58',
      'M0 -26 C-12 -32 -24 -36 -36 -48',
      'M0 -36 C12 -42 24 -46 34 -58',
      'M0 -46 C-6 -54 -10 -62 -12 -70',
      'M-36 -48 C-40 -52 -42 -58 -40 -62',
      'M34 -58 C38 -62 38 -66 36 -70',
      'M42 -66 A10 10 0 1 0 50 -48 A7.5 7.5 0 1 1 42 -66Z',
      ...roots(0, 40),
    ],
    ...underground(11, [-40, -14, 14, 40]),
    emerge: Array.from({ length: 12 }, (_, k) => ({ x: -60 + ((k * 37) % 120), y: -72 + ((k * 23) % 60), kind: 'snow' })),
  },
  // the spring equinox: shoots and the first flowers, the threads reaching up to them
  0: {
    sky: '#d6e6c4',
    ink: [
      ...flower(-30, 26), 'M-30 -14 C-38 -16 -42 -22 -40 -28 C-33 -26 -30 -20 -30 -14Z',
      ...flower(0, 38), 'M0 -20 C9 -22 14 -28 12 -34 C5 -32 1 -27 0 -20Z', 'M0 -10 C-8 -12 -12 -18 -10 -24 C-4 -22 -1 -16 0 -10Z',
      ...flower(30, 22), 'M30 -12 C37 -14 40 -19 38 -24 C33 -22 30 -18 30 -12Z',
      'M-30 0 C-31 6 -33 10 -36 14', 'M0 0 C1 8 -1 14 2 20', 'M30 0 C31 6 33 10 35 13',
    ],
    ...underground(23, [-30, 0, 30]),
    emerge: [
      { x: -30, y: -28, kind: 'flower' },
      { x: 0, y: -40, kind: 'flower' },
      { x: 30, y: -24, kind: 'flower' },
      { x: -48, y: -50, kind: 'petal' },
      { x: 44, y: -52, kind: 'petal' },
    ],
  },
  // the summer solstice: the full sun, yellow flowers in clusters, deep roots
  90: {
    sky: '#f6dfa0',
    ink: [
      'M0 -52 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0',
      ...Array.from({ length: 10 }, (_, k) => {
        const a = (k * Math.PI) / 5;
        return `M${(17 * Math.cos(a)).toFixed(1)} ${(-52 + 17 * Math.sin(a)).toFixed(1)}L${(24 * Math.cos(a)).toFixed(1)} ${(-52 + 24 * Math.sin(a)).toFixed(1)}`;
      }),
      ...flower(-40, 30), ...flower(-30, 36), ...flower(-20, 28),
      ...flower(22, 30), ...flower(32, 38), ...flower(42, 28),
      'M-48 0 C-44 -10 -36 -14 -30 -6 C-26 -14 -16 -12 -12 0', 'M14 0 C18 -12 28 -14 32 -6 C36 -14 46 -10 50 0',
      ...roots(-30, 30), ...roots(32, 34),
    ],
    ...underground(37, [-30, 32]),
    emerge: [
      { x: -40, y: -32, kind: 'bloom' }, { x: -30, y: -38, kind: 'bloom' }, { x: -20, y: -30, kind: 'bloom' },
      { x: 22, y: -32, kind: 'bloom' }, { x: 32, y: -40, kind: 'bloom' }, { x: 42, y: -30, kind: 'bloom' },
      { x: -6, y: -22, kind: 'bee' }, { x: 12, y: -34, kind: 'bee' },
    ],
  },
  // the autumn equinox: mushrooms fruiting from the threads, leaves letting go
  180: {
    sky: '#efc79a',
    ink: [
      ...mushroom(-30, 22, 13), ...mushroom(-12, 14, 8), ...mushroom(20, 26, 15), ...mushroom(40, 12, 7),
      'M-42 -44 C-30 -40 -18 -44 -6 -52',
    ],
    ...underground(53, [-30, -12, 20, 40]),
    emerge: [
      { x: -50, y: -40, kind: 'leaf' },
      { x: 4, y: -60, kind: 'leaf' },
      { x: 46, y: -50, kind: 'leaf' },
      { x: -10, y: -36, kind: 'leaf' },
    ],
  },
};

// the small things that emerge on hover
export const EMERGE = {
  snow: 'M0 -3.5 V3.5 M-3 -1.8 L3 1.8 M-3 1.8 L3 -1.8',
  flower: 'M0 0 m-2.2 0 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 M0 -2.6 C-2.6 -8 2.6 -8 0 -2.6 M2.6 0 C8 -2.6 8 2.6 2.6 0 M0 2.6 C2.6 8 -2.6 8 0 2.6 M-2.6 0 C-8 2.6 -8 -2.6 -2.6 0',
  bloom: 'M0 0 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0',
  petal: 'M0 0 C-3 -4 -1 -8 2 -8 C4 -5 3 -2 0 0Z',
  bee: 'M-3 0 a3 2.2 0 1 0 6 0 a3 2.2 0 1 0 -6 0 M-1 -2 C-3 -6 0 -6 0 -2 M1 -2 C3 -6 0 -6 0 -2',
  leaf: 'M0 0 C-5 -3 -5 -10 0 -13 C5 -10 5 -3 0 0Z M0 -1 V-11',
};
