# Yol Haritası – NasılOldu?

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
- [ ] Kanal adı: "NasılOldu?" YouTube'da müsait mi kontrol et
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
- [ ] Ses: Mert'in sesi (doğal işleme). Bölüm 1 ✅ (medya/sutyen/ses/kayit1/bolum1-temiz) · Bölüm 2-7 bekleniyor
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

## Aday fikirler
- Sonraki kanallar: true crime (fikirler/true-crime-kanali.md) + 2-3 fikir daha (gelecek)
