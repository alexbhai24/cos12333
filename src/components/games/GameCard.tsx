import React from 'react';
import { Play, Star, Trophy, EyeOff, Eye } from 'lucide-react';
import type { GameDefinition } from '../../games/types';

interface GameCardProps {
  game: GameDefinition;
  bestScore: number;
  isAdmin: boolean;
  isHidden: boolean;
  onPlay: () => void;
  onToggleVisibility: () => void;
}

const difficultyColors: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Hard: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
};

const categoryColors: Record<string, string> = {
  Arcade: 'text-cyan-400 bg-cyan-400/10',
  Brain: 'text-purple-400 bg-purple-400/10',
  Multiplayer: 'text-orange-400 bg-orange-400/10',
};

export const GameCard: React.FC<GameCardProps> = ({
  game,
  bestScore,
  isAdmin,
  isHidden,
  onPlay,
  onToggleVisibility,
}) => {
  return (
    <div
      className={`glass-panel rounded-3xl border overflow-hidden flex flex-col group transition-all duration-300 ${
        isHidden
          ? 'border-gray-600/20 opacity-60'
          : 'border-[rgba(115,178,255,0.18)] hover:border-[rgba(0,240,255,0.4)] hover:shadow-lg hover:shadow-cyan-500/10'
      }`}
    >
      {/* Thumbnail */}
      <div className={`relative h-40 bg-gradient-to-br ${game.thumbnailGradient} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 select-none">
          {game.thumbnailIcon}
        </div>
        {/* Neon glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06101F]/80 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${categoryColors[game.category] || ''}`}>
            {game.category}
          </span>
        </div>

        {/* Difficulty */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${difficultyColors[game.difficulty] || ''}`}>
            {game.difficulty}
          </span>
        </div>

        {/* Hidden overlay */}
        {isHidden && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <EyeOff className="w-4 h-4" /> Hidden from students
            </span>
          </div>
        )}

        {/* Icon large */}
        <div className="absolute bottom-3 left-3 text-4xl group-hover:scale-110 transition-transform duration-300">
          {game.thumbnailIcon}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-white font-heading mb-1 group-hover:text-[#00F0FF] transition-colors">
          {game.title}
        </h3>
        <p className="text-[11px] text-gray-400 leading-snug mb-3 flex-1 line-clamp-2">
          {game.description}
        </p>

        {/* Best Score */}
        <div className="flex items-center justify-between mb-3 text-[11px]">
          <div className="flex items-center gap-1 text-gray-500">
            <Trophy className="w-3.5 h-3.5 text-yellow-500/70" />
            <span>Best:</span>
            <span className="font-bold font-mono text-gray-300">
              {bestScore > 0 ? bestScore.toLocaleString() : '—'}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-yellow-400/60">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i === 0 && bestScore > 0 ? 'text-yellow-400 fill-yellow-400' : ''}`} />
            ))}
          </div>
        </div>

        {/* Controls hint */}
        <div className="text-[9px] text-gray-600 mb-3 font-mono">{game.controls}</div>

        {/* Action row */}
        <div className="flex gap-2">
          <button
            onClick={onPlay}
            disabled={isHidden && !isAdmin}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              isHidden && !isAdmin
                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#00C4CC] to-[#58A6FF] text-[#030816] hover:brightness-110 active:scale-95 shadow-md shadow-cyan-500/20'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Play Now
          </button>

          {isAdmin && (
            <button
              onClick={onToggleVisibility}
              title={isHidden ? 'Show game' : 'Hide game'}
              className={`px-2.5 py-2.5 rounded-xl border text-xs transition-all ${
                isHidden
                  ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                  : 'border-gray-600/30 text-gray-400 hover:bg-gray-600/10'
              }`}
            >
              {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
