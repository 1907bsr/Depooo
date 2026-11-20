'use strict';
// ===== Sahneler 5: s31–s38 (Mary, dikiş, balo, patent, para, Caresse) =====
function lungs(ctx, x, y, s, t, brief) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const bob = Math.abs(Math.sin(t * 6)) * 10;
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * 54, -bob * (sd > 0 ? 1 : .8));
    line(ctx, [[-8, 60], [-10 + Math.sin(t * 6 + sd) * 6, 96]], 6, C.ink); line(ctx, [[8, 60], [10 - Math.sin(t * 6 + sd) * 6, 96]], 6, C.ink);
    shape(ctx, [[sd * 8, -70], [sd * 60, -46], [sd * 82, 10], [sd * 60, 62], [sd * 14, 66], [sd * 2, 8]], '#e3a0a0', '#c67f7f', { sw: 3.6, seed: 900 + sd, sx: -5, sy: -3 });
    line(ctx, [[sd * 30, -30], [sd * 52, 20]], 3, '#b86a6a'); line(ctx, [[sd * 24, 0], [sd * 44, 34]], 3, '#b86a6a');
    ell(ctx, sd * 34, -10, 9, 10, C.white, C.ink, 2.4); ell(ctx, sd * 36, -8, 4, 4, C.ink, null);
    if (brief && sd > 0) { rrect(ctx, 56, 30, 60, 44, 6); ctx.fillStyle = '#7a5a3c'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke(); line(ctx, [[72, 30], [72, 22], [100, 22], [100, 30]], 3, C.ink); }
    ctx.restore(); }
  line(ctx, [[0, -90], [0, -50]], 8, C.ink); line(ctx, [[0, -90], [0, -50]], 4, '#d9d2c4'); line(ctx, [[0, -50], [-30, -30]], 6, C.ink); line(ctx, [[0, -50], [30, -30]], 6, C.ink);
  ctx.restore();
}
function chandelier(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); line(ctx, [[0, -200], [0, 0]], 5, C.goldD);
  for (const [w, dy] of [[200, 30], [140, 90]]) { ell(ctx, 0, dy, w, w * .16, null, C.gold, 7); for (let i = -4; i <= 4; i++) { const cx = i * w / 4.5; line(ctx, [[cx, dy], [cx, dy + 40]], 2.4, '#e6e0cc'); ell(ctx, cx, dy + 48, 5, 9, 'rgba(255,255,255,.7)', C.ink, 1.6); if (dy === 30) { rr(ctx, cx - 4, dy - 22, 8, 22, '#f6efdc'); ell(ctx, cx, dy - 28, 5, 8 + Math.sin(t * 9 + i) * 1.5, '#f6dc8a', null); } } }
  ctx.restore(); glow(ctx, x, y + 40 * s, 360 * s, 'rgba(255,224,150,A)', .3);
}
function ballroom(ctx, t) {
  ctx.fillStyle = '#e9dcc0'; ctx.fillRect(-100, -100, 2120, 1300); for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#e4d6b8' : '#eee2c8'; ctx.fillRect(i * 120 - 20, -100, 118, 1300); }
  for (const x of [260, 700, 1220, 1660]) { poly(ctx, [[x - 90, 700], [x + 90, 700], [x + 90, 220], [x, 150], [x - 90, 220]], '#f3e4c2', '#d9c9a6', { sw: 5, sx: -6, sy: -4 }); line(ctx, [[x, 150], [x, 700]], 6, C.goldD); line(ctx, [[x - 90, 400], [x + 90, 400]], 6, C.goldD); }
  for (const [x, y, s] of [[480, 130, .8], [960, 100, 1.0], [1440, 130, .8]]) chandelier(ctx, x, y, s, t);
  // parke
  const g = ctx.createLinearGradient(0, 700, 0, 1080); g.addColorStop(0, '#c9a97a'); g.addColorStop(1, '#a98a5c'); ctx.fillStyle = g; ctx.fillRect(-100, 700, 2120, 400); ctx.strokeStyle = 'rgba(90,60,30,.25)'; ctx.lineWidth = 2; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(i * 190 - 100, 700); ctx.lineTo(i * 260 - 600, 1100); ctx.stroke(); }
  // arka planda dans eden çiftler (siluet)
  for (let i = 0; i < 4; i++) { const cx = 360 + i * 400 + Math.sin(t * 1.2 + i) * 40, sw = Math.sin(t * 2 + i * 1.7) * 14; ctx.save(); ctx.translate(cx, 690); ctx.globalAlpha = .75; for (const sd of [-1, 1]) { ell(ctx, sd * (18 + sw * .3), -150, 14, 16, ['#8f7a6a', '#6f6a78'][(i + (sd > 0 ? 1 : 0)) % 2], C.ink, 2); poly(ctx, [[sd * (18 + sw * .3) - 20, -132], [sd * (18 + sw * .3) + 20, -132], [sd * (18 + sw * .3) + 34, -10], [sd * (18 + sw * .3) - 34, -10]], ['#8f7a6a', '#6f6a78'][(i + (sd > 0 ? 1 : 0)) % 2], null, { sw: 2.4 }); } ctx.restore(); }
}
function calendarPage(ctx, x, y, s, top, bottom, big) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); poly(ctx, [[-130, -150], [130, -150], [130, 160], [-130, 160]], '#f8efd9', '#e2d5b4', { sw: 4, sx: -6, sy: -4 }); poly(ctx, [[-130, -150], [130, -150], [130, -90], [-130, -90]], '#b4503a', null, { sw: 4 });
  hand(ctx, top, 0, -108, 46, '#f8efd9', 1, { align: 'center' }); hand(ctx, bottom, 0, 70, big || 90, INK, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore();
}
function moneyBag(ctx, x, y, s, label) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); shape(ctx, [[-60, 0], [-70, -60], [-36, -104], [-18, -116], [18, -116], [36, -104], [70, -60], [60, 0]], '#c9b48a', '#a58f66', { sw: 4, seed: 910, sx: -8, sy: -4 }); line(ctx, [[-22, -112], [22, -112]], 7, '#7a5c3e'); hand(ctx, label || '$', 0, -34, 70, '#5f6b4a', 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore(); }
function coin(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ell(ctx, 0, 0, 30 * s, 30 * s, '#d9b64a', C.ink, 3.4 * s); ell(ctx, 0, 0, 21 * s, 21 * s, null, '#a07f33', 2.4 * s); hand(ctx, '$', 0, 11 * s, 34 * s, '#8f6a22', 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore(); }

// ---------------- s31: açıştaki baloya dönelim – Mary Phelps Jacob
sahneS('s31', (ctx, t) => {
  const id = 's31', b = SAH[id].bas, d = SAH[id].dur;
  ctx.save(); kam(ctx, zc(1500, 545, 1.25, 1.33, t, b, b + d)); drawRoom(ctx, { t, camx: 1500, canapes: 3, mirrorX: 2850 });
  const proud = P({ armL: [-96, -410], armR: [96, -410], headDY: -6, headRoll: 3, f: { mouth: MOUTH.grin, browL: [-6, -.1, .2], browR: [-6, -.1, .2], blush: .65, lid: .1 } });
  const me = P({ armL: [-96, -410], armR: [26, -520], headRoll: -3, f: { mouth: MOUTH.grin, browL: [-9, -.1, .3], browR: [-9, -.1, .3], blush: .8, look: [0, 0] } });
  const S = actor('mary', [[b, proud], [W(id, 'sensin') - .3, proud], [W(id, 'sensin') - .05, me, bk]], t, { x: 1500 }); drawMary(ctx, S); ctx.restore();
  T(ctx, t, '◀◀ 1913', 90, 130, 100, INK, b, b + .6, { fam: 'Alegreya', it: true, wt: 800, rot: -.02 });
  T(ctx, t, 'Mary Phelps Jacob', 90, 520, 130, RED, W(id, 'mary') - .1, W(id, 'jacob') + .7, { fam: 'Alegreya', it: true, wt: 800, rot: -.02 });
  line(ctx, [[100, 556], [760, 560]], 5, '#b8892e');
  T(ctx, t, '(sen)', 300, 650, 100, INK, W(id, 'sensin'), W(id, 'sensin') + .4, { rot: -.04 }); pen(ctx, curve([420, 600], [560, 520], [700, 400], 14), seg(t, W(id, 'sensin') + .2, W(id, 'sensin') + .6), 6, INK, { arrow: 16 });
});

// ---------------- s32: 2 mendil, bir kurdele, iğne iplik – hizmetçiyle dikiş
sahneS('s32', (ctx, t) => {
  const id = 's32', b = SAH[id].bas, d = SAH[id].dur;
  ctx.fillStyle = '#d9c9a8'; ctx.fillRect(-100, -100, 2120, 1300); for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#d3c2a0' : '#decfae'; ctx.fillRect(i * 120 - 20, -100, 118, 1300); }
  glow(ctx, 960, 200, 700, 'rgba(255,224,150,A)', .3);
  const down = (side) => P({ armL: [-90, -400], armR: [90, -400], f: { look: [side * .3, .8], mouth: MOUTH.smile, browL: [-4, 0, .1], browR: [-4, 0, .1], lid: .2 } });
  const M = actor('mary', [[b, down(1)]], t, { x: 700, s: 1.35, bust: true, off: .2 }); M.y = 1500;
  const A = actor('maid', [[b, P({ armL: [-90, -400], armR: [90, -400], f: { look: [-.3, .8], mouth: { w: 14, open: 0, smile: -.05, shape: '' }, browL: [-3, 0, .1], browR: [-3, 0, .1], lid: .2 } })]], t, { x: 1250, s: 1.35, bust: true, off: 1.4 }); A.y = 1500;
  drawMary(ctx, M); drawMary(ctx, A);
  poly(ctx, [[-100, 790], [2020, 790], [2020, 1100], [-100, 1100]], '#8d6a4c', '#6b4d36', { sw: 4, sx: 0, sy: -8 });
  const mit = (x, y, rot, col) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); shape(ctx, [[-30, 24], [-34, -14], [-18, -40], [10, -44], [30, -24], [34, 10], [20, 30]], col, '#d3a07f', { sw: 3.6, seed: 960, sx: -4, sy: -3 }); ctx.save(); ctx.translate(-34, -6); ctx.rotate(-.7); shape(ctx, [[-8, 0], [-4, -24], [8, -26], [10, 0]], col, null, { sw: 3, seed: 961 }); ctx.restore(); ctx.restore(); };
  // masadaki malzemeler
  const tM = W(id, 'mendil'), tK = W(id, 'kurdele'), tI = W(id, 'iğne'), tD = W(id, 'dikiyorsun');
  const lace = (x, y, r, k) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.scale(k, k); poly(ctx, [[-60, -50], [60, -50], [60, 50], [-60, 50]], '#f8f1e2', '#e0d6bf', { sw: 3.4, sx: -4, sy: -3 }); ctx.setLineDash([8, 7]); ctx.strokeStyle = '#a58f66'; ctx.lineWidth = 2.4; ctx.strokeRect(-48, -38, 96, 76); ctx.setLineDash([]); for (const [dx, dy] of [[-20, -10], [10, 6], [-6, 22], [22, -20]]) ell(ctx, dx, dy, 4, 4, '#cbbd96', null); ctx.restore(); };
  const asm = sm(seg(t, tD - .2, tD + 1.4));
  if (asm < .98) { lace(520, 920, -.15, bk(seg(t, tM - .1, tM + .35))); lace(760, 960, .12, bk(seg(t, tM + .1, tM + .5))); }
  const rb = seg(t, tK - .1, tK + .4); if (rb > 0 && asm < .98) { line(ctx, [[1000, 930], [1070, 900], [1130, 940], [1200, 910]], 16, '#d9a0a0'); line(ctx, [[1000, 930], [1070, 900], [1130, 940], [1200, 910]], 7, '#efc0c0'); }
  const nd = seg(t, tI - .1, tI + .4); if (nd > 0) { ctx.save(); ctx.translate(1380, 880); ctx.rotate(-.5); line(ctx, [[0, 0], [90, 0]], 5, '#d9d2c4'); ell(ctx, 6, 0, 6, 2.4, C.ink, null); ctx.restore(); ell(ctx, 1460, 900, 22, 22, '#c8a043', C.ink, 3); ell(ctx, 1460, 900, 10, 10, '#3a2c24', null); }
  if (asm > 0) { ctx.save(); ctx.translate(960, 900 - 20 * asm); ctx.scale(asm * 1.5, asm * 1.5); for (const sd of [-1, 1]) { poly(ctx, [[sd * 20, -50], [sd * 110, -50], [sd * 70, 40]], '#f8f1e2', '#e0d6bf', { sw: 3.4, sx: -4, sy: -3 }); } line(ctx, [[-20, -50], [20, -50]], 8, '#d9a0a0'); line(ctx, [[-110, -50], [-130, -110]], 6, '#d9a0a0'); line(ctx, [[110, -50], [130, -110]], 6, '#d9a0a0'); ctx.restore(); }
  { const st = Math.sin(t * 9) * 14; mit(840, 880 + st, .3, '#ecc5a4'); mit(1080, 880 - st, -.3, '#e2b794'); line(ctx, [[1060, 850 - st], [1120, 830 + st]], 4, '#d9d2c4'); }
  T(ctx, t, '2 mendil', 140, 250, 100, INK, tM - .1, tM + .5, { rot: -.03, fam: 'Caveat' }); T(ctx, t, '1 kurdele', 140, 360, 100, INK, tK - .1, tK + .5, { rot: -.03 }); T(ctx, t, 'iğne iplik', 140, 470, 100, INK, tI - .1, W(id, 'iplik') + .4, { rot: -.03 });
  // kronometre
  const tc = W(id, 'birkaç'); if (t > tc - .2) { ctx.save(); ctx.translate(1700, 330); ctx.scale(bk(seg(t, tc - .2, tc + .3)), bk(seg(t, tc - .2, tc + .3))); ell(ctx, 0, 0, 90, 90, '#f4ead2', C.ink, 6); rr(ctx, -12, -116, 24, 20, '#8f897d'); const a = (t - tc) * 7; line(ctx, [[0, 0], [Math.sin(a) * 66, -Math.cos(a) * 66]], 6, '#b4503a'); ell(ctx, 0, 0, 7, 7, C.ink, null); ctx.restore(); T(ctx, t, 'birkaç dakika', 1700, 500, 70, INK, tc, tc + .5, { align: 'center', rot: -.02 }); }
});

// ---------------- s33: giyiyorsun ve… oluyor! – çubuk yok, tel yok, ızdırap yok – ciğerler işe dönüyor
sahneS('s33', (ctx, t) => {
  const id = 's33', b = SAH[id].bas, d = SAH[id].dur, tO = W(id, 'oluyor'), tL = W(id, 'ciğerlerin');
  ctx.save(); kam(ctx, zc(1500, 545, 1.25, 1.31, t, b, b + d)); drawRoom(ctx, { t, camx: 1500, canapes: 3, mirrorX: 2850 });
  const dress = P({ armL: [-96, -410], armR: [96, -410], f: { look: [0, .3], mouth: MOUTH.flat, lid: .1, browL: [-3, 0, .1], browR: [-3, 0, .1] } });
  const breathe = P({ armL: [-230, -640], armR: [230, -640], chest: 2.6, headDY: -14, headRoll: 3, f: { lid: .7, mouth: MOUTH.grin, browL: [-8, -.1, .3], browR: [-8, -.1, .3], blush: .9 } });
  const happy = P({ armL: [-200, -520], armR: [200, -520], chest: 1.2, headDY: -8, headRoll: -3, f: { lid: .6, mouth: MOUTH.grin, blush: .9 } });
  const S = actor('mary', [[b, dress], [tO - .4, dress], [tO + .1, breathe, bk], [W(id, 'yok', 3) + .2, happy, sm]], t, { x: 1500 }); S.chest += Math.sin(t * 2.4) * .6 * seg(t, tO, tO + 1);
  drawMary(ctx, S);
  // paravan: oluyor! anında kayar
  const scr = sm(seg(t, tO - .15, tO + .35));
  if (scr < 1) { ctx.save(); ctx.translate(-1300 * scr + 0, 0); for (let i = 0; i < 3; i++) { poly(ctx, [[1320 + i * 150, 330], [1450 + i * 150, 330], [1450 + i * 150, 930], [1320 + i * 150, 930]], i % 2 ? '#8e4a4c' : '#7d3c3e', '#5f2c30', { sw: 5, sx: -6, sy: 0 }); line(ctx, [[1385 + i * 150, 360], [1385 + i * 150, 900]], 3, '#c8a043'); } ctx.restore(); }
  ctx.restore();
  T(ctx, t, 'Giyiyorsun ve…', 100, 150, 100, INK, b, W(id, 've') + .3, { rot: -.02 });
  T(ctx, t, 'oluyor!', 140, 270, 130, RED, tO - .1, tO + .5, { rot: -.03 });
  // çubuk yok, tel yok, ızdırap yok
  const items = [['çubuk yok', W(id, 'çubuk'), 440], ['tel yok', W(id, 'tel'), 560], ['ızdırap yok', W(id, 'ızdırap'), 680]];
  items.forEach(([txt, t0, y]) => { T(ctx, t, txt, 1350, y, 90, INK, t0 - .1, t0 + .4, { rot: .02 }); crossOut(ctx, 1330, y - 70, 1330 + textW(ctx, txt, 90) + 20, y + 10, seg(t, t0 + .25, t0 + .6)); });
  // ciğerler işe gidiyor
  if (t > tL - .2) { const u = bk(seg(t, tL - .2, tL + .3)); ctx.save(); ctx.translate(430, 760); ctx.scale(u, u); const wx = lerp(-260, 200, clamp(seg(t, tL, tL + 2.2))); lungs(ctx, wx, 0, 1.3, t, true); ctx.restore(); poly(ctx, [[640, 640], [820, 640], [820, 880], [640, 880]], '#8d6a4c', '#6b4d36', { sw: 4, sx: -4, sy: 0 }); hand(ctx, 'İŞ', 730, 790, 110, CREAM, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); T(ctx, t, 'ciğerler işe dönüyor', 500, 990, 76, INK, tL, W(id, 'dönüyor') + .3, { align: 'center', rot: -.02 }); }
});

// ---------------- s34: balo – arkadaşlar etrafını sarıyor – jeton düştü – iş fikri
sahneS('s34', (ctx, t) => {
  const id = 's34', b = SAH[id].bas, d = SAH[id].dur;
  ctx.save(); const z = 1 + .03 * seg(t, b, b + d); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
  ballroom(ctx, t);
  const tJ = W(id, 'jeton'), tI = W(id, 'iş');
  const curious = (k, dir) => P({ armL: [-96, -410], armR: [96, -410], headRoll: dir * 4, f: { look: [dir, .3], turn: dir * .6, mouth: MOUTH.o, browL: [-10, -.2, .3], browR: [-10, -.2, .3], blush: .5 } });
  const ask = (dir) => P({ armL: dir > 0 ? [-96, -410] : [-230, -520], armR: dir > 0 ? [230, -520] : [96, -410], headRoll: dir * 3, f: { look: [dir, .2], turn: dir * .6, mouth: MOUTH.talk, browL: [-8, -.1, .3], browR: [-8, -.1, .3], blush: .6 } });
  const cast = [['friendA', 420, 1], ['friendB', 1360, -1], ['friendC', 1640, -1]];
  cast.forEach(([lk, x, dir], i) => { const S = actor(lk, [[b, curious(i, dir)], [W(id, 'bu') - .2, ask(dir), bk], [tJ - .3, ask(dir)]], t, { x, s: .85, off: i * .8 }); S.x += Math.sin(t * 3 + i) * 3; drawMary(ctx, S); });
  const mary = P({ armL: [-96, -410], armR: [96, -410], headDY: -6, f: { look: [-.5, 0], mouth: MOUTH.smile, lid: .2, blush: .5 } });
  const aha = P({ armL: [-96, -410], armR: [40, -640], headDY: -10, f: { look: [0, -.3], mouth: MOUTH.o, bulge: .8, browL: [-16, -.28, .45], browR: [-16, -.28, .45] } });
  const idea = P({ armL: [-96, -410], armR: [150, -660], headDY: -12, headRoll: 4, f: { mouth: MOUTH.grin, lid: .1, blush: .8, look: [0, -.3] } });
  const M = actor('mary', [[b, mary], [tJ - .1, mary], [tJ + .35, aha, bk], [tI, idea, bk]], t, { x: 900, s: .95 }); drawMary(ctx, M);
  T(ctx, t, '"Bu ne?"', 330, 250, 90, INK, W(id, 'bu') - .1, W(id, 'ne') + .3, { rot: -.04, shadow: 'rgba(255,245,225,.7)' });
  T(ctx, t, '"Bana da yapar mısın?"', 1480, 250, 80, INK, W(id, 'bana') - .1, W(id, 'mısın') + .3, { align: 'center', rot: .03, shadow: 'rgba(255,245,225,.7)' });
  // jeton düşüyor
  if (t > tJ - .5) { ctx.save(); ctx.translate(900, 120); poly(ctx, [[-110, -40], [110, -40], [110, 50], [-110, 50]], '#3a2c24', '#2a2018', { sw: 4, sx: -5, sy: -4 }); rrect(ctx, -70, -4, 140, 14, 7); ctx.fillStyle = '#0d0a08'; ctx.fill(); hand(ctx, 'fikir', 0, -14, 34, '#c8a043', 1, { align: 'center' }); ctx.restore();
    const u = clamp(seg(t, tJ - .4, tJ + .25)); if (u < 1) coin(ctx, 900, lerp(-60, 112, u * u), 1.0); }
  if (t > tI - .2) { const u = bk(seg(t, tI - .2, tI + .3)); ctx.save(); ctx.translate(1130, 190); drawBulb(ctx, 0, 0, u * .9, true, t); ctx.restore(); }
  T(ctx, t, 'elbise meselesi', 520, 960, 84, INK, W(id, 'elbise') - .1, W(id, 'meselesi') + .4, { rot: -.02, shadow: 'rgba(255,245,225,.7)' }); crossOut(ctx, 500, 900, 900, 980, seg(t, W(id, 'değil') - .1, W(id, 'değil') + .3));
  T(ctx, t, 'iş fikri!', 1250, 960, 120, RED, tI, W(id, 'fikri') + .4, { rot: -.03, shadow: 'rgba(255,245,225,.7)' });
  ctx.restore();
});

// ---------------- s35: patent başvurusu – Brassière – satış – şirket
sahneS('s35', (ctx, t) => {
  const id = 's35', b = SAH[id].bas, d = SAH[id].dur;
  const c1 = W(id, 'patentin') - .15, c2 = W(id, 'ama') - .15, c3 = W(id, 'sonunda') - .15;
  if (t < c1) {   // başvuru → onay
    plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 800], [2020, 800], [2020, 1100], [-100, 1100]], '#8d6a4c', '#6b4d36', { sw: 4, seed: 920, sx: 0, sy: -8 });
    const wr = P({ armL: [-96, -410], armR: [200, -560 + Math.sin(t * 8) * 14], headDY: 6, f: { look: [.8, .8], mouth: MOUTH.smile, lid: .15, browL: [-3, 0, .1], browR: [-3, 0, .1] } });
    const joy = P({ armL: [-190, -620], armR: [190, -620], headDY: -8, f: { lid: .6, mouth: MOUTH.grin, blush: .9 } });
    const S = actor('mary', [[b, wr], [W(id, 'onaylanıyor') - .2, wr], [W(id, 'onaylanıyor') + .2, joy, bk]], t, { x: 560, s: 1.3, bust: true }); S.y = 1480; drawMary(ctx, S);
    pinnedPaper(ctx, 1260, 560, 560, 420, .03, '#f8efd9'); for (let i = 0; i < 5; i++) line(ctx, [[1030, 440 + i * 56], [1490, 440 + i * 56 + (i % 2) * 3]], 3, '#cbbd96'); hand(ctx, 'Başvuru', 1260, 400, 70, INK, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
    const sw = t < W(id, 'kasım') - .1 ? 0 : sm(seg(t, W(id, 'kasım') - .1, W(id, 'kasım') + .4));
    calendarPage(ctx, 1640, 330, .9, sw < .5 ? 'ŞUBAT' : 'KASIM', sw < .5 ? '12' : '1914', sw < .5 ? 110 : 80); hand(ctx, '1914', 1640, 520, 44, INK, 1, { align: 'center' });
    T(ctx, t, '12 Şubat 1914', 1260, 860, 80, INK, b, W(id, '1914te') + .4, { align: 'center', rot: -.02 });
    if (t > W(id, 'onaylanıyor') - .1) T(ctx, t, 'ONAYLANDI!', 1260, 640, 110, '#5f6b4a', W(id, 'onaylanıyor') - .1, W(id, 'onaylanıyor') + .5, { align: 'center', rot: -.04 });
  } else if (t < c2) {   // gerçek patent çizimi + Brassière
    plainBG(ctx, '#d9c7a0', '#a67c52');
    const im = IMG.patent; const k = sm(seg(t, c1, c1 + .5));
    if (im) { const ph = 880, pw = ph * im.width / im.height; ctx.save(); ctx.translate(560, 540); ctx.rotate(-.03); ctx.fillStyle = 'rgba(40,25,20,.3)'; ctx.fillRect(-pw / 2 + 12, -ph / 2 + 14, pw, ph); ctx.globalAlpha = k; ctx.drawImage(im, -pw / 2, -ph / 2, pw, ph); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.strokeRect(-pw / 2, -ph / 2, pw, ph); ctx.restore(); }
    T(ctx, t, '"Brassière"', 1330, 420, 170, RED, W(id, 'brassière') - .1, W(id, 'brasiyer') + .5, { align: 'center', fam: 'Alegreya', it: true, wt: 800, rot: -.03 });
    T(ctx, t, 'tek kelime', 1330, 260, 100, INK, W(id, 'tek') - .1, W(id, 'kelime') + .4, { align: 'center', rot: -.02 });
    T(ctx, t, 'yani… sütyen', 1330, 560, 100, INK, W(id, 'yani') - .1, W(id, 'sütyen') + .5, { align: 'center', rot: -.02 });
    [['kısa', W(id, 'kısa'), 700], ['net', W(id, 'net'), 800], ['iddialı', W(id, 'iddialı'), 900]].forEach(([w, t0, y], i) => { T(ctx, t, w, 1330, y, 100, '#fff', t0 - .1, t0 + .4, { align: 'center', rot: -.02, shadow: 'rgba(30,18,10,.8)' }); pen(ctx, [[1330 - (i + 1) * 60, y + 14], [1330 + (i + 1) * 60, y + 14]], seg(t, t0 + .2, t0 + .6), 6, '#f6dc8a'); });
  } else if (t < c3) {   // almak başka, satmak başka
    plainBG(ctx, '#efe3c9', '#d9c7a0'); line(ctx, [[960, 120], [960, 1000]], 8, '#b9a985');
    pinnedPaper(ctx, 480, 560, 560, 420, -.03, '#f8efd9'); hand(ctx, 'Patent', 480, 520, 100, INK, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); hand(ctx, '✓', 480, 640, 120, '#5f6b4a', 1, { align: 'center' });
    T(ctx, t, 'almak', 480, 250, 120, INK, W(id, 'almak'), W(id, 'almak') + .5, { align: 'center', rot: -.03 });
    ctx.save(); ctx.translate(1440, 560); ell(ctx, 0, 0, 200, 200, '#e6d4a6', C.ink, 7); for (const ry of [.4, .75]) { ctx.beginPath(); ctx.ellipse(0, 0, 200, 200 * ry, 0, 0, TAU); ctx.lineWidth = 3; ctx.strokeStyle = '#a58f66'; ctx.stroke(); } line(ctx, [[0, -200], [0, 200]], 3, '#a58f66'); for (let i = 0; i < 3; i++) { const a = t * 1.5 + i * 2.1; coin(ctx, Math.cos(a) * 250, Math.sin(a) * 90 - 120, .7); } ctx.restore();
    T(ctx, t, 'dünyaya satmak', 1440, 250, 110, RED, W(id, 'bütün') - .1, W(id, 'satmak') + .5, { align: 'center', rot: .03 });
    T(ctx, t, 'başka', 960, 940, 120, INK, W(id, 'başka'), W(id, 'başka', 2) + .4, { align: 'center', rot: -.02 });
  } else {   // şirkete satış
    plainBG(ctx, '#d9c9a8', '#b9a07a');
    poly(ctx, [[1180, 930], [1800, 930], [1800, 220], [1180, 220]], '#8f877a', '#6f685d', { sw: 5, sx: -10, sy: -4 }); for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) rr(ctx, 1220 + c * 150, 270 + r * 100, 70, 60, hash(r * 3 + c) > .4 ? '#f3d98a' : '#3f352c');
    poly(ctx, [[1380, 930], [1580, 930], [1580, 780], [1380, 780]], '#4b3a2c', null, { sw: 4 }); line(ctx, [[1480, 780], [1480, 930]], 4, C.ink);
    poly(ctx, [[1190, 150], [1790, 150], [1790, 230], [1190, 230]], '#2f2430', '#1e1620', { sw: 4, sx: -5, sy: -3 }); hand(ctx, 'Warner Brothers', 1490, 208, 62, '#e8c870', seg(t, W(id, 'warner') - .2, W(id, 'brothersa') + .4), { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
    shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], '#8d7a62', '#6f5f4c', { sw: 0, seed: 921 });
    const walk = clamp(seg(t, c3, W(id, 'satıyorsun') + .3)), hold = P({ armL: [-96, -410], armR: [200, -560], f: { look: [1, 0], turn: .5, mouth: MOUTH.smile, browL: [-3, 0, .1], browR: [-3, 0, .1] } });
    const S = actor('mary', [[c3, hold], [d + b, hold]], t, { x: lerp(300, 880, sm(walk)), s: .85 }); S.armR.hold = (c) => { c.save(); c.translate(20, 20); c.rotate(-.5); poly(c, [[-26, -30], [26, -30], [26, 30], [-26, 30]], '#f8efd9', '#e2d5b4', { sw: 3 }); c.restore(); }; drawMary(ctx, S);
    T(ctx, t, 'büyük bir şirkete', 560, 200, 100, INK, W(id, 'büyük') - .1, W(id, 'şirkete') + .5, { align: 'center', rot: -.03 });
  }
});

// ---------------- s37d: bir korse şirketine – düşmana satıyorsun
sahneS('s37d', (ctx, t) => {
  const id = 's37d', b = SAH[id].bas, d = SAH[id].dur, tD = W(id, 'düşmana');
  ctx.fillStyle = '#6b5440'; ctx.fillRect(-100, -100, 2120, 1300); for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#725944' : '#634b39'; ctx.fillRect(i * 120 - 20, -100, 118, 1300); }
  // duvarda gerçek korse fotoğrafı (Met, CC0)
  if (IMG.met3) { const im = IMG.met3, ph = 360, pw = ph * im.width / im.height; ctx.save(); ctx.translate(1450, 330); ctx.rotate(.03); ctx.fillStyle = 'rgba(30,18,10,.4)'; ctx.fillRect(-pw / 2 - 20 + 8, -ph / 2 - 20 + 10, pw + 40, ph + 40); ctx.fillStyle = '#f6ecd4'; ctx.fillRect(-pw / 2 - 20, -ph / 2 - 20, pw + 40, ph + 40); ctx.drawImage(im, -pw / 2, -ph / 2, pw, ph); ctx.restore(); }
  hand(ctx, 'KORSE A.Ş.', 1450, 150, 70, '#e8c870', seg(t, W(id, 'korse') - .1, W(id, 'şirketine') + .4), { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
  const smirk = P({ armL: [-130, -470], armR: [130, -470], headRoll: -3, f: { look: [-1, 0], turn: -.5, mouth: MOUTH.grin, lid: .35, browL: [-3, .35, 0], browR: [-3, .35, 0] } });
  const rub = P({ armL: [-30, -500], armR: [30, -500], headRoll: -3, f: { look: [-1, 0], turn: -.5, mouth: MOUTH.grin, lid: .4, browL: [-3, .4, 0], browR: [-3, .4, 0] } });
  const E = actor('exec', [[b, smirk], [W(id, 'yani') - .1, smirk], [W(id, 'patenti'), rub, sm]], t, { x: 1300, s: 1.35, bust: true, off: 1 }); E.y = 1500; if (t > W(id, 'patenti')) E.armL.t[0] += Math.sin(t * 14) * 8; drawMary(ctx, E);
  const give = P({ armL: [-96, -410], armR: [230, -540], headDY: 6, f: { look: [1, .3], turn: .5, mouth: MOUTH.flat, sweat: .4, browL: [-6, -.2, .2], browR: [-6, -.2, .2] } });
  const oh = P({ armL: [-96, -410], armR: [230, -540], headDY: -4, f: { look: [1, 0], turn: .5, mouth: MOUTH.o, bulge: .6, sweat: .8, browL: [-12, -.3, .4], browR: [-12, -.3, .4] } });
  const M = actor('mary', [[b, give], [tD - .2, give], [tD + .1, oh, bk]], t, { x: 520, s: 1.35, bust: true, off: .3 }); M.y = 1500; drawMary(ctx, M);
  poly(ctx, [[-100, 840], [2020, 840], [2020, 1100], [-100, 1100]], '#8d6a4c', '#6b4d36', { sw: 4, sx: 0, sy: -8 });
  // evrak masada
  poly(ctx, [[820, 880], [1060, 880], [1040, 960], [800, 960]], '#f8efd9', '#e2d5b4', { sw: 3.4, sx: -4, sy: -3 }); line(ctx, [[840, 905], [1030, 905]], 2.6, '#cbbd96'); line(ctx, [[836, 928], [1010, 928]], 2.6, '#cbbd96');
  T(ctx, t, 'düşman!', 960, 230, 150, RED, tD - .1, tD + .5, { align: 'center', rot: -.03, shadow: 'rgba(255,245,225,.6)' });
  if (t > tD + .1) { ctx.save(); ctx.translate(1230, 590); for (const sd of [-1, 1]) poly(ctx, [[sd * 30, 0], [sd * 70, -70], [sd * 54, 6]], '#b4503a', '#8a3a2a', { sw: 3 }); ctx.restore(); }
});

// ---------------- s36: fiyatı 1.500 dolar – 30 yılda 15.000.000 dolar
sahneS('s36', (ctx, t) => {
  const id = 's36', b = SAH[id].bas, d = SAH[id].dur, tP = W(id, 'dolar'), tM = W(id, '15000000');
  plainBG(ctx, '#efe3c9', '#d9c7a0'); pinnedPaper(ctx, 960, 540, 1700, 900, -.01, '#f8efd9'); for (let i = 0; i < 9; i++) line(ctx, [[200, 200 + i * 90], [1720, 200 + i * 90 + (i % 2) * 3]], 2.4, '#eadfc3');
  T(ctx, t, 'Fiyatı mı?', 960, 220, 130, INK, W(id, 'fiyatı') - .1, W(id, 'mı') + .5, { align: 'center', fam: 'Alegreya', it: true, wt: 800, rot: -.01 });
  const n1 = Math.floor(clamp(seg(t, W(id, '1500') - .1, W(id, '1500') + .9)) * 1500);
  if (t > W(id, '1500') - .2) hand(ctx, `${(n1 / 1000 | 0) ? (n1 / 1000 | 0) + '.' : ''}${String(n1 % 1000).padStart((n1 / 1000 | 0) ? 3 : 1, '0')} $`, 560, 520, 170, '#5f6b4a', 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
  for (let i = 0; i < 6; i++) if (t > W(id, '1500') + i * .1) { const u = bk(seg(t, W(id, '1500') + i * .1, W(id, '1500') + i * .1 + .3)); coin(ctx, 400 + i * 60, 740 - u * 0 + (1 - u) * -80, 1.0 * u); }
  T(ctx, t, '30 yıl', 960, 760, 100, INK, W(id, '30') - .1, W(id, 'yılda') + .5, { align: 'center', rot: -.02 });
  const n2 = Math.floor(clamp(seg(t, tM - .1, tM + 2.4)) * 15000000);
  if (t > tM - .2) { const s = String(n2).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); hand(ctx, s + ' $', 1300, 520, 130, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); }
  for (let i = 0; i < 7; i++) if (t > tM + i * .25) { const u = bk(seg(t, tM + i * .25, tM + i * .25 + .4)); moneyBag(ctx, 1240 + (i % 4) * 130 + (Math.floor(i / 4)) * 65, 920 - Math.floor(i / 4) * 105, .75 * u, '$'); }
});

// ---------------- s37c: binde biri bile değil
sahneS('s37c', (ctx, t) => {
  const id = 's37c', b = SAH[id].bas, d = SAH[id].dur;
  plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 930 });
  // sol: Mary'nin küçük para yığını; sağ: dev yığın
  for (let i = 0; i < 3; i++) coin(ctx, 330 + i * 24, 900 - i * 6, .9);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7 - r; c++) if (t > b + .2 + (r * 7 + c) * .02) moneyBag(ctx, 1000 + c * 140 + r * 70, 930 - r * 120, .95, '$');
  const look = P({ armL: [-96, -410], armR: [96, -410], f: { look: [1, 0], turn: .5, mouth: MOUTH.o, bulge: .5, browL: [-10, -.2, .3], browR: [-10, -.2, .3] } });
  const S = actor('mary', [[b, look]], t, { x: 560, s: .85 }); drawMary(ctx, S);
  // büyüteç
  const tB = W(id, 'binde'); ctx.save(); ctx.translate(360, 840); ell(ctx, 0, 0, 80, 80, 'rgba(255,255,255,.4)', C.ink, 8); line(ctx, [[56, 56], [130, 130]], 16, C.ink); ctx.restore();
  T(ctx, t, '1/1000', 960, 200, 200, RED, tB - .1, W(id, 'bile') + .5, { align: 'center', fam: 'Alegreya', it: true, wt: 800, rot: -.03 });
  T(ctx, t, 'senin payın', 300, 1010, 80, INK, W(id, 'senin') - .1, W(id, 'para') + .4, { align: 'center', rot: -.02 }); T(ctx, t, 'onların kazancı', 1400, 1010, 80, INK, W(id, 'onların') - .1, W(id, 'kazandığının') + .4, { align: 'center', rot: .02 });
});

// ---------------- s37b: senin yerine biz sinirlendik
sahneS('s37b', (ctx, t) => {
  const id = 's37b', b = SAH[id].bas, d = SAH[id].dur, tS = W(id, 'sinirlendik');
  plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 940 });
  const sad = P({ armL: [-96, -410], armR: [96, -410], headDY: 6, f: { look: [0, .5], mouth: { w: 15, open: .3, smile: -.8, shape: '' }, browL: [-6, -.45, .2], browR: [-6, -.45, .2], lid: .3 } });
  const M = actor('mary', [[b, sad]], t, { x: 960, s: .9 }); M.face.tears = clamp(seg(t, b + .3, b + 1.2)); drawMary(ctx, M);
  // öfkeli izleyiciler
  const mad = (k) => P({ armL: [-130, -470], armR: [130, -470], headDY: 2, f: { look: [0, 0], mouth: { w: 18, open: .3, smile: -.8, teeth: 1, shape: '' }, browL: [3, .45, 0], browR: [3, .45, 0], blush: k, sweat: 0 } });
  [['lady2', 300, 1], ['wig1', 1620, -1], ['friendC', 560, 1], ['quiz', 1360, -1]].forEach(([lk, x, dir], i) => { const u = clamp(seg(t, tS - .3 + i * .1, tS + .5 + i * .1)); const S = actor(lk, [[b, P({ armL: [-130, -470], armR: [130, -470], f: { look: [dir, 0], mouth: MOUTH.flat, browL: [-3, .1, .1], browR: [-3, .1, .1] } })], [tS - .3, mad(.9), sm]], t, { x, s: .55, bust: true, off: i }); S.y = ZEMIN + 140; S.face.blush = .35 + .65 * u; S.shake = u * .8; drawMary(ctx, S);
    if (u > .3) for (let k = 0; k < 3; k++) { const q = ((t * 1.6 + k / 3 + i * .2) % 1); pen(ctx, [[x - 40 + k * 40, 640 - q * 140], [x - 30 + k * 40, 600 - q * 140]], 1, 5, '#c97a6a'); } });
  T(ctx, t, 'senin yerine biz sinirlendik!', 960, 200, 120, RED, W(id, 'senin') - .1, tS + .6, { align: 'center', rot: -.02 });
  T(ctx, t, 'hem de bayağı', 960, 330, 100, INK, W(id, 'hem') - .1, W(id, 'bayağı') + .4, { align: 'center', rot: -.01 });
});

// ---------------- s38: Caresse Crosby – Paris'te bohem hayat
sahneS('s38', (ctx, t) => {
  const id = 's38', b = SAH[id].bas, d = SAH[id].dur, tC = W(id, 'caresse'), tP = W(id, 'parise');
  if (t < tP - .1) {
    plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 950 });
    const sweet = P({ armL: [-96, -410], armR: [96, -410], f: { mouth: MOUTH.smile, look: [0, 0], blush: .5 } });
    const wave = P({ armL: [-96, -410], armR: [200, -620], headRoll: 4, f: { mouth: MOUTH.grin, lid: .2, blush: .7 } });
    const looks = t < tC + .2 ? 'mary' : 'caresse';
    const S = actor(looks, [[b, sweet], [tC, wave, bk]], t, { x: 560, s: .95 }); if (looks === 'caresse') S.stride = Math.sin(t * 8) * .4; drawMary(ctx, S);
    T(ctx, t, 'Ama üzülme.', 960, 190, 120, '#5f6b4a', b, W(id, 'üzülme') + .5, { align: 'center', rot: -.02 });
    T(ctx, t, 'Mary', 1230, 420, 150, INK, b + 1.0, b + 1.5, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); crossOut(ctx, 1080, 350, 1380, 430, seg(t, W(id, 'adını') - .1, W(id, 'adını') + .3));
    T(ctx, t, 'Caresse Crosby', 1330, 580, 130, RED, tC - .1, W(id, 'crosby') + .6, { align: 'center', fam: 'Alegreya', it: true, wt: 800, rot: -.02 });
  } else {   // Paris, bohem, renkli
    skyGrad(ctx, '#e6c9b0', '#f3dcc0', '#f8ecd6', 900); eiffel(ctx, 1560, 900, .9, 1, '#6a5a58');
    for (let i = 0; i < 10; i++) { const bx = i * 200 - 80, bh = 180 + hash(i * 2.3) * 120; poly(ctx, [[bx, 900], [bx + 180, 900], [bx + 180, 900 - bh], [bx, 900 - bh]], i % 2 ? '#e4d6b8' : '#d9caa8', '#bfae88', { sw: 3, sx: -6, sy: 0 }); }
    shape(ctx, [[-100, 900], [2020, 900], [2020, 1100], [-100, 1100]], '#8d7a62', '#6f5f4c', { sw: 0, seed: 951 });
    // renkli flamalar
    line(ctx, [[0, 120], [960, 200], [1920, 120]], 5, C.ink); for (let i = 0; i < 16; i++) { const x = 60 + i * 120, y = 120 + 80 * Math.sin(i / 15 * Math.PI) + (i / 15) * 0; const col = ['#b4503a', '#c8a043', '#8a9a5b', '#b9a7c4', '#d9a0a0', '#c97a5a'][i % 6]; poly(ctx, [[x - 24, y], [x + 24, y], [x, y + 60 + Math.sin(t * 3 + i) * 6]], col, null, { sw: 3 }); }
    // kafe masası
    ctx.save(); ctx.translate(1020, 930); ell(ctx, 0, -250, 180, 30, '#f4efe3', C.ink, 4); line(ctx, [[0, -230], [0, -20]], 14, C.ink); line(ctx, [[0, -230], [0, -20]], 8, '#8f897d'); ell(ctx, 0, -10, 80, 14, '#8f897d', C.ink, 3); ctx.restore();
    const dance = (ph) => P({ armL: [-190, -560 + Math.sin(t * 8 + ph) * 90], armR: [190, -560 - Math.sin(t * 8 + ph) * 90], headRoll: Math.sin(t * 4 + ph) * 5, f: { lid: .25, mouth: MOUTH.grin, blush: .8, look: [0, -.1] } });
    const C1 = actor('caresse', [[b, dance(0)]], t, { x: 620, s: .95 }); C1.stride = Math.sin(t * 8) * .8; drawMary(ctx, C1);
    const clap = (ph) => P({ armL: [-60 + Math.sin(t * 9 + ph) * 20, -520], armR: [60 - Math.sin(t * 9 + ph) * 20, -520], headRoll: Math.sin(t * 3 + ph) * 4, f: { mouth: MOUTH.grin, lid: .2, blush: .6, look: [-1, 0], turn: -.5 } });
    const C2 = actor('friendB', [[b, clap(1)]], t, { x: 1320, s: .85, off: 1 }); drawMary(ctx, C2);
    const C3 = actor('quiz', [[b, clap(2)]], t, { x: 1560, s: .85, off: 2 }); C3.face.turn = -.5; drawMary(ctx, C3);
    T(ctx, t, 'Paris', 140, 300, 150, INK, tP, tP + .6, { rot: -.03, fam: 'Alegreya', it: true, wt: 800 });
    T(ctx, t, 'bohem · renkli', 140, 440, 100, '#8a2f2c', W(id, 'bohem') - .1, W(id, 'renkli') + .5, { rot: -.03 });
    if (t > W(id, 'hikâye') - .1) { const u = bk(seg(t, W(id, 'hikâye') - .1, W(id, 'hikâye') + .4)); ctx.save(); ctx.translate(960, 760); ctx.scale(u, u); rrect(ctx, -240, -110, 480, 220, 36); ctx.fillStyle = '#2f2430'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke(); poly(ctx, [[-40, -60], [-40, 60], [64, 0]], '#e8c870', null, { sw: 4 }); ctx.restore(); T(ctx, t, 'başlı başına bir video!', 960, 1010, 90, INK, W(id, 'başlı') - .1, W(id, 'video') + .5, { align: 'center', rot: -.02 }); }
  }
});
