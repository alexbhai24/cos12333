import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_MOCK_TESTS } from './MockTestsPage';
import { QuestionSolutionTabs } from '../components/QuestionSolutionTabs';
import { ScratchpadOverlay } from '../components/mock-tests/ScratchpadOverlay';
import {
  Maximize, Minimize, Clock, HelpCircle, BookOpen, AlertCircle,
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, Check,
  RotateCcw, Bookmark, Eye, FileText, Send, User, Award, Filter, Grid, MoreVertical,
  BarChart3, Trophy, Target, FastForward, ArrowLeft, Activity, Play, Pencil
} from 'lucide-react';

// --- Question Types ---
type QType = 'mcq' | 'image' | 'match' | 'assertion_reason' | 'assertion' | 'statement' | 'graphical';
type QStatus = 'not_visited' | 'not_answered' | 'answered' | 'marked' | 'answered_marked';

interface QuestionOption {
  text: string;
  imageUrl?: string;
}

interface Question {
  id: string;
  subjectName: 'Physics' | 'Chemistry' | 'Botany' | 'Zoology' | string;
  section: 'Section A' | 'Section B' | string;
  qType: QType;
  questionNumber: number;
  questionText: string;
  questionImageUrl?: string;
  imageUrl?: string;
  image?: string;
  statementA?: string;
  statementB?: string;
  assertion?: string;
  reason?: string;
  matchLeft?: [string, string, string, string] | string[];
  matchRight?: [string, string, string, string] | string[];
  options: QuestionOption[] | [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
  correctIndex: number;
  solutionExplanation?: string;
  videoSolutionUrl?: string;
}

// --- Authentic Full NEET Mock Questions Bank ---
const SAMPLE_EXAM_QUESTIONS: Question[] = [
  // ── BOTANY ─────────────────────────────────────────────────────────────
  {
    id: 'b1',
    subjectName: 'Botany',
    section: 'Section A',
    qType: 'mcq',
    questionNumber: 1,
    questionText: 'During non-cyclic photophosphorylation, the primary electron acceptor from Photosystem II (PS II) is:',
    options: [
      { text: 'Plastoquinone' },
      { text: 'Pheophytin' },
      { text: 'Plastocyanin' },
      { text: 'Ferredoxin' }
    ],
    correctIndex: 1,
    solutionExplanation: 'Pheophytin is the primary electron acceptor from PS II (reaction center P680).'
  },
  {
    id: 'b2',
    subjectName: 'Botany',
    section: 'Section A',
    qType: 'match',
    questionNumber: 2,
    questionText: 'Match List-I with List-II concerning genetic disorders and inheritance:',
    matchLeft: ["Down's syndrome", "α-Thalassemia", "β-Thalassemia", "Klinefelter's syndrome"],
    matchRight: ["Trisomy of 21st chromosome", "HBA1/HBA2 gene on Chromosome 16", "HBB gene on Chromosome 11", "44 + XXY Karyotype"],
    options: [
      { text: 'A-I, B-II, C-III, D-IV' },
      { text: 'A-II, B-III, C-IV, D-I' },
      { text: 'A-III, B-IV, C-I, D-II' },
      { text: 'A-I, B-III, C-II, D-IV' }
    ],
    correctIndex: 0,
    solutionExplanation: "Down's is trisomy 21; alpha-thalassemia is linked to chromosome 16; beta-thalassemia to chromosome 11; Klinefelter is 47, XXY."
  },
  {
    id: 'b3',
    subjectName: 'Botany',
    section: 'Section A',
    qType: 'statement',
    questionNumber: 3,
    questionText: 'Read the following two statements regarding C4 photosynthesis in plants:',
    statementA: 'The primary CO2 acceptor in mesophyll cells of C4 plants is phosphoenolpyruvate (PEP).',
    statementB: 'Bundle sheath cells lack RuBisCO enzyme and contain large quantities of PEP carboxylase.',
    options: [
      { text: 'Both Statement I and Statement II are correct' },
      { text: 'Both Statement I and Statement II are incorrect' },
      { text: 'Statement I is correct but Statement II is incorrect' },
      { text: 'Statement I is incorrect but Statement II is correct' }
    ],
    correctIndex: 2,
    solutionExplanation: 'Statement I is correct. Statement II is incorrect because bundle sheath cells are rich in RuBisCO and lack PEP carboxylase.'
  },
  {
    id: 'b4',
    subjectName: 'Botany',
    section: 'Section A',
    qType: 'assertion_reason',
    questionNumber: 4,
    questionText: 'Given below are two statements: one is labelled as Assertion (A) and the other is labelled as Reason (R):',
    assertion: 'Apical dominance in plants can be promoted by the exogenous application of auxin.',
    reason: 'Auxin synthesized in the shoot apex suppresses the growth of lateral/axillary buds.',
    options: [
      { text: 'Both (A) and (R) are true and (R) is the correct explanation of (A)' },
      { text: 'Both (A) and (R) are true but (R) is not the correct explanation of (A)' },
      { text: '(A) is true but (R) is false' },
      { text: '(A) is false but (R) is true' }
    ],
    correctIndex: 0,
    solutionExplanation: 'Both Assertion and Reason are true, and Reason directly explains apical dominance promoted by apical auxins.'
  },
  {
    id: 'b5',
    subjectName: 'Botany',
    section: 'Section B',
    qType: 'mcq',
    questionNumber: 5,
    questionText: 'Which stage of prophase-I in meiosis is characterized by the dissolution of synaptonemal complex and formation of chiasmata?',
    options: [
      { text: 'Zygotene' },
      { text: 'Pachytene' },
      { text: 'Diplotene' },
      { text: 'Diakinesis' }
    ],
    correctIndex: 2,
    solutionExplanation: 'Diplotene is recognized by the dissolution of the synaptonemal complex and X-shaped chiasmata.'
  },

  // ── ZOOLOGY ────────────────────────────────────────────────────────────
  {
    id: 'z1',
    subjectName: 'Zoology',
    section: 'Section A',
    qType: 'mcq',
    questionNumber: 6,
    questionText: 'Which hormone triggers the release of bicarbonate ions and water from the exocrine pancreas?',
    options: [
      { text: 'Gastrin' },
      { text: 'Secretin' },
      { text: 'Cholecystokinin (CCK)' },
      { text: 'Enterogastrone' }
    ],
    correctIndex: 1,
    solutionExplanation: 'Secretin acts on the exocrine pancreas and stimulates secretion of water and bicarbonate ions.'
  },
  {
    id: 'z2',
    subjectName: 'Zoology',
    section: 'Section A',
    qType: 'mcq',
    questionNumber: 7,
    questionText: 'Select the incorrect statement with respect to human cardiac cycle and ECG:',
    options: [
      { text: 'P-wave represents the depolarization of the atria.' },
      { text: 'QRS complex represents the depolarization of the ventricles.' },
      { text: 'T-wave represents the repolarization of the ventricles.' },
      { text: 'The end of the T-wave marks the beginning of ventricular systole.' }
    ],
    correctIndex: 3,
    solutionExplanation: 'The end of the T-wave marks the end of ventricular systole, not the beginning.'
  },
  {
    id: 'z3',
    subjectName: 'Zoology',
    section: 'Section A',
    qType: 'match',
    questionNumber: 8,
    questionText: 'Match List I with List II regarding reproductive health contraceptive methods:',
    matchLeft: ['Non-medicated IUD', 'Copper releasing IUD', 'Hormone releasing IUD', 'Barrier method'],
    matchRight: ['Lippes loop', 'Multiload 375', 'LNG-20', 'Vaults/Diaphragms'],
    options: [
      { text: 'A-I, B-II, C-III, D-IV' },
      { text: 'A-II, B-I, C-IV, D-III' },
      { text: 'A-III, B-IV, C-I, D-II' },
      { text: 'A-IV, B-III, C-II, D-I' }
    ],
    correctIndex: 0,
    solutionExplanation: 'Lippes loop is non-medicated, Multiload 375 is Cu-releasing, LNG-20 releases progesterone, Vaults are barriers.'
  },
  {
    id: 'z4',
    subjectName: 'Zoology',
    section: 'Section B',
    qType: 'assertion_reason',
    questionNumber: 9,
    questionText: 'Given below are two statements: Assertion (A) and Reason (R):',
    assertion: 'The Juxtaglomerular apparatus (JGA) plays a complex regulatory role in kidney function through the RAAS mechanism.',
    reason: 'A fall in glomerular filtration rate (GFR) activates the JG cells to release erythropoietin which directly constricts systemic arterioles.',
    options: [
      { text: 'Both (A) and (R) are true and (R) is the correct explanation of (A)' },
      { text: 'Both (A) and (R) are true but (R) is not the correct explanation of (A)' },
      { text: '(A) is true but (R) is false' },
      { text: 'Both (A) and (R) are false' }
    ],
    correctIndex: 2,
    solutionExplanation: 'Assertion is true. Reason is false because JG cells release renin (not erythropoietin) in response to a fall in GFR.'
  },

  // ── PHYSICS ────────────────────────────────────────────────────────────
  {
    id: 'p1',
    subjectName: 'Physics',
    section: 'Section A',
    qType: 'mcq',
    questionNumber: 10,
    questionText: 'A particle of mass m is projected with velocity v making an angle of 45° with the horizontal. The magnitude of the angular momentum of the projectile about the point of projection at its maximum height H is:',
    options: [
      { text: '(m v³) / (4√2 g)' },
      { text: '(m v³) / (2√2 g)' },
      { text: '(m v²) / (4 g)' },
      { text: 'Zero' }
    ],
    correctIndex: 0,
    solutionExplanation: 'L = m * v_x * H = m * (v/√2) * (v²/(4g)) = (m v³) / (4√2 g).'
  },
  {
    id: 'p2',
    subjectName: 'Physics',
    section: 'Section A',
    qType: 'statement',
    questionNumber: 11,
    questionText: 'Consider the following statements regarding electromagnetic waves in vacuum:',
    statementA: 'In an electromagnetic wave, the electric field E and magnetic field B oscillate perpendicular to each other and perpendicular to the direction of wave propagation.',
    statementB: 'The ratio of amplitudes of electric and magnetic fields E₀ / B₀ in vacuum is equal to the speed of light c.',
    options: [
      { text: 'Both Statement I and Statement II are correct' },
      { text: 'Both Statement I and Statement II are incorrect' },
      { text: 'Statement I is correct but Statement II is incorrect' },
      { text: 'Statement I is incorrect but Statement II is correct' }
    ],
    correctIndex: 0,
    solutionExplanation: 'Both statements are fundamental properties of electromagnetic waves in vacuum: transverse nature and E₀ = c * B₀.'
  },
  {
    id: 'p3',
    subjectName: 'Physics',
    section: 'Section B',
    qType: 'mcq',
    questionNumber: 12,
    questionText: 'Two long parallel wires separated by distance d carry currents I₁ and I₂ in opposite directions. The force per unit length between them is:',
    options: [
      { text: 'Attractive, with magnitude (μ₀ I₁ I₂) / (2π d)' },
      { text: 'Repulsive, with magnitude (μ₀ I₁ I₂) / (2π d)' },
      { text: 'Attractive, with magnitude (μ₀ I₁ I₂) / (4π d)' },
      { text: 'Zero because opposite currents cancel the magnetic field' }
    ],
    correctIndex: 1,
    solutionExplanation: 'Currents in opposite directions repel each other with force per unit length F/L = (μ₀ I₁ I₂) / (2π d).'
  },

  // ── CHEMISTRY ──────────────────────────────────────────────────────────
  {
    id: 'c1',
    subjectName: 'Chemistry',
    section: 'Section A',
    qType: 'mcq',
    questionNumber: 13,
    questionText: 'Which of the following complex ions is diamagnetic in nature and exhibits low-spin d²sp³ hybridization?',
    options: [
      { text: '[Fe(CN)₆]³⁻' },
      { text: '[Co(NH₃)₆]³⁺' },
      { text: '[FeF₆]³⁻' },
      { text: '[NiCl₄]²⁻' }
    ],
    correctIndex: 1,
    solutionExplanation: '[Co(NH₃)₆]³⁺ contains Co³⁺ (3d⁶). In the presence of strong field ligand NH₃, all 6 d-electrons pair up giving d²sp³ diamagnetic state.'
  },
  {
    id: 'c2',
    subjectName: 'Chemistry',
    section: 'Section A',
    qType: 'statement',
    questionNumber: 14,
    questionText: 'Identify the correct statements regarding organic haloalkanes and nucleophilic substitution:',
    statementA: 'SN1 reactions proceed with complete inversion of configuration (Walden inversion).',
    statementB: 'Tertiary alkyl halides react faster in SN1 mechanism due to the greater stability of the tertiary carbocation intermediate.',
    options: [
      { text: 'Statement I is correct and Statement II is incorrect' },
      { text: 'Statement I is incorrect and Statement II is correct' },
      { text: 'Both Statement I and Statement II are correct' },
      { text: 'Both Statement I and Statement II are incorrect' }
    ],
    correctIndex: 1,
    solutionExplanation: 'SN1 proceeds with racemization (partial retention + inversion); SN2 proceeds with complete inversion. Statement II is correct.'
  },
  {
    id: 'c3',
    subjectName: 'Chemistry',
    section: 'Section B',
    qType: 'match',
    questionNumber: 15,
    questionText: 'Match List I (Colloids) with List II (Type of Colloid):',
    matchLeft: ['Butter', 'Milk', 'Pumice stone', 'Smoke'],
    matchRight: ['Gel (Liquid in Solid)', 'Emulsion (Liquid in Liquid)', 'Solid sol (Gas in Solid)', 'Aerosol (Solid in Gas)'],
    options: [
      { text: 'A-I, B-II, C-III, D-IV' },
      { text: 'A-II, B-I, C-IV, D-III' },
      { text: 'A-III, B-IV, C-I, D-II' },
      { text: 'A-I, B-III, C-II, D-IV' }
    ],
    correctIndex: 0,
    solutionExplanation: 'Butter is gel; Milk is liquid emulsion; Pumice stone is solid foam/sol; Smoke is aerosol of solid in gas.'
  }
];

export const NtaTestPage: React.FC = () => {
  const { setCurrentRoute, user, setIsAppleShopOpen } = useApp();

  // Custom Test parsing
  const searchParams = new URLSearchParams(window.location.search);
  const testIdFromUrl = searchParams.get('testId');
  const testIdFromQuery = new URLSearchParams(window.location.search).get('testId');
  const segments = window.location.pathname.split('/');
  let testIdFromPath = '';
  if (segments.includes('active')) testIdFromPath = segments[segments.indexOf('active') + 1];
  else if (segments.includes('results')) testIdFromPath = segments[segments.indexOf('results') + 1];
  
  const activeTestIdLocal = testIdFromQuery || testIdFromPath || localStorage.getItem('active_test_id');
  const customTestId = testIdFromUrl || activeTestIdLocal;

  const customTest = useMemo(() => {
    if (!customTestId) return null;
    try {
      const stored = localStorage.getItem('cosmic_custom_tests_v1');
      if (stored) {
        const tests = JSON.parse(stored) as any[];
        return tests.find(t => t.id === customTestId);
      }
    } catch {}
    return null;
  }, [customTestId]);

  const customQuestions = useMemo(() => {
    if (!customTest) return null;
    try {
      const qStored = localStorage.getItem('cosmic_question_bank_v1');
      const qs = qStored ? (JSON.parse(qStored) as any[]) : [];
      // Map Creator Studio Question to NtaTestPage Question format
      return customTest.questions.map((qRef: any, index: number) => {
        const qObj = qs.find(q => q.id === (qRef.id || qRef)) || (typeof qRef === 'object' && qRef.questionText ? qRef : null);
        if (!qObj) return null;

        let subj = qObj.subjectName || 'Physics';
        if (subj.toLowerCase().includes('phy')) subj = 'Physics';
        else if (subj.toLowerCase().includes('chem')) subj = 'Chemistry';
        else if (subj.toLowerCase().includes('bot')) subj = 'Botany';
        else if (subj.toLowerCase().includes('zoo')) subj = 'Zoology';
        else if (subj.toLowerCase().includes('math')) subj = 'Mathematics';

        // Options mapping
        const rawOpts = qObj.options || [];
        const mappedOptions: QuestionOption[] = rawOpts.map((opt: any) => {
          if (typeof opt === 'string') return { text: opt, imageUrl: undefined };
          return {
            text: opt?.text || '',
            imageUrl: opt?.imageUrl || opt?.image || undefined
          };
        });
        while (mappedOptions.length < 4) {
          mappedOptions.push({ text: `Option ${mappedOptions.length + 1}`, imageUrl: undefined });
        }

        return {
          id: qObj.id || `q_${index}`,
          subjectName: subj,
          section: qObj.section || 'Section A',
          qType: qObj.qType || (qObj.questionImageUrl || qObj.imageUrl || qObj.image ? 'image' : 'mcq'),
          questionNumber: index + 1,
          questionText: qObj.questionText || '',
          questionImageUrl: qObj.questionImageUrl || qObj.imageUrl || qObj.image || undefined,
          options: mappedOptions,
          correctIndex: qObj.correctIndex ?? 0,
          solutionExplanation: qObj.explanation || qObj.solutionExplanation || '',
          videoSolutionUrl: qObj.videoSolutionUrl || qObj.videoSolution || undefined,
          statementA: qObj.statementA,
          statementB: qObj.statementB,
          assertion: qObj.assertion || qObj.statementA,
          reason: qObj.reason || qObj.statementB,
          matchLeft: qObj.matchLeft,
          matchRight: qObj.matchRight
        } as Question;
      }).filter(Boolean) as Question[];
    } catch (e) {
      console.error('Error parsing custom questions:', e);
    }
    return null;
  }, [customTest]);

  // Active test metadata
  const testIdFromQuery2 = new URLSearchParams(window.location.search).get('testId');
  const segments2 = window.location.pathname.split('/');
  let testIdFromPath2 = '';
  if (segments2.includes('active')) testIdFromPath2 = segments2[segments2.indexOf('active') + 1];
  else if (segments2.includes('results')) testIdFromPath2 = segments2[segments2.indexOf('results') + 1];

  const activeTestId = testIdFromQuery2 || testIdFromPath2 || localStorage.getItem('active_test_id');
  const activeTest = customTest || ALL_MOCK_TESTS.find(t => t.id === activeTestId) || ALL_MOCK_TESTS[0];

  // State
  const [questions, setQuestions] = useState<Question[]>(customQuestions && customQuestions.length > 0 ? customQuestions : SAMPLE_EXAM_QUESTIONS);

  // Sync questions when customQuestions changes
  useEffect(() => {
    if (customQuestions && customQuestions.length > 0) {
      setQuestions(customQuestions);
      const initial: Record<string, QStatus> = {};
      customQuestions.forEach((q, i) => {
        initial[q.id] = i === 0 ? 'not_answered' : 'not_visited';
      });
      setStatuses(initial);
      setCurrentIndex(0);
    }
  }, [customQuestions]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [statuses, setStatuses] = useState<Record<string, QStatus>>({});
  const [timeLeft, setTimeLeft] = useState((activeTest?.durationMins || 195) * 60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

  // Modals & Panels
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isPaletteOpenMobile, setIsPaletteOpenMobile] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(() => {
    return window.location.pathname.includes('/results/');
  });
  const [isSolutionsMode, setIsSolutionsMode] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const isResults = window.location.pathname.includes('/results/');
      setIsTestSubmitted(isResults);
      if (!isResults) setIsSolutionsMode(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const activeQuestion = questions[currentIndex] || questions[0];

  // Distinct subjects present in the current test
  const subjects = useMemo(() => {
    const presentSubjects = new Set<string>();
    questions.forEach(q => {
      if (q.subjectName) presentSubjects.add(q.subjectName);
    });
    // Preserve standard ordering if possible, otherwise append rest
    const standardOrder = ['Physics', 'Chemistry', 'Botany', 'Zoology', 'Mathematics'];
    const orderedSubjects = standardOrder.filter(s => presentSubjects.has(s));
    const otherSubjects = Array.from(presentSubjects).filter(s => !standardOrder.includes(s));
    return [...orderedSubjects, ...otherSubjects];
  }, [questions]);

  // Initialize status on mount
  useEffect(() => {
    const initial: Record<string, QStatus> = {};
    questions.forEach((q, i) => {
      initial[q.id] = i === 0 ? 'not_answered' : 'not_visited';
    });
    setStatuses(initial);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || isTestSubmitted) {
      if (timeLeft <= 0 && !isTestSubmitted) {
        setIsTestSubmitted(true);
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isTestSubmitted]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Status statistics calculation
  const stats = useMemo(() => {
    let answered = 0;
    let not_answered = 0;
    let not_visited = 0;
    let marked = 0;
    let answered_marked = 0;

    questions.forEach(q => {
      const st = statuses[q.id] || 'not_visited';
      if (st === 'answered') answered++;
      else if (st === 'not_answered') not_answered++;
      else if (st === 'marked') marked++;
      else if (st === 'answered_marked') answered_marked++;
      else not_visited++;
    });

    return { answered, not_answered, not_visited, marked, answered_marked };
  }, [statuses, questions]);

  // Jump to Question
  const jumpTo = useCallback((index: number, closeDrawer = true) => {
    if (index < 0 || index >= questions.length) return;
    
    // If target question is not visited, change it to not_answered
    const targetQ = questions[index];
    if ((statuses[targetQ.id] || 'not_visited') === 'not_visited') {
      setStatuses(prev => ({ ...prev, [targetQ.id]: 'not_answered' }));
    }

    setCurrentIndex(index);
    if (closeDrawer) {
      setIsPaletteOpenMobile(false);
    }
  }, [questions, statuses]);

  // Option selection
  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [activeQuestion.id]: optionIndex }));
  };

  // Action: Clear Response
  const handleClear = () => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[activeQuestion.id];
      return next;
    });
    // Revert status to not answered if it was answered
    setStatuses(prev => ({ ...prev, [activeQuestion.id]: 'not_answered' }));
  };

  // Action: Save & Next
  const handleSaveAndNext = () => {
    const hasAnswer = answers[activeQuestion.id] !== undefined;
    setStatuses(prev => ({
      ...prev,
      [activeQuestion.id]: hasAnswer ? 'answered' : 'not_answered'
    }));

    if (currentIndex < questions.length - 1) {
      jumpTo(currentIndex + 1);
    }
  };

  // Action: Save & Mark for Review
  const handleSaveAndMarkReview = () => {
    const hasAnswer = answers[activeQuestion.id] !== undefined;
    setStatuses(prev => ({
      ...prev,
      [activeQuestion.id]: hasAnswer ? 'answered_marked' : 'marked'
    }));

    if (currentIndex < questions.length - 1) {
      jumpTo(currentIndex + 1);
    }
  };

  // Action: Mark for Review & Next
  const handleMarkReviewAndNext = () => {
    const hasAnswer = answers[activeQuestion.id] !== undefined;
    setStatuses(prev => ({
      ...prev,
      [activeQuestion.id]: hasAnswer ? 'answered_marked' : 'marked'
    }));

    if (currentIndex < questions.length - 1) {
      jumpTo(currentIndex + 1);
    }
  };

  // Calculate final score when submitted
  const resultScore = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    questions.forEach(q => {
      const userAns = answers[q.id];
      if (userAns === undefined) {
        unattempted++;
      } else if (userAns === q.correctIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const marks = (correct * 4) - (wrong * 1);
    return { correct, wrong, unattempted, marks, totalMarks: questions.length * 4 };
  }, [questions, answers]);

  // Submit test confirmation
  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    setIsTestSubmitted(true);
    
    if (activeTest?.id && activeTest.exam) {
      try {
        const storageKey = `cosmic_mock_tests_progress_v1_${activeTest.exam}`;
        const saved = localStorage.getItem(storageKey);
        const progressMap = saved ? JSON.parse(saved) : {};
        
        const scorePct = (resultScore.totalMarks > 0) ? Math.round((resultScore.marks / resultScore.totalMarks) * 100) : 0;
        
        progressMap[activeTest.id] = {
          isCompleted: true,
          score: resultScore.marks,
          accuracy: scorePct,
          attemptDate: new Date().toISOString()
        };
        
        localStorage.setItem(storageKey, JSON.stringify(progressMap));
      } catch (e) {
        console.error("Failed to save progress", e);
      }
    }

    if (activeTest?.id) {
      window.history.pushState(null, '', `/tools/mock-tests/results/${activeTest.id}`);
    }
  };

  // Render question palette item badge
  const renderPaletteButton = (q: Question, idx: number) => {
    const status = statuses[q.id] || 'not_visited';
    const isCurrent = currentIndex === idx;

    let bgClass = '';
    let dotClass = '';
    let customStyle = {};
    let customDotStyle = {};
    
    if (status === 'answered') {
      bgClass = 'bg-[#107020] border-transparent text-white'; // Dark Green
      dotClass = 'bg-[#a3e6b2]';
    } else if (status === 'not_answered') {
      bgClass = 'bg-[#a31a1a] border-transparent text-white'; // Dark Red
      dotClass = 'bg-[#fcb3b3]';
    } else if (status === 'marked') {
      bgClass = 'bg-[#4b279e] border-transparent text-white'; // Dark Purple
      dotClass = 'bg-[#c3aef7]';
    } else if (status === 'answered_marked') {
      bgClass = 'border-transparent text-white relative overflow-hidden'; 
      customStyle = { background: 'linear-gradient(135deg, #107020 50%, #4b279e 50%)' };
      dotClass = 'z-10';
      customDotStyle = { background: 'linear-gradient(90deg, #a3e6b2 50%, #c3aef7 50%)' };
    } else {
      bgClass = 'bg-[#1e1f26] border-white/20 text-slate-300'; // Dark Grey for Not Visited
      dotClass = 'hidden';
    }

    return (
      <button
        key={q.id}
        onClick={() => jumpTo(idx)}
        title={`Q${idx + 1} (${q.subjectName}) - ${status.replace('_', ' ')}`}
        className={`w-12 h-14 sm:w-14 sm:h-16 flex flex-col items-center justify-center gap-1.5 rounded-lg border transition-all shrink-0 ${bgClass} ${
          isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-[#181b26] z-10 scale-105 shadow-xl' : 'hover:opacity-90 hover:scale-105'
        }`}
        style={customStyle}
      >
        <span className="text-[13px] sm:text-[15px] font-bold mt-1 z-10">{idx + 1}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} style={customDotStyle}></span>
      </button>
    );
  };

  // Section-wise statistics calculation
  const sectionStats = useMemo(() => {
    const stats: Record<string, { correct: number, wrong: number, unattempted: number, total: number }> = {};
    
    // Initialize stats for each subject
    subjects.forEach(subj => {
      stats[subj] = { correct: 0, wrong: 0, unattempted: 0, total: 0 };
    });

    questions.forEach(q => {
      const subj = q.subjectName || 'General';
      if (!stats[subj]) stats[subj] = { correct: 0, wrong: 0, unattempted: 0, total: 0 };
      
      stats[subj].total++;
      const userAns = answers[q.id];
      if (userAns === undefined) {
        stats[subj].unattempted++;
      } else if (userAns === q.correctIndex) {
        stats[subj].correct++;
      } else {
        stats[subj].wrong++;
      }
    });

    return subjects.map(subj => {
      const s = stats[subj];
      const score = (s.correct * 4) - (s.wrong * 1);
      const attempted = s.correct + s.wrong;
      const accuracy = attempted > 0 ? Math.round((s.correct / attempted) * 100) : 0;
      
      return {
        subject: subj,
        score,
        correct: s.correct,
        wrong: s.wrong,
        unattempted: s.unattempted,
        total: s.total,
        accuracy
      };
    });
  }, [questions, answers, subjects]);

  // ── Result Submission View ──────────────────────────────────────────
  if (isTestSubmitted && !isSolutionsMode) {
    const totalTimeSpent = (activeTest?.durationMins || 195) * 60 - timeLeft;
    const timeSpentFormatted = formatTime(totalTimeSpent);
    
    // Calculate Percentile (Mock calculation based on score ratio)
    const scoreRatio = Math.max(0, resultScore.marks / resultScore.totalMarks);
    const mockPercentile = scoreRatio > 0 ? (scoreRatio * 100 * 0.9 + 5).toFixed(2) : '3.36'; 
    const mockRank = Math.floor(1500000 - (scoreRatio * 1490000));
    
    const accuracy = (resultScore.correct + resultScore.wrong) > 0 
      ? Math.round((resultScore.correct / (resultScore.correct + resultScore.wrong)) * 100) 
      : 0;
    const completedPct = Math.round(((resultScore.correct + resultScore.wrong) / questions.length) * 100);

    return (
      <div className="h-screen w-full bg-[#12131c] text-slate-200 flex flex-col font-sans overflow-y-auto custom-scrollbar">
        {/* Header (Transparent & Seamless without black bar) */}
        <div className="flex items-center justify-between p-4 sm:p-6 max-w-4xl w-full mx-auto">
          <button onClick={() => setCurrentRoute('mock-tests', '', '/tools/mock-tests')} className="flex items-center gap-2 px-3.5 py-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-sm">Back</span>
          </button>
          <button
            onClick={() => setIsAppleShopOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full border border-emerald-500/30 text-emerald-400 transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/10 active:scale-95"
            title="Apples Balance"
          >
            <span className="text-sm leading-none">🍏</span>
            <span className="text-xs font-bold font-mono text-white">{user?.apples || 0}</span>
          </button>
        </div>

        <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 pb-20">
          
          {/* Top Test Info Card */}
          <div className="bg-[#181a25] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{activeTest?.title || 'Practice Test-01'}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-rose-400" /> {questions.length} Questions · {resultScore.totalMarks} Marks</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" /> {activeTest?.durationMins || 180} mins</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Attempted On: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => {
                  setAnswers({});
                  const initial: Record<string, 'not_answered' | 'not_visited'> = {};
                  questions.forEach((q, i) => {
                    initial[q.id] = i === 0 ? 'not_answered' : 'not_visited';
                  });
                  setStatuses(initial);
                  setCurrentIndex(0);
                  setTimeLeft((activeTest?.durationMins || 195) * 60);
                  setIsTestSubmitted(false);
                  setIsSolutionsMode(false);
                  
                  const newPath = window.location.pathname.replace('/results/', '/active/');
                  window.history.pushState(null, '', newPath);
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/5 transition-colors"
              >
                Reattempt
              </button>
              <button 
                onClick={() => {
                  setIsSolutionsMode(true);
                  setCurrentIndex(0);
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
              >
                View Solutions
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-white/10">
            <button className="px-1 py-3 text-sm font-semibold text-indigo-400 border-b-2 border-indigo-400">
              Result Summary
            </button>
            <button className="px-1 py-3 text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors">
              Leaderboard
            </button>
          </div>

          {/* Score & Rank Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-[#181a25] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-[160px] relative overflow-hidden">
              <div className="flex justify-between items-start z-10">
                <div>
                  <h3 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">Score</h3>
                  <div className="text-4xl font-black text-cyan-400 flex items-baseline gap-1">
                    {resultScore.marks}
                    <span className="text-xl text-slate-500">/{resultScore.totalMarks}</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div className="z-10 text-sm font-medium text-slate-300">
                Percentile (Predicted): <span className="font-bold text-white">{mockPercentile}</span>
              </div>
              
              <div className="absolute right-2 bottom-0 opacity-[0.03] pointer-events-none">
                <BarChart3 className="w-32 h-32" />
              </div>
            </div>

            <div className="bg-[#181a25] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-[160px] relative overflow-hidden">
              <div className="flex justify-between items-start z-10">
                <div>
                  <h3 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">Rank (Predicted)</h3>
                  <div className="text-4xl font-black text-amber-500">{mockRank.toLocaleString()}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              
              <div className="absolute right-4 bottom-2 opacity-90 pointer-events-none">
                {/* Simplified Podium Icon */}
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                  <path d="M4 16h4v6H4zM10 11h4v11h-4zM16 14h4v8h-4z" fill="currentColor" fillOpacity="0.8"/>
                  <circle cx="12" cy="5" r="3" fill="#fbbf24" stroke="none"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Your Progress */}
          <div className="bg-[#181a25] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-6">
            <h3 className="text-center font-bold text-lg text-white">Your Progress</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
              
              {/* Correct */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Correct
                  </div>
                  <span className="text-sm font-bold text-slate-300">{resultScore.correct}/{questions.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Marks Obtained</span>
                  <span className="font-semibold">{resultScore.correct * 4}</span>
                </div>
              </div>

              {/* Incorrect */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-rose-400">
                    <XCircle className="w-4 h-4" /> Incorrect
                  </div>
                  <span className="text-sm font-bold text-slate-300">{resultScore.wrong}/{questions.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Marks Lost</span>
                  <span className="font-semibold text-rose-400/80">-{resultScore.wrong}</span>
                </div>
              </div>

              {/* Skipped */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-400">
                    <FastForward className="w-4 h-4" /> Skipped
                  </div>
                  <span className="text-sm font-bold text-slate-300">{resultScore.unattempted}/{questions.length}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1 mb-2">
                  <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${(resultScore.unattempted / questions.length) * 100}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Marks Skipped</span>
                  <span className="font-semibold">{resultScore.unattempted * 4}</span>
                </div>
              </div>

              {/* Accuracy */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-400">
                    <Target className="w-4 h-4" /> Accuracy
                  </div>
                  <span className="text-sm font-bold text-slate-300">{accuracy}%</span>
                </div>
              </div>

              {/* Completed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-purple-400">
                    <FileText className="w-4 h-4" /> Completed
                  </div>
                  <span className="text-sm font-bold text-slate-300">{completedPct}%</span>
                </div>
              </div>

              {/* Time Taken */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
                    <Clock className="w-4 h-4" /> Time Taken
                  </div>
                  <span className="text-sm font-bold text-slate-300 font-mono">{timeSpentFormatted}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Section Wise Performance */}
          <div className="bg-[#181a25] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-5">
            <h3 className="font-bold text-sm text-white">Section Wise Performance</h3>
            
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-slate-400 font-semibold tracking-wide">
                    <th className="pb-3 pl-2">Section</th>
                    <th className="pb-3 text-center">Score</th>
                    <th className="pb-3 text-center">Percentile</th>
                    <th className="pb-3 text-center">Rank</th>
                    <th className="pb-3 text-center">Correct</th>
                    <th className="pb-3 text-center">Incorrect</th>
                    <th className="pb-3 text-center">Skipped</th>
                    <th className="pb-3 text-center">Accuracy</th>
                    <th className="pb-3 text-right pr-2">Time Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sectionStats.map(stat => (
                    <tr key={stat.subject} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 pl-2 font-medium text-slate-200">{stat.subject}</td>
                      <td className="py-4 text-center font-mono">{stat.score}</td>
                      <td className="py-4 text-center text-slate-400">--</td>
                      <td className="py-4 text-center text-slate-400">--</td>
                      <td className="py-4 text-center text-emerald-400">{stat.correct}</td>
                      <td className="py-4 text-center text-rose-400">{stat.wrong}</td>
                      <td className="py-4 text-center text-slate-400">{stat.unattempted}</td>
                      <td className="py-4 text-center">{stat.accuracy}%</td>
                      <td className="py-4 text-right pr-2 font-mono text-slate-400">--</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center pt-2">
              <button className="px-6 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2">
                Detailed Analysis <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0f111a] text-slate-200 flex flex-col overflow-hidden font-sans select-none">
      
      {/* ── 1. Top CBT Header Bar (Desktop) ── */}
      <header className="hidden md:flex bg-[#181b26] border-b border-[#2a2d3a] px-4 py-3 items-start justify-between shrink-0 shadow-sm">
        {/* Left: Profile & Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-400 flex items-center justify-center text-[#181b26] overflow-hidden shrink-0">
            <User className="w-9 h-9 mt-2" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col text-[13px] text-slate-300 gap-1.5 leading-none">
            <div className="flex items-center gap-2">
              <span className="w-32 inline-block font-medium">Candidate Name</span>
              <span className="font-semibold text-amber-500">: Rajan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-32 inline-block font-medium">Test Name</span>
              <span className="font-semibold text-amber-500 flex items-center gap-1.5">
                : {activeTest?.title || 'Practice Test-01'} <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-32 inline-block font-medium">{isSolutionsMode ? 'Mode' : 'Remaining Time'}</span>
              <span className="flex items-center gap-2 text-white">
                : 
                <span className="bg-[#0027b3] text-[#99baff] px-3 py-0.5 rounded-full font-mono font-bold text-[13px] tracking-widest shadow-inner">
                  {isSolutionsMode ? 'SOLUTIONS' : formatTime(timeLeft)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Tools */}
        <div className="flex flex-col items-end gap-2">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isSolutionsMode && (
              <button
                onClick={() => setIsScratchpadOpen(prev => !prev)}
                className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                  isScratchpadOpen
                    ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/20'
                    : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
                }`}
                title={isScratchpadOpen ? "Close Rough Pad" : "Rough Sheet (Draw to Solve)"}
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowPaperModal(true)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded transition-colors uppercase tracking-wider"
              title="View entire Question Paper"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Question Paper</span>
            </button>
            <button
              onClick={() => setShowInstructionsModal(true)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded transition-colors uppercase tracking-wider"
              title="Read test instructions"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Instructions</span>
            </button>
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
              className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-slate-300 hover:text-white flex items-center transition-colors"
            >
              {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. Sections / Subjects Bar (Desktop) ── */}
      <div className="hidden md:flex bg-[#12141c] border-b border-[#2a2d3a] items-center shrink-0 overflow-x-auto text-[14px]">
        {/* Subject Filter Tabs */}
        <div className="flex items-center px-2">
          {subjects.map(subj => {
            const isActive = activeQuestion.subjectName === subj;
            
            return (
              <button
                key={subj}
                onClick={() => {
                  const firstIdx = questions.findIndex(q => q.subjectName === subj);
                  if (firstIdx !== -1) jumpTo(firstIdx);
                }}
                className={`relative px-5 py-3 transition-colors ${
                  isActive 
                    ? 'text-white bg-[#181b26] font-medium' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-1/2 bg-slate-300 rounded-r-md" />
                )}
                {subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Mobile Header (Premium Compact) ── */}
      <div className="md:hidden flex flex-col bg-[#0f111a] shrink-0 select-none">
        
        {/* Top Section: Timer, Subject & Submit */}
        <div className="flex items-start justify-between px-3 pt-3 pb-2">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold text-[13px] tracking-wide">
              {isSolutionsMode ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  SOLUTIONS
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {formatTime(timeLeft)}
                </>
              )}
            </div>
            <div className="text-[12px] text-indigo-300 font-medium capitalize tracking-wide pl-0.5">
              {activeQuestion.subjectName}
            </div>
          </div>
          {!isSolutionsMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsScratchpadOpen(prev => !prev)}
                className={`p-2 rounded-lg transition-all shadow-sm flex items-center justify-center cursor-pointer ${
                  isScratchpadOpen
                    ? 'bg-amber-400 text-black ring-2 ring-amber-400/60 shadow-amber-400/20'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
                title={isScratchpadOpen ? "Close Rough Pad" : "Rough Sheet (Draw to Solve)"}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => setShowSubmitModal(true)} className="bg-[#e5e5fa] text-[#13151f] text-[11px] font-bold px-5 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-white">
                Submit
              </button>
            </div>
          )}
        </div>
        
        {/* Middle Section: Horizontal Question Strip */}
        <div className="flex items-center px-3 pb-2 relative">
          <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-0.5 pr-2">
            {questions.map((q, i) => {
              if (q.subjectName !== activeQuestion.subjectName) return null;
              
              const stat = statuses[q.id];
              let bgClass = "bg-[#13151f] text-slate-300"; // dark empty button
              if (stat === 'answered') bgClass = "bg-[#107020] text-white";
              else if (stat === 'not_answered') bgClass = "bg-[#ef4444] text-white"; // Bright red
              else if (stat === 'marked') bgClass = "bg-[#4b279e] text-white";
              else if (stat === 'answered_marked') bgClass = "text-white overflow-hidden relative";

              const isActive = i === currentIndex;
              
              return (
                <button
                  key={q.id}
                  onClick={() => jumpTo(i)}
                  className={`w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[13px] font-bold shrink-0 transition-all outline-none focus:outline-none ${bgClass} ${
                    isActive 
                      ? 'border-[2.5px] border-white shadow-md scale-105 z-10' 
                      : 'border border-white/10 hover:opacity-90'
                  }`}
                  style={stat === 'answered_marked' ? { background: 'linear-gradient(135deg, #107020 50%, #4b279e 50%)' } : {}}
                >
                  {stat === 'answered_marked' && <div className="absolute inset-0 bg-black/10 z-0"></div>}
                  <span className="z-10">{i + 1}</span>
                </button>
              );
            })}
          </div>
          
          {/* Fixed Grid Icon */}
          <div className="shrink-0 flex items-center justify-center pl-2">
            <button 
              onClick={() => setIsPaletteOpenMobile(true)} 
              className="w-[36px] h-[36px] flex items-center justify-center bg-[#252836] border border-white/10 hover:bg-white/10 rounded-[10px] text-[#a3b1ff] shadow-sm transition-colors outline-none focus:outline-none"
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Main Workspace: Question Area (Left) + Palette (Right) ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ── Main Question Panel ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0f111a] relative">

          {/* ── Scrollable Question Body ── */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5">
            
            {/* Question Meta Header (scrolls with question) */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#a3b1ff] text-[#0f111a] font-bold flex items-center justify-center text-[15px] shrink-0 shadow-sm">
                  {currentIndex + 1}
                </div>
                <div className="w-[1px] h-6 bg-white/20 mx-1"></div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-transparent border border-white/30 text-slate-300 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1">
                    Marks: <span className="text-emerald-400 font-bold">+4</span> <span className="text-rose-400 font-bold">-1</span>
                  </span>
                  <span className="bg-transparent border border-white/30 text-slate-300 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide">
                    Type: {activeQuestion.qType === 'mcq' ? 'Single' : activeQuestion.qType.toUpperCase().replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Right side: 3-dot menu */}
              <div className="flex items-center">
                <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-black/20 px-2 py-1 rounded border border-white/5 mr-3">
                  <span>View In:</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'English' | 'Hindi')}
                    aria-label="Select question language"
                    className="bg-transparent text-white font-medium outline-none cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
                <button className="text-slate-400 hover:text-white p-1">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Primary Question Text */}
            {activeQuestion.questionText && (
              <div className="text-sm sm:text-base md:text-lg font-medium text-white leading-relaxed">
                {activeQuestion.questionText}
              </div>
            )}

            {/* Question Image / Figure */}
            {(activeQuestion.questionImageUrl || activeQuestion.imageUrl || activeQuestion.image) && (
              <div className="my-2">
                <img 
                  src={activeQuestion.questionImageUrl || activeQuestion.imageUrl || activeQuestion.image} 
                  alt="Question Diagram" 
                  className="max-h-72 sm:max-h-96 w-auto max-w-full object-contain rounded-xl"
                />
              </div>
            )}

            {/* Special Type 1: Match The Column */}
            {activeQuestion.qType === 'match' && activeQuestion.matchLeft && activeQuestion.matchRight && (
              <div className="border border-white/10 rounded-xl overflow-hidden max-w-2xl bg-[#13151f] shadow-md">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3 w-1/2">List - I</th>
                      <th className="p-3 w-1/2 border-l border-white/10">List - II</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {activeQuestion.matchLeft.map((leftItem, i) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="p-3 text-slate-200">
                          <strong className="text-indigo-400 font-mono mr-2">{['A', 'B', 'C', 'D'][i]}.</strong>
                          {leftItem}
                        </td>
                        <td className="p-3 text-slate-200 border-l border-white/10">
                          <strong className="text-emerald-400 font-mono mr-2">{['I', 'II', 'III', 'IV'][i]}.</strong>
                          {activeQuestion.matchRight?.[i]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Special Type 2: Statement I & II */}
            {activeQuestion.qType === 'statement' && activeQuestion.statementA && activeQuestion.statementB && (
              <div className="space-y-3 max-w-3xl">
                <div className="p-3.5 rounded-xl bg-[#13151f] border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Statement I:</span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{activeQuestion.statementA}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#13151f] border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Statement II:</span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{activeQuestion.statementB}</p>
                </div>
              </div>
            )}

            {/* Special Type 3: Assertion and Reason */}
            {(activeQuestion.qType === 'assertion_reason' || activeQuestion.qType === 'assertion') && activeQuestion.assertion && activeQuestion.reason && (
              <div className="space-y-3 max-w-3xl">
                <div className="p-3.5 rounded-xl bg-[#13151f] border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Assertion (A):</span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{activeQuestion.assertion}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#13151f] border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Reason (R):</span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{activeQuestion.reason}</p>
                </div>
              </div>
            )}

            {/* ── Four Options ── */}
            <div className="space-y-3 pt-2 max-w-3xl">
              {activeQuestion.options.map((option, optIdx) => {
                const isSelected = answers[activeQuestion.id] === optIdx;
                const isCorrect = activeQuestion.correctIndex === optIdx;
                const optImage = option.imageUrl;
                
                let containerClass = "bg-[#181b26] border-white/10 hover:border-white/20 hover:bg-white/[0.02]";
                let bubbleClass = "border-white/30 bg-black/20";
                
                if (isSolutionsMode) {
                  if (isCorrect) {
                    containerClass = "bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/30 ring-1 ring-emerald-500";
                    bubbleClass = "border-emerald-400 bg-emerald-500";
                  } else if (isSelected) {
                    containerClass = "bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/30 ring-1 ring-rose-500 opacity-70";
                    bubbleClass = "border-rose-400 bg-rose-500";
                  } else {
                    containerClass = "bg-[#181b26] border-white/5 opacity-50";
                  }
                } else if (isSelected) {
                  containerClass = "bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/30 ring-1 ring-indigo-500";
                  bubbleClass = "border-indigo-400 bg-indigo-500";
                }

                return (
                  <label
                    key={optIdx}
                    onClick={() => { if (!isSolutionsMode) handleSelectOption(optIdx); }}
                    className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border transition-all ${isSolutionsMode ? 'cursor-default' : 'cursor-pointer'} ${containerClass}`}
                  >
                    {/* Option Letter Bubble */}
                    <div className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors text-[11px] font-black ${bubbleClass}`}>
                      {(isSelected || (isSolutionsMode && isCorrect))
                        ? <div className="w-2 h-2 rounded-full bg-white" />
                        : <span className="text-white/60">{['A','B','C','D'][optIdx]}</span>
                      }
                    </div>

                    {/* Option Text & Optional Image */}
                    <div className="flex-1 flex flex-col gap-2 text-xs sm:text-sm leading-relaxed text-slate-200">
                      <div className="flex items-start">
                        {option.text && <span>{option.text}</span>}
                      </div>
                      {optImage && (
                        <div className="mt-1">
                          <img 
                            src={optImage} 
                            alt={`Option ${['A','B','C','D'][optIdx]}`} 
                            className="max-h-36 sm:max-h-44 w-auto object-contain rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* ── Solutions Mode: Explanation & Video Panel ── */}
            {isSolutionsMode && (
              <div className="pt-4 max-w-3xl">
                <QuestionSolutionTabs
                  textSolution={activeQuestion.solutionExplanation}
                  videoUrl={activeQuestion.videoSolutionUrl}
                  theme="cbt"
                  defaultTab={activeQuestion.solutionExplanation ? 'text' : 'video'}
                />
              </div>
            )}

          </div>

          {/* ── 4. Bottom Action Bar (Desktop) ── */}
          <footer className="hidden md:flex bg-[#181b26] border-t border-[#2a2d3a] p-3 sm:px-6 flex-col gap-3 shrink-0 shadow-lg select-none">
            {isSolutionsMode ? (
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => setIsSolutionsMode(false)}
                  className="px-6 py-2.5 rounded text-xs font-bold bg-[#3d3d3d] hover:bg-[#4b4b4b] text-white transition-all uppercase tracking-wide"
                >
                  Back to Dashboard
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => jumpTo(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className="px-5 py-2.5 rounded text-[11px] font-semibold bg-[#3d3d3d] hover:bg-[#4b4b4b] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors uppercase flex items-center gap-1.5"
                  >
                    <span>&lt; Previous</span>
                  </button>
                  <button
                    onClick={() => jumpTo(Math.min(questions.length - 1, currentIndex + 1))}
                    disabled={currentIndex === questions.length - 1}
                    className="px-6 py-2.5 rounded text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all uppercase shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                  >
                    <span>Next &gt;</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Top Row: Primary & Review Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleSaveAndNext}
                      className="flex-1 sm:flex-none px-5 py-2 sm:py-2.5 rounded text-xs font-semibold bg-[#007b22] hover:bg-[#00681d] text-white transition-all active:scale-95"
                    >
                      SAVE & NEXT
                    </button>

                    <button
                      onClick={handleClear}
                      className="px-4 py-2 sm:py-2.5 rounded text-xs font-semibold bg-[#4b4b4b] hover:bg-[#3d3d3d] text-white transition-colors"
                    >
                      CLEAR
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleSaveAndMarkReview}
                      className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 rounded text-[11px] font-semibold bg-[#004bb6] hover:bg-[#003d99] text-white transition-colors uppercase tracking-wider"
                    >
                      Save & Mark for Review
                    </button>

                    <button
                      onClick={handleMarkReviewAndNext}
                      className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 rounded text-[11px] font-semibold bg-[#8e4a00] hover:bg-[#7a3f00] text-white transition-colors uppercase tracking-wider"
                    >
                      Mark for Review & Next
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Navigation & Submit */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => jumpTo(Math.max(0, currentIndex - 1))}
                      disabled={currentIndex === 0}
                      className="px-4 py-2 rounded text-[11px] font-semibold bg-[#3d3d3d] hover:bg-[#4b4b4b] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-1.5 uppercase"
                    >
                      <span>&lt; Back</span>
                    </button>

                    <button
                      onClick={() => jumpTo(Math.min(questions.length - 1, currentIndex + 1))}
                      disabled={currentIndex === questions.length - 1}
                      className="px-4 py-2 rounded text-[11px] font-semibold bg-[#3d3d3d] hover:bg-[#4b4b4b] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-1.5 uppercase"
                    >
                      <span>Next &gt;</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-6 py-2 rounded text-xs font-bold bg-[#007b22] hover:bg-[#00681d] text-white transition-all active:scale-95 uppercase tracking-wide"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </footer>

          {/* ── Mobile Action Bar ── */}
          <footer className="md:hidden bg-[#0f111a] border-t border-white/5 p-3 flex justify-between items-center shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
            {isSolutionsMode ? (
              <div className="flex w-full justify-between gap-3">
                <button
                  onClick={() => setIsSolutionsMode(false)}
                  className="flex-1 py-3 rounded-[10px] text-[11px] font-bold bg-[#181b26] border border-white/10 text-slate-300 uppercase tracking-wider"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => jumpTo(Math.min(questions.length - 1, currentIndex + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="flex-1 py-3 rounded-[10px] text-[11px] font-bold bg-indigo-600 text-white shadow-lg uppercase tracking-wider disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-[11px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Clear
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkReviewAndNext}
                    className="px-3 py-3 rounded-[10px] text-[10px] font-bold bg-[#181b26] border border-white/10 text-slate-300 uppercase tracking-wider"
                  >
                    Mark & Next
                  </button>
                  <button
                    onClick={handleSaveAndNext}
                    className="px-5 py-3 rounded-[10px] text-[11px] font-bold bg-[#e5e5fa] text-[#13151f] shadow-lg uppercase tracking-wider"
                  >
                    Save & Next
                  </button>
                </div>
              </>
            )}
          </footer>
        </div>

        {/* ── 5. Right Column: Question Palette (Premium Style) ── */}
        <aside className="hidden lg:flex w-80 xl:w-88 bg-[#181b26] border-l border-[#2a2d3a] flex-col shrink-0 select-none">
          
          {/* New Legend */}
          <div className="p-4 border-b border-[#2a2d3a] bg-[#12141c] grid grid-cols-2 gap-x-2 gap-y-3 text-xs text-slate-300">
            {/* Answered */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#107020] text-white font-bold flex items-center justify-center rounded shadow-sm shrink-0">
                {stats.answered}
              </div>
              <span className="font-medium text-slate-200">Answered</span>
            </div>

            {/* Not Answered */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#a31a1a] text-white font-bold flex items-center justify-center rounded shadow-sm shrink-0">
                {stats.not_answered}
              </div>
              <span className="font-medium text-slate-200">Not Answered</span>
            </div>

            {/* Marked for Review */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#4b279e] text-white font-bold flex items-center justify-center rounded shadow-sm shrink-0">
                {stats.marked}
              </div>
              <span className="font-medium text-slate-200">Marked for Review</span>
            </div>

            {/* Not Visited */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#1e1f26] border border-white/20 text-slate-300 font-bold flex items-center justify-center rounded shrink-0">
                {stats.not_visited}
              </div>
              <span className="font-medium text-slate-300">Not Visited</span>
            </div>

            {/* Answered & Marked */}
            <div className="flex items-center gap-2 col-span-2 pt-1">
              <div className="w-7 h-7 text-white font-bold flex items-center justify-center rounded shadow-sm shrink-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #107020 50%, #4b279e 50%)' }}>
                <span className="z-10">{stats.answered_marked}</span>
              </div>
              <span className="font-medium text-slate-300">
                Answered and Marked for Review
              </span>
            </div>
          </div>

          {/* Question Number Grid */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-wrap gap-2 content-start">
            {questions.map((q, i) => {
              if (q.subjectName === activeQuestion.subjectName) {
                return renderPaletteButton(q, i);
              }
              return null;
            })}
          </div>

          {/* Quick Submit Test Action in Palette Footer */}
          <div className="p-3 border-t border-white/10 bg-[#13151f]">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all cursor-pointer"
            >
              SUBMIT EXAMINATION
            </button>
          </div>

        </aside>

      </div>

      {/* ── 6. Mobile Drawer Question Palette ── */}
      {isPaletteOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsPaletteOpenMobile(false)}></div>
          <div className="relative ml-auto w-[85%] max-w-sm bg-[#181b26] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-[17px] text-white">All Questions</h3>
              <button onClick={() => setIsPaletteOpenMobile(false)} className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Subject Filter Tabs */}
            <div className="flex items-center overflow-x-auto bg-[#13151f] border-b border-white/10 no-scrollbar p-2 gap-2 shrink-0">
              {subjects.map(subj => {
                const isActive = activeQuestion.subjectName === subj;
                return (
                  <button
                    key={subj}
                    onClick={() => {
                      const firstIdx = questions.findIndex(q => q.subjectName === subj);
                      if (firstIdx !== -1) {
                        jumpTo(firstIdx, false);
                        // We don't close it automatically so they can see the grid change
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-colors ${
                      isActive 
                        ? 'bg-[#2a2d3a] text-white shadow-sm ring-1 ring-white/10' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>

            {/* Mobile Legend */}
            <div className="p-4 border-b border-[#2a2d3a] bg-[#12141c] grid grid-cols-2 gap-x-2 gap-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#107020] text-white font-bold flex items-center justify-center rounded shadow-sm shrink-0">
                  {stats.answered}
                </div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#a31a1a] text-white font-bold flex items-center justify-center rounded shadow-sm shrink-0">
                  {stats.not_answered}
                </div>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#4b279e] text-white font-bold flex items-center justify-center rounded shadow-sm shrink-0">
                  {stats.marked}
                </div>
                <span>Marked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#1e1f26] border border-white/20 text-slate-300 font-bold flex items-center justify-center rounded shrink-0">
                  {stats.not_visited}
                </div>
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 pt-1">
                <div className="w-7 h-7 text-white font-bold flex items-center justify-center rounded shadow-sm shrink-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #107020 50%, #4b279e 50%)' }}>
                  <span className="z-10">{stats.answered_marked}</span>
                </div>
                <span>Answered & Marked (evaluated)</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div key={activeQuestion.subjectName} className="flex-1 overflow-y-auto p-3 flex flex-wrap gap-2 content-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              {questions.map((q, i) => {
                if (q.subjectName === activeQuestion.subjectName) {
                  return renderPaletteButton(q, i);
                }
                return null;
              })}
            </div>

            <div className="p-3 border-t border-white/10">
              <button
                onClick={() => {
                  setIsPaletteOpenMobile(false);
                  setShowSubmitModal(true);
                }}
                className="w-full py-2.5 rounded-lg text-xs font-bold bg-emerald-600 text-white"
              >
                SUBMIT EXAM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. Question Paper Modal ── */}
      {showPaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowPaperModal(false)}>
          <div className="bg-[#181b26] border border-white/10 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#13151f]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white">Full Question Paper View</h3>
              </div>
              <button onClick={() => setShowPaperModal(false)} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-white/5 text-xs sm:text-sm">
              {questions.map((q, i) => (
                <div key={q.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-400 text-sm">Question {i + 1} ({q.subjectName} - {q.section})</span>
                    <button
                      onClick={() => {
                        jumpTo(i);
                        setShowPaperModal(false);
                      }}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      Go to Question &rarr;
                    </button>
                  </div>
                  {q.questionText && <p className="text-white leading-relaxed">{q.questionText}</p>}
                  {(q.questionImageUrl || q.imageUrl || q.image) && (
                    <div className="p-2 rounded-lg bg-black/30 border border-white/10 max-w-sm">
                      <img src={q.questionImageUrl || q.imageUrl || q.image} alt="Question Diagram" className="max-h-40 object-contain rounded" />
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                    {q.options.map((opt, optI) => (
                      <div key={optI} className="text-slate-300 flex flex-col gap-1">
                        <div className="flex items-start">
                          <strong className="text-slate-500 mr-2 font-mono">{['A','B','C','D'][optI]}.</strong>
                          {opt.text && <span>{opt.text}</span>}
                        </div>
                        {opt.imageUrl && (
                          <img src={opt.imageUrl} alt={`Option ${['A','B','C','D'][optI]}`} className="max-h-24 object-contain rounded border border-white/10 bg-black/20 ml-5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-white/10 bg-[#13151f] flex justify-end">
              <button
                onClick={() => setShowPaperModal(false)}
                className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
              >
                Close Question Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. Test Instructions Modal ── */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowInstructionsModal(false)}>
          <div className="bg-[#181b26] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#13151f]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Examination Instructions</h3>
              </div>
              <button onClick={() => setShowInstructionsModal(false)} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-lg">
                <strong className="text-indigo-300 block mb-1">Marking Scheme:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Each correct response carries <span className="text-emerald-400 font-bold">+4 marks</span>.</li>
                  <li>Each incorrect response will deduct <span className="text-rose-400 font-bold">-1 mark</span> (Negative Marking).</li>
                  <li>Unattempted questions receive <span className="text-slate-400 font-bold">0 marks</span>.</li>
                </ul>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <strong className="text-white block mb-1">Navigation & Submission:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Click on <strong>Save & Next</strong> to save answer and move forward.</li>
                  <li>Click on <strong>Clear Response</strong> to deselect chosen option.</li>
                  <li>Questions marked as <strong>Answered & Marked for Review</strong> will be evaluated in the final score.</li>
                </ul>
              </div>
            </div>

            <div className="p-3 border-t border-white/10 bg-[#13151f] flex justify-end">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
              >
                Back to Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. Final Submit Confirmation Dialog (Premium Tablet UI) ── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowSubmitModal(false)}>
          <div className="bg-[#0f111a] border border-white/10 rounded-2xl w-full max-w-4xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="text-slate-400 text-xs font-medium mb-1">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
                <h2 className="text-white text-xl font-bold tracking-tight">{activeTest?.title || 'Re-NEET 2026'}</h2>
              </div>
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[10px] text-slate-400 font-medium mb-1 ml-2 sm:ml-0">Remaining Time</span>
                <span className="text-indigo-300 font-bold font-mono bg-indigo-900/40 border border-indigo-500/20 px-3 py-1 rounded-full text-sm shadow-inner">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white">Test Summary</h3>

            {/* List of Stats */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between p-3.5 bg-[#181b26] border border-white/10 rounded-xl hover:bg-[#1c202d] transition-colors">
                <span className="text-slate-200 font-medium text-sm">Total Questions</span>
                <span className="text-white font-bold text-sm">{questions.length}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#181b26] border border-white/10 rounded-xl hover:bg-[#1c202d] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#107020] shadow-sm"></span>
                  <span className="text-slate-200 font-medium text-sm">Answered</span>
                </div>
                <span className="text-white font-bold text-sm">{stats.answered}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#181b26] border border-white/10 rounded-xl hover:bg-[#1c202d] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#a31a1a] shadow-sm"></span>
                  <span className="text-slate-200 font-medium text-sm">Not Answered</span>
                </div>
                <span className="text-white font-bold text-sm">{stats.not_answered}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#181b26] border border-white/10 rounded-xl hover:bg-[#1c202d] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1e1f26] border border-white/20"></span>
                  <span className="text-slate-200 font-medium text-sm">Not Visited</span>
                </div>
                <span className="text-white font-bold text-sm">{stats.not_visited}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#181b26] border border-white/10 rounded-xl hover:bg-[#1c202d] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4b279e] shadow-sm"></span>
                  <span className="text-slate-200 font-medium text-sm">Marked for Review</span>
                </div>
                <span className="text-white font-bold text-sm">{stats.marked}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#181b26] border border-white/10 rounded-xl hover:bg-[#1c202d] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm overflow-hidden" style={{ background: 'linear-gradient(135deg, #107020 50%, #4b279e 50%)' }}></span>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-slate-200 font-medium text-sm">Answered & Marked for Review</span>
                    <span className="text-slate-400 text-[10px] font-normal">(will be considered for evaluation)</span>
                  </div>
                </div>
                <span className="text-white font-bold text-sm">{stats.answered_marked}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-full sm:flex-1 py-3 rounded-xl border border-white/30 hover:bg-white/5 text-white font-bold text-sm transition-all"
              >
                Resume Test
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="w-full sm:flex-1 py-3 rounded-xl bg-[#e5e5fa] hover:bg-white text-[#13151f] font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scratchpad Rough Work Drawing Overlay (Temporary, never saved) */}
      <ScratchpadOverlay
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

    </div>
  );
};
