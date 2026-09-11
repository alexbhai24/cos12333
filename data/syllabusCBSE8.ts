import { SyllabusData } from '../types/syllabus';

// CBSE Class 8 | NCERT Textbooks | Session 2026-27
// Note: Class 8 has NO central board examination.
// weightage_type: NO_BOARD_EXAM

export const syllabusCBSE8: SyllabusData = {
  id: 'cbse_8',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 8',
  academicSession: '2026-2027',
  sourceUrl: 'https://ncert.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'cbse8_math',
      name: 'Mathematics',
      chapters: [
        { id: 'c8m1', title: 'Rational Numbers', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m1t1', title: 'Properties: closure, commutativity, associativity' },
          { id: 'c8m1t2', title: 'Rational numbers on number line; between two rational numbers' }
        ]},
        { id: 'c8m2', title: 'Linear Equations in One Variable', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m2t1', title: 'Solving equations with rational numbers' },
          { id: 'c8m2t2', title: 'Equations reducible to linear form (cross multiplication)' },
          { id: 'c8m2t3', title: 'Word problems on linear equations' }
        ]},
        { id: 'c8m3', title: 'Understanding Quadrilaterals', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m3t1', title: 'Polygon: interior and exterior angles; sum of angles' },
          { id: 'c8m3t2', title: 'Types: parallelogram, rhombus, rectangle, square, kite, trapezium' },
          { id: 'c8m3t3', title: 'Properties of parallelogram' }
        ]},
        { id: 'c8m4', title: 'Practical Geometry', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8m4t1', title: 'Construction of quadrilaterals: given various conditions' }
        ]},
        { id: 'c8m5', title: 'Data Handling', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m5t1', title: 'Frequency distribution; histograms' },
          { id: 'c8m5t2', title: 'Pie charts' },
          { id: 'c8m5t3', title: 'Probability: outcomes; theoretical probability' }
        ]},
        { id: 'c8m6', title: 'Squares and Square Roots', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m6t1', title: 'Properties of square numbers' },
          { id: 'c8m6t2', title: 'Finding square roots: prime factorisation, division method' },
          { id: 'c8m6t3', title: 'Square roots of decimals and fractions' }
        ]},
        { id: 'c8m7', title: 'Cubes and Cube Roots', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m7t1', title: 'Perfect cubes; smallest number to make perfect cube' },
          { id: 'c8m7t2', title: 'Cube roots by prime factorisation' }
        ]},
        { id: 'c8m8', title: 'Comparing Quantities', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m8t1', title: 'Percentage: comparing quantities using per cent' },
          { id: 'c8m8t2', title: 'Profit and loss; discount; VAT/GST (introduction)' },
          { id: 'c8m8t3', title: 'Simple and compound interest' }
        ]},
        { id: 'c8m9', title: 'Algebraic Expressions and Identities', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m9t1', title: 'Multiplication of algebraic expressions' },
          { id: 'c8m9t2', title: 'Standard identities: (a+b)², (a-b)², (a+b)(a-b), (x+a)(x+b)' },
          { id: 'c8m9t3', title: 'Applying identities in computations' }
        ]},
        { id: 'c8m10', title: 'Visualising Solid Shapes', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8m10t1', title: 'Views of 3D shapes: front, side, top' },
          { id: 'c8m10t2', title: 'Mapping space around us' },
          { id: 'c8m10t3', title: 'Faces, edges and vertices; Euler\'s formula verification' }
        ]},
        { id: 'c8m11', title: 'Mensuration', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m11t1', title: 'Area of trapezium, polygon' },
          { id: 'c8m11t2', title: 'Surface area: cube, cuboid, cylinder' },
          { id: 'c8m11t3', title: 'Volume: cube, cuboid, cylinder' }
        ]},
        { id: 'c8m12', title: 'Exponents and Powers', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m12t1', title: 'Negative exponents; zero exponent' },
          { id: 'c8m12t2', title: 'Laws of exponents; standard form (scientific notation)' }
        ]},
        { id: 'c8m13', title: 'Direct and Inverse Proportions', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m13t1', title: 'Direct proportion: examples and applications' },
          { id: 'c8m13t2', title: 'Inverse proportion: examples and applications' }
        ]},
        { id: 'c8m14', title: 'Factorisation', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8m14t1', title: 'Factorisation using common factors' },
          { id: 'c8m14t2', title: 'Factorisation using identities' },
          { id: 'c8m14t3', title: 'Division of algebraic expressions' }
        ]},
        { id: 'c8m15', title: 'Introduction to Graphs', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8m15t1', title: 'Bar graph, pie graph, line graph, histogram' },
          { id: 'c8m15t2', title: 'Reading and drawing graphs' }
        ]},
        { id: 'c8m16', title: 'Playing with Numbers', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8m16t1', title: 'Numbers in general form; reversing digits' },
          { id: 'c8m16t2', title: 'Divisibility tests: 2, 3, 9, 11' }
        ]}
      ]
    },
    {
      id: 'cbse8_sci',
      name: 'Science',
      chapters: [
        { id: 'c8s1', title: 'Crop Production and Management', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s1t1', title: 'Agricultural practices: preparation of soil, sowing, irrigation' },
          { id: 'c8s1t2', title: 'Manures and fertilisers; crop protection; harvesting and storage' }
        ]},
        { id: 'c8s2', title: 'Microorganisms: Friend and Foe', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s2t1', title: 'Types of microorganisms: bacteria, viruses, fungi, algae, protozoa' },
          { id: 'c8s2t2', title: 'Useful microorganisms: food production, medicines, nitrogen fixation' },
          { id: 'c8s2t3', title: 'Harmful microorganisms: diseases, food spoilage' }
        ]},
        { id: 'c8s3', title: 'Synthetic Fibres and Plastics', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8s3t1', title: 'Types of synthetic fibres: nylon, polyester, acrylic' },
          { id: 'c8s3t2', title: 'Characteristics; plastics: thermoplastic and thermosetting' }
        ]},
        { id: 'c8s4', title: 'Materials: Metals and Non-Metals', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s4t1', title: 'Physical properties: malleability, ductility, conductivity' },
          { id: 'c8s4t2', title: 'Chemical properties; displacement reaction; uses' }
        ]},
        { id: 'c8s5', title: 'Coal and Petroleum', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s5t1', title: 'Exhaustible natural resources; fossil fuels' },
          { id: 'c8s5t2', title: 'Coal: formation; products of coal (coke, coal tar, gas)' },
          { id: 'c8s5t3', title: 'Petroleum: refining and products; natural gas (CNG)' }
        ]},
        { id: 'c8s6', title: 'Combustion and Flame', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s6t1', title: 'Conditions for combustion; ignition temperature' },
          { id: 'c8s6t2', title: 'Types of combustion: rapid, spontaneous, explosion' },
          { id: 'c8s6t3', title: 'Flame: structure; fire control methods' }
        ]},
        { id: 'c8s7', title: 'Conservation of Plants and Animals', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s7t1', title: 'Deforestation and its effects' },
          { id: 'c8s7t2', title: 'Biosphere reserves; national parks; wildlife sanctuaries' },
          { id: 'c8s7t3', title: 'Endangered species; Red Data Book; migration' }
        ]},
        { id: 'c8s8', title: 'Cell — Structure and Functions', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s8t1', title: 'Discovery and basic structure of cell' },
          { id: 'c8s8t2', title: 'Plant cell vs animal cell' },
          { id: 'c8s8t3', title: 'Cell organelles: cell membrane, cell wall, cytoplasm, nucleus' }
        ]},
        { id: 'c8s9', title: 'Reproduction in Animals', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s9t1', title: 'Sexual reproduction in animals' },
          { id: 'c8s9t2', title: 'Asexual reproduction: budding, binary fission' },
          { id: 'c8s9t3', title: 'Metamorphosis; cloning; test tube babies' }
        ]},
        { id: 'c8s10', title: 'Reaching the Age of Adolescence', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s10t1', title: 'Puberty: physical changes' },
          { id: 'c8s10t2', title: 'Role of hormones; menstrual cycle' },
          { id: 'c8s10t3', title: 'Reproductive health; nutritional needs during adolescence' }
        ]},
        { id: 'c8s11', title: 'Force and Pressure', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s11t1', title: 'Force: push, pull; contact and non-contact forces' },
          { id: 'c8s11t2', title: 'Pressure = Force/Area; pressure in fluids; atmospheric pressure' }
        ]},
        { id: 'c8s12', title: 'Friction', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s12t1', title: 'Factors affecting friction; types of friction' },
          { id: 'c8s12t2', title: 'Advantages and disadvantages; fluid friction' }
        ]},
        { id: 'c8s13', title: 'Sound', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s13t1', title: 'Sound produced by vibrations; propagation through medium' },
          { id: 'c8s13t2', title: 'Characteristics: amplitude, frequency, time period, pitch, loudness' },
          { id: 'c8s13t3', title: 'Audible and inaudible sounds; noise pollution' }
        ]},
        { id: 'c8s14', title: 'Chemical Effects of Electric Current', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s14t1', title: 'Conductors; electrodes; electrolysis' },
          { id: 'c8s14t2', title: 'Electroplating and its applications' }
        ]},
        { id: 'c8s15', title: 'Some Natural Phenomena', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s15t1', title: 'Lightning: how it occurs; safety measures' },
          { id: 'c8s15t2', title: 'Earthquakes: causes; Richter scale; seismic zones' }
        ]},
        { id: 'c8s16', title: 'Light', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s16t1', title: 'Laws of reflection; regular and diffuse reflection' },
          { id: 'c8s16t2', title: 'Multiple images: plane mirrors; kaleidoscope' },
          { id: 'c8s16t3', title: 'Dispersion of light; structure of human eye; care of eyes' }
        ]},
        { id: 'c8s17', title: 'Stars and the Solar System', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8s17t1', title: 'Moon: phases and surface features' },
          { id: 'c8s17t2', title: 'Stars, constellations, solar system: planets, comets, asteroids' }
        ]},
        { id: 'c8s18', title: 'Pollution of Air and Water', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c8s18t1', title: 'Air pollution: causes, effects; control measures' },
          { id: 'c8s18t2', title: 'Water pollution: Ganga action plan; potable water' }
        ]}
      ]
    },
    {
      id: 'cbse8_sst',
      name: 'Social Science',
      chapters: [
        { id: 'c8h1', title: 'How, When and Where (History)', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8h1t1', title: 'History and the colonial period; periodisation' }
        ]},
        { id: 'c8h2', title: 'From Trade to Territory: The Company Establishes Power', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8h2t1', title: 'East India Company; Battle of Plassey and Buxar' }
        ]},
        { id: 'c8h3', title: 'Ruling the Countryside', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8h3t1', title: 'Permanent Settlement; Mahalwari and Ryotwari systems' }
        ]},
        { id: 'c8h4', title: 'Tribals, Dikus and the Vision of a Golden Age', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8h4t1', title: 'Shifting cultivation; colonial forest laws; Birsa Munda' }
        ]},
        { id: 'c8h5', title: 'When People Rebel: 1857 and After', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8h5t1', title: 'Causes and events of the 1857 revolt' },
          { id: 'c8h5t2', title: 'Aftermath and changes in administration' }
        ]},
        { id: 'c8h6', title: 'Weavers, Iron Smelters and Factory Owners', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8h6t1', title: 'Indian textiles; industrial revolution in Britain; factory workers' }
        ]},
        { id: 'c8h7', title: 'Civilising the "Native", Educating the Nation', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8h7t1', title: 'Macaulay and Wood\'s Despatch; Tagore and alternative education' }
        ]},
        { id: 'c8h8', title: 'Women, Caste and Reform', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8h8t1', title: 'Social reformers: Ram Mohan Roy, Vidyasagar, Jyotirao Phule' },
          { id: 'c8h8t2', title: 'Women\'s education; anti-caste movements' }
        ]},
        { id: 'c8g1', title: 'Resources (Geography)', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8g1t1', title: 'Types of resources; sustainable development' }
        ]},
        { id: 'c8g2', title: 'Land, Soil, Water, Natural Vegetation and Wildlife', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8g2t1', title: 'Land use; soil erosion; water scarcity; forests and wildlife' }
        ]},
        { id: 'c8g3', title: 'Agriculture', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8g3t1', title: 'Types of farming; major crops; green revolution' }
        ]},
        { id: 'c8g4', title: 'Industries', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8g4t1', title: 'Cottage, small and large scale industries; Iron and Steel industry; Textile industry' }
        ]},
        { id: 'c8p1', title: 'The Indian Constitution (Political Science)', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8p1t1', title: 'Why does a country need a constitution?' },
          { id: 'c8p1t2', title: 'Key features of the Indian Constitution' }
        ]},
        { id: 'c8p2', title: 'Understanding Secularism', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8p2t1', title: 'What is secularism? Separation of religion and state' }
        ]},
        { id: 'c8p3', title: 'Why Do We Need a Parliament?', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8p3t1', title: 'Making of laws; Lok Sabha and Rajya Sabha' }
        ]},
        { id: 'c8p4', title: 'Understanding Laws', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8p4t1', title: 'Ordinary law-making process' }
        ]}
      ]
    },
    {
      id: 'cbse8_eng',
      name: 'English',
      chapters: [
        { id: 'c8eng1', title: 'Honeydew: The Best Christmas Present (Prose)', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8eng1t1', title: 'Michael Morpurgo: story and themes' }
        ]},
        { id: 'c8eng2', title: 'Honeydew: Macavity: The Mystery Cat (Poem)', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8eng2t1', title: 'T.S. Eliot: poem summary; poetic devices' }
        ]},
        { id: 'c8eng3', title: 'It So Happened (Supplementary)', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8eng3t1', title: 'Stories: How the Camel Got His Hump, Children at Work, The Selfish Giant' }
        ]},
        { id: 'c8eng4', title: 'Grammar and Writing', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8eng4t1', title: 'Active and passive voice' },
          { id: 'c8eng4t2', title: 'Direct and indirect speech (reported speech)' },
          { id: 'c8eng4t3', title: 'Modals; subject-verb agreement' },
          { id: 'c8eng4t4', title: 'Writing: formal/informal letter; notice; essay' }
        ]}
      ]
    },
    {
      id: 'cbse8_hin',
      name: 'Hindi',
      chapters: [
        { id: 'c8hin1', title: 'वसंत भाग 3: ध्वनि', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8hin1t1', title: 'कविता: सूर्यकांत त्रिपाठी निराला — भाव-बोध' }
        ]},
        { id: 'c8hin2', title: 'वसंत: लाख की चूड़ियाँ', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8hin2t1', title: 'गद्य: कामतानाथ — सारांश और भाषा कार्य' }
        ]},
        { id: 'c8hin3', title: 'वसंत: बस की यात्रा', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c8hin3t1', title: 'गद्य: हरिशंकर परसाई — व्यंग्य साहित्य' }
        ]},
        { id: 'c8hin4', title: 'व्याकरण', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c8hin4t1', title: 'उपसर्ग, प्रत्यय; समास के भेद' },
          { id: 'c8hin4t2', title: 'वाक्य-भेद; मुहावरे और लोकोक्तियाँ' },
          { id: 'c8hin4t3', title: 'लेखन: अनुच्छेद, पत्र, निबन्ध' }
        ]}
      ]
    }
  ]
};
