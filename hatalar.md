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

## 2026-11-20 – Kod-çizim videoda yazı/figür çakışmaları (önizlemeden önce yakalandı)
- Ilk sürümde (v10) şunlar vardı: yazı figürün yüzünü/saçını örtüyor (Cadolle etiketi, "senin yerine biz sinirlendik" + "hem de bayağı", "Mary Phelps Jacob"),
  yazı kare dışına taşıyor ("ekstrem spor", "küçük bir terzi dükkânı"), açık zeminde BEYAZ yazı okunmuyor (mozaikte top/ağırlık/bant/şort),
  kırmızı yazı yeşil/kahve zeminde okunmuyor ("Lengberg Şatosu", "düşman!"), etiket başka etiketin üstüne biniyor (apodesmos ↔ not kâğıdı, polisin tabelası ↔ başlık),
  kol/el yazının üstüne biniyor (s44a), kart ızgarası kare dışına taşıyor (s27), tabela kâğıdına sığmayan yazı (AYRI satılır), yüze giden ok (apodesmos, Cadolle).
- Neden kaçtı: kontrol listesi sahnenin %40'ındaki tek kareyi gösterir; el yazıları o anda yarım olduğu için çakışma görünmez.
- KURAL: Önizlemeden önce `node scripts/vektor/araclar/ozet_kareler.js 0.5,0.92 <klasör> 640` + `python3 scripts/vektor/araclar/ozet_sayfa.py <klasör> 92 <önek>` ile
  her sahnenin ORTASINDA ve YAZILAR TAMAMLANMIŞKEN (%92) kare üret, tek tek bak: (1) yazı yüzü/elleri örtüyor mu, (2) kare dışına taşıyor mu,
  (3) kontrast yeterli mi (açık zeminde beyaz, koyu zeminde kırmızı/koyu yazı yok), (4) iki etiket üst üste mi, (5) ok yüzün üstünden geçiyor mu.
  Okunmayan yazıyı kâğıt etiketle (pinnedPaper / tagAt) yap. Bu kontrol 3 saniye sürer, tam render 5 dakikadır: ÖNCE kontrol, SONRA render.

## 2026-11-20 – Havaya kalkan kollar ters, boyut büyüyüp küçülüyor, "gerçek görüntü" yanlış anlaşıldı (Büşra izleyince yakaladı)
- Kollar: ik() dirseği hep aynı tarafa koyuyordu; el omuz hizasının üstüne çıkınca dirsek yukarı bakıp kol ters görünüyordu. KURAL: el omuzdan yukarıdaysa dirsek aşağı/dışarı (mary.js drawArm, yumuşak karışım). Yeni poz eklerken havaya kalkan kolları görsel kontrol et.
- Boyut: her sahnede %3-8 yavaş yakınlaşma + sahne sonunda kesme = "büyüyüp küçülüyor" izlenimi. KURAL: sahne içi yakınlaşma yok (ZOOMK=0).
- Gerçek görüntü: Büşra v9'daki mozaik/spor Gemini çizimlerini "gerçek görüntü" sanıyordu ve onların yerine kod çizimini görünce şaşırdı. KURAL: Bir görseli değiştirirken ne olduğunu açıkça söyle ("Gemini çizimiydi, gerçek fotoğraf değildi, kod çizimi yaptım"); Büşra'nın beğendiği bir görseli ONAYSIZ başka görselle DEĞİŞTİRME.

## 2026-11-20 gece – Resim bükme (warp) hareketinde yırtılma/katlanma ve kayan maskeler (kendi kontrolümde yakaladım, Büşra görmeden)
- Kol uzun bir kaldıraçtır: omuzda 3° dönme elde ~19 px yer değiştirme yapar; maske kenarında alan katlanır → eller yırtıldı, dışarıda koyu leke çıktı (ilk sürümde 63/72 karede).
  KURAL: bükme alanı kesin olarak scripts/hareket/katlanma_olc.py ile ölçülür (çizgili yerlerde Jacobian determinantı ≥ 0,4); eller/uzun parçalar için dönme yerine "elde en çok" yanal sarkma ≤ 3 px kullan.
- Maskeleri kaynak resimde çizip hareket alanını çıktı pikseline okursan salınma maskeleri kaydırır (asimetrik gülümseme, kaçan iris). KURAL: alan kaynak noktasının gittiği yeri verir; ters koordinat sabit nokta yinelemesiyle bulunur (karakter_hareketlendir.py backward()).
- Saç bukle maskesine yüz/çene çizgisi girerse koyu çizgi sürüklenip leke yapar. KURAL: cilt bölgesini 5 px genişletip maskeden çıkar, geçişi yumuşat.
- Yarı saydam yama (RGBA) bulanıklaştırılırsa kenarda koyu halka çıkar (göz kırpmada "halka halka göz"). KURAL: göz çevresini cilt rengiyle difüzyonla doldurup temiz kapak yap, kapak kenarını çizerek ekle; yamayı RGB olarak harmanla.
- Görsel kontrol yetmez: 6 karelik küçük özet elleri/kenarları göstermiyor. KURAL: hareketli bir resim teslim etmeden önce eller, saç uçları ve kenarlar 4-5x büyütülüp en uç hareket karelerinde bakılır.
