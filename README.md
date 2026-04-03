<div align="center">
  <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-blue?style=for-the-badge" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Firebase-v10-orange?style=for-the-badge&logo=firebase" alt="Firebase" />
  <h1>🏡 Panchayat</h1>
  <p><b>The world's simplest, AI-powered housing society management platform.</b></p>
</div>

<br />

## 🌟 Overview

**Panchayat** is a revolutionary residential society management platform designed not just for managers, but specifically crafted to be **Elder-Friendly**. Utilizing the deep intelligence of the Google Gemini AI Engine, we've stripped away complex dropdowns, tiny text, and nested menus.

Simply press a button, speak your problem naturally, and our AI will file, categorize, and prioritize the maintenance ticket automatically. 

---

## ✨ Premium Features

- 🎙️ **Voice-to-Ticket AI:** Residents can just speak their complaint in any language. The AI parses the transcription, extracts the core issue, and categorizes it logically.
- 🤖 **Rulebook AI Assistant:** Stop calling the front desk. Ask the AI instantly about visitor protocols, pool timings, or noise rules.
- 📊 **Drama-Filter AI (Admin):** Admins can hit the "Summarize Drama" button to have Gemini read through hundreds of complaints and distill the top structural issues into actionable bullet points.
- 👓 **Elder-Friendly UI/UX:** Built upon the Material Design 3 language. Featuring massive touch targets, pillowy dynamic contrasts, and high-visibility typography.
- ⚡ **Offline Grace-Fallback:** Robust offline detection caching seamlessly redirects users dynamically without crashing or throwing infinite spinners when the internet drops.
- 💳 **Expense & Billing Tracking:** Instant visual feedback for maintenance dues and collections.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 15 (React 19), Tailwind CSS, Vanilla styling
- **Backend/Database:** Firebase Firestore (Real-time architecture)
- **Authentication:** Firebase Auth
- **AI Brain:** Google `@google/genai` (Gemini 2.5 Flash SDK)
- **Deployment:** Vercel

---

## 🚀 Quick Start

Want to run Panchayat locally?

**1. Clone the repository**
```bash
git clone https://github.com/Samraatsharma/panchayat-app.git
cd panchayat-app
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Create a `.env.local` file at the root of your project:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=12345
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_flash_key
```

**4. Start the development server**
```bash
npm run dev
```
Navigate to `http://localhost:3000` to see the magic happen!

---

<div align="center">
  <i>Built with ❤️ for a seamless living experience.</i>
</div>
