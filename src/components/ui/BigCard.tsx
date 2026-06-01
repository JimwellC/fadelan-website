'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor, bagImageUrl } from '@/lib/sanity'
import { BRAND_LABELS, CONDITION_LABELS, AVAILABILITY_LABELS } from '@/lib/sanity'
import type { BagListItem } from '@/lib/queries'

interface BagCardProps {
  bag: BagListItem
}

const availabilityBadge: Record<string, { bg: string; color: string }> = {
  available: { bg: 'rgba(21,128,61,0.85)',    color: '#fff' },
  reserved:  { bg: 'rgba(217,119,6,0.85)',    color: '#fff' },
  on_hold:   { bg: 'rgba(234,88,12,0.85)',    color: '#fff' },
  sold:      { bg: 'rgba(115,114,110,0.85)',  color: '#fff' },
}

export default function BagCard({ bag }: BagCardProps) {
  const coverUrl = bag.coverPhoto?.asset
  ? bagImageUrl(bag.coverPhoto.asset, { width: 600, height: 750 })
  : null

  const lqip   = bag.coverPhoto?.asset?.metadata?.lqip ?? undefined
  const isSold = bag.availability === 'sold'
  const badge  = availabilityBadge[bag.availability] ?? availabilityBadge.available

  return (
    <Link
      href={`/catalog/${bag.slug.current}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <article
        style={{ cursor: 'pointer' }}
        className="group"
      >

        {/* ── Photo ── */}
        <div style={{
          position:        'relative',
          aspectRatio:     '4 / 5',
          overflow:        'hidden',
          backgroundColor: 'var(--color-cream-dark)',
        }}>
          {coverUrl ? (
            <>
              <Image
                src={coverUrl}
                alt={bag.coverPhoto?.alt ?? `${BRAND_LABELS[bag.brand] ?? bag.brand} ${bag.name}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                style={{
                  objectFit:      'contain',
                  objectPosition: 'center center',
                  filter:         isSold ? 'grayscale(40%)' : 'none',
                  transition:     'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                placeholder={lqip ? 'blur' : 'empty'}
                blurDataURL={lqip}
                className={isSold ? '' : 'group-hover:scale-[1.04]'}
              />

                {/* Availability badge */}
                <div style={{
                  position:        'absolute',
                  top:             '0.75rem',
                  left:            '0.75rem',
                  backgroundColor: badge.bg,
                  color:           badge.color,
                  fontFamily:      'var(--font-body)',
                  fontSize:        '0.55rem',
                  fontWeight:      500,
                  letterSpacing:   '0.14em',
                  textTransform:   'uppercase',
                  padding:         '0.25rem 0.625rem',
                }}>
                  {AVAILABILITY_LABELS[bag.availability] ?? bag.availability}
                </div>

                {/* Hover overlay */}
                {!isSold && (
                  <div style={{
                    position:   'absolute',
                    inset:      0,
                    background: 'linear-gradient(to top, rgba(26,26,26,0.45) 0%, transparent 50%)',
                    opacity:    0,
                    transition: 'opacity 400ms ease',
                    display:    'flex',
                    alignItems: 'flex-end',
                    padding:    '1rem',
                  }}
                    className="group-hover:opacity-100"
                  >
                    <span style={{
                      fontFamily:    'var(--font-body)',
                      fontSize:      '0.6rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color:         'var(--color-cream)',
                    }}>
                      View details →
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div style={{
                width:          '100%',
                aspectRatio:    '4 / 5',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                color:          'var(--color-muted)',
                fontFamily:     'var(--font-body)',
                fontSize:       '0.65rem',
                letterSpacing:  '0.12em',
                textTransform:  'uppercase',
              }}>
                No photo
              </div>
            )}
          </div>

        {/* ── Info ── */}
        <div style={{
          padding:         '0.875rem 0.75rem',
          backgroundColor: 'var(--color-cream-dark)',
          borderTop:       '1px solid rgba(26,26,26,0.06)',
        }}>

          {/* Brand */}
          <p style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '0.55rem',
            fontWeight:    500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'var(--color-bronze)',
            marginBottom:  '0.2rem',
          }}>
            {BRAND_LABELS[bag.brand] ?? bag.brand}
          </p>

          {/* Name */}
          <p style={{
            fontFamily:   'var(--font-display)',
            fontSize:     '1rem',
            fontWeight:   400,
            lineHeight:   1.25,
            color:        'var(--color-ink)',
            marginBottom: '0.5rem',
          }}>
            {bag.name}
          </p>

          {/* Condition + Price */}
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            gap:            '0.5rem',
          }}>
            <p style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.6rem',
              letterSpacing: '0.06em',
              color:         'var(--color-muted)',
            }}>
              {CONDITION_LABELS[bag.condition] ?? bag.condition}
            </p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize:   '0.975rem',
              fontWeight: 500,
              color:      isSold ? 'var(--color-muted)' : 'var(--color-ink)',
              whiteSpace: 'nowrap',
            }}>
              {isSold ? 'Sold' : `₱${bag.price.toLocaleString('en-PH')}`}
            </p>
          </div>

        </div>
      </article>
    </Link>
  )
}