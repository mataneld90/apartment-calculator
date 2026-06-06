import InfoTooltip from './InfoTooltip'

interface TaxToggleProps {
  label: string
  tooltip?: string
  value: string
  options: { value: string; label: string; tooltip?: string }[]
  onChange: (v: string) => void
}

export default function TaxToggle({ label, tooltip, value, options, onChange }: TaxToggleProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="flex items-center gap-1 text-sm text-[var(--c-text-3)] shrink-0">
        {label}{tooltip && <InfoTooltip text={tooltip} />}
      </span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded border transition-colors ${
              value === opt.value
                ? 'bg-slate-600 text-white border-slate-600'
                : 'bg-transparent text-[var(--c-muted)] border-[var(--c-border)] hover:text-[var(--c-text)] hover:border-[var(--c-border-hover)]'
            }`}
          >
            {opt.label}
            {opt.tooltip && <InfoTooltip text={opt.tooltip} />}
          </button>
        ))}
      </div>
    </div>
  )
}
