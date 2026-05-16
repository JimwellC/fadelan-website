'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Config } from 'sanity'

const NextStudio = dynamic(
  () => import('next-sanity/studio').then((m) => m.NextStudio),
  { ssr: false }
)

export default function StudioPage() {
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    import('../../../../sanity.config').then((m) => setConfig(m.default))
  }, [])

  if (!config) return null
  return <NextStudio config={config} />
}