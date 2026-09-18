import React, { useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useModalLock } from '../../hooks/useModalLock';

export const CommentsModal: React.FC = () => {
  const { activeCommentsItem, setActiveCommentsItem, addCommentToContent, openPublicProfile } = useApp();
  const [commentText, setCommentText] = useState('');
  useModalLock(!!activeCommentsItem);

  if (!activeCommentsItem) return null;

  const comments = activeCommentsItem.comments || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentToContent(activeCommentsItem.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveCommentsItem(null);
      }}
      className="modal-backdrop"
    >
      <div className="modal-panel modal-panel-lg" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00F0FF]" />
              <span>Discussion ({comments.length})</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{activeCommentsItem.title}</p>
          </div>
          <button
            onClick={() => setActiveCommentsItem(null)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comments List */}
        <div className="modal-body scroll-contain space-y-3.5">
          {comments.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs space-y-2">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center text-cyan-400 text-xl">
                💬
              </div>
              <p>No comments yet. Be the first student or teacher to join the discussion!</p>
            </div>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-[#040716] border border-[rgba(0,240,255,0.08)] rounded-2xl text-left space-y-1.5 hover:border-[rgba(0,240,255,0.2)] transition-all"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() =>
                      openPublicProfile({
                        name: c.authorName,
                        photoUrl: c.authorAvatar,
                        gender: c.gender as any,
                      })
                    }
                    className="flex items-center space-x-2 text-left group"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#8B5CF6] flex items-center justify-center text-[10px] font-bold text-white border border-[#00F0FF]">
                      {c.authorName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-[#00F0FF] transition-colors block">
                        {c.authorName}
                      </span>
                      <span className="text-[9px] text-[#00F0FF] block">{c.authorGradeOrDesignation}</span>
                    </div>
                  </button>

                  <span className="text-[10px] text-gray-500">{c.createdAt}</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed pl-9">{c.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment to this learning material..."
            className="flex-1 bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl px-4 py-2.5 text-white placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="px-4 py-2.5 bg-[#00F0FF] hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <span>Post</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
