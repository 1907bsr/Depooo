'use strict';
// ===== Çekirdek: matematik, yumuşak şekil çizimi, el yazısı =====
// Hepsi kodla çizilir; dışarıdan görsel/ses/yazı tipi (OFL hariç) kullanılmaz.
const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, k) => a + (b - a) * k;
const sm = k => { k = clamp(k); return k * k * (3 - 2 * k); };
const eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const eout = k => { k = clamp(k); return 1 - Math.pow(1 - k, 3); };
const ein = k => { k = clamp(k); return k * k * k; };
const seg = (t, a, b) => clamp((t - a) / (b - a));
const back = (k, s = 1.70158) => { k = clamp(k); const c3 = s + 1; return 1 + c3 * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2); };
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
// t0'dan itibaren sönümlü salınımla 0→1 (yaylanma)
const spring = (t, t0, f = 2.6, z = .32) => { if (t < t0) return 0; const x = t - t0, w = TAU * f, wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + z * w / wd * Math.sin(wd * x)); };
// anahtar kare izi: K([[t,v],[t,v,easeFn],...]) → t => değer
function K(keys) {
  return t => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i]; return lerp(v0, v1, (e || sm)((t - t0) / (t1 - t0))); }
    }
    return keys[keys.length - 1][1];
  };
}
const G = { t: 0, boil: 1.1 };   // G.t: o anki kare zamanı (çizgi titremesi için)

const C = {
  ink: '#3b2a22', paper: '#efe4cd',
  skin: '#ecc5a4', skinD: '#d3a07f', blush: '#df8f7a',
  hair: '#5a382b', hairD: '#3a2219', hairL: '#7b523e',
  gown: '#c9918a', gownD: '#a87068', gownL: '#dcb0a6',
  lace: '#f3e9d3', laceD: '#dccfb4',
  corset: '#ecdcb9', corsetD: '#cdb88f', bone: '#8f7e66', lacing: '#a9794a',
  chem: '#f1ebdc', chemD: '#d9cfb9',
  gold: '#c7a04c', goldD: '#a07f33',
  lip: '#b2575a', cavity: '#6e2e32', tongue: '#d98a8a', white: '#fbf6ea', iris: '#5a3a2b',
  wall: '#d3b690', wallD: '#bf9d74', wallS: '#dbc3a0', wood: '#94704f', woodD: '#76563b', woodL: '#ab8461',
  burg: '#7d3c3e', burgD: '#5f2c30', olive: '#7f7d52', oliveD: '#626040', mustard: '#c8a043', char: '#4b433c',
  plum: '#4a3140', mauve: '#8e6b78', peach: '#e7b98a',
};

// --- yumuşak (Catmull-Rom) kapalı/açık yol; çizgi "kaynaması" (her 1/9 sn küçük titreme) ---
function jit(p, i, seed) {
  const s = Math.floor(G.t * 9);
  return [p[0] + (hash(i * 1.7 + seed * 3.1 + s * 7.3) - .5) * G.boil, p[1] + (hash(i * 2.3 + seed * 5.7 + s * 4.1) - .5) * G.boil];
}
function sp(ctx, pts, closed = true, seed = 0) {
  const n = pts.length, Q = G.boil ? pts.map((p, i) => jit(p, i, seed)) : pts;
  const g = i => closed ? Q[((i % n) + n) % n] : Q[Math.max(0, Math.min(n - 1, i))];
  ctx.moveTo(Q[0][0], Q[0][1]);
  const m = closed ? n : n - 1;
  for (let i = 0; i < m; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  if (closed) ctx.closePath();
}
// gölgeli şekil: base rengi, ışık sol-üstten; dark = alt-sağdaki gölge; sw = kontur kalınlığı (0 = konturlu değil)
function shape(ctx, pts, base, dark, o = {}) {
  const sx = o.sx ?? -9, sy = o.sy ?? -7, sw = o.sw ?? 3.2, seed = o.seed || 0, closed = o.closed !== false;
  ctx.save();
  ctx.beginPath(); sp(ctx, pts, closed, seed); ctx.fillStyle = dark || base; ctx.fill();
  if (dark) {
    ctx.save(); ctx.beginPath(); sp(ctx, pts, closed, seed); ctx.clip();
    ctx.translate(sx, sy); ctx.beginPath(); sp(ctx, pts, closed, seed); ctx.fillStyle = base; ctx.fill();
    ctx.restore();
  }
  if (sw) { ctx.beginPath(); sp(ctx, pts, closed, seed); ctx.lineWidth = sw; ctx.strokeStyle = o.ink || C.ink; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.restore();
}
function line(ctx, pts, w, col, closed = false, seed = 0) {
  ctx.save(); ctx.beginPath(); sp(ctx, pts, closed, seed); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
}
function ell(ctx, x, y, rx, ry, fill, stroke, sw = 3, rot = 0) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke && sw) { ctx.lineWidth = sw; ctx.strokeStyle = stroke; ctx.stroke(); }
}
// konturlu, yuvarlak uçlu, uçtan uca incelen uzuv (omuz-dirsek-bilek)
function limb(ctx, pts, widths, fill, ink = C.ink, ow = 3, dark = null) {
  const N = 9, sg = [];
  for (let i = 0; i < pts.length - 1; i++) for (let j = 0; j < N; j++) {
    const k = j / N, k2 = (j + 1) / N;
    sg.push([lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), lerp(widths[i], widths[i + 1], k), lerp(pts[i][0], pts[i + 1][0], k2), lerp(pts[i][1], pts[i + 1][1], k2), lerp(widths[i], widths[i + 1], k2)]);
  }
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let pass = 0; pass < 3; pass++) {
    if (pass === 1 && !dark) continue;
    for (const s of sg) {
      ctx.beginPath(); ctx.moveTo(s[0] + (pass === 2 ? -2 : 0), s[1] + (pass === 2 ? -2 : 0)); ctx.lineTo(s[3] + (pass === 2 ? -2 : 0), s[4] + (pass === 2 ? -2 : 0));
      ctx.lineWidth = pass === 0 ? (s[2] + s[5]) / 2 + ow * 2 : pass === 1 ? (s[2] + s[5]) / 2 : (s[2] + s[5]) / 2 - 5;
      ctx.strokeStyle = pass === 0 ? ink : pass === 1 ? dark : fill;
      if (pass === 2 && !dark) { ctx.lineWidth = (s[2] + s[5]) / 2; }
      ctx.stroke();
    }
  }
  ctx.restore();
}
// iki kemikli uzuv: omuz S → hedef T, dirsek yönü flip ile
function ik(sx, sy, tx, ty, l1, l2, flip) {
  const dx = tx - sx, dy = ty - sy; let d = Math.hypot(dx, dy);
  d = Math.min(d, l1 + l2 - .01); d = Math.max(d, Math.abs(l1 - l2) + .01);
  const a = Math.atan2(dy, dx), A = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)) * (flip ? -1 : 1);
  const ex = sx + Math.cos(a + A) * l1, ey = sy + Math.sin(a + A) * l1;
  // bilek: dirsekten T yönünde l2
  const wa = Math.atan2(ty - ey, tx - ex);
  return { e: [ex, ey], w: [ex + Math.cos(wa) * l2, ey + Math.sin(wa) * l2] };
}

// --- el yazısı ve çizgi ilerlemesi ---
// Metni soldan sağa "yazılıyormuş gibi" gösterir; p: 0..1
function hand(ctx, txt, x, y, size, col, p, o = {}) {
  if (p <= 0) return;
  const fam = o.fam || "Caveat", wt = o.wt || 700, it = o.it ? 'italic ' : '';
  ctx.save();
  ctx.font = `${it}${wt} ${size}px ${fam}`; ctx.textBaseline = 'alphabetic'; ctx.textAlign = o.align || 'left';
  const w = ctx.measureText(txt).width;
  const x0 = (o.align === 'center') ? x - w / 2 : (o.align === 'right') ? x - w : x;
  ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.translate(-x, -y);
  ctx.beginPath(); ctx.rect(x0 - 6, y - size * 1.1, (w + 12) * eio(p), size * 1.6); ctx.clip();
  if (o.shadow) { ctx.fillStyle = o.shadow; ctx.fillText(txt, x + 2, y + 3); }
  ctx.fillStyle = col; ctx.fillText(txt, x, y);
  ctx.restore();
}
function polyLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
// pts boyunca p oranına kadar çizilen kalem çizgisi (düz kırık çizgi; kıvrım için çok nokta ver)
function pen(ctx, pts, p, w, col, o = {}) {
  if (p <= 0) return;
  const L = polyLen(pts); let rem = L * clamp(p);
  ctx.save(); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && rem > 0; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= rem) { ctx.lineTo(pts[i][0], pts[i][1]); rem -= d; }
    else { const k = rem / d; ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); rem = 0; }
  }
  ctx.stroke();
  // ok ucu
  if (o.arrow && p >= .999) {
    const a = pts[pts.length - 1], b = pts[pts.length - 2], ang = Math.atan2(a[1] - b[1], a[0] - b[0]), s = o.arrow;
    ctx.beginPath(); ctx.moveTo(a[0] - Math.cos(ang - .45) * s, a[1] - Math.sin(ang - .45) * s); ctx.lineTo(a[0], a[1]); ctx.lineTo(a[0] - Math.cos(ang + .45) * s, a[1] - Math.sin(ang + .45) * s); ctx.setLineDash([]); ctx.stroke();
  }
  ctx.restore();
}
// kuadratik eğriyi noktalara çevir (kalemle çizilecek kıvrımlı oklar için)
function curve(a, c, b, n = 24) { const r = []; for (let i = 0; i <= n; i++) { const k = i / n; r.push([(1 - k) * (1 - k) * a[0] + 2 * (1 - k) * k * c[0] + k * k * b[0], (1 - k) * (1 - k) * a[1] + 2 * (1 - k) * k * c[1] + k * k * b[1]]); } return r; }

// kâğıt dokusu: bir kez üretilen gürültü karosu
let _grain = null;
function grainTile() {
  if (_grain) return _grain;
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const im = x.createImageData(256, 256);
  for (let i = 0; i < 256 * 256; i++) { const v = 128 + (hash(i * .713) - .5) * 70; im.data[i * 4] = v; im.data[i * 4 + 1] = v * .96; im.data[i * 4 + 2] = v * .9; im.data[i * 4 + 3] = 255; }
  x.putImageData(im, 0, 0); _grain = c; return c;
}
function grainOverlay(ctx, W, H, a = .13) {
  ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'multiply';
  const pat = ctx.createPattern(grainTile(), 'repeat'); ctx.fillStyle = pat; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function vignette(ctx, W, H, a = .5) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .38, W / 2, H / 2, H * .95);
  g.addColorStop(0, 'rgba(40,24,18,0)'); g.addColorStop(1, `rgba(40,24,18,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
