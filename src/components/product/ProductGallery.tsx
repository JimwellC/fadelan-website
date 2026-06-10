'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { BagPhoto } from '@/lib/queries'

interface ProductGalleryProps {
  photos: BagPhoto[]
  name: string
}

export default function ProductGallery({ photos, name }: ProductGalleryProps) {
  const [active,       setActive]       = useState(0)
  const [isDesktop,    setIsDesktop]    = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const hasMultiple = photos.length > 1

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const prev = useCallback(() =>
    setActive((i) => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() =>
    setActive((i) => (i + 1) % photos.length), [photos.length])

  // Keyboard navigation + lock scroll
  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     setLightboxOpen(false)
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, prev, next])

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
    <>
      <div className={`flex gap-2 md:gap-3 ${hasMultiple ? 'flex-col md:flex-row' : ''}`}>

        {/* Main image — clickable to open lightbox */}
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
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="Open image fullscreen"
            className="group relative z-10 block w-full overflow-hidden bg-[#EDE6DC] cursor-zoom-in"
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
              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              placeholder="blur"
              blurDataURL={photos[active].asset.metadata.lqip}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[rgba(28,23,20,0.55)] px-2.5 py-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
              </svg>
              <span className="text-[9px] uppercase tracking-[0.12em] text-white">Zoom</span>
            </div>
          </button>
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

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(20,16,13,0.96)', backdropFilter: 'blur(6px)' }}
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-[rgba(245,241,236,0.15)] text-[rgba(245,241,236,0.6)] transition-colors hover:border-[#8B6F47] hover:text-[#8B6F47]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Counter */}
          {hasMultiple && (
            <div className="absolute left-5 top-5 text-[10px] uppercase tracking-[0.18em] text-[rgba(245,241,236,0.4)]">
              {active + 1} / {photos.length}
            </div>
          )}

          {/* Image */}
          <div
            className="relative mx-auto"
            style={{ width: 'min(90vw, 80vh)', height: 'min(90vw, 80vh)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={urlFor(photos[active].asset).width(1400).format('webp').url()}
              alt={photos[active].alt ?? name}
              fill
              className="object-contain"
              placeholder="blur"
              blurDataURL={photos[active].asset.metadata.lqip}
              sizes="90vw"
              priority
            />
          </div>

          {/* Prev / Next */}
          {hasMultiple && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-[rgba(245,241,236,0.15)] text-[rgba(245,241,236,0.6)] transition-colors hover:border-[#8B6F47] hover:text-[#8B6F47] md:left-8"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-[rgba(245,241,236,0.15)] text-[rgba(245,241,236,0.6)] transition-colors hover:border-[#8B6F47] hover:text-[#8B6F47] md:right-8"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          {hasMultiple && (
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
              {photos.map((photo, i) => (
                <button
                  key={photo._key}
                  onClick={(e) => { e.stopPropagation(); setActive(i) }}
                  aria-label={`Photo ${i + 1}`}
                  className={`relative h-12 w-12 overflow-hidden border transition-all duration-200 ${
                    active === i
                      ? 'border-[#8B6F47] opacity-100'
                      : 'border-[rgba(245,241,236,0.15)] opacity-40 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={urlFor(photo.asset).width(120).format('webp').url()}
                    alt={`${name} ${i + 1}`}
                    fill
                    className="object-contain bg-[#2C2118]"
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard hint */}
          <p className="absolute bottom-5 right-5 hidden text-[9px] uppercase tracking-[0.14em] text-[rgba(245,241,236,0.2)] md:block">
            ← → to navigate · esc to close
          </p>
        </div>
      )}
    </>
  )
}