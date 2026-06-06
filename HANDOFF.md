# Apartment Calculator — Session Handoff

## Context
Changes were made via FleetView (Claude Code web UI). The Turbopack dev server
repeatedly failed to hot-reload them due to a WSL/Windows filesystem watcher issue.
All code is correct in the files. Read each changed file fully before touching anything.

---

## Files Changed

### 1. `components/Sliders.tsx`
**Added `'use client'` directive** — file now uses hooks, this is required.

**New imports:**
```ts
import { useState, useEffect, useRef, type ReactNode } from 'react'
```

**New local state** inside the `Sliders` function:
```ts
const [dpMode, setDpMode] = useState<'amount' | 'fraction'>('amount')
const [downPaymentAmount, setDownPaymentAmount] = useState(() =>
  Math.round((1 - params.p) * params.Av0 / 10_000) * 10_000
)
const [dpAdjustedNote, setDpAdjustedNote] = useState(false)
const dpModeRef = useRef(dpMode)
dpModeRef.current = dpMode
const dpAmountRef = useRef(downPaymentAmount)
dpAmountRef.current = downPaymentAmount
const prevAv0Ref = useRef(params.Av0)
const prevBuyerTypeRef = useRef(params.buyerType)
```

**Effect** — when Av0 or buyerType changes in Amount mode, keep ₪ fixed, re-derive p:
```ts
useEffect(() => {
  const av0Changed = params.Av0 !== prevAv0Ref.current
  const btChanged  = params.buyerType !== prevBuyerTypeRef.current
  prevAv0Ref.current      = params.Av0
  prevBuyerTypeRef.current = params.buyerType
  if (dpModeRef.current !== 'amount' || (!av0Changed && !btChanged)) return
  const maxP  = params.buyerType === 'investor' ? 0.50 : 0.75
  const minDP = params.Av0 * (1 - maxP)
  const clampedAmt = Math.max(dpAmountRef.current, minDP)
  const roundedAmt = Math.round(Math.min(clampedAmt, params.Av0) / 10_000) * 10_000
  if (roundedAmt !== dpAmountRef.current) {
    setDownPaymentAmount(roundedAmt)
    setDpAdjustedNote(true)
    setTimeout(() => setDpAdjustedNote(false), 3_000)
  }
  const newP = Math.max(0, Math.min(1 - roundedAmt / params.Av0, maxP))
  update('p', newP)
}, [params.Av0, params.buyerType]) // intentional: dpMode/downPaymentAmount read via refs
```

**Custom mortgage block** — added inside the mortgage group render, BEFORE the generic
sliders div. Renders a tab toggle + the appropriate slider:
- Amount mode: ₪ down payment, label = t.downPaymentCard, step ₪10K, min = Av0*(1-maxP)
- Fraction mode: same as old p slider, label = t.pLabel, step 1%

Toggle style (matches chart Gains/Difference tabs):
- Active: `bg-slate-600 text-white`
- Inactive: `text-[var(--c-muted)]`
- Container: `flex text-xs border border-[var(--c-border)] rounded overflow-hidden`

**Filter** — `p` excluded from generic sliders map:
```ts
.filter(s =>
  !(group.id === 'costs'    && (s.key === 'Av0' || s.key === 'G0')) &&
  !(group.id === 'mortgage' && s.key === 'p')
)
```

---

### 2. `lib/i18n.ts`
Added 3 fields to `Translation` type + both `en` / `he` objects:
```ts
dpModeAmount: string    // 'Amount' / 'סכום'
dpModeFraction: string  // 'Fraction' / 'אחוז'
dpAdjustedToMin: string // 'Adjusted to legal minimum' / 'הותאם למינימום החוקי'
```

---

### 3. `components/Calculator.tsx`
Mobile header compacted — single-row layout, smaller text, subtitle hidden on mobile:
- `py-2 sm:py-4` (was py-4)
- `text-base sm:text-xl` on h1 (was text-xl)
- `hidden sm:block` on subtitle
- buttons: `text-xs px-2 py-1` on mobile, `sm:text-sm sm:px-3 sm:py-1.5` on desktop

---

### 4. `components/Chart.tsx`
**a) Peak label — only show when apartment actually leads:**
```ts
const showPeak = peakVal > 1  // >1 guards against float noise
// Removed troughVal, peakIsPositive, peakPassiveLead from diff chart entirely
const extremePt = points.find(p => p.gainDiff === peakVal)
const peakLabel = t.peakAdvantage(shortShekel(peakVal), (peakMonth / 12).toFixed(1))
```

**b) Diff view labels — HTML overlay instead of SVG:**
SVG labels were clipped by Recharts internal clipPath. Solution: remove all label
props from diff view ReferenceLine and ReferenceDot, render labels as absolutely
positioned HTML divs over the chart container.

Chart wrapper div gets `relative` class. HTML overlay:
```tsx
{view === 'diff' && (
  <div className="absolute inset-0 pointer-events-none">
    {peakVisible && <div style={{ position:'absolute', left:clampedPeakAbsX, top:4, transform:'translateX(-50%)', ... }}>{peakLabel}</div>}
    {visibleCrossovers.map((c, i) => (
      <div key={c.month} style={{ position:'absolute', left:clampedCrossX, top: 4 + diffCrossoverOffsets[i], ... }}>
        {t.yearLabel2} {(c.month/12).toFixed(1)}
      </div>
    ))}
  </div>
)}
```

**c) Pixel mapping:**
```ts
const PLOT_LEFT_PX = 72   // YAxis width (64) + chart left margin (8)
const PLOT_RIGHT_PX = 16
const plotAreaWidth = Math.max(1, chartWidth - PLOT_LEFT_PX - PLOT_RIGHT_PX)
const toPx = (month) => (month - start) / diffSpan * plotAreaWidth
const toAbsX = (month) => PLOT_LEFT_PX + toPx(month)
```

**d) Geometry-based collision detection (12px gap enforced):**
```ts
const PEAK_HALF_W = 110
const XOVER_W = 70
const LABEL_GAP = 12
const clampedPeakAbsX = peakVisible
  ? Math.max(PLOT_LEFT_PX + PEAK_HALF_W, Math.min(rawPeakAbsX, chartWidth - PEAK_HALF_W))
  : -9999

const diffCrossoverOffsets = visibleCrossovers.reduce((acc, c, i) => {
  const cLeft  = Math.min(toAbsX(c.month) + 4, chartWidth - XOVER_W)
  const cRight = cLeft + XOVER_W
  let off = 0
  if (peakVisible) {
    const pkL = clampedPeakAbsX - PEAK_HALF_W - LABEL_GAP
    const pkR = clampedPeakAbsX + PEAK_HALF_W + LABEL_GAP
    if (cRight > pkL && cLeft < pkR) off = Math.max(off, 32)
  }
  for (let j = 0; j < i; j++) {
    if (acc[j] !== off) continue
    const pLeft = Math.min(toAbsX(visibleCrossovers[j].month) + 4, chartWidth - XOVER_W)
    if (cRight + LABEL_GAP > pLeft && cLeft < pLeft + XOVER_W + LABEL_GAP)
      off = Math.max(off, acc[j] + 32)
  }
  acc.push(Math.min(off, 64))
  return acc
}, [])
```

**e) MARGIN_TOP view-dependent:**
```ts
const MARGIN_TOP = view === 'gains' ? 40 : 8
```

**f) ResizeObserver for accurate chartWidth:**
```ts
const [chartWidth, setChartWidth] = useState(480)
useEffect(() => {
  const el = divRef.current; if (!el) return
  const ro = new ResizeObserver(entries => setChartWidth(entries[0].contentRect.width))
  ro.observe(el)
  return () => ro.disconnect()
}, [])
```

---

### 5. `app/globals.css`
```css
.recharts-wrapper,
.recharts-wrapper svg,
.recharts-surface {
  cursor: inherit !important;
  overflow: visible !important;  /* added */
}
```

---

## Known Remaining Issues

### Label overlap still occurring (Diff view)
The geometry-based collision detection is correct in logic but `chartWidth` starts at
480px before ResizeObserver fires. First render uses wrong positions.
**Fix:** wrap diffCrossoverOffsets in useMemo with chartWidth dependency, or initialize
chartWidth from a ref measured before first paint.

### Label clipping on mobile
HTML overlay `absolute inset-0` is clipped by the chart panel's `overflow-hidden`.
Labels at `top: 4` may be hidden if the panel clips the chart container top.
**Fix:** on mobile, either remove `overflow-hidden` from the chart panel wrapper
in Calculator.tsx, or add padding-top to the chart container to push labels into view.

### Toggle not appearing (dev server hot-reload bug)
The Sliders.tsx code is correct. Turbopack's file watcher failed to detect changes
made from the Windows side (WSL cross-filesystem inotify issue). The code IS in the
file — verify with `grep -n 'dpMode' components/Sliders.tsx`.
After reading the file in terminal Claude Code, it should apply correctly.

### Mobile layout not working — needs to be redone
The mobile UI changes in Calculator.tsx (compact header, chart/sliders split layout)
were written but never confirmed working due to the same hot-reload issue.
The intended mobile behavior:
- Header: single compact row, `py-2`, title `text-base`, subtitle hidden (`hidden sm:block`),
  buttons `text-xs px-2 py-1`
- Layout: fixed top area (~45dvh) for chart, independently scrollable bottom area for sliders
- Sliders shown on mobile: costs, apartment, mortgage, passive, selling (all groups)
The current Calculator.tsx has this code but it may not be rendering correctly on mobile.
Verify on an actual mobile viewport and fix if needed. The desktop layout should be
unchanged — only `md:` breakpoint and below is affected.

---

## What Is Working
- BiDi fix: "30 שנה" displays correctly in Hebrew mortgage period slider
- BOI rate: label "BOI rate", default 3.75%, step 0.25%, correct tooltip
- Effective mortgage rate: 2 decimal places (e.g. 4.35%)
- App dark mode: defaults dark 19:00–07:00, light otherwise
- Peak label: hidden when apartment never leads passive
- Down payment shown as ₪ in cost breakdown (always, regardless of mode)
- All math model unchanged — internally uses `p` (mortgage fraction)
