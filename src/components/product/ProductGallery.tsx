'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import type { BagPhoto } from '@/lib/queries'

interface ProductGalleryProps {
  photos: BagPhoto[]
  name: string
}

// Lightbox resolution. 1200 is visually identical to 1400 on screen but
// ~25% smaller to download, so swaps land faster. Bump back to 1400 if you
// want maximum sharpness on very large monitors.
const LIGHTBOX_WIDTH = 1200

function preloadImages(urls: string[]) {
  urls.forEach((src) => {
    const img = new window.Image()
    img.src = src
  })
}

// Shimmer skeleton — bronze-tinted pulse matching the site palette
function ImageSkeleton({ radius }: { radius?: string }) {
  return (
    <div className="absolute inset-0 z-20" style={{ borderTopRightRadius: radius ?? 0 }}>
      <div className="absolute inset-0 bg-[#EDE6DC]" style={{ borderTopRightRadius: radius ?? 0 }} />
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          borderTopRightRadius: radius ?? 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,111,71,0.08) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="12" y="2" width="14" height="14" rx="1" transform="rotate(45 12 12)" fill="rgba(139,111,71,0.15)" />
          <rect x="12" y="5" width="10" height="10" rx="0.5" transform="rotate(45 12 12)" fill="rgba(139,111,71,0.08)" />
        </svg>
      </div>
    </div>
  )
}

// Spinner for the dark lightbox — a bronze ring on the near-black backdrop
function LightboxSpinner() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="animate-spin-slow h-8 w-8 rounded-full border-2 border-[rgba(245,241,236,0.15)] border-t-[#8B6F47]" />
    </div>
  )
}

export default function ProductGallery({ photos, name }: ProductGalleryProps) {
  const [active,       setActive]       = useState(0)
  const [isDesktop,    setIsDesktop]    = useState(false)
  const [isTablet,     setIsTablet]     = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mounted,      setMounted]      = useState(false)
  // Which main-frame images have loaded
  const [loadedSet,    setLoadedSet]    = useState<Set<number>>(new Set())
  // Which lightbox (full-res) images have loaded
  const [lbLoadedSet,  setLbLoadedSet]  = useState<Set<number>>(new Set())
  const hasMultiple = photos.length > 1

  const markLoaded = (i: number) =>
    setLoadedSet((prev) => { const s = new Set(prev); s.add(i); return s })
  const markLbLoaded = (i: number) =>
    setLbLoadedSet((prev) => { const s = new Set(prev); s.add(i); return s })

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      setIsDesktop(w >= 768)
      setIsTablet(w >= 768 && w < 1280)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // On mount: preload all thumbnails + first main image
  useEffect(() => {
    if (!photos.length) return
    preloadImages(photos.map((p) => urlFor(p.asset).width(160).format('webp').url()))
    preloadImages([urlFor(photos[0].asset).width(900).format('webp').url()])
  }, [photos])

  // On active change: preload a WIDER window (±2) so fast clicking through a
  // long gallery doesn't outrun the buffer. Neighbours at 900px for the main
  // frame, and — once the lightbox is open — at LIGHTBOX_WIDTH too.
  useEffect(() => {
    if (!photos.length) return
    const n = photos.length
    const window2 = [
      (active + 1) % n, (active + 2) % n,
      (active - 1 + n) % n, (active - 2 + n) % n,
    ].filter((i) => i !== active)

    preloadImages(window2.map((i) => urlFor(photos[i].asset).width(900).format('webp').url()))

    // Active always; neighbours only while lightbox is open (avoids fetching
    // heavy full-res images nobody has opened yet).
    preloadImages([urlFor(photos[active].asset).width(LIGHTBOX_WIDTH).format('webp').url()])
    if (lightboxOpen) {
      preloadImages(window2.map((i) => urlFor(photos[i].asset).width(LIGHTBOX_WIDTH).format('webp').url()))
    }
  }, [active, photos, lightboxOpen])

  const prev = useCallback(() =>
    setActive((i) => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() =>
    setActive((i) => (i + 1) % photos.length), [photos.length])

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
          height: isTablet ? '68vh' : isDesktop ? '80vh' : '65vh',
          borderTopRightRadius: isDesktop ? '80px' : 0,
          border: '1px solid #D6CEBE',
        }}
      />
    )
  }

  const mainRadius = isDesktop ? 'clamp(40px, 8vw, 120px)' : '0px'

  // ── Lightbox ────────────────────────────────────────────────────────────

  const lightbox = lightboxOpen && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(20,16,13,0.96)', backdropFilter: 'blur(6px)' }}
      onClick={() => setLightboxOpen(false)}
    >
      {/* Close */}
      <button
        onClick={() => setLightboxOpen(false)}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center border border-[rgba(245,241,236,0.15)] text-[rgba(245,241,236,0.6)] transition-colors hover:border-[#8B6F47] hover:text-[#8B6F47]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>

      {/* Counter */}
      {hasMultiple && (
        <div className="absolute left-5 top-5 z-10 text-[10px] uppercase tracking-[0.18em] text-[rgba(245,241,236,0.4)]">
          {active + 1} / {photos.length}
        </div>
      )}

      {/* Image stack — all full-res images mounted, active shown via opacity.
          Navigating is an opacity swap (instant if cached) instead of a
          src change that remounts + re-decodes. A spinner shows while the
          active image hasn't loaded yet. */}
      <div
        className="relative mx-auto"
        style={{ width: 'min(90vw, 80vh)', height: 'min(90vw, 80vh)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spinner while active image isn't ready */}
        {!lbLoadedSet.has(active) && <LightboxSpinner />}

        {photos.map((photo, i) => {
          // Only render the active image and its ±2 neighbours to avoid
          // mounting 14 full-res <Image>s at once; enough to keep swaps instant.
          const n = photos.length
          const near =
            i === active ||
            i === (active + 1) % n || i === (active + 2) % n ||
            i === (active - 1 + n) % n || i === (active - 2 + n) % n
          if (!near) return null

          return (
            <Image
              key={photo._key}
              src={urlFor(photo.asset).width(LIGHTBOX_WIDTH).format('webp').url()}
              alt={photo.alt ?? name}
              fill
              onLoad={() => markLbLoaded(i)}
              className={`object-contain transition-opacity duration-200 ${
                i === active && lbLoadedSet.has(i) ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="90vw"
              priority={i === active}
            />
          )
        })}
      </div>

      {/* Prev / Next */}
      {hasMultiple && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-[rgba(245,241,236,0.15)] text-[rgba(245,241,236,0.6)] transition-colors hover:border-[#8B6F47] hover:text-[#8B6F47] md:left-8"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-[rgba(245,241,236,0.15)] text-[rgba(245,241,236,0.6)] transition-colors hover:border-[#8B6F47] hover:text-[#8B6F47] md:right-8"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </>
      )}

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 max-w-[92vw] overflow-x-auto px-2">
          {photos.map((photo, i) => (
            <button
              key={photo._key}
              onClick={(e) => { e.stopPropagation(); setActive(i) }}
              aria-label={`Photo ${i + 1}`}
              className={`relative h-12 w-12 flex-shrink-0 overflow-hidden border transition-all duration-200 ${
                active === i
                  ? 'border-[#8B6F47] opacity-100'
                  : 'border-[rgba(245,241,236,0.15)] opacity-40 hover:opacity-80'
              }`}
            >
              <Image
                src={urlFor(photo.asset).width(120).format('webp').url()}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
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
  )

  // ── Main gallery ────────────────────────────────────────────────────────

  return (
    <>
      {/* Keyframes — injected once, scoped to this component */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .animate-shimmer { animation: shimmer 1.6s ease-in-out infinite; }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 0.8s linear infinite; }
      `}</style>

      <div
        className={`flex h-full gap-3 ${
          hasMultiple ? 'flex-col-reverse md:flex-row md:items-stretch' : 'w-full flex-col'
        }`}
      >
        {/* Thumbnail strip */}
        {hasMultiple && (
          <div className="flex flex-shrink-0 flex-row justify-center gap-2 overflow-x-auto pb-1 md:flex-col md:justify-start md:overflow-x-visible md:pb-0">
            {photos.map((photo, i) => (
              <button
                key={photo._key}
                onClick={() => setActive(i)}
                aria-label={`View photo ${i + 1}`}
                className={`relative flex-shrink-0 overflow-hidden border bg-[#EDE6DC] transition-all duration-200 ${
                  isTablet ? 'h-[52px] w-[52px]' : isDesktop ? 'h-[72px] w-[72px]' : 'h-14 w-14'
                } ${
                  active === i
                    ? 'border-[#8B6F47] opacity-100'
                    : 'border-[#D6CEBE] opacity-55 hover:border-[#8B6F47] hover:opacity-100'
                }`}
                style={{ borderTopRightRadius: '10px' }}
              >
                <Image
                  src={urlFor(photo.asset).width(160).format('webp').url()}
                  alt={photo.alt ?? `${name} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image — items-start keeps the frame at its own fixed height
           rather than stretching to match a taller sibling column */}
        <div className="relative min-w-0 w-full flex-1 flex items-start self-start">
          {/* Decorative offset bronze border */}
          <div
            className="pointer-events-none absolute hidden md:block"
            style={{
              top: '14px', right: '-14px', bottom: '-14px', left: '0',
              border: '1px solid rgba(139,111,71,0.28)',
              borderTopRightRadius: '134px',
              zIndex: 0,
            }}
          />

          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="Open image fullscreen"
            className="group relative z-10 block w-full overflow-hidden bg-[#EDE6DC] cursor-zoom-in"
            style={{
              // Explicit height instead of aspectRatio + maxHeight. The old
              // combo fought each other: aspectRatio sets height from width,
              // maxHeight then clamps it, and the box stops being 4/5 — which
              // left an empty gap below the photo inside the frame. A fixed
              // height per breakpoint is unambiguous, and object-cover fills
              // it edge-to-edge on any photo ratio (portrait or landscape).
              height: isTablet ? '68vh' : isDesktop ? '80vh' : '65vh',
              borderTopRightRadius: mainRadius,
              border: '1px solid #D6CEBE',
            }}
          >
            {!loadedSet.has(active) && <ImageSkeleton radius={mainRadius} />}

            {photos.map((photo, i) => (
              <Image
                key={photo._key}
                src={urlFor(photo.asset).width(900).format('webp').url()}
                alt={photo.alt ?? name}
                fill
                onLoad={() => markLoaded(i)}
                className={`object-cover transition-opacity duration-200 ${
                  i === active && loadedSet.has(i) ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                priority={i === 0}
                placeholder="blur"
                blurDataURL={photo.asset.metadata.lqip}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ))}

            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 bg-[rgba(28,23,20,0.55)] px-2.5 py-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
              </svg>
              <span className="text-[9px] uppercase tracking-[0.12em] text-white">Zoom</span>
            </div>
          </button>
        </div>
      </div>

      {mounted && lightbox && createPortal(lightbox, document.body)}
    </>
  )
}