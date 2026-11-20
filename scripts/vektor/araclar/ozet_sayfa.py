"""Kullanım: python3 scripts/vektor/araclar/ozet_sayfa.py <kare_klasörü> <oran(ör. 92)> <çıktı_önek> [sütun=3] [satır=4]
ozet_kareler.js çıktılarını etiketli temas sayfalarına dizer (sütun x satır küçük resim)."""
import sys, glob, os
from PIL import Image, ImageDraw
d, oran, pre = sys.argv[1], sys.argv[2], sys.argv[3]
C = int(sys.argv[4]) if len(sys.argv) > 4 else 3; R = int(sys.argv[5]) if len(sys.argv) > 5 else 4
fs = sorted(glob.glob(f'{d}/*_{oran}.png')); W, H = 640, 360
for s in range(0, len(fs), C * R):
    im = Image.new('RGB', (W * C, H * R), (255, 255, 255)); dr = ImageDraw.Draw(im)
    for k, f in enumerate(fs[s:s + C * R]):
        t = Image.open(f).convert('RGB').resize((W, H)); x, y = (k % C) * W, (k // C) * H; im.paste(t, (x, y))
        dr.rectangle((x, y, x + 150, y + 18), fill=(0, 0, 0)); dr.text((x + 4, y + 3), os.path.basename(f)[:-4], fill=(255, 255, 0))
    im.save(f'{pre}{s // (C * R) + 1}.jpg', quality=86)
print(len(fs), 'kare')
