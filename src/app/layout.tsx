import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default:  'Fad Élan — Authentic Pre-loved Luxury Bags',
    template: '%s — Fad Élan',
  },
  description:
    'A curated collection of authenticated pre-loved luxury bags. Sourced with care, photographed honestly, shipped nationwide and internationally from the Philippines.',
  keywords: ['luxury bags', 'pre-loved', 'authentic', 'Philippines', 'Chanel', 'Louis Vuitton', 'Hermès'],
  openGraph: {
    siteName: 'Fad Élan',
    locale:   'en_PH',
    type:     'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ paddingTop: '4rem' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}