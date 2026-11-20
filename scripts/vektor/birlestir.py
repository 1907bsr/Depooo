"""Hibrit birleştirme: sahne başına kodla çizilmiş klip varsa onu, yoksa v9 önizlemesinden aynı süredeki parçayı alır; 960x540@24 sessiz.
Kullanım: python3 scripts/vektor/birlestir.py cikis.mp4 [--sadece-cizim]   (--sadece-cizim: çizimi olmayan sahne = siyah 'yok' kartı)"""
import json, subprocess, sys, os
ROOT = '/home/user/Depooo/'; V = ROOT + 'medya/sutyen/vektor/'; tmp = V + 'parca/'; os.makedirs(tmp, exist_ok=True)
M = json.load(open(ROOT + 'scripts/motor2/metin_tam.json', encoding='utf-8'))
V9 = ROOT + 'medya/sutyen/kurgu/onizleme-v9-motor2-hafif.mp4'
GRUP = {'acilis': ['s01', 's02', 's03', 's03b', 's04', 's02c', 's05', 's06']}
out = sys.argv[1]; sadece = '--sadece-cizim' in sys.argv
def run(*a): subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *a], check=True)
def klip(ad): 
    p = V + f'sahne/{ad}_960_24/{ad}.mp4'; return p if os.path.exists(p) else None
liste = []; atla = set(); eksik = []
for r in M:
    sid = r['sid']
    if sid in atla: continue
    grup = next((g for g, l in GRUP.items() if l[0] == sid), None)
    ad = grup or sid; bas = r['bas']; dur = r['dur']
    if grup:
        atla |= set(GRUP[grup][1:]); dur = sum(x['dur'] for x in M if x['sid'] in GRUP[grup])
    hedef = tmp + f'{ad}.mp4'; kl = klip(ad)
    nf = round((bas + dur) * 24) - round(bas * 24)   # kare sayısı birikimli yuvarlanır → toplamda kayma olmaz
    if kl: run('-i', kl, '-vf', f'fps=24,scale=960:540,setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=2,trim=end_frame={nf}', '-an', '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', hedef)
    elif sadece:
        run('-f', 'lavfi', '-i', f'color=c=0x2b2018:s=960x540:r=24:d={nf / 24:.4f}', '-vf', f"drawtext=text='{sid} (cizim yok)':fontcolor=white:fontsize=40:x=40:y=40", '-an', '-c:v', 'libx264', '-crf', '24', hedef); eksik.append(sid)
    else:
        run('-ss', f'{bas:.3f}', '-i', V9, '-vf', 'fps=24,scale=960:540,setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=2', '-frames:v', str(nf), '-an', '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', hedef); eksik.append(sid)
    liste.append(hedef)
open(tmp + 'liste.txt', 'w').write(''.join(f"file '{h}'\n" for h in liste))
run('-f', 'concat', '-safe', '0', '-i', tmp + 'liste.txt', '-an', '-c:v', 'libx264', '-crf', '23', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-r', '24', '-movflags', '+faststart', out)
d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]).decode())
print(f'tamam: {out} süre {d:.1f} sn; çizimi olmayan (v9\'dan): {len(eksik)} sahne: {" ".join(eksik)}')
