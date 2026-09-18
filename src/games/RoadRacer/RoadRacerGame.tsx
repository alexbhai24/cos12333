import React, { useRef, useEffect, useCallback, useState } from 'react';
import { GameShell } from '../../components/games/GameShell';
import type { GameState } from '../types';

interface RoadRacerProps {
  onExit: () => void;
  onScoreSaved: (score: number) => void;
  bestScore: number;
}

const W = 450;
const H = 600;
const CAR_W = 34;
const CAR_H = 58;

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  type: 'cone' | 'barrier';
}

interface RoadRacerState {
  carX: number;
  obstacles: Obstacle[];
  distance: number;
  level: number;
  lives: number;
  spawnTimer: number;
  invincibleTimer: number;
  running: boolean;
  frameId: number;
  lastTime: number;
}

const INSTRUCTIONS = [
  'Use Left & Right Arrow keys, WASD, or move your mouse to steer the red racer.',
  'Avoid colliding with orange cones and highway barriers.',
  'Survival distance increases your speed and score.',
  'Level up infinitely as speed scales up over time!',
  'P = pause, R = restart.',
];

export const RoadRacerGame: React.FC<RoadRacerProps> = ({ onExit, onScoreSaved, bestScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<RoadRacerState | null>(null);

  const [gameState, setGameState] = useState<GameState>('how-to-play');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [isMuted, setIsMuted] = useState(false);

  const initGame = useCallback((lvl = 1) => {
    stateRef.current = {
      carX: (W - CAR_W) / 2,
      obstacles: [],
      distance: 0,
      level: lvl,
      lives: 3,
      spawnTimer: 0,
      invincibleTimer: 0,
      running: true,
      frameId: 0,
      lastTime: 0,
    };
    setLevel(lvl);
    setLives(3);
    setScore(0);
  }, []);

  const spawnObstacle = (s: RoadRacerState) => {
    const minX = 60;
    const maxX = W - 60 - CAR_W;
    const x = minX + Math.random() * (maxX - minX);
    const speed = 250 + s.level * 35 + Math.random() * 40;
    const type = Math.random() < 0.4 ? 'barrier' : 'cone';

    s.obstacles.push({
      x,
      y: -80,
      w: type === 'barrier' ? 56 : 30,
      h: type === 'barrier' ? 32 : 36,
      speed,
      type,
    });
  };

  const runLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s || !s.running) return;
    const ctx = canvas.getContext('2d')!;
    const now = performance.now();
    const dt = Math.min((now - (s.lastTime || now)) / 1000, 0.05);
    s.lastTime = now;

    // Survived distance scoring
    s.distance += dt * (10 + s.level * 2);
    const calculatedScore = Math.floor(s.distance * 10);
    setScore(calculatedScore);

    // Speed / Level scaling
    const targetLevel = 1 + Math.floor(calculatedScore / 1500);
    if (targetLevel > s.level) {
      s.level = targetLevel;
      setLevel(s.level);
    }

    // Invincibility decrement
    if (s.invincibleTimer > 0) {
      s.invincibleTimer -= dt;
    }

    // Spawn Obstacles
    s.spawnTimer -= dt;
    if (s.spawnTimer <= 0) {
      spawnObstacle(s);
      s.spawnTimer = Math.max(0.65, 1.8 - s.level * 0.12 - Math.random() * 0.4);
    }

    // Move & Clean Obstacles
    for (let i = s.obstacles.length - 1; i >= 0; i--) {
      const o = s.obstacles[i];
      o.y += o.speed * dt;

      // Clean up out of bounds
      if (o.y > H) {
        s.obstacles.splice(i, 1);
        continue;
      }

      // Collision Check: Player Car
      const carY = H - 100;
      if (
        s.invincibleTimer <= 0 &&
        s.carX + CAR_W - 3 >= o.x &&
        s.carX + 3 <= o.x + o.w &&
        carY + CAR_H - 3 >= o.y &&
        carY + 3 <= o.y + o.h
      ) {
        // Collided!
        s.lives -= 1;
        setLives(s.lives);
        s.invincibleTimer = 1.8; // Invincible flash timer
        s.obstacles.splice(i, 1);

        if (s.lives <= 0) {
          s.running = false;
          cancelAnimationFrame(s.frameId);
          onScoreSaved(calculatedScore);
          setGameState('game-over');
          return;
        }
      }
    }

    // ─── DRAW HIGHWAY ───
    ctx.clearRect(0, 0, W, H);

    // 1. Asphalt Road
    ctx.fillStyle = '#1B1E29';
    ctx.fillRect(40, 0, W - 80, H);

    // 2. Dirt Shoulders
    ctx.fillStyle = '#C29864'; // Sandy shoulder
    ctx.fillRect(0, 0, 40, H);
    ctx.fillRect(W - 40, 0, 40, H);

    // 3. Green Trees (Green patches on shoulders)
    ctx.fillStyle = '#22C55E';
    const scrollOffset = (s.distance * 20) % 120;
    for (let y = -120; y < H + 120; y += 120) {
      const cy = y + scrollOffset;
      // Left trees
      ctx.beginPath();
      ctx.arc(15, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      // Right trees
      ctx.beginPath();
      ctx.arc(W - 15, cy, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. White Road Lane Dividers (scrolling)
    ctx.fillStyle = '#FFFFFF';
    const laneOffset = (s.distance * 35) % 80;
    for (let y = -80; y < H + 80; y += 80) {
      const cy = y + laneOffset;
      // Lane 1 divider (1/3 road width)
      ctx.fillRect(160, cy, 5, 30);
      // Lane 2 divider (2/3 road width)
      ctx.fillRect(280, cy, 5, 30);
    }

    // 5. Draw Obstacles (Cones or Barriers)
    for (const o of s.obstacles) {
      ctx.save();
      if (o.type === 'cone') {
        // Orange road cone
        ctx.fillStyle = '#F97316';
        ctx.shadowColor = '#F97316';
        ctx.shadowBlur = 6;
        
        ctx.beginPath();
        ctx.moveTo(o.x + o.w / 2, o.y);
        ctx.lineTo(o.x + o.w, o.y + o.h);
        ctx.lineTo(o.x, o.y + o.h);
        ctx.closePath();
        ctx.fill();
        
        // White stripe
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(o.x + o.w * 0.3, o.y + o.h * 0.45, o.w * 0.4, o.h * 0.2);
        
        // Base
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(o.x - 2, o.y + o.h - 5, o.w + 4, 5);
      } else {
        // Grey barrier
        ctx.fillStyle = '#475569';
        ctx.shadowColor = '#475569';
        ctx.shadowBlur = 6;
        ctx.fillRect(o.x, o.y, o.w, o.h);
        
        // Yellow/Black diagonal stripes
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let sx = 0; sx < o.w; sx += 12) {
          ctx.moveTo(o.x + sx, o.y);
          ctx.lineTo(o.x + sx + 6, o.y + o.h);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // 6. Draw Player Red Racer Car
    const carY = H - 100;
    const drawCar = s.invincibleTimer <= 0 || Math.floor(s.distance * 12) % 2 === 0;
    if (drawCar) {
      ctx.save();
      // Cyber red glow
      ctx.shadowColor = '#FF3366';
      ctx.shadowBlur = 10;

      // Wheels
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(s.carX - 3, carY + 8, 4, 12);
      ctx.fillRect(s.carX + CAR_W - 1, carY + 8, 4, 12);
      ctx.fillRect(s.carX - 3, carY + CAR_H - 18, 4, 12);
      ctx.fillRect(s.carX + CAR_W - 1, carY + CAR_H - 18, 4, 12);

      // Car Body
      ctx.fillStyle = '#FF2255';
      ctx.beginPath();
      ctx.roundRect(s.carX, carY, CAR_W, CAR_H, 8);
      ctx.fill();

      // Cyber spoiler decoration
      ctx.fillStyle = '#FF99AA';
      ctx.fillRect(s.carX + 3, carY, CAR_W - 6, 4);

      // Windshield
      ctx.fillStyle = '#0891B2';
      ctx.beginPath();
      ctx.roundRect(s.carX + 5, carY + 16, CAR_W - 10, 14, 4);
      ctx.fill();

      // Yellow neon headlights
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(s.carX + 4, carY + CAR_H - 4, 6, 3);
      ctx.fillRect(s.carX + CAR_W - 10, carY + CAR_H - 4, 6, 3);

      ctx.restore();
    }

    s.frameId = requestAnimationFrame(runLoop);
  }, [onScoreSaved]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;
    const rect = canvas.getBoundingClientRect();
    const rootX = e.clientX - rect.left;
    const scaleX = W / rect.width;
    const mouseX = rootX * scaleX;
    // Keep car strictly inside the road asphalt margins (40px on left/right)
    s.carX = Math.max(45, Math.min(W - 45 - CAR_W, mouseX - CAR_W / 2));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const rootX = touch.clientX - rect.left;
    const scaleX = W / rect.width;
    const touchX = rootX * scaleX;
    s.carX = Math.max(45, Math.min(W - 45 - CAR_W, touchX - CAR_W / 2));
  };

  // Keyboard steer fallback
  useEffect(() => {
    if (gameState !== 'playing') return;
    const onKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        s.carX = Math.max(45, s.carX - 25);
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        s.carX = Math.min(W - 45 - CAR_W, s.carX + 25);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      stateRef.current.running = true;
      stateRef.current.lastTime = performance.now();
      stateRef.current.frameId = requestAnimationFrame(runLoop);
    }
    return () => {
      if (stateRef.current) {
        stateRef.current.running = false;
        cancelAnimationFrame(stateRef.current.frameId);
      }
    };
  }, [gameState, runLoop]);

  const handlePause = () => {
    if (stateRef.current) stateRef.current.running = false;
    setGameState('paused');
  };

  const handleResume = () => {
    setGameState('playing');
  };

  const startGame = () => {
    initGame(1);
    setGameState('playing');
  };

  return (
    <GameShell
      title={`Neon Road Racer — Level ${level}`}
      score={score}
      bestScore={bestScore}
      lives={lives}
      maxLives={3}
      state={gameState}
      onPause={handlePause}
      onResume={gameState === 'how-to-play' ? startGame : handleResume}
      onRestart={() => initGame(level)}
      onExit={onExit}
      onToggleMute={() => setIsMuted(m => !m)}
      isMuted={isMuted}
      instructions={INSTRUCTIONS}
    >
      <div className="w-full h-full flex flex-col items-center justify-center relative p-2 bg-[#020511] rounded-2xl overflow-hidden select-none">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="max-w-full max-h-[75vh] bg-[#030718] rounded-xl border border-emerald-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)] cursor-none"
        />
      </div>
    </GameShell>
  );
};
