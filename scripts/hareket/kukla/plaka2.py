"""Adım 3: plakaya etek kenarını tamamla (kolların arkasında kalan kısım) ve artık çizgileri temizle."""
import numpy as np
from lib import *
a = load(); H, W, _ = a.shape
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
L = lum(a)
rem = np.load('rem.npy')
plate = np.load('plaka_duvar.npy').astype(np.float32)
armL = np.asarray(Image.open('m_armL.png')) > 127
armR = np.asarray(Image.open('m_armR.png')) > 127
F = np.asarray(Image.open('F.png')) > 127

# etek kontur çizgisi (merkez x, satır y): görünen kısımlardan ölçüldü
cL = [(430, 278.8), (442, 273.2), (454, 269.4), (466, 265.4), (478, 262.4), (490, 259.5), (502, 257.0), (514, 254.7), (600, 248.5), (616, 246.5), (640, 244.5)]
cR = [(430, 410.1), (442, 415.5), (454, 420.7), (466, 425.4), (478, 428.6), (490, 431.5), (502, 434.4), (514, 435.0), (600, 446), (616, 447.5), (640, 450)]
def cx(c, y): return np.interp(y, [p[0] for p in c], [p[1] for p in c])

def kontur_rengi(c):
    # görünen kontur piksellerinin en koyusu
    best = None
    for y in range(470, 500, 2):
        x = int(round(cx(c, y)))
        for xi in range(x - 2, x + 3):
            v = a[y, xi]
            if best is None or lum(v[None, None])[0, 0] < lum(best[None, None])[0, 0]: best = v
    return best
colL = kontur_rengi(cL); colR = kontur_rengi(cR)
print('kontur renkleri', colL.round(), colR.round())

def temizle_ve_tamamla(plate, arm, c, side, y0, y1):
    # 1) elin çevresindeki tüm artık çizgileri temizle (duvar değeriyle), 2) konturun içinde kalan tarafı krem doldur, 3) gizli kontur parçasını çiz
    band = grow(arm, 5) & (yy >= y0 - 4) & (yy <= y1 + 4)
    wall = np.load('plaka_duvar_tam.npy')
    plate[band] = wall[band]
    X = xx
    inside = (X >= cx(c, yy) + 1.5) if side == 'L' else (X <= cx(c, yy) - 1.5)
    side_ok = (xx < 350) if side == 'L' else (xx > 350)
    region = (rem | band) & inside & side_ok & (yy >= 430) & (yy <= y1 + 4)
    # krem rengi: satır bazlı, konturun iç tarafındaki bilinen piksellerden
    for y in range(430, y1 + 5):
        xs = np.nonzero(region[y])[0]
        if len(xs) == 0: continue
        xc = cx(c, y)
        lo, hi = (int(xc + 4), int(xc + 18)) if side == 'L' else (int(xc - 18), int(xc - 4))
        known = ~rem[y, lo:hi] & (L[y, lo:hi] > 200)
        col = np.median(a[y, lo:hi][known], axis=0) if known.sum() > 3 else np.array([236, 227, 214], np.float32)
        plate[y, xs] = col
    return plate

# duvar-saf kopya (arm bölgesi kaldırılınca doldurulan)
np.save('plaka_duvar_saf.npy', plate)
plate = temizle_ve_tamamla(plate, armL, cL, 'L', 496, 604)
plate = temizle_ve_tamamla(plate, armR, cR, 'R', 496, 604)

# gizli kontur çizgilerini çiz (4x süper örnekleme)
def stroke(plate, c, ya, yb, col, wpx=1.9):
    ss = 4
    im = Image.new('L', (W * ss, H * ss), 0); d = ImageDraw.Draw(im)
    pts = [(cx(c, y) * ss, y * ss) for y in range(ya, yb + 1, 2)]
    d.line(pts, fill=255, width=int(wpx * ss))
    al = np.asarray(im.resize((W, H), Image.BOX)).astype(np.float32)[..., None] / 255.0
    ramp = np.clip((np.arange(H, dtype=np.float32) - ya) / 14.0, 0, 1)[:, None, None]   # üst uçta yumuşak başlangıç (görünen ince kontura karışsın)
    al = al * ramp
    return plate * (1 - al) + np.array(col, np.float32) * al
plate = stroke(plate, cL, 486, 603, colL)
plate = stroke(plate, cR, 486, 603, colR)
np.save('plaka_son.npy', plate)
tosave(plate, 'plaka.png')
tosave(plate, 'plaka_el_sol.png', box=(215, 420, 315, 640), sc=4)
tosave(plate, 'plaka_el_sag.png', box=(385, 420, 485, 640), sc=4)
print('tamam')
