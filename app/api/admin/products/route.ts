import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET() {
  const products = await query(`SELECT p.*,c.name as cat_name FROM products p
    LEFT JOIN categories c ON p.category_id=c.id ORDER BY p.created_at DESC`)
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  if (!await getAdminSession()) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const body = await req.json()
  const slug = body.slug || slugify(body.title)
  const p = await queryOne(`INSERT INTO products
    (title,slug,short_description,full_description,category_id,images,rating,review_count,
     price,original_price,pros,cons,features,faq,tags,is_featured,is_trending,meta_title,meta_description)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
    [body.title,slug,body.short_description,body.full_description,body.category_id,
     JSON.stringify(body.images||[]),body.rating||0,body.review_count||0,
     body.price,body.original_price,JSON.stringify(body.pros||[]),JSON.stringify(body.cons||[]),
     JSON.stringify(body.features||[]),JSON.stringify(body.faq||[]),body.tags||[],
     body.is_featured||false,body.is_trending||false,body.meta_title,body.meta_description])
  return NextResponse.json(p, { status:201 })
}