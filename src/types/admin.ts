import type { StableGrade, StableTeacherDesignation, UserRole } from './index';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'more_info_requested';

export interface TeacherRequest {
  id: string;
  userId: string;
  fullName: string;
  username: string;
  email: string;
  photoUrl: string;
  currentGrade: StableGrade | string;
  requestedDesignation: StableTeacherDesignation | string;
  requestedSubjects: string[];
  requestedGrades: StableGrade[];
  reason: string;
  portfolioLink?: string;
  submittedAt: string;
  status: RequestStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole | string;
  targetUser?: string;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  message: string;
  targetAudience: 'all' | 'students' | 'teachers';
  createdAt: string;
  createdBy: string;
}
