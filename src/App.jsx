import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CanvasPreview from './components/CanvasPreview';
import ExportToolbar from './components/ExportToolbar';
import ProModal from './components/ProModal';
import CoffeeModal from './components/CoffeeModal';
import MetaTagsModal from './components/MetaTagsModal';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const canvasRef = useRef(null);

  // App Configuration State
  const [config, setConfig] = useState({
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
    align: 'left'
  });

  // Monetization State (Persisted in localStorage)
  const [isPro, setIsPro] = useState(() => {
    return localStorage.getItem('snapog_pro') === 'true';
  });

  // Modal States
  const [isProOpen, setIsProOpen] = useState(false);
  const [isCoffeeOpen, setIsCoffeeOpen] = useState(false);
  const [isMetaOpen, setIsMetaOpen] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const addNotification = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleActivatePro = () => {
    setIsPro(true);
    localStorage.setItem('snapog_pro', 'true');
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

  // Keyboard shortcut listener (Ctrl + S to trigger export)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        // Trigger export via synthetic click or notification
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
        />

        {/* Center / Right Canvas Area */}
        <CanvasPreview
          config={config}
          canvasRef={canvasRef}
          isPro={isPro}
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
