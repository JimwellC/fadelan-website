// src/app/api/admin/bags/[id]/route.ts
import { getIronSession }  from 'iron-session'
import { cookies }         from 'next/headers'
import { NextResponse }    from 'next/server'
import { createClient }    from '@sanity/client'
import { sessionOptions, SessionData } from '@/lib/session'
import { toPortableText, fromPortableText } from '@/lib/portableText'
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

  // Flatten Portable Text -> plain text for the admin panel's <textarea>.
  // A description written in Sanity Studio is an array of blocks; handing that
  // straight to a textarea renders "[object Object]" and destroys the content
  // on save. Flattening lets the client edit Studio-authored copy safely.
  return NextResponse.json({
    ...bag,
    description: fromPortableText(bag.description),
  })
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

  // Normalise the plain-text description from the admin textarea back into
  // Portable Text before writing. Without this the field is saved as a raw
  // string, <PortableText> logs "Unknown block type undefined", and the
  // description renders as NOTHING on the live detail page.
  //
  // Guarded by an `in` check so a partial patch (e.g. only availability)
  // doesn't blank out an existing description.
  if ('description' in updates) {
    updates.description = toPortableText(updates.description)
  }

  try {
    const updated = await writeClient
      .patch(id)
      .set(updates)
      .commit()

    // Push the change live immediately — the admin bypasses the Studio
    // webhook, so without this an edit (e.g. marking a bag sold) would sit
    // behind the ISR cache.
    revalidateBag(updated.slug?.current)

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
    // Grab the slug BEFORE deleting so we can revalidate the detail page —
    // once the document is gone we can't look it up.
    const existing = await writeClient.fetch<{ slug?: { current?: string } } | null>(
      `*[_type == "bag" && _id == $id][0]{ slug }`,
      { id }
    )

    await writeClient.delete(id)

    revalidateBag(existing?.slug?.current)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete bag' }, { status: 500 })
  }
}