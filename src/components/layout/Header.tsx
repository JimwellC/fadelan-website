'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinksLeft = [
  { href: '/catalog',    label: 'Catalog' },
  { href: '/how-to-buy', label: 'How to Buy' },
]

const navLinksRight = [
  { href: '/about',   label: 'About'   },
  { href: '/contact', label: 'Contact' },
]

const allNavLinks = [...navLinksLeft, ...navLinksRight]

interface HeaderProps {
  heroIsDark?: boolean
}

export default function Header({ heroIsDark = false }: HeaderProps) {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const pathname                  = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // A link is active if the pathname starts with its href (covers nested routes)
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const getColors = () => ({
    link:      scrolled ? 'var(--color-ink)'        : heroIsDark ? 'rgba(245,241,236,0.85)' : 'var(--color-ink)',
    hover:     'var(--color-bronze)',
    logo:      scrolled ? 'var(--color-ink)'        : heroIsDark ? 'var(--color-cream)'     : 'var(--color-ink)',
    hamburger: scrolled ? 'var(--color-ink)'        : heroIsDark ? 'var(--color-cream)'     : 'var(--color-ink)',
    diamond:   scrolled ? 'var(--color-bronze)'     : heroIsDark ? 'rgba(139,111,71,0.7)'   : 'var(--color-bronze)',
  })

  const navLinkStyle = (href: string): React.CSSProperties => ({
    fontFamily:     'var(--font-body)',
    fontSize:       '0.6rem',
    fontWeight:     400,
    letterSpacing:  '0.2em',
    textTransform:  'uppercase',
    color:          isActive(href) ? 'var(--color-bronze)' : getColors().link,
    textDecoration: 'none',
    transition:     'color 300ms ease',
    whiteSpace:     'nowrap',
    position:       'relative',
    paddingBottom:  '2px',
  })

  const diamond = (
    <span style={{
      color:      getColors().diamond,
      fontSize:   '0.55rem',
      opacity:    0.9,
      flexShrink: 0,
      lineHeight: 1,
    }}>
      ◆
    </span>
  )

  return (
    <>
      {/* Active link underline style */}
      <style>{`
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 1px;
          background-color: var(--color-bronze);
          opacity: 0.6;
        }
      `}</style>

      <header style={{
        position:        'fixed',
        top:             0,
        left:            0,
        right:           0,
        zIndex:          50,
        backgroundColor: scrolled ? 'rgba(245,241,236,0.94)' : heroIsDark ? 'rgba(0,0,0,0)' : 'rgba(245,241,236,0.94)',
        backdropFilter:  scrolled ? 'blur(12px)' : 'none',
        borderBottom:    scrolled ? '1px solid rgba(139,111,71,0.12)' : '1px solid transparent',
        transition:      'all 400ms cubic-bezier(0.4,0,0.2,1)',
        padding:         '0 2.5rem',
      }}>
        <div style={{
          display:    'flex',
          alignItems: 'center',
          height:     '4.5rem',
          position:   'relative',
        }}>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="hide-on-desktop"
            style={{
              position:      'absolute',
              left:          0,
              display:       'flex',
              flexDirection: 'column',
              gap:           '5px',
              padding:       '8px',
              background:    'none',
              border:        'none',
              cursor:        'pointer',
            }}
          >
            <span style={{
              display:         'block',
              width:           '22px',
              height:          '1px',
              backgroundColor: getColors().hamburger,
              transition:      'all 300ms ease',
              transform:       menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display:         'block',
              width:           '22px',
              height:          '1px',
              backgroundColor: getColors().hamburger,
              transition:      'all 300ms ease',
              opacity:         menuOpen ? 0 : 1,
            }} />
            <span style={{
              display:         'block',
              width:           '22px',
              height:          '1px',
              backgroundColor: getColors().hamburger,
              transition:      'all 300ms ease',
              transform:       menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
            }} />
          </button>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex"
            style={{ alignItems: 'center', width: '100%', position: 'relative' }}
          >
            {/* Left links */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '1.75rem',
              flex:           1,
              justifyContent: 'flex-end',
              paddingRight:   '2rem',
            }}>
              {navLinksLeft.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={navLinkStyle(link.href)}
                  className={isActive(link.href) ? 'nav-link-active' : ''}
                  onMouseEnter={e => {
                    if (!isActive(link.href))
                      e.currentTarget.style.color = getColors().hover
                  }}
                  onMouseLeave={e => {
                    if (!isActive(link.href))
                      e.currentTarget.style.color = getColors().link
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {diamond}
            </div>

            {/* Wordmark */}
            <Link
              href="/"
              style={{
                fontFamily:     'var(--font-hero)',
                fontSize:       '1.1rem',
                fontWeight:     400,
                letterSpacing:  '0.22em',
                textTransform:  'uppercase',
                color:          getColors().logo,
                textDecoration: 'none',
                whiteSpace:     'nowrap',
                transition:     'color 400ms ease',
                flexShrink:     0,
              }}
            >
              Fad Élan
            </Link>

            {/* Right links */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '1.75rem',
              flex:           1,
              justifyContent: 'flex-start',
              paddingLeft:    '2rem',
            }}>
              {diamond}
              {navLinksRight.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={navLinkStyle(link.href)}
                  className={isActive(link.href) ? 'nav-link-active' : ''}
                  onMouseEnter={e => {
                    if (!isActive(link.href))
                      e.currentTarget.style.color = getColors().hover
                  }}
                  onMouseLeave={e => {
                    if (!isActive(link.href))
                      e.currentTarget.style.color = getColors().link
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile wordmark */}
          <Link
            href="/"
            className="lg:hidden"
            style={{
              fontFamily:     'var(--font-hero)',
              fontSize:       '1rem',
              fontWeight:     400,
              letterSpacing:  '0.2em',
              textTransform:  'uppercase',
              color:          getColors().logo,
              textDecoration: 'none',
              position:       'absolute',
              left:           '50%',
              transform:      'translateX(-50%)',
              whiteSpace:     'nowrap',
              transition:     'color 400ms ease',
            }}
          >
            Fad Élan
          </Link>

        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className="lg:hidden"
        style={{
          position:        'fixed',
          inset:           0,
          zIndex:          40,
          backgroundColor: 'var(--color-cream)',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          opacity:         menuOpen ? 1 : 0,
          pointerEvents:   menuOpen ? 'all' : 'none',
          transition:      'opacity 400ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{
          position:        'absolute',
          top:             0,
          left:            '50%',
          transform:       'translateX(-50%)',
          width:           '1px',
          height:          '4rem',
          backgroundColor: 'var(--color-bronze)',
          opacity:         menuOpen ? 0.25 : 0,
          transition:      'opacity 600ms ease 200ms',
        }} />

        {allNavLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily:     'var(--font-display)',
              fontSize:       '2.5rem',
              fontWeight:     300,
              letterSpacing:  '0.04em',
              color:          isActive(link.href) ? 'var(--color-bronze)' : 'var(--color-ink)',
              textDecoration: 'none',
              padding:        '0.6rem 0',
              opacity:        menuOpen ? 1 : 0,
              transform:      menuOpen ? 'translateY(0)' : 'translateY(16px)',
              transition:     `opacity 500ms ease ${i * 70}ms, transform 500ms cubic-bezier(0.4,0,0.2,1) ${i * 70}ms, color 200ms ease`,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-bronze)')}
            onMouseLeave={e => (e.currentTarget.style.color = isActive(link.href) ? 'var(--color-bronze)' : 'var(--color-ink)')}
          >
            {link.label}
          </Link>
        ))}

        <p style={{
          position:      'absolute',
          bottom:        '2rem',
          fontFamily:    'var(--font-body)',
          fontSize:      '0.6rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:         'var(--color-bronze)',
          opacity:       menuOpen ? 0.6 : 0,
          transition:    'opacity 600ms ease 350ms',
        }}>
          Authentic Pre-loved Luxury
        </p>
      </div>
    </>
  )
}