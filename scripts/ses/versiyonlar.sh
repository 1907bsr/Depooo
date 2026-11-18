#!/usr/bin/env bash
# kesilmis.wav'dan 4 versiyon üretir. Kullanım: bash scripts/ses/versiyonlar.sh <klasor> <onek> [replik_bas replik_bit]
set -euo pipefail
D=$1; P=$2; QA=${3:-}; QB=${4:-}
T="highpass=f=70,afftdn=nf=-55:nr=12,deesser=i=0.4"
N="loudnorm=I=-16:TP=-1.5:LRA=7"
cd "$D"
ffmpeg -y -v error -i kesilmis.wav -af "$T,equalizer=f=250:t=q:w=1.2:g=-2,equalizer=f=3500:t=q:w=1:g=2,highshelf=f=10000:g=1.5,acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2,$N" -ar 48000 -ac 2 $P-1-dogal.wav
ffmpeg -y -v error -i kesilmis.wav -af "$T,asetrate=48000*0.9439,aresample=48000,atempo=1.0595,lowshelf=f=160:g=3,equalizer=f=300:t=q:w=1.2:g=-1.5,equalizer=f=3200:t=q:w=1:g=2,acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2,$N" -ar 48000 -ac 2 $P-2-kalin.wav
ffmpeg -y -v error -i kesilmis.wav -af "$T,lowshelf=f=120:g=3.5,equalizer=f=280:t=q:w=1.2:g=-2.5,equalizer=f=4200:t=q:w=1:g=3.5,highshelf=f=9000:g=2,acompressor=threshold=-26dB:ratio=5:attack=3:release=70:makeup=3,loudnorm=I=-16:TP=-1.5:LRA=5" -ar 48000 -ac 2 $P-3-spiker.wav
if [ -n "$QA" ]; then
  L=$(python3 -c "print(round($QB-$QA,3))")
  ffmpeg -y -v error -i $P-1-dogal.wav -filter_complex "\
[0]atrim=0:$QA,asetpts=N/SR/TB[a];\
[0]atrim=$QA:$QB,asetpts=N/SR/TB,highpass=f=380,lowpass=f=3000,vibrato=f=0.9:d=0.08,asoftclip=type=atan:param=1.6,volume=0.9[q];\
anoisesrc=d=$L:c=white:a=0.02:r=48000,highpass=f=2000,lowpass=f=6000,volume=0.6,aformat=channel_layouts=stereo[n];\
aevalsrc='if(lt(mod(t*37.3\,1)\,0.02)\,0.25*(random(0)-0.5)\,0)':s=48000:d=$L,aformat=channel_layouts=stereo[c];\
[q][n][c]amix=inputs=3:normalize=0:duration=first[qq];\
[0]atrim=$QB,asetpts=N/SR/TB[b];[a][qq][b]concat=n=3:v=0:a=1[m]" -map "[m]" $P-4-gramofon.wav
fi
for f in $P-*.wav; do ffmpeg -y -v error -i $f -c:a aac -b:a 192k ${f%.wav}.m4a; done
