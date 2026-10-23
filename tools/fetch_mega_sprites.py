#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tải sprite của 30 Mega Pokémon từ PMDCollab về assets/pokemon/m{dex}/
và cập nhật metadata vào js/data/sprites-meta.js.
"""
import io
import json
import os
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

RAW = 'https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master'
BASE = RAW + '/sprite'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_ASSETS = os.path.join(ROOT, 'assets', 'pokemon')
OUT_META = os.path.join(ROOT, 'js', 'data', 'sprites-meta.js')
CACHE = os.path.join(ROOT, 'tools', 'cache', 'mega')

WANT = ['Idle', 'Walk', 'Attack', 'Shoot', 'Charge', 'Hurt', 'Faint']
FALLBACK = {
    'Idle': ['Walk'],
    'Walk': ['Idle'],
    'Attack': ['Strike', 'Swing', 'QuickStrike', 'Punch', 'Bite', 'Shoot', 'Idle'],
    'Shoot': ['Attack', 'Strike', 'SpAttack', 'Idle'],
    'Charge': ['DeepBreath', 'Idle'],
    'Hurt': ['Cringe', 'Pain', 'Idle'],
    'Faint': ['Hurt', 'Fainted', 'Idle'],
}
REQUIRED = {'Idle', 'Walk', 'Attack'}

# 30 dạng Mega có đầy đủ Idle, Walk, Attack trên PMDCollab
MEGA_FORMS = [
    (6, '0001', 'Mega Charizard X'),
    (65, '0001', 'Mega Alakazam'),
    (80, '0002', 'Mega Slowbro'),
    (94, '0001', 'Mega Gengar'),
    (115, '0001', 'Mega Kangaskhan'),
    (142, '0001', 'Mega Aerodactyl'),
    (150, '0002', 'Mega Mewtwo Y'),
    (208, '0001', 'Mega Steelix'),
    (229, '0001', 'Mega Houndoom'),
    (248, '0001', 'Mega Tyranitar'),
    (282, '0001', 'Mega Gardevoir'),
    (302, '0001', 'Mega Sableye'),
    (303, '0001', 'Mega Mawile'),
    (308, '0001', 'Mega Medicham'),
    (310, '0001', 'Mega Manectric'),
    (319, '0001', 'Mega Sharpedo'),
    (323, '0001', 'Mega Camerupt'),
    (334, '0001', 'Mega Altaria'),
    (354, '0001', 'Mega Banette'),
    (359, '0001', 'Mega Absol'),
    (362, '0001', 'Mega Glalie'),
    (380, '0001', 'Mega Latias'),
    (381, '0001', 'Mega Latios'),
    (382, '0001', 'Primal Kyogre'),
    (383, '0001', 'Primal Groudon'),
    (384, '0001', 'Mega Rayquaza'),
    (428, '0001', 'Mega Lopunny'),
    (448, '0001', 'Mega Lucario'),
    (475, '0001', 'Mega Gallade'),
    (719, '0001', 'Mega Diancie'),
]

def fetch(url, retries=4):
    last = None
    for _ in range(retries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'pokesurvivor/1.0'})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            last = e
        except Exception as e:
            last = e
    print(f'    ! {url.split("/sprite/")[-1]} -> {last}')
    return None

def parse_animdata(xml):
    anims = {}
    for blk in re.findall(r'<Anim>(.*?)</Anim>', xml, re.S):
        name = re.search(r'<Name>(\w+)</Name>', blk)
        if not name:
            continue
        name = name.group(1)
        copy = re.search(r'<CopyOf>(\w+)</CopyOf>', blk)
        if copy:
            anims[name] = {'copyOf': copy.group(1)}
            continue
        fw = re.search(r'<FrameWidth>(\d+)</FrameWidth>', blk)
        fh = re.search(r'<FrameHeight>(\d+)</FrameHeight>', blk)
        if not (fw and fh):
            continue
        durs = [int(x) for x in re.findall(r'<Duration>(\d+)</Duration>', blk)]
        anims[name] = {'w': int(fw.group(1)), 'h': int(fh.group(1)), 'n': len(durs), 'd': durs}
    shadow = re.search(r'<ShadowSize>(\d+)</ShadowSize>', xml)
    return anims, int(shadow.group(1)) if shadow else 1

def resolve(anims, name, seen=None):
    seen = seen or set()
    if name not in anims or name in seen:
        return None, None
    seen.add(name)
    a = anims[name]
    if 'copyOf' in a:
        return resolve(anims, a['copyOf'], seen)
    return name, a

def ground_anchor(png, w, h):
    try:
        im = Image.open(io.BytesIO(png)).convert('RGBA')
    except Exception:
        return None
    px = im.crop((0, 0, w, h)).load()
    xs = ys = n = 0
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 40:
                xs += x; ys += y; n += 1
    return (round(xs / n, 1), round(ys / n, 1)) if n else None

def save_optimized(png, path):
    im = Image.open(io.BytesIO(png)).convert('RGBA')
    cols = im.getcolors(256)
    if cols is None:
        im.save(path, 'PNG', optimize=True)
        return im.size
    colors = [c for _, c in cols]
    colors.sort(key=lambda c: c[3])
    idx = {c: i for i, c in enumerate(colors)}
    pim = Image.new('P', im.size)
    data = im.get_flattened_data() if hasattr(im, 'get_flattened_data') else im.getdata()
    pim.putdata([idx[p] for p in data])
    flat = []
    for c in colors:
        flat += c[:3]
    pim.putpalette(flat + [0] * (768 - len(flat)))
    pim.save(path, 'PNG', optimize=True, transparency=bytes(c[3] for c in colors))
    return im.size

def download_set(url_base, out_dir, anims):
    os.makedirs(out_dir, exist_ok=True)
    meta = {}
    for want in WANT:
        src, geom = None, None
        for cand in [want] + FALLBACK.get(want, []):
            src, geom = resolve(anims, cand)
            if geom:
                break
        if not geom:
            continue
        png = fetch(f'{url_base}/{src}-Anim.png')
        if not png:
            continue
        path = os.path.join(out_dir, want + '.png')
        w, h = save_optimized(png, path)
        cols, rows = w // geom['w'], h // geom['h']
        if rows < 1 or cols < 1:
            if os.path.exists(path): os.remove(path)
            continue
        sh = fetch(f'{url_base}/{src}-Shadow.png')
        anchor = ground_anchor(sh, geom['w'], geom['h']) if sh else None
        ax, ay = (anchor if anchor else (geom['w'] / 2, geom['h'] * 0.78))
        meta[want] = {'w': geom['w'], 'h': geom['h'], 'n': min(geom['n'], cols), 'r': rows,
                      'd': geom['d'][:cols], 'ax': ax, 'ay': ay}
    return meta

def do_mega(job):
    dex, form, name = job
    tag = f'{dex:04d}'
    url_base = f'{BASE}/{tag}/{form}'
    out_dir = os.path.join(OUT_ASSETS, f'm{dex}')
    cache_file = os.path.join(CACHE, f'm{dex}.json')
    if os.path.exists(cache_file):
        try:
            meta = json.load(open(cache_file, encoding='utf-8'))
            if all(os.path.exists(os.path.join(out_dir, a + '.png')) for a in meta['a']):
                print(f'  [cache] m{dex} ({name}) ok')
                return f'm{dex}', meta
        except Exception:
            pass

    print(f'  [download] m{dex} ({name}) from {url_base}...')
    xml = fetch(f'{url_base}/AnimData.xml')
    if not xml:
        print(f'  ! No AnimData for m{dex}')
        return f'm{dex}', None
    anims, shadow = parse_animdata(xml.decode('utf-8', 'replace'))
    normal = download_set(url_base, out_dir, anims)
    if not REQUIRED & set(normal):
        print(f'  ! Missing required anims for m{dex}: {list(normal.keys())}')
        return f'm{dex}', None
    meta = {'s': shadow, 'a': normal}
    with open(cache_file, 'w', encoding='utf-8') as f:
        json.dump(meta, f, separators=(',', ':'))
    print(f'  [done] m{dex} ({name}) downloaded successfully!')
    return f'm{dex}', meta

def main():
    os.makedirs(CACHE, exist_ok=True)
    os.makedirs(OUT_ASSETS, exist_ok=True)
    print(f'Bat dau tai {len(MEGA_FORMS)} bo sprite Mega tu PMDCollab...')
    results = {}
    with ThreadPoolExecutor(max_workers=8) as ex:
        for key, meta in ex.map(do_mega, MEGA_FORMS):
            if meta:
                results[key] = meta

    print(f'Da tai thanh cong {len(results)} / {len(MEGA_FORMS)} sprite Mega.')
    
    # Ghi metadata vao cache de inject vao sprites-meta.js
    meta_cache_path = os.path.join(CACHE, 'mega_meta.json')
    with open(meta_cache_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, separators=(',', ':'))
    print(f'Saved mega metadata to {meta_cache_path}')

if __name__ == '__main__':
    main()
