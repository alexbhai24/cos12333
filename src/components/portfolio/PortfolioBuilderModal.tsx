import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Lock,
  Eye,
  EyeOff,
  Play,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import type { PortfolioProfile, PortfolioCategory, PortfolioProject, ServiceTier, ContactMethods, ContactVisibility } from '../../types/portfolio';
import { useModalLock } from '../../hooks/useModalLock';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { portfolioService } from '../../services/portfolioService';
import { getUserGradeOrDesignationBadge } from '../../utils/gradeUtils';

interface PortfolioBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingPortfolio?: PortfolioProfile | null;
  onSuccess: (portfolio: PortfolioProfile) => void;
  initialStep?: 1 | 2 | 3 | 4 | 5;
}

const CATEGORIES: PortfolioCategory[] = [
  'Web Development',
  'UI/UX',
  'AI Projects',
  'Robotics',
  'Design',
  'Writing',
  'Video',
  'Research',
  'Other',
];

const PROFILE_EFFECTS = ['NONE', 'ENERGY FLOW', 'COSMIC RINGS', 'ORBIT DOTS', 'SOLAR FLAME', 'SUPERNOVA', 'QUANTUM WEB'];

export const PortfolioBuilderModal: React.FC<PortfolioBuilderModalProps> = ({
  isOpen,
  onClose,
  existingPortfolio,
  onSuccess,
  initialStep = 1,
}) => {
  useModalLock(isOpen);
  const { showNotification } = useApp();
  const { currentUser, userProfile } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Sync step with initialStep when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep || 1);
    }
  }, [isOpen, initialStep]);

  // Step 1 State: Profile Basics
  const [fullName, setFullName] = useState(
    existingPortfolio?.fullName || userProfile?.displayName || currentUser?.displayName || ''
  );
  const [publicRoleLabel, setPublicRoleLabel] = useState(
    existingPortfolio?.publicRoleLabel || getUserGradeOrDesignationBadge(userProfile || {}) || ''
  );
  const [headline, setHeadline] = useState(existingPortfolio?.headline || '');
  const [bio, setBio] = useState(existingPortfolio?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(
    existingPortfolio?.avatarUrl || userProfile?.photoURL || currentUser?.photoURL || ''
  );
  const [profileEffect, setProfileEffect] = useState(existingPortfolio?.profileEffect || 'NONE');
  const [category, setCategory] = useState<PortfolioCategory>(existingPortfolio?.category || 'Web Development');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(
    existingPortfolio?.skills.length ? existingPortfolio.skills : []
  );

  // Step 2 State: Projects List
  const [projects, setProjects] = useState<PortfolioProject[]>(
    existingPortfolio?.projects || []
  );

  // Step 2 Project Sub-form State
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projShortDesc, setProjShortDesc] = useState('');
  const [projFullDetails, setProjFullDetails] = useState('');
  const [projPrice, setProjPrice] = useState<number | ''>('');
  const [projDeliveryTime, setProjDeliveryTime] = useState('');
  const [projCoverImage, setProjCoverImage] = useState('');
  const [projVideoEmbed, setProjVideoEmbed] = useState('');
  const [whatsIncludedInput, setWhatsIncludedInput] = useState('');
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>([]);

  // Automatically start adding if there are no projects
  useEffect(() => {
    if (isOpen && projects.length === 0 && !isAddingProject && editingProjectIndex === null) {
      startAddProject();
    }
  }, [isOpen, projects.length]);

  const startEditProject = (idx: number) => {
    const p = projects[idx];
    setProjTitle(p.title);
    setProjShortDesc(p.shortDescription || '');
    setProjFullDetails(p.fullDetails || '');
    setProjPrice(p.price ?? '');
    setProjDeliveryTime(p.deliveryTime || '');
    setProjCoverImage(p.coverImage || '');
    setProjVideoEmbed(p.videoEmbedUrl || '');
    setWhatsIncluded(p.whatsIncluded || []);
    setEditingProjectIndex(idx);
    setIsAddingProject(false);
  };

  const startAddProject = () => {
    setProjTitle('');
    setProjShortDesc('');
    setProjFullDetails('');
    setProjPrice('');
    setProjDeliveryTime('');
    setProjCoverImage('');
    setProjVideoEmbed('');
    setWhatsIncluded([]);
    setEditingProjectIndex(null);
    setIsAddingProject(true);
  };

  const handleSaveProject = () => {
    if (!projTitle.trim()) {
      showNotification('Project title is required.');
      return;
    }
    const sanitizedVideo = portfolioService.sanitizeEmbedUrl(projVideoEmbed);
    const updatedProj: PortfolioProject = {
      id: editingProjectIndex !== null ? projects[editingProjectIndex].id : `proj-${Date.now()}`,
      title: projTitle.trim(),
      shortDescription: projShortDesc.trim() || headline,
      fullDetails: projFullDetails.trim() || bio,
      category,
      skills,
      price: typeof projPrice === 'number' ? projPrice : undefined,
      deliveryTime: projDeliveryTime,
      coverImage: projCoverImage.trim(),
      galleryImages: [projCoverImage.trim()],
      videoEmbedUrl: sanitizedVideo,
      whatsIncluded,
      links: [
        { label: 'GitHub Repo', url: contacts.github || 'https://github.com', type: 'github' },
        { label: 'Live Website', url: contacts.website || 'https://cosmicbone.com', type: 'website' },
      ],
      createdAt: editingProjectIndex !== null ? projects[editingProjectIndex].createdAt : new Date().toISOString(),
    };

    let next: PortfolioProject[];
    if (editingProjectIndex !== null) {
      next = projects.map((p, i) => i === editingProjectIndex ? updatedProj : p);
    } else {
      next = [...projects, updatedProj];
    }
    setProjects(next);
    setIsAddingProject(false);
    setEditingProjectIndex(null);
    showNotification('Project saved to portfolio! 📁');
  };

  const handleDeleteProject = (idx: number) => {
    const next = projects.filter((_, i) => i !== idx);
    setProjects(next);
    showNotification('Project removed.');
  };

  // Step 3 State: Service Tiers
  const [enableTiers, setEnableTiers] = useState(!!existingPortfolio?.serviceTiers?.length);
  const [starterPrice, setStarterPrice] = useState(existingPortfolio?.serviceTiers?.[0]?.price || 29);
  const [standardPrice, setStandardPrice] = useState(existingPortfolio?.serviceTiers?.[1]?.price || 69);
  const [advancedPrice, setAdvancedPrice] = useState(existingPortfolio?.serviceTiers?.[2]?.price || 149);

  // Step 4 State: Contact & Visibility (Default Phone & Email to HIDDEN for privacy!)
  const [contacts, setContacts] = useState<ContactMethods>(
    existingPortfolio?.contacts || {
      whatsapp: '',
      phone: '',
      email: currentUser?.email || '',
      website: '',
      github: '',
      linkedin: '',
      instagram: '',
    }
  );

  const [contactVisibility, setContactVisibility] = useState<ContactVisibility>(
    existingPortfolio?.contactVisibility || {
      whatsapp: 'public',
      phone: 'hidden',
      email: 'hidden',
      website: 'public',
      github: 'public',
      linkedin: 'public',
      instagram: 'hidden',
    }
  );

  if (!isOpen) return null;

  // Add Skill Tag
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Add Included Item
  const handleAddIncluded = () => {
    if (whatsIncludedInput.trim() && !whatsIncluded.includes(whatsIncludedInput.trim())) {
      setWhatsIncluded([...whatsIncluded, whatsIncludedInput.trim()]);
      setWhatsIncludedInput('');
    }
  };

  const handleRemoveIncluded = (item: string) => {
    setWhatsIncluded(whatsIncluded.filter(i => i !== item));
  };

  // Toggle Visibility
  const toggleVisibility = (key: keyof ContactVisibility) => {
    setContactVisibility(prev => ({
      ...prev,
      [key]: prev[key] === 'public' ? 'hidden' : 'public',
    }));
  };

  // Save / Publish Portfolio
  const handlePublish = (status: 'draft' | 'published') => {
    if (!fullName.trim() || !headline.trim()) {
      showNotification('Full name and headline are required.');
      setStep(1);
      return;
    }

    // Save unsaved project if user clicked publish while in project form
    let finalProjects = [...projects];
    if (isAddingProject || editingProjectIndex !== null) {
      if (projTitle.trim()) {
        const sanitizedVideo = portfolioService.sanitizeEmbedUrl(projVideoEmbed);
        const activeProj: PortfolioProject = {
          id: editingProjectIndex !== null ? projects[editingProjectIndex].id : `proj-${Date.now()}`,
          title: projTitle.trim(),
          shortDescription: projShortDesc.trim() || headline,
          fullDetails: projFullDetails.trim() || bio,
          category,
          skills,
          price: typeof projPrice === 'number' ? projPrice : undefined,
          deliveryTime: projDeliveryTime,
          coverImage: projCoverImage.trim(),
          galleryImages: [projCoverImage.trim()],
          videoEmbedUrl: sanitizedVideo,
          whatsIncluded,
          links: [
            { label: 'GitHub Repo', url: contacts.github || 'https://github.com', type: 'github' },
            { label: 'Live Website', url: contacts.website || 'https://cosmicbone.com', type: 'website' },
          ],
          createdAt: editingProjectIndex !== null ? projects[editingProjectIndex].createdAt : new Date().toISOString(),
        };

        if (editingProjectIndex !== null) {
          finalProjects = projects.map((p, i) => i === editingProjectIndex ? activeProj : p);
        } else {
          finalProjects = [...projects, activeProj];
        }
      } else if (finalProjects.length === 0) {
        showNotification('Please add at least one project title in Step 2.');
        setStep(2);
        return;
      }
    } else if (finalProjects.length === 0) {
      showNotification('Please add at least one project in Step 2.');
      setStep(2);
      return;
    }

    const serviceTiers: ServiceTier[] | undefined = enableTiers
      ? [
          {
            tierLevel: 'starter',
            name: 'Starter Package',
            price: Number(starterPrice),
            deliveryTime: '2 Days',
            revisions: '2 Revisions',
            features: ['Core Essentials', 'Source Files'],
            description: 'Basic entry tier for small setups.',
          },
          {
            tierLevel: 'standard',
            name: 'Standard Package',
            price: Number(standardPrice),
            deliveryTime: '5 Days',
            revisions: '5 Revisions',
            features: ['Full Features', 'Priority Delivery', 'Documentation'],
            description: 'Complete package with standard enhancements.',
          },
          {
            tierLevel: 'advanced',
            name: 'Advanced Pro Package',
            price: Number(advancedPrice),
            deliveryTime: '10 Days',
            revisions: 'Unlimited Revisions',
            features: ['Full Custom Build', 'AI/3D Integration', 'Unlimited Support'],
            description: 'Comprehensive pro implementation with dedicated support.',
          },
        ]
      : undefined;

    const newPortfolio: PortfolioProfile = {
      id: existingPortfolio?.id || `port-${Date.now()}`,
      ownerId: currentUser?.uid || 'user-me',
      fullName: fullName.trim(),
      publicRoleLabel,
      headline: headline.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      profileEffect,
      skills,
      category,
      projects: finalProjects,
      serviceTiers,
      contacts,
      contactVisibility,
      status,
      viewsCount: existingPortfolio?.viewsCount || 0,
      createdAt: existingPortfolio?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    portfolioService.savePortfolio(newPortfolio);
    showNotification(status === 'published' ? 'Portfolio published successfully! 🚀' : 'Portfolio saved as draft 📝');
    onSuccess(newPortfolio);
    onClose();
  };

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
        {/* Header with Multi-Step Progress Indicator */}
        <div className="modal-header border-b border-white/10 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#00F0FF] animate-pulse" />
              <h2 className="text-xl font-bold text-white font-heading">
                {existingPortfolio ? 'Edit Portfolio' : 'Create Portfolio'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center justify-between overflow-x-auto gap-1 bg-[#040612] p-1.5 rounded-2xl border border-white/5 scrollbar-none">
            {[
              { num: 1, label: 'Profile Basics' },
              { num: 2, label: 'Add Project' },
              { num: 3, label: 'Service Tiers' },
              { num: 4, label: 'Contact Privacy' },
              { num: 5, label: 'Preview & Publish' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                  step === s.num
                    ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/20'
                    : step > s.num
                    ? 'text-emerald-400 bg-white/5'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                  {s.num}
                </span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body scroll-contain py-6 space-y-6">
          {/* STEP 1: PROFILE BASICS */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                {/* Role / Grade Label */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Public Role / Grade Label</label>
                  <input
                    type="text"
                    value={publicRoleLabel}
                    onChange={(e) => setPublicRoleLabel(e.target.value)}
                    placeholder="e.g. Class 12 Student (PCM)"
                    className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Professional Headline *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Full-Stack Web Dev & Quantum Physics Simulator Developer"
                  className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Short Bio</label>
                <textarea
                  rows={3}
                  maxLength={400}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summarize your background, interests, academic goals, and creative skills..."
                  className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Primary Specialization Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PortfolioCategory)}
                  className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-[#00F0FF]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Skills & Specializations</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="Type skill (e.g. React, Python, UI Design) and hit enter..."
                    className="flex-1 bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2.5 bg-[#00F0FF] hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 bg-[#090C22] border border-white/10 text-gray-200 text-xs rounded-xl flex items-center gap-2 whitespace-nowrap shadow-sm"
                    >
                      <span>{s}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveSkill(s)} 
                        className="text-gray-400 hover:text-red-400 p-0.5 rounded transition-colors flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Avatar URL & Profile Effect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Avatar Photo URL</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Profile Effect Frame</label>
                  <select
                    value={profileEffect}
                    onChange={(e) => setProfileEffect(e.target.value)}
                    className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-cyan-300"
                  >
                    {PROFILE_EFFECTS.map((eff) => (
                      <option key={eff} value={eff}>{eff}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROJECTS */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {isAddingProject || editingProjectIndex !== null ? (
                /* Sub-form to Add/Edit a single project */
                <div className="space-y-4 p-5 bg-[#040612]/60 rounded-3xl border border-white/5 relative">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-sm font-bold text-[#00F0FF]">
                      {editingProjectIndex !== null ? 'Edit Project Details' : 'Add New Project'}
                    </h3>
                    {projects.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingProject(false);
                          setEditingProjectIndex(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Project Title *</label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="e.g. Quantum Mechanics 3D Interactive Simulator"
                      className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Short Summary</label>
                    <input
                      type="text"
                      maxLength={160}
                      value={projShortDesc}
                      onChange={(e) => setProjShortDesc(e.target.value)}
                      placeholder="Brief 1-sentence overview of what you built..."
                      className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Full Project Details</label>
                    <textarea
                      rows={4}
                      value={projFullDetails}
                      onChange={(e) => setProjFullDetails(e.target.value)}
                      placeholder="Detailed breakdown of methodology, features, tech stack, and achievements..."
                      className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Cover Image URL</label>
                      <input
                        type="url"
                        value={projCoverImage}
                        onChange={(e) => setProjCoverImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase flex items-center space-x-1">
                        <Play className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>YouTube / Vimeo Embed URL</span>
                      </label>
                      <input
                        type="text"
                        value={projVideoEmbed}
                        onChange={(e) => setProjVideoEmbed(e.target.value)}
                        placeholder="https://www.youtube.com/embed/... or iframe code"
                        className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                      />
                    </div>
                  </div>

                  {projVideoEmbed && (
                    <div className="p-3 bg-[#040612] border border-cyan-500/20 rounded-xl space-y-1">
                      <div className="text-[11px] text-cyan-300 font-semibold flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Video Embed Security Status:</span>
                      </div>
                      {portfolioService.sanitizeEmbedUrl(projVideoEmbed) ? (
                        <p className="text-[10px] text-emerald-400">
                          ✓ Valid YouTube/Vimeo embed URL detected and safely sanitized.
                        </p>
                      ) : (
                        <p className="text-[10px] text-amber-400">
                          ⚠️ Unsupported or unsafe video URL. Only valid YouTube/Vimeo embed links will be displayed.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Starting Price (₹ optional)</label>
                      <input
                        type="number"
                        value={projPrice}
                        onChange={(e) => setProjPrice(e.target.value ? Number(e.target.value) : '')}
                        placeholder="49"
                        className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Estimated Delivery / Duration</label>
                      <input
                        type="text"
                        value={projDeliveryTime}
                        onChange={(e) => setProjDeliveryTime(e.target.value)}
                        placeholder="e.g. 3 Days, 2 Weeks"
                        className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Key Deliverables / Included Items</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={whatsIncludedInput}
                        onChange={(e) => setWhatsIncludedInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIncluded())}
                        placeholder="e.g. Interactive Web Dashboard, Source Code..."
                        className="flex-1 bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3.5 py-2.5 text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddIncluded}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-1 pt-1">
                      {whatsIncluded.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-gray-300 bg-[#040612] px-3 py-1.5 rounded-lg border border-white/5">
                          <span>• {item}</span>
                          <button onClick={() => handleRemoveIncluded(item)} className="text-gray-500 hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveProject}
                      disabled={!projTitle.trim()}
                      className="px-5 py-2.5 bg-[#00F0FF] hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      Save Project to List
                    </button>
                  </div>
                </div>
              ) : (
                /* Projects List Screen */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      You have added <strong>{projects.length}</strong> project{projects.length === 1 ? '' : 's'} to this portfolio.
                    </div>
                    <button
                      type="button"
                      onClick={startAddProject}
                      className="px-4 py-2 rounded-xl text-black font-extrabold text-xs bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add Another Project</span>
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="text-center py-10 bg-[#040612]/30 border border-dashed border-white/10 rounded-2xl">
                      <p className="text-xs text-gray-500">No projects added yet. Click above to add a project.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.map((proj, idx) => (
                        <div
                          key={proj.id}
                          className="bg-[#040612]/70 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4 group hover:border-[rgba(0,240,255,0.3)] transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-white/10">
                            <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{proj.title}</h4>
                            <p className="text-[10px] text-gray-450 truncate mt-0.5">{proj.shortDescription}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => startEditProject(idx)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#00F0FF] transition-colors"
                              title="Edit Project"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(idx)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SERVICE TIERS */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between bg-[#040612] p-4 rounded-2xl border border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-white">Offer Tiered Collaboration Packages</h3>
                  <p className="text-xs text-gray-400">Allow students or clients to request different service levels.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableTiers(!enableTiers)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    enableTiers ? 'bg-[#00F0FF] text-black' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {enableTiers ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {enableTiers && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-[#040612] p-4 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">Starter Tier</span>
                    <label className="text-xs text-gray-400 block font-semibold">Price (₹)</label>
                    <input
                      type="number"
                      value={starterPrice}
                      onChange={(e) => setStarterPrice(Number(e.target.value))}
                      className="w-full bg-[#060919] border border-white/10 text-xs rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="bg-[#040612] p-4 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-[10px] font-bold text-[#00F0FF] uppercase">Standard Tier</span>
                    <label className="text-xs text-gray-400 block font-semibold">Price (₹)</label>
                    <input
                      type="number"
                      value={standardPrice}
                      onChange={(e) => setStandardPrice(Number(e.target.value))}
                      className="w-full bg-[#060919] border border-white/10 text-xs rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="bg-[#040612] p-4 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Advanced Pro Tier</span>
                    <label className="text-xs text-gray-400 block font-semibold">Price (₹)</label>
                    <input
                      type="number"
                      value={advancedPrice}
                      onChange={(e) => setAdvancedPrice(Number(e.target.value))}
                      className="w-full bg-[#060919] border border-white/10 text-xs rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: CONTACT PRIVACY & VISIBILITY */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-amber-300 text-xs flex items-start space-x-2.5">
                <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Privacy First Control:</span>
                  Phone numbers and email addresses default to <strong>HIDDEN</strong> for privacy. They will only be displayed on your portfolio if you explicitly mark them as Public.
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'whatsapp', label: 'WhatsApp Link / Number', placeholder: 'https://wa.me/919876543210', val: contacts.whatsapp },
                  { key: 'phone', label: 'Phone Number (tel:)', placeholder: '+91 98765 43210', val: contacts.phone },
                  { key: 'email', label: 'Email Address (mailto:)', placeholder: 'your.email@example.com', val: contacts.email },
                  { key: 'website', label: 'Personal Website', placeholder: 'https://yourwebsite.com', val: contacts.website },
                  { key: 'github', label: 'GitHub Profile', placeholder: 'https://github.com/username', val: contacts.github },
                  { key: 'linkedin', label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/in/username', val: contacts.linkedin },
                  { key: 'instagram', label: 'Instagram Profile', placeholder: 'https://instagram.com/username', val: contacts.instagram },
                ].map((c) => (
                  <div key={c.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#040612] p-3 rounded-2xl border border-white/5">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-bold text-gray-300 block">{c.label}</label>
                      <input
                        type="text"
                        value={c.val || ''}
                        onChange={(e) => setContacts({ ...contacts, [c.key]: e.target.value })}
                        placeholder={c.placeholder}
                        className="w-full bg-[#090C22] border border-white/10 text-xs rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-2 sm:pt-4">
                      <span className={`text-[10px] font-bold uppercase ${contactVisibility[c.key as keyof ContactVisibility] === 'public' ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {contactVisibility[c.key as keyof ContactVisibility]}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleVisibility(c.key as keyof ContactVisibility)}
                        className={`p-2 rounded-xl border text-xs flex items-center space-x-1 transition-all ${
                          contactVisibility[c.key as keyof ContactVisibility] === 'public'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        {contactVisibility[c.key as keyof ContactVisibility] === 'public' ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: PREVIEW & PUBLISH */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white font-heading">Portfolio Summary Preview</h3>
                <p className="text-xs text-gray-400">Review how your portfolio will appear in the CosmicBone Explorer.</p>
              </div>

              {/* Live Preview Card */}
              <div className="max-w-sm mx-auto bg-[#090C22] border border-[#00F0FF] rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="w-full h-40 rounded-2xl overflow-hidden bg-black border border-white/10">
                  <img
                    src={projects[0]?.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                    alt={projects[0]?.title || fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-[#00F0FF] uppercase tracking-wider">{category}</span>
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {projects[0]?.title || headline}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {projects[0]?.shortDescription || bio || 'No description provided.'}
                  </p>
                  {projects.length > 1 && (
                    <span className="inline-block mt-2 text-[10px] bg-white/5 border border-white/10 text-cyan-300 font-bold px-2.5 py-0.5 rounded-md">
                      +{projects.length - 1} More Project{projects.length === 2 ? '' : 's'}
                    </span>
                  )}
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{fullName}</span>
                  <span className="text-[#00F0FF] font-extrabold">
                    Starts at ${projects[0]?.price || 49}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="modal-footer flex items-center justify-between border-t border-white/10 pt-4">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-xl text-gray-300 flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          <div className="flex space-x-2">
            {step === 5 ? (
              <>
                <button
                  onClick={() => handlePublish('draft')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handlePublish('published')}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] text-black font-extrabold text-xs rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  Publish Portfolio 🚀
                </button>
              </>
            ) : (
              <button
                onClick={() => setStep((step + 1) as any)}
                className="px-5 py-2.5 bg-[#00F0FF] hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl flex items-center space-x-1 shadow-md transition-all"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
