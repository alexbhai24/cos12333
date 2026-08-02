import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Send,
  Users,
  CheckCircle,
  Sparkles,
  Wifi,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { roomService } from '../services/roomService';
import { getGradeLabel } from '../utils/gradeUtils';
import type { RoomMessage } from '../types';

export const StudyRoomsPage: React.FC = () => {
  const { user, studyRooms, sendRoomMessage, deleteRoomMessage, openPublicProfile } = useApp();
  const { currentUser } = useAuth();

  // Selected room state (default to first accessible room)
  const accessibleRooms = studyRooms.filter((r) => roomService.canUserAccessRoom(r, user));
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    accessibleRooms[0]?.id || studyRooms[0]?.id || 'room_class_12'
  );

  const [messageText, setMessageText] = useState('');
  const [roomMessages, setRoomMessages] = useState<RoomMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const activeRoom = studyRooms.find((r) => r.id === selectedRoomId) || studyRooms[0];
  const canAccess = roomService.canUserAccessRoom(activeRoom, user);

  // Subscribe to real-time RTDB messages when room changes
  useEffect(() => {
    if (!canAccess || !activeRoom) return;

    setLoadingMessages(true);
    setRoomMessages([]);

    // Join presence
    if (currentUser?.uid) {
      roomService.joinRoom(activeRoom.id, currentUser.uid, user);
    }

    const unsub = roomService.subscribeMessages(activeRoom.id, (msgs) => {
      setRoomMessages(msgs);
      setLoadingMessages(false);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });

    return () => {
      unsub();
      if (currentUser?.uid) {
        roomService.leaveRoom(activeRoom.id, currentUser.uid);
      }
    };
  }, [activeRoom?.id, canAccess]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !canAccess) return;
    const optimisticMsg = sendRoomMessage(activeRoom.id, messageText.trim());
    
    // Optimistically update the UI to show the message immediately,
    // especially important if Firebase is offline or fails to push.
    setRoomMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    
    setMessageText('');
  };

  const handleDeleteMessage = (msgId: string) => {
    deleteRoomMessage(activeRoom.id, msgId);
    // Optimistically update the UI to remove the message immediately
    setRoomMessages((prev) => prev.filter((m) => m.id !== msgId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#06101F] via-[#09182D] to-[#120826] p-6 rounded-3xl border border-[rgba(0,240,255,0.2)] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#00F0FF]/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Private Academic Communities</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Active Study Rooms
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Connect and collaborate with verified peers in your grade level. Access is restricted by academic level and teacher designation.
            </p>
          </div>

          <div className="bg-[#040716] p-3.5 rounded-2xl border border-white/10 text-right">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Your Academic Level</div>
            <div className="text-xs font-extrabold text-[#00F0FF] mt-0.5">
              {user.isAdmin
                ? 'Owner Admin (All Access)'
                : user.userType === 'teacher'
                ? `${user.teacherDesignation || 'Teacher'} 🎓`
                : `${getGradeLabel(user.gradeLevel)} Student 🎒`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Room Sidebar & Chat Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left: Rooms List */}
        <div className="lg:col-span-4 bg-[#090C22]/90 border border-[rgba(0,240,255,0.18)] rounded-3xl p-4 flex flex-col space-y-3 shadow-2xl">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 flex items-center justify-between">
            <span>Study Rooms ({studyRooms.length})</span>
            <span className="text-[10px] text-emerald-400 font-normal">● Live Chat</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-[550px] pr-1">
            {studyRooms.map((room) => {
              const isAllowed = roomService.canUserAccessRoom(room, user);
              const isSelected = room.id === selectedRoomId;

              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : isAllowed
                      ? 'border-white/5 bg-[#040716] hover:bg-[#09182D] text-gray-300'
                      : 'border-white/5 bg-[#030510]/50 text-gray-500 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xl">{room.icon}</span>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{room.name}</span>
                          {!isAllowed && <Lock className="w-3 h-3 text-rose-400 flex-shrink-0" />}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{room.group}</div>
                      </div>
                    </div>

                    <div className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                      {room.onlineCount > 0 ? `${room.onlineCount} online` : 'Live'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Room Chat Stream */}
        <div className="lg:col-span-8 bg-[#090C22]/90 border border-[rgba(0,240,255,0.18)] rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative min-h-[500px]">
          {/* Room Header */}
          <div className="pb-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-xl">
                {activeRoom.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{activeRoom.name}</span>
                  {canAccess ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Accessible
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{activeRoom.description}</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-3 text-xs text-gray-400">
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Wifi className="w-3 h-3" />
                <span className="font-bold text-[11px]">Live</span>
              </div>
            </div>
          </div>

          {/* Chat Stream or Locked Message */}
          {!canAccess ? (
            <div className="my-auto py-16 px-6 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 mx-auto flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                <Lock className="w-8 h-8 animate-pulse" />
              </div>
              <h4 className="text-lg font-bold text-white">Private Room Locked</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                This private study room is available for{' '}
                <span className="text-cyan-400 font-bold">
                  {activeRoom.allowedGrades.map(getGradeLabel).join(', ')}
                </span>{' '}
                students and authorized educators only.
              </p>
              <div className="p-3 bg-[#040716] border border-white/10 rounded-2xl text-[11px] text-gray-400">
                💡 Change your academic profile grade from settings if you belong to this level.
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2 max-h-[400px]">
              {loadingMessages ? (
                <div className="py-16 text-center text-gray-400 text-xs flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-cyan-500/40 border-t-cyan-400 rounded-full animate-spin" />
                  <span>Connecting to live chat...</span>
                </div>
              ) : roomMessages.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-xs">
                  No messages yet in {activeRoom.name}. Start the discussion!
                </div>
              ) : (
                roomMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start space-x-3 text-left group">
                    <button
                      onClick={() =>
                        openPublicProfile({
                          name: msg.authorName,
                          photoUrl: msg.authorAvatar,
                        })
                      }
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#8B5CF6] flex items-center justify-center text-[10px] font-bold text-white border border-[#00F0FF] flex-shrink-0 mt-1 cursor-pointer"
                    >
                      {msg.authorName.substring(0, 2).toUpperCase()}
                    </button>

                    <div className="flex-1 bg-[#040716] border border-[rgba(0,240,255,0.1)] group-hover:border-[rgba(0,240,255,0.25)] rounded-2xl p-3.5 space-y-1 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{msg.authorName}</span>
                          <span className="text-[9px] font-bold text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/20 px-2 py-0.5 rounded-full">
                            {msg.authorBadge}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                          {msg.authorName === user.name && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1 rounded-md text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete message"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
              {/* Auto-scroll anchor */}
              <div ref={chatBottomRef} />
            </div>
          )}

          {/* Message Input Form */}
          {canAccess && (
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Send a message to ${activeRoom.name}...`}
                className="flex-1 bg-[#040612] border border-[rgba(0,240,255,0.18)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-2xl px-4 py-3 text-white placeholder-gray-500"
              />

              <button
                type="submit"
                disabled={!messageText.trim()}
                className="px-5 py-3 bg-[#00F0FF] hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-xs rounded-2xl flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
