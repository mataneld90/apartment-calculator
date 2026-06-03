export type Lang = 'en' | 'he'

export type Translation = {
  title: string
  subtitle: string
  langToggle: string
  purchaseTaxLabel: string
  masShvachLabel: string
  investor8: string
  firstApt: string
  exempt0: string
  standard25: string
  masShvachNote: string
  groupApartment: string
  groupMortgage: string
  groupCosts: string
  groupSelling: string
  groupPassive: string
  groupMisc: string
  av0Label: string
  pLabel: string
  r0Label: string
  yLabel: string
  vLabel: string
  riLabel: string
  ibLabel: string
  primeMinusLabel: string
  esLabel: string
  imLabel: string
  primeFracLabel: string
  primeFracDisplay: (v: number) => string
  ipLabel: string
  cgtLabel: string
  purchaseCostsRateLabel: string
  g0Label: string
  primeMinusDisplay: (v: number) => string
  yearDisplay: (v: number) => string
  mulDisplay: (v: number) => string
  tooltips: {
    p: string
    Ib: string
    primeMinus: string
    Ip: string
    V: string
    Es: string
    cgt: string
    buyerTypeInvestor: string
    buyerTypeSingle: string
    masShvach: string
    Im: string
    primeFrac: string
    G0: string
    R0: string
    purchaseCostsRate: string
  }
  crossoverTitle: string
  goalTitle: string
  expensesTitle: string
  notWithin30: string
  monthLabel: string
  yearLabel2: string
  goalSubLabel: (p: string) => string
  downPaymentCard: string
  purchaseTaxCard: string
  addedCostsCard: string
  ofAptValue: string
  apartmentLine: string
  passiveLine: string
  diffLine: string
  goalLine: string
  crossoverLabel: string
  viewGains: string
  viewDiff: string
  perYear: string
  scrollHint: string
  resetZoom: string
  overtakesPassiveLabel: string
  prepaymentFeeLabel: string
  prepaymentFeeZero: string
  summaryTwoXovers: (y1: string, y2: string, dur: string) => string
  summaryPassiveLeads: string
  summaryAptLeadsOnward: (y: string) => string
  summaryAptLeadsAll: string
  costsLiveEp: string
  costsLiveTp: string
  costsLiveAdded: string
  methodologyTitle: string
}

export const LANG: Record<Lang, Translation> = {
  en: {
    title: 'Apartment vs. Passive Investment',
    subtitle:
      "See when buying an investment apartment in Israel beats investing the same capital in the S&P 500 — and when it doesn't.",
    langToggle: 'עב',
    purchaseTaxLabel: 'Purchase tax',
    masShvachLabel: 'Real estate capital gains',
    investor8: 'Investor (8%)',
    firstApt: 'First apartment',
    exempt0: 'Exempt (0%)',
    standard25: 'Standard (25%)',
    masShvachNote:
      'Exemptions may apply in co-ownership structures or specific legal arrangements. Consult a tax advisor.',
    groupApartment: 'Apartment',
    groupMortgage: 'Mortgage',
    groupCosts: 'At purchase',
    groupSelling: 'At sale',
    groupPassive: 'Passive Investment',
    groupMisc: 'Misc',
    av0Label: 'Apartment purchase price',
    pLabel: 'Mortgage fraction',
    r0Label: 'Starting monthly rent',
    yLabel: 'Mortgage period',
    vLabel: 'Apartment appreciation',
    riLabel: 'Yearly rent increase',
    ibLabel: 'BOI prime rate',
    primeMinusLabel: 'Your spread below prime',
    esLabel: 'Selling costs',
    imLabel: 'Current fixed mortgage rate',
    primeFracLabel: 'Prime track fraction',
    primeFracDisplay: (v) => `${Math.round(v * 100)}% / ${Math.round((1 - v) * 100)}%`,
    ipLabel: 'Passive return (net)',
    cgtLabel: 'Capital gains tax',
    purchaseCostsRateLabel: 'Purchase costs',
    g0Label: 'Goal multiple',
    primeMinusDisplay: (v) => `Prime − ${(v * 100).toFixed(1)}%`,
    yearDisplay: (v) => `${v} yr`,
    mulDisplay: (v) => `${v.toFixed(1)}×`,
    tooltips: {
      p: 'Israeli law caps investment apartment mortgages at 50% of value (vs 75% for a primary residence).',
      Ib: 'Bank of Israel base rate. Current: 4.0% (May 2026). Prime rate = BOI + 1.5%.',
      primeMinus:
        'Your personal spread below prime, as negotiated with the bank. If your bank offered "prime minus 0.9%", enter 0.9%. Your effective mortgage rate = BOI + 1.5% − this value.',
      Ip: 'Annual S&P 500 return in ILS, net of fund management fees (~0.2%/yr). ~8% accounts for shekel appreciation vs USD reducing your ILS return.',
      V: 'Expected annual increase in apartment value. Jerusalem has averaged ~5–7%/yr over the past decade.',
      Es: 'Broker (~2%) + lawyer (~0.5%) + misc fees at time of sale, as % of the appreciated sale price. Typical range: 2.5–3%.',
      cgt: 'Israeli tax on investment gains at realization. Standard rate: 25%. May be 0% if invested through a קרן השתלמות within the annual contribution ceiling.',
      buyerTypeInvestor:
        'Investors buying a non-primary apartment pay 8% flat on value up to ₪5,872,725. Extended through 2026.',
      buyerTypeSingle:
        'First-time buyers or those with no other apartment pay a graduated rate: 0% up to ~₪2M, rising to 5% at ₪2.35M+.',
      masShvach:
        'Capital gains tax on real estate profit at sale: 25% of (net sale proceeds − tax basis). Exempt if this is your primary and only residence. For investment apartments, it typically applies. Consult a tax advisor about co-ownership or other exemptions.',
      Im: 'Used to calculate the early repayment fee (עמלת פירעון מוקדם) on your fixed-rate (קל"צ) track. The bank charges a fee when today\'s equivalent rate is lower than your locked rate — the larger the gap, the larger the fee. If the current rate is equal to or higher than your locked rate, the fee is ₪0.',
      primeFrac: 'The portion of your mortgage on the prime-linked track, which carries no prepayment fee. Bank of Israel caps this at 33%. The remaining fraction (קל"צ + מל"צ tracks) is subject to early repayment fees.',
      G0: 'Target net profit as a multiple of your total purchase outlay. 0.5× = "I want to net back 50% of everything I spent buying this apartment."',
      R0: 'Rent at the time of purchase, before any annual increases. The model applies the yearly rent increase at the start of each subsequent year.',
      purchaseCostsRate: 'All purchase-related costs as % of apartment value, excluding purchase tax (מס רכישה). Typical breakdown: RE broker ~2% (+VAT), lawyer ~0.5% (+VAT), RE appraiser ~₪3,500, mortgage broker if applicable. Default 5% is a reasonable all-in estimate for most buyers.',
    },
    crossoverTitle: '🏠 Apartment overtakes passive',
    goalTitle: '🎯 Reaches goal',
    expensesTitle: '💰 Purchase expenses',
    notWithin30: 'Not within 30 years',
    monthLabel: 'Month',
    yearLabel2: 'Year',
    goalSubLabel: (p) => `Goal: ${p} of purchase costs`,
    downPaymentCard: 'Down payment',
    purchaseTaxCard: 'Purchase tax',
    addedCostsCard: 'Purchase costs',
    ofAptValue: 'of apartment value',
    apartmentLine: 'Apartment gain',
    passiveLine: 'Passive gain',
    diffLine: 'Apartment − Passive',
    goalLine: 'Goal',
    crossoverLabel: 'Crossover',
    viewGains: 'Gains',
    viewDiff: 'Difference',
    perYear: '/ yr',
    scrollHint: 'Scroll to zoom · drag to pan',
    resetZoom: 'Reset zoom',
    overtakesPassiveLabel: '🏠 Apartment overtakes passive',
    prepaymentFeeLabel: 'Early repayment fee',
    prepaymentFeeZero: '(rate ≥ locked rate)',
    summaryTwoXovers: (y1, y2, dur) => `Apartment leads passive from year ${y1} to ${y2} — a ${dur}-year window`,
    summaryPassiveLeads: 'Passive investment leads throughout the full 30-year horizon',
    summaryAptLeadsOnward: (y) => `Apartment leads passive from year ${y} onward`,
    summaryAptLeadsAll: 'Apartment leads passive throughout — passive never catches up within 30 years',
    costsLiveEp: 'Total paid to buy',
    costsLiveTp: 'Purchase tax',
    costsLiveAdded: 'Purchase costs',
    methodologyTitle: 'How this works',
  },
  he: {
    title: 'דירה מול השקעה פסיבית',
    subtitle:
      'ראו מתי קניית דירה להשקעה בישראל עדיפה על השקעת אותו הון במדד S&P 500 — ומתי לא.',
    langToggle: 'EN',
    purchaseTaxLabel: 'מס רכישה',
    masShvachLabel: 'מס שבח במכירה',
    investor8: 'משקיע (8%)',
    firstApt: 'דירה ראשונה',
    exempt0: 'פטור (0%)',
    standard25: 'רגיל (25%)',
    masShvachNote:
      'פטורים עשויים לחול במבנה שותפות או הסדרים משפטיים ספציפיים. יש להתייעץ עם יועץ מס.',
    groupApartment: 'דירה',
    groupMortgage: 'משכנתא',
    groupCosts: 'ברכישה',
    groupSelling: 'במכירה',
    groupPassive: 'השקעה פסיבית',
    groupMisc: 'שונות',
    av0Label: 'מחיר הרכישה',
    pLabel: 'אחוז מימון',
    r0Label: 'שכירות חודשית בתחילת התקופה',
    yLabel: 'תקופת משכנתא',
    vLabel: 'עליית ערך שנתית',
    riLabel: 'עליית שכירות שנתית',
    ibLabel: 'ריבית בנק ישראל',
    primeMinusLabel: 'ההנחה שלך מהפריים',
    esLabel: 'עלויות מכירה',
    imLabel: 'ריבית שוק נוכחית (לחישוב פירעון מוקדם)',
    primeFracLabel: 'חלק מסלול הפריים',
    primeFracDisplay: (v) => `${Math.round(v * 100)}% פריים / ${Math.round((1 - v) * 100)}% קבוע`,
    ipLabel: 'תשואה פסיבית (נטו)',
    cgtLabel: 'מס רווח הון',
    purchaseCostsRateLabel: 'עלויות עסקה',
    g0Label: 'מכפיל יעד',
    primeMinusDisplay: (v) => `${(v * 100).toFixed(1)}% − פריים`,
    yearDisplay: (v) => `${v} שנה`,
    mulDisplay: (v) => `${v.toFixed(1)}×`,
    tooltips: {
      p: 'חוק ישראלי מגביל משכנתא לדירת השקעה ל-50% מהשווי (לעומת 75% לדירה ראשונה).',
      Ib: 'ריבית בנק ישראל. נוכחית: 4.0% (מאי 2026). ריבית פריים = בנק ישראל + 1.5%.',
      primeMinus:
        'ההנחה האישית שלך מתחת לפריים כפי שסוכם מול הבנק. אם הבנק הציע "פריים מינוס 0.9%", הכניסו 0.9%. ריבית המשכנתא האפקטיבית = בנק ישראל + 1.5% − ערך זה.',
      Ip: 'תשואה שנתית של S&P 500 בשקלים, נטו מדמי ניהול (~0.2%/שנה). ~8% מגלמת פיחות דולר מול שקל.',
      V: 'עלייה שנתית צפויה בשווי הדירה. ירושלים ממוצע ~5–7% בשנה בעשור האחרון.',
      Es: 'מתווך (~2%) + עו"ד (~0.5%) + עלויות נלוות בעת מכירה, כאחוז משווי הדירה המוערכת. טווח אופייני: 2.5–3%.',
      cgt: 'מס ישראלי על רווחי השקעה בעת ממוש. שיעור רגיל: 25%. עשוי להיות 0% בקרן השתלמות.',
      buyerTypeInvestor: 'רוכש דירה נוספת משלם 8% שטוח על שווי עד ₪5,872,725. הוארך עד 2026.',
      buyerTypeSingle:
        'רוכשי דירה ראשונה משלמים מדרגות: 0% עד כ-₪2M, עולה ל-5% מ-₪2.35M+.',
      masShvach:
        'מס על הרווח הריאלי בנדל"ן: 25% מ-(תמורה נטו − בסיס עלות). פטור אם זו דירתך היחידה. לדירת השקעה לרוב חל. יש להתייעץ עם עו"ד לגבי מבנה שותפות.',
      Im: 'משמש לחישוב עמלת פירעון מוקדם על מסלול הקל"צ. הבנק גובה עמלה כשהריבית הנוכחית נמוכה מהריבית הנעולה שלך — ככל שהפער גדול יותר, כך העמלה גדולה יותר. אם הריבית הנוכחית גבוהה מהנעולה, העמלה היא ₪0.',
      primeFrac: 'החלק ממשכנתתך במסלול הפריים, הפטור מעמלת פירעון מוקדם לפי חוק. בנק ישראל מגביל מסלול זה ל-33%. יתרת ההלוואה (מסלולי קל"צ ומל"צ) חייבת בעמלה.',
      G0: 'יעד רווח נקי כמכפיל של סך הוצאות הרכישה. 0.5× = "אני רוצה לקבל בחזרה 50% מכל מה שהוצאתי."',
      R0: 'שכירות בעת הרכישה, לפני עליות שנתיות. המחשבון מחיל את עליית השכירות בתחילת כל שנה.',
      purchaseCostsRate: 'כל עלויות הרכישה כאחוז משווי הדירה, ללא מס רכישה. פירוט אופייני: מתווך ~2% (+מע"מ), עו"ד ~0.5% (+מע"מ), שמאי ~₪3,500, יועץ משכנתא לפי הסכמה. ברירת מחדל 5% מכסה את רוב הרוכשים.',
    },
    crossoverTitle: '🏠 הדירה עוקפת את ההשקעה',
    goalTitle: '🎯 מגיע ליעד',
    expensesTitle: '💰 הוצאות רכישה',
    notWithin30: 'לא בתוך 30 שנה',
    monthLabel: 'חודש',
    yearLabel2: 'שנה',
    goalSubLabel: (p) => `יעד: ${p} מהוצאות הרכישה`,
    downPaymentCard: 'הון עצמי',
    purchaseTaxCard: 'מס רכישה',
    addedCostsCard: 'עלויות עסקה',
    ofAptValue: 'משווי הדירה',
    apartmentLine: 'רווח נקי – דירה',
    passiveLine: 'רווח נקי – פסיבי',
    diffLine: 'דירה − פסיבי',
    goalLine: 'יעד',
    crossoverLabel: 'נקודת מעבר',
    viewGains: 'רווחים',
    viewDiff: 'הפרש',
    perYear: '/ שנה',
    scrollHint: 'גלגל לזום · גרור להזזה',
    resetZoom: 'אפס זום',
    overtakesPassiveLabel: '🏠 הדירה עוקפת פסיבי',
    prepaymentFeeLabel: 'עמלת פירעון מוקדם',
    prepaymentFeeZero: '(ריבית ≥ ריבית נעולה)',
    summaryTwoXovers: (y1, y2, dur) => `דירה עולה על השקעה פסיבית משנה ${y1} עד שנה ${y2} — חלון של ${dur} שנים`,
    summaryPassiveLeads: 'השקעה פסיבית מובילה לאורך כל 30 השנים',
    summaryAptLeadsOnward: (y) => `דירה מובילה מהשנה ${y} ואילך`,
    summaryAptLeadsAll: 'דירה מובילה לאורך כל התקופה',
    costsLiveEp: 'סה"כ עלות הרכישה',
    costsLiveTp: 'מס רכישה',
    costsLiveAdded: 'עלויות עסקה',
    methodologyTitle: 'כיצד זה עובד',
  },
}
