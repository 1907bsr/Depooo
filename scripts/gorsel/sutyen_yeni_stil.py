"""Sütyen videosu – yeni stil kalan sahneler (Gemini API). Her tarif: ŞAKA önce, poz/ifade net, kimlik + yasaklar, stil.
Kullanım: python3 scripts/gorsel/sutyen_yeni_stil.py 22 23 24 ...   (var olanları atlar)
Çıktı: medya/sutyen/gorsel/yeni-stil/api/sNN.png"""
import sys, os, subprocess
from concurrent.futures import ThreadPoolExecutor

Y = 'medya/sutyen/gorsel/yeni-stil/'
O = Y + 'api/'
MARY_REF = [Y + 'mary-kart-yuz.png', Y + 'mary-kart-boy.png']
MAID_REF = [Y + 's06-busra-gemini.png']

STIL = """STYLE: The background must look almost photorealistic (true-to-life materials, real textures, natural light and realistic shadows). All people are high-quality hand-painted digital illustrations with visible fine ink linework and painterly shading, like a high-quality illustrated storybook for adults – NOT a photo, NOT 3D render, NOT CGI. Realistic human proportions, expressive faces. Muted, natural, faded colors (beige, warm grey, soft brown, cream, muted olive). NOT saturated cartoon colors, no blue or teal tones. Wide 16:9 landscape. No text, no letters, no readable signs, no logos. Family-friendly, everyone fully and modestly clothed."""

MARY = """MARY (use the attached reference images of her): the SAME young woman as in the references – same face, auburn (red-brown) hair in an elegant updo with a small pink ribbon, 21 years old. Unless told otherwise she wears the same soft muted coral 1913 evening gown with high empire waist, lace bodice, flutter sleeves and long white evening gloves, fully opaque."""

T = {
# ---------- ŞATO ----------
'22': (f"""THE MOMENT: Austria, 2008. Inside an old castle room under renovation, three construction workers in modern hard hats, work gloves and dusty work clothes have just lifted up old wooden floorboards. Under the floor there is a shallow hidden cavity filled with very old dry rubbish: straw, twigs, wood chips, scraps of leather and crumpled pieces of old beige linen cloth. A big cloud of old dust rises; one worker leans away coughing with an exaggerated comedic face (eyes squeezed, cheeks puffed), the other two peer down curiously.
FORBIDDEN: no skulls, no bones, no treasure, no pottery, no gold.
PLACE: a thick-walled stone castle room with whitewashed walls, a small arched window, scaffolding and a work lamp.
{STIL}""", []),
'23': (f"""THE MOMENT: Close-up of a pile of 500-year-old rubbish found under a castle floor, lit by the strong beam of a flashlight in a dark stone cavity: dry straw, twigs, wood chips, a worn old leather shoe sole, and many small scraps of aged beige linen fabric with frayed edges. Dusty, mysterious, like an archaeological discovery. No people.
FORBIDDEN: no bones, no treasure, no modern objects.
{STIL}""", []),
'24': (f"""THE JOKE (most important): A female archaeologist in her 40s – short brown hair, glasses, headlamp on her forehead, white cotton gloves, practical field clothes – kneels in a stone castle room next to a pile of old straw rubbish. She carefully holds up, between two fingers, a small old torn piece of linen underwear with two soft fabric cups and two thin shoulder straps (an object, nobody wears it). Her jaw has dropped in total disbelief, eyes huge behind her glasses. Behind her, a male colleague with a beard drops his clipboard in surprise.
THE GARMENT: soft aged beige linen, hand-sewn, no underwire, no padding, frayed edges, brown age stains – it must NOT look like a modern bra.
PLACE: stone castle room, whitewashed walls, work lamp light, dust in the air.
{STIL}""", []),
'25': (f"""THE MOMENT: A quiet museum display case with soft spotlights. On dark brown velvet inside the glass case lies a 15th-century linen garment: two soft cups each sewn from two pieces of fabric, thin linen shoulder straps, a simple strip of handmade needle lace along the top edge, aged beige linen with brown stains, a little torn and frayed. It looks surprisingly like a simple modern bralette – but clearly very old and handmade. No people. A small blank museum label card without readable text.
FORBIDDEN: NOT a modern bra, no underwire, no padding, no shiny fabric, no straps crossing.
{STIL}""", []),
'27': (f"""THE JOKE (most important): Inside a 15th-century castle hall. A medieval noblewoman in a long, fully covering 15th-century gown and a simple veil headdress shrugs with both palms up and a bored, unimpressed "What's the big deal?" face, eyebrows raised, mouth sideways. Next to her stands a modern male history professor (tweed jacket, jeans, glasses) holding a big open history book, staring at her in exaggerated shock, jaw dropped. The clash of the two eras is the joke.
PLACE: stone hall with a big fireplace, tapestries and wooden beams.
{STIL}""", []),
# ---------- PARİS ----------
'29': (f"""THE MOMENT: Paris, 1889. A cozy dressmaker's workshop; through the big window the Eiffel Tower is visible. A confident Frenchwoman in her late 40s – dark hair in a neat bun, small round glasses, plain black high-collared dress, a measuring tape around her neck – stands at her worktable with a clever new idea. In her left hand she holds up an old-fashioned long stiff corset; in her right hand a pair of big tailor's shears. She looks at the viewer with a mischievous, determined smile and one raised eyebrow, as if saying "I have a better idea."
PLACE: workshop with fabric rolls, dress forms, a sewing machine, warm daylight.
FORBIDDEN: no red-haired women.
{STIL}""", []),
'30': (f"""THE JOKE (most important): The same 1889 Paris corset-maker's workshop. A customer in her 30s – brown hair in a bun, wearing a modest, fully covering, loose cream day dress – stands with arms spread wide open, eyes closed, chest lifted, taking a huge, blissful, exaggerated deep breath, a dreamy smile on her face, as if breathing for the first time in years. Next to her the corset-maker (late 40s, dark bun, pince-nez glasses, plain black dress, measuring tape around her neck) smiles proudly, holding up a corset cut into two separate halves.
PLACE: workshop with fabric rolls and dress forms, the Eiffel Tower visible through the window, warm daylight.
FORBIDDEN: no red-haired women, no underwear visible.
{STIL}""", []),
# ---------- MARY ----------
'31': (f"""THE MOMENT: A heroic portrait of Mary, from the chest up, facing the viewer, smiling confidently with a slight playful raised eyebrow, as if saying "I solved it." In one gloved hand she holds up two small white lace handkerchiefs and a pink silk ribbon. The LEFT third of the image is calm, plain warm cream wall with soft light (empty space for a name label).
{MARY}
PLACE: her elegant 1913 New York bedroom, softly blurred behind her.
{STIL}""", MARY_REF),
'32': (f"""THE JOKE (most important): Mary and her maid sit side by side at a vanity table, sewing at super speed: together they stitch two white lace handkerchiefs to a pink silk ribbon. Their hands are blurred with motion, thread and needles flying, sewing pins sticking out of the maid's tightly closed lips, both with exaggerated, intensely focused faces – Mary biting her tongue in concentration, the maid with wide eyes.
{MARY}
THE MAID (use the maid reference image): the SAME kind, round-faced maid in her 40s – brown hair, white lace cap, long black dress, white apron.
PLACE: Mary's elegant 1913 dressing room, lamplight, scattered lace, scissors and a sewing box on the table. No mirror reflections.
{STIL}""", MARY_REF + MAID_REF),
'33': (f"""THE MOMENT: Mary twirls happily in the middle of her dressing room, arms open, eyes closed, a huge free and joyful smile, the skirt of her gown swirling. On the floor in the foreground lies the discarded stiff old corset, crumpled like a defeated monster. Soft golden lamplight.
{MARY}
FORBIDDEN: no mirror in the image.
{STIL}""", MARY_REF),
'34': (f"""THE MOMENT: A glamorous 1913 New York ballroom with crystal chandeliers and dancing couples in the background. A crowd of five excited young society women in long, fully covering pastel evening gowns surrounds Mary, all talking at once (mouths open, NO speech bubbles), pointing at her elegant relaxed posture, with exaggerated curious and amazed faces. Mary in the center smiles mysteriously, a finger on her lips as if keeping a secret.
{MARY}
FORBIDDEN: NO speech bubbles, NO text anywhere. Mary is the ONLY woman with auburn/red hair; the five other women have clearly black, blonde or dark brown hair and wear pale lilac, ivory, sage green or grey gowns (not coral).
{STIL}""", MARY_REF),
'37': (f"""THE JOKE (most important): A split composition, left half and right half separated by a thin vertical line.
LEFT: Mary stands alone in a plain room holding just three small 1910s dollar banknotes in her gloved hands, with a completely deadpan, unimpressed face, one eyebrow slightly raised.
RIGHT: a smug, mustached 1910s businessman in a three-piece suit and bowler hat lounges on top of a gigantic mountain of money bags and stacks of banknotes in a factory office, laughing with his head thrown back.
{MARY}
FORBIDDEN: no company names, no logos, no readable text on bags or banknotes.
{STIL}""", MARY_REF),
'37b': (f"""THE MOMENT: Close-up of Mary from the chest up, looking at the viewer, heartbroken in a slightly comedic melodramatic way: eyebrows tilted up, big glistening eyes, two tears rolling down her cheeks, her lower lip pushed out in a big trembling pout, holding two small dollar banknotes near her chin with both gloved hands.
{MARY}
PLACE: her dim 1913 bedroom, softly blurred.
{STIL}""", MARY_REF),
'38': (f"""THE MOMENT: Paris in the 1920s, a lively sidewalk café on a sunny day. Mary, now about 33 years old and glamorous: same face, auburn hair cut in a short 1920s bob under a cloche hat, wearing a drop-waist 1920s dress with long pearls (fully covering, modest). She is SEATED at a small round table, laughing out loud, head tilted back, with a few artists and writers in 1920s clothes (one sketching, one with a notebook). A slim whippet dog lies at her feet.
MARY (use the attached reference images ONLY for her face): same face as in the references, but this is 1925 and she is older. IMPORTANT: she does NOT wear the coral gown or the gloves and does NOT have the updo. Her auburn hair is cut in a short chin-length 1920s bob under a soft cloche hat. She wears a simple straight, drop-waist 1920s day dress in muted olive green with long pearls, fully covering.
FORBIDDEN: no readable café signs.
{STIL}""", MARY_REF),
# ---------- EFSANE & KAPANIŞ ----------
'41': (f"""THE JOKE (most important): A comically exaggerated portrait of a FAKE inventor, drawn on an old yellowed sheet of paper pinned to a wooden wall with two pins: a proud man with an enormous curly mustache, a monocle, slicked hair, a fancy waistcoat, holding a rolled blueprint, chest puffed out in a ridiculous heroic pose. The corners of the paper are already starting to curl and crumple, as if it is about to be thrown away. Only the paper and the wall are visible.
FORBIDDEN: no text or letters on the paper.
{STIL}""", []),
'42': (f"""THE MOMENT: Atlantic City boardwalk, September 1968, sunny day, wooden planks, the sea behind. Five cheerful women protesters in 1960s dresses and hairstyles toss everyday beauty items into a big metal trash can: hair curlers, false eyelashes, high-heeled shoes, girdles and fashion magazines. NOTHING is burning: absolutely no fire, no flames, no smoke, no matches. A police officer in a 1960s uniform stands right next to the can holding up his palm firmly, with a stern "No fire allowed!" face.
FORBIDDEN: no signs, no banners with text, no fire.
{STIL}""", []),
'44': (f"""THE MOMENT: A Victorian-era ornate white porcelain toilet with soft brown floral decoration and a high wall-mounted wooden water tank with a long pull chain, standing alone in a dark room under one dramatic spotlight from above. Mysterious, almost heroic mood, as if it hides a big secret. No people.
{STIL}""", []),
}

# İkinci hâller (mimik) – A görseli düzenlenir; kadraj aynı kalmalı
B = {
'22B': ('22', "the coughing worker now has both hands over his mouth, eyes watering, and the dust cloud is bigger. The other two workers now look at him with raised eyebrows."),
'24B': ('24', "the archaeologist now slowly turns her head toward the viewer with an exaggerated 'can you believe this?!' face: eyebrows raised to the top, wide eyes, lips pressed into a stunned half-smile."),
'29B': ('29', "the corset in her hand is now divided into two separate pieces: she proudly holds the short top piece up in one hand and the bottom piece in the other, the shears lying on the table, and her smile becomes a big triumphant grin."),
'34B': ('34', "Mary now leans in and whispers the secret, and all five women gasp at the same time with hands over their mouths and huge eyes."),
'37B': ('37', "on the LEFT side Mary's deadpan face now has one eye twitching in irritation and her mouth pressed into a tight flat line; the RIGHT side stays the same."),
'42B': ('42', "the police officer now blows a whistle with puffed cheeks while still holding up his palm, and two of the women look at him with exaggerated offended faces."),
}

def uret(k):
    if k in B:
        a, deg = B[k]; out = O + f's{k}.png'
        if os.path.exists(out): return f'{k}: var'
        src = O + f's{a}.png'
        if not os.path.exists(src): return f'{k}: A yok'
        tarif = ("Edit the attached image. Keep EVERYTHING exactly the same: same people, faces, clothes, poses, objects, background, "
                 "lighting, framing and art style, pixel-aligned. Change ONLY this: " + deg + " No text.")
        refs = [src]
    else:
        out = O + f's{k}.png'
        if os.path.exists(out): return f'{k}: var'
        tarif, refs = T[k]
    r = subprocess.run([sys.executable, 'scripts/gorsel/gemini_uret.py', out, tarif, *refs], capture_output=True, text=True)
    return f'{k}: ' + (r.stdout + r.stderr).strip()[:160]

if __name__ == '__main__':
    os.makedirs(O, exist_ok=True)
    with ThreadPoolExecutor(4) as ex:
        for s in ex.map(uret, sys.argv[1:]): print(s, flush=True)
