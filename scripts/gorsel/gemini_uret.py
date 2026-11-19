"""Gemini ile görsel üretir. Kullanım:
python3 scripts/gorsel/gemini_uret.py cikti.png "tarif" [referans1.png ...] [--model M]
Anahtar .env'deki GEMINI_API_KEY'den okunur (depoya girmez)."""
import sys, os, json, base64, urllib.request, pathlib

def anahtar():
    for s in pathlib.Path(__file__).resolve().parents[2].joinpath('.env').read_text().splitlines():
        if s.startswith('GEMINI_API_KEY='):
            return s.split('=', 1)[1].strip()
    sys.exit('GEMINI_API_KEY yok')

args = sys.argv[1:]
model = 'gemini-2.5-flash-image'
if '--model' in args:
    i = args.index('--model'); model = args[i+1]; del args[i:i+2]
cikti, tarif, refs = args[0], args[1], args[2:]
parts = [{'text': tarif}]
for r in refs:
    mime = 'image/png' if r.lower().endswith('png') else 'image/jpeg'
    parts.append({'inline_data': {'mime_type': mime, 'data': base64.b64encode(open(r, 'rb').read()).decode()}})
body = {'contents': [{'parts': parts}],
        'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': '16:9'}}}
req = urllib.request.Request(
    f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': anahtar()})
try:
    d = json.load(urllib.request.urlopen(req, timeout=180))
except urllib.error.HTTPError as e:
    sys.exit(f'HATA {e.code}: {e.read().decode()[:600]}')
for c in d.get('candidates', []):
    for p in c.get('content', {}).get('parts', []):
        if 'inlineData' in p:
            open(cikti, 'wb').write(base64.b64decode(p['inlineData']['data']))
            print('kaydedildi', cikti, d.get('usageMetadata', {}).get('totalTokenCount')); sys.exit()
sys.exit('görsel gelmedi: ' + json.dumps(d)[:600])
