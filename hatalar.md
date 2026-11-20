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
- DÜZELTME (Spend verisiyle): 23:00'te 254,72 TL → 23:19'da 308,93 TL; aradaki ~33 görsel ≈ 54 TL → görsel başı ~1,65 TL (tahmin doğruymuş).
  Asıl sebep: Google, sınıra YAKLAŞINCA (gecikmeli sayaç yüzünden ~%88'de) üretimi önceden durduruyor. Kumbarada ~190 TL kaldı.
- KURAL: Ücretli üretimden önce Spend sayfasındaki GERÇEK rakamla görsel başı fiyatı hesapla; tahmini EN PAHALI senaryoya göre ver.
- KURAL: Gerçek fiyat netleşene kadar ücretli üretim YOK.

## 2026-11-20 – Motor2 sırasında bulunan hatalar (öğrenilenler)
- Gemini'nin "düzenle" görsellerinde ince doku her yerde yeniden çizilir: A/B maskesi ham farkla çıkarılırsa %60-90 kaplar.
  KURAL: farkı önce 3 px bulanıklaştır, yoğun/anlamlı değişimi al, kenara yapışan küçük lekeleri at (scripts/motor2/maske_ab.py).
- Eski bilgi kliplerinde sert kodlu petrol mavisi (#2C727A, #0F3237) kalmıştı; renk değişkeni değiştirilince gitmemişti.
  KURAL: renk kararı değişince gradyan/sabit hex değerlerini de tara (grep).
- Caveat yazı tipinde "5" rakamı S gibi okunuyor: rakamlı ekran yazılarında Alegreya İtalik kalın kullan.
- Siyah kenar: hizalanmış B görsellerinde (s22B, s34B) sağ kenarda siyah şerit vardı; hizalamadan sonra kenar şeridini A'dan doldur.

## 2026-11-20 – Kamera "atlıyor" (sert çekim sınırı)
- Aynı fotoğrafı ~3 sn'de bir farklı kadraja SERT keserek "hızlı kesme" yapmıştım. Çözünürlük yüzünden kadraj farkı küçük kaldığı için (zoom ≤1,18)
  kesme gibi değil, titreme/atlama gibi göründü; dik fotoğraflarda (korse, patent) 180-350 px'lik dikey sıçrama vardı. 124 sınırın 70'i <40 px'ti.
- KURAL: Aynı görselde sert kesme yapma; kesintisiz kamera yolu kullan (scripts/motor2: yol_uret). Ölçüm: kareler arası fark/medyan > ~5 ise hata.
- A/B geçişlerinde ayrı üretilmiş (farklı boyutlu) B görselinin yerel kaymasını ölç ve düzelt (s15'te 3 px).

## 2026-11-20 – Cümle↔görsel sırası yanlıştı
- Açılışta ("sen" = Mary) 0:26-0:33 arasında başka dönemin masa başındaki bordo elbiseli kadını (s19) vardı: şakanın kelimelerine ("3 lokma", "dikişler")
  bakıp görsel seçtim, KİMİN anlatıldığına bakmadım. Büşra yakaladı.
- Aynı denetimde bulunanlar: mozaik→spor→mozaik sıçraması; para yığını fiyattan önce; Cadolle markası cümlesinde 1890'lar Eyfel fotoğrafı;
  kapanışta 25 sn tek resim; özet kartında noktalar kelimeden bağımsız çıkıyordu; ağlayan Mary ile para yığınını yanlışlıkla yer değiştirmişim (gönderilmeden yakalandı).
- KURAL: Önizlemeden önce kontrol listesi (kurgu_listesi.py) üret, tek tek oku: (1) kişi/dönem/nesne aynı mı, (2) görsel cümleyle birlikte mi geliyor,
  (3) aynı görsel arka arkaya mı. Listeyi Büşra'ya da gönder.
- KURAL: Süre tahmininde satır sonundaki '//' duraklamasını ikinci kez sayma (video 9,96 dk görünüyordu, gerçek tahmin ~8,8 dk).
