import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, Save, Settings, ArrowRight, ArrowLeft, Palette, LayoutList, Plus, Trash2, Award } from 'lucide-react';
import { Question } from '../../pages/CreatorPage';
import { CustomTest, CustomTestSubjectBreakdown } from '../../types/creatorStudio';

interface TestBuilderModalProps {
  selectedQuestions: Question[];
  initialTitle?: string;
  onClose: () => void;
  onSave: (test: CustomTest) => void;
}

export const TestBuilderModal: React.FC<TestBuilderModalProps> = ({ selectedQuestions, initialTitle, onClose, onSave }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Basic
  const [title, setTitle] = useState(initialTitle || 'New Custom Test');
  const [duration, setDuration] = useState(Math.max(20, Math.min(195, Math.round(selectedQuestions.length * 1.5))));
  const [marksCorrect, setMarksCorrect] = useState(4);
  const [marksIncorrect, setMarksIncorrect] = useState(1);
  const [category, setCategory] = useState<'unit-test' | 'nbt' | 'full-mock'>('full-mock');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'STANDARD'>('STANDARD');
  const [exam, setExam] = useState<'neet' | 'jee'>(
    selectedQuestions.some(q => q.exam === 'jee') ? 'jee' : 'neet'
  );

  // Step 2: Card Customization
  const [subtitle, setSubtitle] = useState('Complete Class 11 & 12 · High-Yield Focus');
  const [watermarkText, setWatermarkText] = useState('#T01');
  const [maxCoins, setMaxCoins] = useState(540);
  const [themeColor, setThemeColor] = useState<'indigo'|'rose'|'emerald'|'amber'|'slate'>('indigo');

  // Step 3: Syllabus & Pattern
  const [syllabusSummary, setSyllabusSummary] = useState('Full Syllabus Grand Simulation');
  const [subjectBreakdown, setSubjectBreakdown] = useState<CustomTestSubjectBreakdown[]>(() => {
    const map: Record<string, number> = {};
    selectedQuestions.forEach(q => {
      const s = q.subjectName || 'General';
      map[s] = (map[s] || 0) + 1;
    });
    const arr = Object.entries(map).map(([subj, count]) => ({
      subject: subj,
      questions: count,
      marks: count * 4
    }));
    return arr.length > 0 ? arr : [
      { subject: 'Physics', questions: 45, marks: 180 },
      { subject: 'Chemistry', questions: 45, marks: 180 }
    ];
  });

  const handleAddSubject = () => {
    setSubjectBreakdown([...subjectBreakdown, { subject: 'New Subject', questions: 45, marks: 180 }]);
  };

  const handleUpdateSubject = (index: number, field: keyof CustomTestSubjectBreakdown, value: string | number) => {
    const updated = [...subjectBreakdown];
    updated[index] = { ...updated[index], [field]: value };
    setSubjectBreakdown(updated);
  };

  const handleRemoveSubject = (index: number) => {
    setSubjectBreakdown(subjectBreakdown.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Manually calculate total marks, or if they overridden in subjects? 
    // We'll trust the marksCorrect calculation for questions, but they can set the total manually if they want, 
    // actually let's calculate based on selectedQuestions so it's accurate to the content.
    const totalMarks = selectedQuestions.length * marksCorrect;
    const test: CustomTest = {
      id: `test_${Date.now()}`,
      title,
      exam,
      category,
      durationMins: duration,
      totalMarks,
      syllabusSummary,
      difficulty,
      createdAt: Date.now(),
      createdBy: 'creator',
      status: 'published',
      questions: selectedQuestions.map(q => ({
        ...q,
        id: q.id,
        marksCorrect,
        marksIncorrect
      })),
      subtitle,
      watermarkText,
      themeColor,
      maxCoins,
      subjectBreakdown
    };
    onSave(test);
  };

  const THEMES = [
    { id: 'indigo', label: 'Indigo / Default', color: '#6366f1' },
    { id: 'rose', label: 'Rose / Grand', color: '#f43f5e' },
    { id: 'emerald', label: 'Emerald / Fresh', color: '#10b981' },
    { id: 'amber', label: 'Amber / Bright', color: '#f59e0b' },
    { id: 'slate', label: 'Slate / Dark', color: '#64748b' }
  ] as const;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#131726] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 rounded-xl">
              {step === 1 ? <Settings className="w-5 h-5 text-cyan-400" /> : step === 2 ? <Palette className="w-5 h-5 text-cyan-400" /> : <LayoutList className="w-5 h-5 text-cyan-400" />}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {step === 1 && 'Step 1: Test Details'}
                {step === 2 && 'Step 2: Card Customization'}
                {step === 3 && 'Step 3: Syllabus & Pattern'}
              </h2>
              <p className="text-xs font-semibold text-white/50">{selectedQuestions.length} questions selected</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-1">
          <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {step === 1 && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Test Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. MISSION 30 : Grand Test 2" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold outline-none focus:border-cyan-400/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Exam Type</label>
                  <select value={exam} onChange={e => setExam(e.target.value as any)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold outline-none focus:border-cyan-400/50">
                    <option value="neet" className="bg-gray-900">NEET</option>
                    <option value="jee" className="bg-gray-900">JEE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Test Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold outline-none focus:border-cyan-400/50">
                    <option value="unit-test" className="bg-gray-900">Unit Test</option>
                    <option value="nbt" className="bg-gray-900">NBT (National Benchmarking)</option>
                    <option value="full-mock" className="bg-gray-900">Full Mock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Duration (mins)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value)||0)} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold outline-none focus:border-cyan-400/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Difficulty</label>
                  <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold outline-none focus:border-cyan-400/50">
                    <option value="STANDARD" className="bg-gray-900">Standard</option>
                    <option value="EASY" className="bg-gray-900">Easy</option>
                    <option value="MEDIUM" className="bg-gray-900">Medium</option>
                    <option value="HARD" className="bg-gray-900">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Marks for Correct (+)</label>
                  <input type="number" value={marksCorrect} onChange={e => setMarksCorrect(parseInt(e.target.value)||0)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-emerald-400 font-semibold outline-none focus:border-emerald-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Marks for Incorrect (-)</label>
                  <input type="number" value={marksIncorrect} onChange={e => setMarksIncorrect(parseInt(e.target.value)||0)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-red-400 font-semibold outline-none focus:border-red-400/50" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Card Subtitle / Description</label>
                <input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="e.g. Complete Class 11 & 12 · High-Yield Focus" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold outline-none focus:border-cyan-400/50" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Background Watermark</label>
                  <input value={watermarkText} onChange={e => setWatermarkText(e.target.value)} placeholder="e.g. #T02" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-black text-xl outline-none focus:border-cyan-400/50 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Coins Reward</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <input type="number" value={maxCoins} onChange={e => setMaxCoins(parseInt(e.target.value)||0)} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-amber-400 font-semibold outline-none focus:border-cyan-400/50" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Card Theme Color</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {THEMES.map(t => (
                    <div 
                      key={t.id} 
                      onClick={() => setThemeColor(t.id as any)}
                      className={`px-3 py-3 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${themeColor === t.id ? 'bg-white/10 border-white/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: t.color }} />
                      <span className="text-xs font-semibold text-white/90">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center gap-2">
                <span className="text-xs text-white/40 font-medium">A preview of this card will appear on the Mock Tests page</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Overall Syllabus Summary</label>
                <textarea 
                  value={syllabusSummary} 
                  onChange={e => setSyllabusSummary(e.target.value)} 
                  rows={2}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold outline-none focus:border-cyan-400/50 resize-none custom-scrollbar" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">Section-wise Breakdown</label>
                  <button onClick={handleAddSubject} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Section
                  </button>
                </div>

                <div className="space-y-3">
                  {subjectBreakdown.map((sub, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-3 p-3 rounded-xl border border-white/10 bg-white/5 items-start sm:items-center">
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Subject Name</label>
                        <input value={sub.subject} onChange={e => handleUpdateSubject(idx, 'subject', e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-lg text-sm text-white font-semibold outline-none focus:border-cyan-400/50" />
                      </div>
                      <div className="w-full sm:w-24">
                        <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Questions</label>
                        <input type="number" value={sub.questions} onChange={e => handleUpdateSubject(idx, 'questions', parseInt(e.target.value)||0)} className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-lg text-sm text-white font-semibold outline-none focus:border-cyan-400/50" />
                      </div>
                      <div className="w-full sm:w-24">
                        <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Marks</label>
                        <input type="number" value={sub.marks} onChange={e => handleUpdateSubject(idx, 'marks', parseInt(e.target.value)||0)} className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-lg text-sm text-white font-semibold outline-none focus:border-cyan-400/50" />
                      </div>
                      <button onClick={() => handleRemoveSubject(idx)} className="mt-4 sm:mt-5 p-2 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {subjectBreakdown.length === 0 && (
                    <p className="text-xs text-white/40 italic text-center py-4">No sections added. Add sections to show in syllabus modal.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 flex items-center justify-between bg-black/20">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 transition-colors">
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button onClick={() => setStep((s) => s - 1 as 1|2|3)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 border border-white/10">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            
            {step < 3 ? (
              <button onClick={() => setStep((s) => s + 1 as 1|2|3)} className="px-5 py-2.5 rounded-xl text-sm font-black text-black bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-black text-white bg-emerald-500 hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                <Save className="w-4 h-4" /> Save & Create Test
              </button>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
