// Kullanım: node scripts/motor2/render.js timeline.json sahne_id [sahne_id...]
// Çıktı: medya/sutyen/motor2/<id>/kare_00000.jpg + <id>.mp4 (sessiz). Sahne bazında önbellek.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
(async () => {
  const root = path.resolve(__dirname, '../..'); const tl = JSON.parse(fs.readFileSync(path.resolve(process.argv[2]), 'utf8'));
  const ids = process.argv.slice(3); const fps = +(process.env.FPS || tl.fps || 30); const OUTW = +(process.env.OUT_W || 1920), OUTH = Math.round(OUTW * 9 / 16); const Q = +(process.env.QUALITY || 93);
  const html = path.join(__dirname, 'motor2.html'); const htmlSrc = fs.readFileSync(html);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: OUTW, height: OUTH }, deviceScaleFactor: 1 });
  await p.goto('file://' + html);
  for (const id of ids) {
    const sc = tl.sahneler.find(s => s.id === id); if (!sc) { console.log('yok:', id); continue; }
    const S = { ...sc }; for (const k of ['img', 'imgB', 'maske']) if (S[k]) S[k] = 'file://' + path.resolve(root, S[k]);
    const stat = ['img', 'imgB', 'maske'].map(k => sc[k] && fs.existsSync(path.resolve(root, sc[k])) ? fs.statSync(path.resolve(root, sc[k])).mtimeMs : 0);
    const hash = crypto.createHash('md5').update(JSON.stringify(sc) + htmlSrc + stat.join() + OUTW + fps).digest('hex');
    const out = path.join(root, 'medya/sutyen/motor2', `${id}_${OUTW}_${fps}`); fs.mkdirSync(out, { recursive: true });
    const hf = path.join(out, 'hash.txt');
    if (fs.existsSync(hf) && fs.readFileSync(hf, 'utf8') === hash && fs.existsSync(path.join(out, id + '.mp4'))) { console.log('önbellekten:', id); continue; }
    fs.readdirSync(out).filter(f => f.endsWith('.jpg')).forEach(f => fs.unlinkSync(path.join(out, f)));
    const info = await p.evaluate(s => window.init(s.S, s.o), { S, o: { outW: OUTW } });
    const n = Math.round(sc.dur * fps); let yuzIhlal = 0;
    for (let i = 0; i < n; i++) {
      const ok = await p.evaluate(t => window.renderAt(t), i / fps); if (!ok) yuzIhlal++;
      await p.screenshot({ path: path.join(out, `kare_${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: Q, clip: { x: 0, y: 0, width: OUTW, height: OUTH } });
    }
    const uy = await p.evaluate(() => window.uyari());
    cp.execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(out, 'kare_%05d.jpg'), '-c:v', 'libx264', '-crf', String(+(process.env.CRF || 14)), '-pix_fmt', 'yuv420p', path.join(out, id + '.mp4')]);
    fs.writeFileSync(hf, hash);
    console.log(`${id}: ${n} kare, kaynak ${info.W}x${info.H}, yüz kadraj dışı kare: ${yuzIhlal}${uy.length ? ', UYARI: ' + uy.join('; ') : ''}`);
  }
  await b.close();
})();
