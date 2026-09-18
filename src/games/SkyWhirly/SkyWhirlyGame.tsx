import React, { useRef, useEffect, useCallback, useState } from 'react';
import { GameShell } from '../../components/games/GameShell';
import type { GameState } from '../types';

interface SkyWhirlyProps {
  onExit: () => void;
  onScoreSaved: (score: number) => void;
  bestScore: number;
}

const W = 480;
const H = 600;
const GRAVITY = 900;
const LIFT = -420;
const POD_X = 100;
const POD_RADIUS = 14;
const GATE_W = 60;
const GAP_BASE = 190;
const STAR_RADIUS = 6;

interface Gate {
  x: number;
  topH: number;
  gapH: number;
  passed: boolean;
}

interface Star {
  x: number;
  y: number;
  collected: boolean;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  color: string;
}

const INSTRUCTIONS = [
  'Press Space, Up Arrow, or click/tap to lift the pod.',
  'Gravity pulls the pod down — keep tapping to stay airborne.',
  'Fly through the gaps between obstacle gates.',
  'Collect stars ✨ for bonus points (+50 each).',
  'Speed increases every 10 gates — stay sharp!',
  'P = pause, R = restart.',
];

interface SkyWhirlyState {
  vy: number; y: number;
  gates: Gate[]; stars: Star[]; particles: Particle[];
  score: number; gatesPassed: number; speed: number; nextGateX: number;
  lifting: boolean; running: boolean; frameId: number; lastTime: number;
  bgOffset: number; practiceMode: boolean;
}

export const SkyWhirlyGame: React.FC<SkyWhirlyProps> = ({ onExit, onScoreSaved, bestScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<SkyWhirlyState | null>(null);

  const [gameState, setGameState] = useState<GameState>('how-to-play');
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);

  const initGame = useCallback((practice = false) => {
    stateRef.current = {
      vy: 0,
      y: H / 2,
      gates: [],
      stars: [],
      particles: [],
      score: 0,
      gatesPassed: 0,
      speed: practice ? 120 : 220,
      nextGateX: W + 100,
      lifting: false,
      running: true,
      frameId: 0,
      lastTime: 0,
      bgOffset: 0,
      practiceMode: practice,
    };
    setScore(0);
  }, []);

  const spawnGate = (s: SkyWhirlyState) => {
    const gapH = Math.max(120, GAP_BASE - s.gatesPassed * 1.5);
    const minTop = 40;
    const maxTop = H - gapH - 40;
    const topH = minTop + Math.random() * (maxTop - minTop);
    const x = s.nextGateX;
    s.nextGateX = x + (s.practiceMode ? 320 : 260) - s.gatesPassed * 0.8;
    s.gates.push({ x, topH, gapH, passed: false });

    // Spawn star between gate gap
    if (Math.random() < 0.6) {
      s.stars.push({ x: x + GATE_W / 2, y: topH + gapH / 2, collected: false });
    }
  };

  const explode = (x: number, y: number, s: SkyWhirlyState) => {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 140;
      s.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.8,
        color: ['#00F0FF', '#58A6FF', '#FF6584', '#FFD700'][Math.floor(Math.random() * 4)],
      });
    }
  };

  const gameOver = useCallback(() => {
    const s = stateRef.current!;
    s.running = false;
    cancelAnimationFrame(s.frameId);
    if (!s.practiceMode) onScoreSaved(s.score);
    setScore(s.score);
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

    // Physics
    const effectiveGravity = s.practiceMode ? GRAVITY * 0.6 : GRAVITY;
    const effectiveLift = s.practiceMode ? LIFT * 0.6 : LIFT;
    s.vy += effectiveGravity * dt;
    if (s.lifting) s.vy = Math.max(effectiveLift, s.vy + effectiveLift * dt * 6);
    s.y += s.vy * dt;

    s.bgOffset += s.speed * dt * 0.2;

    // Spawn gates
    if (s.gates.length === 0 || s.gates[s.gates.length - 1].x < W) {
      spawnGate(s);
    }

    // Move gates
    s.gates.forEach(g => { g.x -= s.speed * dt; });
    s.gates = s.gates.filter(g => g.x > -GATE_W - 10);

    // Move stars
    s.stars.forEach(st => { st.x -= s.speed * dt; });
    s.stars = s.stars.filter(st => st.x > -20);

    // Update particles
    s.particles.forEach(p => {
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vy += 200 * dt;
      p.life -= dt;
    });
    s.particles = s.particles.filter(p => p.life > 0);

    // Check gate pass / collision
    for (const gate of s.gates) {
      const gateRight = gate.x + GATE_W;
      if (!gate.passed && gateRight < POD_X) {
        gate.passed = true;
        s.gatesPassed++;
        s.score += 10;
        setScore(s.score);
        // Speed up every 10 gates
        if (s.gatesPassed % 10 === 0 && !s.practiceMode) s.speed = Math.min(380, s.speed + 15);
      }

      // Collision
      if (POD_X + POD_RADIUS > gate.x && POD_X - POD_RADIUS < gateRight) {
        if (s.y - POD_RADIUS < gate.topH || s.y + POD_RADIUS > gate.topH + gate.gapH) {
          explode(POD_X, s.y, s);
          gameOver();
          return;
        }
      }
    }

    // Boundary collision
    if (s.y + POD_RADIUS > H || s.y - POD_RADIUS < 0) {
      explode(POD_X, s.y, s);
      gameOver();
      return;
    }

    // Star collection
    for (const star of s.stars) {
      if (!star.collected && Math.sqrt((POD_X - star.x) ** 2 + (s.y - star.y) ** 2) < POD_RADIUS + STAR_RADIUS) {
        star.collected = true;
        s.score += 50;
        setScore(s.score);
      }
    }

    // ─── DRAW ───
    // Sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#020818');
    gradient.addColorStop(0.5, '#041230');
    gradient.addColorStop(1, '#060820');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // Parallax stars
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 80; i++) {
      const bx = ((i * 137.5 + s.bgOffset * 0.3) % W);
      const by = (i * 73.1) % H;
      ctx.beginPath();
      ctx.arc(bx, by, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 40; i++) {
      const bx = ((i * 193.7 + s.bgOffset * 0.15) % W);
      const by = (i * 119.3) % H;
      ctx.beginPath();
      ctx.arc(bx, by, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gates
    for (const gate of s.gates) {
      // Top gate
      const grd1 = ctx.createLinearGradient(gate.x, 0, gate.x + GATE_W, 0);
      grd1.addColorStop(0, '#0D3060');
      grd1.addColorStop(1, '#1A4A88');
      ctx.fillStyle = grd1;
      ctx.fillRect(gate.x, 0, GATE_W, gate.topH);
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(gate.x, 0, GATE_W, gate.topH);

      // Bottom gate
      const bottomY = gate.topH + gate.gapH;
      ctx.fillStyle = grd1;
      ctx.fillRect(gate.x, bottomY, GATE_W, H - bottomY);
      ctx.strokeRect(gate.x, bottomY, GATE_W, H - bottomY);

      // Glow
      ctx.save();
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gate.x, gate.topH);
      ctx.lineTo(gate.x + GATE_W, gate.topH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gate.x, bottomY);
      ctx.lineTo(gate.x + GATE_W, bottomY);
      ctx.stroke();
      ctx.restore();
    }

    // Stars
    for (const star of s.stars) {
      if (star.collected) continue;
      ctx.save();
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#FFD700';
      const t = Date.now() / 500;
      const size = STAR_RADIUS + Math.sin(t + star.x) * 1.5;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const r = i % 2 === 0 ? size : size * 0.5;
        const sx = star.x + Math.cos(angle) * r;
        const sy = star.y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Particles
    for (const p of s.particles) {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Pod
    ctx.save();
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 20;
    // Body
    ctx.fillStyle = '#0088CC';
    ctx.beginPath();
    ctx.ellipse(POD_X, s.y, POD_RADIUS + 2, POD_RADIUS, Math.atan2(s.vy, 200) * 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Neon trim
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Rotor (spinning top)
    const rotAngle = Date.now() / 100;
    for (let i = 0; i < 4; i++) {
      const ra = rotAngle + (i * Math.PI) / 2;
      ctx.fillStyle = '#00F0FF';
      ctx.beginPath();
      ctx.ellipse(POD_X + Math.cos(ra) * 10, s.y - 12 + Math.sin(ra) * 2, 8, 2, ra, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Lift trail
    if (s.lifting) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      const trailGrd = ctx.createLinearGradient(POD_X, s.y, POD_X - 40, s.y);
      trailGrd.addColorStop(0, '#00F0FF');
      trailGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = trailGrd;
      ctx.fillRect(POD_X - 40, s.y - 4, 40, 8);
      ctx.restore();
    }

    // Score & speed HUD
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(4, 4, 160, 50);
    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`${s.score}`, 14, 26);
    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.fillText(`Gates: ${s.gatesPassed}  Speed: ${Math.round(s.speed)}`, 14, 44);

    if (s.practiceMode) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('PRACTICE MODE', W - 110, 20);
    }

    s.frameId = requestAnimationFrame(runLoop);
  }, [gameOver]);

  const startGame = useCallback((practice = practiceMode) => {
    initGame(practice);
    setGameState('playing');
  }, [initGame, practiceMode]);

  useEffect(() => {
    if (gameState === 'playing') {
      stateRef.current!.running = true;
      stateRef.current!.lastTime = performance.now();
      stateRef.current!.frameId = requestAnimationFrame(runLoop);
    }
    return () => { if (stateRef.current) cancelAnimationFrame(stateRef.current.frameId); };
  }, [gameState, runLoop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!stateRef.current || gameState !== 'playing') return;
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); stateRef.current.lifting = true; }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (!stateRef.current) return;
      if (e.code === 'Space' || e.code === 'ArrowUp') stateRef.current.lifting = false;
    };
    const onPointer = () => { if (stateRef.current && gameState === 'playing') stateRef.current.lifting = true; };
    const onPointerUp = () => { if (stateRef.current) stateRef.current.lifting = false; };

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    canvasRef.current?.addEventListener('pointerdown', onPointer);
    canvasRef.current?.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
      canvasRef.current?.removeEventListener('pointerdown', onPointer);
      canvasRef.current?.removeEventListener('pointerup', onPointerUp);
    };
  }, [gameState]);

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
      title="Sky Whirly"
      score={score}
      bestScore={bestScore}
      state={gameState}
      onPause={handlePause}
      onResume={gameState === 'how-to-play' ? startGame : handleResume}
      onRestart={() => startGame(practiceMode)}
      onExit={onExit}
      onToggleMute={() => setIsMuted(m => !m)}
      isMuted={isMuted}
      instructions={INSTRUCTIONS}
    >
      <div className="w-full h-full flex flex-col items-center justify-center relative p-2">
        {gameState === 'how-to-play' && (
          <div className="flex gap-3 mb-4 z-20">
            <button
              onClick={() => { setPracticeMode(false); startGame(false); }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#00C4CC] to-[#58A6FF] text-[#030816] shadow-lg hover:brightness-110 uppercase tracking-wider"
            >
              Normal Mode
            </button>
            <button
              onClick={() => { setPracticeMode(true); startGame(true); }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30 uppercase tracking-wider"
            >
              Practice Mode (Slower)
            </button>
          </div>
        )}
        <div className="relative flex-1 w-full h-full flex items-center justify-center max-h-[88vh]">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="max-w-full max-h-full object-contain rounded-2xl border border-[rgba(0,240,255,0.25)] shadow-[0_0_35px_rgba(0,240,255,0.2)] bg-[#020818]"
            style={{ cursor: 'pointer', touchAction: 'none' }}
            aria-label="Sky Whirly game canvas"
          />
        </div>
        {gameState === 'playing' && (
          <div className="mt-2 text-[11px] text-cyan-400/80 font-mono text-center">
            Space / ↑ Arrow / Tap & Hold Canvas to Lift
          </div>
        )}
      </div>
    </GameShell>
  );
};
