
import { auth } from '../firebase';
import type { UserProfileDoc } from '../types';

const API_BASE = 'http://localhost:3001';

async function getIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

export interface AdminMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  totalPublishedVideos: number;
  totalDocuments: number;
  totalBatches: number;
  totalTests: number;
  publicPostsToday: number;
  activeStudyRooms: number;
}

export const adminService = {
  /**
   * Fetch all user profiles from the server (admin-only).
   */
  getAllUsers: async (): Promise<UserProfileDoc[]> => {
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
  },

  /**
   * Request a role update for a user (admin-only).
   * Server validates: cannot change admin account, role must be student/teacher.
   */
  requestRoleUpdate: async (userEmail: string, newRole: string): Promise<boolean> => {
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE}/api/admin/update-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail, role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      return true;
    } catch (err: any) {
      console.error('[Admin Service] Failed to update role:', err);
      throw err;
    }
  },

  /**
   * Toggle a user's account status (admin-only).
   */
  toggleAccountStatus: async (userEmail: string, currentStatus: string): Promise<boolean> => {
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE}/api/admin/toggle-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail, currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      return true;
    } catch (err: any) {
      console.error('[Admin Service] Failed to toggle account status:', err);
      throw err;
    }
  },

  /**
   * Add apples to a user's account (admin-only).
   */
  addApplesToUser: async (userEmail: string, amount: number): Promise<boolean> => {
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_BASE}/api/admin/add-apples`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      return true;
    } catch (err: any) {
      console.error('[Admin Service] Failed to add apples:', err);
      throw err;
    }
  },

  /**
   * Get admin metrics — computed from Firestore user data.
   */
  getAdminMetrics: async (): Promise<AdminMetrics> => {
    try {
      const users = await adminService.getAllUsers();

      let totalStudents = 0;
      let totalTeachers = 0;
      let totalAdmins = 0;

      users.forEach(u => {
        if (u.role === 'admin') totalAdmins++;
        else if (u.role === 'teacher') totalTeachers++;
        else totalStudents++;
      });

      return {
        totalStudents,
        totalTeachers,
        totalAdmins,
        totalPublishedVideos: 0,
        totalDocuments: 0,
        totalBatches: 0,
        totalTests: 0,
        publicPostsToday: 0,
        activeStudyRooms: 0,
      };
    } catch {
      // Fallback: return zeros if API fails
      return {
        totalStudents: 0,
        totalTeachers: 0,
        totalAdmins: 0,
        totalPublishedVideos: 0,
        totalDocuments: 0,
        totalBatches: 0,
        totalTests: 0,
        publicPostsToday: 0,
        activeStudyRooms: 0,
      };
    }
  },
};
