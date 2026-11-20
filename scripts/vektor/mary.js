'use strict';
// ===== Mary: kodla çizilen, parça parça hareket edebilen karakter =====
// Yerel koordinat: orijin = ayakların yere bastığı orta nokta; y yukarı = eksi. Boy ≈ 800.
function faceDef() {
  return { blink: 0, lid: 0, look: [0, 0], roll: -1, bulge: 0, browL: [0, 0, .12], browR: [0, 0, .12],
    mouth: { w: 17, open: 0, smile: .6, teeth: 0, shape: '' }, blush: .35, turn: 0, puff: 0, sweat: 0 };
}
function drawEye(ctx, side, F) {
  const ex = side * 24, ey = 2, rx = 15.5, ry = 18.5 * (1 + F.bulge * .38);
  const cover = clamp(F.lid + F.blink * (1 - F.lid));
  ctx.save(); ctx.translate(ex, ey);
  ell(ctx, 0, 0, rx, ry, C.white, C.ink, 3);
  let lx = F.look[0], ly = F.look[1];
  if ((F.rollAmt || 0) > 0) { const th = lerp(Math.PI * .93, Math.PI * .07, F.roll ?? .5); lx = lerp(lx, Math.cos(th) * .95, F.rollAmt); ly = lerp(ly, -Math.sin(th) * 1.0, F.rollAmt); }
  const ix = lx * (rx - 9), iy = ly * (ry - 10);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, rx - 1, ry - 1, 0, 0, TAU); ctx.clip();
  ell(ctx, ix, iy, 9.6, 10.6, C.iris, null);
  ell(ctx, ix, iy, 5.2, 5.8, '#1d120e', null);
  ell(ctx, ix - 3, iy - 4, 2.5, 2.5, '#fff', null);
  ctx.restore();
  if (cover > .02) {
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, rx + 1, ry + 1, 0, 0, TAU); ctx.clip();
    const yl = -ry + 2 * ry * cover;
    ctx.beginPath(); ctx.moveTo(-rx - 5, -ry - 8); ctx.lineTo(rx + 5, -ry - 8); ctx.lineTo(rx + 5, yl);
    ctx.quadraticCurveTo(0, yl + 7 * (1 - cover), -rx - 5, yl); ctx.closePath();
    ctx.fillStyle = C.skin; ctx.fill(); ctx.lineWidth = 3.6; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 1.06, Math.PI * 1.94); ctx.lineWidth = 4.6; ctx.strokeStyle = C.ink; ctx.lineCap = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(side * (rx - 1), -6); ctx.lineTo(side * (rx + 8), -12); ctx.lineWidth = 3.6; ctx.stroke();
  ctx.restore();
}
function drawBrow(ctx, side, b) {
  const cx = side * 25, cy = -33 + b[0], L = 18, a = b[1];
  const inner = [cx - side * L * Math.cos(a), cy + L * Math.sin(a)], outer = [cx + side * L * Math.cos(a), cy - L * Math.sin(a)];
  const mid = [(inner[0] + outer[0]) / 2, (inner[1] + outer[1]) / 2 - b[2] * 22];
  ctx.save(); ctx.beginPath(); ctx.moveTo(inner[0], inner[1]); ctx.quadraticCurveTo(mid[0], mid[1], outer[0], outer[1]);
  ctx.lineWidth = 7.5; ctx.strokeStyle = C.hairD; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
}
function drawMouth(ctx, M) {
  const w = M.w, o = M.open, s = M.smile;
  ctx.save(); ctx.translate(0, 41);
  if (M.shape === 'o') {
    ell(ctx, 0, 6, w * .62, 7 + o * 12, C.cavity, C.lip, 3.4);
  } else if (o < .06) {
    ctx.beginPath(); ctx.moveTo(-w, -s * 5); ctx.quadraticCurveTo(0, s * 13, w, -s * 5);
    ctx.lineWidth = 4; ctx.strokeStyle = C.lip; ctx.lineCap = 'round'; ctx.stroke();
    if (s > .35) { line(ctx, [[-w - 3, -s * 5 - 3], [-w - 1, -s * 5 + 2]], 2.6, C.skinD); line(ctx, [[w + 3, -s * 5 - 3], [w + 1, -s * 5 + 2]], 2.6, C.skinD); }
  } else {
    const bot = 4 + o * 30;
    ctx.beginPath(); ctx.moveTo(-w, -s * 5); ctx.quadraticCurveTo(0, -s * 5 + 1, w, -s * 5);
    ctx.quadraticCurveTo(w * .9, bot, 0, bot + 5); ctx.quadraticCurveTo(-w * .9, bot, -w, -s * 5); ctx.closePath();
    ctx.fillStyle = C.cavity; ctx.fill();
    ctx.save(); ctx.clip();
    if (M.teeth) { ctx.fillStyle = C.white; ctx.fillRect(-w, -s * 5 - 2, 2 * w, 9 + M.teeth * 4); ctx.lineWidth = 1.6; ctx.strokeStyle = '#cdbfa8'; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * w / 3.4, -s * 5); ctx.lineTo(i * w / 3.4, -s * 5 + 9 + M.teeth * 4); ctx.stroke(); } }
    ell(ctx, 0, bot + 2, w * .55, 8, C.tongue, null);
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(-w, -s * 5); ctx.quadraticCurveTo(0, -s * 5 + 1, w, -s * 5); ctx.quadraticCurveTo(w * .9, bot, 0, bot + 5); ctx.quadraticCurveTo(-w * .9, bot, -w, -s * 5); ctx.closePath();
    ctx.lineWidth = 3.6; ctx.strokeStyle = C.lip; ctx.lineJoin = 'round'; ctx.stroke();
  }
  ctx.restore();
}
function drawHead(ctx, S) {
  const F = S.face, pf = F.puff || 0;
  ctx.save();
  // arka saç: yuvarlak kabarık topuz
  shape(ctx, [[0, -106], [44, -100], [78, -72], [86, -30], [76, 8], [62, 42], [40, 68], [0, 72], [-40, 68], [-62, 42], [-76, 8], [-86, -30], [-78, -72], [-44, -100]], C.hair, C.hairD, { seed: 3, sx: -8, sy: -6 });
  // kulaklar
  ell(ctx, -56, 6, 7, 11, C.skin, C.ink, 2.5); ell(ctx, 56, 6, 7, 11, C.skin, C.ink, 2.5);
  // boyun
  shape(ctx, [[-17, 40], [17, 40], [20, 100], [-20, 100]], C.skin, C.skinD, { sw: 3, seed: 5, sx: -6, sy: 0 });
  // yüz (yanak şişmesi: puff)
  shape(ctx, [[0, -66], [34, -60], [55 + 5 * pf, -16], [50 + 18 * pf, 22], [35 + 10 * pf, 54], [0, 67], [-35 - 10 * pf, 54], [-50 - 18 * pf, 22], [-55 - 5 * pf, -16], [-34, -60]], C.skin, C.skinD, { seed: 1, sx: -7, sy: -4, sw: 3.4 });
  // yüz öğeleri (hafif dönme: turn)
  ctx.save(); ctx.translate(F.turn * 15, 0); ctx.scale(1 - Math.abs(F.turn) * .1, 1);
  ctx.globalAlpha = .55 * F.blush; ell(ctx, -37 - 8 * pf, 24, 13, 8, C.blush, null); ell(ctx, 37 + 8 * pf, 24, 13, 8, C.blush, null); ctx.globalAlpha = 1;
  drawEye(ctx, -1, F); drawEye(ctx, 1, F);
  line(ctx, [[1, 13], [5, 21], [0, 24]], 3, '#b5805f');
  drawMouth(ctx, F.mouth);
  if (F.sweat > .02) { const sy = -46 + F.sweat * 26; ctx.save(); ctx.globalAlpha = clamp(F.sweat * 3); ctx.beginPath(); ctx.moveTo(44, sy - 12); ctx.quadraticCurveTo(54, sy + 4, 44, sy + 8); ctx.quadraticCurveTo(34, sy + 4, 44, sy - 12); ctx.fillStyle = '#f6efe2'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore(); }
  ctx.restore();
  // ön saç: ortadan ayrık, alın açık
  shape(ctx, [[-70, 18], [-80, -34], [-56, -88], [0, -102], [56, -88], [80, -34], [70, 18], [60, -8], [50, -34], [30, -54], [0, -50], [-30, -54], [-50, -34], [-60, -8]], C.hair, C.hairD, { seed: 7, sx: -7, sy: -5 });
  line(ctx, [[0, -50], [-20, -76], [-48, -88]], 2.6, C.hairL); line(ctx, [[0, -50], [-28, -66], [-62, -60]], 2.6, C.hairL);
  line(ctx, [[0, -50], [20, -76], [48, -88]], 2.6, C.hairL); line(ctx, [[0, -50], [28, -66], [62, -60]], 2.6, C.hairL);
  // kaşlar saçın üstünde de görünsün
  drawBrowPair(ctx, F);
  // inci küpeler
  ell(ctx, -55, 32, 5.5, 5.5, C.lace, C.ink, 2); ell(ctx, 55, 32, 5.5, 5.5, C.lace, C.ink, 2);
  // saç kurdelesi (fiyonk)
  shape(ctx, [[-50, -98], [-76, -116], [-88, -98], [-78, -80]], C.mustard, C.goldD, { seed: 11, sx: -4, sy: -3, sw: 2.8 });
  shape(ctx, [[-50, -98], [-26, -118], [-14, -100], [-26, -82]], C.mustard, C.goldD, { seed: 12, sx: -4, sy: -3, sw: 2.8 });
  ell(ctx, -50, -98, 8.5, 8.5, C.gold, C.ink, 2.6);
  ctx.restore();
}
function drawBrowPair(ctx, F) { ctx.save(); ctx.translate(F.turn * 15, 0); ctx.scale(1 - Math.abs(F.turn) * .1, 1); drawBrow(ctx, -1, F.browL); drawBrow(ctx, 1, F.browR); ctx.restore(); }

// --- bel çevresi (korse/elbise kesitleri için) ---
function hwAt(y, wst, bu) {
  const P = [[-560, 80], [-505, bu + 3], [-445, wst + 5], [-362, 96], [-340, 90]];
  for (let i = 1; i < P.length; i++) if (y <= P[i][0]) { const k = (y - P[i - 1][0]) / (P[i][0] - P[i - 1][0]); return lerp(P[i - 1][1], P[i][1], sm(k)); }
  return 90;
}
function drawCorset(ctx, wst, bu, alpha, S) {
  if (alpha < .01) return;
  ctx.save(); ctx.globalAlpha = alpha;
  const cor = [[-84, -552], [-46, -566], [0, -544], [46, -566], [84, -552], [bu + 3, -505], [wst + 5, -445], [96, -362], [88, -344], [0, -336], [-88, -344], [-96, -362], [-wst - 5, -445], [-bu - 3, -505]];
  shape(ctx, cor, C.corset, C.corsetD, { seed: 21, sx: -7, sy: -4, sw: 3.2 });
  // balina kemiği çubukları
  for (const xk of [-66, -50, -34, -20, 20, 34, 50, 66]) {
    const pts = []; for (let y = -536; y <= -352; y += 14) pts.push([xk / 80 * hwAt(y, wst, bu) * .96, y]);
    line(ctx, pts, 3, C.bone); ell(ctx, pts[0][0], pts[0][1], 2.6, 2.6, C.bone, null); ell(ctx, pts[pts.length - 1][0], pts[pts.length - 1][1], 2.6, 2.6, C.bone, null);
  }
  // ön bağcık (çapraz)
  line(ctx, [[-10, -540], [-10, -352]], 2.4, C.bone); line(ctx, [[10, -540], [10, -352]], 2.4, C.bone);
  for (let y = -534; y < -356; y += 17) { line(ctx, [[-11, y], [11, y + 17]], 3, C.lacing); line(ctx, [[11, y], [-11, y + 17]], 3, C.lacing); }
  // üstte fiyonk
  shape(ctx, [[0, -548], [-22, -562], [-26, -540], [0, -548]], C.lacing, null, { sw: 2.4, seed: 22 }); shape(ctx, [[0, -548], [22, -562], [26, -540], [0, -548]], C.lacing, null, { sw: 2.4, seed: 23 });
  ctx.restore();
}
function drawArm(ctx, side, A) {
  const sx = side * 92, sy = -566, l1 = 124, l2 = 118;
  const r = ik(sx, sy, A.t[0], A.t[1], l1, l2, A.flip ?? (side > 0));
  limb(ctx, [[sx, sy], r.e, r.w], [42, 32, 25], C.lace, C.ink, 3.2, C.laceD);
  const d = [r.w[0] - r.e[0], r.w[1] - r.e[1]], dl = Math.hypot(d[0], d[1]) || 1, ux = d[0] / dl, uy = d[1] / dl;
  const hx = r.w[0] + ux * 17, hy = r.w[1] + uy * 17, rot = Math.atan2(uy, ux) - Math.PI / 2;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(rot);
  ell(ctx, 0, 0, 16, 21, C.lace, C.ink, 3);                   // eldiven
  ell(ctx, -side * 13, -3, 7, 13, C.lace, C.ink, 2.6, side * .5);  // başparmak
  ctx.restore();
  return { e: r.e, w: r.w, h: [hx, hy] };
}
function sceneOutlineClip() { }

// ===== Mary =====
// S: {x,y,s,flip, lean, headDX, headDY, headRoll, chest, waist, armL:{t:[x,y]}, armR:{t:[x,y]}, xray, xraySkirt, face, rods:[{x,y,ang,len}], dressAlpha}
function drawMary(ctx, S) {
  const F = S.face;
  ctx.save(); ctx.translate(S.x, S.y); ctx.scale(S.s * (S.flip ? -1 : 1), S.s);
  const wst = 56 * (S.waist ?? 1), bu = 80 + (S.chest || 0) * 7, X = S.xray || 0, XS = S.xraySkirt || 0;
  if (S.shadow !== false) { ctx.save(); ctx.translate(0, 8); ctx.scale(1, .13); const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 230); g.addColorStop(0, 'rgba(40,25,20,.42)'); g.addColorStop(1, 'rgba(40,25,20,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 230, 0, TAU); ctx.fill(); ctx.restore(); }
  // etek
  ctx.save(); ctx.globalAlpha = 1 - .7 * XS;
  const sk = [[-92, -352], [-104, -290], [-126, -190], [-158, -92], [-198, -8], [-110, 8], [0, 14], [110, 8], [198, -8], [158, -92], [126, -190], [104, -290], [92, -352], [0, -360]];
  shape(ctx, sk, C.gown, C.gownD, { seed: 31, sx: -16, sy: -6 });
  for (const [a, b, c] of [[-30, -330, -60], [30, -330, 60], [-60, -320, -120], [60, -320, 120], [0, -300, 0]]) line(ctx, [[a, b], [a * 1.4 + c * .2, -160], [a * 1.9 + c * .5, 0]], 2.6, C.gownD);
  for (let x = -184; x <= 184; x += 23) { const y = 14 - 22 * Math.pow(x / 198, 2) - 8; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI); ctx.fillStyle = C.lace; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = C.ink; ctx.stroke(); }
  ctx.restore();
  // üst gövde (bele dönme noktası = kalça)
  ctx.save(); ctx.translate(0, -350); ctx.rotate((S.lean || 0) * Math.PI / 180); ctx.translate(0, 350);
  // gövde (korse arkası: şeffaf modda ince gömlek rengi)
  const torso = [[-96, -580], [-90, -545], [-bu, -505], [-wst - 2, -445], [-92, -356], [0, -344], [92, -356], [wst + 2, -445], [bu, -505], [90, -545], [96, -580], [0, -592]];
  ctx.save(); ctx.globalAlpha = X > 0 ? 1 : 0; if (X > 0) shape(ctx, torso, C.chem, C.chemD, { seed: 41, sx: -8, sy: -3, sw: 3 }); ctx.restore();
  drawCorset(ctx, wst, bu, X, S);
  ctx.save(); ctx.globalAlpha = 1 - .8 * X;
  shape(ctx, torso, C.gown, C.gownD, { seed: 42, sx: -10, sy: -4 });
  // kuşak
  shape(ctx, [[-wst - 4, -458], [wst + 4, -458], [wst + 3, -428], [-wst - 3, -428]], C.mustard, C.goldD, { seed: 43, sw: 2.8, sx: -4, sy: -2 });
  ell(ctx, wst - 6, -443, 11, 11, C.gownL, C.ink, 2.6); ell(ctx, wst - 6, -443, 4.2, 4.2, C.gold, C.ink, 1.6);
  // dekolte (boyun altı ten) + dantel yaka
  shape(ctx, [[-60, -592], [60, -592], [52, -566], [0, -536], [-52, -566]], C.skin, C.skinD, { seed: 44, sw: 2.8, sx: -4, sy: -3 });
  line(ctx, [[-58, -572], [-26, -548], [0, -537], [26, -548], [58, -572]], 9, C.lace); line(ctx, [[-58, -572], [-26, -548], [0, -537], [26, -548], [58, -572]], 2.2, C.ink);
  ctx.restore();
  // çıkıntı yapan çubuklar (elbiseyi delip)
  for (const r of (S.rods || [])) {
    if (r.len < 1) continue;
    const ca = Math.cos(r.ang), sa = Math.sin(r.ang), x0 = r.x, y0 = r.y, x1 = x0 + ca * r.len, y1 = y0 + sa * r.len;
    ctx.save(); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineWidth = 4.6; ctx.strokeStyle = '#b7b0a2'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0 + ca * 3, y0 + sa * 3 - 1.2); ctx.lineTo(x1 - ca * 2, y1 - sa * 2 - 1.2); ctx.lineWidth = 1.4; ctx.strokeStyle = '#efe9dc'; ctx.stroke();
    ell(ctx, x0, y0, 9, 6, C.gownD, C.ink, 2.2, r.ang);
    ctx.restore();
  }
  // kollar
  const aL = drawArm(ctx, -1, S.armL || { t: [-112, -372] }), aR = drawArm(ctx, 1, S.armR || { t: [112, -372] });
  // baş
  ctx.save(); ctx.translate((S.headDX || 0), -714 + (S.headDY || 0)); ctx.rotate((S.headRoll || 0) * Math.PI / 180); ctx.scale(1.3, 1.3); drawHead(ctx, S); ctx.restore();
  ctx.restore();
  ctx.restore();
  return { aL, aR };
}
