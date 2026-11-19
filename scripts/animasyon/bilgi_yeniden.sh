#!/bin/bash
# Eski bilgi sahnelerini (bilgi2 / bilgi_sahneleri) yeniden çizer, mevcut efekt sesini korur.
cd "$(dirname "$0")/../.."
for p in "bilgi2:10" "bilgi2:11" "bilgi2:20" "bilgi2:26" "bilgi2:39" "bilgi2:43" "bilgi_sahneleri:35" "bilgi_sahneleri:36"; do
  h=${p%%:*}; s=${p##*:}; o=medya/sutyen/kurgu/s$s
  eski=$(ls $o/*.mp4 | grep -v -- '-patent\|-para' | head -1)
  ffmpeg -loglevel error -y -i "$eski" -vn -c:a pcm_s16le $o/ses_eski.wav
  node scripts/deneme_animasyon/render_sahne.js scripts/deneme_animasyon/$h.html $o "s=$s" >/dev/null || { echo "HATA $s"; continue; }
  ffmpeg -loglevel error -y -framerate 30 -i $o/kareler/k%04d.png -i $o/ses_eski.wav -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -b:a 192k -shortest "$eski"
  rm -rf $o/kareler; echo "tamam s$s"
done
