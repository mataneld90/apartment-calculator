'use client'
import { useState, useEffect, useCallback, useRef, ReactNode } from 'react'

export type TourStep = {
  target: string | null          // data-tour value to spotlight, or null = centered card, no hole
  title: string
  body: ReactNode
  chartView?: 'gains' | 'diff' | 'irr' | 'cashflow'
}

type Rect = { x: number; y: number; w: number; h: number }

const PAD = 8

// Both the mobile and desktop layouts render the same anchors, so a data-tour
// value appears twice in the DOM. Pick the one that's actually visible.
function visibleTarget(name: string): HTMLElement | null {
  const els = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`))
  return els.find(el => el.offsetParent !== null || el.getClientRects().length > 0) ?? els[0] ?? null
}

export default function Tour({ open, steps, index, onNext, onPrev, onClose, isRTL }: {
  open: boolean
  steps: TourStep[]
  index: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
  isRTL: boolean
}) {
  const [rect, setRect] = useState<Rect | null>(null)
  const targetRef = useRef<HTMLElement | null>(null)
  const step = steps[index]

  // Re-read the current target's box WITHOUT scrolling (used on scroll/resize so
  // the hole tracks live; scrolling here would recurse with scrollIntoView).
  const readRect = useCallback(() => {
    const el = targetRef.current
    if (!el) { setRect(null); return }
    const r = el.getBoundingClientRect()
    setRect({ x: r.left - PAD, y: r.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 })
  }, [])

  // On step change: locate the target, scroll it into view, then measure once
  // it settles (double rAF for layout, plus a timeout for the smooth scroll).
  useEffect(() => {
    if (!open) return
    if (!step?.target) { targetRef.current = null; setRect(null); return }
    const el = visibleTarget(step.target)
    targetRef.current = el
    if (!el) { setRect(null); return }
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    const raf = requestAnimationFrame(() => requestAnimationFrame(readRect))
    const settle = setTimeout(readRect, 420)
    return () => { cancelAnimationFrame(raf); clearTimeout(settle) }
  }, [open, index, step, readRect])

  // Keep the hole aligned while anything scrolls or the window resizes.
  useEffect(() => {
    if (!open) return
    const onWin = () => readRect()
    window.addEventListener('resize', onWin)
    window.addEventListener('scroll', onWin, true)
    return () => {
      window.removeEventListener('resize', onWin)
      window.removeEventListener('scroll', onWin, true)
    }
  }, [open, readRect])

  if (!open || !step) return null

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768
  const CARD_W = Math.min(340, vw - 24)

  let cardLeft: number
  let cardTop: number
  if (!rect) {
    cardLeft = (vw - CARD_W) / 2
    cardTop = Math.max(24, vh / 2 - 110)
  } else {
    const below = rect.y + rect.h + 14
    const roomBelow = vh - below
    // Below the target when there's room, otherwise above it.
    cardTop = roomBelow > 210 ? below : Math.max(14, rect.y - 14 - 210)
    cardLeft = Math.min(Math.max(12, rect.x + rect.w / 2 - CARD_W / 2), vw - CARD_W - 12)
  }

  const isLast = index === steps.length - 1
  const isFirst = index === 0

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Dim + single spotlight hole via an SVG mask (one shared mask so overlapping
          highlights would never double-darken; today each step has one hole). */}
      <svg className="fixed inset-0" width="100%" height="100%" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {rect && (
              <rect className="tour-hole" x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={10} fill="black" />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.62)" mask="url(#tour-mask)" />
      </svg>

      {rect && (
        <div
          className="tour-ring"
          style={{ position: 'fixed', left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderRadius: 10 }}
        />
      )}

      <div
        className="fixed rounded-lg border border-[var(--c-border)] bg-[var(--bg-page)] shadow-xl p-4"
        style={{ left: cardLeft, top: cardTop, width: CARD_W }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex justify-between items-start gap-2">
          <span className="font-semibold text-sm text-[var(--c-text)]">{step.title}</span>
          <button
            onClick={onClose}
            aria-label={isRTL ? 'סגירה' : 'Close'}
            className="text-[var(--c-muted)] hover:text-[var(--c-text)] leading-none text-base px-1 shrink-0"
          >✕</button>
        </div>

        <div className="text-sm text-[var(--c-muted)] leading-relaxed mt-2">{step.body}</div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400 select-none" dir="ltr">{index + 1} / {steps.length}</span>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="px-3 py-1 rounded border border-[var(--c-toggle-border)] text-[var(--c-muted)] text-xs font-medium hover:text-[var(--c-text)] hover:border-[var(--c-border-hover)] transition-colors"
              >
                {isRTL ? 'הקודם' : 'Back'}
              </button>
            )}
            <button
              onClick={isLast ? onClose : onNext}
              className="px-3 py-1 rounded bg-slate-600 text-white text-xs font-medium hover:bg-slate-500 transition-colors"
            >
              {isLast ? (isRTL ? 'סיום' : 'Done') : (isRTL ? 'הבא' : 'Next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
