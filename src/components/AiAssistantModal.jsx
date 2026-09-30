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
  ShieldCheck,
  Link2,
  Globe,
  Radio,
  Share2,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getStoredGeminiKey, 
  saveStoredGeminiKey, 
  getStoredGeminiModel,
  saveStoredGeminiModel,
  AVAILABLE_MODELS,
  generateAiSocialHooks,
  analyzeSocialLinkWithGemini,
  testGeminiConnection
} from '../utils/geminiAi';
import { 
  scrapeSocialUrl, 
  detectPlatform, 
  PLATFORMS 
} from '../utils/socialScraper';

const QUICK_IDEAS = [
  'Kinh nghiệm xây dựng Micro-SaaS 0 đồng',
  'Cách ứng dụng AI Agent vào công việc hàng ngày',
  'Bí quyết giữ chân khách hàng trên TikTok Shop',
  'Trào lưu Digital Detox và làm việc tập trung'
];

const QUICK_LINK_SAMPLES = [
  { label: '▶️ YouTube AI', url: 'https://www.youtube.com/watch?v=aircAruvnKk' },
  { label: '📰 VnExpress Tech', url: 'https://vnexpress.net/cong-nghe' },
  { label: '🐙 GitHub Trend', url: 'https://github.com/trending' },
  { label: '🌐 YCombinator HackerNews', url: 'https://news.ycombinator.com' }
];

export default function AiAssistantModal({
  isOpen,
  onClose,
  onApplyHook,
  onNotify,
  initialTab = 'prompt'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'prompt' | 'link'
  
  // Tab 1 (Prompt Hook) State
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [engineSource, setEngineSource] = useState('');
  const [lastAiMeta, setLastAiMeta] = useState(null);

  // Tab 2 (Social Link Intelligence) State
  const [socialUrl, setSocialUrl] = useState('');
  const [isAnalyzingLink, setIsAnalyzingLink] = useState(false);
  const [linkProgressStep, setLinkProgressStep] = useState('');
  const [linkResult, setLinkResult] = useState(null);
  const [linkAiMeta, setLinkAiMeta] = useState(null);
  
  // API Key & Model management state
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState(() => getStoredGeminiModel());
  const [isConfiguringKey, setIsConfiguringKey] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredGeminiKey();
      setApiKey(stored);
      setHasCustomKey(Boolean(stored));
      setSelectedModel(getStoredGeminiModel());
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    saveStoredGeminiKey(apiKey);
    saveStoredGeminiModel(selectedModel);
    const hasKey = Boolean(apiKey.trim());
    setHasCustomKey(hasKey);
    setIsConfiguringKey(false);
    if (onNotify) {
      onNotify(hasKey ? `✅ Đã lưu cấu hình AI (${selectedModel}) vào trình duyệt!` : 'ℹ️ Đã xóa khóa API, chuyển về bộ sinh thông minh');
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      if (onNotify) onNotify('⚠️ Vui lòng nhập API Key để kiểm tra');
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiConnection(apiKey, selectedModel);
      setTestResult(res);
      if (onNotify) {
        onNotify(res.success ? `✅ ${res.message}` : `❌ ${res.message}`);
      }
    } finally {
      setIsTesting(false);
    }
  };

  // --- Handlers for Tab 1: Topic Prompt ---
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
      setLastAiMeta({
        isRealAi: res.isRealAi,
        model: res.model || selectedModel,
        isFallback: res.isFallback,
        fallbackFrom: res.fallbackFrom,
        elapsed: res.elapsed,
        errorMsg: res.errorMsg,
        failedModel: res.failedModel
      });

      if (onNotify) {
        if (res.isRealAi) {
          if (res.isFallback) {
            onNotify(`⚡ Mô hình "${res.fallbackFrom}" quá tải (503), đã tự động dùng "${res.model}" thành công! (${res.elapsed}ms)`);
          } else {
            onNotify(`✨ Google Gemini (${res.model}) đã phân tích & tạo 3 Hook triệu view! (${res.elapsed}ms)`);
          }
        } else if (res.errorMsg) {
          onNotify(`⚠️ Google API báo lỗi (${res.failedModel}): ${res.errorMsg}`);
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

  // --- Handlers for Tab 2: Social Link Scraping ---
  const handleAnalyzeLink = async (overrideUrl) => {
    const urlToRun = (overrideUrl || socialUrl).trim();
    if (!urlToRun) {
      if (onNotify) onNotify('⚠️ Vui lòng nhập link bài viết mạng xã hội hoặc website');
      return;
    }

    setIsAnalyzingLink(true);
    setLinkResult(null);
    setLinkProgressStep('Đang kết nối Jina AI Reader để bóc tách nội dung...');

    try {
      // Step 1: Scrape clean content via Jina Reader
      const scraped = await scrapeSocialUrl(urlToRun, (_status, msg) => {
        setLinkProgressStep(msg);
      });

      // Step 2: Feed into Gemini 3.x Flash
      setLinkProgressStep(`Gemini 3.x đang phân tích thông điệp từ ${scraped.platform.name}...`);
      const aiRes = await analyzeSocialLinkWithGemini(scraped);

      setLinkResult({
        ...scraped,
        ...aiRes.data
      });

      setLinkAiMeta({
        isRealAi: aiRes.isRealAi,
        model: aiRes.model || selectedModel,
        isFallback: aiRes.isFallback,
        fallbackFrom: aiRes.fallbackFrom,
        elapsed: aiRes.elapsed,
        errorMsg: aiRes.errorMsg,
        failedModel: aiRes.failedModel
      });

      if (onNotify) {
        onNotify(`✨ Đã phân tích thành công nội dung từ ${scraped.platform.name}!`);
      }
    } catch (err) {
      if (onNotify) onNotify(`⚠️ Lỗi phân tích link: ${err.message}`);
    } finally {
      setIsAnalyzingLink(false);
      setLinkProgressStep('');
    }
  };

  const handleApply = (item, customMeta = {}) => {
    if (onApplyHook) {
      onApplyHook({
        title: item.headline,
        subtitle: item.subtitle,
        categoryTag: item.categoryTag,
        highlightWord: item.highlightWord,
        templateId: item.suggestedTemplate,
        themeId: item.suggestedTheme,
        authorName: customMeta.author || undefined,
        siteUrl: customMeta.siteUrl || undefined
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

  const detectedCurrentPlatform = detectPlatform(socialUrl);

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
          maxWidth: '720px',
          maxHeight: '92vh',
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
              width: '34px',
              height: '34px',
              borderRadius: '9px',
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
                  AI Social Trend & Link Intelligence
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
                  {hasCustomKey ? `${selectedModel.toUpperCase()} CONNECTED` : 'HEURISTIC ENGINE'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-dim)' }}>
                Tạo viral hooks từ ý tưởng hoặc bóc tách trực tiếp link TikTok, FB, Threads, Web
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
              title="Cài đặt mô hình AI & khóa Google Gemini API miễn phí"
            >
              <Key size={12} />
              <span>{hasCustomKey ? 'Cài Đặt Model & Key' : 'Thêm API Key'}</span>
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

        {/* API Key & Model Configuration Drawer */}
        {isConfiguringKey && (
          <div style={{
            padding: '14px 20px',
            background: 'rgba(99, 102, 241, 0.07)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={13} color="#6366f1" /> Cấu hình Mô hình & Khóa Google Gemini API
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

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Mô hình AI (Model):
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: '#ffffff',
                    fontSize: '12px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id} style={{ background: '#131722', color: '#ffffff' }}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Khóa Gemini API Key:
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="password"
                    placeholder="Dán mã API Key (AIzaSy...)"
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
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting || !apiKey.trim()}
                    style={{
                      padding: '0 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: (isTesting || !apiKey.trim()) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}
                    title="Gọi thử một câu ngắn để kiểm tra xem model và key có phản hồi không"
                  >
                    {isTesting ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} color="#f59e0b" />}
                    <span>{isTesting ? 'Đang test...' : 'Kiểm Tra'}</span>
                  </button>
                  <button
                    onClick={handleSaveKey}
                    style={{
                      padding: '0 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#6366f1',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>

            {/* Test Connection Output Box */}
            {testResult && (
              <div style={{
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                background: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: testResult.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                color: testResult.success ? '#34d399' : '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {testResult.success ? <Check size={13} color="#10b981" /> : <Zap size={13} color="#ef4444" />}
                  <span>{testResult.message}</span>
                </div>
                {testResult.elapsed && (
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>⚡ {testResult.elapsed}ms</span>
                )}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-dim)' }}>
              <ShieldCheck size={12} color="#10b981" />
              <span>Khóa API được lưu cục bộ trong LocalStorage trình duyệt của bạn, hoàn toàn bảo mật và không qua máy chủ trung gian.</span>
            </div>
          </div>
        )}

        {/* Tab Switcher Bar */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <button
            onClick={() => setActiveTab('prompt')}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === 'prompt' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'prompt' ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === 'prompt' ? '#ffffff' : 'var(--text-dim)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={14} color={activeTab === 'prompt' ? '#818cf8' : 'currentColor'} />
            <span>1. Sáng Tạo Theo Ý Tưởng / Chủ Đề</span>
          </button>

          <button
            onClick={() => setActiveTab('link')}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === 'link' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'link' ? '2px solid #10b981' : '2px solid transparent',
              color: activeTab === 'link' ? '#ffffff' : 'var(--text-dim)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Link2 size={14} color={activeTab === 'link' ? '#34d399' : 'currentColor'} />
            <span>2. Bóc Tách Link Mạng Xã Hội (TikTok, FB, Threads, Web)</span>
            <span style={{
              fontSize: '9px',
              padding: '1px 5px',
              borderRadius: '4px',
              background: '#10b981',
              color: '#000000',
              fontWeight: 800
            }}>
              PRO AI
            </span>
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ========================================================= */}
          {/* TAB 1: PROMPT HOOK GENERATOR                              */}
          {/* ========================================================= */}
          {activeTab === 'prompt' && (
            <>
              {/* Input Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} color="#f59e0b" /> Nhập chủ đề hoặc ý tưởng bài viết của bạn:
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
                      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                      whiteSpace: 'nowrap'
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
                  {/* Live Real AI Verification Banner */}
                  {lastAiMeta && (
                    <div style={{
                      padding: '9px 14px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: lastAiMeta.isRealAi ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.1)',
                      border: lastAiMeta.isRealAi ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.3)',
                      color: lastAiMeta.isRealAi ? '#34d399' : '#fbbf24'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: lastAiMeta.isRealAi ? '#10b981' : '#f59e0b',
                          boxShadow: lastAiMeta.isRealAi ? '0 0 8px #10b981' : 'none',
                          display: 'inline-block'
                        }} />
                        <span style={{ fontWeight: 700 }}>
                          {lastAiMeta.isRealAi 
                            ? (lastAiMeta.isFallback 
                                ? `TỰ ĐỘNG CHUYỂN TIẾP: Do "${lastAiMeta.fallbackFrom}" quá tải (503) -> Đã lấy thành công từ "${lastAiMeta.model}"` 
                                : `XÁC THỰC: Phản hồi từ mô hình Google Gemini "${lastAiMeta.model}"`)
                            : (lastAiMeta.errorMsg 
                                ? `Google API báo lỗi (${lastAiMeta.failedModel}): "${lastAiMeta.errorMsg}" -> Đã chạy bộ sinh dự phòng` 
                                : 'Đang chạy bộ sinh thông minh cục bộ (Chưa nhập API Key)')
                          }
                        </span>
                      </div>
                      {lastAiMeta.elapsed && (
                        <span style={{ fontSize: '10px', opacity: 0.85, fontFamily: 'monospace' }}>
                          ⚡ {lastAiMeta.elapsed}ms
                        </span>
                      )}
                    </div>
                  )}

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
            </>
          )}

          {/* ========================================================= */}
          {/* TAB 2: SOCIAL LINK INTELLIGENCE (PHASE 4)                 */}
          {/* ========================================================= */}
          {activeTab === 'link' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Link2 size={13} color="#10b981" /> Dán link bài viết TikTok, Threads, Facebook, YouTube hoặc Website:
                  </label>
                  {socialUrl && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: detectedCurrentPlatform.badgeBg,
                      color: detectedCurrentPlatform.textColor,
                      border: `1px solid ${detectedCurrentPlatform.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{detectedCurrentPlatform.icon}</span>
                      <span>{detectedCurrentPlatform.name}</span>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    placeholder="https://tiktok.com/@creator/video/... hoặc https://threads.net/..."
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAnalyzeLink();
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => handleAnalyzeLink()}
                    disabled={isAnalyzingLink || !socialUrl.trim()}
                    style={{
                      padding: '0 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: (isAnalyzingLink || !socialUrl.trim()) ? 'not-allowed' : 'pointer',
                      opacity: (isAnalyzingLink || !socialUrl.trim()) ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isAnalyzingLink ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Đang bóc tách...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={15} />
                        <span>Bóc Link & Giật Tít</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Link Sample Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Thử ngay với link mẫu:</span>
                  {QUICK_LINK_SAMPLES.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSocialUrl(sample.url);
                        handleAnalyzeLink(sample.url);
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
                        e.currentTarget.style.borderColor = '#10b981';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Stage Tracker */}
              {isAnalyzingLink && (
                <div style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px dashed rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Loader2 size={20} className="animate-spin" color="#10b981" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399' }}>
                      {linkProgressStep || 'Đang thực hiện phân tích đa tầng...'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      Pipeline 0đ: Jina AI Reader làm sạch bài viết ➔ Google Gemini 3.x Flash đúc kết góc nhìn viral
                    </span>
                  </div>
                </div>
              )}

              {/* Analysis Result Display */}
              {linkResult && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Real AI Verification Banner */}
                  {linkAiMeta && (
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: linkAiMeta.isRealAi ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.1)',
                      border: linkAiMeta.isRealAi ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.3)',
                      color: linkAiMeta.isRealAi ? '#34d399' : '#fbbf24'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: linkAiMeta.isRealAi ? '#10b981' : '#f59e0b',
                          boxShadow: linkAiMeta.isRealAi ? '0 0 8px #10b981' : 'none'
                        }} />
                        <span style={{ fontWeight: 700 }}>
                          {linkAiMeta.isRealAi
                            ? `BÓC TÁCH HOÀN TẤT: Gemini (${linkAiMeta.model}) đã phân tích nội dung từ ${linkResult.platform?.name}`
                            : 'Đã hoàn tất bóc tách bằng bộ thông minh cục bộ'}
                        </span>
                      </div>
                      {linkAiMeta.elapsed && (
                        <span style={{ fontSize: '10px', opacity: 0.85, fontFamily: 'monospace' }}>
                          ⚡ {linkAiMeta.elapsed}ms
                        </span>
                      )}
                    </div>
                  )}

                  {/* Scraped Content Summary Card */}
                  <div style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: linkResult.platform?.badgeBg || 'rgba(255, 255, 255, 0.1)',
                        color: linkResult.platform?.textColor || '#ffffff',
                        border: `1px solid ${linkResult.platform?.color || '#ffffff'}30`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span>{linkResult.platform?.icon}</span>
                        <span>{linkResult.platform?.name}</span>
                        {linkResult.author && <span>• {linkResult.author}</span>}
                      </span>
                      <a
                        href={linkResult.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '11px', color: 'var(--text-dim)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        <span>Xem nguồn gốc</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>

                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#ffffff', lineHeight: '1.4' }}>
                      {linkResult.title}
                    </h4>

                    {linkResult.coreTakeaway && (
                      <div style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderLeft: '3px solid #6366f1',
                        fontSize: '12px',
                        color: '#c7d2fe',
                        lineHeight: '1.4'
                      }}>
                        <strong>💡 Đúc kết cốt lõi:</strong> {linkResult.coreTakeaway}
                      </div>
                    )}
                  </div>

                  {/* 3 Generated Viral Hooks from Link */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      🎯 Chọn 1 Trong 3 Góc Nhìn Visual Cho Bài Đăng:
                    </span>
                    <span style={{ fontSize: '11px', color: '#10b981' }}>
                      Tự động gán Template & Màu tương thích
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(linkResult.hooks || []).map((hook, idx) => (
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
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34d399',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          }}>
                            {hook.style}
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
                            <Flame size={12} /> {hook.viralityScore}
                          </span>
                        </div>

                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#ffffff', lineHeight: '1.4' }}>
                          "{hook.headline}"
                        </h4>

                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                          {hook.subtitle}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#38bdf8',
                            background: 'rgba(56, 189, 248, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {hook.categoryTag}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            color: 'var(--text-muted)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            Từ khóa nổi bật: <strong>{hook.highlightWord}</strong>
                          </span>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginTop: '4px',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                          <button
                            onClick={() => handleApply(hook, {
                              author: linkResult.author || linkResult.platform?.name,
                              siteUrl: linkResult.originalUrl ? new URL(linkResult.originalUrl).hostname : 'snapog.studio'
                            })}
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
                              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            <span>Tạo Ảnh OG Từ Link Này</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
