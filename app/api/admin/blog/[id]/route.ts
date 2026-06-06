import { NextRequest, NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'
import { slugify, readingTime } from '@/lib/utils'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const post = await queryOne('SELECT * FROM blog_posts WHERE id=$1', [params.id])
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const slug = body.slug || slugify(body.title)
  const read_time = readingTime(body.content || '')
  const p = await queryOne(
    `UPDATE blog_posts SET title=$1, slug=$2, excerpt=$3, content=$4, cover_image=$5,
     author=$6, category_id=$7, tags=$8, related_product_ids=$9, is_published=$10,
     is_featured=$11, meta_title=$12, meta_description=$13, read_time=$14,
     published_at=CASE WHEN $10 AND published_at IS NULL THEN now() ELSE published_at END
     WHERE id=$15 RETURNING *`,
    [body.title, slug, body.excerpt, body.content, body.cover_image,
     body.author || 'Admin', body.category_id, body.tags || [], body.related_product_ids || [],
     body.is_published || false, body.is_featured || false,
     body.meta_title, body.meta_description, read_time, params.id]
  )
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(p)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await query('DELETE FROM blog_posts WHERE id=$1', [params.id])
  return NextResponse.json({ ok: true })
}
