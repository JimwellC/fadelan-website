'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reset — set initial state
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'

    // Trigger paint then animate in
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })

    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return (
    <div ref={ref} style={{ opacity: 0, transform: 'translateY(16px)' }}>
      {children}
    </div>
  )
}