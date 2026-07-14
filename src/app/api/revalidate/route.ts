// src/app/api/revalidate/route.ts
//
// Called by the Sanity webhook when content is published in Studio, so the
// public site refreshes immediately instead of waiting for the ISR timer.
//
// NOTE: the custom admin panel writes to Sanity directly via `writeClient`
// and does NOT go through Studio — so it never triggers this webhook. The
// admin API routes call `revalidatePath` themselves for that reason.

import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { _type, slug } = body

    if (_type === 'bag') {
      revalidatePath('/catalog')
      revalidatePath('/')
      if (slug?.current) {
        // FIXED: the bag detail route is /catalog/[slug], not /bag/[slug].
        // The old path revalidated a route that doesn't exist, so publishing
        // a bag never actually refreshed its detail page.
        revalidatePath(`/catalog/${slug.current}`)
      }
    }

    if (_type === 'siteSettings') {
      // Revalidate every page — site settings affect all of them
      revalidatePath('/', 'layout')
      revalidatePath('/')
      revalidatePath('/catalog')
      revalidatePath('/about')
      revalidatePath('/contact')
      revalidatePath('/how-to-buy')
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating', error },
      { status: 500 }
    )
  }
}