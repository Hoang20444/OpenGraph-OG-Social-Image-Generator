import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Code2, 
  Check, 
  Loader2, 
  Sparkles, 
  Image as ImageIcon 
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

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b']
    });
  };

  // Export High-Resolution PNG
  const handleExportPNG = async () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);

    try {
      // Use pixelRatio: 2 for ultra-crisp Retina display
      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true
      });

      const link = document.createElement('a');
      const filename = `snapog-${config.templateId}-${Date.now()}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();

      triggerConfetti();
      onNotify(`🎉 Exported ${filename} in 2X Retina resolution!`);
    } catch (err) {
      console.error('PNG export failed', err);
      onNotify('⚠️ Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export JPEG
  const handleExportJPEG = async () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const dataUrl = await htmlToImage.toJpeg(canvasRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#030712'
      });

      const link = document.createElement('a');
      const filename = `snapog-${config.templateId}-${Date.now()}.jpg`;
      link.download = filename;
      link.href = dataUrl;
      link.click();

      triggerConfetti();
      onNotify(`🎉 Exported ${filename} successfully!`);
    } catch (err) {
      console.error('JPEG export failed', err);
      onNotify('⚠️ JPEG export failed.');
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
        onNotify('📋 Image copied to clipboard! Ready to paste into Slack, Figma or Twitter.');
        setTimeout(() => setIsCopied(false), 2500);
      } else {
        throw new Error('Clipboard API not supported');
      }
    } catch (err) {
      console.warn('Clipboard write error', err);
      onNotify('⚠️ Direct clipboard copy not supported in this browser. Please use Export PNG!');
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
      background: 'rgba(11, 15, 25, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '16px',
      padding: '8px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(99, 102, 241, 0.25)'
    }}>
      {/* Primary 2X PNG Export CTA */}
      <button
        onClick={handleExportPNG}
        disabled={isExporting}
        className="btn-emerald"
        style={{ fontSize: '13px', padding: '9px 18px', gap: '8px' }}
      >
        {isExporting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        <span>Export 2X Retina PNG</span>
      </button>

      {/* Export JPEG */}
      <button
        onClick={handleExportJPEG}
        disabled={isExporting}
        className="btn-secondary"
        style={{ fontSize: '13px', padding: '8px 14px' }}
        title="Smaller file size for blogs"
      >
        <ImageIcon size={15} />
        <span>JPG</span>
      </button>

      {/* Copy Image to Clipboard */}
      <button
        onClick={handleCopyToClipboard}
        disabled={isExporting}
        className="btn-secondary"
        style={{ fontSize: '13px', padding: '8px 14px' }}
        title="Copy directly to paste into Figma/Slack"
      >
        {isCopied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
        <span>{isCopied ? 'Copied!' : 'Copy Image'}</span>
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
        <span>&lt;meta&gt; Tags</span>
      </button>
    </div>
  );
}
