"""Tüm motor2 sahnelerini paralel çeker (düşük çözünürlük: 960x540, 15 fps). Kullanım: python3 scripts/motor2/render_tam.py [işçi_sayısı]"""
import json, subprocess, sys, os
ROOT = '/home/user/Depooo/'
tl = json.load(open(ROOT + 'scripts/motor2/timeline_tam.json'))
N = int(sys.argv[1]) if len(sys.argv) > 1 else 4
sc = sorted(tl['sahneler'], key=lambda s: -s['dur'])
kova = [[0, []] for _ in range(N)]
for s in sc:
    k = min(kova, key=lambda x: x[0]); k[0] += s['dur']; k[1].append(s['id'])
env = dict(os.environ, OUT_W='960', FPS='15', QUALITY='80', CRF='24')
ps = []
for i, (top, ids) in enumerate(kova):
    log = open(f'/tmp/claude-0/-home-user-Depooo/4e8c5f5c-006c-51cf-9438-5dca13e70379/scratchpad/isci{i}.log', 'w')
    ps.append(subprocess.Popen(['node', ROOT + 'scripts/motor2/render.js', ROOT + 'scripts/motor2/timeline_tam.json', *ids], stdout=log, stderr=subprocess.STDOUT, env=env))
    print(f'işçi {i}: {len(ids)} sahne, {top:.0f} sn', flush=True)
for p in ps: p.wait()
print('bitti')
