import { SyllabusData } from '../types/syllabus';

// CBSE Class 11 PCB (Science) | Session 2026-27
// Official source: cbseacademic.nic.in
// Includes: Physics, Chemistry, Biology, English Core
// weightage_type: OFFICIAL_UNIT

export const syllabusCBSE11PCB: SyllabusData = {
  id: 'cbse_11_pcb',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://cbseacademic.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'cbse11_phy',
      name: 'Physics',
      chapters: [
        // Unit I & II: 23 Marks
        { id: 'c11p1', title: 'Units and Measurements', officialWeightage: 'Unit I & II (23 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11p1t1', title: 'Need for measurement; Units of measurement; systems of units; SI units' },
          { id: 'c11p1t2', title: 'Significant figures' },
          { id: 'c11p1t3', title: 'Dimensions of physical quantities, dimensional analysis and its applications' }
        ]},
        { id: 'c11p2', title: 'Motion in a Straight Line', officialWeightage: 'Unit I & II (23 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11p2t1', title: 'Frame of reference, Motion in a straight line, Position-time graph, speed and velocity' },
          { id: 'c11p2t2', title: 'Elementary concepts of differentiation and integration for describing motion' },
          { id: 'c11p2t3', title: 'Uniform and non-uniform motion, average speed and instantaneous velocity' },
          { id: 'c11p2t4', title: 'Uniformly accelerated motion, velocity-time and position-time graphs' },
          { id: 'c11p2t5', title: 'Relations for uniformly accelerated motion (graphical treatment)' }
        ]},
        { id: 'c11p3', title: 'Motion in a Plane', officialWeightage: 'Unit I & II (23 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11p3t1', title: 'Scalar and vector quantities; Position and displacement vectors, general vectors' },
          { id: 'c11p3t2', title: 'Equality of vectors, multiplication of vectors by a real number' },
          { id: 'c11p3t3', title: 'Addition and subtraction of vectors; Unit vector' },
          { id: 'c11p3t4', title: 'Resolution of a vector in a plane, rectangular components' },
          { id: 'c11p3t5', title: 'Scalar and Vector product of vectors' },
          { id: 'c11p3t6', title: 'Motion in a plane, cases of uniform velocity and uniform acceleration-projectile motion' },
          { id: 'c11p3t7', title: 'Uniform circular motion' }
        ]},
        // Unit III: 17 Marks
        { id: 'c11p4', title: 'Laws of Motion', officialWeightage: 'Unit III (17 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11p4t1', title: 'Intuitive concept of force; Inertia, Newton\'s first law' },
          { id: 'c11p4t2', title: 'Momentum and Newton\'s second law; impulse' },
          { id: 'c11p4t3', title: 'Newton\'s third law; Law of conservation of linear momentum and its applications' },
          { id: 'c11p4t4', title: 'Equilibrium of concurrent forces; Static and kinetic friction, laws of friction' },
          { id: 'c11p4t5', title: 'Dynamics of uniform circular motion: Centripetal force, examples of circular motion' }
        ]},
        // Unit IV, V, VI: 17 Marks
        { id: 'c11p5', title: 'Work, Energy and Power', officialWeightage: 'Unit IV, V, VI (17 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11p5t1', title: 'Work done by a constant force and a variable force; kinetic energy' },
          { id: 'c11p5t2', title: 'Work-energy theorem, power' },
          { id: 'c11p5t3', title: 'Notion of potential energy, potential energy of a spring' },
          { id: 'c11p5t4', title: 'Conservative forces: conservation of mechanical energy (KE and PE)' },
          { id: 'c11p5t5', title: 'Non-conservative forces: motion in a vertical circle' },
          { id: 'c11p5t6', title: 'Elastic and inelastic collisions in one and two dimensions' }
        ]},
        { id: 'c11p6', title: 'System of Particles and Rotational Motion', officialWeightage: 'Unit IV, V, VI (17 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11p6t1', title: 'Centre of mass of a two-particle system, momentum conservation and centre of mass motion' },
          { id: 'c11p6t2', title: 'Centre of mass of a rigid body; centre of mass of a uniform rod' },
          { id: 'c11p6t3', title: 'Moment of a force, torque, angular momentum, laws of conservation' },
          { id: 'c11p6t4', title: 'Equilibrium of rigid bodies, rigid body rotation and equations of rotational motion' },
          { id: 'c11p6t5', title: 'Comparison of linear and rotational motions' },
          { id: 'c11p6t6', title: 'Moment of inertia, radius of gyration, values of moments of inertia (simple geometric objects)' }
        ]},
        { id: 'c11p7', title: 'Gravitation', officialWeightage: 'Unit IV, V, VI (17 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11p7t1', title: 'Kepler\'s laws of planetary motion, universal law of gravitation' },
          { id: 'c11p7t2', title: 'Acceleration due to gravity and its variation with altitude and depth' },
          { id: 'c11p7t3', title: 'Gravitational potential energy and gravitational potential' },
          { id: 'c11p7t4', title: 'Escape velocity, orbital velocity of a satellite, Geo-stationary satellites' }
        ]},
        // Unit VII, VIII, IX: 20 Marks
        { id: 'c11p8', title: 'Mechanical Properties of Solids', officialWeightage: 'Unit VII, VIII, IX (20 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11p8t1', title: 'Elasticity, Stress-strain relationship' },
          { id: 'c11p8t2', title: 'Hooke\'s law, Young\'s modulus, bulk modulus, shear modulus of rigidity' },
          { id: 'c11p8t3', title: 'Poisson\'s ratio; elastic energy' }
        ]},
        { id: 'c11p9', title: 'Mechanical Properties of Fluids', officialWeightage: 'Unit VII, VIII, IX (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11p9t1', title: 'Pressure due to a fluid column; Pascal\'s law and its applications' },
          { id: 'c11p9t2', title: 'Effect of gravity on fluid pressure' },
          { id: 'c11p9t3', title: 'Viscosity, Stokes\' law, terminal velocity' },
          { id: 'c11p9t4', title: 'Streamline and turbulent flow, critical velocity' },
          { id: 'c11p9t5', title: 'Bernoulli\'s theorem and its applications' },
          { id: 'c11p9t6', title: 'Surface energy and surface tension, angle of contact, drops, bubbles, capillary rise' }
        ]},
        { id: 'c11p10', title: 'Thermal Properties of Matter', officialWeightage: 'Unit VII, VIII, IX (20 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11p10t1', title: 'Heat, temperature, thermal expansion; specific heat capacity, Cp, Cv' },
          { id: 'c11p10t2', title: 'Calorimetry; change of state - latent heat capacity' },
          { id: 'c11p10t3', title: 'Heat transfer - conduction, convection and radiation, thermal conductivity' },
          { id: 'c11p10t4', title: 'Qualitative ideas of Blackbody radiation, Wein\'s displacement Law, Stefan\'s law' }
        ]},
        { id: 'c11p11', title: 'Thermodynamics', officialWeightage: 'Unit VII, VIII, IX (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11p11t1', title: 'Thermal equilibrium and definition of temperature (zeroth law)' },
          { id: 'c11p11t2', title: 'Heat, work and internal energy' },
          { id: 'c11p11t3', title: 'First law of thermodynamics, isothermal and adiabatic processes' },
          { id: 'c11p11t4', title: 'Second law of thermodynamics: reversible and irreversible processes' }
        ]},
        { id: 'c11p12', title: 'Kinetic Theory', officialWeightage: 'Unit VII, VIII, IX (20 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11p12t1', title: 'Equation of state of a perfect gas, work done in compressing a gas' },
          { id: 'c11p12t2', title: 'Kinetic theory of gases - assumptions, concept of pressure' },
          { id: 'c11p12t3', title: 'Kinetic interpretation of temperature; rms speed of gas molecules' },
          { id: 'c11p12t4', title: 'Degrees of freedom, law of equipartition of energy and applications' },
          { id: 'c11p12t5', title: 'Concept of mean free path, Avogadro\'s number' }
        ]},
        // Unit X: 10 Marks
        { id: 'c11p13', title: 'Oscillations', officialWeightage: 'Unit X (10 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11p13t1', title: 'Periodic motion - time period, frequency, displacement as a function of time' },
          { id: 'c11p13t2', title: 'Simple harmonic motion (SHM) and its equation; phase' },
          { id: 'c11p13t3', title: 'Oscillations of a loaded spring - restoring force and force constant' },
          { id: 'c11p13t4', title: 'Energy in SHM. Kinetic and potential energies' },
          { id: 'c11p13t5', title: 'Simple pendulum derivation of expression for its time period' }
        ]},
        { id: 'c11p14', title: 'Waves', officialWeightage: 'Unit X (10 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11p14t1', title: 'Wave motion: Transverse and longitudinal waves, speed of travelling wave' },
          { id: 'c11p14t2', title: 'Displacement relation for a progressive wave' },
          { id: 'c11p14t3', title: 'Principle of superposition of waves, reflection of waves' },
          { id: 'c11p14t4', title: 'Standing waves in strings and organ pipes, fundamental mode and harmonics' },
          { id: 'c11p14t5', title: 'Beats' }
        ]}
      ]
    },
    {
      id: 'cbse11_chem',
      name: 'Chemistry',
      chapters: [
        // Physical Chemistry
        { id: 'c11c1', title: 'Some Basic Concepts of Chemistry', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11c1t1', title: 'General Introduction: Importance and scope of chemistry' },
          { id: 'c11c1t2', title: 'Nature of matter, laws of chemical combination, Dalton\'s atomic theory' },
          { id: 'c11c1t3', title: 'Atomic and molecular masses, mole concept and molar mass' },
          { id: 'c11c1t4', title: 'Percentage composition, empirical and molecular formula' },
          { id: 'c11c1t5', title: 'Chemical reactions, stoichiometry and calculations based on stoichiometry' }
        ]},
        { id: 'c11c2', title: 'Structure of Atom', officialWeightage: '9 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11c2t1', title: 'Bohr\'s model and its limitations, concept of shells and subshells' },
          { id: 'c11c2t2', title: 'Dual nature of matter and light, de Broglie\'s relationship' },
          { id: 'c11c2t3', title: 'Heisenberg uncertainty principle, concept of orbitals, quantum numbers' },
          { id: 'c11c2t4', title: 'Shapes of s, p, and d orbitals, rules for filling electrons in orbitals - Aufbau principle' },
          { id: 'c11c2t5', title: 'Pauli\'s exclusion principle and Hund\'s rule, electronic configuration of atoms' }
        ]},
        { id: 'c11c3', title: 'Classification of Elements and Periodicity in Properties', officialWeightage: '6 Marks', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11c3t1', title: 'Significance of classification, brief history of the development of periodic table' },
          { id: 'c11c3t2', title: 'Modern periodic law and the present form of periodic table' },
          { id: 'c11c3t3', title: 'Periodic trends in properties of elements - atomic radii, ionic radii, inert gas radii' },
          { id: 'c11c3t4', title: 'Ionization enthalpy, electron gain enthalpy, electronegativity, valency' }
        ]},
        { id: 'c11c4', title: 'Chemical Bonding and Molecular Structure', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11c4t1', title: 'Valence electrons, ionic bond, covalent bond, bond parameters' },
          { id: 'c11c4t2', title: 'Lewis structure, polar character of covalent bond, covalent character of ionic bond' },
          { id: 'c11c4t3', title: 'Valence bond theory, resonance, geometry of covalent molecules' },
          { id: 'c11c4t4', title: 'VSEPR theory, concept of hybridization involving s, p and d orbitals and shapes' },
          { id: 'c11c4t5', title: 'Molecular orbital theory of homonuclear diatomic molecules (qualitative idea only)' },
          { id: 'c11c4t6', title: 'Hydrogen bond' }
        ]},
        { id: 'c11c5', title: 'Chemical Thermodynamics', officialWeightage: '9 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11c5t1', title: 'Concepts of System and types of systems, surroundings, work, heat, energy' },
          { id: 'c11c5t2', title: 'First law of thermodynamics - internal energy and enthalpy' },
          { id: 'c11c5t3', title: 'Heat capacity and specific heat, measurement of ΔU and ΔH' },
          { id: 'c11c5t4', title: 'Hess\'s law of constant heat summation, enthalpy of bond dissociation, combustion' },
          { id: 'c11c5t5', title: 'Introduction of entropy as a state function, Second law of thermodynamics' },
          { id: 'c11c5t6', title: 'Gibbs energy change for spontaneous and non-spontaneous processes, criteria for equilibrium' }
        ]},
        { id: 'c11c6', title: 'Equilibrium', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11c6t1', title: 'Equilibrium in physical and chemical processes, dynamic nature of equilibrium' },
          { id: 'c11c6t2', title: 'Law of mass action, equilibrium constant, factors affecting equilibrium - Le Chatelier\'s principle' },
          { id: 'c11c6t3', title: 'Ionic equilibrium - ionization of acids and bases, strong and weak electrolytes, degree of ionization' },
          { id: 'c11c6t4', title: 'Concept of pH, hydrolysis of salts (elementary idea), buffer solution' },
          { id: 'c11c6t5', title: 'Henderson Equation, solubility product, common ion effect' }
        ]},
        { id: 'c11c7', title: 'Redox Reactions', officialWeightage: '4 Marks', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11c7t1', title: 'Concept of oxidation and reduction, redox reactions' },
          { id: 'c11c7t2', title: 'Oxidation number, balancing redox reactions, in terms of loss and gain of electrons and change in oxidation number' }
        ]},
        // Organic Chemistry
        { id: 'c11c8', title: 'Organic Chemistry - Some Basic Principles and Techniques', officialWeightage: '11 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11c8t1', title: 'General introduction, methods of purification, qualitative and quantitative analysis' },
          { id: 'c11c8t2', title: 'Classification and IUPAC nomenclature of organic compounds' },
          { id: 'c11c8t3', title: 'Electronic displacements in a covalent bond: inductive effect, electromeric effect' },
          { id: 'c11c8t4', title: 'Resonance and hyperconjugation' },
          { id: 'c11c8t5', title: 'Homolytic and heterolytic fission of a covalent bond: free radicals, carbocations, carbanions' }
        ]},
        { id: 'c11c9', title: 'Hydrocarbons', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11c9t1', title: 'Alkanes - Nomenclature, isomerism, conformation (ethane only), physical properties, chemical reactions' },
          { id: 'c11c9t2', title: 'Alkenes - Nomenclature, structure of double bond (ethene), geometrical isomerism, physical properties, chemical reactions' },
          { id: 'c11c9t3', title: 'Markovnikov\'s addition, peroxide effect, ozonolysis, mechanism of electrophilic addition' },
          { id: 'c11c9t4', title: 'Alkynes - Nomenclature, structure of triple bond (ethyne), physical properties, chemical reactions' },
          { id: 'c11c9t5', title: 'Aromatic Hydrocarbons - Introduction, IUPAC nomenclature, benzene: resonance, aromaticity' },
          { id: 'c11c9t6', title: 'Chemical properties: mechanism of electrophilic substitution, directive influence of functional group' }
        ]}
      ]
    },
    {
      id: 'cbse11_bio',
      name: 'Biology',
      chapters: [
        // Unit I: Diversity of Living Organisms (15 Marks)
        { id: 'c11b1', title: 'The Living World', officialWeightage: 'Unit I (15 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11b1t1', title: 'Biodiversity; Need for classification; Three domains of life' },
          { id: 'c11b1t2', title: 'Taxonomy and systematics; Concept of species and taxonomical hierarchy' },
          { id: 'c11b1t3', title: 'Binomial nomenclature' }
        ]},
        { id: 'c11b2', title: 'Biological Classification', officialWeightage: 'Unit I (15 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b2t1', title: 'Five kingdom classification; Salient features and classification of Monera, Protista and Fungi' },
          { id: 'c11b2t2', title: 'Lichens, Viruses and Viroids' }
        ]},
        { id: 'c11b3', title: 'Plant Kingdom', officialWeightage: 'Unit I (15 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b3t1', title: 'Classification of plants into major groups; Salient and distinguishing features of Algae, Bryophyta, Pteridophyta, Gymnospermae' }
        ]},
        { id: 'c11b4', title: 'Animal Kingdom', officialWeightage: 'Unit I (15 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b4t1', title: 'Salient features and classification of animals, non-chordates up to phyla level and chordates up to class level' }
        ]},
        // Unit II: Structural Organization in Plants and Animals (10 Marks)
        { id: 'c11b5', title: 'Morphology of Flowering Plants', officialWeightage: 'Unit II (10 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b5t1', title: 'Morphology of different parts of flowering plants: root, stem, leaf, inflorescence, flower, fruit and seed' },
          { id: 'c11b5t2', title: 'Description of family Solanaceae' }
        ]},
        { id: 'c11b6', title: 'Anatomy of Flowering Plants', officialWeightage: 'Unit II (10 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11b6t1', title: 'Anatomy and functions of tissue systems in dicots and monocots' }
        ]},
        { id: 'c11b7', title: 'Structural Organisation in Animals', officialWeightage: 'Unit II (10 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11b7t1', title: 'Morphology, anatomy and functions of different systems (digestive, circulatory, respiratory, nervous and reproductive) of frog' }
        ]},
        // Unit III: Cell: Structure and Function (15 Marks)
        { id: 'c11b8', title: 'Cell-The Unit of Life', officialWeightage: 'Unit III (15 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b8t1', title: 'Cell theory and cell as the basic unit of life, structure of prokaryotic and eukaryotic cells' },
          { id: 'c11b8t2', title: 'Plant cell and animal cell; cell envelope; cell membrane, cell wall' },
          { id: 'c11b8t3', title: 'Cell organelles - structure and function; endomembrane system, endoplasmic reticulum, golgi bodies, lysosomes, vacuoles' },
          { id: 'c11b8t4', title: 'Mitochondria, ribosomes, plastids, microbodies; cytoskeleton, cilia, flagella, centrioles' },
          { id: 'c11b8t5', title: 'Nucleus' }
        ]},
        { id: 'c11b9', title: 'Biomolecules', officialWeightage: 'Unit III (15 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b9t1', title: 'Chemical constituents of living cells: biomolecules, structure and function of proteins, carbohydrates, lipids, nucleic acids' },
          { id: 'c11b9t2', title: 'Enzyme - types, properties, enzyme action' }
        ]},
        { id: 'c11b10', title: 'Cell Cycle and Cell Division', officialWeightage: 'Unit III (15 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b10t1', title: 'Cell cycle, mitosis, meiosis and their significance' }
        ]},
        // Unit IV: Plant Physiology (12 Marks)
        { id: 'c11b13', title: 'Photosynthesis in Higher Plants', officialWeightage: 'Unit IV (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b13t1', title: 'Photosynthesis as a means of autotrophic nutrition; site of photosynthesis, pigments involved' },
          { id: 'c11b13t2', title: 'Photochemical and biosynthetic phases of photosynthesis; cyclic and non-cyclic photophosphorylation' },
          { id: 'c11b13t3', title: 'Chemiosmotic hypothesis; photorespiration; C3 and C4 pathways; factors affecting photosynthesis' }
        ]},
        { id: 'c11b14', title: 'Respiration in Plants', officialWeightage: 'Unit IV (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b14t1', title: 'Exchange of gases; cellular respiration - glycolysis, fermentation (anaerobic), TCA cycle and electron transport system (aerobic)' },
          { id: 'c11b14t2', title: 'Energy relations - number of ATP molecules generated; amphibolic pathways; respiratory quotient' }
        ]},
        { id: 'c11b15', title: 'Plant - Growth and Development', officialWeightage: 'Unit IV (12 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11b15t1', title: 'Seed germination; phases of plant growth and plant growth rate; conditions of growth' },
          { id: 'c11b15t2', title: 'Differentiation, dedifferentiation and redifferentiation; sequence of developmental processes in a plant cell' },
          { id: 'c11b15t3', title: 'Growth regulators - auxin, gibberellin, cytokinin, ethylene, ABA' }
        ]},
        // Unit V: Human Physiology (18 Marks)
        { id: 'c11b17', title: 'Breathing and Exchange of Gases', officialWeightage: 'Unit V (18 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b17t1', title: 'Respiratory organs in animals; Respiratory system in humans' },
          { id: 'c11b17t2', title: 'Mechanism of breathing and its regulation in humans - exchange of gases, transport of gases and regulation of respiration' },
          { id: 'c11b17t3', title: 'Respiratory volumes; disorders related to respiration - asthma, emphysema, occupational respiratory disorders' }
        ]},
        { id: 'c11b18', title: 'Body Fluids and Circulation', officialWeightage: 'Unit V (18 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b18t1', title: 'Composition of blood, blood groups, coagulation of blood; composition of lymph and its function' },
          { id: 'c11b18t2', title: 'Human circulatory system - Structure of human heart and blood vessels; cardiac cycle, cardiac output, ECG' },
          { id: 'c11b18t3', title: 'Double circulation; regulation of cardiac activity; disorders of circulatory system - hypertension, coronary artery disease, angina pectoris, heart failure' }
        ]},
        { id: 'c11b19', title: 'Excretory Products and their Elimination', officialWeightage: 'Unit V (18 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b19t1', title: 'Modes of excretion - ammonotelism, ureotelism, uricotelism; human excretory system - structure and function' },
          { id: 'c11b19t2', title: 'Urine formation, osmoregulation; regulation of kidney function - renin-angiotensin, atrial natriuretic factor, ADH and diabetes insipidus' },
          { id: 'c11b19t3', title: 'Role of other organs in excretion; disorders - uremia, renal failure, renal calculi, nephritis; dialysis and artificial kidney' }
        ]},
        { id: 'c11b20', title: 'Locomotion and Movement', officialWeightage: 'Unit V (18 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11b20t1', title: 'Types of movement - ciliary, flagellar, muscular; skeletal muscle, contractile proteins and muscle contraction' },
          { id: 'c11b20t2', title: 'Skeletal system and its functions; joints; disorders of muscular and skeletal systems - myasthenia gravis, tetany, muscular dystrophy, arthritis, osteoporosis, gout' }
        ]},
        { id: 'c11b21', title: 'Neural Control and Coordination', officialWeightage: 'Unit V (18 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b21t1', title: 'Neuron and nerves; Nervous system in humans - central nervous system; peripheral nervous system and visceral nervous system' },
          { id: 'c11b21t2', title: 'Generation and conduction of nerve impulse' }
        ]},
        { id: 'c11b22', title: 'Chemical Coordination and Integration', officialWeightage: 'Unit V (18 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11b22t1', title: 'Endocrine glands and hormones; human endocrine system - hypothalamus, pituitary, pineal, thyroid, parathyroid, adrenal, pancreas, gonads' },
          { id: 'c11b22t2', title: 'Mechanism of hormone action (elementary idea); role of hormones as messengers and regulators, hypo - and hyperactivity and related disorders' },
          { id: 'c11b22t3', title: 'Dwarfism, acromegaly, cretinism, goiter, exophthalmic goiter, diabetes, Addison\'s disease' }
        ]}
      ]
    },
    {
      id: 'cbse11_eng',
      name: 'English Core',
      chapters: [
        { id: 'c11e1', title: 'Reading Comprehension', officialWeightage: '26 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11e1t1', title: 'Unseen Passage (Factual, Descriptive or Literary)' },
          { id: 'c11e1t2', title: 'Case-based Unseen Passage' },
          { id: 'c11e1t3', title: 'Note Making and Summarization' }
        ]},
        { id: 'c11e2', title: 'Creative Writing Skills', officialWeightage: '23 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11e2t1', title: 'Short writing task: Poster' },
          { id: 'c11e2t2', title: 'Speech writing' },
          { id: 'c11e2t3', title: 'Debate writing' }
        ]},
        { id: 'c11e3', title: 'Grammar', officialWeightage: '7 Marks', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11e3t1', title: 'Questions on Gap filling (Tenses, Clauses)' },
          { id: 'c11e3t2', title: 'Questions on re-ordering/transformation of sentences' }
        ]},
        { id: 'c11e4', title: 'Literature: Hornbill', officialWeightage: 'Literature Section', pyqPriority: 'HIGH', topics: [
          { id: 'c11e4t1', title: 'The Portrait of a Lady; A Photograph (Poem)' },
          { id: 'c11e4t2', title: 'We\'re Not Afraid to Die... if We Can Be Together' },
          { id: 'c11e4t3', title: 'Discovering Tut: the Saga Continues; The Laburnum Top (Poem)' },
          { id: 'c11e4t4', title: 'The Voice of the Rain (Poem); Childhood (Poem)' },
          { id: 'c11e4t5', title: 'The Adventure; Silk Road; Father to Son (Poem)' }
        ]},
        { id: 'c11e5', title: 'Literature: Snapshots', officialWeightage: 'Literature Section', pyqPriority: 'HIGH', topics: [
          { id: 'c11e5t1', title: 'The Summer of the Beautiful White Horse' },
          { id: 'c11e5t2', title: 'The Address' },
          { id: 'c11e5t3', title: 'Mother\'s Day' },
          { id: 'c11e5t4', title: 'Birth' },
          { id: 'c11e5t5', title: 'The Tale of Melon City' }
        ]}
      ]
    }
  ]
};
