import { useState, useEffect } from 'react'

const STORAGE_KEY = 'fadelan_wishlist'

export function useWishlist() {
  const [items, setItems] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  const toggle = (slug: string) => {
    setItems((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const isSaved = (slug: string) => mounted && items.includes(slug)

  return { items, toggle, isSaved, mounted }
}