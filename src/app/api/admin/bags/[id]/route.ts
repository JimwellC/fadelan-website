// src/app/api/admin/bags/[id]/route.ts
import { getIronSession }  from 'iron-session'
import { cookies }         from 'next/headers'
import { NextResponse }    from 'next/server'
import { createClient }    from '@sanity/client'
import { sessionOptions, SessionData } from '@/lib/session'

const writeClient = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn:     false,
  token:      process.env.SANITY_API_WRITE_TOKEN,
})

async function requireAuth() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  )
  if (!session.isLoggedIn) return null
  return session
}

// GET — single bag
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const bag = await writeClient.fetch(
    `*[_type == "bag" && _id == $id][0] {
      _id, name, brand, slug, price, availability,
      condition, color, size, material, hardware,
      dimensions, year, includes, description,
      authenticityNote, shippingNote, dateAdded,
      showWhenSold, seoTitle, seoDescription,
      "photos": photos[] {
        _key, alt, caption,
        asset-> { _id, url }
      }
    }`,
    { id }
  )

  if (!bag) {
    return NextResponse.json({ error: 'Bag not found' }, { status: 404 })
  }

  return NextResponse.json(bag)
}

// PATCH — update bag
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id }  = await params
  const updates = await request.json()

  try {
    const updated = await writeClient
      .patch(id)
      .set(updates)
      .commit()
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update bag' }, { status: 500 })
  }
}

// DELETE — delete bag
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    await writeClient.delete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete bag' }, { status: 500 })
  }
}