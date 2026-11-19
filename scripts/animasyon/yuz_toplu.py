"""Sahnelerin yüz varyantlarını (göz kapalı / ağız yarım / ağız açık) Gemini ile üretir ve
sadece değişen bölgeleri ana görsele bindirerek kareler oluşturur. Kayma olmaz.
Kullanım: python3 scripts/animasyon/yuz_toplu.py 05 06 ...  (var olanları atlar)"""
import sys, subprocess, os
import numpy as np
from PIL import Image, ImageFilter

def genis(a):  # 8 komşulu genişletme
    p = np.pad(a, 1); return np.max([p[i:i + a.shape[0], j:j + a.shape[1]] for i in range(3) for j in range(3)], axis=0)
def etiketle(a):  # bağlı bileşenler (küçük ızgara için BFS)
    lab = np.zeros(a.shape, int); n = 0
    for y, x in zip(*np.where(a)):
        if lab[y, x]: continue
        n += 1; st = [(y, x)]; lab[y, x] = n
        while st:
            cy, cx = st.pop()
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = cy + dy, cx + dx
                    if 0 <= yy < a.shape[0] and 0 <= xx < a.shape[1] and a[yy, xx] and not lab[yy, xx]:
                        lab[yy, xx] = n; st.append((yy, xx))
    return lab, n
G = 'medya/sutyen/gorsel/gemini/'; O = 'medya/sutyen/gorsel/2x/'
KIM = {  # sahnedeki yüzler (Gemini'ye ne değişeceğini söylemek için)
 '05': 'the young woman', '06': 'the maid', '12': 'both Greek women', '13': 'the Roman lady',
 '17': 'both tailors', '18': 'the seated lady in the red dress', '19': 'the lady eating cake',
 '24': 'the female archaeologist and the bearded man', '27': 'the medieval woman and the modern man',
 '29': 'the seamstress with glasses', '30': 'both women', '32': 'the young woman and the maid',
 '33': 'the twirling young woman', '34': 'the young woman in the center', '37': 'the young woman on the left and the man on the right',
 '37b': 'the crying young woman', '38': 'the laughing woman in the cloche hat', '41': 'the mustached man in the drawing',
 '42': 'the women and the police officer', '09': None, '02': 'the woman reflected in the mirror',
}
B = ("Edit the attached image. Keep EVERYTHING pixel-identical: same people, same head positions and sizes, hair, clothes, "
     "hands, objects, background, framing, lighting and art style. Change ONLY ")
VAR = {'goz': "the eyes of {k}: eyes fully closed in a natural blink, eyelids drawn with the same ink line. Mouths unchanged. No text.",
       'yarim': "the mouth of {k}: slightly open as if mid-word, a small relaxed opening. Eyes unchanged. No text.",
       'agiz': "the mouth of {k}: clearly open as if speaking the sound 'aa', matching the current emotion. Eyes unchanged. No text."}
def uret(s):
    procs = []
    for v, tarif in VAR.items():
        f = f'{G}s{s}-{v}.png'
        if not os.path.exists(f):
            procs.append(subprocess.Popen([sys.executable, 'scripts/gorsel/gemini_uret.py', f, B + tarif.format(k=KIM[s]), kaynak(s)]))
    for p in procs: p.wait()
def kaynak(s): return f'{G}s37b-v5.png' if s == '37b' else f'{G}s{s}.png'
def hizala(base, v):  # Gemini'nin küçük kaydırma/ölçek farkını bul ve düzelt
    w, h = base.size; A = np.asarray(base.convert('L').resize((w // 4, h // 4)), float); L = v.convert('L')
    def dene(sc, dx, dy, kucuk=True):
        t = L.transform(L.size, Image.AFFINE, (1 / sc, 0, -dx / sc, 0, 1 / sc, -dy / sc), resample=Image.BILINEAR)
        return (np.abs(np.asarray(t.resize((w // 4, h // 4)), float) - A) > 38).mean()
    en = (dene(1, 0, 0), 1, 0, 0)
    for sc in np.arange(.96, 1.041, .005):
        for dx in range(-40, 41, 8):
            for dy in range(-40, 41, 8):
                d = dene(sc, dx, dy)
                if d < en[0]: en = (d, sc, dx, dy)
    _, sc0, dx0, dy0 = en
    for sc in np.arange(sc0 - .004, sc0 + .0041, .002):
        for dx in range(dx0 - 6, dx0 + 7, 2):
            for dy in range(dy0 - 6, dy0 + 7, 2):
                d = dene(sc, dx, dy)
                if d < en[0]: en = (d, sc, dx, dy)
    _, sc, dx, dy = en
    return v.transform(v.size, Image.AFFINE, (1 / sc, 0, -dx / sc, 0, 1 / sc, -dy / sc), resample=Image.BICUBIC), en
def maske(base, v):
    bl = lambda im: np.asarray(im.convert('L').filter(ImageFilter.GaussianBlur(2.5)), float)
    d = np.abs(bl(v) - bl(base)) > 45   # bulanıklaştırınca 1 piksellik çizgi kaymaları yok sayılır
    H, W = d.shape; b = 16
    blk = d[:H // b * b, :W // b * b].reshape(H // b, b, W // b, b).mean((1, 3)) > .18
    lab, n = etiketle(genis(blk))
    keep = np.zeros_like(blk)
    for i in range(1, n + 1):
        z = (blk & (lab == i)).sum()
        if 2 <= z <= 120: keep |= lab == i   # küçük gürültü ve dev bölgeler hariç
    keep = genis(keep)
    m = Image.fromarray((np.kron(keep, np.ones((b, b))) * 255).astype('uint8')).resize(base.size)
    return m.filter(ImageFilter.GaussianBlur(7)), keep.sum()
for s in sys.argv[1:]:
    uret(s)
    base = Image.open(kaynak(s)).convert('RGB')
    base.resize((base.width * 2, base.height * 2), Image.LANCZOS).save(f'{O}s{s}_k0.png')
    rap = []
    for k, v in enumerate(['goz', 'yarim', 'agiz'], 1):
        f = f'{G}s{s}-{v}.png'
        if not os.path.exists(f): rap.append(f'{v}:YOK'); im = base
        else:
            hf = f.replace('.png', '-h.png')
            if os.path.exists(hf): var = Image.open(hf).convert('RGB'); en = (0,)
            else:
                var = Image.open(f).convert('RGB').resize(base.size); var, en = hizala(base, var); var.save(hf)
            m, z = maske(base, var); rap.append(f'{v}:{z}(fark {en[0]:.3f})')
            im = Image.composite(var, base, m)
        im.resize((im.width * 2, im.height * 2), Image.LANCZOS).save(f'{O}s{s}_k{k}.png')
    print(s, ' '.join(rap), flush=True)
