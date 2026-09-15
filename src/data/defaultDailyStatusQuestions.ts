import { DailyQuestion, SubjectKey } from '../types/dailyStatus';

export const DEFAULT_DAILY_QUESTIONS: Record<SubjectKey, DailyQuestion[]> = {
  nta_q: [
    {
      id: 'nta_q1',
      subject: 'nta_q',
      topic: 'NTA Abhyas - Dual Nature of Matter',
      difficulty: 'MEDIUM',
      questionText: 'An electron accelerates from rest through a potential difference of V volts. The de Broglie wavelength associated with it is given by λ = :',
      options: [
        '\\frac{1.227}{\\sqrt{V}} \\text{ nm}',
        '\\frac{12.27}{\\sqrt{V}} \\text{ nm}',
        '\\frac{0.1227}{\\sqrt{V}} \\text{ nm}',
        '\\frac{122.7}{\\sqrt{V}} \\text{ nm}'
      ],
      correctIndex: 0,
      explanation: 'For an electron, \\lambda = \\frac{h}{\\sqrt{2meV}} = \\frac{12.27}{\\sqrt{V}} \\text{ Å} = \\frac{1.227}{\\sqrt{V}} \\text{ nm}.',
      videoSolutionUrl: ''
    },
    {
      id: 'nta_q2',
      subject: 'nta_q',
      topic: 'NTA Abhyas - Organic Chemistry',
      difficulty: 'MEDIUM',
      questionText: 'Which of the following compounds will undergo S_N1 reaction fastest?',
      options: [
        '(CH_3)_3C-Cl',
        '(CH_3)_2CH-Cl',
        'CH_3CH_2-Cl',
        'CH_3-Cl'
      ],
      correctIndex: 0,
      explanation: 'S_N1 reaction rate depends on the stability of carbocation intermediate. Tertiary carbocation (CH_3)_3C^+ is hyperconjugatively most stable.',
      videoSolutionUrl: ''
    },
    {
      id: 'nta_q3',
      subject: 'nta_q',
      topic: 'NTA Abhyas - Cell Biology',
      difficulty: 'EASY',
      questionText: 'Which organelle is called the "Powerhouse of the Cell" due to ATP synthesis via oxidative phosphorylation?',
      options: [
        'Mitochondria',
        'Chloroplast',
        'Golgi Apparatus',
        'Endoplasmic Reticulum'
      ],
      correctIndex: 0,
      explanation: 'Mitochondria produce cellular energy currency ATP through electron transport chain and chemiosmotic ATP synthase in inner membrane.',
      videoSolutionUrl: ''
    }
  ],
  physics: [
    {
      id: 'phy_d1',
      subject: 'physics',
      topic: 'Kinematics & Motion in 1D',
      difficulty: 'MEDIUM',
      questionText: 'A body is thrown vertically upwards with velocity u from the ground and returns back to the initial position after time T. What is its average speed during the flight?',
      options: [
        'Its average speed is u/2',
        'Average velocity is u',
        'Distance covered is zero',
        'Its average speed is u'
      ],
      correctIndex: 0,
      explanation: 'Average speed = $\\frac{\\text{Total distance}}{\\text{Time of flight}} = \\frac{2H}{T}$.\n\nSince maximum height $H = \\frac{u^2}{2g}$ and time of flight $T = \\frac{2u}{g}$,\n\nAverage speed = $\\frac{2 \\cdot \\frac{u^2}{2g}}{\\frac{2u}{g}} = \\frac{u}{2}$.',
      videoSolutionUrl: ''
    },
    {
      id: 'phy_d2',
      subject: 'physics',
      topic: 'Kinematics & Projectile Motion',
      difficulty: 'MEDIUM',
      questionText: 'A projectile is launched from ground level with speed $u$ at angle $\\theta$ to the horizontal. If horizontal range $R = 4H$ (where $H$ is max height), then the angle of projection $\\theta$ is:',
      options: ['30°', '45°', '60°', '75°'],
      correctIndex: 1,
      explanation: 'Using the identity $R = 4H \\cot \\theta$. Given $R = 4H$, we get $4H = 4H \\cot \\theta \\implies \\cot \\theta = 1 \\implies \\theta = 45^\\circ$.',
      videoSolutionUrl: ''
    },
    {
      id: 'phy_d3',
      subject: 'physics',
      topic: 'Work, Energy & Power',
      difficulty: 'EASY',
      questionText: 'A force $\\vec{F} = (3\\hat{i} + 4\\hat{j})\\text{ N}$ displaces a particle by $\\vec{d} = (2\\hat{i} + 5\\hat{j})\\text{ m}$. The work done by the force is:',
      options: ['14 J', '26 J', '18 J', '30 J'],
      correctIndex: 1,
      explanation: 'Work $W = \\vec{F} \\cdot \\vec{d} = (3 \\times 2) + (4 \\times 5) = 6 + 20 = 26\\text{ Joules}$.',
      videoSolutionUrl: ''
    }
  ],
  chemistry: [
    {
      id: 'chem_d1',
      subject: 'chemistry',
      topic: 'Chemical Equilibrium',
      difficulty: 'MEDIUM',
      questionText: 'For the exothermic reaction N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g), according to Le Chatelier\'s principle, the yield of ammonia increases with:',
      options: [
        'High pressure and low temperature',
        'Low pressure and high temperature',
        'High pressure and high temperature',
        'Low pressure and low temperature'
      ],
      correctIndex: 0,
      explanation: 'Since the reaction is exothermic (\\Delta H < 0), decreasing temperature shifts equilibrium forward. Since \\Delta n_g = 2 - 4 = -2 < 0, increasing pressure shifts equilibrium towards fewer gas moles (forward).',
      videoSolutionUrl: ''
    },
    {
      id: 'chem_d2',
      subject: 'chemistry',
      topic: 'Organic Chemistry - Hydrocarbons',
      difficulty: 'EASY',
      questionText: 'An alkyl halide R-X reacts with sodium metal in the presence of dry ether to form a higher alkane with double the carbon atoms. This reaction is known as:',
      options: [
        'Wurtz Reaction',
        'Fittig Reaction',
        'Friedel-Crafts Reaction',
        'Reimer-Tiemann Reaction'
      ],
      correctIndex: 0,
      explanation: '2R-X + 2Na \\xrightarrow{\\text{dry ether}} R-R + 2NaX is the classic Wurtz Reaction used to synthesize symmetrical alkanes.',
      videoSolutionUrl: ''
    },
    {
      id: 'chem_d3',
      subject: 'chemistry',
      topic: 'Electrochemistry',
      difficulty: 'MEDIUM',
      questionText: 'Standard reduction potentials of three metals X, Y, Z are -1.2 V, +0.5 V, and -3.0 V respectively. The reducing power of these metals follows the order:',
      options: [
        'Z > X > Y',
        'Y > X > Z',
        'X > Y > Z',
        'Z > Y > X'
      ],
      correctIndex: 0,
      explanation: 'More negative standard reduction potential means greater ease of oxidation, hence stronger reducing power. Order: Z (-3.0 V) > X (-1.2 V) > Y (+0.5 V).',
      videoSolutionUrl: ''
    }
  ],
  biology: [
    {
      id: 'bio_d1',
      subject: 'biology',
      topic: 'Biotechnology & Principles',
      difficulty: 'EASY',
      questionText: 'Which molecular enzyme is known as "molecular scissors" in genetic engineering for cutting DNA at specific palindrome recognition sequences?',
      options: [
        'Restriction Endonuclease',
        'DNA Ligase',
        'DNA Polymerase',
        'Reverse Transcriptase'
      ],
      correctIndex: 0,
      explanation: 'Restriction endonucleases cleave phosphodiester bonds of double-stranded DNA at specific palindromic recognition sequences, acting as molecular scissors.',
      videoSolutionUrl: ''
    },
    {
      id: 'bio_d2',
      subject: 'biology',
      topic: 'Genetics & Evolution',
      difficulty: 'MEDIUM',
      questionText: 'In a dihybrid cross between two heterozygous round yellow seeded pea plants (RrYy × RrYy), what fraction of progeny will display recombinant phenotypes?',
      options: ['6/16', '9/16', '3/16', '1/16'],
      correctIndex: 0,
      explanation: 'Parental phenotypes are Round Yellow (9/16) and Wrinkled Green (1/16). Recombinant phenotypes are Round Green (3/16) and Wrinkled Yellow (3/16). Total recombinant fraction = 3/16 + 3/16 = 6/16.',
      videoSolutionUrl: ''
    },
    {
      id: 'bio_d3',
      subject: 'biology',
      topic: 'Plant Physiology - Photosynthesis',
      difficulty: 'MEDIUM',
      questionText: 'In C4 plants such as Maize and Sugarcane, the primary CO2 acceptor molecule present in mesophyll cells is:',
      options: [
        'Phosphoenol pyruvate (PEP)',
        'Ribulose-1,5-bisphosphate (RuBP)',
        'Oxaloacetic acid (OAA)',
        'Phosphoglyceric acid (PGA)'
      ],
      correctIndex: 0,
      explanation: 'In C4 mesophyll cells, PEP (3-carbon molecule) acts as the primary CO2 acceptor catalyzed by PEP carboxylase to produce 4C Oxaloacetic Acid (OAA).',
      videoSolutionUrl: ''
    }
  ],
  mathematics: [
    {
      id: 'math_d1',
      subject: 'mathematics',
      topic: 'Calculus - Integration',
      difficulty: 'MEDIUM',
      questionText: 'The indefinite integral \\int \\sin^2(x) \\, dx is equal to:',
      options: [
        '\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C',
        '\\frac{x}{2} + \\frac{\\sin(2x)}{4} + C',
        '\\frac{-\\cos^3(x)}{3} + C',
        '\\frac{\\sin^3(x)}{3} + C'
      ],
      correctIndex: 0,
      explanation: 'Using trigonometric identity \\sin^2(x) = \\frac{1 - \\cos(2x)}{2}:\n\\int \\frac{1 - \\cos(2x)}{2} dx = \\frac{x}{2} - \\frac{\\sin(2x)}{4} + C.',
      videoSolutionUrl: ''
    },
    {
      id: 'math_d2',
      subject: 'mathematics',
      topic: 'Quadratic Equations',
      difficulty: 'EASY',
      questionText: 'The roots of quadratic equation ax^2 + bx + c = 0 are real and equal if the discriminant D = b^2 - 4ac satisfies:',
      options: ['D = 0', 'D > 0', 'D < 0', 'D \\le 0'],
      correctIndex: 0,
      explanation: 'When discriminant D = b^2 - 4ac = 0, the quadratic formula yields real and equal roots x = \\frac{-b}{2a}.',
      videoSolutionUrl: ''
    },
    {
      id: 'math_d3',
      subject: 'mathematics',
      topic: 'Vectors & 3D Geometry',
      difficulty: 'MEDIUM',
      questionText: 'If two non-zero vectors \\vec{a} and \\vec{b} satisfy |\\vec{a} + \\vec{b}| = |\\vec{a} - \\vec{b}|, then the angle between \\vec{a} and \\vec{b} is:',
      options: ['90° (\\pi/2)', '0°', '45° (\\pi/4)', '180° (\\pi)'],
      correctIndex: 0,
      explanation: 'Squaring both sides: |\\vec{a}|^2 + |\\vec{b}|^2 + 2\\vec{a}\\cdot\\vec{b} = |\\vec{a}|^2 + |\\vec{b}|^2 - 2\\vec{a}\\cdot\\vec{b} \\implies 4\\vec{a}\\cdot\\vec{b} = 0 \\implies \\vec{a} \\perp \\vec{b} \\implies \\theta = 90^\\circ.',
      videoSolutionUrl: ''
    }
  ]
};
