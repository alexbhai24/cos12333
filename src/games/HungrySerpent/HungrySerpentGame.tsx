import React, { useRef, useEffect, useCallback, useState } from 'react';
import { GameShell } from '../../components/games/GameShell';
import type { GameState } from '../types';

interface HungrySerpentProps {
  userId: string;
  userName: string;
  onExit: () => void;
  onScoreSaved: (score: number) => void;
  bestScore: number;
}

const CANVAS_W = 800;
const CANVAS_H = 600;
const ORB_RADIUS = 5;
const PLAYER_RADIUS = 7;
const SPEED_BASE = 150; // px/s
const BOOST_DRAIN = 50; // units/s
const BOOST_MULTIPLIER = 1.9;
const BOOST_MAX = 100;
const POWER_DURATION = 8000; // ms


type Vec2 = { x: number; y: number };
type PowerUpType = 'shield' | 'magnet' | 'multiplier';

interface Orb {
  x: number;
  y: number;
  value: number;
  color: string;
}

interface PowerUp {
  x: number;
  y: number;
  type: PowerUpType;
  expiresAt?: number; // when active on player
}

interface Segment { x: number; y: number; }

interface Snake {
  id: number;
  segments: Segment[];
  angle: number;
  speed: number;
  color: string;
  alive: boolean;
  score: number;
  isPlayer: boolean;
  boostEnergy: number;
  isBoosting: boolean;
  powerUps: { type: PowerUpType; expiresAt: number }[];
}

function rnd(min: number, max: number) { return min + Math.random() * (max - min); }

function spawnOrb(color = '#00F0FF'): Orb {
  return { x: rnd(20, CANVAS_W - 20), y: rnd(20, CANVAS_H - 20), value: 10, color };
}

function angleDiff(a: number, b: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function dist(a: Vec2, b: Vec2) { return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2); }

const BOT_COLORS = ['#FF4488', '#FF8800', '#AA44FF'];
const POWER_ICONS: Record<PowerUpType, string> = { shield: '🛡️', magnet: '🧲', multiplier: '⚡' };
const POWER_COLORS: Record<PowerUpType, string> = { shield: '#00FFCC', magnet: '#CC44FF', multiplier: '#FFD700' };

const INSTRUCTIONS = [
  'Move your mouse to steer the serpent.',
  'Collect glowing orbs to grow longer and earn score.',
  'Hold Space or Left-Click to boost speed (costs energy).',
  'Avoid hitting other serpents\' bodies.',
  'Power-ups: 🛡️ Shield, 🧲 Magnet (auto-collects nearby orbs), ⚡ Score x2.',
  'Eliminated serpents drop extra orbs!',
];

export const HungrySerpentGame: React.FC<HungrySerpentProps> = ({
  onExit, onScoreSaved, bestScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    snakes: Snake[];
    orbs: Orb[];
    powerUps: PowerUp[];
    mouseAngle: number;
    boosting: boolean;
    lastTime: number;
    score: number;
    running: boolean;
    multiplier: number;
    frameId: number;
  } | null>(null);

  const [gameState, setGameState] = useState<GameState>('how-to-play');
  const [score, setScore] = useState(0);
  const [_boostEnergy, setBoostEnergy] = useState(BOOST_MAX);
  const [activePowerUps, setActivePowerUps] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const initGame = useCallback(() => {
    const player: Snake = {
      id: 0,
      segments: Array.from({ length: 10 }, (_, i) => ({ x: CANVAS_W / 2 - i * 8, y: CANVAS_H / 2 })),
      angle: 0,
      speed: SPEED_BASE,
      color: '#00F0FF',
      alive: true,
      score: 0,
      isPlayer: true,
      boostEnergy: BOOST_MAX,
      isBoosting: false,
      powerUps: [],
    };

    const bots: Snake[] = BOT_COLORS.map((color, i) => ({
      id: i + 1,
      segments: Array.from({ length: 10 }, (_, j) => ({
        x: rnd(50, CANVAS_W - 50) - j * 8,
        y: rnd(50, CANVAS_H - 50),
      })),
      angle: rnd(0, Math.PI * 2),
      speed: SPEED_BASE * 0.85,
      color,
      alive: true,
      score: 0,
      isPlayer: false,
      boostEnergy: BOOST_MAX,
      isBoosting: false,
      powerUps: [],
    }));

    const orbs: Orb[] = Array.from({ length: 60 }, () => spawnOrb());
    const powerUps: PowerUp[] = [];

    stateRef.current = {
      snakes: [player, ...bots],
      orbs,
      powerUps,
      mouseAngle: 0,
      boosting: false,
      lastTime: 0,
      score: 0,
      running: true,
      multiplier: 1,
      frameId: 0,
    };

    setScore(0);
    setBoostEnergy(BOOST_MAX);
    setActivePowerUps([]);
  }, []);

  const gameOver = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    s.running = false;
    cancelAnimationFrame(s.frameId);
    const finalScore = s.score;
    onScoreSaved(finalScore);
    setGameState('game-over');
  }, [onScoreSaved]);

  const runLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s || !s.running) return;
    const ctx = canvas.getContext('2d')!;
    const now = performance.now();
    const dt = Math.min((now - (s.lastTime || now)) / 1000, 0.05);
    s.lastTime = now;
    const now_ms = Date.now();

    // ── Update player angle ──
    const player = s.snakes[0];
    if (player.alive) {
      const targetAngle = s.mouseAngle;
      const diff = angleDiff(player.angle, targetAngle);
      const turnRate = 3.5;
      player.angle += Math.sign(diff) * Math.min(Math.abs(diff), turnRate * dt);

      // Boost
      if (s.boosting && player.boostEnergy > 0) {
        player.isBoosting = true;
        player.boostEnergy = Math.max(0, player.boostEnergy - BOOST_DRAIN * dt);
      } else {
        player.isBoosting = false;
        player.boostEnergy = Math.min(BOOST_MAX, player.boostEnergy + BOOST_DRAIN * 0.3 * dt);
      }
      setBoostEnergy(player.boostEnergy);

      // Check multiplier power-up
      const mult = player.powerUps.find(p => p.type === 'multiplier' && p.expiresAt > now_ms);
      s.multiplier = mult ? 2 : 1;
    }

    // ── Update bot angles (simple avoidance + wander) ──
    for (const bot of s.snakes.filter(sn => !sn.isPlayer && sn.alive)) {
      const head = bot.segments[0];
      // Look for nearest orb
      let bestOrb: Orb | null = null;
      let bestDist = Infinity;
      for (const orb of s.orbs) {
        const d = dist(head, orb);
        if (d < bestDist) { bestDist = d; bestOrb = orb; }
      }
      if (bestOrb) {
        const targetAngle = Math.atan2(bestOrb.y - head.y, bestOrb.x - head.x);
        const diff = angleDiff(bot.angle, targetAngle);
        bot.angle += Math.sign(diff) * Math.min(Math.abs(diff), 2.5 * dt);
      }
      // Wall avoidance
      const margin = 40;
      if (head.x < margin) bot.angle = angleDiff(bot.angle, 0) > 0 ? bot.angle : 0;
      if (head.x > CANVAS_W - margin) bot.angle = Math.PI;
      if (head.y < margin) bot.angle = Math.PI / 2;
      if (head.y > CANVAS_H - margin) bot.angle = -Math.PI / 2;
    }

    // ── Move snakes ──
    for (const snake of s.snakes.filter(sn => sn.alive)) {
      const speed = snake.isPlayer && snake.isBoosting && snake.boostEnergy > 0
        ? snake.speed * BOOST_MULTIPLIER
        : snake.speed;
      const head = snake.segments[0];
      const newHead = {
        x: head.x + Math.cos(snake.angle) * speed * dt,
        y: head.y + Math.sin(snake.angle) * speed * dt,
      };

      // Wall collision
      if (newHead.x < 0 || newHead.x > CANVAS_W || newHead.y < 0 || newHead.y > CANVAS_H) {
        if (snake.isPlayer) { gameOver(); return; }
        snake.alive = false;
        // Drop orbs
        snake.segments.forEach((_seg, i) => {
          if (i % 3 === 0) s.orbs.push(spawnOrb(snake.color));
        });
        continue;
      }

      // Unshift and pop (or grow if just ate)
      snake.segments.unshift(newHead);
      snake.segments.pop();
    }

    // ── Player orb collection ──
    if (player.alive) {
      const head = player.segments[0];
      const hasMagnet = player.powerUps.some(p => p.type === 'magnet' && p.expiresAt > now_ms);
      const magnetRange = hasMagnet ? 100 : 0;

      s.orbs = s.orbs.filter(orb => {
        const d = dist(head, orb);
        if (d < PLAYER_RADIUS + ORB_RADIUS + magnetRange) {
          const earned = orb.value * s.multiplier;
          s.score += earned;
          player.score += earned;
          // Grow
          const tail = player.segments[player.segments.length - 1];
          player.segments.push({ ...tail });
          return false;
        }
        return true;
      });

      // Power-up collection
      s.powerUps = s.powerUps.filter(pu => {
        if (!pu.expiresAt && dist(head, pu) < PLAYER_RADIUS + 14) {
          player.powerUps = player.powerUps.filter(p => p.type !== pu.type);
          player.powerUps.push({ type: pu.type, expiresAt: now_ms + POWER_DURATION });
          return false;
        }
        return true;
      });

      // Update active power-ups display
      const active = player.powerUps.filter(p => p.expiresAt > now_ms).map(p => POWER_ICONS[p.type]);
      setActivePowerUps(active);
    }

    // ── Refill orbs & spawn power-ups ──
    while (s.orbs.length < 60) s.orbs.push(spawnOrb());
    if (s.powerUps.length < 3 && Math.random() < 0.005) {
      const types: PowerUpType[] = ['shield', 'magnet', 'multiplier'];
      s.powerUps.push({
        x: rnd(30, CANVAS_W - 30),
        y: rnd(30, CANVAS_H - 30),
        type: types[Math.floor(Math.random() * types.length)],
      });
    }

    // ── Snake vs snake collision ──
    if (player.alive) {
      const head = player.segments[0];
      const hasShield = player.powerUps.some(p => p.type === 'shield' && p.expiresAt > now_ms);

      for (const other of s.snakes) {
        if (other === player) {
          // Self-collision (skip first 10 segs)
          for (let i = 10; i < player.segments.length; i++) {
            if (dist(head, player.segments[i]) < PLAYER_RADIUS * 1.5) {
              if (!hasShield) { gameOver(); return; }
            }
          }
        } else if (other.alive) {
          for (let i = 1; i < other.segments.length; i++) {
            if (dist(head, other.segments[i]) < PLAYER_RADIUS + PLAYER_RADIUS) {
              if (!hasShield) { gameOver(); return; }
            }
          }
        }
      }
    }

    setScore(s.score);

    // ─────────────────── DRAW ───────────────────
    ctx.fillStyle = '#010811';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid
    ctx.strokeStyle = 'rgba(0,240,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
    }
    for (let y = 0; y < CANVAS_H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
    }

    // Orbs
    for (const orb of s.orbs) {
      ctx.save();
      ctx.shadowColor = orb.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = orb.color;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, ORB_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Power-ups
    for (const pu of s.powerUps) {
      const color = POWER_COLORS[pu.type];
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = color + '33';
      ctx.beginPath();
      ctx.arc(pu.x, pu.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(POWER_ICONS[pu.type], pu.x, pu.y);
      ctx.restore();
    }

    // Snakes
    for (const snake of s.snakes.filter(sn => sn.alive)) {
      ctx.save();
      ctx.shadowColor = snake.color;
      ctx.shadowBlur = snake.isPlayer ? 18 : 10;
      ctx.strokeStyle = snake.color;

      for (let i = 1; i < snake.segments.length; i++) {
        const r = PLAYER_RADIUS * (1 - i / snake.segments.length * 0.4);
        ctx.lineWidth = r * 2;
        ctx.beginPath();
        ctx.moveTo(snake.segments[i - 1].x, snake.segments[i - 1].y);
        ctx.lineTo(snake.segments[i].x, snake.segments[i].y);
        ctx.stroke();
      }

      // Head
      const head = snake.segments[0];
      ctx.fillStyle = snake.color;
      ctx.beginPath();
      ctx.arc(head.x, head.y, PLAYER_RADIUS + (snake.isPlayer ? 2 : 0), 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#000';
      const ex = Math.cos(snake.angle + 0.5) * 4;
      const ey = Math.sin(snake.angle + 0.5) * 4;
      ctx.beginPath();
      ctx.arc(head.x + ex, head.y + ey, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Boost energy bar (player)
    if (player.alive) {
      const barW = 120;
      const barH = 6;
      const bx = CANVAS_W / 2 - barW / 2;
      const by = CANVAS_H - 20;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(bx, by, barW, barH);
      ctx.fillStyle = player.isBoosting ? '#FF4400' : '#00F0FF';
      ctx.fillRect(bx, by, barW * (player.boostEnergy / BOOST_MAX), barH);
      ctx.strokeStyle = 'rgba(0,240,255,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, barW, barH);
    }

    s.frameId = requestAnimationFrame(runLoop);
  }, [gameOver]);

  const startGame = useCallback(() => {
    initGame();
    setGameState('playing');
  }, [initGame]);

  useEffect(() => {
    if (gameState === 'playing') {
      stateRef.current!.running = true;
      stateRef.current!.lastTime = performance.now();
      stateRef.current!.frameId = requestAnimationFrame(runLoop);
    }
    return () => {
      if (stateRef.current) cancelAnimationFrame(stateRef.current.frameId);
    };
  }, [gameState, runLoop]);

  // Canvas mouse tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const scaleY = CANVAS_H / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      if (stateRef.current && stateRef.current.snakes[0]) {
        const head = stateRef.current.snakes[0].segments[0];
        stateRef.current.mouseAngle = Math.atan2(my - head.y, mx - head.x);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (!stateRef.current) return;
      if (e.code === 'Space') { e.preventDefault(); stateRef.current.boosting = true; }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (!stateRef.current) return;
      if (e.code === 'Space') stateRef.current.boosting = false;
    };
    const onMouseDown = () => { if (stateRef.current) stateRef.current.boosting = true; };
    const onMouseUp = () => { if (stateRef.current) stateRef.current.boosting = false; };

    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handlePause = () => {
    if (stateRef.current) stateRef.current.running = false;
    setGameState('paused');
  };
  const handleResume = () => {
    if (stateRef.current) {
      stateRef.current.running = true;
      stateRef.current.lastTime = performance.now();
      stateRef.current.frameId = requestAnimationFrame(runLoop);
    }
    setGameState('playing');
  };
  const handleRestart = () => {
    if (stateRef.current) cancelAnimationFrame(stateRef.current.frameId);
    startGame();
  };

  return (
    <GameShell
      title="Hungry Serpent"
      score={score}
      bestScore={bestScore}
      state={gameState}
      onPause={handlePause}
      onResume={gameState === 'how-to-play' ? startGame : handleResume}
      onRestart={handleRestart}
      onExit={onExit}
      onToggleMute={() => setIsMuted(m => !m)}
      isMuted={isMuted}
      instructions={INSTRUCTIONS}
    >
      <div ref={containerRef} className="w-full h-full flex items-center justify-center relative p-2">
        <div className="relative flex-1 w-full h-full flex items-center justify-center max-h-[88vh]">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="max-w-full max-h-full object-contain rounded-2xl border border-[rgba(0,240,255,0.25)] shadow-[0_0_30px_rgba(0,240,255,0.2)] bg-[#010811]"
            style={{ cursor: gameState === 'playing' ? 'none' : 'default' }}
            aria-label="Hungry Serpent game canvas"
          />
        </div>
      </div>
      {/* Power-up indicators */}
      {activePowerUps.length > 0 && gameState === 'playing' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
          {activePowerUps.map((icon, i) => (
            <div key={i} className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-lg">
              {icon}
            </div>
          ))}
        </div>
      )}
    </GameShell>
  );
};
