'use client'

import { useState, useMemo, useEffect } from 'react'
import { compute, DEFAULT_PARAMS } from '@/lib/model'
import type { Params } from '@/lib/types'
import { LANG, type Lang } from '@/lib/i18n'
import { getChartPalette } from '@/lib/colorPalette'
import { shekel } from '@/lib/formatters'
import dynamic from 'next/dynamic'
import Sliders from './Sliders'

const Chart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 360, marginTop: 16 }} className="bg-[var(--bg-panel)] rounded-lg animate-pulse" />
  ),
})

const SLIDER_GROUPS: string[] = ['costs', 'mortgage', 'apartment', 'selling', 'passive']

const BOI_CACHE_KEY = 'boiRateCache'
const BOI_CACHE_TTL = 7 * 24 * 60 * 60 * 1000

function readBoiCache(): number | null {
  try {
    const raw = localStorage.getItem(BOI_CACHE_KEY)
    if (!raw) return null
    const { rate, ts } = JSON.parse(raw)
    if (Date.now() - ts > BOI_CACHE_TTL) return null
    return typeof rate === 'number' ? rate : null
  } catch { return null }
}

function writeBoiCache(rate: number) {
  try { localStorage.setItem(BOI_CACHE_KEY, JSON.stringify({ rate, ts: Date.now() })) } catch {}
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function Calculator() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS)
  const [dpMode, setDpMode] = useState<'amount' | 'fraction'>('amount')
  const [boiRate, setBoiRate] = useState<number | null>(null)
  const [lang, setLang] = useState<Lang>('he')
  const [methodologyOpen, setMethodologyOpen] = useState(false)
  const [underTheHoodOpen, setUnderTheHoodOpen] = useState(false)
  const [methodologyPage, setMethodologyPage] = useState(1)
  const [methodologyPageVisible, setMethodologyPageVisible] = useState(true)
  const [isFirstVisitPanel, setIsFirstVisitPanel] = useState(false)
  const [diffHintReady, setDiffHintReady] = useState(false)
  const [showHowItWorksHint, setShowHowItWorksHint] = useState(false)
  const [isDark, setIsDark] = useState(() => { const h = new Date().getHours(); return h >= 19 || h < 7 })
  const palette = getChartPalette(false, isDark)
  const results = useMemo(() => compute(params), [params])
  const t = LANG[lang]
  const isRTL = lang === 'he'

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, isRTL])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
    }
  }, [isDark])

  // Fetch BOI rate on mount; use 7-day localStorage cache
  useEffect(() => {
    function applyRate(rate: number) {
      setBoiRate(rate)
      // Prime = Bank of Israel rate + 1.5% (standard Israeli definition). The single-rate default
      // marks that down 0.9pp to approximate a blended effective rate across all tracks.
      const prime = Math.round((rate + 0.015) * 10000) / 10000
      const derived = Math.round((rate + 0.015 - 0.009) * 10000) / 10000
      setParams(p => ({
        ...p,
        mortgageRate: derived,
        trackPrimeRate: prime,          // by-track prime = live prime rate
        trackFixedRate: derived,        // fixed/variable seeded to the blended rate as neutral starts
        trackVarRate: derived,
      }))
    }
    const cached = readBoiCache()
    if (cached !== null) { applyRate(cached); return }
    fetch('/api/boi-rate')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(({ rate }: { rate: number }) => { writeBoiCache(rate); applyRate(rate) })
      .catch(() => {})
  }, [])

  // Auto-open on first visit
  useEffect(() => {
    if (!localStorage.getItem('hasVisitedBefore')) {
      setMethodologyOpen(true)
      setIsFirstVisitPanel(true)
    }
  }, [])

  // Reset page to 1 whenever panel opens
  useEffect(() => {
    if (methodologyOpen) {
      setMethodologyPage(1)
      setMethodologyPageVisible(true)
    }
  }, [methodologyOpen])

  function goToMethodologyPage(newPage: number) {
    setMethodologyPageVisible(false)
    setTimeout(() => {
      setMethodologyPage(newPage)
      setMethodologyPageVisible(true)
    }, 150)
  }

  function markVisited() {
    localStorage.setItem('hasVisitedBefore', 'true')
  }

  function dismissPanel() {
    const isFirstVisit = !localStorage.getItem('hasVisitedBefore')
    markVisited()
    setMethodologyOpen(false)
    setIsFirstVisitPanel(false)
    if (isFirstVisit) {
      setDiffHintReady(true)
      setTimeout(() => {
        setShowHowItWorksHint(true)
        setTimeout(() => setShowHowItWorksHint(false), 2500)
      }, 300)
    }
  }

  function update<K extends keyof Params>(key: K, value: Params[K]) {
    markVisited()
    setParams((p) => ({ ...p, [key]: value }))
  }

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col bg-[var(--bg-page)] text-[var(--c-text)]" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Methodology modal */}
      {methodologyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={dismissPanel}
        >
          <div
            className="bg-[var(--bg-page)] border border-[var(--c-border)] rounded-lg p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm text-[var(--c-text)]">{t.methodologyTitle}</span>
              <div className="flex items-center gap-2">
                {isFirstVisitPanel && (
                  <button
                    onClick={() => setLang(l => l === 'en' ? 'he' : 'en')}
                    className="px-2 py-0.5 rounded bg-[var(--bg-control)] border border-[var(--c-border)] text-[var(--c-text-3)] text-xs font-medium hover:border-[var(--c-border-hover)] hover:text-[var(--c-text)] transition-colors"
                  >
                    {t.langToggle}
                  </button>
                )}
                <button
                  onClick={dismissPanel}
                  className="text-[var(--c-muted)] hover:text-[var(--c-text)] leading-none text-base px-1"
                >✕</button>
              </div>
            </div>

            {/* Content area */}
            <div
              className={`text-sm text-[var(--c-muted)] leading-relaxed mt-4 transition-opacity duration-200 ${methodologyPageVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              {lang === 'he'
                ? <MethodologyPageHE page={methodologyPage} />
                : <MethodologyPageEN page={methodologyPage} />
              }
            </div>

            {/* Navigation row — always dir="ltr" so ← is always left, → is always right */}
            <div className="mt-5 flex items-center justify-between" dir="ltr">
              <button
                onClick={() => goToMethodologyPage(isRTL ? methodologyPage + 1 : methodologyPage - 1)}
                disabled={isRTL ? methodologyPage === 3 : methodologyPage === 1}
                className="text-[var(--c-text-3)] hover:text-[var(--c-text)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-2xl leading-none px-2 py-1 select-none"
                aria-label={isRTL ? 'Next page' : 'Previous page'}
              >←</button>

              <div className="flex-1 flex flex-col items-center gap-1.5">
                {methodologyPage === 3 && (
                  <button
                    onClick={dismissPanel}
                    className="px-4 py-1.5 rounded bg-slate-600 text-white text-sm font-medium hover:bg-slate-500 transition-colors"
                  >
                    {isRTL ? 'הבנתי' : 'Got it'}
                  </button>
                )}
                <span className="text-sm text-slate-400 select-none" dir="ltr">
                  {isRTL ? `3 / ${methodologyPage}` : `${methodologyPage} / 3`}
                </span>
              </div>

              <button
                onClick={() => goToMethodologyPage(isRTL ? methodologyPage - 1 : methodologyPage + 1)}
                disabled={isRTL ? methodologyPage === 1 : methodologyPage === 3}
                className="text-[var(--c-text-3)] hover:text-[var(--c-text)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-2xl leading-none px-2 py-1 select-none"
                aria-label={isRTL ? 'Previous page' : 'Next page'}
              >→</button>
            </div>
          </div>
        </div>
      )}

      {/* Under the hood modal */}
      {underTheHoodOpen && (
        <UnderTheHoodModalCalc isRTL={isRTL} onClose={() => setUnderTheHoodOpen(false)} />
      )}

      {/* Header */}
      <header className="shrink-0 border-b border-[var(--c-border)] px-4 py-1.5 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="sm:flex-1 sm:min-w-0">
            <h1 className="text-sm sm:text-xl font-bold leading-tight">{t.title}</h1>
            <p className="hidden sm:block text-sm text-[var(--c-muted)] mt-1 max-w-2xl">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 sm:shrink-0 sm:flex-wrap sm:justify-end mt-1 sm:mt-0" dir={isRTL ? 'rtl' : 'ltr'}>
            <button onClick={() => setLang(l => l === 'en' ? 'he' : 'en')} className="px-2 py-0.5 sm:px-3 sm:py-1.5 rounded bg-[var(--bg-control)] border border-[var(--c-border)] text-[var(--c-text-3)] text-xs sm:text-sm font-medium hover:border-[var(--c-border-hover)] hover:text-[var(--c-text)] transition-colors">
              {t.langToggle}
            </button>
            <button
              onClick={() => setIsDark(d => !d)}
              className="px-2 py-0.5 sm:px-3 sm:py-1.5 sm:inline-flex sm:items-center rounded bg-[var(--bg-control)] border border-[var(--c-border)] text-[var(--c-text-3)] text-xs sm:text-sm font-medium hover:border-[var(--c-border-hover)] hover:text-[var(--c-text)] transition-colors"
            >
              {isDark ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <circle cx="12" cy="12" r="4" fill="#facc15" stroke="none" />
                  <path d="M12 2v2M12 20v2m-7.07-14.93 1.41 1.41m12.73 12.73 1.41 1.41M2 12h2m16 0h2m-14.14 7.07-1.41 1.41m15.56-15.56-1.41 1.41" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="#facc15" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setMethodologyOpen(true)}
              className={`px-2 py-0.5 sm:px-3 sm:py-1.5 rounded bg-[var(--bg-control)] border border-[var(--c-border)] text-[var(--c-text-3)] text-xs sm:text-sm font-medium hover:border-[var(--c-border-hover)] hover:text-[var(--c-text)] transition-colors${showHowItWorksHint ? ' hint-pulse' : ''}`}
              style={showHowItWorksHint ? {
                '--hint-glow-start': hexToRgba(palette.pas, 0.7),
                '--hint-glow-mid':   hexToRgba(palette.pas, 0.45),
                '--hint-glow-end':   hexToRgba(palette.pas, 0),
              } as React.CSSProperties : undefined}
            >
              {t.methodologyTitle}
            </button>
            <button
              onClick={() => setUnderTheHoodOpen(true)}
              className="px-2 py-0.5 sm:px-3 sm:py-1.5 rounded bg-[var(--bg-control)] border border-[var(--c-border)] text-[var(--c-text-3)] text-xs sm:text-sm font-medium hover:border-[var(--c-border-hover)] hover:text-[var(--c-text)] transition-colors"
            >
              {isRTL ? 'מאחורי הקלעים' : 'Under the hood'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile split layout — only visible below 1024px */}
      <div className="lg:hidden flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Top: chart fixed at ~48dvh */}
        <div className="shrink-0 h-[56dvh] overflow-hidden pt-0 px-3 pb-1.5">
          <div className="border border-[var(--c-border)] rounded-lg p-3 h-full" style={{ background: 'var(--chart-bg, var(--bg-panel))' }}>
            <Chart points={results.points} crossovers={results.crossovers} t={t} isRTL={isRTL} fill isDark={isDark} diffHintReady={diffHintReady} irrApartment={results.irrApartment} irrPassive={results.irrPassive} />
          </div>
        </div>
        {/* Summary bar */}
        <div className="shrink-0 mx-3 mb-1.5 bg-[var(--bg-panel)] border border-[var(--c-border)] rounded-lg px-3 py-1"
          style={isDark ? {} : { backgroundColor: 'var(--sidebar-group-bg)', borderColor: 'var(--sidebar-group-border)' }}>
          <div className="flex items-center gap-x-3 text-xs text-[var(--c-muted)]" dir={isRTL ? 'rtl' : 'ltr'}>
            <span>
              {t.costsLiveEp}:{' '}
              <span className="text-[var(--c-text)] font-medium tabular-nums">{shekel(results.Ep)}</span>
            </span>
            <span className="text-[var(--c-border)]" aria-hidden>·</span>
            <span>
              {t.downPaymentCard}:{' '}
              <span className="text-[var(--c-text-3)] tabular-nums">{shekel(results.S0)}</span>
            </span>
          </div>
        </div>
        {/* Bottom: sliders, independently scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 pt-1">
          <Sliders
            params={params} update={update} results={results} t={t} isRTL={isRTL}
            only={SLIDER_GROUPS}
            palette={palette}
            continuous
            boiRate={boiRate}
            dpMode={dpMode} onDpModeChange={setDpMode}
          />
        </div>
      </div>

      {/* Desktop two-column layout — ≥1024px */}
      <div className="hidden lg:flex flex-1 min-h-0 gap-4 px-4 py-4">

        {/* Left column: scrollable parameter inputs */}
        <aside
          className="w-[400px] shrink-0 overflow-y-auto sidebar-scroll rounded-lg"
          style={{ backgroundColor: 'var(--sidebar-area-bg)', padding: isDark ? 0 : '12px' }}
        >
          {isDark ? (
            <div className="bg-[var(--bg-panel)] border border-[var(--c-border)] rounded-lg p-4">
              <Sliders
                params={params} update={update} results={results} t={t} isRTL={isRTL}
                only={SLIDER_GROUPS}
                palette={palette}
                continuous
                dpMode={dpMode} onDpModeChange={setDpMode}
              />
            </div>
          ) : (
            <Sliders
              params={params} update={update} results={results} t={t} isRTL={isRTL}
              only={SLIDER_GROUPS}
              palette={palette}
              continuous
              dpMode={dpMode} onDpModeChange={setDpMode}
            />
          )}
        </aside>

        {/* Right column: summary bar + chart */}
        <section className="flex-1 min-h-0 flex flex-col gap-3">

          {/* Summary bar */}
          <div className="shrink-0 bg-[var(--bg-panel)] border border-[var(--c-border)] rounded-lg px-4 py-2"
            style={isDark ? {} : { backgroundColor: 'var(--sidebar-group-bg)', borderColor: 'var(--sidebar-group-border)' }}>
            <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-xs text-[var(--c-muted)]" dir={isRTL ? 'rtl' : 'ltr'}>
              <span>
                {t.costsLiveEp}:{' '}
                <span className="text-[var(--c-text)] font-medium tabular-nums">{shekel(results.Ep)}</span>
              </span>
              <span className="text-[var(--c-border)]" aria-hidden>·</span>
              <span>
                {t.downPaymentCard}:{' '}
                <span className="text-[var(--c-text-3)] tabular-nums">{shekel(results.S0)}</span>
              </span>
              <span className="text-[var(--c-border)]" aria-hidden>·</span>
              <span>
                {t.costsLiveTp}:{' '}
                <span className="text-[var(--c-text-3)] tabular-nums">{shekel(results.Tp)}</span>
              </span>
              <span className="text-[var(--c-border)]" aria-hidden>·</span>
              <span>
                {t.costsLiveAdded}:{' '}
                <span className="text-[var(--c-text-3)] tabular-nums">{shekel(results.Ep - results.S0 - results.Tp)}</span>
              </span>
            </div>
          </div>

          {/* Chart — fills remaining height */}
          <div className="flex-1 min-h-0 border border-[var(--c-border)] rounded-lg p-4 flex flex-col" style={{ background: 'var(--chart-bg, var(--bg-panel))' }}>
            <Chart points={results.points} crossovers={results.crossovers} t={t} isRTL={isRTL} stretch isDark={isDark} diffHintReady={diffHintReady} irrApartment={results.irrApartment} irrPassive={results.irrPassive} />
          </div>

        </section>
      </div>

      {/* Legal disclaimer footer */}
      <footer className="shrink-0 px-4 py-2 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <p className="text-xs text-slate-400">
          {isRTL
            ? 'למטרות מידע בלבד. אינו מהווה ייעוץ פיננסי, מיסויי או משפטי. יש להתייעץ עם אנשי מקצוע לפני קבלת החלטות.'
            : 'For informational purposes only. Not financial, tax, or legal advice. Consult professionals before making decisions.'
          }
        </p>
        <p className="text-xs text-[var(--c-muted)] text-center">
          {isRTL
            ? <>© 2026 <a href="https://www.linkedin.com/in/matan-eldar-5796321b5/" target="_blank" rel="noopener noreferrer" className="text-[var(--c-muted)] hover:underline">מתן אלדר</a> · לשימוש אישי בחינם</>
            : <>© 2026 <a href="https://www.linkedin.com/in/matan-eldar-5796321b5/" target="_blank" rel="noopener noreferrer" className="text-[var(--c-muted)] hover:underline">Matan Eldar</a> · Free for personal use</>
          }
        </p>
      </footer>
    </div>
  )
}

function CollapsibleSection({ label, children, isRTL }: { label: string; children: React.ReactNode; isRTL?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 font-medium text-[var(--c-text-3)] cursor-pointer select-none"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: open ? 'rotate(90deg)' : (isRTL ? 'scaleX(-1)' : 'none'), transition: 'transform 0.15s' }}>
          <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {label}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  )
}

function MethodologyPageEN({ page }: { page: number }) {
  if (page === 1) return (
    <div className="flex flex-col gap-3">
      <p>The calculator compares two scenarios for the same capital:</p>
      <p>
        <strong className="text-[var(--c-text-3)]">Apartment scenario:</strong> You buy an
        apartment with a mortgage and rent it out. The gain at each month is what you would walk
        away with if you sold then — sale price minus remaining mortgage, total purchase costs,
        cumulative cash flow over the period (total mortgage payments minus total rent received),
        selling costs, and מס שבח if applicable.
      </p>
      <p>
        <strong className="text-[var(--c-text-3)]">Passive scenario:</strong> You invest the same
        capital (down payment + all purchase costs) in the stock market. In months where the
        mortgage payment exceeds rent, the negative cash flow is also invested in securities. In
        months where rent exceeds the mortgage, no additional investment is made to the passive
        portfolio. The passive gain is the net return after capital gains tax at realization (25%).
      </p>
    </div>
  )

  if (page === 2) return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-[var(--c-text-3)]">Numerical example:</p>
      <p>
        Assume an apartment priced at <span dir="ltr">₪2,000,000</span> with a <span dir="ltr">₪1,000,000</span> down
        payment and <span dir="ltr">₪1,000,000</span> mortgage.
      </p>
      <p>
        In the passive scenario, the full purchase outlay — down payment + purchase tax + transaction
        costs — is invested in the stock market on day of purchase. In this example that totals{' '}
        <span dir="ltr">₪1,200,000</span> invested on day 1.
      </p>
      <p>
        Mortgage payment: <span dir="ltr">₪6,000</span>, rental income: <span dir="ltr">₪5,500</span> — a
        negative cash flow of <span dir="ltr">₪500</span>. In the passive scenario, that <span dir="ltr">₪500</span> is
        also invested in the market — money that would have come out of pocket in the apartment
        scenario.
      </p>
      <p>
        A few years later: mortgage payment still <span dir="ltr">₪6,000</span>, rental income <span dir="ltr">₪6,200</span>{' '}
        (rent has increased over time) — a positive cash flow of <span dir="ltr">₪200</span>. In the passive scenario,
        nothing is added to the portfolio that month.
      </p>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-[var(--c-text-3)]">Chart views:</p>
      <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
        <li><strong className="text-[var(--c-text-3)]">Gains</strong> — shows both curves side by side: the apartment&apos;s net gain at realisation versus the passive investment&apos;s net gain at realisation. The points where the curves intersect are the moments when one scenario overtakes the other.</li>
        <li><strong className="text-[var(--c-text-3)]">Difference</strong> — shows the gap between the two scenarios (apartment minus passive). When the curve is above zero, the apartment is ahead. When below zero, passive investment is ahead. The height of the curve at any point shows the size of the advantage.</li>
        <li><strong className="text-[var(--c-text-3)]">Cash flow</strong> — shows monthly rent income and mortgage payment as lines, and the net monthly cash flow as bars. Negative bars (months where mortgage exceeds rent) represent money invested in the passive scenario.</li>
        <li><strong className="text-[var(--c-text-3)]">Annualized return</strong> — shows each scenario&apos;s annualized return (IRR) for every possible exit month: the single yearly rate the capital effectively earned if sold then. This compares the two scenarios as rates of return rather than shekel amounts. The default view starts from year two, since the return in the first months is extreme or undefined.</li>
      </ul>
      <CollapsibleSection label="Key assumptions:">
        <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
          <li>Spitzer (שפיצר) amortization — fixed monthly mortgage payment, standard in Israel</li>
          <li>Purchase tax: 8% flat for an additional apartment (10% above ₪5,872,725); graduated rates for a first apartment</li>
          <li>מס שבח on apartment sale: estimated 25% of the gain. When set to exempt — single-apartment exemption applies up to a ceiling; see &ldquo;Under the hood&rdquo;</li>
          <li>Capital gains tax (מס רווח הון) on passive investment: 25% at realization only. The apartment is taxed via מס שבח, the portfolio via מס רווח הון — same rate, different taxes</li>
          <li>A prepayment fee may apply when selling before the mortgage ends, if market rates have fallen below your rate — set via the rate-drop slider; see &ldquo;Under the hood&rdquo;</li>
          <li>Maintenance: an estimated annual cost (default 7% of rent), deducted from rental income each month</li>
          <li>In any month where the mortgage exceeds rent, the difference is invested in the passive scenario; a positive-cash-flow month adds nothing to the portfolio</li>
          <li>All figures are nominal ILS — both scenarios are affected by inflation similarly, so the comparison remains valid</li>
          <li>This models a purchase → rent → sell scenario</li>
        </ul>
      </CollapsibleSection>
      <div className="border-t border-slate-700 pt-3">
        <p className="text-xs text-slate-400">For informational purposes only. Not financial, tax, or legal advice. Consult professionals before making decisions.</p>
      </div>
    </div>
  )
}

function MethodologyPageHE({ page }: { page: number }) {
  if (page === 1) return (
    <div className="flex flex-col gap-3">
      <p>המחשבון משווה שני תרחישים עבור אותו הון:</p>
      <p>
        <strong className="text-[var(--c-text-3)]">תרחיש דירה: </strong>קונים דירה עם משכנתה
        ומשכירים אותה. הרווח בכל חודש הוא הרווח הנקי אם תמכרו אז — מחיר המכירה בניכוי יתרת
        המשכנתה, כל הוצאות הרכישה, התזרים המצטבר לאורך התקופה (סך תשלומי המשכנתה פחות סך הכנסות השכירות), עלויות המכירה, ומס שבח (אם רלוונטי).
      </p>
      <p>
        <strong className="text-[var(--c-text-3)]">תרחיש פסיבי: </strong>משקיעים את אותו ההון
        (הון עצמי + כל עלויות הרכישה) בשוק ההון. בכל חודש שבו תשלום המשכנתה עולה על שכר הדירה,
        התזרים השלילי מושקע אף הוא בניירות ערך. בחודשים שבהם השכירות עולה על המשכנתה, אין השקעה
        נוספת בתיק הפסיבי. הרווח הפסיבי הוא הרווח הנקי לאחר מס רווח הון במימוש (25%).
      </p>
    </div>
  )

  if (page === 2) return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-[var(--c-text-3)]">דוגמה מספרית:</p>
      <p>
        נניח דירה במחיר <span dir="ltr">₪2,000,000</span> עם הון עצמי של <span dir="ltr">₪1,000,000</span> ומשכנתה של <span dir="ltr">₪1,000,000</span>.
      </p>
      <p>
        בתרחיש הפסיבי, כל ההון שהוצא ביום הרכישה — הון עצמי + מס רכישה + עלויות עסקה — מושקע בשוק ההון ביום הרכישה. בדוגמה זו הסכום הכולל הוא <span dir="ltr">₪1,200,000</span> המושקעים ביום הראשון.
      </p>
      <p>
        תשלום משכנתה: <span dir="ltr">₪6,000</span>, הכנסה משכירות: <span dir="ltr">₪5,500</span> — תזרים שלילי של <span dir="ltr">₪500</span>. בתרחיש הפסיבי, <span dir="ltr">₪500</span> אלו מושקעים אף הם בשוק ההון — כסף שהיה יוצא מכיסכם בתרחיש הדירה.
      </p>
      <p>
        כעבור כמה שנים: תשלום המשכנתה עדיין <span dir="ltr">₪6,000</span>, הכנסה משכירות <span dir="ltr">₪6,200</span> (השכירות עלתה עם הזמן) — תזרים חיובי של <span dir="ltr">₪200</span>. בתרחיש הפסיבי, חודש זה לא מוסיף דבר לתיק.
      </p>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-[var(--c-text-3)]">תצוגות הגרף:</p>
      <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
        <li><strong className="text-[var(--c-text-3)]">רווחים</strong> — מציג שתי עקומות במקביל: רווח נקי במימוש של הדירה מול רווח נקי במימוש של ההשקעה הפסיבית. נקודות החציה בין העקומות הן הרגעים שבהם אחד התרחישים עולה על השני.</li>
        <li><strong className="text-[var(--c-text-3)]">הפרש</strong> — מציג את ההפרש בין שני התרחישים (דירה פחות פסיבי). כשהעקומה מעל האפס — הדירה עדיפה. כשהיא מתחת לאפס — ההשקעה הפסיבית עדיפה. גובה העקומה בכל נקודה מראה את גודל היתרון.</li>
        <li><strong className="text-[var(--c-text-3)]">תזרים</strong> — מציג את הכנסת השכירות ותשלום המשכנתה כקווים, ואת התזרים החודשי הנקי כעמודות. עמודות שליליות (חודשים שבהם המשכנתה עולה על השכירות) מייצגות כסף המושקע בתרחיש הפסיבי.</li>
        <li><strong className="text-[var(--c-text-3)]">תשואה שנתית</strong> — מציג את התשואה השנתית (<bdi>IRR</bdi>) של כל תרחיש עבור כל חודש יציאה אפשרי: שיעור התשואה השנתית שההון הניב בפועל אם נמכר באותו חודש. תצוגה זו משווה את שני התרחישים כשיעורי תשואה ולא בסכומי שקלים. תצוגת ברירת המחדל מתחילה משנה שנייה, שכן בחודשים הראשונים התשואה קיצונית או אינה מוגדרת.</li>
      </ul>
      <CollapsibleSection label="הנחות מרכזיות:" isRTL>
        <ul className="list-disc list-inside flex flex-col gap-1 mr-2" dir="rtl">
          <li>שיטת שפיצר — תשלום משכנתה חודשי קבוע, סטנדרט בישראל</li>
          <li>מס רכישה: <bdi>8%</bdi> גורף לדירה נוספת (<bdi>10%</bdi> מעל <bdi>₪5,872,725</bdi>); מדרגות לדירה יחידה</li>
          <li>מס שבח על מכירת הדירה: <bdi>25%</bdi> מהרווח (משוער). בבחירת פטור — פטור לדירה יחידה עד תקרה; ראו &quot;מאחורי הקלעים&quot;</li>
          <li>מס רווח הון על השקעה פסיבית: <bdi>25%</bdi> במימוש בלבד. הדירה ממוסה במס שבח, התיק במס רווח הון — אותו שיעור, מס שונה</li>
          <li>ייתכן קנס פירעון מוקדם במכירה לפני תום המשכנתה, אם ריבית השוק ירדה מתחת לריבית שלכם — נקבע באמצעות מחוון ירידת הריבית; ראו &quot;מאחורי הקלעים&quot;</li>
          <li>תחזוקה: עלות שנתית משוערת (ברירת מחדל <bdi>7%</bdi> מהשכירות), מנוכה מהשכירות מדי חודש</li>
          <li>בכל חודש שבו המשכנתה גדולה מהשכירות, ההפרש מושקע בתרחיש הפסיבי; חודש עם תזרים חיובי לא מוסיף לתיק</li>
          <li>כל הנתונים נומינליים — שני התרחישים מושפעים מאינפלציה באופן דומה, ולכן ההשוואה תקפה</li>
          <li>המחשבון מדמה רכישה ← השכרה ← מכירה</li>
        </ul>
      </CollapsibleSection>
      <div className="border-t border-slate-700 pt-3">
        <p className="text-xs text-slate-400">למטרות מידע בלבד. אינו מהווה ייעוץ פיננסי, מיסויי או משפטי. יש להתייעץ עם אנשי מקצוע לפני קבלת החלטות.</p>
      </div>
    </div>
  )
}

function UnderTheHoodModalCalc({ isRTL, onClose }: { isRTL: boolean; onClose: () => void }) {
  const isHe = isRTL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-[var(--bg-page)] border border-[var(--c-border)] rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        dir={isHe ? 'rtl' : 'ltr'}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--c-border)]">
          <span className="font-semibold text-sm text-[var(--c-text)]">{isHe ? 'מאחורי הקלעים' : 'Under the hood'}</span>
          <button onClick={onClose} className="text-[var(--c-text-3)] hover:text-[var(--c-text)] text-xl leading-none px-1">×</button>
        </div>
        <div className="px-6 py-5 text-sm text-[var(--c-muted)] leading-relaxed flex flex-col gap-4">
          {isHe ? <UnderTheHoodContentHE tracker={false} /> : <UnderTheHoodContentEN tracker={false} />}
        </div>
      </div>
    </div>
  )
}

function UnderTheHoodContentEN({ tracker }: { tracker: boolean }) {
  return (
    <>
      <p>This section is for those who want the exact calculations. The two curves on the chart are:</p>
      <ul className="flex flex-col gap-1 ml-2">
        <li><strong className="text-[var(--c-text-3)]">A(t)</strong> — the apartment&apos;s net gain if sold at month t</li>
        <li><strong className="text-[var(--c-text-3)]">P(t)</strong> — the passive investment&apos;s net gain if sold at month t</li>
      </ul>
      <p>Both start from the same upfront capital, <strong className="text-[var(--c-text-3)]">E</strong> (down payment + purchase tax + transaction costs).</p>

      <div>
        <p className="font-medium text-[var(--c-text-3)] mb-1">Apartment, A(t):</p>
        <pre className="text-xs bg-[var(--bg-control)] border border-[var(--c-border)] rounded p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">{`A(t) = SaleValue(t) − SellingCosts(t) − RemainingMortgage(t)
       − E − CumulativeExpenses(t) + CumulativeCashFlow(t) − BettermentTax(t) − PrepaymentFee(t)`}</pre>
        <ul className="flex flex-col gap-1 ml-2 mt-2 text-xs">
          <li><strong className="text-[var(--c-text-3)]">SaleValue(t)</strong> = purchase price grown at the appreciation rate, compounded monthly</li>
          <li><strong className="text-[var(--c-text-3)]">SellingCosts(t)</strong> = SaleValue(t) × selling-costs %</li>
          <li><strong className="text-[var(--c-text-3)]">RemainingMortgage(t)</strong> = {tracker ? 'balance from the actual bank amortization schedule' : 'balance from the amortization schedule'}</li>
          <li><strong className="text-[var(--c-text-3)]">CumulativeCashFlow(t)</strong> = running sum of (rent − mortgage − maintenance) each month; normally negative, since mortgage usually exceeds rent</li>
          <li><strong className="text-[var(--c-text-3)]">BettermentTax(t)</strong> = מס שבח, see below</li>
          <li><strong className="text-[var(--c-text-3)]">PrepaymentFee(t)</strong> = early-repayment penalty on the mortgage, see below</li>
          {tracker && <li><strong className="text-[var(--c-text-3)]">ApartmentValue</strong> is anchored to the most recent recorded valuation, then grown at the appreciation rate</li>}
          {tracker && <li>Past months use actual logged cash flows; future months use the projected rent schedule and amortization table.</li>}
        </ul>
      </div>

      <div>
        <p className="font-medium text-[var(--c-text-3)] mb-1">Passive, P(t):</p>
        <pre className="text-xs bg-[var(--bg-control)] border border-[var(--c-border)] rounded p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">{`P(t) = (Portfolio(t) − CostBasis(t)) × (1 − 25%)`}</pre>
        <ul className="flex flex-col gap-1 ml-2 mt-2 text-xs">
          <li><strong className="text-[var(--c-text-3)]">Portfolio(t)</strong> = E invested on day one, compounded monthly at the passive return, plus each month&apos;s shortfall (mortgage − rent − maintenance, when positive) added and compounded</li>
          <li><strong className="text-[var(--c-text-3)]">CostBasis(t)</strong> = E + cumulative shortfalls invested</li>
          <li>25% is capital gains tax (מס רווח הון), applied to the gain at sale only</li>
        </ul>
      </div>

      <div>
        <p className="font-medium text-[var(--c-text-3)] mb-1">Betterment tax — מס שבח:</p>
        <pre className="text-xs bg-[var(--bg-control)] border border-[var(--c-border)] rounded p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">{`Taxable portion = max(0, SaleValue − 5,008,000) / SaleValue   (when exempt)
BettermentTax    = RealGain × Taxable portion × 25%`}</pre>
        <p className="text-xs mt-2">When not exempt, the full gain is taxed at 25%. This is a simplification — real מס שבח is computed on the inflation-adjusted gain after deductible costs.</p>
      </div>

      <div>
        <p className="font-medium text-[var(--c-text-3)] mb-1">Prepayment fee — קנס פירעון מוקדם:</p>
        <pre className="text-xs bg-[var(--bg-control)] border border-[var(--c-border)] rounded p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">{`rc = MortgageRate / 12     rm = MarketRate / 12     n = months remaining
AF(r, n) = (1 − (1 + r)^(−n)) / r          (= n when r = 0)
PrepaymentFee(t) = max(0, MonthlyPayment × (AF(rm, n) − AF(rc, n)))`}</pre>
        <p className="text-xs mt-2">Selling before the mortgage ends means repaying the balance early. If market rates have fallen below your contractual rate, the bank charges a capitalization penalty for the interest it loses. The rate-drop slider sets how far the market rate sits below your contractual rate, so a bigger gap means a bigger fee, and if rates rose or held the fee is zero. The penalty is the present value of the lost interest: each remaining payment is discounted at the market rate versus your contractual rate, and the difference between those annuity values is the fee. In single-rate mode the fee is applied to the whole balance — a slightly conservative estimate, since the prime track is exempt by law. Switch the mortgage input to by-track mode to exclude the prime track and charge only the fixed and variable tracks.</p>
      </div>

      <div>
        <p className="font-medium text-[var(--c-text-3)] mb-1">Annualized return (IRR):</p>
        <p className="text-xs">For each possible exit month, the monthly cash-flow stream (−E at month 0, monthly net flows, proceeds at exit) is solved for the rate that sets its net present value to zero, then annualized. Plotted across all exit months, this produces the IRR curves.</p>
      </div>
    </>
  )
}

function UnderTheHoodContentHE({ tracker }: { tracker: boolean }) {
  return (
    <div dir="rtl">
      <p>החלק הזה מיועד למי שרוצה לראות את החישוב המדויק. שתי העקומות בגרף הן:</p>
      <ul className="flex flex-col gap-1 mr-2">
        <li><strong className="text-[var(--c-text-3)]">A(t)</strong> — הרווח הנקי מהדירה אם תימכר בחודש <bdi>t</bdi></li>
        <li><strong className="text-[var(--c-text-3)]">P(t)</strong> — הרווח הנקי מההשקעה הפסיבית אם תמומש בחודש <bdi>t</bdi></li>
      </ul>
      <p>שתיהן מתחילות מאותו הון התחלתי, <strong className="text-[var(--c-text-3)]">E</strong> (הון עצמי + מס רכישה + עלויות עסקה).</p>

      <div>
        <p className="font-medium text-[var(--c-text-3)] mb-1">דירה, <bdi>A(t)</bdi>:</p>
        <pre className="text-xs bg-[var(--bg-control)] border border-[var(--c-border)] rounded p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed" dir="ltr">{`A(t) = SaleValue(t) − SellingCosts(t) − RemainingMortgage(t)
       − E − CumulativeExpenses(t) + CumulativeCashFlow(t) − BettermentTax(t) − PrepaymentFee(t)`}</pre>
        <ul className="flex flex-col gap-1 mr-2 mt-2 text-xs">
          <li><strong className="text-[var(--c-text-3)]">SaleValue(t)</strong> = מחיר הרכישה שגדל בקצב עליית הערך, בריבית-דריבית חודשית</li>
          <li><strong className="text-[var(--c-text-3)]">SellingCosts(t)</strong> = <bdi>SaleValue(t)</bdi> × אחוז עלויות המכירה</li>
          <li><strong className="text-[var(--c-text-3)]">RemainingMortgage(t)</strong> = {tracker ? 'היתרה מלוח הסילוקין בפועל של הבנק' : 'היתרה מלוח הסילוקין'}</li>
          <li><strong className="text-[var(--c-text-3)]">CumulativeCashFlow(t)</strong> = סכום מצטבר של (שכירות − משכנתה − תחזוקה) בכל חודש; בדרך כלל שלילי, מכיוון שהמשכנתה גבוהה מהשכירות</li>
          <li><strong className="text-[var(--c-text-3)]">BettermentTax(t)</strong> = ראו בהמשך</li>
          <li><strong className="text-[var(--c-text-3)]">PrepaymentFee(t)</strong> = קנס פירעון מוקדם על המשכנתה, ראו בהמשך</li>
          {tracker && <li><strong className="text-[var(--c-text-3)]">SaleValue</strong> מעוגן להערכת השווי המוקלטת האחרונה, ואז גדל בקצב ההתייקרות</li>}
          {tracker && <li>חודשים שעברו משתמשים בתזרים בפועל שנרשם; חודשים עתידיים — בלוח השכירות ולוח הסילוקין המחושב.</li>}
        </ul>
      </div>

      <div>
        <p className="font-medium text-[var(--c-text-3)] mb-1">פסיבי, <bdi>P(t)</bdi>:</p>
        <pre className="text-xs bg-[var(--bg-control)] border border-[var(--c-border)] rounded p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed" dir="ltr">{`P(t) = (Portfolio(t) − CostBasis(t)) × (1 − 25%)`}</pre>
        <ul className="flex flex-col gap-1 mr-2 mt-2 text-xs">
          <li><strong className="text-[var(--c-text-3)]">Portfolio(t)</strong> = <bdi>E</bdi> שמושקע ביום הראשון, בריבית-דריבית חודשית לפי התשואה הפסיבית, בתוספת הגירעון של כל חודש (משכנתה − שכירות − תחזוקה, כשהוא חיובי) שנוסף ומצטבר</li>
          <li><strong className="text-[var(--c-text-3)]">CostBasis(t)</strong> = <bdi>E</bdi> + סך הגירעונות שהושקעו</li>
          <li>ה-<bdi>25%</bdi> הוא מס רווח הון, מוחל על הרווח במימוש בלבד</li>
        </ul>
      </div>

      <div>
        <p className="font-medium text-[var(--c-text-3)] mb-1">מס שבח:</p>
        <pre className="text-xs bg-[var(--bg-control)] border border-[var(--c-border)] rounded p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed" dir="ltr">{`Taxable portion = max(0, SaleValue − 5,008,000) / SaleValue   (when exempt)
BettermentTax    = RealGain × Taxable portion × 25%`}</pre>
        <p className="text-xs mt-2">ללא פטור, מלוא הרווח ממוסה ב-<bdi>25%</bdi>. זוהי הפשטה — מס שבח בפועל מחושב על הרווח הריאלי הצמוד למדד לאחר ניכוי הוצאות מוכרות.</p>
      </div>

      <div>
        <p className="font-medium text-[var(--c-text-3)] mb-1">קנס פירעון מוקדם:</p>
        <pre className="text-xs bg-[var(--bg-control)] border border-[var(--c-border)] rounded p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed" dir="ltr">{`rc = MortgageRate / 12     rm = MarketRate / 12     n = months remaining
AF(r, n) = (1 − (1 + r)^(−n)) / r          (= n when r = 0)
PrepaymentFee(t) = max(0, MonthlyPayment × (AF(rm, n) − AF(rc, n)))`}</pre>
        <p className="text-xs mt-2">מכירה לפני תום תקופת המשכנתה משמעה פירעון היתרה מוקדם. אם ריבית השוק ירדה מתחת לריבית החוזית שלכם, הבנק גובה עמלת היוון על הריבית שהוא מפסיד. מחוון ירידת הריבית קובע עד כמה ריבית השוק נמוכה מהריבית החוזית, כך שפער גדול יותר משמעו קנס גדול יותר, ואם הריבית עלתה או נותרה ללא שינוי הקנס אפס. הקנס הוא הערך הנוכחי של הריבית האבודה: כל תשלום עתידי שנותר מהוון בריבית השוק לעומת הריבית החוזית, וההפרש בין ערכי האנונה הוא הקנס. במצב ריבית אחת הקנס מחושב על מלוא היתרה — הערכה מעט שמרנית, שכן מסלול הפריים פטור על־פי חוק. מעבר להזנה לפי מסלול מחריג את מסלול הפריים ומחייב רק את המסלול הקבוע והמשתנה.</p>
      </div>

      <div>
        <p className="font-medium text-[var(--c-text-3)] mb-1">תשואה שנתית (<bdi>IRR</bdi>):</p>
        <p className="text-xs">עבור כל חודש יציאה אפשרי, פותרים את סדרת התזרימים החודשית (<bdi>−E</bdi> בחודש <bdi>0</bdi>, תזרימים חודשיים, התמורה ביציאה) עבור הריבית שמאפסת את הערך הנוכחי הנקי, וממירים לתשואה שנתית. בפריסה על פני כל חודשי היציאה מתקבלות עקומות ה-<bdi>IRR</bdi>.</p>
      </div>
    </div>
  )
}
