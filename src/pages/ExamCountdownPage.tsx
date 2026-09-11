import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, CalendarClock, Info, Edit3, Check } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const DEFAULT_EXAMS = [
  {
    id: 'jee-mains',
    name: 'JEE Mains 2026',
    defaultDate: '2026-01-24T09:00',
    eligibility: 'Class 12 passed or appearing with PCM. Maximum 3 consecutive attempts. No age limit.',
    subjects: 'Physics, Chemistry, Mathematics — Total 300 Marks. 90 questions (MCQ + Numerical).',
    conductor: 'Conducted by NTA (National Testing Agency)',
    color: '#4285f4',
  },
  {
    id: 'neet',
    name: 'NEET-UG 2026',
    defaultDate: '2026-05-03T14:00',
    eligibility: 'Class 12 passed/appearing with PCB. Min 50% in PCB (40% for reserved). Min age 17 years.',
    subjects: 'Physics, Chemistry, Biology (Botany + Zoology) — Total 720 Marks. 200 questions (180 to attempt).',
    conductor: 'Conducted by NTA (National Testing Agency)',
    color: '#34a853',
  },
  {
    id: 'jee-advanced',
    name: 'JEE Advanced 2026',
    defaultDate: '2026-05-24T09:00',
    eligibility: 'Top 2,50,000 JEE Main qualifiers. Must be in top 20 percentile of Class 12 board. Max 2 consecutive attempts.',
    subjects: 'Physics, Chemistry, Mathematics — Two papers of 3 hrs each. Complex marking scheme (Full/Partial/Zero).',
    conductor: 'Conducted by IITs (rotating — IIT Roorkee in 2024, IIT Kanpur in 2025)',
    color: '#ea4335',
  },
];

export const ExamCountdownPage: React.FC = () => {
  const { setCurrentRoute } = useApp();
  const [activeExamId, setActiveExamId] = useState('jee-mains');
  const [customDates, setCustomDates] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('cosmic_exam_dates_v1');
    if (saved) return JSON.parse(saved);
    const defaults: Record<string, string> = {};
    DEFAULT_EXAMS.forEach(e => { defaults[e.id] = e.defaultDate; });
    return defaults;
  });
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const activeExam = DEFAULT_EXAMS.find(e => e.id === activeExamId)!;
  const targetDate = new Date(customDates[activeExamId] ?? activeExam.defaultDate);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [activeExamId, customDates]);

  const saveDate = (examId: string, dateStr: string) => {
    const updated = { ...customDates, [examId]: dateStr };
    setCustomDates(updated);
    localStorage.setItem('cosmic_exam_dates_v1', JSON.stringify(updated));
    setEditingExamId(null);
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentRoute('tools')}
          className="w-10 h-10 rounded-2xl bg-[var(--bg-surface-secondary)] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold font-heading bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Exam Countdown
        </h1>
      </div>

      <div className="bg-[#111111] border border-[#2a2a2a] rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 blur-[100px] rounded-full pointer-events-none opacity-20 transition-colors duration-700"
          style={{ backgroundColor: activeExam.color }}
        />

        <div className="flex items-center gap-3 mb-8 relative z-10">
          <CalendarClock className="w-7 h-7 text-white" />
          <h2 className="text-2xl font-bold text-white">2026 Exam Target</h2>
        </div>

        {/* Exam Tabs */}
        <div className="flex flex-wrap gap-3 mb-10 relative z-10">
          {DEFAULT_EXAMS.map(exam => (
            <button
              key={exam.id}
              onClick={() => { setActiveExamId(exam.id); setEditingExamId(null); }}
              className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border ${
                activeExamId === exam.id
                  ? 'text-white'
                  : 'border-[#2a2a2a] text-gray-400 hover:border-gray-500 hover:text-gray-300'
              }`}
              style={activeExamId === exam.id ? { borderColor: exam.color, boxShadow: `0 0 15px ${exam.color}40` } : {}}
            >
              {exam.name}
            </button>
          ))}
        </div>

        {/* Countdown Flip Clock */}
        <div className="flex justify-center gap-4 sm:gap-8 mb-10 relative z-10">
          {[
            { label: 'Days',    value: pad(timeLeft.days) },
            { label: 'Hours',   value: pad(timeLeft.hours) },
            { label: 'Minutes', value: pad(timeLeft.minutes) },
            { label: 'Seconds', value: pad(timeLeft.seconds) },
          ].map(unit => (
            <div key={unit.label} className="flex flex-col items-center">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl sm:rounded-3xl w-16 h-20 sm:w-28 sm:h-32 flex items-center justify-center relative overflow-hidden mb-3">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/50 z-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent z-10" />
                <span className="text-3xl sm:text-6xl font-black font-heading text-white tracking-tighter z-30">
                  {unit.value}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">{unit.label}</span>
            </div>
          ))}
        </div>

        {/* Custom Date Editor */}
        <div className="flex items-center justify-center mb-10 relative z-10">
          {editingExamId === activeExamId ? (
            <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3">
              <input
                type="datetime-local"
                defaultValue={customDates[activeExamId] ?? activeExam.defaultDate}
                id="custom-exam-date"
                className="bg-transparent text-white text-sm focus:outline-none"
              />
              <button
                onClick={() => {
                  const el = document.getElementById('custom-exam-date') as HTMLInputElement;
                  if (el?.value) saveDate(activeExamId, el.value);
                }}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: activeExam.color }}
              >
                <Check className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingExamId(activeExamId)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#2a2a2a] text-gray-400 text-sm hover:border-gray-500 hover:text-white transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Set Custom Date
            </button>
          )}
        </div>

        {/* Exam Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 pt-6 border-t border-[#2a2a2a]">
          <div className="bg-[#161616] rounded-2xl p-5 border border-[#222]">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-gray-400" />
              <h3 className="text-white font-bold">Eligibility</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{activeExam.eligibility}</p>
          </div>

          <div className="bg-[#161616] rounded-2xl p-5 border border-[#222]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              </div>
              <h3 className="text-white font-bold">Subjects & Pattern</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{activeExam.subjects}</p>
          </div>

          <div className="bg-[#161616] rounded-2xl p-5 border border-[#222]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-sm border-2 border-gray-400" />
              <h3 className="text-white font-bold">Authority</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{activeExam.conductor}</p>
          </div>
        </div>

        <p className="text-[10px] text-gray-600 mt-6 text-center relative z-10">
          * Default dates are based on historical patterns. Use "Set Custom Date" to enter the officially confirmed date.
        </p>
      </div>
    </div>
  );
};
