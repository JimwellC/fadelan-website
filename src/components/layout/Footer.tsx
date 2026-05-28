'use client'

import Link from 'next/link'

const navLinks = [
  { href: '/catalog',    label: 'Catalog'    },
  { href: '/about',      label: 'About'      },
  { href: '/how-to-buy', label: 'How to Buy' },
  { href: '/contact',    label: 'Contact'    },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      backgroundColor: 'var(--color-ink)',
      color:           'var(--color-cream)',
      paddingTop:      'clamp(3rem, 7vw, 5rem)',
      paddingBottom:   '2rem',
      borderTop:       '1px solid rgba(139,111,71,0.25)',
      position:        'relative',
      overflow:        'hidden',
    }}>

      {/* Subtle glow */}
      <div style={{
        position:      'absolute',
        top:           '-30%',
        left:          '-10%',
        width:         '50vw',
        height:        '50vw',
        borderRadius:  '50%',
        background:    'radial-gradient(circle, rgba(139,111,71,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
        zIndex:        0,
      }} />

      <div className="container-site" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Main 3-col grid ── */}
        <div className="footer-grid">

          {/* Col 1 — Logo + tagline + CTA */}
          <div style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '1.5rem',
          }}>
            {/* Logo */}
            <div>
              <Link
                href="/"
                style={{
                  fontFamily:     'var(--font-hero)',
                  fontSize:       'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight:     400,
                  letterSpacing:  '0.16em',
                  textTransform:  'uppercase',
                  color:          'var(--color-cream)',
                  textDecoration: 'none',
                  display:        'block',
                  marginBottom:   '0.5rem',
                }}
              >
                Fad Élan
              </Link>
              <p style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.55rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         'var(--color-bronze)',
                opacity:       0.7,
              }}>
                Authentic Pre-loved Luxury
              </p>
            </div>

            {/* About blurb */}
            <p style={{
              fontFamily:  'var(--font-display)',
              fontSize:    '0.9rem',
              fontStyle:   'italic',
              fontWeight:  300,
              lineHeight:  1.75,
              color:       'rgba(245,241,236,0.4)',
              maxWidth:    '260px',
            }}>
              Every bag carries a story worth telling twice.
            </p>

            {/* CTA */}
            <Link
              href="/catalog"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '0.75rem',
                fontFamily:     'var(--font-body)',
                fontSize:       '0.6rem',
                letterSpacing:  '0.16em',
                textTransform:  'uppercase',
                color:          'var(--color-cream)',
                border:         '1px solid rgba(245,241,236,0.2)',
                padding:        '0.75rem 1.5rem',
                textDecoration: 'none',
                borderRadius:   '999px',
                width:          'fit-content',
                transition:     'all 400ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--color-bronze)'
                e.currentTarget.style.borderColor     = 'var(--color-bronze)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor     = 'rgba(245,241,236,0.2)'
              }}
            >
              Browse Collection
              <span style={{ opacity: 0.6 }}>→</span>
            </Link>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <p style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'rgba(245,241,236,0.3)',
              marginBottom:  '1.25rem',
            }}>
              Quick Links
            </p>
            <nav style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           '0.75rem',
            }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily:     'var(--font-display)',
                    fontSize:       '0.95rem',
                    fontWeight:     300,
                    letterSpacing:  '0.03em',
                    color:          'rgba(245,241,236,0.5)',
                    textDecoration: 'none',
                    transition:     'color 300ms ease',
                    width:          'fit-content',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bronze)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,241,236,0.5)')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Social + Location */}
          <div>
            <p style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'rgba(245,241,236,0.3)',
              marginBottom:  '1.25rem',
            }}>
              Follow Us
            </p>
            <div style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           '0.875rem',
              marginBottom:  '2rem',
            }}>
              {[
                {
                  label: 'Instagram',
                  href:  'https://instagram.com/fadelan.26',
                  handle: '@fadelan.26',
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                    </svg>
                  ),
                },
                {
                  label: 'Facebook',
                  href:  '#',
                  handle: 'Fad Élan',
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Viber',
                  href:  '#',
                  handle: 'Message us',
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  ),
                },
              ].map(({ label, href, handle, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    gap:            '0.625rem',
                    color:          'rgba(245,241,236,0.45)',
                    textDecoration: 'none',
                    transition:     'color 300ms ease',
                    width:          'fit-content',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bronze)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,241,236,0.45)')}
                >
                  {icon}
                  <span style={{
                    fontFamily:    'var(--font-display)',
                    fontSize:      '0.9rem',
                    fontWeight:    300,
                    letterSpacing: '0.02em',
                  }}>
                    {handle}
                  </span>
                </a>
              ))}
            </div>

            {/* Location */}
            <div style={{
              paddingTop:  '1.25rem',
              borderTop:   '1px solid rgba(245,241,236,0.06)',
            }}>
              <p style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.55rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color:         'rgba(245,241,236,0.25)',
                marginBottom:  '0.375rem',
              }}>
                Based in
              </p>
              <p style={{
                fontFamily:    'var(--font-display)',
                fontSize:      '0.9rem',
                fontWeight:    300,
                letterSpacing: '0.02em',
                color:         'rgba(245,241,236,0.35)',
              }}>
                Angeles / Pampanga, Philippines
              </p>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          paddingTop:     '1.5rem',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            '0.5rem',
        }}
          className="sm:flex-row sm:justify-between"
        >
          <p style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '0.6rem',
            letterSpacing: '0.1em',
            color:         'rgba(245,241,236,0.2)',
          }}>
            © {year} Fad Élan. All rights reserved.
          </p>
          <p style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '0.6rem',
            letterSpacing: '0.1em',
            color:         'rgba(245,241,236,0.15)',
          }}>
            Authentic pre-loved luxury
          </p>
        </div>

      </div>
    </footer>
  )
}