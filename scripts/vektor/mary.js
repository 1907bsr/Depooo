'use strict';
// ===== Karakter: kadın/erkek, parça parça hareket eden kod çizimi =====
// Yerel koordinat: orijin = ayakların yere bastığı orta nokta; y yukarı = eksi. Boy ≈ 850.
// Görünüm (palet, saç, aksesuar, gövde) LOOK tablosundan gelir; S.look = ad ya da nesne.
const LOOK = {};
LOOK.mary = {
  skin: '#ecc5a4', skinD: '#d3a07f', lip: '#b2575a', blushC: '#df8f7a',
  hair: '#5a382b', hairD: '#3a2219', hairL: '#7b523e', hairStyle: 'pouf', browC: null,
  gown: '#c9918a', gownD: '#a87068', gownL: '#dcb0a6',
  sleeve: '#f3e9d3', sleeveD: '#dccfb4', hand: '#f3e9d3', trim: '#f3e9d3',
  sash: '#c8a043', sashD: '#a07f33', sashOn: true,
  acc: 'bow', accC: '#c8a043', accD: '#a07f33',
  male: false, skirt: 'bell', neck: 'scoop', hem: 'scallop', apron: false, glasses: false, moustache: '', beard: '',
  legs: false, trou: '#4b433c', shoes: '#2b1d1f', stock: '#e9dbc6', tie: '#8a2f2c',
  earrings: true, lash: true, browW: 7.5, head: 1.3, jaw: 0
};
function mk(name, o) { LOOK[name] = Object.assign({}, LOOK.mary, o); return LOOK[name]; }
let LK = LOOK.mary;
const epts = (cx, cy, rx, ry, n = 10) => Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * TAU) * rx, cy + Math.sin(i / n * TAU) * ry]);

function faceDef() {
  return { blink: 0, lid: 0, look: [0, 0], rollAmt: 0, roll: .5, bulge: 0, browL: [0, 0, .12], browR: [0, 0, .12],
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
    ctx.fillStyle = LK.skin; ctx.fill(); ctx.lineWidth = 3.6; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 1.06, Math.PI * 1.94); ctx.lineWidth = LK.lash ? 4.6 : 3.6; ctx.strokeStyle = C.ink; ctx.lineCap = 'round'; ctx.stroke();
  if (LK.lash) { ctx.beginPath(); ctx.moveTo(side * (rx - 1), -6); ctx.lineTo(side * (rx + 8), -12); ctx.lineWidth = 3.6; ctx.stroke(); }
  ctx.restore();
}
function drawBrow(ctx, side, b) {
  const cx = side * 25, cy = -33 + b[0], L = 18, a = b[1];
  const inner = [cx - side * L * Math.cos(a), cy + L * Math.sin(a)], outer = [cx + side * L * Math.cos(a), cy - L * Math.sin(a)];
  const mid = [(inner[0] + outer[0]) / 2, (inner[1] + outer[1]) / 2 - b[2] * 22];
  ctx.save(); ctx.beginPath(); ctx.moveTo(inner[0], inner[1]); ctx.quadraticCurveTo(mid[0], mid[1], outer[0], outer[1]);
  ctx.lineWidth = LK.browW; ctx.strokeStyle = LK.browC || LK.hairD; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
}
function drawMouth(ctx, M) {
  const w = M.w, o = M.open, s = M.smile;
  ctx.save(); ctx.translate(0, 41);
  if (M.shape === 'o') {
    ell(ctx, 0, 6, w * .62, 7 + o * 12, C.cavity, LK.lip, 3.4);
  } else if (o < .06) {
    ctx.beginPath(); ctx.moveTo(-w, -s * 5); ctx.quadraticCurveTo(0, s * 13, w, -s * 5);
    ctx.lineWidth = 4; ctx.strokeStyle = LK.lip; ctx.lineCap = 'round'; ctx.stroke();
    if (s > .35) { line(ctx, [[-w - 3, -s * 5 - 3], [-w - 1, -s * 5 + 2]], 2.6, LK.skinD); line(ctx, [[w + 3, -s * 5 - 3], [w + 1, -s * 5 + 2]], 2.6, LK.skinD); }
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
    ctx.lineWidth = 3.6; ctx.strokeStyle = LK.lip; ctx.lineJoin = 'round'; ctx.stroke();
  }
  ctx.restore();
}
function drawGlasses(ctx) {
  ctx.save(); ctx.lineWidth = 4; ctx.strokeStyle = '#3b2a22';
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * 24, 2, 23, 22, 0, 0, TAU); ctx.stroke(); }
  line(ctx, [[-1, -2], [1, -2]], 4, '#3b2a22'); line(ctx, [[-47, 0], [-58, -4]], 3.4, '#3b2a22'); line(ctx, [[47, 0], [58, -4]], 3.4, '#3b2a22');
  ctx.restore();
}
function drawMoustache(ctx, kind) {
  const c = LK.hairD;
  if (kind === 'handlebar') {
    for (const sd of [-1, 1]) shape(ctx, [[0, 30], [sd * 14, 25], [sd * 34, 27], [sd * 52, 20], [sd * 58, 8], [sd * 50, 14], [sd * 34, 36], [sd * 12, 38]], c, null, { sw: 2.4, seed: 90 + sd });
  } else if (kind === 'small') {
    shape(ctx, [[-24, 31], [-8, 27], [0, 30], [8, 27], [24, 31], [14, 37], [0, 35], [-14, 37]], c, null, { sw: 2.2, seed: 92 });
  } else if (kind === 'thick') {
    shape(ctx, [[-34, 33], [-14, 25], [0, 29], [14, 25], [34, 33], [26, 40], [0, 36], [-26, 40]], c, null, { sw: 2.4, seed: 93 });
  }
}

// ---- saç ----
function hairBack(ctx) {
  const L = LK, st = L.hairStyle;
  if (st === 'pouf') shape(ctx, [[0, -106], [44, -100], [78, -72], [86, -30], [76, 8], [62, 42], [40, 68], [0, 72], [-40, 68], [-62, 42], [-76, 8], [-86, -30], [-78, -72], [-44, -100]], L.hair, L.hairD, { seed: 3, sx: -8, sy: -6 });
  else if (st === 'bun') { shape(ctx, [[0, -92], [40, -86], [66, -56], [72, -10], [62, 30], [40, 56], [0, 60], [-40, 56], [-62, 30], [-72, -10], [-66, -56], [-40, -86]], L.hair, L.hairD, { seed: 3, sx: -8, sy: -6 }); shape(ctx, epts(0, -106, 30, 24), L.hair, L.hairD, { seed: 4, sx: -5, sy: -4 }); }
  else if (st === 'bob') shape(ctx, [[0, -98], [48, -92], [76, -60], [82, -10], [80, 40], [70, 66], [44, 72], [0, 62], [-44, 72], [-70, 66], [-80, 40], [-82, -10], [-76, -60], [-48, -92]], L.hair, L.hairD, { seed: 3, sx: -8, sy: -6 });
  else if (st === 'beehive') shape(ctx, [[0, -150], [46, -140], [78, -100], [86, -40], [78, 10], [64, 40], [0, 52], [-64, 40], [-78, 10], [-86, -40], [-78, -100], [-46, -140]], L.hair, L.hairD, { seed: 3, sx: -8, sy: -6 });
  else if (st === 'long') shape(ctx, [[0, -98], [48, -92], [78, -60], [84, -10], [86, 60], [80, 130], [50, 160], [0, 150], [-50, 160], [-80, 130], [-86, 60], [-84, -10], [-78, -60], [-48, -92]], L.hair, L.hairD, { seed: 3, sx: -8, sy: -6 });
  else if (st === 'wig') {
    shape(ctx, [[0, -112], [56, -102], [92, -62], [102, 0], [98, 52], [86, 90], [50, 98], [0, 72], [-50, 98], [-86, 90], [-98, 52], [-102, 0], [-92, -62], [-56, -102]], L.hair, L.hairD, { seed: 3, sx: -8, sy: -6 });
    for (const sd of [-1, 1]) for (const yy of [8, 44]) ell(ctx, sd * 86, yy, 20, 13, L.hair, C.ink, 2.6);
  }
}
function hairFront(ctx) {
  const L = LK, st = L.hairStyle;
  const part = (pts, seed) => shape(ctx, pts, L.hair, L.hairD, { seed, sx: -7, sy: -5 });
  if (st === 'pouf' || st === 'beehive') {
    const top = st === 'beehive' ? 130 : 102;
    part([[-70, 18], [-80, -34], [-56, -88], [0, -top], [56, -88], [80, -34], [70, 18], [60, -8], [50, -34], [30, -54], [0, -50], [-30, -54], [-50, -34], [-60, -8]], 7);
    line(ctx, [[0, -50], [-20, -76], [-48, -88]], 2.6, L.hairL); line(ctx, [[0, -50], [-28, -66], [-62, -60]], 2.6, L.hairL);
    line(ctx, [[0, -50], [20, -76], [48, -88]], 2.6, L.hairL); line(ctx, [[0, -50], [28, -66], [62, -60]], 2.6, L.hairL);
  } else if (st === 'bun') {
    part([[-64, 20], [-74, -30], [-52, -80], [0, -94], [52, -80], [74, -30], [64, 20], [56, -6], [46, -34], [28, -54], [0, -50], [-28, -54], [-46, -34], [-56, -6]], 7);
    line(ctx, [[0, -50], [-24, -72], [-46, -78]], 2.4, L.hairL); line(ctx, [[0, -50], [24, -72], [46, -78]], 2.4, L.hairL);
  } else if (st === 'bob') {
    part([[-66, 20], [-76, -30], [-52, -84], [0, -98], [52, -84], [76, -30], [66, 20], [54, -6], [44, -30], [30, -42], [0, -44], [-30, -42], [-44, -30], [-54, -6]], 7);
  } else if (st === 'long') {
    part([[-66, 20], [-76, -30], [-52, -84], [0, -98], [52, -84], [76, -30], [66, 20], [56, -4], [46, -32], [24, -52], [0, -46], [-24, -52], [-46, -32], [-56, -4]], 7);
  } else if (st === 'short') {
    part([[-62, -4], [-66, -44], [-44, -84], [0, -96], [44, -84], [66, -44], [62, -4], [56, -32], [42, -54], [8, -62], [-22, -60], [-46, -46], [-56, -28]], 7);
    line(ctx, [[8, -62], [-6, -80], [-30, -88]], 2.4, L.hairL);
  } else if (st === 'wig') {
    part([[-70, -20], [-72, -60], [-40, -94], [0, -106], [40, -94], [72, -60], [70, -20], [54, -42], [26, -64], [0, -60], [-26, -64], [-54, -42]], 7);
    for (const k of [-2, -1, 0, 1, 2]) line(ctx, [[k * 22, -100], [k * 24, -70]], 2.2, L.hairL);
  }
}
function accessory(ctx) {
  const L = LK, a = L.acc;
  if (a === 'bow') {
    shape(ctx, [[-50, -98], [-76, -116], [-88, -98], [-78, -80]], L.accC, L.accD, { seed: 11, sx: -4, sy: -3, sw: 2.8 });
    shape(ctx, [[-50, -98], [-26, -118], [-14, -100], [-26, -82]], L.accC, L.accD, { seed: 12, sx: -4, sy: -3, sw: 2.8 });
    ell(ctx, -50, -98, 8.5, 8.5, L.sash, C.ink, 2.6);
  } else if (a === 'cap') {
    shape(ctx, [[-60, -50], [-54, -86], [-28, -106], [0, -112], [28, -106], [54, -86], [60, -50], [44, -66], [0, -72], [-44, -66]], '#f6f0e2', '#ddd3bc', { seed: 13, sx: -5, sy: -4, sw: 2.8 });
    for (let i = -3; i <= 3; i++) ell(ctx, i * 14, -68 + Math.abs(i) * 1.4, 8, 6, '#f6f0e2', C.ink, 2);
  } else if (a === 'cloche') {
    shape(ctx, [[-74, -8], [-72, -60], [-42, -96], [0, -108], [42, -96], [72, -60], [74, -8], [62, -26], [0, -36], [-62, -26]], L.accC, L.accD, { seed: 14, sx: -6, sy: -5, sw: 3 });
    line(ctx, [[-70, -30], [0, -40], [70, -30]], 9, L.sash);
  } else if (a === 'police') {
    shape(ctx, [[-64, -42], [-58, -88], [0, -98], [58, -88], [64, -42], [0, -34]], L.accC, L.accD, { seed: 15, sx: -5, sy: -4, sw: 3 });
    shape(ctx, [[-60, -44], [60, -44], [52, -30], [-52, -30]], '#24211f', null, { sw: 2.6, seed: 16 });
    ell(ctx, 0, -66, 11, 11, L.sash, C.ink, 2.4);
  } else if (a === 'hardhat') {
    shape(ctx, [[-66, -40], [-60, -84], [-30, -108], [0, -114], [30, -108], [60, -84], [66, -40]], L.accC, L.accD, { seed: 17, sx: -6, sy: -5, sw: 3 });
    shape(ctx, [[-86, -38], [86, -38], [80, -26], [-80, -26]], L.accC, L.accD, { seed: 18, sx: -4, sy: -3, sw: 3 }); line(ctx, [[0, -112], [0, -44]], 6, L.accD);
  } else if (a === 'headband') {
    line(ctx, [[-70, -20], [-66, -66], [-40, -88], [0, -96], [40, -88], [66, -66], [70, -20]], 9, L.accC);
  }
}

// ---- gövde yardımcıları ----
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
  for (const xk of [-66, -50, -34, -20, 20, 34, 50, 66]) {
    const pts = []; for (let y = -536; y <= -352; y += 14) pts.push([xk / 80 * hwAt(y, wst, bu) * .96, y]);
    line(ctx, pts, 3, C.bone); ell(ctx, pts[0][0], pts[0][1], 2.6, 2.6, C.bone, null); ell(ctx, pts[pts.length - 1][0], pts[pts.length - 1][1], 2.6, 2.6, C.bone, null);
  }
  line(ctx, [[-10, -540], [-10, -352]], 2.4, C.bone); line(ctx, [[10, -540], [10, -352]], 2.4, C.bone);
  for (let y = -534; y < -356; y += 17) { line(ctx, [[-11, y], [11, y + 17]], 3, C.lacing); line(ctx, [[11, y], [-11, y + 17]], 3, C.lacing); }
  shape(ctx, [[0, -548], [-22, -562], [-26, -540], [0, -548]], C.lacing, null, { sw: 2.4, seed: 22 }); shape(ctx, [[0, -548], [22, -562], [26, -540], [0, -548]], C.lacing, null, { sw: 2.4, seed: 23 });
  ctx.restore();
}
function drawArm(ctx, side, A) {
  const sx = side * (LK.male ? 108 : 92), sy = -566, l1 = 124, l2 = 118;
  const fl = A.flip ?? (side > 0), r1 = ik(sx, sy, A.t[0], A.t[1], l1, l2, fl);
  // El omuz hizasının üstüne çıkınca dirsek yukarı bakıp kol ters görünüyordu (Büşra, 2026-11-20): dirsek aşağı/dışarı bakan çözüme yumuşakça geçer.
  const rise = clamp((sy - A.t[1] + 10) / 60, 0, 1), wg = rise * rise * (3 - 2 * rise);
  let r = r1;
  if (wg > 0) { const r2 = ik(sx, sy, A.t[0], A.t[1], l1, l2, !fl), ex = lerp(r1.e[0], r2.e[0], wg), ey = lerp(r1.e[1], r2.e[1], wg), wa = Math.atan2(A.t[1] - ey, A.t[0] - ex); r = { e: [ex, ey], w: [ex + Math.cos(wa) * l2, ey + Math.sin(wa) * l2] }; }
  const slv = LK.male ? LK.gown : LK.sleeve, slvD = LK.male ? LK.gownD : LK.sleeveD, hc = LK.male ? LK.skin : LK.hand;
  limb(ctx, [[sx, sy], r.e, r.w], [LK.male ? 48 : 42, LK.male ? 38 : 32, LK.male ? 30 : 25], slv, C.ink, 3.2, slvD);
  if (LK.male) { ell(ctx, r.w[0], r.w[1], 17, 17, '#f4efe3', C.ink, 2.6); }
  const d = [r.w[0] - r.e[0], r.w[1] - r.e[1]], dl = Math.hypot(d[0], d[1]) || 1, ux = d[0] / dl, uy = d[1] / dl;
  const hx = r.w[0] + ux * 17, hy = r.w[1] + uy * 17, rot = Math.atan2(uy, ux) - Math.PI / 2;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(rot);
  ell(ctx, 0, 0, 16, 21, hc, C.ink, 3);
  ell(ctx, -side * 13, -3, 7, 13, hc, C.ink, 2.6, side * .5);
  if (A.hold) A.hold(ctx, side);
  ctx.restore();
  return { e: r.e, w: r.w, h: [hx, hy] };
}
function drawLegs(ctx, S) {
  const L = LK; const sw = S.stride || 0;
  for (const sd of [-1, 1]) {
    const ph = sd * sw, top = [sd * 40, -352], knee = [sd * 42 + ph * 14, -190], foot = [sd * 46 + ph * 26, -22];
    const col = L.male ? L.trou : (L.stock || L.skin);
    limb(ctx, [top, knee, foot], L.male ? [66, 54, 44] : [44, 34, 28], col, C.ink, 3, null);
    ell(ctx, foot[0] + sd * 6, foot[1] + 10, 28, 13, L.shoes, C.ink, 2.6);
  }
}
const SKIRTS = {
  bell: [[-92, -352], [-104, -290], [-126, -190], [-158, -92], [-198, -8], [-110, 8], [0, 14], [110, 8], [198, -8], [158, -92], [126, -190], [104, -290], [92, -352], [0, -360]],
  straight: [[-92, -352], [-102, -250], [-112, -120], [-122, -6], [-60, 8], [0, 12], [60, 8], [122, -6], [112, -120], [102, -250], [92, -352], [0, -360]],
  mid: [[-92, -352], [-104, -300], [-118, -220], [-130, -150], [-60, -142], [0, -140], [60, -142], [130, -150], [118, -220], [104, -300], [92, -352], [0, -360]]
};

// ===== Karakter çizimi =====
// S: {x,y,s,flip, look, lean, headDX, headDY, headRoll, chest, waist, armL:{t,flip,hold}, armR, xray, xraySkirt, face, rods:[{x,y,ang,len}], stride, bust}
function drawMary(ctx, S) {
  LK = typeof S.look === 'string' ? LOOK[S.look] : (S.look || LOOK.mary); const L = LK;
  const F = S.face;
  ctx.save(); ctx.translate(S.x, S.y); ctx.scale(S.s * (S.flip ? -1 : 1), S.s);
  const male = L.male, wst = 56 * (S.waist ?? 1), bu = 80 + (S.chest || 0) * 7, X = S.xray || 0, XS = S.xraySkirt || 0;
  if (S.shadow !== false && !S.bust) { ctx.save(); ctx.translate(0, 8); ctx.scale(1, .13); const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 230); g.addColorStop(0, 'rgba(40,25,20,.42)'); g.addColorStop(1, 'rgba(40,25,20,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 230, 0, TAU); ctx.fill(); ctx.restore(); }
  // bacaklar + etek
  if ((L.legs || male) && !S.bust) drawLegs(ctx, S);
  if (!male && !S.bust) {
    ctx.save(); ctx.globalAlpha = 1 - .7 * XS;
    const sk = SKIRTS[L.skirt] || SKIRTS.bell;
    shape(ctx, sk, L.gown, L.gownD, { seed: 31, sx: -16, sy: -6 });
    if (L.skirt === 'bell') for (const [a, b, c] of [[-30, -330, -60], [30, -330, 60], [-60, -320, -120], [60, -320, 120], [0, -300, 0]]) line(ctx, [[a, b], [a * 1.4 + c * .2, -160], [a * 1.9 + c * .5, 0]], 2.6, L.gownD);
    else if (L.skirt === 'straight') for (const a of [-40, 0, 40]) line(ctx, [[a, -330], [a * 1.3, -160], [a * 1.5, -10]], 2.4, L.gownD);
    if (L.hem === 'scallop' && L.skirt === 'bell') for (let x = -184; x <= 184; x += 23) { const y = 14 - 22 * Math.pow(x / 198, 2) - 8; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI); ctx.fillStyle = L.trim; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = C.ink; ctx.stroke(); }
    ctx.restore();
  }
  // üst gövde (bele dönme noktası = kalça)
  ctx.save(); ctx.translate(0, -350); ctx.rotate((S.lean || 0) * Math.PI / 180); ctx.translate(0, 350);
  if (male) {
    const tp = [[-112, -578], [-106, -500], [-100, -420], [-98, -350], [0, -340], [98, -350], [100, -420], [106, -500], [112, -578], [0, -592]];
    shape(ctx, tp, L.gown, L.gownD, { seed: 42, sx: -10, sy: -4 });
    shape(ctx, [[-34, -590], [34, -590], [8, -470], [-8, -470]], '#f4efe3', '#ddd3bc', { sw: 2.6, seed: 43, sx: -3, sy: -2 });
    shape(ctx, [[-9, -580], [9, -580], [16, -480], [0, -452], [-16, -480]], L.tie, null, { sw: 2.6, seed: 44 });
    line(ctx, [[-34, -590], [-6, -470], [-40, -400]], 2.6, L.gownD); line(ctx, [[34, -590], [6, -470], [40, -400]], 2.6, L.gownD);
    for (const yy of [-440, -400]) ell(ctx, 0, yy, 4, 4, L.gownD, C.ink, 1.6);
  } else if (!S.bust || true) {
    const torso = [[-96, -580], [-90, -545], [-bu, -505], [-wst - 2, -445], [-92, -356], [0, -344], [92, -356], [wst + 2, -445], [bu, -505], [90, -545], [96, -580], [0, -592]];
    ctx.save(); ctx.globalAlpha = X > 0 ? 1 : 0; if (X > 0) shape(ctx, torso, C.chem, C.chemD, { seed: 41, sx: -8, sy: -3, sw: 3 }); ctx.restore();
    drawCorset(ctx, wst, bu, X, S);
    ctx.save(); ctx.globalAlpha = 1 - .8 * X;
    shape(ctx, torso, L.gown, L.gownD, { seed: 42, sx: -10, sy: -4 });
    if (L.sashOn) {
      shape(ctx, [[-wst - 4, -458], [wst + 4, -458], [wst + 3, -428], [-wst - 3, -428]], L.sash, L.sashD, { seed: 43, sw: 2.8, sx: -4, sy: -2 });
      ell(ctx, wst - 6, -443, 11, 11, L.gownL, C.ink, 2.6); ell(ctx, wst - 6, -443, 4.2, 4.2, L.accC, C.ink, 1.6);
    }
    if (L.neck === 'scoop') {
      shape(ctx, [[-60, -592], [60, -592], [52, -566], [0, -536], [-52, -566]], L.skin, L.skinD, { seed: 44, sw: 2.8, sx: -4, sy: -3 });
      line(ctx, [[-58, -572], [-26, -548], [0, -537], [26, -548], [58, -572]], 9, L.trim); line(ctx, [[-58, -572], [-26, -548], [0, -537], [26, -548], [58, -572]], 2.2, C.ink);
    } else if (L.neck === 'collar') {
      shape(ctx, [[-34, -596], [34, -596], [40, -566], [0, -548], [-40, -566]], L.trim, null, { sw: 2.8, seed: 45 });
    }
    if (L.apron) {
      shape(ctx, [[-48, -548], [48, -548], [58, -440], [-58, -440]], '#f6f0e2', '#ddd3bc', { seed: 46, sw: 2.8, sx: -4, sy: -3 });
      line(ctx, [[-48, -548], [-92, -570]], 6, '#f6f0e2'); line(ctx, [[48, -548], [92, -570]], 6, '#f6f0e2');
    }
    ctx.restore();
  }
  if (S.torsoFx) S.torsoFx(ctx, L);
  // çıkıntı yapan çubuklar
  for (const r of (S.rods || [])) {
    if (r.len < 1) continue;
    const ca = Math.cos(r.ang), sa = Math.sin(r.ang), x0 = r.x, y0 = r.y, x1 = x0 + ca * r.len, y1 = y0 + sa * r.len;
    ctx.save(); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineWidth = 4.6; ctx.strokeStyle = '#b7b0a2'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0 + ca * 3, y0 + sa * 3 - 1.2); ctx.lineTo(x1 - ca * 2, y1 - sa * 2 - 1.2); ctx.lineWidth = 1.4; ctx.strokeStyle = '#efe9dc'; ctx.stroke();
    ell(ctx, x0, y0, 9, 6, L.gownD, C.ink, 2.2, r.ang);
    ctx.restore();
  }
  // önlük hem gövdeye hem etek kısmına (etek önlüğü kollardan önce)
  if (L.apron && !male && !S.bust) { shape(ctx, [[-62, -440], [62, -440], [96, -40], [-96, -40]], '#f6f0e2', '#ddd3bc', { seed: 47, sw: 2.8, sx: -6, sy: -2 }); line(ctx, [[-70, -440], [70, -440]], 7, '#ece4d2'); }
  // kollar
  const aL = drawArm(ctx, -1, S.armL || { t: [-112, -372] }), aR = drawArm(ctx, 1, S.armR || { t: [112, -372] });
  // baş
  ctx.save(); ctx.translate((S.headDX || 0), -714 + (S.headDY || 0)); ctx.rotate((S.headRoll || 0) * Math.PI / 180); ctx.scale(L.head, L.head); drawHead(ctx, S); ctx.restore();
  ctx.restore();
  ctx.restore();
  return { aL, aR };
}
function drawHead(ctx, S) {
  const F = S.face, pf = F.puff || 0, L = LK;
  ctx.save();
  hairBack(ctx);
  ell(ctx, -56, 6, 7, 11, L.skin, C.ink, 2.5); ell(ctx, 56, 6, 7, 11, L.skin, C.ink, 2.5);
  shape(ctx, [[-17, 40], [17, 40], [20, 100], [-20, 100]], L.skin, L.skinD, { sw: 3, seed: 5, sx: -6, sy: 0 });
  if (L.neck === 'm') {   // gömlek yakası + kravat düğümü
    shape(ctx, [[-22, 86], [0, 96], [-6, 118], [-34, 106]], '#f4efe3', '#ddd3bc', { sw: 2.4, seed: 6, sx: -2, sy: -2 });
    shape(ctx, [[22, 86], [0, 96], [6, 118], [34, 106]], '#f4efe3', '#ddd3bc', { sw: 2.4, seed: 7, sx: -2, sy: -2 });
    shape(ctx, [[-8, 94], [8, 94], [9, 108], [-9, 108]], L.tie, null, { sw: 2.2, seed: 8 });
  }
  const j = L.jaw;
  shape(ctx, [[0, -66], [34 + j * 3, -60], [55 + 5 * pf + j * 2, -16], [50 + 18 * pf + j * 5, 22], [35 + 10 * pf + j * 9, 54], [0, 67 + j * 2], [-35 - 10 * pf - j * 9, 54], [-50 - 18 * pf - j * 5, 22], [-55 - 5 * pf - j * 2, -16], [-34 - j * 3, -60]], L.skin, L.skinD, { seed: 1, sx: -7, sy: -4, sw: 3.4 });
  ctx.save(); ctx.translate(F.turn * 15, 0); ctx.scale(1 - Math.abs(F.turn) * .1, 1);
  ctx.globalAlpha = .55 * F.blush * (L.male ? .5 : 1); ell(ctx, -37 - 8 * pf, 24, 13, 8, L.blushC, null); ell(ctx, 37 + 8 * pf, 24, 13, 8, L.blushC, null); ctx.globalAlpha = 1;
  drawEye(ctx, -1, F); drawEye(ctx, 1, F);
  if ((F.tears || 0) > .02) { const k = F.tears; for (const sd of [-1, 1]) { const x0 = sd * 25, pts = [[x0, 20], [x0 + sd * 5, 34 + k * 26], [x0 + sd * 9, 40 + k * 48]]; line(ctx, pts, 11, C.ink); line(ctx, pts, 7, '#f6f1e6'); } }
  line(ctx, [[1, 13], [5, 21], [0, 24]], 3, '#b5805f');
  if (L.moustache) drawMoustache(ctx, L.moustache);
  drawMouth(ctx, F.mouth);
  if (L.beard) shape(ctx, [[-44, 40], [-30, 70], [0, 92], [30, 70], [44, 40], [30, 56], [0, 62], [-30, 56]], L.hairD, null, { sw: 2.4, seed: 95 });
  if (L.glasses) drawGlasses(ctx);
  if (F.sweat > .02) { const sy = -46 + F.sweat * 26; ctx.save(); ctx.globalAlpha = clamp(F.sweat * 3); ctx.beginPath(); ctx.moveTo(44, sy - 12); ctx.quadraticCurveTo(54, sy + 4, 44, sy + 8); ctx.quadraticCurveTo(34, sy + 4, 44, sy - 12); ctx.fillStyle = '#f6efe2'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore(); }
  ctx.restore();
  hairFront(ctx);
  drawBrowPair(ctx, F);
  if (L.earrings) { ell(ctx, -55, 32, 5.5, 5.5, C.lace, C.ink, 2); ell(ctx, 55, 32, 5.5, 5.5, C.lace, C.ink, 2); }
  accessory(ctx);
  ctx.restore();
}
function drawBrowPair(ctx, F) { ctx.save(); ctx.translate(F.turn * 15, 0); ctx.scale(1 - Math.abs(F.turn) * .1, 1); drawBrow(ctx, -1, F.browL); drawBrow(ctx, 1, F.browR); ctx.restore(); }
