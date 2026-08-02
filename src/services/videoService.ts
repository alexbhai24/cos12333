import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { UserProfileDoc } from '../types';

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

export const videoService = {
  /**
   * Subscribe to videos in real-time from Firestore, filtered by target grade.
   * Merges remote Firestore videos with local storage published videos.
   */
  subscribeVideosByGrade: (grade: string, callback: (videos: VideoDoc[]) => void): Unsubscribe => {
    const q = query(
      collection(db, 'videos'),
      where('status', '==', 'published'),
      where('targetGrades', 'array-contains', grade),
      orderBy('createdAt', 'desc')
    );

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
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
            status: data.status ?? 'published',
            subject: data.subject ?? 'General',
            targetGrades: data.targetGrades ?? [],
          } as VideoDoc;
        });

        // Merge with local published videos matching target grade
        const local = getLocalVideos().filter((lv) => lv.targetGrades.includes(grade));
        const combined = [...local];
        remoteVideos.forEach((rv) => {
          if (!combined.some((v) => v.id === rv.id || v.youtubeVideoId === rv.youtubeVideoId)) {
            combined.push(rv);
          }
        });

        callback(combined);
      },
      (err) => {
        console.warn('[videoService] Firestore snapshot notice:', err);
        // Fallback to local storage videos if Firestore subscription encounters rules block
        const local = getLocalVideos().filter((lv) => lv.targetGrades.includes(grade));
        callback(local);
      }
    );
  },

  /**
   * Safe video publishing. Extract YouTube ID, construct embed URLs, and save with 3-tier fallback.
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
      targetGrades: [video.targetGrade],
    };

    // Tier 1: Try Backend API (uses Firebase Admin SDK)
    if (auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch('http://localhost:3001/api/videos/publish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(video),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.id) {
            saveLocalVideo({ ...docData, id: data.id });
            return data.id;
          }
        }
      } catch (e) {
        console.warn('[videoService] Backend API publish notice:', e);
      }
    }

    // Tier 2: Try direct Cloud Firestore addDoc
    try {
      const docRef = await addDoc(collection(db, 'videos'), {
        ...docData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      saveLocalVideo({ ...docData, id: docRef.id });
      return docRef.id;
    } catch (fsErr: any) {
      console.warn('[videoService] Firestore direct write notice:', fsErr);
    }

    // Tier 3: Seamless Local Storage & Reactive UI Fallback
    saveLocalVideo(docData);
    return docData.id;
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
    const q = query(
      collection(db, 'videos'),
      orderBy('createdAt', 'desc')
    );
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
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
            status: data.status ?? 'published',
            subject: data.subject ?? 'General',
            targetGrades: data.targetGrades ?? [],
          } as VideoDoc;
        });

        // Always sync localStorage with Firestore to purge deleted videos across all browsers
        try {
          localStorage.setItem(LOCAL_VIDEOS_KEY, JSON.stringify(remoteVideos));
        } catch (e) {
          console.warn('[videoService] Failed to sync localStorage:', e);
        }

        callback(remoteVideos);
      },
      (err) => {
        console.warn('[videoService] Failed to subscribe to all videos:', err);
        callback(getLocalVideos());
      }
    );
  },
};
