import type { PortfolioProfile, PortfolioFilters } from '../types/portfolio';

const STORAGE_KEY = 'cosmicbone_portfolios_v1';

class PortfolioService {
  private portfolios: PortfolioProfile[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.portfolios = JSON.parse(stored);
      } else {
        this.portfolios = [];
        this.saveToStorage();
      }
    } catch {
      this.portfolios = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.portfolios));
    } catch (e) {
      console.warn('Failed to persist portfolios to localStorage', e);
    }
  }

  public getAllPortfolios(): PortfolioProfile[] {
    return this.portfolios.filter(p => p.status === 'published');
  }

  public getPortfolioById(id: string): PortfolioProfile | undefined {
    return this.portfolios.find(p => p.id === id);
  }

  public getPortfolioByOwnerId(ownerId: string): PortfolioProfile | undefined {
    return this.portfolios.find(p => p.ownerId === ownerId);
  }

  /**
   * Sanitizes iframe / video embed codes strictly for security.
   * Only allows valid https YouTube or Vimeo embed URLs.
   * Strips out raw HTML script tags, onload handlers, javascript: URIs, etc.
   */
  public sanitizeEmbedUrl(rawInput?: string): string | undefined {
    if (!rawInput || typeof rawInput !== 'string') return undefined;

    let srcUrl = rawInput.trim();

    // If user pasted an <iframe> tag, extract src="..." attribute
    if (srcUrl.includes('<iframe')) {
      const match = srcUrl.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        srcUrl = match[1];
      } else {
        return undefined; // Invalid iframe tag with no src
      }
    }

    // Strip out dangerous protocols or script references
    if (
      srcUrl.toLowerCase().includes('script') ||
      srcUrl.toLowerCase().includes('javascript:') ||
      srcUrl.toLowerCase().includes('data:') ||
      srcUrl.toLowerCase().includes('onload=')
    ) {
      return undefined;
    }

    // Convert standard youtube watch link to embed format
    // e.g. https://www.youtube.com/watch?v=VIDEO_ID -> https://www.youtube.com/embed/VIDEO_ID
    if (srcUrl.includes('youtube.com/watch?v=')) {
      const videoId = srcUrl.split('v=')[1]?.split('&')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (srcUrl.includes('youtu.be/')) {
      const videoId = srcUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    // Convert vimeo video link to embed format
    if (srcUrl.includes('vimeo.com/') && !srcUrl.includes('player.vimeo.com')) {
      const videoId = srcUrl.split('vimeo.com/')[1]?.split('/')[0];
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }

    // Validate that URL is strictly HTTPS and from YouTube or Vimeo
    if (
      srcUrl.startsWith('https://www.youtube.com/embed/') ||
      srcUrl.startsWith('https://youtube.com/embed/') ||
      srcUrl.startsWith('https://player.vimeo.com/video/')
    ) {
      return srcUrl;
    }

    return undefined;
  }

  public filterPortfolios(filters: PortfolioFilters): PortfolioProfile[] {
    return this.portfolios.filter(portfolio => {
      if (portfolio.status !== 'published') return false;

      // 1. Search Query
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const matchName = portfolio.fullName.toLowerCase().includes(q);
        const matchHeadline = portfolio.headline.toLowerCase().includes(q);
        const matchBio = portfolio.bio.toLowerCase().includes(q);
        const matchSkills = portfolio.skills.some(s => s.toLowerCase().includes(q));
        const matchProjects = portfolio.projects.some(
          p => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
        );
        if (!matchName && !matchHeadline && !matchBio && !matchSkills && !matchProjects) {
          return false;
        }
      }

      // 2. Category
      if (filters.category && filters.category !== 'All') {
        if (portfolio.category !== filters.category) return false;
      }

      // 3. Skills
      if (filters.skills && filters.skills.length > 0) {
        const hasSkill = filters.skills.some(skill =>
          portfolio.skills.some(ps => ps.toLowerCase() === skill.toLowerCase())
        );
        if (!hasSkill) return false;
      }

      // 4. Budget / Price Range
      const projectPrices = portfolio.projects.map(p => p.price || 0);
      const minPortfolioPrice = projectPrices.length ? Math.min(...projectPrices) : 0;

      if (filters.minPrice !== null && minPortfolioPrice < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && minPortfolioPrice > filters.maxPrice) {
        return false;
      }

      // 5. Delivery Time Filter
      if (filters.deliveryTime && filters.deliveryTime !== 'Any Time') {
        const hasMatchingDelivery = portfolio.projects.some(p => {
          if (!p.deliveryTime) return false;
          const dt = p.deliveryTime.toLowerCase();
          if (filters.deliveryTime === '24 Hours') return dt.includes('24') || dt.includes('1 day');
          if (filters.deliveryTime === 'Under 7 Days') return dt.includes('day') && parseInt(dt) <= 7;
          if (filters.deliveryTime === 'Under 21 Days') return dt.includes('day') && parseInt(dt) <= 21;
          return true;
        });
        if (!hasMatchingDelivery) return false;
      }

      // 6. Talent Details Filter
      if (filters.talentDetails && filters.talentDetails.length > 0) {
        const matchBadge = filters.talentDetails.some(td => {
          if (td === 'Top Rated') return portfolio.achievementBadge === 'Top Rated';
          if (td === 'Featured') return portfolio.achievementBadge === 'Featured';
          if (td === 'Rising Talent') return portfolio.achievementBadge === 'Rising Talent';
          return true;
        });
        if (!matchBadge) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'most_popular':
          return (b.viewsCount || 0) - (a.viewsCount || 0);
        case 'highest_rated':
          return (b.rating || 0) - (a.rating || 0);
        case 'lowest_price':
          const minA = Math.min(...a.projects.map(p => p.price || 0), 99999);
          const minB = Math.min(...b.projects.map(p => p.price || 0), 99999);
          return minA - minB;
        case 'most_recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }

  public savePortfolio(portfolio: PortfolioProfile): PortfolioProfile {
    const existingIndex = this.portfolios.findIndex(p => p.id === portfolio.id || p.ownerId === portfolio.ownerId);
    portfolio.updatedAt = new Date().toISOString();

    if (existingIndex >= 0) {
      this.portfolios[existingIndex] = portfolio;
    } else {
      portfolio.createdAt = new Date().toISOString();
      this.portfolios.unshift(portfolio);
    }

    this.saveToStorage();
    return portfolio;
  }

  public deletePortfolio(id: string): boolean {
    const idx = this.portfolios.findIndex(p => p.id === id);
    if (idx >= 0) {
      this.portfolios.splice(idx, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public incrementViews(id: string) {
    const portfolio = this.getPortfolioById(id);
    if (portfolio) {
      portfolio.viewsCount = (portfolio.viewsCount || 0) + 1;
      this.saveToStorage();
    }
  }
}

export const portfolioService = new PortfolioService();
