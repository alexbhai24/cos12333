export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' | string;

export interface SyllabusTopic {
  id: string;
  title: string;
}

export interface SyllabusChapter {
  id: string;
  title: string;
  topics: SyllabusTopic[];
  officialWeightage: string | null;
  pyqPriority: PriorityLevel;
  pyqAnalysisMessage?: string;
  aiPriorityEstimate?: string;
}

export interface SyllabusSubject {
  id: string;
  name: string;
  chapters: SyllabusChapter[];
}

export type Subject = SyllabusSubject;

export interface SyllabusData {
  id: string; // Unique ID like cbse_12_commerce
  examOrBoard: string; // 'CBSE', 'ICSE', 'UP Board', 'NEET', 'JEE'
  category: 'School' | 'Special';
  classGrade?: string; // '6', '7', '8', '9', '10', '11', '12'
  stream?: string; // 'PCB', 'PCM', 'Commerce', 'Arts' - Only for 11 & 12
  academicSession: string;
  sourceUrl: string;
  verificationDate: string;
  subjects: SyllabusSubject[];
}

// User Progress Types (Stored in LocalStorage)
export interface TopicProgress {
  [topicId: string]: boolean;
}

export interface ChapterProgress {
  completedTopics: number;
  totalTopics: number;
  percentage: number;
  isCompleted: boolean;
}

export interface SubjectProgress {
  completedTopics: number;
  totalTopics: number;
  percentage: number;
}

export interface OverallProgress {
  [examId: string]: {
    topicState: TopicProgress; // Flat map of topicId -> boolean
    lastUpdated: number;
  };
}
