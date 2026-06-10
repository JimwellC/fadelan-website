'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { CONDITION_LABELS, BRAND_LABELS } from '@/lib/sanity'
import type { BagListItem } from '@/lib/queries'
import WishlistCardButton from '@/components/product/WishlistCardButton'

interface BagCardProps {
  bag: BagListItem
}

const availabilityIndicator: Record<string, { label: string; className: string }> = {
  reserved: { label: 'Reserved', className: 'text-amber-500'  },
  on_hold:  { label: 'On hold',  className: 'text-orange-500' },
  sold:     { label: 'Sold',     className: 'text-neutral-500' },
}

export default function BagCard({ bag }: BagCardProps) {
  const indicator = availabilityIndicator[bag.availability]
  const isSold    = bag.availability === 'sold'

  return (
    <Link
      href={`/catalog/${bag.slug.current}`}
      className="group flex h-full flex-col bg-cream-dark border border-bronze/20 transition-colors duration-400 ease-luxury hover:border-bronze/40"
    >
      {/* Image */}
      <div className="relative aspect-bag w-full overflow-hidden">
        {bag.coverPhoto ? (
          <Image
            src={urlFor(bag.coverPhoto.asset).width(800).format('webp').url()}
            alt={bag.coverPhoto.alt ?? bag.name}
            fill
            className={`object-contain p-3 transition-transform duration-700 ease-luxury group-hover:scale-[1.03] md:p-4 ${
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
      <div className="flex flex-1 flex-col px-3 pt-3 pb-4 md:px-4 md:pt-4 md:pb-5">

        {/* Brand */}
        <p className="mb-1.5 font-body text-[10px] font-medium uppercase tracking-[0.2em] text-bronze">
          {BRAND_LABELS[bag.brand] ?? bag.brand}
        </p>

        {/* Name */}
        <p className="line-clamp-2 font-display text-[1.1rem] font-normal italic leading-[1.2] text-ink transition-colors duration-400 ease-luxury group-hover:text-bronze-dark md:text-[1.3rem]">
          {bag.name}
        </p>

        <div className="flex-1" />

        {/* Condition + Price */}
        <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-bronze/10 pt-2.5">
          <span className="font-body text-[11px] italic text-muted">
            {CONDITION_LABELS[bag.condition] ?? bag.condition}
          </span>
          <span className="flex-shrink-0 whitespace-nowrap font-display text-[1rem] font-normal text-ink">
            ₱ {bag.price.toLocaleString('en-PH')}
          </span>
        </div>
      </div>
    </Link>
  )
}