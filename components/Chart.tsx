'use client'

import { useState, useEffect, useRef } from 'react'
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
  ReferenceArea,
} from 'recharts'
import type { ChartPoint } from '@/lib/types'
import type { Translation } from '@/lib/i18n'
import { shortShekel, shekel } from '@/lib/formatters'
import InfoTooltip from './InfoTooltip'

interface Props {
  points: ChartPoint[]
  crossovers: { month: number; value: number }[]
  G0: number
  onG0Change: (v: number) => void
  t: Translation
}

type View = 'gains' | 'diff'


const TOTAL = 360
const GREEN = '#16a34a'
const BLUE = '#2563eb'

function colorBands(crossovers: { month: number }[], initialGreen: boolean) {
  const bands: { x1: number; x2: number; green: boolean }[] = []
  let green = initialGreen
  let prev = 0
  for (const c of crossovers) {
    bands.push({ x1: prev, x2: c.month, green })
    green = !green
    prev = c.month
  }
  bands.push({ x1: prev, x2: TOTAL, green })
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

export default function Chart({ points, crossovers, G0, onG0Change, t }: Props) {
  const [domain, setDomain] = useState<[number, number]>([0, TOTAL])
  const [view, setView] = useState<View>('gains')
  const divRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startX: number; origS: number; span: number } | null>(null)
  const cursorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isZoomed = domain[0] !== 0 || domain[1] !== TOTAL
  const goalValue = points[0]?.goal ?? 0
  const initialGreen = (points[0]?.gainDiff ?? -1) >= 0
  const bands = colorBands(crossovers, initialGreen)

  const setCursor = (c: string) => {
    if (divRef.current) divRef.current.style.cursor = c
  }

  // Non-passive wheel listener — prevents page scroll AND allows zoom cursor
  useEffect(() => {
    const el = divRef.current
    if (!el) return
    el.style.cursor = 'grab'

    const handler = (e: WheelEvent) => {
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

    el.addEventListener('wheel', handler, { passive: false })
    return () => {
      el.removeEventListener('wheel', handler)
      if (cursorTimer.current) clearTimeout(cursorTimer.current)
    }
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

  const [start, end] = domain
  const visible = points.filter(p => p.month >= start && p.month <= end)
  const ticks = makeTicks(start, end)
  const visibleCrossovers = crossovers.filter(c => c.month >= start && c.month <= end)

  const YTICK = 2_000_000
  const yVals = view === 'diff'
    ? visible.map(p => p.gainDiff)
    : visible.flatMap(p => [p.apartmentGain, p.passiveGain])
  const yRawMin = yVals.length ? Math.min(...yVals) : 0
  const yRawMax = yVals.length ? Math.max(...yVals) : YTICK * 4
  const yTickMin = Math.floor(yRawMin / YTICK) * YTICK
  const yTickMax = Math.ceil(yRawMax / YTICK) * YTICK
  const yTicks: number[] = []
  for (let v = yTickMin; v <= yTickMax; v += YTICK) yTicks.push(v)

  return (
    <div dir="ltr" className="w-full flex flex-col gap-1">
      {/* Header row: view toggle left, reset zoom right */}
      <div className="flex items-center justify-between h-6">
        <div className="flex gap-1">
          {(['gains', 'diff'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                view === v
                  ? 'border-slate-400 text-slate-200 bg-slate-700'
                  : 'border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              {v === 'gains' ? t.viewGains : t.viewDiff}
            </button>
          ))}
        </div>
        {isZoomed && (
          <button
            onClick={() => setDomain([0, TOTAL])}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded border border-slate-600 hover:border-slate-400 transition-colors"
          >
            {t.resetZoom}
          </button>
        )}
      </div>

      <div
        ref={divRef}
        style={{ width: '100%', height: 360 }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visible} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="month"
              ticks={ticks}
              tickFormatter={(m) => `${(m / 12).toFixed(0)}y`}
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              domain={[yTickMin, yTickMax]}
              ticks={yTicks}
              tickFormatter={shortShekel}
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              width={64}
            />
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload?.length || label === undefined) return null
              return (
                <div className="bg-slate-800/65 border border-slate-600 rounded p-2 text-xs shadow-lg backdrop-blur-sm" dir="ltr">
                  <p className="text-slate-400 mb-1">
                    {t.monthLabel} {label} · {t.yearLabel2} {(Number(label) / 12).toFixed(1)}
                  </p>
                  {payload.map((entry) => (
                    <p key={entry.name} style={{ color: entry.color }}>
                      {entry.name}: {typeof entry.value === 'number' ? shekel(entry.value) : entry.value}
                    </p>
                  ))}
                </div>
              )
            }} />
            <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />

            {/* Background color bands: green where apartment leads, blue where passive leads */}
            {bands.map(({ x1, x2, green }) => (
              <ReferenceArea key={x1} x1={x1} x2={x2} fill={green ? GREEN : BLUE} fillOpacity={0.08} stroke="none" />
            ))}

            {view === 'gains' ? (
              <>
                {goalValue > 0 && (
                  <ReferenceLine
                    y={goalValue}
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="6 3"
                    label={{ value: t.goalLine, position: 'insideTopRight', fill: '#f59e0b', fontSize: 10 }}
                  />
                )}
                {visibleCrossovers.map((c, i) => (
                  <ReferenceLine
                    key={c.month}
                    x={c.month}
                    stroke="#64748b"
                    strokeDasharray="4 2"
                    label={{
                      value: `${t.yearLabel2} ${(c.month / 12).toFixed(1)}`,
                      position: 'insideTopRight',
                      fill: '#94a3b8',
                      fontSize: 10,
                    }}
                  />
                ))}
                <Line type="monotone" dataKey="apartmentGain" name={t.apartmentLine} stroke="#16a34a" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="passiveGain" name={t.passiveLine} stroke="#2563eb" dot={false} strokeWidth={2} isAnimationActive={false} />
              </>
            ) : (
              <>
                <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 2" />
                {visibleCrossovers.map((c, i) => (
                  <ReferenceLine
                    key={c.month}
                    x={c.month}
                    stroke="#64748b"
                    strokeDasharray="4 2"
                    label={{
                      value: `${t.yearLabel2} ${(c.month / 12).toFixed(1)}`,
                      position: 'insideTopRight',
                      fill: '#94a3b8',
                      fontSize: 10,
                    }}
                  />
                ))}
                <Line type="monotone" dataKey="gainDiff" name={t.diffLine} stroke="#a78bfa" dot={false} strokeWidth={2} isAnimationActive={false} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-600 text-center select-none">{t.scrollHint}</p>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
        <div className="flex items-center gap-1 w-28 shrink-0">
          <span className="text-xs text-slate-400 leading-tight">{t.g0Label}</span>
          <InfoTooltip text={t.tooltips.G0} />
        </div>
        <input
          type="range"
          min={0}
          max={4}
          step={0.1}
          value={G0}
          onChange={(e) => onG0Change(Number(e.target.value))}
          className="flex-1 h-1"
        />
        <span className="text-xs text-white w-10 text-right shrink-0 tabular-nums">{t.mulDisplay(G0)}</span>
      </div>
    </div>
  )
}
