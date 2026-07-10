'use client'

import { useSyncExternalStore, useCallback } from 'react'

const STORAGE_KEY = 'fadelan_wishlist'

/**
 * Single shared wishlist store.
 *
 * The previous implementation used per-component useState, so every
 * WishlistCardButton and CatalogClient held its own independent copy of the
 * list. Saves on one component never propagated to the others, and rapid
 * saves from different components raced on the same localStorage key and
 * clobbered each other (last writer wins).
 *
 * This version keeps ONE module-level array that every hook instance
 * subscribes to via useSyncExternalStore. A single toggle mutates the one
 * store, writes localStorage once, and notifies all subscribers — so every
 * heart icon and the "saved only" filter update together and stay in sync.
 */

let items: string[] = []
let hydrated = false
const listeners = new Set<() => void>()

// A cached stable snapshot — useSyncExternalStore requires getSnapshot to
// return a referentially-stable value when nothing changed, or it loops.
let snapshot: string[] = items

function emit() {
  snapshot = items
  listeners.forEach((l) => l())
}

function read(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function write(next: string[]) {
  items = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable (private mode, quota) — state still lives in memory
  }
  emit()
}

// Hydrate once from localStorage on the client.
function hydrate() {
  if (hydrated || typeof window === 'undefined') return
  hydrated = true
  items = read()
  snapshot = items
  // Cross-tab / cross-context sync: if another tab changes the wishlist,
  // pull the new value and notify everyone here.
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      items = read()
      emit()
    }
  })
  emit()
}

function subscribe(listener: () => void) {
  hydrate()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): string[] {
  return snapshot
}

// Server render (and first client snapshot before hydration) sees an empty
// list — matches the old `mounted` guard so there's no hydration mismatch.
const EMPTY: string[] = []
function getServerSnapshot(): string[] {
  return EMPTY
}

export function useWishlist() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = useCallback((slug: string) => {
    // Always derive from the live module state, never a captured snapshot,
    // so concurrent toggles from different components can't clobber.
    const next = items.includes(slug)
      ? items.filter((s) => s !== slug)
      : [...items, slug]
    write(next)
  }, [])

  const isSaved = useCallback((slug: string) => current.includes(slug), [current])

  // `mounted` kept for API compatibility. It's true once the store has
  // hydrated on the client; server/first-paint reads false.
  const mounted = hydrated

  return { items: current, toggle, isSaved, mounted }
}