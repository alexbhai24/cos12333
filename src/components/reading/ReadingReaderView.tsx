import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ReadingPassage } from '../../data/biology/readingPassagesData';
import { 
  Play, Pause, RotateCcw, ArrowRight, ArrowLeft, ZoomIn, ZoomOut,
  Clock, Zap, FileText, CheckCircle2, AlertCircle, BookOpen, Volume2
} from 'lucide-react';

interface ReadingReaderViewProps {
  passage: ReadingPassage;
  onFinishReading: (readingTimeSeconds: number, wpm: number) => void;
  onExit: () => void;
}

export const ReadingReaderView: React.FC<ReadingReaderViewProps> = ({
  passage,
  onFinishReading,
  onExit
}) => {
  const [currentParaIndex, setCurrentParaIndex] = useState(0);
  const [fontSize, setFontSize] = useState<number>(18); // default comfortable 18px
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  const totalParas = passage.paragraphs.length;

  // Words counted so far
  const totalWords = useMemo(() => {
    return passage.paragraphs.join(' ').split(/\s+/).filter(Boolean).length;
  }, [passage]);

  const wordsReadUpToNow = useMemo(() => {
    const parasRead = passage.paragraphs.slice(0, currentParaIndex + 1);
    return parasRead.join(' ').split(/\s+/).filter(Boolean).length;
  }, [passage, currentParaIndex]);

  // High-precision reading timer (Interval based)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Live real-time WPM calculation (Safe against initial 0 seconds)
  const currentWpm = useMemo(() => {
    if (secondsElapsed < 3) return 0;
    const minutes = secondsElapsed / 60;
    return Math.round(wordsReadUpToNow / minutes);
  }, [secondsElapsed, wordsReadUpToNow]);

  // Format timer: MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextPara = () => {
    if (currentParaIndex < totalParas - 1) {
      setCurrentParaIndex(prev => prev + 1);
    } else {
      // Completed reading the final paragraph!
      handleComplete();
    }
  };

  const handlePrevPara = () => {
    if (currentParaIndex > 0) {
      setCurrentParaIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Stop reading timer immediately and pass exact readings
    const finalSeconds = Math.max(secondsElapsed, 5); // minimum 5s guard
    const finalWpm = Math.round(totalWords / (finalSeconds / 60));
    onFinishReading(finalSeconds, finalWpm);
  };

  const handleRestart = () => {
    if (window.confirm('Restart reading timer from the beginning?')) {
      setCurrentParaIndex(0);
      setSecondsElapsed(0);
      setIsPaused(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-300 pb-16">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
              Level {passage.level}: {passage.levelName}
            </span>
            <span className="text-xs text-gray-400">Class {passage.classNum} Biology</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {passage.chapterTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            {passage.topicTitle}
          </p>
        </div>

        <button
          onClick={onExit}
          className="self-start sm:self-auto text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
        >
          Exit Practice
        </button>
      </div>

      {/* Floating HUD: Timer, Speed, Word Count & Font Sizing */}
      <div className="sticky top-20 z-20 bg-[#0f1424]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* Left: Progress & Live Stats */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Timer Display */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Timer</span>
              <span className="text-base sm:text-lg font-black font-mono text-white tracking-wider">
                {formatTime(secondsElapsed)}
              </span>
            </div>
          </div>

          {/* Real-time WPM */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center text-cyan-300">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Speed</span>
              <span className="text-base sm:text-lg font-black font-mono text-cyan-300">
                {currentWpm > 0 ? `${currentWpm} WPM` : 'Measuring…'}
              </span>
            </div>
          </div>

          {/* Words */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Words</span>
              <span className="text-base font-black font-mono text-white">
                {wordsReadUpToNow} / {totalWords}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls (Pause/Resume, Font Size, Restart) */}
        <div className="flex items-center gap-2">
          {/* Font Controls */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setFontSize(prev => Math.max(prev - 2, 14))}
              className="px-2.5 py-1 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-[11px] font-mono text-gray-400 px-1.5">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(prev + 2, 26))}
              className="px-2.5 py-1 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPaused 
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md animate-bounce' 
                : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
            }`}
            title={isPaused ? 'Resume reading' : 'Pause reading'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Restart Button */}
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Restart Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pause Overlay if timer paused */}
      {isPaused && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <Pause className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Timer is paused. Take a breath and click <strong>Resume</strong> when ready to continue reading.</span>
          </div>
          <button
            onClick={() => setIsPaused(false)}
            className="px-4 py-1.5 rounded-xl bg-amber-400 text-black font-black text-xs hover:bg-amber-300 transition-colors shrink-0 cursor-pointer"
          >
            Resume
          </button>
        </div>
      )}

      {/* Main Reading Card */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-[#0d1222]/95 border border-white/15 shadow-2xl backdrop-blur-xl min-h-[340px] flex flex-col justify-between">
        {/* Paragraph Header Indicator */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
              PARAGRAPH {currentParaIndex + 1} OF {totalParas}
            </span>
            <span className="text-[11px] text-gray-500">•</span>
            <span className="text-[11px] text-gray-400">
              {passage.paragraphs[currentParaIndex].split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {passage.paragraphs.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentParaIndex(i)}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  i === currentParaIndex 
                    ? 'w-6 bg-cyan-400 shadow-sm' 
                    : i < currentParaIndex 
                    ? 'w-2 bg-emerald-400/70' 
                    : 'w-2 bg-white/20'
                }`}
                title={`Jump to paragraph ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Text Body */}
        <div className="flex-1 py-2 sm:py-4 flex items-center">
          <p 
            className="text-white/95 leading-relaxed font-sans select-text tracking-wide transition-all"
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: 1.75
            }}
          >
            {passage.paragraphs[currentParaIndex]}
          </p>
        </div>

        {/* NCERT Citation Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5 truncate">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Reference: <strong>{passage.ncertRef}</strong></span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {passage.keyConcepts.slice(0, 3).map((c, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-300">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action & Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrevPara}
          disabled={currentParaIndex === 0}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all border ${
            currentParaIndex > 0
              ? 'bg-white/5 border-white/15 text-white hover:bg-white/10 cursor-pointer active:scale-95'
              : 'bg-transparent border-transparent text-white/20 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Paragraph</span>
        </button>

        <div className="flex items-center gap-3">
          {currentParaIndex < totalParas - 1 ? (
            <button
              onClick={handleNextPara}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black text-black transition-all cursor-pointer shadow-lg active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #00f0ff, #0066ff)',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
              }}
            >
              <span>Next Paragraph</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl text-xs sm:text-sm font-black text-black transition-all cursor-pointer shadow-lg active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #00D7A0, #00f0ff)',
                boxShadow: '0 0 24px rgba(0, 215, 160, 0.45)'
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish Reading & Start Test →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
