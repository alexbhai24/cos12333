import React, { useState, useRef } from 'react';
import {
  Home,
  Video,
  Wrench,
  Layers,
  ScanLine,
  Camera,
  Upload,
  X,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { PageRoute } from '../types';

interface NavItem {
  id: PageRoute;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',        label: 'Home',    icon: Home },
  { id: 'videos',      label: 'Study',   icon: Video },
  { id: 'tools',       label: 'Tools',   icon: Wrench },
  { id: 'flashcards',  label: 'Cards',   icon: Layers },
];

// ── Quick Add‑Mistake Sheet ────────────────────────────────────────────────────
const ScannerSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote]       = useState('');
  const [done, setDone]       = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleSave = () => {
    if (!note.trim() && !preview) return;
    // Save to localStorage for the MistakeTrackerPage to pick up
    const existing = JSON.parse(localStorage.getItem('cosmicbone_mistakes') || '[]');
    existing.unshift({
      id: Date.now().toString(),
      question: note.trim() || 'Scanned mistake',
      image: preview,
      subject: 'General',
      errorType: 'silly-mistake',
      status: 'pending',
      exam: 'NEET',
      createdAt: new Date().toISOString(),
      isStarred: false,
    });
    localStorage.setItem('cosmicbone_mistakes', JSON.stringify(existing));
    setDone(true);
    setTimeout(() => { setDone(false); onClose(); }, 1200);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-end lg:hidden"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Sheet */}
      <div
        className="relative w-full rounded-t-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg,#0d1226 0%,#080b1a 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
          boxShadow: '0 -16px 60px rgba(0,0,0,0.7)',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,240,255,0.12)', border: '1px solid rgba(0,240,255,0.3)' }}
            >
              <ScanLine className="w-4 h-4" style={{ color: '#00f0ff' }} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Add Mistake</p>
              <p className="text-white/40 text-[10px]">Scan or type your question</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <div className="px-5 pb-8 space-y-4">
          {/* Image preview or upload area */}
          {preview ? (
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: '160px' }}>
              <img src={preview} alt="Mistake scan" className="w-full h-full object-cover" />
              <button
                onClick={() => setPreview(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.6)' }}
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {/* Camera */}
              <button
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl py-5 transition-all active:scale-95"
                style={{
                  background: 'rgba(0,240,255,0.06)',
                  border: '1px solid rgba(0,240,255,0.18)',
                }}
              >
                <Camera className="w-6 h-6" style={{ color: '#00f0ff' }} />
                <span className="text-xs font-medium text-white/70">Take Photo</span>
              </button>

              {/* Upload */}
              <button
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl py-5 transition-all active:scale-95"
                style={{
                  background: 'rgba(168,85,247,0.06)',
                  border: '1px solid rgba(168,85,247,0.2)',
                }}
              >
                <Upload className="w-6 h-6" style={{ color: '#a855f7' }} />
                <span className="text-xs font-medium text-white/70">Upload Image</span>
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFile}
              />
            </div>
          )}

          {/* Note / question text */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe the question or mistake…"
            rows={3}
            className="w-full rounded-2xl px-4 py-3 text-sm text-white resize-none outline-none placeholder:text-white/25"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!note.trim() && !preview}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            style={{
              background: (!note.trim() && !preview)
                ? 'rgba(255,255,255,0.06)'
                : 'linear-gradient(135deg,#00f0ff 0%,#0080ff 100%)',
              color: (!note.trim() && !preview) ? 'rgba(255,255,255,0.3)' : '#000',
              boxShadow: (!note.trim() && !preview) ? 'none' : '0 0 24px rgba(0,240,255,0.35)',
            }}
          >
            {done ? (
              <><CheckCircle2 className="w-4 h-4" /> Saved!</>
            ) : (
              <><BookOpen className="w-4 h-4" /> Save Mistake</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
export const MobileBottomNav: React.FC = () => {
  const { currentRoute, setCurrentRoute } = useApp();
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleNav = (id: PageRoute) => {
    setCurrentRoute(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Content spacer */}
      <div className="h-28 lg:hidden" aria-hidden="true" />

      {/* ── Row: pill + scanner button ─────────────────────────────── */}
      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9000] lg:hidden flex items-center gap-3"
        style={{ width: 'calc(100vw - 32px)', maxWidth: '420px' }}
      >
        {/* ── Dark pill with 4 nav items ── */}
        <nav
          className="flex-1 flex items-center px-2 py-2 rounded-[2rem] backdrop-blur-2xl"
          style={{
            background: 'rgba(8,10,22,0.88)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-[1.4rem] transition-all duration-250 outline-none select-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Active: filled circle background (like reference image) */}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-[1.4rem]"
                    style={{
                      background: 'rgba(255,255,255,0.10)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  />
                )}

                {/* Icon */}
                <span
                  className="relative z-10 flex items-center justify-center w-6 h-6 transition-all duration-250"
                  style={{
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.38)',
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </span>

                {/* Label */}
                <span
                  className="relative z-10 text-[9px] font-medium leading-none transition-all duration-250"
                  style={{ color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)' }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── Scanner circle button (5th — like reference) ── */}
        <button
          onClick={() => setScannerOpen(true)}
          aria-label="Scan and add mistake"
          className="flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-200 active:scale-90 outline-none select-none"
          style={{
            width: '58px',
            height: '58px',
            background: 'rgba(8,10,22,0.90)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {/* Bracket-scan icon exactly like reference */}
          <svg
            width="26" height="26" viewBox="0 0 26 26" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            {/* Top-left corner */}
            <path d="M4 9V4h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Top-right corner */}
            <path d="M22 9V4h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Bottom-left corner */}
            <path d="M4 17v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Bottom-right corner */}
            <path d="M22 17v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Center + icon */}
            <path d="M13 10v6M10 13h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Add Mistake Scanner Sheet ── */}
      {scannerOpen && <ScannerSheet onClose={() => setScannerOpen(false)} />}
    </>
  );
};
