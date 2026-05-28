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
        <Header heroIsDark={true} />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

import { Cormorant_Garamond, Inter } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Apply to <html>:
// className={`${cormorant.variable} ${inter.variable}`}