import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameShell } from '../../components/games/GameShell';
import type { GameState } from '../types';
import { WifiOff, Users, Clock, Swords, Copy, Sparkles } from 'lucide-react';

interface IdDuelProps {
  userId: string;
  userName: string;
  onExit: () => void;
  onMatchSaved: (myScore: number, opponentScore: number, result: 'win' | 'loss' | 'draw') => void;
  bestScore: number;
}

// ─── Canvas constants ────
const W = 900;
const H = 900;
const ORB_RADIUS = 7;
const PLAYER_RADIUS = 10;
const SPEED_BASE = 210;
const BOOST_MULT = 1.8;
const BOOST_MAX = 100;
const BOOST_DRAIN = 45;
const MATCH_DURATION = 90; // seconds

type Vec2 = { x: number; y: number };
function dist(a: Vec2, b: Vec2) { return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2); }
function angleDiff(a: number, b: number) {
  let d = b - a; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return d;
}

interface Orb { x: number; y: number; }

function spawnOrb(): Orb { return { x: 35 + Math.random() * (W - 70), y: 35 + Math.random() * (H - 70) }; }

const INSTRUCTIONS = [
  'Guide your cyan serpent using your Mouse, Touch, Arrow Keys, or WASD.',
  'Hold Space or Click/Tap to Boost (uses energy gauge).',
  'Collect more glowing energy orbs than your opponent before time runs out!',
  'Play solo vs AI Bot or join an online multiplayer duel match.',
];

export const IdDuelGame: React.FC<IdDuelProps> = ({ userId: _userId, userName: _userName, onExit, onMatchSaved, bestScore }) => {
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [gameState, setGameState] = useState<GameState>('how-to-play');
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION);
  const [_opponentScore, setOpponentScore] = useState(0);
  const [_opponentName, _setOpponentName] = useState('Opponent Bot');
  const [matchStatus, setMatchStatus] = useState<'lobby' | 'waiting' | 'countdown' | 'playing' | 'result'>('lobby');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [_countdown, _setCountdown] = useState(3);
  const [practicMode, setPracticeMode] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    myX: number; myY: number; myAngle: number;
    myScore: number; myEnergy: number; myBoosting: boolean;
    opX: number; opY: number; opAngle: number;
    opScore: number;
    mySegs: Vec2[]; opSegs: Vec2[];
    orbs: Orb[];
    mouseAngle: number;
    keyAngle: number | null;
    running: boolean;
    frameId: number;
    lastTime: number;
  } | null>(null);

  // Check server status
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('http://localhost:3001/', { signal: AbortSignal.timeout(1500) });
        setServerOnline(res.ok);
      } catch {
        setServerOnline(false);
      }
    };
    check();
  }, []);

  const initPractice = useCallback(() => {
    stateRef.current = {
      myX: W / 4, myY: H / 2, myAngle: 0,
      myScore: 0, myEnergy: BOOST_MAX, myBoosting: false,
      opX: (W * 3) / 4, opY: H / 2, opAngle: Math.PI,
      opScore: 0,
      mySegs: Array.from({ length: 12 }, (_, i) => ({ x: W / 4 - i * 9, y: H / 2 })),
      opSegs: Array.from({ length: 12 }, (_, i) => ({ x: (W * 3) / 4 + i * 9, y: H / 2 })),
      orbs: Array.from({ length: 45 }, spawnOrb),
      mouseAngle: 0,
      keyAngle: null,
      running: true,
      frameId: 0,
      lastTime: 0,
    };
    setScore(0);
    setOpponentScore(0);
    setTimeLeft(MATCH_DURATION);
  }, []);

  const practiceGameOver = useCallback(() => {
    const s = stateRef.current!;
    s.running = false;
    cancelAnimationFrame(s.frameId);
    const result: 'win' | 'loss' | 'draw' = s.myScore > s.opScore ? 'win' : s.myScore < s.opScore ? 'loss' : 'draw';
    onMatchSaved(s.myScore, s.opScore, result);
    setGameState('game-over');
  }, [onMatchSaved]);

  const runPracticeLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s || !s.running) return;
    const ctx = canvas.getContext('2d')!;
    const now = performance.now();
    const dt = Math.min((now - (s.lastTime || now)) / 1000, 0.05);
    s.lastTime = now;

    // Timer countdown
    setTimeLeft(t => {
      const newT = Math.max(0, t - dt);
      if (newT <= 0 && s.running) { practiceGameOver(); }
      return newT;
    });

    // Determine target angle (keyboard has priority if pressed, else mouse)
    const targetAngle = s.keyAngle !== null ? s.keyAngle : s.mouseAngle;
    const diff = angleDiff(s.myAngle, targetAngle);
    s.myAngle += Math.sign(diff) * Math.min(Math.abs(diff), 4.5 * dt);

    if (s.myBoosting && s.myEnergy > 0) {
      s.myEnergy = Math.max(0, s.myEnergy - BOOST_DRAIN * dt);
    } else {
      s.myEnergy = Math.min(BOOST_MAX, s.myEnergy + BOOST_DRAIN * 0.3 * dt);
    }
    const mySpeed = s.myBoosting && s.myEnergy > 0 ? SPEED_BASE * BOOST_MULT : SPEED_BASE;
    const newMyHead = { x: s.myX + Math.cos(s.myAngle) * mySpeed * dt, y: s.myY + Math.sin(s.myAngle) * mySpeed * dt };
    s.myX = Math.max(PLAYER_RADIUS + 5, Math.min(W - PLAYER_RADIUS - 5, newMyHead.x));
    s.myY = Math.max(PLAYER_RADIUS + 5, Math.min(H - PLAYER_RADIUS - 5, newMyHead.y));
    s.mySegs.unshift({ x: s.myX, y: s.myY }); s.mySegs.pop();

    // Opponent AI steering
    if (s.orbs.length > 0) {
      let nearestOrb = s.orbs[0];
      let nearestDist = dist({ x: s.opX, y: s.opY }, nearestOrb);
      for (const orb of s.orbs) {
        const d = dist({ x: s.opX, y: s.opY }, orb);
        if (d < nearestDist) { nearestDist = d; nearestOrb = orb; }
      }
      const opTarget = Math.atan2(nearestOrb.y - s.opY, nearestOrb.x - s.opX);
      const opDiff = angleDiff(s.opAngle, opTarget);
      s.opAngle += Math.sign(opDiff) * Math.min(Math.abs(opDiff), 3.2 * dt);
    }
    const newOpHead = { x: s.opX + Math.cos(s.opAngle) * SPEED_BASE * 0.88 * dt, y: s.opY + Math.sin(s.opAngle) * SPEED_BASE * 0.88 * dt };
    s.opX = Math.max(PLAYER_RADIUS + 5, Math.min(W - PLAYER_RADIUS - 5, newOpHead.x));
    s.opY = Math.max(PLAYER_RADIUS + 5, Math.min(H - PLAYER_RADIUS - 5, newOpHead.y));
    s.opSegs.unshift({ x: s.opX, y: s.opY }); s.opSegs.pop();

    // Orb collection
    s.orbs = s.orbs.filter(orb => {
      if (dist({ x: s.myX, y: s.myY }, orb) < PLAYER_RADIUS + ORB_RADIUS) {
        s.myScore += 10; setScore(s.myScore);
        s.mySegs.push({ ...s.mySegs[s.mySegs.length - 1] });
        return false;
      }
      if (dist({ x: s.opX, y: s.opY }, orb) < PLAYER_RADIUS + ORB_RADIUS) {
        s.opScore += 10; setOpponentScore(s.opScore);
        s.opSegs.push({ ...s.opSegs[s.opSegs.length - 1] });
        return false;
      }
      return true;
    });
    while (s.orbs.length < 45) s.orbs.push(spawnOrb());

    // ─── DRAW ARENA CANVAS ───
    ctx.fillStyle = '#010811';
    ctx.fillRect(0, 0, W, H);

    // Grid Lines
    ctx.strokeStyle = 'rgba(0,240,255,0.08)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 45) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 45) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Outer Neon Glow Border
    ctx.strokeStyle = '#00F0FF'; ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, W - 4, H - 4);

    // Orbs
    for (const orb of s.orbs) {
      ctx.save(); ctx.shadowColor = '#00F0FF'; ctx.shadowBlur = 12;
      ctx.fillStyle = '#00F0FF'; ctx.beginPath(); ctx.arc(orb.x, orb.y, ORB_RADIUS, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }

    // Opponent serpent (Rose/Pink)
    ctx.save(); ctx.shadowColor = '#FF4488'; ctx.shadowBlur = 16; ctx.strokeStyle = '#FF4488';
    for (let i = 1; i < s.opSegs.length; i++) {
      ctx.lineWidth = PLAYER_RADIUS * 1.8 * (1 - (i / s.opSegs.length) * 0.4);
      ctx.beginPath(); ctx.moveTo(s.opSegs[i-1].x, s.opSegs[i-1].y); ctx.lineTo(s.opSegs[i].x, s.opSegs[i].y); ctx.stroke();
    }
    ctx.fillStyle = '#FF4488'; ctx.beginPath(); ctx.arc(s.opX, s.opY, PLAYER_RADIUS + 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();

    // Player serpent (Cyan/Blue)
    ctx.save(); ctx.shadowColor = '#00F0FF'; ctx.shadowBlur = 20; ctx.strokeStyle = '#00F0FF';
    for (let i = 1; i < s.mySegs.length; i++) {
      ctx.lineWidth = PLAYER_RADIUS * 2 * (1 - (i / s.mySegs.length) * 0.4);
      ctx.beginPath(); ctx.moveTo(s.mySegs[i-1].x, s.mySegs[i-1].y); ctx.lineTo(s.mySegs[i].x, s.mySegs[i].y); ctx.stroke();
    }
    ctx.fillStyle = '#00F0FF'; ctx.beginPath(); ctx.arc(s.myX, s.myY, PLAYER_RADIUS + 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();

    // Serpent Labels
    ctx.fillStyle = '#00F0FF'; ctx.font = 'extrabold 14px font-mono, sans-serif';
    ctx.fillText('YOU', s.myX - 16, s.myY - PLAYER_RADIUS - 10);
    ctx.fillStyle = '#FF4488';
    ctx.fillText('BOT', s.opX - 14, s.opY - PLAYER_RADIUS - 10);

    // Score HUD Header Inside Arena
    ctx.fillStyle = 'rgba(2, 10, 25, 0.85)'; ctx.fillRect(W / 2 - 110, 12, 220, 50);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)'; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - 110, 12, 220, 50);
    ctx.fillStyle = '#00F0FF'; ctx.font = 'black 22px font-mono, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`${s.myScore}`, W / 2 - 50, 46);
    ctx.fillStyle = '#888'; ctx.font = 'bold 16px font-mono, sans-serif'; ctx.fillText('VS', W / 2, 44);
    ctx.fillStyle = '#FF4488'; ctx.font = 'black 22px font-mono, sans-serif';
    ctx.fillText(`${s.opScore}`, W / 2 + 50, 46);
    ctx.textAlign = 'left';

    // Boost Energy Gauge Bar
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(20, H - 32, 180, 14);
    ctx.fillStyle = s.myEnergy > 20 ? '#00F0FF' : '#FF4444';
    ctx.fillRect(20, H - 32, (s.myEnergy / BOOST_MAX) * 180, 14);
    ctx.strokeStyle = '#00F0FF'; ctx.lineWidth = 1.5;
    ctx.strokeRect(20, H - 32, 180, 14);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px font-mono, sans-serif';
    ctx.fillText('BOOST GAUGE', 25, H - 21);

    s.frameId = requestAnimationFrame(runPracticeLoop);
  }, [practiceGameOver]);

  const startPractice = useCallback(() => {
    initPractice();
    setPracticeMode(true);
    setGameState('playing');
  }, [initPractice]);

  useEffect(() => {
    if (gameState === 'playing' && practicMode) {
      if (!stateRef.current) initPractice();
      stateRef.current!.running = true;
      stateRef.current!.lastTime = performance.now();
      stateRef.current!.frameId = requestAnimationFrame(runPracticeLoop);
    }
    return () => { if (stateRef.current) cancelAnimationFrame(stateRef.current.frameId); };
  }, [gameState, practicMode, runPracticeLoop, initPractice]);

  // Window Pointer (Mouse & Touch) + Keyboard input listener
  useEffect(() => {
    const keysPressed: Record<string, boolean> = {};

    const updateKeyboardAngle = () => {
      if (!stateRef.current) return;
      const up = keysPressed['ArrowUp'] || keysPressed['KeyW'] || keysPressed['w'];
      const down = keysPressed['ArrowDown'] || keysPressed['KeyS'] || keysPressed['s'];
      const left = keysPressed['ArrowLeft'] || keysPressed['KeyA'] || keysPressed['a'];
      const right = keysPressed['ArrowRight'] || keysPressed['KeyD'] || keysPressed['d'];

      let dx = 0; let dy = 0;
      if (up) dy -= 1;
      if (down) dy += 1;
      if (left) dx -= 1;
      if (right) dx += 1;

      if (dx !== 0 || dy !== 0) {
        stateRef.current.keyAngle = Math.atan2(dy, dx);
      } else {
        stateRef.current.keyAngle = null;
      }
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !stateRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width; const scaleY = H / rect.height;
      const mx = (clientX - rect.left) * scaleX;
      const my = (clientY - rect.top) * scaleY;
      stateRef.current.mouseAngle = Math.atan2(my - stateRef.current.myY, mx - stateRef.current.myX);
    };

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onMouseDown = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
      if (stateRef.current) stateRef.current.myBoosting = true;
    };
    const onMouseUp = () => { if (stateRef.current) stateRef.current.myBoosting = false; };

    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.code] = true;
      keysPressed[e.key] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        if (stateRef.current) stateRef.current.myBoosting = true;
      }
      updateKeyboardAngle();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.code] = false;
      keysPressed[e.key] = false;
      if (e.code === 'Space') {
        if (stateRef.current) stateRef.current.myBoosting = false;
      }
      updateKeyboardAngle();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const genRoomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

  const handleCreateRoom = () => {
    const code = genRoomCode();
    setRoomCode(code);
    setMatchStatus('waiting');
  };

  const handleResume = () => {
    if (!stateRef.current) initPractice();
    startPractice();
  };

  return (
    <GameShell
      title="ID Duel Arena"
      score={score}
      bestScore={bestScore}
      timeLeft={gameState === 'playing' ? Math.ceil(timeLeft) : undefined}
      state={gameState}
      onPause={() => setGameState('paused')}
      onResume={handleResume}
      onRestart={() => { initPractice(); setGameState('playing'); }}
      onExit={onExit}
      onToggleMute={() => setIsMuted(m => !m)}
      isMuted={isMuted}
      instructions={INSTRUCTIONS}
      gameOverMessage={
        stateRef.current && stateRef.current.myScore > stateRef.current.opScore
          ? `You won! 🎉 ${stateRef.current.myScore} vs ${stateRef.current.opScore}`
          : stateRef.current && stateRef.current.myScore < stateRef.current.opScore
          ? `You lost! ${stateRef.current.myScore} vs ${stateRef.current.opScore}`
          : `Draw match! ${stateRef.current?.myScore || 0} vs ${stateRef.current?.opScore || 0}`
      }
    >
      <div className="w-full h-full flex flex-col items-center justify-center relative p-1 sm:p-2">
        {/* Lobby / Match Selection */}
        {gameState === 'how-to-play' && (
          <div className="w-full max-w-lg mx-auto p-6 sm:p-8 space-y-6 bg-[#09152B] border-2 border-[rgba(0,240,255,0.3)] rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.15)] z-20">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white font-heading uppercase flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00F0FF]" /> ID Duel Arena
              </h3>
              <p className="text-xs text-cyan-400/80 font-mono">1v1 Real-Time Serpent Match</p>
            </div>

            {/* Server Online/Offline badge */}
            <div className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs ${
              serverOnline === null ? 'border-gray-600/30 text-gray-400' :
              serverOnline ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' :
              'border-rose-500/40 bg-rose-500/10 text-rose-300'
            }`}>
              <WifiOff className="w-4 h-4 flex-shrink-0" />
              <div>
                <div className="font-bold">
                  {serverOnline === null ? 'Checking Multiplayer Server...' : serverOnline ? 'Multiplayer Server Online ✓' : 'Multiplayer Server Offline'}
                </div>
                {!serverOnline && serverOnline !== null && (
                  <div className="text-[10px] mt-0.5 opacity-80">
                    Play Solo vs AI Bot or run <code className="bg-black/40 px-1 rounded">node server/game-server.js</code> for 2-Player duels!
                  </div>
                )}
              </div>
            </div>

            {/* Online multiplayer buttons */}
            {serverOnline && (
              <div className="space-y-3 pt-2">
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Online Match</div>
                {matchStatus === 'lobby' && (
                  <button onClick={handleCreateRoom} className="w-full py-3.5 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-rose-600 to-orange-500 text-white hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider">
                    <Swords className="w-4 h-4" /> Create Online Room
                  </button>
                )}
                {matchStatus === 'waiting' && (
                  <div className="text-center space-y-2 bg-black/40 p-4 rounded-2xl border border-cyan-500/30">
                    <div className="text-[11px] text-gray-300">Share room code with opponent:</div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-3xl font-black font-mono text-[#00F0FF] tracking-widest">{roomCode}</div>
                      <button onClick={() => navigator.clipboard.writeText(roomCode)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[11px] text-cyan-400 animate-pulse">
                      <Users className="w-4 h-4" /> Waiting for opponent to join...
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <input
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="ENTER ROOM CODE..."
                    maxLength={6}
                    className="flex-1 px-4 py-3 rounded-2xl bg-[#030A1A] border border-white/10 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-[#00F0FF] uppercase"
                  />
                  <button disabled={joinCode.length < 6} className="px-5 py-3 rounded-2xl font-bold text-xs bg-[#00F0FF] text-[#030816] disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 uppercase tracking-wider">
                    Join
                  </button>
                </div>
              </div>
            )}

            {/* Solo Practice */}
            <div className="border-t border-white/10 pt-4">
              <button
                onClick={startPractice}
                className="w-full py-4 rounded-2xl font-black text-xs bg-gradient-to-r from-[#00C4CC] via-[#00F0FF] to-[#58A6FF] text-[#030816] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.35)] uppercase tracking-wider"
              >
                <Clock className="w-4 h-4" /> Start 90s Match vs AI Bot
              </button>
            </div>
          </div>
        )}

        {/* Game Canvas - Expanded Full Stage */}
        {(gameState === 'playing' || gameState === 'paused') && (
          <div className="relative flex-1 w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="max-w-full max-h-full aspect-square object-contain rounded-2xl border-2 border-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.35)] bg-[#010811]"
              aria-label="ID Duel Arena game canvas"
            />
          </div>
        )}
      </div>
    </GameShell>
  );
};
