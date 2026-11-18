"""Telefon kaydını otomatik temizler: hatalı/tekrar okunan cümleleri ve yarım kalan başlangıçları
bulup keser, uzun duraklamaları kısaltır. Yazıya dökme kullanmaz; aynı cümlenin tekrarlarını
ses benzerliğiyle (MFCC + DTW) bulur.

Kullanım: python scripts/ses/temizle.py <giris_ses> <cikis_klasoru> [--kes 3,7] [--koru 5]
Çıktı: kesilmis.wav, rapor.txt
"""
import sys, os, subprocess, wave
import numpy as np

SR_A = 16000; SR_O = 48000


def load(p, sr):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).copy()


def segment(x, sr=SR_A):
    h = sr // 100
    db = 20 * np.log10(np.sqrt((x[:len(x) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-9)
    db = np.convolve(db, np.ones(5) / 5, 'same')
    floor, peak = np.percentile(db, 10), np.percentile(db, 95)
    thr = floor + 0.35 * (peak - floor); sp = db > thr
    segs = []; s = None
    for i, v in enumerate(np.append(sp, False)):
        if v and s is None: s = i
        if not v and s is not None:
            segs.append([s / 100, i / 100]); s = None
    m = []
    for a, b in segs:
        if m and a - m[-1][1] < 0.18: m[-1][1] = b
        else: m.append([a, b])
    return [(a, b) for a, b in m if b - a > 0.12], floor, peak


def _fb(n=26, nfft=512, sr=SR_A):
    mel = lambda f: 2595 * np.log10(1 + f / 700); imel = lambda m: 700 * (10 ** (m / 2595) - 1)
    pts = imel(np.linspace(mel(80), mel(7000), n + 2)); bins = np.floor((nfft + 1) * pts / sr).astype(int)
    fb = np.zeros((n, nfft // 2 + 1))
    for i in range(1, n + 1):
        for k in range(bins[i - 1], bins[i]): fb[i - 1, k] = (k - bins[i - 1]) / max(1, bins[i] - bins[i - 1])
        for k in range(bins[i], bins[i + 1]): fb[i - 1, k] = (bins[i + 1] - k) / max(1, bins[i + 1] - bins[i])
    return fb
FB = _fb(); DCT = np.cos(np.pi / 26 * (np.arange(26)[None, :] + .5) * np.arange(1, 14)[:, None])


def mfcc(y):
    if len(y) < 800: y = np.pad(y, (0, 800 - len(y)))
    fr = np.lib.stride_tricks.sliding_window_view(y, 400)[::160] * np.hamming(400)
    c = np.log((np.abs(np.fft.rfft(fr, 512)) ** 2) @ FB.T + 1e-8) @ DCT.T
    return (c - c.mean(0)) / (c.std(0) + 1e-6)


def dtw(A, B):
    n, m = len(A), len(B); C = np.sqrt(((A[:, None, :] - B[None, :, :]) ** 2).sum(-1))
    D = np.full((n + 1, m + 1), np.inf); D[0, 0] = 0
    for i in range(1, n + 1):
        for j in range(1, m + 1): D[i, j] = C[i - 1, j - 1] + min(D[i - 1, j], D[i, j - 1], D[i - 1, j - 1])
    return D[n, m] / (n + m)


def main():
    inp, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
    extra_cut = set(); keep_force = set()
    if '--kes' in sys.argv: extra_cut = {int(v) for v in sys.argv[sys.argv.index('--kes') + 1].split(',')}
    if '--koru' in sys.argv: keep_force = {int(v) for v in sys.argv[sys.argv.index('--koru') + 1].split(',')}
    xa = load(inp, SR_A); segs, floor, peak = segment(xa)
    F = [mfcc(xa[int(a * SR_A):int(b * SR_A)]) for a, b in segs]
    rep = [f'Gürültü {floor:.1f} dB, konuşma {peak:.1f} dB, {len(segs)} parça']
    # 1) tam tekrarlar
    pairs = []
    for i in range(len(segs)):
        for j in range(i + 1, min(len(segs), i + 5)):
            di, dj = segs[i][1] - segs[i][0], segs[j][1] - segs[j][0]
            if min(di, dj) < 0.3 or max(di, dj) / min(di, dj) > 1.8: continue
            pairs.append((dtw(F[i], F[j]), i, j))
    med = np.median([p[0] for p in pairs]) if pairs else 9
    cut = set()
    for d, i, j in sorted(pairs):
        if d < 0.74 * med: cut.add(i); rep.append(f'Tekrar: parça {i} ({segs[i][0]:.1f} sn) = parça {j} ({segs[j][0]:.1f} sn), benzerlik {d:.2f} (medyan {med:.2f}) -> {i} kesildi')
    # 2) yarım kalan başlangıçlar: kısa parça, sonraki parçanın başıyla aynı
    for i, (a, b) in enumerate(segs):
        d = b - a
        if d > 1.3 or i in cut: continue
        for j in range(i + 1, min(len(segs), i + 4)):
            a2, b2 = segs[j]
            if b2 - a2 < d * 0.9: continue
            s = dtw(F[i], mfcc(xa[int(a2 * SR_A):int((a2 + d * 1.1) * SR_A)]))
            if s < 0.78 * med:
                cut.add(i); rep.append(f'Yarım başlangıç: parça {i} ({a:.1f} sn) ~ parça {j} başı, {s:.2f} -> kesildi'); break
    cut = (cut | extra_cut) - keep_force
    # 3) birleştir
    xo = load(inp, SR_O); keep = [(i, a, b) for i, (a, b) in enumerate(segs) if i not in cut]
    parts = [xo[int(max(0, keep[0][1] - 0.3) * SR_O):int(keep[0][1] * SR_O)]]
    for n, (i, a, b) in enumerate(keep):
        a0, b0 = max(0, a - 0.05), b + 0.08
        s = xo[int(a0 * SR_O):int(b0 * SR_O)].copy(); f = int(.01 * SR_O); s[:f] *= np.linspace(0, 1, f); s[-f:] *= np.linspace(1, 0, f)
        parts.append(s)
        if n + 1 < len(keep):
            gap = keep[n + 1][1] - b
            if any(k in cut for k in range(i + 1, keep[n + 1][0])): gap = 0.7
            g = min(max(gap - 0.13, 0.15), 0.75); gs = xo[int(b0 * SR_O):int(b0 * SR_O) + int(g * SR_O)]
            parts.append(np.pad(gs, (0, max(0, int(g * SR_O) - len(gs)))))
    y = np.concatenate(parts)
    with wave.open(os.path.join(out, 'kesilmis.wav'), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR_O); w.writeframes((np.clip(y, -1, 1) * 32767).astype('<i2').tobytes())
    rep.append(f'Süre: {len(xo) / SR_O:.1f} sn -> {len(y) / SR_O:.1f} sn; kesilen parçalar: {sorted(cut)}')
    rep.append('Parçalar: ' + ' '.join(f'{i}:{a:.1f}-{b:.1f}' for i, (a, b) in enumerate(segs)))
    open(os.path.join(out, 'rapor.txt'), 'w').write('\n'.join(rep)); print('\n'.join(rep))


if __name__ == '__main__':
    main()
