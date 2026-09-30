// =============================================================================
// AI SOCIAL TREND ETL PIPELINE — SNAPOG STUDIO
// Tự động thu thập Google Trends Việt Nam & Tech Trends, xử lý AI và xuất bản
// Chạy tự động qua GitHub Actions Cron ($0 chi phí máy chủ)
// =============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'data', 'live_trends.json');

// 1. Thu thập dữ liệu từ Google Trends Việt Nam (RSS)
async function fetchGoogleTrendsVN() {
  const url = 'https://trends.google.com/trending/rss?geo=VN';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`Google Trends HTTP ${res.status}`);
    const xml = await res.text();

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
      const itemContent = match[1];
      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/);
      const trafficMatch = itemContent.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/);
      const newsTitleMatch = itemContent.match(/<ht:news_item_title>(.*?)<\/ht:news_item_title>/) || 
                             itemContent.match(/<ht:news_item_title><!\[CDATA\[(.*?)\]\]><\/ht:news_item_title>/);
      const snippetMatch = itemContent.match(/<ht:news_item_snippet>(.*?)<\/ht:news_item_snippet>/);

      const title = titleMatch ? titleMatch[1].trim() : '';
      const traffic = trafficMatch ? trafficMatch[1].trim() : '500+';
      const newsTitle = newsTitleMatch ? newsTitleMatch[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : title;
      const snippet = snippetMatch ? snippetMatch[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : '';

      if (title) {
        items.push({
          source: 'Google Trends Vietnam',
          topic: title,
          traffic,
          newsTitle,
          snippet
        });
      }
    }
    return items;
  } catch (err) {
    console.warn('⚠️ Không thể lấy Google Trends RSS:', err.message);
    return [];
  }
}

// 2. Thu thập dữ liệu từ HackerNews Tech Stories
async function fetchHackerNewsTop() {
  try {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!res.ok) return [];
    const ids = await res.json();
    const topIds = ids.slice(0, 4);

    const stories = await Promise.all(
      topIds.map(async (id) => {
        try {
          const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return await itemRes.json();
        } catch {
          return null;
        }
      })
    );

    return stories.filter(Boolean).map((s) => ({
      source: 'Global Tech & AI',
      topic: s.title,
      traffic: `${s.score || 100}+ points`,
      newsTitle: s.title,
      snippet: `Thảo luận công nghệ toàn cầu với hơn ${s.descendants || 50} bình luận trên HackerNews.`
    }));
  } catch (err) {
    console.warn('⚠️ Không thể lấy HackerNews:', err.message);
    return [];
  }
}

// 3. Chuẩn hóa & Sinh Hook bằng AI (hoặc Smart Heuristic nếu chưa có Key trong môi trường)
async function processTrendsWithAiOrHeuristic(rawTrends, apiKey) {
  const models = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.7-flash'];

  // Nếu có API Key trong biến môi trường (ví dụ cấu hình trong GitHub Secrets)
  if (apiKey) {
    for (const model of models) {
      try {
        console.log(`🤖 Đang gọi Google Gemini (${model}) để chuẩn hóa ${rawTrends.length} xu hướng...`);
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const prompt = `
Bạn là Giám đốc Sáng tạo & Chuyên gia Viral Marketing trên TikTok, Facebook, Threads.
Dưới đây là danh sách ${rawTrends.length} chủ đề xu hướng thực tế vừa được cào từ Google Trends VN & Tech:
${JSON.stringify(rawTrends, null, 2)}

YÊU CẦU:
Hãy chuyển đổi danh sách trên thành một mảng JSON các bài đăng bắt trend đỉnh cao cho mạng xã hội với cấu trúc sau:
[
  {
    "id": "slug-duy-nhat",
    "topic": "Tên chủ đề ngắn gọn",
    "category": "vietnam" | "tech" | "business" | "creative",
    "platform": "Google Trends & Facebook" | "TikTok & Threads" | "HackerNews & Tech",
    "growth": "+...% (Ví dụ +420%)",
    "status": "Bùng nổ (Viral)" | "Tăng mạnh (Hot)" | "Đang lên (Rising)",
    "confidence": "95% dự báo tăng",
    "headline": "Tiêu đề giật tít hấp dẫn tiếng Việt (dưới 70 ký tự)",
    "subtitle": "Mô tả phụ cuốn hút tóm tắt góc nhìn (dưới 120 ký tự)",
    "categoryTag": "Nhãn kèm emoji (Ví dụ: '🇻🇳 XU HƯỚNG VIỆT NAM', '⚡ CÔNG NGHỆ 2026')",
    "highlightWord": "1-3 từ khóa đắt giá nhất trong headline cần phát sáng",
    "suggestedTemplate": "saas-launch" | "cyber-glitch" | "bento-grid" | "dev-terminal" | "clean-editorial" | "quote-focus" | "floating-3d",
    "suggestedTheme": "indigo-cyan" | "fuchsia-rose" | "emerald-teal" | "sunset-amber" | "cyber-emerald"
  }
]
Chỉ trả về JSON thuần túy, không có thẻ code block.
`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          const parsed = JSON.parse(rawText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log(`✅ AI ${model} đã xử lý thành công ${parsed.length} chủ đề bắt trend!`);
            return parsed;
          }
        }
      } catch (err) {
        console.warn(`Lỗi gọi model ${model}:`, err.message);
      }
    }
  }

  // Smart Heuristic Normalizer khi chạy không có API Key
  console.log('💡 Đang chạy bộ chuẩn hóa thông minh Heuristic...');
  return rawTrends.map((item, idx) => {
    const isTech = item.source.includes('Tech') || item.topic.toLowerCase().includes('ai') || item.topic.toLowerCase().includes('code');
    const growthNum = 200 + (rawTrends.length - idx) * 35 + Math.floor(Math.random() * 50);
    const words = item.topic.split(/\s+/);
    const highlight = words.slice(0, Math.min(2, words.length)).join(' ');

    return {
      id: `trend-${Date.now()}-${idx}`,
      topic: item.topic.slice(0, 45),
      category: isTech ? 'tech' : (idx % 2 === 0 ? 'vietnam' : 'business'),
      platform: isTech ? 'GitHub & HackerNews' : 'Google Trends & TikTok',
      growth: `+${growthNum}%`,
      status: idx < 3 ? 'Bùng nổ (Viral)' : 'Tăng mạnh (Hot)',
      confidence: `${90 + (idx % 8)}% đón đầu sóng`,
      headline: item.newsTitle.length > 70 ? item.newsTitle.slice(0, 67) + '...' : item.newsTitle,
      subtitle: item.snippet ? (item.snippet.length > 120 ? item.snippet.slice(0, 117) + '...' : item.snippet) : `Khám phá các góc nhìn thực tế và bài học đắt giá đằng sau xu hướng ${item.topic}.`,
      categoryTag: isTech ? '⚡ CÔNG NGHỆ & AI' : '🇻🇳 THỊ TRƯỜNG VIỆT NAM',
      highlightWord: highlight || 'Xu Hướng Mới',
      suggestedTemplate: isTech ? 'dev-terminal' : (idx % 3 === 0 ? 'bento-grid' : 'saas-launch'),
      suggestedTheme: isTech ? 'cyber-emerald' : (idx % 2 === 0 ? 'sunset-amber' : 'indigo-cyan')
    };
  });
}

// 4. Main Entry Point
async function main() {
  console.log('🚀 [SnapOG Trend Pipeline] Bắt đầu cào dữ liệu xu hướng thực tế...');
  
  const [googleTrends, hackerNews] = await Promise.all([
    fetchGoogleTrendsVN(),
    fetchHackerNewsTop()
  ]);

  const rawCombined = [...googleTrends, ...hackerNews];
  console.log(`📊 Đã cào được ${rawCombined.length} chủ đề thô.`);

  if (rawCombined.length === 0) {
    console.log('⚠️ Không cào được dữ liệu mới, giữ nguyên file cũ.');
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  const processedTrends = await processTrendsWithAiOrHeuristic(rawCombined, apiKey);

  const payload = {
    updatedAt: new Date().toISOString(),
    itemCount: processedTrends.length,
    trends: processedTrends
  };

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`🎉 [Thành công] Đã lưu dữ liệu xu hướng mới vào: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('❌ Lỗi Pipeline:', err);
  process.exit(1);
});
