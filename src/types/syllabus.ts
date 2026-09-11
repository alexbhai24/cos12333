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
export type Chapter = SyllabusChapter;
export type Topic = SyllabusTopic;

export interface SyllabusData {
  id: string;
  examOrBoard: string;
  category: 'School' | 'Special';
  classGrade?: string;
  stream?: string;
  academicSession: string;
  sourceUrl: string;
  verificationDate: string;
  subjects: SyllabusSubject[];
}

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
    topicState: TopicProgress;
    lastUpdated: number;
  };
}
