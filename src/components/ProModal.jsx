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
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Logo from './Logo';
import { PAYMENT_CONFIG } from '../data/paymentConfig';

export default function ProModal({
  isOpen,
  onClose,
  isPro,
  onActivatePro,
  onNotify
}) {
  const [activePaymentTab, setActivePaymentTab] = useState('vietqr'); // 'vietqr' | 'gumroad' | 'license'
  const [inputKey, setInputKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleApplyKey = (keyToTest) => {
    const key = (keyToTest || inputKey).trim().toUpperCase();
    if (key === 'PRO-DEV-2026' || key.startsWith('SNAP-')) {
      onActivatePro();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onNotify('🎉 Congratulations! SnapOG PRO has been unlocked successfully!');
      onClose();
    } else {
      setErrorMsg('Invalid License Key. Try the demo key: PRO-DEV-2026');
    }
  };

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
                TinyForge • Pay Once • Own Forever • Zero Subscription
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
              'All 15+ PRO Design Engines',
              'Podcast & Cyberpunk HUD Templates',
              'Batch CSV Generator (20+ cards in 1s)',
              'Custom Logo & Watermark Upload',
              'Retina 4K High-Res Vector Output',
              'Priority Lifetime Upgrades'
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
                Special Launch Price
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>49.000₫</span>
                <span style={{ fontSize: '15px', color: 'var(--text-dim)' }}>or $9 USD</span>
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
              LIFETIME ACCESS
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
                { id: 'vietqr', label: 'Quét mã (VND)', icon: QrCode },
                { id: 'gumroad', label: 'Gumroad / Card (USD)', icon: CreditCard },
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

            {/* TAB 1: VIETQR DEMO */}
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
                  {/* Real-time Dynamic VietQR Code or Custom Image */}
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

                {/* Instant Unlock Demo Button for testing */}
                <button
                  onClick={() => handleApplyKey('PRO-DEV-2026')}
                  className="btn-emerald"
                  style={{ width: '100%', fontSize: '13px', marginTop: '6px' }}
                >
                  <Sparkles size={15} />
                  <span>Mô phỏng thanh toán thành công (Bấm để kích hoạt PRO)</span>
                </button>
              </div>
            )}

            {/* TAB 2: GUMROAD / LEMON SQUEEZY */}
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
                      Thanh toán Quốc tế qua Lemon Squeezy / Gumroad
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      Hỗ trợ thẻ Visa, Mastercard, PayPal & Apple Pay với 0đ phí duy trì.
                    </div>
                  </div>
                </div>

                <a
                  href={PAYMENT_CONFIG.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '13px', padding: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <span>Chuyển tới trang thanh toán Gumroad ($9)</span>
                  <ExternalLink size={14} />
                </a>
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
                  <label className="input-label">Nhập License Key đã nhận qua Email</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="e.g. PRO-DEV-2026"
                      className="input-field font-mono"
                      style={{ textTransform: 'uppercase' }}
                    />
                    <button
                      onClick={() => handleApplyKey()}
                      className="btn-primary"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Kích hoạt
                    </button>
                  </div>
                  {errorMsg && (
                    <div style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '6px' }}>
                      {errorMsg}
                    </div>
                  )}
                </div>

                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-dim)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Demo Key: <strong>PRO-DEV-2026</strong></span>
                  <button
                    onClick={() => handleApplyKey('PRO-DEV-2026')}
                    style={{ color: 'var(--color-primary)', fontWeight: 700 }}
                  >
                    Tự động điền & Kích hoạt
                  </button>
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
