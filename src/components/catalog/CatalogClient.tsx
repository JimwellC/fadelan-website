'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { BagListItem, FilterOptions } from '@/lib/queries'
import { BRAND_LABELS, CONDITION_LABELS } from '@/lib/sanity'
import { useWishlist } from '@/hooks/useWishlist'
import CatalogFilters from './CatalogFilters'
import BagCard from './BagCard'

interface ActiveFilters {
  availability: string[]
  brands: string[]
  conditions: string[]
  sizes: string[]
  minPrice: string
  maxPrice: string
  savedOnly: boolean
}

const DEFAULT_FILTERS: ActiveFilters = {
  availability: [],
  brands: [],
  conditions: [],
  sizes: [],
  minPrice: '',
  maxPrice: '',
  savedOnly: false,
}

type SortKey = 'newest' | 'price_asc' | 'price_desc'

const ITEMS_PER_PAGE = 12

interface CatalogClientProps {
  bags: BagListItem[]
  filterOptions: FilterOptions
}

/**
 * Pure filter predicate — no sorting, no pagination.
 * Shared by both the committed `filtered` list and the staged `draftCount`
 * preview so the two can never drift out of sync.
 */
function filterBags(
  bags: BagListItem[],
  f: ActiveFilters,
  savedSlugs: string[],
  wishlistMounted: boolean,
): BagListItem[] {
  let result = bags
  if (f.savedOnly && wishlistMounted)
    result = result.filter((b) => savedSlugs.includes(b.slug.current))
  if (f.availability.length)
    result = result.filter((b) => f.availability.includes(b.availability))
  if (f.brands.length)
    result = result.filter((b) => f.brands.includes(b.brand))
  if (f.conditions.length)
    result = result.filter((b) => f.conditions.includes(b.condition))
  if (f.sizes.length)
    result = result.filter((b) => f.sizes.includes(b.size))
  if (f.minPrice)
    result = result.filter((b) => b.price >= Number(f.minPrice))
  if (f.maxPrice)
    result = result.filter((b) => b.price <= Number(f.maxPrice))
  return result
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

type CornerPos = 'tl' | 'tr' | 'bl' | 'br'

function CornerOrnament({ position }: { position: CornerPos }) {
  const pos: Record<CornerPos, string> = {
    tl: 'top-5 left-5 md:top-10 md:left-10',
    tr: 'top-5 right-5 md:top-10 md:right-10 -scale-x-100',
    bl: 'bottom-5 left-5 md:bottom-10 md:left-10 -scale-y-100',
    br: 'bottom-5 right-5 md:bottom-10 md:right-10 -scale-x-100 -scale-y-100',
  }
  return (
    <div className={`pointer-events-none absolute hidden md:block ${pos[position]}`} aria-hidden>
      <div className="relative h-8 w-8 md:h-12 md:w-12">
        <div className="absolute -left-[3px] -top-[3px] h-[6px] w-[6px] rotate-45 bg-bronze/60 md:h-2 md:w-2" />
        <div className="absolute left-0 top-0 h-px w-full bg-bronze/40" />
        <div className="absolute left-0 top-0 h-full w-px bg-bronze/40" />
        <div className="absolute -bottom-1 left-0 h-2 w-px bg-bronze/40 md:-bottom-1.5 md:h-3" />
        <div className="absolute -right-1 top-0 h-px w-2 bg-bronze/40 md:-right-1.5 md:w-3" />
      </div>
    </div>
  )
}

const TRANSITION_MS = 260

function useFilterTransition(filtered: BagListItem[]) {
  const [displayed,   setDisplayed]   = useState<BagListItem[]>(filtered)
  const [exitingIds,  setExitingIds]  = useState<Set<string>>(new Set())
  const [enteringIds, setEnteringIds] = useState<Set<string>>(new Set())
  const prevIdsRef = useRef(new Set(filtered.map((b) => b._id)))
  const timerRef   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const nextIds  = new Set(filtered.map((b) => b._id))
    const prevIds  = prevIdsRef.current
    const leaving  = [...prevIds].filter((id) => !nextIds.has(id))
    const arriving = filtered.filter((b) => !prevIds.has(b._id))
    prevIdsRef.current = nextIds
    clearTimeout(timerRef.current)

    if (leaving.length === 0) {
      const newIds = new Set(arriving.map((b) => b._id))
      setDisplayed(filtered); setExitingIds(new Set()); setEnteringIds(newIds)
      timerRef.current = setTimeout(() => setEnteringIds(new Set()), 320 + arriving.length * 40 + 100)
      return
    }
    if (leaving.length === prevIds.size) {
      setExitingIds(new Set(leaving)); setEnteringIds(new Set())
      timerRef.current = setTimeout(() => {
        const newIds = new Set(filtered.map((b) => b._id))
        setDisplayed(filtered); setExitingIds(new Set()); setEnteringIds(newIds)
        timerRef.current = setTimeout(() => setEnteringIds(new Set()), 320 + filtered.length * 40 + 100)
      }, TRANSITION_MS)
      return
    }
    setExitingIds(new Set(leaving)); setEnteringIds(new Set(arriving.map((b) => b._id)))
    setDisplayed((prev) => {
      const prevIdSet = new Set(prev.map((b) => b._id))
      return [...prev, ...filtered.filter((b) => !prevIdSet.has(b._id))]
    })
    timerRef.current = setTimeout(() => {
      setDisplayed(filtered); setExitingIds(new Set()); setEnteringIds(new Set())
    }, TRANSITION_MS)
    return () => clearTimeout(timerRef.current)
  }, [filtered])

  return { displayed, exitingIds, enteringIds }
}

const DIAMOND_TEXTURE = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='13' y='13' width='6' height='6' fill='none' stroke='%238B6F47' stroke-width='0.5' stroke-opacity='0.14' transform='rotate(45 16 16)'/%3E%3C/svg%3E")`

export default function CatalogClient({ bags, filterOptions }: CatalogClientProps) {
  const [sidebarOpen,       setSidebarOpen]       = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [active,            setActive]            = useState<ActiveFilters>(DEFAULT_FILTERS)
  const [draft,             setDraft]             = useState<ActiveFilters>(DEFAULT_FILTERS)
  const [sort,              setSort]              = useState<SortKey>('newest')
  const [page,              setPage]              = useState(1)
  const [loadedCount,       setLoadedCount]       = useState(ITEMS_PER_PAGE)
  const isDesktop = useIsDesktop()
  const { items: savedSlugs, mounted: wishlistMounted } = useWishlist()

  // The sheet is portaled to <body>, which needs the DOM — so only render it
  // after mount to stay SSR-safe.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Lock background scroll while the mobile sheet is open.
  useEffect(() => {
    if (!mobileFiltersOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [mobileFiltersOpen])

  function updateActive(next: ActiveFilters) {
    setActive(next)
    setPage(1)
    setLoadedCount(ITEMS_PER_PAGE)
  }
  function updateSort(next: SortKey) {
    setSort(next); setPage(1); setLoadedCount(ITEMS_PER_PAGE)
  }

  // ── Mobile draft-filter controls (staged; commit on Apply) ──
  function openMobileFilters() {
    setDraft(active) // seed the draft from what's currently committed
    setMobileFiltersOpen(true)
  }
  function closeMobileFilters() {
    setMobileFiltersOpen(false) // dismiss = discard draft
  }
  function applyMobileFilters() {
    updateActive(draft)
    setMobileFiltersOpen(false)
  }
  function toggleDraft(
    key: 'availability' | 'brands' | 'conditions' | 'sizes',
    value: string,
  ) {
    setDraft((d) => {
      const arr = d[key]
      const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]
      return { ...d, [key]: next }
    })
  }

  const draftDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(DEFAULT_FILTERS),
    [draft],
  )

  const filtered = useMemo(() => {
    const result = filterBags(bags, active, savedSlugs, wishlistMounted)
    const sorted = [...result]
    if (sort === 'price_asc')       sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') sorted.sort((a, b) => b.price - a.price)
    else sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    return sorted
  }, [bags, active, sort, savedSlugs, wishlistMounted])

  // Live preview count for the Apply button — reflects the staged draft,
  // NOT the committed filters.
  const draftCount = useMemo(
    () => filterBags(bags, draft, savedSlugs, wishlistMounted).length,
    [bags, draft, savedSlugs, wishlistMounted],
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = useMemo(() => {
    if (isDesktop) return filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    return filtered.slice(0, loadedCount)
  }, [filtered, page, loadedCount, isDesktop])

  const { displayed, exitingIds, enteringIds } = useFilterTransition(paginatedItems)
  const enterIndexMap = useMemo(() => {
    const map = new Map<string, number>()
    displayed.filter((b) => enteringIds.has(b._id)).forEach((b, i) => map.set(b._id, i))
    return map
  }, [displayed, enteringIds])

  const scrollToCatalog = () =>
    document.getElementById('catalog-toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Desktop tag chips still apply immediately (they operate on `active`).
  const activeTags: { label: string; onRemove: () => void }[] = [
    ...active.availability.map((v) => ({
      label: v === 'on_hold' ? 'On hold' : v.charAt(0).toUpperCase() + v.slice(1),
      onRemove: () => updateActive({ ...active, availability: active.availability.filter((x) => x !== v) }),
    })),
    ...active.brands.map((v) => ({
      label: BRAND_LABELS[v] ?? v,
      onRemove: () => updateActive({ ...active, brands: active.brands.filter((x) => x !== v) }),
    })),
    ...active.conditions.map((v) => ({
      label: CONDITION_LABELS[v] ?? v.charAt(0).toUpperCase() + v.slice(1),
      onRemove: () => updateActive({ ...active, conditions: active.conditions.filter((x) => x !== v) }),
    })),
    ...active.sizes.map((v) => ({
      label: v.charAt(0).toUpperCase() + v.slice(1),
      onRemove: () => updateActive({ ...active, sizes: active.sizes.filter((x) => x !== v) }),
    })),
  ]

  const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <line x1="2" y1="4" x2="14" y2="4" /><line x1="4" y1="8" x2="12" y2="8" /><line x1="6" y1="12" x2="10" y2="12" />
    </svg>
  )

  return (
    <div className="border-t border-bronze/20">

      {/* ── Mobile filter sheet (staged: commit on Apply) ──
          Portaled to <body> so `position: fixed` is viewport-relative and
          can't be trapped by a transformed ancestor. A transform / filter /
          will-change / contain on ANY parent creates a containing block, which
          was pinning the sheet to the bottom of the page content (below the
          products) instead of the viewport. */}
      {mounted && createPortal(
        <div className="md:hidden">
        {/* Backdrop — now genuinely tappable since the sheet no longer covers it */}
        <div
          onClick={closeMobileFilters}
          aria-hidden
          className={`fixed inset-0 z-40 bg-ink/50 transition-opacity duration-400 ease-luxury ${
            mobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Sheet — always mounted so the slide-up actually animates.
            `inert` when closed keeps its buttons out of the tab order. */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter pieces"
          aria-hidden={!mobileFiltersOpen}
          {...(!mobileFiltersOpen && { inert: true })}
          className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col overflow-hidden bg-ivory shadow-[0_-8px_40px_rgba(26,26,26,0.14)] transition-transform duration-500 ease-luxury ${
            mobileFiltersOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Drag handle — also closes on tap */}
          <div className="flex flex-shrink-0 justify-center pb-2 pt-3">
            <button
              onClick={closeMobileFilters}
              aria-label="Close filters"
              className="h-1 w-10 rounded-full bg-bronze/30"
            />
          </div>

          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between border-b border-bronze/20 bg-ivory px-5 py-3.5">
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.18em] text-ink">Refine</p>
            <button
              onClick={() => setDraft(DEFAULT_FILTERS)}
              disabled={!draftDirty}
              className="font-body text-[10px] uppercase tracking-[0.1em] text-bronze transition-colors duration-400 ease-luxury hover:text-bronze-dark disabled:cursor-not-allowed disabled:opacity-30"
            >
              Reset
            </button>
          </div>

          {/* Scrollable groups */}
          <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y">

            {/* Saved toggle */}
            {wishlistMounted && savedSlugs.length > 0 && (
              <div className="border-b border-bronze/20 px-5 py-4">
                <button
                  onClick={() => setDraft((d) => ({ ...d, savedOnly: !d.savedOnly }))}
                  className={`flex w-full items-center gap-2.5 py-1 transition-colors duration-200 ${draft.savedOnly ? 'text-[#8B6F47]' : 'text-muted'}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={draft.savedOnly ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  <span className="font-body text-[11px] uppercase tracking-[0.14em]">Show saved only</span>
                  <span className={`ml-auto flex h-5 w-5 items-center justify-center font-body text-[10px] ${draft.savedOnly ? 'bg-[#8B6F47] text-[#F5F1EC]' : 'bg-bronze/10 text-bronze'}`}>
                    {savedSlugs.length}
                  </span>
                </button>
              </div>
            )}

            {/* Availability */}
            <div className="border-b border-bronze/20 px-5 py-4">
              <p className="mb-3 font-body text-[10px] uppercase tracking-[0.18em] text-muted">Availability</p>
              <div className="flex flex-wrap gap-2">
                {(['available', 'reserved', 'on_hold', 'sold'] as const).map((v) => {
                  const label = v === 'on_hold' ? 'On hold' : v.charAt(0).toUpperCase() + v.slice(1)
                  const checked = draft.availability.includes(v)
                  return (
                    <button key={v} onClick={() => toggleDraft('availability', v)}
                      className={`px-3.5 py-2 font-body text-[11px] tracking-[0.1em] border transition-colors duration-400 ease-luxury ${checked ? 'border-ink bg-ink text-ivory' : 'border-bronze/30 text-muted'}`}>
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Brand */}
            {filterOptions.brands.length > 0 && (
              <div className="border-b border-bronze/20 px-5 py-4">
                <p className="mb-3 font-body text-[10px] uppercase tracking-[0.18em] text-muted">Brand</p>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.brands.map((brand) => {
                    const checked = draft.brands.includes(brand)
                    return (
                      <button key={brand} onClick={() => toggleDraft('brands', brand)}
                        className={`px-3.5 py-2 font-body text-[11px] tracking-[0.1em] border transition-colors duration-400 ease-luxury ${checked ? 'border-ink bg-ink text-ivory' : 'border-bronze/30 text-muted'}`}>
                        {BRAND_LABELS[brand] ?? brand}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Condition */}
            {filterOptions.conditions.length > 0 && (
              <div className="border-b border-bronze/20 px-5 py-4">
                <p className="mb-3 font-body text-[10px] uppercase tracking-[0.18em] text-muted">Condition</p>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.conditions.map((cond) => {
                    const checked = draft.conditions.includes(cond)
                    return (
                      <button key={cond} onClick={() => toggleDraft('conditions', cond)}
                        className={`px-3.5 py-2 font-body text-[11px] tracking-[0.1em] border transition-colors duration-400 ease-luxury ${checked ? 'border-ink bg-ink text-ivory' : 'border-bronze/30 text-muted'}`}>
                        {CONDITION_LABELS[cond] ?? cond}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Price range */}
            <div className="border-b border-bronze/20 px-5 py-4">
              <p className="mb-3 font-body text-[10px] uppercase tracking-[0.18em] text-muted">Price range</p>
              <div className="flex items-center gap-3">
                <input type="number" inputMode="numeric" placeholder="Min" value={draft.minPrice}
                  onChange={(e) => setDraft((d) => ({ ...d, minPrice: e.target.value }))}
                  className="w-full border border-bronze/20 bg-transparent px-3 py-2.5 font-body text-[13px] text-ink outline-none focus:border-bronze" />
                <span className="flex-shrink-0 font-body text-[12px] text-bronze/40">—</span>
                <input type="number" inputMode="numeric" placeholder="Max" value={draft.maxPrice}
                  onChange={(e) => setDraft((d) => ({ ...d, maxPrice: e.target.value }))}
                  className="w-full border border-bronze/20 bg-transparent px-3 py-2.5 font-body text-[13px] text-ink outline-none focus:border-bronze" />
              </div>
            </div>

            {/* Size */}
            {filterOptions.sizes.length > 0 && (
              <div className="px-5 py-4">
                <p className="mb-3 font-body text-[10px] uppercase tracking-[0.18em] text-muted">Size</p>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.sizes.map((size) => {
                    const checked = draft.sizes.includes(size)
                    return (
                      <button key={size} onClick={() => toggleDraft('sizes', size)}
                        className={`px-3.5 py-2 font-body text-[11px] tracking-[0.1em] border transition-colors duration-400 ease-luxury ${checked ? 'border-ink bg-ink text-ivory' : 'border-bronze/30 text-muted'}`}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer — Apply. Previews the staged count; disabled at 0 matches. */}
          <div className="flex-shrink-0 border-t border-bronze/20 bg-ivory p-4">
            <button
              onClick={applyMobileFilters}
              disabled={draftCount === 0}
              className="w-full bg-ink py-3.5 font-body text-[11px] font-medium uppercase tracking-[0.22em] text-ivory transition-colors duration-400 ease-luxury active:bg-bronze disabled:cursor-not-allowed disabled:bg-bronze/30 disabled:text-ivory/70"
            >
              {draftCount === 0
                ? 'No matching pieces'
                : `View ${draftCount} ${draftCount === 1 ? 'piece' : 'pieces'}`}
            </button>
          </div>
        </div>
        </div>,
        document.body,
      )}

      {/* ── Toolbar ── */}
      <div id="catalog-toolbar" className="border-b border-bronze/20 px-4 py-3 md:px-[10%]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
               onClick={openMobileFilters} aria-label="Open filters"
              className="flex h-9 w-9 items-center justify-center border border-bronze/20 text-ink transition-colors duration-400 ease-luxury hover:border-bronze md:hidden">
              <FilterIcon />
            </button>
            <button onClick={() => setSidebarOpen((v) => !v)} aria-pressed={sidebarOpen} aria-label="Toggle filters"
              className={`hidden h-9 w-9 items-center justify-center border transition-colors duration-400 ease-luxury md:flex ${sidebarOpen ? 'border-ink bg-ink text-ivory' : 'border-bronze/20 text-ink hover:border-bronze'}`}>
              <FilterIcon />
            </button>
            {activeTags.length > 0 && (
              <div className="hidden flex-wrap gap-1.5 md:flex">
                {activeTags.map((tag) => (
                  <span key={tag.label} className="flex items-center gap-1.5 bg-ink px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.08em] text-ivory">
                    {tag.label}
                    <button onClick={tag.onRemove} aria-label={`Remove ${tag.label} filter`} className="opacity-60 transition-opacity hover:opacity-100">×</button>
                  </span>
                ))}
              </div>
            )}
            {activeTags.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center bg-ink font-body text-[10px] text-ivory md:hidden">{activeTags.length}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display italic text-[1.3rem] leading-none text-muted">{filtered.length}</span>
              <span className="font-body text-[9px] uppercase tracking-[0.22em] text-muted/60">pieces</span>
            </div>
            <div className="h-3.5 w-px bg-bronze/20" />
            <select value={sort} onChange={(e) => updateSort(e.target.value as SortKey)} aria-label="Sort by"
              className="border border-bronze/20 bg-ivory px-2 py-1.5 font-body text-[11px] text-muted outline-none transition-colors duration-400 ease-luxury hover:border-bronze focus:border-bronze">
              <option value="newest">Newest</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Gallery ── */}
      <div className="relative overflow-hidden" style={{ backgroundImage: DIAMOND_TEXTURE, backgroundSize: '32px 32px' }}>
        <div className="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden>
          <p aria-hidden className="absolute left-[8%] top-[8%] hidden whitespace-nowrap font-hero uppercase italic leading-none tracking-[0.22em] text-bronze md:block" style={{ fontSize: 'clamp(90px, 14vw, 220px)', opacity: 0.045 }}>Fad</p>
          <p aria-hidden className="absolute left-[20%] top-[42%] hidden whitespace-nowrap font-hero uppercase italic leading-none tracking-[0.22em] text-bronze md:block" style={{ fontSize: 'clamp(90px, 14vw, 220px)', opacity: 0.045 }}>Élan</p>
          <p aria-hidden className="absolute left-[40%] top-[72%] hidden whitespace-nowrap font-display italic leading-none text-bronze md:block" style={{ fontSize: 'clamp(75px, 12vw, 185px)', opacity: 0.045 }}>Collection</p>
          <CornerOrnament position="tl" /><CornerOrnament position="tr" /><CornerOrnament position="bl" /><CornerOrnament position="br" />
        </div>

        <div className="relative z-10 mx-auto w-full px-4 pt-10 pb-16 md:w-[80%] md:px-0 md:pt-14 md:pb-24">
          <div className="mb-10 flex items-center gap-4 md:mb-14">
            <div className="h-px flex-1 bg-bronze/20" />
            <div className="flex items-center gap-3">
              <span className="text-[9px] text-bronze/40">◆</span>
              <p className="font-body text-[9px] uppercase tracking-[0.34em] text-muted/70">
                {active.savedOnly ? 'Saved Pieces' : 'The Collection'}
              </p>
              <span className="text-[9px] text-bronze/40">◆</span>
            </div>
            <div className="h-px flex-1 bg-bronze/20" />
          </div>

          <div className="flex items-start gap-6">
            {/* Sidebar open width — was a single w-[220px] applied at any
               width past md (768px). On tablet, 220px takes a larger
               proportional bite out of the available space than on
               desktop, leaving little room for cards (per screenshot,
               only ~2 cards' worth of space remained). Tablet now opens
               to a narrower 180px; desktop (xl:, 1280px+) keeps the
               original 220px. */}
            <aside className={`hidden flex-shrink-0 overflow-hidden transition-all duration-400 ease-luxury md:block ${sidebarOpen ? 'w-[180px] xl:w-[220px] opacity-100' : 'pointer-events-none w-0 opacity-0'}`}>
              <CatalogFilters filters={filterOptions} active={active} onChange={updateActive} onClear={() => updateActive(DEFAULT_FILTERS)} />
            </aside>

            <div className="min-w-0 flex-1">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  {active.savedOnly ? (
                    <>
                      <svg className="mx-auto mb-4 text-bronze/30" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      <p className="font-display text-2xl font-normal italic text-muted">No saved pieces yet</p>
                      <p className="mt-2 font-body text-[12px] text-muted/60">Tap the heart on any bag to save it here</p>
                      <button onClick={() => updateActive({ ...active, savedOnly: false })} className="mt-4 font-body text-[11px] uppercase tracking-[0.1em] text-bronze hover:underline">
                        Browse all pieces
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-2xl font-normal italic text-muted">No pieces match your filters</p>
                      <button onClick={() => updateActive(DEFAULT_FILTERS)} className="mt-4 font-body text-[11px] uppercase tracking-[0.1em] text-bronze transition-colors duration-400 ease-luxury hover:text-bronze-dark hover:underline">
                        Clear filters
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {/* Grid columns — was grid-cols-2 md:grid-cols-3 lg:grid-cols-4,
                     mixing this session's md:/xl: tablet-desktop scheme with
                     Tailwind's default lg:1024px, which sits INSIDE the
                     768-1279px tablet range rather than at the 1280px
                     desktop line. That mismatch meant tablet got 3 columns
                     starting at 768px then jumped to 4 at 1024px — still
                     within "tablet" by this session's definition. Fixed to
                     stay at 2 columns through the whole tablet range
                     (matching the narrower sidebar above), only expanding
                     to 4 at xl: (1280px+, true desktop). */}
                  <div className="grid grid-cols-2 gap-3 md:gap-0.5 xl:grid-cols-4">
                    {displayed.map((bag) => {
                      const isExiting = exitingIds.has(bag._id)
                      const isEntering = enteringIds.has(bag._id)

                      const enterIndex = enterIndexMap.get(bag._id) ?? 0

                      return (
                        <div
                          key={bag._id}
                          style={{
                            animationDelay: isExiting
                              ? '0ms'
                              : isEntering
                                ? `${enterIndex * 60}ms`
                                : '0ms',
                          }}
                          className={`h-full ${
                            isExiting
                              ? 'animate-bag-exit pointer-events-none'
                              : isEntering
                                ? 'animate-bag-enter'
                                : ''
                          }`}
                        >
                          <BagCard bag={bag} />
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-12 md:mt-16">
                    <div className="md:hidden">
                      {loadedCount < filtered.length ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex w-full items-center gap-4">
                            <div className="h-px flex-1 bg-bronze/15" />
                            <button onClick={() => setLoadedCount((c) => c + ITEMS_PER_PAGE)}
                              className="font-body text-[11px] uppercase tracking-[0.22em] text-bronze transition-colors duration-400 ease-luxury hover:text-bronze-dark">View more</button>
                            <div className="h-px flex-1 bg-bronze/15" />
                          </div>
                          <p className="font-body text-[9px] uppercase tracking-[0.2em] text-muted/50">{Math.min(loadedCount, filtered.length)} of {filtered.length}</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-bronze/15" /><span className="text-[8px] text-bronze/25">◆</span><div className="h-px flex-1 bg-bronze/15" />
                        </div>
                      )}
                    </div>
                    <div className="hidden md:block">
                      {totalPages > 1 ? (
                        <>
                          <p className="mb-5 text-center font-display italic text-[0.95rem] text-muted">
                            {(page - 1) * ITEMS_PER_PAGE + 1}{' — '}{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} pieces
                          </p>
                          <div className="flex items-center justify-center gap-0.5">
                            <button onClick={() => { setPage((p) => p - 1); scrollToCatalog() }} disabled={page === 1} aria-label="Previous page"
                              className="flex h-9 w-9 items-center justify-center font-body text-sm text-muted transition-colors duration-400 ease-luxury hover:text-ink disabled:cursor-not-allowed disabled:opacity-25">←</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                              <button key={n} onClick={() => { setPage(n); scrollToCatalog() }} aria-label={`Page ${n}`} aria-current={n === page ? 'page' : undefined}
                                className={`flex h-9 w-9 items-center justify-center font-body text-[11px] transition-colors duration-400 ease-luxury ${n === page ? 'bg-ink text-ivory' : 'text-muted hover:text-ink'}`}>{n}</button>
                            ))}
                            <button onClick={() => { setPage((p) => p + 1); scrollToCatalog() }} disabled={page === totalPages} aria-label="Next page"
                              className="flex h-9 w-9 items-center justify-center font-body text-sm text-muted transition-colors duration-400 ease-luxury hover:text-ink disabled:cursor-not-allowed disabled:opacity-25">→</button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-bronze/15" /><span className="text-[8px] text-bronze/25">◆</span><div className="h-px flex-1 bg-bronze/15" />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}