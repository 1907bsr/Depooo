#!/usr/bin/env bash
# Faz 0 test videosu: 15 saniyelik, sesli, altyazılı basit bir video üretir.
# Kullanım: bash scripts/test_videosu.sh
set -euo pipefail
cikis=medya/test/kurgu
mkdir -p "$cikis"
cat > "$cikis/test.srt" <<'SRT'
1
00:00:00,000 --> 00:00:05,000
Bu bir test videosudur.

2
00:00:05,000 --> 00:00:15,000
Kanal asistanı kurulum denemesi.
SRT
ffmpeg -y -loglevel error \
  -f lavfi -i "color=c=0x111111:s=1920x1080:d=15" \
  -f lavfi -i "sine=frequency=220:duration=15" \
  -vf "subtitles=$cikis/test.srt" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "$cikis/test.mp4"
ffmpeg -y -loglevel error -f lavfi -i "color=c=0x8b0000:s=1280x720" \
  -frames:v 1 "$cikis/kapak.jpg"
echo "Hazır: $cikis/test.mp4, $cikis/test.srt, $cikis/kapak.jpg"
echo "Yüklemek için:"
echo "  python scripts/yukle.py $cikis/test.mp4 --baslik 'TEST - silinecek' --kapak $cikis/kapak.jpg --altyazi $cikis/test.srt"
