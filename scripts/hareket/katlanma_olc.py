"""Hareket alanında katlanma (yırtılma/ezilme) var mı? Jacobian determinantı <0.35 olan noktalar katlanıyor demektir.
Sadece resimde çizgi/kenar olan yerlere bakılır (düz duvardaki katlanma görünmez).
Kullanım: python3 katlanma_olc.py hareketlendir.py kaynak.png [adım=2]"""
import sys, importlib.util, numpy as np
from PIL import Image, ImageFilter
script, src = sys.argv[1], sys.argv[2]; step = int(sys.argv[3]) if len(sys.argv) > 3 else 2
sys.argv = ['h', src, '/tmp/_bos', '0']
spec = importlib.util.spec_from_file_location('hz', script); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
g = np.asarray(Image.open(src).convert('L')).astype(np.float32)
mag = np.hypot(np.gradient(g, axis=1), np.gradient(g, axis=0))
edge = np.asarray(Image.fromarray(((mag > 12) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
rows = []
for i in range(0, 144, step):
    dx, dy = m.displacement(i / 24)
    det = (1 + np.gradient(dx, axis=1)) * (1 + np.gradient(dy, axis=0)) - np.gradient(dx, axis=0) * np.gradient(dy, axis=1)
    dd = np.where(edge, det, 9.0); y, x = np.unravel_index(np.argmin(dd), dd.shape)
    rows.append((i, float(dd.min()), int(x), int(y), float(np.abs(dx).max()), float(np.abs(dy).max())))
rows.sort(key=lambda r: r[1])
print('çizgili yerlerde en kötü determinant: %.2f (kare %d, yer %d,%d)' % (rows[0][1], rows[0][0], rows[0][2], rows[0][3]))
bad = [r for r in rows if r[1] < 0.4]
print('0.4 altı kare: %d / %d' % (len(bad), len(rows)))
for r in bad[:6]: print('  kare %3d det %.2f yer (%d,%d) |dx|max %.1f |dy|max %.1f' % r)
