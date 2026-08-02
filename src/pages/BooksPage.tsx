import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  Bookmark,
  Share2,
  MessageSquare,
  GraduationCap,
  Plus,
  X,
  Loader2,
  Link2,
  AlertTriangle,
  Info,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import { fileService } from '../services/fileService';
import { linkService } from '../services/linkService';
import { getGradeLabel, getSubjectsForGrade } from '../utils/gradeUtils';
import { useModalLock } from '../hooks/useModalLock';

export const BooksPage: React.FC = () => {
  const {
    selectedGrade,
    savedItemIds,
    toggleSaveItem,
    setActiveBookModal,
    setActiveCommentsItem,
    showNotification,
    openPublicProfile,
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
  const [uploadPages, setUploadPages] = useState(1);
  const [uploadFileUrl, setUploadFileUrl] = useState('');
  const [uploadThumbnailUrl, setUploadThumbnailUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const isOwnerAdmin =
    userProfile?.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com' ||
    currentUser?.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com';
  const canUpload = isOwnerAdmin || userRole === 'admin' || userRole === 'teacher';

  const gradeBooks = contentService.getContentByGrade(selectedGrade, 'book');

  const filteredBooks = gradeBooks.filter((b) => {
    const matchSubject = selectedSubject === 'All' || b.subject === selectedSubject;
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.subject.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  const handleShare = (book: any) => {
    const shareUrl = `${window.location.origin}/#books?id=${book.id}`;
    navigator.clipboard.writeText(shareUrl);
    showNotification('Book link copied to clipboard! 📋');
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
    setUploadPages(1);
    setUploadFileUrl('');
    setUploadThumbnailUrl('');
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

      const thumbnail =
        uploadThumbnailUrl.trim() ||
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80';

      const docId = await fileService.createFile(
        {
          title: uploadTitle,
          description: uploadDescription,
          contentType: 'book',
          subject: uploadSubject,
          targetGrade: uploadGrade,
          fileUrl: uploadFileUrl.trim(),
          thumbnail,
        },
        activeUser
      );

      await contentService.addContentItem({
        id: docId,
        title: uploadTitle.trim(),
        description: uploadDescription.trim(),
        subject: uploadSubject,
        targetGrades: [uploadGrade],
        contentType: 'book',
        authorName: activeUser.displayName || 'Owner Admin',
        authorRole: isOwnerAdmin ? 'Admin Owner 👑' : 'Teacher 🏫',
        authorAvatar: activeUser.photoURL || 'gradient:cyberpunk',
        createdAt: new Date().toISOString(),
        thumbnail,
        views: 0,
        status: 'published',
        pages: Number(uploadPages) || 350,
        fileUrl: uploadFileUrl.trim(),
        attachments: [],
        comments: [],
      });

      showNotification('Book published successfully! 🚀');
      setIsUploadOpen(false);
      resetForm();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to publish book.');
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
            <span>Showing {getGradeLabel(selectedGrade)} Digital Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Digital Textbooks & Practice Exemplars
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Access interactive NCERT companions, reference books, and problem solvers for {getGradeLabel(selectedGrade)}.
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-black font-extrabold text-xs bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4 text-black stroke-[3]" />
            <span>Add Book</span>
          </button>
        )}
      </div>

      {/* Search & Subject Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search textbooks & exemplars..."
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

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="py-20 text-center bg-[#090C22]/50 border border-white/5 rounded-3xl space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400 text-2xl">
            📚
          </div>
          <h3 className="text-base font-bold text-white">No {getGradeLabel(selectedGrade)} books matching filter</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try switching subjects or clear your search to explore other reference books.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const isSaved = savedItemIds.includes(book.id);
            return (
              <div
                key={book.id}
                className="bg-[#090C22]/90 border border-[rgba(0,240,255,0.15)] hover:border-[#00F0FF] rounded-3xl p-5 shadow-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="flex gap-4">
                  <div
                    onClick={() => setActiveBookModal(book)}
                    className="w-24 h-32 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10 relative group-hover:scale-105 transition-transform cursor-pointer"
                  >
                    <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                      <span className="text-[9px] font-bold text-cyan-300 truncate">{book.pages || 350} Pages</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className="px-2 py-0.5 bg-[#00F0FF] text-black font-extrabold text-[9px] rounded-full uppercase">
                        {getGradeLabel(selectedGrade)}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded-full">
                        {book.subject}
                      </span>
                    </div>
                    <h3
                      onClick={() => setActiveBookModal(book)}
                      className="text-sm font-bold text-white line-clamp-2 hover:text-[#00F0FF] cursor-pointer transition-colors"
                    >
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-2">{book.description}</p>
                  </div>
                </div>

                {isSaved && (
                  <div className="bg-[#040716] p-3 rounded-2xl border border-white/5 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-gray-400">Reading Progress</span>
                      <span className="text-[#00F0FF]">{book.readingProgress || 45}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00F0FF] to-emerald-400 rounded-full"
                        style={{ width: `${book.readingProgress || 45}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => openPublicProfile({ name: book.authorName, photoUrl: book.authorAvatar })}
                      className="flex items-center space-x-2 text-left group/author"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#8B5CF6] flex items-center justify-center text-[9px] font-bold text-white border border-[#00F0FF]">
                        {book.authorName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-300 group-hover/author:text-[#00F0FF] font-semibold truncate max-w-[140px]">
                        {book.authorName}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveBookModal(book)}
                      className="text-xs font-bold text-[#00F0FF] hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Read Now
                    </button>
                  </div>

                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => toggleSaveItem(book.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                      }`}
                      title={isSaved ? 'Saved in library' : 'Save book'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShare(book)}
                      className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveCommentsItem(book)}
                      className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                      title="View comments"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[10px] font-bold">{(book.comments || []).length}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Upload Book Modal ── */}
      {isUploadOpen && createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setIsUploadOpen(false); }}
          className="modal-backdrop"
        >
          <div className="modal-panel modal-panel-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/25 flex items-center justify-center text-[#00F0FF]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Add Book to Library</h3>
                  <p className="text-xs text-gray-400">Paste a public link — Google Drive, direct PDF, or DOCX.</p>
                </div>
              </div>
              <button
                onClick={() => { setIsUploadOpen(false); resetForm(); }}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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
                  <span>Book Title *</span>
                  <span className="text-[10px] text-gray-500 font-normal">Max 30 chars ({uploadTitle.length}/30)</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  placeholder="e.g. NCERT Companion Physics Vol. 1"
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
                  placeholder="Provide a summary of the chapters, sections, and targeted exam streams..."
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

              {/* Pages + Cover Image URL */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase block">Total Pages</label>
                  <input
                    type="number"
                    value={uploadPages}
                    onChange={(e) => setUploadPages(Number(e.target.value))}
                    className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase block">Cover Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... (optional)"
                    value={uploadThumbnailUrl}
                    onChange={(e) => setUploadThumbnailUrl(e.target.value)}
                    className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 text-white"
                  />
                </div>
              </div>

              {/* Public Book Link */}
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
                  <span>Publish Digital Book 🚀</span>
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
