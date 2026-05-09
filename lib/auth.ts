import { SignJWT, jwtVerify } from 'jose'
import { compare, hash } from 'bcryptjs'
import { cookies } from 'next/headers'

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!)

export async function signToken(payload: object) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret())
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload
  } catch { return null }
}

export async function hashPassword(password: string) {
  return hash(password, 10)
}

export async function verifyPassword(password: string, hashed: string) {
  return compare(password, hashed)
}

export async function getAdminSession() {
  const token = cookies().get('admin_token')?.value
  if (!token) return null
  return verifyToken(token)
}