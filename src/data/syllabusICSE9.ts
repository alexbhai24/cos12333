import { SyllabusData } from '../types/syllabus';

// ICSE Class 9 (CISCE Board) | Academic Session 2026-27
// Official Authority: CISCE (cisce.org)

export const syllabusICSE9: SyllabusData = {
  id: 'icse_9',
  examOrBoard: 'ICSE',
  category: 'School',
  classGrade: 'Class 9',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'icse9_math',
      name: 'Mathematics',
      chapters: [
        {
          id: 'i9m1',
          title: 'Pure Arithmetic: Rational & Irrational Numbers',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9m1t1', title: 'Rational and Irrational numbers as real numbers' },
            { id: 'i9m1t2', title: 'Surds and rationalisation of surds with monomial and binomial denominators' },
            { id: 'i9m1t3', title: 'Simplification of expressions involving surds' }
          ]
        },
        {
          id: 'i9m2',
          title: 'Commercial Mathematics: Compound Interest',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9m2t1', title: 'Compound interest without using formula (year by year)' },
            { id: 'i9m2t2', title: 'Compound interest using formula (annual and semi-annual compounding)' },
            { id: 'i9m2t3', title: 'Inverse problems on compound interest' }
          ]
        },
        {
          id: 'i9m3',
          title: 'Algebra: Expansions & Factorisation',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9m3t1', title: 'Expansions of (a ± b)², (a ± b)³, (a + b + c)²' },
            { id: 'i9m3t2', title: 'Factorisation of trinomial expressions, difference of squares' },
            { id: 'i9m3t3', title: 'Factorisation using grouping of terms and identities' }
          ]
        },
        {
          id: 'i9m4',
          title: 'Simultaneous Linear Equations & Indices',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9m4t1', title: 'Solving simultaneous linear equations by substitution and elimination' },
            { id: 'i9m4t2', title: 'Cross-multiplication method for simultaneous equations' },
            { id: 'i9m4t3', title: 'Laws of Indices / Exponents and handling negative / fractional powers' }
          ]
        },
        {
          id: 'i9m5',
          title: 'Geometry: Triangles, Congruency & Pythagoras Theorem',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9m5t1', title: 'Conditions of congruency: SSS, SAS, ASA, RHS' },
            { id: 'i9m5t2', title: 'Isosceles triangles properties and inequalities' },
            { id: 'i9m5t3', title: 'Mid-point theorem and its converse' },
            { id: 'i9m5t4', title: 'Pythagoras Theorem and practical applications' }
          ]
        },
        {
          id: 'i9m6',
          title: 'Mensuration: Perimeter & Area of Plane Figures',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9m6t1', title: 'Perimeter and area of triangles using Heron\'s formula' },
            { id: 'i9m6t2', title: 'Area and perimeter of quadrilaterals, rectangles, parallelograms, rhombuses' },
            { id: 'i9m6t3', title: 'Circumference and area of circles, semi-circles and circular rings' }
          ]
        },
        {
          id: 'i9m7',
          title: 'Trigonometry & Coordinate Geometry',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9m7t1', title: 'Trigonometric ratios: sin, cos, tan, cot, sec, cosec of acute angles' },
            { id: 'i9m7t2', title: 'Standard angles: 0°, 30°, 45°, 60°, 90°' },
            { id: 'i9m7t3', title: 'Cartesian plane, plotting points and graphs of linear equations' }
          ]
        },
        {
          id: 'i9m8',
          title: 'Statistics: Tabulation & Graphical Representation',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'i9m8t1', title: 'Collection and tabulation of raw and grouped data' },
            { id: 'i9m8t2', title: 'Histograms and frequency polygons' },
            { id: 'i9m8t3', title: 'Mean and median of ungrouped data' }
          ]
        }
      ]
    },
    {
      id: 'icse9_phy',
      name: 'Physics (Science Paper 1)',
      chapters: [
        {
          id: 'i9p1',
          title: 'Measurements and Experimentation',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9p1t1', title: 'International System of Units (SI), derived units and prefixes' },
            { id: 'i9p1t2', title: 'Vernier Calipers: Principle, least count, zero error' },
            { id: 'i9p1t3', title: 'Micrometer Screw Gauge: Pitch, least count, zero error' },
            { id: 'i9p1t4', title: 'Simple Pendulum: Time period, length, acceleration due to gravity' }
          ]
        },
        {
          id: 'i9p2',
          title: 'Motion in One Dimension',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9p2t1', title: 'Scalar and vector quantities; Distance and displacement' },
            { id: 'i9p2t2', title: 'Speed, velocity, uniform and non-uniform acceleration' },
            { id: 'i9p2t3', title: 'Equations of uniformly accelerated motion (v = u + at, s = ut + ½at², v² = u² + 2as)' },
            { id: 'i9p2t4', title: 'Distance-time and velocity-time graphs and slope interpretation' }
          ]
        },
        {
          id: 'i9p3',
          title: 'Laws of Motion & Gravitation',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9p3t1', title: 'Newton\'s First Law of Motion and inertia' },
            { id: 'i9p3t2', title: 'Newton\'s Second Law: Linear momentum, force formula (F = ma)' },
            { id: 'i9p3t3', title: 'Newton\'s Third Law: Action and reaction pairs with everyday examples' },
            { id: 'i9p3t4', title: 'Universal Law of Gravitation, acceleration due to gravity (g vs G)' }
          ]
        },
        {
          id: 'i9p4',
          title: 'Fluids: Pressure in Fluids and Archimedes Principle',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9p4t1', title: 'Pressure in liquids (P = hρg) and Pascal\'s Law' },
            { id: 'i9p4t2', title: 'Atmospheric pressure, simple barometer, Fortin barometer' },
            { id: 'i9p4t3', title: 'Archimedes\' Principle, upthrust and apparent weight in fluids' },
            { id: 'i9p4t4', title: 'Principle of Floatation and hydrometers' }
          ]
        },
        {
          id: 'i9p5',
          title: 'Heat and Energy',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9p5t1', title: 'Concepts of heat and temperature' },
            { id: 'i9p5t2', title: 'Thermal expansion of solids, liquids and gases; anomalous expansion of water' },
            { id: 'i9p5t3', title: 'Energy flow and transmission of heat (conduction, convection, radiation)' },
            { id: 'i9p5t4', title: 'Global warming, greenhouse effect and renewable energy sources' }
          ]
        },
        {
          id: 'i9p6',
          title: 'Light: Reflection of Light & Spherical Mirrors',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9p6t1', title: 'Laws of reflection and regular vs diffuse reflection' },
            { id: 'i9p6t2', title: 'Reflection at plane mirror, virtual image characteristics' },
            { id: 'i9p6t3', title: 'Spherical mirrors (concave and convex): Focus, focal length, ray diagrams' },
            { id: 'i9p6t4', title: 'Mirror formula and magnification' }
          ]
        },
        {
          id: 'i9p7',
          title: 'Sound & Propagation of Waves',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'i9p7t1', title: 'Nature of sound waves, longitudinal wave propagation' },
            { id: 'i9p7t2', title: 'Speed of sound in different media and factors affecting speed' },
            { id: 'i9p7t3', title: 'Audible range, infrasonic and ultrasonic sound applications' }
          ]
        },
        {
          id: 'i9p8',
          title: 'Electricity and Magnetism',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9p8t1', title: 'Simple electric circuit: Current, potential difference, simple cells' },
            { id: 'i9p8t2', title: 'Static electricity: Electric charges and electroscope' },
            { id: 'i9p8t3', title: 'Properties of a magnet, magnetic field lines, Earth\'s magnetic field' },
            { id: 'i9p8t4', title: 'Electromagnets and their applications' }
          ]
        }
      ]
    },
    {
      id: 'icse9_chem',
      name: 'Chemistry (Science Paper 2)',
      chapters: [
        {
          id: 'i9c1',
          title: 'The Language of Chemistry',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9c1t1', title: 'Chemical symbols, valency of elements and radicals' },
            { id: 'i9c1t2', title: 'Writing chemical formulae of binary and polyatomic compounds' },
            { id: 'i9c1t3', title: 'Balancing chemical equations and calculation of relative molecular mass' }
          ]
        },
        {
          id: 'i9c2',
          title: 'Chemical Changes and Reactions',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9c2t1', title: 'Types of chemical reactions: Direct combination, decomposition, displacement, double decomposition' },
            { id: 'i9c2t2', title: 'Exothermic and endothermic reactions' },
            { id: 'i9c2t3', title: 'Thermal dissociation and catalytic reactions' }
          ]
        },
        {
          id: 'i9c3',
          title: 'Water & Solutions',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9c3t1', title: 'Water as a universal solvent, solutions, suspensions and colloids' },
            { id: 'i9c3t2', title: 'Solubility, solubility curves and effect of temperature' },
            { id: 'i9c3t3', title: 'Hydrated substances, efflorescence, deliquescence and hygroscopy' },
            { id: 'i9c3t4', title: 'Hardness of water: Temporary and permanent hardness and removal methods' }
          ]
        },
        {
          id: 'i9c4',
          title: 'Atomic Structure and Chemical Bonding',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9c4t1', title: 'Structure of atom: Electrons, protons, neutrons; atomic number (Z) and mass number (A)' },
            { id: 'i9c4t2', title: 'Electronic configuration of first 20 elements (Bohr model)' },
            { id: 'i9c4t3', title: 'Electrovalent (ionic) bonding (NaCl, MgCl₂, CaO)' },
            { id: 'i9c4t4', title: 'Covalent bonding: Single, double, and triple bonds (H₂, Cl₂, O₂, N₂, CH₄, H₂O, NH₃)' }
          ]
        },
        {
          id: 'i9c5',
          title: 'The Periodic Table',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9c5t1', title: 'Dobereiner triads, Newlands law of octaves, Mendeleev periodic law' },
            { id: 'i9c5t2', title: 'Modern Periodic Law and structure of Modern Periodic Table' },
            { id: 'i9c5t3', title: 'Periodic properties: Metallic/non-metallic character, atomic size across periods and groups' }
          ]
        },
        {
          id: 'i9c6',
          title: 'Study of the First Element: Hydrogen',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9c6t1', title: 'Position of hydrogen in periodic table; laboratory preparation of hydrogen' },
            { id: 'i9c6t2', title: 'Industrial preparation (Bosch process) and physical/chemical properties' },
            { id: 'i9c6t3', title: 'Oxidation and reduction in terms of addition/removal of oxygen and hydrogen' }
          ]
        },
        {
          id: 'i9c7',
          title: 'Atmospheric Pollution',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'i9c7t1', title: 'Acid rain: Causes, impacts and prevention' },
            { id: 'i9c7t2', title: 'Global warming and greenhouse gases' },
            { id: 'i9c7t3', title: 'Ozone layer depletion: Causes, chlorofluorocarbons (CFCs) and impacts' }
          ]
        }
      ]
    },
    {
      id: 'icse9_bio',
      name: 'Biology (Science Paper 3)',
      chapters: [
        {
          id: 'i9b1',
          title: 'Basic Biology: Cell and Tissues',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9b1t1', title: 'Cell as the basic unit of life; plant cell vs animal cell' },
            { id: 'i9b1t2', title: 'Cell organelles: Nucleus, mitochondria, chloroplasts, ribosomes, ER, Golgi apparatus' },
            { id: 'i9b1t3', title: 'Plant tissues: Meristematic and permanent tissues (parenchyma, collenchyma, sclerenchyma, xylem, phloem)' },
            { id: 'i9b1t4', title: 'Animal tissues: Epithelial, connective, muscular and nervous tissues' }
          ]
        },
        {
          id: 'i9b2',
          title: 'Flowering Plants: Flower, Pollination & Fertilisation',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9b2t1', title: 'Structure of a bisexual flower (calyx, corolla, androecium, gynoecium)' },
            { id: 'i9b2t2', title: 'Pollination: Self-pollination and cross-pollination; insect and wind pollination adaptations' },
            { id: 'i9b2t3', title: 'Fertilisation, formation of fruit and seeds' }
          ]
        },
        {
          id: 'i9b3',
          title: 'Plant Physiology: Seeds & Respiration in Plants',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9b3t1', title: 'Structure and germination of seeds (monocot and dicot)' },
            { id: 'i9b3t2', title: 'Types of germination: Epigeal and hypogeal; conditions necessary for germination' },
            { id: 'i9b3t3', title: 'Respiration in plants: Aerobic and anaerobic respiration; experiments demonstrating respiration' }
          ]
        },
        {
          id: 'i9b4',
          title: 'Diversity in Living Organisms & Economic Importance of Bacteria/Fungi',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9b4t1', title: 'Five-Kingdom classification (Monera, Protista, Fungi, Plantae, Animalia)' },
            { id: 'i9b4t2', title: 'Economic importance of bacteria in agriculture, industry and medicine' },
            { id: 'i9b4t3', title: 'Economic importance of fungi: Yeast, mushroom, Penicillium' }
          ]
        },
        {
          id: 'i9b5',
          title: 'Human Anatomy: Digestive System, Teeth & Nutrition',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9b5t1', title: 'Balanced diet: Carbohydrates, proteins, fats, vitamins, minerals, water and roughage' },
            { id: 'i9b5t2', title: 'Structure and types of teeth; dental formula' },
            { id: 'i9b5t3', title: 'Digestive system organs, digestive enzymes, digestion process and absorption' }
          ]
        },
        {
          id: 'i9b6',
          title: 'Human Anatomy: Respiratory System & Movement',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9b6t1', title: 'Respiratory organs in humans: Nasal passage, pharynx, larynx, trachea, bronchi, lungs' },
            { id: 'i9b6t2', title: 'Breathing mechanism: Inhalation, exhalation, diaphragm movement and gas exchange' },
            { id: 'i9b6t3', title: 'Human skeleton: Axial and appendicular skeleton; joints (types and movement)' }
          ]
        },
        {
          id: 'i9b7',
          title: 'Health and Hygiene',
          officialWeightage: 'Standard Curriculum',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'i9b7t1', title: 'Personal hygiene and social health' },
            { id: 'i9b7t2', title: 'Infectious diseases: Airborne, waterborne, vector-borne; bacteria, viruses, protozoa' },
            { id: 'i9b7t3', title: 'Immunity: Active and passive immunity; vaccination and immunization programs' }
          ]
        }
      ]
    },
    {
      id: 'icse9_eng',
      name: 'English (Language & Literature)',
      chapters: [
        {
          id: 'i9eng1',
          title: 'English Language: Composition, Grammar & Comprehension',
          officialWeightage: '80 Marks Written',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9eng1t1', title: 'Narrative, descriptive, argumentative and reflective essays (300-350 words)' },
            { id: 'i9eng1t2', title: 'Letter writing: Formal and informal letters' },
            { id: 'i9eng1t3', title: 'Notice writing and Email writing (as per official CISCE format)' },
            { id: 'i9eng1t4', title: 'Unseen comprehension passage: Vocabulary and summary writing' },
            { id: 'i9eng1t5', title: 'Functional grammar: Tenses, prepositions, sentence transformation, synthesis of sentences' }
          ]
        },
        {
          id: 'i9eng2',
          title: 'Literature in English: Drama — Julius Caesar (William Shakespeare)',
          officialWeightage: '80 Marks Written',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9eng2t1', title: 'Julius Caesar: Act I, Scene 1 & Scene 2 (Feast of Lupercal, Cassius instigating Brutus)' },
            { id: 'i9eng2t2', title: 'Julius Caesar: Act I, Scene 3 (Portents and omens in Rome, Casca and Cassius)' },
            { id: 'i9eng2t3', title: 'Julius Caesar: Act II, Scene 1 (Brutus\' orchard, conspiracy meeting, Portia)' },
            { id: 'i9eng2t4', title: 'Julius Caesar: Act II, Scene 2 (Caesar\'s house, Calphurnia\'s dream, Decius Brutus)' }
          ]
        },
        {
          id: 'i9eng3',
          title: 'Literature in English: Treasure Chest — A Collection of ICSE Poems',
          officialWeightage: '80 Marks Written',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9eng3t1', title: 'A Work of Artifice - Marge Piercy' },
            { id: 'i9eng3t2', title: 'Skimbleshanks: The Railway Cat - T.S. Eliot' },
            { id: 'i9eng3t3', title: 'I Remember, I Remember - Thomas Hood' },
            { id: 'i9eng3t4', title: 'A Doctor\'s Journal Entry for August 6, 1945 - Vikram Seth' },
            { id: 'i9eng3t5', title: 'The Night Mail - W.H. Auden' }
          ]
        },
        {
          id: 'i9eng4',
          title: 'Literature in English: Treasure Chest — A Collection of ICSE Short Stories',
          officialWeightage: '80 Marks Written',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'i9eng4t1', title: 'Bonku Babu\'s Friend - Satyajit Ray' },
            { id: 'i9eng4t2', title: 'Oliver Asks for More - Charles Dickens' },
            { id: 'i9eng4t3', title: 'The Model Millionaire - Oscar Wilde' },
            { id: 'i9eng4t4', title: 'The Home-Coming - Rabindranath Tagore' },
            { id: 'i9eng4t5', title: 'The Boy Who Broke the Bank - Ruskin Bond' }
          ]
        }
      ]
    }
  ]
};
