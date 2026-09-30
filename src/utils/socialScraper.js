/**
 * SnapOG Studio - Social Link Scraper & Intelligence
 * Powered by Jina AI Reader (Zero-Server, Zero-Cost CORS Markdown Reader)
 */

export const PLATFORMS = {
  TIKTOK: {
    name: 'TikTok',
    color: '#00f2fe',
    badgeBg: 'rgba(0, 242, 254, 0.15)',
    textColor: '#00f2fe',
    icon: '🎵',
    match: /(tiktok\.com|douyin\.com)/i
  },
  FACEBOOK: {
    name: 'Facebook',
    color: '#1877f2',
    badgeBg: 'rgba(24, 119, 242, 0.15)',
    textColor: '#60a5fa',
    icon: '📘',
    match: /(facebook\.com|fb\.watch|fb\.me)/i
  },
  THREADS: {
    name: 'Threads',
    color: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.15)',
    textColor: '#f8fafc',
    icon: '🧵',
    match: /(threads\.net)/i
  },
  YOUTUBE: {
    name: 'YouTube',
    color: '#ff0000',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    textColor: '#f87171',
    icon: '▶️',
    match: /(youtube\.com|youtu\.be)/i
  },
  X_TWITTER: {
    name: 'X (Twitter)',
    color: '#1da1f2',
    badgeBg: 'rgba(29, 161, 242, 0.15)',
    textColor: '#38bdf8',
    icon: '𝕏',
    match: /(twitter\.com|x\.com)/i
  },
  GITHUB: {
    name: 'GitHub',
    color: '#a855f7',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    textColor: '#c084fc',
    icon: '🐙',
    match: /(github\.com)/i
  },
  MEDIUM: {
    name: 'Medium',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    textColor: '#34d399',
    icon: '✍️',
    match: /(medium\.com|substack\.com)/i
  },
  WEB_ARTICLE: {
    name: 'Bài Viết / Tin Tức',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    textColor: '#fbbf24',
    icon: '📰',
    match: /.*/
  }
};

/**
 * Identify platform from URL
 */
export function detectPlatform(url) {
  if (!url) return PLATFORMS.WEB_ARTICLE;
  for (const [key, plat] of Object.entries(PLATFORMS)) {
    if (key !== 'WEB_ARTICLE' && plat.match.test(url)) {
      return plat;
    }
  }
  return PLATFORMS.WEB_ARTICLE;
}

/**
 * Clean & normalize URL
 */
export function normalizeUrl(rawUrl) {
  let cleaned = (rawUrl || '').trim();
  if (!cleaned) return '';
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  return cleaned;
}

/**
 * Extract social media or web article content using Jina AI Reader
 * Jina Reader converts any link into clean Markdown with zero server/API key needed.
 * @param {string} url - Target URL
 * @param {Function} [onProgress] - Optional progress callback ('scraping', 'done', 'error')
 * @returns {Promise<{ title: string, description: string, content: string, platform: Object, author: string, originalUrl: string }>}
 */
export async function scrapeSocialUrl(url, onProgress = () => {}) {
  const targetUrl = normalizeUrl(url);
  if (!targetUrl) {
    throw new Error('Vui lòng nhập đường dẫn URL hợp lệ');
  }

  const platform = detectPlatform(targetUrl);
  onProgress('scraping', `Đang kết nối Jina Reader AI để bóc tách nội dung từ ${platform.name}...`);

  try {
    // Call Jina AI Reader with Accept: application/json
    const jinaUrl = `https://r.jina.ai/${encodeURIComponent(targetUrl)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(jinaUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-No-Cache': 'true'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      // Fallback: try plain text fetch if JSON endpoint responded with error
      const textResponse = await fetch(`https://r.jina.ai/${targetUrl}`);
      if (textResponse.ok) {
        const rawText = await textResponse.text();
        return parseRawJinaText(rawText, targetUrl, platform);
      }
      throw new Error(`Jina Reader báo mã phản hồi ${response.status}`);
    }

    const json = await response.json();
    const data = json.data || {};

    const title = (data.title || extractFallbackTitle(targetUrl)).trim();
    const description = (data.description || '').trim();
    const rawContent = data.content || '';

    // Extract author / publisher if available
    let author = '';
    if (data.metadata?.author) {
      author = data.metadata.author;
    } else if (data.metadata?.siteName) {
      author = data.metadata.siteName;
    } else {
      author = platform.name;
    }

    // Clean and condense content to first ~2,500 characters
    const cleanedContent = cleanMarkdownSnippet(rawContent);

    onProgress('done', `Đã bóc tách thành công từ ${platform.name}`);

    return {
      title,
      description,
      content: cleanedContent,
      author,
      platform,
      originalUrl: targetUrl
    };
  } catch (err) {
    console.warn('Jina Reader direct scrape failed, using smart URL heuristic:', err);
    // Graceful fallback: produce structured object from URL so pipeline never halts
    return generateFallbackFromUrl(targetUrl, platform);
  }
}

/**
 * Parse plain text output from Jina reader
 */
function parseRawJinaText(text, url, platform) {
  const titleMatch = text.match(/Title:\s*(.+)/i);
  const title = titleMatch ? titleMatch[1].trim() : extractFallbackTitle(url);
  
  // Extract body after "Markdown Content:"
  const contentIdx = text.indexOf('Markdown Content:');
  const body = contentIdx !== -1 ? text.slice(contentIdx + 17) : text;
  
  return {
    title,
    description: '',
    content: cleanMarkdownSnippet(body),
    author: platform.name,
    platform,
    originalUrl: url
  };
}

/**
 * Truncate and clean Markdown text for LLM consumption
 */
function cleanMarkdownSnippet(md, maxChars = 2500) {
  if (!md) return '';
  // Remove images, markdown links [text](url) -> text, and duplicate whitespace
  let clean = md
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length > maxChars) {
    clean = clean.slice(0, maxChars) + '...';
  }
  return clean;
}

/**
 * Fallback title extraction from URL path
 */
function extractFallbackTitle(url) {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const last = pathParts[pathParts.length - 1]
        .replace(/[-_.]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return last.slice(0, 70);
    }
    return parsed.hostname;
  } catch {
    return 'Bài Viết Mạng Xã Hội';
  }
}

/**
 * Generates structured fallback when network scraping is blocked
 */
function generateFallbackFromUrl(url, platform) {
  const fallbackTitle = extractFallbackTitle(url);
  return {
    title: fallbackTitle,
    description: `Nội dung chia sẻ từ liên kết ${platform.name}`,
    content: `Trích xuất từ đường dẫn: ${url}. Chủ đề xoay quanh: ${fallbackTitle}. Nền tảng: ${platform.name}.`,
    author: platform.name,
    platform,
    originalUrl: url
  };
}
