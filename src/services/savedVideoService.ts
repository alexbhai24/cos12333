import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface SavedVideoDoc {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  embedUrl: string;
  authorName: string;
  authorRole: string;
  subject: string;
  description: string;
  savedAt: any;
}

export const savedVideoService = {
  /**
   * Bookmark / Save a video to users/{uid}/savedVideos/{videoId}
   */
  saveVideo: async (
    uid: string,
    video: {
      id: string;
      title: string;
      thumbnailUrl?: string;
      thumbnail?: string;
      embedUrl?: string;
      videoUrl?: string;
      authorName?: string;
      authorRole?: string;
      subject?: string;
      description?: string;
    }
  ): Promise<void> => {
    if (!uid || !video.id) return;

    const docRef = doc(db, 'users', uid, 'savedVideos', video.id);
    const data = {
      videoId: video.id,
      title: video.title || 'Untitled Lecture',
      thumbnailUrl: video.thumbnailUrl || video.thumbnail || '',
      embedUrl: video.embedUrl || video.videoUrl || '',
      authorName: video.authorName || 'Teacher',
      authorRole: video.authorRole || 'Instructor',
      subject: video.subject || 'General',
      description: video.description || '',
      savedAt: serverTimestamp(),
    };

    await setDoc(docRef, data, { merge: true });
  },

  /**
   * Remove a video from users/{uid}/savedVideos/{videoId}
   */
  unsaveVideo: async (uid: string, videoId: string): Promise<void> => {
    if (!uid || !videoId) return;
    const docRef = doc(db, 'users', uid, 'savedVideos', videoId);
    await deleteDoc(docRef);
  },

  /**
   * Subscribe in real-time to a user's saved videos, ordered by most recently saved.
   */
  subscribeSavedVideos: (
    uid: string,
    callback: (videos: SavedVideoDoc[]) => void
  ): Unsubscribe => {
    if (!uid) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, 'users', uid, 'savedVideos'),
      orderBy('savedAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const videos: SavedVideoDoc[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            videoId: data.videoId || d.id,
            title: data.title || '',
            thumbnailUrl: data.thumbnailUrl || '',
            embedUrl: data.embedUrl || '',
            authorName: data.authorName || 'Teacher',
            authorRole: data.authorRole || 'Instructor',
            subject: data.subject || 'General',
            description: data.description || '',
            savedAt: data.savedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          };
        });
        callback(videos);
      },
      (err) => {
        console.error('[savedVideoService] Error loading saved videos:', err);
      }
    );
  },
};
