import { SyllabusData } from '../types/syllabus';

// UP Board Class 6 | Session 2026-27 (Hindi Medium)
// Source: upmsp.edu.in / UP SCERT
// Note: UP Board upper primary (6-8) uses SCERT books which map closely to NCERT concepts.

export const syllabusUP6: SyllabusData = {
  id: 'up_board_6',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 6',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    {
      id: 'up6_math',
      name: 'गणित (Mathematics)',
      chapters: [
        { id: 'u6m1', title: 'प्राकृतिक संख्याएँ', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6m1t1', title: 'प्राकृतिक और पूर्ण संख्याएँ' }] },
        { id: 'u6m2', title: 'पूर्ण संख्याएँ', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6m2t1', title: 'पूर्ण संख्याओं पर संक्रियाएँ' }] },
        { id: 'u6m3', title: 'पूर्णांक', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6m3t1', title: 'धनात्मक और ऋणात्मक पूर्णांक' }] },
        { id: 'u6m4', title: 'सांख्यिकी', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'u6m4t1', title: 'आँकड़ों का प्रबंधन, बार-ग्राफ' }] },
        { id: 'u6m5', title: 'बीजगणित अवधारणा', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6m5t1', title: 'चर और अचर, बीजीय व्यंजक' }] },
        { id: 'u6m6', title: 'ज्यामिति', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6m6t1', title: 'आधारभूत ज्यामितीय अवधारणाएँ (बिंदु, रेखा, कोण)' }] },
        { id: 'u6m7', title: 'ल.स. और म.स.', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6m7t1', title: 'LCM और HCF' }] },
        { id: 'u6m8', title: 'समीकरण', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6m8t1', title: 'एक चर वाले रैखिक समीकरण' }] },
        { id: 'u6m9', title: 'वाणिज्य गणित', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6m9t1', title: 'अनुपात, समानुपात, प्रतिशत' }] },
        { id: 'u6m10', title: 'क्षेत्रमिति', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6m10t1', title: 'परिमाप और क्षेत्रफल' }] }
      ]
    },
    {
      id: 'up6_sci',
      name: 'विज्ञान (Science)',
      chapters: [
        { id: 'u6s1', title: 'दैनिक जीवन में विज्ञान', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s1t1', title: 'विज्ञान का महत्त्व' }] },
        { id: 'u6s2', title: 'पदार्थ एवं पदार्थ के समूह', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s2t1', title: 'पदार्थ की अवस्थाएँ' }] },
        { id: 'u6s3', title: 'पदार्थों का पृथक्करण', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s3t1', title: 'मिश्रण और उनके पृथक्करण की विधियाँ' }] },
        { id: 'u6s4', title: 'आस-पास के परिवर्तन', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s4t1', title: 'भौतिक और रासायनिक परिवर्तन' }] },
        { id: 'u6s5', title: 'तन्तु से वस्त्र तक', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'u6s5t1', title: 'विभिन्न प्रकार के रेशे' }] },
        { id: 'u6s6', title: 'जीव जगत', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s6t1', title: 'सजीवों के लक्षण' }] },
        { id: 'u6s7', title: 'जन्तुओं में संरचना व कार्य', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s7t1', title: 'जन्तुओं के विभिन्न अंग' }] },
        { id: 'u6s8', title: 'भोजन एवं स्वास्थ्य', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s8t1', title: 'संतुलित आहार, कुपोषण' }] },
        { id: 'u6s9', title: 'मापन', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s9t1', title: 'लंबाई, द्रव्यमान, समय का मापन' }] },
        { id: 'u6s10', title: 'गति', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s10t1', title: 'गति के प्रकार' }] },
        { id: 'u6s11', title: 'ऊर्जा', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s11t1', title: 'ऊर्जा के स्रोत' }] },
        { id: 'u6s12', title: 'प्रकाश', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s12t1', title: 'प्रकाश के स्रोत, छाया' }] },
        { id: 'u6s13', title: 'चुम्बकत्व', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6s13t1', title: 'चुम्बक और उसके गुण' }] }
      ]
    },
    {
      id: 'up6_sst',
      name: 'हमारा इतिहास और नागरिक जीवन (SST)',
      chapters: [
        { id: 'u6sst1', title: 'इतिहास जानने के स्रोत', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6sst1t1', title: 'पुरातत्त्व, साहित्य' }] },
        { id: 'u6sst2', title: 'पाषाण काल : आखेटक संग्राहक एवं उत्पादक', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6sst2t1', title: 'पुरापाषाण, मध्यपाषाण, नवपाषाण' }] },
        { id: 'u6sst3', title: 'नदी घाटी की सभ्यता : हड़प्पा सभ्यता', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6sst3t1', title: 'सिंधु घाटी सभ्यता' }] },
        { id: 'u6sst4', title: 'वैदिक काल', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6sst4t1', title: 'आर्यों का आगमन, वैदिक साहित्य' }] },
        { id: 'u6sst5', title: 'महाजनपद काल', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6sst5t1', title: 'सोलह महाजनपद' }] },
        { id: 'u6sst6', title: 'मौर्य साम्राज्य', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6sst6t1', title: 'चन्द्रगुप्त, अशोक' }] },
        { id: 'u6sst7', title: 'हमारा समाज (नागरिक जीवन)', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6sst7t1', title: 'समाज की आवश्यकता' }] },
        { id: 'u6sst8', title: 'ग्रामीण एवं नगरीय जीवन', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6sst8t1', title: 'गाँव और शहर का जीवन' }] },
        { id: 'u6sst9', title: 'स्थानीय स्वशासन', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6sst9t1', title: 'ग्राम पंचायत, नगर निगम' }] }
      ]
    },
    {
      id: 'up6_earth',
      name: 'पृथ्वी और हमारा जीवन (Geography)',
      chapters: [
        { id: 'u6g1', title: 'सौरमण्डल में पृथ्वी', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6g1t1', title: 'ग्रह, उपग्रह, सूर्य' }] },
        { id: 'u6g2', title: 'पृथ्वी और चन्द्रमा', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6g2t1', title: 'चन्द्रमा की कलाएँ, ग्रहण' }] },
        { id: 'u6g3', title: 'ग्लोब : अक्षांश एवं देशान्तर', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6g3t1', title: 'अक्षांश, देशान्तर रेखाएँ' }] },
        { id: 'u6g4', title: 'पृथ्वी की गतियाँ', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6g4t1', title: 'परिभ्रमण और परिक्रमण' }] },
        { id: 'u6g5', title: 'मानचित्रण', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'u6g5t1', title: 'मानचित्र के घटक' }] },
        { id: 'u6g6', title: 'महाद्वीप और महासागर', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6g6t1', title: 'पृथ्वी के प्रमुख परिमण्डल' }] },
        { id: 'u6g7', title: 'भारत : भौतिक स्वरूप', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6g7t1', title: 'पर्वत, पठार, मैदान' }] }
      ]
    },
    {
      id: 'up6_hin',
      name: 'अक्षरा (Hindi)',
      chapters: [
        { id: 'u6h1', title: 'गद्य एवं पद्य', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6h1t1', title: 'कविताएँ, कहानियाँ, निबंध' }] },
        { id: 'u6h2', title: 'महान व्यक्तित्व', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'MEDIUM', topics: [{ id: 'u6h2t1', title: 'ऐतिहासिक महापुरुषों की जीवनियाँ' }] },
        { id: 'u6h3', title: 'व्याकरण', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6h3t1', title: 'संज्ञा, सर्वनाम, विशेषण, विलोम, पर्यायवाची' }] }
      ]
    },
    {
      id: 'up6_eng',
      name: 'Rainbow (English)',
      chapters: [
        { id: 'u6e1', title: 'Prose & Poetry', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6e1t1', title: 'Learning Together, Sharing and Caring, The Magic Show, etc.' }] },
        { id: 'u6e2', title: 'Grammar', officialWeightage: 'NO_BOARD_EXAM', pyqPriority: 'HIGH', topics: [{ id: 'u6e2t1', title: 'Nouns, Pronouns, Verbs, Adjectives, Prepositions' }] }
      ]
    }
  ]
};
