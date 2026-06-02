import type { Results } from '@/lib/types'
import type { Params } from '@/lib/types'
import type { Translation } from '@/lib/i18n'
import { shekel, pct } from '@/lib/formatters'

interface Props {
  results: Results
  params: Params
  t: Translation
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[rgba(30,41,59,0.75)] border border-[#334155] rounded-lg p-4 flex flex-col gap-1">
      <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">{title}</div>
      {children}
    </div>
  )
}

function MonthYearValue({
  month,
  value,
  t,
}: {
  month: number
  value: number
  t: Translation
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-lg font-semibold text-white" dir="ltr">
        {shekel(value)}
      </div>
      <div className="text-sm text-slate-300" dir="ltr">
        {t.monthLabel} {month} · {t.yearLabel2} {(month / 12).toFixed(1)}
      </div>
    </div>
  )
}

export default function ResultCards({ results, params, t }: Props) {
  const { crossovers, goalMonth, Tp, Ep, S0 } = results
  const firstCrossover = crossovers[0] ?? null

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Crossover card */}
      <Card title={t.crossoverTitle}>
        {firstCrossover ? (
          <MonthYearValue month={firstCrossover.month} value={firstCrossover.value} t={t} />
        ) : (
          <div className="text-sm text-slate-400 italic">{t.notWithin30}</div>
        )}
      </Card>

      {/* Goal card */}
      <Card title={t.goalTitle}>
        {goalMonth ? (
          <div className="flex flex-col gap-0.5">
            <MonthYearValue month={goalMonth.month} value={goalMonth.value} t={t} />
            <div className="text-xs text-slate-400">
              {t.goalSubLabel(pct(params.G0, 0))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-400 italic">{t.notWithin30}</div>
        )}
      </Card>

      {/* Expenses card */}
      <Card title={t.expensesTitle}>
        <div className="text-lg font-semibold text-white" dir="ltr">
          {shekel(Ep)}
        </div>
      </Card>
    </div>
  )
}
