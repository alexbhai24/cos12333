import React, { useState, useMemo, useEffect } from 'react';
import { 
  class11BioChapters, 
  class12BioChapters, 
  ReadingChapter, 
  ReadingTopic,
  getBioChapterById 
} from '../data/biology/readingSyllabus';
import { 
  getReadingPassageForTopic, 
  ReadingPassage 
} from '../data/biology/readingPassagesData';
import { useReadingPracticeStorage } from '../hooks/useReadingPracticeStorage';
import { ReadingChapterCard } from '../components/reading/ReadingChapterCard';
import { ReadingTopicCard } from '../components/reading/ReadingTopicCard';
import { ReadingLevelSelector } from '../components/reading/ReadingLevelSelector';
import { ReadingReaderView } from '../components/reading/ReadingReaderView';
import { ReadingComprehensionView } from '../components/reading/ReadingComprehensionView';
import { ReadingResultView } from '../components/reading/ReadingResultView';
import { 
  Search, BookOpen, Flame, Zap, Award, Sparkles, 
  ArrowLeft, CheckCircle2, Filter, Layers, ChevronRight
} from 'lucide-react';

type PageViewMode = 'dashboard' | 'topics' | 'levels' | 'reader' | 'comprehension' | 'result';

export const BiologyReadingPage: React.FC = () => {
  // Navigation & Flow State
  const [viewMode, setViewMode] = useState<PageViewMode>('dashboard');
  const [selectedClass, setSelectedClass] = useState<11 | 12>(11);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-progress' | 'completed' | 'not-started'>('all');

  // Active Session Results State
  const [sessionReadingTime, setSessionReadingTime] = useState(0);
  const [sessionReadingWpm, setSessionReadingWpm] = useState(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionTotalQuestions, setSessionTotalQuestions] = useState(0);
  const [sessionAccuracy, setSessionAccuracy] = useState(0);
  const [sessionOverallScore, setSessionOverallScore] = useState(0);

  // Local Storage Hook
  const {
    globalStats,
    recommendation,
    getTopicProgress,
    getChapterProgress,
    saveSessionAttempt
  } = useReadingPracticeStorage();

  // Active Chapter & Topics
  const activeChapters = selectedClass === 11 ? class11BioChapters : class12BioChapters;

  const currentChapter: ReadingChapter | undefined = useMemo(() => {
    if (!selectedChapterId) return undefined;
    return getBioChapterById(selectedChapterId);
  }, [selectedChapterId]);

  const currentTopic: ReadingTopic | undefined = useMemo(() => {
    if (!currentChapter || !selectedTopicId) return undefined;
    return currentChapter.topics.find(t => t.id === selectedTopicId);
  }, [currentChapter, selectedTopicId]);

  // Current Passage
  const currentPassage: ReadingPassage | null = useMemo(() => {
    if (!currentChapter || !currentTopic) return null;
    return getReadingPassageForTopic(
      currentChapter.id,
      currentChapter.title,
      currentTopic.id,
      currentTopic.title,
      currentChapter.classNum,
      selectedLevel
    );
  }, [currentChapter, currentTopic, selectedLevel]);

  // Filtered Chapters for Dashboard
  const filteredChapters = useMemo(() => {
    let list = activeChapters;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(ch => {
        const matchChapter = ch.title.toLowerCase().includes(q);
        const matchTopic = ch.topics.some(t => t.title.toLowerCase().includes(q));
        return matchChapter || matchTopic;
      });
    }

    if (statusFilter !== 'all') {
      list = list.filter(ch => {
        const stats = getChapterProgress(ch.id, ch.topics.length);
        if (statusFilter === 'completed') return stats.completionPercentage === 100;
        if (statusFilter === 'in-progress') return stats.completionPercentage > 0 && stats.completionPercentage < 100;
        if (statusFilter === 'not-started') return stats.completionPercentage === 0;
        return true;
      });
    }

    return list;
  }, [activeChapters, searchQuery, statusFilter, getChapterProgress]);

  // Handlers for Transitions
  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSelectedTopicId(null);
    setViewMode('topics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setViewMode('levels');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLevel = (level: 1 | 2 | 3 | 4 | 5) => {
    setSelectedLevel(level);
    setViewMode('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishReading = (readingTimeSeconds: number, wpm: number) => {
    setSessionReadingTime(readingTimeSeconds);
    setSessionReadingWpm(wpm);
    setViewMode('comprehension');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitComprehension = (
    correctCount: number,
    totalCount: number,
    accuracyPercentage: number,
    overallScore: number
  ) => {
    setSessionCorrectCount(correctCount);
    setSessionTotalQuestions(totalCount);
    setSessionAccuracy(accuracyPercentage);
    setSessionOverallScore(overallScore);

    // Save record to local storage
    if (currentChapter && currentTopic && currentPassage) {
      saveSessionAttempt(
        currentChapter.id,
        currentTopic.id,
        currentChapter.classNum,
        selectedLevel,
        {
          timestamp: new Date().toISOString(),
          readingTimeSeconds: sessionReadingTime,
          wordCount: currentPassage.wordCount,
          wpm: sessionReadingWpm,
          totalQuestions: totalCount,
          correctQuestions: correctCount,
          accuracyPercentage,
          overallScore
        }
      );
    }

    setViewMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchRecommended = () => {
    setSelectedClass(recommendation.targetClass);
    setSelectedChapterId(recommendation.targetChapterId);
    setSelectedTopicId(recommendation.targetTopicId);
    setSelectedLevel(recommendation.targetLevel);
    setViewMode('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [viewMode]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      {/* ── VIEW 1: READER SCREEN ── */}
      {viewMode === 'reader' && currentPassage && (
        <ReadingReaderView
          passage={currentPassage}
          onFinishReading={handleFinishReading}
          onExit={() => setViewMode('levels')}
        />
      )}

      {/* ── VIEW 2: COMPREHENSION TEST ── */}
      {viewMode === 'comprehension' && currentPassage && (
        <ReadingComprehensionView
          passage={currentPassage}
          readingTimeSeconds={sessionReadingTime}
          readingWpm={sessionReadingWpm}
          onSubmitResults={handleSubmitComprehension}
        />
      )}

      {/* ── VIEW 3: RESULT SCREEN ── */}
      {viewMode === 'result' && currentPassage && (
        <ReadingResultView
          passage={currentPassage}
          readingTimeSeconds={sessionReadingTime}
          readingWpm={sessionReadingWpm}
          correctCount={sessionCorrectCount}
          totalCount={sessionTotalQuestions}
          accuracyPercentage={sessionAccuracy}
          overallScore={sessionOverallScore}
          onRetryLevel={() => setViewMode('reader')}
          onNextLevel={() => {
            if (selectedLevel < 5) {
              setSelectedLevel((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5);
              setViewMode('reader');
            } else {
              setViewMode('topics');
            }
          }}
          onBackToTopics={() => setViewMode('topics')}
        />
      )}

      {/* ── VIEW 4: LEVEL SELECTOR ── */}
      {viewMode === 'levels' && currentChapter && currentTopic && (
        <ReadingLevelSelector
          chapterTitle={currentChapter.title}
          topicTitle={currentTopic.title}
          classNum={currentChapter.classNum}
          progress={getTopicProgress(currentChapter.id, currentTopic.id)}
          onSelectLevel={handleSelectLevel}
          onBackToTopics={() => setViewMode('topics')}
        />
      )}

      {/* ── VIEW 5: TOPIC CARDS GRID ── */}
      {viewMode === 'topics' && currentChapter && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Back button & Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <button
                onClick={() => setViewMode('dashboard')}
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Chapters</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full uppercase bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                  Class {currentChapter.classNum} Biology
                </span>
                <span className="text-xs text-gray-400">
                  {currentChapter.topics.length} NCERT Topics
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {currentChapter.title}
              </h2>
            </div>

            {/* Chapter Metrics Badge */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-4 self-start sm:self-auto">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Weightage</p>
                <p className="text-sm font-black text-white">{currentChapter.officialWeightage}</p>
              </div>
              <div className="border-l border-white/10 pl-4">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Priority</p>
                <p className="text-sm font-black text-amber-400">{currentChapter.pyqPriority}</p>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentChapter.topics.map((topic, idx) => (
              <ReadingTopicCard
                key={topic.id}
                topic={topic}
                chapterTitle={currentChapter.title}
                index={idx}
                progress={getTopicProgress(currentChapter.id, topic.id)}
                onSelectTopic={handleSelectTopic}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── VIEW 6: MAIN DASHBOARD (CHAPTERS & STATS) ── */}
      {viewMode === 'dashboard' && (
        <>
          {/* Main Title & Hero Banner */}
          <div 
            className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #0d1226 0%, #080b16 100%)',
              borderColor: 'rgba(0, 240, 255, 0.15)',
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.06)'
            }}
          >
            {/* Glow backdrop */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 85% 50%, rgba(0,240,255,0.08) 0%, transparent 65%)' }}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400/80">
                    NEET Biology Comprehension Training System
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Biology Reading Practice
                </h1>
                <p className="text-sm sm:text-base text-gray-400 font-medium">
                  "Read Faster. Understand Better. Prepare Smarter."
                </p>
              </div>

              {/* Class Tabs: Class 11 vs Class 12 */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 self-start md:self-auto shrink-0">
                <button
                  onClick={() => setSelectedClass(11)}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    selectedClass === 11
                      ? 'bg-[var(--color-primary)] text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Class 11 Biology
                </button>
                <button
                  onClick={() => setSelectedClass(12)}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    selectedClass === 12
                      ? 'bg-[var(--color-primary)] text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Class 12 Biology
                </button>
              </div>
            </div>
          </div>

          {/* 5 KPI Dashboard Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* 1. Streak */}
            <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-white font-mono">{globalStats.streak} Days</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Current Streak</p>
              </div>
            </div>

            {/* 2. Words Read */}
            <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-white font-mono">
                  {globalStats.totalWordsRead.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Words Read</p>
              </div>
            </div>

            {/* 3. Best WPM */}
            <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-white font-mono">
                  {globalStats.bestWpm > 0 ? `${globalStats.bestWpm} WPM` : '—'}
                </p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Best Speed</p>
              </div>
            </div>

            {/* 4. Average Accuracy */}
            <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-white font-mono">
                  {globalStats.averageAccuracy > 0 ? `${globalStats.averageAccuracy}%` : '—'}
                </p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Avg Accuracy</p>
              </div>
            </div>

            {/* 5. Levels Completed */}
            <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-white font-mono">
                  {globalStats.totalLevelsCompleted}
                </p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Levels Mastered</p>
              </div>
            </div>
          </div>

          {/* Smart Recommendation Card */}
          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-purple-950/40 border border-cyan-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  {recommendation.badge}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {recommendation.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                {recommendation.text}
              </p>
            </div>

            <button
              onClick={handleLaunchRecommended}
              className="px-5 py-2.5 rounded-xl text-xs font-black text-black bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-md active:scale-95"
            >
              <span>Start Practice</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search chapter or topic by name…"
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-primary)] shadow-sm"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
              {(['all', 'in-progress', 'completed', 'not-started'] as const).map(s => {
                const label = s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s === 'completed' ? 'Completed' : 'Not Started';
                const isActive = statusFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chapter Cards Grid (Matching Flashcard Page Layout) */}
          {filteredChapters.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
              <BookOpen className="w-10 h-10 text-white/20 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No chapters match your search or filter criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                className="mt-3 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredChapters.map((ch, idx) => (
                <ReadingChapterCard
                  key={ch.id}
                  chapter={ch}
                  index={idx}
                  stats={getChapterProgress(ch.id, ch.topics.length)}
                  onSelectChapter={handleSelectChapter}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
