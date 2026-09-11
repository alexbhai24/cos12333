import { SyllabusData } from '../types/syllabus';
import { syllabusJEE } from './syllabusJEE';

// JEE Advanced | Session 2026
// Source: jeeadv.ac.in
// Note: JEE Advanced syllabus covers JEE Main topics but in deeper detail, plus a few extra topics.
// We are mapping the specific JEE Advanced chapter structure based on the official IIT joint entrance syllabus.

export const syllabusJEEAdv: SyllabusData = {
  id: 'jee_adv',
  examOrBoard: 'JEE Advanced',
  category: 'Special',
  classGrade: 'N/A',
  academicSession: '2026',
  sourceUrl: 'https://jeeadv.ac.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'jeea_phy',
      name: 'Physics',
      chapters: [
        { id: 'jap1', title: 'General Physics', officialWeightage: 'PYQ Trend (8-10%)', pyqPriority: 'HIGH', topics: [{ id: 'jap1t1', title: 'Units and Dimensions, Dimensional Analysis, Least count, Significant figures, Methods of measurement and error analysis, Experiments (Vernier calipers, screw gauge, etc.)' }] },
        { id: 'jap2', title: 'Mechanics', officialWeightage: 'PYQ Trend (30-35%)', pyqPriority: 'HIGH', topics: [{ id: 'jap2t1', title: 'Kinematics in 1D and 2D, Projectiles, Circular Motion, Newton\'s Laws, Friction, Work, Power, Energy, Center of Mass, Collisions, Rigid Body Dynamics, Moment of Inertia, Gravitation, Fluid Mechanics, Surface Tension' }] },
        { id: 'jap3', title: 'Thermal Physics', officialWeightage: 'PYQ Trend (10-12%)', pyqPriority: 'HIGH', topics: [{ id: 'jap3t1', title: 'Thermal Expansion, Calorimetry, Heat Transfer (Conduction, Convection, Radiation), Newton\'s law of cooling, Kinetic Theory of Gases, Thermodynamics (First and Second Law, Carnot cycle)' }] },
        { id: 'jap4', title: 'Electricity and Magnetism', officialWeightage: 'PYQ Trend (25-30%)', pyqPriority: 'HIGH', topics: [{ id: 'jap4t1', title: 'Electrostatics (Coulomb\'s Law, Gauss\'s Law, Capacitance), Current Electricity (Kirchhoff\'s laws, RC circuits), Magnetic effects of current, Biot-Savart, Ampere\'s Law, Electromagnetic Induction (Faraday\'s Law, Lenz\'s Law), AC Circuits' }] },
        { id: 'jap5', title: 'Electromagnetic Waves', officialWeightage: 'PYQ Trend (2-5%)', pyqPriority: 'MEDIUM', topics: [{ id: 'jap5t1', title: 'Electromagnetic spectrum, properties of EM waves' }] },
        { id: 'jap6', title: 'Optics', officialWeightage: 'PYQ Trend (10-12%)', pyqPriority: 'HIGH', topics: [{ id: 'jap6t1', title: 'Geometrical Optics (Reflection, Refraction, TIR, Prisms, Lenses, Mirrors, Optical Instruments), Wave Optics (Huygens\' Principle, Young\'s Double Slit, Diffraction, Polarization)' }] },
        { id: 'jap7', title: 'Modern Physics', officialWeightage: 'PYQ Trend (10-12%)', pyqPriority: 'HIGH', topics: [{ id: 'jap7t1', title: 'Photoelectric effect, Bohr\'s model, X-rays, Matter waves, Atomic nucleus, Radioactivity, Mass defect, Binding energy, Fission and Fusion' }] }
      ]
    },
    {
      id: 'jeea_chem',
      name: 'Chemistry',
      chapters: [
        { id: 'jac1', title: 'Physical Chemistry', officialWeightage: 'PYQ Trend (30-35%)', pyqPriority: 'HIGH', topics: [
          { id: 'jac1t1', title: 'General topics: Concept of atoms and molecules, Mole concept, Concentration terms' },
          { id: 'jac1t2', title: 'Gaseous and liquid states: Gas laws, Ideal gas equation, Kinetic theory' },
          { id: 'jac1t3', title: 'Atomic structure: Bohr model, Quantum mechanical model, Orbitals, Quantum numbers' },
          { id: 'jac1t4', title: 'Chemical bonding: Ionic/covalent bond, VSEPR, VBT, MOT, Hydrogen bond' },
          { id: 'jac1t5', title: 'Energetics: First law, Hess\'s Law, Entropy, Free energy' },
          { id: 'jac1t6', title: 'Chemical equilibrium: Law of mass action, Le Chatelier\'s principle, Ionic equilibrium (pH, buffers, solubility product)' },
          { id: 'jac1t7', title: 'Electrochemistry: Nernst equation, Faraday\'s laws, Kohlrausch\'s law' },
          { id: 'jac1t8', title: 'Chemical kinetics: Rates, Order, Activation energy, Arrhenius equation' },
          { id: 'jac1t9', title: 'Solid state: Classification, Crystal lattices, Unit cells, Imperfections (Note: check specific inclusion year by year)' },
          { id: 'jac1t10', title: 'Solutions: Raoult\'s law, Colligative properties' },
          { id: 'jac1t11', title: 'Surface chemistry: Adsorption, Colloids' }
        ]},
        { id: 'jac2', title: 'Inorganic Chemistry', officialWeightage: 'PYQ Trend (30-35%)', pyqPriority: 'HIGH', topics: [
          { id: 'jac2t1', title: 'Isolation/preparation and properties of non-metals: B, C, N, O, P, S, halogens, noble gases' },
          { id: 'jac2t2', title: 'Preparation and properties of compounds: Oxides, peroxides, hydroxides, carbonates of s-block' },
          { id: 'jac2t3', title: 'Transition elements (3d series): Properties, Coordination compounds, Werner\'s theory, CFT, Isomerism' },
          { id: 'jac2t4', title: 'Ores and minerals: Extractive metallurgy' },
          { id: 'jac2t5', title: 'Principles of qualitative analysis: Cation and Anion analysis' }
        ]},
        { id: 'jac3', title: 'Organic Chemistry', officialWeightage: 'PYQ Trend (30-35%)', pyqPriority: 'HIGH', topics: [
          { id: 'jac3t1', title: 'Concepts: Hybridisation, Inductive/Mesomeric effects, Hyperconjugation, Isomerism (Structural and Stereo)' },
          { id: 'jac3t2', title: 'Preparation and properties: Alkanes, Alkenes, Alkynes' },
          { id: 'jac3t3', title: 'Reactions of Benzene: Electrophilic substitution' },
          { id: 'jac3t4', title: 'Haloalkanes, Haloarenes, Alcohols, Phenols, Ethers' },
          { id: 'jac3t5', title: 'Aldehydes, Ketones, Carboxylic acids and their derivatives' },
          { id: 'jac3t6', title: 'Amines, Diazonium salts' },
          { id: 'jac3t7', title: 'Carbohydrates, Amino acids and Peptides' },
          { id: 'jac3t8', title: 'Polymers (check latest inclusion)' },
          { id: 'jac3t9', title: 'Practical organic chemistry (Detection of elements and functional groups)' }
        ]}
      ]
    },
    {
      id: 'jeea_math',
      name: 'Mathematics',
      chapters: [
        { id: 'jam1', title: 'Algebra', officialWeightage: 'PYQ Trend (30-35%)', pyqPriority: 'HIGH', topics: [
          { id: 'jam1t1', title: 'Complex numbers: Algebra, Argand diagram, Roots of unity, Triangle inequality' },
          { id: 'jam1t2', title: 'Quadratic equations: Roots, Relation between roots and coefficients' },
          { id: 'jam1t3', title: 'Logarithms' },
          { id: 'jam1t4', title: 'Permutations and combinations' },
          { id: 'jam1t5', title: 'Binomial theorem' },
          { id: 'jam1t6', title: 'Sequences and series: AP, GP, HP, AGP' },
          { id: 'jam1t7', title: 'Matrices and Determinants: Properties, Inverse, System of linear equations' },
          { id: 'jam1t8', title: 'Probability: Conditional probability, Bayes\' theorem, Independence' }
        ]},
        { id: 'jam2', title: 'Trigonometry', officialWeightage: 'PYQ Trend (5-10%)', pyqPriority: 'HIGH', topics: [
          { id: 'jam2t1', title: 'Trigonometric functions, Identities, Equations' },
          { id: 'jam2t2', title: 'Inverse trigonometric functions' },
          { id: 'jam2t3', title: 'Properties of triangles, Heights and distances' }
        ]},
        { id: 'jam3', title: 'Analytical Geometry', officialWeightage: 'PYQ Trend (20-25%)', pyqPriority: 'HIGH', topics: [
          { id: 'jam3t1', title: '2D Geometry: Cartesian coordinates, Straight lines, Circles, Parabola, Ellipse, Hyperbola' },
          { id: 'jam3t2', title: '3D Geometry: Direction cosines, Equations of lines and planes, Skew lines' }
        ]},
        { id: 'jam4', title: 'Differential Calculus', officialWeightage: 'PYQ Trend (20-25%)', pyqPriority: 'HIGH', topics: [
          { id: 'jam4t1', title: 'Functions, Limits, Continuity, Differentiability' },
          { id: 'jam4t2', title: 'Derivatives: Chain rule, Implicit functions' },
          { id: 'jam4t3', title: 'Applications of derivatives: Tangents, Normals, Maxima, Minima, Monotonicity, Rolle\'s Theorem, Mean Value Theorem' }
        ]},
        { id: 'jam5', title: 'Integral Calculus', officialWeightage: 'PYQ Trend (15-20%)', pyqPriority: 'HIGH', topics: [
          { id: 'jam5t1', title: 'Indefinite integrals, Definite integrals and their properties' },
          { id: 'jam5t2', title: 'Application of integrals: Area under curves' },
          { id: 'jam5t3', title: 'Differential equations: Formation, First order and first degree, Linear differential equations' }
        ]},
        { id: 'jam6', title: 'Vectors', officialWeightage: 'PYQ Trend (5-10%)', pyqPriority: 'HIGH', topics: [
          { id: 'jam6t1', title: 'Addition of vectors, Scalar multiplication, Dot and Cross products, Scalar triple product and vector triple product' }
        ]}
      ]
    }
  ]
};
