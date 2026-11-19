// Her sahneden 3 kare alıp kontak sayfası yapar: node onizle.js 02,03,... cikis_klasoru
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const ids = process.argv[2].split(','), out = path.resolve(process.argv[3]); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const id of ids) {
    await p.goto('file://' + path.resolve(__dirname, 'motor.html') + '?s=' + id);
    await p.evaluate(() => document.fonts.ready);
    const d = await p.evaluate(() => window.DUR);
    for (const [j, f] of [[0, .12], [1, .5], [2, .88]].entries()) {
      await p.evaluate(t => window.render(t), d * f[1]);
      await p.waitForTimeout(j === 0 ? 400 : 120);
      await p.screenshot({ path: path.join(out, `o${id}_${j}.png`) });
    }
  }
  await b.close();
})();
