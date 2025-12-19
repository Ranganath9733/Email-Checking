
import React, { useState, useCallback } from 'react';
import { ValidationForm } from './components/ValidationForm';
import { ResultCard } from './components/ResultCard';
import { BatchProcessor } from './components/BatchProcessor';
import { StatsDashboard } from './components/StatsDashboard';
import { analyzeEmail } from './services/geminiService';
import { EmailValidationResult } from './types';

const App: React.FC = () => {
  const [singleResult, setSingleResult] = useState<EmailValidationResult | null>(null);
  const [batchResults, setBatchResults] = useState<EmailValidationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  const handleSingleValidate = async (email: string) => {
    setIsLoading(true);
    setSingleResult(null);
    try {
      const result = await analyzeEmail(email);
      setSingleResult(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchComplete = (results: EmailValidationResult[]) => {
    setBatchResults(prev => [...prev, ...results]);
  };

  const clearResults = () => {
    setSingleResult(null);
    setBatchResults([]);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">
              V
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">VerifyAI</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Email Intelligence</p>
            </div>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'single' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Single Check
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'batch' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Batch Process
            </button>
          </nav>

          {(singleResult || batchResults.length > 0) && (
            <button
              onClick={clearResults}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider"
            >
              Clear Workspace
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-12">
        {activeTab === 'single' ? (
          <div className="animate-in fade-in duration-700">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Validate with AI Precision</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Go beyond basic syntax checks. Analyze provider reputation, catch sneaky typos, and detect disposable domains in seconds.
              </p>
            </div>
            
            <ValidationForm onValidate={handleSingleValidate} isLoading={isLoading} />
            
            {singleResult && <ResultCard result={singleResult} />}
            
            {!singleResult && !isLoading && (
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                  title="Syntax Checker" 
                  desc="Strict adherence to RFC standards including complex edge cases." 
                  icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <FeatureCard 
                  title="Typo Detection" 
                  desc="AI-powered suggestions for common domain misspellings like 'gmal.com'." 
                  icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <FeatureCard 
                  title="Reputation Scan" 
                  desc="Identify throw-away providers and low-trust business domains." 
                  icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-4">Bulk Analysis Suite</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Process lists of subscribers or leads. Clean your database and visualize health metrics instantly.
              </p>
            </div>
            
            <BatchProcessor onComplete={handleBatchComplete} />
            <StatsDashboard results={batchResults} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-10 text-center">
        <p className="text-sm text-slate-400">
          Powered by Gemini AI Intelligence • Developed for Enterprise Data Quality
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors shadow-sm">
    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
    </div>
    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default App;
