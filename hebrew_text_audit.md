# Hebrew Text Audit — Both Apps

Extracted verbatim. No paraphrasing, no translation, no cleanup.
Date: 2026-06-15

---

## APP: CALC (`apartment-calculator`)

---

### `lib/i18n.ts` — HE translation object

| Key | Hebrew text | Context |
|-----|------------|---------|
| `title` | דירה מול השקעה פסיבית | App title / h1 |
| `subtitle` | נדל״ן ישראלי מול השקעה פסיבית — מתי כל אחד עדיף. | App subtitle / subheadline |
| `methodologyTitle` | כיצד זה עובד | "How this works" button label + modal title |
| `purchaseTaxLabel` | מס רכישה | TaxToggle label |
| `masShvachLabel` | מס שבח | TaxToggle label |
| `investor8` | דירה נוספת | Purchase-tax mode selector |
| `firstApt` | דירתי היחידה | Purchase-tax mode selector |
| `exempt0` | פטור (0%) | מס שבח toggle option |
| `standard25` | רגיל (25%) | מס שבח toggle option |
| `groupApartment` | נכס | Slider group header |
| `groupMortgage` | משכנתה | Slider group header |
| `groupCosts` | רכישה | Slider group header |
| `groupSelling` | מכירה | Slider group header |
| `groupPassive` | השקעה פסיבית | Slider group header |
| `av0Label` | מחיר הרכישה | Slider label |
| `pLabel` | אחוז מימון | Slider label |
| `r0Label` | שכירות חודשית בתחילת התקופה | Slider label |
| `yLabel` | תקופת משכנתה | Slider label |
| `vLabel` | עליית ערך שנתית | Slider label |
| `riLabel` | עליית שכירות שנתית | Slider label |
| `riTooltip` | עליית שכר דירה שנתית צפויה. ברירת המחדל 2% תואמת את יעד האינפלציה של בנק ישראל. | Slider tooltip |
| `maintenanceRateLabel` | תחזוקה שנתית | Slider label |
| `maintenanceRateTooltip` | עלות תחזוקה שנתית כאחוז מהשכירות — תיקונים, בלאי, ועלויות שוטפות. מנוכה מהכנסת השכירות בכל חודש. | Slider tooltip |
| `mortgageRateLabel` | ריבית משכנתה אפקטיבית | Slider label |
| `mortgageRateTooltip` | הריבית האפקטיבית הממוצעת על המשכנתה שלכם, לאחר שקלול כל המסלולים. ניתן לקבל נתון זה מיועץ המשכנתאות או מהאישור העקרוני של הבנק. טווח אופייני בישראל כיום: 4%–5.5%. | Slider tooltip |
| `primeHelperLine` | ברירת מחדל מבוססת על ריבית בנק ישראל עדכנית (${boi}) | Slider helper line below mortgage rate |
| `esLabel` | עלויות מכירה | Slider label |
| `imLabel` | ריבית שוק במכירה | Slider label |
| `ipLabel` | תשואה פסיבית (נטו) / שנה | Slider label |
| `cgtNote` | הרווח הפסיבי מחושב נטו לאחר מס רווח הון 25% במימוש | Note below passive return slider |
| `purchaseCostsRateLabel` | עלויות עסקה | Slider label |
| `yearDisplay` | ${v} שנה | Term display in slider (e.g. "25 שנה") |
| `yearWord` | שנה | Year unit |
| `tooltips.pInvestor` | החוק בישראל מגביל מימון משכנתה ל-50% משווי הדירה עבור דירה שאינה מגורים עיקריים. אם הדירה החדשה תשמש כמגוריכם העיקריים ותמכרו את הדירה הקיימת תוך 18 חודשים, עשויה לחול תקרת מימון של 75% — מומלץ להתייעץ עם יועץ משכנתאות. | Tooltip: financing pct (investor) |
| `tooltips.pSingle` | החוק בישראל מגביל מימון משכנתה ל-75% משווי הדירה עבור דירת מגורים עיקריים. | Tooltip: financing pct (first apartment) |
| `tooltips.Ip` | תשואה שנתית צפויה בשקלים על השקעה פסיבית במדד מניות (כגון S&P 500 או MSCI World), נטו מדמי ניהול. ברירת המחדל ${pct} = ~10% בדולרים, פחות ~0.7–0.8% התחזקות שקל מול דולר (מגמה היסטורית 2006–2024, רגרסיה לינארית על נתוני בנק ישראל) ופחות ~0.2% דמי ניהול. | Tooltip: passive return |
| `tooltips.V` | עלייה שנתית צפויה בשווי הדירה. בערים גדולות בישראל עמד הממוצע על כ-5–8% בשנה בעשור 2012–2022, עם שונות משמעותית בין אזורים ותקופות. | Tooltip: appreciation rate |
| `tooltips.Es` | עלויות מכירה כאחוז משווי הדירה בעת המכירה. פירוט אופייני: מתווך ~2%, עו"ד ~0.5%, ועלויות נלוות נוספות. טווח מקובל: 2.5–3%. | Tooltip: selling costs |
| `tooltips.buyerTypeInvestor` | חל על מי שמחזיקים בדירה נוספת ואינם מוכרים אותה לפני הרכישה. מס רכישה: 8% עד ₪5,872,725, ו-10% על החלק שמעבר. אם הדירה החדשה תשמש כמגוריכם העיקריים ותמכרו את הדירה הקיימת תוך 18 חודשים, עשויה לחול תקרת מימון של 75% — מומלץ להתייעץ עם יועץ משכנתאות. | Tooltip: investor buyer type |
| `tooltips.buyerTypeSingle` | חל על מי שאין בבעלותם דירה נוספת, או שמוכרים את דירתם הקיימת תוך 18 חודשים מהרכישה. שיעורי המס מדורגים ונמוכים משמעותית מהמסלול החלופי. | Tooltip: single buyer type |
| `tooltips.masShvach` | מס על רווח המכירה בנדל"ן: 25% מהרווח הנקי (תמורת המכירה פחות הוצאות הרכישה והוצאות מוכרות). לדירת השקעה — לרוב חל. לדירה עיקרית — לרוב פטור. במבנה שותפות ייתכנו פטורים — התייעצו עם עורך דין. | Tooltip: מס שבח |
| `tooltips.Im` | משמשת לחישוב עמלת פירעון מוקדם. הבנק גובה עמלה כשריבית השוק הנוכחית נמוכה מריבית המשכנתה האפקטיבית שלכם — ככל שהפער גדול יותר, כך העמלה גבוהה יותר. אם ריבית השוק גבוהה מריבית המשכנתה האפקטיבית שלכם, העמלה היא ₪0. שימו לב: החישוב מבוצע על יתרת המשכנתה המלאה — בפועל, מסלול הפריים אינו חייב בעמלה, כך שהעמלה האמיתית עשויה להיות נמוכה במקצת. | Tooltip: market rate |
| `tooltips.R0` | שכירות חודשית בעת הרכישה, לפני עדכוני שכירות שנתיים. המחשבון מעדכן את השכירות אחת לשנה. | Tooltip: initial rent |
| `tooltips.purchaseCostsRate` | עלויות הרכישה כאחוז משווי הדירה, ללא מס רכישה. פירוט אופייני: מתווך ~2% + מע"מ, עו"ד ~0.5% + מע"מ, שמאי ~₪3,500–₪5,000, יועץ משכנתאות לפי הסכמה. ברירת המחדל 5% מתאימה לרוב הרוכשים. | Tooltip: purchase costs rate |
| `monthLabel` | חודש | Chart axis label |
| `yearLabel2` | שנה | Chart axis label |
| `downPaymentCard` | הון עצמי | Summary bar card label |
| `downPaymentTooltip` | הון עצמי נקבע לפי מחיר הדירה כפול (100% פחות אחוז המימון). לדוגמה: דירה ב-₪3,000,000 עם מימון 50% = הון עצמי של ₪1,500,000. | Tooltip on down payment card |
| `purchaseTaxCard` | מס רכישה | Summary bar card label |
| `addedCostsCard` | עלויות עסקה | Summary bar card label |
| `ofAptValue` | משווי הדירה | "% of apartment value" suffix |
| `apartmentLine` | דירה — רווח נקי במימוש | Chart legend |
| `passiveLine` | פסיבי — רווח נקי במימוש | Chart legend |
| `diffLine` | יתרון הדירה על פני השקעה פסיבית | Chart legend (diff view) |
| `viewGains` | רווחים | Chart view tab |
| `viewDiff` | הפרש | Chart view tab |
| `viewCashFlow` | תזרים | Chart view tab |
| `cashFlowSubViewRent` | שכירות / משכנתה | Cash flow sub-tab |
| `cashFlowSubViewBars` | תזרים חודשי | Cash flow sub-tab |
| `cashFlowPositiveFrom` | תזרים חיובי החל משנה ${year} | Chart annotation |
| `chartViewLabel` | תצוגת גרף: | Above chart view tabs |
| `diffHint` | 💡 נסו את תצוגת ההפרש — היא מציגה את הפער בין שני התרחישים בכל נקודת זמן | In-chart hint for first-time visitors |
| `cashFlowHint` | 💡 תצוגת התזרים מציגה את ההפרש החודשי בין שכירות למשכנתה — וכמה זמן עד שהוא הופך לחיובי | In-chart hint |
| `cashFlowLabel` | תזרים: | Cash flow panel label |
| `cashFlowLegendPositive` | הכנסה עולה על משכנתה | Cash flow legend |
| `cashFlowLegendNegative` | משכנתה עולה על הכנסה | Cash flow legend |
| `cashFlowRentLegend` | הכנסה חודשית משכירות | Chart legend |
| `cashFlowMortgageLegend` | תשלום משכנתה חודשי | Chart legend |
| `cashFlowRentLabel` | הכנסה משכירות: | Chart tooltip label |
| `cashFlowMortgageLabel` | תשלום משכנתה: | Chart tooltip label |
| `cashFlowAnnotation` | תזרים חיובי משנה ${year} | Chart annotation |
| `cashFlowSummaryPositive` | התזרים החודשי הופך לחיובי בשנה ${year} — עד אז, ההפרש מושקע בתרחיש הפסיבי | Summary below cash flow chart |
| `cashFlowSummaryNegative` | התזרים החודשי שלילי לאורך כל תקופת המשכנתה | Summary below cash flow chart |
| `cashFlowSummaryAlways` | התזרים החודשי חיובי מהיום הראשון | Summary below cash flow chart |
| `cashFlowAlwaysPositive` | תזרים חיובי לאורך כל התקופה | Summary below cash flow chart |
| `cashFlowNeverPositive` | התזרים אינו הופך לחיובי בטווח של 30 שנה | Summary below cash flow chart |
| `perYear` | שנה / | IRR axis suffix (reversed for RTL: shows as "/ שנה") |
| `scrollHint` | גלגלו לזום · גררו להזזה | Chart hint text |
| `resetZoom` | איפוס זום | Chart button |
| `prepaymentFeeLabel` | עמלת פירעון מוקדם | Summary card label |
| `prepaymentFeeZero` | (ריבית ≥ ריבית נעולה) | Prepayment fee = 0 explanation |
| `prepaymentFeeHint` | (₪0 אם ריבית שוק ≥ ${pct}) | Tooltip hint |
| `prepaymentFeeZeroHint` | (ריבית שוק ≥ הריבית הנעולה שלכם ${pct}) | Zero fee hint |
| `prepaymentFeeThresholdNote` | עמלת הפירעון תתאפס כשריבית השוק הנוכחית מגיעה לרמת ריבית המשכנתה האפקטיבית שלכם (${pct}) | Note on prepayment fee threshold |
| `tooltipAptLeads` | יתרון דירה: | Chart tooltip prefix |
| `tooltipPassiveLeads` | יתרון פסיבי: | Chart tooltip prefix |
| `tooltipBreakEven` | שוויון: | Chart tooltip prefix |
| `peakAdvantage` | יתרון מרבי: ${amount} · שנה ${year} | Chart annotation / summary |
| `summaryTwoXovers` | דירה עולה על השקעה פסיבית משנה ${y1} עד שנה ${y2} — חלון של ${dur} שנים | Summary text below chart |
| `summaryPassiveLeads` | השקעה פסיבית מובילה לאורך כל 30 השנים | Summary text below chart |
| `summaryAptLeadsOnward` | דירה מובילה מהשנה ${y} ואילך | Summary text below chart |
| `summaryAptLeadsAll` | דירה מובילה לאורך כל התקופה | Summary text below chart |
| `costsLiveEp` | סה"כ הוצאות רכישה | Summary bar label |
| `costsLiveTp` | מס רכישה | Summary bar label |
| `costsLiveAdded` | עלויות עסקה | Summary bar label |
| `taxRateLabel` | שיעור מס: | TaxToggle label |
| `taxRateTotal` | סה״כ ${x} | TaxToggle total line |
| `taxRateUpTo` | ${pct} עד ${limit} | TaxToggle bracket line |
| `taxRateThen` | ואז ${pct} | TaxToggle bracket line |
| `taxRateBeyond` | ${pct} מעבר לכך | TaxToggle bracket line |
| `masShvachInvestorExemptWarning` | ⚠️ פטור ממס שבח כמעט ואינו חל על דירה נוספת. מדובר במקרים חריגים בלבד — התייעצו עם עורך דין. | Warning shown when investor selects exempt |
| `exemptTooltip` | פטור ממס שבח חל על דירה ששימשה למגוריכם ושהיא דירתכם היחידה. דירה שנרכשה למטרת השקעה והשכרה אינה זכאית לפטור בדרך כלל. במקרה של ספק — התייעצו עם יועץ מס. | Tooltip on exempt option |
| `dpModeAmount` | סכום | Down-payment input mode tab |
| `dpModeFraction` | אחוז | Down-payment input mode tab |
| `dpAdjustedToMin` | הותאם למינימום החוקי | Note when DP is clamped to legal minimum |
| `dpDerivedFraction` | אחוז מימון: ${p} (מחושב אוטומטית) | Derived value note |
| `dpDerivedAmount` | הון עצמי: ${a} (מחושב אוטומטית) | Derived value note |
| `apartmentShort` | דירה | Compact chart legend |
| `passiveShort` | פסיבי | Compact chart legend |
| `compactLegendDiff` | יתרון דירה על פסיבי | Compact legend |
| `compactLegendRentPos` | שכירות > משכנתה | Compact legend |
| `compactLegendRentNeg` | משכנתה > שכירות | Compact legend |
| `irrLabel` | תשואה שנתית (IRR) | IRR view tab / axis label |
| `irrApt` | דירה | IRR chart legend |
| `irrPas` | פסיבי | IRR chart legend |

---

### `components/Calculator.tsx` — inline HE strings

| Location | Hebrew text | Context |
|----------|------------|---------|
| Header button | מאחורי הקלעים | "Under the hood" button label in HE |
| Methodology modal — page 3 button | הבנתי | "Got it" close button at page 3 (HE mode only) |
| Footer | למטרות מידע בלבד. אינו מהווה ייעוץ פיננסי, מיסויי או משפטי. יש להתייעץ עם אנשי מקצוע לפני קבלת החלטות. | Legal disclaimer footer |
| Footer | © 2026 מתן אלדר · לשימוש אישי בחינם | Copyright footer (name links to LinkedIn) |

---

### `components/Calculator.tsx` — `MethodologyPageHE` content

#### Page 1

> המחשבון משווה שני תרחישים עבור אותו הון:
>
> **תרחיש דירה:** קונים דירה עם משכנתה ומשכירים אותה. הרווח בכל חודש הוא הרווח הנקי אם תמכרו אז — מחיר המכירה בניכוי יתרת המשכנתה, כל הוצאות הרכישה, התזרים המצטבר לאורך התקופה (סך תשלומי המשכנתה פחות סך הכנסות השכירות), עלויות המכירה, ומס שבח (אם רלוונטי).
>
> **תרחיש פסיבי:** משקיעים את אותו ההון (הון עצמי + כל עלויות הרכישה) בשוק ההון. בכל חודש שבו תשלום המשכנתה עולה על שכר הדירה, התזרים השלילי מושקע אף הוא בניירות ערך. בחודשים שבהם השכירות עולה על המשכנתה, אין השקעה נוספת בתיק הפסיבי. הרווח הפסיבי הוא הרווח הנקי לאחר מס רווח הון במימוש (25%).

#### Page 2

> **דוגמה מספרית:**
>
> נניח דירה במחיר ₪2,000,000 עם הון עצמי של ₪1,000,000 ומשכנתה של ₪1,000,000.
>
> בתרחיש הפסיבי, כל ההון שהוצא ביום הרכישה — הון עצמי + מס רכישה + עלויות עסקה — מושקע בשוק ההון ביום הרכישה. בדוגמה זו הסכום הכולל הוא ₪1,200,000 המושקעים ביום הראשון.
>
> תשלום משכנתה: ₪6,000, הכנסה משכירות: ₪5,500 — תזרים שלילי של ₪500. בתרחיש הפסיבי, ₪500 אלו מושקעים אף הם בשוק ההון — כסף שהיה יוצא מכיסכם בתרחיש הדירה.
>
> כעבור כמה שנים: תשלום המשכנתה עדיין ₪6,000, הכנסה משכירות ₪6,200 (השכירות עלתה עם הזמן) — תזרים חיובי של ₪200. בתרחיש הפסיבי, חודש זה לא מוסיף דבר לתיק.

#### Page 3

> **תצוגות הגרף:**
>
> - **רווחים** — מציג שתי עקומות במקביל: רווח נקי במימוש של הדירה מול רווח נקי במימוש של ההשקעה הפסיבית. נקודות החציה בין העקומות הן הרגעים שבהם אחד התרחישים עולה על השני.
> - **הפרש** — מציג את ההפרש בין שני התרחישים (דירה פחות פסיבי). כשהעקומה מעל האפס — הדירה עדיפה. כשהיא מתחת לאפס — ההשקעה הפסיבית עדיפה. גובה העקומה בכל נקודה מראה את גודל היתרון.
> - **תזרים** — מציג את הכנסת השכירות ותשלום המשכנתה כקווים, ואת התזרים החודשי הנקי כעמודות. עמודות שליליות (חודשים שבהם המשכנתה עולה על השכירות) מייצגות כסף המושקע בתרחיש הפסיבי.
>
> **הנחות מרכזיות:** *(collapsible)*
> - שיטת שפיצר — תשלום משכנתה חודשי קבוע, סטנדרט בישראל
> - מס רכישה: 8% גורף לדירה נוספת (10% מעל ₪5,872,725); מדרגות לדירה יחידה
> - מס שבח על מכירת הדירה: 25% מהרווח (משוער). בבחירת פטור — פטור לדירה יחידה עד תקרה; ראו "מאחורי הקלעים"
> - מס רווח הון על השקעה פסיבית: 25% במימוש בלבד. הדירה ממוסה במס שבח, התיק במס רווח הון — אותו שיעור, מס שונה
> - תחזוקה: עלות שנתית משוערת (ברירת מחדל 7% מהשכירות), מנוכה מהשכירות מדי חודש
> - בכל חודש שבו המשכנתה גדולה מהשכירות, ההפרש מושקע בתרחיש הפסיבי; חודש עם תזרים חיובי לא מוסיף לתיק
> - כל הנתונים נומינליים — שני התרחישים מושפעים מאינפלציה באופן דומה, ולכן ההשוואה תקפה
> - המחשבון מדמה רכישה ← השכרה ← מכירה
>
> *(disclaimer)* למטרות מידע בלבד. אינו מהווה ייעוץ פיננסי, מיסויי או משפטי. יש להתייעץ עם אנשי מקצוע לפני קבלת החלטות.

---

### `components/Calculator.tsx` — `UnderTheHoodContentHE`

> החלק הזה מיועד למי שרוצה לראות את החישוב המדויק. שתי העקומות בגרף הן:
> - **A(t)** — הרווח הנקי מהדירה אם תימכר בחודש t
> - **P(t)** — הרווח הנקי מההשקעה הפסיבית אם תמומש בחודש t
>
> שתיהן מתחילות מאותו הון התחלתי, **E** (הון עצמי + מס רכישה + עלויות עסקה).
>
> **דירה, A(t):**
> ```
> A(t) = SaleValue(t) − SellingCosts(t) − RemainingMortgage(t)
>        − E − CumulativeExpenses(t) + CumulativeCashFlow(t) − BettermentTax(t)
> ```
> - **SaleValue(t)** = מחיר הרכישה שגדל בקצב עליית הערך, בריבית-דריבית חודשית
> - **SellingCosts(t)** = SaleValue(t) × אחוז עלויות המכירה
> - **RemainingMortgage(t)** = היתרה מלוח הסילוקין
> - **CumulativeCashFlow(t)** = סכום מצטבר של (שכירות − משכנתה − תחזוקה) בכל חודש; בדרך כלל שלילי, מכיוון שהמשכנתה גבוהה מהשכירות
> - **BettermentTax(t)** = ראו בהמשך
>
> **פסיבי, P(t):**
> ```
> P(t) = (Portfolio(t) − CostBasis(t)) × (1 − 25%)
> ```
> - **Portfolio(t)** = E שמושקע ביום הראשון, בריבית-דריבית חודשית לפי התשואה הפסיבית, בתוספת הגירעון של כל חודש (משכנתה − שכירות − תחזוקה, כשהוא חיובי) שנוסף ומצטבר
> - **CostBasis(t)** = E + סך הגירעונות שהושקעו
> - ה-25% הוא מס רווח הון, מוחל על הרווח במימוש בלבד
>
> **מס שבח:**
> ```
> Taxable portion = max(0, SaleValue − 5,008,000) / SaleValue   (when exempt)
> BettermentTax    = RealGain × Taxable portion × 25%
> ```
> ללא פטור, מלוא הרווח ממוסה ב-25%. זוהי הפשטה — מס שבח בפועל מחושב על הרווח הריאלי הצמוד למדד לאחר ניכוי הוצאות מוכרות.
>
> **תשואה שנתית (IRR):**
> עבור כל חודש יציאה אפשרי, פותרים את סדרת התזרימים החודשית (−E בחודש 0, תזרימים חודשיים, התמורה ביציאה) עבור הריבית שמאפסת את הערך הנוכחי הנקי, וממירים לתשואה שנתית. בפריסה על פני כל חודשי היציאה מתקבלות עקומות ה-IRR.

---

---

## APP: TRACKER (`apartment-tracker-app`)

---

### `src/lib/i18n.ts` — HE translation object

| Key | Hebrew text | Context |
|-----|------------|---------|
| `appTitle` | מעקב השקעת דירה | App title / h1 |
| `appSubtitle` | הבנאי 23, בית הכרם, ירושלים | App subtitle / address |
| `currentMonth` | חודשים מאז הרכישה | Metrics card label |
| `apartmentGain` | רווח נטו נוכחי ממכירת הדירה | Metrics card label |
| `passiveGain` | רווח נטו ממימוש התיק היום | Metrics card label |
| `mortgageBalance` | יתרת משכנתה | Metrics card label |
| `apartmentValue` | שווי דירה נוכחי | Metrics card label |
| `targetGain` | יעד רווח | Chart goal line label |
| `clearOverride` | אפס | Button to clear override |
| `chartTitle` | דירה מול השקעה פסיבית | Chart title |
| `month` | חודש | Chart axis label |
| `netGain` | ₪ ש"ח | Chart Y-axis label |
| `apartmentLine` | רווח ממכירת הדירה | Chart legend |
| `passiveLine` | רווח השקעה פסיבית | Chart legend |
| `goalLine` | יעד רווח | Chart legend |
| `prepaymentFeeLine` | עמלת פירעון מוקדם | Chart legend |
| `zoomHint` | גלגל עכבר לזום · גרור להזזה | Chart hint |
| `monthsAgo` | חודשים | "X חודשים ago" suffix in metrics |
| `cumCFTitle` | תזרים מצטבר עד היום | Cumulative CF panel title |
| `cfCumActual` | בפועל | CF panel sub-label |
| `cfCumProjected` | חזוי | CF panel sub-label |
| `howItWorks` | כיצד זה עובד | "How this works" button |
| `actualsTitle` | יומן חודשי | Table section heading |
| `colMonth` | חודש | Table column header |
| `colDate` | תאריך | Table column header |
| `colRent` | שכ"ד שהתקבל | Table column header |
| `colMortgage` | משכנתה ששולמה | Table column header |
| `colCashFlow` | תזרים מזומנים | Table column header |
| `colNotes` | הערות | Table column header |
| `noActuals` | אין נתונים חודשיים עדיין. | Empty state |
| `showPast` | הצג חודשים קודמים | Toggle button |
| `showFuture` | הצג חודשים עתידיים | Toggle button |
| `hidePast` | הסתר חודשים קודמים | Toggle button |
| `hideFuture` | הסתר חודשים עתידיים | Toggle button |
| `addMonthlyEntry` | הוסף רשומה חודשית | Button |
| `addExpense` | הוסף הוצאה | Button |
| `entryTitle` | רשומה חודשית | Modal title (new entry) |
| `editEntryTitle` | עריכת רשומה חודשית | Modal title (edit entry) |
| `expenseTitle` | תיעוד הוצאה | Modal title (expense) |
| `fieldDate` | תאריך | Form field label |
| `fieldRent` | שכ"ד שהתקבל (₪) | Form field label |
| `fieldMortgage` | משכנתה ששולמה (₪) | Form field label |
| `fieldNotes` | הערות | Form field label |
| `fieldAmount` | סכום (₪) | Form field label |
| `fieldCategory` | קטגוריה | Form field label |
| `fieldPaidBy` | שילם | Form field label |
| `fieldDescription` | תיאור | Form field label |
| `fieldReceipt` | קבלה / קישור | Form field label |
| `save` | שמור | Button |
| `cancel` | ביטול | Button |
| `saving` | שומר… | Loading state |
| `saved` | נשמר | Confirmation state |
| `errorSaving` | שגיאה בשמירה. נסה שוב. | Error message |
| `catRepair` | תיקון | Expense category option |
| `catMaintenance` | תחזוקה | Expense category option |
| `catTax` | מס | Expense category option |
| `catInsurance` | ביטוח | Expense category option |
| `catManagement` | ניהול | Expense category option |
| `catLegal` | משפטי | Expense category option |
| `catOther` | אחר | Expense category option |
| `paidMatan` | מתן | Paid-by option |
| `paidYoav` | יואב ואסתר | Paid-by option |
| `tabDashboard` | לוח בקרה | Tab label |
| `tabLog` | יומן | Tab label |
| `tabExpenses` | הוצאות | Tab label |
| `tabRent` | שכירות | Tab label |
| `tabAssumptions` | הנחות | Tab label (note: this tab appears not to exist in the current UI — assumptions are in dashboard) |
| `tabInfo` | פרטים | Tab label |
| `deleteEntry` | נקה רשומה | Delete button text |
| `confirmDeleteEntry` | לנקות רשומה זו? | Delete confirmation text |
| `noExpenses` | אין הוצאות עדיין. | Empty state |
| `total` | סה״כ | Table total row |
| `inExpenses` | בהוצאות | Suffix in balance line |
| `balanceOwes` | חייב ל | Balance display (e.g. "מתן חייב ל יואב") |
| `balanceSettled` | מסולק | Balance display (fully settled) |
| `recordSettlement` | רשום סילוק | Button |
| `settlementTitle` | רשום סילוק | Settlement modal title (new) |
| `editSettlementTitle` | ערוך סילוק | Settlement modal title (edit) |
| `fieldFrom` | מאת | Settlement form field |
| `fieldTo` | לאת | Settlement form field |
| `noSettlements` | אין סילוקים. | Empty state |
| `settlementsHistory` | היסטוריית סילוקים | Section heading |
| `currentRent` | שכ"ד נוכחי | Rent display label |
| `setRent` | הגדר | Button |
| `noRentSet` | לא הוגדר | Empty state |
| `fromMonth` | מ- | Rent schedule period prefix |
| `toMonth` | עד | Rent schedule period separator |
| `rentBasePlaceholder` | שכ"ד בסיס (₪) | Input placeholder |
| `rentStartMonthPlaceholder` | חודש התחלה # | Input placeholder |
| `rentEndMonthPlaceholder` | חודש סיום # | Input placeholder |
| `rentScheduleTitle` | לוח שכירות | Section heading |
| `addPeriod` | הוסף תקופה | Button |
| `rentReconciliationTitle` | בפועל מול חזוי | Section heading |
| `cumReceived` | סה"כ התקבל | Reconciliation summary label |
| `cumProjected` | סה"כ חזוי | Reconciliation summary label |
| `rentActual` | בפועל | Table column header |
| `rentProjected` | חזוי | Table column header |
| `rentDiff` | הפרש | Table column header |
| `noRentSchedule` | לא הוגדרו תקופות שכירות. | Empty state |
| `loading` | טוען… | Loading state |
| `errorLoading` | שגיאה בטעינת נתונים. | Error message |
| `retry` | נסה שוב | Retry button |
| `assumptionsBasisTitle` | בסיס ההשקעה | Section heading in assumptions tab |
| `assumptionsBasisDesc` | קבוע ברכישה — מקור: חוזים חתומים ודוח יועץ המשכנתה | Section subtitle |
| `assumptionsPurchaseDate` | תאריך רכישה | Field label |
| `assumptionsAptValue` | שווי דירה | Field label |
| `assumptionsMortgage` | משכנתה התחלתית | Field label |
| `assumptionsDownPayment` | הון עצמי | Field label |
| `assumptionsRentInitial` | שכ״ד חודשי התחלתי | Field label |
| `assumptionsTotalExpenses` | סה״כ הוצאות רכישה | Field label |
| `assumptionsSellingExp` | הוצאות מכירה | Field label |
| `assumptionsSellingExpSuffix` | משווי המכירה | Suffix |
| `assumptionsTax` | מס רווח הון | Field label |
| `assumptionsTaxSuffix` | קבוע בחוק — 25% נכון להיום | Suffix |
| `perMonth` | /חו׳ | Month suffix |
| `assumptionsModelTitle` | הנחות מודל | Section heading |
| `assumptionsModelDesc` | ההנחות מזינות את תחזית 30 השנה — כל שינוי נשמר ומעדכן מחדש את כל התחזיות | Section description |
| `projAppreciation` | עליית ערך דירה | Projection field label |
| `projAppreciationDesc` | קצב עליית ערך שנתי לנכס | Projection field description |
| `projRentIncrease` | עלייה שנתית בשכ״ד | Projection field label |
| `projRentIncreaseDesc` | עלייה שנתית המוחלת על הכנסות השכירות המוקרנות | Projection field description |
| `projPassiveReturn` | תשואת השקעה פסיבית | Projection field label |
| `projPassiveReturnDesc` | תשואה שנתית של השקעה חלופית, למשל S&P 500 בש״ח | Projection field description |
| `projSellingExp` | הוצאות מכירה | Projection field label |
| `projSellingExpDesc` | עמלת מתווך ושכר טרחה משפטי — מנוכים מתמורת המכירה ביציאה | Projection field description |
| `projTax` | מס רווח הון | Projection field label |
| `projTaxDesc` | חל על רווח מכירת הדירה ועל הרווח הפסיבי — זהו נכס להשקעה ולא דירת מגורים פטורה ממס (25% נכון להיום) | Projection field description |
| `projMarketRate` | ריבית שוק למשכנתה | Projection field label |
| `projMarketRateDesc` | הריבית הנוכחית בשוק למשכנתאות חדשות — משמשת לחישוב עמלת פירעון מוקדם | Projection field description |
| `projMaintenance` | עלות תחזוקה שנתית | Projection field label |
| `projMaintenanceDesc` | עלות תחזוקה שנתית משוערת כאחוז מהשכירות החודשית — תיקונים, בלאי, ועלויות שוטפות. מוחל על חודשים עתידיים בלבד. | Projection field description |
| `projAptMasShvach` | מס שבח על הדירה | מס שבח toggle label |
| `aptMasShvach25Label` | 25% (חייב) | מס שבח toggle option |
| `aptMasShvachExemptLabel` | פטור (0%) | מס שבח toggle option |
| `aptMasShvachNote` | פטור ממס שבח לדירה בבעלות משותפת המושכרת כנכס השקעה אינו ודאי ותלוי בייעוץ מקצועי. ברירת המחדל 25% היא ההנחה השמרנית. מומלץ להתייעץ עם רו״ח / מומחה מיסוי מקרקעין. | Note below מס שבח toggle |
| `prepaymentFeeLabel` | עמלת פירעון מוקדם | Metrics label |
| `netExitGain` | רווח נטו ממכירת הדירה היום | Metrics card label |
| `confirm` | אישור | Confirm button |
| `back` | חזרה | Back button |
| `assumptionsUpdatePrefix` | עדכן | Confirmation banner prefix |
| `assumptionsUpdateTo` | ל- | Confirmation banner connector |
| `assumptionsConfirmSuffix` | — פעולה זו תכתוב לגיליון ותחשב מחדש את כל תחזיות 30 השנה. | Confirmation banner suffix |
| `valuationsTitle` | הערכות שווי | Section heading |
| `valuationsDesc` | ערכי שוק שהוזנו ידנית — כל רשומה מעגנת את מודל ההתייקרות מאותו תאריך והלאה | Section description |
| `valuationsFieldDate` | תאריך | Field label |
| `valuationsFieldValue` | שווי (₪) | Field label |
| `valuationsFieldNote` | הערה (אופציונלי) | Field placeholder |
| `valuationsAddBtn` | הוסף | Button |
| `valuationsEmpty` | לא הוזנו הערכות שווי. | Empty state |
| `valuationsLastAppraisal` | הערכה אחרונה | Label in metrics card |
| `valuationsDeleteConfirm` | הסר? | Delete confirm button |
| `valuationsAdding` | שומר… | Loading state |
| `valuationsPurchaseAnchor` | מחיר רכישה | Read-only row label |
| `irrLabel` | תשואה שנתית (IRR) | IRR chart tab / axis |
| `irrApt` | דירה | IRR legend |
| `irrPas` | פסיבי | IRR legend |
| `irrTooltip` | תשואה שנתית שמתחשבת בתזמון כל תזרים כסף — מאפשרת השוואה ישירה בין הדירה הממונפת להשקעה הפסיבית. | IRR tooltip |

---

### `src/app/page.tsx` — inline HE strings

| Location | Hebrew text | Context |
|----------|------------|---------|
| Header button | מאחורי הקלעים | "Under the hood" button label in HE |

---

### `src/components/MetricsPanel.tsx` — inline HE strings

| Location | Hebrew text | Context |
|----------|------------|---------|
| Crossover card label | חלון יתרון הדירה | Metrics card label |
| Crossover text — apt leads all 30 yrs | כל 30 השנים | Crossover summary |
| Crossover text — passive leads all | לאורך כל התקופה | Crossover summary |
| Crossover text — apt from year Y | משנה ${y1} | Crossover summary |
| Crossover text — apt window | שנה ${y1}–${y2} · ${dur} שנים | Crossover summary |
| Crossover text — apt leads until | עד שנה ${y1} | Crossover summary |
| Crossover text — apt leads again from | שוב משנה ${y2} | Crossover summary |
| CF panel — diff label | הפרש | Sub-label |
| CF panel — confirmed months | (${confirmedMonths} חודשים אושרו) | Note |

---

### `src/components/GainChart.tsx` — inline HE strings (chart labels)

| Location | Hebrew text | Context |
|----------|------------|---------|
| Today marker | היום | xAxis mark label |
| Year marker | שנה ${n} | Crossover year labels |
| Apt-ahead region | יתרון דירה | Region label |
| Passive-ahead region | יתרון פסיבי | Region label |
| X axis year label | שנה | Axis unit |
| Rent line | שכ"ד | Cash flow chart legend |
| Mortgage line | משכנתה | Cash flow chart legend |
| Positive CF bar | תזרים חיובי | Cash flow chart legend |
| Negative CF bar | תזרים שלילי | Cash flow chart legend |
| IRR tooltip subtitle | תשואה שנתית אם תמכרו בנקודה זו | IRR tooltip subtitle |
| Gains tab | רווחים | Chart tab |
| Difference tab | הפרש | Chart tab |
| Cash Flow tab | תזרים | Chart tab |
| IRR tab | תשואה שנתית | Chart tab |
| Rent/Mortgage sub-tab | שכ"ד / משכנתה | Sub-tab |
| Monthly Flow sub-tab | תזרים חודשי | Sub-tab |
| Per-partner toggle | לשותף (÷2) | Toggle label |
| IRR apt legend | דירה — תשואה שנתית | Legend |
| IRR passive legend | פסיבי — תשואה שנתית | Legend |
| Diff legend | דירה פחות פסיבי | Legend |
| CF rent legend | שכ"ד | Legend |
| CF mortgage legend | משכנתה | Legend |
| CF positive legend | תזרים חיובי | Legend |
| CF negative legend | תזרים שלילי | Legend |

---

### `src/components/MethodologyModal.tsx` — PAGES_HE

#### Navigation buttons
- Back button: `הקודם →`
- Next button: `← הבא`
- Close button: `סגור`

#### Page 1: עבר ועתיד

> הגרף מחולק ב"היום":
>
> חודשים עברו (קווים מלאים) מעוגנים בנתונים שהזנת — שכ"ד שהתקבל בפועל ותשלומי משכנתה ששולמו. אלו הנתונים שהוזנו דרך היומן החודשי.
>
> חודשים עתידיים (קווים מקווקוים) הם תחזיות: שכ"ד מלוח השכירות עם הצמדה שנתית, ומשכנתה מלוח הסילוקין של הבנק.
>
> קו "היום" מסמן את הגבול. כל תחזית מימין לו היא הערכה של המודל שתשתנה ככל שנתוני פועל יכנסו.

#### Page 2: רווח יציאה מדירה

> בכל חודש, הרווח הנקי ממכירת הדירה הוא מה שתקבלו בסוף אם תמכרו:
>
>   רווח נקי = שווי דירה × (1 − הוצאות מכירה %) − יתרת משכנתה − סך ההשקעה הראשונית שלכם − הוצאות מצטברות
>
> כאשר:
> • שווי הדירה גדל מהערכת השווי האחרונה שנרשמה בקצב ההתייקרות שהגדרתם
> • יתרת המשכנתה מלוח סילוקין מדויק של הבנק
> • סך ההשקעה הראשונית שלכם = הון עצמי + כל עלויות הרכישה
> • הוצאות מצטברות = תיקונים והוצאות נוספות שנרשמו
>
> יחס מס השבח לדירה תלוי בבורר שבהנחות. אם הוגדר פטור (פטור דירה יחידה): הפטור חל על תמורת המכירה עד ~₪5,008,000 (תקרת 2024–2027, מתעדכנת מדי תקופה). רק החלק היחסי מהרווח שמעל התקרה חייב במס של 25%. אם הוגדר 25%: כל הרווח חייב במס 25% (הנחה שמרנית / נכס להשקעה).
>
> עמלת פירעון מוקדם = יתרת משכנתה (החלק שאינו פריים) × max(0, ריבית חוזה − ריבית שוק) × שנים שנותרו. מסלול הפריים פטור מעמלה לפי חוק. החסרת העמלה נותנת את רווח היציאה האמיתי היום.

#### Page 3: השוואה פסיבית

> "הבסיס הפסיבי" עונה: מה היה קורה אם סך ההשקעה הראשונית שלכם הייתה מושקעת בקרן פסיבית?
>
> כל חודש בו משכנתה > שכ"ד, ההפרש (יציאת מזומן נטו) מתווסף לקרן — כי בתרחיש הדירה שילמתם אותו מהכיס. התיק מצמיח מדי חודש בהתאם להנחת התשואה הפסיבית.
>
> בכל חודש:
>   הרווח הנקי מההשקעה הפסיבית = (שווי תיק + הוצאות מוצמדות − סך מה שהשקעתם) × (1 − 25% מס רווח הון)
>
> סך מה שהשקעתם = סך ההשקעה הראשונית + יציאות נטו מצטברות + הוצאות מצטברות
>
> ההשקעה הפסיבית ממוסה במס רווח הון ישראלי של 25% במימוש. הדירה ממוסה במס שבח — אותו שיעור, מס שונה. יחס מס השבח מוגדר בהנחות (פטור עם תקרה / 25% מלא).

#### Page 4: הנחות מרכזיות

- חודשים שעברו משתמשים בתשלומי השכירות והמשכנתה בפועל שנרשמו; חודשים עתידיים — בלוח השכירות ולוח הסילוקין של הבנק
- שווי הדירה מעוגן להערכת השווי המוקלטת האחרונה, ואז גדל בקצב ההתייקרות שהוגדר
- מס רכישה: 8% גורף לדירה נוספת (10% מעל ₪5,872,725); מדרגות לדירה יחידה
- מס שבח משוער על מכירת הדירה: 25% מהרווח הנומינלי — הפשטה; מס שבח בפועל מחושב על הרווח הריאלי הצמוד למדד לאחר ניכוי הוצאות. בבחירת פטור: הפטור לדירה יחידה חל עד תקרת שווי מכירה של ₪5,008,000 (2024–2027, מתעדכן מדי תקופה); הרווח היחסי על החלק שמעל התקרה ממוסה ב-25%.
- מס רווח הון על השקעה פסיבית: 25% במימוש בלבד — לא שנתי
- כל הנתונים בשקלים נומינליים — ללא התאמה לאינפלציה

---

### `src/components/MethodologyModal.tsx` — `UnderTheHoodContentHE`

> החלק הזה מיועד למי שרוצה לראות את החישוב המדויק. שתי העקומות בגרף הן:
> - **A(t)** — הרווח הנקי מהדירה אם תימכר בחודש t
> - **P(t)** — הרווח הנקי מההשקעה הפסיבית אם תמומש בחודש t
>
> שתיהן מתחילות מאותו הון התחלתי, **E** (הון עצמי + מס רכישה + עלויות עסקה).
>
> **דירה, A(t):**
> ```
> A(t) = SaleValue(t) − SellingCosts(t) − RemainingMortgage(t)
>        − E − CumulativeExpenses(t) + CumulativeCashFlow(t) − BettermentTax(t)
> ```
> - **SaleValue(t)** = מחיר הרכישה שגדל בקצב עליית הערך, בריבית-דריבית חודשית
> - **SellingCosts(t)** = SaleValue(t) × אחוז עלויות המכירה
> - **RemainingMortgage(t)** = היתרה מלוח הסילוקין בפועל של הבנק
> - **CumulativeCashFlow(t)** = סכום מצטבר של (שכירות − משכנתה − תחזוקה) בכל חודש; בדרך כלל שלילי, מכיוון שהמשכנתה גבוהה מהשכירות
> - **BettermentTax(t)** = ראו בהמשך
> - **שווי דירה** מעוגן להערכת השווי המוקלטת האחרונה, ואז גדל בקצב ההתייקרות
> - חודשים שעברו משתמשים בתזרים בפועל שנרשם; חודשים עתידיים — בלוח השכירות ולוח הסילוקין המחושב.
>
> **פסיבי, P(t):**
> ```
> P(t) = (Portfolio(t) − CostBasis(t)) × (1 − 25%)
> ```
> - **Portfolio(t)** = E שמושקע ביום הראשון, בריבית-דריבית חודשית לפי התשואה הפסיבית, בתוספת הגירעון של כל חודש (משכנתה − שכירות − תחזוקה, כשהוא חיובי) שנוסף ומצטבר
> - **CostBasis(t)** = E + סך הגירעונות שהושקעו
> - ה-25% הוא מס רווח הון, מוחל על הרווח במימוש בלבד
>
> **מס שבח:**
> ```
> Taxable portion = max(0, SaleValue − 5,008,000) / SaleValue   (when exempt)
> BettermentTax    = RealGain × Taxable portion × 25%
> ```
> ללא פטור, מלוא הרווח ממוסה ב-25%. זוהי הפשטה — מס שבח בפועל מחושב על הרווח הריאלי הצמוד למדד לאחר ניכוי הוצאות מוכרות.
>
> **תשואה שנתית (IRR):**
> עבור כל חודש יציאה אפשרי, פותרים את סדרת התזרימים החודשית (−E בחודש 0, תזרימים חודשיים, התמורה ביציאה) עבור הריבית שמאפסת את הערך הנוכחי הנקי, וממירים לתשואה שנתית. בפריסה על פני כל חודשי היציאה מתקבלות עקומות ה-IRR.

---

### `src/components/ActualsTable.tsx` — inline HE strings

| Location | Hebrew text | Context |
|----------|------------|---------|
| Month name array | ינואר, פברואר, מרץ, אפריל, מאי, יוני, יולי, אוגוסט, ספטמבר, אוקטובר, נובמבר, דצמבר | Month labels in log table |
| Current month arrow | ← | Indicator arrow next to current month row |

---

### `src/components/RentTab.tsx` — inline HE strings

| Location | Hebrew text | Context |
|----------|------------|---------|
| Start month dropdown placeholder | חודש התחלה | Dropdown option (no value selected) |
| End month dropdown placeholder | חודש סיום | Dropdown option (no value selected) |
| Form error — missing rent | הזן סכום שכ"ד. | Validation error message |
| Form error — missing months | בחר חודשי התחלה וסיום. | Validation error message |
| Form error — end before start | חודש הסיום חייב להיות אחרי חודש ההתחלה. | Validation error message |
| Post-schedule escalation note | לאחר תקופת השכירות האחרונה, השכ"ד יעלה ב-${pct}% לשנה. | Note below rent schedule list |

---

### `src/components/InfoTab.tsx` — inline HE strings

#### Property section (`הנכס`)

| Label | Hebrew | Value (HE) |
|-------|--------|------------|
| Section title | הנכס | — |
| כתובת | כתובת | הבנאי 23/3, כניסה ב', ירושלים 9626442 |
| שכונה | שכונה | בית הכרם |
| תאריך רכישה | תאריך רכישה | 2025-05-25 |
| מחיר רכישה | מחיר רכישה | (dynamic from assumptions) |
| מוכרים | מוכרים | יותם מזוז-הרפז |
| (second seller) | — | יעל מזוז-הרפז |
| חוזה מכר | חוזה מכר | צפה במסמך |
| נסח טאבו | נסח טאבו | צפה במסמך |
| דו״ח שומה | דו״ח שומה | צפה במסמך |
| לוח סילוקין | לוח סילוקין | צפה במסמך |

#### Purchase Expenses section (`הוצאות רכישה`)

| Label (HE) | Note (HE) |
|------------|-----------|
| הון עצמי | — |
| מס רכישה | — |
| עו״ד — רכישה | 0.5% + מע״מ |
| עו״ד — שותפות | 0.16% + מע״מ |
| סוכן נדל״ן | 2% + מע״מ |
| שמאי | + מע״מ |
| יועץ משכנתה | + מע״מ |
| סה״כ | — |

#### Residents section (`דיירים`)

| Label (HE) | Value (HE) |
|------------|------------|
| Section title | דיירים |
| נטע נחום (label) | נטע נחום |
| שלום נחום (label) | שלום נחום |
| ועד בית | — |
| תחילת שכירות | 2025-04-23 |
| סיום שכירות | 2026-06-30 |
| חוזה שוכרים | צפה במסמך |

#### Mortgage Summary section (`סיכום משכנתה`)

| Label (HE) | Value (HE) |
|------------|------------|
| Section title | סיכום משכנתה |
| בנק | בנק דיסקונט |
| תאריך תחילה | 2025-05-01 |
| שטר משכנתה | צפה במסמך |
| Table header: Track | מסלול |
| Table header: Amount | סכום |
| Table header: Rate | ריבית |
| Table header: Term | תקופה |
| Table header: End | סיום |
| Track 1 name | קל״צ (קבועה) |
| Track 1 term | 260 חו' |
| Track 2 name | עוגן (משתנה) |
| Track 2 rate | 4.59% (משתנה) |
| Track 2 term | 360 חו' |
| Track 3 name | פריים (צמוד פריים) |
| Track 3 rate | פריים − 0.9% |
| Track 3 term | 360 חו' |
| Total row | סה״כ |

#### Professionals section (`אנשי מקצוע`)

| Label (HE) | Name (HE) |
|------------|-----------|
| Section title | אנשי מקצוע |
| עורך דין | דניאל גולדמן |
| סוכן נדל״ן | תמיר אברמוב |
| שמאי | אורן ליפשיץ |
| יועץ משכנתה | — |

#### Insurance section (`ביטוח`)

| Label (HE) | Value (HE) |
|------------|------------|
| Section title | ביטוח |
| ביטוח מבנה — חברה | AIG |
| ביטוח מבנה — פוליסה | 31181086026 |
| ביטוח מבנה — חידוש | כל שנה, 1 במאי |

---

*End of audit. All text extracted verbatim from source files as of 2026-06-15.*
