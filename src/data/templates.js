// SnapOG Studio Data & Configuration
export const ASPECT_RATIOS = [
  { id: '1200x630', label: 'OpenGraph', desc: 'FB, LinkedIn, Discord', width: 1200, height: 630, aspect: '1200 / 630' },
  { id: '1200x675', label: 'Twitter/X Card', desc: '16:9 Large Summary', width: 1200, height: 675, aspect: '1200 / 675' },
  { id: '1080x1080', label: 'Square Post', desc: 'Instagram, Feed', width: 1080, height: 1080, aspect: '1 / 1' },
  { id: '1080x1920', label: 'Story / Reel', desc: '9:16 Vertical', width: 1080, height: 1920, aspect: '1080 / 1920' },
];

export const COLOR_THEMES = [
  {
    id: 'indigo-cyan',
    name: 'Midnight Aurora',
    primary: '#6366f1',
    secondary: '#06b6d4',
    bg: '#030712',
    surface: '#0f172a',
    text: '#ffffff',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
    glowColor: 'rgba(99, 102, 241, 0.35)',
    border: 'rgba(99, 102, 241, 0.3)'
  },
  {
    id: 'cyber-emerald',
    name: 'Cyber Matrix',
    primary: '#10b981',
    secondary: '#14b8a6',
    bg: '#020617',
    surface: '#091e1d',
    text: '#ffffff',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    border: 'rgba(16, 185, 129, 0.3)'
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Flare',
    primary: '#f43f5e',
    secondary: '#f59e0b',
    bg: '#0c0712',
    surface: '#1c1022',
    text: '#ffffff',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    border: 'rgba(244, 63, 94, 0.3)'
  },
  {
    id: 'violet-fuchsia',
    name: 'Royal Nebula',
    primary: '#8b5cf6',
    secondary: '#ec4899',
    bg: '#090514',
    surface: '#190e30',
    text: '#ffffff',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    border: 'rgba(139, 92, 246, 0.3)'
  },
  {
    id: 'monochrome-dark',
    name: 'Obsidian Minimal',
    primary: '#94a3b8',
    secondary: '#e2e8f0',
    bg: '#09090b',
    surface: '#18181b',
    text: '#ffffff',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.15)'
  },
  {
    id: 'pure-white',
    name: 'Studio Light',
    primary: '#2563eb',
    secondary: '#4f46e5',
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
    glowColor: 'rgba(37, 99, 235, 0.15)',
    border: 'rgba(0, 0, 0, 0.12)'
  }
];

export const TEMPLATES = [
  {
    id: 'saas-launch',
    name: 'SaaS Launchpad',
    tagline: 'Modern, high-converting product hero',
    badge: 'Popular',
    isPro: false,
    author: 'TinyForge'
  },
  {
    id: 'handcrafted-note',
    name: 'Handcrafted Note',
    tagline: 'Sticky paper, doodle arrow & warm handwriting',
    badge: 'Human',
    isPro: false,
    author: 'TinyForge'
  },
  {
    id: 'retro-paper',
    name: 'Vintage Paper',
    tagline: 'Aged parchment, classic serif & post stamp',
    badge: 'Retro',
    isPro: false,
    author: 'TinyForge'
  },
  {
    id: 'floating-3d',
    name: '3D Floating Glass',
    tagline: 'Perspective 3D tilt with deep layered shadows',
    badge: '3D Depth',
    isPro: false,
    author: 'TinyForge'
  },
  {
    id: 'safari-window',
    name: 'Safari Browser',
    tagline: 'Mac browser window with frosted URL pill',
    badge: 'Clean UI',
    isPro: false,
    author: 'TinyForge'
  },
  {
    id: 'quote-focus',
    name: 'Wisdom Quote',
    tagline: 'Large quotation marks & thought leadership',
    badge: 'Viral',
    isPro: false,
    author: 'TinyForge'
  },
  {
    id: 'dev-terminal',
    name: 'Dev Terminal',
    tagline: 'MacOS code window & CLI aesthetic',
    badge: 'Tech',
    isPro: false,
    author: 'TinyForge'
  },
  {
    id: 'bento-grid',
    name: 'Linear Bento',
    tagline: 'Apple / Linear modular bento cards',
    badge: 'Hot',
    isPro: false,
    author: 'TinyForge'
  },
  {
    id: 'clean-editorial',
    name: 'Clean Editorial',
    tagline: 'Sophisticated typography & frame',
    badge: 'Classic',
    isPro: false,
    author: 'TinyForge'
  },
  {
    id: 'podcast-media',
    name: 'Podcast & Stream',
    tagline: 'Waveform audio visualizer & play pill',
    badge: 'Media',
    isPro: true,
    author: 'TinyForge'
  },
  {
    id: 'cyber-glitch',
    name: 'Cyberpunk HUD',
    tagline: 'Neon scanline grid & tech badges',
    badge: 'PRO',
    isPro: true,
    author: 'TinyForge'
  }
];

export const STICKERS = [
  { id: 'none', label: 'None' },
  { id: 'must-read', label: '⭐ MUST READ', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)' },
  { id: 'pro-tip', label: '💡 PRO TIP', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' },
  { id: 'trending', label: '🔥 TRENDING', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.2)' },
  { id: 'handcrafted', label: '🎨 HANDCRAFTED', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)' }
];

export const QUICK_PRESETS = [
  {
    name: '🚀 SaaS Launch',
    title: 'Introducing SnapOG v2.0: The AI Social Card Studio',
    subtitle: 'Generate pixel-perfect 1200x630 preview images in under 10 seconds. Free, client-side, zero backend.',
    tag: 'NEW RELEASE',
    author: 'Alex Vance',
    role: 'Founder @ SnapOG',
    site: 'snapog.dev',
    template: 'saas-launch',
    theme: 'indigo-cyan'
  },
  {
    name: '⚡ Dev Guide',
    title: 'Building High-Performance React 19 Apps with Zero Server Cost',
    subtitle: 'A comprehensive deep dive into serverless architectures, edge caching, and bundle optimization.',
    tag: 'TUTORIAL • 8 MIN READ',
    author: 'Kira Chen',
    role: 'Staff Frontend Engineer',
    site: 'devcraft.io',
    template: 'dev-terminal',
    theme: 'cyber-emerald'
  },
  {
    name: '🎙️ Podcast',
    title: 'Ep. 42: How to Go from Fresher to Solopreneur in 6 Months',
    subtitle: 'Interview with indie makers on shipping micro-tools, scaling without capital, and staying sane.',
    tag: 'TECH PODCAST',
    author: 'Sarah Jenkins',
    role: 'Host & Creator',
    site: 'indiepulse.fm',
    template: 'bento-grid',
    theme: 'sunset-amber'
  },
  {
    name: '📝 Maker Note',
    title: 'The Solopreneur Playbook: Building Micro-SaaS from Scratch',
    subtitle: '10 practical lessons learned after shipping 5 web apps with zero marketing budget.',
    tag: 'HANDWRITTEN NOTE',
    author: 'Nguyen Viet Hoang',
    role: 'Maker @ TinyForge',
    site: 'tinyforge.dev',
    template: 'handcrafted-note',
    theme: 'sunset-amber'
  },
  {
    name: '📜 Vintage Essay',
    title: 'The Lost Art of Crafting Digital Software with Patience and Soul',
    subtitle: 'Why modern engineers are rediscovering calm, focused development over hyper-growth.',
    tag: 'ESSAY • ISSUE NO. 14',
    author: 'Evelyn St. Claire',
    role: 'Author & Essayist',
    site: 'themorningink.com',
    template: 'retro-paper',
    theme: 'pure-white'
  },
  {
    name: '💬 Viral Quote',
    title: '“The best code is the code you never had to maintain because you shipped what truly matters.”',
    subtitle: 'Insights on minimalism, architectural clarity, and building lean businesses.',
    tag: 'WORDS OF WISDOM',
    author: 'Kira Chen',
    role: 'Principal Architect',
    site: 'thoughtforge.io',
    template: 'quote-focus',
    theme: 'indigo-cyan'
  },
  {
    name: '⭐ Open Source',
    title: 'LightWeight UI: 50+ Accessible CSS Components',
    subtitle: 'Production-ready, copy-paste components with fluid micro-interactions and dark mode built-in.',
    tag: 'GITHUB REPO • 4.9k ★',
    author: 'OpenForge Team',
    role: 'Core Contributors',
    site: 'github.com/snapog',
    template: 'clean-editorial',
    theme: 'monochrome-dark'
  }
];

export const DEFAULT_AVATARS = [
  { id: 'dev-1', label: 'Male Dev 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-2', label: 'Female Dev 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-3', label: 'Male Dev 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'dev-4', label: 'Female Dev 4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'tech-logo', label: 'Abstract Cube', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80' }
];
