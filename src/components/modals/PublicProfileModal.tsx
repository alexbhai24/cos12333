import React from 'react';
import { X, Sparkles, Award, UserCheck, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AvatarDecoration } from '../AvatarDecoration';
import { getUserGradeOrDesignationBadge } from '../../utils/gradeUtils';

export const PublicProfileModal: React.FC = () => {
  const { publicProfileUser, setPublicProfileUser, posts } = useApp();

  if (!publicProfileUser) return null;

  const badgeText = getUserGradeOrDesignationBadge(publicProfileUser);
  const name = publicProfileUser.name || publicProfileUser.displayName || 'Cosmic Student';
  const photoUrl = publicProfileUser.photoUrl || publicProfileUser.photoURL;
  const userPosts = posts.filter(
    (p) => p.authorName.toLowerCase() === name.toLowerCase()
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setPublicProfileUser(null);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[#090C22]/98 border border-[rgba(0,240,255,0.25)] rounded-3xl shadow-[0_20px_50px_rgba(0,240,255,0.25)] p-6 overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#00F0FF]/15 rounded-full filter blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setPublicProfileUser(null)}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Avatar Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2 pb-4 border-b border-white/10 relative z-10">
          <div className="w-24 h-24 flex items-center justify-center">
            <AvatarDecoration decoration={publicProfileUser.decoration || 'supernova'}>
              {photoUrl && !photoUrl.startsWith('gradient:') ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover border border-[#00F0FF] shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#8B5CF6] flex items-center justify-center text-xl font-bold text-white shadow-lg border border-[#00F0FF]">
                  {publicProfileUser.initials || name.substring(0, 2).toUpperCase() || 'ST'}
                </div>
              )}
            </AvatarDecoration>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center justify-center gap-1.5">
              <span>{name}</span>
              <Sparkles className="w-4 h-4 text-[#00F0FF] animate-pulse" />
            </h3>
            {publicProfileUser.username && (
              <p className="text-xs text-[#00F0FF] font-mono mt-0.5">@{publicProfileUser.username}</p>
            )}
          </div>

          {/* Role / Grade / Designation Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0D213A] border border-[rgba(0,240,255,0.3)] rounded-full text-xs font-bold text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]">
            <UserCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>{badgeText}</span>
          </div>

          {/* Optional Gender Chip (ONLY IF PUBLIC) */}
          {publicProfileUser.gender && (
            <div className="text-[10px] text-gray-400 capitalize bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
              Gender: {publicProfileUser.gender}
            </div>
          )}
        </div>

        {/* Public Badges & Achievements */}
        <div className="py-4 border-b border-white/10 space-y-2">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Verified Public Badges & Achievements</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-[#040716] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                🔥 {publicProfileUser.streak || 12}
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-white">Day Streak</div>
                <div className="text-[9px] text-gray-400">Active Learner</div>
              </div>
            </div>

            <div className="bg-[#040716] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                🍏 {publicProfileUser.apples || 450}
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-white">Green Apples</div>
                <div className="text-[9px] text-gray-400">Earned Reward</div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Posts by User */}
        <div className="pt-4 space-y-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Public Academic Posts ({userPosts.length})</span>
          </div>

          {userPosts.length === 0 ? (
            <div className="p-4 bg-[#040716] border border-white/5 rounded-xl text-center text-xs text-gray-400">
              No public posts created yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {userPosts.map((post) => (
                <div key={post.id} className="p-3 bg-[#040716] border border-[rgba(0,240,255,0.1)] rounded-xl text-left space-y-1">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span className="truncate">{post.title}</span>
                    <span className="text-[9px] text-gray-500">{post.timeAgo}</span>
                  </div>
                  <p className="text-[11px] text-gray-300 line-clamp-2">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
