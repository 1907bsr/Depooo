# scripts/vektor – kodla çizilen 2B animasyon (denemesi, 2026-11-20)

Hiçbir dış görsel, ses veya ücretli araç yok: karakter, oda, sokak, proplar ve el yazısı notlar tamamen kodla çizilir (0 TL).
Yazı tipleri: Caveat, Alegreya (OFL). Büşra'nın ses kaydı gelince zamanlar sese göre ayarlanır.

- cekirdek.js  – matematik, yumuşak şekil çizimi, kalem/el yazısı, kâğıt dokusu
- mary.js      – Mary karakteri (yüz mimikleri, kollar, korse röntgeni, çubuklar)
- dekor.js     – oda, sokak, mobilyalar, aynası, proplar (+ test levhaları: ?mod=yuz | oda | test)
- acilis.js    – açılış sahnesi (0–41,6 sn): poz dizileri, kamera yolları, el yazısı notlar
- zaman.py     – okuma metninden kelime zamanları (hece ağırlıklı) → zaman_acilis.js
- kare.js      – seçilen anların tek kare PNG'leri (gözle kontrol)
- render.js    – tüm sahneyi kare kare render edip sessiz mp4 yapar:
                 node scripts/vektor/render.js medya/sutyen/vektor/k1 0 41.57 24 1280
