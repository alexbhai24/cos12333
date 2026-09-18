import { SyllabusData } from '../types/syllabus';

// NEET 2026-27 | Total: 200 Questions | 720 Marks
// Physics: 45Q × 4 = 180 Marks | Chemistry: 45Q × 4 = 180 Marks | Biology: 90Q × 4 = 360 Marks
// PYQ Priority based on NTA previous year papers 2017-2025

export const syllabusNEET: SyllabusData = {
  id: 'neet',
  examOrBoard: 'NEET',
  category: 'Special',
  academicSession: '2026-2027',
  sourceUrl: 'https://exams.nta.ac.in/NEET/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'neet_physics',
      name: 'Physics',
      chapters: [
        {
          id: 'np1', title: 'Physical World & Measurement',
          officialWeightage: '~2% | ~1 question', pyqPriority: 'LOW',
          topics: [
            { id: 'np1t1', title: 'Scope and excitement of physics' },
            { id: 'np1t2', title: 'SI Units and fundamental quantities' },
            { id: 'np1t3', title: 'Significant figures and rounding' },
            { id: 'np1t4', title: 'Errors in measurement: absolute, relative, percentage' },
            { id: 'np1t5', title: 'Dimensional analysis and applications' }
          ]
        },
        {
          id: 'np2', title: 'Kinematics',
          officialWeightage: '~3% | ~1-2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'np2t1', title: 'Frame of reference and displacement' },
            { id: 'np2t2', title: 'Velocity and acceleration (uniform and non-uniform)' },
            { id: 'np2t3', title: 'Equations of motion for constant acceleration' },
            { id: 'np2t4', title: 'Motion in a plane: Projectile motion' },
            { id: 'np2t5', title: 'Uniform circular motion: centripetal acceleration' },
            { id: 'np2t6', title: 'Relative velocity' }
          ]
        },
        {
          id: 'np3', title: 'Laws of Motion',
          officialWeightage: '~3% | ~1-2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np3t1', title: 'Newton\'s First Law: concept of inertia' },
            { id: 'np3t2', title: 'Newton\'s Second Law: F = ma' },
            { id: 'np3t3', title: 'Newton\'s Third Law: action-reaction pairs' },
            { id: 'np3t4', title: 'Conservation of linear momentum' },
            { id: 'np3t5', title: 'Static and kinetic friction; laws of friction' },
            { id: 'np3t6', title: 'Dynamics of circular motion: banking of roads' }
          ]
        },
        {
          id: 'np4', title: 'Work, Energy and Power',
          officialWeightage: '~4% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np4t1', title: 'Work done by constant and variable forces' },
            { id: 'np4t2', title: 'Work-energy theorem' },
            { id: 'np4t3', title: 'Kinetic energy and potential energy' },
            { id: 'np4t4', title: 'Conservation of mechanical energy' },
            { id: 'np4t5', title: 'Power: average and instantaneous' },
            { id: 'np4t6', title: 'Elastic and inelastic collisions in 1D and 2D' }
          ]
        },
        {
          id: 'np5', title: 'Rotational Motion',
          officialWeightage: '~5% | ~2-3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np5t1', title: 'Centre of mass of a system of particles' },
            { id: 'np5t2', title: 'Angular momentum and its conservation' },
            { id: 'np5t3', title: 'Torque and moment of inertia' },
            { id: 'np5t4', title: 'Theorems: parallel and perpendicular axes' },
            { id: 'np5t5', title: 'Rolling motion (without slipping)' },
            { id: 'np5t6', title: 'MI of rod, ring, disc, sphere, cylinder' }
          ]
        },
        {
          id: 'np6', title: 'Gravitation',
          officialWeightage: '~4% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np6t1', title: 'Newton\'s law of universal gravitation' },
            { id: 'np6t2', title: 'Gravitational field and potential' },
            { id: 'np6t3', title: 'Escape velocity and orbital velocity' },
            { id: 'np6t4', title: 'Kepler\'s laws of planetary motion' },
            { id: 'np6t5', title: 'Variation of g with altitude, depth, latitude' },
            { id: 'np6t6', title: 'Geostationary satellites and GPS' }
          ]
        },
        {
          id: 'np7', title: 'Properties of Solids and Fluids',
          officialWeightage: '~3% | ~1-2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'np7t1', title: 'Elasticity: stress, strain, Young\'s modulus' },
            { id: 'np7t2', title: 'Pressure in fluids: Pascal\'s law, Archimedes\' principle' },
            { id: 'np7t3', title: 'Bernoulli\'s theorem and applications' },
            { id: 'np7t4', title: 'Viscosity and Stokes\' law; terminal velocity' },
            { id: 'np7t5', title: 'Surface tension, surface energy, capillary rise' }
          ]
        },
        {
          id: 'np8', title: 'Thermodynamics',
          officialWeightage: '~5% | ~2-3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np8t1', title: 'Thermal equilibrium and Zeroth law' },
            { id: 'np8t2', title: 'Heat, work and internal energy' },
            { id: 'np8t3', title: 'First law of thermodynamics' },
            { id: 'np8t4', title: 'Isothermal, adiabatic, isochoric, isobaric processes' },
            { id: 'np8t5', title: 'Second law: Carnot engine, efficiency, COP' },
            { id: 'np8t6', title: 'Heat engines and refrigerators' }
          ]
        },
        {
          id: 'np9', title: 'Kinetic Theory of Gases',
          officialWeightage: '~3% | ~1-2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np9t1', title: 'Kinetic theory: assumptions and postulates' },
            { id: 'np9t2', title: 'RMS speed, mean speed, most probable speed' },
            { id: 'np9t3', title: 'Law of equipartition of energy' },
            { id: 'np9t4', title: 'Degrees of freedom and specific heats (Cp, Cv, γ)' },
            { id: 'np9t5', title: 'Mean free path' }
          ]
        },
        {
          id: 'np10', title: 'Oscillations and Waves',
          officialWeightage: '~6% | ~3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np10t1', title: 'Simple harmonic motion: equation and energy' },
            { id: 'np10t2', title: 'SHM of spring-mass system and simple pendulum' },
            { id: 'np10t3', title: 'Damped, forced oscillations and resonance' },
            { id: 'np10t4', title: 'Wave motion: transverse and longitudinal' },
            { id: 'np10t5', title: 'Speed of a wave, superposition principle' },
            { id: 'np10t6', title: 'Standing waves, nodes and antinodes' },
            { id: 'np10t7', title: 'Beats and Doppler effect in sound' }
          ]
        },
        {
          id: 'np11', title: 'Electrostatics',
          officialWeightage: '~9% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np11t1', title: 'Electric charge: conservation and quantisation' },
            { id: 'np11t2', title: 'Coulomb\'s law; superposition principle' },
            { id: 'np11t3', title: 'Electric field and field lines' },
            { id: 'np11t4', title: 'Gauss\'s law and its applications (infinite plane, sphere)' },
            { id: 'np11t5', title: 'Electric potential and potential difference' },
            { id: 'np11t6', title: 'Relation between E and V' },
            { id: 'np11t7', title: 'Capacitance; parallel plate capacitor' },
            { id: 'np11t8', title: 'Series and parallel combination of capacitors' },
            { id: 'np11t9', title: 'Energy stored in a capacitor; dielectrics' }
          ]
        },
        {
          id: 'np12', title: 'Current Electricity',
          officialWeightage: '~8% | ~3-4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np12t1', title: 'Drift velocity and current density' },
            { id: 'np12t2', title: 'Ohm\'s law; resistance and resistivity' },
            { id: 'np12t3', title: 'Temperature dependence of resistance' },
            { id: 'np12t4', title: 'EMF, internal resistance, terminal voltage' },
            { id: 'np12t5', title: 'Kirchhoff\'s laws (KVL, KCL)' },
            { id: 'np12t6', title: 'Wheatstone bridge; meter bridge; potentiometer' },
            { id: 'np12t7', title: 'Heating effect: Joule\'s law' }
          ]
        },
        {
          id: 'np13', title: 'Magnetic Effects of Current & Magnetism',
          officialWeightage: '~8% | ~3-4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np13t1', title: 'Biot-Savart law; field due to straight wire and circular loop' },
            { id: 'np13t2', title: 'Ampere\'s law; solenoid and toroid' },
            { id: 'np13t3', title: 'Force on current in magnetic field; Fleming\'s rule' },
            { id: 'np13t4', title: 'Moving coil galvanometer; ammeter; voltmeter' },
            { id: 'np13t5', title: 'Bar magnet; dipole in field; Earth\'s magnetism' },
            { id: 'np13t6', title: 'Para, dia and ferromagnetic materials' },
            { id: 'np13t7', title: 'Cyclotron' }
          ]
        },
        {
          id: 'np14', title: 'Electromagnetic Induction & Alternating Currents',
          officialWeightage: '~8% | ~3-4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np14t1', title: 'Magnetic flux; Faraday\'s laws of EMI' },
            { id: 'np14t2', title: 'Lenz\'s law and conservation of energy' },
            { id: 'np14t3', title: 'Self-induction and mutual induction' },
            { id: 'np14t4', title: 'AC generator and transformer' },
            { id: 'np14t5', title: 'RMS values; impedance; phase diagrams' },
            { id: 'np14t6', title: 'LCR series circuit and resonance' },
            { id: 'np14t7', title: 'Power factor; wattless current' }
          ]
        },
        {
          id: 'np15', title: 'Optics',
          officialWeightage: '~9% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np15t1', title: 'Reflection by spherical mirrors: mirror formula' },
            { id: 'np15t2', title: 'Refraction at plane and spherical surfaces' },
            { id: 'np15t3', title: 'Lens maker\'s equation; lens formula; magnification' },
            { id: 'np15t4', title: 'Power of a lens; combination of lenses' },
            { id: 'np15t5', title: 'Total internal reflection and optical fibre' },
            { id: 'np15t6', title: 'Prism: deviation and dispersion' },
            { id: 'np15t7', title: 'Wave optics: Huygens\' principle' },
            { id: 'np15t8', title: 'Young\'s double slit experiment; interference' },
            { id: 'np15t9', title: 'Diffraction: single slit; resolving power' },
            { id: 'np15t10', title: 'Polarisation: Brewster\'s law, Malus\'s law' }
          ]
        },
        {
          id: 'np16', title: 'Dual Nature of Matter & Radiation',
          officialWeightage: '~6% | ~2-3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np16t1', title: 'Photoelectric effect: Einstein\'s equation' },
            { id: 'np16t2', title: 'Work function, threshold frequency, stopping potential' },
            { id: 'np16t3', title: 'de Broglie hypothesis; matter waves' },
            { id: 'np16t4', title: 'Davisson-Germer experiment' }
          ]
        },
        {
          id: 'np17', title: 'Atoms & Nuclei',
          officialWeightage: '~6% | ~2-3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np17t1', title: 'Alpha scattering and Rutherford\'s model' },
            { id: 'np17t2', title: 'Bohr\'s model: energy levels, spectra of hydrogen' },
            { id: 'np17t3', title: 'Composition and size of nucleus' },
            { id: 'np17t4', title: 'Mass defect; binding energy; BE per nucleon curve' },
            { id: 'np17t5', title: 'Nuclear fission and fusion; Q value' },
            { id: 'np17t6', title: 'Radioactivity: α, β, γ decay; half-life' }
          ]
        },
        {
          id: 'np18', title: 'Electronic Devices',
          officialWeightage: '~6% | ~2-3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'np18t1', title: 'Semiconductors: intrinsic, p-type, n-type' },
            { id: 'np18t2', title: 'p-n junction diode: forward and reverse bias' },
            { id: 'np18t3', title: 'Rectifiers: half wave and full wave' },
            { id: 'np18t4', title: 'Zener diode as voltage regulator' },
            { id: 'np18t5', title: 'Transistor: NPN, PNP; CE configuration; amplifier' },
            { id: 'np18t6', title: 'Logic gates: AND, OR, NOT, NAND, NOR' }
          ]
        }
      ]
    },
    {
      id: 'neet_chemistry',
      name: 'Chemistry',
      chapters: [
        // ── CLASS 11 TOPICS ──
        {
          id: 'nc1', title: 'Some Basic Concepts of Chemistry',
          officialWeightage: '~2% | ~1 question', pyqPriority: 'LOW',
          topics: [
            { id: 'nc1t1', title: 'Matter and its classification' },
            { id: 'nc1t2', title: 'Laws of chemical combination' },
            { id: 'nc1t3', title: 'Dalton\'s atomic theory' },
            { id: 'nc1t4', title: 'Mole concept and molar mass' },
            { id: 'nc1t5', title: 'Percentage composition; empirical and molecular formula' },
            { id: 'nc1t6', title: 'Stoichiometry and limiting reagent' }
          ]
        },
        {
          id: 'nc2', title: 'Structure of Atom',
          officialWeightage: '~3% | ~1-2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc2t1', title: 'Discovery of electron, proton and neutron' },
            { id: 'nc2t2', title: 'Rutherford model; Bohr model of hydrogen' },
            { id: 'nc2t3', title: 'Dual nature: de Broglie relation; Heisenberg uncertainty' },
            { id: 'nc2t4', title: 'Quantum mechanical model: orbitals and quantum numbers' },
            { id: 'nc2t5', title: 'Electronic configuration: Aufbau, Hund\'s, Pauli' }
          ]
        },
        {
          id: 'nc3', title: 'Classification of Elements & Periodicity',
          officialWeightage: '~3% | ~1-2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc3t1', title: 'Modern periodic law and periodic table' },
            { id: 'nc3t2', title: 'Atomic and ionic radii' },
            { id: 'nc3t3', title: 'Ionisation enthalpy' },
            { id: 'nc3t4', title: 'Electron gain enthalpy' },
            { id: 'nc3t5', title: 'Electronegativity and valency' }
          ]
        },
        {
          id: 'nc4', title: 'Chemical Bonding & Molecular Structure',
          officialWeightage: '~8% | ~3-4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc4t1', title: 'Ionic bonding: lattice energy, Born-Haber cycle' },
            { id: 'nc4t2', title: 'Covalent bonding: Lewis structures; formal charge' },
            { id: 'nc4t3', title: 'VSEPR theory: molecular geometry' },
            { id: 'nc4t4', title: 'Polarity; dipole moment' },
            { id: 'nc4t5', title: 'Valence Bond Theory (VBT): hybridisation (sp, sp2, sp3, sp3d, sp3d2)' },
            { id: 'nc4t6', title: 'Molecular Orbital Theory (MOT): bond order; O2, N2, F2' },
            { id: 'nc4t7', title: 'Hydrogen bonding (inter and intra molecular)' }
          ]
        },
        {
          id: 'nc5', title: 'States of Matter',
          officialWeightage: '~3% | ~1-2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nc5t1', title: 'Kinetic molecular theory of gases' },
            { id: 'nc5t2', title: 'Gas laws: Boyle\'s, Charles\'s, Gay-Lussac\'s, Avogadro\'s' },
            { id: 'nc5t3', title: 'Ideal gas equation and real gases (van der Waals)' },
            { id: 'nc5t4', title: 'Liquefaction and critical constants' },
            { id: 'nc5t5', title: 'Liquid state: vapour pressure, surface tension, viscosity' }
          ]
        },
        {
          id: 'nc6', title: 'Thermodynamics',
          officialWeightage: '~5% | ~2-3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc6t1', title: 'System, surroundings; extensive and intensive properties' },
            { id: 'nc6t2', title: 'First law: internal energy, work, heat' },
            { id: 'nc6t3', title: 'Enthalpy; standard enthalpy of reactions' },
            { id: 'nc6t4', title: 'Hess\'s law; enthalpy of combustion, formation, neutralisation' },
            { id: 'nc6t5', title: 'Bond enthalpies' },
            { id: 'nc6t6', title: 'Entropy; Gibbs free energy (ΔG = ΔH - TΔS); spontaneity' }
          ]
        },
        {
          id: 'nc7', title: 'Equilibrium',
          officialWeightage: '~6% | ~2-3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc7t1', title: 'Law of mass action and equilibrium constant (Kc, Kp)' },
            { id: 'nc7t2', title: 'Le Chatelier\'s principle' },
            { id: 'nc7t3', title: 'Ionic equilibrium; degree of ionisation' },
            { id: 'nc7t4', title: 'Buffer solutions; Henderson-Hasselbalch equation' },
            { id: 'nc7t5', title: 'Solubility product (Ksp) and common ion effect' }
          ]
        },
        {
          id: 'nc8', title: 'Redox Reactions',
          officialWeightage: '~2% | ~1 question', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nc8t1', title: 'Oxidation number and rules' },
            { id: 'nc8t2', title: 'Balancing redox equations (ion-electron method)' }
          ]
        },
        {
          id: 'nc9', title: 'Hydrogen',
          officialWeightage: '~2% | ~1 question', pyqPriority: 'LOW',
          topics: [
            { id: 'nc9t1', title: 'Position and occurrence of hydrogen' },
            { id: 'nc9t2', title: 'Properties of water and heavy water' },
            { id: 'nc9t3', title: 'Hydrogen peroxide: structure and uses' }
          ]
        },
        {
          id: 'nc10', title: 's-Block Elements',
          officialWeightage: '~3% | ~1-2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nc10t1', title: 'Group 1: alkali metals — properties and compounds (NaOH, Na2CO3, NaHCO3)' },
            { id: 'nc10t2', title: 'Group 2: alkaline earth metals — properties and compounds' },
            { id: 'nc10t3', title: 'Biological importance of Na, K, Mg, Ca' }
          ]
        },
        {
          id: 'nc11', title: 'p-Block Elements (Class 11)',
          officialWeightage: '~5% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc11t1', title: 'Group 13: Boron family — properties, borax, boranes' },
            { id: 'nc11t2', title: 'Group 14: Carbon family — allotropes, CO, CO2, SiO2' },
            { id: 'nc11t3', title: 'Anomalous behaviour of first elements in each group' }
          ]
        },
        {
          id: 'nc12', title: 'Organic Chemistry: Basic Principles & Techniques',
          officialWeightage: '~4% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc12t1', title: 'IUPAC nomenclature' },
            { id: 'nc12t2', title: 'Structural and stereoisomerism (cis-trans, optical)' },
            { id: 'nc12t3', title: 'Electronic effects: inductive, resonance, hyperconjugation' },
            { id: 'nc12t4', title: 'Types of reactions: addition, substitution, elimination' },
            { id: 'nc12t5', title: 'Reactive intermediates: carbocations, carbanions, free radicals' }
          ]
        },
        {
          id: 'nc13', title: 'Hydrocarbons',
          officialWeightage: '~4% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc13t1', title: 'Alkanes: preparation, properties, reactions (halogenation)' },
            { id: 'nc13t2', title: 'Alkenes: Markovnikov\'s rule; addition reactions' },
            { id: 'nc13t3', title: 'Alkynes: acidic character; addition reactions' },
            { id: 'nc13t4', title: 'Benzene: structure, aromatic electrophilic substitution' }
          ]
        },
        // ── CLASS 12 TOPICS ──
        {
          id: 'nc14', title: 'Solutions',
          officialWeightage: '~3% | ~1-2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc14t1', title: 'Types of solutions and concentration terms' },
            { id: 'nc14t2', title: 'Raoult\'s law and vapour pressure lowering' },
            { id: 'nc14t3', title: 'Colligative properties: elevation, depression, osmosis' },
            { id: 'nc14t4', title: 'Abnormal molar masses: van\'t Hoff factor' }
          ]
        },
        {
          id: 'nc15', title: 'Electrochemistry',
          officialWeightage: '~4% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc15t1', title: 'Electrochemical cells: galvanic vs electrolytic' },
            { id: 'nc15t2', title: 'Standard electrode potentials; EMF of cell' },
            { id: 'nc15t3', title: 'Nernst equation and equilibrium constant' },
            { id: 'nc15t4', title: 'Kohlrausch\'s law; molar conductivity and its variation' },
            { id: 'nc15t5', title: 'Faraday\'s laws of electrolysis; electroplating' }
          ]
        },
        {
          id: 'nc16', title: 'Chemical Kinetics',
          officialWeightage: '~4% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc16t1', title: 'Rate of reaction; factors affecting rate' },
            { id: 'nc16t2', title: 'Order and molecularity of reactions' },
            { id: 'nc16t3', title: 'Integrated rate laws: zero and first order' },
            { id: 'nc16t4', title: 'Half-life; pseudo first order reactions' },
            { id: 'nc16t5', title: 'Activation energy; Arrhenius equation' }
          ]
        },
        {
          id: 'nc17', title: 'Surface Chemistry',
          officialWeightage: '~2% | ~1 question', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nc17t1', title: 'Adsorption: physisorption vs chemisorption' },
            { id: 'nc17t2', title: 'Catalysis: homogeneous and heterogeneous' },
            { id: 'nc17t3', title: 'Colloids: types, preparation, properties' },
            { id: 'nc17t4', title: 'Tyndall effect, Brownian motion, coagulation' }
          ]
        },
        {
          id: 'nc18', title: 'd and f-Block Elements',
          officialWeightage: '~4% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc18t1', title: 'General properties of transition metals' },
            { id: 'nc18t2', title: 'Compounds: KMnO4, K2Cr2O7 — preparation and uses' },
            { id: 'nc18t3', title: 'Lanthanoids and actinoids' }
          ]
        },
        {
          id: 'nc19', title: 'Coordination Compounds',
          officialWeightage: '~6% | ~2-3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc19t1', title: 'IUPAC nomenclature of coordination compounds' },
            { id: 'nc19t2', title: 'Bonding: Werner\'s theory; VBT; CFT' },
            { id: 'nc19t3', title: 'Isomerism in coordination compounds' },
            { id: 'nc19t4', title: 'Stability constants; chelate effect' },
            { id: 'nc19t5', title: 'Applications: analytical chemistry, medicine (EDTA, Pt-complexes)' }
          ]
        },
        {
          id: 'nc20', title: 'p-Block Elements (Class 12)',
          officialWeightage: '~5% | ~2-3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc20t1', title: 'Group 15: N, P — oxoacids, allotropes' },
            { id: 'nc20t2', title: 'Group 16: O, S — SO2, SO3, H2SO4 (Contact process)' },
            { id: 'nc20t3', title: 'Group 17: Halogens — HX acids, interhalogen compounds' },
            { id: 'nc20t4', title: 'Group 18: Noble gases — properties and uses' }
          ]
        },
        {
          id: 'nc21', title: 'Haloalkanes and Haloarenes',
          officialWeightage: '~4% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc21t1', title: 'Classification and IUPAC nomenclature' },
            { id: 'nc21t2', title: 'Nucleophilic substitution: SN1 and SN2' },
            { id: 'nc21t3', title: 'Elimination reactions: E1 and E2' },
            { id: 'nc21t4', title: 'Optical activity in haloalkanes' }
          ]
        },
        {
          id: 'nc22', title: 'Alcohols, Phenols and Ethers',
          officialWeightage: '~4% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc22t1', title: 'Preparation and properties of alcohols' },
            { id: 'nc22t2', title: 'Acidity of alcohols vs phenols' },
            { id: 'nc22t3', title: 'Reactions: oxidation, esterification, dehydration' },
            { id: 'nc22t4', title: 'Ethers: Williamson synthesis; properties' }
          ]
        },
        {
          id: 'nc23', title: 'Aldehydes, Ketones and Carboxylic Acids',
          officialWeightage: '~5% | ~2-3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc23t1', title: 'Nomenclature and structure of carbonyl compounds' },
            { id: 'nc23t2', title: 'Nucleophilic addition reactions' },
            { id: 'nc23t3', title: 'Aldol condensation; Cannizzaro reaction' },
            { id: 'nc23t4', title: 'Oxidation and reduction of aldehydes and ketones' },
            { id: 'nc23t5', title: 'Carboxylic acids: preparation, acidity, reactions' }
          ]
        },
        {
          id: 'nc24', title: 'Amines',
          officialWeightage: '~4% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc24t1', title: 'Classification and nomenclature of amines' },
            { id: 'nc24t2', title: 'Basicity and factors affecting it' },
            { id: 'nc24t3', title: 'Reactions: alkylation, acylation, Hofmann elimination' },
            { id: 'nc24t4', title: 'Diazonium salts and azo coupling' }
          ]
        },
        {
          id: 'nc25', title: 'Biomolecules',
          officialWeightage: '~4% | ~2 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nc25t1', title: 'Carbohydrates: mono, di, polysaccharides; reducing sugars' },
            { id: 'nc25t2', title: 'Proteins: amino acids; peptide bond; primary to quaternary structure' },
            { id: 'nc25t3', title: 'Enzymes: mechanism, coenzymes' },
            { id: 'nc25t4', title: 'Nucleic acids: DNA and RNA; Watson-Crick model' },
            { id: 'nc25t5', title: 'Vitamins: fat and water soluble; deficiency diseases' }
          ]
        },
        {
          id: 'nc26', title: 'Polymers',
          officialWeightage: '~2% | ~1 question', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nc26t1', title: 'Addition and condensation polymerisation' },
            { id: 'nc26t2', title: 'Natural and synthetic rubber' },
            { id: 'nc26t3', title: 'Common polymers: Nylon, Teflon, PVC, Bakelite' }
          ]
        },
        {
          id: 'nc27', title: 'Chemistry in Everyday Life',
          officialWeightage: '~2% | ~1 question', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nc27t1', title: 'Drugs: analgesics, antibiotics, antacids, antihistamines' },
            { id: 'nc27t2', title: 'Food preservatives; artificial sweeteners' },
            { id: 'nc27t3', title: 'Soaps and detergents' }
          ]
        }
      ]
    },
    {
      id: 'neet_biology',
      name: 'Biology',
      chapters: [
        // ── CLASS 11 BIOLOGY ──
        {
          id: 'nb1', title: 'The Living World',
          officialWeightage: '~2% | ~2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nb1t1', title: 'What is living? Defining life' },
            { id: 'nb1t2', title: 'Biodiversity and its importance' },
            { id: 'nb1t3', title: 'Taxonomic categories: species to kingdom' },
            { id: 'nb1t4', title: 'Taxonomical aids: herbarium, botanical gardens, key' }
          ]
        },
        {
          id: 'nb2', title: 'Biological Classification',
          officialWeightage: '~4% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb2t1', title: 'Five kingdom classification (Whittaker)' },
            { id: 'nb2t2', title: 'Kingdom Monera: bacteria and cyanobacteria' },
            { id: 'nb2t3', title: 'Kingdom Protista: Chrysophytes, Dinoflagellates, Euglenoids, Slime moulds, Protozoans' },
            { id: 'nb2t4', title: 'Kingdom Fungi: Phycomycetes, Ascomycetes, Basidiomycetes, Deuteromycetes' },
            { id: 'nb2t5', title: 'Kingdom Plantae and Animalia (overview)' },
            { id: 'nb2t6', title: 'Viruses, Viroids and Lichens' }
          ]
        },
        {
          id: 'nb3', title: 'Plant Kingdom',
          officialWeightage: '~5% | ~5 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb3t1', title: 'Algae: Chlorophyta, Phaeophyta, Rhodophyta; reproduction' },
            { id: 'nb3t2', title: 'Bryophytes: liverworts, mosses; alternation of generations' },
            { id: 'nb3t3', title: 'Pteridophytes: ferns; vascular tissue' },
            { id: 'nb3t4', title: 'Gymnosperms: conifers; naked seeds' },
            { id: 'nb3t5', title: 'Angiosperms: monocots vs dicots' },
            { id: 'nb3t6', title: 'Plant life cycles and alternation of generations' }
          ]
        },
        {
          id: 'nb4', title: 'Animal Kingdom',
          officialWeightage: '~5% | ~5 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb4t1', title: 'Basis of classification: symmetry, coelom, segmentation' },
            { id: 'nb4t2', title: 'Non-chordates: Porifera, Coelenterata, Platyhelminthes, Nematoda' },
            { id: 'nb4t3', title: 'Annelida, Arthropoda, Mollusca, Echinodermata, Hemichordata' },
            { id: 'nb4t4', title: 'Chordates: Urochordata, Cephalochordata, Vertebrata' },
            { id: 'nb4t5', title: 'Class Pisces, Amphibia, Reptilia, Aves, Mammalia' }
          ]
        },
        {
          id: 'nb5', title: 'Morphology of Flowering Plants',
          officialWeightage: '~3% | ~3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb5t1', title: 'Root: regions, types, modifications' },
            { id: 'nb5t2', title: 'Stem: modifications (rhizome, bulb, corm, tendril)' },
            { id: 'nb5t3', title: 'Leaf: venation, types, modifications' },
            { id: 'nb5t4', title: 'Flower: parts, aestivation, placentation' },
            { id: 'nb5t5', title: 'Fruits: types; seeds: monocot vs dicot' },
            { id: 'nb5t6', title: 'Families: Fabaceae, Solanaceae, Liliaceae' }
          ]
        },
        {
          id: 'nb6', title: 'Anatomy of Flowering Plants',
          officialWeightage: '~2% | ~2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nb6t1', title: 'Tissue system: epidermal, vascular, ground' },
            { id: 'nb6t2', title: 'Anatomy of dicot root, monocot root' },
            { id: 'nb6t3', title: 'Anatomy of dicot stem, monocot stem' },
            { id: 'nb6t4', title: 'Anatomy of dicot leaf, monocot leaf' },
            { id: 'nb6t5', title: 'Secondary growth in dicot root and stem' }
          ]
        },
        {
          id: 'nb7', title: 'Structural Organisation in Animals',
          officialWeightage: '~2% | ~2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nb7t1', title: 'Animal tissues: epithelial, connective, muscular, neural' },
            { id: 'nb7t2', title: 'Morphology of cockroach: digestive, circulatory, reproductive' }
          ]
        },
        {
          id: 'nb8', title: 'Cell — The Unit of Life',
          officialWeightage: '~5% | ~5 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb8t1', title: 'Prokaryotic vs eukaryotic cell' },
            { id: 'nb8t2', title: 'Cell membrane: fluid mosaic model' },
            { id: 'nb8t3', title: 'Cell wall; endomembrane system' },
            { id: 'nb8t4', title: 'Mitochondria: structure and function' },
            { id: 'nb8t5', title: 'Plastids: chloroplast, chromoplast, leucoplast' },
            { id: 'nb8t6', title: 'Ribosomes, centrosome, cilia, flagella' },
            { id: 'nb8t7', title: 'Nucleus: nuclear envelope, nucleolus, chromatin' }
          ]
        },
        {
          id: 'nb9', title: 'Biomolecules',
          officialWeightage: '~3% | ~3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb9t1', title: 'Chemical constituents of living cells' },
            { id: 'nb9t2', title: 'Carbohydrates: structure and functions' },
            { id: 'nb9t3', title: 'Proteins: amino acids, peptide bond, levels of structure' },
            { id: 'nb9t4', title: 'Lipids: fatty acids, triglycerides, phospholipids' },
            { id: 'nb9t5', title: 'Enzymes: properties, enzyme-substrate complex, inhibition' }
          ]
        },
        {
          id: 'nb10', title: 'Cell Cycle and Cell Division',
          officialWeightage: '~4% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb10t1', title: 'Cell cycle: G1, S, G2, M phases' },
            { id: 'nb10t2', title: 'Mitosis: prophase, metaphase, anaphase, telophase' },
            { id: 'nb10t3', title: 'Meiosis I and Meiosis II: stages and significance' },
            { id: 'nb10t4', title: 'Significance of mitosis and meiosis' }
          ]
        },
        {
          id: 'nb11', title: 'Transport in Plants',
          officialWeightage: '~2% | ~2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nb11t1', title: 'Means of transport: diffusion, osmosis, active transport' },
            { id: 'nb11t2', title: 'Water potential; plasmolysis' },
            { id: 'nb11t3', title: 'Uptake and translocation of minerals' },
            { id: 'nb11t4', title: 'Phloem transport: pressure flow hypothesis' }
          ]
        },
        {
          id: 'nb12', title: 'Mineral Nutrition',
          officialWeightage: '~2% | ~2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nb12t1', title: 'Essential minerals: macro and micronutrients' },
            { id: 'nb12t2', title: 'Deficiency symptoms' },
            { id: 'nb12t3', title: 'Nitrogen metabolism: biological fixation' }
          ]
        },
        {
          id: 'nb13', title: 'Photosynthesis in Higher Plants',
          officialWeightage: '~5% | ~5 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb13t1', title: 'Site of photosynthesis: chloroplast structure' },
            { id: 'nb13t2', title: 'Light reactions: photosystems I and II; Z-scheme' },
            { id: 'nb13t3', title: 'Cyclic and non-cyclic photophosphorylation' },
            { id: 'nb13t4', title: 'Calvin cycle (C3 pathway): CO2 fixation' },
            { id: 'nb13t5', title: 'C4 pathway (Hatch-Slack); Kranz anatomy' },
            { id: 'nb13t6', title: 'CAM plants; factors affecting photosynthesis' }
          ]
        },
        {
          id: 'nb14', title: 'Respiration in Plants',
          officialWeightage: '~3% | ~3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb14t1', title: 'Glycolysis (Embden-Meyerhof Pathway)' },
            { id: 'nb14t2', title: 'Fermentation: anaerobic respiration' },
            { id: 'nb14t3', title: 'Aerobic respiration: Krebs cycle' },
            { id: 'nb14t4', title: 'Electron transport chain and oxidative phosphorylation' },
            { id: 'nb14t5', title: 'Respiratory quotient (RQ); energy calculations' }
          ]
        },
        {
          id: 'nb15', title: 'Plant Growth and Development',
          officialWeightage: '~2% | ~2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nb15t1', title: 'Growth: arithmetic and geometric; phases' },
            { id: 'nb15t2', title: 'Plant growth regulators: auxin, gibberellin, cytokinin, ABA, ethylene' },
            { id: 'nb15t3', title: 'Photoperiodism and vernalisation' }
          ]
        },
        {
          id: 'nb16', title: 'Digestion and Absorption',
          officialWeightage: '~4% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb16t1', title: 'Human digestive system: organs and their functions' },
            { id: 'nb16t2', title: 'Digestion of carbohydrates, proteins, fats' },
            { id: 'nb16t3', title: 'Absorption of nutrients in small intestine' },
            { id: 'nb16t4', title: 'Disorders: PEM, indigestion, constipation, vomiting, jaundice' }
          ]
        },
        {
          id: 'nb17', title: 'Breathing and Exchange of Gases',
          officialWeightage: '~3% | ~3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb17t1', title: 'Respiratory organs in different animals' },
            { id: 'nb17t2', title: 'Human respiratory system: mechanism of breathing' },
            { id: 'nb17t3', title: 'Exchange of gases; transport of O2 (oxyhaemoglobin); CO2' },
            { id: 'nb17t4', title: 'Respiratory volumes and capacities' },
            { id: 'nb17t5', title: 'Respiratory disorders: asthma, emphysema, occupational' }
          ]
        },
        {
          id: 'nb18', title: 'Body Fluids and Circulation',
          officialWeightage: '~4% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb18t1', title: 'Blood: composition, plasma, blood groups (ABO, Rh)' },
            { id: 'nb18t2', title: 'Coagulation of blood' },
            { id: 'nb18t3', title: 'Human circulatory system: heart structure and chambers' },
            { id: 'nb18t4', title: 'Cardiac cycle: systole, diastole; ECG' },
            { id: 'nb18t5', title: 'Double circulation; cardiac output' },
            { id: 'nb18t6', title: 'Disorders: hypertension, coronary artery disease, heart failure' }
          ]
        },
        {
          id: 'nb19', title: 'Excretory Products and Their Elimination',
          officialWeightage: '~4% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb19t1', title: 'Modes of excretion: ammonotelism, ureotelism, uricotelism' },
            { id: 'nb19t2', title: 'Human excretory system: nephron structure' },
            { id: 'nb19t3', title: 'Urine formation: glomerular filtration, tubular reabsorption, secretion' },
            { id: 'nb19t4', title: 'Role of ADH, aldosterone; counter current mechanism' },
            { id: 'nb19t5', title: 'Dialysis; kidney transplant' }
          ]
        },
        {
          id: 'nb20', title: 'Locomotion and Movement',
          officialWeightage: '~2% | ~2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nb20t1', title: 'Types of movement: ciliary, flagellar, muscular' },
            { id: 'nb20t2', title: 'Skeletal muscle: structure and contraction (sliding filament theory)' },
            { id: 'nb20t3', title: 'Human skeleton: axial and appendicular' },
            { id: 'nb20t4', title: 'Types of joints; disorders: arthritis, osteoporosis' }
          ]
        },
        {
          id: 'nb21', title: 'Neural Control and Coordination',
          officialWeightage: '~4% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb21t1', title: 'Neuron: structure and types' },
            { id: 'nb21t2', title: 'Resting potential and action potential' },
            { id: 'nb21t3', title: 'Synapse: chemical transmission; neurotransmitters' },
            { id: 'nb21t4', title: 'CNS: brain (forebrain, midbrain, hindbrain) and spinal cord' },
            { id: 'nb21t5', title: 'Reflex action and reflex arc' },
            { id: 'nb21t6', title: 'Special sense organs: eye and ear' }
          ]
        },
        {
          id: 'nb22', title: 'Chemical Coordination and Integration',
          officialWeightage: '~4% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb22t1', title: 'Endocrine glands: pituitary, thyroid, parathyroid, adrenal' },
            { id: 'nb22t2', title: 'Pancreas: insulin and glucagon' },
            { id: 'nb22t3', title: 'Gonads: testicular and ovarian hormones' },
            { id: 'nb22t4', title: 'Mechanism of hormone action: protein vs steroid hormones' },
            { id: 'nb22t5', title: 'Disorders: diabetes, dwarfism, acromegaly, thyroid diseases' }
          ]
        },
        // ── CLASS 12 BIOLOGY ──
        {
          id: 'nb23', title: 'Reproduction in Organisms',
          officialWeightage: '~2% | ~2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nb23t1', title: 'Asexual reproduction: binary fission, budding, fragmentation, spores' },
            { id: 'nb23t2', title: 'Sexual reproduction: pre-fertilisation, fertilisation, post-fertilisation events' }
          ]
        },
        {
          id: 'nb24', title: 'Sexual Reproduction in Flowering Plants',
          officialWeightage: '~5% | ~5 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb24t1', title: 'Flower structure: male and female reproductive parts' },
            { id: 'nb24t2', title: 'Microsporogenesis and microgametogenesis' },
            { id: 'nb24t3', title: 'Megasporogenesis; embryo sac (female gametophyte)' },
            { id: 'nb24t4', title: 'Pollination: types and agents' },
            { id: 'nb24t5', title: 'Double fertilisation; endosperm development' },
            { id: 'nb24t6', title: 'Apomixis and polyembryony' }
          ]
        },
        {
          id: 'nb25', title: 'Human Reproduction',
          officialWeightage: '~5% | ~5 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb25t1', title: 'Male reproductive system: structure and function' },
            { id: 'nb25t2', title: 'Female reproductive system: structure and function' },
            { id: 'nb25t3', title: 'Gametogenesis: spermatogenesis and oogenesis' },
            { id: 'nb25t4', title: 'Menstrual cycle: phases and hormonal control' },
            { id: 'nb25t5', title: 'Fertilisation; embryonic development up to implantation' },
            { id: 'nb25t6', title: 'Pregnancy and parturition; lactation' }
          ]
        },
        {
          id: 'nb26', title: 'Reproductive Health',
          officialWeightage: '~2% | ~2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nb26t1', title: 'Contraceptive methods: natural, barrier, IUDs, hormonal, surgical' },
            { id: 'nb26t2', title: 'ART: IVF, GIFT, ICSI, ET' },
            { id: 'nb26t3', title: 'Sexually transmitted infections (STIs): AIDS, gonorrhoea, syphilis' }
          ]
        },
        {
          id: 'nb27', title: 'Principles of Inheritance and Variation',
          officialWeightage: '~7% | ~7 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb27t1', title: 'Mendel\'s laws of inheritance: monohybrid and dihybrid crosses' },
            { id: 'nb27t2', title: 'Deviations: dominance, co-dominance, incomplete dominance' },
            { id: 'nb27t3', title: 'Multiple alleles: ABO blood group; Rh factor' },
            { id: 'nb27t4', title: 'Chromosomal theory of inheritance; linkage and crossing over' },
            { id: 'nb27t5', title: 'Sex determination: XY, ZW systems' },
            { id: 'nb27t6', title: 'Sex-linked inheritance: haemophilia, colour blindness' },
            { id: 'nb27t7', title: 'Mutation: chromosomal and gene mutations' },
            { id: 'nb27t8', title: 'Genetic disorders: Down\'s, Turner\'s, Klinefelter\'s syndrome; sickle cell anaemia' }
          ]
        },
        {
          id: 'nb28', title: 'Molecular Basis of Inheritance',
          officialWeightage: '~8% | ~8 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb28t1', title: 'DNA as genetic material: Avery, Hershey-Chase experiments' },
            { id: 'nb28t2', title: 'DNA structure: double helix (Watson-Crick model)' },
            { id: 'nb28t3', title: 'DNA packaging; nucleosome model' },
            { id: 'nb28t4', title: 'DNA replication: semi-conservative; Meselson-Stahl experiment' },
            { id: 'nb28t5', title: 'Transcription: template strand, mRNA synthesis; promoter, terminator' },
            { id: 'nb28t6', title: 'Genetic code: triplet codons; degeneracy; non-overlapping' },
            { id: 'nb28t7', title: 'Translation: initiation, elongation, termination; ribosomes' },
            { id: 'nb28t8', title: 'Regulation of gene expression: lac operon model' },
            { id: 'nb28t9', title: 'Human Genome Project: features and applications' },
            { id: 'nb28t10', title: 'DNA fingerprinting: VNTR; applications' }
          ]
        },
        {
          id: 'nb29', title: 'Evolution',
          officialWeightage: '~4% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb29t1', title: 'Origin of life: Oparin-Haldane hypothesis; Miller-Urey experiment' },
            { id: 'nb29t2', title: 'Evidence of evolution: fossil record, comparative anatomy, embryology' },
            { id: 'nb29t3', title: 'Darwin\'s theory: natural selection' },
            { id: 'nb29t4', title: 'Modern synthesis: Hardy-Weinberg principle' },
            { id: 'nb29t5', title: 'Adaptive radiation; speciation (allopatric, sympatric)' },
            { id: 'nb29t6', title: 'Human evolution: Homo habilis to Homo sapiens' }
          ]
        },
        {
          id: 'nb30', title: 'Human Health and Disease',
          officialWeightage: '~4% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb30t1', title: 'Pathogens: bacteria (typhoid, pneumonia), viruses (HIV, dengue)' },
            { id: 'nb30t2', title: 'Plasmodium: malaria life cycle; symptoms' },
            { id: 'nb30t3', title: 'Immunity: innate and adaptive (humoral and cell-mediated)' },
            { id: 'nb30t4', title: 'Vaccination; antibody structure' },
            { id: 'nb30t5', title: 'Allergies; autoimmune diseases' },
            { id: 'nb30t6', title: 'Cancer: types, causes, detection, treatment' },
            { id: 'nb30t7', title: 'Drugs of abuse: opioids, cannabinoids, cocaine; effects' }
          ]
        },
        {
          id: 'nb31', title: 'Microbes in Human Welfare',
          officialWeightage: '~2% | ~2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nb31t1', title: 'Microbes in household products: curd, bread, idli, dosa' },
            { id: 'nb31t2', title: 'Microbes in industrial products: antibiotics, enzymes, bioactive molecules' },
            { id: 'nb31t3', title: 'Microbes in sewage treatment: primary and secondary treatment' },
            { id: 'nb31t4', title: 'Microbes as biofertilisers: Rhizobium, Azolla, mycorrhiza' }
          ]
        },
        {
          id: 'nb32', title: 'Biotechnology — Principles and Processes',
          officialWeightage: '~4% | ~4 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb32t1', title: 'Principles of recombinant DNA technology' },
            { id: 'nb32t2', title: 'Tools: restriction enzymes, vectors, host organisms' },
            { id: 'nb32t3', title: 'PCR: polymerase chain reaction steps' },
            { id: 'nb32t4', title: 'Gel electrophoresis' },
            { id: 'nb32t5', title: 'Gene cloning and transformation' }
          ]
        },
        {
          id: 'nb33', title: 'Biotechnology and its Applications',
          officialWeightage: '~3% | ~3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb33t1', title: 'Genetically modified organisms (GMOs): Bt cotton, Bt brinjal' },
            { id: 'nb33t2', title: 'Gene therapy: ADA deficiency' },
            { id: 'nb33t3', title: 'Molecular diagnosis: ELISA, PCR' },
            { id: 'nb33t4', title: 'Transgenic animals; ethical issues in biotechnology' }
          ]
        },
        {
          id: 'nb34', title: 'Organisms and Populations',
          officialWeightage: '~3% | ~3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb34t1', title: 'Organism and its environment: abiotic factors' },
            { id: 'nb34t2', title: 'Adaptations: thermoregulation, osmoregulation' },
            { id: 'nb34t3', title: 'Population attributes: birth rate, death rate, age pyramid' },
            { id: 'nb34t4', title: 'Population growth: logistic curve (S-curve)' },
            { id: 'nb34t5', title: 'Population interactions: mutualism, competition, predation, parasitism, commensalism' }
          ]
        },
        {
          id: 'nb35', title: 'Ecosystem',
          officialWeightage: '~3% | ~3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb35t1', title: 'Components of ecosystem: biotic and abiotic' },
            { id: 'nb35t2', title: 'Productivity: GPP, NPP' },
            { id: 'nb35t3', title: 'Decomposition: steps and significance' },
            { id: 'nb35t4', title: 'Food chains, food webs; trophic levels' },
            { id: 'nb35t5', title: 'Ecological pyramids: numbers, biomass, energy' },
            { id: 'nb35t6', title: 'Nutrient cycling: carbon cycle, phosphorus cycle' },
            { id: 'nb35t7', title: 'Ecological succession: primary and secondary' }
          ]
        },
        {
          id: 'nb36', title: 'Biodiversity and Conservation',
          officialWeightage: '~3% | ~3 questions', pyqPriority: 'HIGH',
          topics: [
            { id: 'nb36t1', title: 'Biodiversity: genetic, species, ecological' },
            { id: 'nb36t2', title: 'Patterns of biodiversity: latitudinal gradients' },
            { id: 'nb36t3', title: 'Loss of biodiversity: HIPPO factors' },
            { id: 'nb36t4', title: 'In-situ conservation: biosphere reserves, national parks, wildlife sanctuaries' },
            { id: 'nb36t5', title: 'Ex-situ conservation: seed banks, botanical gardens, cryopreservation' }
          ]
        },
        {
          id: 'nb37', title: 'Environmental Issues',
          officialWeightage: '~2% | ~2 questions', pyqPriority: 'MEDIUM',
          topics: [
            { id: 'nb37t1', title: 'Air pollution: pollutants, acid rain, smog' },
            { id: 'nb37t2', title: 'Water pollution: eutrophication, BOD' },
            { id: 'nb37t3', title: 'Solid waste management; e-waste' },
            { id: 'nb37t4', title: 'Ozone depletion: CFCs; UV-B effects' },
            { id: 'nb37t5', title: 'Global warming and greenhouse effect; greenhouse gases' }
          ]
        }
      ]
    }
  ]
};
