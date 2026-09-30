// =============================================================================
// GEMINI 1.5 FLASH AI ENGINE — SNAPOG STUDIO
// Trợ lý AI sáng tạo Viral Social Hooks & Visual Matcher
// Hỗ trợ cả Direct Google Gemini API (Free Tier) & Smart Heuristic Engine
// =============================================================================

export const STORAGE_KEY_GEMINI = 'snapog_gemini_api_key';
export const STORAGE_KEY_MODEL = 'snapog_gemini_model';

export const AVAILABLE_MODELS = [
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash (Mạnh mẽ & Tối ưu hóa - Khuyên dùng)' },
  { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite (Siêu tốc & Tiết kiệm token)' },
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Experimental' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Bản ổn định phổ biến)' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Tư duy chuyên sâu)' }
];

export function getStoredGeminiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY_GEMINI) || import.meta.env.VITE_GEMINI_API_KEY || '';
  } catch {
    return '';
  }
}

export function saveStoredGeminiKey(key) {
  try {
    if (!key || !key.trim()) {
      localStorage.removeItem(STORAGE_KEY_GEMINI);
    } else {
      localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
    }
  } catch (err) {
    console.error('Failed to save Gemini key:', err);
  }
}

export function getStoredGeminiModel() {
  try {
    return localStorage.getItem(STORAGE_KEY_MODEL) || import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.5-flash';
  } catch {
    return 'gemini-3.5-flash';
  }
}

export function saveStoredGeminiModel(model) {
  try {
    if (!model || !model.trim()) {
      localStorage.setItem(STORAGE_KEY_MODEL, 'gemini-1.5-flash');
    } else {
      localStorage.setItem(STORAGE_KEY_MODEL, model.trim());
    }
  } catch (err) {
    console.error('Failed to save Gemini model:', err);
  }
}

// Bộ phân tích dự phòng thông minh (Fallback Heuristic Engine) khi chưa có API Key
function generateSmartFallbackHooks(topic) {
  const cleanTopic = topic.trim();
  const lower = cleanTopic.toLowerCase();

  let tag = '💡 XU HƯỚNG MỚI';
  let t1 = 'saas-launch';
  let th1 = 'indigo-cyan';
  let t2 = 'bento-grid';
  let th2 = 'sunset-amber';
  let t3 = 'cyber-glitch';
  let th3 = 'cyber-emerald';

  if (lower.includes('ai') || lower.includes('công nghệ') || lower.includes('code') || lower.includes('dev') || lower.includes('tech')) {
    tag = '⚡ CÔNG NGHỆ & AI';
    t1 = 'cyber-glitch';
    th1 = 'cyber-emerald';
    t2 = 'dev-terminal';
    th2 = 'monochrome-dark';
  } else if (lower.includes('bán') || lower.includes('kinh doanh') || lower.includes('tiền') || lower.includes('saas') || lower.includes('start')) {
    tag = '💡 KHỞI NGHIỆP & DOANH THU';
    t1 = 'saas-launch';
    th1 = 'indigo-cyan';
    t2 = 'floating-3d';
    th2 = 'emerald-teal';
  } else if (lower.includes('viết') || lower.includes('content') || lower.includes('video') || lower.includes('tiktok') || lower.includes('sách')) {
    tag = '🔥 CONTENT TRIỆU VIEW';
    t1 = 'bento-grid';
    th1 = 'fuchsia-rose';
    t2 = 'quote-focus';
    th2 = 'sunset-amber';
  }

  // Tách từ khóa trọng tâm
  const words = cleanTopic.split(/\s+/);
  const highlightCandidate = words.slice(0, Math.min(3, words.length)).join(' ');

  return [
    {
      style: 'Tò Mò & Khám Phá (Curiosity Hook)',
      headline: `Bí Mật Đằng Sau "${cleanTopic}": Tại Sao 90% Đang Bỏ Lỡ Cơ Hội Này?`,
      subtitle: `Khám phá góc nhìn hoàn toàn mới giúp bạn đón đầu làn sóng và tạo sự đột phá với ${cleanTopic}.`,
      categoryTag: tag,
      highlightWord: highlightCandidate || 'Bí Mật',
      viralityScore: '96% Viral',
      suggestedTemplate: t1,
      suggestedTheme: th1
    },
    {
      style: 'Thực Chiến & Hành Động (Actionable Hook)',
      headline: `Quy Trình 3 Bước Tinh Gọn Để Làm Chủ "${cleanTopic}" Từ Con Số 0`,
      subtitle: `Cẩm nang thực tế và chi tiết giúp bạn bắt tay vào triển khai ngay hôm nay mà không tốn chi phí.`,
      categoryTag: tag,
      highlightWord: 'Quy Trình 3 Bước',
      viralityScore: '94% Viral',
      suggestedTemplate: t2,
      suggestedTheme: th2
    },
    {
      style: 'Cảnh Báo & FOMO (Warning Hook)',
      headline: `Sai Lầm Nghiêm Trọng Về "${cleanTopic}" Khiến Bạn Mất Nhiều Hơn Được!`,
      subtitle: `Những bài học xương máu và điểm mù bạn nhất định phải né tránh trước khi quá muộn.`,
      categoryTag: '⚠️ CẢNH BÁO THỰC TẾ',
      highlightWord: 'Sai Lầm Nghiêm Trọng',
      viralityScore: '92% Viral',
      suggestedTemplate: t3,
      suggestedTheme: th3
    }
  ];
}

/**
 * Gọi Google Gemini 1.5 Flash API để tạo nội dung chuẩn Social Hook
 */
export async function generateAiSocialHooks(topic) {
  if (!topic || !topic.trim()) {
    throw new Error('Vui lòng nhập chủ đề hoặc ý tưởng của bạn.');
  }

  const apiKey = getStoredGeminiKey();

  // Nếu không có API Key, dùng bộ tạo thông minh cục bộ
  if (!apiKey) {
    // Giả lập độ trễ AI suy nghĩ 600ms
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      source: 'local_heuristic',
      suggestions: generateSmartFallbackHooks(topic)
    };
  }

  // Gọi trực tiếp Google Gemini API với model đã chọn và JSON Response Schema
  const selectedModel = getStoredGeminiModel();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

  const promptText = `
Bạn là Giám đốc Sáng tạo và Chuyên gia Viral Marketing trên TikTok, Facebook, Threads và LinkedIn.
Nhiệm vụ của bạn là nhận chủ đề sau đây: "${topic}"
và sáng tạo ra đúng 3 phương án tiêu đề giật tít (Hook) đỉnh cao với tỉ lệ nhấp chuột (CTR) cao nhất:
1. Phong cách "Tò Mò & Khám Phá (Curiosity Hook)": Kích thích trí tò mò, mở ra khoảng trống thông tin.
2. Phong cách "Thực Chiến & Hành Động (Actionable Hook)": Đưa ra bước làm cụ thể, con số ấn tượng, giải quyết vấn đề ngay.
3. Phong cách "Cảnh Báo & FOMO (Warning Hook)": Chỉ ra sai lầm phổ biến, cảnh báo rủi ro nếu bỏ qua.

YÊU CẦU ĐỊNH DẠNG:
Trả về DUY NHẤT một chuỗi JSON hợp lệ với cấu trúc sau:
{
  "suggestions": [
    {
      "style": "Tên phong cách",
      "headline": "Tiêu đề chính giật tít, súc tích (dưới 70 ký tự tiếng Việt)",
      "subtitle": "Phụ đề giải thích hoặc mở rộng nội dung (dưới 120 ký tự tiếng Việt)",
      "categoryTag": "Nhãn chủ đề ngắn gọn có emoji (Ví dụ: '⚡ AI AGENT', '💡 KHỞI NGHIỆP', '🔥 VIRAL CONTENT')",
      "highlightWord": "Đúng 1-3 từ khóa đắt giá nhất trong headline cần được phát sáng nổi bật",
      "viralityScore": "Điểm dự đoán độ lan truyền, ví dụ: '97% Viral'",
      "suggestedTemplate": "Chọn 1 trong các ID sau: 'saas-launch', 'cyber-glitch', 'bento-grid', 'dev-terminal', 'clean-editorial', 'quote-focus', 'podcast-minimal', 'floating-3d', 'handcrafted-note'",
      "suggestedTheme": "Chọn 1 trong các ID sau: 'indigo-cyan', 'fuchsia-rose', 'emerald-teal', 'sunset-amber', 'monochrome-dark', 'cyber-emerald'"
    }
  ]
}
Chỉ trả về JSON thuần túy, không bọc trong markdown code block.
`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.8
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData.error?.message || `Lỗi HTTP ${response.status}`;
      console.warn('Gemini API call failed, falling back to smart heuristic:', msg);
      return {
        source: 'local_heuristic_after_error',
        errorMsg: msg,
        suggestions: generateSmartFallbackHooks(topic)
      };
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Mô hình AI không trả về nội dung.');
    }

    const parsed = JSON.parse(rawText);
    if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
      throw new Error('Định dạng dữ liệu từ AI không khớp.');
    }

    return {
      source: selectedModel,
      model: selectedModel,
      suggestions: parsed.suggestions
    };
  } catch (err) {
    console.warn('Lỗi gọi Gemini AI, chuyển sang bộ sinh dự phòng:', err.message);
    return {
      source: 'local_heuristic_after_error',
      errorMsg: err.message,
      suggestions: generateSmartFallbackHooks(topic)
    };
  }
}
