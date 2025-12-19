
import React from 'react';
import { EmailValidationResult } from '../types';

interface Props {
  result: EmailValidationResult;
}

export const ResultCard: React.FC<Props> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-emerald-600';
    if (score > 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'business': return 'bg-blue-100 text-blue-700';
      case 'personal': return 'bg-indigo-100 text-indigo-700';
      case 'disposable': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`h-2 ${result.isValid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 break-all">{result.email}</h3>
            <div className="flex gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getBadgeColor(result.category)}`}>
                {result.category}
              </span>
              {result.isDisposable && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700">
                  Disposable
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-black ${getScoreColor(result.score)}`}>
              {result.score}<span className="text-lg">%</span>
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase mt-1">Trust Score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Technical Status</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <StatusIcon check={result.syntaxOk} />
                <span className="text-sm font-medium">Syntax Format</span>
              </li>
              <li className="flex items-center gap-2">
                <StatusIcon check={result.isValid} />
                <span className="text-sm font-medium">Domain Validity</span>
              </li>
              <li className="flex items-center gap-2">
                <StatusIcon check={!result.isDisposable} />
                <span className="text-sm font-medium">Legitimacy Check</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Domain Context</h4>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-indigo-600">{result.provider}</span>
              <p className="text-xs text-slate-500 mt-1">Host Provider Identity</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">AI Analysis</h4>
            <p className="text-slate-700 leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              {result.analysis}
            </p>
          </div>

          {result.possibleTypos.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Did you mean?</h4>
              <div className="flex flex-wrap gap-2">
                {result.possibleTypos.map((typo, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium border border-amber-200">
                    {typo}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusIcon = ({ check }: { check: boolean }) => (
  check ? (
    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
);
