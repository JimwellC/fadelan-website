// src/app/api/admin/bags/route.ts
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
  if (!session.isLoggedIn) {
    return null
  }
  return session
}

// GET — fetch all bags
export async function GET() {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bags = await writeClient.fetch(`
    *[_type == "bag"] | order(dateAdded desc) {
      _id,
      name,
      brand,
      slug,
      price,
      availability,
      condition,
      color,
      size,
      dateAdded,
      "coverPhoto": photos[0] {
        asset-> { _id, url }
      }
    }
  `)

  return NextResponse.json(bags)
}

// POST — create new bag
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const bag  = await writeClient.create({
      _type:        'bag',
      dateAdded:    new Date().toISOString(),
      availability: 'available',
      ...body,
    })
    return NextResponse.json(bag, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create bag' }, { status: 500 })
  }
}