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
  Maximize2,
  Box,
  Sliders,
  Tag,
  Dices,
  Loader2,
  Link2,
  Highlighter,
  Paintbrush
} from 'lucide-react';
import { 
  TEMPLATES, 
  COLOR_THEMES, 
  ASPECT_RATIOS, 
  DEFAULT_AVATARS,
  STICKERS,
  FONT_FAMILIES
} from '../data/templates';
import { fetchUrlMetadata } from '../utils/magicFetcher';

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
  isPro,
  onShufflePalette,
  onNotify
}) {
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'content' | 'styling' | 'pro'
  const [magicUrl, setMagicUrl] = useState('');
  const [isLoadingMagic, setIsLoadingMagic] = useState(false);

  const handleMagicFetch = async () => {
    if (!magicUrl.trim()) {
      if (onNotify) onNotify('⚠️ Vui lòng nhập link bài viết hoặc repository');
      return;
    }
    setIsLoadingMagic(true);
    try {
      const data = await fetchUrlMetadata(magicUrl);
      onChange({
        ...config,
        title: data.title || config.title,
        subtitle: data.subtitle || config.subtitle,
        authorName: data.authorName || config.authorName,
        authorRole: data.authorRole || config.authorRole,
        siteUrl: data.siteUrl || config.siteUrl,
        categoryTag: data.categoryTag || config.categoryTag,
        avatarUrl: data.avatarUrl || config.avatarUrl,
        ...(data.templateId ? { templateId: data.templateId } : {}),
        ...(data.themeId ? { themeId: data.themeId } : {})
      });
      if (onNotify) onNotify(`✨ Đã tự động bóc tách thông tin từ ${data.siteUrl}!`);
      setMagicUrl('');
    } catch (err) {
      if (onNotify) onNotify(`⚠️ Lỗi bóc tách metadata: ${err.message}`);
    } finally {
      setIsLoadingMagic(false);
    }
  };

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
                <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700 }}>
                  {TEMPLATES.length} Templates (Live)
                </span>
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
            {/* Magic URL Auto-Fill Box ($0 Free) */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '12px 14px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#818cf8" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
                    Magic URL Auto-Fill
                  </span>
                </div>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.18)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  $0 FREE
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  placeholder="Paste article or GitHub link..."
                  value={magicUrl}
                  onChange={(e) => setMagicUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMagicFetch()}
                  className="input-field"
                  style={{ fontSize: '12px', padding: '7px 10px', flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleMagicFetch}
                  disabled={isLoadingMagic}
                  className="btn-primary"
                  style={{
                    padding: '7px 12px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isLoadingMagic ? (
                    <>
                      <Loader2 size={13} className="spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>Auto-Fill</span>
                    </>
                  )}
                </button>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>
                Supports Medium, Substack, Dev.to, GitHub repos & personal blogs
              </div>
            </div>

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

            {/* Accent Highlight Word (Glow / Marker effect) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Highlighter size={13} color="var(--color-warning)" />
                  <span>Highlight Accent Word</span>
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Optional</span>
              </div>
              <input
                type="text"
                value={config.highlightWord || ''}
                onChange={(e) => handleTextChange('highlightWord', e.target.value)}
                className="input-field"
                placeholder="e.g. 1000$ or AI (word to highlight in title)"
                style={{ fontSize: '13px' }}
              />
            </div>

            {/* Typography Font Family Picker */}
            <div>
              <label className="input-label">Typography / Phông Chữ</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {FONT_FAMILIES.map((f) => {
                  const isSelected = (config.fontFamily || 'heading') === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleTextChange('fontFamily', f.id)}
                      className="glass-card"
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-subtle)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.02)'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? '#ffffff' : 'var(--text-main)', fontFamily: f.fontVar }}>
                        {f.name}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>
                        {f.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
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
            {/* Color Mode Switcher */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                type="button"
                onClick={() => onChange({ ...config, isCustomColor: false })}
                style={{
                  flex: 1,
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '6px 0',
                  borderRadius: '6px',
                  background: !config.isCustomColor ? 'var(--color-primary)' : 'transparent',
                  color: !config.isCustomColor ? '#ffffff' : 'var(--text-dim)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Preset Themes
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...config, isCustomColor: true })}
                style={{
                  flex: 1,
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '6px 0',
                  borderRadius: '6px',
                  background: config.isCustomColor ? 'linear-gradient(135deg, #f59e0b, #ec4899)' : 'transparent',
                  color: config.isCustomColor ? '#ffffff' : 'var(--text-dim)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Custom Palette 🎨
              </button>
            </div>

            {/* PRESET PALETTES VIEW */}
            {!config.isCustomColor ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="input-label" style={{ margin: 0 }}>Color Gradient Theme</label>
                  <button
                    type="button"
                    onClick={onShufflePalette}
                    className="btn-secondary"
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#f59e0b',
                      borderColor: 'rgba(245, 158, 11, 0.3)'
                    }}
                    title="Randomize color theme"
                  >
                    <Dices size={13} />
                    <span>Shuffle 🎲</span>
                  </button>
                </div>
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
            ) : (
              /* CUSTOM COLORS BUILDER */
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Paintbrush size={14} color="#f59e0b" />
                  <span>Custom Color Studio</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <label className="input-label" style={{ fontSize: '10px' }}>Primary</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="color"
                        value={config.customPrimary || '#6366f1'}
                        onChange={(e) => onChange({ ...config, customPrimary: e.target.value })}
                        style={{ width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', border: 'none', background: 'none' }}
                      />
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                        {config.customPrimary || '#6366f1'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="input-label" style={{ fontSize: '10px' }}>Secondary</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="color"
                        value={config.customSecondary || '#06b6d4'}
                        onChange={(e) => onChange({ ...config, customSecondary: e.target.value })}
                        style={{ width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', border: 'none', background: 'none' }}
                      />
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                        {config.customSecondary || '#06b6d4'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="input-label" style={{ fontSize: '10px' }}>Background</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="color"
                        value={config.customBg || '#030712'}
                        onChange={(e) => onChange({ ...config, customBg: e.target.value })}
                        style={{ width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', border: 'none', background: 'none' }}
                      />
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                        {config.customBg || '#030712'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gradient Angle Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="input-label" style={{ margin: 0, fontSize: '11px' }}>Gradient Angle</label>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                      {config.customGradientAngle || 135}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={config.customGradientAngle || 135}
                    onChange={(e) => onChange({ ...config, customGradientAngle: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                  />
                </div>

                {/* Custom Gradient Preview Bar */}
                <div style={{
                  height: '24px',
                  borderRadius: '6px',
                  background: `linear-gradient(${config.customGradientAngle || 135}deg, ${config.customPrimary || '#6366f1'} 0%, ${config.customSecondary || '#06b6d4'} 100%)`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }} />
              </div>
            )}

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

            {/* 3D Perspective Tilt Toggle */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="input-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Box size={14} color="var(--color-primary)" /> 3D Perspective Tilt
                </label>
                <button
                  onClick={() => onChange({ ...config, tilt3D: !config.tilt3D })}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: config.tilt3D ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {config.tilt3D ? 'ON (Active)' : 'OFF'}
                </button>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Tạo góc nghiêng 3D không gian cho thẻ bài, tạo chiều sâu thị giác chân thực.
              </p>
            </div>

            {/* Stickers / Human Badges */}
            <div>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={14} color="#f59e0b" /> Human Sticker Badge
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {STICKERS.map((stk) => {
                  const isSelected = (config.sticker || 'none') === stk.id;
                  return (
                    <button
                      key={stk.id}
                      onClick={() => onChange({ ...config, sticker: stk.id })}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: isSelected ? (stk.bg || 'rgba(99, 102, 241, 0.25)') : 'rgba(255, 255, 255, 0.03)',
                        color: isSelected ? (stk.color || '#ffffff') : 'var(--text-dim)',
                        border: isSelected ? `1px solid ${stk.color || 'var(--color-primary)'}` : '1px solid var(--border-subtle)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {stk.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card Border Radius Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="input-label" style={{ margin: 0 }}>Border Radius (Bo góc)</label>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  {config.borderRadius ?? 16}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="36"
                step="2"
                value={config.borderRadius ?? 16}
                onChange={(e) => onChange({ ...config, borderRadius: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Canvas Inner Padding Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="input-label" style={{ margin: 0 }}>Inner Padding (Đệm lề)</label>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  {config.padding ?? 60}px
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={config.padding ?? 60}
                onChange={(e) => onChange({ ...config, padding: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Shadow Depth Selector */}
            <div>
              <label className="input-label">Shadow Depth (Bóng đổ)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { id: 'none', label: 'None' },
                  { id: 'soft', label: 'Soft' },
                  { id: 'medium', label: 'Deep' },
                  { id: 'glow', label: 'Glow' }
                ].map((sh) => {
                  const isSelected = (config.shadowIntensity || 'medium') === sh.id;
                  return (
                    <button
                      key={sh.id}
                      onClick={() => onChange({ ...config, shadowIntensity: sh.id })}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: isSelected ? '#ffffff' : 'var(--text-dim)',
                        border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      {sh.label}
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
