"""NasılOldu? – ses efekti kütüphanesi (tamamen kendi üretimimiz, telifsiz).

Kullanım: python scripts/muzik/efektler.py <cikis_klasoru>
"""
import os, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(11)
t_ = lambda d: np.arange(int(SR * d)) / SR


def noise(d): return rng.standard_normal(int(SR * d))


def lp(x, a):  # basit tek kutuplu alçak geçiren (a: 0..1, küçük = koyu)
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += a * (v - acc); y[i] = acc
    return y


def bandsweep(x, a0, a1):
    a = np.linspace(a0, a1, len(x)); y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += a[i] * (v - acc); y[i] = acc
    return y


def env(n, att, rel):
    t = np.arange(n) / SR; d = n / SR
    return np.clip(np.minimum(t / max(att, 1e-4), (d - t) / max(rel, 1e-4)), 0, 1)


def save(path, x, stereo_w=0.0):
    x = x / (np.abs(x).max() or 1) * 0.8
    L = x; R = np.roll(x, int(stereo_w * SR)) if stereo_w else x
    st = np.stack([L, R], 1)
    with wave.open(path, 'w') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes())


def whoosh(d=0.7):
    x = bandsweep(noise(d), 0.01, 0.35); x = bandsweep(x[::-1], 0.02, 0.3)[::-1]
    return x * np.sin(np.pi * np.linspace(0, 1, len(x))) ** 2


def riser(d=2.5):  # gerilim yükselişi
    t = t_(d); f = 80 * (2 ** (t / d * 3))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) + .4 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)
    n = bandsweep(noise(d), 0.005, 0.25) * 0.6
    return (tone * 0.5 + n) * (t / d) ** 2


def impact(d=1.8):  # derin "bum"
    t = t_(d); f = 38 + 70 * np.exp(-9 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-2.6 * t) + lp(noise(d), .05) * np.exp(-6 * t) * .8


def dundun():  # dramatik "dun dun duuun"
    out = np.zeros(int(SR * 3.2))
    for at, f, d in ((0, 110, .35), (.45, 104, .35), (.95, 92, 2.0)):
        t = t_(d); s = sum(np.sin(2 * np.pi * f * k * t) / k for k in (1, 2, 3, 4, 5)) * np.exp(-1.2 * t)
        s += impact(d) * .7; i = int(at * SR); out[i:i + len(s)] += s * env(len(s), .005, .2)
    return out


def ding(f=1568, d=1.6):
    t = t_(d); return (np.sin(2*np.pi*f*t) + .4*np.sin(2*np.pi*f*2.01*t) + .2*np.sin(2*np.pi*f*3.0*t)) * np.exp(-3 * t)


def sparkle(d=1.2):
    out = np.zeros(int(SR * d))
    for i in range(9):
        s = ding(2000 + 220 * ((i * 5) % 9), .6) * .5; at = int(i * .09 * SR); out[at:at + len(s)] += s[:len(out) - at]
    return out


def boing(d=0.9):
    t = t_(d); f = 180 + 260 * np.exp(-4 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR + 6 * np.sin(2 * np.pi * 14 * t)) * np.exp(-3.2 * t)


def kasa():
    t = t_(1.0); s = (np.sin(2*np.pi*2093*t) + np.sin(2*np.pi*2637*t)) * np.exp(-5 * t)
    clank = lp(noise(.08), .5) * np.exp(-np.arange(int(.08 * SR)) / (SR * .01))
    s[:len(clank)] += clank * 2; return s


def trombon():
    out = []
    for f, d in ((233, .38), (220, .38), (208, .38), (196, .95)):
        t = t_(d); vib = 1 + (0.025 * np.sin(2 * np.pi * 6 * t) if f == 196 else 0)
        s = sum(np.sin(2 * np.pi * f * vib * k * t) / k for k in (1, 2, 3, 4)) * env(len(t), .03, .08)
        out.append(s)
    return np.concatenate(out)


def tiktak(n=6):
    out = np.zeros(int(SR * n * .5))
    for i in range(n):
        c = lp(noise(.03), .6 if i % 2 else .35) * np.exp(-np.arange(int(.03 * SR)) / (SR * .004))
        at = int(i * .5 * SR); out[at:at + len(c)] += c
    return out


def kagit(d=0.9):  # kâğıt buruşma
    x = noise(d) * (rng.random(int(SR * d)) < 0.04)
    x = np.convolve(x, np.exp(-np.arange(200) / 30), 'same'); x = x - lp(x, .05)
    return x * env(len(x), .02, .2)


def pop():
    t = t_(.12); return np.sin(2 * np.pi * (300 + 900 * t / .12) * t) * np.exp(-30 * t)


def geri_sar(d=1.0):  # kaset geri sarma
    t = t_(d); f = 600 + 1800 * (t / d) + 200 * np.sin(2 * np.pi * 9 * t)
    return (np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .3 + bandsweep(noise(d), .1, .4) * .5) * env(len(t), .05, .1)


def damga():
    return impact(.5) * 1.2 + lp(noise(.5), .3) * np.exp(-25 * t_(.5))


def kalem(d=0.8):  # kalemle yazı çizme
    x = bandsweep(noise(d), .25, .35) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * t_(d)) ** 2)
    return (x - lp(x, .08)) * env(int(SR * d), .03, .1)


SFX = dict(whoosh=whoosh, gerilim=riser, bum=impact, dundun=dundun, ding=ding, parilti=sparkle,
           boing=boing, kasa=kasa, trombon=trombon, tiktak=tiktak, kagit=kagit, pop=pop,
           geri_sar=geri_sar, damga=damga, kalem=kalem)

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'medya/efekt'
    os.makedirs(out, exist_ok=True)
    for k, fn in SFX.items():
        save(os.path.join(out, k + '.wav'), fn(), 0.004); print(k)
