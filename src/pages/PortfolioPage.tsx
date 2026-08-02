import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Briefcase,
  Plus,
  User,
  RotateCcw,
  ChevronDown,
  Check,
} from 'lucide-react';
import type { PortfolioProfile, PortfolioFilters, PortfolioCategory } from '../types/portfolio';
import { portfolioService } from '../services/portfolioService';
import { PortfolioCard } from '../components/portfolio/PortfolioCard';
import { PortfolioDetailView } from '../components/portfolio/PortfolioDetailView';
import { PortfolioBuilderModal } from '../components/portfolio/PortfolioBuilderModal';
import { MyPortfolioTab } from '../components/portfolio/MyPortfolioTab';
import { useAuth } from '../context/AuthContext';

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

export const PortfolioPage: React.FC = () => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'explorer' | 'my-portfolio'>('explorer');

  // Loaded Portfolios
  const [portfolios, setPortfolios] = useState<PortfolioProfile[]>([]);
  const [filteredList, setFilteredList] = useState<PortfolioProfile[]>([]);

  // Filter State
  const [filters, setFilters] = useState<PortfolioFilters>({
    search: '',
    category: 'All',
    skills: [],
    minPrice: null,
    maxPrice: null,
    deliveryTime: 'Any Time',
    talentDetails: [],
    sortBy: 'most_recent',
  });

  // Active Popover State for additional filters
  const [activePopover, setActivePopover] = useState<'skills' | 'price' | 'delivery' | 'talent' | null>(null);

  // Selected Portfolio for Full-Page Detail View (No Popup Overlay)
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioProfile | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderInitialStep, setBuilderInitialStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Load Portfolios
  const reloadPortfolios = () => {
    const published = portfolioService.getAllPortfolios();
    setPortfolios(published);
    setFilteredList(portfolioService.filterPortfolios(filters));
  };

  useEffect(() => {
    reloadPortfolios();
  }, []);

  useEffect(() => {
    setFilteredList(portfolioService.filterPortfolios(filters));
  }, [filters, portfolios]);

  // Dynamic values and counts from published portfolios
  const defaultSkills = ['React', 'TypeScript', 'Python', 'AI', 'Figma', 'UI Design', 'WebGL', 'Three.js', 'OpenCV', 'Physics', 'JEE Prep'];
  
  const skillCounts = useMemo(() => {
    return portfolios.reduce((acc, p) => {
      (p.skills || []).forEach(s => {
        acc[s] = (acc[s] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
  }, [portfolios]);

  const categoryCounts = useMemo(() => {
    return portfolios.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [portfolios]);

  const availableSkills = useMemo(() => {
    const combined = Array.from(new Set([...portfolios.flatMap(p => p.skills || []), ...defaultSkills])).filter(Boolean);
    // Sort skills: those with portfolio occurrences first, then alphabetical
    return combined.sort((a, b) => {
      const countA = skillCounts[a] || 0;
      const countB = skillCounts[b] || 0;
      if (countB !== countA) return countB - countA;
      return a.localeCompare(b);
    });
  }, [portfolios, skillCounts]);

  const activeFilterCount =
    (filters.category !== 'All' ? 1 : 0) +
    filters.skills.length +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
    (filters.deliveryTime !== 'Any Time' ? 1 : 0) +
    filters.talentDetails.length;

  const clearAllFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      skills: [],
      minPrice: null,
      maxPrice: null,
      deliveryTime: 'Any Time',
      talentDetails: [],
      sortBy: 'most_recent',
    });
    setActivePopover(null);
  };

  const handleOpenDetail = (p: PortfolioProfile) => {
    portfolioService.incrementViews(p.id);
    setSelectedPortfolio(p);
  };

  const myPortfolio = portfolioService.getPortfolioByOwnerId(currentUser?.uid || 'user-me');

  // If user selected a portfolio, render full page detail view (NO popup overlay, full screen frame size with Back button!)
  if (selectedPortfolio) {
    return (
      <PortfolioDetailView
        portfolio={selectedPortfolio}
        onBack={() => setSelectedPortfolio(null)}
        onSelectPortfolio={(p) => setSelectedPortfolio(p)}
        allPortfolios={portfolios}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#06101F] via-[#09182D] to-[#0A1428] p-6 rounded-3xl border border-[rgba(0,240,255,0.22)] shadow-2xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-[11px] font-bold uppercase tracking-wider mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>LEARN &gt; Portfolio Explorer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Explore Student & Faculty Portfolios
          </h1>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
            Discover projects, skills, achievements, and creative work from the CosmicBone community.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5 z-10">
          <button
            onClick={() => setActiveTab(activeTab === 'explorer' ? 'my-portfolio' : 'explorer')}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'my-portfolio'
                ? 'bg-[#00F0FF] text-black border-[#00F0FF]'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Portfolio</span>
          </button>

          <button
            onClick={() => { setBuilderInitialStep(1); setIsBuilderOpen(true); }}
            className="px-4 py-2.5 rounded-xl text-black font-extrabold text-xs bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] transition-all shadow-lg active:scale-95 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-black stroke-[3]" />
            <span>Create Portfolio</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'my-portfolio' ? (
        <MyPortfolioTab
          portfolio={myPortfolio || null}
          onEdit={(step) => { setBuilderInitialStep(step || 1); setIsBuilderOpen(true); }}
          onPreview={(p) => setSelectedPortfolio(p)}
          onCreateNew={() => { setBuilderInitialStep(1); setIsBuilderOpen(true); }}
        />
      ) : (
        <div className="space-y-6">
          {/* Filter & Search Toolbar */}
          <div className="bg-[#090C22]/90 border border-[rgba(0,240,255,0.18)] p-4 sm:p-5 rounded-3xl shadow-xl space-y-4">
            {/* Search Input & Sort Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search projects, skills, or creators..."
                  className="w-full bg-[#040612] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 transition-all"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="bg-[#040612] border border-[rgba(0,240,255,0.18)] text-xs text-[#00F0FF] font-bold rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="most_recent">Most Recent</option>
                  <option value="most_popular">Most Popular</option>
                  <option value="highest_rated">Highest Rated</option>
                  <option value="lowest_price">Lowest Price</option>
                </select>
              </div>
            </div>

            {/* VISIBLE CATEGORY PILLS BAR (Immediately visible, tap to filter) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Filter by Category</span>
              <div className="flex overflow-x-auto gap-1.5 bg-[#040716] p-1.5 rounded-2xl border border-white/5 w-full scrollbar-none">
                <button
                  onClick={() => setFilters({ ...filters, category: 'All' })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    filters.category === 'All'
                      ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>All</span>
                  <span className={`px-1.5 py-0.2 text-[9px] rounded-md font-bold ${
                    filters.category === 'All' ? 'bg-black/15 text-black' : 'bg-white/5 text-gray-450'
                  }`}>
                    {portfolios.length}
                  </span>
                </button>
                {CATEGORIES.map((cat) => {
                  const count = categoryCounts[cat] || 0;
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilters({ ...filters, category: cat })}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        filters.category === cat
                          ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`px-1.5 py-0.2 text-[9px] rounded-md font-bold ${
                        filters.category === cat ? 'bg-black/15 text-black' : 'bg-white/5 text-gray-450'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Filter Controls removed */}
          </div>

          {/* Portfolio Grid */}
          {filteredList.length === 0 ? (
            <div className="py-20 text-center bg-[#090C22]/50 border border-white/5 rounded-3xl space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/20 mx-auto flex items-center justify-center text-[#00F0FF]">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">No Portfolios Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No portfolios match these filters. Try clearing a filter or exploring another category.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-[#00F0FF] text-black font-extrabold text-xs rounded-xl shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredList.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onOpenDetail={handleOpenDetail}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Builder Modal */}
      <PortfolioBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        existingPortfolio={myPortfolio || null}
        initialStep={builderInitialStep}
        onSuccess={() => {
          reloadPortfolios();
          setActiveTab('my-portfolio');
        }}
      />
    </div>
  );
};
