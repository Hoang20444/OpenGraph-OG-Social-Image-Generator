import React from 'react';

/**
 * TinyForge Logo — Biểu tượng "Người Thợ Rèn Thủ Công Số" (Digital Artisan Maker)
 * Kết hợp ngọn lửa nhiệt huyết của lò rèn (Forge Flame), búa đe chế tác (Craftsman Anvil)
 * và trái tim đam mê (Maker's Heart) mang đậm hơi thở con người.
 */
export default function Logo({ size = 42, showPulse = true }) {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(244, 63, 94, 0.25), rgba(99, 102, 241, 0.2))',
      border: '1px solid rgba(245, 158, 11, 0.35)',
      padding: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
      flexShrink: 0
    }}>
      {/* Background glow orb */}
      {showPulse && (
        <div style={{
          position: 'absolute',
          inset: '0',
          borderRadius: '12px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%)',
          filter: 'blur(8px)',
          zIndex: 0
        }} />
      )}

      {/* Artisan SVG Emblem */}
      <svg
        width={size * 0.7}
        height={size * 0.7}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <defs>
          {/* Ngọn lửa lò rèn ấm áp */}
          <linearGradient id="tf-flame-grad" x1="16" y1="4" x2="16" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          {/* Ánh sáng búa & đe rèn thủ công */}
          <linearGradient id="tf-anvil-grad" x1="6" y1="20" x2="26" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Tia lửa sáng tạo */}
          <linearGradient id="tf-spark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {/* Chân đe rèn kiên định (Craftsman's Solid Anvil Base) */}
        <path
          d="M7 25C7 24.4477 7.44772 24 8 24H24C24.5523 24 25 24.4477 25 25C25 25.5523 24.5523 26 24 26H8C7.44772 26 7 25.5523 7 25Z"
          fill="url(#tf-anvil-grad)"
        />
        <path
          d="M10 24V21C10 19.8 11 19 12.5 19H19.5C21 19 22 19.8 22 21V24H10Z"
          fill="url(#tf-anvil-grad)"
          opacity="0.85"
        />

        {/* Ngọn lửa đam mê & đôi bàn tay tạo tác (Organic Artisan Flame & Creator Heart) */}
        <path
          d="M16 4.5C16 4.5 21.5 10 21.5 15C21.5 18.0376 19.0376 20.5 16 20.5C12.9624 20.5 10.5 18.0376 10.5 15C10.5 10 16 4.5 16 4.5Z"
          fill="url(#tf-flame-grad)"
        />

        {/* Trái tim / Tia sáng trung tâm (The Maker's Core Heart Spark) */}
        <path
          d="M16 12C16 12 17.8 13.6 17.8 15C17.8 15.9941 16.9941 16.8 16 16.8C15.0059 16.8 14.2 15.9941 14.2 15C14.2 13.6 16 12 16 12Z"
          fill="#ffffff"
          opacity="0.95"
        />

        {/* Tia sáng bay lên (Creative Sparks of Human Craft) */}
        <circle cx="23" cy="9" r="1.5" fill="url(#tf-spark)" />
        <circle cx="8.5" cy="11.5" r="1.2" fill="#fbbf24" opacity="0.85" />
        <circle cx="16" cy="3" r="1" fill="#ffffff" />
      </svg>
    </div>
  );
}
