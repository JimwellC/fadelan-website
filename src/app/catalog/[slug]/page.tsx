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
import ScrollReveal from '@/components/ui/ScrollReveal'

export const dynamicParams = true

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
  reserved: 'bg-[#F5F1EC] text-amber-500',
  on_hold: 'bg-[#F5F1EC] text-orange-500',
  sold: 'bg-[#F5F1EC] text-neutral-500',
}

const HARDWARE_LABELS: Record<string, string> = {
  gold: 'Gold',
  silver: 'Silver',
  ruthenium: 'Ruthenium',
  palladium: 'Palladium',
  brushed_gold: 'Brushed Gold',
  aged_gold: 'Aged Gold',
  mixed: 'Mixed',
}

const SIZE_LABELS: Record<string, string> = {
  mini: 'Mini',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  xl: 'XL',
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
    { label: 'Material', value: bag.material },
    { label: 'Hardware', value: bag.hardware ? (HARDWARE_LABELS[bag.hardware] ?? bag.hardware) : undefined },
    { label: 'Condition', value: bag.condition ? (CONDITION_LABELS[bag.condition] ?? bag.condition) : undefined },
    { label: 'Size', value: bag.size ? (SIZE_LABELS[bag.size] ?? bag.size) : undefined },
    { label: 'Year', value: bag.year },
    { label: 'Dimensions', value: bag.dimensions },
    { label: 'Includes', value: formatIncludes(bag.includes) },
    { label: 'Shipping', value: bag.shippingNote ?? settings.defaultShippingNote },
  ].filter((d) => d.value)

  return (
    <main className="min-h-screen bg-[#F5F1EC] flex flex-col">

      {/* Dark top band */}
      <ScrollReveal delay={0} className="order-1">
        <div className="relative h-20 w-full bg-[#2C2118]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(139,111,71,0.2) 0%, transparent 70%)',
            }}
          />
        </div>
      </ScrollReveal>

      {/* Breadcrumb */}
      <div className="order-2 bg-[#F5F1EC] px-4 py-4 md:px-10 md:py-5">
        <nav className="flex items-center gap-1.5 text-[10px] md:text-[11px]">

          <ScrollReveal delay={0}>
            <Link href="/catalog" className="text-[#8C8275] transition-colors hover:text-[#1A1A1A]">
              Catalog
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <span className="text-[#C8BFB2]">›</span>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <span className="hidden text-[#8C8275] sm:inline">
              {BRAND_LABELS[bag.brand] ?? bag.brand}
            </span>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <span className="hidden text-[#C8BFB2] sm:inline">›</span>
          </ScrollReveal>

          <ScrollReveal delay={320}>
            <span className="max-w-[180px] truncate font-medium text-[#1A1A1A] sm:max-w-none">
              {bag.name}
            </span>
          </ScrollReveal>

        </nav>
      </div>

      {/* ── GALLERY + NAME/PRICE/DESCRIPTION — order-3 on all breakpoints,
           always third (after dark band order-1, breadcrumb order-2),
           never reordered relative to those.
           min-h-[calc(100vh-4rem)] is desktop-only (xl:) — on mobile/tablet
           it forced this block to be full-viewport-tall even when its
           actual content (gallery + name/price/description) was much
           shorter, creating a large empty gap before Piece Details and
           the inquiry block that now render directly underneath it. ── */}
      <div className="order-3 w-full xl:min-h-[calc(100vh-4rem)] flex flex-col">

        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 md:items-start">
        <ScrollReveal delay={0}>
          <div className="px-4 pt-6 md:px-10 md:pt-8">
            <ProductGallery photos={bag.photos ?? []} name={bag.name} />
          </div>
        </ScrollReveal>
          {/* RIGHT — Details */}
          <div className="flex flex-col justify-start px-4 py-8 md:px-14 md:pt-12 md:pb-16">

            <ScrollReveal delay={0}>
              <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-[#8B6F47] md:mb-3 md:text-[10px]">
                {BRAND_LABELS[bag.brand] ?? bag.brand}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h1 className="mb-2 font-['Cormorant_Garamond'] text-[2rem] font-normal leading-[1.05] text-[#1A1A1A] md:mb-3 md:text-[clamp(1.8rem,3vw,3rem)]">
                {bag.name}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              {(bag.material || bag.hardware) && (
                <p className="mb-4 font-['Cormorant_Garamond'] text-[1rem] italic text-[#8C8275] md:mb-5 md:text-[1.05rem]">
                  {[
                    bag.material,
                    bag.hardware ? (HARDWARE_LABELS[bag.hardware] ?? bag.hardware) : undefined,
                  ].filter(Boolean).join(' · ')}
                </p>
              )}
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="mb-5 flex items-center gap-3 md:mb-8">
                <p className="font-['Cormorant_Garamond'] text-[1.8rem] text-[#2C2118] md:text-[2.2rem]">
                  ₱ {bag.price.toLocaleString('en-PH')}
                </p>
                <span className="px-2 py-0.5 text-[8px] uppercase border border-[#8B6F47] md:text-[9px]">
                  {AVAILABILITY_LABELS[bag.availability] ?? bag.availability}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={320}>
              {bag.description && (
                <div className="mb-5 font-['Cormorant_Garamond'] text-[1rem] leading-[1.8] text-[#8C8275] md:mb-6 md:text-[1.05rem]">
                  <PortableText value={bag.description} />
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="mb-5 flex items-center gap-2 md:mb-6">
                <ShareButton
                  name={bag.name}
                  brand={BRAND_LABELS[bag.brand] ?? bag.brand}
                  price={bag.price}
                />
                <WishlistButton slug={slug} name={bag.name} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={480}>
              <div className="mb-5 h-px bg-[#D6CEBE] md:mb-6" />
            </ScrollReveal>

            {/* Desktop-only copy (1280px+) — lives inside this column so it
               inherits the column's width/alignment, sitting directly under
               the divider. Hidden on mobile AND tablet (below 1280px),
               where the standalone full-width copy below renders instead. */}
            <div className="hidden xl:block">
              <ScrollReveal delay={560}>
                <div className="border border-[#D6CEBE] bg-[#EDE6DC] p-7" style={{ borderBottom: 'none' }}>
                  <h3 className="mb-2 font-['Cormorant_Garamond'] text-[1.4rem] font-normal text-[#1A1A1A]">
                    Inquire to Reserve
                  </h3>
                  <p className="mb-6 text-[13px] leading-[1.8] text-[#8C8275]">
                    Send us a message — we'll confirm availability and walk you
                    through next steps. Most inquiries replied to within an hour.
                  </p>
                  <ProductInquiry bagName={bag.name} price={bag.price} settings={settings} />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={640}>
                <LayawaySection bagName={bag.name} price={bag.price} settings={settings} />
              </ScrollReveal>

              <ScrollReveal delay={720}>
                <p className="mt-5 text-[11px] leading-[1.6] text-[#8C8275]">
                  One of a kind. Confirm availability before committing.
                </p>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </div>

      {/* ── INQUIRY + LAYAWAY (mobile + tablet, below 1280px) — standalone
           full-width block so it can sit in a different position (after
           Piece Details) than on desktop. Hidden at 1280px+, where the copy
           inside the right column above renders instead.
           Width: full on mobile, wider cap on tablet (md:) so it uses more
           of the available width without going fully edge-to-edge.
           order-5 places it after Piece Details (order-4). ── */}
      <div className="order-5 xl:hidden px-4 pt-8 pb-8 md:px-10">
        <div className="mx-auto w-full md:max-w-[90%]">

          <ScrollReveal delay={560}>
            <div className="border border-[#D6CEBE] bg-[#EDE6DC] p-5 md:p-7" style={{ borderBottom: 'none' }}>
              <h3 className="mb-1.5 font-['Cormorant_Garamond'] text-[1.2rem] font-normal text-[#1A1A1A] md:mb-2 md:text-[1.4rem]">
                Inquire to Reserve
              </h3>
              <p className="mb-4 text-[12px] leading-[1.8] text-[#8C8275] md:mb-6 md:text-[13px]">
                Send us a message — we'll confirm availability and walk you
                through next steps. Most inquiries replied to within an hour.
              </p>
              <ProductInquiry bagName={bag.name} price={bag.price} settings={settings} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={640}>
            <LayawaySection bagName={bag.name} price={bag.price} settings={settings} />
          </ScrollReveal>

          <ScrollReveal delay={720}>
            <p className="mt-5 text-[10px] leading-[1.6] text-[#8C8275] md:text-[11px]">
              One of a kind. Confirm availability before committing.
            </p>
          </ScrollReveal>

        </div>
      </div>

      {/* Piece details band — order-4 on mobile/tablet (between gallery
           block order-3 and inquiry block order-5), xl:order-5 on desktop
           (after the inquiry block xl:order-4, matching original order).
           Must match the xl breakpoint used by the inquiry blocks' visibility
           split below — using md here caused tablet (768-1279px) to get
           the desktop order while still getting the mobile/tablet inquiry
           block, colliding both at order-5.
           mt-10/md:mt-12 adds breathing room above this section, since it
           now sits directly after a sibling block on mobile/tablet rather
           than having any margin of its own before. */}
      <section className="order-4 xl:order-5 mt-10 md:mt-12 flex flex-col md:flex-row bg-[#EDE6DC]">

        {/* Left */}
        <div className="md:w-2/5 px-6 py-10 md:px-10 md:py-14">

          <ScrollReveal delay={0}>
            <h2 className="text-[2rem]">Piece Details</h2>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="mt-4 h-px w-10 bg-[#8B6F47]" />
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <p className="mt-4 text-[#8C8275] italic">
              {bag.authenticityNote ?? 'Verified by Fadelan'}
            </p>
          </ScrollReveal>

        </div>

        {/* Right — spec tiles.
             Grid stays 3 columns from md: up (768px+) on every breakpoint —
             tablet and desktop both get 3 columns, per request to keep the
             column count and only adjust padding/text size for tablet.
             Padding/text size now have three tiers: mobile (no prefix),
             tablet (md:, 768–1279px), and desktop (xl:, 1280px+) — tablet
             gets its own slightly smaller values than desktop, since 3
             columns in a narrower tablet column was cramming things tighter
             than intended. */}
        <div className="md:w-3/5 grid grid-cols-2 gap-px bg-[rgba(139,111,71,0.12)] md:grid-cols-3 auto-rows-fr">

          {details.map((d, i) => (
            <ScrollReveal
              key={d.label}
              delay={200 + i * 70}
            >
              <div className="h-full min-h-full bg-[#EDE6DC] px-5 py-6 transition-colors duration-200 hover:bg-[#E8DFD3] md:px-4 md:py-5 xl:px-6 xl:py-6 flex flex-col justify-between">

                <div>
                  <p className="mb-2 text-[8px] uppercase tracking-[0.18em] text-[#8B6F47] md:text-[8.5px] xl:text-[9px]">
                    {d.label}
                  </p>

                  <p className="font-['Cormorant_Garamond'] text-[1.05rem] font-light text-[#2C2118] md:text-[1rem] xl:text-[1.15rem]">
                    {d.value}
                  </p>
                </div>

              </div>
            </ScrollReveal>
          ))}

        </div>
      </section>
      {/* Suggestions */}
      <ScrollReveal delay={200} className="order-6">
        <ProductSuggestions bags={suggestions} />
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={400} className="order-7">
        <CtaBanner />
      </ScrollReveal>

    </main>
  )
}