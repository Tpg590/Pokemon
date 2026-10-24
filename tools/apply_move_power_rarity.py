import re
import os

from parse_moves import moves_db, raw_moves

OVERRIDES = {
    'swords-dance': 0, 'nasty-plot': 0, 'agility': 0, 'harden': 0, 'aqua-ring': 0, 'dragon-dance': 0,
    'spikes': 40, 'toxic-spikes': 40, 'string-shot': 35, 'hail': 40, 'will-o-wisp': 40, 'thunder-wave': 35,
    'toxic': 40, 'substitute': 40, 'whirlwind': 40,
    'gyro-ball': 60, 'electro-ball': 60, 'magnitude': 70, 'dragon-rage': 60, 'night-shade': 60
}

def get_power(m_id):
    if m_id in OVERRIDES:
        return OVERRIDES[m_id]
    db = moves_db.get(m_id, {})
    return db.get('power', 40)

def get_rarity(power):
    if power == 0 or power <= 55:
        return 'uncommon'
    elif power <= 85:
        return 'rare'
    else:
        return 'epic'

def calc_dmg(power, kind, count=1):
    if power == 0:
        return 0
    if kind == 'cone':
        # multi-shot cone (e.g. 7 shots)
        return max(5, round(power * 0.12 + 1))
    elif kind == 'nova':
        # multi-shot radial nova (e.g. 8-10 shots)
        return max(6, round(power * 0.14 + 1))
    elif kind == 'orbit':
        # multi-orb revolving damage
        return max(8, round(power * 0.20 + 2))
    elif kind == 'spin':
        # spin surrounding hits
        return max(8, round(power * 0.20 + 2))
    elif kind == 'aura' or kind == 'vortex' or kind == 'trail':
        # rapid tick areas
        return max(7, round(power * 0.16 + 2))
    elif kind == 'boomerang':
        # hits going out and coming back (2 hits * count)
        return max(8, round(power * 0.20 + 2))
    elif kind == 'meteor' or kind == 'chain':
        return max(10, round(power * 0.28 + 2))
    else:
        # single hit / direct attacks: projectile, melee, beam, dash, charge, quake, shove, stun, mine
        return max(10, round(power * 0.35 + 2))

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOVES_PATH = os.path.join(ROOT, 'js', 'data', 'moves.js')

with open(MOVES_PATH, 'r', encoding='utf-8') as f:
    src = f.read()

pattern = re.compile(r'(\{\s*id:\s*[\'"]([^\'"]+)[\'"].*?desc:\s*[\'"][^\'"]*[\'"],?\s*\n\s*)(cd:\s*[0-9\.]+.*?\})', re.DOTALL)

def repl(match):
    header = match.group(1)
    m_id = match.group(2)
    rest = match.group(3)
    
    kind_m = re.search(r"kind:\s*['\"]([^'\"]+)['\"]", header)
    kind = kind_m.group(1) if kind_m else ''
    cnt_m = re.search(r"count:\s*(\d+)", rest)
    cnt = int(cnt_m.group(1)) if cnt_m else 1

    power = get_power(m_id)
    rarity = get_rarity(power)

    # Clean existing power/rarity if already there
    header = re.sub(r",\s*power:\s*\d+", "", header)
    header = re.sub(r",\s*rarity:\s*['\"][^'\"]+['\"]", "", header)
    
    header = header.replace(f"kind: '{kind}'", f"kind: '{kind}', power: {power}, rarity: '{rarity}'")
    
    if 'dmg:' in rest:
        new_dmg = calc_dmg(power, kind, cnt)
        rest = re.sub(r'dmg:\s*[0-9\.]+', f'dmg: {new_dmg}', rest)
    return header + rest

updated = pattern.sub(repl, src)
with open(MOVES_PATH, 'w', encoding='utf-8', newline='\n') as f:
    f.write(updated)

print(f'Successfully updated {MOVES_PATH} with official power, rarity, and scaled dmg!')
