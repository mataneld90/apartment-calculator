'use client'

import { useState, useMemo, useEffect, useRef, type ReactNode } from 'react'
import { compute, DEFAULT_PARAMS } from '@/lib/model'
import type { Params } from '@/lib/types'
import { LANG, type Lang } from '@/lib/i18n'
import { getChartPalette } from '@/lib/colorPalette'
import { shekel } from '@/lib/formatters'
import dynamic from 'next/dynamic'
import Sliders from './Sliders'
import Tour, { type TourStep } from './Tour'
import type { View } from './Chart'

const Chart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 360, marginTop: 16 }} className="bg-[var(--bg-panel)] rounded-lg animate-pulse" />
  ),
})

const SLIDER_GROUPS: string[] = ['costs', 'mortgage', 'apartment', 'selling', 'passive']

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function Calculator() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS)
  const [dpMode, setDpMode] = useState<'amount' | 'fraction'>('amount')
  const [lang, setLang] = useState<Lang>('he')
  const [underTheHoodOpen, setUnderTheHoodOpen] = useState(false)
  const [showHowItWorksHint, setShowHowItWorksHint] = useState(false)
  const [isDark, setIsDark] = useState(() => { const h = new Date().getHours(); return h >= 19 || h < 7 })
  const palette = getChartPalette(false, isDark)
  const results = useMemo(() => compute(params), [params])
  const t = LANG[lang]
  const isRTL = lang === 'he'
  const [isEmbedded, setIsEmbedded] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const [tourStep, setTourStep] = useState(0)

  useEffect(() => {
    // True when the calc runs inside someone else's iframe (e.g. the moneyplan.co.il embed).
    // A cross-origin parent makes window.top access throw, which itself means we're framed.
    try { setIsEmbedded(window.self !== window.top) } catch { setIsEmbedded(true) }
  }, [])

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

  // Auto-open the guided tour on first visit
  useEffect(() => {
    if (!localStorage.getItem('hasVisitedBefore')) {
      setTourStep(0)
      setTourOpen(true)
    }
  }, [])

  // Below lg the layout changes (e.g. the summary bar shows only 2 of its 4
  // values), and some tour copy must match what's actually on screen.
  const [isNarrow, setIsNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const sync = () => setIsNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  function markVisited() {
    localStorage.setItem('hasVisitedBefore', 'true')
  }

  // Guided "How this works" tour — walks the input panels in story order
  // (purchase → mortgage → property → sale → passive), then each chart view.
  const tourSteps: TourStep[] = useMemo(() => isRTL ? [
    { target: null, title: 'מה משווים כאן',
      body: 'רכישת דירה עם משכנתה מול השקעת אותו הכסף בשוק ההון. מגדירים את הנתונים בצד, וקוראים את התוצאה בגרף.' },
    { target: 'panel-costs', title: 'רכישה',
      body: 'עלויות הרכישה החד-פעמיות: מחיר הדירה, מס רכישה ועלויות נלוות.' },
    { target: 'panel-mortgage', title: 'משכנתה',
      body: 'המימון: הון עצמי, תקופה וריבית - ריבית משוקללת אחת או פירוט לפי מסלול. את גובה המימון קובעים דרך סכום ההון העצמי, או דרך אחוז המימון של הבנק.' },
    { target: 'summary', title: 'סה"כ הוצאות רכישה',
      body: isNarrow
        ? 'כמה כסף יוצא מהכיס ביום הרכישה, וכמה ממנו הון עצמי. מתעדכן לפי פאנלי הרכישה והמשכנתה.'
        : 'כמה כסף יוצא מהכיס ביום הרכישה: הון עצמי, מס רכישה ועלויות נלוות. מתעדכן לפי פאנלי הרכישה והמשכנתה.' },
    { target: 'panel-apartment', title: 'נכס',
      body: 'הדירה עצמה: שכר דירה, עליית ערך ותחזוקה. למעלה בוחרים בין השכרה למגורים.' },
    { target: 'panel-selling', title: 'מכירה',
      body: <>עלויות היציאה במכירה: עלויות מכירה, מס שבח, וקנס פירעון מוקדם שנקבע לפי מחוון ירידת הריבית.</> },
    { target: 'panel-passive', title: 'השקעה פסיבית',
      body: 'האלטרנטיבה במספר אחד: התשואה השנתית שאותו הכסף היה מניב בשוק ההון.' },
    { target: 'chart', chartView: 'gains', title: 'רווחים',
      body: 'שני התרחישים זה מול זה - הרווח הנקי אילו מכרתם בכל חודש. נקודות החיתוך הן הרגעים שבהם אחד עוקף את השני.' },
    { target: 'chart', chartView: 'diff', title: 'הפרש',
      body: 'רווח מימוש הדירה פחות רווח מימוש ההשקעה הפסיבית. גובה העקומה הוא גודל היתרון. מעל האפס הדירה מובילה, מתחת לאפס השוק מוביל.' },
    { target: 'chart', chartView: 'irr', title: 'תשואה שנתית',
      body: <>התשואה השנתית (<bdi>IRR</bdi>) של כל תרחיש לכל חודש יציאה אפשרי - השוואה כשיעורי תשואה, לא בשקלים.</> },
    { target: 'chart', chartView: 'cashflow', chartSubView: 'rentmort', title: 'תזרים',
      body: 'שכר הדירה מול תשלום המשכנתה כקווים - רואים מתי השכירות מדביקה את המשכנתה.' },
    { target: 'chart', chartView: 'cashflow', chartSubView: 'bars', title: 'תזרים חודשי',
      body: 'אותה תמונה כעמודות של תזרים נקי: שכירות פחות משכנתה ותחזוקה. עמודות שליליות הן כסף שמושקע בצד הפסיבי; חודשים חיוביים לא מוסיפים לתיק.' },
    { target: 'under-the-hood', title: 'מאחורי הקלעים',
      body: 'זהו! הנוסחאות המלאות וההנחות של החישוב זמינות כאן, בכל שלב.' },
  ] : [
    { target: null, title: 'What this compares',
      body: 'Buying an apartment with a mortgage vs investing the same money in the market. Set your inputs on the side, then read the result in the chart.' },
    { target: 'panel-costs', title: 'Purchase',
      body: 'The one-time cost of buying: price, purchase tax and fees.' },
    { target: 'panel-mortgage', title: 'Mortgage',
      body: 'Your financing: down payment, term and rate - a single blended rate, or broken out per track. Set the financing via the down-payment amount, or via the bank’s financing percent.' },
    { target: 'summary', title: 'Total paid to buy',
      body: isNarrow
        ? 'The cash out of pocket on purchase day, and how much of it is the down payment. Updates as you change the Purchase and Mortgage panels.'
        : 'The cash out of pocket on purchase day: down payment, purchase tax and transaction costs. Updates as you change the Purchase and Mortgage panels.' },
    { target: 'panel-apartment', title: 'Property',
      body: 'The apartment itself: rent, appreciation and upkeep. Up top, choose renting it out or living in it.' },
    { target: 'panel-selling', title: 'Sale',
      body: <>Exit costs when you sell: selling fees, <bdi>מס שבח</bdi>, and a prepayment fee set by the rate-drop slider.</> },
    { target: 'panel-passive', title: 'Passive investment',
      body: 'The alternative in one number: the annual market return the same cash would earn.' },
    { target: 'chart', chartView: 'gains', title: 'Gains',
      body: 'Both scenarios side by side - the net gain if you sold in each month. The crossover points are the moments one overtakes the other.' },
    { target: 'chart', chartView: 'diff', title: 'Difference',
      body: 'The apartment’s realized gain minus the passive investment’s realized gain. The height of the curve is the size of the lead. Above zero the apartment leads; below zero the market leads.' },
    { target: 'chart', chartView: 'irr', title: 'Annualized return',
      body: 'Each scenario’s yearly return (IRR) for every exit month - comparing them as rates, not shekels.' },
    { target: 'chart', chartView: 'cashflow', chartSubView: 'rentmort', title: 'Cash flow',
      body: 'Monthly rent vs the mortgage payment as lines - see when rent catches up with the mortgage.' },
    { target: 'chart', chartView: 'cashflow', chartSubView: 'bars', title: 'Monthly flow',
      body: 'The same picture as net-flow bars: rent minus mortgage and upkeep. Negative bars are money invested on the passive side; positive months add nothing to the portfolio.' },
    { target: 'under-the-hood', title: 'Under the hood',
      body: 'That’s it! The full formulas and assumptions behind the numbers live here, any time.' },
  ], [isRTL, isNarrow])

  // The tour narrates the DEFAULT scenario (crossovers, positive-flow year,
  // prepayment fee), so it resets the inputs for its duration and restores
  // the user's values on exit. Bumping sliderEpoch remounts the Sliders:
  // their internal down-payment state would otherwise rewrite p right after
  // the reset (it holds the ₪ amount fixed whenever the price changes).
  const preTourParams = useRef<Params | null>(null)
  const preTourDpMode = useRef<'amount' | 'fraction' | null>(null)
  const [sliderEpoch, setSliderEpoch] = useState(0)
  function startTour() {
    preTourParams.current = params
    preTourDpMode.current = dpMode
    setParams(DEFAULT_PARAMS)
    setDpMode('amount')
    setSliderEpoch(e => e + 1)
    setTourStep(0)
    setTourOpen(true)
  }
  function closeTour() {
    const isFirstVisit = !localStorage.getItem('hasVisitedBefore')
    markVisited()
    setTourOpen(false)
    if (preTourParams.current) {
      setParams(preTourParams.current)
      preTourParams.current = null
    }
    if (preTourDpMode.current) {
      setDpMode(preTourDpMode.current)
      preTourDpMode.current = null
    }
    setSliderEpoch(e => e + 1)
    // The tour walks every chart view itself, so no diff/cashflow button hint here.
    if (isFirstVisit) {
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

      {/* Under the hood modal */}
      {underTheHoodOpen && (
        <UnderTheHoodModalCalc isRTL={isRTL} onClose={() => setUnderTheHoodOpen(false)} />
      )}

      {/* Guided "How this works" tour */}
      <Tour
        open={tourOpen}
        steps={tourSteps}
        index={tourStep}
        isRTL={isRTL}
        onNext={() => setTourStep(s => Math.min(s + 1, tourSteps.length - 1))}
        onPrev={() => setTourStep(s => Math.max(s - 1, 0))}
        onClose={closeTour}
        onToggleLang={() => setLang(l => l === 'en' ? 'he' : 'en')}
        langToggleLabel={t.langToggle}
      />

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
              onClick={startTour}
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
              data-tour="under-the-hood"
              className="px-2 py-0.5 sm:px-3 sm:py-1.5 rounded bg-[var(--bg-control)] border border-[var(--c-border)] text-[var(--c-text-3)] text-xs sm:text-sm font-medium hover:border-[var(--c-border-hover)] hover:text-[var(--c-text)] transition-colors"
            >
              {isRTL ? 'מאחורי הקלעים' : 'Under the hood'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile split layout - only visible below 1024px */}
      <div className="lg:hidden flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Top: chart fixed at ~48dvh */}
        <div className="shrink-0 h-[56dvh] overflow-hidden pt-0 px-3 pb-1.5">
          <div className="border border-[var(--c-border)] rounded-lg p-3 h-full" style={{ background: 'var(--chart-bg, var(--bg-panel))' }}>
            <Chart points={results.points} crossovers={results.crossovers} t={t} isRTL={isRTL} fill isDark={isDark} irrApartment={results.irrApartment} irrPassive={results.irrPassive} occupancy={params.occupancy} tourView={tourOpen ? tourSteps[tourStep]?.chartView : undefined} tourSubView={tourOpen ? tourSteps[tourStep]?.chartSubView : undefined} tourOpen={tourOpen} />
          </div>
        </div>
        {/* Summary bar */}
        <div data-tour="summary" className="shrink-0 mx-3 mb-1.5 bg-[var(--bg-panel)] border border-[var(--c-border)] rounded-lg px-3 py-1"
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
            key={sliderEpoch}
            params={params} update={update} results={results} t={t} isRTL={isRTL}
            only={SLIDER_GROUPS}
            palette={palette}
            continuous
            dpMode={dpMode} onDpModeChange={setDpMode}
          />
          {/* Legal disclaimer - scrolls with the sliders on mobile (copyright stays pinned below) */}
          <p className="mt-4 pt-3 border-t border-[var(--c-border)] text-xs text-slate-400 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
            {isRTL
              ? 'למטרות מידע בלבד. אינו מהווה ייעוץ פיננסי, מיסויי או משפטי. יש להתייעץ עם אנשי מקצוע לפני קבלת החלטות.'
              : 'For informational purposes only. Not financial, tax, or legal advice. Consult professionals before making decisions.'
            }
          </p>
        </div>
      </div>

      {/* Compact pinned byline - mobile only (full footer above is desktop-only) */}
      <footer className="lg:hidden shrink-0 px-4 py-1 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <p className="text-[10px] text-[var(--c-muted)]">
          {isRTL
            ? <>© 2026 <a href="https://www.linkedin.com/in/matan-eldar-5796321b5/" target="_blank" rel="noopener noreferrer" className="text-[var(--c-muted)] hover:underline">מתן אלדר</a> · לשימוש אישי בחינם</>
            : <>© 2026 <a href="https://www.linkedin.com/in/matan-eldar-5796321b5/" target="_blank" rel="noopener noreferrer" className="text-[var(--c-muted)] hover:underline">Matan Eldar</a> · Free for personal use</>
          }
          {' · '}<a href="mailto:matan.eldar89@gmail.com?subject=apartment-calc%20feedback" className="text-[var(--c-muted)] hover:underline">{t.feedbackLink}</a>
        </p>
        {isEmbedded && (
          <p className="text-[10px] text-[var(--c-muted)]">
            {t.fullVersionPrefix}<a dir="ltr" href="https://www.apartment-calc.com" target="_blank" rel="noopener noreferrer" className="text-[var(--c-muted)] hover:underline">apartment-calc.com</a>
          </p>
        )}
      </footer>

      {/* Desktop two-column layout - ≥1024px */}
      <div className="hidden lg:flex flex-1 min-h-0 gap-4 px-4 py-4">

        {/* Left column: scrollable parameter inputs */}
        <aside
          className="w-[400px] shrink-0 overflow-y-auto sidebar-scroll rounded-lg"
          style={{ backgroundColor: 'var(--sidebar-area-bg)', padding: isDark ? 0 : '12px' }}
        >
          {isDark ? (
            <div className="bg-[var(--bg-panel)] border border-[var(--c-border)] rounded-lg p-4">
              <Sliders
                key={sliderEpoch}
                params={params} update={update} results={results} t={t} isRTL={isRTL}
                only={SLIDER_GROUPS}
                palette={palette}
                continuous
                dpMode={dpMode} onDpModeChange={setDpMode}
              />
            </div>
          ) : (
            <Sliders
              key={sliderEpoch}
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
          <div data-tour="summary" className="shrink-0 bg-[var(--bg-panel)] border border-[var(--c-border)] rounded-lg px-4 py-2"
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

          {/* Chart - fills remaining height */}
          <div className="flex-1 min-h-0 border border-[var(--c-border)] rounded-lg p-4 flex flex-col" style={{ background: 'var(--chart-bg, var(--bg-panel))' }}>
            <Chart points={results.points} crossovers={results.crossovers} t={t} isRTL={isRTL} stretch isDark={isDark} irrApartment={results.irrApartment} irrPassive={results.irrPassive} occupancy={params.occupancy} tourView={tourOpen ? tourSteps[tourStep]?.chartView : undefined} tourSubView={tourOpen ? tourSteps[tourStep]?.chartSubView : undefined} tourOpen={tourOpen} />
          </div>

        </section>
      </div>

      {/* Legal disclaimer footer - desktop only (mobile keeps a compact byline + scrolls the disclaimer) */}
      <footer className="hidden lg:block shrink-0 px-4 py-2 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
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
          {' · '}<a href="mailto:matan.eldar89@gmail.com?subject=apartment-calc%20feedback" className="text-[var(--c-muted)] hover:underline">{t.feedbackLink}</a>
        </p>
        {isEmbedded && (
          <p className="text-xs text-[var(--c-muted)] text-center">
            {t.fullVersionPrefix}<a dir="ltr" href="https://www.apartment-calc.com" target="_blank" rel="noopener noreferrer" className="text-[var(--c-muted)] hover:underline">apartment-calc.com</a>
          </p>
        )}
      </footer>
    </div>
  )
}

function UnderTheHoodModalCalc({ isRTL, onClose }: { isRTL: boolean; onClose: () => void }) {
  const isHe = isRTL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-[var(--bg-page)] border border-[var(--c-border)] rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto desktop-thin-scroll"
        onClick={e => e.stopPropagation()}
        dir={isHe ? 'rtl' : 'ltr'}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--c-border)]">
          <span className="font-semibold text-sm text-[var(--c-text)]">{isHe ? 'מאחורי הקלעים' : 'Under the hood'}</span>
          <button onClick={onClose} className="text-[var(--c-text-3)] hover:text-[var(--c-text)] text-xl leading-none px-1">×</button>
        </div>
        <div className="px-6 py-5 text-sm text-[var(--c-muted)] leading-relaxed flex flex-col gap-4">
          {isHe ? <UnderTheHoodContentHE isRTL /> : <UnderTheHoodContentEN isRTL={false} />}
        </div>
      </div>
    </div>
  )
}

// ---- shared presentational helpers for the Under-the-hood content ----

function HoodChevron({ open, isRTL }: { open: boolean; isRTL: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      className="text-[var(--c-text-3)] shrink-0 transition-transform duration-150"
      style={{ transform: open ? 'rotate(90deg)' : isRTL ? 'scaleX(-1)' : 'none' }}
    >
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HoodSection({
  title,
  summary,
  defaultOpen = false,
  isRTL,
  children,
}: {
  title: ReactNode
  summary: ReactNode
  defaultOpen?: boolean
  isRTL: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-lg border border-[var(--c-border)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-start hover:bg-[var(--bg-control)] transition-colors"
      >
        <HoodChevron open={open} isRTL={isRTL} />
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-[var(--c-text-3)]">{title}</span>
          {!open && <span className="block text-xs text-[var(--c-muted)] mt-0.5 opacity-80">{summary}</span>}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          <p className="text-xs text-[var(--c-muted)]">{summary}</p>
          {children}
        </div>
      )}
    </div>
  )
}

function HoodFormula({ children }: { children: string }) {
  return (
    <pre
      dir="ltr"
      className="text-xs font-mono bg-[var(--bg-control)] rounded-lg px-4 py-3 overflow-x-auto whitespace-pre leading-relaxed text-[var(--c-text-3)]"
    >
      {children}
    </pre>
  )
}

function HoodDefRow({ term, children }: { term: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(8rem,auto)_1fr] gap-x-3 gap-y-0.5 py-2 border-t border-[var(--c-border)] first:border-t-0 first:pt-0">
      <span dir="ltr" className="font-mono font-medium text-[var(--c-text-3)]">{term}</span>
      <span className="text-[var(--c-muted)]">{children}</span>
    </div>
  )
}

function HoodDefList({ children }: { children: ReactNode }) {
  return <div className="text-xs">{children}</div>
}

function HoodNote({ children }: { children: ReactNode }) {
  return <p className="text-xs text-[var(--c-muted)]">{children}</p>
}

function UnderTheHoodContentEN({ isRTL }: { isRTL: boolean }) {
  return (
    <>
      <p>
        The exact calculations behind the two curves. Both <strong className="text-[var(--c-text-3)]">A(t)</strong> (apartment)
        and <strong className="text-[var(--c-text-3)]">P(t)</strong> (passive) start from the same upfront capital{' '}
        <strong className="text-[var(--c-text-3)]">E</strong> - down payment + purchase tax + transaction costs - and show
        the net gain if you exited at month <strong className="text-[var(--c-text-3)]">t</strong>.
      </p>

      <HoodSection isRTL={isRTL} defaultOpen title="Apartment · A(t)" summary="What you'd walk away with if you sold the apartment at month t.">
        <HoodFormula>{`A(t) =  SaleValue(t)
      − SellingCosts(t)
      − RemainingMortgage(t)
      − E
      − CumulativeExpenses(t)
      + CumulativeCashFlow(t)
      − BettermentTax(t)
      − PrepaymentFee(t)`}</HoodFormula>
        <HoodDefList>
          <HoodDefRow term="SaleValue(t)">purchase price grown at the appreciation rate, compounded monthly</HoodDefRow>
          <HoodDefRow term="SellingCosts(t)">SaleValue(t) × selling-costs %</HoodDefRow>
          <HoodDefRow term="RemainingMortgage(t)">balance from the amortization schedule</HoodDefRow>
          <HoodDefRow term="CumulativeCashFlow(t)">running sum of (rent − mortgage − maintenance); usually negative, since mortgage exceeds rent</HoodDefRow>
          <HoodDefRow term="BettermentTax(t)">מס שבח - see its section below</HoodDefRow>
          <HoodDefRow term="PrepaymentFee(t)">early-repayment penalty - see its section below</HoodDefRow>
        </HoodDefList>
      </HoodSection>

      <HoodSection isRTL={isRTL} defaultOpen title="Passive · P(t)" summary="The same capital invested in a passive fund instead, net of tax at sale.">
        <HoodFormula>{`P(t) = (Portfolio(t) − CostBasis(t)) × (1 − 25%)`}</HoodFormula>
        <HoodDefList>
          <HoodDefRow term="Portfolio(t)">E invested on day one, compounded monthly at the passive return, plus each month&apos;s shortfall (mortgage − rent − maintenance, when positive) added and compounded</HoodDefRow>
          <HoodDefRow term="CostBasis(t)">E + cumulative shortfalls invested</HoodDefRow>
          <HoodDefRow term="25%">capital gains tax (מס רווח הון), applied to the gain at sale only</HoodDefRow>
        </HoodDefList>
      </HoodSection>

      <HoodSection isRTL={isRTL} title="Renting out vs living in" summary="Where the rent in the cash flow comes from, and what maintenance is based on.">
        <HoodNote>The cash flow carries one rent term, but it means different things by mode. <strong className="text-[var(--c-text-3)]">Rent it out:</strong> the rent is what a tenant pays you - the apartment&apos;s own market rent. <strong className="text-[var(--c-text-3)]">Live in it:</strong> you collect no rent but avoid paying rent to live elsewhere, and that avoided rent takes the rent&apos;s place in the cash flow, since saving a payment is economically the same as receiving one.</HoodNote>
        <HoodNote>Either way, <strong className="text-[var(--c-text-3)]">maintenance is always a percentage of the apartment&apos;s own market rent</strong> - it is a cost of the property itself, independent of what you&apos;d pay to live elsewhere. So live-in mode exposes two rents: the apartment&apos;s market rent (the maintenance basis) and the rent you&apos;d otherwise pay (the benefit). Set them equal and the live-in result is identical to renting it out.</HoodNote>
      </HoodSection>

      <HoodSection isRTL={isRTL} title="Betterment tax · מס שבח" summary="The apartment&apos;s sale tax, ceiling-aware when the exemption applies.">
        <HoodFormula>{`Taxable portion = max(0, SaleValue − 5,008,000) / SaleValue   (when exempt)
BettermentTax   = RealGain × Taxable portion × 25%`}</HoodFormula>
        <HoodNote>When not exempt, the full gain is taxed at 25%. This is a simplification - real מס שבח is computed on the inflation-adjusted gain after deductible costs.</HoodNote>
        <HoodNote>The single-apartment exemption also requires owning the apartment at least 18 months. Selling earlier is taxed in full at 25%, so in exempt mode A(t) steps up at month 18.</HoodNote>
      </HoodSection>

      <HoodSection isRTL={isRTL} title="Prepayment fee · קנס פירעון מוקדם" summary="Capitalization penalty for repaying the mortgage early when market rates have fallen.">
        <HoodFormula>{`rc = MortgageRate / 12
rm = MarketRate / 12
n  = months remaining

AF(r, n) = (1 − (1 + r)^(−n)) / r        (= n when r = 0)

PrepaymentFee(t) = max(0, MonthlyPayment × (AF(rm, n) − AF(rc, n)))`}</HoodFormula>
        <HoodNote>Selling before the mortgage ends means repaying the balance early. If market rates have fallen below your contractual rate, the bank charges a capitalization penalty for the interest it loses. The rate-drop slider sets how far the market rate sits below your contractual rate, so a bigger gap means a bigger fee, and if rates rose or held the fee is zero. The penalty is the present value of the lost interest: each remaining payment is discounted at the market rate versus your contractual rate, and the difference between those two present values is the fee.</HoodNote>
        <HoodNote><strong className="text-[var(--c-text-3)]">Single-rate vs by-track:</strong> in single-rate mode the fee is applied to the whole balance - a slightly conservative estimate, since the prime track is exempt by law. Switch the mortgage input to by-track mode to exclude the prime track and charge only the fixed and variable tracks.</HoodNote>
      </HoodSection>

      <HoodSection isRTL={isRTL} title="Annualized return · IRR" summary="The annualized rate that makes the full cash-flow stream break even.">
        <HoodNote>For each possible exit month, the monthly cash-flow stream (−E at month 0, monthly net flows, proceeds at exit) is solved for the rate that sets its net present value to zero, then annualized. Plotted across all exit months, this produces the IRR curves.</HoodNote>
      </HoodSection>

      <HoodSection isRTL={isRTL} title="Scope" summary="Nominal figures; models a purchase → rent → sell scenario.">
        <HoodNote>All figures are nominal ILS - inflation affects both scenarios similarly, so the comparison remains valid.</HoodNote>
        <HoodNote>The model simulates a purchase → rent → sell scenario. In any month where the mortgage exceeds rent, the shortfall is invested in the passive scenario; a positive-cash-flow month adds nothing to the portfolio.</HoodNote>
      </HoodSection>
    </>
  )
}

function UnderTheHoodContentHE({ isRTL }: { isRTL: boolean }) {
  return (
    <div dir="rtl" className="flex flex-col gap-4">
      <p>
        החישוב המדויק שמאחורי שתי העקומות. גם <strong className="text-[var(--c-text-3)]"><bdi>A(t)</bdi></strong> (דירה)
        וגם <strong className="text-[var(--c-text-3)]"><bdi>P(t)</bdi></strong> (פסיבי) מתחילות מאותו הון התחלתי{' '}
        <strong className="text-[var(--c-text-3)]"><bdi>E</bdi></strong> - הון עצמי + מס רכישה + עלויות עסקה - ומראות
        את הרווח הנקי אם תצאו בחודש <strong className="text-[var(--c-text-3)]"><bdi>t</bdi></strong>.
      </p>

      <HoodSection isRTL={isRTL} defaultOpen title={<><bdi>דירה · A(t)</bdi></>} summary="מה שתקבלו אם תמכרו את הדירה בחודש t.">
        <HoodFormula>{`A(t) =  SaleValue(t)
      − SellingCosts(t)
      − RemainingMortgage(t)
      − E
      − CumulativeExpenses(t)
      + CumulativeCashFlow(t)
      − BettermentTax(t)
      − PrepaymentFee(t)`}</HoodFormula>
        <HoodDefList>
          <HoodDefRow term="SaleValue(t)">מחיר הרכישה שגדל בקצב עליית הערך, בריבית-דריבית חודשית</HoodDefRow>
          <HoodDefRow term="SellingCosts(t)"><span dir="ltr">SaleValue(t)</span> × אחוז עלויות המכירה</HoodDefRow>
          <HoodDefRow term="RemainingMortgage(t)">היתרה מלוח הסילוקין</HoodDefRow>
          <HoodDefRow term="CumulativeCashFlow(t)">סכום מצטבר של (שכירות − משכנתה − תחזוקה); בדרך כלל שלילי, כי המשכנתה גבוהה מהשכירות</HoodDefRow>
          <HoodDefRow term="BettermentTax(t)">מס שבח - ראו בסעיף בהמשך</HoodDefRow>
          <HoodDefRow term="PrepaymentFee(t)">קנס פירעון מוקדם - ראו בסעיף בהמשך</HoodDefRow>
        </HoodDefList>
      </HoodSection>

      <HoodSection isRTL={isRTL} defaultOpen title={<><bdi>פסיבי · P(t)</bdi></>} summary="אותו הון מושקע בקרן פסיבית במקום, בניכוי מס במימוש.">
        <HoodFormula>{`P(t) = (Portfolio(t) − CostBasis(t)) × (1 − 25%)`}</HoodFormula>
        <HoodDefList>
          <HoodDefRow term="Portfolio(t)"><span dir="ltr">E</span> שמושקע ביום הראשון, בריבית-דריבית חודשית לפי התשואה הפסיבית, בתוספת הגירעון של כל חודש (משכנתה − שכירות − תחזוקה, כשהוא חיובי) שנוסף ומצטבר</HoodDefRow>
          <HoodDefRow term="CostBasis(t)"><span dir="ltr">E</span> + סך הגירעונות שהושקעו</HoodDefRow>
          <HoodDefRow term="25%">מס רווח הון, מוחל על הרווח במימוש בלבד</HoodDefRow>
        </HoodDefList>
      </HoodSection>

      <HoodSection isRTL={isRTL} title="השכרה מול מגורים" summary="מהיכן מגיעה השכירות בתזרים, ועל מה מבוססת התחזוקה.">
        <HoodNote>בתזרים מופיע מונח שכירות אחד, אך משמעותו שונה בכל מצב. <strong className="text-[var(--c-text-3)]">השכרה:</strong> השכירות היא מה ששוכר משלם לכם - שכר הדירה של הדירה עצמה בשוק. <strong className="text-[var(--c-text-3)]">מגורים:</strong> אינכם גובים שכר דירה אך חוסכים תשלום שכר דירה במקום אחר, ושכר הדירה הנחסך תופס את מקום השכירות בתזרים, שכן חיסכון בתשלום שקול כלכלית לקבלתו.</HoodNote>
        <HoodNote>בכל מקרה, <strong className="text-[var(--c-text-3)]">התחזוקה היא תמיד אחוז משכר הדירה של הדירה עצמה בשוק</strong> - היא עלות של הנכס עצמו, ללא תלות במה שהייתם משלמים כדי לגור במקום אחר. לכן במצב המגורים מוגדרים שני שכרי דירה: שכר הדירה בשוק (בסיס התחזוקה) ושכר הדירה שהייתם משלמים (התועלת). הגדירו אותם שווים והתוצאה במגורים זהה להשכרה.</HoodNote>
      </HoodSection>

      <HoodSection isRTL={isRTL} title="מס שבח" summary="מס המכירה של הדירה, מודע לתקרה כשחל פטור.">
        <HoodFormula>{`Taxable portion = max(0, SaleValue − 5,008,000) / SaleValue   (when exempt)
BettermentTax   = RealGain × Taxable portion × 25%`}</HoodFormula>
        <HoodNote>ללא פטור, מלוא הרווח ממוסה ב-<span dir="ltr">25%</span>. זוהי הפשטה - מס שבח בפועל מחושב על הרווח הריאלי הצמוד למדד לאחר ניכוי הוצאות מוכרות.</HoodNote>
        <HoodNote>הפטור לדירה יחידה מותנה גם בבעלות של לפחות <bdi>18</bdi> חודשים. מכירה מוקדמת יותר ממוסה במלואה ב-<span dir="ltr">25%</span>, ולכן במצב פטור <bdi>A(t)</bdi> עולה מדרגה בחודש ה-<bdi>18</bdi>.</HoodNote>
      </HoodSection>

      <HoodSection isRTL={isRTL} title="קנס פירעון מוקדם" summary="עמלת היוון על פירעון מוקדם של המשכנתה כשריבית השוק ירדה.">
        <HoodFormula>{`rc = MortgageRate / 12
rm = MarketRate / 12
n  = months remaining

AF(r, n) = (1 − (1 + r)^(−n)) / r        (= n when r = 0)

PrepaymentFee(t) = max(0, MonthlyPayment × (AF(rm, n) − AF(rc, n)))`}</HoodFormula>
        <HoodNote>מכירה לפני תום תקופת המשכנתה משמעה פירעון היתרה מוקדם. אם ריבית השוק ירדה מתחת לריבית החוזית שלכם, הבנק גובה עמלת היוון על הריבית שהוא מפסיד. מחוון ירידת הריבית קובע עד כמה ריבית השוק נמוכה מהריבית החוזית, כך שפער גדול יותר משמעו קנס גדול יותר, ואם הריבית עלתה או נותרה ללא שינוי הקנס אפס. הקנס הוא הערך הנוכחי של הריבית האבודה: כל תשלום עתידי שנותר מהוון בריבית השוק לעומת הריבית החוזית, וההפרש בין שני הערכים הנוכחיים הללו הוא הקנס.</HoodNote>
        <HoodNote><strong className="text-[var(--c-text-3)]">ריבית אחת מול לפי מסלול:</strong> במצב ריבית אחת הקנס מחושב על מלוא היתרה - הערכה מעט שמרנית, שכן מסלול הפריים פטור על־פי חוק. מעבר להזנה לפי מסלול מחריג את מסלול הפריים ומחייב רק את המסלול הקבוע והמשתנה.</HoodNote>
      </HoodSection>

      <HoodSection isRTL={isRTL} title={<><bdi>תשואה שנתית · IRR</bdi></>} summary="התשואה השנתית שמאפסת את הערך הנוכחי של כל סדרת התזרימים.">
        <HoodNote>עבור כל חודש יציאה אפשרי, פותרים את סדרת התזרימים החודשית (<span dir="ltr">−E</span> בחודש <span dir="ltr">0</span>, תזרימים חודשיים, התמורה ביציאה) עבור הריבית שמאפסת את הערך הנוכחי הנקי, וממירים לתשואה שנתית. בפריסה על פני כל חודשי היציאה מתקבלות עקומות ה-<span dir="ltr">IRR</span>.</HoodNote>
      </HoodSection>

      <HoodSection isRTL={isRTL} title="היקף המודל" summary="נתונים נומינליים; המחשבון מדמה רכישה ← השכרה ← מכירה.">
        <HoodNote>כל הנתונים נומינליים - שני התרחישים מושפעים מאינפלציה באופן דומה, ולכן ההשוואה תקפה.</HoodNote>
        <HoodNote>המחשבון מדמה רכישה ← השכרה ← מכירה. בכל חודש שבו המשכנתה גדולה מהשכירות, ההפרש מושקע בתרחיש הפסיבי; חודש עם תזרים חיובי לא מוסיף לתיק.</HoodNote>
      </HoodSection>
    </div>
  )
}
