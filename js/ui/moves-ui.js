/* ============ moves-ui.js — tra cứu chiêu thức theo hệ & đĩa TM ============ */
G.MovesUI = (() => {
  const $ = id => G.UI.$(id);
  const esc = s => (G.U && G.U.esc ? G.U.esc(s) : String(s || ''));

  const TYPES = [
    'all', 'normal', 'fire', 'water', 'grass', 'electric', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

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
  let qItems = '';
  let qAbilities = '';
  let selMoveId = 'ember';
  let selTMId = 'flamethrower';
  let selItemId = 'leftovers';
  let selAbilityId = 'overgrow';

  function init() {
    const tabs = $('moves-main-tabs');
    if (tabs) {
      tabs.querySelectorAll('.tab').forEach(t => {
        t.onclick = () => {
          tabs.querySelectorAll('.tab').forEach(x => x.classList.remove('on'));
          t.classList.add('on');
          curTab = t.dataset.tab;
          if ($('moves-tab-types')) $('moves-tab-types').classList.toggle('hidden', curTab !== 'types');
          if ($('moves-tab-tms')) $('moves-tab-tms').classList.toggle('hidden', curTab !== 'tms');
          if ($('moves-tab-items')) $('moves-tab-items').classList.toggle('hidden', curTab !== 'items');
          if ($('moves-tab-abilities')) $('moves-tab-abilities').classList.toggle('hidden', curTab !== 'abilities');
          if (curTab === 'types') renderTypesTab();
          else if (curTab === 'tms') renderTMsTab();
          else if (curTab === 'items') renderItemsTab();
          else if (curTab === 'abilities') renderAbilitiesTab();
        };
      });
    }

    if ($('moves-search')) {
      $('moves-search').oninput = e => {
        qMoves = (e.target.value || '').toLowerCase().trim();
        renderMovesList();
      };
    }
    if ($('tms-search')) {
      $('tms-search').oninput = e => {
        qTMs = (e.target.value || '').toLowerCase().trim();
        renderTMsList();
      };
    }
    if ($('items-search')) {
      $('items-search').oninput = e => {
        qItems = (e.target.value || '').toLowerCase().trim();
        renderItemsList();
      };
    }
    if ($('abilities-search')) {
      $('abilities-search').oninput = e => {
        qAbilities = (e.target.value || '').toLowerCase().trim();
        renderAbilitiesList();
      };
    }
  }

  function open(targetId, tab) {
    G.UI.chrome(true);
    G.UI.show('scr-moves', true);

    if (tab) {
      curTab = tab;
    } else if (targetId && G.TM_MOVES && G.TM_MOVES[targetId]) {
      curTab = 'tms';
    } else if (targetId && G.ABIL && G.ABIL[targetId]) {
      curTab = 'abilities';
    } else if (targetId && ((G.Items && G.Items.BY && G.Items.BY[targetId]) || (G.LevelUp && G.LevelUp.STATS && G.LevelUp.STATS.some(s => s.id === targetId)))) {
      curTab = 'items';
    }

    if (targetId) {
      if (curTab === 'tms') {
        selTMId = targetId;
      } else if (curTab === 'abilities') {
        selAbilityId = targetId;
      } else if (curTab === 'items') {
        selItemId = targetId;
      } else {
        selMoveId = targetId;
        const m = (G.Moves.ALL || []).find(x => x.id === targetId);
        if (m && m.type) curType = m.type;
      }
    }

    const tabs = $('moves-main-tabs');
    if (tabs) {
      tabs.querySelectorAll('.tab').forEach(t => {
        t.classList.toggle('on', t.dataset.tab === curTab);
      });
    }
    if ($('moves-tab-types')) $('moves-tab-types').classList.toggle('hidden', curTab !== 'types');
    if ($('moves-tab-tms')) $('moves-tab-tms').classList.toggle('hidden', curTab !== 'tms');
    if ($('moves-tab-items')) $('moves-tab-items').classList.toggle('hidden', curTab !== 'items');
    if ($('moves-tab-abilities')) $('moves-tab-abilities').classList.toggle('hidden', curTab !== 'abilities');

    renderTypesBar();
    if (curTab === 'types') {
      renderTypesTab();
    } else if (curTab === 'tms') {
      renderTMsTab();
    } else if (curTab === 'items') {
      renderItemsTab();
    } else if (curTab === 'abilities') {
      renderAbilitiesTab();
    }
  }

  function close() {
    G.UI.hide('scr-moves');
    G.MenuUI.open();
  }

  // ---------------- Tab 1: Movimientos por Tipo ----------------

  function renderTypesBar() {
    const box = $('moves-type-chips');
    if (!box) return;
    box.innerHTML = '';
    for (const t of TYPES) {
      const b = document.createElement('button');
      b.className = 'type-chip-btn' + (t === curType ? ' on' : '');
      const name = t === 'all' ? G.T('Todos') : G.T(G.U.TYPE_NAME[t] || t);
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
      if (!m) return false;
      if (curType !== 'all' && m.type !== curType) return false;
      if (qMoves) {
        const rawName = (m.name || m.id || '').toLowerCase();
        const trName = String(G.T(m.name || '')).toLowerCase();
        const trDesc = String(G.T(m.desc || '')).toLowerCase();
        return rawName.includes(qMoves) || trName.includes(qMoves) || trDesc.includes(qMoves) || (m.id || '').includes(qMoves);
      }
      return true;
    });

    if (!filtered.length) {
      box.innerHTML = `<p class="sub center" style="padding:20px">${G.T('No se encontró ningún movimiento.')}</p>`;
      return;
    }

    if (!filtered.some(m => m.id === selMoveId)) {
      selMoveId = filtered[0].id;
    }

    for (const m of filtered) {
      const item = document.createElement('div');
      item.className = 'move-row-item' + (m.id === selMoveId ? ' on' : '');
      const trName = G.T(m.name || m.id, 'move');
      const isEvo = !!(G.Moves.EVO && G.Moves.EVO[m.id]);
      const cat = m.stat === 'patk' || m.stat === 'satk' || m.kind === 'buff' ? G.T('🛡️ Buff')
        : (G.Moves.isSpecial && G.Moves.isSpecial(m.id) ? G.T('🔮 Esp.') : G.T('⚔️ Fís.'));
      const rCol = m.rarity === 'epic' ? '#c084fc' : m.rarity === 'rare' ? '#60a5fa' : '#4ade80';
      const rName = G.T(m.rarity || 'uncommon');
      const rTag = `<span style="font-size:10px;padding:1px 5px;border-radius:3px;background:${rCol}22;color:${rCol};border:1px solid ${rCol}55;text-transform:capitalize">${rName}</span>`;
      const pwrTag = m.power ? `<span style="font-size:11px;color:#fde047;font-weight:bold">${m.power} PWR</span>` : '';

      item.innerHTML = `
        <div class="row" style="gap:6px;align-items:center">
          ${G.UI.typeChips([m.type])}
          <b class="m-name">${esc(trName)}</b>
          <span class="grow"></span>
          ${pwrTag}
        </div>
        <div class="row between" style="font-size:12px;color:var(--muted);margin-top:4px;align-items:center">
          <div class="row" style="gap:6px;align-items:center">
            <span>${cat}</span>
            ${rTag}
          </div>
          ${isEvo ? `<span class="evo-badge">${G.T('⚡ Evoluciona')}</span>` : ''}
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
      box.innerHTML = `<p class="sub center" style="padding:30px">${G.T('Selecciona un movimiento para ver sus detalles.')}</p>`;
      return;
    }

    const trName = G.T(m.name || m.id, 'move');
    const trDesc = G.T(m.desc || '');
    const evo = G.Moves.EVO ? G.Moves.EVO[m.id] : null;
    const ladder = LADDERS[m.kind] || [];
    const evoText = EVO_TEXTS[m.kind] || '';

    const rCol = m.rarity === 'epic' ? '#c084fc' : m.rarity === 'rare' ? '#60a5fa' : '#4ade80';
    const rName = G.T(m.rarity || 'uncommon');
    const rarityBadge = `<span class="m-kind-badge" style="background:${rCol}22;color:${rCol};border-color:${rCol}66;font-weight:bold;text-transform:capitalize">⭐ ${rName}</span>`;

    // Stats line
    const statsHtml = [];
    if (m.power !== undefined) {
      statsHtml.push(`<span>⚡ ${G.T('Poder:')} <b class="gold">${m.power}</b></span>`);
    }
    if (m.dmg) {
      const scaleStat = m.stat === 'patk' || m.stat === 'satk' || m.kind === 'buff' ? ''
        : (G.Moves.isSpecial && G.Moves.isSpecial(m.id) ? ` (${G.T('Escala con At. Esp.')})` : ` (${G.T('Escala con Ataque')})`);
      statsHtml.push(`<span>💥 ${G.T('Daño base:')} <b class="gold">${m.dmg}</b><small style="opacity:0.85">${scaleStat}</small></span>`);
    }
    if (m.cd) statsHtml.push(`<span>⏱️ ${G.T('Recarga:')} <b class="gold">${m.cd}s</b></span>`);
    if (m.count && m.count > 1) statsHtml.push(`<span>🎯 ${G.T('Cantidad:')} <b class="gold">${m.count}</b></span>`);
    if (m.burn) statsHtml.push(`<span style="color:#ff7675">🔥 ${G.T('Quema')}</span>`);
    if (m.poison) statsHtml.push(`<span style="color:#a29bfe">☠️ ${G.T('Envenena')}</span>`);
    if (m.slow) statsHtml.push(`<span style="color:#74b9ff">❄️ ${G.T('Ralentiza')}</span>`);

    // Ladder steps
    let ladderHtml = '';
    if (ladder.length) {
      ladderHtml = ladder.map((step, idx) => `
        <div class="lvl-step">
          <span class="lvl-num">${G.I18n.f('Nivel {x}', idx + 2)}</span>
          <span class="lvl-desc">${esc(G.T(step))}</span>
        </div>
      `).join('');
    } else {
      ladderHtml = `<div class="sub">${G.T('Aumenta su potencia en cada nivel durante la partida.')}</div>`;
    }

    // Evolution block
    let evoBlock = '';
    if (evo) {
      const [evoName, reqStat] = evo;
      const reqName = G.Moves.NEED_NAME ? G.Moves.NEED_NAME[reqStat] : reqStat;
      evoBlock = `
        <div class="evo-box-card">
          <div class="evo-header">
            <span class="evo-tag">${G.T('EVOLUCIÓN EN PARTIDA')}</span>
            <span class="evo-arrow">➔</span>
            <b class="evo-to-name gold">${esc(G.T(evoName, 'move'))}</b>
          </div>
          <div class="evo-req">
            <span>${G.T('Objeto pasivo requerido:')}</span>
            <b class="evo-req-item">📦 ${esc(G.T(reqName || reqStat))}</b>
          </div>
          <div class="evo-boost">
            <span>${G.T('Efecto recibido:')}</span>
            <div class="evo-boost-text">✨ ${esc(G.T(evoText))}</div>
          </div>
        </div>
      `;
    } else {
      evoBlock = `
        <div class="evo-box-card none">
          <span class="sub">${G.T('Este movimiento no tiene evolución secundaria en partida.')}</span>
        </div>
      `;
    }

    const catBadge = m.stat === 'patk' || m.stat === 'satk' || m.kind === 'buff' ? G.T('🛡️ Buff')
      : (G.Moves.isSpecial && G.Moves.isSpecial(m.id) ? G.T('🔮 Ataque Especial') : G.T('⚔️ Ataque Físico'));

    box.innerHTML = `
      <div class="move-detail-card">
        <div class="row between" style="align-items:center;flex-wrap:wrap;gap:8px">
          <div class="row" style="gap:8px;align-items:center">
            ${G.UI.typeChips([m.type])}
            <h3 class="m-title" style="margin:0">${esc(trName)}</h3>
            ${rarityBadge}
          </div>
          <span class="m-kind-badge">${esc(catBadge)}</span>
        </div>
        <p class="m-desc">${esc(trDesc)}</p>
        ${statsHtml.length ? `<div class="m-stats-row">${statsHtml.join(' · ')}</div>` : ''}
        
        <h4 class="sec-title">📈 ${G.T('Mejoras de nivel en partida (Nivel 1 ➔ 5)')}</h4>
        <div class="lvl-steps-list">
          <div class="lvl-step">
            <span class="lvl-num">${G.T('Nivel 1')}</span>
            <span class="lvl-desc">${G.T('Aprende el movimiento con estadísticas base')}</span>
          </div>
          ${ladderHtml}
        </div>

        <h4 class="sec-title" style="margin-top:14px">⚡ ${G.T('Evolución de movimiento (Skill Evolution)')}</h4>
        ${evoBlock}
      </div>
    `;
  }

  // ---------------- Tab 2: Discos MT & Pokémon que la aprenden ----------------

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
        const rawName = (m.name || id).toLowerCase();
        const trName = String(G.T(m.name || id, 'move')).toLowerCase();
        return rawName.includes(qTMs) || trName.includes(qTMs) || id.includes(qTMs);
      }
      return true;
    }).sort((a, b) => {
      const ma = (G.Moves.ALL || []).find(x => x.id === a);
      const mb = (G.Moves.ALL || []).find(x => x.id === b);
      const na = G.T(ma ? ma.name : a, 'move');
      const nb = G.T(mb ? mb.name : b, 'move');
      return na.localeCompare(nb);
    });

    if (!filtered.length) {
      box.innerHTML = `<p class="sub center" style="padding:20px">${G.T('No se encontró ninguna MT.')}</p>`;
      return;
    }

    if (!filtered.includes(selTMId)) {
      selTMId = filtered[0];
    }

    for (const id of filtered) {
      const m = (G.Moves.ALL || []).find(x => x.id === id);
      if (!m) continue;
      const count = (G.TM_MOVES[id] || []).length;
      const trName = G.T(m.name || id, 'move');
      const rCol = m.rarity === 'epic' ? '#c084fc' : m.rarity === 'rare' ? '#60a5fa' : '#4ade80';
      const rName = G.T(m.rarity || 'uncommon');
      const rTag = `<span style="font-size:10px;padding:1px 5px;border-radius:3px;background:${rCol}22;color:${rCol};border:1px solid ${rCol}55;text-transform:capitalize">${rName}</span>`;
      const pwrTag = m.power ? `<span style="font-size:11px;color:#fde047;font-weight:bold">${m.power} PWR</span>` : '';

      const item = document.createElement('div');
      item.className = 'move-row-item' + (id === selTMId ? ' on' : '');
      item.innerHTML = `
        <div class="row" style="gap:6px;align-items:center">
          ${G.Icons.html('tm', 18)}
          <b class="m-name">${esc(trName)}</b>
          <span class="grow"></span>
          ${pwrTag}
          ${G.UI.typeChips([m.type])}
        </div>
        <div class="row between" style="font-size:12px;color:var(--muted);margin-top:4px;align-items:center">
          <span>👥 ${G.I18n.f('Lo aprenden: {x} especies', count)}</span>
          ${rTag}
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
      box.innerHTML = `<p class="sub center" style="padding:30px">${G.T('Selecciona una MT para ver los Pokémon que la aprenden.')}</p>`;
      return;
    }

    const trName = G.T(m.name || id, 'move');
    const trDesc = G.T(m.desc || '');
    const pokes = G.TM_MOVES[id] || [];
    const s = G.DB.save || {};
    const ownedMap = s.owned || {};
    const ownedCount = pokes.filter(dex => !!ownedMap[dex]).length;

    const rCol = m.rarity === 'epic' ? '#c084fc' : m.rarity === 'rare' ? '#60a5fa' : '#4ade80';
    const rName = G.T(m.rarity || 'uncommon');
    const rarityBadge = `<span class="m-kind-badge" style="background:${rCol}22;color:${rCol};border-color:${rCol}66;font-weight:bold;text-transform:capitalize">⭐ ${rName}</span>`;

    // Stats line
    const statsHtml = [];
    if (m.power !== undefined) {
      statsHtml.push(`<span>⚡ ${G.T('Poder:')} <b class="gold">${m.power}</b></span>`);
    }
    if (m.dmg) {
      const scaleStat = m.stat === 'patk' || m.stat === 'satk' || m.kind === 'buff' ? ''
        : (G.Moves.isSpecial && G.Moves.isSpecial(m.id) ? ` (${G.T('Escala con At. Esp.')})` : ` (${G.T('Escala con Ataque')})`);
      statsHtml.push(`<span>💥 ${G.T('Daño base:')} <b class="gold">${m.dmg}</b><small style="opacity:0.85">${scaleStat}</small></span>`);
    }
    if (m.cd) statsHtml.push(`<span>⏱️ ${G.T('Recarga:')} <b class="gold">${m.cd}s</b></span>`);
    if (m.count && m.count > 1) statsHtml.push(`<span>🎯 ${G.T('Cantidad:')} <b class="gold">${m.count}</b></span>`);

    const tmUnlockNote = `<div style="font-size:12px;color:#67e8f9;background:rgba(103,232,249,0.1);border:1px solid rgba(103,232,249,0.25);padding:6px 10px;border-radius:6px;margin:6px 0 10px">
      💡 ${G.T('Aprender esta MT desbloquea este movimiento para ser elegido como Ataque Inicial en Mejoras.')}
    </div>`;

    box.innerHTML = `
      <div class="tm-detail-card">
        <div class="row between" style="align-items:center;flex-wrap:wrap;gap:8px">
          <div class="row" style="gap:8px;align-items:center">
            ${G.Icons.html('tm', 26)}
            <h3 class="m-title" style="margin:0">${esc(trName)}</h3>
            ${G.UI.typeChips([m.type])}
            ${rarityBadge}
          </div>
          <span class="m-count-badge">${G.I18n.f('{x} Pokémon en total', pokes.length)} (${G.I18n.f('{x} conseguidos', ownedCount)})</span>
        </div>
        <p class="m-desc">${esc(trDesc)}</p>
        ${statsHtml.length ? `<div class="m-stats-row">${statsHtml.join(' · ')}</div>` : ''}
        ${tmUnlockNote}

        <h4 class="sec-title" style="margin:12px 0 8px">📋 ${G.T('Pokémon que pueden aprender este movimiento por MT:')}</h4>
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
          ${isOwned ? `<span class="tp-tag">${G.T('Conseguido')}</span>` : ''}
        `;
        const sBox = cell.querySelector('.tp-sprite');
        if (sBox) sBox.appendChild(G.UI.spriteCanvas(dex, 44, 44, { lively: true }));
        grid.appendChild(cell);
      }
    }
  }

  // ---------------- Tab 3: Objetos & Pasivas ----------------

  function renderItemsTab() {
    renderItemsList();
    renderItemDetail(selItemId);
  }

  function renderItemsList() {
    const box = $('items-list');
    if (!box) return;
    box.innerHTML = '';

    const held = (G.Items && G.Items.LIST) || [];
    const passives = (G.LevelUp && G.LevelUp.STATS) || [];

    const allItems = [
      ...held.map(it => ({ ...it, isHeld: true })),
      ...passives.map(st => ({ id: st.id, name: st.title, desc: st.desc, icon: st.icon, isPassive: true, max: st.max }))
    ];

    const filtered = allItems.filter(it => {
      if (!it) return false;
      if (qItems) {
        const trName = String(G.T(it.name || it.id)).toLowerCase();
        const trDesc = String(G.T(it.desc || '')).toLowerCase();
        return it.id.includes(qItems) || (it.name || '').toLowerCase().includes(qItems) || trName.includes(qItems) || trDesc.includes(qItems);
      }
      return true;
    });

    if (!filtered.length) {
      box.innerHTML = `<p class="sub center" style="padding:20px">${G.T('No se encontró ningún objeto.')}</p>`;
      return;
    }

    if (!filtered.some(x => x.id === selItemId)) {
      selItemId = filtered[0].id;
    }

    for (const it of filtered) {
      const trName = G.T(it.name || it.id);
      const isH = it.isHeld;
      const tag = isH 
        ? `<span style="font-size:10px;padding:1px 5px;border-radius:3px;background:#3b82f622;color:#60a5fa;border:1px solid #3b82f655">${G.T('📦 Equipable')}</span>`
        : `<span style="font-size:10px;padding:1px 5px;border-radius:3px;background:#eab30822;color:#facc15;border:1px solid #eab30855">${G.T('⚡ Pasiva')}</span>`;
      const ic = isH ? G.Icons.html('bag', 18) : (it.icon ? G.Icons.html(it.icon, 18) : '⚡');

      const item = document.createElement('div');
      item.className = 'move-row-item' + (it.id === selItemId ? ' on' : '');
      item.innerHTML = `
        <div class="row" style="gap:6px;align-items:center">
          ${ic}
          <b class="m-name">${esc(trName)}</b>
          <span class="grow"></span>
          ${tag}
        </div>
        <div class="row between" style="font-size:12px;color:var(--muted);margin-top:4px">
          <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px">${esc(G.T(it.desc || ''))}</span>
        </div>
      `;
      item.onclick = () => {
        selItemId = it.id;
        box.querySelectorAll('.move-row-item').forEach(x => x.classList.remove('on'));
        item.classList.add('on');
        renderItemDetail(it.id);
      };
      box.appendChild(item);
    }
    renderItemDetail(selItemId);
  }

  function renderItemDetail(id) {
    const box = $('item-detail');
    if (!box) return;

    const held = (G.Items && G.Items.BY && G.Items.BY[id]);
    const passive = (G.LevelUp && G.LevelUp.STATS && G.LevelUp.STATS.find(s => s.id === id));
    if (!held && !passive) {
      box.innerHTML = `<p class="sub center" style="padding:30px">${G.T('Selecciona un objeto para ver sus detalles.')}</p>`;
      return;
    }

    if (held) {
      const trName = G.T(held.name || id);
      const trDesc = G.T(held.desc || '');
      box.innerHTML = `
        <div class="tm-detail-card">
          <div class="row between" style="align-items:center;flex-wrap:wrap;gap:8px">
            <div class="row" style="gap:8px;align-items:center">
              ${G.Icons.html('bag', 26)}
              <h3 class="m-title" style="margin:0">${esc(trName)}</h3>
              <span class="m-kind-badge" style="background:#3b82f622;color:#60a5fa;border-color:#3b82f666;font-weight:bold">${G.T('📦 Objeto Equipable')}</span>
            </div>
            <span class="m-count-badge">1 ${G.T('por partida')}</span>
          </div>
          <p class="m-desc" style="font-size:16px;margin:10px 0">${esc(trDesc)}</p>
          <div style="font-size:13px;color:#cbd5e1;background:rgba(255,255,255,0.05);padding:10px 14px;border-radius:8px;line-height:1.5">
            ℹ️ ${G.T('Los objetos equipables se encuentran en cofres durante la partida o al derrotar jefes. Sólo puedes llevar uno equipado a la vez; si encuentras otro, puedes sustituirlo.')}
          </div>
        </div>
      `;
    } else if (passive) {
      const trName = G.T(passive.title || id);
      const trDesc = G.T(passive.desc || '');
      const ic = passive.icon ? G.Icons.html(passive.icon, 26) : '⚡';

      // Find moves that evolve with this passive
      const evolutions = [];
      if (G.Moves && G.Moves.EVO) {
        for (const baseId in G.Moves.EVO) {
          const [evoName, reqStat] = G.Moves.EVO[baseId];
          if (reqStat === id) {
            const bm = (G.Moves.ALL || []).find(m => m.id === baseId);
            evolutions.push({ baseId, baseName: bm ? bm.name : baseId, evoName, type: bm ? bm.type : 'normal', kind: bm ? bm.kind : 'projectile' });
          }
        }
      }

      let evosHtml = '';
      if (evolutions.length) {
        evosHtml = `
          <h4 class="sec-title" style="margin:16px 0 8px">⚡ ${G.T('Movimientos que evolucionan con esta pasiva:')} (${evolutions.length})</h4>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${evolutions.map(e => `
              <div class="lvl-step" style="grid-template-columns:auto 1fr;gap:12px;padding:8px 12px">
                <div class="row" style="gap:6px;align-items:center">
                  ${G.UI.typeChips([e.type])}
                  <b>${esc(G.T(e.baseName, 'move'))}</b>
                </div>
                <div class="row" style="gap:8px;align-items:center">
                  <span style="color:#f43f5e;font-weight:bold">➔</span>
                  <b class="gold">${esc(G.T(e.evoName, 'move'))}</b>
                  <span style="font-size:11px;color:var(--muted)">(${esc(G.T(EVO_TEXTS[e.kind] || ''))})</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        evosHtml = `<p class="sub" style="margin-top:14px">${G.T('Esta mejora pasiva aporta estadísticas directas a tu Pokémon.')}</p>`;
      }

      box.innerHTML = `
        <div class="tm-detail-card">
          <div class="row between" style="align-items:center;flex-wrap:wrap;gap:8px">
            <div class="row" style="gap:8px;align-items:center">
              ${ic}
              <h3 class="m-title" style="margin:0">${esc(trName)}</h3>
              <span class="m-kind-badge" style="background:#eab30822;color:#facc15;border-color:#eab30866;font-weight:bold">${G.T('⚡ Pasiva en Partida')}</span>
            </div>
            ${passive.max ? `<span class="m-count-badge">${G.I18n.f('Nivel máx: {x}', passive.max)}</span>` : ''}
          </div>
          <p class="m-desc" style="font-size:16px;margin:8px 0">${esc(trDesc)}</p>
          ${evosHtml}
        </div>
      `;
    }
  }

  // ---------------- Tab 4: Habilidades ----------------

  function renderAbilitiesTab() {
    renderAbilitiesList();
    renderAbilityDetail(selAbilityId);
  }

  function renderAbilitiesList() {
    const box = $('abilities-list');
    if (!box) return;
    box.innerHTML = '';

    const abilMap = G.ABIL || {};
    const dexAbil = G.DEX_ABIL || {};
    const pokeCounts = {};
    for (let dex = 1; dex <= 966; dex++) {
      const a = dexAbil[dex];
      if (a) {
        if (a[0]) pokeCounts[a[0]] = (pokeCounts[a[0]] || 0) + 1;
        if (a[1]) pokeCounts[a[1]] = (pokeCounts[a[1]] || 0) + 1;
        if (a[2]) pokeCounts[a[2]] = (pokeCounts[a[2]] || 0) + 1;
      }
    }

    const allIds = Object.keys(abilMap).filter(id => (pokeCounts[id] || 0) > 0).sort((a, b) => {
      const na = G.Mons ? G.Mons.abilityName(a) : (abilMap[a][0] || a);
      const nb = G.Mons ? G.Mons.abilityName(b) : (abilMap[b][0] || b);
      return na.localeCompare(nb);
    });

    const filtered = allIds.filter(id => {
      if (qAbilities) {
        const names = abilMap[id] || [];
        const trName = String(G.Mons ? G.Mons.abilityName(id) : names[0] || '').toLowerCase();
        const fx = G.AbilityFX && G.AbilityFX.of ? G.AbilityFX.of(id, { types: ['normal'] }) : null;
        const trDesc = String(fx ? (fx.d || '') + ' ' + (fx.d2 || '') : '').toLowerCase();
        return id.includes(qAbilities) || names.some(n => String(n).toLowerCase().includes(qAbilities)) || trName.includes(qAbilities) || trDesc.includes(qAbilities);
      }
      return true;
    });

    if (!filtered.length) {
      box.innerHTML = `<p class="sub center" style="padding:20px">${G.T('No se encontró ninguna habilidad.')}</p>`;
      return;
    }

    if (!filtered.includes(selAbilityId)) {
      selAbilityId = filtered[0];
    }

    for (const id of filtered) {
      const name = G.Mons ? G.Mons.abilityName(id) : (abilMap[id][0] || id);
      const isCustom = !!(G.AbilityFX && G.AbilityFX.FX && G.AbilityFX.FX[id]);
      const tag = isCustom
        ? `<span style="font-size:10px;padding:1px 5px;border-radius:3px;background:#a855f722;color:#c084fc;border:1px solid #a855f755">${G.T('⭐ Efecto')}</span>`
        : `<span style="font-size:10px;padding:1px 5px;border-radius:3px;background:#22c55e22;color:#4ade80;border:1px solid #22c55e55">${G.T('🌿 Tipo (+8%)')}</span>`;

      const item = document.createElement('div');
      item.className = 'move-row-item' + (id === selAbilityId ? ' on' : '');
      item.innerHTML = `
        <div class="row" style="gap:6px;align-items:center">
          ${G.Icons.html('capsule', 16)}
          <b class="m-name">${esc(name)}</b>
          <span class="grow"></span>
          ${tag}
        </div>
      `;
      item.onclick = () => {
        selAbilityId = id;
        box.querySelectorAll('.move-row-item').forEach(x => x.classList.remove('on'));
        item.classList.add('on');
        renderAbilityDetail(id);
      };
      box.appendChild(item);
    }
    renderAbilityDetail(selAbilityId);
  }

  function renderAbilityDetail(id) {
    const box = $('ability-detail');
    if (!box) return;

    const abilMap = G.ABIL || {};
    const names = abilMap[id] || [id, id];
    const name = G.Mons ? G.Mons.abilityName(id) : (names[0] || id);
    const fx = G.AbilityFX && G.AbilityFX.of ? G.AbilityFX.of(id, { types: ['normal'] }) : null;
    const isCustom = !!(G.AbilityFX && G.AbilityFX.FX && G.AbilityFX.FX[id]);

    let desc = fx ? G.T(fx.d || '') : '';
    if (fx && fx.d2) desc += ' ' + G.T(fx.d2);

    // Find all pokemon that have this ability
    const pokes = [];
    const dexAbil = G.DEX_ABIL || {};
    const s = G.DB.save || {};
    const ownedMap = s.owned || {};
    for (let dex = 1; dex <= 966; dex++) {
      const a = dexAbil[dex];
      if (a && (a[0] === id || a[1] === id || a[2] === id)) {
        pokes.push({ dex, isHidden: a[2] === id && a[0] !== id && a[1] !== id });
      }
    }

    const tagBadge = isCustom
      ? `<span class="m-kind-badge" style="background:#a855f722;color:#c084fc;border-color:#a855f766;font-weight:bold">⭐ ${G.T('Efecto Único de Combate')}</span>`
      : `<span class="m-kind-badge" style="background:#22c55e22;color:#4ade80;border-color:#22c55e66;font-weight:bold">🌿 ${G.T('Pasiva de Tipo')}</span>`;

    box.innerHTML = `
      <div class="tm-detail-card">
        <div class="row between" style="align-items:center;flex-wrap:wrap;gap:8px">
          <div class="row" style="gap:8px;align-items:center">
            ${G.Icons.html('capsule', 26)}
            <h3 class="m-title" style="margin:0">${esc(name)}</h3>
            <span style="font-size:13px;color:var(--muted)">(${esc(names[1] || id)})</span>
            ${tagBadge}
          </div>
          <span class="m-count-badge">${G.I18n.f('{x} Pokémon con esta habilidad', pokes.length)}</span>
        </div>
        <p class="m-desc" style="font-size:16px;margin:10px 0;line-height:1.5">${esc(desc)}</p>

        <h4 class="sec-title" style="margin:14px 0 8px">📋 ${G.T('Pokémon que poseen esta habilidad:')}</h4>
        <div class="tm-poke-grid" id="abil-poke-grid"></div>
      </div>
    `;

    const grid = box.querySelector('#abil-poke-grid');
    if (grid) {
      for (const item of pokes) {
        const mon = G.DEX_BY[item.dex];
        if (!mon) continue;
        const isOwned = !!ownedMap[item.dex];
        const cell = document.createElement('div');
        cell.className = 'tm-poke-cell' + (isOwned ? ' owned' : '');
        cell.innerHTML = `
          <div class="tp-num">#${String(item.dex).padStart(3, '0')}</div>
          <div class="tp-sprite"></div>
          <b class="tp-name">${esc(mon.name)}</b>
          <div class="tp-types">${G.UI.typeChips(mon.types)}</div>
          ${item.isHidden ? `<span class="tp-tag" style="background:#a855f733;color:#c084fc;border:1px solid #a855f766">${G.T('Oculta')}</span>` : (isOwned ? `<span class="tp-tag">${G.T('Conseguido')}</span>` : '')}
        `;
        const sBox = cell.querySelector('.tp-sprite');
        if (sBox) sBox.appendChild(G.UI.spriteCanvas(item.dex, 44, 44, { lively: true }));
        grid.appendChild(cell);
      }
    }
  }

  return { init, open, close };
})();
