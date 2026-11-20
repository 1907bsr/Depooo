"""Kontrol listesi sayfaları: her satırda sahne no, süre, videodan alınmış görsel ve ekranda o sırada okunacak cümleler.
Kullanım: python3 scripts/motor2/kurgu_listesi.py video.mp4 cikis_klasoru"""
import json, subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont
ROOT = '/home/user/Depooo/'; video = sys.argv[1]; out = sys.argv[2]; os.makedirs(out, exist_ok=True)
L = json.load(open(ROOT + 'scripts/vektor/metin_hibrit.json', encoding='utf-8'))
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f_no, f_t, f_g, f_m = ImageFont.truetype(FB, 40), ImageFont.truetype(F, 24), ImageFont.truetype(F, 21), ImageFont.truetype(F, 27)
W, TW, TH = 1500, 352, 198; PADX = 20; TXT_X = 110 + TW + 25; TXT_W = W - TXT_X - 40
def sar(d, metin):
    satirlar, cur = [], ''
    for kel in metin.split():
        deneme = (cur + ' ' + kel).strip()
        if d.textlength(deneme, font=f_m) <= TXT_W: cur = deneme
        else: satirlar.append(cur); cur = kel
    if cur: satirlar.append(cur)
    return satirlar
tmp = out + '/_k.png'; satirlar = []
dd = ImageDraw.Draw(Image.new('RGB', (10, 10)))
for r in L:
    t = r['bas'] + r['dur'] * .4
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', f'{t:.2f}', '-i', video, '-frames:v', '1', '-vf', f'scale={TW}:{TH}', tmp], check=True)
    th = Image.open(tmp).convert('RGB').copy(); sat = sar(dd, r['metin'])
    h = max(TH + 40, len(sat) * 37 + 70); satirlar.append((r, th, sat, h))
sayfalar, cur, hh = [], [], 0
for s in satirlar:
    if hh + s[3] > 2300 and cur: sayfalar.append(cur); cur, hh = [], 0
    cur.append(s); hh += s[3]
if cur: sayfalar.append(cur)
for pi, sf in enumerate(sayfalar, 1):
    im = Image.new('RGB', (W, sum(s[3] for s in sf) + 10), 'white'); d = ImageDraw.Draw(im); y = 5
    for k, (r, th, sat, h) in enumerate(sf):
        d.rectangle((0, y, W, y + h), fill=(246, 241, 232) if k % 2 == 0 else (255, 255, 255))
        d.text((PADX, y + 10), f"{r['no']}", font=f_no, fill=(120, 60, 30))
        m, sn = int(r['bas'] // 60), int(r['bas'] % 60)
        d.text((PADX, y + 62), f"{m}:{sn:02d}", font=f_t, fill=(60, 60, 60)); d.text((PADX, y + 92), f"{r['dur']:.0f} sn", font=f_g, fill=(110, 110, 110))
        im.paste(th, (110, y + 12))
        tx = TXT_X
        d.text((tx, y + 8), r['gorsel'], font=f_g, fill=(130, 90, 60))
        for i, l in enumerate(sat): d.text((tx, y + 36 + i * 37), l, font=f_m, fill=(20, 20, 20))
        y += h
    im.save(f'{out}/kontrol-listesi-{pi}.jpg', quality=86)
os.remove(tmp); print(len(sayfalar), 'sayfa,', len(L), 'satır')
