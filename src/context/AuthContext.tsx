import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User
} from 'firebase/auth';
import { auth } from '../firebase';
import { ensureProfile } from '../services/userProfileService';
import type { UserProfileDoc, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  authLoading: boolean;
  /** The Firestore-backed user profile with server-assigned role */
  userProfile: UserProfileDoc | null;
  /** Convenience accessor: the user's server-assigned role */
  userRole: UserRole | null;
  /** Set while waiting for the user to verify their email. Cleared when they click "Login". */
  pendingVerificationEmail: string | null;
  clearPendingVerification: () => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileDoc | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user && user.emailVerified) {
        const isFixedAdmin = user.email?.toLowerCase().trim() === 'rajanandalex1@gmail.com';

        try {
          // Ensure Firestore profile exists and get role from server
          const profile = await ensureProfile();
          setUserProfile(profile);
          setUserRole(isFixedAdmin ? 'admin' : profile.role);
        } catch (err) {
          console.error('[AuthContext] Failed to ensure profile:', err);
          if (isFixedAdmin) {
            setUserRole('admin');
            setUserProfile({
              uid: user.uid,
              email: user.email || 'rajanandalex1@gmail.com',
              displayName: user.displayName || 'Owner Admin',
              photoURL: user.photoURL || '',
              role: 'admin',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          } else {
            setUserProfile(null);
            setUserRole('student');
          }
        }
      } else {
        setUserProfile(null);
        setUserRole(null);
      }

      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  /**
   * Sign in with email + password.
   * If the account exists but email is NOT yet verified:
   *   - Sign the user back out immediately
   *   - Set pendingVerificationEmail so the verification screen renders
   */
  const login = async (email: string, password: string): Promise<void> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      await signOut(auth);
      setPendingVerificationEmail(email);
      throw new Error('email-not-verified');
    }
  };

  /**
   * Create account, send verification email, then sign out immediately.
   * The user must verify before they can log in.
   */
  const signup = async (email: string, password: string): Promise<void> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);
    await signOut(auth); // Don't let them in yet
    setPendingVerificationEmail(email);
  };

  /** Google Sign-In via popup. Google accounts are always verified — goes straight to dashboard. */
  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
    // onAuthStateChanged fires automatically → profile ensured → dashboard renders
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setPendingVerificationEmail(null);
    setUserProfile(null);
    setUserRole(null);
  };

  /** Called when user clicks "Login" on the verification screen */
  const clearPendingVerification = () => setPendingVerificationEmail(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        userProfile,
        userRole,
        pendingVerificationEmail,
        clearPendingVerification,
        login,
        loginWithGoogle,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
