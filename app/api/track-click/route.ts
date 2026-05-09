import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { createHash } from 'crypto'
export async function POST(req: NextRequest) {
  try {
    const { affiliate_link_id, product_id, referer } = await req.json()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const ip_hash = createHash('sha256').update(ip).digest('hex')
    const user_agent = req.headers.get('user-agent') || ''
    await query(
      'INSERT INTO click_events(affiliate_link_id,product_id,ip_hash,user_agent,referer) VALUES($1,$2,$3,$4,$5)',
      [affiliate_link_id, product_id, ip_hash, user_agent, referer])
    return NextResponse.json({ ok: true })
  } catch (e) { return NextResponse.json({ ok:false }, { status:500 }) }
}