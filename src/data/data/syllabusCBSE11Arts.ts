import { SyllabusData } from '../types/syllabus';
import { syllabusCBSE11PCB } from './syllabusCBSE11PCB';

// CBSE Class 11 Arts (Humanities) | Session 2026-27
// Official source: cbseacademic.nic.in
// Includes: History, Political Science, Geography, English Core

export const syllabusCBSE11Arts: SyllabusData = {
  id: 'cbse_11_arts',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://cbseacademic.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'cbse11_his',
      name: 'History',
      chapters: [
        { id: 'c11h1', title: 'Writing and City Life', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11h1t1', title: 'Iraq, 3rd millennium BCE' },
          { id: 'c11h1t2', title: 'Growth of towns, nature of early urban societies, historians\' use of evidence (art, architecture)' }
        ]},
        { id: 'c11h2', title: 'An Empire Across Three Continents', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11h2t1', title: 'Roman Empire, 27 BCE to 600 CE' },
          { id: 'c11h2t2', title: 'Political evolution, economic expansion, religion, late antiquity' }
        ]},
        { id: 'c11h3', title: 'Nomadic Empires', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11h3t1', title: 'The Mongol, 13th to 14th century' },
          { id: 'c11h3t2', title: 'Nature of nomadism, formation of empire, conquests and relations with other states' }
        ]},
        { id: 'c11h4', title: 'The Three Orders', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11h4t1', title: 'Western Europe, 13th-16th century' },
          { id: 'c11h4t2', title: 'Feudal society and economy, state formation, Church and society' }
        ]},
        { id: 'c11h5', title: 'Changing Cultural Traditions', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11h5t1', title: 'Europe, 14th to 17th century' },
          { id: 'c11h5t2', title: 'New ideas and new trends in literature and arts, relationship with earlier ideas, contribution of West Asia' }
        ]},
        { id: 'c11h6', title: 'Displacing Indigenous Peoples', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11h6t1', title: 'North America and Australia, 18th-20th century' },
          { id: 'c11h6t2', title: 'European colonists, formation of white settler societies, displacement and repression of local people' }
        ]},
        { id: 'c11h7', title: 'Paths to Modernisation', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11h7t1', title: 'East Asia, late 19th and 20th century' },
          { id: 'c11h7t2', title: 'Militarization and economic growth in Japan, China and the Communist alternative' }
        ]},
        { id: 'c11h8', title: 'Map Work', officialWeightage: '5 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'c11h8t1', title: 'Locating and labeling items based on the prescribed themes' }
        ]}
      ]
    },
    {
      id: 'cbse11_pol',
      name: 'Political Science',
      chapters: [
        // Part A: Indian Constitution at Work (40 Marks)
        { id: 'c11pol1', title: 'Constitution', officialWeightage: 'Part A (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11pol1t1', title: 'Constitution: Why and How, The Making of the Constitution, Fundamental Rights and Duties, Directive Principles of State Policy, constitutional amendments' }
        ]},
        { id: 'c11pol2', title: 'Election and Representation', officialWeightage: 'Part A (10 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11pol2t1', title: 'Elections and Democracy, Election System in India, Electoral Reforms' }
        ]},
        { id: 'c11pol3', title: 'Legislature', officialWeightage: 'Part A (8 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11pol3t1', title: 'Why do we need a Parliament? Two Houses of Parliament, Functions and Power of the Parliament, Legislative functions, control over Executive, Parliamentary committees' }
        ]},
        { id: 'c11pol4', title: 'Executive', officialWeightage: 'Part A (8 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11pol4t1', title: 'What is an Executive? Different Types of Executive, Parliamentary Executive in India, Prime Minister and Council of Ministers, Permanent Executive (Bureaucracy)' }
        ]},
        { id: 'c11pol5', title: 'Judiciary', officialWeightage: 'Part A (8 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11pol5t1', title: 'Why do we need an Independent Judiciary? Structure of the Judiciary, Judicial Activism, Judiciary and Rights, Judiciary and Parliament' }
        ]},
        { id: 'c11pol6', title: 'Federalism', officialWeightage: 'Part A (8 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11pol6t1', title: 'What is Federalism? Federalism in the Indian Constitution, Federalism with a strong Central Government, conflicts in India\'s federal system' }
        ]},
        { id: 'c11pol7', title: 'Local Governments', officialWeightage: 'Part A (4 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c11pol7t1', title: 'Why do we need Local Governments? Growth of Local Government in India, 73rd and 74th Amendments' }
        ]},
        // Part B: Political Theory (40 Marks)
        { id: 'c11pol8', title: 'Political Theory: An Introduction', officialWeightage: 'Part B (4 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c11pol8t1', title: 'What is Politics? What do we study in Political Theory? Putting Political Theory to practice' }
        ]},
        { id: 'c11pol9', title: 'Freedom', officialWeightage: 'Part B (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11pol9t1', title: 'The Ideal of Freedom, What is Freedom? Sources of Constraints, Negative and Positive Liberty' }
        ]},
        { id: 'c11pol10', title: 'Equality', officialWeightage: 'Part B (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11pol10t1', title: 'Significance of Equality, What is Equality? Various dimensions of Equality, How can we promote Equality?' }
        ]},
        { id: 'c11pol11', title: 'Social Justice', officialWeightage: 'Part B (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11pol11t1', title: 'What is Justice? Just Distribution, Justice as fairness, Pursuing Social Justice' }
        ]},
        { id: 'c11pol12', title: 'Rights', officialWeightage: 'Part B (8 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11pol12t1', title: 'What are Rights? Where do Rights come from? Legal Rights and the State, Kinds of Rights, Rights and Responsibilities' }
        ]},
        { id: 'c11pol13', title: 'Citizenship', officialWeightage: 'Part B (8 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11pol13t1', title: 'What is citizenship? Citizen and Nation, Universal Citizenship, Global Citizenship' }
        ]},
        { id: 'c11pol14', title: 'Nationalism', officialWeightage: 'Part B (8 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11pol14t1', title: 'Nations and Nationalism, National Self-determination, Nationalism and Pluralism' }
        ]},
        { id: 'c11pol15', title: 'Secularism', officialWeightage: 'Part B (8 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11pol15t1', title: 'What is Secularism? Western and Indian approaches to Secularism, Criticisms of Indian Secularism' }
        ]}
      ]
    },
    {
      id: 'cbse11_geo',
      name: 'Geography',
      chapters: [
        // Part A: Fundamentals of Physical Geography (35 Marks)
        { id: 'c11geo1', title: 'Geography as a Discipline', officialWeightage: 'Part A (3 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c11geo1t1', title: 'Geography as an integrating discipline, as a science of spatial attributes; Branches of Geography' }
        ]},
        { id: 'c11geo2', title: 'The Earth', officialWeightage: 'Part A (9 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11geo2t1', title: 'Origin and evolution of the earth; Interior of the earth' },
          { id: 'c11geo2t2', title: 'Distribution of oceans and continents, Wegener\'s continental drift theory and plate tectonics' }
        ]},
        { id: 'c11geo3', title: 'Landforms', officialWeightage: 'Part A (6 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11geo3t1', title: 'Geomorphic processes: weathering, mass wasting, erosion and deposition; soil-formation' },
          { id: 'c11geo3t2', title: 'Landforms and their evolution' }
        ]},
        { id: 'c11geo4', title: 'Climate', officialWeightage: 'Part A (8 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11geo4t1', title: 'Composition and structure of atmosphere; elements of weather and climate' },
          { id: 'c11geo4t2', title: 'Solar radiation, isolation, heat budget; temperature' },
          { id: 'c11geo4t3', title: 'Atmospheric circulation and weather systems, pressure belts, winds, cyclones' },
          { id: 'c11geo4t4', title: 'Water in the atmosphere: humidity, precipitation types' },
          { id: 'c11geo4t5', title: 'World climate and climate change (Koeppen)' }
        ]},
        { id: 'c11geo5', title: 'Water (Oceans)', officialWeightage: 'Part A (4 Marks)', pyqPriority: 'MEDIUM', topics: [
          { id: 'c11geo5t1', title: 'Basics of Oceanography; Ocean waters: temperature and salinity' },
          { id: 'c11geo5t2', title: 'Movements of ocean water: waves, tides, currents' }
        ]},
        { id: 'c11geo6', title: 'Life on the Earth', officialWeightage: 'Part A (3 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c11geo6t1', title: 'Biosphere - importance of plants and other organisms' },
          { id: 'c11geo6t2', title: 'Biodiversity and conservation' }
        ]},
        { id: 'c11geo7', title: 'Map and Diagrammatic Questions (Part A)', officialWeightage: 'Part A (2 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11geo7t1', title: 'Map work of features based on Part A chapters' }
        ]},
        // Part B: India - Physical Environment (35 Marks)
        { id: 'c11geo8', title: 'Introduction', officialWeightage: 'Part B (5 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c11geo8t1', title: 'India: Location, space relations, India\'s place in the world' }
        ]},
        { id: 'c11geo9', title: 'Physiography', officialWeightage: 'Part B (13 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11geo9t1', title: 'Structure and Relief; Physiographic Divisions' },
          { id: 'c11geo9t2', title: 'Drainage systems: Concept of river basins, Watershed, Himalayan and Peninsular rivers' }
        ]},
        { id: 'c11geo10', title: 'Climate, Vegetation and Soil', officialWeightage: 'Part B (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11geo10t1', title: 'Weather and climate: spatial and temporal distribution of temperature, pressure winds and rainfall, Indian monsoon' },
          { id: 'c11geo10t2', title: 'Natural vegetation: forest types and distribution; wild life; conservation; biosphere reserves' },
          { id: 'c11geo10t3', title: 'Soils: major types (ICAR\'s classification) and their distribution, soil degradation and conservation' }
        ]},
        { id: 'c11geo11', title: 'Hazards and Disasters: Causes, Consequences and Management', officialWeightage: 'Part B (3 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'c11geo11t1', title: 'Floods, Cloudbursts, Droughts, Earthquakes and Tsunami, Cyclones, Landslides' }
        ]},
        { id: 'c11geo12', title: 'Map and Diagrammatic Questions (Part B)', officialWeightage: 'Part B (2 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'c11geo12t1', title: 'Map work of features based on Part B chapters' }
        ]}
      ]
    },
    syllabusCBSE11PCB.subjects.find(s => s.id === 'cbse11_eng')!
  ]
};
