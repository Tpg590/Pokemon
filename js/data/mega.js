/* ============ mega.js — Dữ liệu & Hệ thống Tiến hóa Mega ============
 * Hỗ trợ 30 loài Pokémon có sprite Mega chuyển động pixel thật từ PMDCollab (Sprite Repository).
 */
window.G = window.G || {};

G.Mega = (() => {
  // Danh sách chi tiết 30 loài có đầy đủ Sprite Mega chuẩn từ PMDCollab
  const DATA = {
    // Gen 1
    6: {
      name: 'Mega Charizard X', stone: 'Charizardite X', stoneVi: 'Đá Charizardite X',
      types: ['fire', 'dragon'], ability: 'Tough Claws',
      hp: 78, pa: 130, sa: 130, df: 111, sd: 85, spd: 100, bst: 634,
      desc: 'Chuyển sang hệ Rồng, sát thương vật lý và các đòn áp sát tăng vọt.'
    },
    65: {
      name: 'Mega Alakazam', stone: 'Alakazite', stoneVi: 'Đá Alakazite',
      types: ['psychic'], ability: 'Trace',
      hp: 55, pa: 50, sa: 175, df: 65, sd: 105, spd: 150, bst: 600,
      desc: 'Năng lượng tâm linh tối thượng xé toạc không gian xung quanh.'
    },
    80: {
      name: 'Mega Slowbro', stone: 'Slowbronite', stoneVi: 'Đá Slowbronite',
      types: ['water', 'psychic'], ability: 'Shell Armor',
      hp: 95, pa: 75, sa: 130, df: 180, sd: 80, spd: 30, bst: 590,
      desc: 'Vỏ ốc Shellder bao bọc kiên cố tuyệt đối, chặn đứng mọi đòn hiểm.'
    },
    94: {
      name: 'Mega Gengar', stone: 'Gengarite', stoneVi: 'Đá Gengarite',
      types: ['ghost', 'poison'], ability: 'Shadow Tag',
      hp: 60, pa: 65, sa: 170, df: 80, sd: 95, spd: 130, bst: 600,
      desc: 'Bóng ma xuất quỷ nhập thần giam cầm linh hồn kẻ địch trong bóng tối.'
    },
    115: {
      name: 'Mega Kangaskhan', stone: 'Kangaskhanite', stoneVi: 'Đá Kangaskhanite',
      types: ['normal'], ability: 'Parental Bond',
      hp: 105, pa: 125, sa: 60, df: 100, sd: 100, spd: 100, bst: 590,
      desc: 'Kangaskhan con nhảy ra cùng tấn công, gây thêm đòn đánh phụ liên hoàn.'
    },
    142: {
      name: 'Mega Aerodactyl', stone: 'Aerodactylite', stoneVi: 'Đá Aerodactylite',
      types: ['rock', 'flying'], ability: 'Tough Claws',
      hp: 80, pa: 135, sa: 70, df: 85, sd: 95, spd: 150, bst: 615,
      desc: 'Thợ săn tiền sử mọc gai đá nhọn hoắt, lao vun vút xé gió săn mồi.'
    },
    150: {
      name: 'Mega Mewtwo Y', stone: 'Mewtwonite Y', stoneVi: 'Đá Mewtwonite Y',
      types: ['psychic'], ability: 'Insomnia',
      hp: 106, pa: 150, sa: 194, df: 70, sd: 120, spd: 140, bst: 780,
      desc: 'Giải phóng toàn bộ sức mạnh tinh thần, sóng năng lượng vô tận.'
    },

    // Gen 2
    208: {
      name: 'Mega Steelix', stone: 'Steelixite', stoneVi: 'Đá Steelixite',
      types: ['steel', 'ground'], ability: 'Sand Force',
      hp: 75, pa: 125, sa: 55, df: 230, sd: 95, spd: 30, bst: 610,
      desc: 'Rắn thép kim cương hóa với vòng mảnh kim loại quay quanh chắn đòn.'
    },
    229: {
      name: 'Mega Houndoom', stone: 'Houndoominite', stoneVi: 'Đá Houndoominite',
      types: ['dark', 'fire'], ability: 'Solar Power',
      hp: 75, pa: 90, sa: 140, df: 90, sd: 90, spd: 115, bst: 600,
      desc: 'Ngọn lửa địa ngục thiêu rụi đối thủ, tiếng hú gieo rắc nỗi kinh hoàng.'
    },
    248: {
      name: 'Mega Tyranitar', stone: 'Tyranitarite', stoneVi: 'Đá Tyranitarite',
      types: ['rock', 'dark'], ability: 'Sand Stream',
      hp: 100, pa: 164, sa: 95, df: 150, sd: 120, spd: 71, bst: 700,
      desc: 'Bạo chúa cát thức tỉnh, lớp vỏ giáp bọc gai dựng đứng không thể xuyên thủng.'
    },

    // Gen 3
    282: {
      name: 'Mega Gardevoir', stone: 'Gardevoirite', stoneVi: 'Đá Gardevoirite',
      types: ['psychic', 'fairy'], ability: 'Pixilate',
      hp: 68, pa: 85, sa: 165, df: 65, sd: 135, spd: 100, bst: 618,
      desc: 'Bộ váy thiên nga kiều diễm điều khiển hố đen tâm linh và tiên tộc.'
    },
    302: {
      name: 'Mega Sableye', stone: 'Sablenite', stoneVi: 'Đá Sablenite',
      types: ['dark', 'ghost'], ability: 'Magic Bounce',
      hp: 50, pa: 85, sa: 85, df: 125, sd: 115, spd: 20, bst: 480,
      desc: 'Núp sau viên ngọc hồng ngọc khổng lồ phản xạ mọi đòn tấn công.'
    },
    303: {
      name: 'Mega Mawile', stone: 'Mawilite', stoneVi: 'Đá Mawilite',
      types: ['steel', 'fairy'], ability: 'Huge Power',
      hp: 50, pa: 105, sa: 55, df: 125, sd: 95, spd: 50, bst: 480,
      desc: 'Sở hữu 2 chiếc hàm thép khổng lồ cắn nát sắt thép với sức mạnh nhân đôi.'
    },
    308: {
      name: 'Mega Medicham', stone: 'Medichamite', stoneVi: 'Đá Medichamite',
      types: ['fighting', 'psychic'], ability: 'Pure Power',
      hp: 60, pa: 100, sa: 80, df: 85, sd: 85, spd: 100, bst: 510,
      desc: 'Thiền định giải phóng luân xa, biến sức mạnh ý chí thành đòn đánh sấm sét.'
    },
    310: {
      name: 'Mega Manectric', stone: 'Manectite', stoneVi: 'Đá Manectite',
      types: ['electric'], ability: 'Intimidate',
      hp: 70, pa: 75, sa: 135, df: 80, sd: 80, spd: 135, bst: 575,
      desc: 'Lưng dựng bờm tia sét khổng lồ tích trữ dòng điện triệu vôn.'
    },
    319: {
      name: 'Mega Sharpedo', stone: 'Sharpedonite', stoneVi: 'Đá Sharpedonite',
      types: ['water', 'dark'], ability: 'Strong Jaw',
      hp: 70, pa: 140, sa: 110, df: 70, sd: 65, spd: 105, bst: 560,
      desc: 'Cá mập bọc giáp phóng đi như ngư lôi với hàm răng sắc bén vô song.'
    },
    323: {
      name: 'Mega Camerupt', stone: 'Cameruptite', stoneVi: 'Đá Cameruptite',
      types: ['fire', 'ground'], ability: 'Sheer Force',
      hp: 70, pa: 120, sa: 145, df: 100, sd: 105, spd: 20, bst: 560,
      desc: 'Miệng núi lửa trên lưng phun trào dung nham hủy diệt diện rộng.'
    },
    334: {
      name: 'Mega Altaria', stone: 'Altarianite', stoneVi: 'Đá Altarianite',
      types: ['dragon', 'fairy'], ability: 'Pixilate',
      hp: 75, pa: 110, sa: 110, df: 110, sd: 105, spd: 80, bst: 590,
      desc: 'Bộ lông mây bồng bềnh chuyển hóa thành hệ Rồng/Tiên tuyệt mỹ.'
    },
    354: {
      name: 'Mega Banette', stone: 'Banettite', stoneVi: 'Đá Banettite',
      types: ['ghost'], ability: 'Prankster',
      hp: 64, pa: 165, sa: 93, df: 75, sd: 83, spd: 75, bst: 555,
      desc: 'Khóa kéo mở toang giải phóng oán niệm tà ác của búp bê bóng ma.'
    },
    359: {
      name: 'Mega Absol', stone: 'Absolite', stoneVi: 'Đá Absolite',
      types: ['dark'], ability: 'Magic Bounce',
      hp: 65, pa: 150, sa: 115, df: 60, sd: 60, spd: 115, bst: 565,
      desc: 'Đôi cánh thiên thần bóng tối giang rộng cảnh báo tai ương.'
    },
    362: {
      name: 'Mega Glalie', stone: 'Glalitite', stoneVi: 'Đá Glalitite',
      types: ['ice'], ability: 'Refrigerate',
      hp: 80, pa: 120, sa: 120, df: 80, sd: 80, spd: 100, bst: 580,
      desc: 'Chiếc hàm băng khổng lồ há to nuốt chửng kẻ thù vào mùa đông vĩnh cửu.'
    },
    380: {
      name: 'Mega Latias', stone: 'Latiasite', stoneVi: 'Đá Latiasite',
      types: ['dragon', 'psychic'], ability: 'Levitate',
      hp: 80, pa: 100, sa: 140, df: 120, sd: 150, spd: 110, bst: 700,
      desc: 'Phi cơ rồng huyền thoại với trường phòng ngự tâm linh bất khả xâm phạm.'
    },
    381: {
      name: 'Mega Latios', stone: 'Latiosite', stoneVi: 'Đá Latiosite',
      types: ['dragon', 'psychic'], ability: 'Levitate',
      hp: 80, pa: 130, sa: 160, df: 100, sd: 120, spd: 110, bst: 700,
      desc: 'Tốc độ vượt âm thanh xé toạc bầu trời phóng ra làn sóng rồng hủy diệt.'
    },
    382: {
      name: 'Primal Kyogre', stone: 'Blue Orb', stoneVi: 'Ngọc Lam Cổ Đại',
      types: ['water'], ability: 'Primordial Sea',
      hp: 100, pa: 150, sa: 180, df: 90, sd: 160, spd: 90, bst: 770,
      desc: 'Biến đổi Nguyên thủy triệu hồi mưa bão cổ xưa nhấn chìm lục địa.'
    },
    383: {
      name: 'Primal Groudon', stone: 'Red Orb', stoneVi: 'Ngọc Đỏ Cổ Đại',
      types: ['ground', 'fire'], ability: 'Desolate Land',
      hp: 100, pa: 180, sa: 150, df: 160, sd: 90, spd: 90, bst: 770,
      desc: 'Biến đổi Nguyên thủy khoác lên hệ Lửa thiêu rụi đại dương tạo dựng đất mẹ.'
    },
    384: {
      name: 'Mega Rayquaza', stone: 'Meteorite', stoneVi: 'Đá Thiên Thạch',
      types: ['dragon', 'flying'], ability: 'Delta Stream',
      hp: 105, pa: 180, sa: 180, df: 100, sd: 100, spd: 115, bst: 780,
      desc: 'Thần rồng thượng tầng khí quyển thống trị gió bão với sức mạnh tuyệt đối.'
    },

    // Gen 4
    428: {
      name: 'Mega Lopunny', stone: 'Lopunnite', stoneVi: 'Đá Lopunnite',
      types: ['normal', 'fighting'], ability: 'Scrappy',
      hp: 65, pa: 136, sa: 54, df: 94, sd: 96, spd: 135, bst: 580,
      desc: 'Thức tỉnh năng khiếu quyền cước Giác Đấu, tung cước đánh trúng cả bóng ma.'
    },
    448: {
      name: 'Mega Lucario', stone: 'Lucarionite', stoneVi: 'Đá Lucarionite',
      types: ['fighting', 'steel'], ability: 'Adaptability',
      hp: 70, pa: 145, sa: 140, df: 88, sd: 70, spd: 112, bst: 625,
      desc: 'Khí công Ba Động Aura bao phủ nắm đấm thép, bộc phát đòn đánh chí mạng.'
    },
    475: {
      name: 'Mega Gallade', stone: 'Galladite', stoneVi: 'Đá Galladite',
      types: ['psychic', 'fighting'], ability: 'Inner Focus',
      hp: 68, pa: 165, sa: 65, df: 95, sd: 115, spd: 110, bst: 618,
      desc: 'Hiệp sĩ song kiếm thanh tú với đôi kiếm tay sắc bén bảo vệ đồng đội.'
    },

    // Gen 6
    719: {
      name: 'Mega Diancie', stone: 'Diancite', stoneVi: 'Đá Diancite',
      types: ['rock', 'fairy'], ability: 'Magic Bounce',
      hp: 50, pa: 160, sa: 160, df: 110, sd: 110, spd: 110, bst: 700,
      desc: 'Công chúa kim cương tỏa sáng rực rỡ bắn ra những chùm tia lấp lánh.'
    }
  };

  function isCapable(dex) {
    return !!DATA[dex];
  }

  function getForms(dex) {
    const d = DATA[dex];
    if (!d) return [];
    return Array.isArray(d) ? d : [d];
  }

  function getDefaultForm(dex) {
    const list = getForms(dex);
    return list[0] || null;
  }

  function getFormInfo(dex, formKey) {
    const list = getForms(dex);
    if (!list.length) return null;
    if (!formKey) return list[0];
    return list.find(f => f.form === formKey) || list[0];
  }

  function getStoneName(dex, formKey) {
    const info = getFormInfo(dex, formKey);
    if (!info) return '';
    const isVi = G.I18n && G.I18n.lang === 'vi';
    return isVi ? (info.stoneVi || info.stone) : info.stone;
  }

  // --- Quản lý Đá Mega đã sở hữu trong save ---
  function hasStone(dex, formKey) {
    const s = G.DB && G.DB.save;
    if (!s) return false;
    s.megas = s.megas || {};
    const key = formKey ? `${dex}:${formKey}` : `${dex}`;
    return !!s.megas[key] || !!s.megas[dex];
  }

  function unlockStone(dex, formKey) {
    const s = G.DB && G.DB.save;
    if (!s) return;
    s.megas = s.megas || {};
    const key = formKey ? `${dex}:${formKey}` : `${dex}`;
    s.megas[key] = true;
    s.megas[dex] = true;
    G.DB.commit();
  }

  // Trang bị đá Mega cho Pokemon trước run
  function getEquippedForm(dex) {
    const s = G.DB && G.DB.save;
    if (!s || !s.megaEquip) return null;
    return s.megaEquip[dex] || null;
  }

  function setEquippedForm(dex, formKey) {
    const s = G.DB && G.DB.save;
    if (!s) return;
    s.megaEquip = s.megaEquip || {};
    if (formKey === null) {
      delete s.megaEquip[dex];
    } else {
      s.megaEquip[dex] = formKey;
    }
    G.DB.commit();
  }

  // Kiểm tra Pokemon trong trận đấu có thể tiến hóa Mega không
  function canMegaEvolve(pl) {
    if (!pl || pl.isMega || pl.level < 50) return false;
    const dex = pl.dex;
    if (!isCapable(dex)) return false;
    const s = G.DB && G.DB.save;
    if (!s) return false;
    const eq = (s.megaEquip && s.megaEquip[dex]) || (hasStone(dex) ? (getForms(dex)[0].form || 'default') : null);
    return !!eq && hasStone(dex, eq);
  }

  // Thực hiện Tiến hóa Mega trong trận đấu với Sprite Mega thật
  function evolve(pl) {
    if (!pl || pl.isMega) return;
    const dex = pl.dex;
    const s = G.DB && G.DB.save;
    const eq = (s && s.megaEquip && s.megaEquip[dex]) || (getForms(dex)[0].form || 'default');
    const info = getFormInfo(dex, eq);
    if (!info) return;

    pl.isMega = true;
    pl.megaInfo = info;
    pl.megaName = info.name;

    // Chuyển sprite sang Sprite Mega thật từ PMDCollab!
    const megaSpriteId = 'm' + dex;
    if (G.SPRITE_META && G.SPRITE_META[megaSpriteId]) {
      const curDir = pl.anim ? pl.anim.dir : 0;
      pl.anim = new G.Sprites.Animator(megaSpriteId, pl.scale, pl.shiny);
      pl.anim.dir = curDir;
    }

    if (s) {
      s.stats = s.stats || {};
      s.stats.megaEvos = (s.stats.megaEvos || 0) + 1;
      s.stats.megaMaxLevel = Math.max(s.stats.megaMaxLevel || 0, pl.level || 0);
    }
    if (G.Progress && G.Progress.checkAch) G.Progress.checkAch();

    // Thay đổi Hệ
    if (info.types && pl.mon) {
      pl.mon = Object.assign({}, pl.mon, { types: info.types });
    }

    // Tăng vọt chỉ số
    pl.atkMul *= 1.45;
    pl.cdMul *= 0.75;
    pl.dmgReduce = Math.min(0.85, (pl.dmgReduce || 0) + 0.25);
    pl.moveRadiusMul = (pl.moveRadiusMul || 1) * 1.30;
    
    // Tăng máu và hồi phục đầy máu thức tỉnh
    pl.maxHp = Math.round(pl.maxHp * 1.35);
    pl.hp = pl.maxHp;

    // Hiệu ứng âm thanh & hào quang thức tỉnh hoành tráng
    if (G.Audio && G.Audio.sfx) G.Audio.sfx('legend');
    if (G.FX) {
      G.FX.burst(pl.x, pl.y - pl.bodyH * 0.5, '#ff4b6e', 50, 320);
      G.FX.ring(pl.x, pl.y, 10, 160, '#ff4b6e', 1.0, 8);
      G.FX.ring(pl.x, pl.y, 6, 200, '#00d2d3', 1.2, 5);
      G.FX.dmgText(pl.x, pl.y - pl.bodyH - 18, info.name + '!', '#ff4b6e', true);
    }
    if (G.Game && G.Game.flash) G.Game.flash('#ff4b6e', 0.8);
    if (G.Spawner && G.Spawner.say) {
      const isVi = G.I18n && G.I18n.lang === 'vi';
      G.Spawner.say(isVi ? `✨ ${info.name} đã thức tỉnh sức mạnh tối thượng!` : `✨ ${info.name} has awakened!`, 3.5, true);
    }
  }

  // Danh sách toàn bộ 30 mã dex có thể làm Mega Rift Boss
  const ALL_MEGA_DEX = Object.keys(DATA).map(Number);

  return {
    DATA,
    ALL_MEGA_DEX,
    isCapable,
    getForms,
    getDefaultForm,
    getFormInfo,
    getStoneName,
    hasStone,
    unlockStone,
    getEquippedForm,
    setEquippedForm,
    canMegaEvolve,
    evolve
  };
})();
