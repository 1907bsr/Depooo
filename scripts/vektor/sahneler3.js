'use strict';
// ===== Sahneler 3: s21–s27 + s18b (Lengberg, çöp, keten sütyen, karbon testi, eski sevgili korse) =====
function alpineBG(ctx, t) {
  skyGrad(ctx, '#cdbfcf', '#e8d3c4', '#f3e6d6', 760);
  ridge(ctx, 520, 170, .7, '#a89fb0', '#f4efe8'); ridge(ctx, 610, 120, 2.1, '#8c8a98', '#eee8e2'); ridge(ctx, 700, 80, 3.3, '#6f7a68', null);
  fogBand(ctx, t, 610, .3, 9);
  shape(ctx, [[-100, 1100], [-100, 790], [300, 730], [700, 640], [1000, 610], [1400, 650], [1800, 730], [2020, 790], [2020, 1100]], '#6f8a55', '#55703f', { sw: 3, seed: 420, sx: -10, sy: -6 });
}
function stoneWall(ctx, y0, y1, col = '#8f877a', colD = '#6f685d') {
  ctx.fillStyle = col; ctx.fillRect(-100, y0, 2120, y1 - y0);
  for (let r = 0, y = y0; y < y1; r++, y += 78) for (let x = -100 - (r % 2) * 110; x < 2020; x += 220) { ctx.strokeStyle = colD; ctx.lineWidth = 3; ctx.strokeRect(x, y, 220, 78); ctx.fillStyle = `rgba(60,50,40,${.05 + hash(x * .1 + r) * .1})`; ctx.fillRect(x + 2, y + 2, 216, 74); }
}
function trash(ctx, kind, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (kind === 'shoe') { shape(ctx, [[-60, 10], [-56, -20], [-20, -26], [10, -48], [40, -30], [62, 0], [60, 14]], '#7a5a3c', '#5a4028', { sw: 3.4, seed: 701 }); line(ctx, [[-56, 14], [60, 14]], 7, '#3b2a22'); line(ctx, [[-10, -22], [20, -16]], 3, '#3b2a22'); }
  else if (kind === 'rag') { shape(ctx, [[-52, 6], [-44, -22], [-10, -30], [24, -22], [50, -4], [30, 12], [-6, 8], [-30, 16]], '#d8c9a8', '#b9a985', { sw: 3.2, seed: 702 }); line(ctx, [[-30, -4], [20, -10]], 2.4, '#9a8a66'); }
  else if (kind === 'bone') { line(ctx, [[-44, 0], [44, 0]], 14, C.ink); line(ctx, [[-44, 0], [44, 0]], 9, '#f1ebdc'); for (const [bx, by] of [[-50, -8], [-50, 8], [50, -8], [50, 8]]) { ell(ctx, bx, by, 11, 11, '#f1ebdc', C.ink, 3); } }
  else if (kind === 'pot') { shape(ctx, [[-44, 0], [-30, -34], [10, -40], [44, -20], [30, 6]], '#b9683f', '#8f4c2c', { sw: 3.4, seed: 703 }); line(ctx, [[-30, -20], [20, -26]], 3, '#e8d9b0'); }
  else if (kind === 'core') { shape(ctx, [[-20, -26], [20, -26], [14, 0], [20, 26], [-20, 26], [-14, 0]], '#d8c9a8', '#b9a985', { sw: 3, seed: 704 }); line(ctx, [[0, -26], [0, -44]], 4, C.ink); }
  ctx.restore();
}
function gloveHand(ctx, x, y, rot, s, tool) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (tool) { line(ctx, [[0, 0], [0, -230], [-60, -250]], 16, C.ink); line(ctx, [[0, 0], [0, -230], [-60, -250]], 10, '#8f897d'); }
  shape(ctx, [[-44, 10], [-44, -40], [-20, -58], [20, -58], [44, -40], [44, 10], [30, 60], [-30, 60]], '#d9b66e', '#b8943f', { sw: 4, seed: 710, sx: -6, sy: -4 }); line(ctx, [[-30, -40], [30, -40]], 3, '#8f6a22'); line(ctx, [[-30, -22], [30, -22]], 3, '#8f6a22');
  ctx.restore();
}
function linenBra(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sd of [-1, 1]) { shape(ctx, [[sd * 62, -60], [sd * 74, -150], [sd * 96, -168], [sd * 112, -150], [sd * 118, -56], [sd * 100, -56], [sd * 92, -128], [sd * 80, -134], [sd * 78, -56]], '#e9dcc0', '#cdbf9f', { sw: 4, seed: 720 + sd, sx: -4, sy: -2 }); }
  shape(ctx, [[-170, -60], [-10, -60], [-6, 40], [-30, 100], [-90, 118], [-150, 96], [-176, 20]], '#efe3c8', '#d3c5a4', { sw: 4.4, seed: 730, sx: -10, sy: -6 });
  shape(ctx, [[10, -60], [170, -60], [176, 20], [150, 96], [90, 118], [30, 100], [6, 40]], '#efe3c8', '#d3c5a4', { sw: 4.4, seed: 731, sx: -10, sy: -6 });
  for (const sd of [-1, 1]) { ctx.save(); ctx.setLineDash([9, 8]); ctx.strokeStyle = '#a58f66'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.ellipse(sd * 90, 20, 56, 62, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sd * 20, -52); ctx.lineTo(sd * 160, -52); ctx.stroke(); ctx.restore(); }
  for (let i = -6; i <= 6; i++) { line(ctx, [[i * 24, -56], [i * 24 + 4, -30]], 2, '#cbbd96'); }
  ctx.restore();
}
function dressForm(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const d of [-1, 0, 1]) line(ctx, [[0, -30], [d * 70, 30], [d * 96, 52]], 12, C.ink), line(ctx, [[0, -30], [d * 70, 30], [d * 96, 52]], 7, C.woodD);
  line(ctx, [[0, -30], [0, -330]], 14, C.ink); line(ctx, [[0, -30], [0, -330]], 9, C.woodL);
  shape(ctx, [[-74, -520], [74, -520], [92, -450], [70, -380], [86, -330], [-86, -330], [-70, -380], [-92, -450]], '#d8c9a8', '#b9a985', { sw: 3.6, seed: 740, sx: -8, sy: -4 }); ell(ctx, 0, -548, 18, 24, '#b9a985', C.ink, 3);
  ctx.restore();
}
function hangerBra(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); line(ctx, [[0, -10], [0, 10], [-50, 40], [50, 40], [0, 10]], 4, '#d9d2c4'); ctx.scale(.28, .28); ctx.translate(0, 190); linenBra(ctx, 0, 0, 1, 0); ctx.restore(); }

// ---------------- s21: …2008'e kadar. Lengberg Şatosu
sahneS('s21', (ctx, t) => {
  const id = 's21', b = SAH[id].bas, d = SAH[id].dur;
  ctx.save(); const z = 1 + .04 * seg(t, b, b + d); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
  alpineBG(ctx, t); castle(ctx, 1320, 700, 1.05, t);
  for (let i = 0; i < 4; i++) { const bx = ((t * 70 + i * 520) % 2500) - 300, by = 180 + i * 70 + Math.sin(t * 2 + i) * 14, fl = Math.sin(t * 11 + i * 2) * 8; line(ctx, [[bx - 20, by + fl], [bx, by - 6], [bx + 20, by + fl]], 4, '#3b2a22'); }
  T(ctx, t, '…2008', 90, 260, 220, INK, b, b + .8, { fam: 'Alegreya', it: true, wt: 800 });
  T(ctx, t, 'yılına kadar', 120, 350, 100, INK, W(id, 'yılına') - .1, W(id, 'kadar') + .4, { rot: -.02 });
  const lab = (txt, x, y, key, col, sh) => { T(ctx, t, txt, x, y, 96, col, W(id, key) - .05, W(id, key) + .5, { rot: -.02, shadow: sh }); };
  lab('Avusturya', 90, 520, 'avusturya', '#4a3a4a'); lab('Doğu Tirol', 90, 630, 'doğu', '#4a3a4a'); lab('Lengberg Şatosu', 90, 780, 'lengberg', '#fff3cf', 'rgba(25,35,15,.85)');
  pen(ctx, curve([800, 750], [920, 650], [1100, 610], 18), seg(t, W(id, 'lengberg') + .4, W(id, 'lengberg') + .9), 6, '#fff3cf', { arrow: 18 });
  ctx.restore();
});

// ---------------- s22: tadilat – zemin kalkıyor, altından çöp
sahneS('s22', (ctx, t) => {
  const id = 's22', b = SAH[id].bas, d = SAH[id].dur;
  ctx.fillStyle = '#4a4036'; ctx.fillRect(-100, -100, 2120, 1300); stoneWall(ctx, -20, 640);
  // pencere ışığı
  shape(ctx, [[1380, 120], [1560, 120], [1560, 420], [1380, 420]], '#f3e6c8', '#e0cfa3', { sw: 5, seed: 750 }); line(ctx, [[1470, 120], [1470, 420]], 6, C.ink); line(ctx, [[1380, 270], [1560, 270]], 6, C.ink);
  glow(ctx, 1470, 300, 520, 'rgba(255,230,170,A)', .3);
  // kesit: zemin üstü, kalınlığı, boşluk
  ctx.fillStyle = '#2a1f16'; ctx.fillRect(-100, 760, 2120, 400);
  const tL = W(id, 'kaldırıyor'), tReveal = W(id, 'altından');
  // altındaki çöp
  const pop = k => spring(t, tReveal + k * .12, 2.4, .35);
  [['shoe', 420, 960, 1.9, -.1], ['rag', 760, 1000, 2.0, .1], ['bone', 1080, 1010, 1.8, .3], ['pot', 1380, 980, 1.9, .1], ['core', 620, 1040, 1.6, .5], ['rag', 1560, 1030, 1.6, -.3], ['bone', 900, 940, 1.5, -.4]].forEach(([k, x, y, s, r], i) => { const u = pop(i); if (u > 0) trash(ctx, k, x, y - (1 - clamp(u)) * 160, s * clamp(u), r); });
  // tahtalar
  const planks = 8, pw = 220, x0 = 80;
  for (let i = 0; i < planks; i++) {
    const lift = (i >= 3 && i <= 5) ? sm(seg(t, W(id, 'işçiler') + (i - 3) * .35, tL + .5 + (i - 3) * .25)) : 0;
    ctx.save(); ctx.translate(x0 + i * pw, 760); ctx.rotate(-lift * (.5 + (i - 3) * .08)); ctx.translate(0, -lift * 20);
    poly(ctx, [[0, 0], [pw - 6, 0], [pw - 6, -100], [0, -100]], i % 2 ? '#a07650' : '#94704f', '#76563b', { sw: 3.8, sx: -5, sy: -5 }); line(ctx, [[14, -50], [pw - 20, -54]], 2.6, '#6b4d36'); ell(ctx, 18, -50, 5, 5, '#4a3826', null); ell(ctx, pw - 26, -50, 5, 5, '#4a3826', null);
    ctx.restore();
  }
  // işçi elleri + levye
  const wob = Math.sin(t * 7) * .06 * (1 - seg(t, tL + .6, tL + 1));
  if (t < tL + 1.2) { gloveHand(ctx, 440, 900 - 60 * sm(seg(t, W(id, 'işçiler'), tL)), -.5 + wob, 1.5, true); gloveHand(ctx, 1160, 920 - 60 * sm(seg(t, W(id, 'işçiler') + .3, tL + .2)), .5 - wob, 1.5, true); }
  T(ctx, t, 'tadilat', 140, 250, 130, CREAM, W(id, 'tadilat') - .1, W(id, 'tadilat') + .6, { rot: -.03, shadow: 'rgba(20,12,6,.8)' });
  T(ctx, t, 'çöp?', 1500, 650, 170, '#f6dc8a', W(id, 'çöp'), W(id, 'çöp') + .5, { rot: -.04, shadow: 'rgba(20,12,6,.8)' });
});

// ---------------- s23: Orta Çağ çöpü – "Bunu sonra atarız."
sahneS('s23', (ctx, t) => {
  const id = 's23', b = SAH[id].bas, d = SAH[id].dur;
  ctx.fillStyle = '#4a4036'; ctx.fillRect(-100, -100, 2120, 1300); stoneWall(ctx, -20, 700);
  glow(ctx, 520, 240, 520, 'rgba(255,230,170,A)', .22);
  // zemin + boşluk
  poly(ctx, [[-100, 700], [900, 700], [900, 770], [-100, 770]], '#94704f', '#76563b', { sw: 3.4, sx: 0, sy: -5 }); poly(ctx, [[1260, 700], [2020, 700], [2020, 770], [1260, 770]], '#94704f', '#76563b', { sw: 3.4, sx: 0, sy: -5 });
  ctx.fillStyle = '#2a1f16'; ctx.fillRect(-100, 770, 2120, 400); ctx.fillStyle = '#1d150e'; ctx.fillRect(900, 700, 360, 70);
  // çöp yığını (her atışta büyür)
  const toss = [W(id, 'bunu') - 3.0, W(id, 'bunu') - 1.4, W(id, 'bunu') + .1, W(id, 'bunu') + 1.8].map((x, i) => Math.max(b + .6 + i * .3, x));
  const kinds = ['rag', 'bone', 'shoe', 'pot'];
  const base = [['shoe', 420, 960, 1.9, -.1], ['rag', 700, 1010, 2.0, .1], ['bone', 1560, 990, 1.8, .3], ['pot', 1750, 980, 1.9, .1], ['core', 1380, 1040, 1.6, .5], ['rag', 960, 1040, 1.6, -.3]];
  base.forEach(([k, x, y, s, r]) => trash(ctx, k, x, y, s, r));
  const items = [['rag', 1020, 980, 1.6, .2], ['bone', 1130, 1010, 1.5, -.2], ['shoe', 1060, 950, 1.5, .4], ['pot', 1170, 960, 1.5, .1]];
  toss.forEach((tt, i) => { const u = seg(t, tt + .35, tt + .95); if (u > 0) { const [k, x, y, s, r] = items[i]; trash(ctx, k, x, y, s, r + (1 - u) * 1.5); } });
  // havadaki atışlar
  toss.forEach((tt, i) => { const u = seg(t, tt, tt + .5); if (u > 0 && u < 1) { const sx = 700, sy = 450, ex = 1080, ey = 750; trash(ctx, kinds[i], lerp(sx, ex, u), lerp(sy, ey, u * u) - Math.sin(u * Math.PI) * 140, 1.2, u * 6); } });
  // orta çağ kadını
  const throwP = P({ armL: [-96, -410], armR: [190, -560], headRoll: 3, f: { mouth: MOUTH.smile, look: [1, .2], turn: .5, browL: [-3, 0, .1], browR: [-3, 0, .1] } });
  const shrug = P({ armL: [-200, -470], armR: [200, -470], headRoll: -4, f: { mouth: MOUTH.grin, lid: .35, look: [1, 0], turn: .5, browL: [-8, -.1, .3], browR: [-8, .1, .3], blush: .6 } });
  const seq = [[b, shrug]]; toss.forEach(tt => { seq.push([tt - .15, shrug], [tt + .1, throwP, bk], [tt + .4, shrug, sm]); });
  const S = actor('medieval', seq, t, { x: 560, y: -230, s: .72, off: .6 }); drawMary(ctx, S);
  // etiket: 500 yıllık
  const t5 = W(id, '500');
  if (t > t5 - .2) { const u = bk(seg(t, t5 - .2, t5 + .3)); ctx.save(); ctx.translate(1560, 820); ctx.rotate(-.06); ctx.scale(u * 1.3, u * 1.3); line(ctx, [[0, 0], [0, 90]], 6, C.ink); rrect(ctx, -170, -90, 340, 100, 8); ctx.fillStyle = '#f6ecd4'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); hand(ctx, '500 yıllık', 0, -22, 70, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore(); }
  const q = W(id, 'bunu');
  T(ctx, t, '"Bunu sonra atarız."', 1260, 200, 104, CREAM, q - .1, W(id, 'atarız') + .5, { align: 'center', rot: -.02, shadow: 'rgba(20,12,6,.85)' });
  T(ctx, t, 'Orta Çağ çöpü', 1260, 330, 110, '#f6dc8a', W(id, 'orta') - .1, W(id, 'çöpü') + .5, { align: 'center', rot: -.02, shadow: 'rgba(20,12,6,.85)' });
});

// ---------------- s24: 2.700 parça kumaş – arkeologlar – donup kalıyorlar
sahneS('s24', (ctx, t) => {
  const id = 's24', b = SAH[id].bas, d = SAH[id].dur, tF = W(id, 'donup');
  ctx.fillStyle = '#d8ccb4'; ctx.fillRect(-100, -100, 2120, 1300); for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#d1c4aa' : '#dcd0b8'; ctx.fillRect(i * 120 - 20, -100, 118, 1300); }
  glow(ctx, 960, 200, 700, 'rgba(255,240,200,A)', .3);
  const frozen = seg(t, tF, tF + .25);
  const pose = (k) => P({ armL: [-130, -470], armR: [130, -470], headDY: 4, f: { look: [k, .6], mouth: MOUTH.flat, browL: [-3, 0, .1], browR: [-3, 0, .1], lid: .1 } });
  const found = P({ armL: [-60, -560], armR: [60, -560], headDY: -6, f: { look: [0, .3], mouth: MOUTH.o, bulge: 1, browL: [-16, -.28, .45], browR: [-16, -.28, .45], sweat: .8 } });
  const A = actor('arch', [[b, pose(.8)], [W(id, 'tek') - .2, pose(.8)], [W(id, 'tek') + .3, pose(-.8), sm], [W(id, 'inceliyorlar') + .3, pose(.8), sm], [W(id, 'görünce') - .3, found, bk]], t, { x: 560, s: 1.4, bust: true, off: .3 });
  const B = actor('arch2', [[b, pose(-.8)], [W(id, 'tek') + .3, pose(.8), sm], [W(id, 'inceliyorlar') + .3, pose(-.8), sm], [W(id, 'görünce') - .3, found, bk]], t, { x: 1380, s: 1.4, bust: true, off: 1.1 });
  A.y = 1650; B.y = 1650;
  if (frozen > 0) { A.shake = 0; B.shake = 0; } else { A.headDY += Math.sin(t * 3) * 3; B.headDY += Math.cos(t * 3) * 3; }
  drawMary(ctx, A); drawMary(ctx, B);
  if (frozen > 0) { for (const hx of [560, 1380]) { ctx.save(); ctx.globalAlpha = .55 * frozen; glow(ctx, hx, 650, 260, 'rgba(240,244,248,A)', 1); ctx.restore(); } }
  // masa + kumaş parçaları
  shape(ctx, [[-100, 800], [2020, 800], [2020, 1100], [-100, 1100]], C.woodL, C.wood, { sw: 3.6, seed: 760, sx: 0, sy: -10 });
  for (let i = 0; i < 34; i++) { const x = 60 + (i * 137) % 1800, y = 840 + (i * 59) % 200, c = ['#d8c9a8', '#cbbc98', '#bfae88', '#e4d8bc'][i % 4]; ctx.save(); ctx.translate(x, y); ctx.rotate(hash(i) * 3); shape(ctx, [[-40, -14], [8, -26], [44, -6], [30, 20], [-14, 26], [-38, 10]], c, null, { sw: 2.4, seed: 770 + i }); ctx.restore(); }
  // sayaç
  const n = Math.floor(clamp(seg(t, W(id, '2700') - .1, W(id, 'çıkıyor') + .6)) * 2700);
  rrect(ctx, 660, 40, 600, 140, 14); ctx.fillStyle = '#f4ead2'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
  hand(ctx, (n / 1000 | 0) + '.' + String(n % 1000).padStart(3, '0') + ' parça', 960, 140, 90, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
  // büyüteç
  if (t < tF) { ctx.save(); ctx.translate(960 + Math.sin(t * 1.3) * 260, 760); ell(ctx, 0, 0, 60, 60, 'rgba(255,255,255,.35)', C.ink, 8); line(ctx, [[42, 42], [110, 110]], 16, C.ink); ctx.restore(); }
  // bulunan parça
  if (t > tF - .5) { const u = bk(seg(t, tF - .5, tF)); ctx.save(); ctx.translate(960, 640 - 40 * u); ctx.scale(u * 1.0, u * 1.0); linenBra(ctx, 0, 0, 1, t); ctx.restore(); }
  T(ctx, t, '…', 960, 420, 190, INK, tF + .2, tF + .8, { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
});

// ---------------- s25: keten sütyen + mağaza
sahneS('s25', (ctx, t) => {
  const id = 's25', b = SAH[id].bas, d = SAH[id].dur, cut = W(id, 'bugün') - .15;
  if (t < cut) {
    ctx.fillStyle = '#d8ccb4'; ctx.fillRect(-100, -100, 2120, 1300); glow(ctx, 960, 300, 800, 'rgba(255,240,200,A)', .3);
    shape(ctx, [[-100, 760], [2020, 760], [2020, 1100], [-100, 1100]], C.woodL, C.wood, { sw: 3.6, seed: 780, sx: 0, sy: -10 });
    const u = bk(seg(t, b + .2, b + .8)); ctx.save(); ctx.translate(960, 640); ctx.scale(u * 2.1, u * 2.1); linenBra(ctx, 0, 0, 1, t); ctx.restore();
    T(ctx, t, 'düpedüz bir sütyen!', 960, 130, 130, RED, W(id, 'düpedüz') - .1, W(id, 'sütyen') + .5, { align: 'center', rot: -.01 });
    T(ctx, t, 'keten', 330, 360, 110, INK, W(id, 'keten') - .1, W(id, 'keten') + .4, { rot: -.04 }); pen(ctx, curve([480, 380], [600, 440], [720, 520], 14), seg(t, W(id, 'keten') + .2, W(id, 'keten') + .6), 6, INK, { arrow: 16 });
    T(ctx, t, '2 kaplı', 120, 860, 110, INK, W(id, '2') - .1, W(id, 'kaplı') + .4, { rot: -.03 }); pen(ctx, curve([420, 830], [560, 760], [700, 720], 14), seg(t, W(id, 'kaplı') + .1, W(id, 'kaplı') + .5), 6, INK, { arrow: 16 });
    T(ctx, t, 'askılı', 1500, 330, 110, INK, W(id, 'askılı') - .1, W(id, 'askılı') + .4, { rot: .04 }); pen(ctx, curve([1560, 360], [1400, 400], [1230, 460], 14), seg(t, W(id, 'askılı') + .2, W(id, 'askılı') + .6), 6, INK, { arrow: 16 });
  } else {
    ctx.fillStyle = '#e9dcc0'; ctx.fillRect(-100, -100, 2120, 1300); for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#e4d6b8' : '#eee2c8'; ctx.fillRect(i * 120 - 20, -100, 118, 1300); }
    shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 790 });
    dressForm(ctx, 1450, 930, 1.1); ctx.save(); ctx.translate(1450, 372); ctx.scale(.42, .42); linenBra(ctx, 0, 70, 1, t); ctx.restore();
    // İNDİRİM tabelası
    const sw = Math.sin(t * 2) * .04; ctx.save(); ctx.translate(1450, 130); ctx.rotate(sw); line(ctx, [[-90, -40], [-90, 0]], 4, C.ink); line(ctx, [[90, -40], [90, 0]], 4, C.ink); rrect(ctx, -170, 0, 340, 120, 8); ctx.fillStyle = '#f6ecd4'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); hand(ctx, 'İNDİRİM!', 0, 88, 84, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore();
    const think = P({ armL: [-96, -410], armR: [40, -520], headRoll: -5, f: { look: [.8, -.3], mouth: MOUTH.flat, browL: [-6, -.1, .3], browR: [-10, -.3, .4], lid: .1 } });
    const grab = P({ armL: [-96, -410], armR: [230, -560], headRoll: 3, f: { look: [1, 0], mouth: MOUTH.grin, browL: [-8, -.1, .3], browR: [-8, -.1, .3], blush: .7, lid: .15 } });
    const giggle = P({ armL: [-96, -410], armR: [180, -520], headRoll: 4, headDY: -6, f: { lid: .8, mouth: MOUTH.grin, blush: .9, browL: [-6, -.1, .3], browR: [-6, -.1, .3] } });
    const S = actor('friendB', [[cut, think], [W(id, 'indirimdeyse') - .2, think], [W(id, 'indirimdeyse') + .2, grab, bk], [W(id, 'kaparsın') + .2, giggle, bk]], t, { x: 1000, s: .85 });
    if (t > W(id, 'kaparsın') + .2) S.headDY += Math.sin(t * 15) * 4;
    drawMary(ctx, S);
    T(ctx, t, '"Biraz retro ama', 90, 200, 84, INK, W(id, 'biraz') - .1, W(id, 'ama') + .3, { rot: -.02 }); T(ctx, t, 'fena değil."', 150, 290, 84, INK, W(id, 'fena') - .1, W(id, 'dersin') + .3, { rot: -.02 });
  }
});

// ---------------- s26: karbon testi → 15. yüzyıl
sahneS('s26', (ctx, t) => {
  const id = 's26', b = SAH[id].bas, tl = t - b;
  plainBG(ctx, '#f3e8d0', '#dfcba4');
  // deney şişesi
  ctx.save(); ctx.translate(300, 560); shape(ctx, [[-30, -150], [30, -150], [30, -60], [110, 90], [-110, 90], [-30, -60]], '#f6efdc', '#d9d0b8', { sw: 4, seed: 800, sx: -6, sy: -4 }); ctx.save(); ctx.beginPath(); ctx.moveTo(-70, 20); ctx.lineTo(70, 20); ctx.lineTo(110, 90); ctx.lineTo(-110, 90); ctx.closePath(); ctx.clip(); ctx.fillStyle = '#a67c52'; ctx.fillRect(-120, 20 + Math.sin(t * 3) * 3, 240, 90); ctx.restore();
  for (let i = 0; i < 4; i++) { const u = ((t * .8 + i / 4) % 1); ell(ctx, -30 + i * 20 + Math.sin(u * 6 + i) * 8, 70 - u * 150, 7 + i, 7 + i, 'rgba(255,255,255,.6)', C.ink, 2); } ctx.restore();
  T(ctx, t, 'karbon testi', 120, 300, 100, INK, b, b + .8, { rot: -.03 });
  const x0 = 620, x1 = 1640, y = 600, k = sm(seg(tl, .9, 2.3));
  line(ctx, [[x0, y], [x1, y]], 8, '#b9a985'); line(ctx, [[x0, y], [lerp(x0, x1, k), y]], 12, '#e06a50');
  const a = bk(seg(tl, .5, 1.0)), c = bk(seg(tl, 2.2, 2.8));
  ctx.save(); ctx.translate(x0, y); ctx.scale(a, a); ell(ctx, 0, 0, 30, 30, '#8a2f2c', C.ink, 6); hand(ctx, '15. yüzyıl', 0, -70, 80, INK, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); hand(ctx, 'Lengberg Şatosu', 0, 120, 52, '#7a5c3e', 1, { align: 'center' }); ctx.restore();
  ctx.save(); ctx.translate(x1, y); ctx.scale(c, c); ell(ctx, 0, 0, 30, 30, '#c8a043', C.ink, 6); hand(ctx, '1914', 0, -70, 80, INK, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); hand(ctx, "Mary'nin patenti", 0, 120, 52, '#7a5c3e', 1, { align: 'center' }); ctx.restore();
  const st = bk(seg(tl, 2.6, 3.1)); if (st > 0) { ctx.save(); ctx.translate(1130, 360); ctx.rotate(-.07); ctx.scale(st * 1.3, st * 1.3); hand(ctx, '500 YIL!', 0, 0, 140, '#e06a50', 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore(); }
});

// ---------------- s27: tarih kitapları racon keserken Orta Çağ'da bir kadın…
sahneS('s27', (ctx, t) => {
  const id = 's27', b = SAH[id].bas, d = SAH[id].dur;
  plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 810 });
  // racon kesen kitap
  ctx.save(); ctx.translate(380, 700); const bob = Math.sin(t * 2) * 4; ctx.translate(0, bob);
  poly(ctx, [[150, -370], [190, -356], [190, 244], [150, 230]], '#efe3c9', '#d3c5a4', { sw: 4, sx: -3, sy: 0 }); for (let i = 0; i < 6; i++) line(ctx, [[158, -330 + i * 95], [184, -322 + i * 95]], 2, '#bfae88'); poly(ctx, [[-150, -380], [150, -380], [150, 230], [-150, 230]], '#6f3f2a', '#4d2a1c', { sw: 5, sx: -10, sy: -6 }); line(ctx, [[-120, -380], [-120, 230]], 6, '#5a3320');
  hand(ctx, 'TARİH', 0, -270, 92, '#e8d9b0', 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); line(ctx, [[-96, -240], [96, -240]], 5, '#c8a043');
  for (const sd of [-1, 1]) { shape(ctx, [[sd * 20, -70], [sd * 96, -70], [sd * 96, -26], [sd * 60, -14], [sd * 20, -26]], '#2a1f16', null, { sw: 4, seed: 811 + sd }); } line(ctx, [[-20, -50], [20, -50]], 5, C.ink);
  line(ctx, [[-150, 60], [-60, 40], [60, 40], [150, 60]], 14, '#7d4a33'); line(ctx, [[-150, 60], [-60, 40], [60, 40], [150, 60]], 8, '#8d5a40'); line(ctx, [[-30, 130], [30, 130]], 8, C.ink);
  ctx.restore();
  const sy = W(id, 'sütyen'); T(ctx, t, '"Sütyen 1900\'lerde', 110, 190, 84, INK, sy - .1, W(id, 'icat') + .4, { rot: -.02 }); T(ctx, t, 'icat edildi."', 170, 280, 84, INK, W(id, 'icat'), W(id, 'edildi') + .4, { rot: -.02 });
  // orta çağ kadını (sağda, küçük) ve dört adım
  const S = actor('medieval', [[b, P({ armL: [-96, -410], armR: [96, -410], f: { mouth: MOUTH.smile, look: [-1, 0], turn: -.4 } })], [W(id, 'kadın'), P({ armL: [-120, -470], armR: [120, -470], headRoll: 3, f: { mouth: MOUTH.grin, lid: .3, look: [-1, 0], turn: -.4, blush: .6 } }), sm]], t, { x: 1000, s: .8, off: .5 }); drawMary(ctx, S);
  const steps = [['giymiş', W(id, 'giymiş'), 1450, 290], ['yıkamış', W(id, 'yıkamış'), 1740, 290], ['eskitmiş', W(id, 'eskitmiş'), 1450, 640], ['çöpe atmış', W(id, 'çöpe'), 1740, 640]];
  steps.forEach(([nm, t0, x, y], i) => {
    const u = bk(seg(t, t0 - .05, t0 + .35)); if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); pinnedPaper(ctx, 0, 0, 270, 270, (i - 1.5) * .03, '#f8efd9');
    if (i === 0) { ctx.save(); ctx.scale(.42, .42); ctx.translate(0, 40); linenBra(ctx, 0, 0, 1, t); ctx.restore(); }
    if (i === 1) { ctx.save(); ctx.translate(0, 20); ctx.scale(.3, .3); linenBra(ctx, 0, 0, 1, t); ctx.restore(); for (let k = 0; k < 6; k++) { const q = ((t * .9 + k / 6) % 1); ell(ctx, -60 + k * 24, 70 - q * 140, 10 + k % 3 * 4, 10 + k % 3 * 4, 'rgba(255,255,255,.75)', C.ink, 2.4); } }
    if (i === 2) { ctx.save(); ctx.translate(0, 20); ctx.scale(.3, .3); ctx.globalAlpha = .75; linenBra(ctx, 0, 0, 1, t); ctx.globalAlpha = 1; for (const [hx, hy] of [[-50, -20], [30, 10], [-10, 40], [60, -30]]) ell(ctx, hx, hy, 12, 10, '#efe3c9', C.ink, 3); ctx.restore(); }
    if (i === 3) { trash(ctx, 'rag', 0, 50, 1.5, .1); line(ctx, [[-60, 70], [-50, 100], [50, 100], [60, 70]], 6, C.ink); }
    hand(ctx, nm, 0, 118, 56, INK, 1, { align: 'center' }); ctx.restore();
  });
});

// ---------------- s18b: korse geri döndü – kötü bir eski sevgili gibi
sahneS('s18b', (ctx, t) => {
  const id = 's18b', b = SAH[id].bas, d = SAH[id].dur, tK = W(id, 'korse'), tD = W(id, 'hem') - .1;
  if (t < tD) {   // moda tarihi: tek cümle
    plainBG(ctx, '#efe3c9', '#d9c7a0'); pinnedPaper(ctx, 960, 520, 1300, 700, -.01, '#f8efd9');
    hand(ctx, 'Moda tarihi', 960, 260, 110, '#7a5c3e', seg(t, W(id, 'moda') - .1, W(id, 'tarihi') + .4), { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
    for (let i = 0; i < 4; i++) line(ctx, [[330, 340 + i * 70], [1590, 340 + i * 70 + (i % 2) * 4]], 3, '#e0d3b4');
    T(ctx, t, 'Korse geri döndü.', 960, 620, 150, RED, tK - .1, W(id, 'döndü') + .6, { align: 'center', rot: -.01 });
    if (t > W(id, 'peki')) T(ctx, t, 'neden unutuldu?', 960, 880, 96, INK, W(id, 'neden') - .1, W(id, 'unutuldu') + .4, { align: 'center', rot: -.02 });
  } else {   // kapıdaki eski sevgili
    ctx.fillStyle = '#6b5440'; ctx.fillRect(-100, -100, 2120, 1300); for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#725944' : '#634b39'; ctx.fillRect(i * 120 - 20, -100, 118, 1300); }
    shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.woodD, C.wood, { sw: 0, seed: 820 });
    // kapı boşluğu (dışarısı: gece)
    const dx = 1080, dw = 520, dy = 140, dh = 790;
    ctx.fillStyle = '#2f2430'; ctx.fillRect(dx, dy, dw, dh); glow(ctx, dx + dw / 2, dy + 200, 600, 'rgba(255,214,140,A)', .25);
    for (let i = 0; i < 20; i++) ell(ctx, dx + 30 + hash(i) * (dw - 60), dy + 30 + hash(i + 9) * 300, 3, 3, '#f6dc8a', null);
    const open = sm(seg(t, W(id, 'hem') - .1, W(id, 'hem') + .5));
    // eski sevgili korse (kapıda)
    const c = clamp(seg(t, W(id, 'hem') + .1, W(id, 'hem') + .6)), shy = Math.sin(t * 5) * 6;
    if (c > 0) { ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, dw, dh); ctx.clip(); ctx.translate(dx + dw * .64, dy + dh - 130 + shy); ctx.scale(1.25, 1.25);
      shape(ctx, [[-84, -250], [-46, -264], [0, -242], [46, -264], [84, -250], [92, -190], [70, -130], [96, -60], [88, -20], [0, -10], [-88, -20], [-96, -60], [-70, -130], [-92, -190]], C.corset, C.corsetD, { sw: 4, seed: 830, sx: -8, sy: -5 });
      for (const xk of [-62, -44, -26, 26, 44, 62]) line(ctx, [[xk, -240], [xk * .8, -30]], 4, C.bone); for (let y = -236; y < -30; y += 20) { line(ctx, [[-12, y], [12, y + 20]], 4, C.lacing); line(ctx, [[12, y], [-12, y + 20]], 4, C.lacing); }
      ell(ctx, -26, -180, 10, 12, C.white, C.ink, 3); ell(ctx, 26, -180, 10, 12, C.white, C.ink, 3); ell(ctx, -26 + (t > tD + 1 ? 2 : 0), -176, 5, 5, C.ink, null); ell(ctx, 26 + (t > tD + 1 ? 2 : 0), -176, 5, 5, C.ink, null); line(ctx, [[-16, -150], [0, -140], [16, -150]], 4, C.ink);
      // buket
      line(ctx, [[96, -90], [60, -120]], 8, C.ink); line(ctx, [[96, -90], [60, -120]], 4, '#8a9a5b');
      for (const [bx, by, col] of [[44, -150, '#b4503a'], [70, -164, '#c97a5a'], [92, -146, '#b4503a'], [60, -130, '#d9a0a0']]) { ell(ctx, bx, by + 20 * (1 - clamp(seg(t, tD + .5, tD + 2))) * -1 + 8, 15, 15, col, C.ink, 2.6); }
      ctx.restore(); }
    // kapı kanadı
    ctx.save(); ctx.translate(dx, dy); const ang = open * 1.32; ctx.transform(Math.cos(ang), 0, 0, 1, 0, 0); poly(ctx, [[0, 0], [dw, 0], [dw, dh], [0, dh]], '#8d6a4c', '#6b4d36', { sw: 5, sx: -8, sy: 0 }); poly(ctx, [[50, 60], [dw - 50, 60], [dw - 50, 360], [50, 360]], '#7a5a3f', null, { sw: 3 }); poly(ctx, [[50, 420], [dw - 50, 420], [dw - 50, 730], [50, 730]], '#7a5a3f', null, { sw: 3 }); ell(ctx, dw - 60, dh / 2, 16, 16, '#c8a043', C.ink, 3); ctx.restore();
    // kadın (içeride)
    const eye = P({ armL: [-96, -410], armR: [96, -410], f: { turn: .7, look: [1, 0], lid: .1, mouth: MOUTH.flat, browL: [-3, 0, .1], browR: [-3, 0, .1] } });
    const roll = (k) => P({ armL: [-96, -410], armR: [96, -410], f: { turn: .7, lid: .2, rollAmt: 1, roll: k, look: [1, 0], mouth: MOUTH.flat, browL: [-2, .08, .05], browR: [-10, -.18, .35], blush: .1 } });
    const sigh = P({ armL: [-96, -410], armR: [96, -410], headDY: 8, chest: -1, f: { turn: .7, lid: .5, look: [1, .4], mouth: { w: 14, open: .4, smile: -.3, shape: 'o' }, browL: [3, .2, 0], browR: [3, .2, 0] } });
    const S = actor('lady4', [[b, eye], [W(id, 'eski') - .2, eye], [W(id, 'sevgili') - .2, roll(0), sm], [W(id, 'gibi') + .3, roll(1), eio], [W(id, 'hiç') + .2, sigh, sm]], t, { x: 620, s: .85, off: .8 }); drawMary(ctx, S);
    T(ctx, t, 'eski sevgili', 400, 200, 110, CREAM, W(id, 'eski') - .1, W(id, 'sevgili') + .5, { rot: -.03, shadow: 'rgba(20,12,6,.85)' });
    T(ctx, t, 'hiç çağrılmadan…', 1300, 1030, 84, CREAM, W(id, 'hiç') - .1, W(id, 'çağrılmadan') + .5, { align: 'center', rot: -.02, shadow: 'rgba(20,12,6,.85)' });
  }
});
