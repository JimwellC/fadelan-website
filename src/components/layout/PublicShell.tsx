'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import type { SiteSettings } from '@/lib/queries'

interface PublicShellProps {
  children: React.ReactNode
  settings?: SiteSettings
}

export default function PublicShell({ children, settings }: PublicShellProps) {
  const pathname = usePathname()
  const isHidden = pathname.startsWith('/admin') || pathname.startsWith('/studio')

  return (
    <>
      {!isHidden && <Header heroIsDark={true} />}
      {children}
      {!isHidden && <Footer settings={settings} />}
    </>
  )
}