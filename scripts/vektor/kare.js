// Kullanım: node scripts/vektor/kare.js <t1,t2,...> <çıktı_önek> [genişlik] [mod]
// Seçilen anların tek kare görüntülerini PNG olarak yazar (gözle kontrol için).
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const ts = process.argv[2].split(',').map(Number), pre = process.argv[3], W = +(process.argv[4] || 1280), mod = process.argv[5] || '';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: Math.round(W * 9 / 16) }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('SAYFA HATASI:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('KONSOL:', m.text()); });
  await p.goto('file://' + path.join(__dirname, 'vektor.html') + (mod ? '?mod=' + mod : ''));
  await p.evaluate(w => window.init({ outW: w }), W);
  for (const t of ts) {
    await p.evaluate(t => window.renderAt(t), t);
    await p.screenshot({ path: `${pre}_${String(t).replace('.', '_')}.png`, clip: { x: 0, y: 0, width: W, height: Math.round(W * 9 / 16) } });
  }
  await b.close();
})();
