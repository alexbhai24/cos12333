import { SyllabusData } from '../types/syllabus';

// CBSE Class 9 | NCERT Textbooks | Session 2026-27
// Note: Class 9 has internal board examination structure.
// Weightage is provided per unit (Total 80 Marks Theory).
// weightage_type: OFFICIAL_UNIT

export const syllabusCBSE9: SyllabusData = {
  id: 'cbse_9',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 9',
  academicSession: '2026-2027',
  sourceUrl: 'https://cbseacademic.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'cbse9_math',
      name: 'Mathematics',
      chapters: [
        // Unit I: Number Systems (10 Marks)
        { id: 'c9m1', title: 'Number Systems', officialWeightage: 'Unit I (10 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9m1t1', title: 'Review of representation of natural numbers, integers, rational numbers' },
          { id: 'c9m1t2', title: 'Irrational numbers (e.g. √2, √3) and their representation on number line' },
          { id: 'c9m1t3', title: 'Rationalisation (with precise meaning)' },
          { id: 'c9m1t4', title: 'Laws of exponents with integral powers' }
        ]},
        // Unit II: Algebra (20 Marks)
        { id: 'c9m2', title: 'Polynomials', officialWeightage: 'Unit II (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9m2t1', title: 'Definition; coefficients, degree, terms' },
          { id: 'c9m2t2', title: 'Zeroes of a polynomial' },
          { id: 'c9m2t3', title: 'Remainder and Factor Theorem' },
          { id: 'c9m2t4', title: 'Factorisation of polynomials; algebraic identities' }
        ]},
        { id: 'c9m4', title: 'Linear Equations in Two Variables', officialWeightage: 'Unit II (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9m4t1', title: 'Linear equations of the form ax + by + c = 0' },
          { id: 'c9m4t2', title: 'Solution of a linear equation' },
          { id: 'c9m4t3', title: 'Graph of a linear equation in two variables' }
        ]},
        // Unit III: Coordinate Geometry (4 Marks)
        { id: 'c9m3', title: 'Coordinate Geometry', officialWeightage: 'Unit III (4 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c9m3t1', title: 'Cartesian plane, coordinates of a point' },
          { id: 'c9m3t2', title: 'Plotting points in the plane' }
        ]},
        // Unit IV: Geometry (27 Marks)
        { id: 'c9m5', title: 'Introduction to Euclid\'s Geometry', officialWeightage: 'Unit IV (27 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c9m5t1', title: 'History; Euclid\'s definitions, axioms and postulates' }
        ]},
        { id: 'c9m6', title: 'Lines and Angles', officialWeightage: 'Unit IV (27 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9m6t1', title: 'Intersecting and non-intersecting lines' },
          { id: 'c9m6t2', title: 'Pairs of angles; transversal' },
          { id: 'c9m6t3', title: 'Lines parallel to the same line' }
        ]},
        { id: 'c9m7', title: 'Triangles', officialWeightage: 'Unit IV (27 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9m7t1', title: 'Congruence: SAS, ASA, SSS, RHS criteria' },
          { id: 'c9m7t2', title: 'Properties of a triangle (angles opposite to equal sides)' },
          { id: 'c9m7t3', title: 'Inequalities in a triangle' }
        ]},
        { id: 'c9m8', title: 'Quadrilaterals', officialWeightage: 'Unit IV (27 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9m8t1', title: 'Angle sum property' },
          { id: 'c9m8t2', title: 'Types of quadrilaterals; properties of a parallelogram' },
          { id: 'c9m8t3', title: 'Mid-point theorem' }
        ]},
        { id: 'c9m10', title: 'Circles', officialWeightage: 'Unit IV (27 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9m10t1', title: 'Terms related to circles' },
          { id: 'c9m10t2', title: 'Angle subtended by a chord; perpendicular from centre' },
          { id: 'c9m10t3', title: 'Cyclic quadrilaterals' }
        ]},
        // Unit V: Mensuration (13 Marks)
        { id: 'c9m12', title: 'Heron\'s Formula', officialWeightage: 'Unit V (13 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9m12t1', title: 'Area of a triangle using Heron\'s formula' }
        ]},
        { id: 'c9m13', title: 'Surface Areas and Volumes', officialWeightage: 'Unit V (13 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9m13t1', title: 'Surface areas: spheres, hemispheres, right circular cones' },
          { id: 'c9m13t2', title: 'Volumes: spheres, hemispheres, right circular cones' }
        ]},
        // Unit VI: Statistics (6 Marks)
        { id: 'c9m14', title: 'Statistics', officialWeightage: 'Unit VI (6 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c9m14t1', title: 'Bar graphs, histograms (with varying base lengths), frequency polygons' }
        ]}
      ]
    },
    {
      id: 'cbse9_sci',
      name: 'Science',
      chapters: [
        // Unit I: Matter - Its Nature and Behaviour (25 Marks)
        { id: 'c9s1', title: 'Matter in Our Surroundings', officialWeightage: 'Unit I (25 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9s1t1', title: 'Physical nature of matter; characteristics of particles' },
          { id: 'c9s1t2', title: 'States of matter: solid, liquid, gas' },
          { id: 'c9s1t3', title: 'Change of state: melting, freezing, evaporation, condensation' }
        ]},
        { id: 'c9s2', title: 'Is Matter Around Us Pure', officialWeightage: 'Unit I (25 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9s2t1', title: 'Elements, compounds, mixtures' },
          { id: 'c9s2t2', title: 'Heterogeneous and homogeneous mixtures; colloids and suspensions' }
        ]},
        { id: 'c9s3', title: 'Atoms and Molecules', officialWeightage: 'Unit I (25 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9s3t1', title: 'Laws of chemical combination (conservation of mass, constant proportion)' },
          { id: 'c9s3t2', title: 'Dalton\'s atomic theory; atoms, molecules, atomic and molecular masses' },
          { id: 'c9s3t3', title: 'Chemical formulae of common compounds' },
          { id: 'c9s3t4', title: 'Mole concept (basic idea)' }
        ]},
        { id: 'c9s4', title: 'Structure of the Atom', officialWeightage: 'Unit I (25 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9s4t1', title: 'Electrons, protons, neutrons; Thomson\'s model, Rutherford\'s model' },
          { id: 'c9s4t2', title: 'Bohr\'s model; distribution of electrons in orbits; valency' },
          { id: 'c9s4t3', title: 'Atomic number, mass number, isotopes and isobars' }
        ]},
        // Unit II: Organization in the Living World (22 Marks)
        { id: 'c9s5', title: 'The Fundamental Unit of Life', officialWeightage: 'Unit II (22 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9s5t1', title: 'Cell as basic unit of life; prokaryotic and eukaryotic cells' },
          { id: 'c9s5t2', title: 'Cell membrane and cell wall; diffusion/osmosis' },
          { id: 'c9s5t3', title: 'Cell organelles: chloroplast, mitochondria, vacuoles, ER, golgi, nucleus' }
        ]},
        { id: 'c9s6', title: 'Tissues', officialWeightage: 'Unit II (22 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9s6t1', title: 'Structure and functions of animal and plant tissues' },
          { id: 'c9s6t2', title: 'Meristematic and permanent tissues in plants' }
        ]},
        // Unit III: Motion, Force and Work (27 Marks)
        { id: 'c9s8', title: 'Motion', officialWeightage: 'Unit III (27 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9s8t1', title: 'Distance and displacement; velocity; uniform and non-uniform motion' },
          { id: 'c9s8t2', title: 'Acceleration; distance-time and velocity-time graphs' },
          { id: 'c9s8t3', title: 'Equations of motion by graphical method; uniform circular motion' }
        ]},
        { id: 'c9s9', title: 'Force and Laws of Motion', officialWeightage: 'Unit III (27 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9s9t1', title: 'Force and motion; Newton\'s laws of motion' },
          { id: 'c9s9t2', title: 'Inertia, momentum, force and acceleration' },
          { id: 'c9s9t3', title: 'Action and reaction forces; conservation of momentum' }
        ]},
        { id: 'c9s10', title: 'Gravitation', officialWeightage: 'Unit III (27 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9s10t1', title: 'Gravitation; universal law of gravitation; force of gravitation of earth' },
          { id: 'c9s10t2', title: 'Acceleration due to gravity; mass and weight; free fall' },
          { id: 'c9s10t3', title: 'Thrust and pressure; Archimedes\' principle; buoyancy' }
        ]},
        { id: 'c9s11', title: 'Work and Energy', officialWeightage: 'Unit III (27 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9s11t1', title: 'Work done by a force; energy, power' },
          { id: 'c9s11t2', title: 'Kinetic and potential energy; law of conservation of energy' }
        ]},
        { id: 'c9s12', title: 'Sound', officialWeightage: 'Unit III (27 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c9s12t1', title: 'Production and propagation of sound; longitudinal wave' },
          { id: 'c9s12t2', title: 'Speed of sound, range of hearing, ultrasound; reflection of sound, echo' }
        ]},
        // Unit IV: Food Production (6 Marks)
        { id: 'c9s15', title: 'Improvement in Food Resources', officialWeightage: 'Unit IV (6 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c9s15t1', title: 'Plant and animal breeding and selection for quality improvement' },
          { id: 'c9s15t2', title: 'Use of fertilizers and manures; protection from pests and diseases; organic farming' }
        ]}
      ]
    },
    {
      id: 'cbse9_sst',
      name: 'Social Science',
      chapters: [
        // History: India and the Contemporary World - I (20 Marks)
        { id: 'c9h1', title: 'The French Revolution', officialWeightage: 'History (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9h1t1', title: 'French Society during the Late Eighteenth Century' },
          { id: 'c9h1t2', title: 'The Outbreak of the Revolution; France becomes a Constitutional Monarchy' },
          { id: 'c9h1t3', title: 'Did Women have a Revolution? The Abolition of Slavery' }
        ]},
        { id: 'c9h2', title: 'Socialism in Europe and the Russian Revolution', officialWeightage: 'History (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9h2t1', title: 'The Age of Social Change; the Russian Revolution' },
          { id: 'c9h2t2', title: 'The February Revolution in Petrograd; What Changed after October?' }
        ]},
        { id: 'c9h3', title: 'Nazism and the Rise of Hitler', officialWeightage: 'History (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9h3t1', title: 'Birth of the Weimar Republic; Hitler\'s Rise to Power' },
          { id: 'c9h3t2', title: 'The Nazi Worldview; Youth in Nazi Germany' }
        ]},
        { id: 'c9h4', title: 'Forest Society and Colonialism', officialWeightage: 'History (20 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c9h4t1', title: 'Why Deforestation?; The Rise of Commercial Forestry' },
          { id: 'c9h4t2', title: 'Rebellion in the Forest' }
        ]},
        { id: 'c9h5', title: 'Pastoralists in the Modern World', officialWeightage: 'History (20 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c9h5t1', title: 'Pastoral Nomads and their Movements' },
          { id: 'c9h5t2', title: 'Colonial Rule and Pastoral Life' }
        ]},
        // Geography: Contemporary India - I (20 Marks)
        { id: 'c9g1', title: 'India – Size and Location', officialWeightage: 'Geography (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9g1t1', title: 'Location, Size, India and the World, India\'s Neighbours' }
        ]},
        { id: 'c9g2', title: 'Physical Features of India', officialWeightage: 'Geography (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9g2t1', title: 'Major Physiographic Divisions: Himalayas, Northern Plains, Peninsular Plateau' },
          { id: 'c9g2t2', title: 'The Indian Desert, Coastal Plains, Islands' }
        ]},
        { id: 'c9g3', title: 'Drainage', officialWeightage: 'Geography (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9g3t1', title: 'Drainage Systems in India: Himalayan and Peninsular Rivers' },
          { id: 'c9g3t2', title: 'Lakes; Role of rivers in economy; River pollution' }
        ]},
        { id: 'c9g4', title: 'Climate', officialWeightage: 'Geography (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9g4t1', title: 'Concept of climate; Climatic controls; Factors affecting India\'s climate' },
          { id: 'c9g4t2', title: 'The Indian Monsoon; Distribution of Rainfall' }
        ]},
        { id: 'c9g5', title: 'Natural Vegetation and Wildlife', officialWeightage: 'Geography (20 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c9g5t1', title: 'Factors affecting vegetation; Types of vegetation' },
          { id: 'c9g5t2', title: 'Wildlife conservation' }
        ]},
        { id: 'c9g6', title: 'Population', officialWeightage: 'Geography (20 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c9g6t1', title: 'Population size and distribution; Population growth and processes of population change' }
        ]},
        // Political Science: Democratic Politics - I (20 Marks)
        { id: 'c9p1', title: 'What is Democracy? Why Democracy?', officialWeightage: 'Polity (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9p1t1', title: 'Features of Democracy; Why Democracy?; Broader Meanings of Democracy' }
        ]},
        { id: 'c9p2', title: 'Constitutional Design', officialWeightage: 'Polity (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9p2t1', title: 'Democratic Constitution in South Africa; Why do we need a Constitution?' },
          { id: 'c9p2t2', title: 'Making of the Indian Constitution' }
        ]},
        { id: 'c9p3', title: 'Electoral Politics', officialWeightage: 'Polity (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9p3t1', title: 'Why Elections?; What is our system of elections?' },
          { id: 'c9p3t2', title: 'What makes elections in India democratic?' }
        ]},
        { id: 'c9p4', title: 'Working of Institutions', officialWeightage: 'Polity (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9p4t1', title: 'How is a major policy decision taken? Parliament' },
          { id: 'c9p4t2', title: 'Political Executive; The Judiciary' }
        ]},
        { id: 'c9p5', title: 'Democratic Rights', officialWeightage: 'Polity (20 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c9p5t1', title: 'Life without rights; Rights in a Democracy; Rights in the Indian Constitution' }
        ]},
        // Economics (20 Marks)
        { id: 'c9e1', title: 'The Story of Village Palampur', officialWeightage: 'Economics (20 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c9e1t1', title: 'Organization of production; Farming in Palampur; Non-farm activities' }
        ]},
        { id: 'c9e2', title: 'People as Resource', officialWeightage: 'Economics (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9e2t1', title: 'Economic activities; Quality of Population (Education, Health); Unemployment' }
        ]},
        { id: 'c9e3', title: 'Poverty as a Challenge', officialWeightage: 'Economics (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9e3t1', title: 'Poverty line; Poverty estimates; Vulnerable groups; Interstate disparities' },
          { id: 'c9e3t2', title: 'Global poverty scenario; Causes of poverty; Anti-poverty measures' }
        ]},
        { id: 'c9e4', title: 'Food Security in India', officialWeightage: 'Economics (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9e4t1', title: 'What is food security?; Why food security?; Who are food insecure?' },
          { id: 'c9e4t2', title: 'Food security in India; What is Buffer Stock?; Public Distribution System' }
        ]}
      ]
    },
    {
      id: 'cbse9_eng',
      name: 'English (Language and Literature)',
      chapters: [
        // Beehive (Prose & Poetry)
        { id: 'c9eng1', title: 'Beehive (Prose)', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
          { id: 'c9eng1t1', title: 'The Fun They Had; The Sound of Music; The Little Girl' },
          { id: 'c9eng1t2', title: 'A Truly Beautiful Mind; The Snake and the Mirror; My Childhood' },
          { id: 'c9eng1t3', title: 'Reach for the Top; Kathmandu; If I Were You' }
        ]},
        { id: 'c9eng2', title: 'Beehive (Poetry)', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
          { id: 'c9eng2t1', title: 'The Road Not Taken; Wind; Rain on the Roof' },
          { id: 'c9eng2t2', title: 'The Lake Isle of Innisfree; A Legend of the Northland' },
          { id: 'c9eng2t3', title: 'No Men Are Foreign; On Killing a Tree; A Slumber Did My Spirit Seal' }
        ]},
        { id: 'c9eng3', title: 'Moments (Supplementary Reader)', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
          { id: 'c9eng3t1', title: 'The Lost Child; The Adventures of Toto; Iswaran the Storyteller' },
          { id: 'c9eng3t2', title: 'In the Kingdom of Fools; The Happy Prince; Weathering the Storm in Ersama' },
          { id: 'c9eng3t3', title: 'The Last Leaf; A House is Not a Home; The Beggar' }
        ]},
        // Reading, Writing, Grammar
        { id: 'c9eng4', title: 'Reading Comprehension', officialWeightage: 'Reading (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9eng4t1', title: 'Discursive passage; Case-based factual passage' }
        ]},
        { id: 'c9eng5', title: 'Writing Skills', officialWeightage: 'Writing (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9eng5t1', title: 'Descriptive Paragraph (person/event/situation)' },
          { id: 'c9eng5t2', title: 'Diary Entry; Story writing' }
        ]},
        { id: 'c9eng6', title: 'Grammar', officialWeightage: 'Grammar (10 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c9eng6t1', title: 'Tenses; Modals; Subject-verb concord; Reported speech' },
          { id: 'c9eng6t2', title: 'Determiners' }
        ]}
      ]
    },
    {
      id: 'cbse9_hin_a',
      name: 'Hindi Course A',
      chapters: [
        { id: 'c9ha1', title: 'क्षितिज भाग 1 (गद्य)', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
          { id: 'c9ha1t1', title: 'दो बैलों की कथा (प्रेमचंद); ल्हासा की ओर (राहुल सांकृत्यायन)' },
          { id: 'c9ha1t2', title: 'उपभोक्तावाद की संस्कृति; साँवले सपनों की याद' },
          { id: 'c9ha1t3', title: 'प्रेमचंद के फटे जूते; मेरे बचपन के दिन' }
        ]},
        { id: 'c9ha2', title: 'क्षितिज भाग 1 (काव्य)', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
          { id: 'c9ha2t1', title: 'साखियाँ एवं सबद (कबीर); वाख (ललद्यद)' },
          { id: 'c9ha2t2', title: 'सवैये (रसखान); कैदी और कोकिला (माखनलाल चतुर्वेदी)' },
          { id: 'c9ha2t3', title: 'ग्राम श्री; मेघ आए; बच्चे काम पर जा रहे हैं' }
        ]},
        { id: 'c9ha3', title: 'कृतिका भाग 1 (पूरक पुस्तिका)', officialWeightage: 'Literature', pyqPriority: 'MEDIUM', topics: [
          { id: 'c9ha3t1', title: 'इस जल प्रलय में; मेरे संग की औरतें' },
          { id: 'c9ha3t2', title: 'रीढ़ की हड्डी' }
        ]},
        { id: 'c9ha4', title: 'व्याकरण एवं लेखन', officialWeightage: 'Grammar & Writing', pyqPriority: 'HIGH', topics: [
          { id: 'c9ha4t1', title: 'उपसर्ग, प्रत्यय, समास, अर्थ की दृष्टि से वाक्य भेद, अलंकार' },
          { id: 'c9ha4t2', title: 'अनुच्छेद लेखन, पत्र लेखन, लघु कथा लेखन, ई-मेल लेखन, सूचना/संवाद लेखन' }
        ]}
      ]
    }
  ]
};
