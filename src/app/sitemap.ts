// src/app/sitemap.ts
// ─────────────────────────────────────────────────────────────
// Auto-generated sitemap.xml for Google indexing.
// Pulls all bag slugs from Sanity at build time.
// Access at: https://www.fadelan.com/sitemap.xml
// ─────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { sanityFetch }        from '@/lib/sanity'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fadelan.com'

const SITEMAP_BAGS_QUERY = /* groq */ `
  *[_type == "bag" && (availability != "sold" || showWhenSold == true)] {
    "slug": slug.current,
    _updatedAt
  }
`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ──────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:              `${BASE_URL}`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         1.0,
    },
    {
      url:              `${BASE_URL}/catalog`,
      lastModified:     new Date(),
      changeFrequency:  'daily',   // bags added/sold frequently
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/how-to-buy`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.7,
    },
    {
      url:              `${BASE_URL}/about`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.6,
    },
    {
      url:              `${BASE_URL}/contact`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.5,
    },
  ]

  // ── Dynamic bag pages ─────────────────────────────────────
  let bagPages: MetadataRoute.Sitemap = []

  try {
    const bags = await sanityFetch<{ slug: string; _updatedAt: string }[]>(
      SITEMAP_BAGS_QUERY,
      {},
      { revalidate: 0 }
    )

    bagPages = bags
      .filter((b) => b.slug) // skip any bags with missing slugs
      .map((b) => ({
        url:             `${BASE_URL}/catalog/${b.slug}`,
        lastModified:    new Date(b._updatedAt),
        changeFrequency: 'weekly' as const,
        priority:        0.8,
      }))
  } catch (err) {
    // Don't crash the build if Sanity is unreachable
    console.error('[sitemap] Failed to fetch bag slugs:', err)
  }

  return [...staticPages, ...bagPages]
}