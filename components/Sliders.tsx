import type { Params } from '@/lib/types'
import type { Results } from '@/lib/types'
import type { Translation } from '@/lib/i18n'
import { shekel, pct } from '@/lib/formatters'
import TaxToggle from './TaxToggle'
import InfoTooltip from './InfoTooltip'

type NumericParamKey = keyof Omit<Params, 'buyerType' | 'masShvach'>

type SliderDef = {
  key: NumericParamKey
  getLabel: (t: Translation) => string
  getTooltip: (t: Translation) => string
  min: number
  max: number
  step: number
  display: (v: number, t: Translation) => string
}

const GROUPS: { id: string; getTitle: (t: Translation) => string; sliders: SliderDef[] }[] = [
  {
    id: 'apartment',
    getTitle: (t) => t.groupApartment,
    sliders: [
      {
        key: 'Av0',
        getLabel: (t) => t.av0Label,
        getTooltip: () => '',
        min: 500_000, max: 6_000_000, step: 25_000,
        display: (v) => shekel(v),
      },
      {
        key: 'V',
        getLabel: (t) => t.vLabel,
        getTooltip: (t) => t.tooltips.V,
        min: 0, max: 0.15, step: 0.005,
        display: (v) => pct(v),
      },
      {
        key: 'R0',
        getLabel: (t) => t.r0Label,
        getTooltip: (t) => t.tooltips.R0,
        min: 0, max: 15_000, step: 100,
        display: (v) => shekel(v),
      },
      {
        key: 'Ri',
        getLabel: (t) => t.riLabel,
        getTooltip: () => '',
        min: 0, max: 0.1, step: 0.005,
        display: (v) => pct(v),
      },
    ],
  },
  {
    id: 'mortgage',
    getTitle: (t) => t.groupMortgage,
    sliders: [
      {
        key: 'p',
        getLabel: (t) => t.pLabel,
        getTooltip: (t) => t.tooltips.p,
        min: 0.1, max: 0.75, step: 0.01,
        display: (v) => pct(v, 0),
      },
      {
        key: 'Y',
        getLabel: (t) => t.yLabel,
        getTooltip: () => '',
        min: 5, max: 30, step: 1,
        display: (v, t) => t.yearDisplay(v),
      },
      {
        key: 'Ib',
        getLabel: (t) => t.ibLabel,
        getTooltip: (t) => t.tooltips.Ib,
        min: 0, max: 0.1, step: 0.005,
        display: (v) => pct(v),
      },
      {
        key: 'primeMinus',
        getLabel: (t) => t.primeMinusLabel,
        getTooltip: (t) => t.tooltips.primeMinus,
        min: 0, max: 0.03, step: 0.001,
        display: (v, t) => t.primeMinusDisplay(v),
      },
    ],
  },
  {
    id: 'costs',
    getTitle: (t) => t.groupCosts,
    sliders: [
      {
        key: 'purchaseCostsRate',
        getLabel: (t) => t.purchaseCostsRateLabel,
        getTooltip: (t) => t.tooltips.purchaseCostsRate,
        min: 0, max: 0.15, step: 0.005,
        display: (v) => pct(v),
      },
    ],
  },
  {
    id: 'selling',
    getTitle: (t) => t.groupSelling,
    sliders: [
      {
        key: 'Es',
        getLabel: (t) => t.esLabel,
        getTooltip: (t) => t.tooltips.Es,
        min: 0, max: 0.1, step: 0.005,
        display: (v) => pct(v),
      },
      {
        key: 'Im',
        getLabel: (t) => t.imLabel,
        getTooltip: (t) => t.tooltips.Im,
        min: 0, max: 0.10, step: 0.001,
        display: (v) => pct(v),
      },
    ],
  },
  {
    id: 'passive',
    getTitle: (t) => t.groupPassive,
    sliders: [
      {
        key: 'Ip',
        getLabel: (t) => t.ipLabel,
        getTooltip: (t) => t.tooltips.Ip,
        min: 0.02, max: 0.2, step: 0.005,
        display: (v, t) => pct(v) + ' ' + t.perYear,
      },
      {
        key: 'cgt',
        getLabel: (t) => t.cgtLabel,
        getTooltip: (t) => t.tooltips.cgt,
        min: 0, max: 0.5, step: 0.05,
        display: (v) => pct(v, 0),
      },
    ],
  },
  {
    id: 'misc',
    getTitle: (t) => t.groupMisc,
    sliders: [
      {
        key: 'G0',
        getLabel: (t) => t.g0Label,
        getTooltip: (t) => t.tooltips.G0,
        min: 0, max: 4, step: 0.1,
        display: (v, t) => t.mulDisplay(v),
      },
    ],
  },
]

interface SliderRowProps {
  label: string
  tooltip: string
  min: number
  max: number
  step: number
  value: number
  displayValue: string
  onChange: (v: number) => void
  isRTL: boolean
  accentColor?: string
}

function SliderRow({ label, tooltip, min, max, step, value, displayValue, onChange, isRTL, accentColor }: SliderRowProps) {
  return (
    <div className="flex items-center gap-2 py-0.5 min-w-0">
      <div className="flex items-center gap-1 w-28 shrink-0">
        <span className="text-xs text-[var(--c-text-3)] leading-tight">{label}</span>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 min-w-0"
        style={{
          ...(isRTL ? { transform: 'scaleX(-1)' } : {}),
          ...(accentColor ? { accentColor } : {}),
        }}
      />
      <span className="text-xs text-[var(--c-text)] w-20 text-right shrink-0 tabular-nums" dir="ltr">
        {displayValue}
      </span>
    </div>
  )
}

interface Props {
  params: Params
  update: <K extends keyof Params>(key: K, value: Params[K]) => void
  results: Results
  t: Translation
  isRTL: boolean
  only?: string[]
}

export default function Sliders({ params, update, results, t, isRTL, only }: Props) {
  const visibleGroups = only ? GROUPS.filter(g => only.includes(g.id)) : GROUPS
  return (
    <div className="flex flex-col gap-3">
      {visibleGroups.map((group) => (
        <div
          key={group.id}
          className={`border border-[var(--c-border)] rounded-lg p-3 ${group.id === 'passive' ? 'bg-[rgba(249,115,22,0.08)]' : 'bg-[rgba(59,130,246,0.08)]'}`}
        >
          <div className="text-xs font-semibold text-[var(--c-muted)] uppercase tracking-wide mb-2">
            {group.getTitle(t)}
          </div>

          {/* Purchase tax toggle — inside At Purchase */}
          {group.id === 'costs' && (
            <div className="mb-3">
              <TaxToggle
                label={t.purchaseTaxLabel}
                value={params.buyerType}
                options={[
                  { value: 'investor', label: t.investor8 },
                  { value: 'single', label: t.firstApt },
                ]}
                onChange={(v) => update('buyerType', v as Params['buyerType'])}
              />
            </div>
          )}

          {/* מס שבח toggle — inside At Sale, before sliders */}
          {group.id === 'selling' && (
            <div className="mb-3 flex flex-col gap-2">
              <TaxToggle
                label={t.masShvachLabel}
                value={params.masShvach}
                options={[
                  { value: 'exempt', label: t.exempt0 },
                  { value: '25%', label: t.standard25 },
                ]}
                onChange={(v) => update('masShvach', v as Params['masShvach'])}
              />
              <p className="text-xs text-[var(--c-dim)] leading-relaxed">{t.masShvachNote}</p>
            </div>
          )}

          <div className="flex flex-col divide-y divide-[var(--c-border)]">
            {group.sliders.map((def) => (
              <SliderRow
                key={def.key}
                label={def.getLabel(t)}
                tooltip={def.getTooltip(t)}
                min={def.min}
                max={def.max}
                step={def.step}
                value={params[def.key] as number}
                displayValue={def.display(params[def.key] as number, t)}
                onChange={(v) => update(def.key, v as never)}
                isRTL={isRTL}
                accentColor={group.id === 'passive' ? '#f97316' : undefined}
              />
            ))}
          </div>

          {/* Cost breakdown — inside At Purchase */}
          {group.id === 'costs' && (
            <div className="mt-3 pt-3 border-t border-[var(--c-border)] text-xs text-[var(--c-muted)] flex flex-col gap-1" dir="ltr">
              <div className="flex justify-between text-[var(--c-text-3)] font-medium">
                <span>{t.costsLiveEp}</span>
                <span className="text-[var(--c-text)] tabular-nums">{shekel(results.Ep)}</span>
              </div>
              <div className="flex justify-between pl-2">
                <span>{t.downPaymentCard}</span>
                <span className="tabular-nums">{shekel(results.S0)}</span>
              </div>
              <div className="flex justify-between pl-2">
                <span>{t.costsLiveTp}</span>
                <span className="tabular-nums">{shekel(results.Tp)}</span>
              </div>
              <div className="flex justify-between pl-2">
                <span>{t.costsLiveAdded}</span>
                <span className="tabular-nums">{shekel(results.Ep - results.S0 - results.Tp)}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
