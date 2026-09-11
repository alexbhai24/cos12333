import { SyllabusData } from '../types/syllabus';

// ICSE Class 7 | Session 2026-27
// Source: cisce.org (Curriculum for Preschool to Class VIII)

export const syllabusICSE7: SyllabusData = {
  id: 'icse_7',
  examOrBoard: 'ICSE',
  category: 'School',
  classGrade: 'Class 7',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'icse7_math',
      name: 'Mathematics',
      chapters: [
        { id: 'i7m1', title: 'Number System', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7m1t1', title: 'Integers, Fractions, Decimals, Rational Numbers, Exponents' }] },
        { id: 'i7m2', title: 'Ratio and Proportion', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7m2t1', title: 'Ratio, Proportion, Unitary Method, Percentage and its applications' }] },
        { id: 'i7m3', title: 'Algebra', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7m3t1', title: 'Algebraic Expressions, Linear Equations in one variable' }] },
        { id: 'i7m4', title: 'Geometry', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7m4t1', title: 'Lines and Angles, Triangles, Congruence of Triangles, Practical Geometry' }] },
        { id: 'i7m5', title: 'Mensuration', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7m5t1', title: 'Perimeter and Area of 2D shapes' }] },
        { id: 'i7m6', title: 'Data Handling', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i7m6t1', title: 'Mean, Median, Mode, Bar Graphs, Probability' }] }
      ]
    },
    {
      id: 'icse7_phy',
      name: 'Physics',
      chapters: [
        { id: 'i7p1', title: 'Physical Quantities and Measurement', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7p1t1', title: 'Volume, Area, Density, Speed' }] },
        { id: 'i7p2', title: 'Motion', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7p2t1', title: 'Rest and Motion, Types of Motion' }] },
        { id: 'i7p3', title: 'Energy', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7p3t1', title: 'Forms of Energy, Conservation, Simple Machines' }] },
        { id: 'i7p4', title: 'Light Energy', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7p4t1', title: 'Reflection, Plane mirrors' }] },
        { id: 'i7p5', title: 'Heat', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7p5t1', title: 'Effects of heat, Temperature, Transfer of heat' }] },
        { id: 'i7p6', title: 'Sound', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i7p6t1', title: 'Production, Propagation' }] },
        { id: 'i7p7', title: 'Electricity and Magnetism', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7p7t1', title: 'Electric current, circuits, electromagnets' }] }
      ]
    },
    {
      id: 'icse7_chem',
      name: 'Chemistry',
      chapters: [
        { id: 'i7c1', title: 'Matter and its Composition', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7c1t1', title: 'Particulate nature of matter' }] },
        { id: 'i7c2', title: 'Physical and Chemical Changes', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7c2t1', title: 'Differences, examples' }] },
        { id: 'i7c3', title: 'Elements, Compounds and Mixtures', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7c3t1', title: 'Separation techniques' }] },
        { id: 'i7c4', title: 'Atoms, Molecules and Radicals', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7c4t1', title: 'Chemical formula, valency' }] },
        { id: 'i7c5', title: 'Language of Chemistry', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7c5t1', title: 'Chemical equations' }] },
        { id: 'i7c6', title: 'Metals and Non-metals', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i7c6t1', title: 'Properties and uses' }] },
        { id: 'i7c7', title: 'Air and Atmosphere', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i7c7t1', title: 'Oxygen, rusting' }] }
      ]
    },
    {
      id: 'icse7_bio',
      name: 'Biology',
      chapters: [
        { id: 'i7b1', title: 'Plant and Animal Tissues', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7b1t1', title: 'Types of tissues' }] },
        { id: 'i7b2', title: 'Classification of Plants', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7b2t1', title: 'Algae, Fungi, Bryophytes, Pteridophytes, Gymnosperms, Angiosperms' }] },
        { id: 'i7b3', title: 'Classification of Animals', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7b3t1', title: 'Invertebrates, Vertebrates' }] },
        { id: 'i7b4', title: 'Photosynthesis and Respiration', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7b4t1', title: 'Processes in plants' }] },
        { id: 'i7b5', title: 'Excretion in Humans', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7b5t1', title: 'Excretory system' }] },
        { id: 'i7b6', title: 'Nervous System', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7b6t1', title: 'Brain, Nerves' }] },
        { id: 'i7b7', title: 'Allergy', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i7b7t1', title: 'Causes, symptoms' }] }
      ]
    },
    {
      id: 'icse7_his',
      name: 'History & Civics',
      chapters: [
        { id: 'i7h1', title: 'Medieval Europe', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7h1t1', title: 'Decline of Roman Empire, Feudalism' }] },
        { id: 'i7h2', title: 'Rise and Spread of Islam', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i7h2t1', title: 'Prophet Muhammad, Caliphates' }] },
        { id: 'i7h3', title: 'The Delhi Sultanate', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7h3t1', title: 'Slave, Khalji, Tughlaq, Sayyid, Lodi' }] },
        { id: 'i7h4', title: 'The Mughal Empire', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7h4t1', title: 'Babur to Aurangzeb' }] },
        { id: 'i7h5', title: 'Bhakti and Sufi Movements', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i7h5t1', title: 'Saints and teachings' }] },
        { id: 'i7h6', title: 'The Constitution of India (Civics)', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7h6t1', title: 'Preamble, Fundamental Rights and Duties' }] }
      ]
    },
    {
      id: 'icse7_geo',
      name: 'Geography',
      chapters: [
        { id: 'i7g1', title: 'Representation of Geographical Features', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7g1t1', title: 'Topographical sheets' }] },
        { id: 'i7g2', title: 'Atmosphere', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7g2t1', title: 'Composition, Structure, Greenhouse effect' }] },
        { id: 'i7g3', title: 'Weather and Climate', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7g3t1', title: 'Elements, instruments' }] },
        { id: 'i7g4', title: 'Weathering and Soil Formation', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7g4t1', title: 'Types of weathering, Soil profile' }] },
        { id: 'i7g5', title: 'Industries', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i7g5t1', title: 'Classification' }] },
        { id: 'i7g6', title: 'Energy and Power Resources', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i7g6t1', title: 'Renewable and non-renewable' }] },
        { id: 'i7g7', title: 'Study of Continents', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i7g7t1', title: 'Europe, Africa, Australia, Antarctica' }] }
      ]
    }
  ]
};
