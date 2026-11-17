# YouTube API kurulumu (adım adım)

Toplam süre: yaklaşık 30-45 dakika. Ücretsiz. Kanalın sahibi olan
Google hesabıyla (Büşra'nın hesabı) yapın.

> Önemli: Hiçbir şifreyi, anahtarı veya indirdiğiniz dosyanın içeriğini
> sohbete yapıştırmayın. Dosyaları proje klasörüne koymanız yeterli.

## 0. Önce YouTube kanalı
Kanal henüz yoksa: youtube.com → sağ üstte profil resmi → **Kanal oluştur**.
(Kanal adı sonradan değiştirilebilir.)

## 1. Google Cloud projesi
1. console.cloud.google.com adresine gidin, Büşra'nın hesabıyla giriş yapın.
2. İlk kez giriyorsanız şartları kabul edin. **Kredi kartı istemez**, eklemeyin.
3. Sol üstte proje seçicisine tıklayın → **Yeni Proje** (New Project).
4. Ad: `kanal-asistani` → **Oluştur**. Oluşunca bu projeyi seçin.

## 2. API'leri açma
1. Üstteki arama kutusuna `YouTube Data API v3` yazın → tıklayın → **Etkinleştir** (Enable).
2. Aynı şekilde `YouTube Analytics API` → **Etkinleştir**.

## 3. OAuth izin ekranı (uygulamanın "kimlik kartı")
1. Arama kutusuna `OAuth consent screen` (OAuth izin ekranı) yazın, açın.
2. **Get started / Başlayın**:
   - Uygulama adı: `Kanal Asistanı`
   - Destek e-postası: kendi e-postanız
   - Kitle (Audience): **External / Harici**
   - İletişim e-postası: kendi e-postanız → kaydedin.
3. **Audience / Kitle** bölümünde **Test users / Test kullanıcıları** →
   **Add users** → Büşra'nın Gmail adresini ekleyin.
4. Aynı sayfada **Publish app / Uygulamayı yayınla** → onaylayın.
   (Neden: "Test" modunda verilen yetki 7 günde bir sona erer.
   Yayınlanmış ama doğrulanmamış uygulamada sadece giriş sırasında
   "Google bu uygulamayı doğrulamadı" uyarısı çıkar; kendi uygulamanız
   olduğu için **Gelişmiş → Kanal Asistanı'na git** diyerek devam edersiniz.)

## 4. OAuth istemci dosyası
1. Sol menü **Clients / İstemciler** (veya Credentials → Create credentials → OAuth client ID).
2. Uygulama türü: **Desktop app / Masaüstü uygulaması**, ad: `asistan` → **Oluştur**.
3. **JSON'u indir** (Download JSON).
4. İnen dosyanın adını `client_secret.json` yapın ve **proje klasörünün köküne**
   (CLAUDE.md'nin yanına) koyun. Bu dosya depoya girmez (.gitignore'da).

## 5. .env dosyası
1. Proje klasöründeki `.env.example` dosyasını kopyalayın, kopyanın adını `.env` yapın.
2. İçinde `YOUTUBE_CLIENT_SECRET_FILE=client_secret.json` satırı zaten doğru.
   Başka bir şey yazmanız gerekmiyor.
3. (İsteğe bağlı, niş analizi için) Credentials → **Create credentials → API key**.
   Çıkan anahtarı kopyalayın, `.env` içinde `YOUTUBE_API_KEY=` satırının sonuna yapıştırın.
   Anahtarı **API restrictions** ile sadece "YouTube Data API v3"e kısıtlayın.

## 6. Yetki verme (bir kez)
Proje klasöründe terminalde:
```
python scripts/youtube_yetki.py
```
Tarayıcı açılır → Büşra'nın hesabı → kanalı seçin → izinleri onaylayın.
`token.json` dosyası oluşur (gizli, depoya girmez). Ekranda kanal adı
görünüyorsa kurulum tamam.

## Bilmeniz gereken iki kısıt
- **Günlük kota:** API ücretsiz ama günlük bir kullanım sınırı var.
  Video yükleme bu sınırın büyük kısmını harcar; haftada 1 video + Shorts için yeterli.
- **API denetimi:** Google, doğrulanmamış (denetimden geçmemiş) projelerden
  API ile yüklenen videoları "Özel" modda kilitleyebiliyor. Bizim kuralımız
  zaten "Özel yükle" olduğu için test etkilenmez; ama Büşra'nın sonra
  herkese açık yapabilmesi için ya ücretsiz **API denetimi başvurusu**
  yaparız ya da asıl videoları Büşra Studio'dan elle yükler (her şeyi
  hazır paket halinde veririm). Test videosunda bunu birlikte göreceğiz.
