import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
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
// ROOM SERVICE (Firestore Migration)
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

  // ── FIRESTORE: Subscribe to last 100 messages ──────────────────────────────
  subscribeMessages: (
    roomId: string,
    callback: (messages: RoomMessage[]) => void
  ): (() => void) => {
    const q = query(
      collection(db, 'study_rooms', roomId, 'messages'),
      orderBy('sentAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: RoomMessage[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          let timeStr = 'Just now';
          if (d.sentAt) {
            const date = d.sentAt.toDate ? d.sentAt.toDate() : new Date(d.sentAt);
            timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          msgs.push({
            id: docSnap.id,
            roomId,
            authorName: d.authorName ?? 'Anonymous',
            authorAvatar: d.authorAvatar ?? 'gradient:astronaut',
            authorRole: d.authorRole ?? 'Student',
            authorBadge: d.authorBadge ?? 'Student 🎒',
            text: d.text ?? '',
            timestamp: d.timestamp ?? timeStr,
            attachments: d.attachments ?? undefined,
          });
        });
        // We ordered by desc so we have newest first. Reverse to display newest at bottom.
        callback(msgs.reverse());
      },
      (error) => {
        console.warn('[roomService] Firestore subscribeMessages error:', error);
        callback(roomService.getRoomMessages(roomId));
      }
    );

    return unsubscribe;
  },

  // ── FIRESTORE: Send a message ──────────────────────────────────────────────
  sendMessage: (
    roomId: string,
    msgText: string,
    userObj: UserProfile,
    attachments?: { name: string; url: string }[]
  ): RoomMessage => {
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

    const newDocId = `local-${Date.now()}`;
    addDoc(collection(db, 'study_rooms', roomId, 'messages'), payload)
      .catch((err) => console.error('[roomService] Failed to send message to Firestore:', err));

    const optimisticMessage: RoomMessage = {
      id: newDocId,
      ...payload,
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
    // Delete from Firebase Firestore
    if (!messageId.startsWith('local-')) {
      deleteDoc(doc(db, 'study_rooms', roomId, 'messages', messageId))
        .catch(err => console.error('[roomService] Failed to delete Firestore msg:', err));
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

  // ── FIRESTORE: Track user presence in a room ───────────────────────────────
  joinRoom: (roomId: string, uid: string, userObj: UserProfile): void => {
    try {
      setDoc(doc(db, 'study_rooms', roomId, 'presence', uid), {
        name: userObj.name || 'Anonymous',
        avatar: userObj.photoUrl || 'gradient:astronaut',
        joinedAt: serverTimestamp(),
        online: true,
      }, { merge: true }).catch(e => console.warn('joinRoom fail:', e));
    } catch (e) {
      console.warn('[roomService] joinRoom error:', e);
    }
  },

  leaveRoom: (roomId: string, uid: string): void => {
    try {
      deleteDoc(doc(db, 'study_rooms', roomId, 'presence', uid))
        .catch(e => console.warn('leaveRoom fail:', e));
    } catch (e) {
      console.warn('[roomService] leaveRoom error:', e);
    }
  },

  // ── FIRESTORE: Subscribe to live online count ──────────────────────────────
  subscribeOnlineCount: (
    roomId: string,
    callback: (count: number) => void
  ): (() => void) => {
    const q = collection(db, 'study_rooms', roomId, 'presence');
    const unsubscribe = onSnapshot(q, (snap) => {
      callback(snap.size ?? 0);
    }, (error) => {
      console.warn('[roomService] Firestore subscribeOnlineCount error:', error);
    });
    return unsubscribe;
  },

  updateRoomTopic: (roomId: string, topic: string): void => {
    const room = ALL_STUDY_ROOMS.find((r) => r.id === roomId);
    if (room) room.topic = topic;

    // Persist topic to Firestore
    setDoc(doc(db, 'study_rooms', roomId), { topic }, { merge: true })
      .catch(console.error);
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
