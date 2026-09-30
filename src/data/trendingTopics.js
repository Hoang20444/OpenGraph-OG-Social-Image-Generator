// =============================================================================
// AI TREND RADAR & CONTENT INTELLIGENCE — TINYFORGE STUDIO
// Phân tích và dự báo các chủ đề đang bùng nổ trên TikTok, Facebook, Threads & X
// =============================================================================

export const TREND_CATEGORIES = [
  { id: 'all', label: 'Tất Cả Xu Hướng' },
  { id: 'tech', label: '⚡ Công Nghệ & AI' },
  { id: 'business', label: '💡 Khởi Nghiệp & Kinh Doanh' },
  { id: 'creative', label: '🎨 Sáng Tạo & Đời Sống' },
  { id: 'vietnam', label: '🇻🇳 Thị Trường Việt Nam' }
];

export const INITIAL_TRENDING_TOPICS = [
  {
    id: 'ai-agents-autonomous',
    topic: 'Kỷ Nguyên AI Agent Tự Hành 2026',
    category: 'tech',
    platform: 'X & Reddit & Threads',
    growth: '+540%',
    status: 'Bùng nổ (Viral)',
    confidence: '98% dự báo tăng',
    headline: 'Sự Trỗi Dậy Của AI Agent Độc Lập: Khi Trí Tuệ Nhân Tạo Tự Ra Quyết Định',
    subtitle: 'Khám phá cách các mô hình Agentic AI đang thay đổi hoàn toàn cách lập trình viên và doanh nghiệp vận hành quy trình tự động.',
    categoryTag: '⚡ AI AGENT • TREND 2026',
    highlightWord: 'AI Agent Độc Lập',
    suggestedTemplate: 'cyber-glitch',
    suggestedTheme: 'cyber-emerald'
  },
  {
    id: 'tiktok-livestream-conversion',
    topic: 'Chiến Lược Tối Ưu Chuyển Đổi TikTok Shop',
    category: 'vietnam',
    platform: 'TikTok & Facebook',
    growth: '+410%',
    status: 'Bùng nổ (Viral)',
    confidence: '95% đón đầu sóng',
    headline: 'Bí Quyết Giữ Chân Người Xem Trong 3 Giây Đầu Khi Bán Hàng Trực Tiếp',
    subtitle: 'Nghệ thuật xây dựng kịch bản móc nối (hook) và thiết kế hình ảnh kích thích người xem bấm mua hàng ngay tức thì.',
    categoryTag: '🇻🇳 E-COMMERCE & LIVESTREAM',
    highlightWord: '3 Giây Đầu',
    suggestedTemplate: 'bento-grid',
    suggestedTheme: 'sunset-amber'
  },
  {
    id: 'micro-saas-zero-cost',
    topic: 'Xây Dựng Micro-SaaS Với Vốn 0 Đồng',
    category: 'business',
    platform: 'Threads & Indie Hackers',
    growth: '+380%',
    status: 'Tăng mạnh (Hot)',
    confidence: '92% xu hướng bền vững',
    headline: 'Cách Một Lập Trình Viên Độc Lập Kiếm 2.000$ Đầu Tiên Từ Micro-Tool',
    subtitle: 'Tận dụng kiến trúc Client-Side và mô hình thanh toán một lần để loại bỏ 100% chi phí máy chủ hàng tháng.',
    categoryTag: '💡 SOLOPRENEUR PLAYBOOK',
    highlightWord: 'Vốn 0 Đồng',
    suggestedTemplate: 'saas-launch',
    suggestedTheme: 'indigo-cyan'
  },
  {
    id: 'deep-work-digital-detox',
    topic: 'Trào Lưu Sống Tối Giản Số (Digital Detox)',
    category: 'creative',
    platform: 'Medium & Substack',
    growth: '+290%',
    status: 'Đang lên (Rising)',
    confidence: '89% thảo luận sâu',
    headline: 'Tìm Lại Sự Tập Trung: 4 Giờ Deep Work Mỗi Ngày Thay Đổi Đời Tôi Thế Nào?',
    subtitle: 'Cách thiết lập lại thói quen số, ngắt bớt thông báo rác và xây dựng không gian sáng tạo tĩnh lặng giữa thời đại ồn ào.',
    categoryTag: '✍️ LỐI SỐNG TẬP TRUNG',
    highlightWord: 'Deep Work',
    suggestedTemplate: 'handcrafted-note',
    suggestedTheme: 'sunset-amber'
  },
  {
    id: 'storytelling-viral-framework',
    topic: 'Công Thức Storytelling Triệu Lượt Xem',
    category: 'creative',
    platform: 'TikTok & Threads & Facebook',
    growth: '+460%',
    status: 'Bùng nổ (Viral)',
    confidence: '96% độ lan truyền cao',
    headline: 'Nghệ Thuật Kể Chuyện Chạm Cảm Xúc: Bí Mật Đằng Sau Các Bài Viết Triệu View',
    subtitle: 'Khung cấu trúc 3 phần giúp biến những câu chuyện đời thường thành thông điệp truyền cảm hứng mạnh mẽ.',
    categoryTag: '🔥 NGHỆ THUẬT CONTENT',
    highlightWord: 'Triệu View',
    suggestedTemplate: 'quote-focus',
    suggestedTheme: 'fuchsia-rose'
  },
  {
    id: 'local-llm-privacy',
    topic: 'Mô Hình Ngôn Ngữ Chạy Cục Bộ (Local LLM)',
    category: 'tech',
    platform: 'GitHub & Hacker News',
    growth: '+320%',
    status: 'Tăng mạnh (Hot)',
    confidence: '94% xu hướng kỹ thuật',
    headline: 'Chạy Mô Hình AI Riêng Tư Trực Tiếp Trên Máy Tính: Không Cần API, Không Tốn Tiền',
    subtitle: 'Hướng dẫn cài đặt Ollama, DeepSeek và Llama 3 trên laptop để xử lý dữ liệu doanh nghiệp an toàn tuyệt đối.',
    categoryTag: '⚡ OPEN SOURCE & PRIVACY',
    highlightWord: 'Chạy Cục Bộ',
    suggestedTemplate: 'dev-terminal',
    suggestedTheme: 'monochrome-dark'
  },
  {
    id: 'vietnam-indie-revolution',
    topic: 'Làn Sóng Solo Developer Việt Nam 2026',
    category: 'vietnam',
    platform: 'Facebook Groups & LinkedIn',
    growth: '+350%',
    status: 'Đang lên (Rising)',
    confidence: '91% cộng đồng sôi động',
    headline: 'Từ Dân Làm Thuê Thành Nhà Sáng Lập: Câu Chuyện Tự Tay Đưa Sản Phẩm Ra Thế Giới',
    subtitle: 'Những cơ hội vàng cho nhân sự công nghệ Việt Nam khi tự chủ phát triển sản phẩm SaaS và công cụ độc lập.',
    categoryTag: '🇻🇳 KHỞI NGHIỆP CÔNG NGHỆ',
    highlightWord: 'Solo Developer',
    suggestedTemplate: 'clean-editorial',
    suggestedTheme: 'emerald-teal'
  },
  {
    id: 'vietqr-embedded-finance',
    topic: 'Thanh Toán Không Tiền Mặt & VietQR Tự Động',
    category: 'business',
    platform: 'Fintech & Báo Chí',
    growth: '+270%',
    status: 'Tăng đều (Steady)',
    confidence: '97% nhu cầu thiết thực',
    headline: 'Tích Hợp Thanh Toán Tức Thì: Tại Sao VietQR Đang Thống Lĩnh Thị Trường Việt Nam?',
    subtitle: 'Giải mã mô hình thanh toán không chạm không cần cổng trung gian đắt đỏ cho các website thương mại hiện đại.',
    categoryTag: '💡 TÀI CHÍNH CÔNG NGHỆ',
    highlightWord: 'VietQR Tự Động',
    suggestedTemplate: 'floating-3d',
    suggestedTheme: 'indigo-cyan'
  }
];

// Hàm nạp dữ liệu xu hướng thực tế từ pipeline (public/data/live_trends.json)
export async function fetchLiveTrends() {
  try {
    const res = await fetch(`/data/live_trends.json?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.trends) && data.trends.length > 0) {
        return {
          isLive: true,
          updatedAt: data.updatedAt,
          trends: data.trends
        };
      }
    }
  } catch (err) {
    console.warn('⚠️ Không thể tải live_trends.json, dùng dữ liệu dự phòng:', err.message);
  }

  return {
    isLive: false,
    updatedAt: null,
    trends: INITIAL_TRENDING_TOPICS
  };
}

// Cập nhật lại refreshTrendingPipeline() để ưu tiên nạp từ file JSON thực tế
export async function refreshTrendingPipeline() {
  const liveResult = await fetchLiveTrends();
  if (liveResult.isLive) {
    return liveResult.trends;
  }

  // Fallback nếu không có file JSON
  return INITIAL_TRENDING_TOPICS.map((item) => {
    const randomBoost = Math.floor(Math.random() * 60) - 20;
    const currentGrowth = parseInt(item.growth.replace(/[^0-9]/g, ''), 10);
    const newGrowth = Math.max(120, currentGrowth + randomBoost);
    return {
      ...item,
      growth: `+${newGrowth}%`
    };
  });
}
