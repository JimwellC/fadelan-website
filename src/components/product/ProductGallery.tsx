'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { BagPhoto } from '@/lib/queries'

interface ProductGalleryProps {
  photos: BagPhoto[]
  name: string
}

export default function ProductGallery({ photos, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const hasMultiple = photos.length > 1

  if (!photos.length) {
    return (
      <div
        className="relative aspect-[4/5] w-full bg-[#EDE6DC]"
        style={{ borderRadius: '0 120px 0 0', border: '1px solid #D6CEBE' }}
      />
    )
  }

  return (
    <div className={`flex gap-3 ${hasMultiple ? 'flex-col md:flex-row' : ''}`}>

      {/* Main image */}
      <div className={`relative ${hasMultiple ? 'flex-1' : 'w-full'}`}>
        {/* Decorative offset bronze border */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: '14px',
            right: '-14px',
            bottom: '-14px',
            left: '0',
            border: '1px solid rgba(139,111,71,0.28)',
            borderRadius: '0 134px 0 0',
            zIndex: 0,
          }}
        />
        <div
          className="relative z-10 w-full overflow-hidden bg-[#EDE6DC]"
          style={{
            aspectRatio: '4/5',
            maxHeight: '80vh',
            borderRadius: '0 120px 0 0',
            border: '1px solid #D6CEBE',
          }}
        >
          <Image
            src={urlFor(photos[active].asset).width(900).format('webp').url()}
            alt={photos[active].alt ?? name}
            fill
            className="object-contain"
            placeholder="blur"
            blurDataURL={photos[active].asset.metadata.lqip}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Thumbnail strip — right on desktop, bottom on mobile */}
      {hasMultiple && (
        <div className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-x-visible md:overflow-y-auto">
          {photos.map((photo, i) => (
            <button
              key={photo._key}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden border transition-all duration-200 md:h-[72px] md:w-[72px] ${
                active === i
                  ? 'border-[#8B6F47]'
                  : 'border-[#D6CEBE] opacity-55 hover:opacity-100 hover:border-[#8B6F47]'
              }`}
              style={{ borderRadius: '0 10px 0 0' }}
            >
              <Image
                src={urlFor(photo.asset).width(160).format('webp').url()}
                alt={photo.alt ?? `${name} ${i + 1}`}
                fill
                className="bg-[#EDE6DC] object-contain"
                placeholder="blur"
                blurDataURL={photo.asset.metadata.lqip}
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}