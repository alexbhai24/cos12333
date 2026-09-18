import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  ChevronDown, 
  ChevronUp, 
  Trash2,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { chatHistoryStore, ChatSession, ChatMessage } from '../services/chatHistoryStore';
import { BoneAIChat } from '../components/bone-ai/BoneAIChat';
import { MessagePlusIcon } from '../components/bone-ai/MessagePlusIcon';

export const BoneAIPage: React.FC = () => {
  const { currentRoute, user } = useApp();
  const { currentUser } = useAuth();
  const activeUserEmail = user?.email || currentUser?.email || 'guest';

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConversationsOpen, setIsConversationsOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCheckMode, setIsCheckMode] = useState(false);

  // Swipe gestures for slidable sidebar
  const [drawerTouchStartX, setDrawerTouchStartX] = useState<number | null>(null);
  const [drawerTouchCurrentX, setDrawerTouchCurrentX] = useState<number | null>(null);
  const [edgeSwipeStartX, setEdgeSwipeStartX] = useState<number | null>(null);

  const handleDrawerTouchStart = (e: React.TouchEvent) => {
    setDrawerTouchStartX(e.touches[0].clientX);
  };

  const handleDrawerTouchMove = (e: React.TouchEvent) => {
    setDrawerTouchCurrentX(e.touches[0].clientX);
  };

  const handleDrawerTouchEnd = () => {
    if (drawerTouchStartX !== null && drawerTouchCurrentX !== null) {
      const diff = drawerTouchStartX - drawerTouchCurrentX;
      // If swiped left by 40px or more, close the sidebar
      if (diff > 40) {
        setIsMobileSidebarOpen(false);
      }
    }
    setDrawerTouchStartX(null);
    setDrawerTouchCurrentX(null);
  };

  const handleScreenTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0].clientX < 35) {
      setEdgeSwipeStartX(e.touches[0].clientX);
    }
  };

  const handleScreenTouchEnd = (e: React.TouchEvent) => {
    if (edgeSwipeStartX !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchEndX - edgeSwipeStartX > 45) {
        setIsMobileSidebarOpen(true);
      }
      setEdgeSwipeStartX(null);
    }
  };

  useEffect(() => {
    if (activeUserEmail) {
      chatHistoryStore.getChatsForUser(activeUserEmail).then(setSessions);
    }
  }, [activeUserEmail, messages]);

  useEffect(() => {
    if (messages.length > 0 && activeUserEmail) {
      const sessionId = activeSessionId || `session_${Date.now()}`;
      if (!activeSessionId) setActiveSessionId(sessionId);

      const firstUserMsg = messages.find(m => m.role === 'user')?.content || 'New Conversation';
      const sessionTitle = firstUserMsg.length > 25 ? firstUserMsg.substring(0, 25) + '...' : firstUserMsg;

      chatHistoryStore.saveChat({
        id: sessionId,
        userId: activeUserEmail,
        title: sessionTitle,
        createdAt: parseInt(sessionId.split('_')[1]) || Date.now(),
        updatedAt: Date.now(),
        messages
      }).then(() => {
        chatHistoryStore.getChatsForUser(activeUserEmail).then(setSessions);
      });
    }
  }, [messages, activeSessionId, activeUserEmail]);

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const handleOpenSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    await chatHistoryStore.deleteChat(sessionId);
    if (activeSessionId === sessionId) {
      handleNewChat();
    }
    const updated = await chatHistoryStore.getChatsForUser(activeUserEmail);
    setSessions(updated);
  };

  const handleAddMessage = (msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleUpdateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  return (
    <div 
      onTouchStart={handleScreenTouchStart}
      onTouchEnd={handleScreenTouchEnd}
      className="h-[100dvh] lg:h-[calc(100vh-48px)] -mx-0 lg:-mx-8 -mt-0 lg:-mt-8 -mb-0 lg:-mb-12 flex bg-transparent overflow-hidden font-sans relative"
    >
      
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* The Single Sidebar (Docked on desktop, slidable on mobile) */}
      <div 
        onTouchStart={handleDrawerTouchStart}
        onTouchMove={handleDrawerTouchMove}
        onTouchEnd={handleDrawerTouchEnd}
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 lg:z-10 ${
          isSidebarCollapsed ? 'lg:w-20 lg:items-center' : 'w-72 sm:w-80'
        } transition-all duration-300 ease-in-out bg-black/70 lg:bg-black/40 backdrop-blur-2xl lg:backdrop-blur-xl lg:ml-6 lg:mt-4 lg:mb-2 rounded-r-3xl lg:rounded-3xl flex flex-col py-6 px-4 space-y-6 shadow-2xl shrink-0 text-white border-r lg:border border-white/5 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        
        {/* Top Icons: Menu on left, Check Mode & New Conversation on right */}
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center flex-col space-y-4' : 'justify-between w-full px-2'}`}>
          <button 
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsMobileSidebarOpen(false);
              } else {
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }
            }}
            className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-gray-300 hover:text-white focus:outline-none"
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 stroke-[1.5]" />
          </button>

          <div className="flex items-center space-x-2">
            {/* Check Mode Toggle Button */}
            <button
              onClick={() => setIsCheckMode(prev => !prev)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isCheckMode
                  ? 'bg-cyan-500/20 text-[#00F0FF] border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
              title={isCheckMode ? 'Check Mode Active: Direct factual chat + Web Images + Fact check' : 'Enable Check Mode'}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCheckMode ? 'text-[#00F0FF]' : 'text-gray-400'}`} />
              <span className={isSidebarCollapsed ? 'hidden' : 'inline'}>Check</span>
            </button>

            {/* New Conversation Button */}
            <button
              onClick={() => {
                handleNewChat();
                setIsMobileSidebarOpen(false);
              }}
              className="w-9 h-9 rounded-full bg-[#272930] hover:bg-[#343740] border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
              title="New conversation"
              aria-label="New conversation"
            >
              <MessagePlusIcon className="w-5 h-5" size={19} />
            </button>
          </div>
        </div>

        {/* Separator when collapsed */}
        {isSidebarCollapsed && (
          <div className="w-8 h-px bg-white/10 mx-auto" />
        )}

        {/* Conversations Collapsible Header */}
        <div 
          onClick={() => !isSidebarCollapsed && setIsConversationsOpen(!isConversationsOpen)}
          className={`flex items-center cursor-pointer group pt-1 ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-2'}`}
        >
          <div className="flex items-center space-x-3 text-gray-300 group-hover:text-white">
            <Clock className="w-5 h-5" strokeWidth={1.5} />
            {!isSidebarCollapsed && (
              <span className="font-sans text-sm font-medium">Conversations</span>
            )}
          </div>
          {!isSidebarCollapsed && (
            isConversationsOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-white" strokeWidth={1.5} />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white" strokeWidth={1.5} />
            )
          )}
        </div>

        {/* Conversations List */}
        {!isSidebarCollapsed && isConversationsOpen && (
          <div className="flex-1 overflow-y-auto space-y-3 px-2 scrollbar-none w-full">
            {sessions.length === 0 ? (
              <div className="text-gray-500 font-sans text-sm font-medium">
                No recent chats
              </div>
            ) : (
              sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => {
                    handleOpenSession(session);
                    setIsMobileSidebarOpen(false);
                  }}
                  className="w-full text-left transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span className="font-sans text-sm font-medium text-gray-300 hover:text-white truncate pr-2">
                    {session.title}
                  </span>
                  <button
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="p-1 text-gray-500 hover:text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Main Workspace matching Bixby image exactly */}
      <div className="flex-1 flex flex-col relative bg-transparent overflow-hidden">
        <BoneAIChat
          messages={messages}
          onAddMessage={handleAddMessage}
          onUpdateMessage={handleUpdateMessage}
          currentRoute={currentRoute}
          onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onNewChat={handleNewChat}
          isPopup={false}
          isCheckMode={isCheckMode}
        />
      </div>

    </div>
  );
};
