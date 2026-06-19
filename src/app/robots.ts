// src/app/robots.ts
// ─────────────────────────────────────────────────────────────
// Tells Google what to crawl and where the sitemap is.
// Blocks the admin panel from being indexed.
// ─────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fadelan.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow:  [
          '/admin',
          '/admin/',
          '/api/',
          '/studio',
          '/studio/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}