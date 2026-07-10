'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number   // ms, default 0
  className?: string
}

/**
 * Reveal-on-scroll wrapper.
 *
 * Previous version set opacity:0 as the INITIAL inline style, which was
 * baked into the server-rendered HTML. That meant the whole page rendered
 * invisible and only appeared after React hydrated AND the observer fired —
 * producing a blank page during every navigation (and staying blank forever
 * if JS was slow or failed).
 *
 * This version is progressive-enhancement safe:
 *   - It only hides content AFTER it has mounted on the client and confirmed
 *     the element is currently below the fold. Above-the-fold content (and
 *     the SSR/no-JS case) is visible immediately — no flash of empty page.
 *   - A failsafe timeout reveals anything still hidden after 1.2s, so nothing
 *     can ever get stuck invisible.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Start VISIBLE. We only hide (to animate in) if, after mount, we confirm
  // the element is off-screen below the fold.
  const [revealed, setRevealed] = useState(true)
  const [armed, setArmed] = useState(false) // becomes true once client decides to animate

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect reduced-motion — no animation, stay visible.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const rect = el.getBoundingClientRect()
    const belowFold = rect.top > window.innerHeight * 0.9

    // Above the fold (or already in view): leave it visible, no animation.
    if (!belowFold) return

    // Below the fold: arm the animation — hide, then reveal on scroll-in.
    setArmed(true)
    setRevealed(false)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)

    // Failsafe: never let content stay hidden. If the observer hasn't
    // fired within 1.2s (edge cases, fast scroll, layout shifts), reveal.
    const failsafe = setTimeout(() => setRevealed(true), 1200 + delay)

    return () => {
      observer.disconnect()
      clearTimeout(failsafe)
    }
  }, [delay])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(20px)',
        transition: armed
          ? `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms`
          : undefined,
      }}
    >
      {children}
    </div>
  )
}