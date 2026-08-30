import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type {
  Theme,
  BackgroundType,
  PageRoute,
  UserProfile,
  Post,
  ContentItem,
  StudyRoom,
  RoomMessage,
} from '../types';
import { useAuth } from './AuthContext';
import { profileService } from '../services/profileService';
import { contentService } from '../services/contentService';
import { postService } from '../services/postService';
import { roomService } from '../services/roomService';
import { uploadService } from '../services/uploadService';
import { normalizeGrade } from '../utils/gradeUtils';
import { auth } from '../firebase';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { updateProfile as updateFirestoreProfile } from '../services/userProfileService';
import { focusClockService } from '../services/focusClockService';

interface AppContextType {
  currentRoute: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  background: BackgroundType;
  setBackground: (bg: BackgroundType) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserProfile;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  savedItemIds: string[];
  toggleSaveItem: (itemId: string) => void;
  buyStreakFreeze: () => boolean;
  posts: Post[];
  addPost: (title: string, content: string, category: Post['category'], tags: string[], mediaUrl?: string) => void;
  deletePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
  addCommentToPost: (postId: string, commentText: string) => void;
  contentItems: ContentItem[];
  refreshContent: () => void;
  addCommentToContent: (contentId: string, text: string) => void;
  createContentUpload: (data: Parameters<typeof uploadService.createUpload>[0]) => ContentItem;
  studyRooms: StudyRoom[];
  getRoomMessages: (roomId: string) => RoomMessage[];
  sendRoomMessage: (roomId: string, text: string, attachments?: { name: string; url: string }[]) => RoomMessage;
  deleteRoomMessage: (roomId: string, messageId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isBoneAIOpen: boolean;
  setIsBoneAIOpen: (open: boolean) => void;
  isBoneAIEnabled: boolean;
  setIsBoneAIEnabled: (enabled: boolean) => void;
  // Modals state
  activeVideoModal: ContentItem | null;
  setActiveVideoModal: (video: ContentItem | null) => void;
  activeDocModal: ContentItem | null;
  setActiveDocModal: (doc: ContentItem | null) => void;
  activeBookModal: ContentItem | null;
  setActiveBookModal: (book: ContentItem | null) => void;
  activeTestModal: ContentItem | null;
  setActiveTestModal: (test: ContentItem | null) => void;
  activeCommentsItem: ContentItem | null;
  setActiveCommentsItem: (item: ContentItem | null) => void;
  publicProfileUser: Partial<UserProfile> | null;
  setPublicProfileUser: (user: Partial<UserProfile> | null) => void;
  openPublicProfile: (userObj: Partial<UserProfile>) => void;
  completeTest: (testId: string, appleReward?: number) => void;
  claimDailyStreak: () => void;
  notificationMessage: string | null;
  showNotification: (msg: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isProfileSettingsOpen: boolean;
  setIsProfileSettingsOpen: (open: boolean) => void;
  isStreakDrawerOpen: boolean;
  setIsStreakDrawerOpen: (open: boolean) => void;
  isAppleShopOpen: boolean;
  setIsAppleShopOpen: (open: boolean) => void;
  isAdminConsoleOpen: boolean;
  setIsAdminConsoleOpen: (open: boolean) => void;
  changeUserRole: (email: string, newRole: string) => void;
  isSavedItemsOpen: boolean;
  setIsSavedItemsOpen: (open: boolean) => void;
  videoWatchProgress: number;
  setVideoWatchProgress: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRouteState] = useState<PageRoute>(() => {
    // 1. Check if there's a legacy hash URL
    const hash = window.location.hash.substring(1);
    if (hash) {
      const cleanHash = hash.split('?')[0] as PageRoute;
      return cleanHash;
    }
    // 2. Otherwise use path
    const path = window.location.pathname.substring(1).split('?')[0] as PageRoute;
    if (path) return path;
    return 'home';
  });

  const setCurrentRoute = (route: PageRoute) => {
    setCurrentRouteState(route);
    const path = route === 'home' ? '/' : `/${route}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path + window.location.search);
    }
  };

  useEffect(() => {
    // Clean up URL if we loaded via hash or if pathname is wrong
    const hash = window.location.hash.substring(1);
    const path = currentRoute === 'home' ? '/' : `/${currentRoute}`;
    if (hash || window.location.pathname !== path) {
      window.history.replaceState(null, '', path + window.location.search);
    }

    const handlePopState = () => {
      // Re-evaluate on back/forward buttons
      const hash = window.location.hash.substring(1);
      if (hash) {
        setCurrentRouteState(hash.split('?')[0] as PageRoute);
        return;
      }
      const path = window.location.pathname.substring(1).split('?')[0] as PageRoute;
      setCurrentRouteState(path || 'home');
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentRoute]);

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('cosmicbone_theme') as Theme) || 'dark-black';
  });

  const [background, setBackgroundState] = useState<BackgroundType>(() => {
    return (localStorage.getItem('cosmicbone_bg') as BackgroundType) || 'lighthouse';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const { currentUser, authLoading, pendingVerificationEmail, userRole, userProfile } = useAuth();

  const [user, setUser] = useState<UserProfile>(() => profileService.getProfile());
  const [selectedGrade, setSelectedGradeState] = useState<string>(() => normalizeGrade(user.gradeLevel));
  const [savedItemIds, setSavedItemIds] = useState<string[]>(() => profileService.getSavedItemIds());

  const [posts, setPosts] = useState<Post[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => contentService.getAllContent());

  useEffect(() => {
    contentService.registerListener(() => {
      setContentItems(contentService.getAllContent());
    });
  }, []);
  const [studyRooms] = useState<StudyRoom[]>(() => roomService.getAllRooms());

  const [isStreakDrawerOpen, setIsStreakDrawerOpen] = useState(false);
  const [isAppleShopOpen, setIsAppleShopOpen] = useState(false);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [videoWatchProgress, setVideoWatchProgress] = useState(0);

  const [activeVideoModal, setActiveVideoModal] = useState<ContentItem | null>(null);
  const [activeDocModal, setActiveDocModal] = useState<ContentItem | null>(null);
  const [activeBookModal, setActiveBookModal] = useState<ContentItem | null>(null);
  const [activeTestModal, setActiveTestModal] = useState<ContentItem | null>(null);
  const [activeCommentsItem, setActiveCommentsItem] = useState<ContentItem | null>(null);
  const [publicProfileUser, setPublicProfileUser] = useState<Partial<UserProfile> | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBoneAIOpen, setIsBoneAIOpen] = useState(false);
  const [isBoneAIEnabled, setIsBoneAIEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('cosmicbone_ai_enabled') !== 'false';
  });

  const [isSavedItemsOpen, setIsSavedItemsOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3500);
  };

  // Subscribe to Firestore posts in real-time
  useEffect(() => {
    const unsubscribe = postService.subscribe((firestorePosts) => {
      // Mark which posts the current user has liked
      const uid = currentUser?.uid;
      const enriched = firestorePosts.map(p => ({
        ...p,
        userLiked: uid ? ((p as any).likedBy ?? []).includes(uid) : false,
      }));
      setPosts(enriched);
    });
    return unsubscribe;
  }, [currentUser]);

  // Sync Focus Clock immediately
  useEffect(() => {
    focusClockService.setUserKey(currentUser?.uid || currentUser?.email || 'guest');
  }, [currentUser]);

  // Sync Firebase Auth user + Firestore userProfile into local UserProfile state
  useEffect(() => {
    if (authLoading) return;
    if (currentUser && !userProfile) return; // Wait for Firestore profile to load

    if (currentUser) {
      const email = currentUser.email?.toLowerCase().trim();
      const isFixedAdmin = email === 'rajanandalex1@gmail.com';
      const isAdmin = isFixedAdmin || userRole === 'admin';
      const userType = isAdmin ? 'teacher' : (userRole === 'teacher' ? 'teacher' : 'student');

      const currentProfile = profileService.getProfile();
      const fp = userProfile;

      const mergedData: Partial<UserProfile> = {
        name: fp?.displayName || fp?.name || currentProfile.name || currentUser.displayName || undefined,
        firstName: fp?.firstName || currentProfile.firstName,
        lastName: fp?.lastName || currentProfile.lastName,
        username: fp?.username || currentProfile.username,
        email: currentUser.email || currentProfile.email,
        photoUrl: fp?.photoUrl || fp?.photoURL || currentProfile.photoUrl || currentUser.photoURL || 'gradient:astronaut',
        gender: (fp?.gender as any) || currentProfile.gender,
        gradeLevel: (fp?.gradeLevel as any) || currentProfile.gradeLevel,
        teacherDesignation: (fp?.teacherDesignation as any) || currentProfile.teacherDesignation,
        decoration: (fp?.decoration as any) || currentProfile.decoration,
        setupComplete: fp?.setupComplete ?? currentProfile.setupComplete,
        apples: fp?.apples ?? currentProfile.apples,
        streak: fp?.streak ?? currentProfile.streak,
        streakFreezes: fp?.streakFreezes ?? currentProfile.streakFreezes,
        streakHistory: fp?.streakHistory || currentProfile.streakHistory,
        frozenDates: fp?.frozenDates || currentProfile.frozenDates,
        isAdmin,
        userType,
      };

      // Perform Duolingo Streak Auto-Freeze Protection on startup/load
      const todayStr = getLocalDayString();
      const history = mergedData.streakHistory || [];
      const frozen = mergedData.frozenDates || [];
      const activeAndFrozenDates = [...history, ...frozen].sort();

      if (activeAndFrozenDates.length > 0) {
        const lastDateStr = activeAndFrozenDates[activeAndFrozenDates.length - 1];
        const diffDays = getDayDifference(lastDateStr, todayStr);

        if (diffDays > 1) {
          // Missed day(s) since last activity/freeze!
          const missedDays = diffDays - 1;
          let availableFreezes = mergedData.streakFreezes ?? 0;
          let newFrozen = [...frozen];
          let newFreezes = availableFreezes;

          if (availableFreezes >= missedDays) {
            // Protected by freeze
            newFreezes -= missedDays;
            for (let i = 1; i <= missedDays; i++) {
              const [y, m, d] = lastDateStr.split('-').map(Number);
              const missedDate = new Date(y, m - 1, d + i);
              const frozenStr = getLocalDayString(missedDate);
              if (!newFrozen.includes(frozenStr)) {
                newFrozen.push(frozenStr);
              }
            }
            mergedData.streakFreezes = newFreezes;
            mergedData.frozenDates = newFrozen;
            setTimeout(() => {
              showNotification(`❄️ Streak protected! Auto-used ${missedDays} Streak Freeze${missedDays > 1 ? 's' : ''}!`);
            }, 1000);
          } else {
            // No freezes -> streak breaks (resets to 0)
            setTimeout(() => {
              showNotification('💔 Streak reset to 0 days. Complete a task today to start a new streak!');
            }, 1000);
          }
        }
      }

      // Calculate streak dynamically based on final updated history and frozen dates!
      const calculatedStreak = calculateStreak(mergedData.streakHistory || [], mergedData.frozenDates || []);
      const streakUpdated = calculatedStreak !== mergedData.streak;
      mergedData.streak = calculatedStreak;

      const updated = profileService.saveProfile(mergedData);
      setUser(updated);
      setSelectedGradeState(normalizeGrade(updated.gradeLevel));

      // Sync backend Firestore database if a discrepancy is found
      if (streakUpdated && auth.currentUser) {
        updateFirestoreProfile(auth.currentUser.uid, {
          streak: calculatedStreak
        }).catch(err => console.error('[AppContext] Failed to sync streak to Firestore:', err));
      }
    }
  }, [currentUser, userRole, userProfile]);

  const getLocalDayString = (d: Date = new Date()): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const getDayDifference = (dateStrA: string, dateStrB: string): number => {
    try {
      const [y1, m1, d1] = dateStrA.split('-').map(Number);
      const [y2, m2, d2] = dateStrB.split('-').map(Number);
      const utc1 = Date.UTC(y1, m1 - 1, d1);
      const utc2 = Date.UTC(y2, m2 - 1, d2);
      return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  const calculateStreak = (historyList: string[], frozenList: string[]): number => {
    if (!historyList || historyList.length === 0) return 0;

    const todayStr = getLocalDayString();
    const isVisitedOrFrozen = (dateStr: string) => historyList.includes(dateStr) || frozenList.includes(dateStr);

    // Check if today or yesterday is active/frozen. If neither, streak is 0.
    if (!isVisitedOrFrozen(todayStr)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getLocalDayString(yesterday);
      if (!isVisitedOrFrozen(yesterdayStr)) {
        return 0;
      }
    }

    // Find the starting date for tracing backwards
    let checkDate = new Date();
    let checkDateStr = getLocalDayString(checkDate);

    // If today is not active/frozen, we start tracing from yesterday
    if (!isVisitedOrFrozen(checkDateStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
      checkDateStr = getLocalDayString(checkDate);
    }

    let streakCount = 0;
    const visitedSet = new Set(historyList);
    const frozenSet = new Set(frozenList);

    while (true) {
      if (visitedSet.has(checkDateStr) || frozenSet.has(checkDateStr)) {
        streakCount++;
      } else {
        break; // chain broken
      }

      checkDate.setDate(checkDate.getDate() - 1);
      checkDateStr = getLocalDayString(checkDate);
    }

    return streakCount;
  };

  const claimDailyStreak = () => {
    if (!user || !user.email) return;
    const todayStr = getLocalDayString();
    const history = user.streakHistory || [];
    const frozen = user.frozenDates || [];

    if (!history.includes(todayStr)) {
      let availableFreezes = user.streakFreezes || 0;
      let newFrozen = [...frozen];
      let newHistory = [...history, todayStr];

      // Calculate the new streak count dynamically from the updated history and frozen dates!
      const newStreak = calculateStreak(newHistory, newFrozen);

      showNotification(`🔥 Streak Active! You reached ${newStreak} Days!`);

      updateUserProfile({
        streak: newStreak,
        streakFreezes: availableFreezes,
        frozenDates: newFrozen,
        streakHistory: newHistory,
      });
    }
  };

  const setSelectedGrade = (grade: string) => {
    const norm = normalizeGrade(grade);
    setSelectedGradeState(norm);
    updateUserProfile({ gradeLevel: norm as any });
    showNotification(`Switched Academic Level to ${norm.toUpperCase().replace('_', ' ')} 🎒`);
  };

  const updateUserProfile = (newProfile: Partial<UserProfile>) => {
    const updated = profileService.saveProfile(newProfile);
    setUser(updated);
    if (newProfile.gradeLevel) {
      setSelectedGradeState(normalizeGrade(newProfile.gradeLevel));
    }

    // Sync to Firebase Auth and Firestore
    if (auth.currentUser) {
      const targetName = updated.name || `${updated.firstName || ''} ${updated.lastName || ''}`.trim();
      const targetPhoto = updated.photoUrl || '';
      const targetRole = (updated.isAdmin || updated.role?.toLowerCase().includes('admin'))
        ? 'admin'
        : (updated.role?.toLowerCase() === 'teacher' || updated.userType === 'teacher')
          ? 'teacher'
          : 'student';

      updateAuthProfile(auth.currentUser, {
        displayName: targetName,
        photoURL: targetPhoto,
      }).catch(err => console.error('[AppContext] Failed to update Auth profile:', err));

      updateFirestoreProfile(auth.currentUser.uid, {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email || updated.email,
        displayName: targetName,
        name: targetName,
        firstName: updated.firstName || '',
        lastName: updated.lastName || '',
        username: updated.username || '',
        photoURL: targetPhoto,
        photoUrl: targetPhoto,
        gender: updated.gender || 'male',
        userType: updated.userType || 'student',
        gradeLevel: updated.gradeLevel || 'pcb',
        teacherDesignation: updated.teacherDesignation || '',
        decoration: updated.decoration || 'none',
        setupComplete: updated.setupComplete ?? true,
        apples: updated.apples ?? 100,
        streak: updated.streak ?? 1,
        streakFreezes: updated.streakFreezes ?? 1,
        streakHistory: updated.streakHistory || [],
        frozenDates: updated.frozenDates || [],
        role: targetRole as any,
      }).catch(err => console.error('[AppContext] Failed to update Firestore profile:', err));
    }
  };

  const toggleSaveItem = (itemId: string) => {
    const isSaved = profileService.toggleSaveItem(itemId);
    setSavedItemIds(profileService.getSavedItemIds());
    if (isSaved) {
      showNotification('Saved to your Learning Library 🔖');
    } else {
      showNotification('Removed from Saved Items 🗑️');
    }
  };

  const refreshContent = () => {
    setContentItems(contentService.getAllContent());
  };

  const addCommentToContent = (contentId: string, text: string) => {
    if (!text.trim()) return;
    const comment = {
      id: `c-${Date.now()}`,
      authorName: user.name || user.firstName || 'Student Voyager',
      authorAvatar: user.photoUrl || 'gradient:astronaut',
      authorGradeOrDesignation: user.isAdmin
        ? 'Owner Admin 👑'
        : user.userType === 'teacher'
          ? 'Teacher 🎓'
          : `${normalizeGrade(user.gradeLevel).toUpperCase()} Student 🎒`,
      text,
      createdAt: 'Just now',
      authorId: auth.currentUser?.uid || user.uid,
    };
    contentService.addCommentToContent(contentId, comment).then((updatedItem) => {
      if (updatedItem) {
        refreshContent();
        if (activeCommentsItem?.id === contentId) {
          setActiveCommentsItem(updatedItem);
        }
        showNotification('Comment published! 💬');
      }
    });
  };

  const createContentUpload = (data: Parameters<typeof uploadService.createUpload>[0]) => {
    const newItem = uploadService.createUpload(data, user);
    refreshContent();
    showNotification(`Published ${data.contentType.toUpperCase()} to ${data.targetGrades.join(', ')} 🚀`);
    return newItem;
  };

  const addPost = (title: string, content: string, category: Post['category'], tags: string[], mediaUrl?: string) => {
    // If running without Firebase Auth, fallback to local user profile for authorId
    const authorId = currentUser?.uid || user?.email || `local-user-${Date.now()}`;

    const newPostObj: any = {
      authorId,
      title,
      content,
      category,
      tags,
      authorName: user.name || 'Student Voyager',
      authorAvatar: user.photoUrl || 'gradient:astronaut',
      authorRole: user.isAdmin ? 'Owner Admin 👑' : user.userType === 'teacher' ? 'Teacher 🎓' : `${normalizeGrade(user.gradeLevel).toUpperCase()} Student 🎒`,
    };
    if (mediaUrl) {
      newPostObj.mediaUrl = mediaUrl;
    }

    // Optimistic UI Update
    const optimisticPost: Post = {
      ...newPostObj,
      id: `local-${Date.now()}`,
      likes: 0,
      comments: 0,
      commentsCount: 0,
      shares: 0,
      userLiked: false,
      commentsList: [],
      isPinned: false,
      likedBy: [],
      timeAgo: 'Just now',
    };
    setPosts((prev) => [optimisticPost, ...prev]);

    postService.createPost(newPostObj).then(() => {
      showNotification('Post published to public academic feed! 📢');
    }).catch((err) => {
      console.warn('[addPost] Firestore failed (running offline mode)', err);
      showNotification('Post published locally! 📢');
    });
  };

  const deletePost = (postId: string) => {
    // Optimistic UI update
    setPosts(prev => prev.filter(p => p.id !== postId));
    postService.deletePost(postId).then(() => {
      showNotification('Post deleted 🗑️');
    }).catch(err => {
      console.error('[deletePost]', err);
    });
  };

  const toggleLikePost = (postId: string) => {
    if (!currentUser) {
      showNotification('Sign in to like posts 🔒');
      return;
    }
    const post = posts.find(p => p.id === postId);
    postService.toggleLike(postId, currentUser.uid, post?.userLiked ?? false)
      .catch(err => console.error('[toggleLikePost]', err));
  };

  const addCommentToPost = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    if (!currentUser) {
      showNotification('Sign in to comment 🔒');
      return;
    }
    postService.addComment(postId, {
      id: `c-${Date.now()}`,
      authorName: user.name || 'Student Voyager',
      authorAvatar: user.photoUrl || 'gradient:astronaut',
      timeAgo: 'Just now',
      content: commentText,
    }).then(() => {
      showNotification('Comment added to post! 💬');
    }).catch(err => console.error('[addCommentToPost]', err));
  };

  const getRoomMessages = (roomId: string) => {
    return roomService.getRoomMessages(roomId);
  };

  const sendRoomMessage = (roomId: string, text: string, attachments?: { name: string; url: string }[]) => {
    return roomService.sendMessage(roomId, text, user, attachments);
  };

  const deleteRoomMessage = (roomId: string, messageId: string) => {
    roomService.deleteRoomMessage(roomId, messageId);
  };

  const openPublicProfile = (userObj: Partial<UserProfile>) => {
    setPublicProfileUser(userObj);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('cosmicbone_theme', newTheme);
    showNotification(`Theme updated to ${newTheme.toUpperCase().replace('-', ' ')}`);
  };

  const setBackground = (newBg: BackgroundType) => {
    setBackgroundState(newBg);
    localStorage.setItem('cosmicbone_bg', newBg);
    showNotification(`Background updated to ${newBg.replace('-', ' ').toUpperCase()}`);
  };

  const setIsBoneAIEnabled = (enabled: boolean) => {
    setIsBoneAIEnabledState(enabled);
    localStorage.setItem('cosmicbone_ai_enabled', enabled ? 'true' : 'false');
    showNotification(enabled ? 'Bone AI Enabled 🤖' : 'Bone AI Disabled 🚫');
  };

  useEffect(() => {
    document.documentElement.classList.remove(
      'theme-cosmic',
      'theme-greenery',
      'theme-beaches',
      'theme-sky',
      'theme-rose-pink',
      'theme-dark-black',
      'theme-purple-white',
      'theme-white'
    );
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const buyStreakFreeze = (): boolean => {
    if (user.apples >= 100) {
      updateUserProfile({
        apples: user.apples - 100,
        streakFreezes: (user.streakFreezes || 0) + 1,
      });
      showNotification('Successfully acquired 1 Streak Freeze! ❄️');
      return true;
    } else {
      showNotification('Not enough Green Apples! You need 100 🍏 to buy a freeze.');
      return false;
    }
  };

  const completeTest = (testId: string, appleReward?: number) => {
    claimDailyStreak();

    // Get current completed test IDs from user state and localStorage cache
    let storedCompleted: string[] = [];
    try {
      const raw = localStorage.getItem('cosmicbone_completed_tests');
      if (raw) storedCompleted = JSON.parse(raw);
    } catch (e) { }

    const alreadyCompleted =
      Boolean(testId && user.completedTestIds && user.completedTestIds.includes(testId)) ||
      Boolean(testId && storedCompleted.includes(testId));

    if (alreadyCompleted) {
      showNotification('Test submitted! (One-time 🍏 Apple reward already claimed previously)');
      return;
    }

    const rewardAmount = typeof appleReward === 'number' && appleReward > 0 ? appleReward : 25;
    const updatedCompleted = testId
      ? Array.from(new Set([...(user.completedTestIds || []), ...storedCompleted, testId]))
      : (user.completedTestIds || []);

    try {
      localStorage.setItem('cosmicbone_completed_tests', JSON.stringify(updatedCompleted));
    } catch (e) { }

    updateUserProfile({
      apples: (user.apples || 0) + rewardAmount,
      completedTestIds: updatedCompleted,
    });

    showNotification(`🎉 Test completed! Alloted +${rewardAmount} Green Apples 🍏 (One-time Reward)`);
  };

  const changeUserRole = (email: string, newRole: string) => {
    showNotification(`User ${email} role set to ${newRole}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        theme,
        setTheme,
        background,
        setBackground,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileDrawerOpen,
        setMobileDrawerOpen,
        user,
        selectedGrade,
        setSelectedGrade,
        savedItemIds,
        toggleSaveItem,
        buyStreakFreeze,
        posts,
        addPost,
        deletePost,
        toggleLikePost,
        addCommentToPost,
        contentItems,
        refreshContent,
        addCommentToContent,
        createContentUpload,
        studyRooms,
        getRoomMessages,
        sendRoomMessage,
        deleteRoomMessage,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isBoneAIOpen,
        setIsBoneAIOpen,
        isBoneAIEnabled,
        setIsBoneAIEnabled,
        activeVideoModal,
        setActiveVideoModal,
        activeDocModal,
        setActiveDocModal,
        activeBookModal,
        setActiveBookModal,
        activeTestModal,
        setActiveTestModal,
        activeCommentsItem,
        setActiveCommentsItem,
        publicProfileUser,
        setPublicProfileUser,
        openPublicProfile,
        completeTest,
        claimDailyStreak,
        notificationMessage,
        showNotification,
        updateUserProfile,
        isProfileSettingsOpen,
        setIsProfileSettingsOpen,
        isStreakDrawerOpen,
        setIsStreakDrawerOpen,
        isAppleShopOpen,
        setIsAppleShopOpen,
        isAdminConsoleOpen,
        setIsAdminConsoleOpen,
        changeUserRole,
        isSavedItemsOpen,
        setIsSavedItemsOpen,
        videoWatchProgress,
        setVideoWatchProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
