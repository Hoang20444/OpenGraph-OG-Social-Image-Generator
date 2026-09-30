// =============================================================================
// GEMINI 3.X FLASH AI ENGINE — SNAPOG STUDIO
// Trợ lý AI sáng tạo Viral Social Hooks & Visual Matcher
// =============================================================================

export const STORAGE_KEY_GEMINI = 'snapog_gemini_api_key';
export const STORAGE_KEY_MODEL = 'snapog_gemini_model';

export const AVAILABLE_MODELS = [
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Thế hệ mới nhất)' },
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash (Mạnh mẽ & Cân bằng)' },
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash (Tối ưu hóa phản hồi)' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash (Khuyên dùng - Ổn định nhất)' },
  { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite (Siêu tốc & Tiết kiệm token)' }
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
      localStorage.setItem(STORAGE_KEY_MODEL, 'gemini-3.5-flash');
    } else {
      localStorage.setItem(STORAGE_KEY_MODEL, model.trim());
    }
  } catch (err) {
    console.error('Failed to save Gemini model:', err);
  }
}

/**
 * Kiểm tra kết nối thực tế tới Google Gemini API với Key và Model đã chọn
 */
export async function testGeminiConnection(apiKey, model) {
  const keyToTest = apiKey || getStoredGeminiKey();
  const modelToTest = model || getStoredGeminiModel();

  if (!keyToTest || !keyToTest.trim()) {
    return {
      success: false,
      message: 'Chưa có API Key. Vui lòng nhập mã API Key của bạn để kiểm tra.'
    };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTest}:generateContent?key=${keyToTest.trim()}`;
  const startTime = Date.now();

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: 'Trả về từ: OK' }]
          }
        ]
      })
    });

    const elapsed = Date.now() - startTime;

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData.error?.message || `Lỗi HTTP ${res.status}`;
      
      if (res.status === 503) {
        return {
          success: false,
          statusCode: 503,
          model: modelToTest,
          isOverloaded: true,
          message: `⚠️ Mô hình "${modelToTest}" đang bị quá tải trên máy chủ Google (503 High Demand). Đây là lỗi tạm thời của Google. Gợi ý: Hãy đổi sang "gemini-3.5-flash" hoặc "gemini-3.5-flash-lite" để chạy ngay!`
        };
      }

      return {
        success: false,
        statusCode: res.status,
        model: modelToTest,
        message: `Mô hình "${modelToTest}" báo lỗi (${res.status}): ${errMsg}`
      };
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'OK';

    return {
      success: true,
      statusCode: 200,
      model: modelToTest,
      elapsed,
      reply,
      message: `Kết nối thành công tới ${modelToTest}! Độ trễ phản hồi: ${elapsed}ms.`
    };
  } catch (err) {
    return {
      success: false,
      model: modelToTest,
      message: `Lỗi kết nối mạng: ${err.message}`
    };
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
  const startTime = Date.now();

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

  // Chuỗi mô hình dự phòng tự động (CHỈ DÙNG DÒNG GEMINI 3.X)
  const MODEL_FALLBACK_CANDIDATES = [
    selectedModel,
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.7-flash',
    'gemini-3.6-flash'
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);

  let lastError = null;
  let lastStatus = null;
  let failedInitialModel = null;

  for (let i = 0; i < MODEL_FALLBACK_CANDIDATES.length; i++) {
    const currentModel = MODEL_FALLBACK_CANDIDATES[i];
    const isFallback = i > 0;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

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

      const elapsed = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error('Mô hình AI không trả về nội dung.');
        }

        const parsed = JSON.parse(rawText);
        if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
          throw new Error('Định dạng dữ liệu từ AI không khớp.');
        }

        console.log(`🤖 [Google Gemini API] Nhận phản hồi thành công từ mô hình "${currentModel}" trong ${elapsed}ms:`, parsed);

        return {
          source: currentModel,
          model: currentModel,
          isRealAi: true,
          isFallback,
          fallbackFrom: isFallback ? selectedModel : null,
          elapsed,
          suggestions: parsed.suggestions
        };
      }

      lastStatus = response.status;
      const errorData = await response.json().catch(() => ({}));
      lastError = errorData.error?.message || `Lỗi HTTP ${response.status}`;
      failedInitialModel = currentModel;
      console.warn(`[Gemini API] Mô hình ${currentModel} báo lỗi (${response.status}): ${lastError}. Đang thử mô hình kế tiếp...`);

      // Nếu lỗi 400 (Invalid Key) thì dừng ngay vì key không hợp lệ
      if (response.status === 400 && lastError.includes('API_KEY_INVALID')) {
        break;
      }

      // Nếu không phải lỗi quá tải 503 hoặc 429 hoặc 404 thì dừng
      if (response.status !== 503 && response.status !== 429 && response.status !== 404) {
        break;
      }
    } catch (err) {
      lastError = err.message;
      failedInitialModel = currentModel;
    }
  }

  const elapsed = Date.now() - startTime;
  return {
    source: 'local_heuristic_after_error',
    isRealAi: false,
    errorMsg: lastError,
    failedModel: failedInitialModel || selectedModel,
    elapsed,
    suggestions: generateSmartFallbackHooks(topic)
  };
}

/**
 * Phân tích nội dung link bóc tách từ mạng xã hội (TikTok, FB, Threads, Web) bằng Gemini 3.x
 */
export async function analyzeSocialLinkWithGemini(extractedData) {
  const { title = '', description = '', content = '', platform = { name: 'Mạng Xã Hội' }, author = '', originalUrl = '' } = extractedData;
  const apiKey = getStoredGeminiKey();
  const selectedModel = getStoredGeminiModel();
  const startTime = Date.now();

  const platformName = platform?.name || 'Mạng Xã Hội';
  const cleanTitle = title || 'Nội dung chia sẻ';

  // Bộ dự phòng thông minh khi chưa có API Key
  const generateFallbackLinkHooks = () => {
    const pTag = platformName.toUpperCase();
    return {
      coreTakeaway: description || `Những bài học thực chiến và góc nhìn độc đáo được trích xuất từ ${platformName}.`,
      author: author || platformName,
      platform: platformName,
      hooks: [
        {
          style: 'Tò Mò & Khám Phá (Curiosity Hook)',
          headline: `Bí Ẩn Đằng Sau "${cleanTitle.slice(0, 45)}...": Sự Thật Chưa Ai Nói?`,
          subtitle: `Phân tích chi tiết góc nhìn mới nhất từ bài đăng đang gây sốt trên ${platformName}.`,
          categoryTag: `🔥 ${pTag} VIRAL`,
          highlightWord: 'Bí Ẩn Đằng Sau',
          viralityScore: '98% Viral',
          suggestedTemplate: 'bento-grid',
          suggestedTheme: 'indigo-cyan'
        },
        {
          style: 'Thực Chiến & Hành Động (Actionable Hook)',
          headline: `3 Bài Học Đắt Giá Bạn Cần Rút Ra Từ "${cleanTitle.slice(0, 40)}..."`,
          subtitle: `Đúc kết kinh nghiệm then chốt giúp bạn ứng dụng ngay vào công việc và phát triển bản thân.`,
          categoryTag: `⚡ ${pTag} ĐÚC KẾT`,
          highlightWord: '3 Bài Học',
          viralityScore: '95% Viral',
          suggestedTemplate: 'saas-launch',
          suggestedTheme: 'emerald-teal'
        },
        {
          style: 'Cảnh Báo & Phản Biện (Contrarian Hook)',
          headline: `Đừng Tin Tất Cả Về "${cleanTitle.slice(0, 45)}..." Nếu Chưa Biết Điều Này!`,
          subtitle: `Điểm mù phổ biến và những rủi ro tiềm ẩn mà đa số người xem thường bỏ qua.`,
          categoryTag: `⚠️ CẢNH BÁO ${pTag}`,
          highlightWord: 'Đừng Tin',
          viralityScore: '92% Viral',
          suggestedTemplate: 'cyber-glitch',
          suggestedTheme: 'sunset-amber'
        }
      ]
    };
  };

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      source: 'local_heuristic',
      isRealAi: false,
      elapsed: 600,
      data: generateFallbackLinkHooks()
    };
  }

  const promptText = `
Bạn là Giám đốc Sáng tạo và Chuyên gia Tối ưu Hóa Visual Viral trên TikTok, Facebook, Threads, X và LinkedIn.
Nhiệm vụ của bạn là phân tích sâu bài đăng/bài viết sau đây được bóc tách từ ${platformName}:

URL: ${originalUrl}
NỀN TẢNG: ${platformName}
TÁC GIẢ / NGUỒN: ${author || 'Chưa rõ'}
TIÊU ĐỀ GỐC: "${title}"
MÔ TẢ GỐC: "${description}"
TRÍCH ĐOẠN NỘI DUNG:
"""
${content.slice(0, 2000)}
"""

HÃY PHÂN TÍCH VÀ TRẢ VỀ DUY NHẤT MỘT ĐỐI TƯỢNG JSON VỚI CẤU TRÚC SAU:
{
  "coreTakeaway": "1 câu đúc kết cốt lõi sâu sắc nhất của bài viết này (dưới 110 ký tự tiếng Việt)",
  "author": "Tên tác giả hoặc kênh/trang (ngắn gọn, ví dụ: @username hoặc tên tổ chức)",
  "platform": "${platformName}",
  "hooks": [
    {
      "style": "Tò Mò & Khám Phá (Curiosity Hook)",
      "headline": "Tiêu đề giật tít đánh vào tâm lý tò mò, mở khoảng trống thông tin (dưới 70 ký tự tiếng Việt)",
      "subtitle": "Phụ đề kích thích bấm đọc, tóm lược giá trị (dưới 120 ký tự tiếng Việt)",
      "categoryTag": "Tag ngắn kèm emoji, ví dụ: '🔥 ${platformName.toUpperCase()} VIRAL' hoặc '⚡ INSIGHT'",
      "highlightWord": "Đúng 1-3 từ khóa đắt giá nhất trong headline cần phát sáng nổi bật",
      "viralityScore": "Điểm dự đoán lan truyền (ví dụ: '98% Viral')",
      "suggestedTemplate": "Chọn 1 trong các ID: 'saas-launch', 'cyber-glitch', 'bento-grid', 'dev-terminal', 'clean-editorial', 'quote-focus', 'podcast-minimal', 'floating-3d', 'handcrafted-note'",
      "suggestedTheme": "Chọn 1 trong các ID: 'indigo-cyan', 'fuchsia-rose', 'emerald-teal', 'sunset-amber', 'monochrome-dark', 'cyber-emerald'"
    },
    {
      "style": "Thực Chiến & Hành Động (Actionable Hook)",
      "headline": "Tiêu đề mang tính cẩm nang, bước làm, công thức hoặc số liệu cụ thể (dưới 70 ký tự tiếng Việt)",
      "subtitle": "Phụ đề giải thích ứng dụng thực tế (dưới 120 ký tự tiếng Việt)",
      "categoryTag": "Tag ngắn kèm emoji",
      "highlightWord": "Từ khóa điểm nhấn",
      "viralityScore": "Điểm dự đoán lan truyền (ví dụ: '95% Viral')",
      "suggestedTemplate": "Chọn 1 ID template",
      "suggestedTheme": "Chọn 1 ID theme"
    },
    {
      "style": "Cảnh Báo & Phản Biện (Contrarian Hook)",
      "headline": "Tiêu đề cảnh báo sai lầm, phản biện số đông hoặc góc nhìn ngược chiều (dưới 70 ký tự tiếng Việt)",
      "subtitle": "Phụ đề nêu lý do rủi ro hoặc điều cần né tránh (dưới 120 ký tự tiếng Việt)",
      "categoryTag": "Tag cảnh báo kèm emoji",
      "highlightWord": "Từ khóa điểm nhấn",
      "viralityScore": "Điểm dự đoán lan truyền (ví dụ: '93% Viral')",
      "suggestedTemplate": "Chọn 1 ID template",
      "suggestedTheme": "Chọn 1 ID theme"
    }
  ]
}

Chỉ trả về JSON thuần túy, tuyệt đối không bọc trong markdown code block.
`;

  const MODEL_FALLBACK_CANDIDATES = [
    selectedModel,
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.7-flash',
    'gemini-3.6-flash'
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);

  let lastError = null;
  let failedInitialModel = null;

  for (let i = 0; i < MODEL_FALLBACK_CANDIDATES.length; i++) {
    const currentModel = MODEL_FALLBACK_CANDIDATES[i];
    const isFallback = i > 0;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

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
            temperature: 0.75
          }
        })
      });

      const elapsed = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error('Mô hình AI không trả về nội dung.');

        const parsed = JSON.parse(rawText);
        if (!parsed.hooks || !Array.isArray(parsed.hooks)) {
          throw new Error('Định dạng dữ liệu hooks từ AI không khớp.');
        }

        console.log(`🤖 [Gemini Social Link AI] Phân tích thành công từ mô hình "${currentModel}" trong ${elapsed}ms:`, parsed);

        return {
          source: currentModel,
          model: currentModel,
          isRealAi: true,
          isFallback,
          fallbackFrom: isFallback ? selectedModel : null,
          elapsed,
          data: parsed
        };
      }

      const errorData = await response.json().catch(() => ({}));
      lastError = errorData.error?.message || `Lỗi HTTP ${response.status}`;
      failedInitialModel = currentModel;
      console.warn(`[Gemini Social Link AI] ${currentModel} lỗi (${response.status}): ${lastError}. Đang chuyển tiếp...`);

      if (response.status === 400 && lastError.includes('API_KEY_INVALID')) {
        break;
      }
      if (response.status !== 503 && response.status !== 429 && response.status !== 404) {
        break;
      }
    } catch (err) {
      lastError = err.message;
      failedInitialModel = currentModel;
    }
  }

  const elapsed = Date.now() - startTime;
  return {
    source: 'local_heuristic_after_error',
    isRealAi: false,
    errorMsg: lastError,
    failedModel: failedInitialModel || selectedModel,
    elapsed,
    data: generateFallbackLinkHooks()
  };
}
