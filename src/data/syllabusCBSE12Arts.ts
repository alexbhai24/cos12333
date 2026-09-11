import { SyllabusData } from '../types/syllabus';
import { cbse12English } from './syllabusCBSE12PCM';
import { cbse12Economics } from './syllabusCBSE12Commerce';

export const syllabusCBSE12Arts: SyllabusData = {
  id: 'cbse_12_arts',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 12',
  stream: 'Arts',
  academicSession: '2026-2027',
  sourceUrl: 'https://cbseacademic.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'cbse_12_arts_hist',
      name: 'History',
      chapters: [
        {
          id: 'hist1',
          title: 'Bricks, Beads and Bones — The Harappan Civilisation',
          officialWeightage: 'Part of Section A (25 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hist1_t1', title: 'Discovering the Harappan Civilisation' },
            { id: 'hist1_t2', title: 'Unravelling the Past: Early Explorers & Archaeologists' },
            { id: 'hist1_t3', title: 'Harappan Cities: Structures, Drainage, Granaries' },
            { id: 'hist1_t4', title: 'Agricultural Strategies & Animal Husbandry' },
            { id: 'hist1_t5', title: 'Crafts, Trade & Exchange' },
            { id: 'hist1_t6', title: 'Social Differences & Ritual Practices' },
            { id: 'hist1_t7', title: 'The End of the Civilisation — Theories' }
          ]
        },
        {
          id: 'hist2',
          title: 'Kings, Farmers and Towns — Early States and Economies',
          officialWeightage: 'Part of Section A (25 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hist2_t1', title: 'Deciphering Inscriptions: Ashokan Edicts' },
            { id: 'hist2_t2', title: 'The Mauryan Empire: Administration & Extent' },
            { id: 'hist2_t3', title: 'Post-Mauryan Polities: Kushanas, Satvahanas' },
            { id: 'hist2_t4', title: 'Agrarian Expansion & New Settlements' },
            { id: 'hist2_t5', title: 'Towns, Trade Routes & Traders' }
          ]
        },
        {
          id: 'hist3',
          title: 'Kinship, Caste and Class — Early Societies',
          officialWeightage: 'Part of Section A (25 Marks)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'hist3_t1', title: 'Families and Kinship in the Mahabharata' },
            { id: 'hist3_t2', title: 'Social Differences and Varna Order' },
            { id: 'hist3_t3', title: 'Evaluating Evidence: Histories Through Texts' }
          ]
        },
        {
          id: 'hist4',
          title: 'Thinkers, Beliefs and Buildings — Cultural Developments',
          officialWeightage: 'Part of Section A (25 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hist4_t1', title: 'A Glimpse of the Past: Jainism & Buddhism' },
            { id: 'hist4_t2', title: 'The World of the Upanishads' },
            { id: 'hist4_t3', title: 'The Spread of Buddhism and Stupas' },
            { id: 'hist4_t4', title: 'Sculpture and Architecture: Sanchi, Amaravati' }
          ]
        },
        {
          id: 'hist5',
          title: 'Through the Eyes of Travellers — Perceptions of Society',
          officialWeightage: 'Part of Section B (25 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hist5_t1', title: 'Al-Biruni and his Account of India' },
            { id: 'hist5_t2', title: 'Ibn Battuta\'s Travels in India' },
            { id: 'hist5_t3', title: 'François Bernier and Mughal India' }
          ]
        },
        {
          id: 'hist6',
          title: 'Bhakti-Sufi Traditions — Changes in Religious Beliefs',
          officialWeightage: 'Part of Section B (25 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hist6_t1', title: 'A Rich Tradition of Devotion: Early Bhakti' },
            { id: 'hist6_t2', title: 'The Philosophy of the Poet-Saints' },
            { id: 'hist6_t3', title: 'Sufi Silsilas and their Shrines' },
            { id: 'hist6_t4', title: 'Kabir, Mirabai, and New Voices' }
          ]
        },
        {
          id: 'hist7',
          title: 'An Imperial Capital: Vijayanagara',
          officialWeightage: 'Part of Section B (25 Marks)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'hist7_t1', title: 'The Discovery of Hampi' },
            { id: 'hist7_t2', title: 'Water and Agricultural Resources' },
            { id: 'hist7_t3', title: 'The Royal Centre and Crafts of Vijayanagara' }
          ]
        },
        {
          id: 'hist8',
          title: 'Peasants, Zamindars and the State — Agrarian Society and the Mughal Empire',
          officialWeightage: 'Part of Section B (25 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hist8_t1', title: 'Peasants and Agricultural Produce' },
            { id: 'hist8_t2', title: 'The Village Community' },
            { id: 'hist8_t3', title: 'Zamindars and their Power' },
            { id: 'hist8_t4', title: 'Forests and Tribes' },
            { id: 'hist8_t5', title: 'The Ain-i-Akbari as a Source' }
          ]
        },
        {
          id: 'hist9',
          title: 'Kings and Chronicles — The Mughal Courts',
          officialWeightage: 'Part of Section B (25 Marks)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'hist9_t1', title: 'Chronicles and Their Composition' },
            { id: 'hist9_t2', title: 'The Mughal Household and Succession' }
          ]
        },
        {
          id: 'hist10',
          title: 'Colonialism and the Countryside — Exploring Official Archives',
          officialWeightage: 'Part of Section C (25 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hist10_t1', title: 'The Bengal Permanent Settlement' },
            { id: 'hist10_t2', title: 'The Paharia and Santhals' },
            { id: 'hist10_t3', title: 'The 5th Report and its Critiques' },
            { id: 'hist10_t4', title: 'The Rajmahal Hills: A Special Case' }
          ]
        },
        {
          id: 'hist11',
          title: 'Rebels and the Raj — The Revolt of 1857 and its Representations',
          officialWeightage: 'Part of Section C (25 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hist11_t1', title: 'The Beginnings: Meerut and Delhi 1857' },
            { id: 'hist11_t2', title: 'Patrons and Leaders of the Revolt' },
            { id: 'hist11_t3', title: 'The Vision of Unity: Awadh' },
            { id: 'hist11_t4', title: 'Aftermath and Repression' }
          ]
        },
        {
          id: 'hist12',
          title: 'Colonial Cities — Urbanisation, Planning and Architecture',
          officialWeightage: 'Part of Section C (25 Marks)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'hist12_t1', title: 'Cities under Colonial Rule' },
            { id: 'hist12_t2', title: 'Bombay, Calcutta, Madras — Three Presidency Cities' },
            { id: 'hist12_t3', title: 'New Delhi: Planning a Capital' }
          ]
        },
        {
          id: 'hist13',
          title: 'Mahatma Gandhi and the Nationalist Movement',
          officialWeightage: 'Part of Section C (25 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hist13_t1', title: 'Mahatma Gandhi\'s Return to India' },
            { id: 'hist13_t2', title: 'Non-Cooperation and the People' },
            { id: 'hist13_t3', title: 'Civil Disobedience and Quit India' },
            { id: 'hist13_t4', title: 'How do we Know? Diaries, Autobiographies' }
          ]
        },
        {
          id: 'hist14',
          title: 'Understanding Partition — Politics, Memories, Experiences',
          officialWeightage: 'Part of Section C (25 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hist14_t1', title: 'Why Partition?' },
            { id: 'hist14_t2', title: 'The Logic of Communal Politics' },
            { id: 'hist14_t3', title: 'Partition: Memory and Experience' }
          ]
        },
        {
          id: 'hist15',
          title: 'Framing the Constitution — The Beginning of a New Era',
          officialWeightage: 'Part of Section C (25 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'hist15_t1', title: 'The Constituent Assembly' },
            { id: 'hist15_t2', title: 'Hopes and Anxieties' },
            { id: 'hist15_t3', title: 'Making the Constitution: Key Debates' },
            { id: 'hist15_t4', title: 'The Vision of the Constitution' }
          ]
        }
      ]
    },
    {
      id: 'cbse_12_arts_polsci',
      name: 'Political Science',
      chapters: [
        {
          id: 'pol1',
          title: 'The Cold War Era',
          officialWeightage: 'Part of Part A (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol1_t1', title: 'World After WW2: Emergence of Superpowers' },
            { id: 'pol1_t2', title: 'The Logic of Deterrence (MAD)' },
            { id: 'pol1_t3', title: 'Cold War Arenas: Cuba, Korea, Vietnam' },
            { id: 'pol1_t4', title: 'Non-Aligned Movement and India' }
          ]
        },
        {
          id: 'pol2',
          title: 'The End of Bipolarity',
          officialWeightage: 'Part of Part A (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol2_t1', title: 'Soviet System and its Unravelling' },
            { id: 'pol2_t2', title: 'Gorbachev Reforms: Glasnost & Perestroika' },
            { id: 'pol2_t3', title: 'Consequences of Soviet Disintegration' }
          ]
        },
        {
          id: 'pol3',
          title: 'US Hegemony in World Politics',
          officialWeightage: 'Part of Part A (50 Marks)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'pol3_t1', title: 'Shock and Awe: Operation Desert Storm' },
            { id: 'pol3_t2', title: '9/11 and the War on Terror' },
            { id: 'pol3_t3', title: 'Constraints on American Hegemony' }
          ]
        },
        {
          id: 'pol4',
          title: 'Alternative Centres of Power',
          officialWeightage: 'Part of Part A (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol4_t1', title: 'The European Union: Origin, Expansion & Functioning' },
            { id: 'pol4_t2', title: 'ASEAN: Formation and Significance' },
            { id: 'pol4_t3', title: 'China\'s Rise: Economic and Political Dimensions' }
          ]
        },
        {
          id: 'pol5',
          title: 'Contemporary South Asia',
          officialWeightage: 'Part of Part A (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol5_t1', title: 'Democracy and Development in South Asia' },
            { id: 'pol5_t2', title: 'India-Pakistan Relations' },
            { id: 'pol5_t3', title: 'SAARC and Regional Cooperation' }
          ]
        },
        {
          id: 'pol6',
          title: 'International Organisations',
          officialWeightage: 'Part of Part A (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol6_t1', title: 'The United Nations: Structure and Functioning' },
            { id: 'pol6_t2', title: 'Need for UN Reforms' },
            { id: 'pol6_t3', title: 'World Trade Organization (WTO), IMF, World Bank' }
          ]
        },
        {
          id: 'pol7',
          title: 'Security in the Contemporary World',
          officialWeightage: 'Part of Part A (50 Marks)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'pol7_t1', title: 'Traditional vs. Non-Traditional Security' },
            { id: 'pol7_t2', title: 'New Sources of Threat: Terrorism, Pandemics' }
          ]
        },
        {
          id: 'pol8',
          title: 'Environment and Natural Resources',
          officialWeightage: 'Part of Part A (50 Marks)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'pol8_t1', title: 'Global Commons and their Management' },
            { id: 'pol8_t2', title: 'Rio Summit, Kyoto Protocol, Paris Agreement' }
          ]
        },
        {
          id: 'pol9',
          title: 'Globalisation',
          officialWeightage: 'Part of Part A (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol9_t1', title: 'Economic and Cultural Dimensions of Globalisation' },
            { id: 'pol9_t2', title: 'Debate on Globalisation' },
            { id: 'pol9_t3', title: 'India\'s Response to Globalisation' }
          ]
        },
        {
          id: 'pol10',
          title: 'Challenges of Nation-Building',
          officialWeightage: 'Part of Part B (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol10_t1', title: 'Partition: Challenge of Unity' },
            { id: 'pol10_t2', title: 'Integration of Princely States' }
          ]
        },
        {
          id: 'pol11',
          title: 'Era of One-Party Dominance',
          officialWeightage: 'Part of Part B (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol11_t1', title: 'First General Election and Congress System' },
            { id: 'pol11_t2', title: 'Nature of Congress Dominance' },
            { id: 'pol11_t3', title: 'Opposition Parties and their Ideologies' }
          ]
        },
        {
          id: 'pol12',
          title: 'Politics of Planned Development',
          officialWeightage: 'Part of Part B (50 Marks)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'pol12_t1', title: 'The Idea of Development — Debates at Independence' },
            { id: 'pol12_t2', title: 'Planning Commission and Five Year Plans' },
            { id: 'pol12_t3', title: 'The Kerala Model vs. Gujarat Model' }
          ]
        },
        {
          id: 'pol13',
          title: 'India\'s External Relations',
          officialWeightage: 'Part of Part B (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol13_t1', title: 'Nehru\'s Foreign Policy: NAM & Panchsheel' },
            { id: 'pol13_t2', title: 'The Wars with China (1962) and Pakistan (1965, 1971)' },
            { id: 'pol13_t3', title: 'India\'s Nuclear Policy' }
          ]
        },
        {
          id: 'pol14',
          title: 'Challenges to and Restoration of the Congress System',
          officialWeightage: 'Part of Part B (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol14_t1', title: 'Political Succession After Nehru' },
            { id: 'pol14_t2', title: 'The 1967 Elections: Congress loses majority' },
            { id: 'pol14_t3', title: 'Indira Gandhi\'s Rise and Congress Split' }
          ]
        },
        {
          id: 'pol15',
          title: 'Crisis of the Democratic Order',
          officialWeightage: 'Part of Part B (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol15_t1', title: 'Background to Emergency' },
            { id: 'pol15_t2', title: 'The Emergency: Proclamation, Consequences' },
            { id: 'pol15_t3', title: 'Post-Emergency Politics: Janata Party' }
          ]
        },
        {
          id: 'pol16',
          title: 'Popular Movements in an Era of One-Party Dominance',
          officialWeightage: 'Part of Part B (50 Marks)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'pol16_t1', title: 'Chipko Movement and Environmental Awareness' },
            { id: 'pol16_t2', title: 'Anti-Arrack Movement and Dalit Assertion' }
          ]
        },
        {
          id: 'pol17',
          title: 'Regional Aspirations',
          officialWeightage: 'Part of Part B (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol17_t1', title: 'The Challenge of Regionalism' },
            { id: 'pol17_t2', title: 'Kashmir Issue' },
            { id: 'pol17_t3', title: 'Punjab Crisis and the Northeast' }
          ]
        },
        {
          id: 'pol18',
          title: 'Recent Developments in Indian Politics',
          officialWeightage: 'Part of Part B (50 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'pol18_t1', title: 'Rise of BJP and Coalition Era' },
            { id: 'pol18_t2', title: 'Mandal Commission and OBC Reservation' },
            { id: 'pol18_t3', title: 'Ayodhya Dispute and Communal Politics' }
          ]
        }
      ]
    },
    {
      id: 'cbse_12_arts_geo',
      name: 'Geography',
      chapters: [
        {
          id: 'geo1',
          title: 'Human Geography — Nature and Scope',
          officialWeightage: 'Part of Unit 1',
          pyqPriority: 'LOW',
          topics: [
            { id: 'geo1_t1', title: 'Nature of Human Geography' },
            { id: 'geo1_t2', title: 'Fields and Sub-fields of Human Geography' }
          ]
        },
        {
          id: 'geo2',
          title: 'The World Population — Distribution, Density and Growth',
          officialWeightage: 'Part of Unit 2 (30 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'geo2_t1', title: 'Patterns of Population Distribution' },
            { id: 'geo2_t2', title: 'Factors Influencing Distribution' },
            { id: 'geo2_t3', title: 'Phases of Population Growth' },
            { id: 'geo2_t4', title: 'Population Growth and Economic Development' }
          ]
        },
        {
          id: 'geo3',
          title: 'Population Composition',
          officialWeightage: 'Part of Unit 2',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'geo3_t1', title: 'Age-Sex Structure and Population Pyramid' },
            { id: 'geo3_t2', title: 'Rural-Urban Composition' }
          ]
        },
        {
          id: 'geo4',
          title: 'Human Development',
          officialWeightage: 'Part of Unit 3',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'geo4_t1', title: 'Human Development Index (HDI)' },
            { id: 'geo4_t2', title: 'International Comparisons of Development' }
          ]
        },
        {
          id: 'geo5',
          title: 'Primary Activities',
          officialWeightage: 'Part of Unit 4 (30 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'geo5_t1', title: 'Types of Farming: Subsistence and Commercial' },
            { id: 'geo5_t2', title: 'Major Crops and Farming Regions' },
            { id: 'geo5_t3', title: 'Mining and Quarrying' }
          ]
        },
        {
          id: 'geo6',
          title: 'Secondary Activities',
          officialWeightage: 'Part of Unit 4',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'geo6_t1', title: 'Manufacturing: Types and Characteristics' },
            { id: 'geo6_t2', title: 'High Technology Industries' }
          ]
        },
        {
          id: 'geo7',
          title: 'Tertiary and Quaternary Activities',
          officialWeightage: 'Part of Unit 4',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'geo7_t1', title: 'Trade, Transport and Communication' },
            { id: 'geo7_t2', title: 'Services and Quaternary Sector' }
          ]
        },
        {
          id: 'geo8',
          title: 'Transport and Communication',
          officialWeightage: 'Part of Unit 4',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'geo8_t1', title: 'Land Transport: Roadways and Railways' },
            { id: 'geo8_t2', title: 'Water Transport: Inland and Ocean Routes' },
            { id: 'geo8_t3', title: 'Air Transport and Satellite Communication' }
          ]
        },
        {
          id: 'geo9',
          title: 'International Trade',
          officialWeightage: 'Part of Unit 4',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'geo9_t1', title: 'Basis of International Trade' },
            { id: 'geo9_t2', title: 'World Trade Organisation (WTO)' }
          ]
        },
        {
          id: 'geo10',
          title: 'Population: Distribution, Density, Growth and Composition (India)',
          officialWeightage: 'Part of Unit 5 (30 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'geo10_t1', title: 'Distribution and Density of Population in India' },
            { id: 'geo10_t2', title: 'Population Growth and Demographic Transition' },
            { id: 'geo10_t3', title: 'Occupational Structure' }
          ]
        },
        {
          id: 'geo11',
          title: 'Migration in India',
          officialWeightage: 'Part of Unit 5',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'geo11_t1', title: 'Types and Streams of Migration' },
            { id: 'geo11_t2', title: 'Causes and Consequences of Migration' }
          ]
        },
        {
          id: 'geo12',
          title: 'Human Settlements (India)',
          officialWeightage: 'Part of Unit 5',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'geo12_t1', title: 'Rural Settlements: Types and Patterns' },
            { id: 'geo12_t2', title: 'Urban Settlements: Growth and Functions' }
          ]
        },
        {
          id: 'geo13',
          title: 'Land Resources and Agriculture (India)',
          officialWeightage: 'Part of Unit 6 (30 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'geo13_t1', title: 'Land Use Pattern in India' },
            { id: 'geo13_t2', title: 'Major Crops: Food and Non-Food' },
            { id: 'geo13_t3', title: 'Green Revolution and Its Impact' }
          ]
        },
        {
          id: 'geo14',
          title: 'Water Resources (India)',
          officialWeightage: 'Part of Unit 6',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'geo14_t1', title: 'Surface and Ground Water Resources' },
            { id: 'geo14_t2', title: 'Multipurpose River Projects' }
          ]
        },
        {
          id: 'geo15',
          title: 'Mineral and Energy Resources (India)',
          officialWeightage: 'Part of Unit 6',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'geo15_t1', title: 'Distribution of Minerals: Ferrous and Non-Ferrous' },
            { id: 'geo15_t2', title: 'Conventional and Non-Conventional Energy' }
          ]
        },
        {
          id: 'geo16',
          title: 'Planning and Sustainable Development (India)',
          officialWeightage: 'Part of Unit 6',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'geo16_t1', title: 'Sustainable Development Goals (SDGs) in India' },
            { id: 'geo16_t2', title: 'Case Studies: Indira Gandhi Canal, Bharmaur' }
          ]
        },
        {
          id: 'geo17',
          title: 'Transport and Communication (India)',
          officialWeightage: 'Part of Unit 7',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'geo17_t1', title: 'Roadways and Railways in India' },
            { id: 'geo17_t2', title: 'Pipelines and Airways' },
            { id: 'geo17_t3', title: 'Cyber Space and India\'s Digital Revolution' }
          ]
        },
        {
          id: 'geo18',
          title: 'International Trade of India',
          officialWeightage: 'Part of Unit 7',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'geo18_t1', title: 'Changing Pattern of India\'s Foreign Trade' },
            { id: 'geo18_t2', title: 'India\'s Seaports and Airports' }
          ]
        }
      ]
    },
    {
      id: 'cbse_12_arts_eco',
      name: 'Economics',
      chapters: [
        {
          id: 'eco1',
          title: 'Introduction to Macroeconomics',
          officialWeightage: 'Part of Part A (40 Marks)',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'eco1_t1', title: 'Emergence of Macroeconomics' },
            { id: 'eco1_t2', title: 'Difference between Microeconomics and Macroeconomics' }
          ]
        },
        {
          id: 'eco2',
          title: 'National Income Accounting',
          officialWeightage: 'Part of Part A (40 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'eco2_t1', title: 'Circular Flow of Income' },
            { id: 'eco2_t2', title: 'Domestic Product and GDP' },
            { id: 'eco2_t3', title: 'Methods of Calculating National Income' },
            { id: 'eco2_t4', title: 'GDP and Welfare' }
          ]
        },
        {
          id: 'eco3',
          title: 'Money and Banking',
          officialWeightage: 'Part of Part A (40 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'eco3_t1', title: 'Money: Meaning and Supply' },
            { id: 'eco3_t2', title: 'Commercial Banks: Functions and Credit Creation' },
            { id: 'eco3_t3', title: 'Reserve Bank of India: Role and Functions' }
          ]
        },
        {
          id: 'eco4',
          title: 'Income Determination',
          officialWeightage: 'Part of Part A (40 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'eco4_t1', title: 'Aggregate Demand and Aggregate Supply' },
            { id: 'eco4_t2', title: 'Propensity to Consume and Save' },
            { id: 'eco4_t3', title: 'Multiplier Mechanism' },
            { id: 'eco4_t4', title: 'Deficient and Excess Demand' }
          ]
        },
        {
          id: 'eco5',
          title: 'Government Budget and the Economy',
          officialWeightage: 'Part of Part A (40 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'eco5_t1', title: 'Meaning and Components of Budget' },
            { id: 'eco5_t2', title: 'Objectives of Budget' },
            { id: 'eco5_t3', title: 'Fiscal Deficit, Revenue Deficit, Primary Deficit' }
          ]
        },
        {
          id: 'eco6',
          title: 'Open Economy Macroeconomics',
          officialWeightage: 'Part of Part A (40 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'eco6_t1', title: 'Balance of Payments (BOP)' },
            { id: 'eco6_t2', title: 'Foreign Exchange Rate: Flexible and Fixed' },
            { id: 'eco6_t3', title: 'Determination of Exchange Rate' }
          ]
        },
        {
          id: 'eco7',
          title: 'Development Experience of India — A Comparison',
          officialWeightage: 'Part of Part B (40 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'eco7_t1', title: 'India vs. Pakistan vs. China: Development Comparison' },
            { id: 'eco7_t2', title: 'Demographic Indicators and Human Development' }
          ]
        },
        {
          id: 'eco8',
          title: 'Current Challenges Facing Indian Economy',
          officialWeightage: 'Part of Part B (40 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'eco8_t1', title: 'Poverty: Absolute and Relative' },
            { id: 'eco8_t2', title: 'Rural Development and Credit' },
            { id: 'eco8_t3', title: 'Employment: Types and Measurement' },
            { id: 'eco8_t4', title: 'Infrastructure: Energy and Health' },
            { id: 'eco8_t5', title: 'Environment and Sustainable Development' }
          ]
        },
        {
          id: 'eco9',
          title: 'Development Experience of India (Policies and Growth)',
          officialWeightage: 'Part of Part B (40 Marks)',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'eco9_t1', title: 'Economic Reforms since 1991: LPG' },
            { id: 'eco9_t2', title: 'Privatisation, Globalisation, Liberalisation' },
            { id: 'eco9_t3', title: 'Assessment of Economic Reforms' }
          ]
        }
      ]
    },
    {
      id: 'cbse_12_arts_socio',
      name: 'Sociology',
      chapters: [
        {
          id: 'socio1',
          title: 'Introducing Indian Society',
          officialWeightage: 'Part of Part A',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'socio1_t1', title: 'The Social Construction of Reality' },
            { id: 'socio1_t2', title: 'Diversity in India: Unity in Diversity' }
          ]
        },
        {
          id: 'socio2',
          title: 'The Demographic Structure of the Indian Society',
          officialWeightage: 'Part of Part A',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'socio2_t1', title: 'The Census in India' },
            { id: 'socio2_t2', title: 'Population Growth and Composition' }
          ]
        },
        {
          id: 'socio3',
          title: 'Social Institutions — Continuity and Change',
          officialWeightage: 'Part of Part A',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'socio3_t1', title: 'Caste System: Features and Functions' },
            { id: 'socio3_t2', title: 'Tribal Communities in India' },
            { id: 'socio3_t3', title: 'Family System: Change and Continuity' }
          ]
        },
        {
          id: 'socio4',
          title: 'Market as a Social Institution',
          officialWeightage: 'Part of Part A',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'socio4_t1', title: 'The Sociology of Markets' },
            { id: 'socio4_t2', title: 'Haats, Mandis, Melas and Market Structures' }
          ]
        },
        {
          id: 'socio5',
          title: 'Patterns of Social Inequality and Exclusion',
          officialWeightage: 'Part of Part A',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'socio5_t1', title: 'Social Stratification: Class, Caste, Gender' },
            { id: 'socio5_t2', title: 'Discrimination and Untouchability' },
            { id: 'socio5_t3', title: 'Adivasis and their Rights' }
          ]
        },
        {
          id: 'socio6',
          title: 'The Challenges of Cultural Diversity',
          officialWeightage: 'Part of Part A',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'socio6_t1', title: 'Communalism, Secularism and Nationalism' },
            { id: 'socio6_t2', title: 'Regionalism in Indian Politics' }
          ]
        },
        {
          id: 'socio7',
          title: 'Suggestions for Project Work',
          officialWeightage: 'Project (20 Marks)',
          pyqPriority: 'LOW',
          topics: [
            { id: 'socio7_t1', title: 'Observation, Interview and Survey Techniques' }
          ]
        }
      ]
    },
    cbse12Economics,
    cbse12English
  ]
};
