export type QuestionType = 'mcq' | 'assertion_reason' | 'statement' | 'match';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'CHALLENGER';

export interface PracticeQuestion {
  id: string;
  chapterId: string;
  questionNumber: number;
  qType: QuestionType;
  difficulty: QuestionDifficulty;
  tag: string;
  questionText: string;
  statementA?: string;
  statementB?: string;
  assertion?: string;
  reason?: string;
  matchLeft?: [string, string, string, string];
  matchRight?: [string, string, string, string];
  options: [string, string, string, string];
  correctOptionIndex: number;
  explanation: string;
  hint?: string;
  pyqRef?: string;
}

export interface QuestionAnswerRecord {
  selectedOption: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface ChapterPracticeProgress {
  solvedCount: number;
  correctCount: number;
  isComplete?: boolean;
  answers: Record<string, QuestionAnswerRecord>;
}

export interface QuestionPracticeSubjectStats {
  totalQuestions: number;
  solvedQuestions: number;
  correctQuestions: number;
  completedChapters: number;
  totalChapters: number;
  accuracy: number;
  percentage: number;
}
