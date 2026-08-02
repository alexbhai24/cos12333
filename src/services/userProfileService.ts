import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { UserProfileDoc } from '../types';

const API_BASE = 'http://localhost:3001';

/**
 * Get the current user's ID token for authenticated API calls.
 */
async function getIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

/**
 * Called on every login/signup. Creates the users/{uid} Firestore document
 * if it doesn't exist via the server endpoint, which also sets Auth custom claims.
 */
export async function ensureProfile(): Promise<UserProfileDoc> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const isFixedAdmin = user.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com';

  try {
    const token = await getIdToken();
    const res = await fetch(`${API_BASE}/api/auth/ensure-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json();
      if (data.created) {
        await auth.currentUser?.getIdToken(true);
      }
      return data.profile as UserProfileDoc;
    }
  } catch (err) {
    console.warn('[userProfileService] API ensure-profile offline, using local profile fallback.');
  }

  // Graceful local profile fallback when standalone auth server is unreached
  const storedKey = `cosmicbone_profile_${user.uid}`;
  const stored = localStorage.getItem(storedKey);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (isFixedAdmin) parsed.role = 'admin';
      return parsed;
    } catch (e) {}
  }

  const fallbackProfile: UserProfileDoc = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    photoURL: user.photoURL || '',
    role: isFixedAdmin ? 'admin' : 'student',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(storedKey, JSON.stringify(fallbackProfile));
  return fallbackProfile;
}

/**
 * Read a user profile directly from Firestore (for the current user).
 */
export async function getProfile(uid: string): Promise<UserProfileDoc | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfileDoc;
}

/**
 * Update (or create) the current user's profile in Firestore.
 * Uses setDoc with merge:true so it works even when the document doesn’t exist yet.
 * Protected fields (role, uid, email, createdAt) are blocked by Firestore security rules.
 */
export async function updateProfile(
  uid: string,
  data: Partial<UserProfileDoc>
): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

/**
 * Admin-only: list all user profiles from the server.
 */
export async function listAllUsers(): Promise<UserProfileDoc[]> {
  const token = await getIdToken();
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${res.status}`);
  }

  const data = await res.json();
  return data.users as UserProfileDoc[];
}
