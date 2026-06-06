import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await queryOne(
    `SELECT p.*, c.name as cat_name FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = $1`,
    [params.id]
  )
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const p = await queryOne(
    `UPDATE products SET title=$1, short_description=$2, full_description=$3,
     category_id=$4, images=$5, rating=$6, review_count=$7, price=$8, original_price=$9,
     pros=$10, cons=$11, features=$12, faq=$13, tags=$14, is_featured=$15,
     is_trending=$16, is_active=$17, meta_title=$18, meta_description=$19, badge=$20
     WHERE id=$21 RETURNING *`,
    [body.title, body.short_description, body.full_description, body.category_id,
     JSON.stringify(body.images || []), body.rating, body.review_count,
     body.price, body.original_price,
     JSON.stringify(body.pros || []), JSON.stringify(body.cons || []),
     JSON.stringify(body.features || []), JSON.stringify(body.faq || []),
     body.tags || [], body.is_featured, body.is_trending, body.is_active,
     body.meta_title, body.meta_description, body.badge || null, params.id]
  )
  return NextResponse.json(p)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await query('DELETE FROM products WHERE id=$1', [params.id])
  return NextResponse.json({ ok: true })
}
