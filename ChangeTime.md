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
