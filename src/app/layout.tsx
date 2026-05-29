import type { Metadata } from 'next'
import { headers } from 'next/headers'
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname    = headersList.get('x-pathname') ?? ''
  const isAdmin     = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <body>
        {!isAdmin && <Header heroIsDark={true} />}
        <main>
          {children}
        </main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  )
}
