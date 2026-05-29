'use client'

import { useState, useEffect } from 'react'
import { useParams }           from 'next/navigation'
import BagForm                 from '@/components/admin/BagForm'

export default function EditBagPage() {
  const { id }    = useParams<{ id: string }>()
  const [bag,     setBag]     = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch(`/api/admin/bags/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(data => { setBag(data); setLoading(false) })
      .catch(() => { setError('Bag not found'); setLoading(false) })
  }, [id])

  if (loading) return (
    <div style={{ padding: '2rem', fontFamily: 'Inter', color: '#4A4A4A', fontSize: '0.875rem' }}>
      Loading bag...
    </div>
  )

  if (error || !bag) return (
    <div style={{ padding: '2rem', fontFamily: 'Inter', color: '#DC2626', fontSize: '0.875rem' }}>
      {error || 'Bag not found'}
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{
          fontFamily:    'Inter, system-ui, sans-serif',
          fontSize:      '0.65rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color:         '#8B6F47',
          marginBottom:  '0.375rem',
        }}>
          Editing
        </p>
        <h1 style={{
          fontFamily:  '"Cormorant Garamond", Georgia, serif',
          fontSize:    '2.25rem',
          fontWeight:  300,
          color:       '#1A1A1A',
        }}>
          {bag.name}
        </h1>
      </div>

      <BagForm mode="edit" bagId={id} initialData={bag} />
    </div>
  )
}