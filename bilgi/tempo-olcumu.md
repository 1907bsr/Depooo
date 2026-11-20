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

