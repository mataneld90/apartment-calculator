import type { Metadata } from 'next'
import Script from 'next/script'
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
      <body>
        {children}
        {/* Cloudflare Web Analytics — cookie-free, no consent banner */}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon='{"token": "a4bd02f04de24a038d2a18a2b01a1fc0"}'
        />
      </body>
    </html>
  )
}
