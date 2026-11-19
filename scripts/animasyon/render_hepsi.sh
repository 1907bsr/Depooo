#!/bin/bash
# Sahne kliplerini üretir: bash scripts/animasyon/render_hepsi.sh 02 03 ... (boşsa hepsi)
# Çıktı: medya/sutyen/kurgu/sNN/sNN.mp4 (görüntü + efekt sesi)
cd "$(dirname "$0")/../.."
IDS="$@"; [ -z "$IDS" ] && IDS=$(grep -o "^  '[0-9]*'" scripts/animasyon/sahneler_sutyen.js | tr -d " '")
for s in $IDS; do
  o=medya/sutyen/kurgu/s$s${CIKIS_EK:-}; mkdir -p $o
  node scripts/deneme_animasyon/render_sahne.js scripts/animasyon/motor.html $o "s=$s" >/dev/null || { echo "HATA $s"; continue; }
  read DUR SFX < <(node -e "
    global.window={};const fs=require('fs');eval(fs.readFileSync('scripts/animasyon/sahneler_sutyen.js','utf8')+';global.S=SAHNELER');
    const s=S['$s'];let L=(s.sfx||[]).filter(x=>!/^(parilti|damga)@/.test(x));
    for(const e of (s.fx||[])) if(['etiket','damga','kutu','isim'].includes(e.tip)) L.push('tebesir@'+e.t+'@.55');
    console.log(s.dur, L.join(' '))")
  python3 scripts/muzik/sfx_mix.py $o/sfx.wav $DUR $SFX
  ffmpeg -y -loglevel error -framerate ${FPS:-30} -i $o/kareler/k%04d.png -i $o/sfx.wav -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -c:a aac -b:a 192k -shortest $o/s$s${CIKIS_EK:-}.mp4
  rm -rf $o/kareler; echo "tamam s$s"
done
