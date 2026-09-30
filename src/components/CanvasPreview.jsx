import React, { useRef, useState, useEffect } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Rocket, 
  Zap, 
  Code, 
  Flame, 
  Shield, 
  Layers, 
  Cpu, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Globe,
  Share2,
  Play,
  Volume2,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat,
  LayoutGrid,
  Download,
  CheckCircle2
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { COLOR_THEMES, ASPECT_RATIOS, STICKERS, TEMPLATES, FONT_FAMILIES } from '../data/templates';

const ICONS_MAP = {
  sparkles: Sparkles,
  terminal: Terminal,
  rocket: Rocket,
  zap: Zap,
  code: Code,
  flame: Flame,
  shield: Shield,
  layers: Layers,
  cpu: Cpu,
  globe: Globe
};

export default function CanvasPreview({
  config,
  canvasRef,
  isPro,
  viewMode = 'single',
  onToggleViewMode,
  onSelectTemplate,
  onNotify
}) {
  const [zoom, setZoom] = useState('fit'); // 'fit' | 0.5 | 0.75 | 1.0
  const [scale, setScale] = useState(0.6);
  const [previewPlatform, setPreviewPlatform] = useState('raw'); // 'raw' | 'twitter' | 'facebook'
  const [galleryCategory, setGalleryCategory] = useState('all');
  const containerRef = useRef(null);

  const currentTheme = config.isCustomColor ? {
    id: 'custom',
    name: 'Custom Palette',
    primary: config.customPrimary || '#6366f1',
    secondary: config.customSecondary || '#06b6d4',
    bg: config.customBg || '#030712',
    surface: '#0f172a',
    text: '#ffffff',
    gradient: `linear-gradient(${config.customGradientAngle || 135}deg, ${config.customPrimary || '#6366f1'} 0%, ${config.customSecondary || '#06b6d4'} 100%)`,
    glowColor: `${config.customPrimary || '#6366f1'}55`,
    border: `${config.customPrimary || '#6366f1'}4d`
  } : (COLOR_THEMES.find((t) => t.id === config.themeId) || COLOR_THEMES[0]);

  const currentRatio = ASPECT_RATIOS.find((r) => r.id === config.aspectRatio) || ASPECT_RATIOS[0];
  const BrandIcon = ICONS_MAP[config.brandIcon] || Sparkles;

  const activeFontObj = FONT_FAMILIES.find((f) => f.id === config.fontFamily) || FONT_FAMILIES[1];
  const activeFontVar = activeFontObj ? activeFontObj.fontVar : 'var(--font-heading)';

  // Helper to render title with optional gradient keyword highlight
  const renderTitle = (titleText) => {
    if (!titleText) return '';
    if (!config.highlightWord || !config.highlightWord.trim()) {
      return titleText;
    }
    const needle = config.highlightWord.trim();
    const parts = titleText.split(new RegExp(`(${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, idx) => {
      if (part.toLowerCase() === needle.toLowerCase()) {
        return (
          <span
            key={idx}
            style={{
              background: currentTheme.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              borderBottom: `3px solid ${currentTheme.secondary}`,
              paddingBottom: '2px'
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Responsive scale calculation to fit screen
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      if (typeof zoom === 'number') {
        setScale(zoom);
        return;
      }

      const availableWidth = containerRef.current.clientWidth - 80;
      const availableHeight = containerRef.current.clientHeight - 100;
      const scaleX = availableWidth / currentRatio.width;
      const scaleY = availableHeight / currentRatio.height;
      const calculated = Math.min(scaleX, scaleY, 0.85);
      setScale(Math.max(calculated, 0.25));
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [zoom, currentRatio]);

  // Background Pattern Styles
  const getPatternStyle = () => {
    switch (config.pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(${currentTheme.border} 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        };
      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(to right, ${currentTheme.border} 1px, transparent 1px),
            linear-gradient(to bottom, ${currentTheme.border} 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px'
        };
      case 'mesh':
        return {
          background: `
            radial-gradient(at 0% 0%, ${currentTheme.primary}40 0px, transparent 50%),
            radial-gradient(at 100% 100%, ${currentTheme.secondary}35 0px, transparent 50%),
            ${currentTheme.bg}
          `
        };
      case 'glow':
        return {
          background: `
            radial-gradient(circle at 50% 30%, ${currentTheme.primary}33 0%, transparent 70%),
            ${currentTheme.bg}
          `
        };
      case 'clean':
      default:
        return { background: currentTheme.bg };
    }
  };

  const getShadowStyle = () => {
    switch (config.shadowIntensity) {
      case 'none': return 'none';
      case 'soft': return '0 15px 35px -5px rgba(0, 0, 0, 0.4)';
      case 'glow': return `0 0 50px ${currentTheme.glowColor || 'rgba(99,102,241,0.4)'}, 0 20px 40px rgba(0,0,0,0.7)`;
      case 'medium':
      default:
        return '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.15)';
    }
  };

  const handleQuickCardExport = async (e, tplId, tplName) => {
    e.stopPropagation();
    const elem = document.getElementById(`gallery-canvas-${tplId}`);
    if (!elem) return;
    try {
      if (onNotify) onNotify(`⏳ Đang xuất ảnh retina cho mẫu "${tplName}"...`);
      const dataUrl = await toPng(elem, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `snapog-${tplId}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onNotify) onNotify(`✅ Đã tải ảnh mẫu "${tplName}" thành công!`);
    } catch (err) {
      console.error(err);
      if (onNotify) onNotify('❌ Lỗi khi xuất ảnh');
    }
  };

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (galleryCategory === 'all') return true;
    if (galleryCategory === 'human') return ['handcrafted-note', 'retro-paper', 'quote-focus'].includes(tpl.id);
    if (galleryCategory === 'tech') return ['dev-terminal', 'floating-3d', 'safari-window', 'bento-grid', 'cyber-glitch'].includes(tpl.id);
    if (galleryCategory === 'editorial') return ['clean-editorial', 'saas-launch', 'podcast-media'].includes(tpl.id);
    return true;
  });

  return (
    <div 
      ref={containerRef}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 65px)',
        background: 'var(--bg-app)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top Preview Controls Bar */}
      <div style={{
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(0, 0, 0, 0.35)',
        zIndex: 10,
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Left: View Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => onToggleViewMode('single')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '6px',
              background: viewMode === 'single' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'single' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Eye size={14} />
            <span>Single Canvas</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleViewMode('gallery')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '6px',
              background: viewMode === 'gallery' ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'transparent',
              color: viewMode === 'gallery' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <LayoutGrid size={14} />
            <span>Instant Gallery</span>
            <span style={{
              fontSize: '9px',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '999px',
              background: viewMode === 'gallery' ? '#ffffff' : 'rgba(16, 185, 129, 0.25)',
              color: viewMode === 'gallery' ? '#0f172a' : '#34d399'
            }}>
              11 LIVE
            </span>
          </button>
        </div>

        {/* Center: Platform (Single) or Category Filters (Gallery) */}
        {viewMode === 'single' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[
              { id: 'raw', label: 'Raw Canvas' },
              { id: 'twitter', label: 'Twitter / X Card' },
              { id: 'facebook', label: 'LinkedIn / Facebook Feed' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setPreviewPlatform(item.id)}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: previewPlatform === item.id ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: previewPlatform === item.id ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[
              { id: 'all', label: 'All (11)' },
              { id: 'human', label: '✍️ Human Craft (3)' },
              { id: 'tech', label: '⚡ 3D & Tech (5)' },
              { id: 'editorial', label: '📰 Editorial (3)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setGalleryCategory(cat.id)}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: '6px',
                  background: galleryCategory === cat.id ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  color: galleryCategory === cat.id ? '#ffffff' : 'var(--text-dim)',
                  border: galleryCategory === cat.id ? '1px solid var(--color-primary)' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Right: Dimension & Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '11px', 
            color: 'var(--text-dim)',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {currentRatio.width} × {currentRatio.height} px {viewMode === 'single' ? `• ${(scale * 100).toFixed(0)}%` : ''}
          </div>

          {viewMode === 'single' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setZoom('fit')}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 8px',
                  borderRadius: '4px',
                  background: zoom === 'fit' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  color: zoom === 'fit' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                Fit
              </button>
              <button
                onClick={() => setZoom(0.5)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 8px',
                  borderRadius: '4px',
                  background: zoom === 0.5 ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  color: zoom === 0.5 ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                50%
              </button>
              <button
                onClick={() => setZoom(0.75)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 8px',
                  borderRadius: '4px',
                  background: zoom === 0.75 ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  color: zoom === 0.75 ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                75%
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Viewport Area */}
      <div 
        className="dot-bg"
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: viewMode === 'gallery' ? 'flex-start' : 'center',
          justifyContent: 'center',
          padding: viewMode === 'gallery' ? '30px 40px' : '40px',
          position: 'relative'
        }}
      >
        {/* VIEW MODE 1: INSTANT GALLERY GRID */}
        {viewMode === 'gallery' && (
          <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚡ Instant Multi-Style Gallery</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    color: '#ffffff'
                  }}>
                    {filteredTemplates.length} Styles Live
                  </span>
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Tiêu đề và nội dung của bạn đang được áp dụng trực tiếp lên toàn bộ các mẫu. Bấm vào ảnh để chỉnh sửa sâu hoặc tải về ngay!
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
              gap: '24px'
            }}>
              {filteredTemplates.map((tpl) => {
                const isCurrent = config.templateId === tpl.id;
                const cardScale = 440 / currentRatio.width;
                const cardHeight = currentRatio.height * cardScale;

                return (
                  <div
                    key={tpl.id}
                    className="glass-card"
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: isCurrent ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: 'rgba(15, 23, 42, 0.65)',
                      boxShadow: isCurrent ? '0 0 25px rgba(99, 102, 241, 0.35)' : '0 10px 30px rgba(0, 0, 0, 0.4)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Live Preview Container */}
                    <div
                      style={{
                        width: '100%',
                        height: `${cardHeight}px`,
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: '#030712'
                      }}
                      onClick={() => {
                        onSelectTemplate(tpl.id);
                        onToggleViewMode('single');
                      }}
                      title="Bấm để chỉnh sửa chi tiết mẫu này trong Single Canvas"
                    >
                      <div style={{
                        width: `${currentRatio.width}px`,
                        height: `${currentRatio.height}px`,
                        transform: `scale(${cardScale})`,
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none'
                      }}>
                        {renderActualCanvas(tpl.id, false)}
                      </div>
                    </div>

                    {/* Card Meta & Actions */}
                    <div style={{
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      background: 'rgba(255, 255, 255, 0.02)'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                            {tpl.name}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: 'var(--text-muted)'
                          }}>
                            {tpl.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {tpl.tagline}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTemplate(tpl.id);
                            onToggleViewMode('single');
                          }}
                          className={isCurrent ? 'btn-primary' : 'btn-secondary'}
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          {isCurrent ? 'Đang chọn' : 'Chọn mẫu'}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleQuickCardExport(e, tpl.id, tpl.name)}
                          className="btn-secondary"
                          style={{
                            fontSize: '12px',
                            padding: '6px 10px',
                            color: '#10b981',
                            borderColor: 'rgba(16, 185, 129, 0.3)'
                          }}
                          title="Tải ảnh PNG mẫu này ngay"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW MODE 2: SINGLE CANVAS PLATFORM SIMULATOR */}
        {viewMode === 'single' && previewPlatform === 'twitter' && (
          <div style={{
            maxWidth: '680px',
            width: '100%',
            background: '#000000',
            border: '1px solid #2f3336',
            borderRadius: '16px',
            padding: '16px',
            color: '#e7e9ea',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}>
            {/* Tweet Header */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <img
                src={config.avatarUrl}
                alt="Avatar"
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>{config.authorName}</span>
                  <span style={{ color: '#71767b', fontSize: '14px' }}>{config.authorRole} · 2h</span>
                </div>
                <p style={{ fontSize: '14px', marginTop: '4px', lineHeight: '1.4' }}>
                  Excited to share our latest project! 🚀 Crafted with 100% precision. Check it out below 👇
                </p>
              </div>
            </div>

            {/* Embedded Scaled Preview */}
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #2f3336',
              position: 'relative'
            }}>
              <div style={{
                width: `${currentRatio.width * (640 / currentRatio.width)}px`,
                height: `${currentRatio.height * (640 / currentRatio.width)}px`,
                transform: `scale(${640 / currentRatio.width})`,
                transformOrigin: 'top left'
              }}>
                {renderActualCanvas()}
              </div>
              <div style={{ padding: '12px', background: '#16181c', borderTop: '1px solid #2f3336' }}>
                <div style={{ fontSize: '12px', color: '#71767b', textTransform: 'uppercase' }}>{config.siteUrl}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>{renderTitle(config.title)}</div>
                <div style={{ fontSize: '13px', color: '#71767b', marginTop: '2px' }}>{config.subtitle}</div>
              </div>
            </div>

            {/* Tweet Action Icons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', padding: '0 20px', color: '#71767b' }}>
              <MessageCircle size={18} />
              <Repeat size={18} />
              <Heart size={18} />
              <Bookmark size={18} />
            </div>
          </div>
        )}

        {/* PLATFORM SHELL: LINKEDIN / FACEBOOK FEED SIMULATOR */}
        {viewMode === 'single' && previewPlatform === 'facebook' && (
          <div style={{
            maxWidth: '650px',
            width: '100%',
            background: '#1b1f23',
            border: '1px solid #38444d',
            borderRadius: '12px',
            padding: '16px',
            color: '#f0f2f5',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
              <img
                src={config.avatarUrl}
                alt="Avatar"
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{config.authorName}</div>
                <div style={{ fontSize: '12px', color: '#9ba0a6' }}>{config.authorRole} • 1st</div>
              </div>
            </div>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>
              {config.subtitle}
            </p>

            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #38444d'
            }}>
              <div style={{
                width: `${currentRatio.width * (616 / currentRatio.width)}px`,
                height: `${currentRatio.height * (616 / currentRatio.width)}px`,
                transform: `scale(${616 / currentRatio.width})`,
                transformOrigin: 'top left'
              }}>
                {renderActualCanvas()}
              </div>
              <div style={{ padding: '12px', background: '#24292e' }}>
                <span style={{ fontSize: '11px', color: '#9ba0a6', textTransform: 'uppercase' }}>{config.siteUrl}</span>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{renderTitle(config.title)}</h4>
              </div>
            </div>
          </div>
        )}

        {/* RAW CANVAS (Default high-fidelity view) */}
        {viewMode === 'single' && previewPlatform === 'raw' && (
          <div 
            className="perspective-container"
            style={{
              width: `${currentRatio.width * scale}px`,
              height: `${currentRatio.height * scale}px`,
              transition: 'width 0.2s ease, height 0.2s ease',
              position: 'relative',
              boxShadow: getShadowStyle(),
              borderRadius: `${(config.borderRadius ?? 16) * scale}px`,
              overflow: config.tilt3D ? 'visible' : 'hidden'
            }}
          >
            <div
              className={config.tilt3D ? 'tilt-3d' : ''}
              style={{
                width: `${currentRatio.width}px`,
                height: `${currentRatio.height}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            >
              {renderActualCanvas()}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Core Canvas Engine with High-Fidelity Templates
  function renderActualCanvas(templateIdOverride = null, isExportElement = true) {
    const activeTemplateId = templateIdOverride || config.templateId;
    const activeSticker = STICKERS.find((s) => s.id === config.sticker);

    return (
      <div
        ref={isExportElement ? canvasRef : null}
        id={isExportElement ? 'og-canvas-export' : `gallery-canvas-${templateIdOverride}`}
        style={{
          width: `${currentRatio.width}px`,
          height: `${currentRatio.height}px`,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: activeFontVar,
          color: currentTheme.text,
          boxSizing: 'border-box',
          ...getPatternStyle()
        }}
      >
        {/* Floating Human Sticker Badge */}
        {activeSticker && activeSticker.id !== 'none' && (
          <div style={{
            position: 'absolute',
            top: '32px',
            right: '32px',
            zIndex: 35,
            padding: '8px 20px',
            borderRadius: '999px',
            background: activeSticker.bg,
            color: activeSticker.color,
            border: `2px solid ${activeSticker.color}`,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '0.06em',
            transform: 'rotate(6deg)'
          }}>
            {activeSticker.label}
          </div>
        )}

        {/* TEMPLATE 1: SAAS LAUNCHPAD */}
        {activeTemplateId === 'saas-launch' && (
          <div style={{
            width: '100%',
            height: '100%',
            padding: '70px 80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxSizing: 'border-box'
          }}>
            {/* Ambient Glow Orb */}
            <div style={{
              position: 'absolute',
              top: '-15%',
              right: '-10%',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: currentTheme.gradient,
              filter: 'blur(130px)',
              opacity: 0.35,
              pointerEvents: 'none'
            }} />

            {/* Top Brand & Category Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 2
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 18px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${currentTheme.border}`,
                color: '#ffffff'
              }}>
                <Sparkles size={18} color={currentTheme.primary} />
                <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {config.categoryTag}
                </span>
              </div>

              {/* Watermark Brand */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '18px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                <BrandIcon size={22} color={currentTheme.secondary} />
                <span>{config.siteUrl}</span>
              </div>
            </div>

            {/* Central Headline & Copy */}
            <div style={{
              zIndex: 2,
              textAlign: config.align,
              maxWidth: config.align === 'center' ? '100%' : '90%'
            }}>
              <h1 className="font-heading" style={{
                fontSize: `${config.fontSize}px`,
                fontWeight: 800,
                lineHeight: 1.18,
                letterSpacing: '-0.03em',
                marginBottom: '22px',
                color: '#ffffff'
              }}>
                {renderTitle(config.title)}
              </h1>
              <p style={{
                fontSize: '26px',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.45,
                maxWidth: '920px',
                margin: config.align === 'center' ? '0 auto' : '0'
              }}>
                {config.subtitle}
              </p>
            </div>

            {/* Bottom Row: Author capsule */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: config.align === 'center' ? 'center' : 'space-between',
              zIndex: 2
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '10px 22px',
                borderRadius: '999px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <img
                  src={config.avatarUrl}
                  alt={config.authorName}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${currentTheme.primary}`
                  }}
                />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                    {config.authorName}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {config.authorRole}
                  </div>
                </div>
              </div>

              {config.align !== 'center' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background: currentTheme.gradient,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '16px',
                  boxShadow: `0 8px 25px ${currentTheme.glowColor}`
                }}>
                  <Zap size={18} />
                  <span>READ ARTICLE</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEMPLATE 2: DEV TERMINAL / CODECRAFT */}
        {activeTemplateId === 'dev-terminal' && (
          <div style={{
            width: '100%',
            height: '100%',
            padding: '50px 70px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            {/* Terminal Window Frame */}
            <div style={{
              width: '100%',
              height: '100%',
              background: 'rgba(11, 15, 25, 0.85)',
              backdropFilter: 'blur(20px)',
              border: `1.5px solid ${currentTheme.border}`,
              borderRadius: '20px',
              padding: '36px 48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: `0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px ${currentTheme.glowColor}`
            }}>
              {/* Terminal Title Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#27c93f' }} />
                  <span className="font-mono" style={{ marginLeft: '14px', fontSize: '15px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    ~/projects/{config.siteUrl}/guide.tsx
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: currentTheme.primary,
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '4px 12px',
                  borderRadius: '6px'
                }}>
                  <Terminal size={14} />
                  <span>{config.categoryTag}</span>
                </div>
              </div>

              {/* Code Headline */}
              <div style={{ margin: 'auto 0', textAlign: config.align }}>
                <div className="font-mono" style={{ fontSize: '18px', color: currentTheme.secondary, marginBottom: '14px' }}>
                  $ npx open-graph --generate
                </div>
                <h1 className="font-heading" style={{
                  fontSize: `${config.fontSize}px`,
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: '16px'
                }}>
                  {renderTitle(config.title)}
                </h1>
                <p style={{
                  fontSize: '22px',
                  color: 'rgba(255, 255, 255, 0.65)',
                  lineHeight: 1.4,
                  maxWidth: '900px',
                  margin: config.align === 'center' ? '0 auto' : '0'
                }}>
                  {config.subtitle}
                </p>
              </div>

              {/* Terminal Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={config.avatarUrl}
                    alt={config.authorName}
                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                      {config.authorName}
                    </span>
                    <span className="font-mono" style={{ fontSize: '13px', color: currentTheme.primary }}>
                      {config.authorRole}
                    </span>
                  </div>
                </div>

                <div className="font-mono" style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.4)' }}>
                  git:(main) ⚡ {config.siteUrl}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 3: LINEAR BENTO GRID */}
        {activeTemplateId === 'bento-grid' && (
          <div style={{
            width: '100%',
            height: '100%',
            padding: '50px',
            display: 'grid',
            gridTemplateColumns: '1.4fr 0.8fr',
            gap: '24px',
            boxSizing: 'border-box'
          }}>
            {/* Left Main Bento Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: `1.5px solid ${currentTheme.border}`,
              borderRadius: '24px',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: `0 20px 40px rgba(0,0,0,0.6)`
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: currentTheme.primary,
                fontWeight: 700,
                fontSize: '14px',
                width: 'fit-content'
              }}>
                <BrandIcon size={16} />
                <span>{config.categoryTag}</span>
              </div>

              <div>
                <h1 className="font-heading" style={{
                  fontSize: `${config.fontSize * 0.95}px`,
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.18,
                  marginBottom: '18px'
                }}>
                  {renderTitle(config.title)}
                </h1>
                <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.4 }}>
                  {config.subtitle}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={config.avatarUrl}
                  alt="avatar"
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff' }}>{config.authorName}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>{config.authorRole}</div>
                </div>
              </div>
            </div>

            {/* Right Stacked Bento Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Metric Card */}
              <div style={{
                flex: 1,
                background: currentTheme.gradient,
                borderRadius: '24px',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#ffffff',
                boxShadow: `0 15px 35px ${currentTheme.glowColor}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    FEATURED TECH
                  </span>
                  <Zap size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>100%</div>
                  <div style={{ fontSize: '16px', opacity: 0.85, marginTop: '6px' }}>Client-Side Fast Engine</div>
                </div>
              </div>

              {/* Domain & Brand Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                    OFFICIAL DOMAIN
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                    {config.siteUrl}
                  </div>
                </div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Globe size={22} color={currentTheme.secondary} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 4: CLEAN EDITORIAL */}
        {activeTemplateId === 'clean-editorial' && (
          <div style={{
            width: '100%',
            height: '100%',
            padding: '60px 80px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            {/* Elegant Border Inset Frame */}
            <div style={{
              position: 'absolute',
              inset: '24px',
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '16px',
              pointerEvents: 'none'
            }} />

            {/* Header info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '20px'
            }}>
              <span className="font-heading" style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                {config.siteUrl}
              </span>
              <span style={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: currentTheme.primary
              }}>
                {config.categoryTag}
              </span>
            </div>

            {/* Main Editorial Text */}
            <div style={{ textAlign: config.align }}>
              <h1 className="font-heading" style={{
                fontSize: `${config.fontSize * 1.05}px`,
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '20px'
              }}>
                {renderTitle(config.title)}
              </h1>
              <p style={{
                fontSize: '24px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.45,
                maxWidth: '900px',
                margin: config.align === 'center' ? '0 auto' : '0'
              }}>
                {config.subtitle}
              </p>
            </div>

            {/* Author Byline */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={config.avatarUrl}
                  alt={config.authorName}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>{config.authorName}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginLeft: '10px' }}>
                    {config.authorRole}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.4)' }}>
                Issue #48 • 5 min read
              </span>
            </div>
          </div>
        )}

        {/* TEMPLATE 5: PODCAST & STREAM (PRO) */}
        {activeTemplateId === 'podcast-media' && (
          <div style={{
            width: '100%',
            height: '100%',
            padding: '60px 80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                background: currentTheme.gradient,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px'
              }}>
                <Volume2 size={16} />
                <span>{config.categoryTag}</span>
              </div>

              {/* Animated Waveform Visualizer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {[30, 55, 80, 45, 95, 60, 40, 75, 50, 90, 65, 35, 70, 85].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '4px',
                      height: `${h * 0.4}px`,
                      borderRadius: '4px',
                      background: currentTheme.secondary,
                      opacity: 0.8
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Play Button & Headline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <div style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: currentTheme.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 0 40px ${currentTheme.glowColor}`
              }}>
                <Play size={44} color="#ffffff" style={{ marginLeft: '6px' }} />
              </div>

              <div>
                <h1 className="font-heading" style={{
                  fontSize: `${config.fontSize * 0.92}px`,
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  marginBottom: '14px'
                }}>
                  {renderTitle(config.title)}
                </h1>
                <p style={{ fontSize: '22px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.4 }}>
                  {config.subtitle}
                </p>
              </div>
            </div>

            {/* Host & Stream details */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={config.avatarUrl}
                  alt="avatar"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Hosted by {config.authorName}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>{config.authorRole}</div>
                </div>
              </div>

              <div style={{ fontSize: '18px', fontWeight: 700, color: currentTheme.secondary }}>
                Listen on {config.siteUrl}
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 6: CYBERPUNK HUD (PRO) */}
        {activeTemplateId === 'cyber-glitch' && (
          <div style={{
            width: '100%',
            height: '100%',
            padding: '50px 70px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            position: 'relative',
            background: 'radial-gradient(circle at center, #061e24 0%, #020617 100%)'
          }}>
            {/* Tech Corner Brackets */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '40px',
              height: '40px',
              borderTop: `3px solid ${currentTheme.primary}`,
              borderLeft: `3px solid ${currentTheme.primary}`
            }} />
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              borderBottom: `3px solid ${currentTheme.secondary}`,
              borderRight: `3px solid ${currentTheme.secondary}`
            }} />

            {/* Top HUD Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)'
            }}>
              <span style={{
                color: currentTheme.primary,
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '0.12em'
              }}>
                [SYS_ALERT // {config.categoryTag}]
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: currentTheme.secondary, fontSize: '14px' }}>
                <Cpu size={16} />
                <span>CORE_ID: {config.siteUrl}</span>
              </div>
            </div>

            {/* Center Cyber Headline */}
            <div style={{ textAlign: config.align }}>
              <div className="font-mono" style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '8px' }}>
                PROTOCOL_STATUS: VERIFIED
              </div>
              <h1 className="font-heading" style={{
                fontSize: `${config.fontSize * 1.05}px`,
                fontWeight: 900,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                textShadow: `0 0 20px ${currentTheme.primary}88`
              }}>
                {renderTitle(config.title)}
              </h1>
              <p style={{
                fontSize: '22px',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.4,
                marginTop: '16px',
                maxWidth: '920px',
                margin: config.align === 'center' ? '16px auto 0' : '16px 0 0'
              }}>
                {config.subtitle}
              </p>
            </div>

            {/* Bottom Cyber Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              borderTop: `1px solid ${currentTheme.border}`,
              paddingTop: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={config.avatarUrl}
                  alt="avatar"
                  style={{ width: '40px', height: '40px', borderRadius: '4px', border: `1px solid ${currentTheme.primary}` }}
                />
                <div>
                  <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700 }}>{config.authorName}</span>
                  <span style={{ color: currentTheme.primary, fontSize: '12px', display: 'block' }}>{config.authorRole}</span>
                </div>
              </div>

              <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px' }}>
                SECTOR // 2026.09.29
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 7: HANDCRAFTED NOTE */}
        {activeTemplateId === 'handcrafted-note' && (
          <div style={{
            width: '100%',
            height: '100%',
            padding: `${config.padding || 60}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            position: 'relative'
          }}>
            {/* The Floating Notepad Card */}
            <div style={{
              width: '100%',
              height: '100%',
              background: currentTheme.id === 'pure-white' ? '#fffdf7' : 'rgba(25, 29, 41, 0.95)',
              borderRadius: `${config.borderRadius ?? 20}px`,
              border: `1.5px dashed ${currentTheme.border}`,
              padding: '48px 60px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: '0 20px 45px rgba(0,0,0,0.5)'
            }}>
              {/* Washi Tape at Top Center */}
              <div style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%) rotate(-1deg)',
                width: '140px',
                height: '30px',
                background: 'rgba(254, 240, 138, 0.8)',
                backdropFilter: 'blur(4px)',
                borderRadius: '3px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                borderLeft: '2px dashed rgba(0,0,0,0.2)',
                borderRight: '2px dashed rgba(0,0,0,0.2)',
                zIndex: 10
              }} />

              {/* Top Tag & Domain */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="font-handwriting" style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: currentTheme.primary,
                  transform: 'rotate(-2deg)'
                }}>
                  ✏️ {config.categoryTag}
                </span>

                <span style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.06)',
                  padding: '4px 12px',
                  borderRadius: '6px'
                }}>
                  {config.siteUrl}
                </span>
              </div>

              {/* Main Headline with Marker Underline and Hand-drawn Arrow */}
              <div style={{ textAlign: config.align, position: 'relative' }}>
                <h1 className="font-heading" style={{
                  fontSize: `${config.fontSize * 0.96}px`,
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.22,
                  marginBottom: '16px'
                }}>
                  {renderTitle(config.title)}
                </h1>

                {/* Hand-drawn SVG highlighter / swoosh underline */}
                <svg width="220" height="16" viewBox="0 0 220 16" fill="none" style={{
                  display: 'block',
                  margin: config.align === 'center' ? '0 auto 16px' : '0 0 16px',
                  opacity: 0.85
                }}>
                  <path d="M4 12C50 4 140 3 216 11" stroke={currentTheme.secondary} strokeWidth="5" strokeLinecap="round" />
                </svg>

                <p className="font-handwriting" style={{
                  fontSize: '32px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.35,
                  maxWidth: '920px',
                  margin: config.align === 'center' ? '0 auto' : '0'
                }}>
                  {config.subtitle}
                </p>
              </div>

              {/* Bottom Author Row with Stamp */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,0.12)', paddingTop: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={config.avatarUrl}
                    alt={config.authorName}
                    style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${currentTheme.primary}` }}
                  />
                  <div>
                    <div className="font-handwriting" style={{ fontSize: '26px', fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>
                      Handcrafted by {config.authorName}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                      {config.authorRole}
                    </div>
                  </div>
                </div>

                {/* Vintage Circular Stamp */}
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  border: `2px dashed ${currentTheme.primary}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  transform: 'rotate(12deg)',
                  opacity: 0.85
                }}>
                  <span style={{ fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', color: currentTheme.primary }}>TINYFORGE</span>
                  <span style={{ fontSize: '14px' }}>★</span>
                  <span style={{ fontSize: '7px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>MAKER NOTE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 8: RETRO VINTAGE PAPER */}
        {activeTemplateId === 'retro-paper' && (
          <div style={{
            width: '100%',
            height: '100%',
            padding: `${config.padding || 60}px`,
            background: '#181512',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            position: 'relative'
          }}>
            {/* Inset Double Border */}
            <div style={{
              width: '100%',
              height: '100%',
              border: '2px solid #d4af37',
              borderRadius: `${config.borderRadius ?? 8}px`,
              padding: '10px',
              boxSizing: 'border-box'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                padding: '40px 50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                background: 'radial-gradient(ellipse at center, rgba(35, 29, 24, 0.9) 0%, rgba(20, 16, 13, 0.98) 100%)'
              }}>
                {/* Vintage Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '16px' }}>
                  <div className="font-serif" style={{ fontSize: '15px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#d4af37' }}>
                    ✦ THE TINYFORGE GAZETTE ✦
                  </div>
                  <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.5)' }}>
                    EST. 2026 • {config.categoryTag}
                  </div>
                </div>

                {/* Classic Editorial Headline */}
                <div style={{ textAlign: config.align, margin: 'auto 0' }}>
                  <h1 className="font-serif" style={{
                    fontSize: `${config.fontSize * 1.08}px`,
                    fontWeight: 700,
                    color: '#fdfbf7',
                    lineHeight: 1.15,
                    fontStyle: 'normal',
                    marginBottom: '18px'
                  }}>
                    {renderTitle(config.title)}
                  </h1>
                  <p className="font-serif" style={{
                    fontSize: '24px',
                    color: 'rgba(253, 251, 247, 0.72)',
                    lineHeight: 1.45,
                    fontStyle: 'italic',
                    maxWidth: '920px',
                    margin: config.align === 'center' ? '0 auto' : '0'
                  }}>
                    {config.subtitle}
                  </p>
                </div>

                {/* Footer With Postal Stamp & Byline */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(212, 175, 55, 0.3)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={config.avatarUrl}
                      alt={config.authorName}
                      style={{ width: '44px', height: '44px', borderRadius: '4px', objectFit: 'cover', filter: 'sepia(30%)', border: '1px solid #d4af37' }}
                    />
                    <div>
                      <span className="font-serif" style={{ fontSize: '18px', fontWeight: 600, color: '#fdfbf7' }}>
                        Dispatches by {config.authorName}
                      </span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                        {config.authorRole} • Published at {config.siteUrl}
                      </span>
                    </div>
                  </div>

                  {/* Postal Cancellation Stamp */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.75 }}>
                    <div style={{ width: '42px', height: '52px', border: '2px solid #d4af37', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                      <span style={{ fontSize: '18px' }}>🦅</span>
                      <span style={{ fontSize: '8px', color: '#d4af37' }}>AIR MAIL</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ width: '40px', height: '2px', background: '#d4af37' }} />
                      <div style={{ width: '40px', height: '2px', background: '#d4af37' }} />
                      <div style={{ width: '40px', height: '2px', background: '#d4af37' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 9: 3D FLOATING GLASS */}
        {activeTemplateId === 'floating-3d' && (
          <div style={{
            width: '100%',
            height: '100%',
            padding: `${config.padding || 60}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            perspective: '1200px'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(25px)',
              borderRadius: `${config.borderRadius ?? 24}px`,
              border: `1.5px solid ${currentTheme.border}`,
              padding: '50px 70px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: `0 35px 70px -15px rgba(0,0,0,0.8), 0 0 50px ${currentTheme.glowColor}`,
              transform: 'rotateX(2deg) rotateY(-3deg)',
              position: 'relative'
            }}>
              {/* Top floating pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  background: currentTheme.gradient,
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '15px',
                  boxShadow: `0 8px 20px ${currentTheme.glowColor}`
                }}>
                  {config.categoryTag}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '16px', fontWeight: 600 }}>
                  <BrandIcon size={20} color={currentTheme.secondary} />
                  <span>{config.siteUrl}</span>
                </div>
              </div>

              {/* Floating Headline */}
              <div style={{ textAlign: config.align }}>
                <h1 className="font-heading" style={{
                  fontSize: `${config.fontSize * 1.02}px`,
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.16,
                  letterSpacing: '-0.03em',
                  marginBottom: '18px'
                }}>
                  {renderTitle(config.title)}
                </h1>
                <p style={{
                  fontSize: '24px',
                  color: 'rgba(255, 255, 255, 0.75)',
                  lineHeight: 1.45,
                  maxWidth: '920px',
                  margin: config.align === 'center' ? '0 auto' : '0'
                }}>
                  {config.subtitle}
                </p>
              </div>

              {/* Author Capsule */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <img
                    src={config.avatarUrl}
                    alt={config.authorName}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff' }}>{config.authorName}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{config.authorRole}</div>
                  </div>
                </div>

                <div style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: currentTheme.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Zap size={16} />
                  <span>ELEVATED EXPERIENCE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 10: SAFARI BROWSER FRAME */}
        {activeTemplateId === 'safari-window' && (
          <div style={{
            width: '100%',
            height: '100%',
            padding: `${config.padding || 50}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'rgba(15, 23, 42, 0.92)',
              borderRadius: `${config.borderRadius ?? 20}px`,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
            }}>
              {/* Safari Chrome Title Bar */}
              <div style={{
                height: '56px',
                background: 'rgba(30, 41, 59, 0.7)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#10b981' }} />
                </div>

                {/* Frosted URL Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  padding: '6px 24px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'var(--font-mono)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <span style={{ color: '#10b981' }}>🔒</span>
                  <span>https://{config.siteUrl}/posts/{config.title.toLowerCase().slice(0, 20).replace(/\s+/g, '-')}</span>
                </div>

                <div style={{ width: '50px' }} />
              </div>

              {/* Inside Page Content */}
              <div style={{
                flex: 1,
                padding: '40px 60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: config.align
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  background: currentTheme.gradient,
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  width: 'fit-content',
                  margin: config.align === 'center' ? '0 auto' : '0'
                }}>
                  {config.categoryTag}
                </div>

                <div>
                  <h1 className="font-heading" style={{
                    fontSize: `${config.fontSize * 0.98}px`,
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1.2,
                    marginBottom: '16px'
                  }}>
                    {renderTitle(config.title)}
                  </h1>
                  <p style={{
                    fontSize: '22px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.45,
                    maxWidth: '900px',
                    margin: config.align === 'center' ? '0 auto' : '0'
                  }}>
                    {config.subtitle}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: config.align === 'center' ? 'center' : 'space-between',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  paddingTop: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={config.avatarUrl}
                      alt={config.authorName}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#ffffff' }}>{config.authorName}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{config.authorRole}</div>
                    </div>
                  </div>

                  {config.align !== 'center' && (
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
                      TinyForge Engine 2.0
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 11: THOUGHT LEADERSHIP QUOTE */}
        {activeTemplateId === 'quote-focus' && (
          <div style={{
            width: '100%',
            height: '100%',
            padding: `${config.padding || 70}px 90px`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            position: 'relative'
          }}>
            {/* Giant Watermark Quote Mark */}
            <div className="font-serif" style={{
              position: 'absolute',
              top: '20px',
              left: '50px',
              fontSize: '180px',
              lineHeight: 1,
              color: currentTheme.primary,
              opacity: 0.18,
              pointerEvents: 'none',
              fontFamily: 'var(--font-serif)'
            }}>
              “
            </div>

            {/* Top Category Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: currentTheme.primary
              }}>
                ✦ {config.categoryTag} ✦
              </span>
              <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>
                {config.siteUrl}
              </span>
            </div>

            {/* Central Wisdom Quote Text */}
            <div style={{ textAlign: 'center', zIndex: 2, padding: '0 40px' }}>
              <h1 className="font-serif" style={{
                fontSize: `${config.fontSize * 1.05}px`,
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.25,
                fontStyle: 'italic',
                marginBottom: '20px'
              }}>
                {renderTitle(config.title)}
              </h1>
              <p style={{
                fontSize: '22px',
                color: 'rgba(255, 255, 255, 0.72)',
                lineHeight: 1.45,
                maxWidth: '850px',
                margin: '0 auto'
              }}>
                {config.subtitle}
              </p>
            </div>

            {/* Centered Author Persona with Verified Badge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 2 }}>
              <img
                src={config.avatarUrl}
                alt={config.authorName}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `3px solid ${currentTheme.primary}`,
                  boxShadow: `0 0 25px ${currentTheme.glowColor}`
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  {config.authorName}
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  {config.authorRole}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
