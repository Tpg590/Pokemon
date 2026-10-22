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
