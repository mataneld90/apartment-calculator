export default function InfoTooltip({ text }: { text: string }) {
  if (!text) return null
  return (
    <span className="relative group inline-flex shrink-0 items-center">
      <svg
        width="13" height="13" viewBox="0 0 20 20" fill="#0891b2"
        className="cursor-help opacity-70 hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        <path fillRule="evenodd" clipRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        />
      </svg>
      <span className="absolute bottom-full left-0 rtl:left-auto rtl:right-0 mb-2 w-56 bg-[var(--tooltip-bg)] border border-[var(--tooltip-border)] text-[var(--c-text-2)] text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none leading-relaxed shadow-lg backdrop-blur-sm">
        {text}
      </span>
    </span>
  )
}
