import React, { useState, useEffect, useMemo } from 'react';
import { GameShell } from '../../components/games/GameShell';
import type { GameState } from '../types';
import { Shield, Shuffle, Target, RotateCw, Trash2, CheckCircle2, Zap } from 'lucide-react';

interface Ship {
  id: string;
  name: string;
  size: number;
  placed: boolean;
  row?: number;
  col?: number;
  orientation?: 'h' | 'v';
}

interface Cell {
  row: number;
  col: number;
  hasShip: boolean;
  shipId?: string;
  status: 'empty' | 'ship' | 'hit' | 'miss';
}

interface NeonGridBattleGameProps {
  userId: string;
  userName: string;
  bestScore: number;
  onScoreSaved: (score: number) => void;
  onExit: () => void;
}

const GRID_SIZE = 8;

const INITIAL_SHIPS: Ship[] = [
  { id: 'carrier', name: 'Cyber Dreadnought', size: 5, placed: false },
  { id: 'battleship', name: 'Neon Cruiser', size: 4, placed: false },
  { id: 'destroyer', name: 'Quantum Destroyer', size: 3, placed: false },
  { id: 'submarine', name: 'Plasma Submarine', size: 3, placed: false },
  { id: 'patrol', name: 'Scout Drone', size: 2, placed: false },
];

const INSTRUCTIONS = [
  'Deploy your 5 fleets (sizes 5, 4, 3, 3, 2) on the 8x8 defense grid in straight lines.',
  'Click "Orientation" to toggle between Horizontal ↔ and Vertical ↕ placement.',
  'Or click "Randomize" for automatic fleet deployment.',
  'In Battle Phase, tap enemy grid cells to fire missiles.',
  'EXTRA TURN RULE: Hitting an enemy ship grants an EXTRA TURN! Keep firing until you miss.',
  'The AI also gets extra turns on hits — eliminate all enemy fleets to win!',
];

export const NeonGridBattleGame: React.FC<NeonGridBattleGameProps> = ({
  bestScore,
  onScoreSaved,
  onExit,
}) => {
  const [phase, setPhase] = useState<'deploy' | 'battle' | 'game-over'>('deploy');
  const [gameState, setGameState] = useState<GameState>('how-to-play');
  const [playerShips, setPlayerShips] = useState<Ship[]>(INITIAL_SHIPS);
  const [_enemyShips, setEnemyShips] = useState<Ship[]>(INITIAL_SHIPS);

  const [playerGrid, setPlayerGrid] = useState<Cell[][]>(() =>
    Array(GRID_SIZE).fill(null).map((_, r) =>
      Array(GRID_SIZE).fill(null).map((_, c) => ({ row: r, col: c, hasShip: false, status: 'empty' }))
    )
  );

  const [enemyGrid, setEnemyGrid] = useState<Cell[][]>(() =>
    Array(GRID_SIZE).fill(null).map((_, r) =>
      Array(GRID_SIZE).fill(null).map((_, c) => ({ row: r, col: c, hasShip: false, status: 'empty' }))
    )
  );

  const [selectedShipId, setSelectedShipId] = useState<string | null>('carrier');
  const [orientation, setOrientation] = useState<'h' | 'v'>('h');
  const [hoverCell, setHoverCell] = useState<{ r: number; c: number } | null>(null);
  const [turn, setTurn] = useState<'player' | 'ai'>('player');
  const [lastTurnResult, setLastTurnResult] = useState<'hit' | 'miss' | null>(null);
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);

  // AI Radar targeting states
  const [aiTargetCell, setAiTargetCell] = useState<{ r: number; c: number } | null>(null);
  const [aiScanningCell, setAiScanningCell] = useState<{ r: number; c: number } | null>(null);
  const [isAiFiring, setIsAiFiring] = useState<boolean>(false);


  // Placement validity helper
  const canPlaceShip = (
    shipSize: number,
    orient: 'h' | 'v',
    startR: number,
    startC: number,
    grid: Cell[][],
    ignoreShipId?: string
  ): boolean => {
    if (orient === 'h') {
      if (startC + shipSize > GRID_SIZE) return false;
      for (let i = 0; i < shipSize; i++) {
        const cell = grid[startR][startC + i];
        if (cell.hasShip && cell.shipId !== ignoreShipId) return false;
      }
    } else {
      if (startR + shipSize > GRID_SIZE) return false;
      for (let i = 0; i < shipSize; i++) {
        const cell = grid[startR + i][startC];
        if (cell.hasShip && cell.shipId !== ignoreShipId) return false;
      }
    }
    return true;
  };

  // Preview cells computation for hover
  const previewInfo = useMemo(() => {
    if (phase !== 'deploy' || !selectedShipId || !hoverCell) return null;
    const selectedShip = playerShips.find((s) => s.id === selectedShipId);
    if (!selectedShip) return null;

    const { r, c } = hoverCell;
    const isValid = canPlaceShip(selectedShip.size, orientation, r, c, playerGrid, selectedShipId);
    const cells: { r: number; c: number }[] = [];

    if (orientation === 'h') {
      for (let i = 0; i < selectedShip.size; i++) {
        if (c + i < GRID_SIZE) cells.push({ r, c: c + i });
      }
    } else {
      for (let i = 0; i < selectedShip.size; i++) {
        if (r + i < GRID_SIZE) cells.push({ r: r + i, c });
      }
    }

    return { isValid, cells, ship: selectedShip };
  }, [phase, selectedShipId, hoverCell, orientation, playerGrid, playerShips]);

  // Click handler for player grid in deployment mode
  const handleDeployClick = (r: number, c: number) => {
    if (phase !== 'deploy') return;

    if (selectedShipId) {
      const ship = playerShips.find((s) => s.id === selectedShipId);
      if (!ship) return;

      const valid = canPlaceShip(ship.size, orientation, r, c, playerGrid, ship.id);
      if (!valid) return;

      const newGrid = playerGrid.map((row) =>
        row.map((cell) => (cell.shipId === ship.id ? { ...cell, hasShip: false, shipId: undefined } : { ...cell }))
      );

      for (let i = 0; i < ship.size; i++) {
        const currR = orientation === 'v' ? r + i : r;
        const currC = orientation === 'h' ? c + i : c;
        newGrid[currR][currC].hasShip = true;
        newGrid[currR][currC].shipId = ship.id;
      }

      const updatedShips = playerShips.map((s) =>
        s.id === ship.id ? { ...s, placed: true, row: r, col: c, orientation } : s
      );

      setPlayerGrid(newGrid);
      setPlayerShips(updatedShips);

      const nextUnplaced = updatedShips.find((s) => !s.placed);
      setSelectedShipId(nextUnplaced ? nextUnplaced.id : null);
      return;
    }

    const cell = playerGrid[r][c];
    if (cell.shipId) {
      setSelectedShipId(cell.shipId);
      const ship = playerShips.find((s) => s.id === cell.shipId);
      if (ship && ship.orientation) setOrientation(ship.orientation);
    }
  };

  // Remove a placed ship
  const handleRemoveShip = (shipId: string) => {
    const ship = playerShips.find((s) => s.id === shipId);
    if (!ship) return;

    const newGrid = playerGrid.map((row) =>
      row.map((cell) => (cell.shipId === shipId ? { ...cell, hasShip: false, shipId: undefined } : { ...cell }))
    );

    const updatedShips = playerShips.map((s) =>
      s.id === shipId ? { ...s, placed: false, row: undefined, col: undefined } : s
    );

    setPlayerGrid(newGrid);
    setPlayerShips(updatedShips);
    setSelectedShipId(shipId);
  };

  // Clear all player placements
  const handleClearAll = () => {
    const emptyGrid: Cell[][] = Array(GRID_SIZE).fill(null).map((_, r) =>
      Array(GRID_SIZE).fill(null).map((_, c) => ({ row: r, col: c, hasShip: false, status: 'empty' }))
    );
    setPlayerGrid(emptyGrid);
    setPlayerShips(INITIAL_SHIPS);
    setSelectedShipId('carrier');
  };

  // Randomize placement helper
  const placeRandomly = (shipsList: Ship[]): { grid: Cell[][]; ships: Ship[] } => {
    const grid: Cell[][] = Array(GRID_SIZE).fill(null).map((_, r) =>
      Array(GRID_SIZE).fill(null).map((_, c) => ({ row: r, col: c, hasShip: false, status: 'empty' }))
    );

    const updatedShips = shipsList.map((ship) => {
      let placed = false;
      let r = 0;
      let c = 0;
      let orient: 'h' | 'v' = 'h';

      while (!placed) {
        orient = Math.random() > 0.5 ? 'h' : 'v';
        r = Math.floor(Math.random() * (orient === 'v' ? GRID_SIZE - ship.size + 1 : GRID_SIZE));
        c = Math.floor(Math.random() * (orient === 'h' ? GRID_SIZE - ship.size + 1 : GRID_SIZE));

        let valid = true;
        for (let i = 0; i < ship.size; i++) {
          const currR = orient === 'v' ? r + i : r;
          const currC = orient === 'h' ? c + i : c;
          if (grid[currR][currC].hasShip) {
            valid = false;
            break;
          }
        }

        if (valid) {
          for (let i = 0; i < ship.size; i++) {
            const currR = orient === 'v' ? r + i : r;
            const currC = orient === 'h' ? c + i : c;
            grid[currR][currC].hasShip = true;
            grid[currR][currC].shipId = ship.id;
          }
          placed = true;
        }
      }

      return { ...ship, placed: true, row: r, col: c, orientation: orient };
    });

    return { grid, ships: updatedShips };
  };

  // Randomize player fleet
  const handleRandomizePlayer = () => {
    const { grid, ships } = placeRandomly(INITIAL_SHIPS);
    setPlayerGrid(grid);
    setPlayerShips(ships);
    setSelectedShipId(null);
  };

  // Start battle phase
  const handleStartBattle = () => {
    const { grid: eGrid, ships: eShips } = placeRandomly(INITIAL_SHIPS);
    setEnemyGrid(eGrid);
    setEnemyShips(eShips);
    setPhase('battle');
    setGameState('playing');
    setTurn('player');
    setLastTurnResult(null);
  };

  // Player attack cell: HIT gives EXTRA TURN, MISS switches turn to AI
  const handlePlayerAttack = (r: number, c: number) => {
    if (phase !== 'battle' || turn !== 'player' || gameState !== 'playing') return;
    const targetCell = enemyGrid[r][c];
    if (targetCell.status !== 'empty') return;

    const newGrid = enemyGrid.map((row) => row.map((cell) => ({ ...cell })));

    if (targetCell.hasShip) {
      newGrid[r][c].status = 'hit';
      const newScore = score + 100;
      setScore(newScore);
      setLastTurnResult('hit');

      // Check Player Victory
      const allEnemyShipsHit = newGrid.every((row) =>
        row.every((cell) => !cell.hasShip || cell.status === 'hit')
      );

      if (allEnemyShipsHit) {
        setWinner('player');
        setPhase('game-over');
        setGameState('game-over');
        const finalScore = newScore + 1000;
        setScore(finalScore);
        onScoreSaved(finalScore);
        return;
      }
      // HIT! Player gets ANOTHER TURN (turn stays 'player')
      setEnemyGrid(newGrid);
    } else {
      newGrid[r][c].status = 'miss';
      setEnemyGrid(newGrid);
      setLastTurnResult('miss');
      // MISS! Turn switches to AI
      setTurn('ai');
    }
  };

  // AI Attack Turn Logic: HIT gives EXTRA TURN to AI, MISS switches turn to Player
  useEffect(() => {
    if (phase !== 'battle' || turn !== 'ai' || gameState !== 'playing') return;

    // 1. Choose the final target cell immediately
    const emptyCells: { r: number; c: number }[] = [];
    const hitCells: { r: number; c: number }[] = [];

    playerGrid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.status === 'empty') emptyCells.push({ r, c });
        if (cell.status === 'hit') hitCells.push({ r, c });
      });
    });

    if (emptyCells.length === 0) return;

    let finalTarget: { r: number; c: number } | null = null;
    if (hitCells.length > 0) {
      for (const hit of hitCells) {
        const adjacents = [
          { r: hit.r - 1, c: hit.c },
          { r: hit.r + 1, c: hit.c },
          { r: hit.r, c: hit.c - 1 },
          { r: hit.r, c: hit.c + 1 },
        ].filter(
          (a) =>
            a.r >= 0 &&
            a.r < GRID_SIZE &&
            a.c >= 0 &&
            a.c < GRID_SIZE &&
            playerGrid[a.r][a.c].status === 'empty'
        );

        if (adjacents.length > 0) {
          finalTarget = adjacents[Math.floor(Math.random() * adjacents.length)];
          break;
        }
      }
    }

    if (!finalTarget) {
      finalTarget = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    const targetCell = finalTarget;

    // 2. Start the multi-phase scanning animation
    let step = 0;
    const scanInterval = setInterval(() => {
      if (step < 3) {
        // Pick a random empty cell to simulate scanning
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        setAiScanningCell(randomCell);
        step++;
      } else if (step === 3) {
        // Lock onto target
        setAiScanningCell(targetCell);
        setAiTargetCell(targetCell);
        step++;
      } else if (step === 4) {
        // Fire charge-up state
        setIsAiFiring(true);
        step++;
      } else {
        // Perform final attack
        clearInterval(scanInterval);

        const newGrid = playerGrid.map((row) => row.map((cell) => ({ ...cell })));
        const cellToAttack = newGrid[targetCell.r][targetCell.c];

        if (cellToAttack.hasShip) {
          cellToAttack.status = 'hit';
          setPlayerGrid(newGrid);
          setLastTurnResult('hit');

          // Check AI Victory
          const allPlayerShipsHit = newGrid.every((row) =>
            row.every((cell) => !cell.hasShip || cell.status === 'hit')
          );

          if (allPlayerShipsHit) {
            setWinner('ai');
            setPhase('game-over');
            setGameState('game-over');
          }
        } else {
          cellToAttack.status = 'miss';
          setPlayerGrid(newGrid);
          setLastTurnResult('miss');
          setTurn('player');
        }

        // Clean up AI states
        setAiScanningCell(null);
        setAiTargetCell(null);
        setIsAiFiring(false);
      }
    }, 450); // 450ms per step, ~2.2s total scan animation sequence

    return () => clearInterval(scanInterval);
  }, [turn, phase, gameState, playerGrid]);

  // Reset Game
  const handleReset = () => {
    const emptyG: Cell[][] = Array(GRID_SIZE).fill(null).map((_, r) =>
      Array(GRID_SIZE).fill(null).map((_, c) => ({ row: r, col: c, hasShip: false, status: 'empty' }))
    );
    setPlayerGrid(emptyG);
    setEnemyGrid(emptyG);
    setPlayerShips(INITIAL_SHIPS);
    setEnemyShips(INITIAL_SHIPS);
    setSelectedShipId('carrier');
    setPhase('deploy');
    setGameState('playing');
    setWinner(null);
    setScore(0);
    setLastTurnResult(null);
    setAiTargetCell(null);
    setAiScanningCell(null);
    setIsAiFiring(false);
  };

  const allPlayerPlaced = playerShips.every((s) => s.placed);
  const placedCount = playerShips.filter((s) => s.placed).length;

  return (
    <GameShell
      title="Neon Grid Battle"
      score={score}
      bestScore={bestScore}
      state={gameState}
      onPause={() => setGameState('paused')}
      onResume={() => setGameState('playing')}
      onRestart={handleReset}
      onExit={onExit}
      onToggleMute={() => setIsMuted(!isMuted)}
      isMuted={isMuted}
      instructions={INSTRUCTIONS}
      gameOverMessage={
        winner === 'player'
          ? '🏆 VICTORY ACHIEVED! All 5 enemy vessels obliterated!'
          : '☠️ FLEET DESTROYED! The AI target radar locked onto your fleet.'
      }
    >
      <div className="max-w-4xl w-full bg-[#070D1F] border border-[rgba(0,240,255,0.25)] rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(0,240,255,0.1)] flex flex-col justify-between my-auto">
        {/* Status Banner in Battle Phase */}
        {phase === 'battle' && (
          <div className="w-full mb-3 px-4 py-2 rounded-2xl bg-[#040814] border border-[#00E5FF]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${turn === 'player' ? 'text-[#00E5FF] animate-bounce' : 'text-purple-400'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                {turn === 'player' ? 'Player Turn' : 'AI Turn'}
              </span>
            </div>
            <div
              className={`text-xs font-black px-3 py-1 rounded-xl border ${
                turn === 'player'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/50'
              }`}
            >
              {lastTurnResult === 'hit'
                ? `💥 CRITICAL HIT! ${turn === 'player' ? 'YOUR' : 'AI'} EXTRA TURN!`
                : turn === 'player'
                ? 'SELECT ENEMY CELL TO FIRE 🎯'
                : 'AI TARGETING YOUR FLEET... 🤖'}
            </div>
          </div>
        )}

        {/* Responsive Grid Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start justify-center">
          {/* Defense Grid Column */}
          <div
            className={`${
              phase === 'deploy' ? 'lg:col-span-12 max-w-md mx-auto w-full' : 'lg:col-span-6'
            } bg-[#040814]/90 border border-[#00E5FF]/30 rounded-2xl p-3.5 flex flex-col items-center shadow-lg transition-all duration-300`}
          >
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#00E5FF] uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Defense Grid (8x8)
              </span>
              <span className="text-[11px] font-bold text-gray-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                Fleets: <span className="text-[#00E5FF]">{placedCount} / 5</span>
              </span>
            </div>

            {/* Deployment Toolbar */}
            {phase === 'deploy' && (
              <div className="w-full bg-[#081226] border border-[rgba(0,240,255,0.2)] rounded-xl p-2 mb-2 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => setOrientation((prev) => (prev === 'h' ? 'v' : 'h'))}
                  className="px-2.5 py-1 bg-[#00E5FF]/15 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{orientation === 'h' ? 'Horizontal ↔' : 'Vertical ↕'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleRandomizePlayer}
                    className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Shuffle className="w-3.5 h-3.5" /> Random
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                </div>
              </div>
            )}

            {/* Player Grid Cells */}
            <div className="grid grid-cols-8 gap-1 bg-[#020612] p-2 rounded-2xl border border-white/10 shadow-inner">
              {playerGrid.map((row, r) =>
                row.map((cell, c) => {
                  let cellStyle = 'bg-[#0E172C] text-gray-600 border-white/5';
                  let content = '';

                  const isPreview = previewInfo?.cells.some((p) => p.r === r && p.c === c);

                  if (phase === 'deploy' && isPreview && previewInfo) {
                    cellStyle = previewInfo.isValid
                      ? 'bg-emerald-500/50 border-emerald-400 text-emerald-200 shadow-[0_0_12px_#10B981]'
                      : 'bg-rose-500/50 border-rose-400 text-rose-200 shadow-[0_0_12px_#F43F5E]';
                  } else if (cell.hasShip) {
                    cellStyle = 'bg-[#00E5FF]/25 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.6)]';
                    content = '🚀';
                  }

                  if (cell.status === 'hit') {
                    cellStyle = 'bg-rose-600/90 border-rose-400 text-white animate-pulse shadow-[0_0_15px_#F43F5E]';
                    content = '💥';
                  } else if (cell.status === 'miss') {
                    cellStyle = 'bg-gray-800 text-gray-500 border-gray-700';
                    content = '✕';
                  }

                  return (
                    <button
                      key={`p-${r}-${c}`}
                      disabled={phase !== 'deploy'}
                      onClick={() => handleDeployClick(r, c)}
                      onMouseEnter={() => setHoverCell({ r, c })}
                      onMouseLeave={() => setHoverCell(null)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center font-mono text-[10px] font-bold transition-all ${cellStyle} ${
                        phase === 'deploy' ? 'cursor-pointer hover:border-white/40' : 'cursor-default'
                      }`}
                    >
                      {content}
                    </button>
                  );
                })
              )}
            </div>

            {/* Deployment Ship Selectors */}
            {phase === 'deploy' && (
              <div className="w-full mt-2.5 space-y-1">
                <div className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-wider px-1">
                  Deploy Fleets (sizes 5, 4, 3, 3, 2):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {playerShips.map((ship) => {
                    const isSelected = selectedShipId === ship.id;
                    return (
                      <div
                        key={ship.id}
                        onClick={() => setSelectedShipId(ship.id)}
                        className={`p-1.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-white shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                            : ship.placed
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-gray-300'
                            : 'bg-[#081226] border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {ship.placed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-500 flex-shrink-0" />
                          )}
                          <div>
                            <div className="font-bold text-[10px] leading-tight">{ship.name}</div>
                            <div className="text-[9px] font-mono text-cyan-400/80">
                              Size: {ship.size} {'■ '.repeat(ship.size)}
                            </div>
                          </div>
                        </div>

                        {ship.placed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveShip(ship.id);
                            }}
                            className="p-1 rounded hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
                            title="Remove Ship"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleStartBattle}
                  disabled={!allPlayerPlaced}
                  className={`w-full mt-2.5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 uppercase tracking-wider ${
                    allPlayerPlaced
                      ? 'bg-gradient-to-r from-[#00E5FF] to-purple-600 text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-102 cursor-pointer'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <span>{allPlayerPlaced ? 'Initiate Cyber Battle Phase 🚀' : 'Deploy All 5 Fleets to Start'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Target Enemy Grid Column or AI Radar Column */}
          {phase !== 'deploy' && (
            <div className={`lg:col-span-6 bg-[#040814]/90 border rounded-2xl p-3.5 flex flex-col items-center shadow-lg transition-all duration-300 ${phase === 'battle' && turn === 'ai' ? 'border-[#00E5FF]/30 shadow-[#00e5ff]/5' : 'border-purple-500/30'}`}>
              {phase === 'battle' && turn === 'ai' ? (
                // AI Radar View of player's grid! (my screen showing where user see bot screen)
                <div className="w-full flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-[#00E5FF] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                      <Zap className="w-4 h-4 text-[#00E5FF]" /> AI Targeting Radar (8x8)
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#00E5FF]/30 text-[#00E5FF] animate-pulse">
                      {isAiFiring ? '⚡ LOCK LOCK LOCK ⚡' : '🔍 SCANNING...'}
                    </span>
                  </div>

                  {/* AI Radar Grid Cells */}
                  <div className="relative grid grid-cols-8 gap-1 bg-[#020612] p-2 rounded-2xl border border-[#00E5FF]/20 shadow-inner overflow-hidden">
                    {/* Radar Sweep Effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00E5FF]/5 via-transparent to-transparent h-1/2 w-full pointer-events-none animate-radar-sweep" />

                    {playerGrid.map((row, r) =>
                      row.map((cell, c) => {
                        const isScanning = aiScanningCell?.r === r && aiScanningCell?.c === c;
                        const isLocked = aiTargetCell?.r === r && aiTargetCell?.c === c;

                        let cellStyle = 'bg-[#0E172C]/40 text-gray-700 border-white/5';
                        let content = '';

                        // Render player ships with a dimmer "radar signature"
                        if (cell.hasShip) {
                          cellStyle = 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]/50';
                          content = '🚀';
                        }

                        // Scanning/locking cursor styles
                        if (isLocked) {
                          cellStyle = 'bg-rose-500/40 border-rose-500 text-white animate-ping shadow-[0_0_15px_#EF4444]';
                          content = '🎯';
                        } else if (isScanning) {
                          cellStyle = 'bg-[#00E5FF]/30 border-[#00E5FF] text-[#00E5FF] animate-pulse shadow-[0_0_10px_#00E5FF]';
                          content = '🔍';
                        }

                        // Already hit or missed states
                        if (cell.status === 'hit') {
                          cellStyle = 'bg-rose-900/50 border-rose-500/40 text-rose-300';
                          content = '💥';
                        } else if (cell.status === 'miss') {
                          cellStyle = 'bg-gray-800 text-gray-500 border-gray-700';
                          content = '✕';
                        }

                        return (
                          <div
                            key={`radar-${r}-${c}`}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-200 ${cellStyle}`}
                          >
                            {content}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-4 text-[11px] font-bold font-mono tracking-wide text-center">
                    {isAiFiring ? (
                      <span className="text-rose-500 animate-pulse">🤖 MISSILE INCOMING ON TARGET!</span>
                    ) : aiTargetCell ? (
                      <span className="text-[#00E5FF]">🤖 TARGET LOCKED AT [{aiTargetCell.r}, {aiTargetCell.c}]</span>
                    ) : (
                      <span className="text-gray-400">🤖 DECRYPTING DEFENSE FREQUENCIES...</span>
                    )}
                  </div>
                </div>
              ) : (
                // Normal Enemy Attack Grid View
                <div className="w-full flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-4 h-4" /> Enemy Attack Grid (8x8)
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30 text-purple-300">
                      Target AI Grid
                    </span>
                  </div>

                  {/* Enemy Grid Cells */}
                  <div className="grid grid-cols-8 gap-1 bg-[#020612] p-2 rounded-2xl border border-white/10 shadow-inner">
                    {enemyGrid.map((row, r) =>
                      row.map((cell, c) => {
                        let cellStyle =
                          'bg-[#0E172C] text-gray-500 border-white/5 hover:border-purple-400 hover:bg-purple-950/40 cursor-pointer';
                        let content = '';

                        if (cell.status === 'hit') {
                          cellStyle =
                            'bg-rose-600/90 border-rose-400 text-white animate-bounce shadow-[0_0_15px_#F43F5E] cursor-default';
                          content = '💥';
                        } else if (cell.status === 'miss') {
                          cellStyle = 'bg-gray-800 text-gray-500 border-gray-700 cursor-default';
                          content = '✕';
                        }

                        return (
                          <button
                            key={`e-${r}-${c}`}
                            disabled={phase !== 'battle' || turn !== 'player' || gameState !== 'playing'}
                            onClick={() => handlePlayerAttack(r, c)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center font-mono text-[10px] font-bold transition-all ${cellStyle}`}
                          >
                            {content}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};
