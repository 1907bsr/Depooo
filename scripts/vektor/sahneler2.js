'use strict';
// ===== Sahneler 2: s14–s20 (mozaik, harita, villa, korse oyunları, 300 yıl) =====
// ---- mozaik motoru: vektör çizim küçük bir tuvale yapılır, her piksel bir taş (palete oturtulur)
const MPAL = ['#efe3c6', '#e0cfa3', '#c8a96e', '#a67c52', '#6e4a32', '#b4583a', '#8a9a5b', '#33261c', '#f6ecd4', '#c98a5a'].map(h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
function mpal(r, g, b) { let best = 0, bd = 1e9; for (let i = 0; i < MPAL.length; i++) { const [R, G, B] = MPAL[i], d = (R - r) ** 2 + (G - g) ** 2 + (B - b) ** 2; if (d < bd) { bd = d; best = i; } } return MPAL[best]; }
function mosaicDraw(ctx, x, y, cols, rows, tile, fn) {
  let oc = mosaicDraw.oc; if (!oc || oc.width !== cols || oc.height !== rows) { oc = mosaicDraw.oc = document.createElement('canvas'); oc.width = cols; oc.height = rows; mosaicDraw.o = oc.getContext('2d', { willReadFrequently: true }); }
  const o = mosaicDraw.o; o.clearRect(0, 0, cols, rows); fn(o);
  const d = o.getImageData(0, 0, cols, rows).data;
  ctx.fillStyle = '#3a2c22'; ctx.fillRect(x - 6, y - 6, cols * tile + 12, rows * tile + 12);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const k = (j * cols + i) * 4; if (d[k + 3] < 100) continue;
    const [r, g, b] = mpal(d[k], d[k + 1], d[k + 2]), jit = (hash(i * 7.3 + j * 3.1) - .5) * 22;
    ctx.fillStyle = `rgb(${clamp(r + jit, 0, 255) | 0},${clamp(g + jit, 0, 255) | 0},${clamp(b + jit, 0, 255) | 0})`; ctx.fillRect(x + i * tile + .9, y + j * tile + .9, tile - 1.8, tile - 1.8);
  }
}
function mosFig(o, cx, fy, p) {
  const skin = '#c98a5a', hair = '#6e4a32', band = '#f6ecd4', shorts = '#e0cfa3', ln = '#33261c', S = .9;
  o.save(); o.translate(cx, fy); o.scale(S, S);
  const limb = (x0, y0, ang, len, w, col) => { const x1 = x0 + Math.sin(ang) * len, y1 = y0 + Math.cos(ang) * len; o.lineCap = 'round'; o.strokeStyle = ln; o.lineWidth = w + 1.8; o.beginPath(); o.moveTo(x0, y0); o.lineTo(x1, y1); o.stroke(); o.strokeStyle = col; o.lineWidth = w; o.beginPath(); o.moveTo(x0, y0); o.lineTo(x1, y1); o.stroke(); return [x1, y1]; };
  const pl = (pts, col) => { o.fillStyle = ln; o.beginPath(); pts.forEach((q, i) => i ? o.lineTo(q[0], q[1]) : o.moveTo(q[0], q[1])); o.closePath(); o.lineWidth = 1.8; o.strokeStyle = ln; o.stroke(); o.fillStyle = col; o.fill(); };
  limb(-2.6, -17, p.lL, 17, 3.6, skin); limb(2.6, -17, p.lR, 17, 3.6, skin);
  pl([[-4.2, -36], [4.2, -36], [3.4, -17], [-3.4, -17]], skin);                       // gövde
  pl([[-4.4, -35.5], [4.4, -35.5], [4.2, -30], [-4.2, -30]], band);                    // bant
  pl([[-3.8, -22.5], [3.8, -22.5], [4.2, -16.5], [-4.2, -16.5]], shorts);              // şort
  const hL = limb(-4.6, -35, p.aL, 11, 2.8, skin), hR = limb(4.6, -35, p.aR, 11, 2.8, skin);
  limb(0, -37, 0, -2.4, 2.6, skin);                                                      // boyun
  o.fillStyle = ln; o.beginPath(); o.ellipse(0, -42, 5.1, 5.8, 0, 0, TAU); o.fill(); o.fillStyle = skin; o.beginPath(); o.ellipse(0, -41.8, 4.3, 5, 0, 0, TAU); o.fill();
  o.fillStyle = hair; o.beginPath(); o.ellipse(0, -44.2, 4.5, 3, 0, Math.PI, TAU); o.fill(); o.beginPath(); o.arc(2.8, -47.4, 2.2, 0, TAU); o.fill();
  o.fillStyle = ln; o.fillRect(-2.4, -42.4, 1.2, 1.2); o.fillRect(1.2, -42.4, 1.2, 1.2); o.fillRect(-1, -39.6, 2, .9);
  if (p.ball) { o.fillStyle = ln; o.beginPath(); o.arc(p.ball[0], p.ball[1], 3.6, 0, TAU); o.fill(); o.fillStyle = '#b4583a'; o.beginPath(); o.arc(p.ball[0], p.ball[1], 2.6, 0, TAU); o.fill(); }
  if (p.weights) { const a = hL, c = hR; o.strokeStyle = ln; o.lineWidth = 2; o.beginPath(); o.moveTo(a[0], a[1]); o.lineTo(c[0], c[1]); o.stroke(); for (const q of [a, c]) { o.fillStyle = ln; o.beginPath(); o.arc(q[0], q[1], 3.2, 0, TAU); o.fill(); o.fillStyle = '#6e4a32'; o.beginPath(); o.arc(q[0], q[1], 2.2, 0, TAU); o.fill(); } }
  o.restore(); return { hL: [cx + hL[0] * S, fy + hL[1] * S], hR: [cx + hR[0] * S, fy + hR[1] * S] };
}
function mosaicPanel(o, cols, rows, t, mode) {
  o.fillStyle = '#e9dcc0'; o.fillRect(0, 0, cols, rows);
  o.fillStyle = '#33261c'; o.fillRect(0, 0, cols, 2); o.fillRect(0, rows - 2, cols, 2); o.fillRect(0, 0, 2, rows); o.fillRect(cols - 2, 0, 2, rows);
  o.fillStyle = '#b4583a'; o.fillRect(2, 2, cols - 4, 2); o.fillRect(2, rows - 4, cols - 4, 2); o.fillRect(2, 2, 2, rows - 4); o.fillRect(cols - 4, 2, 2, rows - 4);
  for (let i = 5; i < cols - 5; i += 2) { o.fillStyle = (i / 2 | 0) % 2 ? '#a67c52' : '#e0cfa3'; o.fillRect(i, 5, 2, 2); o.fillRect(i, rows - 7, 2, 2); }
  for (let j = 5; j < rows - 5; j += 2) { o.fillStyle = (j / 2 | 0) % 2 ? '#a67c52' : '#e0cfa3'; o.fillRect(5, j, 2, 2); o.fillRect(cols - 7, j, 2, 2); }
  const fy = rows - 7, cx = [cols * .24, cols * .5, cols * .76];
  const idle = Math.sin(t * 2) * .05;
  if (mode === 'act') {
    const ph = (t * .9) % 2;                    // top atışı: 0-1 ileri, 1-2 geri
    const dir = ph < 1 ? 1 : -1, u = ph < 1 ? ph : ph - 1;
    const hand1 = [cx[0] + 4.6 * .9 + 7, fy - 35 * .9 - 8], hand2 = [cx[1] - 4.6 * .9 - 7, fy - 35 * .9 - 8];
    const a = dir > 0 ? hand1 : hand2, c = dir > 0 ? hand2 : hand1;
    const ball = [lerp(a[0], c[0], u), lerp(a[1], c[1], u) - Math.sin(u * Math.PI) * 14];
    const th = Math.sin(u * Math.PI);
    mosFig(o, cx[0], fy, { aL: -.3, aR: dir > 0 ? 2.1 + th * .6 : 2.3, lL: -.14, lR: .14 }); if (u > .1 && u < .9) { o.fillStyle = '#33261c'; o.beginPath(); o.arc(ball[0], ball[1], 3.6, 0, TAU); o.fill(); o.fillStyle = '#b4583a'; o.beginPath(); o.arc(ball[0], ball[1], 2.6, 0, TAU); o.fill(); }
    mosFig(o, cx[1], fy, { aL: dir < 0 ? -2.1 - th * .6 : -2.3, aR: .3, lL: -.12, lR: .16 });
    const wl = (Math.sin(t * 3.2) * .5 + .5);
    mosFig(o, cx[2], fy, { aL: lerp(-.7, -2.9, wl), aR: lerp(.7, 2.9, wl), lL: -.1, lR: .1, weights: true });
  } else {
    mosFig(o, cx[0], fy, { aL: -.4 + idle, aR: 2.2, lL: -.14, lR: .14, ball: [4.6 + Math.sin(2.2) * 11, -35 + Math.cos(2.2) * 11 - 2] });
    mosFig(o, cx[1], fy, { aL: -2.2, aR: .4 - idle, lL: -.12, lR: .16 });
    mosFig(o, cx[2], fy, { aL: -2.7 + idle, aR: 2.7 - idle, lL: -.1, lR: .1, weights: true });
  }
}
function italyShape(ctx, ox, oy, k) {
  const pr = ([lo, la]) => [ox + (lo - 6.5) * k, oy + (47.2 - la) * k * 1.3];
  const it = [[8.9, 44.4], [9.8, 44.1], [10.3, 43.5], [10.5, 42.9], [11.8, 42.1], [12.6, 41.5], [13.5, 41.2], [14.25, 40.85], [14.75, 40.65], [15.6, 40.07], [16.0, 39.35], [15.9, 38.68], [15.9, 38.4], [15.65, 38.1], [16.05, 37.92], [16.55, 38.7], [17.15, 39.08], [16.5, 39.75], [17.2, 40.45], [17.98, 40.05], [18.35, 39.8], [18.5, 40.15], [17.95, 40.65], [16.85, 41.13], [15.9, 41.6], [16.18, 41.88], [15.0, 42.0], [14.2, 42.45], [13.5, 43.6], [12.6, 44.05], [12.3, 44.4], [12.3, 45.4], [13.75, 45.65], [13.7, 46.5], [12.4, 46.7], [10.5, 46.8], [9.0, 46.4], [8.1, 46.1], [7.0, 45.9], [6.9, 44.8], [7.5, 44.1], [8.0, 43.8]].map(pr);
  const sc = [[15.6, 38.25], [15.25, 38.27], [14.0, 38.04], [13.35, 38.12], [12.5, 38.0], [12.45, 37.8], [12.6, 37.65], [13.55, 37.28], [14.25, 37.05], [14.85, 36.7], [15.1, 36.68], [15.3, 37.05], [15.1, 37.5], [15.3, 37.85]].map(pr);
  shape(ctx, it, '#e6d4a6', '#cdb985', { sw: 4, seed: 501, sx: -8, sy: -6 }); shape(ctx, sc, '#e6d4a6', '#cdb985', { sw: 4, seed: 502, sx: -6, sy: -5 });
  return { pin: pr([14.33, 37.36]), sicily: pr([14.0, 37.5]) };
}

// ---------------- s14: Sicilya → villa → mozaik → UNESCO → kadınlar
sahneS('s14', (ctx, t) => {
  const id = 's14', b = SAH[id].bas, d = SAH[id].dur;
  const c1 = W(id, '1700') + .1, c2 = W(id, 'bu') - .1, c3 = W(id, 'villa', 3) - .1, c4 = W(id, 'mozaikte') - .1;
  if (t < c1) {   // harita
    plainBG(ctx, '#efe3c6', '#d9c79a');
    for (let i = 0; i < 12; i++) { ctx.strokeStyle = 'rgba(110,80,50,.12)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-100, i * 100); ctx.lineTo(2020, i * 100 + 30); ctx.stroke(); }
    const k = lerp(62, 62, 0);
    ctx.save(); const z = 1 + .6 * sm(seg(t, W(id, 'sicilya') - .6, c1)); const cx = 780, cy = 940; ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy);
    const m = italyShape(ctx, 520, 30, 74);
    const drop = spring(t, W(id, 'sicilya') + .2, 2.2, .35), py = m.pin[1] - (1 - drop) * 220;
    ctx.save(); ctx.translate(m.pin[0], py); line(ctx, [[0, 0], [0, -34]], 5, C.ink); ell(ctx, 0, -46, 18, 18, '#b4503a', C.ink, 3.4); ell(ctx, -5, -52, 5, 5, '#e8a090', null); ctx.restore();
    ctx.restore();
    T(ctx, t, 'İtalya', 260, 300, 150, INK, b + .1, b + .8, { rot: -.04 });
    T(ctx, t, 'Sicilya', 1450, 880, 130, RED, W(id, 'sicilya'), W(id, 'sicilya') + .6, { rot: -.04 });
    pen(ctx, curve([1470, 840], [1330, 790], [1180, 860], 18), seg(t, W(id, 'sicilya') + .4, W(id, 'sicilya') + .9), 6, RED, { arrow: 18 });
  } else if (t < c2) {   // villa çizimi
    skyGrad(ctx, '#f1dcb4', '#f6e6c4', '#faf0d8', 700); ridge(ctx, 650, 80, 5.2, '#cdbd92', null);
    cloudBlob(ctx, 500, 160, 1.2, '#fff', .55);
    const g = ctx.createLinearGradient(0, 760, 0, 1080); g.addColorStop(0, '#9aa673'); g.addColorStop(1, '#7f8c5a'); ctx.fillStyle = g; ctx.fillRect(-100, 760, 2120, 400);
    // villa: platform + sütunlar + alınlık
    const vx = 960, vy = 800; shape(ctx, [[vx - 640, vy], [vx + 640, vy], [vx + 600, vy + 60], [vx - 600, vy + 60]], '#e6d9bd', '#c9bb9a', { sw: 3.4, seed: 510, sx: 0, sy: -6 });
    shape(ctx, [[vx - 560, vy - 250], [vx + 560, vy - 250], [vx + 560, vy], [vx - 560, vy]], '#efe0c0', '#d8c7a2', { sw: 3.4, seed: 511, sx: -10, sy: 0 });
    poly(ctx, [[vx - 620, vy - 250], [vx + 620, vy - 250], [vx + 0, vy - 440]], '#b9683f', '#8f4c2c', { sw: 3.4, sx: -10, sy: -6 });
    for (let i = -4; i <= 4; i++) column(ctx, vx + i * 130, vy - 250, vy, 52, '#f6ecd4', '#d3c6a6'); for (let i = 0; i < 9; i++) line(ctx, [[vx - 500 + i * 120, vy - 380 + Math.abs(i - 4) * 28], [vx - 540 + i * 120, vy - 262]], 2.4, '#8f4c2c');
    oliveTree(ctx, 220, 900, 1, t); oliveTree(ctx, 1700, 900, .9, t);
    T(ctx, t, 'Villa Romana del Casale', 960, 130, 120, INK, W(id, 'villa'), W(id, 'casale') + .6, { align: 'center', rot: -.01, shadow: 'rgba(255,245,225,.6)' });
    T(ctx, t, '1.700 yıllık', 960, 1000, 130, '#fff', W(id, 'bin') - .1, W(id, 'roma') + .6, { align: 'center', fam: 'Alegreya', it: true, wt: 800, shadow: 'rgba(30,18,10,.7)' });
  } else if (t < c3) {   // zemindeki mozaik
    plainBG(ctx, '#d9c79a', '#a67c52'); tamEkran(ctx, IMG.mozaik);
    tagAt(ctx, t, W(id, 'mozaik'), 300, 96, 330, 116, -.03); T(ctx, t, 'mozaik', 300, 128, 100, INK, W(id, 'mozaik'), W(id, 'mozaik') + .6, { align: 'center', rot: -.03 });
    tagAt(ctx, t, W(id, 'yerinde') - .2, 1340, 984, 640, 116, .02); T(ctx, t, 'hâlâ yerinde!', 1340, 1016, 100, INK, W(id, 'yerinde') - .2, W(id, 'duruyor') + .5, { align: 'center', rot: .02 });
    temsili(ctx, t, c2 + .5);
  } else if (t < c4) {   // UNESCO
    plainBG(ctx, '#efe3c6', '#d9c79a');
    pinnedPaper(ctx, 960, 480, 1200, 640, -.015, '#f8efd9');
    T(ctx, t, 'UNESCO', 960, 400, 190, INK, W(id, 'unesco'), W(id, 'yunesko') + .5, { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
    T(ctx, t, 'Dünya Mirası Listesi', 960, 560, 110, '#8a2f2c', W(id, 'dünya'), W(id, 'listesinde') + .4, { align: 'center', rot: -.01 });
    pen(ctx, [[560, 640], [610, 700], [720, 600]], seg(t, W(id, 'listesinde') + .2, W(id, 'listesinde') + .6), 14, '#5f6b4a');
    T(ctx, t, 'istersen gidip gör!', 960, 900, 120, INK, W(id, 'istersen'), W(id, 'görebilirsin') + .3, { align: 'center', rot: -.02 });
    ctx.save(); ctx.translate(1540, 880 + Math.sin(t * 5) * 6); line(ctx, [[0, 0], [0, 40]], 6, C.ink); ell(ctx, 0, -10, 24, 24, '#b4503a', C.ink, 4); ctx.restore();
  } else {   // kadınlar: bant + şort
    plainBG(ctx, '#d9c79a', '#a67c52'); kirpEkran(ctx, IMG.mozaik, 330, 0, 680, 383); temsili(ctx, t, c4);
    // etiketler ekran uzayında
    tagAt(ctx, t, W(id, 'bant'), 1560, 230, 320, 150, -.03); T(ctx, t, 'bant', 1560, 262, 112, INK, W(id, 'bant') - .1, W(id, 'bant') + .5, { align: 'center', rot: -.03 });
    pen(ctx, curve([1400, 270], [1250, 310], [1060, 335], 18), seg(t, W(id, 'bant') + .2, W(id, 'bant') + .7), 7, INK, { arrow: 20 });
    tagAt(ctx, t, W(id, 'şort'), 1560, 700, 320, 150, -.03); T(ctx, t, 'şort', 1560, 732, 112, INK, W(id, 'şort') - .2, W(id, 'şort') + .5, { align: 'center', rot: -.03 });
    pen(ctx, curve([1400, 690], [1250, 620], [1050, 560], 18), seg(t, W(id, 'şort') + .1, W(id, 'şort') + .6), 7, INK, { arrow: 20 });
  }
});

// kâğıt etiket: kelimeyle birlikte belirir (açık renkli zeminde okunur)
function tagAt(ctx, t, t0, x, y, w, h, rot) { const u = bk(seg(t, t0 - .15, t0 + .3)); if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); pinnedPaper(ctx, 0, 0, w, h, rot, '#f8efd9'); ctx.restore(); }
// ---------------- s15: top/ağırlık, "Bikinili Kızlar", spora giderken ne giysem
function wardrobe(ctx, x, y, t) {
  ctx.save(); ctx.translate(x, y);
  shape(ctx, [[-300, 0], [300, 0], [300, -760], [-300, -760]], '#7a573b', '#5c412b', { sw: 4, seed: 520, sx: -10, sy: 0 });
  shape(ctx, [[-262, -20], [262, -20], [262, -730], [-262, -730]], '#2e231b', null, { sw: 3, seed: 521 });
  line(ctx, [[-262, -640], [262, -640]], 8, '#c8a043');
  const cols = ['#b4583a', '#8a9a5b', '#e0cfa3', '#a67c52', '#b9a7c4'];
  for (let i = 0; i < 5; i++) { const hx = -200 + i * 100, sw = Math.sin(t * 1.3 + i) * 3; ctx.save(); ctx.translate(hx, -640); ctx.rotate(sw * .01); line(ctx, [[0, 0], [0, 14], [-30, 40], [30, 40], [0, 14]], 3, '#d9d2c4'); shape(ctx, [[-34, 40], [34, 40], [30, 150], [-30, 150]], cols[i], null, { sw: 3, seed: 522 + i }); ctx.restore(); }
  shape(ctx, [[-330, 0], [-262, 0], [-262, -760], [-330, -740]], '#8d6a4c', '#6b4d36', { sw: 3.4, seed: 530, sx: -6, sy: 0 }); shape(ctx, [[262, 0], [330, 0], [330, -740], [262, -760]], '#8d6a4c', '#6b4d36', { sw: 3.4, seed: 531, sx: -6, sy: 0 });
  ctx.restore();
}
sahneS('s15', (ctx, t) => {
  const id = 's15', b = SAH[id].bas, d = SAH[id].dur;
  const tH = W(id, 'herkes') - .1, tY = W(id, 'yani') - .1;
  if (t < tY) {
    plainBG(ctx, '#d9c79a', '#a67c52'); tamEkran(ctx, t >= W(id, 'ağırlık') - .1 && !(t > tH) ? IMG.sporB : IMG.sporA); temsili(ctx, t, b + .5);
    tagAt(ctx, t, W(id, 'top'), 290, 100, 250, 120, -.03); T(ctx, t, 'top', 290, 132, 104, INK, W(id, 'top') - .1, W(id, 'top') + .5, { align: 'center', rot: -.03 });
    tagAt(ctx, t, W(id, 'ağırlık'), 800, 100, 380, 120, .03); T(ctx, t, 'ağırlık', 800, 132, 104, INK, W(id, 'ağırlık') - .1, W(id, 'ağırlık') + .5, { align: 'center', rot: .03 });
    if (t > tH) { pinnedPaper(ctx, 960, 940, 1500, 200, -.01, '#f8efd9'); T(ctx, t, '"Bikinili Kızlar"', 640, 965, 100, INK, W(id, 'bikinili') - .1, W(id, 'kızlar') + .4, { align: 'center' }); T(ctx, t, 'mayo', 1180, 940, 84, INK, W(id, 'mayo') - .1, W(id, 'mayo') + .3, { align: 'center' }); crossOut(ctx, 1090, 900, 1270, 960, seg(t, W(id, 'değil') - .1, W(id, 'değil') + .3)); T(ctx, t, 'spor kıyafeti', 1500, 965, 84, '#5f6b4a', W(id, 'spor'), W(id, 'kıyafeti') + .4, { align: 'center' }); }
  } else {
    plainBG(ctx, '#e9dcc0', '#cdb98f');
    shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 540 });
    wardrobe(ctx, 1450, 930, t);
    const hold = (k) => P({ armL: [-190 + k * 20, -540], armR: [190 - k * 20, -540], headRoll: k * 6, f: { look: [k * 1, 0], mouth: MOUTH.flat, browL: [-8, -.1, .3], browR: [-8, .1, .3], lid: .1, sweat: .2 } });
    const giggle = P({ armL: [-190, -540], armR: [190, -540], headRoll: 4, headDY: -6, f: { lid: .8, mouth: MOUTH.grin, browL: [-6, -.1, .3], browR: [-6, -.1, .3], blush: .9 } });
    const tG = W(id, 'derdindeymiş') + .15;
    const S = actor('w68d', [[tY, hold(-1)], [W(id, 'spora') - .1, hold(-1)], [W(id, 'giderken'), hold(1), sm], [W(id, 'giysem'), hold(-1), sm], [tG, giggle, bk]], t, { x: 800, s: .85, k: 1.15 });
    if (t > tG) S.headDY += Math.sin(t * 15) * 4;
    S.armL.hold = (c) => { c.save(); c.translate(0, 8); line(c, [[0, 0], [0, 14], [-26, 36], [26, 36], [0, 14]], 3, '#d9d2c4'); shape(c, [[-30, 36], [30, 36], [26, 120], [-26, 120]], '#8a9a5b', null, { sw: 3, seed: 550 }); c.restore(); };
    S.armR.hold = (c) => { c.save(); c.translate(0, 8); line(c, [[0, 0], [0, 14], [-26, 36], [26, 36], [0, 14]], 3, '#d9d2c4'); shape(c, [[-30, 36], [30, 36], [34, 100], [-34, 100]], '#b4583a', null, { sw: 3, seed: 551 }); c.restore(); };
    drawMary(ctx, S);
    T(ctx, t, '"Spora giderken', 110, 170, 100, INK, W(id, 'spora') - .1, W(id, 'giderken') + .4, { rot: -.02 });
    T(ctx, t, 'ne giysem?"', 150, 285, 100, INK, W(id, 'giderken') + .2, W(id, 'giysem') + .5, { rot: -.02 });
  }
});

// ---------------- s17: Avrupa oturdu ve düşündü – bant → korse
function workshop(ctx, t) {
  ctx.fillStyle = '#5a4331'; ctx.fillRect(-100, -100, 2120, 1300);
  for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#634a36' : '#54402e'; ctx.fillRect(i * 120 - 20, -100, 118, 1300); }
  for (let r = 0; r < 1; r++) { ctx.fillStyle = '#7a573b'; ctx.fillRect(-100, 250 + r * 260, 2120, 20); for (let i = 0; i < 12; i++) { const cl = ['#b4583a', '#e0cfa3', '#8a9a5b', '#a67c52', '#b9a7c4', '#c8a043'][(i + r * 2) % 6]; ell(ctx, i * 170 + 90, 214 + r * 260, 42, 34, cl, C.ink, 3); ell(ctx, i * 170 + 90, 214 + r * 260, 14, 12, '#3a2c22', null); } }
  glow(ctx, 1500, 360, 520, 'rgba(255,210,130,A)', .35 + Math.sin(t * 7) * .02);
}
sahneS('s17', (ctx, t) => {
  const id = 's17', b = SAH[id].bas, d = SAH[id].dur;
  ctx.save(); const z = 1 + ZOOMK * .05 * seg(t, b, b + d); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
  workshop(ctx, t);
  const tZ = W(id, 'nasıl'), tR = W(id, 'rahat');
  const ponder = (k) => P({ armL: [-60, -470], armR: [60, -470], headRoll: k * 5, f: { look: [k, -.4], mouth: MOUTH.flat, browL: [-8, -.1, .3], browR: [-12, -.3, .4], lid: .1 } });
  const nod = P({ armL: [-60, -470], armR: [150, -520], f: { look: [0, .4], mouth: MOUTH.smile, browL: [-4, 0, .2], browR: [-4, 0, .2], blush: .5 } });
  const sly = P({ armL: [-60, -470], armR: [60, -470], headRoll: 4, f: { look: [1, 0], mouth: MOUTH.grin, browL: [-3, .35, 0], browR: [-3, .35, 0], lid: .35 } });
  const sly2 = P({ armL: [-60, -470], armR: [60, -470], headRoll: -4, f: { look: [-1, 0], mouth: MOUTH.grin, browL: [-3, .35, 0], browR: [-3, .35, 0], lid: .35 } });
  const A = actor('wig1', [[b, ponder(1)], [W(id, 'bu') - .1, ponder(1)], [W(id, 'bu') + .2, nod, sm], [tZ - .2, nod], [tZ + .2, sly, bk]], t, { x: 520, s: 1.5, bust: true, off: .5 });
  const B = actor('wig2', [[b, ponder(-1)], [W(id, 'bu') - .1, ponder(-1)], [W(id, 'bu') + .2, P({ armL: [-60, -470], armR: [60, -470], f: { look: [0, .4], mouth: MOUTH.smile, browL: [-4, 0, .2], browR: [-4, 0, .2], blush: .5 } }), sm], [tZ - .2, P({ armL: [-60, -470], armR: [60, -470], f: { look: [0, .4], mouth: MOUTH.smile } })], [tZ + .2, sly2, bk]], t, { x: 1400, s: 1.5, bust: true, off: 1.4 });
  A.y = 1700; B.y = 1700; drawMary(ctx, A); drawMary(ctx, B);
  // masa
  shape(ctx, [[-100, 800], [2020, 800], [2020, 1100], [-100, 1100]], '#8d6a4c', '#6b4d36', { sw: 3.4, seed: 560, sx: 0, sy: -10 });
  // bant → korse dönüşümü
  const tx = 960, ty = 905;
  const bonesN = Math.floor(clamp(seg(t, tZ, tZ + 1.0)) * 7), lace = clamp(seg(t, tZ + .5, tZ + 1.3)), steel = clamp(seg(t, tZ + .9, tZ + 1.6));
  ctx.save(); ctx.translate(tx, ty); ctx.scale(1.35, 1.35);
  shape(ctx, [[-260, -70], [260, -70], [270, 40], [-270, 40]], '#f4ecd8', '#d6c8aa', { sw: 4, seed: 561, sx: -8, sy: -5 });
  for (let i = 0; i < bonesN; i++) { const x = -230 + i * 76; line(ctx, [[x, -62], [x + 2, 32]], 7, '#8f7e66'); }
  if (lace > 0) for (let i = 0; i < 8; i++) { const y = -60 + i * 13, k = clamp(lace * 8 - i); if (k > 0) { line(ctx, [[-14, y], [14, y + 13]], 4, '#a9794a'); line(ctx, [[14, y], [-14, y + 13]], 4, '#a9794a'); } }
  if (steel > 0) { line(ctx, [[-260, -70], [260, -70]], 10 * steel, '#b7b0a2'); line(ctx, [[-270, 40], [270, 40]], 10 * steel, '#b7b0a2'); }
  ctx.restore();
  T(ctx, t, 'çok rahat', 960, 150, 100, CREAM, tR - .1, tR + .4, { align: 'center', rot: -.03, shadow: 'rgba(30,18,10,.8)' });
  // rahatlık ölçeri düşer
  const L = t < tZ ? 1 : lerp(1, .06, eio(seg(t, tZ, tZ + 1.6)));
  if (t > tR - .1) { ctx.save(); ctx.translate(960, 760); ctx.scale(1.05, 1.05); drawGauge(ctx, 0, 0, L, t, 0, clamp(seg(t, tR - .1, tR + .3))); hand(ctx, 'rahatlık', 60, 10, 64, CREAM, 1, { shadow: 'rgba(30,18,10,.8)' }); ctx.restore(); }
  if (t > tZ + 1.1) { ctx.save(); ctx.translate(1200, 330); drawBulb(ctx, 0, 0, .9, true, t); ctx.restore(); }
  ctx.restore();
});

// ---------------- s18: korse sahneye çıktı – eğilmek yasak, oturmak mühendislik, merdiven ekstrem spor
sahneS('s18', (ctx, t) => {
  const id = 's18', b = SAH[id].bas, d = SAH[id].dur;
  const tB = W(id, 'eğilmek') - .1, tS = W(id, 'oturmak') - .1, tM = W(id, 'merdiven') - .1;
  if (t < tB) {   // korse sahnede
    curtainBG(ctx, t);
    const u = bk(seg(t, b + .1, b + .7)); ctx.save(); ctx.translate(960, 620); ctx.scale(u * 2.6, u * 2.6);
    shape(ctx, [[-84, -120], [-46, -134], [0, -112], [46, -134], [84, -120], [92, -60], [70, 0], [96, 70], [88, 110], [0, 120], [-88, 110], [-96, 70], [-70, 0], [-92, -60]], C.corset, C.corsetD, { sw: 4, seed: 570, sx: -8, sy: -5 });
    for (const xk of [-62, -44, -26, 26, 44, 62]) line(ctx, [[xk, -112], [xk * .8, 100]], 4, C.bone);
    for (let y = -108; y < 100; y += 20) { line(ctx, [[-12, y], [12, y + 20]], 4, C.lacing); line(ctx, [[12, y], [-12, y + 20]], 4, C.lacing); }
    ctx.restore();
    glow(ctx, 960, 560, 700, 'rgba(255,224,150,A)', .22 * u);
    T(ctx, t, 'KORSE', 960, 190, 190, CREAM, b + .5, b + 1.2, { align: 'center', fam: 'Alegreya', it: true, wt: 800, shadow: 'rgba(20,8,8,.8)' });
    kanitKart(ctx, t, IMG.met2, b + .9, tB + .2, 1590, 560, 360, 360, .05, 'gerçeği (~1890)');
  } else {
    plainBG(ctx, '#efe3c9', '#d9c7a0'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], C.wood, C.woodD, { sw: 0, seed: 571 });
    const stiff = (extra = {}) => P(Object.assign({ armL: [-96, -410], armR: [96, -410], f: { mouth: MOUTH.flat, look: [0, 0], browL: [-3, 0, .1], browR: [-3, 0, .1] } }, extra));
    if (t < tS) {   // eğilmek yasak
      const k = t - tB;
      const bend = stiff({ lean: -14, armL: [-120, -60], headDY: 10, f: { look: [-.8, .8], mouth: { w: 9, open: .15, smile: -.5, shape: '' }, bulge: .6, browL: [-8, -.4, .2], browR: [-8, -.4, .2], sweat: .7, puff: .5 } });
      const S = actor('vic', [[tB, stiff()], [tB + .3, bend, eio], [tB + .8, bend], [tS - .1, bend]], t, { x: 960, s: .85, k: 1 }); S.shake = 0; S.x += Math.sin(t * 50) * 3 * seg(t, tB + .6, tB + 1.2);
      drawMary(ctx, S);
      pen(ctx, epts(1420, 520, 120, 120, 24).concat([[1420 + 120, 520]]), seg(t, W(id, 'yasak') - .2, W(id, 'yasak') + .3), 14, '#b4503a'); pen(ctx, [[1336, 604], [1504, 436]], seg(t, W(id, 'yasak') + .1, W(id, 'yasak') + .5), 14, '#b4503a');
      T(ctx, t, 'yasak', 1420, 760, 120, '#b4503a', W(id, 'yasak') - .1, W(id, 'yasak') + .5, { align: 'center', rot: -.03 });
    } else if (t < tM) {   // oturmak mühendislik projesi: vinç + baret + sandalye
      drawChair(ctx, 1000, ZEMIN);
      const lowerK = sm(seg(t, tS + .3, tM - .3));
      const S = actor('vic', [[tS, stiff()], [tM, stiff({ f: { mouth: MOUTH.sad, look: [0, .4], sweat: .6, browL: [-6, -.3, .2], browR: [-6, -.3, .2] } })]], t, { x: 1000, s: .85, k: 1 }); S.y = ZEMIN - 230 * (1 - lowerK) - 6; LOOK.vic.acc = 'hardhat'; LOOK.vic.accC = '#d9a93b'; LOOK.vic.accD = '#a8802a';
      // vinç kolu
      line(ctx, [[1000, -40], [1000, S.y - 480 * S.s]], 8, '#3b2a22'); shape(ctx, [[960, S.y - 500 * S.s], [1040, S.y - 500 * S.s], [1030, S.y - 470 * S.s], [970, S.y - 470 * S.s]], '#b9a07a', '#8a7552', { sw: 3, seed: 575 });
      drawMary(ctx, S); LOOK.vic.acc = 'none';
      pen(ctx, [[1000, 260], [1000, 340]], 1, 4, C.ink);
      T(ctx, t, 'mühendislik projesi', 1480, 260, 100, INK, W(id, 'mühendislik') - .1, W(id, 'projesi') + .4, { rot: -.03 });
      // açı ölçer + cetvel
      ctx.save(); ctx.translate(1450, 520); ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 110, Math.PI, 0); ctx.stroke(); line(ctx, [[-110, 0], [110, 0]], 5, C.ink); for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8; line(ctx, [[Math.cos(a) * 100, Math.sin(a) * 100], [Math.cos(a) * 116, Math.sin(a) * 116]], 3, C.ink); } line(ctx, [[0, 0], [Math.cos(Math.PI * 1.25) * 100, Math.sin(Math.PI * 1.25) * 100]], 5, '#b4503a'); ctx.restore();
    } else {   // merdiven: ekstrem spor
      for (let i = 0; i < 4; i++) poly(ctx, [[1100 + i * 150, 930 - i * 70], [1760, 930 - i * 70], [1760, 930 - (i + 1) * 70], [1100 + i * 150, 930 - (i + 1) * 70]], '#c9b48a', '#a58f66', { sw: 3.4, sx: -4, sy: -3 });
      LOOK.vic.acc = 'hardhat'; LOOK.vic.accC = '#b4503a'; LOOK.vic.accD = '#8a3a2a';
      const climb = P({ armL: [-100, -520], armR: [190, -690], lean: 4, f: { mouth: MOUTH.grin, look: [1, -.4], browL: [-6, .25, .1], browR: [-6, .25, .1], sweat: .4 } });
      const up = P({ armL: [-190, -690], armR: [100, -520], lean: -3, f: { mouth: MOUTH.o, look: [1, -.5], browL: [-8, .1, .1], browR: [-8, .1, .1], sweat: .6, bulge: .3 } });
      const S = actor('vic', [[tM, climb], [W(id, 'ekstrem') - .3, up, sm], [W(id, 'spor') + .5, climb, sm]], t, { x: 760, s: .85, k: 1 });
      S.armR.hold = (c) => { c.save(); line(c, [[0, 10], [10, -120]], 8, '#6b4d36'); shape(c, [[-28, -120], [12, -136], [24, -112], [-14, -102]], '#b7b0a2', '#8f897d', { sw: 3, seed: 590 }); c.restore(); };
      drawMary(ctx, S); LOOK.vic.acc = 'none';
      line(ctx, [[760 - 30, ZEMIN - 440 * .85], [1100, 740], [1400, 620], [1560, 500]], 5, '#a9794a');
      T(ctx, t, 'ekstrem spor', 1110, 250, 130, INK, W(id, 'ekstrem') - .1, W(id, 'spor') + .5, { rot: -.03 });
    }
  }
});

// ---------------- s19: 300 yıl – kimse çıkıp demedi
sahneS('s19', (ctx, t) => {
  const id = 's19', b = SAH[id].bas, d = SAH[id].dur;
  ctx.save(); const z = 1 + ZOOMK * .04 * seg(t, b, b + d); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
  ctx.fillStyle = '#6b5440'; ctx.fillRect(-100, -100, 2120, 1300); for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#725944' : '#634b39'; ctx.fillRect(i * 120 - 20, -100, 118, 1300); }
  for (const x of [380, 1540]) { line(ctx, [[x, 120], [x, 190]], 8, C.goldD); shape(ctx, [[x - 26, 40], [x + 26, 40], [x + 20, 120], [x - 20, 120]], '#f4dca8', '#d9b66e', { sw: 3, seed: 600 + x }); glow(ctx, x, 80, 260, 'rgba(255,214,140,A)', .4); }
  const tK = W(id, 'kimse'), tD = W(id, 'demedi');
  const stiff = (sweat = .3, extra = {}) => P(Object.assign({ armL: [-60, -470], armR: [60, -470], f: { mouth: { w: 17, open: 0, smile: .35, shape: '' }, look: [0, 0], sweat, browL: [-3, 0, .1], browR: [-3, 0, .1], lid: .1 } }, extra));
  const raise = P({ armL: [-60, -470], armR: [150, -700], headDY: -4, f: { mouth: MOUTH.talk, look: [0, -.2], browL: [-8, -.1, .3], browR: [-8, -.1, .3] } });
  const chicken = stiff(.8, { f: { mouth: MOUTH.sad, look: [-.6, .5], sweat: .8, browL: [-8, -.35, .2], browR: [-8, -.35, .2], lid: 0 } });
  const cast = [['lady1', 330], ['lady2', 760], ['lady3', 1190], ['lady4', 1590]];
  cast.forEach(([lk, x], i) => {
    const seq = i === 2 ? [[b, stiff()], [tK + .2, stiff()], [W(id, 'arkadaşlar') - .2, raise, bk], [W(id, 'bunu'), raise], [tD - .6, chicken, bk], [tD + .6, chicken]] : [[b, stiff(.2 + i * .1)], [tK + .2, P({ armL: [-60, -470], armR: [60, -470], f: { look: [i < 2 ? .8 : -.8, .2], mouth: MOUTH.flat, browL: [-8, .1, .2], browR: [-8, -.1, .2], sweat: .4 } }), sm]];
    const S = actor(lk, seq, t, { x, s: 1.3, bust: true, off: i * .9 }); S.y = 1535; S.headDY += Math.sin(t * 2 + i) * 2; drawMary(ctx, S);
  });
  shape(ctx, [[-100, 790], [2020, 790], [2020, 1100], [-100, 1100]], '#e8dfc8', '#cbbfa2', { sw: 3.4, seed: 610, sx: 0, sy: -8 });
  for (let i = 0; i < 9; i++) shape(ctx, [[i * 240 - 100, 790], [i * 240 - 40, 790], [i * 240 - 60, 840], [i * 240 - 80, 840]], '#e8dfc8', '#cbbfa2', { sw: 2.2, seed: 611 + i });
  // plakalar + mum
  for (const [x, y] of [[560, 900], [1000, 940], [1400, 900]]) { ell(ctx, x, y, 110, 22, '#f4efe3', C.ink, 3); ell(ctx, x, y - 6, 80, 14, '#e6dcc5', null); }
  // 300 yıl sayacı
  const n = Math.floor(clamp(seg(t, W(id, '300'), W(id, 'yıl') + .6)) * 300), sh = t > W(id, '300', 2) ? 300 : n;
  rrect(ctx, 760, 30, 400, 130, 14); ctx.fillStyle = '#f4ead2'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
  hand(ctx, `${sh} yıl`, 960, 128, 100, RED, 1, { align: 'center', fam: 'Alegreya', it: true, wt: 800 });
  // konuşma balonu: söylenmedi
  const tA = W(id, 'arkadaşlar');
  if (t > tA - .2) { const al = clamp(seg(t, tA - .2, tA + .3)) * (1 - seg(t, tD + .2, tD + .7)); ctx.save(); ctx.globalAlpha = al; ctx.translate(1190, 250); ctx.setLineDash([16, 10]); rrect(ctx, -420, -80, 560, 150, 40); ctx.fillStyle = '#f8f1e2'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.setLineDash([]);
    T(ctx, t, 'Arkadaşlar… biz bunu', -140, -4, 56, INK, tA, tA + .9, { align: 'center' }); T(ctx, t, 'neden giyiyoruz?', -140, 50, 56, INK, W(id, 'neden'), W(id, 'giyiyoruz') + .3, { align: 'center' }); ctx.restore();
    if (t > tD) pen(ctx, [[820, 190], [1330, 320]], seg(t, tD, tD + .3), 14, '#b4503a'); if (t > tD) pen(ctx, [[1330, 190], [820, 320]], seg(t, tD + .15, tD + .45), 14, '#b4503a'); }
  ctx.restore();
});

// ---------------- s20: Ta ki… (saat)
sahneS('s20', (ctx, t) => {
  const id = 's20', b = SAH[id].bas, tl = t - b;
  ctx.fillStyle = '#2b1d24'; ctx.fillRect(-100, -100, 2120, 1300);
  const o = clamp(seg(tl, .2, .9)); ctx.save(); ctx.translate(960, 420); ctx.globalAlpha = o;
  ell(ctx, 0, 0, 190, 190, '#f4ead2', C.ink, 8); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(ctx, [[Math.cos(a) * 160, Math.sin(a) * 160], [Math.cos(a) * 176, Math.sin(a) * 176]], 6, C.ink); }
  const sec = Math.floor(tl * 2) * TAU / 60 * 5; line(ctx, [[0, 0], [Math.sin(sec) * 150, -Math.cos(sec) * 150]], 6, '#b4503a'); line(ctx, [[0, 0], [0, -110]], 10, C.ink); line(ctx, [[0, 0], [Math.sin(.3) * 80, -Math.cos(.3) * 80]], 12, C.ink); ell(ctx, 0, 0, 14, 14, '#c8a043', C.ink, 3); ctx.restore();
  T(ctx, t, 'Ta ki…', 960, 800, 190, CREAM, b + .9, b + 1.6, { align: 'center', fam: 'Alegreya', it: true, wt: 700 });
});
