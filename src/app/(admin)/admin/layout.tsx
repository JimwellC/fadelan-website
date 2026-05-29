'use client'

import { useState }      from 'react'
import Link              from 'next/link'
import { usePathname }   from 'next/navigation'
import { useRouter }     from 'next/navigation'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard',    icon: '◈' },
  { href: '/admin/bags',      label: 'Bags',         icon: '◻' },
  { href: '/admin/bags/new',  label: 'Add New Bag',  icon: '+' },
  { href: '/admin/settings',  label: 'Site Settings', icon: '⚙' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  // Don't render shell on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div style={{
      minHeight:       '100svh',
      backgroundColor: '#F5F1EC',
      display:         'flex',
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width:           '240px',
        flexShrink:      0,
        backgroundColor: '#1A1A1A',
        display:         'flex',
        flexDirection:   'column',
        position:        'fixed',
        top:             0,
        left:            0,
        bottom:          0,
        zIndex:          10,
      }}>

        {/* Wordmark */}
        <div style={{
          padding:      '2rem 1.5rem 1.5rem',
          borderBottom: '1px solid rgba(245,241,236,0.08)',
        }}>
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

        {/* Nav */}
        <nav style={{
          flex:    1,
          padding: '1.5rem 0',
        }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href === '/admin/bags' && pathname.startsWith('/admin/bags') && pathname !== '/admin/bags/new')
            return (
              <Link
                key={item.href}
                href={item.href}
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

        {/* Logout */}
        <div style={{
          padding:   '1.5rem',
          borderTop: '1px solid rgba(245,241,236,0.08)',
        }}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              width:         '100%',
              padding:       '0.625rem',
              backgroundColor: 'transparent',
              border:        '1px solid rgba(245,241,236,0.15)',
              color:         'rgba(245,241,236,0.5)',
              fontFamily:    'Inter, system-ui, sans-serif',
              fontSize:      '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor:        'pointer',
              transition:    'all 200ms ease',
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

      {/* ── Main content ── */}
      <main style={{
        flex:       1,
        marginLeft: '240px',
        padding:    '2.5rem',
        minHeight:  '100svh',
      }}>
        {children}
      </main>

    </div>
  )
}