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
} from 'recharts'
import type { ChartPoint } from '@/lib/types'
import type { Translation } from '@/lib/i18n'
import { shortShekel, shekel } from '@/lib/formatters'

interface Props {
  points: ChartPoint[]
  crossovers: { month: number; value: number }[]
  G0: number
  onG0Change: (v: number) => void
  t: Translation
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { color: string; name: string; value: number }[]
  label?: number
}) {
  if (!active || !payload?.length || label === undefined) return null
  return (
    <div className="bg-slate-800/65 border border-slate-600 rounded p-2 text-xs shadow-lg backdrop-blur-sm" dir="ltr">
      <p className="text-slate-400 mb-1">
        Month {label} · Year {(label / 12).toFixed(1)}
      </p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {shekel(entry.value)}
        </p>
      ))}
    </div>
  )
}

const TOTAL = 360

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
  const divRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startX: number; origS: number; span: number } | null>(null)
  const cursorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isZoomed = domain[0] !== 0 || domain[1] !== TOTAL
  const goalValue = points[0]?.goal ?? 0

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

  return (
    <div dir="ltr" className="w-full flex flex-col gap-1">
      <div className="flex justify-end h-5">
        {isZoomed && (
          <button
            onClick={() => setDomain([0, TOTAL])}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded border border-slate-600 hover:border-slate-400 transition-colors"
          >
            Reset zoom
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
              tickFormatter={shortShekel}
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              width={64}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />

            {/* Goal horizontal reference line */}
            {goalValue > 0 && (
              <ReferenceLine
                y={goalValue}
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                label={{
                  value: t.goalLine,
                  position: 'insideTopRight',
                  fill: '#f59e0b',
                  fontSize: 10,
                }}
              />
            )}

            {/* Vertical crossover lines */}
            {visibleCrossovers.map((c, i) => (
              <ReferenceLine
                key={c.month}
                x={c.month}
                stroke="#64748b"
                strokeDasharray="4 2"
                label={{
                  value: crossovers.length > 1 ? `${t.crossoverLabel} ${i + 1}` : t.crossoverLabel,
                  position: 'insideTopRight',
                  fill: '#94a3b8',
                  fontSize: 10,
                }}
              />
            ))}

            <Line type="monotone" dataKey="apartmentGain" name={t.apartmentLine} stroke="#16a34a" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line type="monotone" dataKey="passiveGain" name={t.passiveLine} stroke="#2563eb" dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-600 text-center select-none">Scroll to zoom · drag to pan</p>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
        <span className="text-xs text-slate-400 w-28 shrink-0">{t.g0Label}</span>
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
