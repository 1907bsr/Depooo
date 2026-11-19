"""plan_tam.json'a göre tüm sahneleri (motor2 klipleri + beğenilen eski zaman çizelgesi kartları) tek sessiz videoda birleştirir.
Kullanım: python3 scripts/motor2/birlestir.py cikis.mp4"""
import json, subprocess, sys, os, shutil
ROOT = '/home/user/Depooo/'; M = ROOT + 'medya/sutyen/motor2/'
plan = json.load(open(ROOT + 'scripts/motor2/plan_tam.json')); out = sys.argv[1]
tmp = M + 'parca/'; os.makedirs(tmp, exist_ok=True)
shutil.copy(ROOT + 'scripts/fontlar/Caveat[wght].ttf', '/tmp/caveat.ttf')
def run(*a): subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *a], check=True)
from PIL import Image, ImageDraw, ImageFont
def katman(yol, metin, boy, renk, yf, tip='caveat'):
    """960x540 saydam PNG: kalın (700) Caveat, koyu kontur. İnce hâlinde '5' rakamı 'S' gibi okunuyor."""
    if tip == 'alegreya': f = ImageFont.truetype(ROOT + 'scripts/fontlar/Alegreya-Italic[wght].ttf', boy); f.set_variation_by_axes([800])
    else: f = ImageFont.truetype(ROOT + 'scripts/fontlar/Caveat[wght].ttf', boy); f.set_variation_by_axes([700])
    im = Image.new('RGBA', (960, 540), (0, 0, 0, 0)); d = ImageDraw.Draw(im); w = d.textlength(metin, font=f)
    d.text(((960 - w) / 2, 540 * yf), metin, font=f, fill=renk, stroke_width=6, stroke_fill=(42, 29, 22, 255)); im.save(yol)
def kaplama(vf_ana, t0, png):
    return f"[0:v]{vf_ana}[b];[1:v]format=rgba,fade=t=in:st={t0:.2f}:d=0.5:alpha=1[o];[b][o]overlay=0:0:shortest=1[v]"
liste = []
for e in plan:
    ad = e['id']; D = e['dur']; hedef = tmp + ad + '.mp4'
    if e['tur'] == 'motor2':
        kaynak = M + f'{ad}_960_15/{ad}.mp4'
        run('-i', kaynak, '-vf', f'fps=15,scale=960:540,format=yuv420p,tpad=stop_mode=clone:stop_duration=1,trim=0:{D}', '-an', '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', hedef)
    else:
        y = e.get('yazi'); png = None
        if y:
            t0 = max(.4, D * y['son']) if y.get('oran') else max(.4, D - y['son'])
            png = tmp + ad + '-yazi.png'; katman(png, y['metin'], y['boy'], (224, 106, 80, 255), y['y'], y.get('tip', 'caveat'))
        def cikis(girdi, vf_ana):
            if png: run(*girdi, '-loop', '1', '-framerate', '15', '-i', png, '-filter_complex', kaplama(vf_ana, t0, png), '-map', '[v]', '-t', str(D), '-an', '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', hedef)
            else: run(*girdi, '-vf', vf_ana, '-t', str(D), '-an', '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', hedef)
        if 'dondur' in e:   # tek kareyi dondur
            kare = tmp + ad + '.png'; run('-ss', str(e['dondur']), '-i', ROOT + e['yol'], '-frames:v', '1', kare)
            cikis(['-loop', '1', '-framerate', '15', '-t', str(D), '-i', kare], 'scale=960:540,setsar=1,format=yuv420p')
        else:
            kd = e['bit'] - e['bas']; f = min(max(D / kd, 1.0), e['max'])
            vf = f"trim={e['bas']}:{e['bit']},setpts=(PTS-STARTPTS)*{f:.4f},fps=15,scale=960:540,setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration={max(0, D - kd * f) + 1:.2f},trim=0:{D}"
            cikis(['-i', ROOT + e['yol']], vf)
    liste.append(hedef)
open(tmp + 'liste.txt', 'w').write(''.join(f"file '{h}'\n" for h in liste))
run('-f', 'concat', '-safe', '0', '-i', tmp + 'liste.txt', '-an', '-c:v', 'libx264', '-crf', '24', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-r', '15', '-movflags', '+faststart', out)
d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]).decode())
print(f'tamam: {out}  süre {d:.1f} sn ({d / 60:.2f} dk), plan {sum(e["dur"] for e in plan):.1f} sn')
