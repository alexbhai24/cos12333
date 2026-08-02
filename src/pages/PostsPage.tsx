import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  ThumbsUp,
  Share2,
  Bookmark,
  Plus,
  Sparkles,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Post } from '../types';

export const PostsPage: React.FC = () => {
  const {
    posts,
    addPost,
    toggleLikePost,
    addCommentToPost,
    savedItemIds,
    toggleSaveItem,
    showNotification,
    openPublicProfile,
    user,
    deletePost
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showComposer, setShowComposer] = useState(false);

  // Composer Form
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'Announcement' | 'Study Tip' | 'Question' | 'Project'>('Study Tip');
  const [postTags, setPostTags] = useState('');

  // Active post for commenting
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const categories = ['All', 'Announcement', 'Study Tip', 'Question', 'Project'];

  const filteredPosts = posts.filter((p) => {
    const matchCat = activeFilter === 'All' || p.category === activeFilter;
    const matchSearch =
      !search ||
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.content || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.authorName || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      showNotification('Please fill in title and post content');
      return;
    }

    const tags = postTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addPost(postTitle, postContent, postCategory, tags);
    setPostTitle('');
    setPostContent('');
    setPostTags('');
    setShowComposer(false);
  };

  const handleSharePost = (p: Post) => {
    const shareUrl = `${window.location.origin}/#posts?id=${p.id}`;
    navigator.clipboard.writeText(shareUrl);
    showNotification('Post link copied to clipboard! 📋');
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addCommentToPost(postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#06101F] via-[#09182D] to-[#0A1428] p-6 rounded-3xl border border-[rgba(0,240,255,0.2)] shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Public Academic Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Academic Community Posts
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Share study tips, ask questions, announce breakthroughs, and connect with students & educators across all grade levels.
          </p>
        </div>

        <button
          onClick={() => setShowComposer(!showComposer)}
          className="px-5 py-3 bg-[#00F0FF] hover:bg-cyan-400 text-black font-bold text-xs rounded-2xl flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Composer Modal / Drawer */}
      {showComposer && (
        <form
          onSubmit={handleCreatePost}
          className="bg-[#090C22]/95 border border-[rgba(0,240,255,0.25)] rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200"
        >
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00F0FF]" />
            <span>Compose Academic Post</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Post Title (e.g. Mastered Lenz Law in Physics today!)"
                className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value as any)}
                className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-4 py-2.5 text-white"
              >
                <option value="Study Tip">Study Tip</option>
                <option value="Question">Question</option>
                <option value="Announcement">Announcement</option>
                <option value="Project">Project</option>
              </select>
            </div>
          </div>

          <textarea
            required
            rows={3}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write your study insights, formula explanations, or academic questions..."
            className="w-full bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-4 py-3 text-white placeholder-gray-500"
          />

          <div className="flex items-center justify-between gap-4 pt-2">
            <input
              type="text"
              value={postTags}
              onChange={(e) => setPostTags(e.target.value)}
              placeholder="Tags (comma separated)..."
              className="flex-1 bg-[#040612] border border-white/10 text-xs rounded-xl px-3 py-2 text-white"
            />

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#00F0FF] text-black font-bold text-xs rounded-xl shadow-md"
              >
                Publish Post
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feed & authors..."
            className="w-full bg-[#090C22] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500"
          />
        </div>

        <div className="flex overflow-x-auto gap-1 bg-[#040716] p-1 rounded-xl border border-white/5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === cat
                  ? 'bg-[#00F0FF] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center bg-[#090C22]/50 border border-white/5 rounded-3xl space-y-3">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center text-cyan-400 text-2xl">
              📢
            </div>
            <h3 className="text-base font-bold text-white">No posts match filter</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No academic posts found. Be the first to share an update or question!
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isSaved = savedItemIds.includes(post.id);
            const isCommentsOpen = activeCommentPostId === post.id;

            return (
              <div
                key={post.id}
                className="bg-[#090C22]/90 border border-[rgba(0,240,255,0.15)] hover:border-[rgba(0,240,255,0.35)] rounded-3xl p-6 shadow-xl transition-all space-y-4"
              >
                {/* Author Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Author Avatar Clickable -> Opens Public Profile */}
                    <button
                      onClick={() =>
                        openPublicProfile({
                          name: post.authorName,
                          photoUrl: post.authorAvatar,
                        })
                      }
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white border border-[#00F0FF] hover:scale-105 transition-transform"
                    >
                      {post.authorName.substring(0, 2).toUpperCase()}
                    </button>

                    <div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            openPublicProfile({
                              name: post.authorName,
                              photoUrl: post.authorAvatar,
                            })
                          }
                          className="text-sm font-bold text-white hover:text-[#00F0FF] transition-colors"
                        >
                          {post.authorName}
                        </button>
                        <span className="px-2 py-0.5 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-[9px] font-bold rounded-full">
                          {post.authorRole || 'Academic Voyager'}
                        </span>
                      </div>

                      <div className="text-[10px] text-gray-500 mt-0.5">{post.timeAgo || 'Recently'}</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold rounded-full uppercase">
                    {post.category || 'General'}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  {post.title && <h3 className="text-base font-bold text-white">{post.title}</h3>}
                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-[#040716] border border-white/5 text-gray-400 text-[10px] rounded-lg"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center space-x-2">
                    {/* Like Button */}
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                        post.userLiked
                          ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF] font-bold'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.likes || 0}</span>
                    </button>

                    {/* Comments Toggle Button */}
                    <button
                      onClick={() => setActiveCommentPostId(isCommentsOpen ? null : post.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{post.commentsCount || (post.commentsList || []).length || 0} Comments</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Save */}
                    <button
                      onClick={() => toggleSaveItem(post.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                      }`}
                      title={isSaved ? 'Saved in library' : 'Save post'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => handleSharePost(post)}
                      className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors"
                      title="Share post"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete (if author) */}
                    {post.authorName === user.name && (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 rounded-xl border border-white/10 bg-white/5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        title="Delete your post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Comments Section */}
                {isCommentsOpen && (
                  <div className="pt-4 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(post.commentsList || []).length === 0 ? (
                        <div className="text-[11px] text-gray-500 text-center py-2">No comments yet.</div>
                      ) : (
                        (post.commentsList || []).map((c) => (
                          <div key={c.id} className="p-2.5 bg-[#040716] border border-white/5 rounded-xl text-left space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-cyan-400">{c.authorName || c.author}</span>
                              <span className="text-gray-500 text-[9px]">{c.timeAgo}</span>
                            </div>
                            <p className="text-xs text-gray-300">{c.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Add a comment to this post..."
                        className="flex-1 bg-[#040612] border border-white/10 focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-3 py-2 text-white"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3.5 py-2 bg-[#00F0FF] text-black font-bold text-xs rounded-xl"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
