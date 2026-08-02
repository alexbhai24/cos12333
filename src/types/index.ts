export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfileDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type Theme =
  | 'cosmic'
  | 'greenery'
  | 'beaches'
  | 'rose-pink'
  | 'dark-black'
  | 'purple-white';

export type BackgroundType =
  | 'lighthouse'
  | 'snowy-tree'
  | 'canyon-castle'
  | 'canyon-deck'
  | 'castle-boats'
  | 'village-boat';

export type PageRoute =
  | 'home'
  | 'videos'
  | 'posts'
  | 'documents'
  | 'books'
  | 'games'
  | 'tests'
  | 'ai-core'
  | 'portfolio'
  | 'my-classes'
  | 'batches'
  | 'power-batch'
  | 'test-series'
  | 'creator-studio'
  | 'study-rooms'
  | 'saved-videos'
  | 'focus-clock'
  | 'admin-dashboard'
  | 'admin-users'
  | 'teacher-console';

export type StableGrade =
  | 'class_6'
  | 'class_7'
  | 'class_8'
  | 'class_9'
  | 'class_10'
  | 'pcb'
  | 'pcm'
  | 'skill'
  | 'dropper';


export type StableTeacherDesignation =
  | 'tgt_middle'
  | 'tgt_high'
  | 'pgt_senior'
  | 'faculty_entrance'
  | 'admin';

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  role: string;
  apples: number;
  streak: number;
  streakFreezes: number;
  photoUrl?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  gender?: 'male' | 'female';
  userType?: 'student' | 'teacher';
  gradeLevel?: StableGrade | string;
  teacherDesignation?: StableTeacherDesignation | string;
  isAdmin?: boolean;
  setupComplete?: boolean;
  decoration?: 'orbit' | 'energy' | 'rings' | 'flame' | 'glitch' | 'shield' | 'supernova' | 'web' | 'none';
  streakHistory?: string[];
  frozenDates?: string[];
  claimedMilestones?: number[];
  savedItemIds?: string[];
  uid?: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: string;
  updatedAt?: string;
  socialInstagram?: string;
  socialTelegram?: string;
  profileDescription?: string;
  nameColor?: string;
  nameFont?: string;
  cardPhotoUrl?: string;
}

export interface ContentAttachment {
  name: string;
  url: string;
  type: string;
}

export interface ContentComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorGradeOrDesignation: string;
  showGender?: boolean;
  gender?: string;
  text: string;
  createdAt: string;
  authorId?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  targetGrades: string[];
  contentType: 'video' | 'document' | 'book' | 'batch' | 'test_series' | 'test';
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  createdAt: string;
  thumbnail?: string;
  videoUrl?: string;
  embedCode?: string;
  googleFormUrl?: string;
  duration?: string;
  fileType?: string;
  fileSize?: string;
  fileMimeType?: string;
  fileName?: string;
  fileUrl?: string;
  format?: string;
  pages?: number;
  readingProgress?: number;
  lastReadChapter?: string;
  category?: string;
  author?: string;
  uploadDate?: string;
  schedule?: string;
  instructor?: string;
  studentsEnrolled?: number;
  seatCount?: number;
  enrolled?: boolean;
  difficulty?: string;
  durationMinutes?: number;
  questionsCount?: number;
  totalMarks?: number;
  appleReward?: number;
  attemptsCount?: number;
  views?: number;
  tags?: string[];
  status: 'published' | 'draft';
  attachments?: ContentAttachment[];
  comments?: ContentComment[];
  authorId?: string;
  defaultPageNo?: number;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'quiz' | 'reading';
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  studentsCount?: number;
  enrolledCount: number;
  reviewCount: number;
  instructor?: string;
  progress: number;
  thumbnail?: string;
  modules: CourseModule[];
}

export type DocumentItem = ContentItem;
export type BookItem = ContentItem;
export type Book = ContentItem;
export type TestSeriesItem = ContentItem;
export type TestItem = ContentItem;
export type VideoItem = ContentItem;
export type VideoLecture = ContentItem;
export type BatchItem = ContentItem;

export interface SubjectClass {
  id: string;
  name?: string;
  title?: string;
  code: string;
  teacher?: string;
  schedule?: string;
  room?: string;
  color?: string;
  totalStudents?: number;
  nextClass?: string;
  status?: string;
  category?: string;
  completedLessons?: number;
  totalLessons?: number;
  progress?: number;
  iconGradient?: string;
}

export interface StudyRoom {
  id: string;
  name: string;
  description: string;
  allowedGrades: string[];
  allowedDesignations?: string[];
  group: string;
  icon: string;
  memberCount: number;
  onlineCount: number;
  isPrivate?: boolean;
  grade?: string;
  topic?: string;
  activeMembersCount?: number;
  teacherModerator?: string;
}

export interface RoomMessage {
  id: string;
  roomId: string;
  authorName: string;
  authorRole: string;
  authorBadge: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  attachments?: any[];
}

export interface PostComment {
  id: string;
  author?: string;
  authorName?: string;
  authorAvatar?: string;
  authorGradeOrDesignation?: string;
  content: string;
  timeAgo: string;
}

export interface Post {
  id: string;
  authorId?: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  category: 'Announcement' | 'Study Tip' | 'Question' | 'Project';
  timeAgo: string;
  title?: string;
  content: string;
  likes: number;
  shares?: number;
  isPinned?: boolean;
  commentsCount?: number;
  commentsList?: PostComment[];
  comments?: PostComment[] | number;
  mediaUrl?: string;
  userLiked?: boolean;
  likedBy?: string[];
  tags?: string[];
  createdAt?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedFollowups?: string[];
}
