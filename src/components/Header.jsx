import { 
  Sparkles, 
  Crown, 
  Coffee, 
  Code2, 
  Share2, 
  Layers, 
  Zap, 
  CheckCircle2,
  ExternalLink,
  Bookmark,
  RotateCcw
} from 'lucide-react';
import { QUICK_PRESETS } from '../data/templates';
import Logo from './Logo';

export default function Header({ 
  onApplyPreset, 
  onOpenPro, 
  onOpenCoffee, 
  onOpenMeta, 
  onShareDesign,
  onOpenBatch,
  onOpenSaved,
  savedCount = 0,
  onResetConfig,
  isPro,
  onOpenAi 
}) {
  return (
    <header className="glass-panel" style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px'
    }}>
      <div style={{ 
        maxWidth: '1800px', 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Logo size={42} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-heading" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                SnapOG <span style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Studio</span>
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '2px 7px',
                borderRadius: '999px',
                background: isPro ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'rgba(245, 158, 11, 0.12)',
                color: isPro ? '#ffffff' : '#f59e0b',
                border: isPro ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(245, 158, 11, 0.25)',
                letterSpacing: '0.05em'
              }}>
                {isPro ? 'PRO ACTIVATED' : 'v1.0 FREE'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600, color: '#f8fafc' }}>TinyForge</span>
              <span>•</span>
              <span style={{ color: 'var(--text-muted)' }}>Công cụ tạo ảnh bìa mạng xã hội chuyên nghiệp</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                <Zap size={11} /> 100% Client-Side
              </span>
            </div>
          </div>
        </div>

        {/* Quick Presets Carousel Bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '4px 6px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          maxWidth: '520px'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', paddingLeft: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
            Mẫu nhanh:
          </span>
          {QUICK_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onApplyPreset(preset)}
              style={{
                fontSize: '12px',
                padding: '5px 10px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-muted)',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* AI Hook Assistant */}
          <button
            onClick={onOpenAi}
            className="btn-secondary"
            style={{ 
              fontSize: '13px', 
              padding: '7px 13px',
              color: '#ffffff',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(236, 72, 153, 0.25))',
              borderColor: 'rgba(236, 72, 153, 0.4)',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)'
            }}
            title="Dùng Google Gemini 3.x AI tự động viết Hook triệu view"
          >
            <Sparkles size={14} color="#f472b6" />
            <span style={{ fontWeight: 700 }}>Trợ Lý AI Hook</span>
          </button>

          {/* My Saved Designs */}
          <button
            onClick={onOpenSaved}
            className="btn-secondary"
            style={{ 
              fontSize: '13px', 
              padding: '7px 12px',
              color: savedCount > 0 ? '#f59e0b' : 'var(--text-muted)',
              borderColor: savedCount > 0 ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-subtle)'
            }}
            title="Xem và quản lý các mẫu đã lưu của bạn"
          >
            <Bookmark size={14} />
            <span>Mẫu đã lưu ({savedCount})</span>
          </button>

          {/* Reset to Default */}
          <button
            onClick={onResetConfig}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '7px 10px' }}
            title="Khôi phục lại thiết kế ban đầu"
          >
            <RotateCcw size={14} />
          </button>

          {/* Batch Generator */}
          <button
            onClick={onOpenBatch}
            className="btn-secondary"
            style={{ 
              fontSize: '13px', 
              padding: '7px 12px',
              color: '#34d399',
              borderColor: 'rgba(16, 185, 129, 0.3)'
            }}
            title="Tạo ảnh hàng loạt theo danh sách và tải file ZIP"
          >
            <Layers size={14} />
            <span>Tạo hàng loạt (ZIP)</span>
          </button>

          {/* Share Design Link */}
          <button
            onClick={onShareDesign}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '7px 12px' }}
            title="Sao chép liên kết chia sẻ mẫu thiết kế này"
          >
            <Share2 size={14} />
            <span>Chia sẻ</span>
          </button>

          {/* Get Meta Tags */}
          <button
            onClick={onOpenMeta}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '7px 12px' }}
            title="Xem và sao chép thẻ <meta> OpenGraph cho HTML và Next.js"
          >
            <Code2 size={14} />
            <span>Thẻ Meta SEO</span>
          </button>

          {/* Buy Me a Coffee */}
          <button
            onClick={onOpenCoffee}
            className="btn-secondary"
            style={{ 
              fontSize: '13px', 
              padding: '7px 14px', 
              color: '#f59e0b',
              borderColor: 'rgba(245, 158, 11, 0.25)' 
            }}
            title="Ủng hộ tác giả một ly cà phê qua Buy Me a Coffee"
          >
            <Coffee size={15} />
            <span>Ủng hộ $3</span>
          </button>

          {/* PRO Pack Button */}
          <button
            onClick={onOpenPro}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              background: isPro 
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: '#ffffff',
              boxShadow: isPro 
                ? '0 0 15px rgba(16, 185, 129, 0.4)'
                : '0 0 15px rgba(245, 158, 11, 0.45)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {isPro ? (
              <>
                <CheckCircle2 size={16} />
                <span>Gói PRO Hoạt Động</span>
              </>
            ) : (
              <>
                <Crown size={16} />
                <span>Nâng Cấp PRO</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
