import React, { useState } from 'react';
import { X, Coffee, Heart, Check, ExternalLink, Sparkles, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PAYMENT_CONFIG } from '../data/paymentConfig';

export default function CoffeeModal({
  isOpen,
  onClose,
  onNotify
}) {
  const [selectedAmount, setSelectedAmount] = useState(3);
  const [isThanked, setIsThanked] = useState(false);

  if (!isOpen) return null;

  const handleSimulateTip = (amount) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    setIsThanked(true);
    onNotify(`☕ Wow! Thank you so much for supporting with a $${amount} coffee!`);
    setTimeout(() => {
      setIsThanked(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'var(--bg-surface-elevated)',
          borderRadius: '20px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(239, 68, 68, 0.1))',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <Coffee size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff' }}>
                Buy the Maker a Coffee
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Support free & open-source indie tools
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
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Hi! I am a fresh IT graduate building independent software in my spare time. 
            If SnapOG saved you 30 minutes in Figma, consider buying me a coffee to keep the servers running! ☕
          </p>

          {/* Amount Pills */}
          <div>
            <label className="input-label">Select tip amount</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { amount: 3, label: '1 Coffee ($3)' },
                { amount: 5, label: '2 Coffees ($5)' },
                { amount: 10, label: 'Pizza 🍕 ($10)' }
              ].map((item) => (
                <button
                  key={item.amount}
                  onClick={() => setSelectedAmount(item.amount)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                    background: selectedAmount === item.amount ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: selectedAmount === item.amount ? '#f59e0b' : 'var(--text-main)',
                    border: selectedAmount === item.amount ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tip CTA Button */}
          <button
            onClick={() => handleSimulateTip(selectedAmount)}
            style={{
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
            }}
          >
            {isThanked ? (
              <>
                <Check size={18} />
                <span>Thank you so much! ❤️</span>
              </>
            ) : (
              <>
                <Heart size={18} />
                <span>Mô phỏng mời cà phê ${selectedAmount}</span>
              </>
            )}
          </button>

          {/* Real Links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <a
              href={PAYMENT_CONFIG.coffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: '12px', textDecoration: 'none', padding: '8px', justifyContent: 'center' }}
            >
              <span>BuyMeACoffee.com</span>
              <ExternalLink size={13} />
            </a>
            <button
              onClick={() => {
                window.open(PAYMENT_CONFIG.getQrUrl(), '_blank');
              }}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '8px', justifyContent: 'center', color: '#10b981' }}
            >
              <QrCode size={13} />
              <span>Xem mã VietQR</span>
            </button>
          </div>

          <div style={{
            fontSize: '11px',
            color: 'var(--text-dim)',
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            Tất cả thông tin tài khoản và mã QR có thể tùy chỉnh trong file <strong>src/data/paymentConfig.js</strong>!
          </div>
        </div>
      </div>
    </div>
  );
}
