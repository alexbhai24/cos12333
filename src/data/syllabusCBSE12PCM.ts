import { SyllabusData, Subject } from '../types/syllabus';

// CBSE Class 12 PCM | Academic Session 2026-27
// Official Authority: CBSE (cbseacademic.nic.in) & NCERT (ncert.nic.in)

export const cbse12Physics: Subject = {
  id: 'cbse_12_pcm_phy',
  name: 'Physics',
  chapters: [
    {
      id: 'cbse12_phy1',
      title: 'Electric Charges and Fields',
      officialWeightage: 'Unit I & II — 16 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12p1_t1', title: 'Electric charge: Conservation, Coulomb\'s law, Forces between multiple charges' },
        { id: 'c12p1_t2', title: 'Electric field, field lines, electric dipole, dipole in uniform external field' },
        { id: 'c12p1_t3', title: 'Electric flux, Gauss\'s theorem statement and applications: infinite wire, plane sheet, spherical shell' }
      ]
    },
    {
      id: 'cbse12_phy2',
      title: 'Electrostatic Potential and Capacitance',
      officialWeightage: 'Unit I & II — 16 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12p2_t1', title: 'Electric potential, potential difference, equipotential surfaces, potential energy' },
        { id: 'c12p2_t2', title: 'Conductors and dielectrics, electric polarization' },
        { id: 'c12p2_t3', title: 'Capacitors and capacitance, combination in series and parallel, energy stored in capacitor' }
      ]
    },
    {
      id: 'cbse12_phy3',
      title: 'Current Electricity',
      officialWeightage: 'Unit I & II — 16 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12p3_t1', title: 'Electric current, drift velocity, mobility and their relation with electric current' },
        { id: 'c12p3_t2', title: 'Ohm\'s law, V-I characteristics, electrical resistivity and conductivity, temperature dependence' },
        { id: 'c12p3_t3', title: 'Internal resistance of a cell, EMF and potential difference, combination of cells' },
        { id: 'c12p3_t4', title: 'Kirchhoff\'s rules, Wheatstone bridge principle and applications' }
      ]
    },
    {
      id: 'cbse12_phy4',
      title: 'Moving Charges and Magnetism',
      officialWeightage: 'Unit III & IV — 17 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12p4_t1', title: 'Biot-Savart law and its application to circular current loop' },
        { id: 'c12p4_t2', title: 'Ampere\'s circuital law and applications to straight wire and solenoid' },
        { id: 'c12p4_t3', title: 'Force on moving charge in magnetic field, Lorentz force, force between parallel conductors' },
        { id: 'c12p4_t4', title: 'Moving coil galvanometer: current sensitivity and conversion to ammeter/voltmeter' }
      ]
    },
    {
      id: 'cbse12_phy5',
      title: 'Magnetism and Matter',
      officialWeightage: 'Unit III & IV — 17 Marks',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'c12p5_t1', title: 'Bar magnet as equivalent solenoid, magnetic field lines, torque on magnetic dipole' },
        { id: 'c12p5_t2', title: 'Magnetic properties of materials: Diamagnetic, paramagnetic, ferromagnetic substances' }
      ]
    },
    {
      id: 'cbse12_phy6',
      title: 'Electromagnetic Induction',
      officialWeightage: 'Unit III & IV — 17 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12p6_t1', title: 'Magnetic flux, Faraday\'s laws of induction, induced EMF and current' },
        { id: 'c12p6_t2', title: 'Lenz\'s law, Motional EMF' },
        { id: 'c12p6_t3', title: 'Self and mutual inductance' }
      ]
    },
    {
      id: 'cbse12_phy7',
      title: 'Alternating Current',
      officialWeightage: 'Unit III & IV — 17 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12p7_t1', title: 'Alternating currents, peak and RMS values of AC and voltage' },
        { id: 'c12p7_t2', title: 'Reactance and impedance, LCR series circuit, phasor diagrams, resonance' },
        { id: 'c12p7_t3', title: 'Power in AC circuits, wattless current, AC generator and transformer' }
      ]
    },
    {
      id: 'cbse12_phy8',
      title: 'Electromagnetic Waves',
      officialWeightage: 'Unit V & VI — 18 Marks',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'c12p8_t1', title: 'Displacement current, basic idea and characteristics of EM waves' },
        { id: 'c12p8_t2', title: 'Electromagnetic spectrum (radio, micro, IR, visible, UV, X-rays, gamma) and uses' }
      ]
    },
    {
      id: 'cbse12_phy9',
      title: 'Ray Optics and Optical Instruments',
      officialWeightage: 'Unit V & VI — 18 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12p9_t1', title: 'Refraction of light, total internal reflection and optical fibres' },
        { id: 'c12p9_t2', title: 'Refraction at spherical surfaces, lens maker\'s formula, magnification, power of a lens' },
        { id: 'c12p9_t3', title: 'Refraction through a prism, dispersion' },
        { id: 'c12p9_t4', title: 'Microscopes and astronomical telescopes (reflecting and refracting) and magnifying powers' }
      ]
    },
    {
      id: 'cbse12_phy10',
      title: 'Wave Optics',
      officialWeightage: 'Unit V & VI — 18 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12p10_t1', title: 'Wavefront and Huygens\' principle, reflection and refraction of plane waves' },
        { id: 'c12p10_t2', title: 'Interference of light, Young\'s double slit experiment, expression for fringe width' },
        { id: 'c12p10_t3', title: 'Diffraction due to a single slit, width of central maximum' }
      ]
    },
    {
      id: 'cbse12_phy11',
      title: 'Dual Nature of Radiation and Matter',
      officialWeightage: 'Unit VII & VIII — 12 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12p11_t1', title: 'Photoelectric effect, Hertz and Lenard\'s observations, Einstein\'s photoelectric equation' },
        { id: 'c12p11_t2', title: 'Matter waves: wave nature of particles, de Broglie relation' }
      ]
    },
    {
      id: 'cbse12_phy12',
      title: 'Atoms',
      officialWeightage: 'Unit VII & VIII — 12 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12p12_t1', title: 'Alpha-particle scattering experiment, Rutherford\'s model of atom' },
        { id: 'c12p12_t2', title: 'Bohr model of hydrogen atom, energy levels, hydrogen line spectrum' }
      ]
    },
    {
      id: 'cbse12_phy13',
      title: 'Nuclei',
      officialWeightage: 'Unit VII & VIII — 12 Marks',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'c12p13_t1', title: 'Composition and size of nucleus, nuclear force' },
        { id: 'c12p13_t2', title: 'Mass-energy relation, mass defect, binding energy per nucleon and its variation with mass number' },
        { id: 'c12p13_t3', title: 'Nuclear fission and nuclear fusion' }
      ]
    },
    {
      id: 'cbse12_phy14',
      title: 'Semiconductor Electronics: Materials, Devices and Simple Circuits',
      officialWeightage: 'Unit IX — 7 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12p14_t1', title: 'Energy bands in conductors, semiconductors and insulators' },
        { id: 'c12p14_t2', title: 'Intrinsic and extrinsic semiconductors (p-type and n-type)' },
        { id: 'c12p14_t3', title: 'p-n junction diode: I-V characteristics in forward and reverse bias, application as a rectifier (half wave and full wave)' }
      ]
    }
  ]
};

export const cbse12Chemistry: Subject = {
  id: 'cbse_12_pcm_chem',
  name: 'Chemistry',
  chapters: [
    {
      id: 'cbse12_chem1',
      title: 'Solutions',
      officialWeightage: '7 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12c1_t1', title: 'Types of solutions, expression of concentration of solutions of solids in liquids' },
        { id: 'c12c1_t2', title: 'Solubility of gases in liquids (Henry\'s law), solid solutions' },
        { id: 'c12c1_t3', title: 'Raoult\'s law, ideal and non-ideal solutions, colligative properties: relative lowering of vapour pressure, elevation of boiling point, depression of freezing point, osmotic pressure' },
        { id: 'c12c1_t4', title: 'Abnormal molecular mass and van \'t Hoff factor' }
      ]
    },
    {
      id: 'cbse12_chem2',
      title: 'Electrochemistry',
      officialWeightage: '9 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12c2_t1', title: 'Redox reactions, EMF of a cell, standard electrode potential, Nernst equation and application to chemical cells' },
        { id: 'c12c2_t2', title: 'Relation between Gibbs energy change and EMF of a cell' },
        { id: 'c12c2_t3', title: 'Conductance in electrolytic solutions, specific and molar conductivity, variations with concentration' },
        { id: 'c12c2_t4', title: 'Kohlrausch\'s Law, electrolysis and laws of electrolysis, dry cell, lead accumulator, fuel cells, corrosion' }
      ]
    },
    {
      id: 'cbse12_chem3',
      title: 'Chemical Kinetics',
      officialWeightage: '7 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12c3_t1', title: 'Rate of reaction, factors affecting rates: concentration, temperature, catalyst' },
        { id: 'c12c3_t2', title: 'Order and molecularity of a reaction, rate law and specific rate constant' },
        { id: 'c12c3_t3', title: 'Integrated rate equations and half-life (zero and first order reactions only)' },
        { id: 'c12c3_t4', title: 'Concept of collision theory, activation energy, Arrhenius equation' }
      ]
    },
    {
      id: 'cbse12_chem4',
      title: 'd and f Block Elements',
      officialWeightage: '7 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12c4_t1', title: 'General introduction, electronic configuration, occurrence, characteristics of transition metals' },
        { id: 'c12c4_t2', title: 'Trends in properties: metallic character, ionization enthalpy, oxidation states, ionic radii, colour, catalytic property, magnetic properties, interstitial compounds, alloy formation' },
        { id: 'c12c4_t3', title: 'Preparation and properties of K2Cr2O7 and KMnO4' },
        { id: 'c12c4_t4', title: 'Lanthanoids: Electronic configuration, oxidation states, chemical reactivity, lanthanoid contraction; Actinoids comparison' }
      ]
    },
    {
      id: 'cbse12_chem5',
      title: 'Coordination Compounds',
      officialWeightage: '7 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12c5_t1', title: 'Coordination compounds: introduction, ligands, coordination number, colour, magnetic properties and shapes' },
        { id: 'c12c5_t2', title: 'IUPAC nomenclature of mononuclear coordination compounds' },
        { id: 'c12c5_t3', title: 'Isomerism (structural and stereo)' },
        { id: 'c12c5_t4', title: 'Bonding: Werner\'s theory, Valence Bond Theory (VBT), Crystal Field Theory (CFT)' }
      ]
    },
    {
      id: 'cbse12_chem6',
      title: 'Haloalkanes and Haloarenes',
      officialWeightage: '6 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12c6_t1', title: 'Nomenclature, nature of C-X bond, physical and chemical properties' },
        { id: 'c12c6_t2', title: 'Optical rotation and mechanism of substitution reactions: SN1 and SN2' },
        { id: 'c12c6_t3', title: 'Nature of C-X bond in haloarenes, electrophilic substitution reactions' },
        { id: 'c12c6_t4', title: 'Polyhalogen compounds: uses and environmental effects of dichloromethane, chloroform, iodoform, freons, DDT' }
      ]
    },
    {
      id: 'cbse12_chem7',
      title: 'Alcohols, Phenols and Ethers',
      officialWeightage: '6 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12c7_t1', title: 'Alcohols: Nomenclature, methods of preparation, physical and chemical properties, identification of primary, secondary and tertiary alcohols, mechanism of dehydration' },
        { id: 'c12c7_t2', title: 'Phenols: Nomenclature, methods of preparation, physical and chemical properties, acidic nature, electrophilic substitution, Kolbe\'s and Reimer-Tiemann reactions' },
        { id: 'c12c7_t3', title: 'Ethers: Nomenclature, methods of preparation, physical and chemical properties, Williamson synthesis' }
      ]
    },
    {
      id: 'cbse12_chem8',
      title: 'Aldehydes, Ketones and Carboxylic Acids',
      officialWeightage: '8 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12c8_t1', title: 'Aldehydes and Ketones: Nomenclature, nature of carbonyl group, methods of preparation, physical and chemical properties' },
        { id: 'c12c8_t2', title: 'Nucleophilic addition reactions, alpha-hydrogen reactivity, Aldol condensation, Cannizzaro reaction' },
        { id: 'c12c8_t3', title: 'Carboxylic Acids: Nomenclature, acidic nature, methods of preparation, physical and chemical properties, Hell-Volhard-Zelinsky (HVZ) reaction' }
      ]
    },
    {
      id: 'cbse12_chem9',
      title: 'Amines',
      officialWeightage: '6 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12c9_t1', title: 'Amines: Nomenclature, classification, structure, methods of preparation (Gabriel phthalimide, Hoffmann bromamide)' },
        { id: 'c12c9_t2', title: 'Physical and chemical properties, basic character of amines, identification of 1°, 2°, and 3° amines (Hinsberg test)' },
        { id: 'c12c9_t3', title: 'Diazonium salts: Preparation, chemical reactions and importance in synthetic organic chemistry' }
      ]
    },
    {
      id: 'cbse12_chem10',
      title: 'Biomolecules',
      officialWeightage: '7 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12c10_t1', title: 'Carbohydrates: Classification (aldoses and ketoses), monosaccharides (glucose and fructose), D-L configuration, oligosaccharides, polysaccharides (starch, cellulose, glycogen)' },
        { id: 'c12c10_t2', title: 'Proteins: Elementary idea of amino acids, peptide bond, polypeptides, proteins (primary, secondary, tertiary and quaternary structures), denaturation of proteins' },
        { id: 'c12c10_t3', title: 'Nucleic Acids: DNA and RNA, chemical composition, double helical structure' },
        { id: 'c12c10_t4', title: 'Vitamins: Classification and deficiency diseases' }
      ]
    }
  ]
};

export const cbse12Math: Subject = {
  id: 'cbse_12_pcm_math',
  name: 'Mathematics',
  chapters: [
    {
      id: 'cbse12_m1',
      title: 'Relations and Functions',
      officialWeightage: 'Unit I — 8 Marks (with Ch 2)',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'c12m1_t1', title: 'Types of relations: Reflexive, symmetric, transitive and equivalence relations' },
        { id: 'c12m1_t2', title: 'One to one (injective) and onto (surjective) functions' }
      ]
    },
    {
      id: 'cbse12_m2',
      title: 'Inverse Trigonometric Functions',
      officialWeightage: 'Unit I — 8 Marks (with Ch 1)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m2_t1', title: 'Definition, range, domain, principal value branch' },
        { id: 'c12m2_t2', title: 'Graphs of inverse trigonometric functions and basic properties' }
      ]
    },
    {
      id: 'cbse12_m3',
      title: 'Matrices',
      officialWeightage: 'Unit II — 10 Marks (with Ch 4)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m3_t1', title: 'Concept, notation, order, equality, types of matrices, zero and identity matrix' },
        { id: 'c12m3_t2', title: 'Operations: addition, scalar multiplication and multiplication of matrices' },
        { id: 'c12m3_t3', title: 'Transpose of a matrix, symmetric and skew symmetric matrices, invertible matrices' }
      ]
    },
    {
      id: 'cbse12_m4',
      title: 'Determinants',
      officialWeightage: 'Unit II — 10 Marks (with Ch 3)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m4_t1', title: 'Determinant of a square matrix (up to 3 × 3), minors, cofactors and applications in finding area of triangle' },
        { id: 'c12m4_t2', title: 'Adjoint and inverse of a square matrix' },
        { id: 'c12m4_t3', title: 'Solving system of linear equations in two or three variables using inverse of a matrix' }
      ]
    },
    {
      id: 'cbse12_m5',
      title: 'Continuity and Differentiability',
      officialWeightage: 'Unit III — 35 Marks (Calculus)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m5_t1', title: 'Continuity and differentiability, derivative of composite functions, chain rule' },
        { id: 'c12m5_t2', title: 'Derivative of inverse trigonometric functions, implicit functions, exponential and logarithmic functions' },
        { id: 'c12m5_t3', title: 'Logarithmic differentiation, derivative of functions expressed in parametric forms' },
        { id: 'c12m5_t4', title: 'Second order derivatives' }
      ]
    },
    {
      id: 'cbse12_m6',
      title: 'Applications of Derivatives',
      officialWeightage: 'Unit III — 35 Marks (Calculus)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m6_t1', title: 'Rate of change of quantities' },
        { id: 'c12m6_t2', title: 'Increasing and decreasing functions' },
        { id: 'c12m6_t3', title: 'Maxima and minima (first derivative test and second derivative test, word problems)' }
      ]
    },
    {
      id: 'cbse12_m7',
      title: 'Integrals',
      officialWeightage: 'Unit III — 35 Marks (Calculus)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m7_t1', title: 'Integration as inverse process of differentiation, integration of variety of functions' },
        { id: 'c12m7_t2', title: 'Methods of integration: substitution, partial fractions and by parts' },
        { id: 'c12m7_t3', title: 'Fundamental Theorem of Calculus, basic properties of definite integrals and evaluation' }
      ]
    },
    {
      id: 'cbse12_m8',
      title: 'Applications of the Integrals',
      officialWeightage: 'Unit III — 35 Marks (Calculus)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m8_t1', title: 'Applications in finding the area under simple curves, lines, circles, parabolas, ellipses' }
      ]
    },
    {
      id: 'cbse12_m9',
      title: 'Differential Equations',
      officialWeightage: 'Unit III — 35 Marks (Calculus)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m9_t1', title: 'Definition, order and degree, general and particular solutions of a differential equation' },
        { id: 'c12m9_t2', title: 'Solution by method of separation of variables' },
        { id: 'c12m9_t3', title: 'Homogeneous differential equations of first order and first degree' },
        { id: 'c12m9_t4', title: 'Solutions of linear differential equation of the type: dy/dx + py = q' }
      ]
    },
    {
      id: 'cbse12_m10',
      title: 'Vectors',
      officialWeightage: 'Unit IV — 14 Marks (with Ch 11)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m10_t1', title: 'Vectors and scalars, magnitude and direction of a vector, direction cosines and ratios' },
        { id: 'c12m10_t2', title: 'Types of vectors, position vector, negative, components of a vector, addition and multiplication by scalar' },
        { id: 'c12m10_t3', title: 'Scalar (dot) product of vectors, projection of a vector on a line, vector (cross) product of vectors' }
      ]
    },
    {
      id: 'cbse12_m11',
      title: 'Three-Dimensional Geometry',
      officialWeightage: 'Unit IV — 14 Marks (with Ch 10)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m11_t1', title: 'Direction cosines and direction ratios of a line joining two points' },
        { id: 'c12m11_t2', title: 'Cartesian equation and vector equation of a line' },
        { id: 'c12m11_t3', title: 'Skew lines, shortest distance between two lines' }
      ]
    },
    {
      id: 'cbse12_m12',
      title: 'Linear Programming',
      officialWeightage: 'Unit V — 5 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m12_t1', title: 'Introduction, related terminology: constraints, objective function, optimization' },
        { id: 'c12m12_t2', title: 'Graphical method of solution for problems in two variables, feasible and infeasible regions, bounded and unbounded feasible regions' }
      ]
    },
    {
      id: 'cbse12_m13',
      title: 'Probability',
      officialWeightage: 'Unit VI — 8 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12m13_t1', title: 'Conditional probability, multiplication rule on probability, independent events' },
        { id: 'c12m13_t2', title: 'Total probability, Bayes\' theorem' }
      ]
    }
  ]
};

export const cbse12English: Subject = {
  id: 'cbse_12_pcm_eng',
  name: 'English Core',
  chapters: [
    {
      id: 'cbse12_e1',
      title: 'Section A — Reading Skills',
      officialWeightage: '22 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12e1_t1', title: 'Unseen Passage (Factual, descriptive or literary) — 12 Marks' },
        { id: 'c12e1_t2', title: 'Case-based factual passage with visual input/charts — 10 Marks' }
      ]
    },
    {
      id: 'cbse12_e2',
      title: 'Section B — Creative Writing Skills',
      officialWeightage: '18 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12e2_t1', title: 'Notice Writing (up to 50 words) — 4 Marks' },
        { id: 'c12e2_t2', title: 'Formal and Informal Invitations and Replies (up to 50 words) — 4 Marks' },
        { id: 'c12e2_t3', title: 'Letters based on verbal/visual input: Application for a job, Letter to the Editor — 5 Marks' },
        { id: 'c12e2_t4', title: 'Article / Report Writing (descriptive and analytical, 120–150 words) — 5 Marks' }
      ]
    },
    {
      id: 'cbse12_e3',
      title: 'Section C — Flamingo: Prose',
      officialWeightage: 'Literature (40 Marks Total)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12e3_t1', title: 'The Last Lesson — Alphonse Daudet' },
        { id: 'c12e3_t2', title: 'Lost Spring — Anees Jung' },
        { id: 'c12e3_t3', title: 'Deep Water — William Douglas' },
        { id: 'c12e3_t4', title: 'The Rattrap — Selma Lagerlöf' },
        { id: 'c12e3_t5', title: 'Indigo — Louis Fischer' },
        { id: 'c12e3_t6', title: 'Poets and Pancakes — Asokamitran' },
        { id: 'c12e3_t7', title: 'The Interview — Christopher Silvester' },
        { id: 'c12e3_t8', title: 'Going Places — A.R. Barton' }
      ]
    },
    {
      id: 'cbse12_e4',
      title: 'Section C — Flamingo: Poetry',
      officialWeightage: 'Literature (40 Marks Total)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12e4_t1', title: 'My Mother at Sixty-Six — Kamala Das' },
        { id: 'c12e4_t2', title: 'Keeping Quiet — Pablo Neruda' },
        { id: 'c12e4_t3', title: 'A Thing of Beauty — John Keats' },
        { id: 'c12e4_t4', title: 'A Roadside Stand — Robert Frost' },
        { id: 'c12e4_t5', title: 'Aunt Jennifer\'s Tigers — Adrienne Rich' }
      ]
    },
    {
      id: 'cbse12_e5',
      title: 'Section C — Vistas: Supplementary Reader',
      officialWeightage: 'Literature (40 Marks Total)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12e5_t1', title: 'The Third Level — Jack Finney' },
        { id: 'c12e5_t2', title: 'The Tiger King — Kalki' },
        { id: 'c12e5_t3', title: 'Journey to the End of the Earth — Tishani Doshi' },
        { id: 'c12e5_t4', title: 'The Enemy — Pearl S. Buck' },
        { id: 'c12e5_t5', title: 'On the Face of It — Susan Hill' },
        { id: 'c12e5_t6', title: 'Memories of Childhood: The Cutting of My Long Hair & We Too are Human Beings' }
      ]
    }
  ]
};

export const syllabusCBSE12PCM: SyllabusData = {
  id: 'cbse_12_pcm',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 12',
  stream: 'PCM',
  academicSession: '2026-2027',
  sourceUrl: 'https://cbseacademic.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    cbse12Physics,
    cbse12Chemistry,
    cbse12Math,
    cbse12English
  ]
};
