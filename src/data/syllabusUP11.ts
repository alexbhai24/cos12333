import { SyllabusData } from '../types/syllabus';

// UP Board Class 11 | Session 2026-27 (Hindi Medium)
// Source: upmsp.edu.in
// Note: UP Board uses NCERT curriculum. Syllabus matches CBSE translated to Hindi.

export const syllabusUP11PCM: SyllabusData = {
  id: 'up_board_11_pcm',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'up11_phy',
      name: 'भौतिक विज्ञान (Physics)',
      chapters: [
        { id: 'u11p1', title: 'भौतिक जगत तथा मापन', officialWeightage: 'Unit 1 (23 Marks with U2)', pyqPriority: 'HIGH', topics: [{ id: 'u11p1t1', title: 'मात्रक और मापन' }] },
        { id: 'u11p2', title: 'शुद्ध गतिकी', officialWeightage: 'Unit 2', pyqPriority: 'HIGH', topics: [{ id: 'u11p2t1', title: 'सरल रेखा में गति; समतल में गति' }] },
        { id: 'u11p3', title: 'गति के नियम', officialWeightage: 'Unit 3 (17 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'u11p3t1', title: 'न्यूटन के गति के नियम' }] },
        { id: 'u11p4', title: 'कार्य, ऊर्जा और शक्ति', officialWeightage: 'Unit 4 (17 Marks with U5,6)', pyqPriority: 'HIGH', topics: [{ id: 'u11p4t1', title: 'कार्य, ऊर्जा और शक्ति' }] },
        { id: 'u11p5', title: 'कणों के निकाय तथा घूर्णी गति', officialWeightage: 'Unit 5', pyqPriority: 'HIGH', topics: [{ id: 'u11p5t1', title: 'द्रव्यमान केंद्र, घूर्णी गति' }] },
        { id: 'u11p6', title: 'गुरुत्वाकर्षण', officialWeightage: 'Unit 6', pyqPriority: 'HIGH', topics: [{ id: 'u11p6t1', title: 'गुरुत्वाकर्षण के नियम' }] },
        { id: 'u11p7', title: 'स्थूल द्रव्य के गुण', officialWeightage: 'Unit 7 (20 Marks with U8,9)', pyqPriority: 'HIGH', topics: [{ id: 'u11p7t1', title: 'ठोसों और तरलों के यांत्रिक गुण; द्रव्य के तापीय गुण' }] },
        { id: 'u11p8', title: 'ऊष्मागतिकी', officialWeightage: 'Unit 8', pyqPriority: 'HIGH', topics: [{ id: 'u11p8t1', title: 'ऊष्मागतिकी के नियम' }] },
        { id: 'u11p9', title: 'आदर्श गैस का व्यवहार तथा गैसों का अणुगति सिद्धांत', officialWeightage: 'Unit 9', pyqPriority: 'MEDIUM', topics: [{ id: 'u11p9t1', title: 'अणुगति सिद्धांत' }] },
        { id: 'u11p10', title: 'दोलन तथा तरंगें', officialWeightage: 'Unit 10 (10 Marks)', pyqPriority: 'HIGH', topics: [{ id: 'u11p10t1', title: 'दोलन; तरंगें' }] }
      ]
    },
    {
      id: 'up11_chem',
      name: 'रसायन विज्ञान (Chemistry)',
      chapters: [
        { id: 'u11c1', title: 'रसायन विज्ञान की कुछ मूल अवधारणाएँ', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11c1t1', title: 'मोल संकल्पना, रासायनिक संयोजन के नियम' }] },
        { id: 'u11c2', title: 'परमाणु की संरचना', officialWeightage: '9 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11c2t1', title: 'क्वांटम संख्याएँ, इलेक्ट्रॉनिक विन्यास' }] },
        { id: 'u11c3', title: 'तत्त्वों का वर्गीकरण एवं गुणधर्मों में आवर्तिता', officialWeightage: '6 Marks', pyqPriority: 'MEDIUM', topics: [{ id: 'u11c3t1', title: 'आवर्त सारणी, आवर्ती प्रवृत्तियाँ' }] },
        { id: 'u11c4', title: 'रासायनिक आबंधन तथा आण्विक संरचना', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11c4t1', title: 'VSEPR, संयोजकता आबंध सिद्धांत, MO सिद्धांत' }] },
        { id: 'u11c5', title: 'ऊष्मागतिकी', officialWeightage: '9 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11c5t1', title: 'एन्थैल्पी, एन्ट्रॉपी, गिब्स ऊर्जा' }] },
        { id: 'u11c6', title: 'साम्यावस्था', officialWeightage: '7 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11c6t1', title: 'रासायनिक और आयनिक साम्य' }] },
        { id: 'u11c7', title: 'अपचयोपचय (रेडॉक्स) अभिक्रियाएँ', officialWeightage: '4 Marks', pyqPriority: 'MEDIUM', topics: [{ id: 'u11c7t1', title: 'ऑक्सीकरण संख्या' }] },
        { id: 'u11c8', title: 'कार्बनिक रसायन: कुछ आधारभूत सिद्धांत तथा तकनीकें', officialWeightage: '11 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11c8t1', title: 'IUPAC नामकरण, समावयवता, इलेक्ट्रॉनिक विस्थापन' }] },
        { id: 'u11c9', title: 'हाइड्रोकार्बन', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11c9t1', title: 'एल्केन, एल्कीन, एल्काइन, ऐरोमैटिक हाइड्रोकार्बन' }] }
      ]
    },
    {
      id: 'up11_math',
      name: 'गणित (Mathematics)',
      chapters: [
        { id: 'u11m1', title: 'समुच्चय तथा फलन', officialWeightage: '23 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11m1t1', title: 'समुच्चय, संबंध एवं फलन, त्रिकोणमितीय फलन' }] },
        { id: 'u11m2', title: 'बीजगणित', officialWeightage: '25 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11m2t1', title: 'सम्मिश्र संख्याएँ, रैखिक असमिकाएँ, क्रमचय और संचय, द्विपद प्रमेय, अनुक्रम तथा श्रेणी' }] },
        { id: 'u11m3', title: 'निर्देशांक ज्यामिति', officialWeightage: '12 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11m3t1', title: 'सरल रेखाएँ, शंकु परिच्छेद, त्रिविमीय ज्यामिति का परिचय' }] },
        { id: 'u11m4', title: 'कलन', officialWeightage: '8 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11m4t1', title: 'सीमा और अवकलज' }] },
        { id: 'u11m5', title: 'सांख्यिकी तथा प्रायिकता', officialWeightage: '12 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11m5t1', title: 'सांख्यिकी, प्रायिकता' }] }
      ]
    },
    {
      id: 'up11_hin',
      name: 'सामान्य हिन्दी (General Hindi)',
      chapters: [
        { id: 'u11hin1', title: 'गद्य गरिमा', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [{ id: 'u11hin1t1', title: 'भारतेन्दु हरिश्चन्द्र, महावीर प्रसाद द्विवेदी आदि के निबंध' }] },
        { id: 'u11hin2', title: 'काव्यांजलि', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [{ id: 'u11hin2t1', title: 'कबीरदास, सूरदास, तुलसीदास, महाकवि भूषण' }] },
        { id: 'u11hin3', title: 'कथा भारती', officialWeightage: 'Literature', pyqPriority: 'MEDIUM', topics: [{ id: 'u11hin3t1', title: 'बलिदान, आकाशदीप, प्रायश्चित' }] },
        { id: 'u11hin4', title: 'संस्कृत दिग्दर्शिका एवं व्याकरण', officialWeightage: 'Grammar', pyqPriority: 'HIGH', topics: [{ id: 'u11hin4t1', title: 'संस्कृत अनुवाद, रस, छंद, अलंकार, निबंध, पत्र लेखन' }] }
      ]
    },
    {
      id: 'up11_eng',
      name: 'English',
      chapters: [
        { id: 'u11e1', title: 'Prose (Hornbill)', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [{ id: 'u11e1t1', title: 'The Portrait of a Lady, We\'re Not Afraid to Die, Discovering Tut, Silk Road' }] },
        { id: 'u11e2', title: 'Poetry', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [{ id: 'u11e2t1', title: 'A Photograph, The Laburnum Top, The Voice of the Rain, Childhood, Father to Son' }] },
        { id: 'u11e3', title: 'Supplementary (Snapshots)', officialWeightage: 'Literature', pyqPriority: 'HIGH', topics: [{ id: 'u11e3t1', title: 'The Summer of the Beautiful White Horse, The Address, Mother\'s Day, Birth, The Tale of Melon City' }] },
        { id: 'u11e4', title: 'Reading & Writing Skills', officialWeightage: 'Reading & Writing', pyqPriority: 'HIGH', topics: [{ id: 'u11e4t1', title: 'Unseen Passage, Note Making, Poster, Speech, Debate, Letter' }] }
      ]
    }
  ]
};

export const syllabusUP11PCB: SyllabusData = {
  id: 'up_board_11_pcb',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    syllabusUP11PCM.subjects.find(s => s.id === 'up11_phy')!,
    syllabusUP11PCM.subjects.find(s => s.id === 'up11_chem')!,
    {
      id: 'up11_bio',
      name: 'जीव विज्ञान (Biology)',
      chapters: [
        { id: 'u11b1', title: 'जीव जगत में विविधता', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11b1t1', title: 'जीव जगत, जीव जगत का वर्गीकरण, वनस्पति जगत, प्राणि जगत' }] },
        { id: 'u11b2', title: 'जंतुओं और पौधों में संरचनात्मक संगठन', officialWeightage: '10 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11b2t1', title: 'पुष्पी पादपों की आकारिकी, पुष्पी पादपों का शारीर, प्राणियों में संरचनात्मक संगठन' }] },
        { id: 'u11b3', title: 'कोशिका: संरचना एवं कार्य', officialWeightage: '15 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11b3t1', title: 'कोशिका: जीवन की इकाई, जैव अणु, कोशिका चक्र और कोशिका विभाजन' }] },
        { id: 'u11b4', title: 'पादप कार्यकीय', officialWeightage: '12 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11b4t1', title: 'उच्च पादपों में प्रकाश संश्लेषण, पादप में श्वसन, पादप वृद्धि एवं परिवर्धन' }] },
        { id: 'u11b5', title: 'मानव कार्यकीय', officialWeightage: '18 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11b5t1', title: 'श्वसन और गैसों का विनिमय, शरीर द्रव तथा परिसंचरण, उत्सर्जी उत्पाद एवं उनका निष्कासन, गमन एवं संचलन, तंत्रिकीय नियंत्रण एवं समन्वय, रासायनिक समन्वय तथा एकीकरण' }] }
      ]
    },
    syllabusUP11PCM.subjects.find(s => s.id === 'up11_hin')!,
    syllabusUP11PCM.subjects.find(s => s.id === 'up11_eng')!
  ]
};

export const syllabusUP11Commerce: SyllabusData = {
  id: 'up_board_11_commerce',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'up11_acc',
      name: 'बहीखाता तथा लेखाशास्त्र (Accountancy)',
      chapters: [
        { id: 'u11a1', title: 'वित्तीय लेखांकन-I (Financial Accounting-I)', officialWeightage: '50 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11a1t1', title: 'लेखांकन का सैद्धांतिक ढाँचा, लेखांकन प्रक्रिया, बैंक समाधान विवरण, ह्रास, प्रावधान और संचय' }] },
        { id: 'u11a2', title: 'वित्तीय लेखांकन-II (Financial Accounting-II)', officialWeightage: '50 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11a2t1', title: 'एकल स्वामित्व के वित्तीय विवरण (समायोजन सहित और रहित), लेखांकन में कंप्यूटर का उपयोग' }] }
      ]
    },
    {
      id: 'up11_bst',
      name: 'व्यापारिक संगठन (Business Studies)',
      chapters: [
        { id: 'u11bs1', title: 'व्यापार के आधार (Foundations of Business)', officialWeightage: '50 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11bs1t1', title: 'व्यापार की प्रकृति और उद्देश्य, व्यावसायिक संगठनों के स्वरूप, सार्वजनिक, निजी और भूमंडलीय उपक्रम, व्यावसायिक सेवाएँ' }] },
        { id: 'u11bs2', title: 'वित्त एवं व्यापार (Finance and Trade)', officialWeightage: '50 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11bs2t1', title: 'व्यावसायिक वित्त के स्रोत, लघु व्यवसाय, आंतरिक व्यापार, अंतर्राष्ट्रीय व्यापार' }] }
      ]
    },
    {
      id: 'up11_eco',
      name: 'अर्थशास्त्र (Economics)',
      chapters: [
        { id: 'u11ec1', title: 'अर्थशास्त्र में सांख्यिकी (Statistics for Economics)', officialWeightage: '50 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11ec1t1', title: 'परिचय, आँकड़ों का संग्रह, संगठन एवं प्रस्तुतीकरण, सांख्यिकीय उपकरण और उनकी व्याख्या' }] },
        { id: 'u11ec2', title: 'व्यष्टि अर्थशास्त्र का परिचय (Microeconomics)', officialWeightage: '50 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11ec2t1', title: 'परिचय, उपभोक्ता का व्यवहार और माँग, उत्पादक का व्यवहार और पूर्ति, बाजार के स्वरूप और कीमत निर्धारण' }] }
      ]
    },
    syllabusUP11PCM.subjects.find(s => s.id === 'up11_hin')!,
    syllabusUP11PCM.subjects.find(s => s.id === 'up11_eng')!
  ]
};

export const syllabusUP11Arts: SyllabusData = {
  id: 'up_board_11_arts',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 11',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'up11_his',
      name: 'इतिहास (History)',
      chapters: [
        { id: 'u11h1', title: 'विश्व इतिहास के कुछ विषय (Themes in World History)', officialWeightage: '100 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11h1t1', title: 'लेखन कला और शहरी जीवन, तीन महाद्वीपों में फैला हुआ साम्राज्य, यायावर साम्राज्य, तीन वर्ग, बदलती हुई सांस्कृतिक परंपराएँ, मूल निवासियों का विस्थापन, आधुनिकीकरण के रास्ते' }] }
      ]
    },
    {
      id: 'up11_geo',
      name: 'भूगोल (Geography)',
      chapters: [
        { id: 'u11g1', title: 'भौतिक भूगोल के मूल सिद्धांत (Fundamentals of Physical Geography)', officialWeightage: '35 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11g1t1', title: 'भूगोल एक विषय के रूप में, पृथ्वी, भू-आकृतियाँ, जलवायु, महासागर, पृथ्वी पर जीवन' }] },
        { id: 'u11g2', title: 'भारत: भौतिक पर्यावरण (India: Physical Environment)', officialWeightage: '35 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11g2t1', title: 'प्रस्तावना, भू-आकृति विज्ञान, जलवायु, वनस्पति और मृदा, प्राकृतिक संकट तथा आपदाएँ' }] }
      ]
    },
    {
      id: 'up11_pol',
      name: 'नागरिक शास्त्र (Political Science)',
      chapters: [
        { id: 'u11pol1', title: 'भारत का संविधान : सिद्धांत और व्यवहार (Indian Constitution at Work)', officialWeightage: '50 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11pol1t1', title: 'संविधान क्यों और कैसे, भारतीय संविधान में अधिकार, चुनाव और प्रतिनिधित्व, कार्यपालिका, विधायिका, न्यायपालिका, संघवाद, स्थानीय शासन' }] },
        { id: 'u11pol2', title: 'राजनीतिक सिद्धांत (Political Theory)', officialWeightage: '50 Marks', pyqPriority: 'HIGH', topics: [{ id: 'u11pol2t1', title: 'राजनीतिक सिद्धांत: एक परिचय, स्वतंत्रता, समानता, सामाजिक न्याय, अधिकार, नागरिकता, राष्ट्रवाद, धर्मनिरपेक्षता' }] }
      ]
    },
    syllabusUP11PCM.subjects.find(s => s.id === 'up11_hin')!,
    syllabusUP11PCM.subjects.find(s => s.id === 'up11_eng')!
  ]
};
