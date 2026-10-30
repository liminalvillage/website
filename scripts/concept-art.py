#!/usr/bin/env python3
"""Generates the Liminal Village concept illustrations as SVG.

One shared style for every key concept: a deep, painterly colour field,
white hand-drawn-feeling linework, and stippled "spore" clouds. Each concept
has its own colour mood; the spiral keeps the Spiral Dynamics colours,
because there the colours carry the meaning.

    python3 scripts/concept-art.py        # writes public/images/concepts/*.svg

(public/images/concepts/stipple.svg, the dot texture used inside the site's
circles, was drawn the same way: 260 seeded dots in a 400px disc.)

Everything is seeded, so the same script always draws the same images.
"""
import math
import random
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'public' / 'images' / 'concepts'
S = 800  # canvas size
WHITE = '#fbf6ee'


def f(x):
    return f'{x:.1f}'


class Art:
    def __init__(self, seed):
        self.rng = random.Random(seed)
        self.defs = []
        self.body = []

    # --- shared building blocks -------------------------------------------
    def field(self, base, blobs):
        """A painterly background: a base colour with large blurred blots."""
        self.defs.append(
            '<filter id="blur" x="-50%" y="-50%" width="200%" height="200%">'
            '<feGaussianBlur stdDeviation="70"/></filter>'
            '<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/>'
            '<feColorMatrix type="saturate" values="0"/></filter>'
            '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>'
        )
        self.body.append(f'<rect width="{S}" height="{S}" fill="{base}"/>')
        g = ['<g filter="url(#blur)">']
        for (x, y, r, c, o) in blobs:
            g.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" opacity="{o}"/>')
        g.append('</g>')
        self.body.append(''.join(g))

    def grain(self):
        self.body.append(f'<rect width="{S}" height="{S}" filter="url(#grain)" opacity="0.07" style="mix-blend-mode:overlay"/>')

    def stipple(self, cx, cy, r, n, op=0.8):
        rng = self.rng
        dots = []
        for _ in range(n):
            a = rng.random() * math.tau
            d = r * math.sqrt(rng.random()) * (0.6 + 0.4 * rng.random())
            dots.append(f'<circle cx="{f(cx + d * math.cos(a))}" cy="{f(cy + d * math.sin(a))}" '
                        f'r="{f(0.6 + rng.random() * 1.1)}" opacity="{f(op * (0.4 + 0.6 * rng.random()))}"/>')
        self.body.append(f'<g fill="{WHITE}">{"".join(dots)}</g>')

    def wobble(self, pts, jitter=1.6):
        """A smooth path through points, nudged so it reads as drawn by hand."""
        rng = self.rng
        pts = [(x + rng.uniform(-jitter, jitter), y + rng.uniform(-jitter, jitter)) for x, y in pts]
        d = f'M{f(pts[0][0])} {f(pts[0][1])}'
        for i in range(1, len(pts) - 1):
            mx, my = (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2
            d += f'Q{f(pts[i][0])} {f(pts[i][1])} {f(mx)} {f(my)}'
        d += f'L{f(pts[-1][0])} {f(pts[-1][1])}'
        return d

    def line(self, d, w=1.4, op=0.9, color=WHITE):
        self.body.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{f(w)}" '
                         f'stroke-linecap="round" stroke-linejoin="round" opacity="{f(op)}"/>')

    def circle_pts(self, cx, cy, r, n=48):
        return [(cx + r * math.cos(math.tau * i / n), cy + r * math.sin(math.tau * i / n)) for i in range(n + 1)]

    def ring(self, cx, cy, r, w=1.2, op=0.85):
        self.line(self.wobble(self.circle_pts(cx, cy, r, max(24, int(r / 3))), jitter=min(1.4, r / 40)), w, op)

    def svg(self, title):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" width="{S}" height="{S}" '
                f'role="img" aria-label="{title}"><title>{title}</title>'
                f'<defs>{"".join(self.defs)}</defs>{"".join(self.body)}</svg>')


# --- the concepts ------------------------------------------------------------

def spiral():
    """Spiral Dynamics: a ribbon rising and widening through the eight value
    memes, beige at the bottom to turquoise at the top. Drawn like the rest of
    the set, in white linework; the meme colours glow softly behind each band."""
    a = Art(1)
    a.field('#141826', [(200, 650, 300, '#2a3358', 0.8), (620, 180, 320, '#1d4a5a', 0.7), (650, 640, 220, '#3b2a2a', 0.6)])
    a.defs.append('<filter id="band" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>')
    memes = ['#d9cdb3', '#9a7ad8', '#ef5a4a', '#4f7fe8', '#ff9a3a', '#5cc472', '#ffe04a', '#45d6da']
    turns = 3.6

    def at(t, side):
        """A point on the ribbon's upper (side=-1) or lower (side=1) edge."""
        r = 22 + 240 * t ** 1.1
        th = t * math.tau * turns + math.pi / 2
        width = 4 + 34 * t
        y = 712 - 580 * t + r * 0.26 * math.sin(th)
        return 400 + r * math.cos(th), y + side * width / 2, math.sin(th)

    n = 720
    # the meme colours: soft blurred glows along the ribbon, band by band
    g = ['<g filter="url(#band)" style="mix-blend-mode:screen">']
    for band in range(8):
        pts = []
        for i in range(n // 8 * band, n // 8 * (band + 1) + 1):
            x, y, _ = at(i / n, 0)
            pts.append(f'{f(x)} {f(y)}')
        g.append(f'<path d="M{"L".join(pts)}" fill="none" stroke="{memes[band]}" '
                 f'stroke-width="{f(10 + 30 * band / 7)}" stroke-linecap="round" opacity="0.75"/>')
    g.append('</g>')
    a.body.append(''.join(g))

    # white linework: both edges, faint where the ribbon passes behind
    for side in (-1, 1):
        run, front = [], None
        for i in range(n + 1):
            x, y, z = at(i / n, side)
            is_front = z > -0.05
            if front is not None and is_front != front and len(run) > 1:
                a.line(a.wobble(run, 0.5), 1.2 if front else 0.7, 0.9 if front else 0.35)
                run = run[-1:]
            run.append((x, y))
            front = is_front
        a.line(a.wobble(run, 0.5), 1.2 if front else 0.7, 0.9 if front else 0.35)
    # cross-hatching so it reads as a ribbon
    for i in range(0, n, 6):
        x1, y1, z = at(i / n, -1)
        x2, y2, _ = at(i / n, 1)
        a.line(f'M{f(x1)} {f(y1)}L{f(x2)} {f(y2)}', 0.6, 0.55 if z > 0 else 0.18)
    for (x, y, r) in [(140, 120, 60), (680, 520, 50), (120, 470, 45), (400, 740, 40)]:
        a.stipple(x, y, r, 55, 0.6)
    a.grain()
    return a.svg('Spiral')


def holons():
    """Holonic architecture: wholes made of wholes. Hexagons inside hexagons,
    each held by a circle."""
    a = Art(2)
    a.field('#0f2427', [(400, 400, 300, '#1f5a5c', 0.7), (150, 650, 220, '#2b3b55', 0.6), (680, 150, 200, '#3d5b3a', 0.5)])

    def hexagon(cx, cy, r, rot=0):
        return [(cx + r * math.cos(rot + math.tau * i / 6), cy + r * math.sin(rot + math.tau * i / 6)) for i in range(7)]

    def holon(cx, cy, r, depth):
        a.line(a.wobble(hexagon(cx, cy, r, math.pi / 6), 0.8 if depth else 1.2), 1.8 - 0.5 * depth, 0.95 - 0.2 * depth)
        a.ring(cx, cy, r * 1.04, 0.7, 0.35)
        if depth < 2:
            k = r / 3
            for i in range(7):
                if i == 0:
                    holon(cx, cy, k * 0.95, depth + 1)
                else:
                    ang = math.pi / 6 + math.tau * (i - 1) / 6 + math.pi / 6
                    holon(cx + 2 * k * math.cos(ang - math.pi / 6), cy + 2 * k * math.sin(ang - math.pi / 6), k * 0.95, depth + 1)
        else:
            a.stipple(cx, cy, r * 0.6, 6, 0.9)

    a.body.append(f'<circle cx="400" cy="400" r="70" fill="{WHITE}" opacity="0.18" filter="url(#glow)"/>')
    holon(400, 400, 300, 0)
    a.grain()
    return a.svg('Holonic architecture')


def forest():
    """The forest's pattern language: canopy, shade-tolerant understorey,
    shrubs, herbs, ground cover, a climber, and the roots below."""
    a = Art(3)
    a.field('#0e1a14', [(400, 120, 340, '#5b6d3a', 0.6), (650, 260, 200, '#b8743a', 0.35), (200, 700, 300, '#24304a', 0.7)])
    ground = 560
    rng = a.rng

    def crown(cx, cy, w, h, n):
        for _ in range(n):
            x = cx + rng.uniform(-w, w) * 0.8
            y = cy + rng.uniform(-h, h) * 0.6
            a.ring(x, y, rng.uniform(w * 0.28, w * 0.45), 1.1, 0.8)

    # canopy tree
    a.line(a.wobble([(300, ground), (304, 470), (298, 380), (302, 300)], 1.2), 2.4, 0.95)
    for bx, by in [(250, 250), (360, 240), (300, 200)]:
        a.line(a.wobble([(300, 320), ((300 + bx) / 2, (320 + by) / 2 + 10), (bx, by)], 1), 1.4, 0.85)
    crown(300, 220, 150, 110, 14)
    # shade-tolerant understorey tree
    a.line(a.wobble([(560, ground), (563, 470), (558, 420)], 1), 2, 0.9)
    crown(560, 390, 85, 55, 8)
    # shrubs
    for sx in (160, 440, 690):
        crown(sx, ground - 40, 50, 30, 5)
    # herbs
    for i in range(16):
        x = 90 + i * 42 + rng.uniform(-8, 8)
        h = rng.uniform(25, 55)
        a.line(a.wobble([(x, ground), (x + rng.uniform(-6, 6), ground - h / 2), (x + rng.uniform(-10, 10), ground - h)], 0.6), 1, 0.8)
        a.ring(x + rng.uniform(-10, 10), ground - h, 4, 0.8, 0.8)
    # ground cover
    for i in range(30):
        x = 40 + i * 25
        a.line(a.wobble([(x, ground), (x + 6, ground - 8), (x + 13, ground)], 0.4), 0.8, 0.7)
    # climber spiralling up the canopy trunk
    pts = [(300 + 14 * math.sin(t * 0.55), ground - t * 2.6) for t in range(0, 100)]
    a.line(a.wobble(pts, 0.6), 1, 0.85)
    for t in range(8, 100, 12):
        x, y = pts[t]
        a.ring(x + 10 * (1 if t % 24 else -1), y, 4, 0.7, 0.8)
    # ground line and roots
    a.line(a.wobble([(0, ground), (200, ground + 3), (400, ground - 2), (600, ground + 2), (800, ground)], 1), 1.4, 0.8)

    def root(x, y, ang, length, depth):
        if depth == 0 or length < 8:
            return
        x2, y2 = x + length * math.cos(ang), y + length * math.sin(ang)
        a.line(a.wobble([(x, y), ((x + x2) / 2 + rng.uniform(-6, 6), (y + y2) / 2), (x2, y2)], 1), 0.4 + depth * 0.25, 0.75)
        for _ in range(2):
            root(x2, y2, ang + rng.uniform(-0.6, 0.6), length * 0.7, depth - 1)

    for rx in (300, 560, 160, 440, 690):
        for _ in range(2):
            root(rx, ground + 2, math.pi / 2 + rng.uniform(-0.6, 0.6), 60, 5)
    for _ in range(9):
        a.stipple(rng.uniform(60, 740), rng.uniform(600, 760), rng.uniform(25, 45), 40, 0.55)
    a.grain()
    return a.svg('Forest pattern language')


def ikigai():
    """Ikigai: four overlapping circles and the small bright place where all
    four meet."""
    a = Art(4)
    a.field('#1d1414', [(400, 400, 330, '#5a2f22', 0.6), (180, 180, 220, '#6b4a1e', 0.5), (640, 640, 220, '#1f3d3d', 0.6)])
    fills = ['#f28c4a', '#e0604a', '#9fbf5a', '#5fb0c8']
    centres = [(400, 285), (285, 400), (515, 400), (400, 515)]
    a.defs.append('<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="40"/></filter>')
    g = ['<g filter="url(#soft)" style="mix-blend-mode:screen">']
    for (x, y), c in zip(centres, fills):
        g.append(f'<circle cx="{x}" cy="{y}" r="140" fill="{c}" opacity="0.45"/>')
    g.append('</g>')
    a.body.append(''.join(g))
    for x, y in centres:
        a.ring(x, y, 175, 1.4, 0.9)
    a.body.append(f'<circle cx="400" cy="400" r="34" fill="{WHITE}" opacity="0.55" filter="url(#glow)"/>')
    a.ring(400, 400, 9, 1.2, 1)
    for x, y in [(345, 345), (455, 345), (345, 455), (455, 455)]:
        a.stipple(x, y, 26, 26, 0.75)
    a.grain()
    return a.svg('Ikigai')


def ifs():
    """Internal Family Systems: the calm, bright Self at the centre, with many
    parts around it, each its own small circle."""
    a = Art(5)
    a.field('#22161d', [(400, 400, 330, '#6a3c4c', 0.7), (400, 400, 160, '#c98f8a', 0.45), (120, 680, 200, '#24304a', 0.6)])
    rng = a.rng
    a.body.append(f'<circle cx="400" cy="400" r="60" fill="{WHITE}" opacity="0.7" filter="url(#glow)"/>')
    a.ring(400, 400, 22, 1.4, 1)
    # radiating, branching light from the Self
    for i in range(24):
        ang = math.tau * i / 24
        x1, y1 = 400 + 40 * math.cos(ang), 400 + 40 * math.sin(ang)
        x2, y2 = 400 + 150 * math.cos(ang), 400 + 150 * math.sin(ang)
        a.line(a.wobble([(x1, y1), ((x1 + x2) / 2, (y1 + y2) / 2), (x2, y2)], 1.2), 1, 0.7)
        for s in (-1, 1):
            b = ang + s * 0.22
            a.line(a.wobble([(x2, y2), (x2 + 22 * math.cos(b), y2 + 22 * math.sin(b))], 0.6), 0.7, 0.6)
    # the parts
    for _ in range(70):
        ang = rng.random() * math.tau
        d = rng.uniform(200, 320)
        a.ring(400 + d * math.cos(ang), 400 + d * math.sin(ang), rng.choice([5, 6, 8, 10, 13, 18, 24]), 1.1, 0.85)
    a.grain()
    return a.svg('Internal Family Systems')


def fractals():
    """Fractals: the same pattern at every scale. A branching tree over a
    Sierpinski triangle."""
    a = Art(6)
    a.field('#101a2a', [(400, 300, 320, '#1f4a6a', 0.7), (650, 650, 240, '#5a3a24', 0.5), (150, 650, 200, '#1f3f3a', 0.6)])
    rng = a.rng

    tris = []

    def sier(x, y, s, depth):
        if depth == 0:
            tris.append([(x, y), (x + s, y), (x + s / 2, y - s * 0.866), (x, y)])
            return
        h = s / 2
        sier(x, y, h, depth - 1)
        sier(x + h, y, h, depth - 1)
        sier(x + h / 2, y - h * 0.866, h, depth - 1)

    sier(130, 700, 540, 5)
    for t in tris:
        a.line('M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in t), 0.6, 0.3)

    def branch(x, y, ang, length, depth):
        if depth == 0:
            a.stipple(x, y, 6, 3, 0.9)
            return
        x2, y2 = x + length * math.cos(ang), y + length * math.sin(ang)
        a.line(a.wobble([(x, y), ((x + x2) / 2, (y + y2) / 2), (x2, y2)], 0.5), 0.5 + depth * 0.32, 0.9)
        spread = 0.42 + rng.uniform(-0.04, 0.04)
        branch(x2, y2, ang - spread, length * 0.72, depth - 1)
        branch(x2, y2, ang + spread, length * 0.72, depth - 1)

    branch(400, 740, -math.pi / 2, 150, 10)
    a.grain()
    return a.svg('Fractals')


def mycelium():
    """Mycelium networks: white hyphae branching through dark soil, with
    stippled clouds where they meet and trade."""
    a = Art(7)
    a.field('#121426', [(200, 300, 260, '#243a6a', 0.7), (620, 420, 280, '#1f5a5c', 0.6), (380, 680, 260, '#5a2a3a', 0.6), (650, 120, 180, '#6b4a2a', 0.5)])
    rng = a.rng
    nodes = []

    def hypha(x, y, ang, steps, w):
        pts = [(x, y)]
        for _ in range(steps):
            ang += rng.uniform(-0.35, 0.35)
            x += 14 * math.cos(ang)
            y += 14 * math.sin(ang)
            pts.append((x, y))
            if rng.random() < 0.12 and w > 0.5:
                hypha(x, y, ang + rng.choice([-1, 1]) * rng.uniform(0.5, 1.1), steps // 2, w * 0.7)
            if rng.random() < 0.05:
                nodes.append((x, y))
        a.line(a.wobble(pts, 0.8), w, 0.9)

    for sx in (120, 330, 520, 700):
        for _ in range(3):
            hypha(sx + rng.uniform(-30, 30), 30, math.pi / 2 + rng.uniform(-0.5, 0.5), 50, 1.8)
    for (x, y) in nodes[:40]:
        a.stipple(x, y, rng.uniform(16, 34), 45, 0.7)
    a.grain()
    return a.svg('Mycelium networks')


def gameb():
    """Game B: from a board of separate, competing squares to a circle of
    players who all win together, each connected to every other."""
    a = Art(8)
    a.field('#1a1714', [(560, 360, 300, '#7a4a24', 0.55), (240, 560, 260, '#1f4a4a', 0.6), (650, 680, 200, '#3a2a40', 0.4)])
    rng = a.rng
    # the old game: a fading grid of squares, bottom left
    for i in range(6):
        for j in range(6):
            x, y = 40 + i * 34, 560 + j * 34
            if i + j > 7:
                continue
            op = max(0.08, 0.5 - (i + j) * 0.06)
            a.line(f'M{x} {y}h26v26h-26z', 0.9, op)
    # the new game: a circle of players, everyone linked
    n = 14
    cx, cy, R = 450, 360, 230
    pts = [(cx + R * math.cos(math.tau * i / n - math.pi / 2), cy + R * math.sin(math.tau * i / n - math.pi / 2)) for i in range(n)]
    for i in range(n):
        for j in range(i + 1, n):
            (x1, y1), (x2, y2) = pts[i], pts[j]
            mx, my = (x1 + x2) / 2, (y1 + y2) / 2
            # bow each link gently toward the centre
            bx, by = mx + (cx - mx) * 0.18, my + (cy - my) * 0.18
            a.line(f'M{f(x1)} {f(y1)}Q{f(bx)} {f(by)} {f(x2)} {f(y2)}', 0.6, 0.32)
    a.body.append(f'<circle cx="{cx}" cy="{cy}" r="50" fill="{WHITE}" opacity="0.25" filter="url(#glow)"/>')
    for x, y in pts:
        a.body.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="16" fill="{WHITE}" opacity="0.12"/>')
        a.ring(x, y, 16, 1.4, 0.95)
        a.stipple(x, y, 10, 8, 0.9)
    a.grain()
    return a.svg('Game B')


def intro():
    """The opening drawing on the home page: a little forest ecosystem under
    the moon, in the forest pattern language's layers. Linework only, on a
    clear background, so it draws itself in over the video. Every path is
    given its place in the drawing order (--o, 0–1), ground first and the
    moon last."""
    W, H = 1200, 640
    a = Art(11)
    rng = a.rng
    ground = 470

    def crown(cx, cy, w, h, n):
        # A cluster of overlapping rings, as in the forest pattern language
        # diagram (used for the shrubs)
        for _ in range(n):
            x = cx + rng.uniform(-w, w) * 0.8
            y = cy + rng.uniform(-h, h) * 0.6
            a.ring(x, y, rng.uniform(w * 0.26, w * 0.42), 0.9, 0.75)

    def holon(cx, cy, r, n):
        # A tree's crown as a circle holding smaller circles, a whole made of
        # wholes
        a.ring(cx, cy, r, 1.1, 0.9)
        for _ in range(n):
            ang = rng.uniform(0, math.tau)
            d = r * rng.uniform(0.2, 0.5)
            a.ring(cx + d * math.cos(ang), cy + d * math.sin(ang), r * rng.uniform(0.2, 0.36), 0.8, 0.7)

    # the ground line, drawn left to right: it starts from a small spiral
    # curling down on the left (where Game A ends) and finishes in one curling
    # up on the right (where Game B starts)
    def spiral(cx, cy, a0, a1, r0, r1, n=28):
        return [(cx + (r0 + (r1 - r0) * i / n) * math.cos(a0 + (a1 - a0) * i / n),
                 cy + (r0 + (r1 - r0) * i / n) * math.sin(a0 + (a1 - a0) * i / n)) for i in range(n + 1)]
    left = spiral(44, ground + 22, -math.pi / 2 - 2.5 * math.pi, -math.pi / 2, 2, 18)
    right = spiral(1156, ground - 22, math.pi / 2, math.pi / 2 + 2.5 * math.pi, 18, 2)
    ground_from = len(a.body)
    a.line(a.wobble(left + [(80, ground + 1), (300, ground + 3), (600, ground - 2), (900, ground + 2), (1120, ground)] + right, 0.4), 1.1, 0.8)
    # canopy tree: trunk, branches, crown
    a.line(a.wobble([(560, ground), (563, 400), (558, 320), (561, 250)], 1), 1.8, 0.9)
    for bx, by in [(510, 225), (612, 215)]:
        a.line(a.wobble([(560, 290), ((560 + bx) / 2, (290 + by) / 2 + 8), (bx, by)], 0.8), 1, 0.8)
    holon(560, 185, 108, 7)
    # shade-tolerant understorey trees
    for x, top, r in [(780, 350, 54), (360, 368, 46)]:
        a.line(a.wobble([(x, ground), (x + 3, (ground + top) / 2), (x - 1, top)], 0.8), 1.4, 0.85)
        holon(x, top - r * 0.75, r, 4)
    # shrubs
    for sx in (230, 470, 900, 1020):
        crown(sx, ground - 30, 42, 24, 5)
    # herbs, each with a small seed head
    for i in range(18):
        x = 120 + i * 54 + rng.uniform(-8, 8)
        h = rng.uniform(20, 46)
        a.line(a.wobble([(x, ground), (x + rng.uniform(-5, 5), ground - h / 2), (x + rng.uniform(-8, 8), ground - h)], 0.5), 0.8, 0.75)
        a.ring(x + rng.uniform(-6, 6), ground - h, 3.5, 0.7, 0.75)
    # the climber spiralling up the canopy trunk, with leaves
    pts = [(560 + 13 * math.sin(t * 0.55), ground - t * 2.4) for t in range(0, 88)]
    a.line(a.wobble(pts, 0.5), 0.8, 0.8)
    for t in range(8, 88, 11):
        x, y = pts[t]
        a.ring(x + 9 * (1 if t % 22 else -1), y, 3.5, 0.6, 0.75)
    # ground cover
    for i in range(40):
        x = 80 + i * 26
        a.line(a.wobble([(x, ground), (x + 6, ground - 7), (x + 12, ground)], 0.3), 0.6, 0.6)
    # roots, finer as they branch down

    def root(x, y, ang, length, depth):
        if depth == 0 or length < 7:
            return
        x2, y2 = x + length * math.cos(ang), y + length * math.sin(ang)
        a.line(a.wobble([(x, y), ((x + x2) / 2 + rng.uniform(-5, 5), (y + y2) / 2), (x2, y2)], 0.8), 0.3 + depth * 0.2, 0.65)
        for _ in range(2):
            root(x2, y2, ang + rng.uniform(-0.6, 0.6), length * 0.7, depth - 1)

    for rx in (560, 780, 360, 230, 900):
        for _ in range(2):
            root(rx, ground + 2, math.pi / 2 + rng.uniform(-0.6, 0.6), 48, 5)
    # the moon: its outline and a crescent's inner edge
    mx, my, mr = 940, 115, 44
    moon_from = len(a.body)
    a.ring(mx, my, mr, 1.1, 0.9)
    arc = [(mx + 16 + mr * 0.9 * math.cos(t), my + mr * 0.9 * math.sin(t)) for t in [math.pi * (0.62 + 0.76 * i / 30) for i in range(31)]]
    a.line(a.wobble(arc, 0.3), 0.9, 0.8)
    moon_to = len(a.body)

    # The moon's lines are marked (class "moon") so the page can fly the
    # moon into the hub's moon as the drawing fades
    body = []
    for i, el in enumerate(a.body):
        cls = ' class="moon"' if moon_from <= i < moon_to else ' class="ground"' if i == ground_from else ''
        body.append(el.replace('<path ', f'<path pathLength="1"{cls} style="--o:{i / len(a.body):.3f}" ', 1))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
            f'role="img" aria-label="A forest under the moon"><title>A forest under the moon</title>'
            f'<circle class="moon-glow moon" cx="{mx}" cy="{my}" r="{mr * 1.6}" fill="{WHITE}" opacity="0.14"/>'
            f'{"".join(body)}</svg>')


ART = {
    'spiral': spiral,
    'holonic-architecture': holons,
    'forest-pattern-language': forest,
    'ikigai': ikigai,
    'internal-family-systems': ifs,
    'fractals': fractals,
    'mycelium-networks': mycelium,
    'game-b': gameb,
    'intro-forest-moon': intro,
}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    for name, draw in ART.items():
        svg = draw()
        (OUT / f'{name}.svg').write_text(svg)
        print(f'{name}.svg  {len(svg) // 1024} KB')
