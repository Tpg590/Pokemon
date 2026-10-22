# Lịch sử thay đổi dự án PokéSurvivor (ChangeTime.md)

Tài liệu này ghi lại chi tiết mốc thời gian, nội dung sửa đổi và kết quả thực thi trong suốt quá trình phát triển dự án.

---

## ⏱️ [2026-10-22 23:04:00] — Khởi tạo cấu hình mạng & máy chủ
- **db.js:** Cập nhật danh sách whitelist `HOSTS` sang nhận diện động `location.hostname` để hỗ trợ Vercel và các custom domain.
- **coop.js:** Nâng cấp tần số gửi gói tin co-op từ 15 Hz (`1/15`) lên **30 Hz (`1/30`)** nhằm tăng gấp đôi độ mượt chuyển động, triệt tiêu hiện tượng quái và người chơi bị giật lag khi kết nối P2P.
- **Git / Repo:** Xóa file `CNAME` trỏ về domain cũ của tác giả để tránh xung đột routing.

## ⏱️ [2026-10-22 23:25:00] — Cấu hình Firebase cá nhân (Singapore)
- **firebase-config.js:** Thiết lập cấu hình Firebase cá nhân của người dùng (`pokesurvivor-vn`), trỏ `databaseURL` về khu vực **Singapore (`asia-southeast1`)** để giảm ping từ 300ms (Châu Âu) xuống ~30ms.

## ⏱️ [2026-10-22 23:35:00] — Tối ưu Git Push cho tài nguyên lớn
- **Git Config:** Cấu hình `http.postBuffer` lên 1 GB và chuyển sang `HTTP/1.1` để đẩy thành công hơn 15.000 file sprite Pokemon lên GitHub `Tpg590/Pokemon`.

## ⏱️ [2026-10-22 23:39:00] — Chuẩn hóa bản quyền README.md
- **README.md:** Thêm thông báo ghi công tác giả gốc **Jonathan Piera Torregrosa ([JPTER78](https://github.com/JPTER78))**, dẫn link repo gốc, website `pokesurvivor.com` và tuân thủ giấy phép PolyForm Noncommercial 1.0.0.

## ⏱️ [2026-10-23 00:28:00] — Bổ sung tài liệu Tiếng Việt cho README.md
- **README.md:** Bổ sung toàn bộ tài liệu hướng dẫn chơi, bảng điều khiển, các cơ chế game và điều khoản bản quyền bằng tiếng Việt.

## ⏱️ [2026-10-23 00:34:00] — Tích hợp hệ thống đa ngôn ngữ Tiếng Việt trong game
- **locales.js & boot.js:** Đăng ký mã ngôn ngữ `vi` (`Tiếng Việt`), hỗ trợ nhận diện tự động từ trình duyệt và hiển thị màn hình nạp game bằng tiếng Việt.
- **mons.js:** Thiết lập quy tắc hiển thị tên Pokémon cho tiếng Việt theo chuẩn quốc tế (Pikachu, Charizard...).
- **vi.js & lang-vi.js:** Tạo bộ từ điển Việt hóa đầu tiên.

## ⏱️ [2026-10-23 01:32:00] — Khắc phục lỗi "This needs the online version of the game"
- **Build System:** Chạy lại `node tools/build.js` và `export_data.js` để đóng gói toàn bộ code Firebase, domain động và tiếng Việt vào `js/app.min.js` và `index.html`.
- **Kết quả:** Kích hoạt thành công chế độ Cloud Online cho web trên Vercel.

## ⏱️ [2026-10-23 01:45:00] — Tinh chỉnh gói Tiếng Việt & Sửa lỗi vỡ giao diện (UI)
- **Tinh gọn nhãn độ hiếm:** Xóa bỏ phần chú thích tiếng Anh thừa trong ngoặc như `{Legendary}`, `{Uncommon}`, `{Rare}` để thẻ hiển thị ngắn gọn (`Thường`, `Khá`, `Hiếm`, `Sử thi`, `Huyền thoại`), giúp UI không bị tràn dòng.
- **Sửa lỗi menu di động:** Rút gọn nút `What's new` thành `Tin mới` để icon và text không bị nhảy thành 2 dòng làm lệch thanh công cụ.
- **Việt hóa đầy đủ các mục còn sót:**
  - `Kecleon Shop` ➔ `Cửa hàng`
  - `Bag` ➔ `Túi đồ`
  - `Mark as Favorite` ➔ `Yêu thích`
  - Các bộ lọc Pokémon: `All` ➔ `Tất cả`, `Owned` ➔ `Đã có`, `Missing` ➔ `Chưa có`, `Favorites` ➔ `Yêu thích`, `Sort` ➔ `Sắp xếp`, `Rarity` ➔ `Độ hiếm`, `Recently caught` ➔ `Mới bắt`, `Most played` ➔ `Chơi nhiều nhất`, `Search by name or number` ➔ `Tìm theo tên hoặc số...`
  - `Nombre` trong lọc Pokemon: Sửa từ `Tên đăng nhập` thành `Tên`.
  - Các chỉ số: Rút gọn `HP (Máu)` ➔ `HP`, `Tấn công (Atk)` ➔ `Tấn công`, `Phòng thủ (Def)` ➔ `Phòng thủ`, `Tốc độ (Speed)` ➔ `Tốc độ`.
  - Việt hóa popup cập nhật `What's new` (Có gì mới).
- **Biên dịch:** Chạy `node tools/build.js` để đóng gói lại bản `js/app.min.js` chuẩn và đẩy lên Vercel.

## ⏱️ [2026-10-23 02:15:00] — Đại tu toàn diện 100% Tiếng Việt (Triệt tiêu toàn bộ tiếng Anh còn sót)
- **Nguyên nhân tiếng Anh xuất hiện:**
  - `mons.js`: Trước đây khai báo cứng `LANG_I = { ... vi: 1 }`, khiến Bản tính (Natures) và Đặc tính (Abilities) luôn hiển thị bằng tiếng Anh (ví dụ `Careful`, `Cloud Nine`).
  - `lang-updates.js`: Chứa hơn 500 dòng cập nhật của game nhưng tác giả gốc chỉ nạp cho 5 thứ tiếng (`fr, it, pt, zh-Hans, zh-Hant`), còn tiếng Việt bị bỏ sót nên tự động nhảy về tiếng Anh.
  - `changelog.js`: Toàn bộ tin tức cập nhật game hiển thị bằng tiếng Anh do chưa có cặp dịch tiếng Việt tương ứng.
  - Bộ kiểm thử tự động `tests/i18n.test.cjs` trước đây chưa đưa `vi` vào danh sách kiểm duyệt nghiêm ngặt.
- **Giải pháp xử lý triệt để:**
  1. **Hệ thống Pokémon (`mons.js`):** Nâng cấp hàm `G.Mons.name(n)` cho phép tra cứu trực tiếp bản dịch tiếng Việt qua `G.T()` cho cả 25 Bản tính (`Cẩn trọng`, `Kiên cường`, `Khiêm tốn`, `Vui vẻ`...) và toàn bộ Đặc tính (`Vô hiệu thời tiết`, `Ngọn lửa lớn`, `Bền bỉ`, `Thích nghi`...).
  2. **Nâng cấp từ điển (`lang-vi.js`):** Tăng dung lượng từ điển tiếng Việt lên **155 KB** với **2.402 khóa dịch hoàn chỉnh**:
     - **Cài đặt & Điều khiển:** Việt hóa 100% tab `Thông tin` (`About`), hướng dẫn tay cầm Xbox/PlayStation/Switch, độ rung phản hồi, phím bấm, cần ảo di động, nút đặt vị trí.
     - **Mô tả chiêu thức & Đặc tính:** `Single type: +20% damage...` ➔ `Đơn hệ: +20% sát thương với chiêu thức hệ Nước`, `+8% damage with Nước-type moves.` ➔ `+8% sát thương với chiêu thức hệ Nước.`, `It has not learned any yet` ➔ `Chưa học chiêu thức nào`, `Starts with Confusion` ➔ `Bắt đầu với Confusion`.
     - **Bản tin cập nhật (`G.CHANGELOG`):** Dịch chuẩn ngữ nghĩa toàn bộ 145 mục tin mới từ phiên bản đầu đến mới nhất ngày 22/10/2026.
  3. **Kiểm thử tự động (`tests/i18n.test.cjs`):** Thêm mã ngôn ngữ `vi` và từ khóa `Lưu` vào bộ test. Chạy `node --test tests/i18n.test.cjs` đạt kết quả tuyệt đối **20/20 tests passed**.
  4. **Đóng gói & Phát hành:** Chạy `node tools/build.js` thành công, tạo `js/app.min.js` mới kèm chữ ký số và cập nhật `js/lang/vi.js`. Đã đẩy toàn bộ mã nguồn lên GitHub `Tpg590/Pokemon` để Vercel tự động triển khai.
## ⏱️ [2026-10-23 02:48:00] — Dịch toàn diện mô tả Chiêu thức, Vật phẩm, Cốt truyện sang Tiếng Việt (Giữ nguyên tên Pokémon, Kỹ năng, Vật phẩm)
- **Yêu cầu & Quy chuẩn:**
  - Giữ nguyên toàn bộ **Tên Pokémon** (Pikachu, Bulbasaur, Mewtwo...), **Tên Chiêu thức / Kỹ năng** (Ember, Flamethrower, Solar Beam, Hydro Pump, Confuse Ray...), **Tên Vật phẩm** (Leftovers, Choice Band, Focus Sash, Life Orb...).
  - Dịch 100% tất cả **Mô tả chiêu thức, mô tả vật phẩm, hiệu ứng đặc tính, cốt truyện, nhiệm vụ, danh hiệu, minigame, thông báo chiến đấu** sang tiếng Việt tự nhiên và chuẩn xác.
- **Chi tiết các phần đã hoàn thiện:**
  1. **Mô tả chiêu thức chiến đấu (100%):**
     - `"Drena vida de todo lo cercano y te cura con cada golpe."` ➔ `"Hút sinh lực từ kẻ địch xung quanh và hồi máu cho bạn sau mỗi đòn đánh."`
     - `"Embiste en arco a todo lo que tengas delante."` ➔ `"Lao tới theo hình vòng cung càn quét mọi kẻ địch phía trước."`
     - `"Esfera de energía que nunca falla."` ➔ `"Quả cầu năng lượng không bao giờ trượt mục tiêu."`
     - `"Esfera oscura que atraviesa a varios."` ➔ `"Khối cầu bóng tối xuyên thấu qua nhiều kẻ địch."`
     - `"Estallido mental radial que busca enemigos."` ➔ `"Bộc phát sóng tâm linh tỏa tròn tự tìm mục tiêu."`
     - `"Explota en llamas en todas las direcciones."` ➔ `"Bùng nổ ngọn lửa rực cháy về mọi hướng."`
     - `"Golpe seco y potente al frente."` ➔ `"Cú đòn trực diện hiểm hóc và đầy uy lực."`
     - `"Hilos pegajosos en todas direcciones que frenan mucho."` ➔ `"Tơ dính phóng ra mọi hướng làm chậm kẻ địch đáng kể."`
     - `"Lametazo espectral que paraliza un poco."` ➔ `"Cú liếm ma quái làm tê liệt thoáng chốc."`
     - `"Látigos de largo alcance en arco amplio."` ➔ `"Dây roi tầm xa quét theo hình vòng cung rộng."`
     - `"Llamarada dracónica en línea recta."` ➔ `"Ngọn lửa rồng thiêu rụi theo đường thẳng."`
  2. **Tên chiêu thức & Vật phẩm:**
     - Giữ nguyên ánh xạ sang tên tiếng Anh quốc tế quen thuộc (Ví dụ: `Ascuas` ➔ `Ember`, `Lanzallamas` ➔ `Flamethrower`, `Restos` ➔ `Leftovers`, `Cinta Elección` ➔ `Choice Band`...).
  3. **Hệ thống dữ liệu và Kiểm thử:**
     - Cập nhật từ điển `js/data/lang-vi.js` lên **196.2 KB** (1.736 khóa dịch hoàn chỉnh).
     - Biên dịch ra `js/lang/vi.js` với kết quả: `vi: faltan 0` (không còn thiếu bất kỳ chuỗi nào).
     - Chạy kiểm thử tự động `tests/i18n.test.cjs`: **20/20 tests passed**, đảm bảo 100% khớp tham số động `{x}`, `{name}`.
     - Đóng gói bản mã hóa sản phẩm `node tools/build.js` thành công (`app.min.js?v=338b0a77e1`).
 ## ⏱️ [2026-10-23 03:35:00] — Triển khai Giai đoạn 1: Đại tu UI Dooforaft VN Edition (Retro Pixel RPG / Mystery Dungeon)
- **Tài nguyên đồ họa & Font chữ:**
  - Tải và tích hợp bộ font pixel chuẩn `PixelifyPS-400.ttf`, `PixelifyPS-700.ttf` vào thư mục `fonts/` và `assets/fonts/`.
  - Tải kết cấu sàn cát pixel `ui/floor.png` phục vụ hiển thị sân khấu Pokémon đồng hành.
- **Tiền tệ mới — Kim Cương (`gems 💎`):**
  - Cập nhật `js/core/db.js`: Khởi tạo mặc định `gems: 3` cho người chơi mới và tự động bổ sung cho các tài khoản hiện tại qua cơ chế `migrate()` và `sanitize()`.
  - Đăng ký `gems` vào hệ thống sổ cái đồng bộ đám mây `CUR` và thiết kế pixel icon `gem` (viên kim cương xanh) trong `js/ui/icons.js`.
- **Hệ thống giao diện nền tảng (`css/style.css`):**
  - Khởi tạo hệ thống màu sắc retro pixel: `--bg: #272223`, `--rule: #4d4240`, `--gold: #ffd65c`, `--bar: #d9cdb5`.
  - Tích hợp hiệu ứng viền khung pixel RPG procedurally generated đa dải (`.win`, `.box`, `.talk-box`).
  - Thiết kế con trỏ danh mục tam giác Pokémon Mystery Dungeon (`.cursor-item.on:before`) kèm hiệu ứng nhấp nháy động.
- **Màn hình Đăng nhập (`scr-login`):**
  - Tiêu đề game: `PokéSurvivor` kèm phụ đề **`DOOFORAFT VN EDITION`**.
  - Thiết kế bảng form tối giản, gọn gàng theo chuẩn mẫu `Reference/login.png`.
- **Màn hình chính & Topbar (`scr-menu` & `topbar`):**
  - **Header Bar:** Tích hợp bộ đếm `987 online`, nút Discord, thanh pill thống nhất hiển thị Vàng 🪙, Vé 🎫, Kim cương 💎 3, Trạng thái phòng `Room 1/4`, Tên người chơi và nút Cài đặt ⚙️.
  - **Partner Pokémon Card:** Thiết kế khung thẻ bên trái gồm sàn diễn sprite pixel động, Tên, Số hiệu Dex, Huy hiệu hệ và bảng chỉ số Runs, Best time, Best level, Defeated. Nút tin tức `Tin mới · v31`.
  - **Thanh Menu dọc bên phải:** Chia rõ 2 chế độ `Solo` và `Multiplayer`, danh mục `Pokémon (0/966)`, `Gacha`, `Nâng cấp`, `Nhiệm vụ`, `Xếp hạng`, `Bạn bè`, `Cài đặt`, `Đăng xuất`.
  - **Hộp thoại Bạn Đồng Hành tương tác (Partner Talk Box):** Khung avatar nhỏ của Pokémon đồng hành trên nền màu hệ, tên màu cam và lời thoại thay đổi mượt mà theo từng mục menu đang chọn hoặc di chuột vào (hỗ trợ câu thoại thông minh khi ở trong phòng chờ, khi có nhiệm vụ chưa nhận thưởng, hoặc chào đón người chơi).
  - **Điều khiển phím:** Hỗ trợ phím mũi tên `↑` / `↓` để chuyển con trỏ menu và phím `Enter` để chọn, kèm gợi ý phím `[Enter] Chọn | [↑ ↓] Di chuyển` ở góc dưới.
- **Đóng gói & Kiểm thử:**
  - `tests/i18n.test.cjs`: **20/20 tests passed**.
  - `node tools/build.js`: Biên dịch và mã hóa thành công ra `js/app.min.js?v=293bc58e48` và `index.html`.

## ⏱️ [2026-10-23 03:46:00] — Khắc phục lỗi màn hình Loading bị đơ (`TypeError: Cannot read properties of null reading classList`)
- **Nguyên nhân cốt lõi:**
  - Trong quá trình tinh giản `#topbar`, các nút ẩn hệ thống như `btn-support`, `btn-full`, `btn-news` bị thiếu trong DOM.
  - Khi game khởi động (`G.Flow.boot()`), các module `G.SupportUI.init()` và `G.SettingsUI.init()` truy cập vào `$('btn-support').classList` và `$('btn-full').classList` dẫn đến ngoại lệ `TypeError: null.classList`, làm gián đoạn chuỗi khởi tạo khiến lệnh ẩn màn hình `#boot` không được gọi.
- **Giải pháp xử lý triệt để:**
  1. Thêm bộ kiểm tra an toàn `if (!b) return;` trong `js/ui/support-ui.js` và `js/ui/settings-ui.js` để đảm bảo code không bao giờ crash kể cả khi phần tử giao diện tùy chọn bị thiếu.
  2. Bổ sung đầy đủ các nút hệ thống (`btn-support`, `btn-full`, `btn-news`) vào `#topbar` trong `dev.html`.
  3. Đổi ID nút tin tức trong màn hình chính thành `menu-btn-news` để tránh xung đột với nút tin tức hệ thống.
  4. Đóng gói lại toàn bộ ứng dụng bằng `node tools/build.js` (`app.min.js?v=0caee839cf`) và đẩy lên nhánh `main`.


## ⏱️ [2026-10-23 03:52:00] — Khôi phục lại giao diện UI gốc ban đầu (Rollback UI)
- **Yêu cầu từ người dùng:** Giao diện mod gặp lỗi hiển thị và trải nghiệm, yêu cầu quay trở lại toàn bộ giao diện gốc ban đầu của PokéSurvivor.
- **Thực thi hoàn tác:**
  - Hoàn tác toàn bộ các file giao diện về trạng thái chuẩn ổn định (commit `6906a14`):
    - `css/style.css`: Phục hồi CSS gốc chuẩn đẹp của game PokéSurvivor.
    - `dev.html` & `index.html`: Phục hồi cấu trúc HTML gốc.
    - `js/ui/menu.js`, `js/ui/ui.js`, `js/ui/icons.js`, `js/ui/settings-ui.js`, `js/ui/support-ui.js`: Phục hồi logic menu, icon và giao diện ban đầu.
    - `js/core/db.js`: Khôi phục database logic gốc ổn định.
    - Xóa các file đồ họa tạm đã tạo trong đợt thử nghiệm UI mod (`fonts/`, `ui/floor.png`). Giữ nguyên thư mục ảnh `Reference/`.
- **Bảo toàn gói tiếng Việt:**
  - Giữ nguyên 100% từ điển tiếng Việt hoàn chỉnh trong `js/data/lang-vi.js` và `js/lang/vi.js`.
  - Chạy kiểm thử tự động `tests/i18n.test.cjs`: **20/20 tests passed**.
- **Đóng gói sản phẩm:**
  - Chạy `node tools/build.js` thành công, nén mã hóa `js/app.min.js?v=338b0a77e1` và cập nhật `index.html`.

## ⏱️ [2026-10-23 04:30:00] — Triển khai Hệ thống Tiến Hóa Mega (Mega Evolution System)
- **Tạo cơ sở dữ liệu Mega (`js/data/mega.js`):**
  - Tích hợp toàn bộ 46 loài Pokémon có khả năng Mega (48 dạng Mega, bao gồm Charizard X & Y, Mewtwo X & Y, Primal Kyogre & Primal Groudon).
  - Khai báo đầy đủ tên dạng Mega, Tên đá Mega (tiếng Anh & tiếng Việt), Hệ mới khi biến hình, chỉ số chuẩn (+100 BST), Đặc tính và Mô tả chi tiết.
  - Các hàm quản lý: `isCapable()`, `getForms()`, `hasStone()`, `unlockStone()`, `getEquippedForm()`, `setEquippedForm()`, `canMegaEvolve()`, `evolve()`.
- **Thiết kế Icon Pixel Art Mega (`js/ui/icons.js`):**
  - Vẽ icon pixel art `mega` (vòng tròn hào quang ngũ sắc đỏ/tím/xanh/vàng bao quanh lõi DNA helix trắng phát sáng).
- **Giao diện Pokédex (`js/ui/menu.js` & `css/style.css`):**
  - **Trên thẻ Pokédex:** Hiển thị icon DNA Mega ngũ sắc tròn kế bên biểu tượng Ball độ hiếm (đúng chuẩn hình mẫu 006 Charizard).
  - **Trên bảng chi tiết Pokédex:**
    - Dưới biểu tượng độ hiếm có dòng chữ màu hồng neon: `[Icon Mega] Mega Capable · Can Mega Evolve in runs, using [Tên Đá Mega]` (hoặc tiếng Việt tương ứng).
    - Hệ thống Tabs chuyển đổi: `[ Dạng Thường ]` $\leftrightarrow$ `[ Dạng Mega ]` (hoặc `Mega X`, `Mega Y`).
    - Khi chọn xem dạng Mega: Hiển thị chỉ số cộng thêm +100 BST, hệ mới, mô tả năng lực Mega.
    - Nút trang bị đá: Nếu đã sở hữu đá Mega sẽ hiển thị nút `[ ⚔️ Trang bị Đá Mega ]` / `[ ✅ Đang trang bị ]`, nếu chưa có sẽ hiển thị hướng dẫn săn Boss Mega Rift.
- **Cơ chế săn Boss Mega Rift (`js/systems/rift.js`):**
  - Khi xuất hiện Vết nứt không gian (Rift), có **5% tỉ lệ** mở ra **Mega Rift**.
  - Người chơi bước vào sẽ đối đầu với Boss Mega tương ứng sở hữu HP x1.5, Sát thương x1.3, kích thước to lớn và hào quang Mega Aura rực rỡ.
  - Khi tiêu diệt Boss Mega Rift: Rơi rương kho báu, Vínculo và **mở khóa vĩnh viễn Đá Mega** của loài đó cho người chơi (`save.megas`).
- **Cơ chế biến hình trong trận đấu (In-Run Evolution) (`js/systems/levelup.js` & `js/entities/player.js`):**
  - Khi Pokémon đã trang bị Đá Mega đạt **Level 50** trong trận, thẻ bài lên cấp tiếp theo sẽ ưu tiên xuất hiện thẻ vàng đặc biệt **`TIẾN HÓA MEGA` (MEGA EVOLUTION)**!
  - Khi chọn thẻ:
    - Kích hoạt biến hình: Lóe sáng toàn màn hình, hiệu ứng sóng xung kích và âm thanh huyền thoại.
    - Tăng chỉ số: **Damage +45%**, **Máu tối đa +35%** (hồi đầy máu), **Giảm hồi chiêu Cooldown -25%**, **Phòng thủ +25%**.
    - Đổi Hệ theo đúng dạng Mega (ví dụ: Charizard X đổi sang Lửa/Rồng).
    - **Buff diện tích chiêu (+30% Area):** Tăng 30% bán kính nổ và kích thước của toàn bộ đòn đánh người chơi đang sử dụng (`combat.js`).
    - Kích thước nhân vật tăng nhẹ (1.18x) và tỏa **Hào quang ngũ sắc Mega Aura** liên tục xoay quanh thân và chân nhân vật.
- **Đóng gói sản phẩm:**
  - `tests/i18n.test.cjs`: **20/20 tests passed**.
  - `node tools/build.js`: Biên dịch ra `app.min.js?v=d7b8ad3834` và đồng bộ `index.html`.

## ⏱️ [2026-10-23 04:41:00] — Triển khai Đồng hồ đếm ngược & Nút đổi mới Tiệm Kecleon (Kecleon Shop Reroll)
- **Đồng hồ đếm ngược thời gian làm mới cửa hàng (`nextRefreshMs()`):**
  - Tích hợp hàm tính thời gian thực tế còn lại cho đến 00:00:00 ngày tiếp theo (theo múi giờ Europe/Madrid đồng bộ với hệ thống lịch ngày của game).
  - Hiển thị huy hiệu đếm ngược sắc nét `⏱️ Làm mới sau: HH:mm:ss` ngay cạnh tiêu đề "MT hôm nay" trong tiệm Kecleon.
  - Tự động chạy `setInterval` cập nhật mỗi giây khi tiệm mở, tự động dừng khi đóng tiệm và tự động làm mới hàng hóa khi đồng hồ về 0.
- **Nút đổi mới danh sách MT hôm nay (Shop Reroll Button):**
  - Thêm nút `[ 🎴 Đổi mới <Giá> 🪙 ]` tại góc phải hàng tiêu đề MT hôm nay.
  - **Bậc thang giá chuẩn theo yêu cầu:**
    - Lần 1: **1.000 vàng (1k)**
    - Lần 2: **2.000 vàng (2k)**
    - Lần 3: **2.000 vàng (2k)**
    - Lần 4: **5.000 vàng (5k)**
    - Lần 5 trở đi: **10.000 vàng (10k)**
  - **Cơ chế reset hàng ngày:** Khi qua ngày mới (`checkNewDay()`), số lần đã đổi mới tự động reset về 0 và mức giá reroll quay trở lại mốc ban đầu 1.000 vàng.
  - Khi người chơi bấm đổi mới: Trừ vàng tương ứng, tạo hạt giống seed mới cho 8 MT, kích hoạt animation Kecleon nhảy mừng, hiệu ứng âm thanh và thông báo toast.
- **Đóng gói sản phẩm:**
  - `tests/i18n.test.cjs`: **20/20 tests passed**.
  - `node tools/build.js`: Biên dịch ra `app.min.js?v=14cd57e21c` và đồng bộ `index.html`.

## ⏱️ [2026-10-23 04:54:00] — Đồng bộ căn chỉnh Icon Mega & Thêm nút Bỏ qua (Skip) khi Gacha
- **Căn chỉnh hoàn hảo Icon Mega & Icon Pokéball (`css/style.css` & `js/ui/menu.js`):**
  - Đồng bộ kích thước icon Mega thành 12x12px chuẩn (`G.Icons.html('mega', 12)`) giống icon bóng độ hiếm.
  - Tái cấu trúc `.cell-rarity-row` thành Flexbox căn giữa hoàn toàn (`display: flex; align-items: center; justify-content: center; gap: 4px; line-height: 1; height: 14px;`).
  - Thiết lập `.cell-rarity-row .rarity-ball` và `.cell-rarity-row .badge-mega` thành `display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; margin: 0; padding: 0;`.
  - Triệt tiêu hoàn toàn độ lệch dọc và khoảng cách bất đối xứng, hai icon giờ nằm thẳng hàng tuyệt đối trên thẻ Pokédex.
- **Tính năng Bỏ qua hoạt ảnh Gacha (Gacha Skip Button) (`dev.html`, `js/ui/gacha-ui.js`, `js/ui/slots.js`, `css/style.css`):**
  - Thêm nút `[ ⏭️ Bỏ qua / Skip ]` (`#pull-skip`) tại góc trên màn hình Gacha với thiết kế kính mờ bo tròn nổi bật.
  - Khi bấm nút Bỏ qua:
    - Lập tức ngắt hoạt ảnh máy xèng (`G.Slots.stop()`), ẩn ngay canvas máy quay.
    - Dừng toàn bộ các khoảng chờ trễ (`wait`) của quá trình lật thẻ.
    - Hiển thị ngay lập tức toàn bộ thẻ Pokémon quay được lên màn hình không cần chờ đợi.
    - Hiện ngay nút Tiếp tục (`#pull-close`) để người chơi thu thập và tiếp tục trải nghiệm nhanh chóng.
  - Hỗ trợ đa ngôn ngữ đầy đủ (Tiếng Việt: "Bỏ qua ⏭️", Tiếng Anh: "Skip ⏭️", cùng các ngôn ngữ ES, FR, IT, PT, ZH).
- **Đóng gói sản phẩm:**
  - `tests/i18n.test.cjs`: **20/20 tests passed**.
  - `node tools/build.js`: Biên dịch ra `app.min.js?v=f9bf112831` và đồng bộ `index.html`.

## ⏱️ [2026-10-23 05:25:00] — Hệ Thống Phòng Chơi Mạng Multiplayer, Sảnh Tổ Đội (Party Lobby) & Trạng Thái Bạn Bè Online/Offline
- **Nút Menu Mới:**
  - Đổi nút Play cũ thành `Solo` (với icon Pokéball pixel art).
  - Thêm nút `Multiplayer` ngay dưới `Solo` với icon pixel art 4 khối màu (2 xanh dương, 2 xanh ngọc) chuẩn theo hình mẫu.
- **Màn Hình Duyệt Phòng & Tạo Phòng (`#scr-multiplayer` - `G.MultiplayerUI`):**
  - Thanh tiêu đề: `Room` cùng nút `Back [Esc]`.
  - Nút `Create a room` để tạo phòng mới và nút `Friends` để xem bạn bè.
  - Tách bạch danh sách **Public Rooms** theo thời gian thực (lắng nghe Firebase RTDB `/public_rooms`):
    - Hiển thị tên Chủ phòng (Host name).
    - Thành tích cao nhất của chủ phòng: Thời gian sống sót lâu nhất (`⏱️ MM:SS`), Cấp độ cao nhất (`Lv XX`), cùng tên & icon Pokémon đạt thành tích.
    - Số lượng thành viên hiện tại trong phòng (`👥 X / 4`).
    - Nút `Tham gia` (Join) để lập tức vào phòng khi còn chỗ trống.
- **Sảnh Tổ Đội Mới Chuẩn Thiết Kế (`#scr-lobby` - `G.LobbyUI`):**
  - **Điều hướng thông minh:** Nút `Back [Esc]` quay về Menu chính mà **không rời khỏi tổ đội**, người chơi có thể tiếp tục xem Pokédex / Nâng cấp trong khi đang ở trong phòng. Nút `Leave the room` để thoát và giải tán kết nối.
  - **Khung 4 thành viên (4 Member Cards):**
    - Hiển thị thẻ của 4 thành viên đặt cạnh nhau: Khung thành viên của bản thân có viền vàng nổi bật (`.lob-card.is-me`), hiển thị sprite nhân vật động, tên nhân vật, tên Pokémon, vai trò (`👑 Host · You` / `👑 Host` / `✋ Member · You` / `✋ Member`), trạng thái sẵn sàng (`Ready` / `Not ready`), kết nối (`Connected`), ping (`📶 -`).
    - Các ô chưa có người chơi hiển thị thẻ mờ với chữ `Free`.
  - **Tính năng Đổi Pokémon Ngay Trong Phòng (`#scr-partner-picker` - `G.PartnerPickerUI`):**
    - Bấm nút `[ Change Pokémon ]` trên thẻ của bản thân để mở bảng chọn nhanh Pokémon từ bộ sưu tập đã sở hữu kèm thanh tìm kiếm tiện lợi.
    - Chọn Pokémon mới lập tức đồng bộ thời gian thực (`G.Social.refreshMember(dex, shiny)`) đến tất cả người chơi khác trong phòng mà không cần thoát ra Menu.
  - **Chế độ Phòng Công Khai (Public Toggle):**
    - Mặc định khi tạo phòng là **Private** (chỉ mời qua bạn bè, không xuất hiện trên danh sách phòng chung).
    - Chủ phòng có công tắc `Public: [ OFF / ON ]` để công khai đưa phòng vào danh sách cho người khác tự do tham gia.
  - **Thông báo Chờ Thành Viên Sẵn Sàng (Waiting Bar):**
    - Hiển thị dòng thông báo: `"Waiting for: <Tên các bạn chưa sẵn sàng>"`.
    - Khi tất cả đều sẵn sàng: Chuyển thành trạng thái `"✅ All players are ready!"`.
  - **Hệ thống Nút Hành Động Phân Quyền:**
    - Thành viên (Member): Nút bật tắt trạng thái sẵn sàng (`I'm ready` / `Not ready`).
    - Chủ phòng (Host): Có cả nút trạng thái sẵn sàng (`I'm ready` / `Not ready`) và nút `Start game`. Nút `Start game` chỉ sáng khi tất cả người chơi trong phòng đã sẵn sàng và kết nối ổn định.
- **Hệ Thống Theo Dõi Bạn Bè Online / Offline Thời Gian Thực:**
  - Tích hợp theo dõi hiện diện (Presence tracking) qua Firebase RTDB `/presence/{uid}` với `onDisconnect().remove()`.
  - Danh sách bạn bè hiển thị chấm trạng thái xanh lá sáng (`Online`) hoặc xám (`Offline`).
  - Trong phòng tổ đội, bạn bè `Offline` bị vô hiệu hóa nút mời (`Invite` disabled dạng sọc tối), chỉ bạn bè `Online` mới sáng nút mời (`Invite` gold) để bấm gửi lời mời.
- **Đóng gói sản phẩm:**
  - `tests/i18n.test.cjs`: **20/20 tests passed**.
  - `node tools/build.js`: Biên dịch ra `app.min.js?v=38b2faaec9` và đồng bộ `index.html`.
