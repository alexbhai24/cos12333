import { SyllabusData } from '../types/syllabus';

// UP Board Class 8 | Session 2026-27 (Hindi Medium)
// Source: upmsp.edu.in / UP SCERT

export const syllabusUP8: SyllabusData = {
  id: 'up_board_8',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 8',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'up8_math',
      name: 'गणित (Mathematics)',
      chapters: [
        { id: 'u8m1', title: 'परिमेय संख्याएँ', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8m1t1', title: 'परिमेय संख्याओं पर संक्रियाएँ' }] },
        { id: 'u8m2', title: 'वर्गमूल', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8m2t1', title: 'वर्ग और वर्गमूल' }] },
        { id: 'u8m3', title: 'घनमूल', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8m3t1', title: 'घन और घनमूल' }] },
        { id: 'u8m4', title: 'बीजगणित', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8m4t1', title: 'सर्वसमिकाएँ, बीजीय व्यंजकों का भाग एवं गुणनखण्ड, युगपत समीकरण' }] },
        { id: 'u8m5', title: 'समान्तर रेखाएँ', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8m5t1', title: 'समान्तर रेखाएँ और तिर्यक रेखा' }] },
        { id: 'u8m6', title: 'चतुर्भुज की रचनाएँ', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8m6t1', title: 'चतुर्भुज की रचना' }] },
        { id: 'u8m7', title: 'वाणिज्य गणित', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8m7t1', title: 'चक्रवृद्धि ब्याज, बैंक की जानकारी, कर (Tax)' }] },
        { id: 'u8m8', title: 'सांख्यिकी', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'u8m8t1', title: 'पाई ग्राफ (वृत्तारेख), प्रायिकता (संभावना)' }] },
        { id: 'u8m9', title: 'क्षेत्रमिति', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8m9t1', title: 'वृत्त का क्षेत्रफल, बेलन, शंकु का पृष्ठीय क्षेत्रफल और आयतन' }] }
      ]
    },
    {
      id: 'up8_sci',
      name: 'विज्ञान (Science)',
      chapters: [
        { id: 'u8s1', title: 'विज्ञान एवं तकनीकी के क्षेत्र में नवीनतम प्रगति', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8s1t1', title: 'संचार, रक्षा, अंतरिक्ष' }] },
        { id: 'u8s2', title: 'मानव निर्मित वस्तुएँ', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8s2t1', title: 'प्लास्टिक, काँच, साबुन' }] },
        { id: 'u8s3', title: 'परमाणु की संरचना', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8s3t1', title: 'इलेक्ट्रॉन, प्रोटॉन, न्यूट्रॉन, समस्थानिक' }] },
        { id: 'u8s4', title: 'खनिज एवं धातु', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8s4t1', title: 'अयस्क, धातुकर्म' }] },
        { id: 'u8s5', title: 'सूक्ष्मजीवों का सामान्य परिचय', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8s5t1', title: 'जीवाणु, विषाणु, कवक, शैवाल, प्रोटोजोआ' }] },
        { id: 'u8s6', title: 'कोशिका से अंग तंत्र तक', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8s6t1', title: 'कोशिका संरचना, ऊतक' }] },
        { id: 'u8s7', title: 'किशोरावस्था', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8s7t1', title: 'शारीरिक और मानसिक परिवर्तन' }] },
        { id: 'u8s8', title: 'दिव्यांगता', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'u8s8t1', title: 'प्रकार और कारण' }] },
        { id: 'u8s9', title: 'फसल उत्पादन', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8s9t1', title: 'कृषि पद्धतियाँ, हरित क्रांति' }] },
        { id: 'u8s10', title: 'बल तथा दाब', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8s10t1', title: 'दाब, वायुमंडलीय दाब, उत्पलावन बल' }] },
        { id: 'u8s11', title: 'विद्युत धारा', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8s11t1', title: 'विद्युत परिपथ, सुचालक, कुचालक' }] },
        { id: 'u8s12', title: 'चुम्बकत्व', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8s12t1', title: 'पृथ्वी का चुम्बकत्व, विद्युत चुम्बक' }] }
      ]
    },
    {
      id: 'up8_sst',
      name: 'हमारा इतिहास और नागरिक जीवन (SST)',
      chapters: [
        { id: 'u8sst1', title: 'यूरोपीय शक्तियों का भारत में आगमन', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8sst1t1', title: 'पुर्तगाली, डच, फ्रांसीसी, अंग्रेज' }] },
        { id: 'u8sst2', title: 'अंग्रेजी राज्य की स्थापना', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8sst2t1', title: 'प्लासी, बक्सर, कंपनी का विस्तार' }] },
        { id: 'u8sst3', title: 'कम्पनी का प्रभाव और नीतियाँ', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8sst3t1', title: 'स्थायी बंदोबस्त, रैयतवाड़ी, महालवाड़ी' }] },
        { id: 'u8sst4', title: 'प्रथम स्वतंत्रता संग्राम - 1857', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8sst4t1', title: 'कारण, घटनाएँ, परिणाम' }] },
        { id: 'u8sst5', title: 'नवजागरण', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8sst5t1', title: 'समाज सुधार आंदोलन' }] },
        { id: 'u8sst6', title: 'भारत का स्वतंत्रता आंदोलन', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8sst6t1', title: 'राष्ट्रीय कांग्रेस, गाँधी युग, विभाजन' }] },
        { id: 'u8sst7', title: 'हमारा लोकतंत्र (नागरिक जीवन)', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8sst7t1', title: 'लोकतंत्र के सिद्धांत' }] },
        { id: 'u8sst8', title: 'देश की सुरक्षा और विदेश नीति', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'u8sst8t1', title: 'सशस्त्र सेनाएँ, गुटनिरपेक्षता' }] }
      ]
    },
    {
      id: 'up8_earth',
      name: 'पृथ्वी और हमारा जीवन (Geography)',
      chapters: [
        { id: 'u8g1', title: 'संसाधन', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8g1t1', title: 'संसाधनों के प्रकार' }] },
        { id: 'u8g2', title: 'भारत : कृषि एवं सिंचाई', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8g2t1', title: 'प्रमुख फसलें, सिंचाई के साधन' }] },
        { id: 'u8g3', title: 'भारत : खनिज सम्पदा', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8g3t1', title: 'धात्विक एवं अधात्विक खनिज' }] },
        { id: 'u8g4', title: 'भारत : ऊर्जा संसाधन', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8g4t1', title: 'कोयला, पेट्रोलियम, जल विद्युत, सौर ऊर्जा' }] },
        { id: 'u8g5', title: 'भारत : उद्योग धंधे', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8g5t1', title: 'कुटीर, लघु और भारी उद्योग' }] },
        { id: 'u8g6', title: 'भारत : यातायात, व्यापार और संचार', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8g6t1', title: 'सड़क, रेल, जल, वायु मार्ग' }] },
        { id: 'u8g7', title: 'भारत : मानव संसाधन', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'u8g7t1', title: 'जनसंख्या का वितरण' }] },
        { id: 'u8g8', title: 'उत्तर प्रदेश (UP Special)', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8g8t1', title: 'उत्तर प्रदेश की अर्थव्यवस्था, पर्यटन' }] }
      ]
    },
    {
      id: 'up8_hin',
      name: 'मंजरी (Hindi)',
      chapters: [
        { id: 'u8h1', title: 'गद्य एवं पद्य', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8h1t1', title: 'वीणावादिनी वर दे, काकी, सच्ची वीरता, अपराजिता आदि' }] },
        { id: 'u8h2', title: 'महान व्यक्तित्व', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'u8h2t1', title: 'महापुरुषों के प्रेरक प्रसंग' }] },
        { id: 'u8h3', title: 'व्याकरण', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8h3t1', title: 'अलंकार, वाक्य रचना, समास, निबंध' }] }
      ]
    },
    {
      id: 'up8_eng',
      name: 'Rainbow (English)',
      chapters: [
        { id: 'u8e1', title: 'Prose & Poetry', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8e1t1', title: 'Another Chance, The Kabuliwallah, Right Choice, The Missle Man of India, etc.' }] },
        { id: 'u8e2', title: 'Grammar', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u8e2t1', title: 'Direct and Indirect Speech, Active and Passive Voice, Transformation of Sentences' }] }
      ]
    }
  ]
};
