'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoUpload, { type UploadedPhoto } from './PhotoUpload'

const BRANDS = [
  { label: 'Hermès',              value: 'hermes'         },
  { label: 'Chanel',              value: 'chanel'         },
  { label: 'Louis Vuitton',       value: 'louis_vuitton'  },
  { label: 'Dior',                value: 'dior'           },
  { label: 'Gucci',               value: 'gucci'          },
  { label: 'Celine',              value: 'celine'         },
  { label: 'Prada',               value: 'prada'          },
  { label: 'YSL / Saint Laurent', value: 'ysl'            },
  { label: 'Bottega Veneta',      value: 'bottega_veneta' },
  { label: 'Fendi',               value: 'fendi'          },
  { label: 'Goyard',              value: 'goyard'         },
  { label: 'Loewe',               value: 'loewe'          },
  { label: 'Balenciaga',          value: 'balenciaga'     },
  { label: 'Burberry',            value: 'burberry'       },
  { label: 'Valentino',           value: 'valentino'      },
  { label: 'Givenchy',            value: 'givenchy'       },
  { label: 'Coach',               value: 'coach'          },
  { label: 'Michael Kors',        value: 'michael_kors'   },
  { label: 'Kate Spade',          value: 'kate_spade'     },
  { label: 'Other',               value: 'other'          },
]

const CONDITIONS = [
  { label: 'Brand New — never used, original tags attached',              value: 'brand_new' },
  { label: 'Like New — barely used, no visible wear',                    value: 'like_new'  },
  { label: 'Excellent — light signs, only visible on close inspection',  value: 'excellent' },
  { label: 'Very Good — some visible wear but still beautiful',          value: 'very_good' },
  { label: 'Good — clearly visible wear, priced to reflect it honestly', value: 'good'      },
]

const COLORS = [
  'black','brown','beige','white','cream','red','pink',
  'purple','blue','green','yellow','orange','gold','silver','multi','canvas','other',
]

const SIZES = [
  { label: 'Mini — under 15cm',     value: 'mini'      },
  { label: 'Small — 15 to 20cm',    value: 'small'     },
  { label: 'Medium — 20 to 30cm',   value: 'medium'    },
  { label: 'Large — 30 to 40cm',    value: 'large'     },
  { label: 'Oversized — over 40cm', value: 'oversized' },
]

const INCLUDES_OPTIONS = [
  { label: 'Dust bag',            value: 'dust_bag'   },
  { label: 'Original box',        value: 'box'        },
  { label: 'Authenticity card',   value: 'auth_card'  },
  { label: 'Original receipt',    value: 'receipt'    },
  { label: 'Mirror',              value: 'mirror'     },
  { label: 'Lock and key',        value: 'lock_key'   },
  { label: 'Removable strap',     value: 'strap'      },
  { label: 'Clochette',           value: 'clochette'  },
  { label: 'Twilly / scarf',      value: 'twilly'     },
  { label: 'Rain cover',          value: 'rain_cover' },
  { label: 'Booklet / care card', value: 'booklet'    },
]

const STATUS_OPTIONS = [
  { value: 'available', label: '🟢 Available', desc: 'Open for inquiries'    },
  { value: 'reserved',  label: '🟡 Reserved',  desc: 'Down payment received' },
  { value: 'on_hold',   label: '🟠 On Hold',   desc: 'Temporarily held'      },
  { value: 'sold',      label: '⚫ Sold',      desc: 'Fully paid & released' },
]

interface BagFormProps {
  initialData?: any
  bagId?:       string
  mode:         'new' | 'edit'
}

const inputStyle = {
  width:           '100%',
  padding:         '0.75rem 1rem',
  border:          '1px solid rgba(26,26,26,0.15)',
  backgroundColor: '#FFFFFF',        // ← white inputs
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
  padding:         'clamp(1rem, 3vw, 1.5rem)',
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

function generateSlug(brand: string, name: string): string {
  return `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function BagForm({ initialData, bagId, mode }: BagFormProps) {
  const router = useRouter()
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  const [photos, setPhotos] = useState<UploadedPhoto[]>(
    (initialData?.photos ?? []).map((p: any) => ({
      _key:       p._key ?? Math.random().toString(36).slice(2),
      _type:      'image',
      alt:        p.alt ?? '',
      caption:    p.caption ?? '',
      asset:      p.asset?._id
        ? { _type: 'reference', _ref: p.asset._id }
        : p.asset,
      previewUrl: p.asset?.url ?? '',
    }))
  )

  const [form, setForm] = useState({
    name:             initialData?.name             ?? '',
    brand:            initialData?.brand            ?? '',
    price:            initialData?.price            ?? '',
    availability:     initialData?.availability     ?? 'available',
    condition:        initialData?.condition        ?? '',
    color:            initialData?.color            ?? '',
    size:             initialData?.size             ?? '',
    material:         initialData?.material         ?? '',
    hardware:         initialData?.hardware         ?? '',
    dimensions:       initialData?.dimensions       ?? '',
    year:             initialData?.year             ?? '',
    includes:         Array.isArray(initialData?.includes) ? initialData.includes : [],
    description:      initialData?.description      ?? '',
    authenticityNote: initialData?.authenticityNote ?? '',
    shippingNote:     initialData?.shippingNote     ?? '',
    showWhenSold:     initialData?.showWhenSold     ?? false,
  })

  const slugPreview = generateSlug(form.brand, form.name)
  const slugUrl     = slugPreview ? `/bag/${slugPreview}` : ''

  function set(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function toggleIncludes(value: string) {
    setForm(prev => ({
      ...prev,
      includes: prev.includes.includes(value)
        ? prev.includes.filter((v: string) => v !== value)
        : [...prev.includes, value],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (photos.length === 0) {
      setError('Please upload at least one photo before publishing.')
      return
    }

    setSaving(true)

    const payload = {
      ...form,
      price:  Number(form.price),
      slug:   { _type: 'slug', current: slugPreview },
      photos: photos.map(({ previewUrl, ...p }) => p),
    }

    try {
      const url    = mode === 'new' ? '/api/admin/bags' : `/api/admin/bags/${bagId}`
      const method = mode === 'new' ? 'POST' : 'PATCH'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      if (mode === 'new') {
        setSuccess('Bag created successfully!')
        setTimeout(() => router.push('/admin/bags'), 1500)
      } else {
        setSuccess('Changes saved!')
        setTimeout(() => router.push('/admin/bags'), 1000)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* ── Basic Info ── */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Basic Information</h2>
          <div className="admin-form-grid">

            <div className="admin-form-full">
              <label style={labelStyle}>Bag Name *</label>
              <input
                style={inputStyle} type="text" value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder='E.g. "Classic Flap, Medium" — do not include brand'
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Brand *</label>
              <select style={inputStyle} value={form.brand} onChange={e => set('brand', e.target.value)} required>
                <option value="">Select brand...</option>
                {BRANDS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Price (₱ PHP) *</label>
              <input
                style={inputStyle} type="number" value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="85000" min="1" required
              />
            </div>

            {/* Slug preview */}
            <div className="admin-form-full">
              <label style={labelStyle}>Page URL (auto-generated)</label>
              <div className="admin-slug-preview">
                {slugUrl
                  ? <>fadelan-website.vercel.app<strong>{slugUrl}</strong></>
                  : <span style={{ opacity: 0.4 }}>Enter a brand and bag name to preview the URL</span>
                }
              </div>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize:   '0.6rem',
                color:      '#8C8275',
                marginTop:  '0.375rem',
                lineHeight: 1.5,
              }}>
                Auto-generated from brand + name. No need to edit.
              </p>
            </div>

          </div>
        </section>

        {/* ── Status ── */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Status</h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value} type="button"
                onClick={() => set('availability', opt.value)}
                style={{
                  flex:            '1 1 120px',
                  padding:         '0.875rem',
                  backgroundColor: form.availability === opt.value ? '#1A1A1A' : 'transparent',
                  border:          `1px solid ${form.availability === opt.value ? '#1A1A1A' : 'rgba(26,26,26,0.2)'}`,
                  color:           form.availability === opt.value ? '#F5F1EC' : '#1A1A1A',
                  fontFamily:      'Inter, system-ui, sans-serif',
                  cursor:          'pointer', textAlign: 'left' as const,
                  transition:      'all 150ms ease',
                }}
              >
                <p style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.2rem' }}>{opt.label}</p>
                <p style={{ fontSize: '0.6rem', opacity: 0.7 }}>{opt.desc}</p>
              </button>
            ))}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', cursor: 'pointer' }}>
            <input
              type="checkbox" checked={form.showWhenSold}
              onChange={e => set('showWhenSold', e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#8B6F47' }}
            />
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8rem', color: '#4A4A4A' }}>
              Show in Recently Sold section after it sells
            </span>
          </label>
        </section>

        {/* ── Details ── */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Details</h2>
          <div className="admin-form-grid">

            <div>
              <label style={labelStyle}>Condition *</label>
              <select style={inputStyle} value={form.condition} onChange={e => set('condition', e.target.value)} required>
                <option value="">Select condition...</option>
                {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Main Color *</label>
              <select style={inputStyle} value={form.color} onChange={e => set('color', e.target.value)} required>
                <option value="">Select color...</option>
                {COLORS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Size *</label>
              <select style={inputStyle} value={form.size} onChange={e => set('size', e.target.value)} required>
                <option value="">Select size...</option>
                {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Material (optional)</label>
              <input style={inputStyle} type="text" value={form.material}
                onChange={e => set('material', e.target.value)}
                placeholder="E.g. Caviar Leather, Lambskin" />
            </div>

            <div>
              <label style={labelStyle}>Hardware (optional)</label>
              <input style={inputStyle} type="text" value={form.hardware}
                onChange={e => set('hardware', e.target.value)}
                placeholder="E.g. Gold, Silver, Ruthenium" />
            </div>

            <div>
              <label style={labelStyle}>Dimensions (optional)</label>
              <input style={inputStyle} type="text" value={form.dimensions}
                onChange={e => set('dimensions', e.target.value)}
                placeholder="E.g. 25 × 16 × 7 cm" />
            </div>

            <div>
              <label style={labelStyle}>Year / Series (optional)</label>
              <input style={inputStyle} type="text" value={form.year}
                onChange={e => set('year', e.target.value)}
                placeholder="E.g. 2021" />
            </div>

            <div className="admin-form-full">
              <label style={labelStyle}>What comes with this bag?</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                {INCLUDES_OPTIONS.map(opt => (
                  <button
                    key={opt.value} type="button"
                    onClick={() => toggleIncludes(opt.value)}
                    style={{
                      padding:         '0.375rem 0.75rem',
                      backgroundColor: form.includes.includes(opt.value) ? '#1A1A1A' : 'transparent',
                      border:          `1px solid ${form.includes.includes(opt.value) ? '#1A1A1A' : 'rgba(26,26,26,0.2)'}`,
                      color:           form.includes.includes(opt.value) ? '#F5F1EC' : '#1A1A1A',
                      fontFamily:      'Inter, system-ui, sans-serif',
                      fontSize:        '0.7rem', cursor: 'pointer',
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

        {/* ── Photos ── */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Photos *</h2>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.7rem',
            color: '#4A4A4A', marginBottom: '1.25rem', lineHeight: 1.6,
          }}>
            Upload at least 6 photos in order: <strong>Front → Back → Interior → Hardware → Scale → Flaws</strong>.
            The first photo is the listing cover. Photos upload instantly.
          </p>
          <PhotoUpload photos={photos} onChange={setPhotos} required={true} />
        </section>

        {/* ── Notes ── */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Description & Notes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div>
              <label style={labelStyle}>Description (optional)</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical' as const }}
                rows={5}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the bag — style, history, why it's special. This appears on the bag detail page."
                maxLength={1000}
              />
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize:   '0.6rem',
                color:      '#8C8275',
                marginTop:  '0.375rem',
              }}>
                {form.description.length}/1000 characters
              </p>
            </div>

            <div>
              <label style={labelStyle}>Authenticity Note (optional)</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical' as const }}
                rows={3}
                value={form.authenticityNote}
                onChange={e => set('authenticityNote', e.target.value)}
                placeholder='E.g. "Authenticated in-house. Serial code matches production year."'
                maxLength={500}
              />
            </div>

            <div>
              <label style={labelStyle}>Special Delivery Note (optional)</label>
              <input
                style={inputStyle} type="text"
                value={form.shippingNote}
                onChange={e => set('shippingNote', e.target.value)}
                placeholder='Leave blank for site default. E.g. "Pickup only — no courier."'
                maxLength={200}
              />
            </div>

          </div>
        </section>

        {/* ── Submit ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem', flexWrap: 'wrap', paddingBottom: '2rem',
        }}>
          <a href="/admin/bags" style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.7rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#4A4A4A', textDecoration: 'none',
          }}>
            ← Back to bags
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {error   && <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: '#DC2626' }}>{error}</p>}
            {success && <p style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: '#16A34A' }}>{success}</p>}
            <button
              type="submit" disabled={saving}
              style={{
                padding: '0.875rem 1.75rem',
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
              {saving ? 'Saving...' : mode === 'new' ? 'Publish Bag' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </form>
  )
}