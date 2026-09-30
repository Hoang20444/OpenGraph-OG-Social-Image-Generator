import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Code2, 
  Check, 
  Loader2, 
  Sparkles, 
  Image as ImageIcon,
  Zap,
  Layers
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';

export default function ExportToolbar({
  canvasRef,
  config,
  onOpenMeta,
  onNotify
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [exportScale, setExportScale] = useState(2); // 1 | 2 | 3
  const [format, setFormat] = useState('png'); // 'png' | 'jpg' | 'webp'

  // Generate clean slug for filename
  const getCleanSlug = () => {
    if (!config.title) return config.templateId || 'card';
    return config.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 35) || 'card';
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b']
    });
  };

  // Primary Export Handler
  const handleExport = async () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const slug = getCleanSlug();
      let dataUrl;
      let filename;

      if (format === 'jpg') {
        filename = `snapog-${slug}-${exportScale}x.jpg`;
        dataUrl = await htmlToImage.toJpeg(canvasRef.current, {
          quality: 0.95,
          pixelRatio: exportScale,
          backgroundColor: '#030712'
        });
      } else {
        filename = `snapog-${slug}-${exportScale}x.png`;
        dataUrl = await htmlToImage.toPng(canvasRef.current, {
          quality: 1.0,
          pixelRatio: exportScale,
          cacheBust: true
        });
      }

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      triggerConfetti();
      onNotify(`🎉 Đã tải ${filename} (${exportScale}X Retina resolution)!`);
    } catch (err) {
      console.error('Export failed', err);
      onNotify('⚠️ Quá trình xuất ảnh gặp sự cố. Vui lòng thử lại!');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Direct Image to Clipboard (PNG Blob)
  const handleCopyToClipboard = async () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const blob = await htmlToImage.toBlob(canvasRef.current, {
        pixelRatio: 2
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setIsCopied(true);
        triggerConfetti();
        onNotify('📋 Đã sao chép ảnh vào clipboard! Bạn có thể dán (Ctrl+V) thẳng vào Twitter, Discord, Slack hoặc Figma.');
        setTimeout(() => setIsCopied(false), 2500);
      } else {
        throw new Error('Clipboard API not supported');
      }
    } catch (err) {
      console.warn('Clipboard write error', err);
      onNotify('⚠️ Trình duyệt chưa cấp quyền sao chép ảnh trực tiếp. Vui lòng bấm Tải PNG!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 40,
      background: 'rgba(11, 15, 25, 0.92)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      borderRadius: '16px',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(99, 102, 241, 0.3)',
      flexWrap: 'wrap'
    }}>
      {/* Resolution Multiplier Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '3px',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)'
      }}>
        {[
          { scale: 1, label: '1X' },
          { scale: 2, label: '2X Retina' },
          { scale: 3, label: '3X 4K' }
        ].map((item) => (
          <button
            key={item.scale}
            type="button"
            onClick={() => setExportScale(item.scale)}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 8px',
              borderRadius: '5px',
              background: exportScale === item.scale ? 'rgba(99, 102, 241, 0.35)' : 'transparent',
              color: exportScale === item.scale ? '#ffffff' : 'var(--text-dim)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Format Selector: PNG / JPG */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '3px',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)'
      }}>
        {['png', 'jpg'].map((fmt) => (
          <button
            key={fmt}
            type="button"
            onClick={() => setFormat(fmt)}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              padding: '4px 9px',
              borderRadius: '5px',
              background: format === fmt ? 'var(--color-primary)' : 'transparent',
              color: format === fmt ? '#ffffff' : 'var(--text-dim)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* Primary Export CTA */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="btn-emerald"
        style={{ fontSize: '13px', padding: '9px 18px', gap: '8px', fontWeight: 700 }}
      >
        {isExporting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        <span>Tải Ảnh {exportScale}X ({format.toUpperCase()})</span>
      </button>

      {/* Copy Image directly to Clipboard */}
      <button
        onClick={handleCopyToClipboard}
        disabled={isExporting}
        className="btn-secondary"
        style={{ fontSize: '13px', padding: '8px 14px', gap: '6px' }}
        title="Sao chép trực tiếp để Ctrl+V vào Twitter, Discord, Slack hoặc Figma"
      >
        {isCopied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
        <span>{isCopied ? 'Đã sao chép!' : 'Sao chép ảnh (Ctrl+V)'}</span>
      </button>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.12)' }} />

      {/* Meta Tags Generator */}
      <button
        onClick={onOpenMeta}
        className="btn-secondary"
        style={{ fontSize: '13px', padding: '8px 14px', color: 'var(--color-secondary)' }}
      >
        <Code2 size={15} />
        <span>Thẻ Meta SEO</span>
      </button>
    </div>
  );
}
