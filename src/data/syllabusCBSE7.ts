import { SyllabusData } from '../types/syllabus';

// CBSE Class 7 | NCERT Textbooks | Session 2026-27
// Note: Class 7 has NO central board examination.
// Marks/assessment are school-based. No official chapter-wise marks published.
// weightage_type: NO_BOARD_EXAM

export const syllabusCBSE7: SyllabusData = {
  id: 'cbse_7',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 7',
  academicSession: '2026-2027',
  sourceUrl: 'https://ncert.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'cbse7_math',
      name: 'Mathematics',
      chapters: [
        { id: 'c7m1', title: 'Integers', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7m1t1', title: 'Integers on number line; ordering' },
          { id: 'c7m1t2', title: 'Addition and subtraction of integers' },
          { id: 'c7m1t3', title: 'Multiplication and division of integers' },
          { id: 'c7m1t4', title: 'Properties: commutative, associative, distributive' }
        ]},
        { id: 'c7m2', title: 'Fractions and Decimals', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7m2t1', title: 'Multiplication of fractions' },
          { id: 'c7m2t2', title: 'Division of fractions' },
          { id: 'c7m2t3', title: 'Multiplication and division of decimals' }
        ]},
        { id: 'c7m3', title: 'Data Handling', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7m3t1', title: 'Collecting and organising data' },
          { id: 'c7m3t2', title: 'Mean, median and mode' },
          { id: 'c7m3t3', title: 'Bar graph, double bar graph' },
          { id: 'c7m3t4', title: 'Chance and probability (introduction)' }
        ]},
        { id: 'c7m4', title: 'Simple Equations', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7m4t1', title: 'Setting up simple equations' },
          { id: 'c7m4t2', title: 'Solving equations with one variable' },
          { id: 'c7m4t3', title: 'Word problems on simple equations' }
        ]},
        { id: 'c7m5', title: 'Lines and Angles', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7m5t1', title: 'Related angles: complementary, supplementary, vertically opposite' },
          { id: 'c7m5t2', title: 'Pairs of lines: transversal; corresponding, alternate, co-interior angles' }
        ]},
        { id: 'c7m6', title: 'The Triangle and Its Properties', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7m6t1', title: 'Medians and altitudes of a triangle' },
          { id: 'c7m6t2', title: 'Exterior angle and its property' },
          { id: 'c7m6t3', title: 'Angle sum property; sum of lengths of sides' },
          { id: 'c7m6t4', title: 'Right-angled triangle; Pythagoras theorem (introduction)' }
        ]},
        { id: 'c7m7', title: 'Congruence of Triangles', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7m7t1', title: 'Congruence: definition and criteria' },
          { id: 'c7m7t2', title: 'Criteria: SSS, SAS, ASA, AAS, RHS' }
        ]},
        { id: 'c7m8', title: 'Comparing Quantities', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7m8t1', title: 'Equivalent ratios; percentage' },
          { id: 'c7m8t2', title: 'Converting fractions/decimals to percent' },
          { id: 'c7m8t3', title: 'Profit and loss; simple interest' }
        ]},
        { id: 'c7m9', title: 'Rational Numbers', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7m9t1', title: 'Definition; positive and negative rational numbers' },
          { id: 'c7m9t2', title: 'Rational numbers on number line' },
          { id: 'c7m9t3', title: 'Arithmetic operations on rational numbers' }
        ]},
        { id: 'c7m10', title: 'Practical Geometry', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7m10t1', title: 'Construction of triangles given: SSS, SAS, ASA, RHS' }
        ]},
        { id: 'c7m11', title: 'Perimeter and Area', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7m11t1', title: 'Squares and rectangles: perimeter and area' },
          { id: 'c7m11t2', title: 'Area of triangles and parallelograms' },
          { id: 'c7m11t3', title: 'Circles: circumference and area' }
        ]},
        { id: 'c7m12', title: 'Algebraic Expressions', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7m12t1', title: 'Terms, factors and coefficients' },
          { id: 'c7m12t2', title: 'Like and unlike terms; adding and subtracting' },
          { id: 'c7m12t3', title: 'Value of expression; using algebraic expressions' }
        ]},
        { id: 'c7m13', title: 'Exponents and Powers', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7m13t1', title: 'Exponents: a^m × a^n = a^(m+n); laws of exponents' },
          { id: 'c7m13t2', title: 'Expressing large numbers in standard form' }
        ]},
        { id: 'c7m14', title: 'Symmetry', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'LOW', topics: [
          { id: 'c7m14t1', title: 'Lines of symmetry in regular polygons' },
          { id: 'c7m14t2', title: 'Rotational symmetry; centre and angle of rotation' }
        ]},
        { id: 'c7m15', title: 'Visualising Solid Shapes', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7m15t1', title: 'Plane figures vs solid shapes' },
          { id: 'c7m15t2', title: 'Faces, edges and vertices; Euler\'s formula' },
          { id: 'c7m15t3', title: 'Nets for 3D shapes' }
        ]}
      ]
    },
    {
      id: 'cbse7_sci',
      name: 'Science',
      chapters: [
        { id: 'c7s1', title: 'Nutrition in Plants', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s1t1', title: 'Autotrophic nutrition: photosynthesis' },
          { id: 'c7s1t2', title: 'Heterotrophic nutrition: parasitic, saprotrophic, insectivorous' },
          { id: 'c7s1t3', title: 'Symbiosis; replenishment of nutrients in soil' }
        ]},
        { id: 'c7s2', title: 'Nutrition in Animals', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s2t1', title: 'Different ways of taking food' },
          { id: 'c7s2t2', title: 'Digestion in humans: mouth to large intestine' },
          { id: 'c7s2t3', title: 'Digestion in grass-eating animals (ruminants)' },
          { id: 'c7s2t4', title: 'Feeding and digestion in Amoeba' }
        ]},
        { id: 'c7s3', title: 'Fibre to Fabric', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'LOW', topics: [
          { id: 'c7s3t1', title: 'Wool: from animal to fibre' },
          { id: 'c7s3t2', title: 'Silk: life history of silkworm; sericulture' }
        ]},
        { id: 'c7s4', title: 'Heat', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s4t1', title: 'Hot and cold; temperature and thermometer' },
          { id: 'c7s4t2', title: 'Transfer of heat: conduction, convection, radiation' },
          { id: 'c7s4t3', title: 'Woolen clothes in winter; greenhouse effect' }
        ]},
        { id: 'c7s5', title: 'Acids, Bases and Salts', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s5t1', title: 'Acids and bases: definition and examples' },
          { id: 'c7s5t2', title: 'Indicators: litmus, turmeric, phenolphthalein' },
          { id: 'c7s5t3', title: 'Neutralisation: acid + base → salt + water' }
        ]},
        { id: 'c7s6', title: 'Physical and Chemical Changes', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s6t1', title: 'Physical changes: reversible; no new substance' },
          { id: 'c7s6t2', title: 'Chemical changes: irreversible; new substance formed' },
          { id: 'c7s6t3', title: 'Rusting of iron; crystallisation' }
        ]},
        { id: 'c7s7', title: 'Weather, Climate and Adaptations', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7s7t1', title: 'Weather elements: temperature, humidity, rainfall' },
          { id: 'c7s7t2', title: 'Climate: tropical rainforest and polar regions' },
          { id: 'c7s7t3', title: 'Adaptations: polar bears, penguins, tropical birds' }
        ]},
        { id: 'c7s8', title: 'Winds, Storms and Cyclones', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s8t1', title: 'Air pressure and wind' },
          { id: 'c7s8t2', title: 'Thunderstorms and cyclones' },
          { id: 'c7s8t3', title: 'Safety measures during cyclones' }
        ]},
        { id: 'c7s9', title: 'Soil', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7s9t1', title: 'Soil profile: horizon A, B, C' },
          { id: 'c7s9t2', title: 'Types of soil: sandy, clayey, loamy' },
          { id: 'c7s9t3', title: 'Absorption of water; water percolation; soil and crops' }
        ]},
        { id: 'c7s10', title: 'Respiration in Organisms', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s10t1', title: 'Why do organisms respire?' },
          { id: 'c7s10t2', title: 'Breathing in humans; lungs' },
          { id: 'c7s10t3', title: 'Breathing in other animals: fish, earthworm, cockroach' },
          { id: 'c7s10t4', title: 'Aerobic and anaerobic respiration' }
        ]},
        { id: 'c7s11', title: 'Transportation in Animals and Plants', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s11t1', title: 'Blood: composition and functions' },
          { id: 'c7s11t2', title: 'The heart; blood vessels; pulse and heartbeat' },
          { id: 'c7s11t3', title: 'Excretion in animals: kidney, sweat glands' },
          { id: 'c7s11t4', title: 'Transport in plants: xylem and phloem' }
        ]},
        { id: 'c7s12', title: 'Reproduction in Plants', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s12t1', title: 'Modes: asexual (vegetative, budding, spore formation)' },
          { id: 'c7s12t2', title: 'Sexual reproduction in flowering plants' },
          { id: 'c7s12t3', title: 'Pollination; fertilisation; seed dispersal' }
        ]},
        { id: 'c7s13', title: 'Motion and Time', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s13t1', title: 'Slow and fast; uniform and non-uniform motion' },
          { id: 'c7s13t2', title: 'Speed = distance/time; units' },
          { id: 'c7s13t3', title: 'Distance-time graphs' }
        ]},
        { id: 'c7s14', title: 'Electric Current and Its Effects', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s14t1', title: 'Symbols for components; electric circuit' },
          { id: 'c7s14t2', title: 'Heating effect of electric current: fuse' },
          { id: 'c7s14t3', title: 'Magnetic effect of current: electromagnet; electric bell' }
        ]},
        { id: 'c7s15', title: 'Light', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s15t1', title: 'Light travels in straight lines' },
          { id: 'c7s15t2', title: 'Reflection of light; images' },
          { id: 'c7s15t3', title: 'Plane mirror; image characteristics' },
          { id: 'c7s15t4', title: 'Spherical mirrors; refraction; lenses (introduction)' }
        ]},
        { id: 'c7s16', title: 'Water: A Precious Resource', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [
          { id: 'c7s16t1', title: 'Distribution of water; groundwater' },
          { id: 'c7s16t2', title: 'Water table; factors affecting groundwater level' },
          { id: 'c7s16t3', title: 'Water management; drip irrigation' }
        ]},
        { id: 'c7s17', title: 'Forests: Our Lifeline', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7s17t1', title: 'Role of forests: biodiversity, oxygen, water cycle' },
          { id: 'c7s17t2', title: 'Forest products; interdependence of organisms' }
        ]},
        { id: 'c7s18', title: 'Wastewater Story', officialWeightage: 'School-based | NO_BOARD_EXAM', pyqPriority: 'LOW', topics: [
          { id: 'c7s18t1', title: 'What is sewage?' },
          { id: 'c7s18t2', title: 'Treatment of wastewater; sewage treatment plant' }
        ]}
      ]
    },
    {
      id: 'cbse7_sst',
      name: 'Social Science',
      chapters: [
        { id: 'c7h1', title: 'Tracing Changes Through a Thousand Years (History)', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7h1t1', title: 'Medieval period: maps and sources' }, { id: 'c7h1t2', title: 'New social and political groups' }
        ]},
        { id: 'c7h2', title: 'New Kings and Kingdoms', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7h2t1', title: 'Rise of new dynasties: Gurjara-Pratiharas, Rashtrakutas, Palas' },
          { id: 'c7h2t2', title: 'Administration and warfare' }
        ]},
        { id: 'c7h3', title: 'The Delhi Sultanate', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7h3t1', title: 'From Slaves to Khaljis: rulers of Delhi' },
          { id: 'c7h3t2', title: 'Administration; Alauddin Khalji\'s market reforms' }
        ]},
        { id: 'c7h4', title: 'The Mughal Empire', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7h4t1', title: 'Mughal rulers: Babur to Aurangzeb' },
          { id: 'c7h4t2', title: 'Mansabdari system; central and provincial administration' }
        ]},
        { id: 'c7h5', title: 'Rulers and Buildings', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7h5t1', title: 'Medieval temples and mosques' },
          { id: 'c7h5t2', title: 'Mughal garden-tombs; regional architectural styles' }
        ]},
        { id: 'c7h6', title: 'Towns, Traders and Craftspersons', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7h6t1', title: 'Temple towns and pilgrimage centres' },
          { id: 'c7h6t2', title: 'Hampi; Surat; Masulipatnam' }
        ]},
        { id: 'c7g1', title: 'Environment (Geography)', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7g1t1', title: 'Natural environment: lithosphere, hydrosphere, atmosphere, biosphere' },
          { id: 'c7g1t2', title: 'Human environment: interaction and adaptation' }
        ]},
        { id: 'c7g2', title: 'Inside Our Earth', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7g2t1', title: 'Earth\'s interior: crust, mantle, core' },
          { id: 'c7g2t2', title: 'Rocks: igneous, sedimentary, metamorphic' }
        ]},
        { id: 'c7g3', title: 'Our Changing Earth', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7g3t1', title: 'Lithospheric plates; earthquakes and volcanoes' },
          { id: 'c7g3t2', title: 'Work of rivers; sea waves; wind action' }
        ]},
        { id: 'c7g4', title: 'Air', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7g4t1', title: 'Composition and structure of atmosphere' },
          { id: 'c7g4t2', title: 'Weather and climate; temperature and rainfall' }
        ]},
        { id: 'c7g5', title: 'Water', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7g5t1', title: 'Water cycle; ocean circulation' },
          { id: 'c7g5t2', title: 'Tides and ocean currents' }
        ]},
        { id: 'c7p1', title: 'On Equality (Political Science)', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7p1t1', title: 'Equality: universal adult franchise; equal rights' },
          { id: 'c7p1t2', title: 'Why equality matters in a democracy' }
        ]},
        { id: 'c7p2', title: 'Role of the Government in Health', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7p2t1', title: 'Public and private healthcare' },
          { id: 'c7p2t2', title: 'Healthcare: a universal right' }
        ]},
        { id: 'c7e1', title: 'Understanding Markets (Economics)', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7e1t1', title: 'Market chain: from farm to plate' },
          { id: 'c7e1t2', title: 'Wholesale and retail markets' }
        ]}
      ]
    },
    {
      id: 'cbse7_eng',
      name: 'English',
      chapters: [
        { id: 'c7e1', title: 'Honeycomb: Three Questions (Prose)', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7e1t1', title: 'Leo Tolstoy: story summary and moral' }, { id: 'c7e1t2', title: 'Comprehension and language work' }
        ]},
        { id: 'c7e2', title: 'Honeycomb: The Squirrel (Poem)', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7e2t1', title: 'Poem appreciation; rhyme scheme' }
        ]},
        { id: 'c7e3', title: 'An Alien Hand (Supplementary)', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7e3t1', title: 'Stories: The Tiny Teacher, Bringing Up Kari, The Desert, The Bear Story' }
        ]},
        { id: 'c7e4', title: 'Grammar and Writing', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7e4t1', title: 'Tenses: simple, continuous, perfect' },
          { id: 'c7e4t2', title: 'Active and passive voice (introduction)' },
          { id: 'c7e4t3', title: 'Articles; conjunctions; prepositions' },
          { id: 'c7e4t4', title: 'Letter and paragraph writing; notice writing' }
        ]}
      ]
    },
    {
      id: 'cbse7_hin',
      name: 'Hindi',
      chapters: [
        { id: 'c7h_1', title: 'वसंत भाग 2: हम पंछी उन्मुक्त गगन के', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7h_1t1', title: 'कविता: शिवमंगल सिंह सुमन — भाव और प्रश्न' }
        ]},
        { id: 'c7h_2', title: 'वसंत: दादी माँ', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7h_2t1', title: 'गद्य: शिवप्रसाद सिंह — पाठ सारांश' }
        ]},
        { id: 'c7h_3', title: 'वसंत: खानपान की बदलती तस्वीर', officialWeightage: 'School-based', pyqPriority: 'MEDIUM', topics: [
          { id: 'c7h_3t1', title: 'गद्य: प्रयोजनमूलक हिंदी — भाषा बोध' }
        ]},
        { id: 'c7h_4', title: 'व्याकरण', officialWeightage: 'School-based', pyqPriority: 'HIGH', topics: [
          { id: 'c7h_4t1', title: 'संज्ञा के भेद; सर्वनाम; विशेषण के भेद' },
          { id: 'c7h_4t2', title: 'क्रिया: सकर्मक, अकर्मक' },
          { id: 'c7h_4t3', title: 'काल: भूत, वर्तमान, भविष्य' },
          { id: 'c7h_4t4', title: 'लेखन: अनुच्छेद, पत्र, निबन्ध' }
        ]}
      ]
    }
  ]
};
