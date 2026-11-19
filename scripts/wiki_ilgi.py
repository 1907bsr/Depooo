"""İcat konularının Wikipedia görüntülenme sayıları (dünya: en, Türkiye: tr), son 12 ay.
Kullanım: python scripts/wiki_ilgi.py <cikis.csv>"""
import sys, json, time, urllib.request, urllib.parse, csv
UA = {'User-Agent': 'NasilOlduResearch/1.0 (educational topic research)'}
EN = ["Brassiere","Flush toilet","Toilet paper","High-heeled shoe","Fork","Microwave oven","Refrigerator",
 "Toothbrush","Chewing gum","Umbrella","Jeans","Zipper","Hook-and-loop fastener","Post-it note","Elevator",
 "French fries","Chocolate chip cookie","Tea bag","Mirror","Deodorant","Soap","Pizza","Coca-Cola","Ice cream",
 "Toaster","Pencil","Eraser","Ballpoint pen","Lipstick","Sunglasses","Glasses","Sock","Undergarment","Shampoo",
 "Bubble wrap","Incandescent light bulb","Bicycle","Paper clip","Sandwich","Hamburger","Doughnut","Popcorn",
 "Potato chip","Safety pin","Corset","Bathtub","Tooth paste","Toothpaste","Diaper","Sliced bread","Vending machine","Alarm clock"]
def get(url):
    for i in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r: return json.load(r)
        except Exception as e:
            time.sleep(60 * (i + 1)); err = e
    print('HATA', url, err, file=sys.stderr); return None
def views(project, title):
    t = urllib.parse.quote(title.replace(' ', '_'), safe='')
    d = get(f'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/{project}/all-access/user/{t}/monthly/2025110100/2026103100')
    return sum(i['views'] for i in d['items']) if d and 'items' in d else None
def tr_title(title):
    d = get('https://en.wikipedia.org/w/api.php?' + urllib.parse.urlencode({'action':'query','prop':'langlinks','lllang':'tr','titles':title,'redirects':1,'format':'json'}))
    try:
        for p in d['query']['pages'].values():
            return p.get('langlinks', [{}])[0].get('*')
    except Exception: return None
rows = []
import os
if os.path.exists(sys.argv[1]):  # devam: önceki sonuçları koru
    rows = [tuple(r) for r in list(csv.reader(open(sys.argv[1])))[1:] if r and r[1]]
done = {r[0] for r in rows}
for t in EN:
    if t in done: continue
    en = views('en.wikipedia', t); time.sleep(20)
    tt = tr_title(t) if '--tr' in sys.argv else None
    tr = views('tr.wikipedia', tt) if tt else None
    rows.append((t, en, tt, tr)); print(t, en, tt, tr, flush=True)
    with open(sys.argv[1], 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['konu_en', 'dunya_12ay', 'konu_tr', 'turkiye_12ay']); w.writerows(rows)
with open(sys.argv[1], 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['konu_en', 'dunya_12ay', 'konu_tr', 'turkiye_12ay']); w.writerows(rows)
