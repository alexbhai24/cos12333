export type CustomTestDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'STANDARD';

export interface CustomTestQuestionRef {
  id: string; // ID of the created question
  marksCorrect: number; // e.g. 4
  marksIncorrect: number; // e.g. -1
}

export interface CustomTestSubjectBreakdown {
  subject: string;
  questions: number;
  marks: number;
}

export interface CustomTest {
  id: string;
  title: string;
  exam: 'neet' | 'jee';
  category?: 'unit-test' | 'nbt' | 'full-mock' | string;
  durationMins: number;
  totalMarks: number;
  syllabusSummary: string;
  difficulty: CustomTestDifficulty;
  questions: CustomTestQuestionRef[];
  createdAt: number;
  createdBy: string;
  status: 'draft' | 'published';
  
  // Custom Card Properties
  subtitle?: string;
  watermarkText?: string;
  themeColor?: 'indigo' | 'rose' | 'emerald' | 'amber' | 'slate';
  maxCoins?: number;
  
  // Custom Syllabus Breakdown
  subjectBreakdown?: CustomTestSubjectBreakdown[];
}
