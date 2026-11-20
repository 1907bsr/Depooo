"""Kukla animasyonu: el sallama + nefes + baş eğme + göz kırpma/bakış/gülümseme. 8 sn, 24 kare/sn, kusursuz döngü.
Kullanım: python3 canlandir.py <çıktı_klasörü> [süre=8]"""
import sys, os, math
from PIL import Image
from rig import Rig
from yuz import Yuz

OUT = sys.argv[1]; DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 8.0
FPS = 24; os.makedirs(OUT, exist_ok=True)
rig = Rig(); head_img, hx0, hy0 = rig.layers['head']; yuz = Yuz(head_img, hx0, hy0)
TAU = 2 * math.pi


def S(x, a, b):
    k = min(1.0, max(0.0, (x - a) / (b - a))); return k * k * (3 - 2 * k)


BLINKS = [0.7, 3.0, 5.2, 7.2]
def blink_amount(t):
    a = 0.0
    for tb in BLINKS:
        x = t - tb
        if 0 <= x < 0.07: v = S(x, 0, 0.07)
        elif 0.07 <= x < 0.11: v = 1.0
        elif 0.11 <= x < 0.24: v = 1 - S(x, 0.11, 0.24)
        else: v = 0.0
        a = max(a, v)
    return a


def frame_params(t):
    lift = S(t, 1.1, 1.9) - S(t, 4.7, 5.5)                 # omuz: kol kalkık mı (0..1)
    liftF = S(t, 0.9, 1.7) - S(t, 4.9, 5.7)                # dirsek önce bükülür, inerken geriden gelir
    wenv = S(t, 1.9, 2.3) - S(t, 4.3, 4.7)                 # sallama genliği zarfı
    ph = TAU * 1.8 * (t - 1.9)                              # sallama fazı (1,8 Hz)
    idle = 1 - lift
    pose = dict(
        upperL=34 * lift + 2.0 * wenv * math.sin(ph + 0.5) + idle * 1.2 * math.sin(TAU * t / 4 + 0.3),
        foreL=118 * liftF + 22 * wenv * math.sin(ph) + idle * 1.5 * math.sin(TAU * t / 4 + 0.8),
        handL=12 * wenv * math.sin(ph - 0.9),
        upperR=-1.5 * math.sin(TAU * t / 4 + 1.0), foreR=-2.0 * math.sin(TAU * t / 4 + 1.5), handR=1.0 * math.sin(TAU * t / 4 + 2.0),
        root_rot=0.7 * math.sin(TAU * t / 8), torso_dy=-1.0 * math.sin(TAU * t / 4),
        head_rot=2.0 * math.sin(TAU * t / 8 + 0.9) - 3.5 * lift, head_dy=1.0 * math.sin(TAU * t / 4 + 0.3))
    look = -1.0 * (S(t, 1.2, 1.6) - S(t, 4.6, 5.0)) + 0.8 * (S(t, 5.8, 6.1) - S(t, 6.7, 7.0))
    smile = 0.30 + 0.65 * lift - 0.3 * 0   # kol kalkıkken daha geniş
    smile = min(1.0, 0.30 * (1 - lift) + 0.95 * lift)
    brow = 0.9 * (S(t, 0.9, 1.2) - S(t, 1.9, 2.5)) + 0.5 * (S(t, 5.8, 6.1) - S(t, 6.7, 7.0))
    face = dict(look=look, smile=smile, brow=brow, blink=blink_amount(t),
                curlL=5.0 * math.sin(TAU * t / 2 + 0.2) - 1.2 * pose['head_rot'], curlR=5.0 * math.sin(TAU * t / 4 + 1.3) - 1.2 * pose['head_rot'])
    return pose, face


n = int(FPS * DUR)
for i in range(n):
    t = i / FPS; pose, face = frame_params(t)
    himg, ox, oy = yuz.render(**face)
    rig.render(pose, {'head': (himg, ox, oy)}).save(f'{OUT}/k_{i:04d}.png')
    if i % 24 == 0: print('kare', i, '/', n, flush=True)
print('bitti', n)
