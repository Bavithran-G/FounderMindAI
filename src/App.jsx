import { useState, useCallback, useEffect } from 'react';
import './index.css';
import { StarField }       from './components/StarField';
import { LandingHero }     from './components/LandingHero';
import { AgentPipeline }   from './components/AgentPipeline';
import { HistorySidebar }  from './components/HistorySidebar';
import { generateId, saveAnalysis } from './utils/history';

const DEFAULT_STATUSES = {
  marketResearch:   'idle',
  businessStrategy: 'idle',
  productArchitect: 'idle',
  investor:         'idle',
  pitchDeck:        'idle',
  execution:        'idle',
};

const emptyResult = (idea) => ({
  id:               generateId(),
  idea,
  timestamp:        Date.now(),
  marketResearch:   null,
  businessStrategy: null,
  productArchitect: null,
  investor:         null,
  pitchDeck:        null,
  execution:        null,
});

function classifyError(raw) {
  if (raw.includes('NO_API_KEY') || raw.includes('AUTH_ERROR') || raw.includes('CREDITS_ERROR')) {
    return { kind: 'general', message: 'The AI service is temporarily unavailable. Please try again shortly.' };
  }
  if (raw.includes('NETWORK_ERROR') || raw.includes('Failed to fetch')) {
    return { kind: 'general', message: 'Unable to connect to the backend server. Please ensure the Python backend is running.' };
  }
  if (raw.includes('429') || raw.includes('rate limit') || raw.includes('too many')) {
    return { kind: 'rate_limit', message: 'The AI is currently busy. Please wait a moment and try again.' };
  }
  if (raw.includes('PARSE_ERROR')) {
    return { kind: 'parse', message: 'Something unexpected happened. Please try again.' };
  }
  return { kind: 'general', message: raw.slice(0, 240) || 'Something went wrong.' };
}

function App() {
  const [view, setView]                   = useState('landing');
  const [isAnalyzing, setIsAnalyzing]     = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [agentStatuses, setAgentStatuses] = useState(DEFAULT_STATUSES);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [error, setError]                 = useState(null);

  useEffect(() => {
    const handler = () => setHistoryRefresh(k => k + 1);
    window.addEventListener('history-updated', handler);
    return () => window.removeEventListener('history-updated', handler);
  }, []);

  const startAnalysis = useCallback(async (idea) => {
    setIsAnalyzing(true);
    setError(null);
    setAgentStatuses(DEFAULT_STATUSES);

    const initial = emptyResult(idea);
    setCurrentResult(initial);
    setView('pipeline');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (!apiBaseUrl) {
        throw new Error('VITE_API_BASE_URL is not set');
      }

      const response = await fetch(`${apiBaseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });


      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let finalResult = initial;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                throw new Error(data.error);
              }
              if (data.done) {
                setCurrentResult(data.result);
                finalResult = data.result;
              } else if (data.agent && data.status) {
                setAgentStatuses(prev => ({ ...prev, [data.agent]: data.status }));
                if (data.status === 'complete' && data.data) {
                  setCurrentResult(prev => {
                    const next = prev ? { ...prev, [data.agent]: data.data } : prev;
                    finalResult = next;
                    return next;
                  });
                }
                if (data.status === 'complete') {
                  setHistoryRefresh(k => k + 1);
                }
              }
            } catch (err) {
              if (err.message.includes('NO_API_KEY') || err.message.includes('AUTH_ERROR') || err.message.includes('PARSE_ERROR')) {
                  throw err; // Re-throw AI errors caught during parsing
              }
              console.warn('Failed to parse SSE data chunk:', err);
            }
          }
        }
      }
      
      saveAnalysis(finalResult);
      setHistoryRefresh(k => k + 1);

    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      setError(classifyError(raw));
      console.error('[FounderMindAI] Analysis failed:', e);
    } finally {
      setIsAnalyzing(false);
      setHistoryRefresh(k => k + 1);
    }
  }, []);

  const handleSelectHistory = useCallback((result) => {
    setCurrentResult(result);
    setView('pipeline');
    setIsAnalyzing(false);
    setAgentStatuses({
      marketResearch:   result.marketResearch   ? 'complete' : 'idle',
      businessStrategy: result.businessStrategy ? 'complete' : 'idle',
      productArchitect: result.productArchitect ? 'complete' : 'idle',
      investor:         result.investor         ? 'complete' : 'idle',
      pitchDeck:        result.pitchDeck        ? 'complete' : 'idle',
      execution:        result.execution        ? 'complete' : 'idle',
    });
  }, []);

  const handleNewAnalysis = useCallback(() => {
    setView('landing');
    setCurrentResult(null);
    setAgentStatuses(DEFAULT_STATUSES);
    setError(null);
  }, []);

  return (
    <div className="app">
      <StarField />

      <HistorySidebar
        currentId={currentResult?.id}
        onSelect={handleSelectHistory}
        onNewAnalysis={handleNewAnalysis}
        refreshKey={historyRefresh}
      />

      <main className="main-content with-sidebar">

        {error && (
          <div style={{
            position: 'fixed', top: 20, right: 20, zIndex: 9999,
            background: 'rgba(10,8,30,0.96)',
            border: '1px solid rgba(244,63,94,0.45)',
            borderRadius: 16, padding: '20px 24px',
            color: '#f1f5f9', maxWidth: 440,
            backdropFilter: 'blur(24px)',
            boxShadow: '0 8px 40px rgba(244,63,94,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>
                {error.kind === 'rate_limit' ? '⏳' : '⚠️'}
              </span>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#f43f5e' }}>
                {error.kind === 'rate_limit' ? 'AI is Busy' :
                 error.kind === 'parse'      ? 'Try Again' : 'Something went wrong'}
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#94a3b8', marginBottom: 16 }}>
              {error.message}
            </p>
            <button
              onClick={() => setError(null)}
              style={{
                padding: '6px 16px',
                background: 'rgba(244,63,94,0.12)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: 8, color: '#f43f5e',
                cursor: 'pointer', fontSize: 13,
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {view === 'landing' && (
          <LandingHero onAnalyze={startAnalysis} isAnalyzing={isAnalyzing} />
        )}

        {view === 'pipeline' && currentResult && (
          <AgentPipeline
            idea={currentResult.idea}
            result={currentResult}
            agentStatuses={agentStatuses}
            onNewAnalysis={handleNewAnalysis}
          />
        )}
      </main>
    </div>
  );
}

export default App;
