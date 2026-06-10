'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
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
  const [sort,              setSort]              = useState<SortKey>('newest')
  const [page,              setPage]              = useState(1)
  const [loadedCount,       setLoadedCount]       = useState(ITEMS_PER_PAGE)
  const isDesktop = useIsDesktop()
  const { items: savedSlugs, mounted: wishlistMounted } = useWishlist()

  function updateActive(next: ActiveFilters) {
    setActive(next); setPage(1); setLoadedCount(ITEMS_PER_PAGE)
  }
  function updateSort(next: SortKey) {
    setSort(next); setPage(1); setLoadedCount(ITEMS_PER_PAGE)
  }

  const filtered = useMemo(() => {
    let result = [...bags]
    if (active.savedOnly && wishlistMounted)
      result = result.filter((b) => savedSlugs.includes(b.slug.current))
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
    if (sort === 'price_asc')       result.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price)
    else result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    return result
  }, [bags, active, sort, savedSlugs, wishlistMounted])

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
      <line x1="2" y1="4" x2="14" y2="4" /><line x1="4" y1="8" x2="12" y2="8" /><line x1="6" y1="12" x2="10" y2="12" />
    </svg>
  )

  return (
    <div className="border-t border-bronze/20">

      {/* ── Mobile bottom sheet filter ── */}
      <div className="md:hidden">
        <div className={`fixed inset-0 z-40 bg-ink/50 transition-opacity duration-400 ease-luxury ${mobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMobileFiltersOpen(false)} aria-hidden />
        <div className={`fixed bottom-0 left-0 right-0 z-50 flex max-h-[88vh] flex-col bg-ivory transition-transform duration-400 ease-luxury ${mobileFiltersOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex flex-shrink-0 justify-center pb-2 pt-3">
            <div className="h-1 w-10 rounded-full bg-bronze/30" />
          </div>
          <div className="flex flex-shrink-0 items-center justify-between border-b border-bronze/20 px-5 py-3.5">
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.18em] text-ink">Refine</p>
            <button onClick={() => updateActive(DEFAULT_FILTERS)} className="font-body text-[10px] text-bronze transition-colors duration-400 ease-luxury hover:text-bronze-dark">Clear all</button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">

            {/* Mobile saved toggle */}
            {wishlistMounted && savedSlugs.length > 0 && (
              <div className="border-b border-bronze/20 px-5 py-4">
                <button
                  onClick={() => updateActive({ ...active, savedOnly: !active.savedOnly })}
                  className={`flex w-full items-center gap-2.5 py-1 transition-colors duration-200 ${active.savedOnly ? 'text-[#8B6F47]' : 'text-muted'}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={active.savedOnly ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  <span className="font-body text-[11px] uppercase tracking-[0.14em]">Show saved only</span>
                  <span className={`ml-auto flex h-5 w-5 items-center justify-center font-body text-[10px] ${active.savedOnly ? 'bg-[#8B6F47] text-[#F5F1EC]' : 'bg-bronze/10 text-bronze'}`}>
                    {savedSlugs.length}
                  </span>
                </button>
              </div>
            )}

            <div className="border-b border-bronze/20 px-5 py-4">
              <p className="mb-3 font-body text-[10px] uppercase tracking-[0.18em] text-muted">Availability</p>
              <div className="flex flex-wrap gap-2">
                {(['available', 'reserved', 'on_hold', 'sold'] as const).map((v) => {
                  const label = v === 'on_hold' ? 'On hold' : v.charAt(0).toUpperCase() + v.slice(1)
                  const checked = active.availability.includes(v)
                  return (
                    <button key={v} onClick={() => { const next = checked ? active.availability.filter((x) => x !== v) : [...active.availability, v]; updateActive({ ...active, availability: next }) }}
                      className={`px-3.5 py-2 font-body text-[11px] tracking-[0.1em] border transition-colors duration-400 ease-luxury ${checked ? 'border-ink bg-ink text-ivory' : 'border-bronze/30 text-muted'}`}>
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
            {filterOptions.brands.length > 0 && (
              <div className="border-b border-bronze/20 px-5 py-4">
                <p className="mb-3 font-body text-[10px] uppercase tracking-[0.18em] text-muted">Brand</p>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.brands.map((brand) => {
                    const checked = active.brands.includes(brand)
                    return (
                      <button key={brand} onClick={() => { const next = checked ? active.brands.filter((x) => x !== brand) : [...active.brands, brand]; updateActive({ ...active, brands: next }) }}
                        className={`px-3.5 py-2 font-body text-[11px] tracking-[0.1em] border transition-colors duration-400 ease-luxury ${checked ? 'border-ink bg-ink text-ivory' : 'border-bronze/30 text-muted'}`}>
                        {BRAND_LABELS[brand] ?? brand}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            {filterOptions.conditions.length > 0 && (
              <div className="border-b border-bronze/20 px-5 py-4">
                <p className="mb-3 font-body text-[10px] uppercase tracking-[0.18em] text-muted">Condition</p>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.conditions.map((cond) => {
                    const checked = active.conditions.includes(cond)
                    return (
                      <button key={cond} onClick={() => { const next = checked ? active.conditions.filter((x) => x !== cond) : [...active.conditions, cond]; updateActive({ ...active, conditions: next }) }}
                        className={`px-3.5 py-2 font-body text-[11px] tracking-[0.1em] border transition-colors duration-400 ease-luxury ${checked ? 'border-ink bg-ink text-ivory' : 'border-bronze/30 text-muted'}`}>
                        {CONDITION_LABELS[cond] ?? cond}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="border-b border-bronze/20 px-5 py-4">
              <p className="mb-3 font-body text-[10px] uppercase tracking-[0.18em] text-muted">Price range</p>
              <div className="flex items-center gap-3">
                <input type="number" placeholder="Min" value={active.minPrice} onChange={(e) => updateActive({ ...active, minPrice: e.target.value })}
                  className="w-full border border-bronze/20 bg-transparent px-3 py-2.5 font-body text-[13px] text-ink outline-none focus:border-bronze" />
                <span className="flex-shrink-0 font-body text-[12px] text-bronze/40">—</span>
                <input type="number" placeholder="Max" value={active.maxPrice} onChange={(e) => updateActive({ ...active, maxPrice: e.target.value })}
                  className="w-full border border-bronze/20 bg-transparent px-3 py-2.5 font-body text-[13px] text-ink outline-none focus:border-bronze" />
              </div>
            </div>
            {filterOptions.sizes.length > 0 && (
              <div className="px-5 py-4">
                <p className="mb-3 font-body text-[10px] uppercase tracking-[0.18em] text-muted">Size</p>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.sizes.map((size) => {
                    const checked = active.sizes.includes(size)
                    return (
                      <button key={size} onClick={() => { const next = checked ? active.sizes.filter((x) => x !== size) : [...active.sizes, size]; updateActive({ ...active, sizes: next }) }}
                        className={`px-3.5 py-2 font-body text-[11px] tracking-[0.1em] border transition-colors duration-400 ease-luxury ${checked ? 'border-ink bg-ink text-ivory' : 'border-bronze/30 text-muted'}`}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 border-t border-bronze/20 bg-ivory p-4">
            <button onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-ink py-3.5 font-body text-[11px] font-medium uppercase tracking-[0.22em] text-ivory transition-colors duration-400 ease-luxury active:bg-bronze">
              View {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div id="catalog-toolbar" className="border-b border-bronze/20 px-4 py-3 md:px-[10%]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileFiltersOpen(true)} aria-label="Open filters"
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
            <aside className={`hidden flex-shrink-0 overflow-hidden transition-all duration-400 ease-luxury md:block ${sidebarOpen ? 'w-[220px] opacity-100' : 'pointer-events-none w-0 opacity-0'}`}>
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
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-0.5 lg:grid-cols-4">
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