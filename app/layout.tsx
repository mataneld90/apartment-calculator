import type { Metadata } from 'next'
import Analytics from '@/components/Analytics'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://apartment-calc.com'),
  title: 'מחשבון דירה להשקעה מול שוק ההון | השוואה לישראל',
  description:
    'מחשבון חינמי שמשווה דירה להשקעה מול שוק ההון: מתי קניית דירה עדיפה על השקעה פסיבית במדד. מתחשב במס שבח, מסלולי משכנתה, עמלת פירעון מוקדם, תזרים מזומנים ו-IRR.',
  alternates: { canonical: '/' },
  // Google Search Console (HTML-tag method): replace the placeholder below with the
  // token from Search Console > Settings > Ownership verification > HTML tag.
  verification: { google: 'PASTE_SEARCH_CONSOLE_TOKEN_HERE' },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: '/',
    title: 'דירה להשקעה מול שוק ההון - מתי קנייה מנצחת?',
    description:
      'מחשבון להשוואת דירה להשקעה מול השקעה פסיבית במדד, נטו ממס שבח ומעמלת פירעון מוקדם. מצאו את נקודת המפנה.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
