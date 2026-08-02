export type GameId = 'hungry-serpent' | 'memory-deck' | 'neon-maze' | 'sky-whirly' | 'id-duel' | 'neon-grid-battle' | 'brick-breaker' | 'road-racer' | 'ice-breaker';

export type GameCategory = 'Arcade' | 'Brain' | 'Multiplayer';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface GameDefinition {
  id: GameId;
  title: string;
  description: string;
  category: GameCategory;
  difficulty: Difficulty;
  thumbnailGradient: string;
  thumbnailIcon: string;
  controls: string;
  isHidden?: boolean;
}

export interface GameScore {
  gameId: GameId;
  userId: string;
  userName: string;
  userAvatar: string;
  score: number;
  date: string; // ISO string
  metadata?: Record<string, unknown>;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  score: number;
  gameId: GameId;
  gameTitle: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  gameId?: GameId;
  unlockedAt?: string; // ISO string when unlocked
}

export interface MatchRecord {
  id: string;
  opponentName: string;
  opponentAvatar: string;
  myScore: number;
  opponentScore: number;
  result: 'win' | 'loss' | 'draw';
  date: string;
}

export type GameState = 'idle' | 'how-to-play' | 'playing' | 'paused' | 'game-over';

export interface GameShellProps {
  gameId: GameId;
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
}

export interface DuelRoom {
  roomId: string;
  player1Id: string;
  player2Id: string;
  state: 'waiting' | 'countdown' | 'playing' | 'finished';
  timeLeft: number;
  winner?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-game',
    title: 'First Game!',
    description: 'Play any Bone Game for the first time.',
    icon: '🎮',
  },
  {
    id: 'memory-master',
    title: 'Memory Master',
    description: 'Complete Memory Deck on Hard difficulty.',
    icon: '🧠',
    gameId: 'memory-deck',
  },
  {
    id: 'maze-runner',
    title: 'Maze Runner',
    description: 'Complete 3 levels of Neon Maze Chase.',
    icon: '🌀',
    gameId: 'neon-maze',
  },
  {
    id: 'sky-pilot',
    title: 'Sky Pilot',
    description: 'Survive 100 gates in Sky Whirly.',
    icon: '✈️',
    gameId: 'sky-whirly',
  },
  {
    id: 'serpent-champion',
    title: 'Serpent Champion',
    description: 'Score 5000+ points in Hungry Serpent.',
    icon: '🐍',
    gameId: 'hungry-serpent',
  },
  {
    id: 'first-duel-win',
    title: 'First Duel Win',
    description: 'Win your first ID Duel Arena match.',
    icon: '⚔️',
    gameId: 'id-duel',
  },
  {
    id: 'fleet-commander',
    title: 'Fleet Commander',
    description: 'Sink all enemy AI vessels in Neon Grid Battle.',
    icon: '🚀',
    gameId: 'neon-grid-battle',
  },
];

export const GAME_DEFINITIONS: GameDefinition[] = [
  {
    id: 'hungry-serpent',
    title: 'Hungry Serpent',
    description: 'Control a glowing energy serpent, grow by collecting orbs, and outlast AI rivals in this neon arena.',
    category: 'Arcade',
    difficulty: 'Medium',
    thumbnailGradient: 'from-emerald-600 via-teal-500 to-cyan-500',
    thumbnailIcon: '🐍',
    controls: 'Mouse to steer • Space/Click to boost',
  },
  {
    id: 'neon-grid-battle',
    title: 'Neon Grid Battle',
    description: 'Deploy glowing cyber fleet on an 8x8 grid. Outsmart AI targeting in turn-based strategic naval combat.',
    category: 'Arcade',
    difficulty: 'Medium',
    thumbnailGradient: 'from-cyan-500 via-[#00e5ff] to-purple-600',
    thumbnailIcon: '🚀',
    controls: 'Drag & Drop ships • Click to rotate • Click enemy grid to fire',
  },
  {
    id: 'memory-deck',
    title: 'Memory Deck',
    description: 'Flip cards to find matching pairs. Challenge your memory with Easy 4×4 up to Hard 6×6 grids.',
    category: 'Brain',
    difficulty: 'Easy',
    thumbnailGradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    thumbnailIcon: '🃏',
    controls: 'Click card to flip • Arrow keys to navigate',
  },
  {
    id: 'neon-maze',
    title: 'Neon Maze Chase',
    description: 'Navigate a neon maze, collect energy nodes, and outsmart four uniquely-behaving enemy drones.',
    category: 'Arcade',
    difficulty: 'Hard',
    thumbnailGradient: 'from-blue-600 via-indigo-500 to-purple-600',
    thumbnailIcon: '🌀',
    controls: 'Arrow keys / WASD • P = pause',
  },
  {
    id: 'sky-whirly',
    title: 'Sky Whirly',
    description: 'Pilot a CosmicBone flying pod through endless futuristic gates. Tap to rise, gravity pulls you down.',
    category: 'Arcade',
    difficulty: 'Medium',
    thumbnailGradient: 'from-sky-500 via-blue-500 to-indigo-600',
    thumbnailIcon: '✈️',
    controls: 'Space / Click to lift • P = pause',
  },
  {
    id: 'id-duel',
    title: 'ID Duel Arena',
    description: 'Challenge a friend to a real-time 1v1 Hungry Serpent duel. Server-validated, no cheating allowed.',
    category: 'Multiplayer',
    difficulty: 'Hard',
    thumbnailGradient: 'from-rose-600 via-orange-500 to-yellow-500',
    thumbnailIcon: '⚔️',
    controls: 'Mouse steer • Space to boost',
  },
  {
    id: 'brick-breaker',
    title: 'Cyber Brick Breaker',
    description: 'Bounce the energy ball to smash layers of cyber neon bricks. Features real-time glowing direction vectors and infinite levels.',
    category: 'Arcade',
    difficulty: 'Medium',
    thumbnailGradient: 'from-pink-650 via-purple-600 to-indigo-650',
    thumbnailIcon: '🧱',
    controls: 'Mouse / Touch to slide paddle',
  },
  {
    id: 'road-racer',
    title: 'Neon Road Racer',
    description: 'Drive down a high-speed vertical highway. Steer to dodge construction cones, lane barriers, and test your reflex speed in infinite levels.',
    category: 'Arcade',
    difficulty: 'Hard',
    thumbnailGradient: 'from-emerald-500 via-teal-650 to-cyan-700',
    thumbnailIcon: '🏎️',
    controls: 'Mouse / Touch steer • Arrow keys steer',
  },
  {
    id: 'ice-breaker',
    title: 'Frost Runner',
    description: 'Survive on a breaking ice grid! Outmaneuver the AI bot as tiles crack and melt into freezing water beneath your feet.',
    category: 'Arcade',
    difficulty: 'Medium',
    thumbnailGradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    thumbnailIcon: '🧊',
    controls: 'Arrow keys / D-pad to move',
  },
];
