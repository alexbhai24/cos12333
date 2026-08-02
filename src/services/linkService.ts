/**
 * linkService — URL analysis and preview utilities for study material links.
 * Handles Google Drive sharing links, direct PDF/Office/image URLs.
 * No file upload logic here — users paste public links.
 */

export type PreviewType = 'googledrive' | 'pdf' | 'office' | 'image' | 'unknown';

/** Extract Google Drive file ID from any Drive/Docs sharing URL */
const getGoogleDriveId = (url: string): string | null => {
  if (!url) return null;
  // https://drive.google.com/file/d/FILE_ID/view?...
  const m1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return m1[1];
  // https://drive.google.com/open?id=FILE_ID
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return m2[1];
  // https://docs.google.com/document/d/FILE_ID/...
  const m3 = url.match(/docs\.google\.com\/[^/]+\/d\/([a-zA-Z0-9_-]+)/);
  if (m3) return m3[1];
  return null;
};

export const linkService = {
  /**
   * Classify a URL so the preview modal can pick the right viewer.
   * Detection is based on the URL itself (domain, extension).
   */
  getPreviewType: (url: string): PreviewType => {
    if (!url) return 'unknown';

    const clean = url.split('?')[0].toLowerCase();

    // Google Drive / Docs / Sheets / Slides
    if (
      url.includes('drive.google.com') ||
      url.includes('docs.google.com') ||
      url.includes('sheets.google.com') ||
      url.includes('slides.google.com')
    ) {
      return 'googledrive';
    }

    const ext = clean.split('.').pop() || '';

    if (ext === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) return 'image';
    if (['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(ext)) return 'office';

    return 'unknown';
  },

  /**
   * Convert any supported public link into an embeddable preview URL.
   * - Google Drive → drive.google.com/file/d/{id}/preview
   * - Direct PDF/image → original URL
   * - Direct Office file → Microsoft Office Online viewer
   * - Unknown → original URL (caller decides what to show)
   */
  getPreviewUrl: (url: string): string => {
    if (!url) return '';

    const type = linkService.getPreviewType(url);

    if (type === 'googledrive') {
      const fileId = getGoogleDriveId(url);
      if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
      // Fallback: can't extract ID — let user open directly
      return url;
    }

    if (type === 'office') {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    }

    // pdf, image, unknown — use URL as-is
    return url;
  },

  /** Returns true for Google Drive links */
  isGoogleDrive: (url: string): boolean =>
    url.includes('drive.google.com') || url.includes('docs.google.com'),

  /** Basic URL validation: must be https */
  validateUrl: (url: string): string | null => {
    if (!url.trim()) return 'A file link is required.';
    if (!url.startsWith('https://')) return 'Link must start with https://';
    return null; // valid
  },

  /** Format Google Form URL into embedded view URL */
  formatGoogleFormUrl: (raw: string): string => {
    if (!raw) return '';
    let url = raw.trim();

    // If iframe tag, extract src
    if (url.includes('<iframe') && url.includes('src=')) {
      const srcMatch = url.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        url = srcMatch[1];
      }
    }

    // Replace /edit with /viewform
    url = url.replace(/\/edit.*$/, '/viewform');

    // Convert docs.google.com/forms links to embedded=true
    if (url.includes('docs.google.com/forms')) {
      if (url.includes('embedded=true')) {
        return url;
      }
      if (url.includes('?')) {
        return `${url}&embedded=true`;
      }
      return `${url}?embedded=true`;
    }

    return url;
  },
};
