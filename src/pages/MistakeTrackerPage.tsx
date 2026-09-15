import React, { useState, useMemo, useEffect, useRef } from 'react';
import { syllabusNEET } from '../data/syllabusNEET';
import { syllabusJEE } from '../data/syllabusJEE';
import { SyllabusSubject } from '../types/syllabus';
import { useApp } from '../context/AppContext';
import {
  detectDocumentCorners,
  warpAndEnhanceDocument,
  segmentPageLayout,
  DetectedBlock
} from '../utils/scannerVision';
import {
  Search,
  Flame,
  Atom,
  BookOpen,
  Check,
  Plus,
  Camera,
  Trash2,
  X,
  Download,
  Eye,
  ScanLine,
  Upload,
  Image as ImageIcon,
  PenTool,
  RotateCcw,
  RotateCw,
  ChevronLeft,
  Zap,
  MoreVertical,
  QrCode
} from 'lucide-react';

type ExamType = 'neet' | 'jee';
type AddMode = 'scan' | 'manual';

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
    sourceType: 'manual',
    sourceName: 'Daily Practice Problem (DPP)',
    questionText: 'Let R be a relation on integers where aRb if and only if a - b is divisible by 5. Check if R is an equivalence relation.',
    mySlip: 'Forgot to verify transitivity for negative differences.',
    correctAnswer: 'R is Reflexive, Symmetric, and Transitive (Equivalence Relation).',
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

  // Modal State (3 Steps: 1 = Real Camera Scanner, 2 = Crop Screen, 3 = Syllabus Details)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState<1 | 2 | 3>(1);
  const [addMode, setAddMode] = useState<AddMode>('scan');

  // Camera & Stream State
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);

  // Raw Captured / Uploaded Image vs Final Cropped Image
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropBox, setCropBox] = useState({ x: 0.05, y: 0.08, w: 0.9, h: 0.82 });
  const [rotation, setRotation] = useState(0);

  // Form Fields
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formChapterId, setFormChapterId] = useState('');
  const [formTopicTitle, setFormTopicTitle] = useState('');
  const [formCustomTopic, setFormCustomTopic] = useState('');
  const [formSourceName, setFormSourceName] = useState('Error Book Entry');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formMySlip, setFormMySlip] = useState('');
  const [formCorrectAnswer, setFormCorrectAnswer] = useState('');
  const [formExplanation, setFormExplanation] = useState('');

  // Lightbox View Full Image Modal
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Flipped card tracker for active cards
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // File Inputs Ref
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Helper to strictly stop all camera & mic hardware tracks
  const stopAllMediaTracks = () => {
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      activeStreamRef.current = null;
    }
  };

  // Live real-time document auto-detection state
  const [detectedBox, setDetectedBox] = useState<{
    isDetected: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
    confidence: number;
  }>({ isDetected: false, x: 0.05, y: 0.08, w: 0.9, h: 0.82, confidence: 0 });

  // Real-time camera detection loop (runs while in Step 1 & Scan mode)
  useEffect(() => {
    if (!isAddModalOpen || addStep !== 1 || addMode !== 'scan') return;

    let animFrameId: number;
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');

    const sampleFrame = () => {
      if (videoRef.current && videoRef.current.readyState === 4 && ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        const corners = detectDocumentCorners(canvas, 0.05);

        const w = (corners.bottomRight.x - corners.topLeft.x) / 320;
        const h = (corners.bottomRight.y - corners.topLeft.y) / 240;
        const x = corners.topLeft.x / 320;
        const y = corners.topLeft.y / 240;

        if (w > 0.25 && h > 0.25) {
          setDetectedBox({
            isDetected: true,
            x: Math.max(0.02, x),
            y: Math.max(0.02, y),
            w: Math.min(0.96, w),
            h: Math.min(0.96, h),
            confidence: 0.92
          });
        } else {
          setDetectedBox(prev => ({ ...prev, isDetected: false }));
        }
      }
      animFrameId = requestAnimationFrame(sampleFrame);
    };

    const timer = setTimeout(() => {
      sampleFrame();
    }, 400);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animFrameId);
    };
  }, [isAddModalOpen, addStep, addMode]);

  // Initialize camera stream when in Step 1 & Scan mode
  useEffect(() => {
    let isMounted = true;

    async function startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
        if (isMounted) {
          activeStreamRef.current = stream;
          setHasCamera(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        } else {
          stream.getTracks().forEach(t => t.stop());
        }
      } catch (err) {
        if (isMounted) setHasCamera(false);
      }
    }

    if (isAddModalOpen && addStep === 1 && addMode === 'scan') {
      startCamera();
    } else {
      stopAllMediaTracks();
    }

    return () => {
      isMounted = false;
      stopAllMediaTracks();
    };
  }, [isAddModalOpen, addStep, addMode]);

  // Lock body scroll when modal or lightbox is open
  useEffect(() => {
    if (!isAddModalOpen && !lightboxImage) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, [isAddModalOpen, lightboxImage]);

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

  // Capture video frame & stop media stream immediately
  const captureFrameToCrop = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setRawImage(dataUrl);

        stopAllMediaTracks(); // Turn off camera hardware immediately
        setAddStep(2); // Proceed to Interactive Crop Screen
      }
    }
  };

  // Gallery File Upload
  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImage(reader.result as string);
      stopAllMediaTracks();
      setAddStep(2);
    };
    reader.readAsDataURL(file);
  };

  // Apply Crop to Canvas & Proceed to Step 3
  const applyCropAndProceed = () => {
    if (!rawImage) {
      setAddStep(3);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setCroppedImage(rawImage);
        setAddStep(3);
        return;
      }

      const cropX = img.width * cropBox.x;
      const cropY = img.height * cropBox.y;
      const cropW = Math.max(img.width * cropBox.w, 50);
      const cropH = Math.max(img.height * cropBox.h, 50);

      canvas.width = cropW;
      canvas.height = cropH;

      ctx.drawImage(
        img,
        cropX, cropY, cropW, cropH,
        0, 0, cropW, cropH
      );

      const croppedUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCroppedImage(croppedUrl);
      setAddStep(3); // Proceed to Syllabus Details Step
    };
    img.onerror = () => {
      setCroppedImage(rawImage);
      setAddStep(3);
    };
    img.src = rawImage;
  };

  // Download image helper
  const handleDownloadImage = (url: string, filename = 'error_book_image.png') => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close modal & stop media streams cleanly
  const handleCloseModal = () => {
    stopAllMediaTracks();
    setIsAddModalOpen(false);
    setAddStep(1);
    setRawImage(null);
    setCroppedImage(null);
  };

  // Save new mistake entry to Error Book
  const handleSaveMistake = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImg = croppedImage || rawImage;

    if (!formQuestionText && !finalImg) {
      alert('Please scan/upload an image or type your question statement.');
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
      sourceType: finalImg ? 'photo' : 'manual',
      sourceName: formSourceName || (finalImg ? 'Scanner Crop' : 'Manual Question Entry'),
      questionText: formQuestionText || 'Scanned question',
      mySlip: formMySlip,
      correctAnswer: formCorrectAnswer || 'Refer to explanation',
      explanation: formExplanation || 'Reviewed concept',
      imageUrl: finalImg || undefined,
      isMastered: false,
      date: new Date().toISOString().split('T')[0]
    };

    setMistakes(prev => [newEntry, ...prev]);

    handleCloseModal();
    setFormQuestionText('');
    setFormMySlip('');
    setFormCorrectAnswer('');
    setFormExplanation('');
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
              setAddStep(1);
              setAddMode('scan');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-black font-black text-sm shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            <ScanLine className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Error Question</span>
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
                  setAddStep(1);
                  setAddMode('scan');
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-black bg-[var(--color-primary)] hover:opacity-90 shadow-md transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Add Error</span>
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
            Scan your test paper with Document Scanner or type your question statement manually to add it to Error Book.
          </p>
          <button
            onClick={() => {
              setAddStep(1);
              setAddMode('scan');
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2 rounded-full bg-[var(--color-primary)] text-black text-xs font-bold shadow-lg"
          >
            + Add First Error Question
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
                className={`relative min-h-[280px] p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group shadow-lg ${
                  entry.isMastered
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-[var(--bg-surface-solid)]/60 border-white/10 hover:border-[var(--color-cyan)]/50'
                }`}
              >
                {/* Top Badge & Action Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/40 text-[var(--color-primary)] truncate max-w-[150px]">
                        {entry.chapterTitle}
                      </span>
                      {entry.sourceType === 'photo' && (
                        <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400" title="Photo Attached">
                          <Camera className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {entry.sourceType === 'manual' && (
                        <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400" title="Manual Text Entry">
                          <PenTool className="w-3.5 h-3.5" />
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

                  <div className="text-[11px] font-semibold text-white/50 mb-2 truncate">
                    Topic: <span className="text-white/80">{entry.topicTitle}</span>
                  </div>

                  {/* FLIP CARD CONTENT */}
                  {!isFlipped ? (
                    /* FRONT SIDE: Image Preview (Natural Aspect Ratio) & Question Text */
                    <div className="space-y-3">
                      {/* Dynamically Sized Image Container (No Black Padding Gaps!) */}
                      {entry.imageUrl && (
                        <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-[#0e111d] max-h-56 flex items-center justify-center">
                          <img
                            src={entry.imageUrl}
                            alt="Question Photo"
                            className="w-full max-h-56 object-contain rounded-2xl"
                          />
                          {/* Top-Right Overlay Buttons: View Full & Download ONLY */}
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20 z-10 shadow-lg">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxImage(entry.imageUrl || null);
                              }}
                              className="p-1 text-white/80 hover:text-cyan-400 transition-colors"
                              title="See Full / View Image"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (entry.imageUrl) handleDownloadImage(entry.imageUrl);
                              }}
                              className="p-1 text-white/80 hover:text-emerald-400 transition-colors"
                              title="Download Image"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed line-clamp-5">
                        {entry.questionText}
                      </p>

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
                        <span className="font-bold text-[var(--color-cyan)] text-[10px] block uppercase">Explanation:</span>
                        {entry.explanation}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
                  <span>{entry.sourceName || 'Error Book Card'}</span>
                  <span className="text-[var(--color-primary)] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {isFlipped ? 'Show Question ↺' : 'Flip for Solution ↻'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ERROR LOGGING MODAL: DOCUMENT SCANNER vs MANUAL PARAGRAPH ENTRY */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0b0e1b] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-6 space-y-5 shadow-2xl relative overflow-hidden">
            
            <button
              onClick={handleCloseModal}
              className="absolute right-5 top-5 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <ScanLine className="w-6 h-6 text-cyan-400" />
                <span>Add Question to Error Book</span>
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Scan via camera scanner or type/paste your question statement manually.
              </p>
            </div>

            {/* STEP 1: MODE SELECTOR (PHOTO SCAN vs MANUAL QUESTION TEXT) */}
            {addStep === 1 && (
              <div className="space-y-5 relative z-10 animate-in fade-in duration-200">
                {/* 2 Clean Modes: Photo Scanner vs Manual Question Paragraph */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-black/50 border border-white/10 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setAddMode('scan')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      addMode === 'scan'
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Camera Scanner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddMode('manual')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      addMode === 'manual'
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Manual Question Entry</span>
                  </button>
                </div>

                {/* MODE 1: LIVE CAMERA SCANNER BOX (NO FAKE STATIC BOX!) */}
                {addMode === 'scan' && (
                  <div className="space-y-4">
                    <div className="relative w-full h-64 rounded-2xl bg-black border border-white/15 overflow-hidden flex items-center justify-center">
                      
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      {!hasCamera && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#18181b] text-white/60 space-y-2">
                          <Camera className="w-10 h-10 text-amber-400 animate-pulse" />
                          <p className="text-xs font-semibold text-white">Align question inside frame</p>
                          <p className="text-[11px] text-white/40">Real camera detector active</p>
                        </div>
                      )}

                      {/* Real-Time Auto-Detected Bounding Box & Quad Corners */}
                      {detectedBox.isDetected ? (
                        <div
                          className="absolute border-2 border-amber-400 bg-amber-400/15 rounded-xl pointer-events-none z-30 transition-all duration-200 shadow-[0_0_30px_rgba(251,191,36,0.6)]"
                          style={{
                            top: `${detectedBox.y * 100}%`,
                            left: `${detectedBox.x * 100}%`,
                            width: `${detectedBox.w * 100}%`,
                            height: `${detectedBox.h * 100}%`
                          }}
                        >
                          <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 border border-white shadow-lg animate-pulse" />
                          <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 border border-white shadow-lg animate-pulse" />
                          <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 border border-white shadow-lg animate-pulse" />
                          <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 border border-white shadow-lg animate-pulse" />
                          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-bounce top-1/2" />
                        </div>
                      ) : (
                        <div className="absolute inset-8 pointer-events-none z-20">
                          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-amber-400/60 rounded-tl-lg" />
                          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-amber-400/60 rounded-tr-lg" />
                          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-amber-400/60 rounded-br-lg" />
                          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-amber-400/60 rounded-bl-lg" />
                        </div>
                      )}
                    </div>

                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryFileChange}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={captureFrameToCrop}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-cyan-500/30 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Snap Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs hover:bg-purple-500/30 transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload from gallery</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* MODE 2: MANUAL QUESTION PARAGRAPH ENTRY */}
                {addMode === 'manual' && (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-white/80 block">
                      Type or Paste Question Statement / Paragraph *
                    </label>
                    <textarea
                      rows={5}
                      value={formQuestionText}
                      onChange={(e) => setFormQuestionText(e.target.value)}
                      placeholder="Type or paste full error question text, formula, or textbook paragraph here..."
                      className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-2xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 resize-none leading-relaxed"
                    />
                  </div>
                )}

                {/* Advance to Step 2 */}
                <button
                  type="button"
                  onClick={() => setAddStep(2)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span>Step 2: Syllabus & Solution Details →</span>
                </button>
              </div>
            )}

            {/* STEP 2: INTERACTIVE CROP SCREEN (IF PHOTO) */}
            {addStep === 2 && (
              <div className="space-y-4 relative z-10 animate-in fade-in duration-200">
                {rawImage ? (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-white/80 block">Adjust Crop Boundary & Orientation</span>
                    <div className="relative w-full max-h-60 rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/15 p-2">
                      <img src={rawImage} alt="Captured" className="max-h-56 object-contain rounded-xl" />
                      <div
                        className="absolute border-2 border-amber-400 rounded-xl pointer-events-none"
                        style={{
                          top: `${cropBox.y * 100}%`,
                          left: `${cropBox.x * 100}%`,
                          width: `${cropBox.w * 100}%`,
                          height: `${cropBox.h * 100}%`
                        }}
                      >
                        <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white" />
                        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white" />
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white" />
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setAddStep(1)}
                        className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
                      >
                        Retake
                      </button>

                      <button
                        type="button"
                        onClick={applyCropAndProceed}
                        className="px-6 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs shadow-lg"
                      >
                        Save Crop & Continue →
                      </button>
                    </div>
                  </div>
                ) : (
                  /* If manual mode, proceed directly to details */
                  <form onSubmit={handleSaveMistake} className="space-y-4">
                    {/* SYLLABUS CASCADING SELECTORS */}
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                      <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
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
                            className="w-full px-3 py-2 bg-[#121629] border border-white/15 rounded-xl text-xs text-white"
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
                            className="w-full px-3 py-2 bg-[#121629] border border-white/15 rounded-xl text-xs text-white"
                          >
                            {formChapters.map(ch => (
                              <option key={ch.id} value={ch.id}>
                                {ch.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Where I Went Wrong (My Slip)"
                        value={formMySlip}
                        onChange={(e) => setFormMySlip(e.target.value)}
                        className="w-full px-3 py-2 bg-rose-950/20 border border-rose-500/25 rounded-xl text-xs text-white placeholder-rose-200/30"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Correct Answer"
                          value={formCorrectAnswer}
                          onChange={(e) => setFormCorrectAnswer(e.target.value)}
                          className="w-full px-3 py-2 bg-emerald-950/20 border border-emerald-500/25 rounded-xl text-xs text-white placeholder-emerald-200/30"
                        />
                        <input
                          type="text"
                          placeholder="Explanation / Solution"
                          value={formExplanation}
                          onChange={(e) => setFormExplanation(e.target.value)}
                          className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-white/30"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setAddStep(1)}
                        className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:text-white text-xs font-semibold"
                      >
                        ← Step 1
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs shadow-lg"
                      >
                        Save to Error Book
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* STEP 3: FINAL SYLLABUS MAPPING & SAVE */}
            {addStep === 3 && (
              <form onSubmit={handleSaveMistake} className="space-y-4 relative z-10 animate-in fade-in duration-200">
                {/* SYLLABUS CASCADING SELECTORS */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
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
                        className="w-full px-3 py-2 bg-[#121629] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
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
                        className="w-full px-3 py-2 bg-[#121629] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        {formChapters.map(ch => (
                          <option key={ch.id} value={ch.id}>
                            {ch.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Question Statement / Description</label>
                    <textarea
                      rows={2}
                      placeholder="Type question or summary of what was asked..."
                      value={formQuestionText}
                      onChange={(e) => setFormQuestionText(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-rose-300 block mb-1">Where I Went Wrong (My Slip)</label>
                    <input
                      type="text"
                      placeholder="e.g. Calculation error, misread options, or formula mix-up"
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
                        placeholder="e.g. Option B"
                        value={formCorrectAnswer}
                        onChange={(e) => setFormCorrectAnswer(e.target.value)}
                        className="w-full px-3 py-2 bg-emerald-950/20 border border-emerald-500/25 rounded-xl text-xs text-white placeholder-emerald-200/30 focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-cyan-300 block mb-1">Explanation / Solution</label>
                      <input
                        type="text"
                        placeholder="e.g. Key formula or concept..."
                        value={formExplanation}
                        onChange={(e) => setFormExplanation(e.target.value)}
                        className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setAddStep(1)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:text-white text-xs font-semibold"
                  >
                    ← Step 1
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs shadow-lg hover:opacity-90 transition-all"
                  >
                    Save to Error Book
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
                onClick={() => handleDownloadImage(lightboxImage)}
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
