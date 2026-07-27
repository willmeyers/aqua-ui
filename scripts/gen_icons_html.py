#!/usr/bin/env python3
"""Regenerate icons-fragment.html (the in-page icon gallery for"""
import os, glob, html

icons = sorted(glob.glob("website/icons/*.png"), key=lambda p: os.path.basename(p).lower())
cells = []
for p in icons:
    name = os.path.basename(p)[:-4]
    cells.append(
        f'<a class="icon-cell" href="{html.escape(os.path.relpath(p, "website"))}" target="_blank" '
        f'title="{html.escape(name)}" data-name="{html.escape(name.lower())}">'
        f'<img src="{html.escape(os.path.relpath(p, "website"))}" alt="{html.escape(name)}" loading="lazy">'
        f'<span class="name">{html.escape(name)}</span></a>'
    )
open("website/icons-fragment.html", "w").write("\n".join(cells) + "\n")
print(f"wrote icons-fragment.html with {len(icons)} icons")
