import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Award,
  Search,
  Bookmark,
  Share2,
  MessageSquare,
  Play,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import { linkService } from '../services/linkService';
import { getGradeLabel, getSubjectsForGrade } from '../utils/gradeUtils';
import { useModalLock } from '../hooks/useModalLock';

export const TestsPage: React.FC = () => {
  const {
    selectedGrade,
    savedItemIds,
    toggleSaveItem,
    setActiveTestModal,
    setActiveCommentsItem,
    showNotification,
    openPublicProfile
  } = useApp();

  const { userRole, userProfile, currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Create Test Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  useModalLock(isUploadOpen);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadGrade, setUploadGrade] = useState(selectedGrade || 'pcb');
  const [uploadSubject, setUploadSubject] = useState(() => getSubjectsForGrade(selectedGrade || 'pcb')[0] || 'Phy');
  const [uploadDuration, setUploadDuration] = useState(60);
  const [uploadQuestionsCount, setUploadQuestionsCount] = useState(30);
  const [uploadAppleReward, setUploadAppleReward] = useState(25);
  const [uploadGoogleFormUrl, setUploadGoogleFormUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Determine admin/teacher access
  const isOwnerAdmin =
    userProfile?.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com' ||
    currentUser?.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com';
  const canUpload = isOwnerAdmin || userRole === 'admin' || userRole === 'teacher';

  const subjects = ['All', ...getSubjectsForGrade(selectedGrade)];

  // Auto-reset subject filter if it's not valid for the newly selected grade
  React.useEffect(() => {
    if (selectedSubject !== 'All' && !getSubjectsForGrade(selectedGrade).includes(selectedSubject)) {
      setSelectedSubject('All');
    }
  }, [selectedGrade, selectedSubject]);

  // Filter tests by grade
  const gradeTests = [
    ...contentService.getContentByGrade(selectedGrade, 'test_series'),
    ...contentService.getContentByGrade(selectedGrade, 'test'),
  ];

  const filteredTests = gradeTests.filter((t) => {
    const matchSub = selectedSubject === 'All' || t.subject === selectedSubject;
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchSub && matchSearch;
  });

  const handleShare = (test: any) => {
    const shareUrl = `${window.location.origin}/#tests?id=${test.id}`;
    navigator.clipboard.writeText(shareUrl);
    showNotification('Test link copied to clipboard! 📋');
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    if (!uploadGoogleFormUrl.trim()) {
      setUploadError('Google Form Link is required to publish a test.');
      return;
    }

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

      const finalFormUrl = linkService.formatGoogleFormUrl(uploadGoogleFormUrl);

      // Create new test / test series
      contentService.addContentItem({
        id: `test-${Date.now()}`,
        title: uploadTitle.trim(),
        description: uploadDescription.trim(),
        subject: uploadSubject,
        targetGrades: [uploadGrade],
        contentType: 'test',
        authorName: activeUser.displayName || 'Owner Admin',
        authorId: activeUser.uid,
        authorRole: isOwnerAdmin ? 'Admin Owner 👑' : 'Teacher 🏫',
        authorAvatar: activeUser.photoURL || 'gradient:cyberpunk',
        createdAt: new Date().toISOString(),
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
        views: 0,
        status: 'published',
        difficulty: 'Medium',
        durationMinutes: Number(uploadDuration) || 60,
        questionsCount: Number(uploadQuestionsCount) || 30,
        appleReward: Number(uploadAppleReward) || 25,
        googleFormUrl: finalFormUrl || undefined,
        attachments: [],
        comments: [],
      });

      showNotification('Test published successfully! 🚀');
      setIsUploadOpen(false);
      // Reset form
      setUploadTitle('');
      setUploadDescription('');
      setUploadDuration(60);
      setUploadQuestionsCount(30);
      setUploadAppleReward(25);
      setUploadGoogleFormUrl('');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to create test.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#06101F] via-[#09182D] to-[#0A1428] p-6 rounded-3xl border border-[rgba(0,240,255,0.2)] shadow-2xl relative overflow-hidden">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-extrabold uppercase tracking-wider mb-2 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <Award className="w-4 h-4" />
            <span>Test Series — {getGradeLabel(selectedGrade)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Mock Examinations & Practice Tests
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Challenge yourself with timed exam papers per latest NTA/CBSE patterns for {getGradeLabel(selectedGrade)}. Earn 🍏 Green Apples!
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-black font-extrabold text-xs bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4 text-black stroke-[3]" />
            <span>Create Test</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search test series..."
            className="w-full bg-[#090C22] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500"
          />
        </div>

        {/* Subject Filter Pills */}
        <div className="flex overflow-x-auto gap-1 bg-[#040716] p-1 rounded-xl border border-white/5 w-full sm:w-auto">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubject === sub
                  ? 'bg-[#00F0FF] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      {filteredTests.length === 0 ? (
        <div className="py-20 text-center bg-[#090C22]/50 border border-white/5 rounded-3xl space-y-3">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400 text-2xl">
            🏆
          </div>
          <h3 className="text-base font-bold text-white">No tests found for {getGradeLabel(selectedGrade)}</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            No mock test papers matching your subject filter are scheduled for {getGradeLabel(selectedGrade)} right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const isSaved = savedItemIds.includes(test.id);

            return (
              <div
                key={test.id}
                className="bg-[#090C22]/90 border border-[rgba(0,240,255,0.15)] hover:border-[#00F0FF] rounded-3xl p-5 shadow-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-2.5 py-1 bg-[#00F0FF] text-black font-extrabold text-[10px] rounded-full uppercase shadow">
                        {getGradeLabel(selectedGrade)}
                      </span>
                      <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold rounded-full">
                        {test.subject}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                        test.difficulty === 'Hard'
                          ? 'bg-rose-500/20 border-rose-500/30 text-rose-300'
                          : test.difficulty === 'Medium'
                          ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                          : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                      }`}
                    >
                      {test.difficulty || 'Medium'}
                    </span>
                  </div>

                  <h3
                    onClick={() => setActiveTestModal(test)}
                    className="text-base font-bold text-white line-clamp-2 hover:text-[#00F0FF] cursor-pointer transition-colors"
                  >
                    {test.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {test.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() =>
                        openPublicProfile({
                          name: test.authorName,
                          photoUrl: test.authorAvatar,
                        })
                      }
                      className="flex items-center space-x-2 text-left group/author"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#8B5CF6] flex items-center justify-center text-[9px] font-bold text-white border border-[#00F0FF]">
                        {test.authorName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-300 group-hover/author:text-[#00F0FF] font-semibold truncate max-w-[140px]">
                        {test.authorName}
                      </span>
                    </button>

                    <span className="text-[10px] text-gray-500">{test.attemptsCount || 420} Attempts</span>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setActiveTestModal(test)}
                      className="px-4 py-2 bg-[#00F0FF] hover:bg-cyan-400 text-black font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Test</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      {/* Save */}
                      <button
                        onClick={() => toggleSaveItem(test.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isSaved
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                        }`}
                        title={isSaved ? 'Saved in library' : 'Save for later'}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(test)}
                        className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors"
                        title="Share test link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Comments */}
                      <button
                        onClick={() => setActiveCommentsItem(test)}
                        className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                        title="View discussions"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[10px] font-bold">{(test.comments || []).length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Test Modal */}
      {isUploadOpen && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsUploadOpen(false);
          }}
          className="modal-backdrop"
        >
          <div className="modal-panel modal-panel-lg" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/25 flex items-center justify-center text-[#00F0FF]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Create Mock Test</h3>
                  <p className="text-[11px] text-gray-400">Attach a Google Form and set examination duration.</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="modal-body">
              {uploadError && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
                  {uploadError}
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase flex justify-between">
                    <span>Test Title *</span>
                    <span className="text-[10px] text-gray-500 font-normal">Max 30 chars ({uploadTitle.length}/30)</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    placeholder="e.g. NEET Biology Mock Test 2026"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase flex justify-between">
                    <span>Description *</span>
                    <span className="text-[10px] text-gray-500 font-normal">Max 60 chars ({uploadDescription.length}/60)</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    maxLength={60}
                    placeholder="Summarize instructions, syllabus, and exam targets..."
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase block">Subject</label>
                    <select
                      value={uploadSubject}
                      onChange={(e) => setUploadSubject(e.target.value)}
                      className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3 py-2 text-[#00F0FF] bg-[#090C22]"
                    >
                      {getSubjectsForGrade(uploadGrade).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase block">Grade Level</label>
                    <select
                      value={uploadGrade}
                      onChange={(e) => {
                        const newGrade = e.target.value;
                        setUploadGrade(newGrade);
                        const subs = getSubjectsForGrade(newGrade);
                        if (subs.length > 0) setUploadSubject(subs[0]);
                      }}
                      className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3 py-2 text-[#00F0FF] bg-[#090C22]"
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

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Duration (Mins)</label>
                    <input
                      type="number"
                      value={uploadDuration}
                      onChange={(e) => setUploadDuration(Number(e.target.value))}
                      className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-2.5 py-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Questions</label>
                    <input
                      type="number"
                      value={uploadQuestionsCount}
                      onChange={(e) => setUploadQuestionsCount(Number(e.target.value))}
                      className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-2.5 py-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Apples 🍏</label>
                    <input
                      type="number"
                      value={uploadAppleReward}
                      onChange={(e) => setUploadAppleReward(Number(e.target.value))}
                      className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-2.5 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase flex items-center justify-between">
                    <span>Google Form Link *</span>
                    <span className="text-[10px] text-[#00F0FF] font-semibold lowercase">Required</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Paste Google Form URL or <iframe> embed code..."
                    value={uploadGoogleFormUrl}
                    onChange={(e) => setUploadGoogleFormUrl(e.target.value)}
                    className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3 py-2 text-white font-mono text-[10px]"
                  />
                  <p className="text-[9px] text-gray-400 leading-tight">
                    <span className="text-amber-400 font-semibold">Note:</span> Form must be shared as "Anyone with link can respond".
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-2.5 mt-1 bg-gradient-to-r from-[#00C4CC] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] text-black font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Publish Timed Test 🚀</span>
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
