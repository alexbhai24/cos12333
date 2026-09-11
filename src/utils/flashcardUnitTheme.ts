export interface FlashcardUnitTheme {
  unitName: string;
  primaryColor: string;     // e.g. #00D7A0
  secondaryColor: string;   // e.g. #10B981
  bannerGradient: string;   // vibrant gradient for the artwork box (like the image palette)
  cardBg: string;           // rich colored dark surface for the card body (NO plain black)
  badgeBg: string;          // background for badges inside banner
  borderColor: string;      // card border
  glowShadow: string;       // glow shadow
  watermarkColor: string;   // color for large #01 watermark
  contrastText: string;     // text on top of primaryColor (white #FFFFFF)
}

export function getChapterUnitTheme(
  chapterTitle: string,
  subjectName: string,
  exam: string = 'NEET'
): FlashcardUnitTheme {
  const title = (chapterTitle || '').toLowerCase();
  const subj = (subjectName || '').toLowerCase();

  // 1. BIOLOGY (NEET)
  if (subj.includes('bio') || subj.includes('botany') || subj.includes('zoology')) {
    // Check Zoology first
    const isZoology = 
      title.includes('animal') ||
      title.includes('tissue') ||
      title.includes('cockroach') ||
      title.includes('digestion') ||
      title.includes('breathing') ||
      title.includes('body fluid') ||
      title.includes('circulation') ||
      title.includes('excretory') ||
      title.includes('locomotion') ||
      title.includes('neural') ||
      title.includes('chemical coordination') ||
      title.includes('human reproduction') ||
      title.includes('reproductive health') ||
      title.includes('evolution') ||
      title.includes('human health') ||
      title.includes('disease') ||
      title.includes('biotechnology');

    if (isZoology) {
      // ZOOLOGY: Vibrant Reddish Pink (#FD4770 from user image)
      return {
        unitName: 'ZOOLOGY',
        primaryColor: '#FD4770',
        secondaryColor: '#E11D48',
        bannerGradient: 'linear-gradient(135deg, #FD4770 0%, #D81B60 100%)',
        cardBg: 'linear-gradient(180deg, #2A0815 0%, #16040A 100%)',
        badgeBg: 'rgba(0, 0, 0, 0.28)',
        borderColor: 'rgba(253, 71, 112, 0.45)',
        glowShadow: '0 0 20px rgba(253, 71, 112, 0.4)',
        watermarkColor: 'rgba(255, 255, 255, 0.28)',
        contrastText: '#FFFFFF'
      };
    }

    // Default Biology is BOTANY: Vibrant Botanical Green (#00D7A0 from user image)
    return {
      unitName: 'BOTANY',
      primaryColor: '#00D7A0',
      secondaryColor: '#059669',
      bannerGradient: 'linear-gradient(135deg, #00D7A0 0%, #059669 100%)',
      cardBg: 'linear-gradient(180deg, #04241B 0%, #02140F 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.28)',
      borderColor: 'rgba(0, 215, 160, 0.45)',
      glowShadow: '0 0 20px rgba(0, 215, 160, 0.4)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)',
      contrastText: '#FFFFFF'
    };
  }

  // 2. CHEMISTRY
  if (subj.includes('chem')) {
    // Organic Chemistry: Warm Coral Peach (#F78C6A from user image)
    const isOrganic = 
      title.includes('organic') ||
      title.includes('hydrocarbon') ||
      title.includes('haloalkane') ||
      title.includes('haloarene') ||
      title.includes('alcohol') ||
      title.includes('phenol') ||
      title.includes('ether') ||
      title.includes('aldehyde') ||
      title.includes('ketone') ||
      title.includes('carboxylic') ||
      title.includes('amine') ||
      title.includes('diazonium') ||
      title.includes('biomolecule') ||
      title.includes('polymer') ||
      title.includes('everyday life') ||
      title.includes('environmental');

    if (isOrganic) {
      return {
        unitName: 'ORGANIC CHEM',
        primaryColor: '#F78C6A',
        secondaryColor: '#EA580C',
        bannerGradient: 'linear-gradient(135deg, #F78C6A 0%, #EA580C 100%)',
        cardBg: 'linear-gradient(180deg, #2A1207 0%, #160903 100%)',
        badgeBg: 'rgba(0, 0, 0, 0.28)',
        borderColor: 'rgba(247, 140, 106, 0.45)',
        glowShadow: '0 0 20px rgba(247, 140, 106, 0.4)',
        watermarkColor: 'rgba(255, 255, 255, 0.28)',
        contrastText: '#FFFFFF'
      };
    }

    // Inorganic Chemistry: Royal Purple (#A855F7)
    const isInorganic =
      title.includes('period') ||
      title.includes('bonding') ||
      title.includes('hydrogen') ||
      title.includes('block') ||
      title.includes('coordination') ||
      title.includes('metallurgy') ||
      title.includes('isolation') ||
      title.includes('qualitative') ||
      title.includes('salt');

    if (isInorganic) {
      return {
        unitName: 'INORGANIC CHEM',
        primaryColor: '#A855F7',
        secondaryColor: '#7C3AED',
        bannerGradient: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
        cardBg: 'linear-gradient(180deg, #220B38 0%, #120520 100%)',
        badgeBg: 'rgba(0, 0, 0, 0.28)',
        borderColor: 'rgba(168, 85, 247, 0.45)',
        glowShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
        watermarkColor: 'rgba(255, 255, 255, 0.28)',
        contrastText: '#FFFFFF'
      };
    }

    // Physical Chemistry: Deep Vibrant Teal / Ocean Blue (#108A81 from user image)
    return {
      unitName: 'PHYSICAL CHEM',
      primaryColor: '#108A81',
      secondaryColor: '#0E7490',
      bannerGradient: 'linear-gradient(135deg, #108A81 0%, #086B63 100%)',
      cardBg: 'linear-gradient(180deg, #052425 0%, #021314 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.28)',
      borderColor: 'rgba(16, 138, 129, 0.45)',
      glowShadow: '0 0 20px rgba(16, 138, 129, 0.4)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)',
      contrastText: '#FFFFFF'
    };
  }

  // 3. PHYSICS
  if (subj.includes('phys')) {
    // Thermal Physics & Properties of Matter (Card #07 & #08 in user's image): Warm Golden Yellow (#FFD167 from user image)
    if (
      title.includes('fluid') ||
      title.includes('solid') ||
      title.includes('thermodynamic') ||
      title.includes('kinetic') ||
      title.includes('gas') ||
      title.includes('oscillation') ||
      title.includes('wave')
    ) {
      return {
        unitName: 'THERMAL & WAVES',
        primaryColor: '#FFD167',
        secondaryColor: '#F59E0B',
        bannerGradient: 'linear-gradient(135deg, #FFD167 0%, #F59E0B 100%)',
        cardBg: 'linear-gradient(180deg, #261B04 0%, #150E01 100%)',
        badgeBg: 'rgba(0, 0, 0, 0.32)',
        borderColor: 'rgba(255, 209, 103, 0.45)',
        glowShadow: '0 0 20px rgba(255, 209, 103, 0.4)',
        watermarkColor: 'rgba(255, 255, 255, 0.3)',
        contrastText: '#FFFFFF'
      };
    }

    // Optics & Modern Physics: Vibrant Rose Pink (#FD4770 / #EC4899)
    if (
      title.includes('optic') ||
      title.includes('dual nature') ||
      title.includes('radiation') ||
      title.includes('atom') ||
      title.includes('nuclei') ||
      title.includes('electronic') ||
      title.includes('semiconductor')
    ) {
      return {
        unitName: 'OPTICS & MODERN',
        primaryColor: '#FD4770',
        secondaryColor: '#E11D48',
        bannerGradient: 'linear-gradient(135deg, #FD4770 0%, #D81B60 100%)',
        cardBg: 'linear-gradient(180deg, #2A0815 0%, #16040A 100%)',
        badgeBg: 'rgba(0, 0, 0, 0.28)',
        borderColor: 'rgba(253, 71, 112, 0.45)',
        glowShadow: '0 0 20px rgba(253, 71, 112, 0.4)',
        watermarkColor: 'rgba(255, 255, 255, 0.28)',
        contrastText: '#FFFFFF'
      };
    }

    // Electrodynamics & Magnetism: Electric Purple (#8B5CF6)
    if (
      title.includes('electrostat') ||
      title.includes('current') ||
      title.includes('magnet') ||
      title.includes('induction') ||
      title.includes('alternating') ||
      title.includes('electromagnetic')
    ) {
      return {
        unitName: 'ELECTRODYNAMICS',
        primaryColor: '#8B5CF6',
        secondaryColor: '#6D28D9',
        bannerGradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        cardBg: 'linear-gradient(180deg, #1B0B38 0%, #0E0520 100%)',
        badgeBg: 'rgba(0, 0, 0, 0.28)',
        borderColor: 'rgba(139, 92, 246, 0.45)',
        glowShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
        watermarkColor: 'rgba(255, 255, 255, 0.28)',
        contrastText: '#FFFFFF'
      };
    }

    // Default Physics is MECHANICS (Card #01 to #06 in user's image): Vibrant Sky / Ocean Blue (#0EA5E9 / #108A81)
    return {
      unitName: 'MECHANICS',
      primaryColor: '#0EA5E9',
      secondaryColor: '#0284C7',
      bannerGradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
      cardBg: 'linear-gradient(180deg, #051F33 0%, #02101C 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.28)',
      borderColor: 'rgba(14, 165, 233, 0.45)',
      glowShadow: '0 0 20px rgba(14, 165, 233, 0.4)',
      watermarkColor: 'rgba(255, 255, 255, 0.28)',
      contrastText: '#FFFFFF'
    };
  }

  // 4. MATHEMATICS (JEE)
  if (subj.includes('math')) {
    if (title.includes('limit') || title.includes('contin') || title.includes('different') || title.includes('integr') || title.includes('calculus')) {
      return {
        unitName: 'CALCULUS',
        primaryColor: '#06B6D4',
        secondaryColor: '#0891B2',
        bannerGradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
        cardBg: 'linear-gradient(180deg, #032029 0%, #011117 100%)',
        badgeBg: 'rgba(0, 0, 0, 0.28)',
        borderColor: 'rgba(6, 182, 212, 0.45)',
        glowShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
        watermarkColor: 'rgba(255, 255, 255, 0.28)',
        contrastText: '#FFFFFF'
      };
    }
    if (title.includes('vector') || title.includes('3d') || title.includes('line') || title.includes('circle') || title.includes('conic')) {
      return {
        unitName: 'COORDINATE & VECTORS',
        primaryColor: '#00D7A0',
        secondaryColor: '#059669',
        bannerGradient: 'linear-gradient(135deg, #00D7A0 0%, #059669 100%)',
        cardBg: 'linear-gradient(180deg, #04241B 0%, #02140F 100%)',
        badgeBg: 'rgba(0, 0, 0, 0.28)',
        borderColor: 'rgba(0, 215, 160, 0.45)',
        glowShadow: '0 0 20px rgba(0, 215, 160, 0.4)',
        watermarkColor: 'rgba(255, 255, 255, 0.28)',
        contrastText: '#FFFFFF'
      };
    }
    if (title.includes('trig') || title.includes('probab') || title.includes('statistic')) {
      return {
        unitName: 'TRIGONOMETRY & STATS',
        primaryColor: '#FD4770',
        secondaryColor: '#E11D48',
        bannerGradient: 'linear-gradient(135deg, #FD4770 0%, #E11D48 100%)',
        cardBg: 'linear-gradient(180deg, #2A0815 0%, #16040A 100%)',
        badgeBg: 'rgba(0, 0, 0, 0.28)',
        borderColor: 'rgba(253, 71, 112, 0.45)',
        glowShadow: '0 0 20px rgba(253, 71, 112, 0.4)',
        watermarkColor: 'rgba(255, 255, 255, 0.28)',
        contrastText: '#FFFFFF'
      };
    }
    return {
      unitName: 'ALGEBRA',
      primaryColor: '#FFD167',
      secondaryColor: '#F59E0B',
      bannerGradient: 'linear-gradient(135deg, #FFD167 0%, #F59E0B 100%)',
      cardBg: 'linear-gradient(180deg, #261B04 0%, #150E01 100%)',
      badgeBg: 'rgba(0, 0, 0, 0.32)',
      borderColor: 'rgba(255, 209, 103, 0.45)',
      glowShadow: '0 0 20px rgba(255, 209, 103, 0.4)',
      watermarkColor: 'rgba(255, 255, 255, 0.3)',
      contrastText: '#FFFFFF'
    };
  }

  // Fallback default
  return {
    unitName: 'CORE UNIT',
    primaryColor: '#00D7A0',
    secondaryColor: '#059669',
    bannerGradient: 'linear-gradient(135deg, #00D7A0 0%, #059669 100%)',
    cardBg: 'linear-gradient(180deg, #04241B 0%, #02140F 100%)',
    badgeBg: 'rgba(0, 0, 0, 0.28)',
    borderColor: 'rgba(0, 215, 160, 0.45)',
    glowShadow: '0 0 20px rgba(0, 215, 160, 0.4)',
    watermarkColor: 'rgba(255, 255, 255, 0.28)',
    contrastText: '#FFFFFF'
  };
}
