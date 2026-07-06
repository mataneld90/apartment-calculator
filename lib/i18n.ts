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
  occupancyLabel: string
  occupancyRentOut: string
  occupancyLiveIn: string
  groupApartment: string
  groupMortgage: string
  groupCosts: string
  groupSelling: string
  groupPassive: string
  av0Label: string
  pLabel: string
  r0Label: string
  r0LabelLiveIn: string
  liveInRentLabel: string
  liveInRentTooltip: string
  yLabel: string
  vLabel: string
  riLabel: string
  riTooltip: string
  maintenanceRateLabel: string
  maintenanceRateTooltip: string
  maintenanceRateTooltipLiveIn: string
  mortgageRateLabel: string
  mortgageRateTooltip: string
  singleRateHint: string
  mortgageModeSimple: string
  mortgageModeAdvanced: string
  mortgageRateSectionTitle: string
  mortgageModeSimpleTooltip: string
  mortgageModeAdvancedTooltip: string
  trackPrimeLabel: string
  trackFixedLabel: string
  trackVarLabel: string
  trackShareHeader: string
  trackRateHeader: string
  trackSumOk: (total: string) => string
  trackSumWarning: (total: string) => string
  trackPrimeTooltip: (boi: string, prime: string) => string
  esLabel: string
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
    R0: string
    R0LiveIn: string
    occupancyRentOut: string
    occupancyLiveIn: string
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
  cashFlowSubViewRentLiveIn: string
  cashFlowSubViewBars: string
  cashFlowMonthlyNote: string
  cashFlowPositiveFrom: (year: string) => string
  chartViewLabel: string
  cashFlowLabel: string
  cashFlowLegendPositive: string
  cashFlowLegendNegative: string
  cashFlowRentLegend: string
  cashFlowRentLegendLiveIn: string
  cashFlowMortgageLegend: string
  cashFlowRentLabel: string
  cashFlowRentLabelLiveIn: string
  cashFlowMortgageLabel: string
  cashFlowAnnotation: (year: string) => string
  cashFlowSummaryPositive: (year: string) => string
  cashFlowSummaryNegative: string
  cashFlowSummaryAlways: string
  cashFlowAlwaysPositive: string
  cashFlowNeverPositive: string
  perYear: string
  scrollHint: string
  resetZoom: string
  prepaymentScenarioTooltip: string
  prepaymentGapLabel: string
  prepaymentFeeTooltipLabel: string
  prepaymentFeeTooltipLabelShort: string
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
  irrLabel: string
  irrApt: string
  irrPas: string
  feedbackLink: string
  fullVersionPrefix: string
}

export const LANG: Record<Lang, Translation> = {
  en: {
    title: 'Apartment vs. Passive Investment',
    subtitle: 'Israeli real estate vs. passive investing - see when each wins.',
    langToggle: 'עב',
    purchaseTaxLabel: 'Purchase tax',
    occupancyLabel: 'Use of the property',
    occupancyRentOut: 'Rent it out',
    occupancyLiveIn: 'Live in it',
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
    r0LabelLiveIn: "Apartment's market rent",
    liveInRentLabel: "Rent you'd otherwise pay",
    liveInRentTooltip: "The monthly rent you'd pay to live elsewhere if you hadn't bought. By living in your own apartment you avoid it - this is the benefit that offsets the mortgage.",
    yLabel: 'Mortgage period',
    vLabel: 'Apartment appreciation (nominal)',
    riLabel: 'Yearly rent increase',
    riTooltip: "Expected annual rent increase, applied to both the apartment's market rent and the rent you'd otherwise pay. The 2% default matches the Bank of Israel's inflation target.",
    maintenanceRateLabel: 'Annual maintenance',
    maintenanceRateTooltip: 'Annual maintenance cost as a percentage of rent - repairs, wear, and ongoing costs. Deducted from rental income each month.',
    maintenanceRateTooltipLiveIn: "Annual maintenance cost as a percentage of the apartment's market rent - repairs, wear, and ongoing costs you bear as the owner.",
    mortgageRateLabel: 'Blended rate',
    mortgageRateTooltip: 'A single rate that stands in for your whole mortgage - a rough estimate, since a real mortgage mixes several tracks at different rates. The default, 4.4%, reflects a typical Israeli mortgage today (BOI 3.5%, prime 5%). For real numbers, switch to "By track" and enter the rates from your loan agreement. In this mode the early-repayment fee is charged on the full balance.',
    singleRateHint: 'Default 4.4% - a typical figure today; use "By track" for your real per-track rates',
    mortgageModeSimple: 'Single rate',
    mortgageModeAdvanced: 'By track',
    mortgageRateSectionTitle: 'Mortgage rate',
    mortgageModeSimpleTooltip: 'One blended rate standing in for the whole mortgage - a quick approximation when you don\'t want to split it into tracks. The early-repayment fee is charged on the full balance.',
    mortgageModeAdvancedTooltip: 'Split the loan into prime, fixed and variable tracks, each with its own share and rate (they\'re on your loan agreement). More accurate for the early-repayment fee: the prime track is exempt by law, so only fixed and variable are charged. The defaults blend to about the same rate as Single rate, so the payment stays similar - the fee is what drops. Note: CPI-linked (צמוד) tracks aren\'t modeled yet - every track is treated as unlinked and its rate held at today\'s level; inflation indexation may come in a future version.',
    trackPrimeLabel: 'Prime',
    trackFixedLabel: 'Fixed (unlinked)',
    trackVarLabel: 'Variable (unlinked)',
    trackShareHeader: 'Share',
    trackRateHeader: 'Rate',
    trackSumOk: (total) => `Tracks total ${total}`,
    trackSumWarning: (total) => `Tracks total ${total} - shares are normalized to 100%`,
    trackPrimeTooltip: (boi, prime) => `Prime tracks the Bank of Israel rate + 1.5%. BOI is currently ${boi}, so prime = ${prime}. The default seeds this track at that rate.`,
    esLabel: 'Selling costs',
    ipLabel: 'Passive return (net)',
    cgtNote: 'Passive gain is calculated net of 25% capital gains tax at realization',

    purchaseCostsRateLabel: 'Transaction costs',
    yearDisplay: (v) => `${v} yr`,
    yearWord: 'yr',
    mulDisplay: (v) => `${v.toFixed(1)}×`,
    tooltips: {
      pInvestor: 'Israeli law caps mortgage financing at 50% of apartment value for a non-primary residence. If this will become your primary residence and you sell your current apartment within 18 months, the 75% cap may apply - consult a mortgage advisor.',
      pSingle: 'Israeli law caps mortgage financing at 75% of apartment value for a primary residence.',
      Ip: (pct) => `Expected annual return in ILS on a passive stock market investment (e.g. S&P 500 or MSCI World), net of fund fees. Default ${pct} = ~10% in USD, minus ~0.7–0.8% annual shekel appreciation against the dollar (historical trend 2006–2024, linear regression on Bank of Israel data), minus ~0.2% fund management fees. This return is nominal by default. If you switch it to a real (inflation-adjusted) figure, set the apartment appreciation to a real figure as well, so both sides use the same basis.`,
      V: "Expected annual increase in apartment value. In major Israeli cities, the historical average was approximately 5–8% per year in the decade 2012–2022, with significant variation by area and period. This is a nominal figure. If you enter a real (inflation-adjusted) return for the passive investment, use a real appreciation here too - don't mix a real return on one side with a nominal one on the other.",
      Es: 'Selling costs as a percentage of the apartment value at sale. Typical breakdown: agent ~2%, lawyer ~0.5%, plus incidental costs. Common range: 2.5–3%.',

      buyerTypeInvestor:
        'Applies to buyers who already own another apartment and are not selling it before purchase. Purchase tax: 8% up to ₪5,872,725, then 10% on the excess. If this will become your primary residence and you sell your current apartment within 18 months, a 75% mortgage cap may apply - consult a mortgage advisor.',
      buyerTypeSingle:
        'Applies to buyers who own no other apartment, or who sell their current one within 18 months of purchase. Tax rates are graduated and significantly lower than the investor track.',
      masShvach:
        'Tax on real estate sale profit: 25% of net gain (sale proceeds minus purchase cost and recognized expenses). It usually applies if you own other apartments. If this is your only residential apartment (דירה יחידה), held at least 18 months, it is usually exempt up to ₪5,008,000 (2024–2027) - even if you rent it out. Co-ownership and exemption rules are intricate - consult a lawyer.',
      R0: 'Monthly rent at the time of purchase, before annual increases. The calculator applies the rent increase once per year.',
      R0LiveIn: "This apartment's monthly market rent - what a tenant would pay you for it. It sets the annual maintenance cost and the property's rental value.",
      occupancyRentOut: 'You rent the apartment to a tenant and collect rent. This is the default the calculator was built around.',
      occupancyLiveIn: 'You live in the apartment yourself. You collect no rent, but you avoid paying rent elsewhere. For the net-worth comparison this is equivalent to receiving rent, so only the framing changes, not the numbers.',
      purchaseCostsRate: 'Transaction costs as a percentage of apartment value, excluding purchase tax. Typical breakdown: agent ~2% + VAT, lawyer ~0.5% + VAT, appraiser ~₪3,500–₪5,000, mortgage advisor by agreement. The default 5% suits most buyers.',
    },
    monthLabel: 'Month',
    yearLabel2: 'Year',
    downPaymentCard: 'Down payment',
    downPaymentTooltip: 'Down payment is determined by apartment price × (100% − mortgage fraction). For example: ₪3,000,000 apartment with 50% mortgage = ₪1,500,000 down payment.',
    purchaseTaxCard: 'Purchase tax',
    addedCostsCard: 'Transaction costs',
    ofAptValue: 'of apartment value',
    apartmentLine: 'Apartment - net gain at realisation',
    passiveLine: 'Passive - net gain at realisation',
    diffLine: 'Apartment advantage over passive investment',
    viewGains: 'Gains',
    viewDiff: 'Difference',
    viewCashFlow: 'Cash flow',
    cashFlowSubViewRent: 'Rent vs Mortgage',
    cashFlowSubViewRentLiveIn: 'Rent avoided vs Mortgage',
    cashFlowSubViewBars: 'Monthly flow',
    cashFlowMonthlyNote: 'Monthly amounts',
    cashFlowPositiveFrom: (year) => `Positive flow from year ${year}`,
    chartViewLabel: 'Chart view:',
    cashFlowLabel: 'Cash flow:',
    cashFlowLegendPositive: 'Rent exceeds mortgage',
    cashFlowLegendNegative: 'Mortgage exceeds rent',
    cashFlowRentLegend: 'Monthly rental income',
    cashFlowRentLegendLiveIn: 'Monthly rent avoided',
    cashFlowMortgageLegend: 'Monthly mortgage payment',
    cashFlowRentLabel: 'Rental income:',
    cashFlowRentLabelLiveIn: 'Rent avoided:',
    cashFlowMortgageLabel: 'Mortgage payment:',
    cashFlowAnnotation: (year) => `Positive flow from year ${year}`,
    cashFlowSummaryPositive: (year) => `Monthly cash flow turns positive at year ${year} - until then, the shortfall is invested in the passive scenario`,
    cashFlowSummaryNegative: 'Monthly cash flow remains negative throughout the mortgage period',
    cashFlowSummaryAlways: 'Monthly cash flow is positive from day one',
    cashFlowAlwaysPositive: 'Positive flow throughout the entire period',
    cashFlowNeverPositive: 'Cash flow does not turn positive within 30 years',
    perYear: '/ yr',
    scrollHint: 'Scroll to zoom · drag to pan',
    resetZoom: 'Reset zoom',
    prepaymentScenarioTooltip: 'Set how far market rates have fallen below your mortgage rate; a bigger drop means a bigger fee, and if rates rose or held the fee is zero. In single-rate mode the fee is applied to the whole balance (a slightly conservative estimate, since the prime track is exempt by law). In by-track mode the prime track is excluded and only the fixed and variable tracks are charged.',
    prepaymentGapLabel: 'How much market rates have fallen since you locked in',
    prepaymentFeeTooltipLabel: 'Prepayment fee',
    prepaymentFeeTooltipLabelShort: 'Fee',
    tooltipAptLeads: 'Apartment leads:',
    tooltipPassiveLeads: 'Passive leads:',
    tooltipBreakEven: 'Break even:',
    peakAdvantage: (amount, year) => `Peak advantage: ${amount} at year ${year}`,
    summaryTwoXovers: (y1, y2, dur) => `Apartment leads passive from year ${y1} to ${y2} - a ${dur}-year window`,
    summaryPassiveLeads: 'Passive investment leads throughout the full 30-year horizon',
    summaryAptLeadsOnward: (y) => `Apartment leads passive from year ${y} onward`,
    summaryAptLeadsAll: 'Apartment leads passive throughout - passive never catches up within 30 years',
    costsLiveEp: 'Total paid to buy',
    costsLiveTp: 'Purchase tax',
    costsLiveAdded: 'Transaction costs',
    methodologyTitle: 'How this works',
    taxRateLabel: 'Tax rate:',
    taxRateTotal: (x) => `Total ${x}`,
    taxRateUpTo: (pct, limit) => `${pct} up to ${limit}`,
    taxRateThen: (pct) => `then ${pct}`,
    taxRateBeyond: (pct) => `${pct} beyond`,
    masShvachInvestorExemptWarning: '⚠️ מס שבח exemption almost never applies to an additional apartment. This applies only in exceptional cases - consult a lawyer.',
    exemptTooltip: "The מס שבח exemption applies when this is your only residential apartment (דירה יחידה) and you've owned it at least 18 months. It does not have to be where you live - an apartment you rent out can still qualify, as long as it's used for residential purposes and you own no other apartment. Exempt up to ₪5,008,000 (2024–2027); any value above that is taxed. If in doubt, consult a tax advisor.",
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
    irrLabel: 'IRR',
    irrApt: 'Apartment',
    irrPas: 'Passive',
    feedbackLink: 'Send feedback',
    fullVersionPrefix: 'Full version at ',
  },
  he: {
    title: 'דירה מול השקעה פסיבית',
    subtitle: 'נדל״ן ישראלי מול השקעה פסיבית - מתי כל אחד עדיף.',
    langToggle: 'EN',
    purchaseTaxLabel: 'מס רכישה',
    occupancyLabel: 'ייעוד הנכס',
    occupancyRentOut: 'השכרה',
    occupancyLiveIn: 'מגורים',
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
    r0LabelLiveIn: 'דמי השכירות בשוק',
    liveInRentLabel: 'שכר דירה שהייתם משלמים',
    liveInRentTooltip: 'שכר הדירה החודשי שהייתם משלמים כדי לגור במקום אחר אילולא קניתם. המגורים בדירה שלכם חוסכים לכם אותו - זוהי התועלת שמקזזת את המשכנתה.',
    yLabel: 'תקופת משכנתה',
    vLabel: 'עליית ערך שנתית (נומינלית)',
    riLabel: 'עליית שכירות שנתית',
    riTooltip: 'עליית שכר דירה שנתית צפויה, החלה הן על שכר הדירה בשוק והן על שכר הדירה שהייתם משלמים. ברירת המחדל 2% תואמת את יעד האינפלציה של בנק ישראל.',
    maintenanceRateLabel: 'תחזוקה שנתית',
    maintenanceRateTooltip: 'עלות תחזוקה שנתית כאחוז מהשכירות - תיקונים, בלאי, ועלויות שוטפות. מנוכה מהכנסת השכירות בכל חודש.',
    maintenanceRateTooltipLiveIn: 'עלות תחזוקה שנתית כאחוז משכר הדירה של דירה זו בשוק - תיקונים, בלאי ועלויות שוטפות שאתם נושאים בהן כבעלים.',
    mortgageRateLabel: 'ריבית משוקללת',
    mortgageRateTooltip: 'ריבית אחת שמייצגת את כל המשכנתה - אומדן גס, משום שמשכנתה אמיתית מורכבת ממספר מסלולים בריביות שונות. ברירת המחדל, 4.4%, משקפת משכנתה טיפוסית בישראל כיום (ריבית בנק ישראל 3.5%, פריים 5%). לנתונים אמיתיים עברו ל"לפי מסלול" והזינו את הריביות מדף תנאי ההלוואה. במצב זה עמלת הפירעון המוקדם מחושבת על מלוא היתרה.',
    singleRateHint: 'ברירת מחדל 4.4% - נתון טיפוסי כיום; לריביות בפועל עברו ל"לפי מסלול"',
    mortgageModeSimple: 'ריבית אחת',
    mortgageModeAdvanced: 'לפי מסלול',
    mortgageRateSectionTitle: 'ריבית המשכנתה',
    mortgageModeSimpleTooltip: 'ריבית אחת שמייצגת בקירוב את כל המשכנתה - קירוב מהיר כשלא מפרקים למסלולים. עמלת הפירעון המוקדם מחושבת על מלוא היתרה.',
    mortgageModeAdvancedTooltip: 'פיצול ההלוואה למסלולי פריים, קבוע ומשתנה, לכל אחד חלק וריבית משלו (מופיעים בדף תנאי ההלוואה). מדויק יותר לעמלת הפירעון המוקדם: מסלול הפריים פטור על־פי חוק, ולכן רק הקבוע והמשתנה מחויבים. ברירות המחדל משוקללות לריבית דומה ל"ריבית אחת", כך שההחזר נשאר דומה - מה שיורד הוא העמלה. הערה: מסלולים צמודי מדד אינם ממודלים עדיין - כל מסלול מטופל כלא־צמוד והריבית מוקפאת ברמה של היום; הצמדה למדד אולי תיתווסף בגרסה עתידית.',
    trackPrimeLabel: 'פריים',
    trackFixedLabel: 'קבועה (לא צמודה)',
    trackVarLabel: 'משתנה (לא צמודה)',
    trackShareHeader: 'חלק',
    trackRateHeader: 'ריבית',
    trackSumOk: (total) => `סך המסלולים ${total}`,
    trackSumWarning: (total) => `סך המסלולים ${total} - החלקים מנורמלים ל־100%`,
    trackPrimeTooltip: (boi, prime) => `הפריים נקבע לפי ריבית בנק ישראל + 1.5%. ריבית בנק ישראל כיום ${boi}, ולכן הפריים = ${prime}. ברירת המחדל מאתחלת את המסלול בריבית זו.`,
    esLabel: 'עלויות מכירה',
    ipLabel: 'תשואה פסיבית (נטו) / שנה',
    cgtNote: 'הרווח הפסיבי מחושב נטו לאחר מס רווח הון 25% במימוש',

    purchaseCostsRateLabel: 'עלויות עסקה',
    yearDisplay: (v) => `${v} שנה`,
    yearWord: 'שנה',
    mulDisplay: (v) => `${v.toFixed(1)}×`,
    tooltips: {
      pInvestor: 'החוק בישראל מגביל מימון משכנתה ל-50% משווי הדירה עבור דירה שאינה מגורים עיקריים. אם הדירה החדשה תשמש כמגוריכם העיקריים ותמכרו את הדירה הקיימת תוך 18 חודשים, עשויה לחול תקרת מימון של 75% - מומלץ להתייעץ עם יועץ משכנתאות.',
      pSingle: 'החוק בישראל מגביל מימון משכנתה ל-75% משווי הדירה עבור דירת מגורים עיקריים.',
      Ip: (pct) => `תשואה שנתית צפויה בשקלים על השקעה פסיבית במדד מניות (כגון S&P 500 או MSCI World), נטו מדמי ניהול. ברירת המחדל ${pct} = ~10% בדולרים, פחות ~0.7–0.8% התחזקות שקל מול דולר (מגמה היסטורית 2006–2024, רגרסיה לינארית על נתוני בנק ישראל) ופחות ~0.2% דמי ניהול. תשואה זו נומינלית כברירת מחדל. אם תעברו לערך ריאלי (מנוכה אינפלציה), הגדירו גם את עליית ערך הדירה כערך ריאלי, כך ששני הצדדים ישתמשו באותו בסיס.`,
      V: 'עלייה שנתית צפויה בשווי הדירה. בערים גדולות בישראל עמד הממוצע על כ-5–8% בשנה בעשור 2012–2022, עם שונות משמעותית בין אזורים ותקופות. מדובר בערך נומינלי. אם הזנתם תשואה ריאלית (מנוכת אינפלציה) בהשקעה הפסיבית, השתמשו גם כאן בעליית ערך ריאלית - אין לערבב תשואה ריאלית בצד אחד עם ערך נומינלי בצד השני.',
      Es: 'עלויות מכירה כאחוז משווי הדירה בעת המכירה. פירוט אופייני: מתווך ~2%, עו"ד ~0.5%, ועלויות נלוות נוספות. טווח מקובל: 2.5–3%.',

      buyerTypeInvestor: 'חל על מי שמחזיקים בדירה נוספת ואינם מוכרים אותה לפני הרכישה. מס רכישה: 8% עד ₪5,872,725, ו-10% על החלק שמעבר. אם הדירה החדשה תשמש כמגוריכם העיקריים ותמכרו את הדירה הקיימת תוך 18 חודשים, עשויה לחול תקרת מימון של 75% - מומלץ להתייעץ עם יועץ משכנתאות.',
      buyerTypeSingle: 'חל על מי שאין בבעלותם דירה נוספת, או שמוכרים את דירתם הקיימת תוך 18 חודשים מהרכישה. שיעורי המס מדורגים ונמוכים משמעותית מהמסלול החלופי.',
      masShvach:
        'מס על רווח המכירה בנדל"ן: 25% מהרווח הנקי (תמורת המכירה פחות הוצאות הרכישה והוצאות מוכרות). לרוב חל אם בבעלותכם דירות נוספות. אם זו דירתכם היחידה למגורים (דירה יחידה), שבבעלותכם לפחות 18 חודשים - לרוב פטורה עד ₪5,008,000 (2024–2027), גם אם היא מושכרת. כללי השותפות והפטור מורכבים - התייעצו עם עורך דין.',
      R0: 'שכירות חודשית בעת הרכישה, לפני עדכוני שכירות שנתיים. המחשבון מעדכן את השכירות אחת לשנה.',
      R0LiveIn: 'שכר הדירה החודשי ששוכר היה משלם עבור דירה זו. הוא קובע את עלות התחזוקה השנתית ואת שווי השכירות של הנכס.',
      occupancyRentOut: 'אתם משכירים את הדירה לשוכר וגובים שכר דירה.',
      occupancyLiveIn: 'אתם גרים בדירה בעצמכם. אינכם גובים שכר דירה, אך אתם חוסכים תשלום שכר דירה במקום אחר.',
      purchaseCostsRate: 'עלויות הרכישה כאחוז משווי הדירה, ללא מס רכישה. פירוט אופייני: מתווך ~2% + מע"מ, עו"ד ~0.5% + מע"מ, שמאי ~₪3,500–₪5,000, יועץ משכנתאות לפי הסכמה. ברירת המחדל 5% מתאימה לרוב הרוכשים.',
    },
    monthLabel: 'חודש',
    yearLabel2: 'שנה',
    downPaymentCard: 'הון עצמי',
    downPaymentTooltip: 'הון עצמי נקבע לפי מחיר הדירה כפול (100% פחות אחוז המימון). לדוגמה: דירה ב-₪3,000,000 עם מימון 50% = הון עצמי של ₪1,500,000.',
    purchaseTaxCard: 'מס רכישה',
    addedCostsCard: 'עלויות עסקה',
    ofAptValue: 'משווי הדירה',
    apartmentLine: 'דירה - רווח נקי במימוש',
    passiveLine: 'פסיבי - רווח נקי במימוש',
    diffLine: 'יתרון הדירה על פני השקעה פסיבית',
    viewGains: 'רווחים',
    viewDiff: 'הפרש',
    viewCashFlow: 'תזרים',
    cashFlowSubViewRent: 'שכירות / משכנתה',
    cashFlowSubViewRentLiveIn: 'שכ"ד שנחסך / משכנתה',
    cashFlowSubViewBars: 'תזרים חודשי',
    cashFlowMonthlyNote: 'ערכים חודשיים',
    cashFlowPositiveFrom: (year) => `תזרים חיובי החל משנה ${year}`,
    chartViewLabel: 'תצוגת גרף:',
    cashFlowLabel: 'תזרים:',
    cashFlowLegendPositive: 'הכנסה עולה על משכנתה',
    cashFlowLegendNegative: 'משכנתה עולה על הכנסה',
    cashFlowRentLegend: 'הכנסה חודשית משכירות',
    cashFlowRentLegendLiveIn: 'שכר דירה חודשי שנחסך',
    cashFlowMortgageLegend: 'תשלום משכנתה חודשי',
    cashFlowRentLabel: 'הכנסה משכירות:',
    cashFlowRentLabelLiveIn: 'שכר דירה שנחסך:',
    cashFlowMortgageLabel: 'תשלום משכנתה:',
    cashFlowAnnotation: (year) => `תזרים חיובי משנה ${year}`,
    cashFlowSummaryPositive: (year) => `התזרים החודשי הופך לחיובי בשנה ${year} - עד אז, ההפרש מושקע בתרחיש הפסיבי`,
    cashFlowSummaryNegative: 'התזרים החודשי שלילי לאורך כל תקופת המשכנתה',
    cashFlowSummaryAlways: 'התזרים החודשי חיובי מהיום הראשון',
    cashFlowAlwaysPositive: 'תזרים חיובי לאורך כל התקופה',
    cashFlowNeverPositive: 'התזרים אינו הופך לחיובי בטווח של 30 שנה',
    perYear: 'שנה /',
    scrollHint: 'גלגלו לזום · גררו להזזה',
    resetZoom: 'איפוס זום',
    prepaymentScenarioTooltip: 'כיוונו עד כמה ירדה ריבית השוק מתחת לריבית המשכנתה; ירידה גדולה יותר משמעה קנס גדול יותר, ואם הריבית עלתה או נותרה ללא שינוי הקנס אפס. במצב ריבית אחת הקנס מחושב על מלוא היתרה (הערכה מעט שמרנית, שכן מסלול הפריים פטור על־פי חוק). במצב לפי מסלול מסלול הפריים מוחרג, ורק המסלול הקבוע והמשתנה מחויבים.',
    prepaymentGapLabel: 'כמה ירדה ריבית השוק מאז נטילת המשכנתה',
    prepaymentFeeTooltipLabel: 'קנס פירעון מוקדם',
    prepaymentFeeTooltipLabelShort: 'קנס',
    tooltipAptLeads: 'יתרון דירה:',
    tooltipPassiveLeads: 'יתרון פסיבי:',
    tooltipBreakEven: 'שוויון:',
    peakAdvantage: (amount, year) => `יתרון מרבי: ${amount} · שנה ${year}`,
    summaryTwoXovers: (y1, y2, dur) => `דירה עולה על השקעה פסיבית משנה ${y1} עד שנה ${y2} - חלון של ${dur} שנים`,
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
    masShvachInvestorExemptWarning: '⚠️ פטור ממס שבח כמעט ואינו חל על דירה נוספת. מדובר במקרים חריגים בלבד - התייעצו עם עורך דין.',
    exemptTooltip: 'הפטור ממס שבח חל כאשר זו דירתכם היחידה למגורים (דירה יחידה) ובבעלותכם לפחות 18 חודשים. אין צורך שתתגוררו בה בעצמכם - גם דירה שאתם משכירים יכולה להיות זכאית, כל עוד היא משמשת למגורים ואין בבעלותכם דירה נוספת. הפטור עד ₪5,008,000 (2024–2027); כל שווי שמעליו חייב במס. במקרה של ספק - התייעצו עם יועץ מס.',
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
    irrLabel: 'תשואה שנתית (IRR)',
    irrApt: 'דירה',
    irrPas: 'פסיבי',
    feedbackLink: 'שליחת משוב',
    fullVersionPrefix: 'הגרסה המלאה ב-',
  },
}
