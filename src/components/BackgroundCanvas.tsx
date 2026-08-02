import React from 'react';
import { useApp } from '../context/AppContext';

const BG_MAP: Record<string, string> = {
  'lighthouse':    '/bg_lighthouse.jpg',
  'snowy-tree':    '/bg_snowy_tree.jpg',
  'canyon-castle': '/bg_canyon_castle.jpg',
  'canyon-deck':   '/bg_canyon_deck.jpg',
  'castle-boats':  '/bg_castle_boats.jpg',
  'village-boat':  '/bg_village_boat.jpg',
};

export const BackgroundCanvas: React.FC = () => {
  const { background } = useApp();

  const src = BG_MAP[background] ?? BG_MAP['lighthouse'];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[var(--bg-app)]" style={{ transition: 'background-color 0.5s ease' }}>
      {/* Full-bleed background image - object-cover stretches to fill */}
      <img
        key={src}
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.22] mix-blend-lighten"
        style={{ transition: 'opacity 0.6s ease' }}
      />

      {/*
        Intelligent overlay:
        - Slight gradient from bottom so text on cards is still readable
        - Keep it light (35% dark) so the artwork remains clearly visible
        - No blur – blurring was killing the image quality
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.50) 100%)',
        }}
      />
    </div>
  );
};
