import React, { useState, useMemo, useEffect, useRef } from 'react';
import { syllabusNEET } from '../data/syllabusNEET';
import { syllabusJEE } from '../data/syllabusJEE';
import { SyllabusChapter, SyllabusSubject } from '../types/syllabus';
import { useApp } from '../context/AppContext';
import {
  Search,
  Flame,
  Atom,
  BookOpen,
  RotateCcw,
  Check,
  Plus,
  Sparkles,
  Camera,
  Mic,
  FileQuestion,
  Image as ImageIcon,
  Square,
  Volume2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Play,
  Pause,
  ArrowRight,
  UploadCloud,
  ChevronDown
} from 'lucide-react';

type ExamType = 'neet' | 'jee';
type AddMode = 'auto' | 'photo' | 'voice';

export interface MistakeEntry {
  id: string;
  exam: ExamType;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterTitle: string;
  topicTitle: string;
  sourceType: 'in_app' | 'photo' | 'voice';
  sourceName?: string; // e.g. "NEET 2024 PYQ", "Allen Mock 3", "Camera Snap"
  questionText: string;
  correctAnswer: string;
  explanation: string;
  mySlip: string;
  imageUrl?: string;
  audioUrl?: string;
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
    sourceType: 'in_app',
    sourceName: 'PYQ Drill 2024',
    questionText: 'A projectile is thrown with velocity v at an angle theta. What is the radius of curvature of the trajectory at the highest point?',
    mySlip: 'I forgot that at the highest point velocity is purely horizontal (v cos theta) and acceleration is purely vertical (g).',
    correctAnswer: 'R = (v cos theta)^2 / g',
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
    mySlip: 'I misread "incorrect" and picked option A because methanogens produce biogas, but option C was false regarding cell wall peptidoglycan.',
    correctAnswer: 'Option C: Archaebacteria lack true peptidoglycan (they have pseudomurein).',
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
    sourceType: 'voice',
    sourceName: 'Daily Practice Problem (DPP)',
    questionText: 'Let R be a relation on integers where aRb if and only if a - b is divisible by 5. Check if R is an equivalence relation.',
    mySlip: 'Recorded voice note explaining why I forgot to verify transitivity for negative differences.',
    correctAnswer: 'R is Reflexive, Symmetric, and Transitive (Equivalence Relation).',
    explanation: 'Since a - a = 0 (divisible by 5), if 5 | (a - b) then 5 | (b - a). If 5 | (a - b) and 5 | (b - c), then 5 | (a - c). Hence all three hold.',
    isMastered: false,
    date: '2026-09-11'
  }
];

export const MistakeTrackerPage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  // Exam selector: Exclusively NEET & JEE Main (identical to Flashcards page)
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

  // Add Mistake Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<AddMode>('auto');

  // Form Fields
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formChapterId, setFormChapterId] = useState('');
  const [formTopicTitle, setFormTopicTitle] = useState('');
  const [formCustomTopic, setFormCustomTopic] = useState('');
  const [formSourceName, setFormSourceName] = useState('PYQ Practice');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formMySlip, setFormMySlip] = useState('');
  const [formCorrectAnswer, setFormCorrectAnswer] = useState('');
  const [formExplanation, setFormExplanation] = useState('');
  const [formImageBase64, setFormImageBase64] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Flipped card tracker for active cards
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
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

  // Selected subject's chapters in form
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
    if (window.confirm('Delete this mistake card?')) {
      setMistakes(prev => prev.filter(m => m.id !== id));
    }
  };

  // Handle Photo / Image Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setRecordedAudioUrl(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access could not be initialized. You can type your note or upload photo!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Save new mistake
  const handleSaveMistake = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formQuestionText && !formImageBase64 && !recordedAudioUrl) {
      alert('Please provide question text, upload a photo, or record a voice note.');
      return;
    }

    const currentSubj = validSubjects.find(s => s.id === formSubjectId) || validSubjects[0];
    const currentCh = (currentSubj?.chapters || []).find(c => c.id === formChapterId) || currentSubj?.chapters[0];

    const finalTopic = formTopicTitle === '__custom' ? formCustomTopic : formTopicTitle;

    const newEntry: MistakeEntry = {
      id: 'm_' + Date.now(),
      exam: selectedExam,
      subjectId: currentSubj?.id || 'physics',
      subjectName: currentSubj?.name.replace(/\s*\(Theory:.*?\)/gi, '').trim() || 'Physics',
      chapterId: currentCh?.id || 'ch1',
      chapterTitle: currentCh?.title || 'Chapter',
      topicTitle: finalTopic || 'General Topic',
      sourceType: addMode === 'photo' ? 'photo' : addMode === 'voice' ? 'voice' : 'in_app',
      sourceName: formSourceName || (addMode === 'photo' ? 'Photo Upload' : addMode === 'voice' ? 'Voice Note' : 'In-App Drill'),
      questionText: formQuestionText || (formImageBase64 ? 'Question captured via photo' : 'Question described in voice note'),
      mySlip: formMySlip,
      correctAnswer: formCorrectAnswer || 'Refer to explanation',
      explanation: formExplanation || 'Reviewed concept',
      imageUrl: formImageBase64 || undefined,
      audioUrl: recordedAudioUrl || undefined,
      isMastered: false,
      date: new Date().toISOString().split('T')[0]
    };

    setMistakes(prev => [newEntry, ...prev]);

    // Reset Form
    setIsAddModalOpen(false);
    setFormQuestionText('');
    setFormMySlip('');
    setFormCorrectAnswer('');
    setFormExplanation('');
    setFormImageBase64(null);
    setRecordedAudioUrl(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Top Control Bar: Search + Exam Selector (Exclusively NEET & JEE Main, exactly like FlashcardsPage) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        {/* Global Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mistakes by chapter, topic, question, or formula..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--text-primary)] placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-primary)] shadow-sm transition-all"
          />
        </div>

        {/* Right Actions: Exam Toggle + Add Mistake Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Exam Mode Toggle: Exclusively NEET & JEE Main */}
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

          {/* Quick Add Mistake Button */}
          <button
            onClick={() => {
              setAddMode('auto');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] hover:opacity-90 text-black font-black text-sm shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Mistake</span>
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

      {/* Sticky Progress Bar (Identical to Flashcard & Syllabus Tracker design) */}
      {activeSubject && (
        <div className="sticky top-[72px] z-20 mb-5 pt-2">
          <div className="relative overflow-hidden bg-[var(--bg-surface-solid)]/70 border border-white/10 backdrop-blur-xl rounded-2xl px-4 sm:px-6 py-4 shadow-xl">
            {/* Background glowing ambient light */}
            <div
              className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500 rounded-full blur-[70px] pointer-events-none transition-opacity duration-1000"
              style={{ opacity: percentage > 0 ? 0.25 : 0.05 }}
            />

            {/* Header info row */}
            <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                    {masteredInSubject} of {totalInSubject} mistakes mastered in {cleanSubjectName}
                  </h3>
                  {percentage === 100 && totalInSubject > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                      ALL RESOLVED
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs text-gray-400">
                  Target: Convert negative marks into rank by mastering every test slip.
                </span>
              </div>

              {/* Add Mistake Shortcut */}
              <button
                onClick={() => {
                  setAddMode('auto');
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-black bg-[var(--color-primary)] hover:opacity-90 shadow-md transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Log Slip</span>
              </button>
            </div>

            {/* Main Progress Row */}
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              {/* Stepped Capsule Bar */}
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

              {/* Percentage Indicator */}
              <div className="shrink-0 text-xs sm:text-sm font-black text-emerald-400">
                {percentage}% Mastered
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3 Easy Ways Banner Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Way 1: In-App Auto-Log */}
        <div
          onClick={() => {
            setAddMode('auto');
            setIsAddModalOpen(true);
          }}
          className="p-4 rounded-2xl bg-[var(--bg-surface-solid)]/40 border border-white/10 hover:border-[var(--color-cyan)]/50 cursor-pointer transition-all hover:scale-[1.01] flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[var(--color-cyan)] transition-colors">
              1. In-App Questions & PYQ
            </h4>
            <p className="text-[11px] text-white/50 truncate">
              Auto-logged from mock tests, DPPs, and practice
            </p>
          </div>
        </div>

        {/* Way 2: Photo / Camera */}
        <div
          onClick={() => {
            setAddMode('photo');
            setIsAddModalOpen(true);
          }}
          className="p-4 rounded-2xl bg-[var(--bg-surface-solid)]/40 border border-white/10 hover:border-emerald-400/50 cursor-pointer transition-all hover:scale-[1.01] flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              2. Photo Upload or Snap
            </h4>
            <p className="text-[11px] text-white/50 truncate">
              Snap textbook or test paper question with solution
            </p>
          </div>
        </div>

        {/* Way 3: Voice Note */}
        <div
          onClick={() => {
            setAddMode('voice');
            setIsAddModalOpen(true);
          }}
          className="p-4 rounded-2xl bg-[var(--bg-surface-solid)]/40 border border-white/10 hover:border-purple-400/50 cursor-pointer transition-all hover:scale-[1.01] flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
              3. Record Voice Note
            </h4>
            <p className="text-[11px] text-white/50 truncate">
              Speak what went wrong and how to solve next time
            </p>
          </div>
        </div>
      </div>

      {/* Mistake Cards Grid (Designed like Flashcard Deck Cards) */}
      {subjectMistakes.length === 0 ? (
        <div className="p-12 text-center bg-[var(--bg-surface-solid)]/30 border border-white/10 rounded-3xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
            <BookOpen className="w-7 h-7 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-lg font-bold text-white">No Mistakes Logged For This Subject</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Log errors from tests, snap a photo, or record a quick voice note to build your personal topper error notebook.
          </p>
          <button
            onClick={() => {
              setAddMode('auto');
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2 rounded-full bg-[var(--color-primary)] text-black text-xs font-bold shadow-lg"
          >
            + Add First Mistake
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {subjectMistakes.map(entry => {
            const isFlipped = !!flippedCards[entry.id];

            return (
              <div
                key={entry.id}
                onClick={() => toggleFlip(entry.id)}
                className={`relative min-h-[300px] p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group shadow-lg ${
                  entry.isMastered
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-[var(--bg-surface-solid)]/60 border-white/10 hover:border-[var(--color-cyan)]/50'
                }`}
              >
                {/* Top Badge Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/40 text-[var(--color-primary)]">
                        {entry.chapterTitle}
                      </span>
                      {entry.sourceType === 'photo' && (
                        <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400" title="Photo Attached">
                          <Camera className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {entry.sourceType === 'voice' && (
                        <span className="p-1 rounded-lg bg-purple-500/20 text-purple-400" title="Voice Note Recorded">
                          <Mic className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => toggleMastered(entry.id, e)}
                        className={`p-1.5 rounded-xl border transition-all ${
                          entry.isMastered
                            ? 'bg-emerald-500 text-black border-emerald-400'
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-emerald-400 hover:border-emerald-400/40'
                        }`}
                        title={entry.isMastered ? 'Mastered!' : 'Mark as Mastered'}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <button
                        onClick={(e) => handleDeleteMistake(entry.id, e)}
                        className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Topic Pill */}
                  <div className="text-[11px] font-semibold text-white/50 mb-2 truncate">
                    Topic: <span className="text-white/80">{entry.topicTitle}</span>
                  </div>

                  {/* FLIP CONTENT */}
                  {!isFlipped ? (
                    /* FRONT: Question & What went wrong */
                    <div className="space-y-3">
                      {/* Image Thumbnail if photo attached */}
                      {entry.imageUrl && (
                        <div className="w-full h-32 rounded-2xl overflow-hidden border border-white/10 bg-black/40 relative">
                          <img
                            src={entry.imageUrl}
                            alt="Question Photo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      {/* Question Text */}
                      <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed line-clamp-4">
                        {entry.questionText}
                      </p>

                      {/* Voice Note Player if recorded */}
                      {entry.audioUrl && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-2"
                        >
                          <Volume2 className="w-4 h-4 text-purple-400 shrink-0" />
                          <audio controls src={entry.audioUrl} className="w-full h-7" />
                        </div>
                      )}

                      {/* My Slip Note */}
                      {entry.mySlip && (
                        <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200 leading-snug">
                          <span className="font-bold text-rose-400 text-[10px] block uppercase">My Mistake / Slip:</span>
                          {entry.mySlip}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* BACK: Correct Answer & Explanation */
                    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
                        <span className="font-bold text-emerald-400 text-[10px] block uppercase">Correct Answer:</span>
                        <div className="font-mono font-bold text-white mt-0.5">{entry.correctAnswer}</div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white/90 leading-relaxed">
                        <span className="font-bold text-[var(--color-cyan)] text-[10px] block uppercase">Explanation & Takeaway:</span>
                        {entry.explanation}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
                  <span>{entry.sourceName || 'Self Practice'}</span>
                  <span className="text-[var(--color-primary)] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {isFlipped ? 'Show Question ↺' : 'Flip for Solution ↻'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: SIMPLE 3 WAYS TO ADD MISTAKE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[var(--bg-surface-solid)] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
                <span>Log Question Mistake</span>
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Select from syllabus chapters & topics, and record your slip using your preferred method.
              </p>
            </div>

            {/* 3 WAYS TABS */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-black/40 border border-white/10 rounded-2xl">
              <button
                type="button"
                onClick={() => setAddMode('auto')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  addMode === 'auto'
                    ? 'bg-[var(--color-primary)] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <FileQuestion className="w-4 h-4" />
                <span className="truncate">In-App / PYQ</span>
              </button>

              <button
                type="button"
                onClick={() => setAddMode('photo')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  addMode === 'photo'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span className="truncate">Photo Upload</span>
              </button>

              <button
                type="button"
                onClick={() => setAddMode('voice')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  addMode === 'voice'
                    ? 'bg-purple-500 text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span className="truncate">Voice Note</span>
              </button>
            </div>

            <form onSubmit={handleSaveMistake} className="space-y-4">
              {/* DYNAMIC SYLLABUS CASCADING DROPDOWNS: Subject -> Chapter -> Topic */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <span className="text-[10px] font-black uppercase text-[var(--color-primary)] tracking-wider block">
                  Syllabus Mapping ({selectedExam.toUpperCase()})
                </span>

                {/* Subject Selector */}
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
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      {validSubjects.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name.replace(/\s*\(Theory:.*?\)/gi, '').trim()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chapter Dropdown according to Syllabus */}
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Chapter according to Syllabus *</label>
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
                      className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      {formChapters.map(ch => (
                        <option key={ch.id} value={ch.id}>
                          {ch.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Topic Dropdown according to Syllabus Chapter */}
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Topic in Chapter *</label>
                  <select
                    value={formTopicTitle}
                    onChange={(e) => setFormTopicTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    {formTopics.map(t => (
                      <option key={t.id} value={t.title}>
                        {t.title}
                      </option>
                    ))}
                    <option value="__custom">+ Other / Custom Topic</option>
                  </select>

                  {formTopicTitle === '__custom' && (
                    <input
                      type="text"
                      placeholder="Enter custom topic name..."
                      value={formCustomTopic}
                      onChange={(e) => setFormCustomTopic(e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-[var(--bg-surface)] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  )}
                </div>
              </div>

              {/* MODE SPECIFIC INPUTS */}
              {/* 1. AUTO / IN-APP DRILL MODE */}
              {addMode === 'auto' && (
                <div className="space-y-3">
                  <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-xs text-cyan-200">
                    💡 <strong>In-App Integration:</strong> When you practice in PYQ Drill, Daily Test, or Test Series, any question you answer incorrectly can also be added here with 1-click!
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Source / Test Name</label>
                    <input
                      type="text"
                      placeholder="e.g. NEET 2024 PYQ, Allen Major 4, DPP #12"
                      value={formSourceName}
                      onChange={(e) => setFormSourceName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Question Statement / Text *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Type or paste the question text..."
                      value={formQuestionText}
                      onChange={(e) => setFormQuestionText(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
              )}

              {/* 2. PHOTO UPLOAD MODE */}
              {addMode === 'photo' && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-white/20 hover:border-emerald-400/50 rounded-2xl p-4 text-center cursor-pointer transition-colors relative bg-black/30">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {formImageBase64 ? (
                      <div className="space-y-2">
                        <img
                          src={formImageBase64}
                          alt="Question Preview"
                          className="max-h-40 mx-auto object-contain rounded-xl border border-white/10"
                        />
                        <span className="text-xs text-emerald-400 font-bold block">Photo uploaded! Click to change</span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-white/60">
                        <UploadCloud className="w-8 h-8 mx-auto text-emerald-400" />
                        <p className="text-xs font-bold text-white">Click or Snap Photo of Question / Solution</p>
                        <p className="text-[10px] text-white/40">Camera capture or gallery upload supported</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Optional Question Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Q17 on inclined plane friction"
                      value={formQuestionText}
                      onChange={(e) => setFormQuestionText(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
              )}

              {/* 3. VOICE NOTE RECORDING MODE */}
              {addMode === 'voice' && (
                <div className="space-y-3">
                  <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-center space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="px-5 py-2.5 rounded-full bg-purple-500 hover:bg-purple-400 text-black font-black text-xs flex items-center gap-2 shadow-lg transition-all"
                        >
                          <Mic className="w-4 h-4" />
                          <span>Start Recording Voice Note</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center gap-2 animate-pulse shadow-lg transition-all"
                        >
                          <Square className="w-4 h-4 fill-current" />
                          <span>Stop Recording ({recordingSeconds}s)</span>
                        </button>
                      )}
                    </div>

                    {recordedAudioUrl && (
                      <div className="mt-2 p-2 bg-black/40 rounded-xl flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-purple-400" />
                        <audio controls src={recordedAudioUrl} className="w-full h-8" />
                      </div>
                    )}
                    <p className="text-[11px] text-white/50">
                      Speak what confused you and the trick to remember.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Brief Question Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Carnots engine efficiency formula"
                      value={formQuestionText}
                      onChange={(e) => setFormQuestionText(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
              )}

              {/* COMMON FIELDS: What went wrong & Correct Answer / Explanation */}
              <div className="space-y-3 pt-1 border-t border-white/10">
                <div>
                  <label className="text-xs font-semibold text-rose-300 block mb-1">Where I Went Wrong (My Slip)</label>
                  <input
                    type="text"
                    placeholder="e.g. Forgot minus sign, or confused potential with field"
                    value={formMySlip}
                    onChange={(e) => setFormMySlip(e.target.value)}
                    className="w-full px-3 py-2 bg-rose-950/20 border border-rose-500/25 rounded-xl text-xs text-white placeholder-rose-200/30 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-emerald-300 block mb-1">Correct Answer</label>
                    <input
                      type="text"
                      placeholder="e.g. Option B / 45 m/s"
                      value={formCorrectAnswer}
                      onChange={(e) => setFormCorrectAnswer(e.target.value)}
                      className="w-full px-3 py-2 bg-emerald-950/20 border border-emerald-500/25 rounded-xl text-xs text-white placeholder-emerald-200/30 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--color-cyan)] block mb-1">Explanation / Solution</label>
                    <input
                      type="text"
                      placeholder="e.g. Key formula R = v^2 / g..."
                      value={formExplanation}
                      onChange={(e) => setFormExplanation(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-cyan)]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[var(--color-primary)] text-black font-black text-xs shadow-lg hover:opacity-90 transition-all"
                >
                  Save to Mistake Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
