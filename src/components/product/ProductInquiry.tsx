'use client'

import { buildInquiryUrls } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/queries'

interface ProductInquiryProps {
  bagName: string
  price: number
  settings: SiteSettings
}

const ICONS: Record<string, string> = {
  Messenger: 'M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.46 5.56 3.742 7.28V22l3.352-1.84c.896.248 1.843.381 2.906.381 5.523 0 10-4.144 10-9.298C22 6.145 17.523 2 12 2zm1.023 12.52l-2.548-2.717-4.976 2.717 5.476-5.815 2.61 2.717 4.913-2.717-5.475 5.815z',
  Instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  Viber: 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.12 14.71l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.696.876z',
}

export default function ProductInquiry({ bagName, price, settings }: ProductInquiryProps) {
  const { instagram, viber, messenger } = buildInquiryUrls({
    bagName,
    price,
    settings,
  })

  const channels = [
    { label: 'Messenger', href: messenger, iconKey: 'Messenger' },
    { label: 'Instagram', href: instagram, iconKey: 'Instagram' },
    { label: 'Viber',     href: viber,     iconKey: 'Viber' },
  ].filter((c) => c.href)

  if (!channels.length) return null

  return (
    <div className="flex gap-2">
      {channels.map((c) => (
        <a
          key={c.label}
          href={c.href!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 border border-[#D6CEBE] bg-[#F5F1EC] px-4 py-3.5 text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A] transition-colors hover:border-[#8B6F47] hover:text-[#8B6F47]"
        >
          <svg
            className="h-[14px] w-[14px] flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={ICONS[c.iconKey]} />
          </svg>
          {c.label}
        </a>
      ))}
    </div>
  )
}