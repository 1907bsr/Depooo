// Çizgi roman tarzı deneme: sahne + kapak PNG
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const out = path.resolve(process.argv[2] || 'medya/deneme-cizgiroman'); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const [fn, w, h, name] of [['scene', 1600, 900, 'sahne-mary-ayna.png'], ['thumb', 1280, 720, 'kapak-deneme.png']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    await p.goto('file://' + path.join(__dirname, 'cizgiroman.html'));
    await p.evaluate(f => window[f](), fn);
    await p.evaluate(() => document.fonts.ready);
    await p.locator('#sv').screenshot({ path: path.join(out, name) });
  }
  await b.close(); console.log('ok');
})();
