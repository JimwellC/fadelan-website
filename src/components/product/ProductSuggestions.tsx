import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { BRAND_LABELS, CONDITION_LABELS, AVAILABILITY_LABELS } from '@/lib/sanity'
import type { BagListItem } from '@/lib/queries'

interface ProductSuggestionsProps {
  bags: BagListItem[]
}

const availabilityStyles: Record<string, string> = {
  available: 'text-green-700',
  reserved: 'text-amber-500',
  sold: 'text-neutral-500',
}

export default function ProductSuggestions({ bags }: ProductSuggestionsProps) {
  if (!bags.length) return null

  return (
    <section className="bg-[#F5F1EC] px-6 py-12 md:px-10 md:py-16">
      {/* Diamond divider header */}
      <div className="mb-8 text-center">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#D6CEBE]" />
          <div className="h-[7px] w-[7px] rotate-45 bg-[#8B6F47]" />
          <div className="h-px flex-1 bg-[#D6CEBE]" />
        </div>
        <h2 className="font-['Cormorant_Garamond'] text-[2rem] font-normal text-[#1A1A1A]">
          You may also like
        </h2>
        <p className="mt-2 text-xs text-[#8C8275]">
          More pieces from our current catalog
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {bags.map((bag) => (
          <Link
            key={bag._id}
            href={`/catalog/${bag.slug.current}`}
            className="group block border border-[#D6CEBE] bg-[#EDE6DC]"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#D6CEBE]">
              {bag.coverPhoto ? (
                <Image
                  src={urlFor(bag.coverPhoto.asset).width(400).format('webp').url()}
                  alt={bag.coverPhoto.alt ?? bag.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  placeholder="blur"
                  blurDataURL={bag.coverPhoto.asset.metadata.lqip}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="h-full w-full bg-[#C8BFB2]" />
              )}
              <div className="absolute left-2.5 top-2.5">
                <span className={`bg-[rgba(245,241,236,0.92)] px-2 py-0.5 text-[8px] uppercase tracking-[0.1em] ${availabilityStyles[bag.availability] ?? 'text-neutral-500'}`}>
                  {AVAILABILITY_LABELS[bag.availability] ?? bag.availability}
                </span>
              </div>
            </div>
            <div className="p-3">
              <p className="mb-0.5 text-[8px] uppercase tracking-[0.14em] text-[#8B6F47]">
                {BRAND_LABELS[bag.brand] ?? bag.brand}
              </p>
              <p className="mb-0.5 font-['Cormorant_Garamond'] text-[1rem] leading-[1.2] text-[#1A1A1A]">
                {bag.name}
              </p>
              <p className="font-['Cormorant_Garamond'] text-[0.95rem] text-[#8C8275]">
                ₱ {bag.price.toLocaleString('en-PH')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}