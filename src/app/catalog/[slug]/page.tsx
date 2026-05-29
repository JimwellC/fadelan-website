import { notFound } from 'next/navigation'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
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
import ProductSuggestions from '@/components/product/ProductSuggestions'
import AboutCta from '@/components/about/AboutCta'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(ALL_BAG_SLUGS_QUERY)
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const bag = await sanityFetch<BagDetail>(BAG_DETAIL_QUERY, { slug })
  if (!bag) return {}
  return {
    title: bag.seoTitle ?? `${bag.name} — Fadelan`,
    description: bag.seoDescription ?? `${BRAND_LABELS[bag.brand] ?? bag.brand} ${bag.name} — pre-loved luxury bag available at Fadelan.`,
  }
}

const availabilityStyles: Record<string, string> = {
  available: 'bg-[#F5F1EC] text-green-700',
  reserved:  'bg-[#F5F1EC] text-amber-500',
  sold:      'bg-[#F5F1EC] text-neutral-500',
}

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

  const specs: { label: string; value: string | undefined }[] = [
    { label: 'Condition', value: CONDITION_LABELS[bag.condition] ?? bag.condition },
    { label: 'Size',      value: bag.size },
    { label: 'Material',  value: bag.material },
    { label: 'Hardware',  value: bag.hardware },
    { label: 'Year',      value: bag.year },
    { label: 'Includes',  value: bag.includes?.join(', ') },
  ].filter((s) => s.value)

  const details: { label: string; value: string | undefined }[] = [
    { label: 'Material',     value: bag.material },
    { label: 'Dimensions',   value: bag.dimensions },
    { label: 'Hardware',     value: bag.hardware },
    { label: 'Authenticity', value: bag.authenticityNote ?? 'Verified by Fadelan' },
    { label: 'Shipping',     value: bag.shippingNote ?? settings.defaultShippingNote },
    { label: 'Condition',    value: CONDITION_LABELS[bag.condition] },
  ].filter((d) => d.value)

  return (
    <main className="min-h-screen bg-[#F5F1EC]">

      {/* Dark brown top band — sits behind nav if nav is transparent/sticky */}
      <div className="relative h-20 w-full bg-[#2C2118]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(139,111,71,0.2) 0%, transparent 70%)',
          }}
        />
      </div>



      {/* Breadcrumb */}
      <div className="relative z-10 bg-[#F5F1EC] px-6 py-5 md:px-10">
        <nav className="flex items-center gap-2 text-[11px]">
          <Link href="/catalog" className="text-[#8C8275] hover:text-[#1A1A1A] transition-colors">Catalog</Link>
          <span className="text-[#C8BFB2]">›</span>
          <span className="text-[#8C8275]">{BRAND_LABELS[bag.brand] ?? bag.brand}</span>
          <span className="text-[#C8BFB2]">›</span>
          <span className="text-[#1A1A1A] font-medium">{bag.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="relative w-full py-10 md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-0">

          {/* LEFT — Gallery */}
          <div>
            <ProductGallery photos={bag.photos} name={bag.name} />
          </div>

          {/* RIGHT — Details */}
          <div className="px-6 pt-8 md:px-14 md:pt-12">
            {/* Brand */}
            <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-[#8B6F47]">
              {BRAND_LABELS[bag.brand] ?? bag.brand}
            </p>

            {/* Name */}
            <h1 className="mb-3 font-['Cormorant_Garamond'] text-[clamp(1.8rem,4vw,3rem)] font-normal leading-[1.05] text-[#1A1A1A]">
              {bag.name}
            </h1>

            {/* Material + color subtitle */}
            {(bag.material || bag.color) && (
              <p className="mb-6 font-['Cormorant_Garamond'] text-[1.05rem] italic text-[#8C8275]">
                {[bag.material, bag.hardware].filter(Boolean).join(' · ')}
              </p>
            )}

            {/* Price + availability */}
            <div className="mb-8 flex items-center gap-4">
              <p className="font-['Cormorant_Garamond'] text-[2.2rem] text-[#2C2118]">
                ₱ {bag.price.toLocaleString('en-PH')}
              </p>
              <span className={`px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] ${availabilityStyles[bag.availability] ?? 'bg-[#F5F1EC] text-neutral-500'} border border-[#8B6F47]`}>
                {AVAILABILITY_LABELS[bag.availability] ?? bag.availability}
              </span>
            </div>

            <div className="mb-6 h-px bg-[#D6CEBE]" />

            {/* Specs grid */}
            {specs.length > 0 && (
              <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-0">
                {specs.map((spec) => (
                  <div key={spec.label} className="border-b border-[#D6CEBE] py-4">
                    <p className="mb-1 text-[9px] uppercase tracking-[0.16em] text-[#8B6F47]">{spec.label}</p>
                    <p className="font-['Cormorant_Garamond'] text-[1.05rem] text-[#1A1A1A]">{spec.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Inquiry card */}
            <div className="mb-6 border border-[#D6CEBE] bg-[#EDE6DC] p-7">
              <h3 className="mb-2 font-['Cormorant_Garamond'] text-[1.4rem] font-normal text-[#1A1A1A]">
                Inquire to Reserve
              </h3>
              <p className="mb-6 text-[13px] leading-[1.8] text-[#8C8275]">
                Send us a message — we'll confirm availability and walk you through next steps. Most inquiries replied to within an hour.
              </p>
              <ProductInquiry bagName={bag.name} price={bag.price} settings={settings} />
            </div>

            <p className="text-[11px] leading-[1.6] text-[#8C8275]">
              One of a kind. Confirm availability before committing.
            </p>
          </div>
        </div>
      </div>



      {/* Piece details band */}
      {details.length > 0 && (
        <section className="bg-[#2C2118] px-6 py-12 md:px-10">
          <div className="mx-auto w-full md:max-w-[90%]">
            <div className="mb-8 flex items-center gap-4">
              <h2 className="whitespace-nowrap font-['Cormorant_Garamond'] text-[1.3rem] font-normal text-[#F5F1EC]">
                Piece details
              </h2>
              <div className="h-px flex-1 bg-[rgba(245,241,236,0.15)]" />
            </div>
            <div className="grid grid-cols-2 gap-px bg-[rgba(245,241,236,0.08)] md:grid-cols-3">
              {details.map((d) => (
                <div key={d.label} className="relative bg-[#2C2118] px-5 py-5">
                  <p className="mb-1 text-[9px] uppercase tracking-[0.14em] text-[#8B6F47]">{d.label}</p>
                  <p className="font-['Cormorant_Garamond'] text-[1.05rem] text-[rgba(245,241,236,0.85)]">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Authenticity note */}
            {bag.authenticityNote && (
              <div className="mt-8 border-l-2 border-[#8B6F47] pl-5">
                <p className="text-[12.5px] italic leading-[1.8] text-[rgba(245,241,236,0.5)]">
                  {bag.authenticityNote}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Suggestions */}
      <ProductSuggestions bags={suggestions} />

      {/* CTA */}
      <AboutCta
        headline="Explore more pieces"
        body="Every bag in our catalog is one of a kind — curated, verified, and waiting for its next chapter."
      />
    </main>
  )
}