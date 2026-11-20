"""Adım 0: duvarı (arka planı), figür siluetini ve iki kolun cilt çekirdeğini bulur. Çıktılar: bg.png, F.png, armL_core.png, armR_core.png
Kullanım (çalışma klasöründe kaynak.png olmalı): python3 ayir_arkaplan.py"""
import numpy as np
from lib import *
a = load(); H, W, _ = a.shape
L = lum(a); R, G, B = a[..., 0], a[..., 1], a[..., 2]
roi = np.zeros((H, W), bool); roi[0:760, 150:560] = True            # bacaklar plakada kalır (hareket etmiyor)
wall = roi & (R < 205) & (L > 105) & (L < 200) & ((R - G) < 22) & ((R - B) < 45)
seeds = [(155, 5), (555, 5), (155, 700), (555, 700), (155, 300), (555, 300), (470, 230), (440, 200),
         (288, 395), (412, 395), (249, 566), (452, 566)]               # kenarlar + kol/bel boşlukları + el boşlukları
bg = flood(seeds, wall)
F = roi & ~bg
skin = F & ((R - B) > 28) & (L > 160) & (R > 205)
armL = flood([(258, 300), (245, 480), (240, 540)], skin)
armR = flood([(442, 300), (455, 480), (460, 540)], skin)
save_mask(bg, 'bg.png'); save_mask(F, 'F.png'); save_mask(armL, 'armL_core.png'); save_mask(armR, 'armR_core.png')
print('duvar', bg.sum(), 'figür', F.sum(), 'kolL', armL.sum(), 'kolR', armR.sum())
