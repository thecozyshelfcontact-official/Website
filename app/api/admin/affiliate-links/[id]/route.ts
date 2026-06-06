import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  // If setting as primary, unset others for same product
  if (body.is_primary) {
    const existing = await queryOne('SELECT product_id FROM affiliate_links WHERE id=$1', [params.id])
    if (existing) {
      await query('UPDATE affiliate_links SET is_primary=false WHERE product_id=$1 AND id<>$2',
        [(existing as any).product_id, params.id])
    }
  }
  const link = await queryOne(
    `UPDATE affiliate_links SET label=$1, url=$2, network=$3, commission_rate=$4,
     is_primary=$5, is_active=$6 WHERE id=$7 RETURNING *`,
    [body.label, body.url, body.network || null, body.commission_rate || null,
     body.is_primary || false, body.is_active ?? true, params.id]
  )
  return NextResponse.json(link)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await query('DELETE FROM affiliate_links WHERE id=$1', [params.id])
  return NextResponse.json({ ok: true })
}
