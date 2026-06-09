# Informational Text Audit

All user-facing explanatory/descriptive strings. Excludes slider labels, button labels, axis labels, number formatting.

---

## 1. Slider Tooltips (`lib/i18n.ts` → `tooltips.*`)

### 1.1 Mortgage fraction — investor track
| | Text |
|---|---|
| **EN** | Israeli law caps mortgage financing at 50% of apartment value for a non-primary residence. If this will become your primary residence and you sell your current apartment within 18 months, the 75% cap may apply — consult a mortgage advisor. |
| **HE** | החוק בישראל מגביל מימון משכנתה ל-50% משווי הדירה עבור דירה שאינה מגורים עיקריים. אם הדירה החדשה תשמש כמגוריכם העיקריים ותמכרו את הדירה הקיימת תוך 18 חודשים, עשויה לחול תקרת מימון של 75% — מומלץ להתייעץ עם יועץ משכנתאות. |

### 1.2 Mortgage fraction — first apartment track
| | Text |
|---|---|
| **EN** | Israeli law caps mortgage financing at 75% of apartment value for a primary residence. |
| **HE** | החוק בישראל מגביל מימון משכנתה ל-75% משווי הדירה עבור דירת מגורים עיקריים. |

### 1.3 Passive return (Ip)
| | Text |
|---|---|
| **EN** | Expected annual return in ILS on a passive stock market investment (e.g. S&P 500 or MSCI World), net of fund fees. Default {pct} = ~10% in USD, minus ~0.8% annual shekel appreciation against the dollar (historical trend 2006–2026, linear regression on Bank of Israel data), minus ~0.2% fund management fees. |
| **HE** | תשואה שנתית צפויה בשקלים על השקעה פסיבית במדד מניות (כגון S&P 500 או MSCI World), נטו מדמי ניהול. ברירת המחדל {pct} = ~10% בדולרים, פחות ~0.8% התחזקות שקל מול דולר (מגמה היסטורית 2006–2026, רגרסיה לינארית על נתוני בנק ישראל) ופחות ~0.2% דמי ניהול. |

### 1.4 Apartment appreciation (V)
| | Text |
|---|---|
| **EN** | Expected annual increase in apartment value. In major Israeli cities, the historical average has been approximately 5–8% per year over the past decade, with significant variation by area. |
| **HE** | עלייה שנתית צפויה בשווי הדירה. בערים גדולות בישראל עמד הממוצע על כ-5–8% בעשור האחרון, עם שונות משמעותית בין אזורים. |

### 1.5 Selling costs (Es)
| | Text |
|---|---|
| **EN** | Selling costs as a percentage of the apartment value at sale. Typical breakdown: agent ~2%, lawyer ~0.5%, plus incidental costs. Common range: 2.5–3%. |
| **HE** | עלויות מכירה כאחוז משווי הדירה בעת המכירה. פירוט אופייני: מתווך ~2%, עו"ד ~0.5%, ועלויות נלוות נוספות. טווח מקובל: 2.5–3%. |

### 1.6 Purchase tax — investor track (buyerTypeInvestor)
| | Text |
|---|---|
| **EN** | Applies to buyers who already own another apartment and are not selling it before purchase. Purchase tax: 8% up to ₪5,872,725, then 10% on the excess. If this will become your primary residence and you sell your current apartment within 18 months, a 75% mortgage cap may apply — consult a mortgage advisor. |
| **HE** | חל על מי שמחזיקים בדירה נוספת ואינם מוכרים אותה לפני הרכישה. מס רכישה: 8% עד ₪5,872,725, ו-10% על החלק שמעבר. אם הדירה החדשה תשמש כמגוריכם העיקריים ותמכרו את הדירה הקיימת תוך 18 חודשים, עשויה לחול תקרת מימון של 75% — מומלץ להתייעץ עם יועץ משכנתאות. |

### 1.7 Purchase tax — first apartment track (buyerTypeSingle)
| | Text |
|---|---|
| **EN** | Applies to buyers who own no other apartment, or who sell their current one within 18 months of purchase. Tax rates are graduated and significantly lower than the investor track. |
| **HE** | חל על מי שאין בבעלותם דירה נוספת, או שמוכרים את דירתם הקיימת תוך 18 חודשים מהרכישה. שיעורי המס מדורגים ונמוכים משמעותית מהמסלול החלופי. |

### 1.8 מס שבח (masShvach)
| | Text |
|---|---|
| **EN** | Tax on real estate sale profit: 25% of net gain (sale proceeds minus purchase cost and recognized expenses). For an investment apartment — usually applies. For a primary residence — usually exempt. Co-ownership structures may qualify for exemption — consult a lawyer. |
| **HE** | מס על רווח המכירה בנדל"ן: 25% מהרווח הנקי (תמורת המכירה פחות הוצאות הרכישה והוצאות מוכרות). לדירת השקעה — לרוב חל. לדירה עיקרית — לרוב פטור. במבנה שותפות ייתכנו פטורים — התייעצו עם עורך דין. |

### 1.9 Current market rate / Im (prepayment fee basis)
| | Text |
|---|---|
| **EN** | Used to calculate the early repayment fee (עמלת פירעון מוקדם). The bank charges a fee when the current market rate is below your locked rate — the larger the gap, the higher the fee. If the market rate is above your locked rate, the fee is ₪0. Note: the calculation uses the full remaining principal — in practice the prime track carries no prepayment fee, so the actual fee may be slightly lower. |
| **HE** | משמשת לחישוב עמלת פירעון מוקדם. הבנק גובה עמלה כשריבית השוק הנוכחית נמוכה מהריבית הנעולה שלכם — ככל שהפער גדול יותר, כך העמלה גבוהה יותר. אם ריבית השוק גבוהה מהנעולה, העמלה היא ₪0. שימו לב: החישוב מבוצע על יתרת המשכנתה המלאה — בפועל, מסלול הפריים אינו חייב בעמלה, כך שהעמלה האמיתית עשויה להיות נמוכה במקצת. |

### 1.10 Monthly rent (R0)
| | Text |
|---|---|
| **EN** | Monthly rent at the time of purchase, before annual increases. The calculator applies the rent increase once per year. |
| **HE** | שכירות חודשית בעת הרכישה, לפני עדכוני שכירות שנתיים. המחשבון מעדכן את השכירות אחת לשנה. |

### 1.11 Transaction costs (purchaseCostsRate)
| | Text |
|---|---|
| **EN** | Transaction costs as a percentage of apartment value, excluding purchase tax. Typical breakdown: agent ~2% + VAT, lawyer ~0.5% + VAT, appraiser ~₪3,500, mortgage advisor by agreement. The default 5% suits most buyers. |
| **HE** | עלויות הרכישה כאחוז משווי הדירה, ללא מס רכישה. פירוט אופייני: מתווך ~2% + מע"מ, עו"ד ~0.5% + מע"מ, שמאי ~₪3,500, יועץ משכנתאות לפי הסכמה. ברירת המחדל 5% מתאימה לרוב הרוכשים. |

### 1.12 Rent increase rate (riTooltip)
| | Text |
|---|---|
| **EN** | Expected annual rent increase. The 2% default matches the Bank of Israel's inflation target. |
| **HE** | עליית שכר דירה שנתית צפויה. ברירת המחדל 2% תואמת את יעד האינפלציה של בנק ישראל. |

### 1.13 Maintenance rate (maintenanceRateTooltip)
| | Text |
|---|---|
| **EN** | Annual maintenance cost as a percentage of rent — repairs, wear, and ongoing costs. Deducted from rental income each month. |
| **HE** | עלות תחזוקה שנתית כאחוז מהשכירות — תיקונים, בלאי, ועלויות שוטפות. מנוכה מהכנסת השכירות בכל חודש. |

### 1.14 Mortgage rate (mortgageRateTooltip)
| | Text |
|---|---|
| **EN** | The blended effective rate across all your mortgage tracks. You can get this figure from your mortgage advisor or bank pre-approval. The default is calculated as the current Bank of Israel rate + 1.5% (prime spread) − 0.9% (a typical good mortgage offer). Typical range in Israel: 3.5%–5.5%. |
| **HE** | הריבית האפקטיבית הממוצעת על המשכנתה שלכם, לאחר שקלול כל המסלולים. ניתן לקבל נתון זה מיועץ המשכנתאות או מהאישור העקרוני של הבנק. ברירת המחדל מחושבת לפי ריבית בנק ישראל הנוכחית + 1.5% (פריים) − 0.9% (מרווח אופייני טוב). ריבית אופיינית בישראל: 3.5%–5.5%. |

### 1.15 Down payment tooltip
| | Text |
|---|---|
| **EN** | Down payment is determined by apartment price × (100% − mortgage fraction). For example: ₪3,000,000 apartment with 50% mortgage = ₪1,500,000 down payment. |
| **HE** | הון עצמי נקבע לפי מחיר הדירה כפול (100% פחות אחוז המימון). לדוגמה: דירה ב-₪3,000,000 עם מימון 50% = הון עצמי של ₪1,500,000. |

---

## 2. Inline Notes (`lib/i18n.ts` / `components/Sliders.tsx`)

### 2.1 Passive panel — CGT note (cgtNote)
| | Text |
|---|---|
| **EN** | Passive gain is calculated net of 25% capital gains tax at realization |
| **HE** | הרווח הפסיבי מחושב נטו לאחר מס רווח הון 25% במימוש |

### 2.2 Prepayment fee threshold note (prepaymentFeeThresholdNote)
| | Text |
|---|---|
| **EN** | The early repayment fee reaches ₪0 when the current market rate equals your mortgage rate ({pct}) |
| **HE** | עמלת הפירעון תתאפס כשריבית השוק הנוכחית מגיעה לרמת ריבית המשכנתה שלכם ({pct}) |

### 2.3 מס שבח investor-exempt warning (masShvachInvestorExemptWarning)
| | Text |
|---|---|
| **EN** | ⚠️ מס שבח exemption almost never applies to an additional apartment. This applies only in exceptional cases — consult a lawyer. |
| **HE** | ⚠️ פטור ממס שבח כמעט ואינו חל על דירה נוספת. מדובר במקרים חריגים בלבד — התייעצו עם עורך דין. |

### 2.4 מס שבח exempt option tooltip (exemptTooltip)
| | Text |
|---|---|
| **EN** | The exemption applies to a primary residence — an apartment you actually lived in. If you rented it out for the entire period without living in it, the exemption does not apply — even if it is your only apartment. In that case choose 'Standard (25%)'. Exception: co-ownership structures may qualify — consult a lawyer. |
| **HE** | הפטור חל על דירת מגורים עיקרית — דירה שגרתם בה בפועל. אם השכרתם את הדירה לכל אורך התקופה מבלי לגור בה, הפטור אינו חל — גם אם זו דירתכם היחידה. במקרה כזה בחרו 'רגיל (25%)'. חריג: מבנה בעלות משותפת עשוי להקנות פטור — התייעצו עם עורך דין. |

### 2.5 Down payment adjusted note (dpAdjustedToMin)
| | Text |
|---|---|
| **EN** | Adjusted to legal minimum |
| **HE** | הותאם למינימום החוקי |

---

## 3. Chart Hints (first-visit overlays, `lib/i18n.ts`)

### 3.1 Difference view hint (diffHint)
| | Text |
|---|---|
| **EN** | 💡 Try the Difference view — it shows the gap between both scenarios at each point in time |
| **HE** | 💡 נסו את תצוגת ההפרש — היא מציגה את הפער בין שני התרחישים בכל נקודת זמן |

### 3.2 Cash flow view hint (cashFlowHint)
| | Text |
|---|---|
| **EN** | 💡 The Cash flow view shows the monthly gap between rent and mortgage — and how long until it turns positive |
| **HE** | 💡 תצוגת התזרים מציגה את ההפרש החודשי בין שכירות למשכנתה — וכמה זמן עד שהוא הופך לחיובי |

---

## 4. Chart Summary Sentences (`lib/i18n.ts`)

### 4.1 Apartment leads from year Y onward
| | Text |
|---|---|
| **EN** | Apartment leads passive from year {y} onward |
| **HE** | דירה מובילה מהשנה {y} ואילך |

### 4.2 Apartment leads all 30 years
| | Text |
|---|---|
| **EN** | Apartment leads passive throughout — passive never catches up within 30 years |
| **HE** | דירה מובילה לאורך כל התקופה |

### 4.3 Passive leads all 30 years
| | Text |
|---|---|
| **EN** | Passive investment leads throughout the full 30-year horizon |
| **HE** | השקעה פסיבית מובילה לאורך כל 30 השנים |

### 4.4 Two crossovers
| | Text |
|---|---|
| **EN** | Apartment leads passive from year {y1} to {y2} — a {dur}-year window |
| **HE** | דירה עולה על השקעה פסיבית משנה {y1} עד שנה {y2} — חלון של {dur} שנים |

### 4.5 Cash flow positive from year Y
| | Text |
|---|---|
| **EN** | Positive flow from year {year} |
| **HE** | תזרים חיובי החל משנה {year} |

### 4.6 Cash flow annotation (on-chart label)
| | Text |
|---|---|
| **EN** | Positive flow from year {year} |
| **HE** | תזרים חיובי משנה {year} |

*Note: cashFlowPositiveFrom and cashFlowAnnotation are currently identical in both languages.*

---

## 5. Methodology Panel — Page 1 (`components/Calculator.tsx` → `MethodologyPageEN/HE`)

### 5.1 Apartment scenario description
| | Text |
|---|---|
| **EN** | You buy an apartment with a mortgage and rent it out. The gain at each month is what you would walk away with if you sold then — sale price minus remaining mortgage, total purchase costs, selling costs, and real estate capital gains tax (מס שבח) if applicable. |
| **HE** | קונים דירה עם משכנתה ומשכירים אותה. הרווח בכל חודש הוא הרווח הנקי אם תמכרו אז — מחיר המכירה בניכוי יתרת המשכנתה, כל הוצאות הרכישה, עלויות המכירה, ומס שבח (אם רלוונטי). |

### 5.2 Passive scenario description
| | Text |
|---|---|
| **EN** | You invest the same capital (down payment + all purchase costs) in the stock market. In months where the mortgage payment exceeds rent, the negative cash flow is also invested in securities. In months where rent exceeds the mortgage, no additional investment is made to the passive portfolio. The passive gain is the net return after capital gains tax at realization (25%). |
| **HE** | משקיעים את אותו ההון (הון עצמי + כל עלויות הרכישה) בשוק ההון. בכל חודש שבו תשלום המשכנתה עולה על שכר הדירה, התזרים השלילי מושקע אף הוא בניירות ערך. בחודשים שבהם השכירות עולה על המשכנתה, אין השקעה נוספת בתיק הפסיבי. הרווח הפסיבי הוא הרווח הנקי לאחר מס רווח הון במימוש (25%). |

---

## 6. Methodology Panel — Page 2 (`components/Calculator.tsx`)

### 6.1 Numerical example intro
| | Text |
|---|---|
| **EN** | Assume an apartment priced at ₪2,000,000 with a ₪1,000,000 down payment and ₪1,000,000 mortgage. |
| **HE** | נניח דירה במחיר ₪2,000,000 עם הון עצמי של ₪1,000,000 ומשכנתה של ₪1,000,000. |

### 6.2 Day-1 passive investment
| | Text |
|---|---|
| **EN** | In the passive scenario, the full purchase outlay — down payment + purchase tax + transaction costs — is invested in the stock market on the day of purchase. In this example: ₪1,000,000 down payment + ₪160,000 purchase tax + ₪40,000 transaction costs = ₪1,200,000 invested on day 1. |
| **HE** | בתרחיש הפסיבי, כל ההון שהוצא ביום הרכישה — הון עצמי + מס רכישה + עלויות עסקה — מושקע בשוק ההון ביום הרכישה. בדוגמה זו: ₪1,000,000 הון עצמי + ₪160,000 מס רכישה + ₪40,000 עלויות עסקה = ₪1,200,000 מושקעים ביום הראשון. |

### 6.3 Negative cash flow month
| | Text |
|---|---|
| **EN** | At some month: rental income ₪5,000, mortgage payment ₪6,000 — a negative cash flow of ₪1,000. In the passive scenario, that ₪1,000 is also invested in the market — money that would have come out of pocket in the apartment scenario. |
| **HE** | בחודש מסוים: הכנסה משכירות ₪5,000, תשלום משכנתה ₪6,000 — תזרים שלילי של ₪1,000. בתרחיש הפסיבי, ₪1,000 אלו מושקעים אף הם בשוק ההון — כסף שהיה יוצא מכיסכם בתרחיש הדירה. |

### 6.4 Positive cash flow month
| | Text |
|---|---|
| **EN** | A few years later: rental income ₪5,800, mortgage payment ₪5,500 — a positive cash flow of ₪300. In the passive scenario, nothing is added to the portfolio that month — rental income does not exist in this scenario, so there is no additional investment. |
| **HE** | כעבור כמה שנים: הכנסה משכירות ₪5,800, תשלום משכנתה ₪5,500 — תזרים חיובי של ₪300. בתרחיש הפסיבי, חודש זה לא מוסיף דבר לתיק — הכנסה משכירות אינה קיימת בתרחיש זה, ולכן אין השקעה נוספת. |

### 6.5 Chart purpose
| | Text |
|---|---|
| **EN** | The chart shows the net gain you would receive in any given month if you sold — in both scenarios — allowing you to compare them over time. |
| **HE** | הגרף מציג את הרווח הנקי שהייתם מקבלים בכל חודש נתון אילו מכרתם — בתרחיש הדירה ובתרחיש הפסיבי — ומאפשר להשוות ביניהם לאורך זמן. |

---

## 7. Methodology Panel — Page 3 (`components/Calculator.tsx`)

### 7.1 Chart views — Gains
| | Text |
|---|---|
| **EN** | **Gains** — shows both curves side by side: the apartment's net gain at realisation versus the passive investment's net gain at realisation. The points where the curves intersect are the moments when one scenario overtakes the other. |
| **HE** | **רווחים** — מציג את שני העקומות במקביל: רווח נקי במימוש של הדירה מול רווח נקי במימוש של ההשקעה הפסיבית. נקודות החציה בין העקומות הן הרגעים שבהם אחד התרחישים עולה על השני. |

### 7.2 Chart views — Difference
| | Text |
|---|---|
| **EN** | **Difference** — shows the gap between the two scenarios (apartment minus passive). When the curve is above zero, the apartment is ahead. When below zero, passive investment is ahead. The height of the curve at any point shows the size of the advantage. |
| **HE** | **הפרש** — מציג את ההפרש בין שני התרחישים (דירה פחות פסיבי). כשהעקומה מעל האפס — הדירה עדיפה. כשהיא מתחת לאפס — ההשקעה הפסיבית עדיפה. גובה העקומה בכל נקודה מראה את גודל היתרון. |

### 7.3 Chart views — Cash flow
| | Text |
|---|---|
| **EN** | **Cash flow** — shows monthly rent income and mortgage payment as lines, and the net monthly cash flow as bars. Negative bars (months where mortgage exceeds rent) represent money invested in the passive scenario. |
| **HE** | **תזרים** — מציג את הכנסת השכירות ותשלום המשכנתה כקווים, ואת התזרים החודשי הנקי כעמודות. עמודות שליליות (חודשים שבהם המשכנתה עולה על השכירות) מייצגות כסף המושקע בתרחיש הפסיבי. |

### 7.4 Key assumption — Spitzer amortization
| | Text |
|---|---|
| **EN** | Spitzer (שפיצר) amortization — fixed monthly payment, standard in Israel |
| **HE** | שיטת שפיצר — תשלום משכנתה חודשי קבוע, סטנדרט בישראל |

### 7.5 Key assumption — Purchase tax
| | Text |
|---|---|
| **EN** | Purchase tax: 8% flat for an additional apartment (10% above ₪5,872,725); graduated rates for a first apartment |
| **HE** | מס רכישה: 8% גורף לדירה נוספת (10% מעל ₪5,872,725); מדרגות לדירה יחידה |

### 7.6 Key assumption — מס שבח
| | Text |
|---|---|
| **EN** | Real estate capital gains tax (מס שבח): 25% at sale, or exempt depending on your situation |
| **HE** | מס שבח: 25% על רווח הנדל"ן במימוש, או פטור בהתאם למצב |

### 7.7 Key assumption — CGT on passive
| | Text |
|---|---|
| **EN** | Capital gains tax on passive investment: 25% at realization only — not annual |
| **HE** | מס רווח הון על השקעה פסיבית: 25% במימוש בלבד — לא שנתי |

### 7.8 Key assumption — Nominal figures / inflation
| | Text |
|---|---|
| **EN** | All figures are nominal ILS — no inflation adjustment. Both scenarios are affected by inflation similarly, so the comparison remains valid |
| **HE** | כל הנתונים בשקלים נומינליים — ללא התאמה לאינפלציה. שני התרחישים מושפעים מאינפלציה באופן דומה, ולכן ההשוואה ביניהם תקפה |

### 7.9 Key assumption — Rental scenario scope
| | Text |
|---|---|
| **EN** | This models a rental investment scenario (purchase → rent → sell) |
| **HE** | המחשבון מדמה תרחיש של רכישה, השכרה ומכירה |

### 7.10 Page 3 disclaimer (inline)
| | Text |
|---|---|
| **EN** | For informational purposes only. Not financial, tax, or legal advice. Consult professionals before making decisions. |
| **HE** | למטרות מידע בלבד. אינו מהווה ייעוץ פיננסי, מיסויי או משפטי. יש להתייעץ עם אנשי מקצוע לפני קבלת החלטות. |

---

## 8. Footer (`components/Calculator.tsx`)

### 8.1 Legal disclaimer
| | Text |
|---|---|
| **EN** | For informational purposes only. Not financial, tax, or legal advice. Consult professionals before making decisions. |
| **HE** | למטרות מידע בלבד. אינו מהווה ייעוץ פיננסי, מיסויי או משפטי. יש להתייעץ עם אנשי מקצוע לפני קבלת החלטות. |

*Note: Identical to the page 3 inline disclaimer.*

### 8.2 Copyright / attribution
| | Text |
|---|---|
| **EN** | © 2026 Matan Eldar · Free for personal use |
| **HE** | © 2026 מתן אלדר · לשימוש אישי בחינם |
