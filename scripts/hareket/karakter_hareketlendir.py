"""Tek bir karakter resmini (düz arka plan, ayakta) kodla hareketlendirir; resmi parçalara ayırmadan yumuşak bölge bükmeleri kullanır.
Hareketler: nefes, ağırlık verme (hafif salınma), baş eğme, saç bukleleri, kol sarkması, etek sallanması,
            göz kırpma (göz çevresi temizlenip kapak çizilir), bakış kayması, kaş kalkması, gülümseme.
Kullanım: python3 hareketlendir.py <kaynak.png> <çıktı_klasörü> [süre_sn=6]
Not: Göz/ağız/kaş/bukle koordinatları bu resme göre elle ayarlıdır (686x1024). Başka karakter için KOORDİNATLAR bölümünü güncelle."""
import sys, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]; DUR = float(sys.argv[3]) if len(sys.argv) > 3 else 6.0
FPS = 24; os.makedirs(OUT, exist_ok=True)
img = Image.open(SRC).convert('RGB'); W, H = img.size
base = np.asarray(img).astype(np.float32)
Xg, Yg = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))


def mask_from(fn, blur):
    m = Image.new('L', (W, H), 0); fn(ImageDraw.Draw(m)); m = m.filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(m).astype(np.float32) / 255.0


# ============================ KOORDİNATLAR (kaynak.png, 687x1024) ============================
head = mask_from(lambda d: d.ellipse((256, 12, 434, 240), fill=255), 7)
torso = mask_from(lambda d: d.polygon([(262, 232), (432, 232), (440, 262), (405, 420), (293, 420), (255, 262)], fill=255), 6)
armL = mask_from(lambda d: d.polygon([(250, 236), (285, 240), (282, 330), (270, 450), (264, 548), (264, 604), (226, 604), (224, 548), (234, 440), (244, 330)], fill=255), 5)
armR = mask_from(lambda d: d.polygon([(418, 240), (452, 236), (460, 330), (470, 440), (470, 548), (466, 604), (430, 604), (430, 548), (420, 450), (410, 330)], fill=255), 5)
skirt = mask_from(lambda d: d.polygon([(285, 408), (402, 408), (432, 500), (464, 738), (350, 752), (233, 738), (262, 500)], fill=255), 8)
body = mask_from(lambda d: (d.ellipse((256, 12, 434, 240), fill=255), d.polygon([(250, 230), (448, 230), (470, 440), (470, 610), (464, 745), (430, 745), (430, 990), (255, 990), (290, 745), (233, 745), (224, 610), (232, 440)], fill=255)), 12)
iris = [mask_from(lambda d, c=c: d.ellipse((c[0] - 8, c[1] - 7, c[0] + 8, c[1] + 7), fill=255), 2.0) for c in [(319.5, 141.5), (359.0, 141.0)]]
MOUTH_C = 338.5                                                         # dudak ortası (x)
mouth = mask_from(lambda d: d.ellipse((MOUTH_C - 20, 170, MOUTH_C + 20, 188), fill=255), 2.5)
brow = [mask_from(lambda d, c=c: d.ellipse((c[0] - 16, c[1] - 6, c[0] + 16, c[1] + 6), fill=255), 2.5) for c in [(315, 128.5), (358, 127.5)]]

PIV_HEAD = (348.0, 232.0); PIV_L = (262.0, 246.0); PIV_R = (440.0, 246.0)
# Bukle maskeleri: sadece buklenin kendisi (ciltli yerler hariç), yoksa çene çizgisi de sallanır
_skin = ((base[..., 0] > base[..., 2] + 22) & (base.mean(axis=2) > 150)).astype(np.float32)
_skin = np.asarray(Image.fromarray((_skin * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(3.0))).astype(np.float32) / 255.0
curlL = mask_from(lambda d: d.ellipse((270, 140, 320, 228), fill=255), 5) * (1 - _skin)
curlR = mask_from(lambda d: d.ellipse((380, 146, 426, 236), fill=255), 5) * (1 - _skin)
PIV_CL = (298.0, 150.0); PIV_CR = (398.0, 158.0)

# Gözler: (üst kirpik çizgisi, alt kapak, kapalı göz çizgisi) noktaları; pencere = (x0, y0, genişlik, yükseklik)
EYE_DEF = [
    dict(win=(298, 127, 40, 26), outer='left',
         top=[(305.0, 141.2), (309.3, 138.0), (313.3, 136.3), (318.7, 135.5), (323.3, 136.1), (326.7, 138.0), (329.0, 141.0)],
         bot=[(305.0, 141.4), (308.3, 142.9), (310.3, 144.2), (313.3, 146.3), (317.3, 147.3), (322.0, 147.0), (326.0, 144.7), (329.0, 141.8)],
         closed=[(305.0, 141.0), (309.0, 142.9), (313.0, 144.3), (317.5, 144.9), (322.0, 144.5), (326.0, 143.2), (329.0, 141.8)]),
    dict(win=(340, 126, 40, 26), outer='right',
         top=[(347.0, 142.3), (349.3, 137.7), (353.3, 135.0), (358.7, 134.2), (364.0, 135.0), (368.7, 137.3), (372.3, 139.7)],
         bot=[(347.0, 142.4), (348.7, 144.7), (352.7, 146.7), (358.0, 147.5), (363.3, 146.7), (367.3, 144.7), (370.0, 142.2), (372.3, 139.9)],
         closed=[(347.0, 142.6), (350.0, 144.2), (354.0, 145.5), (358.5, 145.9), (363.0, 145.4), (367.0, 143.9), (370.0, 141.9), (372.3, 140.0)]),
]
LASH = np.array([58.0, 40.0, 36.0], np.float32)
BLINKS = [1.85, 3.7, 5.45]
# =============================================================================================


def bump(x, a, b):
    if x <= a or x >= b: return 0.0
    return 0.5 * (1 - math.cos(2 * math.pi * (x - a) / (b - a)))


def S_(x, a, b):
    k = min(1.0, max(0.0, (x - a) / (b - a))); return k * k * (3 - 2 * k)


def look(t):    # -1 sola, +1 sağa bakış
    return -(S_(t, .7, .95) - S_(t, 1.4, 1.65)) + (S_(t, 2.6, 2.85) - S_(t, 3.3, 3.55)) - (S_(t, 4.4, 4.65) - S_(t, 5.0, 5.25))


def smile(t):
    return 0.6 * bump(t, 0.4, 2.6) + 1.0 * bump(t, 2.9, 5.7)


def rot_disp(px, py, piv, th):
    c, s = math.cos(th), math.sin(th); rx, ry = px - piv[0], py - piv[1]
    return (piv[0] + c * rx - s * ry - px, piv[1] + s * rx + c * ry - py)


def remap(src, sx, sy):
    sx = np.clip(sx, 0, W - 1.001); sy = np.clip(sy, 0, H - 1.001)
    x0 = sx.astype(np.int32); y0 = sy.astype(np.int32)
    fx = (sx - x0)[..., None]; fy = (sy - y0)[..., None]
    a = src[y0, x0]; b = src[y0, x0 + 1]; c = src[y0 + 1, x0]; d = src[y0 + 1, x0 + 1]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy


def bilin(field, px, py):
    px = np.clip(px, 0, W - 1.001); py = np.clip(py, 0, H - 1.001)
    x0 = px.astype(np.int32); y0 = py.astype(np.int32); fx = px - x0; fy = py - y0
    return (field[y0, x0] * (1 - fx) + field[y0, x0 + 1] * fx) * (1 - fy) + (field[y0 + 1, x0] * (1 - fx) + field[y0 + 1, x0 + 1] * fx) * fy


def backward(dx, dy, iters=4):
    px, py = Xg.copy(), Yg.copy()
    for _ in range(iters):
        px, py = Xg - bilin(dx, px, py), Yg - bilin(dy, px, py)
    return px, py


hfac = np.clip((860.0 - Yg) / 860.0, 0, 1) ** 1.6                      # yükseldikçe daha çok salınır, ayaklar sabit
afac = np.clip((Yg - 246.0) / (600.0 - 246.0), 0, 1) ** 1.3                # kol: omuzda 0, elde 1
sfac = np.clip((Yg - 408.0) / (745.0 - 408.0), 0, 1) ** 1.6            # etek: belde 0, kenarda 1


def displacement(t):
    w = 2 * math.pi
    sway = 13.0 * math.sin(w * t / 6.0)
    breath = math.sin(w * t / 3.0)
    th_head = math.radians(3.6 * math.sin(w * t / 6.0 + 0.9)); head_dy = 2.6 * math.sin(w * t / 3.0 + 0.3)
    th_cl = math.radians(6.0 * math.sin(w * t / 2.0 + 0.2) * (0.65 + 0.35 * math.sin(w * t / 6.0)))
    th_cr = math.radians(5.5 * math.sin(w * t / 3.0 + 1.3) * (0.65 + 0.35 * math.sin(w * t / 6.0 + 1.0)))
    th_al = math.radians(3.2 * math.sin(w * t / 3.0 + 0.5)); th_ar = math.radians(-3.2 * math.sin(w * t / 3.0 + 0.9))
    torso_dy = -4.2 * breath
    dx = body * (sway * hfac); dy = np.zeros_like(dx)
    hx, hy = rot_disp(Xg, Yg, PIV_HEAD, th_head); dx += head * hx; dy += head * (hy + head_dy)
    cx, cy = rot_disp(Xg, Yg, PIV_CL, th_cl); dx += curlL * cx; dy += curlL * cy
    cx, cy = rot_disp(Xg, Yg, PIV_CR, th_cr); dx += curlR * cx; dy += curlR * cy
    dy += torso * torso_dy
    dx += armL * afac * (3.0 * math.sin(w * t / 3.0 + 0.5)); dy += armL * 0.5 * torso_dy
    dx += armR * afac * (-3.0 * math.sin(w * t / 3.0 + 0.9)); dy += armR * 0.5 * torso_dy
    dx += skirt * sfac * (5.0 * math.sin(w * t / 3.0 + 1.1) - 3.5 * math.sin(w * t / 6.0 + 0.2))
    dy += skirt * sfac * 1.0 * math.sin(w * t / 3.0)
    lk = look(t)
    for k in range(2): dx += iris[k] * (3.0 * lk)
    sm_ = smile(t); wx = np.clip(((Xg - MOUTH_C) / 14.5) ** 2, 0, 1.35)
    dy += mouth * (-3.0 * sm_ * wx); dx += mouth * (1.2 * sm_ * np.clip((Xg - MOUTH_C) / 14.5, -1.2, 1.2))
    bz = 1.8 * bump(t, 2.4, 3.8)
    for k in range(2): dy += brow[k] * (-bz)
    return dx, dy


# ---- göz kırpma: göz çevresindeki cilt "difüzyonla" doldurulur (temiz kapak), kırpma sırasında kapak + kirpik çizgisi çizilir
def curve(pts):
    p = np.array(pts, np.float32); return lambda x: np.interp(x, p[:, 0], p[:, 1])


def prep_eye(ed):
    x0, y0, w, h = ed['win']
    poly = ed['top'] + ed['bot'][::-1]
    cx = sum(p[0] for p in poly) / len(poly); cy = sum(p[1] for p in poly) / len(poly)
    big = []
    for (px, py) in poly:                                                # çokgeni 1,4 px dışarı genişlet
        d = math.hypot(px - cx, py - cy) or 1.0; big.append((px + (px - cx) / d * 1.4, py + (py - cy) / d * 1.4))
    S = 8; m = Image.new('L', (w * S, h * S), 0)
    ImageDraw.Draw(m).polygon([((px - x0) * S, (py - y0) * S) for px, py in big], fill=255)
    E = np.asarray(m.filter(ImageFilter.GaussianBlur(0.5 * S)).resize((w, h), Image.BOX)).astype(np.float32) / 255.0
    win = base[y0:y0 + h, x0:x0 + w]
    ring = win[(E < 0.01)]; skin_px = ring[(ring[:, 0] > ring[:, 2] + 25) & (ring.mean(axis=1) > 170)]
    skin = np.median(skin_px, axis=0)
    ink = np.linalg.norm(win - skin, axis=2) > 24                      # çizgiler (kaş, kıvrım, burun köprüsü, saç) örnek alınmaz
    hole = np.asarray(Image.fromarray(((E > 0.01) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
    unknown = hole | ink; out = win.copy(); out[unknown] = skin
    for _ in range(700):
        p = np.pad(out, ((1, 1), (1, 1), (0, 0)), mode='edge')
        avg = (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) / 4.0
        out = np.where(unknown[..., None], avg, out)
    xc = (x0 + np.arange(w) + 0.5).astype(np.float32); yc = (y0 + np.arange(h) + 0.5).astype(np.float32)[:, None]
    xs = np.array([p[0] for p in ed['closed']]); xa, xb = xs.min(), xs.max()
    s = (xc - (xa if ed['outer'] == 'left' else xb)) / ((xb - xa) * (1 if ed['outer'] == 'left' else -1))   # 0: dış köşe, 1: iç köşe
    sm = np.clip((s - 0.45) / 0.55, 0, 1); sm = sm * sm * (3 - 2 * sm)
    taper = np.clip((s + 0.02) / 0.10, 0, 1) * np.clip((1.04 - s) / 0.10, 0, 1)
    lw = (2.7 - 1.4 * sm) * taper
    return dict(win=ed['win'], E=E, clean=out, xc=xc, yc=yc, ft=curve(ed['top']), fb=curve(ed['bot']), fc=curve(ed['closed']), lw=lw.astype(np.float32),
                inx=((xc >= xa - 0.4) & (xc <= xb + 0.4)).astype(np.float32))


EYES = [prep_eye(e) for e in EYE_DEF]


def blink_amount(t):
    a = 0.0
    for tb in BLINKS:
        x = t - tb
        if 0 <= x < 0.07: v = S_(x, 0, 0.07)
        elif 0.07 <= x < 0.11: v = 1.0
        elif 0.11 <= x < 0.24: v = 1 - S_(x, 0.11, 0.24)
        else: v = 0.0
        a = max(a, v)
    return a


def apply_blink(src, a):
    if a < 0.02: return src
    out = src.copy(); e_up = a; e_lo = a ** 1.7
    for E in EYES:
        x0, y0, w, h = E['win']; xc, yc = E['xc'], E['yc']
        yt, yb, yk = E['ft'](xc), E['fb'](xc), E['fc'](xc)
        yl = yt + e_up * (yk - yt); ylo = yb + e_lo * (yk - yb)
        cov = np.maximum(np.clip(yl[None, :] - yc + 0.5, 0, 1), np.clip(yc - ylo[None, :] + 0.5, 0, 1)) * E['E']
        win = src[y0:y0 + h, x0:x0 + w]
        mix = win * (1 - cov[..., None]) + E['clean'] * cov[..., None]
        fade = min(1.0, e_up / 0.08)
        up = np.clip(E['lw'][None, :] / 2 + 0.5 - np.abs(yc - yl[None, :]), 0, 1) * E['inx'][None, :] * fade
        lo = np.clip(0.55 - np.abs(yc - ylo[None, :]) + 0.0, 0, 1) * E['inx'][None, :] * (0.5 * (1 - e_up) * min(1.0, e_lo / 0.1)) * (E['lw'][None, :] > 0.5)
        mix = mix * (1 - up[..., None]) + LASH * up[..., None]
        mix = mix * (1 - lo[..., None]) + LASH * lo[..., None]
        out[y0:y0 + h, x0:x0 + w] = mix
    return out


n = int(FPS * DUR)
for i in range(n):
    t = i / FPS; dx, dy = displacement(t)
    px, py = backward(dx, dy); res = remap(apply_blink(base, blink_amount(t)), px, py)
    Image.fromarray(np.clip(res + .5, 0, 255).astype(np.uint8)).crop((0, 0, W - (W % 2), H - (H % 2))).save(f'{OUT}/k_{i:04d}.png')
print('kare:', n, 'boyut:', W - (W % 2), H - (H % 2))
