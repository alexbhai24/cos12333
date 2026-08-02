import React from 'react';
import { ShieldX } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccessDeniedPage: React.FC = () => {
  const { setCurrentRoute } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Glowing shield icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-red-500/20 blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <ShieldX className="w-10 h-10 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
        Access Denied
      </h2>

      {/* Description */}
      <p className="text-[var(--text-muted)] mb-2 max-w-md leading-relaxed">
        You don't have the required permissions to view this page.
      </p>
      <p className="text-[var(--text-muted)] text-sm mb-8 max-w-md">
        This area is restricted to authorized personnel only. If you believe this is an error, please contact the administrator.
      </p>

      {/* Return Home button */}
      <button
        onClick={() => setCurrentRoute('home')}
        className="px-8 py-3 bg-gradient-to-r from-[var(--color-cyan)]/20 to-[var(--color-primary)]/20 text-[var(--color-cyan)] rounded-2xl font-semibold border border-[var(--color-cyan)]/30 hover:border-[var(--color-cyan)]/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300 active:scale-95"
      >
        Return Home
      </button>
    </div>
  );
};
