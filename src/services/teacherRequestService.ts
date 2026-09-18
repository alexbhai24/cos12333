import type { TeacherRequest } from '../types/admin';
import type { StableGrade, StableTeacherDesignation } from '../types';
import { auditLogService } from './auditLogService';

const STORAGE_KEY = 'cosmicbone_teacher_requests';

/** Map teacher designation to allowed target academic grades */
export function getPermittedGradesForDesignation(designation: StableTeacherDesignation | string): StableGrade[] {
  switch (designation) {
    case 'tgt_middle':
    case 'TGT Middle School':
      return ['class_6', 'class_7', 'class_8'];
    case 'tgt_high':
    case 'TGT High School':
      return ['class_9', 'class_10'];
    case 'pgt_senior':
    case 'PGT Senior Secondary':
      return ['pcb', 'pcm'];
    case 'faculty_entrance':
    case 'Entrance Faculty':
      return ['pcb', 'pcm', 'dropper', 'skill'];
    default:
      return ['class_9', 'class_10'];
  }
}

const INITIAL_REQUESTS: TeacherRequest[] = [
  {
    id: 'req-201',
    userId: 'user-rohan',
    fullName: 'Rohan Gupta',
    username: 'rohan.g',
    email: 'rohan.gupta@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    currentGrade: 'class_10',
    requestedDesignation: 'pgt_senior',
    requestedSubjects: ['Physics', 'Mathematics'],
    requestedGrades: ['pcm'],
    reason: 'I have conducted Physics 3D simulations and peer tutoring for Class 11-12 students. Requesting faculty access to publish video courses.',
    portfolioLink: 'https://cosmicbone.app/#portfolio?id=port-3',
    submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'pending',
  },
  {
    id: 'req-202',
    userId: 'user-ananya',
    fullName: 'Ananya Sharma',
    username: 'ananya.s',
    email: 'ananya.s@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    currentGrade: 'class_9',
    requestedDesignation: 'tgt_high',
    requestedSubjects: ['Science', 'Chemistry'],
    requestedGrades: ['class_9', 'class_10'],
    reason: 'Active student teaching assistant for Middle School & High School Science olympiads.',
    submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'pending',
  },
];

export const teacherRequestService = {
  getAllRequests: (): TeacherRequest[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('[teacherRequestService] Error reading requests:', e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
    return INITIAL_REQUESTS;
  },

  getPendingRequests: (): TeacherRequest[] => {
    return teacherRequestService.getAllRequests().filter(r => r.status === 'pending');
  },

  getUserRequest: (userId: string, email?: string): TeacherRequest | undefined => {
    const requests = teacherRequestService.getAllRequests();
    return requests.find(r => r.userId === userId || (email && r.email.toLowerCase() === email.toLowerCase()));
  },

  submitRequest: (requestData: Omit<TeacherRequest, 'id' | 'submittedAt' | 'status'>): TeacherRequest => {
    const requests = teacherRequestService.getAllRequests();
    
    // Check if pending request already exists
    const existing = requests.find(r => r.userId === requestData.userId && r.status === 'pending');
    if (existing) {
      throw new Error('You already have a pending teacher access request. Please wait for administrator review.');
    }

    const newRequest: TeacherRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    const updated = [newRequest, ...requests];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    auditLogService.logEvent(
      requestData.fullName || requestData.email,
      'TEACHER_REQUEST_SUBMITTED',
      requestData.fullName,
      `Submitted request for ${requestData.requestedDesignation} (${requestData.requestedSubjects.join(', ')})`,
      'success',
      'student'
    );

    return newRequest;
  },

  withdrawRequest: (requestId: string, userEmail: string): boolean => {
    const requests = teacherRequestService.getAllRequests();
    const target = requests.find(r => r.id === requestId);
    if (!target) return false;

    const updated = requests.filter(r => r.id !== requestId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    auditLogService.logEvent(
      userEmail,
      'TEACHER_REQUEST_WITHDRAWN',
      target.fullName,
      `Withdrew pending teacher access request (${target.requestedDesignation})`,
      'warning',
      'student'
    );

    return true;
  },

  approveRequest: (
    requestId: string,
    adminActor: string,
    confirmedDesignation: StableTeacherDesignation | string,
    reviewNotes?: string
  ): { success: boolean; request: TeacherRequest; permittedGrades: StableGrade[] } => {
    const requests = teacherRequestService.getAllRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) {
      throw new Error('Request not found');
    }

    const targetReq = requests[reqIndex];
    const permittedGrades = getPermittedGradesForDesignation(confirmedDesignation);

    const updatedReq: TeacherRequest = {
      ...targetReq,
      status: 'approved',
      requestedDesignation: confirmedDesignation,
      requestedGrades: permittedGrades,
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminActor,
      reviewNotes: reviewNotes || 'Teacher access granted by administrator.',
    };

    requests[reqIndex] = updatedReq;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));

    // Update cosmicbone_users in localStorage if present
    try {
      const usersStr = localStorage.getItem('cosmicbone_users');
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const userIdx = users.findIndex((u: any) => u.email.toLowerCase() === targetReq.email.toLowerCase() || u.name === targetReq.fullName);
        if (userIdx !== -1) {
          users[userIdx].role = 'Teacher';
          users[userIdx].userType = 'teacher';
          users[userIdx].teacherDesignation = confirmedDesignation;
          users[userIdx].permittedGrades = permittedGrades;
          localStorage.setItem('cosmicbone_users', JSON.stringify(users));
        }
      }
    } catch (e) {
      console.error('[teacherRequestService] Error updating local user profile:', e);
    }

    auditLogService.logEvent(
      adminActor,
      'TEACHER_ACCESS_APPROVED',
      targetReq.fullName,
      `Approved Teacher access. Assigned designation: ${confirmedDesignation}, permitted grades: ${permittedGrades.join(', ')}`,
      'success',
      'admin'
    );

    return { success: true, request: updatedReq, permittedGrades };
  },

  rejectRequest: (requestId: string, adminActor: string, reason: string): TeacherRequest => {
    const requests = teacherRequestService.getAllRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) {
      throw new Error('Request not found');
    }

    const targetReq = requests[reqIndex];
    const updatedReq: TeacherRequest = {
      ...targetReq,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminActor,
      reviewNotes: reason || 'Request rejected by administrator.',
    };

    requests[reqIndex] = updatedReq;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));

    auditLogService.logEvent(
      adminActor,
      'TEACHER_REQUEST_REJECTED',
      targetReq.fullName,
      `Rejected teacher access request. Reason: ${reason || 'Not specified'}`,
      'warning',
      'admin'
    );

    return updatedReq;
  },

  requestMoreInfo: (requestId: string, adminActor: string, message: string): TeacherRequest => {
    const requests = teacherRequestService.getAllRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) {
      throw new Error('Request not found');
    }

    const targetReq = requests[reqIndex];
    const updatedReq: TeacherRequest = {
      ...targetReq,
      status: 'more_info_requested',
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminActor,
      reviewNotes: message,
    };

    requests[reqIndex] = updatedReq;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));

    auditLogService.logEvent(
      adminActor,
      'TEACHER_REQUEST_INFO_ASKED',
      targetReq.fullName,
      `Requested additional information: "${message}"`,
      'warning',
      'admin'
    );

    return updatedReq;
  },
};
