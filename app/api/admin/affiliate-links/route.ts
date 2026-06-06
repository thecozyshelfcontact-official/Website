import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const product_id = searchParams.get('product_id')
  const links = product_id
    ? await query(
        `SELECT al.*, COALESCE(COUNT(ce.id), 0)::int as click_count
         FROM affiliate_links al
         LEFT JOIN click_events ce ON ce.affiliate_link_id = al.id
         WHERE al.product_id = $1
         GROUP BY al.id
         ORDER BY al.is_primary DESC, al.created_at ASC`,
        [product_id]
      )
    : await query(
        `SELECT al.*, COALESCE(COUNT(ce.id), 0)::int as click_count, p.title as product_title
         FROM affiliate_links al
         LEFT JOIN click_events ce ON ce.affiliate_link_id = al.id
         LEFT JOIN products p ON al.product_id = p.id
         GROUP BY al.id, p.title
         ORDER BY al.created_at DESC`
      )
  return NextResponse.json(links)
}

export async function POST(req: NextRequest) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  // If this is marked primary, unset others for this product
  if (body.is_primary) {
    await query(
      'UPDATE affiliate_links SET is_primary = false WHERE product_id = $1',
      [body.product_id]
    )
  }
  const link = await queryOne(
    `INSERT INTO affiliate_links(product_id, label, url, network, commission_rate, is_primary, is_active)
     VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [body.product_id, body.label, body.url, body.network || null,
     body.commission_rate || null, body.is_primary || false, body.is_active ?? true]
  )
  return NextResponse.json(link, { status: 201 })
}
