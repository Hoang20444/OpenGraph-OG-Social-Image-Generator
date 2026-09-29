import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  Type, 
  Palette, 
  Sparkles, 
  Crown, 
  Upload, 
  User, 
  Globe, 
  Check, 
  Terminal, 
  Rocket, 
  Zap, 
  Code, 
  Flame, 
  Shield, 
  Layers, 
  Cpu,
  Ratio,
  Maximize2
} from 'lucide-react';
import { 
  TEMPLATES, 
  COLOR_THEMES, 
  ASPECT_RATIOS, 
  DEFAULT_AVATARS 
} from '../data/templates';

const BRAND_ICONS = [
  { id: 'sparkles', label: 'Sparkles', Icon: Sparkles },
  { id: 'terminal', label: 'Terminal', Icon: Terminal },
  { id: 'rocket', label: 'Rocket', Icon: Rocket },
  { id: 'zap', label: 'Lightning', Icon: Zap },
  { id: 'code', label: 'Code', Icon: Code },
  { id: 'flame', label: 'Flame', Icon: Flame },
  { id: 'shield', label: 'Shield', Icon: Shield },
  { id: 'layers', label: 'Layers', Icon: Layers },
  { id: 'cpu', label: 'Processor', Icon: Cpu }
];

export default function Sidebar({
  config,
  onChange,
  onOpenPro,
  isPro
}) {
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'content' | 'styling' | 'pro'

  const handleTextChange = (field, val) => {
    onChange({ ...config, [field]: val });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...config, avatarUrl: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside style={{
      width: '420px',
      flexShrink: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 65px)',
      overflowY: 'auto'
    }}>
      {/* Navigation Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(0, 0, 0, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        {[
          { id: 'templates', label: 'Layouts', icon: LayoutTemplate },
          { id: 'content', label: 'Content', icon: Type },
          { id: 'styling', label: 'Themes', icon: Palette },
          { id: 'pro', label: 'Pro Pack', icon: Crown }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 600,
                color: isActive ? 'var(--color-primary)' : 'var(--text-dim)',
                background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* TAB 1: TEMPLATES & RATIOS */}
        {activeTab === 'templates' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Aspect Ratio Picker */}
            <div>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ratio size={14} /> Aspect Ratio & Canvas Size
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {ASPECT_RATIOS.map((r) => {
                  const isSelected = config.aspectRatio === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => onChange({ ...config, aspectRatio: r.id })}
                      className="glass-card"
                      style={{
                        padding: '10px',
                        textAlign: 'left',
                        borderRadius: '8px',
                        borderColor: isSelected ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.07)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '13px', color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                        {r.desc}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--color-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                        {r.width} × {r.height}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Cards */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="input-label">Select Template Engine</label>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>6 Templates</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {TEMPLATES.map((tmpl) => {
                  const isSelected = config.templateId === tmpl.id;
                  const isLocked = tmpl.isPro && !isPro;

                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => {
                        if (isLocked) {
                          onOpenPro();
                        } else {
                          onChange({ ...config, templateId: tmpl.id });
                        }
                      }}
                      className="glass-card"
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-subtle)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
                            {tmpl.name}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: tmpl.isPro ? 'rgba(245, 158, 11, 0.18)' : 'rgba(99, 102, 241, 0.15)',
                            color: tmpl.isPro ? '#f59e0b' : '#818cf8',
                            border: `1px solid ${tmpl.isPro ? 'rgba(245, 158, 11, 0.3)' : 'rgba(99, 102, 241, 0.25)'}`
                          }}>
                            {tmpl.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '3px' }}>
                          {tmpl.tagline}
                        </div>
                      </div>

                      {isLocked ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#f59e0b',
                          background: 'rgba(245, 158, 11, 0.15)',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          <Crown size={13} />
                          <span>PRO</span>
                        </div>
                      ) : isSelected ? (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={14} color="#ffffff" />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTENT & COPY */}
        {activeTab === 'content' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Title */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Headline / Title</label>
                <span style={{ 
                  fontSize: '11px', 
                  color: config.title.length > 70 ? 'var(--color-warning)' : 'var(--text-dim)' 
                }}>
                  {config.title.length}/80 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={config.title}
                onChange={(e) => handleTextChange('title', e.target.value)}
                className="input-field font-heading"
                placeholder="Enter compelling headline..."
                style={{ fontSize: '14px', lineHeight: '1.4', resize: 'vertical' }}
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="input-label">Subtitle / Description</label>
              <textarea
                rows={2}
                value={config.subtitle}
                onChange={(e) => handleTextChange('subtitle', e.target.value)}
                className="input-field"
                placeholder="Brief summary or hook..."
                style={{ fontSize: '13px', lineHeight: '1.4', resize: 'vertical' }}
              />
            </div>

            {/* Category / Pill Badge */}
            <div>
              <label className="input-label">Category / Pill Badge</label>
              <input
                type="text"
                value={config.categoryTag}
                onChange={(e) => handleTextChange('categoryTag', e.target.value)}
                className="input-field"
                placeholder="e.g. 🚀 NEW RELEASE or TUTORIAL"
                style={{ fontSize: '13px' }}
              />
            </div>

            {/* Author Section */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              padding: '14px', 
              borderRadius: '10px', 
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} color="var(--color-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Author & Creator
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Name</span>
                  <input
                    type="text"
                    value={config.authorName}
                    onChange={(e) => handleTextChange('authorName', e.target.value)}
                    className="input-field"
                    placeholder="Alex Vance"
                    style={{ fontSize: '12px', padding: '7px 10px' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Role / Handle</span>
                  <input
                    type="text"
                    value={config.authorRole}
                    onChange={(e) => handleTextChange('authorRole', e.target.value)}
                    className="input-field"
                    placeholder="@alexvance"
                    style={{ fontSize: '12px', padding: '7px 10px' }}
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                  Avatar Selection
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {DEFAULT_AVATARS.map((av) => (
                    <img
                      key={av.id}
                      src={av.url}
                      alt={av.label}
                      onClick={() => onChange({ ...config, avatarUrl: av.url })}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        objectFit: 'cover',
                        border: config.avatarUrl === av.url ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                        transform: config.avatarUrl === av.url ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  ))}

                  {/* Custom Upload Button */}
                  <label
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px dashed var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                    title="Upload custom image"
                  >
                    <Upload size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Brand Website & Icon */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              padding: '14px', 
              borderRadius: '10px', 
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={14} color="var(--color-secondary)" />
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Brand & Domain
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Site Domain / Watermark
                </span>
                <input
                  type="text"
                  value={config.siteUrl}
                  onChange={(e) => handleTextChange('siteUrl', e.target.value)}
                  className="input-field"
                  placeholder="snapog.dev"
                  style={{ fontSize: '13px' }}
                />
              </div>

              {/* Brand Icon Selector */}
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                  Brand Icon
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {BRAND_ICONS.map((item) => {
                    const Icon = item.Icon;
                    const isSelected = config.brandIcon === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onChange({ ...config, brandIcon: item.id })}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isSelected ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.04)',
                          color: isSelected ? '#ffffff' : 'var(--text-dim)',
                          border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Icon size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STYLING & PALETTES */}
        {activeTab === 'styling' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Color Themes */}
            <div>
              <label className="input-label">Color Gradient Theme</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {COLOR_THEMES.map((theme) => {
                  const isSelected = config.themeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => onChange({ ...config, themeId: theme.id })}
                      className="glass-card"
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textAlign: 'left',
                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-subtle)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)'
                      }}
                    >
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        background: theme.gradient,
                        boxShadow: `0 0 10px ${theme.glowColor}`
                      }} />
                      <div style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                        {theme.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background Texture Pattern */}
            <div>
              <label className="input-label">Background Pattern</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { id: 'dots', label: 'Dot Matrix' },
                  { id: 'grid', label: 'Tech Grid' },
                  { id: 'glow', label: 'Radial Glow' },
                  { id: 'mesh', label: 'Mesh Blur' },
                  { id: 'clean', label: 'Solid Clean' }
                ].map((pat) => {
                  const isSelected = config.pattern === pat.id;
                  return (
                    <button
                      key={pat.id}
                      onClick={() => onChange({ ...config, pattern: pat.id })}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: isSelected ? '#ffffff' : 'var(--text-dim)',
                        border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      {pat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography Scale Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="input-label" style={{ margin: 0 }}>Title Size</label>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  {config.fontSize}px
                </span>
              </div>
              <input
                type="range"
                min="36"
                max="68"
                step="2"
                value={config.fontSize}
                onChange={(e) => onChange({ ...config, fontSize: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Text Alignment */}
            <div>
              <label className="input-label">Text Alignment</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['left', 'center'].map((align) => {
                  const isSelected = config.align === align;
                  return (
                    <button
                      key={align}
                      onClick={() => onChange({ ...config, align })}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: isSelected ? '#ffffff' : 'var(--text-dim)',
                        border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      {align} Align
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRO PACK & MONETIZATION */}
        {activeTab === 'pro' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Crown size={20} color="#f59e0b" />
                <span style={{ fontWeight: 800, fontSize: '16px', color: '#ffffff' }}>
                  SnapOG PRO Lifetime
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Unlock all premium templates, batch CSV social card creation, custom SVG exports, and priority features for a one-time payment.
              </p>

              <div style={{ margin: '14px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  '15+ Exclusive Design Engines',
                  'Batch CSV Generation (20+ cards in 1s)',
                  'Custom Font & SVG Vector Export',
                  'Remove Watermarks & Unlimited Downloads'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#f8fafc' }}>
                    <Check size={13} color="#10b981" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenPro}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
                }}
              >
                {isPro ? 'Manage PRO Membership' : 'Upgrade for $9 / 49.000₫'}
              </button>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '14px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                💡 Solopreneur Monetization Stack:
              </span>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                This is a live working demonstration of how you can integrate **Gumroad / Lemon Squeezy** (International USD) and **VietQR / PayOS** (Vietnam VND) with $0 upfront cost!
              </p>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
