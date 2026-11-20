'use strict';
// ===== Sahneler 4: s28–s02b (Paris 1889, Cadolle) =====
function eiffel(ctx, x, y, s, prog = 1, col = '#4b3a3a') {
  // y: taban; kafes kule; prog: 0..1 yukarı doğru büyür
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const H = 760 * prog, W0 = 230;
  const half = hh => W0 * Math.pow(1 - hh / 760, 1.8) * .5 + 6;          // hh: yükseklik
  const steps = Math.max(2, Math.floor(H / 40));
  ctx.lineCap = 'round';
  for (let i = 0; i <= steps; i++) { const hh = i / steps * H, w = half(hh); line(ctx, [[-w, -hh], [w, -hh]], 4, col); if (i) { const hp = (i - 1) / steps * H, wp = half(hp); line(ctx, [[-wp, -hp], [w, -hh]], 2.6, col); line(ctx, [[wp, -hp], [-w, -hh]], 2.6, col); } }
  line(ctx, [[-half(0), 0], [-half(H), -H]], 9, col); line(ctx, [[half(0), 0], [half(H), -H]], 9, col);
  if (prog > .2) { ctx.beginPath(); ctx.moveTo(-half(0) * .8, 0); ctx.quadraticCurveTo(0, -130 * prog, half(0) * .8, 0); ctx.lineWidth = 8; ctx.strokeStyle = col; ctx.stroke(); }
  if (prog > .95) line(ctx, [[0, -H], [0, -H - 50]], 5, col);
  ctx.restore();
}
function shopSet(ctx, t, o = {}) {
  ctx.fillStyle = '#d9c9a8'; ctx.fillRect(-100, -100, 2120, 1300); for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#d3c2a0' : '#decfae'; ctx.fillRect(i * 120 - 20, -100, 118, 1300); }
  // raflar ve kumaş makaraları
  for (let r = 0; r < 2; r++) { ctx.fillStyle = '#7a573b'; ctx.fillRect(-100, 250 + r * 230, 760, 18); ctx.fillRect(1560, 250 + r * 230, 560, 18); for (let i = 0; i < 4; i++) { const cl = ['#b4583a', '#e0cfa3', '#8a9a5b', '#a67c52', '#b9a7c4', '#c8a043'][(i + r * 2) % 6]; poly(ctx, [[i * 170 + 20, 250 + r * 230], [i * 170 + 150, 250 + r * 230], [i * 170 + 150, 160 + r * 230], [i * 170 + 20, 160 + r * 230]], cl, null, { sw: 3 }); ell(ctx, i * 170 + 20, 205 + r * 230, 12, 45, '#efe3c8', C.ink, 3); } for (let i = 0; i < 3; i++) { const cl = ['#e0cfa3', '#a67c52', '#8a9a5b'][(i + r) % 3]; poly(ctx, [[1600 + i * 170, 250 + r * 230], [1720 + i * 170, 250 + r * 230], [1720 + i * 170, 160 + r * 230], [1600 + i * 170, 160 + r * 230]], cl, null, { sw: 3 }); ell(ctx, 1600 + i * 170, 205 + r * 230, 12, 45, '#efe3c8', C.ink, 3); } }
  // pencere: Eyfel görünür
  if (o.window !== false) { const wx = 960, wy = 130, ww = 480, wh = 520; poly(ctx, [[wx - ww / 2, wy], [wx + ww / 2, wy], [wx + ww / 2, wy + wh], [wx - ww / 2, wy + wh]], '#f3d9b0', null, { sw: 0 });
    ctx.save(); ctx.beginPath(); ctx.rect(wx - ww / 2, wy, ww, wh); ctx.clip(); skyGrad(ctx, '#f0d6b4', '#f6e4c8', '#faf0da', wh, wy); eiffel(ctx, wx + 30, wy + wh, .5, 1, '#6a5a58'); ridge(ctx, wy + wh - 20, 40, 4.4, '#c9b98e', null); ctx.restore();
    ctx.lineWidth = 16; ctx.strokeStyle = C.woodL; ctx.strokeRect(wx - ww / 2, wy, ww, wh); ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.strokeRect(wx - ww / 2 - 8, wy - 8, ww + 16, wh + 16); line(ctx, [[wx, wy], [wx, wy + wh]], 9, C.woodL); line(ctx, [[wx - ww / 2, wy + 260], [wx + ww / 2, wy + 260]], 9, C.woodL); }
  shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 830 });
}
function tezgah(ctx) { poly(ctx, [[-100, 780], [2020, 780], [2020, 930], [-100, 930]], '#8d6a4c', '#6b4d36', { sw: 4, sx: 0, sy: -8 }); poly(ctx, [[-100, 780], [2020, 780], [2020, 820], [-100, 820]], '#a98462', null, { sw: 3 }); }
function bigScissors(ctx, x, y, s, open, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  for (const sd of [-1, 1]) { ctx.save(); ctx.rotate(sd * open); shape(ctx, [[0, 0], [-14, -150], [0, -300], [14, -150]], '#c9c2b4', '#9a9486', { sw: 4, seed: 840 + sd, sx: -4, sy: 0 }); ell(ctx, 0, 90, 36, 50, null, C.ink, 12); ell(ctx, 0, 90, 34, 48, null, '#c8a043', 7); ctx.restore(); }
  ell(ctx, 0, 0, 12, 12, '#6f6a60', C.ink, 3); ctx.restore();
}
function corsetPiece(ctx, part, o = {}) {   // part: 'full'|'top'|'bottom'; orijin: korsenin merkezi
  const w = o.w ?? 1; ctx.save();
  if (part !== 'full') { ctx.beginPath(); ctx.rect(-300, part === 'top' ? -300 : 0, 600, 300); ctx.clip(); }
  shape(ctx, [[-84, -120], [-46, -134], [0, -112], [46, -134], [84, -120], [92, -60], [70, 0], [96, 70], [88, 110], [0, 120], [-88, 110], [-96, 70], [-70, 0], [-92, -60]], C.corset, C.corsetD, { sw: 4, seed: 570, sx: -8, sy: -5 });
  for (const xk of [-62, -44, -26, 26, 44, 62]) line(ctx, [[xk, -112], [xk * .8, 100]], 4, C.bone);
  for (let y = -108; y < 100; y += 20) { line(ctx, [[-12, y], [12, y + 20]], 4, C.lacing); line(ctx, [[12, y], [-12, y + 20]], 4, C.lacing); }
  ctx.restore();
}
function corsetGuy(ctx, x, y, s, t, o = {}) {   // yüzlü, kollu korse (eski sevgili / ateşkes)
  ctx.save(); ctx.translate(x, y + Math.sin(t * 5) * 4); ctx.scale(s, s);
  for (const sd of [-1, 1]) { const arm = sd < 0 ? (o.armL || [[-90, -20], [-150, 30]]) : (o.armR || [[90, -20], [150, 30]]); line(ctx, [arm[0], arm[1]], 9, C.ink); line(ctx, [arm[0], arm[1]], 5, '#b9a985'); ell(ctx, arm[1][0], arm[1][1], 11, 11, C.corset, C.ink, 3); }
  corsetPiece(ctx, 'full');
  ell(ctx, -26, -60, 10, 12, C.white, C.ink, 3); ell(ctx, 26, -60, 10, 12, C.white, C.ink, 3); ell(ctx, -24 + (o.look || 0), -57, 5, 5, C.ink, null); ell(ctx, 28 + (o.look || 0), -57, 5, 5, C.ink, null);
  if (o.mouth === 'smirk') line(ctx, [[-18, -28], [0, -20], [20, -34]], 4, C.ink); else line(ctx, [[-16, -28], [0, -18], [16, -28]], 4, C.ink);
  ctx.restore();
}

// ---------------- s28: Yıl 1889 – Paris – Eyfel
sahneS('s28', (ctx, t) => {
  const id = 's28', b = SAH[id].bas, d = SAH[id].dur;
  ctx.save(); const z = 1 + .04 * seg(t, b, b + d); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
  skyGrad(ctx, '#d9b9a4', '#f0d2b0', '#f8e7cc', 900);
  cloudBlob(ctx, 400, 200, 1.3, '#fff', .5); cloudBlob(ctx, 1500, 150, 1.1, '#fff', .45);
  // Paris çatıları
  for (let i = 0; i < 12; i++) { const bx = i * 170 - 60, bh = 160 + hash(i * 3.1) * 120; poly(ctx, [[bx, 900], [bx + 150, 900], [bx + 150, 900 - bh], [bx, 900 - bh]], i % 2 ? '#e4d6b8' : '#d9caa8', '#bfae88', { sw: 3, sx: -6, sy: 0 }); poly(ctx, [[bx - 8, 900 - bh], [bx + 158, 900 - bh], [bx + 128, 900 - bh - 50], [bx + 22, 900 - bh - 50]], '#6f6a78', '#55505e', { sw: 3, sx: -6, sy: -3 }); for (let k = 0; k < 3; k++) rr(ctx, bx + 20 + k * 40, 900 - bh + 30, 22, 36, '#7a6a58'); }
  const rise = sm(seg(t, W(id, 'bütün') - .3, W(id, 'dikilen') + .9));
  eiffel(ctx, 960, 900, 1.25, Math.max(.02, rise));
  // kalabalık yukarı bakıyor
  const crowd = [140, 300, 460, 620, 1300, 1460, 1620, 1780];
  crowd.forEach((x, i) => { const S = actor(['lady1', 'wig1', 'lady3', 'wig2', 'lady2', 'wig1', 'lady4', 'wig2'][i], [[b, P({ headRoll: (i < 4 ? 1 : -1) * 8, f: { look: [i < 4 ? .5 : -.5, -.9], mouth: MOUTH.o, browL: [-10, -.2, .3], browR: [-10, -.2, .3], bulge: .2 } })]], t, { x, s: .5, bust: true, off: i * .7 }); S.y = 1070 + (i % 2) * 20; S.headDY += Math.sin(t * 3 + i) * 2; drawMary(ctx, S); });
  shape(ctx, [[-100, 900], [2020, 900], [2020, 1100], [-100, 1100]], '#8d7a62', '#6f5f4c', { sw: 0, seed: 850 });
  T(ctx, t, 'Yıl 1889.', 140, 200, 150, INK, W(id, 'yıl'), W(id, '1889') + .8, { fam: 'Alegreya', it: true, wt: 800, rot: -.02 });
  T(ctx, t, 'Paris.', 190, 330, 130, '#7a5c3e', W(id, 'paris') - .1, W(id, 'paris') + .5, { rot: -.02 });
  ctx.restore();
});

// ---------------- s29: küçük bir terzi dükkânı – Cadolle – makas: ortadan ikiye
sahneS('s29', (ctx, t) => {
  const id = 's29', b = SAH[id].bas, d = SAH[id].dur;
  ctx.save(); const z = 1 + .04 * seg(t, b, b + d); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
  shopSet(ctx, t);
  const tK = W(id, 'korseyi'), tY = W(id, 'yatırıyor'), tM = W(id, 'makası'), tO = W(id, 'ortadan'), tI = W(id, 'ikiye');
  const idle = P({ armL: [-96, -430], armR: [96, -430], f: { look: [1, 0], turn: .3, mouth: MOUTH.smile, browL: [-3, 0, .1], browR: [-3, 0, .1] } });
  const hello = P({ armL: [-96, -430], armR: [140, -560], headRoll: 3, f: { look: [0, 0], mouth: MOUTH.grin, browL: [-6, 0, .2], browR: [-6, 0, .2], blush: .6 } });
  const hold = P({ armL: [-60, -480], armR: [150, -520], f: { look: [0, .6], mouth: MOUTH.talk, browL: [-4, 0, .1], browR: [-4, 0, .1] } });
  const cut = P({ armL: [-60, -480], armR: [190, -500], headDY: 4, f: { look: [1, .5], mouth: { w: 14, open: .2, smile: .2, shape: '' }, lid: .15, browL: [-3, .25, 0], browR: [-3, .25, 0] } });
  const A = actor('cadolle', [[b, idle], [W(id, 'herminie') - .2, idle], [W(id, 'herminie'), hello, bk], [tK - .2, hello], [tK + .1, hold, sm], [tM - .2, hold], [tM, cut, bk], [tI + .4, hello, bk]], t, { x: 560, s: .9 });
  drawMary(ctx, A);
  tezgah(ctx);
  // korse tezgâhta
  const lay = sm(seg(t, tK, tY + .4)), cutP = sm(seg(t, tM, tI - .1)), sep = sm(seg(t, tI - .1, tI + .6));
  if (t > tK - .2) { ctx.save(); ctx.translate(lerp(560, 1100, lay), lerp(560, 760, lay)); ctx.scale(lerp(.9, 1.5, lay), lerp(.9, 1.5, lay)); ctx.rotate(lerp(.3, 0, lay));
    if (cutP < .02) corsetPiece(ctx, 'full'); else { ctx.save(); ctx.translate(-8 * sep, -34 * sep); ctx.rotate(-.05 * sep); corsetPiece(ctx, 'top'); ctx.restore(); ctx.save(); ctx.translate(8 * sep, 34 * sep); ctx.rotate(.05 * sep); corsetPiece(ctx, 'bottom'); ctx.restore(); }
    ctx.restore(); }
  // makas: sağdan sola ilerler, kesiyor
  if (t > tM - .3 && t < tI + 1.1) { const px = lerp(1330, 880, cutP), snap = Math.abs(Math.sin(t * 16)) * .32 + .02; ctx.save(); ctx.globalAlpha = 1 - seg(t, tI + .6, tI + 1.1); bigScissors(ctx, px + 30, 700, 1.0, snap, -Math.PI / 2 - .1); ctx.restore(); }
  T(ctx, t, 'Herminie Cadolle', 560, 160, 104, INK, W(id, 'herminie') - .1, W(id, 'cadolle') + .6, { align: 'center', rot: -.02 });
  if (t > W(id, 'herminie') + .1) pen(ctx, curve([560, 190], [540, 230], [560, 280], 12), seg(t, W(id, 'cadolle') + .3, W(id, 'cadolle') + .7), 6, INK, { arrow: 16 });
  T(ctx, t, 'Ortadan ikiye!', 1380, 640, 120, RED, tO - .1, tI + .5, { align: 'center', rot: -.04, shadow: 'rgba(255,245,225,.6)' });
  T(ctx, t, 'küçük bir terzi dükkânı', 1300, 110, 84, '#7a5c3e', W(id, 'küçük') - .1, W(id, 'dükkânına') + .5, { rot: .02 });
  ctx.restore();
});

// ---------------- s30: alt kısım beli sarıyor, üst kısım göğsü taşıyor – nefes isteğe bağlı olmaktan çıkıyor
sahneS('s30', (ctx, t) => {
  const id = 's30', b = SAH[id].bas, d = SAH[id].dur;
  ctx.save(); const z = 1 + .04 * seg(t, b, b + d); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
  shopSet(ctx, t, { window: false });
  const proud = P({ armL: [-96, -410], armR: [96, -410], headRoll: 3, f: { look: [1, 0], turn: .4, mouth: MOUTH.grin, browL: [-6, 0, .2], browR: [-6, 0, .2], blush: .6 } });
  const A = actor('cadolle', [[b, proud]], t, { x: 420, s: .9 }); drawMary(ctx, A);
  // manken + iki parça yerleşiyor
  const tA = W(id, 'alt'), tU = W(id, 'üst');
  dressForm(ctx, 1000, 930, 1.45);
  const mx = 1000, my = 930 - 520 * 1.45;   // manken omuz hizası
  const u1 = sm(seg(t, tA, tA + .9)), u2 = sm(seg(t, tU, tU + .9));
  ctx.save(); ctx.translate(mx, lerp(300, 930 - 360 * 1.45, u1)); ctx.scale(1.1, 1.1); ctx.translate(0, 38); corsetPiece(ctx, 'bottom'); ctx.restore();
  ctx.save(); ctx.translate(mx, lerp(300, 930 - 500 * 1.45, u2)); ctx.scale(1.1, 1.1); ctx.translate(0, -34); corsetPiece(ctx, 'top'); ctx.restore();
  T(ctx, t, 'beli sarıyor', 1500, 560, 84, INK, W(id, 'beli'), W(id, 'sarıyor') + .4, { rot: .03 }); pen(ctx, curve([1500, 580], [1380, 640], [1200, 650], 14), seg(t, W(id, 'sarıyor'), W(id, 'sarıyor') + .4), 5, INK, { arrow: 16 });
  T(ctx, t, 'göğsü taşıyor', 1500, 350, 84, INK, W(id, 'göğsü'), W(id, 'taşıyor') + .4, { rot: .03 }); pen(ctx, curve([1500, 370], [1380, 420], [1200, 440], 14), seg(t, W(id, 'taşıyor'), W(id, 'taşıyor') + .4), 5, INK, { arrow: 16 });
  // nefes almak: kutu geri dönüş (tik zorunlu'ya geçer)
  const t1 = W(id, 'nefes') - .2;
  if (t > t1) { pinnedPaper(ctx, 520, 760, 620, 300, -.02, '#f8efd9'); hand(ctx, 'nefes almak:', 270, 690, 60, INK, seg(t, t1, t1 + .4)); pen(ctx, [[280, 720], [316, 720], [316, 756], [280, 756], [280, 720]], seg(t, t1 + .3, t1 + .6), 4, INK); hand(ctx, 'zorunlu', 340, 752, 52, INK, seg(t, t1 + .3, t1 + .7)); pen(ctx, [[280, 790], [316, 790], [316, 826], [280, 826], [280, 790]], seg(t, t1 + .3, t1 + .6), 4, INK); hand(ctx, 'isteğe bağlı', 340, 822, 52, INK, seg(t, t1 + .3, t1 + .7));
    const crossed = seg(t, W(id, 'olmaktan') - .1, W(id, 'olmaktan') + .3); crossOut(ctx, 330, 790, 620, 830, crossed);
    pen(ctx, [[284, 740], [298, 756], [330, 716]], seg(t, W(id, 'çıkıyor'), W(id, 'çıkıyor') + .4), 8, '#5f6b4a'); }
  ctx.restore();
});

// ---------------- s29b: ateşkes – fişini çekmiyor
sahneS('s29b', (ctx, t) => {
  const id = 's29b', b = SAH[id].bas, d = SAH[id].dur;
  ctx.save(); const z = 1 + .04 * seg(t, b, b + d); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
  shopSet(ctx, t, { window: false });
  const tF = W(id, 'fişini'), tA = W(id, 'ateşkes'), tS = W(id, 'imzalıyor');
  const stand = P({ armL: [-96, -410], armR: [96, -410], f: { look: [1, 0], turn: .5, mouth: MOUTH.flat, browL: [-3, 0, .1], browR: [-3, 0, .1] } });
  const no = P({ armL: [-96, -410], armR: [200, -560], headRoll: -3, f: { look: [1, 0], turn: .5, mouth: MOUTH.talk, browL: [-6, .1, .2], browR: [-6, .1, .2] } });
  const sign = P({ armL: [-96, -410], armR: [180, -470], headDY: 6, f: { look: [0, .6], turn: .2, mouth: MOUTH.smile, browL: [-3, 0, .1], browR: [-3, 0, .1] } });
  const giggle = P({ armL: [-96, -410], armR: [96, -410], headRoll: 4, headDY: -6, f: { lid: .8, mouth: MOUTH.grin, blush: .9, browL: [-6, -.1, .3], browR: [-6, -.1, .3] } });
  const A = actor('cadolle', [[b, stand], [tF - .2, stand], [tF + .1, no, bk], [tA - .1, no], [tA + .2, sign, sm], [tS + .4, giggle, bk]], t, { x: 560, s: .9 }); if (t > tS + .4) A.headDY += Math.sin(t * 15) * 4; drawMary(ctx, A);
  tezgah(ctx);
  // priz + kablo + fiş (çekilmez)
  rr(ctx, 1640, 560, 80, 120, '#efe3c9'); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.strokeRect(1640, 560, 80, 120); ell(ctx, 1666, 620, 7, 7, C.ink, null); ell(ctx, 1694, 620, 7, 7, C.ink, null);
  ctx.beginPath(); ctx.moveTo(1640, 640); ctx.bezierCurveTo(1560, 700, 1480, 640, 1380, 720); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = '#8f897d'; ctx.stroke();
  // korse (eski rakip)
  corsetGuy(ctx, 1330, 880, 1.9, t, { look: t > tA ? -3 : 0, mouth: t > tA ? 'smirk' : '', armL: t > tA ? [[-90, -20], [-150, 10]] : [[-90, -20], [-150, 30]] });
  // belge + imza
  if (t > tA - .1) { const u = bk(seg(t, tA - .1, tA + .4)); ctx.save(); ctx.translate(860, 760); ctx.scale(u * 1.3, u * 1.3); rrect(ctx, -160, -50, 320, 130, 8); ctx.fillStyle = '#f8efd9'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); hand(ctx, 'ATEŞKES', 0, -4, 52, INK, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); pen(ctx, [[-120, 50], [-90, 30], [-60, 56], [-30, 36]], seg(t, tS, tS + .4), 4, INK); pen(ctx, [[20, 50], [50, 30], [80, 56], [110, 36]], seg(t, tS + .3, tS + .7), 4, INK); ctx.restore(); }
  // beyaz bayrak
  if (t > tA) { ctx.save(); ctx.translate(1000, 480); line(ctx, [[0, 200], [0, 0]], 7, C.ink); const fw = Math.sin(t * 7) * 8; poly(ctx, [[0, 0], [110, -10 + fw], [96, 24 + fw], [112, 56 + fw], [0, 60]], '#f8f1e2', '#ddd3bc', { sw: 3.2 }); ctx.restore(); }
  T(ctx, t, 'fişi çekilmez!', 1250, 220, 100, RED, tF - .1, W(id, 'çekmiyor') + .5, { align: 'center', rot: -.03 });
  ctx.restore();
});

// ---------------- s30b: üst parça ayrı satılıyor
sahneS('s30b', (ctx, t) => {
  const id = 's30b', b = SAH[id].bas, d = SAH[id].dur;
  ctx.save(); const z = 1 + .04 * seg(t, b, b + d); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
  shopSet(ctx, t, { window: false });
  tezgah(ctx);
  // takvim yaprakları dönüyor: birkaç yıl
  const yrs = ['1889', '1890', '1892', '1894', '1895'], k = clamp((t - b - .2) / 2.0), idx = Math.min(yrs.length - 1, Math.floor(k * yrs.length));
  ctx.save(); ctx.translate(300, 380); poly(ctx, [[-130, -150], [130, -150], [130, 160], [-130, 160]], '#f8efd9', '#e2d5b4', { sw: 4, sx: -6, sy: -4 }); poly(ctx, [[-130, -150], [130, -150], [130, -90], [-130, -90]], '#b4503a', null, { sw: 4 }); hand(ctx, yrs[idx], 0, 70, 90, INK, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore();
  T(ctx, t, 'birkaç yıl', 300, 640, 84, INK, W(id, 'birkaç'), W(id, 'içinde') + .4, { align: 'center', rot: -.03 });
  // vitrin: üst parça tek başına, etiketli
  dressForm(ctx, 1100, 930, 1.3); ctx.save(); ctx.translate(1100, 930 - 480 * 1.3); ctx.scale(1.0, 1.0); corsetPiece(ctx, 'top'); ctx.restore();
  const tg = W(id, 'ayrı'); const u = bk(seg(t, tg - .1, tg + .4)); ctx.save(); ctx.translate(1300, 380); ctx.rotate(-.08); ctx.scale(u, u); line(ctx, [[-90, -60], [-110, -120]], 3, C.ink); rrect(ctx, -140, -60, 280, 120, 8); ctx.fillStyle = '#f8efd9'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); hand(ctx, 'AYRI satılır', 0, 12, 60, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore();
  // müşteri
  const want = P({ armL: [-96, -410], armR: [200, -540], f: { look: [-1, 0], turn: -.4, mouth: MOUTH.grin, blush: .7, browL: [-8, -.1, .3], browR: [-8, -.1, .3] } });
  const S = actor('friendA', [[b, P({ armL: [-96, -410], armR: [96, -410], f: { look: [-1, 0], turn: -.4, mouth: MOUTH.smile } })], [W(id, 'satılmaya') - .2, want, bk]], t, { x: 1620, s: .85, flip: false }); drawMary(ctx, S);
  ctx.restore();
});

// ---------------- s29d: marka bugün hâlâ Paris'te ve ailenin elinde – Cadolle mu buldu? Olabilir.
sahneS('s29d', (ctx, t) => {
  const id = 's29d', b = SAH[id].bas, d = SAH[id].dur, tP = W(id, 'peki');
  ctx.save(); const z = 1 + .04 * seg(t, b, b + d); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
  if (t < tP - .1) {
    skyGrad(ctx, '#d9b9a4', '#f0d2b0', '#f8e7cc', 900);
    for (let i = 0; i < 12; i++) { const bx = i * 170 - 60, bh = 200 + hash(i * 3.1) * 140; poly(ctx, [[bx, 900], [bx + 150, 900], [bx + 150, 900 - bh], [bx, 900 - bh]], i % 2 ? '#e4d6b8' : '#d9caa8', '#bfae88', { sw: 3, sx: -6, sy: 0 }); poly(ctx, [[bx - 8, 900 - bh], [bx + 158, 900 - bh], [bx + 128, 900 - bh - 50], [bx + 22, 900 - bh - 50]], '#6f6a78', '#55505e', { sw: 3, sx: -6, sy: -3 }); }
    eiffel(ctx, 1500, 900, 1.0, 1); shape(ctx, [[-100, 900], [2020, 900], [2020, 1100], [-100, 1100]], '#8d7a62', '#6f5f4c', { sw: 0, seed: 860 });
    // dükkân tabelası
    const sw = Math.sin(t * 1.6) * .03; ctx.save(); ctx.translate(560, 300); ctx.rotate(sw); line(ctx, [[-180, -60], [-180, 0]], 5, C.ink); line(ctx, [[180, -60], [180, 0]], 5, C.ink); poly(ctx, [[-260, 0], [260, 0], [260, 150], [-260, 150]], '#2f2430', '#1e1620', { sw: 5, sx: -6, sy: -5 }); hand(ctx, 'Cadolle', 0, 108, 100, '#e8c870', 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 }); ctx.restore();
    T(ctx, t, 'bugün hâlâ Paris\'te', 560, 560, 100, INK, W(id, 'bugün') - .1, W(id, 'pariste') + .5, { align: 'center', rot: -.02 });
    // üç kuşak (aile)
    const fam = [['lady2', 1010, .55, 'ailesinin'], ['cadolle', 1180, .6, 'ailesinin'], ['friendC', 1350, .5, 'elinde']];
    fam.forEach(([lk, x, s, kw], i) => { const u = bk(seg(t, W(id, 'ailesinin') + i * .2, W(id, 'ailesinin') + .5 + i * .2)); if (u <= 0) return; ctx.save(); ctx.translate(x, 700); ctx.scale(u, u); ell(ctx, 0, 0, 70, 90, C.gold, C.ink, 4); ell(ctx, 0, 0, 58, 78, '#d8c5a2', C.ink, 3); ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 56, 76, 0, 0, TAU); ctx.clip(); const S = actor(lk, [[b, P({ f: { mouth: MOUTH.smile, look: [0, 0], blush: .5 } })]], t, { x: 0, s: s * .8, bust: true, off: i }); S.y = 80 + 714 * s * .8 - 40; drawMary(ctx, S); ctx.restore(); ctx.restore(); });
    T(ctx, t, 'hâlâ ailesinin elinde', 1180, 860, 84, INK, W(id, 'ailesinin'), W(id, 'elinde') + .4, { align: 'center', rot: -.02 });
  } else {
    plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 861 });
    const think = P({ armL: [-96, -410], armR: [40, -520], headRoll: -4, f: { look: [.8, -.3], mouth: MOUTH.flat, browL: [-6, -.1, .3], browR: [-10, -.3, .4], lid: .1 } });
    const maybe = P({ armL: [-190, -470], armR: [190, -470], headRoll: 6, f: { look: [0, -.2], mouth: MOUTH.grin, lid: .3, browL: [-8, -.1, .3], browR: [-8, .1, .3], blush: .6 } });
    const A = actor('cadolle', [[tP - .1, think], [W(id, 'olabilir') - .2, think], [W(id, 'olabilir') + .1, maybe, bk]], t, { x: 760, s: 1.0 }); drawMary(ctx, A);
    T(ctx, t, 'Peki sütyeni', 1180, 360, 96, INK, tP, W(id, 'sütyeni') + .5, { rot: -.02 }); T(ctx, t, 'Cadolle mu buldu?', 1180, 470, 110, RED, W(id, 'cadolle') - .1, W(id, 'buldu') + .5, { rot: -.02 });
    T(ctx, t, 'Olabilir…', 1300, 700, 130, '#5f6b4a', W(id, 'olabilir'), W(id, 'olabilir') + .6, { rot: -.03 });
  }
  ctx.restore();
});

// ---------------- s02b: patentli modern sütyen deyince akla başka bir isim… Senin adın.
sahneS('s02b', (ctx, t) => {
  const id = 's02b', b = SAH[id].bas, d = SAH[id].dur, tN = W(id, 'senin');
  plainBG(ctx, '#efe3c9', '#d9c7a0');
  pinnedPaper(ctx, 960, 190, 1500, 230, -.01, '#f8efd9');
  T(ctx, t, '"patentli modern sütyen"', 960, 225, 110, INK, W(id, 'patentli') - .1, W(id, 'sütyen') + .6, { align: 'center', rot: -.01 });
  // sahne ışığı + Mary silüeti → belirir
  const lit = sm(seg(t, tN - .3, tN + .5));
  ctx.save(); const g = ctx.createRadialGradient(960, 700, 40, 960, 700, 560); g.addColorStop(0, 'rgba(255,236,180,.8)'); g.addColorStop(1, 'rgba(255,236,180,0)'); ctx.fillStyle = g; ctx.fillRect(300, 300, 1320, 800); ctx.restore();
  shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 870 });
  const self = P({ armL: [-96, -410], armR: [30, -520], headRoll: -4, f: { look: [0, 0], mouth: MOUTH.grin, browL: [-12, -.2, .35], browR: [-12, -.2, .35], blush: .8, bulge: .3 } });
  const wonder = P({ armL: [-96, -410], armR: [96, -410], f: { look: [0, 0], mouth: MOUTH.smile, browL: [-4, 0, .2], browR: [-4, 0, .2] } });
  const S = actor('mary', [[b, wonder], [tN - .2, wonder], [tN + .2, self, bk]], t, { x: 960, y: 0, s: .82 });
  ctx.save(); drawMary(ctx, S); ctx.globalAlpha = 1 - lit; ctx.fillStyle = '#3a2c24'; ctx.restore();
  if (lit < 1) { ctx.save(); ctx.globalCompositeOperation = 'source-atop'; ctx.restore(); }
  T(ctx, t, 'Senin adın.', 960, 1010, 130, RED, tN, W(id, 'adın') + .5, { align: 'center', rot: -.02 });
});
