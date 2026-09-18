import React, { useState, useMemo, useEffect, useRef } from 'react';
import { syllabusNEET } from '../data/syllabusNEET';
import { syllabusJEE } from '../data/syllabusJEE';
import { SyllabusSubject } from '../types/syllabus';
import { useApp } from '../context/AppContext';
import {
  Search,
  Flame,
  Atom,
  BookOpen,
  Check,
  Plus,
  Trash2,
  X,
  Download,
  Eye,
  Upload,
  Image as ImageIcon,
  PenTool,
  RotateCcw,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Zap,
  Mic,
  MicOff,
  Play,
  Square,
  Volume2,
  CheckCircle2,
  ListOrdered,
  FileText,
  Sparkles,
  Radio
} from 'lucide-react';

type ExamType = 'neet' | 'jee';

export interface MistakeEntry {
  id: string;
  exam: ExamType;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterTitle: string;
  topicTitle: string;
  sourceType: 'in_app' | 'photo' | 'manual' | 'voice';
  sourceName?: string;
  questionText: string;
  correctAnswer: string;
  explanation: string;
  mySlip: string;
  imageUrl?: string;
  audioUrl?: string;
  hasOptions?: boolean;
  options?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  isMastered: boolean;
  date: string;
}

const DEFAULT_MISTAKES: MistakeEntry[] = [
  {
    id: 'm1',
    exam: 'neet',
    subjectId: 'neet_physics',
    subjectName: 'Physics',
    chapterId: 'np2',
    chapterTitle: 'Kinematics',
    topicTitle: 'Motion in a plane: Projectile motion',
    sourceType: 'manual',
    sourceName: 'Practice Question',
    questionText: 'A projectile is thrown with velocity v at an angle theta. What is the radius of curvature of the trajectory at the highest point?',
    hasOptions: true,
    options: {
      a: 'R = v^2 / g',
      b: 'R = (v cos theta)^2 / g',
      c: 'R = (v sin theta)^2 / g',
      d: 'R = v^2 sin(2 theta) / g'
    },
    selectedOption: 'B',
    mySlip: 'I forgot that at the highest point velocity is purely horizontal (v cos theta) and acceleration is purely vertical (g).',
    correctAnswer: 'Option B: R = (v cos theta)^2 / g',
    explanation: 'At the apex, v_vertical = 0, so v_net = v*cos(theta). Normal acceleration is g. Radius of curvature R = v_perp^2 / a_normal = (v cos theta)^2 / g.',
    isMastered: false,
    date: '2026-09-10'
  },
  {
    id: 'm2',
    exam: 'neet',
    subjectId: 'neet_biology',
    subjectName: 'Biology',
    chapterId: 'nb1',
    chapterTitle: 'Diversity of the Living World',
    topicTitle: 'Biological classification: Five kingdoms',
    sourceType: 'photo',
    sourceName: 'Allen Mock Test 4',
    questionText: 'Identify the incorrect statement regarding Methanogens in Archaebacteria.',
    hasOptions: true,
    options: {
      a: 'Methanogens produce biogas from dung.',
      b: 'They are present in the gut of several ruminant animals.',
      c: 'Their cell walls contain peptidoglycan same as eubacteria.',
      d: 'They can survive in harsh marshy environments.'
    },
    selectedOption: 'C',
    mySlip: 'I misread "incorrect" and picked option A because methanogens produce biogas, but option C was false regarding cell wall peptidoglycan.',
    correctAnswer: 'Option C',
    explanation: 'Archaebacteria cell wall is distinct with branched chain lipids in membrane and pseudomurein in wall, helping them survive extreme marshes and rumen of cattle.',
    isMastered: true,
    date: '2026-09-08'
  },
  {
    id: 'm3',
    exam: 'jee',
    subjectId: 'jee_math',
    subjectName: 'Mathematics',
    chapterId: 'jm1',
    chapterTitle: 'Sets, Relations and Functions',
    topicTitle: 'Types of relations: Equivalence relation',
    sourceType: 'manual',
    sourceName: 'Daily Practice Problem (DPP)',
    questionText: 'Let R be a relation on integers where aRb if and only if a - b is divisible by 5. Check if R is an equivalence relation.',
    hasOptions: false,
    mySlip: 'Forgot to verify transitivity for negative differences.',
    correctAnswer: 'Equivalence Relation (Reflexive, Symmetric, Transitive)',
    explanation: 'Since a - a = 0 (divisible by 5), if 5 | (a - b) then 5 | (b - a). If 5 | (a - b) and 5 | (b - c), then 5 | (a - c). Hence all three hold.',
    isMastered: false,
    date: '2026-09-11'
  }
];

export const MistakeTrackerPage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  // Exam selector: Exclusively NEET & JEE Main
  const [selectedExam, setSelectedExam] = useState<ExamType>('neet');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Storage
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(() => {
    try {
      const saved = localStorage.getItem('cosmic_mistake_entries_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_MISTAKES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cosmic_mistake_entries_v2', JSON.stringify(mistakes));
    } catch {
      // ignore
    }
  }, [mistakes]);

  // Active syllabus dataset
  const currentSyllabus = selectedExam === 'neet' ? syllabusNEET : syllabusJEE;
  const validSubjects = useMemo(() => {
    return (currentSyllabus?.subjects || []).filter(Boolean);
  }, [currentSyllabus]);

  // Auto-select first subject on exam switch
  useEffect(() => {
    if (validSubjects.length > 0) {
      setActiveSubjectId(validSubjects[0].id);
    } else {
      setActiveSubjectId(null);
    }
  }, [selectedExam, validSubjects]);

  const activeSubject: SyllabusSubject | undefined = useMemo(() => {
    return validSubjects.find(s => s.id === activeSubjectId) || validSubjects[0];
  }, [validSubjects, activeSubjectId]);

  const cleanSubjectName = useMemo(() => {
    if (!activeSubject) return '';
    return activeSubject.name.replace(/\s*\(Theory:.*?\)/gi, '').replace(/\s*\(.*Marks\)/gi, '').trim();
  }, [activeSubject]);

  // 3-Step Guided Modal Wizard State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields - Step 1: Question Type & Media Notes
  const [questionFormat, setQuestionFormat] = useState<'mcq' | 'subjective'>('mcq');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Voice Recording state (MediaRecorder API)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Form Fields - Step 2: Syllabus & Details
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formChapterId, setFormChapterId] = useState('');
  const [formTopicTitle, setFormTopicTitle] = useState('');
  const [formCustomTopic, setFormCustomTopic] = useState('');
  const [formSourceName, setFormSourceName] = useState('');
  const [formQuestionText, setFormQuestionText] = useState('');
  
  // MCQ Options
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // Direct Subjective Answer
  const [formCorrectAnswer, setFormCorrectAnswer] = useState('');

  // Form Fields - Step 3: Analysis & Explanation
  const [formMySlip, setFormMySlip] = useState('');
  const [formExplanation, setFormExplanation] = useState('');

  // Lightbox View Full Image Modal
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Flipped card tracker for active cards
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        // Stop audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Could not access microphone for voice recording. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
  };

  // Synchronize form subject & chapters when modal opens
  useEffect(() => {
    if (isAddModalOpen && validSubjects.length > 0) {
      const initialSubj = validSubjects.find(s => s.id === activeSubjectId) || validSubjects[0];
      setFormSubjectId(initialSubj.id);
      if (initialSubj.chapters && initialSubj.chapters.length > 0) {
        setFormChapterId(initialSubj.chapters[0].id);
        if (initialSubj.chapters[0].topics && initialSubj.chapters[0].topics.length > 0) {
          setFormTopicTitle(initialSubj.chapters[0].topics[0].title);
        } else {
          setFormTopicTitle('');
        }
      }
    }
  }, [isAddModalOpen, activeSubjectId, validSubjects]);

  const formSelectedSubject = useMemo(() => {
    return validSubjects.find(s => s.id === formSubjectId);
  }, [validSubjects, formSubjectId]);

  const formChapters = useMemo(() => {
    return formSelectedSubject?.chapters || [];
  }, [formSelectedSubject]);

  const formSelectedChapter = useMemo(() => {
    return formChapters.find(c => c.id === formChapterId) || formChapters[0];
  }, [formChapters, formChapterId]);

  const formTopics = useMemo(() => {
    return formSelectedChapter?.topics || [];
  }, [formSelectedChapter]);

  // Filtered mistakes
  const subjectMistakes = useMemo(() => {
    return mistakes.filter(m => {
      if (m.exam !== selectedExam) return false;
      if (activeSubject && m.subjectId !== activeSubject.id) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQ = (m.questionText || '').toLowerCase().includes(q);
        const matchAns = (m.correctAnswer || '').toLowerCase().includes(q);
        const matchExp = (m.explanation || '').toLowerCase().includes(q);
        const matchCh = (m.chapterTitle || '').toLowerCase().includes(q);
        const matchTop = (m.topicTitle || '').toLowerCase().includes(q);
        return matchQ || matchAns || matchExp || matchCh || matchTop;
      }
      return true;
    });
  }, [mistakes, selectedExam, activeSubject, searchQuery]);

  // Stats
  const totalInSubject = subjectMistakes.length;
  const masteredInSubject = subjectMistakes.filter(m => m.isMastered).length;
  const percentage = totalInSubject > 0 ? Math.round((masteredInSubject / totalInSubject) * 100) : 0;

  // Toggle Mastered
  const toggleMastered = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMistakes(prev =>
      prev.map(m => (m.id === id ? { ...m, isMastered: !m.isMastered } : m))
    );
  };

  // Delete mistake
  const handleDeleteMistake = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this card from Error Book?')) {
      setMistakes(prev => prev.filter(m => m.id !== id));
    }
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Close modal reset
  const handleCloseModal = () => {
    if (isRecording) stopRecording();
    setIsAddModalOpen(false);
    setStep(1);
    setUploadedImage(null);
    setAudioBlobUrl(null);
    setFormQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setFormCorrectAnswer('');
    setFormMySlip('');
    setFormExplanation('');
  };

  // Save new mistake entry
  const handleSaveMistake = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formQuestionText && !uploadedImage && !audioBlobUrl) {
      alert('Please add a question statement, upload a photo, or record a voice note.');
      return;
    }

    const currentSubj = validSubjects.find(s => s.id === formSubjectId) || validSubjects[0];
    const currentCh = (currentSubj?.chapters || []).find(c => c.id === formChapterId) || currentSubj?.chapters[0];
    const finalTopic = formTopicTitle === '__custom' ? formCustomTopic : formTopicTitle;

    let finalCorrectAnswer = formCorrectAnswer;
    if (questionFormat === 'mcq') {
      const optVal =
        correctOption === 'A' ? optionA :
        correctOption === 'B' ? optionB :
        correctOption === 'C' ? optionC : optionD;
      finalCorrectAnswer = `Option ${correctOption}${optVal ? `: ${optVal}` : ''}`;
    }

    const newEntry: MistakeEntry = {
      id: 'm_' + Date.now(),
      exam: selectedExam,
      subjectId: currentSubj?.id || 'physics',
      subjectName: currentSubj?.name.replace(/\s*\(Theory:.*?\)/gi, '').trim() || 'Physics',
      chapterId: currentCh?.id || 'ch1',
      chapterTitle: currentCh?.title || 'Chapter',
      topicTitle: finalTopic || 'General Topic',
      sourceType: audioBlobUrl ? 'voice' : uploadedImage ? 'photo' : 'manual',
      sourceName: formSourceName || (questionFormat === 'mcq' ? 'MCQ Question' : 'Subjective Question'),
      questionText: formQuestionText || (uploadedImage ? 'Photo attached question' : 'Voice note recorded question'),
      hasOptions: questionFormat === 'mcq',
      options: questionFormat === 'mcq' ? { a: optionA, b: optionB, c: optionC, d: optionD } : undefined,
      selectedOption: questionFormat === 'mcq' ? correctOption : undefined,
      mySlip: formMySlip,
      correctAnswer: finalCorrectAnswer || 'Refer to solution',
      explanation: formExplanation || 'Reviewed concept',
      imageUrl: uploadedImage || undefined,
      audioUrl: audioBlobUrl || undefined,
      isMastered: false,
      date: new Date().toISOString().split('T')[0]
    };

    setMistakes(prev => [newEntry, ...prev]);
    handleCloseModal();
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Top Control Bar: Search + Exam Selector */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        {/* Global Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Error Book by chapter, topic, question, or formula..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--text-primary)] placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-primary)] shadow-sm transition-all"
          />
        </div>

        {/* Right Actions: Exam Toggle + Log Error Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] p-1 rounded-full border border-[var(--border-color)]">
            <button
              onClick={() => setSelectedExam('neet')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black transition-all ${
                selectedExam === 'neet'
                  ? 'bg-[var(--color-primary)] text-black shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>NEET (UG)</span>
            </button>

            <button
              onClick={() => setSelectedExam('jee')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black transition-all ${
                selectedExam === 'jee'
                  ? 'bg-[var(--color-primary)] text-black shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Atom className="w-4 h-4" />
              <span>JEE Main</span>
            </button>
          </div>

          <button
            onClick={() => {
              setStep(1);
              setIsAddModalOpen(true);
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:opacity-90 text-black font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center shrink-0"
            title="Add Error Question"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Subject Pills Row */}
      <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 mb-6 border-b border-[var(--border-color)]">
        {validSubjects.map(subject => {
          const cleanName = subject.name.replace(/\s*\(Theory:.*?\)/gi, '').replace(/\s*\(.*Marks\)/gi, '').trim();
          const isActive = activeSubjectId === subject.id;
          const count = mistakes.filter(m => m.exam === selectedExam && m.subjectId === subject.id).length;
          return (
            <button
              key={subject.id}
              onClick={() => setActiveSubjectId(subject.id)}
              className={`shrink-0 px-6 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${
                isActive
                  ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)] shadow-sm'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{cleanName}</span>
              {count > 0 && (
                <span className={`px-2 py-0.2 text-[11px] rounded-full font-extrabold ${isActive ? 'bg-[var(--color-primary)] text-black' : 'bg-white/10 text-white'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sticky Progress Bar */}
      {activeSubject && (
        <div className="sticky top-[72px] z-20 mb-5 pt-2">
          <div className="relative overflow-hidden bg-[var(--bg-surface-solid)]/70 border border-white/10 backdrop-blur-xl rounded-2xl px-4 sm:px-6 py-4 shadow-xl">
            <div
              className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500 rounded-full blur-[70px] pointer-events-none transition-opacity duration-1000"
              style={{ opacity: percentage > 0 ? 0.25 : 0.05 }}
            />

            <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                    {masteredInSubject} of {totalInSubject} errors resolved in {cleanSubjectName}
                  </h3>
                  {percentage === 100 && totalInSubject > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                      ALL RESOLVED
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs text-gray-400">
                  Target: Master every mistake to maximize your score in {selectedExam.toUpperCase()}.
                </span>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setIsAddModalOpen(true);
                }}
                className="w-8 h-8 rounded-full text-black bg-[var(--color-primary)] hover:opacity-90 shadow-md transition-all flex items-center justify-center shrink-0"
                title="Add Error Question"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="relative h-3 sm:h-5 w-full bg-white/10 border border-white/15 rounded-full shadow-inner overflow-hidden p-0.5 flex items-center">
                  <div
                    className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-[#059669] via-[#10b981] via-[#34d399] to-[#6ee7b7]"
                    style={{
                      width: percentage <= 0 ? '0%' : `${Math.max(percentage, 4)}%`,
                      boxShadow: percentage > 0 ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none'
                    }}
                  />
                </div>
              </div>

              <div className="shrink-0 text-xs sm:text-sm font-black text-emerald-400">
                {percentage}% Mastered
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {subjectMistakes.length === 0 ? (
        <div className="p-12 text-center bg-[var(--bg-surface-solid)]/30 border border-white/10 rounded-3xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
            <BookOpen className="w-7 h-7 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-lg font-bold text-white">No Errors Logged For {cleanSubjectName}</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Log your mistakes with MCQ options, audio voice notes, or photo solutions to turn weak topics into high scores.
          </p>
          <button
            onClick={() => {
              setStep(1);
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2 rounded-full bg-[var(--color-primary)] text-black text-xs font-bold shadow-lg"
          >
            Add First Error Question
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjectMistakes.map(entry => {
            const isFlipped = !!flippedCards[entry.id];

            return (
              <div
                key={entry.id}
                onClick={() => toggleFlip(entry.id)}
                className={`relative min-h-[300px] p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group shadow-lg ${
                  entry.isMastered
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-[var(--bg-surface-solid)]/60 border-white/10 hover:border-[var(--color-primary)]/50'
                }`}
              >
                {/* Top Badge & Action Row */}
                <div>
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="flex items-center justify-between gap-1.5 min-w-0">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/40 text-[var(--color-primary)] truncate max-w-[130px]" title={entry.chapterTitle}>
                        {entry.chapterTitle}
                      </span>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => toggleMastered(entry.id, e)}
                          className={`p-1.5 rounded-xl border transition-all ${
                            entry.isMastered
                              ? 'bg-emerald-500 text-black border-emerald-400'
                              : 'bg-white/5 border-white/10 text-white/50 hover:text-emerald-400 hover:border-emerald-400/40'
                          }`}
                          title={entry.isMastered ? 'Mastered!' : 'Mark as Mastered'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <button
                          onClick={(e) => handleDeleteMistake(entry.id, e)}
                          className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {entry.hasOptions ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          MCQ
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          SUBJECTIVE
                        </span>
                      )}

                      {entry.audioUrl && (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold flex items-center gap-1" title="Audio Note Attached">
                          <Mic className="w-3 h-3" /> Voice
                        </span>
                      )}

                      {entry.imageUrl && (
                        <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] font-bold flex items-center gap-1" title="Photo Attached">
                          <ImageIcon className="w-3 h-3" /> Photo
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-white/50 mb-2 truncate">
                    Topic: <span className="text-white/80">{entry.topicTitle}</span>
                  </div>

                  {/* FLIP CARD CONTENT */}
                  {!isFlipped ? (
                    /* FRONT SIDE */
                    <div className="space-y-3">
                      {/* Image Preview */}
                      {entry.imageUrl && (
                        <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-[#0e111d] max-h-48 flex items-center justify-center">
                          <img
                            src={entry.imageUrl}
                            alt="Question Photo"
                            className="w-full max-h-48 object-contain rounded-2xl"
                          />
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20 z-10 shadow-lg">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxImage(entry.imageUrl || null);
                              }}
                              className="p-1 text-white/80 hover:text-cyan-400 transition-colors"
                              title="View Image"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (entry.imageUrl) {
                                  const link = document.createElement('a');
                                  link.href = entry.imageUrl;
                                  link.download = 'error_book_image.png';
                                  link.click();
                                }
                              }}
                              className="p-1 text-white/80 hover:text-emerald-400 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Question Text */}
                      <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed line-clamp-4">
                        {entry.questionText}
                      </p>

                      {/* MCQ Options Display */}
                      {entry.hasOptions && entry.options && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          {(['a', 'b', 'c', 'd'] as const).map(optKey => {
                            const val = entry.options?.[optKey];
                            if (!val) return null;
                            const isCorrect = entry.selectedOption === optKey.toUpperCase();
                            return (
                              <div
                                key={optKey}
                                className={`px-2.5 py-1.5 rounded-xl border text-[11px] flex items-center gap-2 truncate ${
                                  isCorrect
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                                    : 'bg-black/30 border-white/10 text-white/70'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${isCorrect ? 'bg-emerald-500 text-black font-extrabold' : 'bg-white/10 text-white'}`}>
                                  {optKey.toUpperCase()}
                                </span>
                                <span className="truncate">{val}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Audio Voice Player Note */}
                      {entry.audioUrl && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <audio
                            src={entry.audioUrl}
                            controls
                            className="w-full h-7 text-xs rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}

                      {entry.mySlip && (
                        <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200 leading-snug">
                          <span className="font-bold text-rose-400 text-[10px] block uppercase">MY MISTAKE / SLIP:</span>
                          {entry.mySlip}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* BACK SIDE: Solution & Explanation */
                    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
                        <span className="font-bold text-emerald-400 text-[10px] block uppercase">Correct Answer:</span>
                        <div className="font-mono font-bold text-white mt-0.5">{entry.correctAnswer}</div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white/90 leading-relaxed">
                        <span className="font-bold text-[var(--color-primary)] text-[10px] block uppercase">Explanation:</span>
                        {entry.explanation}
                      </div>

                      {entry.audioUrl && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase block">Recorded Voice Note Solution:</span>
                          <audio
                            src={entry.audioUrl}
                            controls
                            className="w-full h-7 text-xs rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
                  <span>{entry.sourceName || 'Error Book Entry'}</span>
                  <span className="text-[var(--color-primary)] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {isFlipped ? 'Show Question ↺' : 'Flip for Solution ↻'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3-STEP GUIDED ERROR ADDITION MODAL WIZARD */}
      {isAddModalOpen && (
        <div className="fixed inset-0 top-16 z-[99999] flex items-start justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0b0e1b] border border-white/20 rounded-3xl p-5 sm:p-8 max-w-xl w-full my-4 mb-20 space-y-5 shadow-2xl relative overflow-hidden">
            
            <button
              onClick={handleCloseModal}
              className="absolute right-5 top-5 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                <span>Add Question to Error Book</span>
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Guided 3-Step Wizard: Record audio notes, choose question format & map to syllabus.
              </p>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-black/40 border border-white/10 rounded-2xl relative z-10">
              <div className={`py-2 text-center rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                step === 1 ? 'bg-[var(--color-primary)] text-black shadow' : step > 1 ? 'text-emerald-400' : 'text-white/40'
              }`}>
                <span>1. Format & Media</span>
              </div>
              <div className={`py-2 text-center rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                step === 2 ? 'bg-[var(--color-primary)] text-black shadow' : step > 2 ? 'text-emerald-400' : 'text-white/40'
              }`}>
                <span>2. Syllabus & Options</span>
              </div>
              <div className={`py-2 text-center rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                step === 3 ? 'bg-[var(--color-primary)] text-black shadow' : 'text-white/40'
              }`}>
                <span>3. Slip & Solution</span>
              </div>
            </div>

            {/* STEP 1: QUESTION FORMAT & AUDIO/PHOTO NOTES */}
            {step === 1 && (
              <div className="space-y-5 relative z-10 animate-in fade-in duration-200">
                {/* Format Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/80 block">Select Question Format *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setQuestionFormat('mcq')}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        questionFormat === 'mcq'
                          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <ListOrdered className={`w-5 h-5 shrink-0 mt-0.5 ${questionFormat === 'mcq' ? 'text-emerald-400' : 'text-white/40'}`} />
                      <div>
                        <div className="text-xs font-black">With Options (MCQ)</div>
                        <div className="text-[10px] text-white/50">Question statement + Options A, B, C, D</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuestionFormat('subjective')}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        questionFormat === 'subjective'
                          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${questionFormat === 'subjective' ? 'text-emerald-400' : 'text-white/40'}`} />
                      <div>
                        <div className="text-xs font-black">Without Options</div>
                        <div className="text-[10px] text-white/50">Subjective or direct numerical answer</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Audio Recording Section */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/90 flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-emerald-400" />
                      <span>Record Voice Note Explanation (Optional)</span>
                    </span>
                    {audioBlobUrl && (
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        Audio Recorded
                      </span>
                    )}
                  </div>

                  {!audioBlobUrl ? (
                    <div className="flex items-center gap-3">
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="flex-1 py-3 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Mic className="w-4 h-4 text-emerald-400" />
                          <span>Start Voice Recording</span>
                        </button>
                      ) : (
                        <div className="flex-1 flex items-center gap-3 p-2 rounded-xl bg-rose-950/40 border border-rose-500/40">
                          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping ml-2" />
                          <span className="text-xs font-mono font-bold text-rose-200">
                            Recording: {formatTimer(recordingSeconds)}
                          </span>
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="ml-auto px-3 py-1.5 rounded-lg bg-rose-500 text-black font-bold text-xs flex items-center gap-1 hover:bg-rose-400"
                          >
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>Stop</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                      <audio controls src={audioBlobUrl} className="w-full h-8" />
                      <button
                        type="button"
                        onClick={deleteRecording}
                        className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete recording"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload Question Photo (Optional) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/80 block">Attach Photo / Screenshot (Optional)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  {uploadedImage ? (
                    <div className="relative rounded-2xl overflow-hidden border border-white/20 max-h-44 bg-black flex items-center justify-center">
                      <img src={uploadedImage} alt="Uploaded" className="max-h-44 object-contain" />
                      <button
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-5 rounded-2xl border-2 border-dashed border-white/20 hover:border-emerald-400/50 bg-black/30 hover:bg-black/50 text-white/60 hover:text-white transition-all flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="w-6 h-6 text-emerald-400" />
                      <span className="text-xs font-bold">Click to Upload Question Image or Diagram</span>
                      <span className="text-[10px] text-white/40">PNG, JPG, or WEBP supported</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-black text-xs shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span>Step 2: Syllabus & Question Details →</span>
                </button>
              </div>
            )}

            {/* STEP 2: SYLLABUS MAPPING & QUESTION DETAILS */}
            {step === 2 && (
              <div className="space-y-4 relative z-10 animate-in fade-in duration-200">
                {/* Cascading Syllabus Selection */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                    Syllabus Subject & Chapter ({selectedExam.toUpperCase()})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-white/70 block mb-1">Subject *</label>
                      <select
                        value={formSubjectId}
                        onChange={(e) => {
                          const newSubjId = e.target.value;
                          setFormSubjectId(newSubjId);
                          const subj = validSubjects.find(s => s.id === newSubjId);
                          if (subj?.chapters && subj.chapters.length > 0) {
                            setFormChapterId(subj.chapters[0].id);
                            setFormTopicTitle(subj.chapters[0].topics?.[0]?.title || '');
                          }
                        }}
                        className="w-full px-3 py-2 bg-[#121629] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                      >
                        {validSubjects.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name.replace(/\s*\(Theory:.*?\)/gi, '').trim()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-white/70 block mb-1">Chapter *</label>
                      <select
                        value={formChapterId}
                        onChange={(e) => {
                          const chId = e.target.value;
                          setFormChapterId(chId);
                          const ch = formChapters.find(c => c.id === chId);
                          if (ch?.topics && ch.topics.length > 0) {
                            setFormTopicTitle(ch.topics[0].title);
                          } else {
                            setFormTopicTitle('');
                          }
                        }}
                        className="w-full px-3 py-2 bg-[#121629] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                      >
                        {formChapters.map(ch => (
                          <option key={ch.id} value={ch.id}>
                            {ch.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Topic in Chapter *</label>
                    <select
                      value={formTopicTitle}
                      onChange={(e) => setFormTopicTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121629] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      {formTopics.map((topic, i) => (
                        <option key={i} value={topic.title}>
                          {topic.title}
                        </option>
                      ))}
                      <option value="__custom">+ Custom Topic / Specific Sub-Concept</option>
                    </select>
                  </div>

                  {formTopicTitle === '__custom' && (
                    <div>
                      <label className="text-xs font-semibold text-emerald-400 block mb-1">Enter Custom Topic Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Projectile Motion on Inclined Plane"
                        value={formCustomTopic}
                        onChange={(e) => setFormCustomTopic(e.target.value)}
                        className="w-full px-3 py-2 bg-[#121629] border border-emerald-500/40 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Question Statement Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80 block">Question Statement *</label>
                  <textarea
                    rows={3}
                    value={formQuestionText}
                    onChange={(e) => setFormQuestionText(e.target.value)}
                    placeholder="Type or paste full question statement..."
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-2xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 resize-none leading-relaxed"
                  />
                </div>

                {/* MCQ OPTIONS OR DIRECT ANSWER */}
                {questionFormat === 'mcq' ? (
                  <div className="space-y-3 p-4 rounded-2xl bg-black/30 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/90">Options A, B, C, D & Correct Option</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Select radio for correct answer</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { key: 'A', state: optionA, setter: setOptionA },
                        { key: 'B', state: optionB, setter: setOptionB },
                        { key: 'C', state: optionC, setter: setOptionC },
                        { key: 'D', state: optionD, setter: setOptionD },
                      ].map(({ key, state, setter }) => (
                        <div key={key} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCorrectOption(key as any)}
                            className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-all ${
                              correctOption === key
                                ? 'bg-emerald-500 text-black shadow-md'
                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                            }`}
                          >
                            {key}
                          </button>
                          <input
                            type="text"
                            value={state}
                            onChange={(e) => setter(e.target.value)}
                            placeholder={`Option ${key} text...`}
                            className={`flex-1 px-3 py-2 rounded-xl border text-xs text-white focus:outline-none ${
                              correctOption === key
                                ? 'bg-emerald-950/20 border-emerald-500/50'
                                : 'bg-black/40 border-white/15'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-400 block">Direct Correct Answer / Solution Value *</label>
                    <input
                      type="text"
                      value={formCorrectAnswer}
                      onChange={(e) => setFormCorrectAnswer(e.target.value)}
                      placeholder="e.g. 45 m/s or R = (v cos theta)^2 / g"
                      className="w-full px-3.5 py-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-white placeholder-emerald-200/30 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:text-white text-xs font-semibold"
                  >
                    ← Step 1
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-black text-xs shadow-lg hover:opacity-90 transition-all"
                  >
                    Step 3: Slip Analysis & Save →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SLIP ANALYSIS & FINAL SAVE */}
            {step === 3 && (
              <form onSubmit={handleSaveMistake} className="space-y-4 relative z-10 animate-in fade-in duration-200">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-rose-400 block mb-1">Where I Went Wrong (My Slip) *</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Calculation error, misread options, or formula mix-up..."
                      value={formMySlip}
                      onChange={(e) => setFormMySlip(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-xs text-white placeholder-rose-200/30 focus:outline-none focus:border-rose-400 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-emerald-300 block mb-1">Explanation / Key Concept Solution</label>
                    <textarea
                      rows={3}
                      placeholder="Step by step solution breakdown or formula reference..."
                      value={formExplanation}
                      onChange={(e) => setFormExplanation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-2xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-emerald-400 block">Entry Preview Summary:</span>
                  <div className="flex items-center gap-3 text-[11px] text-white/70 flex-wrap">
                    <span>Type: <strong className="text-white">{questionFormat.toUpperCase()}</strong></span>
                    {audioBlobUrl && <span className="text-emerald-400">🎙️ Voice Note Attached</span>}
                    {uploadedImage && <span className="text-cyan-400">🖼️ Image Attached</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:text-white text-xs font-semibold"
                  >
                    ← Step 2
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    Save to Mistake Notebook ✓
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* LIGHTBOX FULL IMAGE MODAL */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = lightboxImage;
                  link.download = 'error_book_image.png';
                  link.click();
                }}
                className="flex items-center gap-1 text-xs font-bold text-white hover:text-emerald-400 transition-colors"
                title="Download Image"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <div className="w-px h-4 bg-white/20" />

              <button
                onClick={() => setLightboxImage(null)}
                className="p-1 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={lightboxImage}
              alt="Full view"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
};
