# 🧠 FounderMindAI — Startup Intelligence Platform

An advanced AI-powered platform that transforms raw startup ideas into comprehensive, actionable business intelligence. Submit any idea and watch **6 specialized AI agents** work in parallel to deliver a full-spectrum analysis — from market research and VC scoring to a branded pitch deck and 90-day execution plan — all streamed live to your screen.

---

## 🌐 Live Demo

Try the app here: **[FounderMindAI](https://founder-mind-ai.vercel.app)**

> ⚡ Backend hosted on Render (free tier — may take ~30s to cold start on first request)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 Market Research Agent | Opportunity score, competitor analysis, market trends & gaps |
| 💼 Business Strategy Agent | Value proposition, revenue model, pricing tiers, customer segments |
| 🏗️ Product Architecture Agent | MVP features, tech stack, phase-wise roadmap |
| 💰 VC Investor Agent | Funding score, verdict, risk analysis, due-diligence Q&A |
| 🎯 Pitch Deck Agent | Auto-generated branded slide deck with icons, content & key points |
| 🚀 Execution Plan Agent | 30 / 60 / 90-day action plans, milestones & KPIs |
| 📡 Live Streaming | Real-time SSE streaming — results appear as each agent completes |
| 📄 PDF Export | Download the full report (all sections except pitch deck) as a styled PDF |
| 🎯 PPTX Export | Download the pitch deck as a presentation-ready PowerPoint file |
| 🌑 Dark Theme | Premium dark UI with light-blue FounderMindAI branding |

---

## 🤖 Agent Pipeline

```
User Idea
    │
    ├── 🔍 Market Research Agent    → opportunityScore, competitors, trends, gaps
    ├── 💼 Business Strategy Agent  → valueProposition, moat, pricingTiers, segments
    ├── 🏗️ Product Architect Agent  → mvpFeatures, techStack, roadmap
    ├── 💰 VC Investor Agent        → fundingScore, verdict, risks, vcQuestions
    ├── 🎯 Pitch Deck Agent         → startupName, tagline, slides[]
    └── 🚀 Execution Agent          → milestones, kpis, day30/60/90 tasks
```

All 6 agents run concurrently via **Server-Sent Events (SSE)** — the UI updates in real time as each one finishes.

---

## 🚀 Setup (Local)

### 1. Clone the repository

```bash
git clone https://github.com/Bavithran-G/FounderMindAI.git
cd FounderMindAI
```

### 2. Get a Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Create an API key

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 4. Install frontend dependencies

```bash
npm install
```

### 5. Install Python backend dependencies

```bash
# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install packages
pip install -r server/requirements.txt
```

### 6. Run the app

Open **two terminals**:

**Terminal 1 — Python Backend (FastAPI + Uvicorn)**
```bash
.\venv\Scripts\activate
uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
# → http://localhost:8000
```

**Terminal 2 — React Frontend (Vite)**
```bash
npm run dev
# → http://localhost:5173
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## ☁️ Deployment

### Frontend → Vercel

1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add environment variable:
   ```
   VITE_GROQ_API_KEY = gsk_your_key_here
   ```
4. Deploy — Vite builds automatically

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set the following:
   - **Root Directory**: `server`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`
4. Add environment variable:
   ```
   VITE_GROQ_API_KEY = gsk_your_key_here
   ```
5. Update `vite.config.js` proxy target to your Render URL:
   ```js
   target: 'https://foundermindai.onrender.com'
   ```

---

## 🏗️ Architecture

```
FounderMindAI/
├── server/                          # Python FastAPI backend
│   ├── main.py                      # API server + SSE streaming endpoint
│   ├── requirements.txt             # Python dependencies (pinned)
│   ├── agents/
│   │   ├── market_research.py       # Market Research Agent
│   │   ├── business_strategy.py     # Business Strategy Agent
│   │   ├── product_architect.py     # Product Architect Agent
│   │   ├── investor_agent.py        # VC Investor Agent
│   │   ├── pitch_deck.py            # Pitch Deck Agent
│   │   └── execution_agent.py       # Execution Plan Agent
│   └── utils/
│       └── ai.py                    # Groq API client (OpenAI-compatible)
│
├── src/                             # React + JavaScript frontend
│   ├── App.jsx                      # Root app + SSE consumer
│   ├── index.css                    # Global styles + design system
│   ├── components/
│   │   ├── AgentPipeline.jsx        # Main orchestrator + progress tracker
│   │   ├── AgentCard.jsx            # Individual agent status card
│   │   ├── MarketReport.jsx         # Market Research results view
│   │   ├── BusinessReport.jsx       # Business Strategy results view
│   │   ├── ProductReport.jsx        # Product Architecture results view
│   │   ├── InvestorReport.jsx       # VC Investor results view
│   │   ├── PitchDeckView.jsx        # Slide-by-slide pitch deck viewer
│   │   └── ExecutionReport.jsx      # 90-Day execution plan view
│   └── utils/
│       ├── downloadPDF.js           # Branded multi-page PDF export (jsPDF)
│       └── downloadPPT.js           # Branded PPTX pitch deck export (PptxGenJS)
│
├── .env                             # API key (not committed to git)
├── vite.config.js                   # Vite config (proxies /api → backend)
├── package.json                     # Node.js dependencies
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 + Vite 8 |
| Styling | Vanilla CSS (custom design system) |
| Backend Framework | Python 3.13, FastAPI, Uvicorn |
| AI Model | Groq API — Llama 3.3 70B Versatile |
| Streaming | Server-Sent Events (SSE) |
| PDF Export | jsPDF v4 |
| PPTX Export | PptxGenJS v4 |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## 📦 Python Dependencies

Key packages (see `server/requirements.txt` for full pinned list):

```
fastapi==0.138.0
uvicorn==0.49.0
openai==2.43.0          # Groq uses OpenAI-compatible client
pydantic==2.13.4
python-dotenv==1.2.2
sse-starlette==3.4.5
```

---

## 📋 Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Python | 3.10+ |
| Node.js | 18+ |
| Groq API Key | Free at console.groq.com |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.