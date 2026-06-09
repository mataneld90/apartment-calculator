import { pct } from './formatters'

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
  groupApartment: string
  groupMortgage: string
  groupCosts: string
  groupSelling: string
  groupPassive: string
  av0Label: string
  pLabel: string
  r0Label: string
  yLabel: string
  vLabel: string
  riLabel: string
  riTooltip: string
  maintenanceRateLabel: string
  maintenanceRateTooltip: string
  mortgageRateLabel: string
  mortgageRateTooltip: string
  primeHelperLine: (boiRate: string) => string
  esLabel: string
  imLabel: string
  ipLabel: string
  cgtNote: string

  purchaseCostsRateLabel: string
  yearDisplay: (v: number) => string
  yearWord: string
  mulDisplay: (v: number) => string
  tooltips: {
    pInvestor: string
    pSingle: string
    Ip: (defaultPct: string) => string
    V: string
    Es: string

    buyerTypeInvestor: string
    buyerTypeSingle: string
    masShvach: string
    Im: string
    R0: string
    purchaseCostsRate: string
  }
  monthLabel: string
  yearLabel2: string
  downPaymentCard: string
  downPaymentTooltip: string
  purchaseTaxCard: string
  addedCostsCard: string
  ofAptValue: string
  apartmentLine: string
  passiveLine: string
  diffLine: string
  viewGains: string
  viewDiff: string
  viewCashFlow: string
  cashFlowSubViewRent: string
  cashFlowSubViewBars: string
  cashFlowPositiveFrom: (year: string) => string
  chartViewLabel: string
  diffHint: string
  cashFlowHint: string
  cashFlowLabel: string
  cashFlowLegendPositive: string
  cashFlowLegendNegative: string
  cashFlowRentLegend: string
  cashFlowMortgageLegend: string
  cashFlowRentLabel: string
  cashFlowMortgageLabel: string
  cashFlowAnnotation: (year: string) => string
  cashFlowSummaryPositive: (year: string) => string
  cashFlowSummaryNegative: string
  cashFlowSummaryAlways: string
  perYear: string
  scrollHint: string
  resetZoom: string
  prepaymentFeeLabel: string
  prepaymentFeeZero: string
  prepaymentFeeHint: (pct: string) => string
  prepaymentFeeZeroHint: (pct: string) => string
  prepaymentFeeThresholdNote: (pct: string) => string
  tooltipAptLeads: string
  tooltipPassiveLeads: string
  tooltipBreakEven: string
  peakAdvantage: (amount: string, year: string) => string
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
  masShvachInvestorExemptWarning: string
  exemptTooltip: string
  dpModeAmount: string
  dpModeFraction: string
  dpAdjustedToMin: string
  dpDerivedFraction: (p: string) => string
  dpDerivedAmount: (a: string) => string
  apartmentShort: string
  passiveShort: string
  compactLegendDiff: string
  compactLegendRentPos: string
  compactLegendRentNeg: string
}

export const LANG: Record<Lang, Translation> = {
  en: {
    title: 'Apartment vs. Passive Investment',
    subtitle: 'Israeli real estate vs. passive investing — see when each wins.',
    langToggle: 'עב',
    purchaseTaxLabel: 'Purchase tax',
    masShvachLabel: 'Capital gains tax (מס שבח)',
    investor8: 'Additional apartment',
    firstApt: 'My only apartment',
    exempt0: 'Exempt (0%)',
    standard25: 'Standard (25%)',
    groupApartment: 'Property',
    groupMortgage: 'Mortgage',
    groupCosts: 'Purchase',
    groupSelling: 'Sale',
    groupPassive: 'Passive Investment',
    av0Label: 'Apartment purchase price',
    pLabel: 'Mortgage fraction',
    r0Label: 'Starting monthly rent',
    yLabel: 'Mortgage period',
    vLabel: 'Apartment appreciation',
    riLabel: 'Yearly rent increase',
    riTooltip: "Expected annual rent increase. The 2% default matches the Bank of Israel's inflation target.",
    maintenanceRateLabel: 'Annual maintenance',
    maintenanceRateTooltip: 'Annual maintenance cost as a percentage of rent — repairs, wear, and ongoing costs. Deducted from rental income each month.',
    mortgageRateLabel: 'Effective mortgage rate',
    mortgageRateTooltip: 'The blended effective rate across all your mortgage tracks. You can get this figure from your mortgage advisor or bank pre-approval. The default is calculated as the current Bank of Israel rate + 1.5% (prime spread) − 0.9% (a typical good mortgage offer). Typical range in Israel: 3.5%–5.5%.',
    primeHelperLine: (boi) => `Default based on current Bank of Israel rate (${boi})`,
    esLabel: 'Selling costs',
    imLabel: 'Current fixed mortgage rate',
    ipLabel: 'Passive return (net)',
    cgtNote: 'Passive gain is calculated net of 25% capital gains tax at realization',

    purchaseCostsRateLabel: 'Transaction costs',
    yearDisplay: (v) => `${v} yr`,
    yearWord: 'yr',
    mulDisplay: (v) => `${v.toFixed(1)}×`,
    tooltips: {
      pInvestor: 'Israeli law caps mortgage financing at 50% of apartment value for a non-primary residence. If this will become your primary residence and you sell your current apartment within 18 months, the 75% cap may apply — consult a mortgage advisor.',
      pSingle: 'Israeli law caps mortgage financing at 75% of apartment value for a primary residence.',
      Ip: (pct) => `Expected annual return in ILS on a passive stock market investment (e.g. S&P 500 or MSCI World), net of fund fees. Default ${pct} = ~10% in USD, minus ~0.7–0.8% annual shekel appreciation against the dollar (historical trend 2006–2024, linear regression on Bank of Israel data), minus ~0.2% fund management fees.`,
      V: 'Expected annual increase in apartment value. In major Israeli cities, the historical average was approximately 5–8% per year in the decade 2012–2022, with significant variation by area and period.',
      Es: 'Selling costs as a percentage of the apartment value at sale. Typical breakdown: agent ~2%, lawyer ~0.5%, plus incidental costs. Common range: 2.5–3%.',

      buyerTypeInvestor:
        'Applies to buyers who already own another apartment and are not selling it before purchase. Purchase tax: 8% up to ₪5,872,725, then 10% on the excess. If this will become your primary residence and you sell your current apartment within 18 months, a 75% mortgage cap may apply — consult a mortgage advisor.',
      buyerTypeSingle:
        'Applies to buyers who own no other apartment, or who sell their current one within 18 months of purchase. Tax rates are graduated and significantly lower than the investor track.',
      masShvach:
        'Tax on real estate sale profit: 25% of net gain (sale proceeds minus purchase cost and recognized expenses). For an investment apartment — usually applies. For a primary residence — usually exempt. Co-ownership structures may qualify for exemption — consult a lawyer.',
      Im: 'Used to calculate the early repayment fee (עמלת פירעון מוקדם). The bank charges a fee when the current market rate is below your locked rate — the larger the gap, the higher the fee. If the market rate is above your locked rate, the fee is ₪0. Note: the calculation uses the full remaining principal — in practice the prime track carries no prepayment fee, so the actual fee may be slightly lower.',
      R0: 'Monthly rent at the time of purchase, before annual increases. The calculator applies the rent increase once per year.',
      purchaseCostsRate: 'Transaction costs as a percentage of apartment value, excluding purchase tax. Typical breakdown: agent ~2% + VAT, lawyer ~0.5% + VAT, appraiser ~₪3,500–₪5,000, mortgage advisor by agreement. The default 5% suits most buyers.',
    },
    monthLabel: 'Month',
    yearLabel2: 'Year',
    downPaymentCard: 'Down payment',
    downPaymentTooltip: 'Down payment is determined by apartment price × (100% − mortgage fraction). For example: ₪3,000,000 apartment with 50% mortgage = ₪1,500,000 down payment.',
    purchaseTaxCard: 'Purchase tax',
    addedCostsCard: 'Transaction costs',
    ofAptValue: 'of apartment value',
    apartmentLine: 'Apartment — net gain at realisation',
    passiveLine: 'Passive — net gain at realisation',
    diffLine: 'Apartment advantage over passive investment',
    viewGains: 'Gains',
    viewDiff: 'Difference',
    viewCashFlow: 'Cash flow',
    cashFlowSubViewRent: 'Rent vs Mortgage',
    cashFlowSubViewBars: 'Monthly flow',
    cashFlowPositiveFrom: (year) => `Positive flow from year ${year}`,
    chartViewLabel: 'Chart view:',
    diffHint: '💡 Try the Difference view — it shows the gap between both scenarios at each point in time',
    cashFlowHint: '💡 The Cash flow view shows the monthly gap between rent and mortgage — and how long until it turns positive',
    cashFlowLabel: 'Cash flow:',
    cashFlowLegendPositive: 'Rent exceeds mortgage',
    cashFlowLegendNegative: 'Mortgage exceeds rent',
    cashFlowRentLegend: 'Monthly rental income',
    cashFlowMortgageLegend: 'Monthly mortgage payment',
    cashFlowRentLabel: 'Rental income:',
    cashFlowMortgageLabel: 'Mortgage payment:',
    cashFlowAnnotation: (year) => `Positive flow from year ${year}`,
    cashFlowSummaryPositive: (year) => `Monthly cash flow turns positive at year ${year} — until then, the shortfall is invested in the passive scenario`,
    cashFlowSummaryNegative: 'Monthly cash flow remains negative throughout the mortgage period',
    cashFlowSummaryAlways: 'Monthly cash flow is positive from day one',
    perYear: '/ yr',
    scrollHint: 'Scroll to zoom · drag to pan',
    resetZoom: 'Reset zoom',
    prepaymentFeeLabel: 'Early repayment fee',
    prepaymentFeeZero: '(rate ≥ locked rate)',
    prepaymentFeeHint: (pct) => `(₪0 if market rate ≥ ${pct})`,
    prepaymentFeeZeroHint: (pct) => `(market rate ≥ your locked rate of ${pct})`,
    prepaymentFeeThresholdNote: (pct) => `The early repayment fee reaches ₪0 when the current market rate equals your mortgage rate (${pct})`,
    tooltipAptLeads: 'Apartment leads:',
    tooltipPassiveLeads: 'Passive leads:',
    tooltipBreakEven: 'Break even:',
    peakAdvantage: (amount, year) => `Peak advantage: ${amount} at year ${year}`,
    summaryTwoXovers: (y1, y2, dur) => `Apartment leads passive from year ${y1} to ${y2} — a ${dur}-year window`,
    summaryPassiveLeads: 'Passive investment leads throughout the full 30-year horizon',
    summaryAptLeadsOnward: (y) => `Apartment leads passive from year ${y} onward`,
    summaryAptLeadsAll: 'Apartment leads passive throughout — passive never catches up within 30 years',
    costsLiveEp: 'Total paid to buy',
    costsLiveTp: 'Purchase tax',
    costsLiveAdded: 'Transaction costs',
    methodologyTitle: 'How this works',
    taxRateLabel: 'Tax rate:',
    taxRateTotal: (x) => `Total ${x}`,
    taxRateUpTo: (pct, limit) => `${pct} up to ${limit}`,
    taxRateThen: (pct) => `then ${pct}`,
    taxRateBeyond: (pct) => `${pct} beyond`,
    masShvachInvestorExemptWarning: '⚠️ מס שבח exemption almost never applies to an additional apartment. This applies only in exceptional cases — consult a lawyer.',
    exemptTooltip: "The exemption applies to a primary residence — an apartment you actually lived in. If you rented it out for the entire period without living in it, the exemption does not apply — even if it is your only apartment. In that case choose 'Standard (25%)'. Exception: co-ownership structures may qualify — consult a lawyer.",
    dpModeAmount: 'Amount',
    dpModeFraction: 'Fraction',
    dpAdjustedToMin: 'Adjusted to legal minimum',
    dpDerivedFraction: (p) => `Mortgage fraction: ${p} (auto-calculated)`,
    dpDerivedAmount: (a) => `Down payment: ${a} (auto-calculated)`,
    apartmentShort: 'Apartment',
    passiveShort: 'Passive',
    compactLegendDiff: 'Apt. vs. passive advantage',
    compactLegendRentPos: 'Rent > mortgage',
    compactLegendRentNeg: 'Mortgage > rent',
  },
  he: {
    title: 'דירה מול השקעה פסיבית',
    subtitle: 'נדל״ן ישראלי מול השקעה פסיבית — ראו מתי כל אחד עדיף.',
    langToggle: 'EN',
    purchaseTaxLabel: 'מס רכישה',
    masShvachLabel: 'מס שבח',
    investor8: 'דירה נוספת',
    firstApt: 'דירתי היחידה',
    exempt0: 'פטור (0%)',
    standard25: 'רגיל (25%)',
    groupApartment: 'נכס',
    groupMortgage: 'משכנתה',
    groupCosts: 'רכישה',
    groupSelling: 'מכירה',
    groupPassive: 'השקעה פסיבית',
    av0Label: 'מחיר הרכישה',
    pLabel: 'אחוז מימון',
    r0Label: 'שכירות חודשית בתחילת התקופה',
    yLabel: 'תקופת משכנתה',
    vLabel: 'עליית ערך שנתית',
    riLabel: 'עליית שכירות שנתית',
    riTooltip: 'עליית שכר דירה שנתית צפויה. ברירת המחדל 2% תואמת את יעד האינפלציה של בנק ישראל.',
    maintenanceRateLabel: 'תחזוקה שנתית',
    maintenanceRateTooltip: 'עלות תחזוקה שנתית כאחוז מהשכירות — תיקונים, בלאי, ועלויות שוטפות. מנוכה מהכנסת השכירות בכל חודש.',
    mortgageRateLabel: 'ריבית משכנתה אפקטיבית',
    mortgageRateTooltip: 'הריבית האפקטיבית הממוצעת על המשכנתה שלכם, לאחר שקלול כל המסלולים. ניתן לקבל נתון זה מיועץ המשכנתאות או מהאישור העקרוני של הבנק. ברירת המחדל מחושבת לפי ריבית בנק ישראל הנוכחית + 1.5% (פריים) − 0.9% (מרווח אופייני טוב). ריבית אופיינית בישראל: 3.5%–5.5%.',
    primeHelperLine: (boi) => `ברירת מחדל מבוססת על ריבית בנק ישראל עדכנית (${boi})`,
    esLabel: 'עלויות מכירה',
    imLabel: 'ריבית שוק נוכחית',
    ipLabel: 'תשואה פסיבית (נטו) / שנה',
    cgtNote: 'הרווח הפסיבי מחושב נטו לאחר מס רווח הון 25% במימוש',

    purchaseCostsRateLabel: 'עלויות עסקה',
    yearDisplay: (v) => `${v} שנה`,
    yearWord: 'שנה',
    mulDisplay: (v) => `${v.toFixed(1)}×`,
    tooltips: {
      pInvestor: 'החוק בישראל מגביל מימון משכנתה ל-50% משווי הדירה עבור דירה שאינה מגורים עיקריים. אם הדירה החדשה תשמש כמגוריכם העיקריים ותמכרו את הדירה הקיימת תוך 18 חודשים, עשויה לחול תקרת מימון של 75% — מומלץ להתייעץ עם יועץ משכנתאות.',
      pSingle: 'החוק בישראל מגביל מימון משכנתה ל-75% משווי הדירה עבור דירת מגורים עיקריים.',
      Ip: (pct) => `תשואה שנתית צפויה בשקלים על השקעה פסיבית במדד מניות (כגון S&P 500 או MSCI World), נטו מדמי ניהול. ברירת המחדל ${pct} = ~10% בדולרים, פחות ~0.7–0.8% התחזקות שקל מול דולר (מגמה היסטורית 2006–2024, רגרסיה לינארית על נתוני בנק ישראל) ופחות ~0.2% דמי ניהול.`,
      V: 'עלייה שנתית צפויה בשווי הדירה. בערים גדולות בישראל עמד הממוצע על כ-5–8% בשנה בעשור 2012–2022, עם שונות משמעותית בין אזורים ותקופות.',
      Es: 'עלויות מכירה כאחוז משווי הדירה בעת המכירה. פירוט אופייני: מתווך ~2%, עו"ד ~0.5%, ועלויות נלוות נוספות. טווח מקובל: 2.5–3%.',

      buyerTypeInvestor: 'חל על מי שמחזיקים בדירה נוספת ואינם מוכרים אותה לפני הרכישה. מס רכישה: 8% עד ₪5,872,725, ו-10% על החלק שמעבר. אם הדירה החדשה תשמש כמגוריכם העיקריים ותמכרו את הדירה הקיימת תוך 18 חודשים, עשויה לחול תקרת מימון של 75% — מומלץ להתייעץ עם יועץ משכנתאות.',
      buyerTypeSingle: 'חל על מי שאין בבעלותם דירה נוספת, או שמוכרים את דירתם הקיימת תוך 18 חודשים מהרכישה. שיעורי המס מדורגים ונמוכים משמעותית מהמסלול החלופי.',
      masShvach:
        'מס על רווח המכירה בנדל"ן: 25% מהרווח הנקי (תמורת המכירה פחות הוצאות הרכישה והוצאות מוכרות). לדירת השקעה — לרוב חל. לדירה עיקרית — לרוב פטור. במבנה שותפות ייתכנו פטורים — התייעצו עם עורך דין.',
      Im: 'משמשת לחישוב עמלת פירעון מוקדם. הבנק גובה עמלה כשריבית השוק הנוכחית נמוכה מהריבית הנעולה שלכם — ככל שהפער גדול יותר, כך העמלה גבוהה יותר. אם ריבית השוק גבוהה מהנעולה, העמלה היא ₪0. שימו לב: החישוב מבוצע על יתרת המשכנתה המלאה — בפועל, מסלול הפריים אינו חייב בעמלה, כך שהעמלה האמיתית עשויה להיות נמוכה במקצת.',
      R0: 'שכירות חודשית בעת הרכישה, לפני עדכוני שכירות שנתיים. המחשבון מעדכן את השכירות אחת לשנה.',
      purchaseCostsRate: 'עלויות הרכישה כאחוז משווי הדירה, ללא מס רכישה. פירוט אופייני: מתווך ~2% + מע"מ, עו"ד ~0.5% + מע"מ, שמאי ~₪3,500–₪5,000, יועץ משכנתאות לפי הסכמה. ברירת המחדל 5% מתאימה לרוב הרוכשים.',
    },
    monthLabel: 'חודש',
    yearLabel2: 'שנה',
    downPaymentCard: 'הון עצמי',
    downPaymentTooltip: 'הון עצמי נקבע לפי מחיר הדירה כפול (100% פחות אחוז המימון). לדוגמה: דירה ב-₪3,000,000 עם מימון 50% = הון עצמי של ₪1,500,000.',
    purchaseTaxCard: 'מס רכישה',
    addedCostsCard: 'עלויות עסקה',
    ofAptValue: 'משווי הדירה',
    apartmentLine: 'דירה — רווח נקי במימוש',
    passiveLine: 'פסיבי — רווח נקי במימוש',
    diffLine: 'יתרון הדירה על פני השקעה פסיבית',
    viewGains: 'רווחים',
    viewDiff: 'הפרש',
    viewCashFlow: 'תזרים',
    cashFlowSubViewRent: 'שכירות / משכנתה',
    cashFlowSubViewBars: 'תזרים חודשי',
    cashFlowPositiveFrom: (year) => `תזרים חיובי החל משנה ${year}`,
    chartViewLabel: 'תצוגת גרף:',
    diffHint: '💡 נסו את תצוגת ההפרש — היא מציגה את הפער בין שני התרחישים בכל נקודת זמן',
    cashFlowHint: '💡 תצוגת התזרים מציגה את ההפרש החודשי בין שכירות למשכנתה — וכמה זמן עד שהוא הופך לחיובי',
    cashFlowLabel: 'תזרים:',
    cashFlowLegendPositive: 'הכנסה עולה על משכנתה',
    cashFlowLegendNegative: 'משכנתה עולה על הכנסה',
    cashFlowRentLegend: 'הכנסה חודשית משכירות',
    cashFlowMortgageLegend: 'תשלום משכנתה חודשי',
    cashFlowRentLabel: 'הכנסה משכירות:',
    cashFlowMortgageLabel: 'תשלום משכנתה:',
    cashFlowAnnotation: (year) => `תזרים חיובי משנה ${year}`,
    cashFlowSummaryPositive: (year) => `התזרים החודשי הופך לחיובי בשנה ${year} — עד אז, ההפרש מושקע בתרחיש הפסיבי`,
    cashFlowSummaryNegative: 'התזרים החודשי שלילי לאורך כל תקופת המשכנתה',
    cashFlowSummaryAlways: 'התזרים החודשי חיובי מהיום הראשון',
    perYear: 'שנה /',
    scrollHint: 'גלגלו לזום · גררו להזזה',
    resetZoom: 'איפוס זום',
    prepaymentFeeLabel: 'עמלת פירעון מוקדם',
    prepaymentFeeZero: '(ריבית ≥ ריבית נעולה)',
    prepaymentFeeHint: (pct) => `(₪0 אם ריבית שוק ≥ ${pct})`,
    prepaymentFeeZeroHint: (pct) => `(ריבית שוק ≥ הריבית הנעולה שלכם ${pct})`,
    prepaymentFeeThresholdNote: (pct) => `עמלת הפירעון תתאפס כשריבית השוק הנוכחית מגיעה לרמת ריבית המשכנתה שלכם (${pct})`,
    tooltipAptLeads: 'יתרון דירה:',
    tooltipPassiveLeads: 'יתרון פסיבי:',
    tooltipBreakEven: 'שוויון:',
    peakAdvantage: (amount, year) => `יתרון מרבי: ${amount} · שנה ${year}`,
    summaryTwoXovers: (y1, y2, dur) => `דירה עולה על השקעה פסיבית משנה ${y1} עד שנה ${y2} — חלון של ${dur} שנים`,
    summaryPassiveLeads: 'השקעה פסיבית מובילה לאורך כל 30 השנים',
    summaryAptLeadsOnward: (y) => `דירה מובילה מהשנה ${y} ואילך`,
    summaryAptLeadsAll: 'דירה מובילה לאורך כל התקופה',
    costsLiveEp: 'סה"כ הוצאות רכישה',
    costsLiveTp: 'מס רכישה',
    costsLiveAdded: 'עלויות עסקה',
    methodologyTitle: 'כיצד זה עובד',
    taxRateLabel: 'שיעור מס:',
    taxRateTotal: (x) => `סה״כ ${x}`,
    taxRateUpTo: (pct, limit) => `${pct} עד ${limit}`,
    taxRateThen: (pct) => `ואז ${pct}`,
    taxRateBeyond: (pct) => `${pct} מעבר לכך`,
    masShvachInvestorExemptWarning: '⚠️ פטור ממס שבח כמעט ואינו חל על דירה נוספת. מדובר במקרים חריגים בלבד — התייעצו עם עורך דין.',
    exemptTooltip: 'הפטור חל על דירת מגורים עיקרית — דירה שגרתם בה בפועל. אם השכרתם את הדירה לכל אורך התקופה מבלי לגור בה, הפטור אינו חל — גם אם זו דירתכם היחידה. במקרה כזה בחרו \'רגיל (25%)\'. חריג: מבנה בעלות משותפת עשוי להקנות פטור — התייעצו עם עורך דין.',
    dpModeAmount: 'סכום',
    dpModeFraction: 'אחוז',
    dpAdjustedToMin: 'הותאם למינימום החוקי',
    dpDerivedFraction: (p) => `אחוז מימון: ${p} (מחושב אוטומטית)`,
    dpDerivedAmount: (a) => `הון עצמי: ${a} (מחושב אוטומטית)`,
    apartmentShort: 'דירה',
    passiveShort: 'פסיבי',
    compactLegendDiff: 'יתרון דירה על פסיבי',
    compactLegendRentPos: 'שכירות > משכנתה',
    compactLegendRentNeg: 'משכנתה > שכירות',
  },
}
