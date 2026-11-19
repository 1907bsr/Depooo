// node scripts/animasyon/kapak.js → medya/sutyen/kapak/kapak-1..3.png (1280x720)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  for (const k of ['1', '2', '3']) {
    await p.goto('file://' + path.resolve(__dirname, 'kapak.html') + '?k=' + k);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
    await p.screenshot({ path: `medya/sutyen/kapak/kapak-${k}.png` });
  }
  await b.close();
})();
