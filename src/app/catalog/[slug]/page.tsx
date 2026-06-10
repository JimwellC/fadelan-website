import { notFound } from 'next/navigation'
import Link from 'next/link'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { CONDITION_LABELS, AVAILABILITY_LABELS, BRAND_LABELS } from '@/lib/sanity'
import {
  BAG_DETAIL_QUERY,
  SITE_SETTINGS_QUERY,
  CATALOG_QUERY,
  ALL_BAG_SLUGS_QUERY,
} from '@/lib/queries'
import type { BagDetail, SiteSettings, BagListItem } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInquiry from '@/components/product/ProductInquiry'
import LayawaySection from '@/components/product/LayawaySection'
import ProductSuggestions from '@/components/product/ProductSuggestions'
import ShareButton from '@/components/product/ShareButton'
import WishlistButton from '@/components/product/WishlistButton'
import CtaBanner from '@/components/how-to-buy/CtaBanner'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(ALL_BAG_SLUGS_QUERY)
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  if (!slug) return {}
  const bag = await sanityFetch<BagDetail>(BAG_DETAIL_QUERY, { slug })
  if (!bag) return {}
  return {
    title: bag.seoTitle ?? `${bag.name} — Fadelan`,
    description:
      bag.seoDescription ??
      `${BRAND_LABELS[bag.brand] ?? bag.brand} ${bag.name} — pre-loved luxury bag available at Fadelan.`,
  }
}

const availabilityStyles: Record<string, string> = {
  available: 'bg-[#F5F1EC] text-green-700',
  reserved:  'bg-[#F5F1EC] text-amber-500',
  on_hold:   'bg-[#F5F1EC] text-orange-500',
  sold:      'bg-[#F5F1EC] text-neutral-500',
}

const HARDWARE_LABELS: Record<string, string> = {
  gold:         'Gold',
  silver:       'Silver',
  ruthenium:    'Ruthenium',
  palladium:    'Palladium',
  brushed_gold: 'Brushed Gold',
  aged_gold:    'Aged Gold',
  mixed:        'Mixed',
}

const SIZE_LABELS: Record<string, string> = {
  mini:     'Mini',
  small:    'Small',
  medium:   'Medium',
  large:    'Large',
  xl:       'XL',
  one_size: 'One Size',
}

const formatIncludes = (items: string[] | undefined) =>
  items
    ?.map((item) =>
      item.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    )
    .join(', ')

export default async function BagDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [bag, settings, allBags] = await Promise.all([
    sanityFetch<BagDetail>(BAG_DETAIL_QUERY, { slug }),
    sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY),
    sanityFetch<BagListItem[]>(CATALOG_QUERY),
  ])

  if (!bag) notFound()

  const suggestions = allBags
    .filter((b) => b._id !== bag._id && b.availability !== 'sold')
    .sort((a, b) => (a.brand === bag.brand ? -1 : b.brand === bag.brand ? 1 : 0))
    .slice(0, 3)

  const details: { label: string; value: string | undefined }[] = [
    { label: 'Material',   value: bag.material },
    { label: 'Hardware',   value: bag.hardware ? (HARDWARE_LABELS[bag.hardware] ?? bag.hardware) : undefined },
    { label: 'Condition',  value: bag.condition ? (CONDITION_LABELS[bag.condition] ?? bag.condition) : undefined },
    { label: 'Size',       value: bag.size ? (SIZE_LABELS[bag.size] ?? bag.size) : undefined },
    { label: 'Year',       value: bag.year },
    { label: 'Dimensions', value: bag.dimensions },
    { label: 'Includes',   value: formatIncludes(bag.includes) },
    { label: 'Shipping',   value: bag.shippingNote ?? settings.defaultShippingNote },
  ].filter((d) => d.value)

  return (
    <main className="min-h-screen bg-[#F5F1EC]">

      {/* Dark top band */}
      <div className="relative h-20 w-full bg-[#2C2118]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(139,111,71,0.2) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Breadcrumb */}
      <div className="bg-[#F5F1EC] px-4 py-4 md:px-10 md:py-5">
        <nav className="flex items-center gap-1.5 text-[10px] md:text-[11px]">
          <Link href="/catalog" className="text-[#8C8275] transition-colors hover:text-[#1A1A1A]">
            Catalog
          </Link>
          <span className="text-[#C8BFB2]">›</span>
          <span className="hidden text-[#8C8275] sm:inline">
            {BRAND_LABELS[bag.brand] ?? bag.brand}
          </span>
          <span className="hidden text-[#C8BFB2] sm:inline">›</span>
          <span className="max-w-[180px] truncate font-medium text-[#1A1A1A] sm:max-w-none">
            {bag.name}
          </span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 md:items-start">

          {/* LEFT — Gallery */}
          <div>
            <ProductGallery photos={bag.photos ?? []} name={bag.name} />
          </div>

          {/* RIGHT — Details */}
          <div className="flex flex-col justify-start px-4 py-8 md:px-14 md:pt-12 md:pb-16">

            {/* Brand */}
            <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-[#8B6F47] md:mb-3 md:text-[10px]">
              {BRAND_LABELS[bag.brand] ?? bag.brand}
            </p>

            {/* Name */}
            <h1 className="mb-2 font-['Cormorant_Garamond'] text-[2rem] font-normal leading-[1.05] text-[#1A1A1A] md:mb-3 md:text-[clamp(1.8rem,3vw,3rem)]">
              {bag.name}
            </h1>

            {/* Subtitle */}
            {(bag.material || bag.hardware) && (
              <p className="mb-4 font-['Cormorant_Garamond'] text-[1rem] italic text-[#8C8275] md:mb-5 md:text-[1.05rem]">
                {[
                  bag.material,
                  bag.hardware ? (HARDWARE_LABELS[bag.hardware] ?? bag.hardware) : undefined,
                ].filter(Boolean).join(' · ')}
              </p>
            )}

            {/* Price + availability */}
            <div className="mb-5 flex items-center gap-3 md:mb-8">
              <p className="font-['Cormorant_Garamond'] text-[1.8rem] text-[#2C2118] md:text-[2.2rem]">
                ₱ {bag.price.toLocaleString('en-PH')}
              </p>
              <span
                className={`px-2 py-0.5 text-[8px] uppercase tracking-[0.1em] border border-[#8B6F47] md:text-[9px] ${
                  availabilityStyles[bag.availability] ?? 'bg-[#F5F1EC] text-neutral-500'
                }`}
              >
                {AVAILABILITY_LABELS[bag.availability] ?? bag.availability}
              </span>
            </div>

            {/* Description */}
            {bag.description && (
              <div className="mb-5 font-['Cormorant_Garamond'] text-[1rem] leading-[1.8] text-[#8C8275] md:mb-6 md:text-[1.05rem]">
                <PortableText value={bag.description} />
              </div>
            )}

            {/* Share + Wishlist */}
            <div className="mb-5 flex items-center gap-2 md:mb-6">
              <ShareButton
                name={bag.name}
                brand={BRAND_LABELS[bag.brand] ?? bag.brand}
                price={bag.price}
              />
              <WishlistButton slug={slug} name={bag.name} />
            </div>

            {/* Divider */}
            <div className="mb-5 h-px bg-[#D6CEBE] md:mb-6" />

            {/* Inquiry card — desktop only */}
            <div className="hidden md:block border border-[#D6CEBE] bg-[#EDE6DC] p-5 md:p-7" style={{ borderBottom: 'none' }}>
              <h3 className="mb-1.5 font-['Cormorant_Garamond'] text-[1.2rem] font-normal text-[#1A1A1A] md:mb-2 md:text-[1.4rem]">
                Inquire to Reserve
              </h3>
              <p className="mb-4 text-[12px] leading-[1.8] text-[#8C8275] md:mb-6 md:text-[13px]">
                Send us a message — we'll confirm availability and walk you
                through next steps. Most inquiries replied to within an hour.
              </p>
              <ProductInquiry bagName={bag.name} price={bag.price} settings={settings} />
            </div>

            {/* Layaway — separate box, desktop only, bags ₱40,000+ */}
            <LayawaySection bagName={bag.name} price={bag.price} settings={settings} />

            <p className="hidden md:block text-[10px] leading-[1.6] text-[#8C8275] md:text-[11px]">
              One of a kind. Confirm availability before committing.
            </p>
          </div>
        </div>
      </div>

      {/* Piece details band */}
      {details.length > 0 && (
        <section className="w-full bg-[#EDE6DC] flex flex-col md:flex-row">

          {/* Left */}
          <div className="w-full md:w-2/5 flex flex-col justify-center px-6 py-10 border-b border-[rgba(139,111,71,0.18)] md:border-b-0 md:border-r md:px-10 md:py-14">
            <p className="font-['Cormorant_Garamond'] text-[2rem] font-light leading-[1.05] text-[#2C2118] md:text-[2.6rem]">
              Piece Details
            </p>
            <div className="mt-4 h-px w-10 bg-[#8B6F47] md:mt-5" />
            <p className="mt-4 font-['Cormorant_Garamond'] text-[12px] italic text-[#8C8275] md:mt-5 md:text-[13px]">
              {bag.authenticityNote ?? 'Verified by Fadelan'}
            </p>
          </div>

          {/* Right — spec tiles */}
          <div className="w-full md:w-3/5 grid grid-cols-2 gap-px bg-[rgba(139,111,71,0.12)] md:grid-cols-3">
            {details.map((d) => (
              <div
                key={d.label}
                className="bg-[#EDE6DC] px-5 py-6 transition-colors duration-200 hover:bg-[#E8DFD3] md:px-6"
              >
                <p className="mb-2 text-[8px] uppercase tracking-[0.18em] text-[#8B6F47] md:text-[9px]">
                  {d.label}
                </p>
                <p className="font-['Cormorant_Garamond'] text-[1.05rem] font-light text-[#2C2118] md:text-[1.15rem]">
                  {d.value}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile-only inquiry */}
          <div className="md:hidden px-6 py-8 border-t border-[rgba(139,111,71,0.18)]">
            <h3 className="mb-1.5 font-['Cormorant_Garamond'] text-[1.2rem] font-normal text-[#1A1A1A]">
              Inquire to Reserve
            </h3>
            <p className="mb-4 text-[12px] leading-[1.8] text-[#8C8275]">
              Send us a message — we'll confirm availability and walk you
              through next steps. Most inquiries replied to within an hour.
            </p>
            <ProductInquiry bagName={bag.name} price={bag.price} settings={settings} />
            <p className="mt-4 text-[10px] leading-[1.6] text-[#8C8275]">
              One of a kind. Confirm availability before committing.
            </p>
          </div>

        </section>
      )}

      {/* Suggestions */}
      <ProductSuggestions bags={suggestions} />

      {/* CTA */}
      <CtaBanner />

    </main>
  )
}