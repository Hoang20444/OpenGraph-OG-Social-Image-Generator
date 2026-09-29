# 🚀 SnapOG Studio — Hướng Dẫn Vận Hành & Kiếm Tiền Thực Chiến (Vốn 0đ)

Chào bạn! Dự án **SnapOG Studio** đã được xây dựng hoàn chỉnh với tiêu chuẩn giao diện và trải nghiệm (UI/UX) cao cấp nhất theo bộ chỉ dẫn `ui-ux-pro-max`. Toàn bộ ứng dụng chạy **100% Client-Side**, nghĩa là bạn không tốn dù chỉ 1 đồng tiền duy trì server!

---

## 1. Cách Chạy và Deploy Dự Án Lên Mạng (0 VNĐ)

### A. Chạy ở môi trường Local
```bash
# Cài đặt thư viện (nếu clone máy mới)
npm install

# Khởi động server phát triển
npm run dev
# Mở trình duyệt tại: http://localhost:5173
```

### B. Đưa lên Internet miễn phí bằng Vercel (Khuyên dùng)
1. Đẩy toàn bộ source code này lên một GitHub repository cá nhân.
2. Truy cập [vercel.com](https://vercel.com) -> Đăng nhập bằng tài khoản GitHub.
3. Chọn **Add New Project** -> Chọn repo vừa đẩy lên -> Bấm **Deploy**.
4. Trong vòng 1 phút, bạn sẽ có domain miễn phí vĩnh viễn: `https://snapog-studio.vercel.app`.

---

## 2. Cách Kích Hoạt Cổng Kiếm Tiền Thật (0đ Phí Khởi Tạo)

Trong code, hệ thống đã dựng sẵn **3 luồng kiếm tiền** sẵn sàng kết nối:

### 💰 Kênh 1: Bán Gói PRO 49.000₫ qua VietQR (Thị trường Việt Nam)
* **Nền tảng:** Sử dụng [PayOS.vn](https://payos.vn) hoặc [SePay.vn](https://sepay.vn).
* **Chi phí:** 0đ phí duy trì hàng tháng. Gói Free cho phép xử lý hàng chục giao dịch đầu tiên hoàn toàn miễn phí.
* **Cách vận hành:**
  1. Đăng ký tài khoản trên PayOS / SePay và liên kết số tài khoản ngân hàng của bạn.
  2. Họ cung cấp cho bạn 1 link webhook hoặc link QR động.
  3. Khi khách quét mã QR thành công, hệ thống tự động lưu cờ `isPro = true` vào trình duyệt của khách hàng.

### 💳 Kênh 2: Bán Gói PRO $9 qua Gumroad / Lemon Squeezy (Thị trường Quốc Tế)
* **Nền tảng:** [Gumroad.com](https://gumroad.com) hoặc [LemonSqueezy.com](https://lemonsqueezy.com).
* **Chi phí:** 0đ mở tài khoản, 0đ duy trì. Họ chỉ trích một phần trăm nhỏ khi phát sinh giao dịch mua thành công.
* **Cách vận hành:**
  1. Tạo 1 sản phẩm số trên Gumroad: *"SnapOG Studio — Lifetime Pro License"*.
  2. Gumroad có tính năng tự động tạo License Key cho khách hàng khi thanh toán xong.
  3. Trong file [src/components/ProModal.jsx](file:///d:/MyP/idea/src/components/ProModal.jsx), thay link nút Gumroad bằng đường link sản phẩm thật của bạn.

### ☕ Kênh 3: Đặt Nút Ủng Hộ (Buy Me A Coffee / Ko-fi)
* Đăng ký tài khoản miễn phí tại [buymeacoffee.com](https://buymeacoffee.com).
* Thay link ở file [src/components/CoffeeModal.jsx](file:///d:/MyP/idea/src/components/CoffeeModal.jsx) bằng link trang cá nhân của bạn.

---

## 3. Kiến Trúc Mã Nguồn (Code Architecture)

* [src/index.css](file:///d:/MyP/idea/src/index.css): Toàn bộ Design System (tokens, dark-mode OLED, glassmorphism, hiệu ứng glow).
* [src/data/templates.js](file:///d:/MyP/idea/src/data/templates.js): Dữ liệu 6 Templates, bảng màu, tỉ lệ khung hình (1200x630, Twitter 16:9, Instagram 1:1, Story 9:16).
* [src/components/CanvasPreview.jsx](file:///d:/MyP/idea/src/components/CanvasPreview.jsx): Bộ render canvas thời gian thực, zoom linh hoạt và mô phỏng giao diện Twitter/Facebook/LinkedIn.
* [src/components/Sidebar.jsx](file:///d:/MyP/idea/src/components/Sidebar.jsx): Bảng điều khiển chia tab mượt mà (Layouts, Content, Themes, Pro Pack).
* [src/components/ExportToolbar.jsx](file:///d:/MyP/idea/src/components/ExportToolbar.jsx): Thanh công cụ xuất ảnh Retina 2X, copy trực tiếp vào Clipboard, bắn pháo hoa confetti.
* [src/components/ProModal.jsx](file:///d:/MyP/idea/src/components/ProModal.jsx): Giao diện thanh toán VietQR và Gumroad.
* [src/components/MetaTagsModal.jsx](file:///d:/MyP/idea/src/components/MetaTagsModal.jsx): Trình tạo mã `<meta>` tự động cho HTML và Next.js.
