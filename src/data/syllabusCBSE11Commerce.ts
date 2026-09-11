import { SyllabusData } from '../types/syllabus';
import { syllabusCBSE11PCB } from './syllabusCBSE11PCB';

// CBSE Class 11 Commerce | Session 2026-27
// Official source: cbseacademic.nic.in
// Includes: Accountancy, Business Studies, Economics, English Core

export const syllabusCBSE11Commerce: SyllabusData = {
  id: 'cbse_11_com',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://cbseacademic.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'cbse11_acc',
      name: 'Accountancy',
      chapters: [
        // Part A: Financial Accounting-1 (50 Marks)
        { id: 'c11a1', title: 'Theoretical Framework', officialWeightage: 'Part A (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11a1t1', title: 'Introduction to Accounting: Concept, objectives, advantages and limitations, types of accounting information' },
          { id: 'c11a1t2', title: 'Users of accounting information and their needs, Qualitative Characteristics of Accounting Information' },
          { id: 'c11a1t3', title: 'Role of Accounting in Business' },
          { id: 'c11a1t4', title: 'Basic Accounting Terms: Business Transaction, Capital, Drawings, Liabilities, Assets, Expenditure, Expense, Income, Profit, Gain, Loss, Purchase, Sales, Goods, Stock, Debtor, Creditor, Voucher, Discount' },
          { id: 'c11a1t5', title: 'Theory Base of Accounting: Fundamental accounting assumptions: GAAP' },
          { id: 'c11a1t6', title: 'Basic accounting concept: Business Entity, Money Measurement, Going Concern, Accounting Period, Cost Concept, Dual Aspect, Revenue Recognition, Matching, Full Disclosure, Consistency, Conservatism, Materiality and Objectivity' },
          { id: 'c11a1t7', title: 'System of Accounting: Basis of Accounting: cash basis and accrual basis' },
          { id: 'c11a1t8', title: 'Accounting Standards: Applicability in IndAS' },
          { id: 'c11a1t9', title: 'Goods and Services Tax (GST): Characteristics and Objective' }
        ]},
        { id: 'c11a2', title: 'Accounting Process', officialWeightage: 'Part A (38 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11a2t1', title: 'Recording of Business Transactions: Voucher and Transactions: Source documents and Vouchers' },
          { id: 'c11a2t2', title: 'Accounting Equation Approach: Meaning and Analysis, Rules of Debit and Credit' },
          { id: 'c11a2t3', title: 'Recording of Transactions: Books of Original Entry- Journal' },
          { id: 'c11a2t4', title: 'Special Purpose books: Cash Book, Purchases book, Sales book, Purchases return book, Sales return book, Journal proper' },
          { id: 'c11a2t5', title: 'Ledger: Format, Posting from journal and subsidiary books, Balancing of accounts' },
          { id: 'c11a2t6', title: 'Bank Reconciliation Statement: Need and preparation' },
          { id: 'c11a2t7', title: 'Depreciation, Provisions and Reserves: Concept of depreciation, Features, Causes, factors' },
          { id: 'c11a2t8', title: 'Methods of providing depreciation: Straight line method and written down value method' },
          { id: 'c11a2t9', title: 'Accounting treatment of depreciation, Provisions and Reserves' },
          { id: 'c11a2t10', title: 'Trial balance and Rectification of Errors: Trial balance objectives and preparation, Errors and their Rectification' }
        ]},
        // Part B: Financial Accounting-II (30 Marks)
        { id: 'c11a3', title: 'Financial Statements of Sole Proprietorship', officialWeightage: 'Part B (24 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11a3t1', title: 'Financial Statements: Meaning, objectives and importance; Revenue and Capital Receipts; Revenue and Capital Expenditure; Deferred Revenue expenditure' },
          { id: 'c11a3t2', title: 'Trading and Profit and Loss Account: Gross Profit, Operating profit and Net profit' },
          { id: 'c11a3t3', title: 'Preparation of financial statements (Trading and Profit & Loss account and Balance Sheet)' },
          { id: 'c11a3t4', title: 'Adjustments in preparation of financial statements with respect to closing stock, outstanding expenses, prepaid expenses, accrued income, income received in advance, depreciation, bad debts, provision for doubtful debts, provision for discount on debtors, abnormal loss' },
          { id: 'c11a3t5', title: 'Preparation of financial statements with adjustments' }
        ]},
        // Computers in Accounting
        { id: 'c11a4', title: 'Computers in Accounting', officialWeightage: 'Part B (6 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c11a4t1', title: 'Introduction to computer and accounting information system' },
          { id: 'c11a4t2', title: 'Applications of computers in accounting: Automation of accounting process, designing accounting reports' },
          { id: 'c11a4t3', title: 'Comparison of accounting processes in manual and computerized accounting' }
        ]}
      ]
    },
    {
      id: 'cbse11_bst',
      name: 'Business Studies',
      chapters: [
        // Part A: Foundations of Business (40 Marks)
        { id: 'c11bs1', title: 'Nature and Purpose of Business', officialWeightage: 'Part A (16 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11bs1t1', title: 'Concept, characteristics of business' },
          { id: 'c11bs1t2', title: 'Business, profession and employment-Concept' },
          { id: 'c11bs1t3', title: 'Objectives of business' },
          { id: 'c11bs1t4', title: 'Classification of business activities - Industry and Commerce' },
          { id: 'c11bs1t5', title: 'Industry-types: primary, secondary, tertiary' },
          { id: 'c11bs1t6', title: 'Commerce-trade: (types-internal, external; wholesale and retail)' },
          { id: 'c11bs1t7', title: 'Business risk-Concept' }
        ]},
        { id: 'c11bs2', title: 'Forms of Business Organisations', officialWeightage: 'Part A (16 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11bs2t1', title: 'Sole Proprietorship-Concept, merits and limitations' },
          { id: 'c11bs2t2', title: 'Partnership-Concept, types, merits and limitation of partnership, registration of a partnership firm, partnership deed. Types of partners' },
          { id: 'c11bs2t3', title: 'Hindu Undivided Family Business: concept' },
          { id: 'c11bs2t4', title: 'Cooperative Societies-Concept, merits, and limitations, types' },
          { id: 'c11bs2t5', title: 'Company-Concept, merits and limitations; Types: Private, Public and One Person Company' },
          { id: 'c11bs2t6', title: 'Formation of company - stages, important documents (Memorandum of Association, Articles of Association)' },
          { id: 'c11bs2t7', title: 'Choice of form of business organization' }
        ]},
        { id: 'c11bs3', title: 'Public, Private and Global Enterprises', officialWeightage: 'Part A (14 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11bs3t1', title: 'Public sector and private sector enterprises – Concept' },
          { id: 'c11bs3t2', title: 'Forms of public sector enterprises: Departmental Undertakings, Statutory Corporations and Government Company' },
          { id: 'c11bs3t3', title: 'Global Enterprises – Feature. Public private partnership – concept' }
        ]},
        { id: 'c11bs4', title: 'Business Services', officialWeightage: 'Part A (14 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11bs4t1', title: 'Business services – meaning and types. Banking: Types of bank accounts' },
          { id: 'c11bs4t2', title: 'Banking services with particular reference to Bank Draft, Bank Overdraft, Cash credit. E-Banking' },
          { id: 'c11bs4t3', title: 'Insurance – Principles. Types – life, health, fire and marine insurance' },
          { id: 'c11bs4t4', title: 'Postal and Telecom services' }
        ]},
        { id: 'c11bs5', title: 'Emerging Modes of Business', officialWeightage: 'Part A (10 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11bs5t1', title: 'E-business: concept, scope and benefits' }
        ]},
        { id: 'c11bs6', title: 'Social Responsibility of Business and Business Ethics', officialWeightage: 'Part A (10 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11bs6t1', title: 'Concept of social responsibility' },
          { id: 'c11bs6t2', title: 'Case for social responsibility' },
          { id: 'c11bs6t3', title: 'Responsibility towards owners, investors, consumers, employees, government and community' },
          { id: 'c11bs6t4', title: 'Role of business in environment protection' },
          { id: 'c11bs6t5', title: 'Business Ethics - Concept and Elements' }
        ]},
        // Part B: Finance and Trade (40 Marks)
        { id: 'c11bs7', title: 'Sources of Business Finance', officialWeightage: 'Part B (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11bs7t1', title: 'Concept of business finance' },
          { id: 'c11bs7t2', title: 'Owners\' funds- equity shares, preferences share, retained earnings' },
          { id: 'c11bs7t3', title: 'Borrowed funds: debentures and bonds, loan from financial institution and commercial banks, public deposits, trade credit, Inter Corporate Deposits (ICD)' }
        ]},
        { id: 'c11bs8', title: 'Small Business and Enterprises', officialWeightage: 'Part B (20 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11bs8t1', title: 'Entrepreneurship Development (ED): Concept, Characteristics and Need. Process of Entrepreneurship Development' },
          { id: 'c11bs8t2', title: 'Startup India Scheme, ways to fund start-up. Intellectual Property Rights and Entrepreneurship' },
          { id: 'c11bs8t3', title: 'Small scale enterprise as defined by MSMED Act 2006' },
          { id: 'c11bs8t4', title: 'Role of small business in India with special reference to rural areas' },
          { id: 'c11bs8t5', title: 'Government schemes and agencies for small scale industries: NSIC and DIC' }
        ]},
        { id: 'c11bs9', title: 'Internal Trade', officialWeightage: 'Part B (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11bs9t1', title: 'Internal trade - meaning and types services rendered by a wholesaler and a retailer' },
          { id: 'c11bs9t2', title: 'Types of retail-trade-Itinerant and small scale fixed shops retailers' },
          { id: 'c11bs9t3', title: 'Large scale retailers-Departmental stores, chain stores' },
          { id: 'c11bs9t4', title: 'Concept of automatic vending machine' },
          { id: 'c11bs9t5', title: 'Main documents used in internal trade: Performa invoice, invoice, debit note, credit note. Lorry receipt (LR) and Railways Receipt (RR)' },
          { id: 'c11bs9t6', title: 'Terms of Trade: COD (Cash on Delivery), FOB (Free on Board), CIF (Cost, Insurance and Freight), E&OE' }
        ]},
        { id: 'c11bs10', title: 'International Trade', officialWeightage: 'Part B (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11bs10t1', title: 'International trade: concept and benefits' },
          { id: 'c11bs10t2', title: 'Export trade - Meaning and procedure' },
          { id: 'c11bs10t3', title: 'Import Trade - Meaning and procedure' },
          { id: 'c11bs10t4', title: 'Documents involved in International Trade; indent, letter of credit, shipping order, shipping bills, mate\'s receipt (DA/DP)' },
          { id: 'c11bs10t5', title: 'World Trade Organization (WTO) meaning and objectives' }
        ]}
      ]
    },
    {
      id: 'cbse11_eco',
      name: 'Economics',
      chapters: [
        // Part A: Statistics for Economics (40 Marks)
        { id: 'c11ec1', title: 'Introduction', officialWeightage: 'Part A (15 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11ec1t1', title: 'What is Economics?' },
          { id: 'c11ec1t2', title: 'Meaning, scope, functions and importance of statistics in Economics' }
        ]},
        { id: 'c11ec2', title: 'Collection, Organisation and Presentation of Data', officialWeightage: 'Part A (15 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11ec2t1', title: 'Collection of data: sources of data - primary and secondary; how basic data is collected; concepts of Sampling' },
          { id: 'c11ec2t2', title: 'Organisation of Data: Meaning and types of variables; Frequency Distribution' },
          { id: 'c11ec2t3', title: 'Presentation of Data: Tabular Presentation and Diagrammatic Presentation of Data: Geometric forms, Frequency diagrams, Arithmetic line graphs' }
        ]},
        { id: 'c11ec3', title: 'Statistical Tools and Interpretation', officialWeightage: 'Part A (25 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11ec3t1', title: 'Measures of Central Tendency- Arithmetic mean, median and mode' },
          { id: 'c11ec3t2', title: 'Correlation - meaning and properties, scatter diagram; Measures of correlation - Karl Pearson\'s method and Spearman\'s rank correlation' },
          { id: 'c11ec3t3', title: 'Introduction to Index Numbers - meaning, types, wholesale price index, consumer price index and index of industrial production, uses of index numbers; Inflation and index numbers' }
        ]},
        // Part B: Introductory Microeconomics (40 Marks)
        { id: 'c11ec4', title: 'Introduction to Microeconomics', officialWeightage: 'Part B (4 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11ec4t1', title: 'Meaning of microeconomics and macroeconomics; positive and normative economics' },
          { id: 'c11ec4t2', title: 'What is an economy? Central problems of an economy: what, how and for whom to produce' },
          { id: 'c11ec4t3', title: 'Opportunity cost' }
        ]},
        { id: 'c11ec5', title: 'Consumer\'s Equilibrium and Demand', officialWeightage: 'Part B (14 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11ec5t1', title: 'Consumer\'s equilibrium - meaning of utility, marginal utility, law of diminishing marginal utility, conditions of consumer\'s equilibrium using marginal utility analysis' },
          { id: 'c11ec5t2', title: 'Indifference curve analysis of consumer\'s equilibrium - the consumer\'s budget, preferences, conditions of consumer\'s equilibrium' },
          { id: 'c11ec5t3', title: 'Demand, market demand, determinants of demand, demand schedule, demand curve and its slope, movement along and shifts in the demand curve; price elasticity of demand, factors affecting price elasticity of demand; measurement of price elasticity of demand' }
        ]},
        { id: 'c11ec6', title: 'Producer Behaviour and Supply', officialWeightage: 'Part B (14 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11ec6t1', title: 'Meaning of Production Function - Short-Run and Long-Run' },
          { id: 'c11ec6t2', title: 'Total Product, Average Product and Marginal Product' },
          { id: 'c11ec6t3', title: 'Returns to a Factor' },
          { id: 'c11ec6t4', title: 'Cost: Short run costs - total cost, total fixed cost, total variable cost; Average cost; Average fixed cost, average variable cost and marginal cost - meaning and their relationships' },
          { id: 'c11ec6t5', title: 'Revenue - total, average and marginal revenue - meaning and their relationship' },
          { id: 'c11ec6t6', title: 'Producer\'s equilibrium - meaning and its conditions in terms of marginal revenue-marginal cost' },
          { id: 'c11ec6t7', title: 'Supply, market supply, determinants of supply, supply schedule, supply curve and its slope, movements along and shifts in supply curve, price elasticity of supply; measurement of price elasticity of supply' }
        ]},
        { id: 'c11ec7', title: 'Forms of Market and Price Determination under Perfect Competition with simple applications', officialWeightage: 'Part B (8 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11ec7t1', title: 'Perfect competition - Features; Determination of market equilibrium and effects of shifts in demand and supply' },
          { id: 'c11ec7t2', title: 'Simple Applications of Demand and Supply: Price ceiling, price floor' }
        ]}
      ]
    },
    syllabusCBSE11PCB.subjects.find(s => s.id === 'cbse11_eng')!
  ]
};
