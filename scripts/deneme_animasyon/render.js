// Deneme sahnesini kare kare çizip mp4 + karakter kartı PNG üretir.
// Kullanım: node scripts/deneme_animasyon/render.js <çıkış_klasörü>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

(async () => {
  const out = path.resolve(process.argv[2] || 'medya/deneme-animasyon');
  const frames = path.join(out, 'kareler');
  fs.mkdirSync(frames, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  await page.goto('file://' + path.join(__dirname, 'sahne.html'));
  await page.evaluate(() => document.fonts.ready);
  const fps = 30, dur = await page.evaluate(() => window.DUR);
  const n = Math.round(dur * fps);
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    await page.locator('#sv').screenshot({ path: path.join(frames, `k${String(i).padStart(4, '0')}.png`) });
  }
  // Karakter kartı
  const p2 = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.5 });
  await p2.goto('file://' + path.join(__dirname, 'sahne.html'));
  await p2.evaluate(() => document.fonts.ready);
  await p2.evaluate(() => window.renderSheet());
  await p2.locator('#sv').screenshot({ path: path.join(out, 'mary-karakter-karti.png') });
  await browser.close();
  console.log('kareler hazır:', n);
})();
