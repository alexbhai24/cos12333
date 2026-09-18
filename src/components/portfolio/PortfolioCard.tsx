import React from 'react';
import { Eye, Award } from 'lucide-react';
import type { PortfolioProfile } from '../../types/portfolio';
import { AvatarDecoration } from '../AvatarDecoration';

interface PortfolioCardProps {
  portfolio: PortfolioProfile;
  onOpenDetail: (portfolio: PortfolioProfile) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio, onOpenDetail }) => {
  const primaryProject = portfolio.projects[0];
  const coverImage = primaryProject?.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
  const startingPrice = primaryProject?.price || portfolio.serviceTiers?.[0]?.price;

  return (
    <div
      onClick={() => onOpenDetail(portfolio)}
      className="bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-2xl border border-white/10 hover:border-white/20 hover:bg-white/[0.06] rounded-2xl sm:rounded-[2rem] p-2.5 sm:p-4 shadow-2xl hover:shadow-[0_16px_48px_rgba(0,240,255,0.15)] transition-all duration-500 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
    >
      {/* Subtle Inner Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-[#00F0FF]/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Cover Image & Category Badge */}
      <div className="space-y-2.5 sm:space-y-4">
        <div className="relative w-full h-32 sm:h-48 rounded-xl sm:rounded-2xl overflow-hidden bg-[#040612] group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500">
          <div className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out">
            <img
              src={coverImage}
              alt={primaryProject?.title || portfolio.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category Tag */}
          <span className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 bg-black/40 backdrop-blur-md border border-white/10 text-gray-200 text-[8.5px] sm:text-[10px] font-bold rounded-lg sm:rounded-xl tracking-widest uppercase shadow-sm">
            {portfolio.category || 'Portfolio'}
          </span>

          {/* Achievement Badge */}
          {portfolio.achievementBadge && (
            <span className="absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[8.5px] sm:text-[10px] font-black rounded-lg sm:rounded-xl shadow-lg flex items-center gap-1 sm:gap-1.5 uppercase tracking-wider">
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              <span className="truncate max-w-[60px] sm:max-w-none">{portfolio.achievementBadge}</span>
            </span>
          )}

          {/* Views count indicator */}
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex items-center space-x-1 sm:space-x-1.5 text-[8.5px] sm:text-[10px] font-semibold text-gray-300 bg-black/40 backdrop-blur-md border border-white/10 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl">
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
            <span>{portfolio.viewsCount || 120}</span>
          </div>
        </div>

        {/* Project Title & Short Description */}
        <div className="space-y-1 sm:space-y-1.5 px-0.5 sm:px-1 relative z-10">
          <h3 className="text-xs sm:text-[17px] font-bold text-white group-hover:text-[#00F0FF] transition-colors line-clamp-1 font-heading tracking-tight">
            {primaryProject?.title || portfolio.headline}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {primaryProject?.shortDescription || portfolio.bio}
          </p>
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-2 pt-0.5 sm:pt-1 px-0.5 sm:px-1">
          {portfolio.skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-white/5 border border-white/10 text-gray-300 text-[8.5px] sm:text-[10px] rounded-lg sm:rounded-xl font-medium tracking-wide shadow-sm truncate max-w-[80px] sm:max-w-none"
            >
              {skill}
            </span>
          ))}
          {portfolio.skills.length > 2 && (
            <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-white/5 border border-white/10 text-gray-400 text-[8.5px] sm:text-[10px] rounded-lg sm:rounded-xl font-medium">
              +{portfolio.skills.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Creator Info Footer */}
      <div className="pt-2.5 sm:pt-4 mt-3 sm:mt-5 border-t border-white/10 flex items-center justify-between gap-1.5 sm:gap-3 px-0.5 sm:px-1 relative z-10">
        {/* Creator Identity */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="relative w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0">
            <img
              src={portfolio.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={portfolio.fullName}
              className="w-full h-full rounded-full object-cover border border-white/20"
            />
            {portfolio.profileEffect && (
              <AvatarDecoration effect={portfolio.profileEffect} className="scale-75 -inset-1" />
            )}
          </div>

          <div className="min-w-0">
            <h4 className="text-[11px] sm:text-[13px] font-bold text-gray-100 truncate">{portfolio.fullName}</h4>
            <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium block truncate tracking-wide">
              {portfolio.publicRoleLabel}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="text-right flex-shrink-0">
          {startingPrice ? (
            <div className="bg-white/5 border border-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl backdrop-blur-sm">
              <span className="text-[8px] text-gray-400 block uppercase font-bold tracking-widest">Starts at</span>
              <span className="text-sm font-black text-white">₹{startingPrice}</span>
            </div>
          ) : (
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-xl transition-all shadow-sm">
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
