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

  // Load history
  useEffect(() => {
    if (view === 'history' && user?.email) {
      chatHistoryStore.getChatsForUser(user.email).then(setSessions);
    }
  }, [view, user?.email]);

  // Save messages to current session
  useEffect(() => {
    if (messages.length > 0 && user?.email) {
      const sessionId = activeSessionId || `session_${Date.now()}`;
      if (!activeSessionId) setActiveSessionId(sessionId);

      // Clean, short title generation
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
    if (activeSessionId === sessionId) {
      handleNewChat();
    }
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

  const handleAddMessage = (msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleUpdateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop overlay */}
          <div
            className="fixed inset-0 z-[9990] bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ zIndex: 9995 }}
            className={[
              'fixed flex flex-col',
              'bg-[#040812]/95 backdrop-blur-xl',
              'border border-[#00F0FF]/30 rounded-3xl',
              'shadow-[0_12px_50px_rgba(0,0,0,0.7)]',
              'overflow-hidden',
              // Mobile: centered full-screen modal
              'left-3 right-3 bottom-3 top-3',
              // Desktop: pinned bottom right, compact width, responsive vertical length
              'md:left-auto md:top-auto md:right-5 md:bottom-5',
              'md:w-[400px] md:h-[calc(100vh-40px)] md:max-h-[680px]',
            ].join(' ')}
          >

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#060a14]/95">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#00F0FF]/40 bg-[#0D213A] flex items-center justify-center p-0.5">
                <img 
                  src="/bone-ai-avatar.png" 
                  alt="Bone AI" 
                  className="w-full h-full object-cover rounded-full" 
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Bone+AI&background=0D213A&color=00F0FF'; }}
                />
              </div>
              <div>
                <h2 className="text-white font-semibold text-xs tracking-wide flex items-center space-x-1.5">
                  <span>Bone AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-0.5 relative">
              <button 
                onClick={() => setView(view === 'chat' ? 'history' : 'chat')} 
                className={`p-1.5 rounded-lg transition-colors ${view === 'history' ? 'bg-[#00F0FF]/15 text-[#00F0FF]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                title="Chat History"
                aria-label="Toggle history"
              >
                <History className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNewChat} 
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors" 
                title="New Chat"
                aria-label="Start new chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              <button 
                onClick={onClose} 
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors" 
                title="Close"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Action Dropdown Menu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-[#0D213A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20"
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

          {/* Dialog View Body */}
          <div className="flex-1 overflow-hidden relative">
            {view === 'chat' ? (
              <BoneAIChat 
                messages={messages} 
                onAddMessage={handleAddMessage} 
                onUpdateMessage={handleUpdateMessage}
                currentRoute={currentRoute}
              />
            ) : (
              <div className="h-full overflow-y-auto p-5 scrollbar-premium bg-[#040812]/95">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-sm font-bold tracking-wide">Saved Conversations</h3>
                  <button 
                    onClick={handleNewChat}
                    className="text-xs text-[#00F0FF] hover:underline"
                  >
                    + Start New
                  </button>
                </div>
                {sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <History className="w-8 h-8 text-gray-600 mb-2" />
                    <p className="text-gray-500 text-xs">No previous chats found on this device.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map(session => {
                      const isConfirming = deleteConfirmId === session.id;
                      return (
                        <div 
                          key={session.id}
                          onClick={() => !isConfirming && handleOpenSession(session)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${
                            isConfirming 
                              ? 'border-red-500/30 bg-red-500/5' 
                              : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-[var(--color-cyan)]/30'
                          }`}
                        >
                          {isConfirming ? (
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-xs font-semibold text-red-400">Delete this conversation?</span>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); confirmDeleteSession(session.id); }}
                                  className="px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg transition-colors"
                                >
                                  Yes, Delete
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
                                <h4 className="text-sm font-medium text-gray-200 truncate">{session.title}</h4>
                                <p className="text-[10px] text-gray-500 mt-1">
                                  {new Date(session.updatedAt).toLocaleDateString()} • {session.messages.length} messages
                                </p>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(session.id); }}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"
                                title="Delete session"
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

            {/* Clear History Confirmation Overlay */}
            <AnimatePresence>
              {clearConfirmOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#040812]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 10 }}
                    className="bg-[#0D213A] border border-red-500/30 rounded-3xl p-6 max-w-xs shadow-2xl space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
                      <Trash2 className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-bold text-sm">Clear Chat History?</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        This will permanently delete all your conversation history with Bone AI. This action cannot be undone.
                      </p>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button 
                        onClick={confirmClearHistory}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                      >
                        Yes, Clear All
                      </button>
                      <button 
                        onClick={() => setClearConfirmOpen(false)}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl transition-colors border border-white/5"
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
