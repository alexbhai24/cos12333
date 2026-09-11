import { SyllabusData, Subject } from '../types/syllabus';
import { cbse12Physics, cbse12Chemistry, cbse12English } from './syllabusCBSE12PCM';

// CBSE Class 12 PCB | Academic Session 2026-27
// Official Authority: CBSE (cbseacademic.nic.in) & NCERT (ncert.nic.in)

export const cbse12Biology: Subject = {
  id: 'cbse_12_pcb_bio',
  name: 'Biology',
  chapters: [
    {
      id: 'cbse12_bio1',
      title: 'Sexual Reproduction in Flowering Plants',
      officialWeightage: 'Unit VI — 16 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b1_t1', title: 'Flower structure, development of male and female gametophytes' },
        { id: 'c12b1_t2', title: 'Pollination: types, agencies and outbreeding devices' },
        { id: 'c12b1_t3', title: 'Pollen-pistil interaction, double fertilization' },
        { id: 'c12b1_t4', title: 'Post-fertilization events: development of endosperm and embryo, development of seed and formation of fruit' },
        { id: 'c12b1_t5', title: 'Special modes: apomixis, parthenocarpy, polyembryony' }
      ]
    },
    {
      id: 'cbse12_bio2',
      title: 'Human Reproduction',
      officialWeightage: 'Unit VI — 16 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b2_t1', title: 'Male and female reproductive systems, microscopic anatomy of testis and ovary' },
        { id: 'c12b2_t2', title: 'Gametogenesis: spermatogenesis and oogenesis' },
        { id: 'c12b2_t3', title: 'Menstrual cycle, fertilization, embryo development up to blastocyst formation, implantation' },
        { id: 'c12b2_t4', title: 'Pregnancy and placenta formation, parturition and lactation' }
      ]
    },
    {
      id: 'cbse12_bio3',
      title: 'Reproductive Health',
      officialWeightage: 'Unit VI — 16 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b3_t1', title: 'Need for reproductive health and prevention of Sexually Transmitted Diseases (STDs)' },
        { id: 'c12b3_t2', title: 'Birth control: need and methods, contraception and medical termination of pregnancy (MTP)' },
        { id: 'c12b3_t3', title: 'Amniocentesis, infertility and assisted reproductive technologies: IVF, ZIFT, GIFT' }
      ]
    },
    {
      id: 'cbse12_bio4',
      title: 'Principles of Inheritance and Variation',
      officialWeightage: 'Unit VII — 20 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b4_t1', title: 'Mendelian inheritance, deviations: incomplete dominance, codominance, multiple alleles and inheritance of blood groups, pleiotropy' },
        { id: 'c12b4_t2', title: 'Elementary idea of polygenic inheritance, chromosome theory of inheritance' },
        { id: 'c12b4_t3', title: 'Chromosomes and genes, sex determination in humans, birds and honey bee' },
        { id: 'c12b4_t4', title: 'Linkage and crossing over, sex linked inheritance: haemophilia, colour blindness' },
        { id: 'c12b4_t5', title: 'Mendelian disorders in humans: Thalassemia, Sickle cell anemia, Phenylketonuria; Chromosomal disorders: Down\'s syndrome, Turner\'s and Klinefelter\'s syndromes' }
      ]
    },
    {
      id: 'cbse12_bio5',
      title: 'Molecular Basis of Inheritance',
      officialWeightage: 'Unit VII — 20 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b5_t1', title: 'Search for genetic material and DNA as genetic material, structure of DNA and RNA, DNA packaging' },
        { id: 'c12b5_t2', title: 'DNA replication, central dogma, transcription, genetic code, translation' },
        { id: 'c12b5_t3', title: 'Gene expression and regulation: Lac Operon' },
        { id: 'c12b5_t4', title: 'Genome projects: Human Genome Project (HGP), DNA fingerprinting' }
      ]
    },
    {
      id: 'cbse12_bio6',
      title: 'Evolution',
      officialWeightage: 'Unit VII — 20 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b6_t1', title: 'Origin of life, biological evolution and evidences for biological evolution (paleontology, comparative anatomy, embryology and molecular evidence)' },
        { id: 'c12b6_t2', title: 'Darwin\'s contribution, modern synthetic theory of evolution' },
        { id: 'c12b6_t3', title: 'Mechanism of evolution: variation (mutation and recombination) and natural selection with examples, types of natural selection' },
        { id: 'c12b6_t4', title: 'Gene flow and genetic drift, Hardy-Weinberg principle, adaptive radiation, human evolution' }
      ]
    },
    {
      id: 'cbse12_bio7',
      title: 'Human Health and Disease',
      officialWeightage: 'Unit VIII — 12 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b7_t1', title: 'Pathogens and parasites causing human diseases: Malaria, Dengue, Chikungunya, Filariasis, Ascariasis, Typhoid, Pneumonia, Common cold, Amoebiasis, Ringworm and their control' },
        { id: 'c12b7_t2', title: 'Basic concepts of immunology: innate and acquired immunity, vaccines' },
        { id: 'c12b7_t3', title: 'Cancer, HIV and AIDS' },
        { id: 'c12b7_t4', title: 'Adolescence: drug and alcohol abuse' }
      ]
    },
    {
      id: 'cbse12_bio8',
      title: 'Microbes in Human Welfare',
      officialWeightage: 'Unit VIII — 12 Marks',
      pyqPriority: 'MEDIUM',
      topics: [
        { id: 'c12b8_t1', title: 'Microbes in household food processing, industrial production' },
        { id: 'c12b8_t2', title: 'Sewage treatment, energy generation (biogas production)' },
        { id: 'c12b8_t3', title: 'Microbes as biocontrol agents and biofertilizers' }
      ]
    },
    {
      id: 'cbse12_bio9',
      title: 'Biotechnology: Principles and Processes',
      officialWeightage: 'Unit IX — 12 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b9_t1', title: 'Genetic engineering: Recombinant DNA technology' },
        { id: 'c12b9_t2', title: 'Tools of recombinant DNA technology: restriction enzymes, cloning vectors, competent host' },
        { id: 'c12b9_t3', title: 'Processes of recombinant DNA technology: isolation of DNA, amplification of gene using PCR, insertion of recombinant DNA, bioreactors, downstream processing' }
      ]
    },
    {
      id: 'cbse12_bio10',
      title: 'Biotechnology and its Applications',
      officialWeightage: 'Unit IX — 12 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b10_t1', title: 'Application of biotechnology in health and agriculture: genetically modified organisms (Bt crops, RNA interference)' },
        { id: 'c12b10_t2', title: 'Human insulin and vaccine production, gene therapy, molecular diagnosis' },
        { id: 'c12b10_t3', title: 'Transgenic animals, biosafety issues, biopiracy and patents' }
      ]
    },
    {
      id: 'cbse12_bio11',
      title: 'Organisms and Populations',
      officialWeightage: 'Unit X — 10 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b11_t1', title: 'Population attributes: growth rates, birth rate and death rate, age distribution' },
        { id: 'c12b11_t2', title: 'Population growth: exponential and logistic growth curves' },
        { id: 'c12b11_t3', title: 'Population interactions: mutualism, competition, predation, parasitism, commensalism' }
      ]
    },
    {
      id: 'cbse12_bio12',
      title: 'Ecosystem',
      officialWeightage: 'Unit X — 10 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b12_t1', title: 'Ecosystem structure and function, productivity and decomposition' },
        { id: 'c12b12_t2', title: 'Energy flow, food chains, food webs' },
        { id: 'c12b12_t3', title: 'Ecological pyramids: pyramids of number, biomass and energy' }
      ]
    },
    {
      id: 'cbse12_bio13',
      title: 'Biodiversity and its Conservation',
      officialWeightage: 'Unit X — 10 Marks',
      pyqPriority: 'HIGH',
      topics: [
        { id: 'c12b13_t1', title: 'Concept of biodiversity, patterns of biodiversity, importance of biodiversity' },
        { id: 'c12b13_t2', title: 'Loss of biodiversity: causes (The Evil Quartet)' },
        { id: 'c12b13_t3', title: 'Biodiversity conservation: Hotspots, endangered organisms, extinction, Red Data Book, Sacred Groves, Biosphere reserves, National parks, Wildlife sanctuaries, In-situ and Ex-situ conservation' }
      ]
    }
  ]
};

export const syllabusCBSE12PCB: SyllabusData = {
  id: 'cbse_12_pcb',
  examOrBoard: 'CBSE',
  category: 'School',
  classGrade: 'Class 12',
  stream: 'PCB',
  academicSession: '2026-2027',
  sourceUrl: 'https://cbseacademic.nic.in/',
  verificationDate: '11 September 2026',
  subjects: [
    cbse12Physics,
    cbse12Chemistry,
    cbse12Biology,
    cbse12English
  ]
};
