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
      paddingTop:      '3rem',
      paddingBottom:   '2rem',
    }}>
      <div className="container-site">

        {/* ── Top row ── */}
        <div style={{
          display:              'grid',
          gridTemplateColumns:  '1fr',
          gap:                  '2.5rem',
          paddingBottom:        '2.5rem',
          borderBottom:         '1px solid rgba(245, 241, 236, 0.12)',
        }}
          className="md:grid-cols-3"
        >

          {/* Wordmark + tagline */}
          <div>
            <p style={{
              fontFamily:    'var(--font-display)',
              fontSize:      '1.75rem',
              fontWeight:    300,
              letterSpacing: '0.15em',
              marginBottom:  '0.5rem',
            }}>
              Fad Élan
            </p>
            <p style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color:         'var(--color-bronze-light)',
              opacity:       0.85,
            }}>
              Luxury within reach.
            </p>
          </div>

          {/* Nav links */}
          <nav style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '0.85rem',
          }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily:     'var(--font-body)',
                  fontSize:       '0.7rem',
                  letterSpacing:  '0.15em',
                  textTransform:  'uppercase',
                  color:          'rgba(245, 241, 236, 0.65)',
                  textDecoration: 'none',
                  transition:     'color 300ms ease',
                  width:          'fit-content',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bronze-light)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245, 241, 236, 0.65)')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact / social */}
          <div style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '0.85rem',
          }}>
            <p style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color:         'rgba(245, 241, 236, 0.4)',
              marginBottom:  '0.25rem',
            }}>
              Find us
            </p>
            <a
              href="https://instagram.com/fadelan.26"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:     'var(--font-body)',
                fontSize:       '0.7rem',
                letterSpacing:  '0.15em',
                textTransform:  'uppercase',
                color:          'rgba(245, 241, 236, 0.65)',
                textDecoration: 'none',
                transition:     'color 300ms ease',
                width:          'fit-content',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bronze-light)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245, 241, 236, 0.65)')}
            >
              @fadelan.26
            </a>
            <p style={{
              fontFamily:  'var(--font-body)',
              fontSize:    '0.7rem',
              letterSpacing: '0.1em',
              color:       'rgba(245, 241, 236, 0.5)',
            }}>
              Angeles / Pampanga, Philippines
            </p>
          </div>

        </div>

        {/* ── Bottom row ── */}
        <div style={{
          paddingTop:     '1.5rem',
          display:        'flex',
          flexDirection:  'column',
          gap:            '0.5rem',
          alignItems:     'center',
          textAlign:      'center',
        }}
          className="sm:flex-row sm:justify-between"
        >
          <p style={{
            fontFamily:  'var(--font-body)',
            fontSize:    '0.65rem',
            letterSpacing: '0.1em',
            color:       'rgba(245, 241, 236, 0.35)',
          }}>
            © {year} Fad Élan. All rights reserved.
          </p>
          <p style={{
            fontFamily:  'var(--font-body)',
            fontSize:    '0.65rem',
            letterSpacing: '0.1em',
            color:       'rgba(245, 241, 236, 0.25)',
          }}>
            Authentic pre-loved luxury — Philippines
          </p>
        </div>

      </div>
    </footer>
  )
}