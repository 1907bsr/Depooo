"""gemini-tarifleri.md'deki tüm sahneleri sırayla üretir (var olanları atlar).
Kullanım: python3 scripts/gorsel/toplu_uret.py konular/sutyen/gemini-tarifleri.md medya/sutyen/gorsel/gemini mary_ref.png"""
import re, sys, subprocess, pathlib, time
md, out, ref = sys.argv[1], pathlib.Path(sys.argv[2]), sys.argv[3]
STYLE = ("Editorial comic-book illustration, graphic novel style, bold ink outlines, 2-3 tone cel shading, "
         "warm earthy palette (sand, ochre, cream, terracotta) with deep petrol-teal accents, soft paper texture.")
txt = open(md).read()
for m in re.finditer(r'### (.*?)\n```\n(.*?)```', txt, re.S):
    head, body = m.group(1), m.group(2).strip()
    if '~~' in head: continue
    n = re.search(r'Sahne (\d+)', head)
    if not n: continue
    dosya = out / f's{int(n.group(1)):02d}.png'
    if dosya.exists() or list(out.parent.glob(f's{int(n.group(1)):02d}-*gemini*')): continue
    body = body.replace('Same comic-book style, bold ink outlines, cel shading, warm earthy palette with petrol-teal accents.', STYLE)
    refs = []
    if re.search(r'same (young )?woman', body, re.I):
        refs = [ref]
        body = ('Use the woman in the attached reference image: keep the exact same face, hair and hair ribbon, '
                'and the same art style. ') + body
    for deneme in range(3):
        r = subprocess.run([sys.executable, 'scripts/gorsel/gemini_uret.py', str(dosya), body, *refs], capture_output=True, text=True)
        print(head, '→', (r.stdout + r.stderr).strip()[:200], flush=True)
        if dosya.exists(): break
        time.sleep(20)
