import { SyllabusData, Subject } from '../types/syllabus';

// UP Board Class 12 | Academic Session 2026-27 (Hindi Medium / NCERT Syllabus)
// Official Source: upmsp.edu.in

export const upBoard12Hindi: Subject = {
  id: 'up12_hin',
  name: 'सामान्य हिन्दी (General Hindi)',
  chapters: [
    {
      id: 'u12hin1',
      title: 'गद्य गरिमा (गद्य संकलन)',
      officialWeightage: '16 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12h1_t1', title: 'राष्ट्र का स्वरूप — डॉ० वासुदेवशरण अग्रवाल' },
        { id: 'u12h1_t2', title: 'रॉबर्ट नर्सिंग होम में — कन्हैयालाल मिश्र \'प्रभाकर\'' },
        { id: 'u12h1_t3', title: 'अशोक के फूल — डॉ० हजारीप्रसाद द्विवेदी' },
        { id: 'u12h1_t4', title: 'भाषा और आधुनिकता — प्रो० जी० सुन्दर रेड्डी' },
        { id: 'u12h1_t5', title: 'निन्दा रस — हरिशंकर परसाई' },
        { id: 'u12h1_t6', title: 'हम और हमारा आदर्श (तेजस्वी मन के सम्पादित अंश) — डॉ० ए० पी० जे० अब्दुल कलाम' }
      ]
    },
    {
      id: 'u12hin2',
      title: 'काव्यांजलि (पद्य भाग)',
      officialWeightage: '14 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12h2_t1', title: 'पवन दूतिका — अयोध्यासिंह उपाध्याय \'हरिऔध\'' },
        { id: 'u12h2_t2', title: 'कैकेयी का अनुताप / गीत — मैथिलीशरण गुप्त' },
        { id: 'u12h2_t3', title: 'श्रद्धा-मनु — जयशंकर प्रसाद' },
        { id: 'u12h2_t4', title: 'नौका विहार / बापू के प्रति — सुमित्रानन्दन पन्त' },
        { id: 'u12h2_t5', title: 'गीत — महादेवी वर्मा' },
        { id: 'u12h2_t6', title: 'अभिनव मनुष्य / पुरुरवा-उर्वशी — रामधारी सिंह \'दिनकर\'' },
        { id: 'u12h2_t7', title: 'मैंने आहुति बनकर देखा / हिरोशिमा — सच्चिदानंद हीरानंद वात्स्यायन \'अज्ञेय\'' }
      ]
    },
    {
      id: 'u12hin3',
      title: 'कथा भारती (कहानियाँ)',
      officialWeightage: '5 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12h3_t1', title: 'ध्रुवयात्रा — जैनेन्द्र कुमार (कथानक, चरित्र-चित्रण)' },
        { id: 'u12h3_t2', title: 'पंचलाइट — फणीश्वरनाथ \'रेणु\' (उद्देश्य एवं सारांश)' },
        { id: 'u12h3_t3', title: 'बहादुर — अमरकान्त (कथावस्तु एवं प्रमुख पात्र)' },
        { id: 'u12h3_t4', title: 'कर्मनाशा की हार — डॉ० शिवप्रसाद सिंह' }
      ]
    },
    {
      id: 'u12hin4',
      title: 'खण्डकाव्य (जिलेवार निर्धारित)',
      officialWeightage: '5 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12h4_t1', title: 'मुक्ति-यज्ञ (सुमित्रानन्दन पन्त) — कानपुर, जौनपुर, मुरादाबाद, फैजाबाद आदि' },
        { id: 'u12h4_t2', title: 'सत्य की जीत (द्वारिकाप्रसाद माहेश्वरी) — लखनऊ, इटावा, बलिया, बिजनौर आदि' },
        { id: 'u12h4_t3', title: 'रश्मिरथी (रामधारी सिंह \'दिनकर\') — वाराणसी, बुलन्दशहर, मथुरा, मुजफ्फरनगर आदि' },
        { id: 'u12h4_t4', title: 'आलोकवृत्त (गुलाब खण्डेलवाल) — प्रयागराज, अलीगढ़, सहारनपुर आदि' },
        { id: 'u12h4_t5', title: 'त्यागपथी (रामेश्वर शुक्ल \'अंचल\') — आगरा, गोरखपुर, गाजीपुर, बरेली आदि' },
        { id: 'u12h4_t6', title: 'श्रवणकुमार (डॉ० शिवबालक शुक्ल) — मेरठ, आजमगढ़, बस्ती आदि' }
      ]
    },
    {
      id: 'u12hin5',
      title: 'संस्कृत दिग्दर्शिका (खण्ड \'ख\')',
      officialWeightage: '14 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12h5_t1', title: 'आत्मज्ञ एवं सर्वज्ञ (गद्यांश अनुवाद)' },
        { id: 'u12h5_t2', title: 'संस्कृतभाषायाः महत्त्वम्' },
        { id: 'u12h5_t3', title: 'जातक-कथा (उलूकजातकम्, नृत्यजातकम्)' },
        { id: 'u12h5_t4', title: 'सुभाषित-रत्नानि (श्लोक संदर्भ व हिन्दी अनुवाद)' },
        { id: 'u12h5_t5', title: 'महामना मालवीयः एवं पञ्चशील-सिद्धान्ताः' }
      ]
    },
    {
      id: 'u12hin6',
      title: 'व्याकरण, रस-छन्द-अलंकार, पत्र व निबन्ध',
      officialWeightage: '46 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12h6_t1', title: 'लोकोक्तियाँ एवं मुहावरे' },
        { id: 'u12h6_t2', title: 'संधि विच्छेद एवं विभक्ति-वचन' },
        { id: 'u12h6_t3', title: 'शब्द-युग्म, अनेकार्थी शब्द, अनेक शब्दों के लिए एक शब्द, वाक्य संशोधन' },
        { id: 'u12h6_t4', title: 'काव्य सौंदर्य के तत्व: रस (श्रृंगार, करुण, हास्य, वीर, शांत), अलंकार, छन्द (चौपाई, दोहा, सोरठा, कुण्डलिया)' },
        { id: 'u12h6_t5', title: 'पत्र लेखन: नियुक्ति आवेदन पत्र, बैंक से ऋण प्राप्त करने हेतु, नगर सफाई अधिकारी को' },
        { id: 'u12h6_t6', title: 'निबन्ध रचना: विज्ञान, पर्यावरण, जनसंख्या, स्वास्थ्य एवं समसामयिक विषय (9 अंक)' }
      ]
    }
  ]
};

export const upBoard12English: Subject = {
  id: 'up12_eng',
  name: 'English',
  chapters: [
    {
      id: 'u12eng1',
      title: 'Section A — Reading Skills',
      officialWeightage: '15 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12e1_t1', title: 'One Long Unseen Passage (Comprehension & Inference)' },
        { id: 'u12e1_t2', title: 'Vocabulary Questions (Synonyms, Antonyms, Contextual Meanings)' }
      ]
    },
    {
      id: 'u12eng2',
      title: 'Section B — Writing Skills',
      officialWeightage: '20 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12e2_t1', title: 'Article Writing (Descriptive, Argumentative) (100–150 words) — 10 Marks' },
        { id: 'u12e2_t2', title: 'Letter to the Editor / Complaints to Authorities / Business Letters — 10 Marks' }
      ]
    },
    {
      id: 'u12eng3',
      title: 'Section C — Grammar & Translation',
      officialWeightage: '25 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12e3_t1', title: 'Narration (Direct & Indirect Speech)' },
        { id: 'u12e3_t2', title: 'Synthesis of Sentences (Simple, Compound, Complex)' },
        { id: 'u12e3_t3', title: 'Transformation of Sentences (Voice, Degree, Interchange)' },
        { id: 'u12e3_t4', title: 'Syntax (Correction of Sentences & Common Errors)' },
        { id: 'u12e3_t5', title: 'Vocabulary: Idioms & Phrases, Synonyms, Antonyms, One-word Substitution, Homophones' },
        { id: 'u12e3_t6', title: 'Translation from Hindi to English (A Passage of 7–8 sentences) — 5 Marks' }
      ]
    },
    {
      id: 'u12eng4',
      title: 'Section D — Flamingo: Prose',
      officialWeightage: '15 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12e4_t1', title: 'The Last Lesson (Alphonse Daudet)' },
        { id: 'u12e4_t2', title: 'Lost Spring: Stories of Stolen Childhood (Anees Jung)' },
        { id: 'u12e4_t3', title: 'Deep Water (William Douglas)' },
        { id: 'u12e4_t4', title: 'The Rattrap (Selma Lagerlöf)' },
        { id: 'u12e4_t5', title: 'Indigo (Louis Fischer)' },
        { id: 'u12e4_t6', title: 'Poets and Pancakes (Asokamitran)' },
        { id: 'u12e4_t7', title: 'The Interview (Christopher Silvester)' },
        { id: 'u12e4_t8', title: 'Going Places (A.R. Barton)' }
      ]
    },
    {
      id: 'u12eng5',
      title: 'Section D — Flamingo: Poetry',
      officialWeightage: '10 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12e5_t1', title: 'My Mother at Sixty-Six (Kamala Das)' },
        { id: 'u12e5_t2', title: 'Keeping Quiet (Pablo Neruda)' },
        { id: 'u12e5_t3', title: 'A Thing of Beauty (John Keats)' },
        { id: 'u12e5_t4', title: 'A Roadside Stand (Robert Frost)' },
        { id: 'u12e5_t5', title: 'Aunt Jennifer\'s Tigers (Adrienne Rich)' },
        { id: 'u12e5_t6', title: 'Poetry Stanza Comprehension & Central Idea Writing' }
      ]
    },
    {
      id: 'u12eng6',
      title: 'Section D — Vistas: Supplementary Reader',
      officialWeightage: '15 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'u12e6_t1', title: 'The Third Level (Jack Finney)' },
        { id: 'u12e6_t2', title: 'The Tiger King (Kalki)' },
        { id: 'u12e6_t3', title: 'Journey to the End of the Earth (Tishani Doshi)' },
        { id: 'u12e6_t4', title: 'The Enemy (Pearl S. Buck)' },
        { id: 'u12e6_t5', title: 'On the Face of It (Susan Hill)' },
        { id: 'u12e6_t6', title: 'Memories of Childhood (Zitkala-Sa & Bama)' }
      ]
    }
  ]
};

export const upBoard12Physics: Subject = {
  id: 'up12_phy',
  name: 'भौतिक विज्ञान (Physics)',
  chapters: [
    {
      id: 'up_phy1',
      title: 'विद्युत आवेश तथा क्षेत्र (Electric Charges and Fields)',
      officialWeightage: 'इकाई 1 — 16 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_p1_t1', title: 'विद्युत आवेश, कूलॉम का नियम तथा अध्यारोपण सिद्धांत' },
        { id: 'up_p1_t2', title: 'विद्युत क्षेत्र रेखाएँ तथा विद्युत द्विध्रुव' },
        { id: 'up_p1_t3', title: 'गाउस का नियम तथा इसके प्रमुख अनुप्रयोग' }
      ]
    },
    {
      id: 'up_phy2',
      title: 'स्थिर-विद्युत विभव तथा धारिता (Electrostatic Potential & Capacitance)',
      officialWeightage: 'इकाई 1 — 16 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_p2_t1', title: 'विद्युत विभव, समविभव पृष्ठ तथा स्थितिज ऊर्जा' },
        { id: 'up_p2_t2', title: 'संधारित्र तथा धारिता: समांतर पट्टिका संधारित्र' },
        { id: 'up_p2_t3', title: 'संधारित्रों का श्रेणी व समांतर संयोजन तथा परावैद्युत' }
      ]
    },
    {
      id: 'up_phy3',
      title: 'विद्युत धारा (Current Electricity)',
      officialWeightage: 'इकाई 2 — 17 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_p3_t1', title: 'ओम का नियम, विद्युत प्रतिरोधकता तथा अपवाह वेग' },
        { id: 'up_p3_t2', title: 'किरचॉफ के नियम तथा परिपथ विश्लेषण' },
        { id: 'up_p3_t3', title: 'व्हीटस्टोन सेतु तथा मीटर सेतु' }
      ]
    },
    {
      id: 'up_phy4',
      title: 'गतिमान आवेश और चुंबकत्व (Moving Charges and Magnetism)',
      officialWeightage: 'इकाई 3 — 17 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_p4_t1', title: 'बायो-सेवर्ट नियम तथा धारावाही वृत्ताकार लूप पर चुंबकीय क्षेत्र' },
        { id: 'up_p4_t2', title: 'एम्पियर का परिपथीय नियम तथा परिनालिका' },
        { id: 'up_p4_t3', title: 'लॉरेंट्ज़ बल तथा चल कुंडली धारामापी' }
      ]
    },
    {
      id: 'up_phy5',
      title: 'चुंबकत्व एवं द्रव्य (Magnetism and Matter)',
      officialWeightage: 'इकाई 3 — 17 अंक',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'up_p5_t1', title: 'चुंबकीय द्विध्रुव तथा भू-चुंबकत्व के तत्व' },
        { id: 'up_p5_t2', title: 'पदार्थों के चुंबकीय गुण: अनुचुंबकीय, प्रतिचुंबकीय, लौहचुंबकीय' }
      ]
    },
    {
      id: 'up_phy6',
      title: 'विद्युत चुंबकीय प्रेरण एवं प्रत्यावर्ती धारा (EMI & AC)',
      officialWeightage: 'इकाई 4 — 17 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_p6_t1', title: 'फैराडे के प्रेरण नियम तथा लेंज का नियम' },
        { id: 'up_p6_t2', title: 'स्वप्रेरण तथा अन्योन्य प्रेरण' },
        { id: 'up_p6_t3', title: 'प्रत्यावर्ती धारा, LCR श्रेणी परिपथ तथा अनुनाद' },
        { id: 'up_p6_t4', title: 'ट्रांसफॉर्मर तथा AC जनित्र' }
      ]
    },
    {
      id: 'up_phy7',
      title: 'विद्युत चुंबकीय तरंगें (Electromagnetic Waves)',
      officialWeightage: 'इकाई 5',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'up_p7_t1', title: 'विस्थापन धारा की संकल्पना' },
        { id: 'up_p7_t2', title: 'विद्युत चुंबकीय स्पेक्ट्रम तथा उनके उपयोग' }
      ]
    },
    {
      id: 'up_phy8',
      title: 'प्रकाशिकी (Optics — Ray & Wave)',
      officialWeightage: 'इकाई 6 — 18 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_p8_t1', title: 'किरण प्रकाशिकी: गोलीय दर्पण, लेंस सूत्र तथा प्रिज्म से अपवर्तन' },
        { id: 'up_p8_t2', title: 'प्रकाशीय यंत्र: सूक्ष्मदर्शी तथा खगोलीय दूरदर्शी' },
        { id: 'up_p8_t3', title: 'तरंग प्रकाशिकी: हाइगेन्स का सिद्धांत, व्यतिकरण तथा यंग का द्वि-स्लिट प्रयोग' },
        { id: 'up_p8_t4', title: 'विवर्तन: एकल स्लिट विवर्तन प्रारूप' }
      ]
    },
    {
      id: 'up_phy9',
      title: 'द्रव्य तथा विकिरण की द्वैत प्रकृति (Dual Nature of Radiation & Matter)',
      officialWeightage: 'इकाई 7 — 11 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_p9_t1', title: 'प्रकाश विद्युत प्रभाव तथा आइंस्टीन का समीकरण' },
        { id: 'up_p9_t2', title: 'दे-ब्रॉग्ली तरंगदैर्ध्य' }
      ]
    },
    {
      id: 'up_phy10',
      title: 'परमाणु तथा नाभिक (Atoms and Nuclei)',
      officialWeightage: 'इकाई 8',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_p10_t1', title: 'रदरफोर्ड व बोर का परमाणु मॉडल, हाइड्रोजन स्पेक्ट्रम' },
        { id: 'up_p10_t2', title: 'नाभिकीय संरचना, द्रव्यमान क्षति, बंधन ऊर्जा, विखंडन एवं संलयन' }
      ]
    },
    {
      id: 'up_phy11',
      title: 'इलेक्ट्रॉनिक युक्तियाँ: अर्धचालक (Semiconductor Electronics)',
      officialWeightage: 'इकाई 9 — 8 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_p11_t1', title: 'ऊर्जा बैंड: चालक, अचालक और अर्धचालक' },
        { id: 'up_p11_t2', title: 'p-n संधि डायोड, दिष्टकारी के रूप में अनुप्रयोग' }
      ]
    }
  ]
};

export const upBoard12Chemistry: Subject = {
  id: 'up12_chem',
  name: 'रसायन विज्ञान (Chemistry)',
  chapters: [
    {
      id: 'up_chem1',
      title: 'विलयन (Solutions)',
      officialWeightage: '7 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_c1_t1', title: 'सांद्रता की इकाइयाँ तथा हेनरी का नियम' },
        { id: 'up_c1_t2', title: 'राउल्ट का नियम, आदर्श व अनादर्श विलयन' },
        { id: 'up_c1_t3', title: 'अणुसंख्य गुणधर्म: क्वथनांक उन्नयन, हिमांक अवनमन, परासरण दाब, वॉन्ट हॉफ गुणांक' }
      ]
    },
    {
      id: 'up_chem2',
      title: 'वैद्युत रसायन (Electrochemistry)',
      officialWeightage: '9 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_c2_t1', title: 'गैल्वेनी सेल तथा नर्नस्ट समीकरण' },
        { id: 'up_c2_t2', title: 'चालकत्व, कोहलराउश का नियम तथा अनुप्रयोग' },
        { id: 'up_c2_t3', title: 'फैराडे के विद्युत अपघटन नियम तथा बैटरी' }
      ]
    },
    {
      id: 'up_chem3',
      title: 'रासायनिक बलगतिकी (Chemical Kinetics)',
      officialWeightage: '7 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_c3_t1', title: 'अभिक्रिया का वेग, कोटि तथा आण्विकता' },
        { id: 'up_c3_t2', title: 'समाकलित वेग समीकरण (शून्य व प्रथम कोटि)' },
        { id: 'up_c3_t3', title: 'आर्रेनियस समीकरण तथा संघट्ट सिद्धांत' }
      ]
    },
    {
      id: 'up_chem4',
      title: 'd- एवं f-ब्लॉक के तत्त्व (d and f Block Elements)',
      officialWeightage: '7 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_c4_t1', title: 'संक्रमण तत्वों के सामान्य अभिलक्षण' },
        { id: 'up_c4_t2', title: 'K2Cr2O7 तथा KMnO4 का विरचन व गुण' },
        { id: 'up_c4_t3', title: 'लैन्थेनॉइड आकुंचन तथा ऐक्टिनॉइड' }
      ]
    },
    {
      id: 'up_chem5',
      title: 'उपसहसंयोजन यौगिक (Coordination Compounds)',
      officialWeightage: '7 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_c5_t1', title: 'वार्नर का सिद्धांत तथा लिगेंड्स' },
        { id: 'up_c5_t2', title: 'उपसहसंयोजन यौगिकों का IUPAC नामकरण व समावयवता' },
        { id: 'up_c5_t3', title: 'संयोजकता आबंध सिद्धांत (VBT) तथा क्रिस्टल क्षेत्र सिद्धांत (CFT)' }
      ]
    },
    {
      id: 'up_chem6',
      title: 'हैलोऐल्केन तथा हैलोऐरीन (Haloalkanes and Haloarenes)',
      officialWeightage: '6 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_c6_t1', title: 'नामकरण तथा विरचन की विधियाँ' },
        { id: 'up_c6_t2', title: 'नाभिकरागी प्रतिस्थापन अभिक्रियाएँ: SN1 और SN2' },
        { id: 'up_c6_t3', title: 'क्लोरोफॉर्म, आयोडोफॉर्म, डीडीटी' }
      ]
    },
    {
      id: 'up_chem7',
      title: 'ऐल्कोहॉल, फीनॉल एवं ईथर (Alcohols, Phenols and Ethers)',
      officialWeightage: '6 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_c7_t1', title: 'ऐल्कोहॉल का विरचन तथा प्राथमिक, द्वितीयक, तृतीयक का परीक्षण' },
        { id: 'up_c7_t2', title: 'फीनॉल की अम्लीय प्रकृति तथा कोल्बे/राइमर-टीमैन अभिक्रिया' },
        { id: 'up_c7_t3', title: 'ईथर का विरचन: विलियमसन संश्लेषण' }
      ]
    },
    {
      id: 'up_chem8',
      title: 'ऐल्डिहाइड, कीटोन एवं कार्बोक्सिलिक अम्ल (Aldehydes, Ketones & Carboxylic Acids)',
      officialWeightage: '8 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_c8_t1', title: 'विरचन, नामकरण तथा नाभिकरागी योग अभिक्रियाएँ' },
        { id: 'up_c8_t2', title: 'ऐल्डोल संघनन तथा कैनिजारो अभिक्रिया' },
        { id: 'up_c8_t3', title: 'कार्बोक्सिलिक अम्लों की अम्लीय प्रबलता तथा अभिक्रियाएँ' }
      ]
    },
    {
      id: 'up_chem9',
      title: 'ऐमीन (Amines)',
      officialWeightage: '6 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_c9_t1', title: 'ऐमीन का विरचन एवं क्षारीय सामर्थ्य' },
        { id: 'up_c9_t2', title: 'हॉफमैन ब्रोमामाइड अभिक्रिया, कार्बिल ऐमीन परीक्षण' },
        { id: 'up_c9_t3', title: 'डायएजोनियम लवण तथा संश्लेषण में उपयोग' }
      ]
    },
    {
      id: 'up_chem10',
      title: 'जैव-अणु (Biomolecules)',
      officialWeightage: '7 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_c10_t1', title: 'कार्बोहाइड्रेट: ग्लूकोज, फ्रुक्टोज की संरचना' },
        { id: 'up_c10_t2', title: 'प्रोटीन: अमीनो अम्ल, पेप्टाइड बंध, विकृतीकरण' },
        { id: 'up_c10_t3', title: 'विटामिन तथा न्यूक्लिक अम्ल: DNA व RNA' }
      ]
    }
  ]
};

export const upBoard12Math: Subject = {
  id: 'up12_math',
  name: 'गणित (Mathematics)',
  chapters: [
    {
      id: 'up_m1',
      title: 'संबंध एवं फलन (Relations and Functions)',
      officialWeightage: '10 अंक',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'up_mm1_t1', title: 'संबंधों के प्रकार: स्वतुल्य, सममित, संक्रामक, तुल्यता संबंध' },
        { id: 'up_mm1_t2', title: 'फलनों के प्रकार: एकैकी, आच्छादक' }
      ]
    },
    {
      id: 'up_m2',
      title: 'प्रतिलोम त्रिकोणमितीय फलन (Inverse Trigonometric Functions)',
      officialWeightage: '10 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_mm2_t1', title: 'परिभाषा, परिसर, प्रांत तथा मुख्य मान शाखाएँ' },
        { id: 'up_mm2_t2', title: 'प्रतिलोम त्रिकोणमितीय फलनों के प्रमुख गुणधर्म' }
      ]
    },
    {
      id: 'up_m3',
      title: 'आव्यूह तथा सारणिक (Matrices and Determinants)',
      officialWeightage: '13 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_mm3_t1', title: 'आव्यूह की संकल्पना, प्रकार तथा बीजगणित' },
        { id: 'up_mm3_t2', title: 'सारणिक के गुणधर्म, उपसारणिक, सहखंड' },
        { id: 'up_mm3_t3', title: 'व्युत्क्रम आव्यूह द्वारा रैखिक समीकरण निकाय का हल' }
      ]
    },
    {
      id: 'up_m4',
      title: 'सांतत्य तथा अवकलनीयता (Continuity and Differentiability)',
      officialWeightage: '44 अंक (इकाई 3)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_mm4_t1', title: 'सांतत्य एवं अवकलनीयता, श्रृंखला नियम' },
        { id: 'up_mm4_t2', title: 'लघुगणकीय तथा प्राचलिक फलनों का अवकलन' },
        { id: 'up_mm4_t3', title: 'द्वितीय कोटि का अवकलज' }
      ]
    },
    {
      id: 'up_m5',
      title: 'अवकलज के अनुप्रयोग (Applications of Derivatives)',
      officialWeightage: '44 अंक (इकाई 3)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_mm5_t1', title: 'परिवर्तन की दर, वर्धमान तथा ह्रासमान फलन' },
        { id: 'up_mm5_t2', title: 'उच्चिष्ठ तथा निम्निष्ठ (Maxima & Minima)' }
      ]
    },
    {
      id: 'up_m6',
      title: 'समाकलन एवं समाकलनों के अनुप्रयोग (Integrals & Applications)',
      officialWeightage: '44 अंक (इकाई 3)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_mm6_t1', title: 'अनिश्चित समाकलन: प्रतिस्थापन, आंशिक भिन्न, खंडशः समाकलन' },
        { id: 'up_mm6_t2', title: 'निश्चित समाकलन तथा इसके प्रगुण' },
        { id: 'up_mm6_t3', title: 'साधारण वक्रों के अंतर्गत क्षेत्रफल' }
      ]
    },
    {
      id: 'up_m7',
      title: 'अवकल समीकरण (Differential Equations)',
      officialWeightage: '44 अंक (इकाई 3)',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_mm7_t1', title: 'कोटि एवं घात, सामान्य एवं विशिष्ट हल' },
        { id: 'up_mm7_t2', title: 'पृथक्करणीय चर, समघातीय तथा रैखिक अवकल समीकरण' }
      ]
    },
    {
      id: 'up_m8',
      title: 'सदिश एवं त्रि-विमीय ज्यामिति (Vectors and 3D Geometry)',
      officialWeightage: '17 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_mm8_t1', title: 'सदिशों के प्रकार, अदिश तथा सदिश गुणनफल' },
        { id: 'up_mm8_t2', title: 'दिक्-कोज्याएँ, रेखा का कार्तीय तथा सदिश समीकरण' },
        { id: 'up_mm8_t3', title: 'दो रेखाओं के बीच न्यूनतम दूरी' }
      ]
    },
    {
      id: 'up_m9',
      title: 'रैखिक प्रोग्रामन (Linear Programming)',
      officialWeightage: '6 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_mm9_t1', title: 'रैखिक प्रोग्रामन समस्या का आलेखीय हल, सुसंगत क्षेत्र' }
      ]
    },
    {
      id: 'up_m10',
      title: 'प्रायिकता (Probability)',
      officialWeightage: '10 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_mm10_t1', title: 'सप्रतिबंध प्रायिकता तथा प्रायिकता का गुणन नियम' },
        { id: 'up_mm10_t2', title: 'बेज़ प्रमेय (Bayes\' Theorem)' }
      ]
    }
  ]
};

export const upBoard12Biology: Subject = {
  id: 'up12_bio',
  name: 'जीव विज्ञान (Biology)',
  chapters: [
    {
      id: 'up_bio1',
      title: 'जनन (Reproduction)',
      officialWeightage: 'इकाई 1 — 14 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_b1_t1', title: 'पुष्पी पादपों में लैंगिक जनन: परागण, दोहरा निषेचन, भ्रूणपोष व बीज' },
        { id: 'up_b1_t2', title: 'मानव जनन: नर व मादा जनन तंत्र, युग्मकजनन, आर्तव चक्र, निषेचन' },
        { id: 'up_b1_t3', title: 'जनन स्वास्थ्य: गर्भनिरोधक उपाय, यौन संचारित रोग (STDs), ART' }
      ]
    },
    {
      id: 'up_bio2',
      title: 'आनुवंशिकी एवं विकास (Genetics and Evolution)',
      officialWeightage: 'इकाई 2 — 18 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_b2_t1', title: 'वंशागति तथा विविधता के सिद्धांत: मेंडल के नियम, सहलग्नता' },
        { id: 'up_b2_t2', title: 'वंशागति का आणविक आधार: DNA संरचना, प्रतिकृतियन, अनुलेखन, अनुवादन' },
        { id: 'up_b2_t3', title: 'मानव जीनोम परियोजना तथा DNA फिंगरप्रिंटिंग' },
        { id: 'up_b2_t4', title: 'विकास: डार्विन का सिद्धांत, हार्डी-वाइनबर्ग संतुलन' }
      ]
    },
    {
      id: 'up_bio3',
      title: 'मानव कल्याण में जीव विज्ञान (Biology in Human Welfare)',
      officialWeightage: 'इकाई 3 — 14 अंक',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'up_b3_t1', title: 'मानव स्वास्थ्य तथा रोग: मलेरिया, टाइफाइड, एड्स, कैंसर, प्रतिरक्षा तंत्र' },
        { id: 'up_b3_t2', title: 'मानव कल्याण में सूक्ष्मजीव: घरेलू उत्पाद, वाहित मल उपचार, जैव उर्वरक' }
      ]
    },
    {
      id: 'up_bio4',
      title: 'जैव प्रौद्योगिकी: सिद्धांत एवं अनुप्रयोग (Biotechnology)',
      officialWeightage: 'इकाई 4 — 10 अंक',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'up_b4_t1', title: 'जैव प्रौद्योगिकी के सिद्धांत व प्रक्रम: पुनर्योगज DNA तकनीक, PCR' },
        { id: 'up_b4_t2', title: 'जैव प्रौद्योगिकी के अनुप्रयोग: Bt कपास, इंसुलिन, जीन चिकित्सा' }
      ]
    },
    {
      id: 'up_bio5',
      title: 'पारिस्थितिकी एवं पर्यावरण (Ecology and Environment)',
      officialWeightage: 'इकाई 5 — 14 अंक',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'up_b5_t1', title: 'जीव और समष्टियाँ: पारस्परिक क्रियाएँ, समष्टि वृद्धि' },
        { id: 'up_b5_t2', title: 'पारितंत्र: उत्पादकता, अपघटन, ऊर्जा प्रवाह, पारिस्थितिक पिरामिड' },
        { id: 'up_b5_t3', title: 'जैव विविधता एवं संरक्षण: हॉटस्पॉट्स, संकटग्रस्त प्रजातियाँ' }
      ]
    }
  ]
};

export const upBoard12Accountancy: Subject = {
  id: 'up12_acc',
  name: 'बहीखाता तथा लेखाशास्त्र (Accountancy)',
  chapters: [
    { 
      id: 'u12a1', 
      title: 'साझेदारी खाते (Partnership Accounts)', 
      officialWeightage: '35 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12a1t1', title: 'साझेदारी के मूल तत्व, लाभ-हानि नियोजन खाता' },
        { id: 'u12a1t2', title: 'साझेदारी फर्म का पुनर्गठन: नये साझेदार का प्रवेश' },
        { id: 'u12a1t3', title: 'साझेदार का अवकाश ग्रहण एवं मृत्यु' },
        { id: 'u12a1t4', title: 'साझेदारी फर्म का विघटन' }
      ] 
    },
    { 
      id: 'u12a2', 
      title: 'कम्पनी खाते एवं वित्तीय विवरणों का विश्लेषण (Company Accounts & Analysis)', 
      officialWeightage: '65 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12a2t1', title: 'अंशपूँजी के लिए लेखांकन: अंशों का निर्गमन, हरण एवं पुनर्निर्गमन' },
        { id: 'u12a2t2', title: 'ऋणपत्रों का निर्गमन एवं मोचन' },
        { id: 'u12a2t3', title: 'कम्पनी के वित्तीय विवरण तथा वित्तीय विवरणों का विश्लेषण' },
        { id: 'u12a2t4', title: 'लेखांकन अनुपात (Accounting Ratios)' },
        { id: 'u12a2t5', title: 'रोकड़ प्रवाह विवरण (Cash Flow Statement)' }
      ] 
    }
  ]
};

export const upBoard12BusinessStudies: Subject = {
  id: 'up12_bst',
  name: 'व्यापारिक संगठन (Business Studies)',
  chapters: [
    { 
      id: 'u12bs1', 
      title: 'प्रबन्ध के सिद्धान्त एवं कार्य (Principles and Functions of Management)', 
      officialWeightage: '50 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12bs1t1', title: 'प्रबन्ध की प्रकृति एवं महत्त्व' },
        { id: 'u12bs1t2', title: 'प्रबन्ध के सिद्धान्त (फेयोल एवं टेलर के सिद्धान्त)' },
        { id: 'u12bs1t3', title: 'व्यावसायिक पर्यावरण' },
        { id: 'u12bs1t4', title: 'नियोजन, संगठन, नियुक्तिकरण, निर्देशन, नियन्त्रण' }
      ] 
    },
    { 
      id: 'u12bs2', 
      title: 'व्यावसायिक वित्त एवं विपणन (Business Finance and Marketing)', 
      officialWeightage: '50 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12bs2t1', title: 'वित्तीय प्रबन्ध: निर्णय एवं पूँजी संरचना' },
        { id: 'u12bs2t2', title: 'वित्तीय बाजार: मुद्रा बाजार एवं पूँजी बाजार (SEBI)' },
        { id: 'u12bs2t3', title: 'विपणन (Marketing): विपणन मिश्रण (4Ps)' },
        { id: 'u12bs2t4', title: 'उपभोक्ता संरक्षण: अधिकार एवं निवारण तंत्र' }
      ] 
    }
  ]
};

export const upBoard12Economics: Subject = {
  id: 'up12_eco',
  name: 'अर्थशास्त्र (Economics)',
  chapters: [
    { 
      id: 'u12ec1', 
      title: 'व्यष्टि अर्थशास्त्र (Microeconomics)', 
      officialWeightage: '50 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12ec1t1', title: 'परिचय एवं केंद्रीय समस्याएँ' },
        { id: 'u12ec1t2', title: 'उपभोक्ता का व्यवहार एवं माँग' },
        { id: 'u12ec1t3', title: 'उत्पादक का व्यवहार एवं पूर्ति' },
        { id: 'u12ec1t4', title: 'बाजार के रूप तथा कीमत निर्धारण' }
      ] 
    },
    { 
      id: 'u12ec2', 
      title: 'समष्टि अर्थशास्त्र (Macroeconomics)', 
      officialWeightage: '50 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12ec2t1', title: 'राष्ट्रीय आय एवं संबद्ध समाहार' },
        { id: 'u12ec2t2', title: 'मुद्रा एवं बैंकिंग: वाणिज्यिक बैंक एवं RBI' },
        { id: 'u12ec2t3', title: 'आय और रोजगार का निर्धारण' },
        { id: 'u12ec2t4', title: 'सरकारी बजट और अर्थव्यवस्था' },
        { id: 'u12ec2t5', title: 'भुगतान संतुलन तथा विदेशी विनिमय दर' }
      ] 
    }
  ]
};

export const upBoard12History: Subject = {
  id: 'up12_his',
  name: 'इतिहास (History)',
  chapters: [
    { 
      id: 'u12h1', 
      title: 'भारतीय इतिहास के कुछ विषय - भाग 1 (Ancient India)', 
      officialWeightage: '25 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12h1t1', title: 'ईंटें, मनके तथा अस्थियाँ (हड़प्पा सभ्यता)' },
        { id: 'u12h1t2', title: 'राजा, किसान और नगर (आरंभिक राज्य एवं अर्थव्यवस्थाएँ)' },
        { id: 'u12h1t3', title: 'बंधुत्व, जाति तथा वर्ग (आरंभिक समाज)' },
        { id: 'u12h1t4', title: 'विचारक, विश्वास और इमारतें (सांस्कृतिक विकास)' }
      ] 
    },
    { 
      id: 'u12h2', 
      title: 'भारतीय इतिहास के कुछ विषय - भाग 2 (Medieval India)', 
      officialWeightage: '25 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12h2t1', title: 'यात्रियों के नज़रिए (समाज के बारे में उनकी समझ)' },
        { id: 'u12h2t2', title: 'भक्ति-सूफी परंपराएँ' },
        { id: 'u12h2t3', title: 'एक साम्राज्य की राजधानी: विजयनगर' },
        { id: 'u12h2t4', title: 'किसान, जमींदार और राज्य (मुगल काल)' }
      ] 
    },
    { 
      id: 'u12h3', 
      title: 'भारतीय इतिहास के कुछ विषय - भाग 3 (Modern India)', 
      officialWeightage: '25 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12h3t1', title: 'उपनिवेशवाद और देहात (सरकारी अभिलेखों का अध्ययन)' },
        { id: 'u12h3t2', title: 'विद्रोही और राज (1857 का आंदोलन और उसके व्याख्यान)' },
        { id: 'u12h3t3', title: 'महात्मा गांधी और राष्ट्रीय आंदोलन (सविनय अवज्ञा और उससे आगे)' },
        { id: 'u12h3t4', title: 'संविधान का निर्माण (एक नए युग की शुरुआत)' }
      ] 
    },
    { 
      id: 'u12h4', 
      title: 'मानचित्र कार्य (Map Work)', 
      officialWeightage: '5 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12h4t1', title: 'ऐतिहासिक स्थलों का मानचित्र पर अंकन' }
      ] 
    }
  ]
};

export const upBoard12Geography: Subject = {
  id: 'up12_geo',
  name: 'भूगोल (Geography)',
  chapters: [
    { 
      id: 'u12g1', 
      title: 'मानव भूगोल के मूल सिद्धान्त (Fundamentals of Human Geography)', 
      officialWeightage: '35 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12g1t1', title: 'मानव भूगोल: प्रकृति एवं विषय क्षेत्र' },
        { id: 'u12g1t2', title: 'विश्व जनसंख्या: वितरण, घनत्व और वृद्धि तथा मानव विकास' },
        { id: 'u12g1t3', title: 'प्राथमिक, द्वितीयक, तृतीयक और चतुर्थ क्रियाकलाप' },
        { id: 'u12g1t4', title: 'परिवहन एवं संचार तथा अंतर्राष्ट्रीय व्यापार' }
      ] 
    },
    { 
      id: 'u12g2', 
      title: 'भारत: लोग और अर्थव्यवस्था (India: People and Economy)', 
      officialWeightage: '35 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12g2t1', title: 'जनसंख्या: वितरण, घनत्व, वृद्धि और संघटन' },
        { id: 'u12g2t2', title: 'मानव बस्तियाँ, भू-संसाधन तथा कृषि' },
        { id: 'u12g2t3', title: 'जल संसाधन, खनिज तथा ऊर्जा संसाधन' },
        { id: 'u12g2t4', title: 'भारत के संदर्भ में नियोजन और सतत पोषणीय विकास' },
        { id: 'u12g2t5', title: 'परिवहन, संचार, अंतर्राष्ट्रीय व्यापार एवं चयनित पर्यावरणीय मुद्दे' }
      ] 
    }
  ]
};

export const upBoard12PolScience: Subject = {
  id: 'up12_pol',
  name: 'नागरिक शास्त्र (Political Science)',
  chapters: [
    { 
      id: 'u12pol1', 
      title: 'समकालीन विश्व राजनीति (Contemporary World Politics)', 
      officialWeightage: '50 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12pol1t1', title: 'दो ध्रुवीयता का अंत' },
        { id: 'u12pol1t2', title: 'सत्ता के समकालीन केंद्र (यूरोपीय संघ, आसियान, चीन, भारत)' },
        { id: 'u12pol1t3', title: 'समकालीन दक्षिण एशिया' },
        { id: 'u12pol1t4', title: 'अंतर्राष्ट्रीय संगठन (संयुक्त राष्ट्र संघ)' },
        { id: 'u12pol1t5', title: 'समकालीन विश्व में सुरक्षा, पर्यावरण और प्राकृतिक संसाधन' },
        { id: 'u12pol1t6', title: 'वैश्वीकरण: स्वरूप और प्रभाव' }
      ] 
    },
    { 
      id: 'u12pol2', 
      title: 'स्वतंत्र भारत में राजनीति (Politics in India since Independence)', 
      officialWeightage: '50 अंक', 
      pyqPriority: 'HIGH', 
      topics: [
        { id: 'u12pol2t1', title: 'राष्ट्र-निर्माण की चुनौतियाँ' },
        { id: 'u12pol2t2', title: 'एक दल के प्रभुत्व का दौर' },
        { id: 'u12pol2t3', title: 'नियोजित विकास की राजनीति' },
        { id: 'u12pol2t4', title: 'भारत के विदेश संबंध' },
        { id: 'u12pol2t5', title: 'कांग्रेस प्रणाली: चुनौतियाँ और पुनर्स्थापना' },
        { id: 'u12pol2t6', title: 'लोकतांत्रिक व्यवस्था का संकट' },
        { id: 'u12pol2t7', title: 'क्षेत्रीय आकांक्षाएँ तथा भारतीय राजनीति में नए बदलाव' }
      ] 
    }
  ]
};

// ==================== STREAM EXPORTS ====================

export const syllabusUP12PCM: SyllabusData = {
  id: 'up_board_12_pcm',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 12',
  stream: 'PCM',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    upBoard12Physics,
    upBoard12Chemistry,
    upBoard12Math,
    upBoard12Hindi,
    upBoard12English
  ]
};

export const syllabusUP12PCB: SyllabusData = {
  id: 'up_board_12_pcb',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 12',
  stream: 'PCB',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    upBoard12Physics,
    upBoard12Chemistry,
    upBoard12Biology,
    upBoard12Hindi,
    upBoard12English
  ]
};

export const syllabusUP12Commerce: SyllabusData = {
  id: 'up_board_12_commerce',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 12',
  stream: 'Commerce',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    upBoard12Accountancy,
    upBoard12BusinessStudies,
    upBoard12Economics,
    upBoard12Hindi,
    upBoard12English
  ]
};

export const syllabusUP12Arts: SyllabusData = {
  id: 'up_board_12_arts',
  examOrBoard: 'UP Board',
  category: 'School',
  classGrade: 'Class 12',
  stream: 'Arts',
  academicSession: '2026-2027',
  sourceUrl: 'https://upmsp.edu.in/',
  verificationDate: '11 September 2026',
  subjects: [
    upBoard12History,
    upBoard12Geography,
    upBoard12PolScience,
    upBoard12Hindi,
    upBoard12English
  ]
};
