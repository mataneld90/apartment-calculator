# Calculator UI Improvements

## 1. Rename and fix "Market rate" slider

**Current:** slider labeled "Market rate", defaults to 4.5%, range unclear.

**Problem:** "Market rate" doesn't communicate its purpose. This slider controls
the current equivalent fixed mortgage rate used to calculate the prepayment fee
(עמלת פירעון מוקדם) on the קל"צ track. The label gives no hint of this.

**Changes:**

Rename the label to: **"Current fixed mortgage rate"**
Add tooltip: *"Used to calculate the early repayment fee (עמלת פירעון מוקדם)
on your fixed-rate (קל\"צ) track. The bank charges a fee when today's equivalent
rate is lower than your locked rate — the larger the gap, the larger the fee.
If the current rate is equal to or higher than your locked rate, the fee is ₪0."*

Keep the slider range as-is (e.g. 2%–8%). Do NOT cap at 0%.

**Add a live computed display** directly below the slider showing the prepayment
fee in shekels. This is what the user actually cares about. Format:

```
Early repayment fee:  ₪43,200
```

or if fee is zero:

```
Early repayment fee:  ₪0  (rate ≥ locked rate)
```

The prepayment fee formula (approximate, used in Israeli banking):
```
fee = max(0, (lockedRate - currentMarketRate) × remainingPrincipal × remainingYears)
```

Where:
- `lockedRate` = the קל"צ track rate (4.6% in default params)
- `currentMarketRate` = value of this slider
- `remainingPrincipal` = remaining principal on the קל"צ track at the current
  month (or M0 × (714,000/2,100,000) as a fraction if tracks aren't modeled
  separately — use the proportion of the קל"צ track)
- `remainingYears` = remaining term of the קל"צ track

Display this fee as an informational number — it does NOT need to feed into
N(x) for now (that's a future enhancement). Just show it so the user
understands the implication of selling early.

Hebrew label: **"ריבית שוק נוכחית (לחישוב פירעון מוקדם)"**
Hebrew fee display: **"עמלת פירעון מוקדם: ₪X"**

---

## 2. Add crossover summary text below chart

**Current:** The chart has a shaded orange region between the two crossover
vertical lines, with year labels. Informative but requires the user to
interpret it themselves.

**Add:** A single line of plain-language text directly below the chart
(above the legend or below it — wherever it fits cleanly), computed dynamically:

**If there are two crossovers (apartment leads passive for a window):**
```
Apartment leads passive from year X to year Y — a Z-year window
```

**If apartment never overtakes passive:**
```
Passive investment leads throughout the full 30-year horizon
```

**If apartment overtakes passive and never falls behind:**
```
Apartment leads passive from year X onward
```

**If apartment leads from the start:**
```
Apartment leads passive throughout — passive never catches up within 30 years
```

Style: small, muted text (slate-400), centered below chart. Not bold.
Should update instantly when any slider changes.

Hebrew versions:
- "דירה עולה על השקעה פסיבית משנה X עד שנה Y — חלון של Z שנים"
- "השקעה פסיבית מובילה לאורך כל 30 השנים"
- "דירה מובילה מהשנה X ואילך"
- "דירה מובילה לאורך כל התקופה"

Round year values to one decimal place (e.g. "year 11.5").
Round window duration to one decimal place (e.g. "14.3-year window").

---

## 3. Default x-axis range: 0–15 years

**Current:** chart defaults to showing 0–30 years.

**Change:** default visible range to **0–15 years** (months 0–180).

The full 30-year dataset should still be accessible via scroll-to-zoom and
drag-to-pan — just the initial view should be 0–15 years, where the
interesting early dynamics (crossover, goal line) are most visible.

---

## Summary of changes

| # | What | Where |
|---|---|---|
| 1 | Rename "Market rate" → "Current fixed mortgage rate" | Right panel, AT SALE section |
| 1 | Add tooltip explaining prepayment fee | Same slider |
| 1 | Add live prepayment fee display in ₪ below slider | Same section |
| 2 | Add dynamic crossover summary sentence | Below chart |
| 3 | Change default x-axis range to 0–15 years | Chart |

No changes to the math model. No changes to the chart lines or shading.
No changes to any other sliders or parameters.
