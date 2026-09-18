import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { GameShell } from '../../components/games/GameShell';

interface IceBreakerProps {
  bestScore: number;
  onScoreSaved: (score: number) => void;
  onExit: () => void;
}

type TileState = 0 | 1 | 2; // 0=Water, 1=Cracked, 2=Solid
interface Position { x: number; y: number }

const GRID_W = 7;
const GRID_H = 9;
const MOVE_COOLDOWN = 180;
const BOT_COOLDOWN = 350;

export const IceBreakerGame: React.FC<IceBreakerProps> = ({ bestScore, onScoreSaved, onExit }) => {
  const [gameState, setGameState] = useState<'idle' | 'how-to-play' | 'playing' | 'game-over'>('how-to-play');
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [winner, setWinner] = useState<'player' | 'bot' | null>(null);

  // Game Refs for mutable state in animation loop
  const gridRef = useRef<TileState[][]>([]);
  const playerPosRef = useRef<Position>({ x: 3, y: 7 });
  const botPosRef = useRef<Position>({ x: 3, y: 1 });
  
  const lastPlayerMoveRef = useRef<number>(0);
  const lastBotMoveRef = useRef<number>(0);
  const nextPlayerDirRef = useRef<Position | null>(null);

  const requestRef = useRef<number>(0);

  // State for rendering
  const [, setRenderCounter] = useState<number>(0);

  // Sound effects
  const stepSoundRef = useRef<HTMLAudioElement | null>(null);
  const crackSoundRef = useRef<HTMLAudioElement | null>(null);
  const splashSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    stepSoundRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-footsteps-in-snow-loop-533.mp3');
    crackSoundRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-cracking-glass-1869.mp3');
    splashSoundRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-water-splash-1311.mp3');
    winSoundRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
  }, []);

  const playSound = (sound: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (!isMuted && sound.current) {
      sound.current.currentTime = 0;
      sound.current.play().catch(() => {});
    }
  };

  const initGrid = () => {
    const newGrid: TileState[][] = [];
    for (let y = 0; y < GRID_H; y++) {
      const row: TileState[] = [];
      for (let x = 0; x < GRID_W; x++) {
        row.push(2); // Solid
      }
      newGrid.push(row);
    }
    // Set a few random cracked tiles to start
    for (let i = 0; i < 5; i++) {
      const rx = Math.floor(Math.random() * GRID_W);
      const ry = Math.floor(Math.random() * GRID_H);
      if ((rx !== 3 || ry !== 7) && (rx !== 3 || ry !== 1)) {
        newGrid[ry][rx] = 1;
      }
    }
    gridRef.current = newGrid;
    playerPosRef.current = { x: 3, y: 7 };
    botPosRef.current = { x: 3, y: 1 };
    setScore(0);
    setWinner(null);
  };

  const startGame = () => {
    initGrid();
    setGameState('playing');
    lastPlayerMoveRef.current = performance.now();
    lastBotMoveRef.current = performance.now();
    nextPlayerDirRef.current = null;
  };

  const endGame = (win: boolean) => {
    setGameState('game-over');
    setWinner(win ? 'player' : 'bot');
    if (win) {
      setScore(s => s + 1000);
      playSound(winSoundRef);
    } else {
      playSound(splashSoundRef);
    }
    // Use setTimeout so the final score is saved after the +1000 updates
    setTimeout(() => {
      setScore(finalScore => {
        onScoreSaved(finalScore);
        return finalScore;
      });
    }, 0);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        nextPlayerDirRef.current = { x: 0, y: -1 }; break;
      case 'ArrowDown':
      case 's':
        nextPlayerDirRef.current = { x: 0, y: 1 }; break;
      case 'ArrowLeft':
      case 'a':
        nextPlayerDirRef.current = { x: -1, y: 0 }; break;
      case 'ArrowRight':
      case 'd':
        nextPlayerDirRef.current = { x: 1, y: 0 }; break;
    }
  }, [gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const movePlayer = (time: number) => {
    if (!nextPlayerDirRef.current) return;
    if (time - lastPlayerMoveRef.current < MOVE_COOLDOWN) return;

    const currentPos = playerPosRef.current;
    const dir = nextPlayerDirRef.current;
    const nextPos = { x: currentPos.x + dir.x, y: currentPos.y + dir.y };

    if (nextPos.x >= 0 && nextPos.x < GRID_W && nextPos.y >= 0 && nextPos.y < GRID_H) {
      // Degrade current tile
      const currTile = gridRef.current[currentPos.y][currentPos.x];
      if (currTile > 0) {
        gridRef.current[currentPos.y][currentPos.x] = (currTile - 1) as TileState;
        if (currTile === 2) playSound(crackSoundRef);
        setScore(s => s + 10);
      }

      playerPosRef.current = nextPos;
      lastPlayerMoveRef.current = time;
      nextPlayerDirRef.current = null;
      playSound(stepSoundRef);

      // Check for fall
      if (gridRef.current[nextPos.y][nextPos.x] === 0) {
        endGame(false);
      }
    }
  };

  const moveBot = (time: number) => {
    if (time - lastBotMoveRef.current < BOT_COOLDOWN) return;

    const botPos = botPosRef.current;
    const pPos = playerPosRef.current;

    // Greedy AI: Find valid moves (not water) that get closer to player
    const moves: Position[] = [
      { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
    ];

    let bestMove: Position | null = null;
    let minDistance = Infinity;
    const validMoves: Position[] = [];

    for (const m of moves) {
      const nx = botPos.x + m.x;
      const ny = botPos.y + m.y;
      if (nx >= 0 && nx < GRID_W && ny >= 0 && ny < GRID_H) {
        if (gridRef.current[ny][nx] > 0) { // Not water
          validMoves.push(m);
          const dist = Math.abs(nx - pPos.x) + Math.abs(ny - pPos.y);
          if (dist < minDistance) {
            minDistance = dist;
            bestMove = m;
          }
        }
      }
    }

    // If no best move found (or best move is bad?), just pick any valid move to survive
    const finalMove = bestMove || (validMoves.length > 0 ? validMoves[Math.floor(Math.random() * validMoves.length)] : null);

    if (finalMove) {
      const currTile = gridRef.current[botPos.y][botPos.x];
      if (currTile > 0) {
        gridRef.current[botPos.y][botPos.x] = (currTile - 1) as TileState;
      }
      botPosRef.current = { x: botPos.x + finalMove.x, y: botPos.y + finalMove.y };
      lastBotMoveRef.current = time;
    } else {
      // Bot has no valid moves, it falls in!
      endGame(true);
    }
  };

  const gameLoop = useCallback((time: number) => {
    if (gameState === 'playing') {
      movePlayer(time);
      moveBot(time);
      
      // We check for collision.
      // In this version, passing each other or landing on same tile doesn't do much
      // except eventually they run out of ice!
      
      setRenderCounter(c => c + 1); // Trigger re-render
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, gameLoop]);

  return (
    <GameShell
      title="Frost Runner"
      score={score}
      bestScore={bestScore}
      state={gameState}
      onPause={() => {}}
      onResume={startGame}
      onRestart={startGame}
      onExit={onExit}
      isMuted={isMuted}
      onToggleMute={() => setIsMuted(!isMuted)}
      instructions={[
        "Arrow Keys or D-pad to move",
        "Ice cracks when you step off it",
        "Cracked ice melts into water",
        "Don't fall in the water!",
        "Outlast the AI bot to win"
      ]}
    >
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-[#0A0F2E] p-4 relative overflow-hidden">
        
        {/* Game Grid */}
        <div className="relative bg-[#05386b]/40 p-3 rounded-2xl border-4 border-blue-400/30 shadow-[0_0_50px_rgba(0,240,255,0.1)] mt-8 sm:mt-0">
          <div 
            className="grid gap-1"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_W}, 1fr)`,
              width: 'min(90vw, 400px)',
              aspectRatio: `${GRID_W}/${GRID_H}`
            }}
          >
            {gridRef.current.map((row, y) => 
              row.map((tile, x) => (
                <div 
                  key={`${x}-${y}`} 
                  className={`relative rounded-lg transition-all duration-300 w-full h-full`}
                >
                  {/* Water */}
                  {tile === 0 && (
                    <div className="absolute inset-0 bg-[#0f5e9c]/50 rounded-lg animate-pulse" />
                  )}
                  {/* Cracked Ice */}
                  {tile === 1 && (
                    <div className="absolute inset-0 bg-blue-100/90 rounded-lg shadow-inner border border-blue-300 flex items-center justify-center">
                      {/* Cracked pattern lines */}
                      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-40">
                        <path d="M0,0 L100,100 M50,0 L50,100 M0,50 L100,50 M100,0 L0,100" stroke="#4a90e2" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                      </svg>
                    </div>
                  )}
                  {/* Solid Ice */}
                  {tile === 2 && (
                    <div className="absolute inset-0 bg-white rounded-lg shadow-[inset_0_-4px_0_rgba(150,200,255,0.5)] border border-blue-100 flex items-center justify-center">
                      <div className="w-full h-1/2 absolute top-0 left-0 bg-gradient-to-b from-white to-transparent rounded-t-lg opacity-80" />
                    </div>
                  )}

                  {/* Player Rendering */}
                  {playerPosRef.current?.x === x && playerPosRef.current?.y === y && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 scale-[1.4] sm:scale-[1.6] drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
                      🐧
                    </div>
                  )}

                  {/* Bot Rendering */}
                  {botPosRef.current?.x === x && botPosRef.current?.y === y && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 scale-[1.4] sm:scale-[1.6] drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
                      🤖
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile D-Pad Controls */}
        <div className="mt-8 grid grid-cols-3 gap-2 sm:hidden relative z-20 w-48">
          <div />
          <button 
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center active:bg-white/20 active:scale-95 transition-all text-white border border-white/20 select-none"
            onPointerDown={(e) => { e.preventDefault(); nextPlayerDirRef.current = { x: 0, y: -1 }; }}
          >
            <ArrowUp className="w-8 h-8" />
          </button>
          <div />
          <button 
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center active:bg-white/20 active:scale-95 transition-all text-white border border-white/20 select-none"
            onPointerDown={(e) => { e.preventDefault(); nextPlayerDirRef.current = { x: -1, y: 0 }; }}
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
          <button 
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center active:bg-white/20 active:scale-95 transition-all text-white border border-white/20 select-none"
            onPointerDown={(e) => { e.preventDefault(); nextPlayerDirRef.current = { x: 0, y: 1 }; }}
          >
            <ArrowDown className="w-8 h-8" />
          </button>
          <button 
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center active:bg-white/20 active:scale-95 transition-all text-white border border-white/20 select-none"
            onPointerDown={(e) => { e.preventDefault(); nextPlayerDirRef.current = { x: 1, y: 0 }; }}
          >
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>

      </div>
    </GameShell>
  );
};
