import React, { useState } from 'react';
import { Trophy, Clock, Calendar, Users, RotateCcw, AlertTriangle } from 'lucide-react';
import type { LeaderboardEntry, GameId } from '../../games/types';
import { getLeaderboard, resetLeaderboard } from '../../games/store';
import { GAME_DEFINITIONS } from '../../games/types';

type Filter = 'today' | 'week' | 'alltime';

interface LeaderboardProps {
  isAdmin: boolean;
  isTeacher: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ isAdmin, isTeacher }) => {
  const [filter, setFilter] = useState<Filter>('alltime');
  const [selectedGame, setSelectedGame] = useState<GameId | undefined>(undefined);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const entries: LeaderboardEntry[] = getLeaderboard(filter, selectedGame);

  const handleReset = () => {
    resetLeaderboard(selectedGame);
    setShowResetConfirm(false);
  };

  const filterTabs: { id: Filter; label: string; icon: React.ElementType }[] = [
    { id: 'today', label: 'Today', icon: Clock },
    { id: 'week', label: 'This Week', icon: Calendar },
    { id: 'alltime', label: 'All Time', icon: Trophy },
  ];

  const rankColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF]'
                  : 'bg-[#09182D] border border-transparent text-gray-400 hover:text-white hover:bg-[#0D213A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
        {(isTeacher || isAdmin) && (
          <button
            onClick={() => setFilter('alltime')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#09182D] border border-transparent text-gray-400 hover:text-white hover:bg-[#0D213A] transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            My Class
          </button>
        )}

        {/* Game Filter */}
        <select
          value={selectedGame || ''}
          onChange={e => setSelectedGame((e.target.value as GameId) || undefined)}
          className="ml-auto px-3 py-1.5 rounded-xl text-xs bg-[#09182D] border border-[rgba(0,240,255,0.15)] text-gray-300 focus:outline-none focus:border-[#00F0FF] cursor-pointer"
        >
          <option value="">All Games</option>
          {GAME_DEFINITIONS.map(g => (
            <option key={g.id} value={g.id}>{g.title}</option>
          ))}
        </select>

        {/* Admin Reset */}
        {isAdmin && (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[rgba(0,240,255,0.1)]">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#09182D] border-b border-[rgba(0,240,255,0.1)]">
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-12">#</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Player</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Game</th>
              <th className="text-right px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score</th>
              <th className="text-right px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500 text-sm">
                  No scores yet for this period. Play a game to get on the board!
                </td>
              </tr>
            ) : (
              entries.slice(0, 20).map((entry, i) => (
                <tr
                  key={`${entry.userId}-${entry.gameId}-${i}`}
                  className="border-b border-[rgba(255,255,255,0.03)] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={`font-bold font-mono ${rankColors[i] || 'text-gray-500'}`}>
                      {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                        {entry.avatar || entry.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-white truncate max-w-[100px]">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-400">{entry.gameTitle}</td>
                  <td className="px-4 py-3 text-right font-bold font-mono text-[#00F0FF]">
                    {entry.score.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500 hidden md:table-cell">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#090C22] border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full mx-4 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-white">Reset Leaderboard?</h3>
              <p className="text-[11px] text-gray-400 mt-1">
                This will permanently delete all {selectedGame ? `${selectedGame} ` : ''}scores. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 text-xs font-bold hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
