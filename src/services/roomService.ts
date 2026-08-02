import {
  ref,
  push,
  set,
  onValue,
  off,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
  onDisconnect,
  update,
} from 'firebase/database';
import { rtdb } from '../firebase';
import type { StudyRoom, RoomMessage, UserProfile } from '../types';
import { normalizeGrade, normalizeDesignation } from '../utils/gradeUtils';

// ─────────────────────────────────────────────────────────────────────────────
// STATIC ROOM DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_STUDY_ROOMS: StudyRoom[] = [
  {
    id: 'room_class_6',
    name: 'Class 6 Explorer Room',
    group: 'Middle School',
    allowedGrades: ['class_6'],
    allowedDesignations: ['tgt_middle', 'admin'],
    description: 'Interactive study & homework help room for Class 6 students.',
    icon: '🏫',
    memberCount: 0,
    onlineCount: 0,
  },
  {
    id: 'room_class_7',
    name: 'Class 7 Cyber Lounge',
    group: 'Middle School',
    allowedGrades: ['class_7'],
    allowedDesignations: ['tgt_middle', 'admin'],
    description: 'Group discussions and science experiments for Class 7.',
    icon: '🚀',
    memberCount: 0,
    onlineCount: 0,
  },
  {
    id: 'room_class_8',
    name: 'Class 8 Quantum Squad',
    group: 'Middle School',
    allowedGrades: ['class_8'],
    allowedDesignations: ['tgt_middle', 'admin'],
    description: 'Preparation room for Class 8 Math & Science olympiads.',
    icon: '⚡',
    memberCount: 0,
    onlineCount: 0,
  },
  {
    id: 'room_class_9',
    name: 'Class 9 Foundation Hub',
    group: 'High School',
    allowedGrades: ['class_9'],
    allowedDesignations: ['tgt_high', 'admin'],
    description: 'Foundation courses, Physics, Math & Chemistry for Class 9.',
    icon: '🔬',
    memberCount: 0,
    onlineCount: 0,
  },
  {
    id: 'room_class_10',
    name: 'Class 10 Board Champions',
    group: 'High School',
    allowedGrades: ['class_10'],
    allowedDesignations: ['tgt_high', 'admin'],
    description: 'CBSE / ICSE Board preparation, PYQs & doubt solving.',
    icon: '🏆',
    memberCount: 0,
    onlineCount: 0,
  },
  {
    id: 'room_pcb',
    name: 'PCB Medical & Science Arena',
    group: 'Senior Secondary',
    allowedGrades: ['pcb'],
    allowedDesignations: ['pgt_senior', 'admin'],
    description: 'Biology diagrams, Physics numericals & Organic Chemistry for PCB.',
    icon: '🩺',
    memberCount: 0,
    onlineCount: 0,
  },
  {
    id: 'room_pcm',
    name: 'PCM Engineering & Math Matrix',
    group: 'Senior Secondary',
    allowedGrades: ['pcm'],
    allowedDesignations: ['pgt_senior', 'admin'],
    description: 'Calculus, Trigonometry & Physical Chemistry discussions for PCM.',
    icon: '🧠',
    memberCount: 0,
    onlineCount: 0,
  },
  {
    id: 'room_skill',
    name: 'Skill Upgradation Lab',
    group: 'Higher Specialization',
    allowedGrades: ['skill'],
    allowedDesignations: ['faculty_entrance', 'admin'],
    description: 'Practical programming, AI workflows, and applied tech discussion.',
    icon: '💻',
    memberCount: 0,
    onlineCount: 0,
  },
  {
    id: 'room_dropper',
    name: 'Business Arena',
    group: 'Higher Specialization',
    allowedGrades: ['dropper'],
    allowedDesignations: ['faculty_entrance', 'admin'],
    description: 'Advanced target test series, strategies & focused studies.',
    icon: '🎯',
    memberCount: 0,
    onlineCount: 0,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RTDB PATH HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const messagesPath = (roomId: string) => `rooms/${roomId}/messages`;
const presencePath = (roomId: string, uid: string) => `rooms/${roomId}/presence/${uid}`;

// ─────────────────────────────────────────────────────────────────────────────
// ROOM SERVICE
// ─────────────────────────────────────────────────────────────────────────────
export const roomService = {
  getAllRooms: (): StudyRoom[] => ALL_STUDY_ROOMS,

  canUserAccessRoom: (room: StudyRoom, userObj: Partial<UserProfile>): boolean => {
    if (userObj.isAdmin) return true;

    if (userObj.userType === 'teacher' || userObj.role === 'Teacher') {
      const designation = normalizeDesignation(userObj.teacherDesignation);
      if (designation === 'admin') return true;
      return room.allowedDesignations?.includes(designation) ?? false;
    }

    const grade = normalizeGrade(userObj.gradeLevel);
    const map: Record<string, string> = {
      class_6: 'room_class_6',
      class_7: 'room_class_7',
      class_8: 'room_class_8',
      class_9: 'room_class_9',
      class_10: 'room_class_10',
      pcb: 'room_pcb',
      pcm: 'room_pcm',
      skill: 'room_skill',
      dropper: 'room_dropper',
    };
    return room.id === (map[grade] ?? '');
  },

  // ── REALTIME DATABASE: Subscribe to last 100 messages ──────────────────────
  subscribeMessages: (
    roomId: string,
    callback: (messages: RoomMessage[]) => void
  ): (() => void) => {
    const msgRef = query(
      ref(rtdb, messagesPath(roomId)),
      orderByChild('sentAt'),
      limitToLast(100)
    );

    const handler = onValue(
      msgRef,
      (snap) => {
        const msgs: RoomMessage[] = [];
        snap.forEach((child) => {
          const d = child.val();
          msgs.push({
            id: child.key!,
            roomId,
            authorName: d.authorName ?? 'Anonymous',
            authorAvatar: d.authorAvatar ?? 'gradient:astronaut',
            authorRole: d.authorRole ?? 'Student',
            authorBadge: d.authorBadge ?? 'Student 🎒',
            text: d.text ?? '',
            timestamp: d.timestamp ?? new Date(d.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachments: d.attachments ?? undefined,
          });
        });
        callback(msgs);
      },
      (error) => {
        console.warn('[roomService] RTDB subscribeMessages error:', error);
        callback(roomService.getRoomMessages(roomId));
      }
    );

    // Return unsubscribe function
    return () => off(msgRef, 'value', handler);
  },

  // ── REALTIME DATABASE: Send a message ──────────────────────────────────────
  sendMessage: (
    roomId: string,
    msgText: string,
    userObj: UserProfile,
    attachments?: { name: string; url: string }[]
  ): RoomMessage => {
    const msgRef = ref(rtdb, messagesPath(roomId));
    const newRef = push(msgRef);

    const now = new Date();
    const payload = {
      roomId,
      authorName: userObj.name || userObj.firstName || 'Cosmic Voyager',
      authorAvatar: userObj.photoUrl || 'gradient:astronaut',
      authorRole: userObj.userType === 'teacher' ? 'Teacher' : 'Student',
      authorBadge: userObj.isAdmin
        ? 'Owner Admin 👑'
        : userObj.userType === 'teacher'
        ? 'Teacher 🎓'
        : `${normalizeGrade(userObj.gradeLevel).toUpperCase()} Student 🎒`,
      text: msgText,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentAt: serverTimestamp(),
      ...(attachments && attachments.length > 0 ? { attachments } : {}),
    };

    set(newRef, payload).catch((err) =>
      console.error('[roomService] Failed to send message to RTDB:', err)
    );

    const optimisticMessage: RoomMessage = {
      id: newRef.key || `local-${Date.now()}`,
      roomId,
      authorName: payload.authorName,
      authorAvatar: payload.authorAvatar,
      authorRole: payload.authorRole,
      authorBadge: payload.authorBadge,
      text: payload.text,
      timestamp: payload.timestamp,
      attachments,
    };

    // Save to localStorage fallback
    try {
      const ROOM_MESSAGES_KEY = 'cosmicbone_room_messages_v2';
      const stored = localStorage.getItem(ROOM_MESSAGES_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      if (!parsed[roomId]) parsed[roomId] = [];
      parsed[roomId].push(optimisticMessage);
      localStorage.setItem(ROOM_MESSAGES_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error('Local storage save failed', e);
    }

    return optimisticMessage;
  },

  deleteRoomMessage: (roomId: string, messageId: string): void => {
    // Delete from Firebase RTDB
    if (!messageId.startsWith('local-')) {
      const msgRef = ref(rtdb, `${messagesPath(roomId)}/${messageId}`);
      set(msgRef, null).catch(err => console.error('[roomService] Failed to delete RTDB msg:', err));
    }

    // Delete from localStorage fallback
    try {
      const ROOM_MESSAGES_KEY = 'cosmicbone_room_messages_v2';
      const stored = localStorage.getItem(ROOM_MESSAGES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[roomId]) {
          parsed[roomId] = parsed[roomId].filter((m: RoomMessage) => m.id !== messageId);
          localStorage.setItem(ROOM_MESSAGES_KEY, JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.error('Local storage delete failed', e);
    }
  },

  // ── REALTIME DATABASE: Track user presence in a room ───────────────────────
  joinRoom: (roomId: string, uid: string, userObj: UserProfile): void => {
    try {
      const presRef = ref(rtdb, presencePath(roomId, uid));
      const data = {
        name: userObj.name || 'Anonymous',
        avatar: userObj.photoUrl || 'gradient:astronaut',
        joinedAt: serverTimestamp(),
        online: true,
      };
      set(presRef, data).catch((err) => console.warn('[roomService] joinRoom set failed:', err));
      onDisconnect(presRef).remove().catch((err) => console.warn('[roomService] onDisconnect failed:', err));
    } catch (e) {
      console.warn('[roomService] joinRoom error:', e);
    }
  },

  leaveRoom: (roomId: string, uid: string): void => {
    try {
      const presRef = ref(rtdb, presencePath(roomId, uid));
      set(presRef, null).catch((err) => console.warn('[roomService] leaveRoom failed:', err));
    } catch (e) {
      console.warn('[roomService] leaveRoom error:', e);
    }
  },

  // ── REALTIME DATABASE: Subscribe to live online count ──────────────────────
  subscribeOnlineCount: (
    roomId: string,
    callback: (count: number) => void
  ): (() => void) => {
    const presRef = ref(rtdb, `rooms/${roomId}/presence`);
    const handler = onValue(
      presRef,
      (snap) => {
        callback(snap.size ?? 0);
      },
      (error) => {
        console.warn('[roomService] RTDB subscribeOnlineCount error:', error);
      }
    );
    return () => off(presRef, 'value', handler);
  },

  updateRoomTopic: (roomId: string, topic: string): void => {
    const room = ALL_STUDY_ROOMS.find((r) => r.id === roomId);
    if (room) room.topic = topic;

    // Also persist topic to RTDB
    update(ref(rtdb, `rooms/${roomId}`), { topic }).catch(console.error);
  },

  // Legacy sync fallback: read messages from localStorage (offline mode)
  getRoomMessages: (roomId: string): RoomMessage[] => {
    const ROOM_MESSAGES_KEY = 'cosmicbone_room_messages_v2';
    try {
      const stored = localStorage.getItem(ROOM_MESSAGES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[roomId]) return parsed[roomId];
      }
    } catch (e) {
      console.error('Error loading room messages from localStorage:', e);
    }
    return [];
  },
};
