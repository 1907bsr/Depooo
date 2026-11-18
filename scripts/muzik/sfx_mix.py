"""Efektleri zaman çizelgesine yerleştirir.
Kullanım: python scripts/muzik/sfx_mix.py cikis.wav SURE efekt@saniye[@kazanc] ...
Efektler medya/efekt/<ad>.wav dosyalarından okunur.
"""
import sys, wave, numpy as np
SR = 44100
def read(p):
    w = wave.open(p); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').reshape(-1, w.getnchannels()) / 32768; w.close(); return x
out, dur = sys.argv[1], float(sys.argv[2]); T = np.zeros((int(dur * SR), 2))
for spec in sys.argv[3:]:
    parts = spec.split('@'); name, at = parts[0], float(parts[1]); g = float(parts[2]) if len(parts) > 2 else 1.0
    x = read(f'medya/efekt/{name}.wav'); i = int(at * SR); j = min(len(T), i + len(x)); T[i:j] += x[:j - i] * g
T = np.clip(T, -1, 1)
w = wave.open(out, 'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((T * 32767).astype('<i2').tobytes()); w.close()
