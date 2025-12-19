
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { EmailValidationResult } from '../types';

interface Props {
  results: EmailValidationResult[];
}

export const StatsDashboard: React.FC<Props> = ({ results }) => {
  if (results.length === 0) return null;

  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.length - validCount;
  
  const pieData = [
    { name: 'Valid', value: validCount, color: '#10b981' },
    { name: 'Invalid', value: invalidCount, color: '#f43f5e' }
  ];

  const categoryCounts = results.reduce((acc: any, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(categoryCounts).map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: categoryCounts[cat]
  }));

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 text-center">Health Distribution</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 text-center">Category Breakdown</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Verification Logs</h3>
        <div className="max-h-[250px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {results.slice().reverse().map((res, i) => (
            <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100">
              <span className="font-medium truncate max-w-[150px]">{res.email}</span>
              <span className={`px-2 py-0.5 rounded ${res.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {res.isValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
