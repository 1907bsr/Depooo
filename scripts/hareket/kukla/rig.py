"""Kukla iskeleti: katmanlar + eklem dönüşleri (ileri kinematik) + PIL ile birleştirme."""
import json, math, numpy as np
from PIL import Image

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
