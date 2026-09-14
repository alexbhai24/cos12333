export type SubjectKey = 'physics' | 'chemistry' | 'biology' | 'mathematics';

export interface DailyQuestion {
  id: string;
  subject: SubjectKey;
  questionText: string;
  questionImageUrl?: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
  videoSolutionUrl?: string;
  topic?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface UserDailyAnswerState {
  subject: SubjectKey;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  completedAt?: string;
}
