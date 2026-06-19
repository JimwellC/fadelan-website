// src/app/api/admin/settings/route.ts
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
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.isLoggedIn) return null
  return session
}

export async function GET() {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await writeClient.fetch(`
  *[_type == "siteSettings"][0] {
    siteName, tagline,
    heroHeadline, heroSubline,
    messengerUrl, facebookPageUrl,
    instagramHandle, smsNumber,
    contactEmail, locationDescription,
    messengerInquiryTemplate,
    instagramInquiryTemplate,
    smsInquiryTemplate,
    defaultShippingNote,
    paymentMethods
  }
`)

  return NextResponse.json(settings)
}

export async function PATCH(request: Request) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const updates = await request.json()

  try {
    const updated = await writeClient
      .patch({ query: '*[_type == "siteSettings"][0]' })
      .set(updates)
      .commit()
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}