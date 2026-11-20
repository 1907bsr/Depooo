// Kullanım: node scripts/vektor/kare.js <sahne_id> <küresel_sn1,sn2,...> <çıktı_önek> [genişlik]
// Seçilen anların tek kare görüntülerini PNG olarak yazar (gözle kontrol için). Zamanlar KÜRESEL (videodaki) saniye.
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const id = process.argv[2], ts = process.argv[3].split(',').map(Number), pre = process.argv[4], W = +(process.argv[5] || 960);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: Math.round(W * 9 / 16) }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('SAYFA HATASI:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('KONSOL:', m.text()); });
  await p.goto('file://' + path.join(__dirname, 'vektor.html'));
  await p.evaluate(w => window.init({ outW: w }), W);
  const info = await p.evaluate(i => window.sceneInfo(i), id);
  for (const t of ts) {
    await p.evaluate(a => window.renderScene(a.id, a.t), { id, t: t - info.bas });
    await p.screenshot({ path: `${pre}_${String(t).replace('.', '_')}.png`, clip: { x: 0, y: 0, width: W, height: Math.round(W * 9 / 16) } });
  }
  await b.close();
})();
