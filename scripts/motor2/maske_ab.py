"""A/B değişim maskesi. Kullanım: python3 maske_ab.py A.png B.png cikis_maske.png
A ve B aynı boyuta getirilir, mutlak fark alınır, eşiklenir, küçük lekeler temizlenir, 10 px bulanıklaştırılır.
Maske görselin %25'inden fazlasını kaplıyorsa hizalama kaymış demektir → uyarı verir."""
import sys, numpy as np
from PIL import Image, ImageFilter
a = Image.open(sys.argv[1]).convert('RGB'); b = Image.open(sys.argv[2]).convert('RGB').resize(a.size, Image.LANCZOS)
# Gemini düzenlemede ince dokuyu da yeniden çizer: önce 3 px bulanıklaştır, sonra yalnızca yoğun/anlamlı değişimi al
THR = float(sys.argv[4]) if len(sys.argv) > 4 else 20
G = int(sys.argv[5]) if len(sys.argv) > 5 else 8
DENS = float(sys.argv[6]) if len(sys.argv) > 6 else .35
MINC = int(sys.argv[7]) if len(sys.argv) > 7 else 3
ab, bb = a.filter(ImageFilter.GaussianBlur(3)), b.filter(ImageFilter.GaussianBlur(3))
d = np.abs(np.asarray(ab, int) - np.asarray(bb, int)).max(2) > THR
g = G; H, W = d.shape; h, w = H // g, W // g
blk = d[:h * g, :w * g].reshape(h, g, w, g).mean((1, 3)) > DENS   # yoğun değişen hücreler
lab = np.zeros(blk.shape, int); n = 0
for y, x in zip(*np.where(blk)):
    if lab[y, x]: continue
    n += 1; st = [(y, x)]; lab[y, x] = n
    while st:
        cy, cx = st.pop()
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                yy, xx = cy + dy, cx + dx
                if 0 <= yy < h and 0 <= xx < w and blk[yy, xx] and not lab[yy, xx]: lab[yy, xx] = n; st.append((yy, xx))
keep = np.zeros_like(blk)
for i in range(1, n + 1):
    c = lab == i
    kenar = c[0].any() or c[-1].any() or c[:, 0].any() or c[:, -1].any()   # kenara yapışanlar hizalama artığıdır
    if c.sum() >= MINC and not (kenar and c.sum() < 40): keep |= c          # küçük lekeleri ve kenar artıklarını at
p = np.pad(keep, 2); keep = np.max([p[i:i + h, j:j + w] for i in range(5) for j in range(5)], axis=0)  # 2 hücre genişlet
m = Image.fromarray((np.kron(keep, np.ones((g, g))) * 255).astype('uint8')).resize(a.size).filter(ImageFilter.GaussianBlur(10))
alpha = np.asarray(m)
rgba = np.zeros((a.size[1], a.size[0], 4), 'uint8'); rgba[..., :3] = 255; rgba[..., 3] = alpha
Image.fromarray(rgba).save(sys.argv[3])
kapsam = (alpha > 128).mean()
print(f'maske kapsamı: %{kapsam * 100:.2f}', '← UYARI: hizalama kaymış, bu çift yeniden üretilmeli' if kapsam > .25 else '(normal)')
