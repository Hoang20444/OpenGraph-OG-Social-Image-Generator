import React, { useState } from 'react';
import { X, Copy, Check, Code2 } from 'lucide-react';

export default function MetaTagsModal({
  isOpen,
  onClose,
  config,
  onNotify
}) {
  const [activeLang, setActiveLang] = useState('html'); // 'html' | 'nextjs-app' | 'nextjs-pages'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlSnippet = `<!-- Primary Meta Tags -->
<title>${config.title}</title>
<meta name="title" content="${config.title}" />
<meta name="description" content="${config.subtitle}" />

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://${config.siteUrl}/" />
<meta property="og:title" content="${config.title}" />
<meta property="og:description" content="${config.subtitle}" />
<meta property="og:image" content="https://${config.siteUrl}/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="https://${config.siteUrl}/" />
<meta property="twitter:title" content="${config.title}" />
<meta property="twitter:description" content="${config.subtitle}" />
<meta property="twitter:image" content="https://${config.siteUrl}/og-image.png" />`;

  const nextAppSnippet = `// Next.js App Router (app/layout.tsx or app/page.tsx)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${config.title}',
  description: '${config.subtitle}',
  openGraph: {
    title: '${config.title}',
    description: '${config.subtitle}',
    url: 'https://${config.siteUrl}',
    siteName: '${config.siteUrl}',
    images: [
      {
        url: 'https://${config.siteUrl}/og-image.png',
        width: 1200,
        height: 630,
        alt: '${config.title}',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${config.title}',
    description: '${config.subtitle}',
    images: ['https://${config.siteUrl}/og-image.png'],
  },
};`;

  const nextPagesSnippet = `// Next.js Pages Router (pages/index.tsx)
import Head from 'next/head';

export default function Page() {
  return (
    <>
      <Head>
        <title>${config.title}</title>
        <meta name="description" content="${config.subtitle}" />
        
        {/* Open Graph */}
        <meta property="og:title" content="${config.title}" />
        <meta property="og:description" content="${config.subtitle}" />
        <meta property="og:image" content="https://${config.siteUrl}/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${config.title}" />
        <meta name="twitter:description" content="${config.subtitle}" />
        <meta name="twitter:image" content="https://${config.siteUrl}/og-image.png" />
      </Head>
      <main>...</main>
    </>
  );
}`;

  const currentSnippet = activeLang === 'html' 
    ? htmlSnippet 
    : activeLang === 'nextjs-app' 
    ? nextAppSnippet 
    : nextPagesSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    onNotify('📋 Meta tags snippet copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '650px',
          background: 'var(--bg-surface-elevated)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Code2 size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
              Generated Social & OpenGraph &lt;meta&gt; Tags
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Language Tabs */}
        <div style={{
          padding: '12px 24px 0',
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'html', label: 'Standard HTML' },
            { id: 'nextjs-app', label: 'Next.js (App Router)' },
            { id: 'nextjs-pages', label: 'Next.js (Pages Router)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLang(tab.id)}
              style={{
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '6px 6px 0 0',
                color: activeLang === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
                background: activeLang === tab.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                borderBottom: activeLang === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div style={{ padding: '20px 24px', position: 'relative' }}>
          <pre style={{
            background: '#030712',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            lineHeight: 1.5,
            fontFamily: 'var(--font-mono)',
            color: '#e2e8f0',
            overflowX: 'auto',
            maxHeight: '380px'
          }}>
            {currentSnippet}
          </pre>

          <button
            onClick={handleCopy}
            className="btn-primary"
            style={{
              position: 'absolute',
              top: '32px',
              right: '36px',
              padding: '6px 14px',
              fontSize: '12px'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
