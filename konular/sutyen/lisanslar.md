# Görsel Lisansları – Sütyen videosu (medya/sutyen/gorsel)

| Dosya | Kaynak | Lisans | Atıf gerekli mi | Not |
|---|---|---|---|---|
| s04-mary-korse-gemini.png | Google Gemini (Mert/Büşra üretti, 2026-11-18) | Yapay zekâ ile üretildi; Google kullanım şartları | Hayır | Etek kısmı kadraj dışında bırakıldı (şeffaflık) |
| arsiv/s35-patent-US1115674.pdf (+ png) | ABD Patent No. 1.115.674, M. P. Jacob, 3 Kasım 1914 – patentimages.storage.googleapis.com | Kamu malı (ABD hükümeti belgesi, 1929 öncesi) | Hayır (kaynak açıklamada belirtilecek) | Birincil kaynak: başvuru 12 Şubat 1914 doğrulandı |
| ~~s14 Bikinili Kızlar mozaiği (Clemensfranz, CC BY 2.5)~~ | – | CC BY = TELİF KURALINA AYKIRI | – | İPTAL. Yerine kamu malı/CC0 fotoğraf aranacak; yoksa Gemini çizimi (sahne 15 tarzı) |
| (bekliyor) s28 Paris 1889 | Wikimedia: "Eiffel tower at Exposition Universelle, Paris, 1889.jpg" | Kamu malı | Hayır | İndirilemedi (istek sınırı) |
| (bekliyor) s21 Lengberg Şatosu | Wikimedia (aranacak) | ? | ? | Bulunamazsa Gemini sahne 8 tarzı çizim |
| s01-newyork-gemini.png | Google Gemini (Mert/Büşra üretti, 2026-11-18) | Yapay zekâ ile üretildi | Hayır | Ön planda Mary'ye benzeyen kızıl saçlı kadın var – sahne 2'ye geçiş için kullanılabilir |

KURAL: Bu listede sadece kamu malı / CC0 / kendi üretimimiz / kendi yapay zekâ çıktımız olabilir (CLAUDE.md 00. TELİF KURALI).
| Ses efektleri (boing, at nalı, yağmur, damga, kasa, trombon) | Claude kodla üretti (ffmpeg/python sentez) | Kendi üretimimiz | Hayır | – |
| Yazı tipleri: Inter, Caladea | Açık kaynak | SIL Open Font License (ticari kullanım serbest) | Hayır | – |
| Müzik: merak, gizem, zafer (medya/muzik) | Claude besteledi ve üretti – scripts/muzik/uret.py (notalar dosyada) | Kendi üretimimiz | Hayır | Hiçbir sanatçıdan/kütüphaneden parça yok |
| Sinematik müzik: merak, gizem, zafer (medya/muzik/sinematik) | Beste ve düzenleme: Claude (scripts/muzik/orkestra.py). Enstrüman kayıtları: VSCO 2 Community Edition, Versilian Studios – github.com/sgossner/VSCO-2-CE | Beste: kendi üretimimiz · Kayıtlar: CC0 1.0 (LICENSE dosyası okunarak doğrulandı, 2026-11-18) | Hayır | Telif kuralına uygun |
| Ses efekti kütüphanesi (medya/efekt, 15 efekt) | Claude üretti – scripts/muzik/efektler.py | Kendi üretimimiz | Hayır | Fon müziği yok kararı (2026-11-18) |

## Gemini API ile üretilen sahne görselleri (2026-11-19)
Sahneler 2, 3, 5, 6, 8, 9, 12-15, 17-19, 22-25, 27, 29-34, 37, 38, 41, 42, 44 – medya/sutyen/gorsel/gemini/
Araç: Google Gemini API (gemini-2.5-flash-image), ücretli katman (Tier 1). Google şartlarına göre çıktılar
kullanıcıya aittir, ticari kullanım serbesttir. Tariflerde marka, ünlü karakter, sanatçı tarzı veya gerçek fotoğraf kopyası yok.
Sahne 14 gerçek mozaiğin fotoğrafı DEĞİL; özgün "mozaik tarzı" çizimdir.
Yeniden üretilenler: s22 (Mısır lahdi çıkmıştı), s24 (elbise çıkmıştı), s42 (kibrit vardı – 1968'de hiçbir şey yakılmadı).


## Arşiv görselleri – The Metropolitan Museum of Art, Open Access (2026-11-19)
Met'in "Open Access" eserleri CC0 1.0 (kamu malı adanması) ile yayınlanır: ticari kullanım serbest, atıf gerekmez.
Kanıt: her eserin API kaydında isPublicDomain=true + eser sayfasında "Public Domain / Open Access" ibaresi.
Dosyalar: medya/sutyen/gorsel/arsiv/met/
| Dosya | Eser | Sanatçı | Lisans | Kaynak |
|---|---|---|---|---|
| met-271707.jpg | Eiffel Tower (1890s) | Unknown | The Met Open Access – CC0 (isPublicDomain: True) | https://www.metmuseum.org/art/collection/search/271707 |
| met-928627.jpg | Fan leaf for the Universal Exposition of 1889 (1889) | Alejandro Sans | The Met Open Access – CC0 (isPublicDomain: True) | https://www.metmuseum.org/art/collection/search/928627 |
| met-157937.jpg | Corset (ca. 1885) | Ball's | The Met Open Access – CC0 (isPublicDomain: True) | https://www.metmuseum.org/art/collection/search/157937 |
| met-158100.jpg | Corset (ca. 1890) | Corset Parisien | The Met Open Access – CC0 (isPublicDomain: True) | https://www.metmuseum.org/art/collection/search/158100 |
| met-173657.jpg | Corset (ca. 1885) | Worcester Corset Company | The Met Open Access – CC0 (isPublicDomain: True) | https://www.metmuseum.org/art/collection/search/173657 |

## Kod-çizim animasyon denemesi (2026-11-20)
scripts/vektor/ – karakter, oda, sokak, proplar ve notlar Claude tarafından kodla çizildi; dış görsel/ses/müzik yok. Yazı tipleri: Caveat, Alegreya (SIL OFL). Çıktı: medya/sutyen/kurgu/ornek-kod-cizim-acilis.mp4 (sessiz).
