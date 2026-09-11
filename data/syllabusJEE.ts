import { SyllabusData } from '../types/syllabus';

// JEE MAIN 2026 — LATEST OFFICIAL NTA SYLLABUS
// Source: jeemain.nta.ac.in
// Session: 2026 (2027 JEE Main syllabus not yet officially released as of Sept 2026)
// Status: LATEST OFFICIAL — 2027 NOT YET PUBLISHED
// Paper Pattern: 90 Questions | 300 Marks
// Physics: 30Q (25 MCQ + 5 Numerical) = 100 Marks
// Chemistry: 30Q (25 MCQ + 5 Numerical) = 100 Marks
// Mathematics: 30Q (25 MCQ + 5 Numerical) = 100 Marks
// Marking: +4 correct, -1 wrong (MCQ); +4 correct, 0 wrong (Numerical)

export const syllabusJEE: SyllabusData = {
  id: 'jee',
  examOrBoard: 'JEE',
  category: 'Special',
  academicSession: '2026-2027',
  sourceUrl: 'https://jeemain.nta.ac.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'jee_physics',
      name: 'Physics',
      chapters: [
        // ═══ UNIT 1: PHYSICS AND MEASUREMENT ═══
        {
          id: 'jp1', title: 'Physics and Measurement',
          officialWeightage: 'Part of Mechanics Unit | weightage_type: PYQ_TREND | ~1 question',
          pyqPriority: 'LOW',
          topics: [
            { id: 'jp1t1', title: 'Units and dimensions; dimensional analysis' },
            { id: 'jp1t2', title: 'Least count; accuracy and precision of instruments' },
            { id: 'jp1t3', title: 'Significant figures and rounding off' },
            { id: 'jp1t4', title: 'Errors in measurement: absolute, relative, percentage' },
            { id: 'jp1t5', title: 'Applications of dimensional analysis' }
          ]
        },
        // ═══ UNIT 2: KINEMATICS ═══
        {
          id: 'jp2', title: 'Kinematics',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'jp2t1', title: 'Frame of reference; motion in a straight line' },
            { id: 'jp2t2', title: 'Speed, velocity, acceleration — uniform and non-uniform' },
            { id: 'jp2t3', title: 'Equations of uniformly accelerated motion' },
            { id: 'jp2t4', title: 'Scalars and vectors; vector addition, multiplication' },
            { id: 'jp2t5', title: 'Relative velocity' },
            { id: 'jp2t6', title: 'Motion in a plane: projectile motion' },
            { id: 'jp2t7', title: 'Uniform circular motion' }
          ]
        },
        // ═══ UNIT 3: LAWS OF MOTION ═══
        {
          id: 'jp3', title: 'Laws of Motion',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp3t1', title: 'Newton\'s three laws of motion' },
            { id: 'jp3t2', title: 'Conservation of linear momentum' },
            { id: 'jp3t3', title: 'Concurrent forces; equilibrium of rigid body' },
            { id: 'jp3t4', title: 'Friction: static, kinetic; laws of friction' },
            { id: 'jp3t5', title: 'Dynamics of circular motion: banking, conical pendulum' }
          ]
        },
        // ═══ UNIT 4: WORK, ENERGY, POWER ═══
        {
          id: 'jp4', title: 'Work, Energy and Power',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp4t1', title: 'Work done by constant and variable forces (work-energy theorem)' },
            { id: 'jp4t2', title: 'Kinetic and potential energy' },
            { id: 'jp4t3', title: 'Conservation of mechanical energy' },
            { id: 'jp4t4', title: 'Spring potential energy; elastic PE' },
            { id: 'jp4t5', title: 'Power: average and instantaneous' },
            { id: 'jp4t6', title: 'Elastic and inelastic collisions in 1D and 2D' }
          ]
        },
        // ═══ UNIT 5: ROTATIONAL MOTION ═══
        {
          id: 'jp5', title: 'Rotational Motion',
          officialWeightage: 'PYQ_TREND | ~2-3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp5t1', title: 'Centre of mass of a system of particles; motion of COM' },
            { id: 'jp5t2', title: 'Moment of inertia; theorems of parallel and perpendicular axes' },
            { id: 'jp5t3', title: 'MI of rod, ring, disc, hollow sphere, solid sphere, cylinder' },
            { id: 'jp5t4', title: 'Torque; angular momentum; conservation of angular momentum' },
            { id: 'jp5t5', title: 'Rolling motion (pure rolling): ring, disc, sphere on inclined plane' },
            { id: 'jp5t6', title: 'Couple and equilibrium conditions' }
          ]
        },
        // ═══ UNIT 6: GRAVITATION ═══
        {
          id: 'jp6', title: 'Gravitation',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'jp6t1', title: 'Law of universal gravitation; gravitational constant G' },
            { id: 'jp6t2', title: 'Variation of g: altitude, depth, latitude, rotation' },
            { id: 'jp6t3', title: 'Kepler\'s laws; orbital velocity; escape velocity' },
            { id: 'jp6t4', title: 'Geostationary satellites' },
            { id: 'jp6t5', title: 'Gravitational potential energy; field intensity' }
          ]
        },
        // ═══ UNIT 7: PROPERTIES OF SOLIDS & FLUIDS ═══
        {
          id: 'jp7', title: 'Properties of Solids and Fluids',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp7t1', title: 'Elastic behaviour: stress, strain; Hooke\'s law' },
            { id: 'jp7t2', title: 'Young\'s modulus, bulk modulus, shear modulus; Poisson\'s ratio' },
            { id: 'jp7t3', title: 'Pressure in fluids; Pascal\'s law and its applications' },
            { id: 'jp7t4', title: 'Buoyancy; Archimedes\' principle' },
            { id: 'jp7t5', title: 'Bernoulli\'s equation; applications (Venturimeter, pitot tube)' },
            { id: 'jp7t6', title: 'Viscosity; Stokes\' law; terminal velocity; Reynold\'s number' },
            { id: 'jp7t7', title: 'Surface tension; surface energy; capillary rise' },
            { id: 'jp7t8', title: 'Thermal expansion; heat transfer: conduction, convection, radiation' }
          ]
        },
        // ═══ UNIT 8: THERMODYNAMICS ═══
        {
          id: 'jp8', title: 'Thermodynamics',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp8t1', title: 'Thermal equilibrium; Zeroth law of thermodynamics' },
            { id: 'jp8t2', title: 'Heat, work and internal energy; First law' },
            { id: 'jp8t3', title: 'Isothermal, adiabatic, isochoric, isobaric processes; γ ratio' },
            { id: 'jp8t4', title: 'Reversible and irreversible processes; Second law' },
            { id: 'jp8t5', title: 'Carnot engine: efficiency; COP of refrigerator' }
          ]
        },
        // ═══ UNIT 9: KINETIC THEORY ═══
        {
          id: 'jp9', title: 'Kinetic Theory of Gases',
          officialWeightage: 'PYQ_TREND | ~1 question',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'jp9t1', title: 'Equation of state for ideal gas; kinetic interpretation of temperature' },
            { id: 'jp9t2', title: 'RMS speed, mean speed, most probable speed' },
            { id: 'jp9t3', title: 'Mean free path; degrees of freedom; equipartition of energy' },
            { id: 'jp9t4', title: 'Specific heats Cp, Cv; ratio γ for monoatomic, diatomic, polyatomic' }
          ]
        },
        // ═══ UNIT 10: OSCILLATIONS ═══
        {
          id: 'jp10', title: 'Oscillations and Waves',
          officialWeightage: 'PYQ_TREND | ~2-3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp10t1', title: 'Simple harmonic motion: equation, energy, phase' },
            { id: 'jp10t2', title: 'Spring-mass system; simple pendulum; compound pendulum' },
            { id: 'jp10t3', title: 'Damped and forced oscillations; resonance' },
            { id: 'jp10t4', title: 'Wave motion: longitudinal and transverse' },
            { id: 'jp10t5', title: 'Speed of wave; superposition; standing waves' },
            { id: 'jp10t6', title: 'Beats; Doppler effect in sound' }
          ]
        },
        // ═══ UNIT 11: ELECTROSTATICS ═══
        {
          id: 'jp11', title: 'Electrostatics',
          officialWeightage: 'PYQ_TREND | ~3-4 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp11t1', title: 'Electric charge: conservation, quantisation' },
            { id: 'jp11t2', title: 'Coulomb\'s law; superposition; continuous charge distributions' },
            { id: 'jp11t3', title: 'Electric field: dipole field, ring, disc, infinite sheet' },
            { id: 'jp11t4', title: 'Gauss\'s law and applications: sphere, cylinder, plane' },
            { id: 'jp11t5', title: 'Electric potential: work-potential relation; equipotential surfaces' },
            { id: 'jp11t6', title: 'Potential of dipole, ring, sphere' },
            { id: 'jp11t7', title: 'Conductors in electrostatic equilibrium; induction' },
            { id: 'jp11t8', title: 'Capacitance: parallel plate, spherical, cylindrical' },
            { id: 'jp11t9', title: 'Series and parallel combination; dielectrics; energy stored' }
          ]
        },
        // ═══ UNIT 12: CURRENT ELECTRICITY ═══
        {
          id: 'jp12', title: 'Current Electricity',
          officialWeightage: 'PYQ_TREND | ~3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp12t1', title: 'Electric current; drift velocity; current density; Ohm\'s law' },
            { id: 'jp12t2', title: 'Resistance: temperature dependence; resistivity of conductors and semiconductors' },
            { id: 'jp12t3', title: 'EMF; terminal voltage; internal resistance' },
            { id: 'jp12t4', title: 'Series and parallel combination of cells' },
            { id: 'jp12t5', title: 'Kirchhoff\'s laws (KVL, KCL); Wheatstone bridge' },
            { id: 'jp12t6', title: 'Meter bridge; potentiometer: principle and applications' },
            { id: 'jp12t7', title: 'Joule\'s law; power dissipation' }
          ]
        },
        // ═══ UNIT 13: MAGNETIC EFFECTS ═══
        {
          id: 'jp13', title: 'Magnetic Effects of Current & Magnetism',
          officialWeightage: 'PYQ_TREND | ~2-3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp13t1', title: 'Biot-Savart law; field due to straight wire, circular loop, arc' },
            { id: 'jp13t2', title: 'Ampere\'s circuital law; solenoid; toroid' },
            { id: 'jp13t3', title: 'Force on moving charge in magnetic field: Lorentz force' },
            { id: 'jp13t4', title: 'Force between parallel conductors; definition of ampere' },
            { id: 'jp13t5', title: 'Torque on current loop; galvanometer; ammeter; voltmeter' },
            { id: 'jp13t6', title: 'Cyclotron: working and frequency' },
            { id: 'jp13t7', title: 'Bar magnet as dipole; Earth\'s magnetism; magnetic field lines' },
            { id: 'jp13t8', title: 'Para, dia, ferromagnetism; hysteresis; permeability' }
          ]
        },
        // ═══ UNIT 14: EMI & AC ═══
        {
          id: 'jp14', title: 'Electromagnetic Induction & Alternating Currents',
          officialWeightage: 'PYQ_TREND | ~3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp14t1', title: 'Magnetic flux; Faraday\'s laws; Lenz\'s law' },
            { id: 'jp14t2', title: 'Motional EMF; eddy currents' },
            { id: 'jp14t3', title: 'Self-induction (L); mutual induction (M); energy stored in inductor' },
            { id: 'jp14t4', title: 'AC generator; alternator' },
            { id: 'jp14t5', title: 'Peak, RMS values; phasors; impedance' },
            { id: 'jp14t6', title: 'LR, CR, LC, LCR circuits; resonance; Q factor' },
            { id: 'jp14t7', title: 'Power in AC circuits; power factor; wattless current' },
            { id: 'jp14t8', title: 'Transformer: step-up and step-down; efficiency' }
          ]
        },
        // ═══ UNIT 15: ELECTROMAGNETIC WAVES ═══
        {
          id: 'jp15', title: 'Electromagnetic Waves',
          officialWeightage: 'PYQ_TREND | ~1 question',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'jp15t1', title: 'Maxwell\'s equations (conceptual); displacement current' },
            { id: 'jp15t2', title: 'Electromagnetic spectrum: gamma, X-ray, UV, visible, IR, microwave, radio' },
            { id: 'jp15t3', title: 'Properties of EM waves; speed of light in vacuum' }
          ]
        },
        // ═══ UNIT 16: OPTICS ═══
        {
          id: 'jp16', title: 'Optics',
          officialWeightage: 'PYQ_TREND | ~3-4 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp16t1', title: 'Reflection by plane and spherical mirrors; mirror formula' },
            { id: 'jp16t2', title: 'Refraction at plane surface; Snell\'s law; TIR and critical angle' },
            { id: 'jp16t3', title: 'Refraction at spherical surface; lens maker\'s equation; lens formula' },
            { id: 'jp16t4', title: 'Power of lens; combination of lenses in contact' },
            { id: 'jp16t5', title: 'Prism: deviation and dispersion; angular dispersion; dispersive power' },
            { id: 'jp16t6', title: 'Optical instruments: microscope, telescope (reflecting and refracting)' },
            { id: 'jp16t7', title: 'Wave optics: Huygens\' principle; reflection and refraction using waves' },
            { id: 'jp16t8', title: 'Young\'s double slit experiment; fringe width; coherence' },
            { id: 'jp16t9', title: 'Single slit diffraction: central maximum, secondary maxima' },
            { id: 'jp16t10', title: 'Resolving power of optical instruments' },
            { id: 'jp16t11', title: 'Polarisation: Brewster\'s law; Malus\'s law; uses of polarised light' }
          ]
        },
        // ═══ UNIT 17: DUAL NATURE ═══
        {
          id: 'jp17', title: 'Dual Nature of Matter and Radiation',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp17t1', title: 'Photoelectric effect; Einstein\'s photoelectric equation' },
            { id: 'jp17t2', title: 'Work function; threshold frequency; stopping potential' },
            { id: 'jp17t3', title: 'de Broglie hypothesis; matter waves; wavelength formula' },
            { id: 'jp17t4', title: 'Davisson-Germer experiment' }
          ]
        },
        // ═══ UNIT 18: ATOMS & NUCLEI ═══
        {
          id: 'jp18', title: 'Atoms and Nuclei',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp18t1', title: 'Alpha-particle scattering; Rutherford\'s nuclear model' },
            { id: 'jp18t2', title: 'Bohr\'s model of hydrogen atom; energy levels; spectra' },
            { id: 'jp18t3', title: 'Composition of nucleus; mass defect; binding energy' },
            { id: 'jp18t4', title: 'BE per nucleon curve; nuclear fission; fusion' },
            { id: 'jp18t5', title: 'Radioactivity: α, β, γ decay; Q value; half-life; decay constant' }
          ]
        },
        // ═══ UNIT 19: ELECTRONIC DEVICES ═══
        {
          id: 'jp19', title: 'Electronic Devices',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jp19t1', title: 'Energy bands in solids: conductors, semiconductors, insulators' },
            { id: 'jp19t2', title: 'Intrinsic and extrinsic semiconductors (p-type, n-type)' },
            { id: 'jp19t3', title: 'p-n junction diode: characteristics, forward and reverse bias' },
            { id: 'jp19t4', title: 'Zener diode: voltage regulation' },
            { id: 'jp19t5', title: 'Rectifiers: half-wave and full-wave; filter circuits' },
            { id: 'jp19t6', title: 'Transistor (NPN, PNP): CE configuration; characteristics; amplifier' },
            { id: 'jp19t7', title: 'Logic gates: AND, OR, NOT, NAND, NOR; Boolean algebra' }
          ]
        },
        // ═══ UNIT 20: COMMUNICATION SYSTEMS ═══
        {
          id: 'jp20', title: 'Communication Systems',
          officialWeightage: 'PYQ_TREND | ~1 question',
          pyqPriority: 'LOW',
          topics: [
            { id: 'jp20t1', title: 'Elements of a communication system: transmitter, channel, receiver' },
            { id: 'jp20t2', title: 'Bandwidth of signals; bandwidth of transmission medium' },
            { id: 'jp20t3', title: 'Propagation of EM waves: ground, sky, space wave' },
            { id: 'jp20t4', title: 'Modulation: AM, FM; detection' }
          ]
        }
      ]
    },
    {
      id: 'jee_chemistry',
      name: 'Chemistry',
      chapters: [
        // ═══ PHYSICAL CHEMISTRY ═══
        {
          id: 'jc1', title: 'Some Basic Concepts in Chemistry',
          officialWeightage: 'PYQ_TREND | ~1 question',
          pyqPriority: 'LOW',
          topics: [
            { id: 'jc1t1', title: 'Laws of chemical combination; Dalton\'s atomic theory' },
            { id: 'jc1t2', title: 'Mole concept; Avogadro\'s number; molar mass' },
            { id: 'jc1t3', title: 'Stoichiometry; limiting reagent; percentage yield' },
            { id: 'jc1t4', title: 'Concentration terms: molarity, molality, mole fraction, normality' }
          ]
        },
        {
          id: 'jc2', title: 'Atomic Structure',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc2t1', title: 'Bohr\'s model; hydrogen spectrum; Rydberg formula' },
            { id: 'jc2t2', title: 'de Broglie relation; Heisenberg uncertainty principle' },
            { id: 'jc2t3', title: 'Quantum numbers: n, l, m, s; shapes of orbitals' },
            { id: 'jc2t4', title: 'Electronic configuration: Aufbau, Hund\'s, Pauli rules' }
          ]
        },
        {
          id: 'jc3', title: 'Chemical Bonding & Molecular Structure',
          officialWeightage: 'PYQ_TREND | ~2-3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc3t1', title: 'Ionic bonding: lattice energy; Born-Haber cycle' },
            { id: 'jc3t2', title: 'Covalent bonding: Lewis structures; formal charge; resonance' },
            { id: 'jc3t3', title: 'VSEPR theory: molecular geometry and bond angles' },
            { id: 'jc3t4', title: 'VBT: hybridisation (sp, sp2, sp3, sp3d, sp3d2, sp3d3)' },
            { id: 'jc3t5', title: 'MOT: bonding/antibonding MOs; bond order; magnetic properties' },
            { id: 'jc3t6', title: 'Hydrogen bonding; dipole moment; polarity' }
          ]
        },
        {
          id: 'jc4', title: 'Chemical Thermodynamics',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc4t1', title: 'System, surroundings; state functions; path functions' },
            { id: 'jc4t2', title: 'First law: ΔU = q + w; enthalpy H = U + PV' },
            { id: 'jc4t3', title: 'Standard enthalpies: formation, combustion, neutralisation, atomisation' },
            { id: 'jc4t4', title: 'Hess\'s law; bond dissociation enthalpy' },
            { id: 'jc4t5', title: 'Second law: entropy; Gibbs free energy; spontaneity conditions' },
            { id: 'jc4t6', title: 'ΔG = ΔH - TΔS; ΔG° = -RT ln K' }
          ]
        },
        {
          id: 'jc5', title: 'Solutions',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc5t1', title: 'Types of solutions; solubility; Henry\'s law' },
            { id: 'jc5t2', title: 'Raoult\'s law; ideal and non-ideal solutions' },
            { id: 'jc5t3', title: 'Colligative properties: relative lowering of VP; osmotic pressure' },
            { id: 'jc5t4', title: 'Elevation of BP and depression of FP; van\'t Hoff factor' }
          ]
        },
        {
          id: 'jc6', title: 'Equilibrium',
          officialWeightage: 'PYQ_TREND | ~2-3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc6t1', title: 'Dynamic equilibrium; law of mass action; Kc and Kp' },
            { id: 'jc6t2', title: 'Relationship between Kc, Kp and Kn' },
            { id: 'jc6t3', title: 'Le Chatelier\'s principle; effect of T, P, concentration' },
            { id: 'jc6t4', title: 'Ionic equilibrium; degree of dissociation; Ostwald\'s law' },
            { id: 'jc6t5', title: 'pH; buffer solutions; Henderson-Hasselbalch' },
            { id: 'jc6t6', title: 'Hydrolysis of salts; solubility product Ksp; common ion effect' }
          ]
        },
        {
          id: 'jc7', title: 'Redox Reactions & Electrochemistry',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc7t1', title: 'Oxidation number; balancing redox (ion-electron method)' },
            { id: 'jc7t2', title: 'Electrochemical cells: galvanic vs electrolytic' },
            { id: 'jc7t3', title: 'Standard electrode potentials; EMF of cell; SHE' },
            { id: 'jc7t4', title: 'Nernst equation; concentration cell' },
            { id: 'jc7t5', title: 'Kohlrausch\'s law; molar conductivity' },
            { id: 'jc7t6', title: 'Faraday\'s laws of electrolysis' }
          ]
        },
        {
          id: 'jc8', title: 'Chemical Kinetics',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc8t1', title: 'Rate of reaction; factors: concentration, T, catalyst, surface area' },
            { id: 'jc8t2', title: 'Rate law; order and molecularity' },
            { id: 'jc8t3', title: 'Integrated rate equations: zero, first, second order' },
            { id: 'jc8t4', title: 'Half-life calculations; pseudo-first order' },
            { id: 'jc8t5', title: 'Arrhenius equation: activation energy; effect of temperature' },
            { id: 'jc8t6', title: 'Collision theory; transition state theory (overview)' }
          ]
        },
        {
          id: 'jc9', title: 'Surface Chemistry',
          officialWeightage: 'PYQ_TREND | ~1 question',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'jc9t1', title: 'Adsorption: physisorption vs chemisorption; Freundlich isotherm' },
            { id: 'jc9t2', title: 'Catalysis: homogeneous, heterogeneous; enzyme catalysis' },
            { id: 'jc9t3', title: 'Colloids: preparation, properties; Tyndall effect; Brownian motion; coagulation' },
            { id: 'jc9t4', title: 'Emulsions; micelles' }
          ]
        },
        // ═══ INORGANIC CHEMISTRY ═══
        {
          id: 'jc10', title: 'Classification of Elements & Periodicity',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc10t1', title: 'Modern periodic law; blocks (s, p, d, f)' },
            { id: 'jc10t2', title: 'Atomic and ionic radii trends' },
            { id: 'jc10t3', title: 'Ionisation enthalpy; electron gain enthalpy; electronegativity' },
            { id: 'jc10t4', title: 'Valency; oxidation states; diagonal relationship' }
          ]
        },
        {
          id: 'jc11', title: 's-Block Elements',
          officialWeightage: 'PYQ_TREND | ~1 question',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'jc11t1', title: 'Alkali metals (Group 1): properties; compounds of Na (NaOH, Na2CO3, NaHCO3, NaCl)' },
            { id: 'jc11t2', title: 'Alkaline earth metals (Group 2): properties; compounds of Ca (CaO, Ca(OH)2, CaCO3)' },
            { id: 'jc11t3', title: 'Anomalous behaviour of Li and Be; biological importance' }
          ]
        },
        {
          id: 'jc12', title: 'p-Block Elements',
          officialWeightage: 'PYQ_TREND | ~3-4 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc12t1', title: 'Group 13 (Boron family): boron, aluminium; borax, boranes; alums' },
            { id: 'jc12t2', title: 'Group 14 (Carbon family): allotropes of C; CO, CO2, SiO2; silicones' },
            { id: 'jc12t3', title: 'Group 15 (Nitrogen family): N2, P; NH3, HNO3, H3PO4; oxoacids of P' },
            { id: 'jc12t4', title: 'Group 16 (Oxygen family): O3, S; SO2, SO3, H2SO4 (Contact process)' },
            { id: 'jc12t5', title: 'Group 17 (Halogens): F2, Cl2, Br2, I2; HX acids; interhalogen compounds' },
            { id: 'jc12t6', title: 'Group 18 (Noble gases): properties; uses; compounds of Xe' }
          ]
        },
        {
          id: 'jc13', title: 'd and f-Block Elements',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc13t1', title: 'Transition metals: electronic configuration; variable oxidation states' },
            { id: 'jc13t2', title: 'Properties: colour, magnetic, catalytic, alloy formation' },
            { id: 'jc13t3', title: 'Important compounds: K2Cr2O7, KMnO4 — preparation and reactions' },
            { id: 'jc13t4', title: 'Lanthanoids: electronic configuration; lanthanoid contraction' },
            { id: 'jc13t5', title: 'Actinoids: comparison with lanthanoids' }
          ]
        },
        {
          id: 'jc14', title: 'Coordination Compounds',
          officialWeightage: 'PYQ_TREND | ~2-3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc14t1', title: 'Werner\'s theory; terms: ligand, coordination number, coordination sphere' },
            { id: 'jc14t2', title: 'IUPAC nomenclature of coordination compounds' },
            { id: 'jc14t3', title: 'VBT: geometry and magnetic character' },
            { id: 'jc14t4', title: 'CFT: splitting of d-orbitals; CFSE; colour in complexes' },
            { id: 'jc14t5', title: 'Isomerism: structural (linkage, ionisation) and stereoisomerism (geometric, optical)' },
            { id: 'jc14t6', title: 'Applications in medicine (cisplatin), analytical chemistry (EDTA)' }
          ]
        },
        // ═══ ORGANIC CHEMISTRY ═══
        {
          id: 'jc15', title: 'Basic Principles of Organic Chemistry',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc15t1', title: 'IUPAC nomenclature of organic compounds (all classes)' },
            { id: 'jc15t2', title: 'Isomerism: structural, geometric, optical' },
            { id: 'jc15t3', title: 'Electronic displacements: inductive, mesomeric, hyperconjugation' },
            { id: 'jc15t4', title: 'Reactive intermediates: carbocation, carbanion, free radical, carbene' },
            { id: 'jc15t5', title: 'Types of reactions: SN1, SN2, E1, E2, addition, elimination' }
          ]
        },
        {
          id: 'jc16', title: 'Hydrocarbons',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc16t1', title: 'Alkanes: IUPAC names; free radical halogenation (mechanism)' },
            { id: 'jc16t2', title: 'Alkenes: Markovnikov\'s rule; anti-Markovnikov (peroxide effect)' },
            { id: 'jc16t3', title: 'Alkynes: acidic character; reduction; addition reactions' },
            { id: 'jc16t4', title: 'Benzene: Kekulé structure; aromatic electrophilic substitution' },
            { id: 'jc16t5', title: 'Directive influence: ortho/para vs meta directors' }
          ]
        },
        {
          id: 'jc17', title: 'Haloalkanes and Haloarenes',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc17t1', title: 'Classification; nomenclature' },
            { id: 'jc17t2', title: 'SN1 vs SN2 mechanisms; stereochemistry' },
            { id: 'jc17t3', title: 'E1 vs E2 elimination; Saytzeff rule' },
            { id: 'jc17t4', title: 'Reactions of aryl halides (nucleophilic aromatic substitution)' },
            { id: 'jc17t5', title: 'Grignard reagent preparation and reactions' }
          ]
        },
        {
          id: 'jc18', title: 'Alcohols, Phenols and Ethers',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc18t1', title: 'Alcohols: preparation from alkenes, alkyl halides; reactions' },
            { id: 'jc18t2', title: 'Acidity: alcohols vs phenols; factors affecting acidity' },
            { id: 'jc18t3', title: 'Phenols: preparation; reactions (electrophilic substitution, kolbe, reimer-tiemann)' },
            { id: 'jc18t4', title: 'Ethers: Williamson synthesis; reactions with HX; cleavage' }
          ]
        },
        {
          id: 'jc19', title: 'Aldehydes, Ketones and Carboxylic Acids',
          officialWeightage: 'PYQ_TREND | ~2-3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc19t1', title: 'Preparation of aldehydes and ketones: oxidation, ozonolysis' },
            { id: 'jc19t2', title: 'Nucleophilic addition: HCN, NH2OH, NaHSO3, Grignard' },
            { id: 'jc19t3', title: 'Aldol condensation; Cannizzaro reaction; Clemmensen/Wolff-Kishner' },
            { id: 'jc19t4', title: 'Carboxylic acids: preparation; acidity; esterification (Fischer)' },
            { id: 'jc19t5', title: 'Reactions with PCl5, SOCl2; Hell-Volhard-Zelinsky; decarboxylation' }
          ]
        },
        {
          id: 'jc20', title: 'Amines',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jc20t1', title: 'Classification: 1°, 2°, 3° amines; quaternary ammonium salts' },
            { id: 'jc20t2', title: 'Preparation: Gabriel synthesis; Hofmann bromamide; reduction' },
            { id: 'jc20t3', title: 'Basicity: amine vs aniline; effect of substituents' },
            { id: 'jc20t4', title: 'Diazonium salts: preparation; Sandmeyer reaction; azo coupling' }
          ]
        },
        {
          id: 'jc21', title: 'Biomolecules, Polymers & Chemistry in Everyday Life',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'jc21t1', title: 'Carbohydrates: mono, di, polysaccharides; glucose structure' },
            { id: 'jc21t2', title: 'Proteins: amino acids; peptide bond; primary to quaternary structure' },
            { id: 'jc21t3', title: 'Nucleic acids: DNA vs RNA; base pairing' },
            { id: 'jc21t4', title: 'Polymers: addition vs condensation; common polymers (Nylon, Teflon, PVC, Bakelite)' },
            { id: 'jc21t5', title: 'Drugs: analgesics, antibiotics, antacids; food preservatives' }
          ]
        }
      ]
    },
    {
      id: 'jee_maths',
      name: 'Mathematics',
      chapters: [
        // ═══ UNIT 1: SETS, RELATIONS, FUNCTIONS ═══
        {
          id: 'jm1', title: 'Sets, Relations and Functions',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm1t1', title: 'Sets: representation; types; power set; algebra (union, intersection, complement)' },
            { id: 'jm1t2', title: 'De Morgan\'s law; Venn diagrams; counting problems using sets' },
            { id: 'jm1t3', title: 'Relations: Cartesian product; types (reflexive, symmetric, transitive, equivalence)' },
            { id: 'jm1t4', title: 'Functions: domain, codomain, range; one-one, onto; composition; invertible' },
            { id: 'jm1t5', title: 'Real-valued functions; graphs; piecewise functions' }
          ]
        },
        // ═══ UNIT 2: COMPLEX NUMBERS ═══
        {
          id: 'jm2', title: 'Complex Numbers and Quadratic Equations',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm2t1', title: 'Complex numbers: real and imaginary parts; modulus; argument' },
            { id: 'jm2t2', title: 'Argand plane; polar form; De Moivre\'s theorem' },
            { id: 'jm2t3', title: 'nth roots of unity; geometric interpretation' },
            { id: 'jm2t4', title: 'Quadratic equations in real and complex system' },
            { id: 'jm2t5', title: 'Relation between roots and coefficients; nature of roots (discriminant)' }
          ]
        },
        // ═══ UNIT 3: MATRICES & DETERMINANTS ═══
        {
          id: 'jm3', title: 'Matrices and Determinants',
          officialWeightage: 'PYQ_TREND | ~2-3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm3t1', title: 'Matrices: types; algebra (addition, scalar multiplication, matrix multiplication)' },
            { id: 'jm3t2', title: 'Transpose; symmetric; skew-symmetric; orthogonal matrices' },
            { id: 'jm3t3', title: 'Determinants: properties; cofactors; expansion' },
            { id: 'jm3t4', title: 'Area of triangle using determinant' },
            { id: 'jm3t5', title: 'Adjoint; inverse of a matrix' },
            { id: 'jm3t6', title: 'System of linear equations: Cramer\'s rule; matrix method; consistency' }
          ]
        },
        // ═══ UNIT 4: PERMUTATIONS & COMBINATIONS ═══
        {
          id: 'jm4', title: 'Permutations and Combinations',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm4t1', title: 'Fundamental principle of counting' },
            { id: 'jm4t2', title: 'Permutations: nPr formula; circular; repetition allowed' },
            { id: 'jm4t3', title: 'Combinations: nCr formula; properties; selection problems' },
            { id: 'jm4t4', title: 'Derangements; word problems' }
          ]
        },
        // ═══ UNIT 5: MATHEMATICAL INDUCTION ═══
        {
          id: 'jm5', title: 'Mathematical Induction & Binomial Theorem',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm5t1', title: 'Principle of mathematical induction; problems using induction' },
            { id: 'jm5t2', title: 'Binomial theorem for positive integral index' },
            { id: 'jm5t3', title: 'General term; middle term; specific term finding' },
            { id: 'jm5t4', title: 'Binomial coefficients; greatest coefficient; greatest term' },
            { id: 'jm5t5', title: 'Properties of binomial coefficients' }
          ]
        },
        // ═══ UNIT 6: SEQUENCES & SERIES ═══
        {
          id: 'jm6', title: 'Sequences and Series',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm6t1', title: 'AP: nth term; sum to n terms; AM' },
            { id: 'jm6t2', title: 'GP: nth term; sum to n terms; sum of infinite GP; GM' },
            { id: 'jm6t3', title: 'HP and HM; AM-GM-HM inequalities' },
            { id: 'jm6t4', title: 'Arithmetico-geometric series' },
            { id: 'jm6t5', title: 'Sum of special series: Σn, Σn², Σn³' }
          ]
        },
        // ═══ UNIT 7: LIMIT, CONTINUITY, DIFFERENTIABILITY ═══
        {
          id: 'jm7', title: 'Limits, Continuity and Differentiability',
          officialWeightage: 'PYQ_TREND | ~3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm7t1', title: 'Limits: indeterminate forms; L\'Hopital\'s rule; sandwich theorem' },
            { id: 'jm7t2', title: 'Standard limits: sin x/x, (1+1/x)^x, etc.' },
            { id: 'jm7t3', title: 'Continuity: definition; types of discontinuities; removable discontinuity' },
            { id: 'jm7t4', title: 'Differentiability: relation with continuity; left and right derivatives' },
            { id: 'jm7t5', title: 'Differentiation: rules (product, quotient, chain); implicit differentiation' },
            { id: 'jm7t6', title: 'Derivatives of standard functions; parametric differentiation' },
            { id: 'jm7t7', title: 'Higher order derivatives; Leibnitz theorem' }
          ]
        },
        // ═══ UNIT 8: APPLICATIONS OF DERIVATIVES ═══
        {
          id: 'jm8', title: 'Applications of Derivatives',
          officialWeightage: 'PYQ_TREND | ~2-3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm8t1', title: 'Rate of change; tangent and normal to curves' },
            { id: 'jm8t2', title: 'Increasing and decreasing functions; monotonicity' },
            { id: 'jm8t3', title: 'Maxima and minima: first and second derivative tests' },
            { id: 'jm8t4', title: 'Rolle\'s theorem; Mean Value Theorem' },
            { id: 'jm8t5', title: 'Approximations using differentials' }
          ]
        },
        // ═══ UNIT 9: INTEGRAL CALCULUS ═══
        {
          id: 'jm9', title: 'Integral Calculus',
          officialWeightage: 'PYQ_TREND | ~3-4 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm9t1', title: 'Indefinite integration: standard forms; integration by parts; by substitution' },
            { id: 'jm9t2', title: 'Integration of rational functions: partial fractions' },
            { id: 'jm9t3', title: 'Integration of irrational functions; integration of trigonometric functions' },
            { id: 'jm9t4', title: 'Definite integrals: properties; King\'s property; Leibnitz rule' },
            { id: 'jm9t5', title: 'Fundamental theorem of calculus' },
            { id: 'jm9t6', title: 'Area bounded by curves; area between two curves' }
          ]
        },
        // ═══ UNIT 10: DIFFERENTIAL EQUATIONS ═══
        {
          id: 'jm10', title: 'Differential Equations',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm10t1', title: 'Order and degree of DE; formation of DE' },
            { id: 'jm10t2', title: 'Variable separable method' },
            { id: 'jm10t3', title: 'Homogeneous DE; linear DE' },
            { id: 'jm10t4', title: 'Exact DE; Bernoulli\'s equation' },
            { id: 'jm10t5', title: 'Applications: population growth, cooling, simple harmonic' }
          ]
        },
        // ═══ UNIT 11: COORDINATE GEOMETRY ═══
        {
          id: 'jm11', title: 'Coordinate Geometry (2D)',
          officialWeightage: 'PYQ_TREND | ~4-5 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm11t1', title: 'Straight lines: slope; various forms; distance of point from line' },
            { id: 'jm11t2', title: 'Angle between lines; family of lines; concurrent lines' },
            { id: 'jm11t3', title: 'Circle: standard equations; general form; chord; tangent; normal' },
            { id: 'jm11t4', title: 'Pair of tangents; chord of contact; radical axis' },
            { id: 'jm11t5', title: 'Parabola: standard equations; focus, directrix, latus rectum' },
            { id: 'jm11t6', title: 'Parabola: tangent, normal, chord of contact' },
            { id: 'jm11t7', title: 'Ellipse: standard equation; eccentricity; foci; tangent, normal' },
            { id: 'jm11t8', title: 'Hyperbola: standard equation; asymptotes; conjugate hyperbola; tangent' }
          ]
        },
        // ═══ UNIT 12: 3D GEOMETRY ═══
        {
          id: 'jm12', title: 'Three-Dimensional Geometry',
          officialWeightage: 'PYQ_TREND | ~2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm12t1', title: 'Direction cosines and direction ratios of a line' },
            { id: 'jm12t2', title: 'Equation of line in 3D: symmetric and vector forms' },
            { id: 'jm12t3', title: 'Angle between two lines; skew lines; shortest distance' },
            { id: 'jm12t4', title: 'Equation of plane: general, intercept, normal forms' },
            { id: 'jm12t5', title: 'Distance of point from plane; angle between planes' },
            { id: 'jm12t6', title: 'Distance of point from line in 3D; plane through three points' }
          ]
        },
        // ═══ UNIT 13: VECTOR ALGEBRA ═══
        {
          id: 'jm13', title: 'Vector Algebra',
          officialWeightage: 'PYQ_TREND | ~1-2 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm13t1', title: 'Scalars and vectors; types; addition; position vector' },
            { id: 'jm13t2', title: 'Dot product: definition; angle between vectors; projection' },
            { id: 'jm13t3', title: 'Cross product: definition; area of parallelogram and triangle' },
            { id: 'jm13t4', title: 'Scalar triple product: volume of parallelepiped; coplanarity' },
            { id: 'jm13t5', title: 'Vector triple product (BAC-CAB rule)' }
          ]
        },
        // ═══ UNIT 14: STATISTICS & PROBABILITY ═══
        {
          id: 'jm14', title: 'Statistics and Probability',
          officialWeightage: 'PYQ_TREND | ~2-3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm14t1', title: 'Measures of central tendency: mean, median, mode' },
            { id: 'jm14t2', title: 'Measures of dispersion: variance, SD, mean deviation' },
            { id: 'jm14t3', title: 'Random experiments; sample space; events; types of events' },
            { id: 'jm14t4', title: 'Addition and multiplication theorems; conditional probability' },
            { id: 'jm14t5', title: 'Independent events; total probability; Bayes\' theorem' },
            { id: 'jm14t6', title: 'Random variables; probability distribution; expectation and variance' },
            { id: 'jm14t7', title: 'Binomial distribution; Bernoulli trials' }
          ]
        },
        // ═══ UNIT 15: TRIGONOMETRY ═══
        {
          id: 'jm15', title: 'Trigonometry',
          officialWeightage: 'PYQ_TREND | ~2-3 questions',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'jm15t1', title: 'Trigonometric functions; graphs; domain and range' },
            { id: 'jm15t2', title: 'Compound angle formulas; multiple angle formulas' },
            { id: 'jm15t3', title: 'Sum-to-product and product-to-sum formulas' },
            { id: 'jm15t4', title: 'Trigonometric equations: general solutions' },
            { id: 'jm15t5', title: 'Inverse trigonometric functions: domain, range; principal values' },
            { id: 'jm15t6', title: 'Properties of inverse trig functions; identities' },
            { id: 'jm15t7', title: 'Properties of triangle: sine rule, cosine rule; area formulas' },
            { id: 'jm15t8', title: 'Heights and distances' }
          ]
        },
        // ═══ UNIT 16: MATHEMATICAL REASONING ═══
        {
          id: 'jm16', title: 'Mathematical Reasoning',
          officialWeightage: 'PYQ_TREND | ~1 question',
          pyqPriority: 'LOW',
          topics: [
            { id: 'jm16t1', title: 'Statements; negation; compound statements' },
            { id: 'jm16t2', title: 'Conjunction, disjunction, implication, biconditional' },
            { id: 'jm16t3', title: 'Truth tables; tautology; contradiction; contrapositive; converse' }
          ]
        }
      ]
    }
  ]
};
