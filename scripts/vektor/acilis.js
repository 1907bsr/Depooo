'use strict';
// ===== Açılış (0 – 41,6 sn): Mary, 1913. Tüm hareketler kodla; zamanlar zaman_acilis.js'den (konuşma tahmini) =====
function W(sid, word, n = 1) { let c = 0; for (const [w, t] of ZAMAN[sid].w) { if (w === word && ++c === n) return t; } throw new Error('kelime yok: ' + sid + ' ' + word); }
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
  x: 1500, y: 0, lean: 0, headRoll: 0, headDX: 0, headDY: 0, chest: 0, waist: 1, xray: 0, xraySkirt: 0, shake: 0,
  armL: [-112, -372], armR: [112, -372],
  f: { lid: 0, rollAmt: 0, roll: .5, bulge: 0, puff: 0, sweat: 0, look: [0, 0], browL: [0, 0, .12], browR: [0, 0, .12], mouth: { w: 17, open: 0, smile: .6, teeth: 0, shape: '' }, blush: .35, turn: 0 }
};
const P = o => merge(clone(BASE), o);
function tr(seq, t) {   // pozlar arası geçiş: seq = [[t, poz, ease?], ...]
  if (t <= seq[0][0]) return seq[0][1];
  for (let i = 1; i < seq.length; i++) if (t <= seq[i][0]) { const [t0, p0] = seq[i - 1], [t1, p1, e] = seq[i]; return mix(p0, p1, (e || sm)((t - t0) / (t1 - t0))); }
  return seq[seq.length - 1][1];
}
// kamera: [t,x,y,z] anahtarları arasında kesintisiz (hız süreksizliği olmayan) eğri
function camPath(keys, t) {
  const n = keys.length; if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], z: keys[0][3] }; if (t >= keys[n - 1][0]) return { x: keys[n - 1][1], y: keys[n - 1][2], z: keys[n - 1][3] };
  let i = 1; while (keys[i][0] < t) i++;
  const a = keys[i - 1], b = keys[i], dt = b[0] - a[0], u = (t - a[0]) / dt;
  const tan = (k, c) => { const p = keys[Math.max(0, k - 1)], q = keys[Math.min(n - 1, k + 1)]; const d = q[0] - p[0]; return d ? (q[c] - p[c]) / d : 0; };
  const out = {};
  [['x', 1], ['y', 2], ['z', 3]].forEach(([nm, c]) => {
    const m0 = tan(i - 1, c) * dt * (i - 1 === 0 ? 0 : 1), m1 = tan(i, c) * dt * (i === n - 1 ? 0 : 1), u2 = u * u, u3 = u2 * u;
    out[nm] = (2 * u3 - 3 * u2 + 1) * a[c] + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * b[c] + (u3 - u2) * m1;
  });
  return out;
}
const BLINKS = Array.from({ length: 16 }, (_, i) => 2.3 + i * 2.9 + hash(i * 3.3) * 1.3);
function blinkAt(t) { let v = 0; for (const b of BLINKS) { const d = Math.abs(t - b); if (d < .09) v = Math.max(v, 1 - d / .09); } return v; }

// ---------------------------------------------------------------- MARY'NİN OYUNU
const SMILE = { w: 17, open: 0, smile: .6, teeth: 0, shape: '' };
const GRIN = { w: 23, open: .35, smile: 1, teeth: 1, shape: '' };
const FLAT = { w: 14, open: 0, smile: -.2, teeth: 0, shape: '' };
const calm = P({ f: { turn: -.3, look: [-.3, 0] } });
const proud = P({ armL: [-96, -410], armR: [96, -410], headDY: -6, headRoll: 3, f: { mouth: GRIN, browL: [-6, -.1, .2], browR: [-6, -.1, .2], blush: .65, lid: .1 } });
const preen = P({ armR: [64, -722], armL: [-96, -410], headRoll: 6, headDY: -4, f: { mouth: { w: 19, open: .1, smile: .9, teeth: 0, shape: '' }, browL: [-5, -.08, .2], browR: [-9, -.15, .3], lid: .18, blush: .6, look: [.5, .1], turn: .2 } });
const presentL = P({ armL: [-292, -572], armR: [96, -410], headRoll: -3, f: { turn: -.9, look: [-1, -.1], mouth: GRIN, blush: .5, browL: [-8, -.1, .3], browR: [-8, -.1, .3] } });
const cardChest = P({ armR: [40, -520], armL: [-96, -410], f: { turn: .1, look: [.1, .3], mouth: SMILE, browL: [-4, 0, .2], browR: [-4, 0, .2] } });
const cardUp = P({ armR: [150, -640], armL: [-96, -410], headRoll: 3, f: { turn: .45, look: [.8, -.2], mouth: { w: 21, open: .15, smile: .9, teeth: 0, shape: '' }, browL: [-8, -.08, .3], browR: [-8, -.08, .3], blush: .6 } });
const gazeGown = P({ armL: [-96, -410], armR: [150, -640], headRoll: 4, f: { turn: .9, look: [1, 0], mouth: GRIN, browL: [-9, -.1, .3], browR: [-9, -.1, .3], blush: .6 } });
const smug = P({ armL: [-96, -410], armR: [96, -410], headDY: -12, headRoll: 5, chest: 1, f: { lid: .62, mouth: { w: 25, open: .5, smile: 1, teeth: 1, shape: '' }, browL: [-8, -.15, .3], browR: [-8, -.15, .3], blush: .8 } });
const frozen = P({ armL: [-96, -410], armR: [96, -410], headDY: -2, f: { mouth: { w: 22, open: .12, smile: .8, teeth: 1, shape: '' }, browL: [-4, -.25, .1], browR: [-4, -.25, .1], blush: .35, look: [0, .35], sweat: .25 } });
const lookDown = P({ armL: [-96, -410], armR: [96, -410], headDY: 8, f: { look: [0, .9], mouth: { w: 14, open: 0, smile: -.15, teeth: 0, shape: '' }, browL: [-4, -.35, .1], browR: [-4, -.35, .1], sweat: .5, lid: .05 } });
const XR = { xray: 1, waist: .76, armL: [-96, -410], armR: [96, -410], headDY: 6, f: { look: [0, .7], mouth: { w: 14, open: 0, smile: -.2, teeth: 0, shape: '' }, browL: [-4, -.3, .1], browR: [-4, -.3, .1], sweat: .5 } };
const xrayLook = (extra = {}) => { const o = clone(XR); merge(o, extra); return P(o); };
const breathTry = P({ xray: 1, waist: .74, chest: 2.2, armL: [-96, -410], armR: [96, -410], headDY: -4, shake: .4, f: { bulge: .75, puff: 1, look: [0, .3], mouth: { w: 9, open: .1, smile: -.6, teeth: 0, shape: '' }, browL: [-8, -.4, .25], browR: [-8, -.4, .25], sweat: .8 } });
const breathOut = P({ xray: .6, waist: .78, chest: -.8, armL: [-96, -410], armR: [96, -410], headDY: 8, f: { lid: .55, look: [0, .6], mouth: { w: 14, open: .5, smile: -.2, teeth: 0, shape: 'o' }, browL: [-5, -.15, .15], browR: [-5, -.15, .15], sweat: .4 } });
const relaxed = P({ armL: [-96, -410], armR: [96, -410], f: { lid: .1, mouth: SMILE, sweat: .1 } });
const DT = 25.16;   // D çekimi: sandalye bölümü | masa bölümü (kesme)
const X_SANDALYE = 1025, X_MASA = 1790, X_AYNA = 2470;

function maryState(t) {
  let p;
  const s02 = k => W('s02', k), s03 = k => W('s03', k), s04 = k => W('s04', k), sc = k => W('s02c', k), s05 = k => W('s05', k);
  if (t < 13.1) {
    p = tr([
      [3.0, calm], [4.2, P({ f: { turn: -.1, look: [-.1, 0] } })], [4.7, preen, bk], [5.9, preen], [6.5, proud],
      [s02('akşam') + .3, proud], [s02('akşam') + .9, presentL, bk], [s02('balosu') + .1, presentL], [s02('davetiye') - .15, cardChest],
      [s02('cebinde') - .1, cardUp, bk], [s02('elbisen') - .1, cardUp], [s02('elbisen') + .15, gazeGown], [s02('özgüvenin') - .15, gazeGown], [s02('özgüvenin') + .45, smug, bk], [13.0, smug]
    ], t);
    p.x = K([[3.0, X_SANDALYE], [4.9, 1500, sm]])(t);
  } else if (t < 23.08) {
    p = tr([
      [13.1, smug], [13.5, frozen, bk], [s03('üstündeki') - .2, frozen], [s03('üstündeki') + .35, lookDown, bk], [s03('korse') - .1, lookDown],
      [s03('korse') + .7, xrayLook()], [s03('balina') - .1, xrayLook()],
      [s03('balina') + .35, xrayLook({ armL: [-250, -560], f: { turn: -.6, look: [-1, .1], browL: [-6, .1, .2], sweat: .2 } }), bk], [s03('metal') - .15, xrayLook({ armL: [-250, -560], f: { turn: -.6, look: [-1, .1], browL: [-6, .1, .2], sweat: .2 } })],
      [s03('metal') + .3, xrayLook({ armR: [250, -570], f: { turn: .6, look: [1, .1], browR: [-6, .1, .2], sweat: .2 } }), bk], [s03('bağcıktan') - .1, xrayLook({ armR: [250, -570], f: { turn: .6, look: [1, .1], sweat: .2 } })],
      [s03('bağcıktan') + .3, xrayLook({ armR: [16, -430], headDY: 8, f: { look: [0, .9] } }), bk], [s03('yapılmış') + .3, xrayLook({ armR: [16, -430], headDY: 8, f: { look: [0, .9] } })], [s03('alet') + .35, xrayLook({ f: { look: [0, 0], browL: [-6, -.1, .3], browR: [-6, -.1, .3] } }), bk], [s03('nefes') - .3, xrayLook()],
      [s03('nefes') + .15, P({ xray: 1, waist: .75, chest: 1.0, armL: [-96, -410], armR: [96, -410], f: { look: [0, .5], bulge: .4, mouth: { w: 12, open: .1, smile: -.3, teeth: 0, shape: '' }, browL: [-6, -.3, .2], browR: [-6, -.3, .2], sweat: .6 } }), sm],
      [s03('nefes') + 1.0, breathTry, bk], [s03('bağlı') + .25, breathTry], [s03('bağlı') + .9, breathOut, sm], [22.45, relaxed], [23.05, relaxed]
    ], t);
    p.x = 1500;
  } else if (t < 28.66) {
    const bend = P({ lean: -16, armL: [-120, -60], armR: [96, -410], headDY: 12, headRoll: -4, f: { look: [-.8, .8], mouth: { w: 9, open: .15, smile: -.5, teeth: 0, shape: '' }, bulge: .5, browL: [-6, -.4, .2], browR: [-6, -.4, .2], sweat: .5 } });
    const bendStuck = P({ lean: -17.5, armL: [-124, -50], armR: [96, -410], headDY: 14, headRoll: -5, shake: 1, f: { look: [-.8, .9], mouth: { w: 9, open: .15, smile: -.6, teeth: 0, shape: '' }, bulge: .8, puff: .6, browL: [-8, -.45, .2], browR: [-8, -.45, .2], sweat: .9 } });
    const huh = P({ armL: [-96, -410], armR: [96, -410], f: { look: [.5, .3], mouth: { w: 12, open: .1, smile: -.3, shape: '' }, browL: [-3, -.2, .1], browR: [-3, -.2, .1], sweat: .5 } });
    const sitTry = P({ y: 92, shake: 1, armL: [-96, -410], armR: [96, -410], headDY: 4, f: { look: [0, .2], mouth: { w: 9, open: .1, smile: -.7, teeth: 0, shape: '' }, bulge: .7, puff: .5, browL: [-8, -.4, .2], browR: [-8, -.4, .2], sweat: .9 } });
    const reach = w => P({ armL: [-96, -410], armR: [150, -520], waist: w, f: { look: [1, .1], turn: .6, mouth: { w: 14, open: .3, smile: .5, teeth: 0, shape: '' }, browL: [-6, -.1, .3], browR: [-6, -.1, .3], blush: .5 } });
    const bite = (w, pf) => P({ armL: [-96, -410], armR: [30, -640], waist: w, f: { turn: .3, look: [.4, .2], puff: pf, mouth: { w: 12, open: .05, smile: .4, teeth: 0, shape: '' }, browL: [-6, -.05, .3], browR: [-6, -.05, .3], blush: .6 } });
    const eatFull = P({ armL: [-96, -410], armR: [96, -410], waist: 1.34, chest: 1.5, headDY: 4, shake: .6, f: { bulge: .9, puff: .3, look: [0, .6], mouth: { w: 18, open: .55, smile: 0, teeth: 0, shape: 'o' }, browL: [-16, -.28, .45], browR: [-16, -.28, .45], sweat: .6 } });
    p = tr([
      [23.08, relaxed], [23.35, bend, eio], [23.7, bendStuck, bk], [24.0, bendStuck], [24.14, huh, bk],
      [24.4, P({ f: { look: [.3, .3], sweat: .3 } })], [24.75, sitTry, eio], [25.0, sitTry], [25.14, relaxed, bk],
      [25.4, reach(.96), bk], [25.62, bite(1.02, .6)], [25.8, reach(1.02)], [25.98, bite(1.14, .8)], [26.16, reach(1.14)], [26.34, bite(1.26, 1)],
      [26.7, eatFull, bk], [27.9, eatFull], [28.25, P({ waist: 1.0, f: { lid: .4, look: [0, .5], mouth: FLAT } }), sm], [28.65, relaxed]
    ], t);
    p.x = t < DT ? X_SANDALYE : X_MASA;
  } else if (t < 35.78) {
    const shrugLook = P({ xraySkirt: .5, armL: [-190, -470], armR: [190, -470], headDY: 8, f: { look: [0, .9], mouth: { w: 15, open: .1, smile: -.15, shape: '' }, browL: [-3, .12, .1], browR: [-8, -.2, .3] } });
    const rodsUp = P({ xraySkirt: .5, armL: [-190, -470], armR: [190, -470], headDY: -2, f: { look: [.1, -.1], lid: .22, mouth: FLAT, browL: [-2, .15, .05], browR: [-12, -.2, .4] } });
    const pushRod = P({ xraySkirt: .5, armL: [-190, -470], armR: [100, -400], headDY: 6, f: { look: [.8, .8], lid: .15, mouth: { w: 12, open: .1, smile: -.4, shape: '' }, browL: [-4, -.2, .2], browR: [-4, -.2, .2], bulge: .2 } });
    const umb = P({ xraySkirt: .45, armL: [-190, -470], armR: [190, -470], headDY: 2, f: { look: [0, .8], lid: .3, mouth: { w: 15, open: 0, smile: -.3, shape: '' }, browL: [-3, .12, .1], browR: [-3, .12, .1] } });
    p = tr([
      [28.66, relaxed], [29.4, P({ xraySkirt: .3, armL: [-150, -420], armR: [150, -420], f: { look: [0, .5] } })], [s04('altından') + .1, P({ xraySkirt: .45, armL: [-130, -400], armR: [130, -400], headDY: 6, f: { look: [0, .8], mouth: FLAT, browL: [-3, .1, .1], browR: [-6, -.15, .3] } }), bk], [s04('cartlı') + .05, shrugLook, bk], [s04('fırlamış') + .5, shrugLook],
      [s04('sanki') + .1, rodsUp, sm], [s04('içinde') + .2, pushRod, sm], [s04('şemsiye') + .5, umb, sm], [35.3, umb], [35.75, P({ xraySkirt: 0, f: { look: [0, .3], lid: .2 } })]
    ], t);
    p.x = X_MASA;
  } else if (t < 39.38) {
    const toMirror = P({ armL: [-96, -410], armR: [96, -410], f: { turn: .95, look: [1, 0], lid: .1, mouth: { w: 13, open: 0, smile: -.1, shape: '' }, browL: [0, .15, .05], browR: [0, .15, .05] } });
    const ready = P({ armL: [-96, -410], armR: [96, -410], chest: 1.2, headDY: -8, f: { turn: .95, look: [1, 0], lid: .05, mouth: { w: 16, open: .1, smile: -.1, shape: '' }, browL: [-4, .3, 0], browR: [-4, .3, 0] } });
    const declare = P({ armL: [-96, -410], armR: [100, -560], chest: 1.5, headDY: -12, headRoll: -2, f: { turn: .95, look: [1, -.1], lid: .1, mouth: { w: 20, open: .4, smile: -.2, teeth: 1, shape: '' }, browL: [-3, .35, 0], browR: [-3, .35, 0] } });
    p = tr([[35.78, relaxed], [36.1, toMirror, sm], [sc('tarihe') - .3, toMirror], [sc('tarihe') + .1, ready, sm], [sc('patlatıyorsun') - .1, ready], [sc('patlatıyorsun') + .25, declare, bk], [39.35, declare]], t);
    p.x = K([[35.78, X_MASA], [37.2, X_AYNA, eio]])(t);
  } else {
    const roll0 = P({ armL: [-96, -410], armR: [96, -410], f: { turn: .95, lid: .2, rollAmt: 1, roll: 0, look: [1, 0], mouth: FLAT, browL: [-2, .08, .05], browR: [-10, -.18, .35], blush: .15 } });
    const roll1 = P({ armL: [-96, -410], armR: [96, -410], f: { turn: .95, lid: .2, rollAmt: 1, roll: 1, look: [1, 0], mouth: FLAT, browL: [-2, .08, .05], browR: [-10, -.18, .35], blush: .15 } });
    const cross = P({ armL: [70, -468], armR: [-70, -452], headRoll: -4, f: { turn: .95, lid: .25, rollAmt: 0, look: [1, 0], mouth: { w: 15, open: 0, smile: -.5, shape: '' }, browL: [3, .35, 0], browR: [3, .35, 0] } });
    p = tr([[39.38, P({ armL: [-96, -410], armR: [100, -560], chest: 1.5, headDY: -12, f: { turn: .95, look: [1, 0], mouth: { w: 20, open: .4, smile: -.2, teeth: 1 }, browL: [-3, .35, 0], browR: [-3, .35, 0] } })], [s05('ben') + .3, roll0, sm], [s05('dans') + .1, roll1, eio], [s05('etmem') - .05, roll1], [s05('etmem') + .4, cross, sm], [41.6, cross]], t);
    p.x = X_AYNA;
  }
  return p;
}
// pozu çizim durumuna çevir (+ nefes, göz kırpma, hafif sallanma, yürüme zıplaması, titreme)
function toState(p, t, s) {
  const F = faceDef(); const f = p.f;
  Object.assign(F, { lid: f.lid, rollAmt: f.rollAmt, roll: f.roll, bulge: f.bulge, puff: f.puff, sweat: f.sweat, look: f.look, browL: f.browL, browR: f.browR, mouth: f.mouth, blush: f.blush, turn: f.turn });
  F.blink = blinkAt(t);
  const v = (maryState(t + .05).x - maryState(t - .05).x) / .1;
  const walk = Math.min(1, Math.abs(v) / 120);
  const bob = walk * Math.abs(Math.sin(t * TAU * 1.5)) * 7;
  const breath = Math.sin(t * TAU * .3) * (1 - p.xray * .75);
  return { x: p.x + p.shake * Math.sin(t * 52) * 3.2, y: ZEMIN + p.y - bob, s, face: F, lean: p.lean + clamp(v / 500, -1, 1) * 2.2 + Math.sin(t * .9) * .4 + p.shake * Math.sin(t * 47) * .7, headRoll: p.headRoll + Math.sin(t * .7) * .7, headDX: p.headDX, headDY: p.headDY,
    chest: p.chest + breath * .5, waist: p.waist, xray: p.xray, xraySkirt: p.xraySkirt, armL: { t: [p.armL[0], p.armL[1] + Math.sin(t * 1.3) * 2], flip: false }, armR: { t: [p.armR[0], p.armR[1] + Math.cos(t * 1.1) * 2], flip: true }, rods: [] };
}

// ---------------------------------------------------------------- KAMERA
function s02k(w) { return W('s02', w); }
const CAM = {
  B: [[3.12, 800, 520, 1.3], [4.6, 1180, 540, 1.12], [6.3, 1420, 540, 1.1], [s02k('akşam') + .2, 1380, 540, 1.1], [s02k('balosu'), 1250, 530, 1.14], [s02k('davetiye'), 1470, 540, 1.28], [s02k('cebinde') + .15, 1560, 520, 1.34], [s02k('hazır') + .25, 1990, 560, 1.06], [s02k('özgüvenin') + .05, 1990, 560, 1.06], [s02k('tavan') + .45, 1600, 540, 1.2], [13.1, 1560, 540, 1.3]],
  C: [[13.1, 1560, 540, 1.3], [14.4, 1500, 560, 1.12], [15.6, 1510, 545, 1.5], [17.5, 1480, 548, 1.57], [20.4, 1500, 545, 1.62], [22.4, 1500, 550, 1.52], [23.08, 1500, 555, 1.45]],
  D1: [[23.08, 1050, 560, 1.18], [DT, 1060, 565, 1.24]],
  D2: [[DT, 1770, 575, 1.2], [26.7, 1800, 575, 1.28], [28.66, 1790, 572, 1.36]],
  E: [[28.66, 1790, 565, 1.5], [30.4, 1770, 570, 1.56], [32.0, 1810, 565, 1.6], [33.8, 1780, 570, 1.56], [35.78, 1790, 572, 1.62]],
  F: [[35.78, 1950, 560, 1.12], [38.0, 2580, 540, 1.14], [38.95, 2650, 530, 1.3], [39.38, 2660, 530, 1.38]],
  G: [[39.38, 2660, 530, 1.38], [41.6, 2680, 520, 1.5]]
};

// ---------------------------------------------------------------- ÇEKİMLER
function drawShotRoom(ctx, t, shot) {
  const cam = camPath(CAM[shot], t);
  const p = maryState(t);
  const s = .78;
  const R = { t, camx: cam.x, canapes: t < 25.62 ? 3 : t < 25.98 ? 2 : t < 26.34 ? 1 : 0, mirrorX: 2850 };
  const S = toState(p, t, s);
  // çubuklar: zamanla fırlar (E çekimi)
  if (t > 28.66 && t < 35.9) {
    const rd = [['cartlı', 0, -1, -.5, 210], ['cartlı', .2, 1, -.35, 190], ['curtlu', 0, -1, -.1, 230], ['curtlu', .2, 1, -.25, 200], ['dışarı', 0, -1, .25, 170], ['fırlamış', .05, 1, .15, 215], ['fırlamış', .3, -1, -.7, 180]];
    S.rods = rd.map(([w, dl, side, ang, L], i) => {
      const t0 = W('s04', w) + dl, k = spring(t, t0, 2.6, .32), y = -470 + (i % 4) * 24, base = hwAt(y, 56, 80) - 4, pre = (i < 4 ? 24 : 0) * sm(seg(t, W('s04', 'altından') + i * .07, W('s04', 'altından') + .35 + i * .07)) * (1 + .15 * Math.sin(t * 20));
      const popBack = (i === 3 && t > W('s04', 'içinde') + .5) ? 1 - sm(seg(t, W('s04', 'içinde') + .5, W('s04', 'içinde') + .72)) : 1;
      return { x: side * base, y, ang: side < 0 ? Math.PI - ang : ang, len: (pre + (L - pre) * k) * popBack };
    });
  }
  ctx.save(); ctx.translate(960, 540); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y);
  R.reflect = S.x > 2300 ? ((c2, mcx, bottom) => { const rs = Object.assign({}, S, { x: mcx, y: bottom - 26, s: .74, flip: false, shadow: false }); rs.face = Object.assign({}, S.face, { turn: 0, look: [-S.face.look[0] * .3, S.face.look[1]] }); drawMary(c2, rs); }) : null;
  drawRoom(ctx, R);
  if (t >= 23.08 && t < DT) drawInvite(ctx, 930, ZEMIN + 34, .14, .62, true);   // yerdeki davetiye
  drawMary(ctx, S);
  if (t >= s02k('cebinde') + .25 && t < 13.1) { const hx = S.x + (S.armR.t[0] + 4) * s, hy = ZEMIN + (S.armR.t[1] - 12) * s; const u = back(seg(t, s02k('cebinde') + .15, s02k('cebinde') + .55)); drawInvite(ctx, hx + 6, hy - 40 * (1 - u), -.12, .6 * Math.max(.2, u)); }
  overlays(ctx, t, S, s);
  ctx.restore();
  // G: alıntı ekran uzayında (yüz ve ayna kadrajı korunur)
  if (t >= W('s05', 'ben') - .05) {
    const INK = '#3b2a22', RED = '#8a2f2c';
    hand(ctx, 'Ben bununla', 50, 190, 88, INK, seg(t, W('s05', 'ben'), W('s05', 'dans') + .1), { rot: -.04, shadow: 'rgba(255,245,225,.55)' });
    hand(ctx, 'dans etmem!', 80, 290, 96, RED, seg(t, W('s05', 'dans'), W('s05', 'etmem') + .35), { rot: -.04, shadow: 'rgba(255,245,225,.55)' });
  }
  return cam;
}

function L2W(S, lx, ly) { return [S.x + lx * S.s, S.y + ly * S.s]; }
function textW(ctx, txt, size, fam = 'Caveat', wt = 700) { ctx.save(); ctx.font = `${wt} ${size}px ${fam}`; const w = ctx.measureText(txt).width; ctx.restore(); return w; }
function overlays(ctx, t, S, s) {
  const INK = '#3b2a22';
  // B: özgüven ölçeri
  if (t > 11.3 && t < 13.1) {
    const [gx, gy] = L2W(S, 310, -430); const L = K([[s02k('özgüvenin') + .05, 0], [s02k('özgüvenin') + .75, 1.18, eio]])(t);
    ctx.save(); ctx.translate(gx, gy); ctx.rotate(-.06); ctx.scale(.9, .9); drawGauge(ctx, 0, 0, L, t, s02k('özgüvenin') + .7, clamp(seg(t, 11.3, 11.7)));
    hand(ctx, 'özgüven', -52, 90, 56, INK, seg(t, s02k('özgüvenin'), s02k('özgüvenin') + .7), { rot: -.04 }); ctx.restore();
  }
  // C: röntgen etiketleri
  if (t >= 14.9 && t < 23.1) {
    ctx.save(); ctx.globalAlpha = 1 - seg(t, 22.5, 23.0);
    const lab = (txt, sid, word, lx, ly, ax, ay, side) => {
      const t0 = W(sid, word) - .02, [X, Y] = L2W(S, lx, ly), [A, B] = L2W(S, ax, ay), tw = textW(ctx, txt, 66);
      hand(ctx, txt, X, Y, 66, INK, seg(t, t0, t0 + .6), { rot: -.03 });
      const sx = side > 0 ? X + tw + 12 : X - 10, sy = Y - 14;
      pen(ctx, curve([sx, sy], [(sx + A) / 2, (sy + B) / 2 + 26], [A, B], 20), seg(t, t0 + .45, t0 + .9), 5, INK, { arrow: 15 });
    };
    lab('balina kemiği', 's03', 'balina', -520, -640, -52, -470, 1);
    lab('metal tel', 's03', 'metal', 150, -650, 68, -505, -1);
    lab('bağcık', 's03', 'bağcıktan', 150, -300, 14, -420, -1);
    const t1 = W('s03', 'nefes'); const [bx, by] = L2W(S, -560, -330);
    hand(ctx, 'nefes almak:', bx, by, 54, INK, seg(t, t1, t1 + .5));
    const box = (x, y, tt0) => pen(ctx, [[x, y], [x + 36, y], [x + 36, y + 36], [x, y + 36], [x, y]], seg(t, tt0, tt0 + .3), 4, INK);
    box(bx + 4, by + 40, t1 + .5); hand(ctx, 'zorunlu', bx + 52, by + 74, 46, INK, seg(t, t1 + .5, t1 + .9));
    box(bx + 4, by + 100, W('s03', 'isteğe') - .1); hand(ctx, 'isteğe bağlı', bx + 52, by + 134, 46, INK, seg(t, W('s03', 'isteğe') - .05, W('s03', 'bağlı') + .2));
    pen(ctx, [[bx + 8, by + 120], [bx + 20, by + 134], [bx + 52, by + 96]], seg(t, W('s03', 'bağlı') + .1, W('s03', 'bağlı') + .4), 7, '#8a2f2c');
    ctx.restore();
  }
  // D: dikiş patlar + grev tabelası
  if (t >= 26.5 && t < 28.66) {
    const tg = W('s03b', 'grev');
    const [tx, ty] = L2W(S, 70 * (S.waist > 1 ? S.waist : 1), -438);
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) { const k = spring(t, 26.62 + i * .06, 3, .35); const a = -.6 + i * .5; pen(ctx, [[tx, ty], [tx + Math.cos(a) * 46 * k, ty + Math.sin(a) * 40 * k - 16 * k], [tx + Math.cos(a) * 66 * k + 10, ty + Math.sin(a) * 30 * k + 10 * k]], 1, 3.4, '#a9794a'); }
    ctx.restore();
    const [sx, sy] = L2W(S, 210, -330); const u = back(seg(t, tg - .1, tg + .3));
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(-.1 + Math.sin(t * 9) * .05); ctx.scale(u, u);
    line(ctx, [[0, 0], [0, -120]], 7, C.ink); rrect(ctx, -62, -196, 124, 70, 6); ctx.fillStyle = '#f6ecd4'; ctx.fill(); ctx.lineWidth = 3.4; ctx.strokeStyle = C.ink; ctx.stroke();
    hand(ctx, 'GREV!', 0, -144, 54, '#8a2f2c', 1, { align: 'center' }); ctx.restore();
  }
  // E: elbise = şemsiye (kalemle çizilen şemsiye iskeleti)
  if (t >= W('s04', 'şemsiye') - .1 && t < 35.78) {
    const k = seg(t, W('s04', 'şemsiye') - .05, W('s04', 'şemsiye') + .9);
    const ap = L2W(S, 0, -452), hemY = -14;
    ctx.save(); ctx.globalAlpha = 1 - seg(t, 35.3, 35.75);
    const hemPts = []; for (let i = -3; i <= 3; i++) hemPts.push(L2W(S, i * 66, hemY + 22 * Math.pow(i / 3, 2) * -1));
    hemPts.forEach(([hx, hy], i) => pen(ctx, [ap, [hx, hy]], seg(k, i * .05, .6 + i * .05), 4, INK, { dash: [12, 9] }));
    const sc = []; for (let i = 0; i < hemPts.length - 1; i++) { const a = hemPts[i], b = hemPts[i + 1]; sc.push(...curve(a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 34], b, 8)); }
    pen(ctx, sc, seg(k, .5, 1), 5, INK, { dash: [12, 9] });
    pen(ctx, [ap, [ap[0], ap[1] - 70 * S.s], [ap[0] + 18, ap[1] - 84 * S.s]], seg(k, .2, .5), 5, INK);
    hand(ctx, 'şemsiye?', S.x + 330 * S.s, S.y - 560 * S.s, 66, INK, seg(t, W('s04', 'şemsiye') + .25, W('s04', 'taşıyorsun') + .3), { rot: .05 });
    ctx.restore();
  }
}

function acilisCiz(ctx, t) {
  const W_ = 1920, H_ = 1080;
  ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W_, H_);
  const shotAt = t < 3.0 ? 'A' : t < 13.1 ? 'B' : t < 23.08 ? 'C' : t < 28.66 ? (t < DT ? 'D1' : 'D2') : t < 35.78 ? 'E' : t < 39.38 ? 'F' : 'G';
  if (shotAt === 'A' || t < 3.4) {
    const ta = Math.min(t, 3.119), pan = ta * 55, z = 1 + ta * .035;
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540); drawStreet(ctx, ta, { pan }); ctx.restore();
    const INKC = '#f7ecd2', SH = 'rgba(40,24,18,.6)';
    hand(ctx, 'Yıl', 170, 300, 130, INKC, seg(ta, 0.0, .45), { shadow: SH });
    hand(ctx, '1913', 380, 318, 200, INKC, seg(ta, .22, 1.2), { fam: 'Alegreya', it: true, wt: 800, shadow: SH });
    hand(ctx, 'New York', 190, 470, 150, INKC, seg(ta, 1.65, 2.7), { shadow: SH });
  }
  if (shotAt !== 'A') {
    ctx.save(); if (t < 3.4) ctx.globalAlpha = clamp((t - 3.0) / .4);
    drawShotRoom(ctx, t, shotAt); ctx.restore();
  }
  vignette(ctx, W_, H_, .42); grainOverlay(ctx, W_, H_, .1);
}
