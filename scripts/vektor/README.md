# scripts/vektor – kodla çizilen 2B animasyon (Sütyen videosunun tamamı, 2026-11-20)

Hiçbir dış görsel, ses veya ücretli araç yok: karakter, oda, sokak, proplar ve el yazısı notlar tamamen kodla çizilir (0 TL).
Gerçek arşiv parçaları yalnızca küçük "kanıt" olarak girer (ABD patent çizimi, Met CC0 korse fotoğrafı; kanıtlar konular/sutyen/lisanslar.md).
Yazı tipleri: Caveat, Alegreya, Inter (OFL). Kamera kuralı: sağa-sola kayma yok; sabit kamera + yavaş yakınlaşma, yer değişimi kesmeyle.
Büşra'nın ses kaydı gelince kelime zamanları (zaman.py) gerçek sese göre değiştirilir.

- cekirdek.js  – matematik, yumuşak şekil çizimi, kalem/el yazısı (hand/pen), kâğıt dokusu
- mary.js      – karakter iskeleti (LOOK paletleri: saç, aksesuar, gözlük, bıyık; mimikler; kollar; korse röntgeni)
- kadro.js     – oyuncu kadrosu (Mary, hizmetçi, Cadolle, Otto, Reyburn, ... paletleri)
- sahne.js     – sahne kaydı (sahneS), poz sistemi (P/actor), kelime zamanı W(sahne, kelime)
- dekor.js, dekor2.js – oda, sokak, mobilya, props, kâğıt/etiket yardımcıları (pinnedPaper, crossOut, ...)
- acilis.js, sahneler1-6.js – 58 sahnenin tamamı (acilis = s01–s06; sahneler1: s08–s13 … sahneler6: n39–s33b)
- zaman.py     – okuma metninden kelime zamanları (hece ağırlıklı) → zaman_tum.js
- render.js    – sahneleri kare kare çizip sessiz mp4 yapar (kod değişmediyse önbellekten): node scripts/vektor/render.js hepsi 960 24
- birlestir.py – sahne klipleri → tek önizleme: python3 scripts/vektor/birlestir.py cikis.mp4 --sadece-cizim
- kare.js      – seçilen anların tek kare PNG'leri
- kurgu_listesi.py – cümle↔görsel kontrol listesi sayfaları (metin_hibrit.json)
- araclar/ozet_kareler.js + ozet_sayfa.py – bütün sahnelerde yazı/figür çakışma kontrolü (sahnenin %50 ve %92'sinde kare)

Figür boyutu: sahne.js `buyut(S, {k})` (FIGK 1,15 varsayılan, FIGO 1,22 açılış geniş çekimleri; actor(..., { k: 1 }) büyütmeyi kapatır). Baş üstü boşluk ≥ 80 px kalacak şekilde ayaklar aşağı iner.
Gerçek kanıt kartı: dekor2.js `kanitKart(ctx, t, IMG.x, t0, t1, x, y, w, h, rot, 'açıklama')`; görseller vektor.html'deki IMG yükleyicisinde (patent, met1, met2, met3, eiffel).
