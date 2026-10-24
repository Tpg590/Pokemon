#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import re

import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_HTML = os.path.join(ROOT, 'tools', 'cache', 'pokemondb_all.html')
ALT_HTML = r'C:\Users\trilt\.gemini\antigravity-ide\brain\f715c675-8916-49ca-a30d-152cbee34366\.system_generated\steps\67\content.md'
DEX_PATH = os.path.join(ROOT, 'js', 'data', 'pokedex.js')
MEGA_PATH = os.path.join(ROOT, 'js', 'data', 'mega.js')

if os.path.exists(CACHE_HTML):
    with open(CACHE_HTML, 'r', encoding='utf-8') as f:
        html_text = f.read()
elif os.path.exists(ALT_HTML):
    with open(ALT_HTML, 'r', encoding='utf-8') as f:
        html_text = f.read()
    try:
        os.makedirs(os.path.dirname(CACHE_HTML), exist_ok=True)
        with open(CACHE_HTML, 'w', encoding='utf-8') as f:
            f.write(html_text)
    except Exception:
        pass
else:
    print('Fetching https://pokemondb.net/pokedex/all ...')
    req = urllib.request.Request('https://pokemondb.net/pokedex/all', headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as resp:
        html_text = resp.read().decode('utf-8')
    os.makedirs(os.path.dirname(CACHE_HTML), exist_ok=True)
    with open(CACHE_HTML, 'w', encoding='utf-8') as f:
        f.write(html_text)

trs = re.findall(r'<tr>(.*?)</tr>', html_text, re.DOTALL)

base_by_dex = {}
mega_by_name = {}

for tr in trs:
    num_m = re.search(r'data-sort-value="(\d+)"', tr)
    name_m = re.search(r'class="ent-name"[^>]*>([^<]+)</a>', tr)
    sub_m = re.search(r'<small class="text-muted">([^<]+)</small>', tr)
    nums = re.findall(r'<td class="cell-num[^"]*">\s*(\d+)\s*</td>', tr)
    if num_m and name_m and len(nums) >= 7:
        dex = int(num_m.group(1))
        name = name_m.group(1)
        sub = sub_m.group(1) if sub_m else ''
        total, hp, atk, df, sa, sd, spd = [int(x) for x in nums[:7]]
        data = {
            'dex': dex,
            'name': name,
            'sub': sub,
            'total': total,
            'hp': hp,
            'atk': atk,
            'df': df,
            'sa': sa,
            'sd': sd,
            'spd': spd
        }
        if not sub:
            base_by_dex[dex] = data
        else:
            mega_by_name[sub.lower()] = data
            if dex not in base_by_dex:
                base_by_dex[dex] = data

print(f'Parsed {len(base_by_dex)} base pokemon and {len(mega_by_name)} mega/forms from Pokémon Database.')

# 1. Update pokedex.js
with open(DEX_PATH, 'r', encoding='utf-8') as f:
    dex_text = f.read()

def replace_dex_row(match):
    prefix = match.group(1)
    row_json = match.group(2)
    suffix = match.group(3)
    p = json.loads(row_json)
    dex = p['dex']
    if dex not in base_by_dex:
        print(f'Warning: dex {dex} not in pokemondb data!')
        return match.group(0)
    
    st = base_by_dex[dex]
    p['hp'] = st['hp']
    p['spd'] = st['spd']
    p['atk'] = max(st['atk'], st['sa'])
    p['pa'] = st['atk']
    p['sa'] = st['sa']
    p['df'] = st['df']
    p['sd'] = st['sd']
    p['bst'] = st['total']
    
    # Format line cleanly
    return prefix + json.dumps(p, ensure_ascii=False, separators=(',', ':')) + suffix

updated_dex = re.sub(r'^(  )(\{"dex":\d+.*?\})(,?)$', replace_dex_row, dex_text, flags=re.M)

with open(DEX_PATH, 'w', encoding='utf-8', newline='\n') as f:
    f.write(updated_dex)
print(f'Successfully updated {DEX_PATH}')

# 2. Update mega.js
with open(MEGA_PATH, 'r', encoding='utf-8') as f:
    mega_text = f.read()

def replace_mega_stat(match):
    # Match the stat line: hp: 105, pa: 1.62, sa: 1.62, df: 125, sd: 95, spd: 115, bst: 634,
    pass

# For mega.js, find each entry by its name
# name: 'Mega Charizard X', ...
# hp: ..., pa: ..., sa: ..., df: ..., sd: ..., spd: ..., bst: ...
lines = mega_text.split('\n')
current_mega = None
new_lines = []
for line in lines:
    nm = re.search(r"name:\s*['\"]([^'\"]+)['\"]", line)
    if nm:
        mname = nm.group(1).lower()
        if mname in mega_by_name:
            current_mega = mega_by_name[mname]
    if current_mega and re.search(r'\bhp:\s*\d+', line):
        st = current_mega
        indent = re.match(r'^\s*', line).group(0)
        # replace with exact pokemondb stats
        line = f"{indent}hp: {st['hp']}, pa: {st['atk']}, sa: {st['sa']}, df: {st['df']}, sd: {st['sd']}, spd: {st['spd']}, bst: {st['total']},"
        current_mega = None
    new_lines.append(line)

updated_mega = '\n'.join(new_lines)
with open(MEGA_PATH, 'w', encoding='utf-8', newline='\n') as f:
    f.write(updated_mega)
print(f'Successfully updated {MEGA_PATH}')
