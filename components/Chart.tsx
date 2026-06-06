'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
} from 'recharts'
import type { ChartPoint } from '@/lib/types'
import type { Translation } from '@/lib/i18n'
import type { ChartPalette } from '@/lib/colorPalette'
import { shortShekel, shekel } from '@/lib/formatters'
import InfoTooltip from './InfoTooltip'

interface Props {
  points: ChartPoint[]
  crossovers: { month: number; value: number }[]
  t: Translation
  isRTL: boolean
  fill?: boolean
  palette: ChartPalette
}

type View = 'gains' | 'diff'

const TOTAL = 360
// GOAL is derived from palette, not hardcoded — see const GOAL = palette.goal below

function colorBands(crossovers: { month: number }[], initialApt: boolean) {
  const bands: { x1: number; x2: number; apt: boolean }[] = []
  let apt = initialApt
  let prev = 1  // x=0/near-0 bleeds into y-axis; month 1 is ~1px at full zoom
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

export default function Chart({ points, crossovers, t, isRTL, fill, palette }: Props) {
  const APT  = palette.apt
  const PAS  = palette.pas
  const DIFF = palette.diffCurve
  const GOAL = palette.goal
  const defaultEnd = TOTAL
  const [domain, setDomain] = useState<[number, number]>([0, TOTAL])
  const [view, setView] = useState<View>('gains')
  const [chartWidth, setChartWidth] = useState(480)
  const [chartHeight, setChartHeight] = useState(360)
  const divRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startX: number; origS: number; span: number } | null>(null)
  const domainRef = useRef<[number, number]>(domain)
  domainRef.current = domain
  const touchState = useRef<
    | { type: 'drag'; startX: number; startY: number; startTime: number; origS: number; span: number; panning: boolean }
    | { type: 'pinch'; startDist: number; origSpan: number; origCenter: number }
    | null
  >(null)
  const [tapMonth, setTapMonth] = useState<number | null>(null)
  const cursorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isZoomed = domain[0] !== 0 || domain[1] !== defaultEnd
  const goalValue = points[0]?.goal ?? 0
  const initialApt = (points[0]?.gainDiff ?? -1) >= 0
  const bands = colorBands(crossovers, initialApt)

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
      setDomain(prev => {
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
      const [s, en] = domainRef.current
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
        // Detect pan vs tap: suppress tooltip once finger moves more than 10px
        if (!ts.panning) {
          const dx = e.touches[0].clientX - ts.startX
          const dy = e.touches[0].clientY - ts.startY
          if (Math.hypot(dx, dy) > 10) {
            ts.panning = true
            setTapMonth(null)
          }
        }
        if (ts.panning) {
          const w = el.getBoundingClientRect().width
          const pxPerMonth = Math.max(1, (w - 68) / ts.span)
          const delta = Math.round((ts.startX - e.touches[0].clientX) / pxPerMonth)
          const newS = Math.max(0, ts.origS + delta)
          setDomain([newS, Math.min(TOTAL, newS + ts.span)])
        }
      } else if (ts.type === 'pinch' && e.touches.length >= 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        const scale = ts.startDist / Math.max(1, dist)
        const newSpan = Math.max(24, Math.min(TOTAL, ts.origSpan * scale))
        const newS = Math.max(0, Math.round(ts.origCenter - newSpan / 2))
        setDomain([newS, Math.min(TOTAL, Math.round(newS + newSpan))])
      }
    }

    const touchEndHandler = () => {
      const ts = touchState.current
      touchState.current = null
      if (ts?.type === 'drag' && !ts.panning && Date.now() - ts.startTime < 200) {
        const rect = el.getBoundingClientRect()
        const [s, en] = domainRef.current
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

  const onMouseDown = (e: React.MouseEvent) => {
    setCursor('grabbing')
    const [s, en] = domain
    drag.current = { startX: e.clientX, origS: s, span: en - s }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current) return
    const { startX, origS, span } = drag.current
    const pxPerMonth = 480 / span
    const delta = Math.round((startX - e.clientX) / pxPerMonth)
    const newS = Math.max(0, origS + delta)
    const newE = Math.min(TOTAL, newS + span)
    setDomain([newS, newE])
  }

  const onMouseUp = () => {
    drag.current = null
    setCursor('grab')
  }

  // Peak of gainDiff (apartment's best lead over passive)
  const allDiff = points.map(p => p.gainDiff)
  const peakVal = allDiff.length ? Math.max(...allDiff) : 0
  // Only show peak dot/label when apartment actually leads (never show passive trough)
  const showPeak = peakVal > 1
  const extremePt = points.find(p => p.gainDiff === peakVal)
  const peakMonth = extremePt?.month ?? 0
  const peakLabel = t.peakAdvantage(shortShekel(peakVal), (peakMonth / 12).toFixed(1))

  // Gains view needs top margin for SVG labels; diff view labels are HTML overlays
  const MARGIN_TOP = view === 'gains' ? 40 : 20
  const XAXIS_HEIGHT = 30  // Recharts XAxis default height
  const LABEL_TOP = MARGIN_TOP + 20  // HTML overlay labels: at least 20px below first gridline

  const [start, end] = domain
  const visible = points.filter(p => p.month >= start && p.month <= end)
  const ticks = makeTicks(start, end)
  const visibleCrossovers = crossovers.filter(c => c.month >= start && c.month <= end)
  const peakVisible = showPeak && peakMonth >= start && peakMonth <= end

  // Pixel mapping for HTML overlay labels
  const PLOT_LEFT_PX = 52  // YAxis width (52) + chart left margin (0)
  const PLOT_RIGHT_PX = 16
  const plotAreaWidth = Math.max(1, chartWidth - PLOT_LEFT_PX - PLOT_RIGHT_PX)
  const diffSpan = (end - start) || 1
  const toPx = (month: number) => (month - start) / diffSpan * plotAreaWidth
  const toAbsX = (month: number) => PLOT_LEFT_PX + toPx(month)

  // Clamped peak abs-x: matches what the HTML overlay actually renders
  const PEAK_HALF_W = 110   // half of estimated peak label width (~220px)
  const XOVER_W     = 70    // estimated crossover label width ("שנה XX.X")
  const LABEL_GAP   = 12    // minimum horizontal gap between any two labels
  const rawPeakAbsX   = toAbsX(peakMonth)
  const clampedPeakAbsX = peakVisible
    ? Math.max(PLOT_LEFT_PX + PEAK_HALF_W, Math.min(rawPeakAbsX, chartWidth - PEAK_HALF_W))
    : -9999  // off-screen sentinel

  const visibleBands = bands
    .map(b => ({ ...b, x1: Math.max(b.x1, start || 1), x2: Math.min(b.x2, end) }))
    .filter(b => b.x1 < b.x2)

  const yVals = view === 'diff'
    ? visible.map(p => p.gainDiff)
    : visible.flatMap(p => [p.apartmentGain, p.passiveGain])
  const yRawMin = yVals.length ? Math.min(...yVals) : 0
  const yRawMax = yVals.length ? Math.max(...yVals) : 2_000_000 * 4
  const YTICK = niceStep(yRawMax - yRawMin)
  const yTickMin = Math.floor(yRawMin / YTICK) * YTICK
  const yTickMax = Math.ceil(yRawMax / YTICK) * YTICK
  const baseDomainMax = yTickMax + YTICK * 0.25  // headroom so max Y-axis label stays inside painted area
  const plotHeightPx = Math.max(1, chartHeight - MARGIN_TOP - XAXIS_HEIGHT)
  // Expand domain if peak label (23px above peak dot) would clip above the top gridline
  let yDomainMax = baseDomainMax
  if (view === 'diff' && peakVisible) {
    const labelHeightInDataUnits = (23 / plotHeightPx) * (baseDomainMax - yTickMin)
    const requiredYMax = peakVal + labelHeightInDataUnits * 1.5
    if (requiredYMax > baseDomainMax) yDomainMax = requiredYMax
  }
  // Peak label y position: 23px above the peak dot in pixel space
  const peakYPx = MARGIN_TOP + (1 - (peakVal - yTickMin) / Math.max(1, yDomainMax - yTickMin)) * plotHeightPx
  const peakLabelTop = Math.max(2, peakYPx - 23)

  // Crossover label offsets — LABEL_TOP baseline, push down only when needed
  const LABEL_H = 13   // single-line label height in px
  const VERT_GAP = 5   // minimum vertical gap between labels
  const diffCrossoverOffsets = visibleCrossovers.reduce<number[]>((acc, c, i) => {
    const cLeft  = Math.min(toAbsX(c.month) + 4, chartWidth - XOVER_W)
    const cRight = cLeft + XOVER_W
    let off = 0

    // Push down if crossover label is within 80px of the peak dot horizontally
    if (peakVisible && Math.abs(toAbsX(c.month) - rawPeakAbsX) < 80) {
      off = Math.max(off, 32)
    }

    // Push down to clear any earlier crossover label that vertically overlaps at current offset
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

  const yTicks: number[] = []
  for (let v = yTickMin; v <= yTickMax; v += YTICK) yTicks.push(v)

  return (
    <div dir="ltr" className={`w-full flex flex-col gap-1${fill ? ' h-full' : ''}`}>
      {/* Header row: view toggle left, reset zoom right */}
      <div className="flex items-center justify-between h-6">
        <div className="flex gap-1">
          {(['gains', 'diff'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                view === v
                  ? 'bg-slate-600 text-white border-slate-600'
                  : 'bg-transparent text-[var(--c-muted)] border-[var(--c-border)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hover)]'
              }`}
            >
              {v === 'gains' ? t.viewGains : t.viewDiff}
            </button>
          ))}
        </div>
        {isZoomed && (
          <button
            onClick={() => setDomain([0, defaultEnd])}
            className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
          >
            {t.resetZoom}
          </button>
        )}
      </div>

      <div
        ref={divRef}
        style={{ width: '100%', touchAction: 'none', ...(fill ? {} : { height: 360 }) }}
        className={`relative${fill ? ' flex-1 min-h-0' : ''}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Background color bands as HTML — rendered before SVG so grid lines always show on top */}
        <div className="absolute inset-0 pointer-events-none">
          {visibleBands.map(({ x1, x2, apt }) => (
            <div
              key={x1}
              style={{
                position: 'absolute',
                left: toAbsX(x1),
                top: MARGIN_TOP,
                width: Math.max(0, toAbsX(x2) - toAbsX(x1)),
                height: plotHeightPx,
                background: apt ? palette.npFill : palette.pnFill,
                opacity: apt ? palette.npFillOpacity : palette.pnFillOpacity,
              }}
            />
          ))}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visible} margin={{ top: MARGIN_TOP, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis
              dataKey="month"
              ticks={ticks}
              tickFormatter={(m) => `${(m / 12).toFixed(0)}y`}
              stroke="var(--chart-axis)"
              tick={{ fill: 'var(--chart-tick)', fontSize: 11 }}
            />
            <YAxis
              domain={[yTickMin, yDomainMax]}
              ticks={yTicks}
              tickFormatter={shortShekel}
              stroke="var(--chart-axis)"
              tick={{ fill: 'var(--chart-tick)', fontSize: 11 }}
              width={52}
            />
            {!fill && <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload?.length || label === undefined) return null
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
                        <span dir="ltr">
                          {val !== null ? shekel(val) : entry.value}
                        </span>
                      </p>
                    )
                  })}
                </div>
              )
            }} />}
            {!fill && <Legend formatter={(v) => <span style={{ color: 'var(--chart-tick)', fontSize: 12 }}>{v}</span>} />}

            {view === 'gains' ? (
              <>
                {goalValue > 0 && (
                  <ReferenceLine
                    y={goalValue}
                    stroke={GOAL}
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                    label={(props: any) => {
                      if (!props?.viewBox) return null
                      const { x, y, width } = props.viewBox
                      return (
                        <text x={x + width - 4} y={y - 4} fill={GOAL} fontSize={10} textAnchor="end">
                          {t.goalLine}
                        </text>
                      )
                    }}
                  />
                )}
                <ReferenceLine y={0} stroke="var(--chart-crossover)" strokeDasharray="4 2" />
                {visibleCrossovers.map((c, i) => {
                  const [s, e] = domain
                  const span = e - s || 1
                  const tooClose = i > 0 && Math.abs((c.month - visibleCrossovers[i - 1].month) / span * chartWidth) < 80
                  const yOff = tooClose ? 24 : 0
                  return (
                    <ReferenceLine
                      key={c.month}
                      x={c.month}
                      stroke="var(--chart-crossover)"
                      strokeDasharray="4 2"
                      label={(props: any) => {
                        if (!props?.viewBox) return null
                        const { x, y } = props.viewBox
                        const nearRight = x + 56 > chartWidth - 16
                        return (
                          <text
                            x={nearRight ? x - 4 : x + 4}
                            y={y + 12 + yOff}
                            fill="var(--chart-tick)"
                            fontSize={10}
                            textAnchor={nearRight ? 'end' : 'start'}
                          >
                            {`${t.yearLabel2} ${(c.month / 12).toFixed(1)}`}
                          </text>
                        )
                      }}
                    />
                  )
                })}
                <Line type="monotone" dataKey="apartmentGain" name={fill ? t.apartmentShort : t.apartmentLine} stroke={APT} dot={false} activeDot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="passiveGain" name={fill ? t.passiveShort : t.passiveLine} stroke={PAS} dot={false} activeDot={false} strokeWidth={2} isAnimationActive={false} />
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
                <Line type="monotone" dataKey="gainDiff" name={t.diffLine} stroke={DIFF} dot={false} activeDot={false} strokeWidth={2} isAnimationActive={false} />
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
        </ResponsiveContainer>

        {/* HTML overlay for diff-view labels — bypasses SVG clipPath entirely */}
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
                  fontSize: 10,
                  whiteSpace: 'nowrap',
                  direction: isRTL ? 'rtl' : 'ltr',
                }}
              >
                {peakLabel}
              </div>
            )}
            {visibleCrossovers.map((c, i) => {
              // Clamp so short crossover label (~70px wide) doesn't overflow right
              const rawX = toAbsX(c.month) + 4
              const clampedX = Math.min(rawX, chartWidth - 70)
              return (
                <div
                  key={c.month}
                  style={{
                    position: 'absolute',
                    left: clampedX,
                    top: LABEL_TOP + diffCrossoverOffsets[i],
                    color: 'var(--chart-tick)',
                    fontSize: 10,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {`${t.yearLabel2} ${(c.month / 12).toFixed(1)}`}
                </div>
              )
            })}
          </div>
        )}

        {/* Mobile tap tooltip — rendered last so it paints above all other overlays */}
        {fill && tapMonth !== null && (() => {
          const pt = points.find(p => p.month === tapMonth)
          if (!pt) return null
          const [s, en] = domain
          const span = en - s
          const lineX = 52 + ((tapMonth - s) / Math.max(1, span)) * (chartWidth - 68)
          const bubbleLeft = Math.min(Math.max(lineX, 80), chartWidth - 80)
          return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div style={{ position: 'absolute', left: lineX, top: MARGIN_TOP, bottom: 0, width: 1, background: 'var(--c-muted)', opacity: 0.7 }} />
              {(() => {
                const r = 3
                const yFor = (v: number) => MARGIN_TOP + (1 - (v - yTickMin) / Math.max(1, yDomainMax - yTickMin)) * plotHeightPx
                const dot = (color: string, val: number) => (
                  <div key={color} style={{ position: 'absolute', left: lineX - r, top: yFor(val) - r, width: r * 2, height: r * 2, borderRadius: '50%', background: color, border: '1.5px solid white', boxSizing: 'border-box' }} />
                )
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
                }}
                dir={isRTL ? 'rtl' : 'ltr'}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => { e.stopPropagation(); setTapMonth(null) }}
              >
                <p style={{ color: 'var(--c-muted)', marginBottom: 2 }}>
                  {isRTL
                    ? <span dir="ltr">{t.yearLabel2} {(tapMonth / 12).toFixed(1)} · {t.monthLabel} {tapMonth}</span>
                    : `${t.monthLabel} ${tapMonth} · ${t.yearLabel2} ${(tapMonth / 12).toFixed(1)}`
                  }
                </p>
                {view === 'diff' ? (() => {
                  const val = pt.gainDiff
                  const aptLeads = val > 0
                  const passiveLeads = val < 0
                  const color = aptLeads ? APT : passiveLeads ? PAS : 'var(--c-text)'
                  const lbl = aptLeads ? t.tooltipAptLeads : passiveLeads ? t.tooltipPassiveLeads : t.tooltipBreakEven
                  return <p style={{ color }}>{lbl} <span dir="ltr">{shekel(Math.abs(val))}</span></p>
                })() : (
                  <>
                    <p style={{ color: APT }}>{t.apartmentShort}{': '}<span dir="ltr">{shekel(pt.apartmentGain)}</span></p>
                    <p style={{ color: PAS }}>{t.passiveShort}{': '}<span dir="ltr">{shekel(pt.passiveGain)}</span></p>
                  </>
                )}
              </div>
            </div>
          )
        })()}
      </div>

      <p className="text-xs text-[var(--c-muted)] text-center select-none leading-snug">
        {(() => {
          if (crossovers.length === 0)
            return initialApt ? t.summaryAptLeadsAll : t.summaryPassiveLeads
          if (crossovers.length === 1 && !initialApt)
            return t.summaryAptLeadsOnward((crossovers[0].month / 12).toFixed(1))
          if (crossovers.length >= 2 && !initialApt) {
            const y1 = (crossovers[0].month / 12).toFixed(1)
            const y2 = (crossovers[1].month / 12).toFixed(1)
            const dur = ((crossovers[1].month - crossovers[0].month) / 12).toFixed(1)
            return t.summaryTwoXovers(y1, y2, dur)
          }
          return null
        })()}
      </p>
      {!fill && <p className="text-xs text-[var(--c-dim)] text-center select-none">{t.scrollHint}</p>}

    </div>
  )
}
