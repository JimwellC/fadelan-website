'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import type { BagListItem, FilterOptions } from '@/lib/queries'
import { BRAND_LABELS } from '@/lib/sanity'
import CatalogFilters from './CatalogFilters'
import BagCard from './BagCard'

interface ActiveFilters {
  availability: string[]
  brands: string[]
  conditions: string[]
  sizes: string[]
  minPrice: string
  maxPrice: string
}

const DEFAULT_FILTERS: ActiveFilters = {
  availability: [],
  brands: [],
  conditions: [],
  sizes: [],
  minPrice: '',
  maxPrice: '',
}

type SortKey = 'newest' | 'price_asc' | 'price_desc'

const ITEMS_PER_PAGE = 12

interface CatalogClientProps {
  bags: BagListItem[]
  filterOptions: FilterOptions
}

// ─── useIsDesktop ─────────────────────────────────────────────────
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

// ─── Corner ornament ──────────────────────────────────────────────
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

// ─── Filter transition hook ───────────────────────────────────────
// ─── Filter transition hook ───────────────────────────────────────
const TRANSITION_MS = 260

function useFilterTransition(filtered: BagListItem[]) {
  const [displayed, setDisplayed]   = useState<BagListItem[]>(filtered)
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set())
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

    // ── 1. Pure addition — view more, or filter reveals more items ──
    // No items leaving — just append new ones and stagger them in
    if (leaving.length === 0) {
      const newIds = new Set(arriving.map((b) => b._id))
      setDisplayed(filtered)
      setExitingIds(new Set())
      setEnteringIds(newIds)
      // Clear entering state once last animation finishes
      timerRef.current = setTimeout(
        () => setEnteringIds(new Set()),
        320 + arriving.length * 40 + 100
      )
      return
    }

    // ── 2. Complete replacement — page change or full brand/filter swap ──
    // Exit first, THEN enter. Sequential feel like turning a page.
    if (leaving.length === prevIds.size) {
      setExitingIds(new Set(leaving))
      setEnteringIds(new Set())
      // displayed intentionally NOT updated here — keeps old items
      // visible so their exit animation plays out fully
      timerRef.current = setTimeout(() => {
        const newIds = new Set(filtered.map((b) => b._id))
        setDisplayed(filtered)
        setExitingIds(new Set())
        setEnteringIds(newIds)
        timerRef.current = setTimeout(
          () => setEnteringIds(new Set()),
          320 + filtered.length * 40 + 100
        )
      }, TRANSITION_MS)
      return
    }

    // ── 3. Partial change — some items leave, some stay, new ones arrive ──
    const exitSet  = new Set(leaving)
    const enterSet = new Set(arriving.map((b) => b._id))
    setExitingIds(exitSet)
    setEnteringIds(enterSet)
    setDisplayed((prev) => {
      const prevIdSet = new Set(prev.map((b) => b._id))
      const newArrivals = filtered.filter((b) => !prevIdSet.has(b._id))
      return [...prev, ...newArrivals]
    })
    timerRef.current = setTimeout(() => {
      setDisplayed(filtered)
      setExitingIds(new Set())
      setEnteringIds(new Set())
    }, TRANSITION_MS)

    return () => clearTimeout(timerRef.current)
  }, [filtered])

  return { displayed, exitingIds, enteringIds }
}
// ─────────────────────────────────────────────────────────────────

const DIAMOND_TEXTURE = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='13' y='13' width='6' height='6' fill='none' stroke='%238B6F47' stroke-width='0.5' stroke-opacity='0.14' transform='rotate(45 16 16)'/%3E%3C/svg%3E")`

export default function CatalogClient({ bags, filterOptions }: CatalogClientProps) {
  const [sidebarOpen, setSidebarOpen]           = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [active, setActive]                     = useState<ActiveFilters>(DEFAULT_FILTERS)
  const [sort, setSort]                         = useState<SortKey>('newest')
  const [page, setPage]                         = useState(1)
  const [loadedCount, setLoadedCount]           = useState(ITEMS_PER_PAGE)
  const isDesktop                               = useIsDesktop()

  // ── Reset pagination whenever filters or sort change ──────────
  function updateActive(next: ActiveFilters) {
    setActive(next)
    setPage(1)
    setLoadedCount(ITEMS_PER_PAGE)
  }
  function updateSort(next: SortKey) {
    setSort(next)
    setPage(1)
    setLoadedCount(ITEMS_PER_PAGE)
  }

  // ── Filtered + sorted master list ────────────────────────────
  const filtered = useMemo(() => {
    let result = [...bags]
    if (active.availability.length)
      result = result.filter((b) => active.availability.includes(b.availability))
    if (active.brands.length)
      result = result.filter((b) => active.brands.includes(b.brand))
    if (active.conditions.length)
      result = result.filter((b) => active.conditions.includes(b.condition))
    if (active.sizes.length)
      result = result.filter((b) => active.sizes.includes(b.size))
    if (active.minPrice)
      result = result.filter((b) => b.price >= Number(active.minPrice))
    if (active.maxPrice)
      result = result.filter((b) => b.price <= Number(active.maxPrice))
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price)
    else result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    return result
  }, [bags, active, sort])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  // ── Paginated slice ───────────────────────────────────────────
  const paginatedItems = useMemo(() => {
    if (isDesktop) {
      return filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    }
    return filtered.slice(0, loadedCount)
  }, [filtered, page, loadedCount, isDesktop])

  const { displayed, exitingIds, enteringIds } = useFilterTransition(paginatedItems)

  const enterIndexMap = useMemo(() => {
    const map = new Map<string, number>()
    displayed
      .filter((b) => enteringIds.has(b._id))
      .forEach((b, i) => map.set(b._id, i))
    return map
  }, [displayed, enteringIds])

  // ── Scroll to catalog top on page change ─────────────────────
  const scrollToCatalog = () => {
    document.getElementById('catalog-toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Active filter tags ────────────────────────────────────────
  const activeTags: { label: string; onRemove: () => void }[] = [
    ...active.availability.map((v) => ({
      label: v.charAt(0).toUpperCase() + v.slice(1),
      onRemove: () => updateActive({ ...active, availability: active.availability.filter((x) => x !== v) }),
    })),
    ...active.brands.map((v) => ({
      label: BRAND_LABELS[v] ?? v,
      onRemove: () => updateActive({ ...active, brands: active.brands.filter((x) => x !== v) }),
    })),
    ...active.conditions.map((v) => ({
      label: v.charAt(0).toUpperCase() + v.slice(1),
      onRemove: () => updateActive({ ...active, conditions: active.conditions.filter((x) => x !== v) }),
    })),
    ...active.sizes.map((v) => ({
      label: v.charAt(0).toUpperCase() + v.slice(1),
      onRemove: () => updateActive({ ...active, sizes: active.sizes.filter((x) => x !== v) }),
    })),
  ]

  const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <line x1="2" y1="4" x2="14" y2="4" />
      <line x1="4" y1="8" x2="12" y2="8" />
      <line x1="6" y1="12" x2="10" y2="12" />
    </svg>
  )

  return (
    <div className="border-t border-bronze/20">

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto h-full w-[85%] max-w-[320px] overflow-y-auto bg-ivory">
            <div className="flex items-center justify-between border-b border-bronze/20 bg-cream-dark px-5 py-4">
              <p className="font-body text-[11px] font-medium uppercase tracking-[0.18em] text-ink">Filters</p>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="text-[18px] text-muted transition-colors duration-400 ease-luxury hover:text-ink"
              >×</button>
            </div>
            <div className="p-4">
              <CatalogFilters
                filters={filterOptions}
                active={active}
                onChange={updateActive}
                onClear={() => { updateActive(DEFAULT_FILTERS); setMobileFiltersOpen(false) }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div id="catalog-toolbar" className="border-b border-bronze/20 px-4 py-3 md:px-[10%]">
        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              aria-label="Open filters"
              className="flex h-9 w-9 items-center justify-center border border-bronze/20 text-ink transition-colors duration-400 ease-luxury hover:border-bronze md:hidden"
            >
              <FilterIcon />
            </button>
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              aria-pressed={sidebarOpen}
              aria-label="Toggle filters"
              className={`hidden h-9 w-9 items-center justify-center border transition-colors duration-400 ease-luxury md:flex ${
                sidebarOpen ? 'border-ink bg-ink text-ivory' : 'border-bronze/20 text-ink hover:border-bronze'
              }`}
            >
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
              <span className="flex h-5 w-5 items-center justify-center bg-ink font-body text-[10px] text-ivory md:hidden">
                {activeTags.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display italic text-[1.3rem] leading-none text-muted">
                {filtered.length}
              </span>
              <span className="font-body text-[9px] uppercase tracking-[0.22em] text-muted/60">
                pieces
              </span>
            </div>
            <div className="h-3.5 w-px bg-bronze/20" />
            <select
              value={sort}
              onChange={(e) => updateSort(e.target.value as SortKey)}
              aria-label="Sort by"
              className="border border-bronze/20 bg-ivory px-2 py-1.5 font-body text-[11px] text-muted outline-none transition-colors duration-400 ease-luxury hover:border-bronze focus:border-bronze"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── Gallery ── */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundImage: DIAMOND_TEXTURE, backgroundSize: '32px 32px' }}
      >

        {/* Decorative background layer */}
        <div className="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden>
          <p
            aria-hidden
            className="absolute left-[8%] top-[8%] hidden whitespace-nowrap font-hero uppercase italic leading-none tracking-[0.22em] text-bronze md:block"
            style={{ fontSize: 'clamp(90px, 14vw, 220px)', opacity: 0.045 }}
          >
            Fad
          </p>
          <p
            aria-hidden
            className="absolute left-[20%] top-[42%] hidden whitespace-nowrap font-hero uppercase italic leading-none tracking-[0.22em] text-bronze md:block"
            style={{ fontSize: 'clamp(90px, 14vw, 220px)', opacity: 0.045 }}
          >
            Élan
          </p>
          <p
            aria-hidden
            className="absolute left-[40%] top-[72%] hidden whitespace-nowrap font-display italic leading-none text-bronze md:block"
            style={{ fontSize: 'clamp(75px, 12vw, 185px)', opacity: 0.045 }}
          >
            Collection
          </p>
          <CornerOrnament position="tl" />
          <CornerOrnament position="tr" />
          <CornerOrnament position="bl" />
          <CornerOrnament position="br" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full px-4 pt-10 pb-16 md:w-[80%] md:px-0 md:pt-14 md:pb-24">

          {/* Editorial section intro */}
          <div className="mb-10 flex items-center gap-4 md:mb-14">
            <div className="h-px flex-1 bg-bronze/20" />
            <div className="flex items-center gap-3">
              <span className="text-[9px] text-bronze/40">◆</span>
              <p className="font-body text-[9px] uppercase tracking-[0.34em] text-muted/70">The Collection</p>
              <span className="text-[9px] text-bronze/40">◆</span>
            </div>
            <div className="h-px flex-1 bg-bronze/20" />
          </div>

          {/* Sidebar + grid */}
          <div className="flex items-start gap-6">
            <aside
              className={`hidden flex-shrink-0 overflow-hidden transition-all duration-400 ease-luxury md:block ${
                sidebarOpen ? 'w-[220px] opacity-100' : 'pointer-events-none w-0 opacity-0'
              }`}
            >
              <CatalogFilters
                filters={filterOptions}
                active={active}
                onChange={updateActive}
                onClear={() => updateActive(DEFAULT_FILTERS)}
              />
            </aside>

            <div className="min-w-0 flex-1">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-display text-2xl font-normal italic text-muted">
                    No pieces match your filters
                  </p>
                  <button
                    onClick={() => updateActive(DEFAULT_FILTERS)}
                    className="mt-4 font-body text-[11px] uppercase tracking-[0.1em] text-bronze transition-colors duration-400 ease-luxury hover:text-bronze-dark hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Grid */}
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-0.5 lg:grid-cols-4">
                      {displayed.map((bag) => {
                        const isExiting  = exitingIds.has(bag._id)
                        const isEntering = enteringIds.has(bag._id)
                        const enterIndex = isEntering ? (enterIndexMap.get(bag._id) ?? 0) : 0

                        return (
                          <div
                            key={bag._id}
                            style={{
                              animationDelay: isExiting
                                ? '0ms'
                                : isEntering
                                  ? `${enterIndex * 40}ms`
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

                  {/* ── Pagination ── */}
                  <div className="mt-12 md:mt-16">

                    {/* Mobile: load more */}
                    <div className="md:hidden">
                      {loadedCount < filtered.length ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex w-full items-center gap-4">
                            <div className="h-px flex-1 bg-bronze/15" />
                            <button
                              onClick={() => setLoadedCount((c) => c + ITEMS_PER_PAGE)}
                              className="font-body text-[11px] uppercase tracking-[0.22em] text-bronze transition-colors duration-400 ease-luxury hover:text-bronze-dark"
                            >
                              View more
                            </button>
                            <div className="h-px flex-1 bg-bronze/15" />
                          </div>
                          <p className="font-body text-[9px] uppercase tracking-[0.2em] text-muted/50">
                            {Math.min(loadedCount, filtered.length)} of {filtered.length}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-bronze/15" />
                          <span className="text-[8px] text-bronze/25">◆</span>
                          <div className="h-px flex-1 bg-bronze/15" />
                        </div>
                      )}
                    </div>

                    {/* Desktop: numbered pages */}
                    <div className="hidden md:block">
                      {totalPages > 1 ? (
                        <>
                          {/* Range label */}
                          <p className="mb-5 text-center font-display italic text-[0.95rem] text-muted">
                            {(page - 1) * ITEMS_PER_PAGE + 1}
                            {' — '}
                            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} pieces
                          </p>

                          {/* Controls */}
                          <div className="flex items-center justify-center gap-0.5">
                            <button
                              onClick={() => { setPage((p) => p - 1); scrollToCatalog() }}
                              disabled={page === 1}
                              aria-label="Previous page"
                              className="flex h-9 w-9 items-center justify-center font-body text-sm text-muted transition-colors duration-400 ease-luxury hover:text-ink disabled:cursor-not-allowed disabled:opacity-25"
                            >
                              ←
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                              <button
                                key={n}
                                onClick={() => { setPage(n); scrollToCatalog() }}
                                aria-label={`Page ${n}`}
                                aria-current={n === page ? 'page' : undefined}
                                className={`flex h-9 w-9 items-center justify-center font-body text-[11px] transition-colors duration-400 ease-luxury ${
                                  n === page
                                    ? 'bg-ink text-ivory'
                                    : 'text-muted hover:text-ink'
                                }`}
                              >
                                {n}
                              </button>
                            ))}

                            <button
                              onClick={() => { setPage((p) => p + 1); scrollToCatalog() }}
                              disabled={page === totalPages}
                              aria-label="Next page"
                              className="flex h-9 w-9 items-center justify-center font-body text-sm text-muted transition-colors duration-400 ease-luxury hover:text-ink disabled:cursor-not-allowed disabled:opacity-25"
                            >
                              →
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-bronze/15" />
                          <span className="text-[8px] text-bronze/25">◆</span>
                          <div className="h-px flex-1 bg-bronze/15" />
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