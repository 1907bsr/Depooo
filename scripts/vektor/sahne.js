'use strict';
// ===== Sahne kaydı: her sahne {bas, dur, draw(ctx,t)}; t = KÜRESEL zaman (kelime zamanları küresel) =====
// KAMERA KURALI (Büşra, 2026-11-20: "ekran sağ-sol yapıyor, bir tık fazla"): yan kayma YOK. Kamera sabit ya da yavaş yakınlaşır;
// yer değişimi kesmeyle olur. Yakınlaşma hız sınırı ~ %5/sn.
const SAH = {};
function sahne(id, bas, dur, fn) { SAH[id] = { id, bas, dur, draw: fn }; }
function W(sid, word, n = 1) { let c = 0; for (const [w, t] of ZAMAN[sid].w) { if (w === word && ++c === n) return t; } throw new Error('kelime yok: ' + sid + ' ' + word); }
function kam(ctx, c) { ctx.translate(960, 540); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); }
// sabit merkez, yavaş yakınlaşma: z0→z1, t0..t1 arası
// Büşra (2026-11-20): "bazı yerlerde boyut büyüyüp küçülüyor" → sahne içi yavaş yakınlaşmalar kapalı (ZOOMK = 0). Kamera sabit; yer değişimi kesmeyle.
const ZOOMK = 0;
function zc(x, y, z0, z1, t, t0, t1) { return { x, y, z: lerp(z0, z0 + (z1 - z0) * ZOOMK, sm(seg(t, t0, t1))) }; }
const bk = k => back(k, 1.2);
const clone = o => JSON.parse(JSON.stringify(o));
function merge(a, b) { for (const k in b) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) merge(a[k], b[k]); else a[k] = b[k]; } return a; }
function mix(a, b, k) {
  if (typeof a === 'number') return lerp(a, b, k);
  if (Array.isArray(a)) return a.map((v, i) => mix(v, b[i], k));
  if (a && typeof a === 'object') { const o = {}; for (const key in a) o[key] = mix(a[key], b[key], k); return o; }
  return k < .5 ? a : b;
}
const BASE = {
  x: 1500, y: 0, lean: 0, headRoll: 0, headDX: 0, headDY: 0, chest: 0, waist: 1, xray: 0, xraySkirt: 0, shake: 0, stride: 0,
  armL: [-112, -372], armR: [112, -372],
  f: { lid: 0, rollAmt: 0, roll: .5, bulge: 0, puff: 0, sweat: 0, look: [0, 0], browL: [0, 0, .12], browR: [0, 0, .12], mouth: { w: 17, open: 0, smile: .6, teeth: 0, shape: '' }, blush: .35, turn: 0 }
};
const P = o => merge(clone(BASE), o);
function tr(seq, t) {   // pozlar arası geçiş: seq = [[t, poz, ease?], ...]
  if (t <= seq[0][0]) return seq[0][1];
  for (let i = 1; i < seq.length; i++) if (t <= seq[i][0]) { const [t0, p0] = seq[i - 1], [t1, p1, e] = seq[i]; return mix(p0, p1, (e || sm)((t - t0) / (t1 - t0))); }
  return seq[seq.length - 1][1];
}
const BLINKS = Array.from({ length: 40 }, (_, i) => 2.3 + i * 2.9 + hash(i * 3.3) * 1.3);
function blinkAt(t, off = 0) { let v = 0; for (const b of BLINKS) { const d = Math.abs(t - b - off); if (d < .09) v = Math.max(v, 1 - d / .09); } return v; }
const MOUTH = {
  smile: { w: 17, open: 0, smile: .6, teeth: 0, shape: '' }, grin: { w: 23, open: .35, smile: 1, teeth: 1, shape: '' }, flat: { w: 14, open: 0, smile: -.2, teeth: 0, shape: '' },
  sad: { w: 13, open: 0, smile: -.7, teeth: 0, shape: '' }, o: { w: 18, open: .9, shape: 'o', smile: 0, teeth: 0 }, talk: { w: 16, open: .3, smile: .3, teeth: 0, shape: '' }
};
// poz → çizim durumu. opts: {look, off (göz kırpma kayması), s (ölçek), bust}
function pose2state(p, t, o = {}) {
  const F = faceDef(), f = p.f;
  Object.assign(F, { lid: f.lid, rollAmt: f.rollAmt, roll: f.roll, bulge: f.bulge, puff: f.puff, sweat: f.sweat, look: f.look, browL: f.browL, browR: f.browR, mouth: f.mouth, blush: f.blush, turn: f.turn });
  F.blink = blinkAt(t, o.off || 0);
  const breath = Math.sin(t * TAU * .3 + (o.off || 0)) * (1 - p.xray * .75);
  return { look: o.look, x: p.x + p.shake * Math.sin(t * 52) * 3.2, y: ZEMIN + p.y + (o.dy || 0), s: o.s || .78, flip: o.flip, bust: o.bust, face: F,
    lean: p.lean + Math.sin(t * .9 + (o.off || 0)) * .4 + p.shake * Math.sin(t * 47) * .7, headRoll: p.headRoll + Math.sin(t * .7 + (o.off || 0)) * .7, headDX: p.headDX, headDY: p.headDY,
    chest: p.chest + breath * .5, waist: p.waist, xray: p.xray, xraySkirt: p.xraySkirt, stride: p.stride,
    armL: { t: [p.armL[0], p.armL[1] + Math.sin(t * 1.3 + (o.off || 0)) * 2], flip: o.flipL ?? false, hold: p.holdL }, armR: { t: [p.armR[0], p.armR[1] + Math.cos(t * 1.1 + (o.off || 0)) * 2], flip: o.flipR ?? true, hold: p.holdR }, rods: [] };
}
function L2W(S, lx, ly) { return [S.x + lx * S.s, S.y + ly * S.s]; }
function textW(ctx, txt, size, fam = 'Caveat', wt = 700) { ctx.save(); ctx.font = `${wt} ${size}px ${fam}`; const w = ctx.measureText(txt).width; ctx.restore(); return w; }
const INK = '#3b2a22', RED = '#8a2f2c', CREAM = '#f4ead2';
// sahne kaydı kısayolu: bas/dur SAHNE_LISTE'den
function sahneS(sid, fn) { const r = SAHNE_LISTE.find(x => x.sid === sid); sahne(sid, r.bas, r.dur, fn); }
// oyuncu: poz dizisinden çizim durumu. o: {x, y, s, off, flip, bust}
// Tam boy figürlerin genel büyütmesi (Büşra, 2026-11-20: "Mary biraz küçük kalmış, Mary'yi ve diğer insanları büyüt").
// k:1 → büyütme yok. Baş hep görünsün diye gerekirse ayaklar aşağı iner (baş üstü boşluk ≥ 80 px).
const FIGO = 1.22, FIGK = 1.15;
function buyut(S, o = {}) { if (S.bust || o.k === 1) return S; const k = o.k || FIGK; S.s *= k; const need = 80 + 880 * S.s; if (S.y < need && !o.fixY) S.y = need; return S; }
function actor(look, seq, t, o = {}) { const p = tr(seq, t); const S = pose2state(p, t, Object.assign({ look, s: .78, off: 1.7 }, o)); if (o.x !== undefined) S.x = o.x; if (o.y !== undefined) S.y = ZEMIN + o.y; return buyut(S, o); }
