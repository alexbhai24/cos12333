import React, { useRef, useEffect, useCallback, useState } from 'react';
import { GameShell } from '../../components/games/GameShell';
import type { GameState } from '../types';

interface NeonMazeProps {
  onExit: () => void;
  onScoreSaved: (score: number) => void;
  bestScore: number;
  initialLevel: number;
  onLevelComplete: (level: number) => void;
}

const CELL = 28;
const COLS = 27;
const ROWS = 27;
const W = COLS * CELL; // 756
const H = ROWS * CELL; // 756

type Dir = { dx: number; dy: number };
const DIRS: Dir[] = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];

type DroneMode = 'hunter' | 'predictor' | 'roamer' | 'guardian';
type CellType = 0 | 1 | 2 | 3; // 0=wall, 1=path, 2=node, 3=power

interface Drone {
  id: number;
  cx: number;
  cy: number;
  mode: DroneMode;
  color: string;
  vulnerable: boolean;
  moveTimer: number;
  moveInterval: number;
  guardX: number;
  guardY: number;
}

function generateMaze(cols: number, rows: number): CellType[][] {
  const grid: CellType[][] = Array.from({ length: rows }, () => Array(cols).fill(0) as CellType[]);
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  function carve(cx: number, cy: number) {
    visited[cy][cx] = true;
    grid[cy][cx] = 2; // node
    const dirs = [...DIRS].sort(() => Math.random() - 0.5);
    for (const { dx, dy } of dirs) {
      const nx = cx + dx * 2;
      const ny = cy + dy * 2;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !visited[ny][nx]) {
        grid[cy + dy][cx + dx] = 1; // passage
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);

  // Carve 4 border escape exits (Top, Bottom, Left, Right)
  const midY = Math.floor(rows / 2);
  const midX = Math.floor(cols / 2);
  grid[midY][0] = 1;
  grid[midY][1] = 1;
  grid[midY][cols - 1] = 1;
  grid[midY][cols - 2] = 1;
  grid[0][midX] = 1;
  grid[1][midX] = 1;
  grid[rows - 1][midX] = 1;
  grid[rows - 2][midX] = 1;

  // Add power orbs in corners
  const powerSpots = [[1, 1], [cols - 2, 1], [1, rows - 2], [cols - 2, rows - 2]];
  for (const [px, py] of powerSpots) {
    grid[py][px] = 3;
  }

  return grid;
}

function countNodes(grid: CellType[][]): number {
  return grid.flat().filter(c => c === 2).length;
}

const DRONE_COLORS: Record<DroneMode, string> = {
  hunter: '#FF4444',
  predictor: '#FF8800',
  roamer: '#CC44FF',
  guardian: '#FF4488',
};
const DRONE_VULN_COLOR = '#4488FF';

const INSTRUCTIONS = [
  'Use Arrow keys, WASD, or the D-Pad to turn in the maze.',
  'Your orb moves continuously through open paths.',
  'Collect all glowing blue energy nodes to complete the level.',
  'Avoid enemy drones patrolling the maze!',
  'Collect purple Power Orbs to make drones vulnerable and hunt them (+200 pts).',
  'P = pause game, R = restart level.',
];

interface NeonMazeState {
  grid: CellType[][];
  playerX: number; playerY: number;
  currentDir: Dir;
  nextDir: Dir | null;
  drones: Drone[];
  nodesLeft: number;
  totalNodes: number;
  lives: number;
  score: number;
  overloadTimer: number;
  level: number;
  moveTimer: number;
  running: boolean;
  frameId: number;
  lastTime: number;
  invincible: boolean;
  invincibleTimer: number;
}

export const NeonMazeGame: React.FC<NeonMazeProps> = ({
  onExit, onScoreSaved, bestScore, initialLevel, onLevelComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<NeonMazeState | null>(null);

  const [gameState, setGameState] = useState<GameState>('how-to-play');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(initialLevel);
  const [isMuted, setIsMuted] = useState(false);

  const buildLevel = useCallback((lvl: number) => {
    const grid = generateMaze(COLS, ROWS);
    const totalNodes = countNodes(grid);

    const drones: Drone[] = (['hunter', 'predictor', 'roamer', 'guardian'] as DroneMode[]).map((mode, i) => {
      const positions = [[COLS - 2, 1], [1, ROWS - 2], [COLS - 2, ROWS - 2], [COLS / 2 | 0, ROWS / 2 | 0]];
      return {
        id: i,
        cx: positions[i][0],
        cy: positions[i][1],
        mode,
        color: DRONE_COLORS[mode],
        vulnerable: false,
        moveTimer: 0,
        moveInterval: Math.max(0.09, 0.20 - lvl * 0.015),
        guardX: positions[i][0],
        guardY: positions[i][1],
      };
    });

    // Clear spawn area for player
    grid[1][1] = 1;

    stateRef.current = {
      grid,
      playerX: 1, playerY: 1,
      currentDir: { dx: 1, dy: 0 },
      nextDir: null,
      drones,
      nodesLeft: totalNodes,
      totalNodes,
      lives: 3,
      score: stateRef.current?.score || 0,
      overloadTimer: 0,
      level: lvl,
      moveTimer: 0,
      running: true,
      frameId: 0,
      lastTime: 0,
      invincible: false,
      invincibleTimer: 0,
    };
    setLives(3);
    setLevel(lvl);
  }, []);

  const loseLife = useCallback(() => {
    const s = stateRef.current!;
    s.lives -= 1;
    setLives(s.lives);
    if (s.lives <= 0) {
      s.running = false;
      cancelAnimationFrame(s.frameId);
      onScoreSaved(s.score);
      setScore(s.score);
      setGameState('game-over');
    } else {
      s.playerX = 1; s.playerY = 1;
      s.invincible = true;
      s.invincibleTimer = 2.0;
    }
  }, [onScoreSaved]);

  const bfs = (grid: CellType[][], sx: number, sy: number, tx: number, ty: number): Dir | null => {
    const queue: { x: number; y: number; path: Dir[] }[] = [{ x: sx, y: sy, path: [] }];
    const seen = new Set<string>();
    seen.add(`${sx},${sy}`);
    while (queue.length) {
      const { x, y, path } = queue.shift()!;
      if (x === tx && y === ty) return path[0] || null;
      for (const d of DIRS) {
        const nx = x + d.dx; const ny = y + d.dy;
        const key = `${nx},${ny}`;
        if (!seen.has(key) && nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && grid[ny]?.[nx] !== 0) {
          seen.add(key);
          queue.push({ x: nx, y: ny, path: path.length ? path : [d] });
        }
      }
    }
    return null;
  };

  const moveDrone = (drone: Drone, s: NeonMazeState, dt: number) => {
    drone.moveTimer -= dt;
    if (drone.moveTimer > 0) return;
    drone.moveTimer = drone.moveInterval;

    const { grid, playerX, playerY, currentDir } = s;

    let targetX = playerX;
    let targetY = playerY;

    if (drone.vulnerable) {
      targetX = drone.cx + (drone.cx - playerX) * 3;
      targetY = drone.cy + (drone.cy - playerY) * 3;
    } else {
      switch (drone.mode) {
        case 'hunter':
          break;
        case 'predictor':
          targetX = playerX + currentDir.dx * 4;
          targetY = playerY + currentDir.dy * 4;
          break;
        case 'roamer':
          const choices = DIRS.filter(d => {
            const nx = drone.cx + d.dx; const ny = drone.cy + d.dy;
            return nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && grid[ny]?.[nx] !== 0;
          });
          if (choices.length) {
            const pick = choices[Math.floor(Math.random() * choices.length)];
            drone.cx += pick.dx; drone.cy += pick.dy;
          }
          return;
        case 'guardian':
          const distVal = Math.abs(drone.cx - playerX) + Math.abs(drone.cy - playerY);
          if (distVal >= 8) {
            targetX = drone.guardX; targetY = drone.guardY;
          }
          break;
      }
    }

    const dir = bfs(grid, drone.cx, drone.cy, targetX, targetY);
    if (dir) {
      let nx = drone.cx + dir.dx;
      let ny = drone.cy + dir.dy;
      
      // Wrap-around bounds support
      if (nx < 0) nx = COLS - 1;
      else if (nx >= COLS) nx = 0;
      if (ny < 0) ny = ROWS - 1;
      else if (ny >= ROWS) ny = 0;

      if (grid[ny]?.[nx] !== 0) {
        drone.cx = nx;
        drone.cy = ny;
      }
    }
  };

  const handleInputDirection = useCallback((dir: Dir) => {
    if (!stateRef.current) return;
    stateRef.current.nextDir = dir;
  }, []);

  const runLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s || !s.running) return;
    const ctx = canvas.getContext('2d')!;
    const now = performance.now();
    const dt = Math.min((now - (s.lastTime || now)) / 1000, 0.05);
    s.lastTime = now;

    // Grid Movement Loop
    s.moveTimer -= dt;
    if (s.moveTimer <= 0) {
      let moved = false;

      // 1. Check if nextDir turn is valid
      if (s.nextDir) {
        let nx = s.playerX + s.nextDir.dx;
        let ny = s.playerY + s.nextDir.dy;
        
        // Wrap-around bounds support
        if (nx < 0) nx = COLS - 1;
        else if (nx >= COLS) nx = 0;
        if (ny < 0) ny = ROWS - 1;
        else if (ny >= ROWS) ny = 0;

        if (s.grid[ny]?.[nx] !== 0) {
          s.playerX = nx;
          s.playerY = ny;
          s.currentDir = s.nextDir;
          s.nextDir = null; // Cleared turn
          s.moveTimer = 0.11;
          moved = true;
        }
      }

      // 2. If nextDir was not valid/requested, continue in currentDir
      if (!moved) {
        let nx = s.playerX + s.currentDir.dx;
        let ny = s.playerY + s.currentDir.dy;

        // Wrap-around bounds support
        if (nx < 0) nx = COLS - 1;
        else if (nx >= COLS) nx = 0;
        if (ny < 0) ny = ROWS - 1;
        else if (ny >= ROWS) ny = 0;

        if (s.grid[ny]?.[nx] !== 0) {
          s.playerX = nx;
          s.playerY = ny;
          s.moveTimer = 0.11;
          moved = true;
        }
      }

      // Handle item collection if moved
      if (moved) {
        const cx = s.playerX;
        const cy = s.playerY;
        // Node
        if (s.grid[cy][cx] === 2) {
          s.grid[cy][cx] = 1;
          s.score += 10;
          s.nodesLeft--;
          setScore(s.score);
          if (s.nodesLeft <= 0) {
            s.running = false;
            cancelAnimationFrame(s.frameId);
            onLevelComplete(s.level);
            onScoreSaved(s.score);
            setScore(s.score);
            return;
          }
        }
        // Power orb
        if (s.grid[cy][cx] === 3) {
          s.grid[cy][cx] = 1;
          s.score += 50;
          s.overloadTimer = 8;
          s.drones.forEach(d => { d.vulnerable = true; });
          setScore(s.score);
        }
      }
    }

    // Overload timer
    if (s.overloadTimer > 0) {
      s.overloadTimer -= dt;
      if (s.overloadTimer <= 0) {
        s.drones.forEach(d => { d.vulnerable = false; });
      }
    }

    // Invincibility timer
    if (s.invincible) {
      s.invincibleTimer -= dt;
      if (s.invincibleTimer <= 0) s.invincible = false;
    }

    // Drones AI movement
    for (const drone of s.drones) moveDrone(drone, s, dt);

    // Collision check
    if (!s.invincible) {
      for (const drone of s.drones) {
        if (drone.cx === s.playerX && drone.cy === s.playerY) {
          if (drone.vulnerable) {
            s.score += 200;
            setScore(s.score);
            drone.cx = drone.guardX; drone.cy = drone.guardY;
            drone.vulnerable = false;
          } else {
            loseLife();
            return;
          }
        }
      }
    }

    // ─── DRAW MAZE CANVAS ───
    ctx.fillStyle = '#010712';
    ctx.fillRect(0, 0, W, H);

    // Grid Cells
    for (let cy = 0; cy < ROWS; cy++) {
      for (let cx = 0; cx < COLS; cx++) {
        const cell = s.grid[cy][cx];
        const px = cx * CELL; const py = cy * CELL;
        if (cell === 0) {
          ctx.fillStyle = '#091526';
          ctx.fillRect(px, py, CELL, CELL);
          ctx.strokeStyle = '#0F223D';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(px, py, CELL, CELL);
        } else {
          // Node
          if (cell === 2) {
            ctx.save();
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#00F0FF';
            ctx.beginPath();
            ctx.arc(px + CELL / 2, py + CELL / 2, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          // Power orb
          if (cell === 3) {
            ctx.save();
            ctx.shadowColor = '#AA44FF';
            ctx.shadowBlur = 16;
            ctx.fillStyle = '#AA44FF';
            ctx.beginPath();
            ctx.arc(px + CELL / 2, py + CELL / 2, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }
    }

    // Drones
    for (const drone of s.drones) {
      const px = drone.cx * CELL + CELL / 2;
      const py = drone.cy * CELL + CELL / 2;
      const color = drone.vulnerable
        ? (s.overloadTimer < 2 && Math.floor(s.overloadTimer * 4) % 2 === 0 ? DRONE_VULN_COLOR : '#FFFFFF')
        : drone.color;
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py - 3, 10, Math.PI, 0);
      ctx.lineTo(px + 10, py + 7);
      ctx.lineTo(px + 7, py + 4);
      ctx.lineTo(px + 4, py + 7);
      ctx.lineTo(px + 1, py + 4);
      ctx.lineTo(px - 1, py + 7);
      ctx.lineTo(px - 4, py + 4);
      ctx.lineTo(px - 7, py + 7);
      ctx.lineTo(px - 10, py + 7);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(px - 3.5, py - 3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(px + 3.5, py - 3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // Player (Bone Orb)
    const px = s.playerX * CELL + CELL / 2;
    const py = s.playerY * CELL + CELL / 2;
    const flash = s.invincible && Math.floor(s.invincibleTimer * 8) % 2 === 0;
    if (!flash) {
      ctx.save();
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#00F0FF';
      ctx.beginPath();
      ctx.arc(px, py, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(px - 3, py - 3, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Overload Screen Glow
    if (s.overloadTimer > 0) {
      ctx.fillStyle = `rgba(170,68,255,${0.12 + 0.05 * Math.sin(Date.now() / 200)})`;
      ctx.fillRect(0, 0, W, H);
    }

    s.frameId = requestAnimationFrame(runLoop);
  }, [loseLife, onScoreSaved, onLevelComplete]);

  const startGame = useCallback((lvl: number = level) => {
    buildLevel(lvl);
    setGameState('playing');
  }, [buildLevel, level]);

  useEffect(() => {
    if (gameState === 'playing') {
      if (!stateRef.current) buildLevel(level);
      stateRef.current!.running = true;
      stateRef.current!.lastTime = performance.now();
      stateRef.current!.frameId = requestAnimationFrame(runLoop);
    }
    return () => { if (stateRef.current) cancelAnimationFrame(stateRef.current.frameId); };
  }, [gameState, runLoop, buildLevel, level]);

  // Keyboard input (Window listener for WASD + Arrows)
  useEffect(() => {
    if (gameState !== 'playing') return;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      let dir: Dir | null = null;
      if (e.key === 'ArrowUp' || key === 'w') dir = { dx: 0, dy: -1 };
      else if (e.key === 'ArrowDown' || key === 's') dir = { dx: 0, dy: 1 };
      else if (e.key === 'ArrowLeft' || key === 'a') dir = { dx: -1, dy: 0 };
      else if (e.key === 'ArrowRight' || key === 'd') dir = { dx: 1, dy: 0 };

      if (dir) {
        e.preventDefault();
        handleInputDirection(dir);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameState, handleInputDirection]);

  const handlePause = () => { if (stateRef.current) stateRef.current.running = false; setGameState('paused'); };
  const handleResume = () => {
    if (stateRef.current) {
      stateRef.current.running = true;
      stateRef.current.lastTime = performance.now();
      stateRef.current.frameId = requestAnimationFrame(runLoop);
    }
    setGameState('playing');
  };

  return (
    <GameShell
      title={`Neon Maze Chase — Level ${level}`}
      score={score}
      bestScore={bestScore}
      lives={lives}
      maxLives={3}
      state={gameState}
      onPause={handlePause}
      onResume={gameState === 'how-to-play' ? () => startGame(level) : handleResume}
      onRestart={() => startGame(level)}
      onExit={onExit}
      onToggleMute={() => setIsMuted(m => !m)}
      isMuted={isMuted}
      instructions={INSTRUCTIONS}
    >
      <div className="w-full h-full flex flex-col items-center justify-center relative p-1 sm:p-2">
        <div className="relative flex-1 w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="max-w-full max-h-full aspect-square object-contain rounded-2xl border-2 border-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.3)] bg-[#010712]"
            aria-label="Neon Maze Chase game canvas"
          />
        </div>
      </div>
    </GameShell>
  );
};
