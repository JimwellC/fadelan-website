'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { SiteSettings } from '@/lib/queries'

const LAYAWAY_MIN = 40000

interface LayawaySectionProps {
  bagName: string
  price: number
  settings: SiteSettings
}

const ICONS: Record<string, string> = {
  Messenger:
    'M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.46 5.56 3.742 7.28V22l3.352-1.84c.896.248 1.843.381 2.906.381 5.523 0 10-4.144 10-9.298C22 6.145 17.523 2 12 2zm1.023 12.52l-2.548-2.717-4.976 2.717 5.476-5.815 2.61 2.717 4.913-2.717-5.475 5.815z',

  Instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',

  Text:
    'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z',
}

type Channel = {
  label: string
  iconKey: keyof typeof ICONS
  href: string
}

export default function LayawaySection({
  bagName,
  price,
  settings,
}: LayawaySectionProps) {
  const [open, setOpen] = useState(false)

  if (price < LAYAWAY_MIN) return null

  const layawayMsg = encodeURIComponent(
    `Hi, I'm interested in a layaway arrangement for the ${bagName} (₱${price.toLocaleString(
      'en-PH'
    )}). Can we discuss the terms?`
  )

  const channels: Channel[] = []

  if (settings.messengerUrl) {
    channels.push({
      label: 'Messenger',
      iconKey: 'Messenger',
      href: `${settings.messengerUrl}?text=${layawayMsg}`,
    })
  }

  if (settings.instagramHandle) {
    channels.push({
      label: 'Instagram',
      iconKey: 'Instagram',
      href: `https://ig.me/m/${settings.instagramHandle}`,
    })
  }

  if (settings.smsNumber) {
    const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)
    const separator = isIOS ? '&' : '?'
    channels.push({
      label: 'Text',
      iconKey: 'Text',
      href: `sms:${settings.smsNumber.replace(/\s+/g, '')}${separator}body=${layawayMsg}`,
    })
  }

  if (!channels.length) return null

  return (
    <div
      className="border border-[#D6CEBE] px-5 py-5 mb-5"
      style={{ background: '#FAF8F5', borderTop: 'none' }}
    >
      {!open ? (
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="mb-1.5 text-[9px] uppercase tracking-[0.22em] text-[#8B6F47]">
              Payment plan
            </p>

            <p className="font-['Cormorant_Garamond'] text-[1.3rem] font-light leading-[1.1] text-[#1A1A1A] mb-1.5">
              Avail layaway — 30% down
            </p>

            <p className="text-[11px] leading-[1.7] text-[#8C8275]">
              Balance within 1–2 months · Item released upon full payment.
            </p>

            <Link
              href="/how-to-buy#layaway"
              className="mt-1 inline-block text-[10px] text-[#8B6F47] underline hover:no-underline"
            >
              View terms →
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex-shrink-0 mt-1 bg-[#2C2118] px-5 py-2.5 text-[10px] uppercase tracking-[0.14em] text-[#F5F1EC] transition-colors hover:bg-[#8B6F47]"
          >
            Inquire →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[9px] uppercase tracking-[0.22em] text-[#8B6F47]">
              Layaway inquiry
            </p>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-[#C8BFB2] hover:text-[#8C8275]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-1.5 sm:flex-row">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('sms') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 border border-[#D6CEBE] bg-[#F5F1EC] px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A] transition-colors hover:border-[#8B6F47] hover:text-[#8B6F47]"
              >
                <svg
                  className="h-[13px] w-[13px] flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d={ICONS[c.iconKey]} />
                </svg>
                {c.label}
              </a>
            ))}
          </div>

          <Link
            href="/how-to-buy#layaway"
            className="text-[10px] text-[#8B6F47] underline hover:no-underline"
          >
            View layaway terms →
          </Link>
        </div>
      )}
    </div>
  )
}