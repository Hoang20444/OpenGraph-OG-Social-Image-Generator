import React, { useState } from 'react';
import { X, Layers, Download, CheckCircle2, AlertCircle, Loader2, Sparkles, FileArchive } from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { TEMPLATES } from '../data/templates';

export default function BatchExportModal({
  isOpen,
  onClose,
  config,
  onNotify
}) {
  const [titlesText, setTitlesText] = useState(
    `Cách kiếm 1000$ đầu tiên từ việc làm Web Tool độc lập\nTop 7 công cụ AI giúp Freelance Developer nhân đôi năng suất\nChiến lược SEO & OpenGraph tối ưu tỉ lệ click mạng xã hội\nHướng dẫn xây dựng SaaS không cần Backend từ A đến Z\nTối ưu UI/UX để giữ chân người dùng trong 5 giây đầu tiên`
  );
  const [selectedTemplate, setSelectedTemplate] = useState(config.templateId);
  const [cycleTemplates, setCycleTemplates] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const titles = titlesText
    .split('\n')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const handleStartBatch = async () => {
    if (titles.length === 0) {
      onNotify('⚠️ Vui lòng nhập ít nhất một tiêu đề');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const zip = new JSZip();
      const exportCanvas = document.getElementById('og-canvas-export');
      
      if (!exportCanvas) {
        throw new Error('Canvas container not found');
      }

      // Title element inside export canvas
      const titleElem = exportCanvas.querySelector('h1');
      const originalTitle = titleElem ? titleElem.innerText : config.title;

      for (let i = 0; i < titles.length; i++) {
        const itemTitle = titles[i];
        
        // Dynamically update DOM title for rendering
        if (titleElem) {
          titleElem.innerText = itemTitle;
        }

        // Brief delay to let React and browser repaint font rendering
        await new Promise((resolve) => setTimeout(resolve, 150));

        // Generate high-resolution PNG
        const dataUrl = await toPng(exportCanvas, {
          quality: 0.98,
          pixelRatio: 2,
          cacheBust: true
        });

        // Convert dataUrl to binary blob
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        const filename = `snapog-${(i + 1).toString().padStart(2, '0')}-${itemTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 30)}.png`;

        zip.file(filename, base64Data, { base64: true });
        setProgress(Math.round(((i + 1) / titles.length) * 100));
      }

      // Restore original title
      if (titleElem) {
        titleElem.innerText = originalTitle;
      }

      // Generate ZIP archive and trigger download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `snapog-batch-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onNotify(`🎉 Đã xuất thành công ${titles.length} ảnh vào file ZIP!`);
      onClose();
    } catch (err) {
      console.error('Batch export failed:', err);
      onNotify('❌ Lỗi khi tạo ảnh hàng loạt. Vui lòng thử lại!');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div 
        className="glass-panel" 
        style={{
          maxWidth: '620px',
          width: '100%',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <FileArchive size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
              Batch Generator & ZIP Export
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Nhập danh sách tiêu đề và xuất toàn bộ ảnh cùng lúc chỉ với 1 click ($0 Free)
            </p>
          </div>
        </div>

        {/* Titles Input */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label className="input-label" style={{ margin: 0 }}>
              Danh sách tiêu đề bài viết (mỗi dòng 1 tiêu đề)
            </label>
            <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700 }}>
              {titles.length} ảnh sẽ được tạo
            </span>
          </div>
          <textarea
            rows={6}
            disabled={isProcessing}
            value={titlesText}
            onChange={(e) => setTitlesText(e.target.value)}
            className="input-field"
            placeholder="Dán các tiêu đề bài viết vào đây..."
            style={{ fontSize: '13px', lineHeight: '1.5', resize: 'vertical' }}
          />
        </div>

        {/* Template Choice */}
        <div style={{ marginBottom: '22px' }}>
          <label className="input-label">Mẫu Template Áp Dụng</label>
          <select
            disabled={isProcessing}
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="input-field"
            style={{ fontSize: '13px', padding: '9px 12px' }}
          >
            {TEMPLATES.map((tpl) => (
              <option key={tpl.id} value={tpl.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                {tpl.name} ({tpl.badge})
              </option>
            ))}
          </select>
        </div>

        {/* Progress Bar (Visible when processing) */}
        {isProcessing && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: '#ffffff' }}>
              <span>Đang kết xuất ảnh retina 2X...</span>
              <span style={{ fontWeight: 700 }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                transition: 'width 0.2s ease'
              }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '9px 16px' }}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={isProcessing || titles.length === 0}
            onClick={handleStartBatch}
            className="btn-emerald"
            style={{ fontSize: '13px', padding: '9px 20px' }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="spin" />
                <span>Đang đóng gói ZIP ({progress}%)...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Tạo {titles.length} Ảnh & Tải ZIP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
