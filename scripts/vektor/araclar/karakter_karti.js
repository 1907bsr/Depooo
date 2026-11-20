// Kullanım: node scripts/vektor/araclar/karakter_karti.js <çıktı.png> [genişlik=1920] [görünüm=gece]
// Bir karakter görünümünü (LOOK) 4 ifadeyle yan yana çizip PNG yazar (karakter.js).
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], W = +(process.argv[3] || 1920), ad = process.argv[4] || 'gece';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: Math.round(W * 9 / 16) }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('SAYFA HATASI:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('KONSOL:', m.text()); });
  await p.goto('file://' + path.join(__dirname, '..', 'vektor.html')); await p.evaluate(w => window.init({ outW: w }), W);
  await p.evaluate(a => window.cizKarakterKarti(a), ad); await p.screenshot({ path: out }); await b.close(); console.log('yazıldı:', out);
})();
