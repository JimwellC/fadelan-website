import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { CONDITION_LABELS, AVAILABILITY_LABELS, BRAND_LABELS } from '@/lib/sanity'
import type { BagListItem } from '@/lib/queries'

interface BagCardProps {
  bag: BagListItem
}

const availabilityStyles: Record<string, string> = {
  available: 'text-green-700',
  reserved:  'text-amber-500',
  sold:      'text-neutral-500',
}

export default function BagCard({ bag }: BagCardProps) {
  return (
    <Link
      href={`/catalog/${bag.slug.current}`}
      className="group block bg-[#F5F1EC] transition-transform duration-300 hover:-translate-y-0.5"
    >
      {/* Image — natural height, no crop */}
      <div className="relative overflow-hidden bg-[#EDE6DC] border border-[#D6CEBE]">
        {bag.coverPhoto ? (
          <Image
            src={urlFor(bag.coverPhoto.asset).width(600).format('webp').url()}
            alt={bag.coverPhoto.alt ?? bag.name}
            width={bag.coverPhoto.asset.metadata.dimensions.width}
            height={bag.coverPhoto.asset.metadata.dimensions.height}
            className="w-full transition-transform duration-700 group-hover:scale-[1.02]"
            placeholder="blur"
            blurDataURL={bag.coverPhoto.asset.metadata.lqip}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="aspect-[4/5] w-full bg-[#D6CEBE]" />
        )}

        {/* Availability badge */}
        <div className="absolute left-2.5 top-2.5">
          <span
            className={`bg-[rgba(245,241,236,0.92)] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
              availabilityStyles[bag.availability] ?? 'text-neutral-500'
            }`}
          >
            {AVAILABILITY_LABELS[bag.availability] ?? bag.availability}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="border border-t-0 border-[#D6CEBE] px-3 pt-3 pb-2">
        {/* Brand + Price row */}
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#8B6F47]">
            {BRAND_LABELS[bag.brand] ?? bag.brand}
          </p>
          <p className="font-['Cormorant_Garamond'] text-[1.15rem] text-[#1A1A1A] whitespace-nowrap">
            ₱ {bag.price.toLocaleString('en-PH')}
          </p>
        </div>

        {/* Name */}
        <p className="mb-1.5 font-['Cormorant_Garamond'] text-[1.2rem] font-normal leading-[1.2] text-[#1A1A1A]">
          {bag.name}
        </p>

        {/* Condition · Color */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#8C8275]">
            {CONDITION_LABELS[bag.condition] ?? bag.condition}
          </span>
          {bag.color && (
            <>
              <span className="h-[2px] w-[2px] rounded-full bg-[#C8BFB2]" />
              <span className="text-[11px] text-[#8C8275]">{bag.color}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}