'use strict';
// ===== Dekor ve dene levhası (geçici iskelet; sahne parçaları sonra eklenecek) =====
function yuzSheet(ctx) {
  ctx.fillStyle = '#d9c7a6'; ctx.fillRect(0, 0, 1920, 1080);
  const E = [
    { n: 'sakin gülümseme', f: {} },
    { n: 'gururlu', f: { mouth: { w: 24, open: .4, smile: 1, teeth: 1 }, browL: [-8, -.12, .25], browR: [-8, -.12, .25], blush: .7, lid: .1 } },
    { n: 'şok', f: { bulge: 1, browL: [-16, -.28, .45], browR: [-16, -.28, .45], mouth: { w: 18, open: .9, smile: 0, shape: 'o' }, sweat: .9 } },
    { n: 'göz deviriyor .5', f: { lid: .2, rollAmt: 1, roll: .5, browL: [-2, .08, .05], browR: [-10, -.18, .35], mouth: { w: 16, open: 0, smile: -.25 }, blush: .1 } },
    { n: 'nefessiz (yanak şiş)', f: { bulge: .8, puff: 1, browL: [-6, -.4, .2], browR: [-6, -.4, .2], mouth: { w: 9, open: .1, smile: -.6 }, look: [0, .3], sweat: .5 } },
    { n: 'kızgın', f: { lid: .25, browL: [3, .42, 0], browR: [3, .42, 0], mouth: { w: 17, open: .25, smile: -.8, teeth: 1 }, look: [.5, 0] } },
    { n: 'endişeli / kısık', f: { browL: [-4, -.45, .1], browR: [-4, -.45, .1], mouth: { w: 14, open: .1, smile: -.5 }, look: [-.6, .2], lid: .08 } },
    { n: 'göz deviriyor .85', f: { lid: .2, rollAmt: 1, roll: .85, browL: [-2, .08, .05], browR: [-10, -.18, .35], mouth: { w: 16, open: 0, smile: -.25 }, blush: .1 } },
  ];
  E.forEach((c, i) => {
    const cx = 240 + (i % 4) * 480, cy = 330 + Math.floor(i / 4) * 540;
    const F = faceDef(); Object.assign(F, c.f);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(2.6, 2.6); drawHead(ctx, { face: F }); ctx.restore();
    hand(ctx, c.n, cx, cy + 250, 40, '#3b2a22', 1, { align: 'center' });
  });
}
function testSheet(ctx, t, mod) {
  if (mod === 'yuz') return yuzSheet(ctx);
  if (mod === 'oda') { ctx.save(); ctx.scale(.55, .55); ctx.translate(-300, 120); drawRoom(ctx, { t, camx: 1500 }); drawMary(ctx, { x: 1500, y: 930, s: .8, face: faceDef(), armL: { t: [-96, -410], flip: false }, armR: { t: [96, -410], flip: true } }); ctx.restore(); return; }
  ctx.fillStyle = '#d9c7a6'; ctx.fillRect(0, 0, 1920, 1080);
  const cells = [
    { n: 'sakin', f: {}, a: { armL: [-112, -372], armR: [112, -372] } },
    { n: 'gururlu: eller belde', f: { mouth: { w: 22, open: .35, smile: 1, teeth: 1, shape: '' }, browL: [-6, -.1, .2], browR: [-6, -.1, .2], blush: .6 }, a: { armL: [-96, -410], armR: [96, -410], headDY: -6, headRoll: 3 } },
    { n: 'şok', f: { bulge: 1, browL: [-14, -.25, .4], browR: [-14, -.25, .4], mouth: { w: 12, open: 1, smile: 0, teeth: 0, shape: 'o' }, sweat: .8 }, a: { armL: [-130, -470], armR: [130, -470] } },
    { n: 'göz deviriyor', f: { lid: .38, roll: .5, browL: [-2, .1, .05], browR: [-8, -.15, .3], mouth: { w: 16, open: 0, smile: -.2, teeth: 0, shape: '' }, blush: .1 }, a: { armL: [-112, -372], armR: [112, -372], headRoll: -4 } },
    { n: 'röntgen + nefes', f: { bulge: .7, puff: .8, browL: [-8, -.35, .2], browR: [-8, -.35, .2], mouth: { w: 10, open: .15, smile: -.6, teeth: 0, shape: '' }, look: [0, .3] }, a: { armL: [-96, -410], armR: [96, -410], xray: 1, waist: .74 } },
    { n: 'kızgın: kollar kavuşuk', f: { lid: .25, browL: [2, .38, .0], browR: [2, .38, .0], mouth: { w: 16, open: 0, smile: -.7, teeth: 0, shape: '' }, look: [.5, 0] }, a: { armL: [60, -478], armR: [-60, -462], flip: true } },
  ];
  cells.forEach((c, i) => {
    const cx = 320 + (i % 3) * 640, cy = 530 + Math.floor(i / 3) * 540 - 20;
    const F = faceDef(); Object.assign(F, c.f);
    const S = { x: cx, y: cy, s: .64, face: F, armL: { t: c.a.armL, flip: c.a.flip ?? false }, armR: { t: c.a.armR, flip: c.a.flip ?? true }, xray: c.a.xray || 0, waist: c.a.waist ?? 1, headDY: c.a.headDY || 0, headRoll: c.a.headRoll || 0 };
    drawMary(ctx, S);
    hand(ctx, c.n, cx - 120, cy - 520, 40, '#3b2a22', 1);
  });
}
function acilisCiz(ctx, t) { ctx.fillStyle = '#222'; ctx.fillRect(0, 0, 1920, 1080); }

// ===================== ODA (dünya koordinatları: genişlik ~3300, zemin y=930) =====================
const ZEMIN = 930;
function wallPat(ctx) {
  if (wallPat.p) return wallPat.p;
  const c = document.createElement('canvas'); c.width = 160; c.height = 160; const x = c.getContext('2d');
  x.fillStyle = C.wall; x.fillRect(0, 0, 160, 160); x.fillStyle = C.wallS; x.fillRect(0, 0, 80, 160);
  x.fillStyle = 'rgba(120,85,55,.20)'; x.fillRect(79, 0, 2, 160); x.fillRect(0, 0, 2, 160);
  for (const [cx, cy] of [[40, 40], [40, 120]]) { x.save(); x.translate(cx, cy); x.fillStyle = 'rgba(150,105,70,.30)'; x.beginPath(); x.moveTo(0, -24); x.quadraticCurveTo(15, -8, 0, 24); x.quadraticCurveTo(-15, -8, 0, -24); x.fill(); x.beginPath(); x.ellipse(0, 0, 6, 6, 0, 0, TAU); x.fill(); x.restore(); }
  for (const [cx, cy] of [[120, 80], [120, 0], [120, 160]]) { x.fillStyle = 'rgba(140,100,70,.22)'; x.beginPath(); x.ellipse(cx, cy, 5, 5, 0, 0, TAU); x.fill(); }
  wallPat.p = ctx.createPattern(c, 'repeat'); return wallPat.p;
}
function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function glow(ctx, x, y, r, col, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }

// gece şehri manzarası (pencere camı ve sokak sahnesi için ortak)
function skyBlock(ctx, x, y, w, h, t, dx = 0) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#4a3140'); g.addColorStop(.5, '#8e6b78'); g.addColorStop(.82, '#e7b98a'); g.addColorStop(1, '#f2d3a4'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  const bl = (seed, n, base, minH, maxH, col, par, win) => {
    for (let i = 0; i < n; i++) {
      const bw = 50 + hash(seed + i * 3.1) * 70, bh = minH + hash(seed + i * 5.7) * (maxH - minH), bx = x + ((i * (w / n * 1.15) + dx * par) % (w * 1.2)) - 40;
      ctx.fillStyle = col; ctx.fillRect(bx, y + base - bh, bw, bh + 40);
      if (win) for (let wy = y + base - bh + 16; wy < y + base - 12; wy += 26) for (let wx = bx + 8; wx < bx + bw - 10; wx += 20) { const on = hash(seed + wx * .13 + wy * .29) > .55 ? (hash(wx * .7 + wy + Math.floor(t * .5 + wx)) > .1) : false; if (on) { ctx.fillStyle = '#f3c66b'; ctx.fillRect(wx, wy, 9, 13); } }
    }
  };
  bl(1, 9, h * .86, h * .18, h * .42, '#a98393', .2, false);
  bl(7, 7, h * .96, h * .25, h * .6, '#6e4f5d', .5, true);
  ctx.restore();
}

function drawWindow(ctx, R) {
  const x = 360, y = 150, w = 320, h = 540;
  // perde çubuğu + cam
  ctx.save(); ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + 120); ctx.arc(x + w / 2, y + 120, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.clip();
  skyBlock(ctx, x, y, w, h, R.t, R.camx * -.03); ctx.restore();
  // çerçeve
  ctx.save(); ctx.lineWidth = 16; ctx.strokeStyle = C.woodL; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + 120); ctx.arc(x + w / 2, y + 120, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.lineWidth = 9; ctx.strokeStyle = C.woodL; ctx.beginPath(); ctx.moveTo(x + w / 2, y - 40); ctx.lineTo(x + w / 2, y + h); ctx.moveTo(x, y + 300); ctx.lineTo(x + w, y + 300); ctx.stroke();
  ctx.restore();
  // denizlik
  shape(ctx, [[x - 40, y + h + 4], [x + w + 40, y + h + 4], [x + w + 30, y + h + 26], [x - 30, y + h + 26]], C.woodL, C.woodD, { sw: 3, seed: 61, sx: -3, sy: -4 });
  // perde çubuğu ve perdeler
  line(ctx, [[x - 140, y - 70], [x + w + 140, y - 70]], 9, C.goldD); ell(ctx, x - 146, y - 70, 12, 12, C.gold, C.ink, 2.4); ell(ctx, x + w + 146, y - 70, 12, 12, C.gold, C.ink, 2.4);
  const sway = Math.sin(R.t * .8) * 3;
  const drape = (sx, dir) => {
    const pts = [[sx, y - 62], [sx + dir * 150, y - 62], [sx + dir * 140 + sway * dir, y + 250], [sx + dir * 116, y + 430], [sx + dir * 170, y + 640], [sx + dir * 20, y + 650], [sx - dir * 8, y + 430], [sx + dir * 10, y + 250]];
    shape(ctx, pts, C.olive, C.oliveD, { seed: 62 + dir, sx: dir * -10, sy: 0, sw: 3.4 });
    for (let k = 1; k < 5; k++) line(ctx, [[sx + dir * k * 28, y - 50], [sx + dir * (k * 28 + 4), y + 300], [sx + dir * (k * 30 + 20), y + 640]], 2.6, C.oliveD);
    line(ctx, [[sx + dir * 4, y + 440], [sx + dir * 118, y + 430]], 9, C.gold); ell(ctx, sx + dir * 60, y + 470, 9, 20, C.gold, C.ink, 2.4);
  };
  drape(x - 30, -1); drape(x + w + 30, 1);
  // volan
  shape(ctx, [[x - 190, y - 66], [x + w + 190, y - 66], [x + w + 180, y - 10], [x + w + 100, y + 20], [x + w / 2, y - 6], [x + 100, y + 20], [x - 100, y - 4], [x - 180, y - 10]], C.burg, C.burgD, { seed: 66, sx: -4, sy: -6, sw: 3.4 });
}
function drawPortrait(ctx, x, y, s, flip) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (flip ? -1 : 1), s);
  ell(ctx, 0, 0, 78, 100, C.gold, C.ink, 3.4); ell(ctx, 0, 0, 64, 86, '#d8c5a2', C.goldD, 3);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 64, 86, 0, 0, TAU); ctx.clip();
  ctx.fillStyle = '#a58c68'; ctx.fillRect(-70, -90, 140, 180);
  ell(ctx, 0, -14, 26, 32, '#e2cba6', null); shape(ctx, [[-30, -16], [-22, -48], [0, -52], [22, -48], [30, -16], [26, -34], [0, -40], [-26, -34]], '#5b4030', null, { sw: 0, seed: 71 });
  shape(ctx, [[-60, 90], [-50, 36], [-20, 22], [20, 22], [50, 36], [60, 90]], '#5b4030', null, { sw: 0, seed: 72 });
  ctx.restore(); ctx.restore();
}
function drawChair(ctx, cx, fy) {
  const top = fy - 330;
  // arka ayaklar + sırt direkleri
  for (const sd of [-1, 1]) { const pts = [[cx + sd * 78, top - 10], [cx + sd * 82, fy - 420], [cx + sd * 76, fy - 640]]; line(ctx, pts, 24, C.ink); line(ctx, pts, 17, C.woodL); }
  // kapitone sırt
  shape(ctx, [[cx - 74, fy - 668], [cx, fy - 690], [cx + 74, fy - 668], [cx + 70, fy - 470], [cx, fy - 452], [cx - 70, fy - 470]], C.burg, C.burgD, { sw: 3.4, seed: 81, sx: -6, sy: -6 });
  for (const [dx, dy] of [[-28, -620], [28, -620], [0, -570], [-28, -520], [28, -520]]) ell(ctx, cx + dx, fy + dy, 5, 5, C.gold, C.ink, 1.6);
  // ön ayaklar
  for (const sd of [-1, 1]) { const pts = [[cx + sd * 66, top + 14], [cx + sd * 72, fy - 6]]; line(ctx, pts, 22, C.ink); line(ctx, pts, 15, C.woodD); }
  // oturak
  shape(ctx, [[cx - 100, top - 30], [cx + 100, top - 30], [cx + 108, top + 14], [cx - 108, top + 14]], C.burg, C.burgD, { sw: 3.2, seed: 82, sx: -4, sy: -6 });
  line(ctx, [[cx - 104, top + 14], [cx + 104, top + 14]], 9, C.goldD);
}
function drawTable(ctx, cx, fy, canapes) {
  const top = fy - 300;
  shape(ctx, [[cx - 20, top], [cx + 20, top], [cx + 30, fy - 30], [cx - 30, fy - 30]], C.woodD, C.woodD, { sw: 3, seed: 91 });
  ell(ctx, cx, fy - 14, 96, 16, C.woodD, C.ink, 3); ell(ctx, cx, fy - 30, 40, 9, C.woodL, C.ink, 2.6);
  ell(ctx, cx, top + 14, 128, 26, C.woodD, C.ink, 3); ell(ctx, cx, top, 128, 26, C.woodL, C.ink, 3);
  // tabak
  ell(ctx, cx, top - 6, 84, 15, C.lace, C.ink, 2.6); ell(ctx, cx, top - 8, 66, 10, '#e7dbc2', C.gold, 2);
  for (let i = 0; i < canapes; i++) { const px = cx + (i - 1) * 46; rrect(ctx, px - 17, top - 34, 34, 20, 6); ctx.fillStyle = '#c99b5b'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = C.ink; ctx.stroke(); ell(ctx, px, top - 28, 7, 6, i % 2 ? '#7f7d52' : '#b24a45', C.ink, 1.8); }
}
function drawGownStand(ctx, cx, fy) {
  // üç ayaklı ayak + direk
  for (const d of [-1, 0, 1]) line(ctx, [[cx, fy - 120], [cx + d * 70, fy - 30], [cx + d * 96, fy - 6]], 12, C.ink), line(ctx, [[cx, fy - 120], [cx + d * 70, fy - 30], [cx + d * 96, fy - 6]], 7, C.woodD);
  line(ctx, [[cx, fy - 120], [cx, fy - 560]], 16, C.ink); line(ctx, [[cx, fy - 120], [cx, fy - 560]], 10, C.woodL);
  // elbise
  const k = .8;
  ctx.save(); ctx.translate(cx, fy); ctx.scale(k, k);
  shape(ctx, [[-86, -520], [-92, -420], [-82, -360], [-100, -330], [-130, -200], [-168, -80], [-198, -30], [-110, -18], [0, -12], [110, -18], [198, -30], [168, -80], [130, -200], [100, -330], [82, -360], [92, -420], [86, -520], [0, -540]], '#e8dcc2', '#cdbb98', { seed: 101, sx: -14, sy: -6 });
  for (const a of [-60, -20, 20, 60]) line(ctx, [[a * .9, -330], [a * 1.5, -160], [a * 2.1, -40]], 2.6, '#c1ad88');
  shape(ctx, [[-88, -432], [88, -432], [86, -406], [-86, -406]], C.gold, C.goldD, { sw: 2.8, seed: 102, sx: -4, sy: -2 });
  ell(ctx, 0, -419, 14, 14, C.gownL, C.ink, 2.6);
  line(ctx, [[-70, -500], [-30, -468], [0, -458], [30, -468], [70, -500]], 11, C.lace); line(ctx, [[-70, -500], [-30, -468], [0, -458], [30, -468], [70, -500]], 2.2, C.ink);
  for (let x = -184; x <= 184; x += 23) { const y = -12 - 20 * Math.pow(x / 198, 2) - 8; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI); ctx.fillStyle = C.lace; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = C.ink; ctx.stroke(); }
  ctx.restore();
  ell(ctx, cx, fy - 566, 20, 24, C.woodL, C.ink, 3);
}
function drawMirror(ctx, cx, fy, reflect) {
  const my = fy - 385, rx = 190, ry = 330;
  // ayaklar ve direkler
  line(ctx, [[cx - 205, my + 40], [cx - 215, fy - 6]], 22, C.ink); line(ctx, [[cx - 205, my + 40], [cx - 215, fy - 6]], 15, C.woodD);
  line(ctx, [[cx + 205, my + 40], [cx + 215, fy - 6]], 22, C.ink); line(ctx, [[cx + 205, my + 40], [cx + 215, fy - 6]], 15, C.woodD);
  line(ctx, [[cx - 280, fy - 6], [cx - 140, fy - 24]], 20, C.ink); line(ctx, [[cx - 280, fy - 6], [cx - 140, fy - 24]], 13, C.woodD);
  line(ctx, [[cx + 280, fy - 6], [cx + 140, fy - 24]], 20, C.ink); line(ctx, [[cx + 280, fy - 6], [cx + 140, fy - 24]], 13, C.woodD);
  // çerçeve
  ell(ctx, cx, my, rx + 26, ry + 26, C.woodL, C.ink, 4); ell(ctx, cx, my, rx + 6, ry + 6, C.woodD, C.ink, 3);
  // cam
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, my, rx, ry, 0, 0, TAU); ctx.clip();
  const g = ctx.createLinearGradient(cx - rx, my - ry, cx + rx, my + ry); g.addColorStop(0, '#f1e6d2'); g.addColorStop(1, '#d6c4a6'); ctx.fillStyle = g; ctx.fillRect(cx - rx, my - ry, 2 * rx, 2 * ry);
  // duvar yansıması: soluk şeritler
  ctx.fillStyle = 'rgba(190,150,110,.20)'; for (let i = -3; i <= 3; i++) ctx.fillRect(cx + i * 80 - 18, my - ry, 36, 2 * ry);
  if (reflect) reflect(ctx, cx, my + ry);
  // parıltı çizgisi
  ctx.save(); ctx.globalAlpha = .28; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(cx - 120, my - ry); ctx.lineTo(cx - 70, my - ry); ctx.lineTo(cx + 40, my + ry); ctx.lineTo(cx - 10, my + ry); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.restore();
  ell(ctx, cx, my - ry - 40, 17, 17, C.gold, C.ink, 3);
}
function drawRoom(ctx, R) {
  const fy = ZEMIN;
  ctx.fillStyle = wallPat(ctx); ctx.fillRect(-500, -400, 4400, 1330);
  ctx.fillStyle = C.woodL; ctx.fillRect(-500, -30, 4400, 30); ctx.fillStyle = C.woodD; ctx.fillRect(-500, 0, 4400, 9);
  // lambri
  ctx.fillStyle = C.wood; ctx.fillRect(-500, 690, 4400, 240);
  for (let x = -420; x < 3800; x += 210) { rrect(ctx, x + 20, 724, 170, 150, 8); ctx.fillStyle = C.woodL; ctx.fill(); rrect(ctx, x + 32, 736, 146, 126, 6); ctx.fillStyle = C.wood; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = 'rgba(40,24,14,.5)'; ctx.stroke(); }
  ctx.fillStyle = C.woodL; ctx.fillRect(-500, 676, 4400, 24); ctx.fillStyle = C.woodD; ctx.fillRect(-500, 700, 4400, 7);
  ctx.fillStyle = C.woodD; ctx.fillRect(-500, 890, 4400, 40);
  // zemin
  const fg = ctx.createLinearGradient(0, fy, 0, fy + 600); fg.addColorStop(0, '#8d6747'); fg.addColorStop(1, '#58392a'); ctx.fillStyle = fg; ctx.fillRect(-500, fy, 4400, 700);
  ctx.strokeStyle = 'rgba(40,24,16,.38)'; ctx.lineWidth = 2;
  let yPrev = fy; for (let i = 1; i < 9; i++) { const y = fy + Math.pow(i, 1.55) * 16; ctx.beginPath(); ctx.moveTo(-500, y); ctx.lineTo(3900, y); ctx.stroke(); for (let x = -500 + ((i % 2) * 190); x < 3900; x += 380) { ctx.beginPath(); ctx.moveTo(x, yPrev); ctx.lineTo(x - 4 * i, y); ctx.stroke(); } yPrev = y; }
  // halı
  ctx.save(); ctx.translate(1700, fy + 96); ctx.scale(1, .17);
  ell(ctx, 0, 0, 1000, 700, C.burgD, C.ink, 16); ell(ctx, 0, 0, 940, 640, C.burg, null); ell(ctx, 0, 0, 840, 540, C.mustard, null); ell(ctx, 0, 0, 800, 500, C.burg, null);
  ctx.restore();
  // pencere, resimler, aplik
  drawWindow(ctx, R);
  drawPortrait(ctx, 2000, 380, 1.1, true);
  ctx.save(); line(ctx, [[1800, 330], [1840, 330]], 7, C.goldD); shape(ctx, [[1830, 300], [1860, 300], [1864, 350], [1826, 350]], '#f4dca8', '#d9b66e', { sw: 2.6, seed: 111, sx: -3, sy: -3 }); ctx.restore();
  glow(ctx, 1845, 330, 330, 'rgba(255,214,140,A)', .38 + Math.sin(R.t * 6.3) * .02);
  // mobilyalar
  drawChair(ctx, R.chairX ?? 960, fy);
  drawTable(ctx, R.tableX ?? 1930, fy, R.canapes ?? 3);
  drawGownStand(ctx, R.standX ?? 2330, fy);
  drawMirror(ctx, R.mirrorX ?? 2850, fy, R.reflect);
}

// ===================== SOKAK (1. çekim: Yıl 1913, New York) =====================
function waterTower(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const dx of [-46, -16, 16, 46]) line(ctx, [[dx, 0], [dx * .8, -86]], 7, '#2b1d1f', false, 0);
  line(ctx, [[-46, -30], [46, -62]], 4, '#2b1d1f'); line(ctx, [[46, -30], [-46, -62]], 4, '#2b1d1f');
  shape(ctx, [[-58, -86], [58, -86], [58, -176], [-58, -176]], '#4b342f', '#38261f', { sw: 0, seed: 141, sx: -6, sy: 0 });
  for (const yy of [-110, -140]) line(ctx, [[-58, yy], [58, yy]], 4, '#2b1d1f');
  shape(ctx, [[-66, -176], [66, -176], [0, -232]], '#4b342f', '#38261f', { sw: 0, seed: 142, sx: -6, sy: -2 });
  ctx.restore();
}
function modelT(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // gövde
  shape(ctx, [[-170, -70], [-170, -150], [-100, -158], [-90, -250], [20, -252], [30, -160], [170, -150], [176, -70]], '#2c2326', '#1b1517', { seed: 151, sw: 3, sx: -8, sy: -4 });
  // cam/perde
  shape(ctx, [[-84, -240], [10, -242], [14, -166], [-86, -164]], '#e9d6b0', '#c9b387', { seed: 152, sw: 2.6, sx: -4, sy: -3 });
  // sürücü
  ell(ctx, -40, -192, 15, 17, '#4a3328', C.ink, 2.4); shape(ctx, [[-60, -200], [-56, -240], [-24, -240], [-20, -200]], '#2b2326', null, { sw: 2.4, seed: 153 });
  shape(ctx, [[-62, -204], [-18, -204], [-22, -214], [-58, -214]], '#2b2326', null, { sw: 0, seed: 154 });
  // far + tampon
  ell(ctx, 186, -118, 13, 13, '#e0b453', C.ink, 2.4); line(ctx, [[-176, -60], [182, -60]], 7, '#b9a89a');
  // tekerlekler (dönen)
  for (const wx of [-100, 112]) {
    ctx.save(); ctx.translate(wx, -46); ctx.rotate(t * 9);
    ell(ctx, 0, 0, 50, 50, '#e2d3b7', C.ink, 6); ell(ctx, 0, 0, 40, 40, null, '#3b2a22', 3);
    for (let i = 0; i < 12; i++) line(ctx, [[0, 0], [Math.cos(i / 12 * TAU) * 40, Math.sin(i / 12 * TAU) * 40]], 3, '#3b2a22');
    ell(ctx, 0, 0, 8, 8, '#b9a89a', C.ink, 2);
    ctx.restore();
  }
  ctx.restore();
}
function lampPost(ctx, x, y, t) {
  line(ctx, [[x, y], [x, y - 300]], 12, '#2b1d1f'); ell(ctx, x, y - 12, 22, 9, '#2b1d1f', null);
  line(ctx, [[x, y - 280], [x + 30, y - 296]], 8, '#2b1d1f');
  shape(ctx, [[x + 14, y - 330], [x + 54, y - 330], [x + 58, y - 296], [x + 10, y - 296]], '#f6dca2', '#e0b86a', { sw: 2.6, seed: 161, sx: -3, sy: -3 });
  glow(ctx, x + 34, y - 314, 190, 'rgba(255,205,120,A)', .55 + Math.sin(t * 7 + x) * .03);
}
function drawStreet(ctx, t, p) {
  // p: {pan, zoom}
  const pan = p.pan, W = 1920, H = 1080;
  skyBlock(ctx, -300, -100, W + 600, 1000, t, pan);
  // güneş ışıltısı ve bulutlar
  glow(ctx, 1500 - pan * .1, 640, 900, 'rgba(255,196,130,A)', .5);
  for (const [cx, cy, rx] of [[420, 230, 260], [1250, 140, 330], [1700, 330, 240]]) { ctx.save(); ctx.globalAlpha = .26; ell(ctx, ((cx - pan * .05 + t * 6) % 2400) - 200, cy, rx, 26, '#e7b9a8', null); ell(ctx, ((cx - pan * .05 + t * 6) % 2400) - 120, cy + 16, rx * .7, 20, '#d6a5a0', null); ctx.restore(); }
  // gotik kule (Woolworth esintili)
  ctx.save(); ctx.translate(1230 - pan * .35, 880);
  const tw = (x0, w, h0, h1, col) => { ctx.fillStyle = col; ctx.fillRect(x0, -h1, w, h1 - h0); };
  tw(-120, 240, 0, 360, '#5c4150'); tw(-80, 160, 360, 560, '#5c4150'); tw(-52, 104, 560, 700, '#5c4150');
  shape(ctx, [[-56, -700], [56, -700], [0, -860]], '#4a3441', null, { sw: 0, seed: 171 }); line(ctx, [[0, -860], [0, -900]], 5, '#4a3441');
  for (let yy = -690; yy < -20; yy += 34) for (let xx = -108; xx < 108; xx += 24) { const inside = (yy < -560 ? Math.abs(xx) < 44 : yy < -360 ? Math.abs(xx) < 72 : true); if (inside && hash(xx * .31 + yy * .17 + 3) > .5 && hash(xx + yy + Math.floor(t * .7 + xx)) > .08) { ctx.fillStyle = '#f3c66b'; ctx.fillRect(xx, yy, 9, 15); } }
  ctx.restore();
  // yakın bina: sol (su kulesiyle) ve sağ
  const near = (bx, by, bw, par) => {
    const x = bx - pan * par; ctx.fillStyle = '#3a2a2e'; ctx.fillRect(x, by, bw, 1100 - by);
    ctx.fillStyle = '#2f2124'; ctx.fillRect(x - 10, by - 14, bw + 20, 22);
    for (let yy = by + 40; yy < 840; yy += 70) for (let xx = x + 26; xx < x + bw - 40; xx += 62) { const on = hash(xx * .13 + yy * .31 + bx) > .45; ctx.fillStyle = on ? '#f0b85c' : '#52393a'; ctx.fillRect(xx, yy, 30, 44); if (on) { ctx.fillStyle = 'rgba(70,40,30,.35)'; ctx.fillRect(xx, yy + 20, 30, 3); } }
    // yangın merdiveni
    ctx.strokeStyle = '#1f1618'; ctx.lineWidth = 4; for (let yy = by + 100; yy < 760; yy += 140) { ctx.beginPath(); ctx.moveTo(x + 8, yy); ctx.lineTo(x + 8 + 118, yy); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 8, yy); ctx.lineTo(x + 8 + 118, yy + 70); ctx.stroke(); }
    return x;
  };
  const lx = near(-120, 330, 640, .8); waterTower(ctx, lx + 360, 330 - 14, 1.5);
  // baca dumanı
  for (let i = 0; i < 7; i++) { const u = ((t * .5 + i / 7) % 1); ctx.save(); ctx.globalAlpha = .45 * (1 - u); ell(ctx, lx + 470 + u * 110 + Math.sin(u * 6 + i) * 10, 280 - u * 210, 18 + u * 34, 15 + u * 26, '#e6d7c6', null); ctx.restore(); }
  near(1500, 230, 700, .8);
  // sokak zemini
  const gg = ctx.createLinearGradient(0, 880, 0, 1100); gg.addColorStop(0, '#5a4033'); gg.addColorStop(1, '#3a2a24'); ctx.fillStyle = gg; ctx.fillRect(-300, 880, W + 600, 300);
  ctx.fillStyle = '#7a5d4a'; ctx.fillRect(-300, 880, W + 600, 26);
  ctx.strokeStyle = 'rgba(30,18,14,.4)'; ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { const y = 926 + i * 40; ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); for (let x = -300 + (i % 2) * 40; x < W + 300; x += 80) { ctx.beginPath(); ctx.moveTo(x - pan * 1.1 % 80, y); ctx.lineTo(x - pan * 1.1 % 80 - 10, y + 40); ctx.stroke(); } }
  lampPost(ctx, 560 - pan * 1.1, 900, t); lampPost(ctx, 1420 - pan * 1.1, 900, t);
  // araba (soldan sağa)
  modelT(ctx, -330 + t * 300 + 120, 990, .95, t);
  for (let i = 0; i < 5; i++) { const u = ((t * 1.3 + i / 5) % 1), px = -330 + t * 300 + 120 - 180 - u * 150; ctx.save(); ctx.globalAlpha = .4 * (1 - u); ell(ctx, px, 930 - u * 50, 8 + u * 22, 7 + u * 16, '#e4d6c8', null); ctx.restore(); }
}

// ===================== PROPLAR =====================
function drawInvite(ctx, x, y, rot, s, ink) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(40,25,20,.25)'; rrect(ctx, -80, -48, 168, 112, 8); ctx.fill();
  rrect(ctx, -84, -56, 168, 112, 8); ctx.fillStyle = '#f6ecd4'; ctx.fill(); ctx.lineWidth = 3.4; ctx.strokeStyle = C.ink; ctx.stroke();
  rrect(ctx, -72, -44, 144, 88, 4); ctx.lineWidth = 3; ctx.strokeStyle = C.gold; ctx.stroke();
  if (ink !== false) hand(ctx, 'Davetiye', 0, -4, 40, C.burgD, 1, { align: 'center' });
  ell(ctx, 0, 24, 12, 12, C.burg, C.ink, 2.4); ell(ctx, -3, 21, 3.5, 3.5, '#d98a8a', null);
  ctx.restore();
}
// özgüven ölçeri (el çizimi termometre); L: 0..1.2, tb: patlama anı
function drawGauge(ctx, x, y, L, t, tb, alpha) {
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha = alpha;
  const H = 300;
  rrect(ctx, -17, -H - 20, 34, H + 40, 17); ctx.fillStyle = '#f7f0e0'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke();
  ell(ctx, 0, 24, 34, 34, '#f7f0e0', C.ink, 4);
  const lv = Math.min(L, 1), h = lv * (H - 4);
  ell(ctx, 0, 24, 24, 24, '#b4504a', null); rrect(ctx, -9, -h, 18, h + 24, 9); ctx.fillStyle = '#b4504a'; ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(-4, -h + 8, 4, Math.max(0, h - 4));
  for (let i = 0; i <= 8; i++) line(ctx, [[17, -i * (H - 4) / 8], [i % 2 ? 28 : 36, -i * (H - 4) / 8]], 3, C.ink);
  if (t >= tb && tb > 0) {   // patlama: kapak fırlar, damlalar saçılır
    const u = t - tb;
    ctx.save(); ctx.translate(0, -H - 20 - Math.min(u, 1.2) * 160 + 120 * u * u); ctx.rotate(u * 7); shape(ctx, [[-17, 4], [17, 4], [17, -8], [0, -22], [-17, -8]], '#e4d6c8', null, { sw: 3, seed: 181 }); ctx.restore();
    for (let i = 0; i < 6; i++) { const vx = (i - 2.5) * 46, vy = 300 + (i % 3) * 70, k = Math.min(u, 1.4); ctx.save(); ctx.globalAlpha = alpha * clamp(1.6 - u); ell(ctx, vx * k * .55, -H - 20 - (vy * k * .5 - 280 * k * k), 7, 9, '#b4504a', C.ink, 2); ctx.restore(); }
  }
  ctx.restore();
}
