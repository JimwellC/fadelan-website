import { getIronSession } from 'iron-session'
import { cookies }        from 'next/headers'
import { client }         from '@/lib/sanity'
import { sessionOptions, SessionData } from '@/lib/session'

async function getStats() {
  const [total, available, reserved, sold] = await Promise.all([
    client.fetch(`count(*[_type == "bag"])`),
    client.fetch(`count(*[_type == "bag" && availability == "available"])`),
    client.fetch(`count(*[_type == "bag" && availability == "reserved"])`),
    client.fetch(`count(*[_type == "bag" && availability == "sold"])`),
  ])
  return { total, available, reserved, sold }
}

async function getRecentBags() {
  return client.fetch(`
    *[_type == "bag"] | order(dateAdded desc)[0...5] {
      _id, name, brand, price, availability,
      "coverPhoto": photos[0] { asset-> { url } }
    }
  `)
}

const BRAND_LABELS: Record<string, string> = {
  hermes: 'Hermès', chanel: 'Chanel', louis_vuitton: 'Louis Vuitton',
  dior: 'Dior', gucci: 'Gucci', celine: 'Celine', prada: 'Prada',
  ysl: 'YSL', bottega_veneta: 'Bottega Veneta', fendi: 'Fendi',
  goyard: 'Goyard', loewe: 'Loewe', balenciaga: 'Balenciaga',
  burberry: 'Burberry', valentino: 'Valentino', givenchy: 'Givenchy',
  coach: 'Coach', michael_kors: 'Michael Kors', kate_spade: 'Kate Spade',
  other: 'Other',
}

const STATUS_COLOR: Record<string, string> = {
  available: '#16A34A',
  reserved:  '#D97706',
  sold:      '#6B7280',
}

export default async function DashboardPage() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  const [stats, recentBags] = await Promise.all([getStats(), getRecentBags()])

  const statCards = [
    { label: 'Total Bags', value: stats.total,    color: '#1A1A1A' },
    { label: 'Available',  value: stats.available, color: '#16A34A' },
    { label: 'Reserved',   value: stats.reserved,  color: '#D97706' },
    { label: 'Sold',       value: stats.sold,      color: '#6B7280' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{
          fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.65rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#8B6F47', marginBottom: '0.375rem',
        }}>
          Welcome back
        </p>
        <h1 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '2.25rem', fontWeight: 300, color: '#1A1A1A', lineHeight: 1.2,
        }}>
          Dashboard
        </h1>
      </div>

      <div className="admin-stat-grid">
        {statCards.map((stat) => (
          <div key={stat.label} style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(139,111,71,0.12)', padding: '1.5rem',
          }}>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.6rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#4A4A4A', marginBottom: '0.75rem',
            }}>
              {stat.label}
            </p>
            <p style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '2.5rem', fontWeight: 300, color: stat.color, lineHeight: 1,
            }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(139,111,71,0.12)' }}>
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,26,26,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '1.125rem', fontWeight: 400, color: '#1A1A1A',
          }}>
            Recently Added
          </h2>
          <a href="/admin/bags" style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.65rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#8B6F47', textDecoration: 'none',
          }}>
            View all →
          </a>
        </div>

        {recentBags.map((bag: any, i: number) => (
          <a
            key={bag._id}
            href={`/admin/bags/${bag._id}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.5rem',
              borderBottom: i < recentBags.length - 1 ? '1px solid rgba(26,26,26,0.05)' : 'none',
              textDecoration: 'none',
            }}
          >
            <div style={{
              width: '40px', height: '53px', flexShrink: 0,
              backgroundColor: '#EDE8E1', overflow: 'hidden',
            }}>
              {bag.coverPhoto?.asset?.url && (
                <img
                  src={`${bag.coverPhoto.asset.url}?w=80&h=107&fit=crop&fm=webp`}
                  alt={bag.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.55rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#8B6F47', marginBottom: '0.2rem',
              }}>
                {BRAND_LABELS[bag.brand] ?? bag.brand}
              </p>
              <p style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '1rem', fontWeight: 400, color: '#1A1A1A',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {bag.name}
              </p>
            </div>
            <p style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '1rem', fontWeight: 500, color: '#1A1A1A',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              ₱{bag.price?.toLocaleString('en-PH')}
            </p>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: STATUS_COLOR[bag.availability] ?? '#6B7280', flexShrink: 0,
            }} />
          </a>
        ))}
      </div>
    </div>
  )
}
