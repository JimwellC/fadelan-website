'use client'

import { useState, useEffect } from 'react'

const inputStyle = {
  width:           '100%',
  padding:         '0.75rem 1rem',
  border:          '1px solid rgba(26,26,26,0.2)',
  backgroundColor: '#F5F1EC',
  fontFamily:      'Inter, system-ui, sans-serif',
  fontSize:        '0.875rem',
  color:           '#1A1A1A',
  outline:         'none',
  boxSizing:       'border-box' as const,
}

const labelStyle = {
  display:       'block' as const,
  fontFamily:    'Inter, system-ui, sans-serif',
  fontSize:      '0.65rem',
  fontWeight:    500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color:         '#4A4A4A',
  marginBottom:  '0.5rem',
}

export default function SettingsPage() {
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')
  const [form, setForm] = useState({
    heroHeadline:    '',
    heroSubline:     '',
    tagline:         '',
    messengerUrl:    '',
    instagramHandle: '',
    viberNumber:     '',
    locationDescription: '',
    messengerInquiryTemplate: '',
    instagramInquiryTemplate: '',
    viberInquiryTemplate:     '',
  })

  useEffect(() => {
  fetch('/api/admin/settings')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    })
    .then(data => {
      if (data) setForm({
        heroHeadline:             data.heroHeadline             ?? '',
        heroSubline:              data.heroSubline              ?? '',
        tagline:                  data.tagline                  ?? '',
        messengerUrl:             data.messengerUrl             ?? '',
        instagramHandle:          data.instagramHandle          ?? '',
        viberNumber:              data.viberNumber              ?? '',
        locationDescription:      data.locationDescription      ?? '',
        messengerInquiryTemplate: data.messengerInquiryTemplate ?? '',
        instagramInquiryTemplate: data.instagramInquiryTemplate ?? '',
        viberInquiryTemplate:     data.viberInquiryTemplate     ?? '',
      })
    })
    .catch(err => console.error('Settings load failed:', err))
}, [])

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/settings', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSuccess('Settings saved!')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

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
          Configuration
        </p>
        <h1 style={{
          fontFamily:  '"Cormorant Garamond", Georgia, serif',
          fontSize:    '2.25rem',
          fontWeight:  300,
          color:       '#1A1A1A',
        }}>
          Site Settings
        </h1>
      </div>

      <p style={{
        fontFamily:   'Inter, system-ui, sans-serif',
        fontSize:     '0.75rem',
        color:        '#8B6F47',
        marginBottom: '1.5rem',
        lineHeight:   1.6,
        backgroundColor: 'rgba(139,111,71,0.08)',
        padding:      '1rem',
        border:       '1px solid rgba(139,111,71,0.2)',
      }}>
        💡 To change the hero image, logo, or favicon, use the{' '}
        <a href="/studio" target="_blank" style={{ color: '#8B6F47', fontWeight: 600 }}>
          Sanity Studio → Site Settings → Homepage
        </a>
        . Image uploads require the full Studio.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Homepage */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border:          '1px solid rgba(139,111,71,0.12)',
          padding:         '1.5rem',
        }}>
          <h2 style={{
            fontFamily:   '"Cormorant Garamond", Georgia, serif',
            fontSize:     '1.25rem',
            fontWeight:   400,
            color:        '#1A1A1A',
            marginBottom: '1.5rem',
            paddingBottom:'0.75rem',
            borderBottom: '1px solid rgba(26,26,26,0.06)',
          }}>
            Homepage
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Hero Headline</label>
              <input style={inputStyle} type="text" value={form.heroHeadline} onChange={e => set('heroHeadline', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Hero Subline</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' as const }} rows={3} value={form.heroSubline} onChange={e => set('heroSubline', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Tagline</label>
              <input style={inputStyle} type="text" value={form.tagline} onChange={e => set('tagline', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border:          '1px solid rgba(139,111,71,0.12)',
          padding:         '1.5rem',
        }}>
          <h2 style={{
            fontFamily:   '"Cormorant Garamond", Georgia, serif',
            fontSize:     '1.25rem',
            fontWeight:   400,
            color:        '#1A1A1A',
            marginBottom: '1.5rem',
            paddingBottom:'0.75rem',
            borderBottom: '1px solid rgba(26,26,26,0.06)',
          }}>
            Contact & Social
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Messenger URL</label>
              <input style={inputStyle} type="text" value={form.messengerUrl} onChange={e => set('messengerUrl', e.target.value)} placeholder="https://m.me/fadelan.26" />
            </div>
            <div>
              <label style={labelStyle}>Instagram Handle</label>
              <input style={inputStyle} type="text" value={form.instagramHandle} onChange={e => set('instagramHandle', e.target.value)} placeholder="fadelan.26" />
            </div>
            <div>
              <label style={labelStyle}>Viber Number</label>
              <input style={inputStyle} type="text" value={form.viberNumber} onChange={e => set('viberNumber', e.target.value)} placeholder="+639171234567" />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input style={inputStyle} type="text" value={form.locationDescription} onChange={e => set('locationDescription', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Inquiry templates */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border:          '1px solid rgba(139,111,71,0.12)',
          padding:         '1.5rem',
        }}>
          <h2 style={{
            fontFamily:   '"Cormorant Garamond", Georgia, serif',
            fontSize:     '1.25rem',
            fontWeight:   400,
            color:        '#1A1A1A',
            marginBottom: '0.5rem',
            paddingBottom:'0.75rem',
            borderBottom: '1px solid rgba(26,26,26,0.06)',
          }}>
            Inquiry Messages
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#4A4A4A', marginBottom: '1rem' }}>
            Use <code style={{ backgroundColor: '#F5F1EC', padding: '0.1rem 0.3rem' }}>{'{bagName}'}</code> and <code style={{ backgroundColor: '#F5F1EC', padding: '0.1rem 0.3rem' }}>{'{price}'}</code> as placeholders.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Messenger Message</label>
              <input style={inputStyle} type="text" value={form.messengerInquiryTemplate} onChange={e => set('messengerInquiryTemplate', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Instagram Message</label>
              <input style={inputStyle} type="text" value={form.instagramInquiryTemplate} onChange={e => set('instagramInquiryTemplate', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Viber Message</label>
              <input style={inputStyle} type="text" value={form.viberInquiryTemplate} onChange={e => set('viberInquiryTemplate', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
          {error   && <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: '#DC2626' }}>{error}</p>}
          {success && <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: '#16A34A' }}>{success}</p>}
          <button
            type="submit"
            disabled={saving}
            style={{
              padding:         '0.875rem 2rem',
              backgroundColor: saving ? '#4A4A4A' : '#1A1A1A',
              color:           '#F5F1EC',
              fontFamily:      'Inter, system-ui, sans-serif',
              fontSize:        '0.7rem',
              fontWeight:      500,
              letterSpacing:   '0.15em',
              textTransform:   'uppercase',
              border:          'none',
              cursor:          saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  )
}