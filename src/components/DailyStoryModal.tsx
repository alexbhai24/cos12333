import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Video, FileText, Sparkles } from 'lucide-react';
import { DailyQuestion, SubjectKey } from '../types/dailyStatus';
import { MathFormattedText } from './MathFormattedText';

interface DailyStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: SubjectKey;
  questions: DailyQuestion[];
  userAnswers: Record<string, number>;
  onAnswer: (subject: SubjectKey, questionId: string, optionIndex: number) => void;
}

export const DailyStoryModal: React.FC<DailyStoryModalProps> = ({
  isOpen,
  onClose,
  subject,
  questions,
  userAnswers,
  onAnswer
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'text' | 'video'>('text');

  // Prevent background page scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const selectedOption = currentQ ? userAnswers[currentQ.id] : undefined;
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && selectedOption === currentQ?.correctIndex;

  const handleOptionClick = (idx: number) => {
    if (isAnswered || !currentQ) return;
    onAnswer(subject, currentQ.id, idx);
  };

  const getSymbolForDay = (symbols: string[]) => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return symbols[dayOfYear % symbols.length];
  };

  const subjectTitles: Record<SubjectKey, { title: string; color: string; icon: string }> = {
    nta_q: { title: 'NTA_Q (NTA Questions)', color: 'text-amber-400', icon: getSymbolForDay(['💉', '🩺', '🩹']) },
    physics: { title: 'Physics', color: 'text-rose-400', icon: getSymbolForDay(['🧲', '🔭']) },
    chemistry: { title: 'Chemistry', color: 'text-cyan-400', icon: getSymbolForDay(['🧪', '⚗️', '💊']) },
    biology: { title: 'Biology', color: 'text-emerald-400', icon: getSymbolForDay(['🧫', '🧬', '🫀']) },
    mathematics: { title: 'Mathematics', color: 'text-purple-400', icon: getSymbolForDay(['🧮', '📐', '📏', '➕']) }
  };

  const currentSubInfo = subjectTitles[subject] || { title: subject, color: 'text-cyan-400', icon: '⚡' };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      {/* Container Phone / Story Layout */}
      <div className="relative w-full max-w-lg bg-[#0e121e] border border-white/10 rounded-3xl sm:rounded-[32px] p-4 sm:p-6 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[88vh] my-auto overflow-hidden">
        
        {/* Top Header Area (Fixed) */}
        <div className="shrink-0 space-y-3 pb-2 border-b border-white/5">
          {/* Top Story Segmented Progress Bar */}
          <div className="flex items-center gap-1.5 w-full">
            {questions.map((q, idx) => {
              const answered = userAnswers[q.id] !== undefined;
              return (
                <div
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className="h-1.5 flex-1 rounded-full cursor-pointer transition-all duration-300 overflow-hidden bg-white/15"
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'bg-cyan-400'
                        : answered
                        ? 'bg-emerald-400'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Header Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg">
                {currentSubInfo.icon}
              </div>
              <div>
                <h3 className={`text-base font-extrabold ${currentSubInfo.color} font-heading leading-none flex items-center gap-1.5`}>
                  <span>{currentSubInfo.title}</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                  Question {currentIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Text & Options & Solution Scroll Area (Scrolls smoothly inside card) */}
        {currentQ ? (
          <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar space-y-4 py-3 min-h-0">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white leading-relaxed">
              <MathFormattedText text={currentQ.questionText} />

              {currentQ.questionImageUrl && (
                <img
                  src={currentQ.questionImageUrl}
                  alt="Question Diagram"
                  className="mt-3 rounded-xl max-h-48 object-contain border border-white/10 mx-auto"
                />
              )}
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((optionText, optIdx) => {
                const letter = ['A', 'B', 'C', 'D'][optIdx];
                const isThisSelected = selectedOption === optIdx;
                const isThisCorrect = optIdx === currentQ.correctIndex;

                let stateStyle = 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-cyan-400/40';

                if (isAnswered) {
                  if (isThisCorrect) {
                    stateStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold';
                  } else if (isThisSelected && !isThisCorrect) {
                    stateStyle = 'bg-rose-500/15 border-rose-500/50 text-rose-300 font-bold';
                  } else {
                    stateStyle = 'bg-white/5 border-white/5 text-gray-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(optIdx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-200 flex items-center justify-between gap-3 ${stateStyle} ${
                      !isAnswered ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-black shrink-0">
                        {letter}
                      </span>
                      <MathFormattedText text={optionText} />
                    </div>

                    {isAnswered && isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isThisSelected && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Callout Banner */}
            {isAnswered && (
              <div
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center space-x-2 ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Correct! Excellent problem solving 🎉 (+5 🍏)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>
                      Incorrect — correct answer is {['A', 'B', 'C', 'D'][currentQ.correctIndex]}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Solution & Explanation Block */}
            {isAnswered && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3 animate-in fade-in duration-300">
                {/* Solution Toggle Tabs */}
                <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-xl gap-1">
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                      activeTab === 'text'
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/30'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Text Solution</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('video')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                      activeTab === 'video'
                        ? 'bg-purple-500/25 text-purple-300 border border-purple-500/30'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Solution</span>
                  </button>
                </div>

                {/* Text Solution */}
                {activeTab === 'text' && (
                  <div className="space-y-2 text-xs text-gray-300">
                    <h4 className="font-extrabold text-white uppercase text-[10px] tracking-wider text-cyan-400">
                      Explanation:
                    </h4>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 leading-relaxed text-xs overflow-x-auto max-w-full">
                      <MathFormattedText text={currentQ.explanation} block />
                    </div>
                  </div>
                )}

                {/* Video Solution */}
                {activeTab === 'video' && (
                  <div className="space-y-2 text-xs text-gray-300 text-center py-2">
                    {currentQ.videoSolutionUrl ? (
                      <a
                        href={currentQ.videoSolutionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold rounded-xl transition-all"
                      >
                        <Video className="w-4 h-4" />
                        <span>Watch Step-by-Step Video Solution</span>
                      </a>
                    ) : (
                      <p className="text-gray-400 italic">Video solution coming soon for this question!</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-400 italic">
            No questions available for this status category yet.
          </div>
        )}

        {/* Footer Navigation Controls (Fixed) */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 shrink-0 mt-auto">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 rounded-xl text-xs font-bold text-gray-300 transition-all flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(p => Math.min(questions.length - 1, p + 1))}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-xl text-xs transition-all flex items-center space-x-1 shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold rounded-xl text-xs transition-all flex items-center space-x-1 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <span>Done 🍏</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
