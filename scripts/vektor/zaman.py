"""Açılış sahneleri için kelime zamanları. Sahne süreleri kur_tam.py'deki modelden (v9 ile aynı); sahne İÇİNDE kelimelere süre,
hece sayısına göre dağıtılır (uzun kelime daha uzun sürer). Ses kaydı gelince gerçek zamanlarla değiştirilir.
Çıktı: zaman_acilis.json + zaman_acilis.js"""
import json, re
src = open('/home/user/Depooo/scripts/motor2/kur_tam.py', encoding='utf-8').read().split('# ---------------- 2) SAHNE AYARLARI')[0]
ns = {}; exec(src, ns)
tokens, widx, SAHNE, basl = ns['tokens'], ns['widx'], ns['SAHNE'], ns['basl']
P1, P2, GUL = ns['P1'], ns['P2'], ns['GULME']
M = {m['sid']: m for m in json.load(open('/home/user/Depooo/scripts/motor2/metin_tam.json'))}
SAYI = {'1913': 6, '20': 2, '3': 1, '2': 2, '500': 3}
def syl(w): return SAYI.get(w) or max(1, len(re.findall('[aeıioöuüâîû]', w)))
out = {}
for i, (sid, mk, mn) in enumerate(SAHNE):
    if sid not in ('s01', 's02', 's03', 's03b', 's04', 's02c', 's05', 's06'): continue
    a = widx[basl[i]]; b = widx[basl[i + 1]] if i + 1 < len(SAHNE) else len(tokens)
    seg = tokens[a:b]; D = M[sid]['dur']; bas = M[sid]['bas']
    pause = sum({'p1': P1, 'p2': P2, 'l': GUL}.get(t[0], 0) for t in seg)
    ws = [t for t in seg if t[0] == 'w']; tot = sum(syl(t[1]) for t in ws)
    rate = max(.05, (D - pause - .1)) / tot        # sn/hece
    cum = 0.0; lst = []
    for t in seg:
        if t[0] == 'w': lst.append([t[1], round(bas + cum, 2), round(syl(t[1]) * rate, 2)]); cum += syl(t[1]) * rate
        elif t[0] == 'p1': cum += P1
        elif t[0] == 'p2': cum += P2
        elif t[0] == 'l': cum += GUL
    out[sid] = {'bas': bas, 'dur': D, 'w': lst}
json.dump(out, open('zaman_acilis.json', 'w'), ensure_ascii=False)
open('zaman_acilis.js', 'w', encoding='utf-8').write('const ZAMAN = ' + json.dumps(out, ensure_ascii=False) + ';\n')
for sid, v in out.items(): print(sid, v['bas'], v['dur'], ' '.join(f"{w}@{t}" for w, t, d in v['w']))
