export type FlashcardType = 
  | 'FORMULA' 
  | 'CONCEPT' 
  | 'PYQ_TRAP' 
  | 'DEFINITION' 
  | 'REACTION' 
  | 'MNEMONIC';

export type CardMasteryStatus = 'unseen' | 'review' | 'mastered';

export interface FlashcardItem {
  id: string;
  type: FlashcardType;
  question: string;          // Prompt / Question / Formula query
  answer: string;            // Detailed answer / Explanation
  formula?: string;          // Optional highlighted formula
  keyTakeaway?: string;      // Exam tip / PYQ alert / mnemonic
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  pyqFrequency?: string;     // e.g. "Asked in NEET 2024, 2022" or "JEE Main 2024 Hot"
}

export interface ChapterFlashcardDeck {
  chapterId: string;
  chapterTitle: string;
  subjectName: string;
  exam: 'NEET' | 'JEE';
  cards: FlashcardItem[];
}

export type FlashcardProgressMap = Record<string, CardMasteryStatus>;
