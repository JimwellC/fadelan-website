'use client'

import './admin.css'
import { useState }    from 'react'
import Link            from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter }   from 'next/navigation'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard',    icon: '◈' },
  { href: '/admin/bags',      label: 'Bags',         icon: '◻' },
  { href: '/admin/bags/new',  label: 'Add New Bag',  icon: '+' },
  { href: '/admin/settings',  label: 'Site Settings', icon: '⚙' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname()
  const router     = useRouter()
  const [open,       setOpen]       = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  if (pathname === '/admin/login') return <>{children}</>

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="admin-shell">

      {/* Overlay */}
      <div
        className={`admin-overlay${open ? ' is-open' : ''}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar${open ? ' is-open' : ''}`}>

        <div style={{
          padding:        '2rem 1.5rem 1.5rem',
          borderBottom:   '1px solid rgba(245,241,236,0.08)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <p style={{
              fontFamily:    '"Cormorant Garamond", Georgia, serif',
              fontSize:      '1.375rem',
              fontWeight:    300,
              letterSpacing: '0.12em',
              color:         '#F5F1EC',
              marginBottom:  '0.25rem',
            }}>
              Fad Élan
            </p>
            <p style={{
              fontFamily:    'Inter, system-ui, sans-serif',
              fontSize:      '0.55rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         '#8B6F47',
            }}>
              Content Manager
            </p>
          </div>
          <button
            className="admin-close-btn"
            onClick={() => setOpen(false)}
            style={{
              background: 'none', border: 'none',
              color: 'rgba(245,241,236,0.5)',
              fontSize: '1.25rem', cursor: 'pointer', padding: '0.25rem', lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 0' }}>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/admin/bags' &&
                pathname.startsWith('/admin/bags') &&
                pathname !== '/admin/bags/new')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  gap:             '0.75rem',
                  padding:         '0.75rem 1.5rem',
                  fontFamily:      'Inter, system-ui, sans-serif',
                  fontSize:        '0.75rem',
                  fontWeight:      isActive ? 500 : 400,
                  letterSpacing:   '0.06em',
                  color:           isActive ? '#F5F1EC' : 'rgba(245,241,236,0.5)',
                  textDecoration:  'none',
                  backgroundColor: isActive ? 'rgba(139,111,71,0.15)' : 'transparent',
                  borderLeft:      isActive ? '2px solid #8B6F47' : '2px solid transparent',
                  transition:      'all 200ms ease',
                }}
              >
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(245,241,236,0.08)' }}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              width: '100%', padding: '0.625rem',
              backgroundColor: 'transparent',
              border: '1px solid rgba(245,241,236,0.15)',
              color: 'rgba(245,241,236,0.5)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.65rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'all 200ms ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#8B6F47'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#8B6F47'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,241,236,0.15)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,241,236,0.5)'
            }}
          >
            {loggingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </aside>

      {/* Main wrapper */}
      <div className="admin-main-wrapper">

        {/* Mobile top bar */}
        <header className="admin-topbar">
          <button
            onClick={() => setOpen(true)}
            style={{
              background: 'none', border: 'none',
              color: '#F5F1EC', fontSize: '1.25rem',
              cursor: 'pointer', padding: '0.25rem', lineHeight: 1,
            }}
          >
            ☰
          </button>
          <p style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '1.1rem', fontWeight: 300,
            letterSpacing: '0.12em', color: '#F5F1EC',
          }}>
            Fad Élan
          </p>
          <Link href="/admin/bags/new" style={{
            color: '#8B6F47', textDecoration: 'none',
            fontSize: '1.25rem', lineHeight: 1,
          }}>
            +
          </Link>
        </header>

        {/* Page content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}