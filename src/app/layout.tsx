import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/layout/PageTransition'

export const metadata: Metadata = {
  title: {
    default:  'Fad Élan — Authentic Pre-Loved Luxury Bags Philippines',
    template: '%s — Fad Élan',
  },
  description:
    'Shop authentic pre-loved luxury bags at Fad Élan. Hermès, Chanel, Louis Vuitton, and more. Ships nationwide. Local meetups in Pampanga.',
  keywords: ['luxury bags', 'pre-loved', 'authentic', 'Philippines', 'Chanel', 'Louis Vuitton', 'Hermès'],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fadelan-website.vercel.app'
  ),
  openGraph: {
    type:        'website',
    siteName:    'Fad Élan',
    title:       'Fad Élan — Authentic Pre-Loved Luxury Bags Philippines',
    description: 'Shop authentic pre-loved luxury bags at Fad Élan. Hermès, Chanel, Louis Vuitton, and more. Ships nationwide. Local meetups in Pampanga.',
    locale:      'en_PH',
    url:         process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fadelan-website.vercel.app',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Fad Élan — Authentic Pre-Loved Luxury Bags Philippines',
    description: 'Shop authentic pre-loved luxury bags at Fad Élan. Ships nationwide.',
  },
  robots: {
    index:  true,
    follow: true,
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
        <PageTransition>
          <main>
            {children}
          </main>
        </PageTransition>
        {!isAdmin && <Footer />}
      </body>
    </html>
  )
}