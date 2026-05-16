'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { BRAND_LABELS, CONDITION_LABELS, AVAILABILITY_LABELS } from '@/lib/sanity'
import type { BagListItem } from '@/lib/queries'

interface BagCardProps {
  bag: BagListItem
}

const availabilityColors: Record<string, string> = {
  available: 'var(--color-bronze)',
  reserved:  '#C4963A',
  sold:      'var(--color-ink-light)',
}

export default function BagCard({ bag }: BagCardProps) {
  const coverUrl = bag.coverPhoto?.asset
    ? urlFor(bag.coverPhoto.asset).width(600).height(800).format('webp').quality(85).url()
    : null

  const lqip = bag.coverPhoto?.asset?.metadata?.lqip ?? undefined
  const isSold = bag.availability === 'sold'

  return (
    <Link
      href={`/bag/${bag.slug.current}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <article style={{ cursor: 'pointer' }}>

        {/* ── Photo ── */}
        <div style={{
          position:     'relative',
          aspectRatio:  '3 / 4',
          overflow:     'hidden',
          backgroundColor: 'var(--color-cream-dark)',
          marginBottom: '0.875rem',
        }}>
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={bag.coverPhoto?.alt ?? `${BRAND_LABELS[bag.brand] ?? bag.brand} ${bag.name}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{
                objectFit:  'cover',
                filter:     isSold ? 'grayscale(40%)' : 'none',
                transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              placeholder={lqip ? 'blur' : 'empty'}
              blurDataURL={lqip}
              onMouseEnter={e => {
                if (!isSold) (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'
              }}
            />
          ) : (
            <div style={{
              width:           '100%',
              height:          '100%',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              color:           'var(--color-ink-light)',
              fontFamily:      'var(--font-body)',
              fontSize:        '0.7rem',
              letterSpacing:   '0.1em',
              textTransform:   'uppercase',
            }}>
              No photo
            </div>
          )}

          {/* Availability badge */}
          {bag.availability !== 'available' && (
            <div style={{
              position:        'absolute',
              top:             '0.75rem',
              left:            '0.75rem',
              backgroundColor: availabilityColors[bag.availability] ?? 'var(--color-ink)',
              color:           'var(--color-cream)',
              fontFamily:      'var(--font-body)',
              fontSize:        '0.6rem',
              fontWeight:      500,
              letterSpacing:   '0.12em',
              textTransform:   'uppercase',
              padding:         '0.25rem 0.625rem',
            }}>
              {AVAILABILITY_LABELS[bag.availability] ?? bag.availability}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div style={{ paddingInline: '0.125rem' }}>

          {/* Brand */}
          <p style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '0.6rem',
            fontWeight:    500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color:         'var(--color-bronze)',
            marginBottom:  '0.25rem',
          }}>
            {BRAND_LABELS[bag.brand] ?? bag.brand}
          </p>

          {/* Name */}
          <p style={{
            fontFamily:    'var(--font-display)',
            fontSize:      '1.05rem',
            fontWeight:    400,
            lineHeight:    1.3,
            color:         'var(--color-ink)',
            marginBottom:  '0.375rem',
          }}>
            {bag.name}
          </p>

          {/* Condition + Price row */}
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            gap:            '0.5rem',
          }}>
            <p style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.65rem',
              letterSpacing: '0.08em',
              color:         'var(--color-ink-light)',
            }}>
              {CONDITION_LABELS[bag.condition] ?? bag.condition}
            </p>
            <p style={{
              fontFamily:  'var(--font-display)',
              fontSize:    '1rem',
              fontWeight:  500,
              color:       isSold ? 'var(--color-ink-light)' : 'var(--color-ink)',
              whiteSpace:  'nowrap',
            }}>
              ₱{bag.price.toLocaleString('en-PH')}
            </p>
          </div>

        </div>
      </article>
    </Link>
  )
}