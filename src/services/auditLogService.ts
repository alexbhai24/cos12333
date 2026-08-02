import type { AuditLogEntry } from '../types/admin';

const STORAGE_KEY = 'cosmicbone_audit_logs';

const INITIAL_LOGS: AuditLogEntry[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    actor: 'Admin Owner (rajanandalex1@gmail.com)',
    actorRole: 'admin',
    targetUser: 'Rohan Gupta (rohan.g)',
    action: 'TEACHER_ACCESS_APPROVED',
    details: 'Approved Teacher Request for PGT Senior Secondary (Classes 11, 12 PCB/PCM)',
    status: 'success',
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    actor: 'System Auto Guard',
    actorRole: 'admin',
    targetUser: 'Guest Student',
    action: 'ROLE_UPDATE_BLOCKED',
    details: 'Blocked student frontend role mutation attempt. Teacher request required.',
    status: 'warning',
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    actor: 'Admin Owner (rajanandalex1@gmail.com)',
    actorRole: 'admin',
    targetUser: 'All Users',
    action: 'SYSTEM_ANNOUNCEMENT_CREATED',
    details: 'Broadcasted announcement: CosmicBone Portfolio Explorer & Teacher Verification System Live!',
    status: 'success',
  },
];

export const auditLogService = {
  getLogs: (): AuditLogEntry[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('[auditLogService] Error loading logs:', e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
  },

  logEvent: (
    actor: string,
    action: string,
    targetUser: string | undefined,
    details: string,
    status: 'success' | 'warning' | 'error' = 'success',
    actorRole: string = 'admin'
  ): AuditLogEntry => {
    const logs = auditLogService.getLogs();
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor,
      actorRole,
      targetUser: targetUser || 'N/A',
      action,
      details,
      status,
    };

    const updated = [newEntry, ...logs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  },
};
