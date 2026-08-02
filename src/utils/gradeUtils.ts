import type { UserProfile } from '../types';

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

export const GRADE_LABELS: Record<string, string> = {
  class_6: 'Class 6',
  'class-6': 'Class 6',
  class_7: 'Class 7',
  'class-7': 'Class 7',
  class_8: 'Class 8',
  'class-8': 'Class 8',
  class_9: 'Class 9',
  'class-9': 'Class 9',
  class_10: 'Class 10',
  'class-10': 'Class 10',
  pcb: 'PCB',
  pcm: 'PCM',
  skill: 'Skill',
  dropper: 'Business',
};

export const TEACHER_DESIGNATIONS: Record<StableTeacherDesignation, { label: string; allowedGrades: StableGrade[]; desc: string }> = {
  tgt_middle: {
    label: 'TGT (Middle School)',
    allowedGrades: ['class_6', 'class_7', 'class_8'],
    desc: 'Teaches Classes 6th, 7th & 8th',
  },
  tgt_high: {
    label: 'TGT (High School)',
    allowedGrades: ['class_9', 'class_10'],
    desc: 'Teaches Classes 9th & 10th',
  },
  pgt_senior: {
    label: 'PGT (PCB/PCM)',
    allowedGrades: ['pcb', 'pcm'],
    desc: 'Teaches PCB & PCM Sections',
  },
  faculty_entrance: {
    label: 'Faculty (Business/Skill)',
    allowedGrades: ['skill', 'dropper'],
    desc: 'Teaches Skill & Business Students',
  },
  admin: {
    label: 'Admin (All Access)',
    allowedGrades: ['class_6', 'class_7', 'class_8', 'class_9', 'class_10', 'pcb', 'pcm', 'skill', 'dropper'],
    desc: 'Access & Upload for All Grades',
  },
};

export const normalizeGrade = (g?: string): StableGrade => {
  if (!g) return 'pcb';
  const norm = g.replace('-', '_').toLowerCase();
  if (norm in GRADE_LABELS) return norm as StableGrade;
  return 'pcb';
};

export const getGradeLabel = (g?: string): string => {
  if (!g) return 'PCB';
  const norm = normalizeGrade(g);
  return GRADE_LABELS[norm] || 'PCB';
};

export const normalizeDesignation = (d?: string): StableTeacherDesignation => {
  if (!d) return 'tgt_middle';
  if (d === 'tgt-middle' || d === 'tgt_middle') return 'tgt_middle';
  if (d === 'tgt-high' || d === 'tgt_high') return 'tgt_high';
  if (d === 'pgt-senior' || d === 'pgt_senior') return 'pgt_senior';
  if (d === 'faculty_entrance' || d === 'faculty-entrance') return 'faculty_entrance';
  if (d === 'admin') return 'admin';
  return 'tgt_middle';
};

export const getTeacherAllowedGrades = (designation?: string, isAdmin?: boolean): StableGrade[] => {
  if (isAdmin) return ['class_6', 'class_7', 'class_8', 'class_9', 'class_10', 'pcb', 'pcm', 'skill', 'dropper'];
  const norm = normalizeDesignation(designation);
  return TEACHER_DESIGNATIONS[norm]?.allowedGrades || ['class_6', 'class_7', 'class_8'];
};

export const isGradeAllowedForTeacher = (grade: string, designation?: string, isAdmin?: boolean): boolean => {
  if (isAdmin) return true;
  const allowed = getTeacherAllowedGrades(designation, isAdmin);
  const normG = normalizeGrade(grade);
  return allowed.includes(normG);
};

export const getSubjectsForGrade = (grade?: string): string[] => {
  const norm = normalizeGrade(grade);
  switch (norm) {
    case 'class_6':
    case 'class_7':
    case 'class_8':
    case 'class_9':
    case 'class_10':
      return ['Science', 'Maths', 'Social Science', 'English'];
    case 'pcb':
      return ['Phy', 'Chem', 'Bio', 'English'];
    case 'pcm':
      return ['Phy', 'Chem', 'Maths'];
    case 'skill':
    case 'dropper':
      return ['AI/ML', 'UI/UX', 'Social Media', 'Marketing'];
    default:
      return ['Science', 'Maths', 'Social Science', 'English'];
  }
};


export const getUserGradeOrDesignationBadge = (userObj: Partial<UserProfile>): string => {
  if (userObj.isAdmin) return 'Owner Admin 👑';
  if (userObj.userType === 'teacher' || userObj.role === 'Teacher') {
    const des = normalizeDesignation(userObj.teacherDesignation);
    return TEACHER_DESIGNATIONS[des]?.label || 'Teacher 🎓';
  }
  return `${getGradeLabel(userObj.gradeLevel)} Student 🎒`;
};
