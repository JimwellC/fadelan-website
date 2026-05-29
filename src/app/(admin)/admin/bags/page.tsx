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
  available: { label: 'Available', color: '#16A34A', bg: 'rgba(22,163,74,0.1)'  },
  reserved:  { label: 'Reserved',  color: '#D97706', bg: 'rgba(217,119,6,0.1)'  },
  sold:      { label: 'Sold',      color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
}

export default function BagsListPage() {
  const [bags,    setBags]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<'all' | 'available' | 'reserved' | 'sold'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/bags')
      .then(r => r.json())
      .then(data => { setBags(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleStatusChange(id: string, availability: string) {
    await fetch(`/api/admin/bags/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ availability }),
    })
    setBags(prev => prev.map(b => b._id === id ? { ...b, availability } : b))
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/bags/${id}`, { method: 'DELETE' })
    setBags(prev => prev.filter(b => b._id !== id))
    setDeleting(null)
  }

  const filtered = filter === 'all' ? bags : bags.filter(b => b.availability === filter)

  return (
    <div>

      {/* Header */}
      <div style={{
        display:        'flex',
        alignItems:     'flex-end',
        justifyContent: 'space-between',
        marginBottom:   '2rem',
        flexWrap:       'wrap',
        gap:            '1rem',
      }}>
        <div>
          <p style={{
            fontFamily:    'Inter, system-ui, sans-serif',
            fontSize:      '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color:         '#8B6F47',
            marginBottom:  '0.375rem',
          }}>
            Catalog
          </p>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize:   '2.25rem',
            fontWeight: 300,
            color:      '#1A1A1A',
          }}>
            All Bags
          </h1>
        </div>
        <Link href="/admin/bags/new" style={{
          display:         'inline-flex',
          alignItems:      'center',
          gap:             '0.5rem',
          padding:         '0.75rem 1.5rem',
          backgroundColor: '#1A1A1A',
          color:           '#F5F1EC',
          fontFamily:      'Inter, system-ui, sans-serif',
          fontSize:        '0.7rem',
          fontWeight:      500,
          letterSpacing:   '0.12em',
          textTransform:   'uppercase',
          textDecoration:  'none',
          transition:      'background-color 200ms ease',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#8B6F47'}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1A1A1A'}
        >
          + Add New Bag
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{
        display:      'flex',
        gap:          '0.5rem',
        marginBottom: '1.5rem',
        flexWrap:     'wrap',
      }}>
        {(['all', 'available', 'reserved', 'sold'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding:         '0.5rem 1rem',
              backgroundColor: filter === f ? '#1A1A1A' : 'transparent',
              color:           filter === f ? '#F5F1EC' : '#4A4A4A',
              border:          '1px solid rgba(26,26,26,0.2)',
              fontFamily:      'Inter, system-ui, sans-serif',
              fontSize:        '0.65rem',
              letterSpacing:   '0.1em',
              textTransform:   'capitalize',
              cursor:          'pointer',
              transition:      'all 150ms ease',
            }}
          >
            {f} {f === 'all' ? `(${bags.length})` : `(${bags.filter(b => b.availability === f).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#4A4A4A' }}>Loading bags...</p>
      ) : filtered.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          border:          '1px solid rgba(139,111,71,0.12)',
          padding:         '4rem',
          textAlign:       'center',
        }}>
          <p style={{
            fontFamily:  '"Cormorant Garamond", Georgia, serif',
            fontSize:    '1.25rem',
            fontWeight:  300,
            color:       '#4A4A4A',
          }}>
            No bags found
          </p>
          <Link href="/admin/bags/new" style={{
            display:        'inline-block',
            marginTop:      '1rem',
            fontFamily:     'Inter, system-ui, sans-serif',
            fontSize:       '0.7rem',
            letterSpacing:  '0.1em',
            textTransform:  'uppercase',
            color:          '#8B6F47',
            textDecoration: 'none',
          }}>
            Add your first bag →
          </Link>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#FFFFFF',
          border:          '1px solid rgba(139,111,71,0.12)',
        }}>
          {filtered.map((bag, i) => {
            const status = STATUS_CONFIG[bag.availability] ?? STATUS_CONFIG.available
            return (
              <div key={bag._id} style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '1rem',
                padding:      '1rem 1.5rem',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(26,26,26,0.05)' : 'none',
              }}>

                {/* Cover */}
                <div style={{
                  width:           '44px',
                  height:          '58px',
                  flexShrink:      0,
                  backgroundColor: '#EDE8E1',
                  overflow:        'hidden',
                }}>
                  {bag.coverPhoto?.asset?.url && (
                    <img
                      src={`${bag.coverPhoto.asset.url}?w=88&h=116&fit=crop&fm=webp`}
                      alt={bag.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily:    'Inter, system-ui, sans-serif',
                    fontSize:      '0.55rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color:         '#8B6F47',
                    marginBottom:  '0.2rem',
                  }}>
                    {BRAND_LABELS[bag.brand] ?? bag.brand}
                  </p>
                  <p style={{
                    fontFamily:   '"Cormorant Garamond", Georgia, serif',
                    fontSize:     '1rem',
                    color:        '#1A1A1A',
                    whiteSpace:   'nowrap',
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {bag.name}
                  </p>
                  <p style={{
                    fontFamily:  'Inter, system-ui, sans-serif',
                    fontSize:    '0.75rem',
                    color:       '#4A4A4A',
                    marginTop:   '0.1rem',
                  }}>
                    ₱{bag.price?.toLocaleString('en-PH')}
                  </p>
                </div>

                {/* Quick status toggle */}
                <select
                  value={bag.availability}
                  onChange={e => handleStatusChange(bag._id, e.target.value)}
                  style={{
                    padding:         '0.375rem 0.625rem',
                    backgroundColor: status.bg,
                    color:           status.color,
                    border:          `1px solid ${status.color}`,
                    fontFamily:      'Inter, system-ui, sans-serif',
                    fontSize:        '0.65rem',
                    fontWeight:      500,
                    letterSpacing:   '0.08em',
                    cursor:          'pointer',
                    flexShrink:      0,
                  }}
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>

                {/* Edit */}
                <Link
                  href={`/admin/bags/${bag._id}`}
                  style={{
                    padding:        '0.375rem 0.75rem',
                    backgroundColor:'transparent',
                    border:         '1px solid rgba(26,26,26,0.2)',
                    color:          '#1A1A1A',
                    fontFamily:     'Inter, system-ui, sans-serif',
                    fontSize:       '0.65rem',
                    letterSpacing:  '0.08em',
                    textDecoration: 'none',
                    flexShrink:     0,
                    transition:     'all 150ms ease',
                  }}
                >
                  Edit
                </Link>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(bag._id, bag.name)}
                  disabled={deleting === bag._id}
                  style={{
                    padding:         '0.375rem 0.75rem',
                    backgroundColor: 'transparent',
                    border:          '1px solid rgba(220,38,38,0.3)',
                    color:           '#DC2626',
                    fontFamily:      'Inter, system-ui, sans-serif',
                    fontSize:        '0.65rem',
                    letterSpacing:   '0.08em',
                    cursor:          'pointer',
                    flexShrink:      0,
                    opacity:         deleting === bag._id ? 0.5 : 1,
                  }}
                >
                  {deleting === bag._id ? '...' : 'Delete'}
                </button>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}