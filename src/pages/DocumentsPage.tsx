import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Bookmark,
  Share2,
  MessageSquare,
  Download,
  Eye,
  GraduationCap,
  Plus,
  X,
  Loader2,
  Link2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import { fileService } from '../services/fileService';
import { linkService } from '../services/linkService';
import { getGradeLabel, getSubjectsForGrade } from '../utils/gradeUtils';
import { useModalLock } from '../hooks/useModalLock';

export const DocumentsPage: React.FC = () => {
  const {
    selectedGrade,
    savedItemIds,
    toggleSaveItem,
    setActiveDocModal,
    setActiveCommentsItem,
    showNotification,
  } = useApp();

  const { userRole, userProfile, currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Auto-reset subject filter when grade changes
  useEffect(() => {
    setSelectedSubject('All');
  }, [selectedGrade]);

  const availableSubjects = ['All', ...getSubjectsForGrade(selectedGrade)];

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  useModalLock(isUploadOpen);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadGrade, setUploadGrade] = useState(selectedGrade || 'pcb');
  const [uploadSubject, setUploadSubject] = useState(() => getSubjectsForGrade(selectedGrade || 'pcb')[0] || 'Phy');
  const [uploadFileUrl, setUploadFileUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const isOwnerAdmin =
    userProfile?.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com' ||
    currentUser?.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com';
  const canUpload = isOwnerAdmin || userRole === 'admin' || userRole === 'teacher';

  const gradeDocs = contentService.getContentByGrade(selectedGrade, 'document');

  const filteredDocs = gradeDocs.filter((d) => {
    const matchSubject = selectedSubject === 'All' || d.subject === selectedSubject;
    const matchSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.subject.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  const handleShare = (doc: any) => {
    const shareUrl = `${window.location.origin}/#documents?id=${doc.id}`;
    navigator.clipboard.writeText(shareUrl);
    showNotification('Document link copied to clipboard! 📋');
  };

  const handleUrlChange = (val: string) => {
    setUploadFileUrl(val);
    if (val && urlError) setUrlError('');
  };

  const resetForm = () => {
    setUploadTitle('');
    setUploadDescription('');
    const defaultGrade = selectedGrade || 'pcb';
    setUploadGrade(defaultGrade);
    setUploadSubject(getSubjectsForGrade(defaultGrade)[0] || 'Phy');
    setUploadFileUrl('');
    setUrlError('');
    setUploadError('');
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setUrlError('');

    if (!uploadTitle.trim() || !uploadDescription.trim()) {
      setUploadError('Title and description are required.');
      return;
    }

    if (uploadTitle.length > 30) {
      setUploadError('Title cannot exceed 30 characters.');
      return;
    }

    if (uploadDescription.length > 60) {
      setUploadError('Description cannot exceed 60 characters.');
      return;
    }

    const urlValidation = linkService.validateUrl(uploadFileUrl.trim());
    if (urlValidation) {
      setUrlError(urlValidation);
      return;
    }

    setUploading(true);
    try {
      const activeUser = userProfile || {
        uid: currentUser?.uid || 'admin',
        displayName: currentUser?.displayName || 'Owner Admin',
        photoURL: currentUser?.photoURL || '',
        email: currentUser?.email || 'rajanandalex1@gmail.com',
        role: 'admin' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Detect file type from URL for the badge
      const previewType = linkService.getPreviewType(uploadFileUrl.trim());
      const fileTypeLabel =
        previewType === 'googledrive'
          ? 'Google Drive'
          : previewType === 'pdf'
          ? 'PDF'
          : previewType === 'office'
          ? 'DOCX'
          : previewType === 'image'
          ? 'Image'
          : 'Link';

      const docId = await fileService.createFile(
        {
          title: uploadTitle,
          description: uploadDescription,
          contentType: 'document',
          subject: uploadSubject,
          targetGrade: uploadGrade,
          fileUrl: uploadFileUrl.trim(),
        },
        activeUser
      );

      await contentService.addContentItem({
        id: docId,
        title: uploadTitle.trim(),
        description: uploadDescription.trim(),
        subject: uploadSubject,
        targetGrades: [uploadGrade],
        contentType: 'document',
        authorName: activeUser.displayName || 'Owner Admin',
        authorRole: isOwnerAdmin ? 'Admin Owner 👑' : 'Teacher 🏫',
        authorAvatar: activeUser.photoURL || 'gradient:cyberpunk',
        createdAt: new Date().toISOString(),
        thumbnail: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
        views: 0,
        status: 'published',
        fileType: fileTypeLabel,
        fileUrl: uploadFileUrl.trim(),
        attachments: [],
        comments: [],
      });

      showNotification('Document published successfully! 🚀');
      setIsUploadOpen(false);
      resetForm();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to publish document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#06101F] via-[#09182D] to-[#0A1428] p-6 rounded-3xl border border-[rgba(0,240,255,0.2)] shadow-2xl relative overflow-hidden">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Showing {getGradeLabel(selectedGrade)} Study Guides & Notes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Study Guides & Notes Repository
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Download formula sheets, class notes, and worksheets curated for {getGradeLabel(selectedGrade)}.
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-black font-extrabold text-xs bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4 text-black stroke-[3]" />
            <span>Upload Notes</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes & documents..."
            className="w-full bg-[#090C22] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500"
          />
        </div>
        <div className="flex overflow-x-auto gap-1 bg-[#040716] p-1 rounded-xl border border-white/5 w-full sm:w-auto scrollbar-none">
          {availableSubjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubject === sub
                  ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="py-20 text-center bg-[#090C22]/50 border border-white/5 rounded-3xl space-y-3">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center text-cyan-400 text-2xl">
            📄
          </div>
          <h3 className="text-base font-bold text-white">No {getGradeLabel(selectedGrade)} documents found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            No study guides matching your search are available for {getGradeLabel(selectedGrade)} yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => {
            const isSaved = savedItemIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                className="bg-[#090C22]/90 border border-[rgba(0,240,255,0.15)] hover:border-[#00F0FF] rounded-3xl p-5 shadow-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-2.5 py-1 bg-[#00F0FF] text-black font-extrabold text-[10px] rounded-full uppercase shadow">
                        {getGradeLabel(selectedGrade)}
                      </span>
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full">
                        {doc.fileType || doc.format || 'FILE'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">{doc.fileSize || ''}</span>
                  </div>

                  <h3
                    onClick={() => setActiveDocModal(doc)}
                    className="text-base font-bold text-white line-clamp-2 hover:text-[#00F0FF] cursor-pointer transition-colors"
                  >
                    {doc.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">{doc.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setActiveDocModal(doc)}
                      className="px-3 py-1.5 bg-[#00F0FF] hover:bg-cyan-400 text-black font-bold text-xs rounded-xl flex items-center space-x-1 transition-all shadow-md active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => {
                        if (doc.fileUrl && doc.fileUrl !== '#') {
                          window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
                        } else {
                          showNotification('No file link available.');
                        }
                      }}
                      className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl"
                      title="Open / Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleSaveItem(doc.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                      }`}
                      title={isSaved ? 'Saved in library' : 'Save document'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShare(doc)}
                      className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveCommentsItem(doc)}
                      className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                      title="View comments"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[10px] font-bold">{(doc.comments || []).length}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Upload Notes Modal ── */}
      {isUploadOpen && createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setIsUploadOpen(false); }}
          className="modal-backdrop"
        >
          <div className="modal-panel modal-panel-lg" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/25 flex items-center justify-center text-[#00F0FF]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Upload Study Material</h3>
                  <p className="text-xs text-gray-400">Paste a public link — Google Drive, PDF, DOCX, image, etc.</p>
                </div>
              </div>
              <button
                onClick={() => { setIsUploadOpen(false); resetForm(); }}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Scrollable body */}
            <div className="modal-body">

            {uploadError && (
              <div className="p-3.5 bg-red-950/30 border border-red-500/30 rounded-2xl text-red-400 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase flex justify-between">
                  <span>Title *</span>
                  <span className="text-[10px] text-gray-500 font-normal">Max 30 chars ({uploadTitle.length}/30)</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  placeholder="e.g. Faraday's Laws Formula Summary"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 text-white"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase flex justify-between">
                  <span>Description *</span>
                  <span className="text-[10px] text-gray-500 font-normal">Max 60 chars ({uploadDescription.length}/60)</span>
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={60}
                  placeholder="Summarize the core concepts covered in these notes..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 text-white"
                />
              </div>

              {/* Subject + Grade */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase block">Subject</label>
                  <select
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value)}
                    className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 text-[#00F0FF]"
                  >
                    {getSubjectsForGrade(uploadGrade).map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase block">Grade Level</label>
                  <select
                    value={uploadGrade}
                    onChange={(e) => {
                      const newGrade = e.target.value;
                      setUploadGrade(newGrade);
                      const subs = getSubjectsForGrade(newGrade);
                      if (subs.length > 0) {
                        setUploadSubject(subs[0]);
                      }
                    }}
                    className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 text-[#00F0FF]"
                  >
                    <option value="class_6">Class 6</option>
                    <option value="class_7">Class 7</option>
                    <option value="class_8">Class 8</option>
                    <option value="class_9">Class 9</option>
                    <option value="class_10">Class 10</option>
                    <option value="pcb">PCB (Senior Secondary)</option>
                    <option value="pcm">PCM (Senior Secondary)</option>
                    <option value="skill">Skill Development</option>

                    <option value="dropper">Business Batch</option>
                  </select>
                </div>
              </div>

              {/* Public File Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase block flex items-center space-x-1">
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Public File or Google Drive Link *</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="Paste a public PDF, DOCX, PPTX, image, or Google Drive sharing link"
                  value={uploadFileUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className={`w-full bg-[#060919] border focus:outline-none text-sm rounded-xl px-4 py-3 text-white placeholder-gray-600 ${
                    urlError
                      ? 'border-red-500/60 focus:border-red-400'
                      : 'border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF]'
                  }`}
                />
                {urlError ? (
                  <p className="text-xs text-red-400 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{urlError}</span>
                  </p>
                ) : (
                  <div className="flex items-start space-x-1.5 text-[10px] text-gray-500 leading-relaxed">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#00F0FF]/50" />
                    <span>
                      Google Drive files must be shared as{' '}
                      <span className="text-[#00F0FF]/80 font-semibold">"Anyone with the link"</span>.
                      This link must be publicly accessible.
                    </span>
                  </div>
                )}
                {/* Live preview type hint */}
                {uploadFileUrl && !urlError && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-[#00F0FF]/5 border border-[#00F0FF]/20 rounded-xl">
                    <span className="text-[10px] text-gray-400">Detected as:</span>
                    <span className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider">
                      {(() => {
                        const t = linkService.getPreviewType(uploadFileUrl);
                        return t === 'googledrive' ? '🗂 Google Drive' : t === 'pdf' ? '📄 PDF' : t === 'office' ? '📝 Office Doc' : t === 'image' ? '🖼 Image' : '🔗 Link';
                      })()}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3.5 bg-gradient-to-r from-[#00C4CC] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] text-black font-extrabold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-70"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Publishing…</span>
                  </>
                ) : (
                  <span>Publish Study Notes 🚀</span>
                )}
              </button>
            </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
