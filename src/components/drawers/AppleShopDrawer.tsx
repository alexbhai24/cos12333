import React, { useEffect } from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AppleShopDrawer: React.FC = () => {
  const { isAppleShopOpen, setIsAppleShopOpen, setIsQrModalOpen } = useApp();

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isAppleShopOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAppleShopOpen]);

  if (!isAppleShopOpen) return null;

  const applePacks = [
    { count: 100, price: 100, applesCountImg: 3, label: 'Starter Pack' },
    { count: 200, price: 200, applesCountImg: 5, label: 'Popular Pack' },
    { count: 300, price: 300, applesCountImg: 7, label: 'Value Pack' },
    { count: 400, price: 400, applesCountImg: 9, label: 'Pro Pack' },
    { count: 500, price: 500, applesCountImg: 11, label: 'Champion Pack' },
  ];

  const donationCategories = [
    { id: 'dogs', title: 'Street Dogs 🐕', desc: 'Feed & vaccinate rescue stray dogs.', color: 'from-amber-500/10 to-orange-500/5', border: 'border-amber-500/20 hover:border-amber-500/40', tag: 'Animal Welfare' },
    { id: 'homeless', title: 'Homeless People 🏠', desc: 'Provide meals, blankets & shelter support.', color: 'from-rose-500/10 to-red-500/5', border: 'border-rose-500/20 hover:border-rose-500/40', tag: 'Social Support' },
    { id: 'students', title: 'Underprivileged Students 🎓', desc: 'Support educational materials & tech devices.', color: 'from-blue-500/10 to-indigo-500/5', border: 'border-blue-500/20 hover:border-blue-500/40', tag: 'Education Fund' }
  ];

  const handleAction = () => {
    setIsQrModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {/* Backdrop area (Click anywhere outside popup to close) */}
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => setIsAppleShopOpen(false)} />

      {/* Modal Body - Premium Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-lg bg-gradient-to-b from-[#0c0f24] to-[#050714] border border-white/10 rounded-[2rem] shadow-[0_24px_50px_rgba(0,0,0,0.5)] p-6 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300 flex flex-col justify-between scrollbar-premium">
        
        {/* Subtle Decorative Glows */}
        <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-[#37D996]/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-32 bg-pink-500/10 blur-[80px] pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white flex items-center space-x-2">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 drop-shadow-[0_0_8px_rgba(173,240,68,0.6)]">
                  <path d="M12 21.5c-2.3 0-5.8-1.5-5.8-6.2c0-3.3 2.1-5.3 4.8-5.3c.6 0 1 .1 1 .1s.4-.1 1-.1c2.7 0 4.8 2 4.8 5.3c0 4.7-3.5 6.2-5.8 6.2z" fill="#ADF044" />
                  <path d="M12 10c0-1.8-.8-3.2-1.3-3.7" stroke="#7A5228" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12.5 6.3c1.8-.9 4.1-.4 4.5.9c.4 1.3-1.3 2.3-3.1 2.3c-.4 0-1.4-1.3-1.4-3.2z" fill="#87E024" />
                </svg>
                <span className="text-white font-heading tracking-tight">Apple Shop & Giving</span>
              </h2>
              <p className="text-xs text-gray-400">
                Acquire Green Apples or support a meaningful social cause.
              </p>
            </div>
            <button
              onClick={() => setIsAppleShopOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all duration-200 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Donation Option Section (Sleek Glassmorphic) */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Heart className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Social Giving & Donations</h3>
                <p className="text-[10px] text-gray-400">100% of contributions go directly to the designated cause</p>
              </div>
            </div>

            {/* Donation categories */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {donationCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={handleAction}
                  className={`group relative overflow-hidden bg-gradient-to-b ${cat.color} ${cat.border} border rounded-xl p-3.5 cursor-pointer hover:bg-white/[0.04] active:scale-[0.98] transition-all duration-300 flex flex-col justify-between h-[110px]`}
                >
                  <div className="space-y-1">
                    <span className="text-[7px] font-bold text-gray-400 uppercase tracking-wider block">{cat.tag}</span>
                    <h4 className="text-[11px] font-bold text-white group-hover:text-pink-400 transition-colors">{cat.title}</h4>
                    <p className="text-[9px] text-gray-400 leading-tight line-clamp-2 mt-0.5">{cat.desc}</p>
                  </div>
                  <div className="flex justify-end pt-2">
                    <div className="w-5 h-5 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                      <ChevronRightIcon />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Apple Packs Store */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-[#ADF044]/10 border border-[#ADF044]/25 text-[#ADF044]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Get Green Apples</h3>
                <p className="text-[10px] text-gray-400">Boost your balance with apple packs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {applePacks.map((pack, idx) => (
                <div
                  key={pack.count}
                  onClick={handleAction}
                  className={`bg-[#040612]/60 hover:bg-white/[0.04] border border-white/5 hover:border-[#37D996]/30 rounded-xl p-3.5 cursor-pointer transition-all duration-300 flex items-center justify-between group active:scale-[0.99] ${
                    idx === applePacks.length - 1 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Apple icon display */}
                    <div className="flex -space-x-1.5 items-center flex-shrink-0">
                      {Array.from({ length: Math.min(pack.applesCountImg, 4) }).map((_, aIdx) => (
                        <span 
                          key={aIdx} 
                          className="text-lg filter drop-shadow-[0_0_4px_rgba(173,240,68,0.5)] transform group-hover:scale-110 transition-transform"
                          style={{ zIndex: 10 - aIdx }}
                        >
                          🍏
                        </span>
                      ))}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[8px] font-bold text-[#37D996] uppercase tracking-wider block">{pack.label}</span>
                      <div className="text-xs font-bold text-white truncate">{pack.count} Apples</div>
                    </div>
                  </div>

                  <span className="text-[11px] font-black text-[#37D996] bg-[#37D996]/10 border border-[#37D996]/20 px-2.5 py-1 rounded-lg">
                    ₹{pack.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[9px] text-gray-500 text-center mt-5 pt-3 border-t border-white/5">
          🔒 Payments secured by GPay UPI. Scan to complete purchase.
        </div>
      </div>
    </div>
  );
};

const ChevronRightIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5 text-gray-400 group-hover:text-white transition-colors">
    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
