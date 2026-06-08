'use client'

import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react'
import type { Params } from '@/lib/types'
import { DEFAULT_PARAMS, purchaseTaxInvestor, purchaseTaxSingle } from '@/lib/model'
import type { Results } from '@/lib/types'
import type { Translation } from '@/lib/i18n'
import type { ChartPalette } from '@/lib/colorPalette'
import { shekel, pct } from '@/lib/formatters'
import TaxToggle from './TaxToggle'
import InfoTooltip from './InfoTooltip'

type NumericParamKey = keyof Omit<Params, 'buyerType' | 'masShvach'>

type SliderDef = {
  key: NumericParamKey
  getLabel: (t: Translation, v?: number) => string
  getTooltip: (t: Translation) => string
  min: number
  max: number
  step: number
  display: (v: number, t: Translation, isRTL?: boolean) => ReactNode
}

const GROUPS: { id: string; getTitle: (t: Translation) => string; sliders: SliderDef[] }[] = [
  {
    id: 'apartment',
    getTitle: (t) => t.groupApartment,
    sliders: [
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
        getTooltip: () => '',
        min: 0.1, max: 0.75, step: 0.01,
        display: (v) => pct(v, 0),
      },
      {
        key: 'Y',
        getLabel: (t) => t.yLabel,
        getTooltip: () => '',
        min: 5, max: 30, step: 1,
        display: (v, t, isRTL) => isRTL
          ? <span style={{display:'inline-flex',flexDirection:'row',gap:'0.25em'}}><span>{t.yearWord}</span><span>{v}</span></span>
          : t.yearDisplay(v),
      },
      {
        key: 'mortgageRate',
        getLabel: (t) => t.mortgageRateLabel,
        getTooltip: (t) => t.mortgageRateTooltip,
        min: 0.02, max: 0.10, step: 0.0005,
        display: (v) => pct(v, 2),
      },
    ],
  },
  {
    id: 'costs',
    getTitle: (t) => t.groupCosts,
    sliders: [
      {
        key: 'Av0',
        getLabel: (t) => t.av0Label,
        getTooltip: () => '',
        min: 500_000, max: 10_000_000, step: 50_000,
        display: (v) => shekel(v),
      },
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
        getTooltip: (t) => t.tooltips.Ip(`${(DEFAULT_PARAMS.Ip * 100).toFixed(1)}%`),
        min: 0.02, max: 0.2, step: 0.005,
        display: (v, t, rtl) => rtl ? pct(v) : pct(v) + ' ' + t.perYear,
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
]

function purchaseTaxRateLine(price: number, buyerType: string, t: Translation): string {
  const B_INV = 5_872_725
  const B1 = 1_978_745
  const B2 = 2_347_040
  const B3 = 6_055_070
  const B4 = 20_183_565

  let tax: number
  let rateStr: string

  if (buyerType === 'investor') {
    tax = purchaseTaxInvestor(price)
    rateStr = price <= B_INV
      ? '8%'
      : `${t.taxRateUpTo('8%', shekel(B_INV))} ${t.taxRateThen('10%')}`
  } else {
    tax = purchaseTaxSingle(price)

    const segs: string[] = []
    if (price <= B1) {
      segs.push('0%')
    } else if (price <= B2) {
      segs.push(t.taxRateUpTo('0%', shekel(B1)))
      segs.push(t.taxRateBeyond('3.5%'))
    } else if (price <= B3) {
      segs.push(t.taxRateUpTo('0%', shekel(B1)))
      segs.push(t.taxRateUpTo('3.5%', shekel(B2)))
      segs.push(t.taxRateBeyond('5%'))
    } else if (price <= B4) {
      segs.push(t.taxRateUpTo('0%', shekel(B1)))
      segs.push(t.taxRateUpTo('3.5%', shekel(B2)))
      segs.push(t.taxRateUpTo('5%', shekel(B3)))
      segs.push(t.taxRateBeyond('8%'))
    } else {
      segs.push(t.taxRateUpTo('0%', shekel(B1)))
      segs.push(t.taxRateUpTo('3.5%', shekel(B2)))
      segs.push(t.taxRateUpTo('5%', shekel(B3)))
      segs.push(t.taxRateUpTo('8%', shekel(B4)))
      segs.push(t.taxRateBeyond('10%'))
    }
    rateStr = segs.join(' · ')
  }

  return `${t.taxRateLabel} ${rateStr} · ${t.taxRateTotal(shekel(Math.round(tax)))}`
}

interface SliderRowProps {
  label: string
  tooltip: string
  min: number
  max: number
  step: number
  value: number
  displayValue: ReactNode
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
      <span className="text-xs text-[var(--c-text)] w-20 text-right shrink-0 tabular-nums overflow-hidden whitespace-nowrap" dir="ltr">
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
  palette: ChartPalette
  continuous?: boolean
  boiRate?: number | null
}

export default function Sliders({ params, update, results, t, isRTL, only, palette, continuous, boiRate }: Props) {
  const visibleGroups = useMemo(
    () => only
      ? only.map(id => GROUPS.find(g => g.id === id)).filter((g): g is typeof GROUPS[0] => g !== undefined)
      : GROUPS,
    [only]
  )

  // ── Down-payment dual-input mode ─────────────────────────────────────────
  const [dpMode, setDpMode] = useState<'amount' | 'fraction'>('amount')
  const [downPaymentAmount, setDownPaymentAmount] = useState(() =>
    Math.round((1 - params.p) * params.Av0 / 10_000) * 10_000
  )
  const [dpAdjustedNote, setDpAdjustedNote] = useState(false)

  // Refs so the effect can read current values without re-triggering
  const dpModeRef = useRef(dpMode)
  dpModeRef.current = dpMode
  const dpAmountRef = useRef(downPaymentAmount)
  dpAmountRef.current = downPaymentAmount
  const prevAv0Ref = useRef(params.Av0)
  const prevBuyerTypeRef = useRef(params.buyerType)

  // When Av0 or buyerType changes while in Amount mode: keep ₪ fixed, re-derive p
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const newP = Math.min(1 - roundedAmt / params.Av0, maxP)
    update('p', newP)
  }, [params.Av0, params.buyerType]) // intentional: omit dpMode/downPaymentAmount — read via refs

  const thresholdPct = pct(results.lockedRate, 2)
  return (
    <div className={continuous ? 'flex flex-col gap-2' : 'flex flex-col gap-3'}>
      {visibleGroups.map((group) => (
        <div
          key={group.id}
          className={continuous
            ? 'rounded-lg p-3'
            : 'border border-[var(--c-border)] rounded-lg p-3'}
          style={{
            backgroundColor: group.id === 'passive' ? palette.pasTint : palette.aptTint,
            ...(continuous ? { boxShadow: '0 0 0 1px var(--sidebar-group-border)' } : {}),
          }}
        >
          <div className="text-xs font-semibold text-[var(--c-muted)] uppercase tracking-wide mb-2">
            {group.getTitle(t)}
          </div>

          {/* Av0 purchase price — top of AT PURCHASE, before toggle */}
          {group.id === 'costs' && (() => {
            const av0 = group.sliders.find(s => s.key === 'Av0')
            if (!av0) return null
            return (
              <div className="mb-2">
                <SliderRow
                  label={av0.getLabel(t)}
                  tooltip={av0.getTooltip(t)}
                  min={av0.min}
                  max={av0.max}
                  step={av0.step}
                  value={params[av0.key] as number}
                  displayValue={av0.display(params[av0.key] as number, t, isRTL)}
                  onChange={(v) => update(av0.key, v as never)}
                  isRTL={isRTL}
                  accentColor={palette.apt}
                />
              </div>
            )
          })()}

          {/* Purchase tax toggle — inside At Purchase */}
          {group.id === 'costs' && (
            <div className="mb-3">
              <TaxToggle
                label={t.purchaseTaxLabel}
                value={params.buyerType}
                options={[
                  { value: 'single', label: t.firstApt, tooltip: t.tooltips.buyerTypeSingle },
                  { value: 'investor', label: t.investor8, tooltip: t.tooltips.buyerTypeInvestor },
                ]}
                onChange={(v) => {
                  const newType = v as Params['buyerType']
                  update('buyerType', newType)
                  if (newType === 'investor' && params.p > 0.50) update('p', 0.50)
                  update('masShvach', '25%')
                }}
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
                  { value: 'exempt', label: t.exempt0, tooltip: t.exemptTooltip },
                  { value: '25%', label: t.standard25 },
                ]}
                onChange={(v) => {
                  update('masShvach', v as Params['masShvach'])
                }}
              />
              {params.buyerType === 'investor' && params.masShvach === 'exempt' ? (
                <div className="text-xs text-amber-500" dir={isRTL ? 'rtl' : 'ltr'}>
                  {t.masShvachInvestorExemptWarning}
                </div>
              ) : null}
            </div>
          )}

          {/* Custom dual-mode down-payment / mortgage-fraction slider — mortgage group only */}
          {group.id === 'mortgage' && (() => {
            const maxP  = params.buyerType === 'investor' ? 0.50 : 0.75
            const minDP = Math.ceil(params.Av0 * (1 - maxP) / 10_000) * 10_000
            const dpClamped = Math.max(minDP, Math.min(downPaymentAmount, params.Av0))
            return (
              <div className="mb-2">
                {/* Mode toggle — full width above slider */}
                <div className="flex text-xs gap-1 mb-1.5" dir="ltr">
                  <button
                    onClick={() => {
                      if (dpMode === 'fraction')
                        setDownPaymentAmount(Math.round((1 - params.p) * params.Av0 / 10_000) * 10_000)
                      setDpMode('amount')
                    }}
                    className={`px-3 py-0.5 rounded border transition-colors text-center ${
                      dpMode === 'amount'
                        ? 'bg-slate-600 text-white border-slate-600'
                        : 'bg-transparent text-[var(--c-muted)] border-[var(--c-toggle-border)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hover)]'
                    }`}
                  >
                    {t.dpModeAmount}
                  </button>
                  <button
                    onClick={() => setDpMode('fraction')}
                    className={`px-3 py-0.5 rounded border transition-colors text-center ${
                      dpMode === 'fraction'
                        ? 'bg-slate-600 text-white border-slate-600'
                        : 'bg-transparent text-[var(--c-muted)] border-[var(--c-toggle-border)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hover)]'
                    }`}
                  >
                    {t.dpModeFraction}
                  </button>
                </div>

                {dpMode === 'amount' ? (
                  <>
                    <SliderRow
                      label={t.downPaymentCard}
                      tooltip={params.buyerType === 'investor' ? t.tooltips.pInvestor : t.tooltips.pSingle}
                      min={minDP}
                      max={params.Av0}
                      step={10_000}
                      value={dpClamped}
                      displayValue={shekel(dpClamped)}
                      onChange={(v) => {
                        const rounded = Math.round(v / 10_000) * 10_000
                        setDownPaymentAmount(rounded)
                        update('p', Math.min(1 - rounded / params.Av0, maxP))
                      }}
                      isRTL={isRTL}
                      accentColor={palette.apt}
                    />
                    <p className="text-xs text-[var(--c-muted)] italic mt-0.5" dir={isRTL ? 'rtl' : 'ltr'}>
                      {t.dpDerivedFraction(pct(params.p, 0))}
                    </p>
                  </>
                ) : (
                  <>
                    <SliderRow
                      label={t.pLabel}
                      tooltip={params.buyerType === 'investor' ? t.tooltips.pInvestor : t.tooltips.pSingle}
                      min={0}
                      max={maxP}
                      step={0.01}
                      value={params.p}
                      displayValue={pct(params.p, 0)}
                      onChange={(v) => update('p', v)}
                      isRTL={isRTL}
                      accentColor={palette.apt}
                    />
                    <p className="text-xs text-[var(--c-muted)] italic mt-0.5" dir={isRTL ? 'rtl' : 'ltr'}>
                      {t.dpDerivedAmount(shekel(Math.round((1 - params.p) * params.Av0 / 10_000) * 10_000))}
                    </p>
                  </>
                )}

                {dpAdjustedNote && (
                  <p className="text-[10px] text-amber-500 mt-0.5" dir={isRTL ? 'rtl' : 'ltr'}>
                    {t.dpAdjustedToMin}
                  </p>
                )}
              </div>
            )
          })()}

          <div className="flex flex-col divide-y divide-[var(--c-border)]">
            {group.sliders
              .filter(s =>
                !(group.id === 'costs'    && s.key === 'Av0') &&
                !(group.id === 'mortgage' && s.key === 'p')
              )
              .map((def) => (
              <div key={def.key}>
                <SliderRow
                  label={def.getLabel(t, params[def.key] as number)}
                  tooltip={def.getTooltip(t)}
                  min={def.min}
                  max={def.max}
                  step={def.step}
                  value={params[def.key] as number}
                  displayValue={def.display(params[def.key] as number, t, isRTL)}
                  onChange={(v) => update(def.key, v as never)}
                  isRTL={isRTL}
                  accentColor={group.id === 'passive' ? palette.pas : palette.apt}
                />
                {def.key === 'mortgageRate' && boiRate != null && (
                  <p className="text-xs text-[var(--c-muted)] mt-0.5 pb-0.5" dir={isRTL ? 'rtl' : 'ltr'}>
                    {t.primeHelperLine(pct(boiRate, 2))}
                  </p>
                )}
                {def.key === 'Im' && (
                  <p className="text-xs text-[var(--c-muted)] mt-0.5 pb-0.5" dir={isRTL ? 'rtl' : 'ltr'}>
                    {t.prepaymentFeeThresholdNote(thresholdPct)}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Cost breakdown — inside At Purchase (mobile only; desktop shows it in the summary bar) */}
          {group.id === 'costs' && !continuous && (
            <div className="mt-3 pt-3 border-t border-[var(--c-border)] text-xs text-[var(--c-muted)] flex flex-col gap-1" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="flex justify-between text-[var(--c-text-3)] font-medium">
                <span>{t.costsLiveEp}</span>
                <span className="text-[var(--c-text)] tabular-nums">{shekel(results.Ep)}</span>
              </div>
              <div className="flex justify-between ps-2">
                <span className="flex items-center gap-1">{t.downPaymentCard}<InfoTooltip text={t.downPaymentTooltip} /></span>
                <span className="tabular-nums">{shekel(results.S0)}</span>
              </div>

              <div className="flex justify-between ps-2">
                <span>{t.costsLiveTp}</span>
                <span className="tabular-nums">{shekel(results.Tp)}</span>
              </div>
              <div className="flex justify-between ps-2">
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
