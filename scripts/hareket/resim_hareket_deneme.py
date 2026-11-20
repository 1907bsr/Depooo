"""Kodla hareket denemesi: tek bir Gemini resmini (ağlayan Mary, s37b) parçalara ayırmadan yumuşak bölge bükmeleriyle oynatır.
Hareketler: nefes, 2 hıçkırık (omuz kalkması + sarsılma), baş eğme/titreme, dudak titremesi, eller + para titremesi, kayan gözyaşları.
Kullanım: python3 hareket_deneme.py <çıktı_klasörü>   (kareleri yazar; ffmpeg ayrı çalışır)"""
import sys, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC = '/home/user/Depooo/medya/sutyen/gorsel/yeni-stil/s37b.png'
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
FPS, DUR = 24, 5.0
img = Image.open(SRC).convert('RGB'); W, H = img.size
base = np.asarray(img).astype(np.float32)
Xg, Yg = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))


def mask_from(fn, blur):
    m = Image.new('L', (W, H), 0); fn(ImageDraw.Draw(m)); m = m.filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(m).astype(np.float32) / 255.0


head = mask_from(lambda d: d.ellipse((475, 5, 805, 405), fill=255), 10)
torso = mask_from(lambda d: d.polygon([(465, 438), (520, 410), (640, 398), (760, 410), (815, 462), (850, 540), (925, 690), (900, 740), (880, 768), (400, 768), (365, 690), (400, 560), (450, 470)], fill=255), 10)
hands = mask_from(lambda d: d.polygon([(512, 428), (600, 418), (665, 425), (725, 440), (748, 520), (740, 600), (705, 668), (560, 668), (522, 610), (508, 510)], fill=255), 14)
mouth = mask_from(lambda d: d.ellipse((567, 302, 663, 350), fill=255), 6)
torso = np.clip(torso * (1 - head), 0, 1)

BURSTS = [(0.9, 1.0), (2.9, 1.35)]          # (başlangıç sn, şiddet)
PIV_HEAD = (640.0, 410.0); PIV_HAND = (620.0, 590.0)


def bump(x, a, b):
    if x <= a or x >= b: return 0.0
    return 0.5 * (1 - math.cos(2 * math.pi * (x - a) / (b - a)))


def smooth(x, a, b):
    k = min(1.0, max(0.0, (x - a) / (b - a))); return k * k * (3 - 2 * k)


def motion(t):
    """Bir anın hareket değerleri (piksel/derece)."""
    breath = -2.0 * math.sin(2 * math.pi * 0.30 * t)
    lift = shake = nod = tilt = env = 0.0
    for tb, a in BURSTS:
        tau = t - tb
        lift += -bump(tau, -0.28, 0.05) * 7.5 * a
        if tau >= 0:
            e = math.exp(-2.6 * tau); shake += e * math.sin(2 * math.pi * 6.5 * tau) * 7.0 * a; env = max(env, math.exp(-1.6 * tau))
        else:
            if tau > -0.3: env = max(env, 1.0)
        nod += bump(tau, 0.0, 0.6) * 5.5 * a
        tilt += -bump(tau, 0.0, 0.8) * 0.9 * a
    droop = -1.4 * smooth(t, 3.7, 5.0)
    torso_dy = breath + lift + shake
    head_dy = 0.7 * torso_dy + nod
    head_rot = math.radians(tilt + droop + 0.25 * shake)
    hand_rot = math.radians(2.2 * math.sin(2 * math.pi * 8.7 * t) * (0.4 + 0.6 * env))
    hand_dx = 1.3 * math.sin(2 * math.pi * 7.3 * t) * (0.4 + 0.6 * env)
    mouth_dy = 2.2 * math.sin(2 * math.pi * 7.5 * t) * (0.3 + 0.7 * env)
    return dict(torso_dy=torso_dy, head_dy=head_dy, head_rot=head_rot, hand_rot=hand_rot, hand_dx=hand_dx, mouth_dy=mouth_dy)


def rot_disp(px, py, piv, th):
    c, s = math.cos(th), math.sin(th); rx, ry = px - piv[0], py - piv[1]
    return (piv[0] + c * rx - s * ry - px, piv[1] + s * rx + c * ry - py)


def remap(src, sx, sy):
    sx = np.clip(sx, 0, W - 1.001); sy = np.clip(sy, 0, H - 1.001)
    x0 = sx.astype(np.int32); y0 = sy.astype(np.int32)
    fx = (sx - x0)[..., None]; fy = (sy - y0)[..., None]
    a = src[y0, x0]; b = src[y0, x0 + 1]; c = src[y0 + 1, x0]; d = src[y0 + 1, x0 + 1]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy


def displacement(m):
    hx, hy = rot_disp(Xg, Yg, PIV_HEAD, m['head_rot']); hy = hy + m['head_dy']
    xr, yr = rot_disp(Xg, Yg, PIV_HAND, m['hand_rot'])
    dx = head * hx + hands * (xr + m['hand_dx'])
    dy = head * hy + torso * m['torso_dy'] + hands * (yr + m['torso_dy']) + mouth * m['mouth_dy']
    return dx, dy


# ---- gözyaşları
PATHS = {'L': [(561, 258), (560, 280), (561, 305), (564, 327), (573, 344), (587, 360), (600, 372)],
         'R': [(683, 254), (686, 280), (684, 305), (680, 326), (672, 345), (662, 360), (652, 372)]}
TEARS = [('L', 0.55), ('R', 0.85), ('L', 1.00), ('R', 1.05), ('L', 3.00), ('R', 3.05)]
GROW, SLIDE = 0.30, 1.7


def path_pos(path, u):
    seg = [math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]) for i in range(len(path) - 1)]
    L = sum(seg); d = u * L
    for i, s in enumerate(seg):
        if d <= s or i == len(seg) - 1:
            k = min(1.0, d / s) if s else 0; return (path[i][0] + (path[i + 1][0] - path[i][0]) * k, path[i][1] + (path[i + 1][1] - path[i][1]) * k)
        d -= s


def tear_sprite(x, y, r, alpha):
    S = 4; w = int(r * 7 * S); h = int(r * 9 * S); fx, fy = x - math.floor(x), y - math.floor(y)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    cx = w / 2 + fx * S; cy = h * 0.62 + fy * S; R = r * S

    def shape(sc, col):
        Rs = R * sc
        d.ellipse((cx - Rs, cy - Rs, cx + Rs, cy + Rs), fill=col)
        d.polygon([(cx - 0.86 * Rs, cy - 0.45 * Rs), (cx, cy - 2.7 * Rs), (cx + 0.86 * Rs, cy - 0.45 * Rs)], fill=col)
    shape(1.14, (120, 140, 150, int(95 * alpha)))
    shape(1.0, (234, 243, 249, int(135 * alpha)))
    d.ellipse((cx - 0.55 * R, cy - 0.45 * R, cx - 0.05 * R, cy + 0.35 * R), fill=(255, 255, 255, int(235 * alpha)))
    d.ellipse((cx + 0.15 * R, cy + 0.35 * R, cx + 0.55 * R, cy + 0.7 * R), fill=(255, 255, 255, int(120 * alpha)))
    sm = im.resize((w // S, h // S), Image.LANCZOS)
    return sm, int(math.floor(x)) - (w // S) // 2, int(math.floor(y)) - int(h * 0.62 / S)


def draw_tears(frame, t, m):
    ov = Image.new('RGBA', frame.size, (0, 0, 0, 0))
    for side, t0 in TEARS:
        path = PATHS[side]
        if t < t0: continue
        if t < t0 + GROW:
            g = (t - t0) / GROW; x, y = path[0]; r = 6.0 * (0.25 + 0.75 * g); a = min(1.0, g * 1.6)
        else:
            u = (t - t0 - GROW) / SLIDE
            if u > 1: continue
            u = max(0.0, u) ** 1.55; x, y = path_pos(path, u); r = 6.0 * (1 - 0.25 * u); a = 1 - smooth(u, 0.78, 1.0)
        ix, iy = int(x), int(y)
        hx, hy = rot_disp(float(ix), float(iy), PIV_HEAD, m['head_rot']); x += hx; y += hy + m['head_dy']
        sp, px, py = tear_sprite(x, y, r, a); ov.alpha_composite(sp, (px, py))
    return Image.alpha_composite(frame.convert('RGBA'), ov).convert('RGB')


n = int(FPS * DUR)
for i in range(n):
    t = i / FPS; m = motion(t); dx, dy = displacement(m)
    out = remap(base, Xg - dx, Yg - dy)
    fr = Image.fromarray(np.clip(out + .5, 0, 255).astype(np.uint8))
    fr = draw_tears(fr, t, m)
    fr = fr.crop((0, 6, W, 762)).resize((1280, 720), Image.LANCZOS)
    fr.save(f'{OUT}/k_{i:04d}.png')
print('kare:', n)
