# Yol Haritası – İcatbuldum

Şu anki faz: **Faz 0 – Kurulum** (başlangıç: 2026-11-17)

## Faz 0 – Kurulum (1. hafta)
Çıkış şartı: Test videosu uçtan uca hatasız çıkıyor.
- [x] CLAUDE.md kaydedildi
- [x] Klasör yapısı, .gitignore (.env ve medya/ hariç)
- [ ] GitHub deposunu "Özel" yap (kurulum/github-ozel-depo.md) – **şu an herkese açık**
- [ ] Çalışma bilgisayarını belirle, araçları orada kur (Python, ffmpeg)
- [ ] Python kütüphanelerini kur (requirements.txt) – onay bekliyor
- [ ] YouTube kanalını aç (kanal adı belli olunca)
- [ ] Google Cloud projesi + YouTube Data API + Analytics API (kurulum/youtube-api.md)
- [ ] OAuth yetkisi ver, `scripts/youtube_yetki.py` testi
- [ ] API denetimi (audit) başvurusu – herkese açık yayın için gerekli olabilir
- [ ] Test videosu: `scripts/test_videosu.sh` → `scripts/yukle.py` ile "Özel" yükleme
- [ ] Medya yedeği yöntemini seç (kurulum/yedekleme.md)
- [x] Kanal adı: **İcatbuldum** (2026-11-19, kesin). YouTube + Instagram'da boş.
- [ ] Yeni e-posta aç → aynı gün @icatbuldum adresini YouTube, Instagram, TikTok'ta al (kurulum/hesap-acma.md)
- [x] Netleştir: mizah orta-yüksek, süre 8-12 dk, ses karşılaştırma testi
- [x] İlk senaryo taslağı: konular/sutyen/senaryo.md (onay bekliyor)
- [ ] Ses karşılaştırma testi (yapay ses vs kendi sesimiz, aynı 1 dk metin)
- [ ] Maskot seçimi (bilgi/maskot.md) – öneri: "Zaman yolcusu" karakteri (bilgi/gorsel-stil.md)
- [x] Görsel stil yönü: çizgi roman/dergi illüstrasyonu + karma kurgu (bilgi/gorsel-stil.md) – ONAYLANDI
- [x] Kapak formülü (petrol mavisi zemin + hardal yazı + "?") – ONAYLANDI
- [x] Proje ortamı "Depooo" oluşturuldu
- [ ] Google Gemini anahtarı ekle (aistudio.google.com) → deneme sahnesi (konular/sutyen/gorsel-plani.md) – BEKLİYOR
- [x] 20 konuluk ilk havuz: bilgi/konu-havuzu.md
- [ ] Yapay zekâ ses aracını seç ve özgün anlatıcı sesini tasarla (onay bekliyor)
- [ ] Ses testi: deneme metniyle örnek sahne

## Video 1: Sütyeni Kim Buldu? – durum
- [x] Araştırma + kaynakça
- [x] Senaryo taslak 1 → [ ] Mert/Büşra onayı
- [x] Okuma metni TASLAK 2 (esprili) – ONAYLANDI
- [x] Sahne planı (44 sahne)
- [ ] Ses: BÜŞRA'nın sesi. Bölüm 1 iki kez kaydedildi (kayit1, kayit2) – beğenilmedi, MİKROFONLA yeniden kaydedilecek. Versiyon seçimi bekliyor (öneri: doğal + gramofonlu replikler). Bölüm 2-7 bekleniyor
- [ ] Yapay zekâ görselleri (32) – BEKLİYOR (ödeme ya da ücretsiz Gemini uygulaması)
- [ ] B sahneleri (12 infografik) – 8/12 bitti (s10 logo, s11, s20, s26, s35, s36, s39, s43). Kalan: s7, s16 (görsel üstüne damga), s3/s12 etiketleri – ilgili görseller gelince
- [x] Hareketlendirilen yapay zekâ sahneleri: s01, s04
- [ ] Gemini API anahtarını ortama ekle (bilgisayardan: claude.ai/code → ortam Depooo → Edit → Network secrets; host generativelanguage.googleapis.com, header x-goog-api-key) – anahtar Google'da oluşturuldu
- [ ] Arşiv görselleri + lisanslar
- [x] Müzik: YOK (karar) · Efektler: 15'lik kütüphane ONAYLANDI (medya/efekt, scripts/muzik/efektler.py)
- [ ] Kurgu + altyazı
- [ ] Kapak (deneme hazır) + başlık/açıklama
- [ ] Shorts x3
- [ ] "Özel" yükleme (YouTube API kurulumu gerekli) → Büşra'nın onayı

## Faz 1 – İlk 5 video (2-6. hafta)
Her adım onaylı, odak kalite. Her videodan sonra "ne öğrendik" notu.
Çıkış şartı: Üretim süresi ve kalite oturdu.

## Faz 2 – Veriyle iyileştirme (6-10. video)
İlk /nis-analizi, izleyici tutma analizi, kapak testleri.

## Faz 3 – Düzen (10. videodan sonra)
Vaka havuzu, haftalık takvim, Shorts ritmi, yorum yönetimi.

## Faz 4 – Büyüme
Partner Programı, seriler/oynatma listeleri, topluluk gönderileri.
- [ ] (10-20 video sonra) İngilizce ses parçası: metin uyarlama + yapay zekâ sesi, YouTube çok dilli ses özelliği

## Aday fikirler
- Sonraki kanallar: true crime (fikirler/true-crime-kanali.md) + 2-3 fikir daha (gelecek)

## Durum – 2026-11-19 akşam (Sütyen videosu)
- ✅ 44 sahnenin tamamı klip olarak hazır (görüntü + yazı + efekt), 1/4 eski denemeler yeni motora taşındı.
- ✅ Ara sıra mimik (sahne başına tek göz kırpma/kısa ağız) – 15 sahnede, ücretsiz (mevcut varyantlar).
- ✅ Arşiv: Met Open Access (CC0) Eyfel 1890'lar fotoğrafı (s28), patent çizimi (s35).
- ✅ 3 kapak seçeneği, başlık/açıklama taslağı 2 (kullanıcıya gösterilecek).
- ⏳ BEKLENEN: Büşra'nın mikrofonla ses kaydı → kurgu (sahneleri sese oturtma, ağzı sese bağlama), altyazı.
- ⏳ BEKLENEN: @icatbuldum hesapları, YouTube API kurulumu, Özel yükleme. Sonra 3 Shorts.

## 2026-11-20 (gece) – Sütyen videosu: kod-çizim sürümü hazır
- ✅ 58 sahnenin tamamı kodla çizildi (scripts/vektor), 0 TL; Gemini görselleri kullanılmıyor (Büşra'nın kararı).
- ✅ Kamera sağa-sola kaymıyor (sabit kamera + yavaş yakınlaşma); figür hareketi, mimik, el yazısı notlar korundu.
- ✅ Çakışma/okunurluk kontrol turu: 25 düzeltme (hatalar.md'ye kural yazıldı). Sessiz önizleme v11: 8 dk 47 sn.
- ✅ Büşra v13 görsel önizlemesini onayladı (2026-11-20). Görseller kilitli; figürler büyütüldü, gerçek kanıt kartları (1885/1890 korse, Eyfel, patent, Korse A.Ş.) eklendi.
- ⏳ SIRADAKİ (Büşra): ses kaydı, 7 bölüm, önce 30 sn deneme (kurulum/ses-kaydi.md). Sonra: zamanları gerçek sese oturt, ses efektleri (sessiz/kısa), altyazı (.srt), kapak (3 seçenek), "Özel" yükleme, 3 Shorts (dikey yeniden çizim).
- ⏳ KARAR (Büşra): hareketli klip yöntemi – Böcek-3 tarzı akıcı hareket için 2 deneme klibi (bilgi/aday-kaynaklar.md: "Görselden video"). Sonra ses kaydı.
- ✅ Büşra'nın gönderdiği kombinezonlu kadın resmi kodla hareketlendirildi (6 sn döngü, 0 TL; scripts/hareket/karakter_hareketlendir.py). Ölçüm: kare farkı 0,24 (Böcek-3 3,66–6,26) → "canlı duruş", büyük hareket değil. Karar bekleniyor: bu seviye yeterli mi, değilse kolu ayırma denemesi / karakteri kod sistemine taşıma / video aracı.
