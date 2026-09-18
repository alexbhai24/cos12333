import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProfileDoc } from '../types';

export interface FileDoc {
  id: string;
  title: string;
  description: string;
  contentType: 'document' | 'book';
  targetGrade: string;
  status: 'draft' | 'published';
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  fileUrl: string;
  fileName: string;
  fileMimeType: string;
  fileSize: string;
  thumbnail: string;
  subject: string;
  views: number;
  createdAt: any;
  updatedAt: any;
}

export const fileService = {
  /**
   * Subscribe to files (Documents & Books) in real-time from Firestore content collection.
   */
  subscribeFiles: (callback: (files: FileDoc[]) => void): Unsubscribe => {
    const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const files: FileDoc[] = snapshot.docs
          .map((d) => {
            const data = d.data();
            // Filter to only include documents and books
            if (data.contentType !== 'document' && data.contentType !== 'book') {
              return null;
            }
            return {
              id: d.id,
              title: data.title ?? '',
              description: data.description ?? '',
              contentType: data.contentType,
              targetGrade: data.targetGrade ?? 'pcb',
              status: data.status ?? 'published',
              authorId: data.authorId ?? '',
              authorName: data.authorName ?? 'Admin Owner',
              authorRole: data.authorRole ?? 'Admin',
              authorAvatar: data.authorAvatar ?? 'gradient:cyberpunk',
              fileUrl: data.fileUrl ?? '',
              fileName: data.fileName ?? '',
              fileMimeType: data.fileMimeType ?? '',
              fileSize: data.fileSize ?? '',
              thumbnail: data.thumbnail ?? '',
              subject: data.subject ?? 'General',
              views: data.views ?? 0,
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as FileDoc;
          })
          .filter(Boolean) as FileDoc[];

        callback(files);
      },
      (err) => {
        console.error('[fileService] Failed to load files:', err);
      }
    );
  },

  /**
   * Create a new file (document / book) in Firestore content collection.
   */
  createFile: async (
    fileData: {
      title: string;
      description: string;
      contentType: 'document' | 'book';
      subject: string;
      targetGrade: string;
      fileUrl: string;
      fileName?: string;
      fileMimeType?: string;
      fileSize?: string;
      thumbnail?: string;
    },
    userProfile: UserProfileDoc
  ): Promise<string> => {
    const now = serverTimestamp();
    const docData = {
      title: fileData.title.trim(),
      description: fileData.description.trim(),
      contentType: fileData.contentType,
      targetGrade: fileData.targetGrade,
      status: 'published',
      authorId: userProfile.uid,
      authorName: userProfile.displayName || 'Admin Owner',
      authorRole: 'Admin Owner 👑',
      authorAvatar: userProfile.photoURL || 'gradient:cyberpunk',
      fileUrl: fileData.fileUrl.trim(),
      fileName: fileData.fileName?.trim() || '',
      fileMimeType: fileData.fileMimeType?.trim() || '',
      fileSize: fileData.fileSize?.trim() || '',
      thumbnail: fileData.thumbnail?.trim() || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
      subject: fileData.subject,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'content'), docData);
    return docRef.id;
  },

  /**
   * Toggle Publish/Draft status of a file.
   */
  togglePublishStatus: async (fileId: string, currentStatus: 'draft' | 'published'): Promise<void> => {
    const ref = doc(db, 'content', fileId);
    await updateDoc(ref, {
      status: currentStatus === 'published' ? 'draft' : 'published',
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Delete a file from Firestore.
   */
  deleteFile: async (fileId: string): Promise<void> => {
    const ref = doc(db, 'content', fileId);
    await deleteDoc(ref);
  },
};
