/* ============ menu.js — menú principal, colección y mejoras ============ */
G.MenuUI = (() => {
  const $ = G.UI.$;
  const esc = s => (G.U && G.U.esc ? G.U.esc(s) : String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
  const GEN_NAMES = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Teselia', 'Kalos', 'Alola', 'Galar', 'Paldea'];
  let dexGen = 1, dexSel = null;
  // Filtros de la colección (se combinan): tengo / me faltan, rarezas (varias),
  // shiny, favoritos, tipo y búsqueda; y el orden. Duran mientras no recargas.
  const DEX0 = () => ({ status: 'all', rar: new Set(), shiny: false, fav: false, type: '', q: '', sort: 'num' });
  let dexF = DEX0();
  const SORTS = [['num', 'Nº'], ['name', 'Nombre'], ['rar', 'Rareza'], ['new', 'Recién conseguidos'], ['used', 'Más usados']];

  function init() {
    const ICON = { play: 'ball', multiplayer: 'multi', dex: 'book', moves: 'tm', upgrades: 'up', shop: 'shop', bag: 'bag', gacha: 'ball4', goals: 'medal3', friends: 'friends', rank: 'trophy', settings: 'gear' };
    document.querySelectorAll('#scr-menu [data-go]').forEach(b => {
      b.insertAdjacentHTML('afterbegin', `<span class="mi-ico">${G.Icons.html(ICON[b.dataset.go] || 'ball', 26)}</span>`);
      b.dataset.sfx = (b.dataset.go === 'play' || b.dataset.go === 'multiplayer') ? 'confirm' : 'click';
      b.onclick = () => {
        const go = b.dataset.go;
        if (go === 'play') {
          if (G.Social && G.Social.room) {
            G.Social.leaveRoom();
            if (G.Net && G.Net.close) G.Net.close();
          }
          G.Flow.play();
        }
        else if (go === 'multiplayer') {
          if (G.Social.room) G.LobbyUI.open();
          else G.MultiplayerUI.open();
        }
        else if (go === 'dex') openDex();
        else if (go === 'moves') G.MovesUI.open();
        else if (go === 'upgrades') openUpgrades();
        else if (go === 'shop') G.ShopUI.open();
        else if (go === 'bag') G.ShopUI.openBag();
        else if (go === 'gacha') G.GachaUI.open();
        else if (go === 'goals') G.GoalsUI.open();
        else if (go === 'friends') G.FriendsUI.open();
        else if (go === 'rank') G.RankingUI.open();
        else if (go === 'settings') G.SettingsUI.open();
      };
    });
    document.querySelectorAll('[data-back]').forEach(b => { b.onclick = open; });
    G.Social.on(() => { if (G.UI.isOpen('scr-menu')) socialLine(); });
    $('btn-logout').onclick = () => {
      if (G.DB.guest && !confirm('Eres invitado: se perderá todo el progreso. ¿Salir?')) return;
      G.Audio.music(null);
      G.DB.logout().then(() => G.Flow.toLogin());
    };
  }

  // ---------------- menú principal ----------------

  function open() {
    const s = G.DB.save;
    const mon = (G.Mons && G.Mons.monFor) ? G.Mons.monFor(s.partner) : G.DEX_BY[s.partner];
    const shiny = !!s.partnerShiny && G.DB.ownsShiny(mon.dex);
    G.UI.chrome(true);
    G.UI.show('scr-menu');
    bagLine();
    G.UI.sprite($('menu-partner'), mon.dex, { lively: true, scale: 4, hero: true, shiny });
    $('menu-partner').style.setProperty('--stage-c', shiny ? '#9ae6ff' : G.U.TYPE_COLOR[mon.types[0]]);
    $('menu-partner').classList.toggle('shiny', shiny);
    $('menu-partner-name').innerHTML = mon.name + (shiny ? ' ' + G.Icons.html('shiny', 24) : '');
    $('menu-partner-info').innerHTML = G.UI.typeChips(mon.types) + ' ' + G.UI.stars(mon.rarity);
    // Normal / shiny a mano, aquí mismo (en el móvil no se encontraba en la ficha).
    const seg = $('menu-shiny');
    seg.classList.toggle('hidden', !G.DB.ownsShiny(mon.dex));
    seg.lastChild.innerHTML = G.Icons.html('shiny', 12) + ' Shiny';
    seg.querySelectorAll('button').forEach(b => {
      b.classList.toggle('on', (b.dataset.v === '1') === shiny);
      b.onclick = () => {
        if ((b.dataset.v === '1') === shiny) return;
        s.partnerShiny = b.dataset.v === '1';
        G.DB.commit();
        G.Audio.sfx('confirm');
        open();
      };
    });

    const owned = Object.keys(s.owned).filter(d => G.DEX_BY[d]).length;
    const shinies = Object.keys(s.shiny || {}).length;
    $('menu-dex-count').textContent = `${owned} / ${G.DEX.length}` + (shinies ? ` · ${shinies} shiny` : '');

    const st = s.stats;
    $('menu-stats').innerHTML =
      `Runs <b style="color:#fff">${st.runs}</b> · Mejor tiempo <b style="color:#fff">${G.U.mmss(st.bestTime)}</b><br>` +
      `Mejor nivel <b style="color:#fff">${st.bestLevel}</b> · Derrotados <b style="color:#fff">${st.totalKills.toLocaleString(G.I18n.locale)}</b>` +
      (G.DB.guest ? '<br><span style="color:#ffb0b8">Modo invitado: no se guarda</span>' : '');

    socialLine();
    // Premios de misiones por recoger.
    G.Progress.checkAch();
    const pend = G.Progress.pending();
    $('menu-goals-sub').textContent = pend ? pend + (pend === 1 ? ' premio por recoger' : ' premios por recoger') : 'Misiones, logros y perfil';
    $('menu-goals-sub').classList.toggle('gold', pend > 0);
    // Con cuenta en la nube: amigos en línea, invitaciones y (una vez) el apodo.
    if (G.DB.online && !G.Social.started) {
      G.Social.start().then(r => {
        if (r === 'need-nick' && !G.NickUI.skipped && G.UI.isOpen('scr-menu')) G.NickUI.open();
        socialLine();
      });
    }
    G.InvitePop.refresh();
  }

  /** Texto bajo "Mochila": cuántos objetos y MT llevas. */
  function bagLine() {
    const s = G.DB.save, sum = o => Object.values(o || {}).reduce((a, b) => a + (+b || 0), 0);
    const items = sum(s.bag), tms = sum(s.tms);
    $('menu-bag-sub').textContent = items || tms ? G.I18n.f('Objetos: {x} · MT: {x}', items, tms) : G.T('Vacía');
  }

  /** Texto bajo "Amigos" y "Jugar": quién está en línea, solicitudes, sala. */
  function socialLine() {
    const room = G.Social.room;
    const play = document.querySelector('#scr-menu [data-go=play] small');
    if (play) play.textContent = G.T('Entra en la mazmorra');

    const multi = document.querySelector('#scr-menu [data-go=multiplayer] small');
    if (multi) {
      multi.textContent = room
        ? G.I18n.f('Volver a tu sala ({x})', `${room.members.length}/${G.Social.MAX_PLAYERS}`)
        : G.T('Juega en grupo con amigos');
    }
    const fr = G.Social.friends;
    const req = fr.filter(f => f.status === 'in').length;
    const parts = [];
    if (req) parts.push(req + (req === 1 ? ' solicitud' : ' solicitudes'));
    $('menu-friends-sub').textContent = parts.length ? parts.join(' · ') : 'Juega en grupo, hasta 4';
    $('menu-friends-sub').classList.toggle('gold', req > 0);
  }

  // ---------------- colección ----------------

  function openDex() {
    G.UI.show('scr-dex', true);
    const s = G.DB.save;
    if (dexSel == null) { dexSel = s.partner; dexGen = G.DEX_BY[s.partner].gen; }
    const owned = Object.keys(s.owned).filter(d => G.DEX_BY[d]).length;
    $('dex-total').textContent = `${owned} / ${G.DEX.length}`;

    // Pestañas de generación (y "Todas"), con cuántos tienes de cada una.
    const tabs = $('dex-gens');
    tabs.innerHTML = '';
    ['Todas', ...GEN_NAMES].forEach((name, g) => {
      const list = g ? G.DEX.filter(p => p.gen === g) : G.DEX;
      const have = list.filter(p => s.owned[p.dex]).length;
      const b = document.createElement('button');
      b.className = 'gen-tab' + (g === dexGen && !dexF.q ? ' on' : '');
      b.innerHTML = `<b>${name}</b><small>${have}/${list.length}</small>`;
      b.onclick = () => { dexGen = g; openDex(); };
      tabs.appendChild(b);
    });

    // Tengo / me faltan (uno), rarezas (las que quieras), shiny y favoritos.
    const fb = $('dex-filters');
    fb.innerHTML = '';
    const chip = (html, on, fn) => {
      const c = document.createElement('button');
      c.className = 'chip' + (on ? ' on' : '');
      c.innerHTML = html;
      c.onclick = () => { fn(); openDex(); };
      fb.appendChild(c);
    };
    for (const [k, label] of [['all', 'Todos'], ['own', 'Tengo'], ['miss', 'Me faltan']]) chip(label, dexF.status === k, () => { dexF.status = k; });
    chip(G.Icons.html('shiny', 12) + ' Shiny', dexF.shiny, () => { dexF.shiny = !dexF.shiny; });
    chip(G.Icons.html('star', 12) + ' Favoritos', dexF.fav, () => { dexF.fav = !dexF.fav; });
    for (const r of [5, 4, 3, 2, 1]) {
      chip(G.Icons.rarity(r, 12) + ' ' + G.Gacha.RARITY_NAME[r], dexF.rar.has(r), () => { dexF.rar.has(r) ? dexF.rar.delete(r) : dexF.rar.add(r); });
    }

    // Orden.
    const sb = $('dex-sort');
    sb.innerHTML = '<span class="sub">Orden:</span>';
    for (const [k, label] of SORTS) {
      const c = document.createElement('button');
      c.className = 'chip' + (dexF.sort === k ? ' on' : '');
      c.textContent = label;
      c.onclick = () => { dexF.sort = k; openDex(); };
      sb.appendChild(c);
    }

    // Tipo y búsqueda (la búsqueda mira en todas las generaciones).
    const ts = $('dex-type');
    ts.innerHTML = `<option value="">Todos los tipos</option>` +
      Object.keys(G.U.TYPE_NAME).map(t => `<option value="${t}">${G.U.TYPE_NAME[t]}</option>`).join('');
    ts.value = dexF.type;
    ts.onchange = () => { dexF.type = ts.value; openDex(); };
    const q = $('dex-q');
    if (q.value !== dexF.q) q.value = dexF.q;
    q.oninput = () => {
      clearTimeout(qT);
      qT = setTimeout(() => {
        dexF.q = q.value; renderGrid();
        $('dex-gens').querySelectorAll('.gen-tab').forEach((b, g) => b.classList.toggle('on', g === dexGen && !dexF.q));
      }, 150);
    };
    q.onkeydown = e => { if (e.key === 'Escape') { e.stopPropagation(); q.blur(); } };
    $('dex-clear').onclick = () => { dexF = DEX0(); openDex(); };
    renderGrid();
    showDetail(dexSel);
  }

  /** Lo que se ve con la generación, los filtros y el orden de ahora. */
  function dexList() {
    const s = G.DB.save, f = dexF;
    const q = f.q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const num = /^#?\d+$/.test(q) ? +q.replace('#', '') : null;
    const list = G.DEX.filter(p => {
      const own = !!s.owned[p.dex];
      if (q) {
        // Por número, o por nombre (sin tildes); de los que no tienes no se busca el nombre.
        if (num != null ? p.dex !== num : !(own && [p.name, G.T(p.name)].some(name => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)))) return false;
      } else if (dexGen && p.gen !== dexGen) return false;
      if (f.status === 'own' && !own) return false;
      if (f.status === 'miss' && own) return false;
      if (f.shiny && !(s.shiny && s.shiny[p.dex])) return false;
      if (f.fav && !G.DB.isFav(p.dex)) return false;
      if (f.rar.size && !f.rar.has(p.rarity)) return false;
      if (f.type && !(own && p.types.includes(f.type))) return false;
      return true;
    });
    const at = p => (s.owned[p.dex] && s.owned[p.dex].at) || 0, used = p => +(s.pused || {})[p.dex] || 0;
    const by = { num: (a, b) => a.dex - b.dex, name: (a, b) => G.T(a.name).localeCompare(G.T(b.name), G.I18n.locale),
                 rar: (a, b) => b.rarity - a.rarity || a.dex - b.dex, new: (a, b) => at(b) - at(a) || a.dex - b.dex,
                 used: (a, b) => used(b) - used(a) || a.dex - b.dex }[f.sort];
    // Los que no tienes no tienen nombre a la vista: al ordenar por nombre van al final.
    if (f.sort === 'name') list.sort((a, b) => (!s.owned[a.dex]) - (!s.owned[b.dex]) || by(a, b)); else list.sort(by);
    return list;
  }

  /*
   * La rejilla se pinta por tandas de PAGE: con "Todas" son 966 Pokémon, cada
   * uno con su animación y su hoja de sprites, y pintarlos de golpe paraba el
   * juego (y la música) un segundo al borrar la búsqueda o cambiar el orden.
   * Al acercarse al final de la lista se pinta la siguiente tanda.
   * keep: volver a pintar los mismos que había (marcar un favorito no te
   * devuelve arriba).
   */
  const PAGE = 48;
  let qT = 0, gridList = [], gridShown = 0, gridIO = null;
  function renderGrid(keep = false) {
    const grid = $('dex-grid');
    const want = keep ? Math.max(PAGE, gridShown) : PAGE;
    const top = grid.scrollTop;
    grid.innerHTML = '';
    gridList = dexList();
    gridShown = 0;
    const f = dexF, busy = f.q || f.status !== 'all' || f.shiny || f.fav || f.rar.size || f.type || f.sort !== 'num';
    $('dex-count').textContent = gridList.length === 1 ? '1 Pokémon' : gridList.length + ' Pokémon';
    $('dex-clear').classList.toggle('hidden', !busy);
    if (!gridList.length) { grid.innerHTML = '<p class="sub" style="grid-column:1/-1">Ninguno con estos filtros.</p>'; return; }
    moreCells(want);
    if (keep) grid.scrollTop = top;
  }

  function moreCells(n = PAGE) {
    const grid = $('dex-grid');
    const old = grid.querySelector('.dex-more');
    if (old) { if (gridIO) gridIO.unobserve(old); old.remove(); }
    const end = Math.min(gridList.length, gridShown + n);
    for (let i = gridShown; i < end; i++) grid.appendChild(dexCell(gridList[i]));
    gridShown = end;
    if (gridShown >= gridList.length) return;
    // Marca al final: cuando se acerca a la vista, la siguiente tanda.
    const more = document.createElement('div');
    more.className = 'dex-more';
    grid.appendChild(more);
    if (!('IntersectionObserver' in window)) { moreCells(gridList.length); return; }
    gridIO = gridIO || new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) moreCells(); }, { rootMargin: '300px' });
    gridIO.observe(more);
  }

  function dexCell(p) {
    const s = G.DB.save;
    const own = !!s.owned[p.dex], sh = !!(s.shiny && s.shiny[p.dex]);
    const cell = document.createElement('div');
    cell.className = 'cell' + (own ? '' : ' locked') + (p.dex === dexSel ? ' on' : '');
    cell.dataset.pad = '1';
    cell.insertAdjacentHTML('beforeend', `<span class="no">${String(p.dex).padStart(3, '0')}${G.DB.isFav(p.dex) ? ' ' + G.Icons.html('star', 10) : ''}</span>`);
    if (p.dex === s.partner) cell.insertAdjacentHTML('beforeend', `<span class="badge-r" title="Compañero">${G.Icons.html('crown', 14)}</span>`);
    else if (sh) cell.insertAdjacentHTML('beforeend', `<span class="badge-r" title="Tienes su shiny">${G.Icons.html('shiny', 12)}</span>`);
    const useShiny = sh && p.dex === s.partner && s.partnerShiny;
    cell.appendChild(G.UI.spriteCanvas(p.dex, 92, 80, { scale: 2, silhouette: !own, shadow: own, shiny: useShiny }));
    const isMega = G.Mega && G.Mega.isCapable(p.dex);
    const megaIconHtml = isMega ? `<span class="badge-mega" title="${G.Mega.getStoneName(p.dex)}">${G.Icons.html('mega', 12)}</span>` : '';
    cell.insertAdjacentHTML('beforeend', `<b>${own ? p.name : '???'}</b><div class="cell-rarity-row">${G.UI.stars(p.rarity, 9)}${megaIconHtml}</div>`);
    cell.onclick = () => {
      dexSel = p.dex;
      $('dex-grid').querySelectorAll('.cell').forEach(c => c.classList.remove('on'));
      cell.classList.add('on');
      showDetail(p.dex);
    };
    return cell;
  }

  // Variante que se está viendo en la ficha (normal o shiny).
  let viewShiny = false;
  let viewMega = null; // null: dạng thường, 'x' | 'y' | 'default': dạng Mega

  function showDetail(dex) {
    const s = G.DB.save;
    const p = G.DEX_BY[dex];
    const own = !!s.owned[dex];
    const hasSh = G.DB.ownsShiny(dex);
    const isPartner = dex === s.partner;
    if (!hasSh) viewShiny = false;
    else if (isPartner && dex !== showDetail.last) viewShiny = !!s.partnerShiny;
    if (dex !== showDetail.last) { extraOpen = ''; viewMega = null; }
    // Al redibujar el mismo Pokémon (abrir el selector de Menta, enseñar una MT...)
    // no se vuelve arriba: se quedaba fuera de la vista lo que acababas de abrir.
    const sameMon = dex === showDetail.last, d0 = $('dex-detail');
    const scrolls = sameMon && d0 ? [d0, d0.closest('.box')].filter(Boolean).map(el => [el, el.scrollTop]) : [];
    showDetail.last = dex;

    const isMega = G.Mega && G.Mega.isCapable(dex);
    const megaForms = isMega ? G.Mega.getForms(dex) : [];
    const activeMega = isMega && viewMega ? G.Mega.getFormInfo(dex, viewMega) : null;
    const isVi = G.I18n && G.I18n.lang === 'vi';
    const isArceus = dex === 493;
    const curArceusType = isArceus ? ((s.arceusType) || 'normal') : null;
    const stoneName = isMega ? G.Mega.getStoneName(dex, viewMega || (megaForms[0] && megaForms[0].form)) : '';

    const max = { hp: 255, atk: 190, spd: 200, def: 250 };
    // Con su naturaleza (20-10-2026): el stat que sube, en verde; el que baja, en rojo.
    const nat = own ? G.Mons.natureOf(dex) : null;
    let q = own ? G.Mons.monFor(dex) : p;
    let dispTypes = isArceus && own ? [curArceusType] : p.types;
    let dispName = own ? p.name : '???';

    if (activeMega) {
      q = Object.assign({}, q, {
        hp: activeMega.hp, pa: activeMega.pa, sa: activeMega.sa,
        df: activeMega.df, sd: activeMega.sd, spd: activeMega.spd
      });
      dispTypes = activeMega.types;
      dispName = activeMega.name;
    }

    const natCls = k => (!nat || activeMega ? '' : nat.up === k ? ' nat-up' : nat.down === k ? ' nat-down' : '');
    const bar = (label, v, m, txt, k) =>
      `<div class="stat${natCls(k)}"><span>${label}</span><div class="bar"><i style="width:${Math.min(100, v / m * 100)}%"></i></div><span>${txt}</span></div>`;
    const usingThis = isPartner && (!hasSh || !!s.partnerShiny === viewShiny);

    const megaLine = isMega ? `
      <div class="mega-capable-line">
        <span class="mega-icon">${G.Icons.html('mega', 15)}</span>
        <span>${isVi ? `Có thể Tiến hóa Mega · Có thể tiến hóa trong trận đấu bằng ${stoneName}` : `Mega Capable · Can Mega Evolve in runs, using ${stoneName}`}</span>
      </div>` : '';

    const megaTabs = isMega && own ? `
      <div class="mega-form-tabs">
        <button class="mega-form-btn ${!viewMega ? 'on' : ''}" data-mega="base">${isVi ? 'Dạng Thường' : 'Normal'}</button>
        ${megaForms.map(f => `
          <button class="mega-form-btn ${viewMega === (f.form || 'default') ? 'on' : ''}" data-mega="${f.form || 'default'}">
            ${f.form ? f.form.toUpperCase() + ' · ' : ''}${f.name}
          </button>
        `).join('')}
      </div>` : '';

    const arceusPlatesHtml = (isArceus && own) ? `
      <div class="arceus-plates-box" style="margin:10px 0;padding:10px 12px;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.35);border-radius:10px">
        <label for="arceus-type-select" style="display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:bold;color:#fde047;margin:0 0 8px">
          <span>⚜️ ${isVi ? 'Bảng Đá Nguyên Thủy (Đổi Hệ Arceus):' : 'Plates of Creation (Switch Arceus Type):'}</span>
          <span class="type" style="background:${G.U.TYPE_COLOR[curArceusType]};font-size:11px;padding:2px 8px;border-radius:4px;white-space:nowrap">${G.U.TYPE_NAME[curArceusType] || curArceusType}</span>
        </label>
        <select id="arceus-type-select" class="field" style="width:100%;padding:7px 10px;font-size:14px;border:2px solid rgba(255,215,0,0.45);background:#0d1838;color:#fff;border-radius:8px;cursor:pointer;outline:none">
          ${Object.keys(G.U.TYPE_NAME).map(t => `
            <option value="${t}" ${t === curArceusType ? 'selected' : ''} style="background:#0f1f4a;color:#fff">
              ${G.U.TYPE_NAME[t]}
            </option>
          `).join('')}
        </select>
      </div>
    ` : '';

    const hasStone = activeMega ? G.Mega.hasStone(dex, activeMega.form) : false;
    const equippedForm = isMega ? G.Mega.getEquippedForm(dex) : null;
    const isEquipped = activeMega ? equippedForm === (activeMega.form || 'default') : false;
    const megaStoneAction = activeMega ? (hasStone ? `
      <button id="mega-equip-btn" class="btn ${isEquipped ? 'ghost' : 'gold'} mega-equip-btn">
        ${isEquipped ? ('✅ ' + (isVi ? 'Đang trang bị ' + stoneName : 'Equipped ' + stoneName)) : ('⚔️ ' + (isVi ? 'Trang bị ' + stoneName : 'Equip ' + stoneName))}
      </button>` : `
      <p class="center sub" style="color:#ff9ff3;margin:6px 0 2px">
        🔒 ${isVi ? `Chưa có ${stoneName} (Đánh bại Boss Mega Rift để nhận)` : `Need ${stoneName} (Defeat Mega Rift Boss)`}
      </p>`) : '';

    const box = $('dex-detail');
    box.innerHTML = `
      <canvas id="dex-big" class="stage" width="220" height="190"></canvas>
      ${hasSh ? `<div class="seg">
          <button class="${viewShiny ? '' : 'on'}" data-v="0">Normal</button>
          <button class="${viewShiny ? 'on' : ''}" data-v="1">${G.Icons.html('shiny', 12)} Shiny</button></div>` : ''}
      <div class="center">
        <div style="color:var(--muted);font-size:13px">Nº ${String(p.dex).padStart(3, '0')} · ${GEN_NAMES[p.gen - 1]}</div>
        <h3>${dispName}</h3>
        ${own ? `<button id="dex-fav" class="chip${G.DB.isFav(dex) ? ' on' : ''}" type="button">${G.Icons.html(G.DB.isFav(dex) ? 'star' : 'starDim', 12)} ${G.DB.isFav(dex) ? 'Favorito' : 'Marcar como favorito'}</button>` : ''}
        <div style="color:${G.Gacha.RARITY_COLOR[p.rarity]}">${G.UI.stars(p.rarity, 24)} ${G.Gacha.RARITY_NAME[p.rarity]}</div>
        ${megaLine}
        <div style="margin:6px 0">${own ? G.UI.typeChips(dispTypes) : ''}</div>
        ${megaTabs}
        ${arceusPlatesHtml}
      </div>
      ${own ? `
        ${bar('Vida', q.hp, max.hp, Math.round(q.hp))}
        ${bar('Ataque', q.pa, max.atk, Math.round(q.pa), 'pa')}
        ${bar('At. Esp.', q.sa, max.atk, Math.round(q.sa), 'sa')}
        ${bar('Defensa', q.df, max.def, Math.round(q.df), 'df')}
        ${bar('Def. Esp.', q.sd, max.def, Math.round(q.sd), 'sd')}
        ${bar('Velocidad', q.spd, max.spd, Math.round(q.spd), 'spd')}
        <p class="sub center" style="margin:6px 0 0">Pega mejor con ataques <b class="gold">${G.Stats.sideOf(q) === 'special' ? 'especiales' : 'físicos'}</b></p>
        ${activeMega ? `<p class="sub center gold" style="margin:6px 0">${activeMega.desc}</p>${megaStoneAction}` : monExtras(dex)}
        ${dispTypes.length === 1 ? `<p class="sub center" style="margin:2px 0 0">Monotipo: +20 % de daño con sus ataques de tipo ${G.U.TYPE_NAME[dispTypes[0]]}</p>` : ''}
        <p style="font-size:14px;margin:10px 0 4px">${G.T('Empieza con')} <b class="gold dex-start-move-btn" data-move-id="${(G.startMoveOf && G.startMoveOf(dex)) || ''}" style="cursor:pointer;text-decoration:underline" title="${G.T('Pulsa para ver detalles')}">${esc(G.startMoveOf && G.Moves.BY_ID[G.startMoveOf(dex)] ? G.T(G.Moves.BY_ID[G.startMoveOf(dex)].name, 'move') : '---')}</b></p>
        <p class="move-icons" title="${G.T('Movimientos que puede aprender')}">
          ${(G.Moves && G.Moves.poolFor ? G.Moves.poolFor(q) : []).map(id => {
            const m = G.Moves.BY_ID[id];
            if (!m) return '';
            return `<span class="dex-move-chip" data-move-id="${id}" style="cursor:pointer;display:inline-block;padding:2px" title="${esc(G.T(m.name, 'move'))}">${G.Icons.html('move:' + id, 18)}</span>`;
          }).join('')}</p>
        <div id="dex-move-preview" class="dex-move-preview-box hidden" style="margin:6px 0 10px;padding:8px 10px;background:rgba(5,10,26,0.65);border:1px solid rgba(244,248,255,0.2);border-radius:8px"></div>
        ${usingThis
          ? '<button class="btn grow" disabled style="width:100%">Es tu compañero</button>'
          : `<button id="dex-pick" class="btn gold" data-sfx="confirm" style="width:100%">Elegir de compañero${viewShiny ? ' (shiny)' : ''}</button>`}
      ` : `<p class="center" style="color:var(--muted)">Aún no lo tienes.<br>Consíguelo en el banner de <b class="gold">${GEN_NAMES[p.gen - 1]}</b>
            o derrotándolo cuando salga shiny.</p>`}
    `;
    for (const [el, t] of scrolls) el.scrollTop = t;
    const activeSprId = (activeMega && G.SPRITE_META && G.SPRITE_META['m' + dex]) ? ('m' + dex) : dex;
    G.UI.sprite($('dex-big'), activeSprId, { lively: own, spin: own, silhouette: !own, scale: 3, hero: true, shiny: own && viewShiny });
    box.querySelectorAll('.seg button').forEach(b => {
      b.onclick = () => { viewShiny = b.dataset.v === '1'; showDetail(dex); };
    });
    box.querySelectorAll('.mega-form-btn').forEach(b => {
      b.onclick = () => {
        const m = b.dataset.mega;
        viewMega = (m === 'base') ? null : m;
        showDetail(dex);
      };
    });
    const arceusSelect = $('arceus-type-select');
    if (arceusSelect) {
      arceusSelect.onchange = () => {
        const t = arceusSelect.value;
        s.arceusType = t;
        if (s.pstart && s.pstart[493]) delete s.pstart[493];
        if (s.pstart2 && s.pstart2[493]) delete s.pstart2[493];
        G.DB.commit(true);
        G.Audio.sfx('confirm');
        showDetail(493);
        if (s.partner === 493 && $('menu-partner-info')) {
          const shiny = !!s.partnerShiny && G.DB.ownsShiny(493);
          $('menu-partner').style.setProperty('--stage-c', shiny ? '#9ae6ff' : G.U.TYPE_COLOR[t]);
          $('menu-partner-info').innerHTML = G.UI.typeChips([t]) + ' ' + G.UI.stars(G.DEX_BY[493].rarity);
        }
      };
    }
    const eqBtn = $('mega-equip-btn');
    if (eqBtn) {
      eqBtn.onclick = () => {
        const cur = G.Mega.getEquippedForm(dex);
        const target = (activeMega && activeMega.form) || 'default';
        if (cur === target) {
          G.Mega.setEquippedForm(dex, null);
          G.UI.toast(isVi ? `Đã tháo ${stoneName}` : `Unequipped ${stoneName}`);
        } else {
          G.Mega.setEquippedForm(dex, target);
          G.UI.toast(isVi ? `Đã trang bị ${stoneName}!` : `Equipped ${stoneName}!`);
        }
        showDetail(dex);
      };
    }
    const fav = $('dex-fav');
    if (fav) fav.onclick = () => { G.DB.setFav(dex, !G.DB.isFav(dex)); renderGrid(true); showDetail(dex); };
    const pick = $('dex-pick');
    if (pick) pick.onclick = () => {
      s.partner = dex;
      s.partnerShiny = hasSh && viewShiny;
      G.DB.commit();
      if (G.Social && G.Social.refreshMember) {
        G.Social.refreshMember(s.partner, s.partnerShiny);
      }
      G.UI.toast(p.name + (s.partnerShiny ? ' shiny' : '') + ' es ahora tu compañero');
      renderGrid(true); showDetail(dex);
    };

    function renderMovePreview(mId) {
      const prevBox = $('dex-move-preview');
      if (!prevBox) return;
      const m = G.Moves && G.Moves.BY_ID ? G.Moves.BY_ID[mId] : null;
      if (!m) { prevBox.classList.add('hidden'); return; }
      prevBox.classList.remove('hidden');
      const trName = G.T(m.name, 'move');
      const trDesc = G.T(m.desc || '');
      const cat = m.stat === 'patk' || m.stat === 'satk' || m.kind === 'buff' ? G.T('🛡️ Buff')
        : (G.Moves.isSpecial && G.Moves.isSpecial(m.id) ? G.T('🔮 Ataque Especial') : G.T('⚔️ Ataque Físico'));
      const rCol = m.rarity === 'epic' ? '#c084fc' : m.rarity === 'rare' ? '#60a5fa' : '#4ade80';
      const rName = G.T(m.rarity || 'uncommon');
      const rTag = `<span style="font-size:10px;padding:1px 5px;border-radius:3px;background:${rCol}22;color:${rCol};border:1px solid ${rCol}55;text-transform:capitalize">${rName}</span>`;
      const stats = [];
      if (m.power !== undefined) stats.push(`⚡ ${G.T('Poder:')} <b class="gold">${m.power}</b>`);
      if (m.dmg) {
        const scaleStat = m.stat === 'patk' || m.stat === 'satk' || m.kind === 'buff' ? ''
          : (G.Moves.isSpecial && G.Moves.isSpecial(m.id) ? ` (${G.T('Escala con At. Esp.')})` : ` (${G.T('Escala con Ataque')})`);
        stats.push(`💥 ${G.T('Daño:')} <b class="gold">${m.dmg}</b><small style="opacity:0.85">${scaleStat}</small>`);
      }
      if (m.cd) stats.push(`⏱️ ${G.T('Recarga:')} <b class="gold">${m.cd}s</b>`);
      if (m.count && m.count > 1) stats.push(`🎯 ${G.T('Cantidad:')} <b class="gold">${m.count}</b>`);
      prevBox.innerHTML = `
        <div class="row between" style="align-items:center;margin-bottom:4px">
          <div class="row" style="gap:6px;align-items:center">
            ${G.Icons.html('move:' + m.id, 18)}
            <b style="color:#fff;font-size:14px">${esc(trName)}</b>
            ${G.UI.typeChips([m.type])}
            ${rTag}
          </div>
          <span style="font-size:11px;color:var(--muted)">${cat}</span>
        </div>
        <p style="font-size:12px;color:#c0cce0;margin:4px 0 6px;line-height:1.4">${esc(trDesc)}</p>
        ${stats.length ? `<div style="font-size:12px;color:var(--muted);margin-bottom:6px">${stats.join(' · ')}</div>` : ''}
        <button class="btn small ghost" id="dex-view-encyclopedia" style="width:100%;font-size:11px;padding:4px 8px">${G.Icons.html('book', 12)} ${G.T('Ver en Enciclopedia de Movimientos')} ➔</button>
      `;
      const encBtn = prevBox.querySelector('#dex-view-encyclopedia');
      if (encBtn) encBtn.onclick = () => G.MovesUI.open(m.id, 'types');
    }

    box.querySelectorAll('.dex-move-chip, .dex-start-move-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.moveId;
        renderMovePreview(id);
      };
    });

    if (own && !activeMega) wireExtras(dex, box);
  }

  // ---------------- naturaleza, habilidad y MT (Tienda Kecleon, 20-10-2026) ----------------
  // Se ven en la ficha de cada Pokémon y aquí se usan la Menta, las Cápsulas y las MT de la Mochila.
  const STAT_NAME = { pa: 'Ataque', sa: 'At. Esp.', df: 'Defensa', sd: 'Def. Esp.', spd: 'Velocidad' };
  let extraOpen = '';          // 'nat' | 'cap' | 'caph' | 'tm' | '' (qué selector está abierto)
  const natLine = n => (n.up ? `+${G.T(STAT_NAME[n.up])} −${G.T(STAT_NAME[n.down])}` : G.T('neutra'));

  function monExtras(dex) {
    const p = G.DEX_BY[dex], n = G.Mons.natureOf(dex), ab = G.Mons.abilityOf(dex);
    const fx = G.AbilityFX.of(ab.id, p), taught = G.Mons.taught(dex);
    const tmsHere = G.Mons.learnable(dex).filter(id => G.Shop.tmCount(id) > 0);
    const btn = (key, icon, label, count) => count > 0
      ? `<button class="btn small" data-extra="${key}">${G.Icons.html(icon, 14)} <span>${label}</span> <small>×${count}</small></button>` : '';
    const capN = G.Mons.abilityChoices(dex, false).length ? G.Shop.count('cap') : 0;
    const caphN = G.Mons.abilityChoices(dex, true).length ? G.Shop.count('caph') : 0;
    return `<div class="mon-extra">
      <div class="mx-row"><span>Naturaleza</span><b translate="no">${G.Mons.name(n.n)}</b><small>${natLine(n)}</small>
        ${btn('nat', 'mint', 'Menta', G.Shop.count('mint'))}</div>
      <div class="mx-row"><span>Habilidad</span><b translate="no">${G.Mons.abilityName(ab.id)}</b>${ab.slot === 2 ? `<small class="gold">${G.T('oculta')}</small>` : ''}
        ${btn('cap', 'capsule', 'Cápsula', capN)}${btn('caph', 'capsuleh', 'Cápsula Oculta', caphN)}</div>
      <p class="sub mx-desc"><span>${fx.d}</span>${fx.d2 ? ` <span>${fx.d2}</span>` : ''}</p>
      <div class="mx-row"><span>MT</span>${taught.length
        ? `<span class="move-icons">${taught.map(id => `<span title="${G.T(G.Moves.BY_ID[id].name, 'move')}">${G.Icons.html('move:' + id, 16)}</span>`).join('')}</span>`
        : `<small>${G.T('Aún no ha aprendido ninguna')}</small>`}
        ${btn('tm', 'tm', 'Enseñar MT', tmsHere.length)}</div>
      <div id="mx-picker"></div>
    </div>`;
  }

  function wireExtras(dex, box) {
    box.querySelectorAll('[data-extra]').forEach(b => {
      b.onclick = () => { extraOpen = extraOpen === b.dataset.extra ? '' : b.dataset.extra; G.Audio.sfx('select'); showDetail(dex); };
    });
    const host = box.querySelector('#mx-picker');
    if (!host || !extraOpen) return;
    const s = G.DB.save, mon = G.DEX_BY[dex];
    const chips = (list, label, onPick) => {
      host.innerHTML = `<div class="panel ban-picker"><div class="ban-moves">${list.map(x => `<button class="chip" data-v="${x.v}">${x.html}</button>`).join('')}</div></div>`;
      host.querySelectorAll('[data-v]').forEach(c => { c.onclick = () => onPick(c.dataset.v); });
    };
    const done = msg => { extraOpen = ''; G.DB.commit(); G.Audio.sfx('buy'); G.UI.toast(msg, 2600); showDetail(dex); };
    if (extraOpen === 'nat' && G.Shop.count('mint')) {
      const cur = G.Mons.natureOf(dex).id;
      chips(G.NATURES.filter(n => n.id !== cur).map(n => ({ v: n.id, html: `<b translate="no">${G.Mons.name(n.n)}</b> <small>${natLine(n)}</small>` })), '', id => {
        if (!G.Shop.take('mint')) return;
        G.Mons.setNature(dex, id);
        done(G.I18n.f('{x} ahora tiene naturaleza {x}', mon.name, G.Mons.name(G.NATURE_BY[id].n)));
      });
    } else if ((extraOpen === 'cap' || extraOpen === 'caph') && G.Shop.count(extraOpen)) {
      const l = G.Mons.slots(dex);
      chips(G.Mons.abilityChoices(dex, extraOpen === 'caph').map(i => ({ v: i, html: `<b translate="no">${G.Mons.abilityName(l[i])}</b>${i === 2 ? ` <small class="gold">${G.T('oculta')}</small>` : ''}` })), '', v => {
        if (!G.Shop.take(extraOpen)) return;
        G.Mons.setAbility(dex, +v);
        done(G.I18n.f('{x} ahora tiene la habilidad {x}', mon.name, G.Mons.abilityName(l[+v])));
      });
    } else if (extraOpen === 'tm') {
      const list = G.Mons.learnable(dex).filter(id => G.Shop.tmCount(id) > 0);
      chips(list.map(id => ({ v: id, html: `${G.Icons.html('move:' + id, 16)} ${G.T(G.Moves.BY_ID[id].name, 'move')} <small>×${G.Shop.tmCount(id)}</small>` })), '', id => {
        if (!G.Mons.teach(dex, id)) return;
        done(G.I18n.f('¡{x} ha aprendido {x}!', mon.name, G.T(G.Moves.BY_ID[id].name, 'move')));
      });
    }
  }

  // ---------------- mejoras ----------------

  let upgDex = null, upgPartner = null;

  function openUpgrades() {
    G.UI.show('scr-upgrades', true);
    const s = G.DB.save;
    // Se recuerda el último que miraste, salvo que hayas cambiado de compañero: entonces se abre en el nuevo.
    if (!upgDex || !s.owned[upgDex] || s.partner !== upgPartner) upgDex = s.partner;
    upgPartner = s.partner;
    // Selector con tus Pokémon: el compañero primero, luego los que ya tienen mejoras.
    const sel = $('upg-mon');
    const lv = d => Object.values(s.pupg[d] || {}).reduce((a, b) => a + b, 0);
    const mons = Object.keys(s.owned).map(Number).filter(d => G.DEX_BY[d])
      .sort((a, b) => (b === s.partner) - (a === s.partner) || lv(b) - lv(a) || a - b);
    sel.innerHTML = mons.map(d => `<option value="${d}">${G.DEX_BY[d].name}${d === s.partner ? ' (compañero)' : ''}${lv(d) ? ' · ' + lv(d) + ' niveles' : ''}</option>`).join('');
    sel.value = upgDex;
    sel.onchange = () => { upgDex = +sel.value; G.Audio.sfx('select'); renderUpgrades(); };
    renderUpgrades();
  }

  function renderUpgrades() {
    const s = G.DB.save;
    const levels = G.DB.upgradesOf(upgDex);
    const mon = G.DEX_BY[upgDex];
    const shiny = upgDex === s.partner && !!s.partnerShiny && G.DB.ownsShiny(upgDex);
    G.UI.sprite($('upg-stage'), upgDex, { lively: true, scale: 2, hero: true, shiny });
    $('upg-stage').style.setProperty('--stage-c', shiny ? '#9ae6ff' : G.U.TYPE_COLOR[mon.types[0]]);
    const box = $('upg-list');
    box.innerHTML = '';
    for (const u of G.Upgrades.LIST) {
      const lvl = levels[u.id] || 0;
      const maxed = lvl >= u.max;
      const cost = maxed ? 0 : G.Upgrades.cost(u.id, lvl);
      // Mejoras que necesitan otra (Segundo movimiento inicial → Repertorio).
      const locked = !maxed && u.needs && !levels[u.needs];
      const pick2 = u.id === 'start2' && lvl > 0 ? G.startMove2Of(upgDex) : null;
      el.className = 'panel upg-item';
      el.innerHTML = `
        <div class="ic">${G.Icons.html(u.icon, 32)}</div>
        <div class="upg-info">
          <b>${G.T(u.name)}</b>
          <div class="upg-desc">${G.T(u.unit)}</div>
          <div class="pips">${Array.from({ length: u.max }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('')}</div>
        </div>
        <div class="upg-btns">
          ${u.id === 'ban' && lvl > 0 ? `<button class="btn small" data-ban>${G.I18n.f('Elegir ({x}/{y})', banList().length, lvl)}</button>` : ''}
          ${u.id === 'start' && lvl > 0 ? `<button class="btn small" data-start>${G.T('Elegir')}: ${G.Moves.BY_ID[G.startMoveOf(upgDex)] ? G.T(G.Moves.BY_ID[G.startMoveOf(upgDex)].name, 'move') : '---'}</button>` : ''}
          ${u.id === 'start2' && lvl > 0 ? `<button class="btn small" data-start2>${G.T('Elegir')}: ${pick2 && G.Moves.BY_ID[pick2] ? G.T(G.Moves.BY_ID[pick2].name, 'move') : G.T('Al azar')}</button>` : ''}
          <button class="btn small ${maxed ? '' : 'gold'}" data-buy data-sfx="none" ${maxed || locked || s.coins < cost ? 'disabled' : ''}
            ${locked ? `title="${G.T('Primero compra Repertorio')}"` : ''}>
          ${maxed ? G.T('Máx.') : locked ? G.T('Necesita Repertorio') : `<span class="coin"></span> ${cost}`}</button></div>`;
      if (u.id === 'ban' && lvl > 0) el.querySelector('[data-ban]').onclick = () => { banOpen = !banOpen; renderUpgrades(); };
      if (u.id === 'start' && lvl > 0) el.querySelector('[data-start]').onclick = () => { startOpen = !startOpen; renderUpgrades(); };
      if (u.id === 'start2' && lvl > 0) el.querySelector('[data-start2]').onclick = () => { start2Open = !start2Open; renderUpgrades(); };
      el.querySelector('[data-buy]').onclick = () => {
        // Se vuelve a leer todo al pulsar (la partida puede haber cambiado desde que se dibujó).
        const sv = G.DB.save, lv = G.DB.upgradesOf(upgDex), now = lv[u.id] || 0;
        if (now >= u.max || (u.needs && !lv[u.needs])) { renderUpgrades(); return; }
        const price = G.Upgrades.cost(u.id, now);
        if (sv.coins < price) { renderUpgrades(); return; }
        sv.coins -= price;
        lv[u.id] = now + 1;
        G.DB.commit(true);
        G.Audio.sfx('buy');
        G.UI.refreshCoins();
        G.UI.toast(`${mon.name} · ${u.name}: nivel ${now + 1}`);
        renderUpgrades();
      };
      box.appendChild(el);
      if (u.id === 'ban' && lvl > 0 && banOpen) box.appendChild(banPicker(lvl));
      if (u.id === 'start' && lvl > 0 && startOpen) box.appendChild(startPicker());
      if (u.id === 'start2' && lvl > 0 && start2Open) box.appendChild(start2Picker());
    }
    box.appendChild(bindPanel());
  }

  // ---------------- atajos: hueco fijo para cada movimiento ----------------
  // save.pbind[dex] = [movimiento del hueco 1, del 2, del 3, del 4] (o null).
  function bindPanel() {
    const s = G.DB.save;
    s.pbind = s.pbind || {};
    const list = s.pbind[upgDex] || [null, null, null, null];
    const mon = G.DEX_BY[upgDex];
    const ids = G.Moves.poolFor(mon).concat([G.startMoveOf(upgDex)]).filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => G.Moves.BY_ID[a].name.localeCompare(G.Moves.BY_ID[b].name, 'es'));
    const el = document.createElement('div');
    el.className = 'panel bind-panel';
    el.innerHTML = `<b>Atajos de movimientos</b>
      <p class="sub" style="margin:2px 0 8px">Elige qué movimiento va siempre en cada hueco (teclas 1-4 o los iconos de abajo), para la memoria muscular. Si aún no tienes tantos movimientos, va al hueco más cercano.</p>
      <div class="bind-slots">${[0, 1, 2, 3].map(i => `<label class="bind-slot"><span>${i + 1}</span>
        <select class="field" data-slot="${i}"><option value="">Libre</option>${ids.map(id =>
          `<option value="${id}" ${list[i] === id ? 'selected' : ''}>${G.T(G.Moves.BY_ID[id].name, 'move')}</option>`).join('')}</select></label>`).join('')}</div>`;
    el.querySelectorAll('select[data-slot]').forEach(sel => {
      sel.onchange = () => {
        const l = (s.pbind[upgDex] || [null, null, null, null]).slice(0, 4);
        while (l.length < 4) l.push(null);
        const i = +sel.dataset.slot, id = sel.value || null;
        // Un movimiento sólo puede estar en un hueco.
        for (let j = 0; j < 4; j++) if (id && l[j] === id) l[j] = null;
        l[i] = id;
        s.pbind[upgDex] = l;
        G.DB.commit();
        G.Audio.sfx('select');
        renderUpgrades();
      };
    });
    return el;
  }

  // ---------------- movimiento inicial (Mejoras → Movimiento inicial) ----------------
  let startOpen = false;
  function startPicker() {
    const s = G.DB.save, cur = G.startMoveOf(upgDex), base = G.baseStartOf(upgDex);
    const ids = G.startChoices(upgDex).sort((a, b) => G.Moves.BY_ID[a].name.localeCompare(G.Moves.BY_ID[b].name, 'es'));
    const el = document.createElement('div');
    el.className = 'panel ban-picker';
    el.innerHTML = `<p class="sub" style="margin:0 0 8px">Elige con qué ataque empieza. Lo puedes cambiar cuando quieras, gratis.<br><small style="color:var(--muted)">Solo ataques Poco comunes (Uncommon). Los Raros (Rare) y Épicos (Epic) requieren MTs aprendidas.</small></p>
      <div class="ban-moves">${ids.map(id => { const d = G.Moves.BY_ID[id];
        const rCol = d.rarity === 'epic' ? '#c084fc' : d.rarity === 'rare' ? '#60a5fa' : '#4ade80';
        const rTag = `<span style="font-size:10px;padding:1px 4px;border-radius:3px;background:${rCol}22;color:${rCol};border:1px solid ${rCol}55;margin-left:4px;text-transform:capitalize">${d.rarity || 'uncommon'} · ${d.power || 0}P</span>`;
        return `<button class="chip ${id === cur ? 'on' : ''}" data-id="${id}">${G.Icons.html('move:' + id, 16)} ${d.name} ${rTag}${id === base ? ' <small>(de serie)</small>' : ''}</button>`; }).join('')}</div>`;
    el.querySelectorAll('[data-id]').forEach(b => {
      b.onclick = () => {
        const id = b.dataset.id;
        s.pstart = s.pstart || {};
        if (id === base) delete s.pstart[upgDex]; else s.pstart[upgDex] = id;
        // Si era el segundo inicial, el segundo vuelve a salir al azar.
        if (s.pstart2 && s.pstart2[upgDex] === id) delete s.pstart2[upgDex];
        // El inicial no puede estar vetado.
        const l = banList(), i = l.indexOf(id);
        if (i >= 0) l.splice(i, 1);
        G.DB.commit();
        G.Audio.sfx('select');
        G.UI.toast(G.DEX_BY[upgDex].name + ' empezará con ' + G.Moves.BY_ID[id].name);
        renderUpgrades();
      };
    });
    return el;
  }

  // ---------------- segundo movimiento inicial (con Repertorio) ----------------
  // save.pstart2[dex]; sin elegir (o "Al azar"), el segundo sale al azar como siempre.
  let start2Open = false;
  function start2Picker() {
    const s = G.DB.save, cur = G.startMove2Of(upgDex), first = G.startMoveOf(upgDex);
    const ids = G.startChoices(upgDex).filter(id => id !== first)
      .sort((a, b) => G.Moves.BY_ID[a].name.localeCompare(G.Moves.BY_ID[b].name, 'es'));
    const el = document.createElement('div');
    el.className = 'panel ban-picker';
    el.innerHTML = `<p class="sub" style="margin:0 0 8px">Elige el segundo ataque con el que empieza. Lo puedes cambiar cuando quieras, gratis.<br><small style="color:var(--muted)">Solo ataques Poco comunes (Uncommon). Los Raros (Rare) y Épicos (Epic) requieren MTs aprendidas.</small></p>
      <div class="ban-moves"><button class="chip ${!cur ? 'on' : ''}" data-id="">${G.T('Al azar')}</button>${ids.map(id => { const d = G.Moves.BY_ID[id];
        const rCol = d.rarity === 'epic' ? '#c084fc' : d.rarity === 'rare' ? '#60a5fa' : '#4ade80';
        const rTag = `<span style="font-size:10px;padding:1px 4px;border-radius:3px;background:${rCol}22;color:${rCol};border:1px solid ${rCol}55;margin-left:4px;text-transform:capitalize">${d.rarity || 'uncommon'} · ${d.power || 0}P</span>`;
        return `<button class="chip ${id === cur ? 'on' : ''}" data-id="${id}">${G.Icons.html('move:' + id, 16)} ${d.name} ${rTag}</button>`; }).join('')}</div>`;
    el.querySelectorAll('[data-id]').forEach(b => {
      b.onclick = () => {
        const id = b.dataset.id;
        s.pstart2 = s.pstart2 || {};
        if (!id) delete s.pstart2[upgDex]; else s.pstart2[upgDex] = id;
        // El elegido no puede estar vetado.
        const l = banList(), i = id ? l.indexOf(id) : -1;
        if (i >= 0) l.splice(i, 1);
        G.DB.commit();
        G.Audio.sfx('select');
        G.UI.toast(id ? G.I18n.f('{x} empezará también con {x}', G.DEX_BY[upgDex].name, G.Moves.BY_ID[id].name)
                      : G.T('El segundo ataque saldrá al azar'));
        renderUpgrades();
      };
    });
    return el;
  }

  // ---------------- veto: movimientos bloqueados ----------------
  // Lista por Pokémon en save.pban[dex]; con N niveles de Veto, N movimientos.
  let banOpen = false;
  function banList() {
    const s = G.DB.save;
    s.pban = s.pban || {};
    return s.pban[upgDex] || (s.pban[upgDex] = []);
  }
  function banPicker(max) {
    const mon = G.DEX_BY[upgDex];
    const start = G.startMoveOf(upgDex), start2 = G.startMove2Of(upgDex);
    const ids = G.Moves.poolFor(mon).filter(id => id !== start && id !== start2)
      .sort((a, b) => G.Moves.BY_ID[a].name.localeCompare(G.Moves.BY_ID[b].name, 'es'));
    const list = banList();
    const el = document.createElement('div');
    el.className = 'panel ban-picker';
    el.innerHTML = `<p class="sub" style="margin:0 0 8px">Toca los movimientos que no quieres que te salgan en las cartas (${list.length}/${max}). El movimiento de inicio no se puede vetar.</p>
      <div class="ban-moves">${ids.map(id => { const d = G.Moves.BY_ID[id]; const on = list.includes(id);
        return `<button class="chip ${on ? 'on ban' : ''}" data-id="${id}">${G.Icons.html('move:' + id, 16)} ${G.T(d.name, 'move')}${on ? ' ' + G.Icons.html('ban', 14) : ''}</button>`; }).join('')}</div>`;
    el.querySelectorAll('[data-id]').forEach(b => {
      b.onclick = () => {
        const l = banList(), id = b.dataset.id, i = l.indexOf(id);
        if (i >= 0) l.splice(i, 1);
        else if (l.length >= max) { G.UI.toast('Ya tienes ' + max + ' vetados: quita uno primero'); return; }
        else l.push(id);
        G.DB.commit();
        G.Audio.sfx('select');
        renderUpgrades();
      };
    });
    return el;
  }

  return { init, open, openDex, GEN_NAMES };
})();
