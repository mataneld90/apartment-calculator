'use client'
import { useState, useRef } from 'react'

export default function InfoTooltip({ text }: { text: string }) {
  if (!text) return null
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const ref = useRef<SVGSVGElement>(null)

  function show() {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    // Clamp left so tooltip (w-56 = 224px) doesn't overflow viewport
    const left = Math.min(r.left, window.innerWidth - 240)
    setPos({ top: r.top, left: Math.max(4, left) })
  }

  return (
    <span className="inline-flex shrink-0 items-center">
      <svg
        ref={ref}
        width="13" height="13" viewBox="0 0 20 20" fill="currentColor"
        className="cursor-help opacity-70 hover:opacity-100 transition-opacity"
        aria-hidden="true"
        onMouseEnter={show}
        onMouseLeave={() => setPos(null)}
      >
        <path fillRule="evenodd" clipRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        />
      </svg>
      {pos && (
        <span
          style={{
            position: 'fixed',
            top: pos.top - 8,
            left: pos.left,
            transform: 'translateY(-100%)',
            zIndex: 9999,
          }}
          className="w-56 bg-[var(--tooltip-bg)] border border-[var(--tooltip-border)] text-[var(--c-text-2)] text-xs rounded p-2 pointer-events-none leading-relaxed shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  )
}
