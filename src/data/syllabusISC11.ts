import { SyllabusData } from '../types/syllabus';

// ISC Class 11 (CISCE Board) | Session 2026-27 (Exam 2027)
// Official source: cisce.org
// Streams: PCM, PCB, Commerce, Arts

const isc11Eng = {
  id: 'isc11_eng',
  name: 'English',
  chapters: [
    { id: 'i11e1', title: 'English Language (Paper 1)', officialWeightage: '100 Marks', pyqPriority: 'HIGH', topics: [
      { id: 'i11e1t1', title: 'Composition (400-450 words)' },
      { id: 'i11e1t2', title: 'Directed Writing (Article, Book Review, Film Review, Review of Cultural Programme, Speech Writing, Report Writing, Personal Profile, Statement of Purpose)' },
      { id: 'i11e1t3', title: 'Proposal Writing' },
      { id: 'i11e1t4', title: 'Grammar (Transformation of sentences, Phrasal verbs, Tenses)' },
      { id: 'i11e1t5', title: 'Comprehension' }
    ]},
    { id: 'i11e2', title: 'Literature in English (Paper 2) - Drama', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
      { id: 'i11e2t1', title: 'Macbeth - William Shakespeare (Acts I and II)' }
    ]},
    { id: 'i11e3', title: 'Literature in English (Paper 2) - Poetry', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
      { id: 'i11e3t1', title: 'Prism: A Collection of ISC Poems - Selected poems (e.g., A Doctor\'s Journal Entry, The Dolphins, John Brown, Desiderata, The Spider and the Fly)' }
    ]},
    { id: 'i11e4', title: 'Literature in English (Paper 2) - Prose', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
      { id: 'i11e4t1', title: 'Rhapsody: A Collection of ISC Short Stories - Selected stories (e.g., Salvatore, Fritz, Quality, The Chinese Statue, A Gorilla in the Guest Room)' }
    ]}
  ]
};

const isc11Phy = {
  id: 'isc11_phy',
  name: 'Physics',
  chapters: [
    { id: 'i11p1', title: 'Physical World and Measurement', officialWeightage: 'Unit 1 & 2 (23 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11p1t1', title: 'Physical World, Units and Measurements, Dimensional Analysis, Errors' }] },
    { id: 'i11p2', title: 'Kinematics', officialWeightage: 'Unit 1 & 2', pyqPriority: 'HIGH', topics: [{ id: 'i11p2t1', title: 'Motion in a Straight Line, Motion in a Plane (Projectile, Circular)' }] },
    { id: 'i11p3', title: 'Laws of Motion', officialWeightage: 'Unit 3 (17 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11p3t1', title: 'Newton\'s Laws, Conservation of Momentum, Friction, Dynamics of Circular Motion' }] },
    { id: 'i11p4', title: 'Work, Energy and Power', officialWeightage: 'Unit 4,5,6 (17 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11p4t1', title: 'Work-Energy Theorem, Conservative Forces, Collisions' }] },
    { id: 'i11p5', title: 'Motion of System of Particles and Rigid Body', officialWeightage: 'Unit 4,5,6', pyqPriority: 'HIGH', topics: [{ id: 'i11p5t1', title: 'Centre of Mass, Torque, Angular Momentum, Moment of Inertia' }] },
    { id: 'i11p6', title: 'Gravitation', officialWeightage: 'Unit 4,5,6', pyqPriority: 'HIGH', topics: [{ id: 'i11p6t1', title: 'Kepler\'s laws, Universal Law of Gravitation, Escape Velocity, Satellites' }] },
    { id: 'i11p7', title: 'Properties of Bulk Matter', officialWeightage: 'Unit 7,8,9 (20 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11p7t1', title: 'Elasticity, Fluid Mechanics (Pascal, Stokes, Bernoulli, Surface Tension), Thermal Properties' }] },
    { id: 'i11p8', title: 'Heat and Thermodynamics', officialWeightage: 'Unit 7,8,9', pyqPriority: 'HIGH', topics: [{ id: 'i11p8t1', title: 'First and Second Laws of Thermodynamics, Isothermal & Adiabatic Processes' }] },
    { id: 'i11p9', title: 'Behaviour of Perfect Gases and Kinetic Theory of Gases', officialWeightage: 'Unit 7,8,9', pyqPriority: 'MEDIUM', topics: [{ id: 'i11p9t1', title: 'Equation of State, Kinetic Theory, Degrees of Freedom' }] },
    { id: 'i11p10', title: 'Oscillations and Waves', officialWeightage: 'Unit 10 (13 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11p10t1', title: 'SHM, Springs, Pendulum, Transverse & Longitudinal Waves, Superposition, Beats, Doppler Effect' }] }
  ]
};

const isc11Chem = {
  id: 'isc11_chem',
  name: 'Chemistry',
  chapters: [
    { id: 'i11c1', title: 'Some Basic Concepts of Chemistry', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c1t1', title: 'Mole concept, Stoichiometry, Concentration terms' }] },
    { id: 'i11c2', title: 'Structure of Atom', officialWeightage: '9 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c2t1', title: 'Bohr model, Quantum mechanics, Quantum numbers, Electronic configuration' }] },
    { id: 'i11c3', title: 'Classification of Elements and Periodicity in Properties', officialWeightage: '6 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c3t1', title: 'Periodic trends: IE, EA, EN, atomic radii' }] },
    { id: 'i11c4', title: 'Chemical Bonding and Molecular Structure', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c4t1', title: 'VSEPR, VBT, Hybridisation, MOT, Hydrogen bonding' }] },
    { id: 'i11c5', title: 'State of Matter: Gases and Liquids', officialWeightage: 'Removed in newer syllabus / Merged', pyqPriority: 'LOW', topics: [{ id: 'i11c5t1', title: 'Gas laws, Ideal gas equation (usually covered in basics or physics)' }] },
    { id: 'i11c6', title: 'Chemical Thermodynamics', officialWeightage: '9 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c6t1', title: 'First law, Enthalpy, Hess\'s Law, Entropy, Gibbs Free Energy' }] },
    { id: 'i11c7', title: 'Equilibrium', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c7t1', title: 'Chemical and Ionic equilibrium, Le Chatelier\'s, pH, Buffer, Solubility Product' }] },
    { id: 'i11c8', title: 'Redox Reactions', officialWeightage: '4 Marks', pyqPriority: 'MEDIUM', topics: [{ id: 'i11c8t1', title: 'Oxidation number, Balancing redox equations' }] },
    { id: 'i11c9', title: 'Hydrogen, s-Block, p-Block', officialWeightage: 'Often reduced/adjusted', pyqPriority: 'LOW', topics: [{ id: 'i11c9t1', title: 'Trends and properties (Check specific year directives)' }] },
    { id: 'i11c10', title: 'Organic Chemistry: Some Basic Principles and Techniques', officialWeightage: '11 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c10t1', title: 'IUPAC, Isomerism, Inductive/Mesomeric effects, Reaction intermediates' }] },
    { id: 'i11c11', title: 'Hydrocarbons', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c11t1', title: 'Alkanes, Alkenes, Alkynes, Aromatic hydrocarbons' }] }
  ]
};

const isc11Math = {
  id: 'isc11_math',
  name: 'Mathematics',
  chapters: [
    { id: 'i11m1', title: 'Sets and Functions', officialWeightage: '22 Marks (Section A)', pyqPriority: 'HIGH', topics: [{ id: 'i11m1t1', title: 'Sets, Relations and Functions, Trigonometry' }] },
    { id: 'i11m2', title: 'Algebra', officialWeightage: '26 Marks (Section A)', pyqPriority: 'HIGH', topics: [{ id: 'i11m2t1', title: 'Principle of Mathematical Induction, Complex Numbers, Quadratic Equations, Linear Inequalities, Permutations & Combinations, Binomial Theorem, Sequence and Series' }] },
    { id: 'i11m3', title: 'Coordinate Geometry', officialWeightage: '16 Marks (Section A)', pyqPriority: 'HIGH', topics: [{ id: 'i11m3t1', title: 'Straight Lines, Circles' }] },
    { id: 'i11m4', title: 'Calculus', officialWeightage: '10 Marks (Section A)', pyqPriority: 'HIGH', topics: [{ id: 'i11m4t1', title: 'Limits and Derivatives' }] },
    { id: 'i11m5', title: 'Statistics and Probability', officialWeightage: '6 Marks (Section A)', pyqPriority: 'HIGH', topics: [{ id: 'i11m5t1', title: 'Statistics (Measures of Dispersion), Probability' }] },
    { id: 'i11m6', title: 'Conic Section (Section B)', officialWeightage: '8 Marks (Section B)', pyqPriority: 'HIGH', topics: [{ id: 'i11m6t1', title: 'Parabola, Ellipse, Hyperbola' }] },
    { id: 'i11m7', title: 'Introduction to 3D Geometry (Section B)', officialWeightage: '6 Marks (Section B)', pyqPriority: 'MEDIUM', topics: [{ id: 'i11m7t1', title: '3D Geometry basics' }] },
    { id: 'i11m8', title: 'Mathematical Reasoning (Section B)', officialWeightage: '6 Marks (Section B)', pyqPriority: 'LOW', topics: [{ id: 'i11m8t1', title: 'Mathematical Reasoning' }] },
    { id: 'i11m9', title: 'Statistics (Section C)', officialWeightage: '10 Marks (Section C)', pyqPriority: 'HIGH', topics: [{ id: 'i11m9t1', title: 'Correlation Analysis, Index Numbers, Moving Averages' }] },
    { id: 'i11m10', title: 'Basic 3D Geometry (Section C)', officialWeightage: '10 Marks (Section C)', pyqPriority: 'MEDIUM', topics: [{ id: 'i11m10t1', title: 'Line in 3D' }] }
  ]
};

export const syllabusISC11PCM: SyllabusData = {
  id: 'isc_11_pcm',
  examOrBoard: 'ISC',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    isc11Eng,
    isc11Phy,
    isc11Chem,
    isc11Math
  ]
};

const isc11Bio = {
  id: 'isc11_bio',
  name: 'Biology',
  chapters: [
    { id: 'i11b1', title: 'Diversity of Living Organisms', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11b1t1', title: 'The Living World, Biological Classification, Plant Kingdom, Animal Kingdom' }] },
    { id: 'i11b2', title: 'Structural Organisation in Animals and Plants', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11b2t1', title: 'Morphology of Flowering Plants, Anatomy of Flowering Plants, Structural Organisation in Animals' }] },
    { id: 'i11b3', title: 'Cell: Structure and Function', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11b3t1', title: 'Cell-The Unit of Life, Biomolecules, Cell Cycle and Cell Division' }] },
    { id: 'i11b4', title: 'Plant Physiology', officialWeightage: '12 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11b4t1', title: 'Photosynthesis in Higher Plants, Respiration in Plants, Plant Growth and Development' }] },
    { id: 'i11b5', title: 'Human Physiology', officialWeightage: '18 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11b5t1', title: 'Breathing and Exchange of Gases, Body Fluids and Circulation, Excretory Products, Locomotion and Movement, Neural Control, Chemical Coordination' }] }
  ]
};

export const syllabusISC11PCB: SyllabusData = {
  id: 'isc_11_pcb',
  examOrBoard: 'ISC',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    isc11Eng,
    isc11Phy,
    isc11Chem,
    isc11Bio
  ]
};

export const syllabusISC11Commerce: SyllabusData = {
  id: 'isc_11_commerce',
  examOrBoard: 'ISC',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    isc11Eng,
    {
      id: 'isc11_acc',
      name: 'Accounts',
      chapters: [
        { id: 'i11a1', title: 'Basic Accounting Concepts', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11a1t1', title: 'Introduction to Accounting, Basic Accounting Terms, GAAP, Accounting Standards' }] },
        { id: 'i11a2', title: 'Journal, Ledger and Trial Balance', officialWeightage: '20 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11a2t1', title: 'Vouchers, Journal, Cash Book, Petty Cash Book, Special Purpose Books, Ledger, Trial Balance' }] },
        { id: 'i11a3', title: 'Bank Reconciliation Statement', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11a3t1', title: 'BRS meaning and preparation' }] },
        { id: 'i11a4', title: 'Depreciation, Provisions and Reserves', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11a4t1', title: 'Methods of Depreciation (SLM, WDV), Provisions and Reserves' }] },
        { id: 'i11a5', title: 'Bills of Exchange', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11a5t1', title: 'Accounting for Bills of Exchange' }] },
        { id: 'i11a6', title: 'Final Accounts and Concept of Trading', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11a6t1', title: 'Capital and Revenue, Final Accounts with and without adjustments' }] },
        { id: 'i11a7', title: 'Accounts from Incomplete Records', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11a7t1', title: 'Single Entry System' }] },
        { id: 'i11a8', title: 'Non-Trading Organisation', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11a8t1', title: 'Receipts and Payments, Income and Expenditure, Balance Sheet' }] }
      ]
    },
    {
      id: 'isc11_com',
      name: 'Commerce',
      chapters: [
        { id: 'i11c1', title: 'Nature and Purpose of Business', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c1t1', title: 'Classification of human activities, Nature and objectives of business, Classification of business activities' }] },
        { id: 'i11c2', title: 'Forms of Business Organisations', officialWeightage: '20 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c2t1', title: 'Sole Trader, Partnership, Joint Hindu Family, Cooperative Society, Joint Stock Company, Formation of a Company, Public Enterprises' }] },
        { id: 'i11c3', title: 'Social Responsibility of Business and Business Ethics', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c3t1', title: 'Concept, case for social responsibility, Business ethics and environment protection' }] },
        { id: 'i11c4', title: 'Emerging Modes of Business', officialWeightage: '10 Marks', pyqPriority: 'MEDIUM', topics: [{ id: 'i11c4t1', title: 'E-business, Outsourcing, Smart Cards' }] },
        { id: 'i11c5', title: 'Stock Exchange', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c5t1', title: 'Meaning, Functions, BSE, NSE, SEBI' }] },
        { id: 'i11c6', title: 'Trade', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c6t1', title: 'Internal Trade, Wholesale and Retail, International Trade, Export and Import' }] },
        { id: 'i11c7', title: 'Foreign Trade', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c7t1', title: 'WTO, Balance of Trade and Balance of Payment' }] },
        { id: 'i11c8', title: 'Insurance', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11c8t1', title: 'Principles of Insurance, Life, Fire, Marine Insurance' }] }
      ]
    },
    {
      id: 'isc11_eco',
      name: 'Economics',
      chapters: [
        { id: 'i11ec1', title: 'Understanding Economics', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11ec1t1', title: 'Definition, Micro and Macro Economics, Basic Economic Entities' }] },
        { id: 'i11ec2', title: 'Indian Economic Development', officialWeightage: '40 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11ec2t1', title: 'Parameters of Development, Planning and Economic Development in India, Structural Changes in the Indian Economy, Poverty and Human Capital Formation, Employment' }] },
        { id: 'i11ec3', title: 'Statistics', officialWeightage: '25 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i11ec3t1', title: 'Statistics: Definition, Scope, Collection, Organisation and Presentation of Data, Measures of Central Value, Measures of Dispersion, Correlation, Index Numbers' }] }
      ]
    }
  ]
};

export const syllabusISC11Arts: SyllabusData = {
  id: 'isc_11_arts',
  examOrBoard: 'ISC',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    isc11Eng,
    {
      id: 'isc11_his',
      name: 'History',
      chapters: [
        { id: 'i11h1', title: 'Indian History', officialWeightage: 'Section A (40 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11h1t1', title: 'Growth of Nationalism, Emergence of the colonial economy, Social and Religious Movements, Protest Movements, Gandhian Nationalism' }] },
        { id: 'i11h2', title: 'World History', officialWeightage: 'Section B (40 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11h2t1', title: 'World War I, Peace Settlements, The Great Depression, Rise of Communism in Russia, Rise of Fascism and Nazism, The aggressive policy of Japan, World War II' }] }
      ]
    },
    {
      id: 'isc11_pol',
      name: 'Political Science',
      chapters: [
        { id: 'i11pol1', title: 'Political Theory', officialWeightage: 'Section A (40 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11pol1t1', title: 'Introduction to Political Science, The Origin of the State, Political Ideologies, Sovereignty, Law, Liberty, Equality, Justice' }] },
        { id: 'i11pol2', title: 'Contemporary International Relations', officialWeightage: 'Section B (40 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11pol2t1', title: 'End of Cold War, Unipolar World, Regional Organisations, The UN, Globalisation' }] }
      ]
    },
    {
      id: 'isc11_geo',
      name: 'Geography',
      chapters: [
        { id: 'i11g1', title: 'Physical Geography', officialWeightage: 'Section A (40 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11g1t1', title: 'Formation of the Earth, Earth\'s Interior, Rocks, Endogenetic and Exogenetic processes, Fluvial, Glacial, Aeolian, Coastal Landforms, Atmosphere, Insolation, Pressure, Moisture, Oceans' }] },
        { id: 'i11g2', title: 'Human Geography', officialWeightage: 'Section B (15 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11g2t1', title: 'Man-Environment relationship, Population' }] },
        { id: 'i11g3', title: 'Map Work', officialWeightage: 'Section C (15 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i11g3t1', title: 'Map pointing and identification' }] }
      ]
    }
  ]
};
