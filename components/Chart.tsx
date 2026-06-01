'use client'

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
    <div className="bg-slate-800 border border-slate-600 rounded p-2 text-xs shadow-lg" dir="ltr">
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

const X_TICKS = [0, 60, 120, 180, 240, 300, 360]

export default function Chart({ points, crossover, t }: Props) {
  return (
    <div dir="ltr" style={{ width: '100%', height: 360, marginTop: 16 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="month"
            ticks={X_TICKS}
            tickFormatter={(m) => `${m / 12}y`}
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
          {crossover && (
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
          />
          <Line
            type="monotone"
            dataKey="passiveGain"
            name={t.passiveLine}
            stroke="#2563eb"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="goal"
            name={t.goalLine}
            stroke="#64748b"
            dot={false}
            strokeWidth={1}
            strokeDasharray="5 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
