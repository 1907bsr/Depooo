// Genel sahne render: node render_sahne.js <sahne.html> <cikis_klasoru>
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const html = path.resolve(process.argv[2]); const out = path.resolve(process.argv[3]);
  const fr = path.join(out, 'kareler'); fs.rmSync(fr, { recursive: true, force: true }); fs.mkdirSync(fr, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + html + (process.argv[4] ? '?' + process.argv[4] : ''));
  await p.evaluate(() => document.fonts.ready);
  const dur = await p.evaluate(() => window.DUR); const n = Math.round(dur * 30);
  await p.evaluate(() => window.render(0)); await p.waitForTimeout(500);
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => window.render(t), i / 30);
    await p.evaluate(() => Promise.all([...document.images].map(i => i.decode?.().catch(()=>{}))));
    await p.locator('#sv').screenshot({ path: path.join(fr, `k${String(i).padStart(4, '0')}.png`) });
  }
  await b.close(); console.log('kare:', n);
})();
