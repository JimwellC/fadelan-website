import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { HOMEPAGE_QUERY } from '@/lib/queries'
import type { BagListItem, SiteSettings } from '@/lib/queries'
import BagCard from '@/components/ui/BigCard'

interface HomepageData {
  settings: Pick<SiteSettings, 'heroHeadline' | 'heroSubline' | 'tagline'> & {
    featuredBags?: BagListItem[]
  }
  fallbackBags: BagListItem[]
}

const pillars = [
  {
    number: '01',
    title:  'Authenticated',
    body:   'Every piece is personally verified before it is listed. We photograph every flaw honestly — no surprises on arrival.',
  },
  {
    number: '02',
    title:  'Curated',
    body:   'We carry what we believe in. Our catalog is intentionally small — each bag earns its place.',
  },
  {
    number: '03',
    title:  'Within reach',
    body:   'Luxury should not require a waiting list. Pre-loved means exceptional quality at a price that makes sense.',
  },
]

const steps = [
  { step: '01', title: 'Browse',  body: 'Find a bag you love in the catalog. Check the condition photos carefully.' },
  { step: '02', title: 'Inquire', body: 'Tap the Messenger, Instagram, or Viber button. We reply within the day.' },
  { step: '03', title: 'Reserve', body: 'Send a down payment to hold your bag. We take it off the market immediately.' },
  { step: '04', title: 'Receive', body: 'Pay the balance and choose pickup in Pampanga or nationwide / international shipping.' },
]

export default async function HomePage() {
  const data = await sanityFetch<HomepageData>(HOMEPAGE_QUERY)

  const headline = data?.settings?.heroHeadline ?? 'Carried before. Coveted still.'
  const subline  = data?.settings?.heroSubline  ?? 'Authenticated pre-loved luxury bags, sourced with care.'
  const bags     = data?.settings?.featuredBags?.length
    ? data.settings.featuredBags
    : data?.fallbackBags ?? []

  return (
    <>
      {/* ════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════ */}
      <section style={{
        minHeight:      '92vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        textAlign:      'center',
        padding:        '5rem 1.5rem 4rem',
        position:       'relative',
        overflow:       'hidden',
      }}>

        {/* Subtle decorative line */}
        <div style={{
          position:        'absolute',
          top:             0,
          left:            '50%',
          transform:       'translateX(-50%)',
          width:           '1px',
          height:          '5rem',
          backgroundColor: 'var(--color-bronze)',
          opacity:         0.35,
        }} />

        {/* Eyebrow */}
        <p style={{
          fontFamily:    'var(--font-body)',
          fontSize:      '0.65rem',
          fontWeight:    400,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color:         'var(--color-bronze)',
          marginBottom:  '1.75rem',
        }}>
          Authentic Pre-loved Luxury · Philippines
        </p>

        {/* Headline */}
        <h1 style={{
          fontFamily:    'var(--font-display)',
          fontSize:      'clamp(2.5rem, 8vw, 5.5rem)',
          fontWeight:    300,
          lineHeight:    1.1,
          letterSpacing: '-0.01em',
          color:         'var(--color-ink)',
          maxWidth:      '800px',
          marginBottom:  '1.75rem',
        }}>
          {headline}
        </h1>

        {/* Divider */}
        <div style={{
          width:           '2.5rem',
          height:          '1px',
          backgroundColor: 'var(--color-bronze)',
          marginBottom:    '1.75rem',
          opacity:         0.6,
        }} />

        {/* Subline */}
        <p style={{
          fontFamily:    'var(--font-body)',
          fontSize:      'clamp(0.875rem, 2vw, 1rem)',
          fontWeight:    300,
          lineHeight:    1.75,
          color:         'var(--color-ink-light)',
          maxWidth:      '520px',
          marginBottom:  '2.5rem',
        }}>
          {subline}
        </p>

        {/* CTA */}
        <Link href="/catalog" className="btn-primary">
          View the Catalog
        </Link>

        {/* Bottom decorative line */}
        <div style={{
          position:        'absolute',
          bottom:          0,
          left:            '50%',
          transform:       'translateX(-50%)',
          width:           '1px',
          height:          '3rem',
          backgroundColor: 'var(--color-bronze)',
          opacity:         0.25,
        }} />
      </section>

      {/* ════════════════════════════════════════════════
          FEATURED BAGS
      ════════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container-site">

          {/* Section header */}
          <div style={{
            display:       'flex',
            alignItems:    'baseline',
            justifyContent:'space-between',
            marginBottom:  '2.5rem',
            gap:           '1rem',
            flexWrap:      'wrap',
          }}>
            <div>
              <p style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         'var(--color-bronze)',
                marginBottom:  '0.375rem',
              }}>
                Now available
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize:   'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 300,
                color:      'var(--color-ink)',
              }}>
                The Current Edit
              </h2>
            </div>
            <Link
              href="/catalog"
              className="btn-ghost"
              style={{ flexShrink: 0 }}
            >
              View all →
            </Link>
          </div>

          {/* Grid */}
          {bags.length > 0 ? (
            <div style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap:                 'clamp(1rem, 3vw, 1.75rem)',
            }}
              className="sm:grid-cols-2 lg:grid-cols-4"
            >
              {bags.slice(0, 8).map((bag) => (
                <BagCard key={bag._id} bag={bag} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign:   'center',
              padding:     '5rem 0',
              color:       'var(--color-ink-light)',
              fontFamily:  'var(--font-display)',
              fontSize:    '1.25rem',
              fontWeight:  300,
            }}>
              The catalog is being curated. Check back soon.
            </div>
          )}

        </div>
      </section>

      {/* ════════════════════════════════════════════════
          BRAND PILLARS
      ════════════════════════════════════════════════ */}
      <section style={{
        padding:         '5rem 0',
        backgroundColor: 'var(--color-ink)',
      }}>
        <div className="container-site">

          <div style={{
            textAlign:    'center',
            marginBottom: '3.5rem',
          }}>
            <p style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color:         'var(--color-bronze-light)',
              marginBottom:  '1rem',
            }}>
              Our promise
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize:   'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 300,
              color:      'var(--color-cream)',
            }}>
              Why Fad Élan
            </h2>
          </div>

          <div style={{
            display:             'grid',
            gridTemplateColumns: '1fr',
            gap:                 '2.5rem',
          }}
            className="md:grid-cols-3"
          >
            {pillars.map((pillar) => (
              <div key={pillar.number} style={{
                borderTop:   '1px solid rgba(245, 241, 236, 0.12)',
                paddingTop:  '1.75rem',
              }}>
                <p style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.6rem',
                  letterSpacing: '0.2em',
                  color:         'var(--color-bronze-light)',
                  marginBottom:  '1rem',
                }}>
                  {pillar.number}
                </p>
                <h3 style={{
                  fontFamily:   'var(--font-display)',
                  fontSize:     '1.5rem',
                  fontWeight:   300,
                  color:        'var(--color-cream)',
                  marginBottom: '0.875rem',
                }}>
                  {pillar.title}
                </h3>
                <p style={{
                  fontFamily:  'var(--font-body)',
                  fontSize:    '0.875rem',
                  lineHeight:  1.75,
                  color:       'rgba(245, 241, 236, 0.6)',
                }}>
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════
          HOW TO BUY
      ════════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container-site">

          <div style={{
            textAlign:    'center',
            marginBottom: '3.5rem',
          }}>
            <p style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color:         'var(--color-bronze)',
              marginBottom:  '1rem',
            }}>
              Simple process
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize:   'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 300,
              color:      'var(--color-ink)',
            }}>
              How it works
            </h2>
          </div>

          <div style={{
            display:             'grid',
            gridTemplateColumns: '1fr',
            gap:                 '0',
          }}
            className="sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((step, i) => (
              <div key={step.step} style={{
                padding:     '2rem 1.5rem',
                borderTop:   '1px solid rgba(26, 26, 26, 0.1)',
                borderLeft:  i > 0 ? '1px solid rgba(26, 26, 26, 0.1)' : 'none',
              }}>
                <p style={{
                  fontFamily:    'var(--font-display)',
                  fontSize:      '2.5rem',
                  fontWeight:    300,
                  color:         'var(--color-bronze)',
                  opacity:       0.4,
                  lineHeight:    1,
                  marginBottom:  '1rem',
                }}>
                  {step.step}
                </p>
                <h3 style={{
                  fontFamily:   'var(--font-display)',
                  fontSize:     '1.25rem',
                  fontWeight:   400,
                  color:        'var(--color-ink)',
                  marginBottom: '0.625rem',
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   '0.825rem',
                  lineHeight: 1.75,
                  color:      'var(--color-ink-light)',
                }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            textAlign:  'center',
            marginTop:  '3rem',
          }}>
            <Link href="/how-to-buy" className="btn-outline">
              Full buying guide
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}