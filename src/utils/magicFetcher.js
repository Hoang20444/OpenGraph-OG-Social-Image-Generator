// Utility for Magic URL Scraping ($0 Cost) & Shareable URL Config

/**
 * Clean and normalize any input URL
 */
export function normalizeUrl(input) {
  let url = input.trim();
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

/**
 * Fetch metadata from any URL using free client-side APIs
 */
export async function fetchUrlMetadata(rawUrl) {
  const url = normalizeUrl(rawUrl);
  if (!url) throw new Error('Vui lòng nhập đường link hợp lệ');

  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace(/^www\./, '');

  // 1. Specialized Handler: GitHub Repository
  if (hostname === 'github.com') {
    const parts = parsedUrl.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const owner = parts[0];
      const repo = parts[1];
      try {
        const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          return {
            title: ghData.name || repo,
            subtitle: ghData.description || `Open source project by @${owner} on GitHub.`,
            authorName: ghData.owner?.login || owner,
            authorRole: `GitHub • ⭐ ${ghData.stargazers_count?.toLocaleString() || 0} stars`,
            siteUrl: 'github.com',
            categoryTag: `💻 ${ghData.language || 'OPEN SOURCE'}`,
            avatarUrl: ghData.owner?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            templateId: 'dev-terminal',
            themeId: 'cyber-emerald'
          };
        }
      } catch (err) {
        console.warn('GitHub API rate limit or error, falling back to microlink...', err);
      }
    }
  }

  // 2. Primary Engine: Microlink API (Free, rich OpenGraph & Favicon scraper)
  try {
    const microRes = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=false`);
    if (microRes.ok) {
      const json = await microRes.json();
      if (json.status === 'success' && json.data) {
        const data = json.data;
        const title = data.title || hostname;
        const description = data.description || `Read full article on ${hostname}`;
        const publisher = data.publisher || hostname;
        const author = data.author || publisher;
        const logo = data.logo?.url || data.image?.url || `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

        return {
          title,
          subtitle: description,
          authorName: author,
          authorRole: `Author on ${publisher}`,
          siteUrl: hostname,
          categoryTag: `🔖 ${publisher.toUpperCase()}`,
          avatarUrl: logo,
          themeId: 'indigo-cyan'
        };
      }
    }
  } catch (err) {
    console.warn('Microlink failed, trying CORS proxy fallback...', err);
  }

  // 3. Fallback Engine: AllOrigins CORS Proxy + Client-side HTML DOMParser
  try {
    const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    if (proxyRes.ok) {
      const proxyData = await proxyRes.json();
      const html = proxyData.contents;
      if (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') 
          || doc.querySelector('title')?.textContent 
          || hostname;

        const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content')
          || doc.querySelector('meta[name="description"]')?.getAttribute('content')
          || `Detailed insights and analysis on ${hostname}`;

        const ogAuthor = doc.querySelector('meta[name="author"]')?.getAttribute('content')
          || doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content')
          || hostname;

        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')
          || `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

        return {
          title: ogTitle.trim(),
          subtitle: ogDesc.trim(),
          authorName: ogAuthor.trim(),
          authorRole: `Editor @ ${hostname}`,
          siteUrl: hostname,
          categoryTag: '🚀 FEATURED POST',
          avatarUrl: ogImage,
          themeId: 'sunset-amber'
        };
      }
    }
  } catch (fallbackErr) {
    console.warn('All fallbacks failed', fallbackErr);
  }

  // Basic fallback based on domain name
  return {
    title: `Insights from ${hostname}`,
    subtitle: `Explore the latest news, updates and articles directly on ${hostname}.`,
    authorName: hostname,
    authorRole: 'Official Publication',
    siteUrl: hostname,
    categoryTag: '🌐 WEB ARTICLE',
    avatarUrl: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
    themeId: 'indigo-cyan'
  };
}

/**
 * Encode current studio config into a shareable URL
 */
export function encodeConfigToUrl(config) {
  const params = new URLSearchParams();
  if (config.title) params.set('title', config.title);
  if (config.subtitle) params.set('sub', config.subtitle);
  if (config.categoryTag) params.set('tag', config.categoryTag);
  if (config.authorName) params.set('author', config.authorName);
  if (config.authorRole) params.set('role', config.authorRole);
  if (config.siteUrl) params.set('site', config.siteUrl);
  if (config.templateId) params.set('tpl', config.templateId);
  if (config.themeId) params.set('theme', config.themeId);
  if (config.sticker && config.sticker !== 'none') params.set('stk', config.sticker);
  if (config.tilt3D) params.set('tilt', '1');

  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

/**
 * Decode URL search parameters into studio config overrides
 */
export function decodeConfigFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  if (!params.has('title') && !params.has('tpl')) return null;

  const overrides = {};
  if (params.has('title')) overrides.title = params.get('title');
  if (params.has('sub')) overrides.subtitle = params.get('sub');
  if (params.has('tag')) overrides.categoryTag = params.get('tag');
  if (params.has('author')) overrides.authorName = params.get('author');
  if (params.has('role')) overrides.authorRole = params.get('role');
  if (params.has('site')) overrides.siteUrl = params.get('site');
  if (params.has('tpl')) overrides.templateId = params.get('tpl');
  if (params.has('theme')) overrides.themeId = params.get('theme');
  if (params.has('stk')) overrides.sticker = params.get('stk');
  if (params.has('tilt')) overrides.tilt3D = params.get('tilt') === '1';

  return overrides;
}
