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
  Repeat
} from 'lucide-react';
import { COLOR_THEMES, ASPECT_RATIOS } from '../data/templates';

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
  isPro
}) {
  const [zoom, setZoom] = useState('fit'); // 'fit' | 0.5 | 0.75 | 1.0
  const [scale, setScale] = useState(0.6);
  const [previewPlatform, setPreviewPlatform] = useState('raw'); // 'raw' | 'twitter' | 'facebook'
  const containerRef = useRef(null);

  const currentTheme = COLOR_THEMES.find((t) => t.id === config.themeId) || COLOR_THEMES[0];
  const currentRatio = ASPECT_RATIOS.find((r) => r.id === config.aspectRatio) || ASPECT_RATIOS[0];
  const BrandIcon = ICONS_MAP[config.brandIcon] || Sparkles;

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
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(0, 0, 0, 0.3)',
        zIndex: 10
      }}>
        {/* Platform simulation tabs */}
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

        {/* Zoom Controls & Dimension readout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '11px', 
            color: 'var(--text-dim)',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {currentRatio.width} × {currentRatio.height} px • {(scale * 100).toFixed(0)}%
          </div>

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
        </div>
      </div>

      {/* Main Canvas Viewport Area */}
      <div 
        className="dot-bg"
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative'
        }}
      >
        {/* PLATFORM SHELL: TWITTER/X CARD SIMULATOR */}
        {previewPlatform === 'twitter' && (
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
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>{config.title}</div>
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
        {previewPlatform === 'facebook' && (
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
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{config.title}</h4>
              </div>
            </div>
          </div>
        )}

        {/* RAW CANVAS (Default high-fidelity view) */}
        {previewPlatform === 'raw' && (
          <div 
            style={{
              width: `${currentRatio.width * scale}px`,
              height: `${currentRatio.height * scale}px`,
              transition: 'width 0.2s ease, height 0.2s ease',
              position: 'relative',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.15)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <div
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

  // Core Canvas Engine with 6 High-Fidelity Templates
  function renderActualCanvas() {
    return (
      <div
        ref={canvasRef}
        id="og-canvas-export"
        style={{
          width: `${currentRatio.width}px`,
          height: `${currentRatio.height}px`,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'var(--font-sans)',
          color: currentTheme.text,
          boxSizing: 'border-box',
          ...getPatternStyle()
        }}
      >
        {/* TEMPLATE 1: SAAS LAUNCHPAD */}
        {config.templateId === 'saas-launch' && (
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
                {config.title}
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
        {config.templateId === 'dev-terminal' && (
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
                  {config.title}
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
        {config.templateId === 'bento-grid' && (
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
                  {config.title}
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
        {config.templateId === 'clean-editorial' && (
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
                {config.title}
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
        {config.templateId === 'podcast-media' && (
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
                  {config.title}
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
        {config.templateId === 'cyber-glitch' && (
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
                {config.title}
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
      </div>
    );
  }
}
