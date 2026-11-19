# Hatalar ve Çıkarılan Kurallar

Format: Tarih – Ne oldu – Neden – Bundan sonraki kural

(Henüz kayıt yok.)

- 2026-11-18 – Gemini'den gelen ilk Mary görselinde (s04) eteğin alt kısmı aşırı şeffaf, iç çamaşırı görünüyordu – Tarif "sheer gown" diyordu – KURAL: Görsel tariflerine her zaman "fully opaque skirt, modest, family-friendly" ekle; gelen görselleri müstehcenlik açısından kontrol et, gerekirse kadrajla kırp.

- 2026-11-18 – Okuma metninde (TASLAK 3/3.1) durak işaretlerinin önüne gereksiz virgüller (özneden sonra, "ama" öncesi), anlamsız "Çünkü" ve zaman uyumsuzluğu vardı; Mert fark etti – Neden: "/" duraklarını virgülle karıştırdım – KURAL: Metni teslim etmeden önce her cümleyi "/" işaretlerini yok sayarak oku; Türkçe noktalama kurallarına göre kontrol et (CLAUDE.md YAZIM KURALI).

## 2026-11-19 – Denemesiz toplu üretim (yaklaşık 100 TL boşa)
- Ne oldu: Yüz mimiği (göz kırpma/ağız) yöntemi küçük bir denemeyle onaylatılmadan 20 sahneye birden uygulandı.
  Gemini varyantları tutarsız çıktı (tek göz kırpma, kayma), hareketler sürekli ve doğal değildi. ~100 görsel deneme/yanlış.
  Ayrıca kullanıcı "ara sıra mimik" istemişti; sürekli oynatıldı (istek yanlış anlaşıldı).
- KURAL: Yeni bir yöntem/araç önce 1-2 örnekle denenir, kullanıcıya gösterilir, onay gelmeden toplu üretim YAPILMAZ.
- KURAL: Kullanıcı "şimdi değil / bekle" dediğinde yeni iş başlatılmaz; sadece söyleneni yap.
- KURAL: Harcama tahmini verirken gerçek sayıyı say (deneme ve tekrarlar dahil), düşük tahmin verme.

## 2026-11-19 – "Sen üret" = ücretsiz sanıldı (~7 TL)
- Ne oldu: Büşra ücretsiz yolu kastederek "sen üretsene" dedi; Claude ücretli API ile 4 görsel üretti.
- KURAL: Claude'un ürettiği HER görsel ücretlidir (Gemini API). Ücretsiz yol sadece Büşra'nın telefonundaki
  Gemini uygulamasıdır. Onay cevabı belirsizse ("yap", "üret") üretmeden önce "Ücretli (X TL) mi, ücretsiz
  (sen uygulamadan) mı?" diye açıkça sor.

## 2026-11-19 – Gemini ödeme türü yanlış anlatıldı
- Claude "kumbara yok, ay sonu karttan çekilir" dedi; oysa hesap ÖN ÖDEMELİ (prepay). Kredi bitince API 402 veriyor.
- KURAL: Bilmediğin ödeme/fatura bilgisini kesinmiş gibi söyleme; "kontrol edelim" de. Kalan krediyi Büşra AI Studio > Billing'den görür.

## 2026-11-19 – Maliyet yine düşük tahmin edildi (350 TL sınırı doldu)
- Claude "245 TL fazlasıyla yeter, 30 kare ~55-70 TL" dedi; referanslı ve uzun tarifli üretimler pahalıya geldi, 350 TL aylık sınır doldu.
- Sebep: Görsel başı 1,7 TL en basit üretime göre; referans görsel + uzun tarif ek ücret (giriş birimi). Gerçek ~2,5-3 TL olabilir.
- KURAL: Ücretli üretimden önce Spend sayfasındaki GERÇEK rakamla görsel başı fiyatı hesapla; tahmini EN PAHALI senaryoya göre ver.
- KURAL: Gerçek fiyat netleşene kadar ücretli üretim YOK.
