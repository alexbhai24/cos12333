import { SyllabusData } from '../types/syllabus';

export const syllabusUP10: SyllabusData = {
  id: 'up_board_10',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 10',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'up10_hindi',
      name: 'Hindi',
      chapters: [
        {
          id: 'up_hin1',
          title: 'गद्य खंड — हिंदी',
          officialWeightage: 'कुल 70 अंक',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_h1_t1', title: 'ईदगाह — प्रेमचन्द' },
            { id: 'up_h1_t2', title: 'बड़े भाई साहब — प्रेमचन्द' },
            { id: 'up_h1_t3', title: 'पद्माकर — महादेवी वर्मा' },
            { id: 'up_h1_t4', title: 'गौरा — महादेवी वर्मा' },
            { id: 'up_h1_t5', title: 'आत्मत्राण — रवींद्रनाथ टैगोर' }
          ]
        },
        {
          id: 'up_hin2',
          title: 'काव्य खंड — हिंदी',
          officialWeightage: 'कुल 70 अंक',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_h2_t1', title: 'सूरदास के पद' },
            { id: 'up_h2_t2', title: 'तुलसीदास: विनय पत्रिका और रामचरितमानस' },
            { id: 'up_h2_t3', title: 'जयशंकर प्रसाद: कामायनी से' },
            { id: 'up_h2_t4', title: 'सुभद्रा कुमारी चौहान: झाँसी की रानी' }
          ]
        },
        {
          id: 'up_hin3',
          title: 'व्याकरण — हिंदी',
          officialWeightage: 'कुल 70 अंक',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_h3_t1', title: 'संज्ञा, सर्वनाम, विशेषण, क्रिया' },
            { id: 'up_h3_t2', title: 'संधि, समास' },
            { id: 'up_h3_t3', title: 'रस, छन्द, अलंकार' },
            { id: 'up_h3_t4', title: 'पत्र-लेखन, निबन्ध' }
          ]
        }
      ]
    },
    {
      id: 'up10_english',
      name: 'English',
      chapters: [
        {
          id: 'up_eng1',
          title: 'Prose (First Language)',
          officialWeightage: '70 Marks Written + 30 Marks Internal',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_e1_t1', title: 'The Aged Mother (Matsuo Basho)' },
            { id: 'up_e1_t2', title: 'The Dear Departed (Stanley Houghton)' },
            { id: 'up_e1_t3', title: 'The Bangle Sellers (Sarojini Naidu — Poetry)' },
            { id: 'up_e1_t4', title: 'If (Rudyard Kipling — Poetry)' }
          ]
        },
        {
          id: 'up_eng2',
          title: 'Grammar and Writing',
          officialWeightage: 'Part of 70 Marks',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_e2_t1', title: 'Tenses, Voice, Narration' },
            { id: 'up_e2_t2', title: 'Transformation and Combination of sentences' },
            { id: 'up_e2_t3', title: 'Letter Writing (Formal and Informal)' },
            { id: 'up_e2_t4', title: 'Essay and Comprehension' }
          ]
        }
      ]
    },
    {
      id: 'up10_math',
      name: 'Mathematics',
      chapters: [
        {
          id: 'up_m1',
          title: 'संख्या पद्धति (Number Systems)',
          officialWeightage: 'वास्तविक संख्याएँ',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_m1_t1', title: 'वास्तविक संख्याएँ और अपरिमेय संख्याएँ' },
            { id: 'up_m1_t2', title: 'अभाज्य गुणनखंड प्रमेय (HCF और LCM)' }
          ]
        },
        {
          id: 'up_m2',
          title: 'बहुपद (Polynomials)',
          officialWeightage: 'बीजगणित',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_m2_t1', title: 'बहुपद के शून्यक और गुणांकों में संबंध' },
            { id: 'up_m2_t2', title: 'द्विघात बहुपद का विभाजन एल्गोरिथ्म' }
          ]
        },
        {
          id: 'up_m3',
          title: 'द्विघात समीकरण (Quadratic Equations)',
          officialWeightage: 'बीजगणित',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_m3_t1', title: 'गुणनखंड विधि और श्रीधराचार्य सूत्र' },
            { id: 'up_m3_t2', title: 'मूलों की प्रकृति: विविक्तकर' }
          ]
        },
        {
          id: 'up_m4',
          title: 'समांतर श्रेढ़ी (Arithmetic Progression)',
          officialWeightage: 'बीजगणित',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_m4_t1', title: 'AP का nवाँ पद' },
            { id: 'up_m4_t2', title: 'AP के n पदों का योग' }
          ]
        },
        {
          id: 'up_m5',
          title: 'त्रिकोणमिति (Trigonometry)',
          officialWeightage: 'त्रिकोणमिति',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_m5_t1', title: 'त्रिकोणमितीय अनुपात और पहचान' },
            { id: 'up_m5_t2', title: 'ऊँचाई और दूरी' }
          ]
        },
        {
          id: 'up_m6',
          title: 'वृत्त (Circles)',
          officialWeightage: 'ज्यामिति',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_m6_t1', title: 'स्पर्शरेखा: गुण और प्रमेय' },
            { id: 'up_m6_t2', title: 'जीवा और वृत्तखंड' }
          ]
        },
        {
          id: 'up_m7',
          title: 'पृष्ठीय क्षेत्रफल और आयतन',
          officialWeightage: 'क्षेत्रमिति',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_m7_t1', title: 'बेलन, शंकु, गोले का पृष्ठीय क्षेत्रफल और आयतन' },
            { id: 'up_m7_t2', title: 'ठोसों के संयोजन' }
          ]
        },
        {
          id: 'up_m8',
          title: 'सांख्यिकी (Statistics)',
          officialWeightage: 'सांख्यिकी',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_m8_t1', title: 'माध्य, माध्यिका, बहुलक (वर्गीकृत आँकड़ें)' },
            { id: 'up_m8_t2', title: 'संचयी बारम्बारता वक्र (Ogive)' }
          ]
        }
      ]
    },
    {
      id: 'up10_sci',
      name: 'Science',
      chapters: [
        {
          id: 'up_s1',
          title: 'रासायनिक अभिक्रियाएँ एवं समीकरण',
          officialWeightage: 'भौतिक जगत + रासायनिक पदार्थ',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_s1_t1', title: 'रासायनिक समीकरणों को संतुलित करना' },
            { id: 'up_s1_t2', title: 'ऑक्सीकरण-अपचयन' },
            { id: 'up_s1_t3', title: 'संयोजन, वियोजन, विस्थापन, द्विविस्थापन' }
          ]
        },
        {
          id: 'up_s2',
          title: 'अम्ल, क्षार और लवण',
          officialWeightage: 'रासायनिक पदार्थ',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_s2_t1', title: 'pH पैमाना और उसके अनुप्रयोग' },
            { id: 'up_s2_t2', title: 'महत्वपूर्ण लवण: NaCl, Na2CO3, NaHCO3' }
          ]
        },
        {
          id: 'up_s3',
          title: 'धातु एवं अधातु',
          officialWeightage: 'रासायनिक पदार्थ',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_s3_t1', title: 'धातुओं के भौतिक एवं रासायनिक गुण' },
            { id: 'up_s3_t2', title: 'धातुओं का निष्कर्षण' },
            { id: 'up_s3_t3', title: 'संक्षारण एवं उसकी रोकथाम' }
          ]
        },
        {
          id: 'up_s4',
          title: 'जैव प्रक्रम (Life Processes)',
          officialWeightage: 'जीव जगत',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_s4_t1', title: 'पोषण: स्वपोषी और विषमपोषी' },
            { id: 'up_s4_t2', title: 'श्वसन: वायवीय और अवायवीय' },
            { id: 'up_s4_t3', title: 'परिवहन (रक्त, जाइलम, फ्लोएम)' },
            { id: 'up_s4_t4', title: 'उत्सर्जन: मानव उत्सर्जन तंत्र' }
          ]
        },
        {
          id: 'up_s5',
          title: 'प्रकाश: परावर्तन एवं अपवर्तन',
          officialWeightage: 'प्राकृतिक घटनाएँ',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_s5_t1', title: 'गोलीय दर्पण: सूत्र और आवर्धन' },
            { id: 'up_s5_t2', title: 'लेंस: प्रकार, सूत्र और आवर्धन' }
          ]
        },
        {
          id: 'up_s6',
          title: 'विद्युत',
          officialWeightage: 'विद्युत धारा के प्रभाव',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_s6_t1', title: 'ओम का नियम, प्रतिरोध, प्रतिरोधकता' },
            { id: 'up_s6_t2', title: 'श्रेणी और समांतर क्रम में प्रतिरोध' },
            { id: 'up_s6_t3', title: 'विद्युत शक्ति और ऊर्जा' }
          ]
        },
        {
          id: 'up_s7',
          title: 'विद्युत धारा के चुंबकीय प्रभाव',
          officialWeightage: 'विद्युत धारा के प्रभाव',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_s7_t1', title: 'चुंबकीय क्षेत्र और फ्लेमिंग नियम' },
            { id: 'up_s7_t2', title: 'विद्युत मोटर एवं जनरेटर' }
          ]
        },
        {
          id: 'up_s8',
          title: 'हमारा पर्यावरण',
          officialWeightage: 'प्राकृतिक संसाधन',
          pyqPriority: 'MEDIUM',
          topics: [
            { id: 'up_s8_t1', title: 'पारिस्थितिक तंत्र: खाद्य श्रृंखला और जाल' },
            { id: 'up_s8_t2', title: 'ओजोन परत और प्रदूषण' }
          ]
        }
      ]
    },
    {
      id: 'up10_sst',
      name: 'Social Science',
      chapters: [
        {
          id: 'up_sst1',
          title: 'यूरोप में राष्ट्रवाद का उदय (History)',
          officialWeightage: 'इतिहास',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_ss1_t1', title: 'फ्रांसीसी क्रांति और राष्ट्र की अवधारणा' },
            { id: 'up_ss1_t2', title: 'जर्मनी और इटली का एकीकरण' }
          ]
        },
        {
          id: 'up_sst2',
          title: 'भारत में राष्ट्रवाद (History)',
          officialWeightage: 'इतिहास',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_ss2_t1', title: 'असहयोग आंदोलन' },
            { id: 'up_ss2_t2', title: 'सविनय अवज्ञा आंदोलन' }
          ]
        },
        {
          id: 'up_sst3',
          title: 'संसाधन एवं विकास (Geography)',
          officialWeightage: 'भूगोल',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_ss3_t1', title: 'संसाधनों के प्रकार: प्राकृतिक, मानवीय' },
            { id: 'up_ss3_t2', title: 'मृदा संसाधन और भूमि उपयोग' }
          ]
        },
        {
          id: 'up_sst4',
          title: 'लोकतंत्र और विविधता (Political Science)',
          officialWeightage: 'राजनीति विज्ञान',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_ss4_t1', title: 'जाति, धर्म और लिंग' },
            { id: 'up_ss4_t2', title: 'राजनीतिक दल एवं लोकतंत्र' }
          ]
        },
        {
          id: 'up_sst5',
          title: 'विकास (Economics)',
          officialWeightage: 'अर्थशास्त्र',
          pyqPriority: 'HIGH',
          topics: [
            { id: 'up_ss5_t1', title: 'विकास के लक्ष्य और मापन' },
            { id: 'up_ss5_t2', title: 'मानव विकास सूचकांक (HDI)' }
          ]
        }
      ]
    }
  ]
};
