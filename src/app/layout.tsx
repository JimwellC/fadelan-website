import type { Metadata } from 'next'
import './globals.css'
import PageTransition  from '@/components/layout/PageTransition'
import PublicShell     from '@/components/layout/PublicShell'
import { sanityFetch } from '@/lib/sanity'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings }   from '@/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>(
    SITE_SETTINGS_QUERY, {}, { revalidate: 3600 }
  )

  return {
    title: {
      default:  'Fad Élan — Authentic Pre-Loved Luxury Bags Philippines',
      template: '%s — Fad Élan',
    },
    description:
      'Shop authentic pre-loved luxury bags at Fad Élan. Hermès, Chanel, Louis Vuitton, and more. Ships nationwide. Local meetups in Pampanga.',
    keywords: ['luxury bags', 'pre-loved', 'authentic', 'Philippines', 'Chanel', 'Louis Vuitton', 'Hermès'],
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fadelan.com'
    ),
    icons: {
      icon: [
        {
          url:  settings?.favicon?.url ?? '/favicon.ico',
          type: 'image/png',
        }
      ],
    },
    openGraph: {
      type:        'website',
      siteName:    'Fad Élan',
      title:       'Fad Élan — Authentic Pre-Loved Luxury Bags Philippines',
      description: 'Shop authentic pre-loved luxury bags at Fad Élan. Hermès, Chanel, Louis Vuitton, and more. Ships nationwide. Local meetups in Pampanga.',
      locale:      'en_PH',
      url:         process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fadelan.com',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PublicShell>
          <PageTransition>
            <main>
              {children}
            </main>
          </PageTransition>
        </PublicShell>
      </body>
    </html>
  )
}