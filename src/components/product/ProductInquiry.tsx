'use client'

import { useState } from 'react'
import Link from 'next/link'
import { buildInquiryUrls } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/queries'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface ProductInquiryProps {
  bagName:  string
  price:    number
  settings: SiteSettings
}

const ICONS: Record<string, string> = {
  Messenger: 'M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.46 5.56 3.742 7.28V22l3.352-1.84c.896.248 1.843.381 2.906.381 5.523 0 10-4.144 10-9.298C22 6.145 17.523 2 12 2zm1.023 12.52l-2.548-2.717-4.976 2.717 5.476-5.815 2.61 2.717 4.913-2.717-5.475 5.815z',
  Instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  Text: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z',
}

export default function ProductInquiry({ bagName, price, settings }: ProductInquiryProps) {
  const { instagram, messenger, instagramMessage, smsNumber, smsMessage } = buildInquiryUrls({ bagName, price, settings })
  const [copied, setCopied] = useState(false)

  const handleInstagramClick = async (_e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!instagramMessage) return
    try {
      await navigator.clipboard.writeText(instagramMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard can fail on non-HTTPS/in-app webviews — fail silently,
      // Instagram still opens via the href below either way.
    }
  }

  // sms: URI body param separator differs by OS — iOS uses &, Android uses ?.
  // Default to ?, which is correct for Android and still opens the right
  // number (just without a pre-filled body) on iOS as a safe fallback.
  const buildSmsHref = () => {
    if (!smsNumber) return null
    const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)
    const separator = isIOS ? '&' : '?'
    const body = smsMessage ? `${separator}body=${encodeURIComponent(smsMessage)}` : ''
    return `sms:${smsNumber}${body}`
  }

  const channels = [
    { label: 'Messenger', href: messenger,      iconKey: 'Messenger' },
    { label: 'Instagram', href: instagram,       iconKey: 'Instagram' },
    { label: 'Text',      href: buildSmsHref(),  iconKey: 'Text'      },
  ].filter((c) => c.href)

  if (!channels.length) return null

  return (
    <ScrollReveal>
      <div className="flex flex-col gap-2">

        {/* Messaging channels */}
        <div className="flex flex-wrap gap-2">
          {channels.map((c) => (
            <ScrollReveal key={c.label} className="flex flex-1 basis-[7.5rem]">
              <a
                href={c.href!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={c.label === 'Instagram' ? handleInstagramClick : undefined}
                className="flex w-full items-center justify-center gap-2 whitespace-nowrap border border-[#D6CEBE] bg-[#F5F1EC] px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A] transition-colors hover:border-[#8B6F47] hover:text-[#8B6F47] md:px-4 md:py-3.5"
              >
                <svg className="h-[13px] w-[13px] flex-shrink-0 md:h-[14px] md:w-[14px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d={ICONS[c.iconKey]} />
                </svg>
                {c.label === 'Instagram' && copied ? 'Copied!' : c.label}
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* Contact form */}
        <ScrollReveal>
          <Link
            href="/contact"
            className="flex w-full items-center justify-center gap-2 bg-[#8B6F47] px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-[#F5F1EC] transition-colors hover:bg-[#7a6040] md:py-3.5"
          >
            <svg className="h-[13px] w-[13px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
            </svg>
            Contact form
          </Link>
        </ScrollReveal>

      </div>
    </ScrollReveal>
  )
}