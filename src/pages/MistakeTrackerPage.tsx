import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  Plus,
  Search,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Trash2,
  Edit3,
  Star,
  Brain,
  Zap,
  Clock,
  HelpCircle,
  Target,
  ChevronDown,
  ChevronUp,
  Shuffle,
  X,
  ExternalLink,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type ExamType = 'NEET' | 'JEE' | 'ALL';
export type SubjectType = 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'Botany' | 'Zoology';

export type ErrorCategory =
  | 'calculation'
  | 'conceptual'
  | 'misread'
  | 'formula'
  | 'time_panic'
  | 'blind_guess';

export interface MistakeItem {
  id: string;
  exam: 'NEET' | 'JEE';
  subject: SubjectType;
  chapter: string;
  testName: string;
  questionNo?: string;
  marksLost: number; // usually 1 or 5 (loss of +4 plus -1)
  errorCategory: ErrorCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionText: string;
  myMistake: string;
  correctConcept: string;
  imageUrl?: string;
  isMastered: boolean;
  isStarred: boolean;
  date: string;
}

const ERROR_CATEGORY_CONFIG: Record<
  ErrorCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string }
> = {
  calculation: {
    label: 'Calculation / Silly Mistake',
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30'
  },
  conceptual: {
    label: 'Conceptual Gap',
    icon: Brain,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30'
  },
  misread: {
    label: 'Question Misread / Trap',
    icon: AlertCircle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30'
  },
  formula: {
    label: 'Formula Forgot / Misapplied',
    icon: BookOpen,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30'
  },
  time_panic: {
    label: 'Time Pressure / Panic Rush',
    icon: Clock,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30'
  },
  blind_guess: {
    label: 'Wild Guess / Fluke',
    icon: HelpCircle,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30'
  }
};

const DEFAULT_MISTAKES: MistakeItem[] = [
  {
    id: 'm-1',
    exam: 'NEET',
    subject: 'Biology',
    chapter: 'Genetics & Molecular Basis',
    testName: 'Allen All India Major Test-2',
    questionNo: 'Q142',
    marksLost: 5,
    errorCategory: 'misread',
    difficulty: 'Medium',
    questionText: 'Which of the following statements regarding transcription in prokaryotes is INCORRECT?',
    myMistake: 'I read "CORRECT" instead of "INCORRECT" in a rush, saw option (A) was correct and marked it immediately without checking all options.',
    correctConcept: 'Always circle "NOT / INCORRECT" with pen in the question paper first. Rho factor is required for termination, while Sigma factor is for initiation.',
    isMastered: false,
    isStarred: true,
    date: '2026-09-08'
  },
  {
    id: 'm-2',
    exam: 'JEE',
    subject: 'Physics',
    chapter: 'Electrostatics',
    testName: 'Aakash JEE Main Mock 5',
    questionNo: 'Q7',
    marksLost: 5,
    errorCategory: 'conceptual',
    difficulty: 'Hard',
    questionText: 'Electric potential inside a solid conducting sphere with charge Q and radius R at distance r = R/2.',
    myMistake: 'I used V = k*Q*r / R^2 confusing potential with electric field inside a non-conducting sphere!',
    correctConcept: 'Inside a conducting sphere, electric field E = 0. Therefore potential is uniform and equal to surface potential: V = k*Q / R everywhere from r = 0 to r = R.',
    isMastered: false,
    isStarred: true,
    date: '2026-09-09'
  },
  {
    id: 'm-3',
    exam: 'JEE',
    subject: 'Mathematics',
    chapter: 'Definite Integrals',
    testName: 'PW AITS Part Test',
    questionNo: 'Q22',
    marksLost: 5,
    errorCategory: 'calculation',
    difficulty: 'Medium',
    questionText: 'Evaluate integral from 0 to pi/2 of sin^4(x)/(sin^4(x) + cos^4(x)) dx.',
    myMistake: 'Applied King\'s property correctly, added I + I = pi/2, but forgot to divide by 2 at the end! Wrote pi/2 instead of pi/4.',
    correctConcept: '2I = b - a => 2I = pi/2 => I = pi/4. Always double check if 2I needs to be converted back to I before marking.',
    isMastered: true,
    isStarred: false,
    date: '2026-09-05'
  },
  {
    id: 'm-4',
    exam: 'NEET',
    subject: 'Chemistry',
    chapter: 'Coordination Compounds',
    testName: 'Target NEET PYQ Drill 2024',
    questionNo: 'Q79',
    marksLost: 5,
    errorCategory: 'formula',
    difficulty: 'Medium',
    questionText: 'Arrange [V(CO)6]-, [Cr(CO)6], and [Mn(CO)6]+ in order of increasing C-O bond length.',
    myMistake: 'I thought higher positive charge means stronger back-bonding and thus longer C-O bond.',
    correctConcept: 'More negative charge on central metal => higher electron density => stronger M-C synergic back-bonding => weaker C-O bond => LONGER C-O bond length. Order: [Mn(CO)6]+ < [Cr(CO)6] < [V(CO)6]-.',
    isMastered: false,
    isStarred: true,
    date: '2026-09-10'
  }
];

export const MistakeTrackerPage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  // State
  const [mistakes, setMistakes] = useState<MistakeItem[]>(() => {
    try {
      const saved = localStorage.getItem('cosmic_mistake_tracker');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_MISTAKES;
  });

  // Filters
  const [selectedExam, setSelectedExam] = useState<ExamType>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'MASTERED' | 'STARRED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // UI state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MistakeItem | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [isRevisionModeOpen, setIsRevisionModeOpen] = useState(false);
  const [revisionIndex, setRevisionIndex] = useState(0);
  const [showRevisionSolution, setShowRevisionSolution] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<MistakeItem>>({
    exam: 'NEET',
    subject: 'Physics',
    chapter: '',
    testName: '',
    questionNo: '',
    marksLost: 5,
    errorCategory: 'calculation',
    difficulty: 'Medium',
    questionText: '',
    myMistake: '',
    correctConcept: '',
    imageUrl: '',
    isMastered: false,
    isStarred: false,
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cosmic_mistake_tracker', JSON.stringify(mistakes));
    } catch {
      // ignore
    }
  }, [mistakes]);

  // Filtered Mistakes
  const filteredMistakes = useMemo(() => {
    return mistakes.filter((item) => {
      // Exam
      if (selectedExam !== 'ALL' && item.exam !== selectedExam) return false;

      // Subject
      if (selectedSubject !== 'ALL') {
        if (selectedSubject === 'Biology') {
          if (item.subject !== 'Biology' && item.subject !== 'Botany' && item.subject !== 'Zoology') return false;
        } else if (item.subject !== selectedSubject) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'ALL' && item.errorCategory !== selectedCategory) return false;

      // Status
      if (statusFilter === 'PENDING' && item.isMastered) return false;
      if (statusFilter === 'MASTERED' && !item.isMastered) return false;
      if (statusFilter === 'STARRED' && !item.isStarred) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.chapter.toLowerCase().includes(q);
        const matchTest = item.testName.toLowerCase().includes(q);
        const matchQ = item.questionText.toLowerCase().includes(q);
        const matchMy = item.myMistake.toLowerCase().includes(q);
        const matchCorrect = item.correctConcept.toLowerCase().includes(q);
        const matchSub = item.subject.toLowerCase().includes(q);
        if (!matchTitle && !matchTest && !matchQ && !matchMy && !matchCorrect && !matchSub) return false;
      }

      return true;
    });
  }, [mistakes, selectedExam, selectedSubject, selectedCategory, statusFilter, searchQuery]);

  // Analytics
  const stats = useMemo(() => {
    const total = mistakes.length;
    const mastered = mistakes.filter((m) => m.isMastered).length;
    const pending = total - mastered;
    const totalMarksLost = mistakes.reduce((acc, curr) => acc + (curr.marksLost || 5), 0);
    const marksRecovered = mistakes.filter((m) => m.isMastered).reduce((acc, curr) => acc + (curr.marksLost || 5), 0);

    // Most common category
    const catCounts: Record<string, number> = {};
    mistakes.forEach((m) => {
      catCounts[m.errorCategory] = (catCounts[m.errorCategory] || 0) + 1;
    });
    let maxCat = 'calculation';
    let maxVal = 0;
    Object.entries(catCounts).forEach(([k, v]) => {
      if (v > maxVal) {
        maxVal = v;
        maxCat = k;
      }
    });

    return {
      total,
      mastered,
      pending,
      totalMarksLost,
      marksRecovered,
      topTrap: ERROR_CATEGORY_CONFIG[maxCat as ErrorCategory]?.label || 'Calculation / Silly Mistake',
      percentMastered: total > 0 ? Math.round((mastered / total) * 100) : 0,
    };
  }, [mistakes]);

  // Handlers
  const handleToggleMastered = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isMastered: !m.isMastered } : m))
    );
  };

  const handleToggleStarred = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStarred: !m.isStarred } : m))
    );
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Delete this mistake log permanently?')) {
      setMistakes((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleOpenEdit = (item: MistakeItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingItem(item);
    setFormData(item);
    setIsAddModalOpen(true);
  };

  const handleSaveMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.chapter || !formData.questionText || !formData.correctConcept) {
      alert('Please fill in chapter, question, and the correct concept.');
      return;
    }

    if (editingItem) {
      setMistakes((prev) =>
        prev.map((m) => (m.id === editingItem.id ? ({ ...m, ...formData } as MistakeItem) : m))
      );
    } else {
      const newItem: MistakeItem = {
        id: 'm-' + Date.now(),
        exam: formData.exam || 'NEET',
        subject: formData.subject || 'Physics',
        chapter: formData.chapter || 'General',
        testName: formData.testName || 'Self Practice',
        questionNo: formData.questionNo || '',
        marksLost: formData.marksLost || 5,
        errorCategory: formData.errorCategory || 'calculation',
        difficulty: formData.difficulty || 'Medium',
        questionText: formData.questionText || '',
        myMistake: formData.myMistake || '',
        correctConcept: formData.correctConcept || '',
        imageUrl: formData.imageUrl || '',
        isMastered: false,
        isStarred: false,
        date: new Date().toISOString().split('T')[0],
      };
      setMistakes((prev) => [newItem, ...prev]);
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  // Revision Deck
  const revisionDeck = useMemo(() => {
    return filteredMistakes.filter((m) => !m.isMastered);
  }, [filteredMistakes]);

  const currentRevisionItem = revisionDeck[revisionIndex] || null;

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 select-text">
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentRoute('tools')}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--color-cyan)]/50 hover:bg-[var(--color-cyan)]/10 text-white/80 hover:text-[var(--color-cyan)] transition-all flex items-center gap-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">All Tools</span>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white flex items-center gap-3">
                <span className="p-2 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <AlertCircle className="w-6 h-6" />
                </span>
                NEET & JEE Mistake Tracker
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 border border-rose-500/30 text-rose-400">
                Topper Error Notebook
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Convert negative marks into guaranteed rank. Log your test slips, identify recurring traps, and master every concept.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {revisionDeck.length > 0 && (
            <button
              onClick={() => {
                setRevisionIndex(0);
                setShowRevisionSolution(false);
                setIsRevisionModeOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 text-purple-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02]"
            >
              <Shuffle className="w-4 h-4 text-purple-400" />
              <span>Drill Mistakes ({revisionDeck.length})</span>
            </button>
          )}

          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({
                exam: selectedExam === 'JEE' ? 'JEE' : 'NEET',
                subject: selectedExam === 'JEE' ? 'Mathematics' : 'Physics',
                chapter: '',
                testName: '',
                questionNo: '',
                marksLost: 5,
                errorCategory: 'calculation',
                difficulty: 'Medium',
                questionText: '',
                myMistake: '',
                correctConcept: '',
                imageUrl: '',
                isMastered: false,
                isStarred: false,
              });
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[var(--color-cyan)] to-blue-600 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4 text-black stroke-[3]" />
            <span>Log Mistake</span>
          </button>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Logged */}
        <div className="bg-[var(--bg-surface-solid)]/60 border border-white/10 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-[var(--color-cyan)]/40 transition-all">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>Total Logged</span>
            <AlertCircle className="w-4 h-4 text-[var(--color-cyan)]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-heading text-white">{stats.total}</span>
            <span className="text-xs text-[var(--text-secondary)]">slips tracked</span>
          </div>
          <div className="mt-3 text-[11px] text-white/60">
            Lost: <span className="text-rose-400 font-bold">-{stats.totalMarksLost} marks</span> across mock tests
          </div>
        </div>

        {/* Mastered / Fixed */}
        <div className="bg-[var(--bg-surface-solid)]/60 border border-white/10 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>Mastered & Fixed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-heading text-emerald-400">{stats.mastered}</span>
            <span className="text-xs text-emerald-500/80 font-bold">({stats.percentMastered}%)</span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400/80">
            Recovered: <span className="font-bold">+{stats.marksRecovered} marks</span> in your potential score!
          </div>
        </div>

        {/* Pending Revision */}
        <div className="bg-[var(--bg-surface-solid)]/60 border border-white/10 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>Needs Revision</span>
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-heading text-amber-400">{stats.pending}</span>
            <span className="text-xs text-[var(--text-secondary)]">active leaks</span>
          </div>
          <div className="mt-3 text-[11px] text-amber-300/80">
            Priority targets for your next revision session
          </div>
        </div>

        {/* Most Frequent Trap */}
        <div className="bg-[var(--bg-surface-solid)]/60 border border-white/10 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>Top Mistake Type</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-lg sm:text-xl font-black text-purple-300 line-clamp-1">{stats.topTrap}</span>
          </div>
          <div className="mt-3 text-[11px] text-[var(--text-secondary)]">
            Focus your awareness here during mock exams
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[var(--bg-surface-solid)]/40 border border-white/10 rounded-3xl p-4 sm:p-6 backdrop-blur-md space-y-4">
        {/* Row 1: Exam Toggle & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Exam Segment */}
          <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-2xl">
            {(['ALL', 'NEET', 'JEE'] as ExamType[]).map((exam) => (
              <button
                key={exam}
                onClick={() => {
                  setSelectedExam(exam);
                  if (exam === 'JEE' && selectedSubject === 'Biology') setSelectedSubject('ALL');
                  if (exam === 'NEET' && selectedSubject === 'Mathematics') setSelectedSubject('ALL');
                }}
                className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  selectedExam === exam
                    ? exam === 'NEET'
                      ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                      : exam === 'JEE'
                      ? 'bg-[var(--color-cyan)] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                      : 'bg-white text-black shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {exam === 'ALL' ? 'All Exams' : exam}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by chapter, question, error, or test name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--color-cyan)]/60 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider shrink-0 mr-1">Subject:</span>
          {['ALL', 'Physics', 'Chemistry', selectedExam !== 'JEE' ? 'Biology' : null, selectedExam !== 'NEET' ? 'Mathematics' : null]
            .filter(Boolean)
            .map((subj) => (
              <button
                key={subj!}
                onClick={() => setSelectedSubject(subj!)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                  selectedSubject === subj
                    ? 'bg-white/20 border-white/40 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {subj}
              </button>
            ))}
        </div>

        {/* Row 3: Mistake Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider shrink-0 mr-1">Error Type:</span>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-white/20 border-white/40 text-white'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            All Types
          </button>
          {Object.entries(ERROR_CATEGORY_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const isSelected = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? `${cfg.bg} ${cfg.border} ${cfg.color} shadow-sm`
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 4: Status Tabs */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`pb-1 font-semibold border-b-2 transition-all ${
                statusFilter === 'ALL' ? 'border-[var(--color-cyan)] text-[var(--color-cyan)]' : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              All ({mistakes.length})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`pb-1 font-semibold border-b-2 transition-all flex items-center gap-1 ${
                statusFilter === 'PENDING' ? 'border-amber-400 text-amber-400' : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Needs Revision ({stats.pending})</span>
            </button>
            <button
              onClick={() => setStatusFilter('MASTERED')}
              className={`pb-1 font-semibold border-b-2 transition-all flex items-center gap-1 ${
                statusFilter === 'MASTERED' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mastered ({stats.mastered})</span>
            </button>
            <button
              onClick={() => setStatusFilter('STARRED')}
              className={`pb-1 font-semibold border-b-2 transition-all flex items-center gap-1 ${
                statusFilter === 'STARRED' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-yellow-400/50" />
              <span>Starred</span>
            </button>
          </div>

          <span className="text-[11px] text-white/40 hidden sm:inline">
            Showing {filteredMistakes.length} mistakes
          </span>
        </div>
      </div>

      {/* Mistake Items Grid */}
      {filteredMistakes.length === 0 ? (
        <div className="bg-[var(--bg-surface-solid)]/30 border border-white/10 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
            <Award className="w-8 h-8 text-[var(--color-cyan)]" />
          </div>
          <h3 className="text-xl font-bold text-white">No Mistakes Found</h3>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto">
            {searchQuery
              ? 'No mistakes match your search query. Try clearing filters or searching for different topics.'
              : 'Great job! Either all mistakes are mastered, or you haven\'t logged any errors for this selection.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedExam('ALL');
              setSelectedSubject('ALL');
              setSelectedCategory('ALL');
              setStatusFilter('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMistakes.map((item) => {
            const catConfig = ERROR_CATEGORY_CONFIG[item.errorCategory] || ERROR_CATEGORY_CONFIG.calculation;
            const CatIcon = catConfig.icon;

            return (
              <div
                key={item.id}
                className={`bg-[var(--bg-surface-solid)]/60 border ${
                  item.isMastered
                    ? 'border-emerald-500/20 bg-emerald-950/10'
                    : 'border-white/10 hover:border-[var(--color-cyan)]/40'
                } rounded-3xl p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 relative flex flex-col justify-between group shadow-xl`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Exam Tag */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.exam === 'NEET'
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                            : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                        }`}
                      >
                        {item.exam}
                      </span>

                      {/* Subject Tag */}
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 border border-white/15 text-white/90">
                        {item.subject}
                      </span>

                      {/* Error Category Tag */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${catConfig.bg} ${catConfig.border} ${catConfig.color}`}
                      >
                        <CatIcon className="w-3 h-3" />
                        <span>{catConfig.label}</span>
                      </span>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-1.5">
                      {/* Star Button */}
                      <button
                        onClick={(e) => handleToggleStarred(item.id, e)}
                        className={`p-1.5 rounded-xl transition-colors ${
                          item.isStarred
                            ? 'text-yellow-400 bg-yellow-400/10'
                            : 'text-white/30 hover:text-yellow-400 hover:bg-white/5'
                        }`}
                        title="Star / Bookmark"
                      >
                        <Star className={`w-4 h-4 ${item.isStarred ? 'fill-yellow-400' : ''}`} />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={(e) => handleOpenEdit(item, e)}
                        className="p-1.5 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-colors"
                        title="Edit mistake"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1.5 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Chapter & Test Info */}
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-white font-heading group-hover:text-[var(--color-cyan)] transition-colors">
                      {item.chapter}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-0.5 flex-wrap">
                      <span>{item.testName}</span>
                      {item.questionNo && (
                        <>
                          <span>•</span>
                          <span className="text-white/60 font-medium">{item.questionNo}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="text-rose-400 font-bold">-{item.marksLost} Marks</span>
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="p-3.5 bg-black/40 border border-white/5 rounded-2xl text-xs sm:text-sm text-white/90 leading-relaxed font-sans mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-cyan)] block mb-1">
                      Problem Statement
                    </span>
                    {item.questionText}
                  </div>

                  {/* My Mistake (What went wrong) */}
                  <div className="p-3.5 bg-rose-950/20 border border-rose-500/20 rounded-2xl text-xs sm:text-sm text-rose-200/90 leading-relaxed mb-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-rose-400 mb-1">
                      <Zap className="w-3 h-3" />
                      <span>Where I Went Wrong</span>
                    </div>
                    {item.myMistake}
                  </div>

                  {/* Correct Concept & Rule */}
                  <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-emerald-400 mb-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Correct Concept / Rule to Remember</span>
                    </div>
                    {item.correctConcept}
                  </div>
                </div>

                {/* Bottom Footer Actions */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-[11px] text-white/40">
                    <span>Logged on {item.date}</span>
                    <span>•</span>
                    <span className="capitalize">{item.difficulty} Level</span>
                  </div>

                  {/* Toggle Mastered Button */}
                  <button
                    onClick={(e) => handleToggleMastered(item.id, e)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      item.isMastered
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {item.isMastered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mastered</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Mark as Mastered</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Add or Edit Mistake */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[var(--bg-surface-solid)] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[var(--color-cyan)]/15 text-[var(--color-cyan)] border border-[var(--color-cyan)]/30">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-heading">
                  {editingItem ? 'Edit Mistake Entry' : 'Log New Mistake (Error Notebook)'}
                </h2>
                <p className="text-xs text-white/60">
                  Analyze what caused the slip to make sure it never happens in the real exam.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveMistake} className="space-y-4">
              {/* Exam & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">Target Exam *</label>
                  <select
                    value={formData.exam}
                    onChange={(e) => setFormData({ ...formData, exam: e.target.value as 'NEET' | 'JEE' })}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                  >
                    <option value="NEET">NEET (UG)</option>
                    <option value="JEE">JEE (Main / Adv)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value as SubjectType })}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    {formData.exam === 'JEE' ? (
                      <option value="Mathematics">Mathematics</option>
                    ) : (
                      <>
                        <option value="Biology">Biology (General)</option>
                        <option value="Botany">Botany</option>
                        <option value="Zoology">Zoology</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Chapter & Test Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">Chapter / Topic *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rotational Motion, Organic GOC"
                    value={formData.chapter}
                    onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-cyan)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">Mock Test / Source</label>
                  <input
                    type="text"
                    placeholder="e.g. Allen Minor Test 3, NTA Abhyas"
                    value={formData.testName}
                    onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-cyan)]"
                  />
                </div>
              </div>

              {/* Error Category & Marks Lost */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">Why did this mistake happen? *</label>
                  <select
                    value={formData.errorCategory}
                    onChange={(e) => setFormData({ ...formData, errorCategory: e.target.value as ErrorCategory })}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                  >
                    {Object.entries(ERROR_CATEGORY_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>
                        {cfg.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">Marks Lost</label>
                  <input
                    type="number"
                    value={formData.marksLost}
                    onChange={(e) => setFormData({ ...formData, marksLost: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[var(--color-cyan)]"
                  />
                </div>
              </div>

              {/* Question Statement */}
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1.5">Question Statement / Core Problem *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Paste or write the question or key condition here..."
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-cyan)]"
                />
              </div>

              {/* My Faulty Thinking */}
              <div>
                <label className="text-xs font-semibold text-rose-300 block mb-1.5">
                  Where I Went Wrong (My flawed thinking / what went wrong) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. In a hurry, I assumed friction was negligible, or I calculated 6*7 as 48..."
                  value={formData.myMistake}
                  onChange={(e) => setFormData({ ...formData, myMistake: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-rose-950/20 border border-rose-500/30 rounded-xl text-xs sm:text-sm text-white placeholder-rose-200/30 focus:outline-none focus:border-rose-400"
                />
              </div>

              {/* Correct Concept & Rule to Remember */}
              <div>
                <label className="text-xs font-semibold text-emerald-300 block mb-1.5">
                  Correct Rule & Concept to Remember (Key Takeaway) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Write the exact rule, theorem, or habit to follow next time..."
                  value={formData.correctConcept}
                  onChange={(e) => setFormData({ ...formData, correctConcept: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-white placeholder-emerald-200/30 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-blue-600 text-black font-black text-xs sm:text-sm shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                >
                  {editingItem ? 'Update Mistake' : 'Save To Mistake Notebook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Active Revision Drill Mode */}
      {isRevisionModeOpen && currentRevisionItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[var(--bg-surface-solid)] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Revision Drill Mode
                </span>
                <span className="text-xs text-white/50">
                  Card {revisionIndex + 1} of {revisionDeck.length}
                </span>
              </div>
              <button
                onClick={() => setIsRevisionModeOpen(false)}
                className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Flashcard Body */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-cyan)]">
                    {currentRevisionItem.exam} • {currentRevisionItem.subject}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-xs text-white/70 font-semibold">{currentRevisionItem.chapter}</span>
                </div>
                <span className="text-xs text-rose-400 font-bold">-{currentRevisionItem.marksLost} M</span>
              </div>

              {/* Question */}
              <div className="p-5 bg-black/50 border border-white/10 rounded-2xl text-sm sm:text-base text-white leading-relaxed">
                <span className="text-[10px] font-black uppercase text-white/40 block mb-2">The Question</span>
                {currentRevisionItem.questionText}
              </div>

              {/* Solution / Correct takeaway (Hidden until toggled) */}
              {showRevisionSolution ? (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-xs sm:text-sm text-rose-200">
                    <span className="text-[10px] font-bold uppercase text-rose-400 block mb-1">Your Previous Mistake</span>
                    {currentRevisionItem.myMistake}
                  </div>
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-xs sm:text-sm text-emerald-200">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Correct Concept</span>
                    {currentRevisionItem.correctConcept}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-white/10 rounded-2xl">
                  <p className="text-xs sm:text-sm text-white/50 mb-3">
                    Can you recall how to solve this correctly without repeating the slip?
                  </p>
                  <button
                    onClick={() => setShowRevisionSolution(true)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                  >
                    Reveal Solution & Rule
                  </button>
                </div>
              )}
            </div>

            {/* Drill Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                disabled={revisionIndex === 0}
                onClick={() => {
                  setRevisionIndex((i) => Math.max(0, i - 1));
                  setShowRevisionSolution(false);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 disabled:opacity-30 border border-white/10 text-white text-xs font-semibold"
              >
                Previous
              </button>

              <button
                onClick={() => {
                  handleToggleMastered(currentRevisionItem.id);
                  if (revisionIndex < revisionDeck.length - 1) {
                    setRevisionIndex((i) => i + 1);
                    setShowRevisionSolution(false);
                  } else {
                    setIsRevisionModeOpen(false);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 shadow-lg transition-all"
              >
                I Mastered This! ✅
              </button>

              <button
                disabled={revisionIndex >= revisionDeck.length - 1}
                onClick={() => {
                  setRevisionIndex((i) => Math.min(revisionDeck.length - 1, i + 1));
                  setShowRevisionSolution(false);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 disabled:opacity-30 border border-white/10 text-white text-xs font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
