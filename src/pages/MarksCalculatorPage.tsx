import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Calculator, TrendingUp } from 'lucide-react';

type ExamType = 'JEE Mains' | 'NEET' | 'JEE Advanced';

// Data sourced from 2024–2025 actual exam trends
const RANK_DATA: Record<ExamType, { min: number; max: number; rank: string; percentile: string; label: string; color: string }[]> = {
  NEET: [
    { min: 700, max: 720, rank: 'Top 50',       percentile: '99.99+',  label: 'AIIMS Delhi Range',    color: '#22c55e' },
    { min: 670, max: 699, rank: '50 – 500',      percentile: '99.9+',   label: 'Top AIIMS Range',      color: '#84cc16' },
    { min: 640, max: 669, rank: '500 – 3,000',   percentile: '99.5 – 99.9', label: 'JIPMER / Top Govt Range', color: '#eab308' },
    { min: 600, max: 639, rank: '3,000 – 15,000', percentile: '98 – 99.5', label: 'State Govt Medical Range', color: '#f97316' },
    { min: 550, max: 599, rank: '15,000 – 50,000', percentile: '94 – 98', label: 'Decent Govt Seat Range', color: '#ef4444' },
    { min: 500, max: 549, rank: '50,000 – 1,20,000', percentile: '85 – 94', label: 'Private College Range', color: '#a855f7' },
    { min: 0,   max: 499, rank: '1,20,000+',    percentile: '< 85',    label: 'Below Cutoff Zone',    color: '#6b7280' },
  ],
  'JEE Mains': [
    { min: 280, max: 300, rank: 'Top 200',       percentile: '99.98+',  label: 'IIT via Advanced (Top)',  color: '#22c55e' },
    { min: 240, max: 279, rank: '200 – 1,000',   percentile: '99.9 – 99.98', label: 'IIT via Advanced',  color: '#84cc16' },
    { min: 200, max: 239, rank: '1,000 – 8,000', percentile: '99.5 – 99.9', label: 'NIT Trichy / Surathkal', color: '#eab308' },
    { min: 160, max: 199, rank: '8,000 – 30,000', percentile: '97 – 99.5', label: 'Good NIT / IIIT Range', color: '#f97316' },
    { min: 120, max: 159, rank: '30,000 – 80,000', percentile: '93 – 97', label: 'NIT / GFTI Range',      color: '#ef4444' },
    { min: 75,  max: 119, rank: '80,000 – 2,00,000', percentile: '80 – 93', label: 'State Quota / Private', color: '#a855f7' },
    { min: 0,   max: 74,  rank: '2,00,000+',     percentile: '< 80',    label: 'Below Qualifying Range', color: '#6b7280' },
  ],
  'JEE Advanced': [
    { min: 280, max: 360, rank: 'Top 100',       percentile: 'N/A', label: 'CS at IIT Bombay / Delhi',  color: '#22c55e' },
    { min: 230, max: 279, rank: '100 – 500',     percentile: 'N/A', label: 'Top Branch IITs',           color: '#84cc16' },
    { min: 180, max: 229, rank: '500 – 2,000',   percentile: 'N/A', label: 'Old IIT Good Branch',       color: '#eab308' },
    { min: 140, max: 179, rank: '2,000 – 6,000', percentile: 'N/A', label: 'New IIT / Any Branch',      color: '#f97316' },
    { min: 100, max: 139, rank: '6,000 – 15,000', percentile: 'N/A', label: 'Qualifying Range',         color: '#ef4444' },
    { min: 0,   max: 99,  rank: 'Not Qualifying', percentile: 'N/A', label: 'Below Cutoff',             color: '#6b7280' },
  ],
};

const MAX_MARKS: Record<ExamType, number> = {
  NEET: 720,
  'JEE Mains': 300,
  'JEE Advanced': 360,
};

export const MarksCalculatorPage: React.FC = () => {
  const { setCurrentRoute } = useApp();
  const [exam, setExam] = useState<ExamType>('JEE Mains');
  const [marks, setMarks] = useState<number>(150);

  const handleExamChange = (e: ExamType) => {
    setExam(e);
    setMarks(Math.floor(MAX_MARKS[e] / 2));
  };

  const getPrediction = () => {
    const data = RANK_DATA[exam];
    return data.find(d => marks >= d.min && marks <= d.max) ?? data[data.length - 1];
  };

  const prediction = getPrediction();
  const maxMarks = MAX_MARKS[exam];
  const percentage = Math.round((marks / maxMarks) * 100);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentRoute('tools')}
          className="w-10 h-10 rounded-2xl bg-[var(--bg-surface-secondary)] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold font-heading bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Marks & Rank Calculator
        </h1>
      </div>

      <div className="bg-[#111111] border border-[#2a2a2a] rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-8">
          <Calculator className="w-6 h-6 text-[#4285f4]" />
          <h2 className="text-xl font-bold text-white">Predict Your Rank</h2>
        </div>

        {/* Exam Selector */}
        <div className="space-y-3 mb-8">
          <label className="block text-white font-medium">Select Exam</label>
          <div className="flex flex-wrap gap-3">
            {(['JEE Mains', 'JEE Advanced', 'NEET'] as ExamType[]).map(e => (
              <button
                key={e}
                onClick={() => handleExamChange(e)}
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all border ${
                  exam === e
                    ? 'border-[#4285f4] text-[#4285f4]'
                    : 'border-[#2a2a2a] text-gray-400 hover:border-gray-500'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Marks Slider */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center justify-between">
            <label className="text-white font-medium">Expected Marks</label>
            <span className="text-gray-400 text-sm">{percentage}% of total</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 flex items-center h-2 bg-[#2a2a2a] rounded-full">
              <input
                type="range"
                min="0"
                max={maxMarks}
                step="1"
                value={marks}
                onChange={e => setMarks(Number(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(marks / maxMarks) * 100}%`, backgroundColor: prediction.color }}
              />
              <div
                className="w-4 h-4 rounded-full shadow absolute -ml-2 pointer-events-none transition-all"
                style={{ left: `${(marks / maxMarks) * 100}%`, backgroundColor: prediction.color }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={marks}
                onChange={e => {
                  let val = Number(e.target.value);
                  if (val > maxMarks) val = maxMarks;
                  if (val < 0) val = 0;
                  setMarks(val);
                }}
                className="w-20 bg-transparent border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-[#4285f4] transition-colors"
              />
              <span className="text-gray-500 font-medium">/ {maxMarks}</span>
            </div>
          </div>
        </div>

        {/* Result Panel */}
        <div className="rounded-2xl border p-6 mb-6 transition-all duration-300" style={{ borderColor: prediction.color + '40', background: prediction.color + '10' }}>
          <div className="flex items-start gap-4">
            <TrendingUp className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: prediction.color }} />
            <div className="flex-1">
              <div className="text-sm font-medium mb-1" style={{ color: prediction.color }}>
                {prediction.label}
              </div>
              <div className="text-3xl font-black text-white font-heading mb-4">
                AIR: {prediction.rank}
              </div>
              {exam !== 'JEE Advanced' && (
                <div className="text-lg font-bold text-white/70">
                  Percentile: {prediction.percentile}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rank Table */}
        <div className="rounded-2xl border border-[#2a2a2a] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2a2a2a]">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Score → Rank Reference (2024 Trends)</span>
          </div>
          <div className="divide-y divide-[#1e1e1e]">
            {RANK_DATA[exam].map((row, i) => (
              <div
                key={i}
                className={`flex items-center px-4 py-3 gap-4 transition-colors ${marks >= row.min && marks <= row.max ? 'bg-white/5' : ''}`}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }} />
                <div className="w-20 text-sm font-medium text-white">
                  {row.min}–{row.max === 720 || row.max === 300 || row.max === 360 ? row.max : row.max}
                </div>
                <div className="flex-1 text-sm text-gray-400">{row.label}</div>
                <div className="text-sm font-bold text-white text-right">{row.rank}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-gray-600 mt-5 text-center">
          * Based on 2024–25 actual cutoff trends. Real ranks vary by year, category, difficulty & candidate count.
        </p>
      </div>
    </div>
  );
};
