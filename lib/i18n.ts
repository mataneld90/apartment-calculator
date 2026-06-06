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
  ipLabel: string
  cgtLabel: string
  purchaseCostsRateLabel: string
  g0Label: string
  primeMinusDisplay: (v: number) => string
  yearDisplay: (v: number) => string
  mulDisplay: (v: number) => string
  tooltips: {
    pInvestor: string
    pSingle: string
    Ib: string
    primeMinus: string
    Ip: (defaultPct: string) => string
    V: string
    Es: string
    cgt: string
    buyerTypeInvestor: string
    buyerTypeSingle: string
    masShvach: string
    Im: string
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
  goalReachedLine: (year: string, amount: string) => string
  goalNotReachedLine: (amount: string) => string
  downPaymentCard: string
  downPaymentTooltip: string
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
  prepaymentFeeHint: (pct: string) => string
  prepaymentFeeZeroHint: (pct: string) => string
  effectiveMortgageRateLabel: string
  effectiveMortgageRate: (rate: string, ib: string, pm: string) => string
  tooltipAptLeads: string
  tooltipPassiveLeads: string
  tooltipBreakEven: string
  peakAdvantage: (amount: string, year: string) => string
  peakPassiveLead: (amount: string, year: string) => string
  summaryTwoXovers: (y1: string, y2: string, dur: string) => string
  summaryPassiveLeads: string
  summaryAptLeadsOnward: (y: string) => string
  summaryAptLeadsAll: string
  costsLiveEp: string
  costsLiveTp: string
  costsLiveAdded: string
  methodologyTitle: string
  taxRateLabel: string
  taxRateTotal: (x: string) => string
  taxRateUpTo: (pct: string, limit: string) => string
  taxRateThen: (pct: string) => string
  taxRateBeyond: (pct: string) => string
  masShvachAutoUpdatedNote: string
  masShvachInvestorExemptWarning: string
  exemptTooltip: string
  dpModeAmount: string
  dpModeFraction: string
  dpAdjustedToMin: string
  apartmentShort: string
  passiveShort: string
}

export const LANG: Record<Lang, Translation> = {
  en: {
    title: 'Apartment vs. Passive Investment',
    subtitle:
      "See when buying an investment apartment in Israel beats investing the same capital passively in the stock market — and when it doesn't.",
    langToggle: 'עב',
    purchaseTaxLabel: 'Purchase tax',
    masShvachLabel: 'Capital gains tax (מס שבח)',
    investor8: 'Additional apartment',
    firstApt: 'My only apartment',
    exempt0: 'Exempt (0%)',
    standard25: 'Standard (25%)',
    masShvachNote:
      'Exemptions may apply in co-ownership structures or specific legal arrangements. Consult a tax advisor.',
    groupApartment: 'Property',
    groupMortgage: 'Mortgage',
    groupCosts: 'At purchase',
    groupSelling: 'At sale',
    groupPassive: 'Passive Investment',
    groupMisc: 'Goal',
    av0Label: 'Apartment purchase price',
    pLabel: 'Mortgage fraction',
    r0Label: 'Starting monthly rent',
    yLabel: 'Mortgage period',
    vLabel: 'Apartment appreciation',
    riLabel: 'Yearly rent increase',
    ibLabel: 'BOI rate',
    primeMinusLabel: 'Your spread below prime',
    esLabel: 'Selling costs',
    imLabel: 'Current fixed mortgage rate',
    ipLabel: 'Passive return (net)',
    cgtLabel: 'Capital gains tax',
    purchaseCostsRateLabel: 'Purchase costs',
    g0Label: 'Goal multiple',
    primeMinusDisplay: (v) => `Prime − ${(v * 100).toFixed(1)}%`,
    yearDisplay: (v) => `${v} yr`,
    mulDisplay: (v) => `${v.toFixed(1)}×`,
    tooltips: {
      pInvestor: 'Israeli law caps mortgage financing at 50% of apartment value for a non-primary residence. If this will become your primary residence and you sell your current apartment within 18 months, the 75% cap may apply — consult a mortgage advisor.',
      pSingle: 'Israeli law caps mortgage financing at 75% of apartment value for a primary residence.',
      Ib: 'Current Bank of Israel rate: 3.75% (June 2026). Prime rate = BOI rate + 1.5%.',
      primeMinus:
        "Your personal spread below prime, as agreed with the bank. If your bank offered 'prime minus 0.9%' — enter 0.9%. Effective rate = BOI rate + 1.5% − this value.",
      Ip: (pct) => `Expected annual return in ILS on a passive stock market investment (e.g. S&P 500 or MSCI World), net of fund fees. Default ${pct} = ~10% in USD, minus ~0.8% annual shekel appreciation against the dollar (historical trend 2006–2026, linear regression on Bank of Israel data), minus ~0.2% fund management fees.`,
      V: 'Expected annual increase in apartment value. In major Israeli cities, the historical average has been approximately 5–8% per year over the past decade, with significant variation by area.',
      Es: 'Selling costs as a percentage of the apartment value at sale. Typical breakdown: agent ~2%, lawyer ~0.5%, plus incidental costs. Common range: 2.5–3%.',
      cgt: 'Israeli tax on investment gains — charged only at realization (when sold). Standard rate: 25%. Via a קרן השתלמות (study fund): may be 0%.',
      buyerTypeInvestor:
        'Applies to buyers who already own another apartment and are not selling it before purchase. Purchase tax: 8% up to ₪5,872,725, then 10% on the excess. If this will become your primary residence and you sell your current apartment within 18 months, a 75% mortgage cap may apply — consult a mortgage advisor.',
      buyerTypeSingle:
        'Applies to buyers who own no other apartment, or who sell their current one within 18 months of purchase. Tax rates are graduated and significantly lower than the investor track.',
      masShvach:
        'Tax on real estate sale profit: 25% of net gain (sale proceeds minus purchase cost and recognized expenses). For an investment apartment — usually applies. For a primary residence — usually exempt. Co-ownership structures may qualify for exemption — consult a lawyer.',
      Im: 'Used to calculate the early repayment fee (עמלת פירעון מוקדם). The bank charges a fee when the current market rate is below your locked rate — the larger the gap, the higher the fee. If the market rate is above your locked rate, the fee is ₪0. Note: the calculation uses the full remaining principal — in practice the prime track carries no prepayment fee, so the actual fee may be slightly lower.',
      G0: 'Profit target as a multiple of total purchase costs. 0.5× means: "I want my net gain from selling to equal at least 50% of everything I spent buying this apartment."',
      R0: 'Monthly rent at the time of purchase, before annual increases. The calculator applies the rent increase once per year.',
      purchaseCostsRate: 'Purchase costs as a percentage of apartment value, excluding purchase tax. Typical breakdown: agent ~2% + VAT, lawyer ~0.5% + VAT, appraiser ~₪3,500, mortgage advisor by agreement. The default 5% suits most buyers.',
    },
    crossoverTitle: '🏠 Apartment overtakes passive',
    goalTitle: '🎯 Reaches goal',
    expensesTitle: '💰 Purchase expenses',
    notWithin30: 'Not within 30 years',
    monthLabel: 'Month',
    yearLabel2: 'Year',
    goalSubLabel: (p) => `Goal: ${p} of purchase costs`,
    goalReachedLine: (year, amount) => `Goal reached at year ${year} · Target net gain: ${amount}`,
    goalNotReachedLine: (amount) => `Goal not reached within 30 years · Target net gain: ${amount}`,
    downPaymentCard: 'Down payment',
    downPaymentTooltip: 'Down payment is determined by apartment price × (100% − mortgage fraction). For example: ₪3,000,000 apartment with 50% mortgage = ₪1,500,000 down payment.',
    purchaseTaxCard: 'Purchase tax',
    addedCostsCard: 'Purchase costs',
    ofAptValue: 'of apartment value',
    apartmentLine: 'Apartment — net realised gain',
    passiveLine: 'Passive — net realised gain',
    diffLine: 'Apartment advantage over passive investment',
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
    prepaymentFeeHint: (pct) => `(₪0 if market rate ≥ ${pct})`,
    prepaymentFeeZeroHint: (pct) => `(market rate ≥ your locked rate of ${pct})`,
    effectiveMortgageRateLabel: 'Effective rate:',
    effectiveMortgageRate: (rate, ib, pm) => `${rate} = ${ib} + 1.5% − ${pm}`,
    tooltipAptLeads: 'Apartment leads:',
    tooltipPassiveLeads: 'Passive leads:',
    tooltipBreakEven: 'Break even:',
    peakAdvantage: (amount, year) => `Peak advantage: ${amount} at year ${year}`,
    peakPassiveLead: (amount, year) => `Max passive lead: ${amount} at year ${year}`,
    summaryTwoXovers: (y1, y2, dur) => `Apartment leads passive from year ${y1} to ${y2} — a ${dur}-year window`,
    summaryPassiveLeads: 'Passive investment leads throughout the full 30-year horizon',
    summaryAptLeadsOnward: (y) => `Apartment leads passive from year ${y} onward`,
    summaryAptLeadsAll: 'Apartment leads passive throughout — passive never catches up within 30 years',
    costsLiveEp: 'Total paid to buy',
    costsLiveTp: 'Purchase tax',
    costsLiveAdded: 'Purchase costs',
    methodologyTitle: 'How this works',
    taxRateLabel: 'Tax rate:',
    taxRateTotal: (x) => `Total ${x}`,
    taxRateUpTo: (pct, limit) => `${pct} up to ${limit}`,
    taxRateThen: (pct) => `then ${pct}`,
    taxRateBeyond: (pct) => `${pct} beyond`,
    masShvachAutoUpdatedNote: 'Auto-updated — can be changed manually',
    masShvachInvestorExemptWarning: '⚠️ מס שבח exemption almost never applies to an additional apartment. This applies only in exceptional cases — consult a lawyer.',
    exemptTooltip: "The exemption applies to a primary residence — an apartment you actually lived in. If you rented it out for the entire period without living in it, the exemption does not apply — even if it is your only apartment. In that case choose 'Standard (25%)'. Exception: co-ownership structures may qualify — consult a lawyer.",
    dpModeAmount: 'Amount',
    dpModeFraction: 'Fraction',
    dpAdjustedToMin: 'Adjusted to legal minimum',
    apartmentShort: 'Apartment',
    passiveShort: 'Passive',
  },
  he: {
    title: 'דירה מול השקעה פסיבית',
    subtitle:
      'ראו מתי קניית דירה להשקעה בישראל עדיפה על השקעה פסיבית בשוק ההון — ומתי לא.',
    langToggle: 'EN',
    purchaseTaxLabel: 'מס רכישה',
    masShvachLabel: 'מס שבח',
    investor8: 'דירה נוספת',
    firstApt: 'דירתי היחידה',
    exempt0: 'פטור (0%)',
    standard25: 'רגיל (25%)',
    masShvachNote:
      'פטורים עשויים לחול במבנה שותפות או הסדרים משפטיים ספציפיים. יש להתייעץ עם יועץ מס.',
    groupApartment: 'נכס',
    groupMortgage: 'משכנתה',
    groupCosts: 'ברכישה',
    groupSelling: 'במכירה',
    groupPassive: 'השקעה פסיבית',
    groupMisc: 'יעד',
    av0Label: 'מחיר הרכישה',
    pLabel: 'אחוז מימון',
    r0Label: 'שכירות חודשית בתחילת התקופה',
    yLabel: 'תקופת משכנתה',
    vLabel: 'עליית ערך שנתית',
    riLabel: 'עליית שכירות שנתית',
    ibLabel: 'ריבית בנק ישראל',
    primeMinusLabel: 'ההנחה שלך מהפריים',
    esLabel: 'עלויות מכירה',
    imLabel: 'ריבית שוק נוכחית',
    ipLabel: 'תשואה פסיבית (נטו) / שנה',
    cgtLabel: 'מס רווח הון',
    purchaseCostsRateLabel: 'עלויות עסקה',
    g0Label: 'מכפיל יעד',
    primeMinusDisplay: (v) => `${(v * 100).toFixed(1)}% − פריים`,
    yearDisplay: (v) => `${v} שנה`,
    mulDisplay: (v) => `${v.toFixed(1)}×`,
    tooltips: {
      pInvestor: 'החוק בישראל מגביל מימון משכנתה ל-50% משווי הדירה עבור דירה שאינה מגורים עיקריים. אם הדירה החדשה תשמש כמגוריך העיקריים ותמכור את הדירה הקיימת תוך 18 חודשים, עשויה לחול תקרת מימון של 75% — מומלץ להתייעץ עם יועץ משכנתאות.',
      pSingle: 'החוק בישראל מגביל מימון משכנתה ל-75% משווי הדירה עבור דירת מגורים עיקריים.',
      Ib: 'ריבית בנק ישראל הנוכחית: 3.75% (יוני 2026). ריבית פריים = ריבית בנק ישראל + 1.5%.',
      primeMinus:
        'ההנחה שסוכמה מול הבנק ביחס לריבית הפריים. אם הבנק הציע \'פריים מינוס 0.9%\' — הכניסו 0.9%. ריבית אפקטיבית = בנק ישראל + 1.5% − ערך זה.',
      Ip: (pct) => `תשואה שנתית צפויה בשקלים על השקעה פסיבית במדד מניות (כגון S&P 500 או MSCI World), נטו מדמי ניהול. ברירת המחדל ${pct} = ~10% בדולרים, פחות ~0.8% התחזקות שקל מול דולר (מגמה היסטורית 2006–2026, רגרסיה לינארית על נתוני בנק ישראל) ופחות ~0.2% דמי ניהול.`,
      V: 'עלייה שנתית צפויה בשווי הדירה. בערים גדולות בישראל עמד הממוצע על כ-5–8% בעשור האחרון, עם שונות משמעותית בין אזורים.',
      Es: 'עלויות מכירה כאחוז משווי הדירה בעת המכירה. פירוט אופייני: מתווך ~2%, עו"ד ~0.5%, ועלויות נלוות נוספות. טווח מקובל: 2.5–3%.',
      cgt: 'מס ישראלי על רווחי השקעה — נגבה רק בעת מימוש (מכירה). שיעור רגיל: 25%. דרך קרן השתלמות: עשוי להיות 0%.',
      buyerTypeInvestor: 'חל על מי שמחזיק בדירה נוספת ואינו מוכר אותה לפני הרכישה. מס רכישה: 8% עד ₪5,872,725, ו-10% על החלק שמעבר. אם הדירה החדשה תשמש כמגוריך העיקריים ותמכור את הדירה הקיימת תוך 18 חודשים, עשויה לחול תקרת מימון של 75% — מומלץ להתייעץ עם יועץ משכנתאות.',
      buyerTypeSingle: 'חל על מי שאין בבעלותו דירה נוספת, או שמוכר את דירתו הקיימת תוך 18 חודשים מהרכישה. שיעורי המס מדורגים ונמוכים משמעותית מהמסלול החלופי.',
      masShvach:
        'מס על רווח המכירה בנדל"ן: 25% מהרווח הנקי (תמורת המכירה פחות עלות הרכישה והוצאות מוכרות). לדירת השקעה — לרוב חל. לדירה עיקרית — לרוב פטור. במבנה שותפות ייתכנו פטורים — התייעצו עם עורך דין.',
      Im: 'משמשת לחישוב עמלת פירעון מוקדם. הבנק גובה עמלה כשריבית השוק הנוכחית נמוכה מהריבית הנעולה שלך — ככל שהפער גדול יותר, כך העמלה גבוהה יותר. אם ריבית השוק גבוהה מהנעולה, העמלה היא ₪0. שים לב: החישוב מבוצע על יתרת המשכנתה המלאה — בפועל, מסלול הפריים אינו חייב בעמלה, כך שהעמלה האמיתית עשויה להיות נמוכה במקצת.',
      G0: 'מכפיל היעד קובע את רווח הפרישה הרצוי. 0.5× = "אני רוצה שהרווח הנקי ממכירת הדירה יהיה לפחות 50% מסך כל מה שהוצאתי על הרכישה."',
      R0: 'שכירות חודשית בעת הרכישה, לפני עדכוני שכירות שנתיים. המחשבון מעדכן את השכירות אחת לשנה.',
      purchaseCostsRate: 'עלויות הרכישה כאחוז משווי הדירה, ללא מס רכישה. פירוט אופייני: מתווך ~2% + מע"מ, עו"ד ~0.5% + מע"מ, שמאי ~₪3,500, יועץ משכנתאות לפי הסכמה. ברירת המחדל 5% מתאימה לרוב הרוכשים.',
    },
    crossoverTitle: '🏠 הדירה עוקפת את ההשקעה',
    goalTitle: '🎯 מגיע ליעד',
    expensesTitle: '💰 הוצאות רכישה',
    notWithin30: 'לא בתוך 30 שנה',
    monthLabel: 'חודש',
    yearLabel2: 'שנה',
    goalSubLabel: (p) => `יעד: ${p} מהוצאות הרכישה`,
    goalReachedLine: (year, amount) => `יעד מושג בשנה ${year} · רווח נקי יעד: ${amount}`,
    goalNotReachedLine: (amount) => `יעד לא מושג בטווח של 30 שנה · רווח נקי יעד: ${amount}`,
    downPaymentCard: 'הון עצמי',
    downPaymentTooltip: 'הון עצמי נקבע לפי מחיר הדירה כפול (100% פחות אחוז המימון). לדוגמה: דירה ב-₪3,000,000 עם מימון 50% = הון עצמי של ₪1,500,000.',
    purchaseTaxCard: 'מס רכישה',
    addedCostsCard: 'עלויות עסקה',
    ofAptValue: 'משווי הדירה',
    apartmentLine: 'דירה — רווח נקי ממומש',
    passiveLine: 'פסיבי — רווח נקי ממומש',
    diffLine: 'יתרון הדירה על פני השקעה פסיבית',
    goalLine: 'יעד',
    crossoverLabel: 'נקודת מעבר',
    viewGains: 'רווחים',
    viewDiff: 'הפרש',
    perYear: 'שנה /',
    scrollHint: 'גלגל לזום · גרור להזזה',
    resetZoom: 'אפס זום',
    overtakesPassiveLabel: '🏠 הדירה עוקפת פסיבי',
    prepaymentFeeLabel: 'עמלת פירעון מוקדם',
    prepaymentFeeZero: '(ריבית ≥ ריבית נעולה)',
    prepaymentFeeHint: (pct) => `(₪0 אם ריבית שוק ≥ ${pct})`,
    prepaymentFeeZeroHint: (pct) => `(ריבית שוק ≥ הריבית הנעולה שלך ${pct})`,
    effectiveMortgageRateLabel: 'ריבית אפקטיבית:',
    effectiveMortgageRate: (rate, ib, pm) => `${rate} = ${ib} + 1.5% − ${pm}`,
    tooltipAptLeads: 'יתרון דירה:',
    tooltipPassiveLeads: 'יתרון פסיבי:',
    tooltipBreakEven: 'שוויון:',
    peakAdvantage: (amount, year) => `יתרון מרבי: ${amount} · שנה ${year}`,
    peakPassiveLead: (amount, year) => `יתרון מרבי של פסיבי: ${amount} · שנה ${year}`,
    summaryTwoXovers: (y1, y2, dur) => `דירה עולה על השקעה פסיבית משנה ${y1} עד שנה ${y2} — חלון של ${dur} שנים`,
    summaryPassiveLeads: 'השקעה פסיבית מובילה לאורך כל 30 השנים',
    summaryAptLeadsOnward: (y) => `דירה מובילה מהשנה ${y} ואילך`,
    summaryAptLeadsAll: 'דירה מובילה לאורך כל התקופה',
    costsLiveEp: 'סה"כ עלות הרכישה',
    costsLiveTp: 'מס רכישה',
    costsLiveAdded: 'עלויות עסקה',
    methodologyTitle: 'כיצד זה עובד',
    taxRateLabel: 'שיעור מס:',
    taxRateTotal: (x) => `סה״כ ${x}`,
    taxRateUpTo: (pct, limit) => `${pct} עד ${limit}`,
    taxRateThen: (pct) => `ואז ${pct}`,
    taxRateBeyond: (pct) => `${pct} מעבר לכך`,
    masShvachAutoUpdatedNote: 'עודכן אוטומטית — ניתן לשנות ידנית',
    masShvachInvestorExemptWarning: '⚠️ פטור ממס שבח כמעט ואינו חל על דירה נוספת. מדובר במקרים חריגים בלבד — התייעצו עם עורך דין.',
    exemptTooltip: 'הפטור חל על דירת מגורים עיקרית — דירה שגרתם בה בפועל. אם השכרתם את הדירה לכל אורך התקופה מבלי לגור בה, הפטור אינו חל — גם אם זו דירתכם היחידה. במקרה כזה בחרו \'רגיל (25%)\'. חריג: מבנה בעלות משותפת עשוי להקנות פטור — התייעצו עם עורך דין.',
    dpModeAmount: 'סכום',
    dpModeFraction: 'אחוז',
    dpAdjustedToMin: 'הותאם למינימום החוקי',
    apartmentShort: 'דירה',
    passiveShort: 'פסיבי',
  },
}
