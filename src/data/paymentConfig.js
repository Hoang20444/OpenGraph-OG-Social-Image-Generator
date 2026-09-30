// =============================================================================
// CẤU HÌNH THANH TOÁN & MÃ QR - TINYFORGE STUDIO
// Bạn có thể chỉnh sửa toàn bộ thông tin tài khoản ngân hàng và mã QR tại đây!
// =============================================================================

export const PAYMENT_CONFIG = {
  // ---------------------------------------------------------------------------
  // CÁCH 1: NẾU BẠN CÓ ẢNH QR RIÊNG (Ví dụ ảnh chụp màn hình mã QR ngân hàng/MoMo):
  // - Hãy lưu ảnh đó vào thư mục "public/my-qr.png"
  // - Sau đó bật useLocalQr: true
  // ---------------------------------------------------------------------------
  useLocalQr: true,
  localQrPath: '/my-qr.jpg', // Đổi thành tên file ảnh của bạn trong thư mục public

  // ---------------------------------------------------------------------------
  // CÁCH 2: TỰ ĐỘNG SINH MÃ VIETQR CHUẨN NGÂN HÀNG (Tự động điền số tiền + nội dung):
  // (Hỗ trợ hầu hết ngân hàng: MB, VCB, TCB, VPB, TPB, ACB, OCB, BIDV, VIB, CTG...)
  // ---------------------------------------------------------------------------
  bank: {
    bankId: 'TPBank', // Mã ngân hàng: MB, VCB, TCB, VPB, TPB, ACB, BIDV...
    accountNo: '00000111451', // SỐ TÀI KHOẢN NGÂN HÀNG CỦA BẠN
    accountName: 'becheerful2 (NGUYEN VIET HOANG)', // TÊN CHỦ TÀI KHOẢN (In hoa không dấu)
    amount: 49000, // Số tiền (VNĐ)
    memo: 'SNAPOG PRO', // Nội dung chuyển khoản tự động
  },

  // ---------------------------------------------------------------------------
  // THỊ TRƯỜNG QUỐC TẾ (USD):
  // Đường link sản phẩm trên Gumroad hoặc Lemon Squeezy của bạn
  // ---------------------------------------------------------------------------
  gumroadUrl: 'https://gumroad.com', // Thay bằng link sản phẩm Gumroad của bạn

  // Link tài khoản Buy Me a Coffee / Ko-fi
  coffeeUrl: 'https://buymeacoffee.com/nvhoang',

  // ---------------------------------------------------------------------------
  // HÀM TIỆN ÍCH LẤY ĐƯỜNG DẪN ẢNH QR:
  // ---------------------------------------------------------------------------
  getQrUrl() {
    if (this.useLocalQr && this.localQrPath) {
      return this.localQrPath;
    }
    // Sử dụng API VietQR chuẩn quốc gia, tự sinh mã QR có logo ngân hàng & số tiền
    const { bankId, accountNo, amount, memo, accountName } = this.bank;
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(accountName)}`;
  }
};
