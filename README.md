# 🧠 FounderMindAI

> **Your Autonomous AI Co-Founder — From Idea to Investor-Ready Startup**

FounderMindAI is an advanced AI-powered startup intelligence platform that transforms startup ideas into investor-ready business ventures through an autonomous multi-agent system. Simply describe your startup idea, and six specialized AI agents collaborate to perform market research, business planning, product design, investor evaluation, pitch deck creation, and execution planning.

Instead of switching between ChatGPT, Google Search, Excel, Notion, Canva, and PowerPoint, FounderMindAI delivers everything in one intelligent workflow—turning raw ideas into structured, validated, and actionable startup plans within minutes.

---

# ✨ Features

| Feature | Description |
|----------|-------------|
| 🤖 Multi-Agent AI | Six specialized AI agents collaborate autonomously |
| 📊 Market Research | Competitor analysis, market trends, gap identification, opportunity scoring |
| 💼 Business Strategy | Revenue model, pricing strategy, customer segmentation, value proposition |
| 🏗 Product Architecture | MVP planning, user journey, development roadmap, tech stack |
| 💰 Investor Analysis | VC-style evaluation with funding score and risk assessment |
| 🎯 Pitch Deck Generator | Automatically creates investor-ready presentations |
| 📅 Execution Planner | Generates structured 30/60/90-day execution roadmap |
| 📄 PDF Export | Comprehensive startup analysis report |
| 📊 PPTX Export | Professionally designed investor pitch deck |
| ⚡ Live Streaming | Real-time AI response generation using Server-Sent Events |

---

# 🚀 Workflow

```
Startup Idea
      │
      ▼
Market Research Agent
      │
      ▼
Business Strategy Agent
      │
      ▼
Product Architect Agent
      │
      ▼
Investor Agent
      │
      ▼
Pitch Deck Agent
      │
      ▼
Execution Agent
      │
      ▼
Investor-Ready Startup Report
```

---

# 🤖 Multi-Agent Architecture

## 📊 Agent 1 — Market Research Agent

- Competitor Analysis
- Market Size
- Industry Trends
- SWOT Analysis
- Opportunity Score

---

## 💼 Agent 2 — Business Strategist

Generates

- Revenue Model
- Pricing Strategy
- Customer Segments
- Value Proposition
- Business Model

---

## 🏗 Agent 3 — Product Architect

Designs

- MVP Features
- User Journey
- Technical Architecture
- Recommended Tech Stack
- Product Roadmap

---

## 💰 Agent 4 — Investor Agent

Acts like a Venture Capitalist

Evaluates

- Market Potential
- Scalability
- Competitive Advantage
- Risks
- Funding Score

---

## 🎯 Agent 5 — Pitch Deck Agent

Automatically creates

- Problem
- Solution
- Market Opportunity
- Business Model
- Competition
- Go-to-Market Strategy
- Financial Highlights

---

## 📅 Agent 6 — Execution Agent

Builds

- 30-Day Plan
- 60-Day Plan
- 90-Day Roadmap
- Key Milestones
- Success Metrics

---

# 🌐 Live Demo

Coming Soon...

---

# 🚀 Setup

## 1. Clone Repository

```bash
git clone <repository-url>

cd FounderMindAI
```

---

## 2. Install Frontend

```bash
npm install
```

---

## 3. Install Backend

```bash
python -m venv venv

# Windows
venv\Scripts\activate

pip install -r server/requirements.txt
```

---

## 4. Configure Environment Variables

Create a `.env` file in the project root.

```env
VITE_GROQ_API_KEY=your_groq_api_key
```

Get your API key from

https://console.groq.com

---

# ▶ Running the Application

## Backend

```bash
venv\Scripts\activate

uvicorn server.main:app --reload
```

Runs at

```
http://localhost:8000
```

---

## Frontend

```bash
npm run dev
```

Runs at

```
http://localhost:5173
```

---

# ⚙ How FounderMindAI Works

```
User submits startup idea
            │
            ▼
FastAPI Backend receives request
            │
            ▼
6 AI Agents execute sequentially
            │
            ▼
Results streamed via SSE
            │
            ▼
React UI updates in real time
            │
            ▼
PDF & PPT reports generated
```

---

# 🏗 Project Structure

```
FounderMindAI/

├── server/
│   ├── agents/
│   │   ├── market_research.py
│   │   ├── business_strategy.py
│   │   ├── product_architect.py
│   │   ├── investor_agent.py
│   │   ├── pitch_deck.py
│   │   └── execution_agent.py
│   │
│   ├── utils/
│   │   └── ai.py
│   │
│   ├── main.py
│   └── requirements.txt
│
├── src/
│   ├── components/
│   ├── App.jsx
│   ├── utils/
│   │   ├── downloadPDF.js
│   │   └── downloadPPT.js
│   │
│   └── styles/
│
├── public/
│
├── .env
├── package.json
└── vite.config.js
```

---

# 📄 Generated Outputs

FounderMindAI automatically generates

- ✅ Market Research Report
- ✅ Business Strategy
- ✅ Product Roadmap
- ✅ Investor Evaluation
- ✅ Pitch Deck
- ✅ 30/60/90 Day Execution Plan
- ✅ Comprehensive PDF Report
- ✅ Investor Presentation (PPTX)

---

# 💻 Tech Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React 19, Vite, JavaScript, CSS |
| Backend | Python, FastAPI, Uvicorn |
| AI Model | Groq API (Llama 3.3 70B) |
| Export | jsPDF, PptxGenJS |
| Communication | REST API, Server-Sent Events |
| Runtime | Node.js, Python |

---

# 🔮 Future Roadmap

- Multi-LLM Support
- Live Market Data Integration
- Financial Forecasting
- AI Logo Generation
- AI Landing Page Generator
- Investor Matching
- Team Builder Agent
- Legal & Compliance Agent
- Funding Recommendation Engine
- One-Click Startup Website Generation

---

# 👥 Contributors

Developed with ❤️ by the FounderMindAI Team.

---

# 📜 License

This project is licensed under the MIT License.