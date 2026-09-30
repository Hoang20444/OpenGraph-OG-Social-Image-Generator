import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Sparkles, FolderHeart } from 'lucide-react';

export default function SavedDesignsModal({
  isOpen,
  onClose,
  savedDesigns,
  onLoadDesign,
  onDeleteDesign,
  onSaveCurrent
}) {
  if (!isOpen) return null;

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
          maxWidth: '640px',
          width: '100%',
          maxHeight: '85vh',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '26px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingRight: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
            }}>
              <FolderHeart size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                Bộ Sưu Tập Mẫu Đã Lưu (My Designs)
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Lưu giữ các thiết kế ưa thích trên trình duyệt của bạn (100% riêng tư)
              </p>
            </div>
          </div>
        </div>

        {/* Save Current Button Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
              Lưu thiết kế hiện tại vào máy
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              Đang có {savedDesigns.length} mẫu đã lưu
            </div>
          </div>
          <button
            onClick={onSaveCurrent}
            className="btn-primary"
            style={{ fontSize: '12px', padding: '7px 14px', gap: '6px' }}
          >
            <Bookmark size={14} />
            <span>+ Lưu Mẫu Này</span>
          </button>
        </div>

        {/* Saved Designs List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingRight: '6px'
        }}>
          {savedDesigns.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-dim)',
              fontSize: '13px'
            }}>
              <Bookmark size={36} style={{ margin: '0 auto 12px auto', opacity: 0.3 }} />
              <p>Bạn chưa lưu mẫu thiết kế nào.</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>
                Bấm "+ Lưu Mẫu Này" để lưu giữ thiết kế hiện tại và mở lại bất cứ lúc nào!
              </p>
            </div>
          ) : (
            savedDesigns.map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                      textTransform: 'uppercase'
                    }}>
                      {item.config.templateId}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.config.title || 'Untitled Design'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => onLoadDesign(item.config)}
                    className="btn-emerald"
                    style={{ fontSize: '12px', padding: '6px 12px', gap: '4px' }}
                    title="Mở mẫu này lên canvas"
                  >
                    <span>Mở</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteDesign(item.id)}
                    className="btn-secondary"
                    style={{
                      fontSize: '12px',
                      padding: '6px 10px',
                      color: 'var(--color-danger)',
                      borderColor: 'rgba(244, 63, 94, 0.3)'
                    }}
                    title="Xóa mẫu đã lưu"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
