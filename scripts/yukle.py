"""Videoyu YouTube'a HER ZAMAN "Özel" (private) olarak yükler.

Kullanım:
  python scripts/yukle.py VIDEO.mp4 --baslik "..." [--aciklama dosya.txt]
         [--kapak kapak.jpg] [--altyazi altyazi.srt] [--etiketler "a,b,c"]
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from googleapiclient.discovery import build  # noqa: E402
from googleapiclient.http import MediaFileUpload  # noqa: E402
from youtube_yetki import kimlik_al  # noqa: E402

GIZLILIK = "private"  # Bu değeri değiştirme. Herkese açık kararı Büşra'nındır.


def main():
    p = argparse.ArgumentParser()
    p.add_argument("video")
    p.add_argument("--baslik", required=True)
    p.add_argument("--aciklama", help="Açıklama metni içeren .txt dosyası")
    p.add_argument("--kapak")
    p.add_argument("--altyazi")
    p.add_argument("--etiketler", default="")
    a = p.parse_args()

    aciklama = Path(a.aciklama).read_text(encoding="utf-8") if a.aciklama else ""
    yt = build("youtube", "v3", credentials=kimlik_al())
    govde = {
        "snippet": {
            "title": a.baslik,
            "description": aciklama,
            "tags": [t.strip() for t in a.etiketler.split(",") if t.strip()],
            "categoryId": "22",  # People & Blogs; gerekirse değiştirilir
            "defaultLanguage": "tr",
            "defaultAudioLanguage": "tr",
        },
        "status": {
            "privacyStatus": GIZLILIK,
            "selfDeclaredMadeForKids": False,
        },
    }
    istek = yt.videos().insert(
        part="snippet,status",
        body=govde,
        media_body=MediaFileUpload(a.video, chunksize=-1, resumable=True),
    )
    yanit = None
    while yanit is None:
        durum, yanit = istek.next_chunk()
        if durum:
            print(f"Yükleniyor: %{int(durum.progress() * 100)}")
    vid = yanit["id"]
    print("Yüklendi (Özel):", f"https://youtu.be/{vid}")

    if a.kapak:
        yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(a.kapak)).execute()
        print("Kapak eklendi.")
    if a.altyazi:
        yt.captions().insert(
            part="snippet",
            body={"snippet": {"videoId": vid, "language": "tr", "name": "Türkçe"}},
            media_body=MediaFileUpload(a.altyazi),
        ).execute()
        print("Altyazı eklendi.")


if __name__ == "__main__":
    main()
