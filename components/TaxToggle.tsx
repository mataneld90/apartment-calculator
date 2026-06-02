interface TaxToggleProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}

export default function TaxToggle({ label, value, options, onChange }: TaxToggleProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-[var(--c-text-3)] shrink-0">{label}</span>
      <div className="flex rounded overflow-hidden border border-[var(--c-border)]">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1 text-xs font-medium transition-colors ${
              value === opt.value
                ? 'bg-blue-600 text-white'
                : 'bg-[var(--bg-control)] text-[var(--c-text-3)] hover:text-[var(--c-text)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
