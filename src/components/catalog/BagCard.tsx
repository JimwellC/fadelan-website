import Image from 'next/image'
import Link from 'next/link'
import { urlFor, CONDITION_LABELS, BRAND_LABELS } from '@/lib/sanity'
import type { BagListItem } from '@/lib/queries'

interface BagCardProps {
  bag: BagListItem
}

const availabilityIndicator: Record<string, { label: string; className: string }> = {
  reserved: { label: 'Reserved', className: 'text-amber-500' },
  on_hold:  { label: 'On hold',  className: 'text-orange-500' },
  sold:     { label: 'Sold',     className: 'text-neutral-500' },
}

export default function BagCard({ bag }: BagCardProps) {
  const indicator = availabilityIndicator[bag.availability]
  const isSold = bag.availability === 'sold'

  return (
    <Link
      href={`/catalog/${bag.slug.current}`}
      className="group flex h-full flex-col bg-cream-dark border border-bronze/20 transition-colors duration-400 ease-luxury hover:border-bronze/40"
    >
      {/* Image frame */}
      <div className="relative aspect-bag w-full overflow-hidden">
        {bag.coverPhoto ? (
          <Image
            src={urlFor(bag.coverPhoto.asset).width(800).format('webp').url()}
            alt={bag.coverPhoto.alt ?? bag.name}
            fill
            className={`object-contain p-4 transition-transform duration-700 ease-luxury group-hover:scale-[1.03] md:p-5 ${
              isSold ? 'opacity-60' : ''
            }`}
            placeholder={bag.coverPhoto.asset.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={bag.coverPhoto.asset.metadata?.lqip}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-muted/10" />
        )}

        {/* Reserved / On hold — subtle top-left text */}
        {indicator && !isSold && (
          <span
            className={`absolute left-4 top-4 font-body text-[10px] font-medium uppercase tracking-[0.18em] ${indicator.className}`}
          >
            {indicator.label}
          </span>
        )}

        {/* Sold — centered overlay */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-ivory/90 px-5 py-1.5 font-body text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500">
              Sold
            </span>
          </div>
        )}
      </div>

      {/* Info block */}
      <div className="flex-1 px-3 pt-3 pb-4 md:px-4 md:pt-4 md:pb-5">
        {/* Brand + Price */}
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="min-w-0 flex-1 truncate font-body text-[10px] font-medium uppercase tracking-[0.2em] text-bronze">
            {BRAND_LABELS[bag.brand] ?? bag.brand}
          </p>
          <p className="flex-shrink-0 whitespace-nowrap font-display text-[1rem] font-normal text-ink md:text-[1.15rem]">
            ₱ {bag.price.toLocaleString('en-PH')}
          </p>
        </div>

        {/* Bronze hairline — the luxury detail */}
        <div className="mb-2.5 h-px w-8 bg-bronze/30 transition-all duration-400 ease-luxury group-hover:w-14 group-hover:bg-bronze/60 md:mb-3" />

        {/* Name — italic Cormorant */}
        <p className="mb-2.5 line-clamp-1 font-display text-[1.1rem] font-normal italic leading-[1.15] text-ink transition-colors duration-400 ease-luxury md:mb-3 md:line-clamp-2 md:text-[1.4rem] group-hover:text-bronze-dark">
          {bag.name}
        </p>

        {/* Condition · Color */}
        <div className="flex items-center gap-2">
          <span className="font-body text-[11px] italic text-muted">
            {CONDITION_LABELS[bag.condition] ?? bag.condition}
          </span>
          {bag.color && (
            <>
              <span className="h-[3px] w-[3px] rounded-full bg-bronze/40" aria-hidden />
              <span className="font-body text-[11px] italic capitalize text-muted">
                {bag.color}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}