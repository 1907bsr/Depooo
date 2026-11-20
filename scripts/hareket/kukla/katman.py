"""Adım 2: katmanlar (RGBA) + temiz arka plan (plaka) + eklem bilgisi."""
import json, numpy as np
from lib import *
a = load(); H, W, _ = a.shape
L = lum(a); R, G, B = a[..., 0], a[..., 1], a[..., 2]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
bgm = np.asarray(Image.open('bg.png')) > 127
F = np.asarray(Image.open('F.png')) > 127
M = {n: np.asarray(Image.open(f'm_{n}.png')) > 127 for n in ('head', 'torso', 'armL', 'armR')}
ink = F & (L < 150)

# ---------------- eklemler (kaynak koordinatı)
J = dict(
    L=dict(S=(267, 252), E=(258, 402), W=(242, 518), T=(250, 594)),
    R=dict(S=(424, 252), E=(439, 402), W=(448, 518), T=(443, 594)),
    neck=(348, 222), waist=(350, 410))
RE, RW = 18.0, 10.0

def unit(v):
    v = np.array(v, np.float32); return v / np.linalg.norm(v)

def seg_masks(arm, side):
    j = J[side]
    S, E, Wr, T = [np.array(j[k], np.float32) for k in 'SEWT']
    ue = unit(unit(E - S) + unit(Wr - E)); uw = unit(unit(Wr - E) + unit(T - Wr))
    tE = (xx - E[0]) * ue[0] + (yy - E[1]) * ue[1]
    tW = (xx - Wr[0]) * uw[0] + (yy - Wr[1]) * uw[1]
    dE = np.hypot(xx - E[0], yy - E[1]) < RE
    dW = np.hypot(xx - Wr[0], yy - Wr[1]) < RW
    distE = np.hypot(xx - E[0], yy - E[1]); distW = np.hypot(xx - Wr[0], yy - Wr[1])
    dE = distE < RE + 1.5; dW = distW < RW + 1.5
    upper = arm & ((tE < 0) | dE)
    fore = arm & (((tE >= 0) & (tW < 0)) | dE | dW)
    hand = arm & ((tW >= 0) | dW)
    # yumuşak kapak kenarı (üstteki parça: dirsek yuvarlağı; alttaki: bilek yuvarlağı); kesik çizgisinin üst yarısı sert kalır
    ovU = np.where(tE >= 0, np.clip((RE + 1.5 - distE) / 3.0, 0, 1), 1.0).astype(np.float32)
    ovF = np.where(tW >= 0, np.clip((RW + 1.5 - distW) / 3.0, 0, 1), 1.0).astype(np.float32)
    return upper, fore, hand, ovU, ovF

parts = dict(head=M['head'], torso=M['torso'])
# gövde katmanına boyun uzantısı: y=206 satırındaki boyun derisini yukarı (y=188..205) çoğalt
neck_row = 206
neck_x = np.nonzero(M['torso'][neck_row, 322:376])[0] + 322
print('boyun satırı x', neck_x.min(), neck_x.max())
a_ext = a.copy(); ext_mask = np.zeros_like(M['torso'])
for y in range(186, neck_row):
    for x in range(max(neck_x.min() + 4, 326), min(neck_x.max() - 4, 368) + 1):
        a_ext[y, x] = a[neck_row, x]; ext_mask[y, x] = True
parts['torso'] = M['torso'] | ext_mask
OV = {}
for side in 'LR':
    u, f, h, ovU, ovF = seg_masks(M['arm' + side], side)
    parts['upper' + side], parts['fore' + side], parts['hand' + side] = u, f, h
    OV['upper' + side], OV['fore' + side] = ovU, ovF

# ---------------- renk sızdırma (kenar kirlenmesini temizle) + yumuşak alfa
def bleed(rgb, core, steps=4):
    known = core.copy(); out = rgb.copy() * core[..., None]
    for _ in range(steps):
        cnt = np.zeros(core.shape, np.float32); acc = np.zeros(rgb.shape, np.float32)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            k = shift(known, dy, dx).astype(np.float32); cnt += k
            acc += shift(out, dy, dx) * k[..., None]
        new = (~known) & (cnt > 0)
        out[new] = acc[new] / cnt[new][:, None]
        known = known | new
    return out, known

def build_layer(mask, others, src=None):
    src = a if src is None else src
    """İç kenarlar: alfa=1 (sert). Duvara bakan dış kenar: duvar rengine göre mat (alfa), renk=ön plan çizgi rengi."""
    rgb_bled, known = bleed(src, mask, 4)
    alpha = mask.astype(np.float32)
    rgb = np.where(mask[..., None], src, rgb_bled)
    ring = grow(mask, 3) & ~mask & bgm & ~others
    wall = np.load('plaka_duvar_tam.npy')
    d = wall - rgb_bled                                   # duvar - ön plan
    dd = (d * d).sum(-1)
    num = ((wall - src) * d).sum(-1)
    am = np.clip(num / np.maximum(dd, 1.0), 0, 1)
    am = np.where(dd > 400, am, 0.0)
    alpha = np.where(ring, am, alpha)
    rgb = np.where(ring[..., None], rgb_bled, rgb)
    return rgb, alpha

# ---------------- PLAKA (kaldırılan yerler dolduruldu)
owned = parts['head'] | parts['torso'] | M['armL'] | M['armR']
rem_torso = grow(parts['torso'], 2) & (yy < 402)
rem = grow(parts['head'] | M['armL'] | M['armR'], 2) | rem_torso
keep_ink = ink & ~owned                              # etek konturu, kıvrımlar vb. kalır
rem = rem & ~keep_ink
np.save('rem.npy', rem)

def pushpull(img, known, relax=40):
    h, w, c = img.shape
    levels = []; cur_i = img * known[..., None]; cur_w = known.astype(np.float32)
    while True:
        levels.append((cur_i, cur_w))
        hh, ww = cur_w.shape
        if min(hh, ww) <= 4: break
        h2, w2 = (hh + 1) // 2, (ww + 1) // 2
        pi = np.zeros((h2 * 2, w2 * 2, c), np.float32); pw = np.zeros((h2 * 2, w2 * 2), np.float32)
        pi[:hh, :ww] = cur_i; pw[:hh, :ww] = cur_w
        cur_i = pi.reshape(h2, 2, w2, 2, c).sum((1, 3)); cur_w = pw.reshape(h2, 2, w2, 2).sum((1, 3))
    res = None
    for (ci, cw) in reversed(levels):
        col = np.where(cw[..., None] > 0, ci / np.maximum(cw[..., None], 1e-6), 0)
        if res is not None:
            up = np.repeat(np.repeat(res, 2, 0), 2, 1)[:col.shape[0], :col.shape[1]]
            col = np.where(cw[..., None] > 0, col, up)
        res = col
    unk = ~known
    for _ in range(relax):
        p = np.pad(res, ((1, 1), (1, 1), (0, 0)), mode='edge')
        avg = (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) / 4
        res = np.where(unk[..., None], avg, res)
    return res

known_wall = bgm & ~rem                               # sadece duvar pikselleri örnek
plate_wall = pushpull(a, known_wall)
plate = np.where(rem[..., None], plate_wall, a)
np.save('plaka_duvar.npy', plate); np.save('plaka_duvar_tam.npy', plate_wall)
tosave(plate, 'plaka_ham.png')
print('plaka hazır (etek tamamlama sonraki adımda)')

import os
os.makedirs('katman', exist_ok=True)
meta = dict(J=J, RE=RE, RW=RW, layers={})
allm = {n: m for n, m in parts.items()}
for n, m in parts.items():
    oth = np.zeros_like(m)
    for n2, m2 in allm.items():
        if n2 != n: oth |= m2
    rgb, alpha = build_layer(m, oth, a_ext if n == 'torso' else None)
    if n in OV: alpha = alpha * OV[n]
    if n == 'torso': alpha = alpha * np.clip((430.0 - yy) / 6.0, 0, 1)     # alt kenar yumuşak: belin altında dikiş çizgisi görünmesin
    ys, xs = np.nonzero(alpha > 0.01)
    x0, x1, y0, y1 = max(xs.min() - 2, 0), min(xs.max() + 3, W), max(ys.min() - 2, 0), min(ys.max() + 3, H)
    rgba = np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8)[y0:y1, x0:x1]
    Image.fromarray(rgba, 'RGBA').save(f'katman/{n}.png')
    meta['layers'][n] = dict(x0=int(x0), y0=int(y0), x1=int(x1), y1=int(y1))
    print(n, (x0, y0, x1, y1), int(m.sum()))
json.dump(meta, open('katman/meta.json', 'w'), indent=1)

