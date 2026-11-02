// Mycelium the way the pattern-language drawing grows it (scripts/
// concept-art.py, mycelium): hyphae walk in short steps, turning a little
// each step, now and then sending off a thinner branch, and where they meet
// and trade, a little cloud of stippled spores. Used for the faint threads
// behind the pages and round the eight forms of capital, so they are all one
// family with the drawing.
export function hyphae({ seed = 7, starts = [], step = 14, steps = 50 }) {
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const between = (a, b) => a + rand() * (b - a);
  const lines = [];
  const nodes = [];

  function hypha(x, y, ang, n, w) {
    const pts = [[x, y]];
    for (let k = 0; k < n; k++) {
      ang += between(-0.35, 0.35);
      x += step * Math.cos(ang);
      y += step * Math.sin(ang);
      pts.push([x, y]);
      if (rand() < 0.12 && w > 0.5) hypha(x, y, ang + (rand() < 0.5 ? -1 : 1) * between(0.5, 1.1), Math.floor(n / 2), w * 0.7);
      if (rand() < 0.05) nodes.push([x, y]);
    }
    // a smooth line through the walk, wobbling a touch, as by hand
    const p = pts.map(([px, py]) => [px + between(-0.8, 0.8), py + between(-0.8, 0.8)]);
    let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    for (let i = 1; i < p.length - 1; i++) {
      const [mx, my] = [(p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2];
      d += `Q${p[i][0].toFixed(1)} ${p[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    lines.push({ d, w });
  }

  for (const [x, y, ang, w = 1.8] of starts) hypha(x, y, ang, steps, w);

  const spores = [];
  for (const [x, y] of nodes.slice(0, 40)) {
    const r = between(16, 34);
    for (let k = 0; k < 45; k++) {
      const a = rand() * Math.PI * 2;
      const d = r * Math.sqrt(rand());
      spores.push({ x: x + d * Math.cos(a), y: y + d * Math.sin(a), r: between(0.4, 1.1) });
    }
  }
  return { lines, spores };
}
