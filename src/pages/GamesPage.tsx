import React, { useState, useCallback } from 'react';
import {
  Gamepad2, Search, Trophy, Star, Shield,
  ChevronRight, Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GameCard } from '../components/games/GameCard';
import { Leaderboard } from '../components/games/Leaderboard';
import { AchievementToast } from '../components/games/AchievementToast';
import { HungrySerpentGame } from '../games/HungrySerpent/HungrySerpentGame';
import { MemoryDeckGame } from '../games/MemoryDeck/MemoryDeckGame';
import { NeonMazeGame } from '../games/NeonMazeChase/NeonMazeGame';
import { SkyWhirlyGame } from '../games/SkyWhirly/SkyWhirlyGame';
import { IdDuelGame } from '../games/IdDuelArena/IdDuelGame';
import { NeonGridBattleGame } from '../games/NeonGridBattle/NeonGridBattleGame';
import { BrickBreakerGame } from '../games/BrickBreaker/BrickBreakerGame';
import { RoadRacerGame } from '../games/RoadRacer/RoadRacerGame';
import { IceBreakerGame } from '../games/IceBreaker/IceBreakerGame';
import {
  GAME_DEFINITIONS,
} from '../games/types';
import type { GameId, GameCategory, Achievement } from '../games/types';
import {
  saveScore,
  getBestScore,
  getHiddenGames,
  setGameHidden,
  unlockAchievement,
  isAchievementUnlocked,
  getAchievements,
  getMazeLevel,
  setMazeLevel,
  saveMatchRecord,
} from '../games/store';

type Tab = 'games' | 'leaderboard' | 'achievements';
type ActiveGame = GameId | null;

export const GamesPage: React.FC = () => {
  const { user } = useApp();
  const isAdmin = !!user.isAdmin;
  const isTeacher = user.userType === 'teacher' || isAdmin;

  const [activeTab, setActiveTab] = useState<Tab>('games');
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GameCategory | 'All'>('All');
  const [hiddenGames, setHiddenGamesList] = useState<GameId[]>(getHiddenGames);
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);
  const [mazeLevel, setMazeLevelState] = useState(() => getMazeLevel(user.email));

  const userId = user.email || 'guest';
  const userName = user.name || 'Player';
  const userAvatar = user.initials || '??';

  // ── Filtered game list ──
  const visibleGames = GAME_DEFINITIONS.filter(g => {
    if (!isAdmin && hiddenGames.includes(g.id)) return false;
    if (categoryFilter !== 'All' && g.category !== categoryFilter) return false;
    if (search && !g.title.toLowerCase().includes(search.toLowerCase()) &&
        !g.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const categories: (GameCategory | 'All')[] = ['All', 'Arcade', 'Brain', 'Multiplayer'];

  // ── Score handlers ──
  const handleScoreSaved = useCallback((gameId: GameId, score: number, metadata?: Record<string, unknown>) => {
    saveScore(gameId, score, userId, userName, userAvatar, metadata);

    // First game achievement
    if (!isAchievementUnlocked('first-game')) {
      const a = unlockAchievement('first-game');
      if (a) setAchievementToast(a);
    }

    // Game-specific achievements
    if (gameId === 'hungry-serpent' && score >= 5000 && !isAchievementUnlocked('serpent-champion')) {
      const a = unlockAchievement('serpent-champion');
      if (a) setAchievementToast(a);
    }
    if (gameId === 'sky-whirly' && score >= 1000 && !isAchievementUnlocked('sky-pilot')) {
      const a = unlockAchievement('sky-pilot');
      if (a) setAchievementToast(a);
    }
  }, [userId, userName, userAvatar]);

  const handleMazeLevel = useCallback((level: number) => {
    const nextLevel = level + 1;
    setMazeLevelState(nextLevel);
    setMazeLevel(userId, nextLevel);
    if (level >= 3 && !isAchievementUnlocked('maze-runner')) {
      const a = unlockAchievement('maze-runner');
      if (a) setAchievementToast(a);
    }
  }, [userId]);

  const handleMemoryScoreSaved = useCallback((score: number) => {
    handleScoreSaved('memory-deck', score);
    if (!isAchievementUnlocked('memory-master')) {
      const a = unlockAchievement('memory-master');
      if (a) setAchievementToast(a);
    }
  }, [handleScoreSaved]);

  const handleMatchSaved = useCallback((myScore: number, opponentScore: number, result: 'win' | 'loss' | 'draw') => {
    handleScoreSaved('id-duel', myScore);
    saveMatchRecord({ opponentName: 'Opponent', opponentAvatar: '??', myScore, opponentScore, result, date: new Date().toISOString() });
    if (result === 'win' && !isAchievementUnlocked('first-duel-win')) {
      const a = unlockAchievement('first-duel-win');
      if (a) setAchievementToast(a);
    }
  }, [handleScoreSaved]);

  const handleToggleVisibility = (gameId: GameId) => {
    const isHidden = hiddenGames.includes(gameId);
    setGameHidden(gameId, !isHidden);
    setHiddenGamesList(getHiddenGames());
  };

  const achievements = getAchievements();
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  // ── Render active game ──
  if (activeGame === 'hungry-serpent') {
    return (
      <HungrySerpentGame
        userId={userId}
        userName={userName}
        bestScore={getBestScore('hungry-serpent', userId)}
        onScoreSaved={s => handleScoreSaved('hungry-serpent', s)}
        onExit={() => setActiveGame(null)}
      />
    );
  }
  if (activeGame === 'neon-grid-battle') {
    return (
      <NeonGridBattleGame
        userId={userId}
        userName={userName}
        bestScore={getBestScore('neon-grid-battle', userId)}
        onScoreSaved={s => handleScoreSaved('neon-grid-battle', s)}
        onExit={() => setActiveGame(null)}
      />
    );
  }
  if (activeGame === 'memory-deck') {
    return (
      <MemoryDeckGame
        bestScore={getBestScore('memory-deck', userId)}
        onScoreSaved={handleMemoryScoreSaved}
        onExit={() => setActiveGame(null)}
      />
    );
  }
  if (activeGame === 'neon-maze') {
    return (
      <NeonMazeGame
        bestScore={getBestScore('neon-maze', userId)}
        onScoreSaved={s => handleScoreSaved('neon-maze', s)}
        onExit={() => setActiveGame(null)}
        initialLevel={mazeLevel}
        onLevelComplete={handleMazeLevel}
      />
    );
  }
  if (activeGame === 'sky-whirly') {
    return (
      <SkyWhirlyGame
        bestScore={getBestScore('sky-whirly', userId)}
        onScoreSaved={s => handleScoreSaved('sky-whirly', s)}
        onExit={() => setActiveGame(null)}
      />
    );
  }
  if (activeGame === 'id-duel') {
    return (
      <IdDuelGame
        userId={userId}
        userName={userName}
        bestScore={getBestScore('id-duel', userId)}
        onMatchSaved={handleMatchSaved}
        onExit={() => setActiveGame(null)}
      />
    );
  }
  if (activeGame === 'brick-breaker') {
    return (
      <BrickBreakerGame
        bestScore={getBestScore('brick-breaker', userId)}
        onScoreSaved={s => handleScoreSaved('brick-breaker', s)}
        onExit={() => setActiveGame(null)}
      />
    );
  }
  if (activeGame === 'road-racer') {
    return (
      <RoadRacerGame
        bestScore={getBestScore('road-racer', userId)}
        onScoreSaved={s => handleScoreSaved('road-racer', s)}
        onExit={() => setActiveGame(null)}
      />
    );
  }
  if (activeGame === 'ice-breaker') {
    return (
      <IceBreakerGame
        bestScore={getBestScore('ice-breaker', userId)}
        onScoreSaved={s => handleScoreSaved('ice-breaker', s)}
        onExit={() => setActiveGame(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <AchievementToast achievement={achievementToast} onDismiss={() => setAchievementToast(null)} />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(115,178,255,0.18)] bg-gradient-to-br from-[#0A0F2E] via-[#0D1640] to-[#0A0F28] p-6 sm:p-8">
        {/* Decorative glow */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-20 w-48 h-48 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">Bone Games</h1>
              <p className="text-[11px] text-gray-400">Play, challenge, and learn</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5" /> {GAME_DEFINITIONS.length} Games Available
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-[11px] font-bold text-yellow-300 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> {unlockedCount}/{achievements.length} Achievements
            </div>
            {isAdmin && (
              <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Admin Controls Active
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-[#09182D] rounded-2xl border border-[rgba(0,240,255,0.08)] w-fit">
        {([
          { id: 'games', label: 'Games', icon: Gamepad2 },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          { id: 'achievements', label: 'Achievements', icon: Star },
        ] as { id: Tab; label: string; icon: React.ElementType }[]).map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00C4CC]/20 to-[#8B5CF6]/20 border border-[#00F0FF]/30 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── GAMES TAB ── */}
      {activeTab === 'games' && (
        <>
          {/* Search + Category Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#09182D] border border-[rgba(115,178,255,0.15)] rounded-xl flex-1 max-w-sm">
              <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search games..."
                className="w-full bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    categoryFilter === cat
                      ? 'border-[#00F0FF]/40 bg-[#00F0FF]/10 text-[#00F0FF]'
                      : 'border-transparent bg-[#09182D] text-gray-400 hover:text-white hover:bg-[#0D213A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Game Cards Grid */}
          {visibleGames.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Cpu className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No games match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  bestScore={getBestScore(game.id, userId)}
                  isAdmin={isAdmin}
                  isHidden={hiddenGames.includes(game.id)}
                  onPlay={() => setActiveGame(game.id)}
                  onToggleVisibility={() => handleToggleVisibility(game.id)}
                />
              ))}
            </div>
          )}

          {/* Quick leaderboard preview */}
          <div className="glass-panel rounded-3xl border border-[rgba(115,178,255,0.12)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-cyan)] uppercase tracking-wider">
                <Trophy className="w-4 h-4" />
                <span>Top Scores This Week</span>
              </div>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className="text-[11px] text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                Full Leaderboard <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <Leaderboard isAdmin={isAdmin} isTeacher={isTeacher} />
          </div>
        </>
      )}

      {/* ── LEADERBOARD TAB ── */}
      {activeTab === 'leaderboard' && (
        <div className="glass-panel rounded-3xl border border-[rgba(115,178,255,0.12)] p-5">
          <Leaderboard isAdmin={isAdmin} isTeacher={isTeacher} />
        </div>
      )}

      {/* ── ACHIEVEMENTS TAB ── */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white font-heading">
              Your Achievements
              <span className="ml-2 text-[11px] font-normal text-gray-400">
                {unlockedCount}/{achievements.length} unlocked
              </span>
            </h2>
            <div className="h-2 bg-[#09182D] rounded-full w-32 border border-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(a => (
              <div
                key={a.id}
                className={`glass-panel rounded-2xl border p-4 flex items-start gap-3 transition-all ${
                  a.unlockedAt
                    ? 'border-yellow-500/30 bg-yellow-500/5'
                    : 'border-[rgba(115,178,255,0.1)] opacity-50 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                  a.unlockedAt ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-white/10 bg-white/5'
                }`}>
                  {a.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{a.title}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-snug">{a.description}</div>
                  {a.unlockedAt && (
                    <div className="text-[9px] text-yellow-500/70 mt-1">
                      Unlocked {new Date(a.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
