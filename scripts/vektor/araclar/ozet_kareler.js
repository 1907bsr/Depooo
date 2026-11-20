// Kullanım: node scripts/vektor/araclar/ozet_kareler.js <oran1,oran2,...> <çıktı_klasörü> [genişlik=640]
// Her sahnenin süresinin verilen oranlarında (0.9 = %90'ında, yazılar tamamlanmışken) tek kare PNG yazar.
// Amaç: video birleştirmeden, bütün sahnelerde yazı/figür çakışmasını hızlıca gözle kontrol etmek.
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
(async () => {
  const oranlar = process.argv[2].split(',').map(Number), out = process.argv[3], W = +(process.argv[4] || 640), H = Math.round(W * 9 / 16);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('SAYFA HATASI:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('KONSOL:', m.text()); });
  await p.goto('file://' + path.join(__dirname, '..', 'vektor.html')); await p.evaluate(w => window.init({ outW: w }), W);
  const ids = await p.evaluate(() => window.sceneIds());
  for (let i = 0; i < ids.length; i++) {
    const info = await p.evaluate(x => window.sceneInfo(x), ids[i]);
    for (const r of oranlar) {
      await p.evaluate(a => window.renderScene(a.id, a.t), { id: ids[i], t: r * info.dur });
      await p.screenshot({ path: path.join(out, `${String(i + 1).padStart(2, '0')}_${ids[i]}_${Math.round(r * 100)}.png`), clip: { x: 0, y: 0, width: W, height: H } });
    }
  }
  await b.close(); console.log(ids.length, 'sahne');
})();
