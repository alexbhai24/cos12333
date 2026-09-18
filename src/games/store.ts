import type { GameId, GameScore, Achievement, LeaderboardEntry, MatchRecord } from './types';
import { ACHIEVEMENTS } from './types';

const SCORES_KEY = 'cosmicbone_game_scores';
const ACHIEVEMENTS_KEY = 'cosmicbone_achievements';
const MATCHES_KEY = 'cosmicbone_duel_matches';
const HIDDEN_GAMES_KEY = 'cosmicbone_hidden_games';
const MAZE_LEVELS_KEY = 'cosmicbone_maze_levels';

// ─── Scores ────────────────────────────────────────────────────────────────

function getAllScores(): GameScore[] {
  try {
    return JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveAllScores(scores: GameScore[]): void {
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

export function saveScore(
  gameId: GameId,
  score: number,
  userId: string,
  userName: string,
  userAvatar: string,
  metadata?: Record<string, unknown>
): void {
  // Basic score validation / anti-cheat caps
  const maxScores: Record<GameId, number> = {
    'hungry-serpent': 99999,
    'memory-deck': 9999,
    'neon-maze': 99999,
    'sky-whirly': 99999,
    'id-duel': 99999,
    'neon-grid-battle': 99999,
    'brick-breaker': 99999,
    'road-racer': 99999,
    'ice-breaker': 99999,
  };
  const safeScore = Math.max(0, Math.min(Math.floor(score), maxScores[gameId] ?? 99999));

  const scores = getAllScores();
  scores.push({
    gameId,
    userId,
    userName,
    userAvatar,
    score: safeScore,
    date: new Date().toISOString(),
    metadata,
  });
  saveAllScores(scores);
}

export function getBestScore(gameId: GameId, userId: string): number {
  const scores = getAllScores().filter(s => s.gameId === gameId && s.userId === userId);
  if (!scores.length) return 0;
  return Math.max(...scores.map(s => s.score));
}

export function getLeaderboard(
  filter: 'today' | 'week' | 'alltime',
  gameId?: GameId,
  _myClass?: string
): LeaderboardEntry[] {
  const now = new Date();
  const scores = getAllScores().filter(s => {
    const date = new Date(s.date);
    if (filter === 'today') {
      return date.toDateString() === now.toDateString();
    }
    if (filter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo;
    }
    return true;
  }).filter(s => !gameId || s.gameId === gameId);

  // Group by userId+gameId, keep best score per user per game
  const bestMap = new Map<string, GameScore>();
  for (const s of scores) {
    const key = `${s.userId}:${s.gameId}`;
    const existing = bestMap.get(key);
    if (!existing || s.score > existing.score) {
      bestMap.set(key, s);
    }
  }

  const gameTitles: Record<GameId, string> = {
    'hungry-serpent': 'Hungry Serpent',
    'memory-deck': 'Memory Deck',
    'neon-maze': 'Neon Maze Chase',
    'sky-whirly': 'Sky Whirly',
    'id-duel': 'ID Duel Arena',
    'neon-grid-battle': 'Neon Grid Battle',
    'brick-breaker': 'Cyber Brick Breaker',
    'road-racer': 'Neon Road Racer',
    'ice-breaker': 'Frost Runner',
  };

  return Array.from(bestMap.values())
    .sort((a, b) => b.score - a.score)
    .map((s, i) => ({
      rank: i + 1,
      userId: s.userId,
      name: s.userName,
      avatar: s.userAvatar,
      score: s.score,
      gameId: s.gameId,
      gameTitle: gameTitles[s.gameId] || s.gameId,
      date: s.date,
    }));
}

export function resetLeaderboard(gameId?: GameId): void {
  if (!gameId) {
    localStorage.removeItem(SCORES_KEY);
    return;
  }
  const scores = getAllScores().filter(s => s.gameId !== gameId);
  saveAllScores(scores);
}

// ─── Achievements ───────────────────────────────────────────────────────────

function getAchievementState(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function unlockAchievement(id: string): Achievement | null {
  const state = getAchievementState();
  if (state[id]) return null; // already unlocked

  state[id] = new Date().toISOString();
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(state));

  const achievement = ACHIEVEMENTS.find(a => a.id === id);
  return achievement ? { ...achievement, unlockedAt: state[id] } : null;
}

export function getAchievements(): Achievement[] {
  const state = getAchievementState();
  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlockedAt: state[a.id],
  }));
}

export function isAchievementUnlocked(id: string): boolean {
  return !!getAchievementState()[id];
}

// ─── Match History (Duel) ───────────────────────────────────────────────────

export function saveMatchRecord(record: Omit<MatchRecord, 'id'>): void {
  const records: MatchRecord[] = getMatchHistory();
  records.unshift({
    ...record,
    id: `match_${Date.now()}`,
  });
  // Keep only last 50
  localStorage.setItem(MATCHES_KEY, JSON.stringify(records.slice(0, 50)));
}

export function getMatchHistory(): MatchRecord[] {
  try {
    return JSON.parse(localStorage.getItem(MATCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

// ─── Hidden Games (Admin) ────────────────────────────────────────────────────

export function getHiddenGames(): GameId[] {
  try {
    return JSON.parse(localStorage.getItem(HIDDEN_GAMES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function setGameHidden(gameId: GameId, hidden: boolean): void {
  const hiddenGames = getHiddenGames();
  if (hidden && !hiddenGames.includes(gameId)) {
    hiddenGames.push(gameId);
  } else if (!hidden) {
    const idx = hiddenGames.indexOf(gameId);
    if (idx !== -1) hiddenGames.splice(idx, 1);
  }
  localStorage.setItem(HIDDEN_GAMES_KEY, JSON.stringify(hiddenGames));
}

// ─── Maze Level Progress ────────────────────────────────────────────────────

export function getMazeLevel(userId: string): number {
  try {
    const data = JSON.parse(localStorage.getItem(MAZE_LEVELS_KEY) || '{}');
    return data[userId] || 1;
  } catch {
    return 1;
  }
}

export function setMazeLevel(userId: string, level: number): void {
  try {
    const data = JSON.parse(localStorage.getItem(MAZE_LEVELS_KEY) || '{}');
    data[userId] = level;
    localStorage.setItem(MAZE_LEVELS_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}
