'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { BRAND_LABELS, CONDITION_LABELS } from '@/lib/sanity'
import type { BagListItem } from '@/lib/queries'
import WishlistCardButton from '@/components/product/WishlistCardButton'

interface ProductSuggestionsProps {
  bags: BagListItem[]
}

export default function ProductSuggestions({ bags }: ProductSuggestionsProps) {
  if (!bags.length) return null

  return (
    <section className="bg-[#F5F1EC] px-4 py-10 md:px-10 md:py-12">

      {/* Header */}
      <div className="mb-6 text-center md:mb-8">
        <div className="mb-3 flex items-center gap-3 md:mb-4">
          <div className="h-px flex-1 bg-[#D6CEBE]" />
          <div className="h-[6px] w-[6px] rotate-45 bg-[#8B6F47]" />
          <div className="h-px flex-1 bg-[#D6CEBE]" />
        </div>
        <h2 className="font-['Cormorant_Garamond'] text-[1.4rem] font-normal text-[#1A1A1A] md:text-[1.6rem]">
          You may also like
        </h2>
        <p className="mt-1 text-[10px] text-[#8C8275] md:text-[11px]">
          More pieces from our current catalog
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3 md:mx-auto md:max-w-[60%] md:grid-cols-3">
        {bags.map((bag) => (
          <Link
            key={bag._id}
            href={`/catalog/${bag.slug.current}`}
            className="group relative block border border-[#D6CEBE] bg-[#EDE6DC]"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-[#E2DAD0]">
              {bag.coverPhoto ? (
                <Image
                  src={urlFor(bag.coverPhoto.asset).width(400).format('webp').url()}
                  alt={bag.coverPhoto.alt ?? bag.name}
                  fill
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                  placeholder="blur"
                  blurDataURL={bag.coverPhoto.asset.metadata.lqip}
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              ) : (
                <div className="h-full w-full" />
              )}

              {/* Wishlist button */}
              <WishlistCardButton slug={bag.slug.current} name={bag.name} />
            </div>

            {/* Info */}
            <div className="border-t border-[#D6CEBE] px-3 pb-3 pt-2.5">
              <p className="mb-0.5 text-[8px] uppercase tracking-[0.14em] text-[#8B6F47]">
                {BRAND_LABELS[bag.brand] ?? bag.brand}
              </p>
              <p className="mb-2 font-['Cormorant_Garamond'] text-[0.9rem] italic leading-[1.2] text-[#1A1A1A] md:text-[0.95rem]">
                {bag.name}
              </p>
              <div className="mb-2 h-px bg-[#D6CEBE]" />
              <div className="flex items-baseline justify-between gap-1">
                <p className="font-['Cormorant_Garamond'] text-[0.75rem] italic text-[#8C8275]">
                  {bag.condition ? (CONDITION_LABELS[bag.condition] ?? bag.condition) : ''}
                </p>
                <p className="font-['Cormorant_Garamond'] text-[0.8rem] text-[#1A1A1A] md:text-[0.85rem]">
                  ₱ {bag.price.toLocaleString('en-PH')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}