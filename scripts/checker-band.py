"""Generates the horizontally tileable wavy checkerboard strip used above the footer.

The distortion field is periodic in x with period W, and the number of columns is even,
so the tile repeats seamlessly with background-repeat: repeat-x.
Usage: python3 scripts/checker-band.py > assets/brand/checker-band-sage.svg
"""
import math

W, H = 2400, 96          # tile size (viewBox units); shown at the band height
COLS = 16                # must be even for a seamless repeat
ROW_H = 92               # cell height before distortion
LIGHT, DARK = '#E8DFD0', '#596052'
STEPS = 10               # samples per cell edge


def field(x, y):
    t = 2 * math.pi * x / W
    dx = (26 * math.sin(2 * t + y / 60)
          + 14 * math.sin(5 * t + 1.1)
          + 8 * math.sin(9 * t + y / 34 + 0.4))
    dy = (12 * math.sin(3 * t + 0.7)
          + 7 * math.sin(6 * t + 2.0)
          + 4 * math.sin(10 * t - y / 40))
    return x + dx, y + dy


cw = W / COLS
rows = range(-2, 3)       # covers y from about -150 to +220
paths = []
for i in range(-1, COLS + 1):          # one extra column each side, clipped by the viewBox
    for j in rows:
        if (i + j) % 2:
            continue
        x0, x1 = i * cw, (i + 1) * cw
        y0, y1 = j * ROW_H + 14, (j + 1) * ROW_H + 14
        corners = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
        pts = []
        for k in range(4):
            (ax, ay), (bx, by) = corners[k], corners[(k + 1) % 4]
            for s in range(STEPS):
                u = s / STEPS
                pts.append(field(ax + (bx - ax) * u, ay + (by - ay) * u))
        paths.append('M' + ' '.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'Z')

print(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" preserveAspectRatio="none" shape-rendering="geometricPrecision">'
      f'<rect width="{W}" height="{H}" fill="{LIGHT}"/>'
      f'<path fill="{DARK}" d="{"".join(paths)}"/></svg>')
