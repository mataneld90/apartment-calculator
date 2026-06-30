'use client'

import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react'

interface EditConfig {
  fromStored: (v: number) => number  // stored value → input number (e.g. v*100 for %)
  toStored: (n: number) => number    // input number → stored value
  decimals: number
  prefix?: string  // shown before input (₪)
  suffix?: string  // shown after input (%)
  inputSize: number  // input width in ch
}

function EditableValue({ displayNode, rawValue, min, max, config, onCommit }: {
  displayNode: ReactNode
  rawValue: number
  min: number
  max: number
  config: EditConfig
  onCommit: (v: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    const n = config.fromStored(rawValue)
    setDraft(config.decimals === 0
      ? String(Math.round(n))
      : parseFloat(n.toFixed(config.decimals)).toString()
    )
    setEditing(true)
  }

  useEffect(() => { if (editing) inputRef.current?.select() }, [editing])

  function commit() {
    const n = parseFloat(draft)
    if (!isNaN(n)) {
      const stored = Math.min(max, Math.max(min, config.toStored(n)))
      if (stored !== rawValue) onCommit(stored)
    }
    setEditing(false)
  }

  if (!editing) {
    return (
      <span onClick={startEdit} className="cursor-text border-b border-dashed border-[var(--c-muted)]">
        {displayNode}
      </span>
    )
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 1 }} dir="ltr">
      {config.prefix && <span>{config.prefix}</span>}
      <input
        ref={inputRef}
        inputMode="decimal"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); commit() }
          if (e.key === 'Escape') setEditing(false)
        }}
        style={{
          background: 'transparent', border: 'none', borderBottom: '1px solid currentColor',
          outline: 'none', fontSize: 'inherit', color: 'inherit', fontFamily: 'inherit',
          fontVariantNumeric: 'tabular-nums', padding: 0, width: `${config.inputSize}ch`,
        }}
      />
      {config.suffix && <span>{config.suffix}</span>}
    </span>
  )
}
import type { Params } from '@/lib/types'
import { DEFAULT_PARAMS, purchaseTaxInvestor, purchaseTaxSingle, BOI_RATE } from '@/lib/model'
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
  editConfig: EditConfig
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
        display: (v) => pct(v, 2),
        editConfig: { fromStored: v => v * 100, toStored: n => n / 100, decimals: 2, suffix: '%', inputSize: 5 },
      },
      {
        key: 'R0',
        getLabel: (t) => t.r0Label,
        getTooltip: (t) => t.tooltips.R0,
        min: 0, max: 15_000, step: 100,
        display: (v) => shekel(v),
        editConfig: { fromStored: v => v, toStored: n => n, decimals: 0, prefix: '₪', inputSize: 5 },
      },
      {
        // live-in only (filtered out otherwise): the rent you'd otherwise pay elsewhere
        key: 'liveInRent',
        getLabel: (t) => t.liveInRentLabel,
        getTooltip: (t) => t.liveInRentTooltip,
        min: 0, max: 15_000, step: 100,
        display: (v) => shekel(v),
        editConfig: { fromStored: v => v, toStored: n => n, decimals: 0, prefix: '₪', inputSize: 5 },
      },
      {
        key: 'Ri',
        getLabel: (t) => t.riLabel,
        getTooltip: (t) => t.riTooltip,
        min: 0, max: 0.1, step: 0.005,
        display: (v) => pct(v, 2),
        editConfig: { fromStored: v => v * 100, toStored: n => n / 100, decimals: 2, suffix: '%', inputSize: 5 },
      },
      {
        key: 'maintenanceRate',
        getLabel: (t) => t.maintenanceRateLabel,
        getTooltip: (t) => t.maintenanceRateTooltip,
        min: 0, max: 0.15, step: 0.005,
        display: (v) => pct(v, 2),
        editConfig: { fromStored: v => v * 100, toStored: n => n / 100, decimals: 2, suffix: '%', inputSize: 5 },
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
        editConfig: { fromStored: v => v * 100, toStored: n => n / 100, decimals: 0, suffix: '%', inputSize: 2 },
      },
      {
        key: 'Y',
        getLabel: (t) => t.yLabel,
        getTooltip: () => '',
        min: 5, max: 30, step: 1,
        display: (v, t, isRTL) => isRTL
          ? <span style={{display:'inline-flex',flexDirection:'row',gap:'0.25em'}}><span>{t.yearWord}</span><span>{v}</span></span>
          : t.yearDisplay(v),
        editConfig: { fromStored: v => v, toStored: n => n, decimals: 0, inputSize: 2 },
      },
      {
        key: 'mortgageRate',
        getLabel: (t) => t.mortgageRateLabel,
        getTooltip: (t) => t.mortgageRateTooltip,
        min: 0.02, max: 0.10, step: 0.0005,
        display: (v) => pct(v, 2),
        editConfig: { fromStored: v => v * 100, toStored: n => n / 100, decimals: 2, suffix: '%', inputSize: 5 },
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
        editConfig: { fromStored: v => v, toStored: n => n, decimals: 0, prefix: '₪', inputSize: 7 },
      },
      {
        key: 'purchaseCostsRate',
        getLabel: (t) => t.purchaseCostsRateLabel,
        getTooltip: (t) => t.tooltips.purchaseCostsRate,
        min: 0, max: 0.15, step: 0.005,
        display: (v) => pct(v, 2),
        editConfig: { fromStored: v => v * 100, toStored: n => n / 100, decimals: 2, suffix: '%', inputSize: 5 },
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
        display: (v) => pct(v, 2),
        editConfig: { fromStored: v => v * 100, toStored: n => n / 100, decimals: 2, suffix: '%', inputSize: 5 },
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
        display: (v, t, rtl) => rtl ? pct(v, 2) : pct(v, 2) + ' ' + t.perYear,
        editConfig: { fromStored: v => v * 100, toStored: n => n / 100, decimals: 2, suffix: '%', inputSize: 5 },
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
  editConfig?: EditConfig
}

function SliderRow({ label, tooltip, min, max, step, value, displayValue, onChange, isRTL, accentColor, editConfig }: SliderRowProps) {
  const valueNode = editConfig ? (
    <EditableValue
      displayNode={displayValue}
      rawValue={value}
      min={min}
      max={max}
      config={editConfig}
      onCommit={onChange}
    />
  ) : displayValue
  return (
    <div className="flex items-center gap-2 py-2 lg:py-0.5 min-w-0">
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
      <span className="text-xs text-[var(--c-text)] w-20 text-right shrink-0 tabular-nums whitespace-nowrap" dir="ltr">
        {valueNode}
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
  dpMode: 'amount' | 'fraction'
  onDpModeChange: (m: 'amount' | 'fraction') => void
}

export default function Sliders({ params, update, results, t, isRTL, only, palette, continuous, dpMode, onDpModeChange }: Props) {
  const visibleGroups = useMemo(
    () => only
      ? only.map(id => GROUPS.find(g => g.id === id)).filter((g): g is typeof GROUPS[0] => g !== undefined)
      : GROUPS,
    [only]
  )

  // ── Down-payment dual-input mode ─────────────────────────────────────────
  const [downPaymentAmount, setDownPaymentAmount] = useState(() =>
    Math.round((1 - params.p) * params.Av0 / 25_000) * 25_000
  )

  const dpModeRef = useRef(dpMode)
  dpModeRef.current = dpMode
  const dpAmountRef = useRef(downPaymentAmount)
  dpAmountRef.current = downPaymentAmount
  const prevAv0Ref = useRef(params.Av0)
  const prevBuyerTypeRef = useRef(params.buyerType)

  // Amount mode only: when price/buyerType changes, keep ₪ fixed; clamp up to legal minimum
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const av0Changed = params.Av0 !== prevAv0Ref.current
    const btChanged  = params.buyerType !== prevBuyerTypeRef.current
    prevAv0Ref.current       = params.Av0
    prevBuyerTypeRef.current = params.buyerType

    if (dpModeRef.current !== 'amount' || (!av0Changed && !btChanged)) return

    const maxP   = params.buyerType === 'investor' ? 0.50 : 0.75
    const minDP  = params.Av0 * (1 - maxP)
    const effDP  = Math.min(Math.max(dpAmountRef.current, minDP), params.Av0)

    if (effDP !== dpAmountRef.current) setDownPaymentAmount(effDP)
    update('p', 1 - effDP / params.Av0)
  }, [params.Av0, params.buyerType])


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

          {/* Occupancy toggle — top of THE APARTMENT, governs how rent is framed */}
          {group.id === 'apartment' && (
            <div className="mb-3">
              <TaxToggle
                label={t.occupancyLabel}
                isRTL={isRTL}
                value={params.occupancy}
                options={[
                  { value: 'rentout', label: t.occupancyRentOut, tooltip: t.tooltips.occupancyRentOut },
                  { value: 'livein', label: t.occupancyLiveIn, tooltip: t.tooltips.occupancyLiveIn },
                ]}
                onChange={(v) => update('occupancy', v as Params['occupancy'])}
              />
            </div>
          )}

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
                  editConfig={av0.editConfig}
                />
              </div>
            )
          })()}

          {/* Purchase tax toggle — inside At Purchase */}
          {group.id === 'costs' && (
            <div className="mb-3">
              <TaxToggle
                label={t.purchaseTaxLabel}
                isRTL={isRTL}
                value={params.buyerType}
                options={[
                  { value: 'single', label: t.firstApt, tooltip: t.tooltips.buyerTypeSingle },
                  { value: 'investor', label: t.investor8, tooltip: t.tooltips.buyerTypeInvestor },
                ]}
                onChange={(v) => {
                  const newType = v as Params['buyerType']
                  update('buyerType', newType)
                  if (newType === 'investor' && params.p > 0.50) update('p', 0.50)
                  update('masShvach', newType === 'single' ? 'exempt' : '25%')
                }}
              />
            </div>
          )}

          {/* מס שבח toggle — inside At Sale, before sliders */}
          {group.id === 'selling' && (
            <div className="mb-3 flex flex-col gap-2">
              <TaxToggle
                label={t.masShvachLabel}
                isRTL={isRTL}
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
            const maxP    = params.buyerType === 'investor' ? 0.50 : 0.75
            const minDP   = Math.ceil(params.Av0 * (1 - maxP) / 25_000) * 25_000
            const dpClamped = Math.max(minDP, Math.min(downPaymentAmount, params.Av0))
            return (
              <div className="mb-2">
                {/* Mode toggle — full width above slider */}
                <div className={`flex text-xs gap-1 mb-1.5${isRTL ? ' justify-end' : ''}`} dir="ltr">
                  {(isRTL ? ['fraction', 'amount'] as const : ['amount', 'fraction'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        if (mode === 'amount' && dpMode === 'fraction')
                          setDownPaymentAmount(Math.round((1 - params.p) * params.Av0 / 25_000) * 25_000)
                        onDpModeChange(mode)
                      }}
                      className={`px-3 py-0.5 rounded border transition-colors text-center ${
                        dpMode === mode
                          ? 'bg-slate-600 text-white border-slate-600'
                          : 'bg-transparent text-[var(--c-muted)] border-[var(--c-toggle-border)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hover)]'
                      }`}
                    >
                      {mode === 'amount' ? t.dpModeAmount : t.dpModeFraction}
                    </button>
                  ))}
                </div>

                {dpMode === 'amount' ? (
                  <>
                    <SliderRow
                      label={t.downPaymentCard}
                      tooltip={params.buyerType === 'investor' ? t.tooltips.pInvestor : t.tooltips.pSingle}
                      min={minDP}
                      max={params.Av0}
                      step={25_000}
                      value={dpClamped}
                      displayValue={shekel(dpClamped)}
                      onChange={(v) => {
                        setDownPaymentAmount(v)
                        update('p', Math.min(1 - v / params.Av0, maxP))
                      }}
                      isRTL={isRTL}
                      accentColor={palette.apt}
                      editConfig={{ fromStored: v => v, toStored: n => Math.round(n / 25_000) * 25_000, decimals: 0, prefix: '₪', inputSize: 7 }}
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
                      editConfig={{ fromStored: v => v * 100, toStored: n => n / 100, decimals: 0, suffix: '%', inputSize: 2 }}
                    />
                    <p className="text-xs text-[var(--c-muted)] italic mt-0.5" dir={isRTL ? 'rtl' : 'ltr'}>
                      {t.dpDerivedAmount(shekel(Math.round((1 - params.p) * params.Av0 / 25_000) * 25_000))}
                    </p>
                  </>
                )}

              </div>
            )
          })()}

          <div className="flex flex-col divide-y divide-[var(--c-border)]">
            {group.sliders
              .filter(s =>
                !(group.id === 'costs'    && s.key === 'Av0') &&
                !(group.id === 'mortgage' && s.key === 'p') &&
                !(group.id === 'mortgage' && s.key === 'mortgageRate') &&
                !(s.key === 'liveInRent' && params.occupancy !== 'livein')
              )
              .map((def) => {
              // Live-in mode: R0 is reframed as the apartment's market rent (maintenance basis);
              // the rent you avoid is the separate liveInRent slider. Math reflects the split.
              const liveIn = params.occupancy === 'livein'
              const liveInLabel = liveIn && def.key === 'R0' ? t.r0LabelLiveIn : undefined
              const liveInTooltip = !liveIn ? undefined
                : def.key === 'R0' ? t.tooltips.R0LiveIn
                : def.key === 'maintenanceRate' ? t.maintenanceRateTooltipLiveIn
                : undefined
              return (
              <div key={def.key}>
                <SliderRow
                  label={liveInLabel ?? def.getLabel(t, params[def.key] as number)}
                  tooltip={liveInTooltip ?? def.getTooltip(t)}
                  min={def.min}
                  max={def.max}
                  step={def.step}
                  value={params[def.key] as number}
                  displayValue={def.display(params[def.key] as number, t, isRTL)}
                  onChange={(v) => update(def.key, v as never)}
                  isRTL={isRTL}
                  accentColor={group.id === 'passive' ? palette.pas : palette.apt}
                  editConfig={def.editConfig}
                />
              </div>
            )})}
          </div>

          {group.id === 'mortgage' && (() => {
            const TRACK_ROWS = [
              { label: t.trackPrimeLabel, shareKey: 'trackPrimeShare', rateKey: 'trackPrimeRate', exempt: true,  tooltip: t.trackPrimeTooltip(pct(BOI_RATE, 2), pct(BOI_RATE + 0.015, 2)) },
              { label: t.trackFixedLabel, shareKey: 'trackFixedShare', rateKey: 'trackFixedRate', exempt: false, tooltip: undefined },
              { label: t.trackVarLabel,   shareKey: 'trackVarShare',   rateKey: 'trackVarRate',   exempt: false, tooltip: undefined },
            ] as const
            const shareSum = params.trackPrimeShare + params.trackFixedShare + params.trackVarShare
            const sumOff = Math.abs(shareSum - 1) > 0.005
            return (
              <div className="mt-2 pt-2 border-t border-[var(--c-border)]">
                {/* Rate-input mode toggle on top — governs the single slider vs the per-track rows below */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm text-[var(--c-text-3)] flex-1" dir={isRTL ? 'rtl' : 'ltr'}>{t.mortgageRateSectionTitle}</span>
                  {(['simple', 'advanced'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => update('mortgageMode', m)}
                      className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded border transition-colors ${
                        params.mortgageMode === m
                          ? 'bg-slate-600 text-white border-slate-600'
                          : 'bg-transparent text-[var(--c-muted)] border-[var(--c-toggle-border)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hover)]'
                      }`}
                    >
                      {m === 'simple' ? t.mortgageModeSimple : t.mortgageModeAdvanced}
                      <InfoTooltip text={m === 'simple' ? t.mortgageModeSimpleTooltip : t.mortgageModeAdvancedTooltip} />
                    </button>
                  ))}
                </div>

                {params.mortgageMode === 'simple' ? (
                  <div>
                    <SliderRow
                      label={t.mortgageRateLabel}
                      tooltip={t.mortgageRateTooltip}
                      min={0.02}
                      max={0.10}
                      step={0.0005}
                      value={params.mortgageRate}
                      displayValue={pct(params.mortgageRate, 2)}
                      onChange={(v) => update('mortgageRate', v)}
                      isRTL={isRTL}
                      accentColor={palette.apt}
                      editConfig={{ fromStored: v => v * 100, toStored: n => n / 100, decimals: 2, suffix: '%', inputSize: 5 }}
                    />
                    <p className="text-xs text-[var(--c-muted)] mt-0.5 pb-0.5" dir={isRTL ? 'rtl' : 'ltr'}>
                      {t.singleRateHint}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5" dir={isRTL ? 'rtl' : 'ltr'}>
                    {/* Column headers */}
                    <div className="flex items-center gap-2 text-[11px] text-[var(--c-muted)]">
                      <span className="flex-1" />
                      <span className="w-14 text-center shrink-0">{t.trackShareHeader}</span>
                      <span className="w-14 text-center shrink-0">{t.trackRateHeader}</span>
                    </div>
                    {TRACK_ROWS.map((row) => (
                      <div key={row.shareKey} className="flex items-center gap-2">
                        <span className="text-xs text-[var(--c-text-3)] leading-tight flex-1 min-w-0 flex items-center gap-1">
                          {row.label}
                          {row.tooltip && <InfoTooltip text={row.tooltip} />}
                        </span>
                        <span className="w-14 text-center shrink-0 text-xs text-[var(--c-text)] tabular-nums" dir="ltr">
                          <EditableValue
                            displayNode={<bdi>{pct(params[row.shareKey] as number, 0)}</bdi>}
                            rawValue={params[row.shareKey] as number}
                            min={0}
                            max={1}
                            config={{ fromStored: v => v * 100, toStored: n => n / 100, decimals: 0, suffix: '%', inputSize: 3 }}
                            onCommit={(v) => update(row.shareKey, v as never)}
                          />
                        </span>
                        <span className="w-14 text-center shrink-0 text-xs text-[var(--c-text)] tabular-nums" dir="ltr">
                          <EditableValue
                            displayNode={<bdi>{pct(params[row.rateKey] as number, 2)}</bdi>}
                            rawValue={params[row.rateKey] as number}
                            min={0}
                            max={0.12}
                            config={{ fromStored: v => v * 100, toStored: n => n / 100, decimals: 2, suffix: '%', inputSize: 5 }}
                            onCommit={(v) => update(row.rateKey, v as never)}
                          />
                        </span>
                      </div>
                    ))}
                    <p className={`text-[11px] mt-0.5 ${sumOff ? 'text-amber-500' : 'text-[var(--c-muted)]'}`}>
                      {sumOff ? t.trackSumWarning(pct(shareSum, 0)) : t.trackSumOk(pct(shareSum, 0))}
                    </p>
                  </div>
                )}
              </div>
            )
          })()}

          {group.id === 'selling' && (
            <div className="mt-2 pt-2 border-t border-[var(--c-border)]">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-sm text-[var(--c-text-3)]">{t.prepaymentFeeTooltipLabel}</span>
                <InfoTooltip text={t.prepaymentScenarioTooltip} />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-[var(--c-text-3)] leading-tight flex-1 min-w-0" dir={isRTL ? 'rtl' : 'ltr'}>
                  {t.prepaymentGapLabel}
                </span>
                <input
                  type="range"
                  min={0}
                  max={0.03}
                  step={0.0025}
                  value={params.scenarioDelta}
                  onChange={(e) => update('scenarioDelta', Number(e.target.value))}
                  className="w-24 h-1 shrink-0"
                  style={{
                    ...(isRTL ? { transform: 'scaleX(-1)' } : {}),
                    accentColor: palette.apt,
                  }}
                />
                <span className="text-xs text-[var(--c-text)] w-12 text-right shrink-0 tabular-nums" dir="ltr">
                  <EditableValue
                    displayNode={<bdi>{pct(params.scenarioDelta, 2)}</bdi>}
                    rawValue={params.scenarioDelta}
                    min={0}
                    max={0.03}
                    config={{ fromStored: v => v * 100, toStored: n => n / 100, decimals: 2, suffix: '%', inputSize: 4 }}
                    onCommit={(v) => update('scenarioDelta', v)}
                  />
                </span>
              </div>
            </div>
          )}

          {/* Cost breakdown — inside At Purchase (mobile only; desktop shows it in the summary bar) */}
          {group.id === 'passive' && (
            <p className="text-xs text-[var(--c-muted)] mt-2" dir={isRTL ? 'rtl' : 'ltr'}>{t.cgtNote}</p>
          )}

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
