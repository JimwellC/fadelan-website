// src/app/sitemap.ts
// ─────────────────────────────────────────────────────────────
// Auto-generated sitemap.xml for Google indexing.
// Pulls all bag slugs from Sanity at build time.
// Access at: https://yourdomain.com/sitemap.xml
// ─────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { sanityFetch }        from '@/lib/sanity'
import { ALL_BAG_SLUGS_QUERY } from '@/lib/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fadelan-website.vercel.app'

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
    const slugs = await sanityFetch<{ slug: string }[]>(
      ALL_BAG_SLUGS_QUERY,
      {},
      { revalidate: 3600 }
    )

    bagPages = slugs
      .filter((s) => s.slug) // skip any bags with missing slugs
      .map((s) => ({
        url:             `${BASE_URL}/bag/${s.slug}`,
        lastModified:    new Date(),
        changeFrequency: 'weekly' as const,
        priority:        0.8,
      }))
  } catch (err) {
    // Don't crash the build if Sanity is unreachable
    console.error('[sitemap] Failed to fetch bag slugs:', err)
  }

  return [...staticPages, ...bagPages]
}