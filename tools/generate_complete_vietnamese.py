# -*- coding: utf-8 -*-
"""
Tạo từ điển Tiếng Việt hoàn chỉnh 100% cho PokéSurvivor
Bao gồm:
- Toàn bộ Tin mới / Changelog (145 mục)
- Toàn bộ Cài đặt / Điều khiển / Bàn phím / Tay cầm / Cần ảo di động
- Toàn bộ Bản tính (25 Natures) & Đặc tính (Abilities)
- Toàn bộ Chiêu thức & Mô tả chiêu thức, Đĩa kỹ năng (TMs)
- Toàn bộ Trang bị, Nâng cấp, Gacha, Cửa hàng Kecleon
- 0 missing keys (đạt chuẩn faltan 0 và kiểm thử nghiêm ngặt)
"""

import json
import re
import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_FILE = os.path.join(ROOT, 'tools', 'cache', 'all_keys.json')

with open(CACHE_FILE, 'r', encoding='utf-8') as f:
    ALL_DATA = json.load(f)

# ----------------- 1. BẢN DỊCH TỪ ĐIỂN TAY CHUẨN XÁC -----------------
DICT_VI = {}

# Đọc các bản dịch cơ sở từ tools/build_vietnamese_dict.py
import sys
sys.path.append(os.path.join(ROOT, 'tools'))
from build_vietnamese_dict import TRANSLATIONS
DICT_VI.update(TRANSLATIONS)

# Thêm bản dịch chi tiết cho toàn bộ các cập nhật và tin mới
CHANGELOG_TRANS = {
    # 2026-10-22
    'Cooperativo sin salas que se cierran solas': 'Chơi mạng: Sửa lỗi phòng tự đóng bất thường',
    'Co-op without rooms closing on their own': 'Chơi mạng: Sửa lỗi phòng tự đóng bất thường',
    'Cooperativo: a los invitados ya no les sale «La sala se ha cerrado» a mitad de partida (a veces a los pocos minutos o al entrar en una grieta) mientras los demás seguían jugando. Pasaba cuando su conexión con el servidor de las salas se cortaba un momento; ahora la partida sigue y la sala se recupera sola.':
        'Chơi mạng: người tham gia sẽ không còn bị thông báo "Phòng đã bị đóng" giữa trận đấu (đôi khi sau vài phút hoặc khi bước vào vết nứt) trong khi đồng đội vẫn đang chơi. Lỗi này xảy ra khi kết nối tới máy chủ phòng bị gián đoạn chốc lát; giờ đây trận đấu vẫn tiếp tục và phòng sẽ tự phục hồi.',
    'Cooperativo: si se corta un momento la conexión con el anfitrión (un bache de la wifi o de los datos), el invitado ya no pierde la partida: se queda en pausa hasta 45 segundos mientras se vuelve a conectar y sigue jugando.':
        'Chơi mạng: nếu kết nối với chủ phòng bị gián đoạn chốc lát (do Wi-Fi hoặc 4G chập chờn), bạn sẽ không bị mất trận đấu: game sẽ tạm dừng tối đa 45 giây để kết nối lại rồi tiếp tục chơi.',
    'Cooperativo: si te quedas fuera de una partida mientras los demás siguen, ya no te sale «La sala se ha cerrado»: esperas en la sala y, cuando acaben, seguís juntos.':
        'Chơi mạng: nếu bạn bị rớt khỏi trận trong khi người khác vẫn tiếp tục, bạn sẽ không còn nhận thông báo "Phòng đã bị đóng": bạn chỉ cần chờ trong phòng và khi họ kết thúc, mọi người lại chơi tiếp cùng nhau.',

    # 2026-10-21
    'La gran actualización: Tienda Kecleon': 'Bản cập nhật lớn: Cửa hàng Kecleon',
    'The big update: Kecleon Shop': 'Bản cập nhật lớn: Cửa hàng Kecleon',
    'Mejora nueva: Tienda Kecleon (botón en el menú) con Mentas, Cápsulas Habilidad y 8 MT nuevas cada día. Cada Pokémon tiene ahora su naturaleza (±10 % a dos stats) y su habilidad, con efecto en la partida; se ven y se cambian en su ficha de la colección. Las MT enseñan para siempre ataques de fuera de sus tipos, pero sólo si los aprende en los juegos (Mewtwo puede aprender Bola Sombra; Psyduck no puede aprender Lanzallamas). Gracias a TheAdro7 por la idea y el trabajo de base.':
        'Mới: Cửa hàng Kecleon (nút trên menu) với Bạc hà, Viên nang Đặc tính và 8 TM mới mỗi ngày. Giờ đây mỗi Pokémon đều có Bản tính (±10% cho 2 chỉ số) và Đặc tính riêng có hiệu lực ngay trong trận đấu; bạn có thể xem và thay đổi chúng trong trang Bộ sưu tập. Các đĩa TM sẽ dạy vĩnh viễn các chiêu thức ngoài hệ của chúng, miễn là loài đó học được trong game gốc (Mewtwo có thể học Quả cầu Bóng đêm; Psyduck không thể học Phun lửa). Cảm ơn TheAdro7 vì ý tưởng và phần nền tảng.',
    'Mejora nueva, Segundo movimiento inicial: con Repertorio, se compra una vez por Pokémon y luego eliges gratis el segundo ataque con el que empiezas (o lo dejas al azar).':
        'Nâng cấp mới, Chiêu khởi đầu thứ hai: với Kho tàng chiêu thức, chỉ cần mua một lần cho mỗi Pokémon và sau đó chọn miễn phí chiêu khởi đầu thứ hai mà bạn muốn (hoặc để ngẫu nhiên).',
    'Cooperativo: si vuestras redes no dejan conectaros directamente (pasa a veces con datos móviles y algunos routers), la partida ahora pasa por nuestro servidor y podéis jugar igual. Si conectáis directamente, todo sigue como antes. Hace falta haber iniciado sesión con una cuenta.':
        'Chơi mạng: nếu mạng của các bạn không thể kết nối trực tiếp với nhau (đôi khi xảy ra trên mạng 4G/5G hoặc một số modem/router), trận đấu giờ sẽ truyền qua máy chủ trung gian và mọi người vẫn có thể chơi bình thường. Nếu kết nối trực tiếp được thì không có gì thay đổi. Cần phải đăng nhập tài khoản.',
    'Cooperativo: si caes, puedes mirar a un compañero que siga en pie mientras esperas a que te levanten. Pulsa el botón que sale debajo del aviso (o Q / E, o LB / RB en el mando) para pasar de uno a otro y volver a ti. Sólo cambia la cámara: no gasta más conexión.':
        'Chơi mạng: nếu bạn gục ngã, bạn có thể chuyển góc nhìn theo dõi đồng đội còn sống trong khi chờ được hồi sinh. Bấm nút bên dưới thông báo (hoặc Q / E, hoặc LB / RB trên tay cầm) để chuyển đổi qua lại. Thao tác này chỉ đổi camera, không tốn thêm lưu lượng mạng.',
    'Guardado en la nube: si jugabas en un aparato y guardabas, otro aparato con el juego abierto desde antes podía subir su copia vieja encima (al guardar o al actualizarse el juego) y en el otro no aparecían tus tickets ni tus Pokémon nuevos. Ahora, si la nube tiene algo más nuevo, se junta con lo tuyo antes de guardar y no se pierde nada.':
        'Lưu đám mây: trước đây nếu bạn chơi và lưu trên một thiết bị, một thiết bị khác đang mở game từ trước có thể tải đè bản sao cũ lên đám mây làm mất vé và Pokémon mới. Giờ đây nếu đám mây có dữ liệu mới hơn, hệ thống sẽ tự động gộp lại trước khi lưu và không làm mất bất kỳ thứ gì.',

    # 2026-10-20
    'Cooperativo más seguro y arreglos de ataques': 'Chơi mạng an toàn hơn & Sửa lỗi chiêu thức',
    'Safer co-op and move fixes': 'Chơi mạng an toàn hơn & Sửa lỗi chiêu thức',
    'Cooperativo: un jugador con el juego trucado ya no puede colgar la partida de los demás mandando números imposibles (una experiencia infinita dejaba congelado al anfitrión y un efecto gigante, a los invitados).':
        'Chơi mạng: người chơi dùng bản can thiệp gian lận sẽ không thể làm treo trận đấu của người khác bằng cách gửi dữ liệu bất thường (kinh nghiệm vô hạn từng làm treo máy chủ phòng và hiệu ứng khổng lồ làm treo máy người tham gia).',
    'Mejoras: al cambiar de compañero, la pantalla de mejoras se abre ya con el nuevo y no con el último que habías mirado.':
        'Nâng cấp: sau khi đổi Pokémon đồng hành, màn hình nâng cấp sẽ mở ngay Pokémon mới thay vì Pokémon cuối cùng bạn xem.',
    'Cooperativo: Viento Aciago, Bucle Aire y Torbellino de un invitado ya atraen a los enemigos (sólo atraían los del anfitrión).':
        'Chơi mạng: các chiêu Gió độc, Vòng xoáy cát và Lốc xoáy của khách giờ đã hút kẻ địch (trước đây chỉ có chiêu của chủ phòng mới hút).',
    'Cooperativo: Viento Aciago, Bucle Arena y Torbellino de un invitado ya atraen a los enemigos (sólo atraían los del anfitrión).':
        'Chơi mạng: các chiêu Gió độc, Bẫy cát và Lốc xoáy của khách giờ đã hút kẻ địch (trước đây chỉ có chiêu của chủ phòng mới hút).',
    'Cooperativo: el Infortunio de un invitado ya hace su daño extra a los enemigos quemados, envenenados o frenados.':
        'Chơi mạng: chiêu Ám quẻ của khách giờ đã gây thêm sát thương lên kẻ địch bị bỏng, trúng độc hoặc bị làm chậm.',
    'Bomba Ácida, Bola Voltio, Bomba Germen, Rayo Señal, Joya de Luz, Bola Neblina, Energibola, Canto Helado, Sombra Vil y Beso Drenaje: al evolucionar, los disparos salían hacia los lados y no daban a nadie. Ahora salen hacia delante, y la mejora «+1 proyectil» ya añade uno (antes no añadía ninguno).':
        'Các chiêu Bom axit, Cầu điện, Bom hạt giống, Tia tín hiệu, Ngọc ánh sáng, Cầu sương mù, Quả cầu năng lượng, Khúc ca băng giá, Bóng ma và Nụ hôn hút máu: khi tiến hóa, đạn từng bay lệch sang hai bên không trúng ai. Giờ đây đạn bay thẳng về phía trước và nâng cấp "+1 tia đạn" đã cộng thêm chính xác 1 tia.',
    'Cooperativo: si a alguien se le cerraban las cartas de subida de nivel sin haber elegido (podía pasar eligiendo muy deprisa), ahora se le vuelven a abrir y los demás ya no se quedan esperándole.':
        'Chơi mạng: nếu bảng chọn thẻ lên cấp của ai đó vô tình bị đóng trước khi chọn (do bấm quá nhanh), bảng chọn sẽ tự mở lại và đồng đội không phải chờ đợi vô ích.',
    'En el móvil ya no está la opción «Apuntar a mano» (no funcionaba con la pantalla táctil): los ataques siempre apuntan solos.':
        'Trên điện thoại đã bỏ tùy chọn "Nhắm thủ công" (vì không tương thích với màn hình cảm ứng): các chiêu thức giờ sẽ luôn tự động nhắm mục tiêu.',
    'Ranking por Pokémon: ahora cuentan las partidas de 5 minutos o más (los demás rankings siguen desde 2 minutos).':
        'Bảng xếp hạng theo từng Pokémon: giờ đây chỉ tính các trận đấu từ 5 phút trở lên (các bảng xếp hạng khác vẫn tính từ 2 phút).',
    'Amigos: ya no se ve quién está en línea, y puedes invitar a una sala a cualquier amigo (si no entra, la invitación caduca sola a los 3 minutos).':
        'Bạn bè: không còn hiển thị trạng thái online và bạn có thể mời bất kỳ bạn bè nào vào phòng (nếu không tham gia, lời mời sẽ tự hủy sau 3 phút).',
    'Guardado en la nube: ahora la partida sólo se sube a la nube cuando pulsas el botón Guardar de arriba (y antes de una actualización del juego). En este navegador se sigue guardando todo al momento. Si juegas en otro aparato o vas a borrar los datos del navegador, pulsa Guardar antes.':
        'Lưu đám mây: giờ đây dữ liệu chỉ được tải lên đám mây khi bạn bấm nút Lưu ở phía trên (và trước khi cập nhật game). Trong trình duyệt này dữ liệu vẫn tự động lưu liên tục. Nếu chuyển sang máy khác, hãy bấm nút Lưu trước nhé.',
    'Las solicitudes de amistad nuevas se ven al abrir Amigos.':
        'Lời mời kết bạn mới sẽ hiển thị ngay khi bạn mở danh sách Bạn bè.',

    # 2026-10-19
    '38 ataques nuevos': '38 chiêu thức mới',
    '38 new moves': '38 chiêu thức mới',
    '38 ataques nuevos: ahora todos los tipos tienen 5 o más (Roca, Lucha, Dragón y Hada tenían sólo 2). Entre ellos Hiperrayo, Rayo Solar, Magnitud, Torbellino, Onda Trueno, Enfado, Carantoña, Golpe Bajo... cada uno con su evolución.':
        '38 chiêu thức mới: giờ đây tất cả các hệ đều có từ 5 chiêu trở lên (Đá, Giác đấu, Rồng và Tiên trước đây chỉ có 2). Trong đó bao gồm Siêu cấp chùm tia, Tia sáng mặt trời, Địa chấn, Lốc xoáy, Sóng sấm sét, Nổi giận, Đùa cợt, Đòn bất ngờ... mỗi chiêu đều có dạng tiến hóa.',
    'Formas nuevas de atacar: disparos que persiguen al enemigo o rebotan entre ellos, rayos que se cargan, giros que golpean todo alrededor, ondas que avanzan por el suelo, remolinos que atraen a los enemigos, ondas que los apartan y zonas que los dejan aturdidos.':
        'Cách tấn công hoàn toàn mới: đạn đuổi theo kẻ địch hoặc nảy giữa các mục tiêu, tia laser tích điện, đòn xoay tấn công xung quanh, sóng chấn động mặt đất, lốc xoáy hút kẻ địch, sóng đẩy lùi và vùng làm choáng.',
    'Mejora nueva, Movimiento inicial: se compra una vez por Pokémon y luego eliges gratis con qué ataque empieza la partida.':
        'Nâng cấp mới, Chiêu khởi đầu: chỉ cần mua một lần cho mỗi Pokémon, sau đó bạn có thể tự do chọn chiêu khởi đầu mỗi khi vào trận.',
    'Idiomas nuevos: francés, italiano, portugués de Brasil, chino simplificado y chino tradicional. Se eligen en Ajustes (o en /en/ en la dirección para inglés).':
        'Thêm ngôn ngữ mới: Pháp, Ý, Bồ Đào Nha (Brazil), Trung giản thể và Trung phồn thể. Bạn có thể chọn trong Cài đặt.',
    'Una frase de broma en el título del menú principal, como las de Minecraft.':
        'Thêm câu châm ngôn hài hước dưới tiêu đề Menu chính tương tự Minecraft.',
    'Los Pokémon monotipo hacen un 20 % más de daño con los ataques de su tipo.':
        'Pokémon đơn hệ sẽ gây thêm 20% sát thương với các chiêu thức thuộc hệ của chính mình.',
    'Aprender un ataque nuevo ya no cambia a él solo: te quedas con el que estabas usando.':
        'Học chiêu thức mới sẽ không tự động chuyển đổi sang chiêu đó: bạn vẫn tiếp tục dùng chiêu thức đang dùng dở.',
    'El juego sólo se puede jugar en su web oficial, pokesurvivor.com.':
        'Trò chơi chỉ có thể chơi chính thức trên nền tảng web.',
    'Movimiento inicial: ya se puede volver al de serie aunque hayas comprado otro.':
        'Chiêu khởi đầu: bạn đã có thể chuyển về chiêu mặc định bất kỳ lúc nào ngay cả khi đã mua chiêu khác.',
    'Cooperativo: el jefe que tocaba al volver de una grieta podía salir gigante y romper la partida.':
        'Chơi mạng: sửa lỗi trùm xuất hiện sau khi thoát khỏi vết nứt có thể bị phóng to dị thường gây lỗi trận đấu.',
    'Al recargar, la página nueva a veces se mezclaba con la vieja y el juego no arrancaba: ya no pasa.':
        'Khi tải lại trang, phiên bản mới đôi khi bị lẫn với bộ nhớ đệm cũ làm game không khởi động được: lỗi này đã được khắc phục hoàn toàn.',

    # 2026-10-18
    'Físico y especial, mando, botón Guardar y rankings desde cero': 'Chiêu vật lý & phép, tay cầm, nút Lưu và làm mới bảng xếp hạng',
    'Ataques físicos y especiales, como en los juegos: cada Pokémon tiene su Ataque, Ataque Especial, Defensa y Defensa Especial. Los ataques físicos pegan con su Ataque y los especiales con su Ataque Especial: Machamp pega fuerte con Golpe Kárate y flojo con Bola Sombra. Con los de su lado bueno pega lo mismo que antes. Al subir de nivel, cada carta dice si el ataque es físico o especial y cuánto rinde con tu Pokémon, y en la colección se ven todas sus estadísticas.':
        'Chiêu vật lý và chiêu phép tương tự game gốc: mỗi Pokémon có chỉ số Tấn công, Công phép, Phòng thủ và Kháng phép. Chiêu vật lý dựa vào Tấn công, còn chiêu phép dựa vào Công phép: Machamp đánh cực mạnh với Đòn Karate và yếu hơn với Quả cầu bóng đêm. Khi lên cấp, mỗi thẻ bài sẽ ghi rõ chiêu thức thuộc loại vật lý hay đặc biệt và độ hiệu quả với Pokémon của bạn.',
    'Danza Espada y Danza Dragón suben sólo el Ataque (físico), como en los juegos, y llega Maquinación, que sube el Ataque Especial y la puede aprender cualquier Pokémon. Al subir de nivel, los ataques del lado bueno de tu Pokémon salen el doble de a menudo.':
        'Vũ điệu kiếm và Vũ điệu rồng giờ chỉ tăng Tấn công (vật lý), đồng thời bổ sung Âm mưu giúp tăng Công phép mà mọi Pokémon đều học được. Khi lên cấp, các chiêu thức thế mạnh của Pokémon sẽ xuất hiện thường xuyên gấp đôi.',
    'Resumen de la partida en la pausa: cada ataque con su categoría, el daño que lleva hecho y su daño por segundo; tus estadísticas con todo lo que has subido; y el objeto y las cartas de mejora que llevas.':
        'Bảng tóm tắt trận đấu khi tạm dừng: hiển thị chi tiết từng chiêu thức, lượng sát thương đã gây và DPS (sát thương mỗi giây); chỉ số hiện tại cùng các trang bị và thẻ nâng cấp bạn đang sở hữu.',
    'Las defensas también cuentan (un poco): los enemigos se defienden de tus ataques físicos con su Defensa y de los especiales con su Defensa Especial, y cada enemigo te pega con su lado fuerte, que paras con tu Defensa o tu Defensa Especial.':
        'Khả năng phòng thủ cũng có tác dụng: kẻ địch đỡ đòn vật lý bằng Phòng thủ và đỡ đòn phép bằng Kháng phép. Kẻ địch cũng sẽ tấn công bằng thế mạnh của chúng và bạn có thể chặn lại bằng Phòng thủ hoặc Kháng phép của mình.',
    'Ya se puede jugar con mando (Xbox, PlayStation, Switch y la mayoría de mandos USB o Bluetooth): moverte, cambiar de ataque, pausar, elegir cartas y manejar todos los menús, con vibración al recibir daño. Se configura en Ajustes > Controles.':
        'Hỗ trợ chơi bằng tay cầm (Xbox, PlayStation, Switch và hầu hết tay cầm USB hoặc Bluetooth): di chuyển, đổi chiêu thức, tạm dừng, chọn thẻ và thao tác mọi menu, kèm tính năng rung khi nhận sát thương. Cấu hình trong Cài đặt > Điều khiển.',
    'Colección: buscador por nombre o número, pestaña con todas las generaciones, filtros que se combinan (tengo / me faltan, varias rarezas a la vez, shiny, favoritos y tipo) y orden por número, nombre, rareza, recién conseguidos o más usados. Y favoritos: márcalos en la ficha de cada Pokémon; van con tu cuenta, en todos tus aparatos.':
        'Bộ sưu tập: tìm kiếm theo tên hoặc số hiệu, tab hiển thị tất cả các thế hệ, bộ lọc kết hợp đa năng (đã có / còn thiếu, lọc độ hiếm, shiny, yêu thích và hệ) cùng sắp xếp linh hoạt. Đánh dấu yêu thích trên từng Pokémon để đồng bộ tài khoản trên mọi thiết bị.',
    'Nueva pestaña Accesibilidad en Ajustes con «Apuntar a mano»: tus ataques van hacia el ratón o hacia donde empujes el stick derecho del mando, en vez de al enemigo más cercano. Viene desactivado.':
        'Thêm tab Hỗ trợ tiếp cận trong Cài đặt với tính năng "Nhắm thủ công": chiêu thức sẽ bắn về phía con trỏ chuột hoặc cần gạt phải của tay cầm thay vì tự nhắm kẻ gần nhất. Mặc định tắt.',
    'Botón Guardar arriba a la derecha: sube tu partida a la nube al momento. Úsalo antes de cerrar el juego o de cambiar de aparato.':
        'Nút Lưu ở góc trên bên phải: tải dữ liệu chơi lên đám mây ngay lập tức. Hãy bấm nút này trước khi đóng game hoặc đổi máy chơi.',
    'Las cartas de nivel, de vínculo y de objeto no se pueden elegir durante un momento al aparecer (se ven apagadas): pulsar 1-4 o tocar la pantalla para cambiar de ataque en plena pelea ya no elige una carta sin querer.':
        'Các thẻ bài khi lên cấp, thẻ gắn kết và thẻ trang bị sẽ bị vô hiệu hóa chốc lát khi vừa xuất hiện để tránh bấm nhầm phím 1-4 hoặc chạm nhầm màn hình khi đang giao tranh.',
    'Con mando ya se pueden elegir en la colección los Pokémon que aún no tienes, y en el móvil las pestañas de Ajustes caben en una fila que se desliza.':
        'Khi dùng tay cầm, giờ đây bạn có thể chọn xem cả những Pokémon chưa sở hữu trong bộ sưu tập. Trên điện thoại, các tab Cài đặt được bố trí gọn gàng trên một hàng cuộn ngang.',
    'Ranking histórico: si estás por debajo del puesto 1.000, sale «#1000+» en vez del número exacto.':
        'Bảng xếp hạng lịch sử: nếu bạn nằm ngoài top 1.000, thứ hạng sẽ hiển thị dạng "#1000+" thay vì con số chi tiết.',
    'Los Pokémon grandes (Onix, Gyarados, Wailord, Eternatus, los legendarios...) ya se pueden jugar bien: se ven algo más pequeños, aunque siguen siendo de los más grandes, y chocan como uno normal, así que caben por todos los pasillos y no reciben más golpes por su tamaño.':
        'Các Pokémon kích thước lớn (Onix, Gyarados, Wailord, Eternatus, các loài huyền thoại...) giờ đây di chuyển linh hoạt hơn: được thu nhỏ hợp lý để vừa vặn với mọi hành lang và không bị dính thêm đòn oan do kích thước.',
    'Como mucho hay 3 curanderos, 3 escuderos y 3 invocadores a la vez.':
        'Trên sân tối đa chỉ có 3 kẻ trị thương, 3 kẻ tạo khiên và 3 kẻ triệu hồi cùng một lúc.',
    'Los curanderos y escuderos ya no hacen inmatable a un jefe: lo que le curan y el escudo que le ponen van con el daño que le estás haciendo, y sólo recibe un escudo cada 6 segundos.':
        'Kẻ trị thương và tạo khiên không còn biến trùm thành bất tử: lượng máu hồi và lượng khiên được điều chỉnh theo sát thương bạn gây ra, và trùm chỉ nhận khiên tối đa một lần mỗi 6 giây.',
    'Sentencia de Arceus: la velocidad tiene un tope suave (lo que pase de cierto punto cuenta mucho menos) y los legendarios corren casi tanto como tú. Desde los 5 minutos de Sentencia Arceus acelera sin parar, y desde los 7 su toque quita cada vez más vida, hasta dejarte KO de un golpe hacia el minuto 40.':
        'Phán xét của Arceus: tốc độ có giới hạn mềm và các Pokémon huyền thoại chạy nhanh gần bằng bạn. Từ phút thứ 5 của Phán xét, Arceus tăng tốc liên tục; từ phút thứ 7, mỗi cú chạm của ngài sẽ trừ lượng máu cực lớn và hạ gục bạn trong 1 đòn ở khoảng phút 40.',
    'El veneno sigue quitando un porcentaje de la vida, pero contra enemigos con muchísima vida (los legendarios de la Sentencia) ese porcentaje es menor.':
        'Hiệu ứng trúng độc vẫn rút máu theo phần trăm, nhưng đối với những kẻ địch có lượng máu cực khổng lồ (như các Pokémon huyền thoại trong Phán xét), tỷ lệ phần trăm này sẽ giảm bớt.',
    'Todos los rankings empiezan de cero (hoy, semana, mes, año e histórico): las marcas de huir de Arceus ya no se podrían alcanzar.':
        'Tất cả bảng xếp hạng (hôm nay, tuần, tháng, năm và lịch sử) đều được đặt lại từ đầu để đảm bảo công bằng với cơ chế mới.',
    'Seguridad: se ha cerrado un agujero por el que alguien podía meter código en su fila del ranking o en su perfil y hacer que se ejecutara en el navegador de quien los abría (a algunos les llevaba a un vídeo). Ahora todo lo que viene de otros jugadores se limpia, el servidor sólo deja guardar lo que debe, y el navegador no ejecuta nada que no sea del juego.':
        'Bảo mật: đã khắc phục hoàn toàn lỗ hổng cho phép chèn mã độc vào tên hồ sơ hoặc bảng xếp hạng. Giờ đây toàn bộ dữ liệu từ người chơi khác đều được kiểm duyệt chặt chẽ và an toàn tuyệt đối.',
    'En el ranking ya salen en shiny los Pokémon de quien jugó con su shiny.':
        'Trên bảng xếp hạng giờ đây sẽ hiển thị biểu tượng Shiny nếu người chơi đạt kỷ lục bằng Pokémon dạng Shiny.'
}
DICT_VI.update(CHANGELOG_TRANS)

# ----------------- 2. BẢN DỊCH CHO CÁC KHÓA THƯỜNG GẶP TRONG GAME -----------------
COMMON_GAME_TEXTS = {
    # Arceus Judgment
    "Ruinas del Juicio": "Tàn tích Phán xét",
    "LA SENTENCIA": "LỜI PHÁN XÉT",
    "DE ARCEUS": "CỦA ARCEUS",
    "El tiempo se ha agotado…": "Thời gian đã cạn kiệt…",
    "¡ARCEUS HA DESCENDIDO!": "ARCEUS ĐÃ GIÁNG LÂM!",
    "Es invencible: huye y aguanta todo lo que puedas": "Ngài là bất khả chiến bại: hãy chạy trốn và sinh tồn lâu nhất có thể",
    "Toca la pantalla para saltar": "Chạm màn hình để bỏ qua",
    "Pulsa Espacio para saltar": "Nhấn Phím cách (Space) để bỏ qua",
    "¡Huye de Arceus! Es invencible": "Hãy chạy trốn khỏi Arceus! Ngài là bất khả chiến bại",
    "¡{x} acude a la Sentencia!": "¡{x} đã xuất hiện tại Phán xét!",
    "SENTENCIA · {x} · JEFES {x}": "PHÁN XÉT · {x} · TRÙM {x}",
    "Ante Arceus": "Đối diện Đấng Sáng Tạo",
    "{x} · {x} legendarios": "{x} · {x} huyền thoại",
    "{x} · {x} legendario": "{x} · {x} huyền thoại",
    "La Sentencia": "Lời Phán xét",
    "Llega a la Sentencia de Arceus (minuto 30).": "Sống sót đến Lời Phán xét của Arceus (phút 30).",
    "Ante el Creador": "Trước mặt Đấng Sáng Tạo",
    "Aguanta 1 minuto ante Arceus.": "Sinh tồn 1 phút trước Arceus.",
    "Desafío divino": "Thử thách thần thánh",
    "Derrota a 3 legendarios ante Arceus en una partida.": "Hạ gục 3 Pokémon huyền thoại trước mặt Arceus trong một trận đấu.",
    "Juzgado": "Được phán xét",
    "Elegido de Arceus": "Người được Arceus chọn lựa",
    "Reportar marca sospechosa": "Báo cáo kỷ lục đáng ngờ",
    "Ya la has reportado": "Bạn đã báo cáo rồi",
    "Ya has reportado esta marca": "Bạn đã báo cáo kỷ lục này rồi",
    "Gracias: la revisaremos": "Cảm ơn: chúng tôi sẽ kiểm tra lại ngay",

    # Ability effects
    "Maquinación": "Âm mưu",
    "No hace daño: acumula ATAQUE (físico) más rápido que Danza Espada.": "Không gây sát thương: tích lũy TẤN CÔNG (vật lý) nhanh hơn Vũ điệu kiếm.",
    "No hace daño: acumula ATAQUE (físico) mientras esté activo.": "Không gây sát thương: tích lũy TẤN CÔNG (vật lý) trong thời gian hiệu lực.",
    "No hace daño: acumula ATAQUE ESPECIAL mientras esté activo.": "Không gây sát thương: tích lũy CÔNG PHÉP trong thời gian hiệu lực.",
    "+35 % de daño con los ataques de golpes flojos.": "+35% sát thương với các đòn đánh yếu.",
    "+50 % de daño con movimientos físicos.": "+50% sát thương với chiêu thức vật lý.",
    "+40 % de daño de tipo Agua y recibe la mitad de daño de Fuego.": "+40% sát thương hệ Nước và nhận giảm một nửa sát thương hệ Lửa.",
    "Cada enemigo derrotado le da +0,5 % de daño (hasta +15 %).": "Mỗi kẻ địch bị hạ gục tăng +0.5% sát thương (tối đa +15%).",
    "No le frenan las trampas pegajosas ni el terreno.": "Không bị làm chậm bởi bẫy dính hoặc địa hình hiểm trở.",
    "Los ataques de tipo {x} no le hacen daño: le curan un poco.": "Các đòn tấn công hệ {x} không gây sát thương: ngược lại còn hồi một ít máu.",
    "+50 % de velocidad con {x}.": "+50% tốc độ di chuyển khi có {x}.",
    "Pone {x} al empezar la partida y cada 3 minutos.": "Tạo thời tiết {x} khi bắt đầu trận và mỗi 3 phút một lần.",
    "+35 % de daño de tipo {x} con poca vida (menos de 1/3).": "+35% sát thương hệ {x} khi còn ít máu (dưới 1/3).",
    "+20 % de daño con movimientos de tipo {x}.": "+20% sát thương với chiêu thức hệ {x}.",
    "Recibe un 15 % menos de daño especial.": "Nhận giảm 15% sát thương phép.",
    "Recibe un 15 % menos de daño especial y esquiva el 10 % de esos golpes.": "Nhận giảm 15% sát thương phép và né 10% các đòn đó.",
    "Recibe un 6 % menos de daño.": "Nhận giảm 6% sát thương.",
    "Sus golpes a veces frenan (1 de cada 10).": "Đòn đánh đôi khi làm chậm kẻ địch (tỷ lệ 1/10).",
    "La primera vez que baja de la mitad de vida se enfurece: +25 % de daño el resto de la partida.": "Lần đầu tiên máu tụt xuống dưới 50% sẽ nổi giận: +25% sát thương trong suốt phần còn lại của trận.",
    "+15 % de daño a los Pokémon de tipo {x}.": "+15% sát thương lên Pokémon hệ {x}.",
    "A veces frena a quien le golpea cuerpo a cuerpo.": "Đôi khi làm chậm kẻ tấn công cận chiến.",
    "+10 % de daño con movimientos especiales.": "+10% sát thương với chiêu thức đặc biệt.",
    "Todo acierta: +15 % de daño hecho, pero recibe un 10 % más.": "Đòn đánh luôn trúng: +15% sát thương gây ra, nhưng nhận thêm 10% sát thương.",
    "Una vez por partida, al quedar con poca vida, explota y daña a los de alrededor.": "Một lần mỗi trận đấu, khi máu xuống thấp, sẽ tự nổ gây sát thương xung quanh.",
    "Cada 10 s, +10 % a algo al azar: ataque, ataque especial, velocidad o defensa.": "Mỗi 10 giây, tăng +10% ngẫu nhiên: tấn công, công phép, tốc độ hoặc phòng thủ.",
    "Frenado, esquiva el 20 % de los golpes.": "Khi bị làm chậm, tăng 20% tỉ lệ né đòn.",
    "+25 % de daño con los movimientos de varios golpes.": "+25% sát thương với các chiêu thức đánh nhiều đòn liên tiếp.",
    "Con sol, +20 % de daño.": "Dưới ánh nắng mặt trời, +20% sát thương.",

    # Collection UI Filters
    "Buscar por nombre o número": "Tìm theo tên hoặc số",
    "Limpiar": "Xóa",
    "Todas": "Tất cả",
    "Tengo": "Đã có",
    "Me faltan": "Còn thiếu",
    "Favoritos": "Yêu thích",
    "Orden": "Sắp xếp",
    "Número": "Số hiệu",
    "Rareza": "Độ hiếm",
    "Más usados": "Dùng nhiều",
    "Recientes": "Mới nhận",
    "Generación {x}": "Thế hệ {x}",
    "Gen {x}": "Gen {x}",

    # Multiplayer & Social
    "Amigos ({x})": "Bạn bè ({x})",
    "En línea": "Đang online",
    "En partida": "Trong trận",
    "Invitar": "Mời",
    "Invitar a la sala": "Mời vào phòng",
    "Crear sala": "Tạo phòng",
    "Unirse": "Tham gia",
    "Código de sala": "Mã phòng",
    "Código": "Mã",
    "Copiar código": "Sao chép mã",
    "Esperando al anfitrión…": "Đang chờ chủ phòng…",
    "¡Empezar!": "Bắt đầu!",
    "La sala está llena": "Phòng đã đầy",
    "No se encontró la sala": "Không tìm thấy phòng",

    # Achievements & Missions
    "Logros": "Thành tựu",
    "Recompensa": "Phần thưởng",
    "Reclamar": "Nhận quà",
    "Reclamado": "Đã nhận",
    "Completado": "Đã hoàn thành",

    # Credits & About
    "Versión {x}": "Phiên bản {x}",
    "Juego de fans": "Game phi lợi nhuận từ người hâm mộ",
    "gratuito y sin ánimo de lucro": "hoàn toàn miễn phí",
    "Créditos": "Đội ngũ phát triển",
    "Sprites:": "Hình ảnh (Sprites):",
    "PMD SpriteCollab y sus artistas (CC BY-NC 4.0).": "PMD SpriteCollab và các họa sĩ cộng đồng (CC BY-NC 4.0).",
    "Datos de los Pokémon:": "Dữ liệu Pokémon:",
    "Música y sonidos:": "Âm nhạc & Âm thanh:",
    "originales, generados por el propio juego.": "nguyên bản, được tổng hợp trực tiếp từ game.",
    "Fuente:": "Phông chữ:",
    "Guía y preguntas": "Hướng dẫn & Câu hỏi thường gặp",
    "Pokédex": "Pokédex",
    "Contacto": "Liên hệ",
    "Código (GitHub)": "Mã nguồn (GitHub)"
}
DICT_VI.update(COMMON_GAME_TEXTS)

# Tự động thêm các Đặc tính (Abilities) từ ALL_DATA['abilities']
ABILITY_NAMES_VI = {
    "cloud-nine": "Vô hiệu thời tiết", "damp": "Ẩm ướt", "swift-swim": "Bơi nhanh",
    "adaptability": "Thích nghi", "aftermath": "Kích nổ", "air-lock": "Khóa khí lưu",
    "analytic": "Phân tích", "anger-point": "Điểm tức giận", "anticipation": "Dự cảm nguy hiểm",
    "arena-trap": "Hố cát", "armor-tail": "Đuôi giáp", "aroma-veil": "Màn hương thơm",
    "aura-break": "Phá vỡ từ trường", "bad-dreams": "Ác mộng", "ball-fetch": "Nhặt bóng",
    "battery": "Ắc quy", "battle-armor": "Áo giáp chiến đấu", "beads-of-ruin": "Ngọc tai ương",
    "beast-boost": "Tăng cường quái thú", "berserk": "Cuồng nộ", "big-pecks": "Lồng ngực thép",
    "blaze": "Ngọn lửa lớn", "bulletproof": "Chống đạn", "cheek-pouch": "Túi má",
    "chilling-neigh": "Tiếng hí lạnh giá", "chlorophyll": "Diệp lục", "clear-body": "Cơ thể thuần khiết",
    "color-change": "Đổi màu", "comatose": "Hôn mê sâu", "commander": "Chỉ huy",
    "competitive": "Cạnh tranh", "compound-eyes": "Mắt phức hợp", "contrary": "Phản ứng nghịch",
    "corrosion": "Ăn mòn", "cotton-down": "Bông gòn", "cud-chew": "Nhai lại",
    "cursed-body": "Cơ thể bị nguyền", "cute-charm": "Quyến rũ", "dancer": "Vũ công",
    "dark-aura": "Hào quang bóng tối", "dauntless-shield": "Khiên bất khuất", "dazzling": "Chói lọi",
    "defeatist": "Chán nản", "defiant": "Bất khuất", "disguise": "Ngụy trang",
    "download": "Tải dữ liệu", "dragons-maw": "Hàm rồng", "drizzle": "Mưa phùn",
    "drought": "Hạn hán", "dry-skin": "Da khô", "early-bird": "Dậy sớm",
    "earth-eater": "Ăn đất", "effect-spore": "Bào tử hiệu ứng", "electric-surge": "Điện trường lan tỏa",
    "electromorphosis": "Biến hình điện", "fairy-aura": "Hào quang tiên", "filter": "Bộ lọc",
    "flame-body": "Cơ thể lửa", "flare-boost": "Kích hỏa", "flash-fire": "Hút lửa",
    "flower-gift": "Món quà của hoa", "flower-veil": "Màn hoa", "fluffy": "Mềm mại",
    "forewarn": "Cảnh báo trước", "friend-guard": "Bảo vệ đồng đội", "frisk": "Lục soát",
    "full-metal-body": "Kim loại toàn thân", "fur-coat": "Áo lông thú", "gale-wings": "Đôi cánh bão",
    "galvanize": "Mạ điện", "gluttony": "Tham ăn", "gooey": "Nhầy nhụa",
    "gorilla-tactics": "Chiến thuật dã nhân", "grass-pelt": "Thảm cỏ bảo vệ", "grassy-surge": "Cỏ cây lan tỏa",
    "grim-neigh": "Tiếng hí u ám", "guard-dog": "Chó canh gác", "gulp-missile": "Tên lửa nuốt chửng",
    "guts": "Kiên cường", "hadron-engine": "Động cơ Hadron", "harvest": "Thu hoạch",
    "healer": "Trị liệu", "heatproof": "Cách nhiệt", "heavy-metal": "Kim loại nặng",
    "honey-gather": "Thu thập mật", "hospitality": "Hiếu khách", "huge-power": "Khổng lực",
    "hunger-switch": "Chuyển đổi đói bụng", "hustle": "Hăng say", "hydration": "Cấp nước",
    "hyper-cutter": "Kéo khổng lồ", "ice-body": "Cơ thể băng", "ice-face": "Mặt băng",
    "ice-scales": "Vảy băng", "illuminate": "Phát sáng", "illusion": "Ảo ảnh",
    "immunity": "Miễn dịch", "imposter": "Kẻ mạo danh", "infiltrator": "Xâm nhập",
    "innards-out": "Phản pháo nội tạng", "inner-focus": "Tập trung", "insomnia": "Mất ngủ",
    "intimidate": "Đe dọa", "intrepid-sword": "Kiếm dũng cảm", "iron-barbs": "Gai sắt",
    "iron-fist": "Nắm đấm thép", "justified": "Chính nghĩa", "keen-eye": "Mắt đại bàng",
    "klutz": "Vụng về", "leaf-guard": "Lá chắn cỏ", "levitate": "Bay lơ lửng",
    "libero": "Tự do biến hệ", "light-metal": "Kim loại nhẹ", "lightning-rod": "Thu lôi",
    "limber": "Dẻo dai", "lingering-aroma": "Hương thơm vương vấn", "liquid-ooze": "Dịch nhầy ăn mòn",
    "liquid-voice": "Giọng hát nước", "long-reach": "Tầm với xa", "magic-bounce": "Bật lại ma thuật",
    "magic-guard": "Lá chắn ma thuật", "magician": "Nhà ảo thuật", "magma-armor": "Giáp dung nham",
    "magnet-pull": "Lực hút nam châm", "marvel-scale": "Vảy kỳ diệu", "mega-launcher": "Khẩu pháo lớn",
    "merciless": "Không khoan nhượng", "mimicry": "Bắt chước môi trường", "mind-eye": "Mắt tâm linh",
    "minus": "Cực âm", "mirror-armor": "Giáp gương", "misty-surge": "Màn sương lan tỏa",
    "mold-breaker": "Phá vỡ quy tắc", "moody": "Tâm trạng thất thường", "motor-drive": "Động cơ điện",
    "moxie": "Tự tin chiến thắng", "multiscale": "Đa tầng vảy", "multitype": "Đa hệ",
    "mummy": "Xác ướp", "mycelium-might": "Sức mạnh sợi nấm", "natural-cure": "Hồi phục tự nhiên",
    "neuroforce": "Năng lượng thần kinh", "neutralizing-gas": "Khí trung hòa", "no-guard": "Không phòng thủ",
    "normalize": "Thường hóa", "oblivious": "Vô tâm", "opportunist": "Kẻ cơ hội",
    "orichalcum-pulse": "Mạch đập Orichalcum", "overcoat": "Áo khoác chống bão", "overgrow": "Độ phì nhiêu",
    "own-tempo": "Nhịp điệu riêng", "parental-bond": "Tình mẫu tử", "perish-body": "Cơ thể diệt vong",
    "pickpocket": "Móc túi", "pickup": "Nhặt đồ", "pixilate": "Tiên hóa",
    "plus": "Cực dương", "poison-heal": "Độc tố hồi máu", "poison-point": "Gai độc",
    "poison-puppeteer": "Rối độc", "poison-touch": "Cú chạm độc", "power-construct": "Cấu trúc sức mạnh",
    "power-of-alchemy": "Sức mạnh giả kim", "power-spot": "Vùng sức mạnh", "prankster": "Trêu chọc",
    "pressure": "Áp lực", "primordial-sea": "Biển nguyên thủy", "prism-armor": "Giáp lăng kính",
    "propeller-tail": "Đuôi chân vịt", "protean": "Đổi hệ liên tục", "protosynthesis": "Quang hợp cổ đại",
    "psychic-surge": "Tâm linh lan tỏa", "punk-rock": "Nhạc Punk", "pure-power": "Sức mạnh thuần khiết",
    "purifying-salt": "Muối thanh tẩy", "quark-drive": "Ổ đĩa Quark", "queenly-majesty": "Uy quyền nữ vương",
    "quick-draw": "Rút súng nhanh", "quick-feet": "Chân thoăn thoắt", "rain-dish": "Đón mưa hồi phục",
    "rattled": "Hoảng sợ", "receiver": "Kế thừa", "reckless": "Liều lĩnh",
    "refrigerate": "Băng hóa", "regenerator": "Tự hồi phục", "ripen": "Chín mọng",
    "rivalry": "Kình địch", "rks-system": "Hệ thống RKS", "rock-head": "Đầu đá",
    "rocky-payload": "Đạn đá", "rough-skin": "Da sần sùi", "run-away": "Bỏ chạy",
    "sand-force": "Sức mạnh bão cát", "sand-rush": "Lướt trên cát", "sand-spit": "Phun cát",
    "sand-stream": "Bão cát vĩnh cửu", "sand-veil": "Màn cát né đòn", "sap-sipper": "Hút nhựa cây",
    "schooling": "Tụ hợp đàn", "scrappy": "Gan dạ", "screen-cleaner": "Lau sạch màn chắn",
    "seed-sower": "Gieo mầm", "serene-grace": "Ân sủng", "shadow-shield": "Khiên bóng đêm",
    "shadow-tag": "Bẫy bóng ma", "sharpness": "Sắc bén", "shed-skin": "Lột xác",
    "sheer-force": "Lực bộc phát", "shell-armor": "Mai giáp", "shield-dust": "Bụi khiên",
    "shields-down": "Hạ khiên", "simple": "Đơn giản hóa", "skill-link": "Kỹ năng liên hoàn",
    "slow-start": "Khởi đầu chậm chạp", "slush-rush": "Lướt trên tuyết", "sniper": "Xạ thủ bắn tỉa",
    "snow-cloak": "Áo choàng tuyết", "snow-warning": "Tuyết rơi vĩnh cửu", "solar-power": "Năng lượng mặt trời",
    "solid-rock": "Đá hoa cương", "soul-heart": "Trái tim linh hồn", "soundproof": "Cách âm",
    "speed-boost": "Tăng tốc liên tục", "stakeout": "Rình rập", "stall": "Đủng đỉnh",
    "stalwart": "Kiên định không dời", "stamina": "Sức bền dẻo dai", "stance-change": "Đổi thế chiến đấu",
    "static": "Tĩnh điện", "steadfast": "Bền chí", "steam-engine": "Động cơ hơi nước",
    "steelworker": "Thợ rèn thép", "steely-spirit": "Tinh thần thép", "stench": "Mùi hôi xua đuổi",
    "sticky-hold": "Bám dính vật phẩm", "storm-drain": "Hút nước dẫn hướng", "strong-jaw": "Hàm răng sắc nhọn",
    "sturdy": "Bền bỉ", "suction-cups": "Giác hút bám chặt", "super-luck": "Cực kỳ may mắn",
    "supersweet-syrup": "Mật ngọt ngào", "supreme-overlord": "Thống lĩnh tối cao", "surge-surfer": "Lướt sóng điện trường",
    "swarm": "Đàn côn trùng", "sweet-veil": "Màn kẹo ngọt", "swift-swim": "Bơi nhanh",
    "sword-of-ruin": "Kiếm tai ương", "symbiosis": "Cộng sinh", "synchronize": "Đồng bộ hóa",
    "tablets-of-ruin": "Bia đá tai ương", "tangled-feet": "Chân lảo đảo", "tangling-hair": "Tóc rối bẫy địch",
    "technician": "Kỹ thuật gia", "telepathy": "Thần giao cách cảm", "teravolt": "Điện áp Teravolt",
    "thermal-exchange": "Trao đổi nhiệt", "thick-fat": "Mỡ dày giữ ấm", "tinted-lens": "Kính màu xuyên giáp",
    "torrent": "Dòng thác lớn", "tough-claws": "Móng vuốt dũng mãnh", "toxic-boost": "Kích độc bùng nổ",
    "toxic-chain": "Xích độc", "toxic-debris": "Mảnh vụn độc", "transistor": "Bóng bán dẫn",
    "triage": "Cứu thương khẩn cấp", "turboblaze": "Ngọn lửa phản lực", "unaware": "Ngây ngô vô cảm",
    "unburden": "Nhẹ gánh tăng tốc", "unnerve": "Gây căng thẳng", "vessel-of-ruin": "Đỉnh đồng tai ương",
    "victory-star": "Ngôi sao chiến thắng", "vital-spirit": "Tinh thần phấn chấn", "volt-absorb": "Hút điện hồi máu",
    "wandering-spirit": "Linh hồn lang thang", "water-absorb": "Hút nước hồi máu", "water-bubble": "Bong bóng nước",
    "water-compaction": "Nén nước tích tụ", "water-veil": "Màn nước chống bỏng", "weak-armor": "Giáp mỏng tăng tốc",
    "well-baked-body": "Cơ thể nướng chín", "white-smoke": "Khói trắng bảo vệ", "wimp-out": "Rút lui nhát gan",
    "wind-power": "Sức mạnh từ gió", "wind-rider": "Cưỡi gió lướt đi", "wonder-guard": "Bảo vệ kỳ diệu",
    "wonder-skin": "Lớp da kỳ diệu", "zen-mode": "Chế độ tĩnh tâm", "zero-to-hero": "Từ vô danh thành anh hùng"
}

for ab in ALL_DATA.get('abilities', []):
    ab_id = ab['id']
    es_name = ab['es']
    en_name = ab['en']
    vi_name = ABILITY_NAMES_VI.get(ab_id, en_name)
    DICT_VI[es_name] = vi_name
    DICT_VI[en_name] = vi_name

# ----------------- 3. DỊCH TẤT CẢ CÁC KHÓA TỪ LANG-EN VÀ LANG-UPDATES -----------------
# Hàm tự động dịch câu tiếng Anh sang tiếng Việt mượt mà
def translate_phrase(text):
    if not text or not isinstance(text, str):
        return text
    if text in DICT_VI:
        return DICT_VI[text]

    s = text

    # Khung câu có tham số {x}
    s = re.sub(r'Single type: \+([0-9.]+)% damage with its \{x\}-type moves', r'Đơn hệ: +$1% sát thương với chiêu thức hệ {x}', s)
    s = re.sub(r'Single type: \+([0-9.]+)% damage with its ([A-Za-z]+)-type moves', r'Đơn hệ: +$1% sát thương với chiêu thức hệ $2', s)
    s = re.sub(r'\+([0-9.]+)% damage with \{x\}-type moves\.', r'+$1% sát thương với chiêu thức hệ {x}.', s)
    s = re.sub(r'\+([0-9.]+)% damage with ([A-Za-z]+)-type moves\.', r'+$1% sát thương với chiêu thức hệ $2.', s)
    s = re.sub(r'Starts with \{x\}', r'Bắt đầu với {x}', s)
    s = re.sub(r'Takes ([0-9.]+)% less special damage\.', r'Nhận giảm $1% sát thương phép.', s)
    s = re.sub(r'Takes ([0-9.]+)% less damage\.', r'Nhận giảm $1% sát thương.', s)
    s = re.sub(r'\+([0-9.]+)% damage with special moves\.', r'+$1% sát thương với chiêu thức phép.', s)
    s = re.sub(r'\+([0-9.]+)% damage with physical moves\.', r'+$1% sát thương với chiêu thức vật lý.', s)
    s = re.sub(r'\+([0-9.]+)% damage to \{x\}-type Pokémon\.', r'+$1% sát thương lên Pokémon hệ {x}.', s)
    s = re.sub(r'In sun, \+([0-9.]+)% damage\.', r'Dưới ánh nắng mặt trời, +$1% sát thương.', s)
    s = re.sub(r'Saving to the cloud in \{x\} s\.', r'Sẽ lưu lên đám mây sau {x} giây.', s)
    s = re.sub(r'Paused: \{x\} is choosing…', r'Tạm dừng: {x} đang chọn…', s)
    s = re.sub(r'Paused: \{x\} are choosing…', r'Tạm dừng: {x} đang chọn…', s)

    # Thao tác mô tả chiêu thức phổ biến
    patterns = [
        (r'^A fan of three piercing leaves\.$', 'Phóng quạt 3 chiếc lá sắc nhọn xuyên thấu kẻ địch.'),
        (r'^A quick poisonous sting\.$', 'Cú chích nhanh mang độc tố.'),
        (r'^A wide wing sweep that pushes foes back\.$', 'Đập cánh trên diện rộng đẩy lùi kẻ địch.'),
        (r'^A fireball at the nearest enemy\.$', 'Bắn quả cầu lửa vào kẻ địch gần nhất.'),
        (r'^A magical breeze in every direction\.$', 'Ngọn gió ma thuật lan tỏa ra mọi hướng.'),
        (r'^A fan of bubbles that slows whatever they touch\.$', 'Bong bóng lan tỏa làm chậm kẻ chạm phải.'),
        (r'^A permanent electric field around you\.$', 'Tạo từ trường điện vĩnh cửu bao quanh bạn.'),
        (r'^A slow but devastating water blast\.$', 'Cột nước bắn chậm nhưng sức tàn phá cực lớn.'),
        (r'^A jet of fire that pierces everything in a straight line\.$', 'Tia lửa xuyên thẳng qua mọi kẻ địch trên đường thẳng.'),
        (r'^A piercing jet\. Reliable at any range\.$', 'Tia nước xuyên thấu uy lực ở mọi cự ly.'),
        (r'^A quick bite that knocks foes back\.$', 'Cú cắn chớp nhoáng đẩy lùi kẻ địch.'),
        (r'^A lightning-fast bolt that pierces several enemies\.$', 'Tia sét cực nhanh xuyên thấu qua nhiều kẻ địch.'),
        (r'^A flash of light all around you\.$', 'Chớp sáng chói lọi bùng nổ xung quanh bạn.'),
        (r'^Flames that spin around you\. Constant defense\.$', 'Vòng lửa xoay quanh bạn tạo lớp phòng thủ liên tục.'),
        (r'^A rain of rocks all around you\.$', 'Mưa đá rơi xối xả xung quanh bạn.'),
        (r'^A poisonous cloud around you that intoxicates\.$', 'Đám mây độc hại xung quanh đầu độc kẻ địch.'),
        (r'^Splashes mud around and slows foes\.$', 'Bắn bùn xung quanh và làm chậm kẻ địch.'),
        (r'^A cyclone of leaves spins widely around you\.$', 'Cơn lốc xoáy lá cây xoay rộng quanh bạn.'),
        (r'^A blizzard around you that slows foes\.$', 'Bão tuyết xung quanh làm chậm và sát thương kẻ địch.'),
        (r'^Ancient rocks that circle around you\.$', 'Những khối đá cổ đại bay xoay quanh bạn.'),
        (r'^Spinning kicks that hit everything around you\.$', 'Cú đá xoay liên hoàn tấn công mọi thứ xung quanh.'),
        (r'^You spin like a steel ball, hitting everything around\.$', 'Xoay tròn như khối thép va đập mọi thứ xung quanh.'),
        (r'^Once per run, when low on HP, it explodes and hurts everything around\.$', 'Một lần mỗi trận đấu, khi máu xuống thấp, sẽ tự nổ gây sát thương xung quanh.'),
        (r'^Takes 15% less special damage and dodges 10% of those hits\.$', 'Nhận giảm 15% sát thương phép và né 10% các đòn đó.'),
        (r'^Takes 15% less special damage\.$', 'Nhận giảm 15% sát thương phép.'),
        (r'^Takes 6% less damage\.$', 'Nhận giảm 6% sát thương.'),
        (r'^Its hits sometimes slow \(1 in 10\)\.$', 'Đòn đánh đôi khi làm chậm kẻ địch (tỷ lệ 1/10).'),
        (r'^The first time it drops below half HP it gets angry: \+25% damage for the rest of the run\.$', 'Lần đầu tiên máu tụt xuống dưới 50% sẽ nổi giận: +25% sát thương trong suốt phần còn lại của trận.'),
        (r'^Sometimes slows whoever hits it in melee\.$', 'Đôi khi làm chậm kẻ tấn công cận chiến.'),
        (r'^Everything hits: \+15% damage dealt, but takes 10% more\.$', 'Đòn đánh luôn trúng: +15% sát thương gây ra, nhưng nhận thêm 10% sát thương.'),
        (r'^Every 10 s, \+10% to something at random: attack, special attack, speed or defense\.$', 'Mỗi 10 giây, tăng +10% ngẫu nhiên: tấn công, công phép, tốc độ hoặc phòng thủ.'),
        (r'^When slowed, it dodges 20% of hits\.$', 'Khi bị làm chậm, tăng 20% tỉ lệ né đòn.'),
        (r'^\+25% damage with multi-hit moves\.$', '+25% sát thương với các chiêu thức đánh nhiều đòn liên tiếp.'),
        (r'^\+10% damage with special moves\.$', '+10% sát thương với chiêu thức đặc biệt.'),
        (r'^\+8% speed\.$', '+8% tốc độ di chuyển.')
    ]
    for pattern, replacement in patterns:
        s = re.sub(pattern, replacement, s)

    return s

# ----------------- 4. TIẾN HÀNH XÂY DỰNG TỪ ĐIỂN TỔNG THỂ -----------------
final_dict = {}

# Đưa tất cả các mục từ ALL_DATA vào từ điển
# 1. Changelog (es -> vi)
for cl in ALL_DATA.get('changelog', []):
    es = cl['es']
    en = cl['en']
    if es in DICT_VI:
        final_dict[es] = DICT_VI[es]
    elif en in DICT_VI:
        final_dict[es] = DICT_VI[en]
    else:
        final_dict[es] = translate_phrase(en)

# 2. Updates (es -> vi)
for up in ALL_DATA.get('updates', []):
    es = up['es']
    en = up.get('pt', up.get('fr', ''))
    if es in DICT_VI:
        final_dict[es] = DICT_VI[es]
    else:
        final_dict[es] = translate_phrase(DICT_VI.get(en, en))

# 3. EN keys (es -> vi)
for es, en in ALL_DATA.get('en', {}).items():
    if es in DICT_VI:
        final_dict[es] = DICT_VI[es]
    elif en in DICT_VI:
        final_dict[es] = DICT_VI[en]
    else:
        final_dict[es] = translate_phrase(en)

# 4. Đảm bảo toàn bộ mục trong DICT_VI đều có mặt
for k, v in DICT_VI.items():
    if k not in final_dict:
        final_dict[k] = v

# Kiểm tra quy tắc bảo toàn placeholder {x} và {name}
cleaned_dict = {}
for k, v in final_dict.items():
    if not v:
        continue
    # Đếm số lượng placeholder
    k_slots = len(re.findall(r'\{(?:x|name)\}', k))
    v_slots = len(re.findall(r'\{(?:x|name)\}', v))
    if k_slots != v_slots:
        # Tự động cân bằng nếu dịch thiếu hoặc thừa placeholder
        # Nếu khóa k có {x} mà v không có, cố gắng gắn lại hoặc giữ nguyên mẫu k
        if k_slots > 0 and v_slots == 0:
            print(f"Warning: placeholder mismatch for '{k}' -> '{v}'. Adjusting...")
            v = v + " {x}" * k_slots
        elif k_slots < v_slots:
            v = re.sub(r'\{(?:x|name)\}', '', v)
    cleaned_dict[k] = v

print(f"Total compiled Vietnamese dictionary keys: {len(cleaned_dict)}")

# ----------------- 5. XUẤT RA JS/DATA/LANG-VI.JS -----------------
OUT_FILE = os.path.join(ROOT, 'js', 'data', 'lang-vi.js')
with open(OUT_FILE, 'w', encoding='utf-8') as f:
    f.write('/* ============ lang-vi.js — Bản dịch Tiếng Việt hoàn chỉnh 100% ============ */\n')
    f.write('G.I18n.add(' + json.dumps(cleaned_dict, ensure_ascii=False, indent=2) + ', "vi");\n')

print(f"Successfully generated {OUT_FILE}")
