import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SyllabusChapter } from '../../types/syllabus';
import { FlashcardItem, CardMasteryStatus } from '../../types/flashcard';
import { 
  ArrowLeft, RotateCw, ChevronLeft, ChevronRight, Check, AlertCircle, 
  Shuffle, LayoutGrid, Layers, Sparkles
} from 'lucide-react';
import { getChapterUnitTheme } from '../../utils/flashcardUnitTheme';

interface ChapterFlashcardDeckViewProps {
  chapter: SyllabusChapter;
  chapterIndex: number;
  subjectName: string;
  exam: 'NEET' | 'JEE';
  cards: FlashcardItem[];
  progressMap: Record<string, CardMasteryStatus>;
  onMarkMastered: (cardId: string) => void;
  onMarkReview: (cardId: string) => void;
  onResetChapter: (cardIds: string[]) => void;
  onBack: () => void;
  nextChapter?: SyllabusChapter | null;
  onNextChapter?: () => void;
  onGoHome?: () => void;
}

export const ChapterFlashcardDeckView: React.FC<ChapterFlashcardDeckViewProps> = ({
  chapter,
  chapterIndex,
  subjectName,
  exam,
  cards,
  progressMap,
  onMarkMastered,
  onMarkReview,
  onResetChapter,
  onBack,
  nextChapter,
  onNextChapter,
  onGoHome
}) => {
  const unitTheme = getChapterUnitTheme(chapter.title, subjectName, exam);
  const [deck, setDeck] = useState<FlashcardItem[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<'DECK' | 'GRID'>('DECK');
  const [forceDeckView, setForceDeckView] = useState(false);

  // DOM Refs for 120fps hardware-accelerated motion without React state re-rendering
  const motionCardRef = useRef<HTMLDivElement>(null);
  const greenGlowRef = useRef<HTMLDivElement>(null);
  const redGlowRef = useRef<HTMLDivElement>(null);
  const greenBadgeRef = useRef<HTMLDivElement>(null);
  const redBadgeRef = useRef<HTMLDivElement>(null);

  // Gesture Tracking Ref
  const gesture = useRef<{
    startX: number;
    startY: number;
    startTime: number;
    currentDx: number;
    isDragging: boolean;
    rafId: number | null;
  }>({
    startX: 0,
    startY: 0,
    startTime: 0,
    currentDx: 0,
    isDragging: false,
    rafId: null
  });

  // Keep deck in sync when cards change
  useEffect(() => {
    setDeck(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setForceDeckView(false);
    resetMotionDOM();
  }, [cards, chapter.id]);

  const activeCard = deck[currentIndex] || deck[0];

  const resetMotionDOM = () => {
    if (motionCardRef.current) {
      motionCardRef.current.style.transition = 'none';
      motionCardRef.current.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
      motionCardRef.current.style.opacity = '1';
    }
    if (greenGlowRef.current) greenGlowRef.current.style.opacity = '0';
    if (redGlowRef.current) redGlowRef.current.style.opacity = '0';
    if (greenBadgeRef.current) greenBadgeRef.current.style.opacity = '0';
    if (redBadgeRef.current) redBadgeRef.current.style.opacity = '0';
  };

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    resetMotionDOM();
    setCurrentIndex(prev => (prev + 1) % deck.length);
  }, [deck.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    resetMotionDOM();
    setCurrentIndex(prev => (prev - 1 + deck.length) % deck.length);
  }, [deck.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleShuffle = () => {
    setIsFlipped(false);
    resetMotionDOM();
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  // Direct GPU update via RequestAnimationFrame (zero re-render latency)
  const updateMotion = (dx: number) => {
    if (gesture.current.rafId) {
      cancelAnimationFrame(gesture.current.rafId);
    }
    gesture.current.rafId = requestAnimationFrame(() => {
      // 1. Move & tilt card
      if (motionCardRef.current) {
        const rot = dx * 0.035;
        motionCardRef.current.style.transform = `translate3d(${dx}px, 0px, 0px) rotate(${rot}deg)`;
      }

      // 2. Right Shift -> Vibrant Green Light Effect on Right Side
      if (dx > 0) {
        const intensity = Math.min(1, dx / 70);
        if (greenGlowRef.current) greenGlowRef.current.style.opacity = `${intensity}`;
        if (redGlowRef.current) redGlowRef.current.style.opacity = '0';

        if (greenBadgeRef.current) {
          const badgeOp = dx > 20 ? Math.min(1, (dx - 20) / 35) : 0;
          greenBadgeRef.current.style.opacity = `${badgeOp}`;
        }
        if (redBadgeRef.current) redBadgeRef.current.style.opacity = '0';
      } 
      // 3. Left Shift -> Vibrant Red Light Effect on Left Side
      else if (dx < 0) {
        const intensity = Math.min(1, -dx / 70);
        if (redGlowRef.current) redGlowRef.current.style.opacity = `${intensity}`;
        if (greenGlowRef.current) greenGlowRef.current.style.opacity = '0';

        if (redBadgeRef.current) {
          const badgeOp = -dx > 20 ? Math.min(1, (-dx - 20) / 35) : 0;
          redBadgeRef.current.style.opacity = `${badgeOp}`;
        }
        if (greenBadgeRef.current) greenBadgeRef.current.style.opacity = '0';
      } else {
        if (greenGlowRef.current) greenGlowRef.current.style.opacity = '0';
        if (redGlowRef.current) redGlowRef.current.style.opacity = '0';
        if (greenBadgeRef.current) greenBadgeRef.current.style.opacity = '0';
        if (redBadgeRef.current) redBadgeRef.current.style.opacity = '0';
      }
    });
  };

  // Touch Gesture Listeners
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    gesture.current.startX = touch.clientX;
    gesture.current.startY = touch.clientY;
    gesture.current.startTime = Date.now();
    gesture.current.currentDx = 0;
    gesture.current.isDragging = true;
    if (motionCardRef.current) {
      motionCardRef.current.style.transition = 'none';
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!gesture.current.isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - gesture.current.startX;
    const dy = touch.clientY - gesture.current.startY;
    // Allow normal vertical scroll if vertical gesture is dominant
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dx) < 15) {
      return;
    }
    gesture.current.currentDx = dx;
    updateMotion(dx);
  };

  const onTouchEnd = () => {
    if (!gesture.current.isDragging) return;
    const dx = gesture.current.currentDx;
    const elapsed = Date.now() - gesture.current.startTime;
    gesture.current.isDragging = false;

    finishGesture(dx, elapsed);
  };

  // Pointer / Mouse Drag Listeners
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    gesture.current.startX = e.clientX;
    gesture.current.startY = e.clientY;
    gesture.current.startTime = Date.now();
    gesture.current.currentDx = 0;
    gesture.current.isDragging = true;
    if (motionCardRef.current) {
      motionCardRef.current.style.transition = 'none';
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!gesture.current.isDragging) return;
    const dx = e.clientX - gesture.current.startX;
    gesture.current.currentDx = dx;
    updateMotion(dx);
  };

  const onPointerUp = () => {
    if (!gesture.current.isDragging) return;
    const dx = gesture.current.currentDx;
    const elapsed = Date.now() - gesture.current.startTime;
    gesture.current.isDragging = false;

    finishGesture(dx, elapsed);
  };

  const onPointerCancel = () => {
    if (!gesture.current.isDragging) return;
    gesture.current.isDragging = false;
    springBack();
  };

  const finishGesture = (dx: number, elapsed: number) => {
    // 1. Tap: small movement (< 10px) and fast (< 350ms)
    if (Math.abs(dx) < 10 && elapsed < 350) {
      springBack();
      handleFlip();
      return;
    }

    // 2. Swiped Right (Green Light Side): Mark as Mastered & advance to next card
    if (dx > 50 || (dx > 25 && elapsed < 220)) {
      if (activeCard) {
        onMarkMastered(activeCard.id);
      }
      animateCardOut('RIGHT', () => {
        handleNext();
      });
      return;
    }

    // 3. Swiped Left (Red Light Side): Mark as Need Revision & advance to next card
    if (dx < -50 || (dx < -25 && elapsed < 220)) {
      if (activeCard) {
        onMarkReview(activeCard.id);
      }
      animateCardOut('LEFT', () => {
        handleNext();
      });
      return;
    }

    // 4. Threshold not reached -> Spring back
    springBack();
  };

  const springBack = () => {
    if (motionCardRef.current) {
      motionCardRef.current.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      motionCardRef.current.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg)';
    }
    if (greenGlowRef.current) {
      greenGlowRef.current.style.transition = 'opacity 0.25s ease-out';
      greenGlowRef.current.style.opacity = '0';
    }
    if (redGlowRef.current) {
      redGlowRef.current.style.transition = 'opacity 0.25s ease-out';
      redGlowRef.current.style.opacity = '0';
    }
    if (greenBadgeRef.current) {
      greenBadgeRef.current.style.transition = 'opacity 0.2s ease-out';
      greenBadgeRef.current.style.opacity = '0';
    }
    if (redBadgeRef.current) {
      redBadgeRef.current.style.transition = 'opacity 0.2s ease-out';
      redBadgeRef.current.style.opacity = '0';
    }
  };

  const animateCardOut = (direction: 'LEFT' | 'RIGHT', onComplete: () => void) => {
    if (!motionCardRef.current) {
      onComplete();
      return;
    }
    const targetX = direction === 'RIGHT' ? '125%' : '-125%';
    const targetRot = direction === 'RIGHT' ? '14deg' : '-14deg';
    motionCardRef.current.style.transition = 'transform 0.2s ease-in, opacity 0.2s ease-in';
    motionCardRef.current.style.transform = `translate3d(${targetX}, 0px, 0px) rotate(${targetRot})`;
    motionCardRef.current.style.opacity = '0';

    setTimeout(() => {
      onComplete();
    }, 180);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'm' || e.key === 'M') {
        if (activeCard) {
          onMarkMastered(activeCard.id);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleFlip, handleNext, handlePrev, activeCard, onMarkMastered]);

  const totalCards = deck.length;
  const isCurrentCardMastered = activeCard ? progressMap[activeCard.id] === 'mastered' : false;
  const isCurrentCardReview = activeCard ? progressMap[activeCard.id] === 'review' : false;
  const isAllMastered = totalCards > 0 && deck.every(card => progressMap[card.id] === 'mastered');

  const card2 = currentIndex + 1 < totalCards ? deck[currentIndex + 1] : null;
  const card3 = currentIndex + 2 < totalCards ? deck[currentIndex + 2] : null;
  const hasMoreCards = currentIndex + 3 < totalCards;

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'FORMULA':
        return {
          bg: 'bg-emerald-500/15',
          text: 'text-emerald-300',
          border: 'border-emerald-500/30',
          label: 'FORMULA & IDENTITY'
        };
      case 'PYQ_TRAP':
        return {
          bg: 'bg-rose-500/15',
          text: 'text-rose-300',
          border: 'border-rose-500/30',
          label: 'NTA EXAM TRAP / HOT'
        };
      case 'DEFINITION':
        return {
          bg: 'bg-cyan-500/15',
          text: 'text-cyan-300',
          border: 'border-cyan-500/30',
          label: 'OFFICIAL DEFINITION'
        };
      case 'REACTION':
        return {
          bg: 'bg-amber-500/15',
          text: 'text-amber-300',
          border: 'border-amber-500/30',
          label: 'REACTION MECHANISM'
        };
      default:
        return {
          bg: 'bg-[#235347]/80',
          text: 'text-[#8EB69B]',
          border: 'border-[#8EB69B]/40',
          label: 'CORE CONCEPT'
        };
    }
  };

  return (
    <div className="space-y-3.5 max-w-4xl mx-auto animate-in fade-in duration-300 pb-16">
      {/* Action Row Directly Above Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[var(--color-primary)] pb-1">
        {/* Left: Back Button & Chapter Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--color-primary)] hover:text-white hover:border-[var(--border-color-hover)] transition-all active:scale-95 shadow-sm shrink-0 cursor-pointer"
            title="Back to Chapters"
            aria-label="Back to Chapters"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10.5px] font-black px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-black shrink-0">
              {exam}
            </span>
            <span 
              className="text-[10.5px] font-black px-2.5 py-0.5 rounded-full shrink-0 shadow-sm"
              style={{
                backgroundColor: unitTheme.primaryColor,
                color: unitTheme.contrastText
              }}
            >
              {unitTheme.unitName}
            </span>
            <span className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate">
              {chapter.title}
            </span>
          </div>
        </div>

        {/* Right: View All, Shuffle & Reset */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            onClick={() => setViewMode(viewMode === 'DECK' ? 'GRID' : 'DECK')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-color-hover)] transition-all shadow-sm"
          >
            {viewMode === 'DECK' ? (
              <>
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>View All ({totalCards})</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5" />
                <span>Play Deck</span>
              </>
            )}
          </button>

          {viewMode === 'DECK' && (
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] hover:border-[var(--color-primary)] text-[var(--text-secondary)] hover:text-white transition-all shadow-sm"
              title="Shuffle card order"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>
          )}

          <button
            onClick={() => onResetChapter(deck.map(c => c.id))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-solid)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)] hover:text-white hover:border-[var(--border-color-hover)] transition-all shadow-sm"
            title="Reset mastery status for this chapter"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {isAllMastered && !forceDeckView ? (
        /* 🏆 CHAPTER 100% MASTERED CELEBRATION VIEW */
        <div className="rounded-3xl border border-[var(--color-primary)]/60 bg-gradient-to-b from-[var(--bg-surface-secondary)] via-[var(--bg-surface-solid)] to-[var(--bg-app)] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 my-4">
          {/* Subtle Dot Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 1.2px, transparent 1.2px)',
              backgroundSize: '16px 16px'
            }}
          />

          {/* Celebratory Icon */}
          <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/20 border-2 border-[var(--color-primary)]/50 flex items-center justify-center shadow-lg animate-pulse relative z-10 text-[var(--color-primary)]">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="space-y-2 max-w-lg relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--color-primary)] text-black text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chapter 100% Mastered</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              {chapter.title}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Incredible work! You've mastered all {totalCards} high-yield flashcards for this chapter.
            </p>
          </div>

          {/* Action Buttons: Next Chapter & Chapters */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2 relative z-10">
            {nextChapter && onNextChapter && (
              <button
                onClick={onNextChapter}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[var(--color-primary)] text-black hover:bg-white transition-all font-black text-sm shadow-md active:scale-95"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            )}

            <button
              onClick={onBack}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl transition-all font-bold text-sm shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                !nextChapter 
                  ? 'bg-[var(--color-primary)] text-black hover:bg-white font-black flex-1' 
                  : 'bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--color-primary)]'
              }`}
            >
              <span>Chapters</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
            <button
              onClick={() => setForceDeckView(true)}
              className="text-xs font-bold text-[var(--color-primary)] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Review Deck (Keep Mastery)</span>
            </button>

            <span className="text-[var(--border-color)] hidden sm:inline">•</span>

            <button
              onClick={() => {
                onResetChapter(deck.map(c => c.id));
                setForceDeckView(false);
              }}
              className="text-xs font-bold text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reset & Practice Again</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'DECK' ? (
        /* ───────────────── INTERACTIVE FLASHCARD PLAYER ───────────────── */
        <div className="space-y-4">

          {/* Swipeable & Flippable 3D Flashcard Container: Cards Stacked One Over Another */}
          <div 
            className="relative w-full select-none cursor-pointer px-2 sm:px-4 pt-4 pb-3"
            style={{ perspective: '1200px' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* 📚 STACK LAYER 4: Base depth when 4 or more cards remain in deck */}
            {hasMoreCards && (
              <div
                className="absolute inset-x-2 sm:inset-x-4 top-4 bottom-3 -z-10 rounded-3xl border border-[var(--border-color)]/30 bg-[var(--bg-app)] shadow-sm pointer-events-none"
                style={{
                  transform: 'translate3d(6px, -6px, 0px)'
                }}
              />
            )}

            {/* 📁 STACK LAYER 3: 3rd card in deck stack */}
            {card3 && (
              <div
                className="absolute inset-x-2 sm:inset-x-4 top-4 bottom-3 z-0 rounded-3xl border border-[var(--border-color)]/40 bg-gradient-to-b from-[var(--bg-surface-secondary)] via-[var(--bg-surface-solid)] to-[var(--bg-app)] shadow-md pointer-events-none transition-transform duration-300 overflow-hidden"
                style={{
                  transform: 'translate3d(4px, -4px, 0px)'
                }}
              />
            )}

            {/* 📁 STACK LAYER 2: 2nd card directly under active card */}
            {card2 && (
              <div
                className="absolute inset-x-2 sm:inset-x-4 top-4 bottom-3 z-10 rounded-3xl border border-[var(--border-color)]/60 bg-gradient-to-b from-[var(--bg-surface-secondary)] via-[var(--bg-surface-solid)] to-[var(--bg-app)] shadow-lg pointer-events-none transition-transform duration-300 overflow-hidden"
                style={{
                  transform: 'translate3d(2px, -2px, 0px)'
                }}
              />
            )}

            {/* 📦 STACK LAYER 1: Active Front Card (Controlled directly via DOM ref & RAF) */}
            <div
              ref={motionCardRef}
              className="relative z-20 w-full"
              style={{
                transform: 'translate3d(0px, 0px, 0px) rotate(0deg)',
                willChange: 'transform',
                touchAction: 'pan-y'
              }}
            >
              {/* 🟢 RIGHT SHIFT: VIBRANT GREEN LIGHT EFFECT ON RIGHT SIDE */}
              <div 
                ref={greenGlowRef}
                className="pointer-events-none absolute inset-0 z-30 rounded-3xl opacity-0 border-r-4 border-emerald-400"
                style={{
                  background: 'linear-gradient(to left, rgba(16, 185, 129, 0.45), rgba(16, 185, 129, 0.15), transparent)',
                  boxShadow: 'inset -12px 0 25px rgba(16, 185, 129, 0.4), 8px 0 25px rgba(16, 185, 129, 0.35)',
                  transition: 'opacity 0.05s linear'
                }}
              />

              {/* Green Floating Action Badge */}
              <div
                ref={greenBadgeRef}
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 z-40 opacity-0 px-4 py-2 rounded-2xl bg-emerald-500 text-black font-black text-xs shadow-[0_0_25px_rgba(16,185,129,0.8)] flex items-center gap-1.5 border border-emerald-300"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>MASTERED</span>
              </div>

              {/* 🔴 LEFT SHIFT: VIBRANT RED LIGHT EFFECT ON LEFT SIDE */}
              <div 
                ref={redGlowRef}
                className="pointer-events-none absolute inset-0 z-30 rounded-3xl opacity-0 border-l-4 border-rose-500"
                style={{
                  background: 'linear-gradient(to right, rgba(244, 63, 94, 0.45), rgba(244, 63, 94, 0.15), transparent)',
                  boxShadow: 'inset 12px 0 25px rgba(244, 63, 94, 0.4), -8px 0 25px rgba(244, 63, 94, 0.35)',
                  transition: 'opacity 0.05s linear'
                }}
              />

              {/* Red Floating Action Badge */}
              <div
                ref={redBadgeRef}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 z-40 opacity-0 px-4 py-2 rounded-2xl bg-rose-500 text-white font-black text-xs shadow-[0_0_25px_rgba(244,63,94,0.8)] flex items-center gap-1.5 border border-rose-300"
              >
                <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                <span>NEED REVISION</span>
              </div>

              {/* 3D Flip Card Inner */}
              <div
                className={`relative w-full min-h-[380px] sm:min-h-[410px] md:min-h-[430px] rounded-3xl border shadow-xl ${
                  isCurrentCardMastered 
                    ? 'border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.15)]' 
                    : isCurrentCardReview
                    ? 'border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.15)]'
                    : 'border-[var(--border-color)]'
                }`}
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                  transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* ──────────────── FRONT OF CARD ──────────────── */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl px-6 sm:px-8 pt-6 sm:pt-7 pb-3 sm:pb-3.5 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[var(--bg-surface-secondary)] via-[var(--bg-surface-solid)] to-[var(--bg-app)]"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)'
                  }}
                >
                  {/* Subtle Dot Grid Background */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 1.2px, transparent 1.2px)',
                      backgroundSize: '16px 16px'
                    }}
                  />

                  {/* Top Row: Type Badge & Status Pill */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {(() => {
                        const style = getTypeStyle(activeCard.type);
                        return (
                          <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider border shrink-0 ${style.bg} ${style.text} ${style.border}`}>
                            {style.label}
                          </span>
                        );
                      })()}
                      {activeCard.pyqFrequency && (
                        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30 truncate">
                          {activeCard.pyqFrequency}
                        </span>
                      )}
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isCurrentCardMastered ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-black shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>MASTERED</span>
                        </span>
                      ) : isCurrentCardReview ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm">
                          <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>REVIEW</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-surface-solid)]/80 border border-[var(--border-color)] text-[var(--text-muted)]">
                          Unreviewed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Center: Question Prompt */}
                  <div className="relative z-10 my-auto py-6 text-center max-w-2xl mx-auto pointer-events-none px-4">
                    <h2 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[var(--text-primary)] leading-relaxed tracking-normal">
                      {activeCard.question}
                    </h2>
                  </div>

                  {/* Bottom Row: Previous Icon (Left), Card Counter (Center), Next Icon (Right) */}
                  <div className="relative z-20 flex items-center justify-between mt-auto pt-1 pb-0.5">
                    {/* Left: Previous Button Icon */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] hover:border-[var(--color-primary)] hover:bg-[var(--bg-surface-solid)] text-[var(--color-primary)] hover:text-white transition-all shadow-md active:scale-95 shrink-0 cursor-pointer group"
                      title="Previous Card (← ArrowLeft)"
                      aria-label="Previous Card"
                    >
                      <ChevronLeft className="w-5 h-5 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    {/* Center: Card Counter */}
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] shadow-sm pointer-events-none select-none">
                      <span>Card {currentIndex + 1} of {totalCards}</span>
                    </div>

                    {/* Right: Next Button Icon */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] hover:border-[var(--color-primary)] hover:bg-[var(--bg-surface-solid)] text-[var(--color-primary)] hover:text-white transition-all shadow-md active:scale-95 shrink-0 cursor-pointer group"
                      title="Next Card (→ ArrowRight)"
                      aria-label="Next Card"
                    >
                      <ChevronRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* ──────────────── BACK OF CARD ──────────────── */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl px-6 sm:px-8 pt-6 sm:pt-7 pb-3 sm:pb-3.5 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[var(--bg-surface-secondary)] via-[var(--bg-surface-solid)] to-[var(--bg-app)]"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {/* Top Row: Answer Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-[var(--border-color)]/50 pb-3">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-black tracking-wider border shadow-sm"
                      style={{
                        backgroundColor: unitTheme.badgeBg,
                        borderColor: unitTheme.borderColor,
                        color: unitTheme.primaryColor
                      }}
                    >
                      {unitTheme.unitName} • EXPLANATION & ANSWER
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="my-auto py-4 space-y-3.5 max-w-2xl mx-auto w-full pointer-events-none">
                    {/* Main Answer text */}
                    <p className="text-base sm:text-lg text-[var(--text-primary)] font-medium leading-relaxed">
                      {activeCard.answer}
                    </p>

                    {/* Formula Box (if applicable) */}
                    {activeCard.formula && (
                      <div 
                        className="p-3 sm:p-3.5 rounded-2xl bg-[var(--bg-surface-secondary)]/90 border font-mono text-sm sm:text-base font-bold tracking-wide shadow-sm overflow-x-auto custom-scrollbar"
                        style={{
                          borderColor: unitTheme.borderColor,
                          color: unitTheme.primaryColor
                        }}
                      >
                        {activeCard.formula}
                      </div>
                    )}

                    {/* Key Takeaway / Exam Tip */}
                    {activeCard.keyTakeaway && (
                      <div className="p-3 sm:p-3.5 rounded-2xl bg-[var(--bg-surface-solid)]/90 border border-[var(--border-color)] flex items-start gap-3 text-xs sm:text-sm text-[var(--color-primary)]">
                        <Sparkles className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black text-white mr-1.5">Exam Key Tip:</span>
                          <span>{activeCard.keyTakeaway}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Row: Previous Icon (Left), Card Counter (Center), Next Icon (Right) */}
                  <div className="relative z-20 flex items-center justify-between mt-auto pt-1 pb-0.5">
                    {/* Left: Previous Button Icon */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] hover:border-[var(--color-primary)] hover:bg-[var(--bg-surface-solid)] text-[var(--color-primary)] hover:text-white transition-all shadow-md active:scale-95 shrink-0 cursor-pointer group"
                      title="Previous Card (← ArrowLeft)"
                      aria-label="Previous Card"
                    >
                      <ChevronLeft className="w-5 h-5 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    {/* Center: Card Counter */}
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] shadow-sm pointer-events-none select-none">
                      <span>Card {currentIndex + 1} of {totalCards}</span>
                    </div>

                    {/* Right: Next Button Icon */}
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] hover:border-[var(--color-primary)] hover:bg-[var(--bg-surface-solid)] text-[var(--color-primary)] hover:text-white transition-all shadow-md active:scale-95 shrink-0 cursor-pointer group"
                      title="Next Card (→ ArrowRight)"
                      aria-label="Next Card"
                    >
                      <ChevronRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Action Controls & Mastery Toolbar (Centered) */}
          <div className="flex items-center justify-center pt-2">
            <div className="flex flex-wrap items-center gap-3 justify-center">
              {/* Review Button */}
              <button
                onClick={() => onMarkReview(activeCard.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-sm active:scale-95 cursor-pointer ${
                  isCurrentCardReview
                    ? 'bg-rose-500 text-white border-rose-500 shadow-rose-500/25'
                    : 'bg-[var(--bg-surface-secondary)] border-rose-500/30 text-rose-400 hover:border-rose-500/60 hover:bg-[var(--bg-surface-solid)]'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Review</span>
              </button>

              {/* Flip Button */}
              <button
                onClick={handleFlip}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[var(--bg-surface-solid)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--bg-surface-secondary)] font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Flip (Space)</span>
              </button>

              {/* Mastered Button */}
              <button
                onClick={() => onMarkMastered(activeCard.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all border shadow-sm active:scale-95 cursor-pointer ${
                  isCurrentCardMastered
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                    : 'bg-[var(--bg-surface-secondary)] border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60 hover:bg-[var(--bg-surface-solid)]'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Mastered</span>
              </button>
            </div>
          </div>

          {/* Stepped Mini Cards Indicator numbers row REMOVED as requested */}
        </div>
      ) : (
        /* ───────────────── ALL CARDS GRID VIEW ───────────────── */
        <div className="space-y-4">
          <div className="text-xs font-bold text-[var(--color-primary)] mb-2">
            Showing all {totalCards} flashcards for this chapter:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deck.map((card, idx) => {
              const isMastered = progressMap[card.id] === 'mastered';
              const isReview = progressMap[card.id] === 'review';
              const typeStyle = getTypeStyle(card.type);

              return (
                <div
                  key={card.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all bg-[var(--bg-surface)] ${
                    isMastered
                      ? 'border-[var(--color-primary)]'
                      : isReview
                      ? 'border-amber-500/50'
                      : 'border-[var(--border-color)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <div>
                    {/* Header: Card # & Type */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--color-primary)]">
                          #{idx + 1}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                          {typeStyle.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onMarkReview(card.id)}
                          title="Mark needs review"
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition-all ${
                            isReview ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-amber-300 bg-[var(--bg-surface-secondary)]'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMarkMastered(card.id)}
                          title="Mark mastered"
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition-all ${
                            isMastered ? 'bg-[var(--color-primary)] text-black' : 'text-gray-400 hover:text-[var(--color-primary)] bg-[var(--bg-surface-secondary)]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    </div>

                    {/* Question */}
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 leading-snug">
                      {card.question}
                    </h3>

                    {/* Answer */}
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
                      {card.answer}
                    </p>

                    {/* Formula if present */}
                    {card.formula && (
                      <div className="p-2.5 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--color-primary)]/30 text-[var(--color-cyan)] font-mono text-xs font-bold mb-2">
                        {card.formula}
                      </div>
                    )}
                  </div>

                  {/* Footer Tip */}
                  {card.keyTakeaway && (
                    <div className="pt-2 border-t border-[var(--border-color)] text-[11px] text-[var(--color-primary)]">
                      <span className="font-bold text-[var(--text-primary)] mr-1">Tip:</span>
                      {card.keyTakeaway}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
