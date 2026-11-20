'use strict';
// Karakter kartı: bir görünümün 4 ifade/pozda yan yana çizimi. Kullanım: node scripts/vektor/araclar/karakter_karti.js <çıktı.png> [görünüm=gece]
window.cizKarakterKarti = (ad = 'gece') => {
  const k = window.SC; ctx.setTransform(k, 0, 0, k, 0, 0); G.t = .8;
  plainBG(ctx, '#a9b8c0', '#7f939c'); shape(ctx, [[-100, 930], [2020, 930], [2020, 1100], [-100, 1100]], '#8a6f58', '#6b5443', { sw: 0, seed: 871 });
  const wst = 1.25;
  const base = (o) => P(Object.assign({ waist: wst, chest: 1 }, o));
  const poz = [
    ['Uykulu', base({ armL: [-150, -704], armR: [150, -704], chest: 2.2, headRoll: -4, headDY: 4, f: { lid: .62, mouth: { w: 20, open: .95, smile: 0, teeth: 0, shape: 'o' }, look: [0, .6], browL: [-4, -.1, .2], browR: [-4, -.1, .2], blush: .45 } })],
    ['Şaşkın', base({ armL: [-170, -650], armR: [170, -650], headDY: -6, f: { bulge: .7, mouth: MOUTH.o, browL: [-14, -.25, .45], browR: [-14, -.25, .45], look: [0, 0], blush: .2 } })],
    ['Gülüyor', base({ armL: [-96, -410], armR: [96, -410], headRoll: 4, f: { lid: .35, mouth: MOUTH.grin, blush: .8, browL: [-6, -.1, .3], browR: [-6, -.1, .3] } })],
    ['Şüpheli', base({ armL: [62, -452], armR: [-62, -452], headRoll: -5, f: { look: [.8, -.2], mouth: MOUTH.flat, lid: .2, browL: [-8, .3, .1], browR: [-3, -.2, .3], blush: .3 } })]
  ];
  const xs = [380, 780, 1180, 1580];
  poz.forEach(([nm, p], i) => {
    const S = actor(ad, [[0, p]], G.t, { x: xs[i], s: .95, k: 1, off: i * .9 }); drawMary(ctx, S);
    hand(ctx, nm, xs[i], 1030, 64, '#fff6e4', 1, { align: 'center', rot: -.01, shadow: 'rgba(30,40,50,.7)' });
  });
  hand(ctx, 'Gece kıyafetli kadın – karakter taslağı', 960, 96, 78, '#fff6e4', 1, { align: 'center', rot: -.005, shadow: 'rgba(30,40,50,.7)' });
  ctx.setTransform(1, 0, 0, 1, 0, 0); return true;
};
