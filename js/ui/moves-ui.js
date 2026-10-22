/* ============ moves-ui.js — tra cứu chiêu thức theo hệ & đĩa TM ============ */
G.MovesUI = (() => {
  const $ = G.UI.$;
  const esc = G.U.esc;

  const TYPES = [
    'all', 'normal', 'fire', 'water', 'grass', 'electric', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  const TYPE_NAMES = {
    all: 'Tất cả', normal: 'Normal', fire: 'Fuego', water: 'Agua', grass: 'Planta',
    electric: 'Eléctrico', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
    ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
    rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
    steel: 'Acero', fairy: 'Hada'
  };

  const LADDERS = {
    projectile: [
      '+1 proyectil',
      '+45% daño',
      '-25% recarga',
      '+1 proyectil y +1 perforación'
    ],
    melee: [
      '+40% daño',
      '+25% alcance',
      '-25% recarga',
      'Golpea en 360° y +50% daño'
    ],
    beam: [
      '+45% daño',
      '+30% alcance y grosor',
      '-25% recarga',
      '+50% daño'
    ],
    orbit: [
      '+1 orbe',
      '+40% daño',
      '+25% radio',
      '+1 orbe y -25% recarga'
    ],
    nova: [
      '+3 proyectiles',
      '+45% daño',
      '-25% recarga',
      '+3 proyectiles y +1 perforación'
    ],
    aura: [
      '+40% daño',
      '+25% radio',
      '-25% recarga',
      '+45% daño y +25% radio'
    ],
    boomerang: [
      '+40% daño',
      '+25% alcance',
      '-25% recarga',
      '+1 bumerán y +30% daño'
    ],
    chain: [
      '+1 salto',
      '+40% daño',
      '-25% recarga',
      '+2 saltos y +30% daño'
    ],
    mine: [
      '+1 mina',
      '+45% daño',
      '+25% radio de explosión',
      '+1 mina y -25% recarga'
    ],
    meteor: [
      '+1 meteoro',
      '+45% daño',
      '+25% radio de impacto',
      '+1 meteoro y -25% recarga'
    ],
    turret: [
      '+50% duración',
      '+40% daño',
      'Dispara un 25% más rápido',
      '+1 torreta a la vez'
    ],
    dash: [
      '+40% daño',
      '+30% distancia',
      '-25% recarga',
      '+50% daño y atraviesa más rápido'
    ],
    trail: [
      '+50% duración del rastro',
      '+40% daño',
      '+30% anchura del rastro',
      '+45% daño y -25% recarga'
    ],
    cone: [
      '+2 disparos',
      '+40% daño',
      '+25% alcance',
      '+3 disparos y +1 perforación'
    ],
    homing: [
      '+1 proyectil',
      '+45% daño',
      '-25% recarga',
      '+1 proyectil y persigue más rápido'
    ],
    bounce: [
      '+1 rebote',
      '+45% daño',
      '-25% recarga',
      '+1 proyectil y +1 rebote'
    ],
    charge: [
      '+45% daño',
      '+30% alcance y grosor',
      'Carga más rápido y -20% recarga',
      '+50% daño'
    ],
    spin: [
      '+40% daño',
      '+25% radio',
      '+1 vuelta',
      '-25% recarga y +30% daño'
    ],
    quake: [
      '+2 ondas',
      '+45% daño',
      '+25% tamaño',
      '-25% recarga y +2 ondas'
    ],
    vortex: [
      '+40% daño',
      '+30% radio',
      '+50% duración',
      'Atrae más fuerte y +40% daño'
    ],
    shove: [
      '+40% daño',
      '+25% radio',
      '-25% recarga',
      '+50% empuje y +40% daño'
    ],
    stun: [
      '+40% daño',
      '+25% radio',
      '+50% aturdimiento',
      '-25% recarga y +30% daño'
    ],
    buff: [
      '+1 acumulación máxima',
      '+40% potencia',
      '+50% duración',
      '+1 acumulación y +40% potencia'
    ]
  };

  const EVO_TEXTS = {
    projectile: '×1,8 daño, +2 proyectiles, +2 perforación y más grandes',
    melee: '×1,9 daño, más alcance y golpea en 360°',
    beam: '×1,8 daño, rayo un 50% más grueso y más largo',
    orbit: '+2 orbes, ×1,7 daño y más radio',
    nova: '+6 proyectiles, ×1,6 daño y +1 perforación',
    aura: '×1,8 daño y un 35% más de radio',
    boomerang: '×1,8 daño, +1 bumerán y más alcance',
    chain: '×1,7 daño y +3 saltos',
    mine: '×1,8 daño, +2 minas y explosión más grande',
    meteor: '×1,7 daño, +2 meteoros y más radio',
    turret: '×1,8 daño, +1 a la vez y dispara más rápido',
    dash: '×1,9 daño, más distancia y menos recarga',
    trail: '×1,8 daño, charcos más grandes y duraderos',
    cone: '×1,7 daño, +4 disparos y +1 perforación',
    homing: '×1,8 daño, +2 proyectiles y más grandes',
    bounce: '×1,8 daño, +2 rebotes y +1 proyectil',
    charge: '×1,8 daño, rayo un 50% más grueso y carga más rápido',
    spin: '×1,8 daño, +1 vuelta y más radio',
    quake: '×1,8 daño, +3 ondas y ondas más grandes',
    vortex: '×1,8 daño, más radio y atrae más fuerte',
    shove: '×1,8 daño, más radio y empuja más',
    stun: '×1,8 daño, más radio y aturde más rato'
  };

  let curTab = 'types';
  let curType = 'all';
  let qMoves = '';
  let qTMs = '';
  let selMoveId = 'ember';
  let selTMId = 'flamethrower';

  function init() {
    const tabs = $('moves-main-tabs');
    if (tabs) {
      tabs.querySelectorAll('.tab').forEach(t => {
        t.onclick = () => {
          tabs.querySelectorAll('.tab').forEach(x => x.classList.remove('on'));
          t.classList.add('on');
          curTab = t.dataset.tab;
          $('moves-tab-types').classList.toggle('hidden', curTab !== 'types');
          $('moves-tab-tms').classList.toggle('hidden', curTab !== 'tms');
          if (curTab === 'types') renderTypesTab();
          else renderTMsTab();
        };
      });
    }

    if ($('moves-search')) {
      $('moves-search').oninput = e => {
        qMoves = e.target.value.toLowerCase().trim();
        renderMovesList();
      };
    }
    if ($('tms-search')) {
      $('tms-search').oninput = e => {
        qTMs = e.target.value.toLowerCase().trim();
        renderTMsList();
      };
    }
  }

  function open() {
    G.UI.chrome(true);
    G.UI.show('scr-moves', true);
    renderTypesBar();
    renderTypesTab();
    renderTMsTab();
  }

  function close() {
    G.UI.hide('scr-moves');
    G.MenuUI.open();
  }

  // ---------------- Tab 1: Kỹ Năng Theo Hệ ----------------

  function renderTypesBar() {
    const box = $('moves-type-chips');
    if (!box) return;
    box.innerHTML = '';
    for (const t of TYPES) {
      const b = document.createElement('button');
      b.className = 'type-chip-btn' + (t === curType ? ' on' : '');
      const name = G.T(TYPE_NAMES[t] || t);
      if (t === 'all') {
        b.innerHTML = `<span>🌈 ${name}</span>`;
      } else {
        const bg = G.U.TYPE_COLOR[t] || '#666';
        b.style.setProperty('--tc', bg);
        b.innerHTML = `<span class="ty-dot" style="background:${bg}"></span><span>${name}</span>`;
      }
      b.onclick = () => {
        curType = t;
        renderTypesBar();
        renderMovesList();
      };
      box.appendChild(b);
    }
  }

  function renderTypesTab() {
    renderMovesList();
    renderMoveDetail(selMoveId);
  }

  function renderMovesList() {
    const box = $('moves-list');
    if (!box) return;
    box.innerHTML = '';

    const all = G.Moves.ALL || [];
    const filtered = all.filter(m => {
      if (curType !== 'all' && m.type !== curType) return false;
      if (qMoves) {
        const trName = G.T(m.name).toLowerCase();
        const trDesc = G.T(m.desc).toLowerCase();
        return m.name.toLowerCase().includes(qMoves) || trName.includes(qMoves) || trDesc.includes(qMoves);
      }
      return true;
    });

    if (!filtered.length) {
      box.innerHTML = '<p class="sub center" style="padding:20px">Không tìm thấy chiêu thức nào.</p>';
      return;
    }

    if (!filtered.some(m => m.id === selMoveId)) {
      selMoveId = filtered[0].id;
    }

    for (const m of filtered) {
      const item = document.createElement('div');
      item.className = 'move-row-item' + (m.id === selMoveId ? ' on' : '');
      const trName = G.T(m.name);
      const isEvo = !!(G.Moves.EVO && G.Moves.EVO[m.id]);
      const cat = m.stat === 'patk' || m.stat === 'satk' || m.kind === 'buff' ? '🛡️ Buff'
        : (G.Moves.isSpecial && G.Moves.isSpecial(m.id) ? '🔮 Sp.' : '⚔️ Phys.');

      item.innerHTML = `
        <div class="row" style="gap:6px;align-items:center">
          ${G.UI.typeChips([m.type])}
          <b class="m-name">${esc(trName)}</b>
        </div>
        <div class="row between" style="font-size:12px;color:var(--muted);margin-top:4px">
          <span>${cat}</span>
          ${isEvo ? '<span class="evo-badge">⚡ Có tiến hóa</span>' : ''}
        </div>
      `;
      item.onclick = () => {
        selMoveId = m.id;
        box.querySelectorAll('.move-row-item').forEach(x => x.classList.remove('on'));
        item.classList.add('on');
        renderMoveDetail(m.id);
      };
      box.appendChild(item);
    }
    renderMoveDetail(selMoveId);
  }

  function renderMoveDetail(id) {
    const box = $('move-detail');
    if (!box) return;
    const m = (G.Moves.ALL || []).find(x => x.id === id);
    if (!m) {
      box.innerHTML = '<p class="sub center" style="padding:30px">Hãy chọn một chiêu thức để xem chi tiết.</p>';
      return;
    }

    const trName = G.T(m.name);
    const trDesc = G.T(m.desc);
    const evo = G.Moves.EVO ? G.Moves.EVO[m.id] : null;
    const ladder = LADDERS[m.kind] || [];
    const evoText = EVO_TEXTS[m.kind] || '';

    // Stats line
    const statsHtml = [];
    if (m.dmg) statsHtml.push(`<span>💥 Sát thương gốc: <b class="gold">${m.dmg}</b></span>`);
    if (m.cd) statsHtml.push(`<span>⏱️ Hồi chiêu: <b class="gold">${m.cd}s</b></span>`);
    if (m.count && m.count > 1) statsHtml.push(`<span>🎯 Số tia/đòn: <b class="gold">${m.count}</b></span>`);
    if (m.burn) statsHtml.push(`<span style="color:#ff7675">🔥 Gây bỏng</span>`);
    if (m.poison) statsHtml.push(`<span style="color:#a29bfe">☠️ Gây độc</span>`);
    if (m.slow) statsHtml.push(`<span style="color:#74b9ff">❄️ Làm chậm</span>`);

    // Ladder steps
    let ladderHtml = '';
    if (ladder.length) {
      ladderHtml = ladder.map((step, idx) => `
        <div class="lvl-step">
          <span class="lvl-num">Cấp ${idx + 2}</span>
          <span class="lvl-desc">${esc(G.T(step))}</span>
        </div>
      `).join('');
    } else {
      ladderHtml = '<div class="sub">Tăng hiệu lực với mỗi cấp độ trong trận.</div>';
    }

    // Evolution block
    let evoBlock = '';
    if (evo) {
      const [evoName, reqStat] = evo;
      const reqName = G.Moves.NEED_NAME ? G.Moves.NEED_NAME[reqStat] : reqStat;
      evoBlock = `
        <div class="evo-box-card">
          <div class="evo-header">
            <span class="evo-tag">TIẾN HÓA CHIÊU TRONG TRẬN</span>
            <span class="evo-arrow">➔</span>
            <b class="evo-to-name gold">${esc(G.T(evoName))}</b>
          </div>
          <div class="evo-req">
            <span>Yêu cầu món đồ phụ trợ:</span>
            <b class="evo-req-item">📦 ${esc(G.T(reqName || reqStat))}</b>
          </div>
          <div class="evo-boost">
            <span>Hiệu ứng nhận được:</span>
            <div class="evo-boost-text">✨ ${esc(G.T(evoText))}</div>
          </div>
        </div>
      `;
    } else {
      evoBlock = `
        <div class="evo-box-card none">
          <span class="sub">Chiêu thức này là chiêu cơ bản / không có dạng tiến hóa bậc 2 trong trận.</span>
        </div>
      `;
    }

    box.innerHTML = `
      <div class="move-detail-card">
        <div class="row between" style="align-items:center">
          <div class="row" style="gap:8px;align-items:center">
            ${G.UI.typeChips([m.type])}
            <h3 class="m-title" style="margin:0">${esc(trName)}</h3>
          </div>
          <span class="m-kind-badge">${esc(m.kind)}</span>
        </div>
        <p class="m-desc">${esc(trDesc)}</p>
        <div class="m-stats-row">${statsHtml.join(' · ')}</div>
        
        <h4 class="sec-title">📈 Nâng cấp cấp độ trong trận (Cấp 1 ➔ 5)</h4>
        <div class="lvl-steps-list">
          <div class="lvl-step">
            <span class="lvl-num">Cấp 1</span>
            <span class="lvl-desc">Học chiêu với các chỉ số cơ bản</span>
          </div>
          ${ladderHtml}
        </div>

        <h4 class="sec-title" style="margin-top:14px">⚡ Tiến hóa chiêu thức (Skill Evolution)</h4>
        ${evoBlock}
      </div>
    `;
  }

  // ---------------- Tab 2: Đĩa TM & Pokémon Học Được ----------------

  function renderTMsTab() {
    renderTMsList();
    renderTMDetail(selTMId);
  }

  function renderTMsList() {
    const box = $('tms-list');
    if (!box) return;
    box.innerHTML = '';

    const tmKeys = Object.keys(G.TM_MOVES || {});
    const filtered = tmKeys.filter(id => {
      const m = (G.Moves.ALL || []).find(x => x.id === id);
      if (!m) return false;
      if (qTMs) {
        const trName = G.T(m.name).toLowerCase();
        return m.name.toLowerCase().includes(qTMs) || trName.includes(qTMs) || id.includes(qTMs);
      }
      return true;
    }).sort((a, b) => {
      const ma = (G.Moves.ALL || []).find(x => x.id === a);
      const mb = (G.Moves.ALL || []).find(x => x.id === b);
      return (ma ? ma.name : a).localeCompare(mb ? mb.name : b);
    });

    if (!filtered.length) {
      box.innerHTML = '<p class="sub center" style="padding:20px">Không tìm thấy đĩa TM nào.</p>';
      return;
    }

    if (!filtered.includes(selTMId)) {
      selTMId = filtered[0];
    }

    for (const id of filtered) {
      const m = (G.Moves.ALL || []).find(x => x.id === id);
      if (!m) continue;
      const count = (G.TM_MOVES[id] || []).length;
      const trName = G.T(m.name);
      const item = document.createElement('div');
      item.className = 'move-row-item' + (id === selTMId ? ' on' : '');
      item.innerHTML = `
        <div class="row" style="gap:6px;align-items:center">
          ${G.Icons.html('tm', 18)}
          <b class="m-name">${esc(trName)}</b>
          <span class="grow"></span>
          ${G.UI.typeChips([m.type])}
        </div>
        <div class="row between" style="font-size:12px;color:var(--muted);margin-top:4px">
          <span>👥 Học được: <b style="color:#fff">${count}</b> loài</span>
        </div>
      `;
      item.onclick = () => {
        selTMId = id;
        box.querySelectorAll('.move-row-item').forEach(x => x.classList.remove('on'));
        item.classList.add('on');
        renderTMDetail(id);
      };
      box.appendChild(item);
    }
    renderTMDetail(selTMId);
  }

  function renderTMDetail(id) {
    const box = $('tm-detail');
    if (!box) return;
    const m = (G.Moves.ALL || []).find(x => x.id === id);
    if (!m) {
      box.innerHTML = '<p class="sub center" style="padding:30px">Hãy chọn một đĩa TM để xem danh sách Pokémon học được.</p>';
      return;
    }

    const trName = G.T(m.name);
    const trDesc = G.T(m.desc);
    const pokes = G.TM_MOVES[id] || [];
    const s = G.DB.save || {};
    const ownedMap = s.owned || {};

    box.innerHTML = `
      <div class="tm-detail-card">
        <div class="row between" style="align-items:center">
          <div class="row" style="gap:8px;align-items:center">
            ${G.Icons.html('tm', 26)}
            <h3 class="m-title" style="margin:0">${esc(trName)}</h3>
            ${G.UI.typeChips([m.type])}
          </div>
          <span class="m-count-badge">Tổng cộng ${pokes.length} Pokémon</span>
        </div>
        <p class="m-desc">${esc(trDesc)}</p>

        <h4 class="sec-title" style="margin:12px 0 8px">📋 Danh sách Pokémon có thể học chiêu này qua TM:</h4>
        <div class="tm-poke-grid" id="tm-poke-grid"></div>
      </div>
    `;

    const grid = box.querySelector('#tm-poke-grid');
    if (grid) {
      for (const dex of pokes) {
        const mon = G.DEX_BY[dex];
        if (!mon) continue;
        const isOwned = !!ownedMap[dex];
        const cell = document.createElement('div');
        cell.className = 'tm-poke-cell' + (isOwned ? ' owned' : '');
        cell.innerHTML = `
          <div class="tp-num">#${String(dex).padStart(3, '0')}</div>
          <div class="tp-sprite"></div>
          <b class="tp-name">${esc(mon.name)}</b>
          <div class="tp-types">${G.UI.typeChips(mon.types)}</div>
          ${isOwned ? '<span class="tp-tag">Đã sở hữu</span>' : ''}
        `;
        const sBox = cell.querySelector('.tp-sprite');
        if (sBox) sBox.appendChild(G.UI.spriteCanvas(dex, 44, 44, { lively: true }));
        grid.appendChild(cell);
      }
    }
  }

  return { init, open, close };
})();
