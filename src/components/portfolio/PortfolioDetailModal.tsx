import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Award,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Eye,
  Play,
  ChevronRight,
} from 'lucide-react';
import type { PortfolioProfile } from '../../types/portfolio';
import { useModalLock } from '../../hooks/useModalLock';
import { useApp } from '../../context/AppContext';
import { portfolioService } from '../../services/portfolioService';
import { AvatarDecoration } from '../AvatarDecoration';

const SocialIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "w-4 h-4" }) => {
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

interface PortfolioDetailModalProps {
  portfolio: PortfolioProfile | null;
  onClose: () => void;
  onSelectPortfolio?: (portfolio: PortfolioProfile) => void;
  allPortfolios?: PortfolioProfile[];
}

export const PortfolioDetailModal: React.FC<PortfolioDetailModalProps> = ({
  portfolio,
  onClose,
  onSelectPortfolio,
  allPortfolios = [],
}) => {
  useModalLock(!!portfolio);
  const { showNotification, openPublicProfile } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isReadMore, setIsReadMore] = useState(false);

  if (!portfolio) return null;

  const primaryProject = portfolio.projects[0];
  const gallery = primaryProject?.galleryImages.length
    ? primaryProject.galleryImages
    : [primaryProject?.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'];

  const sanitizedVideoUrl = portfolioService.sanitizeEmbedUrl(primaryProject?.videoEmbedUrl);

  const handleContactClick = (type: string, value?: string) => {
    if (!value) {
      showNotification(`Creator has not shared their public ${type}.`);
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

  const related = allPortfolios.filter(p => p.id !== portfolio.id).slice(0, 3);

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="modal-backdrop z-[9999]"
    >
      <div
        className="modal-panel modal-panel-xl relative bg-[#060918]/98 border border-[rgba(0,240,255,0.25)] shadow-[0_25px_60px_rgba(0,240,255,0.2)] rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-extrabold rounded-full uppercase tracking-wider">
              {portfolio.category}
            </span>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>{portfolio.viewsCount || 0} Views</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="modal-body scroll-contain py-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Gallery, Video, Details & Tiers */}
            <div className="lg:col-span-2 space-y-6">
              {/* Media Gallery / Main Image */}
              <div className="space-y-3">
                <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-black border border-white/10 relative">
                  <img
                    src={gallery[activeImageIndex] || gallery[0]}
                    alt={primaryProject?.title}
                    className="w-full h-full object-cover"
                  />
                  {portfolio.achievementBadge && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-xs rounded-full shadow-lg flex items-center gap-1 uppercase">
                      <Award className="w-3.5 h-3.5" />
                      <span>{portfolio.achievementBadge}</span>
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {gallery.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-1">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                          activeImageIndex === idx ? 'border-[#00F0FF] scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Short Details */}
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading leading-tight">
                  {primaryProject?.title || portfolio.headline}
                </h1>
                <p className="text-xs sm:text-sm text-cyan-300 font-medium">
                  {portfolio.headline}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 text-xs rounded-lg font-semibold"
                  >
                    #{s}
                  </span>
                ))}
              </div>

              {/* Sanitized Video Embed Preview */}
              {sanitizedVideoUrl && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Project Video Demo</span>
                  </h3>
                  <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[rgba(0,240,255,0.2)] bg-black shadow-lg">
                    <iframe
                      src={sanitizedVideoUrl}
                      title="Project Video Demo"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-[#090C22] p-5 rounded-2xl border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Project Details & Bio</h3>
                <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                  {isReadMore
                    ? (primaryProject?.fullDetails || portfolio.bio)
                    : `${(primaryProject?.fullDetails || portfolio.bio).slice(0, 260)}...`}
                </div>
                {(primaryProject?.fullDetails || portfolio.bio).length > 260 && (
                  <button
                    onClick={() => setIsReadMore(!isReadMore)}
                    className="text-xs text-[#00F0FF] font-bold hover:underline"
                  >
                    {isReadMore ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>

              {/* What's Included */}
              {primaryProject?.whatsIncluded && primaryProject.whatsIncluded.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">What's Included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {primaryProject.whatsIncluded.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 text-xs text-gray-200 bg-[#040612] p-2.5 rounded-xl border border-white/5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External Links */}
              {primaryProject?.links && primaryProject.links.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Resources & Links</h3>
                  <div className="flex flex-wrap gap-2">
                    {primaryProject.links.map((lnk, idx) => (
                      <a
                        key={idx}
                        href={lnk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-[rgba(0,240,255,0.2)] text-[#00F0FF] text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{lnk.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Tiers Comparison Table */}
              {portfolio.serviceTiers && portfolio.serviceTiers.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-bold text-white font-heading">Service Tier Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {portfolio.serviceTiers.map((tier) => (
                      <div
                        key={tier.tierLevel}
                        className="bg-[#090C22] border border-[rgba(0,240,255,0.18)] hover:border-[#00F0FF] rounded-2xl p-4 flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 bg-[#00F0FF]/10 rounded-md inline-block">
                            {tier.tierLevel} Tier
                          </span>
                          <h4 className="text-sm font-bold text-white">{tier.name}</h4>
                          <div className="text-lg font-black text-[#00F0FF]">${tier.price}</div>
                          <p className="text-[11px] text-gray-400 line-clamp-2">{tier.description}</p>
                          <div className="text-[10px] text-gray-400 space-y-1 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              <span>Delivery: {tier.deliveryTime}</span>
                            </div>
                            <div>Revisions: {tier.revisions}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleContactClick('whatsapp', portfolio.contacts.whatsapp || portfolio.contacts.email)}
                          className="w-full py-2 bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] text-black font-extrabold text-xs rounded-xl shadow-md hover:from-[#00D4E0] hover:to-[#70B8FF] transition-all"
                        >
                          Request Tier
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Creator Panel */}
            <div className="space-y-6">
              <div className="bg-[#090C22] border border-[rgba(0,240,255,0.2)] rounded-3xl p-6 space-y-5 text-center sticky top-4">
                {/* Creator Avatar */}
                <div className="relative w-20 h-20 mx-auto">
                  <img
                    src={portfolio.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={portfolio.fullName}
                    className="w-full h-full rounded-full object-cover border-2 border-[#00F0FF]"
                  />
                  {portfolio.profileEffect && (
                    <AvatarDecoration effect={portfolio.profileEffect} className="scale-90 -inset-2" />
                  )}
                </div>

                {/* Creator Identity */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-heading">{portfolio.fullName}</h3>
                  <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
                    {portfolio.publicRoleLabel}
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed px-2">
                  {portfolio.bio}
                </p>

                {/* Public Contacts ONLY */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Public Contact Channels</span>
                  <div className="flex justify-center gap-2">
                    {portfolio.contactVisibility.whatsapp === 'public' && portfolio.contacts.whatsapp && (
                      <button
                        onClick={() => handleContactClick('whatsapp', portfolio.contacts.whatsapp)}
                        title="Contact on WhatsApp"
                        className="p-2.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}
                    {portfolio.contactVisibility.phone === 'public' && portfolio.contacts.phone && (
                      <button
                        onClick={() => handleContactClick('phone', portfolio.contacts.phone)}
                        title="Call Creator"
                        className="p-2.5 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-xl transition-all"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    )}
                    {portfolio.contactVisibility.email === 'public' && portfolio.contacts.email && (
                      <button
                        onClick={() => handleContactClick('email', portfolio.contacts.email)}
                        title="Send Email"
                        className="p-2.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-xl transition-all"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                    {portfolio.contactVisibility.website === 'public' && portfolio.contacts.website && (
                      <button
                        onClick={() => handleContactClick('website', portfolio.contacts.website)}
                        title="Visit Website"
                        className="p-2.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 rounded-xl transition-all"
                      >
                        <Globe className="w-4 h-4" />
                      </button>
                    )}
                    {portfolio.contactVisibility.github === 'public' && portfolio.contacts.github && (
                      <button
                        onClick={() => handleContactClick('github', portfolio.contacts.github)}
                        title="GitHub Profile"
                        className="p-2.5 bg-gray-800 hover:bg-gray-700 text-white border border-white/10 rounded-xl transition-all"
                      >
                        <SocialIcon type="github" className="w-4 h-4" />
                      </button>
                    )}
                    {portfolio.contactVisibility.linkedin === 'public' && portfolio.contacts.linkedin && (
                      <button
                        onClick={() => handleContactClick('linkedin', portfolio.contacts.linkedin)}
                        title="LinkedIn Profile"
                        className="p-2.5 bg-blue-700/20 hover:bg-blue-700 text-blue-400 hover:text-white border border-blue-600/30 rounded-xl transition-all"
                      >
                        <SocialIcon type="linkedin" className="w-4 h-4" />
                      </button>
                    )}
                    {portfolio.contactVisibility.instagram === 'public' && portfolio.contacts.instagram && (
                      <button
                        onClick={() => handleContactClick('instagram', portfolio.contacts.instagram)}
                        title="Instagram Profile"
                        className="p-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl transition-all"
                      >
                        <SocialIcon type="instagram" className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile View Action */}
                <button
                  onClick={() => {
                    onClose();
                    openPublicProfile({
                      uid: portfolio.ownerId,
                      displayName: portfolio.fullName,
                      photoURL: portfolio.avatarUrl,
                      role: 'student',
                      createdAt: portfolio.createdAt,
                      updatedAt: portfolio.updatedAt,
                    });
                  }}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all"
                >
                  <span>View Full Cosmic Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Related Portfolios Section */}
          {related.length > 0 && (
            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white font-heading">Explore Related Portfolios</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectPortfolio?.(rel)}
                    className="bg-[#090C22] border border-white/10 hover:border-[#00F0FF] p-3 rounded-2xl cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="h-28 rounded-xl overflow-hidden bg-black relative">
                      <img
                        src={rel.projects[0]?.coverImage || rel.avatarUrl}
                        alt={rel.fullName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{rel.fullName}</h4>
                    <span className="text-[10px] text-gray-400 block truncate">{rel.headline}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
