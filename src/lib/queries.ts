// src/lib/queries.ts
// ─────────────────────────────────────────────────────────────
// All GROQ queries used by the Next.js frontend.
// Import these into your page / route files.
//
// Usage pattern (Next.js App Router):
//
//   import { sanityFetch }    from '@/lib/sanity'
//   import { CATALOG_QUERY }  from '@/lib/queries'
//   import type { BagListItem } from '@/lib/queries'
//
//   const bags = await sanityFetch<BagListItem[]>(CATALOG_QUERY)
// ─────────────────────────────────────────────────────────────

import type { PortableTextBlock } from '@portabletext/types'

// ── TYPE DEFINITIONS ─────────────────────────────────────────

// ✓ 3 states — on_hold removed, collapsed into reserved
export type BagAvailability = 'available' | 'reserved' | 'sold'
export type BagCondition    = 'brand_new' | 'like_new' | 'excellent' | 'very_good' | 'good'
export type BagSize         = 'mini' | 'small' | 'medium' | 'large' | 'oversized'

export interface SanityImageAsset {
  _id:      string
  url:      string
  metadata: {
    dimensions: { width: number; height: number; aspectRatio: number }
    lqip:       string  // base64 low-quality image placeholder — use as blurDataURL
  }
}

export interface BagPhoto {
  _key:     string
  alt?:     string
  caption?: string
  asset:    SanityImageAsset
}

export interface BagListItem {
  _id:          string
  _updatedAt:   string
  name:         string
  brand:        string
  slug:         { current: string }
  price:        number
  availability: BagAvailability
  condition:    BagCondition
  color:        string
  size:         BagSize
  dateAdded:    string
  coverPhoto:   BagPhoto | null
}

export interface BagDetail extends BagListItem {
  material?:         string
  hardware?:         string
  dimensions?:       string
  year?:             string
  includes?:         string[]
  photos:            BagPhoto[]
  description?:      PortableTextBlock[]  // ✓ typed, not any[]
  authenticityNote?: string
  shippingNote?:     string
  seoTitle?:         string
  seoDescription?:   string
}

export interface SiteSettings {
  siteName:                   string
  tagline:                    string
  heroImage?: {
    asset: {
      _id:      string
      url:      string
      metadata: {
        dimensions: { width: number; height: number }
        lqip:       string
      }
    }
  }
  logo?:                      { _id: string; url: string }
  ogImage?:                   { _id: string; url: string; metadata: { dimensions: { width: number; height: number } } }
  messengerUrl?:              string
  facebookPageUrl?:           string
  instagramHandle?:           string
  viberNumber?:               string
  contactEmail?:              string
  locationDescription?:       string
  messengerInquiryTemplate:   string
  instagramInquiryTemplate:   string
  viberInquiryTemplate:       string
  featuredBags?:              BagListItem[]
  heroHeadline:               string
  heroSubline:                string
  defaultShippingNote:        string
  paymentMethods?:            string[]
  ownerPhoto?: {
    _id:      string
    url:      string
    metadata: { dimensions: { width: number; height: number }; lqip: string }
  }
}

// ✓ priceRange values are nullable — they're null when catalog is empty
export interface FilterOptions {
  brands:     string[]
  conditions: string[]
  colors:     string[]
  sizes:      string[]
  priceRange: {
    min: number | null
    max: number | null
  }
}

// ── SHARED IMAGE PROJECTION ───────────────────────────────────
const IMAGE_FIELDS = /* groq */ `
  _key,
  alt,
  caption,
  asset-> {
    _id,
    url,
    metadata {
      dimensions { width, height, aspectRatio },
      lqip
    }
  }
`

// ── SHARED BAG LIST PROJECTION ───────────────────────────────
const BAG_LIST_FIELDS = /* groq */ `
  _id,
  _updatedAt,
  name,
  brand,
  slug,
  price,
  availability,
  condition,
  color,
  size,
  dateAdded,
  "coverPhoto": photos[0] {
    ${IMAGE_FIELDS}
  }
`

// ═══════════════════════════════════════════════════════════════
// CATALOG — All visible bags, newest first
// ═══════════════════════════════════════════════════════════════
// Returns all non-hidden bags. Client-side filtering (brand, price,
// condition, color, size) for instant UX without extra API calls.
// Sold bags only appear when showWhenSold === true.
export const CATALOG_QUERY = /* groq */ `
  *[
    _type == "bag" &&
    (availability != "sold" || showWhenSold == true)
  ] | order(dateAdded desc) {
    ${BAG_LIST_FIELDS}
  }
`

// Available bags only — homepage featured grid fallback
export const AVAILABLE_BAGS_QUERY = /* groq */ `
  *[
    _type == "bag" &&
    availability == "available"
  ] | order(dateAdded desc) {
    ${BAG_LIST_FIELDS}
  }
`

// ═══════════════════════════════════════════════════════════════
// BAG DETAIL — Single bag by slug
// ═══════════════════════════════════════════════════════════════
export const BAG_DETAIL_QUERY = /* groq */ `
  *[_type == "bag" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    name,
    brand,
    slug,
    price,
    availability,
    condition,
    color,
    size,
    material,
    hardware,
    dimensions,
    year,
    includes,
    dateAdded,
    description,
    authenticityNote,
    shippingNote,
    seoTitle,
    seoDescription,
    "photos": photos[] {
      ${IMAGE_FIELDS}
    },
    "coverPhoto": photos[0] {
      ${IMAGE_FIELDS}
    }
  }
`

// For generateStaticParams — gets all slugs at build time
export const ALL_BAG_SLUGS_QUERY = /* groq */ `
  *[_type == "bag"] {
    "slug": slug.current
  }
`

// ═══════════════════════════════════════════════════════════════
// HOMEPAGE
// ═══════════════════════════════════════════════════════════════
// Returns settings + featured bags in one query.
// If featuredBags is empty, the page falls back to fallbackBags.
// Note: both are always fetched. At 150 bags this is fine.
// Add pagination in Phase 2 if catalog grows past 500.
export const HOMEPAGE_QUERY = /* groq */ `
  {
    "settings": *[_type == "siteSettings"][0] {
      heroHeadline,
      heroSubline,
      tagline,
      "heroImage": heroImage {
        asset-> {
          _id,
          url,
          metadata {
            dimensions { width, height },
            lqip
          }
        }
      },
      "featuredBags": featuredBags[]-> {
        ${BAG_LIST_FIELDS}
      }
    },
    "fallbackBags": *[
      _type == "bag" &&
      availability == "available"
    ] | order(dateAdded desc)[0...12] {
      ${BAG_LIST_FIELDS}
    }
  }
`

// ═══════════════════════════════════════════════════════════════
// SITE SETTINGS — Global config (nav, footer, socials, inquiry)
// ═══════════════════════════════════════════════════════════════
export const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    "logo": logo.asset-> { _id, url },
    "ogImage": ogImage.asset-> { _id, url, metadata { dimensions } },
    messengerUrl,
    facebookPageUrl,
    instagramHandle,
    viberNumber,
    contactEmail,
    locationDescription,
    messengerInquiryTemplate,
    instagramInquiryTemplate,
    viberInquiryTemplate,
    heroHeadline,
    heroSubline,
    defaultShippingNote,
    paymentMethods,
    "featuredBags": featuredBags[]-> {
      ${BAG_LIST_FIELDS}
    },
    "ownerPhoto": ownerPhoto.asset-> { _id, url, metadata { dimensions, lqip } },

  }
`

// ═══════════════════════════════════════════════════════════════
// RECENTLY SOLD — Phase 2 social proof section
// ═══════════════════════════════════════════════════════════════
export const RECENTLY_SOLD_QUERY = /* groq */ `
  *[
    _type == "bag" &&
    availability == "sold" &&
    showWhenSold == true
  ] | order(dateAdded desc)[0...8] {
    ${BAG_LIST_FIELDS}
  }
`

// ═══════════════════════════════════════════════════════════════
// FILTER OPTIONS — Unique values for filter dropdowns
// Only returns values that exist in the current catalog.
// Prevents showing a "Hermès" filter when no Hermès bags are listed.
// ═══════════════════════════════════════════════════════════════
export const FILTER_OPTIONS_QUERY = /* groq */ `
  {
    "brands":     array::unique(*[_type == "bag" && availability != "sold"].brand),
    "conditions": array::unique(*[_type == "bag" && availability != "sold"].condition),
    "colors":     array::unique(*[_type == "bag" && availability != "sold"].color),
    "sizes":      array::unique(*[_type == "bag" && availability != "sold"].size),
    "priceRange": {
      "min": math::min(*[_type == "bag" && availability != "sold"].price),
      "max": math::max(*[_type == "bag" && availability != "sold"].price)
    }
  }
`

// ═══════════════════════════════════════════════════════════════
// HOW TO BUY — Bag dropdown (exclude sold)
// ═══════════════════════════════════════════════════════════════
export const ALL_BAGS_DROPDOWN_QUERY = /* groq */ `
  *[_type == "bag" && availability != "sold"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    availability
  }
`

export type BagDropdownItem = {
  _id:          string
  name:         string
  slug:         string
  availability: BagAvailability
}