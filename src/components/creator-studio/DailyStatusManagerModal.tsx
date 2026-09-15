import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Sparkles, SlidersHorizontal, BookOpen } from 'lucide-react';
import { DailyQuestion, SubjectKey } from '../../types/dailyStatus';
import { useDailyStatus } from '../../hooks/useDailyStatus';
import { MathFormattedText } from '../MathFormattedText';

interface DailyStatusManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyStatusManagerModal: React.FC<DailyStatusManagerModalProps> = ({ isOpen, onClose }) => {
  const { questionsMap, saveQuestionsMap } = useDailyStatus();
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>('physics');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, [isOpen]);

  // Form for adding new question
  const [showAddForm, setShowAddForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  if (!isOpen) return null;

  const currentQuestions = questionsMap[selectedSubject] || [];

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim() || !explanation.trim()) {
      alert('Please fill out question text, all 4 options, and explanation.');
      return;
    }

    const newQ: DailyQuestion = {
      id: `daily_${selectedSubject}_${Date.now()}`,
      subject: selectedSubject,
      questionText,
      options: [optA, optB, optC, optD],
      correctIndex: correctIdx,
      explanation,
      videoSolutionUrl: videoUrl
    };

    const updated = {
      ...questionsMap,
      [selectedSubject]: [...currentQuestions, newQ]
    };

    saveQuestionsMap(updated);

    // Reset form
    setQuestionText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectIdx(0);
    setExplanation('');
    setVideoUrl('');
    setShowAddForm(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (!confirm('Are you sure you want to remove this question from Daily Status?')) return;
    const updatedList = currentQuestions.filter(q => q.id !== id);
    saveQuestionsMap({
      ...questionsMap,
      [selectedSubject]: updatedList
    });
  };

  const subjects: { key: SubjectKey; label: string; icon: string }[] = [
    { key: 'physics', label: 'Physics', icon: '⚛️' },
    { key: 'chemistry', label: 'Chemistry', icon: '🧪' },
    { key: 'biology', label: 'Biology', icon: '🧫' },
    { key: 'mathematics', label: 'Mathematics', icon: '🧮' }
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#121626] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-heading">Manage "Question of the Day" Status</h2>
              <p className="text-xs text-gray-400">Add or edit active daily questions shown on the Home Page PCMB Status Bar</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subject Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {subjects.map(sub => (
            <button
              key={sub.key}
              onClick={() => {
                setSelectedSubject(sub.key);
                setShowAddForm(false);
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                selectedSubject === sub.key
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/25 font-extrabold'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{sub.icon}</span>
              <span>{sub.label}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/30 text-[10px] text-white">
                {(questionsMap[sub.key] || []).length}
              </span>
            </button>
          ))}
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>{selectedSubject.toUpperCase()} Active Questions</span>
          </h3>

          <button
            onClick={() => setShowAddForm(p => !p)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel Form' : 'Add Question to Status'}</span>
          </button>
        </div>

        {/* Add Question Form */}
        {showAddForm && (
          <form onSubmit={handleAddQuestion} className="p-5 bg-white/5 border border-cyan-500/30 rounded-2xl space-y-4 animate-in fade-in duration-200">
            <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
              Add New {selectedSubject.toUpperCase()} Status Question
            </h4>

            <div>
              <label className="block text-xs text-gray-400 font-bold mb-1">Question Text (Supports KaTeX LaTeX math formulas):</label>
              <textarea
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                placeholder="e.g. A body is thrown vertically upwards with speed u..."
                rows={3}
                className="w-full bg-[#181d30] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Option A', val: optA, setter: setOptA, idx: 0 },
                { label: 'Option B', val: optB, setter: setOptB, idx: 1 },
                { label: 'Option C', val: optC, setter: setOptC, idx: 2 },
                { label: 'Option D', val: optD, setter: setOptD, idx: 3 }
              ].map(opt => (
                <div key={opt.idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>{opt.label}</span>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        name="correctIdx"
                        checked={correctIdx === opt.idx}
                        onChange={() => setCorrectIdx(opt.idx)}
                        className="accent-emerald-400"
                      />
                      <span className={correctIdx === opt.idx ? 'text-emerald-400 font-bold' : ''}>Correct</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={opt.val}
                    onChange={e => opt.setter(e.target.value)}
                    placeholder={`Enter ${opt.label}...`}
                    className="w-full bg-[#181d30] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-bold mb-1">Step-by-Step Explanation:</label>
              <textarea
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                placeholder="Explain the solution steps..."
                rows={3}
                className="w-full bg-[#181d30] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-bold mb-1">Video Solution URL (Optional):</label>
              <input
                type="text"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full bg-[#181d30] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl transition-all shadow-lg active:scale-95"
            >
              Publish Question to {selectedSubject.toUpperCase()} Status Bar 🚀
            </button>
          </form>
        )}

        {/* List of Current Status Questions */}
        <div className="space-y-3">
          {currentQuestions.length === 0 ? (
            <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl text-xs text-gray-400">
              No questions assigned to {selectedSubject} status yet. Click "Add Question to Status" above!
            </div>
          ) : (
            currentQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start justify-between gap-4 hover:border-cyan-500/30 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                      Q #{idx + 1}
                    </span>
                    {q.topic && (
                      <span className="text-[11px] text-gray-400 font-semibold">{q.topic}</span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-white">
                    <MathFormattedText text={q.questionText} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-gray-400">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`px-2.5 py-1 rounded-lg border ${
                          oIdx === q.correctIndex
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                            : 'bg-white/5 border-white/5 text-gray-400'
                        }`}
                      >
                        {['A', 'B', 'C', 'D'][oIdx]}: <MathFormattedText text={opt} />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-all shrink-0"
                  title="Delete from status"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
