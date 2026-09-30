import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CanvasPreview from './components/CanvasPreview';
import ExportToolbar from './components/ExportToolbar';
import ProModal from './components/ProModal';
import CoffeeModal from './components/CoffeeModal';
import MetaTagsModal from './components/MetaTagsModal';
import BatchExportModal from './components/BatchExportModal';
import SavedDesignsModal from './components/SavedDesignsModal';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { COLOR_THEMES } from './data/templates';
import { encodeConfigToUrl, decodeConfigFromUrl } from './utils/magicFetcher';

const DEFAULT_CONFIG = {
  title: 'Cách kiếm 1000$ đầu tiên với tư cách là một Fresher độc lập',
  subtitle: 'Hướng dẫn chi tiết tự tay làm sản phẩm web & tool từ 0 đồng, không cần backend, tối ưu hoá chuyển đổi và dòng tiền.',
  categoryTag: '🚀 HƯỚNG DẪN THỰC CHIẾN',
  authorName: 'Nguyen Van A',
  authorRole: 'Fresher Developer & Indie Hacker',
  siteUrl: 'snapog.dev',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  brandIcon: 'sparkles',
  themeId: 'indigo-cyan',
  templateId: 'saas-launch',
  aspectRatio: '1200x630',
  pattern: 'dots',
  fontSize: 50,
  align: 'left',
  padding: 60,
  borderRadius: 16,
  shadowIntensity: 'medium',
  tilt3D: false,
  sticker: 'none',
  fontFamily: 'heading',
  highlightWord: '1000$',
  isCustomColor: false,
  customPrimary: '#6366f1',
  customSecondary: '#06b6d4',
  customBg: '#030712',
  customGradientAngle: 135
};

export default function App() {
  const canvasRef = useRef(null);

  // App Configuration State with LocalStorage Autosave
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('snapog_active_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  // Saved Designs Bookmarks (LocalStorage)
  const [savedDesigns, setSavedDesigns] = useState(() => {
    try {
      const saved = localStorage.getItem('snapog_saved_designs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // View Mode: 'single' (Canvas) vs 'gallery' (Instant Grid of 11 Templates)
  const [viewMode, setViewMode] = useState('single');

  // Monetization State (Persisted in localStorage)
  const [isPro, setIsPro] = useState(() => {
    return localStorage.getItem('snapog_pro') === 'true';
  });

  // Modal States
  const [isProOpen, setIsProOpen] = useState(false);
  const [isCoffeeOpen, setIsCoffeeOpen] = useState(false);
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const addNotification = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Autosave config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('snapog_active_config', JSON.stringify(config));
    } catch (e) {
      console.warn('Autosave error', e);
    }
  }, [config]);

  // Decode configuration & License Key from URL search params on mount
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const key = urlParams.get('key');
      const VALID_KEYS = [
        'TINYFORGE-PRO-2026',
        'SNAP-HOANG-VIP',
        'SNAP-LIFETIME-PRO',
        'PRO-DEV-2026'
      ];
      if (key) {
        const cleanKey = key.trim().toUpperCase();
        if (VALID_KEYS.includes(cleanKey) || /^(SNAP|TINYFORGE)-PRO-[A-Z0-9]+$/i.test(cleanKey)) {
          setIsPro(true);
          localStorage.setItem('snapog_pro', 'true');
          addNotification(`👑 Đã kích hoạt bản quyền PRO vĩnh viễn! (Key: ${cleanKey})`);
          const url = new URL(window.location.href);
          url.searchParams.delete('key');
          window.history.replaceState({}, document.title, url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
        }
      }
    } catch (e) {
      console.warn('URL License parse error', e);
    }

    const sharedConfig = decodeConfigFromUrl();
    if (sharedConfig) {
      setConfig((prev) => ({ ...prev, ...sharedConfig }));
      addNotification('🔗 Đã tải mẫu thiết kế từ liên kết chia sẻ!');
    }
  }, []);

  const handleActivatePro = () => {
    setIsPro(true);
    localStorage.setItem('snapog_pro', 'true');
  };

  const handleDeactivatePro = () => {
    setIsPro(false);
    localStorage.removeItem('snapog_pro');
    addNotification('Đã hủy kích hoạt PRO trên thiết bị này.');
  };

  const handleApplyPreset = (preset) => {
    setConfig((prev) => ({
      ...prev,
      title: preset.title,
      subtitle: preset.subtitle,
      categoryTag: preset.tag,
      authorName: preset.author,
      authorRole: preset.role,
      siteUrl: preset.site,
      templateId: preset.template,
      themeId: preset.theme
    }));
    addNotification(`✨ Applied preset: ${preset.name}`);
  };

  // Shuffle Magic Color Palette
  const handleShufflePalette = () => {
    const availableThemes = COLOR_THEMES.filter((t) => t.id !== config.themeId);
    const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
    if (randomTheme) {
      setConfig((prev) => ({ ...prev, isCustomColor: false, themeId: randomTheme.id }));
      addNotification(`🎲 Đã chuyển sang bảng màu: ${randomTheme.name}`);
    }
  };

  // Share Design via URL link
  const handleShareDesign = () => {
    const shareUrl = encodeConfigToUrl(config);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        window.history.replaceState(null, '', shareUrl);
        addNotification('🔗 Đã sao chép link chia sẻ thiết kế vào clipboard!');
      });
    } else {
      addNotification(`🔗 Link: ${shareUrl}`);
    }
  };

  // Select Template from Gallery
  const handleSelectTemplate = (templateId) => {
    setConfig((prev) => ({ ...prev, templateId }));
    addNotification(`🎨 Đã chọn mẫu: ${templateId}`);
  };

  // Save current design to bookmarks
  const handleSaveCurrentDesign = () => {
    const newItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      config: { ...config }
    };
    const updated = [newItem, ...savedDesigns.slice(0, 19)]; // Keep max 20
    setSavedDesigns(updated);
    try {
      localStorage.setItem('snapog_saved_designs', JSON.stringify(updated));
      addNotification('💾 Đã lưu thiết kế vào danh sách của bạn!');
    } catch (e) {
      console.error(e);
    }
  };

  // Delete saved design
  const handleDeleteSavedDesign = (id) => {
    const updated = savedDesigns.filter((item) => item.id !== id);
    setSavedDesigns(updated);
    try {
      localStorage.setItem('snapog_saved_designs', JSON.stringify(updated));
      addNotification('🗑️ Đã xóa mẫu thiết kế.');
    } catch (e) {
      console.error(e);
    }
  };

  // Load saved design
  const handleLoadSavedDesign = (loadedConfig) => {
    setConfig({ ...DEFAULT_CONFIG, ...loadedConfig });
    setIsSavedOpen(false);
    addNotification('✨ Đã tải mẫu thiết kế thành công!');
  };

  // Reset to default
  const handleResetConfig = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục thiết kế ban đầu không?')) {
      setConfig(DEFAULT_CONFIG);
      localStorage.removeItem('snapog_active_config');
      addNotification('🔄 Đã khôi phục thiết kế ban đầu!');
    }
  };

  // Keyboard shortcut listener (Ctrl + S to trigger export)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const exportBtn = document.querySelector('.btn-emerald');
        if (exportBtn) exportBtn.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <Header
        onApplyPreset={handleApplyPreset}
        onOpenPro={() => setIsProOpen(true)}
        onOpenCoffee={() => setIsCoffeeOpen(true)}
        onOpenMeta={() => setIsMetaOpen(true)}
        onShareDesign={handleShareDesign}
        onOpenBatch={() => setIsBatchOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        savedCount={savedDesigns.length}
        onResetConfig={handleResetConfig}
        isPro={isPro}
      />

      {/* Main Studio Body */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Left Control Panel */}
        <Sidebar
          config={config}
          onChange={setConfig}
          onOpenPro={() => setIsProOpen(true)}
          isPro={isPro}
          onShufflePalette={handleShufflePalette}
          onNotify={addNotification}
        />

        {/* Center / Right Canvas Area */}
        <CanvasPreview
          config={config}
          canvasRef={canvasRef}
          isPro={isPro}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          onSelectTemplate={handleSelectTemplate}
          onNotify={addNotification}
        />
      </div>

      {/* Bottom Floating Export Dock */}
      <ExportToolbar
        canvasRef={canvasRef}
        config={config}
        onOpenMeta={() => setIsMetaOpen(true)}
        onNotify={addNotification}
      />

      {/* Modals */}
      <ProModal
        isOpen={isProOpen}
        onClose={() => setIsProOpen(false)}
        isPro={isPro}
        onActivatePro={handleActivatePro}
        onDeactivatePro={handleDeactivatePro}
        onNotify={addNotification}
      />

      <CoffeeModal
        isOpen={isCoffeeOpen}
        onClose={() => setIsCoffeeOpen(false)}
        onNotify={addNotification}
      />

      <MetaTagsModal
        isOpen={isMetaOpen}
        onClose={() => setIsMetaOpen(false)}
        config={config}
        onNotify={addNotification}
      />

      <BatchExportModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        config={config}
        onNotify={addNotification}
      />

      <SavedDesignsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedDesigns={savedDesigns}
        onLoadDesign={handleLoadSavedDesign}
        onDeleteDesign={handleDeleteSavedDesign}
        onSaveCurrent={handleSaveCurrentDesign}
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-pill">
            <CheckCircle2 size={16} color="#10b981" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
