import { SyllabusData, Subject } from '../types/syllabus';
import { cbse12Math, cbse12English } from './syllabusCBSE12PCM';

// CBSE Class 12 Commerce | Academic Session 2026-27
// Official Authority: CBSE (cbseacademic.nic.in) & NCERT (ncert.nic.in)

export const cbse12Accountancy: Subject = {
  id: 'cbse_12_com_acc',
  name: 'Accountancy',
  chapters: [
    {
      id: 'acc1',
      title: 'Accounting for Partnership: Basic Concepts',
      officialWeightage: 'Part A — 36 Marks (with Ch 2, 3, 4)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'acc1_t1', title: 'Partnership: Features, Partnership Deed and Provisions of Indian Partnership Act 1932' },
        { id: 'acc1_t2', title: 'Maintenance of Capital Accounts: Fixed and Fluctuating Capital methods' },
        { id: 'acc1_t3', title: 'Division of Profit among partners, Profit and Loss Appropriation Account' },
        { id: 'acc1_t4', title: 'Past adjustments (relating to interest on capital, drawings, salary and profit sharing ratio)' },
        { id: 'acc1_t5', title: 'Guarantee of profits to a partner' }
      ]
    },
    {
      id: 'acc2',
      title: 'Reconstitution of a Partnership Firm: Admission of a Partner',
      officialWeightage: 'Part A — 36 Marks (with Ch 1, 3, 4)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'acc2_t1', title: 'Change in profit sharing ratio among existing partners, Sacrificing and Gaining Ratio' },
        { id: 'acc2_t2', title: 'Accounting treatment of Goodwill (as per AS-26)' },
        { id: 'acc2_t3', title: 'Revaluation of Assets and Reassessment of Liabilities (Revaluation Account)' },
        { id: 'acc2_t4', title: 'Treatment of Reserves, Accumulated Profits and Losses' },
        { id: 'acc2_t5', title: 'Adjustment of Capitals based on new partner\'s capital or old partners\' capital' }
      ]
    },
    {
      id: 'acc3',
      title: 'Reconstitution of a Partnership Firm: Retirement and Death of a Partner',
      officialWeightage: 'Part A — 36 Marks (with Ch 1, 2, 4)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'acc3_t1', title: 'Ascertainment of new profit sharing ratio and gaining ratio' },
        { id: 'acc3_t2', title: 'Treatment of goodwill, revaluation of assets and reassessment of liabilities' },
        { id: 'acc3_t3', title: 'Adjustment of accumulated profits/losses and reserves' },
        { id: 'acc3_t4', title: 'Calculation of deceased partner\'s share of profit up to date of death' },
        { id: 'acc3_t5', title: 'Preparation of Retiring/Deceased Partner\'s Capital Account and Executor\'s Account' }
      ]
    },
    {
      id: 'acc4',
      title: 'Dissolution of a Partnership Firm',
      officialWeightage: 'Part A — 36 Marks (with Ch 1, 2, 3)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'acc4_t1', title: 'Meaning of dissolution of partnership and dissolution of partnership firm' },
        { id: 'acc4_t2', title: 'Settlement of accounts on dissolution (Section 48)' },
        { id: 'acc4_t3', title: 'Preparation of Realisation Account, Partners\' Loan Accounts, Partners\' Capital Accounts and Cash/Bank Account' }
      ]
    },
    {
      id: 'acc5',
      title: 'Accounting for Share Capital',
      officialWeightage: 'Part A — 24 Marks (with Ch 6)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'acc5_t1', title: 'Features and types of companies, Share and Share Capital: Nature and types' },
        { id: 'acc5_t2', title: 'Accounting for share capital: Issue and allotment of equity and preference shares at par and at premium' },
        { id: 'acc5_t3', title: 'Calls in advance, calls in arrears (excluding interest), issue of shares for consideration other than cash' },
        { id: 'acc5_t4', title: 'Forfeiture of shares: Accounting treatment for shares issued at par and premium' },
        { id: 'acc5_t5', title: 'Re-issue of forfeited shares and transfer to Capital Reserve' },
        { id: 'acc5_t6', title: 'Disclosure of Share Capital in Company\'s Balance Sheet (Schedule III)' }
      ]
    },
    {
      id: 'acc6',
      title: 'Accounting for Issue and Redemption of Debentures',
      officialWeightage: 'Part A — 24 Marks (with Ch 5)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'acc6_t1', title: 'Meaning, types and distinction between shares and debentures' },
        { id: 'acc6_t2', title: 'Issue of debentures at par, at premium and at discount' },
        { id: 'acc6_t3', title: 'Issue of debentures with consideration other than cash and as collateral security' },
        { id: 'acc6_t4', title: 'Terms of issue and redemption: Writing off discount/loss on issue of debentures' },
        { id: 'acc6_t5', title: 'Interest on debentures' }
      ]
    },
    {
      id: 'acc7',
      title: 'Financial Statements of a Company',
      officialWeightage: 'Part B — 20 Marks Total',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'acc7_t1', title: 'Meaning, objectives and limitations of financial statements' },
        { id: 'acc7_t2', title: 'Statement of Profit and Loss and Balance Sheet in prescribed form with major heads and sub-heads (Schedule III to Companies Act 2013)' }
      ]
    },
    {
      id: 'acc8',
      title: 'Financial Statement Analysis & Comparative Statements',
      officialWeightage: 'Part B — 20 Marks Total',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'acc8_t1', title: 'Meaning, objectives, significance and limitations of Financial Statement Analysis' },
        { id: 'acc8_t2', title: 'Tools of Analysis: Comparative Statements (Balance Sheet & Income Statement)' },
        { id: 'acc8_t3', title: 'Common Size Statements (Balance Sheet & Income Statement)' }
      ]
    },
    {
      id: 'acc9',
      title: 'Accounting Ratios',
      officialWeightage: 'Part B — 20 Marks Total',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'acc9_t1', title: 'Meaning, objectives, advantages, classification and limitations of ratio analysis' },
        { id: 'acc9_t2', title: 'Liquidity Ratios: Current Ratio and Quick (Acid-Test) Ratio' },
        { id: 'acc9_t3', title: 'Solvency Ratios: Debt to Equity, Total Assets to Debt, Proprietary Ratio, Interest Coverage Ratio' },
        { id: 'acc9_t4', title: 'Activity Ratios: Inventory Turnover, Trade Receivables Turnover, Trade Payables Turnover, Working Capital Turnover' },
        { id: 'acc9_t5', title: 'Profitability Ratios: Gross Profit, Operating, Operating Profit, Net Profit Ratio, Return on Investment (ROI)' }
      ]
    },
    {
      id: 'acc10',
      title: 'Cash Flow Statement',
      officialWeightage: 'Part B — 20 Marks Total',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'acc10_t1', title: 'Meaning, objectives, benefits and limitations of Cash Flow Statement' },
        { id: 'acc10_t2', title: 'Preparation of Cash Flow Statement as per Accounting Standard 3 (AS-3 Revised) using Indirect Method' },
        { id: 'acc10_t3', title: 'Cash flows from Operating, Investing and Financing activities' },
        { id: 'acc10_t4', title: 'Adjustments relating to depreciation, dividend, profit/loss on sale of assets, provision for tax' }
      ]
    }
  ]
};

export const cbse12BusinessStudies: Subject = {
  id: 'cbse_12_com_bst',
  name: 'Business Studies',
  chapters: [
    {
      id: 'bst1',
      title: 'Nature and Significance of Management',
      officialWeightage: 'Part A — 16 Marks (with Ch 2, 3)',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'bst1_t1', title: 'Management: Concept, objectives, importance' },
        { id: 'bst1_t2', title: 'Management as Science, Art and Profession' },
        { id: 'bst1_t3', title: 'Levels of Management: Top, middle and supervisory' },
        { id: 'bst1_t4', title: 'Management functions: Planning, organising, staffing, directing, controlling' },
        { id: 'bst1_t5', title: 'Coordination: Concept, characteristics and importance' }
      ]
    },
    {
      id: 'bst2',
      title: 'Principles of Management',
      officialWeightage: 'Part A — 16 Marks (with Ch 1, 3)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'bst2_t1', title: 'Principles of Management: Concept and significance' },
        { id: 'bst2_t2', title: 'Fayol\'s 14 principles of general management' },
        { id: 'bst2_t3', title: 'Taylor\'s Scientific Management: Principles and scientific techniques' },
        { id: 'bst2_t4', title: 'Comparison of Fayol versus Taylor\'s contributions' }
      ]
    },
    {
      id: 'bst3',
      title: 'Business Environment',
      officialWeightage: 'Part A — 16 Marks (with Ch 1, 2)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'bst3_t1', title: 'Business Environment: Concept and importance' },
        { id: 'bst3_t2', title: 'Dimensions of Business Environment: Economic, Social, Technological, Political and Legal' },
        { id: 'bst3_t3', title: 'Demonetization: Concept, features and impact on Indian business' }
      ]
    },
    {
      id: 'bst4',
      title: 'Planning',
      officialWeightage: 'Part A — 14 Marks (with Ch 5)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'bst4_t1', title: 'Planning: Concept, importance and limitations' },
        { id: 'bst4_t2', title: 'Planning process: Setting objectives, developing premises, identifying alternative courses, evaluating, selecting, implementing and follow-up' },
        { id: 'bst4_t3', title: 'Single use and standing plans: Objectives, strategy, policy, procedure, method, rule, budget and programme' }
      ]
    },
    {
      id: 'bst5',
      title: 'Organising',
      officialWeightage: 'Part A — 14 Marks (with Ch 4)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'bst5_t1', title: 'Organising: Concept, importance and organising process' },
        { id: 'bst5_t2', title: 'Structure of organisation: Functional and divisional structures' },
        { id: 'bst5_t3', title: 'Formal and informal organisation: Concept and differences' },
        { id: 'bst5_t4', title: 'Delegation: Concept, elements (authority, responsibility, accountability) and importance' },
        { id: 'bst5_t5', title: 'Decentralisation: Concept and importance' }
      ]
    },
    {
      id: 'bst6',
      title: 'Staffing',
      officialWeightage: 'Part A — 20 Marks (with Ch 7, 8)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'bst6_t1', title: 'Staffing: Concept and importance as part of human resource management' },
        { id: 'bst6_t2', title: 'Staffing process' },
        { id: 'bst6_t3', title: 'Recruitment: Internal and external sources, merits and demerits' },
        { id: 'bst6_t4', title: 'Selection: Selection process, selection tests and employment interview' },
        { id: 'bst6_t5', title: 'Training and Development: Concept, importance and methods (On-the-job and Off-the-job: Vestibule training, apprenticeship, internship)' }
      ]
    },
    {
      id: 'bst7',
      title: 'Directing',
      officialWeightage: 'Part A — 20 Marks (with Ch 6, 8)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'bst7_t1', title: 'Directing: Concept and importance' },
        { id: 'bst7_t2', title: 'Elements of Directing: Supervision, Motivation, Leadership, Communication' },
        { id: 'bst7_t3', title: 'Motivation: Concept, Maslow\'s hierarchy of needs, financial and non-financial incentives' },
        { id: 'bst7_t4', title: 'Leadership: Concept, leadership styles (Autocratic, Democratic, Laissez-faire)' },
        { id: 'bst7_t5', title: 'Communication: Formal and informal communication, barriers to effective communication and overcoming barriers' }
      ]
    },
    {
      id: 'bst8',
      title: 'Controlling',
      officialWeightage: 'Part A — 20 Marks (with Ch 6, 7)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'bst8_t1', title: 'Controlling: Concept and importance' },
        { id: 'bst8_t2', title: 'Relationship between Planning and Controlling' },
        { id: 'bst8_t3', title: 'Steps in process of Controlling: Setting standards, measurement of actual performance, comparison, deviation analysis, taking corrective action' }
      ]
    },
    {
      id: 'bst9',
      title: 'Financial Management',
      officialWeightage: 'Part B — 15 Marks (with Ch 10)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'bst9_t1', title: 'Financial Management: Concept, role and objectives' },
        { id: 'bst9_t2', title: 'Financial decisions: Investment, financing and dividend decisions and factors affecting them' },
        { id: 'bst9_t3', title: 'Financial Planning: Concept, objectives and importance' },
        { id: 'bst9_t4', title: 'Capital Structure: Concept and factors affecting capital structure, trading on equity' },
        { id: 'bst9_t5', title: 'Fixed and Working Capital: Concept and factors affecting their requirements' }
      ]
    },
    {
      id: 'bst10',
      title: 'Financial Markets',
      officialWeightage: 'Part B — 15 Marks (with Ch 9)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'bst10_t1', title: 'Financial Market: Concept, functions and classification' },
        { id: 'bst10_t2', title: 'Money Market: Concept and instruments (Treasury bill, Commercial paper, Call money, Certificate of deposit, Commercial bill)' },
        { id: 'bst10_t3', title: 'Capital Market: Concept and types (Primary and Secondary markets)' },
        { id: 'bst10_t4', title: 'Stock Exchange: Functions, trading procedure, demat account, depository services (NSDL, CDSL)' },
        { id: 'bst10_t5', title: 'Securities and Exchange Board of India (SEBI): Objectives, regulatory, developmental and protective functions' }
      ]
    },
    {
      id: 'bst11',
      title: 'Marketing Management',
      officialWeightage: 'Part B — 15 Marks (with Ch 12)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'bst11_t1', title: 'Marketing: Concept, functions, philosophies (production, product, selling, marketing, societal)' },
        { id: 'bst11_t2', title: 'Marketing Mix: Concept and 4Ps elements' },
        { id: 'bst11_t3', title: 'Product: Branding, labelling and packaging' },
        { id: 'bst11_t4', title: 'Price: Concept, factors determining fixation of price' },
        { id: 'bst11_t5', title: 'Physical Distribution: Channels of distribution and physical distribution components' },
        { id: 'bst11_t6', title: 'Promotion: Promotion mix (Advertising, Personal Selling, Sales Promotion, Public Relations)' }
      ]
    },
    {
      id: 'bst12',
      title: 'Consumer Protection',
      officialWeightage: 'Part B — 15 Marks (with Ch 11)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'bst12_t1', title: 'Consumer Protection: Concept and importance from consumer and business viewpoint' },
        { id: 'bst12_t2', title: 'Consumer Protection Act 2019: Meaning of consumer, consumer rights and consumer responsibilities' },
        { id: 'bst12_t3', title: 'Redressal machinery under CPA 2019: District Commission, State Commission, National Commission' },
        { id: 'bst12_t4', title: 'Remedies available, role of consumer organisations and NGOs' }
      ]
    }
  ]
};

export const cbse12Economics: Subject = {
  id: 'cbse_12_com_eco',
  name: 'Economics',
  chapters: [
    {
      id: 'eco1',
      title: 'National Income and Related Aggregates',
      officialWeightage: 'Part A (Macro) — 10 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'eco1_t1', title: 'Macroeconomics: meaning, circular flow of income (two-sector model)' },
        { id: 'eco1_t2', title: 'Basic concepts: consumption goods, capital goods, final goods, intermediate goods; stocks and flows; gross investment and depreciation' },
        { id: 'eco1_t3', title: 'Aggregates related to National Income: GDP, GNP, NDP, NNP (at market price and factor cost)' },
        { id: 'eco1_t4', title: 'Measurement of National Income: Value Added method, Income method and Expenditure method' },
        { id: 'eco1_t5', title: 'Real and Nominal GDP, GDP deflator, GDP and Welfare' }
      ]
    },
    {
      id: 'eco2',
      title: 'Money and Banking',
      officialWeightage: 'Part A (Macro) — 6 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'eco2_t1', title: 'Money: Meaning, functions and supply of money (Currency held by public and net demand deposits held by commercial banks)' },
        { id: 'eco2_t2', title: 'Money creation (Credit creation) by the commercial banking system' },
        { id: 'eco2_t3', title: 'Central Bank (RBI) and its functions: Bank of issue, Government bank, Banker\'s bank, Controller of credit through repo rate, reverse repo rate, CRR, SLR, MSF, open market operations, margin requirements' }
      ]
    },
    {
      id: 'eco3',
      title: 'Determination of Income and Employment',
      officialWeightage: 'Part A (Macro) — 12 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'eco3_t1', title: 'Aggregate demand, Aggregate supply and their components' },
        { id: 'eco3_t2', title: 'Propensity to consume and propensity to save (average and marginal)' },
        { id: 'eco3_t3', title: 'Short-run equilibrium output, investment multiplier and its mechanism' },
        { id: 'eco3_t4', title: 'Meaning of full employment and involuntary unemployment' },
        { id: 'eco3_t5', title: 'Problems of excess demand and deficient demand; measures to correct them: changes in government spending, taxes and monetary policy' }
      ]
    },
    {
      id: 'eco4',
      title: 'Government Budget and the Economy',
      officialWeightage: 'Part A (Macro) — 6 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'eco4_t1', title: 'Government budget: meaning, objectives and components' },
        { id: 'eco4_t2', title: 'Classification of receipts: revenue receipts and capital receipts' },
        { id: 'eco4_t3', title: 'Classification of expenditure: revenue expenditure and capital expenditure' },
        { id: 'eco4_t4', title: 'Measures of government deficit: revenue deficit, fiscal deficit, primary deficit (meaning and implications)' }
      ]
    },
    {
      id: 'eco5',
      title: 'Balance of Payments and Foreign Exchange',
      officialWeightage: 'Part A (Macro) — 6 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'eco5_t1', title: 'Balance of Payments account: meaning and components (Current account, Capital account)' },
        { id: 'eco5_t2', title: 'Balance of payments surplus and deficit' },
        { id: 'eco5_t3', title: 'Foreign exchange rate: meaning of fixed and flexible rates, managed floating' },
        { id: 'eco5_t4', title: 'Determination of exchange rate in a free market, appreciation and depreciation of domestic currency' }
      ]
    },
    {
      id: 'eco6',
      title: 'Development Experience (1947-90) & Economic Reforms since 1991',
      officialWeightage: 'Part B (IED) — 12 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'eco6_t1', title: 'State of Indian economy on the eve of independence' },
        { id: 'eco6_t2', title: 'Five year plans: common goals, development of agriculture (land reforms, Green Revolution), industry (IPR 1956, SSI), foreign trade' },
        { id: 'eco6_t3', title: 'Economic Reforms since 1991: Need and main features of Liberalisation, Privatisation and Globalisation (LPG policies)' },
        { id: 'eco6_t4', title: 'Appraisal of LPG policies, concept of Demonetization and GST' }
      ]
    },
    {
      id: 'eco7',
      title: 'Current Challenges Facing the Indian Economy',
      officialWeightage: 'Part B (IED) — 20 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'eco7_t1', title: 'Human Capital Formation: Education and health sectors, source of human capital, role of human capital in economic development' },
        { id: 'eco7_t2', title: 'Rural Development: Credit and marketing systems, agricultural diversification, organic farming' },
        { id: 'eco7_t3', title: 'Employment: Growth, formalisation and informalisation of workforce, unemployment issues and government policies' },
        { id: 'eco7_t4', title: 'Sustainable Economic Development: Meaning, effects of economic development on resources and environment, global warming' }
      ]
    },
    {
      id: 'eco8',
      title: 'Development Experience of India — A Comparison with Neighbours',
      officialWeightage: 'Part B (IED) — 8 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'eco8_t1', title: 'A comparative study of India, Pakistan and China' },
        { id: 'eco8_t2', title: 'Issues and indicators: economic growth, population, sectoral development and human development indicators' }
      ]
    }
  ]
};

export const syllabusCBSE12Commerce: SyllabusData = {
  id: 'cbse_12_commerce',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 12',
  stream: 'Commerce',
  academicSession: '2026-2027',
  sourceUrl: 'https://cbseacademic.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    cbse12Accountancy,
    cbse12BusinessStudies,
    cbse12Economics,
    cbse12Math,
    cbse12English
  ]
};
