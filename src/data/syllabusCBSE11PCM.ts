import { SyllabusData } from '../types/syllabus';
import { syllabusCBSE11PCB } from './syllabusCBSE11PCB';

// CBSE Class 11 PCM (Science) | Session 2026-27
// Official source: cbseacademic.nic.in
// Includes: Physics, Chemistry, Mathematics, English Core
// Note: Physics, Chemistry, and English are shared with PCB.

export const syllabusCBSE11PCM: SyllabusData = {
  id: 'cbse_11_pcm',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://cbseacademic.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    syllabusCBSE11PCB.subjects.find(s => s.id === 'cbse11_phy')!,
    syllabusCBSE11PCB.subjects.find(s => s.id === 'cbse11_chem')!,
    {
      id: 'cbse11_math',
      name: 'Mathematics',
      chapters: [
        // Unit I: Sets and Functions (23 Marks)
        { id: 'c11m1', title: 'Sets', officialWeightage: 'Unit I (23 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m1t1', title: 'Sets and their representations, Empty set, Finite and Infinite sets, Equal sets' },
          { id: 'c11m1t2', title: 'Subsets, Subsets of a set of real numbers especially intervals, Power set, Universal set' },
          { id: 'c11m1t3', title: 'Venn diagrams, Union and Intersection of sets, Difference of sets, Complement of a set' }
        ]},
        { id: 'c11m2', title: 'Relations and Functions', officialWeightage: 'Unit I (23 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m2t1', title: 'Ordered pairs, Cartesian product of sets' },
          { id: 'c11m2t2', title: 'Relations, Domain, co-domain and range of a relation' },
          { id: 'c11m2t3', title: 'Function as a special type of relation; domain, co-domain and range' },
          { id: 'c11m2t4', title: 'Real valued functions, domain and range, constant, identity, polynomial, rational, modulus, signum, exponential, logarithmic and greatest integer functions, with their graphs' },
          { id: 'c11m2t5', title: 'Algebra of real functions' }
        ]},
        { id: 'c11m3', title: 'Trigonometric Functions', officialWeightage: 'Unit I (23 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m3t1', title: 'Positive and negative angles, measuring angles in radians and in degrees' },
          { id: 'c11m3t2', title: 'Definition of trigonometric functions with the help of unit circle' },
          { id: 'c11m3t3', title: 'Signs of trigonometric functions, domain and range, graphs' },
          { id: 'c11m3t4', title: 'Trigonometric identities and formulas (sum and difference of two angles, multiple angles, submultiple angles)' }
        ]},
        // Unit II: Algebra (25 Marks)
        { id: 'c11m4', title: 'Complex Numbers and Quadratic Equations', officialWeightage: 'Unit II (25 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m4t1', title: 'Need for complex numbers, especially √-1' },
          { id: 'c11m4t2', title: 'Algebraic properties of complex numbers' },
          { id: 'c11m4t3', title: 'Argand plane' }
        ]},
        { id: 'c11m5', title: 'Linear Inequalities', officialWeightage: 'Unit II (25 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11m5t1', title: 'Linear inequalities, algebraic solutions of linear inequalities in one variable and their representation on the number line' }
        ]},
        { id: 'c11m6', title: 'Permutations and Combinations', officialWeightage: 'Unit II (25 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m6t1', title: 'Fundamental principle of counting' },
          { id: 'c11m6t2', title: 'Factorial n (n!), Permutations and combinations, derivation of formulae for nPr and nCr and their connections, simple applications' }
        ]},
        { id: 'c11m7', title: 'Binomial Theorem', officialWeightage: 'Unit II (25 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m7t1', title: 'Historical perspective, statement and proof of the binomial theorem for positive integral indices' },
          { id: 'c11m7t2', title: 'Pascal\'s triangle, simple applications' }
        ]},
        { id: 'c11m8', title: 'Sequence and Series', officialWeightage: 'Unit II (25 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m8t1', title: 'Sequence and Series' },
          { id: 'c11m8t2', title: 'Arithmetic Progression (A.P.), Arithmetic Mean (A.M.)' },
          { id: 'c11m8t3', title: 'Geometric Progression (G.P.), general term of a G.P., sum of n terms of a G.P., infinite G.P. and its sum' },
          { id: 'c11m8t4', title: 'Geometric mean (G.M.), relation between A.M. and G.M.' }
        ]},
        // Unit III: Coordinate Geometry (12 Marks)
        { id: 'c11m9', title: 'Straight Lines', officialWeightage: 'Unit III (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m9t1', title: 'Brief recall of two dimensional geometry from earlier classes' },
          { id: 'c11m9t2', title: 'Slope of a line and angle between two lines' },
          { id: 'c11m9t3', title: 'Various forms of equations of a line: parallel to axis, point-slope form, slope-intercept form, two-point form, intercept form, normal form' },
          { id: 'c11m9t4', title: 'General equation of a line, Distance of a point from a line' }
        ]},
        { id: 'c11m10', title: 'Conic Sections', officialWeightage: 'Unit III (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m10t1', title: 'Sections of a cone: circles, ellipse, parabola, hyperbola, a point, a straight line and a pair of intersecting lines as a degenerated case of a conic section' },
          { id: 'c11m10t2', title: 'Standard equations and simple properties of parabola, ellipse and hyperbola' },
          { id: 'c11m10t3', title: 'Standard equation of a circle' }
        ]},
        { id: 'c11m11', title: 'Introduction to Three-dimensional Geometry', officialWeightage: 'Unit III (12 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11m11t1', title: 'Coordinate axes and coordinate planes in three dimensions' },
          { id: 'c11m11t2', title: 'Coordinates of a point, Distance between two points' }
        ]},
        // Unit IV: Calculus (8 Marks)
        { id: 'c11m12', title: 'Limits and Derivatives', officialWeightage: 'Unit IV (8 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m12t1', title: 'Derivative introduced as rate of change both as that of distance function and geometrically' },
          { id: 'c11m12t2', title: 'Intuitive idea of limit' },
          { id: 'c11m12t3', title: 'Limits of polynomials and rational functions, trigonometric, exponential and logarithmic functions' },
          { id: 'c11m12t4', title: 'Definition of derivative relate it to slope of tangent of the curve, derivative of sum, difference, product and quotient of functions' },
          { id: 'c11m12t5', title: 'Derivatives of polynomial and trigonometric functions' }
        ]},
        // Unit V: Statistics and Probability (12 Marks)
        { id: 'c11m13', title: 'Statistics', officialWeightage: 'Unit V (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m13t1', title: 'Measures of Dispersion: Range, Mean deviation, variance and standard deviation of ungrouped/grouped data' }
        ]},
        { id: 'c11m14', title: 'Probability', officialWeightage: 'Unit V (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11m14t1', title: 'Random experiments; outcomes, sample spaces (set representation)' },
          { id: 'c11m14t2', title: 'Events; occurrence of events, \'not\', \'and\' and \'or\' events, exhaustive events, mutually exclusive events' },
          { id: 'c11m14t3', title: 'Axiomatic (set theoretic) probability, connections with other theories of earlier classes' },
          { id: 'c11m14t4', title: 'Probability of an event, probability of \'not\', \'and\' and \'or\' events' }
        ]}
      ]
    },
    syllabusCBSE11PCB.subjects.find(s => s.id === 'cbse11_eng')!
  ]
};
