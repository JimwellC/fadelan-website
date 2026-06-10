'use client'

import { useState } from 'react'
import { useWishlist } from '@/hooks/useWishlist'

interface WishlistCardButtonProps {
  slug: string
  name: string
}

export default function WishlistCardButton({ slug, name }: WishlistCardButtonProps) {
  const { toggle, isSaved, mounted } = useWishlist()
  const [burst, setBurst] = useState(false)
  const saved = isSaved(slug)

  if (!mounted) return null

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!saved) setBurst(true)
    toggle(slug)
  }

  return (
    <>
      <style>{`
        @keyframes heartBurst {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.55); }
          55%  { transform: scale(0.88); }
          75%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes ripple {
          0%   { transform: scale(0.6); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .heart-burst {
          animation: heartBurst 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .heart-ripple {
          animation: ripple 0.45s ease-out forwards;
        }
      `}</style>

      <button
        onClick={handleClick}
        aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center"
        style={{ background: 'none', border: 'none', padding: 0 }}
      >
        {/* Ripple ring — plays on save */}
        {burst && (
          <span
            className="heart-ripple absolute inset-0 rounded-full border border-[#8B6F47]"
            onAnimationEnd={() => setBurst(false)}
          />
        )}

        {/* Heart */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={saved ? '#8B6F47' : 'none'}
          stroke={saved ? '#8B6F47' : '#8B6F47'}
          strokeWidth="1.8"
          className={`relative z-10 transition-colors duration-200 ${burst ? 'heart-burst' : ''}`}
          style={{
            filter: saved
              ? 'drop-shadow(0 0 3px rgba(139,111,71,0.5))'
              : 'drop-shadow(0 1px 2px rgba(139,111,71,0.3))',
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
    </>
  )
}