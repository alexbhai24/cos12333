import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameShell } from '../../components/games/GameShell';
import type { GameState } from '../types';

interface MemoryDeckProps {
  onExit: () => void;
  onScoreSaved: (score: number) => void;
  bestScore: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG: Record<Difficulty, { cols: number; rows: number; label: string }> = {
  easy:   { cols: 4, rows: 4, label: '4×4 Easy' },
  medium: { cols: 5, rows: 4, label: '5×4 Medium' },
  hard:   { cols: 6, rows: 6, label: '6×6 Hard' },
};

interface BiologyItem {
  name: string;
  symbol: string;
  scientific: string;
  color: string;
}

const BIOLOGY_ITEMS: BiologyItem[] = [
  { name: 'Brain', symbol: '🧠', scientific: 'Cerebrum & Cortex', color: '#FF7BAC' },
  { name: 'Heart', symbol: '🫀', scientific: 'Cardiovascular Pump', color: '#FF6565' },
  { name: 'Lungs', symbol: '🫁', scientific: 'Pulmonary Alveoli', color: '#00F0FF' },
  { name: 'DNA Helix', symbol: '🧬', scientific: 'Genetic Genome', color: '#8B5CF6' },
  { name: 'Kidneys', symbol: '🫘', scientific: 'Renal Filtration', color: '#F59E0B' },
  { name: 'Bones', symbol: '🦴', scientific: 'Skeletal System', color: '#E2E8F0' },
  { name: 'Eye', symbol: '👁️', scientific: 'Ocular Retina', color: '#38BDF8' },
  { name: 'Ear', symbol: '👂', scientific: 'Auditory Cochlea', color: '#FDBA74' },
  { name: 'Tooth', symbol: '🦷', scientific: 'Dental Enamel', color: '#BAE6FD' },
  { name: 'Microscope', symbol: '🔬', scientific: 'Cytological Lab', color: '#34D399' },
  { name: 'Bacteria', symbol: '🦠', scientific: 'Microbiology Cell', color: '#4ADE80' },
  { name: 'Blood Cell', symbol: '🩸', scientific: 'Erythrocyte Hematology', color: '#EF4444' },
  { name: 'Skull', symbol: '💀', scientific: 'Cranial Bone Shield', color: '#F1F5F9' },
  { name: 'Muscle', symbol: '💪', scientific: 'Myofibril Fibers', color: '#F59E0B' },
  { name: 'Neuron Cell', symbol: '🕸️', scientific: 'Neural Synaptic Net', color: '#818CF8' },
  { name: 'Stomach', symbol: '🥣', scientific: 'Gastric Digestion', color: '#D97706' },
  { name: 'Liver Organ', symbol: '🥩', scientific: 'Hepatic Metabolic', color: '#B91C1C' },
  { name: 'Virus Cell', symbol: '🧫', scientific: 'Virological Pathogen', color: '#C084FC' },
];

interface Card {
  id: number;
  name: string;
  symbol: string;
  scientific: string;
  color: string;
  pairId: string;
  flipped: boolean;
  matched: boolean;
}

function generateDeck(cols: number, rows: number): Card[] {
  const total = cols * rows;
  const pairs = total / 2;
  const cards: Omit<Card, 'id' | 'flipped' | 'matched'>[] = [];

  for (let i = 0; i < pairs; i++) {
    const item = BIOLOGY_ITEMS[i % BIOLOGY_ITEMS.length];
    const pairId = `biology-${item.name}`;
    cards.push({ name: item.name, symbol: item.symbol, scientific: item.scientific, color: item.color, pairId });
    cards.push({ name: item.name, symbol: item.symbol, scientific: item.scientific, color: item.color, pairId });
  }

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards.map((c, idx) => ({ ...c, id: idx, flipped: false, matched: false }));
}

function calcScore(moves: number, seconds: number, difficulty: Difficulty): number {
  const base = { easy: 1000, medium: 2000, hard: 4000 }[difficulty];
  const movePenalty = moves * 5;
  const timePenalty = seconds * 2;
  return Math.max(50, base - movePenalty - timePenalty);
}

function calcStars(moves: number, difficulty: Difficulty): number {
  const par = { easy: 12, medium: 18, hard: 32 }[difficulty];
  if (moves <= par) return 3;
  if (moves <= par * 1.5) return 2;
  return 1;
}

const INSTRUCTIONS = [
  'Click or tap a card to flip it face-up.',
  'Find matching pairs of identical cards.',
  'If two flipped cards don\'t match, they flip back!',
  'Use Arrow keys to select and Space/Enter to flip.',
  'Complete with fewer moves and faster time for a high score!',
];

export const MemoryDeckGame: React.FC<MemoryDeckProps> = ({ onExit, onScoreSaved, bestScore }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<GameState>('how-to-play');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  const [winStars, setWinStars] = useState(0);
  const [isResolving, setIsResolving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const totalPairs = (cfg.cols * cfg.rows) / 2;

  const startGame = useCallback((diff: Difficulty = difficulty) => {
    const c = DIFFICULTY_CONFIG[diff];
    setCards(generateDeck(c.cols, c.rows));
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setScore(0);
    setSeconds(0);
    setStreak(0);
    setIsResolving(false);
    setSelectedIdx(0);
    setDifficulty(diff);
    setGameState('playing');
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState]);

  const flipCard = useCallback((cardId: number) => {
    if (isResolving) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;
    if (flippedIds.length === 2) return;

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [id1, id2] = newFlipped;
      const c1 = cards.find(c => c.id === id1)!;
      const c2 = cards.find(c => c.id === id2)!;

      if (c1.pairId === c2.pairId) {
        // Match!
        const newMatches = matches + 1;
        setMatches(newMatches);
        setStreak(s => s + 1);
        setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, matched: true } : c));
        setFlippedIds([]);

        if (newMatches === totalPairs) {
          // Win!
          if (timerRef.current) clearInterval(timerRef.current);
          const finalScore = calcScore(moves + 1, seconds, difficulty);
          const stars = calcStars(moves + 1, difficulty);
          setScore(finalScore);
          setWinStars(stars);
          onScoreSaved(finalScore);
          setTimeout(() => setGameState('game-over'), 400);
        }
      } else {
        // No match - flip back after delay
        setStreak(0);
        setIsResolving(true);
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, flipped: false } : c));
          setFlippedIds([]);
          setIsResolving(false);
        }, 850);
      }
    }
  }, [cards, flippedIds, isResolving, matches, totalPairs, moves, seconds, difficulty, onScoreSaved]);

  // Keyboard navigation
  useEffect(() => {
    if (gameState !== 'playing') return;
    const { cols } = DIFFICULTY_CONFIG[difficulty];
    const total = cards.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setSelectedIdx(i => Math.min(i + 1, total - 1));
      if (e.key === 'ArrowLeft') setSelectedIdx(i => Math.max(i - 1, 0));
      if (e.key === 'ArrowDown') setSelectedIdx(i => Math.min(i + cols, total - 1));
      if (e.key === 'ArrowUp') setSelectedIdx(i => Math.max(i - cols, 0));
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipCard(selectedIdx); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameState, difficulty, cards.length, selectedIdx, flipCard]);

  return (
    <GameShell
      title="Memory Deck"
      score={score}
      bestScore={bestScore}
      state={gameState}
      onPause={() => setGameState('paused')}
      onResume={() => gameState === 'how-to-play' ? startGame() : setGameState('playing')}
      onRestart={() => startGame(difficulty)}
      onExit={onExit}
      onToggleMute={() => setIsMuted(m => !m)}
      isMuted={isMuted}
      instructions={INSTRUCTIONS}
      gameOverMessage={`You matched all ${totalPairs} pairs! ${winStars === 3 ? '⭐⭐⭐ Perfect!' : winStars === 2 ? '⭐⭐ Great!' : '⭐ Good job!'}`}
    >
      <div className="w-full h-full flex flex-col items-center justify-center relative p-2 sm:p-4 overflow-hidden">
        {/* Difficulty selector (shown when how-to-play) */}
        {gameState === 'how-to-play' && (
          <div className="flex gap-2 sm:gap-3 mb-4 z-20">
            {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => { setDifficulty(d); startGame(d); }}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                  difficulty === d
                    ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {DIFFICULTY_CONFIG[d].label}
              </button>
            ))}
          </div>
        )}

        {/* Stats bar */}
        {gameState === 'playing' && (
          <div className="flex items-center justify-between gap-4 mb-3 px-4 py-2 bg-[#061125] border border-[rgba(0,240,255,0.15)] rounded-xl text-xs font-mono w-full max-w-xl">
            <span className="text-gray-400">Moves: <span className="font-bold text-white">{moves}</span></span>
            <span className="text-gray-400">Matched: <span className="font-bold text-[#00F0FF]">{matches}/{totalPairs}</span></span>
            <span className="text-gray-400">Time: <span className="font-bold text-white">{seconds}s</span></span>
            {streak > 1 && (
              <span className="font-bold text-yellow-400 animate-pulse">🔥 {streak} combo!</span>
            )}
          </div>
        )}

        {/* Card Grid Stage - Dynamically Centered & Scaled */}
        {(gameState === 'playing' || gameState === 'paused') && (
          <div className="relative flex-1 w-full h-full flex items-center justify-center max-h-[82vh] overflow-hidden">
            <div
              className="grid gap-2 sm:gap-3 p-2 max-w-full max-h-full items-center justify-center"
              style={{
                gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))`,
                maxWidth: cfg.cols === 6 ? '680px' : cfg.cols === 5 ? '560px' : '440px',
                width: '100%',
              }}
            >
              {cards.map((card, idx) => {
                const isSelected = idx === selectedIdx && gameState === 'playing';
                return (
                  <div
                    key={card.id}
                    onClick={() => flipCard(card.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={card.flipped || card.matched ? card.name : 'Face-down biology card'}
                    aria-pressed={card.flipped || card.matched}
                    className={`relative cursor-pointer select-none aspect-[2.5/3.5] w-full transition-all duration-200 ${
                      isSelected ? 'ring-2 ring-[var(--color-cyan)] ring-offset-2 ring-offset-[#030a18] rounded-xl' : ''
                    } ${card.matched ? 'opacity-50 scale-95' : 'hover:scale-[1.03]'}`}
                    style={{ perspective: '800px' }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') flipCard(card.id); }}
                  >
                    <div
                      className="absolute inset-0 w-full h-full transition-transform duration-300 shadow-lg"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      {/* Back face */}
                      <div
                        className="absolute inset-0 rounded-xl border border-[rgba(0,240,255,0.25)] bg-gradient-to-br from-[#0E1E42] via-[#08122B] to-[#040817] flex flex-col items-center justify-center shadow-inner"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="text-[var(--color-cyan)]/25 text-2xl font-black">⬡</div>
                        <div className="text-[9px] font-mono tracking-widest text-[var(--color-cyan)]/45 uppercase mt-1">BIO-DECK</div>
                      </div>
                      {/* Front face */}
                      <div
                        className={`absolute inset-0 rounded-xl border flex flex-col justify-between p-2.5 shadow-2xl ${
                          card.matched
                            ? 'border-emerald-500 bg-gradient-to-br from-[#07251B] to-[#020F0A] text-emerald-300'
                            : 'border-[var(--border-color)] bg-gradient-to-br from-[#0B152C] via-[#070E20] to-[#040815] text-white'
                        }`}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        {/* Name at top */}
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-white">
                          {card.name}
                        </div>
                        {/* Big Diagram / Symbol in center */}
                        <div className="text-center text-3xl sm:text-4xl my-auto select-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                          {card.symbol}
                        </div>
                        {/* Scientific classification at bottom */}
                        <div className="text-[9px] font-mono text-gray-400 truncate text-center">
                          {card.scientific}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Win Screen Stars */}
        {gameState === 'game-over' && (
          <div className="flex flex-col items-center gap-4 z-20">
            <div className="flex gap-2 text-4xl">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={i < winStars ? 'opacity-100 drop-shadow-[0_0_10px_#FFD700]' : 'opacity-20'}>⭐</span>
              ))}
            </div>
            <div className="text-xs text-gray-300 font-mono">
              {moves} moves · {seconds}s · {difficulty}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};
