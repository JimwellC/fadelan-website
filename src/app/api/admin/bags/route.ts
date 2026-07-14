// src/app/api/admin/bags/route.ts
import { getIronSession }  from 'iron-session'
import { cookies }         from 'next/headers'
import { NextResponse }    from 'next/server'
import { createClient }    from '@sanity/client'
import { sessionOptions, SessionData } from '@/lib/session'
import { toPortableText }  from '@/lib/portableText'
import { revalidateBag }   from '@/lib/revalidate'

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
      // Normalise the admin panel's plain-text description into Portable Text.
      // Must come AFTER the spread so it overrides the raw string in `body` —
      // otherwise <PortableText> receives a string, logs "Unknown block type
      // undefined", and renders nothing on the live detail page.
      description:  toPortableText(body.description),
    })

    // The admin writes to Sanity directly, bypassing Studio and therefore the
    // Studio webhook. Revalidate here so the new bag appears on the public
    // site immediately rather than waiting out the ISR window.
    revalidateBag(bag.slug?.current)

    return NextResponse.json(bag, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create bag' }, { status: 500 })
  }
}