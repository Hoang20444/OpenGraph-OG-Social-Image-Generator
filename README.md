# 🔥 SnapOG Studio — OpenGraph (OG) & Social Card Generator

<p align="center">
  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" alt="SnapOG Banner" width="600" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>⚡ 100% Client-Side • Zero Data Stored • Ultra-fast 2X Retina PNG Export</strong><br>
  <em>Crafted with ❤️ by TinyForge Studio</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#monetization">Monetization ($0 Cost)</a> •
  <a href="#license">License</a>
</p>

---

## ✨ Features

- 🎨 **6 High-Converting Template Engines**:
  - `SaaS Launchpad`: Modern product hero with ambient radial glow.
  - `Dev Terminal`: MacOS code window, CLI commands, and tech tags.
  - `Linear Bento Grid`: Multi-cell modular cards inspired by Apple and Linear.
  - `Clean Editorial`: Sophisticated serif/sans typography frame for publications.
  - `Podcast & Media (PRO)`: Dynamic audio waveforms and play button callout.
  - `Cyberpunk HUD (PRO)`: Futuristic neon sci-fi borders and matrix aesthetics.
- 📱 **Multi-Ratio Support**:
  - `1200x630`: Standard OpenGraph (Facebook, LinkedIn, Discord).
  - `1200x675`: Twitter/X Summary Large Card (16:9).
  - `1080x1080`: Square Post (Instagram, Community feeds).
  - `1080x1920`: Vertical Story / Reel / Mobile view.
- 👁️ **Live Feed Simulator**: Preview your card inside simulated Twitter/X and Facebook/LinkedIn feed containers before exporting.
- 🚀 **1-Click High-Res Retina Export**: Direct 2X PNG export with celebratory confetti and direct clipboard copy.
- 🏷️ **Instant Meta Tag Generator**: One-click code generation for standard HTML `<head>` and Next.js (App & Pages router).
- 💰 **Zero-Cost Monetization Stack Ready**: Built-in support for VietQR (SePay/PayOS) and Gumroad / Lemon Squeezy with $0 maintenance fees.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite 6
- **Styling**: Vanilla CSS Design Tokens (Dark OLED `#020617` + Glassmorphism + Responsive scaling)
- **Icons**: Lucide React
- **Export Engine**: `html-to-image`
- **Micro-interactions**: `canvas-confetti`

---

## 🚀 Quick Start

### 1. Clone repository
```bash
git clone https://github.com/Hoang20444/OpenGraph-OG-Social-Image-Generator.git
cd OpenGraph-OG-Social-Image-Generator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 💳 Payment & QR Code Configuration

All payment and donation settings are centralized in **[`src/data/paymentConfig.js`](src/data/paymentConfig.js)**:

- **Local QR image**: Put your QR image in `public/my-qr.jpg` and set `useLocalQr: true`.
- **Automatic VietQR**: Set your bank code (MB, TPBank, VCB...), account number, and holder name.

---

## 👨‍💻 Author

Crafted with dedication by **TinyForge** / **becheerful2 (Nguyen Viet Hoang)**.  
Feedback and PRs are warmly welcomed! 🌟
