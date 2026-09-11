import React, { useState, useMemo, useRef } from 'react';
import {
  Plus, Search, Filter, ChevronDown, Check, X, Image as ImageIcon,
  Trash2, Edit3, Eye, BookOpen, Layers, FileQuestion, Cpu,
  BarChart3, ArrowLeft, Flame, Atom, Clock, Award, Copy,
  CheckCircle2, AlertCircle, Tag, SlidersHorizontal, Upload
} from 'lucide-react';
import { syllabusNEET } from '../data/syllabusNEET';
import { syllabusJEE }  from '../data/syllabusJEE';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

type ExamType   = 'neet' | 'jee';
type QType      = 'mcq' | 'image' | 'match' | 'assertion' | 'statement' | 'graphical';
type Difficulty = 'easy' | 'medium' | 'hard';
type QSource    = 'pyq' | 'daily-practice' | 'question-practice' | 'mock-test' | 'chapter-test';

interface QuestionOption { text: string; imageUrl?: string; }
interface MatchMapping { left: string; right: string; }

interface Question {
  id: string;
  exam: ExamType;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterTitle: string;
  topicId: string;
  topicTitle: string;
  subtopicTitle?: string;
  qType: QType;
  source: QSource;
  difficulty: Difficulty;
  year: string;
  questionText: string;
  questionImageUrl?: string;
  
  // MCQ/Image Options
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
  correctIndex: number;
  
  // Statement/Assertion
  statementA?: string;
  statementB?: string;
  
  // Match
  matchLeft?: [string, string, string, string];
  matchRight?: [string, string, string, string];
  matchMappings?: [MatchMapping, MatchMapping, MatchMapping, MatchMapping];

  explanation: string;
  videoSolution?: string;
  createdAt: string;
  status: 'draft' | 'published';
}

// ─── Constants ────────────────────────────────────────────────────────────────

const Q_TYPE_OPTIONS: { value: QType; label: string }[] = [
  { value: 'mcq',       label: 'General MCQ' },
  { value: 'image',     label: 'Image Question' },
  { value: 'match',     label: 'Match the Following' },
  { value: 'assertion', label: 'Assertion & Reason' },
  { value: 'statement', label: 'Statement Based' },
  { value: 'graphical', label: 'Graphical' },
];

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; color: string }[] = [
  { value: 'easy',   label: 'Easy',   color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'hard',   label: 'Hard',   color: '#ef4444' },
];

const SOURCE_OPTIONS: { value: QSource; label: string }[] = [
  { value: 'pyq',               label: 'PYQ (Previous Year)' },
  { value: 'daily-practice',    label: 'Daily Practice' },
  { value: 'question-practice', label: 'Question Practice' },
  { value: 'mock-test',         label: 'Mock Test' },
  { value: 'chapter-test',      label: 'Chapter Test' },
];

const STATEMENT_OPTIONS = [
  'Statement A is correct but statement B is incorrect.',
  'Statement A is incorrect but statement B is correct.',
  'Both statements are correct.',
  'Both statements are incorrect.'
];

const ASSERTION_OPTIONS = [
  'Both A and R are correct and R is the correct explanation of A.',
  'Both A and R are correct but R is NOT the correct explanation of A.',
  'A is correct but R is not correct.',
  'A is not correct but R is correct.',
  'Both A and R are not correct.' // Optional 5th, but keeping to 4 typical options:
].slice(0,4);

const NEET_YEARS = ['NEET 2025','NEET 2024','NEET 2023','NEET 2022','NEET 2021','NEET 2020','NEET 2019','NEET 2018','NEET 2017','Custom'];
const JEE_YEARS  = ['JEE Main 2025 Jan','JEE Main 2025 Apr','JEE Main 2024 Jan','JEE Main 2024 Apr','JEE Main 2023','JEE Main 2022','JEE Main 2021','Custom'];

const STORAGE_KEY = 'cosmic_question_bank_v1';

const loadQuestions = (): Question[] => {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch { /* noop */ }
  return [];
};

const saveQuestions = (qs: Question[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(qs));
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyOptions = (): [QuestionOption, QuestionOption, QuestionOption, QuestionOption] =>
  [{ text: '' }, { text: '' }, { text: '' }, { text: '' }];

const blankForm = (): Omit<Question,'id'|'createdAt'|'status'> => ({
  exam: 'neet', subjectId: '', subjectName: '', chapterId: '', chapterTitle: '',
  topicId: '', topicTitle: '', subtopicTitle: '',
  qType: 'mcq', source: 'pyq', difficulty: 'medium', year: 'NEET 2024',
  questionText: '', options: emptyOptions(), correctIndex: 0,
  statementA: '', statementB: '',
  matchLeft: ['','','',''], matchRight: ['','','',''],
  matchMappings: [{left:'A',right:'P'},{left:'B',right:'Q'},{left:'C',right:'R'},{left:'D',right:'S'}],
  explanation: '', videoSolution: '',
});

// Convert file to Base64 (with compression) to bypass Storage permission issues
const uploadImageToFirebase = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX = 800;
        if (width > MAX) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// ─── Select Component ─────────────────────────────────────────────────────────

const Select: React.FC<{
  label?: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder?: string; required?: boolean;
}> = ({ label, value, onChange, options, placeholder = 'Select…', required }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <button type="button" onClick={() => setOpen(p => !p)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${open ? 'rgba(0,240,255,0.4)' : 'rgba(255,255,255,0.08)'}`, color: selected ? '#fff' : 'rgba(255,255,255,0.3)' }}>
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDown className={`w-4 h-4 text-white/30 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden shadow-2xl"
            style={{ background: '#131726', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '240px', overflowY: 'auto' }}>
            {options.map(opt => (
              <button key={opt.value} type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/05"
                style={{ color: opt.value === value ? '#00f0ff' : 'rgba(255,255,255,0.75)' }}>
                <span>{opt.label}</span>
                {opt.value === value && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Option Row ───────────────────────────────────────────────────────────────

const OptionRow: React.FC<{
  idx: number; option: QuestionOption; isCorrect: boolean;
  onTextChange: (v: string) => void; onImageChange: (url: string | undefined) => void;
  onSelectCorrect: () => void;
}> = ({ idx, option, isCorrect, onTextChange, onImageChange, onSelectCorrect }) => {
  const letter = ['A','B','C','D'][idx];
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      try {
        setIsUploading(true);
        const url = await uploadImageToFirebase(f);
        onImageChange(url);
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload image.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="rounded-2xl p-4 space-y-3 transition-all"
      style={{ background: isCorrect ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.025)', border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.07)'}` }}>
      
      <div className="flex items-center gap-3">
        <button type="button" onClick={onSelectCorrect}
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all"
          style={{ background: isCorrect ? '#10b981' : 'rgba(255,255,255,0.06)', border: `2px solid ${isCorrect ? '#10b981' : 'rgba(255,255,255,0.15)'}` }}>
          {isCorrect ? <Check className="w-3.5 h-3.5 text-white" /> : <span className="text-[11px] font-black text-white/40">{letter}</span>}
        </button>
        <input
          value={option.text}
          onChange={e => onTextChange(e.target.value)}
          placeholder={`Option ${letter} (text)`}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
        />
        {isCorrect && <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Correct</span>}
      </div>

      {option.imageUrl ? (
        <div className="relative mt-2 ml-10 rounded-xl overflow-hidden border border-white/10 w-fit">
          <img src={option.imageUrl} alt={`Option ${letter}`} className="h-20 object-contain bg-black/40" />
          <button type="button" onClick={() => onImageChange(undefined)}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      ) : (
        <div className="ml-10">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={isUploading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 transition-colors ${isUploading ? 'text-white/30 bg-transparent' : 'text-white/50 hover:text-white hover:bg-white/05'}`}>
            <ImageIcon className="w-3.5 h-3.5" /> {isUploading ? 'Uploading...' : 'Add image'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
    </div>
  );
};

// ─── Question Form ────────────────────────────────────────────────────────────

const QuestionForm: React.FC<{
  exam: ExamType;
  initial?: Question;
  onSave: (q: Question) => void;
  onCancel: () => void;
}> = ({ exam, initial, onSave, onCancel }) => {
  const [form, setForm] = useState<Omit<Question,'id'|'createdAt'|'status'>>(
    initial ? { ...initial } : { ...blankForm(), exam }
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploadingGlobal, setIsUploadingGlobal] = useState(false);
  const questionFileRef = useRef<HTMLInputElement>(null);

  const syllabusData = form.exam === 'neet' ? syllabusNEET : syllabusJEE;
  const years = form.exam === 'neet' ? NEET_YEARS : JEE_YEARS;

  const subjectOptions = syllabusData.subjects.map(s => ({
    value: s.id,
    label: s.name.replace(/\s*\(.*?\)/g, '').trim(),
  }));

  const activeSubject = syllabusData.subjects.find(s => s.id === form.subjectId);

  const chapterOptions = (activeSubject?.chapters ?? []).map(c => ({
    value: c.id, label: c.title,
  }));

  const activeChapter = activeSubject?.chapters.find(c => c.id === form.chapterId);

  const topicOptions = (activeChapter?.topics ?? []).map(t => ({
    value: t.id, label: t.title,
  }));

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const setOption = (idx: number, text: string) => {
    const opts = [...form.options] as typeof form.options;
    opts[idx] = { ...opts[idx], text };
    set('options', opts);
  };

  const setOptionImage = (idx: number, imageUrl: string | undefined) => {
    const opts = [...form.options] as typeof form.options;
    opts[idx] = { ...opts[idx], imageUrl };
    set('options', opts);
  };

  const handleQuestionImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      try {
        setIsUploadingGlobal(true);
        const url = await uploadImageToFirebase(f);
        set('questionImageUrl', url);
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload image.");
      } finally {
        setIsUploadingGlobal(false);
      }
    }
  };

  const validate = () => {
    const errs: string[] = [];
    if (!form.subjectId)    errs.push('Subject is required');
    if (!form.chapterId)    errs.push('Chapter is required');
    if (!form.topicId)      errs.push('Topic is required');
    if (!form.questionText.trim() && !form.questionImageUrl) errs.push('Question text or image is required');
    if (!form.explanation.trim()) errs.push('Explanation is required');

    if (form.qType === 'mcq' || form.qType === 'image' || form.qType === 'graphical') {
      const filledOpts = form.options.filter(o => o.text.trim() || o.imageUrl);
      if (filledOpts.length < 4) errs.push('All 4 options require text or an image');
    } else if (form.qType === 'statement' || form.qType === 'assertion') {
      if (!form.statementA?.trim()) errs.push('Statement A / Assertion is required');
      if (!form.statementB?.trim()) errs.push('Statement B / Reason is required');
    } else if (form.qType === 'match') {
      if (form.matchLeft?.some(x => !x.trim())) errs.push('All Left Column fields are required');
      if (form.matchRight?.some(x => !x.trim())) errs.push('All Right Column fields are required');
    }
    
    return errs;
  };

  const handleSubmit = (status: 'draft' | 'published') => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); window.scrollTo({top:0, behavior:'smooth'}); return; }
    const q: Question = {
      ...form,
      id: initial?.id ?? `q_${Date.now()}`,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      status,
    };
    onSave(q);
  };

  const renderDynamicFields = () => {
    if (form.qType === 'statement' || form.qType === 'assertion') {
      const isAssertion = form.qType === 'assertion';
      const labelA = isAssertion ? 'Assertion (A)' : 'Statement A';
      const labelB = isAssertion ? 'Reason (R)' : 'Statement B';
      const presetOptions = isAssertion ? ASSERTION_OPTIONS : STATEMENT_OPTIONS;

      return (
        <div className="space-y-5">
          <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-black text-white">{labelA} <span className="text-red-400">*</span></h3>
            <textarea value={form.statementA} onChange={e => set('statementA', e.target.value)}
              placeholder={`Enter ${labelA}...`} rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-black text-white">{labelB} <span className="text-red-400">*</span></h3>
            <textarea value={form.statementB} onChange={e => set('statementB', e.target.value)}
              placeholder={`Enter ${labelB}...`} rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-black text-white">Correct Answer <span className="text-red-400">*</span></h3>
            <div className="space-y-2">
              {presetOptions.map((opt, idx) => (
                <button key={idx} type="button" onClick={() => set('correctIndex', idx)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                  style={{ background: form.correctIndex === idx ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${form.correctIndex === idx ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: form.correctIndex === idx ? '#10b981' : 'rgba(255,255,255,0.1)' }}>
                    {form.correctIndex === idx && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-white/80">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (form.qType === 'match') {
      return (
        <div className="space-y-5">
          <div className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-black text-white">Match the Following fields</h3>
            
            <div>
              <p className="text-xs font-bold text-white/60 uppercase mb-2">Left Column (A,B,C,D)</p>
              <div className="space-y-2">
                {form.matchLeft?.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="font-black text-blue-400 w-4 text-center">{['A','B','C','D'][idx]}</span>
                    <input value={val} onChange={e => {
                      const next = [...form.matchLeft!]; next[idx] = e.target.value; set('matchLeft', next as any);
                    }} placeholder={`Item ${['A','B','C','D'][idx]}`} className="flex-1 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white outline-none" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-white/60 uppercase mb-2">Right Column (P,Q,R,S)</p>
              <div className="space-y-2">
                {form.matchRight?.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="font-black text-white/40 w-4 text-center">{['P','Q','R','S'][idx]}</span>
                    <input value={val} onChange={e => {
                      const next = [...form.matchRight!]; next[idx] = e.target.value; set('matchRight', next as any);
                    }} placeholder={`Match ${['P','Q','R','S'][idx]}`} className="flex-1 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white outline-none" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-black text-white">Correct mappings</h3>
            <div className="space-y-3">
              {form.matchMappings?.map((mapping, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="font-black text-blue-400 w-4">{mapping.left}</span>
                  <span className="text-white/40">→</span>
                  <div className="flex-1">
                    <Select value={mapping.right} options={['P','Q','R','S'].map(v => ({value:v, label:v}))} onChange={v => {
                      const next = [...form.matchMappings!]; next[idx] = {...next[idx], right: v}; set('matchMappings', next as any);
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Default MCQ / Image / Graphical
    return (
      <div className="rounded-2xl p-5 space-y-3"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white">Options <span className="text-red-400">*</span></h3>
          <p className="text-[11px] text-white/30">Click circle to mark correct answer</p>
        </div>
        <div className="space-y-3">
          {form.options.map((opt, idx) => (
            <OptionRow key={idx} idx={idx} option={opt}
              isCorrect={form.correctIndex === idx}
              onTextChange={v => setOption(idx, v)}
              onImageChange={b64 => setOptionImage(idx, b64)}
              onSelectCorrect={() => set('correctIndex', idx)} />
          ))}
        </div>
        <p className="text-[11px] text-red-400/80 mt-2">All 4 options are required (text or image).</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      <div className="flex items-center gap-3">
        <button onClick={onCancel}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h2 className="text-xl font-black text-white">{initial ? 'Edit Question' : 'Add Question'}</h2>
          <p className="text-xs text-white/40">Select subject, chapter, topic → fill question → save</p>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-4 rounded-2xl space-y-1" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          {errors.map((e, i) => (
            <p key={i} className="text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {e}
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Question Details ── */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl p-5 space-y-4"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-black text-white">Question Details</h3>

            {/* Exam */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">Exam</label>
              <div className="flex items-center gap-2">
                {(['neet','jee'] as ExamType[]).map(e => (
                  <button key={e} type="button" onClick={() => setForm(p => ({ ...blankForm(), exam: e }))}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all"
                    style={form.exam === e
                      ? { background: '#00f0ff22', color: '#00f0ff', border: '1px solid #00f0ff55' }
                      : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {e === 'neet' ? <Flame className="w-3.5 h-3.5" /> : <Atom className="w-3.5 h-3.5" />}
                    {e.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <Select label="Subject" required value={form.subjectId} options={subjectOptions}
              onChange={v => {
                const s = syllabusData.subjects.find(sub => sub.id === v);
                setForm(p => ({ ...p, subjectId: v, subjectName: s?.name ?? '', chapterId: '', chapterTitle: '', topicId: '', topicTitle: '' }));
              }} />

            {/* Chapter */}
            <Select label="Chapter" required value={form.chapterId} options={chapterOptions}
              placeholder={form.subjectId ? 'Select chapter…' : 'Select subject first'}
              onChange={v => {
                const ch = activeSubject?.chapters.find(c => c.id === v);
                setForm(p => ({ ...p, chapterId: v, chapterTitle: ch?.title ?? '', topicId: '', topicTitle: '' }));
              }} />

            {/* Topic */}
            <Select label="Topic" required value={form.topicId} options={topicOptions}
              placeholder={form.chapterId ? 'Select topic…' : 'Select chapter first'}
              onChange={v => {
                const t = activeChapter?.topics.find(tp => tp.id === v);
                setForm(p => ({ ...p, topicId: v, topicTitle: t?.title ?? '' }));
              }} />

            {/* Subtopic */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">Subtopic <span className="text-white/25 normal-case font-normal">(optional)</span></label>
              <input value={form.subtopicTitle ?? ''} onChange={e => set('subtopicTitle', e.target.value)}
                placeholder="E.g. Sliding filament theory"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>

            {/* Question Type */}
            <Select label="Question Type" required value={form.qType}
              options={Q_TYPE_OPTIONS} onChange={v => set('qType', v as QType)} />

            {/* Source */}
            <Select label="Use For" required value={form.source}
              options={SOURCE_OPTIONS} onChange={v => set('source', v as QSource)} />

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTY_OPTIONS.map(d => (
                  <button key={d.value} type="button" onClick={() => set('difficulty', d.value)}
                    className="flex-1 py-2 rounded-xl text-xs font-black transition-all"
                    style={form.difficulty === d.value
                      ? { background: d.color + '22', color: d.color, border: `1px solid ${d.color}55` }
                      : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Year */}
            <Select label="Year" value={form.year}
              options={years.map(y => ({ value: y, label: y }))} onChange={v => set('year', v)} />
          </div>
        </div>

        {/* ── Right: Question Body ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Question Text */}
          <div className="rounded-2xl p-5 space-y-3"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-black text-white">Question Text <span className="text-red-400">*</span></h3>
            <textarea
              value={form.questionText}
              onChange={e => set('questionText', e.target.value)}
              placeholder="Type the full question here…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            {/* Question Image Upload */}
            {form.questionImageUrl ? (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-white/10 w-fit">
                <img src={form.questionImageUrl} alt="Question figure" className="max-h-32 object-contain bg-black/40" />
                <button type="button" onClick={() => set('questionImageUrl', undefined)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => questionFileRef.current?.click()} disabled={isUploadingGlobal}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-white/10 transition-colors w-fit ${isUploadingGlobal ? 'text-white/30 bg-transparent' : 'text-white/50 hover:text-white hover:bg-white/05'}`}>
                <ImageIcon className="w-4 h-4" /> {isUploadingGlobal ? 'Uploading image...' : 'Add figure to question'}
              </button>
            )}
            <input ref={questionFileRef} type="file" accept="image/*" className="hidden" onChange={handleQuestionImage} />
          </div>

          {/* Dynamic Fields (Options / Match / Statement) */}
          {renderDynamicFields()}

          {/* Explanation */}
          <div className="rounded-2xl p-5 space-y-3"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-black text-white">Explanation <span className="text-red-400">*</span></h3>
            <textarea
              value={form.explanation}
              onChange={e => set('explanation', e.target.value)}
              placeholder="Explain why the correct answer is right (min 10 characters)…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* Video Solution */}
          <div className="rounded-2xl p-5 space-y-3"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-black text-white">Video Solution <span className="text-white/25 font-normal">(optional)</span></h3>
            <input
              value={form.videoSolution ?? ''}
              onChange={e => set('videoSolution', e.target.value)}
              placeholder="Paste YouTube / video URL…"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* Submit bar */}
          <div className="flex items-center gap-3 justify-end">
            <button type="button" onClick={onCancel}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white/50 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Cancel
            </button>
            <button type="button" onClick={() => handleSubmit('draft')} disabled={isUploadingGlobal}
              className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
              Save Draft
            </button>
            <button type="button" onClick={() => handleSubmit('published')} disabled={isUploadingGlobal}
              className="px-6 py-2.5 rounded-xl text-sm font-black text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#00f0ff,#0066ff)', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
              Publish Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Question Bank ────────────────────────────────────────────────────────────

const diffColor = (d: Difficulty) =>
  d === 'easy' ? '#10b981' : d === 'hard' ? '#ef4444' : '#f59e0b';

const sourceLabel = (s: QSource) =>
  SOURCE_OPTIONS.find(o => o.value === s)?.label ?? s;

const QuestionBank: React.FC<{
  questions: Question[];
  onAdd: () => void;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  onDuplicate: (q: Question) => void;
}> = ({ questions, onAdd, onEdit, onDelete, onDuplicate }) => {
  const [search, setSearch]         = useState('');
  const [examF, setExamF]           = useState<ExamType | 'all'>('all');
  const [sourceF, setSourceF]       = useState<QSource | 'all'>('all');
  const [diffF, setDiffF]           = useState<Difficulty | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (examF !== 'all' && q.exam !== examF) return false;
      if (sourceF !== 'all' && q.source !== sourceF) return false;
      if (diffF !== 'all' && q.difficulty !== diffF) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        return q.questionText.toLowerCase().includes(s) ||
               q.chapterTitle.toLowerCase().includes(s) ||
               q.topicTitle.toLowerCase().includes(s);
      }
      return true;
    });
  }, [questions, examF, sourceF, diffF, search]);

  const total     = questions.length;
  const published = questions.filter(q => q.status === 'published').length;
  const drafts    = questions.filter(q => q.status === 'draft').length;
  const bySource  = SOURCE_OPTIONS.map(s => ({ label: s.label, count: questions.filter(q => q.source === s.value).length }));

  const renderExpandedBody = (q: Question) => {
    if (q.qType === 'statement' || q.qType === 'assertion') {
      const isAssertion = q.qType === 'assertion';
      const presetOptions = isAssertion ? ASSERTION_OPTIONS : STATEMENT_OPTIONS;
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] font-bold text-white/50 uppercase mb-1">{isAssertion ? 'Assertion (A)' : 'Statement A'}</p>
              <p className="text-sm text-white">{q.statementA}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] font-bold text-white/50 uppercase mb-1">{isAssertion ? 'Reason (R)' : 'Statement B'}</p>
              <p className="text-sm text-white">{q.statementB}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Correct Answer</p>
            <p className="text-sm text-emerald-100">{presetOptions[q.correctIndex]}</p>
          </div>
        </div>
      );
    }
    
    if (q.qType === 'match') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-white/50 uppercase">Left Column</p>
              {q.matchLeft?.map((val, i) => (
                <div key={i} className="flex gap-2 text-sm"><span className="text-blue-400 font-bold w-4">{['A','B','C','D'][i]}</span><span className="text-white/80">{val}</span></div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-white/50 uppercase">Right Column</p>
              {q.matchRight?.map((val, i) => (
                <div key={i} className="flex gap-2 text-sm"><span className="text-white/40 font-bold w-4">{['P','Q','R','S'][i]}</span><span className="text-white/80">{val}</span></div>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-xl flex gap-4 bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Mappings:</span>
            <span className="text-sm text-emerald-100 font-medium">
              {q.matchMappings?.map(m => `${m.left}→${m.right}`).join(', ')}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {q.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl text-sm"
            style={{
              background: i === q.correctIndex ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.025)',
              border: `1px solid ${i === q.correctIndex ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)'}`,
            }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0"
              style={{ background: i === q.correctIndex ? '#10b981' : 'rgba(255,255,255,0.07)', color: i === q.correctIndex ? '#fff' : 'rgba(255,255,255,0.4)' }}>
              {i === q.correctIndex ? <Check className="w-3.5 h-3.5" /> : ['A','B','C','D'][i]}
            </span>
            <div className="flex flex-col gap-1">
              <span className={i === q.correctIndex ? 'text-emerald-300' : 'text-white/70'}>{opt.text || (opt.imageUrl ? '(Image Only)' : '—')}</span>
              {opt.imageUrl && <img src={opt.imageUrl} alt="opt" className="h-10 object-contain rounded mt-1" />}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Question Bank</h2>
          <p className="text-xs text-white/40 mt-0.5">{total} questions · {published} published · {drafts} drafts</p>
        </div>
        <button onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-black transition-all self-start sm:self-auto"
          style={{ background: 'linear-gradient(135deg,#00f0ff,#0066ff)', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {bySource.map(s => (
          <div key={s.label} className="rounded-2xl p-4 text-center"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xl font-black text-white">{s.count}</p>
            <p className="text-[10px] text-white/35 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search questions, chapters…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/20 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>

        {/* Exam filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['all','neet','jee'] as const).map(e => (
            <button key={e} onClick={() => setExamF(e)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={examF === e
                ? { background: '#00f0ff22', color: '#00f0ff', border: '1px solid #00f0ff44' }
                : { color: 'rgba(255,255,255,0.35)' }}>
              {e === 'all' ? 'All' : e.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Source filter */}
        <select value={sourceF} onChange={e => setSourceF(e.target.value as QSource | 'all')}
          className="px-3 py-2 rounded-xl text-xs font-bold text-white outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <option value="all">All Sources</option>
          {SOURCE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        {/* Difficulty filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['all','easy','medium','hard'] as const).map(d => (
            <button key={d} onClick={() => setDiffF(d)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize"
              style={diffF === d
                ? { background: d !== 'all' ? diffColor(d as Difficulty) + '22' : '#ffffff18', color: d !== 'all' ? diffColor(d as Difficulty) : '#fff', border: `1px solid ${d !== 'all' ? diffColor(d as Difficulty) + '44' : 'rgba(255,255,255,0.2)'}` }
                : { color: 'rgba(255,255,255,0.35)' }}>
              {d === 'all' ? 'All' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Question list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">
            {questions.length === 0 ? 'No questions yet. Click "Add Question" to start!' : 'No questions match your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q, idx) => {
            const isExpanded = expandedId === q.id;
            const hasImage = !!q.questionImageUrl;
            return (
              <div key={q.id} className="rounded-2xl overflow-hidden transition-all"
                style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${isExpanded ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.07)'}` }}>
                {/* Row */}
                <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : q.id)}>
                  {/* Index */}
                  <span className="text-xs font-black text-white/20 w-6 shrink-0">{idx + 1}</span>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase"
                      style={{ background: '#00f0ff18', color: '#00f0ff', border: '1px solid #00f0ff33' }}>
                      {q.exam.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ background: diffColor(q.difficulty) + '18', color: diffColor(q.difficulty), border: `1px solid ${diffColor(q.difficulty)}33` }}>
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white/40"
                      style={{ background: 'rgba(255,255,255,0.06)' }}>
                      {q.qType}
                    </span>
                    {q.status === 'draft' && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-amber-400"
                        style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
                        DRAFT
                      </span>
                    )}
                  </div>

                  {/* Question preview */}
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    {hasImage && <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    <p className="text-sm text-white/75 truncate">{q.questionText || '(no question text)'}</p>
                  </div>

                  {/* Chapter */}
                  <span className="text-[11px] text-white/30 hidden sm:block truncate max-w-[140px] shrink-0">{q.chapterTitle}</span>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => onEdit(q)} title="Edit"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/08 transition-all">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDuplicate(q)} title="Duplicate"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/08 transition-all">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(q.id)} title="Delete"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/08 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded view */}
                {isExpanded && (
                  <div className="px-4 pb-5 space-y-4 border-t border-white/05 pt-4 animate-in fade-in duration-200">
                    {/* Topic path */}
                    <p className="text-[11px] text-white/35">
                      {q.subjectName} › {q.chapterTitle} › {q.topicTitle}{q.subtopicTitle ? ` › ${q.subtopicTitle}` : ''}
                    </p>

                    {/* Full question */}
                    <div className="p-4 rounded-xl text-sm text-white leading-relaxed space-y-3"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p>{q.questionText}</p>
                      {q.questionImageUrl && (
                        <img src={q.questionImageUrl} alt="Question figure" className="max-h-48 object-contain rounded-lg border border-white/10" />
                      )}
                    </div>

                    {/* Options / Dynamic Body */}
                    {renderExpandedBody(q)}

                    {/* Explanation */}
                    <div className="p-4 rounded-xl"
                      style={{ background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.12)' }}>
                      <p className="text-[10px] font-black text-cyan-400 uppercase tracking-wider mb-1.5">Explanation</p>
                      <p className="text-sm text-white/75 leading-relaxed">{q.explanation}</p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-white/25">
                      <Tag className="w-3 h-3" />
                      <span>{sourceLabel(q.source)}</span>
                      <span>·</span>
                      <Clock className="w-3 h-3" />
                      <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Creator Page ─────────────────────────────────────────────────────────────

type CreatorView = 'bank' | 'add' | 'edit';

export const CreatorPage: React.FC = () => {
  const [view, setView]           = useState<CreatorView>('bank');
  const [editTarget, setEditTarget] = useState<Question | undefined>(undefined);
  const [questions, setQuestions]   = useState<Question[]>(loadQuestions);
  const [exam, setExam]             = useState<ExamType>('neet');

  const updateQuestions = (qs: Question[]) => {
    setQuestions(qs);
    saveQuestions(qs);
  };

  const handleSave = (q: Question) => {
    const exists = questions.findIndex(x => x.id === q.id);
    if (exists >= 0) {
      const next = [...questions];
      next[exists] = q;
      updateQuestions(next);
    } else {
      updateQuestions([q, ...questions]);
    }
    setView('bank');
    setEditTarget(undefined);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this question?')) return;
    updateQuestions(questions.filter(q => q.id !== id));
  };

  const handleDuplicate = (q: Question) => {
    const copy: Question = { ...q, id: `q_${Date.now()}`, createdAt: new Date().toISOString(), status: 'draft' };
    updateQuestions([copy, ...questions]);
  };

  if (view === 'add' || view === 'edit') {
    return (
      <QuestionForm
        exam={exam}
        initial={editTarget}
        onSave={handleSave}
        onCancel={() => { setView('bank'); setEditTarget(undefined); }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{ background: 'linear-gradient(135deg,#0d1226 0%,#080b16 100%)', border: '1px solid rgba(0,240,255,0.15)', boxShadow: '0 0 40px rgba(0,240,255,0.06)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%,rgba(0,240,255,0.08) 0%,transparent 65%)' }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400/60">Admin Only · Creator Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Question Maker</h1>
            <p className="text-sm text-white/40 mt-1">Build, organise, and publish questions for PYQ, Daily Practice, Mock Tests and more.</p>
          </div>
          <button onClick={() => { setEditTarget(undefined); setView('add'); }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black text-black self-start sm:self-auto"
            style={{ background: 'linear-gradient(135deg,#00f0ff,#0066ff)', boxShadow: '0 0 24px rgba(0,240,255,0.45)' }}>
            <Plus className="w-5 h-5" /> Add Question
          </button>
        </div>
      </div>

      {/* Quick stat */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Questions', value: questions.length,                                              icon: BookOpen,      color: '#00f0ff' },
          { label: 'Published',       value: questions.filter(q => q.status === 'published').length,       icon: CheckCircle2,  color: '#10b981' },
          { label: 'Drafts',          value: questions.filter(q => q.status === 'draft').length,           icon: Edit3,         color: '#f59e0b' },
          { label: 'PYQ Added',       value: questions.filter(q => q.source === 'pyq').length,             icon: Award,         color: '#a855f7' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: stat.color + '18', border: `1px solid ${stat.color}30` }}>
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-lg font-black text-white">{stat.value}</p>
                <p className="text-[10px] text-white/35 leading-none">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Question Bank */}
      <QuestionBank
        questions={questions}
        onAdd={() => { setEditTarget(undefined); setView('add'); }}
        onEdit={q => { setEditTarget(q); setView('edit'); }}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    </div>
  );
};
