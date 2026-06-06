import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Apartment vs. Passive Investment Calculator | Israel',
  description:
    'See when buying an investment apartment in Israel beats investing the same capital passively in the stock market. Free calculator with Israeli mortgage, purchase tax, and מס שבח.',
  openGraph: {
    title: 'Apartment vs. Passive Investment — When does buying win?',
    description:
      'Israeli real estate vs. passive investment calculator. Find your crossover month.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
