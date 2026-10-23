/* ============ mega.js — Dữ liệu & Hệ thống Tiến hóa Mega ============
 * Hỗ trợ 46 loài Pokémon (48 dạng Mega bao gồm Charizard X/Y, Mewtwo X/Y, Primal Kyogre/Groudon).
 */
window.G = window.G || {};

G.Mega = (() => {
  // Danh sách chi tiết các loài có khả năng Tiến hóa Mega
  const DATA = {
    // Gen 1
    3: {
      name: 'Mega Venusaur', stone: 'Venusaurite', stoneVi: 'Đá Venusaurite',
      types: ['grass', 'poison'], ability: 'Thick Fat',
      hp: 110, pa: 1.35, sa: 1.55, df: 145, sd: 135, spd: 85, bst: 625,
      desc: 'Tăng mạnh Phòng thủ và Kháng phép, đòn đánh cỏ và độc gây thêm sát thương.'
    },
    6: [
      {
        form: 'x', name: 'Mega Charizard X', stone: 'Charizardite X', stoneVi: 'Đá Charizardite X',
        types: ['fire', 'dragon'], ability: 'Tough Claws',
        hp: 105, pa: 1.62, sa: 1.62, df: 125, sd: 95, spd: 115, bst: 634,
        desc: 'Chuyển sang hệ Rồng, sát thương vật lý và các đòn áp sát tăng vọt.'
      },
      {
        form: 'y', name: 'Mega Charizard Y', stone: 'Charizardite Y', stoneVi: 'Đá Charizardite Y',
        types: ['fire', 'flying'], ability: 'Drought',
        hp: 105, pa: 1.25, sa: 1.89, df: 88, sd: 125, spd: 115, bst: 634,
        desc: 'Thiêu đốt không gian với ánh mặt trời rực lửa, tăng uy lực đòn lửa cực đại.'
      }
    ],
    9: {
      name: 'Mega Blastoise', stone: 'Blastoisinite', stoneVi: 'Đá Blastoisinite',
      types: ['water'], ability: 'Mega Launcher',
      hp: 106, pa: 1.25, sa: 1.65, df: 135, sd: 125, spd: 85, bst: 630,
      desc: 'Đại bác nước trên mai khai hỏa dồn dập, tăng phạm vi và tầm bắn chiêu thức.'
    },
    15: {
      name: 'Mega Beedrill', stone: 'Beedrillite', stoneVi: 'Đá Beedrillite',
      types: ['bug', 'poison'], ability: 'Adaptability',
      hp: 95, pa: 1.85, sa: 0.50, df: 50, sd: 90, spd: 165, bst: 495,
      desc: 'Tốc độ siêu thanh cùng ngọn giáo chết chóc, hạ gục kẻ địch chớp nhoáng.'
    },
    18: {
      name: 'Mega Pidgeot', stone: 'Pidgeotite', stoneVi: 'Đá Pidgeotite',
      types: ['normal', 'flying'], ability: 'No Guard',
      hp: 105, pa: 1.00, sa: 1.65, df: 90, sd: 90, spd: 138, bst: 579,
      desc: 'Cơn cuồng phong bão táp, đòn đánh không bao giờ trượt mục tiêu.'
    },
    65: {
      name: 'Mega Alakazam', stone: 'Alakazite', stoneVi: 'Đá Alakazite',
      types: ['psychic'], ability: 'Trace',
      hp: 85, pa: 0.85, sa: 1.95, df: 75, sd: 105, spd: 168, bst: 600,
      desc: 'Năng lượng tâm linh tối thượng xé toạc không gian xung quanh.'
    },
    80: {
      name: 'Mega Slowbro', stone: 'Slowbronite', stoneVi: 'Đá Slowbronite',
      types: ['water', 'psychic'], ability: 'Shell Armor',
      hp: 115, pa: 1.00, sa: 1.60, df: 195, sd: 90, spd: 40, bst: 590,
      desc: 'Vỏ ốc Shellder bao bọc kiên cố tuyệt đối, chặn đứng mọi đòn hiểm.'
    },
    94: {
      name: 'Mega Gengar', stone: 'Gengarite', stoneVi: 'Đá Gengarite',
      types: ['ghost', 'poison'], ability: 'Shadow Tag',
      hp: 90, pa: 0.95, sa: 1.90, df: 90, sd: 105, spd: 148, bst: 600,
      desc: 'Bóng ma xuất quỷ nhập thần giam cầm linh hồn kẻ địch trong bóng tối.'
    },
    115: {
      name: 'Mega Kangaskhan', stone: 'Kangaskhanite', stoneVi: 'Đá Kangaskhanite',
      types: ['normal'], ability: 'Parental Bond',
      hp: 125, pa: 1.55, sa: 0.80, df: 110, sd: 110, spd: 110, bst: 590,
      desc: 'Kangaskhan con nhảy ra cùng tấn công, gây thêm đòn đánh phụ liên hoàn.'
    },
    127: {
      name: 'Mega Pinsir', stone: 'Pinsirite', stoneVi: 'Đá Pinsirite',
      types: ['bug', 'flying'], ability: 'Aerilate',
      hp: 95, pa: 1.80, sa: 0.85, df: 130, sd: 100, spd: 120, bst: 600,
      desc: 'Mọc cánh bay lượn và nghiền nát quân thù với cặp sừng khổng lồ.'
    },
    130: {
      name: 'Mega Gyarados', stone: 'Gyaradosite', stoneVi: 'Đá Gyaradosite',
      types: ['water', 'dark'], ability: 'Mold Breaker',
      hp: 115, pa: 1.75, sa: 0.95, df: 119, sd: 140, spd: 91, bst: 640,
      desc: 'Thủy quái cuồng nộ hệ Nước/Bóng tối nghiền nát mọi chướng ngại vật.'
    },
    142: {
      name: 'Mega Aerodactyl', stone: 'Aerodactylite', stoneVi: 'Đá Aerodactylite',
      types: ['rock', 'flying'], ability: 'Tough Claws',
      hp: 100, pa: 1.60, sa: 0.90, df: 95, sd: 105, spd: 165, bst: 615,
      desc: 'Thợ săn tiền sử mọc gai đá nhọn hoắt, lao vun vút xé gió săn mồi.'
    },
    150: [
      {
        form: 'x', name: 'Mega Mewtwo X', stone: 'Mewtwonite X', stoneVi: 'Đá Mewtwonite X',
        types: ['psychic', 'fighting'], ability: 'Steadfast',
        hp: 126, pa: 2.10, sa: 1.74, df: 110, sd: 110, spd: 145, bst: 780,
        desc: 'Cường hóa cơ bắp Giác Đấu, cú đấm tâm linh hủy diệt vạn vật.'
      },
      {
        form: 'y', name: 'Mega Mewtwo Y', stone: 'Mewtwonite Y', stoneVi: 'Đá Mewtwonite Y',
        types: ['psychic'], ability: 'Insomnia',
        hp: 126, pa: 1.70, sa: 2.14, df: 80, sd: 130, spd: 155, bst: 780,
        desc: 'Giải phóng toàn bộ sức mạnh tinh thần, sóng năng lượng vô tận.'
      }
    ],

    // Gen 2
    181: {
      name: 'Mega Ampharos', stone: 'Ampharosite', stoneVi: 'Đá Ampharosite',
      types: ['electric', 'dragon'], ability: 'Mold Breaker',
      hp: 110, pa: 1.15, sa: 1.85, df: 115, sd: 120, spd: 65, bst: 610,
      desc: 'Mọc bộ lông bờm rực rỡ và thức tỉnh dòng máu Rồng lôi điện uy dũng.'
    },
    208: {
      name: 'Mega Steelix', stone: 'Steelixite', stoneVi: 'Đá Steelixite',
      types: ['steel', 'ground'], ability: 'Sand Force',
      hp: 105, pa: 1.45, sa: 0.85, df: 240, sd: 105, spd: 40, bst: 610,
      desc: 'Rắn thép kim cương hóa với vòng mảnh kim loại quay quanh chắn đòn.'
    },
    212: {
      name: 'Mega Scizor', stone: 'Scizorite', stoneVi: 'Đá Scizorite',
      types: ['bug', 'steel'], ability: 'Technician',
      hp: 100, pa: 1.70, sa: 0.85, df: 150, sd: 110, spd: 85, bst: 600,
      desc: 'Càng thép nặng nề được cường hóa giáng những đòn búa tạ kinh hoàng.'
    },
    214: {
      name: 'Mega Heracross', stone: 'Heracronite', stoneVi: 'Đá Heracronite',
      types: ['bug', 'fighting'], ability: 'Skill Link',
      hp: 105, pa: 2.05, sa: 0.60, df: 125, sd: 115, spd: 85, bst: 600,
      desc: 'Lực tay và sừng đạt sức mạnh phi thường, liên tục tung đòn uy lực.'
    },
    229: {
      name: 'Mega Houndoom', stone: 'Houndoominite', stoneVi: 'Đá Houndoominite',
      types: ['dark', 'fire'], ability: 'Solar Power',
      hp: 95, pa: 1.10, sa: 1.65, df: 100, sd: 100, spd: 128, bst: 600,
      desc: 'Ngọn lửa địa ngục thiêu rụi đối thủ, tiếng hú gieo rắc nỗi kinh hoàng.'
    },
    248: {
      name: 'Mega Tyranitar', stone: 'Tyranitarite', stoneVi: 'Đá Tyranitarite',
      types: ['rock', 'dark'], ability: 'Sand Stream',
      hp: 120, pa: 1.84, sa: 1.15, df: 140, sd: 130, spd: 81, bst: 700,
      desc: 'Bạo chúa cát thức tỉnh, lớp vỏ giáp bọc gai dựng đứng không thể xuyên thủng.'
    },

    // Gen 3
    254: {
      name: 'Mega Sceptile', stone: 'Sceptilite', stoneVi: 'Đá Sceptilite',
      types: ['grass', 'dragon'], ability: 'Lightning Rod',
      hp: 100, pa: 1.30, sa: 1.65, df: 85, sd: 95, spd: 160, bst: 630,
      desc: 'Thức tỉnh sức mạnh Rồng, bắn đuôi thông như tên lửa dẫn đường.'
    },
    257: {
      name: 'Mega Blaziken', stone: 'Blazikenite', stoneVi: 'Đá Blazikenite',
      types: ['fire', 'fighting'], ability: 'Speed Boost',
      hp: 100, pa: 1.80, sa: 1.45, df: 90, sd: 90, spd: 115, bst: 630,
      desc: 'Dải ruy băng lửa rực cháy quanh cổ tay, đòn cước bốc hỏa liên hoàn.'
    },
    260: {
      name: 'Mega Swampert', stone: 'Swampertite', stoneVi: 'Đá Swampertite',
      types: ['water', 'ground'], ability: 'Swift Swim',
      hp: 120, pa: 1.75, sa: 1.10, df: 120, sd: 120, spd: 80, bst: 635,
      desc: 'Cơ bắp cuồn cuộn thống trị vùng đầm lầy, đập tan mọi chướng ngại.'
    },
    282: {
      name: 'Mega Gardevoir', stone: 'Gardevoirite', stoneVi: 'Đá Gardevoirite',
      types: ['psychic', 'fairy'], ability: 'Pixilate',
      hp: 98, pa: 1.05, sa: 1.85, df: 75, sd: 145, spd: 110, bst: 618,
      desc: 'Bộ váy thiên nga kiều diễm điều khiển hố đen tâm linh và tiên tộc.'
    },
    302: {
      name: 'Mega Sableye', stone: 'Sablenite', stoneVi: 'Đá Sablenite',
      types: ['dark', 'ghost'], ability: 'Magic Bounce',
      hp: 80, pa: 1.05, sa: 1.05, df: 135, sd: 125, spd: 30, bst: 480,
      desc: 'Núp sau viên ngọc hồng ngọc khổng lồ phản xạ mọi đòn tấn công.'
    },
    303: {
      name: 'Mega Mawile', stone: 'Mawilite', stoneVi: 'Đá Mawilite',
      types: ['steel', 'fairy'], ability: 'Huge Power',
      hp: 80, pa: 1.25, sa: 0.75, df: 135, sd: 105, spd: 60, bst: 480,
      desc: 'Sở hữu 2 chiếc hàm thép khổng lồ cắn nát sắt thép với sức mạnh nhân đôi.'
    },
    306: {
      name: 'Mega Aggron', stone: 'Aggronite', stoneVi: 'Đá Aggronite',
      types: ['steel'], ability: 'Filter',
      hp: 100, pa: 1.60, sa: 0.80, df: 245, sd: 90, spd: 60, bst: 630,
      desc: 'Bức tường thép thuần khiết với chỉ số phòng thủ vững như thái sơn.'
    },
    308: {
      name: 'Mega Medicham', stone: 'Medichamite', stoneVi: 'Đá Medichamite',
      types: ['fighting', 'psychic'], ability: 'Pure Power',
      hp: 90, pa: 1.20, sa: 0.80, df: 95, sd: 95, spd: 110, bst: 510,
      desc: 'Thiền định giải phóng luân xa, biến sức mạnh ý chí thành đòn đánh sấm sét.'
    },
    310: {
      name: 'Mega Manectric', stone: 'Manectite', stoneVi: 'Đá Manectite',
      types: ['electric'], ability: 'Intimidate',
      hp: 95, pa: 0.95, sa: 1.55, df: 90, sd: 90, spd: 145, bst: 575,
      desc: 'Lưng dựng bờm tia sét khổng lồ tích trữ dòng điện triệu vôn.'
    },
    319: {
      name: 'Mega Sharpedo', stone: 'Sharpedonite', stoneVi: 'Đá Sharpedonite',
      types: ['water', 'dark'], ability: 'Strong Jaw',
      hp: 95, pa: 1.60, sa: 1.30, df: 80, sd: 75, spd: 115, bst: 560,
      desc: 'Cá mập bọc giáp phóng đi như ngư lôi với hàm răng sắc bén vô song.'
    },
    323: {
      name: 'Mega Camerupt', stone: 'Cameruptite', stoneVi: 'Đá Cameruptite',
      types: ['fire', 'ground'], ability: 'Sheer Force',
      hp: 100, pa: 1.40, sa: 1.65, df: 110, sd: 115, spd: 30, bst: 560,
      desc: 'Miệng núi lửa trên lưng phun trào dung nham hủy diệt diện rộng.'
    },
    334: {
      name: 'Mega Altaria', stone: 'Altarianite', stoneVi: 'Đá Altarianite',
      types: ['dragon', 'fairy'], ability: 'Pixilate',
      hp: 100, pa: 1.30, sa: 1.30, df: 120, sd: 115, spd: 90, bst: 590,
      desc: 'Bộ lông mây bồng bềnh chuyển hóa thành hệ Rồng/Tiên tuyệt mỹ.'
    },
    354: {
      name: 'Mega Banette', stone: 'Banettite', stoneVi: 'Đá Banettite',
      types: ['ghost'], ability: 'Prankster',
      hp: 94, pa: 1.85, sa: 1.03, df: 85, sd: 93, spd: 85, bst: 555,
      desc: 'Khóa kéo mở toang giải phóng oán niệm tà ác của búp bê bóng ma.'
    },
    359: {
      name: 'Mega Absol', stone: 'Absolite', stoneVi: 'Đá Absolite',
      types: ['dark'], ability: 'Magic Bounce',
      hp: 95, pa: 1.70, sa: 1.35, df: 70, sd: 70, spd: 125, bst: 565,
      desc: 'Đôi cánh thiên thần bóng tối giang rộng cảnh báo tai ương.'
    },
    362: {
      name: 'Mega Glalie', stone: 'Glalitite', stoneVi: 'Đá Glalitite',
      types: ['ice'], ability: 'Refrigerate',
      hp: 110, pa: 1.40, sa: 1.40, df: 90, sd: 90, spd: 110, bst: 580,
      desc: 'Chiếc hàm băng khổng lồ há to nuốt chửng kẻ thù vào mùa đông vĩnh cửu.'
    },
    373: {
      name: 'Mega Salamence', stone: 'Salamencite', stoneVi: 'Đá Salamencite',
      types: ['dragon', 'flying'], ability: 'Aerilate',
      hp: 115, pa: 1.65, sa: 1.40, df: 140, sd: 100, spd: 130, bst: 700,
      desc: 'Đôi cánh hình lưỡi liềm đỏ chém đứt không khí như phi thuyền chiến đấu.'
    },
    376: {
      name: 'Mega Metagross', stone: 'Metagrossite', stoneVi: 'Đá Metagrossite',
      types: ['steel', 'psychic'], ability: 'Tough Claws',
      hp: 110, pa: 1.65, sa: 1.25, df: 160, sd: 120, spd: 120, bst: 700,
      desc: 'Siêu máy tính hợp thể 8 cánh tay sắt, tính toán hạ gục mục tiêu hoàn hảo.'
    },
    380: {
      name: 'Mega Latias', stone: 'Latiasite', stoneVi: 'Đá Latiasite',
      types: ['dragon', 'psychic'], ability: 'Levitate',
      hp: 110, pa: 1.20, sa: 1.60, df: 130, sd: 160, spd: 120, bst: 700,
      desc: 'Phi cơ rồng huyền thoại với trường phòng ngự tâm linh bất khả xâm phạm.'
    },
    381: {
      name: 'Mega Latios', stone: 'Latiosite', stoneVi: 'Đá Latiosite',
      types: ['dragon', 'psychic'], ability: 'Levitate',
      hp: 110, pa: 1.50, sa: 1.80, df: 110, sd: 130, spd: 120, bst: 700,
      desc: 'Tốc độ vượt âm thanh xé toạc bầu trời phóng ra làn sóng rồng hủy diệt.'
    },
    382: {
      name: 'Primal Kyogre', stone: 'Blue Orb', stoneVi: 'Ngọc Lam Cổ Đại',
      types: ['water'], ability: 'Primordial Sea',
      hp: 120, pa: 1.70, sa: 2.00, df: 100, sd: 170, spd: 100, bst: 770,
      desc: 'Biến đổi Nguyên thủy triệu hồi mưa bão cổ xưa nhấn chìm lục địa.'
    },
    383: {
      name: 'Primal Groudon', stone: 'Red Orb', stoneVi: 'Ngọc Đỏ Cổ Đại',
      types: ['ground', 'fire'], ability: 'Desolate Land',
      hp: 120, pa: 2.00, sa: 1.70, df: 170, sd: 100, spd: 100, bst: 770,
      desc: 'Biến đổi Nguyên thủy khoác lên hệ Lửa thiêu rụi đại dương tạo dựng đất mẹ.'
    },
    384: {
      name: 'Mega Rayquaza', stone: 'Meteorite', stoneVi: 'Đá Thiên Thạch',
      types: ['dragon', 'flying'], ability: 'Delta Stream',
      hp: 125, pa: 2.00, sa: 2.00, df: 110, sd: 110, spd: 125, bst: 780,
      desc: 'Thần rồng thượng tầng khí quyển thống trị gió bão với sức mạnh tuyệt đối.'
    },

    // Gen 4
    428: {
      name: 'Mega Lopunny', stone: 'Lopunnite', stoneVi: 'Đá Lopunnite',
      types: ['normal', 'fighting'], ability: 'Scrappy',
      hp: 95, pa: 1.56, sa: 0.60, df: 104, sd: 106, spd: 145, bst: 580,
      desc: 'Thức tỉnh năng khiếu quyền cước Giác Đấu, tung cước đánh trúng cả bóng ma.'
    },
    445: {
      name: 'Mega Garchomp', stone: 'Garchompite', stoneVi: 'Đá Garchompite',
      types: ['dragon', 'ground'], ability: 'Sand Force',
      hp: 118, pa: 1.90, sa: 1.40, df: 125, sd: 105, spd: 102, bst: 700,
      desc: 'Cánh tay biến thành lưỡi hái sắc lẹm, càn quét mặt đất như cơn bão dữ.'
    },
    448: {
      name: 'Mega Lucario', stone: 'Lucarionite', stoneVi: 'Đá Lucarionite',
      types: ['fighting', 'steel'], ability: 'Adaptability',
      hp: 100, pa: 1.65, sa: 1.60, df: 98, sd: 80, spd: 122, bst: 625,
      desc: 'Khí công Ba Động Aura bao phủ nắm đấm thép, bộc phát đòn đánh chí mạng.'
    },
    460: {
      name: 'Mega Abomasnow', stone: 'Abomasite', stoneVi: 'Đá Abomasite',
      types: ['grass', 'ice'], ability: 'Snow Warning',
      hp: 110, pa: 1.52, sa: 1.52, df: 115, sd: 115, spd: 40, bst: 594,
      desc: 'Người tuyết khổng lồ với hai măng đá băng giá trên lưng tạo bão tuyết.'
    },
    475: {
      name: 'Mega Gallade', stone: 'Galladite', stoneVi: 'Đá Galladite',
      types: ['psychic', 'fighting'], ability: 'Inner Focus',
      hp: 98, pa: 1.85, sa: 0.75, df: 105, sd: 125, spd: 120, bst: 618,
      desc: 'Hiệp sĩ song kiếm thanh tú với đôi kiếm tay sắc bén bảo vệ đồng đội.'
    },

    // Gen 5
    531: {
      name: 'Mega Audino', stone: 'Audinite', stoneVi: 'Đá Audinite',
      types: ['normal', 'fairy'], ability: 'Healer',
      hp: 123, pa: 0.70, sa: 1.00, df: 136, sd: 136, spd: 60, bst: 545,
      desc: 'Khoác thêm hệ Tiên thanh khiết, sóng âm xoa dịu vết thương và hồi máu.'
    },

    // Gen 6
    719: {
      name: 'Mega Diancie', stone: 'Diancite', stoneVi: 'Đá Diancite',
      types: ['rock', 'fairy'], ability: 'Magic Bounce',
      hp: 80, pa: 1.80, sa: 1.80, df: 120, sd: 120, spd: 120, bst: 700,
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
    // Kiểm tra đã có đá và đã trang bị
    const eq = (s.megaEquip && s.megaEquip[dex]) || (hasStone(dex) ? (getForms(dex)[0].form || 'default') : null);
    return !!eq && hasStone(dex, eq);
  }

  // Thực hiện Tiến hóa Mega trong trận đấu
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
    pl.moveRadiusMul = (pl.moveRadiusMul || 1) * 1.30; // Tăng 30% bán kính nổ & kích thước chiêu
    
    // Tăng máu và hồi phục đầy máu thức tỉnh
    pl.maxHp = Math.round(pl.maxHp * 1.35);
    pl.hp = pl.maxHp;

    // Tăng nhẹ kích thước thể hiện dạng Mega bề thế
    pl.scale *= 1.18;
    if (pl.anim) pl.anim.scale = pl.scale;
    pl.r *= 1.15;
    pl.bodyH *= 1.15;

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

  // Danh sách toàn bộ các mã dex có thể làm Mega Rift Boss
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
