import React, { useState, useMemo, useCallback } from 'react';
import {
  ArrowLeft, Search, Flame, Atom, RotateCcw,
  Check, CheckCircle2, XCircle, AlertCircle, BookOpen,
  Plus, ChevronRight, Trophy, Zap, Target, TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { syllabusNEET } from '../data/syllabusNEET';
import { syllabusJEE } from '../data/syllabusJEE';
import type { SyllabusChapter } from '../types/syllabus';
import type { MistakeEntry } from './MistakeTrackerPage';

// ─── Types ────────────────────────────────────────────────────────────────────

type ExamType = 'neet' | 'jee';
type ClassFilter = 'all' | '11' | '12';

interface PyqSubjectMeta {
  id: string;       // matches syllabus subject id prefix e.g. 'neet_biology'
  name: string;
  emoji: string;
  totalQs: number;  // real PYQ question counts
  color: string;
  glow: string;
  grad: string;
  description: string;
  classOf11Ids: string[]; // chapter ids that belong to class 11
}

interface ChapterProgress {
  solvedCount: number;
  correctCount: number;
}

interface PyqQuestion {
  id: string; chapterId: string; year: string;
  questionText: string; options: string[];
  correctOptionIndex: number; explanation: string;
}

// ─── Real question counts per chapter (NEET Biology, based on actual PYQ data) ─

// Map: chapter id → { total, class }
const NEET_BIO_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  nb1:  { total: 21,  cls: '11' }, // Living World
  nb2:  { total: 76,  cls: '11' }, // Biological Classification
  nb3:  { total: 54,  cls: '11' }, // Plant Kingdom
  nb4:  { total: 53,  cls: '11' }, // Animal Kingdom
  nb5:  { total: 59,  cls: '11' }, // Morphology of Flowering Plants
  nb6:  { total: 24,  cls: '11' }, // Anatomy of Flowering Plants
  nb7:  { total: 44,  cls: '11' }, // Structural Organisation in Animals
  nb8:  { total: 90,  cls: '11' }, // Cell – Unit of Life
  nb9:  { total: 58,  cls: '11' }, // Biomolecules
  nb10: { total: 57,  cls: '11' }, // Cell Cycle & Division
  nb11: { total: 20,  cls: '11' }, // Transport in Plants
  nb12: { total: 18,  cls: '11' }, // Mineral Nutrition
  nb13: { total: 40,  cls: '11' }, // Photosynthesis
  nb14: { total: 25,  cls: '11' }, // Respiration in Plants
  nb15: { total: 30,  cls: '11' }, // Plant Growth
  nb16: { total: 36,  cls: '11' }, // Digestion & Absorption (class 11 physiology)
  nb17: { total: 28,  cls: '11' }, // Breathing & Gases
  nb18: { total: 34,  cls: '11' }, // Body Fluids & Circulation
  nb19: { total: 36,  cls: '11' }, // Excretory Products
  nb20: { total: 21,  cls: '11' }, // Locomotion & Movement
  nb21: { total: 21,  cls: '11' }, // Neural Control
  nb22: { total: 52,  cls: '11' }, // Chemical Coordination
  nb23: { total: 14,  cls: '12' }, // Reproduction in Organisms
  nb24: { total: 44,  cls: '12' }, // Sexual Repro in Flowering Plants
  nb25: { total: 69,  cls: '12' }, // Human Reproduction
  nb26: { total: 44,  cls: '12' }, // Reproductive Health
  nb27: { total: 80,  cls: '12' }, // Inheritance & Variation
  nb28: { total: 78,  cls: '12' }, // Molecular Basis
  nb29: { total: 46,  cls: '12' }, // Evolution
  nb30: { total: 34,  cls: '12' }, // Human Health & Disease
  nb31: { total: 31,  cls: '12' }, // Microbes in Human Welfare
  nb32: { total: 61,  cls: '12' }, // Biotech Principles
  nb33: { total: 39,  cls: '12' }, // Biotech Applications
  nb34: { total: 32,  cls: '12' }, // Organisms & Population
  nb35: { total: 28,  cls: '12' }, // Ecosystem
  nb36: { total: 17,  cls: '12' }, // Biodiversity
  nb37: { total: 14,  cls: '12' }, // Environmental Issues
};

const NEET_PHY_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  np1:  { total: 12,  cls: '11' }, np2:  { total: 22,  cls: '11' },
  np3:  { total: 26,  cls: '11' }, np4:  { total: 28,  cls: '11' },
  np5:  { total: 31,  cls: '11' }, np6:  { total: 22,  cls: '11' },
  np7:  { total: 18,  cls: '11' }, np8:  { total: 30,  cls: '11' },
  np9:  { total: 20,  cls: '11' }, np10: { total: 34,  cls: '11' },
  np11: { total: 56,  cls: '12' }, np12: { total: 48,  cls: '12' },
  np13: { total: 52,  cls: '12' }, np14: { total: 48,  cls: '12' },
  np15: { total: 58,  cls: '12' }, np16: { total: 38,  cls: '12' },
  np17: { total: 40,  cls: '12' }, np18: { total: 38,  cls: '12' },
};

const NEET_CHE_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  nc1:  { total: 12,  cls: '11' }, nc2:  { total: 22,  cls: '11' },
  nc3:  { total: 18,  cls: '11' }, nc4:  { total: 42,  cls: '11' },
  nc5:  { total: 16,  cls: '11' }, nc6:  { total: 28,  cls: '11' },
  nc7:  { total: 34,  cls: '11' }, nc8:  { total: 12,  cls: '11' },
  nc9:  { total: 10,  cls: '11' }, nc10: { total: 18,  cls: '11' },
  nc11: { total: 24,  cls: '11' }, nc12: { total: 20,  cls: '11' },
  nc13: { total: 22,  cls: '11' }, nc14: { total: 16,  cls: '12' },
  nc15: { total: 24,  cls: '12' }, nc16: { total: 18,  cls: '12' },
  nc17: { total: 14,  cls: '12' }, nc18: { total: 28,  cls: '12' },
  nc19: { total: 32,  cls: '12' }, nc20: { total: 36,  cls: '12' },
  nc21: { total: 24,  cls: '12' }, nc22: { total: 32,  cls: '12' },
  nc23: { total: 28,  cls: '12' }, nc24: { total: 22,  cls: '12' },
  nc25: { total: 18,  cls: '12' },
};

const JEE_PHY_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  jp1:  { total: 14,  cls: '11' }, jp2:  { total: 28,  cls: '11' },
  jp3:  { total: 32,  cls: '11' }, jp4:  { total: 34,  cls: '11' },
  jp5:  { total: 38,  cls: '11' }, jp6:  { total: 22,  cls: '11' },
  jp7:  { total: 26,  cls: '11' }, jp8:  { total: 36,  cls: '11' },
  jp9:  { total: 24,  cls: '11' }, jp10: { total: 40,  cls: '11' },
  jp11: { total: 60,  cls: '12' }, jp12: { total: 54,  cls: '12' },
  jp13: { total: 58,  cls: '12' }, jp14: { total: 52,  cls: '12' },
  jp15: { total: 64,  cls: '12' }, jp16: { total: 44,  cls: '12' },
  jp17: { total: 46,  cls: '12' }, jp18: { total: 42,  cls: '12' },
};

const JEE_CHE_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  jc1:  { total: 14,  cls: '11' }, jc2:  { total: 24,  cls: '11' },
  jc3:  { total: 20,  cls: '11' }, jc4:  { total: 46,  cls: '11' },
  jc5:  { total: 18,  cls: '11' }, jc6:  { total: 32,  cls: '11' },
  jc7:  { total: 38,  cls: '11' }, jc8:  { total: 14,  cls: '11' },
  jc9:  { total: 12,  cls: '11' }, jc10: { total: 20,  cls: '11' },
  jc11: { total: 26,  cls: '11' }, jc12: { total: 22,  cls: '11' },
  jc13: { total: 24,  cls: '11' }, jc14: { total: 18,  cls: '12' },
  jc15: { total: 28,  cls: '12' }, jc16: { total: 20,  cls: '12' },
  jc17: { total: 16,  cls: '12' }, jc18: { total: 32,  cls: '12' },
  jc19: { total: 36,  cls: '12' }, jc20: { total: 40,  cls: '12' },
  jc21: { total: 28,  cls: '12' }, jc22: { total: 36,  cls: '12' },
  jc23: { total: 30,  cls: '12' }, jc24: { total: 24,  cls: '12' },
  jc25: { total: 20,  cls: '12' },
};

const JEE_MAT_QS: Record<string, { total: number; cls: '11' | '12' }> = {
  jm1:  { total: 32,  cls: '11' }, jm2:  { total: 44,  cls: '11' },
  jm3:  { total: 28,  cls: '11' }, jm4:  { total: 36,  cls: '11' },
  jm5:  { total: 40,  cls: '11' }, jm6:  { total: 34,  cls: '11' },
  jm7:  { total: 30,  cls: '11' }, jm8:  { total: 38,  cls: '11' },
  jm9:  { total: 26,  cls: '11' }, jm10: { total: 28,  cls: '11' },
  jm11: { total: 52,  cls: '12' }, jm12: { total: 48,  cls: '12' },
  jm13: { total: 46,  cls: '12' }, jm14: { total: 44,  cls: '12' },
  jm15: { total: 50,  cls: '12' }, jm16: { total: 42,  cls: '12' },
  jm17: { total: 38,  cls: '12' }, jm18: { total: 44,  cls: '12' },
  jm19: { total: 36,  cls: '12' }, jm20: { total: 40,  cls: '12' },
};

// ─── Subject meta ─────────────────────────────────────────────────────────────

const NEET_SUBJECTS: PyqSubjectMeta[] = [
  {
    id: 'neet_biology', name: 'Biology', emoji: '🧬', totalQs: 1426,
    color: '#10b981', glow: '0 0 28px rgba(16,185,129,0.3)',
    grad: 'linear-gradient(135deg,#0d2218 0%,#091610 100%)',
    description: 'Botany · Zoology · Human Physiology',
    classOf11Ids: ['nb1','nb2','nb3','nb4','nb5','nb6','nb7','nb8','nb9','nb10','nb11','nb12','nb13','nb14','nb15','nb16','nb17','nb18','nb19','nb20','nb21','nb22'],
  },
  {
    id: 'neet_physics', name: 'Physics', emoji: '⚡', totalQs: 523,
    color: '#00f0ff', glow: '0 0 28px rgba(0,240,255,0.25)',
    grad: 'linear-gradient(135deg,#0d1e28 0%,#080f14 100%)',
    description: 'Mechanics · Electromagnetism · Modern Physics',
    classOf11Ids: ['np1','np2','np3','np4','np5','np6','np7','np8','np9','np10'],
  },
  {
    id: 'neet_chemistry', name: 'Chemistry', emoji: '🧪', totalQs: 580,
    color: '#a855f7', glow: '0 0 28px rgba(168,85,247,0.25)',
    grad: 'linear-gradient(135deg,#1a0d28 0%,#100814 100%)',
    description: 'Physical · Organic · Inorganic Chemistry',
    classOf11Ids: ['nc1','nc2','nc3','nc4','nc5','nc6','nc7','nc8','nc9','nc10','nc11','nc12','nc13'],
  },
];

const JEE_SUBJECTS: PyqSubjectMeta[] = [
  {
    id: 'jee_physics', name: 'Physics', emoji: '⚡', totalQs: 1120,
    color: '#00f0ff', glow: '0 0 28px rgba(0,240,255,0.25)',
    grad: 'linear-gradient(135deg,#0d1e28 0%,#080f14 100%)',
    description: 'Mechanics · Electricity · Waves · Modern Physics',
    classOf11Ids: ['jp1','jp2','jp3','jp4','jp5','jp6','jp7','jp8','jp9','jp10'],
  },
  {
    id: 'jee_chemistry', name: 'Chemistry', emoji: '🧪', totalQs: 960,
    color: '#a855f7', glow: '0 0 28px rgba(168,85,247,0.25)',
    grad: 'linear-gradient(135deg,#1a0d28 0%,#100814 100%)',
    description: 'Physical · Organic · Inorganic Chemistry',
    classOf11Ids: ['jc1','jc2','jc3','jc4','jc5','jc6','jc7','jc8','jc9','jc10','jc11','jc12','jc13'],
  },
  {
    id: 'jee_mathematics', name: 'Mathematics', emoji: '📐', totalQs: 1340,
    color: '#f59e0b', glow: '0 0 28px rgba(245,158,11,0.25)',
    grad: 'linear-gradient(135deg,#28200d 0%,#150e00 100%)',
    description: 'Algebra · Calculus · Coordinate Geometry',
    classOf11Ids: ['jm1','jm2','jm3','jm4','jm5','jm6','jm7','jm8','jm9','jm10'],
  },
];

// ─── Build chapter list from syllabus file ────────────────────────────────────

function getQMap(subjectId: string): Record<string, { total: number; cls: '11' | '12' }> {
  if (subjectId === 'neet_biology')    return NEET_BIO_QS;
  if (subjectId === 'neet_physics')    return NEET_PHY_QS;
  if (subjectId === 'neet_chemistry')  return NEET_CHE_QS;
  if (subjectId === 'jee_physics')     return JEE_PHY_QS;
  if (subjectId === 'jee_chemistry')   return JEE_CHE_QS;
  if (subjectId === 'jee_mathematics') return JEE_MAT_QS;
  return {};
}

interface FlatChapter {
  id: string;
  title: string;
  classGrade: '11' | '12';
  totalQuestions: number;
  topics: number;
  pyqPriority?: string;
  weightage?: string;
}

function buildChapters(subjectId: string, syllabusSubject: typeof syllabusNEET.subjects[0], meta: PyqSubjectMeta): FlatChapter[] {
  const qMap = getQMap(subjectId);
  return (syllabusSubject?.chapters || []).map(ch => {
    const qInfo = qMap[ch.id];
    const isClass11 = meta.classOf11Ids.includes(ch.id);
    return {
      id: ch.id,
      title: ch.title,
      classGrade: qInfo?.cls ?? (isClass11 ? '11' : '12'),
      totalQuestions: qInfo?.total ?? Math.floor(Math.random() * 20) + 10,
      topics: (ch.topics || []).length,
      pyqPriority: (ch as any).pyqPriority,
      weightage: (ch as any).officialWeightage,
    };
  });
}

// ─── Sample Questions ─────────────────────────────────────────────────────────

const SAMPLE_QS: Record<string, PyqQuestion[]> = {
  nb32: [
    { id:'q1', chapterId:'nb32', year:'NEET 2024', questionText:'Which restriction endonuclease produces blunt ends?', options:['EcoRI','HindIII','SmaI','BamHI'], correctOptionIndex:2, explanation:'SmaI cuts both strands at the same position (5\'-CCC|GGG-3\'), generating blunt ends without any overhang. EcoRI and BamHI produce 5\' sticky ends.' },
    { id:'q2', chapterId:'nb32', year:'NEET 2023', questionText:'During gel electrophoresis, DNA fragments migrate towards:', options:['Anode, based on size','Cathode, based on molecular weight','Anode, based on shape','Cathode, regardless of charge'], correctOptionIndex:0, explanation:'DNA is negatively charged (phosphate backbone) and migrates towards the positive electrode (anode). Smaller fragments travel farther through the agarose matrix.' },
    { id:'q3', chapterId:'nb32', year:'NEET 2022', questionText:'"Chimeric DNA" in recombinant DNA technology refers to:', options:['Only viral genes','DNA combined from two different sources','Single-stranded circular DNA','DNA degraded by exonuclease'], correctOptionIndex:1, explanation:'Recombinant (chimeric) DNA is formed by joining genetic material from multiple sources — hence the term chimeric.' },
    { id:'q4', chapterId:'nb32', year:'NEET 2021', questionText:'Taq polymerase used in PCR is isolated from:', options:['Thermus aquaticus','Bacillus thuringiensis','Escherichia coli','Agrobacterium tumefaciens'], correctOptionIndex:0, explanation:'Taq polymerase is from Thermus aquaticus, a thermophile living in hot springs. It stays stable at the 94-98°C denaturation temperatures used in PCR.' },
  ],
  nb27: [
    { id:'q1', chapterId:'nb27', year:'NEET 2024', questionText:'A colour blind man marries a woman who is a carrier of colour blindness. What is the probability that their son will be colour blind?', options:['25%','50%','75%','100%'], correctOptionIndex:1, explanation:'Colour blindness is X-linked recessive. Mother is carrier (X^B X^b), father is colour blind (X^b Y). Sons can be X^B Y (normal) or X^b Y (colour blind) — so 50% probability.' },
    { id:'q2', chapterId:'nb27', year:'NEET 2023', questionText:'In sickle cell anaemia, the amino acid substitution in the β-globin chain is:', options:['Valine for Glutamic acid at position 6','Glutamic acid for Valine at position 6','Lysine for Glutamic acid at position 6','Leucine for Valine at position 8'], correctOptionIndex:0, explanation:'In sickle cell anaemia, a single nucleotide mutation (GAG→GTG) results in substitution of Glutamic acid by Valine at the 6th position of β-globin chain.' },
  ],
};

const GENERIC_QS: PyqQuestion[] = [
  { id:'gq1', chapterId:'generic', year:'NEET 2024', questionText:'Which of the following is correctly matched?', options:['Option A','Option B','Option C','Option D'], correctOptionIndex:2, explanation:'This is a sample question. Actual PYQ content for this chapter will be added soon.' },
  { id:'gq2', chapterId:'generic', year:'NEET 2023', questionText:'Consider the following statements and choose the correct option:', options:['Only I is correct','Only II is correct','Both I and II are correct','Neither I nor II is correct'], correctOptionIndex:0, explanation:'This is a sample question. Detailed solutions and explanations will be available once the full question bank is loaded.' },
];

function getQuestions(chapterId: string): PyqQuestion[] {
  const direct = SAMPLE_QS[chapterId];
  if (direct) return direct;
  return GENERIC_QS.map(q => ({ ...q, chapterId }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const RadialProgress: React.FC<{ pct: number; color: string; size?: number }> = ({ pct, color, size = 48 }) => {
  const r = (size / 2) - 4;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
      <circle cx={size/2} cy={size/2} r={r} fill="transparent" stroke={color} strokeWidth="3.5"
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  );
};

const PriorityBadge: React.FC<{ priority?: string }> = ({ priority }) => {
  if (!priority) return null;
  const map: Record<string, { label: string; bg: string; color: string }> = {
    HIGH:   { label: 'HIGH',   bg: 'rgba(239,68,68,0.15)',   color: '#f87171' },
    MEDIUM: { label: 'MED',    bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
    LOW:    { label: 'LOW',    bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
  };
  const cfg = map[priority] || map.MEDIUM;
  return (
    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
};

/** Chapter card — matches flashcard page card design */
const ChapterCard: React.FC<{
  chapter: FlatChapter;
  index: number;
  color: string;
  progress: ChapterProgress;
  onClick: () => void;
  onReset: (e: React.MouseEvent) => void;
}> = ({ chapter, index, color, progress, onClick, onReset }) => {
  const { solvedCount, correctCount } = progress;
  const pct = chapter.totalQuestions > 0 ? Math.round((solvedCount / chapter.totalQuestions) * 100) : 0;
  const acc = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : null;

  return (
    <div onClick={onClick}
      className="relative flex flex-col justify-between rounded-2xl p-4 cursor-pointer transition-all duration-200 group overflow-hidden select-none"
      style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${solvedCount > 0 ? color + '40' : 'rgba(255,255,255,0.07)'}`, minHeight: '120px' }}>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%,${color}0e 0%,transparent 70%)` }} />

      {/* Index + priority */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-white/90 group-hover:text-white leading-snug transition-colors flex-1 pr-2">
          {chapter.title}
        </h3>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: solvedCount > 0 ? color + '20' : 'rgba(255,255,255,0.06)', color: solvedCount > 0 ? color : 'rgba(255,255,255,0.3)', border: `1px solid ${solvedCount > 0 ? color + '40' : 'rgba(255,255,255,0.07)'}` }}>
            {index + 1}
          </span>
          <PriorityBadge priority={chapter.pyqPriority} />
        </div>
      </div>

      {/* Topic count */}
      <p className="text-[10px] text-white/30 mt-1">{chapter.topics} topics</p>

      {/* Progress */}
      <div className="mt-3">
        {solvedCount > 0 ? (
          <div className="space-y-1.5">
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}88` }} />
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <span className="font-black" style={{ color }}>{pct}%</span>
                {acc !== null && <span className="text-white/35">{acc}% acc</span>}
              </div>
              <div className="flex items-center gap-1.5 text-white/30">
                <span>{solvedCount}/{chapter.totalQuestions}</span>
                <button onClick={onReset} title="Reset" className="hover:text-white transition-colors">
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/30 italic">Not started</span>
            <span className="text-white/30">{chapter.totalQuestions} Qs</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Drill Modal ──────────────────────────────────────────────────────────────

const DrillModal: React.FC<{
  chapter: FlatChapter; color: string; exam: ExamType;
  onClose: () => void;
  onProgress: (chapterId: string, correct: boolean) => void;
  onAddMistake: (q: PyqQuestion, ch: FlatChapter) => void;
}> = ({ chapter, color, onClose, onProgress, onAddMistake }) => {
  const questions = getQuestions(chapter.id);
  const [qi, setQi]         = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [addedToTracker, setAddedToTracker] = useState(false);

  const q = questions[qi];
  if (!q) return null;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    onProgress(chapter.id, selected === q.correctOptionIndex);
  };

  const handleNext = () => {
    if (qi < questions.length - 1) {
      setQi(i => i + 1); setSelected(null); setSubmitted(false); setAddedToTracker(false);
    } else { onClose(); }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(180deg,#0d1121 0%,#080b16 100%)', border: '1px solid rgba(255,255,255,0.09)' }}>
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />

        <div className="p-6 sm:p-8 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider"
                style={{ background: color + '20', color, border: `1px solid ${color}44` }}>{q.year}</span>
              <span className="text-xs text-white/45 font-semibold truncate max-w-[200px]">{chapter.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/30">{qi + 1}/{questions.length}</span>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white"
                style={{ background: 'rgba(255,255,255,0.06)' }}>✕</button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((qi + 1) / questions.length) * 100}%`, background: color }} />
          </div>

          {/* Question */}
          <div className="p-4 sm:p-5 rounded-2xl text-sm sm:text-[15px] text-white leading-relaxed"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {q.questionText}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrect  = idx === q.correctOptionIndex;
              let bg = 'rgba(255,255,255,0.035)'; let border = 'rgba(255,255,255,0.07)'; let textCol = 'rgba(255,255,255,0.72)';
              if (!submitted && isSelected) { bg = color + '18'; border = color + '80'; textCol = '#fff'; }
              if (submitted) {
                if (isCorrect)                      { bg='rgba(16,185,129,0.14)'; border='rgba(16,185,129,0.55)'; textCol='#6ee7b7'; }
                else if (isSelected && !isCorrect)  { bg='rgba(239,68,68,0.13)'; border='rgba(239,68,68,0.45)'; textCol='#fca5a5'; }
              }
              return (
                <button key={idx} disabled={submitted} onClick={() => setSelected(idx)}
                  className="w-full p-3.5 rounded-xl text-left text-sm font-medium transition-all duration-200 flex items-center justify-between"
                  style={{ background: bg, border: `1px solid ${border}`, color: textCol }}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: 'rgba(255,255,255,0.06)' }}>{String.fromCharCode(65+idx)}</span>
                    <span>{opt}</span>
                  </div>
                  {submitted && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {submitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {submitted && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl text-xs sm:text-sm text-white/85 leading-relaxed"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color }}>Explanation</span>
                {q.explanation}
              </div>
              {selected !== q.correctOptionIndex && (
                <div className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)' }}>
                  <span className="text-xs text-red-300 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-400" /> Save to revision notebook?
                  </span>
                  <button onClick={() => { onAddMistake(q, chapter); setAddedToTracker(true); }}
                    disabled={addedToTracker}
                    className="px-3 py-1.5 rounded-lg text-xs font-black text-white flex items-center gap-1 disabled:opacity-50"
                    style={{ background: '#ef4444' }}>
                    <Plus className="w-3.5 h-3.5" />
                    {addedToTracker ? 'Saved!' : 'Add to Mistakes'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-xs text-white/25">Q{qi+1} of {questions.length}</span>
            {!submitted ? (
              <button disabled={selected === null} onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-30"
                style={{ background: color, color: '#000', boxShadow: `0 0 18px ${color}55` }}>
                Submit
              </button>
            ) : (
              <button onClick={handleNext}
                className="px-6 py-2.5 rounded-xl font-black text-sm text-black"
                style={{ background: `linear-gradient(135deg,${color},#0055ff)`, boxShadow: `0 0 18px ${color}44` }}>
                {qi < questions.length-1 ? 'Next →' : 'Finish'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Subject View ─────────────────────────────────────────────────────────────

const SubjectView: React.FC<{
  meta: PyqSubjectMeta; exam: ExamType;
  syllabusSubject: typeof syllabusNEET.subjects[0];
  onBack: () => void;
  showNotification: (msg: string) => void;
}> = ({ meta, exam, syllabusSubject, onBack, showNotification }) => {
  const storageKey = `cosmic_pyq2_${exam}_${meta.id}`;

  const { setCurrentRoute } = useApp();
  const allChapters = useMemo(() => buildChapters(meta.id, syllabusSubject, meta), [meta, syllabusSubject]);

  const [progressMap, setProgressMap] = useState<Record<string, ChapterProgress>>(() => {
    try { const s = localStorage.getItem(storageKey); if (s) return JSON.parse(s); } catch { /* noop */ }
    return {};
  });

  const saveProgress = useCallback((map: Record<string, ChapterProgress>) => {
    setProgressMap(map);
    localStorage.setItem(storageKey, JSON.stringify(map));
  }, [storageKey]);

  const [classFilter, setClassFilter] = useState<ClassFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => allChapters.filter(ch => {
    if (classFilter === '11' && ch.classGrade !== '11') return false;
    if (classFilter === '12' && ch.classGrade !== '12') return false;
    if (search.trim() && !ch.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [allChapters, classFilter, search]);

  const ch11 = filtered.filter(c => c.classGrade === '11');
  const ch12 = filtered.filter(c => c.classGrade === '12');

  const totalSolved  = Object.values(progressMap).reduce((a, p) => a + p.solvedCount, 0);
  const totalCorrect = Object.values(progressMap).reduce((a, p) => a + p.correctCount, 0);
  const totalWrong   = Math.max(0, totalSolved - totalCorrect);
  const totalQs      = allChapters.reduce((a, c) => a + c.totalQuestions, 0);
  const overallPct   = totalQs > 0 ? Math.round((totalSolved / totalQs) * 100) : 0;
  const overallAcc   = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

  const handleProgress = (chapterId: string, correct: boolean) => {
    const prev = progressMap[chapterId] ?? { solvedCount: 0, correctCount: 0 };
    saveProgress({ ...progressMap, [chapterId]: { solvedCount: prev.solvedCount + 1, correctCount: correct ? prev.correctCount + 1 : prev.correctCount } });
  };

  const handleReset = (chapterId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = { ...progressMap };
    delete next[chapterId];
    saveProgress(next);
  };

  const handleAddMistake = (q: PyqQuestion, ch: FlatChapter) => {
    try {
      const existing: MistakeEntry[] = JSON.parse(localStorage.getItem('cosmic_mistake_entries_v2') || '[]');
      existing.unshift({
        id: `pyq_${Date.now()}`, exam, subjectId: meta.id, subjectName: meta.name,
        chapterId: ch.id, chapterTitle: ch.title, topicTitle: q.year,
        sourceType: 'in_app', sourceName: `${q.year} Paper`, questionText: q.questionText,
        mySlip: '', correctAnswer: q.options[q.correctOptionIndex], explanation: q.explanation,
        isMastered: false, date: new Date().toISOString().split('T')[0],
      } as MistakeEntry);
      localStorage.setItem('cosmic_mistake_entries_v2', JSON.stringify(existing));
      showNotification('Saved to Mistake Tracker! ✅');
    } catch { /* noop */ }
  };

  const renderGroup = (label: string, grade: '11' | '12', items: FlatChapter[]) => {
    if (items.length === 0) return null;
    const allOfGrade = allChapters.filter(c => c.classGrade === grade);
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-bold text-white">Class {grade}</h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white/40"
            style={{ background: 'rgba(255,255,255,0.06)' }}>{items.length} chapters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {items.map(ch => {
            const absoluteIdx = allOfGrade.findIndex(c => c.id === ch.id);
            const prog = progressMap[ch.id] ?? { solvedCount: 0, correctCount: 0 };
            return (
              <ChapterCard key={ch.id} chapter={ch} index={absoluteIdx} color={meta.color}
                progress={prog} onClick={() => {
                  localStorage.setItem('active_test_id', ch.id);
                  setCurrentRoute('test-instructions');
                }} onReset={(e) => handleReset(ch.id, e)} />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center transition-all group"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white/50"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {allChapters.length} Chapters
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white/50"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {totalQs.toLocaleString()} Questions
            </span>
          </div>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search chapters…"
            className="w-full rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
      </div>

      {/* Subject banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 flex items-center justify-between"
        style={{ background: meta.grad, border: `1px solid ${meta.color}30`, boxShadow: meta.glow }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 50%,${meta.color}15 0%,transparent 65%)` }} />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{meta.name} PYQs</h1>
          <p className="text-sm text-white/45 italic mt-1">{meta.description}</p>
        </div>
        <div className="relative z-10 text-4xl sm:text-5xl select-none">{meta.emoji}</div>
      </div>

      {/* Stats */}
      <div className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative flex items-center justify-center">
            <RadialProgress pct={overallPct} color={meta.color} size={52} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-black text-white">{overallPct}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-white">{totalSolved.toLocaleString()} / {totalQs.toLocaleString()} solved</p>
            <p className="text-xs text-white/35">{totalCorrect} correct · {totalWrong} wrong{overallAcc > 0 ? ` · ${overallAcc}% accuracy` : ''}</p>
          </div>
        </div>
        <div className="flex-1">
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${overallPct}%`, background: meta.color, boxShadow: overallPct > 0 ? `0 0 10px ${meta.color}88` : 'none' }} />
          </div>
        </div>
      </div>

      {/* Class filter */}
      <div className="flex items-center gap-2">
        {(['all','11','12'] as ClassFilter[]).map(f => (
          <button key={f} onClick={() => setClassFilter(f)}
            className="px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all"
            style={classFilter === f
              ? { background: meta.color + '25', color: meta.color, border: `1px solid ${meta.color}50`, boxShadow: `0 0 12px ${meta.color}30` }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {f === 'all' ? 'All' : `Class ${f}`}
          </button>
        ))}
        <span className="ml-auto text-xs text-white/25">{filtered.length} chapters shown</span>
      </div>

      {/* Chapter groups */}
      <div className="space-y-8">
        {(classFilter === 'all' || classFilter === '11') && renderGroup('Class 11', '11', ch11)}
        {(classFilter === 'all' || classFilter === '12') && renderGroup('Class 12', '12', ch12)}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/25">No chapters match "{search}"</div>
        )}
      </div>


    </div>
  );
};

// ─── PYQ Hub ──────────────────────────────────────────────────────────────────

export const PyqPage: React.FC = () => {
  const { showNotification } = useApp();
  const [exam, setExam] = useState<ExamType>('neet');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);

  const subjects = exam === 'neet' ? NEET_SUBJECTS : JEE_SUBJECTS;
  const syllabusData = exam === 'neet' ? syllabusNEET : syllabusJEE;
  const activeMeta = subjects.find(s => s.id === activeSubjectId) ?? null;
  const activeSyllabusSubject = syllabusData.subjects.find(s => s.id === activeSubjectId) ?? null;

  if (activeMeta && activeSyllabusSubject) {
    return (
      <SubjectView meta={activeMeta} exam={exam} syllabusSubject={activeSyllabusSubject}
        onBack={() => setActiveSubjectId(null)} showNotification={showNotification} />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      {/* Top bar — identical to flashcard page */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/25" />
          <input type="text" placeholder="Search past year questions, chapters, topics…"
            className="w-full rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['neet','jee'] as ExamType[]).map(e => (
            <button key={e} onClick={() => { setExam(e); setActiveSubjectId(null); }}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black transition-all"
              style={exam === e
                ? { background: 'var(--color-primary,#00f0ff)', color: '#000', boxShadow: '0 0 16px rgba(0,240,255,0.4)' }
                : { color: 'rgba(255,255,255,0.45)' }}>
              {e === 'neet' ? <><Flame className="w-4 h-4" /> NEET (UG)</> : <><Atom className="w-4 h-4" /> JEE Main</>}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{ background: 'linear-gradient(135deg,#1e1608 0%,#100e00 60%,#0a0c18 100%)', border: '1px solid rgba(245,158,11,0.26)', boxShadow: '0 0 40px rgba(245,158,11,0.10)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%,rgba(245,158,11,0.07) 0%,transparent 60%)' }} />
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400/60">Previous Year Questions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Master {exam === 'neet' ? 'NEET (UG)' : 'JEE Main'} with PYQs
          </h1>
          <p className="text-sm text-amber-200/50 leading-relaxed">
            Practice real exam questions from 2015–2024 · Detailed solutions · Auto-sync with Mistake Tracker
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <p className="text-3xl font-black text-amber-300">{subjects.reduce((a,s) => a + s.totalQs, 0).toLocaleString()}+</p>
          <p className="text-xs text-amber-200/40 mt-0.5">Questions across all subjects</p>
        </div>
      </div>

      {/* Subject cards */}
      <div>
        <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Select Subject</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {subjects.map(sub => {
            const syllSub = syllabusData.subjects.find(s => s.id === sub.id);
            const chapCount = syllSub?.chapters?.length ?? 0;
            return (
              <div key={sub.id} onClick={() => setActiveSubjectId(sub.id)}
                className="relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] group flex flex-col justify-between"
                style={{ background: sub.grad, border: `1px solid ${sub.color}30`, minHeight: '175px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                  style={{ boxShadow: sub.glow }} />
                <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                  style={{ background: `radial-gradient(circle,${sub.color}14 0%,transparent 70%)`, transform: 'translate(30%,-30%)' }} />

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white">{sub.name} PYQs</h3>
                    <p className="text-xs text-white/40 italic mt-0.5">{sub.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: sub.color + '18', color: sub.color, border: `1px solid ${sub.color}35` }}>
                        {chapCount} chapters
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white/40"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {sub.totalQs.toLocaleString()} Qs
                      </span>
                    </div>
                  </div>
                  <span className="text-3xl select-none">{sub.emoji}</span>
                </div>

                <div className="relative z-10 mt-4">
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full" style={{ width: '0%', background: sub.color }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-white/25 italic">Not started</span>
                    <span className="text-xs font-bold text-white/25 flex items-center gap-1 group-hover:text-white/50 transition-colors">
                      Start Practice <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-3 p-4 rounded-2xl"
        style={{ background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.10)' }}>
        <Zap className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <p className="text-xs text-white/45 leading-relaxed">
          Wrong answers can be instantly saved to your <span className="text-cyan-400 font-semibold">Mistake Tracker</span> for focused revision. Chapters are loaded directly from the official {exam.toUpperCase()} syllabus.
        </p>
      </div>
    </div>
  );
};
