'use strict';
// ===== Sahneler 1: s08–s13 =====
const tw = (ctx, font, txt) => { ctx.save(); ctx.font = font; const w = ctx.measureText(txt).width; ctx.restore(); return w; };
const T = (ctx, t, txt, x, y, size, col, t0, t1, o) => hand(ctx, txt, x, y, size, col, seg(t, t0, t1), o);
const handPos = (S, arm) => [S.x + arm.t[0] * S.s, S.y + arm.t[1] * S.s];

// ---------------- s08: "Yalnız bir dakika… 500 yıldır bekleyen bir sır var"
sahneS('s08', (ctx, t) => {
  const id = 's08', b = SAH[id].bas, tc = W(id, 'avusturyada') - .15;
  if (t < tc) {
    const stop = P({ armR: [150, -650], armL: [-96, -410], headDY: -4, f: { mouth: { w: 12, open: .3, smile: .1, shape: '' }, browL: [-10, -.1, .3], browR: [-10, -.1, .3], look: [0, 0], lid: 0 } });
    const self = P({ armR: [26, -520], armL: [-96, -410], headRoll: -4, f: { mouth: MOUTH.o, browL: [-12, -.2, .35], browR: [-12, -.2, .35], bulge: .5, look: [0, .2] } });
    const no = P({ armR: [150, -470], armL: [-150, -470], f: { mouth: { w: 14, open: .2, smile: -.5, shape: '' }, browL: [-8, .25, .2], browR: [-8, .25, .2], sweat: .4, look: [0, 0] } });
    const S = actor('mary', [[b, stop], [W(id, 'sütyeni') - .15, stop], [W(id, 'sütyeni') + .1, self, bk], [W(id, 'sen') - .1, self], [W(id, 'sen') + .15, no, bk], [tc, no]], t, { x: 1500 });
    if (t > W(id, 'sen') + .2) S.headRoll += Math.sin((t - W(id, 'sen')) * 11) * 6 * (1 - seg(t, W(id, 'değilsin') + .3, tc));
    ctx.save(); kam(ctx, zc(1500, 545, 1.35, 1.45, t, b, tc)); drawRoom(ctx, { t, camx: 1500, canapes: 0 }); drawMary(ctx, S); ctx.restore();
    // el yazısı: soru işareti
    T(ctx, t, '?', 1180, 300, 190, RED, W(id, 'sütyeni') + .3, W(id, 'sütyeni') + .6, { fam: 'Alegreya', it: true, wt: 800 });
  } else {
    const t0 = tc, z = 1 + .06 * seg(t, t0, b + SAH[id].dur);
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    skyGrad(ctx, '#cdbfcf', '#e8d3c4', '#f3e6d6', 760);
    ridge(ctx, 520, 170, .7, '#a89fb0', '#f4efe8'); ridge(ctx, 610, 120, 2.1, '#8c8a98', '#eee8e2'); ridge(ctx, 700, 80, 3.3, '#6f7a68', null);
    fogBand(ctx, t, 610, .3, 9);
    shape(ctx, [[-100, 1100], [-100, 790], [300, 730], [700, 640], [1000, 610], [1400, 650], [1800, 730], [2020, 790], [2020, 1100]], '#6f8a55', '#55703f', { sw: 3, seed: 420, sx: -10, sy: -6 });
    castle(ctx, 960, 650, .85, t);
    // toprak kesiti
    ctx.fillStyle = '#5b4636'; ctx.fillRect(-100, 830, 2120, 300); ctx.fillStyle = '#6a5240'; for (let i = 0; i < 24; i++) { ctx.beginPath(); ctx.ellipse((i * 211) % 1900, 860 + (i * 47) % 200, 26 + (i % 4) * 8, 14, 0, 0, TAU); ctx.fill(); }
    for (const y of [870, 930, 990]) { ctx.strokeStyle = 'rgba(30,20,12,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-100, y); ctx.lineTo(2020, y + 8); ctx.stroke(); }
    shape(ctx, [[760, 880], [1160, 880], [1200, 1060], [720, 1060]], '#2a1f16', '#1d150e', { sw: 3, seed: 421 });
    // bohça + ip + örümcek ağı
    ctx.save(); ctx.translate(960, 1030); ctx.scale(1.3, 1.3); shape(ctx, [[-70, 0], [-50, -50], [0, -64], [56, -48], [74, 0], [30, 14], [-30, 14]], '#e9dcc0', '#cdbf9f', { sw: 3, seed: 422, sx: -8, sy: -4 }); line(ctx, [[-14, -52], [0, -78], [14, -52]], 5, '#a9794a'); ell(ctx, 0, -62, 9, 9, '#a9794a', C.ink, 2.4); ctx.restore();
    for (let i = 0; i < 4; i++) line(ctx, [[762, 882], [762 + 40 + i * 14, 882 + 20 + i * 24]], 2, '#b9b2a2'); line(ctx, [[780, 900], [830, 892], [850, 930]], 2, '#b9b2a2'); line(ctx, [[780, 934], [820, 924], [836, 958]], 2, '#b9b2a2');
    T(ctx, t, '500 yıl', 1290, 900, 112, CREAM, W(id, '500') - .1, W(id, '500') + .6, { fam: 'Alegreya', it: true, wt: 800, shadow: 'rgba(30,18,10,.7)' });
    pen(ctx, curve([1310, 920], [1250, 990], [1130, 1020], 18), seg(t, W(id, 'bekleyen'), W(id, 'bekleyen') + .5), 6, CREAM, { arrow: 18 });
    T(ctx, t, '?', 960, 850, 170, '#f6dc8a', W(id, 'sır') - .1, W(id, 'sır') + .3, { fam: 'Alegreya', it: true, wt: 800, align: 'center', shadow: 'rgba(30,18,10,.7)' });
    T(ctx, t, 'Avusturya', 150, 170, 104, '#4a3a4a', W(id, 'avusturyada'), W(id, 'avusturyada') + .6, { rot: -.03 });
    ctx.restore();
  }
});

// ---------------- s09: Otto – bütün dünyayı kandıran mucit… hiç yaşamadı
sahneS('s09', (ctx, t) => {
  const id = 's09', b = SAH[id].bas, tl = t - b;
  const hic = W(id, 'hiç');
  ctx.save(); const z = 1 + .04 * seg(t, b, b + SAH[id].dur); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
  curtainBG(ctx, t);
  const fade = 1 - seg(t, hic - .05, hic + .8);
  const cx = 960, cy = 440;
  // çerçeve
  ctx.save(); ctx.translate(cx, cy);
  ell(ctx, 0, 0, 280, 372, C.gold, C.ink, 5); ell(ctx, 0, 0, 258, 350, C.goldD, C.ink, 3); ell(ctx, 0, 0, 240, 332, '#d8c5a2', C.ink, 3);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 238, 330, 0, 0, TAU); ctx.clip();
  ctx.fillStyle = '#a58c68'; ctx.fillRect(-250, -340, 500, 680);
  ctx.save(); ctx.globalAlpha = .25 + .75 * fade;
  const o = actor('otto', [[b, P({ f: { mouth: MOUTH.smile, browL: [-4, .05, .2], browR: [-4, .05, .2], look: [-.4, .1], lid: .1, blush: .1 } })], [W(id, 'kandıran') - .1, P({ headRoll: 3, f: { mouth: MOUTH.grin, browL: [-8, -.1, .3], browR: [-8, -.1, .3], look: [.5, .1], lid: .3, blush: .2 } }), sm], [hic - .1, P({ f: { mouth: MOUTH.grin, browL: [-8, -.1, .3], browR: [-8, -.1, .3], look: [0, 0] } })], [hic + .5, P({ f: { mouth: MOUTH.o, browL: [-12, -.3, .4], browR: [-12, -.3, .4], look: [0, .4], bulge: .6 } }), bk]], t, { x: 0, y: 0, s: 1.62, bust: true, off: .4 });
  o.y = 1120; o.x = 0; drawMary(ctx, o);
  ctx.restore();
  // hayalet çizgi (kesikli) – hiç yaşamadı
  if (fade < 1) { ctx.save(); ctx.globalAlpha = 1 - fade; ctx.setLineDash([14, 12]); ctx.lineWidth = 5; ctx.strokeStyle = '#3b2a22'; ctx.beginPath(); ctx.ellipse(0, -66, 118, 138, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-190, 200); ctx.quadraticCurveTo(-170, 90, -70, 76); ctx.lineTo(70, 76); ctx.quadraticCurveTo(170, 90, 190, 200); ctx.stroke(); ctx.restore(); }
  ctx.restore(); ctx.restore();
  // künye
  const ku = bk(seg(t, W(id, 'otto') - .1, W(id, 'otto') + .3));
  ctx.save(); ctx.translate(cx, cy + 394); ctx.scale(ku, ku); shape(ctx, [[-100, -24], [100, -24], [100, 24], [-100, 24]], '#d3a94a', '#a07f33', { sw: 3, seed: 430, sx: -4, sy: -3 }); hand(ctx, 'Otto', 0, 14, 48, INK, 1, { fam: 'Alegreya', it: true, wt: 800, align: 'center' }); ctx.restore();
  // seyirciler ("bütün dünya")
  const seq = (look) => [[b, P({ f: { mouth: MOUTH.smile, look: [0, -.3], browL: [-8, 0, .3], browR: [-8, 0, .3], blush: .6 } })], [hic - .1, P({ f: { mouth: MOUTH.smile, look: [0, -.3], browL: [-8, 0, .3], browR: [-8, 0, .3], blush: .6 } })], [hic + .5, P({ headRoll: look * 8, f: { mouth: MOUTH.flat, look: [look * .8, -.2], browL: [-3, .3, .1], browR: [-3, -.3, .1], blush: .2 } }), bk]];
  const sp = [['lady1', 230, 1], ['wig1', 620, -1], ['lady3', 1310, 1], ['wig2', 1690, -1]];
  sp.forEach(([lk, x, d], i) => { const S = actor(lk, seq(d), t, { x, y: 140, s: .75, bust: true, off: i * 1.1 }); S.y = 1395; S.headDY += Math.sin(t * 5 + i * 2) * 3 * (1 - seg(t, hic, hic + .4)); drawMary(ctx, S); });
  shape(ctx, [[-100, 905], [2020, 905], [2020, 1100], [-100, 1100]], C.woodD, C.wood, { sw: 3, seed: 431, sx: 0, sy: -8 });
  T(ctx, t, 'hiç yaşamadı', 960, 1030, 120, CREAM, hic, hic + .9, { rot: -.02, align: 'center', shadow: 'rgba(30,18,10,.8)' });
  for (const [x, d] of [[330, 1], [1420, -1]]) T(ctx, t, '?', x, 800, 120, '#f6dc8a', hic + .5, hic + .8, { fam: 'Alegreya', it: true, wt: 800, shadow: 'rgba(30,18,10,.8)' });
});

// ---------------- s10: logo – İcatbuldum!
sahneS('s10', (ctx, t) => {
  const id = 's10', tl = t - SAH[id].bas;
  plainBG(ctx, '#f3e8d0', '#dfcba4');
  const fi = "italic 800 250px Alegreya", w1 = tw(ctx, fi, 'İcat'), w2 = tw(ctx, '700 250px Caveat', 'buldum'), W2 = tw(ctx, "italic 800 250px Alegreya", '!');
  const tot = w1 + 30 + w2, x0 = 960 - (tot + 110) / 2;
  hand(ctx, 'İcat', x0, 560, 250, INK, seg(tl, .05, .7), { fam: 'Alegreya', it: true, wt: 800 });
  hand(ctx, 'buldum', x0 + w1 + 30, 560, 250, '#b8892e', seg(tl, .5, 1.2), { shadow: 'rgba(59,42,34,.5)' });
  const k = spring(tl, 1.1, 2.4, .3), wob = Math.sin(tl * 13) * 5 * Math.exp(-2.4 * Math.max(0, tl - 1.1));
  if (tl > 1.1) { ctx.save(); ctx.translate(x0 + tot + 40, 520); ctx.rotate(wob * .02); ctx.scale(k, k); hand(ctx, '!', 0, 40, 330, '#e06a50', 1, { fam: 'Alegreya', it: true, wt: 800 }); ctx.restore(); }
  // ampul (buldum! → yanar)
  const on = tl > 1.0; drawBulb(ctx, x0 + tot * .62, 220 - 20 * Math.max(0, 1 - tl * 3), .9, on, t);
  if (on) { ctx.save(); ctx.globalAlpha = .3 * clamp((tl - 1.0) * 3); glow(ctx, x0 + tot * .62, 200, 340, 'rgba(255,224,130,A)', 1); ctx.restore(); }
  const sub = 'Sütyeni gerçekten kim buldu?'; const n = Math.floor(clamp(seg(tl, 1.5, 3.0)) * sub.length);
  hand(ctx, sub.slice(0, n), 960, 800, 92, INK, 1, { fam: 'Alegreya', it: true, wt: 700, align: 'center' });
  line(ctx, [[x0 + 20, 600], [x0 + tot - 20, 604]], 6, '#b8892e');
});

// ---------------- s11: Geri saralım – sütyen yokken… bir bez
sahneS('s11', (ctx, t) => {
  const id = 's11', b = SAH[id].bas, tl = t - b;
  plainBG(ctx, '#efe3c9', '#dbc9a2');
  // sol: düşünen Mary (büst)
  const cap = W(id, 'cevap');
  const think = P({ armR: [40, -520], armL: [-96, -410], headRoll: -6, headDY: 2, f: { look: [.5, -.5], mouth: MOUTH.flat, browL: [-8, -.1, .3], browR: [-12, -.3, .4], lid: .1, turn: .3 } });
  const giggle = P({ armR: [96, -410], armL: [-96, -410], headRoll: 5, headDY: -8, f: { lid: .75, mouth: MOUTH.grin, browL: [-6, -.1, .3], browR: [-6, -.1, .3], blush: .8 } });
  const S = actor('mary', [[b, think], [cap - .1, think], [cap + .3, P({ f: { mouth: MOUTH.talk, look: [1, 0], turn: .5 } }), sm], [W(id, 'buluyorlardı') + .9, giggle, bk]], t, { x: 440, s: 1.25, bust: true });
  S.y = ZEMIN + 330; if (t > W(id, 'buluyorlardı') + .9) S.headDY += Math.sin(t * 16) * 4; drawMary(ctx, S);
  // sağ: geri sayan yıl göstergesi (dikey çevrilir)
  const yrs = ['1913', '1800', '1700', '1500', '1200', '1000', '500', 'MS 1', 'MÖ 500'];
  const start = b + .35, end = cap - .2; const k = clamp((t - start) / (end - start)); const pos = (1 - Math.pow(1 - k, 2.2)) * (yrs.length - 1);
  T(ctx, t, '◀◀ Geri saralım…', 1100, 330, 96, INK, b + .2, b + 1.0, { rot: -.02 });
  ctx.save(); ctx.beginPath(); ctx.rect(1000, 400, 700, 360); ctx.clip();
  rrect(ctx, 1000, 400, 700, 360, 20); ctx.fillStyle = '#f7efdc'; ctx.fill();
  for (let i = 0; i < yrs.length; i++) { const dy = (i - pos) * 300; if (Math.abs(dy) > 340) continue; const big = i === yrs.length - 1; ctx.save(); ctx.globalAlpha = 1 - Math.min(1, Math.abs(dy) / 320); hand(ctx, yrs[i], 1350, 630 + dy, big ? 170 : 200, big ? RED : INK, 1, { fam: 'Alegreya', it: true, wt: 800, align: 'center' }); ctx.restore(); }
  ctx.restore(); rrect(ctx, 1000, 400, 700, 360, 20); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  T(ctx, t, 'Antik Yunan', 1350, 850, 92, '#b8892e', cap - .15, cap + .3, { align: 'center', shadow: 'rgba(59,42,34,.4)' });
  // bez
  const bz = W(id, 'bez');
  if (t > bz - .2) { const u = bk(seg(t, bz - .2, bz + .4)); ctx.save(); ctx.translate(900, 940 - (1 - u) * 300); ctx.rotate(-.1); const sw = Math.sin(t * 6) * 8; drawBand(ctx, [[-170, sw], [-60, -20 - sw], [60, 10 + sw], [170, -14 - sw]], 56, 1); ctx.restore(); T(ctx, t, 'bir bez!', 1180, 990, 110, RED, bz, bz + .5, { rot: -.04 }); }
});

// ---------------- s12: Antik Yunan – apodesmos
sahneS('s12', (ctx, t) => {
  const id = 's12', b = SAH[id].bas;
  ctx.save(); ctx.translate(960, 540); const z = 1 + .05 * seg(t, b, b + SAH[id].dur); ctx.scale(z, z); ctx.translate(-960, -540);
  greekSet(ctx, t);
  const tA = W(id, 'kumaştan'), tAp = W(id, 'apodesmos'), tCough = W(id, 'öksürük'), tG = W(id, 'günde'), tEnd = W(id, 'karnına') + .5;
  const hold = P({ armL: [-190, -520], armR: [190, -520], f: { mouth: MOUTH.talk, look: [.7, 0], turn: .4, browL: [-5, 0, .2], browR: [-5, 0, .2], blush: .5 } });
  const wrap = P({ armL: [-30, -500], armR: [30, -500], f: { mouth: MOUTH.smile, look: [0, .6], turn: .2, browL: [-3, 0, .1], browR: [-3, 0, .1] } });
  const point = P({ armL: [-250, -620], armR: [96, -410], headRoll: 3, f: { mouth: MOUTH.grin, look: [.8, -.1], turn: .5, browL: [-8, -.1, .3], browR: [-8, -.1, .3], blush: .7 } });
  const doc = P({ armL: [-110, -560], armR: [150, -540], f: { mouth: MOUTH.grin, look: [.8, 0], turn: .5, browL: [-8, -.1, .3], browR: [-8, -.1, .3], blush: .6 } });
  const laugh = P({ armL: [-96, -410], armR: [96, -410], headRoll: -5, headDY: -8, chest: 1, f: { lid: .8, mouth: MOUTH.grin, browL: [-6, -.1, .3], browR: [-6, -.1, .3], blush: .9 } });
  const A = actor('greek', [[b, hold], [tA - .2, hold], [tA + .6, wrap, sm], [W(id, 'sarıyordu') + .5, wrap], [tAp - .2, point, bk], [tCough - .3, point], [tCough + .1, doc, bk], [tG + 1.2, doc], [tEnd, laugh, bk]], t, { x: 800, s: .85 });
  if (t > tEnd) A.headDY += Math.sin(t * 15) * 4;
  const wp = clamp(seg(t, tA + .15, W(id, 'sarıyordu') + .35));
  A.torsoFx = (c, L) => { for (let i = 0; i < 3; i++) { const k = clamp(wp * 3 - i); if (k <= 0) continue; const y = -552 + i * 30; line(c, [[-84 * k + 4, y + 6], [0, y - 6 + 8], [84 * k - 4, y + 6]], 30, C.ink); line(c, [[-84 * k + 4, y + 6], [0, y + 2], [84 * k - 4, y + 6]], 24, '#f4ecd8'); line(c, [[-80 * k, y + 8], [80 * k, y + 8]], 3, '#d6c8aa'); } };
  const holdSpoon = t > tCough - .1 && t < tEnd; if (holdSpoon) { A.armR.hold = (c) => drawSpoon(c, true); A.armL.hold = (c) => drawBottle(c, true); }
  const Bs = actor('greek2', [[b, P({ armL: [-96, -410], armR: [96, -410], f: { mouth: MOUTH.smile, turn: -.5, look: [-1, 0], browL: [-3, 0, .1], browR: [-3, 0, .1] } })], [tAp - .1, P({ armL: [-96, -410], armR: [96, -410], f: { mouth: MOUTH.flat, turn: -.5, look: [-1, 0], browL: [-10, .3, .1], browR: [-10, -.2, .4], lid: .2 } }), sm], [tCough, P({ armR: [60, -600], armL: [-96, -410], headDY: 6, f: { mouth: MOUTH.o, turn: -.5, look: [-1, .3], browL: [-8, -.3, .2], browR: [-8, -.3, .2], bulge: .4 } }), bk], [tG, P({ armR: [96, -410], armL: [-96, -410], f: { mouth: MOUTH.sad, turn: -.5, look: [-1, 0], browL: [-6, -.3, .2], browR: [-6, -.3, .2], sweat: .5 } }), sm]], t, { x: 1230, s: .85, off: 2.3 });
  if (t > tCough && t < tCough + 1.4) Bs.headDY += Math.sin((t - tCough) * 22) * 5;
  drawMary(ctx, A); drawMary(ctx, Bs);
  // bant eller arasında (sarmadan önce)
  if (t > b + .1 && t < tA + .8) { const hl = handPos(A, A.armL), hr = handPos(A, A.armR); const sag = 40 + Math.sin(t * 4) * 6; drawBand(ctx, [[hl[0], hl[1]], [(hl[0] * 2 + hr[0]) / 3, hl[1] + sag], [(hl[0] + hr[0] * 2) / 3, hl[1] + sag], [hr[0], hr[1]]], 34, 1); }
  // yazılar
  const lx = 560, ly = 230;
  T(ctx, t, 'apodesmos', lx, ly, 130, INK, tAp, tAp + .8, { rot: -.03, shadow: 'rgba(255,245,225,.6)' });
  pen(ctx, curve([lx + 230, ly + 16], [lx + 260, ly + 120], [830, 520], 18), seg(t, tAp + .5, tAp + 1.0), 6, INK, { arrow: 18 });
  if (t > tCough + .1 && t < tCough + 1.4) for (let i = 0; i < 3; i++) { const k = (t - tCough - .1 + i * .15) % .5; pen(ctx, [[1290 + i * 16, 520 - i * 18], [1320 + i * 16 + k * 40, 508 - i * 18 - k * 20]], 1, 5, INK); }
  if (t > tG - .1) { pinnedPaper(ctx, 1050, 135, 640, 170, -.03, '#f6ecd4'); T(ctx, t, 'Günde 2 apodesmos,', 1050, 130, 64, INK, tG, tG + .9, { align: 'center', rot: -.03 }); T(ctx, t, 'tok karnına.', 1050, 195, 64, RED, W(id, 'tok'), W(id, 'karnına') + .3, { align: 'center', rot: -.03 }); }
  ctx.restore();
});

// ---------------- s13: Romalılar – strophium, etiket değişti
sahneS('s13', (ctx, t) => {
  const id = 's13', b = SAH[id].bas;
  ctx.save(); ctx.translate(960, 540); const z = 1 + .05 * seg(t, b, b + SAH[id].dur); ctx.scale(z, z); ctx.translate(-960, -540);
  romanSet(ctx, t);
  const tR = W(id, 'romalılar'), tS = W(id, 'strophium'), tM = W(id, 'mal'), tP = W(id, 'pazarlamanın');
  const show = P({ armL: [-180, -600], armR: [180, -600], f: { mouth: MOUTH.talk, look: [0, 0], browL: [-5, 0, .2], browR: [-5, 0, .2], blush: .5 } });
  const shrug = P({ armL: [-200, -470], armR: [200, -470], headRoll: 5, f: { mouth: MOUTH.grin, lid: .3, browL: [-8, -.1, .3], browR: [-8, .1, .3], blush: .6, look: [0, 0] } });
  const sign = P({ armL: [-96, -410], armR: [250, -700], headRoll: -4, headDY: -6, f: { mouth: MOUTH.grin, lid: .4, browL: [-10, -.1, .3], browR: [-10, -.1, .3], blush: .8 } });
  const A = actor('roman', [[b, show], [tM - .1, show], [tM + .2, shrug, bk], [tP - .1, shrug], [tP + .3, sign, bk]], t, { x: 960, s: .85 });
  if (t > tP + .3) A.armR.hold = (c) => { c.save(); c.translate(0, 10); line(c, [[0, 0], [0, 140]], 8, C.ink); c.restore(); };
  drawMary(ctx, A);
  // bant (iki elde) + etiket
  const hl = handPos(A, A.armL), hr = handPos(A, A.armR);
  if (t < tM + .6) { drawBand(ctx, [[hl[0], hl[1]], [hl[0] + (hr[0] - hl[0]) * .33, hl[1] + 46], [hl[0] + (hr[0] - hl[0]) * .66, hl[1] + 46], [hr[0], hr[1]]], 36, 1);
    const tx = hl[0] + (hr[0] - hl[0]) * .5, ty = hl[1] + 70; ctx.save(); ctx.translate(tx, ty); ctx.rotate(Math.sin(t * 3) * .04); line(ctx, [[0, -30], [0, 0]], 3, C.ink); rrect(ctx, -110, 0, 220, 70, 6); ctx.fillStyle = '#f6ecd4'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke();
    hand(ctx, 'apodesmos', 0, 48, 50, INK, 1, { align: 'center' }); crossOut(ctx, -100, 20, 100, 52, seg(t, tS - .3, tS + .1));
    hand(ctx, 'strophium', 0, 140, 64, RED, seg(t, tS, tS + .6), { align: 'center', rot: -.04 }); ctx.restore(); }
  else { drawBand(ctx, [[hl[0], hl[1] + 30], [hl[0] + 60, hl[1] + 70], [hl[0] + 160, hl[1] + 50]], 30, 1); }
  // tabela
  if (t > tP + .3) { const u = bk(seg(t, tP + .3, tP + .8)); const [sx, sy] = handPos(A, A.armR); ctx.save(); ctx.translate(sx + 110, sy - 130); ctx.rotate(-.06 + Math.sin(t * 6) * .03); ctx.scale(u, u); rrect(ctx, -140, -70, 280, 120, 8); ctx.fillStyle = '#f6ecd4'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); hand(ctx, 'YENİ!', 0, 22, 96, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore(); }
  T(ctx, t, 'mal aynı, etiket yeni', 140, 170, 96, CREAM, tM, tM + .9, { rot: -.02, shadow: 'rgba(30,18,10,.8)' });
  ctx.restore();
});
