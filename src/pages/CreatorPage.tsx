import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Search, Filter, ChevronDown, Check, X, Image as ImageIcon,
  Trash2, Edit3, Eye, BookOpen, Layers, FileQuestion, Cpu,
  BarChart3, ArrowLeft, Flame, Atom, Clock, Award, Copy,
  CheckCircle2, AlertCircle, Tag, SlidersHorizontal, Upload,
  Sparkles, LayoutGrid, List, RotateCcw, Play, ChevronLeft, ChevronRight
} from 'lucide-react';
import { syllabusNEET } from '../data/syllabusNEET';
import { syllabusJEE }  from '../data/syllabusJEE';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { getChapterUnitTheme } from '../utils/flashcardUnitTheme';
import { CsvUploader } from '../components/creator-studio/CsvUploader';
import { TestBuilderModal } from '../components/creator-studio/TestBuilderModal';
import { DailyStatusManagerModal } from '../components/creator-studio/DailyStatusManagerModal';
import { AddToStatusModal } from '../components/creator-studio/AddToStatusModal';
import { useCreatorStudioStorage } from '../hooks/useCreatorStudioStorage';
import { CustomTest } from '../types/creatorStudio';
import { QuestionSolutionTabs } from '../components/QuestionSolutionTabs';

// ─── Types ────────────────────────────────────────────────────────────────────

type ExamType   = 'neet' | 'jee';
type QType      = 'mcq' | 'image' | 'match' | 'assertion' | 'statement' | 'graphical';
type Difficulty = 'easy' | 'medium' | 'hard';
type QSource    = 'pyq' | 'daily-practice' | 'question-practice' | 'mock-test' | 'chapter-test';

export interface QuestionOption { text: string; imageUrl?: string; }
export interface MatchMapping { left: string; right: string; }

export interface Question {
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
  solutionExplanation?: string;
  videoSolution?: string;
  videoSolutionUrl?: string;
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
  explanation: '', solutionExplanation: '', videoSolution: '', videoSolutionUrl: '',
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
    if (!form.explanation.trim() && !form.solutionExplanation?.trim()) errs.push('Explanation is required');

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

          {/* Explanation & Video Solution */}
          <div className="rounded-2xl p-5 space-y-4"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1.5 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Solution / Explanation (Optional) <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.solutionExplanation || form.explanation || ''}
                onChange={e => {
                  set('solutionExplanation', e.target.value);
                  set('explanation', e.target.value);
                }}
                placeholder="Explain why the correct answer is right (min 10 characters)…"
                rows={4}
                className="w-full bg-[#181a25] border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 min-h-[100px] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1.5 flex items-center gap-2">
                <Play className="w-4 h-4 text-rose-400" />
                Video Solution URL (Optional)
              </label>
              <input
                type="text"
                value={form.videoSolutionUrl || form.videoSolution || ''}
                onChange={e => {
                  set('videoSolutionUrl', e.target.value);
                  set('videoSolution', e.target.value);
                }}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-[#181a25] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
            </div>
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


// ─── Question Bank Helpers ───────────────────────────────────────────────────

const diffColor = (d: Difficulty) =>
  d === 'easy' ? '#10b981' : d === 'hard' ? '#ef4444' : '#f59e0b';

const sourceLabel = (s: QSource) =>
  SOURCE_OPTIONS.find(o => o.value === s)?.label ?? s;

// ─── Question Card (Flashcard Design) ─────────────────────────────────────────

interface CreatorQuestionCardProps {
  question: Question;
  index: number;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const CreatorQuestionCard: React.FC<CreatorQuestionCardProps> = ({
  question: q,
  index,
  isSelected,
  onToggleSelect,
  onPreview,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const formattedIndex = (index + 1).toString().padStart(2, '0');
  const unitTheme = getChapterUnitTheme(q.chapterTitle, q.subjectName, q.exam === 'neet' ? 'NEET' : 'JEE');

  const diffBadgeColor =
    q.difficulty === 'easy' ? '#10b981' : q.difficulty === 'hard' ? '#ef4444' : '#f59e0b';

  return (
    <div
      onClick={onPreview}
      className={`group relative rounded-2xl p-3 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden shadow-lg hover:translate-y-[-2px] select-none ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}
      style={{
        background: unitTheme.cardBg,
        borderColor: isSelected ? 'rgba(0,240,255,0.6)' : unitTheme.borderColor,
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
      }}
    >
      {/* Artwork Banner */}
      <div
        className="relative h-36 sm:h-44 rounded-xl overflow-hidden p-2.5 sm:p-3.5 flex flex-col justify-between border shadow-inner transition-all duration-300"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.3)',
          background: unitTheme.bannerGradient
        }}
      >
        {/* Dot Matrix Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.7) 1.2px, transparent 1.2px)',
            backgroundSize: '16px 16px',
            backgroundPosition: 'center'
          }}
        />

        {/* Large Centered Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="text-4xl sm:text-7xl font-black tracking-tight font-sans transition-transform duration-300 group-hover:scale-105"
            style={{ color: unitTheme.watermarkColor }}
          >
            #Q{formattedIndex}
          </span>
        </div>

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2">
          <span
            className="border px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-[11px] font-black tracking-wider shadow-sm backdrop-blur-md text-white shrink-0"
            style={{
              backgroundColor: unitTheme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.35)'
            }}
          >
            Q #{index + 1}
          </span>

          <div
            className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-xs font-black tracking-wide flex items-center gap-1 shadow-md shrink-0 uppercase"
            style={{
              backgroundColor: '#FFFFFF',
              color: diffBadgeColor
            }}
          >
            <Award className="w-3 h-3 stroke-[2.5]" />
            <span>{q.difficulty}</span>
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2 mt-auto">
          <span
            className="border px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-md text-white truncate max-w-[50%]"
            style={{
              backgroundColor: unitTheme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <Flame className="w-3 h-3 text-white shrink-0" />
            <span className="truncate">{q.year}</span>
          </span>

          <span
            className="border px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-semibold tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-md text-white truncate max-w-[50%]"
            style={{
              backgroundColor: unitTheme.badgeBg,
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            <BookOpen className="w-3 h-3 text-white/90 shrink-0" />
            <span className="truncate">{q.qType}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="pt-2 sm:pt-3 pb-1 px-0.5 sm:px-1 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1">
            <div className="flex items-center gap-1.5 flex-wrap flex-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-white/10 text-white/70">
                {q.subjectName}
              </span>
              {q.status === 'draft' ? (
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DRAFT
                </span>
              ) : (
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PUBLISHED
                </span>
              )}
            </div>

            {/* Selection Checkbox */}
            {onToggleSelect && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect();
                }}
                title={isSelected ? "Deselect question" : "Select question"}
                className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center transition-all active:scale-95 shadow-sm cursor-pointer"
                style={{
                  backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)',
                  borderColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                  color: isSelected ? '#000000' : 'transparent'
                }}
              >
                <Check className={`w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-70 text-white'}`} />
              </button>
            )}
          </div>

          <h4 className="font-extrabold text-xs sm:text-sm text-white leading-snug line-clamp-2 transition-colors group-hover:text-white/90">
            {q.questionText || '(Figure Question)'}
          </h4>

          <p className="text-[10px] text-white/50 truncate mt-1">
            {q.chapterTitle} › {q.topicTitle}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit Question"
            className="w-7 h-7 rounded-xl flex items-center justify-center text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            title="Duplicate Question"
            className="w-7 h-7 rounded-xl flex items-center justify-center text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete Question"
            className="w-7 h-7 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Question Preview Modal ───────────────────────────────────────────────────

const QuestionPreviewModal: React.FC<{
  question: Question;
  onClose: () => void;
  onEdit: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}> = ({ question: q, onClose, onEdit, onNext, onPrev, hasNext, hasPrev }) => {
  const diffBadgeColor =
    q.difficulty === 'easy' ? '#10b981' : q.difficulty === 'hard' ? '#ef4444' : '#f59e0b';
  const isPub = q.status === 'published';
  const LABELS = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasNext, hasPrev, onNext, onPrev, onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-white/10"
        style={{
          background: 'linear-gradient(180deg, #0d1020 0%, #0a0c18 100%)',
          maxHeight: 'min(82vh, 560px)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Accent top bar */}
        <div className="h-1 w-full shrink-0" style={{ background: 'linear-gradient(90deg, #00f0ff, #6366f1, #a855f7)' }} />

        {/* Header (Fixed) */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 shrink-0 bg-black/20">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black px-3 py-1 rounded-full uppercase bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
              {q.exam.toUpperCase()}
            </span>
            <span
              className="text-[11px] font-black px-3 py-1 rounded-full uppercase"
              style={{ backgroundColor: `${diffBadgeColor}20`, color: diffBadgeColor, border: `1px solid ${diffBadgeColor}40` }}
            >
              {q.difficulty}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/10">
              {q.qType}
            </span>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
              isPub ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {q.status}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-1 mr-1 sm:mr-2 border-r border-white/10 pr-2 sm:pr-3">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className={`p-1.5 rounded-lg transition-all ${hasPrev ? 'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer' : 'text-white/20 cursor-not-allowed'}`}
                title="Previous Question"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className={`p-1.5 rounded-lg transition-all ${hasNext ? 'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer' : 'text-white/20 cursor-not-allowed'}`}
                title="Next Question"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <button
              onClick={onEdit}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
            >
              <Edit3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-white/40 flex-wrap">
            <span className="text-white/60 font-semibold">{q.subjectName}</span>
            <span>›</span>
            <span>{q.chapterTitle}</span>
            <span>›</span>
            <span>{q.topicTitle}</span>
            {q.subtopicTitle && <><span>›</span><span>{q.subtopicTitle}</span></>}
            {q.year && <span className="ml-auto text-white/30 font-mono">{q.year}</span>}
          </div>

        {/* Question Content */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
          {q.questionText && (
            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed whitespace-pre-wrap">
              {q.questionText}
            </p>
          )}
          {q.questionImageUrl && (
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 p-2 flex items-center justify-center">
              <img
                src={q.questionImageUrl}
                alt="Question Figure"
                className="max-h-64 w-auto object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Advanced Question Specific UI */}
        {(q.qType === 'assertion' || q.qType === 'statement') && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs font-black text-cyan-400 mb-1 block uppercase">
                {q.qType === 'assertion' ? 'Assertion (A)' : 'Statement I'}
              </span>
              <p className="text-sm text-white/90">{q.statementA}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs font-black text-cyan-400 mb-1 block uppercase">
                {q.qType === 'assertion' ? 'Reason (R)' : 'Statement II'}
              </span>
              <p className="text-sm text-white/90">{q.statementB}</p>
            </div>
          </div>
        )}

        {q.qType === 'match' && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-4">
            <div className="flex-1 space-y-2">
              <div className="text-xs font-black text-cyan-400 uppercase text-center mb-3 border-b border-white/10 pb-2">Column I</div>
              {q.matchLeft?.map((item, i) => item && (
                <div key={i} className="flex gap-3 items-center text-sm text-white/80">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-black shrink-0">{['A','B','C','D'][i]}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="text-xs font-black text-cyan-400 uppercase text-center mb-3 border-b border-white/10 pb-2">Column II</div>
              {q.matchRight?.map((item, i) => item && (
                <div key={i} className="flex gap-3 items-center text-sm text-white/80">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-black shrink-0">{['P','Q','R','S'][i]}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            let displayText = opt.text;
            if (!displayText && q.qType === 'assertion') {
              if (i === 0) displayText = 'Both (A) and (R) are true and (R) is the correct explanation of (A)';
              if (i === 1) displayText = 'Both (A) and (R) are true but (R) is not the correct explanation of (A)';
              if (i === 2) displayText = '(A) is true but (R) is false';
              if (i === 3) displayText = '(A) is false but (R) is true';
            }
            if (!displayText && q.qType === 'statement') {
              if (i === 0) displayText = 'Both Statement I and Statement II are correct';
              if (i === 1) displayText = 'Both Statement I and Statement II are incorrect';
              if (i === 2) displayText = 'Statement I is correct but Statement II is incorrect';
              if (i === 3) displayText = 'Statement I is incorrect but Statement II is correct';
            }

            const isCorrect = q.correctIndex === i;
            return (
              <div
                key={i}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
                  isCorrect ? 'border-emerald-500/50' : 'border-white/8'
                }`}
                style={{ background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)' }}
              >
                {/* Letter Bubble */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black transition-colors ${
                    isCorrect
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/10 text-white/50 border border-white/20'
                  }`}
                >
                  {isCorrect ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : LABELS[i]}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-2">
                  {displayText && (
                    <span className={`text-sm leading-relaxed ${isCorrect ? 'text-emerald-300 font-semibold' : 'text-white/90'}`}>
                      {displayText}
                    </span>
                  )}
                  {opt.imageUrl && <img src={opt.imageUrl} alt={`Option ${LABELS[i]}`} className="max-h-32 object-contain rounded-lg border border-white/10" />}
                </div>

                {isCorrect && (
                  <span className="text-[10px] font-black text-emerald-400 shrink-0 ml-2 mt-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 uppercase tracking-wider">
                    Correct
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Solutions: Text & Video Solution Tabs */}
        <QuestionSolutionTabs
          textSolution={q.solutionExplanation || q.explanation}
          videoUrl={q.videoSolutionUrl || q.videoSolution}
          defaultTab={(q.solutionExplanation || q.explanation) ? 'text' : 'video'}
        />

        {/* Meta */}
        <div className="flex items-center gap-4 text-[11px] text-white/35 pt-3 border-t border-white/8">
          {q.source && <span>Source: <strong className="text-white/55">{sourceLabel(q.source)}</strong></span>}
          {q.year && <span>Year: <strong className="text-white/55">{q.year}</strong></span>}
          {q.createdAt && <span className="ml-auto">Added: <strong className="text-white/55">{new Date(q.createdAt).toLocaleDateString()}</strong></span>}
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ─── Redesigned Question Bank Component (Flashcards Aesthetic) ────────────────

const QuestionBank: React.FC<{
  questions: Question[];
  selectedQuestions: string[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: (ids: string[]) => void;
  onAdd: () => void;
  onBulkAdd?: (qs: Question[]) => void;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  onDuplicate: (q: Question) => void;
  onOpenTestBuilder: () => void;
  onOpenDailyStatusModal: () => void;
  onOpenAddToStatusModal: () => void;
}> = ({ questions, selectedQuestions, toggleSelect, toggleSelectAll, onAdd, onBulkAdd, onEdit, onDelete, onDuplicate, onOpenTestBuilder, onOpenDailyStatusModal, onOpenAddToStatusModal }) => {
  const [search, setSearch] = useState('');
  const [selectedExam, setSelectedExam] = useState<ExamType>('neet');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<QSource | 'all'>('all');
  const [selectedDiff, setSelectedDiff] = useState<Difficulty | 'all'>('all');
  const [selectedType, setSelectedType] = useState<QType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewTarget, setPreviewTarget] = useState<Question | null>(null);

  const availableChapters = useMemo(() => Array.from(new Set(questions.filter(q => (selectedSubject === 'all' || q.subjectName === selectedSubject) && q.exam === selectedExam && q.chapterTitle).map(q => q.chapterTitle))).sort(), [questions, selectedSubject, selectedExam]);
  const availableTopics = useMemo(() => Array.from(new Set(questions.filter(q => (selectedSubject === 'all' || q.subjectName === selectedSubject) && q.exam === selectedExam && (selectedChapter === 'all' || q.chapterTitle === selectedChapter) && q.topicTitle).map(q => q.topicTitle))).sort(), [questions, selectedSubject, selectedExam, selectedChapter]);
  const availableYears = useMemo(() => Array.from(new Set(questions.filter(q => q.source === 'pyq' && q.year).map(q => q.year as string))).sort().reverse(), [questions]);

  // Available subjects based on exam
  const subjectList = useMemo(() => {
    if (selectedExam === 'neet') {
      return ['all', 'Biology', 'Physics', 'Chemistry'];
    }
    return ['all', 'Physics', 'Chemistry', 'Mathematics'];
  }, [selectedExam]);

  // Reset subject filter if invalid on exam switch
  useEffect(() => {
    if (selectedSubject !== 'all' && !subjectList.includes(selectedSubject)) {
      setSelectedSubject('all');
    }
  }, [selectedExam, subjectList, selectedSubject]);

  // Filter questions
  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (q.exam !== selectedExam) return false;
      if (selectedSubject !== 'all' && !q.subjectName.toLowerCase().includes(selectedSubject.toLowerCase())) return false;
      if (selectedSource !== 'all' && q.source !== selectedSource) return false;
      if (selectedDiff !== 'all' && q.difficulty !== selectedDiff) return false;
      if (selectedType !== 'all' && q.qType !== selectedType) return false;
      if (statusFilter !== 'all' && q.status !== statusFilter) return false;
      if (selectedChapter !== 'all' && q.chapterTitle !== selectedChapter) return false;
      if (selectedTopic !== 'all' && q.topicTitle !== selectedTopic) return false;
      if (selectedYear !== 'all' && q.year !== selectedYear) return false;

      if (!search.trim()) return true;
      const s = search.toLowerCase();
      return (
        q.questionText.toLowerCase().includes(s) ||
        q.chapterTitle.toLowerCase().includes(s) ||
        q.topicTitle.toLowerCase().includes(s) ||
        (q.year || '').toLowerCase().includes(s)
      );
    });
  }, [questions, selectedExam, selectedSubject, selectedSource, selectedDiff, selectedType, statusFilter, selectedChapter, selectedTopic, selectedYear, search]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedSubject('all');
    setSelectedSource('all');
    setSelectedDiff('all');
    setSelectedType('all');
    setStatusFilter('all');
    setSelectedChapter('all');
    setSelectedTopic('all');
    setSelectedYear('all');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      {/* Top Control Bar: Search + Add Button */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions by text, chapter, topic, or year tag..."
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--text-primary)] placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-primary)] shadow-sm transition-all"
            />
          </div>

          {/* Add Button and Action */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={onOpenDailyStatusModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black text-purple-300 transition-all cursor-pointer shadow-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 relative overflow-hidden hover-shine-effect"
            >
              <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
              <span>Manage Status Bar</span>
            </button>

            {selectedQuestions.length > 0 && (
              <>
                <button
                  onClick={onOpenTestBuilder}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black text-black transition-all cursor-pointer shadow-lg bg-emerald-400 hover:bg-emerald-300"
                >
                  <span>Create Test ({selectedQuestions.length})</span>
                </button>
                <button
                  onClick={onOpenAddToStatusModal}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black text-white transition-all cursor-pointer shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 border border-purple-400/40 relative overflow-hidden hover-shine-effect"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span>Add to Status ({selectedQuestions.length})</span>
                </button>
              </>
            )}
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black text-black transition-all cursor-pointer shadow-lg active:scale-95"
              style={{
                background: 'linear-gradient(135deg,#00f0ff,#0066ff)',
                boxShadow: '0 0 20px rgba(0,240,255,0.45)'
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Row 2: Exam Toggles & CSV Tools */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Exam Toggles (NEET / JEE) */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] w-fit">
            {(['neet', 'jee'] as const).map(e => (
              <button
                key={e}
                onClick={() => setSelectedExam(e)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  selectedExam === e
                    ? 'bg-[var(--color-primary)] text-black shadow-md'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                {e === 'neet' ? <Flame className="w-3.5 h-3.5" /> : <Atom className="w-3.5 h-3.5" />}
                <span>{e === 'neet' ? 'NEET (UG)' : 'JEE Main'}</span>
              </button>
            ))}
          </div>

          {/* Tools Row (Below Add Question) */}
          <div className="flex justify-end">
            <CsvUploader 
              onUploadSuccess={(qs) => onBulkAdd ? onBulkAdd(qs) : qs.forEach(q => onDuplicate(q))} 
            />
          </div>
        </div>
      </div>

      {/* Subject Navigation Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto custom-scrollbar pb-2 border-b border-[var(--border-color)]">
        {subjectList.map(subj => {
          const isActive = selectedSubject === subj;
          return (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`shrink-0 px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all border cursor-pointer ${
                isActive
                  ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)] shadow-sm'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] hover:text-white'
              }`}
            >
              {subj === 'all' ? 'All Subjects' : subj}
            </button>
          );
        })}
      </div>

      {/* Sub-Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={e => {
              setSelectedSource(e.target.value as QSource | 'all');
              if (e.target.value !== 'pyq') setSelectedYear('all');
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-white/10 border border-white/15 outline-none cursor-pointer"
          >
            <option value="all" className="bg-gray-900">All Sources</option>
            {SOURCE_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-gray-900">{s.label}</option>)}
          </select>
          
          {/* Year Filter (Only if PYQ) */}
          {selectedSource === 'pyq' && (
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 outline-none cursor-pointer text-[var(--color-primary)]"
            >
              <option value="all" className="bg-gray-900">All Years</option>
              {availableYears.map(y => <option key={y} value={y} className="bg-gray-900">{y}</option>)}
            </select>
          )}

          {/* Chapter Filter */}
          <select
            value={selectedChapter}
            onChange={e => { setSelectedChapter(e.target.value); setSelectedTopic('all'); }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-white/10 border border-white/15 outline-none cursor-pointer max-w-[140px] truncate"
          >
            <option value="all" className="bg-gray-900">All Chapters</option>
            {availableChapters.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
          </select>

          {/* Topic Filter */}
          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            disabled={selectedChapter === 'all'}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-white/10 border border-white/15 outline-none cursor-pointer max-w-[140px] truncate disabled:opacity-50"
          >
            <option value="all" className="bg-gray-900">All Topics</option>
            {availableTopics.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
          </select>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10">
            {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => setSelectedDiff(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                  selectedDiff === d
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Question Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value as QType | 'all')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-white/10 border border-white/15 outline-none cursor-pointer"
          >
            <option value="all" className="bg-gray-900">All Question Types</option>
            {Q_TYPE_OPTIONS.map(t => <option key={t.value} value={t.value} className="bg-gray-900">{t.label}</option>)}
          </select>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10">
            {(['all', 'published', 'draft'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                  statusFilter === s
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40 font-mono">
            {filtered.length} Questions
          </span>
          <span className="text-xs font-bold text-cyan-400">
            {selectedQuestions.length} Selected
          </span>

          <button
            onClick={() => toggleSelectAll(filtered.map(q => q.id))}
            title="Select all filtered questions"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white/70 bg-white/10 hover:bg-white/20 hover:text-white border border-white/15 transition-all cursor-pointer"
          >
            <Check className="w-3 h-3" />
            <span>Select All</span>
          </button>

          {(search || selectedSubject !== 'all' || selectedSource !== 'all' || selectedDiff !== 'all' || selectedType !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white/70 bg-white/10 hover:bg-white/20 hover:text-white border border-white/15 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
              }`}
              title="Flashcard Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
              }`}
              title="Table / List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Questions Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm font-medium">
            {questions.length === 0
              ? 'No questions found. Click "Add Question" to start building your bank!'
              : 'No questions match your selected filter criteria.'}
          </p>
          <button
            onClick={onAdd}
            className="mt-4 px-5 py-2.5 rounded-xl text-xs font-black text-black bg-cyan-400 hover:bg-cyan-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Question Now
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Flashcard Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((q, idx) => (
            <CreatorQuestionCard
              key={q.id}
              question={q}
              index={idx}
              isSelected={selectedQuestions.includes(q.id)}
              onToggleSelect={() => toggleSelect(q.id)}
              onPreview={() => setPreviewTarget(q)}
              onEdit={() => onEdit(q)}
              onDelete={() => onDelete(q.id)}
              onDuplicate={() => onDuplicate(q)}
            />
          ))}
        </div>
      ) : (
        /* Compact List View */
        <div className="space-y-2.5">
          {filtered.map((q, idx) => {
            const isPub = q.status === 'published';
            const isSelected = selectedQuestions.includes(q.id);
            return (
              <div
                key={q.id}
                onClick={() => setPreviewTarget(q)}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected ? 'bg-cyan-500/10 border-cyan-400/50' : 'bg-white/5 border-white/10 hover:border-cyan-400/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(q.id);
                    }}
                    title={isSelected ? "Deselect question" : "Select question"}
                    className="shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
                      borderColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                      color: isSelected ? '#000000' : 'transparent'
                    }}
                  >
                    <Check className={`w-2.5 h-2.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-70 text-white'}`} />
                  </button>
                  <span className="w-6 text-xs font-mono font-bold text-white/30 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-cyan-400/20 text-cyan-300 shrink-0">
                    {q.exam.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-white/10 text-white/70 shrink-0">
                    {q.qType}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white/90 truncate flex-1">
                    {q.questionText || '(Figure Question)'}
                  </p>
                  <span className="text-[11px] text-white/40 hidden md:block truncate max-w-[160px] shrink-0">
                    {q.chapterTitle}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase shrink-0 ${
                    isPub ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {q.status}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setPreviewTarget(q)}
                    className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(q)}
                    className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicate(q)}
                    className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(q.id)}
                    className="p-1.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Question Preview Modal */}
      {previewTarget && (() => {
        const currentIndex = filtered.findIndex(q => q.id === previewTarget.id);
        const hasPrev = currentIndex > 0;
        const hasNext = currentIndex !== -1 && currentIndex < filtered.length - 1;

        return (
          <QuestionPreviewModal
            question={previewTarget}
            onClose={() => setPreviewTarget(null)}
            onEdit={() => {
              const target = previewTarget;
              setPreviewTarget(null);
              onEdit(target);
            }}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrev={() => hasPrev && setPreviewTarget(filtered[currentIndex - 1])}
            onNext={() => hasNext && setPreviewTarget(filtered[currentIndex + 1])}
          />
        );
      })()}
    </div>
  );
};

// ─── Creator Page (Root) ──────────────────────────────────────────────────────

type CreatorView = 'bank' | 'add' | 'edit' | 'tests';

export const CreatorPage: React.FC = () => {
  const [view, setViewInternal] = useState<CreatorView>(() => {
    const segments = window.location.pathname.split('/');
    if (segments[1] === 'creator-studio' && segments[2]) {
      if (['bank', 'add', 'edit', 'tests'].includes(segments[2])) {
        return segments[2] as CreatorView;
      }
    }
    return 'bank';
  });

  useEffect(() => {
    const handlePopState = () => {
      const segments = window.location.pathname.split('/');
      if (segments[1] === 'creator-studio' && segments[2]) {
        if (['bank', 'add', 'edit', 'tests'].includes(segments[2])) {
          setViewInternal(segments[2] as CreatorView);
        }
      } else {
        setViewInternal('bank');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setView = (v: CreatorView) => {
    setViewInternal(v);
    window.history.pushState(null, '', `/creator-studio/${v}`);
  };
  const [editTarget, setEditTarget] = useState<Question | undefined>(undefined);
  const [questions, setQuestions]   = useState<Question[]>(loadQuestions);
  const [exam, setExam]             = useState<ExamType>('neet');
  
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isTestBuilderOpen, setIsTestBuilderOpen] = useState(false);
  const [isDailyStatusModalOpen, setIsDailyStatusModalOpen] = useState(false);
  const [isAddToStatusModalOpen, setIsAddToStatusModalOpen] = useState(false);
  const { tests, addTest } = useCreatorStudioStorage();
  const toggleSelect = (id: string) => {
    setSelectedQuestions(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const toggleSelectAll = (ids: string[]) => {
    const allSelected = ids.length > 0 && ids.every(id => selectedQuestions.includes(id));
    if (allSelected) {
      setSelectedQuestions(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setSelectedQuestions(prev => Array.from(new Set([...prev, ...ids])));
    }
  };

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
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    updateQuestions(questions.filter(q => q.id !== id));
  };

  const handleDuplicate = (q: Question) => {
    const copy: Question = {
      ...q,
      id: `q_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    updateQuestions([copy, ...questions]);
  };

  const handleBulkAdd = (newQs: Question[]) => {
    updateQuestions([...newQs, ...questions]);
  };

  // Add Question / Edit Question Page remains 100% UNTOUCHED
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
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[var(--border-color)]">
        <button
          onClick={() => setView('bank')}
          className={`pb-3 px-2 text-sm font-black transition-colors border-b-2 ${
            view === 'bank' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          Questions
        </button>
        <button
          onClick={() => setView('tests')}
          className={`pb-3 px-2 text-sm font-black transition-colors border-b-2 ${
            view === 'tests' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          Custom Tests
        </button>
      </div>

      {view === 'tests' ? (
        <CreatorStudioTestsView tests={tests} />
      ) : (
        <QuestionBank
          questions={questions}
          selectedQuestions={selectedQuestions}
          toggleSelect={toggleSelect}
          toggleSelectAll={toggleSelectAll}
          onAdd={() => { setEditTarget(undefined); setView('add'); }}
          onBulkAdd={handleBulkAdd}
          onEdit={q => { setEditTarget(q); setView('edit'); }}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onOpenTestBuilder={() => setIsTestBuilderOpen(true)}
          onOpenDailyStatusModal={() => setIsDailyStatusModalOpen(true)}
          onOpenAddToStatusModal={() => setIsAddToStatusModalOpen(true)}
        />
      )}

      {isTestBuilderOpen && (
        <TestBuilderModal
          selectedQuestions={questions.filter(q => selectedQuestions.includes(q.id))}
          onClose={() => setIsTestBuilderOpen(false)}
          onSave={(test) => {
            addTest(test);
            setIsTestBuilderOpen(false);
            setView('tests');
            setSelectedQuestions([]); // clear selection after creating test
          }}
        />
      )}

      {isDailyStatusModalOpen && (
        <DailyStatusManagerModal
          isOpen={isDailyStatusModalOpen}
          onClose={() => setIsDailyStatusModalOpen(false)}
        />
      )}

      {isAddToStatusModalOpen && (
        <AddToStatusModal
          selectedQuestions={questions.filter(q => selectedQuestions.includes(q.id))}
          onClose={() => setIsAddToStatusModalOpen(false)}
          onSuccess={() => setSelectedQuestions([])}
        />
      )}
    </div>
  );
};

const CreatorStudioTestsView: React.FC<{ tests: CustomTest[] }> = ({ tests }) => {
  return (
    <div className="space-y-4">
      {tests.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-white/40 text-sm font-medium">No custom tests found. Select questions from the Questions tab to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map(t => (
            <div key={t.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all">
              <h3 className="text-lg font-black text-white">{t.title}</h3>
              <div className="mt-3 flex items-center gap-3 text-xs text-white/50">
                <span className="uppercase text-cyan-400">{t.exam}</span>
                <span>•</span>
                <span>{t.durationMins} mins</span>
                <span>•</span>
                <span>{t.totalMarks} marks</span>
              </div>
              <p className="mt-2 text-xs text-white/40">{t.questions.length} Questions</p>
              
              <button 
                onClick={() => window.location.href = `/tools/mock-tests/active/${t.id}`}
                className="mt-4 w-full py-2 bg-cyan-500/20 text-cyan-400 rounded-xl font-bold hover:bg-cyan-500/30 transition-colors"
              >
                Preview Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
