"""Kötü yüz varyantlarını (Gemini bütün resmi yeniden çizdiyse ya da hiç değiştirmediyse) yeniden üretir.
En iyi denemeyi tutar. Kullanım: python3 scripts/animasyon/yuz_tekrar.py 12 13 ..."""
import sys, subprocess, os, shutil
import numpy as np
from PIL import Image
sys.argv, ids = sys.argv[:1], sys.argv[1:]
import importlib.util
spec = importlib.util.spec_from_file_location('yt', 'scripts/animasyon/yuz_toplu.py')
G = 'medya/sutyen/gorsel/gemini/'
def kaynak(s): return f'{G}s37b-v5.png' if s == '37b' else f'{G}s{s}.png'
def fark(a, f):
    b = Image.open(f).convert('L').resize(a.size)
    return (np.abs(np.asarray(b, float) - np.asarray(a, float)) > 38).mean()
src = open('scripts/animasyon/yuz_toplu.py').read()
KIM = eval(src.split('KIM = ')[1].split('\n}')[0] + '\n}')
B = eval(src.split('B = ')[1].split('\nVAR')[0])
VAR = eval(src.split('VAR = ')[1].split('\ndef uret')[0])
B = B.replace('Keep EVERYTHING pixel-identical', 'This is a tiny local edit. Do NOT redraw, re-compose, re-crop or restyle the picture. Keep EVERYTHING pixel-identical')
for s in ids:
    a = Image.open(kaynak(s)).convert('L')
    for v, tarif in VAR.items():
        f = f'{G}s{s}-{v}.png'; d = fark(a, f) if os.path.exists(f) else 1
        iyi = lambda x: .003 < x < .06
        dene = 0
        while not iyi(d) and dene < 3:
            dene += 1; tmp = f'{G}s{s}-{v}-deneme.png'
            subprocess.run([sys.executable, 'scripts/gorsel/gemini_uret.py', tmp, B + tarif.format(k=KIM[s]), kaynak(s)], capture_output=True)
            if os.path.exists(tmp):
                dt = fark(a, tmp)
                if iyi(dt) or abs(dt - .03) < abs(d - .03): shutil.move(tmp, f); d = dt
        print(s, v, round(d, 3), 'tamam' if iyi(d) else 'OLMADI', flush=True)
