"""Tüm sahneler için kelime zamanları. Sahne süreleri/başlangıçları kur_tam.py'deki modelden (v9 ile aynı); sahne İÇİNDE kelimelere süre
hece sayısına göre dağıtılır (uzun kelime daha uzun sürer; parantez öncesi 'okunmayan' rakamlar ~0). Ses kaydı gelince gerçek zamanlarla değiştirilir.
Çıktı: zaman_tum.json + zaman_tum.js (const ZAMAN, SAHNE_LISTE)"""
import json, re
src = open('/home/user/Depooo/scripts/motor2/kur_tam.py', encoding='utf-8').read().split('# ---------------- 2) SAHNE AYARLARI')[0]
ns = {}; exec(src, ns)
tokens, widx, SAHNE, basl = ns['tokens'], ns['widx'], ns['SAHNE'], ns['basl']
P1, P2, GUL = ns['P1'], ns['P2'], ns['GULME']
M = {m['sid']: m for m in json.load(open('/home/user/Depooo/scripts/motor2/metin_tam.json'))}
ONES = {1: 2, 2: 2, 3: 1, 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2}   # bir iki üç dört beş altı yedi sekiz dokuz (hece)
TENS = {1: 1, 2: 2, 3: 2, 4: 1, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2}   # on yirmi otuz kırk elli altmış yetmiş seksen doksan
def say(n):
    if n == 0: return 1
    s = 0
    if n >= 1000:
        th = n // 1000; s += (1 if th == 1 else (say(th) + 0)) + 1 if th > 1 else 1; n %= 1000
    if n >= 100:
        h = n // 100; s += (1 if h == 1 else ONES[h]) + 1; n %= 100
    if n >= 10: s += TENS[n // 10]; n %= 10
    if n: s += ONES[n]
    return s
def vow(s): return len(re.findall('[aeıioöuüâîû]', s))
def syl(n):
    m = re.match(r'(\d+)(\D*)$', n)
    if m: return say(int(m.group(1))) + vow(m.group(2))
    return max(1, vow(n))
out = {}; liste = []
for i, (sid, mk, mn) in enumerate(SAHNE):
    a = widx[basl[i]]; b = widx[basl[i + 1]] if i + 1 < len(SAHNE) else len(tokens)
    seg = tokens[a:b]; D = M[sid]['dur']; bas = M[sid]['bas']
    pause = sum({'p1': P1, 'p2': P2, 'l': GUL}.get(t[0], 0) for t in seg)
    # okunmayan rakam: ardından '(' ile başlayan parantez geliyorsa
    w = []
    for k, t in enumerate(seg):
        if t[0] != 'w': continue
        nxt = next((u for u in seg[k + 1:] if u[0] == 'w'), None)
        silent = t[1].isdigit() and nxt is not None and nxt[2].startswith('(')
        w.append((k, t, .15 if silent else syl(t[1])))
    tot = sum(x[2] for x in w)
    rate = max(.05, (D - pause - .1)) / tot
    cum = 0.0; lst = []; widx_ = {x[0]: x for x in w}
    for k, t in enumerate(seg):
        if t[0] == 'w': sy = widx_[k][2]; lst.append([t[1], round(bas + cum, 2), round(sy * rate, 2)]); cum += sy * rate
        elif t[0] == 'p1': cum += P1
        elif t[0] == 'p2': cum += P2
        elif t[0] == 'l': cum += GUL
    out[sid] = {'bas': bas, 'dur': D, 'w': lst}
    liste.append({'sid': sid, 'no': M[sid]['no'], 'bas': bas, 'dur': D, 'metin': M[sid]['metin']})
json.dump({'ZAMAN': out, 'SAHNE_LISTE': liste}, open('zaman_tum.json', 'w'), ensure_ascii=False)
open('zaman_tum.js', 'w', encoding='utf-8').write('const ZAMAN = ' + json.dumps(out, ensure_ascii=False) + ';\nconst SAHNE_LISTE = ' + json.dumps(liste, ensure_ascii=False) + ';\n')
print(len(out), 'sahne; toplam', round(sum(v['dur'] for v in out.values()), 1), 'sn')
for sid in ['s14', 's35', 's36', 's43']: print(sid, ' '.join(f"{w}@{t}" for w, t, d in out[sid]['w'])[:300])
