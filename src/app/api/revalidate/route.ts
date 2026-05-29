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
        revalidatePath(`/bag/${slug.current}`)
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
