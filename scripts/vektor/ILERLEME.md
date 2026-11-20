# Kod-çizim video – ilerleme (2026-11-20)
Karar (Büşra): TAMAMI kodla çizilen hareketli figürlerle (Gemini görselleri YOK); gerçek arşiv parçaları (Met korsesi, patent) küçük kanıt olarak kalabilir. Ekran sağ-sol kayması YOK (sabit kamera + yavaş zoom, kesme).
Önizleme tek seferde, sessiz, 960x540@24.
## Komutlar
- node scripts/vektor/render.js <sahne|hepsi> 960 24   (medya/sutyen/vektor/sahne/<id>_960_24/<id>.mp4; kod değişmediyse önbellekten)
- python3 scripts/vektor/birlestir.py medya/sutyen/kurgu/<cikis>.mp4   (çizimi olmayan sahne = v9'dan)
- python3 scripts/vektor/kurgu_listesi.py <video> <klasör>   (cümle↔görsel kontrol listesi; metin_hibrit.json)
- node scripts/vektor/kare.js <sahne> <küresel_sn,...> <önek> 960   (tek kare kontrol)
- python3 scripts/vektor/zaman.py   (kelime zamanları → zaman_tum.js; ses kaydı gelince gerçek zamanlarla değiştirilecek)
## Dosyalar
cekirdek.js mary.js(rig; LOOK paletleri) kadro.js(karakterler) dekor.js dekor2.js sahne.js(kayıt, poz sistemi) acilis.js sahneler1-6.js zaman.py render.js kare.js birlestir.py
## Durum
- 58 sahnenin tamamı çizildi ✓ (acilis=s01–s06, sahneler1: s08–s13, 2: s14–s20, 3: s21–s27+s18b, 4: s28–s02b, 5: s31–s38, 6: n39–s33b)
- Yapılacak: ses kaydı gelince zamanlama, ses efektleri (Büşra'nın promptu), altyazı, kapak, yükleme (Özel), Shorts (dikey düzen yeniden çizilir).
