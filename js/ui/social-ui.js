/* ============ social-ui.js — apodo, amigos, sala e invitaciones ============ */
(() => {
  const $ = G.UI.$;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /** ¿Se puede usar lo online? Si no, explica por qué. */
  function needOnline() {
    if (G.DB.online) return true;
    G.UI.toast(G.DB.guest ? 'Crea una cuenta para jugar con amigos y salir en el ranking.'
      : 'Esto necesita la versión online del juego (con la nube).', 3200);
    return false;
  }

  // ======================= APODO =======================

  G.NickUI = (() => {
    let then = null, skipped = false;

    function init() {
      $('nick-form').onsubmit = async e => {
        e.preventDefault();
        $('nick-err').textContent = '';
        $('nick-ok').disabled = true;
        const r = await G.Social.claimNick($('nick-in').value);
        $('nick-ok').disabled = false;
        if (!r.ok) { $('nick-err').textContent = r.error; G.Audio.sfx('error'); return; }
        G.Audio.sfx('confirm');
        G.UI.toast('Tu apodo es ' + G.Social.me.name);
        const cb = then; then = null;
        if (cb) cb(); else G.MenuUI.open();
      };
      $('nick-later').onclick = () => { skipped = true; then = null; G.MenuUI.open(); };
    }

    /** @param next  qué abrir después de elegirlo */
    function open(next) {
      then = next || null;
      G.UI.show('scr-nick');
      $('nick-err').textContent = '';
      $('nick-in').value = '';
      setTimeout(() => $('nick-in').focus(), 50);
    }

    return { init, open, get skipped() { return skipped; } };
  })();

  /** Abre `fn` si tienes apodo; si no, pide el apodo primero. */
  function withNick(fn) {
    if (!needOnline()) return;
    if (G.Social.me) { fn(); return; }
    G.Social.start().then(r => { if (r === 'ok') fn(); else G.NickUI.open(fn); });
  }

  // ======================= AMIGOS =======================

  G.FriendsUI = (() => {
    function init() {
      $('fr-add').onsubmit = async e => {
        e.preventDefault();
        const name = $('fr-name').value;
        msg('');
        const r = await G.Social.request(name);
        msg(r.ok ? r.msg : r.error, !r.ok);
        if (r.ok) $('fr-name').value = '';
      };
      $('fr-room').onclick = () => G.LobbyUI.open();
      G.Social.on(() => { if (G.UI.isOpen('scr-friends')) render(); });
    }

    function msg(t, bad) {
      $('fr-msg').textContent = t || '';
      $('fr-msg').style.color = bad ? '#ffb0b8' : '';
      if (t) G.Audio.sfx(bad ? 'error' : 'confirm');
    }

    function open() {
      withNick(() => {
        G.UI.show('scr-friends', true); msg(''); render();
        G.Social.ensureFriends().then(() => { if (G.UI.isOpen('scr-friends')) render(); });
      });
    }

    // (Sin "en línea" desde el 20-10-2026: costaba 1/4 de las escrituras de Firestore.)
    function stateText(f) {
      if (f.status === 'in') return 'Quiere ser tu amigo';
      if (f.status === 'out') return 'Solicitud enviada';
      return '';
    }

    function render() {
      const room = G.Social.room;
      $('fr-me').innerHTML = 'Tu apodo: <b class="gold" translate="no">' + esc(G.Social.me ? G.Social.me.name : '') + '</b> · dáselo a tus amigos para que te añadan.';
      $('fr-room').classList.toggle('hidden', !room);
      const list = G.Social.friends.sort((a, b) => {
        const rank = f => f.status === 'in' ? 0 : f.status === 'ok' ? 1 : 2;
        return rank(a) - rank(b) || a.name.localeCompare(b.name);
      });
      const box = $('fr-list');
      box.innerHTML = '';
      if (!list.length) {
        box.innerHTML = '<p class="sub">Aún no tienes amigos añadidos. Escribe arriba el apodo de un amigo.</p>';
        return;
      }
      for (const f of list) {
        const el = document.createElement('div');
        el.className = 'fr-row';
        const isOnline = !!f.online;
        const dot = f.status !== 'ok' ? 'pend' : (isOnline ? 'on' : 'off');
        const inRoom = room && room.members.some(m => m.uid === f.uid);
        const stText = inRoom ? 'En tu sala' : (f.status === 'ok' ? (isOnline ? 'Online' : 'Offline') : stateText(f));
        el.innerHTML = `<i class="dot ${dot}"></i><b translate="no"><a href="#" class="plink" title="Ver su perfil">${esc(f.name)}</a></b><span class="st">${stText}</span><span class="grow"></span>`;
        if (f.status === 'ok') el.querySelector('.plink').onclick = e => { e.preventDefault(); G.ProfileUI.show(f.uid); };
        else el.querySelector('.plink').onclick = e => e.preventDefault();
        const btn = (txt, cls, fn, disabled = false) => {
          const b = document.createElement('button');
          b.className = 'btn small ' + cls; b.textContent = txt;
          if (disabled) b.disabled = true; else b.onclick = fn;
          el.appendChild(b); return b;
        };
        if (f.status === 'in') {
          btn('Aceptar', 'gold', async () => { const r = await G.Social.accept(f.uid); msg(r.ok ? r.msg : r.error, !r.ok); });
          btn('Rechazar', 'ghost', () => G.Social.remove(f.uid));
        } else if (f.status === 'out') {
          btn('Cancelar', 'ghost', () => G.Social.remove(f.uid));
        } else {
          if (!inRoom && (!room || room.isHost)) {
            btn('Invitar', isOnline ? 'gold' : 'ghost disabled', async () => {
              const r = await G.Social.invite(f.uid);
              msg(r.ok ? r.msg : r.error, !r.ok);
              if (r.ok) G.LobbyUI.open();
            }, !isOnline);
          }
          btn('Quitar', 'ghost', () => { if (confirm('¿Quitar a ' + f.name + ' de tus amigos?')) G.Social.remove(f.uid); });
        }
        box.appendChild(el);
      }
    }

    return { init, open, render };
  })();

  // ======================= MULTIPLAYER BROWSER =======================

  G.MultiplayerUI = (() => {
    let unlisten = null;
    let cachedRooms = [];

    function init() {
      if ($('multi-create')) $('multi-create').onclick = () => withNick(async () => {
        const r = await G.Social.createRoom();
        if (r) G.LobbyUI.open();
      });
      if ($('multi-friends')) $('multi-friends').onclick = () => G.FriendsUI.open();
      if ($('multi-refresh')) $('multi-refresh').onclick = () => renderRooms(cachedRooms);
    }

    function open() {
      withNick(() => {
        G.UI.show('scr-multiplayer', true);
        if (unlisten) unlisten();
        unlisten = G.Social.listenPublicRooms(rooms => {
          cachedRooms = rooms;
          if (G.UI.isOpen('scr-multiplayer')) renderRooms(rooms);
        });
      });
    }

    function close() {
      if (unlisten) { unlisten(); unlisten = null; }
      G.UI.hide('scr-multiplayer');
    }

    function renderRooms(rooms) {
      const box = $('multi-rooms-list');
      if (!box) return;
      box.innerHTML = '';
      const list = (rooms || []).filter(r => r && r.roomId && r.memberCount < 4);
      if (!list.length) {
        box.innerHTML = '<p class="sub center" style="padding:24px 0">Hiện chưa có phòng công khai nào.<br>Hãy bấm <b>Create a room</b> để tạo phòng mới và rủ mọi người cùng chơi!</p>';
        return;
      }
      for (const r of list) {
        const row = document.createElement('div');
        row.className = 'public-room-row';
        const bestTimeStr = (G.U && G.U.mmss) ? G.U.mmss(r.bestTime || 0) : (Math.floor((r.bestTime || 0) / 60) + 'm');
        const bestPoke = G.DEX_BY[r.bestDex] || G.DEX_BY[r.dex] || G.DEX_BY[25];
        row.innerHTML = `
          <div class="room-host-info">
            <div class="host-avatar"></div>
            <div class="host-details">
              <b class="host-name" translate="no">${esc(r.hostName || 'Host')}</b>
              <div class="host-achieve">
                <span>⏱️ ${bestTimeStr}</span>
                <span>Lv ${r.bestLevel || 1}</span>
                <span class="achieve-poke">${G.Icons.html('ball', 12)} ${esc(bestPoke.name)}</span>
              </div>
            </div>
          </div>
          <div class="room-members-count">
            👥 <b>${r.memberCount || 1} / 4</b>
          </div>
          <div class="room-actions">
            <button class="btn gold small join-btn" data-sfx="confirm">Tham gia</button>
          </div>
        `;
        const ava = row.querySelector('.host-avatar');
        if (ava) ava.appendChild(G.UI.spriteCanvas(r.dex || 25, 46, 46, { lively: true, shiny: !!r.shiny, scale: 1.5 }));
        const btn = row.querySelector('.join-btn');
        if (btn) btn.onclick = async () => {
          btn.disabled = true;
          const res = await G.Social.joinRoom(r.roomId);
          btn.disabled = false;
          if (res.ok) {
            close();
            G.LobbyUI.open();
          } else {
            G.UI.toast(res.error || 'Không thể vào phòng');
          }
        };
        box.appendChild(row);
      }
    }

    return { init, open, close, renderRooms };
  })();

  // ======================= PARTNER PICKER (IN-LOBBY) =======================

  G.PartnerPickerUI = (() => {
    let q = '';

    function init() {
      if ($('picker-close')) $('picker-close').onclick = close;
      if ($('picker-search')) $('picker-search').oninput = e => { q = e.target.value.toLowerCase().trim(); renderGrid(); };
    }

    function open() {
      G.UI.show('scr-partner-picker', true);
      q = '';
      if ($('picker-search')) $('picker-search').value = '';
      renderGrid();
    }

    function close() {
      G.UI.hide('scr-partner-picker');
      if (G.Social.room) G.LobbyUI.open();
      else G.MenuUI.open();
    }

    function renderGrid() {
      const box = $('picker-grid');
      if (!box) return;
      box.innerHTML = '';
      const s = G.DB.save;
      const owned = Object.keys(s.owned || {}).map(Number).filter(d => G.DEX_BY[d]);
      const filtered = owned.filter(dex => {
        if (!q) return true;
        const p = G.DEX_BY[dex];
        return p.name.toLowerCase().includes(q) || String(p.dex).includes(q);
      }).sort((a, b) => a - b);

      if (!filtered.length) {
        box.innerHTML = '<p class="sub center" style="grid-column:1/-1;padding:20px">Không tìm thấy Pokémon nào.</p>';
        return;
      }

      for (const dex of filtered) {
        const p = G.DEX_BY[dex];
        const isPartner = dex === s.partner;
        const cell = document.createElement('div');
        cell.className = 'picker-cell' + (isPartner ? ' on' : '');
        cell.innerHTML = `
          <div class="p-num">#${String(dex).padStart(3, '0')}</div>
          <div class="p-canvas"></div>
          <b class="p-name">${esc(p.name)}</b>
          ${isPartner ? '<span class="p-cur">Đang chọn</span>' : ''}
        `;
        const cBox = cell.querySelector('.p-canvas');
        if (cBox) cBox.appendChild(G.UI.spriteCanvas(dex, 56, 56, { lively: true, shiny: isPartner ? !!s.partnerShiny : false }));
        cell.onclick = () => {
          G.Social.refreshMember(dex, isPartner ? s.partnerShiny : false);
          G.UI.toast(`Đã đổi Pokémon sang ${p.name}!`);
          close();
        };
        box.appendChild(cell);
      }
    }

    return { init, open, close, renderGrid };
  })();

  // ======================= SALA / PARTY =======================

  G.LobbyUI = (() => {
    let membersKey = '';

    function init() {
      if ($('lobby-leave')) $('lobby-leave').onclick = async () => {
        await G.Social.leaveRoom();
        G.Net.close();
        G.MenuUI.open();
      };
      if ($('lobby-back')) $('lobby-back').onclick = () => G.MenuUI.open();
      if ($('lobby-ready')) $('lobby-ready').onclick = () => {
        G.Social.toggleReady();
        G.Audio.sfx('confirm');
      };
      if ($('lobby-public-toggle')) $('lobby-public-toggle').onclick = () => {
        const room = G.Social.room;
        if (room && room.isHost) {
          const next = !room.isPublic;
          room.isPublic = next;
          render();
          G.Audio.sfx('click');
          G.Social.setRoomPublic(next);
        }
      };
      if ($('lobby-start')) {
        $('lobby-start').onclick = start;
        $('lobby-start').dataset.sfx = 'confirm';
      }

      G.Social.on(what => {
        const room = G.Social.room;
        if (room) {
          G.Net.open(room.id, room.isHost, room.host);
          if (!G.Coop.active && !room.lost) G.Net.syncMembers(room.members.map(m => m.uid));
        } else if (G.Net.open_) G.Net.close();
        if (what === 'room-closed') {
          G.UI.toast('La sala se ha cerrado', 2600);
          if (G.UI.isOpen('scr-lobby')) G.MenuUI.open();
        }
        if (G.UI.isOpen('scr-lobby')) render();
      });
      G.Net.onPeer(() => { if (G.UI.isOpen('scr-lobby')) render(); });
    }

    function open() {
      if (!G.Social.room) { G.MenuUI.open(); return; }
      G.Social.refreshMember();
      G.Social.ensureFriends().then(() => { if (G.UI.isOpen('scr-lobby')) { membersKey = ''; render(); } });
      G.UI.show('scr-lobby', true);
      membersKey = '';
      render();
    }

    function close() { G.UI.hide('scr-lobby'); }

    function connText(m, room) {
      if (m.uid === room.host) return 'Connected';
      if (!room.isHost) return m.uid === G.Social.uid ? 'Connected' : 'Connected';
      const mode = G.Net.mode(m.uid);
      return mode === 'direct' ? 'Connected' : mode === 'relay' ? 'Connected (server)' : mode === 'failed' ? 'Connection failed' : 'Connecting…';
    }

    function render() {
      const room = G.Social.room;
      if (!room) return;
      const ms = room.members;
      const myMember = ms.find(m => m.uid === G.Social.uid);

      if ($('lobby-sub')) {
        $('lobby-sub').textContent = room.isHost
          ? "You're the host. Invite your friends (up to 3) and start when you're ready."
          : "You're in the room of " + ((ms.find(m => m.uid === room.host) || {}).name || 'Host') + ". Get ready and wait for the host to start.";
      }

      // Render 4 Member Cards
      const key = ms.map(m => m.uid + ':' + m.dex + ':' + (m.shiny ? 1 : 0) + ':' + (m.ready ? 1 : 0)).join('|');
      const box = $('lobby-members');
      if (key !== membersKey) {
        membersKey = key;
        box.innerHTML = '';
        for (let i = 0; i < G.Social.MAX_PLAYERS; i++) {
          const m = ms[i];
          const isMe = m && m.uid === G.Social.uid;
          const isHost = m && m.uid === room.host;
          const c = document.createElement('div');
          c.className = 'lob-card' + (m ? (isMe ? ' is-me' : '') : ' empty');
          if (m) {
            c.style.setProperty('--pc', G.Coop.COLORS[i] || '#ffd23f');
            const mon = G.DEX_BY[m.dex] || G.DEX_BY[25];
            const roleTxt = isHost ? (isMe ? '👑 Host · You' : '👑 Host') : (isMe ? '✋ Member · You' : '✋ Member');
            const readyCls = m.ready ? 'ready' : 'not-ready';
            const readyTxt = m.ready ? 'Ready' : 'Not ready';

            c.innerHTML = `
              <div class="card-avatar"></div>
              <b class="card-name" translate="no">${esc(m.name)}</b>
              <small class="card-poke">${esc(mon.name)}</small>
              <span class="card-role">${roleTxt}</span>
              <span class="ready-badge ${readyCls}">${readyTxt}</span>
              <span class="conn" data-u="${m.uid}">Connected</span>
              ${isMe ? '<button class="change-mon-btn">Change Pokémon</button>' : ''}
            `;
            const avBox = c.querySelector('.card-avatar');
            if (avBox) avBox.appendChild(G.UI.spriteCanvas(m.dex, 100, 80, { scale: 2, lively: true, shiny: !!m.shiny }));
            if (isMe) {
              const chBtn = c.querySelector('.change-mon-btn');
              if (chBtn) chBtn.onclick = () => G.PartnerPickerUI.open();
            }
          } else {
            c.innerHTML = '<span class="empty-txt">Free</span>';
          }
          box.appendChild(c);
        }
      }

      box.querySelectorAll('.conn').forEach(el => {
        const m = ms.find(x => x.uid === el.dataset.u);
        if (!m) return;
        const t = connText(m, room);
        el.textContent = t;
        el.className = 'conn' + (t === 'Connecting…' ? ' wait' : '');
      });

      // Public toggle row
      const pubRow = $('lobby-public-row');
      if (pubRow) {
        pubRow.classList.toggle('hidden', !room.isHost);
        const tBtn = $('lobby-public-toggle');
        if (tBtn) {
          tBtn.textContent = room.isPublic ? 'ON' : 'OFF';
          tBtn.classList.toggle('on', !!room.isPublic);
        }
      }

      // Waiting notice
      const notReady = ms.filter(m => !m.ready);
      const wBar = $('lobby-waiting');
      const wNames = $('lobby-waiting-names');
      if (wBar && wNames) {
        if (notReady.length > 0) {
          wBar.classList.remove('all-ready');
          wBar.innerHTML = 'Waiting for: <span class="gold">' + notReady.map(m => esc(m.name)).join(', ') + '</span>';
        } else {
          wBar.classList.add('all-ready');
          wBar.innerHTML = '<span class="all-ready-txt">✅ All players are ready!</span>';
        }
      }

      // Action buttons
      const readyBtn = $('lobby-ready');
      if (readyBtn) {
        const isReady = !!(myMember && myMember.ready);
        readyBtn.textContent = isReady ? 'Not ready' : "I'm ready";
        readyBtn.classList.toggle('is-ready', isReady);
      }

      const startBtn = $('lobby-start');
      if (startBtn) {
        startBtn.classList.toggle('hidden', !room.isHost);
        if (room.isHost) {
          const allReady = ms.length >= 1 && ms.every(m => m.ready);
          const connecting = ms.some(m => m.uid !== room.host && G.Net.mode(m.uid) === 'connecting');
          const failed = ms.some(m => m.uid !== room.host && G.Net.mode(m.uid) === 'failed');
          startBtn.disabled = !allReady || connecting || failed;
          startBtn.classList.toggle('disabled', !allReady || connecting || failed);
        }
      }

      // Friends list below
      const invList = $('lobby-invite');
      if (invList) {
        invList.innerHTML = '';
        const allFriends = G.Social.friends.filter(f => f.status === 'ok');
        if (!allFriends.length) {
          invList.innerHTML = '<p class="sub" style="margin:4px 0">Chưa có bạn bè nào. Thêm bạn trong mục Bạn bè để rủ chơi cùng!</p>';
        } else {
          for (const f of allFriends) {
            const inThisRoom = ms.some(m => m.uid === f.uid);
            const isOnline = !!f.online;
            const el = document.createElement('div');
            el.className = 'lobby-friend-row';
            el.innerHTML = `
              <i class="dot ${isOnline ? 'on' : 'off'}"></i>
              <b translate="no" class="f-name">${esc(f.name)}</b>
              <span class="f-status">${inThisRoom ? 'In this room' : (isOnline ? 'Online' : 'Offline')}</span>
              <span class="grow"></span>
              <button class="btn small invite-btn ${isOnline && !inThisRoom ? 'gold' : 'disabled'}" ${isOnline && !inThisRoom ? '' : 'disabled'}>
                ${inThisRoom ? 'Joined' : 'Invite'}
              </button>
            `;
            const b = el.querySelector('.invite-btn');
            if (b && isOnline && !inThisRoom) {
              b.onclick = async () => {
                b.disabled = true;
                const r = await G.Social.invite(f.uid);
                G.UI.toast(r.ok ? r.msg : r.error);
                setTimeout(() => { if (b) b.disabled = false; }, 3000);
              };
            }
            invList.appendChild(el);
          }
        }
      }
    }

    function start() {
      const room = G.Social.room;
      if (!room || !room.isHost) return;
      const cfg = {
        k: 'start', seed: Math.floor(Math.random() * 1e6), host: room.host,
        members: room.members.map(m => ({ uid: m.uid, name: m.name, dex: m.dex, shiny: !!m.shiny }))
      };
      G.Social.setOpen(false);
      G.Net.broadcast(cfg);
      G.Flow.startCoop(cfg);
    }

    return { init, open, close, render };
  })();

  // ======================= INVITACIONES =======================

  G.InvitePop = (() => {
    let cur = null;

    function init() {
      $('inv-yes').onclick = async () => {
        if (!cur) return;
        const from = cur.from;
        hide();
        const r = await G.Social.acceptInvite(from);
        if (!r.ok) { G.UI.toast(r.error, 3000); return; }
        G.LobbyUI.open();
      };
      $('inv-no').onclick = () => { if (cur) G.Social.declineInvite(cur.from); hide(); };
      G.Social.on(what => { if (what === 'invites' || what === 'room') refresh(); });
    }

    function hide() { cur = null; $('invite-pop').classList.add('hidden'); }

    /** Enseña la invitación más antigua si estás en los menús (no en plena partida). */
    function refresh() {
      const room = G.Social.room;
      const list = G.Social.invites.filter(i => !room || i.room !== room.id).sort((a, b) => a.at - b.at);
      if (!list.length || G.Game.state !== 'ui' || !G.DB.loggedIn) { hide(); return; }
      if (cur && cur.from === list[0].from) return;
      cur = list[0];
      $('inv-text').innerHTML = `${G.Icons.html('friends', 22)} <b class="gold" translate="no">${esc(cur.name)}</b> te invita a jugar en su sala`;
      $('invite-pop').classList.remove('hidden');
      G.Audio.sfx('shiny');
    }

    return { init, refresh };
  })();

  G.SocialUI = {
    init() {
      G.NickUI.init();
      G.FriendsUI.init();
      G.MultiplayerUI.init();
      G.LobbyUI.init();
      G.PartnerPickerUI.init();
      G.InvitePop.init();
    },
    withNick, needOnline
  };
})();

