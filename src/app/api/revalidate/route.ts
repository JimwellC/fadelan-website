import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  // Verify the secret token
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
      // Revalidate the catalog page
      revalidatePath('/catalog')

      // Revalidate the specific bag detail page if slug exists
      if (slug?.current) {
        revalidatePath(`/bag/${slug.current}`)
      }
    }

    if (_type === 'siteSettings') {
      // Site settings affect every page
      revalidatePath('/', 'layout')
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating', error },
      { status: 500 }
    )
  }
}
