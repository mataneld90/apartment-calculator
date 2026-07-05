'use client'
import { useState, useEffect, useCallback, useRef, ReactNode } from 'react'

export type TourStep = {
  target: string | null          // data-tour value to spotlight, or null = centered card, no hole
  title: string
  body: ReactNode
  chartView?: 'gains' | 'diff' | 'irr' | 'cashflow'
  chartSubView?: 'rentmort' | 'bars'
}

type Rect = { x: number; y: number; w: number; h: number }

const PAD = 8

// Both the mobile and desktop layouts render the same anchors, so a data-tour
// value appears twice in the DOM. Pick the one that's actually visible.
function visibleTarget(name: string): HTMLElement | null {
  const els = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`))
  return els.find(el => el.offsetParent !== null || el.getClientRects().length > 0) ?? els[0] ?? null
}

// Nearest ancestor that scrolls vertically (the mobile sliders live in one).
function scrollParent(el: HTMLElement): HTMLElement | null {
  let p = el.parentElement
  while (p) {
    if (/(auto|scroll)/.test(getComputedStyle(p).overflowY)) return p
    p = p.parentElement
  }
  return null
}

// A target taller than its scrollport can never be fully on screen; its raw
// bounding box would spotlight the neighbors it's clipped behind. Intersect
// the rect with every clipping ancestor so the hole hugs the VISIBLE part.
function visibleRect(el: HTMLElement): { x1: number; y1: number; x2: number; y2: number } {
  const r = el.getBoundingClientRect()
  let x1 = r.left, y1 = r.top, x2 = r.right, y2 = r.bottom
  let p = el.parentElement
  while (p) {
    const s = getComputedStyle(p)
    if (/(auto|scroll|hidden|clip)/.test(s.overflowY) || /(auto|scroll|hidden|clip)/.test(s.overflowX)) {
      const pr = p.getBoundingClientRect()
      x1 = Math.max(x1, pr.left); y1 = Math.max(y1, pr.top)
      x2 = Math.min(x2, pr.right); y2 = Math.min(y2, pr.bottom)
    }
    p = p.parentElement
  }
  return { x1, y1, x2: Math.max(x1, x2), y2: Math.max(y1, y2) }
}

export default function Tour({ open, steps, index, onNext, onPrev, onClose, isRTL, onToggleLang, langToggleLabel }: {
  open: boolean
  steps: TourStep[]
  index: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
  isRTL: boolean
  onToggleLang?: () => void
  langToggleLabel?: string
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
    const { x1, y1, x2, y2 } = visibleRect(el)
    // Pad only the sides that were NOT clamped, so the ring never bleeds
    // onto whatever the target is clipped behind.
    const pT = y1 - r.top > 0.5 ? 0 : PAD
    const pB = r.bottom - y2 > 0.5 ? 0 : PAD
    const pL = x1 - r.left > 0.5 ? 0 : PAD
    const pR = r.right - x2 > 0.5 ? 0 : PAD
    setRect({ x: x1 - pL, y: y1 - pT, w: (x2 - x1) + pL + pR, h: (y2 - y1) + pT + pB })
  }, [])

  // On step change: locate the target, scroll it into view, then measure once
  // it settles (double rAF for layout, plus a timeout for the smooth scroll).
  useEffect(() => {
    if (!open) return
    if (!step?.target) { targetRef.current = null; setRect(null); return }
    const el = visibleTarget(step.target)
    targetRef.current = el
    if (!el) { setRect(null); return }
    // Tall targets (mobile panels) align to the top of the scrollport so the
    // header shows; anything that fits is centered as before.
    const sp = scrollParent(el)
    const tall = sp !== null && el.offsetHeight > sp.clientHeight - 24
    el.scrollIntoView({ block: tall ? 'start' : 'center', behavior: 'smooth' })
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

  // ESC exits the tour.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

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
        className="fixed rounded-lg border border-[var(--tour-card-border)] bg-[var(--tour-card-bg)] shadow-xl p-4"
        style={{ left: cardLeft, top: cardTop, width: CARD_W }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex justify-between items-start gap-2">
          <span className="font-semibold text-sm text-[var(--tour-card-text)]">{step.title}</span>
          <div className="flex items-center gap-2 shrink-0">
            {isFirst && onToggleLang && (
              <button
                onClick={onToggleLang}
                className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-600 text-xs font-medium hover:border-slate-400 hover:text-slate-900 transition-colors"
              >
                {langToggleLabel}
              </button>
            )}
            <button
              onClick={onClose}
              aria-label={isRTL ? 'סגירה' : 'Close'}
              className="text-slate-400 hover:text-slate-700 leading-none text-base px-1 shrink-0"
            >✕</button>
          </div>
        </div>

        <div className="text-sm text-[var(--tour-card-muted)] leading-relaxed mt-2">{step.body}</div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-500 select-none" dir="ltr">{index + 1} / {steps.length}</span>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="px-3 py-1 rounded border border-slate-300 text-slate-600 text-xs font-medium hover:text-slate-900 hover:border-slate-400 transition-colors"
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
