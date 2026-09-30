import React, { useState } from 'react';
import {
  X,
  Crown,
  Check,
  Sparkles,
  CreditCard,
  QrCode,
  Key,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Logo from './Logo';
import { PAYMENT_CONFIG } from '../data/paymentConfig';

export default function ProModal({
  isOpen,
  onClose,
  isPro,
  onActivatePro,
  onDeactivatePro,
  onNotify
}) {
  const [activePaymentTab, setActivePaymentTab] = useState('vietqr'); // 'vietqr' | 'gumroad' | 'license'
  const [inputKey, setInputKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const VALID_KEYS = [
    'TINYFORGE-PRO-2026',
    'SNAP-HOANG-VIP',
    'SNAP-LIFETIME-PRO',
    'PRO-DEV-2026'
  ];

  const handleApplyKey = (keyToTest) => {
    const key = (keyToTest || inputKey).trim().toUpperCase();
    if (VALID_KEYS.includes(key) || /^(SNAP|TINYFORGE)-PRO-[A-Z0-9]+$/i.test(key)) {
      onActivatePro();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      onNotify('🎉 Chúc mừng! Bản quyền SnapOG PRO đã được kích hoạt vĩnh viễn!');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('Mã License Key không hợp lệ. Vui lòng kiểm tra lại!');
    }
  };

  // If already PRO, display membership details & features
  if (isPro) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="glass-panel"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '560px',
            background: 'var(--bg-surface-elevated)',
            borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(6, 182, 212, 0.15))',
            padding: '24px 28px',
            borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
              }}>
                <Crown size={26} color="#ffffff" />
              </div>
              <div>
                <h2 className="font-heading" style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                  SnapOG <span style={{ color: '#10b981' }}>PRO Member</span>
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Gói Bản Quyền Vĩnh Viễn • TinyForge Studio
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                padding: '6px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-muted)'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                  Tài khoản của bạn đã được kích hoạt đầy đủ quyền hạn PRO!
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Không giới hạn lượt tải, mở khóa 100% template & công cụ tự động hóa.
                </div>
              </div>
            </div>

            {/* Unlocked Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Đặc quyền đang hoạt động:
              </span>
              {[
                'Mở khóa toàn bộ 15+ Mẫu thiết kế độc quyền (Podcast, Cyberpunk HUD...)',
                'Xuất ảnh chất lượng cao 4K / 3X Retina sắc nét',
                'Batch CSV Generator (Tự động sinh hàng chục ảnh trong 1 giây)',
                'Tải lên Logo & Watermark thương hiệu cá nhân không giới hạn',
                'Lưu mẫu và chia sẻ thiết kế qua liên kết thông minh',
                'Cập nhật tính năng mới trọn đời không tốn thêm chi phí'
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#f8fafc' }}>
                  <Check size={15} color="#10b981" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={onClose}
                className="btn-emerald"
                style={{ flex: 1, padding: '12px', fontSize: '14px', justifyContent: 'center' }}
              >
                Tiếp tục sáng tạo ngay
              </button>
            </div>

            {onDeactivatePro && (
              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc muốn hủy kích hoạt PRO trên trình duyệt này?')) {
                      onDeactivatePro();
                      onClose();
                    }
                  }}
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-dim)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Hủy kích hoạt trên thiết bị này (Dành cho kiểm thử)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If NOT Pro, show checkout & activation
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'var(--bg-surface-elevated)',
          borderRadius: '20px',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Header with Gold/Orange gradient */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15))',
          padding: '24px 28px',
          borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Logo size={44} />
            <div>
              <h2 className="font-heading" style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                SnapOG <span style={{ color: '#f59e0b' }}>PRO Studio</span>
              </h2>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                TinyForge • Thanh Toán 1 Lần • Sở Hữu Vĩnh Viễn • 0đ Phí Duy Trì
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Feature Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px'
          }}>
            {[
              'Toàn bộ 15+ Mẫu Design Engines',
              'Mẫu Podcast & Cyberpunk HUD độc quyền',
              'Batch CSV Generator (20+ ảnh trong 1s)',
              'Tải Logo & Watermark riêng',
              'Xuất ảnh chất lượng 4K Vector/Retina',
              'Cập nhật tính năng mới trọn đời'
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f8fafc' }}>
                <Check size={14} color="#10b981" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Pricing Banner */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Ưu Đãi Ra Mắt (Giảm 67%)
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>49.000₫</span>
                <span style={{ fontSize: '15px', color: 'var(--text-dim)' }}>hoặc $9 USD</span>
                <span style={{ fontSize: '12px', textDecoration: 'line-through', color: '#ef4444' }}>149.000₫</span>
              </div>
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              LIFETIME PASS
            </div>
          </div>

          {/* Payment Method Switcher */}
          <div>
            <div style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px'
            }}>
              {[
                { id: 'vietqr', label: 'Quét mã VietQR (VND)', icon: QrCode },
                { id: 'gumroad', label: 'Quốc Tế / Thẻ (USD)', icon: CreditCard },
                { id: 'license', label: 'Nhập License Key', icon: Key }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activePaymentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActivePaymentTab(tab.id);
                      setErrorMsg('');
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      background: isSelected ? 'var(--color-primary)' : 'transparent',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: VIETQR */}
            {activePaymentTab === 'vietqr' && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px'
              }}>
                <div style={{
                  padding: '12px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  display: 'inline-block',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
                }}>
                  <img
                    src={PAYMENT_CONFIG.getQrUrl()}
                    alt="VietQR Code"
                    style={{ width: '180px', height: 'auto', display: 'block', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                    Quét mã thanh toán chuyển khoản VietQR tự động
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px', lineHeight: '1.6' }}>
                    Ngân hàng: <strong style={{ color: '#ffffff' }}>{PAYMENT_CONFIG.bank.bankId}</strong> • STK: <strong style={{ color: '#ffffff' }}>{PAYMENT_CONFIG.bank.accountNo}</strong> ({PAYMENT_CONFIG.bank.accountName})<br />
                    Số tiền: <strong style={{ color: '#10b981' }}>{PAYMENT_CONFIG.bank.amount.toLocaleString()} VND</strong> • Nội dung: <strong style={{ color: 'var(--color-primary)' }}>{PAYMENT_CONFIG.bank.memo}</strong>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  width: '100%',
                  textAlign: 'left',
                  marginTop: '4px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>
                    💡 Hướng dẫn nhận mã kích hoạt sau khi thanh toán:
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    1. Mở App ngân hàng quét mã QR chuyển khoản <strong>49.000₫</strong> với nội dung trên.<br />
                    2. Chụp ảnh màn hình giao dịch thành công.<br />
                    3. Gửi ảnh qua Zalo/Email hoặc liên hệ tác giả để nhận mã <strong>License Key</strong> kích hoạt ngay lập tức.<br />
                    4. Chuyển sang tab <strong>"Nhập License Key"</strong> bên cạnh để mở khóa vĩnh viễn!
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GUMROAD / BUY ME A COFFEE */}
            {activePaymentTab === 'gumroad' && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={22} color="#10b981" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                      Thanh toán Quốc tế qua Lemon Squeezy / Gumroad / BuyMeACoffee
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      Hỗ trợ thẻ Visa, Mastercard, PayPal & Apple Pay với 0đ phí duy trì hàng tháng.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a
                    href={PAYMENT_CONFIG.gumroadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ width: '100%', fontSize: '13px', padding: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <span>Thanh toán $9 qua Gumroad</span>
                    <ExternalLink size={14} />
                  </a>

                  <a
                    href={PAYMENT_CONFIG.coffeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ width: '100%', fontSize: '13px', padding: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#f59e0b' }}
                  >
                    <span>Ủng hộ $9 qua Buy Me a Coffee</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}

            {/* TAB 3: LICENSE KEY INPUT */}
            {activePaymentTab === 'license' && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <label className="input-label">Nhập License Key bản quyền của bạn</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <input
                      type="text"
                      value={inputKey}
                      onChange={(e) => {
                        setInputKey(e.target.value);
                        setErrorMsg('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyKey();
                      }}
                      placeholder="e.g. TINYFORGE-PRO-XXXX"
                      className="input-field font-mono"
                      style={{ textTransform: 'uppercase' }}
                    />
                    <button
                      onClick={() => handleApplyKey()}
                      className="btn-primary"
                      style={{ whiteSpace: 'nowrap', padding: '0 18px' }}
                    >
                      Kích hoạt
                    </button>
                  </div>
                  {errorMsg && (
                    <div style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '8px' }}>
                      {errorMsg}
                    </div>
                  )}
                </div>

                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-dim)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  lineHeight: '1.6'
                }}>
                  🔒 <strong>Lưu ý:</strong> Mã License Key có giá trị vĩnh viễn. Bạn có thể sử dụng lại mã này bất kỳ lúc nào trên các thiết bị hoặc trình duyệt khác của bạn.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-dim)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Bảo hành hoàn tiền trong 14 ngày nếu không hài lòng</span>
          </div>
          <span>TinyForge Studio</span>
        </div>
      </div>
    </div>
  );
}
