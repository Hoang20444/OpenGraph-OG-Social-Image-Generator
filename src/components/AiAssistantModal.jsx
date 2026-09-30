import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Key, 
  Send, 
  Loader2, 
  Check, 
  TrendingUp, 
  Flame, 
  HelpCircle, 
  ExternalLink,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getStoredGeminiKey, 
  saveStoredGeminiKey, 
  generateAiSocialHooks 
} from '../utils/geminiAi';

const QUICK_IDEAS = [
  'Kinh nghiệm xây dựng Micro-SaaS 0 đồng',
  'Cách ứng dụng AI Agent vào công việc hàng ngày',
  'Bí quyết giữ chân khách hàng trên TikTok Shop',
  'Trào lưu Digital Detox và làm việc tập trung'
];

export default function AiAssistantModal({
  isOpen,
  onClose,
  onApplyHook,
  onNotify
}) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [engineSource, setEngineSource] = useState('');
  
  // API Key management state
  const [apiKey, setApiKey] = useState('');
  const [isConfiguringKey, setIsConfiguringKey] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredGeminiKey();
      setApiKey(stored);
      setHasCustomKey(Boolean(stored));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    saveStoredGeminiKey(apiKey);
    const hasKey = Boolean(apiKey.trim());
    setHasCustomKey(hasKey);
    setIsConfiguringKey(false);
    if (onNotify) {
      onNotify(hasKey ? '✅ Đã lưu Google Gemini API Key vào trình duyệt!' : 'ℹ️ Đã xóa khóa API, chuyển về bộ sinh thông minh');
    }
  };

  const handleGenerate = async (overrideTopic) => {
    const textToRun = (overrideTopic || topic).trim();
    if (!textToRun) {
      if (onNotify) onNotify('⚠️ Vui lòng nhập chủ đề hoặc ý tưởng của bạn');
      return;
    }

    setIsGenerating(true);
    setSuggestions([]);
    try {
      const res = await generateAiSocialHooks(textToRun);
      setSuggestions(res.suggestions || []);
      setEngineSource(res.source);
      if (onNotify) {
        if (res.source === 'gemini_1.5_flash') {
          onNotify('✨ Google Gemini 1.5 Flash đã phân tích & tạo 3 Hook triệu view!');
        } else {
          onNotify('✨ Đã tạo 3 phương án Social Hook thông minh!');
        }
      }
    } catch (err) {
      if (onNotify) onNotify(`⚠️ Lỗi sinh nội dung: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = (item) => {
    if (onApplyHook) {
      onApplyHook({
        title: item.headline,
        subtitle: item.subtitle,
        categoryTag: item.categoryTag,
        highlightWord: item.highlightWord,
        templateId: item.suggestedTemplate,
        themeId: item.suggestedTheme
      });
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    if (onNotify) {
      onNotify(`🎉 Đã áp dụng tiêu đề: "${item.headline}"`);
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="glass-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          background: 'linear-gradient(145deg, #131722, #0d1117)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                  AI Social Hook Copywriter
                </h3>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: hasCustomKey ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: hasCustomKey ? '#34d399' : '#f59e0b',
                  border: hasCustomKey ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  {hasCustomKey ? 'GEMINI 1.5 FLASH CONNECTED' : 'HEURISTIC SMART ENGINE'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-dim)' }}>
                Tạo 3 tiêu đề giật tít đón sóng viral, bóc tách từ khóa phát sáng và phối màu tự động
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsConfiguringKey(!isConfiguringKey)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: isConfiguringKey ? '#ffffff' : 'var(--text-dim)',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Cài đặt khóa Google Gemini API miễn phí"
            >
              <Key size={12} />
              <span>{hasCustomKey ? 'Đổi Khóa API' : 'Thêm API Key'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* API Key Configuration Drawer */}
        {isConfiguringKey && (
          <div style={{
            padding: '14px 20px',
            background: 'rgba(99, 102, 241, 0.07)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={13} color="#6366f1" /> Cấu hình Google Gemini 1.5 Flash API (Miễn phí 100%)
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '11px',
                  color: '#818cf8',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Lấy khóa miễn phí tại Google AI Studio</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                placeholder="Dán mã API Key của bạn (bắt đầu bằng AIzaSy...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSaveKey}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  background: '#6366f1',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Lưu Khóa
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-dim)' }}>
              <ShieldCheck size={12} color="#10b981" />
              <span>Khóa API được lưu cục bộ trong LocalStorage trình duyệt của bạn, hoàn toàn bảo mật và không qua máy chủ trung gian.</span>
            </div>
          </div>
        )}

        {/* Modal Body / Scrollable Content */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Input Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} color="#f59e0b" /> Nhập chủ đề, ý tưởng hoặc đường link bài viết:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Ví dụ: Chiến lược bán hàng TikTok Shop 2026, 4 giờ Deep Work mỗi ngày..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !topic.trim()}
                style={{
                  padding: '0 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: (isGenerating || !topic.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (isGenerating || !topic.trim()) ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Đang suy nghĩ...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Sinh Hook AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Idea Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Gợi ý nhanh:</span>
              {QUICK_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopic(idea);
                    handleGenerate(idea);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-muted)',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* AI Suggestions Results */}
          {suggestions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🎯 3 Phương Án Tối Ưu Độ Lan Truyền:
                </span>
                <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={12} /> Bấm nút để nạp trực tiếp vào ảnh
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      position: 'relative'
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#818cf8',
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                      }}>
                        {item.style}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#f59e0b',
                        background: 'rgba(245, 158, 11, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Flame size={12} /> {item.viralityScore}
                      </span>
                    </div>

                    {/* Headline */}
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#ffffff', lineHeight: '1.4' }}>
                      "{item.headline}"
                    </h4>

                    {/* Subtitle */}
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                      {item.subtitle}
                    </p>

                    {/* Tag & Highlight Meta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#34d399',
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {item.categoryTag}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        color: 'var(--text-muted)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        Từ khóa phát sáng: <strong>{item.highlightWord}</strong>
                      </span>
                    </div>

                    {/* Action Button */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '4px',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <button
                        onClick={() => handleApply(item)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
                          transition: 'all 0.15s'
                        }}
                      >
                        <span>Áp Dụng Vào Canvas Ngay</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
