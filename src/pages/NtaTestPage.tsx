import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, Check, Bookmark, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

// --- Types ---
type QType = 'mcq' | 'image' | 'match' | 'assertion' | 'statement' | 'graphical';
type QStatus = 'not_visited' | 'not_answered' | 'answered' | 'marked' | 'answered_marked';

interface QuestionOption { text: string; imageUrl?: string; }
interface MatchMapping { left: string; right: string; }

interface Question {
  id: string;
  exam: string;
  subjectName: string;
  qType: QType;
  questionText: string;
  questionImageUrl?: string;
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
  correctIndex: number;
  statementA?: string;
  statementB?: string;
  matchLeft?: [string, string, string, string];
  matchRight?: [string, string, string, string];
}

// --- Mock Data ---
// In the future this will be fetched from localStorage based on the test ID
const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    exam: 'neet',
    subjectName: 'Botany',
    qType: 'mcq',
    questionText: 'Which type of tissue is found in inner lining of blood vessels?',
    options: [
      { text: 'Collagen fibres' },
      { text: 'Columnar epithelium' },
      { text: 'Squamous epithelium' },
      { text: 'Areolar connective tissue' }
    ],
    correctIndex: 2
  },
  {
    id: 'q2',
    exam: 'neet',
    subjectName: 'Botany',
    qType: 'match',
    questionText: 'Match List I and List II:',
    matchLeft: ["Down's syndrome", "α-Thalassemia", "β-Thalassemia", "Klinefelter's syndrome"],
    matchRight: ["21st chromosome", "16th chromosome", "11th chromosome", "'X' chromosome"],
    options: [
      { text: 'A-II, B-III, C-IV, D-I' },
      { text: 'A-III, B-IV, C-I, D-II' },
      { text: 'A-IV, B-I, C-II, D-III' },
      { text: 'A-I, B-II, C-III, D-IV' }
    ],
    correctIndex: 3
  },
  {
    id: 'q3',
    exam: 'neet',
    subjectName: 'Zoology',
    qType: 'mcq',
    questionText: 'All traits can express themselves in heterozygous condition, except',
    options: [
      { text: 'Tall' },
      { text: 'Violet' },
      { text: 'Axial' },
      { text: 'Wrinkled seed' }
    ],
    correctIndex: 3
  }
];

export const NtaTestPage: React.FC = () => {
  const { setCurrentRoute } = useApp();
  
  // State
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [statuses, setStatuses] = useState<Record<string, QStatus>>({});
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeQuestion = questions[currentIndex];
  
  // Group by subjects for tabs
  const subjects = Array.from(new Set(questions.map(q => q.subjectName)));
  const activeSubject = activeQuestion?.subjectName;

  useEffect(() => {
    // Initial load: Set all as not visited, except first as not answered
    const initialStatuses: Record<string, QStatus> = {};
    questions.forEach((q, i) => {
      initialStatuses[q.id] = i === 0 ? 'not_answered' : 'not_visited';
    });
    setStatuses(initialStatuses);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getStatusCounts = () => {
    let counts = { answered: 0, not_answered: 0, not_visited: 0, marked: 0, answered_marked: 0 };
    Object.values(statuses).forEach(s => {
      if (s === 'answered') counts.answered++;
      else if (s === 'not_answered') counts.not_answered++;
      else if (s === 'not_visited') counts.not_visited++;
      else if (s === 'marked') counts.marked++;
      else if (s === 'answered_marked') counts.answered_marked++;
    });
    return counts;
  };

  const updateStatus = (index: number, newStatus: QStatus) => {
    const q = questions[index];
    if (!q) return;
    setStatuses(prev => ({ ...prev, [q.id]: newStatus }));
  };

  const jumpTo = (index: number) => {
    // Current question becomes not_answered if it was not_visited
    if (statuses[activeQuestion.id] === 'not_visited') {
      updateStatus(currentIndex, 'not_answered');
    }
    
    // Target question becomes not_answered if it was not_visited
    if (statuses[questions[index].id] === 'not_visited' || !statuses[questions[index].id]) {
      updateStatus(index, 'not_answered');
    }
    
    setCurrentIndex(index);
    setIsDrawerOpen(false); // Auto close mobile drawer
  };

  // --- Handlers ---
  const handleSelectOption = (optIndex: number) => {
    setAnswers(prev => ({ ...prev, [activeQuestion.id]: optIndex }));
  };

  const handleClear = () => {
    const newAnswers = { ...answers };
    delete newAnswers[activeQuestion.id];
    setAnswers(newAnswers);
  };

  const handleSaveAndNext = () => {
    const hasAnswer = answers[activeQuestion.id] !== undefined;
    updateStatus(currentIndex, hasAnswer ? 'answered' : 'not_answered');
    if (currentIndex < questions.length - 1) {
      jumpTo(currentIndex + 1);
    }
  };

  const handleSaveAndMarkReview = () => {
    const hasAnswer = answers[activeQuestion.id] !== undefined;
    if (hasAnswer) {
      updateStatus(currentIndex, 'answered_marked');
    } else {
      updateStatus(currentIndex, 'marked');
    }
    // Doesn't strictly move to next in some engines, but NTA usually does or stays
  };

  const handleMarkReviewAndNext = () => {
    const hasAnswer = answers[activeQuestion.id] !== undefined;
    updateStatus(currentIndex, hasAnswer ? 'answered_marked' : 'marked');
    if (currentIndex < questions.length - 1) {
      jumpTo(currentIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit the test?")) {
      setIsSubmitted(true);
      alert("Test submitted successfully!");
      setCurrentRoute('mock-tests');
    }
  };

  // --- Render Helpers ---
  const renderPaletteButton = (idx: number) => {
    const q = questions[idx];
    const status = statuses[q.id] || 'not_visited';
    
    let bg = 'bg-[#d6d6d6] text-black'; // not visited
    if (status === 'answered') bg = 'bg-[#4ade80] text-black';
    else if (status === 'not_answered') bg = 'bg-[#ef4444] text-white';
    else if (status === 'marked') bg = 'bg-[#a855f7] text-white';
    else if (status === 'answered_marked') bg = 'bg-[#a855f7] text-white relative after:content-[""] after:absolute after:bottom-1 after:right-1 after:w-2 after:h-2 after:bg-[#4ade80] after:rounded-full';

    return (
      <button 
        key={q.id}
        onClick={() => jumpTo(idx)}
        className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-sm rounded ${bg} ${currentIndex === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1c1f2e]' : ''} transition-all`}
        style={{
           clipPath: status === 'answered' ? 'polygon(50% 0%, 100% 25%, 100% 100%, 0 100%, 0% 25%)' 
                     : status === 'not_answered' ? 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)'
                     : status === 'marked' || status === 'answered_marked' ? 'circle(50% at 50% 50%)'
                     : 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' // square for not visited
        }}
      >
        {idx + 1}
      </button>
    );
  };

  if (isSubmitted) return <div className="p-10 text-white text-center">Test Submitted. Redirecting...</div>;

  return (
    <div className="min-h-screen bg-[#1c1f2e] text-white/90 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="bg-[#232736] border-b border-white/5 px-4 py-2 sm:py-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/10 items-center justify-center">
            <span className="font-bold text-sm">RS</span>
          </div>
          <div className="text-xs sm:text-sm">
            <div className="font-semibold text-white truncate max-w-[150px] sm:max-w-xs">Candidate Name : Rajan Singh</div>
            <div className="text-white/60 truncate max-w-[150px] sm:max-w-xs">Test Name : Mock Test 01</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Remaining Time</span>
            <span className="text-sm sm:text-lg font-mono font-bold text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">{formatTime(timeLeft)}</span>
          </div>
          <button className="hidden sm:block text-xs text-white/60 hover:text-white border border-white/10 px-3 py-1.5 rounded bg-white/5">
            View Instructions
          </button>
        </div>
      </header>

      {/* Sections Bar (Desktop) */}
      <div className="hidden sm:flex bg-[#1c1f2e] border-b border-white/5 px-4 overflow-x-auto">
        {subjects.map(sub => (
          <button 
            key={sub}
            onClick={() => {
              const idx = questions.findIndex(q => q.subjectName === sub);
              if (idx !== -1) jumpTo(idx);
            }}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeSubject === sub ? 'border-indigo-500 text-indigo-400 bg-white/5' : 'border-transparent text-white/60 hover:bg-white/5'}`}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left/Main Column - Question Area */}
        <main className="flex-1 flex flex-col relative min-w-0">
          
          {/* Mobile Top Bar: Sections & Timer duplicate if needed, or Palette Slider */}
          <div className="sm:hidden bg-[#232736] border-b border-white/5 p-2 flex justify-between items-center shrink-0">
             <div className="text-sm font-bold text-indigo-400">{activeSubject}</div>
             <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded text-xs font-medium border border-white/10">
               <Menu className="w-3.5 h-3.5" /> All Questions
             </button>
          </div>

          {/* Horizontal Mobile Palette (Optional but requested) */}
          <div className="sm:hidden flex overflow-x-auto gap-2 p-2 bg-[#1c1f2e] border-b border-white/5 shrink-0">
             {questions.map((_, i) => (
               <div key={i} className="shrink-0">{renderPaletteButton(i)}</div>
             ))}
          </div>

          {/* Question Meta */}
          <div className="p-4 flex items-center justify-between border-b border-white/5 shrink-0 bg-[#1c1f2e]">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold">Question {currentIndex + 1}:</h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full border border-green-500/30 text-green-400 bg-green-500/10">Marks: +4 -1</span>
                <span className="px-2 py-0.5 rounded-full border border-white/10 text-white/70 bg-white/5">Type: Single</span>
              </div>
            </div>
            <div className="hidden sm:block text-sm text-white/50">English</div>
          </div>

          {/* Question Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="text-base sm:text-lg leading-relaxed">
              {activeQuestion?.questionText}
            </div>

            {activeQuestion?.qType === 'match' && (
              <div className="overflow-x-auto border border-white/10 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#232736] border-b border-white/10">
                    <tr><th className="p-3">List I</th><th className="p-3 border-l border-white/10">List II</th></tr>
                  </thead>
                  <tbody>
                    {activeQuestion.matchLeft?.map((l, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="p-3">{['A','B','C','D'][i]}. {l}</td>
                        <td className="p-3 border-l border-white/10">{['I','II','III','IV'][i]}. {activeQuestion.matchRight?.[i]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3 pt-4">
              {activeQuestion?.options.map((opt, i) => (
                <label 
                  key={i} 
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer ${answers[activeQuestion.id] === i ? 'bg-[#2a3045] border-indigo-500/50' : 'bg-[#232736] border-white/5 hover:border-white/20'}`}
                >
                  <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${answers[activeQuestion.id] === i ? 'border-indigo-400 bg-indigo-500/20' : 'border-white/30'}`}>
                    {answers[activeQuestion.id] === i && <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>}
                  </div>
                  <div className="flex-1">
                    <span className="font-mono text-white/50 mr-3">{i + 1}</span>
                    {opt.text}
                  </div>
                </label>
              ))}
            </div>

            {/* Mobile "Mark for review" inline */}
            <div className="sm:hidden flex justify-center py-4">
               <label className="flex items-center gap-2 text-sm text-white/70">
                 <input 
                   type="checkbox" 
                   checked={statuses[activeQuestion.id] === 'marked' || statuses[activeQuestion.id] === 'answered_marked'}
                   onChange={() => {
                      const hasAns = answers[activeQuestion.id] !== undefined;
                      const isMarked = statuses[activeQuestion.id] === 'marked' || statuses[activeQuestion.id] === 'answered_marked';
                      if (isMarked) {
                        updateStatus(currentIndex, hasAns ? 'answered' : 'not_answered');
                      } else {
                        updateStatus(currentIndex, hasAns ? 'answered_marked' : 'marked');
                      }
                   }}
                   className="rounded bg-black/50 border-white/20 text-indigo-500" 
                 />
                 Mark for Review
               </label>
            </div>
          </div>

          {/* Action Bar (Desktop & Mobile) */}
          <div className="bg-[#232736] border-t border-white/5 p-3 sm:p-4 shrink-0 flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={handleSaveAndNext} className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 rounded text-xs sm:text-sm font-bold bg-[#22c55e] hover:bg-[#16a34a] text-black transition-colors">
                SAVE & NEXT
              </button>
              <button onClick={handleClear} className="px-4 py-2 sm:py-2.5 rounded text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white transition-colors">
                CLEAR
              </button>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <button onClick={handleSaveAndMarkReview} className="hidden sm:block flex-1 sm:flex-none px-4 py-2 sm:py-2.5 rounded text-xs sm:text-sm font-bold bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors">
                SAVE & MARK FOR REVIEW
              </button>
              <button onClick={handleMarkReviewAndNext} className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 rounded text-xs sm:text-sm font-bold bg-[#eab308] hover:bg-[#ca8a04] text-black transition-colors">
                MARK FOR REVIEW & NEXT
              </button>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 ml-auto">
              <button onClick={() => jumpTo(Math.max(0, currentIndex - 1))} className="px-4 py-2.5 rounded text-sm font-bold bg-[#1c1f2e] border border-white/10 text-white/70 hover:text-white transition-colors">
                &lt; BACK
              </button>
              <button onClick={() => jumpTo(Math.min(questions.length - 1, currentIndex + 1))} className="px-4 py-2.5 rounded text-sm font-bold bg-[#1c1f2e] border border-white/10 text-white/70 hover:text-white transition-colors">
                NEXT &gt;
              </button>
              <button onClick={handleSubmit} className="ml-4 px-6 py-2.5 rounded text-sm font-bold bg-[#10b981] hover:bg-[#059669] text-white transition-colors">
                SUBMIT
              </button>
            </div>
          </div>
        </main>

        {/* Right Column - Palette (Desktop) */}
        <aside className="hidden sm:flex w-80 bg-[#232736] border-l border-white/5 flex-col shrink-0">
          
          {/* Status Legend */}
          <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-2 border-b border-white/5 text-xs text-white/80">
            {(() => {
              const counts = getStatusCounts();
              return (
                <>
                  <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#4ade80] rounded flex items-center justify-center text-black font-bold text-[10px] shadow-sm" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 100%, 0 100%, 0% 25%)'}}>{counts.answered}</div> Answered</div>
                  <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#ef4444] rounded flex items-center justify-center text-white font-bold text-[10px] shadow-sm" style={{clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)'}}>{counts.not_answered}</div> Not Answered</div>
                  <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#d6d6d6] rounded flex items-center justify-center text-black font-bold text-[10px] shadow-sm">{counts.not_visited}</div> Not Visited</div>
                  <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#a855f7] rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-sm">{counts.marked}</div> Mark for review</div>
                  <div className="flex items-center gap-2 col-span-2 mt-1">
                    <div className="w-5 h-5 bg-[#a855f7] rounded-full relative flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-sm">
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#4ade80] rounded-full"></div>
                      {counts.answered_marked}
                    </div> 
                    <span className="leading-tight">Answered & Marked for Revision (will be considered for evaluation)</span>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="bg-[#1c1f2e] text-center py-2 border-b border-white/5 text-sm font-semibold">
            {activeSubject}
          </div>

          {/* Palette Grid */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-wrap gap-2 content-start">
            {questions.map((_, i) => renderPaletteButton(i))}
          </div>

        </aside>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative ml-auto w-[85%] max-w-sm bg-[#232736] h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
            
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <h2 className="font-bold text-lg">All Questions</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-4 border-b border-white/5">
              <div className="bg-[#1c1f2e] rounded-lg border border-white/10 p-3 text-center font-bold text-sm">
                {activeSubject}
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-white/80 bg-[#1c1f2e] mx-4 rounded-lg border border-white/5 mb-4">
              {(() => {
                const counts = getStatusCounts();
                return (
                  <>
                    <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#4ade80] rounded flex items-center justify-center text-black font-bold text-[10px]" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 100%, 0 100%, 0% 25%)'}}>{counts.answered}</div> Answered</div>
                    <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#ef4444] rounded flex items-center justify-center text-white font-bold text-[10px]" style={{clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)'}}>{counts.not_answered}</div> Not Answered</div>
                    <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#a855f7] rounded-full flex items-center justify-center text-white font-bold text-[10px]">{counts.marked}</div> Marked</div>
                    <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#d6d6d6] rounded flex items-center justify-center text-black font-bold text-[10px]">{counts.not_visited}</div> Not Visited</div>
                  </>
                );
              })()}
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-wrap gap-2 content-start">
              {questions.map((_, i) => renderPaletteButton(i))}
            </div>

            <div className="p-4 border-t border-white/5">
              <button onClick={handleSubmit} className="w-full py-3 rounded-lg font-bold bg-[#10b981] text-white">SUBMIT EXAM</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
