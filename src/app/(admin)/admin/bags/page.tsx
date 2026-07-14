'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const BRAND_LABELS: Record<string, string> = {
  hermes: 'Hermès', chanel: 'Chanel', louis_vuitton: 'Louis Vuitton',
  dior: 'Dior', gucci: 'Gucci', celine: 'Celine', prada: 'Prada',
  ysl: 'YSL', bottega_veneta: 'Bottega Veneta', fendi: 'Fendi',
  goyard: 'Goyard', loewe: 'Loewe', balenciaga: 'Balenciaga',
  burberry: 'Burberry', valentino: 'Valentino', givenchy: 'Givenchy',
  coach: 'Coach', michael_kors: 'Michael Kors', kate_spade: 'Kate Spade',
  other: 'Other',
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: 'Available', color: '#16A34A', bg: 'rgba(22,163,74,0.1)'   },
  reserved:  { label: 'Reserved',  color: '#D97706', bg: 'rgba(217,119,6,0.1)'   },
  sold:      { label: 'Sold',      color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
}

export default function BagsListPage() {
  const [bags,     setBags]     = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState<'all' | 'available' | 'reserved' | 'sold'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    fetch('/api/admin/bags')
      .then(r => r.json())
      .then(data => { setBags(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleStatusChange(id: string, availability: string) {
  try {
    const res = await fetch(`/api/admin/bags/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ availability }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      alert(`Failed to update status: ${err.error ?? 'Unknown error'}`)
      return
    }
    setBags(prev => prev.map(b => b._id === id ? { ...b, availability } : b))
  } catch {
    alert('Network error — please try again.')
  }
}

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/bags/${id}`, { method: 'DELETE' })
    setBags(prev => prev.filter(b => b._id !== id))
    setDeleting(null)
  }

  // Search + status filter compose: "reserved" + "chanel" narrows to reserved
  // Chanels, rather than the two fighting each other.
  //
  // Client-side, like the storefront search — the full list is already in
  // memory from the /api/admin/bags fetch, so there's no endpoint to hit and
  // nothing to rate-limit.
  const q = search.trim().toLowerCase()

  const filtered = bags
    .filter(b => filter === 'all' || b.availability === filter)
    .filter(b => {
      if (!q) return true
      // Every term must match — "chanel black" finds black Chanels, not
      // everything black OR Chanel.
      const hay = [
        b.name,
        b.brand,
        BRAND_LABELS[b.brand] ?? '',
        b.color,
        b.size,
        b.condition,
        b.availability,
        b.slug?.current ?? '',
        String(b.price ?? ''),
      ].join(' ').toLowerCase().replace(/_/g, ' ')

      return q.split(/\s+/).every(term => hay.includes(term))
    })

  return (
    <div>

      {/* Header */}
      <div style={{
        display:        'flex',
        alignItems:     'flex-end',
        justifyContent: 'space-between',
        marginBottom:   '1.5rem',
        flexWrap:       'wrap',
        gap:            '1rem',
      }}>
        <div>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.65rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#8B6F47', marginBottom: '0.375rem',
          }}>
            Catalog
          </p>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', fontWeight: 300, color: '#1A1A1A',
          }}>
            All Bags
          </h1>
        </div>
        <Link href="/admin/bags/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1.25rem',
          backgroundColor: '#1A1A1A', color: '#F5F1EC',
          fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.7rem',
          fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
          textDecoration: 'none', whiteSpace: 'nowrap',
        }}>
          + Add New
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(['all', 'available', 'reserved', 'sold'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:         '0.4rem 0.875rem',
            backgroundColor: filter === f ? '#1A1A1A' : 'transparent',
            color:           filter === f ? '#F5F1EC' : '#4A4A4A',
            border:          '1px solid rgba(26,26,26,0.2)',
            fontFamily:      'Inter, system-ui, sans-serif',
            fontSize:        '0.65rem', letterSpacing: '0.1em',
            textTransform:   'capitalize', cursor: 'pointer',
          }}>
            {f} ({f === 'all' ? bags.length : bags.filter(b => b.availability === f).length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, brand, colour, size, slug…"
          style={{
            width:           '100%',
            padding:         '0.65rem 2.25rem 0.65rem 0.875rem',
            backgroundColor: '#FFFFFF',
            border:          '1px solid rgba(139,111,71,0.25)',
            fontFamily:      'Inter, system-ui, sans-serif',
            fontSize:        '0.8rem',
            color:           '#1A1A1A',
            outline:         'none',
          }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            aria-label="Clear search"
            style={{
              position:   'absolute',
              right:      '0.75rem',
              top:        '50%',
              transform:  'translateY(-50%)',
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              fontSize:   '0.9rem',
              color:      '#8C8275',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {!loading && (search || filter !== 'all') && (
        <p style={{
          fontFamily:   'Inter, system-ui, sans-serif',
          fontSize:     '0.7rem',
          color:        '#8C8275',
          marginBottom: '1rem',
        }}>
          Showing {filtered.length} of {bags.length}
          {search && <> for “{search}”</>}
        </p>
      )}

      {/* List */}
      {loading ? (
        <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#4A4A4A', padding: '2rem 0' }}>
          Loading bags...
        </p>
      ) : filtered.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF', border: '1px solid rgba(139,111,71,0.12)',
          padding: '4rem', textAlign: 'center',
        }}>
          <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.25rem', fontWeight: 300, color: '#4A4A4A' }}>
            No bags found
          </p>
          <Link href="/admin/bags/new" style={{
            display: 'inline-block', marginTop: '1rem',
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.7rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#8B6F47', textDecoration: 'none',
          }}>
            Add your first bag →
          </Link>
        </div>
      ) : (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(139,111,71,0.12)' }}>
          {filtered.map((bag, i) => {
            const status = STATUS_CONFIG[bag.availability] ?? STATUS_CONFIG.available
            return (
              <div key={bag._id} style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '0.75rem',
                padding:      '0.875rem 1rem',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(26,26,26,0.05)' : 'none',
                flexWrap:     'wrap',
              }}>

                {/* Cover */}
                <div style={{
                  width: '40px', height: '53px', flexShrink: 0,
                  backgroundColor: '#EDE8E1', overflow: 'hidden',
                }}>
                  {bag.coverPhoto?.asset?.url && (
                    <img
                      src={`${bag.coverPhoto.asset.url}?w=80&h=106&fit=crop&fm=webp`}
                      alt={bag.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <p style={{
                    fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.5rem',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#8B6F47', marginBottom: '0.15rem',
                  }}>
                    {BRAND_LABELS[bag.brand] ?? bag.brand}
                  </p>
                  <p style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '0.95rem', color: '#1A1A1A',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    maxWidth: '180px',
                  }}>
                    {bag.name}
                  </p>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#4A4A4A', marginTop: '0.1rem' }}>
                    ₱{bag.price?.toLocaleString('en-PH')}
                  </p>
                </div>

                {/* Status select */}
                <select
                  value={bag.availability}
                  onChange={e => handleStatusChange(bag._id, e.target.value)}
                  style={{
                    padding: '0.35rem 0.5rem',
                    backgroundColor: status.bg, color: status.color,
                    border: `1px solid ${status.color}`,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '0.6rem', fontWeight: 500,
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {bag.slug?.current && (
                    <a
                      href={`/catalog/${bag.slug.current}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding:        '0.35rem 0.625rem',
                        border:         '1px solid rgba(139,111,71,0.3)',
                        color:          '#8B6F47',
                        fontFamily:     'Inter, system-ui, sans-serif',
                        fontSize:       '0.6rem',
                        textDecoration: 'none',
                        whiteSpace:     'nowrap',
                      }}
                    >
                      View
                    </a>
                  )}
                  <Link href={`/admin/bags/${bag._id}`} style={{
                    padding: '0.35rem 0.625rem',
                    border: '1px solid rgba(26,26,26,0.2)', color: '#1A1A1A',
                    fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.6rem',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                  }}>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(bag._id, bag.name)}
                    disabled={deleting === bag._id}
                    style={{
                      padding: '0.35rem 0.625rem',
                      border: '1px solid rgba(220,38,38,0.3)', color: '#DC2626',
                      backgroundColor: 'transparent',
                      fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.6rem',
                      cursor: 'pointer', opacity: deleting === bag._id ? 0.5 : 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {deleting === bag._id ? '...' : 'Del'}
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}