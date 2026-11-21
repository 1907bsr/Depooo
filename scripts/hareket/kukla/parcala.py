"""Adım 1: resmi bölgelere ayır (baş, gövde, iki kol) ve maskeleri kaydet."""
import numpy as np
from lib import *
a = load(); H, W, _ = a.shape
L = lum(a); R, G, B = a[..., 0], a[..., 1], a[..., 2]
yy, xx = np.mgrid[0:H, 0:W]
F = np.asarray(Image.open('F.png')) > 127
bg = np.asarray(Image.open('bg.png')) > 127
aL = np.asarray(Image.open('armL_core.png')) > 127
aR = np.asarray(Image.open('armR_core.png')) > 127
ink = F & (L < 150)

# --- KOL YAN KENARI (açık renkli saçak): koldan koyu çizgiyi geçmeden ulaşılan açık pikseller de kola aittir
#     (gövdeye bırakılırsa kol uzaklaşınca gövdenin kenarında soluk bir "hale" çizgisi kalır)
def arm_rim(core):
    cand = F & (L > 150) & grow(core, 4) & ~core
    R_ = core.copy()
    for _ in range(6):
        N = dilate4(R_) & (cand | core)
        if (N == R_).all(): break
        R_ = N
    return R_
aL = arm_rim(aL); aR = arm_rim(aR)

# --- BAŞ (saç + yüz + kıvırcıklar): çokgen
head_poly = [(262, 0), (446, 0), (446, 236), (420, 232), (372, 201), (347, 205), (322, 201), (275, 236), (262, 236)]
head = F & (poly_mask((H, W), head_poly) > 0.5) & ~((yy > 224) & ((xx < 300) | (xx > 384)))

# --- GÖVDE (boyun, omuz çizgileri, askılar, dantel, korse, bel bandı): y<424, baştan ve kollardan arta kalan
zone = F & (yy < 430) & ~head
tcand = zone & ~aL & ~aR & (L > 150)
tflood = flood([(350, 300), (350, 390), (350, 411), (350, 232), (288, 250), (412, 250)], tcand)
near = lambda m, r: grow(m, r)
armL_ex = F & ~head & near(aL, 3) & ~near(tflood, 4)      # sadece kola yakın olanlar (dış kontur vb.)
armR_ex = F & ~head & near(aR, 3) & ~near(tflood, 4)
torso = zone & ~aL & ~aR & ~armL_ex & ~armR_ex
# kol sahipliği: çekirdek + 3 px içindeki çizgi/saçak (gövdeye ait çizgiler çoğaltılır: omuz/koltuk altı kenarı)
armL = (aL | (F & near(aL, 3) & ink) | (F & near(aL, 1))) & ~head
armR = (aR | (F & near(aR, 3) & ink) | (F & near(aR, 1))) & ~head
print('baş', head.sum(), 'gövde', torso.sum(), 'kolL', armL.sum(), 'kolR', armR.sum())
for n, m in dict(head=head, torso=torso, armL=armL, armR=armR).items(): save_mask(m, f'm_{n}.png')
ov = overlay(a, [torso, armL, armR, head], [(0, 120, 255), (0, 255, 0), (255, 0, 0), (255, 220, 0)], 0.5)
tosave(ov, 'ov_parts.png', box=(215, 120, 485, 450), sc=2.6)
