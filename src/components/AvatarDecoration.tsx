import React from 'react';

interface AvatarDecorationProps {
  decoration?: string;
  effect?: string;
  className?: string;
  children?: React.ReactNode;
}

export const AvatarDecoration: React.FC<AvatarDecorationProps> = ({
  decoration,
  effect,
  className = '',
  children
}) => {
  const activeDeco = decoration || effect || 'none';
  if (activeDeco === 'none' || !activeDeco) {
    if (!children) return null;
    return <div className={`relative inline-block ${className}`}>{children}</div>;
  }

  const isOverlay = !children;

  return (
    <div className={`${isOverlay ? 'absolute inset-0 pointer-events-none' : 'relative inline-block'} group transition-all duration-300 hover:scale-110 select-none ${className}`}>
      
      {/* The actual avatar inside */}
      {children && (
        <div className="relative z-10 rounded-full overflow-hidden">
          {children}
        </div>
      )}

      {/* --- Discord-style High-Visibility Animated Profile Decorations --- */}
      
      {/* 1. Flowing Energy (Thicker rotating neon border) */}
      {activeDeco === 'energy' && (
        <div className="absolute inset-[-6px] rounded-full z-0 overflow-hidden pointer-events-none shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#00F0FF,#FF007A,#E2E8F0,#00F0FF)] deco-rotate-cw rounded-full blur-[2px] opacity-100 group-hover:blur-[3px] transition-all" />
          <div className="absolute inset-[3px] bg-[var(--bg-surface-solid)] rounded-full z-0" />
        </div>
      )}

      {/* 2. Cosmic Rings (Thick contrasting double rings with glow) */}
      {activeDeco === 'rings' && (
        <div className="absolute inset-[-8px] rounded-full z-0 pointer-events-none">
          {/* Cyan Outer ring */}
          <div className="absolute inset-[1px] rounded-full border-2 border-cyan-400 deco-rotate-cw shadow-[0_0_12px_rgba(6,182,212,0.6)] transition-all" />
          {/* Violet Inner ring */}
          <div className="absolute inset-[4px] rounded-full border-2 border-dashed border-violet-400 deco-rotate-ccw shadow-[0_0_8px_rgba(139,92,246,0.5)] transition-all" />
        </div>
      )}

      {/* 3. Orbiting Particles (Thicker dashed orbit + larger glowing dots) */}
      {activeDeco === 'orbit' && (
        <div className="absolute inset-[-8px] rounded-full z-0 pointer-events-none">
          <div className="absolute inset-[3px] rounded-full border-2 border-dashed border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]" />
          {/* Orbit particle 1 */}
          <div className="absolute inset-0 deco-rotate-cw">
            <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF,0_0_20px_#00F0FF]" />
          </div>
          {/* Orbit particle 2 */}
          <div className="absolute inset-0 deco-rotate-ccw" style={{ animationDuration: '5s' }}>
            <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#FF007A] shadow-[0_0_10px_#FF007A,0_0_20px_#FF007A]" />
          </div>
        </div>
      )}

      {/* 4. Flames (Vibrant orange/gold border + revolving flame sparks) */}
      {activeDeco === 'flame' && (
        <div className="absolute inset-[-6px] rounded-full z-0 pointer-events-none">
          <div className="absolute inset-[1px] rounded-full border-2 border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)] transition-all" />
          {/* Fire spark 1 */}
          <div className="absolute inset-0 deco-rotate-cw" style={{ animationDuration: '4s' }}>
            <div className="absolute top-0 right-1 w-3 h-3 rounded-full bg-amber-400 blur-[0.5px] shadow-[0_0_8px_#F59E0B]" />
          </div>
          {/* Fire spark 2 */}
          <div className="absolute inset-0 deco-rotate-ccw" style={{ animationDuration: '6s' }}>
            <div className="absolute bottom-0 left-1 w-3 h-3 rounded-full bg-red-500 blur-[0.5px] shadow-[0_0_8px_#EF4444]" />
          </div>
        </div>
      )}

      {/* 5. Holographic Glitch (Neon pink border with pulsing glitch lines) */}
      {activeDeco === 'glitch' && (
        <div className="absolute inset-[-6px] rounded-full z-0 pointer-events-none deco-glitch">
          <div className="absolute inset-0 rounded-full border-2 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.6)] transition-all" />
          <div className="absolute top-1/4 left-[-2px] right-[-2px] h-[2px] bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
          <div className="absolute bottom-1/3 left-[-2px] right-[-2px] h-[2px] bg-pink-400 shadow-[0_0_8px_#F472B6]" />
        </div>
      )}

      {/* 6. Hyper Shield (Cyber neon shield decoration) */}
      {activeDeco === 'shield' && (
        <div className="absolute inset-[-8px] rounded-full z-0 pointer-events-none deco-shield">
          {/* Outer high-tech ring */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/80 border-double shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          {/* Inner tech tick ring */}
          <div className="absolute inset-[3px] rounded-full border border-dashed border-cyan-300/40" />
        </div>
      )}

      {/* 7. Supernova Spark (Continuous intense glow with energy particles) */}
      {activeDeco === 'supernova' && (
        <div className="absolute inset-[-8px] rounded-full z-0 pointer-events-none deco-supernova">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF0055]/30 to-[#FF5500]/30 border-2 border-[#FF0055] blur-[1px]" />
          {/* Orbiting core spark */}
          <div className="absolute inset-0 deco-rotate-cw" style={{ animationDuration: '2.5s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FFF] shadow-[0_0_10px_#FF5500,0_0_20px_#FF0055]" />
          </div>
        </div>
      )}

      {/* 8. Quantum Web (Concentric interlocking energy orbits) */}
      {activeDeco === 'web' && (
        <div className="absolute inset-[-8px] rounded-full z-0 pointer-events-none deco-web">
          {/* Orbital path 1 */}
          <div className="absolute inset-0 rounded-full border border-violet-500/30" />
          {/* Orbital path 2 */}
          <div className="absolute inset-[3px] rounded-full border border-cyan-500/20" />
          {/* Interlocking nodes */}
          <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#8B5CF6]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06B6D4]" />
        </div>
      )}

    </div>
  );
};
