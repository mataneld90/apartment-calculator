'use client'

import { useState, useMemo, useEffect } from 'react'
import { compute, DEFAULT_PARAMS } from '@/lib/model'
import type { Params } from '@/lib/types'
import { LANG, type Lang } from '@/lib/i18n'
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
  const [isDark, setIsDark] = useState(false)

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
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--c-text)] overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

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
      <header className="border-b border-[var(--c-border)] px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold leading-tight">{t.title}</h1>
            <p className="text-sm text-[var(--c-muted)] mt-1 max-w-2xl">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            <button onClick={() => setMethodologyOpen(true)} className={BTN}>
              {t.methodologyTitle}
            </button>
            <button
              onClick={() => setIsDark(d => !d)}
              className={isDark
                ? BTN
                : 'px-3 py-1.5 rounded bg-slate-500 border border-slate-500 text-white text-sm font-medium hover:bg-slate-600 transition-colors'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setLang(l => l === 'en' ? 'he' : 'en')} className={BTN}>
              {t.langToggle}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:grid lg:grid-cols-[360px_1fr_360px] lg:items-start gap-4">

        {/* Center: chart */}
        <div className="order-1 lg:order-2">
          <div className="bg-[var(--bg-panel)] border border-[var(--c-border)] rounded-lg p-4">
            <Chart points={results.points} crossovers={results.crossovers} G0={params.G0} onG0Change={(v) => update('G0', v)} t={t} />
          </div>
        </div>

        {/* Left sliders */}
        <aside className="order-2 lg:order-1">
          <Sliders params={params} update={update} results={results} t={t} isRTL={isRTL} only={['apartment', 'mortgage', 'passive']} />
        </aside>

        {/* Right sliders */}
        <aside className="order-3">
          <Sliders params={params} update={update} results={results} t={t} isRTL={isRTL} only={['costs', 'selling']} />
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
        investment apartment with a mortgage and rent it out. The apartment gain at any month is
        your net gain if you sold then — net sale proceeds (after selling costs and מס שבח if
        applicable), plus all cumulative rent received, minus total purchase expenses and
        remaining mortgage principal.
      </p>
      <p>
        <strong className="text-[var(--c-text-3)]">Passive scenario:</strong> You invest the same
        capital (down payment + all purchase costs) in an S&amp;P 500 index fund. The passive
        gain is your after-tax net gain, assuming you also reinvest the monthly difference between
        mortgage payment and rent into the fund. Capital gains tax applies at realization.
      </p>
      <p>The crossover point is when the apartment scenario first overtakes the passive investment.</p>
      <p className="font-medium text-[var(--c-text-3)]">Key assumptions:</p>
      <ul className="list-disc list-inside flex flex-col gap-1 ml-2">
        <li>Spitzer (שפיצר) amortization — fixed monthly payment, standard in Israel</li>
        <li>Purchase tax: investor brackets (8% flat) or single apartment (graduated)</li>
        <li>מס שבח: 25% on real estate gain, or exempt depending on your situation</li>
        <li>All figures are nominal ILS — no inflation adjustment</li>
        <li>Passive return is net of fund management fees (~0.2%/yr)</li>
        <li>This models the rental investment scenario only (buy → rent → sell)</li>
      </ul>
    </div>
  )
}

function MethodologyHE() {
  return (
    <div className="pt-3 flex flex-col gap-3">
      <p>המחשבון משווה שני תרחישים עבור אותו הון:</p>
      <p>
        <strong className="text-[var(--c-text-3)]">תרחיש דירה:</strong> קונים דירת השקעה במשכנתא
        ומשכירים. הרווח מהדירה בכל חודש הוא הרווח הנקי אם תמכרו אז — תמורת מכירה נטו (לאחר
        עלויות מכירה ומס שבח אם חל), בתוספת כל השכירות שנצברה, בניכוי הוצאות הרכישה הכוללות
        ויתרת המשכנתא.
      </p>
      <p>
        <strong className="text-[var(--c-text-3)]">תרחיש פסיבי:</strong> משקיעים את אותו ההון
        (מקדמה + כל עלויות הרכישה) במדד S&amp;P 500. הרווח הפסיבי הוא הרווח הנקי לאחר מס,
        בהנחה שגם ההפרש החודשי בין תשלום המשכנתא לשכירות מושקע בקרן. מס רווח הון חל בממוש.
      </p>
      <p>נקודת המעבר היא החודש שבו הרווח מהדירה עולה לראשונה על ההשקעה הפסיבית.</p>
      <p className="font-medium text-[var(--c-text-3)]">הנחות מרכזיות:</p>
      <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
        <li>שיטת שפיצר — תשלום חודשי קבוע, סטנדרט בישראל</li>
        <li>מס רכישה: מדרגות משקיע (8% שטוח) או דירה יחידה (מדרגות)</li>
        <li>מס שבח: 25% על הרווח הריאלי, או פטור בהתאם למצב</li>
        <li>כל הנתונים בשקלים נומינליים — ללא התאמה לאינפלציה</li>
        <li>תשואה פסיבית נטו מדמי ניהול (~0.2%/שנה)</li>
        <li>המחשבון מדמה תרחיש השכרה בלבד (קנייה ← השכרה ← מכירה)</li>
      </ul>
    </div>
  )
}
