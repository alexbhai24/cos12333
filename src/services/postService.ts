import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  deleteDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Post, PostComment } from '../types';

const POSTS_COL = 'posts';

/** Convert Firestore doc → Post shape */
function docToPost(id: string, data: Record<string, any>): Post {
  return {
    id,
    authorId:     data.authorId     ?? '',
    authorName:   data.authorName   ?? 'Anonymous',
    authorAvatar: data.authorAvatar ?? 'gradient:astronaut',
    authorRole:   data.authorRole   ?? 'Member',
    title:        data.title        ?? '',
    content:      data.content      ?? '',
    category:     data.category     ?? 'Study Tip',
    tags:         data.tags         ?? [],
    likes:        data.likedBy?.length ?? data.likes ?? 0,
    comments:     data.commentsCount  ?? 0,
    commentsCount:data.commentsCount  ?? 0,
    shares:       data.shares         ?? 0,
    userLiked:    false, // resolved per-user in AppContext
    commentsList: data.commentsList   ?? [],
    isPinned:     data.isPinned       ?? false,
    mediaUrl:     data.mediaUrl,
    likedBy:      data.likedBy        ?? [],
    timeAgo:      data.createdAt instanceof Timestamp
      ? formatTimeAgo(data.createdAt.toDate())
      : 'Just now',
  };
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60)  return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export const postService = {
  /**
   * Subscribe to real-time post updates from Firestore.
   * Returns an unsubscribe function — call it on component unmount.
   */
  subscribe(onChange: (posts: Post[]) => void): Unsubscribe {
    const q = query(collection(db, POSTS_COL), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(d => docToPost(d.id, d.data() as Record<string, any>));
      onChange(posts);
    }, (err) => {
      console.error('[postService] Firestore subscription error:', err);
    });
  },

  /** Create a new post. Requires the caller to be authenticated. */
  async createPost(newPost: {
    authorId: string;
    authorName: string;
    authorAvatar: string;
    authorRole: string;
    title: string;
    content: string;
    category: Post['category'];
    tags: string[];
    mediaUrl?: string;
  }): Promise<string> {
    const ref = await addDoc(collection(db, POSTS_COL), {
      ...newPost,
      likes:         0,
      commentsCount: 0,
      shares:        0,
      likedBy:       [],
      commentsList:  [],
      isPinned:      false,
      createdAt:     serverTimestamp(),
    });
    return ref.id;
  },

  /** Delete a post. Requires the caller to be authenticated and author of the post. */
  async deletePost(postId: string): Promise<void> {
    try {
      const ref = doc(db, POSTS_COL, postId);
      await deleteDoc(ref);
    } catch (e) {
      console.warn('Failed to delete from Firestore, might be offline/local fallback', e);
    }
  },

  /** Toggle like — adds/removes uid from likedBy array. */
  async toggleLike(postId: string, uid: string, currentlyLiked: boolean): Promise<void> {
    const ref = doc(db, POSTS_COL, postId);
    await updateDoc(ref, {
      likedBy: currentlyLiked ? arrayRemove(uid) : arrayUnion(uid),
    });
  },

  /** Append a comment to a post's commentsList. */
  async addComment(postId: string, comment: PostComment): Promise<void> {
    const ref = doc(db, POSTS_COL, postId);
    await updateDoc(ref, {
      commentsList:  arrayUnion(comment),
      commentsCount: increment(1),
    });
  },
};
