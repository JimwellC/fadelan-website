'use client'

import { useState } from 'react'
import type { FilterOptions } from '@/lib/queries'
import { CONDITION_LABELS, BRAND_LABELS } from '@/lib/sanity'

interface ActiveFilters {
  availability: string[]
  brands: string[]
  conditions: string[]
  sizes: string[]
  minPrice: string
  maxPrice: string
}

interface CatalogFiltersProps {
  filters: FilterOptions
  active: ActiveFilters
  onChange: (next: ActiveFilters) => void
  onClear: () => void
}

function DiamondCheck({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <span
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onChange()
        }
      }}
      className={`flex h-[10px] w-[10px] flex-shrink-0 rotate-45 cursor-pointer border transition-colors duration-400 ease-luxury ${
        checked ? 'border-ink bg-ink' : 'border-bronze/30 hover:border-bronze'
      }`}
    />
  )
}

function FilterSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border-b border-bronze/20 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-[18px] py-3"
      >
        <span className="font-body text-[11px] uppercase tracking-[0.14em] text-muted">
          {label}
        </span>
        <span className={`text-[11px] text-bronze/40 transition-transform duration-400 ease-luxury ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      {open && <div className="px-[18px] pb-3">{children}</div>}
    </div>
  )
}

function CheckOption({
  label,
  count,
  checked,
  onChange,
}: {
  label: string
  count?: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1.5">
      <DiamondCheck checked={checked} onChange={onChange} />
      <span className="font-body text-[11px] text-muted">{label}</span>
      {count !== undefined && (
        <span className="ml-auto font-body text-[10px] text-bronze/40">{count}</span>
      )}
    </label>
  )
}

export default function CatalogFilters({
  filters,
  active,
  onChange,
  onClear,
}: CatalogFiltersProps) {
  function toggle(
    key: keyof Pick<ActiveFilters, 'availability' | 'brands' | 'conditions' | 'sizes'>,
    value: string
  ) {
    const current = active[key]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...active, [key]: next })
  }

  return (
    <div className="border border-bronze/20 bg-ivory">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-bronze/20 bg-cream-dark px-[18px] py-3.5">
        <p className="font-body text-[10px] font-medium uppercase tracking-[0.18em] text-ink">
          Refine
        </p>
        <button
          onClick={onClear}
          className="font-body text-[10px] text-bronze transition-colors duration-400 ease-luxury hover:text-bronze-dark hover:underline"
        >
          Clear
        </button>
      </div>

      <FilterSection label="Availability">
        {(['available', 'reserved', 'on_hold', 'sold'] as const).map((v) => (
          <CheckOption
            key={v}
            label={v === 'on_hold' ? 'On hold' : v.charAt(0).toUpperCase() + v.slice(1)}
            checked={active.availability.includes(v)}
            onChange={() => toggle('availability', v)}
          />
        ))}
      </FilterSection>

      <FilterSection label="Brand">
        {filters.brands.map((brand) => (
          <CheckOption
            key={brand}
            label={BRAND_LABELS[brand] ?? brand}
            checked={active.brands.includes(brand)}
            onChange={() => toggle('brands', brand)}
          />
        ))}
      </FilterSection>

      <FilterSection label="Condition">
        {filters.conditions.map((cond) => (
          <CheckOption
            key={cond}
            label={CONDITION_LABELS[cond] ?? cond}
            checked={active.conditions.includes(cond)}
            onChange={() => toggle('conditions', cond)}
          />
        ))}
      </FilterSection>

      <FilterSection label="Price Range">
        <div className="flex items-center gap-2 py-1">
          <input
            type="number"
            placeholder="Min"
            value={active.minPrice}
            onChange={(e) => onChange({ ...active, minPrice: e.target.value })}
            className="w-[64px] border border-bronze/20 bg-transparent px-2 py-1.5 font-body text-[11px] text-ink outline-none transition-colors duration-400 ease-luxury focus:border-bronze"
          />
          <span className="text-[11px] text-bronze/40">—</span>
          <input
            type="number"
            placeholder="Max"
            value={active.maxPrice}
            onChange={(e) => onChange({ ...active, maxPrice: e.target.value })}
            className="w-[64px] border border-bronze/20 bg-transparent px-2 py-1.5 font-body text-[11px] text-ink outline-none transition-colors duration-400 ease-luxury focus:border-bronze"
          />
        </div>
      </FilterSection>

      <FilterSection label="Size">
        {filters.sizes.map((size) => (
          <CheckOption
            key={size}
            label={size.charAt(0).toUpperCase() + size.slice(1)}
            checked={active.sizes.includes(size)}
            onChange={() => toggle('sizes', size)}
          />
        ))}
      </FilterSection>
    </div>
  )
}