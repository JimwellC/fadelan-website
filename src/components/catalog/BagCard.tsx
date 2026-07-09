'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { CONDITION_LABELS, BRAND_LABELS } from '@/lib/sanity'
import type { BagListItem } from '@/lib/queries'
import WishlistCardButton from '@/components/product/WishlistCardButton'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface BagCardProps {
  bag: BagListItem
}

const availabilityIndicator: Record<string, { label: string; className: string }> = {
  reserved: { label: 'Reserved', className: 'text-amber-500' },
  on_hold: { label: 'On hold', className: 'text-orange-500' },
  sold: { label: 'Sold', className: 'text-neutral-500' },
}

export default function BagCard({ bag }: BagCardProps) {
  const indicator = availabilityIndicator[bag.availability]
  const isSold = bag.availability === 'sold'

  return (
    // h-full threaded through so the ScrollReveal wrapper fills the grid
    // cell — without it the card sits at content height and rows don't match.
    <ScrollReveal className="h-full">
      <Link
        href={`/catalog/${bag.slug.current}`}
        className="group flex h-full flex-col bg-cream-dark border border-bronze/20 transition-colors duration-400 ease-luxury hover:border-bronze/40"
      >
        {/* Image — object-cover fills the frame identically on every card,
           regardless of the photo's native aspect ratio. Every image now
           occupies the exact same visual area. */}
        <div className="relative aspect-bag w-full overflow-hidden">
          {bag.coverPhoto ? (
            <Image
              src={urlFor(bag.coverPhoto.asset).width(800).format('webp').url()}
              alt={bag.coverPhoto.alt ?? bag.name}
              fill
              className={`object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.03] ${
                isSold ? 'opacity-60' : ''
              }`}
              placeholder={bag.coverPhoto.asset.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={bag.coverPhoto.asset.metadata?.lqip}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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

          {/* Wishlist button */}
          <WishlistCardButton slug={bag.slug.current} name={bag.name} />
        </div>

        {/* Info block */}
        <div className="flex flex-1 flex-col px-3 pt-3 pb-4 md:px-3.5 md:pt-3.5 md:pb-4.5 xl:px-4 xl:pt-4 xl:pb-5">

          {/* Brand */}
          <p className="mb-1.5 font-body text-[10px] font-medium uppercase tracking-[0.2em] text-bronze">
            {BRAND_LABELS[bag.brand] ?? bag.brand}
          </p>

          {/* Name — min-height reserves 2 lines so 1-line and 2-line names
             both occupy the same vertical space, keeping the footer aligned
             across cards. line-clamp-2 caps longer names at 2 lines. */}
          <p className="line-clamp-2 min-h-[2.4em] font-display text-[1.1rem] font-normal italic leading-[1.2] text-ink transition-colors duration-400 ease-luxury group-hover:text-bronze-dark md:text-[1.2rem] xl:text-[1.3rem]">
            {bag.name}
          </p>

          <div className="flex-1" />

          {/* Footer */}
          <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-bronze/10 pt-2.5">
            <span className="font-body text-[11px] italic text-muted">
              {CONDITION_LABELS[bag.condition] ?? bag.condition}
            </span>

            <span className="flex-shrink-0 whitespace-nowrap font-display text-[1rem] font-normal text-ink md:text-[0.95rem] xl:text-[1rem]">
              ₱ {bag.price.toLocaleString('en-PH')}
            </span>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  )
}