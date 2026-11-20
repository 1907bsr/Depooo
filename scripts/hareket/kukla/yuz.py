"""Baş katmanı için yüz hareketleri: göz kırpma (temiz kapak), bakış, kaş, gülümseme, saç bukleleri.
Kaynak koordinatlarında (687x1024 resim) tanımlı noktalar; baş katmanı kırpıntısı üzerinde çalışır."""
import math, numpy as np
from PIL import Image, ImageDraw, ImageFilter

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
MOUTH_C = 338.5
PIV_CL = (298.0, 150.0); PIV_CR = (398.0, 158.0)


def curve(pts):
    p = np.array(pts, np.float32); return lambda x: np.interp(x, p[:, 0], p[:, 1])


class Yuz:
    def __init__(self, rgba, ox, oy, pad=14):
        arr = np.asarray(rgba).astype(np.float32); h, w = arr.shape[:2]
        big = np.zeros((h + 2 * pad, w + 2 * pad, 4), np.float32); big[pad:pad + h, pad:pad + w] = arr
        self.rgb = big[..., :3].copy(); self.al = big[..., 3] / 255.0
        self.H, self.W = self.al.shape; self.ox, self.oy = ox - pad, oy - pad
        self.Xs, self.Ys = np.meshgrid(np.arange(self.W, dtype=np.float32) + self.ox, np.arange(self.H, dtype=np.float32) + self.oy)
        self._masks(); self.eyes = [self._prep_eye(e) for e in EYE_DEF]

    # ---- maskeler (kaynak koordinatı → yerel)
    def _mk(self, fn, blur):
        m = Image.new('L', (self.W, self.H), 0); d = ImageDraw.Draw(m)
        fn(d, lambda x, y: ((x - self.ox), (y - self.oy)))
        return np.asarray(m.filter(ImageFilter.GaussianBlur(blur))).astype(np.float32) / 255.0

    def _masks(self):
        def ell(d, T, cx, cy, rx, ry):
            x0, y0 = T(cx - rx, cy - ry); x1, y1 = T(cx + rx, cy + ry); d.ellipse((x0, y0, x1, y1), fill=255)
        self.iris = [self._mk(lambda d, T, c=c: ell(d, T, c[0], c[1], 8, 7), 2.0) for c in [(319.5, 141.5), (359.0, 141.0)]]
        self.mouth = self._mk(lambda d, T: ell(d, T, MOUTH_C, 179, 20, 9), 2.5)
        self.brow = [self._mk(lambda d, T, c=c: ell(d, T, c[0], c[1], 16, 6), 2.5) for c in [(315, 128.5), (358, 127.5)]]
        skin = ((self.rgb[..., 0] > self.rgb[..., 2] + 22) & (self.rgb.mean(axis=2) > 150) & (self.al > 0.5)).astype(np.float32)
        skin = np.asarray(Image.fromarray((skin * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(3.0))).astype(np.float32) / 255.0
        self.curlL = self._mk(lambda d, T: ell(d, T, 295, 184, 25, 44), 5) * (1 - skin)
        self.curlR = self._mk(lambda d, T: ell(d, T, 403, 191, 23, 45), 5) * (1 - skin)

    # ---- göz kırpma hazırlığı
    def _prep_eye(self, ed):
        x0, y0, w, h = ed['win']; x0l, y0l = x0 - self.ox, y0 - self.oy
        poly = ed['top'] + ed['bot'][::-1]
        cx = sum(p[0] for p in poly) / len(poly); cy = sum(p[1] for p in poly) / len(poly)
        big = []
        for (px, py) in poly:
            d = math.hypot(px - cx, py - cy) or 1.0; big.append((px + (px - cx) / d * 1.4, py + (py - cy) / d * 1.4))
        S = 8; m = Image.new('L', (w * S, h * S), 0)
        ImageDraw.Draw(m).polygon([((px - x0) * S, (py - y0) * S) for px, py in big], fill=255)
        E = np.asarray(m.filter(ImageFilter.GaussianBlur(0.5 * S)).resize((w, h), Image.BOX)).astype(np.float32) / 255.0
        win = self.rgb[y0l:y0l + h, x0l:x0l + w]
        ring = win[(E < 0.01)]; skin_px = ring[(ring[:, 0] > ring[:, 2] + 25) & (ring.mean(axis=1) > 170)]
        skin = np.median(skin_px, axis=0)
        ink = np.linalg.norm(win - skin, axis=2) > 24
        hole = np.asarray(Image.fromarray(((E > 0.01) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
        unknown = hole | ink; out = win.copy(); out[unknown] = skin
        for _ in range(700):
            p = np.pad(out, ((1, 1), (1, 1), (0, 0)), mode='edge')
            avg = (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) / 4.0
            out = np.where(unknown[..., None], avg, out)
        xc = (x0 + np.arange(w) + 0.5).astype(np.float32); yc = (y0 + np.arange(h) + 0.5).astype(np.float32)[:, None]
        xs = np.array([p[0] for p in ed['closed']]); xa, xb = xs.min(), xs.max()
        s = (xc - (xa if ed['outer'] == 'left' else xb)) / ((xb - xa) * (1 if ed['outer'] == 'left' else -1))
        sm = np.clip((s - 0.45) / 0.55, 0, 1); sm = sm * sm * (3 - 2 * sm)
        taper = np.clip((s + 0.02) / 0.10, 0, 1) * np.clip((1.04 - s) / 0.10, 0, 1)
        lw = (2.7 - 1.4 * sm) * taper
        return dict(x0l=x0l, y0l=y0l, w=w, h=h, E=E, clean=out, xc=xc, yc=yc, ft=curve(ed['top']), fb=curve(ed['bot']), fc=curve(ed['closed']),
                    lw=lw.astype(np.float32), inx=((xc >= xa - 0.4) & (xc <= xb + 0.4)).astype(np.float32))

    def _blink(self, src, a):
        if a < 0.02: return src
        out = src.copy(); e_up = a; e_lo = a ** 1.7
        for E in self.eyes:
            x0l, y0l, w, h = E['x0l'], E['y0l'], E['w'], E['h']; xc, yc = E['xc'], E['yc']
            yt, yb, yk = E['ft'](xc), E['fb'](xc), E['fc'](xc)
            yl = yt + e_up * (yk - yt); ylo = yb + e_lo * (yk - yb)
            cov = np.maximum(np.clip(yl[None, :] - yc + 0.5, 0, 1), np.clip(yc - ylo[None, :] + 0.5, 0, 1)) * E['E']
            win = src[y0l:y0l + h, x0l:x0l + w]
            mix = win * (1 - cov[..., None]) + E['clean'] * cov[..., None]
            fade = min(1.0, e_up / 0.08)
            up = np.clip(E['lw'][None, :] / 2 + 0.5 - np.abs(yc - yl[None, :]), 0, 1) * E['inx'][None, :] * fade
            lo = np.clip(0.55 - np.abs(yc - ylo[None, :]), 0, 1) * E['inx'][None, :] * (0.5 * (1 - e_up) * min(1.0, e_lo / 0.1)) * (E['lw'][None, :] > 0.5)
            mix = mix * (1 - up[..., None]) + LASH * up[..., None]
            mix = mix * (1 - lo[..., None]) + LASH * lo[..., None]
            out[y0l:y0l + h, x0l:x0l + w] = mix
        return out

    @staticmethod
    def _rot(X, Y, piv, th):
        c, s = math.cos(th), math.sin(th); rx, ry = X - piv[0], Y - piv[1]
        return (piv[0] + c * rx - s * ry - X, piv[1] + s * rx + c * ry - Y)

    def _bilin(self, f, px, py):
        px = np.clip(px, 0, self.W - 1.001); py = np.clip(py, 0, self.H - 1.001)
        x0 = px.astype(np.int32); y0 = py.astype(np.int32); fx = px - x0; fy = py - y0
        return (f[y0, x0] * (1 - fx) + f[y0, x0 + 1] * fx) * (1 - fy) + (f[y0 + 1, x0] * (1 - fx) + f[y0 + 1, x0 + 1] * fx) * fy

    def render(self, look=0.0, smile=0.0, brow=0.0, blink=0.0, curlL=0.0, curlR=0.0):
        """Dönüş: (PIL RGBA, ox, oy)"""
        rgb = self._blink(self.rgb, blink)
        X, Y = self.Xs, self.Ys
        dx = np.zeros_like(X); dy = np.zeros_like(X)
        cx, cy = self._rot(X, Y, PIV_CL, math.radians(curlL)); dx += self.curlL * cx; dy += self.curlL * cy
        cx, cy = self._rot(X, Y, PIV_CR, math.radians(curlR)); dx += self.curlR * cx; dy += self.curlR * cy
        for k in range(2): dx += self.iris[k] * (3.0 * look)
        wx = np.clip(((X - MOUTH_C) / 14.5) ** 2, 0, 1.35)
        dy += self.mouth * (-3.0 * smile * wx); dx += self.mouth * (1.2 * smile * np.clip((X - MOUTH_C) / 14.5, -1.2, 1.2))
        for k in range(2): dy += self.brow[k] * (-1.8 * brow)
        px, py = X - self.ox, Y - self.oy          # yerel piksel koordinatı
        gx, gy = np.meshgrid(np.arange(self.W, dtype=np.float32), np.arange(self.H, dtype=np.float32))
        bx, by = gx.copy(), gy.copy()
        for _ in range(4):
            bx, by = gx - self._bilin(dx, bx, by), gy - self._bilin(dy, bx, by)
        pm = np.dstack([rgb * self.al[..., None], self.al])           # önceden çarpılmış
        out = np.stack([self._bilin(pm[..., c], bx, by) for c in range(4)], axis=-1)
        al = np.clip(out[..., 3], 0, 1)
        col = np.where(al[..., None] > 1e-4, out[..., :3] / np.maximum(al[..., None], 1e-4), 0)
        rgba = np.dstack([np.clip(col, 0, 255), al * 255]).astype(np.uint8)
        return Image.fromarray(rgba, 'RGBA'), self.ox, self.oy
