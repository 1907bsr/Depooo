// Kullanım: node scripts/vektor/render.js <çıktı_klasörü> [başlangıç_sn] [bitiş_sn] [fps] [genişlik]
// Açılış sahnesini kare kare (4 paralel sayfa) JPEG olarak yazar, ardından ffmpeg ile sessiz mp4 yapar.
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs'), cp = require('child_process');
(async () => {
  const out = path.resolve(process.argv[2]); const t0 = +(process.argv[3] || 0), t1 = +(process.argv[4] || 41.57), fps = +(process.argv[5] || 24), W = +(process.argv[6] || 1280), H = Math.round(W * 9 / 16);
  fs.mkdirSync(out, { recursive: true }); fs.readdirSync(out).filter(f => f.endsWith('.jpg')).forEach(f => fs.unlinkSync(path.join(out, f)));
  const n = Math.round((t1 - t0) * fps), NW = 4;
  const b = await chromium.launch();
  const work = async w => {
    const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    p.on('pageerror', e => console.log('SAYFA HATASI:', e.message));
    await p.goto('file://' + path.join(__dirname, 'vektor.html')); await p.evaluate(x => window.init({ outW: x }), W);
    for (let i = w; i < n; i += NW) {
      await p.evaluate(t => window.renderAt(t), t0 + i / fps);
      await p.screenshot({ path: path.join(out, `kare_${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 93, clip: { x: 0, y: 0, width: W, height: H } });
    }
    await p.close();
  };
  await Promise.all(Array.from({ length: NW }, (_, w) => work(w)));
  await b.close();
  cp.execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(out, 'kare_%05d.jpg'), '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', path.join(out, 'ornek.mp4')]);
  console.log('tamam:', n, 'kare →', path.join(out, 'ornek.mp4'));
})();
