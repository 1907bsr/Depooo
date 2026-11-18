"""NasılOldu? – özgün müzik üretici (tamamen kendi bestemiz, telifsiz).

Kullanım: python scripts/muzik/uret.py <çıkış_klasörü>
Üç parça üretir:
  merak.wav  – esprili/meraklı pizzicato (bilgi anlatımı, komik anlar)
  gizem.wav  – yavaş, gizemli (şato, efsaneler)
  zafer.wav  – neşeli, zafer (Mary'nin başarısı, kapanış)
Melodiler ve düzenlemeler bu dosyada notalarla yazılmış özgün bestelerdir.
"""
import sys, os, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def nfreq(n):  # MIDI nota -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)


# ---------------- enstrümanlar ----------------
def pluck(f, dur, bright=0.5):
    """Karplus-Strong: pizzicato / ukulele benzeri tel."""
    n = int(SR * dur); p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p) * 0.8
    out = np.zeros(n); decay = 0.994 + 0.004 * bright
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = decay * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out


def tone(f, dur, harm=(1, .0, .3, .0, .15), att=.01, rel=.08, vib=0.0):
    t = np.arange(int(SR * dur)) / SR
    ph = 2 * np.pi * f * t + (vib * np.sin(2 * np.pi * 5.5 * t) if vib else 0)
    s = sum(a * np.sin((k + 1) * ph) for k, a in enumerate(harm) if a)
    env = np.minimum(1, t / att) * np.minimum(1, (dur - t) / rel)
    return s * np.clip(env, 0, 1)


def bell(f, dur):
    t = np.arange(int(SR * dur)) / SR
    s = np.sin(2*np.pi*f*t) + .5*np.sin(2*np.pi*f*2.76*t) + .25*np.sin(2*np.pi*f*5.4*t)
    return s * np.exp(-3.2 * t)


def pad(freqs, dur):
    t = np.arange(int(SR * dur)) / SR
    s = np.zeros_like(t)
    for f in freqs:
        for d in (-0.15, 0, 0.17):  # hafif detune
            ff = f * 2 ** (d / 12)
            s += np.sin(2*np.pi*ff*t) + .3*np.sin(4*np.pi*ff*t)
    env = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.2)
    return s / (len(freqs) * 3) * env


def tick(dur=.06, amp=.25, hp=True):
    n = int(SR * dur); x = rng.uniform(-1, 1, n) * np.exp(-np.arange(n) / (SR * .012))
    if hp: x = np.diff(np.concatenate([[0], x]))
    return x * amp


def kick():
    t = np.arange(int(SR * .25)) / SR
    return np.sin(2*np.pi*(55 + 90*np.exp(-30*t))*t) * np.exp(-12*t)


def place(track, snd, at, gain=1.0):
    i = int(at * SR); j = min(len(track), i + len(snd))
    if i < len(track): track[i:j] += snd[:j - i] * gain


def reverb(x, amt=.25):
    out = x.copy()
    for d, g in ((0.031, .5), (0.047, .4), (0.071, .3), (0.113, .22), (0.17, .15)):
        k = int(d * SR); out[k:] += x[:-k] * g * amt * 2
    return out


def save(path, L, R):
    m = max(np.abs(L).max(), np.abs(R).max()) or 1
    st = np.stack([L, R], 1) / m * 0.85
    with wave.open(path, 'w') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes())


# ---------------- parçalar ----------------
def merak():
    """Re minör, 112 bpm, esprili pizzicato + fagot benzeri bas + klarnet."""
    bpm = 112; b = 60 / bpm; bars = 16; dur = bars * 4 * b + 2
    L = np.zeros(int(SR * dur)); R = np.zeros_like(L)
    # akorlar (her ölçü): Dm  Bb  Gm  A7 | Dm  F  C  A   x2
    prog = [(50, [62, 65, 69]), (46, [62, 65, 70]), (43, [62, 67, 70]), (45, [61, 64, 67]),
            (50, [62, 65, 69]), (41, [60, 65, 69]), (48, [60, 64, 67]), (45, [61, 64, 69])] * 2
    for bar, (bass, ch) in enumerate(prog):
        t0 = bar * 4 * b
        # bas: "tum - ta" zıplayan fagot
        for k, (off, oct) in enumerate(((0, 0), (1.5, 12), (2, 7), (3.5, 12))):
            place(L, tone(nfreq(bass + oct - (5 if oct == 7 else 0)), b * .45, harm=(1, .5, .35, .2, .1), att=.005, rel=.05), t0 + off * b, .32)
        # pizzicato akor vuruşları (ters zaman)
        for off in (1, 3):
            for n in ch:
                s = pluck(nfreq(n), .4, .3); place(L, s, t0 + off * b, .16); place(R, s, t0 + off * b + .004, .16)
        # tıkırtı
        for off in (0, 1, 2, 3):
            place(R, tick(amp=.05), t0 + (off + .5) * b)
    # klarnet melodisi (özgün): (ölçü içi vuruş, nota, süre-vuruş)
    mel = [
        (0, 74, .5), (.5, 76, .5), (1, 77, 1), (2.5, 76, .5), (3, 74, 1),
        (4, 74, .5), (4.5, 72, .5), (5, 70, 1.5), (7, 69, 1),
        (8, 67, .5), (8.5, 69, .5), (9, 70, .5), (9.5, 72, .5), (10, 74, 1.5), (11.5, 70, .5),
        (12, 73, 1), (13, 76, 1), (14, 73, .5), (14.5, 69, 1.5),
        (16, 81, .5), (16.5, 77, .5), (17, 74, 1), (18, 77, .5), (18.5, 81, .5), (19, 79, 1),
        (20, 77, .5), (20.5, 74, .5), (21, 72, 1), (22, 69, 2),
        (24, 72, .5), (24.5, 74, .5), (25, 76, .5), (25.5, 77, .5), (26, 79, 1), (27, 76, 1),
        (28, 73, .5), (28.5, 76, .5), (29, 79, .5), (29.5, 76, .5), (30, 74, 2),
    ]
    for rep in (0, 32):
        for beat, n, d in mel:
            s = tone(nfreq(n), d * b * .9, harm=(1, .02, .45, .02, .25, 0, .1), att=.03, rel=.06, vib=.004)
            place(L, s, (beat + rep) * b, .2 if rep == 0 else .17); place(R, s, (beat + rep) * b + .006, .2)
    if True:  # 2. turda glockenspiel ile cevap
        for beat, n, d in mel[::3]:
            place(R, bell(nfreq(n + 12), 1.0), (beat + 32 + .5) * b, .08)
    return reverb(L, .2), reverb(R, .2)


def gizem():
    """La minör, 70 bpm, pad + seyrek çan + derin bas."""
    bpm = 70; b = 60 / bpm; bars = 8; dur = bars * 4 * b + 3
    L = np.zeros(int(SR * dur)); R = np.zeros_like(L)
    prog = [(45, [57, 60, 64]), (41, [57, 60, 65]), (43, [55, 59, 62]), (40, [56, 59, 64])] * 2
    for bar, (bass, ch) in enumerate(prog):
        t0 = bar * 4 * b
        p = pad([nfreq(n) for n in ch], 4 * b + 1.0); place(L, p, t0, .5); place(R, p, t0 + .01, .5)
        place(L, tone(nfreq(bass - 12), 4 * b, harm=(1, .3, .1), att=.4, rel=.8), t0, .45)
        place(R, tone(nfreq(bass - 12), 4 * b, harm=(1, .3, .1), att=.4, rel=.8), t0, .45)
        place(L, kick(), t0, .35)
    bells = [(0, 76), (3, 72), (6, 81), (10, 79), (13, 76), (16, 84), (19, 83), (22, 79), (26, 76), (29, 72)]
    for beat, n in bells:
        s = bell(nfreq(n), 3.0); place(L, s, beat * b, .12); place(R, s, beat * b + .03, .09)
    return reverb(L, .45), reverb(R, .45)


def zafer():
    """Fa majör, 124 bpm, ukulele vuruşları + glockenspiel + el çırpma."""
    bpm = 124; b = 60 / bpm; bars = 8; dur = bars * 4 * b + 2
    L = np.zeros(int(SR * dur)); R = np.zeros_like(L)
    prog = [(41, [65, 69, 72]), (48, [64, 67, 72]), (46, [65, 70, 74]), (48, [64, 67, 70]),
            (41, [65, 69, 72]), (50, [65, 69, 74]), (46, [65, 70, 74]), (48, [64, 67, 72])]
    strum = [0, 1, 1.5, 2.5, 3, 3.5]
    for bar, (bass, ch) in enumerate(prog):
        t0 = bar * 4 * b
        for off in strum:
            for k, n in enumerate(ch):
                s = pluck(nfreq(n), .35, .8); place(L, s, t0 + off * b + k * .012, .13); place(R, s, t0 + off * b + k * .012 + .005, .13)
        for off in (0, 2):
            place(L, tone(nfreq(bass), b * .9, harm=(1, .4, .2), att=.005, rel=.1), t0 + off * b, .35)
            place(R, tone(nfreq(bass), b * .9, harm=(1, .4, .2), att=.005, rel=.1), t0 + off * b, .35)
            place(L, kick(), t0 + off * b, .4)
        for off in (1, 3):
            c = tick(.12, .22, hp=False); place(L, c, t0 + off * b); place(R, c, t0 + off * b + .01)
    mel = [(0, 77), (1, 81), (2, 84), (3.5, 81), (4, 79), (5, 76), (6, 72), (8, 74), (9, 77), (10, 81), (11, 79),
           (12, 76), (14, 79), (16, 77), (17, 81), (18, 84), (19, 86), (20, 84), (22, 81), (24, 82), (25, 81),
           (26, 79), (27, 77), (28, 79), (29, 76), (30, 77)]
    for beat, n in mel:
        s = bell(nfreq(n), 1.2); place(L, s, beat * b, .15); place(R, s, beat * b + .004, .15)
    return reverb(L, .2), reverb(R, .2)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'medya/muzik'
    os.makedirs(out, exist_ok=True)
    for name, fn in (('merak', merak), ('gizem', gizem), ('zafer', zafer)):
        L, R = fn(); save(os.path.join(out, f'{name}.wav'), L, R); print(name, round(len(L) / SR, 1), 'sn')
