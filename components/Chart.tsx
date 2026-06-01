'use client'

import { useState, useCallback, useRef } from 'react'
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
  crossover: { month: number; value: number } | null
  t: Translation
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { color: string; name: string; value: number }[]
  label?: number
}) {
  if (!active || !payload?.length || label === undefined) return null
  return (
    <div className="bg-slate-800/75 border border-slate-600 rounded p-2 text-xs shadow-lg" dir="ltr">
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

const TOTAL_MONTHS = 360

function makeTicks(start: number, end: number): number[] {
  const ticks: number[] = []
  const range = end - start
  const step = range <= 60 ? 12 : range <= 120 ? 24 : 60
  const first = Math.ceil(start / step) * step
  for (let m = first; m <= end; m += step) ticks.push(m)
  if (!ticks.includes(start) && start % step === 0) ticks.unshift(start)
  return ticks
}

export default function Chart({ points, crossover, t }: Props) {
  const [domain, setDomain] = useState<[number, number]>([0, TOTAL_MONTHS])
  const [isPanning, setIsPanning] = useState(false)
  const isDragging = useRef(false)
  const dragStart = useRef<{ x: number; domainStart: number } | null>(null)

  const visiblePoints = points.filter(p => p.month >= domain[0] && p.month <= domain[1])
  const [start, end] = domain
  const ticks = makeTicks(start, end)
  const isZoomed = start !== 0 || end !== TOTAL_MONTHS

  const reset = () => setDomain([0, TOTAL_MONTHS])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const [s, en] = domain
    const center = (s + en) / 2
    const span = en - s
    const factor = e.deltaY > 0 ? 1.15 : 0.87
    const newSpan = Math.max(24, Math.min(TOTAL_MONTHS, span * factor))
    const newS = Math.max(0, Math.round(center - newSpan / 2))
    const newE = Math.min(TOTAL_MONTHS, Math.round(newS + newSpan))
    setDomain([newS, newE])
  }, [domain])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    setIsPanning(true)
    dragStart.current = { x: e.clientX, domainStart: domain[0] }
  }, [domain])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !dragStart.current) return
    const [s, en] = domain
    const span = en - s
    const pxPerMonth = 500 / span
    const deltaMonths = Math.round((dragStart.current.x - e.clientX) / pxPerMonth)
    const newS = Math.max(0, dragStart.current.domainStart + deltaMonths)
    const newE = Math.min(TOTAL_MONTHS, newS + span)
    setDomain([newS, newE])
  }, [domain])

  const onMouseUp = () => {
    isDragging.current = false
    setIsPanning(false)
    dragStart.current = null
  }

  return (
    <div dir="ltr" className="w-full flex flex-col gap-1">
      <div className="flex justify-end h-5">
        {isZoomed && (
          <button
            onClick={reset}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded border border-slate-600 hover:border-slate-400 transition-colors"
          >
            Reset zoom
          </button>
        )}
      </div>
      <div
        style={{ width: '100%', height: 360, cursor: isPanning ? 'grabbing' : 'grab' }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visiblePoints} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
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
            <Legend
              formatter={(value) => (
                <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>
              )}
            />
            {crossover && crossover.month >= start && crossover.month <= end && (
              <ReferenceLine
                x={crossover.month}
                stroke="#64748b"
                strokeDasharray="4 2"
                label={{
                  value: t.crossoverLabel,
                  position: 'insideTopRight',
                  fill: '#94a3b8',
                  fontSize: 10,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="apartmentGain"
              name={t.apartmentLine}
              stroke="#16a34a"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="passiveGain"
              name={t.passiveLine}
              stroke="#2563eb"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="goal"
              name={t.goalLine}
              stroke="#64748b"
              dot={false}
              strokeWidth={1}
              strokeDasharray="5 3"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-600 text-center select-none">Scroll to zoom · drag to pan</p>
    </div>
  )
}
