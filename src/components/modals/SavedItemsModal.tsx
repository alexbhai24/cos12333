import React, { useState, useEffect } from 'react';
import {
  X,
  Bookmark,
  Video,
  FileText,
  BookOpen,
  Award,
  MessageSquare,
  Trash2,
  Search,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useModalLock } from '../../hooks/useModalLock';
import { videoService, type VideoDoc } from '../../services/videoService';
import { savedVideoService, type SavedVideoDoc } from '../../services/savedVideoService';

interface SavedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterTab = 'all' | 'video' | 'document' | 'book' | 'test' | 'post';

export const SavedItemsModal: React.FC<SavedItemsModalProps> = ({ isOpen, onClose }) => {
  useModalLock(isOpen);

  const {
    savedItemIds,
    contentItems,
    posts,
    toggleSaveItem,
    setActiveVideoModal,
    setActiveDocModal,
    setActiveBookModal,
    setActiveTestModal,
    setActiveCommentsItem
  } = useApp();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allVideos, setAllVideos] = useState<VideoDoc[]>([]);
  const [savedVideoDocs, setSavedVideoDocs] = useState<SavedVideoDoc[]>([]);

  // Subscribe to real-time videos and saved video docs when open
  useEffect(() => {
    if (!isOpen) return;

    const unsubVideos = videoService.subscribeAllVideos((vList) => {
      setAllVideos(vList);
    });

    let unsubSaved: (() => void) | null = null;
    if (currentUser?.uid) {
      unsubSaved = savedVideoService.subscribeSavedVideos(currentUser.uid, (saved) => {
        setSavedVideoDocs(saved);
      });
    }

    return () => {
      unsubVideos();
      if (unsubSaved) unsubSaved();
    };
  }, [isOpen, currentUser?.uid]);

  if (!isOpen) return null;

  // Build list of saved videos
  const savedVideosList: VideoDoc[] = allVideos.filter(
    (v) => savedItemIds.includes(v.id) || savedVideoDocs.some((s) => s.videoId === v.id)
  );

  // Include any saved video doc from Firestore that wasn't already in allVideos
  savedVideoDocs.forEach((sv) => {
    if (!savedVideosList.some((v) => v.id === sv.videoId)) {
      savedVideosList.push({
        id: sv.videoId,
        title: sv.title,
        youtubeVideoId: '',
        embedUrl: sv.embedUrl,
        thumbnailUrl: sv.thumbnailUrl || '',
        uploadedByUid: '',
        uploadedByName: sv.authorName || 'Teacher',
        uploadedByEmail: '',
        uploadedByRole: sv.authorRole || 'Teacher',
        createdAt: typeof sv.savedAt === 'string' ? sv.savedAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'published',
        subject: sv.subject || 'Physics',
        targetGrades: [],
      });
    }
  });

  // Gather saved content items (documents, books, tests) and posts
  const savedContent = contentItems.filter((item) => savedItemIds.includes(item.id));
  const savedPosts = posts.filter((post) => savedItemIds.includes(post.id));

  // Merge all saved resources into a single list
  const allSavedItems = [
    ...savedVideosList.map((v) => ({
      id: v.id,
      title: v.title,
      description: `Subject: ${v.subject || 'General'} • Published by ${v.uploadedByName || 'Teacher'}`,
      type: 'video',
      subject: v.subject || 'General',
      authorName: v.uploadedByName || 'Teacher',
      thumbnail: v.thumbnailUrl,
      rawItem: {
        id: v.id,
        title: v.title,
        description: '',
        subject: v.subject || 'Physics',
        targetGrades: v.targetGrades || [],
        contentType: 'video',
        authorName: v.uploadedByName || 'Teacher',
        authorRole: v.uploadedByRole || 'Teacher',
        authorAvatar: 'gradient:solar',
        createdAt: v.createdAt,
        thumbnail: v.thumbnailUrl,
        videoUrl: v.embedUrl || v.youtubeVideoId,
        views: 0,
        status: 'published',
        attachments: [],
        comments: [],
      },
    })),
    ...savedContent.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      type: item.contentType as string,
      subject: item.subject || 'General',
      authorName: item.authorName || 'Teacher',
      thumbnail: item.thumbnail,
      rawItem: item,
    })),
    ...savedPosts.map((post) => ({
      id: post.id,
      title: post.title || post.content.substring(0, 60) + '...',
      description: post.content,
      type: 'post',
      subject: post.category || 'General',
      authorName: post.authorName,
      thumbnail: post.mediaUrl,
      rawItem: post,
    })),
  ];

  // Filter items based on selected tab and search query
  const filteredItems = allSavedItems.filter((item) => {
    if (activeTab === 'video' && item.type !== 'video') return false;
    if (activeTab === 'document' && item.type !== 'document') return false;
    if (activeTab === 'book' && item.type !== 'book') return false;
    if (activeTab === 'test' && item.type !== 'test' && item.type !== 'test_series') return false;
    if (activeTab === 'post' && item.type !== 'post') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchSubject;
    }

    return true;
  });

  const getItemBadge = (type: string) => {
    switch (type) {
      case 'video':
        return {
          icon: <Video className="w-3.5 h-3.5" />,
          label: 'Video Lecture',
          style: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        };
      case 'document':
        return {
          icon: <FileText className="w-3.5 h-3.5" />,
          label: 'Document',
          style: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'book':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          label: 'E-Book',
          style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'test_series':
      case 'test':
        return {
          icon: <Award className="w-3.5 h-3.5" />,
          label: 'Test Series',
          style: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        };
      case 'post':
        return {
          icon: <MessageSquare className="w-3.5 h-3.5" />,
          label: 'Discussion',
          style: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
        };
      default:
        return {
          icon: <Bookmark className="w-3.5 h-3.5" />,
          label: 'Resource',
          style: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        };
    }
  };

  const handleOpenItem = (item: any) => {
    onClose();
    if (item.type === 'video') setActiveVideoModal(item.rawItem);
    else if (item.type === 'document') setActiveDocModal(item.rawItem);
    else if (item.type === 'book') setActiveBookModal(item.rawItem);
    else if (item.type === 'test' || item.type === 'test_series') setActiveTestModal(item.rawItem);
    else if (item.type === 'post') setActiveCommentsItem(item.rawItem);
  };

  const handleRemoveSavedItem = async (itemId: string, type: string) => {
    if (type === 'video' && currentUser?.uid) {
      await savedVideoService.unsaveVideo(currentUser.uid, itemId).catch(console.error);
    }
    toggleSaveItem(itemId);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Center Screen Full Panel */}
      <div className="relative w-[95vw] max-w-5xl h-[85vh] bg-[#090C22]/98 border border-[rgba(0,240,255,0.25)] rounded-3xl shadow-[0_25px_60px_rgba(0,240,255,0.25)] p-5 sm:p-7 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Academic Repository</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 font-heading">
              <Bookmark className="w-6 h-6 text-[#00F0FF]" />
              <span>Saved Learning Library</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-normal">
                {allSavedItems.length} items
              </span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-auto p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
            title="Close Library"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search + Category Tabs */}
        <div className="pt-4 pb-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-white/5">
          {/* Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            {(
              [
                { id: 'all', label: 'All Items' },
                { id: 'video', label: 'Videos' },
                { id: 'document', label: 'Documents' },
                { id: 'book', label: 'Books' },
                { id: 'test', label: 'Tests' },
                { id: 'post', label: 'Discussions' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#00F0FF] text-black shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved items..."
              className="w-full bg-[#040612] border border-white/15 focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl pl-9 pr-3.5 py-2 text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Content Body: Responsive Grid */}
        <div className="flex-1 overflow-y-auto py-5 pr-1 scrollbar-none">
          {filteredItems.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-xs space-y-3 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center text-cyan-400 text-2xl shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                🔖
              </div>
              <h4 className="text-base font-bold text-white">No Saved Items Found</h4>
              <p className="text-gray-400 leading-relaxed">
                {searchQuery
                  ? `No items match "${searchQuery}" in this category.`
                  : 'Click the "Save" or "Bookmark" button on any video, document, book, test, or discussion post to add it to your library!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const badge = getItemBadge(item.type);

                return (
                  <div
                    key={item.id}
                    className="group bg-[#040716] border border-[rgba(0,240,255,0.12)] hover:border-[rgba(0,240,255,0.35)] rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)]"
                  >
                    {/* Header Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${badge.style}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRemoveSavedItem(item.id, item.type)}
                            className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                            title="Remove from saved items"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3
                        onClick={() => handleOpenItem(item)}
                        className="text-sm font-bold text-white hover:text-[#00F0FF] cursor-pointer transition-colors line-clamp-1"
                        title={item.title}
                      >
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Footer Info & Action */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-300">{item.subject}</span>
                        <span>•</span>
                        <span className="text-gray-500">{item.authorName}</span>
                      </div>

                      <button
                        onClick={() => handleOpenItem(item)}
                        className="px-3 py-1.5 rounded-xl bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] font-bold text-xs flex items-center gap-1 transition-all group-hover:shadow-md"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
