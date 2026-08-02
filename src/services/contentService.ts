import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import type { ContentItem, ContentComment } from '../types';
import { normalizeGrade } from '../utils/gradeUtils';

const CONTENT_STORAGE_KEY = 'cosmicbone_mock_content_v2';

type Listener = () => void;
const listeners = new Set<Listener>();

const notifyListeners = () => {
  listeners.forEach((l) => l());
};

export const INITIAL_MOCK_CONTENT: ContentItem[] = [];

let globalContentItems: ContentItem[] = [];
let onUpdateCallback: (() => void) | null = null;

// Initialize real-time Firestore content sync
const initFirestoreSync = () => {
  const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));

  onSnapshot(q, async (snapshot) => {
    // If the database is fresh/empty, seed it with INITIAL_MOCK_CONTENT
    if (snapshot.empty) {
      console.log('[contentService] Firestore content collection empty. Seeding INITIAL_MOCK_CONTENT...');
      const batch = writeBatch(db);
      INITIAL_MOCK_CONTENT.forEach((item) => {
        const docRef = doc(db, 'content', item.id);
        batch.set(docRef, {
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date()
        });
      });
      await batch.commit().catch((err) => console.error('[contentService] Seeding failed:', err));
      return;
    }

    const items: ContentItem[] = snapshot.docs.map((d) => {
      const data = d.data();
      let createdStr = new Date().toISOString();
      if (data.createdAt) {
        createdStr = data.createdAt.toDate ? data.createdAt.toDate().toISOString() : new Date(data.createdAt).toISOString();
      }
      return {
        id: d.id,
        title: data.title ?? '',
        description: data.description ?? '',
        subject: data.subject ?? 'General',
        targetGrades: data.targetGrades ?? ['pcb'],
        contentType: data.contentType ?? 'document',
        authorName: data.authorName ?? 'Admin Owner',
        authorRole: data.authorRole ?? 'Admin',
        authorAvatar: data.authorAvatar ?? 'gradient:cyberpunk',
        authorId: data.authorId ?? '',
        createdAt: createdStr,
        thumbnail: data.thumbnail ?? '',
        videoUrl: data.videoUrl ?? '',
        views: data.views ?? 0,
        tags: data.tags ?? [],
        status: data.status ?? 'published',
        attachments: data.attachments ?? [],
        comments: data.comments ?? [],
        difficulty: data.difficulty,
        durationMinutes: data.durationMinutes,
        questionsCount: data.questionsCount,
        totalMarks: data.totalMarks,
        appleReward: data.appleReward,
        attemptsCount: data.attemptsCount,
        instructor: data.instructor,
        schedule: data.schedule,
        seatCount: data.seatCount,
        studentsEnrolled: data.studentsEnrolled,
        pages: data.pages,
        readingProgress: data.readingProgress,
        fileType: data.fileType,
        fileSize: data.fileSize,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileMimeType: data.fileMimeType,
        googleFormUrl: data.googleFormUrl ?? data.formUrl ?? '',
      } as ContentItem;
    });

    globalContentItems = items;

    // Cache to localStorage for offline access
    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('[contentService] Failed to cache content to localStorage:', e);
    }

    if (onUpdateCallback) {
      onUpdateCallback();
    }
  }, (error) => {
    console.error('[contentService] Firestore Realtime Sync Error:', error);
  });
};

// Start sync instantly
initFirestoreSync();

export const contentService = {
  // Hook an update listener from React context
  registerListener: (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  getAllContent: (): ContentItem[] => {
    if (globalContentItems.length > 0) {
      return globalContentItems;
    }
    // Fallback to localStorage if Firestore hasn't resolved
    try {
      const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('[contentService] LocalStorage read failed:', e);
    }
    return INITIAL_MOCK_CONTENT;
  },

  saveAllContent: async (items: ContentItem[]) => {
    // Keep local cache updated
    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('[contentService] Local cache save failed:', e);
    }
  },

  getContentByGrade: (grade: string, contentType?: string): ContentItem[] => {
    const normGrade = normalizeGrade(grade);
    const all = contentService.getAllContent();
    return all.filter((item) => {
      if (item.status === 'draft') return false;
      const matchGrade = item.targetGrades.some((g) => normalizeGrade(g) === normGrade);
      const matchType = !contentType || item.contentType === contentType;
      return matchGrade && matchType;
    });
  },



  addContentItem: async (item: ContentItem): Promise<ContentItem> => {
    // Add locally to cache
    const current = contentService.getAllContent();
    const updated = [item, ...current.filter((c) => c.id !== item.id)];
    globalContentItems = updated;
    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    // Add/Update in Firestore
    try {
      const docRef = doc(db, 'content', item.id);
      await setDoc(docRef, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('[contentService] Firestore setDoc failed:', e);
    }
    
    notifyListeners();
    return item;
  },

  addContent: async (item: ContentItem): Promise<ContentItem> => {
    return contentService.addContentItem(item);
  },

  updateContent: async (id: string, partial: Partial<ContentItem>): Promise<ContentItem | null> => {
    const current = contentService.getAllContent();
    const existing = current.find((i) => i.id === id);
    if (!existing) return null;

    const updatedItem = { ...existing, ...partial };
    const updatedList = current.map((i) => (i.id === id ? updatedItem : i));
    globalContentItems = updatedList;

    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {}

    try {
      const docRef = doc(db, 'content', id);
      await updateDoc(docRef, {
        ...partial,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('[contentService] Firestore updateDoc failed:', e);
    }
    
    notifyListeners();
    return updatedItem;
  },

  addCommentToContent: async (contentId: string, comment: ContentComment): Promise<ContentItem | null> => {
    const all = contentService.getAllContent();
    const target = all.find((item) => item.id === contentId);
    if (!target) return null;

    const updatedComments = [comment, ...(target.comments || [])];
    try {
      const docRef = doc(db, 'content', contentId);
      await updateDoc(docRef, {
        comments: updatedComments,
        updatedAt: serverTimestamp()
      });
    } catch (e) {}

    // Also update local memory so UI gets immediate feedback
    target.comments = updatedComments;
    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(globalContentItems));
    } catch (e) {}

    notifyListeners();
    return {
      ...target,
      comments: updatedComments
    };
  },

  updateContentItem: async (item: ContentItem): Promise<ContentItem> => {
    return (await contentService.updateContent(item.id, item)) || item;
  },

  deleteContent: async (itemId: string): Promise<void> => {
    return contentService.deleteContentItem(itemId);
  },

  deleteContentItem: async (itemId: string): Promise<void> => {
    try {
      const docRef = doc(db, 'content', itemId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn('[contentService] Firestore content delete failed:', e);
    }

    // Remove locally from memory and localStorage cache
    globalContentItems = globalContentItems.filter((c) => c.id !== itemId);
    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(globalContentItems));
    } catch (e) {
      console.warn('[contentService] LocalStorage update failed:', e);
    }

    notifyListeners();
  },
};
