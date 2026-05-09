import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!await getAdminSession()) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const body = await req.json()
  const link = await queryOne(
    'INSERT INTO affiliate_links(product_id,label,url,network,commission_rate,is_primary) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
    [body.product_id,body.label,body.url,body.network,body.commission_rate,body.is_primary||false])
  return NextResponse.json(link, { status:201 })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const product_id = searchParams.get('product_id')
  const links = product_id
    ? await query(`SELECT al.*,COUNT(ce.id) as click_count FROM affiliate_links al
        LEFT JOIN click_events ce ON ce.affiliate_link_id=al.id
        WHERE al.product_id=$1 GROUP BY al.id ORDER BY al.is_primary DESC`, [product_id])
    : await query('SELECT * FROM affiliate_links ORDER BY created_at DESC')
  return NextResponse.json(links)
}