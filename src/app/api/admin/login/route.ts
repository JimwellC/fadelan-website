// src/app/api/admin/login/route.ts
import { getIronSession }  from 'iron-session'
import { cookies }         from 'next/headers'
import { NextResponse }    from 'next/server'
import { sessionOptions, SessionData } from '@/lib/session'

// In-memory lockout state. Resets on every cold start / deploy — acceptable
// tradeoff for a single-admin site with no database beyond Sanity. This is
// NOT for distributed/multi-instance rate limiting, just a basic brute-force
// speed bump for a low-traffic admin login.
const MAX_ATTEMPTS    = 5
const LOCKOUT_MS       = 15 * 60 * 1000 // 15 minutes

let failedAttempts = 0
let lockedUntil: number | null = null

export async function POST(request: Request) {
  try {
    if (lockedUntil && Date.now() < lockedUntil) {
      const minutesLeft = Math.ceil((lockedUntil - Date.now()) / 60000)
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.` },
        { status: 429 }
      )
    }

    if (lockedUntil && Date.now() >= lockedUntil) {
      failedAttempts = 0
      lockedUntil = null
    }

    const { username, password } = await request.json()

    const validUsername = process.env.ADMIN_USERNAME
    const validPassword = process.env.ADMIN_PASSWORD

    if (!validUsername || !validPassword) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (username !== validUsername || password !== validPassword) {
      failedAttempts += 1
      if (failedAttempts >= MAX_ATTEMPTS) {
        lockedUntil = Date.now() + LOCKOUT_MS
      }
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    failedAttempts = 0
    lockedUntil = null

    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    )

    session.isLoggedIn = true
    session.username   = username
    await session.save()

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}