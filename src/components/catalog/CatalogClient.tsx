'use client'

import { useState, useMemo } from 'react'
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

interface CatalogClientProps {
  bags: BagListItem[]
  filterOptions: FilterOptions
}

export default function CatalogClient({ bags, filterOptions }: CatalogClientProps) {
  // On mobile sidebar starts closed, on desktop open
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [active, setActive] = useState<ActiveFilters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortKey>('newest')

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

  const activeTags: { label: string; onRemove: () => void }[] = [
    ...active.availability.map((v) => ({
      label: v.charAt(0).toUpperCase() + v.slice(1),
      onRemove: () => setActive((p) => ({ ...p, availability: p.availability.filter((x) => x !== v) })),
    })),
    ...active.brands.map((v) => ({
      label: BRAND_LABELS[v] ?? v,
      onRemove: () => setActive((p) => ({ ...p, brands: p.brands.filter((x) => x !== v) })),
    })),
    ...active.conditions.map((v) => ({
      label: v.charAt(0).toUpperCase() + v.slice(1),
      onRemove: () => setActive((p) => ({ ...p, conditions: p.conditions.filter((x) => x !== v) })),
    })),
    ...active.sizes.map((v) => ({
      label: v.charAt(0).toUpperCase() + v.slice(1),
      onRemove: () => setActive((p) => ({ ...p, sizes: p.sizes.filter((x) => x !== v) })),
    })),
  ]

  const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke={sidebarOpen ? '#F5F1EC' : '#1A1A1A'} strokeWidth="1.2">
      <line x1="2" y1="4" x2="14" y2="4" />
      <line x1="4" y1="8" x2="12" y2="8" />
      <line x1="6" y1="12" x2="10" y2="12" />
    </svg>
  )

  return (
    <div className="border-t border-[#D6CEBE]">

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A1A1A] opacity-40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Drawer */}
          <div className="relative ml-auto h-full w-[85%] max-w-[320px] overflow-y-auto bg-[#F5F1EC]">
            <div className="flex items-center justify-between border-b border-[#D6CEBE] bg-[#EDE6DC] px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#1A1A1A]">Filters</p>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-[18px] text-[#8C8275]"
              >×</button>
            </div>
            <div className="p-4">
              <CatalogFilters
                filters={filterOptions}
                active={active}
                onChange={setActive}
                onClear={() => { setActive(DEFAULT_FILTERS); setMobileFiltersOpen(false) }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="border-b border-[#D6CEBE] px-4 py-3 md:px-[10%]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Mobile: opens drawer */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex h-9 w-9 items-center justify-center border border-[#D6CEBE] hover:border-[#8B6F47] md:hidden"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                stroke="#1A1A1A" strokeWidth="1.2">
                <line x1="2" y1="4" x2="14" y2="4" />
                <line x1="4" y1="8" x2="12" y2="8" />
                <line x1="6" y1="12" x2="10" y2="12" />
              </svg>
            </button>

            {/* Desktop: toggles sidebar */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              title="Toggle filters"
              className={`hidden h-9 w-9 items-center justify-center border transition-colors md:flex ${
                sidebarOpen
                  ? 'border-[#1A1A1A] bg-[#1A1A1A]'
                  : 'border-[#D6CEBE] hover:border-[#8B6F47]'
              }`}
            >
              <FilterIcon />
            </button>

            {/* Active tags — hidden on mobile to save space */}
            {activeTags.length > 0 && (
              <div className="hidden flex-wrap gap-1.5 md:flex">
                {activeTags.map((tag) => (
                  <span
                    key={tag.label}
                    className="flex items-center gap-1.5 bg-[#1A1A1A] px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-[#F5F1EC]"
                  >
                    {tag.label}
                    <button onClick={tag.onRemove} className="opacity-60 hover:opacity-100">×</button>
                  </span>
                ))}
              </div>
            )}

            {/* Mobile: active filter count badge */}
            {activeTags.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center bg-[#1A1A1A] text-[10px] text-[#F5F1EC] md:hidden">
                {activeTags.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#8C8275]">{filtered.length} pieces</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-[#D6CEBE] bg-[#F5F1EC] px-2 py-1.5 text-[11px] text-[#8C8275] outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full px-4 pt-8 pb-24 md:w-[80%] md:px-0 md:pt-16 md:pb-32">
        <div className="flex items-start gap-6">

          {/* Desktop sidebar */}
          <aside
            className={`hidden flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out md:block ${
              sidebarOpen ? 'w-[220px] opacity-100' : 'w-0 opacity-0 pointer-events-none'
            }`}
          >
            <CatalogFilters
              filters={filterOptions}
              active={active}
              onChange={setActive}
              onClear={() => setActive(DEFAULT_FILTERS)}
            />
          </aside>

          {/* Bag grid */}
          <div className="min-w-0 flex-1">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-['Cormorant_Garamond'] text-2xl font-normal text-[#8C8275]">
                  No pieces match your filters
                </p>
                <button
                  onClick={() => setActive(DEFAULT_FILTERS)}
                  className="mt-4 text-[11px] uppercase tracking-[0.1em] text-[#8B6F47] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-3 md:gap-0.5 ${
                  sidebarOpen
                    ? 'grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {filtered.map((bag) => (
                  <BagCard key={bag._id} bag={bag} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}