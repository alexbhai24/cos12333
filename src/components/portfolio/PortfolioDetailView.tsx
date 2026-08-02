import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Eye,
  Award,
  Clock,
  Check,
  ExternalLink,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Play,
  ChevronRight,
  Share2,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import type { PortfolioProfile, ServiceTier } from '../../types/portfolio';
import { portfolioService } from '../../services/portfolioService';
import { useApp } from '../../context/AppContext';
import { AvatarDecoration } from '../AvatarDecoration';

interface PortfolioDetailViewProps {
  portfolio: PortfolioProfile;
  onBack: () => void;
  onSelectPortfolio?: (portfolio: PortfolioProfile) => void;
  allPortfolios?: PortfolioProfile[];
}

const SocialIcon: React.FC<{ type: string; className?: string }> = ({ type, className = 'w-4 h-4' }) => {
  if (type === 'github') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    );
  }
  if (type === 'linkedin') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  if (type === 'instagram') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  return <Globe className={className} />;
};

export const PortfolioDetailView: React.FC<PortfolioDetailViewProps> = ({
  portfolio,
  onBack,
  onSelectPortfolio,
  allPortfolios = [],
}) => {
  const { showNotification, openPublicProfile } = useApp();

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedTierLevel, setSelectedTierLevel] = useState<'starter' | 'standard' | 'advanced'>('starter');
  const [isReadMore, setIsReadMore] = useState(false);

  const activeProject = portfolio.projects[activeProjectIndex] || portfolio.projects[0] || null;

  useEffect(() => {
    setActiveImageIndex(0);
    setIsReadMore(false);
  }, [activeProjectIndex]);

  const gallery = activeProject?.galleryImages?.length
    ? activeProject.galleryImages
    : [activeProject?.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'];

  const sanitizedVideoUrl = portfolioService.sanitizeEmbedUrl(activeProject?.videoEmbedUrl);

  const activeTier: ServiceTier | undefined = portfolio.serviceTiers?.find(
    t => t.tierLevel === selectedTierLevel
  ) || portfolio.serviceTiers?.[0];

  const handleContactClick = (type: string, value?: string) => {
    if (!value) {
      showNotification(`Creator has not shared public ${type}.`);
      return;
    }
    if (type === 'whatsapp') {
      window.open(value.startsWith('http') ? value : `https://wa.me/${value.replace(/\D/g, '')}`, '_blank');
    } else if (type === 'phone') {
      window.location.href = `tel:${value}`;
    } else if (type === 'email') {
      window.location.href = `mailto:${value}`;
    } else {
      window.open(value.startsWith('http') ? value : `https://${value}`, '_blank');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#portfolio?id=${portfolio.id}`;
    navigator.clipboard.writeText(shareUrl);
    showNotification('Portfolio link copied to clipboard! 📋');
  };

  const related = allPortfolios.filter(p => p.id !== portfolio.id).slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Top Header Bar with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#090C22]/90 p-4 sm:p-5 rounded-3xl border border-[rgba(0,240,255,0.22)] shadow-2xl">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white flex items-center space-x-2 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 text-[#00F0FF] group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-extrabold">Back to Explorer</span>
          </button>

          <span className="hidden sm:inline px-3 py-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold rounded-full uppercase tracking-wider">
            {portfolio.category}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-gray-400">
          <div className="flex items-center space-x-1.5 bg-[#040612] px-3 py-1.5 rounded-xl border border-white/5">
            <Eye className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>{portfolio.viewsCount || 0} Views</span>
          </div>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title="Share Portfolio Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Full-Page Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 Cols): Projects selector, gallery, details, video */}
        <div className="lg:col-span-8 space-y-6">
          {/* Projects Selector Tab Bar if creator has multiple projects */}
          {portfolio.projects.length > 1 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                Select Project ({portfolio.projects.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {portfolio.projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    onClick={() => setActiveProjectIndex(idx)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                      activeProjectIndex === idx
                        ? 'bg-[var(--bg-surface-secondary)] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                        : 'bg-[#090C22]/80 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/5">
                      <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold truncate ${
                        activeProjectIndex === idx ? 'text-[#00F0FF]' : 'text-white'
                      }`}>
                        {proj.title}
                      </h4>
                      <span className="text-[9px] text-gray-500 font-semibold block uppercase">
                        ₹{proj.price || 49} | {proj.deliveryTime || '3 Days'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Project Header Showcase */}
          {activeProject ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#00F0FF] uppercase tracking-wider">
                  Active Project Specialization &gt; {activeProject.category || portfolio.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
                  {activeProject.title}
                </h1>
                <p className="text-xs text-gray-450 leading-relaxed max-w-2xl">
                  {activeProject.shortDescription}
                </p>
              </div>

              {/* Main Media Gallery */}
              <div className="space-y-3">
                <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden bg-black border border-[rgba(0,240,255,0.18)] relative shadow-2xl">
                  <img
                    src={gallery[activeImageIndex] || gallery[0]}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                  {portfolio.achievementBadge && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-xs rounded-full shadow-xl flex items-center gap-1 uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5" />
                      <span>{portfolio.achievementBadge}</span>
                    </span>
                  )}
                </div>

                {/* Gallery Thumbnails */}
                {gallery.length > 1 && (
                  <div className="flex space-x-2.5 overflow-x-auto pb-1 scrollbar-none">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                          activeImageIndex === idx
                            ? 'border-[#00F0FF] scale-105 shadow-md shadow-cyan-500/30'
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sanitized Video Preview (if added) */}
              {sanitizedVideoUrl && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Play className="w-4 h-4 text-[#00F0FF]" />
                    <span>Project Demo & Video Walkthrough</span>
                  </h3>
                  <div className="w-full aspect-video rounded-3xl overflow-hidden border border-[rgba(0,240,255,0.2)] bg-black shadow-2xl">
                    <iframe
                      src={sanitizedVideoUrl}
                      title="Project Video Showcase"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Full Details & Description */}
              <div className="bg-[#090C22] p-6 rounded-3xl border border-[rgba(0,240,255,0.15)] space-y-3 shadow-xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  Project Details & Methodology
                </h3>
                <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {isReadMore
                    ? activeProject.fullDetails
                    : `${activeProject.fullDetails.slice(0, 360)}${activeProject.fullDetails.length > 360 ? '...' : ''}`}
                </div>
                {activeProject.fullDetails.length > 360 && (
                  <button
                    onClick={() => setIsReadMore(!isReadMore)}
                    className="text-xs text-[#00F0FF] font-bold hover:underline"
                  >
                    {isReadMore ? 'Show Less' : 'Read Full Case Study'}
                  </button>
                )}
              </div>

              {/* Deliverables / What's Included */}
              {activeProject.whatsIncluded && activeProject.whatsIncluded.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Included Deliverables</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeProject.whatsIncluded.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2.5 text-xs text-gray-200 bg-[#090C22] p-3 rounded-2xl border border-white/5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External Links */}
              {activeProject.links && activeProject.links.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Resources & External Links</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {activeProject.links.map((lnk, idx) => {
                      if (!lnk.url) return null;
                      return (
                        <a
                          key={idx}
                          href={lnk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-[rgba(0,240,255,0.25)] text-[#00F0FF] text-xs font-extrabold rounded-xl flex items-center space-x-2 transition-all shadow-md active:scale-95"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{lnk.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#090C22]/50 border border-white/5 rounded-3xl">
              <p className="text-xs text-gray-400">No project details available.</p>
            </div>
          )}
        </div>

        {/* Right Column (4 Cols): Creator Info, Bio, Skills, and Service Tiers */}
        <div className="lg:col-span-4 space-y-6">
          {/* Creator Profile Card (Always visible, containing Bio & Skills) */}
          <div className="bg-[#090C22] border border-[rgba(0,240,255,0.22)] rounded-3xl p-5 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3.5">
              <div
                onClick={() => openPublicProfile({
                  uid: portfolio.ownerId,
                  displayName: portfolio.fullName,
                  photoURL: portfolio.avatarUrl,
                  role: 'student',
                  createdAt: portfolio.createdAt,
                  updatedAt: portfolio.updatedAt,
                })}
                className="relative w-14 h-14 rounded-full overflow-hidden border border-[#00F0FF] cursor-pointer flex-shrink-0"
              >
                <img src={portfolio.avatarUrl} alt={portfolio.fullName} className="w-full h-full object-cover" />
                {portfolio.profileEffect && (
                  <AvatarDecoration effect={portfolio.profileEffect} className="scale-75 -inset-1" />
                )}
              </div>

              <div>
                <span
                  onClick={() => openPublicProfile({
                    uid: portfolio.ownerId,
                    displayName: portfolio.fullName,
                    photoURL: portfolio.avatarUrl,
                    role: 'student',
                    createdAt: portfolio.createdAt,
                    updatedAt: portfolio.updatedAt,
                  })}
                  className="text-base font-black text-white hover:text-[#00F0FF] cursor-pointer block font-heading"
                >
                  {portfolio.fullName}
                </span>
                <span className="text-xs text-cyan-300 font-semibold">
                  {portfolio.publicRoleLabel}
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="p-3 bg-[#040612]/80 border border-white/5 rounded-2xl text-xs text-gray-300 leading-relaxed font-semibold italic">
              "{portfolio.headline}"
            </div>

            {/* Dedicated Creator Bio (Always Visible) */}
            {portfolio.bio && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">About the Creator</span>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                  {portfolio.bio}
                </p>
              </div>
            )}

            {/* Skills Badges */}
            {portfolio.skills && portfolio.skills.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Creator Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {portfolio.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.8 bg-white/5 border border-white/10 text-gray-300 text-[10px] rounded-lg font-semibold"
                    >
                      #{s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Public Contact Buttons */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block text-center">Public Channels</span>
              <div className="flex justify-center flex-wrap gap-2">
                {portfolio.contactVisibility.whatsapp === 'public' && portfolio.contacts.whatsapp && (
                  <button
                    onClick={() => handleContactClick('whatsapp', portfolio.contacts.whatsapp)}
                    title="Contact on WhatsApp"
                    className="p-2.5 bg-emerald-600/20 hover:bg-emerald-650 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )}
                {portfolio.contactVisibility.phone === 'public' && portfolio.contacts.phone && (
                  <button
                    onClick={() => handleContactClick('phone', portfolio.contacts.phone)}
                    title="Call Creator"
                    className="p-2.5 bg-cyan-600/20 hover:bg-cyan-650 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-xl transition-all"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                )}
                {portfolio.contactVisibility.email === 'public' && portfolio.contacts.email && (
                  <button
                    onClick={() => handleContactClick('email', portfolio.contacts.email)}
                    title="Send Email"
                    className="p-2.5 bg-blue-600/20 hover:bg-blue-655 text-blue-300 hover:text-white border border-blue-500/30 rounded-xl transition-all"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                )}
                {portfolio.contactVisibility.website === 'public' && portfolio.contacts.website && (
                  <button
                    onClick={() => handleContactClick('website', portfolio.contacts.website)}
                    title="Visit Website"
                    className="p-2.5 bg-purple-600/20 hover:bg-purple-655 text-purple-300 hover:text-white border border-purple-500/30 rounded-xl transition-all"
                  >
                    <Globe className="w-4 h-4" />
                  </button>
                )}
                {portfolio.contactVisibility.github === 'public' && portfolio.contacts.github && (
                  <button
                    onClick={() => handleContactClick('github', portfolio.contacts.github)}
                    title="GitHub Profile"
                    className="p-2.5 bg-gray-800 hover:bg-gray-750 text-white border border-white/10 rounded-xl transition-all"
                  >
                    <SocialIcon type="github" className="w-4 h-4" />
                  </button>
                )}
                {portfolio.contactVisibility.linkedin === 'public' && portfolio.contacts.linkedin && (
                  <button
                    onClick={() => handleContactClick('linkedin', portfolio.contacts.linkedin)}
                    title="LinkedIn Profile"
                    className="p-2.5 bg-blue-750/20 hover:bg-blue-700 text-blue-400 hover:text-white border border-blue-600/30 rounded-xl transition-all"
                  >
                    <SocialIcon type="linkedin" className="w-4 h-4" />
                  </button>
                )}
                {portfolio.contactVisibility.instagram === 'public' && portfolio.contacts.instagram && (
                  <button
                    onClick={() => handleContactClick('instagram', portfolio.contacts.instagram)}
                    title="Instagram Profile"
                    className="p-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-305 hover:text-white border border-rose-500/30 rounded-xl transition-all"
                  >
                    <SocialIcon type="instagram" className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                openPublicProfile({
                  uid: portfolio.ownerId,
                  displayName: portfolio.fullName,
                  photoURL: portfolio.avatarUrl,
                  role: 'student',
                  createdAt: portfolio.createdAt,
                  updatedAt: portfolio.updatedAt,
                });
              }}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <span>View Full Cosmic Profile</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Service Tier Selector Panel (If service tiers are defined) */}
          {portfolio.serviceTiers && portfolio.serviceTiers.length > 0 && (
            <div className="bg-[#090C22] border border-[rgba(0,240,255,0.22)] rounded-3xl p-6 space-y-5 shadow-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Collaboration Packages</span>
              
              {/* Tabs */}
              <div className="grid grid-cols-3 gap-2 bg-[#040612] p-1.5 rounded-2xl border border-white/10">
                {portfolio.serviceTiers.map((t) => (
                  <button
                    key={t.tierLevel}
                    onClick={() => setSelectedTierLevel(t.tierLevel)}
                    className={`py-2 px-1 rounded-xl text-center transition-all ${
                      selectedTierLevel === t.tierLevel
                        ? 'bg-[#00F0FF] text-black shadow-lg shadow-cyan-500/20'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase block capitalize">{t.tierLevel}</span>
                    <span className="text-xs font-extrabold">₹{t.price}</span>
                  </button>
                ))}
              </div>

              {/* Selected Tier Details */}
              {activeTier && (
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                    <h4 className="text-sm font-bold text-white font-heading">{activeTier.name}</h4>
                    <span className="text-xl font-black text-[#00F0FF]">₹{activeTier.price}</span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">{activeTier.description}</p>

                  <div className="space-y-2 text-xs text-gray-300 pt-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#00F0FF]" />
                      <span>Delivery: <strong>{activeTier.deliveryTime}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RotateCcw className="w-4 h-4 text-emerald-400" />
                      <span>Revisions: <strong>{activeTier.revisions}</strong></span>
                    </div>
                  </div>

                  {/* Features checklist */}
                  {activeTier.features && activeTier.features.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Included Features</span>
                      {activeTier.features.map((feat, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs text-gray-200">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Contact button */}
                  <button
                    onClick={() => handleContactClick('whatsapp', portfolio.contacts.whatsapp || portfolio.contacts.email)}
                    className="w-full py-3 bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] text-black font-extrabold text-xs rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-wider"
                  >
                    Select Tier Package
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Portfolios Footer Grid */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">Explore Related Portfolios</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectPortfolio?.(rel)}
                className="bg-[#090C22] border border-white/10 hover:border-[#00F0FF] p-4 rounded-3xl cursor-pointer transition-all space-y-3 group shadow-lg hover:shadow-[#00F0FF]/20"
              >
                <div className="h-36 rounded-2xl overflow-hidden bg-black relative">
                  <img
                    src={rel.projects[0]?.coverImage || rel.avatarUrl}
                    alt={rel.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/80 text-[#00F0FF] text-[9px] font-bold rounded-full uppercase">
                    {rel.category}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-[#00F0FF] transition-colors">{rel.fullName}</h4>
                  <span className="text-[11px] text-gray-400 block truncate mt-0.5">{rel.headline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
