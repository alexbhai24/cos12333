import React, { useState } from 'react';
import { X, BookOpen, Download, Loader2, AlertTriangle, ExternalLink, Link2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { linkService } from '../../services/linkService';
import { getGradeLabel } from '../../utils/gradeUtils';

export const BookModal: React.FC = () => {
  const { activeBookModal, setActiveBookModal } = useApp();
  const [loading, setLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);

  if (!activeBookModal) return null;

  const book = activeBookModal;
  const rawUrl = book.fileUrl || '';
  const grade = (book.targetGrades || [])[0] || '';

  const previewType = linkService.getPreviewType(rawUrl);
  const previewUrl = linkService.getPreviewUrl(rawUrl);
  const hasUrl = !!rawUrl && rawUrl !== '#';

  const handleClose = () => {
    setActiveBookModal(null);
    setLoading(true);
    setPreviewError(false);
  };

  const openInNewTab = () => {
    if (!hasUrl) return;
    window.open(rawUrl, '_blank', 'noopener,noreferrer');
  };

  const LoaderOverlay = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050D1E] z-10 space-y-3">
      <Loader2 className="w-8 h-8 text-[#37D996] animate-spin" />
      <span className="text-xs text-gray-400">Loading preview…</span>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4 px-8 text-center">
      <AlertTriangle className="w-10 h-10 text-red-400" />
      <p className="text-white font-bold text-sm">Preview failed to load</p>
      <p className="text-gray-400 text-xs max-w-xs">
        {linkService.isGoogleDrive(rawUrl)
          ? 'Make sure this Google Drive file is shared as "Anyone with the link → Viewer".'
          : 'The file may be behind a login or CORS restriction.'}
      </p>
      <button
        onClick={openInNewTab}
        className="px-4 py-2 bg-[#37D996]/20 border border-[#37D996]/40 text-[#37D996] text-xs font-bold rounded-xl hover:bg-[#37D996]/30 transition-colors flex items-center space-x-2"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        <span>Open in new tab</span>
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="w-full max-w-4xl bg-[#09182D] border border-[rgba(55,217,150,0.25)] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '92vh' }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#06101F] border-b border-[rgba(55,217,150,0.15)] flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 rounded-xl bg-[#37D996]/15 text-[#37D996] flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
                {grade && (
                  <span className="px-2 py-0.5 bg-[#00F0FF] text-black font-extrabold text-[9px] rounded-full uppercase">
                    {getGradeLabel(grade)}
                  </span>
                )}
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold rounded-full">
                  {book.subject}
                </span>
                {book.pages && (
                  <span className="text-[9px] text-gray-500 font-mono">{book.pages} pages</span>
                )}
              </div>
              <h2 className="text-sm font-bold text-white font-heading truncate">{book.title}</h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="ml-3 flex-shrink-0 p-2 text-gray-400 hover:text-white rounded-full bg-[#0D213A] hover:bg-[#152940] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Preview Body ── */}
        <div className="flex-1 overflow-hidden relative bg-[#050D1E] min-h-0" style={{ minHeight: 320 }}>
          {!hasUrl ? (
            <div className="flex flex-col items-center justify-center h-full py-16 px-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{book.title}</p>
                <p className="text-gray-400 text-xs mt-1">No file link has been set for this book.</p>
              </div>
              <p className="text-gray-500 text-xs max-w-xs">
                An admin or teacher can edit this book and paste a public Google Drive or direct file link.
              </p>
            </div>
          ) : previewType === 'googledrive' || previewType === 'pdf' || previewType === 'office' ? (
            <div className="relative w-full h-full">
              {loading && !previewError && <LoaderOverlay />}
              {previewError ? (
                <ErrorState />
              ) : (
                <iframe
                  key={previewUrl}
                  src={previewUrl}
                  title={book.title}
                  allow="autoplay"
                  className="w-full h-full border-0"
                  style={{ minHeight: 360 }}
                  onLoad={() => setLoading(false)}
                  onError={() => { setLoading(false); setPreviewError(true); }}
                />
              )}
            </div>
          ) : previewType === 'image' ? (
            <div className="relative flex items-center justify-center h-full p-4 bg-[#050D1E]">
              {loading && <LoaderOverlay />}
              {previewError ? (
                <div className="text-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
                  <p className="text-sm text-white">Image failed to load</p>
                </div>
              ) : (
                <img
                  src={rawUrl}
                  alt={book.title}
                  className="max-w-full max-h-full object-contain rounded-xl"
                  onLoad={() => setLoading(false)}
                  onError={() => { setLoading(false); setPreviewError(true); }}
                />
              )}
            </div>
          ) : (
            /* Unknown link — open/download buttons */
            <div className="flex flex-col items-center justify-center h-full py-16 px-8 text-center space-y-5">
              <div className="w-20 h-20 rounded-2xl bg-[#37D996]/10 border border-[#37D996]/20 flex items-center justify-center text-[#37D996]">
                <Link2 className="w-10 h-10" />
              </div>
              <div>
                <p className="text-white font-bold">{book.title}</p>
                <p className="text-gray-500 text-xs mt-1 break-all max-w-xs mx-auto">{rawUrl}</p>
              </div>
              <p className="text-gray-400 text-xs max-w-xs">
                This link type cannot be embedded. Open or download it directly.
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={openInNewTab}
                  className="px-5 py-2.5 bg-[#37D996]/20 border border-[#37D996]/40 text-[#37D996] font-bold text-xs rounded-xl flex items-center space-x-2 hover:bg-[#37D996]/30 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open File Link</span>
                </button>
                <a
                  href={rawUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#37D996] to-[#00F0FF] text-black font-bold text-xs rounded-xl flex items-center space-x-2 shadow-md hover:brightness-110 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Open</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#06101F] border-t border-[rgba(55,217,150,0.15)] flex-shrink-0">
          <p className="text-xs text-gray-400 line-clamp-1 max-w-[260px] sm:max-w-sm">
            {book.description}
          </p>
          <button
            onClick={openInNewTab}
            disabled={!hasUrl}
            className="px-5 py-2.5 bg-gradient-to-r from-[#37D996] to-[#00F0FF] text-[#030816] font-bold text-xs rounded-xl flex items-center space-x-2 shadow-md hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Download Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};
