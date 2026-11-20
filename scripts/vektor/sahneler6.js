'use strict';
// ===== Sahneler 6: n39–s33b (efsane mi gerçek mi, 1968, gazete, özet, kapanış) =====
function chalkboard(ctx) {
  ctx.fillStyle = '#6e4a32'; ctx.fillRect(-100, -100, 2120, 1300); poly(ctx, [[60, 50], [1860, 50], [1860, 990], [60, 990]], '#8d6a4c', '#6b4d36', { sw: 5, sx: -6, sy: -6 });
  ctx.fillStyle = '#3a4538'; ctx.fillRect(110, 100, 1700, 840); for (let i = 0; i < 14; i++) { ctx.fillStyle = `rgba(230,225,210,${.025 + hash(i) * .03})`; ctx.beginPath(); ctx.ellipse(200 + (i * 211) % 1500, 180 + (i * 137) % 700, 150, 60, hash(i) * 3, 0, TAU); ctx.fill(); }
  poly(ctx, [[90, 960], [1830, 960], [1850, 1010], [70, 1010]], '#a98462', '#7a573b', { sw: 4, sx: 0, sy: -4 });
}
const chalk = (ctx, t, txt, x, y, size, t0, t1, o = {}) => hand(ctx, txt, x, y, size, o.col || '#f1ece0', seg(t, t0, t1), Object.assign({ shadow: 'rgba(255,255,255,.12)' }, o));
function typewriter(ctx, x, y, s, t, typing) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  poly(ctx, [[-170, 0], [170, 0], [150, -110], [-150, -110]], '#4b4540', '#322e2a', { sw: 5, sx: -8, sy: -6 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 8 - r; c++) { const dn = typing && Math.sin(t * 18 + c * 1.7 + r * 2.3) > .75 ? 5 : 0; ell(ctx, -110 + c * 32 + r * 16, -78 + r * 22 + dn, 11, 11, '#e8e0cc', C.ink, 2.4); }
  rr(ctx, -70, -150, 140, 24, '#4b4540'); ctx.restore();
}
function ottoFrame(ctx, t, b, tHic, d) {
  curtainBG(ctx, t); const fade = 1 - seg(t, tHic - .05, tHic + .8), cx = 960, cy = 440;
  ctx.save(); ctx.translate(cx, cy);
  ell(ctx, 0, 0, 280, 372, C.gold, C.ink, 5); ell(ctx, 0, 0, 258, 350, C.goldD, C.ink, 3); ell(ctx, 0, 0, 240, 332, '#d8c5a2', C.ink, 3);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 238, 330, 0, 0, TAU); ctx.clip(); ctx.fillStyle = '#a58c68'; ctx.fillRect(-250, -340, 500, 680);
  ctx.save(); ctx.globalAlpha = .25 + .75 * fade;
  const o = actor('otto', [[b, P({ f: { mouth: MOUTH.smile, browL: [-4, .05, .2], browR: [-4, .05, .2], look: [-.4, .1], lid: .1, blush: .1 } })], [tHic - .1, P({ f: { mouth: MOUTH.grin, browL: [-8, -.1, .3], browR: [-8, -.1, .3], look: [0, 0] } })], [tHic + .5, P({ f: { mouth: MOUTH.o, browL: [-12, -.3, .4], browR: [-12, -.3, .4], look: [0, .4], bulge: .6 } }), bk]], t, { x: 0, y: 0, s: 1.62, bust: true, off: .4 }); o.y = 1120; drawMary(ctx, o); ctx.restore();
  if (fade < 1) { ctx.save(); ctx.globalAlpha = 1 - fade; ctx.setLineDash([14, 12]); ctx.lineWidth = 5; ctx.strokeStyle = '#3b2a22'; ctx.beginPath(); ctx.ellipse(0, -66, 118, 138, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-190, 200); ctx.quadraticCurveTo(-170, 90, -70, 76); ctx.lineTo(70, 76); ctx.quadraticCurveTo(170, 90, 190, 200); ctx.stroke(); ctx.restore(); }
  ctx.restore(); ctx.restore();
  ctx.save(); ctx.translate(cx, cy + 394); shape(ctx, [[-100, -24], [100, -24], [100, 24], [-100, 24]], '#d3a94a', '#a07f33', { sw: 3, seed: 430, sx: -4, sy: -3 }); hand(ctx, 'Otto', 0, 14, 48, INK, 1, { fam: 'Alegreya', it: true, wt: 800, align: 'center' }); ctx.restore();
}
function reyburnDesk(ctx, t, b, o = {}) {
  ctx.fillStyle = '#6b5440'; ctx.fillRect(-100, -100, 2120, 1300); for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#725944' : '#634b39'; ctx.fillRect(i * 120 - 20, -100, 118, 1300); }
  glow(ctx, 600, 240, 600, 'rgba(255,214,140,A)', .3);
  const typ = P({ armL: [-70, -420], armR: [70, -420 + Math.sin(t * 16) * 8], headDY: 6, f: { look: [0, .8], mouth: MOUTH.smile, lid: .2, browL: [-3, 0, .1], browR: [-3, 0, .1] } });
  const wink = P({ armL: [-70, -420], armR: [160, -560], headRoll: 5, f: { look: [1, 0], mouth: MOUTH.grin, lid: .5, browL: [-4, .2, .2], browR: [-10, -.2, .3], blush: .4 } });
  const S = actor('reyburn', o.seq || [[b, typ]], t, { x: 760, s: 1.5, bust: true, off: .5 }); S.y = 1610; drawMary(ctx, S);
  poly(ctx, [[-100, 830], [2020, 830], [2020, 1100], [-100, 1100]], '#8d6a4c', '#6b4d36', { sw: 4, sx: 0, sy: -8 });
  typewriter(ctx, 760, 930, 1.6, t, true);
  return { wink };
}
function newsPaper(ctx, x, y, w, h, rot) { pinnedPaper(ctx, x, y, w, h, rot, '#f1e8d0'); }

// ---------------- n39: Efsane mi, gerçek mi?
sahneS('n39', (ctx, t) => {
  const id = 'n39', b = SAH[id].bas;
  chalkboard(ctx);
  chalk(ctx, t, 'Efsane mi,', 960, 300, 200, W(id, 'efsane') - .2, W(id, 'mi') + .3, { align: 'center', rot: -.02 }); chalk(ctx, t, 'gerçek mi?', 960, 500, 200, W(id, 'gerçek') - .1, W(id, 'mi', 2) + .5, { align: 'center', rot: .02, col: '#f6dc8a' });
  line(ctx, [[960, 580], [960, 900]], 5, 'rgba(241,236,224,.6)'); chalk(ctx, t, 'EFSANE', 540, 760, 120, b + .3, b + .9, { align: 'center', col: '#e6a088' }); chalk(ctx, t, 'GERÇEK', 1380, 760, 120, b + .5, b + 1.1, { align: 'center', col: '#a9c58a' });
  chalk(ctx, t, '1:', 140, 190, 120, W(id, '1') - .1, W(id, '1') + .4, { fam: 'Alegreya', it: true, wt: 800, col: '#f6dc8a' });
  // tebeşir tozu
  ctx.fillStyle = 'rgba(241,236,224,.5)'; for (let i = 0; i < 6; i++) ctx.fillRect(300 + i * 220, 975 + hash(i) * 10, 18, 5);
  const host = P({ armL: [-96, -410], armR: [210, -620 + Math.sin(t * 6) * 30], headRoll: 3 + Math.sin(t * 4) * 3, f: { mouth: MOUTH.grin, blush: .7, look: [-1, 0], turn: -.4, browL: [-8, -.1, .3], browR: [-8, -.1, .3] } });
  const H = actor('mary', [[b, host]], t, { x: 1740, s: 1.0, bust: true }); H.y = 1620; drawMary(ctx, H);
});

// ---------------- s41a: Otto Titzling buldu – bir sürü yerde – bilgi yarışması
sahneS('s41a', (ctx, t) => {
  const id = 's41a', b = SAH[id].bas, d = SAH[id].dur, c = W(id, 'ünlü') - .2;
  if (t < c) {   // pano
    ctx.fillStyle = '#a9794a'; ctx.fillRect(-100, -100, 2120, 1300); for (let i = 0; i < 400; i++) { ctx.fillStyle = `rgba(80,50,25,${.1 + hash(i) * .2})`; ctx.fillRect((i * 97) % 1920, (i * 53) % 1080, 6, 6); }
    poly(ctx, [[40, 40], [1880, 40], [1880, 1040], [40, 1040]], 'rgba(0,0,0,0)', null, { sw: 14, ink: '#6b4d36' });
    // otto portre
    ctx.save(); ctx.translate(960, 440); ell(ctx, 0, 0, 200, 270, C.gold, C.ink, 5); ell(ctx, 0, 0, 176, 246, '#d8c5a2', C.ink, 3); ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 174, 244, 0, 0, TAU); ctx.clip(); ctx.fillStyle = '#a58c68'; ctx.fillRect(-200, -260, 400, 520); const o = actor('otto', [[b, P({ f: { mouth: MOUTH.grin, look: [0, 0], browL: [-6, -.1, .3], browR: [-6, -.1, .3] } })]], t, { x: 0, s: 1.25, bust: true, off: .4 }); o.y = 860; drawMary(ctx, o); ctx.restore(); ctx.restore();
    const notes = [[300, 260, -.06, 'Sütyeni Otto', 'Titzling buldu.'], [1620, 240, .05, 'Sütyeni Alman', 'Otto buldu!'], [260, 700, .04, 'Otto Titzling', '(1860–1920)'], [1660, 700, -.05, '"Sütyenin', 'mucidi Otto"'], [960, 880, .02, 'Bilgi kutusu:', 'Mucit: Otto T.']];
    notes.forEach(([x, y, r, a, bb], i) => { const u = bk(seg(t, b + .4 + i * .5, b + .8 + i * .5)); if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); pinnedPaper(ctx, 0, 0, 380, 200, r, '#f8efd9'); ell(ctx, 0, -92, 10, 10, '#b4503a', C.ink, 2.6); hand(ctx, a, 0, -8, 52, INK, 1, { align: 'center', rot: r }); hand(ctx, bb, 0, 52, 52, '#7a5c3e', 1, { align: 'center', rot: r }); ctx.restore(); });
    T(ctx, t, '"Sütyeni Otto Titzling adında bir Alman buldu."', 960, 1020, 70, '#fff', b, W(id, 'buldu') + .5, { align: 'center', rot: -.01, shadow: 'rgba(40,25,10,.8)' });
  } else {   // bilgi yarışması
    curtainBG(ctx, t);
    poly(ctx, [[480, 60], [1440, 60], [1440, 260], [480, 260]], '#f4ead2', '#e0d3b4', { sw: 6, sx: -8, sy: -6 }); hand(ctx, 'Sütyeni kim buldu?', 960, 190, 110, INK, seg(t, c, c + .8), { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
    const sure = P({ armL: [-96, -410], armR: [150, -640], headDY: -6, f: { mouth: MOUTH.grin, look: [0, 0], blush: .7, lid: .2, browL: [-8, -.1, .3], browR: [-8, -.1, .3] } });
    const S = actor('quiz', [[c, P({ armL: [-70, -420], armR: [70, -420], f: { mouth: MOUTH.flat, look: [0, -.4], browL: [-6, 0, .2], browR: [-6, 0, .2] } })], [W(id, 'soru') - .4, sure, bk]], t, { x: 960, s: 1.3, bust: true }); S.y = 1560; drawMary(ctx, S);
    poly(ctx, [[560, 800], [1360, 800], [1400, 1100], [520, 1100]], '#7a573b', '#5c412b', { sw: 5, sx: -8, sy: -6 }); ell(ctx, 960, 820, 50, 22, '#b4503a', C.ink, 4);
    T(ctx, t, '"Otto Titzling!"', 1560, 520, 100, CREAM, W(id, 'soru') - .3, W(id, 'olarak') + .5, { align: 'center', rot: .03, shadow: 'rgba(20,8,8,.8)' });
    T(ctx, t, 'ünlü bilgi yarışması', 400, 400, 80, CREAM, c, W(id, 'yarışması') + .5, { align: 'center', rot: -.01, shadow: 'rgba(20,8,8,.8)' });
  }
});

// ---------------- s09b: Otto Titzling hiç yaşamadı
sahneS('s09b', (ctx, t) => {
  const id = 's09b', b = SAH[id].bas, d = SAH[id].dur, hic = W(id, 'hiç');
  ctx.save(); const z = 1 + ZOOMK * .04 * seg(t, b, b + d); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
  ottoFrame(ctx, t, b, hic, d);
  const sp = [['lady1', 230, 1], ['wig1', 620, -1], ['lady3', 1310, 1], ['wig2', 1690, -1]];
  sp.forEach(([lk, x, dd], i) => { const S = actor(lk, [[b, P({ f: { mouth: MOUTH.smile, look: [0, -.3], browL: [-8, 0, .3], browR: [-8, 0, .3], blush: .6 } })], [hic - .1, P({ f: { mouth: MOUTH.smile, look: [0, -.3] } })], [hic + .5, P({ headRoll: dd * 8, f: { mouth: MOUTH.flat, look: [dd * .8, -.2], browL: [-3, .3, .1], browR: [-3, -.3, .1], blush: .2 } }), bk]], t, { x, s: .75, bust: true, off: i * 1.1 }); S.y = 1395; drawMary(ctx, S); });
  shape(ctx, [[-100, 905], [2020, 905], [2020, 1100], [-100, 1100]], C.woodD, C.wood, { sw: 3, seed: 431, sx: 0, sy: -8 });
  T(ctx, t, 'hiç yaşamadı', 960, 1030, 120, CREAM, hic, hic + .9, { rot: -.02, align: 'center', shadow: 'rgba(30,18,10,.8)' });
  for (const x of [330, 1420]) T(ctx, t, '?', x, 800, 120, '#f6dc8a', hic + .5, hic + .8, { fam: 'Alegreya', it: true, wt: 800, shadow: 'rgba(30,18,10,.8)' });
  ctx.restore();
});

// ---------------- s41b: Reyburn – uydurma kitap – şaka yaptı, dünya ciddiye aldı – sahte haber
sahneS('s41b', (ctx, t) => {
  const id = 's41b', b = SAH[id].bas, d = SAH[id].dur, c1 = W(id, 'kitabın') - .15, c2 = W(id, 'yani') - .15;
  if (t < c1) {
    const R = reyburnDesk(ctx, t, b);
    pinnedPaper(ctx, 1500, 420, 520, 380, .04, '#f8efd9'); for (let i = 0; i < 6; i++) line(ctx, [[1290, 300 + i * 40], [1530 - (i % 3) * 40, 300 + i * 40]], 3, '#cbbd96');
    const k = seg(t, W(id, 'tamamen') - .1, W(id, 'yazdı') + .3); for (let i = 0; i < 6; i++) pen(ctx, [[1290, 300 + i * 40], [1530 - (i % 3) * 40, 300 + i * 40]], clamp(k * 6 - i), 4, INK);
    calendarPage(ctx, 300, 330, .9, 'YIL', '1971', 80);
    T(ctx, t, 'Wallace Reyburn', 960, 150, 110, CREAM, W(id, 'wallace') - .1, W(id, 'reyburn') + .5, { align: 'center', rot: -.02, shadow: 'rgba(30,18,10,.8)' });
    T(ctx, t, 'mizahçı', 960, 250, 84, '#f6dc8a', W(id, 'mizahçı') - .1, W(id, 'mizahçı') + .4, { align: 'center', rot: -.02, shadow: 'rgba(30,18,10,.8)' });
    T(ctx, t, 'tamamen uydurma!', 1480, 680, 100, '#e6a088', W(id, 'uydurma') - .1, W(id, 'uydurma') + .5, { align: 'center', rot: .03, shadow: 'rgba(30,18,10,.8)' });
  } else if (t < c2) {   // kitap kapağı, "açık saçık" kelime oyunu
    plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 960 });
    ctx.save(); ctx.translate(960, 520); ctx.rotate(-.03); poly(ctx, [[-260, -400], [260, -400], [260, 400], [-260, 400]], '#6f3f2a', '#4d2a1c', { sw: 6, sx: -12, sy: -8 }); poly(ctx, [[-220, -360], [220, -360], [220, 360], [-220, 360]], 'rgba(0,0,0,0)', null, { sw: 4, ink: '#c8a043' }); hand(ctx, 'ROMAN', 0, -250, 70, '#e8d9b0', 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
    const oc = bk(seg(t, W(id, 'kahramanının') - .2, W(id, 'adı') + .3)); ctx.save(); ctx.scale(oc, oc); ell(ctx, 0, 20, 110, 130, '#e8c3a0', C.ink, 5); const o = actor('otto', [[b, P({ f: { mouth: MOUTH.grin, look: [0, 0], blush: .2 } })]], t, { x: 0, s: .75, bust: true, off: .4 }); o.y = 560; ctx.save(); ctx.beginPath(); ctx.ellipse(0, 20, 106, 126, 0, 0, TAU); ctx.clip(); drawMary(ctx, o); ctx.restore(); ctx.restore();
    hand(ctx, 'OTTO ...', 0, 270, 80, '#e8d9b0', seg(t, W(id, 'ingilizcede') - .1, W(id, 'ingilizcede') + .6), { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
    ctx.restore();
    // sansür çubuğu + kızaran emoji
    const sk = bk(seg(t, W(id, 'açık') - .2, W(id, 'saçık') + .3)); if (sk > 0) { ctx.save(); ctx.translate(960, 800); ctx.rotate(-.03); ctx.scale(sk, sk); poly(ctx, [[-170, -34], [170, -34], [170, 34], [-170, 34]], '#2f2430', null, { sw: 4 }); for (let i = -4; i <= 4; i++) line(ctx, [[i * 36, -26], [i * 36 + 16, 26]], 5, '#6a5568'); ctx.restore(); ctx.save(); ctx.translate(1450, 420); ctx.scale(sk, sk); ell(ctx, 0, 0, 80, 80, '#f0c8a8', C.ink, 5); ell(ctx, -30, -12, 8, 12, C.ink, null); ell(ctx, 30, -12, 8, 12, C.ink, null); ell(ctx, -46, 20, 22, 12, 'rgba(210,90,80,.6)', null); ell(ctx, 46, 20, 22, 12, 'rgba(210,90,80,.6)', null); line(ctx, [[-22, 34], [0, 42], [22, 34]], 4, C.ink); line(ctx, [[-56, -44], [-16, -50]], 5, C.ink); ctx.restore(); }
    T(ctx, t, '“biraz açık saçık”', 1450, 640, 80, INK, W(id, 'biraz') - .1, W(id, 'saçık') + .4, { align: 'center', rot: .03 }); T(ctx, t, 'bir kelime oyunu', 1450, 730, 80, '#7a5c3e', W(id, 'kelime') - .1, W(id, 'oyunu') + .4, { align: 'center', rot: .03 });
  } else {   // şaka / dünya ciddiye aldı / sahte haber
    plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 961 });
    const sh = actor('reyburn', [[c2, P({ armL: [-70, -420], armR: [70, -420], f: { look: [1, 0], mouth: MOUTH.grin, lid: .4, browL: [-4, .2, .2], browR: [-10, -.2, .3], blush: .3 } })]], t, { x: 420, s: 1.0, bust: true, off: .5 }); sh.y = ZEMIN + 110; if (t > W(id, 'şaka') && t < W(id, 'yaptı') + .6) sh.headRoll = Math.sin(t * 12) * 5; drawMary(ctx, sh);
    const grave = P({ armL: [-70, -420], armR: [70, -420], f: { look: [-.8, 0], mouth: MOUTH.flat, lid: .05, browL: [-6, .15, .1], browR: [-6, -.15, .1] } });
    [['lady2', 1000, 0], ['wig1', 1260, 1], ['friendC', 1520, 2], ['quiz', 1780, 3]].forEach(([lk, x, i]) => { const S = actor(lk, [[c2, grave]], t, { x, s: .65, bust: true, off: i * .9 }); S.y = ZEMIN + 90; const nod = seg(t, W(id, 'dünya'), W(id, 'aldı') + 1); S.headDY += Math.abs(Math.sin(t * 5 + i)) * 8 * nod; drawMary(ctx, S); });
    T(ctx, t, 'adam şaka yaptı,', 420, 130, 100, INK, W(id, 'adam') - .1, W(id, 'yaptı') + .4, { align: 'center', rot: -.02 }); T(ctx, t, 'dünya ciddiye aldı.', 1400, 130, 100, RED, W(id, 'dünya') - .1, W(id, 'aldı') + .4, { align: 'center', rot: .02 });
    // gazete yığını: sahte haber
    for (let i = 0; i < 4; i++) { const u = bk(seg(t, W(id, 'internetten') + i * .15, W(id, 'internetten') + .4 + i * .15)); if (u > 0) { ctx.save(); ctx.translate(960 + (i - 1.5) * 18, 860 - i * 24); ctx.scale(u, u); pinnedPaper(ctx, 0, 0, 420, 170, (i - 1.5) * .03, '#f1e8d0'); if (i === 3) hand(ctx, 'SAHTE HABER', 0, 18, 56, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore(); } }
    T(ctx, t, 'internetten önceki zamanların', 960, 1040, 70, INK, W(id, 'internetten') - .1, W(id, 'zamanların') + .4, { align: 'center', rot: -.01 });
  }
});

// ---------------- s42a: 1968 – güzellik yarışması protestosu – Özgürlük Çöp Kutusu – polis izin vermiyor
sahneS('s42a', (ctx, t) => {
  const id = 's42a', b = SAH[id].bas, d = SAH[id].dur;
  skyGrad(ctx, '#d6d3d0', '#e9e1d0', '#f2ead8', 640); rr(ctx, -100, 560, 2120, 130, '#cfc7b6'); ctx.fillStyle = '#c3bba8'; for (let i = 0; i < 20; i++) { ctx.beginPath(); ctx.ellipse(i * 120 - 40, 600 + Math.sin(t * 1.5 + i) * 6, 70, 14, 0, 0, TAU); ctx.fill(); }
  // iskele zemini
  for (let i = 0; i < 12; i++) poly(ctx, [[-100, 690 + i * 36], [2020, 690 + i * 36], [2020, 722 + i * 36], [-100, 722 + i * 36]], i % 2 ? '#a98462' : '#9a7656', '#7a573b', { sw: 2.4, sx: 0, sy: -3 });
  line(ctx, [[-100, 700], [2020, 700]], 10, '#6b4d36'); for (let i = 0; i < 18; i++) line(ctx, [[i * 120, 700], [i * 120, 620]], 8, '#6b4d36'); line(ctx, [[-100, 620], [2020, 620]], 8, '#6b4d36');
  // martılar
  for (let i = 0; i < 3; i++) { const bx = ((t * 80 + i * 700) % 2400) - 240, by = 250 + i * 80 + Math.sin(t * 1.5 + i) * 18, fl = Math.sin(t * 9 + i * 2) * 10; line(ctx, [[bx - 24, by + fl], [bx, by - 4], [bx + 24, by + fl]], 4, '#5a4a48'); }
  // uzaktaki kalabalık: iskelede küçük figürler tabela sallıyor
  [['friendA', 1130, 0], ['wig1', 1250, 1], ['friendC', 1370, 2], ['lady2', 1700, 3], ['quiz', 1830, 4]].forEach(([lk, x, i]) => {
    const cs = actor(lk, [[b, P({ armL: [-96, -410], armR: [150, -640 + Math.sin(t * 6 + i * 1.3) * 70], headRoll: Math.sin(t * 4 + i) * 5, f: { mouth: MOUTH.grin, look: [0, 0], blush: .5 } })]], t, { x, y: -200, s: .27, off: i * .7 }); cs.y -= Math.abs(Math.sin(t * 5 + i)) * 9;
    cs.armR.hold = (c) => { c.save(); line(c, [[0, 10], [0, 140]], 9, '#6b4d36'); poly(c, [[-70, 140], [70, 140], [70, 220], [-70, 220]], '#f8efd9', '#e0d3b4', { sw: 4 }); c.restore(); }; drawMary(ctx, cs); });
  // çöp kutusu
  const tB = W(id, 'özgürlük'); ctx.save(); ctx.translate(1000, 930); poly(ctx, [[-120, 0], [120, 0], [100, -230], [-100, -230]], '#b9b2a2', '#8f897d', { sw: 5, sx: -8, sy: -4 }); for (const x of [-60, 0, 60]) line(ctx, [[x, -20], [x * .85, -210]], 3, '#8f897d'); poly(ctx, [[-110, -230], [110, -230], [118, -260], [-118, -260]], '#cfc9ba', '#a39d8e', { sw: 4, sx: -4, sy: -3 }); ctx.restore();
  const ul = bk(seg(t, tB - .2, tB + .4)); if (ul > 0) { ctx.save(); ctx.translate(1000, 780); ctx.scale(ul, ul); poly(ctx, [[-170, -50], [170, -50], [170, 40], [-170, 40]], '#f8efd9', '#e0d3b4', { sw: 4, sx: -4, sy: -3 }); hand(ctx, 'Özgürlük', 0, -4, 52, RED, 1, { align: 'center' }); hand(ctx, 'Çöp Kutusu', 0, 38, 52, INK, 1, { align: 'center' }); ctx.restore(); }
  // kadınlar
  const stand = (k) => P({ armL: [-96, -410], armR: [190, -620], headRoll: k * 3, f: { look: [1, 0], turn: .5, mouth: MOUTH.talk, browL: [-6, 0, .2], browR: [-6, 0, .2], blush: .4 } });
  const tossP = P({ armL: [-96, -410], armR: [230, -600], f: { look: [1, -.2], turn: .5, mouth: MOUTH.grin, blush: .6, browL: [-6, 0, .2], browR: [-6, 0, .2] } });
  const sad = P({ armL: [-96, -410], armR: [96, -410], headDY: 8, f: { look: [0, .6], turn: .2, mouth: MOUTH.sad, browL: [-6, -.4, .2], browR: [-6, -.4, .2] } });
  const tt = [W(id, 'sütyenlerini'), W(id, 'korselerini'), W(id, 'kirpiklerini')];
  const women = [['w68a', 300, 0], ['w68b', 540, 1], ['w68c', 780, 2]];
  const items = ['bra', 'corset', 'lash'];
  women.forEach(([lk, x, i]) => { const S = actor(lk, [[b, stand(i)], [tt[i] - .3, stand(i)], [tt[i] + .05, tossP, bk], [tt[i] + .5, stand(i), sm], [W(id, 'ama') + .3, sad, sm]], t, { x, s: .8, off: i * .8, k: 1.08 }); if (t < tt[i] - .2) { S.headRoll += Math.sin(t * 5 + i) * 3; S.y -= Math.abs(Math.sin(t * 5 + i)) * 7; } else if (t > W(id, 'ama') + .3) { S.headRoll += Math.sin(t * 2.2 + i) * 3; } if (t < tt[i] - .2 || (t > tt[i] + .6 && t < W(id, 'ama') + .2)) { S.armR.hold = (c) => { c.save(); line(c, [[0, 10], [0, 150]], 7, '#6b4d36'); poly(c, [[-80, 150], [80, 150], [80, 240], [-80, 240]], '#f8efd9', '#e0d3b4', { sw: 3 }); hand(c, ['ÖZGÜRLÜK', 'EŞİTLİK', 'HAKLARIMIZ'][i], 0, 208, 28, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); c.restore(); }; } drawMary(ctx, S);
    const u = seg(t, tt[i] + .1, tt[i] + .8); if (u > 0 && u < 1) { const sx = x + 150, sy = 460, ex = 960 + i * 20, ey = 640; const ix = lerp(sx, ex, u), iy = lerp(sy, ey, u * u) - Math.sin(u * Math.PI) * 160; ctx.save(); ctx.translate(ix, iy); ctx.rotate(u * 8); if (items[i] === 'bra') { ctx.scale(.28, .28); linenBra(ctx, 0, 0, 1, t); } else if (items[i] === 'corset') { ctx.scale(.55, .55); corsetPiece(ctx, 'full'); } else { line(ctx, [[-30, 0], [0, -12], [30, 0]], 6, C.ink); for (let k = -3; k <= 3; k++) line(ctx, [[k * 8, -6 + Math.abs(k)], [k * 10, -22]], 3, C.ink); } ctx.restore(); } });
  // polis
  const tP = W(id, 'polis'), tI = W(id, 'izin');
  const copP = tr([[b, P({ armL: [-96, -410], armR: [96, -410], f: { look: [-1, 0], mouth: MOUTH.flat } })], [tP - .3, P({ armL: [-96, -410], armR: [96, -410], f: { look: [-1, 0], mouth: MOUTH.flat } })], [tP + .1, P({ armL: [-96, -410], armR: [-10, -660], f: { look: [-1, 0], turn: -.4, mouth: MOUTH.talk, browL: [-4, .2, .1], browR: [-4, .2, .1] } }), bk], [tI + .2, P({ armL: [-96, -410], armR: [-10, -660], headRoll: 0, f: { look: [-1, 0], turn: -.4, mouth: MOUTH.flat, lid: .2, browL: [-3, .3, 0], browR: [-3, .3, 0] } })]], t);
  const cx = lerp(2200, 1560, sm(seg(t, tP - 1.4, tP + .2)));
  const C_ = buyut(pose2state(copP, t, { look: 'cop', s: .85, off: 1.3 }), { k: 1 }); C_.x = cx; if (t > tI + .3) C_.headRoll += Math.sin(t * 9) * 8; drawMary(ctx, C_);
  // kibrit
  if (t > W(id, 'plan') && t < tP + .3) { ctx.save(); ctx.translate(960, 540); const a = Math.sin(t * 6) * .1; ctx.rotate(a); poly(ctx, [[-26, -16], [26, -16], [26, 16], [-26, 16]], '#e0cfa3', '#b9a985', { sw: 3 }); line(ctx, [[26, 0], [60, -20]], 5, '#8a6a4a'); ell(ctx, 66, -24, 6, 6, '#b4503a', C.ink, 2); ctx.restore(); T(ctx, t, 'ateşe vermek!', 1150, 440, 100, RED, W(id, 'ateşe') - .1, W(id, 'vermek') + .4, { align: 'center', rot: -.03 }); }
  T(ctx, t, '1968', 90, 140, 130, INK, b, W(id, '1968de') + .5, { fam: 'Alegreya', it: true, wt: 800, rot: -.02 });
  T(ctx, t, 'güzellik yarışması protestosu', 760, 80, 64, INK, W(id, 'güzellik') - .1, W(id, 'ediliyor') + .4, { align: 'center', rot: -.02 });
  if (t > tP + .3) { pinnedPaper(ctx, 1570, 92, 640, 176, -.02, '#f8efd9'); T(ctx, t, '"Hanımlar, burası tahta', 1570, 72, 46, INK, W(id, 'hanımlar') - .1, W(id, 'iskele') + .3, { align: 'center', rot: -.02 }); T(ctx, t, 'bir iskele. Yakarsanız bütün', 1570, 120, 46, INK, W(id, 'yakarsanız') - .1, W(id, 'sahili') + .2, { align: 'center', rot: -.02 }); T(ctx, t, 'sahili yakarsınız."', 1570, 168, 46, RED, W(id, 'sahili') - .1, W(id, 'yakarsınız') + .4, { align: 'center', rot: -.03 }); }
  if (t > tI) T(ctx, t, 'İZİN YOK!', 960, 1030, 130, RED, tI, tI + .5, { align: 'center', rot: -.02 });
});

// ---------------- s42c: gazete manşeti – efsane doğuyor – hayal gücü – duman – manşetin eseri
sahneS('s42c', (ctx, t) => {
  const id = 's42c', b = SAH[id].bas, d = SAH[id].dur, c2 = W(id, 'yani') - .2, c3 = W(id, 'gerçi') - .2, c4 = W(id, 'ama') - .2;
  if (t < c2) {
    plainBG(ctx, '#d9c7a0', '#a67c52'); newsPaper(ctx, 960, 540, 1500, 900, -.012);
    hand(ctx, 'GAZETE', 960, 260, 130, INK, seg(t, b, b + .5), { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); line(ctx, [[260, 290], [1660, 296]], 8, INK); line(ctx, [[260, 310], [1660, 314]], 3, INK);
    const hk = 'SÜTYEN YAKANLAR', n = Math.floor(clamp(seg(t, W(id, 'sütyen') - .1, W(id, 'manşet') + .5)) * hk.length);
    hand(ctx, hk.slice(0, n), 960, 520, 150, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
    for (let i = 0; i < 6; i++) line(ctx, [[300, 620 + i * 46], [1620 - (i % 3) * 160, 620 + i * 46]], 4, '#cbbd96');
    // efsane yumurtası çatlıyor
    const eg = seg(t, W(id, 'efsane') - .2, W(id, 'doğuyor') + .4); if (eg > 0) { ctx.save(); ctx.translate(1500, 800); ell(ctx, 0, 0, 70, 90, '#f6efdc', C.ink, 5); line(ctx, [[-50, -10], [-20, 10], [0, -14], [24, 12], [52, -8]], 5, C.ink); ctx.restore(); T(ctx, t, 'efsane doğuyor!', 1380, 700, 90, INK, W(id, 'efsane') - .1, W(id, 'doğuyor') + .4, { align: 'center', rot: .03 }); }
  } else if (t < c3) {
    plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 970 });
    const dream = P({ armL: [-96, -410], armR: [96, -410], headRoll: -3, f: { look: [.8, -.6], mouth: MOUTH.smile, lid: .2, browL: [-6, -.1, .3], browR: [-10, -.2, .4] } });
    const S = actor('quiz', [[c2, dream]], t, { x: 560, s: .95, k: 1.1 }); S.headRoll += Math.sin(t * 1.7) * 3; S.lean += Math.sin(t * 1.4) * 1.2; drawMary(ctx, S);
    // hayal gücü bulutu + alev
    const u = bk(seg(t, W(id, 'bir', 2) - .2, W(id, 'gazetecinin') + .4)); if (u > 0) { ctx.save(); ctx.translate(1080, 360); ctx.scale(u * 1.2, u * 1.2); const cl = [[-110, 10, 70], [-30, -50, 78], [60, -44, 72], [122, 6, 66], [50, 60, 70], [-50, 64, 68]]; ctx.lineWidth = 7; ctx.strokeStyle = C.ink; for (const [cx, cy, r] of cl) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); } ctx.fillStyle = '#f8f1e2'; for (const [cx, cy, r] of cl) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); }
      const fl = Math.sin(t * 12) * 6; shape(ctx, [[0, 70], [-40, 20], [-20, -30 - fl], [0, -70 - fl * 2], [22, -26], [44, 22]], '#e0753a', '#b4503a', { sw: 4, seed: 980, sx: -4, sy: -3 }); shape(ctx, [[0, 70], [-18, 30], [0, -8 - fl], [20, 30]], '#f6dc8a', null, { sw: 0, seed: 981 }); ctx.restore(); }
    T(ctx, t, 'hayal gücü', 1080, 640, 110, RED, W(id, 'hayal') - .1, W(id, 'gücüydü') + .4, { align: 'center', rot: -.02 });
    T(ctx, t, 'yanan tek şey…', 1080, 760, 90, INK, W(id, 'yanan') - .1, W(id, 'şey') + .4, { align: 'center', rot: -.02 });
  } else if (t < c4) {
    plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 971 });
    const hmm = P({ armL: [-96, -410], armR: [40, -640], headRoll: -5, f: { look: [.8, -.4], mouth: MOUTH.flat, browL: [-6, -.1, .3], browR: [-12, -.3, .4] } });
    const S = actor('wig2', [[c3, hmm]], t, { x: 560, s: .95, off: .2, k: 1.1 }); S.face.look = [.8, -.4]; S.headRoll += Math.sin(t * 2.2) * 4; S.armR.t[1] += Math.sin(t * 3) * 14; drawMary(ctx, S);
    ctx.save(); ctx.translate(1300, 930); poly(ctx, [[-90, 0], [90, 0], [74, -170], [-74, -170]], '#b9b2a2', '#8f897d', { sw: 5, sx: -8, sy: -4 }); ctx.restore();
    const du = W(id, 'duman'); for (let i = 0; i < 4; i++) { const q = ((t - du + i * .4) % 1.6) / 1.6; if (t > du - .2 && q >= 0) { ctx.save(); ctx.globalAlpha = (1 - q) * .8; ell(ctx, 1300 + Math.sin(q * 5 + i) * 30, 740 - q * 260, 22 + q * 40, 22 + q * 36, '#d9d4cb', C.ink, 2.4); ctx.restore(); } }
    T(ctx, t, 'biraz duman…?', 1000, 330, 120, INK, W(id, 'biraz') - .1, W(id, 'duman') + .5, { align: 'center', rot: -.03 }); T(ctx, t, 'yıllar sonra bir muhabir', 960, 1030, 80, '#7a5c3e', W(id, 'muhabir') - .3, W(id, 'söylemiş') + .3, { align: 'center', rot: -.01 });
  } else {
    plainBG(ctx, '#d9c7a0', '#a67c52'); newsPaper(ctx, 960, 540, 1500, 900, .012);
    hand(ctx, 'SÜTYEN YAKANLAR', 960, 520, 150, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
    T(ctx, t, '"sokakta sütyen yakma"', 960, 330, 110, INK, W(id, 'meşhur') - .1, W(id, 'sahnesi') + .4, { align: 'center', rot: -.01 });
    T(ctx, t, 'büyük ölçüde', 960, 700, 100, '#7a5c3e', W(id, 'büyük') - .1, W(id, 'ölçüde') + .4, { align: 'center', rot: -.01 }); T(ctx, t, 'bir manşetin eseri!', 960, 830, 120, RED, W(id, 'gazete', 2) - .1, W(id, 'eseri') + .5, { align: 'center', rot: -.02 });
    pen(ctx, [[430, 880], [560, 860], [700, 892], [860, 868], [1040, 900], [1220, 868], [1400, 892], [1500, 880]], seg(t, W(id, 'eseri'), W(id, 'eseri') + .6), 7, INK);
    // gazeteci: manşetiyle gurur duyar
    const proud = P({ armL: [-150, -470], armR: [150, -470], headRoll: -4, f: { look: [-1, 0], turn: -.5, mouth: MOUTH.grin, lid: .25, blush: .6, browL: [-6, 0, .2], browR: [-6, 0, .2] } });
    const R4 = actor('wig2', [[c4, proud]], t, { x: 1740, s: 1.05, bust: true, off: .8 }); R4.y = 1560; R4.headRoll += Math.sin(t * 2.6) * 4; drawMary(ctx, R4);
  }
});

// ---------------- s43: özet zaman çizelgesi
sahneS('s43', (ctx, t) => {
  const id = 's43', b = SAH[id].bas, tl = t - b;
  plainBG(ctx, '#efe3c9', '#d9c7a0'); pinnedPaper(ctx, 960, 540, 1800, 960, -.005, '#f8efd9');
  T(ctx, t, 'Peki sütyeni kim buldu?', 960, 170, 120, INK, b, W(id, 'buldu') + .5, { align: 'center', fam: 'Alegreya', it: true, wt: 800, rot: -.01 });
  T(ctx, t, 'Tek bir kişi değil.', 960, 290, 110, RED, W(id, 'tek') - .1, W(id, 'değil') + .4, { align: 'center', rot: -.01 });
  const nodes = [[240, W(id, 'antik'), 'Antik Yunan', 'bant'], [600, W(id, 'romalılar'), 'Roma', 'etiket'], [960, W(id, 'orta'), 'Orta Çağ', 'çöp'], [1320, W(id, 'cadolle'), 'Cadolle', 'ateşkes'], [1680, W(id, 'mary'), 'Mary', '1.500 $']];
  // işaretçi (Mary rozeti) düğümden düğüme zıplar; her düğümün kelimesinde oraya varır
  const kp = [[b, 160], ...nodes.map(([x, t0]) => [t0 - .05, x])];
  let tipX = kp[kp.length - 1][1], moving = false;
  if (t <= kp[0][0]) tipX = kp[0][1]; else for (let i = 1; i < kp.length; i++) { const [t1, x1] = kp[i], [tp, xp] = kp[i - 1]; if (t <= t1) { const ta = Math.max(tp, t1 - 1.3), k = seg(t, ta, t1); tipX = lerp(xp, x1, sm(k)); moving = k > 0 && k < 1; break; } }
  const y = 700; line(ctx, [[160, y], [1760, y]], 8, '#b9a985'); line(ctx, [[160, y], [tipX, y]], 12, '#e06a50');
  nodes.forEach(([x, t0, nm, sub], i) => {
    const u = bk(seg(t, t0 - .1, t0 + .4)); if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u * (1 + Math.sin(t * 3 + i) * .03), u * (1 + Math.sin(t * 3 + i) * .03)); ell(ctx, 0, 0, 26, 26, ['#8a2f2c', '#8a2f2c', '#7a5c3e', '#c8a043', '#c8a043'][i], C.ink, 5);
    hand(ctx, nm, 0, 90, 66, INK, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); hand(ctx, sub, 0, 150, 52, '#7a5c3e', 1, { align: 'center' });
    ctx.save(); ctx.translate(0, -170); ctx.rotate(Math.sin(t * 2.6 + i) * (i === 1 ? .13 : .08));
    if (i === 0) { const w = k => Math.sin(t * 5 + k) * 12; drawBand(ctx, [[-90, 10 + w(0)], [-30, -20 + w(1)], [30, 14 + w(2)], [90, -10 + w(3)]], 36, 1); }
    if (i === 1) { line(ctx, [[0, 40], [0, -40]], 3, C.ink); rrect(ctx, -80, -80, 160, 56, 6); ctx.fillStyle = '#f6ecd4'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke(); hand(ctx, 'strophium', 0, -42, 34, RED, 1, { align: 'center' }); }
    if (i === 2) { ctx.save(); ctx.translate(0, Math.sin(t * 4) * 9); ctx.scale(.28, .28); linenBra(ctx, 0, 0, 1, t); ctx.restore(); line(ctx, [[-70, 50], [-50, 80], [50, 80], [70, 50]], 6, C.ink); }
    if (i === 3) { bigScissors(ctx, 0, 40, .34, .18 + Math.abs(Math.sin(t * 6)) * .1, 0); }
    if (i === 4) { for (const sd of [-1, 1]) poly(ctx, [[sd * 10, -40], [sd * 90, -40], [sd * 50, 30]], '#f8f1e2', '#e0d6bf', { sw: 3 }); line(ctx, [[-10, -40], [10, -40]], 6, '#d9a0a0'); ctx.save(); ctx.translate(110, 30); ctx.scale(Math.cos(t * 4), 1); coin(ctx, 0, 0, .8); ctx.restore(); }
    ctx.restore(); ctx.restore();
    const q = seg(t, t0, t0 + .9); if (q > 0 && q < 1) { ctx.save(); ctx.globalAlpha = (1 - q) * .8; ctx.beginPath(); ctx.arc(x, y, 30 + q * 80, 0, TAU); ctx.lineWidth = 6 * (1 - q) + 1; ctx.strokeStyle = '#e06a50'; ctx.stroke(); ctx.restore(); } });
  { const pu = bk(seg(t, b + .2, b + .8)); if (pu > 0) { const hop = moving ? -Math.abs(Math.sin(t * 10)) * 26 : Math.sin(t * 3) * 3; ctx.save(); ctx.translate(tipX, y - 76 + hop); ctx.scale(pu * 1.22, pu * 1.22); ctx.rotate(moving ? Math.sin(t * 10) * .1 : Math.sin(t * 2) * .05);
      ell(ctx, 0, 0, 62, 62, '#c8a043', C.ink, 5); ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 52, 0, TAU); ctx.clip(); ctx.fillStyle = '#efe3c9'; ctx.fillRect(-60, -60, 120, 120);
      const A = actor('mary', [[b, P({ headRoll: moving ? 0 : Math.sin(t * 2) * 6, f: { mouth: (moving || t > kp[1][0]) ? MOUTH.grin : MOUTH.flat, look: [moving ? 1 : Math.sin(t * 1.6), 0], blush: .5, browL: [-6, 0, .2], browR: [-6, 0, .2] } })]], t, { x: 0, s: .34, bust: true, off: .5 }); A.y = 262; drawMary(ctx, A); ctx.restore(); ctx.restore();
      if (t < kp[1][0] - .6) T(ctx, t, '?', tipX + 90, y - 100 + Math.sin(t * 5) * 8, 110, RED, b + .8, b + 1.2, { fam: 'Alegreya', it: true, wt: 800, rot: .06 }); } }
});

// ---------------- s43b: sütyen bir icat değil… bir isyan
sahneS('s43b', (ctx, t) => {
  const id = 's43b', b = SAH[id].bas;
  plainBG(ctx, '#efe3c9', '#d9c7a0'); pinnedPaper(ctx, 960, 540, 1700, 700, .008, '#f8efd9');
  T(ctx, t, 'Yani sütyen bir icat değil…', 960, 330, 120, INK, b, W(id, 'değil') + .4, { align: 'center', rot: -.01 });
  const u = bk(seg(t, W(id, 'isyan') - .15, W(id, 'isyan') + .4)); ctx.save(); ctx.translate(960, 640); ctx.scale(u, u); hand(ctx, 'bir İSYAN!', 0, 0, 230, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore();
  // havaya kalkmış yumruk (kol manşetiyle)
  if (u > 0) { ctx.save(); ctx.translate(1590, lerp(1180, 800, u)); ctx.scale(1.4, 1.4); ctx.rotate(-.06 + Math.sin(t * 7) * .02);
    poly(ctx, [[-36, 260], [36, 260], [32, 60], [-32, 60]], '#8a6a8f', '#6a4d6f', { sw: 4, sx: -4, sy: -3 });
    poly(ctx, [[-42, 52], [42, 52], [40, 84], [-40, 84]], '#f1e8d0', '#d6c8aa', { sw: 3.4, sx: -3, sy: -2 });
    shape(ctx, [[-50, 40], [-56, -10], [-46, -44], [-20, -58], [20, -58], [46, -44], [56, -10], [50, 40], [30, 52], [-30, 52]], '#ecc5a4', '#d3a07f', { sw: 4.4, seed: 990, sx: -5, sy: -3 });
    for (let i = 0; i < 4; i++) { const fx = -39 + i * 26; shape(ctx, [[fx - 12, -62], [fx - 13, -20], [fx + 13, -20], [fx + 12, -62]], '#f3d2b6', '#d3a07f', { sw: 3.4, seed: 991 + i, sx: -3, sy: -2 }); }
    shape(ctx, [[-58, 6], [-56, 34], [-30, 48], [22, 46], [30, 22], [-22, 12], [-28, -4]], '#ecc5a4', '#d3a07f', { sw: 4, seed: 996, sx: -4, sy: -3 });
    ctx.restore(); }
});

// ---------------- s19c: bu korse beni öldürecek diyen kadınların isyanı
sahneS('s19c', (ctx, t) => {
  const id = 's19c', b = SAH[id].bas, d = SAH[id].dur;
  ctx.fillStyle = '#6b5440'; ctx.fillRect(-100, -100, 2120, 1300); for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#725944' : '#634b39'; ctx.fillRect(i * 120 - 20, -100, 118, 1300); }
  shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.woodD, C.wood, { sw: 0, seed: 991 });
  const tS = W(id, 'korse'), fist = (k) => P({ armL: [-190, -700 + k * 8], armR: [190, -700 - k * 8], headDY: -6, f: { look: [0, -.2], mouth: { w: 20, open: .6, smile: -.6, teeth: 1, shape: '' }, browL: [3, .45, 0], browR: [3, .45, 0], blush: .8 } });
  [['lady1', 330], ['lady2', 760], ['lady3', 1190], ['lady4', 1620]].forEach(([lk, x], i) => { const S = actor(lk, [[b, P({ armL: [-96, -410], armR: [96, -410], f: { mouth: MOUTH.flat, browL: [-3, 0, .1], browR: [-3, 0, .1], sweat: .3 } })], [tS - .3 + i * .1, fist(i), bk]], t, { x, s: .85, off: i * .7, k: 1.08 }); S.armL.t[1] += Math.sin(t * 9 + i) * 14; S.armR.t[1] += Math.cos(t * 9 + i) * 14; drawMary(ctx, S); });
  pinnedPaper(ctx, 960, 68, 1300, 112, -.01, '#f8efd9'); T(ctx, t, '"Bu korse beni öldürecek!"', 960, 92, 84, RED, tS - .1, W(id, 'öldürecek') + .5, { align: 'center', rot: -.01 });
  T(ctx, t, 'kadınların isyanı', 960, 1040, 100, CREAM, W(id, 'kadınların') - .1, W(id, 'isyanı') + .5, { align: 'center', rot: -.01, shadow: 'rgba(20,12,6,.85)' });
});

// ---------------- s41c: Reyburn bir kitap daha yazdı
sahneS('s41c', (ctx, t) => {
  const id = 's41c', b = SAH[id].bas, d = SAH[id].dur;
  const R = reyburnDesk(ctx, t, b, { seq: [[b, P({ armL: [-70, -420 + Math.sin(t * 16 + 2.5) * 20], armR: [70, -420 + Math.sin(t * 16) * 24], headDY: 6 + Math.sin(t * 8) * 3, f: { look: [0, .8], mouth: MOUTH.smile, lid: .2 } })], [W(id, 'o') + .2, P({ armL: [-70, -420], armR: [170, -560], headRoll: 5, f: { look: [1, 0], mouth: MOUTH.grin, lid: .5, browL: [-4, .2, .2], browR: [-10, -.2, .3], blush: .3 } }), bk]] });
  // Otto hayaleti köşeden el sallar
  const gh = bk(seg(t, W(id, 'ottoyu') - .1, W(id, 'ottoyu') + .5)); if (gh > 0) { ctx.save(); ctx.globalAlpha = .55; ctx.translate(1700, 450); ctx.scale(gh, gh); const o = actor('otto', [[b, P({ armR: [200, -620], f: { mouth: MOUTH.grin, look: [-1, 0] } })]], t, { x: 0, s: .55, bust: true, off: 1 }); o.y = 330; o.armR.t[0] += Math.sin(t * 8) * 30; drawMary(ctx, o); ctx.restore(); }
  // ikinci kitap belirir
  const k = bk(seg(t, W(id, 'kitap') - .1, W(id, 'daha') + .4)); if (k > 0) { ctx.save(); ctx.translate(1400, 840); ctx.rotate(-.1); ctx.scale(k, k); poly(ctx, [[-110, -150], [110, -150], [110, 70], [-110, 70]], '#7a5c3e', '#5a4128', { sw: 5, sx: -8, sy: -5 }); hand(ctx, 'KİTAP 2', 0, -60, 56, '#e8d9b0', 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore(); }
  T(ctx, t, 'Wallace Reyburn', 960, 150, 110, CREAM, W(id, 'wallace') - .1, W(id, 'reyburnü') + .5, { align: 'center', rot: -.02, shadow: 'rgba(30,18,10,.8)' });
  T(ctx, t, 'bir kitap daha!', 1330, 600, 100, '#f6dc8a', W(id, 'bir') - .1, W(id, 'yazdı') + .5, { align: 'center', rot: .03, shadow: 'rgba(30,18,10,.8)' });
});

// ---------------- s44a: dünya tuvaleti yanlış biliyor – bir sonraki videoda: tuvaletin gerçek hikâyesi – sifon 2 kere
sahneS('s44a', (ctx, t) => {
  const id = 's44a', b = SAH[id].bas, d = SAH[id].dur, c = W(id, 'bir') - .2;
  if (t < c) {   // dünya yanlış biliyor
    plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 1000 });
    ctx.save(); ctx.translate(560, 560 + Math.sin(t * 2.4) * 10); ctx.rotate(Math.sin(t * 1.8) * .05); ell(ctx, 0, 0, 230, 230, '#e6d4a6', C.ink, 7); for (const ry of [.4, .75]) { ctx.beginPath(); ctx.ellipse(0, 0, 230, 230 * ry, 0, 0, TAU); ctx.lineWidth = 3; ctx.strokeStyle = '#a58f66'; ctx.stroke(); } ell(ctx, -70, -30, 24, 28, C.white, C.ink, 4); ell(ctx, 70, -30, 24, 28, C.white, C.ink, 4); ell(ctx, -66 + Math.sin(t * 2) * 4, -26, 10, 10, C.ink, null); ell(ctx, 74 + Math.sin(t * 2) * 4, -26, 10, 10, C.ink, null); line(ctx, [[-50, 60], [0, 90], [50, 60]], 7, C.ink); ctx.restore();
    pinnedPaper(ctx, 1280, 460, 760, 360, .03, '#f8efd9'); T(ctx, t, '"Tuvaleti ... icat etti."', 1280, 440, 66, INK, W(id, 'tuvaleti') - .1, W(id, 'ettiğini') + .3, { align: 'center', rot: .03 }); crossOut(ctx, 1000, 380, 1560, 500, seg(t, W(id, 'yanlış') - .1, W(id, 'yanlış') + .4));
    T(ctx, t, 'yanlış biliyor!', 1280, 700, 130, RED, W(id, 'yanlış') - .1, W(id, 'biliyor') + .5, { align: 'center', rot: -.03 });
    T(ctx, t, 'o kitap yüzünden', 960, 190, 100, INK, b, W(id, 'yüzünden') + .4, { align: 'center', rot: -.01 });
  } else {
    ctx.fillStyle = '#1b1514'; ctx.fillRect(-100, -100, 2120, 1300);
    const g = ctx.createRadialGradient(960, 560, 40, 960, 560, 640); g.addColorStop(0, 'rgba(255,230,170,.55)'); g.addColorStop(1, 'rgba(255,230,170,0)'); ctx.fillStyle = g; ctx.fillRect(-100, -100, 2120, 1300);
    // yüksek rezervuarlı eski tuvalet
    ctx.save(); ctx.translate(960, 930); poly(ctx, [[-90, -700], [90, -700], [90, -600], [-90, -600]], '#e6dcc5', '#cdc2a8', { sw: 5, sx: -8, sy: -4 }); const swg = Math.sin((t - W(id, 'sifonu')) * 4.5) * 26 * Math.exp(-Math.max(0, t - W(id, 'sifonu')) * .25), cx2 = 30 + swg; line(ctx, [[0, -600], [0, -520], [cx2, -430]], 12, C.ink); line(ctx, [[0, -600], [0, -520], [cx2, -430]], 7, '#b7b0a2'); for (let i = 0; i < 6; i++) ell(ctx, cx2 + Math.sin(i) * 3 + swg * i * .06, -430 + i * 14, 6, 8, '#8f897d', C.ink, 2); ell(ctx, cx2 + 2 + swg * .4, -340, 18, 18, '#e6dcc5', C.ink, 4);
    shape(ctx, [[-110, -140], [110, -140], [96, -50], [60, 0], [-60, 0], [-96, -50]], '#efe8d6', '#d6ccb4', { sw: 5, seed: 1001, sx: -8, sy: -4 }); ell(ctx, 0, -146, 110, 24, '#d6ccb4', C.ink, 4); ctx.restore();
    // el: zincire uzanır, iki kez tereddüt eder
    const tt = [W(id, 'sifonu') + .2, W(id, '2') + .1]; let hy = 0; const reach = 1 - .2 * Math.abs(Math.sin((t - W(id, 'sifonu')) * 4)); const ap = seg(t, W(id, 'sifonu') - .2, W(id, 'sifonu') + .5);
    ctx.save(); ctx.translate(lerp(1400, 1040 - 70 * Math.abs(Math.sin((t - W(id, 'sifonu')) * 3.2)), sm(ap)), 590 + Math.sin((t - W(id, 'sifonu')) * 3.2) * 46); ctx.rotate(.15); shape(ctx, [[-30, 20], [-34, -14], [-18, -40], [10, -44], [30, -24], [34, 10], [20, 30]], '#ecc5a4', '#d3a07f', { sw: 3.6, seed: 1002, sx: -4, sy: -3 }); line(ctx, [[30, 10], [140, 40]], 36, C.ink); line(ctx, [[30, 10], [140, 40]], 28, '#ecc5a4'); ctx.restore();
    T(ctx, t, 'sana söz veriyorum:', 400, 270, 90, CREAM, W(id, 'sana') - .1, W(id, 'veriyorum') + .4, { align: 'center', rot: -.03, shadow: 'rgba(0,0,0,.6)' });
    T(ctx, t, 'Tuvaletin gerçek hikâyesi', 1500, 880, 84, '#f6dc8a', W(id, 'tuvaletin') - .1, W(id, 'hikâyesi') + .5, { align: 'center', rot: .03, shadow: 'rgba(0,0,0,.6)' });
    T(ctx, t, 'bir sonraki videoda', 1500, 770, 76, CREAM, c + .1, W(id, 'videoda') + .4, { align: 'center', rot: .03, shadow: 'rgba(0,0,0,.6)' });
    T(ctx, t, '2 kere düşüneceksin!', 960, 1030, 110, CREAM, W(id, 'çekmeden') - .1, W(id, 'düşüneceksin') + .5, { align: 'center', rot: -.01, shadow: 'rgba(0,0,0,.6)' });
    for (let i = 0; i < 2; i++) { const t0 = tt[i] + (i ? .8 : 0); if (t > t0) T(ctx, t, '…', 760 + i * 100, 560, 120, '#f6dc8a', t0, t0 + .3, { fam: 'Alegreya', it: true, wt: 800 }); }
  }
});

// ---------------- s44c: ondan sonrakini sen seç! – topuklu, çatal, tuvalet kâğıdı – yorumlara yaz
sahneS('s44c', (ctx, t) => {
  const id = 's44c', b = SAH[id].bas;
  chalkboard(ctx);
  chalk(ctx, t, 'Sen seç!', 960, 250, 200, b, W(id, 'seç') + .4, { align: 'center', col: '#f6dc8a', rot: -.02 });
  const opts = [['Topuklu ayakkabıyı kim buldu?', W(id, 'topuklu'), 470], ['Çatalı kim buldu?', W(id, 'çatalı'), 630], ['Tuvalet kâğıdı yokken ne kullanıyorlardı?', W(id, 'yoksa'), 790]];
  opts.forEach(([txt, t0, y], i) => { chalk(ctx, t, txt, 300, y, 72, t0 - .05, t0 + .9, { rot: -.01 }); chalk(ctx, t, String(i + 1) + '.', 170, y, 72, t0 - .05, t0 + .3, { fam: 'Alegreya', it: true, wt: 800, col: '#f6dc8a' }); });
  // ikonlar
  const ic = (i, x, y) => { const u = bk(seg(t, opts[i][1] + .3, opts[i][1] + .8)); if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); ctx.strokeStyle = '#f1ece0'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (i === 0) ctx.rotate(Math.sin(t * 4) * .14); if (i === 1) ctx.translate(0, Math.sin(t * 5) * 9); if (i === 2) ctx.rotate(Math.sin(t * 2.5) * .12);
    if (i === 0) { ctx.beginPath(); ctx.moveTo(-60, -20); ctx.lineTo(-10, -20); ctx.lineTo(50, 30); ctx.lineTo(70, 30); ctx.lineTo(70, 46); ctx.lineTo(-60, 46); ctx.closePath(); ctx.stroke(); line(ctx, [[-50, 46], [-50, 70]], 6, '#f1ece0'); }
    if (i === 1) { line(ctx, [[0, 70], [0, -10]], 7, '#f1ece0'); for (const x2 of [-24, -8, 8, 24]) line(ctx, [[x2, -10], [x2, -64]], 6, '#f1ece0'); ctx.beginPath(); ctx.arc(0, -10, 24, 0, Math.PI); ctx.stroke(); }
    if (i === 2) { ctx.beginPath(); ctx.ellipse(0, 0, 50, 56, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, 18, 20, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(50, 20); ctx.quadraticCurveTo(70 + Math.sin(t * 4) * 8, 46, 94 + Math.sin(t * 4 + 1) * 10, 34 + Math.sin(t * 3) * 10); ctx.stroke(); }
    ctx.restore(); };
  ic(0, 1380, 450); ic(1, 1380, 620); ic(2, 1380, 790);
  const pt = k => P({ armL: [-270, -600 + k * 70], armR: [96, -410], headRoll: -4, f: { look: [-1, -.2 + k * .25], turn: -.5, mouth: MOUTH.grin, blush: .6, browL: [-6, 0, .2], browR: [-6, 0, .2] } });
  const wav = P({ armL: [-96, -410], armR: [200, -690 + Math.sin(t * 9) * 40], headRoll: 4, f: { mouth: MOUTH.grin, blush: .8, lid: .15 } });
  const yy0 = W(id, 'yorumlara'); const H = actor('mary', [[b, pt(0)], [opts[0][1] - .2, pt(0)], [opts[1][1] - .1, pt(1), sm], [opts[2][1] - .1, pt(2), sm], [yy0 - .2, pt(2)], [yy0 + .2, wav, bk]], t, { x: 1730, s: 1.1, bust: true }); H.y = 1600; H.headRoll += Math.sin(t * 3) * 3; if (t < yy0 - .2) H.armL.t[1] += Math.sin(t * 6) * 22; drawMary(ctx, H);
  const yy = W(id, 'yorumlara'); chalk(ctx, t, 'Yorumlara yaz!', 960, 930, 100, yy - .1, W(id, 'yaz') + .5, { align: 'center', col: '#a9c58a', rot: -.01 });
  const u = bk(seg(t, yy + .2, yy + .7)); if (u > 0) { ctx.save(); ctx.translate(1460, 925); ctx.scale(u, u); ctx.strokeStyle = '#a9c58a'; ctx.lineWidth = 6; rrect(ctx, -80, -50, 160, 100, 22); ctx.stroke(); line(ctx, [[-30, 50], [-50, 90], [10, 50]], 6, '#a9c58a'); for (const x of [-34, 0, 34]) ell(ctx, x, 0, 6, 6, '#a9c58a', null); ctx.restore(); }
});

// ---------------- s33b: görüşmek üzere – nefes almak isteğe bağlı değildir
sahneS('s33b', (ctx, t) => {
  const id = 's33b', b = SAH[id].bas, d = SAH[id].dur, tN = W(id, 'nefes');
  ctx.save(); kam(ctx, zc(1500, 545, 1.25, 1.31, t, b, b + d)); drawRoom(ctx, { t, camx: 1500, canapes: 3, mirrorX: 2850 });
  const wave = P({ armL: [-96, -410], armR: [200, -690 + Math.sin(t * 9) * 40], headRoll: 4, f: { mouth: MOUTH.grin, blush: .8, lid: .15 } });
  const breath = P({ armL: [-230, -640], armR: [230, -640], chest: 2.8, headDY: -14, headRoll: 3, f: { lid: .75, mouth: MOUTH.grin, blush: .9, browL: [-8, -.1, .3], browR: [-8, -.1, .3] } });
  const S = actor('mary', [[b, wave], [tN - .5, wave], [tN, breath, bk]], t, { x: 1500, k: 1 }); S.chest += Math.sin(t * 2.2) * .6 * seg(t, tN, tN + 1); if (t < tN) S.lean += Math.sin(t * 5) * 1.2; drawMary(ctx, S); ctx.restore();
  pinnedPaper(ctx, 350, 150, 560, 170, -.02, '#f6ecd4'); T(ctx, t, 'Görüşmek üzere!', 100, 175, 90, INK, b, W(id, 'üzere') + .5, { rot: -.02 });
  if (t > tN - .1) { pinnedPaper(ctx, 1560, 700, 700, 330, -.02, '#f8efd9'); hand(ctx, 'nefes almak:', 1280, 620, 62, INK, seg(t, tN, tN + .4)); pen(ctx, [[1290, 650], [1328, 650], [1328, 688], [1290, 688], [1290, 650]], seg(t, tN + .3, tN + .55), 4, INK); hand(ctx, 'zorunlu', 1352, 686, 54, INK, seg(t, tN + .3, tN + .6)); pen(ctx, [[1290, 724], [1328, 724], [1328, 762], [1290, 762], [1290, 724]], seg(t, tN + .3, tN + .55), 4, INK); hand(ctx, 'isteğe bağlı', 1352, 760, 54, INK, seg(t, tN + .3, tN + .6));
    crossOut(ctx, 1340, 722, 1640, 770, seg(t, W(id, 'değildir') - .2, W(id, 'değildir') + .3)); pen(ctx, [[1294, 676], [1308, 690], [1342, 646]], seg(t, W(id, 'değildir') + .1, W(id, 'değildir') + .5), 8, '#5f6b4a'); }
});
