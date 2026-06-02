export default function InfoTooltip({ text }: { text: string }) {
  if (!text) return null
  return (
    <span className="relative group inline-flex shrink-0">
      <span className="text-slate-500 hover:text-slate-300 cursor-help text-xs select-none">ⓘ</span>
      <span className="absolute bottom-full left-0 rtl:left-auto rtl:right-0 mb-2 w-56 bg-slate-700/65 border border-slate-600 text-slate-200 text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none leading-relaxed shadow-lg backdrop-blur-sm">
        {text}
      </span>
    </span>
  )
}
