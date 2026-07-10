'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

/**
 * Editorial Settle — a quiet, restrained page transition in the vein of
 * Polène / Mansur Gavriel / The Row.
 *
 * On each route change the new page settles into place: a whisper of upward
 * movement (7px) with a slow ease-out-expo curve, paired with a gentle
 * opacity lift that starts near-visible (0.6, never fully transparent) so
 * nothing behind ever shows through — no flash. The luxury is in the easing
 * and restraint, not in any panel or effect. Content is the moment.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }

    // Start: barely lowered, barely dimmed (never fully transparent, so the
    // page is effectively always opaque — no see-through, no flash).
    el.style.transition = 'none'
    el.style.opacity = '0.6'
    el.style.transform = 'translateY(7px)'

    const raf = requestAnimationFrame(() => {
      // ease-out-expo: fast to settle, long graceful tail — reads "considered".
      el.style.transition =
        'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })

    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return (
    <div
      style={{
        backgroundColor: 'var(--color-cream, #F5F1EC)',
        minHeight: '100vh',
      }}
    >
      <div ref={ref} style={{ opacity: 0.6, transform: 'translateY(7px)' }}>
        {children}
      </div>
    </div>
  )
}