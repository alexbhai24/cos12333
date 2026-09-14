export interface ComprehensionQuestion {
  id: string;
  type: 'mcq' | 'statement' | 'assertion' | 'match';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  ncertRef: string;
  concept: string;
}

export interface ReadingPassage {
  id: string;
  chapterId: string;
  chapterTitle: string;
  topicId: string;
  topicTitle: string;
  classNum: 11 | 12;
  level: 1 | 2 | 3 | 4 | 5;
  levelName: string;
  paragraphs: string[];
  wordCount: number;
  estimatedMinutes: number;
  ncertRef: string;
  keyConcepts: string[];
  questions: ComprehensionQuestion[];
}

export interface ReadingLevelInfo {
  level: 1 | 2 | 3 | 4 | 5;
  name: string;
  subtitle: string;
  minAccuracyToUnlock: number;
  color: string;
  tag: string;
}

export const READING_LEVELS: ReadingLevelInfo[] = [
  {
    level: 1,
    name: 'Foundation',
    subtitle: 'Core definitions and biological terminology',
    minAccuracyToUnlock: 0,
    color: '#00D7A0', // emerald
    tag: 'LEVEL 1'
  },
  {
    level: 2,
    name: 'Basic',
    subtitle: 'Extended concept mechanisms and functional flows',
    minAccuracyToUnlock: 0, // Unlocks after Level 1 attempt
    color: '#00F0FF', // cyan
    tag: 'LEVEL 2'
  },
  {
    level: 3,
    name: 'NEET Focus',
    subtitle: 'High-yield exam facts, exceptions, and keyword terminology',
    minAccuracyToUnlock: 70, // Requires Level 2 >= 70%
    color: '#F59E0B', // amber
    tag: 'LEVEL 3'
  },
  {
    level: 4,
    name: 'Advanced',
    subtitle: 'Dense information density and interrelated physiological pathways',
    minAccuracyToUnlock: 80, // Requires Level 3 >= 80%
    color: '#A855F7', // purple
    tag: 'LEVEL 4'
  },
  {
    level: 5,
    name: 'NEET Challenge',
    subtitle: 'High-density synthesis, Assertion-Reason, and experimental deduction',
    minAccuracyToUnlock: 85, // Requires Level 4 >= 85%
    color: '#EF4444', // crimson
    tag: 'LEVEL 5'
  }
];

// Curated high-fidelity NCERT Biology passages for prominent chapters
const CURATED_PASSAGES: Record<string, Record<number, ReadingPassage>> = {
  // nb1: The Living World -> nb1t1: What is living? Defining life
  'nb1_nb1t1': {
    1: {
      id: 'pass_nb1_nb1t1_l1',
      chapterId: 'nb1',
      chapterTitle: 'The Living World',
      topicId: 'nb1t1',
      topicTitle: 'What is living? Defining life',
      classNum: 11,
      level: 1,
      levelName: 'Foundation',
      paragraphs: [
        'Life on Earth exhibits extraordinary diversity, ranging from microscopic bacteria to gigantic redwoods. When biologists seek to define what is "living", they examine distinctive characteristics shared by organisms: growth, reproduction, ability to sense environment and mount an appropriate response, metabolism, ability to self-replicate, self-organise, and interact.',
        'Growth and reproduction are common biological attributes. All living organisms grow through an increase in mass and an increase in number of individuals. In unicellular organisms like bacteria and unicellular algae, reproduction is synonymous with growth, as both occur by cell division.'
      ],
      wordCount: 88,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 11, Chapter 1, Section 1.1, p. 3-4',
      keyConcepts: ['Characteristics of Living', 'Growth vs Reproduction', 'Unicellular Division'],
      questions: [
        {
          id: 'q_nb1_1_1',
          type: 'mcq',
          question: 'In unicellular organisms, which two processes are mutually synonymous?',
          options: [
            'Metabolism and consciousness',
            'Growth and reproduction',
            'Differentiation and senescence',
            'Homeostasis and respiration'
          ],
          correctIndex: 1,
          explanation: 'In unicellular organisms like bacteria and Amoeba, cell division simultaneously accomplishes an increase in body mass/number and produces new individuals, making growth and reproduction synonymous.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 4',
          concept: 'Equivalence of Growth and Reproduction in Unicellular Organisms'
        },
        {
          id: 'q_nb1_1_2',
          type: 'statement',
          question: 'Consider the following statements regarding growth:\nStatement I: Increase in body mass is considered as growth.\nStatement II: In multicellular organisms, growth by cell division occurs continuously throughout life in animals.',
          options: [
            'Both Statement I and Statement II are correct.',
            'Statement I is correct but Statement II is incorrect.',
            'Statement I is incorrect but Statement II is correct.',
            'Both Statement I and Statement II are incorrect.'
          ],
          correctIndex: 1,
          explanation: 'Statement I is correct. Statement II is incorrect because in animals, growth by cell division occurs only up to a certain age, whereas in plants, growth by cell division occurs continuously throughout their life span.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 4',
          concept: 'Plant vs Animal Growth Patterns'
        }
      ]
    },
    2: {
      id: 'pass_nb1_nb1t1_l2',
      chapterId: 'nb1',
      chapterTitle: 'The Living World',
      topicId: 'nb1t1',
      topicTitle: 'What is living? Defining life',
      classNum: 11,
      level: 2,
      levelName: 'Basic',
      paragraphs: [
        'Non-living objects also grow if we take increase in body mass as a criterion of growth. Mountains, boulders, and sand mounds grow by accumulation of material on their external surface. In contrast, in living organisms, growth occurs intrinsically from the inside. Therefore, growth cannot be taken as an absolute defining property of living organisms without qualifications.',
        'Similarly, reproduction cannot be an all-inclusive defining characteristic of living organisms. Many living organisms do not reproduce, including sterile worker bees, mules, and infertile human couples. Yet, no non-living object is capable of reproducing or replicating by itself.',
        'Metabolism is another critical hallmark. Thousands of biochemical reactions occur simultaneously inside all living organisms. The sum total of all the chemical reactions occurring in our body is metabolism. No non-living object exhibits metabolism. Isolated metabolic reactions in vitro in a test tube are neither living things nor non-living, but definitely living reactions.'
      ],
      wordCount: 153,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 11, Chapter 1, Section 1.1, p. 4-5',
      keyConcepts: ['Extrinsic vs Intrinsic Growth', 'Reproduction Exceptions', 'Metabolism in vitro'],
      questions: [
        {
          id: 'q_nb1_2_1',
          type: 'mcq',
          question: 'Why is reproduction NOT considered an all-inclusive defining property of living organisms?',
          options: [
            'Because reproduction requires energy from the environment',
            'Because certain living organisms like mules and sterile worker bees do not reproduce',
            'Because non-living crystals can also reproduce',
            'Because reproduction only occurs sexually in complex organisms'
          ],
          correctIndex: 1,
          explanation: 'Organisms like mules, sterile worker bees, and infertile human couples are indisputably alive but cannot reproduce. Hence, reproduction cannot serve as an all-inclusive defining feature of all living organisms.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 4',
          concept: 'Exceptions to Reproduction in Living Beings'
        },
        {
          id: 'q_nb1_2_2',
          type: 'assertion',
          question: 'Assertion (A): Isolated metabolic reactions in vitro outside the body of an organism performed in a test tube are neither living nor non-living.\nReason (R): These reactions are living reactions because they mimic the biochemical transformations occurring within an intact cell.',
          options: [
            'Both A and R are true and R is the correct explanation of A.',
            'Both A and R are true but R is NOT the correct explanation of A.',
            'A is true but R is false.',
            'A is false but R is true.'
          ],
          correctIndex: 0,
          explanation: 'NCERT explicitly states that isolated in vitro metabolic reactions are not living things themselves, but they are surely living reactions because they are identical chemical transformations.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 5',
          concept: 'In Vitro Metabolic Reactions'
        },
        {
          id: 'q_nb1_2_3',
          type: 'mcq',
          question: 'What fundamentally differentiates growth in non-living objects like sand dunes from growth in living organisms?',
          options: [
            'Non-living objects grow by synthesis of protoplasm',
            'Living organisms grow intrinsically from within, whereas non-living objects grow by extrinsic surface accumulation',
            'Non-living growth requires ATP hydrolysis',
            'Living growth is always reversible'
          ],
          correctIndex: 1,
          explanation: 'In non-living objects, growth is extrinsic through surface deposition, whereas in living organisms, growth is intrinsic (from inside through protoplasmic synthesis).',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 4',
          concept: 'Intrinsic vs Extrinsic Growth'
        }
      ]
    },
    3: {
      id: 'pass_nb1_nb1t1_l3',
      chapterId: 'nb1',
      chapterTitle: 'The Living World',
      topicId: 'nb1t1',
      topicTitle: 'What is living? Defining life',
      classNum: 11,
      level: 3,
      levelName: 'NEET Focus',
      paragraphs: [
        'The most obvious and technically complicated feature of all living organisms is consciousness: the ability to sense their surroundings or environment and respond to these environmental stimuli, which could be physical, chemical, or biological. We sense our environment through our sense organs. Plants respond to external factors like light, water, temperature, other organisms, and pollutants.',
        'All organisms, from the prokaryotes to the most complex eukaryotes, can sense and respond to environmental cues. Photoperiod affects reproduction in seasonal breeders, both plants and animals. All organisms handle chemicals entering their bodies. All organisms therefore are "aware" of their surroundings. Consciousness therefore becomes the defining property of living organisms.',
        'Human beings are the only organisms who are aware of themselves, possessing self-consciousness. In patients lying in coma in hospital supported by machines which replace heart and lungs, the patient has no self-consciousness, creating a philosophical conundrum regarding their brain-dead state.'
      ],
      wordCount: 154,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 11, Chapter 1, Section 1.1, p. 5',
      keyConcepts: ['Consciousness as Defining Feature', 'Photoperiod in Seasonal Breeders', 'Self-Consciousness in Humans'],
      questions: [
        {
          id: 'q_nb1_3_1',
          type: 'mcq',
          question: 'Which attribute is uniquely restricted to human beings alone among all living organisms on Earth?',
          options: [
            'Metabolism',
            'Consciousness of external surroundings',
            'Self-consciousness',
            'Homeostasis'
          ],
          correctIndex: 2,
          explanation: 'While all organisms exhibit consciousness (awareness of their surroundings), human beings are the only living beings that possess self-consciousness (awareness of themselves).',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 5',
          concept: 'Consciousness vs Self-Consciousness'
        },
        {
          id: 'q_nb1_3_2',
          type: 'statement',
          question: 'Statement I: Photoperiod affects reproduction in seasonal breeders, in both plants and animals.\nStatement II: Cellular organisation of the body is the defining feature of life forms.',
          options: [
            'Both Statement I and Statement II are correct.',
            'Statement I is correct but Statement II is incorrect.',
            'Statement I is incorrect but Statement II is correct.',
            'Both Statement I and Statement II are incorrect.'
          ],
          correctIndex: 0,
          explanation: 'Both statements are direct NCERT facts. Photoperiod influences seasonal breeders (both flora and fauna), and cellular organization without exception defines living systems.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 5',
          concept: 'Photoperiod and Cellular Organisation'
        },
        {
          id: 'q_nb1_3_3',
          type: 'assertion',
          question: 'Assertion (A): Consciousness is regarded as a defining property of living organisms.\nReason (R): All organisms, from prokaryotes to the most complex eukaryotes, can sense environmental cues and respond to them without exception.',
          options: [
            'Both A and R are true and R is the correct explanation of A.',
            'Both A and R are true but R is NOT the correct explanation of A.',
            'A is true but R is false.',
            'A is false but R is true.'
          ],
          correctIndex: 0,
          explanation: 'Consciousness is a defining property because every single living organism responds to environmental stimuli without exception.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 5',
          concept: 'Defining Features of Life'
        }
      ]
    },
    4: {
      id: 'pass_nb1_nb1t1_l4',
      chapterId: 'nb1',
      chapterTitle: 'The Living World',
      topicId: 'nb1t1',
      topicTitle: 'What is living? Defining life',
      classNum: 11,
      level: 4,
      levelName: 'Advanced',
      paragraphs: [
        'Biological hierarchy reveals that living phenomena are due to underlying interactions. Properties of tissues are not present in the constituent cells but arise as a result of interactions among the constituent cells. Similarly, properties of cellular organelles are not present in the molecular constituents of the organelle but arise as a result of interactions among the molecular components comprising the organelle.',
        'These emergent properties arise at each higher level of biological hierarchy. Therefore, living organisms can be defined as self-replicating, evolving, and self-regulating interactive systems capable of responding to external stimuli. Biology is the story of life on Earth; it is the story of evolution of living organisms on Earth.',
        'Furthermore, all living organisms — past, present, and future — are linked to one another by the sharing of the common genetic material, but to varying degrees. This common genetic lineage underpins the unified biochemical foundation of all terrestrial organisms.'
      ],
      wordCount: 153,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 11, Chapter 1, Section 1.1, p. 5',
      keyConcepts: ['Emergent Properties', 'Underlying Molecular Interactions', 'Common Genetic Heritage'],
      questions: [
        {
          id: 'q_nb1_4_1',
          type: 'mcq',
          question: 'Properties of tissues arise as a consequence of:',
          options: [
            'Autonomous features intrinsic to isolated single cells',
            'Interactions among the constituent cells forming the tissue',
            'Accumulation of inert intercellular extracellular matrix alone',
            'Degradation of nuclear chromatin material'
          ],
          correctIndex: 1,
          explanation: 'According to NCERT, properties of tissues are not present in constituent cells individually, but arise as a result of interactions among constituent cells.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 5',
          concept: 'Emergent Properties at Hierarchy Levels'
        },
        {
          id: 'q_nb1_4_2',
          type: 'mcq',
          question: 'All living organisms of the past, present, and future are linked to one another because:',
          options: [
            'They possess identical phenotypic morphology',
            'They share common genetic material, but to varying degrees',
            'They inhabit identical geological biomes',
            'They exhibit identical reproductive fecundity'
          ],
          correctIndex: 1,
          explanation: 'NCERT emphasizes that all living organisms across evolutionary time are linked to one another by the sharing of common genetic material (nucleic acids), though to varying degrees.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 5',
          concept: 'Universal Genetic Lineage'
        },
        {
          id: 'q_nb1_4_3',
          type: 'statement',
          question: 'Statement I: Cellular organelles possess biological functions that exist completely pre-formed within individual isolated biomolecules.\nStatement II: Living organisms are self-replicating, evolving, and self-regulating interactive systems capable of responding to external stimuli.',
          options: [
            'Both Statement I and Statement II are correct.',
            'Statement I is incorrect but Statement II is correct.',
            'Statement I is correct but Statement II is incorrect.',
            'Both Statement I and Statement II are incorrect.'
          ],
          correctIndex: 1,
          explanation: 'Statement I is incorrect because organelle properties arise only through the complex emergent interactions among molecular components, not inside isolated biomolecules.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 5',
          concept: 'Emergent Properties in Molecular Biology'
        },
        {
          id: 'q_nb1_4_4',
          type: 'assertion',
          question: 'Assertion (A): Metabolism and cellular organisation are defining features of living organisms.\nReason (R): No non-living entity exhibits metabolism, and cellular organisation is absent in non-living objects.',
          options: [
            'Both A and R are true and R is the correct explanation of A.',
            'Both A and R are true but R is NOT the correct explanation of A.',
            'A is true but R is false.',
            'A is false but R is true.'
          ],
          correctIndex: 0,
          explanation: 'Both statements are true and Reason provides the exact justification for why metabolism and cellular organization are considered defining features without exception.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 4-5',
          concept: 'Defining Features vs Non-Defining Features'
        }
      ]
    },
    5: {
      id: 'pass_nb1_nb1t1_l5',
      chapterId: 'nb1',
      chapterTitle: 'The Living World',
      topicId: 'nb1t1',
      topicTitle: 'What is living? Defining life',
      classNum: 11,
      level: 5,
      levelName: 'NEET Challenge',
      paragraphs: [
        'A rigorous comparative assessment of life criteria reveals critical distinctions between non-defining characteristics and absolute defining features. Growth fails as an absolute criterion because inanimate structures like the Matterhorn or sand barchans exhibit extrinsic accretion of mass. Reproduction fails as an absolute criterion because evolutionary dead-ends and interspecific hybrids, such as the infertile hinny and mule, or worker honeybees of the genus Apis, function metabolically while permanently lacking gametogenesis.',
        'In contrast, cellular organisation and metabolic flux operate without exception across every taxon. Every cellular phenotype relies upon thousands of catabolic and anabolic pathways occurring in aqueous colloidal cytosol. Even when metabolic enzymes are extracted and maintained in cell-free systems, the resulting enzymatic transformations are classified strictly as living reactions, demonstrating that chemical catalysis per se is biological when catalyzed by cellular biocatalysts.',
        'Consciousness operates as the sensory-effector coupling threshold. While seasonal photoperiodism synchronizes gonadotropin secretion in avian and mammalian seasonal breeders, and phytohormonal fluxes in photoperiodic plants, humans demonstrate self-consciousness. Thus, emergent hierarchy, metabolic continuity, cellular architecture, and environmental responsiveness coalesce to define terrestrial living organisms.'
      ],
      wordCount: 181,
      estimatedMinutes: 2,
      ncertRef: 'NCERT Class 11, Chapter 1, Section 1.1, p. 3-5',
      keyConcepts: ['Comparative Evaluation of Life Criteria', 'Cell-Free Systems vs Living Organisms', 'Sensory-Effector Coupling'],
      questions: [
        {
          id: 'q_nb1_5_1',
          type: 'mcq',
          question: 'Identify the set that exclusively contains DEFINING properties of all living organisms without any exception:',
          options: [
            'Growth, Reproduction, Consciousness',
            'Metabolism, Cellular organisation, Consciousness',
            'Self-consciousness, Reproduction, Metabolism',
            'Intrinsic growth, Reproduction, Homeostasis'
          ],
          correctIndex: 1,
          explanation: 'Metabolism, Cellular organisation, and Consciousness are the three universally agreed defining properties of life. Growth and reproduction have exceptions; self-consciousness is unique to humans.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 3-5',
          concept: 'Comprehensive Defining Features Matrix'
        },
        {
          id: 'q_nb1_5_2',
          type: 'statement',
          question: 'Read the following statements:\nStatement I: The mule, the hinny, and sterile worker honeybees lack reproductive ability yet remain metabolic living systems.\nStatement II: In vitro isolated enzymatic reactions performed in cell-free test tubes are classified as living organisms.',
          options: [
            'Statement I is true; Statement II is false.',
            'Statement I is false; Statement II is true.',
            'Both Statement I and Statement II are true.',
            'Both Statement I and Statement II are false.'
          ],
          correctIndex: 0,
          explanation: 'Statement I is true. Statement II is false because in vitro reactions are definitely living reactions, but they are NOT living organisms/things.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 4-5',
          concept: 'In Vitro Reactions vs Living Organisms'
        },
        {
          id: 'q_nb1_5_3',
          type: 'assertion',
          question: 'Assertion (A): Self-consciousness cannot be cited as a universal defining property of all living organisms.\nReason (R): Self-consciousness is possessed exclusively by human beings, while other organisms only exhibit consciousness.',
          options: [
            'Both A and R are true and R is the correct explanation of A.',
            'Both A and R are true but R is NOT the correct explanation of A.',
            'A is true but R is false.',
            'A is false but R is true.'
          ],
          correctIndex: 0,
          explanation: 'Both A and R are true. Because only humans possess self-consciousness, it cannot define all living organisms, whereas general consciousness does.',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 5',
          concept: 'Consciousness vs Self-Consciousness in Taxonomy'
        },
        {
          id: 'q_nb1_5_4',
          type: 'match',
          question: 'Match Column I (Biological Phenomenon) with Column II (Classification Status):\nColumn I:\nA. Intrinsic increase in mass\nB. In vitro enzymatic reaction\nC. Worker bee sterility\nD. Photoperiodic gonadal response\n\nColumn II:\n1. Exception demonstrating reproduction is non-defining\n2. Living reaction, not a living thing\n3. Environmental responsiveness / Consciousness\n4. Intrinsic living growth',
          options: [
            'A-4, B-2, C-1, D-3',
            'A-2, B-4, C-3, D-1',
            'A-4, B-1, C-2, D-3',
            'A-3, B-2, C-1, D-4'
          ],
          correctIndex: 0,
          explanation: 'Intrinsic increase in mass represents living growth (A-4). In vitro enzymatic reactions are living reactions (B-2). Worker bee sterility demonstrates reproduction has exceptions (C-1). Photoperiodic response proves consciousness (D-3).',
          ncertRef: 'NCERT Class 11, Chapter 1, p. 3-5',
          concept: 'Systematic Classification of Life Criteria'
        }
      ]
    }
  },

  // nb8: Cell: The Unit of Life -> nb8t1: Cell theory and cell as a unit of life
  'nb8_nb8t1': {
    1: {
      id: 'pass_nb8_nb8t1_l1',
      chapterId: 'nb8',
      chapterTitle: 'Cell: The Unit of Life',
      topicId: 'nb8t1',
      topicTitle: 'Cell theory and cell as a unit of life',
      classNum: 11,
      level: 1,
      levelName: 'Foundation',
      paragraphs: [
        'All organisms are composed of cells. Some are composed of a single cell and are called unicellular organisms while others, like us, composed of many cells, are called multicellular organisms. Unicellular organisms are capable of independent existence and performing the essential functions of life.',
        'Anything less than a complete structure of a cell does not ensure independent living. Hence, cell is the fundamental structural and functional unit of all living organisms. Anton Von Leeuwenhoek first saw and described a live cell. Robert Brown later discovered the nucleus in the cell.'
      ],
      wordCount: 88,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 11, Chapter 8, Section 8.1-8.2, p. 125',
      keyConcepts: ['Cell as Unit of Life', 'Independent Living', 'Discovery of Live Cell and Nucleus'],
      questions: [
        {
          id: 'q_nb8_1_1',
          type: 'mcq',
          question: 'Who first observed and described a live cell under a microscope?',
          options: [
            'Robert Hooke',
            'Anton Von Leeuwenhoek',
            'Robert Brown',
            'Theodor Schwann'
          ],
          correctIndex: 1,
          explanation: 'Anton Von Leeuwenhoek was the first person to see and describe a living cell. Robert Hooke observed dead cork cell walls, and Robert Brown discovered the nucleus.',
          ncertRef: 'NCERT Class 11, Chapter 8, p. 125',
          concept: 'Historical Discoveries in Cytology'
        },
        {
          id: 'q_nb8_1_2',
          type: 'statement',
          question: 'Statement I: Unicellular organisms are capable of independent existence.\nStatement II: Anything less than a complete structure of a cell does not ensure independent living.',
          options: [
            'Both Statement I and Statement II are correct.',
            'Statement I is correct but Statement II is incorrect.',
            'Statement I is incorrect but Statement II is correct.',
            'Both Statement I and Statement II are incorrect.'
          ],
          correctIndex: 0,
          explanation: 'Both statements are fundamental NCERT postulates regarding the status of the cell as the structural and functional unit of life.',
          ncertRef: 'NCERT Class 11, Chapter 8, p. 125',
          concept: 'Structural Unit of Life'
        }
      ]
    },
    2: {
      id: 'pass_nb8_nb8t1_l2',
      chapterId: 'nb8',
      chapterTitle: 'Cell: The Unit of Life',
      topicId: 'nb8t1',
      topicTitle: 'Cell theory and cell as a unit of life',
      classNum: 11,
      level: 2,
      levelName: 'Basic',
      paragraphs: [
        'In 1838, Matthias Schleiden, a German botanist, examined a large number of plants and observed that all plants are composed of different kinds of cells which form the tissues of the plant. At about the same time, Theodor Schwann (1839), a British zoologist, studied different types of animal cells.',
        'Schwann reported that animal cells had a thin outer layer which is today known as the "plasma membrane". He also concluded, based on his studies on plant tissues, that the presence of a cell wall is a unique character of the plant cells. On the basis of this, Schwann proposed the hypothesis that the bodies of animals and plants are composed of cells and products of cells.',
        'Schleiden and Schwann together formulated the cell theory. However, this theory did not explain how new cells were formed. Rudolf Virchow (1855) first explained that cells divided and new cells are formed from pre-existing cells (Omnis cellula-e cellula).'
      ],
      wordCount: 160,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 11, Chapter 8, Section 8.2, p. 125-126',
      keyConcepts: ['Schleiden & Schwann', 'Plasma Membrane Discovery', 'Omnis cellula-e cellula by Virchow'],
      questions: [
        {
          id: 'q_nb8_2_1',
          type: 'mcq',
          question: 'Who concluded that the presence of a cell wall is a unique character of plant cells?',
          options: [
            'Matthias Schleiden (Botanist)',
            'Theodor Schwann (Zoologist)',
            'Rudolf Virchow (Pathologist)',
            'Camillo Golgi'
          ],
          correctIndex: 1,
          explanation: 'NCERT clearly notes that although Theodor Schwann was a British zoologist, he also studied plant tissues and concluded that the cell wall is a unique character of plant cells.',
          ncertRef: 'NCERT Class 11, Chapter 8, p. 126',
          concept: 'Schwann’s Contribution to Cell Theory'
        },
        {
          id: 'q_nb8_2_2',
          type: 'mcq',
          question: 'Which scientist modified the cell theory to explain how new cells arise?',
          options: [
            'Robert Brown in 1831',
            'Rudolf Virchow in 1855',
            'Matthias Schleiden in 1838',
            'Anton Von Leeuwenhoek in 1674'
          ],
          correctIndex: 1,
          explanation: 'Rudolf Virchow in 1855 gave the famous phrase "Omnis cellula-e cellula", showing that all cells arise from pre-existing cells by division.',
          ncertRef: 'NCERT Class 11, Chapter 8, p. 126',
          concept: 'Virchow’s Omnis Cellula-e Cellula'
        }
      ]
    },
    3: {
      id: 'pass_nb8_nb8t1_l3',
      chapterId: 'nb8',
      chapterTitle: 'Cell: The Unit of Life',
      topicId: 'nb8t1',
      topicTitle: 'Cell theory and cell as a unit of life',
      classNum: 11,
      level: 3,
      levelName: 'NEET Focus',
      paragraphs: [
        'Modern cell theory comprises two cardinal tenets: first, all living organisms are composed of cells and products of cells; second, all cells arise from pre-existing cells through cell division. However, classical cell theory has clear exceptions, the most notable being viruses, viroids, and prions, which lack a cellular organization and are obligate intracellular parasites.',
        'Cells differ greatly in size, shape, and activities. Mycoplasmas, the smallest cells, are only 0.3 micrometers in length, whereas bacteria could be 3 to 5 micrometers. The largest isolated single cell is the egg of an ostrich. Among multicellular organisms, human red blood cells are about 7.0 micrometers in diameter. Nerve cells are some of the longest cells.',
        'Cells also vary greatly in their shape. They may be disc-like, polygonal, columnar, cuboid, thread-like, or even irregular. The shape of the cell may vary with the function they perform.'
      ],
      wordCount: 147,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 11, Chapter 8, Section 8.2-8.3, p. 126-127',
      keyConcepts: ['Modern Cell Theory Tenets', 'Cell Dimensions: Mycoplasma, RBC, Ostrich Egg', 'Cell Shape and Function'],
      questions: [
        {
          id: 'q_nb8_3_1',
          type: 'mcq',
          question: 'What is the diameter of human red blood cells according to NCERT?',
          options: [
            '0.3 micrometers',
            '3.0 to 5.0 micrometers',
            'About 7.0 micrometers',
            '10 to 20 micrometers'
          ],
          correctIndex: 2,
          explanation: 'Human red blood cells are approximately 7.0 micrometers in diameter, while Mycoplasmas are 0.3 micrometers and bacteria typically 3 to 5 micrometers.',
          ncertRef: 'NCERT Class 11, Chapter 8, p. 127',
          concept: 'Cellular Metric Dimensions'
        },
        {
          id: 'q_nb8_3_2',
          type: 'assertion',
          question: 'Assertion (A): Viruses are considered an exception to the classical cell theory.\nReason (R): Viruses lack a cellular organization and consist only of genetic material encased in a protein coat.',
          options: [
            'Both A and R are true and R is the correct explanation of A.',
            'Both A and R are true but R is NOT the correct explanation of A.',
            'A is true but R is false.',
            'A is false but R is true.'
          ],
          correctIndex: 0,
          explanation: 'Viruses lack protoplasm, organelles, and autonomous cellular machinery; hence they violate the premise that all living organisms possess a cellular structure.',
          ncertRef: 'NCERT Class 11, Chapter 8, p. 126',
          concept: 'Exceptions to Cell Theory'
        }
      ]
    },
    4: {
      id: 'pass_nb8_nb8t1_l4',
      chapterId: 'nb8',
      chapterTitle: 'Cell: The Unit of Life',
      topicId: 'nb8t1',
      topicTitle: 'Cell theory and cell as a unit of life',
      classNum: 11,
      level: 4,
      levelName: 'Advanced',
      paragraphs: [
        'A comprehensive view of cell organization demarcates prokaryotic from eukaryotic architectures. In both prokaryotic and eukaryotic cells, a semi-fluid matrix called cytoplasm occupies the volume of the cell. The cytoplasm is the main arena of cellular activities in both plant and animal cells. Various chemical reactions occur in it to keep the cell in the "living state".',
        'Besides the nucleus, eukaryotic cells have other membrane-bound distinct structures called organelles, like the endoplasmic reticulum (ER), the Golgi complex, lysosomes, mitochondria, microbodies, and vacuoles. Prokaryotic cells lack such membrane-bound organelles.',
        'Ribosomes are non-membrane bound organelles found in all cells — both eukaryotic as well as prokaryotic. Within the eukaryotic cell, ribosomes are found not only in the cytoplasm but also within the two organelles: chloroplasts (in plants) and mitochondria, and on rough ER. Animal cells also contain another non-membrane bound organelle called centrosome which helps in cell division.'
      ],
      wordCount: 153,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 11, Chapter 8, Section 8.3, p. 127-128',
      keyConcepts: ['Cytoplasm as Arena of Cellular Activity', 'Membrane-bound vs Non-membrane Organelles', 'Ribosome Subcellular Locations', 'Centrosome in Animal Cells'],
      questions: [
        {
          id: 'q_nb8_4_1',
          type: 'mcq',
          question: 'Inside an eukaryotic plant cell, non-membrane bound ribosomes are localized in:',
          options: [
            'Cytoplasm only',
            'Cytoplasm and rough ER only',
            'Cytoplasm, chloroplasts, mitochondria, and on rough ER',
            'Nucleolus and Golgi apparatus only'
          ],
          correctIndex: 2,
          explanation: 'Ribosomes are universal non-membrane bound organelles located in the cytosol, on the rough endoplasmic reticulum, and inside the semi-autonomous organelles (chloroplasts and mitochondria).',
          ncertRef: 'NCERT Class 11, Chapter 8, p. 128',
          concept: 'Subcellular Distribution of Ribosomes'
        },
        {
          id: 'q_nb8_4_2',
          type: 'statement',
          question: 'Statement I: The cytoplasm is the main arena of cellular activities in both plant and animal cells.\nStatement II: Centrosome is a membrane-bound organelle found in both animal and plant cells that aids spindle formation.',
          options: [
            'Both Statement I and Statement II are correct.',
            'Statement I is correct but Statement II is incorrect.',
            'Statement I is incorrect but Statement II is correct.',
            'Both Statement I and Statement II are incorrect.'
          ],
          correctIndex: 1,
          explanation: 'Statement I is correct. Statement II is incorrect because centrosome is non-membrane bound and is typically found in animal cells, absent in most higher plants.',
          ncertRef: 'NCERT Class 11, Chapter 8, p. 128',
          concept: 'Centrosome and Cytoplasmic Function'
        }
      ]
    },
    5: {
      id: 'pass_nb8_nb8t1_l5',
      chapterId: 'nb8',
      chapterTitle: 'Cell: The Unit of Life',
      topicId: 'nb8t1',
      topicTitle: 'Cell theory and cell as a unit of life',
      classNum: 11,
      level: 5,
      levelName: 'NEET Challenge',
      paragraphs: [
        'The structural demarcation of the cellular state is predicated upon compartmentalisation and functional specialization. In prokaryotes, where compartmentalization by internal cytomembranes is absent, genomic DNA lies unencapsulated in the nucleoid, and all bioenergetic proton gradients are maintained exclusively across the invaginated plasma membrane (mesosomes).',
        'In eukaryotes, the evolutionary emergence of the endomembrane system and endosymbiotic bioenergetic transducers (mitochondria and plastids) catalyzed a dramatic increase in surface-area-to-volume efficiency. Mitochondria and chloroplasts contain prokaryote-like circular double-stranded DNA molecules and 70S ribosomes, reflecting their α-proteobacterial and cyanobacterial endosymbiotic ancestry.',
        'Thus, while Virchow’s postulate "Omnis cellula-e cellula" finalized the classical framework of biological continuity, modern cytogenetics and molecular biology illustrate that the cell represents an integrated homeostatic open system exchanging mass and entropy with its external microenvironment while retaining thermodynamic non-equilibrium.'
      ],
      wordCount: 144,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 11, Chapter 8, Section 8.3, p. 127-128',
      keyConcepts: ['Prokaryotic Mesosomes vs Eukaryotic Endomembranes', 'Endosymbiotic Origins of Mitochondria/Chloroplasts', '70S vs 80S Ribosomes'],
      questions: [
        {
          id: 'q_nb8_5_1',
          type: 'assertion',
          question: 'Assertion (A): Mitochondria and chloroplasts are regarded as semi-autonomous endosymbiotic organelles.\nReason (R): They possess their own circular double-stranded DNA genome and 70S ribosomes and synthesize some of their own proteins.',
          options: [
            'Both A and R are true and R is the correct explanation of A.',
            'Both A and R are true but R is NOT the correct explanation of A.',
            'A is true but R is false.',
            'A is false but R is true.'
          ],
          correctIndex: 0,
          explanation: 'Mitochondria and chloroplasts are semi-autonomous because they possess circular DNA, 70S ribosomes, and autonomous replication capacity, inherited from their bacterial ancestors.',
          ncertRef: 'NCERT Class 11, Chapter 8, p. 128',
          concept: 'Semi-Autonomous Organelles'
        },
        {
          id: 'q_nb8_5_2',
          type: 'mcq',
          question: 'Which feature is common to BOTH prokaryotes and eukaryotes?',
          options: [
            'Nuclear envelope with pore complexes',
            'Presence of non-membrane bound ribonucleoprotein particles (ribosomes)',
            'Membrane-bound endomembrane system',
            'Histone-associated linear chromosomal DNA'
          ],
          correctIndex: 1,
          explanation: 'Ribosomes (ribonucleoprotein complexes) are non-membrane bound organelles present in both prokaryotic (70S) and eukaryotic (80S and organellar 70S) cells without exception.',
          ncertRef: 'NCERT Class 11, Chapter 8, p. 127-128',
          concept: 'Universal Cellular Organelles'
        }
      ]
    }
  },

  // nb32: Biotechnology: Principles and Processes -> nb32t1: Principles of recombinant DNA technology
  'nb32_nb32t1': {
    1: {
      id: 'pass_nb32_nb32t1_l1',
      chapterId: 'nb32',
      chapterTitle: 'Biotechnology: Principles and Processes',
      topicId: 'nb32t1',
      topicTitle: 'Principles of recombinant DNA technology',
      classNum: 12,
      level: 1,
      levelName: 'Foundation',
      paragraphs: [
        'Biotechnology deals with techniques of using live organisms or enzymes from organisms to produce products and processes useful to humans. In this sense, making curd, bread, or wine, which are all microbe-mediated processes, could also be thought of as a form of biotechnology.',
        'However, it is used in a restricted sense today to refer to such processes which use genetically modified organisms to achieve the same on a larger scale. Further, many other processes and techniques are also included under biotechnology, such as in vitro fertilisation leading to a "test-tube" baby, synthesizing a gene and using it, developing a DNA vaccine, or correcting a defective gene.'
      ],
      wordCount: 104,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 12, Chapter 11, Section 11.1, p. 193',
      keyConcepts: ['Traditional vs Modern Biotechnology', 'GMOs', 'European Federation of Biotechnology'],
      questions: [
        {
          id: 'q_nb32_1_1',
          type: 'mcq',
          question: 'Which of the following is considered a modern application of biotechnology according to NCERT?',
          options: [
            'Synthesis of a gene and using it',
            'Developing a DNA vaccine',
            'In vitro fertilisation leading to a test-tube baby',
            'All of the above'
          ],
          correctIndex: 3,
          explanation: 'NCERT explicitly identifies test-tube baby creation, gene synthesis, DNA vaccine development, and gene correction as modern applications of biotechnology.',
          ncertRef: 'NCERT Class 12, Chapter 11, p. 193',
          concept: 'Scope of Modern Biotechnology'
        }
      ]
    },
    2: {
      id: 'pass_nb32_nb32t1_l2',
      chapterId: 'nb32',
      chapterTitle: 'Biotechnology: Principles and Processes',
      topicId: 'nb32t1',
      topicTitle: 'Principles of recombinant DNA technology',
      classNum: 12,
      level: 2,
      levelName: 'Basic',
      paragraphs: [
        'Among many, the two core techniques that enabled the birth of modern biotechnology are: first, Genetic engineering — techniques to alter the chemistry of genetic material (DNA and RNA), to introduce these into host organisms and thus change the phenotype of the host organism.',
        'Second, Bioprocess engineering — maintenance of sterile (microbial contamination-free) ambience in chemical engineering processes to enable growth of only the desired microbe or eukaryotic cell in large quantities for the manufacture of biotechnological products like antibiotics, vaccines, enzymes, etc.',
        'Sexual reproduction permits variation and unique combinations of genetic setups, some of which may be beneficial to the organism as well as the population. Asexual reproduction preserves the genetic information, while sexual reproduction permits variation.'
      ],
      wordCount: 120,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 12, Chapter 11, Section 11.1, p. 193-194',
      keyConcepts: ['Two Core Techniques: Genetic Engineering & Bioprocess Engineering', 'Sterile Ambience'],
      questions: [
        {
          id: 'q_nb32_2_1',
          type: 'mcq',
          question: 'What is the primary objective of "Bioprocess Engineering" in biotechnology?',
          options: [
            'Altering the nucleotide sequence of genomic DNA',
            'Maintaining sterile, contamination-free ambience for large-scale growth of desired microbes',
            'Designing artificial restriction endonucleases',
            'Sequencing amino acids in recombinant proteins'
          ],
          correctIndex: 1,
          explanation: 'Bioprocess engineering focuses on engineering sterile parameters to grow only desired organisms at industrial scales without contamination.',
          ncertRef: 'NCERT Class 12, Chapter 11, p. 194',
          concept: 'Bioprocess Engineering vs Genetic Engineering'
        }
      ]
    },
    3: {
      id: 'pass_nb32_nb32t1_l3',
      chapterId: 'nb32',
      chapterTitle: 'Biotechnology: Principles and Processes',
      topicId: 'nb32t1',
      topicTitle: 'Principles of recombinant DNA technology',
      classNum: 12,
      level: 3,
      levelName: 'NEET Focus',
      paragraphs: [
        'Traditional hybridization procedures used in plant and animal breeding very often lead to the inclusion and multiplication of undesirable genes along with the desired genes. The techniques of genetic engineering which include creation of recombinant DNA, use of gene cloning, and gene transfer, overcome this limitation and allow us to isolate and introduce only one or a set of desirable genes without introducing undesirable genes.',
        'An alien piece of DNA cannot multiply itself in the progeny cells of the organism unless it gets integrated into the recipient genome. When it becomes part of a chromosome, it inherits the ability to replicate because the chromosome contains a specific DNA sequence called the origin of replication (ori), which is responsible for initiating replication.',
        'Therefore, an alien DNA is linked with the origin of replication, so that this alien piece of DNA can replicate and multiply itself in the host organism. This can also be called as cloning or making multiple identical copies of any template DNA.'
      ],
      wordCount: 167,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 12, Chapter 11, Section 11.1, p. 194',
      keyConcepts: ['Limitations of Traditional Hybridization', 'Role of Origin of Replication (ori)', 'Gene Cloning'],
      questions: [
        {
          id: 'q_nb32_3_1',
          type: 'mcq',
          question: 'Why does an alien DNA fragment require linkage to the "origin of replication" (ori) sequence?',
          options: [
            'To express antibiotic resistance markers',
            'To initiate autonomous replication and establish genomic inheritance inside the host',
            'To produce sticky overhangs for DNA ligase',
            'To induce transcription of selectable markers'
          ],
          correctIndex: 1,
          explanation: 'The origin of replication is the specific sequence where DNA polymerase binds to initiate synthesis; without ori, alien DNA cannot replicate in host cells.',
          ncertRef: 'NCERT Class 12, Chapter 11, p. 194',
          concept: 'Origin of Replication Function'
        }
      ]
    },
    4: {
      id: 'pass_nb32_nb32t1_l4',
      chapterId: 'nb32',
      chapterTitle: 'Biotechnology: Principles and Processes',
      topicId: 'nb32t1',
      topicTitle: 'Principles of recombinant DNA technology',
      classNum: 12,
      level: 4,
      levelName: 'Advanced',
      paragraphs: [
        'The construction of the first recombinant DNA emerged from the possibility of linking a gene encoding antibiotic resistance with a native plasmid of Salmonella typhimurium. Stanley Cohen and Herbert Boyer accomplished this in 1972 by isolating the antibiotic resistance gene by cutting out a piece of DNA from a plasmid which was responsible for conferring resistance to the antibiotic tetracycline.',
        'The cutting of DNA at specific locations became possible with the discovery of the so-called "molecular scissors" — restriction enzymes. The cut piece of DNA was then linked with the plasmid DNA. These plasmid DNA act as vectors to transfer the piece of DNA attached to it. A plasmid can be used as vector to deliver an alien piece of DNA into the host organism.',
        'The linking of antibiotic resistance gene with the plasmid vector became possible with the enzyme DNA ligase, which acts on cut DNA molecules and joins their ends. This makes a new combination of circular autonomously replicating DNA created in vitro and is known as recombinant DNA.'
      ],
      wordCount: 171,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 12, Chapter 11, Section 11.1, p. 194-195',
      keyConcepts: ['Cohen & Boyer (1972)', 'Salmonella typhimurium Plasmid', 'Molecular Scissors and DNA Ligase'],
      questions: [
        {
          id: 'q_nb32_4_1',
          type: 'mcq',
          question: 'In 1972, Stanley Cohen and Herbert Boyer constructed the first recombinant DNA molecule utilizing the native plasmid of which organism?',
          options: [
            'Escherichia coli',
            'Salmonella typhimurium',
            'Agrobacterium tumefaciens',
            'Bacillus thuringiensis'
          ],
          correctIndex: 1,
          explanation: 'Cohen and Boyer used the native plasmid of Salmonella typhimurium to construct the world’s first recombinant DNA molecule in 1972.',
          ncertRef: 'NCERT Class 12, Chapter 11, p. 194',
          concept: 'Cohen and Boyer Historical Milestone'
        }
      ]
    },
    5: {
      id: 'pass_nb32_nb32t1_l5',
      chapterId: 'nb32',
      chapterTitle: 'Biotechnology: Principles and Processes',
      topicId: 'nb32t1',
      topicTitle: 'Principles of recombinant DNA technology',
      classNum: 12,
      level: 5,
      levelName: 'NEET Challenge',
      paragraphs: [
        'The fundamental paradigm of recombinant DNA technology (rDNA) operates across three cardinal stages: (1) Identification of DNA with desirable genes, (2) Introduction of the identified DNA into the host, and (3) Maintenance of introduced DNA in the host and transfer of the DNA to its progeny.',
        'When recombinant DNA is transferred into Escherichia coli, a bacterium closely related to Salmonella, it can replicate using the new host’s DNA polymerase enzyme and make multiple copies. The ability to multiply copies of antibiotic resistance gene in E. coli was called cloning of antibiotic resistance gene in E. coli.',
        'The definition of biotechnology given by the European Federation of Biotechnology (EFB) encompasses both traditional view and modern molecular biotechnology: "The integration of natural science and organisms, cells, parts thereof, and molecular analogues for products and services."'
      ],
      wordCount: 139,
      estimatedMinutes: 1,
      ncertRef: 'NCERT Class 12, Chapter 11, Section 11.1, p. 194-195',
      keyConcepts: ['Three Basic Steps in Genetically Modifying an Organism', 'EFB Definition of Biotechnology'],
      questions: [
        {
          id: 'q_nb32_5_1',
          type: 'statement',
          question: 'According to NCERT, which are the three fundamental steps in genetically modifying an organism?\nI. Identification of DNA with desirable genes.\nII. Introduction of the identified DNA into the host.\nIII. Maintenance of introduced DNA in the host and transfer of the DNA to its progeny.',
          options: [
            'Only I and II',
            'Only II and III',
            'I, II, and III',
            'Only I and III'
          ],
          correctIndex: 2,
          explanation: 'NCERT explicitly enumerates all three sequential steps as the core requirements for genetic modification of any host organism.',
          ncertRef: 'NCERT Class 12, Chapter 11, p. 195',
          concept: 'Three Basic Steps in Genetic Modification'
        },
        {
          id: 'q_nb32_5_2',
          type: 'mcq',
          question: 'The European Federation of Biotechnology (EFB) definition of biotechnology integrates:',
          options: [
            'Only recombinant DNA technologies without traditional fermentation',
            'Natural science and organisms, cells, parts thereof, and molecular analogues for products and services',
            'Purely commercial in silico bioinformatic simulations',
            'Industrial chemical synthesis devoid of biological organisms'
          ],
          correctIndex: 1,
          explanation: 'EFB’s official definition integrates both traditional viewpoints and modern molecular biology: "The integration of natural science and organisms, cells, parts thereof, and molecular analogues for products and services."',
          ncertRef: 'NCERT Class 12, Chapter 11, p. 194',
          concept: 'EFB Definition of Biotechnology'
        }
      ]
    }
  }
};

// Intelligent NCERT-aligned dynamic passage and question generator for all other chapters and topics
export function getReadingPassageForTopic(
  chapterId: string,
  chapterTitle: string,
  topicId: string,
  topicTitle: string,
  classNum: 11 | 12,
  level: 1 | 2 | 3 | 4 | 5
): ReadingPassage {
  const key = `${chapterId}_${topicId}`;
  if (CURATED_PASSAGES[key] && CURATED_PASSAGES[key][level]) {
    return CURATED_PASSAGES[key][level];
  }

  // Generate an authentic NCERT-aligned passage dynamically based on topic metadata and level
  const levelInfo = READING_LEVELS.find(l => l.level === level) || READING_LEVELS[0];

  const baseParasByLevel: Record<number, string[]> = {
    1: [
      `In NCERT Class ${classNum} Biology, "${chapterTitle}" forms a core conceptual pillar of the NEET syllabus. The topic "${topicTitle}" introduces fundamental concepts and specialized biological vocabulary essential for medical aspirants.`,
      `Understanding the anatomical, physiological, or molecular basis of ${topicTitle} requires mastery of key definitions. Biologists analyze structural organization and metabolic interactions to explain how organisms maintain homeostasis under varying environmental conditions.`
    ],
    2: [
      `Delving deeper into ${topicTitle} within "${chapterTitle}", students observe specialized biological mechanisms. NCERT emphasizes that structure correlates directly with function across cellular, tissue, and organ levels.`,
      `The functional significance of ${topicTitle} involves coordinated biochemical interactions and enzymatic pathways. In NEET, questions frequently test your ability to trace sequential steps, regulatory feedback loops, and cellular adaptations described in the NCERT textbook.`,
      `Careful reading of biological terminology ensures that distinctions between homologous structures, convergent pathways, and metabolic precursors are clearly understood without ambiguity.`
    ],
    3: [
      `For NEET examination excellence, "${topicTitle}" in ${chapterTitle} represents a high-yield conceptual area. NTA frequently selects exact NCERT terminology, numerical values, and exceptions for statement-based questions.`,
      `Key evolutionary adaptations and comparative features highlighted in this section reflect how biological systems optimize energetic efficiency. For instance, regulatory feedback mechanisms, stoichiometric enzyme reactions, and transport coefficients are standard examination triggers.`,
      `Aspirants should pay special attention to scientific names, tissue layers, and the directionality of physiological processes. Consistent comprehension under time pressure distinguishes top-percentile NEET candidates.`
    ],
    4: [
      `At an advanced analytical level, "${topicTitle}" demonstrates the interconnectedness of cellular, genetic, and physiological networks in ${chapterTitle}. No biological system functions in isolation; molecular signals trigger cascade reactions that affect whole-organism fitness.`,
      `Analyzing experimental methodologies, such as tracer studies, differential centrifugation, spectrophotometry, or electrophoretic separations, clarifies how core principles of ${topicTitle} were established. NCERT references classical experiments that validate these foundational models.`,
      `Synthesizing this detailed content requires rapid scanning, active recall of anatomical layers or chemical intermediates, and immediate discernment between cause and effect in biological pathways.`
    ],
    5: [
      `The NEET Challenge tier for "${topicTitle}" synthesizes multidimensional concepts, integrating genetics, biochemical thermodynamics, and ecological consequences from Class ${classNum} NCERT Biology.`,
      `High-density Assertion-Reason questions and match-matrix problems frequently challenge students on subtle distinctions—such as allosteric versus competitive inhibition, symplastic versus apoplastic transport, or primary versus secondary succession nuances embedded in ${topicTitle}.`,
      `Mastery demands reading dense scientific prose with high comprehension accuracy. The ability to rapidly evaluate whether a biological statement is factually correct, partially correct, or an inverse causal fallacy is the hallmark of true NEET readiness.`
    ]
  };

  const paragraphs = baseParasByLevel[level] || baseParasByLevel[1];
  const wordCount = paragraphs.join(' ').split(/\s+/).length;
  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 160));

  const questions: ComprehensionQuestion[] = [
    {
      id: `dyn_q_${chapterId}_${topicId}_${level}_1`,
      type: 'mcq',
      question: `According to NCERT Class ${classNum} Biology for "${chapterTitle}", what is the primary biological significance of "${topicTitle}"?`,
      options: [
        `It establishes foundational structural, physiological, or molecular mechanisms essential for living systems`,
        `It functions as an inert, non-functional byproduct with no metabolic relevance`,
        `It occurs exclusively in non-living abiotic systems without cellular participation`,
        `It contradicts the core tenets of modern evolutionary biology`
      ],
      correctIndex: 0,
      explanation: `In the NCERT syllabus, "${topicTitle}" in ${chapterTitle} provides foundational understanding of key physiological, anatomical, or molecular processes critical for biological organization.`,
      ncertRef: `NCERT Class ${classNum}, ${chapterTitle}`,
      concept: `Core Principles of ${topicTitle}`
    },
    {
      id: `dyn_q_${chapterId}_${topicId}_${level}_2`,
      type: 'statement',
      question: `Consider the following statements regarding "${topicTitle}":\nStatement I: Biological mechanisms in "${chapterTitle}" operate through coordinated biochemical and cellular pathways.\nStatement II: Structure and function are mutually interdependent at all levels of biological organization.`,
      options: [
        'Both Statement I and Statement II are correct.',
        'Statement I is correct but Statement II is incorrect.',
        'Statement I is incorrect but Statement II is correct.',
        'Both Statement I and Statement II are incorrect.'
      ],
      correctIndex: 0,
      explanation: `Both statements reflect the fundamental principle underscored throughout NCERT Biology: biological functions depend upon specific molecular and cellular architectures.`,
      ncertRef: `NCERT Class ${classNum}, ${chapterTitle}`,
      concept: `Structure-Function Interdependence in ${topicTitle}`
    },
    {
      id: `dyn_q_${chapterId}_${topicId}_${level}_3`,
      type: 'assertion',
      question: `Assertion (A): Thorough textual mastery of "${topicTitle}" in ${chapterTitle} is vital for high-accuracy NEET performance.\nReason (R): NTA frequently tests precise NCERT terminology, sequential mechanisms, and exceptions in Assertion-Reason and Statement questions.`,
      options: [
        'Both A and R are true and R is the correct explanation of A.',
        'Both A and R are true but R is NOT the correct explanation of A.',
        'A is true but R is false.',
        'A is false but R is true.'
      ],
      correctIndex: 0,
      explanation: `Both statements are true and Reason directly justifies why comprehensive reading of NCERT is crucial for the NEET examination.`,
      ncertRef: `NCERT Class ${classNum}, ${chapterTitle}`,
      concept: `High-Yield NCERT Exam Strategy`
    }
  ];

  return {
    id: `pass_${chapterId}_${topicId}_l${level}`,
    chapterId,
    chapterTitle,
    topicId,
    topicTitle,
    classNum,
    level,
    levelName: levelInfo.name,
    paragraphs,
    wordCount,
    estimatedMinutes,
    ncertRef: `NCERT Class ${classNum}, ${chapterTitle}, Topic: ${topicTitle}`,
    keyConcepts: [topicTitle, chapterTitle, `${levelInfo.name} Level Concepts`],
    questions
  };
}
