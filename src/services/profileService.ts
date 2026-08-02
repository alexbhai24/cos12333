import type { UserProfile } from '../types';
import { normalizeGrade, normalizeDesignation, getTeacherAllowedGrades } from '../utils/gradeUtils';
import { auth } from '../firebase';

const PROFILE_KEY = 'cosmicbone_user_profile';
const SAVED_ITEMS_KEY = 'cosmicbone_saved_items';

const DEFAULT_PROFILE: UserProfile = {
  name: 'New Student',
  firstName: 'New',
  lastName: 'Student',
  username: 'new_student',
  email: '',
  initials: 'NS',
  role: 'Student',
  userType: 'student',
  gradeLevel: 'pcb' as any, // default to PCB
  teacherDesignation: '' as any,
  apples: 100,
  streak: 3,
  streakFreezes: 1,
  photoUrl: 'gradient:astronaut',
  decoration: 'none',
  isAdmin: false,
  setupComplete: false,
  gender: 'male',
  savedItemIds: [],
  streakHistory: ['2026-07-28', '2026-07-27', '2026-07-25', '2026-07-24'],
  frozenDates: ['2026-07-26'],
};

const getProfileKey = () => {
  const email = auth.currentUser?.email;
  if (email) {
    return `${PROFILE_KEY}_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  }
  return `${PROFILE_KEY}_default`;
};

const getSavedItemsKey = () => {
  const email = auth.currentUser?.email;
  if (email) {
    return `${SAVED_ITEMS_KEY}_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  }
  return `${SAVED_ITEMS_KEY}_default`;
};

export function deriveUsernameFromEmail(email: string): string {
  if (!email) return 'cosmic_user';
  const prefix = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
  return prefix || 'cosmic_user';
}

export function deriveDefaultNames(email: string, displayName?: string, current?: Partial<UserProfile>) {
  const emailLower = (email || '').toLowerCase().trim();
  const prefix = emailLower ? emailLower.split('@')[0].replace(/[^a-z0-9_]/g, '') : '';
  const cleanPrefix = prefix ? prefix.charAt(0).toUpperCase() + prefix.slice(1) : 'Cosmic';

  let firstName = current?.firstName || '';
  let lastName = current?.lastName || '';

  if (!firstName || firstName === 'New') {
    if (displayName && displayName !== 'New Student' && displayName !== 'Owner Admin') {
      firstName = displayName.trim().split(' ')[0] || cleanPrefix;
    } else {
      firstName = cleanPrefix;
    }
  }

  if (!lastName || lastName === 'Student') {
    if (displayName && displayName.trim().includes(' ')) {
      lastName = displayName.trim().split(' ').slice(1).join(' ');
    } else {
      lastName = 'Voyager';
    }
  }

  let username = current?.username || '';
  if (!username || username === 'new_student' || username === 'newstudent') {
    username = deriveUsernameFromEmail(emailLower);
  }

  const name = current?.name && current.name !== 'New Student' ? current.name : `${firstName} ${lastName}`.trim();
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'CV';

  return { firstName, lastName, username, name, initials };
}

export const profileService = {
  getProfile: (): UserProfile => {
    try {
      const key = getProfileKey();
      const stored = localStorage.getItem(key);
      const authUser = auth.currentUser;
      const emailLower = (authUser?.email || '').toLowerCase().trim();

      if (stored) {
        const parsed = JSON.parse(stored);
        const targetEmail = (parsed.email || emailLower).toLowerCase().trim();
        const isOwner = targetEmail === 'rajanandalex1@gmail.com';
        
        const googleName = authUser?.displayName;
        const defaults = deriveDefaultNames(targetEmail, googleName || undefined, parsed);
        parsed.firstName = parsed.firstName || defaults.firstName;
        parsed.lastName = parsed.lastName || defaults.lastName;
        parsed.username = defaults.username;
        parsed.name = parsed.name && parsed.name !== 'New Student' ? parsed.name : (googleName || defaults.name);
        parsed.initials = defaults.initials;

        if (isOwner) {
          parsed.isAdmin = true;
          parsed.userType = 'teacher';
          parsed.role = 'Owner Admin 👑';
        }
        parsed.gradeLevel = normalizeGrade(parsed.gradeLevel);
        return parsed;
      }
    } catch (e) {
      console.error('Error loading profile from localStorage:', e);
    }

    // Return a default profile with email and derived defaults
    const defaultProfile = { ...DEFAULT_PROFILE };
    const authUser = auth.currentUser;
    const emailLower = (authUser?.email || '').toLowerCase().trim();
    const isOwner = emailLower === 'rajanandalex1@gmail.com';
    const googleName = authUser?.displayName;
    const defaults = deriveDefaultNames(emailLower, googleName || undefined, defaultProfile);

    defaultProfile.email = authUser?.email || '';
    defaultProfile.firstName = googleName ? (googleName.split(' ')[0] || 'Cosmic') : defaults.firstName;
    defaultProfile.lastName = googleName ? (googleName.split(' ').slice(1).join(' ') || 'Voyager') : defaults.lastName;
    defaultProfile.username = defaults.username;
    defaultProfile.name = googleName || (isOwner ? 'Owner Admin' : defaults.name);
    defaultProfile.initials = defaults.initials;
    defaultProfile.photoUrl = authUser?.photoURL || 'gradient:astronaut';

    if (isOwner) {
      defaultProfile.isAdmin = true;
      defaultProfile.userType = 'teacher';
      defaultProfile.role = 'Owner Admin 👑';
    }

    try {
      const key = getProfileKey();
      localStorage.setItem(key, JSON.stringify(defaultProfile));
    } catch (e) {
      console.error('Error auto-saving initial profile:', e);
    }

    return defaultProfile;
  },

  saveProfile: (profile: Partial<UserProfile>): UserProfile => {
    const current = profileService.getProfile();
    const targetEmail = profile.email || current.email || auth.currentUser?.email || '';
    const isOwnerAdmin = targetEmail.toLowerCase() === 'rajanandalex1@gmail.com';
    
    const defaults = deriveDefaultNames(targetEmail, auth.currentUser?.displayName || undefined, {
      ...current,
      ...profile,
    });

    const first = profile.firstName || defaults.firstName;
    const last = profile.lastName || defaults.lastName;
    const finalName = profile.name || `${first} ${last}`.trim();

    const updated: UserProfile = {
      ...current,
      ...profile,
      email: targetEmail,
      firstName: first,
      lastName: last,
      name: finalName,
      initials: defaults.initials,
      isAdmin: isOwnerAdmin,
      gradeLevel: normalizeGrade(profile.gradeLevel || current.gradeLevel),
      teacherDesignation: normalizeDesignation(profile.teacherDesignation || current.teacherDesignation) as any,
    };
    try {
      const key = getProfileKey();
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving profile to localStorage:', e);
    }
    return updated;
  },

  getSavedItemIds: (): string[] => {
    try {
      const key = getSavedItemsKey();
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading saved items:', e);
    }
    return ['v-1', 'd-1', 'b-1'];
  },

  toggleSaveItem: (itemId: string): boolean => {
    const saved = profileService.getSavedItemIds();
    let isSaved = false;
    let nextSaved: string[];
    if (saved.includes(itemId)) {
      nextSaved = saved.filter((id) => id !== itemId);
      isSaved = false;
    } else {
      nextSaved = [...saved, itemId];
      isSaved = true;
    }
    try {
      const key = getSavedItemsKey();
      localStorage.setItem(key, JSON.stringify(nextSaved));
    } catch (e) {
      console.error('Error updating saved items:', e);
    }
    return isSaved;
  },

  getTeacherGrades: (designation?: string, isAdmin?: boolean) => {
    return getTeacherAllowedGrades(designation, isAdmin);
  },
};
