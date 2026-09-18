import React, { useState } from 'react';
import {
  Sparkles,
  Edit,
  Plus,
  Eye,
  Trash2,
  AlertTriangle,
  Globe,
  BarChart3,
} from 'lucide-react';
import type { PortfolioProfile } from '../../types/portfolio';
import { portfolioService } from '../../services/portfolioService';
import { useApp } from '../../context/AppContext';
import { AvatarDecoration } from '../AvatarDecoration';

interface MyPortfolioTabProps {
  portfolio: PortfolioProfile | null;
  onEdit: (step?: 1 | 2 | 3 | 4 | 5) => void;
  onPreview: (portfolio: PortfolioProfile) => void;
  onCreateNew: () => void;
}

export const MyPortfolioTab: React.FC<MyPortfolioTabProps> = ({
  portfolio,
  onEdit,
  onPreview,
  onCreateNew,
}) => {
  const { showNotification } = useApp();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (!portfolio) {
    return (
      <div className="py-16 text-center bg-[#090C22]/60 border border-[rgba(0,240,255,0.2)] rounded-3xl p-8 space-y-4 max-w-xl mx-auto shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 mx-auto flex items-center justify-center text-[#00F0FF]">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-heading">You Haven't Created a Portfolio Yet</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Showcase your projects, coding accomplishments, design work, and academic research to the CosmicBone community.
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] text-black font-extrabold text-xs rounded-xl shadow-lg hover:from-[#00D4E0] hover:to-[#70B8FF] transition-all"
        >
          Create Portfolio Now 🚀
        </button>
      </div>
    );
  }

  // Completion calculation
  const hasBio = !!portfolio.bio;
  const hasSkills = portfolio.skills.length > 0;
  const hasProject = portfolio.projects.length > 0;
  const hasContacts = Object.values(portfolio.contacts).some(v => !!v);
  const completionScore = [hasBio, hasSkills, hasProject, hasContacts].filter(Boolean).length * 25;

  const handleDelete = () => {
    portfolioService.deletePortfolio(portfolio.id);
    showNotification('Portfolio deleted.');
    setDeleteConfirmOpen(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#06101F] via-[#09182D] to-[#0A1428] p-6 rounded-3xl border border-[rgba(0,240,255,0.25)] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <img
              src={portfolio.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={portfolio.fullName}
              className="w-full h-full rounded-full object-cover border-2 border-[#00F0FF]"
            />
            {portfolio.profileEffect && (
              <AvatarDecoration effect={portfolio.profileEffect} className="scale-75 -inset-1" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white font-heading">{portfolio.fullName}</h2>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full uppercase">
                {portfolio.status}
              </span>
            </div>
            <p className="text-xs text-cyan-300 font-semibold">{portfolio.headline}</p>
            <span className="text-[11px] text-gray-400 block">{portfolio.publicRoleLabel}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => onPreview(portfolio)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Preview Public</span>
          </button>

          <button
            onClick={() => onEdit(1)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-[#00F0FF] hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all"
          >
            <Edit className="w-3.5 h-3.5 text-black" />
            <span>Edit Portfolio</span>
          </button>

          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="p-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 rounded-xl transition-all"
            title="Delete Portfolio"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics & Completion Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Completion Score */}
        <div className="bg-[#090C22] border border-[rgba(0,240,255,0.15)] rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-gray-400 uppercase">Completion Score</span>
            <span className="text-[#00F0FF]">{completionScore}%</span>
          </div>
          <div className="w-full h-2 bg-[#040612] rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] transition-all duration-500"
              style={{ width: `${completionScore}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 block">
            {completionScore === 100 ? '✓ Complete profile' : 'Add project details to hit 100%'}
          </span>
        </div>

        {/* Total Views */}
        <div className="bg-[#090C22] border border-[rgba(0,240,255,0.15)] rounded-2xl p-4 space-y-1">
          <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold uppercase">
            <BarChart3 className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Total Views</span>
          </div>
          <div className="text-2xl font-black text-white">{portfolio.viewsCount || 0}</div>
          <span className="text-[10px] text-emerald-400 block">Community Impressions</span>
        </div>

        {/* Public Contacts Status */}
        <div className="bg-[#090C22] border border-[rgba(0,240,255,0.15)] rounded-2xl p-4 space-y-1">
          <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold uppercase">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Contact Privacy</span>
          </div>
          <div className="text-xs text-gray-300 pt-1 flex flex-wrap gap-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${portfolio.contactVisibility.phone === 'public' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-400'}`}>
              Phone: {portfolio.contactVisibility.phone}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${portfolio.contactVisibility.email === 'public' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-400'}`}>
              Email: {portfolio.contactVisibility.email}
            </span>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-heading">Your Portfolio Projects</h3>
          <button
            onClick={() => onEdit(2)}
            className="text-xs text-[#00F0FF] font-bold hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolio.projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-[#090C22] border border-white/10 p-4 rounded-2xl flex gap-4 items-center justify-between"
            >
              <div className="w-16 h-16 rounded-xl bg-black overflow-hidden flex-shrink-0 border border-white/10">
                <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{proj.title}</h4>
                <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{proj.shortDescription}</p>
                <span className="text-[10px] text-cyan-400 font-bold mt-1 inline-block">${proj.price || 49}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-[#060918] border border-red-500/30 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Delete Portfolio?</h3>
              <p className="text-xs text-gray-400">
                This action will remove your portfolio from the explorer grid. You can create a new portfolio at any time.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 bg-white/5 text-gray-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
