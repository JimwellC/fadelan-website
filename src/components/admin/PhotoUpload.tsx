'use client'

import { useState, useRef, useCallback } from 'react'

export interface UploadedPhoto {
  _key:    string
  _type:   string
  alt:     string
  caption: string
  asset: {
    _type: string
    _ref:  string
  }
  previewUrl: string
}

interface PhotoUploadProps {
  photos:    UploadedPhoto[]
  onChange:  (photos: UploadedPhoto[]) => void
  required?: boolean
}

const ORDER_LABELS = [
  'Front view',
  'Back view',
  'Interior',
  'Hardware / Logo',
  'Scale reference',
  'Flaws / Wear',
]

function generateKey() {
  return Math.random().toString(36).slice(2, 10)
}

export default function PhotoUpload({ photos, onChange, required }: PhotoUploadProps) {
  const [uploading, setUploading]   = useState<string[]>([]) // keys being uploaded
  const [dragOver,  setDragOver]    = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File): Promise<UploadedPhoto | null> {
    const key        = generateKey()
    const previewUrl = URL.createObjectURL(file)

    setUploading(prev => [...prev, key])

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body:   formData,
      })

      if (!res.ok) {
        const err = await res.json()
        console.error('Upload failed:', err)
        return null
      }

      const { assetId, url } = await res.json()

      const photo: UploadedPhoto = {
        _key:    key,
        _type:   'image',
        alt:     '',
        caption: '',
        asset: {
          _type: 'reference',
          _ref:  assetId,
        },
        previewUrl: url ?? previewUrl,
      }

      return photo
    } catch (err) {
      console.error('Upload error:', err)
      return null
    } finally {
      setUploading(prev => prev.filter(k => k !== key))
    }
  }

  async function handleFiles(files: FileList | File[]) {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter(f => f.type.startsWith('image/'))

    if (imageFiles.length === 0) return

    // Upload all concurrently
    const results = await Promise.all(imageFiles.map(uploadFile))
    const uploaded = results.filter((p): p is UploadedPhoto => p !== null)

    onChange([...photos, ...uploaded])
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(e.target.files)
    e.target.value = '' // reset so same file can be re-selected
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  function removePhoto(key: string) {
    onChange(photos.filter(p => p._key !== key))
  }

  function updateAlt(key: string, alt: string) {
    onChange(photos.map(p => p._key === key ? { ...p, alt } : p))
  }

  function movePhoto(key: string, direction: 'up' | 'down') {
    const idx = photos.findIndex(p => p._key === key)
    if (idx === -1) return
    const newPhotos = [...photos]
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= newPhotos.length) return;
    [newPhotos[idx], newPhotos[swapIdx]] = [newPhotos[swapIdx], newPhotos[idx]]
    onChange(newPhotos)
  }

  const isUploading = uploading.length > 0

  return (
    <div>

      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border:          `2px dashed ${dragOver ? '#8B6F47' : 'rgba(139,111,71,0.3)'}`,
          backgroundColor: dragOver ? 'rgba(139,111,71,0.05)' : '#F5F1EC',
          padding:         '2rem',
          textAlign:       'center',
          cursor:          'pointer',
          transition:      'all 200ms ease',
          marginBottom:    '1.5rem',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        <div style={{ marginBottom: '0.75rem' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B6F47" strokeWidth="1.5" style={{ margin: '0 auto' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>

        <p style={{
          fontFamily:    'Inter, system-ui, sans-serif',
          fontSize:      '0.8rem',
          fontWeight:    500,
          color:         '#1A1A1A',
          marginBottom:  '0.25rem',
        }}>
          {isUploading ? `Uploading ${uploading.length} photo${uploading.length > 1 ? 's' : ''}...` : 'Click to upload or drag photos here'}
        </p>
        <p style={{
          fontFamily:  'Inter, system-ui, sans-serif',
          fontSize:    '0.7rem',
          color:       '#4A4A4A',
        }}>
          JPG, PNG, WEBP · Multiple files supported · Uploads instantly
        </p>
      </div>

      {/* Upload order guide */}
      {photos.length === 0 && (
        <div style={{
          display:       'flex',
          gap:           '0.5rem',
          flexWrap:      'wrap',
          marginBottom:  '1rem',
        }}>
          {ORDER_LABELS.map((label, i) => (
            <span key={label} style={{
              fontFamily:      'Inter, system-ui, sans-serif',
              fontSize:        '0.6rem',
              letterSpacing:   '0.08em',
              color:           '#8B6F47',
              backgroundColor: 'rgba(139,111,71,0.08)',
              border:          '1px solid rgba(139,111,71,0.15)',
              padding:         '0.2rem 0.5rem',
            }}>
              {i + 1}. {label}
            </span>
          ))}
        </div>
      )}

      {/* Validation message */}
      {required && photos.length === 0 && (
        <p style={{
          fontFamily:   'Inter, system-ui, sans-serif',
          fontSize:     '0.7rem',
          color:        '#DC2626',
          marginBottom: '1rem',
        }}>
          At least 1 photo is required. Recommended: upload 6 photos in the order shown above.
        </p>
      )}

      {photos.length > 0 && photos.length < 6 && (
        <p style={{
          fontFamily:   'Inter, system-ui, sans-serif',
          fontSize:     '0.7rem',
          color:        '#D97706',
          marginBottom: '1rem',
        }}>
          ⚠️ {photos.length}/6 photos — add more for a complete listing (Front, Back, Interior, Hardware, Scale, Flaws)
        </p>
      )}

      {photos.length >= 6 && (
        <p style={{
          fontFamily:   'Inter, system-ui, sans-serif',
          fontSize:     '0.7rem',
          color:        '#16A34A',
          marginBottom: '1rem',
        }}>
          ✓ {photos.length} photos uploaded
        </p>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap:                 '1rem',
        }}>
          {photos.map((photo, i) => (
            <div key={photo._key} style={{ position: 'relative' }}>

              {/* Image */}
              <div style={{
                aspectRatio:     '3 / 4',
                overflow:        'hidden',
                backgroundColor: '#EDE8E1',
                marginBottom:    '0.5rem',
                position:        'relative',
              }}>
                <img
                  src={photo.previewUrl}
                  alt={photo.alt || `Photo ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Position badge */}
                <div style={{
                  position:        'absolute',
                  top:             '0.375rem',
                  left:            '0.375rem',
                  backgroundColor: i === 0 ? '#8B6F47' : 'rgba(26,26,26,0.7)',
                  color:           '#F5F1EC',
                  fontFamily:      'Inter, system-ui, sans-serif',
                  fontSize:        '0.55rem',
                  fontWeight:      500,
                  padding:         '0.2rem 0.4rem',
                  letterSpacing:   '0.08em',
                }}>
                  {i === 0 ? 'COVER' : `#${i + 1}`}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removePhoto(photo._key)}
                  style={{
                    position:        'absolute',
                    top:             '0.375rem',
                    right:           '0.375rem',
                    width:           '22px',
                    height:          '22px',
                    borderRadius:    '50%',
                    backgroundColor: 'rgba(220,38,38,0.9)',
                    color:           '#FFFFFF',
                    border:          'none',
                    cursor:          'pointer',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    fontSize:        '0.7rem',
                    fontWeight:      700,
                    lineHeight:      1,
                  }}
                >
                  ×
                </button>
              </div>

              {/* Move buttons */}
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.375rem' }}>
                <button
                  type="button"
                  onClick={() => movePhoto(photo._key, 'up')}
                  disabled={i === 0}
                  style={{
                    flex:            1,
                    padding:         '0.2rem',
                    backgroundColor: 'transparent',
                    border:          '1px solid rgba(26,26,26,0.15)',
                    color:           i === 0 ? 'rgba(26,26,26,0.2)' : '#1A1A1A',
                    fontFamily:      'Inter, system-ui, sans-serif',
                    fontSize:        '0.6rem',
                    cursor:          i === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← 
                </button>
                <button
                  type="button"
                  onClick={() => movePhoto(photo._key, 'down')}
                  disabled={i === photos.length - 1}
                  style={{
                    flex:            1,
                    padding:         '0.2rem',
                    backgroundColor: 'transparent',
                    border:          '1px solid rgba(26,26,26,0.15)',
                    color:           i === photos.length - 1 ? 'rgba(26,26,26,0.2)' : '#1A1A1A',
                    fontFamily:      'Inter, system-ui, sans-serif',
                    fontSize:        '0.6rem',
                    cursor:          i === photos.length - 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  →
                </button>
              </div>

              {/* Alt text */}
              <input
                type="text"
                value={photo.alt}
                onChange={e => updateAlt(photo._key, e.target.value)}
                placeholder={ORDER_LABELS[i] ?? `Photo ${i + 1}`}
                style={{
                  width:           '100%',
                  padding:         '0.375rem 0.5rem',
                  border:          '1px solid rgba(26,26,26,0.15)',
                  backgroundColor: '#F5F1EC',
                  fontFamily:      'Inter, system-ui, sans-serif',
                  fontSize:        '0.65rem',
                  color:           '#1A1A1A',
                  outline:         'none',
                  boxSizing:       'border-box' as const,
                }}
              />

            </div>
          ))}
        </div>
      )}

    </div>
  )
}