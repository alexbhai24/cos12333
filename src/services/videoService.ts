import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { UserProfileDoc } from '../types';
import { normalizeGrade } from '../utils/gradeUtils';

export interface VideoDoc {
  id: string;
  title: string;
  youtubeVideoId: string;
  embedUrl: string;
  thumbnailUrl: string;
  uploadedByUid: string;
  uploadedByName: string;
  uploadedByEmail: string;
  uploadedByRole: string;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
  subject: string;
  targetGrades: string[];
}

const LOCAL_VIDEOS_KEY = 'cosmicbone_published_videos';

const getLocalVideos = (): VideoDoc[] => {
  try {
    const stored = localStorage.getItem(LOCAL_VIDEOS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalVideo = (video: VideoDoc) => {
  try {
    const current = getLocalVideos();
    const updated = [video, ...current.filter((v) => v.id !== video.id)];
    localStorage.setItem(LOCAL_VIDEOS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save local video:', e);
  }
};

/**
 * Extracts YouTube video ID from various URL or iframe formats:
 * - https://www.youtube.com/watch?v=2TlIg3VokY8
 * - https://youtu.be/2TlIg3VokY8
 * - https://www.youtube.com/embed/2TlIg3VokY8
 * - <iframe ... src="https://www.youtube.com/embed/2TlIg3VokY8" ...></iframe>
 */
export function extractYoutubeId(input: string): string | null {
  if (!input) return null;

  let url = input.trim();

  // If it's an iframe tag, extract the src attribute
  const srcMatch = url.match(/src=["'](https?:\/\/[^"']+)["']/i);
  if (srcMatch) {
    url = srcMatch[1];
  }

  // YouTube URL regex matching standard, share, short, list, and embed patterns
  const ytRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(ytRegex);

  return match ? match[1] : null;
}

const convertTimestampToISO = (ts: any): string => {
  if (!ts) return new Date().toISOString();
  if (typeof ts.toISOString === 'function') return ts.toISOString();
  if (typeof ts.toDate === 'function') return ts.toDate().toISOString();
  if (ts.seconds !== undefined) return new Date(ts.seconds * 1000).toISOString();
  if (typeof ts === 'string') return ts;
  return new Date().toISOString();
};

export const videoService = {
  /**
   * Subscribe to videos in real-time from Firestore, filtered by target grade.
   * Merges remote Firestore videos with local storage published videos.
   */
  subscribeVideosByGrade: (grade: string, callback: (videos: VideoDoc[]) => void): Unsubscribe => {
    // Subscribe to all published videos in Firestore, then filter and sort in memory
    // This avoids Firestore composite index requirements and grade string casing mismatches.
    const q = query(
      collection(db, 'videos'),
      where('status', '==', 'published')
    );

    const normGrade = normalizeGrade(grade);

    return onSnapshot(
      q,
      (snapshot) => {
        const remoteVideos: VideoDoc[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title ?? '',
            youtubeVideoId: data.youtubeVideoId ?? '',
            embedUrl: data.embedUrl ?? '',
            thumbnailUrl: data.thumbnailUrl ?? '',
            uploadedByUid: data.uploadedByUid ?? '',
            uploadedByName: data.uploadedByName ?? '',
            uploadedByEmail: data.uploadedByEmail ?? '',
            uploadedByRole: data.uploadedByRole ?? '',
            createdAt: convertTimestampToISO(data.createdAt),
            updatedAt: convertTimestampToISO(data.updatedAt),
            status: data.status ?? 'published',
            subject: data.subject ?? 'General',
            targetGrades: data.targetGrades ?? [],
          } as VideoDoc;
        });

        // Build a set of remote IDs for deduplication
        const remoteIds = new Set(remoteVideos.map((v) => v.id));
        const remoteYtIds = new Set(remoteVideos.map((v) => v.youtubeVideoId).filter(Boolean));

        // Keep local-only videos that haven't been synced to Firestore yet
        const localOnlyVideos = getLocalVideos().filter(
          (lv) => !remoteIds.has(lv.id) && !remoteYtIds.has(lv.youtubeVideoId)
        );

        // Merge: Firestore is source of truth, local-only videos appended
        const combined = [...remoteVideos, ...localOnlyVideos];

        const isAll = !grade || grade.toLowerCase() === 'all';

        // Filter by grade with normalizeGrade
        const filtered = combined.filter((v) => {
          if (isAll) return true;
          return v.targetGrades.some((g) => normalizeGrade(g) === normGrade || g.toLowerCase() === 'all');
        });

        // Sort by createdAt descending (newest first)
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        callback(filtered);
      },
      (err) => {
        console.warn('[videoService] Firestore snapshot error:', err.code, err.message);
        const isAll = !grade || grade.toLowerCase() === 'all';
        // Fallback to local storage videos if Firestore subscription fails
        const local = getLocalVideos()
          .filter((lv) => {
            if (isAll) return true;
            return lv.targetGrades.some((g) => normalizeGrade(g) === normGrade || g.toLowerCase() === 'all');
          })
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(local);
      }
    );
  },

  /**
   * Safe video publishing. Extract YouTube ID, construct embed URLs, and save directly to Cloud Firestore.
   */
  uploadVideo: async (
    video: {
      title: string;
      urlOrEmbed: string;
      customThumbnailUrl?: string;
      subject: string;
      targetGrade: string;
    },
    userProfile: UserProfileDoc,
    userRole: string
  ): Promise<string> => {
    const videoId = extractYoutubeId(video.urlOrEmbed);
    if (!videoId) {
      throw new Error('Invalid YouTube URL or embed code. Please enter a valid YouTube link.');
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const thumbnailUrl =
      video.customThumbnailUrl?.trim() || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

    const currentUid = auth.currentUser?.uid || userProfile.uid;
    const currentEmail = auth.currentUser?.email || userProfile.email || 'rajanandalex1@gmail.com';
    const isOwnerAdmin = currentEmail.toLowerCase().trim() === 'rajanandalex1@gmail.com';

    const localId = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const normalizedTargetGrade = normalizeGrade(video.targetGrade);

    const docData: VideoDoc = {
      id: localId,
      title: video.title.trim(),
      youtubeVideoId: videoId,
      embedUrl,
      thumbnailUrl,
      uploadedByUid: currentUid,
      uploadedByName: userProfile.displayName || auth.currentUser?.displayName || 'Owner Admin',
      uploadedByEmail: currentEmail,
      uploadedByRole: isOwnerAdmin ? 'admin' : userRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      subject: video.subject,
      targetGrades: [normalizedTargetGrade, video.targetGrade],
    };

    // Save locally first for 0ms instantaneous UI update
    saveLocalVideo(docData);

    // Direct Cloud Firestore write with docRef for universal real-time propagation across all accounts
    try {
      const docRef = doc(db, 'videos', localId);
      await setDoc(docRef, {
        ...docData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return localId;
    } catch (fsErr: any) {
      console.warn('[videoService] Direct Firestore write notice:', fsErr.message);
    }

    return localId;
  },

  updateVideo: async (videoId: string, title: string, subject: string, targetGrade: string): Promise<void> => {
    // Update in Firestore
    try {
      const ref = doc(db, 'videos', videoId);
      await updateDoc(ref, {
        title: title.trim(),
        subject,
        targetGrades: [targetGrade],
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('[videoService] Firestore video update failed:', e);
    }
    // Update in LocalStorage if present
    try {
      const current = getLocalVideos();
      const updated = current.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            title: title.trim(),
            subject,
            targetGrades: [targetGrade],
            updatedAt: new Date().toISOString(),
          };
        }
        return v;
      });
      localStorage.setItem(LOCAL_VIDEOS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update local video:', e);
    }
  },

  deleteVideo: async (videoId: string): Promise<void> => {
    // Delete from Firestore
    try {
      const ref = doc(db, 'videos', videoId);
      await deleteDoc(ref);
    } catch (e) {
      console.warn('[videoService] Firestore video delete failed:', e);
    }
    // Delete from LocalStorage if present
    try {
      const current = getLocalVideos();
      const updated = current.filter((v) => v.id !== videoId);
      localStorage.setItem(LOCAL_VIDEOS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete local video:', e);
    }
  },

  subscribeAllVideos: (callback: (videos: VideoDoc[]) => void): Unsubscribe => {
    // No orderBy — sort in JS to avoid composite index requirement
    const q = query(collection(db, 'videos'));
    return onSnapshot(
      q,
      (snapshot) => {
        const remoteVideos: VideoDoc[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title ?? '',
            youtubeVideoId: data.youtubeVideoId ?? '',
            embedUrl: data.embedUrl ?? '',
            thumbnailUrl: data.thumbnailUrl ?? '',
            uploadedByUid: data.uploadedByUid ?? '',
            uploadedByName: data.uploadedByName ?? '',
            uploadedByEmail: data.uploadedByEmail ?? '',
            uploadedByRole: data.uploadedByRole ?? '',
            createdAt: convertTimestampToISO(data.createdAt),
            updatedAt: convertTimestampToISO(data.updatedAt),
            status: data.status ?? 'published',
            subject: data.subject ?? 'General',
            targetGrades: data.targetGrades ?? [],
          } as VideoDoc;
        });

        // Sort newest first in JS
        remoteVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Sync localStorage so other tabs/pages reflect Firestore truth
        try {
          localStorage.setItem(LOCAL_VIDEOS_KEY, JSON.stringify(remoteVideos));
        } catch (e) {
          console.warn('[videoService] Failed to sync localStorage:', e);
        }

        callback(remoteVideos);
      },
      (err) => {
        console.warn('[videoService] Failed to subscribe to all videos:', err.code, err.message);
        callback(getLocalVideos());
      }
    );
  },
};
