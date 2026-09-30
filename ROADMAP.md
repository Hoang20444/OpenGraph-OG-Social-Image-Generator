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
| **Phase 5** | **Real-World Usability & Creator Workflow** (Vercel Analytics, Copy Image trực tiếp, Custom Colors, Phông chữ, Highlight, Mẫu đã lưu) | 🟢 HOÀN THÀNH | 100% |

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

### 💎 Giai Đoạn 5: Trải Nghiệm Thực Tế Toàn Diện Cho Người Thật (Real-World 100% Polish)
*Mục tiêu: Đưa ứng dụng đạt độ hoàn thiện cao nhất phục vụ người dùng thực tế, từ đo lường traffic đến tối ưu từng thao tác nhỏ nhất.*

- [x] **5.1. Tích Hợp Vercel Web Analytics Miễn Phí:**
  - Cài đặt `@vercel/analytics/react` và kích hoạt tự động trên Vercel không cần cấu hình phức tạp.
  - Theo dõi người dùng thực tế, thiết bị, quốc gia với chi phí $0.
- [x] **5.2. Sao Chép Trực Tiếp Vào Bộ Nhớ Tạm (Copy Image to Clipboard):**
  - Nút "📋 Sao chép ảnh (Ctrl+V)": Ghi ảnh trực tiếp vào Clipboard API (`new ClipboardItem({'image/png': blob})`).
  - Dán ảnh ngay lập tức vào Twitter/X, Discord, Slack, Telegram, Figma hoặc Notion mà không cần tải file về máy rồi upload lại.
- [x] **5.3. Tùy Chọn Tỷ Lệ Độ Phân Giải & Định Dạng Xuất:**
  - Bộ chuyển đổi tỷ lệ `1X`, `2X (Retina)`, `3X (4K Ultra HD)`.
  - Tùy chọn định dạng file `PNG` (sắc nét không nén) và `JPG` (nhẹ tải nhanh cho blog/website).
  - Tự động tạo tên file thông minh theo slug tiêu đề: `snapog-[ten-bai-viet]-2x.png`.
- [x] **5.4. Xưởng Màu Tùy Chỉnh (Custom Color Studio):**
  - Chuyển đổi giữa bảng màu có sẵn (Presets) và Bảng màu Tự do (Custom Colors).
  - Tự do chọn mã màu Primary, Secondary, Background và góc nghiêng Gradient Angle (0° - 360°).
- [x] **5.5. Hệ Thống Phông Chữ Đa Dạng & Nhấn Mạnh Từ Khóa (Keyword Highlighting):**
  - Bộ chọn 7 phông chữ cao cấp: `Inter Clean`, `Plus Jakarta`, `Space Grotesk`, `Syne Bold`, `JetBrains Mono`, `Caveat Marker`, `Newsreader Serif`.
  - Ô "Highlight Accent Word": Tự động phát hiện và tô màu gradient rực rỡ kèm gạch chân dạ quang cho từ khóa quan trọng trong tiêu đề.
- [x] **5.6. Quản Lý Thiết Kế Cá Nhân & Tự Động Lưu (LocalStorage Autosave & My Designs):**
  - Tự động lưu thiết kế đang làm vào LocalStorage (F5 hoặc tắt máy mở lại không bao giờ mất dữ liệu).
  - Nút "💾 Mẫu đã lưu (My Designs)" trên thanh Header: Lưu trữ tối đa 20 thiết kế yêu thích, mở lại hoặc xóa bất cứ lúc nào.
  - Nút "Khôi phục thiết kế ban đầu" (Reset to Defaults).
- [x] **5.7. Mở Rộng Kích Thước Mạng Xã Hội:**
  - Bổ sung `YouTube Thumbnail` (`1280x720`), `Twitter Header Banner` (`1500x500`), `Product Hunt Gallery` (`1270x760`).

---

*Tài liệu này được TinyForge Studio duy trì và cập nhật xuyên suốt quá trình phát triển.*
