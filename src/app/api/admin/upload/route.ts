// src/app/api/admin/upload/route.ts
import { getIronSession } from 'iron-session'
import { cookies }        from 'next/headers'
import { NextResponse }   from 'next/server'
import { sessionOptions, SessionData } from '@/lib/session'

export async function POST(request: Request) {
  // Auth check
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  )
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData   = await request.formData()
    const file       = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
    const token     = process.env.SANITY_API_WRITE_TOKEN

    const arrayBuffer = await file.arrayBuffer()
    const buffer      = Buffer.from(arrayBuffer)

    const res = await fetch(
      `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${dataset}`,
      {
        method:  'POST',
        headers: {
          'Content-Type':  file.type,
          'Authorization': `Bearer ${token}`,
        },
        body: buffer,
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Sanity upload error:', err)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const data    = await res.json()
    const assetId = data.document._id
    const url     = data.document.url

    return NextResponse.json({ assetId, url })
  } catch (err) {
    console.error('Upload route error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}