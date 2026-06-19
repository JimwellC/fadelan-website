'use client'

import { useState, useEffect } from 'react'

const inputStyle = {
  width:           '100%',
  padding:         '0.75rem 1rem',
  border:          '1px solid rgba(26,26,26,0.2)',
  backgroundColor: '#FFFFFF',
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

const sectionStyle = {
  backgroundColor: '#F5F1EC',
  border:          '1px solid rgba(139,111,71,0.12)',
  padding:         '1.5rem',
}

const sectionHeadingStyle = {
  fontFamily:    '"Cormorant Garamond", Georgia, serif',
  fontSize:      '1.25rem',
  fontWeight:    400,
  color:         '#1A1A1A',
  marginBottom:  '1.5rem',
  paddingBottom: '0.75rem',
  borderBottom:  '1px solid rgba(26,26,26,0.06)',
}

const PAYMENT_OPTIONS = [
  { label: 'GCash',            value: 'gcash'         },
  { label: 'Bank Transfer',    value: 'bank_transfer' },
  { label: 'PayMaya',          value: 'paymaya'       },
  { label: 'Cash on Meetup',   value: 'cash'          },
  { label: 'Installment Plan', value: 'installment'   },
  { label: 'Western Union',    value: 'western_union' },
  { label: 'Wise',             value: 'wise'          },
]

export default function SettingsPage() {
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')

  const [form, setForm] = useState({
    // Brand
    siteName:        '',
    tagline:         '',
    // Homepage
    heroHeadline:    '',
    heroSubline:     '',
    // Contact
    messengerUrl:    '',
    facebookPageUrl: '',
    instagramHandle: '',
    smsNumber:       '',
    contactEmail:    '',
    locationDescription: '',
    // Inquiry templates
    messengerInquiryTemplate: '',
    instagramInquiryTemplate: '',
    smsInquiryTemplate:       '',
    // Shipping
    defaultShippingNote: '',
    paymentMethods:      [] as string[],
  })

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (data) setForm({
          siteName:                 data.siteName                 ?? '',
          tagline:                  data.tagline                  ?? '',
          heroHeadline:             data.heroHeadline             ?? '',
          heroSubline:              data.heroSubline              ?? '',
          messengerUrl:             data.messengerUrl             ?? '',
          facebookPageUrl:          data.facebookPageUrl          ?? '',
          instagramHandle:          data.instagramHandle          ?? '',
          smsNumber:                data.smsNumber                ?? '',
          contactEmail:             data.contactEmail             ?? '',
          locationDescription:      data.locationDescription      ?? '',
          messengerInquiryTemplate: data.messengerInquiryTemplate ?? '',
          instagramInquiryTemplate: data.instagramInquiryTemplate ?? '',
          smsInquiryTemplate:       data.smsInquiryTemplate       ?? '',
          defaultShippingNote:      data.defaultShippingNote      ?? '',
          paymentMethods:           data.paymentMethods           ?? [],
        })
      })
      .catch(err => console.error('Settings load failed:', err))
  }, [])

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function togglePayment(value: string) {
    setForm(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(value)
        ? prev.paymentMethods.filter(v => v !== value)
        : [...prev.paymentMethods, value],
    }))
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

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{
          fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.65rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#8B6F47', marginBottom: '0.375rem',
        }}>
          Configuration
        </p>
        <h1 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '2.25rem', fontWeight: 300, color: '#1A1A1A',
        }}>
          Site Settings
        </h1>
      </div>

      {/* Studio links for image fields */}
      <section style={sectionStyle}>
        <h2 style={sectionHeadingStyle}>Images & Brand Assets</h2>
        <p style={{
          fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem',
          color: '#4A4A4A', lineHeight: 1.7, marginBottom: '1.25rem',
        }}>
          Image uploads are managed in Sanity Studio. Click the links below to go directly to each field.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Homepage Hero Image', desc: 'The large image shown on the homepage hero section' },
            { label: 'Logo',                desc: 'Used in the header and social share previews'       },
            { label: 'Favicon',             desc: 'The small icon shown in browser tabs'               },
            { label: 'Social Share Image',  desc: 'Shown when someone shares the site on Facebook'     },
            { label: 'Founder / Owner Photo', desc: 'Shown in the About page polaroid frame — square crop recommended' },
          ].map(item => (
            <a
              key={item.label}
              href="/studio/structure/siteSettings"
              target="_blank"
              style={{
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'space-between',
                padding:         '0.875rem 1rem',
                backgroundColor: '#FFFFFF',
                border:          '1px solid rgba(26,26,26,0.1)',
                textDecoration:  'none',
                transition:      'border-color 200ms ease',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = '#8B6F47'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(26,26,26,0.1)'}
            >
              <div>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem',
                  fontWeight: 500, color: '#1A1A1A', marginBottom: '0.15rem',
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.65rem', color: '#8C8275',
                }}>
                  {item.desc}
                </p>
              </div>
              <span style={{ color: '#8B6F47', fontSize: '0.75rem' }}>Open in Studio →</span>
            </a>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Brand ── */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Brand</h2>
          <div className="admin-form-grid">
            <div>
              <label style={labelStyle}>Site Name</label>
              <input style={inputStyle} type="text" value={form.siteName}
                onChange={e => set('siteName', e.target.value)}
                placeholder="Fad Élan" />
            </div>
            <div>
              <label style={labelStyle}>Tagline</label>
              <input style={inputStyle} type="text" value={form.tagline}
                onChange={e => set('tagline', e.target.value)}
                placeholder="Curated authentic pre-loved luxury." />
            </div>
          </div>
        </section>

        {/* ── Homepage ── */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Homepage</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Hero Headline</label>
              <input style={inputStyle} type="text" value={form.heroHeadline}
                onChange={e => set('heroHeadline', e.target.value)}
                placeholder="Carried before. Coveted still." />
            </div>
            <div>
              <label style={labelStyle}>Hero Subline</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical' as const }}
                rows={3} value={form.heroSubline}
                onChange={e => set('heroSubline', e.target.value)}
                placeholder="A quiet, curated collection of authenticated pre-loved luxury bags..."
              />
            </div>
          </div>
        </section>

        {/* ── Contact & Social ── */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Contact & Social</h2>
          <div className="admin-form-grid">
            <div>
              <label style={labelStyle}>Messenger URL</label>
              <input style={inputStyle} type="text" value={form.messengerUrl}
                onChange={e => set('messengerUrl', e.target.value)}
                placeholder="https://m.me/fadelan.26" />
            </div>
            <div>
              <label style={labelStyle}>Facebook Page URL</label>
              <input style={inputStyle} type="text" value={form.facebookPageUrl}
                onChange={e => set('facebookPageUrl', e.target.value)}
                placeholder="https://www.facebook.com/fadelan" />
            </div>
            <div>
              <label style={labelStyle}>Instagram Handle</label>
              <input style={inputStyle} type="text" value={form.instagramHandle}
                onChange={e => set('instagramHandle', e.target.value)}
                placeholder="fadelan.26" />
            </div>
            <div>
              <label style={labelStyle}>Text / SMS Number</label>
              <input style={inputStyle} type="text" value={form.smsNumber}
                onChange={e => set('smsNumber', e.target.value)}
                placeholder="+639496206010" />
              <p style={{ fontFamily: 'Inter', fontSize: '0.6rem', color: '#8C8275', marginTop: '0.25rem' }}>
                International format only — e.g. +639496206010
              </p>
            </div>
            <div>
              <label style={labelStyle}>Email Address (optional)</label>
              <input style={inputStyle} type="email" value={form.contactEmail}
                onChange={e => set('contactEmail', e.target.value)}
                placeholder="hello@fadelan.com" />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input style={inputStyle} type="text" value={form.locationDescription}
                onChange={e => set('locationDescription', e.target.value)}
                placeholder="Angeles / Pampanga area, Philippines" />
            </div>
          </div>
        </section>

        {/* ── Inquiry Messages ── */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Inquiry Messages</h2>
          <div style={{
            backgroundColor: 'rgba(139,111,71,0.06)',
            border:          '1px solid rgba(139,111,71,0.15)',
            padding:         '0.75rem 1rem',
            marginBottom:    '1rem',
            display:         'flex',
            gap:             '0.625rem',
          }}>
            <span style={{ fontSize: '0.8rem', flexShrink: 0 }}>💡</span>
            <div>
              <p style={{
                fontFamily:    'Inter, system-ui, sans-serif',
                fontSize:      '0.65rem',
                fontWeight:    600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color:         '#8B6F47',
                marginBottom:  '0.25rem',
              }}>
                How placeholders work
              </p>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize:   '0.7rem',
                color:      '#4A4A4A',
                lineHeight: 1.6,
              }}>
                Use <code style={{ backgroundColor: '#FFFFFF', padding: '0.1rem 0.3rem', border: '1px solid rgba(26,26,26,0.1)' }}>{'{bagName}'}</code> and <code style={{ backgroundColor: '#FFFFFF', padding: '0.1rem 0.3rem', border: '1px solid rgba(26,26,26,0.1)' }}>{'{price}'}</code> in your message templates. These are automatically replaced with the real bag name and price when a customer taps an inquiry button on a bag page.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Messenger Message</label>
              <input style={inputStyle} type="text" value={form.messengerInquiryTemplate}
                onChange={e => set('messengerInquiryTemplate', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Instagram Message</label>
              <input style={inputStyle} type="text" value={form.instagramInquiryTemplate}
                onChange={e => set('instagramInquiryTemplate', e.target.value)} />
              <p style={{ fontFamily: 'Inter', fontSize: '0.6rem', color: '#8C8275', marginTop: '0.25rem' }}>
                Instagram doesn't support pre-filled DMs — this is shown as a copy prompt.
              </p>
            </div>
            <div>
              <label style={labelStyle}>Text / SMS Message</label>
              <input style={inputStyle} type="text" value={form.smsInquiryTemplate}
                onChange={e => set('smsInquiryTemplate', e.target.value)} />
            </div>
          </div>
        </section>

        {/* ── Shipping & Payment ── */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Shipping & Payment</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Default Shipping Note</label>
              <input style={inputStyle} type="text" value={form.defaultShippingNote}
                onChange={e => set('defaultShippingNote', e.target.value)}
                placeholder="Available for personal pickup in Pampanga or nationwide / international shipping." />
              <p style={{ fontFamily: 'Inter', fontSize: '0.6rem', color: '#8C8275', marginTop: '0.25rem' }}>
                Shown on every bag page unless overridden per bag.
              </p>
            </div>
            <div>
              <label style={labelStyle}>Accepted Payment Methods</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                {PAYMENT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => togglePayment(opt.value)}
                    style={{
                      padding:         '0.375rem 0.875rem',
                      backgroundColor: form.paymentMethods.includes(opt.value) ? '#1A1A1A' : 'transparent',
                      border:          `1px solid ${form.paymentMethods.includes(opt.value) ? '#1A1A1A' : 'rgba(26,26,26,0.2)'}`,
                      color:           form.paymentMethods.includes(opt.value) ? '#F5F1EC' : '#1A1A1A',
                      fontFamily:      'Inter, system-ui, sans-serif',
                      fontSize:        '0.7rem',
                      cursor:          'pointer',
                      transition:      'all 150ms ease',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'flex-end', gap: '1rem',
          paddingBottom: '2rem',
        }}>
          {error   && <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: '#DC2626' }}>{error}</p>}
          {success && <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: '#16A34A' }}>{success}</p>}
          <button
            type="submit" disabled={saving}
            style={{
              padding: '0.875rem 2rem',
              backgroundColor: saving ? '#4A4A4A' : '#1A1A1A',
              color: '#F5F1EC',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.7rem', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background-color 200ms ease',
            }}
            onMouseEnter={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#8B6F47' }}
            onMouseLeave={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1A1A1A' }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  )
}