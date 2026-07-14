'use client'

import { useState } from 'react'
import type { FilterOptions, ActiveFilters } from '@/lib/queries'
import { CONDITION_LABELS, BRAND_LABELS } from '@/lib/sanity'
import { useWishlist } from '@/hooks/useWishlist'
import ScrollReveal from '../ui/ScrollReveal'


interface CatalogFiltersProps {
  filters: FilterOptions
  active: ActiveFilters
  onChange: (next: ActiveFilters) => void
  onClear: () => void
}

function DiamondCheck({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
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
        <span className="ml-auto font-body text-[10px] text-bronze/40">
          {count}
        </span>
      )}
    </label>
  )
}

function FilterSection({
  label,
  delay,
  children,
}: {
  label: string
  delay: number
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)

  return (
    <ScrollReveal delay={delay}>
      <div className="border-b border-bronze/20 last:border-b-0">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-[18px] py-3"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.14em] text-muted">
            {label}
          </span>

          <span
            className={`text-[11px] text-bronze/40 transition-transform duration-400 ease-luxury ${
              open ? 'rotate-180' : ''
            }`}
          >
            ▾
          </span>
        </button>

        {open && <div className="px-[18px] pb-3">{children}</div>}
      </div>
    </ScrollReveal>
  )
}

export default function CatalogFilters({
  filters,
  active,
  onChange,
  onClear,
}: CatalogFiltersProps) {
  const { items: savedSlugs, mounted } = useWishlist()

  function toggle(
    key: keyof Pick<
      ActiveFilters,
      'availability' | 'brands' | 'conditions' | 'sizes'
    >,
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
      <ScrollReveal delay={0}>
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
      </ScrollReveal>

      {/* Saved */}
      {mounted && (
        <ScrollReveal delay={80}>
          <div className="border-b border-bronze/20 px-[18px] py-3">
            <button
              onClick={() =>
                onChange({ ...active, savedOnly: !active.savedOnly })
              }
              className={`flex w-full items-center gap-2.5 py-1.5 transition-colors duration-200 ${
                active.savedOnly
                  ? 'text-[#8B6F47]'
                  : 'text-muted hover:text-[#8B6F47]'
              }`}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill={active.savedOnly ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                className="flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>

              <span className="font-body text-[11px] uppercase tracking-[0.14em]">
                Saved
              </span>

              <span
                className={`ml-auto flex h-4 w-4 items-center justify-center font-body text-[9px] ${
                  active.savedOnly
                    ? 'bg-[#8B6F47] text-[#F5F1EC]'
                    : 'bg-bronze/10 text-bronze'
                }`}
              >
                {savedSlugs.length}
              </span>
            </button>
          </div>
        </ScrollReveal>
      )}

      {/* Availability */}
      <FilterSection label="Availability" delay={160}>
        {(['available', 'reserved', 'on_hold', 'sold'] as const).map(
          (v, i) => (
            <ScrollReveal key={v} delay={i * 50}>
              <CheckOption
                label={
                  v === 'on_hold'
                    ? 'On hold'
                    : v.charAt(0).toUpperCase() + v.slice(1)
                }
                checked={active.availability.includes(v)}
                onChange={() => toggle('availability', v)}
              />
            </ScrollReveal>
          )
        )}
      </FilterSection>

      {/* Brand */}
      <FilterSection label="Brand" delay={240}>
        {filters.brands.map((brand, i) => (
          <ScrollReveal key={brand} delay={i * 50}>
            <CheckOption
              label={BRAND_LABELS[brand] ?? brand}
              checked={active.brands.includes(brand)}
              onChange={() => toggle('brands', brand)}
            />
          </ScrollReveal>
        ))}
      </FilterSection>

      {/* Condition */}
      <FilterSection label="Condition" delay={320}>
        {filters.conditions.map((cond, i) => (
          <ScrollReveal key={cond} delay={i * 50}>
            <CheckOption
              label={CONDITION_LABELS[cond] ?? cond}
              checked={active.conditions.includes(cond)}
              onChange={() => toggle('conditions', cond)}
            />
          </ScrollReveal>
        ))}
      </FilterSection>

      {/* Price */}
      <FilterSection label="Price Range" delay={400}>
        <div className="flex items-center gap-2 py-1">
          <input
            type="number"
            placeholder="Min"
            value={active.minPrice}
            onChange={(e) =>
              onChange({ ...active, minPrice: e.target.value })
            }
            className="w-[64px] border border-bronze/20 bg-transparent px-2 py-1.5 font-body text-[11px] text-ink outline-none transition-colors duration-400 ease-luxury focus:border-bronze"
          />

          <span className="text-[11px] text-bronze/40">—</span>

          <input
            type="number"
            placeholder="Max"
            value={active.maxPrice}
            onChange={(e) =>
              onChange({ ...active, maxPrice: e.target.value })
            }
            className="w-[64px] border border-bronze/20 bg-transparent px-2 py-1.5 font-body text-[11px] text-ink outline-none transition-colors duration-400 ease-luxury focus:border-bronze"
          />
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection label="Size" delay={480}>
        {filters.sizes.map((size, i) => (
          <ScrollReveal key={size} delay={i * 50}>
            <CheckOption
              label={size.charAt(0).toUpperCase() + size.slice(1)}
              checked={active.sizes.includes(size)}
              onChange={() => toggle('sizes', size)}
            />
          </ScrollReveal>
        ))}
      </FilterSection>

    </div>
  )
}