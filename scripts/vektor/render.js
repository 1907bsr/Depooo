// Kullanım: node scripts/vektor/render.js <sahne_id[,id2,...]|hepsi> [genişlik=960] [fps=24]
// Çıktı: medya/sutyen/vektor/sahne/<id>_<W>_<fps>/ kare JPEG'leri + <id>.mp4 (sessiz). İçerik değişmediyse önbellekten.
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs'), cp = require('child_process'), crypto = require('crypto');
(async () => {
  const root = path.resolve(__dirname, '../..'); const W = +(process.argv[3] || 960), fps = +(process.argv[4] || 24), H = Math.round(W * 9 / 16), NW = 4;
  const kod = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') || f.endsWith('.html')).sort().map(f => fs.readFileSync(path.join(__dirname, f))).reduce((h, b) => h.update(b), crypto.createHash('md5')).digest('hex');
  const b = await chromium.launch();
  const pages = await Promise.all(Array.from({ length: NW }, async () => {
    const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    p.on('pageerror', e => console.log('SAYFA HATASI:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('KONSOL:', m.text()); });
    await p.goto('file://' + path.join(__dirname, 'vektor.html')); await p.evaluate(x => window.init({ outW: x }), W); return p;
  }));
  let ids = process.argv[2] === 'hepsi' ? await pages[0].evaluate(() => window.sceneIds()) : process.argv[2].split(',');
  for (const id of ids) {
    const info = await pages[0].evaluate(i => window.sceneInfo(i), id);
    const out = path.join(root, 'medya/sutyen/vektor/sahne', `${id}_${W}_${fps}`); fs.mkdirSync(out, { recursive: true });
    const hf = path.join(out, 'hash.txt'), hash = kod + '|' + id + '|' + info.dur;
    if (fs.existsSync(hf) && fs.readFileSync(hf, 'utf8') === hash && fs.existsSync(path.join(out, id + '.mp4'))) { console.log('önbellekten:', id); continue; }
    fs.readdirSync(out).filter(f => f.endsWith('.jpg')).forEach(f => fs.unlinkSync(path.join(out, f)));
    const n = Math.round(info.dur * fps);
    await Promise.all(pages.map(async (p, w) => {
      for (let i = w; i < n; i += NW) {
        await p.evaluate(a => window.renderScene(a.id, a.t), { id, t: i / fps });
        await p.screenshot({ path: path.join(out, `kare_${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: W, height: H } });
      }
    }));
    cp.execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(out, 'kare_%05d.jpg'), '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(out, id + '.mp4')]);
    fs.writeFileSync(hf, hash); console.log(`${id}: ${n} kare (${info.dur.toFixed(1)} sn)`);
  }
  await b.close();
})();
