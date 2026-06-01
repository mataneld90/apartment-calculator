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

const GROUPS: { getTitle: (t: Translation) => string; sliders: SliderDef[] }[] = [
  {
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
        key: 'p',
        getLabel: (t) => t.pLabel,
        getTooltip: (t) => t.tooltips.p,
        min: 0.1, max: 0.75, step: 0.01,
        display: (v) => pct(v, 0),
      },
      {
        key: 'R0',
        getLabel: (t) => t.r0Label,
        getTooltip: (t) => t.tooltips.R0,
        min: 0, max: 15_000, step: 100,
        display: (v) => shekel(v),
      },
      {
        key: 'Y',
        getLabel: (t) => t.yLabel,
        getTooltip: () => '',
        min: 5, max: 30, step: 1,
        display: (v, t) => t.yearDisplay(v),
      },
      {
        key: 'V',
        getLabel: (t) => t.vLabel,
        getTooltip: (t) => t.tooltips.V,
        min: 0, max: 0.15, step: 0.005,
        display: (v) => pct(v),
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
    getTitle: (t) => t.groupMortgage,
    sliders: [
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
      {
        key: 'Es',
        getLabel: (t) => t.esLabel,
        getTooltip: (t) => t.tooltips.Es,
        min: 0, max: 0.1, step: 0.005,
        display: (v) => pct(v),
      },
    ],
  },
  {
    getTitle: (t) => t.groupPassive,
    sliders: [
      {
        key: 'Ip',
        getLabel: (t) => t.ipLabel,
        getTooltip: (t) => t.tooltips.Ip,
        min: 0.02, max: 0.2, step: 0.005,
        display: (v) => pct(v),
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
}

function SliderRow({ label, tooltip, min, max, step, value, displayValue, onChange, isRTL }: SliderRowProps) {
  return (
    <div className="flex items-center gap-2 py-1 min-w-0">
      <div className="flex items-center gap-1 w-28 sm:w-36 shrink-0">
        <span className="text-xs text-slate-300 leading-tight">{label}</span>
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
        style={isRTL ? { transform: 'scaleX(-1)' } : undefined}
      />
      <span className="text-xs text-white w-20 sm:w-24 text-right shrink-0 tabular-nums" dir="ltr">
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
}

export default function Sliders({ params, update, results, t, isRTL }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Tax toggles */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 flex flex-col gap-3">
        <TaxToggle
          label={t.purchaseTaxLabel}
          value={params.buyerType}
          options={[
            { value: 'investor', label: t.investor8 },
            { value: 'single', label: t.firstApt },
          ]}
          onChange={(v) => update('buyerType', v as Params['buyerType'])}
        />
        <TaxToggle
          label={t.masShvachLabel}
          value={params.masShvach}
          options={[
            { value: 'exempt', label: t.exempt0 },
            { value: '25%', label: t.standard25 },
          ]}
          onChange={(v) => update('masShvach', v as Params['masShvach'])}
        />
        <p className="text-xs text-slate-500 leading-relaxed">{t.masShvachNote}</p>
      </div>

      {/* Slider groups */}
      {GROUPS.map((group) => (
        <div key={group.getTitle(t)} className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            {group.getTitle(t)}
          </div>
          <div className="flex flex-col divide-y divide-slate-700/50">
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
              />
            ))}
          </div>

          {/* Live cost summary under purchase costs group */}
          {group.getTitle(t) === t.groupCosts && (
            <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-400 flex flex-col gap-1" dir="ltr">
              <div className="flex justify-between">
                <span>{t.costsLiveEp}</span>
                <span className="text-white tabular-nums">{shekel(results.Ep)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.costsLiveTp}</span>
                <span className="tabular-nums">{shekel(results.Tp)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.costsLiveAdded}</span>
                <span className="tabular-nums">{shekel(results.addedCosts - results.Tp)}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
