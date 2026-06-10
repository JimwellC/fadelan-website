'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { BagPhoto } from '@/lib/queries'

interface ProductGalleryProps {
  photos: BagPhoto[]
  name: string
}

export default function ProductGallery({ photos, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const hasMultiple = photos.length > 1

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  if (!photos.length) {
    return (
      <div
        className="relative w-full bg-[#EDE6DC]"
        style={{
          aspectRatio: '4/5',
          borderTopLeftRadius: 0,
          borderTopRightRadius: isDesktop ? '80px' : 0,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          border: '1px solid #D6CEBE',
        }}
      />
    )
  }

  return (
    <div className={`flex gap-2 md:gap-3 ${hasMultiple ? 'flex-col md:flex-row' : ''}`}>

      {/* Main image */}
      <div className={`relative ${hasMultiple ? 'flex-1' : 'w-full'}`}>
        {/* Decorative offset bronze border — hidden on mobile */}
        <div
          className="pointer-events-none absolute hidden md:block"
          style={{
            top: '14px',
            right: '-14px',
            bottom: '-14px',
            left: '0',
            border: '1px solid rgba(139,111,71,0.28)',
            borderTopLeftRadius: 0,
            borderTopRightRadius: '134px',
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            zIndex: 0,
          }}
        />
        <div
          className="relative z-10 w-full overflow-hidden bg-[#EDE6DC]"
          style={{
            aspectRatio: '4/5',
            maxHeight: isDesktop ? '80vh' : '65vh',            
            borderTopLeftRadius: 0,
            borderTopRightRadius: isDesktop ? 'clamp(40px, 8vw, 120px)' : 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
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

      {/* Thumbnail strip — bottom on mobile, right on desktop */}
      {hasMultiple && (
        <div className="flex flex-row gap-1.5 overflow-x-auto pb-1 md:flex-col md:overflow-x-visible md:overflow-y-auto md:pb-0">
          {photos.map((photo, i) => (
            <button
              key={photo._key}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative h-14 w-14 flex-shrink-0 overflow-hidden border transition-all duration-200 md:h-[72px] md:w-[72px] ${
                active === i
                  ? 'border-[#8B6F47] opacity-100'
                  : 'border-[#D6CEBE] opacity-55 hover:border-[#8B6F47] hover:opacity-100'
              }`}
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: '10px',
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
              }}
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