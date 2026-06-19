'use client'

import React from 'react'

interface HeroSocialsProps {
  instagramHandle?: string
  facebookPageUrl?: string
  smsNumber?:       string
}

export default function HeroSocials({ instagramHandle, facebookPageUrl, smsNumber }: HeroSocialsProps) {
  const linkStyle: React.CSSProperties = {
    color:      'var(--color-bronze)',
    opacity:    0.7,
    transition: 'opacity 300ms ease',
    display:    'flex',
  }

  const handleEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.opacity = '1'
  }

  const handleLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.opacity = '0.7'
  }

  return (
    <div
      className="hidden lg:flex"
      style={{
        position:      'absolute',
        right:         '5.5rem',
        top:           '50%',
        transform:     'translateY(-50%)',
        flexDirection: 'column',
        gap:           '1.75rem',
        zIndex:        2,
      }}
    >
      <a
        href={instagramHandle ? `https://instagram.com/${instagramHandle}` : 'https://instagram.com/fadelan.26'}
        target="_blank" rel="noopener noreferrer" aria-label="Instagram"
        style={linkStyle} onMouseEnter={handleEnter} onMouseLeave={handleLeave}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
        </svg>
      </a>

      {facebookPageUrl && (
        <a
          href={facebookPageUrl}
          target="_blank" rel="noopener noreferrer" aria-label="Facebook"
          style={linkStyle} onMouseEnter={handleEnter} onMouseLeave={handleLeave}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
      )}

      {smsNumber && (
        <a
          href={`sms:${smsNumber.replace(/\s+/g, '')}`}
          target="_self" rel="noopener noreferrer" aria-label="Text"
          style={linkStyle} onMouseEnter={handleEnter} onMouseLeave={handleLeave}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
          </svg>
        </a>
      )}
    </div>
  )
}