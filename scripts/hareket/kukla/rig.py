"""Kukla iskeleti: katmanlar + eklem dönüşleri (ileri kinematik) + PIL ile birleştirme."""
import json, math, numpy as np
from PIL import Image, ImageDraw, ImageFilter



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
        self.order = ['foreL', 'upperL', 'foreR', 'upperR', 'torso', 'head']
        self.alpha = {n: (np.asarray(im)[..., 3] > 90) for n, (im, _, _) in self.layers.items()}
        self.armpit = True        # kol kalkınca koltuk altındaki ince boşluğu yuvarlak, derili bir kapanışla doldur
        self.armpit_rho = 9.0     # yuvarlatma yarıçapı (px): bundan ince boşluklar dolar, uç yuvarlanır
        self.armpit_line = 2.4    # kapanış çizgisinin kalınlığı (px)
        self._rest_alpha = None
        self.wrist_len = 22.0       # bilek: ±22 px boyunca yumuşak büküm
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

    def _draw(self, canvas, names, w, pose, layer_images=None):
        for n in names:
            img, x0, y0 = (layer_images or {}).get(n) or self.layers[n]
            M = w[n]
            if n in ('upperL', 'upperR') and self.bend_len > 0:
                self._render_bent(canvas, img, x0, y0, w['torso'], self.J[n[-1]]['S'], self._axis(n[-1], 'upper'), pose.get(n, 0.0), 0.0, self.bend_len)
                self._elbow_arc(canvas, n[-1], w, pose)
                continue
            if n in ('foreL', 'foreR'):
                self._render_bent(canvas, img, x0, y0, w[n], self.J[n[-1]]['W'], self._axis(n[-1], 'fore'), pose.get('hand' + n[-1], 0.0), -self.wrist_len, self.wrist_len)
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


    def render(self, pose, layer_images=None):
        """layer_images: isteğe bağlı {ad: (PIL RGBA, x0, y0)} (örn. yüz hareketli baş)"""
        canvas = self.plate.copy()
        w = self.world(pose)
        fills = self._armpit_fills(pose, w) if self.armpit else []
        for f in fills: self._paste_fill(canvas, f)                       # gövde yan derisi: kolların ALTINDA
        self._draw(canvas, ['foreL', 'upperL', 'foreR', 'upperR'], w, pose)
        for f in fills: self._paste_outline(canvas, f)                    # koltuk altı yuvarlak kapanış çizgisi
        self._draw(canvas, ['torso', 'head'], w, pose, layer_images)
        return canvas.convert('RGB')

    OUTLINE = (22, 6, 4)

    def _covered(self, name, M, q, cut=None):
        """Dünya noktası q, 'name' katmanının görünür alfasında mı? cut=(merkez, normal, işaret): kesik çizgisinin yalnızca bir tarafı (gövde; kapak/kopya sayılmaz)."""
        x0, y0 = self.layers[name][1], self.layers[name][2]
        Mi = np.linalg.inv(M); p = Mi @ np.array([q[0], q[1], 1.0])
        if cut is not None:
            c, nrm, sg = cut
            t = (p[0] - c[0]) * nrm[0] + (p[1] - c[1]) * nrm[1]
            if (t >= 0) != (sg > 0): return False
        xi, yi = int(math.floor(p[0] - x0)), int(math.floor(p[1] - y0))
        A = self.alpha[name]
        return 0 <= yi < A.shape[0] and 0 <= xi < A.shape[1] and bool(A[yi, xi])

    def _joint_outline(self, canvas, parent, child, M_parent, M_child, center_rest, axis_rest, radius, width, cut_normal):
        """Yuvarlak eklem kapağının, çocuk parça ya da ebeveynin kendi gövdesi tarafından ÖRTÜLMEYEN (açıkta kalan) kenarına kontur çizer."""
        c = M_parent @ np.array([center_rest[0], center_rest[1], 1.0]); cw = (c[0], c[1])
        d = M_parent[:2, :2] @ axis_rest
        base = math.degrees(math.atan2(d[1], d[0]))
        step = 2.0; angs = np.arange(-180.0, 180.0 + step, step)
        exposed = []
        for a in angs:
            t = math.radians(base + a)
            q = (cw[0] + (radius - 1.2) * math.cos(t), cw[1] + (radius - 1.2) * math.sin(t))
            cutp = (center_rest, cut_normal, -1); cutc = (center_rest, cut_normal, +1)
            exposed.append(not (self._covered(child, M_child, q, cutc) or self._covered(parent, M_parent, q, cutp)))
        runs = []; cur = None
        for a, e in zip(angs, exposed):
            if e and cur is None: cur = [a, a]
            elif e: cur[1] = a
            elif cur is not None: runs.append(cur); cur = None
        if cur is not None: runs.append(cur)
        runs = [r for r in runs if r[1] - r[0] >= 10.0]
        if not runs: return
        S = 4; R = radius; pad = int(math.ceil(R + width + 4)); size = 2 * pad
        tile = Image.new('RGBA', (size * S, size * S), (0, 0, 0, 0)); dr = ImageDraw.Draw(tile)
        cx = cy = pad * S
        for r in runs:
            a0, a1 = r[0] - 3.0, r[1] + 3.0
            dr.arc((cx - R * S, cy - R * S, cx + R * S, cy + R * S), base + a0, base + a1, fill=self.OUTLINE + (255,), width=int(round(width * S)))
        ox = cw[0] - pad; oy = cw[1] - pad
        ix, iy = int(math.floor(ox)), int(math.floor(oy)); fx, fy = ox - ix, oy - iy
        tile = tile.transform(tile.size, Image.AFFINE, (1, 0, -fx * S, 0, 1, -fy * S), resample=Image.BILINEAR)
        tile = tile.resize((size, size), Image.BOX)
        canvas.alpha_composite(tile, (ix, iy))

    def _elbow_arc(self, canvas, side, w, pose):
        J = self.J[side]; E = np.array(J['E'], np.float64); S_ = np.array(J['S'], np.float64)
        d0 = (E - S_) / np.linalg.norm(E - S_)
        Wr = np.array(J['W'], np.float64); T_ = np.array(J['T'], np.float64)
        un = lambda v: v / np.linalg.norm(v)
        ue = un(un(E - S_) + un(Wr - E))
        self._joint_outline(canvas, 'upper' + side, 'fore' + side, w['upper' + side], w['fore' + side], E, d0, self.meta['RE'] + 2.0, 2.7, ue)

    def _axis(self, side, which):
        J = self.J[side]; S_ = np.array(J['S'], np.float64); E = np.array(J['E'], np.float64); Wr = np.array(J['W'], np.float64)
        v = (E - S_) if which == 'upper' else (Wr - E)
        return v / np.linalg.norm(v)

    def _render_bent(self, canvas, img, x0, y0, M_base, S, u, theta_deg, t0, t1):
        """Yumuşak bükme: S noktası etrafında, eksen boyunca t0'dan t1'e dönme açısı 0'dan theta'ya yumuşakça artar. Sonra M_base uygulanır."""
        S = np.array(S, np.float64); u = np.array(u, np.float64)
        th = math.radians(theta_deg)
        cw, ch = img.size
        pts = []
        for ang in (0.0, theta_deg):
            Mr = M_base @ self.rot(tuple(S), ang)
            c = np.array([[x0, y0, 1], [x0 + cw, y0, 1], [x0, y0 + ch, 1], [x0 + cw, y0 + ch, 1]], np.float64).T
            pts.append(Mr @ c)
        P = np.concatenate(pts, axis=1)
        ox0, oy0 = max(int(math.floor(P[0].min())) - 3, 0), max(int(math.floor(P[1].min())) - 3, 0)
        ox1, oy1 = min(int(math.ceil(P[0].max())) + 3, self.W), min(int(math.ceil(P[1].max())) + 3, self.H)
        if ox1 <= ox0 or oy1 <= oy0: return
        jj, ii = np.mgrid[oy0:oy1, ox0:ox1]
        qx = ii + 0.5; qy = jj + 0.5
        Mi = np.linalg.inv(M_base)
        q0x = Mi[0, 0] * qx + Mi[0, 1] * qy + Mi[0, 2]; q0y = Mi[1, 0] * qx + Mi[1, 1] * qy + Mi[1, 2]
        rx, ry = q0x - S[0], q0y - S[1]
        px, py = q0x.copy(), q0y.copy()
        for _ in range(10):
            t = (px - S[0]) * u[0] + (py - S[1]) * u[1]
            phi = th * _smooth((t - t0) / (t1 - t0))
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

    # ------------------------------------------------------------------ koltuk altı
    # Kol yana kalkınca kol ile gövde arasında omuz askısına kadar uzanan ince, sivri bir boşluk açılır ("yarım koltuk altı").
    # Çözüm: boşluğun ince ucunu (iki kenar arası < 2*rho) gövde yan derisiyle doldur, ucu yarıçapı rho olan yuvarlak bir yayla kapat.
    # Boşluk morfolojik "açma" (aşındır + genişlet) ile bulunur; rho kol kalkışına göre 0'dan tam değere yumuşakça artar (dinlenmede etki yok).
    _disk_cache = {}

    def _disk(self, r):
        key = round(float(r) * 2) / 2
        if key not in self._disk_cache:
            n = int(math.ceil(key))
            ys, xs = np.mgrid[-n:n + 1, -n:n + 1]
            m = (xs * xs + ys * ys) <= key * key + 0.25
            self._disk_cache[key] = list(zip(ys[m].tolist(), xs[m].tolist()))
        return self._disk_cache[key]

    @staticmethod
    def _dilate(mask, offs):
        H, W = mask.shape; out = np.zeros_like(mask)
        for dy, dx in offs:
            y0, y1 = max(0, dy), H + min(0, dy); x0, x1 = max(0, dx), W + min(0, dx)
            if y1 > y0 and x1 > x0: out[y0:y1, x0:x1] |= mask[y0 - dy:y1 - dy, x0 - dx:x1 - dx]
        return out

    @staticmethod
    def _components(mask, min_area):
        """4-komşuluklu bağlı bileşenler; min_area'dan küçükleri atar."""
        H, W = mask.shape; seen = np.zeros_like(mask); keep = np.zeros_like(mask)
        for y, x in zip(*np.nonzero(mask)):
            if seen[y, x]: continue
            stack = [(y, x)]; seen[y, x] = True; comp = []
            while stack:
                cy, cx = stack.pop(); comp.append((cy, cx))
                for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                    if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True; stack.append((ny, nx))
            if len(comp) >= min_area:
                for cy, cx in comp: keep[cy, cx] = True
        return keep

    def _alpha_of(self, names, w, pose):
        clear = Image.new('RGBA', (self.W, self.H), (0, 0, 0, 0))
        self._draw(clear, names, w, pose)
        return np.asarray(clear)[..., 3].astype(np.float32) / 255.0

    def _armpit_window(self, side):
        S = self.J[side]['S']
        return (int(S[0] - 80), int(S[1] - 4), int(S[0] + 25), int(S[1] + 150)) if side == 'L' else (int(S[0] - 25), int(S[1] - 4), int(S[0] + 80), int(S[1] + 150))

    def _skin_of(self, side):
        img = np.asarray(self.layers['upper' + side][0]).astype(np.float32)
        m = (img[..., 3] > 250) & (img[..., 0] > img[..., 2] + 25) & (img[..., :3].mean(-1) > 170)
        return np.median(img[..., :3][m], axis=0)

    def _fit_arc(self, F, air, rho):
        # air: F'ye komşu olabilecek havanın 'açılmış' (yuvarlatılmış) hali
        """F'nin havaya bakan kenarına (yuvarlak uç) daire uydur: (merkez, yarıçap, başlangıç°, bitiş°) ya da None."""
        adj = np.zeros_like(F)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            sh = np.zeros_like(F)
            H, W = F.shape
            y0, y1 = max(0, dy), H + min(0, dy); x0, x1 = max(0, dx), W + min(0, dx)
            sh[y0:y1, x0:x1] = F[y0 - dy:y1 - dy, x0 - dx:x1 - dx]
            adj |= sh
        P = np.argwhere(air & adj)
        if len(P) < 6: return None
        pts = P[:, ::-1].astype(np.float64) + 0.5
        mF = np.argwhere(F)[:, ::-1].mean(0) + 0.5; mP = pts.mean(0)
        u = mP - mF; u /= (np.linalg.norm(u) + 1e-9)
        r = rho + 0.5
        c = mP + u * r * 0.7
        for _ in range(30):
            d = pts - c; n = np.linalg.norm(d, axis=1) + 1e-9
            c = c + ((n - r)[:, None] * d / n[:, None]).mean(0)
        n = np.linalg.norm(pts - c, axis=1)
        if np.abs(n - r).mean() > 1.3: return None
        ang = np.degrees(np.arctan2(pts[:, 1] - c[1], pts[:, 0] - c[0]))
        a = np.sort(ang); gaps = np.diff(np.concatenate([a, [a[0] + 360.0]])); k = int(np.argmax(gaps))
        start = a[(k + 1) % len(a)]; end = a[k]
        if end < start: end += 360.0
        # çizgi merkezi: F/hava sınırının (n.mean()-0.5) yarım çizgi kalınlığı kadar DERİ tarafında; böylece diğer konturlar gibi alt kenarı sınıra oturur
        return c, float(n.mean() - 0.5 + self.armpit_line / 2.0), float(start), float(end)

    def _armpit_fills(self, pose, w):
        out = []
        A = self._alpha_of(['foreL', 'upperL', 'foreR', 'upperR'], w, pose)
        T = self._alpha_of(['torso'], w, pose)
        for side in 'LR':
            ang = pose.get('upper' + side, 0.0)
            abd = max(0.0, ang) if side == 'L' else max(0.0, -ang)
            k = float(np.clip((abd - 11.0) / 14.0, 0, 1)); k = k * k * (3 - 2 * k)
            rho = self.armpit_rho * k
            if rho < 2.0: continue
            offs = self._disk(rho); offs_e = self._disk(3.4); offs_a = self._disk(1.6); offs_n = self._disk(rho + 3.0)
            pad = int(math.ceil(rho)) + 8
            x0, y0, x1, y1 = self._armpit_window(side)
            x0, y0 = max(x0, 0), max(y0, 0); x1, y1 = min(x1, self.W), min(y1, self.H)
            a = A[y0:y1, x0:x1] > 0.5; t = T[y0:y1, x0:x1] > 0.5
            G = ~(a | t)
            Gp = np.pad(G, pad, constant_values=True)
            opened = self._dilate(~self._dilate(~Gp, offs), offs)
            F = (Gp & ~opened)[pad:-pad, pad:-pad]
            opened_w = opened[pad:-pad, pad:-pad]
            near_t = self._dilate(np.pad(t, pad), offs_n)[pad:-pad, pad:-pad]
            near_a = self._dilate(np.pad(a, pad), offs_n)[pad:-pad, pad:-pad]
            F = self._components(F & near_t & near_a, 10)
            if F.sum() < 10: continue
            air = G & ~F
            arc = self._fit_arc(F, opened_w & ~F, rho)
            airp = np.pad(air, pad, constant_values=True)
            erase = self._dilate(np.pad(F, pad), offs_e)[pad:-pad, pad:-pad] & a & ~self._dilate(airp, offs_a)[pad:-pad, pad:-pad]
            out.append(dict(x0=x0, y0=y0, F=F, a=a, erase=erase, arc=arc, skin=self._skin_of(side)))
        return out

    def _paste_fill(self, canvas, f):
        h, wd = f['F'].shape
        al = Image.fromarray((f['F'] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
        col = Image.new('RGBA', (wd, h), tuple(int(round(v)) for v in f['skin']) + (255,))
        col.putalpha(al)
        canvas.alpha_composite(col, (f['x0'], f['y0']))

    def _paste_outline(self, canvas, f):
        h, wd = f['F'].shape
        x0, y0 = f['x0'], f['y0']
        # 0) ucu kapatan yuvarlak yay (4x süper örnekleme, düzgün) — önce hazırla
        arc_tile = None
        if f['arc'] is not None:
            c, r, a0, a1 = f['arc']
            S = 4; wdt = self.armpit_line
            arc_tile = Image.new('RGBA', (wd * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(arc_tile)
            rb = r + wdt / 2.0
            d.arc(((c[0] - rb) * S, (c[1] - rb) * S, (c[0] + rb) * S, (c[1] + rb) * S), a0 - 15.0, a1 + 15.0, fill=self.OUTLINE + (255,), width=int(round(wdt * S)))
            arc_tile = arc_tile.resize((wd, h), Image.BOX)
        near_arc = np.zeros((h, wd), bool)
        if arc_tile is not None:
            aa = np.asarray(arc_tile)[..., 3] > 40
            pad = 4
            near_arc = self._dilate(np.pad(aa, pad), self._disk(3.2))[pad:-pad, pad:-pad]
        # 1) kolun F'ye bakan iç kenar çizgisini YEREL deri alanıyla boya (yayın yakını hariç: çizgi yaya kesintisiz bağlansın)
        erase = f['erase'] & ~near_arc
        er = np.asarray(Image.fromarray((erase * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32) / 255.0
        win = np.asarray(canvas.crop((x0, y0, x0 + wd, y0 + h))).astype(np.float32)
        lum = 0.299 * win[..., 0] + 0.587 * win[..., 1] + 0.114 * win[..., 2]
        good = (lum > 198) & f['a'] & ~erase & (win[..., 3] > 240)
        m8 = Image.fromarray((good * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3.0))
        mb = np.asarray(m8).astype(np.float32) / 255.0
        field = np.zeros_like(win[..., :3])
        for ch in range(3):
            c8 = Image.fromarray(np.clip(win[..., ch] * good, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3.0))
            field[..., ch] = np.asarray(c8).astype(np.float32) / np.maximum(mb, 1e-3)
        field = np.where(mb[..., None] > 0.02, field, np.array(f['skin'], np.float32))
        k = er[..., None]
        win[..., :3] = win[..., :3] * (1 - k) + field * k
        canvas.paste(Image.fromarray(np.clip(win, 0, 255).astype(np.uint8), 'RGBA'), (x0, y0))
        # 2) yayı yapıştır
        if arc_tile is not None: canvas.alpha_composite(arc_tile, (x0, y0))
