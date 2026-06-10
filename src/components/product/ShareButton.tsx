'use client'

import { useState } from 'react'

interface ShareButtonProps {
  name: string
  brand: string
  price: number
}

export default function ShareButton({ name, brand, price }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [open,   setOpen]   = useState(false)

  const url   = typeof window !== 'undefined' ? window.location.href : ''
  const title = `${brand} ${name} — ₱${price.toLocaleString('en-PH')} · Fadelan`
  const text  = `Check out this ${brand} ${name} on Fadelan — pre-loved luxury bags.`

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // user cancelled — no-op
      }
      return
    }
    setOpen((v) => !v)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => { setCopied(false); setOpen(false) }, 2000)
  }

  const shareChannels = [
    {
      label: 'Copy link',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
        </svg>
      ),
      action: copyLink,
    },
    {
      label: 'Facebook',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        setOpen(false)
      },
    },
    {
      label: 'Viber',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.12 14.71l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.696.876z"/>
        </svg>
      ),
      action: () => {
        window.open(`viber://forward?text=${encodeURIComponent(`${title}\n${url}`)}`, '_self')
        setOpen(false)
      },
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        aria-label="Share this bag"
        className="flex items-center gap-2 border border-[#D6CEBE] px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[#8C8275] transition-colors hover:border-[#8B6F47] hover:text-[#8B6F47]"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/>
        </svg>
        Share
      </button>

      {/* Dropdown — shown when no native share */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-full z-20 mt-1 w-44 border border-[#D6CEBE] bg-[#F5F1EC] shadow-sm">
            {shareChannels.map((ch) => (
              <button
                key={ch.label}
                onClick={ch.action}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-[11px] text-[#1A1A1A] transition-colors hover:bg-[#EDE6DC] hover:text-[#8B6F47]"
              >
                <span className="text-[#8B6F47]">{ch.icon}</span>
                {ch.label === 'Copy link' && copied ? 'Copied!' : ch.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}