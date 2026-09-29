# 🚀 Kế Hoạch Phát Triển Chi Tiết (Master Roadmap) — SnapOG Studio (TinyForge)

> **Slogan:** The Human-Crafted Social & OpenGraph Image Studio  
> **Brand:** TinyForge Studio  
> **Chi phí vận hành:** $0/tháng (Zero-cost architecture)  
> **Mục tiêu:** Trở thành công cụ tạo ảnh thumbnail/OG số 1 dành cho Creators, Developers, Writers & Indie Hackers với trải nghiệm người dùng vượt trội, mang đậm tính thủ công (human craft) và tự động hóa cao.

---

## 📌 Tổng Quan Tiến Trình (Progress Tracker)

| Giai Đoạn | Trọng Tâm | Trạng Thái | Tiến Độ |
| :--- | :--- | :---: | :---: |
| **Phase 1** | **Human Craft & High-End Controls** (5 mẫu thủ công, font Caveat/Newsreader, 3D tilt, stickers, sliders) | 🟢 HOÀN THÀNH | 100% |
| **Phase 2** | **Instant Gallery Grid & Shuffle Palette** (Lưới xem đồng thời 11 mẫu, đổi màu ngẫu nhiên) | 🟢 HOÀN THÀNH | 100% |
| **Phase 3** | **Magic URL Auto-Fill** (Bóc tách metadata tự động từ link bài viết bất kỳ với $0 API) | 🟢 HOÀN THÀNH | 100% |
| **Phase 4** | **URL Sharing, Batch Export & Commercial Polish** (Chia sẻ link cấu hình, xuất ảnh hàng loạt, SEO) | 🟢 HOÀN THÀNH | 100% |

---

## 🛠️ Chi Tiết Từng Giai Đoạn & Hạng Mục Thực Thi

### 🎨 Giai Đoạn 1: Thẩm Mỹ Thủ Công (Human Craft) & Bộ Điều Khiển Cao Cấp
*Mục tiêu: Đem lại cảm xúc chân thật, tính thẩm mỹ cao cấp, phá vỡ cảm giác "AI tạo ra / công nghiệp phẳng".*

- [x] **1.1. Hệ thống Typography Con Người:**
  - Tích hợp Google Font `Caveat` (nét chữ viết tay tự nhiên).
  - Tích hợp Google Font `Newsreader` (serif editorial thanh lịch phong cách tạp chí cổ điển).
  - Tích hợp font Inter, JetBrains Mono, Syne, Space Grotesk.
- [x] **1.2. Mở rộng 5 Mẫu Template Độc Bản:**
  - `handcrafted-note`: Sổ tay ghi chép với washi tape, nét vẽ doodle highlight, nhãn dán thủ công.
  - `retro-paper`: Giấy kraft màu be ấm áp, font báo in, khung tem bưu chính cổ điển.
  - `floating-3d`: Phối cảnh 3D không gian (`perspective(1000px) rotateX(4deg) rotateY(-4deg)`) với bóng đổ mịn.
  - `safari-window`: Khung trình duyệt macOS Safari với thanh URL mờ ảo, nút điều khiển cửa sổ.
  - `quote-focus`: Định dạng trích dẫn truyền cảm hứng với dấu ngoặc kép lớn và chân dung tác giả.
- [x] **1.3. Bộ Điều Khiển Tùy Biến Nâng Cao (Custom Sliders & Toggles):**
  - Thanh trượt bo góc `Border Radius` (0px - 36px).
  - Thanh trượt khoảng đệm lề `Inner Padding` (40px - 100px).
  - Lựa chọn bóng đổ `Shadow Depth` (None, Soft, Deep 3D, Cyber Glow).
  - Nút bật/tắt hiệu ứng không gian `3D Perspective Tilt`.
  - Bộ sưu tập nhãn dán thủ công `Stickers` (⭐ MUST READ, 💡 PRO TIP, 🔥 TRENDING, 🚀 NEW RELEASE).

---

### ⚡ Giai Đoạn 2: Lưới Xem Nhanh Đồng Thời (Instant Gallery Grid) & Xúc Xắc Đổi Màu
*Mục tiêu: Tối ưu thời gian thao tác — Gõ tiêu đề 1 lần, xem tất cả 11 phong cách cùng lúc và chọn ngay mẫu ưng ý nhất.*

- [x] **2.1. Chế Độ Xem Gallery Grid (Instant Visual Switcher):**
  - Thêm nút chuyển chế độ trên thanh công cụ: `Single Canvas` vs `Instant Gallery (11 LIVE)`.
  - Khi bật `Instant Gallery`, hiển thị lưới 11 card render real-time tiêu đề, tác giả, màu sắc người dùng đang nhập.
  - Phân loại bộ lọc: `All (11)`, `✍️ Human Craft (3)`, `⚡ 3D & Tech (5)`, `📰 Editorial (3)`.
  - 1-click vào card bất kỳ: Áp dụng ngay template đó và chuyển sang chế độ Single Canvas để tùy chỉnh sâu.
  - Nút tải trực tiếp (Quick Download PNG) ngay trên từng card trong lưới.
- [x] **2.2. Nút Xúc Xắc Đổi Màu Ngẫu Nhiên (Shuffle Magic Palette):**
  - Nút "🎲 Shuffle Palette" trên thanh màu sắc.
  - Thêm 4 bảng màu mới (Tokyo Cyberpunk, Matcha Forest, Nordic Glacier, Artisan Espresso).
  - Bấm 1 chạm: Chọn ngẫu nhiên bảng màu hài hòa kết hợp gradient cực đẹp.

---

### 🪄 Giai Đoạn 3: Tính Năng Sát Thủ — "Magic URL Auto-Fill"
*Mục tiêu: Người dùng dán link bài viết bất kỳ (Medium, Dev.to, Substack, Blog cá nhân, GitHub), ứng dụng tự bóc tách thông tin và tạo ảnh trong 3 giây mà không tốn chi phí server ($0).*

- [x] **3.1. Giao diện "Magic URL Auto-Fill":**
  - Tích hợp card nhập URL nhanh ngay tại tab Content: *"Paste article or GitHub link..."*.
  - Nút bấm `Auto-Fill` với hiệu ứng loading spinner mượt mà.
- [x] **3.2. Bộ Bóc Tách OpenGraph Client-Side ($0 Cost):**
  - Xử lý chuyên sâu cho GitHub Repository: Tự bóc tách repo name, stars, language, author avatar và tự chọn template `dev-terminal`.
  - Sử dụng Microlink API miễn phí và AllOrigins CORS fallback bóc tách `og:title`, `og:description`, `og:image`, `author`, `publisher`.
  - Tự động điền tất cả các trường dữ liệu vào Canvas chỉ sau 1 click.

---

### 📦 Giai Đoạn 4: Chia Sẻ Cấu Hình Qua URL & Tối Ưu Hóa Thương Mại
*Mục tiêu: Đưa ứng dụng thành một sản phẩm lan tỏa tự nhiên (viral loop) và hỗ trợ tạo hàng loạt.*

- [x] **4.1. URL State Synchronization (Shareable Links):**
  - Mã hóa toàn bộ trạng thái thiết kế vào URL query parameters (`title`, `sub`, `tag`, `tpl`, `theme`, `stk`, `tilt`).
  - Nút "🔗 Share" trên thanh Header: Tự động sao chép link và cập nhật thanh địa chỉ URL.
  - Tự động khôi phục giao diện khi có người mở link được chia sẻ.
- [x] **4.2. Batch Export Preview & Đóng gói ZIP (JSZip):**
  - Modal `Batch Generator & ZIP Export` cho phép nhập danh sách nhiều tiêu đề bài viết.
  - Tự động kết xuất ảnh retina 2X từng tiêu đề, hiển thị tiến độ (0% - 100%), đóng gói thành file `.zip` và tự tải về máy kèm hiệu ứng pháo hoa confetti.
- [x] **4.3. Hoàn thiện Build, Đóng gói & Tự động triển khai:**
  - Build sạch sẽ 100% không có lỗi.
  - Tự động commit và đẩy mã nguồn lên GitHub `Hoang20444/OpenGraph-OG-Social-Image-Generator` để Vercel deploy bản mới nhất.

---

*Tài liệu này được TinyForge Studio duy trì và cập nhật xuyên suốt quá trình phát triển.*
