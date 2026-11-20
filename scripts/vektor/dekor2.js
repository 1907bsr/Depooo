'use strict';
// ===== Ek dekorlar ve proplar (dış mekân, şato, Yunan/Roma, perde, defter, ampul, bant...) =====
const cloudBlob = (ctx, x, y, s, col, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; for (const [dx, dy, r] of [[-60, 0, 40], [-10, -18, 52], [50, -4, 44], [100, 8, 30]]) { ctx.beginPath(); ctx.ellipse(x + dx * s, y + dy * s, r * s * 1.4, r * s * .6, 0, 0, TAU); ctx.fill(); } ctx.restore(); };
function skyGrad(ctx, top, mid, bot, h = 1080, y0 = 0) { const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, top); g.addColorStop(.55, mid); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(-100, y0, 2120, h); }
function ridge(ctx, base, amp, seed, col, snow, x0 = -100, x1 = 2020) {
  const pts = [[x0, 1100]]; for (let x = x0; x <= x1; x += 90) pts.push([x, base - amp * (.5 + .5 * Math.sin(x * .004 + seed) * Math.cos(x * .0023 + seed * 1.7)) - hash(x * .01 + seed) * amp * .35]); pts.push([x1, 1100]);
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  if (snow) { ctx.save(); ctx.clip(); ctx.fillStyle = snow; for (let i = 1; i < pts.length - 1; i++) if (pts[i][1] < base - amp * .8) { ctx.beginPath(); ctx.moveTo(pts[i][0] - 50, pts[i][1] + 60); ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i][0] + 50, pts[i][1] + 60); ctx.lineTo(pts[i][0] + 18, pts[i][1] + 38); ctx.lineTo(pts[i][0] - 14, pts[i][1] + 52); ctx.closePath(); ctx.fill(); } ctx.restore(); }
}
function castle(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const stone = '#8f877a', stoneD = '#6f685d', roof = '#7d4a3a', roofD = '#5c3328';
  const tower = (cx, w, h, rh) => { poly(ctx, [[cx - w / 2, 0], [cx + w / 2, 0], [cx + w / 2, -h], [cx - w / 2, -h]], stone, stoneD, { sw: 3.2, sx: -8, sy: -4 }); for (let i = -1; i <= 1; i += 1) rr(ctx, cx + i * w * .3 - 8, -h + 40, 16, 34, '#3f352c'); poly(ctx, [[cx - w / 2 - 14, -h], [cx + w / 2 + 14, -h], [cx, -h - rh]], roof, roofD, { sw: 3.2, sx: -8, sy: -4 }); };
  poly(ctx, [[-250, 0], [250, 0], [250, -150], [-250, -150]], stone, stoneD, { sw: 3.4, sx: -12, sy: -6 });
  for (let i = -6; i <= 6; i++) { ctx.fillStyle = stone; ctx.fillRect(i * 38 - 12, -172, 24, 24); ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.strokeRect(i * 38 - 12, -172, 24, 24); }
  tower(-230, 110, 270, 100); tower(230, 110, 240, 92); tower(0, 130, 330, 120);
  rr(ctx, -20, -110, 40, 110, '#4b3a2c'); for (const [wx, wy] of [[-150, -100], [150, -100], [0, -250], [-230, -200], [230, -170]]) rr(ctx, wx - 9, wy - 18, 18, 36, '#3f352c');
  // sancak
  line(ctx, [[0, -450], [0, -520]], 5, C.ink); const fw = Math.sin(t * 3) * 8; poly(ctx, [[0, -520], [54, -510 + fw], [40, -496 + fw], [54, -482 + fw], [0, -486]], C.burg, C.burgD, { sw: 2.6 });
  ctx.restore();
}
function rr(ctx, x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); }
function fogBand(ctx, t, y, a, sp) { ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 4; i++) { const x = ((i * 600 + t * sp) % 2600) - 300; ctx.fillStyle = '#efe7da'; ctx.beginPath(); ctx.ellipse(x, y + Math.sin(i * 2 + t * .3) * 14, 380, 46, 0, 0, TAU); ctx.fill(); } ctx.restore(); }
function curtainBG(ctx, t, spot) {
  ctx.fillStyle = '#3a2326'; ctx.fillRect(-100, -100, 2120, 1300);
  for (let i = 0; i < 12; i++) { const x = i * 170 - 40; const g = ctx.createLinearGradient(x, 0, x + 170, 0); g.addColorStop(0, C.burgD); g.addColorStop(.5, i % 2 ? C.burg : '#8e4a4c'); g.addColorStop(1, C.burgD); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, -20); ctx.quadraticCurveTo(x + 85, 20, x + 170, -20); ctx.lineTo(x + 170, 1100); ctx.lineTo(x, 1100); ctx.fill(); }
  const g2 = ctx.createRadialGradient(960, 480, 100, 960, 480, 900); g2.addColorStop(0, 'rgba(255,220,150,.28)'); g2.addColorStop(1, 'rgba(20,8,8,.55)'); ctx.fillStyle = g2; ctx.fillRect(-100, -100, 2120, 1300);
  shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.woodD, C.wood, { sw: 0, seed: 330 });
}
function column(ctx, x, top, bot, w, col, colD) {
  shape(ctx, [[x - w / 2, top + 40], [x + w / 2, top + 40], [x + w / 2 - 6, bot - 30], [x - w / 2 + 6, bot - 30]], col, colD, { sw: 3.2, seed: 340 + x, sx: -10, sy: 0 });
  for (let i = -2; i <= 2; i++) line(ctx, [[x + i * w * .17, top + 50], [x + i * w * .17, bot - 36]], 2.4, colD);
  shape(ctx, [[x - w * .68, top + 40], [x + w * .68, top + 40], [x + w * .6, top], [x - w * .6, top]], col, colD, { sw: 3.2, seed: 350 + x, sx: -6, sy: -3 });
  shape(ctx, [[x - w * .66, bot - 30], [x + w * .66, bot - 30], [x + w * .72, bot], [x - w * .72, bot]], col, colD, { sw: 3.2, seed: 360 + x, sx: -6, sy: -3 });
}
function oliveTree(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const sw = Math.sin(t * .8 + x) * 3;
  shape(ctx, [[-22, 0], [22, 0], [14, -140], [30, -230], [-6, -190], [-30, -250], [-14, -130]], '#6c5238', '#4a3826', { sw: 3, seed: 370 + x, sx: -6, sy: 0 });
  for (const [dx, dy, r] of [[-90, -250, 80], [0, -300, 100], [96, -250, 80], [-40, -210, 70], [50, -200, 66]]) { ell(ctx, dx + sw, dy, r, r * .78, '#7f8c5a', C.ink, 3); ell(ctx, dx + sw - 14, dy - 10, r * .6, r * .45, '#9aa673', null); }
  ctx.restore();
}
function greekSet(ctx, t) {
  skyGrad(ctx, '#f1dcb4', '#f6e6c4', '#faf0d8', 700);
  ridge(ctx, 640, 90, 1.3, '#cdbd92', null); ridge(ctx, 700, 70, 2.9, '#b9a97c', null);
  cloudBlob(ctx, 420 + Math.sin(t * .1) * 30, 150, 1.2, '#fff', .55); cloudBlob(ctx, 1500, 110, 1, '#fff', .5);
  // alçak duvar + küçük sütunlar
  shape(ctx, [[-100, 700], [2020, 700], [2020, 790], [-100, 790]], '#e6d9bd', '#c9bb9a', { sw: 3, seed: 380, sx: 0, sy: -6 });
  for (let i = 0; i < 16; i++) shape(ctx, [[i * 130 - 70, 706], [i * 130 - 48, 706], [i * 130 - 52, 786], [i * 130 - 66, 786]], '#f1e6cd', '#d3c6a6', { sw: 2, seed: 381 + i, sx: -3, sy: 0 });
  oliveTree(ctx, 230, 760, 1.0, t); oliveTree(ctx, 1700, 770, .9, t);
  // taş zemin
  const g = ctx.createLinearGradient(0, 790, 0, 1080); g.addColorStop(0, '#d8c9a8'); g.addColorStop(1, '#bfae88'); ctx.fillStyle = g; ctx.fillRect(-100, 790, 2120, 300);
  ctx.strokeStyle = 'rgba(90,70,40,.35)'; ctx.lineWidth = 2; for (let i = 0; i < 7; i++) { const y = 800 + Math.pow(i + 1, 1.6) * 9; ctx.beginPath(); ctx.moveTo(-100, y); ctx.lineTo(2020, y); ctx.stroke(); }
  column(ctx, 170, 0, 930, 150, '#efe5cf', '#cdbf9f'); column(ctx, 1760, 0, 930, 150, '#efe5cf', '#cdbf9f');
}
function romanSet(ctx, t) {
  ctx.fillStyle = '#9b4a3a'; ctx.fillRect(-100, -100, 2120, 1100);
  ctx.fillStyle = '#7f3a2e'; ctx.fillRect(-100, 600, 2120, 330); ctx.fillStyle = '#c8a043'; ctx.fillRect(-100, 590, 2120, 12); ctx.fillRect(-100, 230, 2120, 8);
  for (const x of [330, 760, 1190, 1620]) { ctx.fillStyle = '#6c2e24'; ctx.fillRect(x - 130, 260, 260, 300); ctx.lineWidth = 6; ctx.strokeStyle = '#c8a043'; ctx.strokeRect(x - 130, 260, 260, 300); ell(ctx, x, 410, 70, 70, '#e8d9b0', '#c8a043', 6); ell(ctx, x, 410, 44, 44, '#9b4a3a', null); ell(ctx, x, 410, 18, 18, '#e8d9b0', null); }
  const f = ctx.createLinearGradient(0, 930, 0, 1080); f.addColorStop(0, '#d8c9a8'); f.addColorStop(1, '#b39f78'); ctx.fillStyle = f; ctx.fillRect(-100, 930, 2120, 200);
  for (let i = 0; i < 40; i++) { ctx.fillStyle = i % 2 ? '#8f4c2c' : '#e8d9b0'; ctx.fillRect(i * 60 - 20, 940 + (i % 3) * 30, 36, 20); }
  column(ctx, 120, 0, 930, 130, '#c98a5a', '#a86a40'); column(ctx, 1800, 0, 930, 130, '#c98a5a', '#a86a40');
}
function drawBand(ctx, pts, w, p, col = '#f4ecd8', colD = '#d6c8aa') {
  const L = polyLen(pts), n = Math.max(2, Math.floor(L / 10 * clamp(p)));
  if (p <= 0) return;
  // incelen/kıvrılan bant: kalın çizgi + iç çizgi
  const seg_ = []; let rem = L * clamp(p);
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { if (cum[i] <= rem) out.push(pts[i]); else { const k = (rem - cum[i - 1]) / (cum[i] - cum[i - 1]); out.push([lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]); break; } }
  if (out.length < 2) return;
  line(ctx, out, w + 6, C.ink); line(ctx, out, w, col); line(ctx, out, w * .22, colD);
}
function drawBulb(ctx, x, y, s, on, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape(ctx, [[-30, 0], [30, 0], [26, 22], [-26, 22]], '#8f8a80', '#6f6a60', { sw: 3, seed: 400 }); line(ctx, [[-26, 10], [26, 10]], 3, C.ink); line(ctx, [[-20, 18], [20, 18]], 3, C.ink);
  ell(ctx, 0, -62, 62, 66, on ? '#f6dc8a' : '#efe6d0', C.ink, 4);
  if (on) { ell(ctx, 0, -62, 44, 48, '#fbeeb8', null); line(ctx, [[-14, -4], [-18, -44], [-6, -66], [6, -66], [18, -44], [14, -4]], 3.4, '#a07f33'); }
  ctx.restore();
}
function drawSpoon(ctx, dose) { // el çerçevesi: parmak ucu yönü +y
  ctx.save(); ctx.translate(0, 18); line(ctx, [[0, 0], [0, 60]], 7, C.ink); line(ctx, [[0, 0], [0, 60]], 3.6, '#d9d2c4'); ell(ctx, 0, 72, 17, 13, '#d9d2c4', C.ink, 3);
  if (dose) { shape(ctx, [[-12, 68], [10, 62], [14, 76], [-8, 80]], '#f4ecd8', null, { sw: 2.2, seed: 410 }); } ctx.restore();
}
function drawBottle(ctx, label) {
  ctx.save(); ctx.translate(0, 20); shape(ctx, [[-20, 8], [20, 8], [22, 80], [-22, 80]], '#9a7a4a', '#6f5530', { sw: 3, seed: 411, sx: -4, sy: -2 }); shape(ctx, [[-9, -16], [9, -16], [9, 8], [-9, 8]], '#9a7a4a', '#6f5530', { sw: 3, seed: 412 }); rr(ctx, -11, -22, 22, 8, '#d9b66e');
  rrect(ctx, -17, 30, 34, 30, 3); ctx.fillStyle = '#f4ecd8'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.ink; ctx.stroke(); if (label) { line(ctx, [[-12, 40], [12, 40]], 2, C.ink); line(ctx, [[-12, 48], [8, 48]], 2, C.ink); } ctx.restore();
}
function plainBG(ctx, col1 = '#efe4cd', col2 = '#e2d3b3') { const g = ctx.createRadialGradient(960, 520, 100, 960, 540, 1100); g.addColorStop(0, col1); g.addColorStop(1, col2); ctx.fillStyle = g; ctx.fillRect(-100, -100, 2120, 1300); }
function pinnedPaper(ctx, x, y, w, h, rot, col = '#f6ecd4') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = 'rgba(40,25,20,.28)'; rrect(ctx, -w / 2 + 8, -h / 2 + 10, w, h, 6); ctx.fill(); rrect(ctx, -w / 2, -h / 2, w, h, 6); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore(); }
function crossOut(ctx, x0, y0, x1, y1, p) { pen(ctx, [[x0, y0], [x1, y1 - 4], [x0 + 6, y1 + 8], [x1, y0 + 4]], p, 7, '#8a2f2c'); }
