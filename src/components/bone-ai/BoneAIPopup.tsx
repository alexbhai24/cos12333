import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, MessageSquare, MoreVertical, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { chatHistoryStore } from '../../services/chatHistoryStore';
import type { ChatSession, ChatMessage } from '../../services/chatHistoryStore';
import { BoneAIChat } from './BoneAIChat';

interface BoneAIPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BoneAIPopup: React.FC<BoneAIPopupProps> = ({ isOpen, onClose }) => {
  const { currentRoute, user } = useApp();
  const [view, setView] = useState<'chat' | 'history'>('chat');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  useEffect(() => {
    if (view === 'history' && user?.email) {
      chatHistoryStore.getChatsForUser(user.email).then(setSessions);
    }
  }, [view, user?.email]);

  useEffect(() => {
    if (messages.length > 0 && user?.email) {
      const sessionId = activeSessionId || `session_${Date.now()}`;
      if (!activeSessionId) setActiveSessionId(sessionId);
      const firstUserMsg = messages.find(m => m.role === 'user')?.content || 'New Conversation';
      const sessionTitle = firstUserMsg.length > 25 ? firstUserMsg.substring(0, 25) + '...' : firstUserMsg;
      chatHistoryStore.saveChat({
        id: sessionId,
        userId: user.email,
        title: sessionTitle,
        createdAt: parseInt(sessionId.split('_')[1]) || Date.now(),
        updatedAt: Date.now(),
        messages
      });
    }
  }, [messages, activeSessionId, user?.email]);

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setView('chat');
    setIsMenuOpen(false);
  };

  const handleOpenSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setView('chat');
  };

  const confirmDeleteSession = async (sessionId: string) => {
    await chatHistoryStore.deleteChat(sessionId);
    if (activeSessionId === sessionId) handleNewChat();
    setDeleteConfirmId(null);
    if (user?.email) {
      const updated = await chatHistoryStore.getChatsForUser(user.email);
      setSessions(updated);
    }
  };

  const handleClearHistory = () => {
    setIsMenuOpen(false);
    setClearConfirmOpen(true);
  };

  const confirmClearHistory = async () => {
    setClearConfirmOpen(false);
    if (user?.email) {
      await chatHistoryStore.clearAllHistory(user.email);
      setSessions([]);
      handleNewChat();
    }
  };

  const handleAddMessage = (msg: ChatMessage) => setMessages(prev => [...prev, msg]);
  const handleUpdateMessage = (id: string, updates: Partial<ChatMessage>) =>
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <div
            className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ zIndex: 9995 }}
            className={[
              'fixed flex flex-col no-theme-override',
              'bg-[#12151e]/97 backdrop-blur-2xl',
              'border border-white/[0.08]',
              'rounded-[28px]',
              'shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)]',
              'overflow-hidden',
              'left-3 right-3 bottom-3 top-3',
              'md:left-auto md:top-auto md:right-5 md:bottom-5',
              'md:w-[410px] md:h-[calc(100vh-40px)] md:max-h-[700px]',
            ].join(' ')}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
              {/* Avatar + Name */}
              <div className="flex items-center space-x-2.5">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-500/20 to-violet-600/20 flex items-center justify-center shrink-0">
                  <img
                    src="/bone-ai-avatar.png"
                    alt="Bone AI"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  {/* Fallback inner icon */}
                  <svg className="w-4 h-4 text-cyan-400 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[13px] font-semibold text-white tracking-tight">Bone AI</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-0.5 relative">
                <button
                  onClick={() => setView(view === 'chat' ? 'history' : 'chat')}
                  className={`p-2 rounded-xl transition-all ${view === 'history' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'}`}
                  title="Chat History"
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNewChat}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-all"
                  title="New Chat"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-all"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-all"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 4 }}
                        transition={{ duration: 0.13 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-[#1c2030] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-20"
                      >
                        <button
                          onClick={handleClearHistory}
                          className="w-full text-left px-4 py-3 text-xs text-red-400 hover:bg-white/5 flex items-center space-x-2.5 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Clear all history</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-hidden relative">
              {view === 'chat' ? (
                <BoneAIChat
                  messages={messages}
                  onAddMessage={handleAddMessage}
                  onUpdateMessage={handleUpdateMessage}
                  currentRoute={currentRoute}
                />
              ) : (
                <div className="h-full overflow-y-auto p-5 scrollbar-premium">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white text-sm font-bold tracking-wide">Chat History</h3>
                    <button
                      onClick={handleNewChat}
                      className="text-xs text-[#00F0FF] hover:underline font-medium"
                    >
                      + New Chat
                    </button>
                  </div>
                  {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                        <History className="w-5 h-5" />
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed max-w-[200px]">No previous conversations yet. Start chatting!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sessions.map(session => {
                        const isConfirming = deleteConfirmId === session.id;
                        return (
                          <div
                            key={session.id}
                            onClick={() => !isConfirming && handleOpenSession(session)}
                            className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group relative ${
                              isConfirming
                                ? 'border-red-500/30 bg-red-500/5'
                                : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/10'
                            }`}
                          >
                            {isConfirming ? (
                              <div className="flex-1 flex items-center justify-between">
                                <span className="text-xs font-semibold text-red-400">Delete conversation?</span>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); confirmDeleteSession(session.id); }}
                                    className="px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg transition-colors"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                                    className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex-1 min-w-0 pr-3">
                                  <h4 className="text-[13px] font-medium text-gray-200 truncate">{session.title}</h4>
                                  <p className="text-[11px] text-gray-500 mt-0.5">
                                    {new Date(session.updatedAt).toLocaleDateString()} · {session.messages.length} messages
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(session.id); }}
                                  className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Clear History Confirm Overlay */}
              <AnimatePresence>
                {clearConfirmOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0a0c14]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.92, y: 12 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.92, y: 12 }}
                      transition={{ duration: 0.18 }}
                      className="bg-[#1c2030] border border-red-500/20 rounded-3xl p-6 max-w-xs shadow-2xl space-y-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mx-auto">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-white font-bold text-sm">Clear all history?</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          This will permanently delete all conversations. This cannot be undone.
                        </p>
                      </div>
                      <div className="flex space-x-2 pt-1">
                        <button
                          onClick={confirmClearHistory}
                          className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          Clear All
                        </button>
                        <button
                          onClick={() => setClearConfirmOpen(false)}
                          className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl border border-white/5 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
