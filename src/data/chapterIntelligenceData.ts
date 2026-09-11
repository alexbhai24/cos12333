import { SyllabusChapter } from '../types/syllabus';

export interface QuestionBreakdown {
  type: string;
  marks: string;
  expectedCount: string;
}

export interface FormulaItem {
  name: string;
  formula: string;
  explanation?: string;
}

export interface ChapterIntelligence {
  summary: string;
  keyHighlights: string[];
  markingScheme: {
    totalMarksEstimate: string;
    questionTypes: QuestionBreakdown[];
    examTips: string;
  };
  hasFormulas: boolean;
  formulas?: FormulaItem[];
  corePrinciples?: string[];
}

// Curated intelligence repository for key chapters
const curatedIntelligence: Record<string, ChapterIntelligence> = {
  // Accountancy Class 12
  acc1: {
    summary: 'Establishes fundamental principles of partnership accounting under the Indian Partnership Act, 1932. Focuses on the rights and duties of partners, preparation of the Profit & Loss Appropriation Account, distinction between Fixed and Fluctuating Capital Accounts, calculation of interest on drawings & capital, past adjustments, and guarantee of profits.',
    keyHighlights: [
      'Provisions of Indian Partnership Act 1932 applicable in the absence of a Partnership Deed (Equal profits, 6% interest on partner loan, no interest on capital/drawings).',
      'Profit & Loss Appropriation Account: Recording interest on capital, partner salaries, interest on drawings, and profit distribution.',
      'Methods of Capital Accounts: Fixed Capital (Capital A/c + Current A/c) vs Fluctuating Capital (All entries in Capital A/c).',
      'Past adjustments relating to omission or error in interest/salary/profit ratios.',
      'Guarantee of minimum profit to a partner by firm or specific partners.'
    ],
    markingScheme: {
      totalMarksEstimate: '12 – 16 Marks',
      questionTypes: [
        { type: 'Multiple Choice Question (MCQ)', marks: '1 Mark', expectedCount: '1 – 2 Questions' },
        { type: 'Short Answer (Conceptual / Numerical)', marks: '3 Marks', expectedCount: '1 Question (Past Adjustments / Guarantee)' },
        { type: 'Long Answer (P&L Appropriation)', marks: '6 Marks', expectedCount: '1 Question' }
      ],
      examTips: 'High probability of 1 numerical question on Past Adjustment (Single Adjustment Journal Entry) or Guarantee of Profit. Always prepare working notes with clear calculations.'
    },
    hasFormulas: true,
    formulas: [
      {
        name: 'Interest on Capital',
        formula: 'Interest = (Capital Amount × Rate × Time Period in Months) / (100 × 12)',
        explanation: 'Calculated strictly on the opening capital and adjusted for any additional capital or permanent withdrawals during the year.'
      },
      {
        name: 'Interest on Drawings (Beginning of Each Month)',
        formula: 'Interest = Total Drawings × (Rate / 100) × (6.5 / 12)',
        explanation: 'Average period = (12 + 1) / 2 = 6.5 months for equal amounts withdrawn on the first day of every month.'
      },
      {
        name: 'Interest on Drawings (Middle of Each Month)',
        formula: 'Interest = Total Drawings × (Rate / 100) × (6 / 12)',
        explanation: 'Average period = (11.5 + 0.5) / 2 = 6 months for equal withdrawals made on the 15th of each month.'
      },
      {
        name: 'Interest on Drawings (End of Each Month)',
        formula: 'Interest = Total Drawings × (Rate / 100) × (5.5 / 12)',
        explanation: 'Average period = (11 + 0) / 2 = 5.5 months for equal monthly withdrawals made on the last day of each month.'
      },
      {
        name: "Manager's Commission (Before Charging)",
        formula: 'Commission = Net Profit × (Rate / 100)',
        explanation: 'Charged against profit in the Profit & Loss Account before transferring net profit to P&L Appropriation.'
      },
      {
        name: "Manager's Commission (After Charging)",
        formula: 'Commission = Net Profit × [Rate / (100 + Rate)]',
        explanation: 'Applied when commission is specified as a percentage of net profit after charging such commission.'
      }
    ]
  },

  acc2: {
    summary: 'Deals with the reconstitution of a partnership firm when a new partner is admitted. Focuses on recalculation of profit sharing ratios, determination of sacrificing ratio, valuation and accounting treatment of goodwill under Accounting Standard 26 (AS-26), revaluation of assets and reassessment of liabilities, treatment of accumulated reserves, and adjustments of capitals.',
    keyHighlights: [
      'Ascertaining New Profit Sharing Ratio and Sacrificing Ratio upon new partner admission.',
      'Goodwill treatment as per AS-26: Only purchased goodwill is recorded in books; premium for goodwill is credited to sacrificing partners.',
      'Revaluation Account: Nominal account recording profit/loss on revaluation of assets and reassessment of liabilities.',
      'Distribution of accumulated reserves, general reserve, and profit/loss balances among old partners in old ratio.',
      'Adjustment of partners capital based on new partner capital or combined old capitals.'
    ],
    markingScheme: {
      totalMarksEstimate: '8 – 12 Marks',
      questionTypes: [
        { type: 'MCQ (Ratio / Goodwill calculation)', marks: '1 Mark', expectedCount: '1 – 2 Questions' },
        { type: 'Short Answer (Goodwill entries / Reserves)', marks: '3 Marks', expectedCount: '1 Question' },
        { type: 'Comprehensive Long Problem (Revaluation + Capital)', marks: '6 Marks', expectedCount: '1 Question' }
      ],
      examTips: 'Board exams almost always test a full 6-mark problem requiring the Revaluation Account and Partners Capital Accounts. Make sure hidden goodwill and capital adjustments are practiced.'
    },
    hasFormulas: true,
    formulas: [
      {
        name: 'Sacrificing Ratio',
        formula: 'Sacrificing Ratio = Old Share − New Share',
        explanation: 'Ratio in which existing partners surrender their share of profits in favor of the incoming partner.'
      },
      {
        name: 'New Share of Partner',
        formula: 'New Share = Old Share − Share Sacrificed',
        explanation: 'Calculated to find new profit-sharing distribution.'
      },
      {
        name: 'Goodwill (Average Profit Method)',
        formula: 'Goodwill = Average Normal Profit × Number of Years of Purchase',
        explanation: 'Abnormal losses are added back and abnormal gains/non-operating incomes are deducted.'
      },
      {
        name: 'Goodwill (Super Profit Method)',
        formula: 'Goodwill = Super Profit × Number of Years of Purchase',
        explanation: 'Super Profit = Actual Average Profit − Normal Profit; Normal Profit = Capital Employed × (NRR / 100).'
      },
      {
        name: 'Goodwill (Capitalisation of Average Profit)',
        formula: 'Goodwill = [(Average Normal Profit / NRR) × 100] − Net Assets (Capital Employed)',
        explanation: 'Calculates the capitalized value of the business minus current capital employed.'
      }
    ]
  },

  acc3: {
    summary: 'Covers the retirement or death of an existing partner from the firm. Emphasizes finding the gaining ratio, accounting treatment of goodwill without opening a goodwill account, asset revaluation, calculation of deceased partner profit share up to date of demise, and preparation of the Retiring Partner Loan Account or Deceased Partner Executor Account.',
    keyHighlights: [
      'Gaining Ratio determination: Portion of retired/deceased partner share acquired by continuing partners.',
      'Treatment of Goodwill: Continuing partners capital accounts debited in gaining ratio; retiring/deceased partner credited.',
      'Interim profit calculation up to date of death on time basis or turnover (sales) basis.',
      'Settlement of dues: Transfer to Retiring Partner Loan Account (interest @ 6% p.a. or profit share) or Executor Account.'
    ],
    markingScheme: {
      totalMarksEstimate: '6 – 10 Marks',
      questionTypes: [
        { type: 'MCQ (Gaining ratio / Goodwill share)', marks: '1 Mark', expectedCount: '1 Question' },
        { type: 'Short Answer (Deceased Partner Profit / Executor A/c)', marks: '3 – 4 Marks', expectedCount: '1 Question' },
        { type: 'Long Answer (Full Retirement Problem)', marks: '6 Marks', expectedCount: '1 Question (Often internal choice with Admission)' }
      ],
      examTips: 'Calculation of deceased partner share of profit using P&L Suspense Account is frequently asked in 3-mark and 4-mark questions. Pay special attention to whether profit is calculated on sales or time basis.'
    },
    hasFormulas: true,
    formulas: [
      {
        name: 'Gaining Ratio',
        formula: 'Gaining Ratio = New Share − Old Share',
        explanation: 'The ratio in which continuing partners acquire the outgoing partner profit share.'
      },
      {
        name: "Deceased Partner's Interim Profit (Time Basis)",
        formula: 'Share of Profit = Previous Year Profit × (Months up to Death / 12) × Deceased Partner Share',
        explanation: 'Journal Entry: Debit Profit & Loss Suspense A/c, Credit Deceased Partner Capital A/c.'
      },
      {
        name: "Deceased Partner's Interim Profit (Sales Basis)",
        formula: 'Share of Profit = (Previous Year Profit / Previous Year Sales) × Sales up to Death × Partner Share',
        explanation: 'Applies profit percentage on turnover achieved up to the date of demise.'
      }
    ]
  },

  acc4: {
    summary: 'Focuses on the complete closure of firm operations and settlement of accounts under Section 48 of the Indian Partnership Act, 1932. Emphasizes preparing the Realisation Account to dispose of assets and pay off third-party liabilities, handling partners loans, adjusting capital deficits, and closing cash/bank accounts.',
    keyHighlights: [
      'Distinction between Dissolution of Partnership (change in agreement) and Dissolution of Firm (business ceases).',
      'Realisation Account: Nominal account to ascertain profit or loss on realisation of assets and payment of liabilities.',
      'Order of application of assets under Section 48 (Third party debts, partner advances/loans, partner capital, remaining surplus).',
      'Treatment of unrecorded assets, unrecorded liabilities, and realisation expenses.'
    ],
    markingScheme: {
      totalMarksEstimate: '6 – 8 Marks',
      questionTypes: [
        { type: 'MCQ (Realisation journal entry rule)', marks: '1 Mark', expectedCount: '1 Question' },
        { type: 'Journal Entries for Dissolution transactions', marks: '3 – 6 Marks', expectedCount: '1 Question' }
      ],
      examTips: 'CBSE frequently asks 6-mark questions consisting of 6 separate journal entries for dissolution transactions. Master treatment of realization expenses paid by partners vs firm.'
    },
    hasFormulas: true,
    formulas: [
      {
        name: 'Realisation Profit / Loss',
        formula: 'Profit/Loss = Total Realisation Credits (Assets Realised) − Total Realisation Debits (Assets Book Value + Liabilities Paid)',
        explanation: 'Transferred to all partners capital accounts in their profit sharing ratio.'
      },
      {
        name: 'Priority of Payments (Section 48)',
        formula: '1. Third Party Debts -> 2. Partner Loans -> 3. Partner Capitals -> 4. Balance distributed in PSR',
        explanation: 'Mandatory statutory sequence for settlement of accounts on firm dissolution.'
      }
    ]
  }
};

/**
 * Intelligent helper to extract or generate chapter intelligence
 */
export function getChapterIntelligence(chapter: SyllabusChapter, subjectName?: string): ChapterIntelligence {
  // Check if we have a curated entry
  if (curatedIntelligence[chapter.id]) {
    return curatedIntelligence[chapter.id];
  }

  // Determine if this subject or chapter typically requires mathematical formulas
  const mathSubjectKeywords = [
    'math', 'account', 'physic', 'chemist', 'statist', 'comput', 'mechanic', 'calculus'
  ];
  const lowerSub = (subjectName || '').toLowerCase();
  const lowerTitle = chapter.title.toLowerCase();

  const isMathSubject = mathSubjectKeywords.some(kw => lowerSub.includes(kw) || lowerTitle.includes(kw));

  // Determine estimated weightage
  let weightageDisplay = '8 – 10 Marks';
  if (chapter.officialWeightage) {
    const match = chapter.officialWeightage.match(/(\d+)\s*Marks?/i);
    if (match) {
      const marks = parseInt(match[1], 10);
      weightageDisplay = `${marks} Marks`;
    } else {
      weightageDisplay = chapter.officialWeightage;
    }
  }

  // Create intelligent summary from topics
  const topicsSummary = chapter.topics.length > 0
    ? `Key topics include: ${chapter.topics.slice(0, 4).map(t => t.title).join(', ')}${chapter.topics.length > 4 ? ', and more' : ''}.`
    : 'Comprehensive coverage of core curriculum standards and expected examination outcomes.';

  const summary = `This chapter explores the essential conceptual framework and applied problems of "${chapter.title}". ${topicsSummary} Mastery of these areas provides strong foundational knowledge for both board examinations and competitive entrance tests.`;

  const keyHighlights = chapter.topics.slice(0, 5).map(t => t.title);
  if (keyHighlights.length === 0) {
    keyHighlights.push(`Core principles and theoretical definitions of ${chapter.title}`);
    keyHighlights.push('Application-based problem solving and analysis');
    keyHighlights.push('Previous Year Question (PYQ) high-yield patterns');
  }

  // Determine question types
  const questionTypes: QuestionBreakdown[] = [
    { type: 'Objective / Multiple Choice (MCQ)', marks: '1 Mark', expectedCount: '1 – 2 Questions' },
    { type: 'Short Answer (Conceptual / Reasoning)', marks: '2 – 3 Marks', expectedCount: '1 Question' },
    { type: 'Long Answer / Case-Based Question', marks: '4 – 6 Marks', expectedCount: '1 Question' }
  ];

  const examTips = chapter.pyqPriority === 'HIGH'
    ? 'High-Yield Chapter: Regularly tested in annual board examinations and model papers. Ensure thorough revision of definitions, step-by-step working notes, and recurring PYQs.'
    : 'Consistent foundational topic: Focus on clear understanding of core terminology, schematic diagrams or working steps, and NCERT textbook exercise problems.';

  // If subject is purely theoretical (e.g. English, History, Political Science, Business Studies theory)
  // We explicitly do NOT invent unnecessary formulas!
  if (!isMathSubject) {
    return {
      summary,
      keyHighlights,
      markingScheme: {
        totalMarksEstimate: weightageDisplay,
        questionTypes,
        examTips
      },
      hasFormulas: false,
      corePrinciples: [
        'Conceptual Clarity: Focus on standard textbook definitions and structured answers.',
        'Heading & Sub-heading formatting: Highlight key terms and point-wise explanations for maximum examiner scores.',
        'Case Studies & Real-world Scenarios: Practice connecting theoretical principles to contemporary examples.'
      ]
    };
  }

  // For math/science/numerical chapters where formulas are relevant
  return {
    summary,
    keyHighlights,
    markingScheme: {
      totalMarksEstimate: weightageDisplay,
      questionTypes,
      examTips
    },
    hasFormulas: false, // Default to clean unless explicit formulas are verified
    corePrinciples: [
      'Step-wise Marking: Write down every given formula, substitution step, and final units explicitly.',
      'Formula Retention: Memorize standard notation, boundary conditions, and sign conventions.',
      'Calculation Accuracy: Verify numerical calculations and units in final answers.'
    ]
  };
}
