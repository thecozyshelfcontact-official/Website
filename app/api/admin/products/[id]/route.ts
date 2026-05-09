import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminSession()) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const body = await req.json()
  const p = await queryOne(`UPDATE products SET title=$1,short_description=$2,full_description=$3,
    category_id=$4,images=$5,rating=$6,review_count=$7,price=$8,original_price=$9,
    pros=$10,cons=$11,features=$12,faq=$13,tags=$14,is_featured=$15,is_trending=$16,
    is_active=$17,meta_title=$18,meta_description=$19 WHERE id=$20 RETURNING *`,
    [body.title,body.short_description,body.full_description,body.category_id,
     JSON.stringify(body.images||[]),body.rating,body.review_count,body.price,body.original_price,
     JSON.stringify(body.pros||[]),JSON.stringify(body.cons||[]),JSON.stringify(body.features||[]),
     JSON.stringify(body.faq||[]),body.tags||[],body.is_featured,body.is_trending,
     body.is_active,body.meta_title,body.meta_description,params.id])
  return NextResponse.json(p)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminSession()) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  await query('DELETE FROM products WHERE id=$1', [params.id])
  return NextResponse.json({ ok: true })
}