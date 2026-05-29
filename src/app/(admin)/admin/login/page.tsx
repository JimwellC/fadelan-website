'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      })

      if (res.ok) {
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Invalid credentials')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight:       '100svh',
      backgroundColor: '#F5F1EC',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      padding:         '1.5rem',
    }}>
      <div style={{
        width:     '100%',
        maxWidth:  '400px',
      }}>

        {/* Logo / wordmark */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{
            fontFamily:    '"Cormorant Garamond", Georgia, serif',
            fontSize:      '2rem',
            fontWeight:    300,
            letterSpacing: '0.15em',
            color:         '#1A1A1A',
            marginBottom:  '0.375rem',
          }}>
            Fad Élan
          </p>
          <p style={{
            fontFamily:    'Inter, system-ui, sans-serif',
            fontSize:      '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         '#8B6F47',
          }}>
            Content Manager
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border:          '1px solid rgba(139,111,71,0.15)',
          padding:         '2.5rem',
        }}>

          <h1 style={{
            fontFamily:   '"Cormorant Garamond", Georgia, serif',
            fontSize:     '1.5rem',
            fontWeight:   300,
            color:        '#1A1A1A',
            marginBottom: '2rem',
            textAlign:    'center',
          }}>
            Sign in
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div>
              <label style={{
                display:       'block',
                fontFamily:    'Inter, system-ui, sans-serif',
                fontSize:      '0.65rem',
                fontWeight:    500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color:         '#4A4A4A',
                marginBottom:  '0.5rem',
              }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                style={{
                  width:           '100%',
                  padding:         '0.75rem 1rem',
                  border:          '1px solid rgba(26,26,26,0.2)',
                  backgroundColor: '#F5F1EC',
                  fontFamily:      'Inter, system-ui, sans-serif',
                  fontSize:        '0.875rem',
                  color:           '#1A1A1A',
                  outline:         'none',
                  boxSizing:       'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#8B6F47'}
                onBlur={e  => e.target.style.borderColor = 'rgba(26,26,26,0.2)'}
              />
            </div>

            <div>
              <label style={{
                display:       'block',
                fontFamily:    'Inter, system-ui, sans-serif',
                fontSize:      '0.65rem',
                fontWeight:    500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color:         '#4A4A4A',
                marginBottom:  '0.5rem',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width:           '100%',
                  padding:         '0.75rem 1rem',
                  border:          '1px solid rgba(26,26,26,0.2)',
                  backgroundColor: '#F5F1EC',
                  fontFamily:      'Inter, system-ui, sans-serif',
                  fontSize:        '0.875rem',
                  color:           '#1A1A1A',
                  outline:         'none',
                  boxSizing:       'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#8B6F47'}
                onBlur={e  => e.target.style.borderColor = 'rgba(26,26,26,0.2)'}
              />
            </div>

            {error && (
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize:   '0.8rem',
                color:      '#DC2626',
                textAlign:  'center',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width:           '100%',
                padding:         '0.875rem',
                backgroundColor: loading ? '#4A4A4A' : '#1A1A1A',
                color:           '#F5F1EC',
                fontFamily:      'Inter, system-ui, sans-serif',
                fontSize:        '0.7rem',
                fontWeight:      500,
                letterSpacing:   '0.15em',
                textTransform:   'uppercase',
                border:          'none',
                cursor:          loading ? 'not-allowed' : 'pointer',
                transition:      'background-color 300ms ease',
                marginTop:       '0.5rem',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#8B6F47' }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1A1A1A' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>
        </div>

        <p style={{
          textAlign:   'center',
          marginTop:   '1.5rem',
          fontFamily:  'Inter, system-ui, sans-serif',
          fontSize:    '0.65rem',
          color:       'rgba(26,26,26,0.4)',
          letterSpacing: '0.05em',
        }}>
          Fad Élan · Content Manager · Private access only
        </p>

      </div>
    </div>
  )
}