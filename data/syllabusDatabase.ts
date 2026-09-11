import { SyllabusData } from '../types/syllabus';
import { syllabusNEET } from './syllabusNEET';
import { syllabusJEE } from './syllabusJEE';
import { syllabusJEEAdv } from './syllabusJEEAdv';
import { syllabusCBSE10 } from './syllabusCBSE10';
import { syllabusCBSE12Commerce } from './syllabusCBSE12Commerce';
import { syllabusCBSE12PCM } from './syllabusCBSE12PCM';
import { syllabusCBSE12PCB } from './syllabusCBSE12PCB';
import { syllabusCBSE12Arts } from './syllabusCBSE12Arts';
import { syllabusICSE10 } from './syllabusICSE10';
import { syllabusUP10 } from './syllabusUP10';
import { syllabusUP12PCM, syllabusUP12PCB } from './syllabusUP12';
import { syllabusCBSE6 } from './syllabusCBSE6';
import { syllabusCBSE7 } from './syllabusCBSE7';
import { syllabusCBSE8 } from './syllabusCBSE8';
import { syllabusCBSE9 } from './syllabusCBSE9';
import { syllabusCBSE11PCB } from './syllabusCBSE11PCB';
import { syllabusCBSE11PCM } from './syllabusCBSE11PCM';
import { syllabusCBSE11Commerce } from './syllabusCBSE11Commerce';
import { syllabusCBSE11Arts } from './syllabusCBSE11Arts';
import { syllabusUP6 } from './syllabusUP6';
import { syllabusUP7 } from './syllabusUP7';
import { syllabusUP8 } from './syllabusUP8';
import { syllabusUP9 } from './syllabusUP9';
import { syllabusUP11PCM, syllabusUP11PCB, syllabusUP11Commerce, syllabusUP11Arts } from './syllabusUP11';
import { syllabusUP12Commerce, syllabusUP12Arts } from './syllabusUP12';
import { syllabusISC11PCM, syllabusISC11PCB, syllabusISC11Commerce, syllabusISC11Arts } from './syllabusISC11';
import { syllabusISC12PCM, syllabusISC12PCB, syllabusISC12Commerce, syllabusISC12Arts } from './syllabusISC12';
import { syllabusICSE6 } from './syllabusICSE6';
import { syllabusICSE7 } from './syllabusICSE7';
import { syllabusICSE8 } from './syllabusICSE8';
import { syllabusICSE9 } from './syllabusICSE9';

export const syllabusDatabase: Record<string, SyllabusData> = {
  // Special Exams
  'neet': syllabusNEET,
  'jee': syllabusJEE,
  'jee_adv': syllabusJEEAdv,

  // CBSE
  'cbse_6': syllabusCBSE6,
  'cbse_7': syllabusCBSE7,
  'cbse_8': syllabusCBSE8,
  'cbse_9': syllabusCBSE9,
  'cbse_10': syllabusCBSE10,
  'cbse_11_pcm': syllabusCBSE11PCM,
  'cbse_11_pcb': syllabusCBSE11PCB,
  'cbse_11_commerce': syllabusCBSE11Commerce,
  'cbse_11_arts': syllabusCBSE11Arts,
  'cbse_12_pcm': syllabusCBSE12PCM,
  'cbse_12_pcb': syllabusCBSE12PCB,
  'cbse_12_commerce': syllabusCBSE12Commerce,
  'cbse_12_arts': syllabusCBSE12Arts,

  // ICSE (Class 6 - 10) & ISC (Class 11 - 12) - CISCE Council
  'icse_6': syllabusICSE6,
  'icse_7': syllabusICSE7,
  'icse_8': syllabusICSE8,
  'icse_9': syllabusICSE9,
  'icse_10': syllabusICSE10,
  'isc_11_pcm': syllabusISC11PCM,
  'isc_11_pcb': syllabusISC11PCB,
  'isc_11_commerce': syllabusISC11Commerce,
  'isc_11_arts': syllabusISC11Arts,
  'isc_12_pcm': syllabusISC12PCM,
  'isc_12_pcb': syllabusISC12PCB,
  'isc_12_commerce': syllabusISC12Commerce,
  'isc_12_arts': syllabusISC12Arts,

  // Fallback aliases so both prefixes resolve seamlessly across all classes
  'isc_6': syllabusICSE6,
  'isc_7': syllabusICSE7,
  'isc_8': syllabusICSE8,
  'isc_9': syllabusICSE9,
  'isc_10': syllabusICSE10,
  'icse_11_pcm': syllabusISC11PCM,
  'icse_11_pcb': syllabusISC11PCB,
  'icse_11_commerce': syllabusISC11Commerce,
  'icse_11_arts': syllabusISC11Arts,
  'icse_12_pcm': syllabusISC12PCM,
  'icse_12_pcb': syllabusISC12PCB,
  'icse_12_commerce': syllabusISC12Commerce,
  'icse_12_arts': syllabusISC12Arts,

  // UP Board
  'up_board_6': syllabusUP6,
  'up_board_7': syllabusUP7,
  'up_board_8': syllabusUP8,
  'up_board_9': syllabusUP9,
  'up_board_10': syllabusUP10,
  'up_board_11_pcm': syllabusUP11PCM,
  'up_board_11_pcb': syllabusUP11PCB,
  'up_board_11_commerce': syllabusUP11Commerce,
  'up_board_11_arts': syllabusUP11Arts,
  'up_board_12_pcm': syllabusUP12PCM,
  'up_board_12_pcb': syllabusUP12PCB,
  'up_board_12_commerce': syllabusUP12Commerce,
  'up_board_12_arts': syllabusUP12Arts,
};

export const getSchoolBoards = () => ['CBSE', 'ICSE / ISC', 'UP Board'];
export const getClasses = () => ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
export const getStreams = () => ['PCB', 'PCM', 'Commerce', 'Arts'];
export const getSpecialExams = () => [
  { id: 'neet', name: 'NEET (UG)' },
  { id: 'jee', name: 'JEE Main' },
  { id: 'jee_adv', name: 'JEE Advanced' }
];

// Resolves the correct syllabus based on cascading filters
export const resolveSyllabusId = (
  mode: 'School' | 'Special',
  specialId: string,
  board: string,
  classGrade: string,
  stream: string
): string | null => {
  if (mode === 'Special') {
    return specialId;
  }

  const formattedClass = classGrade.replace('Class ', '').trim();
  const formattedStream = stream.toLowerCase().trim();
  const isSenior = ['11', '12'].includes(formattedClass);

  // Check if board is ICSE / ISC or any CISCE variant
  const isCISCE = /icse|isc/i.test(board);

  if (isCISCE) {
    if (isSenior) {
      // Classes 11 and 12 under CISCE are ISC
      const id = `isc_${formattedClass}_${formattedStream}`;
      if (syllabusDatabase[id]) return id;
    } else {
      // Classes 6 to 10 under CISCE are ICSE
      const id = `icse_${formattedClass}`;
      if (syllabusDatabase[id]) return id;
    }
  }

  // Standard lookup for other boards (e.g. CBSE, UP Board)
  const formattedBoard = board.toLowerCase().replace(/\s+/g, '_');
  let id = `${formattedBoard}_${formattedClass}`;

  if (isSenior) {
    id += `_${formattedStream}`;
  }

  // Check if we have data for this exact combination
  if (syllabusDatabase[id]) {
    return id;
  }

  return null;
};

export const getSyllabusData = (id: string | null): SyllabusData | null => {
  if (!id) return null;
  return syllabusDatabase[id] || null;
};
