import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { Question } from '../../pages/CreatorPage';
import { SubjectKey, DailyQuestion } from '../../types/dailyStatus';
import { useDailyStatus } from '../../hooks/useDailyStatus';

interface AddToStatusModalProps {
  selectedQuestions: Question[];
  onClose: () => void;
  onSuccess: () => void;
}

export const AddToStatusModal: React.FC<AddToStatusModalProps> = ({
  selectedQuestions,
  onClose,
  onSuccess
}) => {
  const { questionsMap, saveQuestionsMap } = useDailyStatus();
  const [targetSubject, setTargetSubject] = useState<SubjectKey>('nta_q');

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, []);

  const channels: { key: SubjectKey; label: string; icon: string; color: string }[] = [
    { key: 'nta_q', label: 'NTA_Q (NTA Target)', icon: '🎯', color: 'text-amber-400' },
    { key: 'physics', label: 'Physics', icon: '⚛️', color: 'text-rose-400' },
    { key: 'chemistry', label: 'Chemistry', icon: '🧪', color: 'text-cyan-400' },
    { key: 'biology', label: 'Biology', icon: '🧫', color: 'text-emerald-400' },
    { key: 'mathematics', label: 'Mathematics', icon: '🧮', color: 'text-purple-400' }
  ];

  const handleConfirmAdd = () => {
    if (selectedQuestions.length === 0) return;

    const currentList = questionsMap[targetSubject] || [];

    const newDailyItems: DailyQuestion[] = selectedQuestions.map((q, idx) => {
      let optionTexts: [string, string, string, string] = ['', '', '', ''];
      if (Array.isArray(q.options)) {
        optionTexts = q.options.map(o => (typeof o === 'string' ? o : o.text || '')) as [string, string, string, string];
      }

      return {
        id: `daily_${q.id}_${Date.now()}_${idx}`,
        subject: targetSubject,
        questionText: q.questionText || '',
        questionImageUrl: q.questionImageUrl,
        options: optionTexts,
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
        explanation: q.solutionExplanation || q.explanation || 'Step-by-step solution provided.',
        videoSolutionUrl: q.videoSolutionUrl || q.videoSolution,
        topic: q.chapterTitle ? `${q.chapterTitle} • ${q.topicTitle}` : q.topicTitle,
        difficulty: (q.difficulty?.toUpperCase() as any) || 'MEDIUM'
      };
    });

    const updatedMap = {
      ...questionsMap,
      [targetSubject]: [...currentList, ...newDailyItems]
    };

    saveQuestionsMap(updatedMap);
    alert(`Successfully added ${selectedQuestions.length} question(s) to ${targetSubject.toUpperCase()} status! 🚀`);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121626] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-6 overflow-hidden">
        
        {/* Close button */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="text-base font-extrabold text-white font-heading">Add to Status Bar</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <p className="text-xs text-gray-300 leading-relaxed">
            You have selected <strong className="text-cyan-400">{selectedQuestions.length} question(s)</strong>. Select which status category to publish them to on the Home Page status bar:
          </p>
        </div>

        {/* Channel Selection Buttons */}
        <div className="space-y-2">
          {channels.map(ch => (
            <button
              key={ch.key}
              onClick={() => setTargetSubject(ch.key)}
              className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${
                targetSubject === ch.key
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{ch.icon}</span>
                <span className={ch.color}>{ch.label}</span>
              </div>

              {targetSubject === ch.key && (
                <Check className="w-5 h-5 text-cyan-400 shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 rounded-xl transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmAdd}
            className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish ({selectedQuestions.length}) 🚀</span>
          </button>
        </div>

      </div>
    </div>
  );
};
