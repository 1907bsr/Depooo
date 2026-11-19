"""Ana görsel + Gemini yüz varyantlarından sadece göz/ağız bölgesini alıp kareler üretir (kayma olmaz).
Kullanım: python3 yuz_kareleri.py SAHNE "gx,gy,grx,gry" "ax,ay,arx,ary"
Varyant dosyaları: medya/sutyen/gorsel/gemini/sNN-goz.png, sNN-yarim.png, sNN-agiz.png
Çıktı (2x): medya/sutyen/gorsel/2x/sNN_k0..k3.png  (k0 ana, k1 göz kapalı, k2 ağız yarım, k3 ağız açık)"""
import sys
from PIL import Image, ImageDraw, ImageFilter
s = sys.argv[1]; G = 'medya/sutyen/gorsel/gemini/'; O = 'medya/sutyen/gorsel/2x/'
goz = [float(v) for v in sys.argv[2].split(',')]; agz = [float(v) for v in sys.argv[3].split(',')]
base = Image.open(f'{G}s{s}.png').convert('RGB')
def maske(e):
    m = Image.new('L', base.size, 0); x, y, rx, ry = e
    ImageDraw.Draw(m).ellipse((x - rx, y - ry, x + rx, y + ry), fill=255)
    return m.filter(ImageFilter.GaussianBlur(6))
def kaydet(im, k):
    im.resize((im.width * 2, im.height * 2), Image.LANCZOS).save(f'{O}s{s}_k{k}.png')
kaydet(base, 0)
for k, (ad, e) in enumerate([('goz', goz), ('yarim', agz), ('agiz', agz)], 1):
    v = Image.open(f'{G}s{s}-{ad}.png').convert('RGB').resize(base.size)
    kaydet(Image.composite(v, base, maske(e)), k)
print('tamam')
