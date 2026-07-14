import { sanityFetch } from '@/lib/sanity'
import { CATALOG_QUERY, FILTER_OPTIONS_QUERY } from '@/lib/queries'
import type { BagListItem, FilterOptions } from '@/lib/queries'
import CatalogHero from '@/components/catalog/CatalogHero'
import CatalogClient from '@/components/catalog/CatalogClient'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata = {
  title: 'Catalog — Fadelan',
  description:
    'Browse our curated selection of authenticated pre-loved luxury bags — each one verified, one of a kind.',
}
export const revalidate = 60

export default async function CatalogPage() {
  const [bags, filterOptions] = await Promise.all([
    sanityFetch<BagListItem[]>(CATALOG_QUERY),
    sanityFetch<FilterOptions>(FILTER_OPTIONS_QUERY),
  ])

  return (
    <main className="min-h-screen bg-ivory">
      <CatalogHero />
      <ScrollReveal>
        <CatalogClient bags={bags} filterOptions={filterOptions} />
      </ScrollReveal>
    </main>
  )
}