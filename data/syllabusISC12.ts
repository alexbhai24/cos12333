import { SyllabusData } from '../types/syllabus';

// ISC Class 12 (CISCE Board) | Session 2026-27 (Exam 2027)
// Official source: cisce.org
// Streams: PCM, PCB, Commerce, Arts

const isc12Eng = {
  id: 'isc12_eng',
  name: 'English',
  chapters: [
    { id: 'i12e1', title: 'English Language (Paper 1)', officialWeightage: '100 Marks', pyqPriority: 'HIGH', topics: [
      { id: 'i12e1t1', title: 'Composition (400-450 words)' },
      { id: 'i12e1t2', title: 'Directed Writing (Article, Book Review, Film Review, Review of Cultural Programme, Speech Writing, Report Writing, Personal Profile, Statement of Purpose)' },
      { id: 'i12e1t3', title: 'Proposal Writing' },
      { id: 'i12e1t4', title: 'Grammar (Transformation of sentences, Phrasal verbs, Tenses)' },
      { id: 'i12e1t5', title: 'Comprehension' }
    ]},
    { id: 'i12e2', title: 'Literature in English (Paper 2) - Drama', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
      { id: 'i12e2t1', title: 'Macbeth - William Shakespeare (Acts III, IV and V)' }
    ]},
    { id: 'i12e3', title: 'Literature in English (Paper 2) - Poetry', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
      { id: 'i12e3t1', title: 'Prism: A Collection of ISC Poems - Selected poems (e.g., A Doctor\'s Journal Entry, The Dolphins, John Brown, Desiderata, The Spider and the Fly, The Darkling Thrush, Birches, Crossing the Bar)' }
    ]},
    { id: 'i12e4', title: 'Literature in English (Paper 2) - Prose', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
      { id: 'i12e4t1', title: 'Rhapsody: A Collection of ISC Short Stories - Selected stories (e.g., Salvatore, Fritz, Quality, The Chinese Statue, A Gorilla in the Guest Room, The Singing Lesson, The Sound of the Machine, B. Wordsworth)' }
    ]}
  ]
};

const isc12Phy = {
  id: 'isc12_phy',
  name: 'Physics',
  chapters: [
    { id: 'i12p1', title: 'Electrostatics', officialWeightage: 'Unit 1 & 2 (14 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12p1t1', title: 'Electric Charges and Fields, Electrostatic Potential and Capacitance' }] },
    { id: 'i12p2', title: 'Current Electricity', officialWeightage: 'Unit 1 & 2', pyqPriority: 'HIGH', topics: [{ id: 'i12p2t1', title: 'Current Electricity, Kirchhoff\'s Laws, Potentiometer, Wheatstone Bridge' }] },
    { id: 'i12p3', title: 'Magnetic Effects of Current and Magnetism', officialWeightage: 'Unit 3 & 4 (16 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12p3t1', title: 'Moving Charges and Magnetism, Magnetism and Matter' }] },
    { id: 'i12p4', title: 'Electromagnetic Induction and Alternating Currents', officialWeightage: 'Unit 3 & 4', pyqPriority: 'HIGH', topics: [{ id: 'i12p4t1', title: 'Electromagnetic Induction, Alternating Current' }] },
    { id: 'i12p5', title: 'Electromagnetic Waves', officialWeightage: 'Unit 5 & 6 (18 Marks)', pyqPriority: 'MEDIUM', topics: [{ id: 'i12p5t1', title: 'Electromagnetic Waves' }] },
    { id: 'i12p6', title: 'Optics', officialWeightage: 'Unit 5 & 6', pyqPriority: 'HIGH', topics: [{ id: 'i12p6t1', title: 'Ray Optics and Optical Instruments, Wave Optics' }] },
    { id: 'i12p7', title: 'Dual Nature of Radiation and Matter', officialWeightage: 'Unit 7, 8 & 9 (12 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12p7t1', title: 'Dual Nature of Radiation and Matter' }] },
    { id: 'i12p8', title: 'Atoms and Nuclei', officialWeightage: 'Unit 7, 8 & 9', pyqPriority: 'HIGH', topics: [{ id: 'i12p8t1', title: 'Atoms, Nuclei' }] },
    { id: 'i12p9', title: 'Electronic Devices', officialWeightage: 'Unit 7, 8 & 9', pyqPriority: 'HIGH', topics: [{ id: 'i12p9t1', title: 'Semiconductor Electronics: Materials, Devices and Simple Circuits' }] },
    { id: 'i12p10', title: 'Communication Systems', officialWeightage: 'Unit 10 (10 Marks)', pyqPriority: 'MEDIUM', topics: [{ id: 'i12p10t1', title: 'Communication Systems (Note: Check latest syllabus for updates on this unit)' }] }
  ]
};

const isc12Chem = {
  id: 'isc12_chem',
  name: 'Chemistry',
  chapters: [
    { id: 'i12c1', title: 'Solutions', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c1t1', title: 'Types of solutions, Raoult\'s law, Colligative properties' }] },
    { id: 'i12c2', title: 'Electrochemistry', officialWeightage: '9 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c2t1', title: 'Redox, Nernst Equation, Conductance, Kohlrausch\'s Law, Electrolysis' }] },
    { id: 'i12c3', title: 'Chemical Kinetics', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c3t1', title: 'Rate of reaction, Order and Molecularity, Integrated rate equations, Arrhenius equation' }] },
    { id: 'i12c4', title: 'd - and f - Block Elements', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c4t1', title: 'Transition elements, Lanthanoids, Actinoids' }] },
    { id: 'i12c5', title: 'Coordination Compounds', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c5t1', title: 'Werner\'s theory, IUPAC, Isomerism, VBT, CFT' }] },
    { id: 'i12c6', title: 'Haloalkanes and Haloarenes', officialWeightage: '6 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c6t1', title: 'Nomenclature, C-X bond, Substitution reactions (SN1, SN2)' }] },
    { id: 'i12c7', title: 'Alcohols, Phenols and Ethers', officialWeightage: '6 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c7t1', title: 'Preparation, properties, acidic nature, electrophilic substitution' }] },
    { id: 'i12c8', title: 'Aldehydes, Ketones and Carboxylic Acids', officialWeightage: '8 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c8t1', title: 'Nucleophilic addition, Condensation, Acidity of carboxylic acids' }] },
    { id: 'i12c9', title: 'Organic Compounds containing Nitrogen', officialWeightage: '6 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c9t1', title: 'Amines, Diazonium salts' }] },
    { id: 'i12c10', title: 'Biomolecules', officialWeightage: '7 Marks', pyqPriority: 'MEDIUM', topics: [{ id: 'i12c10t1', title: 'Carbohydrates, Proteins, Vitamins, Nucleic Acids' }] }
  ]
};

const isc12Math = {
  id: 'isc12_math',
  name: 'Mathematics',
  chapters: [
    { id: 'i12m1', title: 'Relations and Functions', officialWeightage: '10 Marks (Section A)', pyqPriority: 'HIGH', topics: [{ id: 'i12m1t1', title: 'Relations and Functions, Inverse Trigonometric Functions' }] },
    { id: 'i12m2', title: 'Algebra', officialWeightage: '10 Marks (Section A)', pyqPriority: 'HIGH', topics: [{ id: 'i12m2t1', title: 'Matrices, Determinants' }] },
    { id: 'i12m3', title: 'Calculus', officialWeightage: '32 Marks (Section A)', pyqPriority: 'HIGH', topics: [{ id: 'i12m3t1', title: 'Continuity, Differentiability, Applications of Derivatives, Integrals, Differential Equations' }] },
    { id: 'i12m4', title: 'Probability', officialWeightage: '13 Marks (Section A)', pyqPriority: 'HIGH', topics: [{ id: 'i12m4t1', title: 'Conditional Probability, Bayes\' Theorem, Random Variable' }] },
    { id: 'i12m5', title: 'Vectors (Section B)', officialWeightage: '5 Marks (Section B)', pyqPriority: 'HIGH', topics: [{ id: 'i12m5t1', title: 'Vectors and their properties' }] },
    { id: 'i12m6', title: 'Three-Dimensional Geometry (Section B)', officialWeightage: '7 Marks (Section B)', pyqPriority: 'HIGH', topics: [{ id: 'i12m6t1', title: 'Direction cosines, lines and planes in 3D space' }] },
    { id: 'i12m7', title: 'Application of Integrals (Section B)', officialWeightage: '3 Marks (Section B)', pyqPriority: 'MEDIUM', topics: [{ id: 'i12m7t1', title: 'Area bounded by curves' }] },
    { id: 'i12m8', title: 'Application of Calculus (Section C)', officialWeightage: '5 Marks (Section C)', pyqPriority: 'HIGH', topics: [{ id: 'i12m8t1', title: 'Application of Calculus in Commerce and Economics' }] },
    { id: 'i12m9', title: 'Linear Regression (Section C)', officialWeightage: '5 Marks (Section C)', pyqPriority: 'HIGH', topics: [{ id: 'i12m9t1', title: 'Linear Regression lines and coefficients' }] },
    { id: 'i12m10', title: 'Linear Programming (Section C)', officialWeightage: '5 Marks (Section C)', pyqPriority: 'HIGH', topics: [{ id: 'i12m10t1', title: 'LPP Mathematical formulation and graphical solution' }] }
  ]
};

export const syllabusISC12PCM: SyllabusData = {
  id: 'isc_12_pcm',
  examOrBoard: 'ISC',
  category: 'School',
  classGrade: 'Class 12',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    isc12Eng,
    isc12Phy,
    isc12Chem,
    isc12Math
  ]
};

const isc12Bio = {
  id: 'isc12_bio',
  name: 'Biology',
  chapters: [
    { id: 'i12b1', title: 'Reproduction', officialWeightage: '16 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12b1t1', title: 'Reproduction in Organisms, Sexual Reproduction in Flowering Plants, Human Reproduction, Reproductive Health' }] },
    { id: 'i12b2', title: 'Genetics and Evolution', officialWeightage: '20 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12b2t1', title: 'Principles of Inheritance and Variation, Molecular Basis of Inheritance, Evolution' }] },
    { id: 'i12b3', title: 'Biology and Human Welfare', officialWeightage: '12 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12b3t1', title: 'Human Health and Disease, Strategies for Enhancement in Food Production, Microbes in Human Welfare' }] },
    { id: 'i12b4', title: 'Biotechnology and its Applications', officialWeightage: '12 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12b4t1', title: 'Biotechnology: Principles and Processes, Biotechnology and its Applications' }] },
    { id: 'i12b5', title: 'Ecology and Environment', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12b5t1', title: 'Organisms and Populations, Ecosystem, Biodiversity and Conservation, Environmental Issues' }] }
  ]
};

export const syllabusISC12PCB: SyllabusData = {
  id: 'isc_12_pcb',
  examOrBoard: 'ISC',
  category: 'School',
  classGrade: 'Class 12',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    isc12Eng,
    isc12Phy,
    isc12Chem,
    isc12Bio
  ]
};

export const syllabusISC12Commerce: SyllabusData = {
  id: 'isc_12_commerce',
  examOrBoard: 'ISC',
  category: 'School',
  classGrade: 'Class 12',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    isc12Eng,
    {
      id: 'isc12_acc',
      name: 'Accounts',
      chapters: [
        { id: 'i12a1', title: 'Partnership Accounts', officialWeightage: 'Section A (40 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12a1t1', title: 'Fundamentals, Goodwill, Reconstitution (Admission, Retirement, Death), Dissolution' }] },
        { id: 'i12a2', title: 'Joint Stock Company Accounts', officialWeightage: 'Section A (20 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12a2t1', title: 'Issue of Shares, Issue of Debentures, Redemption of Debentures' }] },
        { id: 'i12a3', title: 'Financial Statement Analysis', officialWeightage: 'Section B (20 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12a3t1', title: 'Financial Statements of a Company, Comparative and Common-Size Statements, Ratio Analysis, Cash Flow Statement' }] }
      ]
    },
    {
      id: 'isc12_com',
      name: 'Commerce',
      chapters: [
        { id: 'i12c1', title: 'Business Environment', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c1t1', title: 'Concept, Dimensions, SWOT Analysis' }] },
        { id: 'i12c2', title: 'Financing', officialWeightage: '20 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c2t1', title: 'Capital Structure, Sources of Finance (Long and Short Term), Banking' }] },
        { id: 'i12c3', title: 'Management', officialWeightage: '30 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c3t1', title: 'Nature, Principles (Fayol, Taylor), Functions (Planning, Organising, Staffing, Directing, Controlling)' }] },
        { id: 'i12c4', title: 'Marketing', officialWeightage: '20 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12c4t1', title: 'Concept, Marketing Mix (Product, Price, Place, Promotion), Consumer Protection' }] }
      ]
    },
    {
      id: 'isc12_eco',
      name: 'Economics',
      chapters: [
        { id: 'i12ec1', title: 'Micro Economic Theory', officialWeightage: '40 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12ec1t1', title: 'Demand, Elasticity of Demand, Supply, Market Mechanism, Laws of Returns, Cost and Revenue, Forms of Market, Producer\'s Equilibrium' }] },
        { id: 'i12ec2', title: 'Macro Economics', officialWeightage: '40 Marks', pyqPriority: 'HIGH', topics: [{ id: 'i12ec2t1', title: 'National Income, Money and Banking, Determination of Income and Employment, Government Budget, Balance of Payment and Exchange Rate' }] }
      ]
    }
  ]
};

export const syllabusISC12Arts: SyllabusData = {
  id: 'isc_12_arts',
  examOrBoard: 'ISC',
  category: 'School',
  classGrade: 'Class 12',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    isc12Eng,
    {
      id: 'isc12_his',
      name: 'History',
      chapters: [
        { id: 'i12h1', title: 'Indian History', officialWeightage: 'Section A (40 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12h1t1', title: 'Towards Independence and Partition, Establishment and Development of Indian Democracy, Challenges to Indian Democracy, Changing Face of the Indian Democracy, India\'s Foreign Policy, Movements for Women\'s Rights' }] },
        { id: 'i12h2', title: 'World History', officialWeightage: 'Section B (40 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12h2t1', title: 'World War II, De-colonisation, Cold War, Protest Movements (Civil Rights, Anti-Apartheid, Feminist Movement), Middle East' }] }
      ]
    },
    {
      id: 'isc12_pol',
      name: 'Political Science',
      chapters: [
        { id: 'i12pol1', title: 'Constitution and Government', officialWeightage: 'Section A (40 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12pol1t1', title: 'Forms of Government, Constitution, Franchise and Representation, The Legislature, The Executive, The Judiciary' }] },
        { id: 'i12pol2', title: 'Indian Government and Politics', officialWeightage: 'Section B (40 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12pol2t1', title: 'Indian Constitution, Fundamental Rights and Directive Principles, Local Self-Government, Democracy in India' }] }
      ]
    },
    {
      id: 'isc12_geo',
      name: 'Geography',
      chapters: [
        { id: 'i12g1', title: 'Physical Environment', officialWeightage: 'Section A (30 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12g1t1', title: 'Locational Setting of India, Relief, Drainage, Climate, Natural Vegetation' }] },
        { id: 'i12g2', title: 'Population and Economy', officialWeightage: 'Section B (30 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12g2t1', title: 'Population, Migration, Settlements, Agriculture, Industries, Transport and Communication, Regional Economic Development' }] },
        { id: 'i12g3', title: 'Map Work', officialWeightage: 'Section C (10 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'i12g3t1', title: 'Topographical Map, Map of India' }] }
      ]
    }
  ]
};
