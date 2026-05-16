'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '/catalog',    label: 'Catalog'    },
  { href: '/about',      label: 'About'      },
  { href: '/how-to-buy', label: 'How to Buy' },
  { href: '/contact',    label: 'Contact'    },
]

export default function Header() {
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)

  // Add backdrop blur + border when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          right:           0,
          zIndex:          50,
          backgroundColor: scrolled ? 'rgba(245, 241, 236, 0.92)' : 'transparent',
          backdropFilter:  scrolled ? 'blur(12px)' : 'none',
          borderBottom:    scrolled ? '1px solid rgba(139, 111, 71, 0.15)' : '1px solid transparent',
          transition:      'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="container-site">
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            height:         '4rem',
          }}>

            {/* ── Mobile: Hamburger ── */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{
                display:    'flex',
                flexDirection: 'column',
                gap:        '5px',
                padding:    '8px',
                background: 'none',
                border:     'none',
                cursor:     'pointer',
                color:      'var(--color-ink)',
              }}
              className="lg:hidden"
            >
              <span style={{
                display:         'block',
                width:           '22px',
                height:          '1px',
                backgroundColor: 'var(--color-ink)',
                transition:      'all 300ms ease',
                transform:       menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
              }} />
              <span style={{
                display:         'block',
                width:           '22px',
                height:          '1px',
                backgroundColor: 'var(--color-ink)',
                transition:      'all 300ms ease',
                opacity:         menuOpen ? 0 : 1,
              }} />
              <span style={{
                display:         'block',
                width:           '22px',
                height:          '1px',
                backgroundColor: 'var(--color-ink)',
                transition:      'all 300ms ease',
                transform:       menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
              }} />
            </button>

            {/* ── Wordmark — centered on mobile, left on desktop ── */}
            <Link
              href="/"
              style={{
                fontFamily:    'var(--font-display)',
                fontSize:      '1.5rem',
                fontWeight:    300,
                letterSpacing: '0.15em',
                color:         'var(--color-ink)',
                textDecoration: 'none',
                position:      'absolute',
                left:          '50%',
                transform:     'translateX(-50%)',
                whiteSpace:    'nowrap',
              }}
            >
              Fad Élan
            </Link>

            {/* ── Desktop nav ── */}
            <nav
              className="hidden lg:flex"
              style={{ gap: '2.5rem', marginLeft: 'auto' }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily:    'var(--font-body)',
                    fontSize:      '0.7rem',
                    fontWeight:    400,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color:         'var(--color-ink)',
                    textDecoration: 'none',
                    transition:    'color 300ms ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bronze)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ink)')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Spacer (balances hamburger on mobile) ── */}
            <div style={{ width: '38px' }} className="lg:hidden" />

          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      <div
        style={{
          position:        'fixed',
          inset:           0,
          zIndex:          40,
          backgroundColor: 'var(--color-cream)',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          gap:             '2.5rem',
          opacity:         menuOpen ? 1 : 0,
          pointerEvents:   menuOpen ? 'all' : 'none',
          transition:      'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="lg:hidden"
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily:    'var(--font-display)',
              fontSize:      '2.25rem',
              fontWeight:    300,
              letterSpacing: '0.05em',
              color:         'var(--color-ink)',
              textDecoration: 'none',
              opacity:       menuOpen ? 1 : 0,
              transform:     menuOpen ? 'translateY(0)' : 'translateY(12px)',
              transition:    `opacity 400ms ease ${i * 60}ms, transform 400ms ease ${i * 60}ms, color 200ms ease`,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bronze)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ink)')}
          >
            {link.label}
          </Link>
        ))}

        {/* Subtle brand line at bottom of mobile menu */}
        <p style={{
          position:      'absolute',
          bottom:        '2rem',
          fontFamily:    'var(--font-body)',
          fontSize:      '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         'var(--color-bronze)',
          opacity:       0.7,
        }}>
          Authentic Pre-loved Luxury
        </p>
      </div>
    </>
  )
}