# Kukla (eklemli kesip-bölme) hareket düzeneği

Tek bir karakter resmini (düz arka plan, önden, ayakta) **eklem yerlerinden parçalara ayırır** ve parçaları kodla döndürerek hareket ettirir. 0 TL.
Resmin çizim tarzı aynen kalır (resim yeniden çizilmez; kesilip eklemlenir).

## Adımlar (çalışma klasöründe `kaynak.png` olmalı; betikler bu klasöre yazar)
```
export KUKLA_KAYNAK=kaynak.png
S=<depo>/scripts/hareket/kukla
python3 $S/ayir_arkaplan.py    # duvar, figür siluet, iki kolun cilt çekirdeği
python3 $S/parcala.py          # baş, gövde, kollar (sahiplik kuralları)
python3 $S/katman.py           # RGBA katmanlar (kol 3 parça: omuz-dirsek-bilek) + temiz arka plan dolgusu
python3 $S/plaka2.py           # etek kenarını kolların arkasında tamamla, artık çizgileri temizle
python3 $S/canlandir.py kareler 8   # 8 sn el sallama (kare PNG'leri)
ffmpeg -framerate 24 -i kareler/k_%04d.png -vf "crop=686:1024:0:0" -c:v libx264 -crf 14 -pix_fmt yuv420p cikis.mp4
```
Ölçüm (yırtılma kontrolü için): `scripts/hareket/katlanma_olc.py` (warp tabanlı eski yöntem içindir).

## Bu resme göre elle ayarlı olanlar (başka karakterde güncelle)
- `ayir_arkaplan.py`: duvar tohum noktaları, kol cilt tohumları
- `parcala.py`: baş çokgeni (saç + yüz + bukleler; boyun kesimi)
- `katman.py`: eklem merkezleri `J` (omuz, dirsek, bilek, boyun, bel), yuvarlak kapak yarıçapları `RE`, `RW`, boyun uzantısı
- `plaka2.py`: kolların arkasında kalan etek kontur noktaları (ölçülür)
- `yuz.py`: göz/kaş/ağız/bukle koordinatları
- `canlandir.py`: zamanlama (kol kalkışı, sallama, yüz)

## Katman sırası (arkadan öne)
arka plan(plaka) → el → ön kol → üst kol (sol, sağ) → gövde → baş. Üst parça alttakinin üstündedir (dirsek/bilek yuvarlak kapakları).

## Eklem dostu kaynak resim (en iyi sonuç için)
Önden, tam boy, düz tek renk arka plan; **kollar gövdeden ~30° açık, eller açık, bacaklar hafif aralık**. Uzun etek bacakları örtüyorsa bacak hareketi yapılamaz.
Yürüme için aynı karakterin yan görünüşü ayrıca gerekir.

## Çıkarılan dersler (hatalar.md'de de var)
- Katman alfasını bulanıklaştırma: iç kenarlar sert (alfa 1), duvara bakan dış kenar duvar rengine göre mat çıkarılır.
- Kol sahipliği: çekirdek + 3 px içindeki çizgi + 1 px saçak; etek tarafındaki krem halkayı alma.
- Yuvarlak eklem kapaklarının kenarı 3 px yumuşatılır (noktalı halka çıkmasın).
- Kolların arkasında kalan etek konturu ölçülüp yeniden çizilir; plaka dolgusu "tam" duvar dolgusundan alınır.
- Gövdenin alt kenarı yumuşak biter (nefes hareketinde dikiş çizgisi görünmesin); boyun derisi çenenin altına uzatılır.
