import { sanityFetch } from '@/lib/sanity'
import { CATALOG_QUERY, FILTER_OPTIONS_QUERY } from '@/lib/queries'
import type { BagListItem, FilterOptions } from '@/lib/queries'
import CatalogHero from '@/components/catalog/CatalogHero'
import CatalogClient from '@/components/catalog/CatalogClient'

export const metadata = {
  title: 'Catalog — Fadelan',
  description:
    'Browse our curated selection of authenticated pre-loved luxury bags — each one verified, one of a kind.',
}

export default async function CatalogPage() {
  const [bags, filterOptions] = await Promise.all([
    sanityFetch<BagListItem[]>(CATALOG_QUERY),
    sanityFetch<FilterOptions>(FILTER_OPTIONS_QUERY),
  ])

  return (
    <main className="min-h-screen bg-ivory">
      <CatalogHero />
      <CatalogClient bags={bags} filterOptions={filterOptions} />
    </main>
  )
}