// src/lib/structuredData.ts
// ─────────────────────────────────────────────────────────────
// Builds JSON-LD Product structured data for bag detail pages.
// Lets Google show rich results (price, availability) in search.
// ─────────────────────────────────────────────────────────────

import type { BagDetail } from './queries'
import { BRAND_LABELS }   from './sanity'
import type { PortableTextBlock } from '@portabletext/types'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fadelan.com'

// Flattens PortableText blocks into a plain string for schema.org's
// description field — no rich text needed here, just the raw words.
function flattenPortableText(blocks?: PortableTextBlock[]): string {
  if (!blocks || blocks.length === 0) return ''
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !Array.isArray(block.children)) return ''
      return block.children.map((child) => child.text ?? '').join('')
    })
    .join(' ')
    .trim()
}

function mapAvailability(availability: string): string {
  switch (availability) {
    case 'available':
      return 'https://schema.org/InStock'
    case 'reserved':
      return 'https://schema.org/LimitedAvailability'
    case 'sold':
      return 'https://schema.org/OutOfStock'
    default:
      return 'https://schema.org/InStock'
  }
}

function mapCondition(condition: string): string {
  return condition === 'brand_new'
    ? 'https://schema.org/NewCondition'
    : 'https://schema.org/UsedCondition'
}

export function buildBagProductSchema(bag: BagDetail) {
  const brandLabel = BRAND_LABELS[bag.brand] ?? bag.brand
  const description =
    flattenPortableText(bag.description) ||
    `${brandLabel} ${bag.name} — pre-loved luxury bag available at Fad Élan.`

  const images = (bag.photos ?? [])
    .map((p) => p.asset?.url)
    .filter((url): url is string => Boolean(url))

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${brandLabel} ${bag.name}`,
    description,
    image: images.length > 0 ? images : undefined,
    sku: bag._id,
    brand: {
      '@type': 'Brand',
      name: brandLabel,
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/catalog/${bag.slug.current}`,
      priceCurrency: 'PHP',
      price: bag.price,
      itemCondition: mapCondition(bag.condition),
      availability: mapAvailability(bag.availability),
      seller: {
        '@type': 'Organization',
        name: 'Fad Élan',
      },
    },
  }
}