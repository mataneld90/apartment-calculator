'use client'

import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Bar,
  Cell,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
} from 'recharts'
import type { ChartPoint, Occupancy } from '@/lib/types'
import type { Translation } from '@/lib/i18n'
import { getChartPalette } from '@/lib/colorPalette'
import { shortShekel, shekel } from '@/lib/formatters'

const fmtIRR = (v: number | null | undefined): string =>
  v == null ? '—' : (v >= 0 ? '+' : '') + (v * 100).toFixed(1) + '%'


interface Props {
  points: ChartPoint[]
  crossovers: { month: number; value: number }[]
  t: Translation
  isRTL: boolean
  fill?: boolean
  stretch?: boolean
  isDark: boolean
  diffHintReady?: boolean
  irrApartment?: (number | null)[]
  irrPassive?:   (number | null)[]
  occupancy?: Occupancy
}

type View = 'gains' | 'diff' | 'cashflow' | 'irr'

const TOTAL = 360

function colorBands(crossovers: { month: number }[], initialApt: boolean) {
  const bands: { x1: number; x2: number; apt: boolean }[] = []
  let apt = initialApt
  let prev = 1
  for (const c of crossovers) {
    bands.push({ x1: prev, x2: c.month, apt })
    apt = !apt
    prev = c.month
  }
  bands.push({ x1: prev, x2: TOTAL, apt })
  return bands
}

function makeTicks(start: number, end: number): number[] {
  const range = end - start
  const step = range <= 60 ? 12 : range <= 120 ? 24 : 60
  const ticks: number[] = []
  const first = Math.ceil(start / step) * step
  for (let m = first; m <= end; m += step) ticks.push(m)
  return ticks
}

function niceStep(range: number): number {
  if (range <= 0) return 1_000_000
  const rough = range / 5
  const mag = Math.pow(10, Math.floor(Math.log10(rough)))
  const norm = rough / mag
  if (norm < 1.5) return mag
  if (norm < 3.5) return 2 * mag
  if (norm < 7.5) return 5 * mag
  return 10 * mag
}

function CompactLegend({ view, cashFlowSubView, APT, PAS, DIFF, isRTL, t, rentLegendLabel }: {
  view: View
  cashFlowSubView: 'rentmort' | 'bars'
  APT: string
  PAS: string
  DIFF: string
  isRTL: boolean
  t: Translation
  rentLegendLabel: string
}) {
  const dir = isRTL ? 'rtl' : 'ltr'
  const swatch = (color: string, square: boolean) => (
    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: square ? 1 : '50%', background: color, flexShrink: 0 }} />
  )
  if (view === 'diff') {
    return (
      <div className="flex justify-center items-center gap-1.5 text-xs text-slate-400 select-none" style={{ height: 20 }} dir={dir}>
        {swatch(DIFF, false)}
        <span>{t.diffLine}</span>
      </div>
    )
  }
  const isCashFlow = view === 'cashflow'
  const items = view === 'irr'
    ? [
        { color: APT, label: isRTL ? 'דירה — תשואה שנתית' : 'Apartment — annualized return', square: false },
        { color: PAS, label: isRTL ? 'פסיבי — תשואה שנתית' : 'Passive — annualized return', square: false },
      ]
    : isCashFlow
      ? cashFlowSubView === 'bars'
        ? [{ color: APT, label: t.cashFlowLegendPositive, square: true }, { color: PAS, label: t.cashFlowLegendNegative, square: true }]
        : [{ color: APT, label: rentLegendLabel, square: false }, { color: PAS, label: t.cashFlowMortgageLegend, square: false }]
      : [{ color: APT, label: t.apartmentLine, square: false }, { color: PAS, label: t.passiveLine, square: false }]
  return (
    <div className="flex justify-center items-center gap-4 text-xs text-slate-400 select-none" style={{ height: 20 }} dir={dir}>
      {items.map(({ color, label, square }) => (
        <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {swatch(color, square)}
          <span>{label}</span>
        </span>
      ))}
    </div>
  )
}

export default function Chart({ points, crossovers, t, isRTL, fill, stretch, isDark, diffHintReady, irrApartment, irrPassive, occupancy = 'rentout' }: Props) {
  // Live-in: rent is avoided, not received — relabel the cashflow rent series/legend (math unchanged)
  const isLiveIn = occupancy === 'livein'
  const rentLegendLabel = isLiveIn ? t.cashFlowRentLegendLiveIn : t.cashFlowRentLegend
  const rentRowLabel    = isLiveIn ? t.cashFlowRentLabelLiveIn  : t.cashFlowRentLabel
  const rentSubViewLabel = isLiveIn ? t.cashFlowSubViewRentLiveIn : t.cashFlowSubViewRent
  const palette = getChartPalette(false, isDark)
  const APT  = palette.apt
  const PAS  = palette.pas
  const DIFF = palette.diffCurve
  const defaultEnd = TOTAL
  const [domain, setDomain] = useState<[number, number]>([0, TOTAL])
  const [view, setView] = useState<View>('gains')
  const [chartWidth, setChartWidth] = useState(480)
  const [chartHeight, setChartHeight] = useState(360)
  const [measuredPlotHeight, setMeasuredPlotHeight] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [showCashFlowHint, setShowCashFlowHint] = useState(false)
  const [cashFlowHintVisible, setCashFlowHintVisible] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startX: number; origS: number; span: number } | null>(null)
  const [irrDomain, setIrrDomain] = useState<[number, number]>([24, TOTAL])
  const domainRef = useRef<[number, number]>(domain)
  domainRef.current = domain
  const irrDomainRef = useRef<[number, number]>(irrDomain)
  irrDomainRef.current = irrDomain
  const viewRef = useRef<View>(view)
  viewRef.current = view
  const touchState = useRef<
    | { type: 'drag'; startX: number; startY: number; startTime: number; origS: number; span: number; panning: boolean }
    | { type: 'pinch'; startDist: number; origSpan: number; origCenter: number }
    | null
  >(null)
  const [tapMonth, setTapMonth] = useState<number | null>(null)
  const [activeBarMonth, setActiveBarMonth] = useState<number | null>(null)
  const [cashFlowSubView, setCashFlowSubView] = useState<'rentmort' | 'bars'>('rentmort')
  const cursorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isZoomed = view === 'irr'
    ? (irrDomain[0] !== 24 || irrDomain[1] !== TOTAL)
    : (domain[0] !== 0 || domain[1] !== defaultEnd)
  const initialApt = (points[0]?.gainDiff ?? -1) >= 0
  const bands = useMemo(() => colorBands(crossovers, initialApt), [crossovers, initialApt])

  // First month where cashFlow transitions from negative to positive (skip month 0, which is always 0)
  const cashFlowCrossover = useMemo(() => {
    const rest = points.filter(p => p.month > 0)
    if (rest.length === 0 || rest[0].cashFlow >= 0) return null
    for (const pt of rest) {
      if (pt.cashFlow >= 0) return pt.month
    }
    return null
  }, [points])

  const cashFlowAlwaysPositive = useMemo(() => {
    const rest = points.filter(p => p.month > 0)
    return rest.length > 0 && rest[0].cashFlow >= 0
  }, [points])

  const irrCrossovers = useMemo(() => {
    if (!irrApartment || !irrPassive) return []
    const result: { month: number }[] = []
    for (let m = 13; m <= 360; m++) {
      const a0 = irrApartment[m - 1], a1 = irrApartment[m]
      const p0 = irrPassive[m - 1],   p1 = irrPassive[m]
      if (a0 != null && a1 != null && p0 != null && p1 != null && (a0 - p0) * (a1 - p1) < 0)
        result.push({ month: m })
    }
    return result
  }, [irrApartment, irrPassive])

  const setCursor = (c: string) => {
    if (divRef.current) divRef.current.style.cursor = c
  }

  // Non-passive wheel + touch listeners
  useEffect(() => {
    const el = divRef.current
    if (!el) return
    el.style.cursor = 'grab'

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault()
      setCursor(e.deltaY < 0 ? 'zoom-in' : 'zoom-out')
      if (cursorTimer.current) clearTimeout(cursorTimer.current)
      cursorTimer.current = setTimeout(() => {
        setCursor(drag.current ? 'grabbing' : 'grab')
      }, 350)
      const zoomSetter = viewRef.current === 'irr' ? setIrrDomain : setDomain
      zoomSetter(prev => {
        const [s, en] = prev
        const center = (s + en) / 2
        const span = en - s
        const factor = e.deltaY > 0 ? 1.15 : 0.87
        const newSpan = Math.max(24, Math.min(TOTAL, span * factor))
        const newS = Math.max(0, Math.round(center - newSpan / 2))
        const newE = Math.min(TOTAL, Math.round(newS + newSpan))
        return [newS, newE]
      })
    }

    const touchStartHandler = (e: TouchEvent) => {
      // Ignore touches that start on an interactive overlay control (e.g. the
      // cash-flow sub-toggle) — they must not pan the chart or pop the tooltip.
      if ((e.target as HTMLElement)?.closest?.('[data-chart-control]')) return
      const [s, en] = (viewRef.current === 'irr' ? irrDomainRef : domainRef).current
      if (e.touches.length === 1) {
        touchState.current = {
          type: 'drag',
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startTime: Date.now(),
          origS: s,
          span: en - s,
          panning: false,
        }
      } else if (e.touches.length >= 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        touchState.current = { type: 'pinch', startDist: dist, origSpan: en - s, origCenter: (s + en) / 2 }
        setTapMonth(null)
      }
    }

    const touchMoveHandler = (e: TouchEvent) => {
      const ts = touchState.current
      if (!ts) return
      e.preventDefault()
      if (ts.type === 'drag' && e.touches.length >= 1) {
        if (!ts.panning) {
          const dx = e.touches[0].clientX - ts.startX
          const dy = e.touches[0].clientY - ts.startY
          if (Math.hypot(dx, dy) > 10) {
            ts.panning = true
            setTapMonth(null)
          }
        }
        if (ts.panning) {
          const activeDRef = viewRef.current === 'irr' ? irrDomainRef : domainRef
          const [curS, curE] = activeDRef.current
          if (viewRef.current !== 'irr' && curS === 0 && curE === defaultEnd) return
          const w = el.getBoundingClientRect().width
          const pxPerMonth = Math.max(1, (w - 68) / ts.span)
          const delta = Math.round((ts.startX - e.touches[0].clientX) / pxPerMonth)
          const newS = Math.max(0, ts.origS + delta)
          const touchSetter = viewRef.current === 'irr' ? setIrrDomain : setDomain
          touchSetter([newS, Math.min(TOTAL, newS + ts.span)])
        }
      } else if (ts.type === 'pinch' && e.touches.length >= 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        const scale = ts.startDist / Math.max(1, dist)
        const newSpan = Math.max(24, Math.min(TOTAL, ts.origSpan * scale))
        const newS = Math.max(0, Math.round(ts.origCenter - newSpan / 2))
        const pinchSetter = viewRef.current === 'irr' ? setIrrDomain : setDomain
        pinchSetter([newS, Math.min(TOTAL, Math.round(newS + newSpan))])
      }
    }

    const touchEndHandler = () => {
      const ts = touchState.current
      touchState.current = null
      if (ts?.type === 'drag' && !ts.panning && Date.now() - ts.startTime < 200) {
        const rect = el.getBoundingClientRect()
        const [s, en] = (viewRef.current === 'irr' ? irrDomainRef : domainRef).current
        const span = en - s
        const localX = ts.startX - rect.left - 52
        const month = Math.round(s + (localX / Math.max(1, rect.width - 68)) * span)
        setTapMonth(Math.max(s, Math.min(en, month)))
      } else if (ts?.type === 'drag' && ts.panning) {
        setTapMonth(null)
      }
    }

    el.addEventListener('wheel', wheelHandler, { passive: false })
    el.addEventListener('touchstart', touchStartHandler, { passive: true })
    el.addEventListener('touchmove', touchMoveHandler, { passive: false })
    el.addEventListener('touchend', touchEndHandler)

    return () => {
      el.removeEventListener('wheel', wheelHandler)
      el.removeEventListener('touchstart', touchStartHandler)
      el.removeEventListener('touchmove', touchMoveHandler)
      el.removeEventListener('touchend', touchEndHandler)
      if (cursorTimer.current) clearTimeout(cursorTimer.current)
    }
  }, [])

  useLayoutEffect(() => {
    if (divRef.current) {
      const r = divRef.current.getBoundingClientRect()
      if (r.width > 0) setChartWidth(r.width)
      if (r.height > 0) setChartHeight(r.height)
    }
  }, [])

  useEffect(() => {
    const el = divRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      setChartWidth(entries[0].contentRect.width)
      setChartHeight(entries[0].contentRect.height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Measure actual recharts plot area height after render
  useEffect(() => {
    const el = divRef.current
    if (!el) return
    const frame = requestAnimationFrame(() => {
      const grid = el.querySelector('.recharts-cartesian-grid')
      if (!grid) return
      const h = Math.round(grid.getBoundingClientRect().height)
      if (h > 0) setMeasuredPlotHeight(prev => prev === h ? prev : h)
    })
    return () => cancelAnimationFrame(frame)
  }, [chartWidth, chartHeight, view])

  // Reset cash flow sub-view to default when leaving cashflow tab
  useEffect(() => {
    if (view !== 'cashflow') setCashFlowSubView('rentmort')
  }, [view])

  // Sequential first-visit hints: diff hint at 6s, cashflow hint at ~14.5s
  useEffect(() => {
    if (!diffHintReady) return
    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => setShowHint(true), 6000))
    timers.push(setTimeout(() => setHintVisible(true), 6050))
    timers.push(setTimeout(() => setHintVisible(false), 12050))
    timers.push(setTimeout(() => {
      setShowHint(false)
      localStorage.setItem('hasSeenDifferenceHint', 'true')
    }, 12550))

    if (!localStorage.getItem('hasSeenCashFlowHint')) {
      timers.push(setTimeout(() => setShowCashFlowHint(true), 14500))
      timers.push(setTimeout(() => setCashFlowHintVisible(true), 14550))
      timers.push(setTimeout(() => setCashFlowHintVisible(false), 20550))
      timers.push(setTimeout(() => {
        setShowCashFlowHint(false)
        localStorage.setItem('hasSeenCashFlowHint', 'true')
      }, 21050))
    }

    return () => timers.forEach(clearTimeout)
  }, [diffHintReady])

  const onMouseDown = (e: React.MouseEvent) => {
    const isIrr = view === 'irr'
    const curDomain = isIrr ? irrDomain : domain
    if (!isIrr && curDomain[0] === 0 && curDomain[1] === defaultEnd) return
    setCursor('grabbing')
    const [s, en] = curDomain
    drag.current = { startX: e.clientX, origS: s, span: en - s }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current) return
    const isIrr = view === 'irr'
    const curDomain = isIrr ? irrDomain : domain
    if (!isIrr && curDomain[0] === 0 && curDomain[1] === defaultEnd) { drag.current = null; return }
    const { startX, origS, span } = drag.current
    const pxPerMonth = 480 / span
    const delta = Math.round((startX - e.clientX) / pxPerMonth)
    const newS = Math.max(0, origS + delta)
    const newE = Math.min(TOTAL, newS + span)
    if (isIrr) setIrrDomain([newS, newE])
    else setDomain([newS, newE])
  }

  const onMouseUp = () => {
    drag.current = null
    setCursor('grab')
  }

  // Peak of gainDiff
  const { peakVal, peakMonth } = useMemo(() => {
    const allDiff = points.map(p => p.gainDiff)
    const val = allDiff.length ? Math.max(...allDiff) : 0
    const extremePt = points.find(p => p.gainDiff === val)
    return { peakVal: val, peakMonth: extremePt?.month ?? 0 }
  }, [points])
  const showPeak = peakVal > 1
  const peakLabel = t.peakAdvantage(shortShekel(peakVal), (peakMonth / 12).toFixed(1))

  const MARGIN_TOP = fill ? 20 : 30
  const XAXIS_HEIGHT = 30
  const LABEL_TOP = MARGIN_TOP + 20

  const [start, end] = domain
  const visible = points.filter(p => p.month >= start && p.month <= end)
  const yearlyPoints = visible.filter(p => p.month % 12 === 11)
  const ticks = makeTicks(start, end)
  const cashFlowTicks = yearlyPoints.filter(p => (p.month + 1) % 60 === 0).map(p => p.month)
  const visibleCrossovers = crossovers.filter(c => c.month >= start && c.month <= end)
  const peakVisible = showPeak && peakMonth >= start && peakMonth <= end
  const visibleCashFlowCrossover = cashFlowCrossover !== null && cashFlowCrossover >= start && cashFlowCrossover <= end
    ? cashFlowCrossover : null
  const visibleIrrCrossovers = irrCrossovers.filter(c => c.month >= irrDomain[0] && c.month <= irrDomain[1])
  // Full months-1–360 dataset — used for crossover detection and y-range computation
  const irrViewPoints = (irrApartment && irrPassive)
    ? points.filter(p => p.month >= 1).map(p => ({
        month: p.month,
        irrApt: irrApartment[p.month] ?? null,
        irrPas: irrPassive[p.month]   ?? null,
      }))
    : []
  // Windowed slice passed to LineChart — prevents Recharts from expanding x-domain to fit off-screen months
  const irrChartData = irrViewPoints.filter(p => p.month >= irrDomain[0] && p.month <= irrDomain[1])
  const irrWindowVals = irrViewPoints
    .filter(p => p.month >= irrDomain[0] && p.month <= irrDomain[1])
    .flatMap(p => [p.irrApt, p.irrPas]).filter((v): v is number => v != null)
  const irrYMin = irrWindowVals.length ? Math.min(...irrWindowVals) - 0.02 : -0.05
  const irrYMax = irrWindowVals.length ? Math.max(...irrWindowVals) + 0.02 : 0.15
  const irrYStep = (irrYMax - irrYMin) <= 0.40 ? 0.02 : 0.05
  const irrXAxisTicks = makeTicks(irrDomain[0], irrDomain[1])
  const irrTicks: number[] = []
  for (let v = Math.ceil(irrYMin / irrYStep) * irrYStep; v <= irrYMax + 0.001; v += irrYStep)
    irrTicks.push(Math.round(v * 1000) / 1000)

  const PLOT_LEFT_PX = 52
  const PLOT_RIGHT_PX = 16
  const plotAreaWidth = Math.max(1, chartWidth - PLOT_LEFT_PX - PLOT_RIGHT_PX)
  const diffSpan = (end - start) || 1
  const toPx = (month: number) => (month - start) / diffSpan * plotAreaWidth
  const toAbsX = (month: number) => PLOT_LEFT_PX + toPx(month)

  const PEAK_HALF_W = 110
  const XOVER_W     = 70
  const LABEL_GAP   = 12
  const rawPeakAbsX   = toAbsX(peakMonth)
  const clampedPeakAbsX = peakVisible
    ? Math.max(PLOT_LEFT_PX + PEAK_HALF_W, Math.min(rawPeakAbsX, chartWidth - PEAK_HALF_W))
    : -9999

  const visibleBands = bands
    .map(b => ({ ...b, x1: Math.max(b.x1, start || 1), x2: Math.min(b.x2, end) }))
    .filter(b => b.x1 < b.x2)

  const yVals = view === 'diff'
    ? visible.map(p => p.gainDiff)
    : view === 'cashflow'
    ? cashFlowSubView === 'rentmort'
      ? visible.flatMap(p => [p.monthlyRent, p.monthlyMortgage])
      : visible.map(p => p.cashFlow)
    : visible.flatMap(p => [p.apartmentGain, p.passiveGain])

  const yRawMin = view === 'cashflow'
    ? cashFlowSubView === 'bars' ? Math.min(0, yVals.length ? Math.min(...yVals) : 0) : 0
    : (yVals.length ? Math.min(...yVals) : 0)
  const yRawMax = view === 'cashflow'
    ? Math.max(0, yVals.length ? Math.max(...yVals) : 0)
    : (yVals.length ? Math.max(...yVals) : 2_000_000 * 4)

  const YTICK = niceStep(yRawMax - yRawMin)
  const yTickMin = Math.floor(yRawMin / YTICK) * YTICK
  const yTickMax = Math.ceil(yRawMax / YTICK) * YTICK
  const baseDomainMax = Math.max(yTickMax + YTICK * 0.25, yRawMax * 1.1)
  const plotHeightPx = Math.max(1, chartHeight - MARGIN_TOP - XAXIS_HEIGHT)
  let yDomainMax = baseDomainMax
  if (view === 'diff' && peakVisible) {
    const labelHeightInDataUnits = (23 / plotHeightPx) * (baseDomainMax - yTickMin)
    const requiredYMax = peakVal + labelHeightInDataUnits * 1.5
    if (requiredYMax > baseDomainMax) yDomainMax = requiredYMax
  }
  const peakYPx = MARGIN_TOP + (1 - (peakVal - yTickMin) / Math.max(1, yDomainMax - yTickMin)) * plotHeightPx
  const peakLabelTop = Math.max(2, peakYPx - 23)

  const LABEL_H = 16
  const VERT_GAP = 5
  const diffCrossoverOffsets = visibleCrossovers.reduce<number[]>((acc, c, i) => {
    const cLeft  = Math.min(toAbsX(c.month) + 4, chartWidth - XOVER_W)
    const cRight = cLeft + XOVER_W
    let off = 0
    if (peakVisible && Math.abs(toAbsX(c.month) - rawPeakAbsX) < 80) off = Math.max(off, 32)
    for (let j = 0; j < i; j++) {
      const prevOff = acc[j]
      const prevTop = LABEL_TOP + prevOff
      const prevBot = prevTop + LABEL_H
      const curTop  = LABEL_TOP + off
      const curBot  = curTop + LABEL_H
      if (curTop < prevBot + VERT_GAP && curBot + VERT_GAP > prevTop) {
        const pLeft  = Math.min(toAbsX(visibleCrossovers[j].month) + 4, chartWidth - XOVER_W)
        const pRight = pLeft + XOVER_W
        if (cRight + LABEL_GAP > pLeft && cLeft < pRight + LABEL_GAP)
          off = Math.max(off, prevOff + LABEL_H + VERT_GAP)
      }
    }
    acc.push(Math.min(off, 96))
    return acc
  }, [])

  // IRR chart labels sit at the bottom — same stacking algo, separate toX for IRR domain
  const irrDiffSpan = Math.max(1, irrDomain[1] - irrDomain[0])
  const irrToAbsX = (month: number) => PLOT_LEFT_PX + (month - irrDomain[0]) / irrDiffSpan * plotAreaWidth
  const irrCrossoverOffsets = visibleIrrCrossovers.reduce<number[]>((acc, c, i) => {
    const cLeft  = Math.min(irrToAbsX(c.month) + 4, chartWidth - XOVER_W)
    const cRight = cLeft + XOVER_W
    let off = 0
    for (let j = 0; j < i; j++) {
      const prevOff = acc[j]
      const pLeft  = Math.min(irrToAbsX(visibleIrrCrossovers[j].month) + 4, chartWidth - XOVER_W)
      const pRight = pLeft + XOVER_W
      if (cRight + LABEL_GAP > pLeft && cLeft < pRight + LABEL_GAP)
        off = Math.max(off, prevOff + LABEL_H + VERT_GAP)
    }
    acc.push(Math.min(off, 96))
    return acc
  }, [])

  // Adaptive label placement: put each label on whichever half the crossing curve is NOT in
  const yRange = Math.max(1, yDomainMax - yTickMin)
  // gains view: each crossover has a known value; fraction > 0.5 means curve is in upper half → label goes bottom
  const gainsCrossoverSides = visibleCrossovers.map(c =>
    (c.value - yTickMin) / yRange > 0.5 ? 'bottom' as const : 'top' as const
  )
  // gains view: per-side stacking (labels on different sides never conflict)
  const gainsOffsets = visibleCrossovers.reduce<number[]>((acc, c, i) => {
    const side = gainsCrossoverSides[i]
    const cLeft = Math.min(toAbsX(c.month) + 4, chartWidth - XOVER_W)
    const cRight = cLeft + XOVER_W
    let off = 0
    for (let j = 0; j < i; j++) {
      if (gainsCrossoverSides[j] !== side) continue
      const prevOff = acc[j]
      const pLeft = Math.min(toAbsX(visibleCrossovers[j].month) + 4, chartWidth - XOVER_W)
      const pRight = pLeft + XOVER_W
      if (cRight + LABEL_GAP > pLeft && cLeft < pRight + LABEL_GAP)
        off = Math.max(off, prevOff + LABEL_H + VERT_GAP)
    }
    acc.push(Math.min(off, 96))
    return acc
  }, [])
  // diff view: all crossovers are at gainDiff=0 (the apt-lead window boundaries). Directly above
  // each crossing x the plot is empty — the curve only climbs to the peak at interior x — so the
  // top band is always clear. Place labels there: inside the plot, away from the x-axis tick row.
  // (The old adaptive 'bottom' band overlapped the x-axis labels when the zero line sat high.)

  const yTicks: number[] = []
  for (let v = yTickMin; v <= yTickMax; v += YTICK) yTicks.push(v)

  // Rent vs Mortgage sub-view: independent domain, bypasses niceStep
  const rmRents = visible.map(p => p.monthlyRent)
  const rmMorts = visible.map(p => p.monthlyMortgage).filter(v => v > 0)
  const rmDataMin = Math.min(
    rmRents.length ? Math.min(...rmRents) : Infinity,
    rmMorts.length ? Math.min(...rmMorts) : Infinity,
  )
  const rmDataMax = rmRents.length ? Math.max(...rmRents) : 0
  const rentMortYDomain: [number, number] = [rmDataMin * 0.9, rmDataMax * 1.1]

  const sharedAxisProps = {
    xAxis: (
      <XAxis
        dataKey="month"
        ticks={ticks}
        tickFormatter={(m) => `${(m / 12).toFixed(0)}y`}
        stroke="var(--chart-axis)"
        tick={{ fill: 'var(--chart-tick)', fontSize: 13 }}
      />
    ),
    yAxis: (
      <YAxis
        domain={[yTickMin, yDomainMax]}
        ticks={yTicks}
        tickFormatter={shortShekel}
        stroke="var(--chart-axis)"
        tick={{ fill: 'var(--chart-tick)', fontSize: 13 }}
        width={52}
      />
    ),
    grid: <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />,
  }

  const rentMortRows = (rent: number, mortgage: number, cashFlow: number) => (
    <>
      <p style={{ color: APT }}>{rentRowLabel}{' '}<span dir="ltr">{shekel(rent)}</span></p>
      <p style={{ color: PAS }}>{t.cashFlowMortgageLabel}{' '}<span dir="ltr">{shekel(mortgage)}</span></p>
      <p style={{ color: cashFlow >= 0 ? APT : PAS }}>{t.cashFlowLabel}{' '}<span dir="ltr">{shekel(cashFlow)}</span></p>
    </>
  )

  const barsRow = (cashFlow: number) => (
    <p style={{ color: cashFlow >= 0 ? APT : PAS }}>{t.cashFlowLabel}{' '}<span dir="ltr">{shekel(cashFlow)}</span></p>
  )

  const cashFlowTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload?.length || label === undefined) return null
    const pt = visible.find(p => p.month === Number(label))
    if (!pt) return null
    return (
      <div className="bg-[var(--tooltip-bg)] border border-[var(--tooltip-border)] rounded p-2 text-xs shadow-lg backdrop-blur-sm" dir={isRTL ? 'rtl' : 'ltr'}>
        <p className="text-[var(--c-muted)]">
          {isRTL
            ? <span dir="ltr">{t.yearLabel2} {(Number(label) + 1) / 12}</span>
            : `${t.yearLabel2} ${(Number(label) + 1) / 12}`
          }
        </p>
        <p style={{ color: 'var(--c-muted)', fontSize: 10, marginBottom: 2 }}>{t.cashFlowMonthlyNote}</p>
        {cashFlowSubView === 'rentmort'
          ? rentMortRows(pt.monthlyRent, pt.monthlyMortgage, pt.cashFlow)
          : barsRow(pt.cashFlow)
        }
      </div>
    )
  }

  const irrTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload?.length || label === undefined) return null
    const aptI = payload.find((e: any) => e.dataKey === 'irrApt')?.value
    const pasI = payload.find((e: any) => e.dataKey === 'irrPas')?.value
    if (aptI == null && pasI == null) return null
    return (
      <div className="bg-[var(--tooltip-bg)] border border-[var(--tooltip-border)] rounded p-2 text-xs shadow-lg backdrop-blur-sm" dir={isRTL ? 'rtl' : 'ltr'}>
        <p className="text-[var(--c-muted)] mb-1">
          {isRTL
            ? <span dir="ltr">{t.yearLabel2} {(Number(label) / 12).toFixed(1)} · {t.monthLabel} {label}</span>
            : `${t.monthLabel} ${label} · ${t.yearLabel2} ${(Number(label) / 12).toFixed(1)}`
          }
        </p>
        <p style={{ color: 'var(--c-muted)', fontSize: 10, marginBottom: 2 }}>
          {isRTL ? 'תשואה שנתית אם תמכרו בנקודה זו' : 'Annualized return if you exit at this point'}
        </p>
        {aptI != null && <p style={{ color: APT }}>{t.apartmentShort}{': '}<span dir="ltr">{fmtIRR(aptI)}</span></p>}
        {pasI != null && <p style={{ color: PAS }}>{t.passiveShort}{': '}<span dir="ltr">{fmtIRR(pasI)}</span></p>}
      </div>
    )
  }

  return (
    <div dir="ltr" className={`relative w-full flex flex-col gap-0 lg:gap-1${fill || stretch ? ' h-full' : ''}`}>
      {/* Header row */}
      <div className={`flex items-center justify-between h-6${isRTL ? ' flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2${isRTL ? ' flex-row-reverse' : ''}`}>
          <span className="text-sm text-slate-400 font-normal whitespace-nowrap" dir={isRTL ? 'rtl' : 'ltr'}>{t.chartViewLabel}</span>
          <div className={`flex gap-1${isRTL ? ' flex-row-reverse' : ''}`}>
            {(['gains', 'diff', 'irr', 'cashflow'] as View[]).map((v) => {
              const isActive = view === v
              const isDiff = v === 'diff'
              const isCashFlow = v === 'cashflow'
              const label = v === 'gains' ? t.viewGains : v === 'diff' ? t.viewDiff : v === 'cashflow' ? t.viewCashFlow : (isRTL ? 'תשואה שנתית' : 'IRR')
              const hinting = (isDiff && showHint && !isActive) || (isCashFlow && showCashFlowHint && !isActive)
              const hintBright = (isDiff && hintVisible) || (isCashFlow && cashFlowHintVisible)
              const hintColor = palette.pas
              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                    isActive
                      ? 'bg-slate-600 text-white border-slate-600'
                      : 'bg-transparent text-[var(--c-muted)] border-[var(--c-border)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hover)]'
                  }`}
                  style={hinting ? {
                    backgroundColor: hintBright ? hintColor : undefined,
                    color: hintBright ? 'white' : undefined,
                    borderColor: hintBright ? hintColor : undefined,
                    transition: `background-color ${hintBright ? '300ms' : '500ms'}, color ${hintBright ? '300ms' : '500ms'}, border-color ${hintBright ? '300ms' : '500ms'}`,
                  } : undefined}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
        {isZoomed && (
          <button
            onClick={() => view === 'irr' ? setIrrDomain([24, TOTAL]) : setDomain([0, defaultEnd])}
            className="hidden lg:block text-xs text-slate-400 hover:text-slate-300 transition-colors"
          >
            {t.resetZoom}
          </button>
        )}
      </div>

      {/* Diff hint */}
      {showHint && (
        <div
          style={{
            position: 'absolute',
            top: 30,
            ...(isRTL ? { right: 0 } : { left: 0 }),
            zIndex: 10,
            width: 'max-content',
            maxWidth: 'min(500px, 100%)',
            background: isDark ? 'rgba(15,20,30,0.92)' : 'rgba(30,40,55,0.88)',
            border: '1px solid rgba(150,170,200,0.4)',
            borderRadius: 8,
            padding: '6px 12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
            opacity: hintVisible ? 1 : 0,
            transition: hintVisible ? 'opacity 300ms' : 'opacity 500ms',
            pointerEvents: 'none',
          }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <span className="text-sm italic" style={{ color: 'rgba(210,220,235,0.9)' }}>{t.diffHint}</span>
        </div>
      )}

      {/* Cash flow hint */}
      {showCashFlowHint && (
        <div
          style={{
            position: 'absolute',
            top: 30,
            ...(isRTL ? { right: 0 } : { left: 0 }),
            zIndex: 10,
            width: 'max-content',
            maxWidth: 'min(500px, 100%)',
            background: isDark ? 'rgba(15,20,30,0.92)' : 'rgba(30,40,55,0.88)',
            border: '1px solid rgba(150,170,200,0.4)',
            borderRadius: 8,
            padding: '6px 12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
            opacity: cashFlowHintVisible ? 1 : 0,
            transition: cashFlowHintVisible ? 'opacity 300ms' : 'opacity 500ms',
            pointerEvents: 'none',
          }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <span className="text-sm italic" style={{ color: 'rgba(210,220,235,0.9)' }}>{t.cashFlowHint}</span>
        </div>
      )}

      <div
        ref={divRef}
        style={{ width: '100%', touchAction: 'none', background: 'var(--chart-bg, transparent)', ...(fill || stretch ? {} : { height: 360 }) }}
        className={`relative${fill || stretch ? ' flex-1 min-h-0' : ''}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Cash-flow sub-toggle — absolute corner control inside canvas */}
        {view === 'cashflow' && (
          <div
            data-chart-control
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 34,
              right: chartWidth < 640 ? 36 : 20,
              zIndex: 9,
              display: 'flex',
              background: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              borderRadius: 6,
              padding: 2,
            }}
          >
            {/* Single toggle: shows the current sub-view, tap to switch to the other */}
            <button
              onClick={(e) => { e.stopPropagation(); setCashFlowSubView(cashFlowSubView === 'rentmort' ? 'bars' : 'rentmort') }}
              className="text-xs px-2 py-0.5 rounded text-[var(--c-text)] font-medium transition-opacity hover:opacity-70"
            >
              {cashFlowSubView === 'rentmort' ? t.cashFlowSubViewBars : rentSubViewLabel}
            </button>
          </div>
        )}

        {/* Background color bands — only for gains/diff views */}
        {(view === 'gains' || view === 'diff') && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {visibleBands.map(({ x1, x2, apt }) => (
              <div
                key={x1}
                style={{
                  position: 'absolute',
                  left: toAbsX(x1),
                  top: MARGIN_TOP,
                  width: Math.max(0, toAbsX(x2) - toAbsX(x1)),
                  height: measuredPlotHeight ?? plotHeightPx,
                  background: apt ? palette.npFill : palette.pnFill,
                  opacity: apt ? palette.npFillOpacity : palette.pnFillOpacity,
                }}
              />
            ))}
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          {view === 'cashflow' ? (
            cashFlowSubView === 'bars' ? (
              <BarChart data={yearlyPoints} margin={{ top: MARGIN_TOP, right: 16, left: 0, bottom: 0 }} barCategoryGap="0%"
                onMouseMove={(state) => { if (state.activeLabel !== undefined) setActiveBarMonth(Number(state.activeLabel)) }}
                onMouseLeave={() => setActiveBarMonth(null)}
              >
                {sharedAxisProps.grid}
                <XAxis dataKey="month" ticks={cashFlowTicks} tickFormatter={(m) => `${(m + 1) / 12}y`} stroke="var(--chart-axis)" tick={{ fill: 'var(--chart-tick)', fontSize: 13 }} />
                {sharedAxisProps.yAxis}
                {!fill && <Tooltip content={cashFlowTooltipContent} cursor={false} />}
                {!fill && (
                  <Legend
                    content={() => (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', fontSize: 13, color: 'var(--chart-tick)' }}>
                        {[
                          { label: t.cashFlowLegendPositive, color: APT },
                          { label: t.cashFlowLegendNegative, color: PAS },
                        ].map(({ label, color }) => (
                          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                            <svg width="20" height="10" style={{ display: 'block', flexShrink: 0 }}>
                              <rect x="3" y="0" width="14" height="10" rx="1" fill={color} />
                            </svg>
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                )}
                <ReferenceLine y={0} stroke="var(--chart-axis)" strokeDasharray="4 2" />
                {visibleCashFlowCrossover !== null && (
                  <ReferenceLine x={visibleCashFlowCrossover} stroke="var(--chart-crossover)" strokeDasharray="4 2" />
                )}
                <Bar dataKey="cashFlow" isAnimationActive={false} barSize={18}>
                  {yearlyPoints.map((pt) => (
                    <Cell key={pt.month} fill={pt.cashFlow >= 0 ? APT : PAS} />
                  ))}
                </Bar>
                {!fill && activeBarMonth !== null && (
                  <ReferenceLine x={activeBarMonth} stroke="var(--chart-tick)" strokeWidth={1} strokeOpacity={0.4} />
                )}
              </BarChart>
            ) : (
              <LineChart data={yearlyPoints} margin={{ top: MARGIN_TOP, right: 16, left: 0, bottom: 0 }}
                onMouseMove={(state) => { if (state.activeLabel !== undefined) setActiveBarMonth(Number(state.activeLabel)) }}
                onMouseLeave={() => setActiveBarMonth(null)}
              >
                {sharedAxisProps.grid}
                <XAxis dataKey="month" ticks={cashFlowTicks} tickFormatter={(m) => `${(m + 1) / 12}y`} stroke="var(--chart-axis)" tick={{ fill: 'var(--chart-tick)', fontSize: 13 }} />
                <YAxis domain={rentMortYDomain} tickFormatter={shortShekel} stroke="var(--chart-axis)" tick={{ fill: 'var(--chart-tick)', fontSize: 13 }} width={52} />
                {!fill && <Tooltip content={cashFlowTooltipContent} cursor={false} />}
                {!fill && (
                  <Legend
                    content={() => (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', fontSize: 13, color: 'var(--chart-tick)' }}>
                        {[
                          { label: rentLegendLabel, color: APT, dashed: false },
                          { label: t.cashFlowMortgageLegend, color: PAS, dashed: true },
                        ].map(({ label, color, dashed }) => (
                          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                            <svg width="20" height="10" style={{ display: 'block', flexShrink: 0 }}>
                              <line x1="0" y1="5" x2="20" y2="5" stroke={color} strokeWidth="2" strokeDasharray={dashed ? '6 3' : undefined} />
                            </svg>
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                )}
                <Line type="stepAfter" dataKey="monthlyRent" dot={false} isAnimationActive={false}
                  stroke={APT} strokeWidth={2}
                  activeDot={{ r: 4, fill: APT, stroke: '#fff', strokeWidth: 2 }}
                />
                <Line type="stepAfter" dataKey="monthlyMortgage" dot={false} isAnimationActive={false}
                  stroke={PAS} strokeWidth={2} strokeDasharray="6 3"
                  activeDot={{ r: 4, fill: PAS, stroke: '#fff', strokeWidth: 2 }}
                />
                {!fill && activeBarMonth !== null && (
                  <ReferenceLine x={activeBarMonth} stroke="var(--chart-tick)" strokeWidth={1} strokeOpacity={0.4} />
                )}
              </LineChart>
            )
          ) : view === 'irr' ? (
            <LineChart data={irrChartData} margin={{ top: MARGIN_TOP, right: 16, left: 0, bottom: 0 }}>
              {sharedAxisProps.grid}
              <XAxis
                dataKey="month"
                type="number"
                domain={[irrDomain[0], irrDomain[1]]}
                ticks={irrXAxisTicks}
                tickFormatter={(m) => `${(m / 12).toFixed(0)}y`}
                stroke="var(--chart-axis)"
                tick={{ fill: 'var(--chart-tick)', fontSize: 13 }}
              />
              <YAxis
                domain={[irrYMin, irrYMax]}
                ticks={irrTicks}
                tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                stroke="var(--chart-axis)"
                tick={{ fill: 'var(--chart-tick)', fontSize: 13 }}
                width={52}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <ReferenceLine y={0} stroke="var(--chart-axis)" strokeDasharray="4 2" />
              {visibleIrrCrossovers.map((c, i) => (
                <ReferenceLine
                  key={c.month}
                  x={c.month}
                  stroke="var(--chart-crossover)"
                  strokeDasharray="4 2"
                  label={(props: any) => {
                    if (!props?.viewBox) return null
                    const { x, y, height } = props.viewBox
                    const nearRight = x + 56 > chartWidth - 16
                    const chartH = height ?? 200
                    return (
                      <text x={nearRight ? x - 4 : x + 4} y={y + chartH - 6 - irrCrossoverOffsets[i]} fill="var(--chart-tick)" fontSize={13} textAnchor={nearRight ? 'end' : 'start'}>
                        {`${t.yearLabel2} ${(c.month / 12).toFixed(1)}`}
                      </text>
                    )
                  }}
                />
              ))}
              {!fill && <Tooltip content={irrTooltipContent} />}
              {!fill && (
                <Legend
                  content={({ payload }) => (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', fontSize: 13, color: 'var(--chart-tick)' }}>
                      {payload?.map((entry) => (
                        <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                          <svg width="20" height="3" style={{ display: 'block', flexShrink: 0 }}><line x1="0" y1="1.5" x2="20" y2="1.5" stroke={entry.color} strokeWidth="2.5" /></svg>
                          <span>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              )}
              <Line type="monotone" dataKey="irrApt" name={isRTL ? 'דירה — תשואה שנתית' : 'Apartment — annualized return'} stroke={APT} dot={false} activeDot={fill ? false : { r: 5, fill: APT, stroke: '#ffffff', strokeWidth: 2 }} strokeWidth={2} isAnimationActive={false} connectNulls={false} />
              <Line type="monotone" dataKey="irrPas" name={isRTL ? 'פסיבי — תשואה שנתית' : 'Passive — annualized return'} stroke={PAS} dot={false} activeDot={fill ? false : { r: 5, fill: PAS, stroke: '#ffffff', strokeWidth: 2 }} strokeWidth={2} isAnimationActive={false} connectNulls={false} />
            </LineChart>
          ) : (
            <LineChart data={visible} margin={{ top: MARGIN_TOP, right: 16, left: 0, bottom: 0 }}>
              {sharedAxisProps.grid}
              {sharedAxisProps.xAxis}
              {sharedAxisProps.yAxis}
              {!fill && <Tooltip content={({ active, payload, label }) => {
                if (!active || !payload?.length || label === undefined) return null
                const pt = points.find(p => p.month === Number(label))
                return (
                  <div className="bg-[var(--tooltip-bg)] border border-[var(--tooltip-border)] rounded p-2 text-xs shadow-lg backdrop-blur-sm" dir={isRTL ? 'rtl' : 'ltr'}>
                    <p className="text-[var(--c-muted)] mb-1">
                      {isRTL
                        ? <span dir="ltr">{t.yearLabel2} {(Number(label) / 12).toFixed(1)} · {t.monthLabel} {label}</span>
                        : `${t.monthLabel} ${label} · ${t.yearLabel2} ${(Number(label) / 12).toFixed(1)}`
                      }
                    </p>
                    {payload.map((entry) => {
                      const val = typeof entry.value === 'number' ? entry.value : null
                      if (view === 'diff' && val !== null) {
                        const aptLeads = val > 0
                        const passiveLeads = val < 0
                        const color = aptLeads ? APT : passiveLeads ? PAS : 'var(--c-text)'
                        const lbl = aptLeads ? t.tooltipAptLeads : passiveLeads ? t.tooltipPassiveLeads : t.tooltipBreakEven
                        return (
                          <p key={entry.dataKey as string} style={{ color }}>
                            {lbl}{' '}<span dir="ltr">{shekel(Math.abs(val))}</span>
                          </p>
                        )
                      }
                      return (
                        <p key={entry.name} style={{ color: entry.color }}>
                          {entry.name}{': '}
                          <span dir="ltr">{val !== null ? shekel(val) : entry.value}</span>
                        </p>
                      )
                    })}
                    {pt && pt.prepaymentFee > 0 && (
                      <p style={{ color: 'var(--c-muted)' }}>
                        {t.prepaymentFeeTooltipLabel}{': '}
                        <span dir="ltr">{shekel(pt.prepaymentFee)}</span>
                      </p>
                    )}
                  </div>
                )
              }} />}
              {!fill && (
                <Legend
                  content={({ payload }) => (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', fontSize: 13, color: 'var(--chart-tick)' }}>
                      {payload?.map((entry) => (
                        <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                          <svg width="20" height="3" style={{ display: 'block', flexShrink: 0 }}>
                            <line x1="0" y1="1.5" x2="20" y2="1.5" stroke={entry.color} strokeWidth="2.5" />
                          </svg>
                          <span>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              )}

              {view === 'gains' ? (
                <>
                  <ReferenceLine y={0} stroke="var(--chart-crossover)" strokeDasharray="4 2" />
                  {visibleCrossovers.map((c, i) => (
                    <ReferenceLine
                      key={c.month}
                      x={c.month}
                      stroke="var(--chart-crossover)"
                      strokeDasharray="4 2"
                      label={(props: any) => {
                        if (!props?.viewBox) return null
                        const { x, y, height } = props.viewBox
                        const nearRight = x + 56 > chartWidth - 16
                        const side = gainsCrossoverSides[i]
                        const off = gainsOffsets[i]
                        const chartH = height ?? plotHeightPx
                        const labelY = side === 'top' ? y + 14 + off : y + chartH - 6 - off
                        return (
                          <text
                            x={nearRight ? x - 4 : x + 4}
                            y={labelY}
                            fill="var(--chart-tick)"
                            fontSize={13}
                            textAnchor={nearRight ? 'end' : 'start'}
                          >
                            {`${t.yearLabel2} ${(c.month / 12).toFixed(1)}`}
                          </text>
                        )
                      }}
                    />
                  ))}
                  <Line type="monotone" dataKey="apartmentGain" name={fill ? t.apartmentShort : t.apartmentLine} stroke={APT} dot={false} activeDot={fill ? false : { r: 5, fill: APT, stroke: '#ffffff', strokeWidth: 2 }} strokeWidth={2} isAnimationActive={false} />
                  <Line type="monotone" dataKey="passiveGain" name={fill ? t.passiveShort : t.passiveLine} stroke={PAS} dot={false} activeDot={fill ? false : { r: 5, fill: PAS, stroke: '#ffffff', strokeWidth: 2 }} strokeWidth={2} isAnimationActive={false} />
                </>
              ) : (
                <>
                  <ReferenceLine y={0} stroke="var(--chart-axis)" strokeDasharray="4 2" />
                  {visibleCrossovers.map((c) => (
                    <ReferenceLine
                      key={c.month}
                      x={c.month}
                      stroke="var(--chart-crossover)"
                      strokeDasharray="4 2"
                    />
                  ))}
                  <Line type="monotone" dataKey="gainDiff" name={t.diffLine} stroke={DIFF} dot={false} activeDot={fill ? false : { r: 5, fill: DIFF, stroke: '#ffffff', strokeWidth: 2 }} strokeWidth={2} isAnimationActive={false} />
                  {peakVisible && (
                    <ReferenceDot
                      x={peakMonth}
                      y={peakVal}
                      r={4}
                      fill={DIFF}
                      stroke="white"
                      strokeWidth={1.5}
                    />
                  )}
                </>
              )}
            </LineChart>
          )}
        </ResponsiveContainer>

        {/* HTML overlay: diff-view labels */}
        {view === 'diff' && (
          <div className="absolute inset-0 pointer-events-none">
            {peakVisible && (
              <div
                style={{
                  position: 'absolute',
                  left: clampedPeakAbsX,
                  top: peakLabelTop,
                  transform: 'translateX(-50%)',
                  color: 'var(--c-text)',
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                  direction: isRTL ? 'rtl' : 'ltr',
                }}
              >
                {peakLabel}
              </div>
            )}
            {visibleCrossovers.map((c, i) => {
              const rawX = toAbsX(c.month) + 4
              const clampedX = Math.min(rawX, chartWidth - 70)
              const topVal = LABEL_TOP + diffCrossoverOffsets[i]
              return (
                <div
                  key={c.month}
                  style={{
                    position: 'absolute',
                    left: clampedX,
                    top: topVal,
                    color: 'var(--chart-tick)',
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {`${t.yearLabel2} ${(c.month / 12).toFixed(1)}`}
                </div>
              )
            })}
          </div>
        )}

        {/* Mobile tap tooltip */}
        {fill && tapMonth !== null && (() => {
          const resolvedMonth = view === 'cashflow' && yearlyPoints.length > 0
            ? yearlyPoints.reduce((best, p) => Math.abs(p.month - tapMonth) < Math.abs(best.month - tapMonth) ? p : best).month
            : tapMonth
          const pt = points.find(p => p.month === resolvedMonth)
          if (!pt) return null
          const [s, en] = domain
          const span = en - s
          const lineX = 52 + ((resolvedMonth - s) / Math.max(1, span)) * (chartWidth - 68)
          const bubbleLeft = Math.min(Math.max(lineX, 80), chartWidth - 80)
          return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div style={{ position: 'absolute', left: lineX, top: MARGIN_TOP, height: plotHeightPx, width: 1, background: 'var(--c-muted)', opacity: 0.7 }} />
              {(() => {
                const r = 3
                const yFor = (v: number) => MARGIN_TOP + (1 - (v - yTickMin) / Math.max(1, yDomainMax - yTickMin)) * plotHeightPx
                const dot = (color: string, val: number) => (
                  <div key={color} style={{ position: 'absolute', left: lineX - r, top: yFor(val) - r, width: r * 2, height: r * 2, borderRadius: '50%', background: color, border: '1.5px solid white', boxSizing: 'border-box' }} />
                )
                if (view === 'cashflow' || view === 'irr') return null
                return view === 'diff'
                  ? dot(DIFF, pt.gainDiff)
                  : <>{dot(APT, pt.apartmentGain)}{dot(PAS, pt.passiveGain)}</>
              })()}
              <div
                style={{
                  position: 'absolute',
                  left: bubbleLeft,
                  top: MARGIN_TOP + 8,
                  transform: 'translateX(-50%)',
                  background: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontSize: 12,
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
                  minWidth: 130,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'auto',
                  zIndex: 20,
                }}
                dir={isRTL ? 'rtl' : 'ltr'}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => { e.stopPropagation(); setTapMonth(null) }}
              >
                <p style={{ color: 'var(--c-muted)', marginBottom: 2 }}>
                  {isRTL
                    ? <span dir="ltr">
                        {view === 'cashflow'
                          ? `${t.yearLabel2} ${(resolvedMonth + 1) / 12}`
                          : `${t.yearLabel2} ${(resolvedMonth / 12).toFixed(1)} · ${t.monthLabel} ${resolvedMonth}`
                        }
                      </span>
                    : view === 'cashflow'
                    ? `${t.yearLabel2} ${(resolvedMonth + 1) / 12}`
                    : `${t.monthLabel} ${resolvedMonth} · ${t.yearLabel2} ${(resolvedMonth / 12).toFixed(1)}`
                  }
                </p>
                {view === 'cashflow' && (
                  <p style={{ color: 'var(--c-muted)', fontSize: 10, marginBottom: 2 }}>{t.cashFlowMonthlyNote}</p>
                )}
                {view === 'cashflow' ? (
                  cashFlowSubView === 'rentmort'
                    ? rentMortRows(pt.monthlyRent, pt.monthlyMortgage, pt.cashFlow)
                    : barsRow(pt.cashFlow)
                ) : view === 'diff' ? (() => {
                  const val = pt.gainDiff
                  const aptLeads = val > 0
                  const passiveLeads = val < 0
                  const color = aptLeads ? APT : passiveLeads ? PAS : 'var(--c-text)'
                  const lbl = aptLeads ? t.tooltipAptLeads : passiveLeads ? t.tooltipPassiveLeads : t.tooltipBreakEven
                  return <p style={{ color }}>{lbl} <span dir="ltr">{shekel(Math.abs(val))}</span></p>
                })() : view === 'irr' ? (
                  <>
                    {irrApartment?.[resolvedMonth] != null && <p style={{ color: APT }}>{t.apartmentShort}{': '}<span dir="ltr">{fmtIRR(irrApartment[resolvedMonth])}</span></p>}
                    {irrPassive?.[resolvedMonth]   != null && <p style={{ color: PAS }}>{t.passiveShort}{': '}<span dir="ltr">{fmtIRR(irrPassive[resolvedMonth])}</span></p>}
                  </>
                ) : (
                  <>
                    <p style={{ color: APT }}>{t.apartmentShort}{': '}<span dir="ltr">{shekel(pt.apartmentGain)}</span></p>
                    <p style={{ color: PAS }}>{t.passiveShort}{': '}<span dir="ltr">{shekel(pt.passiveGain)}</span></p>
                  </>
                )}
                {(view === 'gains' || view === 'diff') && pt.prepaymentFee > 0 && (
                  <p style={{ color: 'var(--c-muted)' }}>
                    {chartWidth < 640 ? t.prepaymentFeeTooltipLabelShort : t.prepaymentFeeTooltipLabel}{': '}
                    <span dir="ltr">{chartWidth < 640 ? shortShekel(pt.prepaymentFee) : shekel(pt.prepaymentFee)}</span>
                  </p>
                )}
              </div>
            </div>
          )
        })()}
      </div>

      {fill && <CompactLegend view={view} cashFlowSubView={cashFlowSubView} APT={APT} PAS={PAS} DIFF={DIFF} isRTL={isRTL} t={t} rentLegendLabel={rentLegendLabel} />}

      {/* Summary sentence */}
      {view === 'cashflow' ? (
        cashFlowCrossover !== null
          ? <p className="mt-2 lg:mt-0 text-sm font-semibold lg:text-base lg:font-bold text-center select-none leading-snug" style={{ color: APT }}>{t.cashFlowPositiveFrom(String(Math.round(cashFlowCrossover / 12)))}</p>
          : cashFlowAlwaysPositive
          ? <p className="mt-2 lg:mt-0 text-sm font-semibold lg:text-base lg:font-bold text-center select-none leading-snug" style={{ color: APT }}>{t.cashFlowAlwaysPositive}</p>
          : <p className="mt-2 lg:mt-0 text-sm font-semibold lg:text-base lg:font-bold text-center select-none leading-snug" style={{ color: PAS }}>{t.cashFlowNeverPositive}</p>
      ) : view === 'irr' ? null : (() => {
        let summaryText: string | null = null
        if (crossovers.length === 0)
          summaryText = initialApt ? t.summaryAptLeadsAll : t.summaryPassiveLeads
        else if (crossovers.length === 1 && !initialApt)
          summaryText = t.summaryAptLeadsOnward((crossovers[0].month / 12).toFixed(1))
        else if (crossovers.length >= 2 && !initialApt) {
          const y1 = (crossovers[0].month / 12).toFixed(1)
          const y2 = (crossovers[1].month / 12).toFixed(1)
          const dur = ((crossovers[1].month - crossovers[0].month) / 12).toFixed(1)
          summaryText = t.summaryTwoXovers(y1, y2, dur)
        }
        const summaryColor = crossovers.length === 0 && !initialApt ? PAS : APT
        return summaryText ? (
          <p className="mt-2 lg:mt-0 text-sm font-semibold lg:text-base lg:font-bold text-center select-none leading-snug" style={{ color: summaryColor }}>
            {summaryText}
          </p>
        ) : null
      })()}
      {!fill && <p className="text-xs text-[var(--c-dim)] text-center select-none">{t.scrollHint}</p>}
    </div>
  )
}
