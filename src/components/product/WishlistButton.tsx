'use client'

import { useWishlist } from '@/hooks/useWishlist'

interface WishlistButtonProps {
  slug: string
  name: string
  /** compact = icon only, default = icon + label */
  compact?: boolean
}

export default function WishlistButton({ slug, name, compact = false }: WishlistButtonProps) {
  const { toggle, isSaved, mounted } = useWishlist()
  const saved = isSaved(slug)

  if (!mounted) {
    // Prevent hydration mismatch — render placeholder same size
    return (
      <button
        aria-label="Save to wishlist"
        disabled
        className={`flex items-center gap-2 border border-[#D6CEBE] text-[10px] uppercase tracking-[0.14em] text-[#8C8275] opacity-0 ${
          compact ? 'h-9 w-9 justify-center' : 'px-3 py-2'
        }`}
      />
    )
  }

  return (
    <button
      onClick={() => toggle(slug)}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={`group flex items-center gap-2 border transition-colors duration-200 text-[10px] uppercase tracking-[0.14em] ${
        saved
          ? 'border-[#8B6F47] text-[#8B6F47]'
          : 'border-[#D6CEBE] text-[#8C8275] hover:border-[#8B6F47] hover:text-[#8B6F47]'
      } ${compact ? 'h-9 w-9 justify-center' : 'px-3 py-2'}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        className="transition-transform duration-200 group-active:scale-125"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {!compact && (saved ? 'Saved' : 'Save')}
    </button>
  )
}