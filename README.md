# 🧠 FounderMindAI

**AI-powered startup analysis platform** — submit any startup idea and get a full report from 6 specialized AI agents covering Market Research, Business Strategy, Product Architecture, VC Investor Analysis, Pitch Deck, and a 90-Day Execution Plan.

---

## Prerequisites

Make sure the following are installed on the PC before you begin:

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10 or higher | https://python.org/downloads |
| Node.js | 18 or higher | https://nodejs.org |
| Groq API Key | Free | https://console.groq.com |

---

## Setup — Step by Step

### 1. Clone / Copy the project folder

Place the `FounderMindAI` folder anywhere on the new PC.

### 2. Set your API Key

Open the `.env` file in the project root and paste your Groq API key:

```
VITE_GROQ_API_KEY=gsk_your_key_here
```

Get a free key at 👉 https://console.groq.com

---

### 3. Install Python backend dependencies

Open a terminal inside the `FounderMindAI` folder and run:

```powershell
# Create a virtual environment
python -m venv venv

# Activate it (Windows)
.\venv\Scripts\activate

# Install all backend packages
pip install -r server\requirements.txt
```

---

### 4. Install frontend dependencies

In the **same folder**, open a **new terminal** and run:

```powershell
npm install
```

---

## Running the App

You need **two terminals** open simultaneously inside the project folder.

### Terminal 1 — Python Backend (FastAPI)

```powershell
.\venv\Scripts\activate
uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO: Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2 — React Frontend (Vite)

```powershell
npm run dev
```

You should see:
```
VITE ready in ... ms
➜  Local: http://localhost:5173/
```

Open **http://localhost:5173** in your browser and start analyzing ideas!

---

## Project Structure

```
FounderMindAI/
├── server/                  # Python FastAPI backend
│   ├── main.py              # API server + SSE streaming
│   ├── requirements.txt     # Python dependencies
│   ├── agents/              # 6 AI agent modules
│   │   ├── market_research.py
│   │   ├── business_strategy.py
│   │   ├── product_architect.py
│   │   ├── investor_agent.py
│   │   ├── pitch_deck.py
│   │   └── execution_agent.py
│   └── utils/
│       └── ai.py            # Groq API client
│
├── src/                     # React + JavaScript frontend
│   ├── App.jsx              # Main app + SSE consumer
│   ├── components/          # UI components
│   └── utils/
│       ├── downloadPDF.js   # Full report PDF export
│       └── downloadPPT.js   # Pitch deck PPTX export
│
├── .env                     # Your API key goes here
├── package.json             # Node.js dependencies
└── vite.config.js           # Vite config (proxies /api → port 8000)
```

---

## Downloads

| Button | What it generates |
|--------|-------------------|
| 📄 Download Report | Multi-page PDF with all sections (except Pitch Deck) |
| 🎯 Download Pitch Deck | PPTX file with branded slides, ready to present |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Vanilla CSS |
| Backend | Python 3.13, FastAPI, Uvicorn |
| AI | Groq API (Llama 3.3 70B) |
| PDF Export | jsPDF v4 |
| PPT Export | PptxGenJS v4 |
| Streaming | Server-Sent Events (SSE) |
