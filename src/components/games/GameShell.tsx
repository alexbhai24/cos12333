import React, { useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  Sparkles,
} from 'lucide-react';
import type { GameState } from '../../games/types';

interface GameShellProps {
  title: string;
  score: number;
  bestScore: number;
  lives?: number;
  maxLives?: number;
  timeLeft?: number;
  state: GameState;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  children: React.ReactNode;
  instructions: string[];
  gameOverMessage?: string;
}

export const GameShell: React.FC<GameShellProps> = ({
  title,
  score,
  bestScore,
  lives,
  maxLives = 3,
  timeLeft,
  state,
  onPause,
  onResume,
  onRestart,
  onExit,
  onToggleMute,
  isMuted,
  children,
  instructions,
  gameOverMessage,
}) => {
  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        if (state === 'playing') onPause();
        else if (state === 'paused') onResume();
      }
      if (e.key === 'r' || e.key === 'R') onRestart();
      if (e.key === 'Escape') {
        if (state === 'paused') onResume();
      }
    },
    [state, onPause, onResume, onRestart]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-[90] bg-[#020612] text-white flex flex-col overflow-hidden select-none font-sans" role="dialog" aria-label={`${title} game`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-purple-600/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Cyber HUD Bar */}
      <header className="relative z-20 flex items-center justify-between px-3 sm:px-6 py-2.5 bg-[#050C1B]/95 border-b border-[rgba(0,240,255,0.15)] shadow-lg shadow-black/40 flex-shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            aria-label="Exit game"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-gray-200 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 transition-all text-xs font-bold active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#00F0FF]" />
            <span className="inline">Back to Games</span>
          </button>
          <div className="h-5 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
            <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-wide font-heading uppercase">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Score Display */}
          <div className="text-center bg-[#0A162B] px-3 py-1 rounded-xl border border-[rgba(0,240,255,0.2)]">
            <div className="text-[8px] sm:text-[9px] text-cyan-400 font-bold uppercase tracking-wider">Score</div>
            <div className="text-xs sm:text-sm font-black font-mono text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              {score.toLocaleString()}
            </div>
          </div>

          {/* Best Score */}
          <div className="text-center bg-[#0A162B] px-3 py-1 rounded-xl border border-yellow-500/20 hidden sm:block">
            <div className="text-[8px] sm:text-[9px] text-yellow-400 font-bold uppercase tracking-wider">Best</div>
            <div className="text-xs sm:text-sm font-black font-mono text-yellow-300">
              {Math.max(score, bestScore).toLocaleString()}
            </div>
          </div>

          {/* Lives */}
          {typeof lives === 'number' && (
            <div className="flex items-center gap-1 bg-[#0A162B] px-2.5 py-1.5 rounded-xl border border-rose-500/20">
              {[...Array(maxLives)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${
                    i < lives
                      ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)] scale-100'
                      : 'text-gray-700 scale-90 opacity-40'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Timer */}
          {typeof timeLeft === 'number' && (
            <div className="text-center bg-[#0A162B] px-3 py-1 rounded-xl border border-indigo-500/20">
              <div className="text-[8px] sm:text-[9px] text-indigo-300 font-bold uppercase tracking-wider">Time</div>
              <div className={`text-xs sm:text-sm font-black font-mono ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            </div>
          )}

          {/* Action Controls */}
          <div className="flex items-center gap-1 bg-[#0A162B] p-1 rounded-xl border border-white/10">
            <button
              onClick={onToggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={state === 'playing' ? onPause : onResume}
              aria-label={state === 'playing' ? 'Pause' : 'Resume'}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {state === 'playing' ? <Pause className="w-4 h-4 text-yellow-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={onRestart}
              aria-label="Restart game"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Screen Centered Stage */}
      <main className="relative flex-1 w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center relative">
          {children}
        </div>

        {/* How to Play Overlay */}
        {state === 'how-to-play' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-gradient-to-b from-[#0B152C] to-[#050C1B] border border-[rgba(0,240,255,0.3)] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-[0_0_50px_rgba(0,240,255,0.15)] animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-[#00F0FF]">
                <Sparkles className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white font-heading tracking-wide uppercase">{title}</h2>
                <p className="text-[11px] text-cyan-400/80 font-mono mt-0.5">Game Instructions</p>
              </div>

              <ul className="text-left space-y-2.5 bg-[#030914] p-4 rounded-2xl border border-white/5">
                {instructions.map((instr, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#00F0FF]/30">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{instr}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onResume}
                className="w-full py-3.5 bg-gradient-to-r from-[#00C4CC] via-[#00F0FF] to-[#58A6FF] text-[#030816] font-extrabold rounded-2xl text-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                🚀 Start Playing!
              </button>
            </div>
          </div>
        )}

        {/* Paused Overlay */}
        {state === 'paused' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-[#0B152C] border border-[rgba(0,240,255,0.25)] rounded-3xl p-6 sm:p-8 max-w-xs w-full text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto text-yellow-400">
                <Pause className="w-7 h-7" />
              </div>
              <h2 className="text-base font-black text-white font-heading uppercase tracking-wider">Game Paused</h2>
              <div className="space-y-2.5">
                <button
                  onClick={onResume}
                  className="w-full py-3 bg-gradient-to-r from-[#00C4CC] to-[#58A6FF] text-[#030816] font-extrabold rounded-xl text-xs hover:brightness-110 transition-all uppercase tracking-wider"
                >
                  ▶ Resume Game
                </button>
                <button
                  onClick={onRestart}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-xs hover:bg-white/10 transition-all"
                >
                  ↺ Restart
                </button>
                <button
                  onClick={onExit}
                  className="w-full py-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold rounded-xl text-xs hover:bg-rose-500/20 transition-all"
                >
                  ✕ Exit to Hub
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {state === 'game-over' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-gradient-to-b from-[#14081E] to-[#08030F] border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-xs w-full text-center space-y-4 shadow-[0_0_40px_rgba(244,63,94,0.2)] animate-in zoom-in-95 duration-200">
              <div className="text-4xl">💥</div>
              <h2 className="text-base font-black text-white font-heading">
                {gameOverMessage || 'Game Over!'}
              </h2>
              <div className="bg-[#030814] p-3 rounded-2xl border border-white/5 space-y-1">
                <div className="text-2xl font-black font-mono text-[#00F0FF] shadow-cyan-500/50">{score.toLocaleString()}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">Final Score</div>
              </div>
              {score >= bestScore && score > 0 && (
                <div className="text-xs font-bold text-yellow-400 animate-pulse bg-yellow-400/10 border border-yellow-400/30 py-1.5 px-3 rounded-xl">
                  🏆 New Personal Best!
                </div>
              )}
              <div className="space-y-2 pt-2">
                <button
                  onClick={onRestart}
                  className="w-full py-3 bg-gradient-to-r from-[#00C4CC] to-[#58A6FF] text-[#030816] font-extrabold rounded-xl text-xs hover:brightness-110 transition-all uppercase tracking-wider"
                >
                  ↺ Play Again
                </button>
                <button
                  onClick={onExit}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-xs hover:bg-white/10 transition-all"
                >
                  ← Back to Games
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
