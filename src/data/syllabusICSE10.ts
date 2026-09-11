import { SyllabusData } from '../types/syllabus';

export const syllabusICSE10: SyllabusData = {
  id: 'icse_10',
  examOrBoard: 'ICSE',
  category: 'School',
  classGrade: 'Class 10',
  academicSession: '2026-2027',
  sourceUrl: 'https://cisce.org/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'icse_10_sci_phy',
      name: 'Physics (Science Paper 1)',
      chapters: [
        {
          id: 'icse_phy1',
          title: 'Force',
          officialWeightage: 'Part of 80 Marks Written',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'iphy1_t1', title: 'Turning forces concept; moment of a force' },
            { id: 'iphy1_t2', title: 'Conditions for equilibrium of a rigid body' },
            { id: 'iphy1_t3', title: 'Centre of gravity and uniform lamina' },
            { id: 'iphy1_t4', title: 'Uniform circular motion (centripetal force)' }
          ]
        },
        {
          id: 'icse_phy2',
          title: 'Work, Energy and Power',
          officialWeightage: 'Part of 80 Marks Written',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'iphy2_t1', title: 'Work: definition and formula' },
            { id: 'iphy2_t2', title: 'Energy: kinetic and potential' },
            { id: 'iphy2_t3', title: 'Power and efficiency' },
            { id: 'iphy2_t4', title: 'Conservation of energy' }
          ]
        },
        {
          id: 'icse_phy3',
          title: 'Machines',
          officialWeightage: 'Part of 80 Marks Written',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'iphy3_t1', title: 'Concept of simple machines' },
            { id: 'iphy3_t2', title: 'Levers: types and examples' },
            { id: 'iphy3_t3', title: 'Pulleys: single, block and tackle' },
            { id: 'iphy3_t4', title: 'MA, VR and Efficiency' }
          ]
        },
        {
          id: 'icse_phy4',
          title: 'Refraction of Light at Plane Surfaces',
          officialWeightage: 'Part of 80 Marks Written',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'iphy4_t1', title: 'Refraction of light at a plane surface' },
            { id: 'iphy4_t2', title: 'Snell\'s law and refractive index' },
            { id: 'iphy4_t3', title: 'Total Internal Reflection and critical angle' }
          ]
        },
        {
          id: 'icse_phy5',
          title: 'Refraction through a Lens',
          officialWeightage: 'Part of 80 Marks Written',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'iphy5_t1', title: 'Convex and concave lens terminology' },
            { id: 'iphy5_t2', title: 'Ray diagrams for image formation' },
            { id: 'iphy5_t3', title: 'Lens formula and magnification' }
          ]
        },
        {
          id: 'icse_phy6',
          title: 'Spectrum',
          officialWeightage: 'Part of 80 Marks Written',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'iphy6_t1', title: 'Electromagnetic spectrum' },
            { id: 'iphy6_t2', title: 'Dispersion of light through a prism' },
            { id: 'iphy6_t3', title: 'Scattering of light' }
          ]
        },
        {
          id: 'icse_phy7',
          title: 'Sound',
          officialWeightage: 'Part of 80 Marks Written',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'iphy7_t1', title: 'Nature of sound as a wave' },
            { id: 'iphy7_t2', title: 'Characteristics of sound: amplitude, frequency' },
            { id: 'iphy7_t3', title: 'Reflection of sound and echoes' },
            { id: 'iphy7_t4', title: 'Natural vibrations, Resonance' }
          ]
        },
        {
          id: 'icse_phy8',
          title: 'Electricity',
          officialWeightage: 'Part of 80 Marks Written',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'iphy8_t1', title: 'Ohm\'s law, resistance and resistivity' },
            { id: 'iphy8_t2', title: 'Resistance in series and parallel' },
            { id: 'iphy8_t3', title: 'Electrical power and energy' },
            { id: 'iphy8_t4', title: 'Electrical safety, fuses and earthing' }
          ]
        },
        {
          id: 'icse_phy9',
          title: 'Magnetic Effect of Current',
          officialWeightage: 'Part of 80 Marks Written',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'iphy9_t1', title: 'Oersted\'s Experiment' },
            { id: 'iphy9_t2', title: 'Magnetic field due to current: Solenoid' },
            { id: 'iphy9_t3', title: 'Electromagnets and their uses' },
            { id: 'iphy9_t4', title: 'Force on a conductor and electric motor' },
            { id: 'iphy9_t5', title: 'Electromagnetic induction and AC generator' }
          ]
        },
        {
          id: 'icse_phy10',
          title: 'Radioactivity',
          officialWeightage: 'Part of 80 Marks Written',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'iphy10_t1', title: 'Radioactive decay: Alpha, Beta, Gamma' },
            { id: 'iphy10_t2', title: 'Nuclear fission and fusion' },
            { id: 'iphy10_t3', title: 'Background radiation, safety, half-life' }
          ]
        }
      ]
    },
    {
      id: 'icse_10_sci_chem',
      name: 'Chemistry (Science Paper 2)',
      chapters: [
        {
          id: 'icse_chem1',
          title: 'Periodic Table',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ichem1_t1', title: 'Newlands\' Law of Octaves and Mendeleev\'s table' },
            { id: 'ichem1_t2', title: 'Modern Periodic Table: periods and groups' },
            { id: 'ichem1_t3', title: 'Periodic Properties: atomic radius, ionisation, electronegativity' }
          ]
        },
        {
          id: 'icse_chem2',
          title: 'Chemical Bonding',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ichem2_t1', title: 'Electrovalent (ionic) bonding' },
            { id: 'ichem2_t2', title: 'Covalent bonding (single, double, triple bonds)' },
            { id: 'ichem2_t3', title: 'Co-ordinate bonding' }
          ]
        },
        {
          id: 'icse_chem3',
          title: 'Acids, Bases and Salts',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ichem3_t1', title: 'Arrhenius, Bronsted-Lowry, Lewis concepts' },
            { id: 'ichem3_t2', title: 'pH and the universal indicator' },
            { id: 'ichem3_t3', title: 'Preparation and properties of important salts' }
          ]
        },
        {
          id: 'icse_chem4',
          title: 'Analytical Chemistry',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ichem4_t1', title: 'Action of NaOH on various salt solutions' },
            { id: 'ichem4_t2', title: 'Action of dilute H2SO4 and HCl' },
            { id: 'ichem4_t3', title: 'Identification of gases: CO2, SO2, NH3, HCl, Cl2' }
          ]
        },
        {
          id: 'icse_chem5',
          title: 'Mole Concept and Stoichiometry',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ichem5_t1', title: 'Gay Lussac\'s Law of Combining Volumes' },
            { id: 'ichem5_t2', title: 'Avogadro\'s Law and Avogadro\'s Number' },
            { id: 'ichem5_t3', title: 'Mole concept: Molar mass and Molar volume' },
            { id: 'ichem5_t4', title: 'Calculations based on chemical equations' }
          ]
        },
        {
          id: 'icse_chem6',
          title: 'Electrolysis',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ichem6_t1', title: 'Electrolytes and non-electrolytes' },
            { id: 'ichem6_t2', title: 'Electrolysis of fused lead bromide and water' },
            { id: 'ichem6_t3', title: 'Electroplating and its applications' }
          ]
        },
        {
          id: 'icse_chem7',
          title: 'Metallurgy',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'ichem7_t1', title: 'Occurrence of metals: Ores and Gangue' },
            { id: 'ichem7_t2', title: 'Steps in extraction: Concentration, Reduction, Refining' },
            { id: 'ichem7_t3', title: 'Extraction of Iron and Aluminium' }
          ]
        },
        {
          id: 'icse_chem8',
          title: 'Study of Compounds: HCl and HNO3',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ichem8_t1', title: 'Manufacture and properties of HCl' },
            { id: 'ichem8_t2', title: 'Manufacture of HNO3 (Ostwald process)' }
          ]
        },
        {
          id: 'icse_chem9',
          title: 'Organic Chemistry',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ichem9_t1', title: 'Introduction to organic compounds' },
            { id: 'ichem9_t2', title: 'Hydrocarbons: Alkanes, Alkenes, Alkynes' },
            { id: 'ichem9_t3', title: 'Isomerism' },
            { id: 'ichem9_t4', title: 'Alcohols: Ethanol — preparation and properties' }
          ]
        }
      ]
    },
    {
      id: 'icse_10_sci_bio',
      name: 'Biology (Science Paper 3)',
      chapters: [
        {
          id: 'icse_bio1',
          title: 'Cell — The Unit of Life',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ibio1_t1', title: 'Cell as the basic unit of life' },
            { id: 'ibio1_t2', title: 'Prokaryotic and Eukaryotic cells' },
            { id: 'ibio1_t3', title: 'Cell organelles: structure and function' }
          ]
        },
        {
          id: 'icse_bio2',
          title: 'Tissues',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'ibio2_t1', title: 'Plant tissues: meristematic and permanent' },
            { id: 'ibio2_t2', title: 'Animal tissues: epithelial, connective, muscular, nervous' }
          ]
        },
        {
          id: 'icse_bio3',
          title: 'Internal Structure of Leaf and Flower',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'ibio3_t1', title: 'Internal structure of leaf (T.S.)' },
            { id: 'ibio3_t2', title: 'Parts of a typical flower and their functions' }
          ]
        },
        {
          id: 'icse_bio4',
          title: 'Photosynthesis',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ibio4_t1', title: 'Site of photosynthesis: chloroplast structure' },
            { id: 'ibio4_t2', title: 'Light and dark reactions (overview)' },
            { id: 'ibio4_t3', title: 'Factors affecting rate of photosynthesis' }
          ]
        },
        {
          id: 'icse_bio5',
          title: 'Respiration',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ibio5_t1', title: 'Aerobic and Anaerobic respiration' },
            { id: 'ibio5_t2', title: 'Mechanism of breathing in humans' },
            { id: 'ibio5_t3', title: 'Respiratory quotient (RQ)' }
          ]
        },
        {
          id: 'icse_bio6',
          title: 'Excretion',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ibio6_t1', title: 'Excretory products and their elimination' },
            { id: 'ibio6_t2', title: 'Structure of the human excretory system' },
            { id: 'ibio6_t3', title: 'Urine formation: filtration, reabsorption, secretion' },
            { id: 'ibio6_t4', title: 'Kidney disorders: dialysis' }
          ]
        },
        {
          id: 'icse_bio7',
          title: 'Nervous System',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ibio7_t1', title: 'Structure and function of a neuron' },
            { id: 'ibio7_t2', title: 'Central, Peripheral and Autonomic nervous systems' },
            { id: 'ibio7_t3', title: 'Reflex action and reflex arc' }
          ]
        },
        {
          id: 'icse_bio8',
          title: 'Endocrine System',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ibio8_t1', title: 'Endocrine glands and hormones' },
            { id: 'ibio8_t2', title: 'Pituitary, Thyroid, Adrenal, Pancreas' },
            { id: 'ibio8_t3', title: 'Hormones and diseases (diabetes, goitre)' }
          ]
        },
        {
          id: 'icse_bio9',
          title: 'Reproduction',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ibio9_t1', title: 'Asexual reproduction in plants and animals' },
            { id: 'ibio9_t2', title: 'Pollination: self and cross' },
            { id: 'ibio9_t3', title: 'Fertilisation and seed germination' },
            { id: 'ibio9_t4', title: 'Human reproductive system' }
          ]
        },
        {
          id: 'icse_bio10',
          title: 'Genetics',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'ibio10_t1', title: 'Mendel\'s Laws of Inheritance' },
            { id: 'ibio10_t2', title: 'Monohybrid and Dihybrid crosses' },
            { id: 'ibio10_t3', title: 'Sex determination in humans' }
          ]
        },
        {
          id: 'icse_bio11',
          title: 'Evolution',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'ibio11_t1', title: 'Theories of evolution: Lamarck and Darwin' },
            { id: 'ibio11_t2', title: 'Natural selection and survival of the fittest' }
          ]
        },
        {
          id: 'icse_bio12',
          title: 'Population — The Increasing Numbers and Rising Problems',
          officialWeightage: 'Part of 80 Marks',
          pyqPriority: 'LOW',
          topics: [
            { id: 'ibio12_t1', title: 'Population growth curve and consequences' },
            { id: 'ibio12_t2', title: 'Pollution: types and control measures' }
          ]
        }
      ]
    },
    {
      id: 'icse_10_math',
      name: 'Mathematics',
      chapters: [
        {
          id: 'icse_math1',
          title: 'Goods and Services Tax (GST)',
          officialWeightage: 'Commercial Arithmetic',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath1_t1', title: 'Computation of GST' },
            { id: 'imath1_t2', title: 'CGST, SGST, IGST' }
          ]
        },
        {
          id: 'icse_math2',
          title: 'Banking',
          officialWeightage: 'Commercial Arithmetic',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath2_t1', title: 'Recurring Deposit Account' },
            { id: 'imath2_t2', title: 'Calculation of maturity value' }
          ]
        },
        {
          id: 'icse_math3',
          title: 'Shares and Dividends',
          officialWeightage: 'Commercial Arithmetic',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath3_t1', title: 'Face value, Market value, Annual yield' },
            { id: 'imath3_t2', title: 'Return on investment from shares' }
          ]
        },
        {
          id: 'icse_math4',
          title: 'Linear Inequations',
          officialWeightage: 'Algebra',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'imath4_t1', title: 'Solving linear inequations in one variable' },
            { id: 'imath4_t2', title: 'Representation on number line' }
          ]
        },
        {
          id: 'icse_math5',
          title: 'Quadratic Equations',
          officialWeightage: 'Algebra',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath5_t1', title: 'Solving by factorisation and formula' },
            { id: 'imath5_t2', title: 'Nature of roots: discriminant' },
            { id: 'imath5_t3', title: 'Word problems on quadratic equations' }
          ]
        },
        {
          id: 'icse_math6',
          title: 'Ratio and Proportion',
          officialWeightage: 'Algebra',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath6_t1', title: 'Componendo and Dividendo' },
            { id: 'imath6_t2', title: 'Duplicate, triplicate, sub-duplicate ratios' }
          ]
        },
        {
          id: 'icse_math7',
          title: 'Remainder and Factor Theorems',
          officialWeightage: 'Algebra',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath7_t1', title: 'Factor Theorem and Remainder Theorem' },
            { id: 'imath7_t2', title: 'Factorisation of polynomials' }
          ]
        },
        {
          id: 'icse_math8',
          title: 'Matrices',
          officialWeightage: 'Algebra',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath8_t1', title: 'Order of a matrix, types of matrices' },
            { id: 'imath8_t2', title: 'Addition, subtraction and multiplication of matrices' }
          ]
        },
        {
          id: 'icse_math9',
          title: 'Arithmetic and Geometric Progressions',
          officialWeightage: 'Algebra',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath9_t1', title: 'nth term and Sum to n terms of AP' },
            { id: 'imath9_t2', title: 'nth term and Sum to n terms of GP' }
          ]
        },
        {
          id: 'icse_math10',
          title: 'Coordinate Geometry',
          officialWeightage: 'Coordinate Geometry',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath10_t1', title: 'Distance formula, Section formula' },
            { id: 'imath10_t2', title: 'Equation of a line (slope-intercept, two-point form)' },
            { id: 'imath10_t3', title: 'Parallel and perpendicular lines' }
          ]
        },
        {
          id: 'icse_math11',
          title: 'Similarity',
          officialWeightage: 'Geometry',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath11_t1', title: 'Similar triangles: criteria (AA, SAS, SSS)' },
            { id: 'imath11_t2', title: 'Basic Proportionality Theorem' },
            { id: 'imath11_t3', title: 'Areas of similar triangles' }
          ]
        },
        {
          id: 'icse_math12',
          title: 'Loci and Construction',
          officialWeightage: 'Geometry',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'imath12_t1', title: 'Locus: definition and examples' },
            { id: 'imath12_t2', title: 'Construction of tangents to a circle' }
          ]
        },
        {
          id: 'icse_math13',
          title: 'Circles',
          officialWeightage: 'Geometry',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath13_t1', title: 'Angle properties of a circle' },
            { id: 'imath13_t2', title: 'Tangent and Secant properties' },
            { id: 'imath13_t3', title: 'Cyclic quadrilaterals' }
          ]
        },
        {
          id: 'icse_math14',
          title: 'Mensuration',
          officialWeightage: 'Mensuration',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath14_t1', title: 'Area and volume of cylinder, cone, sphere' },
            { id: 'imath14_t2', title: 'Combination of solids' }
          ]
        },
        {
          id: 'icse_math15',
          title: 'Trigonometry',
          officialWeightage: 'Trigonometry',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath15_t1', title: 'Trigonometric identities' },
            { id: 'imath15_t2', title: 'Heights and distances (angles of elevation/depression)' }
          ]
        },
        {
          id: 'icse_math16',
          title: 'Statistics',
          officialWeightage: 'Statistics',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath16_t1', title: 'Mean, Median, Mode of grouped data' },
            { id: 'imath16_t2', title: 'Histogram and Ogive' },
            { id: 'imath16_t3', title: 'Quartiles and Inter-Quartile Range' }
          ]
        },
        {
          id: 'icse_math17',
          title: 'Probability',
          officialWeightage: 'Probability',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'imath17_t1', title: 'Random experiments and sample space' },
            { id: 'imath17_t2', title: 'Classical probability and problems' }
          ]
        }
      ]
    }
  ]
};
