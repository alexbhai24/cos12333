import React, { useRef } from 'react';
import Papa from 'papaparse';
import { Upload, Download, Sparkles } from 'lucide-react';
import { Question } from '../../pages/CreatorPage';

interface CsvUploaderProps {
  onUploadSuccess: (questions: Question[]) => void;
  onDirectCreateTest?: (questions: Question[], defaultTitle: string) => void;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onUploadSuccess, onDirectCreateTest }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadSample = () => {
    const sampleHeaders = [
      'exam', 'subject', 'chapter', 'chapterTitle', 'topic', 'topicTitle', 'subtopicTitle',
      'qType', 'source', 'difficulty', 'year', 'questionText', 'questionImageUrl',
      'optionA', 'optionA_image', 'optionB', 'optionB_image', 'optionC', 'optionC_image', 'optionD', 'optionD_image',
      'correctOption', 'statementA', 'statementB',
      'matchLeftA', 'matchLeftB', 'matchLeftC', 'matchLeftD',
      'matchRightP', 'matchRightQ', 'matchRightR', 'matchRightS',
      'explanation', 'videoSolution', 'status'
    ];

    const sampleRows = [
      // Row 1: General MCQ
      [
        'neet', 'Biology', 'ch_cell', 'Cell: The Unit of Life', 'tp_organelles', 'Mitochondria', 'ATP Synthesis',
        'mcq', 'pyq', 'medium', 'NEET 2024', 'Which organelle is known as the powerhouse of the cell?', '',
        'Ribosome', '', 'Mitochondria', '', 'Lysosome', '', 'Golgi Apparatus', '',
        'B', '', '',
        '', '', '', '',
        '', '', '', '',
        'Mitochondria produce ATP through cellular respiration, making them the powerhouse of the cell.', '', 'published'
      ],
      // Row 2: Image Question
      [
        'neet', 'Physics', 'ch_mech', 'Laws of Motion', 'tp_friction', 'Incline Friction', 'Free Body Diagram',
        'image', 'question-practice', 'hard', 'NEET 2023', 'Identify the correct free-body diagram for the block on an inclined plane:', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop',
        'Diagram A', '', 'Diagram B', '', 'Diagram C', '', 'Diagram D', '',
        'A', '', '',
        '', '', '', '',
        '', '', '', '',
        'The normal force acts perpendicular to the surface and gravity acts downwards.', '', 'published'
      ],
      // Row 3: Assertion & Reason
      [
        'neet', 'Biology', 'ch_genetics', 'Principles of Inheritance', 'tp_mendel', 'Mendel Laws', '',
        'assertion', 'pyq', 'hard', 'NEET 2022', '', '',
        '', '', '', '', '', '', '', '',
        'A', 'Assertion (A): Human skin color is a polygenic trait.', 'Reason (R): Polygenic traits are controlled by three or more genes.',
        '', '', '', '',
        '', '', '', '',
        'Both A and R are correct, and R explains A because multiple genes (A, B, C) contribute to skin pigmentation.', '', 'published'
      ],
      // Row 4: Statement Based
      [
        'jee', 'Chemistry', 'ch_chem_bond', 'Chemical Bonding', 'tp_vsepr', 'VSEPR Theory', '',
        'statement', 'mock-test', 'medium', 'JEE Main 2024', '', '',
        '', '', '', '', '', '', '', '',
        'C', 'Statement 1: Water molecule has a bent shape due to two lone pairs on oxygen.', 'Statement 2: Ammonia molecule is trigonal pyramidal with one lone pair on nitrogen.',
        '', '', '', '',
        '', '', '', '',
        'Both statements are correct according to VSEPR theory.', '', 'published'
      ],
      // Row 5: Match the Following
      [
        'neet', 'Botany', 'ch_plant_physio', 'Photosynthesis', 'tp_pigments', 'Chloroplast Pigments', '',
        'match', 'chapter-test', 'medium', 'NEET 2021', 'Match Column-I with Column-II correctly:', '',
        '', '', '', '', '', '', '', '',
        'A', '', '',
        'Chlorophyll a', 'Chlorophyll b', 'Carotenoids', 'Xanthophylls',
        'Bright green', 'Yellow green', 'Yellow to yellow-orange', 'Yellow color',
        'Chlorophyll a is bright green, b is yellow green, carotenoids are yellow-orange.', '', 'published'
      ]
    ];

    const csvContent = [sampleHeaders.join(','), ...sampleRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'cosmic_question_bank_sample_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processCsvFile = (e: React.ChangeEvent<HTMLInputElement>, isDirectTest = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const testTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data as any[];
        
        const newQuestions: Question[] = parsedData.map((row, index) => {
          const qType = (['mcq', 'image', 'match', 'assertion', 'statement', 'graphical'].includes(row.qType?.toLowerCase())
            ? row.qType.toLowerCase()
            : (row.questionImageUrl || row.image) ? 'image' : 'mcq') as any;

          const rawCorrect = (row.correctOption || row.correctIndex || row.answer || 'A').toString().trim().toUpperCase();
          let correctIndex = 0;
          if (['A', 'B', 'C', 'D'].includes(rawCorrect)) {
            correctIndex = ['A', 'B', 'C', 'D'].indexOf(rawCorrect);
          } else if (['0', '1', '2', '3'].includes(rawCorrect)) {
            correctIndex = parseInt(rawCorrect, 10);
          }

          let matchLeft: [string, string, string, string] = [
            row.matchLeftA || row.leftA || '',
            row.matchLeftB || row.leftB || '',
            row.matchLeftC || row.leftC || '',
            row.matchLeftD || row.leftD || ''
          ];
          if (row.matchLeft && typeof row.matchLeft === 'string') {
            const parts = row.matchLeft.split(/[|;]/).map(s => s.trim());
            matchLeft = [parts[0]||'', parts[1]||'', parts[2]||'', parts[3]||''];
          }

          let matchRight: [string, string, string, string] = [
            row.matchRightP || row.rightP || row.matchRightA || '',
            row.matchRightQ || row.rightQ || row.matchRightB || '',
            row.matchRightR || row.rightR || row.matchRightC || '',
            row.matchRightS || row.rightS || row.matchRightD || ''
          ];
          if (row.matchRight && typeof row.matchRight === 'string') {
            const parts = row.matchRight.split(/[|;]/).map(s => s.trim());
            matchRight = [parts[0]||'', parts[1]||'', parts[2]||'', parts[3]||''];
          }

          // Use a very unique ID to prevent collisions even in the same millisecond batch
          const uniqueId = `q_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 7)}`;

          return {
            id: uniqueId,
            exam: (row.exam?.toLowerCase() === 'jee' ? 'jee' : 'neet') as 'neet' | 'jee',
            subjectId: row.subjectId || (row.subject?.toLowerCase().includes('bio') || row.subject?.toLowerCase().includes('bot') || row.subject?.toLowerCase().includes('zoo') ? 'sub-bot' : row.subject?.toLowerCase().includes('phy') ? 'sub-phy' : row.subject?.toLowerCase().includes('chem') ? 'sub-pc' : 'sub-math'),
            subjectName: row.subjectName || row.subject || 'Biology',
            chapterId: row.chapterId || row.chapter || 'ch_gen',
            chapterTitle: row.chapterTitle || row.chapter || 'General Chapter',
            topicId: row.topicId || row.topic || 'tp_gen',
            topicTitle: row.topicTitle || row.topic || 'General Topic',
            subtopicTitle: row.subtopicTitle || row.subtopic || '',
            qType,
            source: (['pyq', 'daily-practice', 'question-practice', 'mock-test', 'chapter-test'].includes(row.source?.toLowerCase()) ? row.source.toLowerCase() : 'pyq') as any,
            difficulty: (['easy', 'medium', 'hard'].includes(row.difficulty?.toLowerCase()) ? row.difficulty.toLowerCase() : 'medium') as any,
            year: row.year || 'NEET 2024',
            questionText: row.questionText || row.question || '',
            questionImageUrl: row.questionImageUrl || row.imageUrl || row.image || undefined,
            options: [
              { text: row.optionA || row.option1 || '', imageUrl: row.optionA_image || undefined },
              { text: row.optionB || row.option2 || '', imageUrl: row.optionB_image || undefined },
              { text: row.optionC || row.option3 || '', imageUrl: row.optionC_image || undefined },
              { text: row.optionD || row.option4 || '', imageUrl: row.optionD_image || undefined }
            ],
            correctIndex,
            statementA: row.statementA || row.assertion || row.statement1 || '',
            statementB: row.statementB || row.reason || row.statement2 || '',
            matchLeft,
            matchRight,
            matchMappings: [
              { left: 'A', right: 'P' },
              { left: 'B', right: 'Q' },
              { left: 'C', right: 'R' },
              { left: 'D', right: 'S' }
            ],
            explanation: row.explanation || row.solution || '',
            videoSolution: row.videoSolution || undefined,
            createdAt: new Date().toISOString(),
            status: row.status === 'published' ? 'published' : 'draft',
          } as Question;
        });

        if (newQuestions.length === 0) {
          alert('No valid questions found in CSV.');
          return;
        }

        if (isDirectTest && onDirectCreateTest) {
          onDirectCreateTest(newQuestions, testTitle);
        } else {
          onUploadSuccess(newQuestions);
          alert(`Successfully imported ${newQuestions.length} question(s)!`);
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
        if (directFileInputRef.current) directFileInputRef.current.value = '';
      },
      error: (error) => {
        console.error('Error parsing CSV', error);
        alert('Failed to parse CSV. Make sure it follows the template.');
      }
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Regular Import CSV Input */}
      <input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef} 
        onChange={(e) => processCsvFile(e, false)} 
        className="hidden" 
      />

      <button 
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-medium hover:bg-emerald-500/30 transition-colors cursor-pointer text-xs sm:text-sm"
        title="Upload CSV to import questions to question bank"
      >
        <Upload className="w-4 h-4" />
        <span>Import CSV</span>
      </button>

      <button
        onClick={handleDownloadSample}
        className="flex items-center gap-1.5 px-3 py-2 bg-white/5 text-white/70 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        title="Download sample CSV template with all question types"
      >
        <Download className="w-3.5 h-3.5 text-cyan-400" />
        <span>Sample Template</span>
      </button>
    </div>
  );
};
