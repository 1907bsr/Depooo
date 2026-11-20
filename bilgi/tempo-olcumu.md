# Tempo ölçümü – Sütyen v9 önizlemesi ve Böcek-3 referansı (2026-11-20)

Büşra'nın sorusu: "Bu edite bakınca sence insanlar durup izler mi? Böcek videosundaki gibi akıcı değil."
Dürüst cevap: Şu hâliyle büyük ihtimalle Böcek-3 kadar tutmaz. Senaryo/espri/gerçek arşiv güçlü; görsel tempo zayıf.
Kesin değil: kanal yayında değil, izleyici tutma verisi yok; bu bir ölçüm + gözlem tahminidir.

## Yöntem (kaba)
- 160x90 gri, 15 kare/sn; ardışık kareler arası ortalama fark. Betik: kiyas2.py / zayif.py (geçici, depoda yok).
- Referans: Büşra'nın gönderdiği 2 ekran kaydı (10,2 sn ve 15,2 sn; ortadan 16:9 kırpıldı). Örnek ÇOK küçük (25 sn).
- Ölçüt kamera/büyük hareketi sayar; küçük yerel değişimleri (el yazısı, A/B mimik, kart içi beliren düğümler) az sayar.

## Sonuçlar
| | kare farkı ort. | saniyelerin % kaçında güçlü hareket (>4) | neredeyse donuk (<0,5) |
|---|---|---|---|
| Böcek kayıt 1 (10 sn) | 6,26 | %60 | %0 |
| Böcek kayıt 2 (15 sn) | 3,66 | %47 | %27 |
| Bizim v9 (527 sn) | 1,93 | %12 | %21 |

Yapı sayıları (timeline): 58 sahne, ort. 9,1 sn; 11 sahne >=12 sn (%37); 5 sahne >=20 sn (%20);
10 A/B mimik değişimi; 7 yerel animasyonlu sahne; ~4,6 sn'de bir görünür yeni olay; toplam ~123 sn (%23) sadece yavaş kamera.

## En zayıf yerler (v9)
- 7:16-8:47 (son 1,5 dk): gazete/kağıt 21 sn, özet kartı 21 sn, tahta 14 sn – neredeyse donuk.
- 2:01 s15 spor sahnesi 15 sn; 5:41 s36 12 sn; 6:37 s41b 18,6 sn (güçlü kare %5).
- Açılışın ilk 1 dakikası kamera hareketi en düşük bölgelerden (yerel mimik/yazı var) – ilk 30 sn en kritik yer.

## Neden Böcek-3 daha akıcı
Karakter/nesne gerçekten hareket ediyor (görselden video üretimi), çekimler çok kısa, ses tasarımı ritim veriyor.
Bizde: durağan resim + yavaş kamera. Kodla bu farkın tamamı kapanmaz.

## Seçenekler (Büşra'nın kararı bekleniyor; onaysız harcama/üretim YOK)
1. Tempo paketi (ücretsiz, Claude): uzun sahneleri 3-5 sn'lik çekimlere böl (aynı görselin farklı planları, sadece espri anında net kesme),
   her cümleye bir olay (çizilen daire/ok, beliren nesne), son 1,5 dk'yı canlandır, sessiz efektler. Etki: orta.
2. Derinlik hareketi (ücretsiz, Büşra'nın telefonundan): 8-10 kilit görselden kişi silinmiş boş arka plan ("Bu görselden kişiyi tamamen
   kaldır… Başka hiçbir şeyi değiştirme.") + birkaç A/B mimik çifti. Etki: orta-yüksek.
3. Gerçek hareket (ücretli ya da arkadaşın aracı): 8-10 kilit espri anında 5-6 sn'lik görselden-video klibi. Kaba tahmin 150-250 TL/video
   (hedef 80-90 TL'nin üstü; araca göre değişir). Önce 1-2 örnek + net fiyat + ticari kullanım şartı kontrolü. Etki: en yüksek.

## Kodla hareket denemesi: tek Gemini resmi (2026-11-20 gece)
Soru (Büşra): "Gemini resimlerini kodla hareket ettiremiyor musun?" → s37b (ağlayan Mary) üzerinde 5 sn: nefes, 2 hıçkırık (omuz kalkması + sarsılma), baş eğme/eğilme,
dudak titremesi, eller+para titremesi, kayan gözyaşları. Yöntem: resmi kesmeden yumuşak bölge bükmeleri (kafa/gövde/eller/ağız maskeleri) + kodla çizilen gözyaşı (scripts/hareket/resim_hareket_deneme.py).
Ölçüm (aynı yöntem: 160x90 gri, 15 kare/sn): kare farkı ort. 1,21 (en yüksek 5,08); Böcek-3 kayıtları 3,66–6,26; bizim v9 1,93.
Sonuç: yerel hareket bozulmadan çalışıyor (yüz, saç, boyun kenarlarında kopma yok) ama sakin kalıyor; yürüme/dönme/koşma/yüz çevirme resimde olmadığı için yapılamaz → büyük hareket için yapay zekâ video modeli gerekir.


## Tek karakter resmini kodla hareketlendirme: kombinezonlu kadın (2026-11-20 gece)
Resim: Büşra'nın gönderdiği ayakta duran kadın (koyu kahve topuz, krem kombinezon; 686x1024). Yöntem: resmi parçalara ayırmadan yumuşak bölge bükmeleri
(scripts/hareket/karakter_hareketlendir.py). 6 sn, 24 kare/sn, kusursuz döngü (kare 144 = kare 0).
Hareketler: nefes, ağırlık verme (hafif salınma), baş eğme, saç bukleleri, kol sarkması (elde ±3 px), etek sallanması, göz kırpma (3 kez), bakış kayması,
kaş kalkması, gülümseme. Çıktı: medya/hareket/karakter2/hareket-v5.mp4 (depoya girmez).
Ölçüm (aynı yöntem: 160x90 gri, 15 kare/sn): kare farkı ort. 0,24 (en yüksek 0,42). Karşılaştırma: Böcek-3 kayıtları 3,66–6,26; ağlayan Mary denemesi 1,21; bizim v9 1,93.
Sonuç: "canlı duruş" seviyesinde (nefes alan, göz kırpan, gülümseyen karakter), akıcı aksiyon seviyesinin yaklaşık 15-25 kat altında. El sallama, yürüme, dönme bu resimde yapılamaz
(kol/bacak ayrı parça değil). Sonraki seviye için: kolu ayrı parçaya kesip arkasını doldurma denemesi (riskli) ya da yapay zekâ video modeli ya da karakteri kod sistemimize (scripts/vektor) taşıma.
Katlanma ölçümü: scripts/hareket/katlanma_olc.py – 144 karenin hiçbirinde çizgili yerde determinant 0,4'ün altına düşmüyor (kontrolsüz ilk sürümde eller 63/72 karede katlanıyordu).

## Kukla yöntemi: karakteri eklemlerinden parçalara ayırıp hareket ettirme (2026-11-20 gece, Büşra'nın fikri)
Büşra: "Eklem yerlerini hareket etmesi için ayrı ayrı bölüp tarasana." → Kombinezonlu kadın resmi (686x1024) kesilip parçalandı: baş (saç+bukleler), gövde (boyun, askılar, korse, bel bandı),
her kol 3 parça (üst kol, ön kol, el) + yuvarlak dirsek/bilek kapakları, temiz duvar plakası (kolların arkasında kalan etek konturu yeniden çizildi). Parçalar eklem merkezlerinden döndürülür (scripts/hareket/kukla/).
8 sn örnek (medya/hareket/karakter2/kukla-el-sallama-v1.mp4): sol kol omuz+dirsek+bilekle kalkıp el sallıyor, baş eğiliyor, nefes, göz kırpma, bakış, kaş, gülümseme, bukle sallanması. 0 TL, kusursuz döngü.
Kontrol: dinlenme pozunda orijinalle fark ort. 0,26 (kenarlar 8x büyütüldü, pikseli pikseline aynı). Betik sıfırdan, temiz klasörde 17 sn'de aynı sonucu üretti.
Ölçüm (160x90, 15 kare/sn kare farkı): tüm klip ort. 0,38; el sallama bölümü 0,52 (idle hareketi 0,24 idi). Böcek-3 kayıtları 3,66–6,26: oran doğrudan kıyaslanamaz (figür karenin ~%25'i) ama hâlâ çok daha sakin.
Sınırlar: uzun etek bacakları örttüğü için bacak/yürüme yok; dönme yok; kollar gövdenin ARKASINDA katmanlandığı için el gövdenin önüne (belde, göğüste) gelemez.
Eklem dostu kaynak resim (önden, tam boy, düz arka plan, kollar ~30° açık, eller açık, bacaklar hafif aralık; yürüme için yan görünüş) ile tam hareket mümkün: bkz. scripts/hareket/kukla/README.md.
Güncelleme (2026-11-20 gece): kol kalkınca koltuk altı açık kalıyordu (Büşra yakaladı) → üst kol omuzdan yumuşak bükülecek şekilde değiştirildi (omuz sabit, 70 px'te tam açı); koltuk altı artık kapalı ve yuvarlak (iki kol, 20-50° kontrol). Güncel klip: medya/hareket/karakter2/kukla-el-sallama-v2.mp4.
