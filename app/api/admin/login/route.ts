import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, signToken } from '@/lib/auth'
export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (username !== process.env.ADMIN_USERNAME)
    return NextResponse.json({ error:'Invalid credentials' }, { status:401 })
  const valid = await verifyPassword(password, "$2a$10$49a88Fm8otrjVTSxnwHJc"+process.env.ADMIN_PASSWORD_HASH!)
  if (!valid) return NextResponse.json({ error:'Invalid credentials' }, { status:401 })
  const token = await signToken({ role:'admin', username })
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', maxAge:60*60*24*7 })
  return res
}