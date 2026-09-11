import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Calendar as CalendarIcon, Trash2, Plus } from 'lucide-react';

export const StudyTimeTrackerPage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  const [exam, setExam] = useState('CBSE 12 (Science)');
  const [dailyHours, setDailyHours] = useState(6);
  const [subjects, setSubjects] = useState([
    { id: '1', name: 'Physics', hours: 6 },
    { id: '2', name: 'Chemistry', hours: 6 },
    { id: '3', name: 'Biology', hours: 6 },
    { id: '4', name: 'Mock Tests', hours: 6 },
    { id: '5', name: 'Revision', hours: 6 },
  ]);

  const exams = ['CBSE Class 10', 'CBSE 12 (Science)', 'CBSE 12 (Bio)', 'JEE Main', 'NEET', 'CUET', 'Custom'];

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now().toString(), name: '', hours: 0 }]);
  };

  const updateSubject = (id: string, field: 'name' | 'hours', value: string | number) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const totalAllocated = subjects.reduce((sum, s) => sum + Number(s.hours || 0), 0);
  const totalAvailable = dailyHours * 7;

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setCurrentRoute('tools')}
          className="w-10 h-10 rounded-2xl bg-[var(--bg-surface-secondary)] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Study Time Tracker
          </h1>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 relative">
        <div className="flex items-center gap-3 mb-8">
          <CalendarIcon className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">Create Your Study Plan</h2>
        </div>

        {/* Exam / Board */}
        <div className="space-y-4 mb-8">
          <label className="block text-white font-medium">Exam / Board</label>
          <div className="flex flex-wrap gap-3">
            {exams.map(e => (
              <button
                key={e}
                onClick={() => setExam(e)}
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors border ${
                  exam === e 
                    ? 'bg-transparent border-white text-white' 
                    : 'bg-transparent border-[#2a2a2a] text-gray-400 hover:border-gray-500'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Study Hours */}
        <div className="space-y-4 mb-8">
          <label className="block text-white font-medium">Daily Study Hours</label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 flex items-center h-2 bg-[#2a2a2a] rounded-full">
              <input 
                type="range"
                min="1"
                max="16"
                step="1"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              <div 
                className="h-full bg-blue-300 rounded-full"
                style={{ width: `${(dailyHours / 16) * 100}%` }}
              ></div>
              <div 
                className="w-4 h-4 bg-blue-300 rounded-full shadow absolute -ml-2 pointer-events-none"
                style={{ left: `${(dailyHours / 16) * 100}%` }}
              ></div>
            </div>
            <div className="w-14 text-center py-2 px-3 border border-white rounded-2xl text-white font-bold text-sm">
              {dailyHours}h
            </div>
          </div>
        </div>

        {/* Subjects & Weekly Hours */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <label className="block text-white font-medium">Subjects & Weekly Hours</label>
            <button 
              onClick={addSubject}
              className="text-white text-sm font-medium flex items-center gap-1 hover:text-blue-300 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          </div>

          <div className="space-y-3">
            {subjects.map(sub => (
              <div key={sub.id} className="flex items-center gap-3">
                <input 
                  type="text"
                  value={sub.name}
                  onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                  className="flex-1 bg-transparent border border-[#2a2a2a] rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                  placeholder="Subject Name"
                />
                <input 
                  type="number"
                  value={sub.hours}
                  onChange={(e) => updateSubject(sub.id, 'hours', Number(e.target.value))}
                  className="w-16 bg-transparent border border-[#2a2a2a] rounded-2xl px-3 py-3 text-white text-center focus:outline-none focus:border-white transition-colors"
                  min="0"
                />
                <span className="text-gray-400 text-sm whitespace-nowrap">h/wk</span>
                <button 
                  onClick={() => removeSubject(sub.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-400 flex items-center gap-2 pt-2">
            <InfoIcon />
            Total weekly hours allocated: {totalAllocated}h (available: {totalAvailable}h)
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button className="text-white font-bold hover:text-gray-300 transition-colors text-lg">
            Generate Study Plan
          </button>
        </div>

      </div>
    </div>
  );
};

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
