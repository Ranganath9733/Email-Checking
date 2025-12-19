
import React, { useState } from 'react';
import { analyzeEmail } from '../services/geminiService';
import { EmailValidationResult } from '../types';

interface Props {
  onComplete: (results: EmailValidationResult[]) => void;
}

export const BatchProcessor: React.FC<Props> = ({ onComplete }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProcess = async () => {
    const emails = input
      .split(/[\n,;]/)
      .map(e => e.trim())
      .filter(e => e.length > 0 && e.includes('@'));

    if (emails.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    
    const results: EmailValidationResult[] = [];
    const total = emails.length;

    // Process in small serial chunks to avoid rate limits or overwhelming
    for (let i = 0; i < total; i++) {
      try {
        const result = await analyzeEmail(emails[i]);
        results.push(result);
        setProgress(Math.round(((i + 1) / total) * 100));
      } catch (e) {
        console.error(`Error processing ${emails[i]}:`, e);
      }
    }

    onComplete(results);
    setIsProcessing(false);
    setInput('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200 mt-8">
      <h2 className="text-xl font-bold mb-2 text-slate-800">Batch Verifier</h2>
      <p className="text-sm text-slate-500 mb-4">Paste multiple emails separated by commas or new lines.</p>
      
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isProcessing}
        placeholder="user1@domain.com&#10;user2@company.org&#10;user3@service.io"
        className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-mono text-sm resize-none mb-4"
      />

      {isProcessing && (
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-1">
            <span>Processing Queue</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleProcess}
        disabled={isProcessing || !input.trim()}
        className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors"
      >
        {isProcessing ? 'Processing Batch...' : 'Analyze List'}
      </button>
    </div>
  );
};
