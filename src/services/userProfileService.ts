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
 * Called on every login/signup. Creates or fetches the users/{uid} Firestore document
 * so profiles persist across all mobile devices and browsers.
 */
export async function ensureProfile(): Promise<UserProfileDoc> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const isFixedAdmin = user.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com';

  // 1. Fetch from Firestore first so profiles sync across all devices & browsers
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfileDoc;
      if (isFixedAdmin) data.role = 'admin';

      const storedKey = `cosmicbone_profile_${user.uid}`;
      localStorage.setItem(storedKey, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('[userProfileService] Firestore read failed during ensureProfile:', err);
  }

  // 2. Check localStorage fallback if offline
  const storedKey = `cosmicbone_profile_${user.uid}`;
  const oldKey = `cosmicbone_profile_${user.email?.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  
  const stored = localStorage.getItem(storedKey) || localStorage.getItem(oldKey);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (isFixedAdmin) parsed.role = 'admin';
      
      // If we found the old key but no Firestore doc, let's push this data to Firestore!
      try {
        const mergedProfile = { ...parsed, uid: user.uid, email: user.email };
        await setDoc(doc(db, 'users', user.uid), mergedProfile, { merge: true });
      } catch (err) {
        console.warn('Failed to upload migrated profile to Firestore', err);
      }
      
      return parsed;
    } catch (e) {}
  }

  // 3. Document doesn't exist yet -> Create in Firestore
  const fallbackProfile: UserProfileDoc = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    photoURL: user.photoURL || '',
    role: isFixedAdmin ? 'admin' : 'student',
    setupComplete: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'users', user.uid), fallbackProfile, { merge: true });
  } catch (err) {
    console.warn('[userProfileService] Failed to write initial profile to Firestore:', err);
  }

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
