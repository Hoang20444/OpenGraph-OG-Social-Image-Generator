import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  FileArchive,
  Flame,
  Zap,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { TEMPLATES } from '../data/templates';
import { fetchLiveTrends, INITIAL_TRENDING_TOPICS } from '../data/trendingTopics';
import { generateAiSocialHooks } from '../utils/geminiAi';

export default function BatchExportModal({
  isOpen,
  onClose,
  config,
  onNotify
}) {
  const [titlesText, setTitlesText] = useState(
    `Bí quyết xây dựng thương hiệu cá nhân thu hút 10.000 người theo dõi\nChiến lược tối ưu hình ảnh mạng xã hội giúp tăng gấp đôi lượt click\nTop xu hướng thiết kế và sáng tạo nội dung dẫn đầu năm 2026\nLộ trình phát triển sản phẩm tinh gọn từ ý tưởng đến thực thi\nNghệ thuật kể chuyện (Storytelling) giúp giữ chân độc giả`
  );
  const [selectedTemplate, setSelectedTemplate] = useState(config.templateId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  if (!isOpen) return null;

  const titles = titlesText
    .split('\n')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  // Auto-populate with top live trends from Google Trends VN / RSS pipeline
  const handleLoadLiveTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const trends = await fetchLiveTrends();
      const topItems = (trends && trends.length > 0) ? trends : INITIAL_TRENDING_TOPICS;
      const extractedTitles = topItems
        .slice(0, 8)
        .map((item) => item.headline || item.title)
        .filter(Boolean);

      if (extractedTitles.length > 0) {
        setTitlesText(extractedTitles.join('\n'));
        if (onNotify) {
          onNotify(`🔥 Đã nạp ${extractedTitles.length} xu hướng nóng hổi nhất vào danh sách!`);
        }
      }
    } catch (err) {
      console.warn('Failed to load live trends into batch:', err);
      if (onNotify) onNotify('⚠️ Không thể tải dữ liệu xu hướng lúc này');
    } finally {
      setIsLoadingTrends(false);
    }
  };

  // Generate batch headlines with Gemini 3.x Flash
  const handleGenerateBatchWithAi = async () => {
    const topic = aiPrompt.trim() || 'Xu hướng AI và công nghệ 2026';
    setIsGeneratingAi(true);
    try {
      const res = await generateAiSocialHooks(topic);
      const suggestions = res.suggestions || [];
      if (suggestions.length > 0) {
        const newTitles = suggestions.map((s) => s.headline).join('\n');
        setTitlesText(newTitles);
        setShowAiInput(false);
        setAiPrompt('');
        if (onNotify) {
          onNotify(`✨ Gemini AI đã tạo ${suggestions.length} tiêu đề đón sóng mới!`);
        }
      }
    } catch (err) {
      if (onNotify) onNotify(`⚠️ Lỗi sinh tiêu đề: ${err.message}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

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
          maxWidth: '660px',
          width: '100%',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
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
              Auto-Pilot: Tạo Ảnh Hàng Loạt & Đóng Gói ZIP
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Nhập danh sách tiêu đề hoặc nạp tự động xu hướng đang hot để xuất toàn bộ ảnh cùng lúc (Retina 2X PNG)
            </p>
          </div>
        </div>

        {/* Quick Action Helpers */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '14px',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={handleLoadLiveTrends}
            disabled={isLoadingTrends || isProcessing}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              fontSize: '11px',
              fontWeight: 700,
              cursor: (isLoadingTrends || isProcessing) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s'
            }}
          >
            {isLoadingTrends ? <Loader2 size={13} className="animate-spin" /> : <Flame size={13} />}
            <span>🔥 Nạp Top 8 Xu Hướng Hôm Nay (Google Trends)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAiInput(!showAiInput)}
            disabled={isProcessing}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              background: 'rgba(99, 102, 241, 0.1)',
              color: '#818cf8',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s'
            }}
          >
            <Sparkles size={13} />
            <span>🤖 AI Viết Tiêu Đề Theo Chủ Đề</span>
          </button>
        </div>

        {/* Inline AI Prompt Generator for Batch */}
        {showAiInput && (
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            marginBottom: '14px',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              placeholder="Nhập chủ đề (ví dụ: Khóa học lập trình, Kinh doanh online 2026...)"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerateBatchWithAi();
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#ffffff',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={handleGenerateBatchWithAi}
              disabled={isGeneratingAi}
              style={{
                padding: '0 14px',
                borderRadius: '6px',
                border: 'none',
                background: '#6366f1',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                cursor: isGeneratingAi ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {isGeneratingAi ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
              <span>Sinh Tiêu Đề</span>
            </button>
          </div>
        )}

        {/* Titles Input */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label className="input-label" style={{ margin: 0 }}>
              Danh sách tiêu đề bài viết (mỗi dòng 1 tiêu đề)
            </label>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
              {titles.length} ảnh sẽ được đóng gói
            </span>
          </div>
          <textarea
            rows={7}
            disabled={isProcessing}
            value={titlesText}
            onChange={(e) => setTitlesText(e.target.value)}
            className="input-field"
            placeholder="Dán các tiêu đề bài viết vào đây (mỗi dòng một tiêu đề)..."
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
