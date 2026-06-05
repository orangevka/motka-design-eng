# Usage: python scripts/measure.py <rendered.png> <figma.png> [y0 y1]
# Сравнивает по ширине 1440; печатает размеры, и (опц.) кропает обе по [y0:y1] и считает попиксельную дельту.
import sys
from PIL import Image, ImageChops

rendered = Image.open(sys.argv[1]).convert('RGB')
figma = Image.open(sys.argv[2]).convert('RGB')
print(f"rendered: {rendered.size}  figma: {figma.size}")

if len(sys.argv) >= 5:
    y0, y1 = int(sys.argv[3]), int(sys.argv[4])
    r = rendered.crop((0, y0, rendered.width, y1))
    f = figma.crop((0, y0, figma.width, y1))
    w = min(r.width, f.width)
    r = r.crop((0, 0, w, r.height)); f = f.crop((0, 0, w, f.height))
    h = min(r.height, f.height)
    r = r.crop((0, 0, w, h)); f = f.crop((0, 0, w, h))
    diff = ImageChops.difference(r, f)
    bbox = diff.getbbox()
    gray = diff.convert('L')
    hist = gray.histogram()
    diffpx = sum(hist[24:])
    total = w * h
    print(f"crop {w}x{h}  diff-bbox={bbox}  diff>{24}: {diffpx} px ({100*diffpx/total:.2f}%)")
    diff.save('scripts/_shots/_diff.png')
