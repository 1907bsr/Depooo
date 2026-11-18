#!/usr/bin/env bash
# Telefon kaydını temizler. Kullanım: bash scripts/ses/duzenle.sh <giris> <cikis.wav> [dogal|kalin|spiker]
set -euo pipefail
IN=$1; OUT=$2; MOD=${3:-dogal}
TEMIZ="highpass=f=70,afftdn=nf=-58:nr=10,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.15:stop_periods=-1:stop_duration=0.75:stop_threshold=-48dB:stop_silence=0.5,deesser=i=0.4"
case $MOD in
  dogal)  TON="equalizer=f=250:t=q:w=1.2:g=-2,equalizer=f=3500:t=q:w=1:g=2,highshelf=f=10000:g=1.5,acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2,loudnorm=I=-16:TP=-1.5:LRA=7";;
  kalin)  TON="asetrate=48000*0.9439,aresample=48000,atempo=1.0595,lowshelf=f=160:g=3,equalizer=f=300:t=q:w=1.2:g=-1.5,equalizer=f=3200:t=q:w=1:g=2,acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2,loudnorm=I=-16:TP=-1.5:LRA=7";;
  spiker) TON="lowshelf=f=120:g=3.5,equalizer=f=280:t=q:w=1.2:g=-2.5,equalizer=f=4200:t=q:w=1:g=3.5,highshelf=f=9000:g=2,acompressor=threshold=-26dB:ratio=5:attack=3:release=70:makeup=3,loudnorm=I=-16:TP=-1.5:LRA=5";;
esac
ffmpeg -y -v error -i "$IN" -ac 1 -ar 48000 -af "$TEMIZ,$TON" "$OUT"
