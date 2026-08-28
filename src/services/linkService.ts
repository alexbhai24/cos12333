export interface LinkTool {
  id: string;
  label: string;
  url: string;
}

export interface LinkConfig {
  mainUrl: string;
  siteName: string;
  tools: LinkTool[];
}

export const DEFAULT_LINK_CONFIG: LinkConfig = {
  mainUrl: 'https://wpmcheck.com/',
  siteName: 'Link (wpmcheck.com)',
  tools: [
    { id: 't1', label: 'Speed Test', url: 'https://wpmcheck.com/' },
    { id: 't2', label: 'Speed Test (Extended)', url: 'https://wpmcheck.com/reading-speed-test' },
    { id: 't3', label: 'Time Calculator', url: 'https://wpmcheck.com/reading-time-calculator' },
    { id: 't4', label: 'Speed Benchmarks', url: 'https://wpmcheck.com/reading-speed-benchmarks' },
    { id: 't5', label: 'Readability Checker', url: 'https://wpmcheck.com/readability-checker' },
    { id: 't6', label: 'Multi-Formula Analysis', url: 'https://wpmcheck.com/multi-formula-analysis' },
    { id: 't7', label: 'Achievements', url: 'https://wpmcheck.com/achievements' },
    { id: 't8', label: 'History', url: 'https://wpmcheck.com/history' },
  ],
};

const STORAGE_KEY = 'cosmicbone_link_config';
type Listener = (config: LinkConfig) => void;
const listeners = new Set<Listener>();

function loadConfig(): LinkConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LINK_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_LINK_CONFIG, ...parsed };
  } catch {
    return DEFAULT_LINK_CONFIG;
  }
}

function saveConfig(config: LinkConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  listeners.forEach((cb) => cb(config));
}

export type PreviewType =
  | 'pdf'
  | 'googledrive'
  | 'gdrive'
  | 'gdoc'
  | 'office'
  | 'image'
  | 'video'
  | 'website'
  | 'embed'
  | 'generic'
  | 'other';

export const linkService = {
  // ── Dynamic Embed Link Portal Config ──────────────────────────────────────
  getConfig(): LinkConfig {
    return loadConfig();
  },

  updateConfig(partial: Partial<LinkConfig>): void {
    const current = loadConfig();
    const updated = { ...current, ...partial };
    saveConfig(updated);
  },

  setMainUrl(url: string, siteName?: string): void {
    const current = loadConfig();
    const updated: LinkConfig = {
      ...current,
      mainUrl: url,
      siteName: siteName || current.siteName,
    };
    saveConfig(updated);
  },

  subscribe(cb: Listener): () => void {
    listeners.add(cb);
    cb(loadConfig());
    return () => listeners.delete(cb);
  },

  // ── Link Preview and URL Format Utilities ─────────────────────────────────
  validateUrl(url: string): string {
    if (!url || !url.trim()) return 'URL is required.';
    try {
      const parsed = new URL(url.trim());
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return 'URL must start with http:// or https://';
      }
      return '';
    } catch {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }
  },

  isGoogleDrive(url: string): boolean {
    if (!url) return false;
    return url.includes('drive.google.com') || url.includes('docs.google.com');
  },

  formatGoogleFormUrl(url: string): string {
    if (!url) return '';
    let trimmed = url.trim();
    if (trimmed.includes('docs.google.com/forms')) {
      if (!trimmed.includes('embedded=true')) {
        trimmed += (trimmed.includes('?') ? '&' : '?') + 'embedded=true';
      }
    }
    return trimmed;
  },

  getPreviewType(url: string): PreviewType {
    if (!url) return 'generic';
    const lower = url.toLowerCase();

    if (lower.includes('drive.google.com') || lower.includes('docs.google.com')) {
      return 'googledrive';
    }

    if (lower.endsWith('.pdf') || lower.includes('.pdf?')) {
      return 'pdf';
    }

    if (lower.match(/\.(docx?|pptx?|xlsx?)($|\?)/) || lower.includes('onedrive') || lower.includes('sharepoint')) {
      return 'office';
    }

    if (lower.match(/\.(jpeg|jpg|png|gif|webp|svg)($|\?)/)) {
      return 'image';
    }

    if (lower.match(/\.(mp4|webm|ogg)($|\?)/) || lower.includes('youtube.com') || lower.includes('youtu.be')) {
      return 'video';
    }

    return 'website';
  },

  getPreviewUrl(url: string): string {
    if (!url) return '';
    const trimmed = url.trim();

    if (trimmed.includes('drive.google.com/file/d/')) {
      const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    if (trimmed.includes('docs.google.com/document/d/')) {
      const match = trimmed.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://docs.google.com/document/d/${match[1]}/preview`;
      }
    }

    if (trimmed.includes('docs.google.com/presentation/d/')) {
      const match = trimmed.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://docs.google.com/presentation/d/${match[1]}/embed`;
      }
    }

    if (trimmed.includes('docs.google.com/spreadsheets/d/')) {
      const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://docs.google.com/spreadsheets/d/${match[1]}/preview`;
      }
    }

    return trimmed;
  },
};

export default linkService;
