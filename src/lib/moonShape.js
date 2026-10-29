// The lit part of a moon of radius r at (cx, cy), for a phase from 0 (new)
// through 0.5 (full) to 1, as an SVG path
export function litPath(p, cx, cy, r) {
  const top = `${cx} ${cy - r}`;
  const bottom = `${cx} ${cy + r}`;
  if (p < 0.01 || p > 0.99) return '';
  if (Math.abs(p - 0.5) < 0.01) return `M${top}A${r} ${r} 0 1 1 ${bottom}A${r} ${r} 0 1 1 ${top}Z`;
  const rx = (Math.abs(Math.cos(2 * Math.PI * p)) * r).toFixed(2);
  if (p < 0.5) return `M${top}A${r} ${r} 0 0 1 ${bottom}A${rx} ${r} 0 0 ${p < 0.25 ? 0 : 1} ${top}Z`;
  return `M${top}A${r} ${r} 0 0 0 ${bottom}A${rx} ${r} 0 0 ${p < 0.75 ? 0 : 1} ${top}Z`;
}
