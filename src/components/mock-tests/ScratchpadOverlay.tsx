import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Pencil, Eraser, Trash2, X } from 'lucide-react';

interface ScratchpadOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  id: string;
  color: string;
  width: number;
  points: Point[];
}

const COLORS = [
  { id: 'yellow', hex: '#facc15', label: 'Yellow' },
  { id: 'cyan', hex: '#38bdf8', label: 'Cyan' },
  { id: 'white', hex: '#ffffff', label: 'White' },
  { id: 'emerald', hex: '#4ade80', label: 'Green' },
  { id: 'rose', hex: '#f43f5e', label: 'Pink' },
];

function distToSegmentSquared(p: Point, v: Point, w: Point) {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return (p.x - v.x) ** 2 + (p.y - v.y) ** 2;
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return (p.x - (v.x + t * (w.x - v.x))) ** 2 + (p.y - (v.y + t * (w.y - v.y))) ** 2;
}

function doesEraserTouchStroke(eraserPt: Point, stroke: Stroke, radius = 22): boolean {
  const radiusSq = (radius + stroke.width) * (radius + stroke.width);
  if (stroke.points.length <= 1) {
    const pt = stroke.points[0];
    if (!pt) return false;
    return ((eraserPt.x - pt.x) ** 2 + (eraserPt.y - pt.y) ** 2) <= radiusSq;
  }
  for (let i = 0; i < stroke.points.length - 1; i++) {
    if (distToSegmentSquared(eraserPt, stroke.points[i], stroke.points[i + 1]) <= radiusSq) {
      return true;
    }
  }
  return false;
}

export const ScratchpadOverlay: React.FC<ScratchpadOverlayProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const eraserCursorRef = useRef<HTMLDivElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#facc15');
  const [isEraser, setIsEraser] = useState(false);
  const LINE_WIDTH = 3;

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length === 0) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;

    if (stroke.points.length === 1) {
      ctx.fillStyle = stroke.color;
      ctx.beginPath();
      ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Draw all strokes
    strokesRef.current.forEach(stroke => {
      drawStroke(ctx, stroke);
    });

    if (currentStrokeRef.current) {
      drawStroke(ctx, currentStrokeRef.current);
    }
  }, []);

  const setupCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    redrawCanvas();
  }, [redrawCanvas]);

  // Handle window resizing
  useEffect(() => {
    setupCanvasSize();
    window.addEventListener('resize', setupCanvasSize);
    return () => window.removeEventListener('resize', setupCanvasSize);
  }, [setupCanvasSize]);

  // When isOpen changes to true, resize and redraw in case layout shifted
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setupCanvasSize();
      });
    }
  }, [isOpen, setupCanvasSize]);

  // Sync cursor visibility when tool changes
  useEffect(() => {
    if (eraserCursorRef.current && !isEraser) {
      eraserCursorRef.current.style.opacity = '0';
    }
  }, [isEraser]);

  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const eraseStrokesAtPoint = (point: Point) => {
    const initialCount = strokesRef.current.length;
    strokesRef.current = strokesRef.current.filter(stroke => !doesEraserTouchStroke(point, stroke));
    if (strokesRef.current.length !== initialCount) {
      redrawCanvas();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    setIsDrawing(true);

    if (eraserCursorRef.current && isEraser) {
      eraserCursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      eraserCursorRef.current.style.opacity = '1';
    }

    if (isEraser) {
      eraseStrokesAtPoint(coords);
    } else {
      const newStroke: Stroke = {
        id: Math.random().toString(36).substring(2, 9),
        color,
        width: LINE_WIDTH,
        points: [coords],
      };
      currentStrokeRef.current = newStroke;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, LINE_WIDTH / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Live update floating eraser on mouse point
    if (eraserCursorRef.current) {
      eraserCursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (isEraser) {
        eraserCursorRef.current.style.opacity = '1';
      }
    }

    if (!isDrawing) return;
    const coords = getCanvasCoordinates(e);

    if (isEraser) {
      eraseStrokesAtPoint(coords);
    } else if (currentStrokeRef.current) {
      const points = currentStrokeRef.current.points;
      const lastPoint = points[points.length - 1];
      points.push(coords);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && lastPoint) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = LINE_WIDTH;
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (eraserCursorRef.current) {
      eraserCursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (isEraser) {
        eraserCursorRef.current.style.opacity = '1';
      }
    }
  };

  const handlePointerLeave = () => {
    if (eraserCursorRef.current) {
      eraserCursorRef.current.style.opacity = '0';
    }
    handlePointerUp();
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (!isEraser && currentStrokeRef.current) {
      strokesRef.current.push(currentStrokeRef.current);
      currentStrokeRef.current = null;
    }
  };

  const handleClear = () => {
    strokesRef.current = [];
    currentStrokeRef.current = null;
    redrawCanvas();
  };

  return (
    <div
      className={`fixed inset-0 z-40 select-none ${
        isOpen ? 'pointer-events-none opacity-100' : 'pointer-events-none opacity-0 invisible pointer-events-none hidden'
      }`}
    >
      {/* Interactive Drawing Canvas Layer */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="absolute inset-0 w-full h-full pointer-events-auto touch-none"
        style={{
          cursor: isEraser ? 'none' : 'crosshair',
        }}
      />

      {/* Floating Eraser following Mouse Point */}
      <div
        ref={eraserCursorRef}
        className="fixed top-0 left-0 -ml-4 -mt-4 pointer-events-none z-50 flex items-center justify-center opacity-0 transition-opacity duration-75 select-none"
        style={{ willChange: 'transform' }}
      >
        {/* Radius circle indicator */}
        <div className="w-10 h-10 rounded-full border-2 border-rose-400 bg-rose-500/20 shadow-md absolute animate-pulse" />
        {/* Eraser icon badge */}
        <div className="p-1.5 rounded-lg bg-rose-600 text-white shadow-2xl border border-white/80 flex items-center justify-center relative">
          <Eraser className="w-4 h-4 drop-shadow" />
        </div>
      </div>

      {/* Floating Scratchpad Toolbar */}
      <div className="absolute top-16 right-4 sm:right-6 pointer-events-auto z-50 flex items-center gap-1.5 p-1.5 sm:p-2 rounded-2xl bg-[#12141f]/95 border border-white/15 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-3 duration-200">
        {/* Pen Toggle */}
        <button
          onClick={() => setIsEraser(false)}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            !isEraser ? 'bg-amber-400 text-black shadow-md font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Pen Tool"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Color Palette (Always open, even when eraser is selected) */}
        <div className="flex items-center gap-1.5 px-1">
          {COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setColor(c.hex);
                setIsEraser(false);
              }}
              className={`w-5 h-5 rounded-full transition-transform cursor-pointer border ${
                !isEraser && color === c.hex ? 'scale-125 border-white shadow-md ring-1 ring-white/50' : 'border-transparent opacity-75 hover:opacity-100 hover:scale-110'
              }`}
              style={{ backgroundColor: c.hex }}
              title={`Switch to ${c.label} pen`}
            />
          ))}
        </div>

        {/* Eraser Toggle (Erases entire continuous stroke) */}
        <button
          onClick={() => setIsEraser(true)}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isEraser ? 'bg-rose-500 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Stroke Eraser (Touch line to erase entire continuous stroke)"
        >
          <Eraser className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-white/10 mx-0.5" />

        {/* Clear Canvas */}
        <button
          onClick={handleClear}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Clear all drawings"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Close Button (Preserves drawing when reopened) */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Close Rough Pad (Drawings preserved)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
