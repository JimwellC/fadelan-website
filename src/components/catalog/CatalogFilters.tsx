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
      className={`flex h-[10px] w-[10px] flex-shrink-0 rotate-45 cursor-pointer border transition-colors ${
        checked ? 'border-[#1A1A1A] bg-[#1A1A1A]' : 'border-[#D6CEBE]'
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
    <div className="border-b border-[#D6CEBE] last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-[18px] py-3"
      >
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#8C8275]">{label}</span>
        <span className={`text-[11px] text-[#C8BFB2] transition-transform ${open ? 'rotate-180' : ''}`}>
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
      <span className="text-[11px] text-[#8C8275]">{label}</span>
      {count !== undefined && (
        <span className="ml-auto text-[10px] text-[#C8BFB2]">{count}</span>
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
    <div className="border border-[#D6CEBE] bg-[#F5F1EC]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6CEBE] bg-[#EDE6DC] px-[18px] py-3.5">
        <p className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#1A1A1A]">Refine</p>
        <button onClick={onClear} className="text-[10px] text-[#8B6F47] hover:underline">
          Clear
        </button>
      </div>

      <FilterSection label="Availability">
        {(['available', 'reserved', 'sold'] as const).map((v) => (
          <CheckOption
            key={v}
            label={v.charAt(0).toUpperCase() + v.slice(1)}
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
            className="w-[64px] border border-[#D6CEBE] bg-transparent px-2 py-1.5 text-[11px] text-[#1A1A1A] outline-none focus:border-[#8B6F47]"
          />
          <span className="text-[11px] text-[#C8BFB2]">—</span>
          <input
            type="number"
            placeholder="Max"
            value={active.maxPrice}
            onChange={(e) => onChange({ ...active, maxPrice: e.target.value })}
            className="w-[64px] border border-[#D6CEBE] bg-transparent px-2 py-1.5 text-[11px] text-[#1A1A1A] outline-none focus:border-[#8B6F47]"
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