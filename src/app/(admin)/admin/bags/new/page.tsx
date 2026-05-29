// src/app/admin/bags/new/page.tsx
import BagForm from '@/components/admin/BagForm'

export default function NewBagPage() {
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
          Catalog
        </p>
        <h1 style={{
          fontFamily:  '"Cormorant Garamond", Georgia, serif',
          fontSize:    '2.25rem',
          fontWeight:  300,
          color:       '#1A1A1A',
        }}>
          Add New Bag
        </h1>
      </div>

      <BagForm mode="new" />
    </div>
  )
}