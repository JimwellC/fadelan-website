// src/lib/session.ts
import { SessionOptions } from 'iron-session'

export interface SessionData {
  isLoggedIn: boolean
  username:   string
}

export const sessionOptions: SessionOptions = {
  password:    process.env.ADMIN_SESSION_SECRET ?? 'fallback-secret-change-this-in-production-32chars',
  cookieName:  'fadelan_admin_session',
  cookieOptions: {
    secure:   process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7, // 7 days
  },
}