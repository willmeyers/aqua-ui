#!/usr/bin/env python3
"""Assemble components.html from site/: head + sections (in order) + foot."""
import glob, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = os.path.join(ROOT, 'website', 'site')

parts = [open(os.path.join(S, 'head.html')).read()]
for f in sorted(glob.glob(os.path.join(S, 'sections', '*.html'))):
    parts.append(open(f).read())
parts.append(open(os.path.join(S, 'foot.html')).read())
open(os.path.join(ROOT, 'website', 'components.html'), 'w').write(''.join(parts))
print(f'components.html from {len(parts) - 2} sections')
