// src/app/api/admin/login/route.ts
import { getIronSession }  from 'iron-session'
import { cookies }         from 'next/headers'
import { NextResponse }    from 'next/server'
import { sessionOptions, SessionData } from '@/lib/session'

export async function POST(request: Request) {
  console.log('ENV CHECK:', process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD?.slice(0, 5))
  try {
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
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

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