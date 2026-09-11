import { SyllabusData } from '../types/syllabus';

// UP Board Class 9 | Session 2026-27 (Hindi Medium)
// Source: upmsp.edu.in
// Note: UP Board syllabus maps closely to NCERT but has its own structure.

export const syllabusUP9: SyllabusData = {
  id: 'up_board_9',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 9',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'up9_math',
      name: 'गणित (Mathematics)',
      chapters: [
        { id: 'u9m1', title: 'संख्या पद्धति (Number Systems)', officialWeightage: 'Unit 1 (12 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'u9m1t1', title: 'वास्तविक संख्याएँ' }
        ]},
        { id: 'u9m2', title: 'बीजगणित (Algebra)', officialWeightage: 'Unit 2 (25 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'u9m2t1', title: 'बहुपद (Polynomials)' },
          { id: 'u9m2t2', title: 'दो चरों वाले रैखिक समीकरण' }
        ]},
        { id: 'u9m3', title: 'निर्देशांक ज्यामिति (Coordinate Geometry)', officialWeightage: 'Unit 3 (5 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'u9m3t1', title: 'निर्देशांक ज्यामिति' }
        ]},
        { id: 'u9m4', title: 'ज्यामिति (Geometry)', officialWeightage: 'Unit 4 (15 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'u9m4t1', title: 'यूक्लिड की ज्यामिति का परिचय' },
          { id: 'u9m4t2', title: 'रेखाएँ और कोण' },
          { id: 'u9m4t3', title: 'त्रिभुज' },
          { id: 'u9m4t4', title: 'चतुर्भुज' },
          { id: 'u9m4t5', title: 'वृत्त' }
        ]},
        { id: 'u9m5', title: 'मेंसुरेशन (Mensuration)', officialWeightage: 'Unit 5 (14 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'u9m5t1', title: 'हीरोन का सूत्र' },
          { id: 'u9m5t2', title: 'पृष्ठीय क्षेत्रफल और आयतन' }
        ]},
        { id: 'u9m6', title: 'सांख्यिकी (Statistics)', officialWeightage: 'Unit 6 (4 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'u9m6t1', title: 'सांख्यिकी' }
        ]},
        { id: 'u9m7', title: 'प्रायिकता (Probability)', officialWeightage: 'Unit 7 (5 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'u9m7t1', title: 'प्रायिकता' }
        ]}
      ]
    },
    {
      id: 'up9_sci',
      name: 'विज्ञान (Science)',
      chapters: [
        { id: 'u9s1', title: 'द्रव्य - प्रकृति एवं व्यवहार (Matter- Nature and Behaviour)', officialWeightage: 'Unit 1 (20 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'u9s1t1', title: 'हमारे आस-पास के पदार्थ' },
          { id: 'u9s1t2', title: 'क्या हमारे आस-पास के पदार्थ शुद्ध हैं' },
          { id: 'u9s1t3', title: 'परमाणु एवं अणु' },
          { id: 'u9s1t4', title: 'परमाणु की संरचना' }
        ]},
        { id: 'u9s2', title: 'सजीव जगत में संगठन (Organization in the Living World)', officialWeightage: 'Unit 2 (15 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'u9s2t1', title: 'जीवन की मौलिक इकाई (कोशिका)' },
          { id: 'u9s2t2', title: 'ऊतक (Tissues)' },
          { id: 'u9s2t3', title: 'जीवों में विविधता' }
        ]},
        { id: 'u9s3', title: 'गति, बल तथा कार्य (Motion, Force and Work)', officialWeightage: 'Unit 3 (25 Marks)', pyqPriority: 'HIGH', topics: [
          { id: 'u9s3t1', title: 'गति' },
          { id: 'u9s3t2', title: 'बल तथा गति के नियम' },
          { id: 'u9s3t3', title: 'गुरुत्वाकर्षण' },
          { id: 'u9s3t4', title: 'कार्य तथा ऊर्जा' },
          { id: 'u9s3t5', title: 'ध्वनि' }
        ]},
        { id: 'u9s4', title: 'हमारा पर्यावरण (Our Environment)', officialWeightage: 'Unit 4 (6 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'u9s4t1', title: 'प्राकृतिक सम्पदा (Natural Resources)' }
        ]},
        { id: 'u9s5', title: 'खाद्य उत्पादन (Food Production)', officialWeightage: 'Unit 5 (4 Marks)', pyqPriority: 'LOW', topics: [
          { id: 'u9s5t1', title: 'खाद्य संसाधनों में सुधार' }
        ]}
      ]
    },
    {
      id: 'up9_sst',
      name: 'सामाजिक विज्ञान (Social Science)',
      chapters: [
        { id: 'u9sst1', title: 'इतिहास: भारत और समकालीन विश्व-1', officialWeightage: '20 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'u9sst1t1', title: 'फ्रांसीसी क्रांति' },
          { id: 'u9sst1t2', title: 'यूरोप में समाजवाद एवं रूसी क्रांति' },
          { id: 'u9sst1t3', title: 'नात्सीवाद और हिटलर का उदय' },
          { id: 'u9sst1t4', title: 'वन्य समाज एवं उपनिवेशवाद / आधुनिक विश्व में चरवाहे' }
        ]},
        { id: 'u9sst2', title: 'भूगोल: समकालीन भारत-1', officialWeightage: '20 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'u9sst2t1', title: 'भारत – आकार और स्थिति' },
          { id: 'u9sst2t2', title: 'भारत का भौतिक स्वरूप' },
          { id: 'u9sst2t3', title: 'अपवाह' },
          { id: 'u9sst2t4', title: 'जलवायु' },
          { id: 'u9sst2t5', title: 'प्राकृतिक वनस्पति तथा वन्य प्राणी' },
          { id: 'u9sst2t6', title: 'जनसंख्या' }
        ]},
        { id: 'u9sst3', title: 'नागरिक शास्त्र: लोकतांत्रिक राजनीति-1', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'u9sst3t1', title: 'लोकतंत्र क्या? लोकतंत्र क्यों?' },
          { id: 'u9sst3t2', title: 'संविधान निर्माण' },
          { id: 'u9sst3t3', title: 'चुनावी राजनीति' },
          { id: 'u9sst3t4', title: 'संस्थाओं का कामकाज' },
          { id: 'u9sst3t5', title: 'लोकतांत्रिक अधिकार' }
        ]},
        { id: 'u9sst4', title: 'अर्थशास्त्र', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [
          { id: 'u9sst4t1', title: 'पालमपुर गाँव की कहानी' },
          { id: 'u9sst4t2', title: 'संसाधन के रूप में लोग' },
          { id: 'u9sst4t3', title: 'निर्धनता : एक चुनौती' },
          { id: 'u9sst4t4', title: 'भारत में खाद्य सुरक्षा' }
        ]}
      ]
    },
    {
      id: 'up9_hin',
      name: 'हिन्दी (Hindi)',
      chapters: [
        { id: 'u9h1', title: 'गद्य खण्ड', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
          { id: 'u9h1t1', title: 'बात (प्रतापनारायण मिश्र), मंत्र (प्रेमचन्द), गुरु नानक देव (हजारी प्रसाद द्विवेदी)' },
          { id: 'u9h1t2', title: 'गिल्लू (महादेवी वर्मा), स्मृति (श्रीराम शर्मा)' },
          { id: 'u9h1t3', title: 'निष्ठामूर्ति कस्तूरबा (काका कालेलकर), ठेले पर हिमालय (धर्मवीर भारती)' }
        ]},
        { id: 'u9h2', title: 'काव्य खण्ड', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
          { id: 'u9h2t1', title: 'कबीर (साखी), रैदास (प्रभु जी तुम चन्दन हम पानी)' },
          { id: 'u9h2t2', title: 'मीराबाई (पदावली), रहीम (दोहे)' },
          { id: 'u9h2t3', title: 'भारतेन्दु हरिश्चन्द्र (प्रेम माधुरी), मैथिलीशरण गुप्त (पंचवटी)' },
          { id: 'u9h2t4', title: 'जयशंकर प्रसाद (पुनर्मिलन), सूर्यकान्त त्रिपाठी निराला (दान)' },
          { id: 'u9h2t5', title: 'सोहनलाल द्विवेदी (उन्हें प्रणाम)' }
        ]},
        { id: 'u9h3', title: 'संस्कृत खण्ड', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
          { id: 'u9h3t1', title: 'वन्दना, सदाचारः, पुरुषोत्तमः रामः' },
          { id: 'u9h3t2', title: 'सिद्धिमंत्रः, सुभाषितानि, परमहंसः रामकृष्णः, कृष्णः गोपालनन्दनः' }
        ]},
        { id: 'u9h4', title: 'एकांकी एवं व्याकरण', officialWeightage: 'Grammar', pyqPriority: 'HIGH', topics: [
          { id: 'u9h4t1', title: 'एकांकी: दीपदान, नए मेहमान' },
          { id: 'u9h4t2', title: 'रस, छंद, अलंकार, शब्द-रचना, संधि, समास, शब्द रूप, धातु रूप' }
        ]}
      ]
    },
    {
      id: 'up9_eng',
      name: 'English',
      chapters: [
        { id: 'u9e1', title: 'Prose (Beehive)', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
          { id: 'u9e1t1', title: 'The Fun They Had, The Sound of Music, The Little Girl' },
          { id: 'u9e1t2', title: 'A Truly Beautiful Mind, The Snake and the Mirror, My Childhood' },
          { id: 'u9e1t3', title: 'Reach for the Top, Kathmandu, If I Were You' }
        ]},
        { id: 'u9e2', title: 'Poetry (Beehive)', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
          { id: 'u9e2t1', title: 'The Road Not Taken, Wind, Rain on the Roof, The Lake Isle of Innisfree' },
          { id: 'u9e2t2', title: 'A Legend of the Northland, No Men Are Foreign, On Killing a Tree, A Slumber Did My Spirit Seal' }
        ]},
        { id: 'u9e3', title: 'Supplementary (Moments)', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [
          { id: 'u9e3t1', title: 'The Lost Child, The Adventures of Toto, Iswaran the Storyteller' },
          { id: 'u9e3t2', title: 'In the Kingdom of Fools, The Happy Prince, Weathering the Storm in Ersama' },
          { id: 'u9e3t3', title: 'The Last Leaf, A House is Not a Home, The Beggar' }
        ]},
        { id: 'u9e4', title: 'Grammar & Writing', officialWeightage: 'Grammar', pyqPriority: 'HIGH', topics: [
          { id: 'u9e4t1', title: 'Parts of Speech, Tenses, Passive Voice, Punctuation' },
          { id: 'u9e4t2', title: 'Translation (Hindi to English)' },
          { id: 'u9e4t3', title: 'Letter/Application Writing, Descriptive Paragraph/Report/Article' }
        ]}
      ]
    }
  ]
};
