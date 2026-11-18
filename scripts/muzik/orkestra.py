"""NasılOldu? – sinematik belgesel müzikleri (özgün beste, gerçek enstrüman örnekleriyle).

Enstrüman kayıtları: VSCO 2 Community Edition (Versilian Studios) – CC0 1.0 (kamu malı).
Besteler (notalar, akorlar, düzenleme) bu dosyada yazılıdır; tamamen bize aittir.

Kullanım: python scripts/muzik/orkestra.py <VSCO_klasoru> <cikis_klasoru>
"""
import os, re, sys, glob, subprocess, wave
import numpy as np

SR = 44100
NOTE = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}


def load(path, sec):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-t', str(sec), '-ac', '2', '-ar', str(SR),
                        '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, 2).copy()


class Ins:
    """Basit örnekleyici: en yakın kaydı bulur, perdeyi kaydırır."""
    def __init__(self, root, pattern, kind, octave_off=0, layer_default=1, maxsec=9):
        self.files = {}  # (midi, layer) -> path
        for p in glob.glob(os.path.join(root, pattern)):
            n = os.path.basename(p)
            if kind == 'piano':
                m = re.match(r'Player_dyn(\d)_rr1_(\d{3})\.wav', n)
                if not m: continue
                # MappingChart.txt: dosya no N -> MIDI 21 + 2N (ölçümle doğrulandı: 024 -> 69)
                self.files[(21 + 2 * int(m.group(2)), int(m.group(1)))] = p
            else:
                m = re.search(r'_([A-G]#?)(-?\d)_v(\d)', n) or re.search(r'_([A-G]#?)(-?\d)_(mf)', n)
                if not m: continue
                midi = 12 * (int(m.group(2)) + 1) + NOTE[m.group(1)] + octave_off
                layer = 2 if m.group(3) == 'mf' else int(m.group(3))
                self.files.setdefault((midi, layer), p)
        self.layer_default = layer_default; self.maxsec = maxsec; self.cache = {}

    def note(self, midi, dur, layer=None, att=0.005, rel=0.35, gain=1.0):
        layer = layer or self.layer_default
        cands = [k for k in self.files if k[1] == layer] or list(self.files)
        src = min(cands, key=lambda k: (abs(k[0] - midi), k[0] > midi))
        key = self.files[src]
        if key not in self.cache: self.cache[key] = load(key, self.maxsec)
        x = self.cache[key]
        r = 2 ** ((midi - src[0]) / 12)
        n = int(min(len(x) / r, (dur + rel) * SR))
        idx = np.arange(n) * r
        y = np.stack([np.interp(idx, np.arange(len(x)), x[:, c]) for c in (0, 1)], 1)
        t = np.arange(n) / SR
        env = np.minimum(1, t / max(att, 1e-4)) * np.clip((dur + rel - t) / rel, 0, 1)
        return y * env[:, None] * gain


def place(track, snd, at, gain=1.0):
    i = int(at * SR); j = min(len(track), i + len(snd))
    if 0 <= i < len(track): track[i:j] += snd[:j - i] * gain


def hall(x, sec=2.6, wet=0.32):
    rng = np.random.default_rng(3); n = int(sec * SR); t = np.arange(n) / SR
    ir = rng.standard_normal((n, 2)) * np.exp(-t * 6.9 / sec)[:, None]
    ir[:int(.02 * SR)] = 0; ir /= np.sqrt((ir ** 2).sum(0))
    N = 1 << int(np.ceil(np.log2(len(x) + n)))
    y = np.stack([np.fft.irfft(np.fft.rfft(x[:, c], N) * np.fft.rfft(ir[:, c], N), N)[:len(x)] for c in (0, 1)], 1)
    return x * (1 - wet) + y * wet * 3


def save(path, x):
    x = x / (np.abs(x).max() or 1) * 0.89
    with wave.open(path, 'w') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())


def orchestra(V):
    S = os.path.join(V, 'Strings')
    return dict(
        piano=Ins(os.path.join(V, 'Keys/Upright Piano'), '*.wav', 'piano', layer_default=2, maxsec=8),
        vln=Ins(os.path.join(S, 'Violin Section/susVib'), '*.wav', 'str', 12, 1),
        vla=Ins(os.path.join(S, 'Viola Section/susvib'), '*.wav', 'str', 12, 1),
        vc=Ins(os.path.join(S, 'Cello Section/susvib'), '*.wav', 'str', 12, 1),
        cb=Ins(os.path.join(S, 'Solo Contrabass/SusVib'), '*.wav', 'str', 12, 1),
        pizz=Ins(os.path.join(S, 'Violin Section/Pizz'), '*.wav', 'str', 12, 1, maxsec=2),
        harp=Ins(os.path.join(S, 'Harp'), '*.wav', 'harp', 0, 2, maxsec=5),
    )


def strings_chord(O, T, at, dur, notes, vel=1.0, att=0.9):
    """notes: [cb, vc, vla, vln, vln2]"""
    parts = ['cb', 'vc', 'vla', 'vln', 'vln']
    for part, n in zip(parts, notes):
        if n is None: continue
        place(T, O[part].note(n, dur, att=att, rel=1.0), at, 0.22 * vel)


# ---------------- 1) MERAK: belgesel merak teması (Re minör, 84 bpm) ----------------
def merak(O):
    bpm = 84; b = 60 / bpm; bars = 16; T = np.zeros((int((bars * 4 * b + 5) * SR), 2))
    # akorlar: kök (bas), arpej notaları, yaylı akor
    prog = [
        (38, [50, 57, 62, 65], [38, 50, 57, 62, 65]),   # Dm
        (34, [46, 53, 58, 62], [34, 46, 53, 62, 65]),   # Bb
        (31, [43, 50, 55, 58], [31, 43, 55, 58, 62]),   # Gm
        (33, [45, 52, 57, 61], [33, 45, 57, 61, 64]),   # A
        (38, [50, 57, 62, 65], [38, 50, 57, 62, 69]),   # Dm
        (41, [53, 57, 60, 65], [41, 53, 60, 65, 69]),   # F
        (36, [48, 55, 60, 64], [36, 48, 55, 64, 67]),   # C
        (33, [45, 52, 57, 61], [33, 45, 57, 61, 64]),   # A
    ] * 2
    arp = [0, 1, 2, 3, 2, 1, 2, 3]  # sekizlik arpej deseni
    for bar, (bass, ar, ch) in enumerate(prog):
        t0 = bar * 4 * b
        for i, k in enumerate(arp):  # piyano ostinatosu
            place(T, O['piano'].note(ar[k] + 12, b * 0.9, layer=1, rel=0.6), t0 + i * b / 2, 0.55 if i % 2 == 0 else 0.42)
        if bar >= 4:  # yaylılar 5. ölçüde girer
            strings_chord(O, T, t0, 4 * b, ch, vel=0.8 if bar < 8 else 1.0)
        else:
            place(T, O['cb'].note(bass + 12, 4 * b, att=0.6, rel=1.0), t0, 0.16)
        if bar >= 8 and bar % 2 == 1:  # merak pizzicato'ları
            for off, n in ((1, ar[3] + 12), (1.5, ar[2] + 12), (3, ar[3] + 14)):
                place(T, O['pizz'].note(n, 0.3, rel=0.2), t0 + off * b, 0.22)
        if bar in (3, 7, 11, 15):  # arp geçişi
            for i, n in enumerate([ar[0] + 12, ar[1] + 12, ar[2] + 12, ar[3] + 12, ar[0] + 24, ar[1] + 24]):
                place(T, O['harp'].note(n, 1.2), t0 + 3 * b + i * 0.09, 0.3)
    # piyano melodisi (özgün), 9-16. ölçüler: (vuruş, nota, süre)
    mel = [(0, 74, 1.5), (1.5, 76, .5), (2, 77, 2), (4, 74, 1), (5, 72, 1), (6, 70, 2),
           (8, 70, 1.5), (9.5, 72, .5), (10, 74, 1), (11, 77, 1), (12, 76, 3), (15, 73, 1),
           (16, 74, 1.5), (17.5, 77, .5), (18, 81, 2), (20, 79, 1), (21, 77, 1), (22, 77, 2),
           (24, 76, 1), (25, 74, 1), (26, 72, 1), (27, 74, 1), (28, 73, 3)]
    for beat, n, d in mel:
        place(T, O['piano'].note(n, d * b, layer=2, rel=0.8), (32 + beat) * b, 0.75)
    # final akoru
    strings_chord(O, T, bars * 4 * b, 4.0, [38, 50, 57, 62, 65], 0.9, att=0.3)
    place(T, O['piano'].note(50, 4, layer=2, rel=1.5), bars * 4 * b, 0.6)
    return hall(T, 2.6, 0.3)


# ---------------- 2) GİZEM: şato / sır (La minör, 64 bpm) ----------------
def gizem(O):
    bpm = 64; b = 60 / bpm; bars = 8; T = np.zeros((int((bars * 4 * b + 6) * SR), 2))
    prog = [([33, 45, 52, None, 76], 45), ([29, 41, 53, None, 77], 41), ([26, 38, 53, None, 74], 38), ([28, 40, 56, None, 76], 40),
            ([33, 45, 52, 72, 76], 45), ([29, 41, 53, 72, 77], 41), ([26, 38, 50, 69, 77], 38), ([28, 40, 52, 68, 71], 40)]
    for bar, (ch, low) in enumerate(prog):
        t0 = bar * 4 * b
        strings_chord(O, T, t0, 4 * b, ch, vel=0.7 + 0.05 * bar, att=1.6)
        for off, n in ((0, low + 24), (1.5, low + 31), (3, low + 36)):  # seyrek arp
            place(T, O['harp'].note(n, 2.0), t0 + off * b, 0.28)
    # piyano: tek tek, gizemli notalar (özgün)
    for beat, n in [(2, 81), (6, 79), (10, 77), (13, 76), (18, 84), (22, 83), (26, 80), (29, 81)]:
        place(T, O['piano'].note(n, 2.5, layer=1, rel=1.5), beat * b, 0.5)
    return hall(T, 3.4, 0.42)


# ---------------- 3) ZAFER: umut / başarı (Fa majör, 96 bpm) ----------------
def zafer(O):
    bpm = 96; b = 60 / bpm; bars = 8; T = np.zeros((int((bars * 4 * b + 6) * SR), 2))
    prog = [([29, 41, 57, 65, 69], [53, 57, 60, 65]), ([28, 40, 55, 64, 67], [52, 55, 60, 64]),
            ([26, 38, 57, 62, 65], [50, 53, 57, 62]), ([34, 46, 58, 62, 65], [46, 53, 58, 62]),
            ([29, 41, 57, 65, 72], [53, 57, 60, 65]), ([36, 48, 55, 64, 67], [48, 55, 60, 64]),
            ([34, 46, 58, 62, 70], [46, 53, 58, 62]), ([36, 48, 55, 64, 72], [48, 52, 55, 60])]
    # açılış arp glissandosu
    for i, n in enumerate([53, 57, 60, 65, 69, 72, 77, 81, 84]):
        place(T, O['harp'].note(n, 1.5), i * 0.07, 0.3)
    for bar, (ch, pch) in enumerate(prog):
        t0 = bar * 4 * b
        strings_chord(O, T, t0, 4 * b, ch, vel=0.85 + 0.03 * bar, att=0.5)
        for q in range(4):  # piyano çeyrek akorlar
            for n in pch:
                place(T, O['piano'].note(n + 12, b * 0.95, layer=2, rel=0.4), t0 + q * b, 0.3 if q else 0.4)
    # keman melodisi (özgün), uzun notalar
    mel = [(0, 77, 2), (2, 79, 2), (4, 81, 3), (7, 79, 1), (8, 77, 2), (10, 74, 2), (12, 74, 2), (14, 76, 2),
           (16, 77, 2), (18, 81, 2), (20, 84, 3), (23, 82, 1), (24, 81, 2), (26, 79, 2), (28, 81, 4)]
    for beat, n, d in mel:
        place(T, O['vln'].note(n, d * b, layer=1, att=0.15, rel=0.6), beat * b, 0.3)
    end = bars * 4 * b
    strings_chord(O, T, end, 4.0, [29, 41, 57, 65, 77], 1.0, att=0.2)
    for n in (53, 57, 60, 65):
        place(T, O['piano'].note(n + 12, 4, layer=3, rel=1.5), end, 0.4)
    return hall(T, 2.8, 0.32)


if __name__ == '__main__':
    V, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    O = orchestra(V)
    for k, ins in O.items(): print(k, len(ins.files), 'kayıt')
    for name, fn in (('merak', merak), ('gizem', gizem), ('zafer', zafer)):
        x = fn(O); save(os.path.join(out, f'{name}.wav'), x); print(name, round(len(x) / SR, 1), 'sn')
