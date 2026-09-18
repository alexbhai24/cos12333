import { syllabusNEET } from '../syllabusNEET';
import { SyllabusChapter, SyllabusTopic } from '../../types/syllabus';

export interface ReadingTopic extends SyllabusTopic {
  chapterId: string;
  classNum: 11 | 12;
}

export interface ReadingChapter {
  id: string;
  title: string;
  classNum: 11 | 12;
  officialWeightage: string;
  pyqPriority: 'HIGH' | 'MEDIUM' | 'LOW';
  topics: ReadingTopic[];
}

// Extract NEET Biology chapters from syllabusNEET
const neetBiology = syllabusNEET.subjects.find(s => s.id === 'neet_biology');
const allBioChapters: SyllabusChapter[] = neetBiology?.chapters || [];

// Class 11 Biology chapters: nb1 to nb22
export const class11BioChapters: ReadingChapter[] = allBioChapters
  .filter(ch => {
    const num = parseInt(ch.id.replace(/\D/g, ''), 10);
    return num >= 1 && num <= 22;
  })
  .map(ch => ({
    id: ch.id,
    title: ch.title,
    classNum: 11,
    officialWeightage: ch.officialWeightage || '10 Marks',
    pyqPriority: (ch.pyqPriority as 'HIGH' | 'MEDIUM' | 'LOW') || 'HIGH',
    topics: (ch.topics || []).map(t => ({
      ...t,
      chapterId: ch.id,
      classNum: 11,
    })),
  }));

// Class 12 Biology chapters: nb23 to nb38
export const class12BioChapters: ReadingChapter[] = allBioChapters
  .filter(ch => {
    const num = parseInt(ch.id.replace(/\D/g, ''), 10);
    return num >= 23;
  })
  .map(ch => ({
    id: ch.id,
    title: ch.title,
    classNum: 12,
    officialWeightage: ch.officialWeightage || '12 Marks',
    pyqPriority: (ch.pyqPriority as 'HIGH' | 'MEDIUM' | 'LOW') || 'HIGH',
    topics: (ch.topics || []).map(t => ({
      ...t,
      chapterId: ch.id,
      classNum: 12,
    })),
  }));

export const getAllBioChapters = (): ReadingChapter[] => [
  ...class11BioChapters,
  ...class12BioChapters,
];

export const getBioChapterById = (id: string): ReadingChapter | undefined => {
  return getAllBioChapters().find(c => c.id === id);
};
