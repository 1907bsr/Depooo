"""Sütyen videosu – TAM kurgu planı (motor2).
Okuma metninden her sahnenin süresini hesaplar (konuşma hızı + duraklamalar), sahne ayarlarını (kesmeler, A/B geçişleri,
yerel hareket, el yazısı) timeline_tam.json'a, birleştirme planını plan_tam.json'a yazar.
Kullanım: python3 scripts/motor2/kur_tam.py"""
import json, re, math
from PIL import Image

ROOT = '/home/user/Depooo/'
Y = 'medya/sutyen/gorsel/yeni-stil/'
MET = 'medya/sutyen/gorsel/arsiv/met/'
KONUSMA_HIZI = 2.6          # kelime/sn (~156 kelime/dk; duraklamalar ayrıca eklenir) → toplam ~8,8 dk
P1, P2, GULME = .16, .45, .6  # "/" , "//" , [güler]

# ---------------- 1) METİN → SÜRELER ----------------
def norm(w): return re.sub(r'[^\w]', '', w.lower())
ham = open(ROOT + 'konular/sutyen/okuma-metni.md', encoding='utf-8').read().split('\n---\n', 1)[1]
tokens = []   # her öğe: ('w', norm) | ('p1',) | ('p2',) | ('l',)
for satir in ham.split('\n'):
    if satir.startswith('#'): continue
    satir = satir.replace('**', '')
    for t in satir.split():
        if t == '/': tokens.append(('p1',)); continue
        if t == '//': tokens.append(('p2',)); continue
        if t == '[güler]': tokens.append(('l',)); continue
        n = norm(t.replace('…', ''))
        if n: tokens.append(('w', n, t))
    if not tokens or tokens[-1][0] != 'p2': tokens.append(('p2',))     # paragraf sonu (satır zaten '//' ile bitmişse çift sayma)
widx = [i for i, t in enumerate(tokens) if t[0] == 'w']
wnorm = [tokens[i][1] for i in widx]

def bul(marker, bas):
    m = [norm(w) for w in marker.split()]
    for k in range(bas, len(wnorm) - len(m) + 1):
        if wnorm[k:k + len(m)] == m: return k
    raise SystemExit('marker bulunamadı: ' + marker)

# (id, marker, min_sure)
SAHNE = [
 ('s01', 'Yıl 1913', 2), ('s02', 'Sen 20 yaşında', 2),
 ('s03', 'Tek bir pürüz', 2), ('s03b', 'Eğilemiyorsun', 2), ('s04', 'Üstelik çubuklar', 2),
 ('s02c', 'Aynaya bakıyorsun', 2), ('s05', 'Ben bununla', 2),
 ('s06', 'Hizmetçini çağırıyorsun', 2), ('s08', 'Yalnız bir dakika', 2), ('s09', 'Bir de bütün dünyayı', 2),
 ('s10', "Bugün İcatbuldum'da", 3.4), ('s11', 'Şimdi düşün', 2),
 ('s12', "Antik Yunan'da kadınlar", 2), ('s13', 'Romalılar da benzer', 2),
 ('s14', "Hatta İtalya'da", 2), ('s15', 'Kimi top oynuyor', 2),
 ('s17', 'Peki sonra ne oldu', 2), ('s18', 'Ve korse sahneye çıktı', 2), ('s19', 'Velhâsıl kelâm', 2), ('s20', 'Ta ki', 3.2),
 ('s21', '2008 yılına kadar', 2), ('s22', 'Şatoda tadilat var', 2), ('s23', 'Ama öyle sıradan', 2), ('s24', 'Yaklaşık 2.700', 2),
 ('s25', 'Çünkü ellerindeki', 2), ('s26', 'Karbon testi', 2.9), ('s27', 'Yani tarih kitapları', 2), ('s18b', 'Peki bu fikir neden', 2),
 ('s28', 'Yıl 1889', 2), ('s29', 'Biz ise', 2), ('s30', 'Alt kısım beli', 2), ('s29b', 'Yani Cadolle', 2), ('s30b', 'Birkaç yıl içinde', 2),
 ('s29d', "Üstelik Cadolle'un", 2), ('s02b', 'Ama patentli modern', 2), ('s31', 'Açılıştaki baloya', 2),
 ('s32', '2 mendil bir kurdele', 2), ('s33', 'Giyiyorsun', 2), ('s34', 'Anlatılana göre', 2), ('s35', '12 Şubat', 2),
 ('s37d', 'Bir korse şirketine', 2), ('s36', 'Fiyatı mı', 2), ('s37c', 'Yani senin cebine', 2), ('s37b', 'Bunu okuyunca', 2),
 ('s38', 'Ama üzülme', 2), ('n39', 'Şimdi biraz oyun', 4), ('s41a', 'Sütyeni Otto Titzling', 2), ('s09b', 'Tek bir sorun', 2),
 ('s41b', "1971'de", 2), ('s42a', "1968'de feministler", 2), ('s42c', 'Sonra bir gazete', 2),
 ('s43', 'Peki sütyeni kim buldu', 2), ('s43b', 'Yani sütyen bir icat', 2), ('s19c', 'Yüzyıllar boyunca', 2), ('s41c', 'Bu arada', 2),
 ('s44a', 'Ve o kitap yüzünden', 2), ('s44c', 'Ondan sonrakini', 2), ('s33b', 'Görüşmek üzere', 2),
]
basl = []; p = 0
for sid, mk, mn in SAHNE:
    k = bul(mk, p); basl.append(k); p = k + 1
SURE = {}
for i, (sid, mk, mn) in enumerate(SAHNE):
    a = widx[basl[i]]; b = widx[basl[i + 1]] if i + 1 < len(SAHNE) else len(tokens)
    seg = tokens[a:b]
    w = sum(1 for t in seg if t[0] == 'w'); p1 = sum(1 for t in seg if t[0] == 'p1'); p2 = sum(1 for t in seg if t[0] == 'p2'); l = sum(1 for t in seg if t[0] == 'l')
    SURE[sid] = max(mn, round(w / KONUSMA_HIZI + p1 * P1 + p2 * P2 + l * GULME + .2, 2))
TOPLAM = sum(SURE.values())
WT, METIN = {}, {}
for i, (sid, mk, mn) in enumerate(SAHNE):
    a = widx[basl[i]]; b = widx[basl[i + 1]] if i + 1 < len(SAHNE) else len(tokens)
    cum = 0.0; lst = []; yaz = []
    for t in tokens[a:b]:
        if t[0] == 'w': lst.append((t[1], cum)); yaz.append(t[2]); cum += 1 / KONUSMA_HIZI
        elif t[0] == 'p1': cum += P1
        elif t[0] == 'p2': cum += P2
        elif t[0] == 'l': cum += GULME; yaz.append('[güler]')
    WT[sid] = lst; METIN[sid] = ' '.join(yaz)
def kw(sid, kelime, n=1):
    """Sahnede bu kelimenin söylenmeye başladığı an (sn; konuşma hızı tahminiyle)."""
    k = norm(kelime); c = 0
    for w, t in WT[sid]:
        if w == k:
            c += 1
            if c == n: return round(t, 2)
    raise SystemExit(f'{sid}: kelime yok: {kelime}')

# ---------------- 2) SAHNE AYARLARI ----------------
def boyut(yol): return Image.open(ROOT + yol).size

ODAK = {   # sahnede yüzün/öznenin olduğu noktalar (normalize)
 's01': [(.5, .5), (.62, .6)], 's02': [(.5, .45), (.4, .33)], 's03': [(.5, .3), (.5, .62)], 's04': [(.5, .4), (.5, .45)],
 's05': [(.46, .4)], 's06': [(.5, .45), (.6, .4)], 's07': [(.55, .45)], 's08': [(.55, .5), (.5, .42)], 's09': [(.5, .5), (.55, .4)],
 's12': [(.5, .45), (.36, .4), (.68, .38)], 's13': [(.45, .5), (.37, .4)], 's14': [(.45, .5), (.58, .5)],
 's15': [(.5, .5), (.38, .45), (.65, .45)], 's16': [(.5, .5), (.4, .5)], 's17': [(.5, .5), (.5, .45)], 's18': [(.5, .5), (.3, .4), (.75, .4)],
 's19': [(.5, .45), (.5, .5)], 's21': [(.62, .5), (.7, .45)], 's22': [(.5, .5), (.5, .45)], 's23': [(.5, .5), (.55, .55)],
 's24': [(.5, .5), (.53, .45)], 's25': [(.5, .5)], 's27': [(.5, .5), (.35, .4), (.65, .4)], 's28': [(.5, .5), (.45, .4)],
 's29': [(.5, .5), (.4, .4)], 's30': [(.5, .5), (.45, .45)], 's31': [(.55, .45)], 's32': [(.5, .55), (.6, .5)],
 's33': [(.5, .5), (.47, .44)], 's34': [(.5, .5), (.5, .4)], 's35': [(.5, .2), (.5, .45), (.5, .72)], 's37': [(.5, .5), (.2, .45), (.75, .45)],
 's37b': [(.5, .45)], 's38': [(.5, .55), (.43, .4)], 's41': [(.5, .5), (.5, .4)], 's42': [(.5, .5), (.74, .4), (.3, .5)], 's44': [(.5, .5), (.5, .65)],
}
# (görsel A, görsel B, maske, [(oran, 'A'|'B')...], odak anahtarı)
SPEC = {
 's01': (Y + 's01.png', None, None, [], 's01'), 's02': (Y + 's02.png', None, None, [], 's02'),
 's03': (MET + 'met-157937.jpg', None, None, [], 's03'),
 's04': (Y + 's04A.png', Y + 's04B.png', Y + 'maske-s04.png', [(0, 'B'), (('k', 'dışarı'), 'A')], 's04'),
 's04b': (Y + 's04B.png', None, None, [], 's04'),
 's05': (Y + 's05.png', Y + 's05b.png', Y + 'maske-s05.png', [(('k', 'dans'), 'B')], 's05'),
 's06': (Y + 's06-busra-gemini.png', None, None, [], 's06'), 's07': (Y + 's06-busra-gemini.png', None, None, [], 's07'),
 's08': (Y + 's08.png', None, None, [], 's08'), 's09': (Y + 's09.png', None, None, [], 's09'), 's09b': (Y + 's09.png', None, None, [], 's09'),
 's12': (Y + 's12A.png', Y + 's12B.png', Y + 'maske-s12.png', [(('k', 'öksürük'), 'B')], 's12'),
 's13': (Y + 's13A.png', Y + 's13B.png', Y + 'maske-s13.png', [(('k', 'Pazarlamanın'), 'B')], 's13'),
 's14': ('medya/sutyen/gorsel/gemini/s14.png', None, None, [], 's14'), 's16': ('medya/sutyen/gorsel/gemini/s14.png', None, None, [], 's16'),
 's15': (Y + 's15A.png', Y + 's15B.png', Y + 'maske-s15.png', [(('k', 'ağırlık'), 'B')], 's15'),
 's17': (Y + 's17.png', None, None, [], 's17'), 's18': (Y + 's18.png', None, None, [], 's18'), 's18b': (Y + 's18.png', None, None, [], 's18'),
 's19': (Y + 's19.png', None, None, [], 's19'), 's21': (Y + 's21.png', None, None, [], 's21'),
 's22': (Y + 's22.png', Y + 's22B.png', Y + 'maske-s22.png', [(('k', 'çöp'), 'B')], 's22'),
 's23': (Y + 's23.png', None, None, [], 's23'), 's24': (Y + 's24.png', None, None, [], 's24'), 's25': (Y + 's25.png', None, None, [], 's25'),
 's27': (Y + 's27.png', None, None, [], 's27'), 's28': (MET + 'met-271707.jpg', None, None, [], 's28'),
 's29': (Y + 's29.png', Y + 's29B.png', Y + 'maske-s29.png', [(('k', 'Ortadan'), 'B')], 's29'), 's29b': (Y + 's29.png', Y + 's29B.png', Y + 'maske-s29.png', [(0, 'B')], 's29'),
 's29c': (Y + 's29.png', None, None, [], 's29'), 's28b': (MET + 'met-271707.jpg', None, None, [], 's28'), 's02b': (Y + 's02.png', None, None, [], 's02'), 's30': (Y + 's30.png', None, None, [], 's30'), 's30b': (Y + 's30.png', None, None, [], 's30'),
 's31': (Y + 's31.png', None, None, [], 's31'), 's31b': (Y + 's31.png', None, None, [], 's31'), 's32': (Y + 's32.png', None, None, [], 's32'),
 's33': (Y + 's33.png', None, None, [], 's33'), 's33b': (Y + 's33.png', None, None, [], 's33'),
 's34': (Y + 's34.png', Y + 's34B.png', Y + 'maske-s34.png', [(('k', 'jeton'), 'B')], 's34'),
 's35': ('medya/sutyen/gorsel/arsiv/s35-patent-cizim-1.png', None, None, [], 's35'),
 's36': (Y + 'kagit.png', None, None, [], None), 'n39': (Y + 'tahta.png', None, None, [], None),
 's37a': (Y + 's37.png', None, None, [], 's37'), 's37c': (Y + 's37.png', None, None, [], 's37'), 's37b': (Y + 's37b.png', None, None, [], 's37b'),
 's38': (Y + 's38.png', None, None, [], 's38'),
 's41a': (Y + 's41.png', None, None, [], 's41'), 's41b': (Y + 's41.png', None, None, [], 's41'), 's41c': (Y + 's41.png', None, None, [], 's41'),
 's42a': (Y + 's42.png', None, None, [], 's42'), 's42b': (Y + 's42.png', None, None, [], 's42'), 's42c': (Y + 'kagit.png', None, None, [], None),
 's44a': (Y + 's44.png', None, None, [], 's44'), 's44b': (Y + 's44.png', None, None, [], 's44'),
}
SPEC.update({
 's03b': (MET + 'met-158100.jpg', None, None, [], 's03'), 's37d': (MET + 'met-173657.jpg', None, None, [], 's03'),
 's02c': (Y + 's02.png', None, None, [], 's02'),
 's15': (Y + 's15A.png', Y + 's15B.png', Y + 'maske-s15.png', [(('k', 'ağırlık'), 'B'), (('k', 'Herkes'), 'A')], 's15'),
 's29b': (Y + 's29B.png', None, None, [], 's29'), 's29d': (Y + 's29B.png', None, None, [], 's29'),
 's19c': (Y + 's19.png', None, None, [], 's19'), 's44c': (Y + 'tahta.png', None, None, [], None),
 's33b': (Y + 's33.png', None, None, [], 's33'),
})
KLIP = {   # kodla yapılmış, beğenilen zaman çizelgesi kartları (sessiz kopyalar). bas/bit: kullanılacak aralık, max: en fazla yavaşlatma
 's10': dict(yol='medya/sutyen/motor2/eski/s10-sessiz.mp4', bas=0, bit=3.4, max=1.0),
 's11': dict(yol='medya/sutyen/motor2/eski/s11-sessiz.mp4', bas=0, bit=5.0, max=2.4),
 's20': dict(yol='medya/sutyen/motor2/eski/s20-sessiz.mp4', bas=0, bit=3.2, max=1.0),
 's26': dict(yol='medya/sutyen/motor2/eski/s26-sessiz.mp4', bas=0, bit=2.65, max=1.6, yazi=dict(metin='500 YIL!', renk='0xE06A50', boy=120, y=.14, son=1.3, tip='alegreya')),
 's43': dict(yol='medya/sutyen/motor2/kart43/s43.mp4', bas=0, bit=SURE['s43'], max=1.0,
             yazilar=[dict(metin='Peki sütyeni kim buldu?', t0=.3, t1=round(kw('s43', 'Antik') - .1, 2), boy=104, y=.10, rgb=(42, 29, 22, 255), kontur=None),
                      dict(metin='Tek bir kişi değil.', t0=round(kw('s43', 'Tek') - .1, 2), t1=round(kw('s43', 'Antik') - .1, 2), boy=96, y=.28, rgb=(176, 70, 48, 255), kontur=None)]),
 's43b': dict(yol='medya/sutyen/motor2/kart43/s43b.mp4', bas=0, bit=SURE['s43b'], max=1.0,
              yazi=dict(metin='bir İSYAN.', renk='0xE06A50', boy=120, y=.10, son=round(max(.4, kw('s43b', 'isyan') - .1) / SURE['s43b'], 3), oran=True)),
}
# yerel hareket (normalize; kaynak 1344 px'e göre piksel genlikleri)
YEREL = {
 's33': dict(yama=[dict(x=.532, y=.332, rx=.0632, ry=.0911, bulan=22, dy=1.6, periyot=4.5),
                   dict(x=.532, y=.163, rx=.0461, ry=.1016, bulan=20, aci=.7, px=.532, py=.2474, periyot=5.5, faz=1.0)],
             serit=[dict(x=.2567, y=.078, w=.0707, h=.625, genlik=3.0, frekans=.30, alt=True),
                    dict(x=.372, y=.052, w=.067, h=.573, genlik=2.5, frekans=.26, alt=True, faz=.05),
                    dict(x=.3385, y=.612, w=.372, h=.2995, genlik=2.2, frekans=.45, bulan=22)],
             isik=[dict(x=.35, y=.273, r=.1935, alfa=.07, periyot=6)], yuz=[.49, .08, .58, .22]),
 's31': dict(yama=[dict(x=.5, y=.65, rx=.11, ry=.13, bulan=22, dy=1.8, periyot=4.5),
                   dict(x=.52, y=.24, rx=.082, ry=.17, bulan=20, aci=.6, px=.52, py=.43, periyot=5.5, faz=1.0),
                   dict(x=.33, y=.48, rx=.06, ry=.117, bulan=16, aci=1.1, px=.35, py=.65, periyot=3.2)], yuz=[.40, .03, .65, .45]),
 's37b': dict(yama=[dict(x=.5, y=.78, rx=.164, ry=.17, bulan=24, dy=2.0, periyot=4.5),
                    dict(x=.5, y=.2, rx=.097, ry=.195, bulan=20, aci=.8, px=.5, py=.43, periyot=5.5, faz=1.0),
                    dict(x=.5, y=.70, rx=.097, ry=.104, bulan=16, dx=1.2, periyot=.7)], yuz=[.40, .02, .62, .50]),
 's02': dict(yama=[dict(x=.62, y=.55, rx=.082, ry=.17, bulan=20, dy=1.4, periyot=4.5)],
             isik=[dict(x=.2, y=.5, r=.15, alfa=.08, periyot=6)]),
}
# el yazısı: (metin, bas, bit, x, y, fs, ek) – bas/bit: sn (negatif = sondan) ya da ('f', oran)
TL, BL, BR = (.04, .05), (.04, .78), (.70, .92)
def Z(f): return ('f', f)
YAZI = {
 's01': [("New York, 1913", .4, 4.0, *TL, 90, {})],
 's03': [("Gerçek bir korse, 1885\n(Metropolitan Müzesi)", 1.0, 6.5, .05, .76, 90, {})],
 's07': [("ŞU AN TARİH YAZILIYOR", ('k', 'tarih'), -.2, .05, .10, 130, {'rot': -3})],
 's08': [("Avusturya, Doğu Tirol", .4, 4.5, *TL, 90, {}), ("temsilî görsel", .4, -.2, .74, .92, 46, {'rot': 0, 'sure': .5})],
 's12': [("APODESMOS\n(evet, gerçek kelime)", ('k', 'apodesmos'), Z(.86), .05, .70, 100, {})],
 's13': [("STROPHIUM", ('k', 'strophium'), Z(.68), .05, .76, 110, {})],
 's14': [("Villa Romana del Casale\nSicilya, İtalya", Z(.08), Z(.62), *TL, 84, {}), ("Bugün hâlâ yerinde!\n(UNESCO Dünya Mirası)", Z(.55), Z(.97), .05, .74, 84, {}),
         ("temsilî çizim", .4, -.2, .76, .92, 46, {'rot': 0, 'sure': .5})],
 's16': [("MAYO DEĞİL…\nSPOR KIYAFETİ!", ('k', 'mayo'), Z(.90), .06, .08, 130, {'rot': -3})],
 's17': [("1700'ler", Z(.05), Z(.38), *TL, 100, {})],
 's21': [("Lengberg Şatosu, 2008", Z(.05), Z(.5), *TL, 90, {}), ("temsilî görsel", .4, -.2, .74, .92, 46, {'rot': 0, 'sure': .5})],
 's24': [("yaklaşık 2.700 parça kumaş", Z(.03), Z(.55), .05, .80, 96, {})],
 's25': [("Lengberg, 15. yüzyıl\n(temsilî görsel)", Z(.30), Z(.92), .05, .76, 88, {})],
 's28': [("Paris, 1889 Dünya Fuarı", Z(.05), Z(.45), *TL, 96, {}), ("gerçek fotoğraf, 1890'lar", .4, -.2, .66, .92, 46, {'rot': 0, 'sure': .6})],
 's29': [("Herminie Cadolle", Z(.15), Z(.60), .05, .80, 100, {})],
 's28b': [("gerçek fotoğraf, 1890'lar", .4, -.2, .66, .92, 46, {'rot': 0, 'sure': .6})],
 's31': [("Mary Phelps Jacob\nNew York, 1913", Z(.10), Z(.85), .04, .28, 78, {})],
 's35': [("ABD Patenti No. 1.115.674", Z(.06), Z(.60), *TL, 100, {'renk': '#2A1D16', 'kontur': 'rgba(255,255,255,.97)', 'konturKalin': .38}),
         ("başvuru: 12 Şubat 1914\nonay: 3 Kasım 1914", Z(.45), Z(.96), .05, .76, 90, {'renk': '#2A1D16', 'kontur': 'rgba(255,255,255,.97)', 'konturKalin': .38})],
 's38': [("Paris, 1920'ler", Z(.05), Z(.42), *TL, 96, {})],
 's41b': [("EFSANE", ('k', 'ciddiye'), Z(.98), .08, .66, 200, {'rot': -4, 'renk': '#E8826A'})],
 's42a': [("Atlantic City, 1968", Z(.05), Z(.40), *TL, 96, {})],
 's42b': [("HİÇBİR ŞEY YAKILMADI", ('k', 'izin'), Z(.98), .06, .74, 120, {'rot': -3})],
 's44b': [("Sıradaki video:\nTuvaletin gerçek hikâyesi", Z(.04), Z(.40), .05, .70, 96, {}), ("Sıradaki icadı sen seç!", ('k', 'seç'), Z(.97), .05, .08, 120, {'rot': -3})],
 's31b': [("Nefes almak… isteğe bağlı değildir.", ('k', 'nefes'), Z(.98), .04, .78, 100, {})],
}
for _k in ('s07', 's16', 's28b', 's42b', 's44b', 's31b', 's29', 's35', 's42a'): YAZI.pop(_k, None)
YAZI.update({
 's03': [("Gerçek bir korse, 1885\n(Metropolitan Müzesi)", .8, 6.2, .05, .76, 90, {})],
 's03b': [("Gerçek bir korse, 1890\n(Metropolitan Müzesi)", .6, 5.0, .05, .76, 90, {})],
 's37d': [("Gerçek bir korse, 1885\n(Metropolitan Müzesi)", .4, -.4, .05, .76, 90, {})],
 's06': [("ŞU AN TARİH YAZILIYOR", ('k', 'tarih'), -.2, .05, .10, 130, {'rot': -3})],
 's15': [("MAYO DEĞİL…\nSPOR KIYAFETİ!", ('k', 'mayo'), ('k', 'derdindeymiş'), .06, .08, 130, {'rot': -3})],
 's29': [("Herminie Cadolle", ('k', 'Herminie'), -.3, .05, .80, 100, {})],
 's35': [("ABD Patenti No. 1.115.674", ('k', 'patent'), ('k', 'Aynı'), *TL, 100, {'renk': '#2A1D16', 'kontur': 'rgba(255,255,255,.97)', 'konturKalin': .38}),
         ("başvuru: 12 Şubat 1914\nonay: 3 Kasım 1914", ('k', 'Aynı'), ('k', 'Ama'), .05, .76, 90, {'renk': '#2A1D16', 'kontur': 'rgba(255,255,255,.97)', 'konturKalin': .38})],
 's42a': [("Atlantic City, 1968", Z(.04), Z(.20), *TL, 96, {}), ("HİÇBİR ŞEY YAKILMADI", ('k', 'izin'), -.3, .06, .74, 120, {'rot': -3})],
 's44a': [("Sıradaki video:\nTuvaletin gerçek hikâyesi", ('k', 'sonraki'), -.3, .05, .70, 96, {})],
 's33b': [("Nefes almak… isteğe bağlı değildir.", ('k', 'nefes'), -.2, .04, .78, 100, {})],
})

def zaman(v, D, sid=None):
    if isinstance(v, tuple):
        if v[0] == 'k': return max(0, round(kw(sid, v[1]) - .1, 2))
        return round(v[1] * D, 2)
    return round(D + v, 2) if v < 0 else v

def yol_uret(sid, D, W, H, odak, ofs, hiz=.02):
    """Kesintisiz kamera yolu: ~4,5 sn aralıklı yol noktaları; yakınlaşma ve kayma hızı sınırlı (sert kesme ve atlama YOK)."""
    zcap = 1.18 if W >= 1344 else 1.06
    n = max(2, round(D / 4.5) + 1)
    U = [0.0, 0.85, 0.25, 1.0, 0.45, 0.1]
    pts = []
    for k in range(n):
        t = round(D * k / (n - 1), 2)
        fx, fy = odak[(k + ofs) % len(odak)]
        if len(odak) == 1: fx += .02 * (1 if (k + ofs) % 2 == 0 else -1)
        z = 1 + (zcap - 1) * U[(k + ofs) % len(U)]
        if pts:   # hız sınırları: yakınlaşma ≤ %3,5/sn, kayma ≤ hiz*(kenar uzunluğu)/sn
            dt = t - pts[-1]['t']; p = pts[-1]
            z = clamp_(z, p['z'] - .035 * dt, p['z'] + .035 * dt); z = clamp_(z, 1.0, zcap)
            fx = clamp_(fx, p['cx'] - hiz * dt, p['cx'] + hiz * dt); fy = clamp_(fy, p['cy'] - hiz * dt, p['cy'] + hiz * dt)
        pts.append({'t': t, 'cx': round(fx, 3), 'cy': round(fy, 3), 'z': round(z, 3)})
    return pts
def clamp_(x, a, b): return max(a, min(b, x))

def kesmeler(sid, D, W, odak, ofs):
    zcap = 1.18 if W >= 1344 else 1.06
    desen = [(1.00, 1.07), (1.09, 1.16), (1.14, 1.08), (1.04, 1.12), (1.12, 1.18), (1.06, 1.00)]
    n = max(1, round(D / 3.0)); sonuc = []
    for i in range(n):
        t = round(D * i / n, 2); fx, fy = odak[i % len(odak)]
        z0, z1 = [1 + (z - 1) * (zcap - 1) / .18 for z in desen[(i + ofs) % len(desen)]]
        dx = .035 * (1 if (i + ofs) % 2 == 0 else -1)
        sonuc.append({'t': t, 'a': [round(fx - dx, 3), fy, round(z0, 3)], 'b': [round(fx + dx, 3), fy, round(z1, 3)]})
    return sonuc

sahneler, plan = [], []
for i, (sid, mk, mn) in enumerate(SAHNE):
    D = SURE[sid]; ad = f'{i + 1:02d}-{sid}'
    if sid in KLIP:
        plan.append({'tur': 'klip', 'id': ad, 'dur': D, **KLIP[sid]}); continue
    A, B, M, gecis, ok = SPEC[sid]; W, H = boyut(A)
    odak = ODAK[ok] if ok else [(.5, .5)]
    s = {'id': ad, 'dur': D, 'img': A}
    if B: s.update(imgB=B, maske=M, gecis=[{'t': (max(0, round(kw(sid, f[1]) - .05, 2)) if isinstance(f, tuple) else round(f * D, 2)), 'to': to, 'sure': .1} for f, to in gecis])
    if sid == 's15': s['bKayma'] = [-3, 0]   # B ayrı boyutta üretildi: yüz bölgesi 3 px sola kaymış
    base = re.sub(r'[a-z]$', '', sid) if sid not in ('s18b',) else 's18'
    if ok == 's35':     # uzun, dar belge: üstten alta tek yavaş tarama
        s['yol'] = [{'t': 0, 'cx': .5, 'cy': .19, 'z': 1.0}, {'t': round(D * .5, 2), 'cx': .5, 'cy': .41, 'z': 1.04}, {'t': D, 'cx': .5, 'cy': .62, 'z': 1.0}]
    elif sid == 's03':  # korse fotoğrafı: yukarıdan aşağı tek kesintisiz tarama
        s['yol'] = [{'t': 0, 'cx': .5, 'cy': .30, 'z': 1.0}, {'t': D, 'cx': .5, 'cy': .70, 'z': 1.06}]
    elif sid == 's03b':  # ikinci gerçek korse: aşağıdan yukarı
        s['yol'] = [{'t': 0, 'cx': .5, 'cy': .62, 'z': 1.0}, {'t': D, 'cx': .5, 'cy': .42, 'z': 1.06}]
    elif sid == 's37d':  # karanlık zeminde korse: yavaş yaklaşma
        s['yol'] = [{'t': 0, 'cx': .5, 'cy': .46, 'z': 1.0}, {'t': D, 'cx': .5, 'cy': .50, 'z': 1.12}]
    elif sid == 's42a':  # kadınlar → çöp kutusu → polis: tek kesintisiz, yavaş tarama (kelimelere bağlı)
        s['yol'] = [{'t': 0, 'cx': .30, 'cy': .50, 'z': 1.06},
                    {'t': round(kw(sid, 'Kadınlar') - .3, 2), 'cx': .35, 'cy': .55, 'z': 1.10},
                    {'t': round(kw(sid, 'Plan') - .2, 2), 'cx': .50, 'cy': .62, 'z': 1.13},
                    {'t': round(kw(sid, 'polis') + .8, 2), 'cx': .62, 'cy': .54, 'z': 1.15},
                    {'t': round(D - 1.0, 2), 'cx': .72, 'cy': .48, 'z': 1.10},
                    {'t': D, 'cx': .72, 'cy': .50, 'z': 1.06}]
    elif sid in ('s36', 'n39'):
        s['yol'] = [{'t': 0, 'cx': .5, 'cy': .5, 'z': 1.0}, {'t': D, 'cx': .5, 'cy': .5, 'z': 1.0}]
    else:
        s['yol'] = yol_uret(sid, D, W, H, odak, i % 5)
    # aynı görsel arka arkaya geliyorsa kamera yolunu önceki sahnenin bittiği yerden başlat (sahne sınırında atlama olmasın)
    if sahneler and sahneler[-1]['img'] == A and plan[-1]['tur'] == 'motor2' and plan[-1]['id'] == sahneler[-1]['id']:
        _p = sahneler[-1]['yol'][-1]; s['yol'][0] = {'t': 0, 'cx': _p['cx'], 'cy': _p['cy'], 'z': _p['z']}
    yz = []
    for (metin, b0, b1, x, y, fs, ek) in YAZI.get(sid, []):
        d = {'t0': zaman(b0, D, sid), 't1': zaman(b1, D, sid), 'x': x, 'y': y, 'yazi': metin, 'fs': fs}; d.update(ek); yz.append(d)
    if yz: s['yazilar'] = yz
    ye = YEREL.get(base) or YEREL.get(sid)
    if ye and sid in ('s33', 's33b', 's31', 's31b', 's37b', 's02', 's02b', 's02c'):
        for ky in ('yama', 'serit', 'isik'):
            if ky in ye:
                kk = []
                for e in ye[ky]:
                    e = dict(e)
                    for kx in ('x', 'w', 'rx', 'px', 'r'):
                        if kx in e: e[kx] = round(e[kx] * W, 1)
                    for kyy in ('y', 'h', 'ry', 'py'):
                        if kyy in e: e[kyy] = round(e[kyy] * H, 1)
                    for kd in ('dx', 'dy', 'genlik'):
                        if kd in e: e[kd] = round(e[kd] * W / 1344, 2)
                    kk.append(e)
                s[ky] = kk
        if 'yuz' in ye: s['yuz'] = ye['yuz']
    if sid == 's36':
        L = lambda m, f: dict(t0=round(f * D, 2), t1=round(D - .1, 2), x=.33, y=.10 if 'aldığı' in m else .50, yazi=m, fs=84, renk='#2A1D16', kontur='rgba(255,255,255,0)', konturKalin=0)
        s['yazilar'] = [L("Mary'nin aldığı", .04), L("Şirketin kazandığı", .42)]
        s['sayaclar'] = [dict(t0=round(.10 * D, 2), t1=round(D - .1, 2), x=.5, y=.20, fs=210, a=0, b=1500, sure=1.4, onek=' $', renk='#B5812A'),
                         dict(t0=round(.50 * D, 2), t1=round(D - .1, 2), x=.5, y=.60, fs=250, a=0, b=15000000, sure=round(.38 * D, 2), onek=' $', renk='#B5812A')]
    if sid == 's42c':
        K = dict(renk='#2A1D16', kontur='rgba(255,255,255,0)', konturKalin=0)
        s['yol'] = [{'t': 0, 'cx': .5, 'cy': .5, 'z': 1.0}, {'t': D, 'cx': .5, 'cy': .5, 'z': 1.0}]
        s['yazilar'] = [dict(t0=.5, t1=round(D - .2, 2), x=.06, y=.12, yazi='"SÜTYEN YAKANLAR!"', fs=150, sure=1.8, rot=-2, **K),
                        dict(t0=max(.5, round(kw(sid, 'yanan') - .1, 2)), t1=round(D - .2, 2), x=.12, y=.52, yazi='yanan tek şey:\nbir gazetecinin hayal gücü', fs=110, sure=2.4, rot=-1.5, **K)]
    if sid == 's44c':   # 'sen seç' kara tahtası: seçenekler cümleyle birlikte tebeşirle yazılır
        Kt = dict(konturKalin=0)
        s['yol'] = [{'t': 0, 'cx': .5, 'cy': .5, 'z': 1.0}, {'t': D, 'cx': .5, 'cy': .5, 'z': 1.0}]
        s['yazilar'] = [dict(t0=max(.2, round(kw(sid, 'sen') - .1, 2)), t1=round(D - .1, 2), x=.07, y=.07, yazi='Sıradaki icadı sen seç!', fs=130, sure=1.6, rot=-1.5, renk='#F2D27A', **Kt),
                        dict(t0=round(kw(sid, 'Topuklu') - .1, 2), t1=round(D - .1, 2), x=.09, y=.27, yazi='Topuklu ayakkabıyı kim buldu?', fs=106, sure=1.8, rot=-1, **Kt),
                        dict(t0=round(kw(sid, 'Çatalı') - .1, 2), t1=round(D - .1, 2), x=.09, y=.44, yazi='Çatalı kim buldu?', fs=106, sure=1.2, rot=-1, **Kt),
                        dict(t0=round(kw(sid, 'tuvalet') - .1, 2), t1=round(D - .1, 2), x=.09, y=.60, yazi='Tuvalet kâğıdından önce\nne kullanılıyordu?', fs=106, sure=2.4, rot=-1, **Kt),
                        dict(t0=round(kw(sid, 'Yorumlara') - .1, 2), t1=round(D - .1, 2), x=.52, y=.84, yazi='Yorumlara yaz!', fs=118, sure=1.2, rot=-2, renk='#F2D27A', **Kt)]
    if sid == 'n39':
        s['yazilar'] = [dict(t0=.4, t1=round(D - .1, 2), x=.10, y=.18, yazi='EFSANE mi?', fs=200, sure=1.1, rot=-3, konturKalin=0),
                        dict(t0=2.3, t1=round(D - .1, 2), x=.22, y=.55, yazi='…yoksa GERÇEK mi?', fs=180, sure=1.3, rot=-2, konturKalin=0)]
    sahneler.append(s); plan.append({'tur': 'motor2', 'id': ad, 'dur': D})

json.dump({'fps': 15, 'sahneler': sahneler}, open(ROOT + 'scripts/motor2/timeline_tam.json', 'w'), ensure_ascii=False, indent=1)
json.dump(plan, open(ROOT + 'scripts/motor2/plan_tam.json', 'w'), ensure_ascii=False, indent=1)
# 'Peki sütyeni kim buldu?' özet kartı: nodlar söylenen kelimeyle belirir (eski kartın pop zamanları: .3 + .9k; yazı 5.2)
_D1, _D2 = SURE['s43'], SURE['s43b']
_an = [[0, .26]]
for _k, _w in enumerate(['Antik', 'Romalılar', 'Orta', 'Cadolle', 'Mary']):
    _an.append([round(kw('s43', _w) - .05, 2), round(.3 + .9 * _k, 2)])
_an.append([round(_an[-1][0] + .7, 2), 4.6])
_t1 = _D1 + kw('s43b', 'sütyen') - .05
_an += [[round(_t1, 2), 5.2], [round(_t1 + .7, 2), 5.8], [round(_D1 + _D2 + 1, 2), 5.8]]
json.dump({'D1': _D1, 'D2': _D2, 'anchors': _an}, open(ROOT + 'scripts/motor2/kart43.json', 'w'), indent=1)
print(f'{len(SAHNE)} sahne, toplam {TOPLAM:.0f} sn = {TOPLAM / 60:.2f} dk, motor2 sahnesi {len(sahneler)}, klip {len(plan) - len(sahneler)}')
for sid, mk, mn in SAHNE: print(f'{SURE[sid]:6.1f}  {sid}  {mk}')

# ---------------- 3) KONTROL LİSTESİ VERİSİ (cümle ↔ görsel) ----------------
_t0 = 0.0; _liste = []
for _n, (_e, (_sid, _mk, _mn)) in enumerate(zip(plan, SAHNE), 1):
    _sc = next((x for x in sahneler if x['id'] == _e['id']), None)
    _g = (_sc['img'].split('/')[-1] + (' + ' + _sc['imgB'].split('/')[-1] if _sc.get('imgB') else '')) if _sc else _e['yol'].split('/')[-1]
    _liste.append({'no': _n, 'id': _e['id'], 'sid': _sid, 'bas': round(_t0, 2), 'dur': _e['dur'], 'metin': METIN[_sid], 'gorsel': _g})
    _t0 += _e['dur']
json.dump(_liste, open(ROOT + 'scripts/motor2/metin_tam.json', 'w'), ensure_ascii=False, indent=1)
