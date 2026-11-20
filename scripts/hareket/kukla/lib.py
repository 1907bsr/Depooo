"""Kukla (kesip-bölme) yardımcıları: bölge doldurma (flood), maske işlemleri."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import os

def load(path=None):
    path = path or os.environ.get('KUKLA_KAYNAK', 'kaynak.png')
    return np.asarray(Image.open(path).convert('RGB')).astype(np.float32)

def lum(a): return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]

def shift(m, dy, dx):
    o = np.zeros_like(m)
    H, W = m.shape[:2]
    ys = slice(max(dy, 0), H + min(dy, 0)); yd = slice(max(-dy, 0), H + min(-dy, 0))
    xs = slice(max(dx, 0), W + min(dx, 0)); xd = slice(max(-dx, 0), W + min(-dx, 0))
    o[ys, xs] = m[yd, xd]
    return o

def dilate4(m):
    return m | shift(m, 1, 0) | shift(m, -1, 0) | shift(m, 0, 1) | shift(m, 0, -1)

def dilate8(m):
    return dilate4(m) | shift(m, 1, 1) | shift(m, 1, -1) | shift(m, -1, 1) | shift(m, -1, -1)

def erode4(m): return ~dilate4(~m)

def grow(m, r, eight=False):
    for _ in range(r): m = dilate8(m) if eight else dilate4(m)
    return m

def flood(seeds, cand, max_iter=3000):
    """4-komşuluklu bölge doldurma: seeds (liste (x,y)), cand: izinli piksel maskesi."""
    R = np.zeros_like(cand)
    for (x, y) in seeds:
        if cand[y, x]: R[y, x] = True
    for _ in range(max_iter):
        N = dilate4(R) & cand
        if (N == R).all(): break
        R = N
    return R

def poly_mask(shape, pts, ss=4):
    H, W = shape
    im = Image.new('L', (W * ss, H * ss), 0)
    ImageDraw.Draw(im).polygon([(x * ss, y * ss) for x, y in pts], fill=255)
    return np.asarray(im.resize((W, H), Image.BOX)).astype(np.float32) / 255.0

def line_mask(shape, pts, width, ss=4):
    H, W = shape
    im = Image.new('L', (W * ss, H * ss), 0)
    d = ImageDraw.Draw(im)
    d.line([(x * ss, y * ss) for x, y in pts], fill=255, width=int(width * ss))
    return np.asarray(im.resize((W, H), Image.BOX)).astype(np.float32) / 255.0

def save_mask(m, path):
    Image.fromarray((np.clip(m.astype(np.float32), 0, 1) * 255).astype(np.uint8)).save(path)

def overlay(a, masks, colors, alpha=0.55):
    o = a.copy()
    for m, c in zip(masks, colors):
        mm = m.astype(np.float32)[..., None] * alpha
        o = o * (1 - mm) + np.array(c, np.float32) * mm
    return o

def tosave(a, path, box=None, sc=1.0):
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    if box: im = im.crop(box)
    if sc != 1.0: im = im.resize((int(im.size[0] * sc), int(im.size[1] * sc)), Image.LANCZOS)
    im.save(path)
