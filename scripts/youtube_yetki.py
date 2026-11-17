"""YouTube'a bir kez yetki verir ve bağlantıyı test eder.

Kullanım:  python scripts/youtube_yetki.py
Çıktı:     token.json (gizli, depoya girmez) + kanal adı ve abone sayısı
"""
import os
import sys

from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
    "https://www.googleapis.com/auth/youtube.force-ssl",  # yorumları okumak için
]


def kimlik_al():
    load_dotenv()
    secret = os.getenv("YOUTUBE_CLIENT_SECRET_FILE", "client_secret.json")
    token = os.getenv("YOUTUBE_TOKEN_FILE", "token.json")
    creds = None
    if os.path.exists(token):
        creds = Credentials.from_authorized_user_file(token, SCOPES)
    if creds and creds.valid:
        return creds
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        if not os.path.exists(secret):
            sys.exit(f"'{secret}' bulunamadı. kurulum/youtube-api.md 4. adıma bakın.")
        flow = InstalledAppFlow.from_client_secrets_file(secret, SCOPES)
        creds = flow.run_local_server(port=0)
    with open(token, "w") as f:
        f.write(creds.to_json())
    return creds


if __name__ == "__main__":
    yt = build("youtube", "v3", credentials=kimlik_al())
    kanal = yt.channels().list(part="snippet,statistics", mine=True).execute()
    if not kanal.get("items"):
        sys.exit("Bu hesapta YouTube kanalı bulunamadı.")
    k = kanal["items"][0]
    print("Bağlantı başarılı.")
    print("Kanal:", k["snippet"]["title"])
    print("Abone:", k["statistics"].get("subscriberCount", "gizli"))
