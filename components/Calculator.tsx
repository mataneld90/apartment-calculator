'use client'

import { useState, useMemo, useEffect } from 'react'
import { compute, DEFAULT_PARAMS } from '@/lib/model'
import type { Params } from '@/lib/types'
import { LANG, type Lang } from '@/lib/i18n'
import { useColorPalette } from '@/lib/colorPalette'
import dynamic from 'next/dynamic'
import Sliders from './Sliders'

const Chart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 360, marginTop: 16 }} className="bg-[var(--bg-panel)] rounded-lg animate-pulse" />
  ),
})

const BTN = 'px-3 py-1.5 rounded bg-[var(--bg-control)] border border-[var(--c-border)] text-[var(--c-text-3)] text-sm font-medium hover:border-[var(--c-border-hover)] hover:text-[var(--c-text)] transition-colors'

export default function Calculator() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS)
  const [lang, setLang] = useState<Lang>('he')
  const [methodologyOpen, setMethodologyOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => { const h = new Date().getHours(); return h >= 19 || h < 7 })
  const { palette, colorblindMode, toggleColorblind } = useColorPalette(isDark)
  const [masShvachAutoUpdated, setMasShvachAutoUpdated] = useState(false)

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

  function update<K extends keyof Params>(key: K, value: Params[K]) {
    setParams((p) => ({ ...p, [key]: value }))
  }

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col md:block md:h-auto md:overflow-visible md:min-h-screen bg-[var(--bg-page)] text-[var(--c-text)]" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Methodology modal */}
      {methodologyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setMethodologyOpen(false)}
        >
          <div
            className="bg-[var(--bg-page)] border border-[var(--c-border)] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-sm text-[var(--c-text)]">{t.methodologyTitle}</span>
              <button
                onClick={() => setMethodologyOpen(false)}
                className="text-[var(--c-muted)] hover:text-[var(--c-text)] leading-none text-base px-1"
              >✕</button>
            </div>
            <div className="text-xs text-[var(--c-muted)] leading-relaxed">
              {lang === 'en' ? <MethodologyEN /> : <MethodologyHE />}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="shrink-0 border-b border-[var(--c-border)] px-4 py-1.5 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="sm:flex-1 sm:min-w-0">
            <h1 className="text-sm sm:text-xl font-bold leading-tight">{t.title}</h1>
            <p className="hidden sm:block text-sm text-[var(--c-muted)] mt-1 max-w-2xl">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 sm:shrink-0 sm:flex-wrap sm:justify-end mt-1 sm:mt-0">
            <button onClick={() => setMethodologyOpen(true)} className="px-2 py-0.5 sm:px-3 sm:py-1.5 rounded bg-[var(--bg-control)] border border-[var(--c-border)] text-[var(--c-text-3)] text-xs sm:text-sm font-medium hover:border-[var(--c-border-hover)] hover:text-[var(--c-text)] transition-colors">
              {t.methodologyTitle}
            </button>
            <button
              onClick={() => setIsDark(d => !d)}
              className={isDark
                ? 'px-2 py-0.5 sm:px-3 sm:py-1.5 rounded bg-[var(--bg-control)] border border-[var(--c-border)] text-[var(--c-text-3)] text-xs sm:text-sm font-medium hover:border-[var(--c-border-hover)] hover:text-[var(--c-text)] transition-colors'
                : 'px-2 py-0.5 sm:px-3 sm:py-1.5 rounded bg-slate-500 border border-slate-500 text-white text-xs sm:text-sm font-medium hover:bg-slate-600 transition-colors'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={toggleColorblind}
              title={isRTL ? 'צבעים נגישים' : 'Accessible colors'}
              className={`px-2 py-0.5 sm:px-3 sm:py-1.5 rounded border text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 ${
                colorblindMode
                  ? 'bg-slate-600 text-white border-slate-600'
                  : 'bg-[var(--bg-control)] border-[var(--c-border)] text-[var(--c-text-3)] hover:border-[var(--c-border-hover)] hover:text-[var(--c-text)]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span className="hidden sm:inline">{isRTL ? 'צבעים נגישים' : 'Accessible colors'}</span>
            </button>
            <button onClick={() => setLang(l => l === 'en' ? 'he' : 'en')} className="px-2 py-0.5 sm:px-3 sm:py-1.5 rounded bg-[var(--bg-control)] border border-[var(--c-border)] text-[var(--c-text-3)] text-xs sm:text-sm font-medium hover:border-[var(--c-border-hover)] hover:text-[var(--c-text)] transition-colors">
              {t.langToggle}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile split layout — only visible below 768px */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Top: chart fixed at ~55dvh */}
        <div className="shrink-0 h-[55dvh] overflow-hidden p-3 pb-1.5">
          <div className="bg-[var(--bg-panel)] border border-[var(--c-border)] rounded-lg p-3 h-full">
            <Chart points={results.points} crossovers={results.crossovers} t={t} isRTL={isRTL} fill palette={palette} />
          </div>
        </div>
        {/* Bottom: sliders, independently scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 pt-1">
          <Sliders
            params={params} update={update} results={results} t={t} isRTL={isRTL}
            only={['costs', 'apartment', 'mortgage', 'selling', 'passive']}
            masShvachAutoUpdated={masShvachAutoUpdated}
            setMasShvachAutoUpdated={setMasShvachAutoUpdated}
            palette={palette}
          />
        </div>
      </div>

      {/* Desktop/tablet layout — hidden below 768px, unchanged above */}
      <main className="hidden md:flex flex-col lg:grid lg:grid-cols-[360px_1fr_360px] lg:items-start gap-4 max-w-7xl mx-auto px-4 py-4">

        {/* Center: chart */}
        <div className="order-1 lg:order-2">
          <div className="bg-[var(--bg-panel)] border border-[var(--c-border)] rounded-lg p-4">
            <Chart points={results.points} crossovers={results.crossovers} t={t} isRTL={isRTL} palette={palette} />
          </div>
        </div>

        {/* Left sliders */}
        <aside className="order-2 lg:order-1">
          <Sliders params={params} update={update} results={results} t={t} isRTL={isRTL} only={['apartment', 'mortgage', 'passive']}
            masShvachAutoUpdated={masShvachAutoUpdated} setMasShvachAutoUpdated={setMasShvachAutoUpdated} palette={palette} />
        </aside>

        {/* Right sliders */}
        <aside className="order-3">
          <Sliders params={params} update={update} results={results} t={t} isRTL={isRTL} only={['costs', 'selling']}
            masShvachAutoUpdated={masShvachAutoUpdated} setMasShvachAutoUpdated={setMasShvachAutoUpdated} palette={palette} />
        </aside>
      </main>
    </div>
  )
}

function MethodologyEN() {
  return (
    <div className="pt-3 flex flex-col gap-3">
      <p>The calculator compares two scenarios for the same capital:</p>
      <p>
        <strong className="text-[var(--c-text-3)]">Apartment scenario:</strong> You buy an
        apartment with a mortgage and rent it out. The gain at each month is what you'd walk away
        with if you sold then — sale price minus remaining mortgage principal, minus total purchase
        costs, minus selling costs, minus real estate capital gains tax (מס שבח) if applicable.
      </p>
      <p>
        <strong className="text-[var(--c-text-3)]">Passive scenario:</strong> You invest the same
        capital (down payment + all purchase costs) in a stock market index (e.g. S&amp;P 500 or
        MSCI World). Additionally, every monthly difference between the mortgage payment and rent —
        positive or negative — is invested in or withdrawn from the portfolio. The passive gain is the
        net return after capital gains tax at realization (25%).
      </p>
      <p className="font-medium text-[var(--c-text-3)]">Chart views:</p>
      <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
        <li><strong className="text-[var(--c-text-3)]">Gains</strong> — shows both curves side by side: the apartment&apos;s net realised gain versus the passive investment&apos;s net realised gain. The points where the curves intersect are the moments when one scenario overtakes the other.</li>
        <li><strong className="text-[var(--c-text-3)]">Difference</strong> — shows the gap between the two scenarios (apartment minus passive). When the curve is above zero, the apartment is ahead. When below zero, passive investment is ahead. The height of the curve at any point shows the size of the advantage.</li>
      </ul>
      <p className="font-medium text-[var(--c-text-3)]">Key assumptions:</p>
      <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
        <li>Spitzer (שפיצר) amortization — fixed monthly payment, standard in Israel</li>
        <li>Purchase tax: 8% flat for an additional apartment (10% above ₪5,872,725); graduated rates for a first apartment.</li>
        <li>Real estate capital gains tax (מס שבח): 25% at sale, or exempt depending on your situation</li>
        <li>Capital gains tax on passive investment: 25% at realization only — not annual</li>
        <li>All figures are nominal ILS — no inflation adjustment. Both scenarios are affected by inflation similarly, so the comparison between them remains valid</li>
        <li>The calculator models a buy-to-let scenario (purchase → rent → sell).</li>
      </ul>
    </div>
  )
}

function MethodologyHE() {
  return (
    <div className="pt-3 flex flex-col gap-3">
      <p>המחשבון משווה שני תרחישים עבור אותו הון:</p>
      <p>
        <strong className="text-[var(--c-text-3)]">תרחיש דירה: </strong>קונים דירה עם משכנתה
        ומשכירים אותה. הרווח בכל חודש הוא הרווח הנקי אם תמכרו אז — מחיר המכירה בניכוי יתרת
        המשכנתה, כל הוצאות הרכישה שנצברו, עלויות המכירה, ומס שבח (אם רלוונטי).
      </p>
      <p>
        <strong className="text-[var(--c-text-3)]">תרחיש פסיבי: </strong>משקיעים את אותו ההון
        (הון עצמי + כל עלויות הרכישה) בהשקעה פסיבית במדד מניות (כגון S&amp;P 500 או MSCI World). בנוסף, כל
        הפרש חודשי בין תשלום המשכנתה לשכר הדירה — חיובי או שלילי — מושקע בתיק או נגרע ממנו. הרווח
        הפסיבי הוא הרווח הנקי לאחר מס רווח הון במימוש (25%).
      </p>
      <p className="font-medium text-[var(--c-text-3)]">תצוגות הגרף:</p>
      <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
        <li><strong className="text-[var(--c-text-3)]">רווחים</strong> — מציג את שני העקומות במקביל: רווח נקי ממומש של הדירה מול רווח נקי ממומש של ההשקעה הפסיבית. נקודות החציה בין העקומות הן הרגעים שבהם אחד התרחישים עולה על השני.</li>
        <li><strong className="text-[var(--c-text-3)]">הפרש</strong> — מציג את ההפרש בין שני התרחישים (דירה פחות פסיבי). כשהעקומה מעל האפס — הדירה עדיפה. כשהיא מתחת לאפס — ההשקעה הפסיבית עדיפה. גובה העקומה בכל נקודה מראה את גודל היתרון.</li>
      </ul>
      <p className="font-medium text-[var(--c-text-3)]">הנחות מרכזיות:</p>
      <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
        <li>שיטת שפיצר — תשלום חודשי קבוע, סטנדרט בישראל</li>
        <li>מס רכישה: 8% גורף לדירה נוספת (10% מעל ₪5,872,725); מדרגות לדירה יחידה.</li>
        <li>מס שבח: 25% על רווח הנדל&quot;ן במימוש, או פטור בהתאם למצב</li>
        <li>מס רווח הון על השקעה פסיבית: 25% במימוש בלבד — לא שנתי</li>
        <li>כל הנתונים בשקלים נומינליים — ללא התאמה לאינפלציה. שני התרחישים מושפעים מאינפלציה באופן דומה, ולכן ההשוואה ביניהם תקפה</li>
        <li>המחשבון מדמה תרחיש של רכישה, השכרה ומכירה.</li>
      </ul>
    </div>
  )
}
