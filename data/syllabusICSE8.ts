import { SyllabusData } from '../types/syllabus';

// ICSE Class 8 | Session 2026-27
// Source: cisce.org (Curriculum for Preschool to Class VIII)

export const syllabusICSE8: SyllabusData = {
  id: 'icse_8',
  examOrBoard: 'ICSE',
  category: 'School',
  classGrade: 'Class 8',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'icse8_math',
      name: 'Mathematics',
      chapters: [
        { id: 'i8m1', title: 'Number System', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8m1t1', title: 'Rational Numbers, Exponents and Powers, Squares and Square Roots, Cubes and Cube Roots' }] },
        { id: 'i8m2', title: 'Ratio and Proportion', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8m2t1', title: 'Direct and Inverse Variations, Time and Work, Percentage, Profit, Loss and Discount, Simple and Compound Interest' }] },
        { id: 'i8m3', title: 'Algebra', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8m3t1', title: 'Algebraic Expressions, Factorisation, Linear Equations in one variable, Linear Inequations' }] },
        { id: 'i8m4', title: 'Geometry', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8m4t1', title: 'Understanding Quadrilaterals, Construction of Quadrilaterals, Representing 3D in 2D' }] },
        { id: 'i8m5', title: 'Mensuration', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8m5t1', title: 'Area of Polygons, Surface Area and Volume of Cube, Cuboid, Cylinder' }] },
        { id: 'i8m6', title: 'Data Handling', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i8m6t1', title: 'Pie chart, Probability' }] }
      ]
    },
    {
      id: 'icse8_phy',
      name: 'Physics',
      chapters: [
        { id: 'i8p1', title: 'Matter', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8p1t1', title: 'Kinetic theory of matter' }] },
        { id: 'i8p2', title: 'Physical Quantities and Measurement', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8p2t1', title: 'Density, Relative Density, Floatation' }] },
        { id: 'i8p3', title: 'Force and Pressure', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8p3t1', title: 'Turning effect, Pressure in fluids, Atmospheric pressure' }] },
        { id: 'i8p4', title: 'Energy', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8p4t1', title: 'Work, Kinetic and Potential energy, Power' }] },
        { id: 'i8p5', title: 'Light Energy', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8p5t1', title: 'Refraction, Lenses, Dispersion' }] },
        { id: 'i8p6', title: 'Heat Transfer', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8p6t1', title: 'Evaporation, Boiling, Thermal expansion' }] },
        { id: 'i8p7', title: 'Sound', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8p7t1', title: 'Pitch, loudness, quality' }] },
        { id: 'i8p8', title: 'Electricity', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8p8t1', title: 'Static electricity, current electricity, household circuits' }] }
      ]
    },
    {
      id: 'icse8_chem',
      name: 'Chemistry',
      chapters: [
        { id: 'i8c1', title: 'Matter', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8c1t1', title: 'States of matter, change of state' }] },
        { id: 'i8c2', title: 'Physical and Chemical Changes', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8c2t1', title: 'Reversible/Irreversible, Characteristics' }] },
        { id: 'i8c3', title: 'Elements, Compounds and Mixtures', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8c3t1', title: 'Separation of mixtures' }] },
        { id: 'i8c4', title: 'Atomic Structure', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8c4t1', title: 'Subatomic particles, atomic number, mass number, isotopes' }] },
        { id: 'i8c5', title: 'Language of Chemistry', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8c5t1', title: 'Balancing equations, radicals' }] },
        { id: 'i8c6', title: 'Chemical Reactions', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8c6t1', title: 'Types of reactions, energy changes' }] },
        { id: 'i8c7', title: 'Hydrogen', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i8c7t1', title: 'Preparation, properties, uses' }] },
        { id: 'i8c8', title: 'Water', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i8c8t1', title: 'Universal solvent, hard and soft water' }] },
        { id: 'i8c9', title: 'Carbon and its Compounds', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8c9t1', title: 'Allotropes of carbon' }] }
      ]
    },
    {
      id: 'icse8_bio',
      name: 'Biology',
      chapters: [
        { id: 'i8b1', title: 'Transport of Food and Minerals in Plants', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8b1t1', title: 'Xylem, Phloem, Osmosis, Transpiration' }] },
        { id: 'i8b2', title: 'Reproduction in Plants and Animals', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8b2t1', title: 'Asexual, Sexual reproduction' }] },
        { id: 'i8b3', title: 'Ecosystems', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8b3t1', title: 'Biotic/Abiotic components, Food chain, Food web' }] },
        { id: 'i8b4', title: 'Human Body - Endocrine, Circulatory and Nervous Systems', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8b4t1', title: 'Glands, Heart, Blood, Brain, Nerves' }] },
        { id: 'i8b5', title: 'Health and Hygiene', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8b5t1', title: 'Diseases, First Aid, Adolescence' }] },
        { id: 'i8b6', title: 'Food Production', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i8b6t1', title: 'Agriculture, Animal husbandry' }] }
      ]
    },
    {
      id: 'icse8_his',
      name: 'History & Civics',
      chapters: [
        { id: 'i8h1', title: 'A Period of Transition', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8h1t1', title: 'Renaissance, Reformation, Industrial Revolution' }] },
        { id: 'i8h2', title: 'The Growth of Nationalism', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8h2t1', title: 'French Revolution, American War of Independence' }] },
        { id: 'i8h3', title: 'India in the 18th Century', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8h3t1', title: 'Decline of Mughal Empire, Rise of regional powers' }] },
        { id: 'i8h4', title: 'British Conquest of India', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8h4t1', title: 'East India Company, Carnatic Wars, Battle of Plassey, Buxar' }] },
        { id: 'i8h5', title: 'The Great Uprising of 1857', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8h5t1', title: 'Causes, events, consequences' }] },
        { id: 'i8h6', title: 'Socio-Religious Reforms', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i8h6t1', title: 'Brahmo Samaj, Arya Samaj, Ramakrishna Mission' }] },
        { id: 'i8h7', title: 'Three Organs of the Government (Civics)', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8h7t1', title: 'Legislature, Executive, Judiciary' }] },
        { id: 'i8h8', title: 'United Nations (Civics)', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8h8t1', title: 'Aims, organs, agencies' }] }
      ]
    },
    {
      id: 'icse8_geo',
      name: 'Geography',
      chapters: [
        { id: 'i8g1', title: 'Representation of Geographical Features', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8g1t1', title: 'Contours, settlement patterns' }] },
        { id: 'i8g2', title: 'Population Dynamics', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8g2t1', title: 'Distribution, density, migration' }] },
        { id: 'i8g3', title: 'Migration', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'i8g3t1', title: 'Types, causes, impact' }] },
        { id: 'i8g4', title: 'Urbanisation', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8g4t1', title: 'Causes, impacts, satellite cities' }] },
        { id: 'i8g5', title: 'Natural and Man-made Disasters', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8g5t1', title: 'Earthquakes, floods, droughts, fires, industrial accidents' }] },
        { id: 'i8g6', title: 'Study of Continents', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'i8g6t1', title: 'Asia, India (Location, Extent, Physical features, Climate, Natural vegetation, Wildlife)' }] }
      ]
    }
  ]
};
