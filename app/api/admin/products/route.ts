import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')

  let sql = `SELECT p.*, c.name as cat_name FROM products p
    LEFT JOIN categories c ON p.category_id = c.id`
  const params: any[] = []

  const wheres: string[] = []
  if (search) {
    params.push(`%${search}%`)
    wheres.push(`(p.title ILIKE $${params.length} OR p.short_description ILIKE $${params.length})`)
  }
  if (category) {
    params.push(category)
    wheres.push(`c.slug = $${params.length}`)
  }

  if (wheres.length) sql += ' WHERE ' + wheres.join(' AND ')
  sql += ' ORDER BY p.created_at DESC'

  const products = await query(sql, params)
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const slug = body.slug || slugify(body.title)
  const p = await queryOne(
    `INSERT INTO products
      (title, slug, short_description, full_description, category_id, images,
       rating, review_count, price, original_price, pros, cons, features, faq,
       tags, is_featured, is_trending, is_active, meta_title, meta_description, badge)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
     RETURNING *`,
    [body.title, slug, body.short_description, body.full_description, body.category_id || null,
     JSON.stringify(body.images || []), body.rating || 0, body.review_count || 0,
     body.price, body.original_price || null,
     JSON.stringify(body.pros || []), JSON.stringify(body.cons || []),
     JSON.stringify(body.features || []), JSON.stringify(body.faq || []),
     body.tags || [], body.is_featured || false, body.is_trending || false,
     body.is_active ?? true, body.meta_title || null, body.meta_description || null,
     body.badge || null]
  )
  return NextResponse.json(p, { status: 201 })
}
