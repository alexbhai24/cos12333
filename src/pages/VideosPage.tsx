import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Bookmark,
  Share2,
  MessageSquare,
  Paperclip,
  Play,
  ArrowUpDown,
  GraduationCap,
  Plus,
  X,
  Loader2,
  Video,
  Trash2,
  User,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import { getGradeLabel, getSubjectsForGrade } from '../utils/gradeUtils';
import { videoService, extractYoutubeId, type VideoDoc } from '../services/videoService';
import { savedVideoService, type SavedVideoDoc } from '../services/savedVideoService';
import type { ContentItem } from '../types';
import { useModalLock } from '../hooks/useModalLock';

export const VideosPage: React.FC = () => {
  const {
    selectedGrade,
    savedItemIds,
    toggleSaveItem,
    setActiveVideoModal,
    setActiveCommentsItem,
    showNotification,
    openPublicProfile
  } = useApp();

  const { userRole, userProfile, currentUser } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'saved'>('all');
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  // Firestore videos reactive state
  const [dbVideos, setDbVideos] = useState<VideoDoc[]>([]);
  const [savedVideoDocs, setSavedVideoDocs] = useState<SavedVideoDoc[]>([]);
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>([]);

  // Video Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  useModalLock(isUploadOpen);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadSubject, setUploadSubject] = useState(() => getSubjectsForGrade(selectedGrade || 'pcb')[0] || 'Phy');
  const [uploadGrade, setUploadGrade] = useState(selectedGrade || 'pcb');
  const [uploadThumbnail, setUploadThumbnail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Determine admin/teacher access
  const isOwnerAdmin =
    userProfile?.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com' ||
    currentUser?.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com';
  const canUpload = isOwnerAdmin || userRole === 'admin' || userRole === 'teacher';

  // Subscribe to Firestore saved videos for current user
  useEffect(() => {
    const uid = userProfile?.uid || currentUser?.uid;
    if (!uid) return;
    const unsubscribe = savedVideoService.subscribeSavedVideos(uid, (saved) => {
      setSavedVideoDocs(saved);
      setSavedVideoIds(saved.map((s) => s.videoId));
    });
    return unsubscribe;
  }, [userProfile?.uid, currentUser?.uid]);

  // Subscribe to Firestore published videos for active grade
  useEffect(() => {
    const unsubscribe = videoService.subscribeVideosByGrade(selectedGrade || 'pcb', (videos) => {
      setDbVideos(videos);
    });
    return unsubscribe;
  }, [selectedGrade]);

  // Sync selectedGrade with grade selector on mount/change
  useEffect(() => {
    if (selectedGrade) {
      setUploadGrade(selectedGrade);
    }
  }, [selectedGrade]);

  // Map dbVideos to ContentItem structure
  const mappedDbVideos: ContentItem[] = dbVideos.map((dv) => ({
    id: dv.id,
    title: dv.title,
    description: `Published by ${dv.uploadedByName} (${dv.uploadedByRole})`,
    subject: dv.subject,
    targetGrades: dv.targetGrades,
    contentType: 'video',
    authorName: dv.uploadedByName,
    authorRole: dv.uploadedByRole === 'admin' ? 'Admin Owner 👑' : 'Teacher 🏫',
    authorAvatar: dv.uploadedByRole === 'admin' ? 'gradient:cyberpunk' : 'gradient:solar',
    createdAt: dv.createdAt,
    thumbnail: dv.thumbnailUrl,
    videoUrl: dv.embedUrl,
    duration: '45 mins',
    views: 0,
    status: 'published',
    comments: [],
    attachments: [],
  }));

  // Combine Firestore videos + initial mock videos (removing duplicates based on YouTube ID)
  const mockVideos = contentService.getContentByGrade(selectedGrade, 'video');
  const combinedVideos: ContentItem[] = [...mappedDbVideos];

  mockVideos.forEach((mv) => {
    const mvYtId = extractYoutubeId(mv.videoUrl || '') || mv.id;
    const exists = combinedVideos.some((v) => {
      const vYtId = extractYoutubeId(v.videoUrl || '') || v.id;
      return vYtId === mvYtId || v.id === mv.id;
    });
    if (!exists) {
      combinedVideos.push(mv);
    }
  });

  const filteredVideos = combinedVideos.filter((v) => {
    const matchSubject = selectedSubject === 'All' || v.subject === selectedSubject;
    const matchSearch =
      !search ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()) ||
      v.subject.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  // Sorting
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'popular') {
      return (Number(b.views) || 0) - (Number(a.views) || 0);
    }
    return 0;
  });

  // Saved videos filtering
  const filteredSavedVideos = savedVideoDocs.filter(
    (v) =>
      !search ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.authorName.toLowerCase().includes(search.toLowerCase()) ||
      v.subject.toLowerCase().includes(search.toLowerCase())
  );

  const subjects = ['All', ...getSubjectsForGrade(selectedGrade)];

  // Auto-reset subject filter if it's not valid for the newly selected grade
  useEffect(() => {
    if (selectedSubject !== 'All' && !getSubjectsForGrade(selectedGrade).includes(selectedSubject)) {
      setSelectedSubject('All');
    }
  }, [selectedGrade, selectedSubject]);
  const grades = [
    { id: 'class_6', label: 'Class 6' },
    { id: 'class_7', label: 'Class 7' },
    { id: 'class_8', label: 'Class 8' },
    { id: 'class_9', label: 'Class 9' },
    { id: 'class_10', label: 'Class 10' },
    { id: 'pcb', label: 'PCB (Senior Secondary)' },
    { id: 'pcm', label: 'PCM (Senior Secondary)' },
    { id: 'skill', label: 'Skill Development' },

    { id: 'dropper', label: 'Business Batch' },
  ];

  const handleShare = (v: any) => {
    const shareUrl = `${window.location.origin}/#videos?id=${v.id || v.videoId}`;
    navigator.clipboard.writeText(shareUrl);
    showNotification('Video link copied to clipboard! 📋');
  };

  const handleToggleSaveVideo = async (video: ContentItem) => {
    const uid = userProfile?.uid || currentUser?.uid;
    if (!uid) {
      showNotification('Please sign in to save videos.');
      return;
    }

    const isAlreadySaved = savedVideoIds.includes(video.id) || savedItemIds.includes(video.id);

    try {
      if (isAlreadySaved) {
        await savedVideoService.unsaveVideo(uid, video.id);
        toggleSaveItem(video.id);
        showNotification(`Removed "${video.title}" from saved videos.`);
      } else {
        await savedVideoService.saveVideo(uid, {
          id: video.id,
          title: video.title,
          thumbnailUrl: video.thumbnail,
          embedUrl: video.videoUrl,
          authorName: video.authorName,
          authorRole: video.authorRole,
          subject: video.subject,
          description: video.description,
        });
        toggleSaveItem(video.id);
        showNotification(`Saved "${video.title}" to your history! 🔖`);
      }
    } catch (err: any) {
      showNotification(`Failed to update saved video: ${err.message}`);
    }
  };

  const handleRemoveSavedDoc = async (videoId: string, title: string) => {
    const uid = userProfile?.uid || currentUser?.uid;
    if (!uid) return;
    try {
      await savedVideoService.unsaveVideo(uid, videoId);
      showNotification(`Removed "${title}" from saved videos.`);
    } catch (err: any) {
      showNotification(`Failed to remove saved video: ${err.message}`);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    if (!uploadTitle.trim() || !uploadUrl.trim()) {
      setUploadError('Title and YouTube URL are required.');
      return;
    }

    if (uploadTitle.length > 30) {
      setUploadError('Title cannot exceed 30 characters.');
      return;
    }

    const activeUser = userProfile || (currentUser ? {
      uid: currentUser.uid,
      email: currentUser.email || 'rajanandalex1@gmail.com',
      displayName: currentUser.displayName || 'Owner Admin',
      photoURL: currentUser.photoURL || '',
      role: 'admin' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } : null);

    if (!activeUser) {
      setUploadError('You must be signed in to upload videos.');
      return;
    }

    setUploading(true);
    try {
      await videoService.uploadVideo(
        {
          title: uploadTitle,
          urlOrEmbed: uploadUrl,
          customThumbnailUrl: uploadThumbnail,
          subject: uploadSubject,
          targetGrade: uploadGrade,
        },
        activeUser,
        isOwnerAdmin ? 'admin' : (userRole || 'student')
      );
      showNotification('Video lecture published successfully! 🚀');
      setIsUploadOpen(false);
      // Reset form
      setUploadTitle('');
      setUploadUrl('');
      setUploadThumbnail('');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload video.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#06101F] via-[#09182D] to-[#0A1428] p-6 rounded-3xl border border-[rgba(0,240,255,0.2)] shadow-2xl relative overflow-hidden">
        <div className="z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Showing {getGradeLabel(selectedGrade)} Content</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Video Lectures & 3D Walkthroughs
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Curated HD video lessons for {getGradeLabel(selectedGrade)}. Watch animations, save notes, and keep your history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 self-start md:self-center">
          {canUpload && (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-black font-extrabold text-xs bg-gradient-to-r from-[#00F0FF] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4 text-black stroke-[3]" />
              <span>Upload Video</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs: All Lectures vs Saved History */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'all'
              ? 'bg-[#00F0FF] text-black shadow-lg shadow-cyan-500/20'
              : 'bg-[#090C22] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>All Video Lectures</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeSubTab === 'all' ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-300'}`}>
            {combinedVideos.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'saved'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
              : 'bg-[#090C22] text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <Bookmark className="w-4 h-4 fill-current" />
          <span>Saved Videos (History)</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeSubTab === 'saved' ? 'bg-black/20 text-black' : 'bg-amber-500/20 text-amber-300'}`}>
            {savedVideoDocs.length}
          </span>
        </button>
      </div>

      {/* View 1: All Video Lectures */}
      {activeSubTab === 'all' && (
        <>
          {/* Filters & Sorting */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search videos & subjects..."
                className="w-full bg-[#090C22] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500"
              />
            </div>

            {/* Subject Filter & Sort */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Subject Pills */}
              <div className="flex overflow-x-auto gap-1 bg-[#040716] p-1 rounded-xl border border-white/5">
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

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-1 bg-[#090C22] border border-white/10 px-3 py-2 rounded-xl text-xs text-gray-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          {sortedVideos.length === 0 ? (
            <div className="py-20 text-center bg-[#090C22]/50 border border-white/5 rounded-3xl space-y-3">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center text-cyan-400 text-2xl">
                🎥
              </div>
              <h3 className="text-base font-bold text-white">No {getGradeLabel(selectedGrade)} videos found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No videos matching "{search}" are available yet for {getGradeLabel(selectedGrade)}. Teachers will upload new lectures soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedVideos.map((video) => {
                const isSaved = savedVideoIds.includes(video.id) || savedItemIds.includes(video.id);

                return (
                  <div
                    key={video.id}
                    className="bg-[#090C22]/90 border border-[rgba(0,240,255,0.15)] hover:border-[#00F0FF] rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all flex flex-col justify-between group"
                  >
                    {/* Thumbnail Header */}
                    <div
                      className="relative h-48 overflow-hidden bg-black cursor-pointer"
                      onClick={() => setActiveVideoModal(video)}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090C22] via-transparent to-black/40" />



                      {/* Grade & Subject Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 bg-[#00F0FF] text-black font-extrabold text-[10px] rounded-full uppercase shadow">
                          {getGradeLabel(selectedGrade)}
                        </span>
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold text-[10px] rounded-full">
                          {video.subject}
                        </span>
                      </div>


                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3
                          onClick={() => setActiveVideoModal(video)}
                          className="text-base font-bold text-white line-clamp-2 hover:text-[#00F0FF] cursor-pointer transition-colors"
                        >
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                          {video.description || 'Watch structured video lectures and academic notes curated for exam targets.'}
                        </p>
                      </div>

                      {/* Author & Stats */}
                      <div className="space-y-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs">
                          <button
                            onClick={() =>
                              openPublicProfile({
                                name: video.authorName,
                                photoUrl: video.authorAvatar || 'gradient:solar',
                              })
                            }
                            className="flex items-center space-x-2 text-left group/author"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#8B5CF6] flex items-center justify-center text-[9px] font-bold text-white border border-[#00F0FF]">
                              {video.authorName.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-xs text-gray-300 group-hover/author:text-[#00F0FF] font-semibold truncate max-w-[140px]">
                              {video.authorName}
                            </span>
                          </button>

                          <span className="text-[10px] text-gray-500">{(video.views || 0).toLocaleString()} views</span>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => setActiveVideoModal(video)}
                            className="px-3.5 py-1.5 bg-[#00F0FF] hover:bg-cyan-400 text-black font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Watch Lecture</span>
                          </button>

                          <div className="flex items-center space-x-1">
                            {/* Save Button */}
                            <button
                              onClick={() => handleToggleSaveVideo(video)}
                              className={`p-2 rounded-xl border transition-colors ${
                                isSaved
                                  ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                                  : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                              }`}
                              title={isSaved ? 'Saved in history' : 'Save video'}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>

                            {/* Share Button */}
                            <button
                              onClick={() => handleShare(video)}
                              className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors"
                              title="Share link"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Comments Drawer Button */}
                            <button
                              onClick={() => setActiveCommentsItem(video)}
                              className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                              title="View comments"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="text-[10px] font-bold">{(video.comments || []).length}</span>
                            </button>
                          </div>
                        </div>

                        {/* Resource Attachment Links */}
                        {video.attachments && video.attachments.length > 0 && (
                          <div className="pt-2 flex items-center space-x-1 text-[10px] text-cyan-400">
                            <Paperclip className="w-3 h-3" />
                            <span className="truncate">{video.attachments.length} Resource Attachments Available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* View 2: Saved Videos (History) */}
      {activeSubTab === 'saved' && (
        <>
          {/* Search Bar for Saved History */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search saved history by title or author..."
                className="w-full bg-[#090C22] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Saved Video Grid */}
          {filteredSavedVideos.length === 0 ? (
            <div className="py-20 text-center bg-[#090C22]/50 border border-white/5 rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400 text-2xl">
                🔖
              </div>
              <h3 className="text-base font-bold text-white">No Saved Videos in History</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                {search
                  ? `No saved videos match "${search}". Try searching for another topic.`
                  : 'You haven’t bookmarked any video lectures yet. Click the bookmark icon on any video card to save it here!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSavedVideos.map((video) => {
                const formattedSavedDate = video.savedAt
                  ? new Date(video.savedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recently';

                return (
                  <div
                    key={video.videoId}
                    className="bg-[#090C22]/90 border border-[rgba(0,240,255,0.15)] hover:border-[#00F0FF] rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all flex flex-col justify-between group"
                  >
                    {/* Thumbnail Header */}
                    <div
                      className="relative h-48 overflow-hidden bg-black cursor-pointer"
                      onClick={() =>
                        setActiveVideoModal({
                          id: video.videoId,
                          title: video.title,
                          description: video.description,
                          subject: video.subject,
                          targetGrades: [],
                          contentType: 'video',
                          authorName: video.authorName,
                          authorRole: video.authorRole,
                          authorAvatar: 'gradient:solar',
                          createdAt: video.savedAt,
                          thumbnail: video.thumbnailUrl,
                          videoUrl: video.embedUrl,
                          status: 'published',
                        })
                      }
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090C22] via-transparent to-black/40" />



                      {/* Subject Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold text-[10px] rounded-full">
                          {video.subject}
                        </span>
                      </div>

                      {/* Saved Tag Indicator */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500/90 text-black text-[10px] font-extrabold rounded-full flex items-center space-x-1 shadow">
                        <Bookmark className="w-3 h-3 fill-current" />
                        <span>Saved</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3
                          onClick={() =>
                            setActiveVideoModal({
                              id: video.videoId,
                              title: video.title,
                              description: video.description,
                              subject: video.subject,
                              targetGrades: [],
                              contentType: 'video',
                              authorName: video.authorName,
                              authorRole: video.authorRole,
                              authorAvatar: 'gradient:solar',
                              createdAt: video.savedAt,
                              thumbnail: video.thumbnailUrl,
                              videoUrl: video.embedUrl,
                              status: 'published',
                            })
                          }
                          className="text-base font-bold text-white line-clamp-2 hover:text-[#00F0FF] cursor-pointer transition-colors"
                        >
                          {video.title}
                        </h3>
                      </div>

                      {/* Metadata */}
                      <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs">
                        <div className="flex items-center justify-between text-gray-400">
                          <span className="flex items-center space-x-1.5 truncate">
                            <User className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span className="truncate font-semibold text-gray-300">{video.authorName}</span>
                          </span>

                          <span className="flex items-center space-x-1 text-[10px] text-gray-500 flex-shrink-0">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span>Saved {formattedSavedDate}</span>
                          </span>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() =>
                              setActiveVideoModal({
                                id: video.videoId,
                                title: video.title,
                                description: video.description,
                                subject: video.subject,
                                targetGrades: [],
                                contentType: 'video',
                                authorName: video.authorName,
                                authorRole: video.authorRole,
                                authorAvatar: 'gradient:solar',
                                createdAt: video.savedAt,
                                thumbnail: video.thumbnailUrl,
                                videoUrl: video.embedUrl,
                                status: 'published',
                              })
                            }
                            className="px-3.5 py-1.5 bg-[#00F0FF] hover:bg-cyan-400 text-black font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Watch Lecture</span>
                          </button>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleShare(video)}
                              className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors"
                              title="Share video link"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleRemoveSavedDoc(video.videoId, video.title)}
                              className="p-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Remove from saved history"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Video Upload Modal Form */}
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
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/25 flex items-center justify-center text-[#00F0FF]">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Publish Video Lecture</h3>
                  <p className="text-xs text-gray-400">Enter details to broadcast video content to students.</p>
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
              <div className="p-3.5 bg-red-950/30 border border-red-500/30 rounded-2xl text-red-400 text-xs font-semibold leading-relaxed">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                  <span>Video Title</span>
                  <span className="text-[10px] text-gray-500 font-normal">Max 30 chars ({uploadTitle.length}/30)</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  placeholder="e.g. Master-class on Quantum Mechanics"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 placeholder-gray-600 text-white transition-all"
                />
              </div>

              {/* YouTube Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  YouTube Video / Embed URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=XXXXXX"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 placeholder-gray-600 text-white transition-all"
                />
              </div>

              {/* Subject & Grade selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Subject
                  </label>
                  <select
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value)}
                    className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 text-[#00F0FF] bg-[#090C22] cursor-pointer"
                  >
                    {getSubjectsForGrade(uploadGrade).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Target Stream/Grade
                  </label>
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
                    className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 text-[#00F0FF] bg-[#090C22] cursor-pointer"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Thumbnail */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Custom Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="Leave blank to use default YouTube thumbnail"
                  value={uploadThumbnail}
                  onChange={(e) => setUploadThumbnail(e.target.value)}
                  className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 placeholder-gray-600 text-white transition-all"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3.5 bg-gradient-to-r from-[#00C4CC] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] text-black font-extrabold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Publishing Video Lecture...</span>
                  </>
                ) : (
                  <span>Save and Publish Video Lecture 🚀</span>
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
