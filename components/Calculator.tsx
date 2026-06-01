'use client'

import { useState, useMemo, useEffect } from 'react'
import { compute, DEFAULT_PARAMS } from '@/lib/model'
import type { Params } from '@/lib/types'
import { LANG, type Lang } from '@/lib/i18n'
import dynamic from 'next/dynamic'
import Sliders from './Sliders'
import ResultCards from './ResultCards'

const Chart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 360, marginTop: 16 }} className="bg-[#1e293b] rounded-lg animate-pulse" />
  ),
})

export default function Calculator() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS)
  const [lang, setLang] = useState<Lang>('en')
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  const results = useMemo(() => compute(params), [params])
  const t = LANG[lang]
  const isRTL = lang === 'he'

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, isRTL])

  function update<K extends keyof Params>(key: K, value: Params[K]) {
    setParams((p) => ({ ...p, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="border-b border-[#334155] px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white leading-tight">{t.title}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">{t.subtitle}</p>
          </div>
          <button
            onClick={() => setLang((l) => (l === 'en' ? 'he' : 'en'))}
            className="shrink-0 px-3 py-1.5 rounded bg-slate-700 border border-slate-500 text-slate-200 text-sm font-medium hover:bg-slate-600 hover:text-white transition-colors"
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      {/* Main — desktop: left sliders | center (chart + cards) | right sliders */}
      <main className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:grid lg:grid-cols-[360px_1fr_360px] lg:items-start gap-4">

        {/* Center: chart + result cards below — order-1 mobile, order-2 desktop */}
        <div className="order-1 lg:order-2 flex flex-col gap-3">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
            <Chart points={results.points} crossover={results.crossover} t={t} />
          </div>
          <ResultCards results={results} params={params} t={t} />
        </div>

        {/* Left sliders: Apartment + Mortgage — order-2 mobile, order-1 desktop */}
        <aside className="order-2 lg:order-1">
          <Sliders
            params={params}
            update={update}
            results={results}
            t={t}
            isRTL={isRTL}
            only={['apartment', 'mortgage', 'passive']}
          />
        </aside>

        {/* Right sliders: At Purchase + At Sale + Passive + Misc — order-3 both */}
        <aside className="order-3">
          <Sliders
            params={params}
            update={update}
            results={results}
            t={t}
            isRTL={isRTL}
            only={['costs', 'selling', 'misc']}
          />
        </aside>
      </main>

      {/* Methodology note */}
      <footer className="max-w-7xl mx-auto px-4 pb-8">
        <div className="border border-[#334155] rounded-lg overflow-hidden">
          <button
            onClick={() => setMethodologyOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <span className="font-medium">{t.methodologyTitle}</span>
            <span className="text-slate-500 text-xs">{methodologyOpen ? '▲' : '▼'}</span>
          </button>
          {methodologyOpen && (
            <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-[#334155]">
              {lang === 'en' ? <MethodologyEN /> : <MethodologyHE />}
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}

function MethodologyEN() {
  return (
    <div className="pt-3 flex flex-col gap-3">
      <p>The calculator compares two scenarios for the same capital:</p>
      <p>
        <strong className="text-slate-300">Apartment scenario N(x):</strong> You buy an
        investment apartment with a mortgage and rent it out. N(x) is your net gain if you sold at
        month x — net sale proceeds (after selling costs and מס שבח if applicable), plus all
        cumulative rent received, minus total purchase expenses and remaining mortgage principal.
      </p>
      <p>
        <strong className="text-slate-300">Passive scenario P(x):</strong> You invest the same
        capital (down payment + all purchase costs) in an S&amp;P 500 index fund. P(x) is your
        after-tax net gain, assuming you also reinvest the monthly difference between mortgage
        payment and rent into the fund. Capital gains tax applies at realization.
      </p>
      <p>The crossover month is when N(x) first exceeds P(x).</p>
      <p className="font-medium text-slate-300">Key assumptions:</p>
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
        <strong className="text-slate-300">תרחיש דירה N(x):</strong> קונים דירת השקעה במשכנתא
        ומשכירים. N(x) הוא הרווח הנקי אם תמכרו בחודש x — תמורת מכירה נטו (לאחר עלויות מכירה
        ומס שבח אם חל), בתוספת כל השכירות שנצברה, בניכוי הוצאות הרכישה הכוללות ויתרת המשכנתא.
      </p>
      <p>
        <strong className="text-slate-300">תרחיש פסיבי P(x):</strong> משקיעים את אותו ההון
        (מקדמה + כל עלויות הרכישה) במדד S&amp;P 500. P(x) הוא הרווח הנקי לאחר מס, בהנחה שגם
        ההפרש החודשי בין תשלום המשכנתא לשכירות מושקע בקרן. מס רווח הון חל בממוש.
      </p>
      <p>נקודת המעבר היא החודש שבו N(x) עולה לראשונה על P(x).</p>
      <p className="font-medium text-slate-300">הנחות מרכזיות:</p>
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
