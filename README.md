# Israeli Apartment Investment Calculator

A free, interactive tool for comparing a residential real estate 
investment against passive stock market investment in the Israeli market.

**Live app:** https://apartment-calc.com

## What it does

Models two scenarios for the same starting capital:

- **Apartment scenario** — buy an apartment with a mortgage, rent it 
  out, sell at any point. Net gain accounts for appreciation, rent 
  income, mortgage payments, maintenance, purchase tax, selling costs, 
  and מס שבח.
- **Passive scenario** — invest the same capital (down payment + all 
  purchase costs) in a stock index fund. Monthly mortgage shortfalls 
  are also invested. Net gain after capital gains tax at realization.

The chart shows which scenario wins at every point in time, and when 
the crossover happens.

## Features

- Bilingual: Hebrew (RTL) + English
- Dark and light theme
- Purchase tax calculator (דירה נוספת / דירתי היחידה)
- מס שבח toggle with co-ownership note
- Prepayment fee threshold (עמלת פירעון מוקדם)
- Cash flow tab: rent vs mortgage and monthly flow views
- Live BOI prime rate fetch for mortgage rate default

## Stack

Next.js 15 · TypeScript · Tailwind CSS · Recharts · Firebase Hosting

## License

© 2026 Matan Eldar.

Free to use and adapt with attribution — credit the original project and author in any derivative work.  
Commercial use of this code requires prior permission — open a GitHub issue or contact me directly.
