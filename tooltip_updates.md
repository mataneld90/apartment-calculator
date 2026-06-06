# Tooltip & Panel Text Updates

Update all tooltip and panel text in both Hebrew and English throughout the app.
All changes are text only — no logic, math, or layout changes.
Search all files (i18n.ts, any hardcoded strings in components) and replace every
instance of the old strings with the new ones below.

---

## מס רכישה — דירתי היחידה tooltip

**Hebrew:**
חל על מי שאין בבעלותו דירה נוספת, או שמוכר את דירתו הקיימת תוך 18 חודשים מהרכישה. שיעורי המס מדורגים ונמוכים משמעותית מהמסלול החלופי.

**English:**
Applies to buyers who own no other apartment, or who sell their current one within 18 months of purchase. Tax rates are graduated and significantly lower than the investor track.

---

## מס רכישה — דירה נוספת tooltip

**Hebrew:**
חל על מי שמחזיק בדירה נוספת ואינו מוכר אותה לפני הרכישה. מס רכישה: 8% עד ₪5,872,725, ו-10% על החלק שמעבר. אם הדירה החדשה תשמש כמגוריך העיקריים ותמכור את הדירה הקיימת תוך 18 חודשים, עשויה לחול תקרת מימון של 75% — מומלץ להתייעץ עם יועץ משכנתאות.

**English:**
Applies to buyers who already own another apartment and are not selling it before purchase. Purchase tax: 8% up to ₪5,872,725, then 10% on the excess. If this will become your primary residence and you sell your current apartment within 18 months, a 75% mortgage cap may apply — consult a mortgage advisor.

---

## מס שבח — פטור tooltip

**Hebrew:**
הפטור חל על דירת מגורים עיקרית — דירה שגרתם בה בפועל. אם השכרתם את הדירה לכל אורך התקופה מבלי לגור בה, הפטור אינו חל — גם אם זו דירתכם היחידה. במקרה כזה בחרו 'רגיל (25%)'. חריג: מבנה בעלות משותפת עשוי להקנות פטור — התייעצו עם עורך דין.

**English:**
The exemption applies to a primary residence — an apartment you actually lived in. If you rented it out for the entire period without living in it, the exemption does not apply — even if it is your only apartment. In that case choose 'Standard (25%)'. Exception: co-ownership structures may qualify — consult a lawyer.

---

## אזהרה — דירה נוספת + פטור (warning message)

**Hebrew:**
⚠️ פטור ממס שבח כמעט ואינו חל על דירה נוספת. מדובר במקרים חריגים בלבד — התייעצו עם עורך דין.

**English:**
⚠️ מס שבח exemption almost never applies to an additional apartment. This applies only in exceptional cases — consult a lawyer.

---

## נכס — שכירות חודשית tooltip

**Hebrew:**
שכירות חודשית בעת הרכישה, לפני עדכוני שכירות שנתיים. המחשבון מעדכן את השכירות אחת לשנה.

**English:**
Monthly rent at the time of purchase, before annual increases. The calculator applies the rent increase once per year.

---

## משכנתה — ריבית בנק ישראל tooltip

**Hebrew:**
ריבית בנק ישראל הנוכחית: 3.75% (יוני 2026). ריבית פריים = ריבית בנק ישראל + 1.5%.

**English:**
Current Bank of Israel rate: 3.75% (June 2026). Prime rate = BOI rate + 1.5%.

---

## משכנתה — ההנחה מהפריים tooltip

**Hebrew:**
ההנחה שסוכמה מול הבנק ביחס לריבית הפריים. אם הבנק הציע 'פריים מינוס 0.9%' — הכניסו 0.9%. ריבית אפקטיבית = בנק ישראל + 1.5% − ערך זה.

**English:**
Your personal spread below prime, as agreed with the bank. If your bank offered 'prime minus 0.9%' — enter 0.9%. Effective rate = BOI rate + 1.5% − this value.

---

## ברכישה — עלויות עסקה tooltip

**Hebrew:**
עלויות הרכישה כאחוז משווי הדירה, ללא מס רכישה. פירוט אופייני: מתווך ~2% + מע"מ, עו"ד ~0.5% + מע"מ, שמאי ~₪3,500, יועץ משכנתאות לפי הסכמה. ברירת המחדל 5% מתאימה לרוב הרוכשים.

**English:**
Purchase costs as a percentage of apartment value, excluding purchase tax. Typical breakdown: agent ~2% + VAT, lawyer ~0.5% + VAT, appraiser ~₪3,500, mortgage advisor by agreement. The default 5% suits most buyers.

---

## במכירה — עלויות מכירה tooltip

**Hebrew:**
עלויות מכירה כאחוז משווי הדירה בעת המכירה. פירוט אופייני: מתווך ~2%, עו"ד ~0.5%, ועלויות נלוות נוספות. טווח מקובל: 2.5–3%.

**English:**
Selling costs as a percentage of the apartment value at sale. Typical breakdown: agent ~2%, lawyer ~0.5%, plus incidental costs. Common range: 2.5–3%.

---

## במכירה — ריבית שוק נוכחית tooltip

**Hebrew:**
משמשת לחישוב עמלת פירעון מוקדם. הבנק גובה עמלה כשריבית השוק הנוכחית נמוכה מהריבית הנעולה שלך — ככל שהפער גדול יותר, כך העמלה גבוהה יותר. אם ריבית השוק גבוהה מהנעולה, העמלה היא ₪0. שים לב: החישוב מבוצע על יתרת המשכנתה המלאה — בפועל, מסלול הפריים אינו חייב בעמלה, כך שהעמלה האמיתית עשויה להיות נמוכה במקצת.

**English:**
Used to calculate the early repayment fee (עמלת פירעון מוקדם). The bank charges a fee when the current market rate is below your locked rate — the larger the gap, the higher the fee. If the market rate is above your locked rate, the fee is ₪0. Note: the calculation uses the full remaining principal — in practice the prime track carries no prepayment fee, so the actual fee may be slightly lower.

---

## במכירה — מס שבח tooltip

**Hebrew:**
מס על רווח המכירה בנדל"ן: 25% מהרווח הנקי (תמורת המכירה פחות עלות הרכישה והוצאות מוכרות). לדירת השקעה — לרוב חל. לדירה עיקרית — לרוב פטור. במבנה שותפות ייתכנו פטורים — התייעצו עם עורך דין.

**English:**
Tax on real estate sale profit: 25% of net gain (sale proceeds minus purchase cost and recognized expenses). For an investment apartment — usually applies. For a primary residence — usually exempt. Co-ownership structures may qualify for exemption — consult a lawyer.

---

## השקעה פסיבית — תשואה tooltip

**Hebrew:**
תשואה שנתית צפויה בשקלים על השקעה פסיבית במדד מניות (כגון S&P 500 או MSCI World), נטו מדמי ניהול. ברירת המחדל 7.8% = ~10% בדולרים, פחות התחזקות השקל (~1.5%) ופחות דמי ניהול (~0.2%).

**English:**
Expected annual return in ILS on a passive stock market investment (e.g. S&P 500 or MSCI World), net of fund fees. Default 7.8% = ~10% in USD, minus shekel appreciation (~1.5%) and fund fees (~0.2%).

---

## השקעה פסיבית — מס רווח הון tooltip

**Hebrew:**
מס ישראלי על רווחי השקעה — נגבה רק בעת מימוש (מכירה). שיעור רגיל: 25%. דרך קרן השתלמות: עשוי להיות 0%.

**English:**
Israeli tax on investment gains — charged only at realization (when sold). Standard rate: 25%. Via a קרן השתלמות (study fund): may be 0%.

---

## כיצד זה עובד — שני תיקונים קטנים

**Hebrew — replace:**
"מושקע או נגרע מהתיק" → "מושקע בתיק או נגרע ממנו"
"המחשבון מדמה תרחיש השקעה להשכרה (קנייה — השכרה — מכירה)" → "המחשבון מדמה תרחיש של רכישה, השכרה ומכירה."

**English — replace:**
"invested in or withdrawn from the fund" → "invested in or withdrawn from the portfolio"
"This models the rental investment scenario (buy → rent → sell)" → "The calculator models a buy-to-let scenario (purchase → rent → sell)."
