import React, { useRef, useEffect, useCallback, useState } from 'react';
import { GameShell } from '../../components/games/GameShell';
import type { GameState } from '../types';

interface BrickBreakerProps {
  onExit: () => void;
  onScoreSaved: (score: number) => void;
  bestScore: number;
}

const W = 480;
const H = 600;
const PADDLE_W = 100;
const PADDLE_H = 14;
const BALL_R = 7;

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  hits: number;
  maxHits: number;
  color: string;
}

interface BrickBreakerState {
  paddleX: number;
  ballX: number;
  ballY: number;
  ballVx: number;
  ballVy: number;
  bricks: Brick[];
  score: number;
  level: number;
  lives: number;
  running: boolean;
  frameId: number;
  lastTime: number;
}

const INSTRUCTIONS = [
  'Move your mouse or slide your finger to move the red paddle.',
  'Bounce the energy ball to destroy the cyber bricks at the top.',
  'Pink bricks require 1 hit, purple bricks require 2 hits.',
  'Destroy all bricks to advance to the next level (infinite scaling).',
  'P = pause, R = restart.',
];

export const BrickBreakerGame: React.FC<BrickBreakerProps> = ({ onExit, onScoreSaved, bestScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<BrickBreakerState | null>(null);

  const [gameState, setGameState] = useState<GameState>('how-to-play');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [isMuted, setIsMuted] = useState(false);

  const generateBricks = (lvl: number): Brick[] => {
    const bricksList: Brick[] = [];
    const rows = Math.min(4 + Math.floor(lvl / 2), 8);
    const cols = 6;
    const padding = 8;
    const brickW = (W - padding * (cols + 1)) / cols;
    const brickH = 20;

    const colors = ['#FF6565', '#FF7BAC', '#8B5CF6', '#00F0FF'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Leave some random gaps to make layout interesting
        if (lvl > 1 && Math.random() < 0.15) continue;

        const maxHits = r % 2 === 0 ? 2 : 1;
        const color = colors[r % colors.length];

        bricksList.push({
          x: padding + c * (brickW + padding),
          y: 60 + r * (brickH + padding),
          w: brickW,
          h: brickH,
          hits: 0,
          maxHits,
          color,
        });
      }
    }
    return bricksList;
  };

  const initGame = useCallback((lvl = 1) => {
    stateRef.current = {
      paddleX: (W - PADDLE_W) / 2,
      ballX: W / 2,
      ballY: H - 100,
      ballVx: 180 + lvl * 15,
      ballVy: -220 - lvl * 15,
      bricks: generateBricks(lvl),
      score: stateRef.current?.score || 0,
      level: lvl,
      lives: 3,
      running: true,
      frameId: 0,
      lastTime: 0,
    };
    setLevel(lvl);
    setLives(3);
    setScore(stateRef.current.score);
  }, []);

  const runLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s || !s.running) return;
    const ctx = canvas.getContext('2d')!;
    const now = performance.now();
    const dt = Math.min((now - (s.lastTime || now)) / 1000, 0.05);
    s.lastTime = now;

    // Move Ball
    s.ballX += s.ballVx * dt;
    s.ballY += s.ballVy * dt;

    // Collision: Left/Right Walls
    if (s.ballX - BALL_R <= 0) {
      s.ballX = BALL_R;
      s.ballVx = -s.ballVx;
    } else if (s.ballX + BALL_R >= W) {
      s.ballX = W - BALL_R;
      s.ballVx = -s.ballVx;
    }

    // Collision: Ceiling
    if (s.ballY - BALL_R <= 0) {
      s.ballY = BALL_R;
      s.ballVy = -s.ballVy;
    }

    // Collision: Paddle
    const paddleTop = H - 40;
    if (
      s.ballY + BALL_R >= paddleTop &&
      s.ballY - BALL_R <= paddleTop + PADDLE_H &&
      s.ballX >= s.paddleX &&
      s.ballX <= s.paddleX + PADDLE_W
    ) {
      s.ballY = paddleTop - BALL_R;
      
      // Calculate dynamic bounce angle based on where ball hits paddle
      const hitPoint = (s.ballX - (s.paddleX + PADDLE_W / 2)) / (PADDLE_W / 2);
      const speed = Math.sqrt(s.ballVx * s.ballVx + s.ballVy * s.ballVy);
      s.ballVx = hitPoint * speed * 0.85;
      s.ballVy = -Math.sqrt(Math.max(speed * speed - s.ballVx * s.ballVx, 10000));
    }

    // Collision: Bricks
    for (let i = s.bricks.length - 1; i >= 0; i--) {
      const b = s.bricks[i];
      if (
        s.ballX + BALL_R >= b.x &&
        s.ballX - BALL_R <= b.x + b.w &&
        s.ballY + BALL_R >= b.y &&
        s.ballY - BALL_R <= b.y + b.h
      ) {
        // Determine collision side to reverse velocity
        const fromLeft = s.ballX < b.x;
        const fromRight = s.ballX > b.x + b.w;
        const fromTop = s.ballY < b.y;
        
        if (fromLeft || fromRight) {
          s.ballVx = -s.ballVx;
        } else {
          s.ballVy = -s.ballVy;
        }

        b.hits += 1;
        s.score += 50;
        setScore(s.score);

        if (b.hits >= b.maxHits) {
          s.bricks.splice(i, 1);
        }
        break;
      }
    }

    // Check Win Level
    if (s.bricks.length === 0) {
      s.running = false;
      cancelAnimationFrame(s.frameId);
      onScoreSaved(s.score);
      const nextLvl = s.level + 1;
      s.level = nextLvl;
      initGame(nextLvl);
      s.running = true;
      s.lastTime = performance.now();
      s.frameId = requestAnimationFrame(runLoop);
      return;
    }

    // Check Lose Life (Offscreen bottom)
    if (s.ballY - BALL_R > H) {
      s.lives -= 1;
      setLives(s.lives);
      if (s.lives <= 0) {
        s.running = false;
        cancelAnimationFrame(s.frameId);
        onScoreSaved(s.score);
        setGameState('game-over');
        return;
      } else {
        // Reset Ball position
        s.ballX = W / 2;
        s.ballY = H - 100;
        s.ballVx = 180 + s.level * 15;
        s.ballVy = -220 - s.level * 15;
      }
    }

    // ─── DRAW CANVAS ───
    ctx.clearRect(0, 0, W, H);

    // Grid backdrop
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Draw Bricks
    for (const b of s.bricks) {
      const remaining = b.maxHits - b.hits;
      ctx.save();
      ctx.fillStyle = b.color;
      
      // Glow effect for bricks
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;
      
      // Bricks rounded rectangles
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.w, b.h, 6);
      ctx.fill();

      // Border indicator
      if (remaining > 1) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw Paddle
    ctx.save();
    const paddleGradient = ctx.createLinearGradient(s.paddleX, paddleTop, s.paddleX + PADDLE_W, paddleTop);
    paddleGradient.addColorStop(0, '#FF3366');
    paddleGradient.addColorStop(0.5, '#FF6565');
    paddleGradient.addColorStop(1, '#FF3366');
    ctx.fillStyle = paddleGradient;
    ctx.shadowColor = '#FF3366';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(s.paddleX, paddleTop, PADDLE_W, PADDLE_H, PADDLE_H / 2);
    ctx.fill();
    ctx.restore();

    // Draw Ball
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Vector/Trail direction pointer
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(s.ballX, s.ballY);
    const speed = Math.sqrt(s.ballVx * s.ballVx + s.ballVy * s.ballVy);
    ctx.lineTo(s.ballX + (s.ballVx / speed) * 35, s.ballY + (s.ballVy / speed) * 35);
    ctx.stroke();

    s.frameId = requestAnimationFrame(runLoop);
  }, [initGame, onScoreSaved]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;
    const rect = canvas.getBoundingClientRect();
    const rootX = e.clientX - rect.left;
    const scaleX = W / rect.width;
    const mouseX = rootX * scaleX;
    s.paddleX = Math.max(0, Math.min(W - PADDLE_W, mouseX - PADDLE_W / 2));
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
    s.paddleX = Math.max(0, Math.min(W - PADDLE_W, touchX - PADDLE_W / 2));
  };

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
      title={`Cyber Brick Breaker — Lvl ${level}`}
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
          className="max-w-full max-h-[75vh] bg-[#030718] rounded-xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] cursor-none"
        />
      </div>
    </GameShell>
  );
};
