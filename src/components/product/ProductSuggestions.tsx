'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { BRAND_LABELS, CONDITION_LABELS } from '@/lib/sanity'
import type { BagListItem } from '@/lib/queries'
import WishlistCardButton from '@/components/product/WishlistCardButton'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface ProductSuggestionsProps {
  bags: BagListItem[]
}

const availabilityIndicator: Record<string, { label: string; className: string }> = {
  reserved: { label: 'Reserved', className: 'text-amber-500' },
  on_hold: { label: 'On hold', className: 'text-orange-500' },
  sold: { label: 'Sold', className: 'text-neutral-500' },
}

export default function ProductSuggestions({ bags }: ProductSuggestionsProps) {
  if (!bags.length) return null

  return (
    <ScrollReveal>
      <section className="bg-[#F5F1EC] px-4 py-10 md:px-10 md:py-12">

        {/* Header */}
        <ScrollReveal>
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
        </ScrollReveal>

        {/* Cards — flex instead of a fixed-column grid, so that when there
           are fewer bags than the max (3), the row centers as a unit and
           each card grows to fill more of the available width instead of
           leaving empty grid cells. max-w caps growth so cards don't get
           absurdly wide with only 1 result; min-w keeps them from getting
           too narrow before wrapping to a new line.
           Card styling below now matches BagCard.tsx's visual language
           (theme tokens, hover border, availability badge / sold overlay,
           footer rule) instead of the old literal-hex/no-badge styling. */}
        <div className="mx-auto flex max-w-[900px] flex-wrap justify-center gap-3">
          {bags.map((bag, i) => {
            const indicator = availabilityIndicator[bag.availability]
            const isSold = bag.availability === 'sold'

            return (
              <div key={bag._id} className="flex flex-1 basis-[160px] justify-center">
                <ScrollReveal delay={i * 80} className="w-full">
                <Link
                  href={`/catalog/${bag.slug.current}`}
                  className="group mx-auto flex h-full w-full min-w-[160px] max-w-[320px] flex-col bg-cream-dark border border-bronze/20 transition-colors duration-400 ease-luxury hover:border-bronze/40"
                >
                  {/* Image */}
                  <div className="relative aspect-bag w-full overflow-hidden">
                    {bag.coverPhoto ? (
                      <Image
                        src={urlFor(bag.coverPhoto.asset).width(400).format('webp').url()}
                        alt={bag.coverPhoto.alt ?? bag.name}
                        fill
                        className={`object-contain p-3 transition-transform duration-700 ease-luxury group-hover:scale-[1.03] ${
                          isSold ? 'opacity-60' : ''
                        }`}
                        placeholder="blur"
                        blurDataURL={bag.coverPhoto.asset.metadata.lqip}
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted/10" />
                    )}

                    {/* Reserved / On hold label */}
                    {indicator && !isSold && (
                      <span className={`absolute left-3 top-3 font-body text-[10px] font-medium uppercase tracking-[0.18em] ${indicator.className}`}>
                        {indicator.label}
                      </span>
                    )}

                    {/* Sold overlay */}
                    {isSold && (
                      <div className="absolute inset-0 flex items-center justify-center bg-ivory/20">
                        <span className="bg-ivory/90 px-4 py-1.5 font-body text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-500">
                          Sold
                        </span>
                      </div>
                    )}

                    {/* Wishlist button (no animation wrapper to avoid layout shift) */}
                    <WishlistCardButton slug={bag.slug.current} name={bag.name} />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col px-3 pt-2.5 pb-3">
                    <p className="mb-0.5 font-body text-[8px] font-medium uppercase tracking-[0.14em] text-bronze">
                      {BRAND_LABELS[bag.brand] ?? bag.brand}
                    </p>

                    <p className="line-clamp-2 font-display text-[0.9rem] italic leading-[1.2] text-ink transition-colors duration-400 ease-luxury group-hover:text-bronze-dark md:text-[0.95rem]">
                      {bag.name}
                    </p>

                    <div className="flex-1" />

                    <div className="mt-2 flex items-baseline justify-between gap-1 border-t border-bronze/10 pt-2">
                      <span className="font-display text-[0.75rem] italic text-muted">
                        {bag.condition ? (CONDITION_LABELS[bag.condition] ?? bag.condition) : ''}
                      </span>
                      <span className="flex-shrink-0 whitespace-nowrap font-display text-[0.8rem] text-ink md:text-[0.85rem]">
                        ₱ {bag.price.toLocaleString('en-PH')}
                      </span>
                    </div>
                  </div>
                </Link>
                </ScrollReveal>
              </div>
            )
          })}
        </div>

      </section>
    </ScrollReveal>
  )
}