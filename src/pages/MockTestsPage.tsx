import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { MockTestCard, MockTestItem, MockTestUserProgress } from '../components/mock-tests/MockTestCard';
import {
  Search, Flame, Atom, RotateCcw, Check, Clock, Award,
  Coins, Sparkles, Layers, Play, Calendar, AlertCircle,
  ChevronRight, CheckCircle2, ShieldCheck, Trophy, X
} from 'lucide-react';

type ExamType = 'neet' | 'jee';
type FilterStatus = 'all' | 'free' | 'completed' | 'unattempted';

// ─── Comprehensive Mock Tests Dataset ─────────────────────────────────────────
export const ALL_MOCK_TESTS: MockTestItem[] = [
  // ── NEET TESTS ─────────────────────────────────────────────────────────────
  {
    id: 'mission_30_test_1',
    testNumber: 1,
    title: 'MISSION 30 : Grand Test 1',
    exam: 'neet',
    category: 'mission30',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attemptsCount: 18420,
    maxCoins: 540,
    heldOn: '17 May 2026 at 02:00 PM',
    isFree: true,
    difficulty: 'HARD',
    syllabusSummary: 'Complete Class 11 & 12 · Physics (45 Qs), Chemistry (45 Qs), Biology (90 Qs)',
    subjectBreakdown: [
      { subject: 'Physics', questions: 45, marks: 180 },
      { subject: 'Chemistry', questions: 45, marks: 180 },
      { subject: 'Botany', questions: 45, marks: 180 },
      { subject: 'Zoology', questions: 45, marks: 180 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
      cardBg: 'linear-gradient(180deg, #280711 0%, #150308 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#FB7185',
      borderColor: 'rgba(225, 29, 72, 0.45)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  },
  {
    id: 'mission_30_test_2',
    testNumber: 2,
    title: 'MISSION 30 : Grand Test 2',
    exam: 'neet',
    category: 'mission30',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attemptsCount: 15630,
    maxCoins: 540,
    heldOn: '19 May 2026 at 02:00 PM',
    isFree: true,
    difficulty: 'HARD',
    syllabusSummary: 'Complete Class 11 & 12 · High-Yield Human Physiology & Mechanics focus',
    subjectBreakdown: [
      { subject: 'Physics', questions: 45, marks: 180 },
      { subject: 'Chemistry', questions: 45, marks: 180 },
      { subject: 'Botany', questions: 45, marks: 180 },
      { subject: 'Zoology', questions: 45, marks: 180 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #E11D48 0%, #9F1239 100%)',
      cardBg: 'linear-gradient(180deg, #280711 0%, #150308 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#FB7185',
      borderColor: 'rgba(225, 29, 72, 0.45)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  },
  {
    id: 'mission_30_test_3',
    testNumber: 3,
    title: 'MISSION 30 : Grand Test 3',
    exam: 'neet',
    category: 'mission30',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attemptsCount: 14210,
    maxCoins: 540,
    heldOn: '21 May 2026 at 02:00 PM',
    isFree: true,
    difficulty: 'CHALLENGER',
    syllabusSummary: 'Full Syllabus Grand Simulation · Enhanced multi-statement and match-the-column items',
    subjectBreakdown: [
      { subject: 'Physics', questions: 45, marks: 180 },
      { subject: 'Chemistry', questions: 45, marks: 180 },
      { subject: 'Botany', questions: 45, marks: 180 },
      { subject: 'Zoology', questions: 45, marks: 180 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
      cardBg: 'linear-gradient(180deg, #280711 0%, #150308 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#FB7185',
      borderColor: 'rgba(225, 29, 72, 0.45)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  },
  {
    id: 'mission_30_test_4',
    testNumber: 4,
    title: 'MISSION 30 : Grand Test 4',
    exam: 'neet',
    category: 'mission30',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attemptsCount: 12900,
    maxCoins: 540,
    heldOn: '23 May 2026 at 02:00 PM',
    isFree: true,
    difficulty: 'HARD',
    syllabusSummary: 'Full Syllabus Grand Simulation · Strict negative-marking calibration',
    subjectBreakdown: [
      { subject: 'Physics', questions: 45, marks: 180 },
      { subject: 'Chemistry', questions: 45, marks: 180 },
      { subject: 'Botany', questions: 45, marks: 180 },
      { subject: 'Zoology', questions: 45, marks: 180 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #E11D48 0%, #9F1239 100%)',
      cardBg: 'linear-gradient(180deg, #280711 0%, #150308 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#FB7185',
      borderColor: 'rgba(225, 29, 72, 0.45)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  },
  {
    id: 'replica_2026_test_1',
    testNumber: 5,
    title: 'NEET 2026 All India Replica 1',
    exam: 'neet',
    category: 'replica',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attemptsCount: 22400,
    maxCoins: 600,
    heldOn: '01 June 2026 at 02:00 PM',
    isFree: true,
    difficulty: 'HARD',
    syllabusSummary: 'Exact NTA latest exam pattern replica with 200 questions (choose 180)',
    subjectBreakdown: [
      { subject: 'Physics', questions: 45, marks: 180 },
      { subject: 'Chemistry', questions: 45, marks: 180 },
      { subject: 'Botany', questions: 45, marks: 180 },
      { subject: 'Zoology', questions: 45, marks: 180 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
      cardBg: 'linear-gradient(180deg, #0F122B 0%, #070918 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#818CF8',
      borderColor: 'rgba(99, 102, 241, 0.45)',
      glowShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  },
  {
    id: 'replica_2026_test_2',
    testNumber: 6,
    title: 'NEET 2026 All India Replica 2',
    exam: 'neet',
    category: 'replica',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attemptsCount: 19800,
    maxCoins: 600,
    heldOn: '05 June 2026 at 02:00 PM',
    isFree: true,
    difficulty: 'CHALLENGER',
    syllabusSummary: 'NTA Predictive Paper · Advanced assertion-reason & clinical biology questions',
    subjectBreakdown: [
      { subject: 'Physics', questions: 45, marks: 180 },
      { subject: 'Chemistry', questions: 45, marks: 180 },
      { subject: 'Botany', questions: 45, marks: 180 },
      { subject: 'Zoology', questions: 45, marks: 180 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
      cardBg: 'linear-gradient(180deg, #0F122B 0%, #070918 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#818CF8',
      borderColor: 'rgba(99, 102, 241, 0.45)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  },
  {
    id: 'part_syl_11_neet',
    testNumber: 7,
    title: 'Class 11 Grand Diagnostic Test',
    exam: 'neet',
    category: 'sectional',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attemptsCount: 11400,
    maxCoins: 480,
    heldOn: 'Available On-Demand',
    isFree: true,
    difficulty: 'STANDARD',
    syllabusSummary: 'Complete Class 11 Syllabus only · Mechanics, Physical Chemistry, Cell & Physiology',
    subjectBreakdown: [
      { subject: 'Physics (Class 11)', questions: 45, marks: 180 },
      { subject: 'Chemistry (Class 11)', questions: 45, marks: 180 },
      { subject: 'Biology (Class 11)', questions: 90, marks: 360 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #00D7A0 0%, #059669 100%)',
      cardBg: 'linear-gradient(180deg, #04241B 0%, #02140F 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#00D7A0',
      borderColor: 'rgba(0, 215, 160, 0.45)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  },
  {
    id: 'part_syl_12_neet',
    testNumber: 8,
    title: 'Class 12 Grand Diagnostic Test',
    exam: 'neet',
    category: 'sectional',
    questions: 180,
    marks: 720,
    durationMins: 195,
    attemptsCount: 13100,
    maxCoins: 480,
    heldOn: 'Available On-Demand',
    isFree: true,
    difficulty: 'STANDARD',
    syllabusSummary: 'Complete Class 12 Syllabus · Electrodynamics, Organic, Genetics & Ecology',
    subjectBreakdown: [
      { subject: 'Physics (Class 12)', questions: 45, marks: 180 },
      { subject: 'Chemistry (Class 12)', questions: 45, marks: 180 },
      { subject: 'Biology (Class 12)', questions: 90, marks: 360 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #00D7A0 0%, #059669 100%)',
      cardBg: 'linear-gradient(180deg, #04241B 0%, #02140F 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#00D7A0',
      borderColor: 'rgba(0, 215, 160, 0.45)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  },

  // ── JEE MAIN TESTS ─────────────────────────────────────────────────────────
  {
    id: 'jee_super_20_1',
    testNumber: 1,
    title: 'JEE Main Super 20 : Mock 1',
    exam: 'jee',
    category: 'mission30',
    questions: 75,
    marks: 300,
    durationMins: 180,
    attemptsCount: 14800,
    maxCoins: 450,
    heldOn: '18 May 2026 at 09:00 AM',
    isFree: true,
    difficulty: 'HARD',
    syllabusSummary: 'Full JEE Main Syllabus · Physics (25 Qs), Chemistry (25 Qs), Maths (25 Qs)',
    subjectBreakdown: [
      { subject: 'Physics', questions: 25, marks: 100 },
      { subject: 'Chemistry', questions: 25, marks: 100 },
      { subject: 'Mathematics', questions: 25, marks: 100 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #00F0FF 0%, #0088FF 100%)',
      cardBg: 'linear-gradient(180deg, #051A24 0%, #020F16 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#00F0FF',
      borderColor: 'rgba(0, 240, 255, 0.45)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  },
  {
    id: 'jee_super_20_2',
    testNumber: 2,
    title: 'JEE Main Super 20 : Mock 2',
    exam: 'jee',
    category: 'mission30',
    questions: 75,
    marks: 300,
    durationMins: 180,
    attemptsCount: 13200,
    maxCoins: 450,
    heldOn: '20 May 2026 at 09:00 AM',
    isFree: true,
    difficulty: 'HARD',
    syllabusSummary: 'Full Syllabus with high-yield Calculus, Electromagnetism, & Organic reaction mechanisms',
    subjectBreakdown: [
      { subject: 'Physics', questions: 25, marks: 100 },
      { subject: 'Chemistry', questions: 25, marks: 100 },
      { subject: 'Mathematics', questions: 25, marks: 100 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #00F0FF 0%, #0066CC 100%)',
      cardBg: 'linear-gradient(180deg, #051A24 0%, #020F16 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#00F0FF',
      borderColor: 'rgba(0, 240, 255, 0.45)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  },
  {
    id: 'jee_replica_1',
    testNumber: 3,
    title: 'JEE Main 2026 Predictive Replica 1',
    exam: 'jee',
    category: 'replica',
    questions: 75,
    marks: 300,
    durationMins: 180,
    attemptsCount: 16900,
    maxCoins: 500,
    heldOn: '02 June 2026 at 09:00 AM',
    isFree: true,
    difficulty: 'CHALLENGER',
    syllabusSummary: 'Official NTA 2026 Computer Based Test format with Section B Numerical Value answers',
    subjectBreakdown: [
      { subject: 'Physics', questions: 25, marks: 100 },
      { subject: 'Chemistry', questions: 25, marks: 100 },
      { subject: 'Mathematics', questions: 25, marks: 100 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #A855F7 0%, #6B21A8 100%)',
      cardBg: 'linear-gradient(180deg, #1C0B2B 0%, #0D0515 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#C084FC',
      borderColor: 'rgba(168, 85, 247, 0.45)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  },
  {
    id: 'jee_part_11',
    testNumber: 4,
    title: 'JEE Main Class 11 Comprehensive',
    exam: 'jee',
    category: 'sectional',
    questions: 75,
    marks: 300,
    durationMins: 180,
    attemptsCount: 9800,
    maxCoins: 400,
    heldOn: 'Available On-Demand',
    isFree: true,
    difficulty: 'STANDARD',
    syllabusSummary: 'Mechanics, Heat & Thermo, Periodic Table, Coordinate Geometry, & Trigonometry',
    subjectBreakdown: [
      { subject: 'Physics (11th)', questions: 25, marks: 100 },
      { subject: 'Chemistry (11th)', questions: 25, marks: 100 },
      { subject: 'Mathematics (11th)', questions: 25, marks: 100 },
    ],
    theme: {
      bannerGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      cardBg: 'linear-gradient(180deg, #241604 0%, #120A02 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.3)',
      primaryColor: '#FBBF24',
      borderColor: 'rgba(245, 158, 11, 0.45)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)'
    }
  }
];

// ─── Test Details & Pattern Breakdown Modal ───────────────────────────────────
interface TestDetailsModalProps {
  test: MockTestItem;
  onClose: () => void;
  onStart: () => void;
}

const TestDetailsModal: React.FC<TestDetailsModalProps> = ({ test, onClose, onStart }) => {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        style={{
          background: 'linear-gradient(180deg, #131726 0%, #0c0e18 100%)',
          border: `1px solid ${test.theme.primaryColor}40`,
          boxShadow: `0 20px 60px -15px ${test.theme.primaryColor}30`
        }}
      >
        {/* Accent Bar */}
        <div
          className="h-1.5 w-full shrink-0"
          style={{ background: test.theme.bannerGradient }}
        />

        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm"
                  style={{ background: test.theme.bannerGradient }}
                >
                  TEST #{test.testNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/80 border border-white/15 uppercase">
                  {test.exam.toUpperCase()} SIMULATOR
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{test.title}</h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1">{test.syllabusSummary}</p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Total Marks</span>
              <span className="text-lg font-black text-white mt-0.5">{test.marks}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Duration</span>
              <span className="text-lg font-black text-white mt-0.5">{test.durationMins} Mins</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Questions</span>
              <span className="text-lg font-black text-white mt-0.5">{test.questions} Qs</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Coins Reward</span>
              <span className="text-lg font-black text-amber-300 mt-0.5">+{test.maxCoins} 🪙</span>
            </div>
          </div>

          {/* Subject Pattern Breakdown */}
          <div>
            <h3 className="text-xs font-black text-white/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Section-wise Question Breakdown</span>
            </h3>

            <div className="space-y-2">
              {test.subjectBreakdown.map((sec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-semibold text-white/90"
                >
                  <span className="font-bold">{sec.subject}</span>
                  <div className="flex items-center gap-4 text-xs font-mono text-white/70">
                    <span>{sec.questions} Questions</span>
                    <span className="font-bold text-white">{sec.marks} Marks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marking Scheme & NTA Rules */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-white/80 leading-relaxed">
            <h4 className="font-black text-white flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NTA Marking Scheme & Exam Rules</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>+4 for Correct Answer</span>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 flex items-center justify-center font-bold">−</span>
                <span>-1 for Wrong Answer</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 flex items-center justify-center font-bold">0</span>
                <span>0 for Unattempted</span>
              </div>
            </div>
            <p className="text-[11px] text-white/50 pt-1">
              • Timed countdown will begin automatically upon starting.
              • Questions can be marked for review and navigated via the question palette in the NTA console.
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between gap-3 bg-black/20 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onStart}
            className="px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm text-black flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${test.theme.primaryColor}, #FFFFFF)`,
              boxShadow: `0 0 18px ${test.theme.primaryColor}60`
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Proceed to NTA Test Instructions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Mock Tests Page ─────────────────────────────────────────────────────
export const MockTestsPage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  const [selectedExam, setSelectedExam] = useState<ExamType>('neet');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active details modal state
  const [selectedTestForDetails, setSelectedTestForDetails] = useState<MockTestItem | null>(null);

  // Storage key for mock test progress
  const storageKey = `cosmic_mock_tests_progress_v1_${selectedExam}`;
  const [progressMap, setProgressMap] = useState<Record<string, MockTestUserProgress>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      /* noop */
    }
    return {};
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setProgressMap(JSON.parse(saved));
        return;
      }
    } catch {
      /* noop */
    }
    setProgressMap({});
  }, [storageKey]);

  const saveProgressMap = useCallback((next: Record<string, MockTestUserProgress>) => {
    setProgressMap(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* noop */
    }
  }, [storageKey]);

  // Available Series Categories based on user request: Unit Test, NBT, Full Mock
  const seriesCategories = useMemo(() => {
    return [
      { id: 'all', label: 'All Mock Tests' },
      { id: 'unit-test', label: 'Unit Test' },
      { id: 'nbt', label: 'NBT' },
      { id: 'full-mock', label: 'Full Mock' },
    ];
  }, []);

  // Auto-reset category if not in available
  useEffect(() => {
    setActiveCategory('all');
  }, [selectedExam]);

  // Load custom tests from Creator Studio
  const customMockTests = useMemo((): MockTestItem[] => {
    try {
      const stored = localStorage.getItem('cosmic_custom_tests_v1');
      if (!stored) return [];
      const tests = JSON.parse(stored) as any[];
      return tests.map((t: any, idx: number) => {
        let theme = {
          bannerGradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          cardBg: 'linear-gradient(180deg, #1e1b4b 0%, #0f0d2e 100%)',
          badgeBg: 'rgba(0, 0, 0, 0.3)',
          primaryColor: '#818CF8',
          borderColor: 'rgba(99, 102, 241, 0.45)',
          watermarkColor: 'rgba(255, 255, 255, 0.28)'
        };
        
        if (t.themeColor === 'rose') {
          theme = {
            bannerGradient: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
            cardBg: 'linear-gradient(180deg, #4C1D95 0%, #311065 100%)',
            badgeBg: 'rgba(0, 0, 0, 0.3)',
            primaryColor: '#FB7185',
            borderColor: 'rgba(244, 63, 94, 0.45)',
            watermarkColor: 'rgba(255, 255, 255, 0.28)'
          };
        } else if (t.themeColor === 'emerald') {
          theme = {
            bannerGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            cardBg: 'linear-gradient(180deg, #064E3B 0%, #022C22 100%)',
            badgeBg: 'rgba(0, 0, 0, 0.3)',
            primaryColor: '#34D399',
            borderColor: 'rgba(16, 185, 129, 0.45)',
            watermarkColor: 'rgba(255, 255, 255, 0.28)'
          };
        } else if (t.themeColor === 'amber') {
          theme = {
            bannerGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            cardBg: 'linear-gradient(180deg, #78350F 0%, #451A03 100%)',
            badgeBg: 'rgba(0, 0, 0, 0.3)',
            primaryColor: '#FBBF24',
            borderColor: 'rgba(245, 158, 11, 0.45)',
            watermarkColor: 'rgba(255, 255, 255, 0.28)'
          };
        } else if (t.themeColor === 'slate') {
          theme = {
            bannerGradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
            cardBg: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
            badgeBg: 'rgba(0, 0, 0, 0.3)',
            primaryColor: '#94A3B8',
            borderColor: 'rgba(100, 116, 139, 0.45)',
            watermarkColor: 'rgba(255, 255, 255, 0.28)'
          };
        }

        return {
          id: t.id,
          testNumber: ALL_MOCK_TESTS.length + idx + 1,
          watermarkText: t.watermarkText,
          title: t.title || 'Custom Test',
          exam: t.exam || 'neet',
          category: t.category || 'full-mock',
          questions: t.questions?.length || 0,
          marks: t.totalMarks || 0,
          durationMins: t.durationMins || 60,
          attemptsCount: 0,
          maxCoins: t.maxCoins || 0,
          heldOn: new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          isFree: true,
          difficulty: (t.difficulty || 'STANDARD') as any,
          syllabusSummary: t.subtitle || t.syllabusSummary || 'Custom Test',
          subjectBreakdown: t.subjectBreakdown || [],
          theme
        };
      });
    } catch { return []; }
  }, []);

  const allTests = useMemo(() => [...ALL_MOCK_TESTS, ...customMockTests], [customMockTests]);

  // Filtered mock tests list
  const filteredTests = useMemo(() => {
    return allTests.filter(t => {
      if (t.exam !== selectedExam) return false;
      if (activeCategory !== 'all' && t.category !== activeCategory) return false;

      const isComp = !!progressMap[t.id]?.isCompleted;
      if (filterStatus === 'free' && !t.isFree) return false;
      if (filterStatus === 'completed' && !isComp) return false;
      if (filterStatus === 'unattempted' && isComp) return false;

      if (!searchQuery.trim()) return true;
      const lower = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(lower) ||
        t.syllabusSummary.toLowerCase().includes(lower) ||
        t.heldOn.toLowerCase().includes(lower)
      );
    });
  }, [allTests, selectedExam, activeCategory, filterStatus, searchQuery, progressMap]);

  // Overall Statistics for Sticky Performance Progress Bar
  const stats = useMemo(() => {
    const examTests = allTests.filter(t => t.exam === selectedExam);
    const totalTests = examTests.length;
    let completedCount = 0;
    let totalScore = 0;
    let totalMaxMarks = 0;
    let earnedCoins = 0;

    examTests.forEach(t => {
      const p = progressMap[t.id];
      if (p?.isCompleted) {
        completedCount += 1;
        if (p.score !== undefined) {
          totalScore += p.score;
          totalMaxMarks += t.marks;
        }
        earnedCoins += t.maxCoins;
      }
    });

    const completionPercentage = totalTests > 0 ? Math.min(100, Math.round((completedCount / totalTests) * 100)) : 0;
    const avgPercentage = totalMaxMarks > 0 ? Math.round((totalScore / totalMaxMarks) * 100) : 0;

    return {
      totalTests,
      completedCount,
      completionPercentage,
      totalScore,
      totalMaxMarks,
      avgPercentage,
      earnedCoins
    };
  }, [selectedExam, progressMap]);

  // Toggle Test completion
  const handleToggleComplete = (test: MockTestItem) => {
    const prev = progressMap[test.id];
    const next = { ...progressMap };
    if (prev?.isCompleted) {
      delete next[test.id];
    } else {
      next[test.id] = {
        isCompleted: true,
        score: Math.round(test.marks * 0.82), // Default sample score
        accuracy: 82,
        attemptDate: new Date().toISOString().split('T')[0]
      };
    }
    saveProgressMap(next);
  };

  const handleResetProgress = () => {
    saveProgressMap({});
  };

  // Launch Full Test
  const handleLaunchTest = (testId: string) => {
    localStorage.setItem('active_test_id', testId);
    setCurrentRoute('test-instructions', `?testId=${testId}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      {/* Top Control Bar: Search + Exam Selector (Matching Flashcards & PYQ) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        {/* Global Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search full mock tests, MISSION 30, NTA replicas, question papers..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--text-primary)] placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-primary)] shadow-sm transition-all"
          />
        </div>

        {/* Exam Mode Toggle: NEET (UG) & JEE Main */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedExam('neet')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black transition-all cursor-pointer ${
              selectedExam === 'neet'
                ? 'bg-[var(--color-primary)] text-black shadow-md'
                : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-color-hover)]'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>NEET (UG)</span>
          </button>

          <button
            onClick={() => setSelectedExam('jee')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black transition-all cursor-pointer ${
              selectedExam === 'jee'
                ? 'bg-[var(--color-primary)] text-black shadow-md'
                : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-color-hover)]'
            }`}
          >
            <Atom className="w-4 h-4" />
            <span>JEE Main</span>
          </button>
        </div>
      </div>

      {/* Series Category Pills Row */}
      <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 mb-4 border-b border-[var(--border-color)]">
        {seriesCategories.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-6 py-2 rounded-full text-sm font-bold transition-all border cursor-pointer ${
                isActive
                  ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)] shadow-sm'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Sub-filter Row */}
      <div className="flex items-center gap-2 mb-2">
        {(['all', 'free', 'completed', 'unattempted'] as FilterStatus[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border cursor-pointer ${
              filterStatus === f
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-[var(--bg-surface)] text-white/50 border-[var(--border-color)] hover:text-white'
            }`}
          >
            {f === 'all' ? 'All Tests' : f === 'free' ? 'Free Entry' : f === 'completed' ? 'Attempted' : 'Unattempted'}
          </button>
        ))}
        <span className="ml-auto text-xs text-white/40 font-mono">
          {filteredTests.length} Tests Ready
        </span>
      </div>

      {/* Sticky Progress Bar (Identical to Flashcard & Syllabus Trackers) */}
      <div className="sticky top-[72px] z-20 mb-5 pt-2">
        <div className="relative overflow-hidden bg-transparent border border-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-none">
          {/* Glowing Ambient Light */}
          <div
            className="absolute -top-10 -right-10 w-36 h-36 bg-indigo-500 rounded-full blur-[70px] opacity-15 pointer-events-none transition-opacity duration-1000 animate-pulse-slow"
            style={{ opacity: stats.completionPercentage > 0 ? 0.28 : 0.05 }}
          />

          {/* Header Info Row */}
          <div className="flex items-center justify-between gap-3 mb-2.5 relative z-10">
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                  {stats.completedCount} of {stats.totalTests} Mock Tests completed
                </h3>
                {stats.completionPercentage === 100 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                    EXAM READY
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs text-gray-400">
                {stats.completedCount > 0
                  ? `Average Score: ${stats.avgPercentage}% · ${stats.earnedCoins} Coins Earned`
                  : `Full ${selectedExam.toUpperCase()} Simulation · All-India Rankings & Predictive Scoring`}
              </span>
            </div>

            <button
              onClick={handleResetProgress}
              title="Reset Mock Test History"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold text-white/70 bg-white/10 hover:bg-white/20 hover:text-white border border-white/15 transition-all active:scale-95 group shadow-sm shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-500 ease-out" />
              Reset
            </button>
          </div>

          {/* Main Progress Row: Stepped Capsule Bar + Compact Radial Percentage Dial */}
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            {/* Stepped Capsule Bar */}
            <div className="flex-1 flex flex-col gap-1 min-w-0">
              <div className="relative h-3 sm:h-8 md:h-9 w-full bg-white/10 border border-white/15 rounded-full shadow-inner overflow-hidden p-0.5 sm:p-1 flex items-center">
                {/* Dynamic Gradient Fill */}
                <div
                  className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-[#4F46E5] via-[#6366F1] via-[#818CF8] to-[#A5B4FC]"
                  style={{
                    width: stats.completionPercentage <= 0 ? '0%' : `${Math.max(stats.completionPercentage, 4)}%`,
                    boxShadow: stats.completionPercentage > 0 ? '0 0 15px rgba(99, 102, 241, 0.4)' : 'none'
                  }}
                />

                {/* Milestone Circles along the Track */}
                <div className="relative w-full h-full hidden sm:flex items-center justify-between px-2 sm:px-3 z-10">
                  {filteredTests.map((test, idx) => {
                    const prog = progressMap[test.id];
                    const isDone = !!prog?.isCompleted;
                    const isFirst = idx === 0;
                    const isLast = idx === filteredTests.length - 1;

                    let completedBgClass = 'bg-[#6366F1] text-white shadow-sm';
                    if (isFirst) {
                      completedBgClass = 'bg-white text-indigo-900 shadow-[0_1px_6px_rgba(0,0,0,0.35)]';
                    } else if (isLast) {
                      completedBgClass = 'bg-[#6366F1] text-white shadow-[0_0_10px_rgba(99,102,241,0.7)]';
                    }

                    return (
                      <div
                        key={test.id}
                        onClick={() => setSelectedTestForDetails(test)}
                        title={`Test ${test.testNumber}: ${test.title} (${isDone ? 'Attempted' : 'Unattempted'})`}
                        className="flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                      >
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                            isDone
                              ? completedBgClass
                              : isLast
                              ? 'bg-white/20 text-white/70 backdrop-blur-sm'
                              : 'bg-white/10 text-white/40 border border-white/15'
                          }`}
                        >
                          <Check className={`w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3] ${!isDone ? 'opacity-30' : 'opacity-100'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Numbers Under Capsule */}
              <div className="w-full hidden sm:flex items-center justify-between px-3 sm:px-4">
                {filteredTests.map((test, idx) => {
                  const isDone = !!progressMap[test.id]?.isCompleted;
                  return (
                    <div key={`num-${test.id}`} className="flex items-center justify-center w-5 sm:w-6">
                      <span
                        className={`text-[10px] sm:text-[11px] font-bold transition-colors ${
                          isDone ? 'text-indigo-400' : 'text-gray-500/60'
                        }`}
                      >
                        T{test.testNumber}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Compact Radial Percentage Circle */}
            <div className="shrink-0 flex items-center justify-center">
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                  <defs>
                    <linearGradient id="mockCircleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4338CA" />
                      <stop offset="50%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#818CF8" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="22"
                    cy="22"
                    r="17"
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="17"
                    fill="transparent"
                    stroke="url(#mockCircleGradient)"
                    strokeWidth="3.5"
                    strokeDasharray={106.81}
                    strokeDashoffset={106.81 - (stats.completionPercentage / 100) * 106.81}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10px] sm:text-xs font-black tracking-tight text-white font-mono">
                    {stats.completionPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tests Grid with Flashcard-style Mock Test Cards */}
      {filteredTests.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No mock tests match your search query "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-20">
          {filteredTests.map((test, idx) => (
            <MockTestCard
              key={test.id}
              test={test}
              index={idx}
              progress={progressMap[test.id]}
              onStartTest={() => handleLaunchTest(test.id)}
              onViewDetails={() => setSelectedTestForDetails(test)}
              onToggleComplete={() => handleToggleComplete(test)}
            />
          ))}
        </div>
      )}

      {/* Syllabus & Pattern Breakdown Modal */}
      {selectedTestForDetails && (
        <TestDetailsModal
          test={selectedTestForDetails}
          onClose={() => setSelectedTestForDetails(null)}
          onStart={() => {
            const id = selectedTestForDetails.id;
            setSelectedTestForDetails(null);
            handleLaunchTest(id);
          }}
        />
      )}
    </div>
  );
};
