import React, { useEffect, useState } from 'react';
import { X, Heart, Sparkles, Tv, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AppleShopDrawer: React.FC = () => {
  const { user, updateUserProfile, showNotification, isAppleShopOpen, setIsAppleShopOpen } = useApp();

  const todayStr = new Date().toLocaleDateString('en-CA');
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(() => {
    return localStorage.getItem('cosmicbone_last_daily_claim') === todayStr;
  });

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adSecondsLeft, setAdSecondsLeft] = useState(3);

  // Sync claimed state when drawer opens
  useEffect(() => {
    if (isAppleShopOpen) {
      setHasClaimedToday(localStorage.getItem('cosmicbone_last_daily_claim') === todayStr);
    }
  }, [isAppleShopOpen, todayStr]);

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

  // Watch Sponsor clip countdown effect
  useEffect(() => {
    if (!isWatchingAd) return;
    if (adSecondsLeft <= 0) {
      setIsWatchingAd(false);
      const currentApples = user?.apples || 0;
      updateUserProfile({ apples: currentApples + 20 });
      showNotification('📺 Sponsor Clip completed! (+20 Apples Added) 🍏');
      return;
    }

    const timer = setTimeout(() => {
      setAdSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isWatchingAd, adSecondsLeft, user?.apples, updateUserProfile, showNotification]);

  if (!isAppleShopOpen) return null;

  const claimDailyApples = () => {
    const currentApples = user?.apples || 0;
    updateUserProfile({ apples: currentApples + 50 });
    localStorage.setItem('cosmicbone_last_daily_claim', todayStr);
    setHasClaimedToday(true);
    showNotification('🍏 Claimed Daily Bonus! (+50 Apples Added to Balance)');
  };

  const startAdWatch = () => {
    setIsWatchingAd(true);
    setAdSecondsLeft(3);
  };

  const donationCategories = [
    { 
      id: 'dogs', 
      title: 'Street Dogs 🐕', 
      desc: 'Donate 50 🍏 to vaccinate rescue stray dogs.', 
      color: 'from-amber-500/10 to-orange-500/5', 
      border: 'border-amber-500/20 hover:border-amber-500/40', 
      tag: 'Animal Welfare',
      cost: 50
    },
    { 
      id: 'homeless', 
      title: 'Homeless People 🏠', 
      desc: 'Donate 100 🍏 to provide meals & shelter support.', 
      color: 'from-rose-500/10 to-red-500/5', 
      border: 'border-rose-500/20 hover:border-rose-500/40', 
      tag: 'Social Support',
      cost: 100
    },
    { 
      id: 'students', 
      title: 'Underprivileged Students 🎓', 
      desc: 'Donate 150 🍏 to support educational materials.', 
      color: 'from-blue-500/10 to-indigo-500/5', 
      border: 'border-blue-500/20 hover:border-blue-500/40', 
      tag: 'Education Fund',
      cost: 150
    }
  ];

  const handleDonate = (cost: number, title: string) => {
    const currentApples = user?.apples || 0;
    if (currentApples >= cost) {
      updateUserProfile({ apples: currentApples - cost });
      showNotification(`❤️ You donated ${cost} 🍏 to ${title}! Thank you for making a difference.`);
    } else {
      showNotification(`❌ Insufficient Apples! You need ${cost} 🍏 to donate to ${title}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
      {/* Backdrop area (Click anywhere outside popup to close) */}
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => setIsAppleShopOpen(false)} />

      {/* Modal Body - Premium Glassmorphic Sheet */}
      <div className="relative z-10 w-full max-w-[440px] bg-[#0c0f1e]/95 backdrop-blur-xl border border-white/10 rounded-[20px] shadow-[0_24px_50px_rgba(0,0,0,0.8)] p-6 overflow-y-auto max-h-[85vh] animate-in zoom-in-95 duration-200 flex flex-col justify-between scrollbar-none">

        {/* Subtle Decorative Glows */}
        <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-[#37D996]/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-32 bg-pink-500/10 blur-[80px] pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/5 pb-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-white flex items-center space-x-1.5 select-none">
                <span className="text-lg">🍏</span>
                <span className="font-sans tracking-tight">Apple Vault & Giving Hub</span>
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Claim free Green Apples or support a meaningful social cause.
              </p>
            </div>
            <button
              onClick={() => setIsAppleShopOpen(false)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Balance Display */}
          <div className="bg-[#050716]/30 border border-[#37D996]/15 rounded-2xl p-4 flex items-center justify-between shadow-inner">
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Your Balance</div>
              <div className="text-2xl font-black text-white flex items-center space-x-1.5 mt-0.5">
                <span className="drop-shadow-[0_0_6px_rgba(74,222,128,0.4)]">🍏</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#ADF044] font-mono">
                  {user?.apples || 0}
                </span>
                <span className="text-xs text-gray-400 font-normal">Green Apples</span>
              </div>
            </div>
            <div className="text-[10px] text-emerald-400 font-medium max-w-[200px] text-right leading-tight">
              Earn apples by studying daily or harvesting from the Cosmic Apple Orchard!
            </div>
          </div>

          {/* 1. Earn Free Apples Section */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-[#ADF044]/10 border border-[#ADF044]/25 text-[#ADF044]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Claim Free Rewards</h3>
                <p className="text-[10px] text-gray-400">Boost your balance with free daily rewards</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Daily Harvest Reward */}
              <div className="bg-[#040612]/40 border border-white/[0.05] rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-[#37D996] uppercase tracking-wider">Daily Bonus</span>
                    <span className="text-xs font-mono font-black text-[#ADF044] bg-[#ADF044]/10 px-2 py-0.5 rounded">+50 🍏</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Daily Orchard Claim</h4>
                  <p className="text-[10px] text-gray-400 leading-snug">Get 50 free apples once every 24 hours.</p>
                </div>

                <button
                  onClick={claimDailyApples}
                  disabled={hasClaimedToday}
                  className={`w-full py-2.5 rounded-lg text-xs font-black transition-all duration-200 active:scale-95 cursor-pointer uppercase tracking-wider ${
                    hasClaimedToday 
                      ? 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-emerald-500 to-[#ADF044] text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:brightness-110'
                  }`}
                >
                  {hasClaimedToday ? 'Claimed Today ✓' : 'Claim 50 Apples'}
                </button>
              </div>

              {/* Watch Sponsor Clip */}
              <div className="bg-[#040612]/40 border border-white/[0.05] rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-wider">Sponsor support</span>
                    <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">+20 🍏</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Watch Sponsor Clip</h4>
                  <p className="text-[10px] text-gray-400 leading-snug">Support our sponsors and claim 20 free apples.</p>
                </div>

                <button
                  onClick={startAdWatch}
                  disabled={isWatchingAd}
                  className={`w-full py-2.5 rounded-lg text-xs font-black transition-all duration-200 active:scale-95 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                    isWatchingAd 
                      ? 'bg-white/5 border border-white/5 text-cyan-400 cursor-not-allowed' 
                      : 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300'
                  }`}
                >
                  {isWatchingAd ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sponsor Clip ({adSecondsLeft}s)</span>
                    </>
                  ) : (
                    <>
                      <Tv className="w-3.5 h-3.5" />
                      <span>Watch & Earn</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Donation Option Section (Sleek Glassmorphic) */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Heart className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Virtual Giving & Donations</h3>
                <p className="text-[10px] text-gray-400">Spend your Green Apples to support social causes</p>
              </div>
            </div>

            {/* Donation categories */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {donationCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleDonate(cat.cost, cat.title)}
                  className={`group relative overflow-hidden bg-gradient-to-b ${cat.color} ${cat.border} border rounded-xl p-3 cursor-pointer hover:bg-white/[0.04] active:scale-[0.98] transition-all duration-300 flex flex-col justify-between h-[125px]`}
                >
                  <div className="space-y-1">
                    <span className="text-[7px] font-bold text-gray-400 uppercase tracking-wider block">{cat.tag}</span>
                    <h4 className="text-[11px] font-bold text-white group-hover:text-pink-400 transition-colors">{cat.title}</h4>
                    <p className="text-[9px] text-gray-400 leading-tight mt-0.5">{cat.desc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-black text-pink-400 bg-pink-500/15 border border-pink-500/30 px-2 py-0.5 rounded-md">
                      {cat.cost} 🍏
                    </span>
                    <div className="w-5 h-5 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                      <ChevronRightIcon />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[9px] text-gray-500 text-center mt-5 pt-3 border-t border-white/5">
          🍏 100% Free Virtual Economy. Earn apples inside the app, and support designated welfare causes!
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
