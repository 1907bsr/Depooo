'use strict';
// ===== Açılış (0 – 53,1 sn): s01–s06. Mary, 1913. Tüm hareketler kodla; zamanlar zaman_tum.js'den (konuşma tahmini) =====
const SMILE = MOUTH.smile, GRIN = MOUTH.grin, FLAT = MOUTH.flat;
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
  const s02 = k => W('s02', k), s03 = k => W('s03', k), s04 = k => W('s04', k), sc = k => W('s02c', k), s05 = k => W('s05', k), s06 = k => W('s06', k);
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
    p.x = K([[35.78, 2050], [37.0, X_AYNA, eio]])(t);
  } else if (t < 41.57) {
    const roll0 = P({ armL: [-96, -410], armR: [96, -410], f: { turn: .95, lid: .2, rollAmt: 1, roll: 0, look: [1, 0], mouth: FLAT, browL: [-2, .08, .05], browR: [-10, -.18, .35], blush: .15 } });
    const roll1 = P({ armL: [-96, -410], armR: [96, -410], f: { turn: .95, lid: .2, rollAmt: 1, roll: 1, look: [1, 0], mouth: FLAT, browL: [-2, .08, .05], browR: [-10, -.18, .35], blush: .15 } });
    const cross = P({ armL: [70, -468], armR: [-70, -452], headRoll: -4, f: { turn: .95, lid: .25, rollAmt: 0, look: [1, 0], mouth: { w: 15, open: 0, smile: -.5, shape: '' }, browL: [3, .35, 0], browR: [3, .35, 0] } });
    p = tr([[39.38, P({ armL: [-96, -410], armR: [100, -560], chest: 1.5, headDY: -12, f: { turn: .95, look: [1, 0], mouth: { w: 20, open: .4, smile: -.2, teeth: 1 }, browL: [-3, .35, 0], browR: [-3, .35, 0] } })], [s05('ben') + .3, roll0, sm], [s05('dans') + .1, roll1, eio], [s05('etmem') - .05, roll1], [s05('etmem') + .4, cross, sm], [41.5, cross]], t);
    p.x = X_AYNA;
  } else {
    // s06: hizmetçi sahnesi (Mary salonda, kesme)
    const toMaid = { turn: -.7, look: [-1, 0] };
    const ring = P({ armL: [-96, -410], armR: [118, -604], headDY: -6, headRoll: 3, f: Object.assign({ lid: .12, mouth: MOUTH.talk, browL: [-4, .1, .1], browR: [-4, .1, .1] }, toMaid) });
    const order = P({ armL: [-96, -410], armR: [160, -540], headRoll: 2, f: Object.assign({ mouth: MOUTH.talk, browL: [-6, 0, .2], browR: [-6, 0, .2] }, toMaid) });
    const wait = P({ armL: [-96, -410], armR: [96, -410], f: Object.assign({ lid: .15, mouth: MOUTH.smile, browL: [-3, 0, .1], browR: [-3, 0, .1], blush: .45 }, toMaid) });
    const nope = P({ armL: [-96, -410], armR: [96, -410], headDY: -6, f: { lid: .2, mouth: GRIN, browL: [-5, .1, .2], browR: [-5, .1, .2], blush: .7, look: [0, 0] } });
    const hero = P({ armL: [-96, -410], armR: [240, -560], headDY: -14, headRoll: 5, chest: 1.4, f: { lid: .55, mouth: GRIN, browL: [-9, -.1, .3], browR: [-9, -.1, .3], blush: .8, look: [.4, -.2], turn: .3 } });
    p = tr([[41.57, ring], [42.9, ring], [43.2, order, sm], [44.7, order], [45.1, wait, sm], [s06('ama') - .2, wait], [s06('ama') + .1, nope, bk], [s06('hanımefendi', 3) - .1, nope], [s06('tarih') - .15, hero, bk], [53.1, hero]], t);
    p.x = 1500;
  }
  return p;
}
// hizmetçi (yalnız s06)
function maidState(t) {
  const s06 = k => W('s06', k);
  const att = P({ armL: [16, -432], armR: [-16, -432], headDY: 2, f: { mouth: { w: 13, open: 0, smile: .2, teeth: 0, shape: '' }, browL: [-5, -.05, .2], browR: [-5, -.05, .2], look: [1, 0], turn: .5, blush: .3 } });
  const worry = (k) => P({ armL: [30 + k * 8, -410], armR: [-30 - k * 8, -430], headDY: 4, headRoll: -3, f: { mouth: { w: 13, open: .1, smile: -.6, teeth: 0, shape: '' }, browL: [-10, -.45, .2], browR: [-10, -.45, .2], sweat: .7, look: [0, -.5], turn: .2, bulge: .3 } });
  const wow = P({ armL: [20, -480], armR: [-20, -480], headDY: -4, f: { mouth: MOUTH.o, browL: [-14, -.25, .4], browR: [-14, -.25, .4], bulge: .8, look: [1, 0], turn: .5 } });
  const awe = P({ armL: [30, -560], armR: [-30, -560], headRoll: 4, f: { mouth: MOUTH.smile, browL: [-8, -.1, .3], browR: [-8, -.1, .3], blush: .7, look: [1, -.2], turn: .5, lid: .1 } });
  let p = tr([[42.0, att], [44.1, att], [45.1, worry(0)], [46.2, worry(1)], [46.7, worry(0)], [47.2, worry(1)], [47.7, worry(0)], [48.2, worry(1)], [48.9, worry(0)], [s06('ama') + .15, wow, bk], [s06('hanımefendi', 3) + .2, wow], [s06('tarih') + .1, awe, bk], [53.1, awe]], t);
  p.x = K([[41.6, 300], [43.9, 1130, sm]])(t);
  return p;
}

// ---------------------------------------------------------------- KAMERA (yan kayma yok: sabit merkez + yavaş yakınlaşma; yer değişimi kesmeyle)
function camOf(t) {
  if (t < 9.1) return zc(1300, 560, 1.0, 1.07, t, 3.0, 9.1);
  if (t < 10.4) return zc(1560, 545, 1.35, 1.39, t, 9.1, 10.4);
  if (t < 11.5) return zc(2480, 600, 1.2, 1.24, t, 10.4, 11.5);
  if (t < 13.1) return zc(1600, 545, 1.3, 1.37, t, 11.5, 13.1);
  if (t < 23.08) return zc(1500, 545, 1.5, 1.6, t, 13.1, 23.08);
  if (t < DT) return zc(1090, 560, 1.2, 1.25, t, 23.08, DT);
  if (t < 28.66) return zc(1790, 575, 1.25, 1.35, t, DT, 28.66);
  if (t < 35.78) return zc(1790, 570, 1.55, 1.63, t, 28.66, 35.78);
  if (t < 39.38) return zc(2650, 540, 1.12, 1.3, t, 35.78, 39.38);
  if (t < 41.57) return zc(2660, 530, 1.38, 1.5, t, 39.38, 41.57);
  if (t < 44.8) return zc(1300, 560, 1.0, 1.04, t, 41.57, 44.8);
  if (t < 48.9) return zc(1250, 500, 1.1, 1.14, t, 44.8, 48.9);
  return zc(1560, 560, 1.22, 1.32, t, 48.9, 53.1);
}

// ---------------------------------------------------------------- ÇEKİMLER
function bellProp(t, ringing) { return (c) => { c.save(); c.translate(0, 26); c.rotate(ringing ? Math.sin(t * 34) * .38 : 0); line(c, [[0, 0], [0, -22]], 6, C.ink); shape(c, [[-22, 24], [-14, -6], [0, -14], [14, -6], [22, 24]], '#d3a94a', '#a07f33', { sw: 2.6, seed: 201, sx: -3, sy: -2 }); ell(c, 0, 26, 6, 6, '#8a6a22', C.ink, 2); c.restore(); }; }
function quillProp(t) { return (c) => { c.save(); c.translate(0, 8); c.rotate(.5); line(c, [[0, 0], [0, 70]], 5, C.ink); shape(c, [[0, 20], [-22, 40], [-12, 92], [8, 112], [14, 70]], '#efe9dc', '#cfc7b8', { sw: 2.4, seed: 202, sx: -3, sy: -2 }); c.restore(); }; }

function drawOpening(ctx, t) {
  const cam = camOf(t);
  const gk = cam.z < 1.15 ? FIGO : 1;   // geniş çekimlerde figürler büyür; yakın çekimler aynı (yüz kesilmesin)
  const p = maryState(t), S = buyut(pose2state(p, t, { s: .78 }), { k: gk });
  const s = S.s;
  const R = { t, camx: cam.x, canapes: t < 25.62 ? 3 : t < 25.98 ? 2 : t < 26.34 ? 1 : 0, mirrorX: 2850 };
  // yürüme zıplaması
  const v = (maryState(t + .05).x - maryState(t - .05).x) / .1;
  const walk = Math.min(1, Math.abs(v) / 120);
  S.y -= walk * Math.abs(Math.sin(t * TAU * 1.5)) * 7; S.lean += clamp(v / 500, -1, 1) * 2.2;
  if (t > 28.66 && t < 35.9) {   // çubuklar
    const rd = [['cartlı', 0, -1, -.5, 210], ['cartlı', .2, 1, -.35, 190], ['curtlu', 0, -1, -.1, 230], ['curtlu', .2, 1, -.25, 200], ['dışarı', 0, -1, .25, 170], ['fırlamış', .05, 1, .15, 215], ['fırlamış', .3, -1, -.7, 180]];
    S.rods = rd.map(([w, dl, side, ang, L], i) => {
      const t0 = W('s04', w) + dl, k = spring(t, t0, 2.6, .32), y = -470 + (i % 4) * 24, base = hwAt(y, 56, 80) - 4, pre = (i < 4 ? 24 : 0) * sm(seg(t, W('s04', 'altından') + i * .07, W('s04', 'altından') + .35 + i * .07)) * (1 + .15 * Math.sin(t * 20));
      const popBack = (i === 3 && t > W('s04', 'içinde') + .5) ? 1 - sm(seg(t, W('s04', 'içinde') + .5, W('s04', 'içinde') + .72)) : 1;
      return { x: side * base, y, ang: side < 0 ? Math.PI - ang : ang, len: (pre + (L - pre) * k) * popBack };
    });
  }
  const s06 = t >= 41.57;
  if (s06) {
    if (t < 43.0) S.armR.hold = bellProp(t, true); else if (t < 44.7) S.armR.hold = bellProp(t, false);
    if (t >= W('s06', 'tarih') - .3) S.armR.hold = quillProp(t);
  }
  ctx.save(); kam(ctx, cam);
  R.reflect = S.x > 2300 ? ((c2, mcx, bottom) => { const rs = Object.assign({}, S, { x: mcx, y: bottom - 26, s: .74, flip: false, shadow: false }); rs.face = Object.assign({}, S.face, { turn: 0, look: [-S.face.look[0] * .3, S.face.look[1]] }); drawMary(c2, rs); }) : null;
  drawRoom(ctx, R);
  if (t >= 23.08 && t < DT) drawInvite(ctx, 930, ZEMIN + 34, .14, .62, true);
  if (s06) {
    const mS = buyut(pose2state(maidState(t), t, { s: .78, look: 'maid', off: 1.3, flipL: false, flipR: true }), { k: gk });
    mS.x = maidState(t).x; mS.face.turn = maidState(t).f.turn;
    const mv = (maidState(t + .05).x - maidState(t - .05).x) / .1; mS.y -= Math.min(1, Math.abs(mv) / 120) * Math.abs(Math.sin(t * TAU * 1.8)) * 7;
    maidLayer(ctx, t, S, mS);
  } else drawMary(ctx, S);
  if (t >= W('s02', 'cebinde') + .25 && t < 13.1) { const hx = S.x + (S.armR.t[0] + 4) * s, hy = ZEMIN + (S.armR.t[1] - 12) * s; const u = back(seg(t, W('s02', 'cebinde') + .15, W('s02', 'cebinde') + .55)); drawInvite(ctx, hx + 6, hy - 40 * (1 - u), -.12, .6 * Math.max(.2, u)); }
  overlays(ctx, t, S, s);
  ctx.restore();
  // gerçek kanıt: 1885 korsesi (The Met, CC0)
  if (t >= 13.1 && t < 23.08) kanitKart(ctx, t, IMG.met1, W('s03', 'korse') - .1, 22.9, 1665, 640, 380, 380, .05, 'gerçek bir korse (~1885)');
  // G: alıntı ekran uzayında
  if (t >= W('s05', 'ben') - .05 && t < 41.57) {
    hand(ctx, 'Ben bununla', 50, 190, 88, INK, seg(t, W('s05', 'ben'), W('s05', 'dans') + .1), { rot: -.04, shadow: 'rgba(255,245,225,.55)' });
    hand(ctx, 'dans etmem!', 80, 290, 96, RED, seg(t, W('s05', 'dans'), W('s05', 'etmem') + .35), { rot: -.04, shadow: 'rgba(255,245,225,.55)' });
  }
}

// s06: Mary + hizmetçi + düşünce balonu + mendil/kurdele karalamaları + TARİH defteri
function maidLayer(ctx, t, S, mS) {
  const s06 = k => W('s06', k);
  // hizmetçi, Mary'den önce çizilir (Mary öne çıksın)
  drawMary(ctx, mS);
  drawMary(ctx, S);
  // karalamalar: 2 mendil + kurdele (Mary'nin elinin yanında, kalemle belirir)
  const [mx, my] = L2W(S, 330, -690);
  const hk = (x, y, k, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const pts = [[-34, -28], [30, -34], [38, 4], [30, 34], [-28, 30], [-38, -4], [-34, -28]]; pen(ctx, pts, k, 5, INK); if (k > .9) for (const [a, b] of [[-18, -10], [0, 4], [16, -8], [-6, 18]]) ell(ctx, a, b, 3, 3, INK, null); ctx.restore(); };
  if (t > s06('mendil') - .1 && t < 45.4) {
    const fade = 1 - seg(t, 44.9, 45.4); ctx.save(); ctx.globalAlpha = fade;
    hk(mx - 120, my + 10, seg(t, s06('mendil') - .05, s06('mendil') + .35), -.12);
    hk(mx - 30, my - 18, seg(t, s06('mendil') + .15, s06('getir') + .2), .1);
    const k2 = seg(t, s06('kurdele'), s06('kurdele') + .5); pen(ctx, [[mx + 70, my - 4], [mx + 110, my - 40], [mx + 126, my + 8], [mx + 70, my - 4], [mx + 28, my - 26], [mx + 22, my + 16], [mx + 70, my - 4], [mx + 60, my + 40], [mx + 74, my + 56]], k2, 5, RED);
    hand(ctx, '2', mx - 156, my - 52, 64, INK, seg(t, s06('2') - .05, s06('2') + .25), { fam: 'Alegreya', it: true, wt: 800 });
    ctx.restore();
  }
  // düşünce balonu (hizmetçinin üstünde)
  const bx = mS.x - 250, by = 200;
  if (t > s06('düşünüyor') - .1 && t < s06('ama') + .35) {
    const grow = bk(seg(t, s06('düşünüyor'), s06('düşünüyor') + .35)), pop = seg(t, s06('ama'), s06('ama') + .25);
    const sc = grow * (1 + pop * .5) * 1.1, al = 1 - pop;
    ctx.save(); ctx.globalAlpha = al; ctx.translate(bx, by); ctx.scale(sc, sc);
    const cl = [[-110, -10, 70], [-40, -70, 78], [50, -64, 72], [112, -6, 66], [40, 50, 70], [-50, 54, 68]];
    for (const [cx, cy, r] of [[96, 150, 12], [62, 118, 17], [28, 82, 24]]) ell(ctx, cx, cy, r, r, '#f8f1e2', C.ink, 3);
    ctx.lineWidth = 7; ctx.strokeStyle = C.ink; for (const [cx, cy, r] of cl) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); }
    ctx.fillStyle = '#f8f1e2'; for (const [cx, cy, r] of cl) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); }
    // içeride ağlayan Mary (büst)
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, -4, 120, 90, 0, 0, TAU); ctx.clip();
    const cry = pose2state(P({ headDY: 4, f: { mouth: MOUTH.sad, browL: [-8, -.5, .2], browR: [-8, -.5, .2], look: [0, .4], lid: .3, blush: .5 } }), t, { s: .3, bust: true, off: 2 });
    cry.face.tears = clamp(seg(t, s06('ağlayacak') - .2, s06('ağlayacak') + .5)); cry.face.mouth = { w: 15, open: .5, smile: -.9, teeth: 0, shape: '' };
    cry.x = 0; cry.y = 192; drawMary(ctx, cry);
    ctx.restore(); ctx.restore();
  }
  // TARİH defteri (kürsü üstünde) + kalemle yazı
  if (t > s06('tarih') - .3) {
    const u = bk(seg(t, s06('tarih') - .3, s06('tarih') + .3));
    const bxx = 1840, byy = 690;
    ctx.save(); ctx.translate(bxx, byy + (1 - u) * 300); ctx.scale(u * .85, u * .85);
    shape(ctx, [[-70, 0], [70, 0], [96, 230], [-96, 230]], C.woodD, C.wood, { sw: 3, seed: 210, sx: -4, sy: -3 });   // kürsü ayağı
    shape(ctx, [[-170, -150], [-6, -134], [-6, 6], [-170, -4]], '#f3e9cf', '#dccfa9', { sw: 3, seed: 211, sx: -4, sy: -3 });   // sol sayfa
    shape(ctx, [[6, -134], [170, -150], [170, -4], [6, 6]], '#f3e9cf', '#dccfa9', { sw: 3, seed: 212, sx: -4, sy: -3 });     // sağ sayfa
    shape(ctx, [[-184, -156], [-184, 14], [184, 14], [184, -156], [172, -148], [172, -2], [-172, -2], [-172, -148]], '#6f3f2a', '#4d2a1c', { sw: 3, seed: 213, sx: -4, sy: -3 });
    for (let i = 0; i < 5; i++) { line(ctx, [[-150, -110 + i * 22], [-30, -100 + i * 22]], 2, '#cbbd96'); }
    const k = seg(t, s06('yazacak') - .1, 53.05);
    pen(ctx, [[20, -110], [60, -118], [90, -98], [120, -116], [150, -100], [30, -86], [70, -92], [100, -76], [140, -86]], k, 4.5, INK);
    hand(ctx, 'TARİH', 0, -190, 84, INK, seg(t, s06('tarih'), s06('tarih') + .5), { fam: 'Alegreya', it: true, wt: 800, align: 'center' });
    ctx.restore();
  }
}

// el yazısı notlar ve çizimler (dünya koordinatı = Mary yerel koordinatından)
function overlays(ctx, t, S, s) {
  // B: özgüven ölçeri
  if (t > 11.3 && t < 13.1) {
    const [gx, gy] = L2W(S, 310, -430); const L = K([[W('s02', 'özgüvenin') + .05, 0], [W('s02', 'özgüvenin') + .75, 1.18, eio]])(t);
    ctx.save(); ctx.translate(gx, gy); ctx.rotate(-.06); ctx.scale(.9, .9); drawGauge(ctx, 0, 0, L, t, W('s02', 'özgüvenin') + .7, clamp(seg(t, 11.3, 11.7)));
    hand(ctx, 'özgüven', -52, 90, 56, INK, seg(t, W('s02', 'özgüvenin'), W('s02', 'özgüvenin') + .7), { rot: -.04 }); ctx.restore();
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

function drawStreetShot(ctx, t) {
  const ta = Math.min(t, 3.119), pan = ta * 25, z = 1 + ta * .035;
  ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540); drawStreet(ctx, ta, { pan }); ctx.restore();
  const INKC = '#f7ecd2', SH = 'rgba(40,24,18,.6)';
  hand(ctx, 'Yıl', 170, 300, 130, INKC, seg(ta, 0.0, .45), { shadow: SH });
  hand(ctx, '1913', 380, 318, 200, INKC, seg(ta, .22, 1.2), { fam: 'Alegreya', it: true, wt: 800, shadow: SH });
  hand(ctx, 'New York', 190, 470, 150, INKC, seg(ta, 1.65, 2.7), { shadow: SH });
}
sahne('acilis', 0, 53.09, (ctx, t) => {
  if (t < 3.4) drawStreetShot(ctx, t);
  if (t >= 3.0) { ctx.save(); if (t < 3.4) ctx.globalAlpha = clamp((t - 3.0) / .4); drawOpening(ctx, t); ctx.restore(); }
});
