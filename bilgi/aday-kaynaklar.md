# Aday Kaynaklar (onaylanmamış)
Yeni bulunan kaynaklar önce buraya yazılır, onaydan sonra kaynaklar.md'ye taşınır.

| Kaynak | Tür | Lisans | Maliyet | Neden faydalı | Risk |
|---|---|---|---|---|---|
| Wikimedia Commons | Görsel | SADECE "Public domain" veya "CC0" etiketli dosyalar | Ücretsiz | Arşiv fotoğrafları, haritalar | CC BY / CC BY-SA olanlar KULLANILMAZ (telif kuralı) |
| ~~Pexels / Pixabay~~ | Görsel/video | Kendi lisansları | – | – | REDDEDİLDİ: telif kuralı (kamu malı değil) |

## The Metropolitan Museum of Art – Open Access (eklendi 2026-11-19, ONAY BEKLİYOR)
- Ne: Met müzesinin kamu malı eserlerinin yüksek çözünürlüklü fotoğrafları (fotoğraflar, gravürler, kıyafetler, korseler).
- Lisans: CC0 1.0 – ticari kullanım serbest, atıf gerekmez. API'de "isPublicDomain: true" olanlar sadece.
- Maliyet: Ücretsiz. Risk: Çok düşük; sadece isPublicDomain=true olanlar alınır, eser üzerinde marka/logo varsa kullanılmaz.
- Erişim: collectionapi.metmuseum.org (v1.1 arama), images.metmuseum.org.
## Library of Congress (eklendi 2026-11-19, ONAY BEKLİYOR)
- 1929 öncesi yayımlanmış, "No known restrictions" ibareli eserler. Her eserin hak beyanı ayrıca kontrol edilir.

## Görselden video (hareketli klip) araçları (eklendi 2026-11-20, ONAY BEKLİYOR – karar Büşra'nın)
- Ne: Gemini görsellerimizi 5–6 sn'lik hareketli kliplere çevirmek (Böcek-3 tarzı akıcı hareket).
- Seçenekler:
  1. Arkadaşın aracı: bir deneme klibi geldi (medya/sutyen/referans/arkadas-klip-1-mary-cubuk.mp4); fiyat/şartlar bilinmiyor.
  2. Gemini uygulamasında video seçeneği (Büşra'nın planına bağlı; elle üretim, ben komut yazarım).
  3. Google Veo (Gemini API): ŞU AN YOK. Anahtarımızın model listesinde Veo görünmüyor (2026-11-20 kontrolü). Fiyat yaklaşık 0,10 $/sn
     (üçüncü taraf kaynaklara göre, resmi sayfadan doğrulanmadı) → 6 sn klip ≈ 30 TL.
  4. Diğer ücretli araçlar (Kling, Runway vb.): fiyat, ticari kullanım şartı ve yapay zekâ etiketi ayrıca kontrol edilir.
- Lisans: Her araçta ticari kullanım şartı kontrol edilir (CLAUDE.md 00.3). Gerçekçi görünen klip gerçek gibi sunulmaz; gerekirse YouTube'da yapay içerik işaretlenir.
- Maliyet: video başına 8–10 klip + yeniden denemeler ≈ 250–400 TL (hedef 80–90 TL'nin üstü). Gemini aylık sınırı: bu ay ~309 TL harcandı, sınır 350 TL.
- Risk: kalite/tutarlılık, yeniden deneme maliyeti, bütçe. Önce 2 deneme klibi, sonra karar.
- Durum 2026-11-20: Büşra'nın elinde video aracı yok. Gemini anahtarında Veo yok, makinede GPU yok, video servis siteleri (Replicate, fal, Kling, Runway) bu ortamdan açılmıyor. Deneme için önerilen yol: Google Flow'da ücretsiz kredi kontrolü (arama sonuçlarına göre ücretsiz kredi var, güncel durum doğrulanmadı) ya da arkadaşın aracı. Gemini uygulamasında fotoğraftan video ücretli plan istiyor (arama sonuçlarına göre).
