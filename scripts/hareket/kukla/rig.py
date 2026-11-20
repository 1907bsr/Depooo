"""Kukla iskeleti: katmanlar + eklem dönüşleri (ileri kinematik) + PIL ile birleştirme."""
import json, math, numpy as np
from PIL import Image



def _smooth(x):
    x = np.clip(x, 0.0, 1.0); return x * x * (3 - 2 * x)


def _bilinear_premult(arr, px, py):
    """arr: (h,w,4) önceden çarpılmış; px,py: dizi koordinatı (piksel merkezi = tam sayı). Dışarısı şeffaf."""
    h, w = arr.shape[:2]
    pad = np.zeros((h + 2, w + 2, 4), np.float32); pad[1:-1, 1:-1] = arr
    x = px + 1.0; y = py + 1.0
    x0 = np.floor(x).astype(np.int32); y0 = np.floor(y).astype(np.int32)
    fx = (x - x0)[..., None]; fy = (y - y0)[..., None]
    x0c = np.clip(x0, 0, w + 1); x1c = np.clip(x0 + 1, 0, w + 1); y0c = np.clip(y0, 0, h + 1); y1c = np.clip(y0 + 1, 0, h + 1)
    return (pad[y0c, x0c] * (1 - fx) + pad[y0c, x1c] * fx) * (1 - fy) + (pad[y1c, x0c] * (1 - fx) + pad[y1c, x1c] * fx) * fy


class Rig:
    def __init__(self, dir='katman', plate='plaka.png'):
        self.meta = json.load(open(f'{dir}/meta.json'))
        self.J = self.meta['J']
        self.plate = Image.open(plate).convert('RGBA')
        self.W, self.H = self.plate.size
        self.layers = {}
        for n, m in self.meta['layers'].items():
            self.layers[n] = (Image.open(f'{dir}/{n}.png').convert('RGBA'), m['x0'], m['y0'])
        self.order = ['handL', 'foreL', 'upperL', 'handR', 'foreR', 'upperR', 'torso', 'head']
        self.bend_len = 70.0      # omuzdan itibaren bu kadar piksel boyunca üst kol yumuşakça bükülür (koltuk altı gövdeye bağlı kalır)

    @staticmethod
    def T(x, y): return np.array([[1, 0, x], [0, 1, y], [0, 0, 1]], np.float64)

    @staticmethod
    def R(deg):
        t = math.radians(deg); c, s = math.cos(t), math.sin(t)
        return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], np.float64)

    def rot(self, piv, deg, dx=0.0, dy=0.0):
        return self.T(dx, dy) @ self.T(*piv) @ self.R(deg) @ self.T(-piv[0], -piv[1])

    def world(self, pose):
        """pose: dict -> açılar (derece) ve kök kayması. Dönüş: katman adı -> 3x3 dünya matrisi"""
        J = self.J
        root = self.rot(J['waist'], pose.get('root_rot', 0.0), pose.get('root_dx', 0.0), pose.get('root_dy', 0.0))
        torso = root @ self.rot(J['waist'], pose.get('torso_rot', 0.0), 0.0, pose.get('torso_dy', 0.0))
        w = {'torso': torso}
        w['head'] = torso @ self.rot(J['neck'], pose.get('head_rot', 0.0), pose.get('head_dx', 0.0), pose.get('head_dy', 0.0))
        for s in 'LR':
            up = torso @ self.rot(J[s]['S'], pose.get('upper' + s, 0.0))
            fo = up @ self.rot(J[s]['E'], pose.get('fore' + s, 0.0))
            ha = fo @ self.rot(J[s]['W'], pose.get('hand' + s, 0.0))
            w['upper' + s], w['fore' + s], w['hand' + s] = up, fo, ha
        return w

    def render(self, pose, layer_images=None):
        """layer_images: isteğe bağlı {ad: (PIL RGBA, x0, y0)} (örn. yüz hareketli baş)"""
        canvas = self.plate.copy()
        w = self.world(pose)
        for n in self.order:
            img, x0, y0 = (layer_images or {}).get(n) or self.layers[n]
            M = w[n]
            if n in ('upperL', 'upperR') and self.bend_len > 0:
                self._render_bent(canvas, n, img, x0, y0, w['torso'], pose.get(n, 0.0))
                continue
            cw, ch = img.size
            corners = np.array([[x0, y0, 1], [x0 + cw, y0, 1], [x0, y0 + ch, 1], [x0 + cw, y0 + ch, 1]], np.float64).T
            out = M @ corners
            ox0, oy0 = int(math.floor(out[0].min())) - 1, int(math.floor(out[1].min())) - 1
            ox1, oy1 = int(math.ceil(out[0].max())) + 1, int(math.ceil(out[1].max())) + 1
            ox0, oy0, ox1, oy1 = max(ox0, 0), max(oy0, 0), min(ox1, self.W), min(oy1, self.H)
            if ox1 <= ox0 or oy1 <= oy0: continue
            Mi = np.linalg.inv(M)
            a, b = Mi[0, 0], Mi[0, 1]; c = Mi[0, 0] * ox0 + Mi[0, 1] * oy0 + Mi[0, 2] - x0
            d, e = Mi[1, 0], Mi[1, 1]; f = Mi[1, 0] * ox0 + Mi[1, 1] * oy0 + Mi[1, 2] - y0
            tile = img.transform((ox1 - ox0, oy1 - oy0), Image.AFFINE, (a, b, c, d, e, f), resample=Image.BICUBIC)
            canvas.alpha_composite(tile, (ox0, oy0))
        return canvas.convert('RGB')

    def _render_bent(self, canvas, n, img, x0, y0, M_torso, theta_deg):
        """Üst kol: omuz (S) sabit, S'den aşağı doğru dönme açısı 0'dan theta'ya yumuşakça artar (bükme). Uzak uç = sert dönme (çocuk parçalarla uyumlu)."""
        side = n[-1]; S = np.array(self.J[side]['S'], np.float64); E = np.array(self.J[side]['E'], np.float64)
        u = (E - S) / np.linalg.norm(E - S)
        th = math.radians(theta_deg); L = self.bend_len
        cw, ch = img.size
        # çıktı bölgesi: yerleşimin iki ucu (0 ve tam açı) birleşimi
        pts = []
        for ang in (0.0, theta_deg):
            Mr = M_torso @ self.rot(self.J[side]['S'], ang)
            c = np.array([[x0, y0, 1], [x0 + cw, y0, 1], [x0, y0 + ch, 1], [x0 + cw, y0 + ch, 1]], np.float64).T
            pts.append(Mr @ c)
        P = np.concatenate(pts, axis=1)
        ox0, oy0 = max(int(math.floor(P[0].min())) - 3, 0), max(int(math.floor(P[1].min())) - 3, 0)
        ox1, oy1 = min(int(math.ceil(P[0].max())) + 3, self.W), min(int(math.ceil(P[1].max())) + 3, self.H)
        if ox1 <= ox0 or oy1 <= oy0: return
        jj, ii = np.mgrid[oy0:oy1, ox0:ox1]
        qx = ii + 0.5; qy = jj + 0.5
        Mi = np.linalg.inv(M_torso)
        q0x = Mi[0, 0] * qx + Mi[0, 1] * qy + Mi[0, 2]; q0y = Mi[1, 0] * qx + Mi[1, 1] * qy + Mi[1, 2]
        rx, ry = q0x - S[0], q0y - S[1]
        px, py = q0x.copy(), q0y.copy()
        for _ in range(10):
            t = (px - S[0]) * u[0] + (py - S[1]) * u[1]
            phi = th * _smooth(t / L)
            c, s_ = np.cos(phi), np.sin(phi)
            px = S[0] + c * rx + s_ * ry          # R(-phi) @ (q0 - S)
            py = S[1] - s_ * rx + c * ry
        arr = np.asarray(img).astype(np.float32)
        al = arr[..., 3:4] / 255.0
        pm = np.concatenate([arr[..., :3] * al, al], axis=-1)
        samp = _bilinear_premult(pm, px - x0 - 0.5, py - y0 - 0.5)
        a = np.clip(samp[..., 3], 0, 1)
        rgb = np.where(a[..., None] > 1e-4, samp[..., :3] / np.maximum(a[..., None], 1e-4), 0)
        tile = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8), 'RGBA')
        canvas.alpha_composite(tile, (ox0, oy0))
