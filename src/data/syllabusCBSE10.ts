import { SyllabusData } from '../types/syllabus';

export const syllabusCBSE10: SyllabusData = {
  id: 'cbse_10',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 10',
  academicSession: '2026-2027',
  sourceUrl: 'https://cbseacademic.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'cbse_10_sci',
      name: 'Science',
      chapters: [
        {
          id: 'c10_sci_1',
          title: 'Chemical Reactions and Equations',
          officialWeightage: 'Part of 25 Marks (Unit 1)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_s1_t1', title: 'Chemical Equation' },
            { id: 'c10_s1_t2', title: 'Types of Chemical Reactions' },
            { id: 'c10_s1_t3', title: 'Effects of Oxidation in Everyday Life' }
          ]
        },
        {
          id: 'c10_sci_2',
          title: 'Acids, Bases and Salts',
          officialWeightage: 'Part of 25 Marks (Unit 1)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_s2_t1', title: 'Understanding the Chemical Properties of Acids and Bases' },
            { id: 'c10_s2_t2', title: 'What do all Acids and all Bases have in common' },
            { id: 'c10_s2_t3', title: 'How Strong are Acid or Base Solutions?' },
            { id: 'c10_s2_t4', title: 'More about Salts' }
          ]
        },
        {
          id: 'c10_sci_3',
          title: 'Metals and Non-metals',
          officialWeightage: 'Part of 25 Marks (Unit 1)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_s3_t1', title: 'Physical Properties' },
            { id: 'c10_s3_t2', title: 'Chemical Properties of Metals' },
            { id: 'c10_s3_t3', title: 'How do Metals and Non-metals React?' },
            { id: 'c10_s3_t4', title: 'Occurrence of Metals and Corrosion' }
          ]
        },
        {
          id: 'c10_sci_4',
          title: 'Carbon and its Compounds',
          officialWeightage: 'Part of 25 Marks (Unit 1)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_s4_t1', title: 'Bonding in Carbon - The Covalent Bond' },
            { id: 'c10_s4_t2', title: 'Versatile Nature of Carbon' },
            { id: 'c10_s4_t3', title: 'Chemical Properties of Carbon Compounds' },
            { id: 'c10_s4_t4', title: 'Ethanol and Ethanoic Acid' },
            { id: 'c10_s4_t5', title: 'Soaps and Detergents' }
          ]
        },
        {
          id: 'c10_sci_5',
          title: 'Life Processes',
          officialWeightage: 'Part of 25 Marks (Unit 2)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_s5_t1', title: 'What are Life Processes?' },
            { id: 'c10_s5_t2', title: 'Nutrition' },
            { id: 'c10_s5_t3', title: 'Respiration' },
            { id: 'c10_s5_t4', title: 'Transportation' },
            { id: 'c10_s5_t5', title: 'Excretion' }
          ]
        },
        {
          id: 'c10_sci_6',
          title: 'Control and Coordination',
          officialWeightage: 'Part of 25 Marks (Unit 2)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'c10_s6_t1', title: 'Animals – Nervous System' },
            { id: 'c10_s6_t2', title: 'Coordination in Plants' },
            { id: 'c10_s6_t3', title: 'Hormones in Animals' }
          ]
        },
        {
          id: 'c10_sci_7',
          title: 'How do Organisms Reproduce?',
          officialWeightage: 'Part of 25 Marks (Unit 2)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_s7_t1', title: 'Do Organisms Create Exact Copies of Themselves?' },
            { id: 'c10_s7_t2', title: 'Modes of Reproduction Used by Single Organisms' },
            { id: 'c10_s7_t3', title: 'Sexual Reproduction' }
          ]
        },
        {
          id: 'c10_sci_8',
          title: 'Heredity',
          officialWeightage: 'Part of 25 Marks (Unit 2)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_s8_t1', title: 'Accumulation of Variation During Reproduction' },
            { id: 'c10_s8_t2', title: 'Heredity (Mendel’s contributions)' },
            { id: 'c10_s8_t3', title: 'Sex Determination' }
          ]
        },
        {
          id: 'c10_sci_9',
          title: 'Light – Reflection and Refraction',
          officialWeightage: 'Part of 12 Marks (Unit 3)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_s9_t1', title: 'Reflection of Light (Spherical Mirrors)' },
            { id: 'c10_s9_t2', title: 'Refraction of Light (Lenses)' }
          ]
        },
        {
          id: 'c10_sci_10',
          title: 'The Human Eye and the Colourful World',
          officialWeightage: 'Part of 12 Marks (Unit 3)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'c10_s10_t1', title: 'Refraction of Light Through a Prism' },
            { id: 'c10_s10_t2', title: 'Dispersion of White Light by a Glass Prism' },
            { id: 'c10_s10_t3', title: 'Atmospheric Refraction & Scattering' }
          ]
        },
        {
          id: 'c10_sci_11',
          title: 'Electricity',
          officialWeightage: 'Part of 13 Marks (Unit 4)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_s11_t1', title: 'Electric Current and Circuit' },
            { id: 'c10_s11_t2', title: 'Electric Potential and Potential Difference' },
            { id: 'c10_s11_t3', title: 'Ohm’s Law & Resistance' },
            { id: 'c10_s11_t4', title: 'Heating Effect of Electric Current' },
            { id: 'c10_s11_t5', title: 'Electric Power' }
          ]
        },
        {
          id: 'c10_sci_12',
          title: 'Magnetic Effects of Electric Current',
          officialWeightage: 'Part of 13 Marks (Unit 4)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_s12_t1', title: 'Magnetic Field and Field Lines' },
            { id: 'c10_s12_t2', title: 'Magnetic Field due to a Current-Carrying Conductor' },
            { id: 'c10_s12_t3', title: 'Force on a Current-Carrying Conductor in a Magnetic Field' },
            { id: 'c10_s12_t4', title: 'Domestic Electric Circuits' }
          ]
        },
        {
          id: 'c10_sci_13',
          title: 'Our Environment',
          officialWeightage: '5 Marks (Unit 5)',
          pyqPriority: 'LOW',
          topics: [
            { id: 'c10_s13_t1', title: 'Eco-system and its Components' },
            { id: 'c10_s13_t2', title: 'How do our Activities Affect the Environment?' }
          ]
        }
      ]
    },
    {
      id: 'cbse_10_math',
      name: 'Mathematics',
      chapters: [
        {
          id: 'c10_math_1',
          title: 'Real Numbers',
          officialWeightage: '6 Marks (Number Systems)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_m1_t1', title: 'Fundamental Theorem of Arithmetic' },
            { id: 'c10_m1_t2', title: 'Revisiting Irrational Numbers' }
          ]
        },
        {
          id: 'c10_math_2',
          title: 'Polynomials',
          officialWeightage: 'Part of 20 Marks (Algebra)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'c10_m2_t1', title: 'Geometrical Meaning of the Zeroes of a Polynomial' },
            { id: 'c10_m2_t2', title: 'Relationship between Zeroes and Coefficients of a Polynomial' }
          ]
        },
        {
          id: 'c10_math_3',
          title: 'Pair of Linear Equations in Two Variables',
          officialWeightage: 'Part of 20 Marks (Algebra)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_m3_t1', title: 'Graphical Method of Solution of a Pair of Linear Equations' },
            { id: 'c10_m3_t2', title: 'Algebraic Methods of Solving a Pair of Linear Equations (Substitution, Elimination)' }
          ]
        },
        {
          id: 'c10_math_4',
          title: 'Quadratic Equations',
          officialWeightage: 'Part of 20 Marks (Algebra)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_m4_t1', title: 'Quadratic Equations' },
            { id: 'c10_m4_t2', title: 'Solution of a Quadratic Equation by Factorisation' },
            { id: 'c10_m4_t3', title: 'Nature of Roots' }
          ]
        },
        {
          id: 'c10_math_5',
          title: 'Arithmetic Progressions',
          officialWeightage: 'Part of 20 Marks (Algebra)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_m5_t1', title: 'Arithmetic Progressions' },
            { id: 'c10_m5_t2', title: 'nth Term of an AP' },
            { id: 'c10_m5_t3', title: 'Sum of First n Terms of an AP' }
          ]
        },
        {
          id: 'c10_math_6',
          title: 'Triangles',
          officialWeightage: 'Part of 15 Marks (Geometry)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_m6_t1', title: 'Similar Figures' },
            { id: 'c10_m6_t2', title: 'Similarity of Triangles' },
            { id: 'c10_m6_t3', title: 'Criteria for Similarity of Triangles' }
          ]
        },
        {
          id: 'c10_math_7',
          title: 'Coordinate Geometry',
          officialWeightage: '6 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_m7_t1', title: 'Distance Formula' },
            { id: 'c10_m7_t2', title: 'Section Formula' }
          ]
        },
        {
          id: 'c10_math_8',
          title: 'Introduction to Trigonometry',
          officialWeightage: 'Part of 12 Marks (Trigonometry)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_m8_t1', title: 'Trigonometric Ratios' },
            { id: 'c10_m8_t2', title: 'Trigonometric Ratios of Some Specific Angles' },
            { id: 'c10_m8_t3', title: 'Trigonometric Identities' }
          ]
        },
        {
          id: 'c10_math_9',
          title: 'Some Applications of Trigonometry',
          officialWeightage: 'Part of 12 Marks (Trigonometry)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_m9_t1', title: 'Heights and Distances' }
          ]
        },
        {
          id: 'c10_math_10',
          title: 'Circles',
          officialWeightage: 'Part of 15 Marks (Geometry)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'c10_m10_t1', title: 'Tangent to a Circle' },
            { id: 'c10_m10_t2', title: 'Number of Tangents from a Point on a Circle' }
          ]
        },
        {
          id: 'c10_math_11',
          title: 'Areas Related to Circles',
          officialWeightage: 'Part of 10 Marks (Mensuration)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'c10_m11_t1', title: 'Areas of Sector and Segment of a Circle' }
          ]
        },
        {
          id: 'c10_math_12',
          title: 'Surface Areas and Volumes',
          officialWeightage: 'Part of 10 Marks (Mensuration)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_m12_t1', title: 'Surface Area of a Combination of Solids' },
            { id: 'c10_m12_t2', title: 'Volume of a Combination of Solids' }
          ]
        },
        {
          id: 'c10_math_13',
          title: 'Statistics',
          officialWeightage: 'Part of 11 Marks (Stat & Prob)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'c10_m13_t1', title: 'Mean of Grouped Data' },
            { id: 'c10_m13_t2', title: 'Mode of Grouped Data' },
            { id: 'c10_m13_t3', title: 'Median of Grouped Data' }
          ]
        },
        {
          id: 'c10_math_14',
          title: 'Probability',
          officialWeightage: 'Part of 11 Marks (Stat & Prob)',
          pyqPriority: 'LOW',
          topics: [
            { id: 'c10_m14_t1', title: 'Probability — A Theoretical Approach' }
          ]
        }
      ]
    },
    {
      id: 'cbse_10_sst',
      name: 'Social Science',
      chapters: [
        {
          id: 'c10_sst_h1',
          title: 'The Rise of Nationalism in Europe (History)',
          officialWeightage: 'Part of 20 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'h1_t1', title: 'The French Revolution and the Idea of the Nation' },
            { id: 'h1_t2', title: 'The Making of Nationalism in Europe' },
            { id: 'h1_t3', title: 'The Age of Revolutions: 1830-1848' },
            { id: 'h1_t4', title: 'The Making of Germany and Italy' },
            { id: 'h1_t5', title: 'Visualising the Nation & Nationalism and Imperialism' }
          ]
        },
        {
          id: 'c10_sst_h2',
          title: 'Nationalism in India (History)',
          officialWeightage: 'Part of 20 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'h2_t1', title: 'The First World War, Khilafat and Non-Cooperation' },
            { id: 'h2_t2', title: 'Differing Strands within the Movement' },
            { id: 'h2_t3', title: 'Towards Civil Disobedience' },
            { id: 'h2_t4', title: 'The Sense of Collective Belonging' }
          ]
        },
        {
          id: 'c10_sst_g1',
          title: 'Resources and Development (Geography)',
          officialWeightage: 'Part of 20 Marks',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'g1_t1', title: 'Types of Resources' },
            { id: 'g1_t2', title: 'Development of Resources & Resource Planning' },
            { id: 'g1_t3', title: 'Land Resources and Land Use Pattern in India' },
            { id: 'g1_t4', title: 'Soil as a Resource and Classification of Soils' }
          ]
        },
        {
          id: 'c10_sst_p1',
          title: 'Power Sharing (Political Science)',
          officialWeightage: 'Part of 20 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'p1_t1', title: 'Belgium and Sri Lanka' },
            { id: 'p1_t2', title: 'Majoritarianism in Sri Lanka & Accommodation in Belgium' },
            { id: 'p1_t3', title: 'Why power sharing is desirable?' },
            { id: 'p1_t4', title: 'Forms of power-sharing' }
          ]
        },
        {
          id: 'c10_sst_e1',
          title: 'Development (Economics)',
          officialWeightage: 'Part of 20 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'e1_t1', title: 'What Development Promises' },
            { id: 'e1_t2', title: 'Income and other goals' },
            { id: 'e1_t3', title: 'National Development & How to compare different countries' },
            { id: 'e1_t4', title: 'Public Facilities & Sustainability of development' }
          ]
        }
      ]
    },
    {
      id: 'cbse_10_eng',
      name: 'English',
      chapters: [
        {
          id: 'c10_eng_1',
          title: 'A Letter to God (First Flight)',
          officialWeightage: 'Part of 40 Marks (Literature)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'eng1_t1', title: 'Prose: A Letter to God' },
            { id: 'eng1_t2', title: 'Poem: Dust of Snow' },
            { id: 'eng1_t3', title: 'Poem: Fire and Ice' }
          ]
        },
        {
          id: 'c10_eng_2',
          title: 'Nelson Mandela: Long Walk to Freedom',
          officialWeightage: 'Part of 40 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'eng2_t1', title: 'Prose: Nelson Mandela' },
            { id: 'eng2_t2', title: 'Poem: A Tiger in the Zoo' }
          ]
        },
        {
          id: 'c10_eng_foot_1',
          title: 'A Triumph of Surgery (Footprints without Feet)',
          officialWeightage: 'Part of 40 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'engf1_t1', title: 'Story: A Triumph of Surgery' }
          ]
        }
      ]
    },
    {
      id: 'cbse_10_hin',
      name: 'Hindi (Course A)',
      chapters: [
        {
          id: 'c10_hin_1',
          title: 'सूरदास के पद (Kshitij)',
          officialWeightage: 'Part of Literature',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hin1_t1', title: 'पद्य खंड: सूरदास' }
          ]
        },
        {
          id: 'c10_hin_2',
          title: 'राम-लक्ष्मण-परशुराम संवाद',
          officialWeightage: 'Part of Literature',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hin2_t1', title: 'पद्य खंड: तुलसीदास' }
          ]
        },
        {
          id: 'c10_hin_10',
          title: 'नेताजी का चश्मा',
          officialWeightage: 'Part of Literature',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hin10_t1', title: 'गद्य खंड: स्वयं प्रकाश' }
          ]
        },
        {
          id: 'c10_hin_11',
          title: 'बालगोबिन भगत',
          officialWeightage: 'Part of Literature',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hin11_t1', title: 'गद्य खंड: रामवृक्ष बेनीपुरी' }
          ]
        },
        {
          id: 'c10_hin_mata',
          title: 'माता का अँचल (Kritika)',
          officialWeightage: 'Part of Literature',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'hin_m1', title: 'कृतिका: शिवपूजन सहाय' }
          ]
        }
      ]
    }
  ]
};
