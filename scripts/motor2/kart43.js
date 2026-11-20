// 'Peki sütyeni kim buldu?' özet kartını (eski bilgi2.html, s=43) anlatıma bağlı zamanla çeker.
// Zaman bükme: çıktı zamanı τ → kartın kendi zamanı t_old (parça parça doğrusal; kart içindeki animasyon aynen kalır).
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), cp = require('child_process');
(async () => {
  const root = path.resolve(__dirname, '../..'); const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'kart43.json'), 'utf8'));
  const fps = 15, A = cfg.anchors;
  const warp = tau => { if (tau <= A[0][0]) return A[0][1]; for (let i = 0; i + 1 < A.length; i++) if (tau <= A[i + 1][0]) { const u = (tau - A[i][0]) / Math.max(1e-6, A[i + 1][0] - A[i][0]); return A[i][1] + (A[i + 1][1] - A[i][1]) * u; } return A[A.length - 1][1]; };
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 0.5 });
  await p.goto('file://' + path.join(root, 'scripts/deneme_animasyon/bilgi2.html') + '?s=43'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  for (const [ad, t0, D] of [['s43', 0, cfg.D1], ['s43b', cfg.D1, cfg.D2]]) {
    const out = path.join(root, 'medya/sutyen/motor2/kart43', ad); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
    const n = Math.ceil(D * fps) + 1;
    for (let i = 0; i < n; i++) {
      await p.evaluate(t => window.render(t), warp(t0 + i / fps));
      // zaman çizgisi henüz çizilmediyse (uzunluk < 14 px) yuvarlak uçlu minik 'leke' görünmesin
      await p.evaluate(() => document.querySelectorAll('#sv line[stroke-width="9"]').forEach(l => { if (+l.getAttribute('x2') - +l.getAttribute('x1') < 14) l.setAttribute('stroke-opacity', '0'); }));
      await p.locator('#sv').screenshot({ path: path.join(out, `k${String(i).padStart(4, '0')}.png`) });
    }
    cp.execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(out, 'k%04d.png'), '-vf', 'scale=960:540', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(root, 'medya/sutyen/motor2/kart43', ad + '.mp4')]);
    fs.rmSync(out, { recursive: true, force: true }); console.log(ad, n, 'kare');
  }
  await b.close();
})();
